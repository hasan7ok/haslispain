import SpanishAudio from '@/components/SpanishAudio';
import { playSpanish } from '@/lib/spanishSpeech';

type Gender = 'm' | 'f' | null;

/** Detect grammatical gender from Spanish word heuristics */
export function detectGender(word: string): Gender {
  const w = word.toLowerCase().trim();
  // Explicit articles
  if (w.startsWith('el ') || w.startsWith('los ') || w.startsWith('un ')) return 'm';
  if (w.startsWith('la ') || w.startsWith('las ') || w.startsWith('una ')) return 'f';
  // Check last meaningful word
  const parts = w.split(/[\s/]+/);
  const last = parts[parts.length - 1].replace(/[^a-záéíóúñü]/g, '');
  // Common feminine endings
  if (last.endsWith('a') || last.endsWith('ción') || last.endsWith('sión') || last.endsWith('dad') || last.endsWith('tud')) return 'f';
  // Common masculine endings
  if (last.endsWith('o') || last.endsWith('or') || last.endsWith('aje') || last.endsWith('ón')) return 'm';
  // Known exceptions
  const femWords = ['mano', 'noche', 'tarde', 'nieve', 'cuenta', 'cerveza', 'siesta', 'fiesta', 'paella'];
  const mascWords = ['día', 'sofá', 'mapa', 'clima', 'idioma'];
  if (femWords.some(fw => w.includes(fw))) return 'f';
  if (mascWords.some(mw => w.includes(mw))) return 'm';
  return null;
}

/** Speak Spanish text using Web Speech API */
export function speakSpanish(text: string) {
  playSpanish([text], `text-${text}`);
}

interface SpanishWordProps {
  word: string;
  className?: string;
  showGender?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function SpanishWord({ word, className = '', showGender = true, size = 'md' }: SpanishWordProps) {
  const gender = showGender ? detectGender(word) : null;

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-base',
    lg: 'text-lg',
  };

  const genderGlow = gender === 'm'
    ? 'bg-gender-m/8 border-gender-m/20 shadow-[0_0_12px_hsl(var(--gender-masculine)/0.12)]'
    : gender === 'f'
    ? 'bg-gender-f/8 border-gender-f/20 shadow-[0_0_12px_hsl(var(--gender-feminine)/0.12)]'
    : '';

  const genderDot = gender === 'm'
    ? 'bg-gender-m'
    : gender === 'f'
    ? 'bg-gender-f'
    : '';

  return (
    <span className={`inline-flex items-center gap-1.5 ${genderGlow ? `px-2 py-0.5 rounded-sm border ${genderGlow}` : ''} ${className}`}>
      {gender && <span className={`w-1.5 h-1.5 rounded-full ${genderDot} flex-shrink-0 opacity-70`} />}
      <span className={sizeClasses[size]}>{word}</span>
      <SpanishAudio compact texts={[word]} id={`word-${word}`} label={`نطق ${word}`} />
    </span>
  );
}
