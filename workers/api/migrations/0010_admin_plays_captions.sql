-- Play counts for the music player (routes/plays.js): one row per track, a running total.
-- Nothing about the listener is kept. Only the owner can read them (lib/admin.js).
CREATE TABLE IF NOT EXISTS plays (
  track_id TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  last_at INTEGER NOT NULL
) WITHOUT ROWID;

-- The owner's saved caption projects (routes/captions.js): the captions as JSON text, no media.
CREATE TABLE IF NOT EXISTS caption_projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  body TEXT NOT NULL,
  updated_at INTEGER NOT NULL
) WITHOUT ROWID;
