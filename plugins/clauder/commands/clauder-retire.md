---
name: clauder-retire
description: Retire current Clauder to the Hall of Fame (Lv.40+)
---

Read `${CLAUDE_PLUGIN_DATA}/state.json` and `${CLAUDE_PLUGIN_DATA}/hall-of-fame.json`.

If level < 40: "Can't retire yet! Need Lv.40+. (Current: Lv.{level})"

If level >= 40, confirm with user, then:
1. Add entry to hall-of-fame.json: { className, classEmoji, level, stats, totalXP, retiredAt, createdAt, playDays }
2. Reset state.json: version 1, level 1, all stats 0, condition 3, consecutiveDays 0, totalToolUses 0, sessionToolUses 0, new createdAt
3. Display: "🏛️ {emoji} {class} Lv.{level} sealed! A new 🥚 Apprentice is born!"
