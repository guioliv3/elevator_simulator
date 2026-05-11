const minFloor = 0;
const maxFloor = 8;

const panel = document.getElementById("panel");
const elevator = document.getElementById("elevator");
const status = document.getElementById("status");

for (let i = maxFloor; i >= minFloor; i -= 2) {
  const row = document.createElement("div");
  row.className = "row";

  const f1 = i;
  const f2 = i - 1;

  row.appendChild(createButton(f1));
  if (f2 >= minFloor) row.appendChild(createButton(f2));

  panel.appendChild(row);
}

function createButton(floor) {
  const btn = document.createElement("div");
  btn.className = "floor";
  btn.innerText = floor;

  btn.onclick = async () => {
    await fetch("/api/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ floor })
    });
  };

  return btn;
}

function floorToBottom(floor) {
  return floor * 60;
}

async function update() {
  const res = await fetch("/api/state");
  const state = await res.json();

  elevator.style.bottom = floorToBottom(state.currentFloor) + "px";

  status.innerText =
    `Andar: ${state.currentFloor} | Direção: ${state.direction} | Fila: [${state.queue.join(", ")}]`;

  const justStopped = state.justStoppedAt;

  document.querySelectorAll(".floor").forEach(btn => {
    const floor = Number(btn.innerText);

    btn.classList.remove("active", "current", "done");

    if (floor === justStopped) {
      btn.classList.add("done");
      return;
    }

    if (floor === state.currentFloor) {
      btn.classList.add("current");
      return;
    }

    if (state.queue.includes(floor)) {
      btn.classList.add("active");
    }
  });
}

setInterval(update, 400);