'use client';

import React, { useState } from 'react';
import { 
  Leaf, 
  Wind, 
  Droplets, 
  Trash2, 
  TrendingDown, 
  TrendingUp, 
  Coins, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  TreePine,
  Layers,
  ArrowRight
} from 'lucide-react';
import { NATIONAL_SYSTEM_METRICS } from '../data/mockData';
import { formatNumber, formatINR } from '../lib/utils';

export const SustainabilityDashboard: React.FC = () => {
  const [divertedTouristCount, setDivertedTouristCount] = useState<number>(142850);

  // Carbon calculation constants based on mountain idling and road diversion
  const calcCarbonAvoidedTonnes = ((divertedTouristCount * 8.68) / 1000).toFixed(1);
  const calcHoursSaved = Math.round(divertedTouristCount * 2.4);
  const calcWasteDivertedTonnes = ((divertedTouristCount * 6.25) / 1000).toFixed(1);
  const calcRuralWealthCr = ((divertedTouristCount * 3400) / 10000000).toFixed(1);
  const calcTreesEquivalent = Math.round(divertedTouristCount * 0.42);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Sustainability Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-navy-950 via-navy-900 to-emerald-950/20 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>CLIMATE INTELLIGENCE &bull; ECOLOGICAL TWIN METRICS</span>
            </div>
            <h2 className="text-3xl font-black text-white">
              Climate &amp; Environmental Impact Ledger
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Every tourist rerouted from an overcrowded hill station directly protects fragile Himalayan alpine slopes, relieves municipal water aquifers, and replaces idling tailpipe emissions with clean rural stays.
            </p>
          </div>

          <div className="bg-navy-950/80 p-4 rounded-2xl border border-white/10 text-xs text-right space-y-1">
            <span className="text-slate-400 block font-mono text-[10px]">VERIFIED METHODOLOGY</span>
            <span className="text-emerald-400 font-extrabold text-sm block">GHG Protocol &bull; Scope 3</span>
            <span className="text-slate-300 text-[11px]">Himalayan Biosphere Council Standards</span>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars of Sustainability (Prompt Requirement #8) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Carbon Reduction */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Carbon Reduction</span>
              <div className="text-3xl font-black text-white mt-1">
                {calcCarbonAvoidedTonnes} <span className="text-base font-bold text-emerald-400">Tonnes</span>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              CO₂ emissions eliminated by avoiding severe single-lane idling on Cart Road, Kalka-Shimla highway, and Solang queues.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Tree Carbon Offset:</span>
            <span className="text-emerald-400 font-bold">{formatNumber(calcTreesEquivalent)} Pines</span>
          </div>
        </div>

        {/* Metric 2: Avoided Congestion */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avoided Congestion</span>
              <div className="text-3xl font-black text-white mt-1">
                {formatNumber(calcHoursSaved)} <span className="text-base font-bold text-amber-400">Hours</span>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              Productive traveler and resident time preserved by distributing peak weekend surges to Narkanda, Kanatal, and Kotagiri.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Avg Saved Per Family:</span>
            <span className="text-amber-400 font-bold">2.4 Hours Saved</span>
          </div>
        </div>

        {/* Metric 3: Fragile Slope Waste Diverted */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Slope Waste Diverted</span>
              <div className="text-3xl font-black text-white mt-1">
                {calcWasteDivertedTonnes} <span className="text-base font-bold text-cyan-400">Tonnes</span>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              Single-use plastic, tetra-packs, and non-biodegradable waste kept away from sensitive watershed gorges.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Catchment Protection:</span>
            <span className="text-cyan-400 font-bold">100% Zero-Landfill</span>
          </div>
        </div>

        {/* Metric 4: Distributed Local Revenue */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Distributed Rural Revenue</span>
              <div className="text-3xl font-black text-emerald-400 mt-1">
                ₹{calcRuralWealthCr} <span className="text-base font-bold text-white">Cr</span>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              Capital injected straight into indigenous host wallets and village cooperatives through ONDC open rails.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Rural Retention Rate:</span>
            <span className="text-emerald-400 font-bold">96.2% Retained</span>
          </div>
        </div>
      </div>

      {/* Interactive Scaling Simulator */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white">National Impact Scaling Simulator</h3>
            <p className="text-xs text-slate-400">
              Drag the traveler redistribution slider to project systemic climate and economic outcomes at national scale.
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
            {formatNumber(divertedTouristCount)} Travelers Modeled
          </span>
        </div>

        <div>
          <input
            type="range"
            min="20000"
            max="1000000"
            step="10000"
            value={divertedTouristCount}
            onChange={(e) => setDivertedTouristCount(parseInt(e.target.value))}
            className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>20k (Regional Pilot)</span>
            <span>250k (State-wide Expansion)</span>
            <span>500k (Himalayan Corridor)</span>
            <span>1,000,000 (Pan-India MoT Deployment)</span>
          </div>
        </div>

        {/* Projected Milestone Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
          <div className="bg-navy-950/80 p-4 rounded-2xl border border-white/5">
            <span className="text-xs text-slate-400 block">Carbon Diverted at This Scale:</span>
            <span className="text-xl font-bold text-emerald-400">{calcCarbonAvoidedTonnes} Tonnes CO₂e</span>
          </div>
          <div className="bg-navy-950/80 p-4 rounded-2xl border border-white/5">
            <span className="text-xs text-slate-400 block">Hours of Mountain Gridlock Saved:</span>
            <span className="text-xl font-bold text-amber-400">{formatNumber(calcHoursSaved)} Hours</span>
          </div>
          <div className="bg-navy-950/80 p-4 rounded-2xl border border-white/5">
            <span className="text-xs text-slate-400 block">Village Wealth Injected:</span>
            <span className="text-xl font-bold text-emerald-400">₹{calcRuralWealthCr} Crores</span>
          </div>
        </div>
      </div>
    </div>
  );
};
