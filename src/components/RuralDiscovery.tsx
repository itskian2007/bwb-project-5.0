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
  Filter,
  TrendingDown,
  Layers,
  Building,
  Zap,
  ArrowRight
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
  const [selectedNode, setSelectedNode] = useState<RuralListing | null>(null);
  const [isOrdered, setIsOrdered] = useState<boolean>(false);

  useEffect(() => {
    if (initialHotspotName) {
      setSelectedHotspot(initialHotspotName);
    }
  }, [initialHotspotName]);

  const categories = [
    { id: 'all', label: 'All Node Types' },
    { id: 'Homestay', label: 'Eco-Buffer Homestays' },
    { id: 'Artisan Handloom', label: 'Artisan & GI Handloom Guilds' },
    { id: 'Local Guide', label: 'Community Trails & Guides' },
  ];

  const hotspotsList = [
    { id: 'all', label: 'All 5 Pilot Clusters (All 10 Satellites)' },
    { id: 'Shimla', label: 'Himachal Ridge (Shimla Satellite Hubs)' },
    { id: 'Manali', label: 'Beas Alpine Corridor (Manali Satellite Hubs)' },
    { id: 'Mussoorie', label: 'Garhwal Eco-Range (Mussoorie Satellite Hubs)' },
    { id: 'Ooty', label: 'Nilgiri Biosphere (Ooty Satellite Hubs)' },
    { id: 'North Goa', label: 'Goan Coastal & Hinterland (Goa Satellite Hubs)' }
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
    <div className="max-w-6xl mx-auto space-y-5 py-5 px-4 text-slate-200">
      {/* ── 1. OPERATIONAL SATELLITE NETWORK HEADER ── */}
      <div className="gis-panel p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>4. RURAL SATELLITE DISCOVERY &amp; OPEN ONDC BECKN REGISTRY</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
              Rural Economic Buffer Nodes (2 Verified per Corridor)
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 max-w-3xl leading-relaxed">
              Decentralized community micro-enterprises buffering overcrowded corridors. Connected via open ONDC Beckn protocol to guarantee <strong className="text-emerald-400">96% direct producer settlement</strong> without intermediate travel agency margins.
            </p>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-xs text-slate-400 font-mono">Corridor Cluster:</span>
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

        {/* Diagnostic Macro Ticker for the Rural Network */}
        <div className="mt-4 pt-3 border-t border-[#223354] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2 rounded bg-[#0f182c] border border-[#1c2b47]">
            <span className="text-[10px] text-slate-400 block font-mono">Verified Satellite Nodes</span>
            <strong className="text-sm font-bold text-white font-mono">10 Active</strong>
            <span className="text-[9px] text-slate-500 block">2 per pilot corridor</span>
          </div>

          <div className="p-2 rounded bg-[#0f182c] border border-[#1c2b47]">
            <span className="text-[10px] text-slate-400 block font-mono">Direct Producer Share</span>
            <strong className="text-sm font-bold text-emerald-400 font-mono">96.2% Avg</strong>
            <span className="text-[9px] text-slate-500 block">via open Beckn rails</span>
          </div>

          <div className="p-2 rounded bg-[#0f182c] border border-[#1c2b47]">
            <span className="text-[10px] text-slate-400 block font-mono">Average Distance to Hotspot</span>
            <strong className="text-sm font-bold text-blue-400 font-mono">27.6 km</strong>
            <span className="text-[9px] text-slate-500 block">ideal eco-buffer radius</span>
          </div>

          <div className="p-2 rounded bg-[#0f182c] border border-[#1c2b47]">
            <span className="text-[10px] text-slate-400 block font-mono">Authentic GI Products</span>
            <strong className="text-sm font-bold text-amber-300 font-mono">Certified</strong>
            <span className="text-[9px] text-slate-500 block">proven ancestral heritage</span>
          </div>
        </div>

        {/* Filter categories */}
        <div className="mt-3 pt-2.5 border-t border-[#223354] flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-mono text-[11px] mr-1">Node Type:</span>
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

      {/* ── 2. TECHNICAL SATELLITE DIRECTORY GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredListings.map(item => (
          <div key={item.id} className="gis-panel overflow-hidden flex flex-col justify-between border border-[#223354] hover:border-slate-500 transition-all bg-[#131f37]">
            <div>
              {/* Photo Banner with GIS Overlay Data */}
              <div 
                className="h-44 w-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${item.imageUrl})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#131f37] via-transparent to-black/60" />
                <div className="absolute top-2.5 left-2.5 flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-[#0d1527]/95 text-emerald-300 font-mono font-bold text-[10px] border border-[#223354]">
                    {item.category}
                  </span>
                  {item.verifiedGI && (
                    <span className="px-2 py-0.5 rounded bg-amber-950/95 text-amber-300 font-mono font-bold text-[10px] border border-amber-800">
                      GI Tag Certified
                    </span>
                  )}
                </div>
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-[#0d1527]/95 text-slate-200 font-mono text-[10px] border border-[#223354]">
                  Corridor: {item.nearestHotspot}
                </div>
                <div className="absolute bottom-2 left-2.5 right-2.5 flex justify-between items-end text-[11px] font-mono text-white">
                  <span className="bg-[#0d1527]/90 px-1.5 py-0.5 rounded border border-[#223354]">
                    📍 {item.distanceFromHotspotKm} km outside choke zone
                  </span>
                  <span className="bg-emerald-950/90 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800 font-bold">
                    {item.directHostSharePct}% Direct Share
                  </span>
                </div>
              </div>

              {/* Node Metadata Body */}
              <div className="p-4 space-y-2.5">
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-bold text-white leading-snug">
                      {item.title}
                    </h3>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{item.village}, {item.district} ({item.state})</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Protocol Specifications */}
                <div className="p-2 rounded bg-[#0f182c] border border-[#1c2b47] space-y-1 text-[11px] font-mono text-slate-400">
                  <div className="flex justify-between">
                    <span>Host / Guild Leader:</span>
                    <strong className="text-white">{item.hostName}</strong>
                  </div>
                  <div className="flex justify-between truncate">
                    <span>ONDC BPP Node ID:</span>
                    <span className="text-emerald-400 font-mono text-[10px] truncate max-w-[210px]">{item.ondcBppId}</span>
                  </div>
                </div>

                {/* Amenities pills */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {item.amenities.map((am, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[#0f182c] border border-[#223354] text-slate-300">
                      {am}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Operational Action Footer */}
            <div className="p-4 pt-1 flex items-center justify-between border-t border-[#1c2b47] mt-2">
              <div>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  {formatINR(item.priceINR)}
                </span>
                <span className="text-[10px] text-slate-400 ml-1">/ {item.priceUnit}</span>
              </div>

              <button
                onClick={() => {
                  setSelectedNode(item);
                  setIsOrdered(false);
                }}
                className="px-3 py-1.5 rounded bg-[#15803d] hover:bg-[#166534] text-white font-semibold text-xs flex items-center space-x-1 transition-all"
              >
                <span>Dispatch via ONDC</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. SIMULATED ONDC BECKN DISPATCH MODAL ── */}
      {selectedNode && (
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
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                [Close]
              </button>
            </div>

            <div className="text-xs space-y-2">
              <div className="p-2.5 rounded bg-[#0f182c] border border-[#223354]">
                <div className="font-bold text-white">{selectedNode.title}</div>
                <div className="text-slate-400 text-[11px]">{selectedNode.village}, {selectedNode.district}</div>
                <div className="text-emerald-400 font-mono font-bold mt-1">
                  {formatINR(selectedNode.priceINR)} ({selectedNode.priceUnit})
                </div>
              </div>

              <div className="text-[11px] text-slate-300 space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Buyer App (BAP):</span>
                  <span>DeshDarshan Consumer v5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Seller Node (BPP):</span>
                  <span className="text-emerald-400 truncate max-w-[200px]">{selectedNode.ondcBppId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Host Direct Payout:</span>
                  <span className="text-white font-bold">{formatINR(Math.round(selectedNode.priceINR * (selectedNode.directHostSharePct / 100)))} ({selectedNode.directHostSharePct}%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Beckn Protocol Fee:</span>
                  <span>{formatINR(Math.round(selectedNode.priceINR * ((100 - selectedNode.directHostSharePct) / 100)))} ({100 - selectedNode.directHostSharePct}%)</span>
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
                  ONDC Order ID: <code className="text-white font-mono">BECKN-{selectedNode.nearestHotspot.toUpperCase().slice(0, 3)}-{Math.floor(10000 + Math.random() * 89999)}</code>
                </div>
                <div className="text-[10px] text-slate-400">
                  Direct UPI notification dispatched to host cooperative account with zero intermediary commission.
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
