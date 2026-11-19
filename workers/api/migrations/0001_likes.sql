-- One row per liker. Both columns are salted SHA-256 hashes: no raw IPs or
-- fingerprints are ever stored.
CREATE TABLE IF NOT EXISTS likes (
  fp_hash TEXT PRIMARY KEY,
  ip_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL
) WITHOUT ROWID;

CREATE INDEX IF NOT EXISTS likes_ip_hash ON likes (ip_hash);

-- Running totals: 'likes', so reading the count is one row read instead of a
-- COUNT(*) that D1 bills as a full table scan, and one 'attempts:YYYY-MM-DD'
-- row per day, the Worker's hard stop below D1's free tier.
CREATE TABLE IF NOT EXISTS counters (
  name TEXT PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0
) WITHOUT ROWID;

INSERT OR IGNORE INTO counters (name, value) VALUES ('likes', 0);

CREATE TRIGGER IF NOT EXISTS likes_count AFTER INSERT ON likes
BEGIN
  UPDATE counters SET value = value + 1 WHERE name = 'likes';
END;
