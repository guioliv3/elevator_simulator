import { ElevatorState, SimulatorConfig, EnqueueResult } from "./ElevatorInterfaces";

export class ElevatorService {
  private readonly minFloor: number;
  private readonly maxFloor: number;
  private readonly moveIntervalMs: number;

  private currentFloor: number;
  private direction: ElevatorState["direction"] = "idle";
  private queue: number[] = [];
  private timer: NodeJS.Timeout | null = null;


  private justStoppedAt: number | null = null;

  constructor(config: SimulatorConfig) {
    this.minFloor = config.minFloor;
    this.maxFloor = config.maxFloor;
    this.moveIntervalMs = config.moveIntervalMs;
    this.currentFloor = this.minFloor;
  }

  // Inicia o simulador: o elevador comeca a se mover e processar a fila.
  start(): void {
    if (this.timer) return;
    this.timer = setInterval(() => this.tick(), this.moveIntervalMs);
  }

  // Para o simulador: o elevador para de se mover e processar a fila.  
  stop(): void {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  }

  // Retorna o estado atual do elevador, incluindo o andar, direção, fila e informações sobre a última parada.
  getState(): ElevatorState & {
    justStoppedAt: number | null;
  } {
    return {
      currentFloor: this.currentFloor,
      direction: this.direction,
      queue: [...this.queue],
      moving: this.direction !== "idle",
      justStoppedAt: this.justStoppedAt
    };
  }
// Adiciona um pedido de andar à fila do elevador, com validações para garantir que o pedido seja válido e não cause comportamentos indesejados.
  enqueue(floor: number): EnqueueResult {
    // --- Algoritmo SCAN (Elevator Algorithm):
    // (subindo ou descendo), e só depois inverta o sentido para atender os demais.
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

    // --- Lógica SCAN: reordena a fila para priorizar o sentido atual do elevador ---
  // Se o elevador já estiver se movendo ou tiver pedidos na fila, o novo pedido é inserido na fila de forma ordenada, priorizando os pedidos 
  // que estão na mesma direção do movimento atual do elevador. O algoritmo SCAN garante que o elevador atenda a todos os pedidos em um sentido (subindo ou descendo) antes de inverter o sentido para atender os demais.
    if (this.queue.length > 0 || this.direction !== "idle") {
      const plannedDirection =
        this.direction !== "idle"
          ? this.direction
          : this.queue[0] > this.currentFloor
          ? "up"
          : "down";
      const nextQueue = [...this.queue, floor];

      if (plannedDirection === "up") {
        // SCAN: Atende todos os andares acima primeiro (ordem crescente), depois os abaixo (ordem decrescente)
        const sameDirection = nextQueue
          .filter(value => value >= this.currentFloor)
          .sort((a, b) => a - b);
        const otherDirection = nextQueue
          .filter(value => value < this.currentFloor)
          .sort((a, b) => b - a);
        this.queue = [...sameDirection, ...otherDirection];
      } else {
        // SCAN: Atende todos os andares abaixo primeiro (ordem decrescente), depois os acima (ordem crescente)
        const sameDirection = nextQueue
          .filter(value => value <= this.currentFloor)
          .sort((a, b) => b - a);
        const otherDirection = nextQueue
          .filter(value => value > this.currentFloor)
          .sort((a, b) => a - b);
        this.queue = [...sameDirection, ...otherDirection];
      }

      return { accepted: true };
    }

    this.queue = [floor];
    return { accepted: true };
  }
// Atualiza o estado do elevador a cada intervalo de tempo.
  private tick(): void {
  
    this.justStoppedAt = null;
// Se a fila estiver vazia, o elevador para e fica em modo "idle".
    if (this.queue.length === 0) {
      if (this.direction !== "idle") {
        this.direction = "idle";
      }
      return;
    }

    const target = this.queue[0];

    // Consome a fila: se chegou no alvo, para; senao, anda 1 andar na direcao dele.
    if (this.currentFloor === target) {
      this.justStoppedAt = this.currentFloor; 

      this.queue.shift();

      if (this.queue.length === 0) {
        this.direction = "idle";
      } else {
        const nextTarget = this.queue[0];
        this.direction = nextTarget > this.currentFloor ? "up" : "down";
      }

      return;
    }
// 
    this.direction = target > this.currentFloor ? "up" : "down";
    this.currentFloor += this.direction === "up" ? 1 : -1;

  }
}