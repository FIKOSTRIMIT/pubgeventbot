/**
 * Player Lookup Service
 * Supports 'mock' mode (local deterministic fake data) and 'proxy' mode (real Midasbuy API)
 */
import { config } from '../config.js';
import { fetchWithTimeout } from '../utils/fetch.js';

const NICKNAME_ADJECTIVES = [
  'Shadow', 'Phantom', 'Viper', 'Ghost', 'Rogue', 'Blaze', 'Frost', 'Storm',
  'Hunter', 'Striker', 'Sniper', 'Raider', 'Warden', 'Reaper', 'Titan', 'Nova'
];
const NICKNAME_NOUNS = [
  'Wolf', 'Eagle', 'Dragon', 'Tiger', 'Hawk', 'Lion', 'Bear', 'Fox',
  'Raven', 'Shark', 'Cobra', 'Panther', 'Falcon', 'Vulture', 'Scorpion', 'Mantis'
];

/**
 * Deterministic pseudo-random from string seed (for consistent mock nicknames)
 */
function hashString(str) {
  let h = 0x811c9dc5; // FNV-1a 32-bit
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function pick(arr, seed) {
  return arr[hashString(seed) % arr.length];
}

function generateMockNickname(playerId, seed) {
  const adj = pick(NICKNAME_ADJECTIVES, `${seed}-adj-${playerId}`);
  const noun = pick(NICKNAME_NOUNS, `${seed}-noun-${playerId}`);
  const num = (hashString(`${seed}-num-${playerId}`) % 9000 + 1000).toString().padStart(4, '0');
  return `${adj}${noun}${num}`;
}

/**
 * Mock implementation - returns plausible fake data instantly
 */
async function lookupMock(playerId) {
  // Simulate tiny network delay
  await new Promise(r => setTimeout(r, Math.random() * 120 + 40));

  // Mock mode: always return success with deterministic nickname
  // (no random "not found" / "banned" - those were for UI testing only)
  const isBan = false;

  return {
    success: true,
    player_id: playerId,
    nickname: generateMockNickname(playerId, config.mockSeed),
    zone_id: String((hashString(`${config.mockSeed}-zone-${playerId}`) % 5) + 1),
    is_ban: isBan
  };
}

/**
 * Proxy implementation - forwards to Midasbuy API
 * Expected external API: POST /api/v1/pubg/getPlayer with { player_id }
 * Response format (per NightsSoftware/MidasbuyAPI):
 *   { success: true, data: { status: 'success', player_id, player_name } }
 */
async function lookupProxy(playerId) {
  const url = `${config.midasbuyBaseUrl.replace(/\/$/, '')}/api/v1/pubg/getPlayer`;
  const headers = {
    'Content-Type': 'application/json',
    ...(config.midasbuyApiKey ? { 'X-Api-Key': config.midasbuyApiKey } : {})
  };

  try {
    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ player_id: playerId })
    }, config.midasbuyTimeout);

    const data = await res.json();

    // Normalize response to our internal format
    if (!res.ok) {
      return { success: false, error: data?.message || `HTTP ${res.status}`, player_id: playerId };
    }

    // Handle NightsSoftware format: { success: true, data: { status: 'success', player_name, player_id } }
    if (data?.success && data?.data?.status === 'success') {
      return {
        success: true,
        player_id: data.data.player_id,
        nickname: data.data.player_name,
        zone_id: '1', // not provided by this API
        is_ban: false
      };
    }

    // Handle exfador format: { success: true, player_id, nickname, zone_id, is_ban }
    if (data?.success && data?.nickname) {
      return {
        success: true,
        player_id: data.player_id,
        nickname: data.nickname,
        zone_id: data.zone_id || '1',
        is_ban: data.is_ban || false
      };
    }

    // Generic failure
    return { success: false, error: data?.message || 'Unknown API response', player_id: playerId };

  } catch (err) {
    if (err.name === 'TimeoutError' || err.code === 'ETIMEDOUT') {
      return { success: false, error: 'Upstream timeout', player_id: playerId };
    }
    return { success: false, error: `Proxy error: ${err.message}`, player_id: playerId };
  }
}

export class PlayerLookupService {
  async lookup(playerId) {
    if (config.mode === 'proxy') {
      return lookupProxy(playerId);
    }
    return lookupMock(playerId);
  }
}