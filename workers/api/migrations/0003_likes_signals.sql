-- Preserve existing counts and records while dedup moves to per-signal matching.
-- Older fingerprint hashes cannot be compared to the new signals, so retain
-- them until normal expiry and leave their signal set empty.
DROP TRIGGER IF EXISTS likes_count;
DROP INDEX IF EXISTS likes_ip_hash;
ALTER TABLE likes RENAME TO likes_previous;

-- All hashes are salted SHA-256: no raw IPs, IDs or device traits are stored.
-- signals: comma-joined per-signal hashes in SIGNAL_KEYS order ("" = missing).
CREATE TABLE likes (
  device_hash TEXT PRIMARY KEY,
  ip_hash TEXT NOT NULL,
  signals TEXT NOT NULL,
  created_at INTEGER NOT NULL
) WITHOUT ROWID;

INSERT INTO likes (device_hash, ip_hash, signals, created_at)
SELECT fp_hash, ip_hash, '', created_at FROM likes_previous;
DROP TABLE likes_previous;

-- The duplicate check reads an IP's most recent likes; cleanup reads by age.
CREATE INDEX likes_ip_recent ON likes (ip_hash, created_at);
CREATE INDEX likes_created_at ON likes (created_at);

CREATE TRIGGER likes_count AFTER INSERT ON likes
BEGIN
  UPDATE counters SET value = value + 1 WHERE name = 'likes';
END;

-- The daily caps moved to lib/budget.js's writes:* rows
DELETE FROM counters WHERE name LIKE 'attempts:%';
