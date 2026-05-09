import { Router } from "express";
import { ElevatorController } from "./ElevatorController";
import { ElevatorService } from "./ElevatorService";

export function createElevatorRoutes(service: ElevatorService): Router {
  const router = Router();
  const controller = new ElevatorController(service);

  router.get("/state", controller.getState);
  router.get("/queue", controller.getQueue);
  router.post("/request", controller.requestFloor);
  router.get("/health", controller.health);

  return router;
}
