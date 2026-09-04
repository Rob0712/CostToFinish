import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { RealEstateHomeSuite, RealEstateToolId } from './components/RealEstateHomeSuite';
import { CategoryGrid } from './components/CategoryGrid';
import { OtherCalculators } from './components/OtherCalculators';
import { SeoArticlesView } from './components/SeoArticlesView';
import { LeadCaptureModal } from './components/LeadCaptureModal';
import { SavedEstimatesDrawer } from './components/SavedEstimatesDrawer';
import { Footer } from './components/Footer';
import { CategoryId, HomeRenoResult, SavedProjectEstimate } from './types';

export default function App() {
  const [activeView, setActiveView] = useState<'home-reno' | 'all-calculators' | 'seo-articles' | 'other-calc'>('home-reno');
  const [realEstateTool, setRealEstateTool] = useState<RealEstateToolId>('shell-to-slab');
  const [activeSubCalcId, setActiveSubCalcId] = useState<CategoryId>('degree-completion');
  const [savedEstimates, setSavedEstimates] = useState<SavedProjectEstimate[]>(() => {
    try {
      const stored = localStorage.getItem('costtofinish_saved_estimates');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [leadModal, setLeadModal] = useState<{
    isOpen: boolean;
    mode: 'bids' | 'report';
    result?: HomeRenoResult;
  }>({
    isOpen: false,
    mode: 'bids',
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('costtofinish_saved_estimates', JSON.stringify(savedEstimates));
    } catch (e) {
      console.error('Failed to write to localStorage', e);
    }
  }, [savedEstimates]);

  const handleSaveEstimate = (result: HomeRenoResult, title: string) => {
    const newEstimate: SavedProjectEstimate = {
      id: 'est_' + Date.now(),
      title: title || `Home Finish (${result.effectiveSqFt} sq ft)`,
      category: 'home-reno',
      date: new Date().toISOString(),
      result,
    };
    setSavedEstimates((prev) => [newEstimate, ...prev]);
  };

  const handleDeleteEstimate = (id: string) => {
    setSavedEstimates((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLoadEstimate = (estimate: SavedProjectEstimate) => {
    setActiveView('home-reno');
    // Scroll to top
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleCategorySelect = (id: CategoryId) => {
    if (id === 'home-reno') {
      setRealEstateTool('shell-to-slab');
      setActiveView('home-reno');
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } else if (id === 'basement-attic') {
      setRealEstateTool('basement-attic');
      setActiveView('home-reno');
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } else if (id === 'diy-regret') {
      setRealEstateTool('diy-regret');
      setActiveView('home-reno');
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } else {
      setActiveSubCalcId(id);
      setActiveView('other-calc');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      {/* Global Header */}
      <Header
        activeView={activeView}
        onSelectView={(v) => {
          setActiveView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={savedEstimates.length}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        onRequestBids={() => setLeadModal({ isOpen: true, mode: 'bids' })}
      />

      {/* Main Dynamic Viewport */}
      <main className="flex-1">
        {/* Hero is shown on home-reno and all-calculators */}
        {(activeView === 'home-reno' || activeView === 'all-calculators') && (
          <HeroSection
            onSelectCategory={handleCategorySelect}
            onOpenHomeReno={() => {
              setRealEstateTool('shell-to-slab');
              setActiveView('home-reno');
              window.scrollTo({ top: 450, behavior: 'smooth' });
            }}
            onSelectRealEstateTool={(tool) => {
              setRealEstateTool(tool);
              setActiveView('home-reno');
              window.scrollTo({ top: 450, behavior: 'smooth' });
            }}
          />
        )}

        {/* View 1: Priority Real Estate & Home Finishing Suite */}
        {activeView === 'home-reno' && (
          <>
            <RealEstateHomeSuite
              key={realEstateTool}
              initialTool={realEstateTool}
              onSaveEstimate={handleSaveEstimate}
              onRequestBids={(res) => setLeadModal({ isOpen: true, mode: 'bids', result: res })}
              onOpenReportModal={(res) => setLeadModal({ isOpen: true, mode: 'report', result: res })}
            />
            {/* Exploration of the other categories */}
            <CategoryGrid
              onSelectCategory={handleCategorySelect}
              onOpenHomeReno={() => {
                setRealEstateTool('shell-to-slab');
                setActiveView('home-reno');
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
            />
          </>
        )}

        {/* View 2: All 10 Categories Showcase */}
        {activeView === 'all-calculators' && (
          <CategoryGrid
            onSelectCategory={handleCategorySelect}
            onOpenHomeReno={() => {
              setActiveView('home-reno');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* View 3: Specialized Calculators (Degree, Debt, DIY Regret, Car) */}
        {activeView === 'other-calc' && (
          <OtherCalculators
            initialAppId={activeSubCalcId}
            onSwitchToHomeReno={() => {
              setActiveView('home-reno');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* View 4: SEO Authority & Guides Library */}
        {activeView === 'seo-articles' && (
          <SeoArticlesView
            onOpenCalculator={(calcId) => {
              handleCategorySelect(calcId);
            }}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onSelectView={(v) => {
          setActiveView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCategory={handleCategorySelect}
      />

      {/* Lead Capture & PDF Modal */}
      <LeadCaptureModal
        isOpen={leadModal.isOpen}
        onClose={() => setLeadModal({ ...leadModal, isOpen: false })}
        mode={leadModal.mode}
        result={leadModal.result}
      />

      {/* Saved Estimates Drawer */}
      <SavedEstimatesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedEstimates={savedEstimates}
        onDeleteEstimate={handleDeleteEstimate}
        onLoadEstimate={handleLoadEstimate}
      />
    </div>
  );
}
