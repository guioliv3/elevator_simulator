import { Request, Response } from "express";
import { ElevatorService } from "./ElevatorService";
import { logRequest } from "../infra/Database";

export class ElevatorController {
  constructor(private readonly service: ElevatorService) {}

  getState = (_req: Request, res: Response): void => {
    res.json(this.service.getState());
  };

  getQueue = (_req: Request, res: Response): void => {
    res.json({ queue: this.service.getState().queue });
  };

  requestFloor = async (req: Request, res: Response): Promise<void> => {
    const floor = Number(req.body?.floor);
    const result = this.service.enqueue(floor);

    if (!result.accepted) {
      res.status(400).json({ error: result.reason });
      return;
    }

    await logRequest(floor);
    res.status(202).json({ accepted: true });
  };

  health = (_req: Request, res: Response): void => {
    res.json({ ok: true });
  };
}
