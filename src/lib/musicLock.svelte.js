/**
 * Lockup gate for non-public music tracks (public: false in the MusicPanel library).
 * Files live under /music/2026/lockup/ on the data server and require the same
 * `Authorization: password=...` scheme as the GoPro catalog. The passcode is
 * punched into the calculator app and persisted in localStorage.
 */
import { dataUrl } from "./dataHost.js";
import { fullLibrary } from "../data/music/tracks.js";

const STORAGE_KEY = "music_lockup_password";
const CHECK_URL = dataUrl("https://data.wearedogs.net/music/lockup/check.txt");

/**
 * Verification target: a real lockup track from the library, not the check
 * file. The check file's auth proved looser than the actual music files —
 * entering the GoPro passcode "verified" against it and clobbered the
 * working music password, breaking playback of every locked track. A
 * passcode that can't fetch actual music must never be stored here.
 */
function probeUrl() {
  const locked = (fullLibrary || []).find(
    (t) =>
      (t.src && t.src.includes("/lockup/")) ||
      (t.instrumental && t.instrumental.includes("/lockup/")),
  );
  if (!locked) return CHECK_URL;
  return dataUrl(
    locked.src && locked.src.includes("/lockup/")
      ? locked.src
      : locked.instrumental,
  );
}

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
    const response = await fetch(probeUrl(), {
      method: "GET",
      headers: {
        Authorization: `password=${pass}`,
      },
    });
    // Headers are enough — don't download the track body just to verify
    try {
      response.body?.cancel();
    } catch (e) { }
    return response.ok;
  }

  /** Try a passcode against a real lockup track; persist and unlock on success. */
  async tryUnlock(pass) {
    if (!pass) return false;
    if (this.unlocked && pass === this.password) return true;
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
