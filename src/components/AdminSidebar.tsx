import React, { useState, useEffect } from 'react';
import { useCampusFind } from '../context/CampusFindContext';
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  Archive,
  BarChart3,
  Users,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  ExternalLink,
  GraduationCap,
  LogOut,
  Bell,
} from 'lucide-react';

interface AdminSidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isMobileOpen,
  onCloseMobile,
}) => {
  const {
    activeTab,
    setActiveTab,
    items,
    claims,
    currentUser,
    logout,
  } = useCampusFind();

  // Collapsed state persisted in localStorage
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('campusfind_admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  // Hover tooltip state for collapsed view
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    try {
      localStorage.setItem('campusfind_admin_sidebar_collapsed', String(nextState));
    } catch (e) {
      console.warn('Failed to save sidebar state', e);
    }
  };

  const pendingReportsCount = items.filter((i) => i.reportStatus === 'pending').length;
  const pendingClaimsCount = claims.filter((c) => c.status === 'pending').length;

  const navItems = [
    {
      id: 'admin_overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: 0,
    },
    {
      id: 'admin_reports',
      label: 'Item Reports',
      icon: FileText,
      badge: pendingReportsCount,
      badgeColor: 'bg-amber-400 text-slate-950',
    },
    {
      id: 'admin_claims',
      label: 'Claims Verification',
      icon: ShieldCheck,
      badge: pendingClaimsCount,
      badgeColor: 'bg-amber-400 text-slate-950',
    },
    {
      id: 'admin_returns',
      label: 'Handover Archive',
      icon: Archive,
      badge: 0,
    },
    {
      id: 'admin_analytics',
      label: 'Summary Reports',
      icon: BarChart3,
      badge: 0,
    },
    {
      id: 'admin_accounts',
      label: 'Accounts',
      icon: Users,
      badge: 0,
    },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    if (isMobileOpen) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <aside aria-label="Admin navigation" className="flex flex-col h-full bg-[#080D91] text-white select-none border-r border-[#080D91]/40 shadow-md">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
        <div className={`flex items-center gap-2.5 overflow-hidden transition-all ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <img
            src="/assets/aistudio/image_f30422a8.png"
            alt="LCUP Seal"
            className="w-9 h-9 object-contain shrink-0 drop-shadow-sm"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="text-base font-extrabold tracking-tight text-white leading-none truncate">
                CampusFind
              </h1>
              <span className="text-[10px] font-semibold text-amber-300 tracking-wider uppercase mt-1 block truncate">
                Admin Management Portal
              </span>
            </div>
          )}
        </div>

        {/* Desktop Collapse/Expand Toggle */}
        <button
          onClick={toggleCollapse}
          className={`hidden lg:flex p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0 ${
            isCollapsed ? 'hidden' : ''
          }`}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close Mobile Sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* When collapsed on desktop: show expand trigger button at top */}
      {isCollapsed && (
        <div className="hidden lg:flex justify-center p-2 border-b border-white/10">
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Expand Sidebar"
            aria-label="Expand Sidebar"
          >
            <PanelLeftOpen className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => setHoveredTab(item.id)}
              onMouseLeave={() => setHoveredTab(null)}
            >
              <button
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-xs text-left group ${
                  isActive
                    ? 'bg-white/15 text-white font-bold border-l-4 border-amber-400 shadow-xs'
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
              >
                <div className="relative shrink-0">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-amber-300' : 'text-blue-200'
                    }`}
                  />
                  {/* Collapsed Badge Dot */}
                  {isCollapsed && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-[#080D91]" />
                  )}
                </div>

                {!isCollapsed && (
                  <>
                    <span className="truncate flex-1 tracking-wide">{item.label}</span>
                    {item.badge > 0 && (
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0 shadow-xs ${
                          item.badgeColor || 'bg-amber-400 text-slate-950'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>

              {/* Hover Tooltip when collapsed */}
              {isCollapsed && hoveredTab === item.id && (
                <div className="hidden lg:flex fixed left-20 ml-2 z-50 bg-[#050965] text-white border border-white/20 text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-xl items-center gap-2 whitespace-nowrap animate-in fade-in duration-100">
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer: Officer Identity & Student Portal Link */}
      <div className="p-3 border-t border-white/10 space-y-2 shrink-0">
        {!isCollapsed ? (
          <div className="space-y-2">
            {/* View Student Portal Button */}
            <button
              onClick={() => setActiveTab('search')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-blue-100 hover:text-white text-xs font-semibold transition-colors border border-white/10"
              title="Switch to public student portal view"
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                <span>Student Catalog</span>
              </div>
              <ExternalLink className="w-3 h-3 text-white/60" />
            </button>

            {/* Officer Profile Card */}
            <div className="p-2.5 rounded-lg bg-black/20 border border-white/10 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <p className="text-xs font-bold text-white truncate">
                  {currentUser?.fullName || 'Corazon A. Aquino-Valdez'}
                </p>
                <p className="text-[10px] text-amber-300 font-mono truncate">
                  {currentUser?.universityId || 'LFO-ADM-01'} · Admin
                </p>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-md hover:bg-white/10 text-white/70 hover:text-red-300 transition-colors"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setActiveTab('search')}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              title="Switch to Student Catalog"
              aria-label="Switch to Student Catalog"
            >
              <GraduationCap className="w-4 h-4 text-amber-300" />
            </button>
            <button
              onClick={logout}
              className="p-2 rounded-lg text-white/70 hover:text-red-300 hover:bg-white/10 transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop & Tablet Sidebar (Sticky) */}
      <div
        className={`hidden lg:block shrink-0 transition-all duration-200 ease-in-out sticky top-7 h-[calc(100vh-1.75rem)] z-30 ${
          isCollapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        {sidebarContent}
      </div>

      {/* Mobile Off-Canvas Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
