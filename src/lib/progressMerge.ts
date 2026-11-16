// Pure helpers for merging local and cloud learning progress.
type Obj = Record<string, unknown>;
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const union = (a: unknown, b: unknown) => Array.from(new Set([...arr(a), ...arr(b)].map(x => JSON.stringify(x)))).map(x => JSON.parse(x));
const isEmpty = (o: Obj | null | undefined) => !o || Object.keys(o).length === 0;

/** Keep the game state with more total XP, but never lose completed lessons/games/achievements/zones. */
export function mergeGameState(local: Obj | null, cloud: Obj | null): Obj {
  if (isEmpty(cloud)) return local ?? {};
  if (isEmpty(local)) return cloud!;
  const base = Number(cloud!.totalXpEarned ?? 0) >= Number(local!.totalXpEarned ?? 0) ? cloud! : local!;
  return {
    ...base,
    completedLessons: union(local!.completedLessons, cloud!.completedLessons),
    completedGames: union(local!.completedGames, cloud!.completedGames),
    achievements: union(local!.achievements, cloud!.achievements),
    unlockedZones: union(local!.unlockedZones, cloud!.unlockedZones),
  };
}

/** Cloud learning tools win; local is used only when the cloud has nothing yet. */
export function mergeLearningTools(local: Obj | null, cloud: Obj | null): Obj {
  return isEmpty(cloud) ? local ?? {} : cloud!;
}
