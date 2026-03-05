import { useCallback, useRef } from 'react';

// Singleton AudioContext to avoid creating multiple instances
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

type NoteSequence = { freq: number; duration: number; delay: number }[];

function playSequence(notes: NoteSequence, volume = 0.08, waveType: OscillatorType = 'sine') {
  const ctx = getAudioContext();

  notes.forEach(({ freq, duration, delay }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = waveType;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

    // Smooth envelope: fade in then fade out
    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

    // Soften harsh frequencies
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2500, ctx.currentTime + delay);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
  });
}

export function usePixelSounds() {
  const enabledRef = useRef(true);

  const playSuccess = useCallback(() => {
    if (!enabledRef.current) return;
    // Gentle chime: soft ascending
    playSequence([
      { freq: 659, duration: 0.15, delay: 0 },      // E5
      { freq: 880, duration: 0.2, delay: 0.12 },     // A5
    ], 0.07, 'sine');
  }, []);

  const playError = useCallback(() => {
    if (!enabledRef.current) return;
    // Soft low thud
    playSequence([
      { freq: 220, duration: 0.15, delay: 0 },       // A3
      { freq: 185, duration: 0.2, delay: 0.1 },      // F#3
    ], 0.06, 'triangle');
  }, []);

  const playVictory = useCallback(() => {
    if (!enabledRef.current) return;
    // Warm ascending melody
    playSequence([
      { freq: 523, duration: 0.15, delay: 0 },       // C5
      { freq: 659, duration: 0.15, delay: 0.14 },    // E5
      { freq: 784, duration: 0.15, delay: 0.28 },    // G5
      { freq: 1047, duration: 0.35, delay: 0.42 },   // C6
    ], 0.07, 'sine');
  }, []);

  const playDefeat = useCallback(() => {
    if (!enabledRef.current) return;
    // Gentle descending
    playSequence([
      { freq: 392, duration: 0.18, delay: 0 },       // G4
      { freq: 330, duration: 0.18, delay: 0.18 },    // E4
      { freq: 262, duration: 0.25, delay: 0.36 },    // C4
    ], 0.06, 'triangle');
  }, []);

  const playCombo = useCallback(() => {
    if (!enabledRef.current) return;
    // Quick sparkle
    playSequence([
      { freq: 1047, duration: 0.08, delay: 0 },      // C6
      { freq: 1319, duration: 0.08, delay: 0.06 },   // E6
      { freq: 1568, duration: 0.12, delay: 0.12 },   // G6
    ], 0.05, 'sine');
  }, []);

  const playClick = useCallback(() => {
    if (!enabledRef.current) return;
    // Tiny soft tap
    playSequence([
      { freq: 880, duration: 0.03, delay: 0 },
    ], 0.04, 'sine');
  }, []);

  const setEnabled = useCallback((val: boolean) => {
    enabledRef.current = val;
  }, []);

  return { playSuccess, playError, playVictory, playDefeat, playCombo, playClick, setEnabled };
}
