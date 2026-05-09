import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";
import { ElevatorService } from "../src/elevator/ElevatorService";

describe("API", () => {
  it("GET /api/health", async () => {
    const service = new ElevatorService({ minFloor: 0, maxFloor: 8, moveIntervalMs: 1000 });
    const app = createApp(service);

    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it("POST /api/request accepts valid floor", async () => {
    const service = new ElevatorService({ minFloor: 0, maxFloor: 8, moveIntervalMs: 1000 });
    const app = createApp(service);

    const res = await request(app).post("/api/request").send({ floor: 5 });
    expect(res.status).toBe(202);
    expect(res.body).toEqual({ accepted: true });
  });
});