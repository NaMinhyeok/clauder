---
name: clauder-hall
description: Show the Hall of Fame — retired Clauders
---

Read `${CLAUDE_PLUGIN_DATA}/hall-of-fame.json` and `${CLAUDE_PLUGIN_DATA}/state.json`.

```
┌─ Hall of Fame ────────────────┐
│ #N {emoji} {class} Lv.{level} │
│    Retired: {retiredAt}       │
│    Played: {playDays}d        │
├───────────────────────────────┤
│ Current: {emoji} {class} Lv.  │
└───────────────────────────────┘
```

Empty: "Hall of Fame is empty. Retire at Lv.40+ with /clauder-retire."
