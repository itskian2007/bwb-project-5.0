'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '../components/Navbar';
import { DigitalTwinPanel } from '../components/DigitalTwinPanel';
import { LoadBalancerPanel } from '../components/LoadBalancerPanel';
import { RuralDiscovery } from '../components/RuralDiscovery';
import { VoiceHostOnboarding } from '../components/VoiceHostOnboarding';
import { DESTINATIONS } from '../data/mockData';
import { Destination } from '../types';

// Dynamically import Leaflet GIS Map with SSR disabled for Next.js
const GisMap = dynamic(() => import('../components/GisMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[520px] bg-[#091124] rounded-lg border border-[#1E2F5B] flex flex-col items-center justify-center text-slate-400 font-mono text-xs">
      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2" />
      <span>INITIALIZING GIS TILES (OPENSTREETMAP / CARTO)...</span>
    </div>
  )
});

export default function Home() {
  const [activeView, setActiveView] = useState<'map-balancer' | 'rural-ondc' | 'voice-onboard'>('map-balancer');
  const [activeCircuit, setActiveCircuit] = useState<string>('himachal');
  const [timeOffsetHours, setTimeOffsetHours] = useState<number>(0);

  // Hotspots and alternatives
  const hotspots = DESTINATIONS.filter(d => d.isHotspot);
  const [selectedHotspot, setSelectedHotspot] = useState<Destination>(hotspots[0] || DESTINATIONS[0]);
  
  // Alternatives for the current hotspot
  const alternatives = DESTINATIONS.filter(d => d.nearestHotspotId === selectedHotspot.id);
  const [selectedAlternative, setSelectedAlternative] = useState<Destination>(
    alternatives[0] || DESTINATIONS[1]
  );

  // Inspected node for the Digital Twin panel (defaults to selected hotspot)
  const [inspectedDestination, setInspectedDestination] = useState<Destination>(selectedHotspot);

  // Automatically update hotspot, inspected node, and alternatives whenever corridor circuit changes
  useEffect(() => {
    const circuitHotspot = hotspots.find(h => {
      if (activeCircuit === 'himachal') return h.id === 'shimla';
      if (activeCircuit === 'manali') return h.id === 'manali';
      if (activeCircuit === 'uttarakhand') return h.id === 'mussoorie' || h.circuit.toLowerCase().includes('garhwal');
      if (activeCircuit === 'nilgiris') return h.id === 'ooty' || h.circuit.toLowerCase().includes('nilgiri');
      if (activeCircuit === 'goa') return h.id === 'north-goa' || h.id === 'goa' || h.circuit.toLowerCase().includes('goa');
      return false;
    }) || hotspots[0];

    if (circuitHotspot) {
      setSelectedHotspot(circuitHotspot);
      setInspectedDestination(circuitHotspot);
      const relatedAlts = DESTINATIONS.filter(d => d.nearestHotspotId === circuitHotspot.id);
      if (relatedAlts.length > 0) {
        setSelectedAlternative(relatedAlts[0]);
      }
    }
  }, [activeCircuit]);

  // Hotspot change handler
  const handleSelectHotspot = (hotspot: Destination) => {
    setSelectedHotspot(hotspot);
    setInspectedDestination(hotspot);
    const relatedAlts = DESTINATIONS.filter(d => d.nearestHotspotId === hotspot.id);
    if (relatedAlts.length > 0) {
      setSelectedAlternative(relatedAlts[0]);
    }
  };

  // Map marker click handler
  const handleSelectDestinationFromMap = (dest: Destination) => {
    setInspectedDestination(dest);
    if (dest.isHotspot) {
      setSelectedHotspot(dest);
      const relatedAlts = DESTINATIONS.filter(d => d.nearestHotspotId === dest.id);
      if (relatedAlts.length > 0) setSelectedAlternative(relatedAlts[0]);
    } else {
      setSelectedAlternative(dest);
      if (dest.nearestHotspotId) {
        const parent = hotspots.find(h => h.id === dest.nearestHotspotId);
        if (parent) setSelectedHotspot(parent);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080E21] text-slate-100">
      {/* Universal Top Operational Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        activeCircuit={activeCircuit}
        setActiveCircuit={setActiveCircuit}
      />

      {/* Main Viewport */}
      <main className="flex-1 p-3 lg:p-4 max-w-[1920px] w-full mx-auto">
        {/* Core Operational Layout (60% Map | 20% Digital Twin Insights | 20% Load Balancer & Actions) */}
        {activeView === 'map-balancer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-[calc(100vh-100px)] min-h-[680px]">
            {/* Main Center Area: 60% Map Interface (7.5 of 12 cols in lg grid) */}
            <div className="lg:col-span-7 xl:col-span-8 h-full flex flex-col space-y-2">
              <div className="flex-1 h-full min-h-[480px]">
                <GisMap
                  destinations={DESTINATIONS}
                  selectedDestination={inspectedDestination}
                  onSelectDestination={handleSelectDestinationFromMap}
                  alternativeDestination={selectedAlternative}
                  circuit={activeCircuit}
                  timeOffsetHours={timeOffsetHours}
                />
              </div>

              {/* Bottom Time Scrubber Strip */}
              <div className="gis-panel px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    3. Live Heatmap &amp; Forecast:
                  </span>
                  <div className="flex items-center space-x-1 font-mono text-[11px]">
                    {[
                      { offset: 0, label: 'Live (Now)' },
                      { offset: 1, label: '+1 Hour' },
                      { offset: 2, label: '+2 Hours' },
                      { offset: 3, label: '+3 Hours' },
                    ].map(t => (
                      <button
                        key={t.offset}
                        onClick={() => setTimeOffsetHours(t.offset)}
                        className={`px-2.5 py-1 rounded text-xs transition-all ${
                          timeOffsetHours === t.offset
                            ? 'bg-[#15803D] text-white font-bold'
                            : 'bg-[#0A142D] text-slate-400 border border-[#1E2F5B] hover:text-white'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                  Click any marker on the map to inspect carrying capacity &amp; infrastructure telemetry.
                </div>
              </div>
            </div>

            {/* Middle Panel: 20% Digital Tourism Twin Insights (2.5 of 12 cols) */}
            <div className="lg:col-span-5 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3 h-full">
              <div className="h-full">
                <DigitalTwinPanel
                  destination={inspectedDestination}
                  timeOffsetHours={timeOffsetHours}
                  setTimeOffsetHours={setTimeOffsetHours}
                  onSetAsHotspotToBalance={handleSelectHotspot}
                />
              </div>

              {/* Right Panel: 20% Tourism Load Balancer & Recommendations */}
              <div className="h-full">
                <LoadBalancerPanel
                  hotspots={hotspots}
                  selectedHotspot={selectedHotspot}
                  onSelectHotspot={handleSelectHotspot}
                  alternatives={alternatives.length > 0 ? alternatives : [DESTINATIONS[1]]}
                  selectedAlternative={selectedAlternative}
                  onSelectAlternative={setSelectedAlternative}
                  onOpenRuralDiscovery={() => setActiveView('rural-ondc')}
                />
              </div>
            </div>
          </div>
        )}

        {/* View 2: 4. Rural Discovery & 5. ONDC Marketplace */}
        {activeView === 'rural-ondc' && (
          <RuralDiscovery
            initialHotspotName={selectedHotspot.name}
            onBookListing={() => {}}
          />
        )}

        {/* View 3: 6. Voice Host Onboarding */}
        {activeView === 'voice-onboard' && (
          <VoiceHostOnboarding
            onHostOnboarded={() => {
              setActiveView('rural-ondc');
            }}
          />
        )}
      </main>
    </div>
  );
}
