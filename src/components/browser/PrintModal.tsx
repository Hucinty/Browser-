import React, { useState } from 'react';
import { Check, Printer, X } from 'lucide-react';
import { Tab } from '../../types/browser';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: Tab;
}

export const PrintModal: React.FC<PrintModalProps> = ({ isOpen, onClose, activeTab }) => {
  const [destination, setDestination] = useState<'pdf' | 'system'>('pdf');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [pages, setPages] = useState<'all' | 'custom'>('all');
  const [isPrinting, setIsPrinting] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      window.print();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]">
        {/* Print Preview Canvas */}
        <div className="flex-1 bg-slate-950 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800 overflow-y-auto">
          <span className="text-xs text-slate-400 mb-3 font-mono">Print Preview (Page 1 of 1)</span>
          <div
            className={`bg-white text-slate-900 shadow-2xl p-6 rounded transition-all duration-300 overflow-hidden flex flex-col justify-between ${
              orientation === 'portrait' ? 'w-64 h-90' : 'w-90 h-64'
            }`}
          >
            <div>
              <div className="flex items-center justify-between border-b pb-2 mb-3 text-[10px] text-slate-500 font-mono">
                <span>{activeTab.title}</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <h2 className="text-base font-bold text-slate-900">{activeTab.title}</h2>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{activeTab.url}</p>

              <div className="mt-4 space-y-2">
                <div className="h-2 bg-slate-200 rounded w-3/4" />
                <div className="h-2 bg-slate-200 rounded w-full" />
                <div className="h-2 bg-slate-200 rounded w-5/6" />
                <div className="h-2 bg-slate-200 rounded w-2/3" />
                <div className="mt-4 p-2 bg-slate-100 rounded text-[9px] text-slate-600 font-mono">
                  [Nova Web Browser - Verified Printable Document]
                </div>
              </div>
            </div>

            <div className="text-[9px] text-slate-400 border-t pt-1 flex justify-between font-mono">
              <span>https://nova-browser.internal</span>
              <span>1/1</span>
            </div>
          </div>
        </div>

        {/* Print Settings Sidebar */}
        <div className="w-full md:w-80 p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">Print Options</h3>
              </div>
              <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Destination</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value as 'pdf' | 'system')}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="pdf">Save as PDF</option>
                  <option value="system">System Default Printer</option>
                  <option value="office">Office LaserJet Pro</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Pages</label>
                <select
                  value={pages}
                  onChange={(e) => setPages(e.target.value as 'all' | 'custom')}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All Pages (1)</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Layout Orientation</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrientation('portrait')}
                    className={`py-2 px-3 rounded-lg border text-center transition ${
                      orientation === 'portrait'
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300 font-medium'
                        : 'border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Portrait
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrientation('landscape')}
                    className={`py-2 px-3 rounded-lg border text-center transition ${
                      orientation === 'landscape'
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300 font-medium'
                        : 'border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Landscape
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input type="checkbox" defaultChecked className="rounded accent-indigo-500" />
                  <span>Print background graphics</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 mt-2">
                  <input type="checkbox" defaultChecked className="rounded accent-indigo-500" />
                  <span>Headers & footers</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium shadow-lg transition flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>{isPrinting ? 'Preparing Document...' : 'Print Page'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
