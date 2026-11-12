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
} from './dogsIncConfig.js';

const MS_PER_SEC = 1000;
const THOUSAND = 1000;
const MONEY_SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi'];
const MONEY_DECIMALS_SMALL = 2;
const MONEY_DECIMALS_LARGE = 1;
const MONEY_DECIMAL_CUTOFF = 10;

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
    this.applyOfflineEarnings();
    this.store = writable(this.snapshot());
  }

  /** Starts the tick loop. Safe to call twice. */
  start() {
    if (this.timer !== null) return;
    this.timer = setInterval(() => this.tick(), TICK_MS);
  }

  /** Stops the loop and saves. Call when the app closes. */
  stop() {
    if (this.timer !== null) clearInterval(this.timer);
    this.timer = null;
    this.save();
  }

  /** Advances the clock, pays income, checks goals and publishes. */
  tick() {
    const dtSec = TICK_MS / MS_PER_SEC;
    const wasNight = this.isNight();
    this.frame += 1;
    this.state.clock = (this.state.clock + dtSec) % DAY_LENGTH_SEC;
    if (wasNight && !this.isNight()) this.state.nights += 1;
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
   * Buys one unit of a shop item if it is unlocked, under its limit, and affordable.
   * @param {string} id
   * @returns {boolean} true when the purchase happened
   */
  buy(id) {
    const item = SHOP_ITEMS.find((entry) => entry.id === id);
    if (!item) return false;
    const entry = this.shopEntry(item);
    if (!entry.canBuy) return false;
    this.state.cash -= entry.cost;
    this.state.owned[id] += 1;
    this.checkGoals();
    this.publish();
    return true;
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

  /** @returns {number} cash per click */
  clickValue() {
    return BASE_CLICK_VALUE + this.state.owned.mouse;
  }

  /**
   * Cash per second right now. Employees earn by day, janitors by night.
   * Amenities multiply whichever shift is active.
   * @returns {number}
   */
  perSec() {
    const { owned } = this.state;
    const amenityMult = 1 + CAFE_BONUS * owned.cafe + RESTROOM_BONUS * owned.restroom;
    if (this.isNight()) return owned.janitor * JANITOR_INCOME * amenityMult;
    const deskMult = 1 + CHAIR_BONUS * owned.chair;
    return owned.hire * EMPLOYEE_INCOME * deskMult * amenityMult;
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
   * View model for one shop row.
   * @param {{id:string,name:string,desc:string,kind:string,unlockGoal:number}} item
   */
  shopEntry(item) {
    const owned = this.state.owned[item.id];
    const limit = this.limitOf(item);
    const cost = this.costOf(item);
    const unlocked = this.isUnlocked(item);
    const maxed = owned >= limit;
    return {
      id: item.id,
      name: item.name,
      desc: item.desc,
      kind: item.kind,
      unlocked,
      owned,
      maxed,
      cost,
      canBuy: unlocked && !maxed && this.state.cash >= cost,
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
    let goal = this.currentGoal();
    while (stats[goal.stat] >= goal.min) {
      this.state.goalsDone += 1;
      goal = this.currentGoal();
    }
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
