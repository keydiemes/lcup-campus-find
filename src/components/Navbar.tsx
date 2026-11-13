import React, { useState } from 'react';
import { useCampusFind } from '../context/CampusFindContext';
import {
  Search,
  PlusCircle,
  FileText,
  CheckCircle2,
  Bell,
  LogOut,
  LogIn,
  Shield,
  BarChart3,
  Archive,
  Users,
  X,
  Building2,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenReportModal: (type?: 'lost' | 'found') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenReportModal }) => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    logout,
    notifications,
    markNotificationAsRead,
    clearNotifications,
    claims,
    items,
  } = useCampusFind();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Filter notifications for current user or admin
  const userNotifications = notifications.filter((n) => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') {
      return n.userId === 'ADM-001' || n.userId === currentUser.id;
    }
    return n.userId === currentUser.id;
  });

  const unreadCount = userNotifications.filter((n) => !n.read).length;
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-7 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Brand Wordmark with LCUP Seal */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab(isAdmin ? 'admin_overview' : 'search')}
              className="flex items-center gap-2.5 text-left group"
            >
              <img
                src="/assets/aistudio/image_f30422a8.png"
                alt="La Consolacion University Philippines Seal"
                className="w-10 h-10 object-contain drop-shadow-xs"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-[#080D91] flex items-center gap-1.5 leading-none">
                  CampusFind
                </span>
                <span className="text-[11px] font-medium text-slate-500 tracking-wide mt-0.5">
                  La Consolacion University Philippines
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('search')}
              className={`transition-colors whitespace-nowrap py-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'search'
                  ? 'border-[#080D91] text-[#080D91] font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Search Catalog</span>
            </button>

            <button
              onClick={() => {
                if (currentUser) {
                  setActiveTab('my_reports');
                } else {
                  onOpenAuth();
                }
              }}
              className={`transition-colors whitespace-nowrap py-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'my_reports'
                  ? 'border-[#080D91] text-[#080D91] font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>My Reports</span>
            </button>

            <button
              onClick={() => {
                if (currentUser) {
                  setActiveTab('my_claims');
                } else {
                  onOpenAuth();
                }
              }}
              className={`transition-colors whitespace-nowrap py-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'my_claims'
                  ? 'border-[#080D91] text-[#080D91] font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>My Claims</span>
            </button>
          </nav>

          {/* Zone 3: Primary Actions & User Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <>
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-slate-600 hover:text-[#080D91] hover:bg-slate-100 rounded-lg transition-colors relative"
                    title="Notifications"
                    aria-label="View notifications"
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
                            System Notifications
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
                          {userNotifications.length === 0 ? (
                            <div className="p-6 text-center text-xs text-slate-400">
                              No notifications at this time
                            </div>
                          ) : (
                            userNotifications.map((notif) => (
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
                                  <span>{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* User Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50/50"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#080D91] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                      {currentUser.fullName.charAt(0)}
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-28">
                        {currentUser.fullName.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                        {currentUser.role}
                      </span>
                    </div>
                  </button>

                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="text-xs font-bold text-slate-900">{currentUser.fullName}</p>
                          <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                          <p className="text-[10px] font-mono text-slate-400 mt-1">
                            ID: {currentUser.universityId}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                            {currentUser.departmentOrCollege}
                          </p>
                        </div>

                        <div className="py-1">
                          {isAdmin ? (
                            <button
                              onClick={() => {
                                setActiveTab('admin_overview');
                                setShowUserMenu(false);
                              }}
                              className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Shield className="w-3.5 h-3.5 text-[#080D91]" />
                              <span>Admin Dashboard</span>
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setActiveTab('my_reports');
                                  setShowUserMenu(false);
                                }}
                                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <FileText className="w-3.5 h-3.5 text-[#080D91]" />
                                <span>My Submitted Reports</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActiveTab('my_claims');
                                  setShowUserMenu(false);
                                }}
                                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>My Ownership Claims</span>
                              </button>
                            </>
                          )}
                        </div>

                        <div className="border-t border-slate-100 pt-1">
                          <button
                            onClick={() => {
                              logout();
                              setShowUserMenu(false);
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
              </>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#080D91] hover:bg-[#060a75] rounded-lg transition-colors shadow-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-100 text-xs no-scrollbar">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-3 py-1.5 rounded-lg shrink-0 font-medium ${
              activeTab === 'search' ? 'bg-[#080D91] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Search Catalog
          </button>
          <button
            onClick={() => {
              if (currentUser) {
                setActiveTab('my_reports');
              } else {
                onOpenAuth();
              }
            }}
            className={`px-3 py-1.5 rounded-lg shrink-0 font-medium ${
              activeTab === 'my_reports' ? 'bg-[#080D91] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Reports
          </button>
          <button
            onClick={() => setActiveTab('my_claims')}
            className={`px-3 py-1 rounded-md shrink-0 font-medium ${
              activeTab === 'my_claims' ? 'bg-[#080D91] text-white' : 'text-slate-600'
            }`}
          >
            My Claims
          </button>
        </div>
      </div>
    </header>
  );
};
