import postgres from "postgres";

const HOST = process.env.HOST || "localhost";
const PORT = Number(process.env.PORT) || 5435;
const DATABASE_NAME = process.env.DATABASE_NAME || "metrics";
const USERNAME_NAME = process.env.USERNAME_NAME || "tsdb";
const PASSWORD_NAME = process.env.PASSWORD_NAME || "tsdb";
const MAX = Number(process.env.MAX) || 10;

const tsdb = postgres({
    host: HOST,
    port: PORT,
    database: DATABASE_NAME,
    username: USERNAME_NAME,
    password: PASSWORD_NAME,
    max: MAX
});

export async function insertWebsiteTick({
  websiteId,
  regionId,
  responseTime,
  status
}: {
  websiteId: string;
  regionId: string;
  responseTime: number;
  status: "Up" | "Down" | "Unknown";
}) {
  await tsdb`
    INSERT INTO website_ticks
    (time, website_id, region_id, response_time_ms, status)
    VALUES
    (NOW(), ${websiteId}, ${regionId}, ${responseTime}, ${status})
  `;
}

// latest tick for a website
export async function getLatestTick(websiteId: string) {
  const rows = await tsdb`
    SELECT time, status, response_time_ms
    FROM website_ticks
    WHERE website_id = ${websiteId}
    ORDER BY time DESC
    LIMIT 1
  `;
  return rows[0] ?? null;
}

// uptime %
export async function getUptimeStats(websiteId: string) {
  const rows = await tsdb`
    SELECT
      COUNT(*) FILTER (WHERE status = 'Up')::float / NULLIF(COUNT(*), 0) * 100
      AS uptime
    FROM website_ticks
    WHERE website_id = ${websiteId}
  `;
  return Number(rows[0]?.uptime ?? 0);
}

// avg response time
export async function getAverageResponse(websiteId: string) {
  const rows = await tsdb`
    SELECT AVG(response_time_ms) AS avg
    FROM website_ticks
    WHERE website_id = ${websiteId}
  `;
  return Number(rows[0]?.avg ?? 0);
}

// region metrics
export async function getRegionMetrics(websiteId: string) {
  return tsdb`
    SELECT
      region_id,
      AVG(response_time_ms) AS avg_response,
      COUNT(*) AS checks
    FROM website_ticks
    WHERE website_id = ${websiteId}
    GROUP BY region_id
  `;
}

// recent ticks (timeline)
export async function getRecentTicks(
  websiteId: string,
  limit: number
) {
  return tsdb`
    SELECT time, status, response_time_ms
    FROM website_ticks
    WHERE website_id = ${websiteId}
    ORDER BY time DESC
  `;
}

