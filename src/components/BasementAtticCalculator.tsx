import React, { useState, useMemo } from 'react';
import {
  Layers,
  CheckCircle2,
  DollarSign,
  Clock,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Download,
  Bookmark,
  ArrowRight,
  Sparkles,
  Info,
  Sliders,
  Maximize2,
  Thermometer,
  Droplets,
  Wind
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/calculationUtils';
import { LOCATION_MULTIPLIERS } from '../data/homeRenoData';
import { HomeRenoResult } from '../types';

interface Props {
  onSaveEstimate?: (result: any, title: string) => void;
  onRequestBids?: (summary: any) => void;
  onOpenReportModal?: (summary: any) => void;
}

export const BasementAtticCalculator: React.FC<Props> = ({
  onSaveEstimate,
  onRequestBids,
  onOpenReportModal,
}) => {
  // 1. Space Type Selection
  const [spaceType, setSpaceType] = useState<'basement' | 'attic'>('basement');
  const [subType, setSubType] = useState<string>('subterranean'); // subterranean, walkout, daylight | walkup, kneewall, dormer

  // 2. Geometry & Codes
  const [squareFootage, setSquareFootage] = useState<number>(850);
  const [ceilingHeightInches, setCeilingHeightInches] = useState<number>(90); // 7'6" (IRC requires 84" / 7'0")
  const [locationId, setLocationId] = useState<string>('us-nat');

  // 3. Structural & Environmental
  const [egressOption, setEgressOption] = useState<'needed' | 'existing' | 'not-bedroom'>('needed');
  const [waterproofingOption, setWaterproofingOption] = useState<'full-french' | 'vapor-barrier' | 'already-dry'>('full-french');
  const [subfloorType, setSubfloorType] = useState<'dricore' | 'plywood-xps' | 'direct-slab'>('dricore');
  const [hvacOption, setHvacOption] = useState<'mini-split' | 'extend-ducts' | 'baseboard'>('mini-split');
  const [insulationType, setInsulationType] = useState<'spray-foam' | 'rockwool-batts'>('spray-foam');

  // 4. Rooms & Plumbing
  const [bathroomType, setBathroomType] = useState<'none' | 'half' | 'full' | 'wetbar'>('full');
  const [hasRoughinPlumbing, setHasRoughinPlumbing] = useState<boolean>(false);
  const [numBedrooms, setNumBedrooms] = useState<number>(1);

  // 5. Finishing & Quality
  const [finishQuality, setFinishQuality] = useState<'spec' | 'standard' | 'luxury'>('standard');
  const [includePermits, setIncludePermits] = useState<boolean>(true);
  const [homeCurrentValue, setHomeCurrentValue] = useState<number>(425000);

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Location Multiplier
  const activeLocation = useMemo(() => {
    return LOCATION_MULTIPLIERS.find((l) => l.id === locationId) || LOCATION_MULTIPLIERS[0];
  }, [locationId]);

  // Code validation
  const meetsCeilingCode = ceilingHeightInches >= 84; // 7'0"
  const ceilingFeet = Math.floor(ceilingHeightInches / 12);
  const ceilingInchesRem = ceilingHeightInches % 12;

  // Cost Model Calculation
  const calculation = useMemo(() => {
    const locMult = activeLocation.multiplier;
    const qualMult = finishQuality === 'spec' ? 0.82 : finishQuality === 'luxury' ? 1.35 : 1.0;

    // Base framing, drywall, electrical, doors, trim, paint $/sqft
    const baseTradeSqft = spaceType === 'basement' ? 42 : 48; // Attics require more rafter handling and knee walls
    let baseFinishingCost = squareFootage * baseTradeSqft * locMult * qualMult;

    // Egress costs
    let egressCost = 0;
    if (spaceType === 'basement') {
      if (egressOption === 'needed') {
        // Concrete core cut, window well, gravel drain, egress window unit
        egressCost = 5200 * locMult;
      }
    } else {
      // Attic egress: permanent code staircase
      if (egressOption === 'needed') {
        egressCost = 6500 * locMult;
      }
    }

    // Waterproofing / Roof ventilation
    let moistureCost = 0;
    if (spaceType === 'basement') {
      if (waterproofingOption === 'full-french') {
        // Interior perimeter French drain + sump pump with battery backup
        moistureCost = 4800 * locMult;
      } else if (waterproofingOption === 'vapor-barrier') {
        moistureCost = 1600 * locMult;
      }
    } else {
      // Attic roof baffles, ridge vent ventilation, collar ties
      if (waterproofingOption === 'full-french') {
        moistureCost = 2800 * locMult; // collar ties & ventilation
      } else if (waterproofingOption === 'vapor-barrier') {
        moistureCost = 1200 * locMult;
      }
    }

    // Subfloor
    let subfloorCost = 0;
    if (subfloorType === 'dricore') {
      subfloorCost = squareFootage * 2.85 * locMult; // Dricore thermal subfloor
    } else if (subfloorType === 'plywood-xps') {
      subfloorCost = squareFootage * 2.10 * locMult;
    } else {
      subfloorCost = squareFootage * 0.90 * locMult; // Leveling compound
    }

    // HVAC conditioning
    let hvacCost = 0;
    if (hvacOption === 'mini-split') {
      // Multi-zone or single 18k BTU mini-split heat pump
      hvacCost = 4200 * locMult;
    } else if (hvacOption === 'extend-ducts') {
      // Tapping main trunk line & damper runs
      hvacCost = 2100 * locMult;
    } else {
      // Electric baseboard heaters
      hvacCost = 900 * locMult;
    }

    // Insulation
    let insulationCost = 0;
    if (insulationType === 'spray-foam') {
      insulationCost = squareFootage * 3.40 * locMult;
    } else {
      insulationCost = squareFootage * 1.65 * locMult;
    }

    // Bathroom / Plumbing
    let plumbingCost = 0;
    if (bathroomType === 'half') {
      plumbingCost = (hasRoughinPlumbing ? 4200 : 7500) * locMult * qualMult;
    } else if (bathroomType === 'full') {
      // Shower, toilet, vanity, tile, ejector pump if no rough-in
      plumbingCost = (hasRoughinPlumbing ? 7500 : 12800) * locMult * qualMult;
    } else if (bathroomType === 'wetbar') {
      plumbingCost = (hasRoughinPlumbing ? 3500 : 6200) * locMult * qualMult;
    }

    // Flooring (LVP or carpet)
    const flooringCost = squareFootage * (finishQuality === 'luxury' ? 8.5 : 4.5) * locMult;

    // Permits & Inspections
    const permitCost = includePermits ? (spaceType === 'basement' ? 1400 : 1600) * locMult : 0;

    // Total Turnkey Contractor Cost
    const totalContractorCost = Math.round(
      baseFinishingCost +
      egressCost +
      moistureCost +
      subfloorCost +
      hvacCost +
      insulationCost +
      plumbingCost +
      flooringCost +
      permitCost
    );

    // DIY Materials Cost (DIY saves ~42% of labor on framing/drywall/flooring, but still pays for MEP & specialized trades)
    const diySavings = Math.round(totalContractorCost * 0.38);
    const diyCost = totalContractorCost - diySavings;

    // Estimated work duration
    const estimatedWeeks = Math.max(4, Math.round((totalContractorCost / 12000) * 1.4));
    const estimatedDays = estimatedWeeks * 5;

    // Post-Finish Appraisal & Equity Math
    // Regional comp rule of thumb:
    // Finished basement adds ~55% to 70% of above-grade $/sqft value.
    // Finished attic adds ~70% to 85% of above-grade $/sqft value (if legal ceiling height).
    const estimatedAboveGradeSqFt = 2200;
    const baseHomeValPerSqFt = Math.round(homeCurrentValue / estimatedAboveGradeSqFt);
    const livingAreaCreditFactor = spaceType === 'basement' ? 0.62 : meetsCeilingCode ? 0.78 : 0.45;
    const appraisalUpliftPerSqFt = Math.round(baseHomeValPerSqFt * livingAreaCreditFactor);
    const totalAppraisalGain = Math.round(squareFootage * appraisalUpliftPerSqFt);
    const netEquityCreated = totalAppraisalGain - totalContractorCost;
    const roiPercentage = totalContractorCost > 0 ? Math.round((totalAppraisalGain / totalContractorCost) * 100) : 0;

    // Itemized breakdowns
    const breakdown = [
      { name: 'Framing, Drywall & Ceilings', cost: Math.round(baseFinishingCost * 0.55), icon: 'Layers' },
      { name: 'Electrical & Recessed Lighting', cost: Math.round(baseFinishingCost * 0.25), icon: 'Sparkles' },
      { name: 'Doors, Trim & Interior Paint', cost: Math.round(baseFinishingCost * 0.20), icon: 'CheckCircle2' },
      { name: spaceType === 'basement' ? 'Egress Window Well' : 'Code Stairway Access', cost: Math.round(egressCost), icon: 'Maximize2' },
      { name: spaceType === 'basement' ? 'French Drain / Moisture Sealing' : 'Roof Ventilation & Collar Ties', cost: Math.round(moistureCost), icon: 'Droplets' },
      { name: 'Thermal Subfloor Prep', cost: Math.round(subfloorCost), icon: 'Layers' },
      { name: 'HVAC Heating & Cooling', cost: Math.round(hvacCost), icon: 'Wind' },
      { name: 'Insulation Barrier', cost: Math.round(insulationCost), icon: 'Thermometer' },
      { name: bathroomType !== 'none' ? 'Plumbing & Bathroom Finish' : 'Plumbing Provisions', cost: Math.round(plumbingCost), icon: 'Droplets' },
      { name: 'Finished Flooring (LVP/Plank)', cost: Math.round(flooringCost), icon: 'Layers' },
      { name: 'Municipal Permits & Stamping', cost: Math.round(permitCost), icon: 'ShieldCheck' },
    ].filter((item) => item.cost > 0);

    return {
      totalContractorCost,
      diyCost,
      diySavings,
      estimatedWeeks,
      estimatedDays,
      totalAppraisalGain,
      netEquityCreated,
      roiPercentage,
      appraisalUpliftPerSqFt,
      breakdown,
      meetsCeilingCode,
    };
  }, [
    spaceType,
    subType,
    squareFootage,
    ceilingHeightInches,
    activeLocation,
    egressOption,
    waterproofingOption,
    subfloorType,
    hvacOption,
    insulationType,
    bathroomType,
    hasRoughinPlumbing,
    finishQuality,
    includePermits,
    homeCurrentValue,
    meetsCeilingCode,
  ]);

  const handleSave = () => {
    if (onSaveEstimate) {
      const payload: any = {
        costToFinishContractor: calculation.totalContractorCost,
        costToFinishDIY: calculation.diyCost,
        diySavings: calculation.diySavings,
        effectiveSqFt: squareFootage,
        remainingPercentage: 100,
        estimatedDaysToFinish: calculation.estimatedDays,
      };
      onSaveEstimate(payload, `${spaceType === 'basement' ? 'Basement' : 'Attic'} Completion (${squareFootage} sqft)`);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleRequestBids = () => {
    if (onRequestBids) {
      onRequestBids({
        costToFinishContractor: calculation.totalContractorCost,
        costToFinishDIY: calculation.diyCost,
        effectiveSqFt: squareFootage,
        remainingPercentage: 100,
        estimatedDaysToFinish: calculation.estimatedDays,
      });
    }
  };

  const handleOpenReport = () => {
    if (onOpenReportModal) {
      onOpenReportModal({
        costToFinishContractor: calculation.totalContractorCost,
        costToFinishDIY: calculation.diyCost,
        effectiveSqFt: squareFootage,
        remainingPercentage: 100,
        estimatedDaysToFinish: calculation.estimatedDays,
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-10 shadow-xs space-y-10">
      {/* Title & Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-black uppercase tracking-wider border border-blue-200">
              High Traffic Finishing Engine
            </span>
            <span className="px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider border border-emerald-200">
              Appraisal ROI: {calculation.roiPercentage}%
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Basement & Attic Completion Engine
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium mt-1.5 max-w-3xl leading-relaxed">
            Convert unconditioned subterranean or roof space into certified, code-compliant habitable living area. Calculate turnkey contractor finishing bids, egress wells, moisture mitigation, and immediate appraisal equity uplift.
          </p>
        </div>

        {/* Space Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl shrink-0 border-2 border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setSpaceType('basement')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black tracking-tight transition flex items-center gap-2 ${
              spaceType === 'basement'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-4 h-4 stroke-[2.5]" />
            <span>Unfinished Basement</span>
          </button>
          <button
            onClick={() => setSpaceType('attic')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black tracking-tight transition flex items-center gap-2 ${
              spaceType === 'attic'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/60'
            }`}
          >
            <Maximize2 className="w-4 h-4 stroke-[2.5]" />
            <span>Unfinished Attic</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs Left (7 cols), Results Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Dimensions & Ceiling Height */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">1</span>
              <span>Dimensions & Code Clearances</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  Raw Square Footage to Finish
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="200"
                    max="3500"
                    step="50"
                    value={squareFootage}
                    onChange={(e) => setSquareFootage(Math.max(100, Number(e.target.value)))}
                    className="w-full pl-4 pr-14 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg font-black text-slate-950 focus:bg-white focus:outline-blue-600"
                  />
                  <span className="absolute right-3.5 top-3.5 text-xs font-black text-slate-400 uppercase">
                    sq ft
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  Ceiling Clearance (Finished)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="72"
                    max="120"
                    value={ceilingHeightInches}
                    onChange={(e) => setCeilingHeightInches(Number(e.target.value))}
                    className="w-full pl-4 pr-20 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg font-black text-slate-950 focus:bg-white focus:outline-blue-600"
                  />
                  <span className="absolute right-3.5 top-3.5 text-xs font-black text-slate-500 uppercase">
                    {ceilingFeet}' {ceilingInchesRem}" ({ceilingHeightInches}")
                  </span>
                </div>
              </div>
            </div>

            {/* Ceiling Code Warning / Success */}
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs font-medium ${
                meetsCeilingCode
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              {meetsCeilingCode ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                  <span>
                    <strong>IRC Code Compliant:</strong> Finished height meets or exceeds 7'0" (84 in). Can be 100% credited as legal habitable living area in formal bank appraisals.
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 stroke-[2.5]" />
                  <span>
                    <strong>Low Clearance Warning:</strong> International Residential Code requires 7'0" (84 in) for living space. Beams/ducts can drop to 6'4". Appraisal credit may be discounted by 30-50%.
                  </span>
                </>
              )}
            </div>

            {/* Location labor selection */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                Regional Construction Market (Labor & Material Index)
              </label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-950 focus:bg-white focus:outline-blue-600"
              >
                {LOCATION_MULTIPLIERS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.label} ({loc.multiplier > 1 ? `+${Math.round((loc.multiplier - 1) * 100)}%` : loc.multiplier === 1 ? 'Baseline' : `-${Math.round((1 - loc.multiplier) * 100)}%`})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Egress & Moisture / Structural */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">2</span>
              <span>{spaceType === 'basement' ? 'Egress Window & Moisture Defense' : 'Staircase Access & Ventilation'}</span>
            </h3>

            {spaceType === 'basement' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Emergency Egress Window
                  </label>
                  <select
                    value={egressOption}
                    onChange={(e: any) => setEgressOption(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-950 focus:bg-white focus:outline-blue-600"
                  >
                    <option value="needed">Excavate Well + Cut Foundation (+$5,200)</option>
                    <option value="existing">Already Have Egress / Walkout Door ($0)</option>
                    <option value="not-bedroom">Non-Bedroom Living Space Only ($0)</option>
                  </select>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    Required by IRC R310 for any legal below-grade bedroom.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Waterproofing & Drainage
                  </label>
                  <select
                    value={waterproofingOption}
                    onChange={(e: any) => setWaterproofingOption(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-950 focus:bg-white focus:outline-blue-600"
                  >
                    <option value="full-french">Interior French Drain + Sump Pump (+$4,800)</option>
                    <option value="vapor-barrier">Wall Vapor Barrier Only (+$1,600)</option>
                    <option value="already-dry">Bone-Dry Slab / Waterproofed ($0)</option>
                  </select>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    Protects finished drywall and flooring from subterranean hydrostatic seepage.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Attic Access Staircase
                  </label>
                  <select
                    value={egressOption}
                    onChange={(e: any) => setEgressOption(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-950 focus:bg-white focus:outline-blue-600"
                  >
                    <option value="needed">Build Permanent Code Staircase (+$6,500)</option>
                    <option value="existing">Full Permanent Staircase Exists ($0)</option>
                  </select>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    Pull-down folding ladders are strictly prohibited for habitable square footage.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Roof Airflow & Collar Ties
                  </label>
                  <select
                    value={waterproofingOption}
                    onChange={(e: any) => setWaterproofingOption(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-950 focus:bg-white focus:outline-blue-600"
                  >
                    <option value="full-french">Rafter Baffles + Ridge Ventilation (+$2,800)</option>
                    <option value="vapor-barrier">Basic Air Chutes (+$1,200)</option>
                    <option value="already-dry">Conditioned Unvented Hot Roof ($0)</option>
                  </select>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    Prevents ice damming and heat build-up under roof decking.
                  </p>
                </div>
              </div>
            )}

            {/* Thermal Subfloor & HVAC */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  Subfloor & Thermal Break
                </label>
                <select
                  value={subfloorType}
                  onChange={(e: any) => setSubfloorType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-950 focus:bg-white focus:outline-blue-600"
                >
                  <option value="dricore">Dricore Engineered Moisture Tiles ($2.85/sqft)</option>
                  <option value="plywood-xps">Rigid Foam XPS + T&G Plywood ($2.10/sqft)</option>
                  <option value="direct-slab">Direct Concrete Leveling ($0.90/sqft)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  Heating & Air Conditioning
                </label>
                <select
                  value={hvacOption}
                  onChange={(e: any) => setHvacOption(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-950 focus:bg-white focus:outline-blue-600"
                >
                  <option value="mini-split">Ductless Mini-Split Heat Pump (+$4,200)</option>
                  <option value="extend-ducts">Extend Existing Furnace Ducts (+$2,100)</option>
                  <option value="baseboard">Electric Convection Baseboards (+$900)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Plumbing & Quality Tier */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">3</span>
              <span>Bathroom, Quality & Finishing Standards</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  Bathroom Addition
                </label>
                <select
                  value={bathroomType}
                  onChange={(e: any) => setBathroomType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-950 focus:bg-white focus:outline-blue-600"
                >
                  <option value="full">Full Bath (Shower, Toilet, Vanity)</option>
                  <option value="half">Half Bath (Powder Room)</option>
                  <option value="wetbar">Wet Bar & Beverage Center</option>
                  <option value="none">No Plumbing / Dry Space Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  Plumbing Rough-In Status
                </label>
                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasRoughinPlumbing}
                      onChange={(e) => setHasRoughinPlumbing(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Rough-in pipes already cast in slab / attic</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['spec', 'standard', 'luxury'] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setFinishQuality(tier)}
                  className={`p-3.5 rounded-xl border-2 text-left transition ${
                    finishQuality === tier
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="font-black text-xs uppercase tracking-wider text-slate-900">
                    {tier === 'spec' ? 'Rental / Spec' : tier === 'standard' ? 'Standard Family' : 'Luxury Lounge'}
                  </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-1">
                      {tier === 'spec'
                        ? 'Durable carpet tile, fiberglass shower, basic fixtures.'
                        : tier === 'standard'
                        ? 'Waterproof LVP plank, subway tile, recessed LED pots.'
                        : 'Designer porcelain tile, quartz bar, custom built-ins.'}
                    </div>
                </button>
              ))}
            </div>

            {/* Permits & Value Context */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  Current Home Market Value ($)
                </label>
                <input
                  type="number"
                  step="25000"
                  value={homeCurrentValue}
                  onChange={(e) => setHomeCurrentValue(Math.max(100000, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-950 focus:bg-white focus:outline-blue-600"
                />
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  Used to benchmark local $/sqft equity uplift comps.
                </p>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2.5 text-xs font-black text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includePermits}
                    onChange={(e) => setIncludePermits(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Include City Permits & Architectural Plan Reviews (~$1,500)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Breakdown Dashboard */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Hero Card */}
          <div className="bg-slate-950 text-white p-6 sm:p-8 rounded-3xl border-2 border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <TrendingUp className="w-36 h-36 text-white" />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-wider text-blue-400">
                Turnkey Contractor Bid Estimate
              </span>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white mt-1">
                {formatCurrency(calculation.totalContractorCost)}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mt-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Estimated Completion: <strong>~{calculation.estimatedWeeks} Weeks</strong> ({calculation.estimatedDays} workdays)</span>
              </div>
            </div>

            {/* DIY comparison bar */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">DIY Materials Only</span>
                <span className="text-xl font-black text-emerald-400">{formatCurrency(calculation.diyCost)}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">DIY Labor Savings</span>
                <span className="text-sm font-black text-slate-200">Save {formatCurrency(calculation.diySavings)}</span>
              </div>
            </div>

            {/* Appraisal Equity Gain & ROI Callout */}
            <div className="p-4 rounded-2xl bg-blue-950/70 border border-blue-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  Appraisal Equity Uplift
                </span>
                <span className="font-black text-emerald-400">+{calculation.roiPercentage}% Cost Recoup</span>
              </div>
              <div className="text-2xl font-black text-white">
                +{formatCurrency(calculation.totalAppraisalGain)}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                Adds <strong>{squareFootage} sq. ft.</strong> of permitted living space, valued at ~{formatCurrency(calculation.appraisalUpliftPerSqFt)}/sq. ft. in your market.
                {calculation.netEquityCreated > 0 && (
                  <span className="text-emerald-400 font-black block mt-1">
                    Instant Net Equity Created: +{formatCurrency(calculation.netEquityCreated)}!
                  </span>
                )}
              </p>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleRequestBids}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-black text-sm tracking-tight rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <span>Get 3 Local Finishing Contractor Bids</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleSave}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <Bookmark className="w-3.5 h-3.5 text-blue-400" />
                  <span>{savedSuccess ? 'Saved!' : 'Save Estimate'}</span>
                </button>
                <button
                  onClick={handleOpenReport}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Bank PDF Report</span>
                </button>
              </div>
            </div>
          </div>

          {/* Itemized Line-Item Takeoff */}
          <div className="bg-slate-50 rounded-2xl border-2 border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2.5">
              <span>Itemized Trade Breakdown</span>
              <span>Est. Cost</span>
            </div>

            <div className="divide-y divide-slate-200/60 text-xs">
              {calculation.breakdown.map((item, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between">
                  <span className="font-bold text-slate-700">{item.name}</span>
                  <span className="font-black text-slate-950">{formatCurrency(item.cost)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t-2 border-slate-200 flex items-center justify-between text-xs font-black">
              <span className="text-slate-800 uppercase tracking-wider">Total Line-Item Sum:</span>
              <span className="text-base text-blue-600">{formatCurrency(calculation.totalContractorCost)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
