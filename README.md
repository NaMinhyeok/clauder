# Clauder

RPG + Tamagotchi gamification plugin for Claude Code — every tool use grows your coding companion.

## Overview

Clauder turns your Claude Code sessions into an RPG. Every tool you use earns XP across 6 stats, determines your class, and evolves your companion through 4 stages. Keep coding daily to maintain high condition (up to 1.5x XP bonus), unlock 15 hidden achievements, and retire legendary companions to the Hall of Fame.

Your companion's class is determined by your dominant stat — heavy file writers become Architects, test runners become Mechanics, and git deployers become Operators.

## Commands

### `/clauder`

Displays your companion's main status card with class, level, condition, and stat distribution.

**What it does:**
1. Reads your current companion state
2. Renders a visual card with stat bars, class, and condition stars
3. Shows achievement progress

**Usage:**
```bash
/clauder
```

**Example output:**
```
🏗️ Architect Lv.12 | 🔥 5d | ⭐ ★★★★☆
───────────────────────────────────
BUILD   ████████░░  42%  1,260 XP
EXPLORE ██████░░░░  28%    840 XP
THINK   ███░░░░░░░  14%    420 XP
DEBUG   ██░░░░░░░░   8%    240 XP
DEPLOY  █░░░░░░░░░   5%    150 XP
SPEED   █░░░░░░░░░   3%     90 XP
───────────────────────────────────
🏆 Achievements 4/15
```

### `/clauder-stats`

Shows detailed stat breakdown with XP progress toward the next level.

**What it does:**
1. Reads current state
2. Calculates XP needed for next level
3. Displays condition multiplier and streak info

**Usage:**
```bash
/clauder-stats
```

**Example output:**
```
🏗️ Architect Lv.12
XP: 340/535 (next level)
Condition: ★★★★☆ (x1.2)

───── Stat Details ─────
BUILD   ████████░░  42%  1,260 XP
EXPLORE ██████░░░░  28%    840 XP
...
────────────────────────
Total XP: 3,000 | Tools: 482 | Streak: 5d
```

### `/clauder-hall`

Displays the Hall of Fame — a record of all retired companions.

**What it does:**
1. Reads the hall of fame and current state
2. Lists retired companions with class, level, and play duration
3. Shows current companion for comparison

**Usage:**
```bash
/clauder-hall
```

**Example output:**
```
┌─ Hall of Fame ────────────────┐
│ #1 🏗️ Architect Lv.42        │
│    Retired: 2026-03-15        │
│    Played: 30d                │
├───────────────────────────────┤
│ Current: 🔭 Explorer Lv.8    │
└───────────────────────────────┘
```

### `/clauder-achieve`

Shows your achievement list with unlock status.

**What it does:**
1. Reads achievement data
2. Displays all 15 achievements grouped by category
3. Shows unlocked (✅) and locked (⬜ ???) achievements

**Usage:**
```bash
/clauder-achieve
```

**Achievement categories:**
- **First Steps**: First Step, Growing Up
- **Effort**: Century, Thousandaire, Weekly Warrior, Monthly Master
- **Style**: Master Builder, Deep Diver, All-Rounder
- **Time**: Night Owl, Early Bird, Weekend Warrior
- **Special**: Hall of Famer, Centurion

### `/clauder-retire`

Retires your current companion to the Hall of Fame and starts fresh. Requires Lv.40+.

**What it does:**
1. Checks if companion is Lv.40 or higher
2. Asks for confirmation
3. Saves companion to Hall of Fame with final stats
4. Resets state to a new Lv.1 Apprentice

**Usage:**
```bash
/clauder-retire
```

**Requirements:**
- Companion must be Lv.40+ (Master stage)
- Cannot be undone once confirmed

## How It Works

### XP System

Every Claude Code tool use grants XP to a specific stat:

| Tool | Stat | XP |
|------|------|----|
| Write | BUILD | 5 |
| Edit | BUILD | 3 |
| Read | EXPLORE | 2 |
| Grep | EXPLORE | 3 |
| Glob | EXPLORE | 1 |
| Agent | THINK | 5 |
| Bash (test/jest/vitest) | DEBUG | varies |
| Bash (git push/deploy) | DEPLOY | varies |

XP is multiplied by your condition:

| Condition | Multiplier |
|-----------|------------|
| ★☆☆☆☆ | x0.5 |
| ★★☆☆☆ | x0.7 |
| ★★★☆☆ | x1.0 |
| ★★★★☆ | x1.2 |
| ★★★★★ | x1.5 |

### Classes

Your highest stat determines your class:

| Stat | Class | Emoji |
|------|-------|-------|
| BUILD | Architect | 🏗️ |
| EXPLORE | Explorer | 🔭 |
| DEBUG | Mechanic | 🔧 |
| DEPLOY | Operator | 🚀 |
| THINK | Strategist | 🧠 |
| SPEED | Sprinter | ⚡ |

### Evolution Stages

| Level | Stage | Emoji |
|-------|-------|-------|
| 1–9 | Apprentice | 🥚 |
| 10–24 | Adept | — |
| 25–39 | Expert | — |
| 40+ | Master | 👑 |

### Hooks

Clauder uses 3 hooks to track your activity automatically:

- **PostToolUse**: Fires after each tool use, grants XP, checks achievements
- **SessionStart**: Greets you, updates condition, tracks consecutive days
- **SessionEnd**: Awards speed bonus based on tool count in session

## Installation

Add the marketplace and install:

```bash
/plugin marketplace add NaMinhyeok/clauder
/plugin install clauder@NaMinhyeok-clauder
```

Or browse the plugin manager:

```bash
/plugin
```

## Best Practices

### Growing your companion
- Use Claude Code daily to maintain high condition (up to x1.5 XP bonus)
- Condition decays after days of inactivity
- Diversify your tool usage to unlock style achievements like All-Rounder
- Use a variety of tools across sessions for balanced stat growth

### Retirement
- Retire at Lv.40+ to preserve your companion in the Hall of Fame
- After retirement, you start fresh with a new Lv.1 Apprentice
- Build a collection of legendary companions over time

### Achievements
- Achievements unlock automatically as you play
- Some are time-based (Night Owl, Early Bird) — code at different hours
- Some are milestone-based (Century, Centurion) — keep leveling up

## Requirements

- Node.js 18+
- Claude Code with plugin support

## Troubleshooting

### Companion not gaining XP

**Issue**: Tool uses don't seem to grant XP

**Solution**:
- Verify the plugin is installed: `/plugin`
- Check that hooks are firing (PostToolUse is required)
- Ensure `state.json` exists in the plugin data directory

### Condition keeps dropping

**Issue**: Condition is always low

**Solution**:
- Condition decays when you don't use Claude Code for a day
- Use Claude Code daily to maintain or increase condition
- Higher condition = more XP earned per tool use

### `/clauder-retire` says level too low

**Issue**: Can't retire companion

**Solution**:
- Retirement requires Lv.40+ (Master stage)
- Check current level with `/clauder` or `/clauder-stats`
- Keep using tools to earn XP and level up

### State data missing

**Issue**: Commands say "No Clauder yet"

**Solution**:
- Start using any Claude Code tool — the first PostToolUse hook creates your companion
- State is stored in `${CLAUDE_PLUGIN_DATA}/state.json`

## Development

```bash
npm install
npm test
```

## Author

NaMinhyeok

## Version

0.1.0
