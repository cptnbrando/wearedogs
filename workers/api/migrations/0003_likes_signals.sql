-- Dedup moves from "one per fingerprint, 3 per IP" to "one per device on an
-- IP, matched on per-signal hashes" (src/routes/likes.js). The table was
-- empty when this shipped, so it is rebuilt rather than migrated.
DROP TRIGGER IF EXISTS likes_count;
DROP INDEX IF EXISTS likes_ip_hash;
DROP TABLE IF EXISTS likes;

-- All hashes are salted SHA-256: no raw IPs, IDs or device traits are stored.
-- signals: comma-joined per-signal hashes in SIGNAL_KEYS order ("" = missing).
CREATE TABLE likes (
  device_hash TEXT PRIMARY KEY,
  ip_hash TEXT NOT NULL,
  signals TEXT NOT NULL,
  created_at INTEGER NOT NULL
) WITHOUT ROWID;

-- The duplicate check reads an IP's most recent likes
CREATE INDEX likes_ip_recent ON likes (ip_hash, created_at);

CREATE TRIGGER likes_count AFTER INSERT ON likes
BEGIN
  UPDATE counters SET value = value + 1 WHERE name = 'likes';
END;

-- The rebuilt table starts empty, so the total does too
UPDATE counters SET value = 0 WHERE name = 'likes';

-- The daily caps moved to lib/budget.js's writes:* rows
DELETE FROM counters WHERE name LIKE 'attempts:%';
