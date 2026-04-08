---
name: clauder-hall
description: Show the Hall of Fame — retired Clauders
---

Read `${CLAUDE_PLUGIN_DATA}/hall-of-fame.json` and `${CLAUDE_PLUGIN_DATA}/state.json`.

```
┌─ 명예의 전당 ─────────────────┐
│ #N {emoji} {class} Lv.{level} │
│    봉인일: {retiredAt}        │
│    플레이: {playDays}일       │
├───────────────────────────────┤
│ 현재: {emoji} {class} Lv.{lv} │
└───────────────────────────────┘
```

Empty: "명예의 전당이 비어있어요. Lv.40 이상에서 /clauder-retire로 봉인할 수 있습니다."
