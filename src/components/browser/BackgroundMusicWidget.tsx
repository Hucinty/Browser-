import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown, Disc, Headphones, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react';
import { audioEngine, AudioEngineState } from '../../services/audioEngine';

interface BackgroundMusicWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackgroundMusicWidget: React.FC<BackgroundMusicWidgetProps> = ({
  isOpen,
  onClose,
}) => {
  const [audioState, setAudioState] = useState<AudioEngineState>(audioEngine.getState());
  const [bars, setBars] = useState<number[]>(new Array(16).fill(10));
  const [showStationList, setShowStationList] = useState(false);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const unsub = audioEngine.subscribe(setAudioState);
    return unsub;
  }, []);

  // Waveform visualization loop
  useEffect(() => {
    if (!audioState.isPlaying) {
      setBars(new Array(16).fill(6));
      return;
    }

    const updateVisualizer = () => {
      const data = audioEngine.getWaveformData();
      const newBars: number[] = [];
      const step = Math.floor(data.length / 16);
      for (let i = 0; i < 16; i++) {
        const val = data[i * step] || 0;
        // scale to percentage height
        const height = Math.max(8, Math.min(100, (val / 255) * 100));
        newBars.push(height);
      }
      setBars(newBars);
      animFrameRef.current = requestAnimationFrame(updateVisualizer);
    };

    animFrameRef.current = requestAnimationFrame(updateVisualizer);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [audioState.isPlaying]);

  if (!isOpen) return null;

  const currentTrack = audioState.currentTrack;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="absolute top-12 right-24 z-50 w-84 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl p-4 text-slate-100 select-none animate-in fade-in slide-in-from-top-2 duration-150">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Background Audio Station
            </h4>
            <span className="text-[10px] text-emerald-400 font-mono">
              Plays in background & screen off
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Track Info & Visualizer */}
      <div className="pt-3.5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
            <img
              src={currentTrack.coverArt}
              alt={currentTrack.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${audioState.isPlaying ? 'scale-105' : 'scale-100'}`}
              referrerPolicy="no-referrer"
            />
            {audioState.isPlaying && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Disc className="w-6 h-6 text-white/90 animate-spin" style={{ animationDuration: '4s' }} />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate" title={currentTrack.title}>
              {currentTrack.title}
            </p>
            <p className="text-[11px] text-slate-400 truncate">{currentTrack.artist}</p>
            <span className="inline-block text-[10px] text-amber-300/80 bg-amber-500/10 px-1.5 py-0.5 rounded mt-0.5 font-medium">
              {currentTrack.genre}
            </span>
          </div>
        </div>

        {/* Real-time Visualizer bars */}
        <div className="h-9 bg-slate-950/60 rounded-lg p-1.5 flex items-end justify-between gap-1 border border-slate-800/80">
          {bars.map((height, i) => (
            <div
              key={i}
              style={{ height: `${height}%` }}
              className={`w-full rounded-t-sm transition-all duration-75 ${
                audioState.isPlaying ? 'bg-gradient-to-t from-amber-500 to-amber-300' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Time Progress */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>{formatTime(audioState.currentTime)}</span>
          <div className="h-1 flex-1 mx-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${Math.min(100, (audioState.currentTime / currentTrack.duration) * 100)}%` }}
              className="h-full bg-amber-400 transition-all duration-300"
            />
          </div>
          <span>{formatTime(currentTrack.duration)}</span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => audioEngine.previousTrack()}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => audioEngine.toggle()}
              className="p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-full shadow-lg shadow-amber-500/20 transition transform active:scale-95"
            >
              {audioState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button
              onClick={() => audioEngine.nextTrack()}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => audioEngine.setVolume(audioState.volume > 0 ? 0 : 0.7)}
              className="text-slate-400 hover:text-slate-200"
            >
              {audioState.volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={audioState.volume}
              onChange={(e) => audioEngine.setVolume(parseFloat(e.target.value))}
              className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>
        </div>

        {/* Stations Dropdown */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={() => setShowStationList(!showStationList)}
            className="w-full flex items-center justify-between py-1.5 px-2 bg-slate-950/80 hover:bg-slate-800/80 rounded-lg text-xs text-slate-300 transition"
          >
            <span>Change Audio Station ({audioState.tracks.length})</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showStationList ? 'rotate-180' : ''}`} />
          </button>

          {showStationList && (
            <div className="mt-1.5 space-y-1 max-h-36 overflow-y-auto pr-1">
              {audioState.tracks.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => {
                    audioEngine.selectTrack(idx);
                    setShowStationList(false);
                  }}
                  className={`w-full text-left p-1.5 rounded-lg flex items-center justify-between text-xs transition ${
                    idx === audioState.currentTrackIndex
                      ? 'bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className="truncate text-[11px]">{t.title}</p>
                    <p className="text-[10px] text-slate-500">{t.genre}</p>
                  </div>
                  {idx === audioState.currentTrackIndex && audioState.isPlaying && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
