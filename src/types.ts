export type CategoryId =
  | 'home-reno'
  | 'basement-attic'
  | 'degree-completion'
  | 'debt-freedom'
  | 'car-restoration'
  | 'wedding-budgeter'
  | 'diy-regret'
  | 'self-publishing'
  | 'medical-dental'
  | 'software-mvp'
  | 'boat-builder';

export type CategoryBucket = 'real-estate' | 'life-education' | 'passion-finance';

export interface AppCategoryMeta {
  id: CategoryId;
  name: string;
  tagline: string;
  bucket: CategoryBucket;
  bucketLabel: string;
  description: string;
  whyItFits: string;
  iconName: string;
  popular?: boolean;
  status: 'active' | 'interactive-preview' | 'coming-soon';
  sampleStartingCost: string;
  avgTimeRemaining: string;
}

export interface LocationMultiplier {
  id: string;
  label: string;
  country: string;
  multiplier: number;
  currencySymbol: string;
  avgLaborRateHourly: number;
}

export interface RenoPhase {
  id: string;
  title: string;
  weight: number; // percentage, e.g. 0.15 for 15%
  trade: string;
  description: string;
  defaultCompleted: boolean;
  typicalMaterialCostShare: number;
  typicalLaborCostShare: number;
}

export type QualityTier = 'budget' | 'standard' | 'luxury';

export interface HiddenCostItem {
  id: string;
  label: string;
  description: string;
  typicalCost: number;
  checked: boolean;
}

export interface HomeRenoInputs {
  squareFootage: number;
  unit: 'sqft' | 'sqm';
  storeys: number;
  locationId: string;
  customLocationMultiplier?: number;
  stalledStatus: 'foundation' | 'shell' | 'rough-ins' | 'finishing-stall';
  phases: Record<string, boolean>; // phaseId -> isCompleted
  qualityTier: QualityTier;
  hiddenCosts: Record<string, boolean>; // hiddenCostId -> isIncluded
  sunkCostSpent: number;
  estimatedPostFinishValue?: number;
}

export interface HomeRenoResult {
  baseFinishingCost: number;
  effectiveSqFt: number;
  qualityMultiplier: number;
  locationMultiplier: number;
  totalScopeCost: number;
  remainingPercentage: number;
  completedPercentage: number;
  costToFinishBase: number;
  hiddenCostsTotal: number;
  costToFinishContractor: number;
  costToFinishDIY: number;
  diySavings: number;
  estimatedDaysToFinish: number;
  phaseBreakdown: Array<{
    phase: RenoPhase;
    isCompleted: boolean;
    cost: number;
    laborCost: number;
    materialCost: number;
  }>;
  takeoffShoppingList: Array<{
    category: string;
    item: string;
    estimatedQuantity: string;
    estimatedCost: number;
  }>;
}

export interface SavedEstimate {
  id: string;
  title: string;
  category: CategoryId;
  date: string;
  totalCost: number;
  sqft?: number;
  progressDonePercent: number;
  notes?: string;
}

export interface SavedProjectEstimate {
  id: string;
  title: string;
  category: CategoryId;
  date: string;
  result: HomeRenoResult;
}

export interface SeoArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  focusKeyword: string;
  category: string;
  readTime: string;
  publishedDate: string;
  summary: string;
  keyTakeaways: string[];
  contentSections: Array<{
    heading: string;
    paragraphs: string[];
    highlightBox?: string;
  }>;
  relatedCalculator: CategoryId;
}
