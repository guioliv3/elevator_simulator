import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString: databaseUrl
});

export async function logRequest(floor: number): Promise<void> {
  if (!databaseUrl) {
    return;
  }
  await pool.query(
    "INSERT INTO elevator_requests (floor, status) VALUES ($1, $2)",
    [floor, "queued"]
  );
}

export async function logEvent(
  type: string,
  floor: number,
  direction: string,
  queue: number[]
): Promise<void> {
  if (!databaseUrl) {
    return;
  }
  await pool.query(
    "INSERT INTO elevator_events (event_type, floor, direction, queue) VALUES ($1, $2, $3, $4)",
    [type, floor, direction, queue]
  );
}
