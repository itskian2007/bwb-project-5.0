'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  CheckCircle2, 
  ShieldCheck, 
  Network, 
  ArrowRight, 
  Coins, 
  Lock, 
  Cpu, 
  Award, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Receipt
} from 'lucide-react';
import { RURAL_LISTINGS, MOCK_ONDC_TRANSACTIONS } from '../data/mockData';
import { RuralListing, ONDCTransaction } from '../types';
import { formatINR } from '../lib/utils';
import confetti from 'canvas-confetti';

interface ONDCMarketplaceProps {
  onTransactionComplete?: () => void;
}

export const ONDCMarketplace: React.FC<ONDCMarketplaceProps> = ({ onTransactionComplete }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'rooms' | 'artisans' | 'services'>('all');
  const [selectedItemForCheckout, setSelectedItemForCheckout] = useState<RuralListing | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'inspect' | 'beckn_init' | 'confirmed'>('inspect');
  const [transactions, setTransactions] = useState<ONDCTransaction[]>(MOCK_ONDC_TRANSACTIONS);

  const filterItems = () => {
    if (activeCategory === 'rooms') return RURAL_LISTINGS.filter(i => i.category === 'Homestay');
    if (activeCategory === 'artisans') return RURAL_LISTINGS.filter(i => i.category === 'Artisan Handloom');
    if (activeCategory === 'services') return RURAL_LISTINGS.filter(i => i.category === 'Local Guide' || i.category === 'Organic Farm Feast');
    return RURAL_LISTINGS;
  };

  const handleStartCheckout = (listing: RuralListing) => {
    setSelectedItemForCheckout(listing);
    setCheckoutStep('inspect');
  };

  const handleConfirmBecknProtocolOrder = () => {
    if (!selectedItemForCheckout) return;
    setCheckoutStep('beckn_init');

    setTimeout(() => {
      setCheckoutStep('confirmed');
      const newTxn: ONDCTransaction = {
        transactionId: `TXN-BECKN-HP-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: 'Just now',
        buyerNetworkParticipant: 'DeshDarshan Consumer BAP v2.1',
        sellerNetworkParticipant: selectedItemForCheckout.ondcBppId,
        becknMessageId: `msg_${Math.random().toString(36).substring(2, 10)}`,
        item: selectedItemForCheckout.title,
        category: selectedItemForCheckout.category,
        amountINR: selectedItemForCheckout.priceINR,
        hostPayoutINR: Math.round(selectedItemForCheckout.priceINR * (selectedItemForCheckout.directHostSharePct / 100)),
        protocolFeeINR: Math.round(selectedItemForCheckout.priceINR * ((100 - selectedItemForCheckout.directHostSharePct) / 100)),
        status: 'CONFIRMED',
        settlementHash: `0x${Math.random().toString(16).substring(2, 22)}`
      };

      setTransactions([newTxn, ...transactions]);
      confetti({
        particleCount: 70,
        spread: 60,
        colors: ['#06b6d4', '#10b981', '#f59e0b']
      });
      if (onTransactionComplete) onTransactionComplete();
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ONDC Sovereign Architecture Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-navy-950 via-navy-900 to-cyan-950/20 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
              <Network className="w-3.5 h-3.5 text-cyan-400" />
              <span>OPEN NETWORK FOR DIGITAL COMMERCE &bull; BECKN PROTOCOL ENABLED</span>
            </div>
            <h2 className="text-3xl font-black text-white">
              Direct-to-Artisan Sovereign Marketplace
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              No private platform monopoly commissions. DeshDarshan runs on the open Beckn Protocol, routing 96%+ of every booking rupee straight into rural homestay hosts, weavers, and village cooperatives.
            </p>
          </div>

          {/* Transparent Commission Comparison Pillar */}
          <div className="bg-navy-950/80 p-4 rounded-2xl border border-white/10 text-xs space-y-3 min-w-[280px]">
            <div className="font-bold text-slate-200 border-b border-white/10 pb-1.5 flex items-center justify-between">
              <span>Host Revenue Share</span>
              <span className="text-[10px] text-cyan-400 font-mono">LIVE VERIFICATION</span>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-emerald-400 font-bold">DeshDarshan ONDC:</span>
                <span className="text-emerald-400 font-extrabold">96% Direct to Host</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-emerald-400 h-2 rounded-full w-[96%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-rose-400 font-medium">Traditional OTAs:</span>
                <span className="text-rose-400 font-bold">65% (35% Commission Lost)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-rose-500 h-2 rounded-full w-[65%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation Strip */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex rounded-xl bg-navy-900/80 p-1 border border-white/10 text-xs">
          {[
            { id: 'all', label: 'All ONDC Inventory' },
            { id: 'rooms', label: 'Rural Homestay Rooms' },
            { id: 'artisans', label: 'GI Handloom & Crafts' },
            { id: 'services', label: 'Guides & Dining Feasts' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-4 py-1.5 rounded-lg font-semibold transition-all ${
                activeCategory === tab.id
                  ? 'bg-cyan-500 text-navy-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-mono">
          BPP Node Discovery: <strong className="text-cyan-400">4 Verified Nodes Active</strong>
        </span>
      </div>

      {/* Product & Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filterItems().map((item) => (
          <div
            key={item.id}
            className="glass-panel rounded-3xl border border-white/10 overflow-hidden flex flex-col justify-between hover:border-cyan-500/40 transition-all group"
          >
            <div>
              <div
                className="h-44 w-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${item.imageUrl})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-black/30" />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-navy-950/80 backdrop-blur-md text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                  {item.category}
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-navy-950 text-[10px] font-extrabold">
                  {item.directHostSharePct}% Host Payout
                </span>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400">
                  Host: <strong className="text-slate-200">{item.hostName}</strong> &bull; {item.village}
                </p>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                  {item.description}
                </p>
                <div className="pt-2 text-[10px] font-mono text-cyan-400 truncate">
                  Node: {item.ondcBppId}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-lg font-black text-white">{formatINR(item.priceINR)}</span>
                  <span className="text-[11px] text-slate-400 ml-1">{item.priceUnit}</span>
                </div>

                <button
                  onClick={() => handleStartCheckout(item)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs transition-all flex items-center space-x-1.5 shadow-md shadow-cyan-500/20"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>ONDC Buy</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Beckn Protocol Transaction Feed */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Live Beckn Protocol Transaction Stream &bull; Cryptographic Settlement Log
            </h3>
          </div>
          <span className="text-xs text-emerald-400 font-mono flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-2" />
            BAP/BPP PEER MESH ONLINE
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-900/80 text-slate-400 uppercase font-mono tracking-wider border-b border-white/5">
              <tr>
                <th className="py-2.5 px-3">Transaction ID</th>
                <th className="py-2.5 px-3">Item / Service</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Direct Host Share</th>
                <th className="py-2.5 px-3">Protocol Fee</th>
                <th className="py-2.5 px-3">Settlement Hash</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {transactions.map((tx) => (
                <tr key={tx.transactionId} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-3 text-cyan-300 font-semibold">{tx.transactionId}</td>
                  <td className="py-3 px-3 text-white font-sans">{tx.item}</td>
                  <td className="py-3 px-3 text-slate-200 font-bold font-sans">{formatINR(tx.amountINR)}</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold font-sans">{formatINR(tx.hostPayoutINR)}</td>
                  <td className="py-3 px-3 text-slate-400 font-sans">{formatINR(tx.protocolFeeINR)}</td>
                  <td className="py-3 px-3 text-slate-500 truncate max-w-[120px]">{tx.settlementHash}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-sans font-bold">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Checkout Modal (Beckn Protocol Simulation) */}
      {selectedItemForCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/40 max-w-lg w-full space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Network className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">ONDC Open Beckn Checkout</h3>
              </div>
              <button
                onClick={() => setSelectedItemForCheckout(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            {checkoutStep === 'inspect' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-navy-950 border border-white/5 space-y-2">
                  <div className="text-sm font-bold text-white">{selectedItemForCheckout.title}</div>
                  <div className="text-xs text-slate-400">Host: {selectedItemForCheckout.hostName} ({selectedItemForCheckout.village})</div>
                  <div className="text-xs text-slate-300 font-mono text-[11px] truncate">
                    BPP Node ID: {selectedItemForCheckout.ondcBppId}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Listing Price:</span>
                    <span className="font-bold text-white">{formatINR(selectedItemForCheckout.priceINR)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-emerald-400 font-medium">Direct Host Net Payout (96%):</span>
                    <span className="font-bold text-emerald-400">
                      {formatINR(Math.round(selectedItemForCheckout.priceINR * (selectedItemForCheckout.directHostSharePct / 100)))}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Open Beckn Protocol Fee (4%):</span>
                    <span className="font-bold text-slate-400">
                      {formatINR(Math.round(selectedItemForCheckout.priceINR * ((100 - selectedItemForCheckout.directHostSharePct) / 100)))}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Intermediary Private Commmission:</span>
                    <span className="font-bold text-emerald-400">₹0.00 (Zero Monopolistic Leakage)</span>
                  </div>
                </div>

                <button
                  onClick={handleConfirmBecknProtocolOrder}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-navy-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
                >
                  Initiate Beckn Protocol Settlement &bull; {formatINR(selectedItemForCheckout.priceINR)}
                </button>
              </div>
            )}

            {checkoutStep === 'beckn_init' && (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin mx-auto" />
                <div className="text-sm font-bold text-white">Transmitting Beckn Message...</div>
                <div className="text-xs font-mono text-cyan-300">
                  action: &quot;init&quot; &rarr; gateway.ondc.org &rarr; {selectedItemForCheckout.ondcBppId}
                </div>
              </div>
            )}

            {checkoutStep === 'confirmed' && (
              <div className="text-center space-y-4 py-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">Order Confirmed via ONDC Node!</h4>
                <p className="text-xs text-slate-300">
                  Your reservation is cryptographically registered. 96% funds are settled directly to {selectedItemForCheckout.hostName}&apos;s local village UPI wallet.
                </p>

                <div className="bg-navy-950 p-3 rounded-xl font-mono text-[10px] text-slate-400 text-left space-y-1">
                  <div>Status: BECKN_CONFIRM_SUCCESS</div>
                  <div>Network Hash: 0x{Math.random().toString(16).substring(2, 24)}</div>
                  <div>Recipient: {selectedItemForCheckout.hostName} @ SBI Rural Thanedhar</div>
                </div>

                <button
                  onClick={() => setSelectedItemForCheckout(null)}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 text-navy-950 font-bold text-xs"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
