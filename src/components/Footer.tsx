import React from 'react';
import { CheckCircle2, ShieldCheck, ArrowUpRight, Hammer, Package, Store, Home, FileText } from 'lucide-react';
import { AppViewMode } from './Header';
import { RealEstateToolId } from './RealEstateHomeSuite';

interface Props {
  onSelectView: (view: AppViewMode) => void;
  onSelectTool: (tool: RealEstateToolId) => void;
}

export const Footer: React.FC<Props> = ({ onSelectView, onSelectTool }) => {
  return (
    <footer className="bg-slate-950 text-white border-t-2 border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-sm">
                <span>C</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-300 -ml-1 mt-0.5 stroke-[3]" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                CostToFinish<span className="text-blue-500">.com</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
              The premier real estate completion estimation platform. We calculate the exact "final mile" costs, contractor bids, and equity margins to take stalled construction and unfinished homes across the finish line.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => onSelectView('contractors')}
                className="px-3 py-1.5 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-bold hover:bg-emerald-900 transition flex items-center gap-1.5"
              >
                <Hammer className="w-3.5 h-3.5" />
                <span>Contractors</span>
              </button>
              <button
                onClick={() => onSelectView('materials')}
                className="px-3 py-1.5 rounded-lg bg-blue-950/80 text-blue-400 border border-blue-800 font-bold hover:bg-blue-900 transition flex items-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Marketplace</span>
              </button>
            </div>
          </div>

          {/* Construction & Finishing Engines */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Finishing Engines
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-semibold">
              <li>
                <button
                  onClick={() => {
                    onSelectView('home-reno');
                    onSelectTool('shell-to-slab');
                  }}
                  className="hover:text-white transition text-left flex items-center gap-1.5"
                >
                  <Home className="w-3.5 h-3.5 text-blue-400" />
                  <span>Shell-to-Slab Estimator</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectView('home-reno');
                    onSelectTool('basement-attic');
                  }}
                  className="hover:text-white transition text-left"
                >
                  Basement & Attic Completion
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectView('home-reno');
                    onSelectTool('diy-regret');
                  }}
                  className="hover:text-white transition text-left"
                >
                  DIY Regret & Rescue Meter
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('materials')}
                  className="hover:text-white transition text-left text-blue-400"
                >
                  Tools, Equipment & Materials Marketplace
                </button>
              </li>
            </ul>
          </div>

          {/* Trade Network & Pro Services */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Trades & Financing
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-semibold">
              <li>
                <button
                  onClick={() => onSelectView('contractors')}
                  className="hover:text-white transition text-left text-emerald-400"
                >
                  Verified Finish Contractors
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('contractors')}
                  className="hover:text-white transition text-left"
                >
                  Join Contractor Network
                </button>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">
                  Fannie Mae HomeStyle Ready Takeoffs
                </span>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">
                  FHA 203(k) Line-Item Formatter
                </span>
              </li>
            </ul>
          </div>

          {/* Construction & Appraisal Guides */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Field Guides & Reports
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-semibold">
              <li>
                <button
                  onClick={() => onSelectView('seo-articles')}
                  className="hover:text-white transition text-left"
                >
                  Bought an Unfinished Shell Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('seo-articles')}
                  className="hover:text-white transition text-left"
                >
                  Barndominium Dry-In Finish Costs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('seo-articles')}
                  className="hover:text-white transition text-left"
                >
                  Basement Egress Window ROI
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('seo-articles')}
                  className="hover:text-white transition text-left"
                >
                  Owner-Builder Permit Checklist
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-10 mt-10 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CostToFinish.com. Dedicated to Real Estate & Home Construction Completion.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onSelectView('admin')}
              className="text-emerald-400 hover:text-emerald-300 font-bold transition flex items-center gap-1"
            >
              <span>Admin & Revenue Hub</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
            <span>•</span>
            <span className="text-slate-400">Powered by Cloud Firestore</span>
            <span>•</span>
            <span className="text-slate-400">Verified Contractor Bids</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
