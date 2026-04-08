---
name: clauder-stats
description: Show detailed stat breakdown with XP progress
---

Read `${CLAUDE_PLUGIN_DATA}/state.json`.

Display:

```
{emoji} {class} Lv.{level}
XP: {current_in_level}/{xp_for_next} (next level)
Condition: {★☆} (x{multiplier})

───── Stat Details ─────
BUILD   {bar}  {pct}%  {abs} XP
EXPLORE {bar}  {pct}%  {abs} XP
DEBUG   {bar}  {pct}%  {abs} XP
DEPLOY  {bar}  {pct}%  {abs} XP
THINK   {bar}  {pct}%  {abs} XP
SPEED   {bar}  {pct}%  {abs} XP
────────────────────────
Total XP: {total} | Tools: {totalToolUses} | Streak: {consecutiveDays}d
```

XP for next level: floor(100 * 1.15^level).
Multipliers: 1→x0.5, 2→x0.7, 3→x1.0, 4→x1.2, 5→x1.5.
