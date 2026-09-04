import React, { useState, useMemo } from 'react';
import {
  Hammer,
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingDown,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Bookmark,
  Calendar,
  Layers,
  Wrench
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/calculationUtils';

interface Props {
  onSaveEstimate?: (result: any, title: string) => void;
  onRequestBids?: (summary: any) => void;
  onOpenReportModal?: (summary: any) => void;
}

export const DiyRegretCalculator: React.FC<Props> = ({
  onSaveEstimate,
  onRequestBids,
  onOpenReportModal,
}) => {
  // Project Type
  const [projectType, setProjectType] = useState<string>('bathroom');
  const [stallDurationMonths, setStallDurationMonths] = useState<number>(3);

  // Financial & Labor Inputs
  const [materialsRemaining, setMaterialsRemaining] = useState<number>(3200);
  const [toolRentalsPurchases, setToolRentalsPurchases] = useState<number>(850);
  const [hourlyWage, setHourlyWage] = useState<number>(55);
  const [diyHoursRemaining, setDiyHoursRemaining] = useState<number>(80); // 80 weekend hours = 10 full 8-hr days
  const [sunkCostSpent, setSunkCostSpent] = useState<number>(4500);

  // Risk Factors
  const [hasComplexTrades, setHasComplexTrades] = useState<{
    plumbing: boolean;
    electrical: boolean;
    drywallMud: boolean;
    tileWaterproofing: boolean;
  }>({
    plumbing: true,
    electrical: false,
    drywallMud: true,
    tileWaterproofing: true,
  });

  const [diyScrapPercent, setDiyScrapPercent] = useState<number>(18); // 18% average DIY cut waste
  const [frustrationScore, setFrustrationScore] = useState<number>(7); // 1-10

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Calculation Engine
  const calculation = useMemo(() => {
    // 1. Opportunity Cost of Personal Time
    const timeCost = diyHoursRemaining * hourlyWage;

    // 2. Material Scrap & Error Rework
    const scrapErrorCost = Math.round(materialsRemaining * (diyScrapPercent / 100));

    // 3. Inspection & Code Failure Risk
    let codeRiskCost = 0;
    if (hasComplexTrades.plumbing) codeRiskCost += 750;
    if (hasComplexTrades.electrical) codeRiskCost += 850;
    if (hasComplexTrades.tileWaterproofing) codeRiskCost += 900; // shower pan leak risk
    if (hasComplexTrades.drywallMud) codeRiskCost += 400; // skim coat repair

    // 4. True All-in DIY Cost
    const trueDiyCost = Math.round(
      materialsRemaining + toolRentalsPurchases + timeCost + scrapErrorCost + codeRiskCost
    );

    // 5. Contractor Rescue Turnkey Bid
    // Pro uses wholesale materials + ~1.8x labor markup, but completes in 1/3 of the time
    const proMaterialCost = Math.round(materialsRemaining * 0.90); // trade discount
    const tradeComplexityMultiplier =
      1.0 +
      (hasComplexTrades.plumbing ? 0.20 : 0) +
      (hasComplexTrades.electrical ? 0.18 : 0) +
      (hasComplexTrades.tileWaterproofing ? 0.22 : 0);

    const proLaborHours = Math.max(16, Math.round(diyHoursRemaining * 0.32)); // Pros work 3.1x faster
    const proHourlyRate = 85;
    const proLaborCost = Math.round(proLaborHours * proHourlyRate * tradeComplexityMultiplier);
    const contractorTakeoverCost = Math.round(proMaterialCost + proLaborCost + 650); // permit/cleanup

    // 6. Timeline Comparison
    // DIY weekend hours: 8 hours per weekend = diyHoursRemaining / 8 weekends
    const diyWeekendsRemaining = Math.max(1, Math.ceil(diyHoursRemaining / 8));
    const proBusinessDays = Math.max(2, Math.ceil(proLaborHours / 7));

    // 7. Psychological Burnout Index (0 - 100)
    const burnoutRaw =
      frustrationScore * 6 +
      Math.min(30, stallDurationMonths * 3) +
      (diyWeekendsRemaining > 6 ? 15 : diyWeekendsRemaining * 2) +
      (timeCost > 4000 ? 10 : 0);
    const burnoutIndex = Math.min(100, Math.max(10, Math.round(burnoutRaw)));

    // Recommendation
    let verdict: { title: string; desc: string; color: string; badge: string } = {
      title: 'Hire a Licensed Pro to Rescue & Finish',
      desc: 'When factoring in your personal hourly value, scrap errors, and the 10+ weekends lost, hiring a licensed contractor actually costs LESS or breaks even while eliminating massive stress.',
      color: 'rose',
      badge: 'PRO RESCUE RECOMMENDED',
    };

    if (burnoutIndex < 40 && trueDiyCost < contractorTakeoverCost * 0.75) {
      verdict = {
        title: 'Safe to Finish DIY (With Guardrails)',
        desc: 'Your burnout score is manageable and your opportunity cost is reasonable. Focus only on finishing the remaining non-code trades and get it across the line.',
        color: 'emerald',
        badge: 'DIY FINISHABLE',
      };
    } else if (burnoutIndex < 65) {
      verdict = {
        title: 'Hybrid Finish: Sub-Contract The Hard Trades',
        desc: 'Keep the paint and trim for yourself, but hire a licensed sub for plumbing rough-in or tile waterproofing to protect your home from water damage.',
        color: 'amber',
        badge: 'HYBRID TAKEOVER RECOMMENDED',
      };
    }

    return {
      timeCost,
      scrapErrorCost,
      codeRiskCost,
      trueDiyCost,
      contractorTakeoverCost,
      diyWeekendsRemaining,
      proBusinessDays,
      proLaborHours,
      burnoutIndex,
      verdict,
    };
  }, [
    materialsRemaining,
    toolRentalsPurchases,
    hourlyWage,
    diyHoursRemaining,
    hasComplexTrades,
    diyScrapPercent,
    frustrationScore,
    stallDurationMonths,
  ]);

  const handleSave = () => {
    if (onSaveEstimate) {
      onSaveEstimate(
        {
          costToFinishContractor: calculation.contractorTakeoverCost,
          costToFinishDIY: calculation.trueDiyCost,
          diySavings: calculation.trueDiyCost - calculation.contractorTakeoverCost,
          effectiveSqFt: 0,
          remainingPercentage: 50,
          estimatedDaysToFinish: calculation.proBusinessDays,
        },
        `DIY Regret Analysis (${projectType.toUpperCase()})`
      );
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleRequestBids = () => {
    if (onRequestBids) {
      onRequestBids({
        costToFinishContractor: calculation.contractorTakeoverCost,
        costToFinishDIY: calculation.trueDiyCost,
        estimatedDaysToFinish: calculation.proBusinessDays,
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-10 shadow-xs space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider border border-amber-200">
              High Traffic Behavioral Calculator
            </span>
            <span className="px-3 py-1 rounded-md bg-rose-100 text-rose-900 text-xs font-black uppercase tracking-wider border border-rose-200">
              Burnout Index: {calculation.burnoutIndex}/100
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            DIY Project Regret & Pro-Rescue Calculator
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium mt-1.5 max-w-3xl leading-relaxed">
            Stuck mid-project with half-hung drywall, open plumbing, or weekend exhaustion? Calculate the true total cost of finishing it yourself—including your hourly wage, tool rentals, and rework risk—versus hiring a licensed contractor to take it off your hands.
          </p>
        </div>

        {/* Project Type quick buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {[
            { id: 'bathroom', label: 'Bathroom Gut' },
            { id: 'kitchen', label: 'Kitchen Stalled' },
            { id: 'basement', label: 'Basement Finish' },
            { id: 'flooring', label: 'Tile / Flooring' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setProjectType(item.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black tracking-tight transition ${
                projectType === item.id
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Inputs Left (7 cols), Comparison Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Inputs Column */}
        <div className="lg:col-span-7 space-y-7">
          {/* Section 1: Financials */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] font-black flex items-center justify-center">1</span>
              <span>Remaining Material & Tool Expenses</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  Remaining Materials Still to Buy ($)
                </label>
                <input
                  type="number"
                  step="100"
                  value={materialsRemaining}
                  onChange={(e) => setMaterialsRemaining(Math.max(100, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-black text-slate-950 focus:bg-white focus:outline-blue-600"
                />
                <p className="text-[11px] text-slate-500 font-medium mt-1">Drywall, tile, mortar, grout, paint, fixtures</p>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  Tool Rentals & Specialized Gear ($)
                </label>
                <input
                  type="number"
                  step="50"
                  value={toolRentalsPurchases}
                  onChange={(e) => setToolRentalsPurchases(Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-black text-slate-950 focus:bg-white focus:outline-blue-600"
                />
                <p className="text-[11px] text-slate-500 font-medium mt-1">Wet tile saw, drywall jack, nailers, compressor</p>
              </div>
            </div>
          </div>

          {/* Section 2: Opportunity Cost & Labor Hours */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] font-black flex items-center justify-center">2</span>
              <span>Your Personal Time Value (Opportunity Cost)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  Your Hourly Earnings Rate ($/hr)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    min="15"
                    max="500"
                    value={hourlyWage}
                    onChange={(e) => setHourlyWage(Math.max(10, Number(e.target.value)))}
                    className="w-full pl-8 pr-14 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-black text-slate-950 focus:bg-white focus:outline-blue-600"
                  />
                  <span className="absolute right-3.5 top-3 text-xs font-black text-slate-400 uppercase">/ hr</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-1">What your time is worth at work or with family</p>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  Estimated DIY Hours Left
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="10"
                    max="500"
                    step="10"
                    value={diyHoursRemaining}
                    onChange={(e) => setDiyHoursRemaining(Math.max(5, Number(e.target.value)))}
                    className="w-full pl-4 pr-16 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-black text-slate-950 focus:bg-white focus:outline-blue-600"
                  />
                  <span className="absolute right-3.5 top-3 text-xs font-black text-slate-400 uppercase">hours</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  Equals <strong>{calculation.diyWeekendsRemaining} full weekends</strong> (8 hrs/weekend)
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: High-Risk Trades Checkbox */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] font-black flex items-center justify-center">3</span>
              <span>High-Risk Trades Requiring Inspection</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Checking trades below adds estimated code failure risk and professional rework protection insurance.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'plumbing', label: 'Plumbing (Drain, Waste, Vent & PEX)', risk: '+$750 leak hazard' },
                { key: 'electrical', label: 'Electrical & Breaker Wiring', risk: '+$850 inspection hazard' },
                { key: 'tileWaterproofing', label: 'Tile Shower Pan Waterproofing', risk: '+$900 subfloor mold hazard' },
                { key: 'drywallMud', label: 'Drywall Taping & Level 4 Finish', risk: '+$400 waviness repair' },
              ].map((trade) => (
                <label
                  key={trade.key}
                  className="flex items-start gap-2.5 p-3 rounded-xl border-2 border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={(hasComplexTrades as any)[trade.key]}
                    onChange={(e) =>
                      setHasComplexTrades({
                        ...hasComplexTrades,
                        [trade.key]: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block leading-snug">{trade.label}</span>
                    <span className="text-[11px] text-amber-700 font-black">{trade.risk}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Section 4: Burnout & Stalled Duration */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  How Long Has This Project Been Stalled?
                </label>
                <select
                  value={stallDurationMonths}
                  onChange={(e) => setStallDurationMonths(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-950 focus:bg-white focus:outline-blue-600"
                >
                  <option value={1}>Under 1 Month (Still somewhat fresh)</option>
                  <option value={3}>1 - 3 Months (Losing momentum)</option>
                  <option value={6}>3 - 6 Months (Living in dust/chaos)</option>
                  <option value={12}>6+ Months (Relationship strain / stalled)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  Frustration / Exhaustion Level (1-10)
                </label>
                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={frustrationScore}
                    onChange={(e) => setFrustrationScore(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                  <span className="text-lg font-black text-slate-950 w-8 text-right">
                    {frustrationScore}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Comparison Card */}
        <div className="lg:col-span-5 space-y-6">
          {/* Verdict Box */}
          <div
            className={`p-6 sm:p-7 rounded-3xl border-2 shadow-lg space-y-4 ${
              calculation.verdict.color === 'rose'
                ? 'bg-rose-950 text-white border-rose-800'
                : calculation.verdict.color === 'amber'
                ? 'bg-amber-950 text-white border-amber-800'
                : 'bg-emerald-950 text-white border-emerald-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-white/15 text-white">
                {calculation.verdict.badge}
              </span>
              <span className="text-xs font-black text-white/80">
                Burnout: {calculation.burnoutIndex}/100
              </span>
            </div>

            <h3 className="text-2xl font-black text-white tracking-tight leading-snug">
              {calculation.verdict.title}
            </h3>

            <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed">
              {calculation.verdict.desc}
            </p>

            {/* Time Comparison Badges */}
            <div className="pt-2 grid grid-cols-2 gap-3 text-center">
              <div className="bg-black/30 p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] uppercase font-bold text-white/60 block">DIY Finish Time</span>
                <span className="text-xl font-black text-amber-300">
                  {calculation.diyWeekendsRemaining} Weekends
                </span>
                <span className="text-[10px] text-white/60 block mt-0.5">({calculation.diyHoursRemaining} hours)</span>
              </div>
              <div className="bg-black/30 p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] uppercase font-bold text-white/60 block">Pro Rescue Time</span>
                <span className="text-xl font-black text-emerald-300">
                  ~{calculation.proBusinessDays} Days
                </span>
                <span className="text-[10px] text-white/60 block mt-0.5">Done by next week</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-3 space-y-2">
              <button
                onClick={handleRequestBids}
                className="w-full py-3.5 px-4 bg-white text-slate-950 hover:bg-slate-100 font-black text-xs sm:text-sm tracking-tight rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <span>Request 3 Contractor Rescue Bids</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

              <button
                onClick={handleSave}
                className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 border border-white/15"
              >
                <Bookmark className="w-3.5 h-3.5 text-blue-300" />
                <span>{savedSuccess ? 'Saved to Browser!' : 'Save Regret Audit'}</span>
              </button>
            </div>
          </div>

          {/* Dollar Cost Breakdown Side-by-Side */}
          <div className="bg-slate-50 rounded-2xl border-2 border-slate-200 p-5 space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 block border-b border-slate-200 pb-2">
              The Sobering Dollar Breakdown
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Direct Materials:</span>
                <span className="font-bold text-slate-900">{formatCurrency(materialsRemaining)}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Tool Purchases & Rentals:</span>
                <span className="font-bold text-slate-900">{formatCurrency(toolRentalsPurchases)}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Material Scrap & Cut Waste ({diyScrapPercent}%):</span>
                <span className="font-bold text-slate-900">{formatCurrency(calculation.scrapErrorCost)}</span>
              </div>
              <div className="flex justify-between text-amber-800 font-medium">
                <span>Inspection & Code Failure Risk:</span>
                <span className="font-black text-amber-800">+{formatCurrency(calculation.codeRiskCost)}</span>
              </div>
              <div className="flex justify-between text-rose-800 font-medium">
                <span>Your Lost Personal Time ({calculation.diyHoursRemaining} hrs @ ${hourlyWage}/hr):</span>
                <span className="font-black text-rose-900">+{formatCurrency(calculation.timeCost)}</span>
              </div>
            </div>

            <div className="pt-3 border-t-2 border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black uppercase text-slate-500 block">True DIY Total Cost:</span>
                <span className="text-xl font-black text-rose-900">{formatCurrency(calculation.trueDiyCost)}</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-black uppercase text-slate-500 block">Licensed Pro Bid:</span>
                <span className="text-xl font-black text-blue-700">{formatCurrency(calculation.contractorTakeoverCost)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
