-- /fingerprint (workers/api/src/routes/fingerprint.js): consented device profiles
-- for the Fingerprint toolbox app, the groundwork for DOGS ID.
-- Every identifier is a salted SHA-256 (lib/hash.js): no raw IPs, IDs or device
-- traits are stored. signals: comma-joined per-signal hashes in SIGNAL_KEYS
-- order ("" = missing), so keys are only ever appended.
CREATE TABLE IF NOT EXISTS fingerprints (
  cookie_hash TEXT PRIMARY KEY,
  local_hash TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  core_hash TEXT NOT NULL,
  signals TEXT NOT NULL,
  first_seen INTEGER NOT NULL,
  last_seen INTEGER NOT NULL,
  visits INTEGER NOT NULL DEFAULT 1
) WITHOUT ROWID;

-- Recognition after the cookie is gone: by the stored local ID, then fuzzy
-- matching on the latest records sharing a network or the device's core traits.
CREATE INDEX IF NOT EXISTS fingerprints_local ON fingerprints (local_hash);
CREATE INDEX IF NOT EXISTS fingerprints_ip_recent ON fingerprints (ip_hash, last_seen);
CREATE INDEX IF NOT EXISTS fingerprints_core_recent ON fingerprints (core_hash, last_seen);
-- Retention cleanup reads by age.
CREATE INDEX IF NOT EXISTS fingerprints_last_seen ON fingerprints (last_seen);
