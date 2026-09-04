import React from 'react';
import {
  CheckCircle2,
  Bookmark,
  Sparkles,
  Calculator,
  BookOpen,
  ArrowUpRight
} from 'lucide-react';

interface Props {
  activeView: 'home-reno' | 'all-calculators' | 'seo-articles' | 'other-calc';
  onSelectView: (view: 'home-reno' | 'all-calculators' | 'seo-articles' | 'other-calc') => void;
  savedCount: number;
  onOpenSavedDrawer: () => void;
  onRequestBids: () => void;
}

export const Header: React.FC<Props> = ({
  activeView,
  onSelectView,
  savedCount,
  onOpenSavedDrawer,
  onRequestBids,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div
            onClick={() => onSelectView('home-reno')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-md group-hover:bg-blue-700 transition">
              <span className="text-xl font-black">C</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-300 -ml-1 mt-1 stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-slate-950 tracking-tighter">
                  CostToFinish<span className="text-blue-600">.com</span>
                </span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 tracking-wider uppercase hidden sm:inline-block border border-emerald-200">
                  Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-bold tracking-tight hidden sm:block">
                The Google of Project Completion
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2.5">
            <button
              onClick={() => onSelectView('home-reno')}
              className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-black tracking-tight transition flex items-center gap-1.5 ${
                activeView === 'home-reno'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-800 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <span>Real Estate & Home</span>
              <span
                className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-black ${
                  activeView === 'home-reno' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                }`}
              >
                3 Engines
              </span>
            </button>
            <button
              onClick={() => onSelectView('all-calculators')}
              className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-extrabold tracking-tight transition ${
                activeView === 'all-calculators'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              10 App Categories
            </button>
            <button
              onClick={() => onSelectView('seo-articles')}
              className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-extrabold tracking-tight transition ${
                activeView === 'seo-articles'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              Guides & ROI Articles
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenSavedDrawer}
              className="relative p-2 sm:px-3.5 sm:py-2.5 text-xs font-extrabold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5 border border-slate-200"
              title="View Saved Projects"
            >
              <Bookmark className="w-4 h-4 text-slate-700" />
              <span className="hidden sm:inline">Saved</span>
              {savedCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={onRequestBids}
              className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs sm:text-sm font-black tracking-tight rounded-xl shadow-md transition"
            >
              <span>Get Contractor Bids</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around border-t border-slate-100 py-2.5 text-xs font-black text-slate-700">
          <button
            onClick={() => onSelectView('home-reno')}
            className={`py-1 px-2.5 rounded-lg ${activeView === 'home-reno' ? 'bg-blue-50 text-blue-600 font-black' : ''}`}
          >
            Real Estate & Home
          </button>
          <button
            onClick={() => onSelectView('all-calculators')}
            className={`py-1 px-2.5 rounded-lg ${activeView === 'all-calculators' ? 'bg-blue-50 text-blue-600 font-black' : ''}`}
          >
            All 10 Apps
          </button>
          <button
            onClick={() => onSelectView('seo-articles')}
            className={`py-1 px-2.5 rounded-lg ${activeView === 'seo-articles' ? 'bg-blue-50 text-blue-600 font-black' : ''}`}
          >
            Articles
          </button>
        </div>
      </div>
    </header>
  );
};
