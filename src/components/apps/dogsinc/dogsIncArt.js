import {
  SLOTS_PER_FLOOR,
  MAX_DRAWN_FLOORS,
  NIGHT_START,
} from './dogsIncConfig.js';

// ── Tower geometry (every row is exactly TOWER_WIDTH chars; row count is fixed) ──
// Glyphs stay plain ASCII on purpose: phones without a full monospace font fall back to
// proportional glyphs for box-drawing characters, which would change the tower's width
// and shove the click box. Color does the decorating instead.
const LABEL_WIDTH = 4;
const SLOT_WIDTH = 7;
const SLOT_AREA_WIDTH = SLOTS_PER_FLOOR * SLOT_WIDTH;
const AMENITY_WIDTH = 10;
const HALF_AMENITY_WIDTH = AMENITY_WIDTH / 2;
const AMENITY_START = LABEL_WIDTH + SLOT_AREA_WIDTH;
const TOWER_INNER = LABEL_WIDTH + SLOT_AREA_WIDTH + AMENITY_WIDTH;
const TOWER_WIDTH = TOWER_INNER + 2;
const SKY_ROWS = 2;
const FLOOR_ROWS = 3;
const LOBBY_ROWS = 2;
/** Total rows: sky, roof, floors, lobby, ground. */
export const TOWER_ROWS = SKY_ROWS + 1 + MAX_DRAWN_FLOORS * FLOOR_ROWS + LOBBY_ROWS + 1;
/** Sky rows sit at the top of the block; the golden bone flies through them. */
export const TOWER_SKY_ROWS = SKY_ROWS;
const FIRST_AMENITY_FLOOR = 2;

// ── Color codes (one char per glyph; DogsIncTower maps them to CSS classes) ──
export const INK = {
  frame: 'f', desk: 'i', worker: 'e', sun: 's', moon: 'm', star: 'm',
  cloud: 'w', janitor: 'a', cafe: 'c', restroom: 'r', ghost: 'd', sign: 's', label: 'd',
};

// ── Glyphs ──
const SUN_GLYPH = 'O';
const MOON_GLYPH = ')';
const CLOUD_GLYPH = '~~';
const STAR_BRIGHT = '*';
const STAR_DIM = '.';
const STAR_SPOTS = [3, 11, 19, 27, 35, 40];
const CLOUD_SPOTS = [6, 26];
/** Ticks per one-column cloud drift. */
const CLOUD_DRIFT_TICKS = 25;
const TWINKLE_PERIOD = 30;
const TWINKLE_ON = 15;
const EMPLOYEE_GLYPH = 'o';
const BLINK_GLYPH = '-';
const JANITOR_GLYPH = '@';
const GHOST_GLYPH = '.';
const DESK_PLAIN = '[___]';
const DESK_CHAIR = '[=_=]';
const BLINK_PERIOD = 40;
const BLINK_FRAMES = 2;
const JANITOR_FRAMES_PER_CELL = 2;
const JANITOR_SPACING = 9;
const CAFE_TOP = 'CAFE ';
const CAFE_BOTTOM = '~~~~ ';
const RESTROOM_TOP = ' WC  ';
const RESTROOM_BOTTOM = ' |_| ';
const EMPTY_ROOM_TOP = '     ';
const EMPTY_ROOM_BOTTOM = '  .  ';
const ROOF_FILL = '^';
const FLOOR_SEPARATOR = '-';
const GROUND_FILL = '=';
const LOBBY_LEFT_TEXT = ' LOBBY    ';
const LOBBY_SIGN_TEXT = 'DOGS INC';
const LOBBY_RIGHT_TEXT = '   [E]';
const LOBBY_BOTTOM_FILL = '_';

// ── Click box ──
const CLICK_BOX_INNER = 16;
const CLICK_LABEL = '$ CLICK $';
const CLICK_BORDER_FILL = '-';

/**
 * @typedef {{t: string, c: string}} PaintedRow  text plus a same-length string of color codes
 */

/**
 * @param {number} width
 * @param {string} [ink]
 * @returns {PaintedRow} a blank row
 */
function blank(width, ink = INK.desk) {
  return { t: ' '.repeat(width), c: ink.repeat(width) };
}

/**
 * Overwrites part of a row in place, keeping its length, and colors the new glyphs.
 * @param {PaintedRow} row
 * @param {number} index
 * @param {string} text
 * @param {string} ink one INK code
 */
function paint(row, index, text, ink) {
  row.t = row.t.slice(0, index) + text + row.t.slice(index + text.length);
  row.c = row.c.slice(0, index) + ink.repeat(text.length) + row.c.slice(index + text.length);
}

