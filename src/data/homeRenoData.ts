import { LocationMultiplier, RenoPhase, HiddenCostItem } from '../types';

export const BASE_FINISHING_COST_PER_SQFT = 90; // $90 / sq ft standard baseline

export const LOCATION_MULTIPLIERS: LocationMultiplier[] = [
  { id: 'us-nat', label: 'US National Average (Texas, Georgia, Ohio)', country: 'USA', multiplier: 1.0, currencySymbol: '$', avgLaborRateHourly: 65 },
  { id: 'us-nyc', label: 'New York Metro / Tri-State', country: 'USA', multiplier: 1.45, currencySymbol: '$', avgLaborRateHourly: 95 },
  { id: 'us-ca', label: 'California (Bay Area, LA, San Diego)', country: 'USA', multiplier: 1.40, currencySymbol: '$', avgLaborRateHourly: 90 },
  { id: 'us-pnw', label: 'Pacific Northwest (Seattle, Portland)', country: 'USA', multiplier: 1.25, currencySymbol: '$', avgLaborRateHourly: 80 },
  { id: 'us-chi', label: 'Chicago & Mid-Atlantic', country: 'USA', multiplier: 1.10, currencySymbol: '$', avgLaborRateHourly: 72 },
  { id: 'us-fl', label: 'Florida & Sunbelt', country: 'USA', multiplier: 0.98, currencySymbol: '$', avgLaborRateHourly: 62 },
  { id: 'us-rural', label: 'Midwest Rural & Heartland', country: 'USA', multiplier: 0.88, currencySymbol: '$', avgLaborRateHourly: 55 },
  { id: 'uk-lon', label: 'United Kingdom (London & South East)', country: 'UK', multiplier: 1.35, currencySymbol: '£', avgLaborRateHourly: 60 },
  { id: 'ca-tor', label: 'Canada (Toronto, Vancouver)', country: 'CAN', multiplier: 1.22, currencySymbol: 'C$', avgLaborRateHourly: 78 },
  { id: 'au-syd', label: 'Australia (Sydney, Melbourne)', country: 'AUS', multiplier: 1.30, currencySymbol: 'A$', avgLaborRateHourly: 85 },
  { id: 'ph-mnl', label: 'Philippines (Metro Manila & Urban)', country: 'PHL', multiplier: 0.60, currencySymbol: '₱', avgLaborRateHourly: 35 },
];

export const RENO_PHASES: RenoPhase[] = [
  {
    id: 'framing',
    title: 'Framing & Partitions',
    weight: 0.10, // 10%
    trade: 'Carpentry',
    description: 'Stud wall framing, room layout partitions, soffits, and rough door openings.',
    defaultCompleted: true,
    typicalMaterialCostShare: 0.45,
    typicalLaborCostShare: 0.55,
  },
  {
    id: 'mep_roughin',
    title: 'Plumbing & Electrical Rough-in',
    weight: 0.15, // 15%
    trade: 'MEP Trades',
    description: 'In-wall wiring, breaker panel, drain-waste-vent piping, PEX/copper water supply runs.',
    defaultCompleted: true,
    typicalMaterialCostShare: 0.40,
    typicalLaborCostShare: 0.60,
  },
  {
    id: 'drywall',
    title: 'Insulation & Drywall',
    weight: 0.15, // 15%
    trade: 'Drywall & Tape',
    description: 'Thermal & sound batts, vapor barrier, sheetrock hanging, 3-coat taping & sanding.',
    defaultCompleted: false,
    typicalMaterialCostShare: 0.35,
    typicalLaborCostShare: 0.65,
  },
  {
    id: 'flooring',
    title: 'Flooring Installation',
    weight: 0.12, // 12%
    trade: 'Flooring Specialists',
    description: 'Subfloor prep, sound underlayment, engineered hardwood/luxury vinyl/tile installation.',
    defaultCompleted: false,
    typicalMaterialCostShare: 0.60,
    typicalLaborCostShare: 0.40,
  },
  {
    id: 'kitchen',
    title: 'Kitchen Installation',
    weight: 0.18, // 18%
    trade: 'Cabinetry & Plumbing',
    description: 'Base & wall cabinets, quartz/granite countertops, sink & disposal, appliance hookups.',
    defaultCompleted: false,
    typicalMaterialCostShare: 0.65,
    typicalLaborCostShare: 0.35,
  },
  {
    id: 'bathrooms',
    title: 'Bathrooms Finishing',
    weight: 0.12, // 12%
    trade: 'Tile & Plumbing',
    description: 'Showers/tubs waterproofing, wall tile, vanities, toilets, and final chrome/black fixtures.',
    defaultCompleted: false,
    typicalMaterialCostShare: 0.55,
    typicalLaborCostShare: 0.45,
  },
  {
    id: 'trim_doors',
    title: 'Interior Trim & Doors',
    weight: 0.08, // 8%
    trade: 'Finish Carpentry',
    description: 'Pre-hung passage doors, baseboards, window sills, door casings, and hardware sets.',
    defaultCompleted: false,
    typicalMaterialCostShare: 0.50,
    typicalLaborCostShare: 0.50,
  },
  {
    id: 'paint_fixtures',
    title: 'Painting & Light Fixtures',
    weight: 0.10, // 10%
    trade: 'Painting & Electrical',
    description: 'Primer coat, 2 coats washable latex, trim enamel, recessed LED pots & pendant fixtures.',
    defaultCompleted: false,
    typicalMaterialCostShare: 0.30,
    typicalLaborCostShare: 0.70,
  },
];

