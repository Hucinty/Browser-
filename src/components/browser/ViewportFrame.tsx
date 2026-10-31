import React from 'react';
import { ViewportMode } from '../../types/browser';

interface ViewportFrameProps {
  mode: ViewportMode;
  children: React.ReactNode;
}

export const ViewportFrame: React.FC<ViewportFrameProps> = ({ mode, children }) => {
  if (mode === 'desktop-full') {
    return <div className="w-full h-full overflow-auto bg-slate-950 flex flex-col">{children}</div>;
  }

  if (mode === 'desktop-1440') {
    return (
      <div className="w-full h-full overflow-auto bg-slate-900/60 p-4 flex justify-center">
        <div className="w-full max-w-[1440px] h-full bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-auto flex flex-col">
          {children}
        </div>
      </div>
    );
  }

  if (mode === 'tablet-768') {
    return (
      <div className="w-full h-full overflow-auto bg-slate-900/60 p-4 flex justify-center">
        <div className="w-[768px] h-full bg-slate-950 border-4 border-slate-800 rounded-2xl shadow-2xl overflow-auto flex flex-col">
          {children}
        </div>
      </div>
    );
  }

  // Mobile 390px
  return (
    <div className="w-full h-full overflow-auto bg-slate-900/80 p-4 flex justify-center items-center">
      <div className="w-[390px] h-[820px] max-h-full bg-slate-950 border-8 border-slate-800 rounded-[44px] shadow-2xl overflow-hidden flex flex-col relative ring-1 ring-slate-700">
        {/* Dynamic Island / Notch */}
        <div className="w-full h-7 bg-slate-950 flex items-center justify-between px-7 shrink-0 select-none z-40">
          <span className="text-[10px] text-white font-mono font-medium">9:41</span>
          <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-black/60 mr-2" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-white font-mono">5G</span>
            <span className="w-4 h-2 rounded-sm border border-white/60 p-0.5 flex">
              <span className="w-full h-full bg-white rounded-2xs" />
            </span>
          </div>
        </div>

        {/* Mobile Viewport Content */}
        <div className="flex-1 overflow-auto bg-slate-950 flex flex-col">
          {children}
        </div>

        {/* Mobile Bottom Home Bar */}
        <div className="w-full h-5 bg-slate-950 flex items-center justify-center shrink-0">
          <div className="w-28 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
