import React, { useState, useMemo } from 'react';
import { useCampusFind } from '../context/CampusFindContext';
import { ItemRecord, ItemCategory, ItemType } from '../types';
import { CATEGORY_LABELS, CAMPUS_LOCATIONS } from '../data/seedData';
import {
  Search,
  MapPin,
  Calendar,
  ArrowRight,
  HelpCircle,
  PackageCheck,
  Laptop,
  Briefcase,
  BookOpen,
  CreditCard,
  Key,
  Shirt,
  Watch,
  FolderOpen,
  Eye,
  ShieldCheck,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface SearchCatalogProps {
  onSelectItem: (item: ItemRecord) => void;
  onClaimItem: (item: ItemRecord) => void;
  onReportLost: () => void;
  onReportFound: () => void;
  onOpenReportModal?: (type?: ItemType) => void;
}

export const SearchCatalog: React.FC<SearchCatalogProps> = ({
  onSelectItem,
  onClaimItem,
  onReportLost,
  onReportFound,
}) => {
  const { items } = useCampusFind();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'found' | 'lost'>('found');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Filter & prioritize items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Must be approved by admin to show in public search catalog
        if (item.reportStatus !== 'approved') return false;

        // Type filter
        if (selectedType !== 'all' && item.type !== selectedType) return false;

        // Category filter
        if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

        // Location filter
        if (
          selectedLocation !== 'all' &&
          !item.location.toLowerCase().includes(selectedLocation.toLowerCase())
        ) {
          return false;
        }

        // Query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = item.title.toLowerCase().includes(q);
          const matchesDesc = item.description.toLowerCase().includes(q);
          const matchesTracking = item.trackingNumber.toLowerCase().includes(q);
          const matchesFeatures = item.distinguishingFeatures.toLowerCase().includes(q);
          const matchesLoc = item.location.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc && !matchesTracking && !matchesFeatures && !matchesLoc) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // Prioritize available found items before claimed items in catalog
        if (a.type === 'found' && b.type === 'found') {
          if (a.itemStatus === 'available' && b.itemStatus === 'claimed') return -1;
          if (a.itemStatus === 'claimed' && b.itemStatus === 'available') return 1;
        }

        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [items, selectedType, selectedCategory, selectedLocation, searchQuery, sortBy]);

  const getCategoryIcon = (category: ItemCategory) => {
    switch (category) {
      case 'electronics':
        return <Laptop className="w-5 h-5" />;
      case 'bags_wallets':
        return <Briefcase className="w-5 h-5" />;
      case 'books_documents':
        return <BookOpen className="w-5 h-5" />;
      case 'ids_cards':
        return <CreditCard className="w-5 h-5" />;
      case 'keys_accessories':
        return <Key className="w-5 h-5" />;
      case 'clothing_uniforms':
        return <Shirt className="w-5 h-5" />;
      case 'personal_items':
        return <Watch className="w-5 h-5" />;
      default:
        return <FolderOpen className="w-5 h-5" />;
    }
  };

  const approvedFoundCount = items.filter(
    (i) => i.reportStatus === 'approved' && i.type === 'found'
  ).length;
  const approvedLostCount = items.filter(
    (i) => i.reportStatus === 'approved' && i.type === 'lost'
  ).length;

  const hasActiveFilters =
    selectedCategory !== 'all' || selectedLocation !== 'all' || searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedLocation('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-8">
      {/* ============================================================ */}
      {/* 1. HERO SECTION                                              */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-r from-[#080D91] via-[#0910A8] to-[#0A13BF] rounded-2xl text-white p-6 sm:p-8 md:p-9 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          {/* Institutional Trust Kicker */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-amber-300 text-xs font-semibold tracking-wider uppercase mb-3 border border-white/15 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Official University Lost &amp; Found Registry</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight">
            Lost something? Found something?
          </h1>

          {/* Supporting Description */}
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
            Report missing belongings, share found items, and help reunite lost belongings with their rightful owners around campus.
          </p>

          {/* Prominent Search Bar */}
          <div className="bg-white rounded-xl p-1.5 shadow-xl flex items-center gap-2 border border-blue-200/50">
            <div className="pl-3 text-slate-400">
              <Search className="w-5 h-5 text-[#080D91]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by item name, tracking ID (e.g. LCUP-F-2026), category, or campus venue..."
              className="w-full py-2.5 px-1 text-slate-800 placeholder-slate-400 text-sm focus:outline-none bg-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 font-medium transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => {
                const el = document.getElementById('catalog-results');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#080D91] hover:bg-[#060a75] text-white px-5 sm:px-6 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors shrink-0 shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Decorative Institutional Seal Watermark */}
        <div className="absolute right-[-15px] bottom-[-20px] opacity-15 pointer-events-none hidden md:block">
          <img
            src="/assets/aistudio/image_f30422a8.png"
            alt="LCUP Seal Watermark"
            className="w-72 h-72 lg:w-80 lg:h-80 object-contain brightness-200"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. TWO PRIMARY REPORTING CTA CARDS (HIGH PROMINENCE)         */}
      {/* ============================================================ */}
      <section aria-label="Primary reporting actions">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* CARD 1: I LOST SOMETHING */}
          <div
            onClick={onReportLost}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onReportLost();
              }
            }}
            className="bg-white rounded-2xl border-2 border-blue-200/90 hover:border-[#080D91] p-6 sm:p-7 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
          >
            <div>
              {/* Header row with larger recognizable icon & badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#080D91] flex items-center justify-center border border-blue-100 group-hover:scale-105 group-hover:bg-[#080D91] group-hover:text-white transition-all shadow-xs">
                  <HelpCircle className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#080D91] bg-blue-50/80 px-2.5 py-1 rounded-md border border-blue-100">
                  Missing Property
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight group-hover:text-[#080D91] transition-colors mb-2">
                I Lost Something
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                File an official missing property report with details, photos, and last known campus location so custodians and finders can match it.
              </p>

              {/* Micro-features to utilize card space meaningfully */}
              <ul className="space-y-2 text-xs text-slate-500 mb-6 border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-[#080D91] flex items-center justify-center shrink-0 text-[10px] font-bold">
                    ✓
                  </span>
                  <span>Generates official LCUP tracking number (e.g. LCUP-L-2026)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-[#080D91] flex items-center justify-center shrink-0 text-[10px] font-bold">
                    ✓
                  </span>
                  <span>Automatically cross-matched against surrendered items daily</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-[#080D91] flex items-center justify-center shrink-0 text-[10px] font-bold">
                    ✓
                  </span>
                  <span>Automated alerts sent when potential matching property is logged</span>
                </li>
              </ul>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onReportLost();
                }}
                className="w-full py-3 px-5 bg-[#080D91] hover:bg-[#060a75] text-white rounded-xl text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 group-hover:gap-3 cursor-pointer"
              >
                <span>Report Lost Item</span>
                <ArrowRight className="w-4 h-4 text-blue-200" />
              </button>
            </div>
          </div>

          {/* CARD 2: I FOUND SOMETHING */}
          <div
            onClick={onReportFound}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onReportFound();
              }
            }}
            className="bg-white rounded-2xl border-2 border-amber-200/90 hover:border-amber-400 p-6 sm:p-7 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
          >
            <div>
              {/* Header row with larger recognizable icon & badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200 group-hover:scale-105 group-hover:bg-[#D4B45E] group-hover:text-slate-950 transition-all shadow-xs">
                  <PackageCheck className="w-7 h-7 text-amber-700 group-hover:text-slate-950" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-50/80 px-2.5 py-1 rounded-md border border-amber-200">
                  Recovered Belonging
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight group-hover:text-[#080D91] transition-colors mb-2">
                I Found Something
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                Help someone recover their belongings by logging an item you picked up or surrendered to university custody.
              </p>

              {/* Micro-features to utilize card space meaningfully */}
              <ul className="space-y-2 text-xs text-slate-500 mb-6 border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 text-[10px] font-bold">
                    ✓
                  </span>
                  <span>Turn over to Room 102 (Main Bldg) or report online directly</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 text-[10px] font-bold">
                    ✓
                  </span>
                  <span>Instant listing on official registry for owner search &amp; claiming</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 text-[10px] font-bold">
                    ✓
                  </span>
                  <span>Tamper-evident verification with printable digital handover receipt</span>
                </li>
              </ul>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onReportFound();
                }}
                className="w-full py-3 px-5 bg-[#080D91] hover:bg-[#060a75] text-white border border-amber-400/40 hover:border-amber-400 rounded-xl text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 group-hover:gap-3 cursor-pointer"
              >
                <span>Report Found Item</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. REORGANIZED CATALOG FILTERING TOOLBAR                     */}
      {/* ============================================================ */}
      <section id="catalog-results" className="space-y-5 scroll-mt-20" aria-label="Campus belongings catalog">
        {/* Section Heading & Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pt-2">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Recently Found &amp; Reported Items
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse campus records and find a possible match for your missing belongings.
            </p>
          </div>
          <div className="text-xs text-slate-500 font-medium shrink-0 self-start sm:self-end">
            Showing <strong className="text-slate-900 font-mono tabular-nums">{filteredItems.length}</strong> matching records
          </div>
        </div>

        {/* Filter Toolbar Container */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          {/* FIRST ROW: Segmented Type Tabs on Left + Sorting Dropdown on Right */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            {/* Tabs: Found Belongings / Reported Lost / All Records */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl self-start sm:self-auto gap-1 max-w-full overflow-x-auto no-scrollbar">
              <button
                onClick={() => setSelectedType('found')}
                className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedType === 'found'
                    ? 'bg-[#080D91] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                Found Belongings ({approvedFoundCount})
              </button>
              <button
                onClick={() => setSelectedType('lost')}
                className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedType === 'lost'
                    ? 'bg-[#080D91] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                Reported Lost ({approvedLostCount})
              </button>
              <button
                onClick={() => setSelectedType('all')}
                className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedType === 'all'
                    ? 'bg-[#080D91] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                All Records
              </button>
            </div>

            {/* Sorting Dropdown (aligned right) */}
            <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-600">
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px] whitespace-nowrap">
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 sm:py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#080D91] cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* SECOND ROW: Category Filter & Campus Location Filter (Efficient Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 pt-1 items-end">
            <div className="md:col-span-5">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Category Filter
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#080D91] cursor-pointer transition-colors"
              >
                <option value="all">All Item Categories</option>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-5">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Campus Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#080D91] cursor-pointer transition-colors"
              >
                <option value="all">All Campus Locations</option>
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              {hasActiveFilters ? (
                <button
                  onClick={handleResetFilters}
                  className="w-full py-2 px-3 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              ) : (
                <div className="text-[11px] text-slate-400 py-2 text-center md:text-right hidden md:block">
                  All filters active
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Clear separation banner between toolbar and cards */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              Live Campus Inventory · Reflected in real-time across university offices
            </span>
          </div>
          <span className="text-[11px] hidden sm:inline text-slate-400">
            Click any card to inspect full details or file an ownership claim
          </span>
        </div>

        {/* ============================================================ */}
        {/* 4. ITEM CARDS PRESENTATION (CONSISTENT DIMENSIONS & HEIGHTS) */}
        {/* ============================================================ */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
            <div className="w-14 h-14 bg-blue-50 text-[#080D91] rounded-2xl flex items-center justify-center mx-auto mb-3 border border-blue-100">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              No belongings found matching your filters
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
              If your item isn't listed here yet, submit a lost report now so the Lost &amp; Found Office can notify you immediately when matching property is surrendered.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={onReportLost}
                className="px-5 py-2.5 bg-[#080D91] hover:bg-[#060a75] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                Report Lost Item
              </button>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const isClaimed = item.itemStatus === 'claimed';
              const isFound = item.type === 'found';

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectItem(item);
                    }
                  }}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col h-full overflow-hidden group cursor-pointer"
                >
                  {/* Photo Area (Strict Consistent Height) */}
                  <div className="h-48 w-full bg-slate-100 relative overflow-hidden shrink-0">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : null}

                    {/* Styled Fallback Container if image is absent or broken */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200 text-slate-400 -z-10 p-4">
                      {getCategoryIcon(item.category)}
                      <span className="text-[11px] text-slate-500 font-medium mt-1">
                        {CATEGORY_LABELS[item.category] || item.category}
                      </span>
                    </div>

                    {/* Type and Availability Status Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap z-10">
                      {/* Type Badge */}
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs text-white ${
                          isFound ? 'bg-[#080D91]' : 'bg-[#20243A]'
                        }`}
                      >
                        {isFound ? 'Found Item' : 'Lost Item'}
                      </span>

                      {/* Status Badge */}
                      {isClaimed ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-700 text-white shadow-xs">
                          Claimed &amp; Returned
                        </span>
                      ) : isFound ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs">
                          Available for Claim
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#080D91] border border-blue-200 shadow-xs">
                          Under Search
                        </span>
                      )}
                    </div>

                    {/* Visible Tracking ID Badge */}
                    <div className="absolute bottom-2.5 right-2.5 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-2.5 py-0.5 rounded shadow-sm z-10 tracking-wider">
                      {item.trackingNumber}
                    </div>
                  </div>

                  {/* Content Container (Consistent Spacing & Alignment) */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Category and Date (Clean unboxed metadata) */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                        <span className="font-semibold text-slate-700">
                          {CATEGORY_LABELS[item.category] || item.category}
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{item.dateOccurred}</span>
                        </span>
                      </div>

                      {/* Item Title */}
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#080D91] transition-colors line-clamp-1 mb-2">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>

                    <div>
                      {/* Location Box */}
                      <div className="flex items-center gap-2 text-xs text-slate-700 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <MapPin className="w-3.5 h-3.5 text-[#080D91] shrink-0" />
                        <span className="truncate font-medium">{item.location}</span>
                      </div>

                      {/* Card Action Row */}
                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectItem(item);
                          }}
                          className="text-xs font-semibold text-slate-600 hover:text-[#080D91] flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-slate-50 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Details</span>
                        </button>

                        {isFound && !isClaimed && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onClaimItem(item);
                            }}
                            className="px-3.5 py-1.5 bg-[#080D91] hover:bg-[#060a75] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs border border-amber-400/30"
                          >
                            <span>Claim This Item</span>
                            <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
