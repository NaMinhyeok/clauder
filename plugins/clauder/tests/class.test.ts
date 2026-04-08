import { describe, it, expect } from 'vitest';
import { determineClass, getEvolutionStage } from '../src/class.js';

describe('determineClass', () => {
  it('returns Architect when build is highest', () => {
    const stats = { build: 100, explore: 50, debug: 30, deploy: 20, think: 10, speed: 5 };
    expect(determineClass(stats)!.name).toBe('Architect');
  });

  it('returns Explorer when explore is highest', () => {
    const stats = { build: 10, explore: 100, debug: 30, deploy: 20, think: 10, speed: 5 };
    expect(determineClass(stats)!.name).toBe('Explorer');
  });

  it('returns Mechanic when debug is highest', () => {
    const stats = { build: 10, explore: 50, debug: 200, deploy: 20, think: 10, speed: 5 };
    expect(determineClass(stats)!.name).toBe('Mechanic');
  });

  it('returns first stat on tie (build)', () => {
    const stats = { build: 50, explore: 50, debug: 50, deploy: 50, think: 50, speed: 50 };
    expect(determineClass(stats)!.name).toBe('Architect');
  });

  it('returns null for all-zero stats', () => {
    const stats = { build: 0, explore: 0, debug: 0, deploy: 0, think: 0, speed: 0 };
    expect(determineClass(stats)).toBeNull();
  });
});

describe('getEvolutionStage', () => {
  it('returns Apprentice for level 1-9', () => {
    expect(getEvolutionStage(1).name).toBe('Apprentice');
    expect(getEvolutionStage(9).name).toBe('Apprentice');
  });

  it('returns Adept for level 10-24', () => {
    expect(getEvolutionStage(10).name).toBe('Adept');
  });

  it('returns Expert for level 25-39', () => {
    expect(getEvolutionStage(25).name).toBe('Expert');
  });

  it('returns Master for level 40+', () => {
    expect(getEvolutionStage(40).name).toBe('Master');
    expect(getEvolutionStage(100).name).toBe('Master');
  });
});
