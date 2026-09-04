import React from 'react';
import { CheckCircle2, ShieldCheck, ArrowUpRight, Github, Twitter } from 'lucide-react';
import { CategoryId } from '../types';

interface Props {
  onSelectView: (view: 'home-reno' | 'all-calculators' | 'seo-articles' | 'other-calc') => void;
  onSelectCategory: (id: CategoryId) => void;
}

export const Footer: React.FC<Props> = ({ onSelectView, onSelectCategory }) => {
  return (
    <footer className="bg-slate-950 text-white border-t-2 border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-sm">
                <span>C</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-300 -ml-1 mt-0.5 stroke-[3]" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                CostToFinish<span className="text-blue-500">.com</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed max-w-sm">
              The project completion estimation platform. We calculate the exact "final mile" costs to take stalled construction, unfinished degrees, or passion projects across the finish line.
            </p>

            <div className="pt-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
              Built for solo homeowners, DIY builders, investors & completers.
            </div>
          </div>

          {/* Real Estate & Home */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Home & Construction
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-semibold">
              <li>
                <button
                  onClick={() => onSelectView('home-reno')}
                  className="hover:text-white transition text-left"
                >
                  Shell-to-Habitable Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('home-reno')}
                  className="hover:text-white transition text-left"
                >
                  Basement Finish Estimator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('diy-regret')}
                  className="hover:text-white transition text-left"
                >
                  DIY Regret Index Meter
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('home-reno')}
                  className="hover:text-white transition text-left"
                >
                  Foreclosure Rehab Takeoff
                </button>
              </li>
            </ul>
          </div>

          {/* Life & Education */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Life & Education
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-semibold">
              <li>
                <button
                  onClick={() => onSelectCategory('degree-completion')}
                  className="hover:text-white transition text-left"
                >
                  Degree Final Mile Tuition
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('debt-freedom')}
                  className="hover:text-white transition text-left"
                >
                  Debt Payoff Freedom Date
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('wedding-last-mile')}
                  className="hover:text-white transition text-left"
                >
                  Wedding Last-Mile Run Rate
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('dental-planner')}
                  className="hover:text-white transition text-left"
                >
                  Dental & Medical Phasing
                </button>
              </li>
            </ul>
          </div>

          {/* Passion Projects & Guides */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Passion & Authority
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-semibold">
              <li>
                <button
                  onClick={() => onSelectCategory('car-restoration')}
                  className="hover:text-white transition text-left"
                >
                  Classic Car Restoration
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('seo-articles')}
                  className="hover:text-white transition text-left"
                >
                  Bought a Shell Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('seo-articles')}
                  className="hover:text-white transition text-left"
                >
                  Basement Sq. Ft. ROI
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('seo-articles')}
                  className="hover:text-white transition text-left"
                >
                  DIY vs. Contractor Matrix
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <p className="max-w-3xl leading-relaxed">
            <strong className="text-slate-300 font-bold">Disclaimer:</strong> CostToFinish.com provides heuristic and weighted algorithmic estimates based on regional labor indices, material baseline averages, and trade multipliers. Actual contractor bids, municipal permit requirements, and structural conditions will vary. Always obtain licensed professional on-site engineering assessments prior to entering binding contracts.
          </p>
          <div className="shrink-0 text-slate-300 font-bold">
            © {new Date().getFullYear()} CostToFinish.com. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
