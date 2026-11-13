import React, { useState, useMemo } from 'react';
import { useCampusFind } from '../../context/CampusFindContext';
import { ClaimRecord, ReturnReceipt, ItemRecord } from '../../types';
import { CATEGORY_LABELS } from '../../data/seedData';
import {
  Archive,
  Search,
  Printer,
  Calendar,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  Award,
  ArrowUpDown,
  Filter,
  Eye,
  User,
  Building,
} from 'lucide-react';

interface AdminHandoverArchivePageProps {
  onViewReceipt: (claim: ClaimRecord, receipt: ReturnReceipt) => void;
  onSelectItem: (item: ItemRecord) => void;
  onOpenSummaryModal: () => void;
}

export const AdminHandoverArchivePage: React.FC<AdminHandoverArchivePageProps> = ({
  onViewReceipt,
  onSelectItem,
  onOpenSummaryModal,
}) => {
  const { claims, items } = useCampusFind();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Only approved claims with issued ReturnReceipts
  const completedHandovers = useMemo(() => {
    return claims.filter((c) => c.status === 'approved' && c.returnReceipt);
  }, [claims]);

  // Overall statistics
  const totalCompleted = completedHandovers.length;
  const foundItems = items.filter((i) => i.type === 'found' && i.reportStatus === 'approved');
  const recoveryRate = foundItems.length > 0 ? Math.round((totalCompleted / foundItems.length) * 100) : 0;

  // Filtered and sorted handovers
  const filteredHandovers = useMemo(() => {
    return completedHandovers
      .filter((claim) => {
        if (categoryFilter !== 'all' && claim.itemCategory !== categoryFilter) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchReceipt = claim.returnReceipt?.receiptNumber.toLowerCase().includes(q);
          const matchTracking = claim.itemTrackingNumber.toLowerCase().includes(q);
          const matchTitle = claim.itemTitle.toLowerCase().includes(q);
          const matchClaimant = claim.claimantName.toLowerCase().includes(q);
          const matchUniId = claim.claimantUniversityId.toLowerCase().includes(q);
          const matchOfficer = claim.returnReceipt?.releasingOfficer.toLowerCase().includes(q);
          if (!matchReceipt && !matchTracking && !matchTitle && !matchClaimant && !matchUniId && !matchOfficer) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.returnReceipt?.handoverDate || a.submittedAt).getTime();
        const dateB = new Date(b.returnReceipt?.handoverDate || b.submittedAt).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [completedHandovers, categoryFilter, searchQuery, sortOrder]);

  return (
    <div className="space-y-6">
      {/* Page Heading & Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#080D91] text-xs font-semibold uppercase tracking-wider mb-1">
            <Archive className="w-4 h-4" />
            <span>Module 4 · Custody Release & Archival Ledger</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Handover Archive
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            View and manage the historical records of successfully returned university belongings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSummaryModal}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#080D91]" />
            <span>Print Ledger</span>
          </button>
        </div>
      </div>

      {/* Summary Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Completed Handovers
            </span>
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <span className="text-3xl font-extrabold font-mono text-emerald-700 tabular-nums mt-1.5 block">
            {totalCompleted}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">Verified certificates issued to owners</p>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Successful Return Rate
            </span>
            <span className="p-2 rounded-lg bg-blue-100 text-[#080D91]">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <span className="text-3xl font-extrabold font-mono text-[#080D91] tabular-nums mt-1.5 block">
            {recoveryRate}%
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">Calculated against verified found items</p>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Archive Compliance
            </span>
            <span className="p-2 rounded-lg bg-purple-100 text-purple-800">
              <FileCheck className="w-4 h-4" />
            </span>
          </div>
          <span className="text-3xl font-extrabold font-mono text-purple-700 tabular-nums mt-1.5 block">
            100%
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">All releases backed by serialized receipts</p>
        </div>
      </div>

      {/* Handover Records Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 space-y-3 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search receipt #, tracking ID, item, claimant..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#080D91]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#080D91]"
              >
                <option value="all">All Categories</option>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#080D91]"
              >
                <option value="newest">Newest Handover</option>
                <option value="oldest">Oldest Handover</option>
              </select>
            </div>
          </div>
        </div>

        {/* Handover Archive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Receipt Number</th>
                <th className="py-3 px-4">Handover Date</th>
                <th className="py-3 px-4">Item Name & Tracking Code</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Claimant (Verified Owner)</th>
                <th className="py-3 px-4">Original Finder</th>
                <th className="py-3 px-4">Releasing Officer</th>
                <th className="py-3 px-4 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHandovers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Archive className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">No handover records matched</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Try clearing filters or search keywords</p>
                  </td>
                </tr>
              ) : (
                filteredHandovers.map((claim) => {
                  const originalItem = items.find((i) => i.id === claim.itemId);
                  return (
                    <tr key={claim.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Serialized Receipt # */}
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-800 whitespace-nowrap">
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                          {claim.returnReceipt?.receiptNumber}
                        </span>
                      </td>

                      {/* Handover Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-600">
                        {claim.returnReceipt?.handoverDate}
                      </td>

                      {/* Item Name & Tracking */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 truncate">{claim.itemTitle}</p>
                          {originalItem && (
                            <button
                              onClick={() => onSelectItem(originalItem)}
                              className="text-slate-400 hover:text-[#080D91] transition-colors"
                              title="Inspect original item report"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] font-mono text-slate-400">{claim.itemTrackingNumber}</p>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                        {CATEGORY_LABELS[claim.itemCategory] || claim.itemCategory}
                      </td>

                      {/* Claimant */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-semibold text-slate-900">{claim.claimantName}</p>
                        <p className="text-[10px] font-mono text-slate-400">
                          {claim.claimantUniversityId} ({claim.claimantRole})
                        </p>
                      </td>

                      {/* Original Finder */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                        {originalItem ? (
                          <>
                            <p className="font-medium text-slate-800">{originalItem.reporterName}</p>
                            <p className="text-[10px] text-slate-400 capitalize">{originalItem.reporterRole}</p>
                          </>
                        ) : (
                          <span className="text-slate-400 italic">Surrendered anonymously</span>
                        )}
                      </td>

                      {/* Releasing Officer */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-700">
                        <p className="font-medium text-slate-900">{claim.returnReceipt?.releasingOfficer}</p>
                        <p className="text-[10px] text-slate-400">{claim.returnReceipt?.handoverLocation}</p>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onViewReceipt(claim, claim.returnReceipt!)}
                          className="px-2.5 py-1 text-xs font-semibold text-[#080D91] bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors inline-flex items-center gap-1 shadow-2xs"
                        >
                          <Printer className="w-3 h-3 text-[#080D91]" />
                          <span>Certificate</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
