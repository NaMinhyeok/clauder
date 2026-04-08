#!/bin/bash
exec npx tsx "$(dirname "$0")/../src/cli.ts" session-end "$1"
