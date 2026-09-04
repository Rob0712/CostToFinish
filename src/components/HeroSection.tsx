import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  CheckCircle,
  Home,
  Hammer,
  Sparkles,
  Building,
  Layers
} from 'lucide-react';

interface Props {
  onSelectRealEstateTool: (tool: 'shell-to-slab' | 'basement-attic' | 'diy-regret') => void;
  onExploreContractors?: () => void;
}

export const HeroSection: React.FC<Props> = ({
  onSelectRealEstateTool,
  onExploreContractors,
}) => {
  const [searchSqFt, setSearchSqFt] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectRealEstateTool('shell-to-slab');
  };

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-900 to-slate-950 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Brand Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/40 text-blue-300 text-xs font-black tracking-widest uppercase mb-5">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          Real Estate & Construction Completion Platform
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-[1.08]">
          How much will it cost to{' '}
          <span className="text-emerald-400 font-black underline decoration-emerald-500/40 decoration-4 underline-offset-8">
            finish this home?
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="mt-5 text-base sm:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal">
          Buying an abandoned shell, raw basement, or stalled framing? We calculate the exact trade line-item budget, contractor bids, and equity upside to take your project from slab to certificate of occupancy.
        </p>

        {/* Fast Tool Selector Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
          <button
            onClick={() => onSelectRealEstateTool('shell-to-slab')}
            className="p-4 rounded-2xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-left transition shadow-lg border border-blue-400/30 flex flex-col justify-between group"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-2.5">
                <Building className="w-4 h-4 text-white" />
              </div>
              <div className="font-black text-sm tracking-tight">Shell-to-Slab Estimator</div>
              <p className="text-[11px] text-blue-100 font-medium mt-1 leading-snug">
                Raw frame, dry-in, rough-in MEP, insulation, drywall to turnkey finish.
              </p>
            </div>
            <div className="mt-3 text-[11px] font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Launch Takeoff</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>

          <button
            onClick={() => onSelectRealEstateTool('basement-attic')}
            className="p-4 rounded-2xl bg-slate-800/90 hover:bg-slate-800 text-white text-left transition border border-slate-700 shadow-sm flex flex-col justify-between group hover:border-slate-600"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center mb-2.5 border border-purple-500/30">
                <Layers className="w-4 h-4" />
              </div>
              <div className="font-black text-sm tracking-tight">Basement & Attic Finishing</div>
              <p className="text-[11px] text-slate-300 font-medium mt-1 leading-snug">
                Concrete moisture barriers, subflooring, egress windows & bath additions.
              </p>
            </div>
            <div className="mt-3 text-[11px] font-black uppercase tracking-wider text-purple-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Calculate ROI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>

          <button
            onClick={() => onSelectRealEstateTool('diy-regret')}
            className="p-4 rounded-2xl bg-slate-800/90 hover:bg-slate-800 text-white text-left transition border border-slate-700 shadow-sm flex flex-col justify-between group hover:border-slate-600"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-2.5 border border-amber-500/30">
                <Hammer className="w-4 h-4" />
              </div>
              <div className="font-black text-sm tracking-tight">DIY Regret & Rescue Meter</div>
              <p className="text-[11px] text-slate-300 font-medium mt-1 leading-snug">
                Stuck halfway on mudding or tile? Calculate true cost to hire a rescue pro.
              </p>
            </div>
            <div className="mt-3 text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Audit Trade Pain</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
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
                We audit trades already complete (roofing, framing) and calculate remaining milestones.
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
                Compare hiring licensed general contractors against owner-builder wholesale materials.
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
                Permit fees, utility meter hookups, rough inspection sign-offs, and dumpster waste.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
