'use client';

import React, { useState, useEffect } from 'react';
import { Destination } from '../types';
import { formatINR, formatNumber } from '../lib/utils';
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Radio,
  TrendingDown,
  Users,
  IndianRupee,
  Clock,
  Leaf,
  ChevronRight,
  MapPin,
  Zap
} from 'lucide-react';
import { RURAL_LISTINGS } from '../data/mockData';

interface LoadBalancerPanelProps {
  hotspots: Destination[];
  selectedHotspot: Destination;
  onSelectHotspot: (dest: Destination) => void;
  alternatives: Destination[];
  selectedAlternative: Destination;
  onSelectAlternative: (dest: Destination) => void;
  onOpenRuralDiscovery: () => void;
}

export const LoadBalancerPanel: React.FC<LoadBalancerPanelProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  alternatives,
  selectedAlternative,
  onSelectAlternative,
  onOpenRuralDiscovery
}) => {
  const [advisoryDeployed, setAdvisoryDeployed] = useState(false);
  const [advisoryMsg, setAdvisoryMsg] = useState<string | null>(null);
  const [flowStep, setFlowStep] = useState(0); // animates redistribution flow

  // Animate flow on load / hotspot change
  useEffect(() => {
    setAdvisoryDeployed(false);
    setAdvisoryMsg(null);
    setFlowStep(0);
    const timer = setTimeout(() => setFlowStep(1), 400);
    const timer2 = setTimeout(() => setFlowStep(2), 900);
    const timer3 = setTimeout(() => setFlowStep(3), 1400);
    return () => { clearTimeout(timer); clearTimeout(timer2); clearTimeout(timer3); };
  }, [selectedHotspot.id]);

  const handleDeploy = () => {
    setAdvisoryDeployed(true);
    setAdvisoryMsg(
      `Advisory broadcast to VMS highway signs on NH-${Math.floor(Math.random() * 50) + 1} & Google Maps feeds. ` +
      `Estimated diversion: ~${Math.round((alternatives[0]?.trafficSavedHours || 2.3) * 12)}% inbound rerouted toward ${alternatives[0]?.name || 'alternative destination'}.`
    );
  };

  // Congestion-level derived values
  const congestionColor =
    selectedHotspot.saturationPct >= 90 ? 'text-red-400' :
    selectedHotspot.saturationPct >= 70 ? 'text-amber-400' : 'text-emerald-400';

  const congestionLabel =
    selectedHotspot.saturationPct >= 90 ? 'CRITICAL OVERLOAD' :
    selectedHotspot.saturationPct >= 70 ? 'HIGH CONGESTION' : 'MODERATE';

  const congestionBorderColor =
    selectedHotspot.saturationPct >= 90 ? 'border-red-900/50' :
    selectedHotspot.saturationPct >= 70 ? 'border-amber-900/50' : 'border-emerald-900/50';

  // Build redistribution flow chain: hotspot → alts (max 4 nodes)
  const flowNodes: string[] = [selectedHotspot.name, ...alternatives.slice(0, 3).map(a => a.name)];

  // Featured local experience: first listing matching this hotspot's name (partial match)
  const featuredListing = RURAL_LISTINGS.find(l =>
    alternatives.some(a => l.nearestHotspot.toLowerCase().includes(a.name.toLowerCase().split(' ')[0]) ||
      a.name.toLowerCase().includes(l.nearestHotspot.toLowerCase().split(' ')[0]))
  ) || RURAL_LISTINGS[0];

  // Per-alternative computed congestion reduction %
  const getCongestionReduction = (alt: Destination) => {
    const overcapacity = selectedHotspot.currentVisitors - selectedHotspot.carryingCapacity;
    const divertable = alt.carryingCapacity - alt.currentVisitors;
    return Math.min(72, Math.round((divertable / (overcapacity + 1)) * 100));
  };

  const getLocalBusinessCount = (alt: Destination) => {
    return Math.round((alt.carryingCapacity / 1000) * 4.8);
  };

  const getRevenueLakhs = (alt: Destination) => {
    const val = Math.round(((alt.moneyRedirectedINR || 4000) * (alt.carryingCapacity - alt.currentVisitors)) / 100000);
    return Math.min(val, 28);
  };

  return (
    <div className="h-full flex flex-col bg-[#131f37] border border-[#223354] rounded-lg text-slate-200 overflow-hidden">
      {/* Panel Header */}
      <div className="px-3.5 py-2.5 bg-[#0f182c] border-b border-[#223354] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-1.5">
          <Radio className="w-3.5 h-3.5 text-emerald-500" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Tourism Redistribution
          </h2>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
          AI ACTIVE
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">

        {/* ── SECTION 1: Requested Destination Status ── */}
        <div>
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">
            Requested Destination
          </div>

          {/* Hotspot selector */}
          <select
            value={selectedHotspot.id}
            onChange={(e) => {
              const found = hotspots.find(h => h.id === e.target.value);
              if (found) onSelectHotspot(found);
            }}
            className="w-full bg-[#0f182c] border border-[#223354] rounded px-2.5 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-slate-500 mb-2"
          >
            {hotspots.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>

          {/* Status block */}
          <div className={`rounded border ${congestionBorderColor} bg-[#0f182c] p-3 space-y-2`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-base font-bold text-white leading-tight">{selectedHotspot.name}</div>
                <div className="text-[10px] text-slate-400">{selectedHotspot.state} · {selectedHotspot.altitudeMeters}m alt.</div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-mono font-bold ${congestionColor}`}>
                  {selectedHotspot.saturationPct}%
                </div>
                <div className={`text-[10px] font-mono font-bold ${congestionColor}`}>
                  {congestionLabel}
                </div>
              </div>
            </div>

            {/* Saturation bar */}
            <div>
              <div className="w-full h-1.5 bg-[#1c2b47] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    selectedHotspot.saturationPct >= 90 ? 'bg-red-500' :
                    selectedHotspot.saturationPct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${selectedHotspot.saturationPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-slate-500 mt-0.5 font-mono">
                <span>Threshold: 75%</span>
                <span>Capacity Ceiling: {formatNumber(selectedHotspot.carryingCapacity)}</span>
              </div>
            </div>

            {/* Key telemetry row */}
            <div className="grid grid-cols-3 gap-1.5 text-center pt-1 border-t border-[#1c2b47]">
              <div>
                <div className="text-[9px] text-slate-500 uppercase">Daily Inflow</div>
                <div className="text-xs font-bold text-white font-mono">{formatNumber(selectedHotspot.currentVisitors)}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-500 uppercase">Wait Time</div>
                <div className="text-xs font-bold text-red-300 font-mono">{selectedHotspot.expectedWaitHours}h</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-500 uppercase">Infra Load</div>
                <div className={`text-xs font-bold font-mono ${congestionColor}`}>{selectedHotspot.trafficStatus}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: Tourism Pressure Flow Map ── */}
        <div>
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">
            Redistribution Flow
          </div>
          <div className="bg-[#0f182c] border border-[#1c2b47] rounded p-3">
            <div className="text-[10px] text-slate-400 mb-2 font-mono">
              AI-Recommended Diversion Chain · {selectedHotspot.circuit}
            </div>
            <div className="space-y-0">
              {flowNodes.map((nodeName, idx) => {
                const isSource = idx === 0;
                const isVisible = flowStep > idx;
                const alt = alternatives[idx - 1];
                const satPct = isSource ? selectedHotspot.saturationPct : (alt?.saturationPct ?? 30);
                const dotColor = satPct >= 90 ? 'bg-red-500' :
                  satPct >= 70 ? 'bg-amber-400' : 'bg-emerald-500';
                const textColor = satPct >= 90 ? 'text-red-300' :
                  satPct >= 70 ? 'text-amber-300' : 'text-emerald-300';
                const selected = !isSource && alt?.id === selectedAlternative.id;

                return (
                  <div key={idx}>
                    <div
                      className={`flex items-center justify-between px-2 py-1.5 rounded transition-all duration-500 ${
                        isVisible ? 'opacity-100' : 'opacity-0'
                      } ${selected ? 'bg-[#15803d]/15 border border-[#15803d]/40' : ''} ${
                        !isSource ? 'cursor-pointer hover:bg-[#131f37]' : ''
                      }`}
                      onClick={() => { if (!isSource && alt) { onSelectAlternative(alt); } }}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor} ${isSource ? 'animate-pulse' : ''}`} />
                        <span className={`text-xs font-semibold ${isSource ? 'text-white' : 'text-slate-200'}`}>
                          {nodeName}
                        </span>
                        {isSource && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-950/70 text-red-400 border border-red-900/50">
                            OVERLOADED
                          </span>
                        )}
                        {selected && !isSource && (
                          <span className="text-[9px] font-mono text-emerald-400">← selected</span>
                        )}
                      </div>
                      <span className={`text-[10px] font-mono font-bold ${textColor}`}>
                        {satPct}% sat.
                      </span>
                    </div>
                    {/* Connector arrow between nodes */}
                    {idx < flowNodes.length - 1 && (
                      <div className={`flex items-center pl-3 py-0.5 transition-all duration-500 ${
                        flowStep > idx + 1 ? 'opacity-100' : 'opacity-0'
                      }`}>
                        <div className="w-px h-3 bg-[#223354] mx-[3.5px]" />
                        <ArrowDown className="w-2.5 h-2.5 text-slate-500 -ml-[3.5px]" />
                        <span className="text-[9px] text-slate-500 ml-2 font-mono">
                          {alternatives[idx]?.distanceDeltaKm ?? ''}km detour · {alternatives[idx]?.travelTimeDeltaMins ?? ''}min scenic
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── SECTION 3: AI Recommended Alternatives ── */}
        <div>
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">
            AI Recommended Alternatives
          </div>

          <div className="space-y-2">
            {alternatives.slice(0, 2).map((alt, idx) => {
              const isSelected = alt.id === selectedAlternative.id;
              const congRed = getCongestionReduction(alt);
              const bizCount = getLocalBusinessCount(alt);
              const revLakhs = getRevenueLakhs(alt);

              return (
                <button
                  key={alt.id}
                  onClick={() => onSelectAlternative(alt)}
                  className={`w-full text-left rounded border transition-all ${
                    isSelected
                      ? 'bg-[#0d1f10] border-emerald-700/60'
                      : 'bg-[#0f182c] border-[#1c2b47] hover:border-slate-500'
                  }`}
                >
                  {/* Alt header */}
                  <div className="px-3 pt-2.5 pb-2 border-b border-[#1c2b47]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] font-mono text-slate-500 bg-[#0d1527] px-1.5 py-0.5 rounded border border-[#1c2b47]">
                          ALT #{idx + 1}
                        </span>
                        <span className="text-sm font-bold text-white">{alt.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-400 font-mono">
                          {alt.similarityScore ?? 90}% match
                        </span>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 flex items-center space-x-1">
                      <MapPin className="w-2.5 h-2.5" />
                      <span>{alt.state} · {alt.altitudeMeters}m · {alt.saturationPct}% capacity used</span>
                    </div>
                  </div>

                  {/* Redistribution metrics — NOT booking info */}
                  <div className="px-3 py-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                    <div className="flex items-center space-x-1.5">
                      <TrendingDown className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      <div>
                        <div className="text-[9px] text-slate-500">Congestion Reduction</div>
                        <div className="font-bold text-emerald-400 font-mono">{congRed}%</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3 h-3 text-blue-400 flex-shrink-0" />
                      <div>
                        <div className="text-[9px] text-slate-500">Travel Time Saved</div>
                        <div className="font-bold text-blue-300 font-mono">{alt.trafficSavedHours ?? 2.1} hrs</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Users className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      <div>
                        <div className="text-[9px] text-slate-500">Local Businesses Supported</div>
                        <div className="font-bold text-amber-300 font-mono">{bizCount}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <IndianRupee className="w-3 h-3 text-amber-300 flex-shrink-0" />
                      <div>
                        <div className="text-[9px] text-slate-500">Revenue Redistribution</div>
                        <div className="font-bold text-amber-300 font-mono">₹{revLakhs}L projected</div>
                      </div>
                    </div>
                  </div>

                  {/* Scenic similarity tags */}
                  <div className="px-3 pb-2.5 flex flex-wrap gap-1">
                    {alt.scenicTags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-[#0d1527] border border-[#1c2b47] text-slate-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── SECTION 4: Featured Local Experience (single, not a grid) ── */}
        <div>
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">
            Featured Local Experience
          </div>
          <div className="rounded border border-[#1c2b47] overflow-hidden bg-[#0f182c]">
            {/* Large image strip */}
            <div
              className="h-28 w-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${featuredListing.imageUrl})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#0f182c]/90 via-[#0f182c]/30 to-transparent" />
              <div className="absolute inset-0 p-3 flex flex-col justify-end">
                <div className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider">
                  {featuredListing.category} · {featuredListing.village}
                </div>
                <div className="text-sm font-bold text-white leading-snug mt-0.5">
                  {featuredListing.title}
                </div>
                <div className="text-[10px] text-slate-300 mt-0.5 leading-tight">
                  {featuredListing.description.slice(0, 80)}…
                </div>
              </div>
            </div>
            {/* Info row */}
            <div className="px-3 py-2 flex items-center justify-between border-t border-[#1c2b47]">
              <div className="flex items-center space-x-3 text-[10px] text-slate-400">
                <span className="font-mono font-bold text-emerald-400">
                  {formatINR(featuredListing.priceINR)}/{featuredListing.priceUnit}
                </span>
                {featuredListing.verifiedGI && (
                  <span className="text-amber-400 font-semibold">GI Certified</span>
                )}
                <span>{featuredListing.directHostSharePct}% to host</span>
              </div>
              <button
                onClick={onOpenRuralDiscovery}
                className="text-[10px] font-semibold text-emerald-300 hover:text-white flex items-center space-x-0.5"
              >
                <span>See all</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* ── SECTION 5: Deploy Advisory Action ── */}
        <div>
          <button
            onClick={handleDeploy}
            disabled={advisoryDeployed}
            className={`w-full py-2 px-3 rounded font-bold text-xs flex items-center justify-center space-x-1.5 transition-all ${
              advisoryDeployed
                ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-700/50 cursor-default'
                : 'bg-[#15803d] hover:bg-[#166534] text-white border border-transparent'
            }`}
          >
            {advisoryDeployed
              ? <><CheckCircle2 className="w-3.5 h-3.5" /><span>Advisory Deployed on Highway Signboards</span></>
              : <><Zap className="w-3.5 h-3.5" /><span>Deploy Diversion Advisory to VMS & Navigation</span></>
            }
          </button>
          {advisoryMsg && (
            <p className="mt-1.5 text-[10px] text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 p-2 rounded leading-relaxed">
              {advisoryMsg}
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
