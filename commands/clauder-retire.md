---
name: clauder-retire
description: Retire current Clauder to the Hall of Fame (Lv.40+)
---

Read `${CLAUDE_PLUGIN_DATA}/state.json` and `${CLAUDE_PLUGIN_DATA}/hall-of-fame.json`.

If level < 40: "아직 은퇴할 수 없어요! Lv.40 이상 필요. (현재: Lv.{level})"

If level >= 40, confirm with user, then:
1. Add entry to hall-of-fame.json: { className, classEmoji, level, stats, totalXP, retiredAt, createdAt, playDays }
2. Reset state.json: version 1, level 1, all stats 0, condition 3, consecutiveDays 0, totalToolUses 0, sessionToolUses 0, new createdAt
3. Display: "🏛️ {emoji} {class} Lv.{level} 봉인 완료! 새 🥚 견습생이 태어났어요!"
