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
  1: '배고파... 😢',
  2: '좀 힘든데...',
  3: '',
  4: '컨디션 좋아!',
  5: '불타오르고 있어! 🔥',
};

export interface ClassDef {
  name: string;
  emoji: string;
  title: string;
}

export const CLASSES: Record<StatName, ClassDef> = {
  build:   { name: 'Architect',  emoji: '🏗️', title: '코드를 쌓아올리는 자' },
  explore: { name: 'Explorer',   emoji: '🔭', title: '코드베이스를 꿰뚫는 자' },
  debug:   { name: 'Mechanic',   emoji: '🔧', title: '버그를 사냥하는 자' },
  deploy:  { name: 'Operator',   emoji: '🚀', title: '배포의 달인' },
  think:   { name: 'Strategist', emoji: '🧠', title: '아키텍처를 그리는 자' },
  speed:   { name: 'Sprinter',   emoji: '⚡', title: '생산성의 화신' },
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
