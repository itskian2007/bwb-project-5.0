'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  ShoppingBag, 
  CheckCircle2, 
  ExternalLink, 
  ChevronRight, 
  ShieldCheck, 
  Compass,
  Filter
} from 'lucide-react';
import { RURAL_LISTINGS } from '../data/mockData';
import { RuralListing } from '../types';
import { formatINR } from '../lib/utils';
import confetti from 'canvas-confetti';

interface RuralDiscoveryProps {
  initialHotspotName?: string;
  onBookListing?: (listing: RuralListing) => void;
}

export const RuralDiscovery: React.FC<RuralDiscoveryProps> = ({
  initialHotspotName = 'Shimla',
  onBookListing
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<string>(initialHotspotName);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [checkoutListing, setCheckoutListing] = useState<RuralListing | null>(null);
  const [isOrdered, setIsOrdered] = useState<boolean>(false);

  useEffect(() => {
    if (initialHotspotName) {
      setSelectedHotspot(initialHotspotName);
    }
  }, [initialHotspotName]);

  const categories = [
    { id: 'all', label: 'All Offerings' },
    { id: 'Homestay', label: 'Rural Homestays' },
    { id: 'Artisan Handloom', label: 'Artisan & Handloom' },
    { id: 'Local Guide', label: 'Local Guides & Trails' },
  ];

  const hotspotsList = [
    { id: 'all', label: 'All 5 Pilot Regions (All 10 Listings)' },
    { id: 'Shimla', label: 'Himachal Ridge (Shimla - Narkanda)' },
    { id: 'Manali', label: 'Beas Alpine Corridor (Manali - Tirthan / Jibhi)' },
    { id: 'Mussoorie', label: 'Garhwal Eco-Range (Mussoorie - Kanatal)' },
    { id: 'Ooty', label: 'Nilgiri Biosphere (Ooty - Kotagiri)' },
    { id: 'North Goa', label: 'Goan Coastal & Hinterland (Goa - Netravali)' }
  ];

  const filteredListings = RURAL_LISTINGS.filter(item => {
    const matchesHotspot = selectedHotspot === 'all' || 
      item.nearestHotspot.toLowerCase().includes(selectedHotspot.toLowerCase()) ||
      selectedHotspot.toLowerCase().includes(item.nearestHotspot.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesHotspot && matchesCategory;
  });

  const handleSimulateBecknOrder = () => {
    setIsOrdered(true);
    confetti({ particleCount: 50, spread: 60 });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-6 px-4">
      {/* Header */}
      <div className="gis-panel p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
              DEMAND REDISTRIBUTION &bull; RURAL MICRO-ECONOMY INCLUSION
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Rural Homestays &amp; Artisan Directory (2 Per Region)
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Authentic village accommodations, GI-certified handloom weavers, and nature guides located outside congested hotspots &mdash; connected via open ONDC Beckn protocol.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-mono">Filter Region:</span>
            <select
              value={selectedHotspot}
              onChange={(e) => setSelectedHotspot(e.target.value)}
              className="bg-[#0f182c] border border-[#223354] rounded px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-emerald-600"
            >
              {hotspotsList.map(h => (
                <option key={h.id} value={h.id}>{h.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter categories */}
        <div className="mt-4 pt-3 border-t border-[#223354] flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <span className="text-slate-400 font-mono text-[11px] mr-1">Category:</span>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-[#15803d] text-white'
                  : 'bg-[#0f182c] text-slate-400 border border-[#223354] hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {filteredListings.map(item => (
          <div key={item.id} className="gis-panel overflow-hidden flex flex-col justify-between hover:border-slate-500 transition-all">
            <div>
              {/* Image banner using authentic photography */}
              <div 
                className="h-48 w-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${item.imageUrl})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#131f37] via-transparent to-black/40" />
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-[#0d1527]/95 text-emerald-300 font-bold text-[10px] border border-[#223354]">
                    {item.category}
                  </span>
                  {item.verifiedGI && (
                    <span className="px-2 py-0.5 rounded bg-amber-950/95 text-amber-300 font-bold text-[10px] border border-amber-800">
                      GI Tag Certified
                    </span>
                  )}
                </div>
                <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded bg-[#0d1527]/95 text-white font-mono text-[10px] border border-[#223354]">
                  {item.distanceFromHotspotKm} km from {item.nearestHotspot}
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-white leading-snug">
                    {item.title}
                  </h3>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{item.village}, {item.district} ({item.state})</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Amenities pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.amenities.map((am, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[#0f182c] border border-[#223354] text-slate-300">
                      {am}
                    </span>
                  ))}
                </div>

                {/* Host Info */}
                <div className="text-[11px] text-slate-400 pt-2 border-t border-[#223354] flex justify-between items-center">
                  <span>Host: <strong className="text-white">{item.hostName}</strong></span>
                  <span className="font-mono text-emerald-400 font-semibold">{item.directHostSharePct}% Direct Settlement</span>
                </div>
              </div>
            </div>

            {/* Footer / Booking Action */}
            <div className="p-4 pt-0 flex items-center justify-between">
              <div>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  {formatINR(item.priceINR)}
                </span>
                <span className="text-[11px] text-slate-400 ml-1">/ {item.priceUnit}</span>
              </div>

              <button
                onClick={() => {
                  setCheckoutListing(item);
                  setIsOrdered(false);
                }}
                className="px-3 py-1.5 rounded bg-[#15803d] hover:bg-[#166534] text-white font-semibold text-xs flex items-center space-x-1 transition-all"
              >
                <span>Book via ONDC</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Simulated ONDC Beckn Checkout Modal */}
      {checkoutListing && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="gis-panel max-w-md w-full p-5 space-y-4 shadow-2xl border border-emerald-600/50">
            <div className="flex items-center justify-between pb-2 border-b border-[#223354]">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase font-mono">
                  ONDC Beckn Protocol Transaction
                </h3>
              </div>
              <button
                onClick={() => setCheckoutListing(null)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                [Close]
              </button>
            </div>

            <div className="text-xs space-y-2">
              <div className="p-2.5 rounded bg-[#0f182c] border border-[#223354]">
                <div className="font-bold text-white">{checkoutListing.title}</div>
                <div className="text-slate-400 text-[11px]">{checkoutListing.village}, {checkoutListing.district}</div>
                <div className="text-emerald-400 font-mono font-bold mt-1">
                  {formatINR(checkoutListing.priceINR)} ({checkoutListing.priceUnit})
                </div>
              </div>

              <div className="text-[11px] text-slate-300 space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Buyer App (BAP):</span>
                  <span>DeshDarshan Consumer v5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Seller Node (BPP):</span>
                  <span className="text-emerald-400 truncate max-w-[200px]">{checkoutListing.ondcBppId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Host Direct Payout:</span>
                  <span className="text-white font-bold">{formatINR(Math.round(checkoutListing.priceINR * (checkoutListing.directHostSharePct / 100)))} (96%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Protocol Fee:</span>
                  <span>{formatINR(Math.round(checkoutListing.priceINR * 0.04))} (4%)</span>
                </div>
              </div>
            </div>

            {isOrdered ? (
              <div className="p-3 rounded bg-emerald-950/60 border border-emerald-600 text-xs text-emerald-300 space-y-1">
                <div className="font-bold text-white flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-400" />
                  Beckn Transaction Confirmed!
                </div>
                <div className="text-[11px]">
                  ONDC Order ID: <code className="text-white font-mono">BECKN-{checkoutListing.nearestHotspot.toUpperCase().slice(0, 3)}-{Math.floor(10000 + Math.random() * 89999)}</code>
                </div>
                <div className="text-[10px] text-slate-400">
                  Direct UPI notification dispatched to host cooperative account.
                </div>
              </div>
            ) : (
              <button
                onClick={handleSimulateBecknOrder}
                className="w-full py-2.5 px-3 rounded bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm &amp; Dispatch via ONDC Network</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
