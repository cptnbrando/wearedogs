/**
 * DOGS INC tunables and content. Pure data: the engine, the ASCII art and the
 * panels all read from here, so balance changes never touch logic.
 *
 * Goals double as the tutorial. Each one teaches one mechanic, and finishing
 * it unlocks the next shop items (see `unlockGoal`, a count of finished goals).
 */

// ── Save & clock ──
export const SAVE_VERSION = 1;
export const SAVE_KEY = 'dogsinc-save-v1';
/** Engine tick. Also the snapshot publish rate (10 Hz). */
export const TICK_MS = 100;
export const SAVE_INTERVAL_MS = 5000;
/** Real seconds for one full day + night cycle. */
export const DAY_LENGTH_SEC = 60;
/** Cycle fraction (0–1) where night begins. */
export const NIGHT_START = 0.6;

// ── Away time ──
export const OFFLINE_CAP_SEC = 8 * 60 * 60;
/** Share of normal income earned while the tab is closed. */
export const OFFLINE_RATE = 0.5;

// ── Economy ──
export const BASE_CLICK_VALUE = 1;
/** $/sec per employee at a desk during the day. */
export const EMPLOYEE_INCOME = 1;
/** $/sec per janitor during the night. */
export const JANITOR_INCOME = 0.6;
export const SLOTS_PER_FLOOR = 4;
/** Desk output multiplier added per chair upgrade level. */
export const CHAIR_BONUS = 0.25;
/** Income multiplier added per cafe / restroom. */
export const CAFE_BONUS = 0.1;
export const RESTROOM_BONUS = 0.05;

// ── Art ──
/** Floors drawn in the tower window at once. */
export const MAX_DRAWN_FLOORS = 8;
/** Landscape phones are only ~200px tall: their tower window shows fewer floors. */
export const SHORT_DRAWN_FLOORS = 4;

// ── Shop ──
// cost = baseCost * growth^owned. `unlockGoal` = goals finished before it shows.
export const SHOP_ITEMS = [
  { id: 'hire', kind: 'staff', name: 'Hire Employee', desc: 'Fills a desk. Works days.', baseCost: 50, growth: 1.15, unlockGoal: 0 },
  { id: 'mouse', kind: 'upgrade', name: 'Ergonomic Mouse', desc: '+1 cash per click.', baseCost: 15, growth: 1.6, unlockGoal: 1 },
  { id: 'chair', kind: 'upgrade', name: 'Desk Chairs', desc: '+25% desk income.', baseCost: 100, growth: 1.8, unlockGoal: 2 },
  { id: 'janitor', kind: 'staff', name: 'Hire Janitor', desc: 'Cleans and earns at night.', baseCost: 200, growth: 1.2, unlockGoal: 3 },
  { id: 'floor', kind: 'build', name: 'Build Floor', desc: 'Adds desks and a new level.', baseCost: 500, growth: 2.2, unlockGoal: 4 },
  { id: 'cafe', kind: 'amenity', name: 'Cafe', desc: '+10% income. One per floor.', baseCost: 800, growth: 1.5, unlockGoal: 5 },
  { id: 'restroom', kind: 'amenity', name: 'Restroom', desc: '+5% income. One per floor.', baseCost: 600, growth: 1.5, unlockGoal: 5 },
];

// ── Goals (tutorial) ──
// `stat` names a value from the engine's stats(); the goal is done once it reaches `min`.
export const GOALS = [
  { text: 'Click the box 10 times', stat: 'clicks', min: 10 },
  { text: 'Hire your first employee', stat: 'employees', min: 1 },
  { text: 'Survive your first night', stat: 'nights', min: 1 },
  { text: 'Fill every desk on floor 1', stat: 'employees', min: SLOTS_PER_FLOOR },
  { text: 'Build floor 2', stat: 'floors', min: 2 },
  { text: 'Put a cafe on floor 2', stat: 'cafes', min: 1 },
  { text: 'Put a restroom on floor 2', stat: 'restrooms', min: 1 },
  { text: 'Hire a janitor', stat: 'janitors', min: 1 },
  { text: 'Earn $5,000 total', stat: 'lifetimeCash', min: 5000 },
];
/** After the tutorial goals, targets become lifetime-earnings milestones. */
export const EXTRA_GOAL_BASE = 25000;
export const EXTRA_GOAL_GROWTH = 5;

// ── Golden bone (catchable sky event) ──
// A bone drifts across the sky every so often. Tap it before it leaves for a random boon.
/** Ticks between bones (random between min and max). 10 ticks = 1 second. */
export const FLIER_GAP_MIN_TICKS = 350;
export const FLIER_GAP_MAX_TICKS = 750;
/** First bone of a session comes sooner so new players meet it. */
export const FLIER_FIRST_TICKS = 150;
/** How long one crossing takes. */
export const FLIER_FLIGHT_TICKS = 90;
/** Smallest cash burst, so early-game catches still feel good. */
export const BOON_CASH_FLOOR = 25;
/**
 * Boons a caught bone can grant. `weight` sets how often each is rolled.
 * cash: instant payout of `seconds` worth of current income (or clicks, whichever is bigger).
 * frenzy: clicks pay `mult`x for `seconds`. rush: income pays `mult`x for `seconds`.
 */
export const BOONS = [
  { id: 'cash', weight: 5, seconds: 45, label: 'Bone bonus' },
  { id: 'frenzy', weight: 3, seconds: 12, mult: 7, label: 'Click frenzy' },
  { id: 'rush', weight: 3, seconds: 20, mult: 3, label: 'Rush hour' },
];

// ── Shop buy amounts ──
/** Buy-mode buttons in the shop. 0 means "as many as you can afford". */
export const BUY_MODES = [
  { id: 'one', label: 'x1', count: 1 },
  { id: 'ten', label: 'x10', count: 10 },
  { id: 'max', label: 'MAX', count: 0 },
];
/** Safety cap for MAX buys so one tap can never spin forever. */
export const MAX_BULK_BUY = 500;
