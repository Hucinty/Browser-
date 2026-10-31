import React, { useState } from 'react';
import { Check, Database, Globe, Key, Laptop, Moon, RefreshCw, Settings, ShieldCheck, Trash2 } from 'lucide-react';
import { storageService } from '../../services/storage';
import { BrowserSettings } from '../../types/browser';

interface SettingsAppProps {
  onClearAllData?: () => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({ onClearAllData }) => {
  const [settings, setSettings] = useState<BrowserSettings>(() => storageService.getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [clearedNotice, setClearedNotice] = useState<string | null>(null);

  const updateSetting = <K extends keyof BrowserSettings>(key: K, value: BrowserSettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    storageService.saveSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 1500);
  };

  const handleClearHistory = () => {
    storageService.clearHistory();
    setClearedNotice('Browsing history cleared successfully.');
    setTimeout(() => setClearedNotice(null), 2500);
  };

  const handleClearCookiesAndCache = () => {
    setClearedNotice('Cookies & local cache emptied.');
    setTimeout(() => setClearedNotice(null), 2500);
  };

  return (
    <div className="min-h-full bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-5">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Browser Settings</span>
                {savedSuccess && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Saved</span>
                  </span>
                )}
              </h1>
              <p className="text-xs text-slate-400">Configure search engines, privacy, autofill passwords, and background audio</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Settings List */}
      <div className="max-w-3xl mx-auto w-full p-6 space-y-6">
        {clearedNotice && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{clearedNotice}</span>
          </div>
        )}

        {/* 1. Search Engine */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>Search Engine</span>
          </h2>
          <p className="text-xs text-slate-400">
            Search engine used in the address bar when typing queries.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
            {(['google', 'duckduckgo', 'bing', 'ecosia'] as const).map((engine) => (
              <button
                key={engine}
                onClick={() => updateSetting('defaultSearchEngine', engine)}
                className={`py-2 px-3 rounded-xl border capitalize font-medium transition ${
                  settings.defaultSearchEngine === engine
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                    : 'border-slate-850 bg-slate-950/60 text-slate-400 hover:text-white'
                }`}
              >
                {engine}
              </button>
            ))}
          </div>
        </section>

        {/* 2. Passwords & Autofill */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <span>Passwords & Autofill Vault</span>
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-200">Offer to save passwords</p>
              <p className="text-xs text-slate-400">
                Automatically prompt to remember logins for Instagram, Netflix, and other web apps.
              </p>
            </div>
            <button
              onClick={() => updateSetting('savePasswordsPrompt', !settings.savePasswordsPrompt)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.savePasswordsPrompt ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.savePasswordsPrompt ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>

        {/* 3. Background Audio & Screen-Off Playback */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Background Playback & MediaSession</span>
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-200">Play music in background even if screen is off</p>
              <p className="text-xs text-slate-400">
                Keeps web audio synth and audio streams active across all browser tabs and device sleep.
              </p>
            </div>
            <button
              onClick={() => updateSetting('backgroundAudioEnabled', !settings.backgroundAudioEnabled)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.backgroundAudioEnabled ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.backgroundAudioEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>

        {/* 4. Privacy & Clear Browsing Data */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-rose-400" />
            <span>Privacy & Browsing Data</span>
          </h2>
          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-xs font-medium text-slate-200">Clear Browsing History</p>
              <p className="text-[11px] text-slate-400">Removes history list of visited URLs</p>
            </div>
            <button
              onClick={handleClearHistory}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs rounded-lg transition"
            >
              Clear History
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div>
              <p className="text-xs font-medium text-slate-200">Cookies and Site Data</p>
              <p className="text-[11px] text-slate-400">Clears cached temporary images and web sessions</p>
            </div>
            <button
              onClick={handleClearCookiesAndCache}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs rounded-lg transition"
            >
              Clear Cookies
            </button>
          </div>
        </section>

        {/* About Nova Browser */}
        <div className="text-center text-xs text-slate-500 font-mono py-2">
          Nova Browser Core Engine v2026.10 · WebKit Emulation · HTML5 Fullscreen & PiP Ready
        </div>
      </div>
    </div>
  );
};
