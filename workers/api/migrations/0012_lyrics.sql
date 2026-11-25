-- Timed lyrics for the music player (routes/lyrics.js): one row per track, the body is the
-- lyrics JSON ({ v, lines }) as the Captions app saved it.
CREATE TABLE IF NOT EXISTS lyrics (
  track_id TEXT PRIMARY KEY,
  body TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
