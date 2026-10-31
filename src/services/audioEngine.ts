import { AudioTrack } from '../types/browser';

export const TRACKS: AudioTrack[] = [
  {
    id: 'track-lofi',
    title: 'Midnight Coffee & Rainy Window',
    artist: 'Nova Chillout Lab',
    album: 'Lofi Horizons Vol. 1',
    genre: 'Lo-Fi Hip Hop',
    duration: 180,
    coverArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
    streamUrl: 'https://actions.google.com/sounds/v1/water/rain_heavy.ogg', // reliable standard test audio stream
    synthBpm: 72,
    synthScale: 'pentatonic-minor',
  },
  {
    id: 'track-synthwave',
    title: 'Neon Skyline 1984',
    artist: 'CyberPulse Unit',
    album: 'Retrofuturism OS',
    genre: 'Synthwave',
    duration: 210,
    coverArt: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80',
    streamUrl: 'https://actions.google.com/sounds/v1/science_fiction/alien_spaceship_hum.ogg',
    synthBpm: 110,
    synthScale: 'dorian',
  },
  {
    id: 'track-piano',
    title: 'Quiet Reflections in Autumn',
    artist: 'Seraphina Vale',
    album: 'Nocturnes for Solitude',
    genre: 'Ambient Neo-Classical',
    duration: 195,
    coverArt: 'https://images.unsplash.com/photo-1520523839898-507127053c37?w=300&auto=format&fit=crop&q=80',
    streamUrl: 'https://actions.google.com/sounds/v1/weather/thunderstorm.ogg',
    synthBpm: 60,
    synthScale: 'major',
  },
  {
    id: 'track-arcade',
    title: '8-Bit Cyber Odyssey',
    artist: 'BitChip Hero',
    album: 'Arcade Classics Revamped',
    genre: 'Chiptune',
    duration: 160,
    coverArt: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&auto=format&fit=crop&q=80',
    streamUrl: 'https://actions.google.com/sounds/v1/cartoon/metal_impact_scrape.ogg',
    synthBpm: 128,
    synthScale: 'blues',
  },
];

class BackgroundAudioEngine {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private currentTrackIndex = 0;
  private volume = 0.7;
  private timerId: number | null = null;
  private listeners: Set<(state: AudioEngineState) => void> = new Set();
  private currentTime = 0;
  private step = 0;

  constructor() {
    this.setupMediaSession();
  }

