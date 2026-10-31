'use client';

import React, { useState } from 'react';
import { Destination } from '../types';
import { formatINR, formatNumber } from '../lib/utils';
import { 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Droplets, 
  Leaf, 
  IndianRupee, 
  AlertCircle,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

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
  const [advisoryActive, setAdvisoryActive] = useState<boolean>(false);
  const [advisoryFeedback, setAdvisoryFeedback] = useState<string | null>(null);

  const handleActivateAdvisory = () => {
    setAdvisoryActive(true);
    setAdvisoryFeedback(`Advisory broadcasted to VMS highway displays on NH-5 & navigation feeds. Estimated diversion rate: 28% toward ${selectedAlternative.name}.`);
  };

  const trafficSaved = selectedAlternative.trafficSavedHours || 2.3;
  const moneyRedirected = selectedAlternative.moneyRedirectedINR || 4500;
  const co2AvoidedKg = 28.4;
  const waterRelievedMLD = 0.4;

  return (
    <div className="h-full flex flex-col bg-[#0E1A38] border border-[#1E2F5B] rounded-lg text-slate-200 overflow-hidden">
      {/* Panel Header */}
      <div className="px-3.5 py-2.5 bg-[#0B1530] border-b border-[#1E2F5B] flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <Compass className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            2. Tourism Load Balancer
          </h2>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
          ALGORITHM ACTIVE
        </span>
      </div>

      <div className="p-3.5 space-y-4 overflow-y-auto flex-1">
        {/* Step 1: Select Hotspot */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Step 1: Select Congested Hotspot
          </label>
          <select
            value={selectedHotspot.id}
            onChange={(e) => {
              const found = hotspots.find(h => h.id === e.target.value);
              if (found) {
                onSelectHotspot(found);
                setAdvisoryActive(false);
                setAdvisoryFeedback(null);
              }
            }}
            className="w-full bg-[#0A142D] border border-[#1E2F5B] rounded px-2.5 py-1.5 text-xs text-white font-medium focus:outline-none focus:border-emerald-500"
          >
            {hotspots.map(h => (
              <option key={h.id} value={h.id}>
                {h.name} — {h.saturationPct}% Overloaded ({formatNumber(h.currentVisitors)} visitors)
              </option>
            ))}
          </select>
        </div>

        {/* Selected Hotspot Overview */}
        <div className="p-2.5 rounded bg-[#0A142D] border border-red-900/30 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white">{selectedHotspot.name} Crisis Telemetry</span>
            <span className="font-mono text-red-400 font-bold">{selectedHotspot.saturationPct}% Saturated</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div>
              <span className="text-slate-400 block text-[10px]">Expected Delay:</span>
              <strong className="text-red-300">{selectedHotspot.expectedWaitHours} hrs ({selectedHotspot.trafficStatus})</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Over-Capacity:</span>
              <strong className="text-red-300">+{formatNumber(selectedHotspot.currentVisitors - selectedHotspot.carryingCapacity)} visitors</strong>
            </div>
          </div>
        </div>

        {/* Step 2: Alternative Destinations (Low Saturation) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Step 2: Recommended Alternatives
            </label>
            <span className="text-[10px] text-emerald-400 font-mono">Green Zones</span>
          </div>

          <div className="space-y-1.5">
            {alternatives.map(alt => {
              const isSelected = alt.id === selectedAlternative.id;
              return (
                <button
                  key={alt.id}
                  onClick={() => {
                    onSelectAlternative(alt);
                    setAdvisoryActive(false);
                    setAdvisoryFeedback(null);
                  }}
                  className={`w-full text-left p-2 rounded border transition-all text-xs flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#15803D]/20 border-emerald-500 text-white'
                      : 'bg-[#0A142D] border-[#1E2F5B] text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white flex items-center">
                      <span>{alt.name}</span>
                      <span className="ml-2 font-mono text-[10px] text-emerald-400">
                        ({alt.saturationPct}% sat.)
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      +{alt.distanceDeltaKm} km &bull; {alt.travelTimeDeltaMins} min scenic drive
                    </div>
                  </div>

                  <div className="text-right font-mono text-[11px]">
                    <span className="text-emerald-400 font-bold block">-{alt.trafficSavedHours || 2.0}h traffic</span>
                    <span className="text-[10px] text-slate-400">{formatNumber(alt.currentVisitors)} visited</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Estimated Redirection Benefits */}
        <div className="p-3 rounded bg-[#0A142D] border border-[#1A2B52] space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Calculated Redistribution Benefits
          </span>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-[#070D1E] border border-[#162347]">
              <span className="text-slate-400 text-[10px] block">Travel Time Saved</span>
              <strong className="text-sm font-bold text-emerald-400 font-mono">
                {trafficSaved} Hours
              </strong>
              <span className="text-[9px] text-slate-500 block">per diverted vehicle</span>
            </div>

            <div className="p-2 rounded bg-[#070D1E] border border-[#162347]">
              <span className="text-slate-400 text-[10px] block">CO₂ Footprint Relieved</span>
              <strong className="text-sm font-bold text-emerald-400 font-mono">
                {co2AvoidedKg} kg
              </strong>
              <span className="text-[9px] text-slate-500 block">idle emissions cut</span>
            </div>

            <div className="p-2 rounded bg-[#070D1E] border border-[#162347]">
              <span className="text-slate-400 text-[10px] block">Hotspot Water Relieved</span>
              <strong className="text-sm font-bold text-cyan-400 font-mono">
                {waterRelievedMLD} MLD
              </strong>
              <span className="text-[9px] text-slate-500 block">municipal buffer</span>
            </div>

            <div className="p-2 rounded bg-[#070D1E] border border-[#162347]">
              <span className="text-slate-400 text-[10px] block">Rural Economic Injection</span>
              <strong className="text-sm font-bold text-amber-300 font-mono">
                {formatINR(moneyRedirected)}
              </strong>
              <span className="text-[9px] text-slate-500 block">per visitor spend</span>
            </div>
          </div>
        </div>

        {/* Action Button: Broadcast Advisory */}
        <div>
          <button
            onClick={handleActivateAdvisory}
            disabled={advisoryActive}
            className={`w-full py-2.5 px-3 rounded font-bold text-xs flex items-center justify-center space-x-1.5 transition-all ${
              advisoryActive
                ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-600 cursor-default'
                : 'bg-[#15803D] hover:bg-[#166534] text-white shadow-md'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{advisoryActive ? 'Advisory Active on Highway Signs & Apps' : 'Deploy Traffic Advisory & Diversion'}</span>
          </button>

          {advisoryFeedback && (
            <p className="mt-1.5 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 p-2 rounded">
              {advisoryFeedback}
            </p>
          )}
        </div>

        {/* Rural Community Beneficiaries Link */}
        <div className="p-2.5 rounded bg-[#0A142D] border border-[#1A2B52] text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200">Local Beneficiaries in {selectedAlternative.name}</span>
            <span className="text-[10px] font-mono text-emerald-400">ONDC Connected</span>
          </div>

          <div className="text-[11px] text-slate-300 space-y-1">
            <div className="flex justify-between py-0.5 border-b border-[#14203D]">
              <span>Thanedhar Apple Orchard Homestay</span>
              <strong className="text-white">₹2,800/night</strong>
            </div>
            <div className="flex justify-between py-0.5">
              <span>Kumarsain Pure Angora Shawl Weaver</span>
              <strong className="text-white">₹2,400 (GI Tag)</strong>
            </div>
          </div>

          <button
            onClick={onOpenRuralDiscovery}
            className="w-full py-1.5 text-center text-[11px] font-medium text-emerald-300 hover:text-emerald-200 bg-[#0E1A38] hover:bg-[#152347] border border-[#1E2F5B] rounded transition-all flex items-center justify-center space-x-1"
          >
            <span>Explore All Rural Listings for {selectedAlternative.name}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
