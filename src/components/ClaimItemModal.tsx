import React, { useState } from 'react';
import { useCampusFind } from '../context/CampusFindContext';
import { ItemRecord, ProofType } from '../types';
import { CATEGORY_LABELS } from '../data/seedData';
import {
  X,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
  FileCheck,
  Upload,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface ClaimItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ItemRecord | null;
}

export const ClaimItemModal: React.FC<ClaimItemModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  const { currentUser, submitClaim } = useCampusFind();

  const [dateLost, setDateLost] = useState(() => new Date().toISOString().split('T')[0]);
  const [lostLocation, setLostLocation] = useState('');
  const [proofType, setProofType] = useState<ProofType>('bag_contents');
  const [ownershipProofDetails, setOwnershipProofDetails] = useState('');
  const [proofDocumentUrl, setProofDocumentUrl] = useState('');
  const [affirmed, setAffirmed] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [claimId, setClaimId] = useState('');

  if (!isOpen || !item) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofDocumentUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      setError('You must be signed in to submit an ownership claim.');
      return;
    }

    if (!lostLocation.trim()) {
      setError('Please state where you lost this item.');
      return;
    }

    if (!ownershipProofDetails.trim() || ownershipProofDetails.trim().length < 15) {
      setError('Please provide specific, verifiable details proving your ownership (at least 15 characters).');
      return;
    }

    if (!affirmed) {
      setError('Please certify that you are the rightful owner of this property.');
      return;
    }

    const res = submitClaim(item.id, {
      dateLost,
      lostLocation: lostLocation.trim(),
      ownershipProofDetails: ownershipProofDetails.trim(),
      proofType,
      proofDocumentUrl: proofDocumentUrl || undefined,
    });

    if (res.success && res.claim) {
      setClaimId(res.claim.id);
      setSuccess(true);
    } else {
      setError(res.error || 'Failed to submit claim.');
    }
  };

  const handleResetAndClose = () => {
    setSuccess(false);
    setLostLocation('');
    setOwnershipProofDetails('');
    setProofDocumentUrl('');
    setAffirmed(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#080D91] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="text-base font-bold text-white">Claim Found Property</h2>
              <p className="text-xs text-blue-100">Ownership Verification Procedure</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-white/70 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Claim Received for Verification</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Your ownership claim for <strong>{item.title}</strong> has been forwarded to the Lost and Found Office.
              An administrator will verify your proof against the physical item record.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 max-w-sm mx-auto text-center font-mono">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Official Claim ID</span>
              <span className="text-base font-bold text-[#080D91]">{claimId}</span>
            </div>

            <p className="text-[11px] text-slate-500">
              You can track the decision in your <strong className="text-slate-700">"My Claims"</strong> dashboard.
            </p>

            <div className="pt-2">
              <button
                onClick={handleResetAndClose}
                className="px-6 py-2 bg-[#080D91] hover:bg-[#060a75] text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Target Item Reference Card */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex items-start gap-3">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-200"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-slate-500">{item.trackingNumber}</span>
                  <span className="text-[10px] font-bold uppercase text-[#080D91] bg-blue-100/60 px-1.5 py-0.2 rounded">
                    Found Item
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">{item.title}</h4>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                  <MapPin className="w-3 h-3 text-[#080D91]" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>
            </div>

            {/* Claimant Identity Confirmation */}
            {currentUser && (
              <div className="bg-blue-50/50 border border-blue-200/60 rounded-xl p-3 text-xs text-slate-700">
                <span className="font-semibold text-[#080D91]">Claimant: </span>
                <span>{currentUser.fullName} ({currentUser.universityId}) · {currentUser.departmentOrCollege}</span>
              </div>
            )}

            {/* When and where did you lose it? */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date When You Lost It *
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="date"
                    value={dateLost}
                    onChange={(e) => setDateLost(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#080D91]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Place Where Lost *
                </label>
                <input
                  type="text"
                  value={lostLocation}
                  onChange={(e) => setLostLocation(e.target.value)}
                  placeholder="e.g. 2nd floor library near periodicals"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#080D91]"
                  required
                />
              </div>
            </div>

            {/* Primary Proof Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Ownership Proof Type *
              </label>
              <select
                value={proofType}
                onChange={(e) => setProofType(e.target.value as ProofType)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#080D91] bg-white text-slate-800"
              >
                <option value="bag_contents">Internal Contents / Bag Inventory (Describe items inside)</option>
                <option value="serial_number">Serial Number / IMEI / Engraving Description</option>
                <option value="lockscreen_passcode">Device Passcode / Lockscreen Photo / Wallpaper Description</option>
                <option value="receipt_invoice">Original Purchase Receipt / Invoice / Warranty Slip</option>
                <option value="matching_photo">Photo of You in Possession of the Item Prior to Loss</option>
                <option value="other">Other Distinguishing Secret Identifiers</option>
              </select>
            </div>

            {/* Detailed Proof Details */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Proof of Ownership *
              </label>
              <textarea
                value={ownershipProofDetails}
                onChange={(e) => setOwnershipProofDetails(e.target.value)}
                rows={3}
                placeholder="Describe confidential markings, specific contents, exact scratches, or lock screen passcode that the finder or public would not know..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#080D91]"
                required
              />
              <p className="text-[11px] text-slate-500 mt-1">
                The Lost & Found administrator uses these details to match against the item before releasing it.
              </p>
            </div>

            {/* Supporting Document / Photo Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Upload Supporting Image / Proof (Optional)
              </label>
              <label className="flex items-center gap-2 p-2.5 border border-dashed border-slate-300 hover:border-[#080D91] rounded-xl cursor-pointer bg-slate-50 hover:bg-blue-50/30 transition-all text-xs text-slate-600">
                <Upload className="w-4 h-4 text-slate-400" />
                <span>{proofDocumentUrl ? 'Proof image attached' : 'Upload photo of receipt, warranty, or previous picture with item'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Honor Code Affirmation */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={affirmed}
                  onChange={(e) => setAffirmed(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#080D91] focus:ring-[#080D91]"
                />
                <span className="text-[11px] text-slate-600 leading-tight">
                  I solemnly certify under the La Consolacion University Philippines Honor Code that I am the genuine and rightful owner of this item. False claims are subject to institutional disciplinary action.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#080D91] hover:bg-[#060a75] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
              >
                <span>Submit Claim</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
