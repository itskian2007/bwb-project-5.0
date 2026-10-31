'use client';

import React from 'react';
import { 
  Map, 
  Layers, 
  ShoppingBag, 
  Mic, 
  Radio, 
  Compass,
  Building2,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  activeView: 'map-balancer' | 'rural-ondc' | 'voice-onboard';
  setActiveView: (view: 'map-balancer' | 'rural-ondc' | 'voice-onboard') => void;
  activeCircuit: string;
  setActiveCircuit: (circuit: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  activeCircuit,
  setActiveCircuit
}) => {
  const circuits = [
    { id: 'himachal', name: 'Himachal Ridge (Shimla - Narkanda)' },
    { id: 'manali', name: 'Beas Alpine Corridor (Manali - Tirthan)' },
    { id: 'uttarakhand', name: 'Garhwal Eco-Range (Rishikesh - Almora)' },
    { id: 'nilgiris', name: 'Nilgiri Biosphere (Ooty - Kotagiri)' },
    { id: 'goa', name: 'Goa Coastal & Hinterland' }
  ];

  return (
    <header className="w-full bg-[#0d1527] border-b border-[#223354] text-slate-200">
      {/* Top National Telemetry Strip */}
      <div className="hidden sm:flex items-center justify-between px-4 py-1.5 bg-[#0a1020] border-b border-[#1c2b47] text-[11px] font-mono text-slate-400">
        <div className="flex items-center space-x-4">
          <span className="flex items-center text-emerald-400 font-semibold">
            <Radio className="w-3 h-3 mr-1 text-emerald-400" />
            LIVE TELEMETRY &bull; NIC FASTAG &amp; MUNICIPAL GRID
          </span>
          <span className="text-slate-500">|</span>
          <span>Shimla Inflow: <strong className="text-red-400">41,200/day (Overloaded 94%)</strong></span>
          <span className="text-slate-500">|</span>
          <span>Narkanda Eco-Capacity: <strong className="text-emerald-400">1,420/day (Available 35%)</strong></span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-slate-400">National Hackathon Engineering Prototype</span>
          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">
            RELEASE 5.1
          </span>
        </div>
      </div>

      {/* Main Operational Navigation Bar */}
      <div className="px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Project Branding */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-[#15803d] border border-emerald-600 flex items-center justify-center font-black text-white text-base shadow-sm">
            DD
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold tracking-tight text-white uppercase">
                DeshDarshan
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#131f37] border border-[#223354] text-slate-300">
                Tourism OS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5">
              Predictive Carrying Capacity &amp; Demand Redistribution Platform
            </p>
          </div>
        </div>

        {/* Center: Primary Operational Mode Switcher */}
        <div className="flex items-center bg-[#0f182c] p-1 rounded border border-[#223354] self-start md:self-auto">
          <button
            onClick={() => setActiveView('map-balancer')}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeView === 'map-balancer'
                ? 'bg-[#15803d] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>GIS Map &amp; Load Balancer</span>
          </button>

          <button
            onClick={() => setActiveView('rural-ondc')}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeView === 'rural-ondc'
                ? 'bg-[#15803d] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Rural Discovery &amp; ONDC (2/Region)</span>
          </button>

          <button
            onClick={() => setActiveView('voice-onboard')}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeView === 'voice-onboard'
                ? 'bg-[#15803d] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Host Onboarding</span>
          </button>
        </div>

        {/* Right: Regional Corridor Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-slate-400 font-mono hidden lg:inline">Active Corridor:</span>
          <select
            value={activeCircuit}
            onChange={(e) => setActiveCircuit(e.target.value)}
            className="bg-[#0f182c] text-slate-200 text-xs rounded border border-[#223354] px-2.5 py-1.5 font-medium focus:outline-none focus:border-emerald-600"
          >
            {circuits.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};
