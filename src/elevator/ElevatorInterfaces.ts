export type Direction = "up" | "down" | "idle";

export type ElevatorEventType = "enqueue" | "move" | "stop" | "idle";

export interface ElevatorEvent {
  type: ElevatorEventType;
  floor: number;
  queue: number[];
  direction: Direction;
  timestamp: string;
}

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

export type EventHandler = (event: ElevatorEvent) => void;

export interface EnqueueResult {
  accepted: boolean;
  reason?: string;
}
