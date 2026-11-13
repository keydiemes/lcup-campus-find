import React from 'react';
import { useCampusFind } from '../context/CampusFindContext';
import { ItemRecord } from '../types';
import { CATEGORY_LABELS } from '../data/seedData';
import {
  FileText,
  PlusCircle,
  MapPin,
  Calendar,
  Clock,
  Eye,
  CheckCircle2,
  AlertCircle,
  Hourglass,
  ArrowRight,
} from 'lucide-react';

interface UserMyReportsProps {
  onSelectItem: (item: ItemRecord) => void;
  onOpenReportModal: () => void;
}

export const UserMyReports: React.FC<UserMyReportsProps> = ({
  onSelectItem,
  onOpenReportModal,
}) => {
  const { items, currentUser } = useCampusFind();

  const myReports = items.filter((i) => i.reporterId === currentUser?.id);

  return (
    <div className="space-y-6">
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">My Submitted Reports</h2>
          <p className="text-xs text-slate-500 mt-1">
            Track and manage all lost and found reports submitted from your account.
          </p>
        </div>
        <button
          onClick={onOpenReportModal}
          className="px-4 py-2 bg-[#080D91] hover:bg-[#060a75] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
        >
          <PlusCircle className="w-4 h-4 text-amber-300" />
          <span>Submit New Report</span>
        </button>
      </div>

      {/* Reports Table or Cards */}
      {myReports.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">No reports filed yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            You haven't reported any lost or found items under your account.
          </p>
          <button
            onClick={onOpenReportModal}
            className="px-4 py-2 bg-[#080D91] hover:bg-[#060a75] text-white text-xs font-semibold rounded-lg transition-colors"
          >
            File Your First Report
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Tracking Code</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Item Details</th>
                  <th className="py-3 px-4">Date & Venue</th>
                  <th className="py-3 px-4">Review Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                      {report.trackingNumber}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        report.type === 'found'
                          ? 'bg-blue-100 text-[#080D91]'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {report.type === 'found' ? 'Found Item' : 'Lost Item'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-bold text-slate-900 truncate">{report.title}</p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {CATEGORY_LABELS[report.category] || report.category}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                      <div className="flex items-center gap-1 font-mono text-[11px]">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{report.dateOccurred}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                        <MapPin className="w-3 h-3 text-[#080D91]" />
                        <span className="truncate">{report.location}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {report.reportStatus === 'approved' ? (
                        <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                          <span>Approved & Published</span>
                        </div>
                      ) : report.reportStatus === 'rejected' ? (
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-red-700 font-semibold text-[11px]">
                            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                            <span>Report Rejected</span>
                          </div>
                          {report.adminRemarks && (
                            <p className="text-[10px] text-slate-500 italic max-w-xs truncate">
                              "{report.adminRemarks}"
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-700 font-semibold text-[11px]">
                          <Hourglass className="w-4 h-4 shrink-0 text-amber-600" />
                          <span>Awaiting Review</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onSelectItem(report)}
                        className="text-xs font-semibold text-[#080D91] hover:underline inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
