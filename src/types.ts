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

// Blueprint Plan Takeoff Specification
export interface BlueprintSchedule {
  planName?: string;
  planNumber?: string;
  architectOrEngineer?: string;
  fullBathsCount: number;
  halfBathsCount: number;
  kitchenLinearFeet: number; // cabinet run length (typically 18-35 ft)
  kitchenIsland: boolean;
  vanityLinearFeet: number; // total bathroom vanity length
  ceilingHeightFeet: number; // 8, 9, 10, or 12 ft (impacts drywall & framing)
  hasWalkInPantry: boolean;
  hasMasterWalkInCloset: boolean;
  notes?: string;
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
  blueprint?: BlueprintSchedule;
}

export interface HomeRenoResult {
  baseFinishingCost: number;
  effectiveSqFt: number;
  inputUnit: 'sqft' | 'sqm';
  rawInputArea: number;
  effectiveSqM: number;
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
  blueprintAdditionsTotal?: number;
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
  blueprintSummary?: {
    totalBaths: number;
    cabinetLinearFeetTotal: number;
    countertopSqFtEstimate: number;
    ceilingHeightNote: string;
  };
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

// -------------------------------------------------------------
// Contractor & Marketplace Types
// -------------------------------------------------------------

export type UserRole = 'homeowner' | 'investor' | 'contractor' | 'supplier' | 'admin';

export interface ContractorProfile {
  id: string;
  userId?: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
  city: string;
  state: string;
  zipCode: string;
  serviceRadiusMiles: number;
  specialties: string[];
  licenseNumber: string;
  licenseState: string;
  insuranceVerified: boolean;
  bondAmount?: number;
  yearsInBusiness: number;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  completedProjectsCount: number;
  rescueSpecialist: boolean; // specializes in taking over stalled/abandoned DIY projects
  bio: string;
  featuredBadge?: string;
  verified: boolean;
  avatarUrl?: string;
  availableFrom?: string;
}

export type MarketplaceItemType = 'material' | 'tool' | 'heavy_equipment' | 'safety_access';

export interface MarketplaceItem {
  id: string;
  name: string;
  itemType?: MarketplaceItemType;
  category:
    | 'drywall'
    | 'mep'
    | 'flooring'
    | 'framing'
    | 'kitchen_bath'
    | 'paint'
    | 'doors_trim'
    | 'power_tools'
    | 'heavy_machinery'
    | 'scaffolding_ladders'
    | 'concrete_masonry'
    | 'exterior';
  categoryLabel: string;
  subcategory: string;
  unit: string;
  retailPrice: number;
  contractorPrice: number;
  rentalRateDaily?: number;
  rentalRateWeekly?: number;
  acquisitionMode?: 'buy_or_rent' | 'buy_only' | 'rent_only';
  bulkDiscountPercent: number;
  leadTimeDays: number;
  brand: string;
  sku: string;
  coveragePerUnit: string;
  inStock: boolean;
  wasteFactorPercent?: number;
  specs: string;
  supplier: string;
  powerSource?: 'Cordless 18V/20V' | '120V Corded' | '240V' | 'Diesel' | 'Gasoline' | 'Manual';
  environmentalRating?: 'Standard' | 'Low-VOC' | 'Eco-Certified' | 'Commercial Grade';
}

// Backward-compatible alias for existing code
export type MaterialItem = MarketplaceItem;

export interface MarketplaceCartItem {
  item: MarketplaceItem;
  quantity: number;
  selectedOption: 'purchase' | 'rent_daily' | 'rent_weekly';
}
