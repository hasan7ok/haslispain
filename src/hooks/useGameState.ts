import { useState, useEffect, useCallback } from 'react';

export interface CharacterConfig {
  skinColor: string;
  hairColor: string;
  outfitColor: string;
  bootsColor: string;
  eyeColor: string;
  hairStyle: number;
  accessory: number;
}

export interface GameState {
  username: string;
  level: number;
  xp: number;
  streak: number;
  lastLoginDate: string;
  character: CharacterConfig;
  completedLessons: string[];
  completedGames: string[];
  achievements: string[];
  unlockedZones: string[];
  totalXpEarned: number;
}

const DEFAULT_CHARACTER: CharacterConfig = {
  skinColor: '#f4c794',
  hairColor: '#3d2314',
  outfitColor: '#e74c3c',
  bootsColor: '#5d4037',
  eyeColor: '#1a1a2e',
  hairStyle: 0,
  accessory: 0,
};

const DEFAULT_STATE: GameState = {
  username: '',
  level: 1,
  xp: 0,
  streak: 0,
  lastLoginDate: '',
  character: DEFAULT_CHARACTER,
  completedLessons: [],
  completedGames: [],
  achievements: [],
  unlockedZones: ['pueblo'],
  totalXpEarned: 0,
};

const STORAGE_KEY = 'pixnol-game-state';
const XP_PER_LEVEL = 100;

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_STATE, ...parsed, character: { ...DEFAULT_CHARACTER, ...parsed.character } };
      }
    } catch { /* ignore */ }
    return DEFAULT_STATE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Update streak on mount
  useEffect(() => {
    const today = new Date().toDateString();
    if (state.lastLoginDate && state.lastLoginDate !== today) {
      const lastLogin = new Date(state.lastLoginDate);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isConsecutive = lastLogin.toDateString() === yesterday.toDateString();
      setState(prev => ({
        ...prev,
        streak: isConsecutive ? prev.streak + 1 : 1,
        lastLoginDate: today,
      }));
    } else if (!state.lastLoginDate) {
      setState(prev => ({ ...prev, streak: 1, lastLoginDate: today }));
    }
  }, []);

  const addXP = useCallback((amount: number) => {
    setState(prev => {
      let newXP = prev.xp + amount;
      let newLevel = prev.level;
      const levelThreshold = () => XP_PER_LEVEL * newLevel;

      while (newXP >= levelThreshold()) {
        newXP -= levelThreshold();
        newLevel++;
      }

      const unlockedZones = [...prev.unlockedZones];
      if (newLevel >= 3 && !unlockedZones.includes('ciudad')) unlockedZones.push('ciudad');
      if (newLevel >= 5 && !unlockedZones.includes('historia')) unlockedZones.push('historia');
      if (newLevel >= 7 && !unlockedZones.includes('latino')) unlockedZones.push('latino');
      if (newLevel >= 10 && !unlockedZones.includes('debate')) unlockedZones.push('debate');

      const newAchievements = [...prev.achievements];
      if (newLevel >= 5 && !newAchievements.includes('level5')) newAchievements.push('level5');
      if (newLevel >= 10 && !newAchievements.includes('level10')) newAchievements.push('level10');
      if (prev.totalXpEarned + amount >= 500 && !newAchievements.includes('xp500')) newAchievements.push('xp500');
      if (prev.totalXpEarned + amount >= 1000 && !newAchievements.includes('xp1000')) newAchievements.push('xp1000');

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        unlockedZones,
        achievements: newAchievements,
        totalXpEarned: prev.totalXpEarned + amount,
        lastLoginDate: new Date().toDateString(),
      };
    });
  }, []);

  const completeLesson = useCallback((lessonId: string, xpReward: number) => {
    setState(prev => {
      if (prev.completedLessons.includes(lessonId)) {
        return prev;
      }
      const newAchievements = [...prev.achievements];
      const newCompleted = [...prev.completedLessons, lessonId];
      if (newCompleted.length >= 5 && !newAchievements.includes('lessons5')) newAchievements.push('lessons5');
      if (newCompleted.length >= 10 && !newAchievements.includes('lessons10')) newAchievements.push('lessons10');
      return {
        ...prev,
        completedLessons: newCompleted,
        achievements: newAchievements,
      };
    });
    addXP(xpReward);
  }, [addXP]);

  const completeGame = useCallback((gameId: string, xpReward: number) => {
    addXP(xpReward);
    setState(prev => {
      const newAchievements = [...prev.achievements];
      if (!newAchievements.includes('firstGame')) newAchievements.push('firstGame');
      return {
        ...prev,
        completedGames: [...prev.completedGames, gameId],
        achievements: newAchievements,
      };
    });
  }, [addXP]);

  const updateCharacter = useCallback((config: Partial<CharacterConfig>) => {
    setState(prev => ({
      ...prev,
      character: { ...prev.character, ...config },
    }));
  }, []);

  const updateUsername = useCallback((username: string) => {
    setState(prev => ({ ...prev, username }));
  }, []);

  const resetProgress = useCallback(() => {
    setState(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const xpToNextLevel = XP_PER_LEVEL * state.level;
  const xpProgress = (state.xp / xpToNextLevel) * 100;

  return {
    state,
    addXP,
    completeLesson,
    completeGame,
    updateCharacter,
    updateUsername,
    resetProgress,
    xpToNextLevel,
    xpProgress,
    isNewUser: !state.username,
  };
}
