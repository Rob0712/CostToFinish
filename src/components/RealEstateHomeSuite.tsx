import React, { useState } from 'react';
import {
  Home,
  Hammer,
  Layers,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Maximize2,
  ArrowRight
} from 'lucide-react';
import { HomeRenoCalculator } from './HomeRenoCalculator';
import { BasementAtticCalculator } from './BasementAtticCalculator';
import { DiyRegretCalculator } from './DiyRegretCalculator';
import { HomeRenoResult } from '../types';

export type RealEstateToolId = 'shell-to-slab' | 'basement-attic' | 'diy-regret';

interface Props {
  initialTool?: RealEstateToolId;
  onSaveEstimate: (result: HomeRenoResult, title: string) => void;
  onRequestBids: (result: any) => void;
  onOpenReportModal: (result: any) => void;
}

export const RealEstateHomeSuite: React.FC<Props> = ({
  initialTool = 'shell-to-slab',
  onSaveEstimate,
  onRequestBids,
  onOpenReportModal,
}) => {
  const [activeTool, setActiveTool] = useState<RealEstateToolId>(initialTool);

  const tools = [
    {
      id: 'shell-to-slab' as RealEstateToolId,
      name: 'Shell-to-Slab Estimator',
      subtitle: 'From bare concrete slab or framed shell to Certificate of Occupancy',
      badge: 'Flagship Anchor',
      icon: Home,
      metric: 'Average Completion: $35k - $120k',
    },
    {
      id: 'basement-attic' as RealEstateToolId,
      name: 'Basement & Attic Completion',
      subtitle: 'Convert unconditioned space to certified living sq. ft. with egress & appraisal ROI',
      badge: 'High Equity ROI',
      icon: Layers,
      metric: 'Appraisal Uplift: +$45k - $95k',
    },
    {
      id: 'diy-regret' as RealEstateToolId,
      name: 'DIY Regret Calculator',
      subtitle: 'Compare finish-it-yourself burnout vs. hiring a licensed pro rescue crew',
      badge: 'Behavioral & Burnout',
      icon: Hammer,
      metric: 'Time Saved: 8-16 Weekends',
    },
  ];

  return (
    <div className="bg-slate-50 border-b border-slate-200">
      {/* Priority Real Estate Suite Banner */}
      <div className="bg-slate-950 text-white py-10 px-4 sm:px-6 lg:px-8 border-b-2 border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-black tracking-widest uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                #1 High-Traffic Driver • Physical Structure Completion
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Real Estate & Home Completion Suite
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-medium mt-2 max-w-3xl leading-relaxed">
                For homeowners, flippers, and investors physically finishing a structure. Three specialized algorithmic engines calculating exact trade costs, code compliance, and return on investment.
              </p>
            </div>

            {/* Quick trust metrics */}
            <div className="flex items-center gap-4 text-xs font-bold text-slate-300 shrink-0">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                <span>IRC Code Compliant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 stroke-[2.5]" />
                <span>Bank Valuation Format</span>
              </div>
            </div>
          </div>

          {/* 3 Prominent Tool Cards / Switcher */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`p-5 rounded-2xl text-left transition relative border-2 flex flex-col justify-between ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-400 shadow-lg scale-[1.01]'
                      : 'bg-slate-900/90 text-slate-200 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {tool.badge}
                      </span>
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    </div>

                    <h3 className="text-lg font-black tracking-tight leading-snug">
                      {tool.name}
                    </h3>
                    <p
                      className={`text-xs mt-1.5 font-medium leading-relaxed ${
                        isActive ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {tool.subtitle}
                    </p>
                  </div>

                  <div
                    className={`mt-4 pt-3 border-t text-[11px] font-black uppercase tracking-wider flex items-center justify-between ${
                      isActive ? 'border-blue-500 text-white' : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>{tool.metric}</span>
                    <span className="font-bold underline underline-offset-4">
                      {isActive ? 'Active Engine' : 'Launch →'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Render Active Engine */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeTool === 'shell-to-slab' && (
          <HomeRenoCalculator
            onSaveEstimate={onSaveEstimate}
            onRequestBids={onRequestBids}
            onOpenReportModal={onOpenReportModal}
          />
        )}

        {activeTool === 'basement-attic' && (
          <BasementAtticCalculator
            onSaveEstimate={onSaveEstimate}
            onRequestBids={onRequestBids}
            onOpenReportModal={onOpenReportModal}
          />
        )}

        {activeTool === 'diy-regret' && (
          <DiyRegretCalculator
            onSaveEstimate={onSaveEstimate}
            onRequestBids={onRequestBids}
            onOpenReportModal={onOpenReportModal}
          />
        )}
      </div>
    </div>
  );
};
