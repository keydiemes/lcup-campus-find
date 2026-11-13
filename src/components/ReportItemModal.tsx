import React, { useState, useEffect } from 'react';
import { useCampusFind } from '../context/CampusFindContext';
import { ItemType, ItemCategory, ItemRecord } from '../types';
import { CAMPUS_LOCATIONS, CATEGORY_LABELS } from '../data/seedData';
import {
  X,
  PlusCircle,
  HelpCircle,
  MapPin,
  Calendar,
  Clock,
  Camera,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Building,
  Image as ImageIcon,
} from 'lucide-react';

interface ReportItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: ItemType;
  onInspectMatch?: (item: ItemRecord) => void;
  onClaimMatch?: (item: ItemRecord) => void;
}

export const ReportItemModal: React.FC<ReportItemModalProps> = ({
  isOpen,
  onClose,
  initialType = 'lost',
  onInspectMatch,
  onClaimMatch,
}) => {
  const { submitReport, currentUser, findPossibleMatches } = useCampusFind();

  const [type, setType] = useState<ItemType>(initialType);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('electronics');
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [dateOccurred, setDateOccurred] = useState(() => new Date().toISOString().split('T')[0]);
  const [timeOccurred, setTimeOccurred] = useState('14:00');
  const [description, setDescription] = useState('');
  const [distinguishingFeatures, setDistinguishingFeatures] = useState('');
  const [storageLocation, setStorageLocation] = useState('Turned over to Lost & Found Office (Main Bldg Room 102)');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdItemTracking, setCreatedItemTracking] = useState('');
  const [detectedMatches, setDetectedMatches] = useState<ItemRecord[]>([]);

  // Sync type whenever modal opens with initialType
  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setIsSuccess(false);
      setError('');
      setDetectedMatches([]);
    }
  }, [isOpen, initialType]);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const setPresetPhoto = (url: string) => {
    setImageUrl(url);
    setImagePreview(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      setError('You must be logged in to file an item report.');
      return;
    }

    if (!title.trim()) {
      setError('Please provide an item name.');
      return;
    }

    if (!description.trim()) {
      setError('Please provide a detailed description of the item.');
      return;
    }

    const finalLocation = customLocation.trim() ? `${location} (${customLocation.trim()})` : location;

    try {
      const createdItem = submitReport({
        type,
        title: title.trim(),
        category,
        location: finalLocation,
        dateOccurred,
        timeOccurred,
        description: description.trim(),
        distinguishingFeatures: distinguishingFeatures.trim() || 'No specific unique markings noted.',
        storageLocation: type === 'found' ? storageLocation : undefined,
        imageUrl: imageUrl || undefined,
      });

      setCreatedItemTracking(createdItem.trackingNumber);

      // Check for possible matching found items if user reported a lost item
      if (type === 'lost') {
        const matches = findPossibleMatches({
          title: title.trim(),
          category,
          description: description.trim(),
          location: finalLocation,
          excludeItemId: createdItem.id,
        });
        setDetectedMatches(matches);
      } else {
        setDetectedMatches([]);
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit report. Please try again.');
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setTitle('');
    setDescription('');
    setDistinguishingFeatures('');
    setImageUrl('');
    setImagePreview(null);
    setDetectedMatches([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#080D91] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <PlusCircle className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">File an Item Report</h2>
              <p className="text-xs text-blue-100">La Consolacion University Philippines · Campus Registry</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-white/70 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-6 sm:p-8 text-center space-y-4 overflow-y-auto">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Report Successfully Submitted!</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Your {type === 'lost' ? 'lost' : 'found'} report for <strong>{title}</strong> has been logged into the university system.
              The Lost and Found Office will review your details.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 max-w-sm mx-auto text-center font-mono">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Official Tracking Number</span>
              <span className="text-base font-bold text-[#080D91]">{createdItemTracking}</span>
            </div>

            {/* Possible Matches Suggestion Section (Requirement 5) */}
            {detectedMatches.length > 0 && (
              <div className="mt-6 text-left border border-amber-200 bg-amber-50/60 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-amber-400 text-slate-950 font-bold text-xs">MATCH</span>
                  <h4 className="text-sm font-bold text-slate-900">
                    Possible Matching Items Detected in Registry ({detectedMatches.length})
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We found surrendered belongings that closely match your item's description or category. Inspect them below to verify if any is yours:
                </p>

                <div className="space-y-2.5">
                  {detectedMatches.map((match) => (
                    <div
                      key={match.id}
                      className="bg-white p-3 rounded-xl border border-amber-200/80 shadow-2xs flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {match.imageUrl ? (
                          <img
                            src={match.imageUrl}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#080D91] flex items-center justify-center font-bold text-xs shrink-0">
                            LCUP
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{match.title}</p>
                          <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#080D91] shrink-0" />
                            <span>{match.location}</span>
                          </p>
                          <span className="text-[10px] font-mono text-slate-400">{match.trackingNumber}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {onInspectMatch && (
                          <button
                            type="button"
                            onClick={() => onInspectMatch(match)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                          >
                            Inspect
                          </button>
                        )}
                        {onClaimMatch && (
                          <button
                            type="button"
                            onClick={() => onClaimMatch(match)}
                            className="px-3 py-1.5 bg-[#080D91] hover:bg-[#060a75] text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs cursor-pointer"
                          >
                            Claim
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 italic">
                  Note: Potential matches are computer-generated suggestions. An administrator must still verify your ownership proof before release.
                </p>
              </div>
            )}

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={handleResetAndClose}
                className="px-6 py-2 bg-[#080D91] hover:bg-[#060a75] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Close &amp; View Catalog
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4.5 flex-1">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Type Switcher: Lost vs Found */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Report Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('lost')}
                  className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                    type === 'lost'
                      ? 'border-[#080D91] bg-blue-50/70 text-[#080D91]'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="block font-bold">I Lost an Item</span>
                    <span className="text-[10px] font-normal text-slate-500">Report belongings missing on campus</span>
                  </div>
                  {type === 'lost' && <CheckCircle className="w-4 h-4 text-[#080D91]" />}
                </button>

                <button
                  type="button"
                  onClick={() => setType('found')}
                  className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                    type === 'found'
                      ? 'border-[#080D91] bg-blue-50/70 text-[#080D91]'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="block font-bold">I Found an Item</span>
                    <span className="text-[10px] font-normal text-slate-500">Surrender or report found property</span>
                  </div>
                  {type === 'found' && <CheckCircle className="w-4 h-4 text-[#080D91]" />}
                </button>
              </div>
            </div>

            {/* Item Title and Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Item Name / Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sony WH-1000XM4 Noise Canceling Headphones"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#080D91]/20 focus:border-[#080D91]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ItemCategory)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#080D91]/20 focus:border-[#080D91] bg-white"
                >
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date, Time, and Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date {type === 'lost' ? 'Lost' : 'Found'} *
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="date"
                    value={dateOccurred}
                    onChange={(e) => setDateOccurred(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#080D91]/20 focus:border-[#080D91]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Approximate Time
                </label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="time"
                    value={timeOccurred}
                    onChange={(e) => setTimeOccurred(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#080D91]/20 focus:border-[#080D91]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Campus Area *
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#080D91]/20 focus:border-[#080D91] bg-white"
                >
                  {CAMPUS_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specific Location Details (Optional)
              </label>
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="e.g. Near corner table beside the water dispenser, 2nd floor"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#080D91]/20 focus:border-[#080D91]"
              />
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Item Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Include color, manufacturer/brand, physical condition, size, and what was inside..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#080D91]/20 focus:border-[#080D91]"
                required
              />
            </div>

            {/* Distinguishing Features */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Distinguishing Marks & Unique Features
              </label>
              <input
                type="text"
                value={distinguishingFeatures}
                onChange={(e) => setDistinguishingFeatures(e.target.value)}
                placeholder="e.g. Scratched corner, yellow keychain, personalized stickers, engraved initials"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#080D91]/20 focus:border-[#080D91]"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                This helps administrators verify rightful ownership when matching claims.
              </p>
            </div>

            {/* Custody Location for Found Items */}
            {type === 'found' && (
              <div className="bg-blue-50/60 border border-blue-200/60 rounded-xl p-3">
                <label className="block text-xs font-semibold text-[#080D91] mb-1">
                  Current Storage / Custody Location *
                </label>
                <select
                  value={storageLocation}
                  onChange={(e) => setStorageLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-blue-200 rounded-lg focus:outline-none focus:border-[#080D91] bg-white text-slate-800"
                >
                  <option value="Turned over to Lost & Found Office (Main Bldg Room 102)">
                    Turned over to Lost & Found Office (Main Bldg Room 102)
                  </option>
                  <option value="Turned over to Campus Security Desk (Gate 1)">
                    Turned over to Campus Security Desk (Gate 1)
                  </option>
                  <option value="Held by finder (Awaiting owner contact)">
                    Currently held by finder (Will surrender upon verification)
                  </option>
                  <option value="Deposited at Dean's Office / Department">
                    Deposited at College Department Office
                  </option>
                </select>
              </div>
            )}

            {/* Photo Attachment */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Attach Item Photo (Optional)
              </label>
              <div className="flex flex-col sm:flex-row items-start gap-3">
                <label className="cursor-pointer border border-dashed border-slate-300 hover:border-[#080D91] rounded-xl p-3 text-center flex flex-col items-center justify-center w-full sm:w-44 bg-slate-50 hover:bg-blue-50/30 transition-all shrink-0">
                  <Camera className="w-5 h-5 text-slate-400 mb-1" />
                  <span className="text-xs font-medium text-slate-700">Choose File</span>
                  <span className="text-[10px] text-slate-400">JPG, PNG up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 w-28 h-24 shrink-0 bg-slate-100">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageUrl('');
                      }}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 text-xs text-slate-500">
                    <p className="mb-1 text-[11px]">Or select a sample photo for testing:</p>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPresetPhoto('https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80')}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px]"
                      >
                        Calculator
                      </button>
                      <button
                        type="button"
                        onClick={() => setPresetPhoto('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80')}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px]"
                      >
                        Backpack
                      </button>
                      <button
                        type="button"
                        onClick={() => setPresetPhoto('https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80')}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px]"
                      >
                        Keys
                      </button>
                      <button
                        type="button"
                        onClick={() => setPresetPhoto('https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=600&q=80')}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px]"
                      >
                        USB Drive
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reporter Profile Preview */}
            {currentUser && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800">Submitted by: </span>
                  <span>{currentUser.fullName} ({currentUser.universityId})</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">{currentUser.role}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#080D91] hover:bg-[#060a75] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                Submit Report for Review
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
