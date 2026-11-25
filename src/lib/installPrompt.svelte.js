/**
 * Installing the site as an app, and keeping its saved data: both only when
 * asked. Nothing here puts a prompt in front of a visitor by itself.
 *
 * Chrome and Edge on Android offer "Add to Home screen" by themselves once a
 * site qualifies. That offer is caught here and held (holdInstallOffer runs
 * from main.js at startup), and Settings > Site Data has the button that
 * shows it. A desktop browser's own install icon in the address bar is the
 * browser's and cannot be taken away. Safari has no such offer: there it is
 * Share > Add to Home Screen.
 *
 * Persistent storage stops the browser clearing saved songs when the device
 * runs low on space. Chrome decides that quietly; Firefox asks the visitor.
 * So it is asked for at startup only where it cannot prompt, and Settings
 * has a button for the rest.
 */

const INSTALL_ACCEPTED = "accepted";
/** The one browser family that shows a permission prompt for persistent storage. */
const PROMPTS_FOR_STORAGE = /Firefox\//;

class InstallPrompt {
  /** The browser has an install offer waiting. */
  available = $state(false);
  /** The site is running as an installed app, or was just installed. */
  installed = $state(false);
  /** Saved data is protected from the browser's own clean-ups. */
  persisted = $state(false);
  /** This browser can be asked to protect saved data. */
  canPersist = $state(false);
  offer = null;

  /** Call once at startup, before the browser makes its offer. */
  hold() {
    if (typeof window === "undefined") return;
    this.installed =
      (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
      window.navigator.standalone === true;
    window.addEventListener("beforeinstallprompt", (event) => {
      // Stops the browser's own banner; the offer waits for the Settings button
      event.preventDefault();
      this.offer = event;
      this.available = true;
    });
    window.addEventListener("appinstalled", () => {
      this.offer = null;
      this.available = false;
      this.installed = true;
    });
    const storage = navigator.storage;
    if (!storage || !storage.persist || !storage.persisted) return;
    this.canPersist = true;
    storage.persisted().then((kept) => {
      this.persisted = kept;
      // Where asking is silent, ask now, as the site always has
      if (!kept && !PROMPTS_FOR_STORAGE.test(navigator.userAgent)) this.keepData();
    }).catch(() => {});
  }

  /**
   * Shows the browser's install offer. Only from a button press.
   * @returns {Promise<boolean>} true when the visitor accepted
   */
  async install() {
    const offer = this.offer;
    if (!offer) return false;
    // An offer can be shown once
    this.offer = null;
    this.available = false;
    offer.prompt();
    const choice = await offer.userChoice;
    return !!choice && choice.outcome === INSTALL_ACCEPTED;
  }

  /**
   * Asks the browser to keep this site's saved data. May prompt (Firefox).
   * @returns {Promise<boolean>} true when the data is now protected
   */
  async keepData() {
    try {
      this.persisted = await navigator.storage.persist();
    } catch (e) {
      this.persisted = false;
    }
    return this.persisted;
  }
}

export const installPrompt = new InstallPrompt();
