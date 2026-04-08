import { STAT_NAMES, type StatName } from './constants.js';
import { determineClass, getEvolutionStage } from './class.js';
import type { ClauderState } from './state.js';

export function renderBar(ratio: number, width = 10): string {
  const filled = Math.round(ratio * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
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
  const totalXp = STAT_NAMES.reduce((sum, s) => sum + state.stats[s], 0);
  const cls = determineClass(state.stats);
  const stage = getEvolutionStage(state.level);

  const emoji = cls ? cls.emoji : stage.emoji;
  const className = cls ? cls.name : stage.name;

  const header = `${emoji} ${className} Lv.${state.level} | 🔥 ${state.consecutiveDays}일 | ⭐ ${renderConditionStars(state.condition)}`;
  const separator = '─'.repeat(35);

  const statEntries = STAT_NAMES.map((s) => ({
    name: s.toUpperCase(),
    ratio: totalXp > 0 ? state.stats[s] / totalXp : 0,
    absolute: state.stats[s],
  }));
  statEntries.sort((a, b) => b.absolute - a.absolute);

  const statLines = statEntries.map((e) => renderStatLine(e.name, e.ratio, e.absolute)).join('\n');
  const footer = `🏆 업적 ${achievementCount}/${totalAchievements}`;

  return `${header}\n${separator}\n${statLines}\n${separator}\n${footer}`;
}
