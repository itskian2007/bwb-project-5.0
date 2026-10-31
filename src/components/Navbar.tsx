'use client';

import React from 'react';
import { 
  Compass, 
  MapPin, 
  Leaf, 
  Coins, 
  ShieldAlert, 
  Bot, 
  ShoppingBag, 
  Mic, 
  BarChart3, 
  Globe2,
  Activity,
  Layers
} from 'lucide-react';
import { UserCreditsProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userCredits: UserCreditsProfile;
  activeCircuit: string;
  setActiveCircuit: (circuit: string) => void;
  onOpenCreditsModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userCredits,
  activeCircuit,
  setActiveCircuit,
  onOpenCreditsModal
}) => {
  const circuits = [
    { id: 'himachal', name: 'Himachal Ridge' },
    { id: 'manali', name: 'Beas Alpine Corridor' },
    { id: 'uttarakhand', name: 'Garhwal Eco-Range' },
    { id: 'nilgiris', name: 'Nilgiri Biosphere' },
    { id: 'goa', name: 'Goan Coastal & Hinterland' },
    { id: 'rajasthan', name: 'Rajputana Heritage' }
  ];

  const navItems = [
    { id: 'balancer', label: 'AI Load Balancer', icon: Compass },
    { id: 'heatmap', label: 'Live Heatmap', icon: MapPin },
    { id: 'digital-twin', label: 'Digital Twin', icon: Layers },
    { id: 'rural-discovery', label: 'Rural Discovery', icon: Globe2 },
    { id: 'ondc', label: 'ONDC Market', icon: ShoppingBag },
    { id: 'voice-onboard', label: 'Voice Host Onboarding', icon: Mic },
    { id: 'credits', label: 'DeshCredits', icon: Coins },
    { id: 'sustainability', label: 'Climate Impact', icon: Leaf },
    { id: 'command', label: 'Command Center', icon: ShieldAlert },
    { id: 'agents', label: 'AI Multi-Agent OS', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-navy-950/90 backdrop-blur-xl">
      {/* Top Telemetry Ticker */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1.5 text-xs border-b border-white/5 bg-navy-900/60 text-slate-300">
        <div className="flex items-center space-x-6">
          <span className="flex items-center text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-2" />
            OPERATIONAL : BHARAT TOURISM DIGITAL TWIN V5.0
          </span>
          <span className="text-slate-400">
            Shimla Saturation: <strong className="text-rose-400">94% (Severe)</strong>
          </span>
          <span className="text-slate-400">
            Narkanda Eco-Hub: <strong className="text-emerald-400">35% (Optimal)</strong>
          </span>
          <span className="text-slate-400">
            Beckn Protocol Node: <strong className="text-cyan-400">ACTIVE (4,210 Sellers)</strong>
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-slate-400">
            CO₂ Avoided Today: <strong className="text-emerald-400">1,420 kg</strong>
          </span>
          <span className="text-slate-400">
            Tourists Rebalanced: <strong className="text-amber-400">142,850+</strong>
          </span>
          <div className="flex items-center space-x-2 text-slate-400 pl-3 border-l border-white/10">
            <span>Circuit:</span>
            <select
              value={activeCircuit}
              onChange={(e) => setActiveCircuit(e.target.value)}
              className="bg-navy-800 text-slate-200 text-xs rounded border border-white/10 px-2 py-0.5 focus:outline-none focus:border-emerald-500"
            >
              {circuits.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('balancer')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Compass className="w-6 h-6 text-navy-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  DESHDARSHAN<span className="text-emerald-400">.AI</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold tracking-wider uppercase">
                  OS v5.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">
                India&apos;s AI Tourism Operating System &bull; Demand Rebalancer
              </p>
            </div>
          </div>

          {/* Navigation Items (Desktop) */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.slice(0, 7).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Widgets */}
          <div className="flex items-center space-x-3">
            {/* Quick Link to Command & Agents */}
            <div className="hidden md:flex items-center space-x-1 bg-navy-900/80 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setActiveTab('sustainability')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  activeTab === 'sustainability' ? 'bg-emerald-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Climate Impact"
              >
                <Leaf className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('command')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  activeTab === 'command' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Govt Command Center"
              >
                <ShieldAlert className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('agents')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  activeTab === 'agents' ? 'bg-cyan-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="5 Autonomous AI Agents"
              >
                <Bot className="w-4 h-4" />
              </button>
            </div>

            {/* Tourism Credits Pill */}
            <button
              onClick={onOpenCreditsModal}
              className="flex items-center space-x-2 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/30 hover:border-amber-400 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-amber-300 transition-all hover:scale-105 shadow-lg shadow-amber-500/10"
            >
              <Coins className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>{userCredits.balance}</span>
              <span className="text-[10px] text-amber-400/80 bg-amber-500/20 px-1.5 py-0.5 rounded">
                Credits
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Sub-menu */}
        <div className="flex xl:hidden overflow-x-auto py-2 space-x-2 border-t border-white/5 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
