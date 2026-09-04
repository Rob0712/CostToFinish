import React, { useState } from 'react';
import {
  ShieldCheck,
  Star,
  MapPin,
  CheckCircle2,
  Phone,
  Mail,
  Award,
  Clock,
  ExternalLink,
  Search,
  Filter,
  ArrowUpRight,
  Sparkles,
  SlidersHorizontal,
  UserCheck,
  Hammer
} from 'lucide-react';
import { ContractorProfile } from '../types';
import { VERIFIED_CONTRACTORS } from '../data/contractorsAndMaterialsData';
import { useAuth } from '../context/AuthContext';

interface Props {
  onRequestQuote: (contractor: ContractorProfile) => void;
  onOpenContractorRegister: () => void;
}

export const ContractorDirectoryView: React.FC<Props> = ({
  onRequestQuote,
  onOpenContractorRegister,
}) => {
  const { userProfile, currentUser } = useAuth();
  const [contractors] = useState<ContractorProfile[]>(VERIFIED_CONTRACTORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [onlyRescueSpecialists, setOnlyRescueSpecialists] = useState(false);

  // Specialties extraction
  const allSpecialties = Array.from(
    new Set(contractors.flatMap((c) => c.specialties))
  );

  const filteredContractors = contractors.filter((c) => {
    const matchesSearch =
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.zipCode.includes(searchQuery) ||
      c.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSpecialty =
      selectedSpecialty === 'all' || c.specialties.includes(selectedSpecialty);

    const matchesRescue = !onlyRescueSpecialists || c.rescueSpecialist;

    return matchesSearch && matchesSpecialty && matchesRescue;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Hero & Network Headline */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
            <UserCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Verified Finish Contractors & Trades Network</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Vetted Finishing Specialists & Stalled Build Rescue Crews
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
            Browse state-licensed, bond-verified general contractors, drywall crews, and MEP trades who specialize in turning raw slabs, halted owner-builder projects, and unfinished spaces into certified living square footage.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/10 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% License & Insurance Verified</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/10 px-3 py-1.5 rounded-lg">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Average 4.9+ Customer Rating</span>
            </div>

            {userProfile?.role !== 'contractor' && (
              <button
                onClick={onOpenContractorRegister}
                className="ml-auto text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl transition shadow-sm flex items-center gap-1.5"
              >
                <Hammer className="w-3.5 h-3.5" />
                <span>Are you a Contractor? Join Directory</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city (e.g. Austin, Seattle), trade (e.g. Drywall, MEP), or company name..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          {/* Rescue Toggle */}
          <button
            onClick={() => setOnlyRescueSpecialists(!onlyRescueSpecialists)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-black tracking-tight flex items-center gap-2 transition ${
              onlyRescueSpecialists
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Stalled Build Rescue Specialists Only</span>
          </button>
        </div>

        {/* Specialty Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] shrink-0 mr-1">
            Specialty:
          </span>
          <button
            onClick={() => setSelectedSpecialty('all')}
            className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition ${
              selectedSpecialty === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Trades ({contractors.length})
          </button>
          {allSpecialties.slice(0, 6).map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition ${
                selectedSpecialty === spec
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Contractor Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContractors.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-3xl border-2 border-slate-200 hover:border-blue-500/80 transition-all p-6 shadow-xs flex flex-col justify-between group"
          >
            <div className="space-y-4">
              {/* Header with Badges */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {c.city}, {c.state} ({c.serviceRadiusMiles} mi radius)
                    </span>
                  </div>
                  <h3 className="font-black text-lg text-slate-950 tracking-tight mt-1 group-hover:text-blue-600 transition">
                    {c.companyName}
                  </h3>
                </div>

                {c.verified && (
                  <span
                    className="p-1 rounded-full bg-emerald-100 text-emerald-700"
                    title="Verified License & Commercial Insurance"
                  >
                    <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                  </span>
                )}
              </div>

              {/* Badges & Special Tags */}
              <div className="flex flex-wrap gap-1.5">
                {c.featuredBadge && (
                  <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    {c.featuredBadge}
                  </span>
                )}
                {c.rescueSpecialist && (
                  <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Rescue Pro</span>
                  </span>
                )}
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                {c.bio}
              </p>

              {/* Specialties Tag Cloud */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Core Trade Capabilities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {c.specialties.map((spec) => (
                    <span
                      key={spec}
                      className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metrics (Rating, Projects, License) */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Rating</span>
                  <span className="font-black text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    {c.rating} ({c.reviewCount})
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Completed</span>
                  <span className="font-black text-slate-900 block mt-0.5">
                    {c.completedProjectsCount} Builds
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">License</span>
                  <span className="font-bold text-emerald-700 block truncate mt-0.5" title={c.licenseNumber}>
                    {c.licenseState} Valid
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Labor Rate</span>
                <span className="text-base font-black text-slate-950">
                  ${c.hourlyRate}
                  <span className="text-xs font-normal text-slate-500">/hr</span>
                </span>
              </div>

              <button
                onClick={() => onRequestQuote(c)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-black text-xs tracking-tight transition flex items-center gap-1.5 shadow-xs"
              >
                <span>Request Bid</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredContractors.length === 0 && (
        <div className="text-center py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 space-y-3">
          <UserCheck className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="text-base font-black text-slate-800">No contractors match that search</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or clearing the specialty filter to view all verified finish contractors.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSpecialty('all');
              setOnlyRescueSpecialists(false);
            }}
            className="text-xs font-bold text-blue-600 hover:underline pt-1 block mx-auto"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
