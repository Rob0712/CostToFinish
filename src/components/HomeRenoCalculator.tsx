import React, { useState, useMemo } from 'react';
import {
  Home,
  CheckCircle2,
  Circle,
  Sparkles,
  DollarSign,
  Calendar,
  Layers,
  Wrench,
  ShieldCheck,
  Download,
  Mail,
  UserCheck,
  Clock,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sliders,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  FileText
} from 'lucide-react';
import {
  HomeRenoInputs,
  HomeRenoResult,
  QualityTier
} from '../types';
import {
  BASE_FINISHING_COST_PER_SQFT,
  LOCATION_MULTIPLIERS,
  RENO_PHASES,
  HIDDEN_COST_ITEMS,
  SCOPE_PRESETS
} from '../data/homeRenoData';
import {
  calculateHomeReno,
  formatCurrency,
  formatNumber
} from '../utils/calculationUtils';

interface Props {
  onSaveEstimate: (result: HomeRenoResult, title: string) => void;
  onRequestBids: (result: HomeRenoResult) => void;
  onOpenReportModal: (result: HomeRenoResult) => void;
}

export const HomeRenoCalculator: React.FC<Props> = ({
  onSaveEstimate,
  onRequestBids,
  onOpenReportModal
}) => {
  // Wizard active step (1: Scope, 2: Audit, 3: Quality, 4: Hidden Mile & Sunk Cost, 5: Finish Line Dashboard)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Inputs State
  const [inputs, setInputs] = useState<HomeRenoInputs>({
    squareFootage: 1800,
    unit: 'sqft',
    storeys: 1,
    locationId: 'us-nat',
    stalledStatus: 'shell',
    phases: {
      framing: true,
      mep_roughin: true,
      drywall: false,
      flooring: false,
      kitchen: false,
      bathrooms: false,
      trim_doors: false,
      paint_fixtures: false,
    },
    qualityTier: 'standard',
    hiddenCosts: {
      permits: true,
      utilities: false,
      cabinetry_builtins: true,
      debris_removal: true,
      final_inspection: true,
    },
    sunkCostSpent: 45000,
    estimatedPostFinishValue: 340000,
  });

  const [projectTitle, setProjectTitle] = useState<string>('My Home Shell Finish');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<boolean>(false);

  // Calculate math live
  const result: HomeRenoResult = useMemo(() => {
    return calculateHomeReno(inputs);
  }, [inputs]);

  // Phase toggling
  const handleTogglePhase = (phaseId: string) => {
    setInputs((prev) => ({
      ...prev,
      phases: {
        ...prev.phases,
        [phaseId]: !prev.phases[phaseId],
      },
    }));
  };

  const handleMarkAllPhases = (completed: boolean) => {
    const updated: Record<string, boolean> = {};
    RENO_PHASES.forEach((p) => {
      updated[p.id] = completed;
    });
    setInputs((prev) => ({
      ...prev,
      phases: updated,
    }));
  };

  const applyPreset = (presetId: string) => {
    const preset = SCOPE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const updated: Record<string, boolean> = {};
    RENO_PHASES.forEach((p) => {
      updated[p.id] = preset.completedPhaseIds.includes(p.id);
    });
    setInputs((prev) => ({
      ...prev,
      squareFootage: preset.sqft,
      phases: updated,
    }));
  };

  const handleSave = () => {
    onSaveEstimate(result, projectTitle);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  return (
    <div className="bg-white border-b border-slate-200">
      {/* Anchor App Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-900 text-xs font-black tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Flagship Completion Calculator
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950 mt-2 tracking-tight">
              Shell-to-Slab & Stalled Build Estimator
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-1.5 max-w-3xl font-medium leading-relaxed">
              Calculate the precise final-mile cost to take raw studs, cold concrete slabs, barndominiums, or stalled residential shells to a code-certified Certificate of Occupancy.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenReportModal(result)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-extrabold tracking-tight rounded-xl shadow-md transition"
            >
              <FileText className="w-4 h-4" />
              <span>Certified PDF Report</span>
            </button>
            <button
              onClick={() => onRequestBids(result)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs sm:text-sm font-black tracking-tight rounded-xl shadow-md transition"
            >
              <UserCheck className="w-4 h-4 stroke-[2.5]" />
              <span>Get 3 Contractor Bids</span>
            </button>
          </div>
        </div>

        {/* Wizard Steps Navigation */}
        <div className="mt-8 border-y border-slate-200 py-3.5 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[640px] gap-2">
            {[
              { num: 1, label: '1. Project Scope' },
              { num: 2, label: '2. Current State Audit' },
              { num: 3, label: '3. Finish Quality' },
              { num: 4, label: '4. Hidden Mile & Sunk Cost' },
              { num: 5, label: '5. The Finish Line' },
            ].map((step) => {
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <button
                  key={step.num}
                  onClick={() => setCurrentStep(step.num)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black tracking-tight transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : isPast
                      ? 'text-emerald-800 bg-emerald-100 hover:bg-emerald-200'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
                      isActive
                        ? 'bg-white text-blue-700'
                        : isPast
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {isPast ? '✓' : step.num}
                  </span>
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Wizard Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Wizard Content Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* STEP 1: SCOPE & LOCATION */}
            {currentStep === 1 && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-950 tracking-tight">Step 1: Define Project Foundation & Location</h3>
                  <p className="text-sm text-slate-600 font-medium mt-0.5">
                    Start with the physical dimensions and geographic labor market to establish your baseline.
                  </p>
                </div>

                {/* Quick Presets */}
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                    Quick Scenario Presets:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {SCOPE_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => applyPreset(preset.id)}
                        className="text-left p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/50 transition group shadow-xs"
                      >
                        <span className="block text-xs font-black text-slate-900 group-hover:text-blue-700 tracking-tight">
                          {preset.name}
                        </span>
                        <span className="block text-[11px] text-slate-500 font-medium mt-1 line-clamp-2">
                          {preset.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Floor Area Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                        Total Floor Area
                      </label>
                      <div className="inline-flex rounded-lg bg-slate-200 p-0.5 text-xs font-bold">
                        <button
                          onClick={() => setInputs({ ...inputs, unit: 'sqft' })}
                          className={`px-2.5 py-1 rounded-md font-black ${
                            inputs.unit === 'sqft' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600'
                          }`}
                        >
                          Sq. Ft.
                        </button>
                        <button
                          onClick={() => setInputs({ ...inputs, unit: 'sqm' })}
                          className={`px-2.5 py-1 rounded-md font-black ${
                            inputs.unit === 'sqm' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600'
                          }`}
                        >
                          Sq. Meters
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min="200"
                        max="25000"
                        step="50"
                        value={inputs.squareFootage}
                        onChange={(e) => setInputs({ ...inputs, squareFootage: Math.max(50, Number(e.target.value)) })}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-xl font-black text-slate-950 focus:outline-blue-600"
                      />
                      <span className="absolute right-4 top-3.5 text-sm font-black text-slate-400 uppercase">
                        {inputs.unit === 'sqft' ? 'sq ft' : 'sq m'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1.5">
                      Average US single-family home is ~1,800–2,400 sq. ft. Basements ~800–1,200 sq. ft.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                      Number of Storeys
                    </label>
                    <select
                      value={inputs.storeys}
                      onChange={(e) => setInputs({ ...inputs, storeys: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-base font-bold text-slate-950 focus:outline-blue-600"
                    >
                      <option value={1}>Single Storey / Ranch / Finished Basement</option>
                      <option value={2}>Two Storey Residential</option>
                      <option value={3}>Three Storey / Loft / Multi-level</option>
                    </select>
                    <p className="text-xs text-slate-500 font-medium mt-1.5">
                      Multi-story builds require extra vertical plumbing stacks and sound attenuation.
                    </p>
                  </div>
                </div>

                {/* Location & Labor Rates */}
                <div className="pt-2">
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Location & Regional Construction Labor Rate
                  </label>
                  <select
                    value={inputs.locationId}
                    onChange={(e) => setInputs({ ...inputs, locationId: e.target.value })}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-base font-bold text-slate-950 focus:outline-blue-600"
                  >
                    {LOCATION_MULTIPLIERS.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.label} — {loc.multiplier}x Multiplier (Avg Trade Labor ${loc.avgLaborRateHourly}/hr)
                      </option>
                    ))}
                  </select>
                  <div className="mt-2.5 flex flex-wrap items-center justify-between text-xs text-slate-600 font-medium">
                    <span>Selected Labor Index: <strong className="text-slate-950 font-black">{result.locationMultiplier}x</strong> national baseline</span>
                    <span>Base Finish Rate: <strong className="text-slate-950 font-black">${BASE_FINISHING_COST_PER_SQFT}/sq.ft.</strong></span>
                  </div>
                </div>

                {/* Next Step CTA */}
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-black text-sm tracking-tight rounded-xl transition shadow-md"
                  >
                    <span>Proceed to Current State Audit</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: CURRENT STATE AUDIT (The Progress Bar Engine) */}
            {currentStep === 2 && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-black text-slate-950 tracking-tight">Step 2: The "Current State" Audit</h3>
                    <p className="text-sm text-slate-600 font-medium mt-0.5">
                      Check off the milestones that are already built. The calculator only charges for what is missing.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMarkAllPhases(true)}
                      className="text-xs font-black px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-800 hover:bg-slate-100 shadow-xs"
                    >
                      Mark All Complete
                    </button>
                    <button
                      onClick={() => handleMarkAllPhases(false)}
                      className="text-xs font-black px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-800 hover:bg-slate-100 shadow-xs"
                    >
                      Reset (0% Done)
                    </button>
                  </div>
                </div>

                {/* Progress summary bar */}
                <div className="bg-white p-5 rounded-2xl border-2 border-slate-200">
                  <div className="flex justify-between text-xs font-black uppercase tracking-wider mb-2.5 text-slate-800">
                    <span>Audit Status: <span className="text-emerald-600">{result.completedPercentage}% Completed</span></span>
                    <span className="text-blue-600 font-black">{result.remainingPercentage}% Remains to Finish</span>
                  </div>
                  <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden flex shadow-inner">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${result.completedPercentage}%` }}
                    />
                    <div
                      className="bg-blue-600 h-full transition-all duration-300"
                      style={{ width: `${result.remainingPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500 font-bold mt-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Completed (Deducted from budget)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Active Cost Scope
                    </span>
                  </div>
                </div>

                {/* 8 Weighted Phase Cards */}
                <div className="space-y-3">
                  {result.phaseBreakdown.map(({ phase, isCompleted, cost, laborCost, materialCost }) => (
                    <div
                      key={phase.id}
                      onClick={() => handleTogglePhase(phase.id)}
                      className={`p-4 sm:p-5 rounded-2xl border-2 transition cursor-pointer select-none flex items-start justify-between gap-4 ${
                        isCompleted
                          ? 'bg-emerald-50/80 border-emerald-400 text-slate-900'
                          : 'bg-white border-slate-200 hover:border-blue-500 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="mt-0.5">
                          {isCompleted ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 stroke-[2.5]" />
                          ) : (
                            <Circle className="w-6 h-6 text-slate-300 shrink-0" />
                          )}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-black text-sm sm:text-base text-slate-950 tracking-tight">
                              {phase.title}
                            </span>
                            <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase">
                              {Math.round(phase.weight * 100)}% Weight
                            </span>
                            <span className="text-[11px] font-bold text-slate-500 hidden sm:inline uppercase tracking-tight">
                              {phase.trade}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                            {phase.description}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {isCompleted ? (
                          <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-900 font-black text-xs rounded-xl border border-emerald-200 uppercase tracking-tight">
                            Deducted
                          </div>
                        ) : (
                          <div>
                            <span className="block font-black text-base sm:text-lg text-blue-700 tracking-tight">
                              +{formatCurrency(cost)}
                            </span>
                            <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
                              Mat: {formatCurrency(materialCost)} | Lab: {formatCurrency(laborCost)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Step navigation */}
                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-extrabold text-sm rounded-xl transition shadow-xs"
                  >
                    <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="inline-flex items-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-black text-sm tracking-tight rounded-xl transition shadow-md"
                  >
                    <span>Proceed to Finish Quality</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: QUALITY TIER */}
            {currentStep === 3 && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-950 tracking-tight">Step 3: Select Desired Finish Level</h3>
                  <p className="text-sm text-slate-600 font-medium mt-0.5">
                    Your material specification determines the final finish rate per square foot.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Tier 1: Budget */}
                  <div
                    onClick={() => setInputs({ ...inputs, qualityTier: 'budget' })}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition select-none ${
                      inputs.qualityTier === 'budget'
                        ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-600/30'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-500">Tier 1</span>
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">0.8x</span>
                    </div>
                    <h4 className="text-lg font-black text-slate-950 tracking-tight">Basic / Rental Grade</h4>
                    <p className="text-xs text-slate-600 font-medium mt-1">Focus on functional durability and budget control.</p>
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs font-semibold text-slate-700">
                      <div>• Ceramic tile & durable laminate</div>
                      <div>• Standard contractor white paint</div>
                      <div>• Stock flat-panel shaker cabinets</div>
                      <div>• Standard chrome builder plumbing</div>
                    </div>
                  </div>

                  {/* Tier 2: Standard */}
                  <div
                    onClick={() => setInputs({ ...inputs, qualityTier: 'standard' })}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition select-none ${
                      inputs.qualityTier === 'standard'
                        ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-600/30'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-blue-700">Tier 2 (Standard)</span>
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">1.0x Baseline</span>
                    </div>
                    <h4 className="text-lg font-black text-slate-950 tracking-tight">Standard / Modern</h4>
                    <p className="text-xs text-slate-600 font-medium mt-1">The sweet spot for primary homeowners and suburban flips.</p>
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs font-semibold text-slate-700">
                      <div>• Porcelain tile & engineered flooring</div>
                      <div>• Quartz / granite slab countertops</div>
                      <div>• Branded Delta/Moen valves & trim</div>
                      <div>• Soft-close drawers & recessed LED pots</div>
                    </div>
                  </div>

                  {/* Tier 3: Luxury */}
                  <div
                    onClick={() => setInputs({ ...inputs, qualityTier: 'luxury' })}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition select-none ${
                      inputs.qualityTier === 'luxury'
                        ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-600/30'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-purple-700">Tier 3</span>
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900">1.6x Premium</span>
                    </div>
                    <h4 className="text-lg font-black text-slate-950 tracking-tight">Luxury / Custom</h4>
                    <p className="text-xs text-slate-600 font-medium mt-1">Architectural details and designer-grade trade finishes.</p>
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs font-semibold text-slate-700">
                      <div>• Wide-plank white oak & marble slabs</div>
                      <div>• Custom furniture-grade millwork</div>
                      <div>• Smart Lutron lighting & concealed audio</div>
                      <div>• Rain shower suites & designer hardware</div>
                    </div>
                  </div>
                </div>

                {/* Step navigation */}
                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-extrabold text-sm rounded-xl transition shadow-xs"
                  >
                    <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="inline-flex items-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-black text-sm tracking-tight rounded-xl transition shadow-md"
                  >
                    <span>Proceed to Hidden Mile & Sunk Cost</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: HIDDEN MILE & SUNK COST */}
            {currentStep === 4 && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-950 tracking-tight">Step 4: The "Hidden Mile" Checklist & Sunk Cost</h3>
                  <p className="text-sm text-slate-600 font-medium mt-0.5">
                    Account for the overlooked municipal fees, dumpster hauls, and utility drops that surprise most owners.
                  </p>
                </div>

                {/* Hidden costs checklist */}
                <div className="space-y-3">
                  {HIDDEN_COST_ITEMS.map((item) => {
                    const isChecked = Boolean(inputs.hiddenCosts[item.id]);
                    const costAdjusted = Math.round(item.typicalCost * result.locationMultiplier);
                    return (
                      <div
                        key={item.id}
                        onClick={() =>
                          setInputs((prev) => ({
                            ...prev,
                            hiddenCosts: {
                              ...prev.hiddenCosts,
                              [item.id]: !prev.hiddenCosts[item.id],
                            },
                          }))
                        }
                        className={`p-4 sm:p-5 rounded-2xl border-2 transition cursor-pointer select-none flex items-start justify-between gap-4 ${
                          isChecked
                            ? 'bg-blue-50/70 border-blue-500'
                            : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="mt-0.5">
                            {isChecked ? (
                              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 stroke-[2.5]" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                            )}
                          </div>
                          <div>
                            <span className="font-black text-sm sm:text-base text-slate-950 tracking-tight">{item.label}</span>
                            <p className="text-xs text-slate-600 font-medium mt-0.5">{item.description}</p>
                          </div>
                        </div>
                        <span className="font-black text-base text-slate-950 shrink-0 tracking-tight">
                          +{formatCurrency(costAdjusted)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Sunk Cost Tracker */}
                <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 space-y-4 shadow-xs">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600 stroke-[2.5]" />
                    <h4 className="font-black text-slate-950 text-base tracking-tight">
                      The "Sunk Cost & Equity" Tracker
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Input what you’ve already invested to view your total capital exposure versus expected post-finish valuation.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                        Amount Spent So Far ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={inputs.sunkCostSpent}
                        onChange={(e) => setInputs({ ...inputs, sunkCostSpent: Math.max(0, Number(e.target.value)) })}
                        className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-bold text-slate-950 focus:outline-blue-600 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                        Projected Post-Finish Market Value ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="5000"
                        value={inputs.estimatedPostFinishValue}
                        onChange={(e) => setInputs({ ...inputs, estimatedPostFinishValue: Math.max(0, Number(e.target.value)) })}
                        className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-bold text-slate-950 focus:outline-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Step navigation */}
                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-extrabold text-sm rounded-xl transition shadow-xs"
                  >
                    <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setCurrentStep(5)}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-sm tracking-tight rounded-xl transition shadow-md"
                  >
                    <span>Calculate Final Finish Line</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: THE FINISH LINE (Detailed Output Dashboard) */}
            {currentStep === 5 && (
              <div className="space-y-6">
                {/* Finish Hero Banner */}
                <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
                    <div>
                      <span className="text-xs font-black text-emerald-400 tracking-wider uppercase">
                        CostToFinish.com Certified Takeoff
                      </span>
                      <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mt-2 tracking-tighter">
                        {formatCurrency(result.costToFinishContractor)}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                        Turn-Key Licensed General Contractor Estimate ({result.effectiveSqFt} sq. ft. @ {result.remainingPercentage}% remaining)
                      </p>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shrink-0">
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Estimated Time to Move-In:</div>
                      <div className="text-2xl font-black text-white mt-0.5 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-emerald-400 stroke-[2.5]" />
                        <span>~{result.estimatedDaysToFinish} Working Days</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                        Assuming 2–4 full-time trade crew members
                      </div>
                    </div>
                  </div>

                  {/* DIY vs Pro Gap */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-400 font-black uppercase tracking-wider">
                        Licensed Contractor Takeover
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight">
                        {formatCurrency(result.costToFinishContractor)}
                      </div>
                      <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed">
                        Includes permit handling, 20% GC markup, sub-trade warranties, and turn-key punch list completion.
                      </p>
                    </div>

                    <div className="bg-emerald-950/40 p-5 rounded-xl border border-emerald-500/40">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-emerald-400 font-black uppercase tracking-wider">
                          Self-Managed / DIY Savings
                        </span>
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                          Save {formatCurrency(result.diySavings)}
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-emerald-300 mt-1 tracking-tight">
                        {formatCurrency(result.costToFinishDIY)}
                      </div>
                      <p className="text-xs text-emerald-200/90 font-medium mt-1 leading-relaxed">
                        You source materials directly, handle cleanups & paint, and hire licensed subs only for MEP rough-ins.
                      </p>
                    </div>
                  </div>

                  {/* Sunk Cost / Investment Comparison */}
                  {inputs.sunkCostSpent > 0 && inputs.estimatedPostFinishValue && (
                    <div className="mt-6 pt-6 border-t border-slate-800">
                      <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                        Total Capital Exposure vs. Post-Finish Valuation
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                          <span className="text-xs text-slate-400 font-bold block">Sunk Spend So Far:</span>
                          <span className="text-lg font-black text-slate-200">{formatCurrency(inputs.sunkCostSpent)}</span>
                        </div>
                        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                          <span className="text-xs text-slate-400 font-bold block">Total Investment to Finish:</span>
                          <span className="text-lg font-black text-white">{formatCurrency(inputs.sunkCostSpent + result.costToFinishContractor)}</span>
                        </div>
                        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                          <span className="text-xs text-slate-400 font-bold block">Projected Market Equity:</span>
                          <span className="text-lg font-black text-emerald-400">
                            {formatCurrency(inputs.estimatedPostFinishValue - (inputs.sunkCostSpent + result.costToFinishContractor))}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Phase-by-Phase Line Item Table */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-xs">
                  <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-black text-slate-950 text-base sm:text-lg tracking-tight">
                      Phased Construction Line-Item Budget
                    </h3>
                    <span className="text-xs text-slate-600 font-bold">
                      Location Multiplier applied: {result.locationMultiplier}x
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4 font-black">Phase & Scope</th>
                          <th className="py-3 px-4 font-black">Weight</th>
                          <th className="py-3 px-4 font-black">Materials</th>
                          <th className="py-3 px-4 font-black">Labor</th>
                          <th className="py-3 px-4 font-black">Status</th>
                          <th className="py-3 px-4 font-black text-right">Cost to Finish</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {result.phaseBreakdown.map(({ phase, isCompleted, cost, laborCost, materialCost }) => (
                          <tr key={phase.id} className={isCompleted ? 'bg-slate-50/50 text-slate-400' : 'hover:bg-slate-50/80'}>
                            <td className="py-3.5 px-4 font-medium text-slate-900">
                              <div className="font-black text-slate-950">{phase.title}</div>
                              <div className="text-xs text-slate-500 font-semibold">{phase.trade}</div>
                            </td>
                            <td className="py-3.5 px-4 text-xs font-black text-slate-700">
                              {Math.round(phase.weight * 100)}%
                            </td>
                            <td className="py-3.5 px-4 text-xs font-bold text-slate-700">
                              {formatCurrency(materialCost)}
                            </td>
                            <td className="py-3.5 px-4 text-xs font-bold text-slate-700">
                              {formatCurrency(laborCost)}
                            </td>
                            <td className="py-3.5 px-4">
                              {isCompleted ? (
                                <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md uppercase tracking-tight">
                                  ✓ Done
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-black text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md uppercase tracking-tight">
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right font-black text-slate-950">
                              {isCompleted ? (
                                <span className="text-slate-400 text-xs line-through">$0</span>
                              ) : (
                                <span className="text-base text-slate-950 font-black">{formatCurrency(cost)}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                        {/* Hidden costs row */}
                        <tr className="bg-slate-50/80 font-bold text-slate-900">
                          <td className="py-3.5 px-4 font-black" colSpan={4}>
                            Overlooked / Hidden Mile Items (Permits, Debris, Utilities)
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-500 font-bold">
                            Checklist Total
                          </td>
                          <td className="py-3.5 px-4 text-right font-black text-base text-slate-950">
                            +{formatCurrency(result.hiddenCostsTotal)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Material & Trade Takeoff Shopping List */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-slate-950 text-base sm:text-lg tracking-tight">
                        Estimated Takeoff & Trade Shopping List
                      </h3>
                      <p className="text-xs text-slate-600 font-medium">
                        Approximate quantities based on {result.effectiveSqFt} sq. ft. scope and selected quality tier.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
                    {result.takeoffShoppingList.map((item, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 block">
                          {item.category}
                        </span>
                        <div className="font-black text-sm text-slate-950 mt-1">{item.item}</div>
                        <div className="flex justify-between items-center mt-2.5 pt-2.5 border-t border-slate-200 text-xs">
                          <span className="text-slate-500 font-medium">Qty: {item.estimatedQuantity}</span>
                          <span className="font-black text-slate-950">{formatCurrency(item.estimatedCost)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs sm:text-sm rounded-xl transition"
                  >
                    <RotateCcw className="w-4 h-4 stroke-[2.5]" />
                    <span>Adjust Inputs & Restart</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 font-black text-xs sm:text-sm rounded-xl shadow-xs transition"
                    >
                      <Download className="w-4 h-4 stroke-[2.5]" />
                      <span>{saveSuccessMsg ? '✓ Saved!' : 'Save Estimate'}</span>
                    </button>
                    <button
                      onClick={() => onOpenReportModal(result)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-black text-xs sm:text-sm tracking-tight rounded-xl shadow-md transition"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Export Full PDF Report</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Floating Summary Card */}
          <div className="lg:col-span-4 sticky top-6 space-y-4">
            <div className="bg-slate-950 text-white p-6 rounded-2xl border border-slate-800 shadow-xl">
              <div className="flex justify-between items-center text-xs text-slate-400 font-black uppercase tracking-wider mb-2">
                <span>Live Cost to Finish</span>
                <span className="text-emerald-400">Step {currentStep} of 5</span>
              </div>

              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {formatCurrency(result.costToFinishContractor)}
              </div>
              <div className="text-xs text-slate-400 font-medium mt-1">
                Turn-key contractor estimate for {result.effectiveSqFt} sq. ft.
              </div>

              <div className="mt-5 pt-5 border-t border-slate-800 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="font-semibold">Scope Completed:</span>
                  <span className="font-black text-emerald-400">{result.completedPercentage}% Done</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="font-semibold">Remaining Scope:</span>
                  <span className="font-black text-white">{result.remainingPercentage}% to build</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="font-semibold">Quality Spec:</span>
                  <span className="capitalize font-bold text-slate-200">{inputs.qualityTier} ({result.qualityMultiplier}x)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="font-semibold">Location Adjustment:</span>
                  <span className="font-bold text-slate-200">{result.locationMultiplier}x</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="font-semibold">DIY Self-Managed Gap:</span>
                  <span className="font-black text-emerald-400">{formatCurrency(result.costToFinishDIY)}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={() => onRequestBids(result)}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-md"
                >
                  <UserCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>Get 3 Contractor Quotes</span>
                </button>
              </div>
            </div>

            {/* Quick Fact Box */}
            <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl text-xs text-blue-950 space-y-1.5 shadow-xs">
              <div className="font-black flex items-center gap-1.5 text-blue-950 text-sm">
                <ShieldCheck className="w-4 h-4 text-blue-600 stroke-[2.5]" />
                <span>The CostToFinish Advantage</span>
              </div>
              <p className="leading-relaxed text-blue-900 font-medium">
                Standard cost estimators only calculate new construction from ground up. We deduct already installed framing and rough-ins so you never double-pay a contractor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
