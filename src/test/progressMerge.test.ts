import { describe, it, expect } from 'vitest';
import { mergeGameState, mergeLearningTools } from '@/lib/progressMerge';

describe('progress merge', () => {
  it('keeps completed lessons from both devices', () => {
    const r = mergeGameState({ totalXpEarned: 50, completedLessons: ['a'] }, { totalXpEarned: 80, completedLessons: ['b'] });
    expect(r.completedLessons).toEqual(['a', 'b']);
    expect(r.totalXpEarned).toBe(80);
  });
  it('uses local progress when the account has none yet', () => {
    expect(mergeGameState({ totalXpEarned: 10 }, {})).toEqual({ totalXpEarned: 10 });
  });
  it('account learning tools win over local', () => {
    expect(mergeLearningTools({ dailyGoal: 1 }, { dailyGoal: 3 })).toEqual({ dailyGoal: 3 });
  });
});
