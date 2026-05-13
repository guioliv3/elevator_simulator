import { Request, Response } from "express";
import { ElevatorService } from "./ElevatorService";

export class ElevatorController {
  constructor(private readonly service: ElevatorService) {}

  getState = (_req: Request, res: Response): void => {
    res.json(this.service.getState());
  };

  getQueue = (_req: Request, res: Response): void => {
    res.json({ queue: this.service.getState().queue });
  };

  requestFloor = (req: Request, res: Response): void => {
    const floor = Number(req.body?.floor);
    const result = this.service.enqueue(floor);

    if (!result.accepted) {
      res.status(400).json({ error: result.reason });
      return;
    }

    res.status(202).json({ accepted: true });
  };

  health = (_req: Request, res: Response): void => {
    res.json({ ok: true });
  };
}
