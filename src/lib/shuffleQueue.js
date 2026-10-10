/**
 * Shuffle order for the music player: the songs still to come this cycle,
 * and the songs that already played (for "previous"). Plain indices into the
 * player's library; no audio, no DOM.
 *
 * Every song plays once per cycle. A new cycle never opens with the song
 * that just finished, and a song picked by hand is struck from the rest of
 * the cycle so it doesn't come round again minutes later.
 */

// "Previous" can walk back this far; capped so a player left running for
// days doesn't grow the list forever
const MAX_HISTORY = 200;

export class ShuffleQueue {
  /** @type {number[]} indices still to play this cycle, next first */
  upcoming = [];
  /** @type {number[]} indices that played before the current one, most recent last */
  history = [];

  /**
   * Deals a new random order of every song except the current one.
   * @param {number} length library size
   * @param {number} current index playing now
   */
  deal(length, current) {
    const order = [];
    for (let i = 0; i < length; i++) {
      if (i !== current) order.push(i);
    }
    // Fisher-Yates
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const swap = order[i];
      order[i] = order[j];
      order[j] = swap;
    }
    this.upcoming = order;
  }

  /**
   * A song is about to replace the current one.
   * @param {number} index the incoming song
   * @param {number} current the outgoing song
   * @param {boolean} fromHistory "previous" is stepping back, so don't record the step
   */
  noteChange(index, current, fromHistory) {
    const queued = this.upcoming.indexOf(index);
    if (queued !== -1) this.upcoming.splice(queued, 1);
    if (fromHistory || index === current || current < 0) return;
    this.history.push(current);
    if (this.history.length > MAX_HISTORY) this.history.shift();
  }

  /**
   * The next shuffled song, dealing a new cycle when this one ran out.
   * @param {number} length library size
   * @param {number} current index playing now
   * @returns {number}
   */
  next(length, current) {
    if (this.upcoming.length === 0) this.deal(length, current);
    return this.upcoming.length > 0 ? this.upcoming.shift() : current;
  }

  /**
   * The song that played before the current one, or -1 when there is none.
   * The current song goes back on the front of the queue so "next" returns to it.
   * @param {number} length library size
   * @param {number} current index playing now
   * @returns {number}
   */
  back(length, current) {
    let idx = this.history.pop();
    while (idx !== undefined && (idx >= length || idx === current)) idx = this.history.pop();
    if (idx === undefined) return -1;
    this.upcoming.unshift(current);
    return idx;
  }
}
