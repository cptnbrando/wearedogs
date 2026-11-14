import { writable } from 'svelte/store';
import {
  SAVE_VERSION,
  SAVE_KEY,
  TICK_MS,
  SAVE_INTERVAL_MS,
  DAY_LENGTH_SEC,
  NIGHT_START,
  OFFLINE_CAP_SEC,
  OFFLINE_RATE,
  BASE_CLICK_VALUE,
  EMPLOYEE_INCOME,
  JANITOR_INCOME,
  SLOTS_PER_FLOOR,
  CHAIR_BONUS,
  CAFE_BONUS,
  RESTROOM_BONUS,
  SHOP_ITEMS,
  GOALS,
  EXTRA_GOAL_BASE,
  EXTRA_GOAL_GROWTH,
  FLIER_GAP_MIN_TICKS,
  FLIER_GAP_MAX_TICKS,
  FLIER_FIRST_TICKS,
  FLIER_FLIGHT_TICKS,
  BOON_CASH_FLOOR,
  BOONS,
  BUY_MODES,
  MAX_BULK_BUY,
} from './dogsIncConfig.js';
import { encodeSave } from './dogsIncSaveCode.js';

const MS_PER_SEC = 1000;
const THOUSAND = 1000;
const MONEY_SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi'];
const MONEY_DECIMALS_SMALL = 2;
const MONEY_DECIMALS_LARGE = 1;
const MONEY_DECIMAL_CUTOFF = 10;
const TICKS_PER_SEC = MS_PER_SEC / TICK_MS;
const NO_MULT = 1;

/**
 * Short money label for the HUD: $950, $1.25K, $3.40M, ...
 * @param {number} amount
 * @returns {string}
 */
export function formatMoney(amount) {
  const whole = Math.floor(amount);
  if (whole < THOUSAND) return '$' + whole;
  let scaled = whole;
  let index = 0;
  while (scaled >= THOUSAND && index < MONEY_SUFFIXES.length - 1) {
    scaled /= THOUSAND;
    index += 1;
  }
  const decimals = scaled < MONEY_DECIMAL_CUTOFF ? MONEY_DECIMALS_SMALL : MONEY_DECIMALS_LARGE;
  return '$' + scaled.toFixed(decimals) + MONEY_SUFFIXES[index];
}

/** @returns {Object<string, number>} every shop item id set to 0 */
function zeroOwned() {
  const owned = {};
  SHOP_ITEMS.forEach((item) => {
    owned[item.id] = 0;
  });
  return owned;
}

/**
 * Fresh save-state. Everything here must be JSON-safe.
 * @returns {{v:number,cash:number,lifetimeCash:number,clicks:number,nights:number,clock:number,goalsDone:number,owned:Object<string,number>,savedAt:number}}
 */
function freshState() {
  return {
    v: SAVE_VERSION,
    cash: 0,
    lifetimeCash: 0,
    clicks: 0,
    nights: 0,
    clock: 0,
    goalsDone: 0,
    bones: 0,
    owned: zeroOwned(),
    savedAt: 0,
  };
}

/**
 * Reads the saved game. Returns null when there is no usable save (missing,
 * corrupt, blocked storage, or an older save version).
 * @returns {ReturnType<typeof freshState> | null}
 */
function readSave() {
  let data = null;
  try {
    data = JSON.parse(localStorage.getItem(SAVE_KEY));
  } catch (err) {
    return null; // blocked or corrupt storage: start a fresh game
  }
  if (!data || data.v !== SAVE_VERSION) return null;
  const state = freshState();
  Object.keys(state).forEach((key) => {
    if (key in data) state[key] = data[key];
  });
  state.owned = Object.assign(zeroOwned(), data.owned);
  return state;
}

/** @returns {number} ticks until the next golden bone */
function randomGap() {
  return FLIER_GAP_MIN_TICKS + Math.floor(Math.random() * (FLIER_GAP_MAX_TICKS - FLIER_GAP_MIN_TICKS));
}

/** @returns {object} a boon from BOONS, picked by weight */
function rollBoon() {
  const totalWeight = BOONS.reduce((sum, boon) => sum + boon.weight, 0);
  let roll = Math.random() * totalWeight;
  for (let i = 0; i < BOONS.length; i += 1) {
    roll -= BOONS[i].weight;
    if (roll < 0) return BOONS[i];
  }
  return BOONS[0];
}

