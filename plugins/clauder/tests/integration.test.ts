import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readState } from '../src/state.js';
import { spawn } from 'node:child_process';

const CLI = join(import.meta.dirname, '..', 'src', 'cli.ts');
const TSX = join(import.meta.dirname, '..', 'node_modules', '.bin', 'tsx');

describe('integration: full game loop', () => {
  let dataDir: string;

  beforeEach(async () => {
    dataDir = await mkdtemp(join(tmpdir(), 'clauder-int-'));
  });

  afterEach(async () => {
    await rm(dataDir, { recursive: true });
  });

  async function cli(action: string, input: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
    return new Promise((resolve, reject) => {
      const child = spawn(TSX, [CLI, action, dataDir], {
        cwd: join(import.meta.dirname, '..'),
      });
      let stdout = '';
      child.stdout.on('data', (chunk: Buffer) => { stdout += chunk.toString(); });
      child.on('close', (code: number) => {
        if (code !== 0) reject(new Error(`cli exited with code ${code}`));
        else resolve(stdout.trim() ? JSON.parse(stdout) : {});
      });
      child.on('error', reject);
      child.stdin.write(JSON.stringify(input));
      child.stdin.end();
    });
  }

  it('session start creates state with greeting', async () => {
    const result = await cli('session-start');
    expect(result.additionalContext).toContain('Lv.1');
  });

  it('tool use grants XP', async () => {
    await cli('session-start');
    await cli('post-tool-use', { tool_name: 'Write', tool_input: {} });
    await cli('post-tool-use', { tool_name: 'Read', tool_input: {} });

    const state = await readState(dataDir);
    expect(state.stats.build).toBeGreaterThan(0);
    expect(state.stats.explore).toBeGreaterThan(0);
    expect(state.totalToolUses).toBe(2);
  });

  it('session end grants SPEED stat', async () => {
    await cli('session-start');
    for (let i = 0; i < 12; i++) {
      await cli('post-tool-use', { tool_name: 'Read', tool_input: {} });
    }
    await cli('session-end');

    const state = await readState(dataDir);
    expect(state.stats.speed).toBeGreaterThan(0);
  });

  it('session start assigns character via gacha on first run', async () => {
    await cli('session-start');
    const state = await readState(dataDir);
    expect(state.characterId).toBeDefined();
    expect(state.rarity).toBeDefined();
    expect(['common', 'rare', 'epic']).toContain(state.rarity);
    expect(state.version).toBe(2);
  });
});
