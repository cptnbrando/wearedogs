/**
 * The DOGS logo in every panel header goes all the way back to the landing page.
 * Panels fire this event; TitlePage owns the history stack and closes everything.
 */
export const GO_HOME_EVENT = 'go-home';

export function goHome() {
  window.dispatchEvent(new CustomEvent(GO_HOME_EVENT));
}
