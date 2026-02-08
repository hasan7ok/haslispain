import { useCallback, useRef } from 'react';

// Singleton AudioContext to avoid creating multiple instances
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  // Resume if suspended (browser autoplay policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

type NoteSequence = { freq: number; duration: number; delay: number }[];

function playSequence(notes: NoteSequence, volume = 0.15, waveType: OscillatorType = 'square') {
  const ctx = getAudioContext();

  notes.forEach(({ freq, duration, delay }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = waveType;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

    gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
  });
}

export function usePixelSounds() {
  const enabledRef = useRef(true);

  const playSuccess = useCallback(() => {
    if (!enabledRef.current) return;
    // Cheerful ascending two-note beep
    playSequence([
      { freq: 523, duration: 0.12, delay: 0 },     // C5
      { freq: 784, duration: 0.18, delay: 0.1 },    // G5
    ], 0.12);
  }, []);

  const playError = useCallback(() => {
    if (!enabledRef.current) return;
    // Low descending buzz
    playSequence([
      { freq: 330, duration: 0.1, delay: 0 },       // E4
      { freq: 220, duration: 0.2, delay: 0.08 },    // A3
    ], 0.12, 'sawtooth');
  }, []);

  const playVictory = useCallback(() => {
    if (!enabledRef.current) return;
    // Triumphant ascending fanfare
    playSequence([
      { freq: 523, duration: 0.12, delay: 0 },      // C5
      { freq: 659, duration: 0.12, delay: 0.12 },   // E5
      { freq: 784, duration: 0.12, delay: 0.24 },   // G5
      { freq: 1047, duration: 0.3, delay: 0.36 },   // C6
    ], 0.12);
  }, []);

  const playDefeat = useCallback(() => {
    if (!enabledRef.current) return;
    // Sad descending sequence
    playSequence([
      { freq: 392, duration: 0.15, delay: 0 },      // G4
      { freq: 330, duration: 0.15, delay: 0.15 },   // E4
      { freq: 262, duration: 0.15, delay: 0.3 },    // C4
      { freq: 196, duration: 0.35, delay: 0.45 },   // G3
    ], 0.1, 'sawtooth');
  }, []);

  const playCombo = useCallback(() => {
    if (!enabledRef.current) return;
    // Quick sparkle for combos
    playSequence([
      { freq: 880, duration: 0.06, delay: 0 },      // A5
      { freq: 1108, duration: 0.06, delay: 0.05 },  // C#6
      { freq: 1319, duration: 0.1, delay: 0.1 },    // E6
    ], 0.08);
  }, []);

  const playClick = useCallback(() => {
    if (!enabledRef.current) return;
    // Tiny click
    playSequence([
      { freq: 660, duration: 0.04, delay: 0 },
    ], 0.06);
  }, []);

  const setEnabled = useCallback((val: boolean) => {
    enabledRef.current = val;
  }, []);

  return { playSuccess, playError, playVictory, playDefeat, playCombo, playClick, setEnabled };
}
