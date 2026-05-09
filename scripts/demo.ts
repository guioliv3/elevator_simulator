import { ElevatorService } from "../src/elevator/ElevatorService";

const service = new ElevatorService(
  { minFloor: 0, maxFloor: 8, moveIntervalMs: 1000 },
  (event) => {
    const queue = event.queue.join(", ");
    console.log(
      `[${event.timestamp}] ${event.type} | floor=${event.floor} | dir=${event.direction} | queue=[${queue}]`
    );
  }
);

service.start();

console.log("1) Pedido inicial: andar 6");
service.enqueue(6);

setTimeout(() => {
  console.log("2) Pedido intermediario: andar 3 (deve interpolar)");
  service.enqueue(3);
}, 1500); // depois de 1.5s, o elevador ja saiu do 0

setTimeout(() => {
  console.log("3) Pedido acima: andar 8 (entra depois do 6)");
  service.enqueue(8);
}, 3000);

setTimeout(() => {
  console.log("4) Pedido abaixo enquanto sobe: andar 1 (entra no fim)");
  service.enqueue(1);
}, 4500);

setTimeout(() => {
  console.log("Encerrando demo");
  service.stop();
}, 15000);