import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { defaultLearningTools, LearningTools, readLearningTools } from '@/lib/learningTools';

export function useLearningTools() {
  const { user } = useAuth();
  const key = user ? `pixnol-learning-tools:${user.id}` : null;
  const [tools, setTools] = useState<LearningTools>(defaultLearningTools);
  useEffect(() => {
    const read = () => { try { setTools(readLearningTools(key ? localStorage.getItem(key) : null)); } catch { setTools(defaultLearningTools); } };
    read();
    window.addEventListener('pixnol-learning-tools', read);
    window.addEventListener('storage', read);
    return () => { window.removeEventListener('pixnol-learning-tools', read); window.removeEventListener('storage', read); };
  }, [key]);
  const updateTools = useCallback((update: (previous: LearningTools) => LearningTools) => {
    if (!key) return;
    const next = update(readLearningTools(localStorage.getItem(key)));
    localStorage.setItem(key, JSON.stringify(next));
    setTools(next);
    window.dispatchEvent(new Event('pixnol-learning-tools'));
  }, [key]);
  return { tools, updateTools, ready: Boolean(key) };
}