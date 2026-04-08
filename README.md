# Clauder

Gamification plugin for Claude Code — grow your coding companion.

## Install

```bash
claude /install-plugin ~/workspace/clauder
```

## Commands

| Command | Description |
|---------|-------------|
| `/clauder` | Show your Clauder's card |
| `/clauder-stats` | Detailed stat breakdown |
| `/clauder-hall` | Hall of Fame |
| `/clauder-achieve` | Achievement list |
| `/clauder-retire` | Retire to Hall of Fame (Lv.40+) |

## How It Works

Every tool you use grants XP to one of 6 stats: BUILD, EXPLORE, DEBUG, DEPLOY, THINK, SPEED.
Your highest stat determines your class. Daily usage keeps your condition high (XP bonus).
Hidden achievements unlock as you play. At Lv.40+, retire to the Hall of Fame and start fresh.

## Development

```bash
npm install
npm test
```
