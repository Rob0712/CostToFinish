import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  CheckCircle,
  Home,
  GraduationCap,
  Hammer,
  Car,
  Sparkles
} from 'lucide-react';
import { APP_CATEGORIES } from '../data/categoriesData';
import { CategoryId } from '../types';

interface Props {
  onSelectCategory: (id: CategoryId) => void;
  onOpenHomeReno: () => void;
  onSelectRealEstateTool?: (tool: 'shell-to-slab' | 'basement-attic' | 'diy-regret') => void;
}

export const HeroSection: React.FC<Props> = ({
  onSelectCategory,
  onOpenHomeReno,
  onSelectRealEstateTool,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = searchQuery.trim()
    ? APP_CATEGORIES.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredCategories.length > 0) {
      onSelectCategory(filteredCategories[0].id);
    } else {
      onOpenHomeReno();
    }
  };

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white pt-14 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-900 to-slate-950 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Brand Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/40 text-blue-300 text-xs font-black tracking-widest uppercase mb-5">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          The Final Mile Completion Engine
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-[1.08]">
          Stop guessing.{' '}
          <span className="text-emerald-400 font-black underline decoration-emerald-500/40 decoration-4 underline-offset-8">Start finishing.</span>
        </h1>

        {/* Sub-headline */}
        <p className="mt-5 text-base sm:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal">
          Whether it’s a stalled home renovation, a half-completed degree, or an unfinished passion project—we calculate the exact dollar amount needed to get you across the finish line.
        </p>

        {/* Search Bar UI */}
        <form onSubmit={handleSearchSubmit} className="mt-8 max-w-2xl mx-auto relative">
          <div className="relative flex items-center bg-white rounded-2xl shadow-2xl p-1.5 sm:p-2 border-2 border-slate-700/80 focus-within:border-blue-500 transition">
            <Search className="w-5 h-5 text-slate-500 ml-3.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you finishing? (e.g., Basement, Degree, Debt, Mustang...)"
              className="w-full py-3 px-3.5 text-slate-950 placeholder-slate-400 text-sm sm:text-base font-bold focus:outline-none bg-transparent"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-black uppercase tracking-wider px-6 sm:px-8 py-3.5 rounded-xl text-xs sm:text-sm transition shrink-0 flex items-center gap-2 shadow-md"
            >
              <span>Calculate</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          {/* Search suggestions dropdown */}
          {searchQuery.trim() && filteredCategories.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 text-left overflow-hidden z-30 divide-y divide-slate-100">
              {filteredCategories.slice(0, 5).map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    setSearchQuery('');
                  }}
                  className="p-3.5 hover:bg-blue-50 transition cursor-pointer flex items-center justify-between text-slate-900"
                >
                  <div>
                    <span className="font-extrabold text-sm block text-slate-950">{cat.name}</span>
                    <span className="text-xs text-slate-600 font-medium">{cat.tagline}</span>
                  </div>
                  <span className="text-xs font-black text-blue-700 px-3 py-1 bg-blue-100 rounded-lg shrink-0 uppercase tracking-tight">
                    Open Tool →
                  </span>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Flagship Real Estate & Home Fast-Access Row */}
        <div className="mt-6 p-2 sm:p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-left px-2 sm:px-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
              Priority Suite
            </span>
            <span className="text-xs font-black text-white">Real Estate & Home Finishing:</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-center w-full sm:w-auto">
            <button
              onClick={() => {
                if (onSelectRealEstateTool) onSelectRealEstateTool('shell-to-slab');
                else onOpenHomeReno();
              }}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition flex items-center gap-1 shadow-xs"
            >
              <span>🏗️ Shell-to-Slab</span>
            </button>
            <button
              onClick={() => {
                if (onSelectRealEstateTool) onSelectRealEstateTool('basement-attic');
                else onSelectCategory('basement-attic');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-100 text-xs font-black transition flex items-center gap-1 border border-slate-600"
            >
              <span>📐 Basement/Attic</span>
            </button>
            <button
              onClick={() => {
                if (onSelectRealEstateTool) onSelectRealEstateTool('diy-regret');
                else onSelectCategory('diy-regret');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-100 text-xs font-black transition flex items-center gap-1 border border-slate-600"
            >
              <span>🧰 DIY Regret</span>
            </button>
          </div>
        </div>

        {/* Quick Click Tags */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="font-extrabold uppercase tracking-wider text-slate-400 text-[11px]">Also Finishing:</span>
          {[
            { label: 'Degree Completion', id: 'degree-completion' },
            { label: 'Debt Payoff to Zero', id: 'debt-freedom' },
            { label: 'Classic Car Restoration', id: 'car-restoration' },
            { label: 'Last-Mile Wedding', id: 'wedding-budgeter' },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelectCategory(item.id as CategoryId);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 transition text-xs font-bold border border-slate-800"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
              <CheckCircle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-black text-white tracking-tight">Deductive Math Engine</div>
              <div className="text-xs text-slate-300 font-medium mt-0.5 leading-relaxed">
                We audit what is already built and subtract it from the total budget.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <TrendingDown className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-black text-white tracking-tight">DIY vs. Pro Transparency</div>
              <div className="text-xs text-slate-300 font-medium mt-0.5 leading-relaxed">
                See exact labor savings when self-managing vs hiring licensed contractors.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-black text-white tracking-tight">The "Hidden Mile" Shield</div>
              <div className="text-xs text-slate-300 font-medium mt-0.5 leading-relaxed">
                Catch permit renewals, utility meters, and dumpster fees upfront.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
