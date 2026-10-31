import React, { useState } from 'react';
import { Check, Eye, EyeOff, Key, ShieldCheck, X } from 'lucide-react';
import { SavedLogin } from '../../types/browser';

interface SavePasswordPromptProps {
  isOpen: boolean;
  onClose: () => void;
  pendingLogin: {
    website: string;
    domain: string;
    username: string;
    password: string;
    category?: SavedLogin['category'];
  } | null;
  onSave: (login: { website: string; domain: string; username: string; password: string; category?: SavedLogin['category'] }) => void;
}

export const SavePasswordPrompt: React.FC<SavePasswordPromptProps> = ({
  isOpen,
  onClose,
  pendingLogin,
  onSave,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState(pendingLogin?.username || '');
  const [password, setPassword] = useState(pendingLogin?.password || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state when pendingLogin changes
  React.useEffect(() => {
    if (pendingLogin) {
      setUsername(pendingLogin.username);
      setPassword(pendingLogin.password);
      setSavedSuccess(false);
    }
  }, [pendingLogin]);

  if (!isOpen || !pendingLogin) return null;

  const handleSave = () => {
    onSave({
      website: pendingLogin.website,
      domain: pendingLogin.domain,
      username,
      password,
      category: pendingLogin.category || 'social',
    });
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="absolute top-12 right-12 z-50 w-96 bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl backdrop-blur-xl p-4 text-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">
              Save password in browser?
            </h4>
            <p className="text-xs text-slate-400">
              Nova Vault will remember you on <span className="font-mono text-indigo-300">{pendingLogin.domain}</span>
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {savedSuccess ? (
        <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2.5 text-emerald-400 text-xs">
          <Check className="w-4 h-4" />
          <span>Login credentials saved to Nova Vault! Auto-fill is active.</span>
        </div>
      ) : (
        <div className="mt-3.5 space-y-2.5 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Username / Account</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-1.5 pr-8 bg-slate-950 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Stored in encrypted local browser storage</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition font-medium"
            >
              Never
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium shadow-sm transition flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Login</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