/**
 * Game core for DOGS INC. Owns all state and rules; the Svelte shell only
 * calls click() / buy() and renders the published snapshot.
 */
export class DogsIncEngine {
  constructor() {
    const saved = readSave();
    this.state = saved || freshState();
    this.frame = 0;
    this.saveAccumulator = 0;
    this.timer = null;
    this.welcomeGain = 0;
    this.flier = null;
    this.nextFlierAt = FLIER_FIRST_TICKS;
    this.boost = null;
    this.event = null;
    this.eventSeq = 0;
    this.buyCount = BUY_MODES[0].count;
    this.buyMode = BUY_MODES[0].id;
    // Save the moment the page is hidden or closed (tab switch, refresh, app switch on a
    // phone), not just on the 5-second timer.
    this.saveOnHide = () => {
      if (document.visibilityState === 'hidden') this.save();
    };
    this.saveNow = () => this.save();
    this.applyOfflineEarnings();
    this.store = writable(this.snapshot());
  }

  /** Starts the tick loop. Safe to call twice. */
  start() {
    if (this.timer !== null) return;
    this.timer = setInterval(() => this.tick(), TICK_MS);
    document.addEventListener('visibilitychange', this.saveOnHide);
    window.addEventListener('pagehide', this.saveNow);
  }

  /** Stops the loop and saves. Call when the app closes. */
  stop() {
    if (this.timer !== null) clearInterval(this.timer);
    this.timer = null;
    document.removeEventListener('visibilitychange', this.saveOnHide);
    window.removeEventListener('pagehide', this.saveNow);
    this.save();
  }

  /** Advances the clock, pays income, checks goals and publishes. */
  tick() {
    const dtSec = TICK_MS / MS_PER_SEC;
    const wasNight = this.isNight();
    this.frame += 1;
    this.state.clock = (this.state.clock + dtSec) % DAY_LENGTH_SEC;
    if (wasNight && !this.isNight()) this.state.nights += 1;
    this.tickFlier();
    if (this.boost && this.frame >= this.boost.until) this.boost = null;
    this.earn(this.perSec() * dtSec);
    this.checkGoals();
    this.saveAccumulator += TICK_MS;
    if (this.saveAccumulator >= SAVE_INTERVAL_MS) {
      this.saveAccumulator = 0;
      this.save();
    }
    this.publish();
  }

  /** The big box. */
  click() {
    this.state.clicks += 1;
    this.earn(this.clickValue());
    this.checkGoals();
    this.publish();
  }

  /**
   * Buys the current buy-mode amount of a shop item (x1, x10 or as many as affordable).
   * @param {string} id
   * @returns {number} units bought (0 when the purchase was refused)
   */
  buy(id) {
    const item = SHOP_ITEMS.find((entry) => entry.id === id);
    if (!item) return 0;
    const entry = this.shopEntry(item);
    if (!entry.canBuy) return 0;
    this.state.cash -= entry.cost;
    this.state.owned[id] += entry.qty;
    this.checkGoals();
    this.save();
    this.publish();
    return entry.qty;
  }

  /** @param {string} modeId one of the BUY_MODES ids */
  setBuyMode(modeId) {
    const mode = BUY_MODES.find((entry) => entry.id === modeId);
    if (!mode) return;
    this.buyMode = mode.id;
    this.buyCount = mode.count;
    this.publish();
  }

  /**
   * Taps the golden bone. Rolls a weighted random boon and applies it.
   * @returns {boolean} true when a bone was in the sky
   */
  catchFlier() {
    if (!this.flier) return false;
    this.flier = null;
    this.nextFlierAt = this.frame + randomGap();
    this.state.bones += 1;
    const boon = rollBoon();
    if (boon.id === 'cash') {
      const gain = Math.max(BOON_CASH_FLOOR, this.perSec() * boon.seconds, this.clickValue() * boon.seconds);
      this.earn(gain);
      this.announce(boon.label + ' +' + formatMoney(gain), 'boon');
    } else {
      this.boost = { id: boon.id, mult: boon.mult, label: boon.label, until: this.frame + boon.seconds * TICKS_PER_SEC };
      this.announce(boon.label + '! x' + boon.mult + ' for ' + boon.seconds + 's', 'boon');
    }
    this.checkGoals();
    this.save();
    this.publish();
    return true;
  }

  /** @returns {string} a transfer code for the company as it is right now */
  exportCode() {
    return encodeSave(this.state);
  }

