import React, { useState } from 'react';
import { CampusFindProvider, useCampusFind } from './context/CampusFindContext';
import { DemoSwitcherBar } from './components/DemoSwitcherBar';
import { Navbar } from './components/Navbar';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { SearchCatalog } from './components/SearchCatalog';
import { UserMyReports } from './components/UserMyReports';
import { UserMyClaims } from './components/UserMyClaims';
import { AdminPortal } from './components/AdminPortal';
import { AuthPage } from './components/AuthPage';
import { ReportItemModal } from './components/ReportItemModal';
import { ClaimItemModal } from './components/ClaimItemModal';
import { ItemDetailsModal } from './components/ItemDetailsModal';
import { ReviewClaimModal } from './components/ReviewClaimModal';
import { HandoverReceiptModal } from './components/HandoverReceiptModal';
import { SummaryReportModal } from './components/SummaryReportModal';
import { ItemRecord, ClaimRecord, ReturnReceipt } from './types';
import {
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

function CampusFindApp() {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    selectedItemForClaim,
    setSelectedItemForClaim,
    selectedClaimForReview,
    setSelectedClaimForReview,
    viewingReceipt,
    setViewingReceipt,
    resetAllData,
  } = useCampusFind();

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportModalType, setReportModalType] = useState<ItemRecord['type']>('lost');
  const [inspectingItem, setInspectingItem] = useState<ItemRecord | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isMobileAdminSidebarOpen, setIsMobileAdminSidebarOpen] = useState(false);

  const isAdmin = currentUser?.role === 'admin';
  const isAdminPortalView = isAdmin && activeTab.startsWith('admin_');

  // Dedicated authentication routes (not modal popups).
  const authPath = window.location.pathname.replace(/\/$/, '');
  if (authPath === '/login' || authPath === '/register') {
    return <AuthPage defaultMode={authPath === '/register' ? 'register' : 'login'} />;
  }

  const handleOpenReportModal = (type: ItemRecord['type'] = 'lost') => {
    if (!currentUser) {
      window.location.href = '/login';
    } else {
      setReportModalType(type);
      setIsReportOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E9EDF5]">
      {/* Interactive Demo Role Switcher Bar */}
      <DemoSwitcherBar />

      {isAdminPortalView ? (
        /* ============================================================ */
        /* ADMINISTRATOR PORTAL: Collapsible Sidebar + Admin Header      */
        /* ============================================================ */
        <div className="flex-1 flex min-h-0">
          {/* Modern Collapsible Left Sidebar */}
          <AdminSidebar
            isMobileOpen={isMobileAdminSidebarOpen}
            onCloseMobile={() => setIsMobileAdminSidebarOpen(false)}
          />

          {/* Admin Main Viewport with Dedicated Header */}
          <div className="flex-1 flex flex-col min-w-0">
            <AdminHeader
              onToggleMobileSidebar={() => setIsMobileAdminSidebarOpen(!isMobileAdminSidebarOpen)}
              onOpenSummaryModal={() => setIsSummaryOpen(true)}
            />

            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 overflow-y-auto">
              <AdminPortal
                onSelectItem={(item) => setInspectingItem(item)}
                onSelectClaim={(claim) => setSelectedClaimForReview(claim)}
                onViewReceipt={(claim, receipt) => setViewingReceipt({ claim, receipt })}
                onOpenSummaryModal={() => setIsSummaryOpen(true)}
              />
            </main>

            {/* Admin Console Institutional Sub-footer */}
            <footer className="bg-[#20243A] text-slate-300 border-t border-slate-700/50 mt-auto py-5 no-print">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/assets/aistudio/image_f30422a8.png"
                    alt="LCUP Seal"
                    className="w-5 h-5 object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span>
                    La Consolacion University Philippines · Lost & Found Management Office (Admin Console)
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[11px]">
                  <span>Custodian: Room 102 Main Bldg</span>
                  <button
                    onClick={resetAllData}
                    className="inline-flex items-center gap-1.5 text-amber-300 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-[11px] transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset Mock Records</span>
                  </button>
                </div>
              </div>
            </footer>
          </div>
        </div>
      ) : (
        /* ============================================================ */
        /* STUDENT & PUBLIC PORTAL: Unchanged Navigation + Student View */
        /* ============================================================ */
        <div className="flex-1 flex flex-col min-h-0">
          {/* Admin Banner when an administrator previews Student Catalog */}
          {isAdmin && (
            <div className="bg-[#050965] border-b border-amber-400/40 text-white px-4 py-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span className="font-semibold">
                  Viewing Public Student Catalog as Administrator
                </span>
                <span className="text-white/70 hidden sm:inline">
                  — Experience what students and faculty see when reporting & claiming items.
                </span>
              </div>
              <button
                onClick={() => setActiveTab('admin_overview')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition-colors shadow-2xs text-[11px]"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Return to Admin Console</span>
              </button>
            </div>
          )}

          {/* Main University Navbar (Unchanged Student Portal Navigation) */}
          <Navbar
            onOpenAuth={() => { window.location.href = '/login'; }}
            onOpenReportModal={(type) => handleOpenReportModal(type || 'lost')}
          />

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {activeTab === 'search' && (
              <SearchCatalog
                onSelectItem={(item) => setInspectingItem(item)}
                onClaimItem={(item) => {
                  if (!currentUser) {
                    window.location.href = '/login';
                  } else {
                    setSelectedItemForClaim(item);
                  }
                }}
                onReportLost={() => handleOpenReportModal('lost')}
                onReportFound={() => handleOpenReportModal('found')}
                onOpenReportModal={(type) => handleOpenReportModal(type || 'lost')}
              />
            )}

            {activeTab === 'my_reports' && (
              <UserMyReports
                onSelectItem={(item) => setInspectingItem(item)}
                onOpenReportModal={() => handleOpenReportModal('lost')}
              />
            )}

            {activeTab === 'my_claims' && (
              <UserMyClaims
                onViewReceipt={(claim, receipt) => setViewingReceipt({ claim, receipt })}
                onSearchCatalog={() => setActiveTab('search')}
              />
            )}
          </main>

          {/* Institutional Footer */}
          <footer className="bg-[#20243A] text-slate-300 border-t border-slate-700/50 mt-auto py-10 no-print">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
                {/* Column 1: Institutional Identity */}
                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src="/assets/aistudio/image_f30422a8.png"
                      alt="LCUP Official Seal"
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                        La Consolacion University Philippines
                      </h3>
                      <p className="text-[11px] text-amber-400 font-semibold tracking-wider">
                        Unitas · Caritas · Veritas · Established 1937
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-400 leading-relaxed max-w-md">
                    <strong>CampusFind</strong> is the official centralized digital lost and found management platform for students, faculty members, and personnel across all campus colleges and facilities.
                  </p>
                </div>

                {/* Column 2: Lost & Found Office Custody */}
                <div className="space-y-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                    Lost & Found Office
                  </h4>
                  <p className="text-slate-400 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Room 102, Main Building, LCUP Malolos Campus</span>
                  </p>
                  <p className="text-slate-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>+63 (044) 791-0153 local 102</span>
                  </p>
                  <p className="text-slate-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>lostandfound@lcup.edu.ph</span>
                  </p>
                </div>

                {/* Column 3: Prototype & Reset Controls */}
                <div className="space-y-2.5">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                    Prototype Architecture
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Client-side reactive state prototype with browser persistence. Shared data model connects students, faculty, and administrators.
                  </p>
                  <button
                    onClick={resetAllData}
                    className="inline-flex items-center gap-1.5 text-amber-300 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded text-[11px] transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Restore Default Mock Records</span>
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
                <p>© {new Date().getFullYear()} La Consolacion University Philippines. All rights reserved.</p>
                <p className="font-mono">CampusFind Digital Management System · Version 1.0 Prototype</p>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* MODALS */}
      <ReportItemModal
        isOpen={isReportOpen}
        initialType={reportModalType}
        onClose={() => setIsReportOpen(false)}
        onInspectMatch={(item) => {
          setIsReportOpen(false);
          setInspectingItem(item);
        }}
        onClaimMatch={(item) => {
          setIsReportOpen(false);
          setSelectedItemForClaim(item);
        }}
      />

      <ClaimItemModal
        isOpen={!!selectedItemForClaim}
        item={selectedItemForClaim}
        onClose={() => setSelectedItemForClaim(null)}
      />

      <ItemDetailsModal
        item={inspectingItem}
        onClose={() => setInspectingItem(null)}
        onClaim={(item) => {
          setInspectingItem(null);
          setSelectedItemForClaim(item);
        }}
        onSelectItem={(item) => setInspectingItem(item)}
      />

      <ReviewClaimModal
        claim={selectedClaimForReview}
        onClose={() => setSelectedClaimForReview(null)}
      />

      <HandoverReceiptModal
        data={viewingReceipt}
        onClose={() => setViewingReceipt(null)}
      />

      <SummaryReportModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <CampusFindProvider>
      <CampusFindApp />
    </CampusFindProvider>
  );
}
