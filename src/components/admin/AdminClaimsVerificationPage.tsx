import React, { useState, useMemo } from 'react';
import { useCampusFind } from '../../context/CampusFindContext';
import { ClaimRecord, ClaimStatus, ProofType } from '../../types';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Hourglass,
  ArrowRight,
  Filter,
  FileCheck,
  Clock,
  User,
  ArrowUpDown,
} from 'lucide-react';

interface AdminClaimsVerificationPageProps {
  onSelectClaim: (claim: ClaimRecord) => void;
}

export const AdminClaimsVerificationPage: React.FC<AdminClaimsVerificationPageProps> = ({
  onSelectClaim,
}) => {
  const { claims } = useCampusFind();

  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [proofFilter, setProofFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Summary indicators
  const totalClaims = claims.length;
  const pendingClaims = claims.filter((c) => c.status === 'pending').length;
  const approvedClaims = claims.filter((c) => c.status === 'approved').length;
  const rejectedClaims = claims.filter((c) => c.status === 'rejected').length;

  // Filtered and sorted claims
  const filteredClaims = useMemo(() => {
    return claims
      .filter((claim) => {
        if (activeFilterTab !== 'all' && claim.status !== activeFilterTab) return false;
        if (proofFilter !== 'all' && claim.proofType !== proofFilter) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchId = claim.id.toLowerCase().includes(q);
          const matchTracking = claim.itemTrackingNumber.toLowerCase().includes(q);
          const matchTitle = claim.itemTitle.toLowerCase().includes(q);
          const matchClaimant = claim.claimantName.toLowerCase().includes(q);
          const matchUniId = claim.claimantUniversityId.toLowerCase().includes(q);
          if (!matchId && !matchTracking && !matchTitle && !matchClaimant && !matchUniId) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.submittedAt).getTime();
        const timeB = new Date(b.submittedAt).getTime();
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [claims, activeFilterTab, proofFilter, searchQuery, sortOrder]);

  return (
    <div className="space-y-6">
      {/* Page Heading & Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#080D91] text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Module 3 · Ownership Adjudication & Evidence Examination</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Claims Verification
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review ownership claims and verify submitted proof before authorizing item returns.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">Filtered Claims:</span>
          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
            {filteredClaims.length} of {totalClaims}
          </span>
        </div>
      </div>

      {/* Summary Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveFilterTab('all')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeFilterTab === 'all'
              ? 'bg-blue-50/60 border-[#080D91] shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Claims
          </span>
          <span className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums mt-1 block">
            {totalClaims}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">All claims filed across campus</p>
        </div>

        <div
          onClick={() => setActiveFilterTab('pending')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeFilterTab === 'pending'
              ? 'bg-amber-50 border-amber-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Pending Verification
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <span className="text-2xl font-extrabold font-mono text-amber-700 tabular-nums mt-1 block">
            {pendingClaims}
          </span>
          <p className="text-[10px] text-amber-600 mt-0.5 font-medium">Needs evidence check</p>
        </div>

        <div
          onClick={() => setActiveFilterTab('approved')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeFilterTab === 'approved'
              ? 'bg-emerald-50 border-emerald-500 shadow-xs'
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Approved Claims
          </span>
          <span className="text-2xl font-extrabold font-mono text-emerald-700 tabular-nums mt-1 block">
            {approvedClaims}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">Proof verified & return authorized</p>
        </div>

        <div
          onClick={() => setActiveFilterTab('rejected')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeFilterTab === 'rejected'
              ? 'bg-red-50 border-red-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-red-300'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Rejected Claims
          </span>
          <span className="text-2xl font-extrabold font-mono text-red-600 tabular-nums mt-1 block">
            {rejectedClaims}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">Failed ownership verification</p>
        </div>
      </div>

      {/* Main Claims Workspace Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Filter and Search Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 space-y-3.5 bg-slate-50/50">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Status Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All Claims', count: totalClaims },
                { id: 'pending', label: 'Pending Verification', count: pendingClaims, isAlert: true },
                { id: 'approved', label: 'Approved Claims', count: approvedClaims },
                { id: 'rejected', label: 'Rejected Claims', count: rejectedClaims },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilterTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeFilterTab === tab.id
                      ? 'bg-[#080D91] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      activeFilterTab === tab.id
                        ? 'bg-white/20 text-white'
                        : tab.isAlert && tab.count > 0
                        ? 'bg-amber-400 text-slate-900'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Sort Order */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-medium"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Search & Proof Type Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Claim ID, item, claimant name, ID..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#080D91]"
              />
            </div>

            <select
              value={proofFilter}
              onChange={(e) => setProofFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#080D91]"
            >
              <option value="all">All Proof Types</option>
              <option value="serial_number">Serial Number / IMEI</option>
              <option value="receipt_invoice">Receipt / Purchase Invoice</option>
              <option value="matching_photo">Matching Photo / Timestamped Selfie</option>
              <option value="lockscreen_passcode">Lockscreen Passcode / Face ID</option>
              <option value="bag_contents">Item Content Inventory</option>
              <option value="other">Other Unique Characteristics</option>
            </select>
          </div>
        </div>

        {/* Claims Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Claim ID</th>
                <th className="py-3 px-4">Item Being Claimed</th>
                <th className="py-3 px-4">Claimant Details</th>
                <th className="py-3 px-4">Submitted Proof</th>
                <th className="py-3 px-4">Date Filed</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Filter className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">No ownership claims matched the criteria</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Try adjusting your filters or keyword query</p>
                  </td>
                </tr>
              ) : (
                filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Claim ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#080D91] whitespace-nowrap">
                      <span className="bg-blue-50 text-[#080D91] border border-blue-200 px-2 py-0.5 rounded">
                        {claim.id}
                      </span>
                    </td>

                    {/* Item Info */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-bold text-slate-900 truncate">{claim.itemTitle}</p>
                      <p className="text-[11px] font-mono text-slate-500">{claim.itemTrackingNumber}</p>
                    </td>

                    {/* Claimant */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="font-semibold text-slate-900">{claim.claimantName}</p>
                      <p className="text-[10px] font-mono text-slate-400">
                        {claim.claimantUniversityId} · <span className="capitalize">{claim.claimantRole}</span>
                      </p>
                    </td>

                    {/* Proof Type */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono text-slate-700 capitalize bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                        {claim.proofType.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Submission Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {new Date(claim.submittedAt).toLocaleDateString()}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded ${
                          claim.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : claim.status === 'rejected'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {claim.status === 'approved'
                          ? 'Approved'
                          : claim.status === 'rejected'
                          ? 'Rejected'
                          : 'Pending Review'}
                      </span>
                    </td>

                    {/* Verification Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onSelectClaim(claim)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs inline-flex items-center gap-1.5 transition-colors ${
                          claim.status === 'pending'
                            ? 'bg-[#080D91] hover:bg-[#060a75] text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                        title="Examine submitted proof and verify ownership"
                      >
                        <ShieldCheck
                          className={`w-3.5 h-3.5 ${
                            claim.status === 'pending' ? 'text-amber-300' : 'text-slate-500'
                          }`}
                        />
                        <span>{claim.status === 'pending' ? 'Examine & Verify' : 'View Case'}</span>
                        <ArrowRight className="w-3 h-3 opacity-70" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