/**
 * @param {string} text
 * @param {number} width
 * @returns {string} text centered and padded to width
 */
function centered(text, width) {
  const left = Math.floor((width - text.length) / 2);
  return ' '.repeat(left) + text + ' '.repeat(width - text.length - left);
}

/**
 * Two sky rows: the sun or moon arcs across the top row, stars or drifting clouds below.
 * @param {{clock:number,isNight:boolean,frame:number}} snap
 * @returns {PaintedRow[]}
 */
function skyRows(snap) {
  const celestial = blank(TOWER_WIDTH);
  const scenery = blank(TOWER_WIDTH);
  const span = TOWER_WIDTH - 1;
  if (snap.isNight) {
    const moonX = Math.floor(((snap.clock - NIGHT_START) / (1 - NIGHT_START)) * span);
    paint(celestial, moonX, MOON_GLYPH, INK.moon);
    STAR_SPOTS.forEach((x, i) => {
      const bright = (snap.frame + i * 5) % TWINKLE_PERIOD < TWINKLE_ON;
      paint(scenery, x, bright ? STAR_BRIGHT : STAR_DIM, INK.star);
    });
    return [celestial, scenery];
  }
  const sunX = Math.floor((snap.clock / NIGHT_START) * span);
  paint(celestial, sunX, SUN_GLYPH, INK.sun);
  const drift = Math.floor(snap.frame / CLOUD_DRIFT_TICKS);
  CLOUD_SPOTS.forEach((x) => {
    paint(scenery, (x + drift) % (TOWER_WIDTH - CLOUD_GLYPH.length), CLOUD_GLYPH, INK.cloud);
  });
  return [celestial, scenery];
}

/**
 * Janitor positions on each floor for the current frame. Janitors work nights only.
 * @param {{isNight:boolean,frame:number,owned:Object<string,number>,floors:number}} snap
 * @returns {Object<number, number[]>} floor number -> column offsets inside the slot area
 */
function janitorCells(snap) {
  const cells = {};
  if (!snap.isNight) return cells;
  const step = Math.floor(snap.frame / JANITOR_FRAMES_PER_CELL);
  for (let j = 0; j < snap.owned.janitor; j += 1) {
    const floorNo = (j % snap.floors) + 1;
    const x = (step + j * JANITOR_SPACING) % SLOT_AREA_WIDTH;
    cells[floorNo] = (cells[floorNo] || []).concat([x]);
  }
  return cells;
}

/**
 * Employee glyph for a seat, blinking now and then so the office feels alive.
 * @param {number} seat
 * @param {number} frame
 * @returns {string}
 */
function seatGlyph(seat, frame) {
  const blink = (frame + seat * 7) % BLINK_PERIOD < BLINK_FRAMES;
  return blink ? BLINK_GLYPH : EMPLOYEE_GLYPH;
}

/**
 * @param {number} floorNo
 * @returns {PaintedRow} a floor's head row with only its "F3" label filled in
 */
function labelledRow(floorNo) {
  const row = blank(TOWER_INNER);
  paint(row, 0, ('F' + floorNo).padEnd(LABEL_WIDTH), INK.label);
  return row;
}

/**
 * Head row and desk row for one built office floor, plus its right-hand amenity column.
 * @param {object} snap
 * @param {number} floorNo
 * @param {Object<number, number[]>} janitors
 * @returns {PaintedRow[]} [headRow, deskRow], each TOWER_INNER wide
 */
