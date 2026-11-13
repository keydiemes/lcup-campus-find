import React from 'react';
import { useCampusFind } from '../context/CampusFindContext';
import { ClaimRecord, ReturnReceipt } from '../types';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Hourglass,
  FileText,
  MapPin,
  Calendar,
  Building,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface UserMyClaimsProps {
  onViewReceipt: (claim: ClaimRecord, receipt: ReturnReceipt) => void;
  onSearchCatalog: () => void;
}

export const UserMyClaims: React.FC<UserMyClaimsProps> = ({
  onViewReceipt,
  onSearchCatalog,
}) => {
  const { claims, currentUser } = useCampusFind();

  const myClaims = claims.filter((c) => c.claimantId === currentUser?.id);

  return (
    <div className="space-y-6">
      {/* Title Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">My Ownership Claims</h2>
        <p className="text-xs text-slate-500 mt-1">
          Monitor your property claims, review verification decisions, and access official release receipts.
        </p>

        {/* Office Notice Card */}
        <div className="mt-4 p-3.5 bg-blue-50/70 border border-blue-200/60 rounded-xl text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-[#080D91] shrink-0" />
            <div>
              <span className="font-bold text-[#080D91]">Lost and Found Management Office: </span>
              <span>Room 102, Main Building · Mon–Fri 8:00 AM – 5:00 PM</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-500 shrink-0">
            Present your LCUP ID Card upon claim release
          </span>
        </div>
      </div>

      {/* Claims List */}
      {myClaims.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">No property claims submitted</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
            If someone found your missing item on campus, you can find it in the public registry and submit proof of ownership to claim it.
          </p>
          <button
            onClick={onSearchCatalog}
            className="px-4 py-2 bg-[#080D91] hover:bg-[#060a75] text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Browse Found Items Registry
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myClaims.map((claim) => {
            const isApproved = claim.status === 'approved';
            const isRejected = claim.status === 'rejected';
            const isPending = claim.status === 'pending';

            return (
              <div
                key={claim.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-slate-300 transition-all"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#080D91] bg-blue-50 px-2 py-0.5 rounded border border-blue-200/50">
                        Claim {claim.id}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Item Ref: {claim.itemTrackingNumber}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{claim.itemTitle}</h3>
                  </div>

                  <div>
                    {isApproved ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Ownership Verified & Returned</span>
                      </span>
                    ) : isRejected ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span>Ownership Not Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                        <Hourglass className="w-4 h-4 text-amber-600" />
                        <span>Awaiting Office Verification</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Claim details body */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Your Submitted Ownership Proof:
                    </span>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      "{claim.ownershipProofDetails}"
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                      <span className="font-medium text-slate-700">Proof Category:</span>
                      <span className="font-mono capitalize">{claim.proofType.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Lost on {claim.dateLost} at {claim.lostLocation}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Administrative Decision & Notes:
                      </span>
                      {claim.adminNotes ? (
                        <p className="text-slate-700 italic leading-relaxed">
                          "{claim.adminNotes}"
                        </p>
                      ) : (
                        <p className="text-slate-400 italic">
                          No notes recorded yet. An administrator will review your submitted proof.
                        </p>
                      )}
                      {claim.reviewedBy && (
                        <p className="text-[10px] text-slate-400 mt-2 font-mono">
                          Handled by: {claim.reviewedBy}
                        </p>
                      )}
                    </div>

                    {/* If Approved, button to view Handover Certificate */}
                    {isApproved && claim.returnReceipt && (
                      <div className="pt-3 mt-2 border-t border-slate-200/70">
                        <button
                          onClick={() => onViewReceipt(claim, claim.returnReceipt!)}
                          className="w-full py-2 px-3 bg-[#080D91] hover:bg-[#060a75] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-300" />
                          <span>View Official Handover Certificate ({claim.returnReceipt.receiptNumber})</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
