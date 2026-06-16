# Woragis Stream — Frontend

Overlays OBS + painel `/control` (Vite + React + TanStack Router).

## Estado atual

- **Hoje:** estado em `localStorage` + `BroadcastChannel` (control ↔ cenas na mesma máquina).
- **Backend:** helpers em `src/lib/api.ts` e `src/config/env.ts` — prontos para integrar REST/WebSocket.

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

App em `http://localhost:5173`.

## Variáveis de ambiente

| Variável | Default | Uso |
|----------|---------|-----|
| `VITE_API_URL` | `http://localhost:8080` | URL base do state-api |
| `VITE_STATE_API_TOKEN` | *(vazio)* | Bearer no `/control` (PUT/PATCH/POST) |
| `VITE_ROOM_ID` | `default` | Room da API |

Exemplo local (com backend em `make run`):

```env
VITE_API_URL=http://localhost:8080
VITE_STATE_API_TOKEN=dev-token
VITE_ROOM_ID=default
```

### Railway / produção

Defina as mesmas vars **no build** do frontend (Vite embute `VITE_*` no bundle):

```env
VITE_API_URL=https://sua-api.railway.app
VITE_STATE_API_TOKEN=seu-token-forte
VITE_ROOM_ID=default
```

Inclua a URL do frontend em `CORS_ORIGINS` na API.

## Como o frontend acha o backend

```ts
import { env } from '@/config/env'
import { roomApiPath, subscribeWsUrl, apiFetch } from '@/lib/api'

// GET público
await fetch(roomApiPath('leetcode/state'))

// PUT autenticado (control)
await apiFetch('session', { method: 'PUT', body: JSON.stringify({ scene: 'live' }) })

// WebSocket overlays
new WebSocket(subscribeWsUrl('all'))
```

- REST: `{VITE_API_URL}/api/v1/rooms/{VITE_ROOM_ID}/…`
- WS: `ws(s)://…/api/v1/rooms/{roomId}/subscribe?domain=all&token=…`

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Dev server |
| `npm run build` | Build produção |
| `npm run preview` | Preview do build |
