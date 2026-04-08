---
name: clauder
description: Show your Clauder's main card — class, level, condition, and stats
---

Read `${CLAUDE_PLUGIN_DATA}/state.json` and `${CLAUDE_PLUGIN_DATA}/achievements.json`.

Display the card in this format (substitute real values):

```
{emoji} {class_name} Lv.{level} | 🔥 {consecutiveDays}일 | ⭐ {condition as ★/☆}
───────────────────────────────────
{stat}   {bar_chart}  {pct}%  {absolute}
... (all 6 stats sorted by value desc)
───────────────────────────────────
🏆 업적 {unlocked}/{15}
```

Bar chart: 10 chars using █ and ░. Percentage = stat XP / total XP * 100.
Condition: ★ filled, ☆ empty (max 5).
Classes: build→🏗️ Architect, explore→🔭 Explorer, debug→🔧 Mechanic, deploy→🚀 Operator, think→🧠 Strategist, speed→⚡ Sprinter.
If level < 10: show 🥚 Apprentice.
If no state.json: say "아직 Clauder가 없어요! 도구를 사용하면 자동으로 시작됩니다."
