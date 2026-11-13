import React, { useState } from 'react';
import { useCampusFind } from '../context/CampusFindContext';
import { UserCheck, RefreshCw, ChevronDown, ShieldCheck, GraduationCap, Briefcase, Award } from 'lucide-react';

export const DemoSwitcherBar: React.FC = () => {
  const { currentUser, users, quickLoginAs, resetAllData } = useCampusFind();
  const [isOpen, setIsOpen] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />;
      case 'faculty':
        return <Award className="w-3.5 h-3.5 text-blue-200" />;
      case 'staff':
        return <Briefcase className="w-3.5 h-3.5 text-emerald-300" />;
      default:
        return <GraduationCap className="w-3.5 h-3.5 text-blue-200" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-amber-400/20 text-amber-200 border-amber-400/30';
      case 'faculty':
        return 'bg-blue-400/20 text-blue-200 border-blue-400/30';
      case 'staff':
        return 'bg-emerald-400/20 text-emerald-200 border-emerald-400/30';
      default:
        return 'bg-white/15 text-white border-white/20';
    }
  };

  const handleReset = () => {
    resetAllData();
    setResetConfirm(false);
  };

  return (
    <aside aria-label="Demo role switcher" className="bg-[#050965] border-b border-[#080D91]/40 text-white text-xs py-1.5 px-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <UserCheck className="w-3.5 h-3.5" />
            Interactive Demo Role:
          </span>

          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 px-2.5 py-1 rounded-md transition-colors font-medium text-white"
                title="Click to switch demo role"
              >
                {getRoleIcon(currentUser.role)}
                <span className="font-semibold">{currentUser.fullName}</span>
                <span className={`px-1.5 py-0.2 rounded border text-[10px] uppercase font-bold tracking-wider ${getRoleBadge(currentUser.role)}`}>
                  {currentUser.role}
                </span>
                <ChevronDown className="w-3 h-3 text-white/70" />
              </button>

              {isOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                  <div className="absolute left-0 mt-1.5 w-80 bg-white text-[#20243A] rounded-lg shadow-xl border border-slate-200 py-2 z-50 font-normal">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Switch Demo User / Role
                    </div>
                    <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                      {users.map((u) => {
                        const isCurrent = currentUser?.id === u.id;
                        return (
                          <button
                            key={u.id}
                            onClick={() => {
                              quickLoginAs(u.id);
                              setIsOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 flex items-start gap-3 hover:bg-slate-50 transition-colors ${
                              isCurrent ? 'bg-blue-50/70 border-l-2 border-[#080D91]' : ''
                            }`}
                          >
                            <div className="mt-0.5 p-1.5 rounded-full bg-slate-100 text-slate-600">
                              {getRoleIcon(u.role)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <p className="text-xs font-semibold text-slate-900 truncate">
                                  {u.fullName}
                                </p>
                                <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                  u.role === 'admin'
                                    ? 'bg-amber-100 text-amber-800'
                                    : u.role === 'faculty'
                                    ? 'bg-blue-100 text-blue-800'
                                    : u.role === 'staff'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {u.role}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 truncate">{u.departmentOrCollege}</p>
                              <p className="text-[10px] font-mono text-slate-400 mt-0.5">{u.email}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <span className="text-white/70 italic">Not logged in (Browsing as Guest)</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-white/70 text-[11px]">
            La Consolacion University Philippines · Malolos, Bulacan
          </span>

          {resetConfirm ? (
            <div className="flex items-center gap-1.5 bg-red-950/80 border border-red-500/40 px-2 py-0.5 rounded">
              <span className="text-[11px] text-red-200">Reset all mock records?</span>
              <button
                onClick={handleReset}
                className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded font-medium text-[10px]"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setResetConfirm(false)}
                className="px-1.5 py-0.5 text-white/70 hover:text-white text-[10px]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setResetConfirm(true)}
              className="flex items-center gap-1.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors text-[11px]"
              title="Reset all mock records to initial state"
            >
              <RefreshCw className="w-3 h-3 text-amber-300" />
              <span>Reset Demo Data</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
