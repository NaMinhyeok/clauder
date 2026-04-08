#!/usr/bin/env npx tsx

import { readState, writeState, readAchievements, writeAchievements } from './state.js';
import { resolveToolStat, grantXp, getTotalXp, calculateLevel } from './engine.js';
import { updateConditionOnSessionStart, checkConditionRecovery } from './condition.js';
import { determineClass, getEvolutionStage } from './class.js';
import { checkAchievements } from './achievements.js';
import { SPEED_THRESHOLDS, CONDITION_MESSAGES, type StatName } from './constants.js';

interface HookInput {
  tool_name?: string;
  tool_input?: Record<string, unknown>;
  [key: string]: unknown;
}

interface HookOutput {
  additionalContext?: string;
}

const [,, action, dataDir] = process.argv;

if (!action || !dataDir) {
  process.stderr.write('Usage: cli.ts <action> <dataDir>\n');
  process.exit(1);
}

let hookInput: HookInput = {};
try {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString();
  if (raw.trim()) hookInput = JSON.parse(raw);
} catch {
  // stdin may be empty
}

const result = await handleAction(action, dataDir, hookInput);
process.stdout.write(JSON.stringify(result));

async function handleAction(action: string, dataDir: string, input: HookInput): Promise<HookOutput> {
  switch (action) {
    case 'post-tool-use': return handlePostToolUse(dataDir, input);
    case 'session-start': return handleSessionStart(dataDir);
    case 'session-end': return handleSessionEnd(dataDir);
    default: return {};
  }
}

async function handlePostToolUse(dataDir: string, input: HookInput): Promise<HookOutput> {
  let state = await readState(dataDir);
  const toolName = input.tool_name || '';
  const toolInput = input.tool_input || {};

  const { stat, xp } = resolveToolStat(toolName, toolInput, state);
  const prevLevel = state.level;
  const prevClass = determineClass(state.stats);

  state = grantXp(state, stat, xp);
  state.condition = checkConditionRecovery(state.condition, state.sessionToolUses);
  state.level = calculateLevel(getTotalXp(state));

  const unlocked = await readAchievements(dataDir);
  const newAchievements = checkAchievements(state, unlocked);

  for (const ach of newAchievements) {
    const entries = Object.entries(state.stats).sort((a, b) => a[1] - b[1]);
    state.stats[entries[0][0] as StatName] += ach.xpReward;
    unlocked.push(ach);
  }

  if (newAchievements.length > 0) {
    state.level = calculateLevel(getTotalXp(state));
    await writeAchievements(dataDir, unlocked);
  }

  await writeState(dataDir, state);

  const messages: string[] = [];

  if (state.level > prevLevel) {
    messages.push(`🎉 LEVEL UP! Lv.${prevLevel} → Lv.${state.level}`);
  }

  const newClass = determineClass(state.stats);
  if (newClass && (!prevClass || prevClass.name !== newClass.name) && state.level >= 10) {
    messages.push(`✨ Evolved! → ${newClass.emoji} ${newClass.name}`);
  }

  for (const ach of newAchievements) {
    messages.push(`🏆 Achievement unlocked: ${ach.name}`);
  }

  if (messages.length === 0) return {};
  return { additionalContext: messages.join('\n') };
}

async function handleSessionStart(dataDir: string): Promise<HookOutput> {
  let state = await readState(dataDir);
  const now = new Date();
  const prevLastSession = state.lastSessionAt;

  state.condition = updateConditionOnSessionStart(state.condition, state.lastSessionAt, now);

  if (state.lastSessionAt) {
    const last = new Date(state.lastSessionAt);
    const diffDays = Math.floor((now.getTime() - last.getTime()) / 86400000);
    state.consecutiveDays = diffDays <= 1 ? state.consecutiveDays + 1 : 1;
  } else {
    state.consecutiveDays = 1;
  }

  state.sessionToolUses = 0;
  state.lastSessionAt = now.toISOString();
  await writeState(dataDir, state);

  let greeting: string;
  if (!prevLastSession) {
    greeting = 'Welcome back! 🙌';
  } else {
    const days = Math.floor((now.getTime() - new Date(prevLastSession).getTime()) / 86400000);
    if (days < 1) greeting = 'Welcome back! 🙌';
    else if (days < 3) greeting = 'Missed you!';
    else if (days < 7) greeting = 'Long time no see~ Where have you been?';
    else greeting = '...I thought you forgot about me 😢';
  }

  const cls = determineClass(state.stats);
  const stage = getEvolutionStage(state.level);
  const name = cls ? `${cls.emoji} ${cls.name}` : `${stage.emoji} ${stage.name}`;
  const condMsg = CONDITION_MESSAGES[state.condition];

  const lines: string[] = [`${name} Lv.${state.level} — ${greeting}`];
  if (condMsg) lines.push(condMsg);
  if (state.consecutiveDays >= 7 && state.consecutiveDays % 7 === 0) {
    lines.push(`🔥 ${state.consecutiveDays} day streak! Amazing!`);
  }

  return { additionalContext: lines.join('\n') };
}

async function handleSessionEnd(dataDir: string): Promise<HookOutput> {
  let state = await readState(dataDir);

  for (const threshold of SPEED_THRESHOLDS) {
    if (state.sessionToolUses >= threshold.min) {
      state.stats.speed += threshold.xp;
      break;
    }
  }

  state.level = calculateLevel(getTotalXp(state));
  await writeState(dataDir, state);
  return {};
}
