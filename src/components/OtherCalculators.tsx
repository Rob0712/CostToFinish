import React, { useState } from 'react';
import {
  GraduationCap,
  TrendingDown,
  Hammer,
  Car,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Clock,
  Sparkles,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { formatCurrency } from '../utils/calculationUtils';

interface Props {
  initialAppId?: string;
  onSwitchToHomeReno: () => void;
}

export const OtherCalculators: React.FC<Props> = ({ initialAppId = 'degree-completion', onSwitchToHomeReno }) => {
  const [activeTab, setActiveTab] = useState<'degree' | 'debt' | 'diy-regret' | 'car'>(
    initialAppId === 'debt-freedom'
      ? 'debt'
      : initialAppId === 'diy-regret'
      ? 'diy-regret'
      : initialAppId === 'car-restoration'
      ? 'car'
      : 'degree'
  );

  // 1. Degree Calculator State
  const [creditsEarned, setCreditsEarned] = useState<number>(78);
  const [creditsTotal, setCreditsTotal] = useState<number>(120);
  const [costPerCredit, setCostPerCredit] = useState<number>(460);
  const [feesPerSemester, setFeesPerSemester] = useState<number>(850);
  const [creditsPerSemester, setCreditsPerSemester] = useState<number>(15);
  const [loanInterestRate, setLoanInterestRate] = useState<number>(6.2);

  // Degree Math
  const remainingCredits = Math.max(0, creditsTotal - creditsEarned);
  const remainingSemesters = Math.ceil(remainingCredits / (creditsPerSemester || 1));
  const baseTuitionRemaining = remainingCredits * costPerCredit;
  const totalFeesRemaining = remainingSemesters * feesPerSemester;
  const estimatedLoanInterest = Math.round((baseTuitionRemaining * (loanInterestRate / 100) * (remainingSemesters * 0.5)));
  const totalCostToGraduate = baseTuitionRemaining + totalFeesRemaining + estimatedLoanInterest;
  const progressPercent = Math.min(100, Math.round((creditsEarned / creditsTotal) * 100));

  // 2. Debt Freedom State
  const [debtBalance, setDebtBalance] = useState<number>(26500);
  const [interestApr, setInterestApr] = useState<number>(18.9);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(750);
  const [extraPayment, setExtraPayment] = useState<number>(150);

  // Debt Freedom Math (Amortization approximation)
  const monthlyRate = (interestApr / 100) / 12;
  const totalMonthlyCommitment = monthlyPayment + extraPayment;
  // n = -ln(1 - (r * P)/M) / ln(1 + r)
  let monthsToPayoff = 36;
  let totalInterestCost = 0;
  if (totalMonthlyCommitment > debtBalance * monthlyRate) {
    monthsToPayoff = Math.ceil(
      -Math.log(1 - (monthlyRate * debtBalance) / totalMonthlyCommitment) / Math.log(1 + monthlyRate)
    );
    // Rough interest calculation
    totalInterestCost = Math.round((totalMonthlyCommitment * monthsToPayoff) - debtBalance);
  } else {
    monthsToPayoff = 120;
    totalInterestCost = Math.round(debtBalance * 1.5);
  }
  const totalCostToFinishDebt = debtBalance + Math.max(0, totalInterestCost);

  // 3. DIY Regret Calculator State
  const [diyProjectType, setDiyProjectType] = useState<string>('Bathroom Tile & Shower Remodel');
  const [diyCurrentProgress, setDiyCurrentProgress] = useState<number>(45);
  const [spentSoFar, setSpentSoFar] = useState<number>(1950);
  const [diyRemainingMaterials, setDiyRemainingMaterials] = useState<number>(1400);
  const [diyEstimatedHours, setDiyEstimatedHours] = useState<number>(55);
  const [userHourlyWorth, setUserHourlyWorth] = useState<number>(55);
  const [toolRentalCosts, setToolRentalCosts] = useState<number>(350);
  const [proQuoteToFinish, setProQuoteToFinish] = useState<number>(3800);

  // DIY Regret Math
  const personalTimeCost = diyEstimatedHours * userHourlyWorth;
  const realDiyTrueCost = spentSoFar + diyRemainingMaterials + toolRentalCosts + personalTimeCost;
  const proTotalCost = spentSoFar + proQuoteToFinish;
  const regretScore = Math.min(
    100,
    Math.round(((100 - diyCurrentProgress) * 0.4) + (personalTimeCost > 2000 ? 30 : 15) + (diyEstimatedHours > 40 ? 30 : 10))
  );

  // 4. Car Restoration State
  const [carName, setCarName] = useState<string>('1969 Ford Mustang Fastback');
  const [purchasePrice, setPurchasePrice] = useState<number>(12000);
  const [bodyAndPaintNeeded, setBodyAndPaintNeeded] = useState<number>(9500);
  const [engineTransmissionNeeded, setEngineTransmissionNeeded] = useState<number>(6800);
  const [interiorUpholsteryNeeded, setInteriorUpholsteryNeeded] = useState<number>(3200);
  const [wiringAndSuspensionNeeded, setWiringAndSuspensionNeeded] = useState<number>(4100);
  const [projectedRoadReadyValue, setProjectedRoadReadyValue] = useState<number>(45000);

  const totalCarRemainingCost = bodyAndPaintNeeded + engineTransmissionNeeded + interiorUpholsteryNeeded + wiringAndSuspensionNeeded;
  const totalCarInvested = purchasePrice + totalCarRemainingCost;
  const projectedNetEquity = projectedRoadReadyValue - totalCarInvested;

  return (
    <div className="bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Tabs Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-blue-600">Specialized Engines</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight mt-1">
              Project Completion Calculators
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onSwitchToHomeReno}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-extrabold text-slate-800 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition shadow-xs"
            >
              ← Back to Home Reno
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8 bg-slate-200/80 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('degree')}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-sm font-black tracking-tight transition ${
              activeTab === 'degree'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4 stroke-[2.5]" />
            <span>Degree Completion</span>
          </button>
          <button
            onClick={() => setActiveTab('debt')}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-sm font-black tracking-tight transition ${
              activeTab === 'debt'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingDown className="w-4 h-4 stroke-[2.5]" />
            <span>Debt Freedom Date</span>
          </button>
          <button
            onClick={() => setActiveTab('diy-regret')}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-sm font-black tracking-tight transition ${
              activeTab === 'diy-regret'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Hammer className="w-4 h-4 stroke-[2.5]" />
            <span>DIY Regret Meter</span>
          </button>
          <button
            onClick={() => setActiveTab('car')}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-sm font-black tracking-tight transition ${
              activeTab === 'car'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Car className="w-4 h-4 stroke-[2.5]" />
            <span>Classic Car Build</span>
          </button>
        </div>

        {/* 1. DEGREE COMPLETION TAB */}
        {activeTab === 'degree' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border-2 border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-black text-blue-600 tracking-wider uppercase">College & Grad School</span>
                <h3 className="text-2xl font-black text-slate-950 mt-1 tracking-tight">Degree "Final Mile" Tuition & Debt Estimator</h3>
                <p className="text-sm text-slate-600 font-medium mt-1">
                  Targeted for students who already earned credits and want to know the true financial cost to graduate.
                </p>
              </div>

              {/* Progress visual */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span className="uppercase tracking-wider">Degree Completion Status</span>
                  <span className="text-blue-600 font-black">{progressPercent}% Completed ({creditsEarned}/{creditsTotal} credits)</span>
                </div>
                <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden border border-slate-200">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Credits Earned So Far
                  </label>
                  <input
                    type="number"
                    value={creditsEarned}
                    onChange={(e) => setCreditsEarned(Math.max(0, Number(e.target.value)))}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-bold text-slate-950 focus:outline-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Total Credits for Graduation
                  </label>
                  <input
                    type="number"
                    value={creditsTotal}
                    onChange={(e) => setCreditsTotal(Math.max(1, Number(e.target.value)))}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-bold text-slate-950 focus:outline-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Tuition Cost Per Credit ($)
                  </label>
                  <input
                    type="number"
                    value={costPerCredit}
                    onChange={(e) => setCostPerCredit(Math.max(0, Number(e.target.value)))}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-bold text-slate-950 focus:outline-blue-600 focus:bg-white"
                  />
                  <p className="text-xs text-slate-500 font-medium mt-1">In-state avg: $380-$600 | Private: $900-$1,400</p>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Credits Planned Per Semester
                  </label>
                  <input
                    type="number"
                    value={creditsPerSemester}
                    onChange={(e) => setCreditsPerSemester(Math.max(1, Number(e.target.value)))}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-bold text-slate-950 focus:outline-blue-600 focus:bg-white"
                  />
                  <p className="text-xs text-slate-500 font-medium mt-1">12-15 is standard full-time load</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Mandatory Fees per Semester ($)
                  </label>
                  <input
                    type="number"
                    value={feesPerSemester}
                    onChange={(e) => setFeesPerSemester(Math.max(0, Number(e.target.value)))}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-bold text-slate-950 focus:outline-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Loan Interest Rate (% APR)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={loanInterestRate}
                    onChange={(e) => setLoanInterestRate(Math.max(0, Number(e.target.value)))}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-bold text-slate-950 focus:outline-blue-600 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Results Sidebar */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-950 text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-800">
                <span className="text-xs font-black tracking-wider uppercase text-emerald-400">Total Cost to Graduate</span>
                <div className="text-4xl sm:text-5xl font-black text-white mt-2 tracking-tight">
                  {formatCurrency(totalCostToGraduate)}
                </div>
                <p className="text-xs text-slate-400 font-medium mt-1.5">
                  Remaining balance to cross the commencement stage
                </p>

                <div className="mt-6 pt-6 border-t border-slate-800 space-y-3 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span className="font-medium">Remaining Credits:</span>
                    <span className="font-black text-white">{remainingCredits} credits</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="font-medium">Semesters Needed:</span>
                    <span className="font-black text-white">{remainingSemesters} semesters (~{Math.round(remainingSemesters * 4)} mos)</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="font-medium">Direct Tuition:</span>
                    <span className="font-bold text-slate-200">{formatCurrency(baseTuitionRemaining)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="font-medium">Campus & Tech Fees:</span>
                    <span className="font-bold text-slate-200">{formatCurrency(totalFeesRemaining)}</span>
                  </div>
                  <div className="flex justify-between text-amber-400 font-medium">
                    <span className="font-semibold">Projected Loan Interest:</span>
                    <span className="font-black">+{formatCurrency(estimatedLoanInterest)}</span>
                  </div>
                </div>

                <div className="mt-6 bg-slate-900 p-4 rounded-xl text-xs text-slate-300 border border-slate-800 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="text-white font-black">Pro-tip:</strong> Taking 3 credits during summer intercession can save up to 1 full semester of campus tech fees ($850) and get you employed 4 months sooner.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. DEBT FREEDOM TAB */}
        {activeTab === 'debt' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border-2 border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-black text-emerald-600 tracking-wider uppercase">Fintech Freedom Engine</span>
                <h3 className="text-2xl font-black text-slate-950 mt-1 tracking-tight">Debt "Cost to Finish" & Freedom Date</h3>
                <p className="text-sm text-slate-600 font-medium mt-1">
                  Instead of just staring at the balance, calculate the exact real-world dollar amount (principal + interest) needed to hit zero.
                </p>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  Current Remaining Debt Principal ($)
                </label>
                <input
                  type="number"
                  value={debtBalance}
                  onChange={(e) => setDebtBalance(Math.max(100, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xl font-black text-slate-950 focus:outline-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Average APR Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestApr}
                    onChange={(e) => setInterestApr(Math.max(0.1, Number(e.target.value)))}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-bold text-slate-950 focus:outline-blue-600 focus:bg-white"
                  />
                  <p className="text-xs text-slate-500 font-medium mt-1">Credit cards avg 21% | Personal loans avg 11%</p>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Current Monthly Payment ($)
                  </label>
                  <input
                    type="number"
                    value={monthlyPayment}
                    onChange={(e) => setMonthlyPayment(Math.max(25, Number(e.target.value)))}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-bold text-slate-950 focus:outline-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                <label className="block text-xs font-black text-emerald-950 uppercase tracking-wider mb-1.5">
                  Accelerated Extra Monthly Push ($)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="25"
                    value={extraPayment}
                    onChange={(e) => setExtraPayment(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <span className="text-lg font-black text-emerald-900 shrink-0 w-24 text-right">
                    +${extraPayment}/mo
                  </span>
                </div>
                <p className="text-xs text-emerald-800 font-medium mt-1">
                  Adjust slider to see how small daily savings crush the finish date.
                </p>
              </div>
            </div>

            {/* Debt Results Sidebar */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-950 text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-800">
                <span className="text-xs font-black tracking-wider uppercase text-emerald-400">Total Dollar Cost to Finish</span>
                <div className="text-4xl sm:text-5xl font-black text-white mt-2 tracking-tight">
                  {formatCurrency(totalCostToFinishDebt)}
                </div>
                <p className="text-xs text-slate-400 font-medium mt-1.5">
                  Principal plus accumulated interest charges
                </p>

                <div className="mt-6 pt-6 border-t border-slate-800 space-y-3 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span className="font-medium">Debt Freedom Timeline:</span>
                    <span className="font-black text-emerald-400">{monthsToPayoff} months ({Math.floor(monthsToPayoff / 12)} yrs {monthsToPayoff % 12} mos)</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="font-medium">Original Principal:</span>
                    <span className="font-bold text-slate-200">{formatCurrency(debtBalance)}</span>
                  </div>
                  <div className="flex justify-between text-amber-400">
                    <span className="font-medium">Total Interest Tax:</span>
                    <span className="font-black">+{formatCurrency(totalInterestCost)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="font-medium">Monthly Cashflow Freed:</span>
                    <span className="font-black text-white">{formatCurrency(totalMonthlyCommitment)}/mo</span>
                  </div>
                </div>

                <div className="mt-6 bg-slate-900 p-4 rounded-xl text-xs text-slate-300 border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                  <p className="leading-relaxed">
                    By committing an extra <strong className="text-white font-bold">${extraPayment}/month</strong>, you eliminate months of interest drag and reach total financial freedom significantly earlier.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. DIY REGRET METER TAB */}
        {activeTab === 'diy-regret' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border-2 border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-black text-amber-600 tracking-wider uppercase">DIY Reality Check</span>
                <h3 className="text-2xl font-black text-slate-950 mt-1 tracking-tight">The DIY Project "Regret" Calculator</h3>
                <p className="text-sm text-slate-600 font-medium mt-1">
                  Compare the cost of finishing it yourself (materials + tool rentals + your hourly worth) versus paying a licensed pro to take over.
                </p>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  Project Description
                </label>
                <input
                  type="text"
                  value={diyProjectType}
                  onChange={(e) => setDiyProjectType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-bold text-slate-950 focus:outline-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  <span>Current Project Completion</span>
                  <span className="text-blue-600">{diyCurrentProgress}% Done</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={diyCurrentProgress}
                  onChange={(e) => setDiyCurrentProgress(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-500 font-medium mt-1">
                  <span>Demo started</span>
                  <span className="font-bold text-slate-700">The 70% Burnout Zone</span>
                  <span>Almost done</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Spent So Far ($)
                  </label>
                  <input
                    type="number"
                    value={spentSoFar}
                    onChange={(e) => setSpentSoFar(Math.max(0, Number(e.target.value)))}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-bold text-slate-950 focus:outline-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Remaining Materials ($)
                  </label>
                  <input
                    type="number"
                    value={diyRemainingMaterials}
                    onChange={(e) => setDiyRemainingMaterials(Math.max(0, Number(e.target.value)))}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-bold text-slate-950 focus:outline-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Your Hours Left
                  </label>
                  <input
                    type="number"
                    value={diyEstimatedHours}
                    onChange={(e) => setDiyEstimatedHours(Math.max(1, Number(e.target.value)))}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-bold text-slate-950 focus:outline-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Your Hourly Rate ($/hr)
                  </label>
                  <input
                    type="number"
                    value={userHourlyWorth}
                    onChange={(e) => setUserHourlyWorth(Math.max(15, Number(e.target.value)))}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-bold text-slate-950 focus:outline-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Tool Rentals ($)
                  </label>
                  <input
                    type="number"
                    value={toolRentalCosts}
                    onChange={(e) => setToolRentalCosts(Math.max(0, Number(e.target.value)))}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-bold text-slate-950 focus:outline-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  Pro Contractor Quote to Finish ($)
                </label>
                <input
                  type="number"
                  value={proQuoteToFinish}
                  onChange={(e) => setProQuoteToFinish(Math.max(100, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-bold text-slate-950 focus:outline-blue-600 focus:bg-white"
                />
              </div>
            </div>

            {/* DIY Regret Results Sidebar */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-950 text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-wider uppercase text-amber-400">Regret Index Score</span>
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                    regretScore > 65 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {regretScore > 65 ? 'High Burnout Warning' : 'Manageable Weekend Task'}
                  </span>
                </div>

                <div className="flex items-baseline gap-3 mt-3">
                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                    {regretScore}<span className="text-2xl text-slate-500 font-bold">/100</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-800 space-y-3 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span className="font-medium">True DIY Cost (With Your Time):</span>
                    <span className="font-black text-amber-300">{formatCurrency(realDiyTrueCost)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="font-medium">Cash Outlay Only (DIY Materials):</span>
                    <span className="font-bold text-slate-200">{formatCurrency(spentSoFar + diyRemainingMaterials + toolRentalCosts)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="font-medium">Pro Contractor Takeover:</span>
                    <span className="font-black text-white">{formatCurrency(proTotalCost)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="font-medium">Opportunity Cost of Time:</span>
                    <span className="text-slate-400 font-medium">{diyEstimatedHours} hrs × ${userHourlyWorth}/hr = {formatCurrency(personalTimeCost)}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl border bg-slate-900 border-slate-800 text-xs">
                  <div className="font-black text-white mb-1.5 flex items-center gap-1.5 text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-400 stroke-[2.5]" />
                    <span>The Recommendation:</span>
                  </div>
                  <p className="text-slate-300 font-medium leading-relaxed">
                    {realDiyTrueCost > proTotalCost ? (
                      <span className="text-amber-200">
                        <strong className="text-white font-bold">Hire the Pro:</strong> Your personal time ({diyEstimatedHours} hours) and tool rentals exceed the cost of professional execution. Let them handle the final mile warranty.
                      </span>
                    ) : (
                      <span className="text-emerald-200">
                        <strong className="text-white font-bold">Push to Finish:</strong> You are saving cash and your project is still within reasonable self-management hours. Allocate two dedicated weekend mornings.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. CLASSIC CAR RESTORATION TAB */}
        {activeTab === 'car' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border-2 border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-black text-blue-600 tracking-wider uppercase">Automotive Hobbyist</span>
                <h3 className="text-2xl font-black text-slate-950 mt-1 tracking-tight">Classic Car "Barn Find to Road-Ready" Ledger</h3>
                <p className="text-sm text-slate-600 font-medium mt-1">
                  Car projects are notorious for endless budget creep. Put down the real numbers for paint, drivetrain, and upholstery.
                </p>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  Vehicle Build Name
                </label>
                <input
                  type="text"
                  value={carName}
                  onChange={(e) => setCarName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-bold text-slate-950 focus:outline-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Original Purchase / Barn Find ($)
                  </label>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Math.max(0, Number(e.target.value)))}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-bold text-slate-950 focus:outline-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Target Road-Ready Appraisal ($)
                  </label>
                  <input
                    type="number"
                    value={projectedRoadReadyValue}
                    onChange={(e) => setProjectedRoadReadyValue(Math.max(0, Number(e.target.value)))}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-bold text-slate-950 focus:outline-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Bodywork, Rust Repair & Paint ($)
                  </label>
                  <input
                    type="number"
                    value={bodyAndPaintNeeded}
                    onChange={(e) => setBodyAndPaintNeeded(Math.max(0, Number(e.target.value)))}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-bold text-slate-950 focus:outline-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Engine & Drivetrain Rebuild ($)
                  </label>
                  <input
                    type="number"
                    value={engineTransmissionNeeded}
                    onChange={(e) => setEngineTransmissionNeeded(Math.max(0, Number(e.target.value)))}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-bold text-slate-950 focus:outline-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Interior, Seats & Upholstery ($)
                  </label>
                  <input
                    type="number"
                    value={interiorUpholsteryNeeded}
                    onChange={(e) => setInteriorUpholsteryNeeded(Math.max(0, Number(e.target.value)))}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-bold text-slate-950 focus:outline-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Wiring, Brakes & Suspension ($)
                  </label>
                  <input
                    type="number"
                    value={wiringAndSuspensionNeeded}
                    onChange={(e) => setWiringAndSuspensionNeeded(Math.max(0, Number(e.target.value)))}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-bold text-slate-950 focus:outline-blue-600 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Car Results Sidebar */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-950 text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-800">
                <span className="text-xs font-black tracking-wider uppercase text-emerald-400">Cost to Make Road-Ready</span>
                <div className="text-4xl sm:text-5xl font-black text-white mt-2 tracking-tight">
                  {formatCurrency(totalCarRemainingCost)}
                </div>
                <p className="text-xs text-slate-400 font-medium mt-1.5">
                  Remaining parts, specialist labor, and shop supplies
                </p>

                <div className="mt-6 pt-6 border-t border-slate-800 space-y-3 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span className="font-medium">Total Sunk Investment:</span>
                    <span className="font-black text-white">{formatCurrency(totalCarInvested)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="font-medium">Projected Finished Value:</span>
                    <span className="font-black text-emerald-400">{formatCurrency(projectedRoadReadyValue)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="font-medium">Projected Net Equity:</span>
                    <span className={`font-black ${projectedNetEquity >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {projectedNetEquity >= 0 ? '+' : ''}{formatCurrency(projectedNetEquity)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 bg-slate-900 p-4 rounded-xl text-xs text-slate-300 border border-slate-800 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    {projectedNetEquity >= 0
                      ? 'Solid numbers! Your projected finished value exceeds purchase and finishing spend. Keep receipts for Haggerty insurance appraisal.'
                      : 'Attention: You are entering a passion-over-profit zone. If keeping as a forever cruiser, proceed; if flipping, scale back on paint or custom upholstery.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
