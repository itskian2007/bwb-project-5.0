'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Coins, 
  Droplets, 
  Gauge, 
  Navigation, 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  Trash2, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink,
  MapPin,
  Car
} from 'lucide-react';
import { DESTINATIONS } from '../data/mockData';
import { Destination } from '../types';
import { formatINR, formatNumber } from '../lib/utils';
import confetti from 'canvas-confetti';

interface LoadBalancerProps {
  onAcceptRebalance: (source: Destination, alt: Destination) => void;
  onExploreRural: (hotspotName: string) => void;
  onOpenONDC: (itemTitle: string) => void;
}

export const LoadBalancer: React.FC<LoadBalancerProps> = ({
  onAcceptRebalance,
  onExploreRural,
  onOpenONDC
}) => {
  // Hotspot selection
  const hotspots = DESTINATIONS.filter(d => d.isHotspot);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string>('shimla');
  const [rebalancedDestinationId, setRebalancedDestinationId] = useState<string>('narkanda');
  const [hasActivatedRoute, setHasActivatedRoute] = useState<boolean>(false);
  const [impactView, setImpactView] = useState<'side-by-side' | 'metric-breakdown'>('side-by-side');

  const currentHotspot = DESTINATIONS.find(d => d.id === selectedHotspotId) || hotspots[0];
  
  // Find alternatives for this hotspot
  const alternatives = DESTINATIONS.filter(d => d.nearestHotspotId === currentHotspot.id);
  const selectedAlternative = DESTINATIONS.find(d => d.id === rebalancedDestinationId) || alternatives[0] || DESTINATIONS[1];

  const handleSelectHotspot = (id: string) => {
    setSelectedHotspotId(id);
    const relatedAlts = DESTINATIONS.filter(d => d.nearestHotspotId === id);
    if (relatedAlts.length > 0) {
      setRebalancedDestinationId(relatedAlts[0].id);
    }
    setHasActivatedRoute(false);
  };

  const handleActivateRebalance = () => {
    setHasActivatedRoute(true);
    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#f59e0b', '#06b6d4']
    });
    onAcceptRebalance(currentHotspot, selectedAlternative);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Circuit / Hotspot Selector Strip */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-rose-400">
                AI Tourism Load Balancer &bull; Real-Time Hotspot Redirection
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select any heavily congested tourist destination to simulate autonomous demand redistribution.
            </p>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {hotspots.map((spot) => {
              const isSelected = spot.id === currentHotspot.id;
              return (
                <button
                  key={spot.id}
                  onClick={() => handleSelectHotspot(spot.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-md shadow-rose-500/10'
                      : 'bg-navy-900/60 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{spot.name}</span>
                  <span className="px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-300 text-[10px]">
                    {spot.saturationPct}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Hotspot Warning & Autonomous Redirection Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Saturated Destination Problem Card (4 cols) */}
        <div className="lg:col-span-5 glass-panel-warning p-6 rounded-3xl border border-rose-500/30 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Header Status */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold tracking-wide">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>HOTSPOT CRITICAL SATURATION</span>
              </span>
              <span className="text-xs font-mono text-rose-300/80">
                {currentHotspot.circuit}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-black text-white">{currentHotspot.name}</h3>
                <p className="text-xs text-slate-400">{currentHotspot.state} &bull; Elevation: {currentHotspot.altitudeMeters}m</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black text-rose-400">
                  {currentHotspot.saturationPct}%
                </div>
                <div className="text-[10px] text-rose-300 font-semibold uppercase tracking-wider">
                  Carrying Saturation
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-300 leading-relaxed bg-black/30 p-3 rounded-xl border border-rose-500/20">
              {currentHotspot.description}
            </p>

            {/* Saturated Hotspot Key Metrics */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="bg-navy-950/70 p-3 rounded-xl border border-white/5">
                <div className="flex items-center text-slate-400 text-[11px] mb-1">
                  <Clock className="w-3.5 h-3.5 text-rose-400 mr-1.5" />
                  Expected Bottleneck
                </div>
                <div className="text-lg font-bold text-rose-300">
                  {currentHotspot.expectedWaitHours} Hours
                </div>
                <div className="text-[10px] text-slate-400">Mall Rd / Checkpoint queue</div>
              </div>

              <div className="bg-navy-950/70 p-3 rounded-xl border border-white/5">
                <div className="flex items-center text-slate-400 text-[11px] mb-1">
                  <Car className="w-3.5 h-3.5 text-rose-400 mr-1.5" />
                  Traffic Status
                </div>
                <div className="text-lg font-bold text-rose-300">
                  {currentHotspot.trafficStatus}
                </div>
                <div className="text-[10px] text-slate-400">Cart Rd & Entry Corridor</div>
              </div>

              <div className="bg-navy-950/70 p-3 rounded-xl border border-white/5">
                <div className="flex items-center text-slate-400 text-[11px] mb-1">
                  <Droplets className="w-3.5 h-3.5 text-rose-400 mr-1.5" />
                  Water Deficit
                </div>
                <div className="text-base font-bold text-slate-200">
                  {currentHotspot.waterDemandMLD} MLD
                </div>
                <div className="text-[10px] text-rose-400">Severely above capacity</div>
              </div>

              <div className="bg-navy-950/70 p-3 rounded-xl border border-white/5">
                <div className="flex items-center text-slate-400 text-[11px] mb-1">
                  <Trash2 className="w-3.5 h-3.5 text-rose-400 mr-1.5" />
                  Solid Waste Load
                </div>
                <div className="text-base font-bold text-slate-200">
                  {currentHotspot.wasteGenerationTons} T/day
                </div>
                <div className="text-[10px] text-rose-400">Fragile slope hazard</div>
              </div>
            </div>

            {/* Capacity vs Current Bar */}
            <div className="mt-4 bg-navy-950/60 p-3 rounded-xl border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Carrying Threshold:</span>
                <span className="font-semibold text-slate-300">{formatNumber(currentHotspot.carryingCapacity)} visitors</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-rose-400 font-medium">Current Load:</span>
                <span className="font-bold text-rose-400">{formatNumber(currentHotspot.currentVisitors)} visitors (+222%)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-1">
                <div 
                  className="bg-rose-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, currentHotspot.saturationPct)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-rose-500/20 flex items-center justify-between">
            <span className="text-xs text-rose-300 font-medium flex items-center">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-2" />
              Automated Redistribution Triggered
            </span>
            <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono">
              Agent #2 Active
            </span>
          </div>
        </div>

        {/* Center/Right Column: AI Rebalance Alternative Matches (7 cols) */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  AI Experience-Equivalent Alternatives
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Matches scenic topography, cultural richness & climate without the crowds or environmental damage.
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              {alternatives.length} Optimal Hubs Found
            </span>
          </div>

          {/* Alternative Cards Grid */}
          <div className="space-y-3">
            {alternatives.map((alt) => {
              const isSelected = alt.id === selectedAlternative.id;
              return (
                <div
                  key={alt.id}
                  onClick={() => {
                    setRebalancedDestinationId(alt.id);
                    setHasActivatedRoute(false);
                  }}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'glass-panel-glow border-emerald-500/50 scale-[1.01]'
                      : 'glass-panel border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-cover bg-center flex-shrink-0 border border-white/10" style={{ backgroundImage: `url(${alt.imageUrl})` }} />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-base font-bold text-white">{alt.name}</h4>
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                              RECOMMENDED REDIRECT
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{alt.description}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {alt.scenicTags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats Pill */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5 text-right flex-shrink-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-400">Crowd:</span>
                        <span className="text-sm font-extrabold text-emerald-400">{alt.saturationPct}%</span>
                      </div>
                      <div className="text-xs text-cyan-400 font-semibold">
                        {alt.similarityScore}% Scenic Similarity
                      </div>
                      <div className="text-[11px] text-amber-300 font-medium">
                        +{alt.creditBonus} DeshCredits
                      </div>
                    </div>
                  </div>

                  {/* Micro stats strip */}
                  <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-navy-900/60 p-1.5 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Distance Delta</span>
                      <span className="font-bold text-slate-200">+{alt.distanceDeltaKm} km</span>
                    </div>
                    <div className="bg-navy-900/60 p-1.5 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Traffic Saved</span>
                      <span className="font-bold text-emerald-400">{alt.trafficSavedHours} hrs</span>
                    </div>
                    <div className="bg-navy-900/60 p-1.5 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Rural Economy Gain</span>
                      <span className="font-bold text-emerald-400">{formatINR(alt.moneyRedirectedINR || 0)}</span>
                    </div>
                    <div className="bg-navy-900/60 p-1.5 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Wait Time</span>
                      <span className="font-bold text-cyan-400">&lt; 15 mins</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Button Strip */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <Coins className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">
                  Earn <strong className="text-emerald-400">+{selectedAlternative.creditBonus} DeshCredits</strong>
                </div>
                <p className="text-[11px] text-slate-400">
                  Unlocks 25% off ONDC verified homestays in {selectedAlternative.name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                onClick={() => onExploreRural(currentHotspot.name)}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-navy-900 text-slate-200 hover:text-white border border-white/10 hover:border-emerald-500/40 text-xs font-semibold transition-all"
              >
                View 30km Rural Hosts
              </button>

              <button
                onClick={handleActivateRebalance}
                className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
                  hasActivatedRoute
                    ? 'bg-emerald-500 text-navy-950 shadow-emerald-500/30'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-navy-950 shadow-emerald-500/20 hover:scale-105'
                }`}
              >
                {hasActivatedRoute ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-navy-950" />
                    <span>Rebalance Route Active!</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4 fill-navy-950" />
                    <span>Redistribute My Trip to {selectedAlternative.name}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Before and After Impact Transformation Matrix (National Hackathon Highlight) */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <Gauge className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">
                Before vs After Tourism Demand Redistribution
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Quantified systemic impact: Transforming an overtourism catastrophe into distributed rural prosperity.
            </p>
          </div>

          <div className="inline-flex rounded-xl bg-navy-900/80 p-1 border border-white/10 text-xs font-medium">
            <button
              onClick={() => setImpactView('side-by-side')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                impactView === 'side-by-side' ? 'bg-emerald-500 text-navy-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Side-by-Side Comparison
            </button>
            <button
              onClick={() => setImpactView('metric-breakdown')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                impactView === 'metric-breakdown' ? 'bg-emerald-500 text-navy-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Environmental Ledger
            </button>
          </div>
        </div>

        {impactView === 'side-by-side' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Left: Before (Shimla Saturated) */}
            <div className="rounded-2xl p-5 bg-rose-950/20 border border-rose-500/30 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-rose-500/20">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    Without DeshDarshan &bull; Hotspot Default
                  </span>
                  <h4 className="text-xl font-bold text-white mt-1">{currentHotspot.name} Crisis</h4>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-rose-400">{currentHotspot.saturationPct}%</span>
                  <span className="block text-[10px] text-rose-300">Saturation Level</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-slate-400 flex items-center">
                    <Clock className="w-3.5 h-3.5 text-rose-400 mr-2" />
                    Traffic Queue & Wait Time:
                  </span>
                  <span className="font-bold text-rose-300">{currentHotspot.expectedWaitHours} Hours in Idling Traffic</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-slate-400 flex items-center">
                    <Coins className="w-3.5 h-3.5 text-rose-400 mr-2" />
                    Local Rural Community Benefit:
                  </span>
                  <span className="font-bold text-rose-300">₹0 (100% Captured by Corporate OTAs & Hoteliers)</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-slate-400 flex items-center">
                    <Droplets className="w-3.5 h-3.5 text-rose-400 mr-2" />
                    Municipal Water Stress:
                  </span>
                  <span className="font-bold text-rose-300">{currentHotspot.waterDemandMLD} MLD (Severe Scarcity Deficit)</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-slate-400 flex items-center">
                    <Trash2 className="w-3.5 h-3.5 text-rose-400 mr-2" />
                    Slope Plastic & Solid Waste:
                  </span>
                  <span className="font-bold text-rose-300">{currentHotspot.wasteGenerationTons} Tonnes / day dumping</span>
                </div>

                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-400 flex items-center">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 mr-2" />
                    Traveler Experience Rating:
                  </span>
                  <span className="font-bold text-rose-300">2.4 / 5.0 (Extreme Fatigue & Honking)</span>
                </div>
              </div>
            </div>

            {/* Right: After (Narkanda Rebalanced) */}
            <div className="rounded-2xl p-5 bg-emerald-950/20 border border-emerald-500/40 space-y-4 shadow-lg shadow-emerald-500/5">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    With DeshDarshan &bull; AI Rebalanced
                  </span>
                  <h4 className="text-xl font-bold text-white mt-1">{selectedAlternative.name} Destination</h4>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400">{selectedAlternative.saturationPct}%</span>
                  <span className="block text-[10px] text-emerald-300">Optimal Eco-Load</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-slate-300 flex items-center">
                    <Clock className="w-3.5 h-3.5 text-emerald-400 mr-2" />
                    Traffic Queue & Wait Time:
                  </span>
                  <span className="font-bold text-emerald-400">
                    &lt; 12 Mins ({selectedAlternative.trafficSavedHours} Hours Saved!)
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-slate-300 flex items-center">
                    <Coins className="w-3.5 h-3.5 text-emerald-400 mr-2" />
                    Direct Rural Economy Gain:
                  </span>
                  <span className="font-bold text-emerald-400">
                    +{formatINR(selectedAlternative.moneyRedirectedINR || 4500)} Direct to Village Hosts (ONDC)
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-slate-300 flex items-center">
                    <Droplets className="w-3.5 h-3.5 text-emerald-400 mr-2" />
                    Ecological Water Stress:
                  </span>
                  <span className="font-bold text-emerald-400">
                    {selectedAlternative.waterDemandMLD} MLD (100% Sustainable Natural Spring)
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-slate-300 flex items-center">
                    <Trash2 className="w-3.5 h-3.5 text-emerald-400 mr-2" />
                    Slope Solid Waste:
                  </span>
                  <span className="font-bold text-emerald-400">
                    93% Diverted &bull; {selectedAlternative.wasteGenerationTons} T/day zero-plastic protocol
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-300 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-2" />
                    Traveler Experience Rating:
                  </span>
                  <span className="font-bold text-emerald-400">
                    4.9 / 5.0 (Pristine Nature & Siddu Hospitality)
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-navy-950/80 p-4 rounded-xl border border-white/10">
                <div className="text-xs text-slate-400">Avoided Idling Carbon</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">28.4 kg CO₂e</div>
                <p className="text-[11px] text-slate-400 mt-1">Equivalent to planting 1.4 mature deodar pine trees.</p>
              </div>

              <div className="bg-navy-950/80 p-4 rounded-xl border border-white/10">
                <div className="text-xs text-slate-400">Municipal Water Preserved</div>
                <div className="text-2xl font-black text-cyan-400 mt-1">3,400 Litres</div>
                <p className="text-[11px] text-slate-400 mt-1">Saves water for 12 local resident households in Shimla town.</p>
              </div>

              <div className="bg-navy-950/80 p-4 rounded-xl border border-white/10">
                <div className="text-xs text-slate-400">Direct Rural Wealth Multiplier</div>
                <div className="text-2xl font-black text-amber-400 mt-1">96.2% Retained</div>
                <p className="text-[11px] text-slate-400 mt-1">Vs 65% retained in conventional centralized online travel platforms.</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick ONDC Homestay Booking CTA */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ready to complete your trip? Verified ONDC homestays available in {selectedAlternative.name}.</span>
          </div>

          <button
            onClick={() => onOpenONDC(selectedAlternative.name)}
            className="flex items-center space-x-1.5 text-emerald-400 hover:text-emerald-300 font-bold hover:underline"
          >
            <span>Book via ONDC Beckn Marketplace</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
