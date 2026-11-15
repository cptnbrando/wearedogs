-- Normalized addresses only; no IP records or secondary indexes.
CREATE TABLE IF NOT EXISTS mailing_list (
  email TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL
) WITHOUT ROWID;
