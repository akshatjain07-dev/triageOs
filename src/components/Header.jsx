import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Clock, 
  ShieldAlert, 
  Sliders, 
  Hospital,
  Activity,
  CheckCircle2,
  RefreshCw,
  Radio,
  Ambulance,
  AlertOctagon,
  Sparkles
} from 'lucide-react';

export default function Header({ 
  currentView, 
  resources, 
  setResources, 
  isIcuAlert,
  onResetData
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dispatchStatus, setDispatchStatus] = useState('ACTIVE'); // 'ACTIVE' | 'HIGH_SURGE'

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const icuAvailable = resources.icu.available;
  const icuTotal = resources.icu.total;
  const icuPercent = ((icuAvailable / icuTotal) * 100).toFixed(1);

  // Quick capacity simulation helper
  const handleSetIcuAvailable = (count) => {
    setResources(prev => ({
      ...prev,
      icu: {
        ...prev.icu,
        available: count,
        occupied: prev.icu.total - count
      }
    }));
  };

  const toggleDispatchStatus = () => {
    setDispatchStatus(prev => prev === 'ACTIVE' ? 'HIGH_SURGE' : 'ACTIVE');
  };

  return (
    <header className="border-b border-slate-800/80 bg-[#0a0c10]/95 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 py-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: TriageOS Logo & Glowing Red Heartbeat Icon */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center bg-[#0d111a] border border-slate-800/80 px-3.5 py-1.5 rounded-xl shadow-lg shadow-black/60 group">
              {/* Glowing Red Heartbeat Icon */}
              <div className="relative flex items-center justify-center mr-2.5">
                <Activity className="w-5 h-5 text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-[0_0_6px_#ef4444]"></span>
                </span>
              </div>

              {/* SVG: Red Heartbeat Line Connecting into Cyan 'OS' */}
              <svg 
                viewBox="0 0 110 32" 
                className="h-7 w-auto overflow-visible select-none"
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#ef4444" floodOpacity="0.9" />
                  </filter>
                  <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#00f2fe" floodOpacity="0.95" />
                  </filter>
                  <linearGradient id="heartbeat-to-os" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="70%" stopColor="#ef4444" />
                    <stop offset="90%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#00f2fe" />
                  </linearGradient>
                </defs>

                {/* Background cardiac grid lines */}
                <path d="M0 16h110" stroke="#1e293b" strokeWidth="0.75" strokeDasharray="2 3" opacity="0.4" />
                <path d="M0 8h110" stroke="#1e293b" strokeWidth="0.75" strokeDasharray="2 3" opacity="0.25" />
                <path d="M0 24h110" stroke="#1e293b" strokeWidth="0.75" strokeDasharray="2 3" opacity="0.25" />

                {/* Crimson Red Heartbeat (EKG) line connecting smoothly into the cyan 'OS' */}
                <path 
                  d="M 2 16 L 16 16 L 21 16 L 24 11 L 27 21 L 31 3 L 36 29 L 40 13 L 44 19 L 47 16 L 68 16" 
                  stroke="url(#heartbeat-to-os)" 
                  strokeWidth="2.8" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  filter="url(#glow-red)"
                />

                {/* Connection Bridge: Crimson into Cyan Dot */}
                <circle cx="68" cy="16" r="2.2" fill="#ef4444" filter="url(#glow-red)" />
                <line x1="68" y1="16" x2="74" y2="16" stroke="#00f2fe" strokeWidth="2.4" strokeDasharray="1.5 2" />

                {/* Neon Cyan 'OS' */}
                <rect 
                  x="76" 
                  y="7" 
                  width="13" 
                  height="18" 
                  rx="4.5" 
                  stroke="#00f2fe" 
                  strokeWidth="2.8" 
                  fill="none" 
                  filter="url(#glow-cyan)"
                />
                <path 
                  d="M 103 10 C 103 7.8 94 7.8 94 12 C 94 16 103 15.5 103 20 C 103 24.5 94 24.5 94 22" 
                  stroke="#00f2fe" 
                  strokeWidth="2.8" 
                  strokeLinecap="round" 
                  fill="none" 
                  filter="url(#glow-cyan)"
                />
              </svg>

              {/* Brand Typography: TriageOS */}
              <div className="ml-2 pl-2.5 border-l border-slate-800">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-lg font-extrabold tracking-tight text-white font-mono">
                    Triage<span className="text-[#00f2fe] font-black drop-shadow-[0_0_12px_rgba(0,242,254,0.8)]">OS</span>
                  </span>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                    LIVE
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                  Hospital Command Center
                </span>
              </div>
            </div>
          </div>

          {/* Current View Badge Indicator */}
          <div className="hidden xl:flex items-center gap-2 pl-2 border-l border-slate-800/80">
            <span className="text-xs font-semibold text-slate-300 font-mono">
              {currentView === 'dashboard' ? 'Dashboard' : 'Patient Intake'}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              CORE v3.8
            </span>
          </div>
        </div>

        {/* Center / Right: Glowing Emergency Dispatch Status Indicator & Admin Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* ======================================================== */}
          {/* GLOWING EMERGENCY DISPATCH STATUS INDICATOR               */}
          {/* ======================================================== */}
          <div 
            onClick={toggleDispatchStatus}
            title="Click to toggle simulated Emergency Dispatch surge level"
            className={`cursor-pointer group select-none flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border transition-all duration-300 ${
              dispatchStatus === 'HIGH_SURGE' || isIcuAlert
                ? 'bg-gradient-to-r from-red-950/90 to-red-900/60 border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.45)]'
                : 'bg-gradient-to-r from-[#0d111a] to-[#101726] border-cyan-500/40 shadow-[0_0_15px_rgba(0,242,254,0.25)]'
            }`}
          >
            {/* Glowing Beacon Indicator */}
            <div className="relative flex items-center justify-center w-3 h-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                dispatchStatus === 'HIGH_SURGE' || isIcuAlert ? 'bg-red-400' : 'bg-cyan-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                dispatchStatus === 'HIGH_SURGE' || isIcuAlert 
                  ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' 
                  : 'bg-cyan-400 shadow-[0_0_8px_#00f2fe]'
              }`}></span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className={`text-[11px] font-mono font-black tracking-wider uppercase ${
                  dispatchStatus === 'HIGH_SURGE' || isIcuAlert
                    ? 'text-red-300 drop-shadow-[0_0_6px_rgba(239,68,68,0.7)]'
                    : 'text-cyan-300 drop-shadow-[0_0_6px_rgba(0,242,254,0.6)]'
                }`}>
                  {dispatchStatus === 'HIGH_SURGE' || isIcuAlert
                    ? 'EMERGENCY DISPATCH: SURGE ACTIVE'
                    : 'EMERGENCY DISPATCH: REAL-TIME ACTIVE'}
                </span>
                <span className={`text-[9px] font-mono font-bold px-1 rounded ${
                  dispatchStatus === 'HIGH_SURGE' || isIcuAlert
                    ? 'bg-red-500 text-slate-950'
                    : 'bg-cyan-500 text-slate-950'
                }`}>
                  {dispatchStatus === 'HIGH_SURGE' || isIcuAlert ? 'LEVEL 1' : 'ONLINE'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                  8 Units Deployed
                </span>
                <span>•</span>
                <span className={dispatchStatus === 'HIGH_SURGE' || isIcuAlert ? 'text-red-400' : 'text-slate-400'}>
                  {dispatchStatus === 'HIGH_SURGE' || isIcuAlert ? 'Trauma Red Alert' : 'EMS Telemetry Ready'}
                </span>
              </div>
            </div>
          </div>

          {/* ICU Capacity Simulator Trigger for Admin Testing */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#0d111a] border border-slate-800/80 px-2.5 py-1.5 rounded-xl">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 font-mono">
              <Sliders className="w-3 h-3 text-cyan-400" />
              ICU:
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleSetIcuAvailable(4)}
                title="Set ICU to 4 beds (12.5% - Triggers <15% Alert)"
                className={`text-[10px] font-mono px-2 py-0.5 rounded transition ${
                  icuAvailable <= 4 
                    ? 'bg-red-500/30 text-red-300 border border-red-500/60 font-bold shadow-[0_0_10px_rgba(239,68,68,0.4)]' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                Surge (4 Beds)
              </button>
              <button
                onClick={() => handleSetIcuAvailable(9)}
                title="Set ICU to 9 beds (28.1% - Safe Capacity)"
                className={`text-[10px] font-mono px-2 py-0.5 rounded transition ${
                  icuAvailable > 4 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                Safe (9 Beds)
              </button>
            </div>
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={onResetData}
            title="Reset queue and metrics to initial state"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-[#0d111a] hover:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-800/80 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline font-mono text-[11px]">Reset</span>
          </button>

          {/* Live Command Clock */}
          <div className="flex items-center gap-1.5 bg-[#0d111a] border border-slate-800/80 px-3 py-1.5 rounded-xl text-xs font-mono text-cyan-400 font-semibold shadow-inner">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            <span className="text-slate-500 text-[10px]">EDT</span>
          </div>
        </div>

      </div>
    </header>
  );
}
