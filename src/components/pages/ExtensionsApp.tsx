import React, { useState } from 'react';
import { BookOpen, Check, Key, Moon, Music, Plus, Puzzle, Shield, Sparkles, Trash2 } from 'lucide-react';
import { storageService } from '../../services/storage';
import { BrowserExtension } from '../../types/browser';

export const ExtensionsApp: React.FC = () => {
  const [extensions, setExtensions] = useState<BrowserExtension[]>(() => storageService.getExtensions());
  const [showAddModal, setShowAddModal] = useState(false);
  const [extName, setExtName] = useState('');
  const [extDesc, setExtDesc] = useState('');

  const toggleExtension = (id: string) => {
    const updated = extensions.map((ext) => (ext.id === id ? { ...ext, enabled: !ext.enabled } : ext));
    setExtensions(updated);
    storageService.saveExtensions(updated);
  };

  const handleCreateExtension = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extName.trim()) return;

    const newExt: BrowserExtension = {
      id: 'ext-' + Date.now(),
      name: extName.trim(),
      description: extDesc.trim() || 'Custom user extension script active on all pages.',
      version: '1.0.0',
      icon: 'Puzzle',
      enabled: true,
      author: 'You (Local User)',
      isCustom: true,
    };

    const updated = [...extensions, newExt];
    setExtensions(updated);
    storageService.saveExtensions(updated);
    setShowAddModal(false);
    setExtName('');
    setExtDesc('');
  };

  const deleteExtension = (id: string) => {
    const updated = extensions.filter((ext) => ext.id !== id);
    setExtensions(updated);
    storageService.saveExtensions(updated);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield':
        return <Shield className="w-5 h-5 text-emerald-400" />;
      case 'Moon':
        return <Moon className="w-5 h-5 text-indigo-400" />;
      case 'Key':
        return <Key className="w-5 h-5 text-amber-400" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-cyan-400" />;
      case 'Music':
        return <Music className="w-5 h-5 text-pink-400" />;
      default:
        return <Puzzle className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="min-h-full bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
              <Puzzle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Nova Extension & Add-On Store</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono">
                  Active
                </span>
              </h1>
              <p className="text-xs text-slate-400">Manage browser extensions, privacy shields, ad blockers, and custom add-ons</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Extension</span>
          </button>
        </div>
      </div>

      {/* Extensions Grid */}
      <div className="max-w-4xl mx-auto w-full p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {extensions.map((ext) => (
            <div
              key={ext.id}
              className={`bg-slate-900 border rounded-2xl p-4 shadow-lg transition flex flex-col justify-between ${
                ext.enabled ? 'border-slate-800 hover:border-slate-700' : 'border-slate-850 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700">
                      {getIcon(ext.icon)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{ext.name}</h3>
                        <span className="text-[10px] text-slate-500 font-mono">v{ext.version}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">By {ext.author}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {ext.isCustom && (
                      <button
                        onClick={() => deleteExtension(ext.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 rounded"
                        title="Remove extension"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {/* Toggle switch */}
                    <button
                      type="button"
                      onClick={() => toggleExtension(ext.id)}
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                        ext.enabled ? 'bg-indigo-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          ext.enabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">{ext.description}</p>
              </div>

              {ext.badge && (
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{ext.badge}</span>
                  </span>
                  <span className="text-slate-500">Active on all tabs</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Extension Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Create Custom Add-On / User Script</span>
            </h3>
            <form onSubmit={handleCreateExtension} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Add-on Name</label>
                <input
                  type="text"
                  placeholder="e.g. YouTube Enhancer, Reddit Dark Mode"
                  value={extName}
                  onChange={(e) => setExtName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="What does this extension do?"
                  value={extDesc}
                  onChange={(e) => setExtDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
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
                  Install Add-On
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
