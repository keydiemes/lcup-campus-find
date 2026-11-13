import React, { useState } from 'react';
import { useCampusFind } from '../context/CampusFindContext';
import { CATEGORY_LABELS } from '../data/seedData';
import {
  X,
  Printer,
  Download,
  Calendar,
  BarChart3,
  CheckCircle2,
  PieChart,
  ShieldCheck,
  Building,
} from 'lucide-react';

interface SummaryReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SummaryReportModal: React.FC<SummaryReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { items, claims, users, currentUser } = useCampusFind();
  const [timeFilter, setTimeFilter] = useState<'all' | '30days' | '7days'>('all');

  if (!isOpen) return null;

  // Filtered dataset according to timeframe
  const now = new Date().getTime();
  const filteredItems = items.filter((item) => {
    if (timeFilter === 'all') return true;
    const itemTime = new Date(item.createdAt).getTime();
    const days = (now - itemTime) / (1000 * 3600 * 24);
    return timeFilter === '30days' ? days <= 30 : days <= 7;
  });

  const filteredClaims = claims.filter((claim) => {
    if (timeFilter === 'all') return true;
    const claimTime = new Date(claim.submittedAt).getTime();
    const days = (now - claimTime) / (1000 * 3600 * 24);
    return timeFilter === '30days' ? days <= 30 : days <= 7;
  });

  // Calculate live dynamic metrics from actual application state
  const totalItems = filteredItems.length;
  const foundItems = filteredItems.filter((i) => i.type === 'found').length;
  const lostItems = filteredItems.filter((i) => i.type === 'lost').length;
  const approvedReports = filteredItems.filter((i) => i.reportStatus === 'approved').length;
  const pendingReports = filteredItems.filter((i) => i.reportStatus === 'pending').length;
  const rejectedReports = filteredItems.filter((i) => i.reportStatus === 'rejected').length;

  const totalClaims = filteredClaims.length;
  const approvedClaims = filteredClaims.filter((c) => c.status === 'approved').length;
  const pendingClaims = filteredClaims.filter((c) => c.status === 'pending').length;
  const rejectedClaims = filteredClaims.filter((c) => c.status === 'rejected').length;

  const claimedAndReturned = filteredItems.filter((i) => i.itemStatus === 'claimed').length;
  const resolutionRate = foundItems > 0 ? Math.round((claimedAndReturned / foundItems) * 100) : 0;
  const claimVerificationRate = totalClaims > 0 ? Math.round((approvedClaims / totalClaims) * 100) : 0;

  // Group by category
  const categoryCounts: Record<string, { total: number; claimed: number }> = {};
  filteredItems.forEach((i) => {
    const cat = i.category;
    if (!categoryCounts[cat]) {
      categoryCounts[cat] = { total: 0, claimed: 0 };
    }
    categoryCounts[cat].total += 1;
    if (i.itemStatus === 'claimed') {
      categoryCounts[cat].claimed += 1;
    }
  });

  // Group by location
  const locationCounts: Record<string, number> = {};
  filteredItems.forEach((i) => {
    const loc = i.location.split('(')[0].trim();
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;
  });

  // Export CSV handler
  const handleExportCSV = () => {
    const headers = ['TrackingNumber', 'Type', 'Title', 'Category', 'Location', 'DateOccurred', 'ReportStatus', 'ItemStatus', 'ReporterName'];
    const rows = filteredItems.map((i) => [
      i.trackingNumber,
      i.type,
      `"${i.title.replace(/"/g, '""')}"`,
      i.category,
      `"${i.location.replace(/"/g, '""')}"`,
      i.dateOccurred,
      i.reportStatus,
      i.itemStatus,
      `"${i.reporterName.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LCUP_CampusFind_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden max-h-[95vh] flex flex-col">
        {/* Top Control Bar (hidden in print) */}
        <div className="bg-[#080D91] text-white px-6 py-3.5 flex items-center justify-between shrink-0 no-print">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-300" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block">
                Official Administrative Summary Report
              </span>
              <span className="text-[10px] text-blue-100">
                La Consolacion University Philippines · Lost & Found Office
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Time Filter */}
            <div className="flex bg-white/10 rounded-lg p-0.5 text-xs text-white">
              <button
                onClick={() => setTimeFilter('all')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  timeFilter === 'all' ? 'bg-white text-[#080D91] font-bold' : 'hover:bg-white/10'
                }`}
              >
                All Records
              </button>
              <button
                onClick={() => setTimeFilter('30days')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  timeFilter === '30days' ? 'bg-white text-[#080D91] font-bold' : 'hover:bg-white/10'
                }`}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => setTimeFilter('7days')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  timeFilter === '7days' ? 'bg-white text-[#080D91] font-bold' : 'hover:bg-white/10'
                }`}
              >
                Last 7 Days
              </button>
            </div>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1 bg-white/15 hover:bg-white/25 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Download structured data"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-white/15 hover:bg-white/25 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Print official report"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>Print Report</span>
            </button>

            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-1 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div className="p-8 overflow-y-auto flex-1 bg-white" id="printable-summary-report">
          {/* Official Letterhead */}
          <div className="text-center border-b-2 border-slate-900 pb-5 mb-6">
            <img
              src="/assets/aistudio/image_f30422a8.png"
              alt="LCUP Seal"
              className="w-16 h-16 mx-auto mb-2 object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <h1 className="text-sm font-extrabold tracking-wider text-slate-900 uppercase">
              La Consolacion University Philippines
            </h1>
            <p className="text-[11px] text-slate-600 font-medium">
              City of Malolos, Bulacan · Unitas, Caritas, Veritas
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
              Office of Student Affairs and Services · Lost and Found Management Office
            </p>

            <div className="mt-4 pt-3 border-t border-slate-200">
              <h2 className="text-base font-extrabold text-[#080D91] tracking-wide uppercase">
                Campus Property Custody & Return Summary Report
              </h2>
              <p className="text-[11px] text-slate-600 mt-1">
                Generated on: <span className="font-mono font-semibold">{new Date().toLocaleString()}</span> · Filter: <span className="capitalize font-semibold">{timeFilter === 'all' ? 'Complete Academic Cycle (All Time)' : timeFilter}</span>
              </p>
            </div>
          </div>

          {/* Section 1: Executive KPI Metrics */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 border-b border-slate-200 pb-1">
              1. Executive Custody & Recovery Metrics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Total Items Logged
                </span>
                <span className="text-xl font-bold font-mono text-[#080D91] tabular-nums">
                  {totalItems}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {foundItems} Found · {lostItems} Lost
                </span>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Claims Handled
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                  {totalClaims}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {approvedClaims} Verified · {rejectedClaims} Rejected
                </span>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 bg-emerald-50/50 border-emerald-200/60">
                <span className="text-[10px] text-emerald-800 uppercase font-semibold block">
                  Reclaim & Return Rate
                </span>
                <span className="text-xl font-bold font-mono text-emerald-700 tabular-nums">
                  {resolutionRate}%
                </span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">
                  {claimedAndReturned} Items Handed Over
                </span>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Pending Verification
                </span>
                <span className="text-xl font-bold font-mono text-amber-700 tabular-nums">
                  {pendingReports + pendingClaims}
                </span>
                <span className="text-[10px] text-amber-600 block mt-0.5">
                  {pendingReports} Reports · {pendingClaims} Claims
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Category Breakdown Table */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 border-b border-slate-200 pb-1">
              2. Distribution by Property Category
            </h3>
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 text-[11px] font-bold uppercase">
                <tr>
                  <th className="py-2 px-3">Category Classification</th>
                  <th className="py-2 px-3 text-center">Items Recorded</th>
                  <th className="py-2 px-3 text-center">Successfully Reclaimed</th>
                  <th className="py-2 px-3 text-right">Recovery Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700 font-medium">
                {Object.entries(categoryCounts).map(([cat, counts]) => {
                  const rate = counts.total > 0 ? Math.round((counts.claimed / counts.total) * 100) : 0;
                  return (
                    <tr key={cat}>
                      <td className="py-2 px-3 font-semibold text-slate-900">
                        {CATEGORY_LABELS[cat] || cat}
                      </td>
                      <td className="py-2 px-3 text-center font-mono tabular-nums">
                        {counts.total}
                      </td>
                      <td className="py-2 px-3 text-center font-mono tabular-nums text-emerald-700 font-bold">
                        {counts.claimed}
                      </td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums">
                        {rate}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Section 3: Campus Locations Hotspots */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 border-b border-slate-200 pb-1">
              3. Campus Venue & Location Analysis
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {Object.entries(locationCounts).map(([loc, count]) => (
                <div key={loc} className="flex items-center justify-between p-2 rounded border border-slate-200 bg-slate-50">
                  <span className="font-medium text-slate-800 truncate mr-2">{loc}</span>
                  <span className="font-mono font-bold text-[#080D91] tabular-nums shrink-0">
                    {count} reports
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Narrative Summary & Remarks */}
          <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-700">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] mb-1">
              Office Narrative & Findings:
            </h4>
            <p>
              During this reporting cycle, the Lost and Found Management Office maintained a <strong>{resolutionRate}% property recovery and return rate</strong> for surrendered belongings. The University Library and Main Building continue to represent primary intake zones. Rigorous ownership verification protocols have prevented fraudulent releases, with <strong>{claimVerificationRate}% of submitted claims successfully verified</strong> against serial numbers, engraved markings, and physical receipts.
            </p>
          </div>

          {/* Authorized Signatory Block */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t-2 border-slate-900 text-xs text-center">
            <div>
              <div className="font-bold text-slate-900 border-b border-slate-800 pb-1 mb-1">
                {currentUser?.fullName || 'Corazon A. Aquino-Valdez'}
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-600 block">
                Administrative Officer, Lost & Found Office
              </span>
              <span className="text-[9px] text-slate-500">Prepared & Certified Correct</span>
            </div>

            <div>
              <div className="font-bold text-slate-900 border-b border-slate-800 pb-1 mb-1">
                Dean of Student Affairs & Services
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-600 block">
                Office of Student Affairs and Services (OSAS)
              </span>
              <span className="text-[9px] text-slate-500">Noted & Archived</span>
            </div>
          </div>
        </div>

        {/* Modal Footer (hidden in print) */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between shrink-0 no-print">
          <span className="text-xs text-slate-500 font-mono">
            CampusFind Reporting Engine · LCUP
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
