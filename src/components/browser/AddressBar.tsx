import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  Disc,
  ExternalLink,
  Gamepad2,
  Globe,
  Home,
  Key,
  Laptop,
  Lock,
  Maximize,
  Minimize,
  Moon,
  MoreVertical,
  Music,
  PictureInPicture2,
  Printer,
  Puzzle,
  RotateCw,
  Search,
  Settings,
  Shield,
  Smartphone,
  Star,
  Tablet,
  Terminal,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Tab, ViewportMode } from '../../types/browser';
import { audioEngine } from '../../services/audioEngine';

interface AddressBarProps {
  activeTab: Tab;
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  onReload: () => void;
  onGoHome: () => void;
  onNavigate: (url: string) => void;
  viewportMode: ViewportMode;
  onChangeViewportMode: (mode: ViewportMode) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenPrint: () => void;
  onOpenDevTools: () => void;
  isDevToolsOpen: boolean;
  onToggleMusicWidget: () => void;
  isMusicWidgetOpen: boolean;
  onTriggerPiP: () => void;
  onOpenPasswords: () => void;
  onOpenExtensions: () => void;
  onOpenSettings: () => void;
  onToggleBookmark: () => void;
  isBookmarked: boolean;
}

export const AddressBar: React.FC<AddressBarProps> = ({
  activeTab,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  onReload,
  onGoHome,
  onNavigate,
  viewportMode,
  onChangeViewportMode,
  isFullscreen,
  onToggleFullscreen,
  onOpenPrint,
  onOpenDevTools,
  isDevToolsOpen,
  onToggleMusicWidget,
  isMusicWidgetOpen,
  onTriggerPiP,
  onOpenPasswords,
  onOpenExtensions,
  onOpenSettings,
  onToggleBookmark,
  isBookmarked,
}) => {
  const [urlInput, setUrlInput] = useState(activeTab.url);
  const [isFocused, setIsFocused] = useState(false);
  const [showSecurityPopover, setShowSecurityPopover] = useState(false);
  const [showBrowserMenu, setShowBrowserMenu] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(() => audioEngine.getState().isPlaying);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setUrlInput(activeTab.url);
  }, [activeTab.url]);

  useEffect(() => {
    return audioEngine.subscribe((s) => setIsAudioPlaying(s.isPlaying));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    inputRef.current?.blur();
    setIsFocused(false);
    onNavigate(urlInput.trim());
  };

  const getCleanDisplayUrl = (raw: string) => {
    if (raw === 'nova://start') return 'nova://start (New Tab)';
    if (raw === 'nova://games') return 'nova://games (Web Games Hub)';
    if (raw === 'nova://music') return 'nova://music (Background Audio Radio)';
    if (raw === 'nova://passwords') return 'nova://passwords (Password & Login Vault)';
    if (raw === 'nova://devtools') return 'nova://devtools (Developer Console)';
    if (raw === 'nova://extensions') return 'nova://extensions (Add-On Store)';
    if (raw === 'nova://settings') return 'nova://settings (Browser Settings)';
    if (raw === 'nova://video') return 'nova://video (Video & PiP Player)';
    return raw;
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between gap-2 select-none relative z-30">
      {/* Zone 1: Navigation Controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onGoBack}
          disabled={!canGoBack}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition"
          title="Back (Alt+Left)"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onGoForward}
          disabled={!canGoForward}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition"
          title="Forward (Alt+Right)"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={onReload}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition ${
            activeTab.isLoading ? 'animate-spin text-indigo-400' : ''
          }`}
          title="Reload Page (Ctrl+R)"
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button
          onClick={onGoHome}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Home Page"
        >
          <Home className="w-4 h-4" />
        </button>
      </div>

      {/* Zone 2: Omnibox Address Input */}
      <div className="flex-1 max-w-3xl relative">
        <form
          onSubmit={handleSubmit}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs ${
            isFocused
              ? 'bg-slate-950 border-indigo-500 ring-1 ring-indigo-500 text-white shadow-lg'
              : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          {/* SSL / Protocol lock badge */}
          <button
            type="button"
            onClick={() => setShowSecurityPopover(!showSecurityPopover)}
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition shrink-0"
            title="View Site Information"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>

          {/* URL text input */}
          <input
            ref={inputRef}
            type="text"
            value={isFocused ? urlInput : getCleanDisplayUrl(urlInput)}
            onFocus={() => {
              setIsFocused(true);
              setUrlInput(activeTab.url);
            }}
            onBlur={() => {
              setTimeout(() => setIsFocused(false), 200);
            }}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Search or enter web address..."
            className="w-full bg-transparent border-none text-xs text-white focus:outline-none font-mono tracking-tight"
          />

          {/* Bookmark Star Icon */}
          <button
            type="button"
            onClick={onToggleBookmark}
            className={`p-0.5 transition shrink-0 ${
              isBookmarked ? 'text-amber-400 fill-amber-400' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Bookmark this tab"
          >
            <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </form>

        {/* Security / SSL Popover */}
        {showSecurityPopover && (
          <div className="absolute top-10 left-0 w-72 bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl z-50 text-xs text-slate-300 space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 font-semibold text-white">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Connection is secure</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Your information (passwords, messages, logins) is private when it is sent to this site.
            </p>
            <div className="pt-1 space-y-1 text-[10px] font-mono text-slate-400">
              <div>Certificate: Valid (TLS 1.3)</div>
              <div>Cookies & Cache: Encrypted local storage</div>
              <div>Password Manager: Auto-fill active</div>
            </div>
            <button
              onClick={() => setShowSecurityPopover(false)}
              className="w-full py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] mt-1"
            >
              Done
            </button>
          </div>
        )}

        {/* Omnibox Autocomplete Dropdown when typing */}
        {isFocused && (
          <div className="absolute top-10 left-0 right-0 bg-slate-900/98 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800 text-xs">
            <div
              onMouseDown={() => onNavigate('https://instagram.com')}
              className="p-2.5 hover:bg-slate-800 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2 text-white">
                <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600" />
                <span className="font-semibold">Instagram</span>
                <span className="text-slate-400 font-mono text-[11px]">https://instagram.com</span>
              </div>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono">
                Auto-Login Vault
              </span>
            </div>

            <div
              onMouseDown={() => onNavigate('nova://games')}
              className="p-2.5 hover:bg-slate-800 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2 text-white">
                <Gamepad2 className="w-4 h-4 text-purple-400" />
                <span className="font-semibold">Web Games Hub</span>
                <span className="text-slate-400 font-mono text-[11px]">2048, Snake, Dino, Space Invaders</span>
              </div>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono">
                Arcade
              </span>
            </div>

            <div
              onMouseDown={() => onNavigate('nova://music')}
              className="p-2.5 hover:bg-slate-800 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2 text-white">
                <Music className="w-4 h-4 text-amber-400" />
                <span className="font-semibold">Background Audio Radio</span>
                <span className="text-slate-400 font-mono text-[11px]">Lo-Fi, Synthwave, Ambient</span>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                Screen-Off Play
              </span>
            </div>

            <div
              onMouseDown={() => onNavigate('nova://passwords')}
              className="p-2.5 hover:bg-slate-800 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2 text-white">
                <Key className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold">Password & Login Vault</span>
                <span className="text-slate-400 font-mono text-[11px]">Manage saved app accounts & history</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Zone 3: Browser Toolbar Actions (Requested tools: Desktop, Fullscreen, Print, Dev, Extension, PiP, Music, Settings) */}
      <div className="flex items-center gap-1 shrink-0 text-slate-400">
        {/* Background Music quick button */}
        <button
          onClick={onToggleMusicWidget}
          className={`p-1.5 rounded-lg transition relative ${
            isMusicWidgetOpen || isAudioPlaying
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'hover:bg-slate-800 hover:text-white'
          }`}
          title="Background Music Player (Plays with screen off)"
        >
          <Music className="w-4 h-4" />
          {isAudioPlaying && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>

        {/* Picture-in-Picture quick toggle */}
        <button
          onClick={onTriggerPiP}
          className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
          title="Floating Picture-in-Picture Player"
        >
          <PictureInPicture2 className="w-4 h-4 text-sky-400" />
        </button>

        {/* Password Vault button */}
        <button
          onClick={onOpenPasswords}
          className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
          title="Passwords & App Login History"
        >
          <Key className="w-4 h-4 text-indigo-400" />
        </button>

        {/* Extensions add-on store */}
        <button
          onClick={onOpenExtensions}
          className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
          title="Extensions & Add-Ons"
        >
          <Puzzle className="w-4 h-4 text-purple-400" />
        </button>

        {/* Viewport: Desktop Mode Switcher */}
        <div className="relative group">
          <button
            onClick={() => {
              if (viewportMode === 'desktop-full') onChangeViewportMode('mobile-390');
              else if (viewportMode === 'mobile-390') onChangeViewportMode('desktop-1440');
              else onChangeViewportMode('desktop-full');
            }}
            className={`p-1.5 rounded-lg transition flex items-center gap-1 ${
              viewportMode.startsWith('desktop')
                ? 'bg-slate-800 text-white'
                : 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
            }`}
            title={`Toggle Mode: Currently ${viewportMode}`}
          >
            {viewportMode === 'mobile-390' ? (
              <Smartphone className="w-4 h-4" />
            ) : (
              <Laptop className="w-4 h-4" />
            )}
            <span className="text-[10px] font-medium hidden sm:inline">
              {viewportMode === 'mobile-390' ? 'Mobile' : 'Desktop'}
            </span>
          </button>
        </div>

        {/* Print button */}
        <button
          onClick={onOpenPrint}
          className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
          title="Print this tab (Ctrl+P)"
        >
          <Printer className="w-4 h-4" />
        </button>

        {/* Fullscreen button */}
        <button
          onClick={onToggleFullscreen}
          className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
          title={isFullscreen ? 'Exit Full Screen' : 'Full Screen Mode (F11)'}
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>

        {/* Dev Tools button */}
        <button
          onClick={onOpenDevTools}
          className={`p-1.5 rounded-lg transition ${
            isDevToolsOpen
              ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
              : 'hover:bg-slate-800 hover:text-white'
          }`}
          title="Developer Tools (Console, Elements, Network, Storage)"
        >
          <Terminal className="w-4 h-4" />
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
          title="Browser Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
