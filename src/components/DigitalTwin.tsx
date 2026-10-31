'use client';

import React, { useState } from 'react';
import { 
  Layers, 
  Droplets, 
  Trash2, 
  TrendingUp, 
  AlertTriangle, 
  Coins, 
  Gauge, 
  BarChart3, 
  Search, 
  ArrowUpDown,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { DESTINATIONS } from '../data/mockData';
import { Destination } from '../types';
import { formatINR, formatNumber } from '../lib/utils';

interface DigitalTwinProps {
  onSelectForRebalance: (destination: Destination) => void;
}

export const DigitalTwin: React.FC<DigitalTwinProps> = ({ onSelectForRebalance }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'hotspots' | 'eco-hubs'>('all');
  const [sortField, setSortField] = useState<'saturation' | 'visitors' | 'waste' | 'water'>('saturation');

  const filtered = DESTINATIONS.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          dest.state.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType === 'hotspots') return dest.isHotspot;
    if (filterType === 'eco-hubs') return !dest.isHotspot;
    return true;
  }).sort((a, b) => {
    if (sortField === 'saturation') return b.saturationPct - a.saturationPct;
    if (sortField === 'visitors') return b.currentVisitors - a.currentVisitors;
    if (sortField === 'waste') return b.wasteGenerationTons - a.wasteGenerationTons;
    if (sortField === 'water') return b.waterDemandMLD - a.waterDemandMLD;
    return 0;
  });

  // Calculate totals
  const totalCurrentVisitors = DESTINATIONS.reduce((sum, d) => sum + d.currentVisitors, 0);
  const totalCapacity = DESTINATIONS.reduce((sum, d) => sum + d.carryingCapacity, 0);
  const totalWaterDemand = DESTINATIONS.reduce((sum, d) => sum + d.waterDemandMLD, 0).toFixed(1);
  const totalWaste = DESTINATIONS.reduce((sum, d) => sum + d.wasteGenerationTons, 0).toFixed(1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Overview */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">
                National Digital Tourism Twin &bull; Carrying Capacity Telemetry
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Mathematical simulation model calculating dynamic physical, psychological, ecological, and infrastructural carrying capacities across Indian tourism ecosystems.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              SYNCHRONIZED WITH MUNICIPAL SENSORS
            </span>
          </div>
        </div>

        {/* Aggregate KPI Strip */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-navy-950/80 p-4 rounded-2xl border border-white/5">
            <div className="text-slate-400 text-xs">Total Tracked Inflow</div>
            <div className="text-2xl font-black text-white mt-1">
              {formatNumber(totalCurrentVisitors)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Across 15 key hill &amp; heritage nodes
            </div>
          </div>

          <div className="bg-navy-950/80 p-4 rounded-2xl border border-white/5">
            <div className="text-slate-400 text-xs">Aggregate Capacity Ceiling</div>
            <div className="text-2xl font-black text-slate-200 mt-1">
              {formatNumber(totalCapacity)}
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">
              Threshold for ecological safety
            </div>
          </div>

          <div className="bg-navy-950/80 p-4 rounded-2xl border border-white/5">
            <div className="text-slate-400 text-xs">Municipal Water Draw</div>
            <div className="text-2xl font-black text-cyan-400 mt-1">
              {totalWaterDemand} MLD
            </div>
            <div className="text-[10px] text-cyan-300/80 mt-0.5">
              Million Litres Per Day
            </div>
          </div>

          <div className="bg-navy-950/80 p-4 rounded-2xl border border-white/5">
            <div className="text-slate-400 text-xs">Municipal Solid Waste</div>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {totalWaste} T/day
            </div>
            <div className="text-[10px] text-amber-300/80 mt-0.5">
              Tonnes Generated Daily
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search destination, state, circuit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-navy-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex rounded-xl bg-navy-900/80 p-1 border border-white/10 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg transition-all ${filterType === 'all' ? 'bg-cyan-500 text-navy-950 font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              All Hubs
            </button>
            <button
              onClick={() => setFilterType('hotspots')}
              className={`px-3 py-1 rounded-lg transition-all ${filterType === 'hotspots' ? 'bg-rose-500 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              Hotspots Only
            </button>
            <button
              onClick={() => setFilterType('eco-hubs')}
              className={`px-3 py-1 rounded-lg transition-all ${filterType === 'eco-hubs' ? 'bg-emerald-500 text-navy-950 font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              Eco Alternatives
            </button>
          </div>

          <div className="flex items-center space-x-1 text-xs text-slate-400">
            <span>Sort by:</span>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="bg-navy-900 text-slate-200 text-xs rounded-lg border border-white/10 px-2 py-1 focus:outline-none focus:border-cyan-400"
            >
              <option value="saturation">Saturation %</option>
              <option value="visitors">Current Visitors</option>
              <option value="water">Water Demand</option>
              <option value="waste">Solid Waste</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Interactive Table of Destinations */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-900/90 text-slate-400 uppercase font-mono tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">Destination</th>
                <th className="py-3.5 px-4">Saturation</th>
                <th className="py-3.5 px-4">Current / Capacity</th>
                <th className="py-3.5 px-4">Predicted 3h</th>
                <th className="py-3.5 px-4">Water Demand</th>
                <th className="py-3.5 px-4">Waste Gen</th>
                <th className="py-3.5 px-4">Local Revenue</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((dest) => {
                const isOver = dest.saturationPct >= 75;
                const isModerate = dest.saturationPct >= 45 && dest.saturationPct < 75;
                const pctOfCapacity = Math.round((dest.currentVisitors / dest.carryingCapacity) * 100);

                return (
                  <tr key={dest.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Destination name and circuit */}
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-xl bg-cover bg-center border border-white/10 flex-shrink-0"
                          style={{ backgroundImage: `url(${dest.imageUrl})` }}
                        />
                        <div>
                          <div className="font-bold text-white text-sm flex items-center space-x-2">
                            <span>{dest.name}</span>
                            {dest.isHotspot ? (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                HOTSPOT
                              </span>
                            ) : (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                ECO-HUB
                              </span>
                            )}
                          </div>
                          <span className="text-slate-400 text-[11px]">{dest.state} &bull; {dest.circuit}</span>
                        </div>
                      </div>
                    </td>

                    {/* Saturation Gauge */}
                    <td className="py-4 px-4">
                      <div className="space-y-1 w-28">
                        <div className="flex items-center justify-between font-bold">
                          <span className={isOver ? 'text-rose-400' : isModerate ? 'text-amber-400' : 'text-emerald-400'}>
                            {dest.saturationPct}%
                          </span>
                          <span className="text-[10px] text-slate-400">{dest.trafficStatus}</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              isOver ? 'bg-rose-500' : isModerate ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, dest.saturationPct)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Current vs Capacity */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-200">
                        {formatNumber(dest.currentVisitors)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Cap: {formatNumber(dest.carryingCapacity)} ({pctOfCapacity}%)
                      </div>
                    </td>

                    {/* Predicted 3h */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-white">
                        {formatNumber(dest.predictedVisitors3h)}
                      </div>
                      <div className="text-[10px] text-rose-400 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-0.5" />
                        +{Math.round(((dest.predictedVisitors3h - dest.currentVisitors) / dest.currentVisitors) * 100)}% Surge
                      </div>
                    </td>

                    {/* Water Demand */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-200 flex items-center">
                        <Droplets className="w-3.5 h-3.5 text-cyan-400 mr-1" />
                        {dest.waterDemandMLD} MLD
                      </div>
                      <div className={`text-[10px] ${dest.waterDemandMLD > 2.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {dest.waterDemandMLD > 2.0 ? 'Exceeds aquifer yield' : 'Within normal limits'}
                      </div>
                    </td>

                    {/* Waste Generation */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-200 flex items-center">
                        <Trash2 className="w-3.5 h-3.5 text-amber-400 mr-1" />
                        {dest.wasteGenerationTons} T/day
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {dest.wasteGenerationTons > 15 ? 'Critical hill risk' : 'Zero landfill protocol'}
                      </div>
                    </td>

                    {/* Local Revenue */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-emerald-400">
                        {formatINR(dest.avgDailySpendINR * 12)}k/day
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {dest.isHotspot ? '65% OTA leakage' : '96% Local retention'}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => onSelectForRebalance(dest)}
                        className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-emerald-500 hover:text-navy-950 text-slate-300 font-bold text-xs transition-all border border-white/10"
                      >
                        {dest.isHotspot ? 'Rebalance' : 'Select'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
