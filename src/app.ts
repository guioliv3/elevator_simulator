import express from "express";
import { ElevatorService } from "./elevator/ElevatorService";
import { createElevatorRoutes } from "./elevator/ElevatorRoutes";

export function createApp(service: ElevatorService) {
  const app = express();
  app.use(express.json());

  app.use("/api", createElevatorRoutes(service));

  return app;
}
