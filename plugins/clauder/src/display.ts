import { STAT_NAMES, RARITY_WEIGHTS, type Rarity, type Condition } from './constants.js';
import { determineClass, getEvolutionStage } from './class.js';
import { getExpProgress, getTotalXp } from './engine.js';
import { getCharacter } from './characters.js';
import type { ClauderState } from './state.js';

export function renderBar(ratio: number, width = 12): string {
  const clamped = Math.max(0, Math.min(1, ratio));
  const filled = Math.round(clamped * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

export function renderExpBar(current: number, needed: number): string {
  const safeCurrentf = Math.max(0, current);
  const ratio = needed > 0 ? safeCurrentf / needed : 0;
  const bar = renderBar(ratio, 12);
  const pct = Math.round(Math.max(0, Math.min(1, ratio)) * 100);
  return `EXP [${bar}] ${pct}% (${safeCurrentf.toLocaleString('en-US')}/${needed.toLocaleString('en-US')})`;
}

export function renderConditionStars(condition: number): string {
  return '★'.repeat(condition) + '☆'.repeat(5 - condition);
}

export function renderStatLine(name: string, ratio: number, absolute: number): string {
  const bar = renderBar(ratio, 10);
  const pct = `${Math.round(ratio * 100)}%`.padStart(4);
  const abs = absolute.toLocaleString('en-US').padStart(6);
  return `${name.padEnd(7)} ${bar} ${pct} ${abs}`;
}

interface CardOptions {
  achievementCount?: number;
  totalAchievements?: number;
}

export function renderCard(state: ClauderState, { achievementCount = 0, totalAchievements = 0 }: CardOptions = {}): string {
  const character = getCharacter(state.characterId);
  const rarityDef = RARITY_WEIGHTS.find((r) => r.id === state.rarity);
  const cls = determineClass(state.stats);
  const stage = getEvolutionStage(state.level);
  const className = cls ? cls.name : stage.name;

  // ASCII art
  const condition = state.condition as Condition;
  const rarity = state.rarity as Rarity;
  const artLines = character
    ? character.art[rarity][condition]
    : ['╭─────────╮', '│  ? ? ?  │', '│   ???   │', '╰─────────╯'];

  // EXP bar
  const totalXp = getTotalXp(state);
  const exp = getExpProgress(totalXp, state.level);
  const expBar = renderExpBar(exp.current, exp.needed);

  // Card assembly
  const charInfo = character
    ? `${character.name} ${rarityDef?.stars ?? '???'} ${rarityDef?.name ?? ''}`
    : 'Unknown';
  const levelLine = `Lv.${state.level} ${className} | 🔥 ${state.consecutiveDays}d`;
  const footer = `🏆 ${achievementCount}/${totalAchievements}`;

  const lines = [
    ...artLines.map((line) => `  ${line}`),
    `  ${charInfo}`,
    `  ${levelLine}`,
    `  ${expBar}`,
    `  ${footer}`,
  ];

  return lines.join('\n');
}