function officeRows(snap, floorNo, janitors) {
  const head = labelledRow(floorNo);
  const desk = blank(TOWER_INNER);
  const deskArt = snap.owned.chair > 0 ? DESK_CHAIR : DESK_PLAIN;
  for (let s = 0; s < SLOTS_PER_FLOOR; s += 1) {
    const slotStart = LABEL_WIDTH + s * SLOT_WIDTH;
    const seat = (floorNo - 1) * SLOTS_PER_FLOOR + s;
    if (seat < snap.owned.hire && !snap.isNight) {
      paint(head, slotStart + 2, seatGlyph(seat, snap.frame), INK.worker);
    }
    paint(desk, slotStart, deskArt, INK.desk);
  }
  (janitors[floorNo] || []).forEach((offset) => {
    const col = LABEL_WIDTH + offset;
    if (head.t[col] === ' ') paint(head, col, JANITOR_GLYPH, INK.janitor);
  });
  if (floorNo < FIRST_AMENITY_FLOOR) return [head, desk];
  const amenityIndex = floorNo - FIRST_AMENITY_FLOOR;
  const cafeBuilt = amenityIndex < snap.owned.cafe;
  const restroomBuilt = amenityIndex < snap.owned.restroom;
  const restroomStart = AMENITY_START + HALF_AMENITY_WIDTH;
  paint(head, AMENITY_START, cafeBuilt ? CAFE_TOP : EMPTY_ROOM_TOP, INK.cafe);
  paint(desk, AMENITY_START, cafeBuilt ? CAFE_BOTTOM : EMPTY_ROOM_BOTTOM, cafeBuilt ? INK.cafe : INK.ghost);
  paint(head, restroomStart, restroomBuilt ? RESTROOM_TOP : EMPTY_ROOM_TOP, INK.restroom);
  paint(desk, restroomStart, restroomBuilt ? RESTROOM_BOTTOM : EMPTY_ROOM_BOTTOM, restroomBuilt ? INK.restroom : INK.ghost);
  return [head, desk];
}

/**
 * A floor the player hasn't built yet. Dots mark where desks will go.
 * @param {number} floorNo
 * @returns {PaintedRow[]} [headRow, deskRow]
 */
function ghostRows(floorNo) {
  const desk = blank(TOWER_INNER, INK.ghost);
  for (let s = 0; s < SLOTS_PER_FLOOR; s += 1) {
    paint(desk, LABEL_WIDTH + s * SLOT_WIDTH + 2, GHOST_GLYPH, INK.ghost);
  }
  return [labelledRow(floorNo), desk];
}

/**
 * @param {PaintedRow} inner
 * @returns {PaintedRow} the row framed by building walls
 */
function walled(inner) {
  return { t: '|' + inner.t + '|', c: INK.frame + inner.c + INK.frame };
}

/**
 * @param {string} edge
 * @param {string} fill
 * @returns {PaintedRow} a full-width structural row such as a floor slab
 */
function slab(edge, fill) {
  const text = edge + fill.repeat(TOWER_INNER) + edge;
  return { t: text, c: INK.frame.repeat(text.length) };
}

/**
 * Renders the whole building as fixed-width painted rows.
 * The tower always draws the same number of floors for a layout, so the block never changes size.
 * @param {object} snap - engine snapshot
 * @param {number} [drawnFloors] floors in the window (MAX_DRAWN_FLOORS, fewer on short screens)
 * @returns {PaintedRow[]} rows, each TOWER_WIDTH chars (TOWER_ROWS at the default window)
 */
export function buildTowerRows(snap, drawnFloors = MAX_DRAWN_FLOORS) {
  const janitors = janitorCells(snap);
  const topFloor = Math.max(snap.floors, drawnFloors);
  const bottomFloor = topFloor - drawnFloors + 1;

  const rows = skyRows(snap);
  rows.push(slab('+', ROOF_FILL));
  for (let floorNo = topFloor; floorNo >= bottomFloor; floorNo -= 1) {
    const [head, desk] = floorNo > snap.floors
      ? ghostRows(floorNo)
      : officeRows(snap, floorNo, janitors);
    rows.push(walled(head), walled(desk), slab('+', FLOOR_SEPARATOR));
  }
  const lobby = blank(TOWER_INNER);
  paint(lobby, 0, LOBBY_LEFT_TEXT, INK.label);
  paint(lobby, LOBBY_LEFT_TEXT.length, LOBBY_SIGN_TEXT, INK.sign);
  paint(lobby, LOBBY_LEFT_TEXT.length + LOBBY_SIGN_TEXT.length, LOBBY_RIGHT_TEXT, INK.label);
  const lobbyFloor = blank(TOWER_INNER, INK.frame);
  paint(lobbyFloor, 0, LOBBY_BOTTOM_FILL.repeat(TOWER_INNER), INK.frame);
  rows.push(walled(lobby), walled(lobbyFloor), slab('+', GROUND_FILL));
  return rows;
}

/**
 * The big box. Caption shows what one click pays.
 * @param {string} caption e.g. "+$12"
 * @returns {string[]} four rows, each CLICK_BOX_INNER + 2 wide
 */
export function buildClickBoxRows(caption) {
  const border = '+' + CLICK_BORDER_FILL.repeat(CLICK_BOX_INNER) + '+';
  return [
    border,
    '|' + centered(CLICK_LABEL, CLICK_BOX_INNER) + '|',
    '|' + centered(caption, CLICK_BOX_INNER) + '|',
    border,
  ];
}
