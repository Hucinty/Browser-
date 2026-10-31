import React from 'react';
import { Compass, Gamepad2, Globe, Key, Music, PictureInPicture2, Plus, Puzzle, Settings, Terminal, Volume2, X } from 'lucide-react';
import { Tab } from '../../types/browser';

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: () => void;
  isAudioPlaying: boolean;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  isAudioPlaying,
}) => {
  const getTabIcon = (url: string) => {
    if (url.includes('instagram.com')) {
      return (
        <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center shrink-0" />
      );
    }
    if (url.includes('nova://games') || url.includes('games')) {
      return <Gamepad2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
    }
    if (url.includes('nova://music') || url.includes('music')) {
      return <Music className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
    }
    if (url.includes('nova://passwords') || url.includes('passwords')) {
      return <Key className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
    }
    if (url.includes('nova://devtools') || url.includes('devtools')) {
      return <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
    }
    if (url.includes('nova://extensions') || url.includes('extensions')) {
      return <Puzzle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    }
    if (url.includes('nova://settings') || url.includes('settings')) {
      return <Settings className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    }
    if (url.includes('nova://video') || url.includes('video')) {
      return <PictureInPicture2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
    }
    return <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
  };

  return (
    <div className="h-10 bg-slate-950 flex items-center px-2 select-none border-b border-slate-800/80 gap-1 overflow-x-auto no-scrollbar">
      {/* Window Controls Simulation */}
      <div className="flex items-center gap-1.5 px-2 mr-2">
        <span className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 cursor-pointer transition" />
        <span className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 cursor-pointer transition" />
        <span className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 cursor-pointer transition" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const isPlayingSound = isAudioPlaying && (tab.url.includes('music') || isActive);

          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-t-lg cursor-pointer max-w-56 min-w-32 transition-all duration-150 text-xs ${
                isActive
                  ? 'bg-slate-900 text-slate-100 font-medium shadow-md border-t border-x border-slate-850'
                  : 'bg-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              {/* Tab Icon */}
              {getTabIcon(tab.url)}

              {/* Tab Title */}
              <span className="truncate flex-1 font-sans">{tab.title}</span>

              {/* Sound indicator */}
              {isPlayingSound && (
                <Volume2 className="w-3 h-3 text-amber-400 animate-pulse shrink-0" />
              )}

              {/* Close Button */}
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                  className="p-0.5 rounded-full hover:bg-slate-800 text-slate-500 hover:text-slate-200 opacity-60 group-hover:opacity-100 transition"
                  title="Close Tab (Ctrl+W)"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        {/* New Tab Button */}
        <button
          onClick={onNewTab}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900/60 rounded-lg transition"
          title="New Tab (Ctrl+T)"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
