import React from 'react';
import { 
  Activity, 
  LayoutDashboard, 
  UserPlus, 
  ShieldAlert, 
  Bed, 
  Wind, 
  Clock, 
  HeartPulse, 
  Radio, 
  Sparkles,
  ChevronRight,
  Database,
  Sliders,
  Cpu
} from 'lucide-react';

export default function Sidebar({ 
  currentView, 
  setCurrentView, 
  patientQueue, 
  resources,
  isIcuAlert
}) {
  const criticalCount = patientQueue.filter(p => p.triageLevel === 'Critical').length;
  const urgentCount = patientQueue.filter(p => p.triageLevel === 'Urgent').length;
  const routineCount = patientQueue.filter(p => p.triageLevel === 'Routine').length;

  return (
    <aside className="w-72 bg-[#0a0c10] border-r border-slate-800/80 flex flex-col h-screen sticky top-0 shrink-0 z-20 select-none">
      
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 bg-[#0d111a]/70">
        <div className="flex items-center gap-3">
          {/* Glowing TriageOS Emblem */}
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-red-600/30 via-[#0d111a] to-cyan-500/30 border border-slate-700/80 shadow-lg shadow-cyan-950/40 text-white font-bold ring-1 ring-cyan-500/30">
            <HeartPulse className="w-6 h-6 text-red-500 animate-heartbeat drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00f2fe] shadow-[0_0_8px_#00f2fe]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-mono font-black text-lg tracking-tight text-white">
                Triage<span className="text-[#00f2fe] drop-shadow-[0_0_10px_rgba(0,242,254,0.7)]">OS</span>
              </span>
              <span className="text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">
                v3.8
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1">Medical Command Hub</p>
          </div>
        </div>

        {/* Live EMR Telemetry Link */}
        <div className="mt-3.5 flex items-center justify-between text-xs bg-[#07090e] border border-slate-800/80 rounded-lg px-2.5 py-1.5 shadow-inner">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-mono text-[10px] tracking-wide">REGIONAL DISPATCH NET</span>
          </div>
          <span className="text-[9px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
            SYNCED
          </span>
        </div>
      </div>

      {/* Main Navigation Views */}
      <div className="p-3.5 flex-1 overflow-y-auto space-y-5">
        <div>
          <div className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase px-2 mb-2 flex items-center justify-between">
            <span>Navigation Hub</span>
            <span className="text-[9px] text-cyan-400/80">AI CO-PILOT</span>
          </div>

          <nav className="space-y-1.5">
            {/* Tab 1: Dashboard */}
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                currentView === 'dashboard'
                  ? 'bg-gradient-to-r from-cyan-950/60 to-[#0e1726] text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-950/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg transition-colors ${
                  currentView === 'dashboard' 
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,242,254,0.6)]' 
                    : 'bg-[#101726] text-slate-400 group-hover:text-cyan-400 group-hover:bg-slate-800'
                }`}>
                  <LayoutDashboard className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm text-slate-100 group-hover:text-white">Dashboard</div>
                  <div className="text-[10px] text-slate-400 font-normal">Command Telemetry & Queue</div>
                </div>
              </div>

              {isIcuAlert && (
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_8px_#ef4444]"></span>
                </span>
              )}
            </button>

            {/* Tab 2: Patient Intake */}
            <button
              onClick={() => setCurrentView('intake')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                currentView === 'intake'
                  ? 'bg-gradient-to-r from-cyan-950/60 to-[#0e1726] text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-950/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg transition-colors ${
                  currentView === 'intake' 
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,242,254,0.6)]' 
                    : 'bg-[#101726] text-slate-400 group-hover:text-cyan-400 group-hover:bg-slate-800'
                }`}>
                  <UserPlus className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm text-slate-100 group-hover:text-white">Patient Intake</div>
                  <div className="text-[10px] text-slate-400 font-normal">Data Entry & AI Triage</div>
                </div>
              </div>
              <Sparkles className={`w-3.5 h-3.5 ${currentView === 'intake' ? 'text-cyan-400 drop-shadow-[0_0_6px_#00f2fe]' : 'text-slate-500'}`} />
            </button>
          </nav>
        </div>

        {/* Live Queue Acuity Breakdown */}
        <div className="bg-[#0d111a] rounded-xl p-3 border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Queue Severity</span>
            <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-900/50">
              {patientQueue.length} Active
            </span>
          </div>

          <div className="space-y-1.5">
            {/* Critical - Red */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-red-950/40 border border-red-900/60 transition-all hover:bg-red-950/60">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse"></span>
                <span className="text-xs font-semibold text-red-200">Critical (ESI 1-2)</span>
              </div>
              <span className="text-xs font-mono font-black text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-700/80 shadow-[0_0_6px_rgba(239,68,68,0.3)]">
                {criticalCount}
              </span>
            </div>

            {/* Urgent - Yellow */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-950/30 border border-amber-900/50 transition-all hover:bg-amber-950/50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]"></span>
                <span className="text-xs font-semibold text-amber-200">Urgent (ESI 3)</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/70">
                {urgentCount}
              </span>
            </div>

            {/* Routine - Green */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/30 border border-emerald-900/50 transition-all hover:bg-emerald-950/50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]"></span>
                <span className="text-xs font-semibold text-emerald-200">Routine (ESI 4-5)</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/70">
                {routineCount}
              </span>
            </div>
          </div>
        </div>

        {/* ICU Quick Status Gauge */}
        <div className={`p-3 rounded-xl border transition-all ${
          isIcuAlert 
            ? 'bg-red-950/40 border-red-600/80 shadow-lg shadow-red-950/60 animate-glow-critical' 
            : 'bg-[#0d111a] border-slate-800/80'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Bed className={`w-3.5 h-3.5 ${isIcuAlert ? 'text-red-400' : 'text-slate-400'}`} />
              <span className="text-xs font-semibold text-slate-300">ICU Bed Free Ratio</span>
            </div>
            <span className={`text-[11px] font-mono font-extrabold ${isIcuAlert ? 'text-red-400' : 'text-cyan-400'}`}>
              {((resources.icu.available / resources.icu.total) * 100).toFixed(1)}% Free
            </span>
          </div>

          {/* Gauge bar */}
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div 
              className={`h-full transition-all duration-500 ${
                isIcuAlert 
                  ? 'bg-gradient-to-r from-red-600 to-rose-500 shadow-[0_0_8px_#ef4444]' 
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_8px_#00f2fe]'
              }`}
              style={{ width: `${(resources.icu.available / resources.icu.total) * 100}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1.5">
            <span className={isIcuAlert ? 'text-red-400 font-bold' : ''}>
              {resources.icu.available} Available
            </span>
            <span>{resources.icu.total} Total Beds</span>
          </div>
        </div>

        {/* Neural AI Engine Telemetry Info */}
        <div className="bg-[#07090e] rounded-xl p-2.5 border border-slate-800/80 text-[10px] font-mono text-slate-400 space-y-1">
          <div className="flex items-center justify-between text-slate-300 font-semibold">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-400" />
              AI Inference Hub
            </span>
            <span className="text-cyan-400 font-bold">1.2s LATENCY</span>
          </div>
          <div className="text-[9px] text-slate-500 leading-tight">
            Gemini Flash Medical Multi-Agent Model active with 99.4% triage consistency.
          </div>
        </div>
      </div>

      {/* Hospital Administrator Profile Footer */}
      <div className="p-3.5 border-t border-slate-800/80 bg-[#0d111a]/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-mono font-bold text-xs ring-1 ring-cyan-400/50 shadow-[0_0_10px_rgba(0,242,254,0.3)]">
              DS
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">Dr. Sterling</div>
              <div className="text-[10px] text-slate-400">Chief Triage Director</div>
            </div>
          </div>
          <div className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60 font-semibold">
            UNIT-1
          </div>
        </div>
      </div>
    </aside>
  );
}
