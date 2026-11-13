import React, { useState, useMemo } from 'react';
import { useCampusFind } from '../../context/CampusFindContext';
import { ItemRecord, ItemType, ItemCategory, ReportStatus } from '../../types';
import { CATEGORY_LABELS, CAMPUS_LOCATIONS } from '../../data/seedData';
import {
  FileText,
  Search,
  Check,
  X,
  Eye,
  Filter,
  CheckCircle2,
  AlertCircle,
  Hourglass,
  ArrowUpDown,
  Building,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface AdminItemReportsPageProps {
  onSelectItem: (item: ItemRecord) => void;
}

export const AdminItemReportsPage: React.FC<AdminItemReportsPageProps> = ({ onSelectItem }) => {
  const { items, approveReport, rejectReport } = useCampusFind();

  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'lost' | 'found' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Dynamic Summary Indicators (Specific to Item Reports)
  const totalReports = items.length;
  const pendingReportsCount = items.filter((i) => i.reportStatus === 'pending').length;
  const approvedReportsCount = items.filter((i) => i.reportStatus === 'approved').length;
  const rejectedReportsCount = items.filter((i) => i.reportStatus === 'rejected').length;

  // Filtered and sorted reports
  const filteredReports = useMemo(() => {
    return items
      .filter((item) => {
        // Quick tab filter
        if (activeFilterTab === 'lost' && item.type !== 'lost') return false;
        if (activeFilterTab === 'found' && item.type !== 'found') return false;
        if (activeFilterTab === 'pending' && item.reportStatus !== 'pending') return false;
        if (activeFilterTab === 'approved' && item.reportStatus !== 'approved') return false;
        if (activeFilterTab === 'rejected' && item.reportStatus !== 'rejected') return false;

        // Dropdown filters
        if (typeFilter !== 'all' && item.type !== typeFilter) return false;
        if (statusFilter !== 'all' && item.reportStatus !== statusFilter) return false;
        if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
        if (locationFilter !== 'all' && !item.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;

        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchTracking = item.trackingNumber.toLowerCase().includes(q);
          const matchReporter = item.reporterName.toLowerCase().includes(q);
          const matchLocation = item.location.toLowerCase().includes(q);
          if (!matchTitle && !matchTracking && !matchReporter && !matchLocation) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [items, activeFilterTab, typeFilter, statusFilter, categoryFilter, locationFilter, searchQuery, sortOrder]);

  return (
    <div className="space-y-6">
      {/* Page Heading & Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#080D91] text-xs font-semibold uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Module 2 · Submission Review & Intake Registry</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Item Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review, verify, and manage lost and found item submissions across the university.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">Active Records:</span>
          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
            {filteredReports.length} of {totalReports}
          </span>
        </div>
      </div>

      {/* Summary Indicators (Item Reports exclusive) */}
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
            Total Reports
          </span>
          <span className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums mt-1 block">
            {totalReports}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">All registered submissions</p>
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
              Pending Reports
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <span className="text-2xl font-extrabold font-mono text-amber-700 tabular-nums mt-1 block">
            {pendingReportsCount}
          </span>
          <p className="text-[10px] text-amber-600 mt-0.5 font-medium">Awaiting official triage</p>
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
            Approved Reports
          </span>
          <span className="text-2xl font-extrabold font-mono text-emerald-700 tabular-nums mt-1 block">
            {approvedReportsCount}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">Verified & active in registry</p>
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
            Rejected Reports
          </span>
          <span className="text-2xl font-extrabold font-mono text-red-600 tabular-nums mt-1 block">
            {rejectedReportsCount}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">Disapproved submissions</p>
        </div>
      </div>

      {/* Main Workspace Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Navigation & Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 space-y-3.5 bg-slate-50/50">
          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All Reports', count: totalReports },
                { id: 'lost', label: 'Lost Items', count: items.filter((i) => i.type === 'lost').length },
                { id: 'found', label: 'Found Items', count: items.filter((i) => i.type === 'found').length },
                { id: 'pending', label: 'Pending', count: pendingReportsCount, isAlert: true },
                { id: 'approved', label: 'Approved', count: approvedReportsCount },
                { id: 'rejected', label: 'Rejected', count: rejectedReportsCount },
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

          {/* Detailed Filters & Search Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-200/60">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search item, tracking ID, reporter..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#080D91]"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#080D91]"
            >
              <option value="all">All Item Categories</option>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>

            {/* Campus Location Filter */}
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#080D91]"
            >
              <option value="all">All Campus Venues</option>
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {/* Report Type Dropdown */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#080D91]"
            >
              <option value="all">All Types (Lost & Found)</option>
              <option value="found">Found Belongings Only</option>
              <option value="lost">Reported Lost Only</option>
            </select>
          </div>
        </div>

        {/* Report Management Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Tracking Code</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Item Name & Category</th>
                <th className="py-3 px-4">Campus Location & Date</th>
                <th className="py-3 px-4">Submitted By</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Filter className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">No item reports matched the criteria</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Try clearing your filters or search keywords</p>
                  </td>
                </tr>
              ) : (
                filteredReports.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Tracking ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                        {item.trackingNumber}
                      </span>
                    </td>

                    {/* Report Type */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          item.type === 'found'
                            ? 'bg-blue-100 text-[#080D91]'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>

                    {/* Item Name & Category */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center gap-2">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="w-8 h-8 rounded object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-[#080D91] font-bold text-[10px] shrink-0">
                            {item.category.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{item.title}</p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {CATEGORY_LABELS[item.category] || item.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Location & Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                      <p className="font-medium text-slate-800 truncate max-w-xs">{item.location}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {item.dateOccurred} at {item.timeOccurred}
                      </p>
                    </td>

                    {/* Submitted By */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="font-semibold text-slate-900">{item.reporterName}</p>
                      <p className="text-[10px] text-slate-400 font-mono capitalize">
                        {item.reporterRole} · {item.reporterContact}
                      </p>
                    </td>

                    {/* Review Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded ${
                          item.reportStatus === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : item.reportStatus === 'rejected'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {item.reportStatus === 'approved'
                          ? 'Approved'
                          : item.reportStatus === 'rejected'
                          ? 'Rejected'
                          : 'Pending Review'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => onSelectItem(item)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded transition-colors inline-flex items-center gap-1"
                        title="Inspect full item details"
                      >
                        <Eye className="w-3 h-3 text-slate-500" />
                        <span>Inspect</span>
                      </button>

                      {item.reportStatus === 'pending' && (
                        <>
                          <button
                            onClick={() => approveReport(item.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded shadow-xs transition-colors inline-flex items-center gap-1"
                            title="Approve report and publish to registry"
                          >
                            <Check className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => {
                              const r = prompt('Reason for rejection:') || 'Incomplete details';
                              rejectReport(item.id, r);
                            }}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded transition-colors inline-flex items-center gap-1"
                            title="Reject report submission"
                          >
                            <X className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
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
