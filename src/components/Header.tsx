import React from 'react';
import {
  CheckCircle2,
  Bookmark,
  Hammer,
  Package,
  Store,
  BookOpen,
  ArrowUpRight,
  User as UserIcon,
  LogOut,
  Home,
  FileText,
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type AppViewMode =
  | 'home-reno'
  | 'contractors'
  | 'materials'
  | 'seo-articles'
  | 'admin';

interface Props {
  activeView: AppViewMode;
  onSelectView: (view: AppViewMode) => void;
  savedCount: number;
  onOpenSavedDrawer: () => void;
  onRequestBids: () => void;
  onOpenAuthModal: () => void;
}

export const Header: React.FC<Props> = ({
  activeView,
  onSelectView,
  savedCount,
  onOpenSavedDrawer,
  onRequestBids,
  onOpenAuthModal,
}) => {
  const { currentUser, userProfile, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div
            onClick={() => onSelectView('home-reno')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-md group-hover:bg-blue-700 transition">
              <span className="text-xl font-black">C</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-300 -ml-1 mt-1 stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-slate-950 tracking-tighter">
                  CostToFinish<span className="text-blue-600">.com</span>
                </span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 tracking-wider uppercase hidden sm:inline-block border border-blue-200">
                  Home & Construction
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-bold tracking-tight hidden sm:block">
                Real Estate Completion & Renovation Takeoff Engine
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Focused on Real Estate & Home) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onSelectView('home-reno')}
              className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-black tracking-tight transition flex items-center gap-1.5 ${
                activeView === 'home-reno'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Finishing Engines</span>
            </button>

            {/* Contractors Directory Tab */}
            <button
              onClick={() => onSelectView('contractors')}
              className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-black tracking-tight transition flex items-center gap-1.5 ${
                activeView === 'contractors'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Hammer className="w-4 h-4" />
              <span>Contractors</span>
              <span
                className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-black ${
                  activeView === 'contractors' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                Verified
              </span>
            </button>

            {/* Construction Marketplace (Materials, Tools, Heavy Equipment) */}
            <button
              onClick={() => onSelectView('materials')}
              className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-black tracking-tight transition flex items-center gap-1.5 ${
                activeView === 'materials'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Marketplace</span>
              <span
                className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-black ${
                  activeView === 'materials' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'
                }`}
              >
                Tools & Materials
              </span>
            </button>

            {/* Renovation & Bank Guides */}
            <button
              onClick={() => onSelectView('seo-articles')}
              className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-black tracking-tight transition flex items-center gap-1.5 ${
                activeView === 'seo-articles'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Valuation Guides</span>
            </button>

            {/* Admin Monetization & Control Hub */}
            <button
              onClick={() => onSelectView('admin')}
              className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-black tracking-tight transition flex items-center gap-1.5 ${
                activeView === 'admin'
                  ? 'bg-slate-900 text-emerald-400 border border-slate-700 shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              <span>Admin Hub</span>
              <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-black bg-emerald-100 text-emerald-800">
                Revenue
              </span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Account Button with Role Indicator */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                  <div className={`w-5 h-5 rounded-full text-white font-bold flex items-center justify-center text-[10px] ${
                    userProfile?.role === 'contractor' ? 'bg-emerald-600' : 'bg-blue-600'
                  }`}>
                    {currentUser.displayName?.[0] || currentUser.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-slate-800 max-w-[100px] truncate leading-tight">
                      {currentUser.displayName || currentUser.email?.split('@')[0]}
                    </span>
                    {userProfile?.role === 'contractor' && (
                      <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider">
                        Contractor Pro
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="p-2 sm:px-2.5 sm:py-2 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition border border-transparent hover:border-rose-200"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition border border-slate-200 flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In / Join</span>
              </button>
            )}

            {/* Saved Estimates Button */}
            <button
              onClick={onOpenSavedDrawer}
              className="relative p-2 sm:px-3.5 sm:py-2.5 text-xs font-extrabold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5 border border-slate-200"
              title="View Saved Projects"
            >
              <Bookmark className="w-4 h-4 text-slate-700" />
              <span className="hidden sm:inline">Saved</span>
              {savedCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Contractor Bids Callout */}
            <button
              onClick={onRequestBids}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-5 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs sm:text-sm font-black tracking-tight rounded-xl shadow-md transition"
            >
              <span>Get Bids</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around border-t border-slate-100 py-2.5 text-xs font-black text-slate-700 px-1 gap-1">
          <button
            onClick={() => onSelectView('home-reno')}
            className={`py-1 px-2.5 rounded-lg whitespace-nowrap flex items-center gap-1 ${activeView === 'home-reno' ? 'bg-blue-50 text-blue-600 font-black' : ''}`}
          >
            <Home className="w-3 h-3" />
            <span>Estimators</span>
          </button>
          <button
            onClick={() => onSelectView('contractors')}
            className={`py-1 px-2.5 rounded-lg whitespace-nowrap flex items-center gap-1 ${activeView === 'contractors' ? 'bg-blue-50 text-blue-600 font-black' : ''}`}
          >
            <Hammer className="w-3 h-3" />
            <span>Contractors</span>
          </button>
          <button
            onClick={() => onSelectView('materials')}
            className={`py-1 px-2.5 rounded-lg whitespace-nowrap flex items-center gap-1 ${activeView === 'materials' ? 'bg-blue-50 text-blue-600 font-black' : ''}`}
          >
            <Store className="w-3 h-3" />
            <span>Marketplace</span>
          </button>
          <button
            onClick={() => onSelectView('seo-articles')}
            className={`py-1 px-2.5 rounded-lg whitespace-nowrap flex items-center gap-1 ${activeView === 'seo-articles' ? 'bg-blue-50 text-blue-600 font-black' : ''}`}
          >
            <FileText className="w-3 h-3" />
            <span>Guides</span>
          </button>
          <button
            onClick={() => onSelectView('admin')}
            className={`py-1 px-2.5 rounded-lg whitespace-nowrap flex items-center gap-1 ${activeView === 'admin' ? 'bg-emerald-50 text-emerald-700 font-black' : ''}`}
          >
            <BarChart3 className="w-3 h-3" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};
