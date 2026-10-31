'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Star, 
  ShieldCheck, 
  ShoppingBag, 
  Navigation, 
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { RURAL_LISTINGS } from '../data/mockData';
import { RuralListing, ONDCTransaction } from '../types';
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
  const [selectedRadiusKm, setSelectedRadiusKm] = useState<number>(30);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedHotspot, setSelectedHotspot] = useState<string>(initialHotspotName);
  const [checkoutListing, setCheckoutListing] = useState<RuralListing | null>(null);
  const [isOrdered, setIsOrdered] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'All Offerings' },
    { id: 'Homestay', label: 'Rural Homestays' },
    { id: 'Artisan Handloom', label: 'Artisan & Handloom' },
    { id: 'Local Guide', label: 'Local Guides' },
    { id: 'Organic Farm Feast', label: 'Farm Dining' },
  ];

  const filteredListings = RURAL_LISTINGS.filter(item => {
    const matchesHotspot = item.nearestHotspot.toLowerCase().includes(selectedHotspot.toLowerCase());
    const matchesRadius = item.distanceFromHotspotKm <= selectedRadiusKm;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesHotspot && matchesRadius && matchesCategory;
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
              DEMAND REDISTRIBUTION &bull; 4. RURAL DISCOVERY &amp; 5. ONDC MARKETPLACE
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Rural Micro-Economy Directory &amp; ONDC Beckn Gateway
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified rural homestays, GI craft clusters, and local guides within 30km of saturated hill stations, connected via open ONDC Beckn protocol.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-mono">Anchor Hotspot:</span>
            <select
              value={selectedHotspot}
              onChange={(e) => setSelectedHotspot(e.target.value)}
              className="bg-[#0A142D] border border-[#1E2F5B] rounded px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
            >
              <option value="Shimla">Shimla (94% Overloaded)</option>
              <option value="Manali">Manali &amp; Solang (96% Overloaded)</option>
              <option value="Ooty">Ooty (91% Overloaded)</option>
            </select>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 pt-3 border-t border-[#1E2F5B] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400 font-mono text-[11px]">Radius:</span>
            {[15, 25, 30].map(r => (
              <button
                key={r}
                onClick={() => setSelectedRadiusKm(r)}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  selectedRadiusKm === r
                    ? 'bg-[#15803D] text-white'
                    : 'bg-[#0A142D] text-slate-400 border border-[#1E2F5B] hover:text-white'
                }`}
              >
                Within {r} km
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-2.5 py-1 rounded text-xs whitespace-nowrap font-semibold ${
                  selectedCategory === c.id
                    ? 'bg-[#15803D] text-white'
                    : 'bg-[#0A142D] text-slate-400 border border-[#1E2F5B] hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredListings.map(item => (
          <div key={item.id} className="gis-panel overflow-hidden flex flex-col justify-between hover:border-slate-500 transition-all">
            <div>
              {/* Image banner */}
              <div 
                className="h-44 w-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${item.imageUrl})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1A38] via-transparent to-black/30" />
                <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#080E21]/90 text-emerald-300 font-bold text-[10px] border border-[#1E2F5B]">
                    {item.category}
                  </span>
                  {item.verifiedGI && (
                    <span className="px-2 py-0.5 rounded bg-amber-950/90 text-amber-300 font-bold text-[10px] border border-amber-800">
                      GI-Certified
                    </span>
                  )}
                </div>
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-[#080E21]/90 text-white font-mono text-[10px] border border-[#1E2F5B]">
                  {item.distanceFromHotspotKm} km from {item.nearestHotspot}
                </div>
              </div>

              {/* Body */}
              <div className="p-3.5 space-y-2.5">
                <div>
                  <h3 className="text-sm font-bold text-white leading-snug">
                    {item.title}
                  </h3>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{item.village}, {item.district} ({item.state})</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Host Info */}
                <div className="text-[11px] text-slate-400 pt-1 border-t border-[#1E2F5B] flex justify-between">
                  <span>Host: <strong className="text-slate-200">{item.hostName}</strong></span>
                  <span className="font-mono text-emerald-400 font-semibold">{item.directHostSharePct}% Direct Share</span>
                </div>
              </div>
            </div>

            {/* Footer / Booking Action */}
            <div className="p-3.5 pt-0 flex items-center justify-between">
              <div>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  {formatINR(item.priceINR)}
                </span>
                <span className="text-[10px] text-slate-400 ml-1">/ {item.priceUnit}</span>
              </div>

              <button
                onClick={() => {
                  setCheckoutListing(item);
                  setIsOrdered(false);
                }}
                className="px-3 py-1.5 rounded bg-[#15803D] hover:bg-[#166534] text-white font-semibold text-xs flex items-center space-x-1"
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
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="gis-panel max-w-md w-full p-5 space-y-4 shadow-2xl border border-emerald-500/40">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E2F5B]">
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
              <div className="p-2.5 rounded bg-[#0A142D] border border-[#1E2F5B]">
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
                  <span className="text-slate-500">Protocol &amp; Gateway Fee:</span>
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
                  ONDC Order ID: <code className="text-white font-mono">BECKN-HP-91823</code>
                </div>
                <div className="text-[10px] text-slate-400">
                  Direct UPI notification sent to Gram Panchayat cooperative bank account.
                </div>
              </div>
            ) : (
              <button
                onClick={handleSimulateBecknOrder}
                className="w-full py-2.5 px-3 rounded bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md"
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