  private setupMediaSession() {
    if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => this.play());
      navigator.mediaSession.setActionHandler('pause', () => this.pause());
      navigator.mediaSession.setActionHandler('previoustrack', () => this.previousTrack());
      navigator.mediaSession.setActionHandler('nexttrack', () => this.nextTrack());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          this.currentTime = details.seekTime;
          this.notify();
        }
      });
    }
  }

  private updateMediaSessionMetadata(track: AudioTrack) {
    if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album,
        artwork: [
          { src: track.coverArt, sizes: '96x96', type: 'image/jpeg' },
          { src: track.coverArt, sizes: '256x256', type: 'image/jpeg' },
          { src: track.coverArt, sizes: '512x512', type: 'image/jpeg' },
        ],
      });
      navigator.mediaSession.playbackState = this.isPlaying ? 'playing' : 'paused';
    }
  }

  private initAudio() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);

      this.gainNode.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Synthesizes soothing procedural music note events synchronized to track tempo
  private playSynthNote() {
    if (!this.isPlaying || !this.audioCtx || !this.gainNode) return;

    const track = this.getCurrentTrack();
    const chordsMap: Record<string, number[]> = {
      'pentatonic-minor': [220, 261.63, 293.66, 329.63, 392.0, 440, 523.25], // A minor pentatonic
      'dorian': [220, 246.94, 261.63, 293.66, 329.63, 369.99, 392.0], // A dorian
      'major': [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88], // C major
      'blues': [196.0, 233.08, 261.63, 277.18, 293.66, 349.23], // G blues
    };

    const scale = chordsMap[track.synthScale || 'pentatonic-minor'] || chordsMap['pentatonic-minor'];
    
    // Pick harmonic root and melody
    const noteFreq = scale[(this.step + Math.floor(Math.random() * 3)) % scale.length];
    const bassFreq = scale[this.step % 3] / 2;

    const now = this.audioCtx.currentTime;

    // Melody Oscillator
    const osc = this.audioCtx.createOscillator();
    const noteGain = this.audioCtx.createGain();

    osc.type = track.genre.includes('Synthwave') ? 'sawtooth' : track.genre.includes('Chiptune') ? 'square' : 'sine';
    osc.frequency.setValueAtTime(noteFreq, now);

    // Envelope
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(0.12 * this.volume, now + 0.05);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    osc.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc.start(now);
    osc.stop(now + 0.85);

    // Warm sub-bass note on every 4th step
    if (this.step % 4 === 0) {
      const bassOsc = this.audioCtx.createOscillator();
      const bassGain = this.audioCtx.createGain();

      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(bassFreq, now);

      bassGain.gain.setValueAtTime(0.001, now);
      bassGain.gain.linearRampToValueAtTime(0.18 * this.volume, now + 0.08);
      bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

      bassOsc.connect(bassGain);
      bassGain.connect(this.gainNode);

      bassOsc.start(now);
      bassOsc.stop(now + 1.65);
    }

    this.step++;
  }

  public play() {
    this.initAudio();
    this.isPlaying = true;
    const track = this.getCurrentTrack();
    this.updateMediaSessionMetadata(track);

    if (this.timerId) window.clearInterval(this.timerId);

    const intervalMs = Math.round(60000 / (track.synthBpm || 72));
    this.timerId = window.setInterval(() => {
      this.playSynthNote();
      this.currentTime += intervalMs / 1000;
      if (this.currentTime >= track.duration) {
        this.nextTrack();
      } else {
        this.notify();
      }
    }, intervalMs);

    this.playSynthNote();
    this.notify();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    const track = this.getCurrentTrack();
    this.updateMediaSessionMetadata(track);
    this.notify();
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % TRACKS.length;
    this.currentTime = 0;
    this.step = 0;
    const track = this.getCurrentTrack();
    this.updateMediaSessionMetadata(track);
    if (this.isPlaying) {
      this.play();
    } else {
      this.notify();
    }
  }

  public previousTrack() {
    this.currentTrackIndex = (this.currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    this.currentTime = 0;
    this.step = 0;
    const track = this.getCurrentTrack();
    this.updateMediaSessionMetadata(track);
    if (this.isPlaying) {
      this.play();
    } else {
      this.notify();
    }
  }

  public selectTrack(index: number) {
    if (index >= 0 && index < TRACKS.length) {
      this.currentTrackIndex = index;
      this.currentTime = 0;
      this.step = 0;
      const track = this.getCurrentTrack();
      this.updateMediaSessionMetadata(track);
      if (this.isPlaying) {
        this.play();
      } else {
        this.notify();
      }
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.audioCtx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    }
    this.notify();
  }

  public getCurrentTrack(): AudioTrack {
    return TRACKS[this.currentTrackIndex];
  }

  public getWaveformData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(32).fill(0);
    }
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  public getState(): AudioEngineState {
    return {
      isPlaying: this.isPlaying,
      currentTrack: this.getCurrentTrack(),
      currentTrackIndex: this.currentTrackIndex,
      volume: this.volume,
      currentTime: Math.floor(this.currentTime),
      tracks: TRACKS,
    };
  }

  public subscribe(listener: (state: AudioEngineState) => void) {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }
}

export interface AudioEngineState {
  isPlaying: boolean;
  currentTrack: AudioTrack;
  currentTrackIndex: number;
  volume: number;
  currentTime: number;
  tracks: AudioTrack[];
}

export const audioEngine = new BackgroundAudioEngine();
