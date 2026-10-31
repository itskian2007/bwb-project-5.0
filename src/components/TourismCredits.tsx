'use client';

import React, { useState } from 'react';
import { 
  Coins, 
  Sparkles, 
  Award, 
  Gift, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  QrCode, 
  Leaf, 
  Percent, 
  Calendar, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { UserCreditsProfile, CreditPerk } from '../types';
import { formatINR } from '../lib/utils';
import confetti from 'canvas-confetti';

interface TourismCreditsProps {
  userCredits: UserCreditsProfile;
  onRedeemPerk: (perk: CreditPerk) => void;
}

export const TourismCredits: React.FC<TourismCreditsProps> = ({
  userCredits,
  onRedeemPerk
}) => {
  // Credit Earning Simulation State
  const [simHotspot, setSimHotspot] = useState<string>('shimla');
  const [simPartySize, setSimPartySize] = useState<number>(2);
  const [simDays, setSimDays] = useState<number>(3);
  const [redeemedPerk, setRedeemedPerk] = useState<CreditPerk | null>(null);

  // Simulation calculations
  const calculateSimEarned = () => {
    const basePerPerson = 225;
    return basePerPerson * simPartySize * simDays;
  };

  const calculateSimCO2 = () => {
    return (14.2 * simPartySize * simDays).toFixed(1);
  };

  const calculateSimEconomy = () => {
    return 1500 * simPartySize * simDays;
  };

  const handleRedeem = (perk: CreditPerk) => {
    if (userCredits.balance < perk.costCredits) {
      alert(`Insufficient balance! You need ${perk.costCredits - userCredits.balance} more DeshCredits.`);
      return;
    }
    setRedeemedPerk(perk);
    confetti({
      particleCount: 60,
      spread: 60,
      colors: ['#f59e0b', '#10b981', '#06b6d4']
    });
    onRedeemPerk(perk);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Wallet Header & Gamification Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-amber-950/20">
        <div className="absolute top-0 right-0 transform translate-x-10 -translate-y-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>TIER: {userCredits.tier.toUpperCase()}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              Green Karma &bull; DeshCredits Wallet
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              India&apos;s first sovereign gamified tourism incentive network. Travelers receive verifiable digital credits whenever they reroute away from saturated bottlenecks into indigenous rural communities.
            </p>
          </div>

          {/* Balance Display */}
          <div className="flex items-center space-x-6 bg-navy-950/80 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
            <div>
              <div className="text-xs text-slate-400 font-medium">Available Balance</div>
              <div className="text-4xl font-black text-amber-400 flex items-center space-x-2 mt-0.5">
                <Coins className="w-8 h-8 text-amber-400 animate-spin-slow" />
                <span>{userCredits.balance}</span>
              </div>
              <div className="text-[11px] text-emerald-400 font-medium mt-1">
                Lifetime: {userCredits.totalEarned} Credits
              </div>
            </div>

            <div className="pl-6 border-l border-white/10 space-y-1 text-xs">
              <div>
                <span className="text-slate-400">CO₂ Diverted:</span>
                <span className="font-bold text-emerald-400 ml-1.5">{userCredits.co2SavedLifetimeKg} kg</span>
              </div>
              <div>
                <span className="text-slate-400">Rural Wealth:</span>
                <span className="font-bold text-cyan-400 ml-1.5">{formatINR(userCredits.ruralEconomyContributedINR)}</span>
              </div>
              <div className="pt-1">
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-semibold">
                  Zero OTA Waste
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Earning Simulator (Prompt Specification #4) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">
                Live Credit Earning Simulation Engine
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate avoiding peak tourist congestion to calculate your real-time DeshCredit earnings and ecological footprint reduction.
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
            SIMULATION ALGORITHM V2.4
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-5 bg-navy-950/60 p-5 rounded-2xl border border-white/5">
            {/* Target Avoided Hotspot */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Target Hotspot Saturated Destination to Avoid:
              </label>
              <select
                value={simHotspot}
                onChange={(e) => setSimHotspot(e.target.value)}
                className="w-full bg-navy-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="shimla">Shimla (Ridge & Mall Rd - 94% Saturated) &rarr; Narkanda Apple Valley</option>
                <option value="manali">Manali & Solang (96% Saturated) &rarr; Tirthan Valley River Sanctuary</option>
                <option value="mussoorie">Mussoorie (92% Saturated) &rarr; Kanatal Pine Glacier View</option>
                <option value="ooty">Ooty (91% Saturated) &rarr; Kotagiri Nilgiri Biosphere</option>
                <option value="goa">Baga & Calangute (97% Saturated) &rarr; Divar Island Backwaters</option>
                <option value="jaipur">Jaipur Core (89% Saturated) &rarr; Bundi Stepwell Town</option>
              </select>
            </div>

            {/* Travelers & Duration Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Number of Travelers:</span>
                  <span className="font-bold text-amber-400">{simPartySize} people</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={simPartySize}
                  onChange={(e) => setSimPartySize(parseInt(e.target.value))}
                  className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Trip Duration:</span>
                  <span className="font-bold text-amber-400">{simDays} days</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="14"
                  value={simDays}
                  onChange={(e) => setSimDays(parseInt(e.target.value))}
                  className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-400 bg-white/[0.02] p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
              <span>Automatic ONDC Rural Discovery Trigger:</span>
              <span className="text-emerald-400 font-semibold">Enabled (30km Radius)</span>
            </div>
          </div>

          {/* Live Simulated Returns Card (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-amber-500/15 via-emerald-500/10 to-navy-950 p-6 rounded-2xl border border-amber-500/30 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                SIMULATED REWARD ESTIMATION
              </span>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-4xl font-black text-amber-400">+{calculateSimEarned()}</span>
                <span className="text-sm font-bold text-slate-200">DeshCredits</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Credited directly to your green sovereign wallet upon GPS check-in at the eco-hub.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Carbon Idling Avoided:</span>
                <span className="font-bold text-emerald-400">{calculateSimCO2()} kg CO₂e</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Direct Rural Injection:</span>
                <span className="font-bold text-emerald-400">{formatINR(calculateSimEconomy())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bottleneck Wait Time Saved:</span>
                <span className="font-bold text-cyan-400">{(2.3 * simDays).toFixed(1)} Hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Perk Unlock & Redemption Catalog (Prompt Feature 4) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Gift className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">
                Unlockable Perks &amp; Sovereign Privileges
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Redeem earned credits for discounts, artisan purchases, and priority access passes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {userCredits.unlockedPerks.map((perk) => {
            const canAfford = userCredits.balance >= perk.costCredits;
            return (
              <div
                key={perk.id}
                className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-emerald-500/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                      {perk.badge}
                    </span>
                    <span className="text-xs font-black text-amber-400 flex items-center">
                      <Coins className="w-3.5 h-3.5 mr-1" />
                      {perk.costCredits} Credits
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {perk.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {perk.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Value Benefit</span>
                    <span className="text-sm font-extrabold text-emerald-400">{perk.discountValue}</span>
                  </div>

                  <button
                    onClick={() => handleRedeem(perk)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      canAfford
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-navy-950 shadow-md shadow-emerald-500/20'
                        : 'bg-navy-900 text-slate-400 border border-white/5 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Redeem Perk' : 'Need More Credits'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal / Generated Eco-Pass Preview if user just redeemed */}
      {redeemedPerk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/40 max-w-md w-full space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white">Voucher Generated Successfully!</h3>
            <p className="text-xs text-slate-300">
              Your perk <strong className="text-emerald-400">{redeemedPerk.title}</strong> has been issued onto the ONDC network node.
            </p>

            <div className="bg-navy-950 p-4 rounded-2xl border border-white/10 flex flex-col items-center space-y-2">
              <QrCode className="w-28 h-28 text-white p-2 bg-white rounded-xl" />
              <span className="text-[10px] font-mono text-cyan-300">
                ONDC-TOKEN: #DESH-{Math.random().toString(36).substring(2, 9).toUpperCase()}
              </span>
              <span className="text-[11px] text-slate-400">Scan at local host check-in or checkout</span>
            </div>

            <button
              onClick={() => setRedeemedPerk(null)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-navy-950 font-bold text-xs"
            >
              Done &bull; Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
