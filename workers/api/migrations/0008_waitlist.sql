-- One waitlist per DOGS app site (castle, money24, 40). Normalized addresses only; no IP records.
CREATE TABLE IF NOT EXISTS waitlist (
  site TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (site, email)
) WITHOUT ROWID;
