#!/bin/bash
exec npx tsx "$(dirname "$0")/../src/cli.ts" session-start "$1"
