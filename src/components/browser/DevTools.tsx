import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, ChevronRight, Database, Globe, Play, Sparkles, Terminal, Trash2, X } from 'lucide-react';
import { ConsoleLogMessage, NetworkRequest, Tab } from '../../types/browser';

interface DevToolsProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: Tab;
}

export const DevTools: React.FC<DevToolsProps> = ({ isOpen, onClose, activeTab }) => {
  const [activeSubTab, setActiveSubTab] = useState<'console' | 'elements' | 'network' | 'storage' | 'lighthouse'>('console');
  const [consoleInput, setConsoleInput] = useState('');
  const [logs, setLogs] = useState<ConsoleLogMessage[]>([
    { id: '1', type: 'info', content: 'Nova DevTools v2026.1 initialized.', timestamp: Date.now() - 5000 },
    { id: '2', type: 'log', content: `Navigated to ${activeTab.url}`, timestamp: Date.now() - 2000 },
    { id: '3', type: 'info', content: 'SSL TLS 1.3 handshake verified. Background audio worker registered.', timestamp: Date.now() - 1500 },
  ]);

  const [networkRequests, setNetworkRequests] = useState<NetworkRequest[]>([
    { id: 'req-1', url: activeTab.url, method: 'GET', status: 200, statusText: 'OK', type: 'document', size: '24.2 KB', timeMs: 42, timestamp: Date.now() - 2000 },
    { id: 'req-2', url: '/src/main.tsx', method: 'GET', status: 200, statusText: 'OK', type: 'script', size: '1.4 KB', timeMs: 14, timestamp: Date.now() - 1950 },
    { id: 'req-3', url: '/src/index.css', method: 'GET', status: 200, statusText: 'OK', type: 'stylesheet', size: '8.8 KB', timeMs: 19, timestamp: Date.now() - 1920 },
    { id: 'req-4', url: 'https://fonts.googleapis.com/css2', method: 'GET', status: 200, statusText: 'OK', type: 'stylesheet', size: '3.1 KB', timeMs: 38, timestamp: Date.now() - 1800 },
    { id: 'req-5', url: '/api/v1/session/verify', method: 'POST', status: 200, statusText: 'OK', type: 'fetch', size: '412 B', timeMs: 28, timestamp: Date.now() - 1500 },
  ]);

  const consoleEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeSubTab === 'console') {
      consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, activeSubTab]);

  // Update logs when active tab changes
  useEffect(() => {
    setLogs((prev) => [
      ...prev,
      {
        id: 'log-' + Date.now(),
        type: 'log',
        content: `[Nav] Active tab context switched to: ${activeTab.url}`,
        timestamp: Date.now(),
      },
    ]);
  }, [activeTab.url]);

  if (!isOpen) return null;

  const handleExecuteConsole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleInput.trim()) return;

    const input = consoleInput.trim();
    setConsoleInput('');

    // Add user input to logs
    const newLogs: ConsoleLogMessage[] = [
      ...logs,
      { id: 'cmd-' + Date.now(), type: 'log', content: `> ${input}`, timestamp: Date.now() },
    ];

    try {
      // Safe evaluation
      let result: unknown;
      if (input === 'clear' || input === 'clear()') {
        setLogs([]);
        return;
      } else if (input.startsWith('localStorage')) {
        result = JSON.stringify(Object.keys(localStorage), null, 2);
      } else if (input === 'window.location.href' || input === 'location.href') {
        result = activeTab.url;
      } else if (input === 'document.title') {
        result = activeTab.title;
      } else {
        // eslint-disable-next-line no-eval
        result = eval(input);
      }

      newLogs.push({
        id: 'res-' + Date.now(),
        type: 'info',
        content: typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result),
        timestamp: Date.now(),
      });
    } catch (err: unknown) {
      newLogs.push({
        id: 'err-' + Date.now(),
        type: 'error',
        content: `Uncaught ${(err as Error).name || 'Error'}: ${(err as Error).message || String(err)}`,
        timestamp: Date.now(),
      });
    }

    setLogs(newLogs);
  };

  return (
    <div className="h-72 bg-slate-950 border-t border-slate-700/80 flex flex-col font-mono text-xs text-slate-300 z-40 select-text">
      {/* DevTools Top Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 select-none">
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-bold text-slate-400 mr-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>DevTools</span>
          </span>

          <button
            onClick={() => setActiveSubTab('elements')}
            className={`px-2.5 py-1 rounded transition text-[11px] ${
              activeSubTab === 'elements' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Elements
          </button>
          <button
            onClick={() => setActiveSubTab('console')}
            className={`px-2.5 py-1 rounded transition text-[11px] flex items-center gap-1.5 ${
              activeSubTab === 'console' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Console</span>
            <span className="text-[10px] bg-slate-700 px-1 rounded-full text-slate-300 tabular-nums">
              {logs.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSubTab('network')}
            className={`px-2.5 py-1 rounded transition text-[11px] flex items-center gap-1.5 ${
              activeSubTab === 'network' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Network</span>
            <span className="text-[10px] bg-slate-700 px-1 rounded-full text-slate-300 tabular-nums">
              {networkRequests.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSubTab('storage')}
            className={`px-2.5 py-1 rounded transition text-[11px] ${
              activeSubTab === 'storage' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Application / Storage
          </button>
          <button
            onClick={() => setActiveSubTab('lighthouse')}
            className={`px-2.5 py-1 rounded transition text-[11px] flex items-center gap-1 ${
              activeSubTab === 'lighthouse' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Audit</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'console' && (
            <button
              onClick={() => setLogs([])}
              title="Clear Console"
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DevTools Body Content */}
      <div className="flex-1 overflow-auto p-3">
        {/* CONSOLE TAB */}
        {activeSubTab === 'console' && (
          <div className="flex flex-col h-full justify-between">
            <div className="space-y-1.5 overflow-y-auto pr-1 flex-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`flex items-start gap-2 py-0.5 leading-relaxed font-mono ${
                    log.type === 'error'
                      ? 'text-rose-400 bg-rose-950/20 px-1.5 rounded'
                      : log.type === 'warn'
                      ? 'text-amber-300 bg-amber-950/20 px-1.5 rounded'
                      : log.type === 'info'
                      ? 'text-cyan-300'
                      : 'text-slate-300'
                  }`}
                >
                  <span className="text-slate-600 select-none text-[10px] pt-0.5 tabular-nums">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <pre className="whitespace-pre-wrap break-all flex-1 font-mono">{log.content}</pre>
                </div>
              ))}
              <div ref={consoleEndRef} />
            </div>

            {/* Prompt input */}
            <form onSubmit={handleExecuteConsole} className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <input
                type="text"
                value={consoleInput}
                onChange={(e) => setConsoleInput(e.target.value)}
                placeholder="Type JavaScript expression (e.g. 2 + 2, localStorage, document.title)..."
                className="w-full bg-transparent border-none text-slate-100 placeholder-slate-600 focus:outline-none font-mono text-xs"
              />
              <button
                type="submit"
                className="px-2 py-0.5 bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50 rounded flex items-center gap-1 text-[11px]"
              >
                <Play className="w-2.5 h-2.5" />
                <span>Run</span>
              </button>
            </form>
          </div>
        )}

        {/* ELEMENTS TAB */}
        {activeSubTab === 'elements' && (
          <div className="grid grid-cols-3 gap-4 h-full">
            <div className="col-span-2 space-y-1 overflow-y-auto text-slate-300 font-mono text-[11px]">
              <div className="text-slate-500">&lt;!DOCTYPE html&gt;</div>
              <div className="text-amber-300">&lt;<span className="text-cyan-400">html</span> <span className="text-purple-400">lang</span>=<span className="text-emerald-300">"en"</span> <span className="text-purple-400">class</span>=<span className="text-emerald-300">"dark"</span>&gt;</div>
              <div className="pl-4 text-amber-300">&lt;<span className="text-cyan-400">head</span>&gt; ... &lt;/<span className="text-cyan-400">head</span>&gt;</div>
              <div className="pl-4 text-amber-300">&lt;<span className="text-cyan-400">body</span> <span className="text-purple-400">class</span>=<span className="text-emerald-300">"bg-slate-950 font-sans"</span>&gt;</div>
              <div className="pl-8 text-amber-300">
                &lt;<span className="text-cyan-400">div</span> <span className="text-purple-400">id</span>=<span className="text-emerald-300">"root"</span>&gt;
              </div>
              <div className="pl-12 text-amber-300">
                &lt;<span className="text-cyan-400">div</span> <span className="text-purple-400">class</span>=<span className="text-emerald-300">"browser-viewport flex-1"</span> <span className="text-purple-400">data-tab-url</span>=<span className="text-emerald-300">"{activeTab.url}"</span>&gt;
              </div>
              <div className="pl-16 text-slate-400 italic">
                &lt;!-- Active View Component: {activeTab.title} --&gt;
              </div>
              <div className="pl-16 text-amber-300">
                &lt;<span className="text-cyan-400">main</span> <span className="text-purple-400">id</span>=<span className="text-emerald-300">"page-content"</span>&gt;
                <span className="text-slate-300"> ... [Active DOM Node] ... </span>
                &lt;/<span className="text-cyan-400">main</span>&gt;
              </div>
              <div className="pl-12 text-amber-300">&lt;/<span className="text-cyan-400">div</span>&gt;</div>
              <div className="pl-8 text-amber-300">&lt;/<span className="text-cyan-400">div</span>&gt;</div>
              <div className="pl-4 text-amber-300">&lt;/<span className="text-cyan-400">body</span>&gt;</div>
              <div className="text-amber-300">&lt;/<span className="text-cyan-400">html</span>&gt;</div>
            </div>

            {/* Computed Styles / Box model */}
            <div className="border-l border-slate-800 pl-4 space-y-3">
              <h5 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Box Model & Computed Styles
              </h5>
              <div className="border border-indigo-500/40 bg-indigo-950/20 p-2 text-center rounded">
                <span className="text-[10px] text-indigo-400 block">margin: 0px</span>
                <div className="border border-amber-500/40 bg-amber-950/20 p-2 rounded mt-1">
                  <span className="text-[10px] text-amber-400 block">border: 1px solid</span>
                  <div className="border border-emerald-500/40 bg-emerald-950/20 p-2 rounded mt-1">
                    <span className="text-[10px] text-emerald-400 block">padding: 16px</span>
                    <div className="bg-slate-800 p-1.5 rounded mt-1 text-[10px] text-slate-300">
                      100% × 100%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NETWORK TAB */}
        {activeSubTab === 'network' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-[11px]">
                  <th className="pb-1.5 font-medium">Name</th>
                  <th className="pb-1.5 font-medium">Status</th>
                  <th className="pb-1.5 font-medium">Type</th>
                  <th className="pb-1.5 font-medium">Size</th>
                  <th className="pb-1.5 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {networkRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-900/50 text-[11px]">
                    <td className="py-1 text-indigo-300 truncate max-w-xs">{req.url}</td>
                    <td className="py-1">
                      <span className="text-emerald-400 font-medium">{req.status} {req.statusText}</span>
                    </td>
                    <td className="py-1 text-slate-400">{req.type}</td>
                    <td className="py-1 text-slate-400 tabular-nums">{req.size}</td>
                    <td className="py-1 text-slate-400 tabular-nums">{req.timeMs}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* STORAGE TAB */}
        {activeSubTab === 'storage' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>LocalStorage & Browser Cookies</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {Object.keys(localStorage).map((k) => (
                <div key={k} className="p-2 bg-slate-900 border border-slate-800 rounded">
                  <div className="text-indigo-400 font-bold truncate">{k}</div>
                  <div className="text-slate-500 truncate text-[10px] mt-0.5">
                    {localStorage.getItem(k)?.substring(0, 80)}...
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LIGHTHOUSE AUDIT */}
        {activeSubTab === 'lighthouse' && (
          <div className="flex items-center justify-around h-full py-4">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full border-4 border-emerald-500 flex items-center justify-center text-emerald-400 font-bold text-sm mx-auto">
                100
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Performance</span>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full border-4 border-emerald-500 flex items-center justify-center text-emerald-400 font-bold text-sm mx-auto">
                98
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Accessibility</span>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full border-4 border-emerald-500 flex items-center justify-center text-emerald-400 font-bold text-sm mx-auto">
                100
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Best Practices</span>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full border-4 border-emerald-500 flex items-center justify-center text-emerald-400 font-bold text-sm mx-auto">
                100
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">SEO</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
