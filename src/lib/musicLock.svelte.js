/**
 * Lockup gate for non-public music tracks (public: false in the MusicPanel library).
 * Files live under /music/2026/lockup/ on the data server and require the same
 * `Authorization: password=...` scheme as the GoPro catalog. The passcode is
 * punched into the calculator app and persisted in localStorage.
 */
import { dataUrl } from "./dataHost.js";

const STORAGE_KEY = "music_lockup_password";
const CHECK_URL = dataUrl("https://data.wearedogs.net/music/lockup/check.txt");

class MusicLock {
  unlocked = $state(false);
  password = "";

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.password = saved;
        this.unlocked = true;
      }
    }
  }

  async verify(pass) {
    const response = await fetch(CHECK_URL, {
      method: "GET",
      headers: {
        Authorization: `password=${pass}`,
      },
    });
    return response.ok;
  }

  /** Try a passcode against the lockup check file; persist and unlock on success. */
  async tryUnlock(pass) {
    if (!pass) return false;
    try {
      if (await this.verify(pass)) {
        this.password = pass;
        this.unlocked = true;
        localStorage.setItem(STORAGE_KEY, pass);
        return true;
      }
    } catch (e) {
      console.warn("Music lockup verification failed or offline:", e);
    }
    return false;
  }

  /**
   * Re-check the stored passcode against the server. Revokes the unlock only on
   * an explicit rejection — network errors keep the offline unlock intact.
   */
  async revalidate() {
    if (!this.password) return;
    try {
      const ok = await this.verify(this.password);
      if (!ok) {
        localStorage.removeItem(STORAGE_KEY);
        this.password = "";
        this.unlocked = false;
      }
    } catch (e) {
      console.warn("Music lockup revalidation skipped (offline?):", e);
    }
  }
}

export const musicLock = new MusicLock();
