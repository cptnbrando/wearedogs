import {
  SLOTS_PER_FLOOR,
  MAX_DRAWN_FLOORS,
  NIGHT_START,
} from './dogsIncConfig.js';

// ── Tower geometry (every row is exactly TOWER_WIDTH chars; row count is fixed) ──
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
const FIRST_AMENITY_FLOOR = 2;

// ── Glyphs ──
const SUN_GLYPH = 'O';
const MOON_GLYPH = ')';
const CLOUD_GLYPH = '~~';
const STAR_BRIGHT = '*';
const STAR_DIM = '.';
const STAR_SPOTS = [3, 11, 19, 27, 35, 40];
const CLOUD_SPOTS = [6, 26];
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
const LOBBY_TOP_TEXT = ' LOBBY    DOGS INC   [E]';
const LOBBY_BOTTOM_FILL = '_';

// ── Click box ──
const CLICK_BOX_INNER = 16;
const CLICK_LABEL = '$ CLICK $';
const CLICK_BORDER_FILL = '-';

// ── Progress bar ──
const BAR_CELLS = 20;
const BAR_FILLED = '#';
const BAR_EMPTY = '-';

/**
 * Overwrites part of a string, keeping its length.
 * @param {string} text
 * @param {number} index
 * @param {string} insert
 * @returns {string}
 */
function put(text, index, insert) {
  return text.slice(0, index) + insert + text.slice(index + insert.length);
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
 * Two sky rows: the sun or moon arcs across the top row, stars or clouds sit below it.
 * @param {{clock:number,isNight:boolean,frame:number}} snap
 * @returns {string[]}
 */
function skyRows(snap) {
  let celestial = ' '.repeat(TOWER_WIDTH);
  let scenery = ' '.repeat(TOWER_WIDTH);
  const span = TOWER_WIDTH - 1;
  if (snap.isNight) {
    const moonX = Math.floor(((snap.clock - NIGHT_START) / (1 - NIGHT_START)) * span);
    celestial = put(celestial, moonX, MOON_GLYPH);
    STAR_SPOTS.forEach((x, i) => {
      const bright = (snap.frame + i * 5) % TWINKLE_PERIOD < TWINKLE_ON;
      scenery = put(scenery, x, bright ? STAR_BRIGHT : STAR_DIM);
    });
    return [celestial, scenery];
  }
  const sunX = Math.floor((snap.clock / NIGHT_START) * span);
  celestial = put(celestial, sunX, SUN_GLYPH);
  CLOUD_SPOTS.forEach((x) => {
    scenery = put(scenery, x, CLOUD_GLYPH);
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
 * Head row and desk row for one built office floor, plus its right-hand amenity column.
 * @param {object} snap
 * @param {number} floorNo
 * @param {Object<number, number[]>} janitors
 * @returns {string[]} [headRow, deskRow], each TOWER_INNER wide
 */
function officeRows(snap, floorNo, janitors) {
  let head = ('F' + floorNo).padEnd(LABEL_WIDTH) + ' '.repeat(TOWER_INNER - LABEL_WIDTH);
  let desk = ' '.repeat(TOWER_INNER);
  const deskArt = snap.owned.chair > 0 ? DESK_CHAIR : DESK_PLAIN;
  for (let s = 0; s < SLOTS_PER_FLOOR; s += 1) {
    const slotStart = LABEL_WIDTH + s * SLOT_WIDTH;
    const seat = (floorNo - 1) * SLOTS_PER_FLOOR + s;
    if (seat < snap.owned.hire && !snap.isNight) {
      head = put(head, slotStart + 2, seatGlyph(seat, snap.frame));
    }
    desk = put(desk, slotStart, deskArt);
  }
  (janitors[floorNo] || []).forEach((offset) => {
    const col = LABEL_WIDTH + offset;
    if (head[col] === ' ') head = put(head, col, JANITOR_GLYPH);
  });
  const amenityIndex = floorNo - FIRST_AMENITY_FLOOR;
  if (floorNo >= FIRST_AMENITY_FLOOR) {
    const cafeBuilt = amenityIndex < snap.owned.cafe;
    const restroomBuilt = amenityIndex < snap.owned.restroom;
    head = put(head, AMENITY_START, cafeBuilt ? CAFE_TOP : EMPTY_ROOM_TOP);
    desk = put(desk, AMENITY_START, cafeBuilt ? CAFE_BOTTOM : EMPTY_ROOM_BOTTOM);
    head = put(head, AMENITY_START + HALF_AMENITY_WIDTH, restroomBuilt ? RESTROOM_TOP : EMPTY_ROOM_TOP);
    desk = put(desk, AMENITY_START + HALF_AMENITY_WIDTH, restroomBuilt ? RESTROOM_BOTTOM : EMPTY_ROOM_BOTTOM);
  }
  return [head, desk];
}

/**
 * A floor the player hasn't built yet. Dots mark where desks will go.
 * @param {number} floorNo
 * @returns {string[]} [headRow, deskRow]
 */
function ghostRows(floorNo) {
  let desk = ' '.repeat(TOWER_INNER);
  for (let s = 0; s < SLOTS_PER_FLOOR; s += 1) {
    desk = put(desk, LABEL_WIDTH + s * SLOT_WIDTH + 2, GHOST_GLYPH);
  }
  return [('F' + floorNo).padEnd(LABEL_WIDTH) + ' '.repeat(TOWER_INNER - LABEL_WIDTH), desk];
}

/**
 * Renders the whole building as fixed-width text rows.
 * The tower always draws MAX_DRAWN_FLOORS floors so the block never changes size.
 * @param {object} snap - engine snapshot
 * @returns {string[]} TOWER_ROWS rows, each TOWER_WIDTH chars
 */
export function buildTowerRows(snap) {
  const wall = (inner) => '|' + inner + '|';
  const separator = '+' + FLOOR_SEPARATOR.repeat(TOWER_INNER) + '+';
  const janitors = janitorCells(snap);
  const topFloor = Math.max(snap.floors, MAX_DRAWN_FLOORS);
  const bottomFloor = topFloor - MAX_DRAWN_FLOORS + 1;

  const rows = skyRows(snap);
  rows.push('+' + ROOF_FILL.repeat(TOWER_INNER) + '+');
  for (let floorNo = topFloor; floorNo >= bottomFloor; floorNo -= 1) {
    const [head, desk] = floorNo > snap.floors
      ? ghostRows(floorNo)
      : officeRows(snap, floorNo, janitors);
    rows.push(wall(head), wall(desk), separator);
  }
  rows.push(
    wall(LOBBY_TOP_TEXT.padEnd(TOWER_INNER)),
    wall(LOBBY_BOTTOM_FILL.repeat(TOWER_INNER)),
    '+' + GROUND_FILL.repeat(TOWER_INNER) + '+',
  );
  return rows;
}

/**
 * The big box. Caption shows what one click pays.
 * @param {string} caption e.g. "+$12"
 * @returns {string[]} three rows, each CLICK_BOX_INNER + 2 wide
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

/**
 * ASCII progress bar, e.g. [####----------------] 25%.
 * @param {number} ratio 0–1
 * @returns {string}
 */
export function buildBarRow(ratio) {
  const filled = Math.round(Math.max(0, Math.min(1, ratio)) * BAR_CELLS);
  return '[' + BAR_FILLED.repeat(filled) + BAR_EMPTY.repeat(BAR_CELLS - filled) + ']';
}
