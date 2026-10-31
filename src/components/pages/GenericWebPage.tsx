import React, { useState } from 'react';
import { BookOpen, ExternalLink, Globe, Key, Lock, Search, ShieldCheck } from 'lucide-react';
import { SavedLogin } from '../../types/browser';

interface GenericWebPageProps {
  url: string;
  onNavigate: (url: string) => void;
  onTriggerSavePassword: (login: { website: string; domain: string; username: string; password: string; category?: SavedLogin['category'] }) => void;
}

export const GenericWebPage: React.FC<GenericWebPageProps> = ({ url, onNavigate, onTriggerSavePassword }) => {
  const [readerMode, setReaderMode] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Determine if URL is a search query or a specific website
  const isSearch = !url.includes('.') || url.startsWith('search:') || url.startsWith('https://google.com/search');
  const cleanDomain = url.replace(/^https?:\/\//, '').split('/')[0];

  const handleSimulatedLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUser || !loginPass) return;
    setIsLoggedIn(true);
    onTriggerSavePassword({
      website: cleanDomain,
      domain: cleanDomain,
      username: loginUser,
      password: loginPass,
      category: 'other',
    });
  };

  if (isSearch) {
    const searchTerm = url.replace(/^search:\s*/, '').replace(/^https?:\/\/google\.com\/search\?q=/, '');
    return (
      <div className="min-h-full bg-slate-950 text-slate-100 p-6 max-w-4xl mx-auto space-y-6">
        {/* Search header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
            G
          </div>
          <span className="text-sm font-semibold text-white">Nova Search Results for "{searchTerm}"</span>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-mono">https://en.wikipedia.org/wiki/{encodeURIComponent(searchTerm)}</span>
            <h3
              onClick={() => onNavigate(`https://en.wikipedia.org/wiki/${encodeURIComponent(searchTerm)}`)}
              className="text-base font-bold text-indigo-400 hover:underline cursor-pointer"
            >
              {searchTerm} - Complete Encyclopedia Article & History
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Explore exhaustive technical background, timeline developments, modern applications, and collaborative references regarding {searchTerm}.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-mono">https://github.com/topics/{encodeURIComponent(searchTerm)}</span>
            <h3
              onClick={() => onNavigate(`https://github.com/topics/${encodeURIComponent(searchTerm)}`)}
              className="text-base font-bold text-indigo-400 hover:underline cursor-pointer"
            >
              GitHub - Open Source Projects & Repositories for {searchTerm}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Discover top-starred repositories, tutorials, starter boilerplates, and developer libraries built with {searchTerm}.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-mono">https://instagram.com/explore/tags/{encodeURIComponent(searchTerm)}</span>
            <h3
              onClick={() => onNavigate('https://instagram.com')}
              className="text-base font-bold text-pink-400 hover:underline cursor-pointer flex items-center gap-1.5"
            >
              <span>Instagram Community Photos & Visual Stories</span>
              <span className="text-[10px] bg-pink-500/20 text-pink-300 px-1.5 py-0.5 rounded font-mono">Remembered in Vault</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Browse top trending photography, creators, and reels tagged with {searchTerm} on Instagram.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Simulated Web Site View (e.g. Wikipedia, TechCrunch, Custom URL)
  return (
    <div className="min-h-full bg-slate-950 text-slate-100 flex flex-col">
      {/* Site Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white">{cleanDomain}</span>
          <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded">
            TLS 1.3 Verified
          </span>
        </div>

        <button
          onClick={() => setReaderMode(!readerMode)}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
            readerMode ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{readerMode ? 'Normal View' : 'Reader Mode'}</span>
        </button>
      </div>

      {/* Main Content */}
      <div className={`p-6 max-w-4xl mx-auto w-full flex-1 space-y-6 ${readerMode ? 'font-serif text-slate-200' : ''}`}>
        <article className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome to {cleanDomain}
          </h1>
          <p className="text-xs text-slate-400 font-mono">Published in Nova Web Browser · Verified SSL Certificate</p>

          <p className="text-sm text-slate-300 leading-relaxed">
            You are browsing {cleanDomain} inside Nova Browser. All active tabs support Desktop Mode, Fullscreen Mode, Picture-in-Picture background video playback, and persistent login remembering.
          </p>

          <p className="text-sm text-slate-300 leading-relaxed">
            Nova Browser isolates tabs into distinct execution spaces while allowing seamless background audio streaming through the Web Audio API and MediaSession API.
          </p>
        </article>

        {/* Generic App Login Box to test remember login for ANY site! */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-md shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-indigo-400">
            <Key className="w-4 h-4" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {cleanDomain} Account Login
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Test Nova Browser's login saving on this site.
          </p>

          {isLoggedIn ? (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
              <span>Logged in as <strong>{loginUser}</strong> (Saved in Nova Vault)</span>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="text-[11px] underline text-slate-400 hover:text-white ml-2"
              >
                Log Out
              </button>
            </div>
          ) : (
            <form onSubmit={handleSimulatedLogin} className="space-y-2 text-xs">
              <input
                type="text"
                placeholder="Username / Email"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 font-mono"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition"
              >
                Sign In to {cleanDomain}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
