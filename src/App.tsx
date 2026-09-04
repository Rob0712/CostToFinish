import React, { useState, useEffect } from 'react';
import { Header, AppViewMode } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { RealEstateHomeSuite, RealEstateToolId } from './components/RealEstateHomeSuite';
import { SeoArticlesView } from './components/SeoArticlesView';
import { ContractorDirectoryView } from './components/ContractorDirectoryView';
import { ConstructionMarketplaceView } from './components/ConstructionMarketplaceView';
import { AdminMonetizationDashboard } from './components/AdminMonetizationDashboard';
import { LeadCaptureModal } from './components/LeadCaptureModal';
import { SavedEstimatesDrawer } from './components/SavedEstimatesDrawer';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { CategoryId, HomeRenoResult, SavedProjectEstimate, ContractorProfile } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { saveEstimateToCloud, fetchUserEstimates, deleteEstimateFromCloud } from './lib/estimatesDb';

function MainApp() {
  const { currentUser } = useAuth();
  const [activeView, setActiveView] = useState<AppViewMode>('home-reno');
  const [realEstateTool, setRealEstateTool] = useState<RealEstateToolId>('shell-to-slab');
  const [savedEstimates, setSavedEstimates] = useState<SavedProjectEstimate[]>(() => {
    try {
      const stored = localStorage.getItem('costtofinish_saved_estimates');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialRole, setAuthModalInitialRole] = useState<'homeowner' | 'contractor'>('homeowner');
  const [leadModal, setLeadModal] = useState<{
    isOpen: boolean;
    mode: 'bids' | 'report' | 'direct_hire';
    result?: HomeRenoResult;
    selectedContractor?: ContractorProfile;
  }>({
    isOpen: false,
    mode: 'bids',
  });

  // Sync to localStorage as client cache
  useEffect(() => {
    try {
      localStorage.setItem('costtofinish_saved_estimates', JSON.stringify(savedEstimates));
    } catch (e) {
      console.error('Failed to write to localStorage', e);
    }
  }, [savedEstimates]);

  // When user logs in, pull their cloud estimates from Firestore
  useEffect(() => {
    if (!currentUser) return;
    async function loadCloudEstimates() {
      try {
        const cloudRecords = await fetchUserEstimates(currentUser!.uid);
        if (cloudRecords && cloudRecords.length > 0) {
          const mapped: SavedProjectEstimate[] = cloudRecords.map((r) => ({
            id: r.id,
            title: r.title,
            category: (r.category as CategoryId) || 'home-reno',
            date: r.date,
            result: r.details || {
              costToFinishContractor: r.totalCost,
              costToFinishDIY: r.diyCost || 0,
              effectiveSqFt: r.sqft || 0,
              remainingPercentage: 100 - (r.progressPercent || 0),
              completedPercentage: r.progressPercent || 0,
              totalScopeCost: r.totalCost,
            },
          }));

          // Merge local and cloud estimates by ID
          setSavedEstimates((localList) => {
            const combined = [...mapped];
            for (const item of localList) {
              if (!combined.some((c) => c.id === item.id)) {
                combined.push(item);
                saveEstimateToCloud(currentUser!.uid, item);
              }
            }
            return combined;
          });
        } else if (savedEstimates.length > 0) {
          for (const item of savedEstimates) {
            saveEstimateToCloud(currentUser.uid, item);
          }
        }
      } catch (err) {
        console.warn('Error loading cloud estimates:', err);
      }
    }
    loadCloudEstimates();
  }, [currentUser]);

  const handleSaveEstimate = async (result: HomeRenoResult, title: string) => {
    const newEstimate: SavedProjectEstimate = {
      id: 'est_' + Date.now(),
      title: title || `Home Finish (${result.effectiveSqFt} sq ft)`,
      category: 'home-reno',
      date: new Date().toISOString(),
      result,
    };
    setSavedEstimates((prev) => [newEstimate, ...prev]);

    if (currentUser) {
      try {
        await saveEstimateToCloud(currentUser.uid, newEstimate, {
          engineType: realEstateTool,
          sqft: result.effectiveSqFt,
        });
      } catch (err) {
        console.warn('Could not save estimate to cloud:', err);
      }
    }
  };

  const handleDeleteEstimate = async (id: string) => {
    setSavedEstimates((prev) => prev.filter((item) => item.id !== id));
    if (currentUser) {
      try {
        await deleteEstimateFromCloud(currentUser.uid, id);
      } catch (err) {
        console.warn('Could not delete estimate from cloud:', err);
      }
    }
  };

  const handleLoadEstimate = (estimate: SavedProjectEstimate) => {
    setActiveView('home-reno');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleSelectRealEstateTool = (tool: RealEstateToolId) => {
    setRealEstateTool(tool);
    setActiveView('home-reno');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleArticleCalculatorRequest = (id: CategoryId) => {
    if (id === 'basement-attic') {
      setRealEstateTool('basement-attic');
    } else if (id === 'diy-regret') {
      setRealEstateTool('diy-regret');
    } else {
      setRealEstateTool('shell-to-slab');
    }
    setActiveView('home-reno');
    window.scrollTo({ top: 400, behavior: 'smooth' });
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
        onOpenAuthModal={() => {
          setAuthModalInitialRole('homeowner');
          setIsAuthModalOpen(true);
        }}
      />

      {/* Main Dynamic Viewport */}
      <main className="flex-1">
        {/* Real Estate & Construction Hero Section */}
        {activeView === 'home-reno' && (
          <HeroSection
            onSelectRealEstateTool={handleSelectRealEstateTool}
            onExploreContractors={() => setActiveView('contractors')}
          />
        )}

        {/* View 1: Priority Real Estate & Home Finishing Suite */}
        {activeView === 'home-reno' && (
          <RealEstateHomeSuite
            key={realEstateTool}
            initialTool={realEstateTool}
            onSaveEstimate={handleSaveEstimate}
            onRequestBids={(res) => setLeadModal({ isOpen: true, mode: 'bids', result: res })}
            onOpenReportModal={(res) => setLeadModal({ isOpen: true, mode: 'report', result: res })}
          />
        )}

        {/* View 2: Complete Verified Contractor Directory */}
        {activeView === 'contractors' && (
          <ContractorDirectoryView
            onRequestQuote={(contractor) => {
              setLeadModal({
                isOpen: true,
                mode: 'direct_hire',
                selectedContractor: contractor,
              });
            }}
            onOpenContractorRegister={() => {
              setAuthModalInitialRole('contractor');
              setIsAuthModalOpen(true);
            }}
          />
        )}

        {/* View 3: Construction Marketplace (Materials, Tools & Equipment) */}
        {activeView === 'materials' && (
          <ConstructionMarketplaceView />
        )}

        {/* View 4: SEO Authority & Guides Library */}
        {activeView === 'seo-articles' && (
          <SeoArticlesView
            onOpenCalculator={handleArticleCalculatorRequest}
          />
        )}

        {/* View 5: Platform Owner Monetization, Contractors & Users Hub */}
        {activeView === 'admin' && (
          <AdminMonetizationDashboard />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onSelectView={(v) => {
          setActiveView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectTool={handleSelectRealEstateTool}
      />

      {/* Auth Modal with Contractor & Homeowner options */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialRole={authModalInitialRole}
        initialMode={authModalInitialRole === 'contractor' ? 'signup' : 'login'}
      />

      {/* Lead Capture, Bids & Direct Hire Modal */}
      <LeadCaptureModal
        isOpen={leadModal.isOpen}
        onClose={() =>
          setLeadModal({
            ...leadModal,
            isOpen: false,
            selectedContractor: undefined,
          })
        }
        mode={leadModal.mode}
        result={leadModal.result}
        selectedContractor={leadModal.selectedContractor}
      />

      {/* Saved Estimates Drawer */}
      <SavedEstimatesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedEstimates={savedEstimates}
        onDeleteEstimate={handleDeleteEstimate}
        onLoadEstimate={handleLoadEstimate}
        onOpenAuthModal={() => {
          setAuthModalInitialRole('homeowner');
          setIsAuthModalOpen(true);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
