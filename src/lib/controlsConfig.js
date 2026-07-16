export const DEFAULT_MAPPINGS = {
  n64: {
    UP: "ArrowUp",
    DOWN: "ArrowDown",
    LEFT: "ArrowLeft",
    RIGHT: "ArrowRight",
    A: "KeyK",
    B: "KeyC",
    L: "KeyQ",
    R: "KeyE",
    Z: "Space",
    START: "Enter",
    ANALOG_UP: "KeyW",
    ANALOG_DOWN: "KeyS",
    ANALOG_LEFT: "KeyA",
    ANALOG_RIGHT: "KeyD",
    C_UP: "KeyI",
    C_DOWN: "KeyL",
    C_LEFT: "KeyU",
    C_RIGHT: "KeyO",
  },
  gba: {
    UP: "ArrowUp",
    DOWN: "ArrowDown",
    LEFT: "ArrowLeft",
    RIGHT: "ArrowRight",
    A: "KeyX",
    B: "KeyC",
    L: "KeyA",
    R: "KeyD",
    SELECT: "ShiftLeft",
    START: "Enter",
  },
  nds: {
    UP: "ArrowUp",
    DOWN: "ArrowDown",
    LEFT: "ArrowLeft",
    RIGHT: "ArrowRight",
    A: "KeyX",
    B: "KeyC",
    X: "KeyZ",
    Y: "KeyS",
    L: "KeyA",
    R: "KeyD",
    SELECT: "ShiftLeft",
    START: "Enter",
  },
  sega: {
    UP: "ArrowUp",
    DOWN: "ArrowDown",
    LEFT: "ArrowLeft",
    RIGHT: "ArrowRight",
    Y: "KeyS", // maps to RetroArch Y
    B: "KeyC", // maps to RetroArch B
    A: "KeyX", // maps to RetroArch A
    START: "Enter",
  },
  psx: {
    UP: "ArrowUp",
    DOWN: "ArrowDown",
    LEFT: "ArrowLeft",
    RIGHT: "ArrowRight",
    B: "KeyC",      // Cross (✖)
    A: "KeyX",      // Circle (●)
    X: "KeyZ",      // Square (■)
    Y: "KeyS",      // Triangle (▲)
    L: "KeyA",      // L1
    R: "KeyD",      // R1
    L2: "KeyQ",     // L2
    R2: "KeyE",     // R2
    SELECT: "ShiftLeft",
    START: "Enter",
  }
};

