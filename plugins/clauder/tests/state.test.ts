import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readState, writeState, readAchievements, writeAchievements, readHallOfFame, writeHallOfFame, createFreshState, migrateState } from '../src/state.js';

describe('state', () => {
  let dataDir: string;

  beforeEach(async () => {
    dataDir = await mkdtemp(join(tmpdir(), 'clauder-test-'));
  });

  afterEach(async () => {
    await rm(dataDir, { recursive: true });
  });

  it('creates fresh state with zero stats', () => {
    const state = createFreshState();
    expect(state.version).toBe(2);
    expect(state.level).toBe(1);
    expect(state.stats.build).toBe(0);
    expect(state.stats.explore).toBe(0);
    expect(state.stats.debug).toBe(0);
    expect(state.stats.deploy).toBe(0);
    expect(state.stats.think).toBe(0);
    expect(state.stats.speed).toBe(0);
    expect(state.condition).toBe(3);
    expect(state.consecutiveDays).toBe(0);
    expect(state.totalToolUses).toBe(0);
    expect(state.sessionToolUses).toBe(0);
    expect(state.characterId).toBeDefined();
    expect(state.rarity).toBeDefined();
  });

  it('returns fresh state when no file exists', async () => {
    const state = await readState(dataDir);
    expect(state.level).toBe(1);
  });

  it('round-trips state through write and read', async () => {
    const state = createFreshState();
    state.level = 5;
    state.stats.build = 100;
    await writeState(dataDir, state);
    const loaded = await readState(dataDir);
    expect(loaded.level).toBe(5);
    expect(loaded.stats.build).toBe(100);
  });

  it('returns empty array when no achievements file exists', async () => {
    const achievements = await readAchievements(dataDir);
    expect(achievements).toEqual([]);
  });

  it('round-trips achievements', async () => {
    const list = [{ id: 'first_tool', name: 'First Step', category: 'first_steps', xpReward: 10, unlockedAt: '2026-04-08T00:00:00Z' }];
    await writeAchievements(dataDir, list);
    const loaded = await readAchievements(dataDir);
    expect(loaded).toEqual(list);
  });

  it('returns empty array when no hall of fame file exists', async () => {
    const hall = await readHallOfFame(dataDir);
    expect(hall).toEqual([]);
  });

  it('round-trips hall of fame', async () => {
    const entry = { className: 'Architect', classEmoji: '🏗️', level: 87, stats: { build: 100, explore: 50, debug: 30, deploy: 20, think: 10, speed: 5 }, totalXP: 215, retiredAt: '2026-05-15', createdAt: '2026-04-01', playDays: 44 };
    await writeHallOfFame(dataDir, [entry]);
    const loaded = await readHallOfFame(dataDir);
    expect(loaded[0].className).toBe('Architect');
  });
});

describe('migrateState', () => {
  it('adds characterId and rarity to v1 state', () => {
    const v1 = {
      version: 1,
      level: 10,
      stats: { build: 100, explore: 50, debug: 30, deploy: 20, think: 10, speed: 5 },
      condition: 3,
      lastSessionAt: null,
      consecutiveDays: 5,
      totalToolUses: 200,
      sessionToolUses: 0,
      createdAt: '2026-01-01T00:00:00Z',
    };
    const migrated = migrateState(v1);
    expect(migrated.version).toBe(2);
    expect(migrated.characterId).toBeDefined();
    expect(migrated.rarity).toBeDefined();
    expect(['common', 'rare', 'epic']).toContain(migrated.rarity);
  });

  it('does not re-migrate v2 state', () => {
    const v2 = {
      version: 2,
      level: 10,
      stats: { build: 100, explore: 50, debug: 30, deploy: 20, think: 10, speed: 5 },
      condition: 3,
      lastSessionAt: null,
      consecutiveDays: 5,
      totalToolUses: 200,
      sessionToolUses: 0,
      createdAt: '2026-01-01T00:00:00Z',
      characterId: 'mochi',
      rarity: 'epic' as const,
    };
    const result = migrateState(v2);
    expect(result.characterId).toBe('mochi');
    expect(result.rarity).toBe('epic');
  });
});
