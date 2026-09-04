import { HomeRenoInputs, HomeRenoResult } from '../types';
import {
  BASE_FINISHING_COST_PER_SQFT,
  LOCATION_MULTIPLIERS,
  RENO_PHASES,
  HIDDEN_COST_ITEMS,
} from '../data/homeRenoData';

export function calculateHomeReno(inputs: HomeRenoInputs): HomeRenoResult {
  const isMetric = inputs.unit === 'sqm';
  const rawInputArea = inputs.squareFootage;
  const sqft = isMetric ? Math.round(inputs.squareFootage * 10.7639) : inputs.squareFootage;
  const sqM = isMetric ? inputs.squareFootage : Math.round((inputs.squareFootage / 10.7639) * 10) / 10;

  // Quality multiplier
  const qualityMultipliers: Record<string, number> = {
    budget: 0.8,
    standard: 1.0,
    luxury: 1.6,
  };
  const qualityMultiplier = qualityMultipliers[inputs.qualityTier] || 1.0;

  // Location multiplier
  const locationObj = LOCATION_MULTIPLIERS.find((l) => l.id === inputs.locationId);
  const locationMultiplier = inputs.customLocationMultiplier || locationObj?.multiplier || 1.0;

  // Ceiling height multiplier on baseline volume (9ft = +4%, 10ft = +8%, 12ft = +15% due to 54" drywall and scaffolding)
  let ceilingVolumeMultiplier = 1.0;
  if (inputs.blueprint) {
    if (inputs.blueprint.ceilingHeightFeet >= 12) {
      ceilingVolumeMultiplier = 1.15;
    } else if (inputs.blueprint.ceilingHeightFeet >= 10) {
      ceilingVolumeMultiplier = 1.08;
    } else if (inputs.blueprint.ceilingHeightFeet >= 9) {
      ceilingVolumeMultiplier = 1.04;
    }
  }

  // Total complete finishing baseline for entire area
  const totalScopeCost = Math.round(
    sqft * BASE_FINISHING_COST_PER_SQFT * qualityMultiplier * locationMultiplier * ceilingVolumeMultiplier
  );

  // Sum weights of remaining phases
  let remainingWeightSum = 0;
  let completedWeightSum = 0;

  const phaseBreakdown = RENO_PHASES.map((phase) => {
    const isCompleted = Boolean(inputs.phases[phase.id]);
    if (isCompleted) {
      completedWeightSum += phase.weight;
    } else {
      remainingWeightSum += phase.weight;
    }

    const phaseTotalCost = Math.round(totalScopeCost * phase.weight);
    const laborCost = Math.round(phaseTotalCost * phase.typicalLaborCostShare);
    const materialCost = Math.round(phaseTotalCost * phase.typicalMaterialCostShare);

    return {
      phase,
      isCompleted,
      cost: phaseTotalCost,
      laborCost,
      materialCost,
    };
  });

  // Base cost to finish for incomplete phases
  const costToFinishBase = Math.round(totalScopeCost * remainingWeightSum);

  // Hidden costs calculation
  let hiddenCostsTotal = 0;
  HIDDEN_COST_ITEMS.forEach((item) => {
    if (inputs.hiddenCosts[item.id]) {
      hiddenCostsTotal += item.typicalCost * locationMultiplier;
    }
  });
  hiddenCostsTotal = Math.round(hiddenCostsTotal);

  // Specific Blueprint Plan Additions:
  // If user provided detailed blueprint counts for baths and cabinet linear feet:
  let blueprintAdditions = 0;
  let totalBaths = 0;
  let totalCabinetLinearFeet = 0;
  let estimatedCountertopSqFt = 0;
  let ceilingNote = 'Standard 8-ft ceiling';

  if (inputs.blueprint) {
    const bp = inputs.blueprint;
    totalBaths = bp.fullBathsCount + (bp.halfBathsCount * 0.5);
    totalCabinetLinearFeet = bp.kitchenLinearFeet + bp.vanityLinearFeet + (bp.kitchenIsland ? 8 : 0);
    estimatedCountertopSqFt = Math.round(totalCabinetLinearFeet * 2.2);

    if (bp.ceilingHeightFeet > 8) {
      ceilingNote = `${bp.ceilingHeightFeet}-ft High Ceilings (Included 54" Rock + Scaffolding)`;
    }

    // Baseline calculation covers 2 baths per 1,800 sq ft.
    // Additional baths beyond baseline require rough-in fixture lines & tile suites:
    const baselineExpectedBaths = Math.max(1.5, Math.round((sqft / 1000) * 10) / 10);
    const extraBaths = Math.max(0, totalBaths - baselineExpectedBaths);
    if (extraBaths > 0 && !inputs.phases['bathrooms']) {
      // Extra bath full finish cost: ~$6,500 budget, $10,500 standard, $18,000 luxury
      const costPerExtraBath = Math.round(10500 * qualityMultiplier * locationMultiplier);
      blueprintAdditions += Math.round(extraBaths * costPerExtraBath);
    }

    // Custom Walk-in Pantry & Master Walk-In Millwork
    if (bp.hasWalkInPantry && !inputs.phases['finish_carpentry']) {
      blueprintAdditions += Math.round(1800 * qualityMultiplier * locationMultiplier);
    }
    if (bp.hasMasterWalkInCloset && !inputs.phases['finish_carpentry']) {
      blueprintAdditions += Math.round(2600 * qualityMultiplier * locationMultiplier);
    }
  }

  // General Contractor Markup (20% management, liability insurance, trade coordination, building code warranties)
  const contractorManagementMarkup = Math.round((costToFinishBase + blueprintAdditions) * 0.20);
  const costToFinishContractor = costToFinishBase + blueprintAdditions + hiddenCostsTotal + contractorManagementMarkup;

  // DIY Self-Managed Option:
  // User saves ~65% of labor on non-licensed trades (painting, trim, flooring, hanging drywall)
  const costToFinishDIY = Math.round(((costToFinishBase + blueprintAdditions) * 0.72) + hiddenCostsTotal);
  const diySavings = Math.max(0, costToFinishContractor - costToFinishDIY);

  // Estimated calendar working days to finish
  const rawWorkDays = Math.round((sqft * remainingWeightSum) / 22);
  const estimatedDaysToFinish = Math.max(14, Math.min(180, rawWorkDays));

  // Takeoff / Shopping List estimates tailored to Blueprint specifications:
  const kitchenCabinetRun = inputs.blueprint ? inputs.blueprint.kitchenLinearFeet : Math.round(sqft / 90);
  const bathCountText = inputs.blueprint
    ? `${inputs.blueprint.fullBathsCount} Full, ${inputs.blueprint.halfBathsCount} Half`
    : (inputs.storeys > 1 ? '2.5 Bathrooms' : '2 Bathrooms');

  const takeoffShoppingList = [
    {
      category: 'Surfaces & Paint',
      item: 'Premium Low-VOC Primer & Interior Washable Latex',
      estimatedQuantity: `${Math.round(sqft / 350 * (inputs.phases['paint_fixtures'] ? 0 : 2))} - ${Math.round(sqft / 300 * 3)} Gallons`,
      estimatedCost: Math.round(sqft * 1.65 * (inputs.phases['paint_fixtures'] ? 0.2 : 1)),
    },
    {
      category: 'Flooring Takeoff',
      item: 'Plank Flooring / Tile + 10% Waste Factor & Underlayment',
      estimatedQuantity: `${Math.round(sqft * 1.1)} sq. ft.`,
      estimatedCost: Math.round(sqft * (inputs.qualityTier === 'luxury' ? 9.5 : inputs.qualityTier === 'budget' ? 3.5 : 5.8)),
    },
    {
      category: 'Electrical & Lighting',
      item: 'Recessed LED Ultra-Slim Trim Pots & Smart Wall Dimmers',
      estimatedQuantity: `${Math.round(sqft / 65)} Units`,
      estimatedCost: Math.round(sqft * 1.9),
    },
    {
      category: 'Finish Carpentry',
      item: 'Solid-Core Passage Doors & 5-1/4" Baseboard Trim Bundles',
      estimatedQuantity: `${Math.max(4, Math.round(sqft / 220))} Pre-hung Units`,
      estimatedCost: Math.round(sqft * 2.8),
    },
    {
      category: 'Cabinetry & Countertops',
      item: `${kitchenCabinetRun} Linear Ft Base/Wall Cabinets + Quartz Slabs`,
      estimatedQuantity: `${kitchenCabinetRun} Linear Ft Kitchen + Vanities (${bathCountText})`,
      estimatedCost: Math.round(sqft * (inputs.qualityTier === 'luxury' ? 18 : 11) + (inputs.blueprint?.kitchenIsland ? 2800 : 0)),
    },
    {
      category: 'Toilet & Bathroom Suites',
      item: `Full Bath Enclosures, Schluter Shower Pans & Fixture Kits`,
      estimatedQuantity: `${bathCountText} Complete Suites`,
      estimatedCost: Math.round((inputs.blueprint ? totalBaths : 2) * (inputs.qualityTier === 'luxury' ? 8500 : 5200)),
    },
  ];

  return {
    baseFinishingCost: BASE_FINISHING_COST_PER_SQFT,
    effectiveSqFt: sqft,
    inputUnit: inputs.unit,
    rawInputArea,
    effectiveSqM: sqM,
    qualityMultiplier,
    locationMultiplier,
    totalScopeCost,
    remainingPercentage: Math.round(remainingWeightSum * 100),
    completedPercentage: Math.round(completedWeightSum * 100),
    costToFinishBase,
    hiddenCostsTotal,
    costToFinishContractor,
    costToFinishDIY,
    diySavings,
    estimatedDaysToFinish,
    blueprintAdditionsTotal: blueprintAdditions,
    phaseBreakdown,
    takeoffShoppingList,
    blueprintSummary: inputs.blueprint
      ? {
          totalBaths,
          cabinetLinearFeetTotal: totalCabinetLinearFeet,
          countertopSqFtEstimate: estimatedCountertopSqFt,
          ceilingHeightNote: ceilingNote,
        }
      : undefined,
  };
}

export function formatCurrency(amount: number, symbol = '$'): string {
  return `${symbol}${Math.round(amount).toLocaleString('en-US')}`;
}

export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}
