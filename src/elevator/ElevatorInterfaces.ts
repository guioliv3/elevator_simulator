export type Direction = "up" | "down" | "idle";

export interface ElevatorState {
  currentFloor: number;
  direction: Direction;
  queue: number[];
  moving: boolean;
}

export interface SimulatorConfig {
  minFloor: number;
  maxFloor: number;
  moveIntervalMs: number;
}

export interface EnqueueResult {
  accepted: boolean;
  reason?: string;
}
