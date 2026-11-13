import React, { useState, useMemo } from 'react';
import { useCampusFind } from '../../context/CampusFindContext';
import { CATEGORY_LABELS } from '../../data/seedData';
import {
  BarChart3,
  TrendingUp,
  Printer,
  Calendar,
  PieChart,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Tag,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface AdminSummaryReportsPageProps {
  onOpenSummaryModal: () => void;
}

export const AdminSummaryReportsPage: React.FC<AdminSummaryReportsPageProps> = ({
  onOpenSummaryModal,
}) => {
  const { items, claims } = useCampusFind();

  const [dateRange, setDateRange] = useState<'all' | 'month' | 'semester'>('all');

  // Filter items and claims by date range if selected
  const { filteredItems, filteredClaims } = useMemo(() => {
    if (dateRange === 'all') {
      return { filteredItems: items, filteredClaims: claims };
    }

    const now = new Date('2026-11-08T00:00:00Z'); // Current simulated system date
    const days = dateRange === 'month' ? 30 : 120;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const fItems = items.filter((i) => new Date(i.createdAt) >= cutoff);
    const fClaims = claims.filter((c) => new Date(c.submittedAt) >= cutoff);

    return { filteredItems: fItems, filteredClaims: fClaims };
  }, [items, claims, dateRange]);

  // Dynamic Statistics
  const totalReports = filteredItems.length;
  const lostReports = filteredItems.filter((i) => i.type === 'lost').length;
  const foundReports = filteredItems.filter((i) => i.type === 'found').length;
  const approvedReports = filteredItems.filter((i) => i.reportStatus === 'approved').length;
  const rejectedReports = filteredItems.filter((i) => i.reportStatus === 'rejected').length;
  const pendingReports = filteredItems.filter((i) => i.reportStatus === 'pending').length;

  const totalClaimsCount = filteredClaims.length;
  const approvedClaimsCount = filteredClaims.filter((c) => c.status === 'approved').length;
  const rejectedClaimsCount = filteredClaims.filter((c) => c.status === 'rejected').length;
  const pendingClaimsCount = filteredClaims.filter((c) => c.status === 'pending').length;

  const completedHandovers = filteredClaims.filter((c) => c.status === 'approved' && c.returnReceipt).length;

  const approvedFound = filteredItems.filter((i) => i.type === 'found' && i.reportStatus === 'approved').length;
  const recoveryRate = approvedFound > 0 ? Math.round((completedHandovers / approvedFound) * 100) : 0;

  // Breakdown by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of filteredItems) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [filteredItems]);

  // Breakdown by location
  const locationCounts = useMemo(() => {
    const locations = [
      'Main Library',
      'San Agustin Gymnasium',
      'Canteen',
      'Mother Rita Barcelo Building',
      'Mo. Consuelo Hall',
      'Student Lounge',
      'Science Laboratories',
      'Covered Court',
      'AVC',
      'Chapel',
    ];

    return locations
      .map((loc) => {
        const count = filteredItems.filter((i) => i.location.toLowerCase().includes(loc.toLowerCase())).length;
        return { name: loc, count };
      })
      .filter((l) => l.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [filteredItems]);

  // Monthly trends (Sep, Oct, Nov 2026)
  const monthlyTrends = useMemo(() => {
    return [
      {
        month: 'September 2026',
        lost: 3,
        found: 6,
        returned: 2,
      },
      {
        month: 'October 2026',
        lost: 6,
        found: 11,
        returned: 3,
      },
      {
        month: 'November 2026 (MTD)',
        lost: lostReports,
        found: foundReports,
        returned: completedHandovers,
      },
    ];
  }, [lostReports, foundReports, completedHandovers]);

  return (
    <div className="space-y-6">
      {/* Page Heading & Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#080D91] text-xs font-semibold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Module 5 · Performance Analytics & Official Summaries</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Summary Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate statistical summaries and monitor the university's lost and found activities.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Date range filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-[#080D91]"
          >
            <option value="all">All-Time Cumulative</option>
            <option value="month">Past 30 Days</option>
            <option value="semester">First Semester A.Y. 2026–2027</option>
          </select>

          <button
            onClick={onOpenSummaryModal}
            className="px-4 py-2 bg-[#080D91] hover:bg-[#060a75] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-amber-300" />
            <span>Generate Executive Report</span>
          </button>
        </div>
      </div>

      {/* Dynamic Calculated Statistics (9 Core Indicators) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Lost */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Lost Reports
          </span>
          <span className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums mt-1 block">
            {lostReports}
          </span>
          <span className="text-[10px] text-slate-400">
            {totalReports > 0 ? Math.round((lostReports / totalReports) * 100) : 0}% of all reports
          </span>
        </div>

        {/* Total Found */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Found Reports
          </span>
          <span className="text-2xl font-extrabold font-mono text-[#080D91] tabular-nums mt-1 block">
            {foundReports}
          </span>
          <span className="text-[10px] text-slate-400">
            {totalReports > 0 ? Math.round((foundReports / totalReports) * 100) : 0}% of all reports
          </span>
        </div>

        {/* Approved Reports */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Approved Reports
          </span>
          <span className="text-2xl font-extrabold font-mono text-emerald-700 tabular-nums mt-1 block">
            {approvedReports}
          </span>
          <span className="text-[10px] text-emerald-600 font-medium">Published to catalog</span>
        </div>

        {/* Rejected Reports */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Rejected Reports
          </span>
          <span className="text-2xl font-extrabold font-mono text-red-600 tabular-nums mt-1 block">
            {rejectedReports}
          </span>
          <span className="text-[10px] text-slate-400">Disapproved entries</span>
        </div>

        {/* Total Claims */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Claims Filed
          </span>
          <span className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums mt-1 block">
            {totalClaimsCount}
          </span>
          <span className="text-[10px] text-slate-400">{pendingClaimsCount} pending verification</span>
        </div>

        {/* Approved Claims */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Approved Claims
          </span>
          <span className="text-2xl font-extrabold font-mono text-emerald-700 tabular-nums mt-1 block">
            {approvedClaimsCount}
          </span>
          <span className="text-[10px] text-slate-400">Verified ownership</span>
        </div>

        {/* Rejected Claims */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Rejected Claims
          </span>
          <span className="text-2xl font-extrabold font-mono text-red-600 tabular-nums mt-1 block">
            {rejectedClaimsCount}
          </span>
          <span className="text-[10px] text-slate-400">Unverified / invalid proof</span>
        </div>

        {/* Completed Handovers */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Completed Handovers
          </span>
          <span className="text-2xl font-extrabold font-mono text-purple-700 tabular-nums mt-1 block">
            {completedHandovers}
          </span>
          <span className="text-[10px] text-purple-600 font-medium">Official certificates</span>
        </div>

        {/* Property Recovery Rate */}
        <div className="col-span-2 bg-gradient-to-br from-[#080D91] to-[#050965] p-4 rounded-xl text-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
              Property Recovery Rate
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
              {recoveryRate}%
            </span>
            <span className="text-[11px] text-blue-200">
              ({completedHandovers} of {approvedFound} found items restored to owners)
            </span>
          </div>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Viz 1: Lost vs Found Ratio & Review Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#080D91]" />
              <span>Lost vs. Found & Review Outcomes</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">{totalReports} total reports</span>
          </div>

          {/* Lost vs Found Stacked Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span className="text-[#080D91]">Found Belongings: {foundReports}</span>
              <span className="text-slate-600">Lost Reports: {lostReports}</span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${totalReports > 0 ? (foundReports / totalReports) * 100 : 50}%` }}
                className="bg-[#080D91] transition-all duration-500"
                title={`Found: ${foundReports}`}
              />
              <div
                style={{ width: `${totalReports > 0 ? (lostReports / totalReports) * 100 : 50}%` }}
                className="bg-amber-400 transition-all duration-500"
                title={`Lost: ${lostReports}`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>{totalReports > 0 ? Math.round((foundReports / totalReports) * 100) : 0}% Found</span>
              <span>{totalReports > 0 ? Math.round((lostReports / totalReports) * 100) : 0}% Lost</span>
            </div>
          </div>

          {/* Review Status Breakdown */}
          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Reports by Administrative Status
            </span>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs text-slate-700 font-medium mb-1">
                  <span>Approved & Published</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {approvedReports} ({totalReports > 0 ? Math.round((approvedReports / totalReports) * 100) : 0}%)
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${totalReports > 0 ? (approvedReports / totalReports) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-700 font-medium mb-1">
                  <span>Awaiting Triage (Pending)</span>
                  <span className="font-mono font-bold text-amber-700">
                    {pendingReports} ({totalReports > 0 ? Math.round((pendingReports / totalReports) * 100) : 0}%)
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${totalReports > 0 ? (pendingReports / totalReports) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-700 font-medium mb-1">
                  <span>Rejected Submissions</span>
                  <span className="font-mono font-bold text-red-600">
                    {rejectedReports} ({totalReports > 0 ? Math.round((rejectedReports / totalReports) * 100) : 0}%)
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${totalReports > 0 ? (rejectedReports / totalReports) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Viz 2: Claims & Verification Outcomes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Claims Verification Outcomes</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">{totalClaimsCount} total claims</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-700 font-medium mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span>Approved Ownership Claims</span>
                </span>
                <span className="font-mono font-bold text-emerald-700">
                  {approvedClaimsCount} ({totalClaimsCount > 0 ? Math.round((approvedClaimsCount / totalClaimsCount) * 100) : 0}%)
                </span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${totalClaimsCount > 0 ? (approvedClaimsCount / totalClaimsCount) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-700 font-medium mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Pending Evidence Examination</span>
                </span>
                <span className="font-mono font-bold text-amber-700">
                  {pendingClaimsCount} ({totalClaimsCount > 0 ? Math.round((pendingClaimsCount / totalClaimsCount) * 100) : 0}%)
                </span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${totalClaimsCount > 0 ? (pendingClaimsCount / totalClaimsCount) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-700 font-medium mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span>Rejected / Disapproved Claims</span>
                </span>
                <span className="font-mono font-bold text-red-600">
                  {rejectedClaimsCount} ({totalClaimsCount > 0 ? Math.round((rejectedClaimsCount / totalClaimsCount) * 100) : 0}%)
                </span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${totalClaimsCount > 0 ? (rejectedClaimsCount / totalClaimsCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Handover Compliance Callout */}
          <div className="p-3 bg-purple-50/70 border border-purple-200/80 rounded-xl flex items-center justify-between text-xs text-purple-950 mt-4">
            <div>
              <span className="font-bold block">Verified Property Returned:</span>
              <span className="text-[11px] text-purple-800">
                {completedHandovers} of {approvedClaimsCount} approved claims successfully claimed & handed over.
              </span>
            </div>
            <span className="font-mono font-bold text-purple-900 bg-white px-2 py-1 rounded border border-purple-200">
              {approvedClaimsCount > 0 ? Math.round((completedHandovers / approvedClaimsCount) * 100) : 0}% Release
            </span>
          </div>
        </div>

        {/* Viz 3: Items by Category */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#080D91]" />
              <span>Belongings Distribution by Category</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">{categoryCounts.length} categories</span>
          </div>

          <div className="space-y-2.5">
            {categoryCounts.map(([cat, count]) => {
              const pct = totalReports > 0 ? Math.round((count / totalReports) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span>{CATEGORY_LABELS[cat as any] || cat}</span>
                    <span className="font-mono text-slate-500">
                      {count} items ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#080D91] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Viz 4: Reports by Campus Location */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#080D91]" />
              <span>Campus Venue Incident Concentration</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Facilities monitored</span>
          </div>

          <div className="space-y-2.5">
            {locationCounts.map((loc) => {
              const pct = totalReports > 0 ? Math.round((loc.count / totalReports) * 100) : 0;
              return (
                <div key={loc.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span className="truncate max-w-[240px]">{loc.name}</span>
                    <span className="font-mono text-slate-500">
                      {loc.count} items ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Viz 5: Monthly Recovery Trends Table */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#080D91]" />
              <span>Monthly Incident & Handover Recovery Trends</span>
            </h3>
            <p className="text-[11px] text-slate-500">Historical performance across the academic term</p>
          </div>
          <button
            onClick={onOpenSummaryModal}
            className="text-xs font-semibold text-[#080D91] hover:underline"
          >
            Export Comprehensive Report &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-4">Academic Month</th>
                <th className="py-2.5 px-4 text-center">Lost Reports</th>
                <th className="py-2.5 px-4 text-center">Found In Custody</th>
                <th className="py-2.5 px-4 text-center">Returned to Owners</th>
                <th className="py-2.5 px-4 text-right">Monthly Recovery Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {monthlyTrends.map((t) => {
                const rate = t.found > 0 ? Math.round((t.returned / t.found) * 100) : 0;
                return (
                  <tr key={t.month} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{t.month}</td>
                    <td className="py-3 px-4 text-center font-mono text-slate-600">{t.lost}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-[#080D91]">{t.found}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-emerald-700">{t.returned}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                        {rate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
