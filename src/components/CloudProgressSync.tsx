import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { mergeGameState, mergeLearningTools } from '@/lib/progressMerge';

const GAME_KEY = 'pixnol-game-state';
const parse = (raw: string | null) => { try { return raw ? JSON.parse(raw) : null; } catch { return null; } };

/** Keeps the signed-in learner's progress in their account so it follows them across devices. */
export function CloudProgressSync({ userId }: { userId: string }) {
  const ready = useRef(false);
  const timer = useRef<number>();

  useEffect(() => {
    ready.current = false;
    const toolsKey = `pixnol-learning-tools:${userId}`;
    const upload = async () => {
      await supabase.from('user_progress').upsert({
        user_id: userId,
        game_state: parse(localStorage.getItem(GAME_KEY)) ?? {},
        learning_tools: parse(localStorage.getItem(toolsKey)) ?? {},
      });
    };
    (async () => {
      const { data } = await supabase.from('user_progress').select('game_state, learning_tools').eq('user_id', userId).maybeSingle();
      const game = mergeGameState(parse(localStorage.getItem(GAME_KEY)), (data?.game_state as Record<string, unknown>) ?? null);
      const tools = mergeLearningTools(parse(localStorage.getItem(toolsKey)), (data?.learning_tools as Record<string, unknown>) ?? null);
      if (Object.keys(game).length) localStorage.setItem(GAME_KEY, JSON.stringify(game));
      if (Object.keys(tools).length) localStorage.setItem(toolsKey, JSON.stringify(tools));
      window.dispatchEvent(new Event('pixnol-game-state'));
      window.dispatchEvent(new Event('pixnol-learning-tools'));
      ready.current = true;
      await upload();
    })();
    const onChange = () => {
      if (!ready.current) return;
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(upload, 1500);
    };
    window.addEventListener('pixnol-progress-changed', onChange);
    return () => { window.removeEventListener('pixnol-progress-changed', onChange); window.clearTimeout(timer.current); };
  }, [userId]);

  return null;
}
