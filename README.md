# Woragis Stream — Frontend

Overlays OBS + painel `/control` (Vite + React + TanStack Router).

## Estado atual

- **Dual brand:** `@WoragisCodes` (rotas `/codes/*`) e `@WoragisCalisthenics` (`/calisthenics/*`).
- **Duas rooms na API:** `codes` e `calisthenics` — cada overlay resolve a room pela rota; o control usa `?room=codes|calisthenics`.
- **Sync com API:** com `VITE_API_SYNC=true`, o control faz PUT debounced e os overlays recebem updates via WebSocket.
- **Fallback local:** sem sync, continua `localStorage` + `BroadcastChannel` na mesma máquina.

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
| `VITE_ROOM_ID` | `codes` | Room padrão (control sem `?room=`) |
| `VITE_API_SYNC` | *(off)* | `true` para sincronizar com a API |

Exemplo local (com backend em `make run`):

```env
VITE_API_URL=http://localhost:8080
VITE_STATE_API_TOKEN=dev-token
VITE_ROOM_ID=codes
VITE_API_SYNC=true
```

### Railway / produção

Defina as mesmas vars **no build** do frontend (Vite embute `VITE_*` no bundle):

```env
VITE_API_URL=https://sua-api.railway.app
VITE_STATE_API_TOKEN=seu-token-forte
VITE_ROOM_ID=codes
VITE_API_SYNC=true
```

Inclua a URL do frontend em `CORS_ORIGINS` na API.

## Rotas OBS

| Rota | Room |
|------|------|
| `/codes/starting-soon?obs=1` | `codes` |
| `/codes/main?obs=1` | `codes` |
| `/codes/brb?obs=1` | `codes` |
| `/codes/whiteboard?obs=1` | `codes` |
| `/calisthenics/main?obs=1` | `calisthenics` |
| `/control?room=codes` | control → room `codes` |

## Como o frontend acha o backend

```ts
import { env } from '@/config/env'
import { roomApiPath, subscribeWsUrl, apiFetch } from '@/lib/api'
import { resolveRoomId } from '@/lib/room'

// GET público (room da rota ou env)
await fetch(roomApiPath('leetcode/state', 'codes'))

// PUT autenticado (control)
await apiFetch('session', { method: 'PUT', body: JSON.stringify({ scene: 'live' }) }, 'codes')

// WebSocket overlays
new WebSocket(subscribeWsUrl('all', 'codes'))
```

- REST: `{VITE_API_URL}/api/v1/rooms/{roomId}/…`
- WS: `ws(s)://…/api/v1/rooms/{roomId}/subscribe?domain=all&token=…`

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Dev server |
| `npm run build` | Build produção |
| `npm run preview` | Preview do build |
