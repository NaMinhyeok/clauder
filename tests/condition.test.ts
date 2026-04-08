import { describe, it, expect } from 'vitest';
import { updateConditionOnSessionStart, checkConditionRecovery } from '../src/condition.js';

describe('updateConditionOnSessionStart', () => {
  it('recovers 1 star if last session was today (no decay)', () => {
    const now = new Date('2026-04-08T14:00:00Z');
    const lastSession = new Date('2026-04-08T10:00:00Z').toISOString();
    expect(updateConditionOnSessionStart(3, lastSession, now)).toBe(4);
  });

  it('drops 1 then recovers 1 for 1-day absence (net zero)', () => {
    const now = new Date('2026-04-09T10:00:00Z');
    const lastSession = new Date('2026-04-08T10:00:00Z').toISOString();
    expect(updateConditionOnSessionStart(4, lastSession, now)).toBe(4);
  });

  it('drops 2 then recovers 1 for 3+ day absence (net -1)', () => {
    const now = new Date('2026-04-12T10:00:00Z');
    const lastSession = new Date('2026-04-08T10:00:00Z').toISOString();
    expect(updateConditionOnSessionStart(5, lastSession, now)).toBe(4);
  });

  it('never drops below 1 even after decay', () => {
    const now = new Date('2026-05-01T10:00:00Z');
    const lastSession = new Date('2026-04-01T10:00:00Z').toISOString();
    expect(updateConditionOnSessionStart(1, lastSession, now)).toBe(2);
  });

  it('caps at 5', () => {
    const now = new Date('2026-04-08T10:00:00Z');
    const lastSession = new Date('2026-04-08T08:00:00Z').toISOString();
    expect(updateConditionOnSessionStart(5, lastSession, now)).toBe(5);
  });

  it('handles null lastSession as first session (+1 recovery)', () => {
    const now = new Date('2026-04-08T10:00:00Z');
    expect(updateConditionOnSessionStart(3, null, now)).toBe(4);
  });
});

describe('checkConditionRecovery', () => {
  it('recovers 1 star when sessionToolUses hits 10', () => {
    expect(checkConditionRecovery(3, 10)).toBe(4);
  });

  it('does not recover if already at max', () => {
    expect(checkConditionRecovery(5, 10)).toBe(5);
  });

  it('does not recover at 9 uses', () => {
    expect(checkConditionRecovery(3, 9)).toBe(3);
  });

  it('only recovers once at exactly 10', () => {
    expect(checkConditionRecovery(3, 11)).toBe(3);
  });
});
