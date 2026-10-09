import { useEffect, useSyncExternalStore } from 'react';
import { Play, Square, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSpeechState, playSpanish, stopSpanish, subscribeSpeech } from '@/lib/spanishSpeech';

interface Props { texts: string[]; id: string; label?: string; compact?: boolean; rate?: number }
export default function SpanishAudio({ texts, id, label = 'استمع للدرس', compact = false, rate = 0.85 }: Props) {
  const speech = useSyncExternalStore(subscribeSpeech, getSpeechState);
  const playing = speech.activeId === id;
  useEffect(() => () => { if (getSpeechState().activeId === id) stopSpanish(); }, [id]);
  return (
    <span className={`inline-flex max-w-full flex-col ${compact ? '' : 'w-full'}`}>
      <Button type="button" variant={compact ? 'ghost' : 'outline'} size={compact ? 'icon' : 'lg'}
        className={compact ? 'size-10 shrink-0 rounded-full text-primary' : 'audio-control h-14 w-full justify-between rounded-md border-primary/25 bg-primary/5 px-4 text-foreground hover:bg-primary/10 hover:text-foreground'}
        title={playing ? 'إيقاف الصوت' : label} aria-label={playing ? `إيقاف ${label}` : label} aria-pressed={playing}
        onClick={event => { event.stopPropagation(); if (playing) stopSpanish(); else playSpanish(texts, id, rate); }}>
        {compact ? (playing ? <Square /> : <Volume2 />) : <><span className="flex min-w-0 items-center gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">{playing ? <Square /> : <Play />}</span><span className="truncate font-semibold">{playing ? 'جارٍ الاستماع' : label}</span></span><span dir="ltr" className="text-xs text-primary">ES · {rate === 0.55 ? 'Lento' : 'Audio'}</span></>}
      </Button>
      {!compact && speech.error && <span role="alert" className="mt-2 whitespace-normal text-xs leading-6 text-destructive">{speech.error}</span>}
    </span>
  );
}