/**
 * Configuration - all via env vars with sensible defaults for local dev
 */
const isDev = process.env.NODE_ENV !== 'production';

// Mode: 'mock' (local fake data) | 'proxy' (forward to real Midasbuy API)
const mode = process.env.MODE || 'mock';

export const config = {
  port: Number(process.env.PORT) || 3001,
  isDev,
  mode,
  corsOrigin: process.env.CORS_ORIGIN || (isDev ? '*' : 'http://localhost:5173'),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 30,

  // Midasbuy API (used only in 'proxy' mode)
  midasbuyBaseUrl: process.env.MIDASBUY_BASE_URL || 'https://midasbuy.night-apis.com',
  midasbuyApiKey: process.env.MIDASBUY_API_KEY || '',  // X-Api-Key header
  midasbuyTimeout: Number(process.env.MIDASBUY_TIMEOUT) || 8000,

  // Mock data seed (deterministic "fake" nicknames for same ID)
  mockSeed: process.env.MOCK_SEED || 'pubg-event-2026'
};