import React, { useState, useEffect } from 'react';
import { Bookmark, Clock, Compass, ExternalLink, Gamepad2, Globe, Key, Music, PictureInPicture2, Puzzle, Search, Settings, Shield, Terminal, Zap } from 'lucide-react';
import { storageService } from '../../services/storage';

interface StartPageProps {
  onNavigate: (url: string) => void;
}

export const StartPage: React.FC<StartPageProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const [timeStr, setTimeStr] = useState('');
  const [greeting, setGreeting] = useState('Hello');
  const [quickNote, setQuickNote] = useState(() => localStorage.getItem('nova_quick_note') || '');
  const [savedLoginsCount, setSavedLoginsCount] = useState(() => storageService.getLogins().length);
  const [historyItems, setHistoryItems] = useState(() => storageService.getHistory().slice(0, 5));

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      const hour = now.getHours();
      if (hour < 12) setGreeting('Good morning');
      else if (hour < 18) setGreeting('Good afternoon');
      else setGreeting('Good evening');
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onNavigate(query.trim());
  };

  const handleNoteChange = (text: string) => {
    setQuickNote(text);
    localStorage.setItem('nova_quick_note', text);
  };

  const speedDials = [
    {
      title: 'Instagram',
      url: 'https://instagram.com',
      icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=instagram',
      category: 'Social Media',
      badge: 'Vault Saved',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Web Games Hub',
      url: 'nova://games',
      icon: 'Gamepad2',
      category: '2048 · Snake · Dino',
      badge: 'Arcade',
      color: 'from-amber-500 to-red-500',
    },
    {
      title: 'Lo-Fi Radio & Music',
      url: 'nova://music',
      icon: 'Music',
      category: 'Background Audio',
      badge: 'Screen-Off Play',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Password & Vault',
      url: 'nova://passwords',
      icon: 'Key',
      category: 'Login History',
      badge: `${savedLoginsCount} Logins`,
      color: 'from-indigo-500 to-blue-500',
    },
    {
      title: 'Video & PiP Player',
      url: 'nova://video',
      icon: 'PictureInPicture2',
      category: 'Streaming Media',
      badge: 'PiP Support',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      title: 'Developer Console',
      url: 'nova://devtools',
      icon: 'Terminal',
      category: 'Console · DOM · Network',
      badge: 'F12 Tools',
      color: 'from-slate-700 to-slate-900',
    },
    {
      title: 'Add-Ons & Extensions',
      url: 'nova://extensions',
      icon: 'Puzzle',
      category: 'AdBlock & Shields',
      badge: 'Store',
      color: 'from-fuchsia-600 to-purple-600',
    },
    {
      title: 'Browser Settings',
      url: 'nova://settings',
      icon: 'Settings',
      category: 'Preferences & Cache',
      badge: 'Config',
      color: 'from-slate-600 to-slate-800',
    },
  ];

  return (
    <div className="min-h-full bg-slate-950 text-slate-100 flex flex-col justify-between p-6 sm:p-10 select-none">
      {/* Top Bar Quick Stats */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-white">Nova OS Browser</span>
          <span className="text-slate-600">·</span>
          <span>Desktop Mode Ready</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Encrypted Vault Active</span>
          </span>
          <span className="text-slate-300 font-mono tabular-nums">{timeStr}</span>
        </div>
      </div>

      {/* Hero Clock & Omnibox */}
      <div className="max-w-2xl mx-auto w-full text-center space-y-6 my-auto py-8">
        <div className="space-y-1">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
            {timeStr}
          </h1>
          <p className="text-sm font-medium text-slate-400">
            {greeting}, where would you like to explore today?
          </p>
        </div>

        {/* Big Search Bar */}
        <form onSubmit={handleSearch} className="relative w-full max-w-xl mx-auto group">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-indigo-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the web or type a URL (e.g. instagram.com, games, music)..."
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-12 pr-28 py-3.5 text-sm text-white placeholder-slate-500 shadow-2xl backdrop-blur-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
          >
            Explore
          </button>
        </form>

        {/* Speed Dial Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          {speedDials.map((dial) => (
            <button
              key={dial.title}
              onClick={() => onNavigate(dial.url)}
              className="p-3.5 bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl text-left transition transform hover:-translate-y-0.5 shadow-lg group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${dial.color} flex items-center justify-center text-white shadow-md`}>
                  {dial.icon === 'Gamepad2' && <Gamepad2 className="w-4 h-4" />}
                  {dial.icon === 'Music' && <Music className="w-4 h-4" />}
                  {dial.icon === 'Key' && <Key className="w-4 h-4" />}
                  {dial.icon === 'PictureInPicture2' && <PictureInPicture2 className="w-4 h-4" />}
                  {dial.icon === 'Terminal' && <Terminal className="w-4 h-4" />}
                  {dial.icon === 'Puzzle' && <Puzzle className="w-4 h-4" />}
                  {dial.icon === 'Settings' && <Settings className="w-4 h-4" />}
                  {!['Gamepad2', 'Music', 'Key', 'PictureInPicture2', 'Terminal', 'Puzzle', 'Settings'].includes(dial.icon) && (
                    <Compass className="w-4 h-4" />
                  )}
                </div>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-800/80 px-1.5 py-0.5 rounded">
                  {dial.badge}
                </span>
              </div>
              <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 transition truncate">
                {dial.title}
              </h3>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{dial.category}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Bar: Scratchpad & Recent Visited */}
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Quick Notepad */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-300">Quick Browser Notepad</span>
            <span className="text-[10px] text-slate-500 font-mono">Auto-saved locally</span>
          </div>
          <textarea
            value={quickNote}
            onChange={(e) => handleNoteChange(e.target.value)}
            rows={2}
            placeholder="Jot down quick thoughts, links, or to-dos..."
            className="w-full bg-slate-950/80 border border-slate-850 rounded-xl p-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none font-mono"
          />
        </div>

        {/* Recently Visited */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Recent Browsing History</span>
            </span>
            <button
              onClick={() => onNavigate('nova://passwords')}
              className="text-[10px] text-indigo-400 hover:underline"
            >
              View Vault
            </button>
          </div>
          <div className="space-y-1.5">
            {historyItems.map((h) => (
              <div
                key={h.id}
                onClick={() => onNavigate(h.url)}
                className="flex items-center justify-between hover:bg-slate-800/60 p-1 rounded-lg cursor-pointer transition text-slate-300 hover:text-white"
              >
                <span className="truncate pr-2 font-medium">{h.title}</span>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">
                  {new Date(h.visitedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
