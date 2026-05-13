import express from "express";
import path from "path";
import { ElevatorService } from "./elevator/ElevatorService";
import { createElevatorRoutes } from "./elevator/ElevatorRoutes";

export function createApp(service: ElevatorService) {
  const app = express();

  app.use(express.json());

  //  serve o front (HTML)
  app.use(express.static(path.join(__dirname, "../public")));

  // API do elevador
  app.use("/api", createElevatorRoutes(service));

  return app;
}