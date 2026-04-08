#!/bin/bash
exec npx tsx "$(dirname "$0")/../src/cli.ts" post-tool-use "$1"
