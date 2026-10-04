# PUBG Mobile Event Backend

Player ID → Nickname lookup service for the PUBG Mobile Event frontend.

## Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| `mock` | Local deterministic fake data | **Default** - zero config, instant, works offline |
| `proxy` | Forwards to real Midasbuy API | Production - requires paid API key |

## Quick Start (Local Dev)

```bash
# 1. Start everything with docker-compose
docker compose up --build

# 2. Open frontend
# http://localhost:5173

# 3. API health check
curl http://localhost:3001/health
# {"status":"ok","mode":"mock"}

# 4. Test player lookup
curl -X POST http://localhost:3001/api/player/lookup \
  -H "Content-Type: application/json" \
  -d '{"player_id": "535123456"}'
```

## API

### POST `/api/player/lookup`

**Request:**
```json
{ "player_id": "535123456" }
```

**Success Response:**
```json
{
  "success": true,
  "player_id": "535123456",
  "nickname": "ShadowWolf1234",
  "zone_id": "3",
  "is_ban": false
}
```

**Error Response:**
```json
{ "success": false, "error": "Player not found", "player_id": "535123456" }
```

### GET `/health`

Returns `{ "status": "ok", "mode": "mock|proxy" }`

## Configuration

Copy `backend/.env.example` to `backend/.env` and adjust:

```env
MODE=mock                    # or 'proxy'
MIDASBUY_API_KEY=your_key    # required for proxy mode
MIDASBUY_BASE_URL=https://midasbuy.night-apis.com
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_MAX=30
```

### Getting a Real Midasbuy API Key

1. **NightsSoftware**: Contact [@NightStrang6r](https://t.me/NightStrang6r) on Telegram
   - Endpoint: `https://midasbuy.night-apis.com/api/v1/pubg/getPlayer`
   - Header: `X-Api-Key: <your_key>`

2. **exfador**: Contact [@exfador](https://t.me/exfador) on Telegram
   - Endpoint: `https://midasbuy-api.com/api/v1/pubg/getPlayer` (or self-hosted)
   - Header: `x-key: <your_key>`

## Project Structure

```
backend/
├── src/
│   ├── index.js              # Express app entry
│   ├── config.js             # Env configuration
│   ├── services/
│   │   └── playerLookup.js   # Mock + proxy implementations
│   ├── middleware/
│   │   └── errorHandler.js   # Error handling
│   └── utils/
│       └── fetch.js          # Fetch with timeout
├── test/
│   └── playerLookup.test.js  # Unit tests
├── Dockerfile                # Multi-stage build
├── package.json
└── .env.example
```

## Running Tests

```bash
cd backend
npm test
```

## Production Deployment

```bash
# Build production image
docker build -t pubg-event-api --target prod ./backend

# Run with proxy mode and real API key
docker run -d \
  -p 3001:3001 \
  -e MODE=proxy \
  -e MIDASBUY_API_KEY=your_real_key \
  -e MIDASBUY_BASE_URL=https://midasbuy.night-apis.com \
  -e NODE_ENV=production \
  pubg-event-api
```

## Frontend Integration

The frontend (`index.html` + `js/script.js`) calls the backend via:

```js
window.__ENV__ = { API_BASE: 'http://localhost:3001' };
```

For production, inject the real API URL at build/deploy time (e.g., via nginx `sub_filter` or Vite `define`).