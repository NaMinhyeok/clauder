function daysBetween(dateA: Date, dateB: Date): number {
  const msPerDay = 86400000;
  return Math.floor((dateB.getTime() - dateA.getTime()) / msPerDay);
}

export function updateConditionOnSessionStart(currentCondition: number, lastSessionAt: string | null, now: Date = new Date()): number {
  let condition = currentCondition;

  if (lastSessionAt) {
    const last = new Date(lastSessionAt);
    const days = daysBetween(last, now);
    if (days >= 3) {
      condition -= 2;
    } else if (days >= 1) {
      condition -= 1;
    }
  }

  condition = Math.max(1, condition);
  condition = Math.min(5, condition + 1);

  return condition;
}

export function checkConditionRecovery(currentCondition: number, sessionToolUses: number): number {
  if (sessionToolUses === 10 && currentCondition < 5) {
    return currentCondition + 1;
  }
  return currentCondition;
}
