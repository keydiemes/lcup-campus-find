import React from 'react';
import { useCampusFind } from '../../context/CampusFindContext';
import { ItemRecord, ClaimRecord, ReturnReceipt } from '../../types';
import {
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertCircle,
  Hourglass,
  BarChart3,
  Archive,
  Users,
  Search,
  ArrowRight,
  TrendingUp,
  Printer,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';

interface AdminOverviewPageProps {
  onSelectItem: (item: ItemRecord) => void;
  onSelectClaim: (claim: ClaimRecord) => void;
  onViewReceipt: (claim: ClaimRecord, receipt: ReturnReceipt) => void;
  onOpenSummaryModal: () => void;
}

export const AdminOverviewPage: React.FC<AdminOverviewPageProps> = ({
  onSelectItem,
  onSelectClaim,
  onViewReceipt,
  onOpenSummaryModal,
}) => {
  const { items, claims, currentUser, setActiveTab, approveReport } = useCampusFind();

  // Statistics calculation
  const pendingReports = items.filter((i) => i.reportStatus === 'pending');
  const pendingClaims = claims.filter((c) => c.status === 'pending');
  const approvedItemsCount = items.filter((i) => i.reportStatus === 'approved').length;
  const claimedReturns = items.filter((i) => i.itemStatus === 'claimed');

  const foundItems = items.filter((i) => i.type === 'found' && i.reportStatus === 'approved');
  const returnRate = foundItems.length > 0 ? Math.round((claimedReturns.length / foundItems.length) * 100) : 0;

  // Completed returns with receipts
  const completedReturns = claims.filter((c) => c.status === 'approved' && c.returnReceipt);

  return (
    <div className="space-y-6">
      {/* Admin Command Header Banner */}
      <div className="bg-gradient-to-r from-[#050965] to-[#080D91] rounded-2xl text-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrative Command Console</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Overview & Operational Dashboard
          </h1>
          <p className="text-xs text-blue-100 mt-1">
            LCUP Lost and Found Office · Logged in as: <strong className="text-white">{currentUser?.fullName}</strong> ({currentUser?.departmentOrCollege})
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={onOpenSummaryModal}
            className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 backdrop-blur-xs shadow-xs"
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-300" />
            <span>Generate Summary Report</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Pending Reports */}
        <div
          onClick={() => setActiveTab('admin_reports')}
          className="bg-white rounded-xl border border-slate-200 hover:border-amber-400 p-4.5 shadow-xs cursor-pointer transition-all hover:shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Pending Reports
            </span>
            <span
              className={`p-2 rounded-lg transition-transform group-hover:scale-105 ${
                pendingReports.length > 0
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <Hourglass className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums tracking-tight">
              {pendingReports.length}
            </span>
            <span className="text-[11px] font-semibold text-amber-700">
              {pendingReports.length === 1 ? 'review needed' : 'awaiting review'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
            <span>Submitted by campus community</span>
            <span className="text-[#080D91] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Review &rarr;
            </span>
          </div>
        </div>

        {/* Metric 2: Pending Claims */}
        <div
          onClick={() => setActiveTab('admin_claims')}
          className="bg-white rounded-xl border border-slate-200 hover:border-[#080D91] p-4.5 shadow-xs cursor-pointer transition-all hover:shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Pending Claims
            </span>
            <span
              className={`p-2 rounded-lg transition-transform group-hover:scale-105 ${
                pendingClaims.length > 0
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums tracking-tight">
              {pendingClaims.length}
            </span>
            <span className="text-[11px] font-semibold text-[#080D91]">
              needs verification
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
            <span>Proof of ownership submitted</span>
            <span className="text-[#080D91] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Verify &rarr;
            </span>
          </div>
        </div>

        {/* Metric 3: Completed Handovers */}
        <div
          onClick={() => setActiveTab('admin_returns')}
          className="bg-white rounded-xl border border-slate-200 hover:border-emerald-400 p-4.5 shadow-xs cursor-pointer transition-all hover:shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Completed Handovers
            </span>
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 transition-transform group-hover:scale-105">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-700 tabular-nums tracking-tight">
              {claimedReturns.length}
            </span>
            <span className="text-[11px] font-semibold text-emerald-700">
              items returned
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
            <span>Official certificates issued</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Archive &rarr;
            </span>
          </div>
        </div>

        {/* Metric 4: Property Recovery Rate */}
        <div
          onClick={() => setActiveTab('admin_analytics')}
          className="bg-white rounded-xl border border-slate-200 hover:border-blue-400 p-4.5 shadow-xs cursor-pointer transition-all hover:shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Property Recovery Rate
            </span>
            <span className="p-2 rounded-lg bg-blue-100 text-[#080D91] border border-blue-200 transition-transform group-hover:scale-105">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-[#080D91] tabular-nums tracking-tight">
              {returnRate}%
            </span>
            <span className="text-[11px] font-semibold text-slate-600">
              resolution rate
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
            <span>Calculated from found custody</span>
            <span className="text-[#080D91] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Analytics &rarr;
            </span>
          </div>
        </div>
      </div>

      {/* Two Action Queue Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports Requiring Review */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                <Hourglass className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Reports Requiring Review
                </h3>
                <p className="text-[11px] text-slate-500">New submissions waiting for publication</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                {pendingReports.length} pending
              </span>
              <button
                onClick={() => setActiveTab('admin_reports')}
                className="text-xs font-semibold text-[#080D91] hover:underline"
              >
                View All
              </button>
            </div>
          </div>

          {pendingReports.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
              <span>All submitted reports have been reviewed</span>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingReports.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        {item.trackingNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${
                          item.type === 'found' ? 'bg-blue-100 text-[#080D91]' : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {item.type}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      By {item.reporterName} ({item.reporterRole}) · {item.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onSelectItem(item)}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded border border-slate-200 transition-colors"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => approveReport(item.id)}
                      className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded shadow-xs transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Claims Awaiting Ownership Verification */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 text-[#080D91] rounded-lg">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Claims Awaiting Verification
                </h3>
                <p className="text-[11px] text-slate-500">Students/staff claiming found property</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#080D91] bg-blue-50 px-2 py-0.5 rounded">
                {pendingClaims.length} pending
              </span>
              <button
                onClick={() => setActiveTab('admin_claims')}
                className="text-xs font-semibold text-[#080D91] hover:underline"
              >
                View All
              </button>
            </div>
          </div>

          {pendingClaims.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
              <span>No claims currently awaiting verification</span>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingClaims.slice(0, 5).map((claim) => (
                <div
                  key={claim.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-[#080D91]">
                        {claim.id}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Item: {claim.itemTrackingNumber}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                      {claim.itemTitle}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      Claimant: {claim.claimantName} ({claim.claimantUniversityId})
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectClaim(claim)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-[#080D91] hover:bg-[#060a75] rounded-lg shadow-xs flex items-center gap-1 shrink-0 transition-colors"
                  >
                    <span>Examine Proof</span>
                    <ArrowRight className="w-3 h-3 text-amber-300" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recently Handed Over Property Records */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Recent Verified Property Handover Records
            </h3>
            <p className="text-[11px] text-slate-500">Official certificates issued upon release to rightful owners</p>
          </div>
          <button
            onClick={() => setActiveTab('admin_returns')}
            className="text-xs font-semibold text-[#080D91] hover:underline"
          >
            View Full Archive &rarr;
          </button>
        </div>

        {completedReturns.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No completed returns recorded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {completedReturns.slice(0, 4).map((claim) => (
              <div
                key={claim.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between gap-3 hover:border-emerald-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                      {claim.returnReceipt?.receiptNumber}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {claim.returnReceipt?.handoverDate}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mt-1.5">
                    {claim.itemTitle}
                  </h4>
                  <p className="text-[11px] text-slate-600 line-clamp-1">
                    Owner: <strong>{claim.claimantName}</strong> ({claim.claimantUniversityId})
                  </p>
                </div>

                <button
                  onClick={() => onViewReceipt(claim, claim.returnReceipt!)}
                  className="w-full py-1.5 text-xs font-semibold text-[#080D91] bg-white hover:bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5 text-[#080D91]" />
                  <span>View Certificate</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
