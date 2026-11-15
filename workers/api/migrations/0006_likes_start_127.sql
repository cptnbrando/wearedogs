-- The like count starts at 127: a one-time head start added on top of real likes.
-- Migrations run once, so this never adds again. The count still only goes up.
UPDATE counters SET value = value + 127 WHERE name = 'likes';
