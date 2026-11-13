import React, { useState } from 'react';
import { useCampusFind } from '../context/CampusFindContext';
import { ClaimRecord, ItemRecord } from '../types';
import { CATEGORY_LABELS } from '../data/seedData';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Calendar,
  MapPin,
  User,
  ArrowRight,
  Eye,
  AlertTriangle,
} from 'lucide-react';

interface ReviewClaimModalProps {
  claim: ClaimRecord | null;
  onClose: () => void;
}

export const ReviewClaimModal: React.FC<ReviewClaimModalProps> = ({
  claim,
  onClose,
}) => {
  const { items, approveClaim, rejectClaim, currentUser } = useCampusFind();

  const [decisionMode, setDecisionMode] = useState<'view' | 'approve' | 'reject'>('view');
  const [releasingOfficer, setReleasingOfficer] = useState(
    currentUser?.fullName || 'Corazon A. Aquino-Valdez'
  );
  const [handoverLocation, setHandoverLocation] = useState(
    'Lost and Found Management Office, Room 102, Main Building'
  );
  const [handoverNotes, setHandoverNotes] = useState(
    'Physical ownership proof matched against logged distinguishing marks. Property released.'
  );
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState('');

  if (!claim) return null;

  const item = items.find((i) => i.id === claim.itemId);

  const handleApprove = () => {
    if (!releasingOfficer.trim() || !handoverLocation.trim()) {
      setError('Please provide releasing officer and handover location.');
      return;
    }

    approveClaim(claim.id, {
      handoverLocation: handoverLocation.trim(),
      releasingOfficer: releasingOfficer.trim(),
      notes: handoverNotes.trim(),
    });
    onClose();
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      setError('Please provide a reason explaining why ownership could not be verified.');
      return;
    }

    rejectClaim(claim.id, rejectionReason.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden max-h-[95vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#080D91] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="text-base font-bold text-white">Ownership Claim Verification</h2>
              <p className="text-xs text-blue-100">Claim Reference: {claim.id} · Item: {claim.itemTrackingNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Comparison Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Side-by-Side Verification Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* LEFT: Found Item Record */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#080D91]">
                  Official Found Item Record
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-500">
                  {claim.itemTrackingNumber}
                </span>
              </div>

              {item ? (
                <>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-500">
                      Category: {CATEGORY_LABELS[item.category] || item.category}
                    </p>
                  </div>

                  {item.imageUrl && (
                    <div className="h-36 rounded-lg overflow-hidden border border-slate-200 bg-white">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5 text-xs text-slate-700">
                    <p>
                      <strong>Found Location:</strong> {item.location}
                    </p>
                    <p>
                      <strong>Found Date:</strong> {item.dateOccurred} at {item.timeOccurred}
                    </p>
                    <p>
                      <strong>Current Storage:</strong> {item.storageLocation || 'Lost and Found Office'}
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700 block text-[11px] uppercase mb-1">
                      Recorded Distinguishing Marks (Official Note):
                    </span>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      "{item.distinguishingFeatures}"
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-500">Item record details not found in active catalog.</p>
              )}
            </div>

            {/* RIGHT: Claimant Proof of Ownership */}
            <div className="bg-blue-50/40 rounded-xl p-4 border border-blue-200/60 space-y-3">
              <div className="flex items-center justify-between border-b border-blue-200/60 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#080D91]">
                  Claimant Proof & Statement
                </span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  claim.status === 'approved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : claim.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {claim.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{claim.claimantName}</h3>
                <p className="text-xs text-slate-600 font-mono">
                  ID: {claim.claimantUniversityId} · {claim.claimantRole.toUpperCase()}
                </p>
                <p className="text-xs text-slate-500">{claim.claimantDepartment}</p>
                <p className="text-xs text-slate-500 font-mono">Phone: {claim.claimantPhone}</p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700">
                <p>
                  <strong>Reported Lost On:</strong> {claim.dateLost}
                </p>
                <p>
                  <strong>Reported Lost At:</strong> {claim.lostLocation}
                </p>
                <p>
                  <strong>Proof Type Provided:</strong> <span className="capitalize font-mono">{claim.proofType.replace('_', ' ')}</span>
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-blue-200 text-xs">
                <span className="font-bold text-[#080D91] block text-[11px] uppercase mb-1">
                  Submitted Ownership Details:
                </span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  "{claim.ownershipProofDetails}"
                </p>
              </div>

              {claim.proofDocumentUrl && (
                <div>
                  <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Attached Proof Image/Document:
                  </span>
                  <img
                    src={claim.proofDocumentUrl}
                    alt="Proof document"
                    className="h-28 rounded-lg border border-slate-200 object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Decision Modes */}
          {decisionMode === 'approve' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Approve Return & Generate Handover Receipt</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Releasing Officer *
                  </label>
                  <input
                    type="text"
                    value={releasingOfficer}
                    onChange={(e) => setReleasingOfficer(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Handover Location *
                  </label>
                  <input
                    type="text"
                    value={handoverLocation}
                    onChange={(e) => setHandoverLocation(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Administrative Release Notes
                  </label>
                  <input
                    type="text"
                    value={handoverNotes}
                    onChange={(e) => setHandoverNotes(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setDecisionMode('view')}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Confirm Property Handover
                </button>
              </div>
            </div>
          )}

          {decisionMode === 'reject' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-red-800 font-bold text-xs uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>Reject Claim - Ownership Not Verified</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-xs">
                  Reason for Rejection (Will be sent to claimant) *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={2}
                  placeholder="e.g. Distinguishing markings do not match physical item, or serial number verification failed."
                  className="w-full px-3 py-1.5 border border-red-300 rounded-lg bg-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setDecisionMode('view')}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-white text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>

          {claim.status === 'pending' && decisionMode === 'view' && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDecisionMode('reject')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Reject Claim (Unverified)
              </button>
              <button
                onClick={() => setDecisionMode('approve')}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify Ownership & Approve Return</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
