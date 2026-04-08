---
name: clauder
description: Show your Clauder's main card — ASCII Tamagotchi with EXP bar
---

Read `${CLAUDE_PLUGIN_DATA}/state.json` and `${CLAUDE_PLUGIN_DATA}/achievements.json`.

Display the card in this format (substitute real values):

```
  {ascii_art_lines}
  {character_name} {rarity_stars} {rarity_name}
  Lv.{level} {class_name} | 🔥 {consecutiveDays}d
  EXP [{bar_12chars}] {pct}% ({current_xp}/{needed_xp})
  🏆 {unlocked}/{15}
```

ASCII art: Look up character by `characterId` and render `art[rarity][condition]`.
EXP bar: 12 chars using █ and ░. current_xp = totalXp - accumulated XP for levels below current. needed_xp = floor(100 * 1.15^level).
Rarity stars: common=★☆☆, rare=★★☆, epic=★★★.
Classes: build→Architect, explore→Explorer, debug→Mechanic, deploy→Operator, think→Strategist, speed→Sprinter.
If level < 10: show Apprentice as class.
If no state.json: say "No Clauder yet! Start using tools to begin."
