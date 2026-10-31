import React, { useState } from 'react';
import { Eye, Heart, MessageSquare, PictureInPicture2, Play, Share2, ThumbsUp, Volume2 } from 'lucide-react';

interface VideoPlayerAppProps {
  onTriggerPiP: (src: string, title: string) => void;
}

interface VideoItem {
  id: string;
  title: string;
  channel: string;
  views: string;
  timeAgo: string;
  videoUrl: string;
  thumbnail: string;
  description: string;
}

const VIDEOS: VideoItem[] = [
  {
    id: 'v-1',
    title: 'Cinematic Cyberpunk 4K - Tokyo Night Walk with Synth Beats',
    channel: 'NeoTokyo Media',
    views: '1.4M views',
    timeAgo: '3 days ago',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    description: 'Immersive 4K visual stream capturing late night neon aesthetics in Shinjuku and Akihabara. Works in background and Picture-in-Picture.',
  },
  {
    id: 'v-2',
    title: 'Deep Focus Lo-Fi Coding & Study Session [Live Stream]',
    channel: 'Nova Soundworks',
    views: '840K views',
    timeAgo: 'Streaming now',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    description: 'Relaxing ambient beats for coding, studying, and creative work. Supports background playback even when device screen turns off.',
  },
  {
    id: 'v-3',
    title: 'Retro 80s Arcade Speedrun & Cabinet Showcase',
    channel: 'PixelQuest Arcade',
    views: '320K views',
    timeAgo: '1 week ago',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    description: 'Exploring the golden era of arcade gaming and world record high scores.',
  },
];

export const VideoPlayerApp: React.FC<VideoPlayerAppProps> = ({ onTriggerPiP }) => {
  const [currentVideo, setCurrentVideo] = useState<VideoItem>(VIDEOS[0]);
  const [likes, setLikes] = useState(4820);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((l) => (isLiked ? l - 1 : l + 1));
  };

  return (
    <div className="min-h-full bg-slate-950 text-slate-100 p-4 lg:p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Player */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 group">
            <video
              key={currentVideo.videoUrl}
              src={currentVideo.videoUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Quick PiP Button Overlay */}
            <button
              onClick={() => onTriggerPiP(currentVideo.videoUrl, currentVideo.title)}
              className="absolute top-4 right-4 z-20 px-3 py-1.5 bg-black/70 hover:bg-black/90 border border-white/20 text-white rounded-lg text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-lg transition transform hover:scale-105"
              title="Pop out in Picture-in-Picture window"
            >
              <PictureInPicture2 className="w-4 h-4 text-cyan-400" />
              <span>Picture-in-Picture</span>
            </button>
          </div>

          {/* Title & Metadata */}
          <div className="space-y-3">
            <h1 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {currentVideo.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-sm text-white">
                  {currentVideo.channel.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{currentVideo.channel}</h3>
                  <span className="text-[11px] text-slate-400">148K subscribers</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1.5 transition ${
                    isLiked
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="font-mono tabular-nums">{likes}</span>
                </button>

                <button
                  onClick={() => onTriggerPiP(currentVideo.videoUrl, currentVideo.title)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-medium flex items-center gap-1.5 shadow-md transition"
                >
                  <PictureInPicture2 className="w-3.5 h-3.5" />
                  <span>Float in PiP</span>
                </button>
              </div>
            </div>

            {/* Video Description */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300 space-y-1">
              <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                <span>{currentVideo.views}</span>
                <span>•</span>
                <span>{currentVideo.timeAgo}</span>
              </div>
              <p className="leading-relaxed">{currentVideo.description}</p>
            </div>
          </div>
        </div>

        {/* Video Recommendations Sidebar */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Up Next</h2>
          <div className="space-y-3">
            {VIDEOS.map((vid) => (
              <div
                key={vid.id}
                onClick={() => setCurrentVideo(vid)}
                className={`p-2.5 rounded-xl border cursor-pointer transition flex gap-3 ${
                  vid.id === currentVideo.id
                    ? 'bg-slate-900 border-indigo-500/50'
                    : 'bg-slate-950/60 border-slate-850 hover:bg-slate-900 hover:border-slate-800'
                }`}
              >
                <div className="relative w-32 aspect-video rounded-lg overflow-hidden shrink-0 bg-slate-900">
                  <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] px-1 rounded text-white font-mono">
                    4K
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-medium text-slate-200 line-clamp-2 leading-tight">
                    {vid.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 truncate">{vid.channel}</p>
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{vid.views}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