export const CONSOLE_LABELS = {
  n64: {
    title: "Nintendo 64",
    groups: [
      {
        name: "D-Pad",
        buttons: [
          { action: "UP", label: "D-Pad Up" },
          { action: "DOWN", label: "D-Pad Down" },
          { action: "LEFT", label: "D-Pad Left" },
          { action: "RIGHT", label: "D-Pad Right" }
        ]
      },
      {
        name: "Action Buttons",
        buttons: [
          { action: "A", label: "Button A" },
          { action: "B", label: "Button B" }
        ]
      },
      {
        name: "Triggers & Shoulder",
        buttons: [
          { action: "L", label: "L Trigger" },
          { action: "R", label: "R Trigger" },
          { action: "Z", label: "Z Trigger" }
        ]
      },
      {
        name: "Analog Stick",
        buttons: [
          { action: "ANALOG_UP", label: "Analog Up" },
          { action: "ANALOG_DOWN", label: "Analog Down" },
          { action: "ANALOG_LEFT", label: "Analog Left" },
          { action: "ANALOG_RIGHT", label: "Analog Right" }
        ]
      },
      {
        name: "C-Buttons",
        buttons: [
          { action: "C_UP", label: "C-Up" },
          { action: "C_DOWN", label: "C-Down" },
          { action: "C_LEFT", label: "C-Left" },
          { action: "C_RIGHT", label: "C-Right" }
        ]
      },
      {
        name: "System",
        buttons: [
          { action: "START", label: "Start" }
        ]
      }
    ]
  },
  gba: {
    title: "Gameboy Advance",
    groups: [
      {
        name: "D-Pad",
        buttons: [
          { action: "UP", label: "D-Pad Up" },
          { action: "DOWN", label: "D-Pad Down" },
          { action: "LEFT", label: "D-Pad Left" },
          { action: "RIGHT", label: "D-Pad Right" }
        ]
      },
      {
        name: "Action Buttons",
        buttons: [
          { action: "A", label: "Button A" },
          { action: "B", label: "Button B" }
        ]
      },
      {
        name: "Shoulder Buttons",
        buttons: [
          { action: "L", label: "L Shoulder" },
          { action: "R", label: "R Shoulder" }
        ]
      },
      {
        name: "System",
        buttons: [
          { action: "SELECT", label: "Select" },
          { action: "START", label: "Start" }
        ]
      }
    ]
  },
  nds: {
    title: "Nintendo DS",
    groups: [
      {
        name: "D-Pad",
        buttons: [
          { action: "UP", label: "D-Pad Up" },
          { action: "DOWN", label: "D-Pad Down" },
          { action: "LEFT", label: "D-Pad Left" },
          { action: "RIGHT", label: "D-Pad Right" }
        ]
      },
      {
        name: "Action Buttons",
        buttons: [
          { action: "A", label: "Button A" },
          { action: "B", label: "Button B" },
          { action: "X", label: "Button X" },
          { action: "Y", label: "Button Y" }
        ]
      },
      {
        name: "Shoulder Buttons",
        buttons: [
          { action: "L", label: "L Button" },
          { action: "R", label: "R Button" }
        ]
      },
      {
        name: "System",
        buttons: [
          { action: "SELECT", label: "Select" },
          { action: "START", label: "Start" }
        ]
      }
    ]
  },
  sega: {
    title: "Sega Genesis",
    groups: [
      {
        name: "D-Pad",
        buttons: [
          { action: "UP", label: "D-Pad Up" },
          { action: "DOWN", label: "D-Pad Down" },
          { action: "LEFT", label: "D-Pad Left" },
          { action: "RIGHT", label: "D-Pad Right" }
        ]
      },
      {
        name: "Action Buttons",
        buttons: [
          { action: "Y", label: "Button A" },
          { action: "B", label: "Button B" },
          { action: "A", label: "Button C" }
        ]
      },
      {
        name: "System",
        buttons: [
          { action: "START", label: "Start" }
        ]
      }
    ]
  },
  psx: {
    title: "PlayStation 1",
    groups: [
      {
        name: "D-Pad",
        buttons: [
          { action: "UP", label: "D-Pad Up" },
          { action: "DOWN", label: "D-Pad Down" },
          { action: "LEFT", label: "D-Pad Left" },
          { action: "RIGHT", label: "D-Pad Right" }
        ]
      },
      {
        name: "Action Buttons",
        buttons: [
          { action: "B", label: "Cross (✖)" },
          { action: "A", label: "Circle (●)" },
          { action: "X", label: "Square (■)" },
          { action: "Y", label: "Triangle (▲)" }
        ]
      },
      {
        name: "Shoulders & Triggers",
        buttons: [
          { action: "L", label: "L1 Shoulder" },
          { action: "R", label: "R1 Shoulder" },
          { action: "L2", label: "L2 Trigger" },
          { action: "R2", label: "R2 Trigger" }
        ]
      },
      {
        name: "System",
        buttons: [
          { action: "SELECT", label: "Select" },
          { action: "START", label: "Start" }
        ]
      }
    ]
  }
};

/**
 * Maps raw Event.code names to friendly, readable strings for the keyboard mapping interface.
 * @param {string} code - The key code.
 * @returns {string} The formatted name.
 */
export function getFriendlyKeyName(code) {
  if (!code) return "None";
  if (code.startsWith("Key")) return code.slice(3);
  if (code.startsWith("Digit")) return code.slice(5);
  switch (code) {
    case "ArrowUp": return "↑";
    case "ArrowDown": return "↓";
    case "ArrowLeft": return "←";
    case "ArrowRight": return "→";
    case "Space": return "Space";
    case "Enter": return "Enter";
    case "ShiftLeft": return "L-Shift";
    case "ShiftRight": return "R-Shift";
    case "ControlLeft": return "L-Ctrl";
    case "ControlRight": return "R-Ctrl";
    case "AltLeft": return "L-Alt";
    case "AltRight": return "R-Alt";
    case "Escape": return "Esc";
    case "Backspace": return "Backspace";
    case "Tab": return "Tab";
    default: return code;
  }
}
