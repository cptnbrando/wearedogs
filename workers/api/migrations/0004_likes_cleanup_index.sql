-- The 20-day cleanup and expired-row count use created_at. This migration
-- also upgrades databases where 0003_likes_signals.sql was already applied.
CREATE INDEX IF NOT EXISTS likes_created_at ON likes (created_at);
