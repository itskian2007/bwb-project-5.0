'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Sliders, 
  FileText, 
  Download, 
  CheckCircle, 
  RotateCcw,
  Zap,
  Globe2,
  Users
} from 'lucide-react';
import { COMMAND_ALERTS, DESTINATIONS, NATIONAL_SYSTEM_METRICS } from '../data/mockData';
import { CommandAlert } from '../types';
import { formatNumber, formatINR } from '../lib/utils';

export const CommandCenter: React.FC = () => {
  const [alerts, setAlerts] = useState<CommandAlert[]>(COMMAND_ALERTS);
  const [policyToggles, setPolicyToggles] = useState<{
    dynamicPermits: boolean;
    surgeIncentives: boolean;
    greenShuttles: boolean;
    heavyVehicleDivert: boolean;
  }>({
    dynamicPermits: true,
    surgeIncentives: true,
    greenShuttles: true,
    heavyVehicleDivert: false
  });
  const [briefExported, setBriefExported] = useState<boolean>(false);

  // Sorted most congested destinations
  const topCongested = [...DESTINATIONS]
    .filter(d => d.isHotspot)
    .sort((a, b) => b.saturationPct - a.saturationPct);

  const handleExportBrief = () => {
    setBriefExported(true);
    setTimeout(() => setBriefExported(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Command Center Mission Control Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-rose-500/30 bg-gradient-to-r from-navy-950 via-navy-900 to-rose-950/20 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>MINISTRY OF TOURISM &bull; NATIONAL CRISIS INTERVENTION DESK</span>
            </div>
            <h2 className="text-3xl font-black text-white">
              Tourism Command Center (OS Mission Control)
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Real-time administrative command desk providing state tourism boards and district authorities with automated congestion throttling, emergency corridor diversion, and regional macro-economic balances.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportBrief}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-slate-200 border border-white/10 text-xs font-bold transition-all shadow-md"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>{briefExported ? 'Brief Downloaded (PDF)' : 'Export Intelligence Brief'}</span>
            </button>

            <div className="flex items-center space-x-2 bg-rose-500/20 text-rose-300 border border-rose-500/40 px-3 py-2 rounded-xl text-xs font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>THROTTLE ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Most Congested Destinations & Dynamic Policy Switches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Most Congested Destinations Leaderboard (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Most Congested Destinations (Critical Watchlist)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Real-time FASTag &amp; Tower Data</span>
          </div>

          <div className="space-y-3">
            {topCongested.map((dest, i) => (
              <div
                key={dest.id}
                className="p-4 rounded-2xl bg-navy-950/80 border border-white/5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 font-black text-xs flex items-center justify-center font-mono">
                    #{i + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{dest.name}</h4>
                    <span className="text-[11px] text-slate-400">{dest.state} &bull; Capacity: {formatNumber(dest.carryingCapacity)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-right">
                  <div>
                    <span className="text-lg font-black text-rose-400">{dest.saturationPct}%</span>
                    <span className="block text-[10px] text-slate-400">Saturation</span>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-200">{formatNumber(dest.currentVisitors)}</span>
                    <span className="block text-[10px] text-rose-400">+{Math.round((dest.currentVisitors / dest.carryingCapacity) * 100 - 100)}% Surge</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Policy Throttling Controls (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Automated District Intervention Switches
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400">STATE MOTOR VEHICLE ACT</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-navy-950/80 border border-white/5">
              <div>
                <span className="text-xs font-bold text-white block">Dynamic Permit Throttle (Shimla Core)</span>
                <span className="text-[11px] text-slate-400">Limits non-resident commercial vehicles at Shoghi</span>
              </div>
              <input
                type="checkbox"
                checked={policyToggles.dynamicPermits}
                onChange={(e) => setPolicyToggles(p => ({ ...p, dynamicPermits: e.target.checked }))}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-navy-950/80 border border-white/5">
              <div>
                <span className="text-xs font-bold text-white block">Surge DeshCredits Incentive (+500)</span>
                <span className="text-[11px] text-slate-400">Increases gamified reward for choosing Narkanda/Jibhi</span>
              </div>
              <input
                type="checkbox"
                checked={policyToggles.surgeIncentives}
                onChange={(e) => setPolicyToggles(p => ({ ...p, surgeIncentives: e.target.checked }))}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-navy-950/80 border border-white/5">
              <div>
                <span className="text-xs font-bold text-white block">Deploy Electric Shuttles on NH-5</span>
                <span className="text-[11px] text-slate-400">Direct park-and-ride shuttles to reduce mountain jams</span>
              </div>
              <input
                type="checkbox"
                checked={policyToggles.greenShuttles}
                onChange={(e) => setPolicyToggles(p => ({ ...p, greenShuttles: e.target.checked }))}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-navy-950/80 border border-white/5">
              <div>
                <span className="text-xs font-bold text-white block">Divert Heavy Freight (6AM - 10PM)</span>
                <span className="text-[11px] text-slate-400">Channels commercial freight to peripheral ring roads</span>
              </div>
              <input
                type="checkbox"
                checked={policyToggles.heavyVehicleDivert}
                onChange={(e) => setPolicyToggles(p => ({ ...p, heavyVehicleDivert: e.target.checked }))}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center justify-between">
            <span>Overall Diversion Effectiveness:</span>
            <strong className="text-white text-xs">76.4% Demand Rebalanced</strong>
          </div>
        </div>
      </div>

      {/* Emergency Saturation Alerts Stream (Prompt Requirement #9) */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Emergency Saturation Alerts &bull; Systemic Early-Warning Log
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Updated Every 30 Seconds</span>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-2xl bg-navy-950/80 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    alert.level === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : alert.level === 'HIGH'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}>
                    {alert.level}
                  </span>
                  <span className="text-xs font-bold text-white">{alert.destination}</span>
                  <span className="text-slate-500 text-xs font-mono">&bull; {alert.timestamp}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{alert.message}</p>
                <div className="text-[11px] text-emerald-400 font-medium pt-0.5">
                  &bull; Action Executed: {alert.actionTaken}
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-xl font-black text-emerald-400">
                  {alert.diversionRatePct}%
                </div>
                <div className="text-[10px] text-slate-400">Diversion Rate Achieved</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
