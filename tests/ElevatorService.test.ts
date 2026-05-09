import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ElevatorService } from "../src/elevator/ElevatorService";

describe("ElevatorService", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("rejects invalid floor values", () => {
    const service = new ElevatorService({ minFloor: 0, maxFloor: 8, moveIntervalMs: 1000 });
    expect(service.enqueue(2.5)).toEqual({ accepted: false, reason: "floor-must-be-integer" });
    expect(service.enqueue(9)).toEqual({ accepted: false, reason: "floor-out-of-range" });
  });

  it("interpolates request in same direction", () => {
    const service = new ElevatorService({ minFloor: 0, maxFloor: 8, moveIntervalMs: 1000 });
    service.enqueue(6); // first destination
    service.start();

    // Move to floor 1 (direction up)
    vi.advanceTimersByTime(1000);

    // Request between current (1) and next stop (6)
    service.enqueue(3);

    const state = service.getState();
    expect(state.queue[0]).toBe(3);
  });

  it("moves and stops at target", () => {
    const service = new ElevatorService({ minFloor: 0, maxFloor: 8, moveIntervalMs: 1000 });
    service.enqueue(2);
    service.start();

    vi.advanceTimersByTime(1000); // floor 1
    vi.advanceTimersByTime(1000); // floor 2
    vi.advanceTimersByTime(1000); // stop and idle

    const state = service.getState();
    expect(state.currentFloor).toBe(2);
    expect(state.queue.length).toBe(0);
    expect(state.direction).toBe("idle");
  });
});