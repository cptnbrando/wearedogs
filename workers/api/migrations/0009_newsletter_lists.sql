-- One list per DOGS app, each its own table, so each can become its own newsletter. The joined
-- DOGS newsletter stays in mailing_list. Replaces the shared waitlist table (0008).
CREATE TABLE IF NOT EXISTS newsletter_castle (
  email TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL
) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS newsletter_money24 (
  email TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL
) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS newsletter_40 (
  email TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL
) WITHOUT ROWID;
INSERT OR IGNORE INTO newsletter_castle (email, created_at) SELECT email, created_at FROM waitlist WHERE site = 'castle';
INSERT OR IGNORE INTO newsletter_money24 (email, created_at) SELECT email, created_at FROM waitlist WHERE site = 'money24';
INSERT OR IGNORE INTO newsletter_40 (email, created_at) SELECT email, created_at FROM waitlist WHERE site = '40';
DROP TABLE waitlist;
