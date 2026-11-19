/**
 * The daily D1 write budget every route spends from.
 *
 * D1's free tier (100k rows written a day) is account-wide. This Worker only
 * reserves its own DAILY_WRITE_BUDGET; it cannot see Wordsmith's writes or
 * guarantee the account-wide limit by itself. Each app also gets a sub-cap.
 * Spending is checked before business writes, so this Worker stops at its cap.
 *
 * Totals live in `counters` as `writes:all:YYYY-MM-DD` and
 * `writes:<app>:YYYY-MM-DD` rows.
 */

const DAILY_WRITE_BUDGET = 40000;
// Covers two daily counter inserts on first use and their two reservation updates.
const BUDGET_ROWS = 4;
const ENSURE_COUNTER_SQL = "INSERT OR IGNORE INTO counters (name, value) VALUES (?1, 0)";
const SPEND_SQL = `UPDATE counters SET value = value + ?1
  WHERE name IN (?2, ?3)
    AND EXISTS (
      SELECT 1 FROM counters AS total_counter, counters AS app_counter
      WHERE total_counter.name = ?2
        AND total_counter.value + ?1 <= ?4
        AND app_counter.name = ?3
        AND app_counter.value + ?1 <= ?5
    )
  RETURNING name`;

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
  const allName = `writes:all:${day}`;
  const appName = `writes:${app}:${day}`;
  const total = rows + BUDGET_ROWS;
  const [, , reserved] = await env.DB.batch([
    env.DB.prepare(ENSURE_COUNTER_SQL).bind(allName),
    env.DB.prepare(ENSURE_COUNTER_SQL).bind(appName),
    env.DB.prepare(SPEND_SQL).bind(total, allName, appName, DAILY_WRITE_BUDGET, appCap),
  ]);
  return reserved.results.length === 2;
}
