import React from 'react';
import { Bookmark, Gamepad2, Globe, Key, Music, PictureInPicture2, Terminal } from 'lucide-react';

interface BookmarksBarProps {
  onNavigate: (url: string) => void;
  activeUrl: string;
}

export const BookmarksBar: React.FC<BookmarksBarProps> = ({ onNavigate, activeUrl }) => {
  const bookmarks = [
    { title: 'Instagram', url: 'https://instagram.com', color: 'text-pink-400' },
    { title: 'Web Games Hub', url: 'nova://games', color: 'text-purple-400', icon: 'Gamepad2' },
    { title: 'Lo-Fi Radio & Music', url: 'nova://music', color: 'text-amber-400', icon: 'Music' },
    { title: 'Password & Vault', url: 'nova://passwords', color: 'text-indigo-400', icon: 'Key' },
    { title: 'Video & PiP Player', url: 'nova://video', color: 'text-sky-400', icon: 'PictureInPicture2' },
    { title: 'Developer Tools', url: 'nova://devtools', color: 'text-cyan-400', icon: 'Terminal' },
    { title: 'Add-Ons & Extensions', url: 'nova://extensions', color: 'text-emerald-400' },
  ];

  return (
    <div className="h-7 bg-slate-920 border-b border-slate-800/80 px-3 flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-300 select-none no-scrollbar">
      {bookmarks.map((bm) => {
        const isActive = activeUrl.startsWith(bm.url);
        return (
          <button
            key={bm.title}
            onClick={() => onNavigate(bm.url)}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-slate-800/80 transition truncate ${
              isActive ? 'text-white font-medium bg-slate-800/60' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {bm.icon === 'Gamepad2' && <Gamepad2 className={`w-3 h-3 ${bm.color}`} />}
            {bm.icon === 'Music' && <Music className={`w-3 h-3 ${bm.color}`} />}
            {bm.icon === 'Key' && <Key className={`w-3 h-3 ${bm.color}`} />}
            {bm.icon === 'PictureInPicture2' && <PictureInPicture2 className={`w-3 h-3 ${bm.color}`} />}
            {bm.icon === 'Terminal' && <Terminal className={`w-3 h-3 ${bm.color}`} />}
            {!bm.icon && <Globe className={`w-3 h-3 ${bm.color}`} />}
            <span className="truncate">{bm.title}</span>
          </button>
        );
      })}
    </div>
  );
};
