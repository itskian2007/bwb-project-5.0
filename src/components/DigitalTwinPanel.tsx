'use client';

import React, { useState, useEffect } from 'react';
import { Destination } from '../types';
import { formatNumber } from '../lib/utils';
import { 
  AlertTriangle, 
  Droplets, 
  Trash2, 
  Clock, 
  TrendingUp, 
  Gauge, 
  MapPin, 
  Compass,
  Layers,
  ArrowRight,
  Activity,
  ShieldAlert,
  ArrowUpRight,
  TrendingDown,
  Building,
  CheckCircle2
} from 'lucide-react';

interface DigitalTwinPanelProps {
  destination: Destination;
  timeOffsetHours: number;
  setTimeOffsetHours: (h: number) => void;
  onSetAsHotspotToBalance?: (dest: Destination) => void;
}

export const DigitalTwinPanel: React.FC<DigitalTwinPanelProps> = ({
  destination,
  timeOffsetHours,
  setTimeOffsetHours,
  onSetAsHotspotToBalance
}) => {
  // Live pulse tickers simulation
  const [pulseIndex, setPulseIndex] = useState(0);

  const pulseEvents = [
    { text: `+547 tourists entered ${destination.name}`, tag: 'INFLOW', color: 'text-amber-400' },
    { text: '+1,283 redistributed today via NH corridors', tag: 'DIVERSION', color: 'text-emerald-400' },
    { text: 'Narkanda & satellites reaching optimal utilization', tag: 'CAPACITY', color: 'text-blue-400' },
    { text: 'Traffic pressure rising along gateway choke points', tag: 'TELEMETRY', color: 'text-red-400' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % pulseEvents.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [pulseEvents.length]);

  // Compute time adjusted saturation
  const adjustedSaturation = timeOffsetHours === 0 
    ? destination.saturationPct 
    : destination.isHotspot 
      ? Math.min(99, Math.round(destination.saturationPct + (timeOffsetHours * 2.2)))
      : Math.min(85, Math.round(destination.saturationPct + (timeOffsetHours * 3.5)));

  const adjustedVisitors = timeOffsetHours === 0
    ? destination.currentVisitors
    : Math.round(destination.currentVisitors + ((destination.predictedVisitors3h - destination.currentVisitors) * (timeOffsetHours / 3)));

  const isOverloaded = adjustedSaturation >= 75;
  const isModerate = adjustedSaturation >= 45 && adjustedSaturation < 75;

  const statusColor = isOverloaded ? 'text-red-400' : isModerate ? 'text-amber-400' : 'text-emerald-400';
  const statusBg = isOverloaded ? 'bg-red-500' : isModerate ? 'bg-amber-500' : 'bg-emerald-500';

  // Infrastructure load calculations
  const waterSupplyCapacityMLD = (destination.carryingCapacity * 0.00018).toFixed(1);
  const waterDeficit = parseFloat((destination.waterDemandMLD - parseFloat(waterSupplyCapacityMLD)).toFixed(1));
  const hasWaterDeficit = destination.isHotspot && waterDeficit > 0;

  return (
    <div className="h-full flex flex-col bg-[#131f37] border border-[#223354] rounded-lg text-slate-200 overflow-hidden">
      {/* Panel Header */}
      <div className="px-3.5 py-2.5 bg-[#0f182c] border-b border-[#223354] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-1.5">
          <Layers className="w-4 h-4 text-emerald-500" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            1. Digital Tourism Twin
          </h2>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0d1527] text-slate-300 border border-[#223354]">
          GIS Node: {destination.id}
        </span>
      </div>

      <div className="p-3.5 space-y-3.5 overflow-y-auto flex-1">

        {/* ── 1. LIVE TOURISM PULSE (Ticker) ── */}
        <div className="p-2.5 rounded bg-[#0a1222] border border-[#1e2f52] flex items-center justify-between">
          <div className="flex items-center space-x-2 overflow-hidden">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider flex-shrink-0">
              PULSE:
            </div>
            <div className={`text-xs font-semibold truncate ${pulseEvents[pulseIndex].color}`}>
              {pulseEvents[pulseIndex].text}
            </div>
          </div>
          <span className="text-[9px] font-mono text-slate-500 uppercase px-1.5 py-0.5 rounded bg-[#131f37] border border-[#223354] flex-shrink-0">
            {pulseEvents[pulseIndex].tag}
          </span>
        </div>

        {/* ── 2. SYSTEM ALERTS PANEL (Predictive Early Warning) ── */}
        {destination.isHotspot ? (
          <div className="p-3 rounded bg-red-950/30 border border-red-900/50 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-red-400 font-mono text-xs font-bold uppercase">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span>SYSTEM WARNING · CHOKE POINT RISK</span>
              </div>
              <span className="text-[9px] font-mono text-red-400/80 bg-red-950 px-1 rounded border border-red-800/40">
                T+3H PREDICTION
              </span>
            </div>
            <p className="text-xs text-red-200 font-medium leading-relaxed">
              <strong>{destination.name} Saturation</strong> predicted to exceed <span className="text-red-400 font-bold font-mono">98%</span> within 3 hours. Municipal water deficit and Cart Road bottleneck imminent.
            </p>
            <div className="pt-1.5 border-t border-red-900/30 flex items-start space-x-1.5 text-[11px] text-slate-300">
              <span className="text-emerald-400 font-mono font-bold uppercase flex-shrink-0">RECOMMENDATION:</span>
              <span className="text-slate-300">
                Throttle inbound highway access. Increase dynamic routing &amp; transit incentives towards satellite corridor.
              </span>
            </div>
          </div>
        ) : (
          <div className="p-2.5 rounded bg-emerald-950/20 border border-emerald-900/40 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-medium">Eco-Buffer Satellite Active</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              {destination.carryingCapacity - destination.currentVisitors} capacity remaining
            </span>
          </div>
        )}

        {/* ── 3. DESTINATION TELEMETRY HEADER ── */}
        <div className="p-2.5 rounded bg-[#0f182c] border border-[#1c2b47]">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-bold text-white flex items-center">
                <span>{destination.name}</span>
                <span className={`ml-2 text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  destination.isHotspot ? 'bg-red-950/80 text-red-300 border border-red-800' : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                }`}>
                  {destination.isHotspot ? 'CONGESTION HOTSPOT' : 'ALTERNATIVE ECO-HUB'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {destination.state} &bull; Altitude: {destination.altitudeMeters}m
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
            {destination.description}
          </p>
        </div>

        {/* ── 4. CARRYING CAPACITY SATURATION GAUGE ── */}
        <div className="p-3 rounded bg-[#0f182c] border border-[#1c2b47] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 uppercase font-mono">
              Carrying Capacity Saturation
            </span>
            <span className={`text-base font-black font-mono ${statusColor}`}>
              {adjustedSaturation}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#0d1527] h-2.5 rounded-full overflow-hidden border border-[#223354]">
            <div
              className={`h-full transition-all duration-500 ${statusBg}`}
              style={{ width: `${Math.min(100, adjustedSaturation)}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Threshold: 75%</span>
            <span>Current: {isOverloaded ? 'CRITICAL OVERLOAD' : isModerate ? 'MODERATE' : 'OPTIMAL'}</span>
          </div>
        </div>

        {/* ── 5. VISITOR INFLOW VS CARRYING CAPACITY ── */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded bg-[#0f182c] border border-[#1c2b47]">
            <span className="text-[10px] text-slate-400 font-mono block">Estimated Daily Inflow</span>
            <span className="text-sm font-black text-white font-mono mt-0.5 block">
              {formatNumber(adjustedVisitors)}
            </span>
            <span className="text-[10px] text-slate-400">tourists / 24h</span>
          </div>

          <div className="p-2.5 rounded bg-[#0f182c] border border-[#1c2b47]">
            <span className="text-[10px] text-slate-400 font-mono block">Carrying Capacity Ceiling</span>
            <span className="text-sm font-black text-slate-300 font-mono mt-0.5 block">
              {formatNumber(destination.carryingCapacity)}
            </span>
            <span className="text-[10px] text-emerald-400">sustainable threshold</span>
          </div>
        </div>

        {/* ── 6. INFRASTRUCTURE LOAD DIAGNOSTICS ── */}
        <div className="p-3 rounded bg-[#0f182c] border border-[#1c2b47] space-y-2">
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">
            Infrastructure Load Diagnostics
          </span>

          {/* Municipal Water Draw */}
          <div className="flex items-center justify-between text-xs py-1 border-b border-[#1c2b47]">
            <span className="text-slate-300 flex items-center">
              <Droplets className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
              Municipal Water Draw:
            </span>
            <span className="font-mono text-white">
              {destination.waterDemandMLD} MLD 
              {hasWaterDeficit && (
                <span className="text-[10px] text-red-400 ml-1 font-bold">(-{waterDeficit} MLD deficit)</span>
              )}
            </span>
          </div>

          {/* Solid Waste Generation */}
          <div className="flex items-center justify-between text-xs py-1 border-b border-[#1c2b47]">
            <span className="text-slate-300 flex items-center">
              <Trash2 className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
              Solid Waste Generation:
            </span>
            <span className="font-mono text-white">
              {destination.wasteGenerationTons} Tonnes/day
            </span>
          </div>

          {/* Vehicular Wait Time */}
          <div className="flex items-center justify-between text-xs py-1">
            <span className="text-slate-300 flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-red-400" />
              Access Road Queue:
            </span>
            <span className="font-mono text-white">
              {destination.expectedWaitHours} hrs ({destination.trafficStatus})
            </span>
          </div>
        </div>

        {/* ── 7. REDISTRIBUTION SUMMARY (Macro Impact Telemetry) ── */}
        <div className="p-3 rounded bg-[#0b1426] border border-[#203254] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              National Redistribution Summary
            </span>
            <span className="text-[9px] font-mono text-emerald-400">TODAY CUMULATIVE</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-[#0f182c] border border-[#1c2b47]">
              <span className="text-[10px] text-slate-400 block font-mono">Tourists Redirected</span>
              <strong className="text-sm font-bold text-emerald-400 font-mono">14,523</strong>
              <span className="text-[9px] text-slate-500 block">from choke corridors</span>
            </div>

            <div className="p-2 rounded bg-[#0f182c] border border-[#1c2b47]">
              <span className="text-[10px] text-slate-400 block font-mono">Revenue Generated</span>
              <strong className="text-sm font-bold text-amber-300 font-mono">₹18.4 Lakhs</strong>
              <span className="text-[9px] text-slate-500 block">injected into rural clusters</span>
            </div>

            <div className="p-2 rounded bg-[#0f182c] border border-[#1c2b47]">
              <span className="text-[10px] text-slate-400 block font-mono">Congestion Reduction</span>
              <strong className="text-sm font-bold text-blue-400 font-mono">34%</strong>
              <span className="text-[9px] text-slate-500 block">at peak choke points</span>
            </div>

            <div className="p-2 rounded bg-[#0f182c] border border-[#1c2b47]">
              <span className="text-[10px] text-slate-400 block font-mono">Rural Destinations Benefited</span>
              <strong className="text-sm font-bold text-purple-300 font-mono">127</strong>
              <span className="text-[9px] text-slate-500 block">active satellite hubs</span>
            </div>
          </div>
        </div>

        {/* ── 8. 3-HOUR PREDICTIVE DEMAND SIMULATION ── */}
        <div className="p-3 rounded bg-[#0f182c] border border-[#1c2b47] space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-300 font-semibold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Predicted Demand (Simulation)
            </span>
            <span className="text-[10px] font-mono text-emerald-300">
              {timeOffsetHours === 0 ? 'Live Now' : `+${timeOffsetHours}h Forecast`}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1 text-center font-mono">
            {[0, 1, 2, 3].map(h => {
              const satAtH = h === 0 
                ? destination.saturationPct 
                : destination.isHotspot 
                  ? Math.min(99, Math.round(destination.saturationPct + (h * 2.2)))
                  : Math.min(85, Math.round(destination.saturationPct + (h * 3.5)));
              const isSelected = timeOffsetHours === h;

              return (
                <button
                  key={h}
                  onClick={() => setTimeOffsetHours(h)}
                  className={`p-1.5 rounded border text-[10px] transition-all ${
                    isSelected
                      ? 'bg-[#15803d] text-white border-emerald-500 font-bold'
                      : 'bg-[#0d1527] text-slate-400 border-[#223354] hover:text-white'
                  }`}
                >
                  <div className="text-[9px] opacity-75">{h === 0 ? 'Now' : `+${h}h`}</div>
                  <div>{satAtH}%</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick balance action if inspected node is a hotspot */}
        {destination.isHotspot && onSetAsHotspotToBalance && (
          <button
            onClick={() => onSetAsHotspotToBalance(destination)}
            className="w-full py-2 px-3 rounded bg-[#0f182c] hover:bg-[#16243e] border border-[#223354] text-xs font-semibold text-emerald-300 flex items-center justify-center space-x-1.5 transition-all"
          >
            <span>Target in Load Balancer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
