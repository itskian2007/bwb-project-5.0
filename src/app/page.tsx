'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { LoadBalancer } from '../components/LoadBalancer';
import { TourismHeatmap } from '../components/TourismHeatmap';
import { DigitalTwin } from '../components/DigitalTwin';
import { TourismCredits } from '../components/TourismCredits';
import { RuralDiscovery } from '../components/RuralDiscovery';
import { ONDCMarketplace } from '../components/ONDCMarketplace';
import { VoiceHostOnboarding } from '../components/VoiceHostOnboarding';
import { SustainabilityDashboard } from '../components/SustainabilityDashboard';
import { CommandCenter } from '../components/CommandCenter';
import { MultiAgentVisualizer } from '../components/MultiAgentVisualizer';
import { INITIAL_USER_CREDITS, DESTINATIONS } from '../data/mockData';
import { Destination, RuralListing, UserCreditsProfile, CreditPerk } from '../types';
import { 
  Compass, 
  MapPin, 
  Coins, 
  Leaf, 
  ShieldAlert, 
  Bot, 
  ShoppingBag, 
  Mic, 
  Layers, 
  Globe2,
  Sparkles,
  Award
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('balancer');
  const [activeCircuit, setActiveCircuit] = useState<string>('himachal');
  const [userCredits, setUserCredits] = useState<UserCreditsProfile>(INITIAL_USER_CREDITS);
  const [selectedHotspotNameForRural, setSelectedHotspotNameForRural] = useState<string>('Shimla');

  // Callback when a user accepts an AI Rebalance proposal
  const handleAcceptRebalance = (source: Destination, alt: Destination) => {
    const bonus = alt.creditBonus || 450;
    setUserCredits(prev => ({
      ...prev,
      balance: prev.balance + bonus,
      totalEarned: prev.totalEarned + bonus,
      co2SavedLifetimeKg: parseFloat((prev.co2SavedLifetimeKg + 28.4).toFixed(1)),
      ruralEconomyContributedINR: prev.ruralEconomyContributedINR + (alt.moneyRedirectedINR || 4500),
      history: [
        {
          id: `tx-${Date.now()}`,
          timestamp: 'Just now',
          destination: `${alt.name} (Bypassed ${source.name})`,
          destinationType: 'Alternative Eco-Hub',
          creditsEarned: bonus,
          co2SavedKg: 28.4,
          economicImpactINR: alt.moneyRedirectedINR || 4500
        },
        ...prev.history
      ]
    }));
  };

  const handleRedeemPerk = (perk: CreditPerk) => {
    setUserCredits(prev => ({
      ...prev,
      balance: prev.balance - perk.costCredits
    }));
  };

  const handleExploreRural = (hotspotName: string) => {
    setSelectedHotspotNameForRural(hotspotName);
    setActiveTab('rural-discovery');
  };

  const handleOpenONDC = (itemTitle: string) => {
    setActiveTab('ondc');
  };

  const handleSelectFromMap = (dest: Destination) => {
    setActiveTab('balancer');
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100">
      {/* Universal Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userCredits={userCredits}
        activeCircuit={activeCircuit}
        setActiveCircuit={setActiveCircuit}
        onOpenCreditsModal={() => setActiveTab('credits')}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Hero Section shown on primary view */}
        {activeTab === 'balancer' && (
          <HeroSection
            onExploreBalancer={() => {
              const el = document.getElementById('balancer-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onExploreHeatmap={() => setActiveTab('heatmap')}
            onOpenCommandCenter={() => setActiveTab('command')}
          />
        )}

        {/* Tab 1: AI Tourism Load Balancer (Primary Demo Engine) */}
        {activeTab === 'balancer' && (
          <div id="balancer-section">
            <LoadBalancer
              onAcceptRebalance={handleAcceptRebalance}
              onExploreRural={handleExploreRural}
              onOpenONDC={handleOpenONDC}
            />
          </div>
        )}

        {/* Tab 2: Live Tourism Heatmap */}
        {activeTab === 'heatmap' && (
          <TourismHeatmap
            onSelectDestinationForRebalance={handleSelectFromMap}
          />
        )}

        {/* Tab 3: Digital Tourism Twin */}
        {activeTab === 'digital-twin' && (
          <DigitalTwin
            onSelectForRebalance={handleSelectFromMap}
          />
        )}

        {/* Tab 4: Rural Discovery Engine (30km Radius) */}
        {activeTab === 'rural-discovery' && (
          <RuralDiscovery
            initialHotspotName={selectedHotspotNameForRural}
            onBookListing={(listing) => {
              setActiveTab('ondc');
            }}
          />
        )}

        {/* Tab 5: ONDC Commerce Marketplace */}
        {activeTab === 'ondc' && (
          <ONDCMarketplace
            onTransactionComplete={() => {
              setUserCredits(prev => ({
                ...prev,
                balance: prev.balance + 150
              }));
            }}
          />
        )}

        {/* Tab 6: Voice-Based Rural Host Onboarding */}
        {activeTab === 'voice-onboard' && (
          <VoiceHostOnboarding
            onHostOnboarded={() => {
              setActiveTab('rural-discovery');
            }}
          />
        )}

        {/* Tab 7: Tourism Credits System */}
        {activeTab === 'credits' && (
          <TourismCredits
            userCredits={userCredits}
            onRedeemPerk={handleRedeemPerk}
          />
        )}

        {/* Tab 8: Climate & Sustainability Dashboard */}
        {activeTab === 'sustainability' && (
          <SustainabilityDashboard />
        )}

        {/* Tab 9: Tourism Command Center (Admin View) */}
        {activeTab === 'command' && (
          <CommandCenter />
        )}

        {/* Tab 10: 5-Agent Multi-AI System OS */}
        {activeTab === 'agents' && (
          <MultiAgentVisualizer />
        )}
      </main>

      {/* National Hackathon Winner Footer */}
      <footer className="border-t border-white/10 bg-navy-950 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center font-black text-navy-950 text-sm">
              DD
            </div>
            <div>
              <div className="text-sm font-extrabold text-white">
                DESHDARSHAN AI &bull; India&apos;s Tourism Operating System
              </div>
              <div className="text-xs text-slate-400">
                &ldquo;DeshDarshan does not recommend destinations. It redistributes tourism.&rdquo;
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
            <span className="flex items-center text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5" />
              Beckn Protocol v2.1
            </span>
            <span>&bull;</span>
            <span>Digital Twin Sensor Mesh</span>
            <span>&bull;</span>
            <span>5-Agent Multi-AI Pipeline</span>
            <span>&bull;</span>
            <span className="text-amber-400 font-semibold">Green Karma Registry</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
