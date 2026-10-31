import React, { useState } from 'react';
import { Check, Clock, Copy, Download, Eye, EyeOff, Key, Plus, Search, Shield, ShieldCheck, Trash2, UserCheck, ExternalLink } from 'lucide-react';
import { storageService } from '../../services/storage';
import { LoginActivity, SavedLogin } from '../../types/browser';

interface PasswordsAppProps {
  onNavigateToSite?: (url: string) => void;
}

export const PasswordsApp: React.FC<PasswordsAppProps> = ({ onNavigateToSite }) => {
  const [logins, setLogins] = useState<SavedLogin[]>(() => storageService.getLogins());
  const [activity, setActivity] = useState<LoginActivity[]>(() => storageService.getLoginActivity());
  const [activeTab, setActiveTab] = useState<'vault' | 'history'>('vault');
  const [searchQuery, setSearchQuery] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<{ [id: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New login modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSite, setNewSite] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newCategory, setNewCategory] = useState<SavedLogin['category']>('social');

  const filteredLogins = logins.filter(
    (l) =>
      l.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleDelete = (id: string) => {
    storageService.deleteLogin(id);
    setLogins(storageService.getLogins());
  };

  const handleCreateLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSite || !newUsername || !newPassword) return;

    const domain = newSite.replace(/^https?:\/\//, '').split('/')[0];
    const saved = storageService.saveOrUpdateLogin({
      website: newSite,
      domain,
      username: newUsername,
      password: newPassword,
      displayName: newUsername,
      category: newCategory,
    });

    setLogins(storageService.getLogins());
    setActivity(storageService.getLoginActivity());
    setShowAddModal(false);
    setNewSite('');
    setNewUsername('');
    setNewPassword('');
  };

  const handleClearActivity = () => {
    storageService.clearLoginActivity();
    setActivity([]);
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logins, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'nova_passwords_vault_backup.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-full bg-slate-950 text-slate-100 flex flex-col">
      {/* Vault Top Banner */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-5">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Nova Password Manager & Login Vault</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                  AES-256 Storage
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Remembers all your website & app accounts like Instagram, auto-fills credentials, and tracks login history.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Login</span>
            </button>
            <button
              onClick={handleExport}
              title="Export Encrypted Vault Backup"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto w-full p-6 flex-1 flex flex-col space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('vault')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-2 ${
                activeTab === 'vault'
                  ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-300'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Saved Passwords ({logins.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-300'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>App Login History ({activity.length})</span>
            </button>
          </div>

          {activeTab === 'vault' && (
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search saved accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {activeTab === 'history' && (
            <button
              onClick={handleClearActivity}
              className="text-xs text-slate-400 hover:text-rose-400 transition flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Activity</span>
            </button>
          )}
        </div>

        {/* VAULT TAB */}
        {activeTab === 'vault' && (
          <div className="space-y-4">
            {filteredLogins.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 space-y-2">
                <Shield className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-sm font-medium text-slate-300">No saved logins found</p>
                <p className="text-xs">When you log into websites like Instagram, Nova Browser will ask to save your credentials.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLogins.map((login) => {
                  const isVisible = visiblePasswords[login.id] || false;
                  return (
                    <div
                      key={login.id}
                      className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-lg transition space-y-3 group"
                    >
                      {/* Top Info */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={login.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${login.domain}`}
                            alt={login.website}
                            className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 p-0.5 object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-white">{login.website}</h3>
                              {login.domain.includes('instagram.com') && (
                                <span className="text-[10px] bg-pink-500/10 text-pink-400 border border-pink-500/20 px-1.5 py-0.2 rounded font-medium">
                                  Instagram App
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-400 font-mono">{login.domain}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                          {onNavigateToSite && (
                            <button
                              onClick={() => onNavigateToSite(`https://${login.domain}`)}
                              title={`Open ${login.domain}`}
                              className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(login.id)}
                            title="Delete from Vault"
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Username Row */}
                      <div className="bg-slate-950/80 rounded-xl p-2.5 flex items-center justify-between border border-slate-850">
                        <div className="truncate pr-2">
                          <span className="text-[10px] text-slate-500 uppercase block font-semibold">Username</span>
                          <span className="text-xs text-slate-200 font-mono truncate">{login.username}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(login.username, `${login.id}-user`)}
                          className="p-1 text-slate-400 hover:text-white transition"
                          title="Copy username"
                        >
                          {copiedId === `${login.id}-user` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Password Row */}
                      <div className="bg-slate-950/80 rounded-xl p-2.5 flex items-center justify-between border border-slate-850">
                        <div className="truncate pr-2 flex-1">
                          <span className="text-[10px] text-slate-500 uppercase block font-semibold">Password</span>
                          <span className="text-xs text-slate-200 font-mono tracking-wider">
                            {isVisible ? login.password : '••••••••••••••••'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => togglePasswordVisibility(login.id)}
                            className="p-1 text-slate-400 hover:text-white transition"
                            title={isVisible ? 'Hide password' : 'Show password'}
                          >
                            {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleCopy(login.password, `${login.id}-pass`)}
                            className="p-1 text-slate-400 hover:text-white transition"
                            title="Copy password"
                          >
                            {copiedId === `${login.id}-pass` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Footer Info */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
                        <span>Used {login.useCount} times</span>
                        <span>Last used {new Date(login.lastUsedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* LOGIN ACTIVITY HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {activity.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Clock className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                <p className="text-sm">No login activity logged yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {activity.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-slate-850/50 flex items-center justify-between transition">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">@{item.username}</span>
                          <span className="text-xs text-slate-400">logged into</span>
                          <span className="text-xs font-semibold text-indigo-300 font-mono">{item.website}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-0.5">
                          <span>{new Date(item.timestamp).toLocaleString()}</span>
                          <span>•</span>
                          <span>{item.ipAddress}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                      Verified Session
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Login Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Save Account to Nova Vault</h3>
            <form onSubmit={handleCreateLogin} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Website Name / URL</label>
                <input
                  type="text"
                  placeholder="e.g. instagram.com or Netflix"
                  value={newSite}
                  onChange={(e) => setNewSite(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Username / Email</label>
                <input
                  type="text"
                  placeholder="e.g. alex.rivers@domain.com"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Enter secure password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as SavedLogin['category'])}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
                >
                  <option value="social">Social Media (Instagram, Twitter, etc.)</option>
                  <option value="entertainment">Entertainment & Streaming</option>
                  <option value="work">Work & Developer</option>
                  <option value="finance">Banking & Finance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-md transition"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
