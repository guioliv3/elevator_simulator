import {
  ElevatorEvent,
  ElevatorState,
  EventHandler,
  SimulatorConfig,
  EnqueueResult} from "./ElevatorInterfaces";

export class ElevatorService {
  private readonly minFloor: number;
  private readonly maxFloor: number;
  private readonly moveIntervalMs: number;
  private readonly onEvent?: EventHandler;

  private currentFloor: number;
  private direction: ElevatorState["direction"] = "idle";
  private queue: number[] = [];
  private timer: NodeJS.Timeout | null = null;

  constructor(config: SimulatorConfig, onEvent?: EventHandler) {
    this.minFloor = config.minFloor;
    this.maxFloor = config.maxFloor;
    this.moveIntervalMs = config.moveIntervalMs;
    this.onEvent = onEvent;
    this.currentFloor = this.minFloor;
  }

  start(): void {
    if (this.timer) {
      return;
    }
    this.timer = setInterval(() => this.tick(), this.moveIntervalMs);
  }

  stop(): void {
    if (!this.timer) {
      return;
    }
    clearInterval(this.timer);
    this.timer = null;
  }

  getState(): ElevatorState {
    return {
      currentFloor: this.currentFloor,
      direction: this.direction,
      queue: [...this.queue],
      moving: this.direction !== "idle"
    };
  }

  enqueue(floor: number): EnqueueResult {
    if (!Number.isInteger(floor)) {
      return { accepted: false, reason: "floor-must-be-integer" };
    }
    if (floor < this.minFloor || floor > this.maxFloor) {
      return { accepted: false, reason: "floor-out-of-range" };
    }
    if (floor === this.currentFloor && this.direction === "idle") {
      return { accepted: false, reason: "already-at-floor" };
    }
    if (this.queue.includes(floor)) {
      return { accepted: false, reason: "already-queued" };
    }

    if (this.direction === "idle") {
      this.queue.push(floor);
      this.emit("enqueue");
      return { accepted: true };
    }

    const nextStop = this.queue[0];
    if (this.direction === "up" && floor > this.currentFloor && floor < nextStop) {
      this.queue.unshift(floor);
      this.emit("enqueue");
      return { accepted: true };
    }

    if (this.direction === "down" && floor < this.currentFloor && floor > nextStop) {
      this.queue.unshift(floor);
      this.emit("enqueue");
      return { accepted: true };
    }

    this.queue.push(floor);
    this.emit("enqueue");
    return { accepted: true };
  }

  private tick(): void {
    if (this.queue.length === 0) {
      if (this.direction !== "idle") {
        this.direction = "idle";
        this.emit("idle");
      }
      return;
    }

    const target = this.queue[0];
    if (this.currentFloor === target) {
      this.queue.shift();
      this.emit("stop");
      if (this.queue.length === 0) {
        this.direction = "idle";
        this.emit("idle");
      }
      return;
    }

    this.direction = target > this.currentFloor ? "up" : "down";
    this.currentFloor += this.direction === "up" ? 1 : -1;
    this.emit("move");
  }

  private emit(type: ElevatorEvent["type"]): void {
    if (!this.onEvent) {
      return;
    }
    const event: ElevatorEvent = {
      type,
      floor: this.currentFloor,
      queue: [...this.queue],
      direction: this.direction,
      timestamp: new Date().toISOString()
    };
    this.onEvent(event);
  }
}
