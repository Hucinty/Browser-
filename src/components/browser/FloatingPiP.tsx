import React, { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2, Pause, Play, Volume2, VolumeX, X } from 'lucide-react';

interface FloatingPiPProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc?: string;
  videoTitle?: string;
  onExpandToTab?: () => void;
}

export const FloatingPiP: React.FC<FloatingPiPProps> = ({
  isOpen,
  onClose,
  videoSrc = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  videoTitle = 'Nature Panorama 4K - Background Stream',
  onExpandToTab,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [position, setPosition] = useState({ x: 24, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 24,
    posY: 80,
  });
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(() => {
        // autoplay with sound might need user interaction, keep muted
        setIsMuted(true);
      });
    }
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag from header handle
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPosition({
        x: Math.max(10, Math.min(window.innerWidth - 340, dragRef.current.posX + dx)),
        y: Math.max(40, Math.min(window.innerHeight - 220, dragRef.current.posY + dy)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!isOpen) return null;

  return (
    <div
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      className="fixed z-50 w-80 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md transition-shadow select-none"
    >
      {/* PiP Header / Drag Handle */}
      <div
        onMouseDown={handleMouseDown}
        className="flex items-center justify-between px-3 py-2 bg-slate-950/90 border-b border-slate-800 cursor-move text-xs text-slate-300 hover:text-white"
      >
        <div className="flex items-center gap-2 truncate pr-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
          <span className="font-medium truncate">{videoTitle}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {onExpandToTab && (
            <button
              onClick={onExpandToTab}
              title="Expand to Full Tab"
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            title="Close Picture in Picture"
            className="p-1 hover:bg-rose-500/20 hover:text-rose-400 rounded text-slate-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Video Content */}
      <div className="relative aspect-video bg-black group overflow-hidden">
        <video
          ref={videoRef}
          src={videoSrc}
          loop
          autoPlay
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Floating Controls Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (videoRef.current) {
                  if (isPlaying) {
                    videoRef.current.pause();
                    setIsPlaying(false);
                  } else {
                    videoRef.current.play();
                    setIsPlaying(true);
                  }
                }
              }}
              className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.muted = !isMuted;
                  setIsMuted(!isMuted);
                }
              }}
              className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          <span className="text-[10px] text-slate-300 font-mono">
            PiP Background Mode
          </span>
        </div>
      </div>
    </div>
  );
};
