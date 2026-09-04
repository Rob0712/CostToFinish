import React, { useState } from 'react';
import {
  Home,
  GraduationCap,
  TrendingDown,
  Hammer,
  Car,
  HeartHandshake,
  BookOpen,
  Stethoscope,
  Code2,
  Anchor,
  ArrowRight,
  Sparkles,
  Clock,
  DollarSign,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { APP_CATEGORIES } from '../data/categoriesData';
import { AppCategoryMeta, CategoryBucket, CategoryId } from '../types';

interface Props {
  onSelectCategory: (id: CategoryId) => void;
  onOpenHomeReno: () => void;
}

export const CategoryGrid: React.FC<Props> = ({ onSelectCategory, onOpenHomeReno }) => {
  const [selectedBucket, setSelectedBucket] = useState<'all' | CategoryBucket>('all');

  const filteredCategories = selectedBucket === 'all'
    ? APP_CATEGORIES
    : APP_CATEGORIES.filter((c) => c.bucket === selectedBucket);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home':
        return <Home className="w-5 h-5 text-blue-600" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-blue-600" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-emerald-600" />;
      case 'TrendingDown':
        return <TrendingDown className="w-5 h-5 text-indigo-600" />;
      case 'Hammer':
        return <Hammer className="w-5 h-5 text-amber-600" />;
      case 'Car':
        return <Car className="w-5 h-5 text-rose-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-pink-600" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-teal-600" />;
      case 'Stethoscope':
        return <Stethoscope className="w-5 h-5 text-cyan-600" />;
      case 'Code2':
        return <Code2 className="w-5 h-5 text-violet-600" />;
      case 'Anchor':
        return <Anchor className="w-5 h-5 text-sky-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-blue-600" />;
    }
  };

  const handleCardClick = (cat: AppCategoryMeta) => {
    if (cat.id === 'home-reno') {
      onOpenHomeReno();
    } else {
      onSelectCategory(cat.id);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-blue-600">
              The 10 Specialized Engines
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 mt-1 tracking-tight">
              Whatever You Started, We Calculate How to Finish It.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-medium mt-2 max-w-2xl leading-relaxed">
              Traditional cost estimators look from the top down. CostToFinish.com starts from where you are right now—mid-project, over budget, or facing the final mile.
            </p>
          </div>

          {/* Bucket Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-200/80 p-1.5 rounded-2xl shrink-0 overflow-x-auto">
            <button
              onClick={() => setSelectedBucket('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black tracking-tight transition ${
                selectedBucket === 'all'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              All 10 Categories
            </button>
            <button
              onClick={() => setSelectedBucket('real-estate')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black tracking-tight transition ${
                selectedBucket === 'real-estate'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Real Estate & Home
            </button>
            <button
              onClick={() => setSelectedBucket('life-education')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black tracking-tight transition ${
                selectedBucket === 'life-education'
                  ? 'bg-white text-emerald-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Life & Education
            </button>
            <button
              onClick={() => setSelectedBucket('passion-finance')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black tracking-tight transition ${
                selectedBucket === 'passion-finance'
                  ? 'bg-white text-purple-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Passion & Finance
            </button>
          </div>
        </div>

        {/* 10 Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCardClick(cat)}
              className="bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-600 p-6 sm:p-7 shadow-xs hover:shadow-md transition flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center group-hover:scale-105 transition">
                    {getIcon(cat.iconName)}
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                    {cat.bucketLabel}
                  </span>
                </div>

                <h3 className="font-black text-xl text-slate-950 group-hover:text-blue-600 transition tracking-tight">
                  {cat.name}
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-1 italic">
                  "{cat.tagline}"
                </p>

                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-3.5 leading-relaxed">
                  {cat.description}
                </p>

                <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span className="flex items-center gap-1.5 font-bold text-slate-700">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
                      Typical Remaining Spend:
                    </span>
                    <span className="font-black text-slate-950">{cat.sampleStartingCost}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span className="flex items-center gap-1.5 font-bold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
                      Average Timeline to Done:
                    </span>
                    <span className="font-black text-slate-950">{cat.avgTimeRemaining}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 flex items-center justify-between border-t border-slate-100 text-xs font-black text-blue-600 group-hover:text-blue-700 uppercase tracking-wider">
                <span>
                  {cat.id === 'home-reno' ? 'Launch Flagship Tool' : 'Open Calculator'}
                </span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Why this fits banner */}
        <div className="mt-12 bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
              The Completion Engine Philosophy
            </span>
            <h3 className="text-2xl font-black text-slate-950 tracking-tight">
              Why Group These 10 Categories Together?
            </h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Every category shares a single psychological trigger: <strong className="text-slate-900 font-black">The Anxiety of Completion</strong>. Someone auditing their stalled kitchen renovation is the exact same person who needs a sober finish line for their degree, car restoration, or personal debt freedom date.
            </p>
          </div>
          <button
            onClick={onOpenHomeReno}
            className="shrink-0 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-black text-sm tracking-tight rounded-xl transition shadow-md"
          >
            Start with Home Reno
          </button>
        </div>
      </div>
    </section>
  );
};
