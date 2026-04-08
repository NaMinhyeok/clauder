import { RARITY_WEIGHTS, type Rarity } from './constants.js';
import { CHARACTERS } from './characters.js';

export interface GachaResult {
  characterId: string;
  rarity: Rarity;
}

export function rollRarity(roll?: number): Rarity {
  const r = roll ?? Math.floor(Math.random() * 100);
  let cumulative = 0;
  for (const def of RARITY_WEIGHTS) {
    cumulative += def.weight;
    if (r < cumulative) return def.id;
  }
  return RARITY_WEIGHTS[RARITY_WEIGHTS.length - 1].id;
}

export function rollCharacter(): string {
  const index = Math.floor(Math.random() * CHARACTERS.length);
  return CHARACTERS[index].id;
}

export function rollGacha(): GachaResult {
  return {
    characterId: rollCharacter(),
    rarity: rollRarity(),
  };
}
