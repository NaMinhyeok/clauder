export const STAT_NAMES = ['build', 'explore', 'debug', 'deploy', 'think', 'speed'] as const;
export type StatName = (typeof STAT_NAMES)[number];

export interface StatMapping {
  stat: StatName;
  xp: number;
}

export const TOOL_STAT_MAP: Record<string, StatMapping> = {
  Write: { stat: 'build', xp: 5 },
  Edit: { stat: 'build', xp: 3 },
  Read: { stat: 'explore', xp: 2 },
  Grep: { stat: 'explore', xp: 3 },
  Glob: { stat: 'explore', xp: 1 },
  Agent: { stat: 'think', xp: 5 },
};

export const BASH_KEYWORDS: Record<string, string[]> = {
  debug: ['test', 'jest', 'pytest', 'vitest'],
  deploy: ['git commit', 'git push', 'deploy', 'vercel'],
};

export const FALLBACK_XP = 1;

export const SPEED_THRESHOLDS = [
  { min: 50, xp: 10 },
  { min: 30, xp: 5 },
  { min: 10, xp: 2 },
] as const;

export const CONDITION_MULTIPLIERS: Record<number, number> = {
  1: 0.5,
  2: 0.7,
  3: 1.0,
  4: 1.2,
  5: 1.5,
};

export const CONDITION_MESSAGES: Record<number, string> = {
  1: 'Hungry... 😢',
  2: 'Feeling rough...',
  3: '',
  4: 'Feeling good!',
  5: 'On fire! 🔥',
};

export interface ClassDef {
  name: string;
  emoji: string;
  title: string;
}

export const CLASSES: Record<StatName, ClassDef> = {
  build:   { name: 'Architect',  emoji: '🏗️', title: 'The one who builds code' },
  explore: { name: 'Explorer',   emoji: '🔭', title: 'The one who reads all code' },
  debug:   { name: 'Mechanic',   emoji: '🔧', title: 'The bug hunter' },
  deploy:  { name: 'Operator',   emoji: '🚀', title: 'The deploy master' },
  think:   { name: 'Strategist', emoji: '🧠', title: 'The architecture designer' },
  speed:   { name: 'Sprinter',   emoji: '⚡', title: 'The productivity machine' },
};

export interface EvolutionStage {
  minLevel: number;
  maxLevel: number;
  name: string;
  emoji: string | null;
}

export const EVOLUTION_STAGES: EvolutionStage[] = [
  { minLevel: 1,  maxLevel: 9,        name: 'Apprentice', emoji: '🥚' },
  { minLevel: 10, maxLevel: 24,       name: 'Adept',      emoji: null },
  { minLevel: 25, maxLevel: 39,       name: 'Expert',     emoji: null },
  { minLevel: 40, maxLevel: Infinity, name: 'Master',     emoji: '👑' },
];

export function xpForNextLevel(level: number): number {
  if (level <= 1) return 100;
  return Math.round(100 * Math.pow(1.15, level));
}

export type Rarity = 'common' | 'rare' | 'epic';
export type Condition = 1 | 2 | 3 | 4 | 5;

export interface RarityDef {
  id: Rarity;
  name: string;
  stars: string;
  weight: number; // 0-100
}

export const RARITY_WEIGHTS: RarityDef[] = [
  { id: 'common', name: 'Common', stars: '★☆☆', weight: 55 },
  { id: 'rare',   name: 'Rare',   stars: '★★☆', weight: 35 },
  { id: 'epic',   name: 'Epic',   stars: '★★★', weight: 10 },
];
