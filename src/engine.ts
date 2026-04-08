import { TOOL_STAT_MAP, BASH_KEYWORDS, CONDITION_MULTIPLIERS, STAT_NAMES, FALLBACK_XP, xpForNextLevel, type StatName, type StatMapping } from './constants.js';
import type { ClauderState } from './state.js';

export function resolveToolStat(toolName: string, toolInput: Record<string, unknown>, state: ClauderState | null = null): StatMapping {
  if (TOOL_STAT_MAP[toolName]) {
    return TOOL_STAT_MAP[toolName];
  }

  if (toolName === 'Bash') {
    const cmd = (toolInput?.command as string || '').toLowerCase();
    for (const keyword of BASH_KEYWORDS.debug) {
      if (cmd.includes(keyword)) return { stat: 'debug', xp: 5 };
    }
    for (const keyword of BASH_KEYWORDS.deploy) {
      if (cmd.includes(keyword)) return { stat: 'deploy', xp: 3 };
    }
    return { stat: 'debug', xp: 2 };
  }

  const stat = findLowestStat(state);
  return { stat, xp: FALLBACK_XP };
}

function findLowestStat(state: ClauderState | null): StatName {
  if (!state) return STAT_NAMES[0];
  let minStat: StatName = STAT_NAMES[0];
  let minVal = Infinity;
  for (const name of STAT_NAMES) {
    if (state.stats[name] < minVal) {
      minVal = state.stats[name];
      minStat = name;
    }
  }
  return minStat;
}

export function grantXp(state: ClauderState, stat: StatName, baseXp: number): ClauderState {
  const multiplier = CONDITION_MULTIPLIERS[state.condition] || 1.0;
  const xp = Math.round(baseXp * multiplier);
  return {
    ...state,
    stats: { ...state.stats, [stat]: state.stats[stat] + xp },
    totalToolUses: state.totalToolUses + 1,
    sessionToolUses: state.sessionToolUses + 1,
  };
}

export function getTotalXp(state: ClauderState): number {
  return STAT_NAMES.reduce((sum, name) => sum + state.stats[name], 0);
}

export function calculateLevel(totalXp: number): number {
  let level = 1;
  let xpNeeded = 0;
  while (true) {
    xpNeeded += xpForNextLevel(level);
    if (totalXp < xpNeeded) break;
    level++;
  }
  return level;
}
