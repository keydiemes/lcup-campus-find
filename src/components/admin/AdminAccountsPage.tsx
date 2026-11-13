import React, { useState, useMemo } from 'react';
import { useCampusFind } from '../../context/CampusFindContext';
import { User, UserRole, ItemRecord, ClaimRecord } from '../../types';
import {
  Users,
  Search,
  Shield,
  GraduationCap,
  Briefcase,
  UserCheck,
  Building,
  Mail,
  Calendar,
  Eye,
  LogIn,
  X,
  FileText,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface AdminAccountsPageProps {
  onSelectItem?: (item: ItemRecord) => void;
  onSelectClaim?: (claim: ClaimRecord) => void;
}

export const AdminAccountsPage: React.FC<AdminAccountsPageProps> = ({
  onSelectItem,
  onSelectClaim,
}) => {
  const { users, currentUser, quickLoginAs, items, claims } = useCampusFind();

  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingUser, setInspectingUser] = useState<User | null>(null);

  // Summary counts
  const totalAccounts = users.length;
  const studentCount = users.filter((u) => u.role === 'student').length;
  const facultyCount = users.filter((u) => u.role === 'faculty').length;
  const staffCount = users.filter((u) => u.role === 'staff').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  // Filtered accounts
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = u.fullName.toLowerCase().includes(q);
        const matchEmail = u.email.toLowerCase().includes(q);
        const matchUniId = u.universityId.toLowerCase().includes(q);
        const matchDept = u.departmentOrCollege.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchUniId && !matchDept) return false;
      }

      return true;
    });
  }, [users, roleFilter, searchQuery]);

  // If a user is being inspected in the modal/drawer
  const userReports = inspectingUser ? items.filter((i) => i.reporterId === inspectingUser.id) : [];
  const userClaims = inspectingUser ? claims.filter((c) => c.claimantId === inspectingUser.id) : [];

  return (
    <div className="space-y-6">
      {/* Page Heading & Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#080D91] text-xs font-semibold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Module 6 · Identity Management & Directory</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Accounts Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            View and manage the simulated user accounts registered in CampusFind.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">Registered Accounts:</span>
          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
            {filteredUsers.length} of {totalAccounts}
          </span>
        </div>
      </div>

      {/* Summary Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div
          onClick={() => setRoleFilter('all')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            roleFilter === 'all'
              ? 'bg-blue-50/60 border-[#080D91] shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Accounts
          </span>
          <span className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums mt-1 block">
            {totalAccounts}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">All simulated users</p>
        </div>

        <div
          onClick={() => setRoleFilter('student')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            roleFilter === 'student'
              ? 'bg-blue-50 border-blue-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-blue-300'
          }`}
        >
          <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
            Students
          </span>
          <span className="text-2xl font-extrabold font-mono text-[#080D91] tabular-nums mt-1 block">
            {studentCount}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">Undergraduate & Grad</p>
        </div>

        <div
          onClick={() => setRoleFilter('faculty')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            roleFilter === 'faculty'
              ? 'bg-indigo-50 border-indigo-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-indigo-300'
          }`}
        >
          <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider block">
            Faculty
          </span>
          <span className="text-2xl font-extrabold font-mono text-indigo-700 tabular-nums mt-1 block">
            {facultyCount}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">Professors & Instructors</p>
        </div>

        <div
          onClick={() => setRoleFilter('staff')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            roleFilter === 'staff'
              ? 'bg-emerald-50 border-emerald-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
            Staff Personnel
          </span>
          <span className="text-2xl font-extrabold font-mono text-emerald-700 tabular-nums mt-1 block">
            {staffCount}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">Campus Administration</p>
        </div>

        <div
          onClick={() => setRoleFilter('admin')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            roleFilter === 'admin'
              ? 'bg-amber-50 border-amber-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
            Administrators
          </span>
          <span className="text-2xl font-extrabold font-mono text-amber-700 tabular-nums mt-1 block">
            {adminCount}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">Property Custodians</p>
        </div>
      </div>

      {/* Main Accounts Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Filter and Search Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 space-y-3 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Role Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All Accounts' },
                { id: 'student', label: 'Students' },
                { id: 'faculty', label: 'Faculty' },
                { id: 'staff', label: 'Staff' },
                { id: 'admin', label: 'Administrators' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setRoleFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    roleFilter === tab.id
                      ? 'bg-[#080D91] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, email, ID, college..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#080D91]"
              />
            </div>
          </div>
        </div>

        {/* Accounts Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Account ID</th>
                <th className="py-3 px-4">Full Name & Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">University ID</th>
                <th className="py-3 px-4">Department / College</th>
                <th className="py-3 px-4">Activity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">No accounts matched your search</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Try a different query or role tab</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const submittedCount = items.filter((i) => i.reporterId === u.id).length;
                  const claimsCount = claims.filter((c) => c.claimantId === u.id).length;

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Account ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                          {u.id}
                        </span>
                      </td>

                      {/* Full Name & Email */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#080D91] text-white flex items-center justify-center font-bold text-xs uppercase shadow-2xs">
                            {u.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{u.fullName}</p>
                            <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{u.email}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            u.role === 'admin'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : u.role === 'faculty'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : u.role === 'staff'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      {/* University ID */}
                      <td className="py-3.5 px-4 font-mono text-slate-700 whitespace-nowrap font-medium">
                        {u.universityId}
                      </td>

                      {/* Department / College */}
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                        {u.departmentOrCollege}
                      </td>

                      {/* Activity count */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-500">
                        <span>{submittedCount} reports</span> · <span>{claimsCount} claims</span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Active</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                        <button
                          onClick={() => setInspectingUser(u)}
                          className="px-2.5 py-1 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded text-xs font-semibold transition-colors inline-flex items-center gap-1"
                          title="Inspect account profile and associated activity"
                        >
                          <Eye className="w-3 h-3 text-slate-500" />
                          <span>Inspect</span>
                        </button>

                        {currentUser?.id !== u.id ? (
                          <button
                            onClick={() => quickLoginAs(u.id)}
                            className="px-2.5 py-1 text-xs font-semibold text-[#080D91] hover:bg-blue-50 bg-white border border-blue-200 rounded transition-colors inline-flex items-center gap-1 shadow-2xs"
                            title={`Simulate logging in as ${u.fullName}`}
                          >
                            <LogIn className="w-3 h-3 text-[#080D91]" />
                            <span>Simulate</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-bold px-2 py-1 bg-emerald-50 rounded border border-emerald-200">
                            Current User
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Details & Activity Modal */}
      {inspectingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-[#080D91] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-sm uppercase">
                  {inspectingUser.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold">{inspectingUser.fullName}</h3>
                  <p className="text-[10px] text-amber-300 font-mono">
                    {inspectingUser.universityId} · <span className="capitalize">{inspectingUser.role} Account</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectingUser(null)}
                className="text-white/70 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs text-slate-700">
              {/* Account Meta Grid */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Department / College</span>
                  <span className="font-semibold text-slate-900">{inspectingUser.departmentOrCollege}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Contact Phone</span>
                  <span className="font-semibold text-slate-900">{inspectingUser.contactNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Institutional Email</span>
                  <span className="font-semibold text-slate-900 font-mono">{inspectingUser.email}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">System Account ID</span>
                  <span className="font-semibold text-slate-900 font-mono">{inspectingUser.id}</span>
                </div>
              </div>

              {/* Reports Submitted by this user */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  Submitted Reports ({userReports.length})
                </h4>
                {userReports.length === 0 ? (
                  <p className="text-slate-400 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                    No reports submitted by this user.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {userReports.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <span className="font-mono text-[10px] text-slate-400">{item.trackingNumber}</span>
                          <h5 className="font-bold text-slate-900 truncate">{item.title}</h5>
                          <span className="text-[10px] text-slate-500 capitalize">{item.type} · {item.location}</span>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            item.reportStatus === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.reportStatus === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.reportStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Claims Filed by this user */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  Ownership Claims Filed ({userClaims.length})
                </h4>
                {userClaims.length === 0 ? (
                  <p className="text-slate-400 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                    No claims submitted by this user.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {userClaims.map((claim) => (
                      <div
                        key={claim.id}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <span className="font-mono text-[10px] text-blue-700 font-bold">{claim.id}</span>
                          <h5 className="font-bold text-slate-900 truncate">{claim.itemTitle}</h5>
                          <span className="text-[10px] text-slate-500 font-mono">Item: {claim.itemTrackingNumber}</span>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            claim.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : claim.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {claim.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
              <button
                onClick={() => setInspectingUser(null)}
                className="px-4 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-white transition-colors"
              >
                Close
              </button>
              {currentUser?.id !== inspectingUser.id && (
                <button
                  onClick={() => {
                    quickLoginAs(inspectingUser.id);
                    setInspectingUser(null);
                  }}
                  className="px-4 py-1.5 bg-[#080D91] hover:bg-[#060a75] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Simulate This User</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
