'use client';

import React, { useState } from 'react';
import { 
  Globe2, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  ShoppingBag, 
  Navigation, 
  Users, 
  Award,
  Filter,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { RURAL_LISTINGS } from '../data/mockData';
import { RuralListing } from '../types';
import { formatINR } from '../lib/utils';

interface RuralDiscoveryProps {
  initialHotspotName?: string;
  onBookListing: (listing: RuralListing) => void;
}

export const RuralDiscovery: React.FC<RuralDiscoveryProps> = ({
  initialHotspotName = 'Shimla',
  onBookListing
}) => {
  const [selectedRadiusKm, setSelectedRadiusKm] = useState<number>(30);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedHotspot, setSelectedHotspot] = useState<string>(initialHotspotName);

  const categories = [
    { id: 'all', label: 'All Rural Offerings' },
    { id: 'Homestay', label: 'Rural Homestays' },
    { id: 'Artisan Handloom', label: 'Artisan & GI Handloom' },
    { id: 'Local Guide', label: 'Indigenous Guides' },
    { id: 'Organic Farm Feast', label: 'Farm-to-Table Dining' },
  ];

  const filteredListings = RURAL_LISTINGS.filter(item => {
    const matchesHotspot = item.nearestHotspot.toLowerCase().includes(selectedHotspot.toLowerCase());
    const matchesRadius = item.distanceFromHotspotKm <= selectedRadiusKm;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesHotspot && matchesRadius && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header and Trigger Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 relative overflow-hidden bg-gradient-to-r from-navy-950 via-navy-900 to-emerald-950/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>TRIGGERED: HOTSPOT SATURATION THRESHOLD REACHED</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              Rural Discovery Engine &bull; 30km Micro-Economy Ring
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Surfacing authentic, verified rural homestays, GI-tagged weavers, indigenous guides, and organic farms situated within 30km of saturated urban tourist choke points.
            </p>
          </div>

          {/* Quick Hotspot Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="text-xs text-slate-400">Anchor Hotspot:</span>
            <select
              value={selectedHotspot}
              onChange={(e) => setSelectedHotspot(e.target.value)}
              className="bg-navy-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400 font-semibold"
            >
              <option value="Shimla">Shimla (94% Saturated)</option>
              <option value="Manali">Manali & Solang (96% Saturated)</option>
              <option value="Ooty">Ooty (91% Saturated)</option>
            </select>
          </div>
        </div>

        {/* Filter Toolbar: Radius and Categories */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          {/* Radius selector */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-medium">Search Radius:</span>
            {[15, 25, 30].map(radius => (
              <button
                key={radius}
                onClick={() => setSelectedRadiusKm(radius)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  selectedRadiusKm === radius
                    ? 'bg-emerald-500 text-navy-950 shadow-md shadow-emerald-500/20'
                    : 'bg-navy-900 text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                Within {radius} km
              </button>
            ))}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-navy-900/60 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rural Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <div
            key={listing.id}
            className="glass-panel rounded-3xl border border-white/10 overflow-hidden flex flex-col justify-between hover:border-emerald-500/40 transition-all group shadow-xl"
          >
            <div>
              {/* Image banner with badges */}
              <div
                className="h-48 w-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${listing.imageUrl})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-black/40" />

                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-navy-950/80 backdrop-blur-md text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    {listing.category}
                  </span>
                  {listing.verifiedGI && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/90 text-navy-950 text-[10px] font-extrabold flex items-center shadow-md">
                      <Award className="w-3 h-3 mr-1" />
                      GI Tag Verified
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-navy-950/90 backdrop-blur-md text-slate-200 text-xs font-semibold border border-white/10 flex items-center">
                    <MapPin className="w-3 h-3 text-emerald-400 mr-1" />
                    {listing.distanceFromHotspotKm} km from {listing.nearestHotspot}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="text-white font-medium flex items-center">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mr-1" />
                    {listing.rating} ({listing.reviewsCount} verified stays)
                  </span>
                  <span className="text-emerald-400 font-semibold bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                    {listing.directHostSharePct}% Direct to Host
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {listing.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center">
                    <Users className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
                    Hosted by {listing.hostName} &bull; {listing.village}, {listing.district}
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {listing.description}
                </p>

                {/* Amenities / Features */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {listing.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-navy-900 text-slate-300 border border-white/5"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & ONDC Booking Action */}
            <div className="p-5 pt-0">
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-lg font-black text-white">{formatINR(listing.priceINR)}</span>
                  <span className="text-[11px] text-slate-400 ml-1">{listing.priceUnit}</span>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    Zero corporate OTA markup
                  </div>
                </div>

                <button
                  onClick={() => onBookListing(listing)}
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-navy-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 hover:scale-105"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>ONDC Reserve</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
