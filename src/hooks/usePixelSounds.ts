import { useCallback, useRef } from 'react';

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

function playTone(freq: number, duration: number, delay: number, volume: number, wave: OscillatorType = 'sine') {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = wave;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

  // Very gentle envelope
  gain.gain.setValueAtTime(0, ctx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);

  // Heavy lowpass to keep sounds soft and warm
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1800, ctx.currentTime + delay);
  filter.Q.setValueAtTime(0.5, ctx.currentTime + delay);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
}

export function usePixelSounds() {
  const enabledRef = useRef(true);

  const playSuccess = useCallback(() => {
    if (!enabledRef.current) return;
    // Soft gentle ding
    playTone(523, 0.2, 0, 0.035, 'sine');    // C5
    playTone(659, 0.25, 0.15, 0.03, 'sine');  // E5
  }, []);

  const playError = useCallback(() => {
    if (!enabledRef.current) return;
    // Very soft low hum
    playTone(196, 0.18, 0, 0.025, 'sine');    // G3
    playTone(175, 0.2, 0.12, 0.02, 'sine');   // F3
  }, []);

  const playVictory = useCallback(() => {
    if (!enabledRef.current) return;
    // Gentle ascending melody
    playTone(392, 0.15, 0, 0.03, 'sine');     // G4
    playTone(494, 0.15, 0.14, 0.03, 'sine');  // B4
    playTone(587, 0.15, 0.28, 0.03, 'sine');  // D5
    playTone(784, 0.3, 0.42, 0.025, 'sine');  // G5
  }, []);

  const playDefeat = useCallback(() => {
    if (!enabledRef.current) return;
    // Gentle descending
    playTone(330, 0.2, 0, 0.025, 'sine');     // E4
    playTone(294, 0.2, 0.18, 0.02, 'sine');   // D4
    playTone(262, 0.3, 0.36, 0.018, 'sine');  // C4
  }, []);

  const playCombo = useCallback(() => {
    if (!enabledRef.current) return;
    // Tiny sparkle
    playTone(784, 0.1, 0, 0.02, 'sine');      // G5
    playTone(988, 0.1, 0.08, 0.02, 'sine');   // B5
    playTone(1175, 0.15, 0.16, 0.018, 'sine');// D6
  }, []);

  const playClick = useCallback(() => {
    if (!enabledRef.current) return;
    // Tiny soft tick
    playTone(660, 0.04, 0, 0.02, 'sine');
  }, []);

  const setEnabled = useCallback((val: boolean) => {
    enabledRef.current = val;
  }, []);

  return { playSuccess, playError, playVictory, playDefeat, playCombo, playClick, setEnabled };
}
