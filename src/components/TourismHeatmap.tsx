'use client';

import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  MapPin, 
  Clock, 
  Sliders, 
  AlertCircle, 
  Navigation, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Eye, 
  Car, 
  Droplets, 
  ShieldCheck,
  Radio
} from 'lucide-react';
import { DESTINATIONS } from '../data/mockData';
import { Destination } from '../types';
import { formatNumber } from '../lib/utils';

interface TourismHeatmapProps {
  onSelectDestinationForRebalance: (destination: Destination) => void;
}

export const TourismHeatmap: React.FC<TourismHeatmapProps> = ({
  onSelectDestinationForRebalance
}) => {
  const [selectedCircuit, setSelectedCircuit] = useState<string>('all');
  const [timeOffsetHours, setTimeOffsetHours] = useState<number>(0); // 0 = Now, 1 = +1h, 2 = +2h, 3 = +3h
  const [activeLayers, setActiveLayers] = useState<{
    density: boolean;
    traffic: boolean;
    flowCorridors: boolean;
    ecoStress: boolean;
  }>({
    density: true,
    traffic: true,
    flowCorridors: true,
    ecoStress: false
  });
  const [inspectedDestination, setInspectedDestination] = useState<Destination>(DESTINATIONS[0]);

  // Filter destinations by circuit
  const filteredDestinations = DESTINATIONS.filter(d => {
    if (selectedCircuit === 'all') return true;
    if (selectedCircuit === 'himachal') return d.state === 'Himachal Pradesh';
    if (selectedCircuit === 'uttarakhand') return d.state === 'Uttarakhand';
    if (selectedCircuit === 'south') return d.state === 'Tamil Nadu' || d.region === 'Western Ghats';
    if (selectedCircuit === 'west') return d.state === 'Goa' || d.state === 'Rajasthan';
    return true;
  });

  // Calculate dynamic saturation based on predictive time slider
  const getDynamicSaturation = (dest: Destination, offset: number) => {
    if (offset === 0) return dest.saturationPct;
    // Saturated hotspots swell by +2% to +5% per hour in peak season
    if (dest.isHotspot) {
      return Math.min(99, Math.round(dest.saturationPct + (offset * 1.8)));
    }
    // Rebalanced destinations absorb slight positive healthy traffic
    return Math.min(85, Math.round(dest.saturationPct + (offset * 3.2)));
  };

  const getDynamicVisitors = (dest: Destination, offset: number) => {
    if (offset === 0) return dest.currentVisitors;
    const delta = (dest.predictedVisitors3h - dest.currentVisitors) * (offset / 3);
    return Math.round(dest.currentVisitors + delta);
  };

  const getSaturationColorClass = (sat: number) => {
    if (sat >= 75) return { bg: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-500', glow: 'shadow-rose-500/50' };
    if (sat >= 45) return { bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500', glow: 'shadow-amber-500/50' };
    return { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500', glow: 'shadow-emerald-500/50' };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h2 className="text-base font-bold text-white tracking-wide">
              Live National Tourism Heatmap &amp; 3-Hour Congestion Predictor
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-circuit telemetry combining cell tower pings, FASTag toll queues, and satellite cloud cover.
          </p>
        </div>

        {/* Circuit Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All India Circuits' },
            { id: 'himachal', label: 'Himachal Ridge' },
            { id: 'uttarakhand', label: 'Garhwal Range' },
            { id: 'south', label: 'Western Ghats' },
            { id: 'west', label: 'Goa & Rajasthan' },
          ].map(circuit => (
            <button
              key={circuit.id}
              onClick={() => setSelectedCircuit(circuit.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCircuit === circuit.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-navy-900/60 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {circuit.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Heatmap Canvas & Side Telemetry Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Center: Interactive Tactical GIS Map Surface (8 cols) */}
        <div className="lg:col-span-8 glass-panel p-5 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col justify-between min-h-[580px]">
          {/* Tactical Map Grid Background & Ambient Radar Sweep */}
          <div className="absolute inset-0 bg-[#060D1E] pointer-events-none" />
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />

          {/* Top Floating Map Controls Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-navy-950/80 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
            {/* Legend */}
            <div className="flex items-center space-x-4 text-xs font-medium">
              <span className="flex items-center space-x-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm shadow-emerald-500/50" />
                <span>Available (&lt;45%)</span>
              </span>
              <span className="flex items-center space-x-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-sm shadow-amber-500/50" />
                <span>Busy (45-74%)</span>
              </span>
              <span className="flex items-center space-x-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-sm shadow-rose-500/50 animate-pulse" />
                <span>Overloaded (&gt;75%)</span>
              </span>
            </div>

            {/* Layer Toggles */}
            <div className="flex items-center space-x-2 text-xs">
              <button
                onClick={() => setActiveLayers(prev => ({ ...prev, flowCorridors: !prev.flowCorridors }))}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all ${
                  activeLayers.flowCorridors
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-navy-900 text-slate-400 border-white/5'
                }`}
              >
                Migration Flows
              </button>
              <button
                onClick={() => setActiveLayers(prev => ({ ...prev, traffic: !prev.traffic }))}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all ${
                  activeLayers.traffic
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-navy-900 text-slate-400 border-white/5'
                }`}
              >
                Traffic Corridors
              </button>
            </div>
          </div>

          {/* Interactive GIS Visualizer Canvas */}
          <div className="relative z-10 my-6 h-[380px] w-full flex items-center justify-center">
            {/* SVG Interactive Topology Surface */}
            <svg className="w-full h-full max-w-2xl select-none" viewBox="0 0 700 400">
              <defs>
                <radialGradient id="hotspotGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="greenGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="flowVector1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>

              {/* Geographic Contour Lines */}
              <path
                d="M 50,220 Q 200,140 380,180 T 650,200"
                fill="none"
                stroke="#1e293b"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <path
                d="M 80,100 Q 280,60 480,120 T 670,80"
                fill="none"
                stroke="#1e293b"
                strokeWidth="1.5"
              />
              <path
                d="M 40,320 Q 300,280 520,330 T 680,310"
                fill="none"
                stroke="#1e293b"
                strokeWidth="1.5"
              />

              {/* Migration Flow Corridors (Animated Dashed Vectors) */}
              {activeLayers.flowCorridors && (
                <>
                  {/* Shimla -> Narkanda corridor */}
                  <path
                    d="M 280,140 C 330,120 380,110 430,95"
                    fill="none"
                    stroke="url(#flowVector1)"
                    strokeWidth="3"
                    className="flow-dash"
                  />
                  {/* Shimla -> Mashobra corridor */}
                  <path
                    d="M 280,140 C 300,165 320,175 350,180"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    className="flow-dash"
                  />
                  {/* Manali -> Tirthan corridor */}
                  <path
                    d="M 180,90 C 190,140 210,180 230,220"
                    fill="none"
                    stroke="url(#flowVector1)"
                    strokeWidth="2.5"
                    className="flow-dash"
                  />
                </>
              )}

              {/* Destination Nodes on the Interactive Canvas */}
              {filteredDestinations.map((dest, index) => {
                // Map coordinates roughly into SVG space
                // Base layout calibrated for Indian geography demo representation
                let cx = 350;
                let cy = 200;

                if (dest.id === 'shimla') { cx = 280; cy = 140; }
                else if (dest.id === 'narkanda') { cx = 430; cy = 95; }
                else if (dest.id === 'mashobra') { cx = 350; cy = 180; }
                else if (dest.id === 'kufri') { cx = 320; cy = 125; }
                else if (dest.id === 'manali') { cx = 180; cy = 90; }
                else if (dest.id === 'tirthan') { cx = 230; cy = 220; }
                else if (dest.id === 'jibhi') { cx = 250; cy = 250; }
                else if (dest.id === 'mussoorie') { cx = 460; cy = 150; }
                else if (dest.id === 'kanatal') { cx = 520; cy = 135; }
                else if (dest.id === 'ooty') { cx = 220; cy = 320; }
                else if (dest.id === 'kotagiri') { cx = 300; cy = 330; }
                else if (dest.id === 'baga-goa') { cx = 130; cy = 270; }
                else if (dest.id === 'divar-island') { cx = 170; cy = 290; }
                else if (dest.id === 'jaipur-core') { cx = 200; cy = 190; }
                else if (dest.id === 'bundi') { cx = 260; cy = 230; }

                const dynSaturation = getDynamicSaturation(dest, timeOffsetHours);
                const colors = getSaturationColorClass(dynSaturation);
                const isSelected = inspectedDestination.id === dest.id;

                return (
                  <g
                    key={dest.id}
                    onClick={() => setInspectedDestination(dest)}
                    className="cursor-pointer transition-all duration-300"
                  >
                    {/* Pulsing ring for saturated hotspots */}
                    {dynSaturation >= 75 && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="24"
                        className="radar-ring"
                        fill="rgba(244, 63, 94, 0.25)"
                      />
                    )}

                    {/* Ambient Glow */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? '28' : '18'}
                      fill={dynSaturation >= 75 ? 'url(#hotspotGlow)' : 'url(#greenGlow)'}
                    />

                    {/* Core Pin Circle */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? '12' : '9'}
                      fill={dynSaturation >= 75 ? '#f43f5e' : dynSaturation >= 45 ? '#f59e0b' : '#10b981'}
                      stroke={isSelected ? '#ffffff' : '#070D1E'}
                      strokeWidth={isSelected ? '3' : '2'}
                      className="shadow-lg"
                    />

                    {/* Label Badge */}
                    <text
                      x={cx}
                      y={cy - 16}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={isSelected ? '12' : '11'}
                      fontWeight="bold"
                      className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                    >
                      {dest.name}
                    </text>

                    {/* Saturation % Tag */}
                    <text
                      x={cx}
                      y={cy + 22}
                      textAnchor="middle"
                      fill={dynSaturation >= 75 ? '#fda4af' : '#6ee7b7'}
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="600"
                    >
                      {dynSaturation}%
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Predictive Time-Travel Slider */}
          <div className="relative z-10 bg-navy-950/90 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Predictive Time Projection (AI Surge Forecaster)
                </span>
              </div>
              <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
                {timeOffsetHours === 0 ? 'LIVE TELEMETRY (NOW)' : `FORECAST: T + ${timeOffsetHours} HOURS`}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-xs text-slate-400 font-semibold">Now</span>
              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={timeOffsetHours}
                onChange={(e) => setTimeOffsetHours(parseInt(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-xs text-slate-300 font-semibold whitespace-nowrap">+3 Hours Surge</span>
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>09:30 AM (Baseline)</span>
              <span>10:30 AM (Inflow Surge)</span>
              <span>11:30 AM (Peak Bottleneck)</span>
              <span>12:30 PM (Critical Saturation)</span>
            </div>
          </div>
        </div>

        {/* Right: Inspected Destination Telemetry Card (4 cols) */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
              <Eye className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
              DESTINATION TELEMETRY
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
              inspectedDestination.saturationPct >= 75
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}>
              {inspectedDestination.isHotspot ? 'Saturated Hotspot' : 'Eco Alternative'}
            </span>
          </div>

          {/* Inspected Destination Title & Image */}
          <div>
            <div 
              className="h-32 w-full rounded-2xl bg-cover bg-center mb-3 border border-white/10 relative overflow-hidden"
              style={{ backgroundImage: `url(${inspectedDestination.imageUrl})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                <span className="text-lg font-black text-white">{inspectedDestination.name}</span>
                <span className="text-xs text-slate-300 font-mono">{inspectedDestination.state}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {inspectedDestination.description}
            </p>
          </div>

          {/* Dynamic Saturation at Current Predictive Time */}
          <div className="bg-navy-950/80 p-3.5 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Projected Crowd Saturation:</span>
              <span className="text-xl font-black text-white">
                {getDynamicSaturation(inspectedDestination, timeOffsetHours)}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  getDynamicSaturation(inspectedDestination, timeOffsetHours) >= 75
                    ? 'bg-rose-500'
                    : getDynamicSaturation(inspectedDestination, timeOffsetHours) >= 45
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, getDynamicSaturation(inspectedDestination, timeOffsetHours))}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Carrying Capacity: {formatNumber(inspectedDestination.carryingCapacity)}</span>
              <span>Projected: {formatNumber(getDynamicVisitors(inspectedDestination, timeOffsetHours))}</span>
            </div>
          </div>

          {/* Metrics List */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-white/5">
              <span className="text-slate-400 flex items-center">
                <Car className="w-3.5 h-3.5 text-amber-400 mr-2" />
                Traffic Status:
              </span>
              <span className="font-bold text-slate-200">{inspectedDestination.trafficStatus}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-white/5">
              <span className="text-slate-400 flex items-center">
                <Clock className="w-3.5 h-3.5 text-rose-400 mr-2" />
                Expected Queue Time:
              </span>
              <span className="font-bold text-slate-200">
                {inspectedDestination.expectedWaitHours > 0 ? `${inspectedDestination.expectedWaitHours} Hours` : '&lt; 15 mins'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-white/5">
              <span className="text-slate-400 flex items-center">
                <Droplets className="w-3.5 h-3.5 text-cyan-400 mr-2" />
                Water Demand:
              </span>
              <span className="font-bold text-slate-200">{inspectedDestination.waterDemandMLD} MLD</span>
            </div>

            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-400 flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-2" />
                Environmental Stress Index:
              </span>
              <span className="font-bold text-slate-200">{inspectedDestination.environmentalLoadScore} / 100</span>
            </div>
          </div>

          {/* Rebalance Call To Action */}
          <button
            onClick={() => onSelectDestinationForRebalance(inspectedDestination)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-navy-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-navy-950" />
            <span>
              {inspectedDestination.isHotspot
                ? `Redistribute Out of ${inspectedDestination.name}`
                : `Choose ${inspectedDestination.name} & Earn Credits`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
