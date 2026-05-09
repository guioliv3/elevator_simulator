# Simulador de Elevador (backend)

Backend em TypeScript + Express que simula um elevador com fila e interpolacao de paradas durante o movimento. O elevador tem andares de 0 a 8 e demora 2 segundos por andar.

## Requisitos

- Node.js 18+
- PostgreSQL 14+

## Instalacao

1. Instale dependencias:

	 ```bash
	 npm install
	 ```

## Banco de dados

1. Crie um banco chamado `elevator`.
2. Aplique o schema:

	 ```bash
	 psql -d elevator -f db/schema.sql
	 ```

3. Configure a variavel `DATABASE_URL`.

	 Copie `.env.example` para `.env` e ajuste o valor:

	 ```bash
	 DATABASE_URL=postgres://user:password@localhost:5432/elevator
	 ```

Observacao: se `DATABASE_URL` nao estiver definido, o app roda sem gravar eventos no banco.

## Executar

- Desenvolvimento:

	```bash
	npm run dev
	```

- Producao:

	```bash
	npm run build
	npm run start
	```

## Testes

Os testes usam Vitest + Supertest.

```bash
npm test
```

## Demo via script

Este script demonstra o elevador andando e recebendo novos andares durante o percurso:

```bash
npx tsx scripts/demo.ts
```

## API

Base URL: `http://localhost:3000/api`

Uso informal no front-end (exemplos rapidos):

- Use `POST /api/request` quando o usuario apertar um botao de andar.
- Use `GET /api/state` para mostrar o andar atual e a direcao do elevador.
- Use `GET /api/queue` para mostrar quais andares estao pressionados.

### GET `/api/state`
Retorna o estado completo do elevador.

Resposta 200:
```json
{
	"currentFloor": 2,
	"direction": "up",
	"queue": [5, 7],
	"moving": true
}
```

### GET `/api/queue`
Retorna apenas a fila.

Resposta 200:
```json
{
	"queue": [5, 7]
}
```

### POST `/api/request`
Enfileira um andar.

Body:
```json
{ "floor": 5 }
```

Resposta 202:
```json
{ "accepted": true }
```

Erros 400:
```json
{ "error": "floor-must-be-integer" }
```
```json
{ "error": "floor-out-of-range" }
```
```json
{ "error": "already-at-floor" }
```
```json
{ "error": "already-queued" }
```

### GET `/api/health`
Health check simples.

Resposta 200:
```json
{ "ok": true }
```

### Polling recomendado (front-end)
Nao ha WebSocket. Para animar o elevador no front-end, faca polling em `/api/state` a cada 500ms ou 1s.

Exemplo (fetch):
```js
setInterval(async () => {
	const res = await fetch("http://localhost:3000/api/state");
	const state = await res.json();
	console.log(state);
}, 1000);
```

### CORS (caso o front rode em outra porta)
Se o front-end rodar em outro host/porta, ative CORS no Express e documente a origem permitida.

## Regra de interpolacao

Se o elevador estiver indo para um destino e um novo andar for solicitado entre o andar atual e o destino (na mesma direcao), ele entra como parada intermediaria.
