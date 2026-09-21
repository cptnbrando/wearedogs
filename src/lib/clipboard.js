/**
 * Copy text to the clipboard, wherever the page is running.
 *
 * `navigator.clipboard` only exists in a secure context, so it is simply missing
 * on a plain-http LAN dev origin (and can be refused elsewhere). When it isn't
 * there or says no, fall back to the legacy selection-based copy.
 *
 * Call it from inside a user gesture (click, contextmenu, touchend) — both paths
 * can be refused outside of one.
 *
 * @param {string} text
 * @returns {Promise<boolean>} whether the text reached the clipboard
 */
export async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Refused or unavailable — try the legacy path below
    }
  }
  return legacyCopy(text);
}

function legacyCopy(text) {
  const previousFocus = document.activeElement;
  const field = document.createElement("textarea");
  field.value = text;
  // readonly keeps a phone from popping its keyboard; the page sets
  // user-select: none on body, so the field has to opt back in to be selectable
  field.setAttribute("readonly", "");
  field.style.cssText =
    "position:fixed;top:0;left:0;opacity:0;pointer-events:none;user-select:text;-webkit-user-select:text;";
  document.body.appendChild(field);
  field.select();
  field.setSelectionRange(0, field.value.length);

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch (err) {
    copied = false;
  }

  field.remove();
  previousFocus?.focus?.();
  return copied;
}
