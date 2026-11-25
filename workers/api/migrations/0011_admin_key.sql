-- The owner's public key (lib/admin.js): the one row there can be. The private half and its PIN
-- stay on the owner's device. Deleting the row lets the setup password register a new key.
CREATE TABLE IF NOT EXISTS admin_keys (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  public_key TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
