import { createContext, useContext, useEffect, useState, useRef, useCallback, type ReactNode } from 'react';
import { usePortfolioStore } from '../../store/usePortfolioStore';

interface AudioContextValue {
  play: (sound: SoundName) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  volume: number;
  muted: boolean;
  // Convenience methods
  pageTurn: () => void;
  brassClick: () => void;
  emberWhoosh: () => void;
  inkScratch: () => void;
  hoverGlow: () => void;
  openDiary: () => void;
  closeDiary: () => void;
  success: () => void;
}

// Sound definitions - using Web Audio API for procedural generation
const SOUNDS = {
  pageTurn: { type: 'noise', duration: 0.3, frequency: 200, gain: 0.15 },
  brassClick: { type: 'sine', duration: 0.15, frequency: 800, gain: 0.2 },
  emberWhoosh: { type: 'noise', duration: 0.5, frequency: 100, gain: 0.1 },
  inkScratch: { type: 'square', duration: 0.2, frequency: 400, gain: 0.12 },
  hoverGlow: { type: 'sine', duration: 0.1, frequency: 1200, gain: 0.08 },
  openDiary: { type: 'triangle', duration: 0.4, frequency: 300, gain: 0.18 },
  closeDiary: { type: 'triangle', duration: 0.3, frequency: 200, gain: 0.15 },
  success: { type: 'sine', duration: 0.5, frequency: 523, gain: 0.15 },
} as const;

type SoundName = keyof typeof SOUNDS;

const AudioContext = createContext<AudioContextValue | null>(null);

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

function playSound(name: SoundName, volume: number, muted: boolean) {
  if (muted) return;

  const ctx = getAudioContext();
  const sound = SOUNDS[name];
  const now = ctx.currentTime;

  // Resume context if suspended (browser autoplay policy)
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const masterGain = ctx.createGain();
  masterGain.gain.value = volume;
  masterGain.connect(ctx.destination);

  if (sound.type === 'noise') {
    // Generate noise for page turn, ember whoosh
    const bufferSize = ctx.sampleRate * sound.duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Filtered noise
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.1));
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Low-pass filter for warm noise
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = sound.frequency;
    filter.Q.value = 2;

    source.connect(filter).connect(masterGain);
    source.start(now);
    source.stop(now + sound.duration);
  } else if (name === 'success') {
    // Chord/arpeggio for success sound
    const frequencies = [523, 659, 784];
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = sound.type;
      osc.frequency.value = freq;
      osc.connect(masterGain);
      osc.start(now + i * 0.1);
      osc.stop(now + sound.duration);
    });
  } else {
    // Tonal sounds
    const osc = ctx.createOscillator();
    osc.type = sound.type;
    osc.frequency.value = sound.frequency;

    const gain = ctx.createGain();
    gain.gain.value = sound.gain;
    gain.gain.setValueAtTime(sound.gain, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + sound.duration);

    osc.connect(gain).connect(masterGain);
    osc.start(now);
    osc.stop(now + sound.duration);
  }
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const [volume, setVolumeState] = useState(0.5);
  const [muted, setMutedState] = useState(false);
  const { reducedMotion } = usePortfolioStore();
  const initialized = useRef(false);

  // Initialize audio context on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (!initialized.current) {
        getAudioContext();
        initialized.current = true;
      }
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
    };

    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });

    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
    };
  }, []);

  const play = useCallback((sound: SoundName) => {
    if (reducedMotion) return; // Respect reduced motion for audio too
    playSound(sound, volume, muted);
  }, [volume, muted, reducedMotion]);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    // Store preference
    try { localStorage.setItem('portfolio-audio-volume', String(clamped)); } catch {}
  }, []);

  const setMuted = useCallback((m: boolean) => {
    setMutedState(m);
    try { localStorage.setItem('portfolio-audio-muted', String(m)); } catch {}
  }, []);

  // Load saved preferences
  useEffect(() => {
    try {
      const savedVolume = localStorage.getItem('portfolio-audio-volume');
      const savedMuted = localStorage.getItem('portfolio-audio-muted');
      if (savedVolume) setVolumeState(parseFloat(savedVolume));
      if (savedMuted) setMutedState(savedMuted === 'true');
    } catch {}
  }, []);

  const value: AudioContextValue = {
    play,
    setVolume,
    setMuted,
    volume,
    muted,
    pageTurn: () => play('pageTurn'),
    brassClick: () => play('brassClick'),
    emberWhoosh: () => play('emberWhoosh'),
    inkScratch: () => play('inkScratch'),
    hoverGlow: () => play('hoverGlow'),
    openDiary: () => play('openDiary'),
    closeDiary: () => play('closeDiary'),
    success: () => play('success'),
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}

// Convenience hook for common UI sounds
export function useUISounds() {
  const { play } = useAudio();

  return {
    pageTurn: () => play('pageTurn'),
    brassClick: () => play('brassClick'),
    emberWhoosh: () => play('emberWhoosh'),
    inkScratch: () => play('inkScratch'),
    hoverGlow: () => play('hoverGlow'),
    openDiary: () => play('openDiary'),
    closeDiary: () => play('closeDiary'),
    success: () => play('success'),
  };
}