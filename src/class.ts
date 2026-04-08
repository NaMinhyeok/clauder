import { CLASSES, EVOLUTION_STAGES, STAT_NAMES, type StatName, type ClassDef, type EvolutionStage } from './constants.js';

export function determineClass(stats: Record<StatName, number>): ClassDef | null {
  let maxStat: string | null = null;
  let maxVal = 0;

  for (const name of STAT_NAMES) {
    if (stats[name] > maxVal) {
      maxVal = stats[name];
      maxStat = name;
    }
  }

  if (maxStat === null || maxVal === 0) return null;
  return CLASSES[maxStat as StatName];
}

export function getEvolutionStage(level: number): EvolutionStage {
  for (const stage of EVOLUTION_STAGES) {
    if (level >= stage.minLevel && level <= stage.maxLevel) {
      return stage;
    }
  }
  return EVOLUTION_STAGES[EVOLUTION_STAGES.length - 1];
}
