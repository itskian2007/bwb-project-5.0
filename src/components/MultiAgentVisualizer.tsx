'use client';

import React, { useState } from 'react';
import { 
  Bot, 
  Cpu, 
  Sparkles, 
  Activity, 
  Terminal, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle,
  Network,
  Zap,
  ShieldCheck,
  TrendingUp,
  Brain
} from 'lucide-react';
import { INITIAL_MULTI_AGENTS } from '../data/mockData';
import { MultiAgentState } from '../types';

export const MultiAgentVisualizer: React.FC = () => {
  const [agents, setAgents] = useState<MultiAgentState[]>(INITIAL_MULTI_AGENTS);
  const [isRunningCycle, setIsRunningCycle] = useState<boolean>(false);
  const [selectedAgentIndex, setSelectedAgentIndex] = useState<number>(0);

  const handleRunAgentInferenceCycle = () => {
    setIsRunningCycle(true);

    setTimeout(() => {
      setAgents(prev => [
        {
          ...prev[0],
          lastLog: `Surge alert validated: Shimla weekend wave at 94.8% peak (+0.6%). Dispatched rebalancing vectors to Agent #2.`,
          confidence: 97.4,
          metricsProcessed: '36.8k Cell Tower Pings / 14 Highway Sensors'
        },
        {
          ...prev[1],
          lastLog: `Synthesized multi-dimensional cosine similarity: Narkanda score updated to 94.1% scenic alignment, Kufri to 86.0%.`,
          confidence: 95.8,
          metricsProcessed: '134 Geo-Feature Vectors / 52 Travel Trajectories'
        },
        {
          ...prev[2],
          lastLog: `Updated Cart Road load model: 280 vehicles successfully diverted via Shoghi ring bypass; 4.8 hrs queue eliminated.`,
          confidence: 98.6,
          metricsProcessed: 'Parking Sensors, Water Flow Meters, FASTag Telemetry'
        },
        {
          ...prev[3],
          lastLog: `Synchronized Beckn transaction catalog with 32 village self-help groups in Kumarsain & Thanedhar.`,
          confidence: 99.7,
          metricsProcessed: 'Beckn BPP Catalog Node v2.2 / 32 Local Host Wallets'
        },
        {
          ...prev[4],
          lastLog: `Carbon audit verified: 1,680 kg CO₂ avoided and 21.2 tonnes single-use plastics intercepted from fragile hill valleys.`,
          confidence: 98.2,
          metricsProcessed: 'Life-cycle Carbon Index / Plastic Watershed Model'
        }
      ]);
      setIsRunningCycle(false);
    }, 1200);
  };

  const getStatusColor = (status: MultiAgentState['status']) => {
    switch (status) {
      case 'PREDICTING': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'REBALANCING': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'ANALYZING': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'BROADCASTING': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Multi-Agent System Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-navy-950 via-navy-900 to-cyan-950/20 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
              <Brain className="w-3.5 h-3.5 text-cyan-400" />
              <span>AUTONOMOUS COOPERATIVE MULTI-AGENT ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl font-black text-white">
              5-Agent AI Tourism Operating Mesh
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              DeshDarshan coordinates 5 specialized AI agents communicating in real time to forecast surges, compute semantic destination matches, protect municipal infrastructure, inject rural inventory into ONDC, and calculate climate savings.
            </p>
          </div>

          <button
            onClick={handleRunAgentInferenceCycle}
            disabled={isRunningCycle}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-lg ${
              isRunningCycle
                ? 'bg-navy-800 text-slate-400 border border-white/10 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-navy-950 shadow-cyan-500/20 hover:scale-105'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isRunningCycle ? 'animate-spin' : ''}`} />
            <span>{isRunningCycle ? 'Running Neural Cycle...' : 'Trigger Multi-Agent Cycle'}</span>
          </button>
        </div>
      </div>

      {/* Agents Grid (5 Autonomous Agents) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, idx) => {
          const isSelected = selectedAgentIndex === idx;
          return (
            <div
              key={idx}
              onClick={() => setSelectedAgentIndex(idx)}
              className={`p-6 rounded-3xl cursor-pointer transition-all border flex flex-col justify-between ${
                isSelected
                  ? 'glass-panel-glow border-cyan-400/50 scale-[1.01]'
                  : 'glass-panel border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                  <span className="text-xs font-mono text-cyan-300 font-bold">
                    {agent.confidence}% Confidence
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-white font-black text-base">
                  <Bot className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <h4>{agent.agentName}</h4>
                </div>

                <p className="text-xs text-slate-400 mt-1 font-medium">
                  Role: {agent.role}
                </p>

                <div className="mt-4 p-3 rounded-2xl bg-navy-950/90 border border-white/5 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center">
                    <Terminal className="w-3 h-3 mr-1 text-emerald-400" />
                    Latest Reasoning Trail
                  </span>
                  <p className="text-xs text-slate-200 font-mono leading-relaxed">
                    &ldquo;{agent.lastLog}&rdquo;
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Data Streams:</span>
                <span className="text-slate-300 truncate max-w-[170px]">{agent.metricsProcessed}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Agent Architecture Pipeline Diagram */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">
              End-to-End Autonomous Agent Execution Flow
            </h3>
            <p className="text-xs text-slate-400">
              Deterministic sequence from early surge prediction to ONDC commerce settlement.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
            ZERO LATENCY MESH
          </span>
        </div>

        {/* Pipeline Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="p-4 rounded-2xl bg-navy-950/80 border border-white/5 space-y-2">
            <span className="text-xs font-bold text-cyan-400 font-mono">01. INGEST &amp; FORECAST</span>
            <p className="text-xs text-slate-300">
              Agent 1 ingests toll FASTag queues and weather to detect holiday surge in Shimla (94%).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-navy-950/80 border border-white/5 space-y-2">
            <span className="text-xs font-bold text-emerald-400 font-mono">02. SEMANTIC MATCH</span>
            <p className="text-xs text-slate-300">
              Agent 2 ranks scenic twins: Narkanda matches 93% on elevation, apple orchards, and snow views.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-navy-950/80 border border-white/5 space-y-2">
            <span className="text-xs font-bold text-amber-400 font-mono">03. INFRA SIMULATION</span>
            <p className="text-xs text-slate-300">
              Agent 3 computes municipal relief: 3,400L water saved and 2.3 idling hours eliminated per family.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-navy-950/80 border border-white/5 space-y-2">
            <span className="text-xs font-bold text-purple-400 font-mono">04. ONDC DISPATCH</span>
            <p className="text-xs text-slate-300">
              Agent 4 broadcasts verified Thanedhar homestays onto the Beckn protocol with zero commission.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-navy-950/80 border border-white/5 space-y-2">
            <span className="text-xs font-bold text-emerald-400 font-mono">05. CLIMATE AUDIT</span>
            <p className="text-xs text-slate-300">
              Agent 5 verifies CO₂ offset, diverts hill slope waste, and deposits +450 DeshCredits into user wallet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