  /**
   * Replaces this device's company with one from a transfer code (already validated by
   * decodeSave). No offline earnings: the company arrives exactly as it was sent.
   * @param {object} state
   */
  importState(state) {
    this.state = Object.assign(freshState(), state, { owned: Object.assign(zeroOwned(), state.owned) });
    this.flier = null;
    this.boost = null;
    this.welcomeGain = 0;
    this.nextFlierAt = this.frame + FLIER_FIRST_TICKS;
    this.save();
    this.publish();
  }

  /** Hides the "while you were away" line. */
  dismissWelcome() {
    this.welcomeGain = 0;
    this.publish();
  }

  /** Writes the save slot. Storage can be full or blocked; the game keeps running without it. */
  save() {
    this.state.savedAt = Date.now();
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.state));
    } catch (err) {
      // Intentionally silent: a failed save must never stop play.
    }
  }

  /** @returns {boolean} true during the night half of the cycle */
  isNight() {
    return this.state.clock / DAY_LENGTH_SEC >= NIGHT_START;
  }

  /** @returns {number} floors in the building, lobby not counted */
  floorCount() {
    return 1 + this.state.owned.floor;
  }

  /** @returns {number} cash per click, including an active click frenzy */
  clickValue() {
    return (BASE_CLICK_VALUE + this.state.owned.mouse) * this.boostMult('frenzy');
  }

  /**
   * @param {string} id boon id
   * @returns {number} the active boost's multiplier when it matches id, else 1
   */
  boostMult(id) {
    return this.boost && this.boost.id === id ? this.boost.mult : NO_MULT;
  }

  /** Spawns, flies and expires the golden bone. */
  tickFlier() {
    if (this.flier && this.frame - this.flier.start >= FLIER_FLIGHT_TICKS) {
      this.flier = null;
      this.nextFlierAt = this.frame + randomGap();
    }
    if (!this.flier && this.frame >= this.nextFlierAt) {
      this.flier = { start: this.frame };
      this.nextFlierAt = Infinity;
    }
  }

  /**
   * Queues a one-line message for the HUD toast.
   * @param {string} text
   * @param {'boon'|'goal'} kind
   */
  announce(text, kind) {
    this.eventSeq += 1;
    this.event = { id: this.eventSeq, text, kind };
  }

  /**
   * Cash per second right now. Employees earn by day, janitors by night.
   * Amenities multiply whichever shift is active.
   * @returns {number}
   */
  perSec() {
    const { owned } = this.state;
    const amenityMult = 1 + CAFE_BONUS * owned.cafe + RESTROOM_BONUS * owned.restroom;
    const rush = this.boostMult('rush');
    if (this.isNight()) return owned.janitor * JANITOR_INCOME * amenityMult * rush;
    const deskMult = 1 + CHAIR_BONUS * owned.chair;
    return owned.hire * EMPLOYEE_INCOME * deskMult * amenityMult * rush;
  }

  /** @returns {Object<string, number>} raw numbers that goals and the HUD read */
  stats() {
    const { owned, clicks, nights, lifetimeCash } = this.state;
    return {
      clicks,
      nights,
      lifetimeCash,
      employees: owned.hire,
      janitors: owned.janitor,
      cafes: owned.cafe,
      restrooms: owned.restroom,
      floors: this.floorCount(),
      bones: this.state.bones,
    };
  }

  /**
   * Max units of a shop item the building can hold.
   * Desks cap employees; one janitor per floor; one cafe/restroom per floor above the lobby.
   * @param {{id:string,kind:string}} item
   * @returns {number}
   */
  limitOf(item) {
    const floors = this.floorCount();
    if (item.id === 'hire') return floors * SLOTS_PER_FLOOR;
    if (item.id === 'janitor') return floors;
    if (item.kind === 'amenity') return floors - 1;
    return Infinity;
  }

  /** @returns {number} cost of the next unit */
  costOf(item) {
    return Math.floor(item.baseCost * Math.pow(item.growth, this.state.owned[item.id]));
  }

  /** @returns {boolean} whether the item's unlock goal is finished */
  isUnlocked(item) {
    return item.unlockGoal <= this.state.goalsDone;
  }

  /**
   * Price of the next units under the current buy mode. A fixed count (x10) stops early
   * only at the building's limit; MAX (count 0) buys as many as the cash covers.
   * @param {{id:string,baseCost:number,growth:number,kind:string}} item
   * @returns {{qty:number,total:number}}
   */
  quote(item) {
    const owned = this.state.owned[item.id];
    const room = this.limitOf(item) - owned;
    const wanted = this.buyCount || MAX_BULK_BUY;
    let qty = 0;
    let total = 0;
    while (qty < wanted && qty < room) {
      const next = Math.floor(item.baseCost * Math.pow(item.growth, owned + qty));
      if (!this.buyCount && total + next > this.state.cash) break;
      total += next;
      qty += 1;
    }
    if (qty) return { qty, total };
    // MAX with nothing affordable: show the next unit's price, but it can't be bought yet.
    return { qty: 0, total: this.costOf(item) };
  }

  /**
   * View model for one shop row.
   * @param {{id:string,name:string,desc:string,kind:string,unlockGoal:number,baseCost:number,growth:number}} item
   */
  shopEntry(item) {
    const owned = this.state.owned[item.id];
    const unlocked = this.isUnlocked(item);
    const maxed = owned >= this.limitOf(item);
    const { qty, total } = this.quote(item);
    return {
      id: item.id,
      name: item.name,
      desc: item.desc,
      kind: item.kind,
      unlocked,
      owned,
      maxed,
      qty,
      cost: total,
      canBuy: unlocked && !maxed && qty > 0 && this.state.cash >= total,
    };
  }

  /** @returns {{text:string,stat:string,min:number}} the goal the player is working on */
  currentGoal() {
    const index = this.state.goalsDone;
    if (index < GOALS.length) return GOALS[index];
    const target = EXTRA_GOAL_BASE * Math.pow(EXTRA_GOAL_GROWTH, index - GOALS.length);
    return { text: 'Earn ' + formatMoney(target) + ' total', stat: 'lifetimeCash', min: target };
  }

  /** Marks goals done in order. Several can finish on one call. */
  checkGoals() {
    const stats = this.stats();
    const before = this.state.goalsDone;
    let goal = this.currentGoal();
    while (stats[goal.stat] >= goal.min) {
      this.state.goalsDone += 1;
      goal = this.currentGoal();
    }
    if (this.state.goalsDone === before) return;
    const unlocked = SHOP_ITEMS
      .filter((item) => item.unlockGoal > before && item.unlockGoal <= this.state.goalsDone)
      .map((item) => item.name);
    this.announce(unlocked.length ? 'Mission done · New: ' + unlocked.join(' + ') : 'Mission done!', 'goal');
    this.save();
  }

  /** @returns {number} whole-dollar gain already added while away */
  applyOfflineEarnings() {
    const { savedAt } = this.state;
    if (!savedAt) return 0;
    const elapsedSec = Math.min((Date.now() - savedAt) / MS_PER_SEC, OFFLINE_CAP_SEC);
    const gain = this.perSec() * elapsedSec * OFFLINE_RATE;
    if (gain < 1) return 0;
    this.welcomeGain = gain;
    this.earn(gain);
    return gain;
  }

  /** @param {number} amount */
  earn(amount) {
    this.state.cash += amount;
    this.state.lifetimeCash += amount;
  }

  /** @returns {object} everything the UI needs for one frame */
  snapshot() {
    const { state } = this;
    return {
      cash: state.cash,
      perSec: this.perSec(),
      clickValue: this.clickValue(),
      clock: state.clock / DAY_LENGTH_SEC,
      isNight: this.isNight(),
      nights: state.nights,
      clicks: state.clicks,
      frame: this.frame,
      owned: Object.assign({}, state.owned),
      floors: this.floorCount(),
      goalsDone: state.goalsDone,
      goal: this.goalProgress(),
      welcomeGain: this.welcomeGain,
      shop: SHOP_ITEMS.map((item) => this.shopEntry(item)),
      buyMode: this.buyMode,
      bones: state.bones,
      flier: this.flier ? (this.frame - this.flier.start) / FLIER_FLIGHT_TICKS : null,
      boost: this.boost
        ? { id: this.boost.id, label: this.boost.label, mult: this.boost.mult, secondsLeft: Math.ceil((this.boost.until - this.frame) / TICKS_PER_SEC) }
        : null,
      event: this.event,
    };
  }

  /** @returns {{text:string,min:number,value:number}} */
  goalProgress() {
    const goal = this.currentGoal();
    return { text: goal.text, min: goal.min, value: this.stats()[goal.stat] };
  }

  publish() {
    this.store.set(this.snapshot());
  }
}
