import postgres from "postgres";

const sql = postgres({
  host: process.env.HOST || "localhost",
  port: Number(process.env.PORT) || 5435,
  database: process.env.DATABASE_NAME || "metrics",
  username: process.env.USERNAME_NAME || "tsdb",
  password: process.env.PASSWORD_NAME || "tsdb",
  max: 1 // single connection for migrations
});

async function bootstrapTimescale() {
  console.log("🚀 Bootstrapping TimescaleDB...");

  // 1. Extension
  await sql`
    CREATE EXTENSION IF NOT EXISTS timescaledb;
  `;
  console.log("✅ timescaledb extension");

  // 2. Table
  await sql`
    CREATE TABLE IF NOT EXISTS website_ticks (
      time TIMESTAMPTZ NOT NULL,
      website_id TEXT NOT NULL,
      region_id TEXT NOT NULL,
      response_time_ms INTEGER NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('Up', 'Down', 'Unknown'))
    );
  `;
  console.log("✅ website_ticks table");

  // 3. Hypertable
  await sql`
    SELECT create_hypertable(
      'website_ticks',
      'time',
      if_not_exists => TRUE
    );
  `;
  console.log("✅ hypertable created");

  // 4. Indexes
  await sql`
    CREATE INDEX IF NOT EXISTS idx_ticks_website_time
    ON website_ticks (website_id, time DESC);
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_ticks_website_region
    ON website_ticks (website_id, region_id);
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_ticks_status
    ON website_ticks (status);
  `;
  console.log("✅ indexes created");

  // 5. Retention
  await sql`
    SELECT add_retention_policy(
      'website_ticks',
      INTERVAL '30 days',
      if_not_exists => TRUE
    );
  `;
  console.log("✅ retention policy");

  // 6. Compression
  await sql`
    ALTER TABLE website_ticks
    SET (
      timescaledb.compress,
      timescaledb.compress_segmentby = 'website_id, region_id'
    );
  `;

  await sql`
    SELECT add_compression_policy(
      'website_ticks',
      INTERVAL '7 days',
      if_not_exists => TRUE
    );
  `;
  console.log("✅ compression enabled");

  await sql.end();
  console.log("🎉 TimescaleDB bootstrap complete");
}

bootstrapTimescale().catch((err) => {
  console.error("❌ Bootstrap failed", err);
  process.exit(1);
});
