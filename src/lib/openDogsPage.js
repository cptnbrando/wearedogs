/**
 * Opens a panel or a toolbox app in place, from anywhere on the landing (the app gallery's DOGS HOME
 * entry uses it). TitlePage owns the history stack, so it listens for this event and does the opening.
 */
export const OPEN_DOGS_PAGE_EVENT = 'open-dogs-page';

/**
 * @param {{ panel?: string, app?: string, force?: boolean }} target A panel ("map", "toolbox") or a toolbox app id
 *   ("dataflash"). force: open it even over another page, which closes first (left alone, that page stays).
 */
export function openDogsPage(target) {
  window.dispatchEvent(new CustomEvent(OPEN_DOGS_PAGE_EVENT, { detail: target }));
}
