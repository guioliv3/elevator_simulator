import "dotenv/config";
import { createApp } from "./app";
import { ElevatorService } from "./elevator/ElevatorService";

const minFloor = 0;
const maxFloor = 8;
const moveIntervalMs = 2000;

const service = new ElevatorService({ minFloor, maxFloor, moveIntervalMs });

const app = createApp(service);
service.start();

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Elevator simulator listening on port ${port}`);
});
