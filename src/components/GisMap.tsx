'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Destination } from '../types';
import { formatNumber } from '../lib/utils';
import { Layers, ZoomIn, ZoomOut, Filter, MapPin, Radio, Compass } from 'lucide-react';

interface GisMapProps {
  destinations: Destination[];
  selectedDestination: Destination;
  onSelectDestination: (dest: Destination) => void;
  alternativeDestination?: Destination;
  circuit: string;
  timeOffsetHours: number;
}

export default function GisMap({
  destinations,
  selectedDestination,
  onSelectDestination,
  alternativeDestination,
  circuit,
  timeOffsetHours
}: GisMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersRef = useRef<any>({ markers: [], circles: [], route: null });
  const [filterMode, setFilterMode] = useState<'all' | 'red' | 'yellow' | 'green'>('all');
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  // Determine center based on circuit
  const getCircuitCenter = (c: string): [number, number, number] => {
    switch (c) {
      case 'himachal':
      case 'manali':
        return [31.55, 77.25, 9];
      case 'uttarakhand':
        return [30.15, 78.50, 9];
      case 'south':
      case 'nilgiris':
        return [11.41, 76.80, 10];
      case 'west':
      case 'goa':
        return [15.55, 73.80, 10];
      default:
        return [31.55, 77.25, 9]; // default Himachal pilot
    }
  };

  // Dynamic saturation with time offset
  const getAdjustedSaturation = (d: Destination) => {
    if (timeOffsetHours === 0) return d.saturationPct;
    if (d.isHotspot) {
      return Math.min(99, Math.round(d.saturationPct + (timeOffsetHours * 2.2)));
    }
    return Math.min(85, Math.round(d.saturationPct + (timeOffsetHours * 3.5)));
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isMounted = true;

    async function initMap() {
      try {
        const L = (await import('leaflet')).default;

        if (!mapContainerRef.current || mapInstanceRef.current) return;

        const [centerLat, centerLng, zoom] = getCircuitCenter(circuit);

        const map = L.map(mapContainerRef.current, {
          center: [centerLat, centerLng],
          zoom: zoom,
          zoomControl: false,
          attributionControl: false
        });

        // OpenStreetMap free tile service (100% free, no API key required)
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        L.control.attribution({ position: 'bottomright', prefix: 'OpenStreetMap / Survey GIS' }).addTo(map);

        mapInstanceRef.current = map;
        if (isMounted) setIsLeafletReady(true);
      } catch (err) {
        console.warn('Leaflet map initialization fallback to vector view:', err);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Circuit View
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const [centerLat, centerLng, zoom] = getCircuitCenter(circuit);
    mapInstanceRef.current.flyTo([centerLat, centerLng], zoom, { duration: 1.0 });
  }, [circuit]);

  // Render Overlays, Markers, Zones & Flow Vector
  useEffect(() => {
    if (!mapInstanceRef.current || typeof window === 'undefined') return;

    async function updateLayers() {
      const L = (await import('leaflet')).default;
      const map = mapInstanceRef.current;

      // Clear existing layers
      layersRef.current.markers.forEach((m: any) => map.removeLayer(m));
      layersRef.current.circles.forEach((c: any) => map.removeLayer(c));
      if (layersRef.current.route) {
        map.removeLayer(layersRef.current.route);
        layersRef.current.route = null;
      }
      layersRef.current.markers = [];
      layersRef.current.circles = [];

      // Filter destinations
      const filtered = destinations.filter(d => {
        const sat = getAdjustedSaturation(d);
        if (filterMode === 'red') return sat >= 75;
        if (filterMode === 'yellow') return sat >= 45 && sat < 75;
        if (filterMode === 'green') return sat < 45;
        return true;
      });

      // 1. Draw Zones (Circles)
      filtered.forEach(dest => {
        const sat = getAdjustedSaturation(dest);
        const isRed = sat >= 75;
        const isYellow = sat >= 45 && sat < 75;

        const zoneColor = isRed ? '#dc2626' : isYellow ? '#d97706' : '#15803d';
        const radiusMeters = isRed ? 7000 : isYellow ? 5500 : 4500;

        const circle = L.circle([dest.coordinates.lat, dest.coordinates.lng], {
          radius: radiusMeters,
          color: zoneColor,
          weight: 1.5,
          fillColor: zoneColor,
          fillOpacity: 0.22,
          dashArray: isRed ? '4, 4' : undefined
        }).addTo(map);

        layersRef.current.circles.push(circle);
      });

      // 2. Draw Diversion Flow Line between selected Hotspot and Alternative
      if (selectedDestination && alternativeDestination) {
        const fromCoord: [number, number] = [selectedDestination.coordinates.lat, selectedDestination.coordinates.lng];
        const toCoord: [number, number] = [alternativeDestination.coordinates.lat, alternativeDestination.coordinates.lng];

        const routeLine = L.polyline([fromCoord, toCoord], {
          color: '#22c55e',
          weight: 3.5,
          dashArray: '8, 8',
          opacity: 0.9
        }).addTo(map);

        layersRef.current.route = routeLine;
      }

      // 3. Draw Markers with Data Badges
      filtered.forEach(dest => {
        const sat = getAdjustedSaturation(dest);
        const isRed = sat >= 75;
        const isYellow = sat >= 45 && sat < 75;
        const isSelected = selectedDestination?.id === dest.id;
        const isAlt = alternativeDestination?.id === dest.id;

        const badgeBg = isRed ? '#dc2626' : isYellow ? '#d97706' : '#15803d';
        const borderColor = isSelected ? '#38bdf8' : isAlt ? '#22c55e' : '#1E2F5B';
        const borderWidth = isSelected || isAlt ? '2px' : '1px';

        const customIcon = L.divIcon({
          className: 'custom-gis-marker',
          html: `
            <div style="
              display: flex;
              flex-direction: column;
              align-items: center;
              cursor: pointer;
              transform: translate(-50%, -100%);
            ">
              <div style="
                background: #0E1A38;
                border: ${borderWidth} solid ${borderColor};
                border-radius: 4px;
                padding: 3px 6px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                gap: 5px;
                font-size: 11px;
                font-weight: 700;
                color: #FFFFFF;
                white-space: nowrap;
              ">
                <span style="
                  width: 7px;
                  height: 7px;
                  border-radius: 50%;
                  background: ${badgeBg};
                  display: inline-block;
                "></span>
                <span>${dest.name}</span>
                <span style="
                  color: ${badgeBg};
                  font-family: monospace;
                  font-size: 10px;
                  background: rgba(255,255,255,0.06);
                  padding: 1px 3px;
                  border-radius: 2px;
                ">${sat}%</span>
              </div>
              <div style="
                width: 0;
                height: 0;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-top: 6px solid #0E1A38;
              "></div>
            </div>
          `,
          iconSize: [0, 0]
        });

        const marker = L.marker([dest.coordinates.lat, dest.coordinates.lng], { icon: customIcon })
          .addTo(map)
          .on('click', () => {
            onSelectDestination(dest);
          });

        // Popup with solid, practical indicators
        const popupHtml = `
          <div style="padding: 4px 2px; font-size: 11px; line-height: 1.4;">
            <div style="font-weight: bold; font-size: 12px; color: #FFFFFF; margin-bottom: 2px;">
              ${dest.name} (${dest.state})
            </div>
            <div style="color: #94A3B8; margin-bottom: 6px;">${dest.circuit}</div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-bottom: 6px;">
              <div style="background: #0A142D; padding: 4px; border-radius: 3px; border: 1px solid #1E2F5B;">
                <span style="color: #94A3B8; font-size: 9px; display: block;">Saturation:</span>
                <strong style="color: ${badgeBg}; font-size: 12px;">${sat}%</strong>
              </div>
              <div style="background: #0A142D; padding: 4px; border-radius: 3px; border: 1px solid #1E2F5B;">
                <span style="color: #94A3B8; font-size: 9px; display: block;">Daily Visitors:</span>
                <strong style="color: #F1F5F9; font-size: 11px;">${formatNumber(dest.currentVisitors)}</strong>
              </div>
            </div>

            <div style="color: #CBD5E1; font-size: 10px; margin-bottom: 4px;">
              <strong>Cap. Ceiling:</strong> ${formatNumber(dest.carryingCapacity)} / day
            </div>
            <div style="color: #CBD5E1; font-size: 10px;">
              <strong>Traffic Delay:</strong> ${dest.expectedWaitHours} hrs (${dest.trafficStatus})
            </div>
          </div>
        `;

        marker.bindPopup(popupHtml);
        layersRef.current.markers.push(marker);
      });
    }

    updateLayers();
  }, [destinations, selectedDestination, alternativeDestination, filterMode, timeOffsetHours, isLeafletReady]);

  return (
    <div className="relative w-full h-full min-h-[520px] bg-[#091124] rounded-lg overflow-hidden border border-[#1E2F5B] flex flex-col">
      {/* Map Top Operational Bar */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2">
        {/* Zone Filter Buttons */}
        <div className="bg-[#0E1A38] border border-[#1E2F5B] rounded p-1 flex items-center space-x-1 shadow-md">
          <span className="text-[10px] text-slate-400 font-mono uppercase px-1.5 flex items-center">
            <Filter className="w-3 h-3 mr-1" /> Zones:
          </span>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
              filterMode === 'all' ? 'bg-[#1E2F5B] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterMode('red')}
            className={`px-2 py-0.5 text-[10px] font-semibold rounded flex items-center space-x-1 ${
              filterMode === 'red' ? 'bg-red-900/60 text-red-200 border border-red-700' : 'text-red-400 hover:text-red-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
            <span>Overloaded</span>
          </button>
          <button
            onClick={() => setFilterMode('yellow')}
            className={`px-2 py-0.5 text-[10px] font-semibold rounded flex items-center space-x-1 ${
              filterMode === 'yellow' ? 'bg-amber-900/60 text-amber-200 border border-amber-700' : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
            <span>Moderate</span>
          </button>
          <button
            onClick={() => setFilterMode('green')}
            className={`px-2 py-0.5 text-[10px] font-semibold rounded flex items-center space-x-1 ${
              filterMode === 'green' ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-700' : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Available</span>
          </button>
        </div>

        {/* Selected Circuit Badge */}
        <div className="bg-[#0E1A38]/95 border border-[#1E2F5B] px-2.5 py-1 rounded text-[11px] font-mono text-slate-300 flex items-center space-x-1.5 shadow-md">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>Active Corridor: <strong className="text-white capitalize">{circuit}</strong></span>
        </div>
      </div>

      {/* Leaflet Map Div */}
      <div ref={mapContainerRef} className="w-full h-full flex-1 min-h-[480px]" />

      {/* Map Legend Overlay at Bottom-Left */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-[#0E1A38]/95 border border-[#1E2F5B] p-2 rounded text-[10px] shadow-lg">
        <div className="font-mono text-slate-400 uppercase tracking-wider mb-1 text-[9px]">
          Carrying Capacity Thresholds (GIS)
        </div>
        <div className="flex items-center space-x-3 text-slate-200">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
            <span>&lt;45% Safe / Green</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
            <span>45-74% Moderate / Yellow</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-red-600 inline-block"></span>
            <span>&gt;75% Overloaded / Red</span>
          </span>
          {alternativeDestination && (
            <span className="flex items-center space-x-1 pl-2 border-l border-[#1E2F5B]">
              <span className="w-4 h-0.5 bg-emerald-400 inline-block border-t border-dashed"></span>
              <span className="text-emerald-300 font-mono">Diversion Flow</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
