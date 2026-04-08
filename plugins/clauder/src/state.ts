import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { Rarity } from './constants.js';
import { rollGacha } from './gacha.js';

const STATE_FILE = 'state.json';
const ACHIEVEMENTS_FILE = 'achievements.json';
const HALL_OF_FAME_FILE = 'hall-of-fame.json';

type StatName = 'build' | 'explore' | 'debug' | 'deploy' | 'think' | 'speed';

export interface ClauderState {
  version: number;
  level: number;
  stats: Record<StatName, number>;
  condition: number;
  lastSessionAt: string | null;
  consecutiveDays: number;
  totalToolUses: number;
  sessionToolUses: number;
  createdAt: string;
  characterId: string;
  rarity: Rarity;
}

export interface Achievement {
  id: string;
  name: string;
  category: string;
  xpReward: number;
  unlockedAt: string;
}

export interface HallOfFameEntry {
  className: string;
  classEmoji: string;
  level: number;
  stats: Record<StatName, number>;
  totalXP: number;
  retiredAt: string;
  createdAt: string;
  playDays: number;
  characterId: string;
  rarity: string;
  characterName: string;
}

export function createFreshState(): ClauderState {
  const gacha = rollGacha();
  return {
    version: 2,
    level: 1,
    stats: { build: 0, explore: 0, debug: 0, deploy: 0, think: 0, speed: 0 },
    condition: 3,
    lastSessionAt: null,
    consecutiveDays: 0,
    totalToolUses: 0,
    sessionToolUses: 0,
    createdAt: new Date().toISOString(),
    characterId: gacha.characterId,
    rarity: gacha.rarity,
  };
}

export function migrateState(state: Record<string, unknown>): ClauderState {
  if ((state.version ?? 1) < 2) {
    const gacha = rollGacha();
    return { ...state, version: 2, characterId: gacha.characterId, rarity: gacha.rarity } as ClauderState;
  }
  return state as ClauderState;
}

async function readJson<T>(dir: string, filename: string, fallback: T | (() => T)): Promise<T> {
  try {
    const data = await readFile(join(dir, filename), 'utf-8');
    return JSON.parse(data);
  } catch {
    return typeof fallback === 'function' ? (fallback as () => T)() : fallback;
  }
}

async function writeJson(dir: string, filename: string, data: unknown): Promise<void> {
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, filename), JSON.stringify(data, null, 2), 'utf-8');
}

export const readState = async (dir: string): Promise<ClauderState> => {
  const raw = await readJson<Record<string, unknown>>(dir, STATE_FILE, createFreshState as unknown as () => Record<string, unknown>);
  return migrateState(raw);
};
export const writeState = (dir: string, state: ClauderState) => writeJson(dir, STATE_FILE, state);
export const readAchievements = (dir: string) => readJson<Achievement[]>(dir, ACHIEVEMENTS_FILE, []);
export const writeAchievements = (dir: string, list: Achievement[]) => writeJson(dir, ACHIEVEMENTS_FILE, list);
export const readHallOfFame = (dir: string) => readJson<HallOfFameEntry[]>(dir, HALL_OF_FAME_FILE, []);
export const writeHallOfFame = (dir: string, list: HallOfFameEntry[]) => writeJson(dir, HALL_OF_FAME_FILE, list);
