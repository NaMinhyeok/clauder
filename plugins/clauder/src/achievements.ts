import { STAT_NAMES, type StatName } from './constants.js';
import type { ClauderState } from './state.js';

interface AchievementContext {
  hour?: number;
  dayOfWeek?: number;
  hallOfFameCount?: number;
}

interface AchievementDef {
  id: string;
  name: string;
  category: string;
  xpReward: number;
  check: (state: ClauderState, ctx: AchievementContext) => boolean;
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  { id: 'first_tool', name: 'First Step', category: 'first_steps', xpReward: 10,
    check: (s) => s.totalToolUses >= 1 },
  { id: 'first_levelup', name: 'Growing Up', category: 'first_steps', xpReward: 20,
    check: (s) => s.level >= 2 },
  { id: 'tools_100', name: 'Century', category: 'effort', xpReward: 30,
    check: (s) => s.totalToolUses >= 100 },
  { id: 'tools_1000', name: 'Thousandaire', category: 'effort', xpReward: 50,
    check: (s) => s.totalToolUses >= 1000 },
  { id: 'streak_7', name: 'Weekly Warrior', category: 'effort', xpReward: 30,
    check: (s) => s.consecutiveDays >= 7 },
  { id: 'streak_30', name: 'Monthly Master', category: 'effort', xpReward: 100,
    check: (s) => s.consecutiveDays >= 30 },
  { id: 'build_dominant', name: 'Master Builder', category: 'style', xpReward: 40,
    check: (s) => statRatio(s, 'build') >= 0.5 },
  { id: 'explore_dominant', name: 'Deep Diver', category: 'style', xpReward: 40,
    check: (s) => statRatio(s, 'explore') >= 0.5 },
  { id: 'all_rounder', name: 'All-Rounder', category: 'style', xpReward: 50,
    check: (s) => STAT_NAMES.every((n) => statRatio(s, n) >= 0.15) },
  { id: 'night_owl', name: 'Night Owl', category: 'time', xpReward: 20,
    check: (_s, ctx) => { const h = ctx?.hour ?? -1; return h >= 0 && h < 5; } },
  { id: 'early_bird', name: 'Early Bird', category: 'time', xpReward: 20,
    check: (_s, ctx) => { const h = ctx?.hour ?? -1; return h >= 5 && h < 7; } },
  { id: 'weekend_warrior', name: 'Weekend Warrior', category: 'time', xpReward: 20,
    check: (_s, ctx) => { const d = ctx?.dayOfWeek ?? -1; return d === 0 || d === 6; } },
  { id: 'first_retire', name: 'Hall of Famer', category: 'special', xpReward: 50,
    check: (_s, ctx) => (ctx?.hallOfFameCount ?? 0) >= 1 },
  { id: 'level_100', name: 'Centurion', category: 'special', xpReward: 100,
    check: (s) => s.level >= 100 },
];

function statRatio(state: ClauderState, statName: StatName): number {
  const total = STAT_NAMES.reduce((sum, n) => sum + state.stats[n], 0);
  if (total === 0) return 0;
  return state.stats[statName] / total;
}

export function checkAchievements(state: ClauderState, unlockedList: { id: string }[], context: AchievementContext = {}) {
  const unlockedIds = new Set(unlockedList.map((a) => a.id));
  const now = new Date();
  const ctx: AchievementContext = { hour: now.getHours(), dayOfWeek: now.getDay(), ...context };

  return ACHIEVEMENT_DEFS
    .filter((def) => !unlockedIds.has(def.id) && def.check(state, ctx))
    .map((def) => ({
      id: def.id, name: def.name, category: def.category,
      xpReward: def.xpReward, unlockedAt: now.toISOString(),
    }));
}
