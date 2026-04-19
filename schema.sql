CREATE TABLE IF NOT EXISTS ebook_orders (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  region TEXT NOT NULL,
  displayed_price TEXT NOT NULL,
  status TEXT NOT NULL,
  payment_provider TEXT NOT NULL,
  payment_url TEXT NOT NULL,
  provider_payment_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ebook_orders_email ON ebook_orders(email);
CREATE INDEX IF NOT EXISTS idx_ebook_orders_status ON ebook_orders(status);

CREATE TABLE IF NOT EXISTS payment_webhook_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  email TEXT,
  provider_payment_id TEXT,
  raw_payload TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payment_webhook_events_email ON payment_webhook_events(email);
