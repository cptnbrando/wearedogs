/**
 * The daily D1 write budget every route spends from.
 *
 * D1's free tier (100k rows written a day) is account-wide: wordsmith and any
 * future Worker draw from the same pool. This Worker keeps itself to
 * DAILY_WRITE_BUDGET, and each app gets its own sub-cap so one noisy app
 * can't starve the others. Spending is checked before the work is done, so
 * once a cap is hit nothing more is written until 00:00 UTC.
 *
 * Totals live in `counters` as `writes:all:YYYY-MM-DD` and
 * `writes:<app>:YYYY-MM-DD` rows.
 */

const DAILY_WRITE_BUDGET = 40000;
// The two counter upserts below are writes too
const BUDGET_ROWS = 2;
const SPEND_SQL = `INSERT INTO counters (name, value) VALUES (?1, ?2)
  ON CONFLICT (name) DO UPDATE SET value = value + ?2 WHERE value + ?2 <= ?3
  RETURNING value`;

/**
 * Reserves `rows` D1 row writes for `app` today.
 * @param {{ DB: D1Database }} env
 * @param {string} app short app name, e.g. "likes"
 * @param {number} rows rows the operation will write (excluding the budget's own)
 * @param {number} appCap the app's own daily row cap
 * @returns {Promise<boolean>} false once either cap would be exceeded
 */
export async function spendWrites(env, app, rows, appCap) {
  const day = new Date().toISOString().slice(0, 10);
  const total = rows + BUDGET_ROWS;
  const [all, mine] = await env.DB.batch([
    env.DB.prepare(SPEND_SQL).bind(`writes:all:${day}`, total, DAILY_WRITE_BUDGET),
    env.DB.prepare(SPEND_SQL).bind(`writes:${app}:${day}`, total, appCap),
  ]);
  return all.results.length > 0 && mine.results.length > 0;
}
