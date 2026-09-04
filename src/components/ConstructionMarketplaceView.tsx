import React, { useState } from 'react';
import {
  Store,
  Search,
  CheckCircle2,
  TrendingDown,
  Layers,
  ShieldCheck,
  Building,
  Sliders,
  DollarSign,
  Truck,
  Wrench,
  Hammer,
  Truck as HeavyIcon,
  Calendar,
  Zap,
  ShoppingBag,
  Clock,
  Filter
} from 'lucide-react';
import { MarketplaceItem, MarketplaceItemType } from '../types';
import { BUILDING_MATERIALS_CATALOG } from '../data/contractorsAndMaterialsData';
import { formatCurrency } from '../utils/calculationUtils';

interface Props {
  onApplyItemToProject?: (item: MarketplaceItem) => void;
  onRequestRentalQuote?: (item: MarketplaceItem) => void;
}

export const ConstructionMarketplaceView: React.FC<Props> = ({
  onApplyItemToProject,
  onRequestRentalQuote,
}) => {
  const [items] = useState<MarketplaceItem[]>(BUILDING_MATERIALS_CATALOG);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemTypeFilter, setItemTypeFilter] = useState<'all' | MarketplaceItemType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [pricingMode, setPricingMode] = useState<'all' | 'rent' | 'buy'>('all');
  const [inquirySuccessItem, setInquirySuccessItem] = useState<string | null>(null);

  const typeTabs: Array<{ id: 'all' | MarketplaceItemType; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'all', label: 'All Marketplace', icon: Store },
    { id: 'material', label: 'Building Materials', icon: Layers },
    { id: 'tool', label: 'Tools & Power Gear', icon: Wrench },
    { id: 'heavy_equipment', label: 'Heavy Equipment', icon: HeavyIcon },
    { id: 'safety_access', label: 'Scaffolding & Access', icon: Hammer },
  ];

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'drywall', label: 'Drywall & Insulation' },
    { id: 'mep', label: 'Plumbing & Electrical' },
    { id: 'flooring', label: 'Flooring Systems' },
    { id: 'kitchen_bath', label: 'Kitchen & Bath' },
    { id: 'power_tools', label: 'Power Tools' },
    { id: 'heavy_machinery', label: 'Heavy Machinery' },
    { id: 'scaffolding_ladders', label: 'Scaffolding & Lifts' },
    { id: 'concrete_masonry', label: 'Concrete & Masonry' },
    { id: 'doors_trim', label: 'Doors & Trim' },
    { id: 'paint', label: 'Paint & Coatings' },
  ];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subcategory.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = itemTypeFilter === 'all' || (item.itemType || 'material') === itemTypeFilter;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    let matchesPricing = true;
    if (pricingMode === 'rent') {
      matchesPricing = Boolean(item.rentalRateDaily || item.acquisitionMode === 'buy_or_rent' || item.acquisitionMode === 'rent_only');
    } else if (pricingMode === 'buy') {
      matchesPricing = item.acquisitionMode !== 'rent_only';
    }

    return matchesSearch && matchesType && matchesCategory && matchesPricing;
  });

  const handleInquiry = (item: MarketplaceItem) => {
    if (onRequestRentalQuote) {
      onRequestRentalQuote(item);
    } else {
      setInquirySuccessItem(item.id);
      setTimeout(() => setInquirySuccessItem(null), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black uppercase tracking-wider border border-blue-500/30">
            <Store className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Commercial Construction Marketplace & Equipment Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Materials, Tools & Heavy Equipment Marketplace
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
            Everything needed to take a stalled or shell structure to final Certificate of Occupancy. Source trade-wholesale materials, rent commercial power tools (drywall sanders, airless sprayers), or book site machinery (mini-excavators, track loaders, rolling scaffolding) with contractor pricing discounts.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              <span>Wholesale Contractor Pricing (Up to 30% Off Retail)</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Flexible Daily & Weekly Equipment Rentals</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>Direct Jobsite Dispatch & Freight Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Primary Type Filters (Materials, Tools, Heavy Equipment, Scaffolding) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {typeTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = itemTypeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setItemTypeFilter(tab.id);
                  setSelectedCategory('all');
                }}
                className={`px-3.5 py-2 rounded-xl font-black tracking-tight shrink-0 transition flex items-center gap-2 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools, equipment, materials (e.g. Kubota, Bobcat, Festool, Sheetrock, ProPEX)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          {/* Pricing Mode Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 text-xs font-bold">
            <button
              onClick={() => setPricingMode('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                pricingMode === 'all' ? 'bg-white text-slate-950 shadow-xs font-black' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              All Modes
            </button>
            <button
              onClick={() => setPricingMode('rent')}
              className={`px-3 py-1.5 rounded-lg transition ${
                pricingMode === 'rent' ? 'bg-white text-blue-800 shadow-xs font-black' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Rentals Available
            </button>
            <button
              onClick={() => setPricingMode('buy')}
              className={`px-3 py-1.5 rounded-lg transition ${
                pricingMode === 'buy' ? 'bg-white text-emerald-800 shadow-xs font-black' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Purchase
            </button>
          </div>
        </div>

        {/* Secondary Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg font-bold shrink-0 transition ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
        <span>Showing {filteredItems.length} marketplace items & equipment ready for delivery</span>
        <span>Nationwide Commercial & Local Supply Network</span>
      </div>

      {/* Marketplace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isRental = Boolean(item.rentalRateDaily || item.acquisitionMode === 'buy_or_rent' || item.acquisitionMode === 'rent_only');
          const isToolOrEquipment = item.itemType === 'tool' || item.itemType === 'heavy_equipment' || item.itemType === 'safety_access';

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl border-2 border-slate-200 hover:border-blue-500/80 transition-all p-6 shadow-xs flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                {/* Top Badge Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        item.itemType === 'heavy_equipment'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : item.itemType === 'tool'
                          ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                          : item.itemType === 'safety_access'
                          ? 'bg-orange-100 text-orange-900 border border-orange-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.itemType === 'heavy_equipment'
                        ? 'Heavy Machinery'
                        : item.itemType === 'tool'
                        ? 'Power Tool'
                        : item.itemType === 'safety_access'
                        ? 'Site Access'
                        : 'Building Material'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {item.categoryLabel}
                    </span>
                  </div>

                  {item.bulkDiscountPercent > 0 && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                      Save {item.bulkDiscountPercent}%
                    </span>
                  )}
                </div>

                {/* Name */}
                <div>
                  <h3 className="font-black text-base text-slate-950 tracking-tight group-hover:text-blue-600 transition">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mt-1">
                    <span>Brand: <strong className="text-slate-800">{item.brand}</strong></span>
                    <span>•</span>
                    <span>SKU: <strong className="text-slate-800">{item.sku}</strong></span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {item.specs}
                </p>

                {/* Specifications & Power Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.powerSource && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-600" />
                      <span>{item.powerSource}</span>
                    </span>
                  )}
                  {item.coveragePerUnit && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {item.coveragePerUnit}
                    </span>
                  )}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    <span>{item.leadTimeDays === 1 ? 'Next-Day Delivery / Dispatch' : `${item.leadTimeDays} Days Lead`}</span>
                  </span>
                </div>

                {/* Pricing & Rental Rates Box */}
                <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  {/* If Rental available */}
                  {isRental && item.rentalRateDaily ? (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-blue-900 font-black flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span>Jobsite Rental Rate:</span>
                        </span>
                        <div className="text-right">
                          <span className="text-base font-black text-blue-950">
                            ${item.rentalRateDaily.toFixed(0)}
                            <span className="text-xs font-normal text-slate-500"> /day</span>
                          </span>
                          {item.rentalRateWeekly && (
                            <span className="text-xs font-bold text-slate-500 ml-2">
                              (${item.rentalRateWeekly.toFixed(0)}/wk)
                            </span>
                          )}
                        </div>
                      </div>

                      {item.acquisitionMode !== 'rent_only' && (
                        <div className="flex justify-between items-baseline pt-1.5 border-t border-slate-200 text-xs">
                          <span className="text-slate-500 font-bold">Purchase (Pro Wholesaler):</span>
                          <span className="font-black text-slate-900">
                            {formatCurrency(item.contractorPrice)}
                            {item.retailPrice > item.contractorPrice && (
                              <span className="text-slate-400 line-through text-[11px] ml-1.5 font-normal">
                                {formatCurrency(item.retailPrice)}
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Standard purchase pricing for materials */
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-slate-500 font-bold">Big-Box Retail Price:</span>
                        <span className="text-xs font-black text-slate-400 line-through">
                          ${item.retailPrice.toFixed(2)} / {item.unit}
                        </span>
                      </div>

                      <div className="flex justify-between items-baseline pt-1 border-t border-slate-200">
                        <span className="text-xs text-emerald-800 font-black">Trade Wholesale Price:</span>
                        <span className="text-lg font-black text-emerald-600">
                          ${item.contractorPrice.toFixed(2)}{' '}
                          <span className="text-[11px] font-medium text-slate-500">/ {item.unit}</span>
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 font-medium text-right">
                        Direct Pro Spread: <strong>${(item.retailPrice - item.contractorPrice).toFixed(2)}</strong> savings
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button & Supplier */}
              <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Source: <strong className="text-slate-800">{item.supplier}</strong></span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>In Stock</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleInquiry(item)}
                  className="w-full py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm tracking-tight transition flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 active:scale-[0.98] text-white shadow-xs"
                >
                  {inquirySuccessItem === item.id ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Dispatched to Supplier Queue!</span>
                    </>
                  ) : isRental ? (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Book Equipment or Request Delivery</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Order Materials at Contractor Price</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
