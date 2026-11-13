import React, { useState } from 'react';
import { useCampusFind } from '../context/CampusFindContext';
import {
  Menu,
  Bell,
  Clock,
  BarChart3,
  ShieldCheck,
  User,
  LogOut,
  GraduationCap,
} from 'lucide-react';

interface AdminHeaderProps {
  onToggleMobileSidebar: () => void;
  onOpenSummaryModal: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleMobileSidebar,
  onOpenSummaryModal,
}) => {
  const {
    activeTab,
    currentUser,
    notifications,
    markNotificationAsRead,
    clearNotifications,
    logout,
    setActiveTab,
  } = useCampusFind();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Filter admin notifications
  const adminNotifications = notifications.filter(
    (n) => n.userId === 'ADM-001' || n.userId === currentUser?.id
  );
  const unreadCount = adminNotifications.filter((n) => !n.read).length;

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'admin_overview':
        return 'Overview';
      case 'admin_reports':
        return 'Item Reports';
      case 'admin_claims':
        return 'Claims Verification';
      case 'admin_returns':
        return 'Handover Archive';
      case 'admin_analytics':
        return 'Summary Reports';
      case 'admin_accounts':
        return 'Accounts Directory';
      default:
        return 'Overview';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-7 z-20 shadow-2xs">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile Sidebar Trigger + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-[#080D91] hover:bg-slate-100 transition-colors"
            title="Open Navigation Menu"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs truncate">
            <span className="font-semibold text-slate-400 hidden sm:inline">Admin Portal</span>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <h2 className="font-bold text-slate-900 truncate">
              {getPageTitle(activeTab)}
            </h2>
          </div>
        </div>

        {/* Right: Quick Report Trigger, Notifications, Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenSummaryModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#080D91] border border-blue-200 text-xs font-semibold rounded-lg transition-colors shadow-2xs"
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#080D91]" />
            <span>Generate Report</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-600 hover:text-[#080D91] hover:bg-slate-100 rounded-lg transition-colors relative"
              title="Admin Notifications"
              aria-label="Admin Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 mt-2 w-88 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Bell className="w-3.5 h-3.5 text-[#080D91]" />
                      Administrative Alerts
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-[11px] text-[#080D91] hover:underline font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {adminNotifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No pending administrative alerts
                      </div>
                    ) : (
                      adminNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationAsRead(notif.id)}
                          className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                            !notif.read ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-semibold text-slate-900 leading-snug">
                              {notif.title}
                            </h4>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-[#080D91] shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400 font-mono">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(notif.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50/70"
            >
              <div className="w-7 h-7 rounded-full bg-[#080D91] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                {currentUser?.fullName.charAt(0) || 'A'}
              </div>
              <span className="text-xs font-semibold text-slate-800 hidden sm:inline">
                {currentUser?.fullName.split(' ')[0] || 'Admin'}
              </span>
            </button>

            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{currentUser?.fullName}</p>
                    <p className="text-[11px] text-slate-500">{currentUser?.email}</p>
                    <p className="text-[10px] font-mono text-slate-400 mt-1">
                      ID: {currentUser?.universityId}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                      {currentUser?.departmentOrCollege}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveTab('search');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-[#080D91]" />
                      <span>Switch to Student View</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
