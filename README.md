# Clauder

ASCII Tamagotchi gamification plugin for Claude Code — every tool use grows your coding companion.

## Overview

Clauder turns your Claude Code sessions into an RPG with ASCII Tamagotchi characters. When you first start, a **gacha roll** assigns you one of 6 characters at a random rarity. Every tool you use earns XP across 6 stats, determines your class, and evolves your companion through 4 stages. Keep coding daily to maintain high condition (up to 1.5x XP bonus), unlock 15 hidden achievements, and retire legendary companions to the Hall of Fame.

Each character has unique ASCII art that changes based on rarity and condition — happy faces when well-cared-for, sad faces when neglected.

## Characters & Gacha

On first launch (and after each retirement), the gacha system rolls:

**Character** (1 of 6):

| Character | Style |
|-----------|-------|
| Mochi | Soft, round rice cake |
| Pixel | Angular robot with bracket eyes |
| Blob | Wavy slime/droplet |
| Nori | Triangular rice ball |
| Tori | Small bird with beak |
| Kumo | Cloud with cloud-mouth |

**Rarity**:

| Rarity | Stars | Drop Rate | Border |
|--------|-------|-----------|--------|
| Common | ★☆☆ | 55% | `╭──╮` rounded |
| Rare   | ★★☆ | 35% | `┌──┐` sharp |
| Epic   | ★★★ | 10% | `╔══╗` double |

Higher rarity characters have fancier borders and decorative elements in their ASCII art.

**Example character (Mochi, Common, Condition 5):**
```
╭─────────╮
│  ◕ ‿ ◕  │
│   ╰─╯   │
╰─────────╯
```

## Commands

### `/clauder`

Displays your companion's main card with ASCII art, character info, EXP bar, and achievements.

**Usage:**
```bash
/clauder
```

**Example output:**
```
  ╭─────────╮
  │  ◕ ‿ ◕  │
  │   ╰─╯   │
  ╰─────────╯
  Mochi ★☆☆ Common
  Lv.12 Architect | 🔥 5d
  EXP [████████░░░░] 67% (340/535)
  🏆 4/15
```

### `/clauder-stats`

Shows detailed stat breakdown with XP progress toward the next level.

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
DEBUG   ███░░░░░░░  14%    420 XP
DEPLOY  ██░░░░░░░░   8%    240 XP
THINK   █░░░░░░░░░   5%    150 XP
SPEED   █░░░░░░░░░   3%     90 XP
────────────────────────
Total XP: 3,000 | Tools: 482 | Streak: 5d
```

### `/clauder-hall`

Displays the Hall of Fame — a record of all retired companions.

**Usage:**
```bash
/clauder-hall
```

**Example output:**
```
┌─ Hall of Fame ─────────────────────┐
│ #1 Mochi ★★☆                      │
│    🏗️ Architect Lv.42             │
│    Retired: 2026-03-15             │
│    Played: 30d                     │
├────────────────────────────────────┤
│ Current: Pixel ★★★ Lv.8           │
└────────────────────────────────────┘
```

### `/clauder-achieve`

Shows your achievement list with unlock status.

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

Retires your current companion to the Hall of Fame and rolls a new gacha. Requires Lv.40+.

**What happens:**
1. Checks if companion is Lv.40 or higher
2. Asks for confirmation
3. Saves companion to Hall of Fame with final stats
4. Rolls a **new gacha** — new character + new rarity
5. Starts fresh with a Lv.1 companion

**Usage:**
```bash
/clauder-retire
```

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
| Bash (test/jest/vitest/pytest) | DEBUG | 5 |
| Bash (git push/deploy/vercel) | DEPLOY | 3 |
| Bash (other) | DEBUG | 2 |
| Unknown tools | Lowest stat | 1 |

XP is multiplied by your condition:

| Condition | Stars | Multiplier |
|-----------|-------|------------|
| 1 | ★☆☆☆☆ | x0.5 |
| 2 | ★★☆☆☆ | x0.7 |
| 3 | ★★★☆☆ | x1.0 |
| 4 | ★★★★☆ | x1.2 |
| 5 | ★★★★★ | x1.5 |

### Leveling

XP needed for the next level: `floor(100 * 1.15^level)`. Total XP is the sum of all 6 stats.

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
| 1-9 | Apprentice | 🥚 |
| 10-24 | Adept | — |
| 25-39 | Expert | — |
| 40+ | Master | 👑 |

### Condition

Condition affects XP gain and your character's facial expression.

- **Session start**: condition decays based on inactivity (1 day: -1, 3+ days: -2), then +1 recovery
- **During session**: reaching 10 tool uses grants +1 condition (once per session)
- **Condition messages**: 1 = "Hungry... 😢", 4 = "Feeling good!", 5 = "On fire! 🔥"

### Hooks

Clauder uses 3 hooks to track your activity automatically:

- **PostToolUse**: Fires after each tool use, grants XP, checks achievements, checks condition recovery at 10 uses
- **SessionStart**: Updates condition based on days since last session, tracks consecutive days
- **SessionEnd**: Awards speed bonus XP based on session tool count (50+: 10 XP, 30+: 5 XP, 10+: 2 XP)

## Installation

```bash
/install NaMinhyeok/clauder
```

## Best Practices

### Growing your companion
- Use Claude Code daily to maintain high condition (up to x1.5 XP bonus)
- Condition decays after days of inactivity
- Reaching 10 tool uses per session recovers +1 condition
- Diversify your tool usage to unlock style achievements like All-Rounder

### Retirement & Gacha
- Retire at Lv.40+ to preserve your companion in the Hall of Fame
- Each retirement rolls a fresh gacha — chase Epic (★★★) characters!
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

Verify the plugin is installed and hooks are firing (PostToolUse is required). State is stored in `${CLAUDE_PLUGIN_DATA}/state.json`.

### Condition keeps dropping

Condition decays when you don't use Claude Code for a day. Use Claude Code daily to maintain or increase condition. Reaching 10 tool uses per session gives a +1 recovery bonus.

### `/clauder-retire` says level too low

Retirement requires Lv.40+ (Master stage). Check current level with `/clauder` or `/clauder-stats`.

## Development

```bash
cd plugins/clauder
npm install
npm test
```

## Author

NaMinhyeok

## Version

0.2.0
