import { HomeRenoInputs, HomeRenoResult } from '../types';
import {
  BASE_FINISHING_COST_PER_SQFT,
  LOCATION_MULTIPLIERS,
  RENO_PHASES,
  HIDDEN_COST_ITEMS,
} from '../data/homeRenoData';

export function calculateHomeReno(inputs: HomeRenoInputs): HomeRenoResult {
  const sqft = inputs.unit === 'sqm' ? Math.round(inputs.squareFootage * 10.7639) : inputs.squareFootage;

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

  // Total complete finishing baseline for entire area
  const totalScopeCost = Math.round(sqft * BASE_FINISHING_COST_PER_SQFT * qualityMultiplier * locationMultiplier);

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

  // General Contractor Markup (20% management, liability insurance, trade coordination, building code warranties)
  const contractorManagementMarkup = Math.round(costToFinishBase * 0.20);
  const costToFinishContractor = costToFinishBase + hiddenCostsTotal + contractorManagementMarkup;

  // DIY Self-Managed Option:
  // User saves ~65% of labor on non-licensed trades (painting, trim, flooring, hanging drywall)
  // But still pays for materials and specialty sub-trades (plumbing/electrical rough-in connections)
  // Overall savings typically ~22% - 30% compared to full contractor turn-key
  const costToFinishDIY = Math.round((costToFinishBase * 0.72) + hiddenCostsTotal);
  const diySavings = Math.max(0, costToFinishContractor - costToFinishDIY);

  // Estimated calendar working days to finish
  // Rough baseline: 1 crew day per 25 sq ft of remaining tasks
  const rawWorkDays = Math.round((sqft * remainingWeightSum) / 22);
  const estimatedDaysToFinish = Math.max(14, Math.min(180, rawWorkDays));

  // Takeoff / Shopping List estimates
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
      category: 'Cabinetry & Fixtures',
      item: 'Soft-Close Cabinets, Countertops & Vanity Sets',
      estimatedQuantity: `${inputs.storeys > 1 ? 'Kitchen + 2-3 Baths' : 'Kitchen + 1-2 Baths'}`,
      estimatedCost: Math.round(sqft * (inputs.qualityTier === 'luxury' ? 18 : 11)),
    },
  ];

  return {
    baseFinishingCost: BASE_FINISHING_COST_PER_SQFT,
    effectiveSqFt: sqft,
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
    phaseBreakdown,
    takeoffShoppingList,
  };
}

export function formatCurrency(amount: number, symbol = '$'): string {
  return `${symbol}${Math.round(amount).toLocaleString('en-US')}`;
}

export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}
