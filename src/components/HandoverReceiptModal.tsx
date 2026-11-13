import React from 'react';
import { ReturnReceipt, ClaimRecord } from '../types';
import { X, Printer, ShieldCheck, Download, Award } from 'lucide-react';

interface HandoverReceiptModalProps {
  data: { claim: ClaimRecord; receipt: ReturnReceipt } | null;
  onClose: () => void;
}

export const HandoverReceiptModal: React.FC<HandoverReceiptModalProps> = ({
  data,
  onClose,
}) => {
  if (!data) return null;

  const { claim, receipt } = data;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[95vh] flex flex-col">
        {/* Modal Top Control Bar (hidden in print) */}
        <div className="bg-[#080D91] text-white px-6 py-3.5 flex items-center justify-between shrink-0 no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Official Property Release Certificate
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-white/15 hover:bg-white/25 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-1 rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Content */}
        <div className="p-8 overflow-y-auto flex-1 bg-white" id="printable-certificate">
          {/* Institutional Header */}
          <div className="text-center border-b-2 border-slate-900 pb-5 mb-6">
            <img
              src="/assets/aistudio/image_f30422a8.png"
              alt="LCUP Official Seal"
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
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
              Lost and Found Management Office · Property Intake & Reclaim Services
            </p>

            <div className="mt-4 pt-3 border-t border-slate-200">
              <h2 className="text-base font-extrabold text-[#080D91] tracking-wide uppercase">
                Property Handover & Claim Certificate
              </h2>
              <p className="text-[11px] font-mono font-bold text-slate-700 mt-0.5">
                Certificate No: {receipt.receiptNumber}
              </p>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="space-y-5 text-xs text-slate-800">
            <p className="leading-relaxed">
              This document certifies that the university property referenced below has undergone complete ownership verification in accordance with LCUP Lost and Found Management Regulations, and has been officially released to its verified owner.
            </p>

            {/* Information Grid */}
            <div className="grid grid-cols-2 gap-4 border border-slate-200 rounded-lg p-4 bg-slate-50/50">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Property Tracking Code
                </span>
                <span className="font-mono font-bold text-sm text-[#080D91]">
                  {claim.itemTrackingNumber}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Date & Time of Release
                </span>
                <span className="font-mono font-semibold text-slate-800">
                  {new Date(receipt.handoverDate).toLocaleString()}
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Item Description
                </span>
                <span className="font-bold text-slate-900 text-xs">
                  {claim.itemTitle}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Verified Claimant Name
                </span>
                <span className="font-semibold text-slate-900">
                  {receipt.claimantName}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  University ID / Role
                </span>
                <span className="font-mono font-semibold text-slate-800">
                  {receipt.claimantUniversityId} ({claim.claimantRole})
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Verification Basis & Ownership Proof
                </span>
                <span className="text-slate-700 italic">
                  "{claim.ownershipProofDetails}"
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Release Custody Location
                </span>
                <span className="text-slate-800">
                  {receipt.handoverLocation}
                </span>
              </div>
            </div>

            {/* Legal Statement */}
            <p className="text-[10px] text-slate-500 italic text-justify leading-relaxed">
              By receiving this item, the claimant affirms full legal ownership. All corresponding catalog listings in CampusFind have been marked as claimed, and this case is closed in the official university records.
            </p>

            {/* Signature Blocks */}
            <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-slate-200">
              <div className="text-center">
                <div className="border-b border-slate-800 pb-1 mb-1 font-bold text-slate-900">
                  {receipt.releasingOfficer}
                </div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                  Authorized Releasing Officer
                </span>
                <span className="text-[9px] text-slate-400">Lost and Found Management Office</span>
              </div>

              <div className="text-center">
                <div className="border-b border-slate-800 pb-1 mb-1 font-bold text-slate-900">
                  {receipt.claimantName}
                </div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                  Claimant Signature & Acknowledgement
                </span>
                <span className="text-[9px] text-slate-400">LCUP Student / Faculty / Staff</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer (hidden in print) */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between shrink-0 no-print">
          <span className="text-[11px] text-slate-500 font-mono">
            La Consolacion University Philippines · ISO Compliant Records
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            Close Certificate
          </button>
        </div>
      </div>
    </div>
  );
};
