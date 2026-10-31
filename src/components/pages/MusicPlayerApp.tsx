import React, { useState, useEffect, useRef } from 'react';
import { Disc, Headphones, Pause, Play, Radio, SkipBack, SkipForward, Volume2, VolumeX, Zap } from 'lucide-react';
import { audioEngine, AudioEngineState } from '../../services/audioEngine';

export const MusicPlayerApp: React.FC = () => {
  const [audioState, setAudioState] = useState<AudioEngineState>(audioEngine.getState());
  const [visualizerBars, setVisualizerBars] = useState<number[]>(new Array(32).fill(15));
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    return audioEngine.subscribe(setAudioState);
  }, []);

  useEffect(() => {
    if (!audioState.isPlaying) {
      setVisualizerBars(new Array(32).fill(8));
      return;
    }

    const renderBars = () => {
      const data = audioEngine.getWaveformData();
      const bars: number[] = [];
      const step = Math.floor(data.length / 32);
      for (let i = 0; i < 32; i++) {
        const val = data[i * step] || 0;
        bars.push(Math.max(6, Math.min(100, (val / 255) * 100)));
      }
      setVisualizerBars(bars);
      animRef.current = requestAnimationFrame(renderBars);
    };

    animRef.current = requestAnimationFrame(renderBars);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [audioState.isPlaying]);

  const currentTrack = audioState.currentTrack;

  const formatSeconds = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-full bg-slate-950 text-slate-100 p-6 flex flex-col justify-center items-center">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Status Pill */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Nova Background Stream Engine
            </span>
          </div>
          <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-mono">
            Plays with Screen Off
          </span>
        </div>

        {/* Album Artwork & Track Information */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-44 h-44 rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700 bg-slate-800 shrink-0 group">
            <img
              src={currentTrack.coverArt}
              alt={currentTrack.title}
              className={`w-full h-full object-cover transition-transform duration-1000 ${
                audioState.isPlaying ? 'scale-105' : 'scale-100'
              }`}
            />
            {audioState.isPlaying && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Disc className="w-12 h-12 text-white animate-spin" style={{ animationDuration: '6s' }} />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2 text-center sm:text-left min-w-0">
            <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold">
              {currentTrack.genre}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight truncate">
              {currentTrack.title}
            </h1>
            <p className="text-sm text-slate-400">{currentTrack.artist}</p>
            <p className="text-xs text-slate-500 font-mono">{currentTrack.album}</p>
          </div>
        </div>

        {/* Real-time Frequency Spectrum Visualizer */}
        <div className="h-16 bg-slate-950/80 rounded-2xl p-2.5 flex items-end justify-between gap-1 border border-slate-800">
          {visualizerBars.map((height, idx) => (
            <div
              key={idx}
              style={{ height: `${height}%` }}
              className={`w-full rounded-t transition-all duration-75 ${
                audioState.isPlaying
                  ? 'bg-gradient-to-t from-amber-500 via-orange-400 to-amber-300'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Timeline Scrubber */}
        <div className="space-y-1.5">
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${(audioState.currentTime / currentTrack.duration) * 100}%` }}
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-200"
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>{formatSeconds(audioState.currentTime)}</span>
            <span>{formatSeconds(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Playback Controls & Volume */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* Controls */}
          <div className="flex items-center gap-3 mx-auto sm:mx-0">
            <button
              onClick={() => audioEngine.previousTrack()}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={() => audioEngine.toggle()}
              className="p-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full shadow-lg shadow-amber-500/25 transition transform active:scale-95"
            >
              {audioState.isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>
            <button
              onClick={() => audioEngine.nextTrack()}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <button
              onClick={() => audioEngine.setVolume(audioState.volume > 0 ? 0 : 0.7)}
              className="text-slate-400 hover:text-white"
            >
              {audioState.volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={audioState.volume}
              onChange={(e) => audioEngine.setVolume(parseFloat(e.target.value))}
              className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>
        </div>

        {/* Available Stations list */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Available Audio Stations ({audioState.tracks.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {audioState.tracks.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => audioEngine.selectTrack(idx)}
                className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition ${
                  idx === audioState.currentTrackIndex
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-medium'
                    : 'bg-slate-950/60 border-slate-850 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="truncate pr-2">
                  <p className="truncate font-semibold">{t.title}</p>
                  <p className="text-[10px] text-slate-500">{t.genre}</p>
                </div>
                {idx === audioState.currentTrackIndex && audioState.isPlaying && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
