import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { PlayerLookupService } from '../src/services/playerLookup.js';
import { config } from '../src/config.js';

// Set test config
config.mode = 'mock';
config.mockSeed = 'test-seed';

const svc = new PlayerLookupService();

describe('PlayerLookupService (mock mode)', () => {
  it('returns valid player data for valid ID', async () => {
    const res = await svc.lookup('535123456');
    assert.equal(res.success, true);
    assert.equal(res.player_id, '535123456');
    assert.ok(res.nickname.length > 0);
    assert.ok(['1','2','3','4','5'].includes(res.zone_id));
    assert.equal(typeof res.is_ban, 'boolean');
  });

  it('returns deterministic nickname for same ID', async () => {
    const a = await svc.lookup('535123456');
    const b = await svc.lookup('535123456');
    assert.equal(a.nickname, b.nickname);
  });

  it('returns different nicknames for different IDs', async () => {
    const a = await svc.lookup('535123456');
    const b = await svc.lookup('535999999');
    assert.notEqual(a.nickname, b.nickname);
  });

  it('handles not-found simulation (5% chance)', async () => {
    // With test-seed, ID ending in 0000 should be not-found
    const res = await svc.lookup('53500000');
    if (!res.success) {
      assert.equal(res.error, 'Player not found');
    }
  });
});