export const HIDDEN_COST_ITEMS: HiddenCostItem[] = [
  {
    id: 'permits',
    label: 'Expired Permit Renewals & Re-inspections',
    description: 'Municipal fee to reinstate lapsed building permits and schedule active trades.',
    typicalCost: 1400,
    checked: true,
  },
  {
    id: 'utilities',
    label: 'Permanent Utility Meter & Drop Hookup',
    description: 'City water meter connection, electrical drop from pole, and gas meter activation.',
    typicalCost: 2800,
    checked: false,
  },
  {
    id: 'cabinetry_builtins',
    label: 'Custom Storage & Bedroom Built-ins',
    description: 'Closet organizers, pantry shelving, and entryway mudroom bench millwork.',
    typicalCost: 3200,
    checked: true,
  },
  {
    id: 'debris_removal',
    label: 'Site Dumpster & Debris Hauling',
    description: 'Two 30-yard roll-off construction containers plus landfill tip fees.',
    typicalCost: 950,
    checked: true,
  },
  {
    id: 'final_inspection',
    label: 'Structural Engineering & CO Certification',
    description: 'Signed letter for bank loan release and municipal Certificate of Occupancy.',
    typicalCost: 750,
    checked: true,
  },
];

export interface ScopePreset {
  id: string;
  name: string;
  description: string;
  sqft: number;
  completedPhaseIds: string[];
}

export const SCOPE_PRESETS: ScopePreset[] = [
  {
    id: 'shell-studs',
    name: 'Studs & Bare Slab (0% Done)',
    description: 'Outer roof & walls sealed. Everything inside is exposed lumber.',
    sqft: 1800,
    completedPhaseIds: [],
  },
  {
    id: 'roughin-done',
    name: 'Rough-Ins & MEP Passed (25% Done)',
    description: 'Framing, wiring, and pipes passed inspection. Awaiting insulation.',
    sqft: 1400,
    completedPhaseIds: ['framing', 'mep_roughin'],
  },
  {
    id: 'drywall-hung',
    name: 'Drywalled & Primed (40% Done)',
    description: 'Walls are taped and smooth. Flooring and cabinetry needed.',
    sqft: 1200,
    completedPhaseIds: ['framing', 'mep_roughin', 'drywall'],
  },
  {
    id: 'seventy-percent',
    name: 'The Stalled 70% Mark',
    description: 'Only Kitchen, Bathrooms, and Paint remaining. The most common burn-out point.',
    sqft: 1600,
    completedPhaseIds: ['framing', 'mep_roughin', 'drywall', 'flooring', 'trim_doors'],
  },
];
