'use client';

import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  TrendingDown, 
  ShieldCheck, 
  Users, 
  Zap, 
  Leaf, 
  Activity, 
  Cpu
} from 'lucide-react';
import { NATIONAL_SYSTEM_METRICS } from '../data/mockData';
import { formatNumber } from '../lib/utils';

interface HeroSectionProps {
  onExploreBalancer: () => void;
  onExploreHeatmap: () => void;
  onOpenCommandCenter: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreBalancer,
  onExploreHeatmap,
  onOpenCommandCenter
}) => {
  return (
    <div className="relative overflow-hidden border-b border-white/10 bg-navy-950 py-12 md:py-16">
      {/* Background Glows and Tactical Grids */}
      <div className="absolute inset-0 bg-mesh-glow pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>NATIONAL TOURISM INFRASTRUCTURE OS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300">PREDICTIVE CONGESTION BALANCER</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Most platforms maximize bookings. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              DeshDarshan Redistributes Tourism.
            </span>
          </h1>

          {/* USP Quote Box */}
          <div className="relative max-w-2xl mx-auto p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-lg">
            <p className="text-lg md:text-xl font-medium text-slate-200 italic">
              &ldquo;DeshDarshan does not recommend destinations. <br className="hidden sm:block" />
              <strong className="text-emerald-400 not-italic font-bold">It actively rebalances tourism demand.</strong>&rdquo;
            </p>
            <p className="text-xs text-slate-400 mt-2 font-mono">
              Continuous Digital Twin &bull; 5-Agent Multi-AI Network &bull; ONDC Rural Commerce Integration
            </p>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onExploreBalancer}
              className="flex items-center space-x-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-navy-950 font-bold px-6 py-3.5 rounded-xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-105"
            >
              <Zap className="w-5 h-5 text-navy-950 fill-navy-950" />
              <span>Simulate Peak Surge Rebalancing</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreHeatmap}
              className="flex items-center space-x-2 bg-navy-900/80 hover:bg-navy-800 text-slate-200 border border-white/10 hover:border-emerald-500/50 font-semibold px-6 py-3.5 rounded-xl transition-all"
            >
              <Activity className="w-5 h-5 text-cyan-400" />
              <span>Live National Heatmap</span>
            </button>

            <button
              onClick={onOpenCommandCenter}
              className="flex items-center space-x-2 bg-navy-900/60 hover:bg-rose-950/40 text-rose-300 border border-rose-500/30 font-semibold px-5 py-3.5 rounded-xl transition-all text-xs"
            >
              <Cpu className="w-4 h-4 text-rose-400" />
              <span>Ministry Command Center</span>
            </button>
          </div>
        </div>

        {/* Live National Impact Telemetry Grid */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-xl border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Tourists Rebalanced</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-white">
              {formatNumber(NATIONAL_SYSTEM_METRICS.realtimeTouristsRedirected)}
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center">
              <TrendingDown className="w-3.5 h-3.5 mr-1" />
              -58% Peak Hotspot Stress
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Traffic Hours Saved</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-white">
              {formatNumber(NATIONAL_SYSTEM_METRICS.trafficHoursSavedTotal)} hrs
            </div>
            <div className="text-[11px] text-amber-400 font-medium mt-1">
              Avoided Cart Rd & Atal Tunnel Jams
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>CO₂ Carbon Diverted</span>
              <Leaf className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-white">
              {formatNumber(NATIONAL_SYSTEM_METRICS.co2EmissionsAvoidedTonnes)} Tonnes
            </div>
            <div className="text-[11px] text-cyan-400 font-medium mt-1">
              Fragile Hill Biosphere Protected
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Rural ONDC Economy</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-emerald-400">
              ₹{NATIONAL_SYSTEM_METRICS.ruralWealthGeneratedCrINR} Cr
            </div>
            <div className="text-[11px] text-slate-300 font-medium mt-1">
              Direct to 4,210 Homestay & Artisan Hosts
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
