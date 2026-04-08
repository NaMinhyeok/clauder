---
name: clauder-retire
description: Retire current Clauder to the Hall of Fame (Lv.40+)
---

Read `${CLAUDE_PLUGIN_DATA}/state.json` and `${CLAUDE_PLUGIN_DATA}/hall-of-fame.json`.

If level < 40: "Can't retire yet! Need Lv.40+. (Current: Lv.{level})"

If level >= 40, confirm with user, then:
1. Add entry to hall-of-fame.json: { className, classEmoji, level, stats, totalXP, retiredAt, createdAt, playDays, characterId, rarity, characterName }
2. Reset state.json via createFreshState() — this automatically rolls a new gacha
3. Read the new state to get the gacha result
4. Display:
   "🏛️ {emoji} {class} Lv.{level} sealed!"
   "🎰 Gacha time!"
   "✨ {new_character_name} {rarity_stars} {rarity_name}!"
   "A new adventure begins!"
