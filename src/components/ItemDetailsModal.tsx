import React, { useState } from 'react';
import { useCampusFind } from '../context/CampusFindContext';
import { ItemRecord } from '../types';
import { CATEGORY_LABELS } from '../data/seedData';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  User,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  FileText,
  Award,
  Lock,
  ArrowUpRight,
  Building,
} from 'lucide-react';

interface ItemDetailsModalProps {
  item: ItemRecord | null;
  onClose: () => void;
  onClaim: (item: ItemRecord) => void;
  onSelectItem?: (item: ItemRecord) => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  item,
  onClose,
  onClaim,
  onSelectItem,
}) => {
  const { currentUser, approveReport, rejectReport, claims, findPossibleMatches } = useCampusFind();
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'matches'>('details');

  if (!item) return null;

  const isAdmin = currentUser?.role === 'admin';
  const isOwner = currentUser?.id === item.reporterId;
  const isFound = item.type === 'found';
  const isClaimed = item.itemStatus === 'claimed';

  // Find related claims for this item
  const relatedClaims = claims.filter((c) => c.itemId === item.id);
  const approvedClaim = relatedClaims.find((c) => c.status === 'approved' && c.returnReceipt);
  const returnReceipt = approvedClaim?.returnReceipt;

  // Potential matching items if this is a lost item
  const potentialMatches = item.type === 'lost' ? findPossibleMatches(item) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#080D91] text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs bg-white/15 px-2.5 py-0.5 rounded text-amber-200 font-bold tracking-wider">
              {item.trackingNumber}
            </span>
            <span className="text-xs text-blue-100 font-medium hidden sm:inline">
              LCUP Property Registry Record
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-[#080D91] text-[#080D91]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Item Information
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'border-[#080D91] text-[#080D91]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Activity History & Audit</span>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-bold">
              {1 + (item.reportStatus !== 'pending' ? 1 : 0) + relatedClaims.length + (isClaimed ? 1 : 0)}
            </span>
          </button>
          {item.type === 'lost' && (
            <button
              onClick={() => setActiveTab('matches')}
              className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'matches'
                  ? 'border-amber-600 text-amber-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Matching Items in Custody</span>
              {potentialMatches.length > 0 && (
                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-bold">
                  {potentialMatches.length}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'details' && (
            <>
              {/* Main Title & Status Strip */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                      isFound ? 'bg-blue-100 text-[#080D91]' : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {isFound ? 'Found Belonging' : 'Reported Lost'}
                  </span>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                      item.reportStatus === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.reportStatus === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.reportStatus === 'approved'
                      ? 'Verified & Published'
                      : item.reportStatus === 'rejected'
                      ? 'Report Rejected'
                      : 'Awaiting Admin Review'}
                  </span>

                  {isClaimed && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-emerald-700 text-white">
                      Claimed & Handed Over
                    </span>
                  )}

                  {isFound && !isClaimed && item.reportStatus === 'approved' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-600 text-white">
                      Available for Claim
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-slate-900">{item.title}</h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span>{CATEGORY_LABELS[item.category] || item.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">Registered {new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Photo if present */}
              {item.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-72 flex items-center justify-center">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="max-h-72 w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Quick Matching Highlight for Lost items */}
              {item.type === 'lost' && potentialMatches.length > 0 && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-xs text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      <strong>{potentialMatches.length} potential matching found item(s)</strong> detected in the custody registry.
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('matches')}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold rounded-lg shrink-0 transition-colors flex items-center gap-1"
                  >
                    <span>View Matches</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Occurrence & Location Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#080D91] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Campus Venue
                    </span>
                    <span className="text-xs font-semibold text-slate-800">{item.location}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-[#080D91] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Date & Time
                    </span>
                    <span className="text-xs font-semibold text-slate-800 font-mono">
                      {item.dateOccurred} at {item.timeOccurred}
                    </span>
                  </div>
                </div>
              </div>

              {/* Full Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Description
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-white border border-slate-200 p-3.5 rounded-xl">
                  {item.description}
                </p>
              </div>

              {/* Distinguishing Features */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Distinguishing Features & Identifiers
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-amber-50/50 border border-amber-200/60 p-3.5 rounded-xl">
                  {item.distinguishingFeatures}
                </p>
              </div>

              {/* Storage / Custody location for found items */}
              {item.storageLocation && (
                <div className="bg-blue-50/60 border border-blue-200/60 rounded-xl p-3.5 text-xs">
                  <span className="font-semibold text-[#080D91] block uppercase tracking-wider text-[11px] mb-0.5">
                    Current Custody Safekeeping:
                  </span>
                  <span className="text-slate-800 font-medium">{item.storageLocation}</span>
                </div>
              )}

              {/* Reporter Information (Privacy protected for other students) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-1">
                <span className="font-semibold text-slate-700 block uppercase tracking-wider text-[11px]">
                  Report Source:
                </span>
                {isAdmin || isOwner ? (
                  <>
                    <p className="text-slate-700">
                      Logged by: <strong className="text-slate-900">{item.reporterName}</strong> ({item.reporterRole})
                    </p>
                    <p className="text-slate-600 font-mono text-[11px]">Contact: {item.reporterContact}</p>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      Filed by verified {item.reporterRole} · Personal contact archived with LCUP Custodian Office for privacy.
                    </span>
                  </div>
                )}
              </div>

              {/* Admin Remarks if any */}
              {item.adminRemarks && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs">
                  <span className="font-semibold text-slate-700 block uppercase tracking-wider text-[11px] mb-0.5">
                    Lost & Found Office Remarks:
                  </span>
                  <p className="text-slate-700 italic">"{item.adminRemarks}"</p>
                  {item.adminReviewedBy && (
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">
                      Reviewed by {item.adminReviewedBy} on {new Date(item.adminReviewedAt || '').toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {/* Activity History & Audit Trail Tab */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Chronological Item Lifecycle & Custody Audit Trail
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verifiable record of intake, administrative review, claims, and custody releases.
                </p>
              </div>

              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {/* Milestone 1: Report Submitted */}
                <div className="relative">
                  <div className="absolute -left-[27px] top-0.5 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center ring-4 ring-white">
                    <FileText className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        {item.type === 'found' ? 'Found Belonging Surrendered & Logged' : 'Lost Report Submitted'}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Incident recorded into LCUP digital registry by{' '}
                      <strong>{isAdmin || isOwner ? item.reporterName : `Verified ${item.reporterRole}`}</strong>.
                      Tracking number <span className="font-mono font-semibold text-[#080D91]">{item.trackingNumber}</span> assigned.
                    </p>
                  </div>
                </div>

                {/* Milestone 2: Custodian Review */}
                <div className="relative">
                  <div
                    className={`absolute -left-[27px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${
                      item.reportStatus === 'approved'
                        ? 'bg-emerald-600 text-white'
                        : item.reportStatus === 'rejected'
                        ? 'bg-red-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {item.reportStatus === 'approved' ? (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    ) : item.reportStatus === 'rejected' ? (
                      <AlertCircle className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        {item.reportStatus === 'approved'
                          ? 'Custodian Verification Approved'
                          : item.reportStatus === 'rejected'
                          ? 'Report Rejected During Review'
                          : 'Pending Custodian Verification'}
                      </span>
                      {item.adminReviewedAt && (
                        <span className="text-[11px] text-slate-500 font-mono">
                          {new Date(item.adminReviewedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {item.reportStatus === 'approved' && (
                        <>
                          Published to official university lost-and-found catalog by{' '}
                          <strong>{item.adminReviewedBy || 'Lost & Found Custodian Office'}</strong>.
                          {item.storageLocation && (
                            <span className="block mt-1 font-medium text-slate-700">
                              Physical Safekeeping: {item.storageLocation}
                            </span>
                          )}
                          {item.adminRemarks && (
                            <span className="block mt-1 italic text-slate-500">"{item.adminRemarks}"</span>
                          )}
                        </>
                      )}
                      {item.reportStatus === 'rejected' && (
                        <>
                          Report did not pass administrative verification.{' '}
                          {item.adminRemarks && <span className="italic">"{item.adminRemarks}"</span>}
                        </>
                      )}
                      {item.reportStatus === 'pending' && (
                        <>Queued for triage and verification by LCUP Property Custodian Office.</>
                      )}
                    </p>
                  </div>
                </div>

                {/* Milestone 3: Claims Filed */}
                {isFound && (
                  <div className="relative">
                    <div
                      className={`absolute -left-[27px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${
                        relatedClaims.length > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-600'
                      }`}
                    >
                      <User className="w-3 h-3" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          Ownership Claims Filed ({relatedClaims.length})
                        </span>
                      </div>
                      {relatedClaims.length > 0 ? (
                        <div className="mt-2 space-y-2">
                          {relatedClaims.map((claim) => (
                            <div
                              key={claim.id}
                              className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="font-semibold text-slate-800">
                                  {isAdmin || isOwner || currentUser?.id === claim.claimantId
                                    ? claim.claimantName
                                    : 'Registered Student Claimant'}
                                </span>
                                <span className="text-slate-400 text-[10px] block font-mono">
                                  Submitted {new Date(claim.submittedAt).toLocaleDateString()} · Proof:{' '}
                                  {claim.proofType.replace('_', ' ')}
                                </span>
                              </div>
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
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
                      ) : (
                        <p className="text-xs text-slate-500 mt-1 italic">
                          No ownership claims submitted to date. Belonging remains securely stored.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Milestone 4: Handover & Release */}
                <div className="relative">
                  <div
                    className={`absolute -left-[27px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${
                      isClaimed ? 'bg-emerald-700 text-white' : 'bg-slate-300 text-slate-600'
                    }`}
                  >
                    {isClaimed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Award className="w-3 h-3" />}
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        {isClaimed ? 'Custody Handover Completed' : 'Pending Return to Owner'}
                      </span>
                      {returnReceipt && (
                        <span className="text-[11px] text-emerald-700 font-mono font-bold">
                          {returnReceipt.receiptNumber}
                        </span>
                      )}
                    </div>
                    {returnReceipt ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-950 mt-2 space-y-1">
                        <div className="flex items-center justify-between font-semibold">
                          <span>Official Custody Handover Documented</span>
                          <span className="font-mono text-[11px]">{returnReceipt.handoverDate}</span>
                        </div>
                        <p className="text-slate-700">
                          Released to: <strong>{returnReceipt.claimantName}</strong> ({returnReceipt.claimantUniversityId})
                        </p>
                        <p className="text-slate-600 text-[11px]">
                          Releasing Officer: {returnReceipt.releasingOfficer} at {returnReceipt.handoverLocation}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 mt-1">
                        {isFound
                          ? 'Item remains in official university safekeeping awaiting verified owner claim.'
                          : 'Investigation ongoing. Notifications will be dispatched if matching items are surrendered.'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Potential Matching Items Tab (for Lost reports) */}
          {activeTab === 'matches' && item.type === 'lost' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2 text-amber-700">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">
                    Automated Registry Matches ({potentialMatches.length})
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  The system cross-references your lost report against approved found items currently held at the university Lost & Found Office.
                </p>
              </div>

              {potentialMatches.length === 0 ? (
                <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">No Direct Matches Found in Registry Yet</p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                    When someone turns in a matching item to the Lost & Found Office, you will automatically receive an in-app notification.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {potentialMatches.map((matchItem) => (
                    <div
                      key={matchItem.id}
                      className="border border-slate-200 hover:border-amber-400 bg-white rounded-xl p-3.5 transition-all shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          {matchItem.imageUrl ? (
                            <img
                              src={matchItem.imageUrl}
                              alt={matchItem.title}
                              className="w-14 h-14 object-cover rounded-lg border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#080D91] shrink-0 font-bold text-xs">
                              {matchItem.category.slice(0, 3).toUpperCase()}
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] text-slate-400">
                                {matchItem.trackingNumber}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                                Matched in Custody
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 mt-0.5">{matchItem.title}</h4>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-[#080D91]" />
                              <span>{matchItem.location}</span>
                              <span aria-hidden="true">·</span>
                              <span>Found {matchItem.dateOccurred}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-lg">
                        <span className="font-semibold text-slate-700">Distinguishing marks: </span>
                        {matchItem.distinguishingFeatures}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="text-[11px] text-slate-500">
                          Custody: <strong className="text-slate-700">{matchItem.storageLocation || 'L&F Office'}</strong>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (onSelectItem) {
                                onSelectItem(matchItem);
                              }
                            }}
                            className="px-2.5 py-1 text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1"
                          >
                            <span>Inspect</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              onClose();
                              onClaim(matchItem);
                            }}
                            className="px-3 py-1 bg-[#080D91] hover:bg-[#060a75] text-white text-[11px] font-semibold rounded-lg transition-colors shadow-xs"
                          >
                            Claim This Item
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-white text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {/* If user and item is found & available */}
            {isFound && !isClaimed && (
              <button
                onClick={() => {
                  onClose();
                  onClaim(item);
                }}
                className="px-5 py-2 bg-[#080D91] hover:bg-[#060a75] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
              >
                <span>Claim This Item</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
              </button>
            )}

            {/* If admin and pending report */}
            {isAdmin && item.reportStatus === 'pending' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const remarks = prompt('Enter rejection reason:') || 'Incomplete details';
                    rejectReport(item.id, remarks);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Reject Report
                </button>
                <button
                  onClick={() => {
                    approveReport(item.id);
                    onClose();
                  }}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Approve & Publish
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

