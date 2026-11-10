import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Bed, 
  Wind, 
  Clock, 
  Activity, 
  AlertTriangle, 
  ArrowUpDown, 
  Search, 
  Filter, 
  UserPlus, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink,
  Flame,
  Hospital,
  AlertCircle,
  Eye,
  Sliders,
  Check,
  Zap,
  Sparkles,
  HeartPulse,
  Stethoscope,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { PRESET_CASES, evaluateClinicalTriage } from '../data/mockData';

export default function CommandDashboard({ 
  resources, 
  setResources, 
  patientQueue, 
  setPatientQueue, 
  onSelectPatient,
  onNavigateToIntake,
  onAddPatientToQueue
}) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirection, setSortDirection] = useState('asc'); // asc = Critical first
  const [bannerAcknowledged, setBannerAcknowledged] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Inline Patient Intake Form State
  const [intakeForm, setIntakeForm] = useState({
    name: '',
    age: '',
    symptoms: '',
    heartRate: '',
    bp: '',
    spo2: '',
  });
  const [isIntaking, setIsIntaking] = useState(false);
  const [lastTriagedResult, setLastTriagedResult] = useState(null);
  const [intakeValidationError, setIntakeValidationError] = useState('');

  const icuAvailable = resources.icu.available;
  const icuTotal = resources.icu.total;
  const icuCapacityRatio = icuAvailable / icuTotal;
  const isIcuBelow15 = icuCapacityRatio < 0.15;
  const icuPercentage = (icuCapacityRatio * 100).toFixed(1);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Severity Weight Mapping for automatic sorting
  // 1: Critical (Red), 2: Urgent (Yellow), 3: Routine (Green)
  const getSeverityWeight = (level) => {
    switch (level) {
      case 'Critical': return 1;
      case 'Urgent': return 2;
      case 'Routine': return 3;
      default: return 4;
    }
  };

  // Automatically sort patients by triage severity
  const sortedPatients = [...patientQueue].sort((a, b) => {
    const weightA = getSeverityWeight(a.triageLevel);
    const weightB = getSeverityWeight(b.triageLevel);

    if (weightA !== weightB) {
      return sortDirection === 'asc' ? weightA - weightB : weightB - weightA;
    }
    // Secondary sort: wait time descending (longest wait first)
    return (b.waitTimeMinutes || 0) - (a.waitTimeMinutes || 0);
  });

  // Filter by search and tab
  const filteredPatients = sortedPatients.filter(patient => {
    const matchesFilter = 
      filterSeverity === 'ALL' || 
      patient.triageLevel.toUpperCase() === filterSeverity;

    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      !query ||
      patient.name.toLowerCase().includes(query) ||
      patient.id.toLowerCase().includes(query) ||
      patient.symptoms.toLowerCase().includes(query) ||
      (patient.attendingDoctor && patient.attendingDoctor.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  // Action: Admit to ICU
  const handleAdmitToIcu = (patient) => {
    if (resources.icu.available <= 0) {
      showToast('❌ No ICU beds currently available! Divert protocol required.');
      return;
    }
    setResources(prev => ({
      ...prev,
      icu: {
        ...prev.icu,
        available: Math.max(0, prev.icu.available - 1),
        occupied: prev.icu.occupied + 1
      }
    }));
    setPatientQueue(prev => prev.map(p => 
      p.id === patient.id 
        ? { ...p, status: 'Admitted to ICU Unit 1', assignedBay: 'ICU Bed Station' } 
        : p
    ));
    showToast(`✓ ${patient.name} admitted to ICU. Capacity updated.`);
  };

  // Action: Discharge / Transfer
  const handleDischargePatient = (patientId, patientName) => {
    setPatientQueue(prev => prev.filter(p => p.id !== patientId));
    showToast(`✓ ${patientName} discharged from active queue.`);
  };

  // Expand Ward 4B to relieve ICU
  const handleExpandWard = () => {
    setResources(prev => ({
      ...prev,
      icu: {
        ...prev.icu,
        total: prev.icu.total + 4,
        available: prev.icu.available + 4
      }
    }));
    showToast('✓ Overflow Ward 4B Activated: +4 ICU Beds allocated.');
  };

  // Handle Form Change
  const handleIntakeChange = (e) => {
    const { name, value } = e.target;
    setIntakeForm(prev => ({ ...prev, [name]: value }));
    if (intakeValidationError) setIntakeValidationError('');
  };

  // Quick Preset Loader for Inline Intake Form
  const loadPresetIntoIntake = (preset) => {
    setIntakeForm({
      name: preset.data.patientName,
      age: preset.data.age.toString(),
      symptoms: preset.data.symptoms,
      heartRate: preset.data.heartRate.toString(),
      bp: preset.data.bloodPressure,
      spo2: preset.data.spo2.toString(),
    });
    setLastTriagedResult(null);
    setIntakeValidationError('');
  };

  // Run AI Triage from Inline Form
  const handleRunInlineAiTriage = (e) => {
    e.preventDefault();

    if (!intakeForm.name.trim()) {
      setIntakeValidationError('Please enter patient name.');
      return;
    }
    if (!intakeForm.symptoms.trim()) {
      setIntakeValidationError('Please enter patient symptoms.');
      return;
    }
    if (!intakeForm.heartRate || !intakeForm.bp || !intakeForm.spo2) {
      setIntakeValidationError('Please provide complete vital telemetry (HR, BP, SpO2).');
      return;
    }

    setIsIntaking(true);
    setIntakeValidationError('');

    setTimeout(() => {
      // Evaluate triage using clinical engine
      const evaluation = evaluateClinicalTriage({
        patientName: intakeForm.name,
        age: intakeForm.age || 45,
        symptoms: intakeForm.symptoms,
        heartRate: intakeForm.heartRate,
        bloodPressure: intakeForm.bp,
        spo2: intakeForm.spo2,
      });

      const newPatientRecord = {
        id: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
        name: evaluation.patientName,
        age: parseInt(evaluation.age),
        gender: evaluation.gender,
        symptoms: evaluation.symptoms,
        heartRate: evaluation.heartRate,
        bloodPressure: evaluation.bloodPressure,
        systolic: evaluation.systolic,
        diastolic: evaluation.diastolic,
        spo2: evaluation.spo2,
        triageLevel: evaluation.triageLevel,
        colorCode: evaluation.colorCode,
        esiScore: evaluation.esiScore,
        vitalStatus: evaluation.vitalStatus,
        waitTimeMinutes: 1,
        arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        assignedBay: evaluation.targetUnit,
        attendingDoctor: 'Dr. Sterling (Attending)',
        aiRationale: evaluation.aiRationale,
        recommendedCarePathway: evaluation.recommendedCarePathway,
        status: evaluation.triageLevel === 'Critical' ? 'Stat Emergency Bay' : 'Active Queue',
        priorityRank: 1
      };

      if (onAddPatientToQueue) {
        onAddPatientToQueue(newPatientRecord);
      } else {
        setPatientQueue(prev => [newPatientRecord, ...prev]);
      }

      setLastTriagedResult(newPatientRecord);
      setIsIntaking(false);
      showToast(`✓ AI Triage Complete: ${newPatientRecord.name} classified as ${newPatientRecord.triageLevel.toUpperCase()} (${newPatientRecord.esiScore})`);
      
      // Reset form
      setIntakeForm({
        name: '',
        age: '',
        symptoms: '',
        heartRate: '',
        bp: '',
        spo2: ''
      });
    }, 600);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0d111a] text-slate-100 border border-cyan-500/60 shadow-2xl shadow-cyan-950/80 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium animate-bounce">
          <Activity className="w-4 h-4 text-[#00f2fe]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* SIMULATED PREDICTIVE ALERT BANNER (ICU CAPACITY < 15%)   */}
      {/* ======================================================== */}
      {isIcuBelow15 && !bannerAcknowledged ? (
        <div className="relative overflow-hidden rounded-2xl border-2 border-red-600/90 bg-gradient-to-r from-red-950/95 via-[#0d111a] to-red-950/90 p-5 shadow-2xl shadow-red-950/80 animate-glow-critical">
          <div className="absolute inset-0 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-600/30 border border-red-500/60 rounded-xl text-red-400 shrink-0 shadow-lg shadow-red-900/50">
                <ShieldAlert className="w-7 h-7 text-red-500 animate-pulse" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-red-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded tracking-wide uppercase">
                    CRITICAL PREDICTIVE ALERT
                  </span>
                  <span className="text-xs font-mono font-bold text-red-300 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                    ICU CAPACITY AT {icuPercentage}% ({icuAvailable}/{icuTotal} BEDS REMAINING)
                  </span>
                  <span className="text-xs text-red-400 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Saturation Forecast: ~34 Mins
                  </span>
                </div>
                <h2 className="text-base font-bold text-red-100 mt-1.5 tracking-tight font-sans">
                  Intensive Care Unit Critical Surge Threshold Exceeded (&lt; 15% Headroom)
                </h2>
                <p className="text-xs text-red-200/80 mt-1 max-w-3xl leading-relaxed">
                  TriageOS neural forecast detected high inpatient inflow (+3 critical trauma admissions in queue). 
                  Hospital administration policy recommends commissioning Step-down Overflow Ward 4B immediately.
                </p>
              </div>
            </div>

            {/* Alert Action Buttons */}
            <div className="flex flex-wrap md:flex-col lg:flex-row items-center gap-2.5 shrink-0">
              <button
                onClick={handleExpandWard}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-900/50 transition flex items-center gap-1.5"
              >
                <Hospital className="w-4 h-4" />
                Activate Overflow 4B (+4 Beds)
              </button>
              <button
                onClick={() => {
                  showToast('⚠️ Regional EMS Trauma Divert protocol transmitted to dispatch.');
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#101726] hover:bg-slate-800 text-red-200 border border-red-800/80 transition"
              >
                Authorize EMS Divert
              </button>
              <button
                onClick={() => setBannerAcknowledged(true)}
                className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 transition"
                title="Silence alert visual banner for current session"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Status Banner when ICU Capacity is Nominal */
        <div className="rounded-xl border border-slate-800/80 bg-[#0d111a]/80 p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200">Hospital Inpatient Telemetry Nominal</span>
              <span className="text-xs text-slate-400 ml-2">
                ICU Headroom at {icuPercentage}% ({icuAvailable}/{icuTotal} free). Predictive AI active across 32 bed stations.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {bannerAcknowledged && (
              <button
                onClick={() => setBannerAcknowledged(false)}
                className="text-xs font-mono text-cyan-400 hover:underline"
              >
                Show Alert Banner
              </button>
            )}
            <button
              onClick={() => {
                setResources(prev => ({
                  ...prev,
                  icu: { ...prev.icu, available: 4, occupied: 28 }
                }));
                setBannerAcknowledged(false);
                showToast('Simulated: ICU available beds set to 4 (12.5%). Alert active!');
              }}
              className="text-xs text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 px-2.5 py-1 rounded border border-slate-700 transition font-mono"
            >
              Test &lt;15% Surge Alert
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FOUR TOP-LEVEL METRIC CARDS                              */}
      {/* 1. Available ICU Beds                                    */}
      {/* 2. Active Ventilators                                    */}
      {/* 3. Gen Ward Capacity                                     */}
      {/* 4. Avg AI Triage Time                                    */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: ICU Beds */}
        <div className={`rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden backdrop-blur-md ${
          isIcuBelow15 
            ? 'bg-gradient-to-br from-red-950/60 via-[#0d111a] to-[#0d111a] border-red-600/80 shadow-lg shadow-red-950/50' 
            : 'bg-[#0d111a]/90 border-slate-800/80 shadow-md'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">ICU Beds</span>
            <div className={`p-2 rounded-xl ${
              isIcuBelow15 
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.3)]' 
                : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,242,254,0.2)]'
            }`}>
              <Bed className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-mono tracking-tight ${
              isIcuBelow15 ? 'text-red-400 neon-text-red' : 'text-slate-100'
            }`}>
              {icuAvailable}
            </span>
            <span className="text-sm font-mono text-slate-400">/ {icuTotal} Available</span>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div 
              className={`h-full transition-all duration-500 ${
                isIcuBelow15 ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_8px_#00f2fe]'
              }`}
              style={{ width: `${(icuAvailable / icuTotal) * 100}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className={`font-mono font-bold ${isIcuBelow15 ? 'text-red-400' : 'text-cyan-400'}`}>
              {icuPercentage}% Capacity Free
            </span>
            <span className="text-slate-400 font-mono">{resources.icu.occupied} Occupied</span>
          </div>
          
          {isIcuBelow15 && (
            <div className="mt-2 text-[11px] text-red-400 font-medium flex items-center gap-1 font-mono">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Surge alert: Under 15% threshold</span>
            </div>
          )}
        </div>

        {/* Metric 2: Ventilators */}
        <div className="rounded-2xl p-5 bg-[#0d111a]/90 border border-slate-800/80 shadow-md backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Ventilators</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
              <Wind className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-slate-100">
              {resources.ventilators.active}
            </span>
            <span className="text-sm font-mono text-slate-400">/ {resources.ventilators.total} Active</span>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 shadow-[0_0_8px_#3b82f6]"
              style={{ width: `${(resources.ventilators.active / resources.ventilators.total) * 100}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="font-mono text-blue-400 font-semibold">
              {((resources.ventilators.active / resources.ventilators.total) * 100).toFixed(1)}% Utilization
            </span>
            <span className="text-emerald-400 font-mono font-medium">{resources.ventilators.standby} Standby</span>
          </div>
        </div>

        {/* Metric 3: Ward Capacity */}
        <div className="rounded-2xl p-5 bg-[#0d111a]/90 border border-slate-800/80 shadow-md backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Ward Capacity</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
              <Hospital className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-slate-100">
              {((resources.generalWard.occupied / resources.generalWard.total) * 100).toFixed(0)}%
            </span>
            <span className="text-sm font-mono text-slate-400">
              ({resources.generalWard.occupied}/{resources.generalWard.total} Beds)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 shadow-[0_0_8px_#a855f7]"
              style={{ width: `${(resources.generalWard.occupied / resources.generalWard.total) * 100}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="font-mono text-purple-400 font-semibold">
              {resources.generalWard.available} Available Beds
            </span>
            <span className="text-slate-400 font-mono">Turnover: 9/hr</span>
          </div>
        </div>

        {/* Metric 4: Triage Time */}
        <div className="rounded-2xl p-5 bg-[#0d111a]/90 border border-slate-800/80 shadow-md backdrop-blur-md relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Triage Time</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,242,254,0.3)]">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-[#00f2fe] neon-text-cyan">
              {resources.avgAiTriageTime?.value || '1.2s'}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
              Avg AI Triage
            </span>
          </div>

          {/* Progress Bar / Inference indicator */}
          <div className="mt-3 w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-[#00f2fe] transition-all duration-500 shadow-[0_0_8px_#00f2fe]"
              style={{ width: '92%' }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400 font-semibold flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-400" />
              Sub-second ESI
            </span>
            <span className="text-slate-400">142 ops/hr</span>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* PATIENT INTAKE FORM SECTION                              */}
      {/* Input fields: Name, Age, Symptoms, Heart Rate, BP, SpO2  */}
      {/* Ending with prominent cyan "Run AI Triage" button         */}
      {/* ======================================================== */}
      <div className="rounded-2xl border border-slate-800/80 bg-[#0d111a]/95 backdrop-blur-md shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800/80 bg-[#0a0c10]/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,242,254,0.3)]">
                <UserPlus className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-100 tracking-tight font-sans">
                Patient Intake — Rapid Clinical Entry
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-semibold">
                NEURAL ESI ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Input patient vitals and symptoms to compute real-time acuity score and dispatch directly to queue.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono text-slate-400 mr-1">1-Click Presets:</span>
            <button
              type="button"
              onClick={() => loadPresetIntoIntake(PRESET_CASES[0])}
              className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-red-950/50 hover:bg-red-900/60 text-red-300 border border-red-800/80 transition flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              STEMI (Critical)
            </button>
            <button
              type="button"
              onClick={() => loadPresetIntoIntake(PRESET_CASES[1])}
              className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 border border-amber-800/80 transition flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Asthma (Urgent)
            </button>
            <button
              type="button"
              onClick={() => loadPresetIntoIntake(PRESET_CASES[2])}
              className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/80 transition flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Ankle Sprain (Routine)
            </button>
          </div>
        </div>

        {/* Intake Form Inputs */}
        <form onSubmit={handleRunInlineAiTriage} className="p-5 space-y-4">
          {intakeValidationError && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-700/80 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{intakeValidationError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
            {/* Field 1: Name */}
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Patient Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={intakeForm.name}
                onChange={handleIntakeChange}
                placeholder="e.g. Devon Vance"
                className="w-full bg-[#07090e] border border-slate-800/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 text-xs rounded-xl px-3 py-2.5 placeholder-slate-500 transition"
              />
            </div>

            {/* Field 2: Age */}
            <div>
              <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Age <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="age"
                value={intakeForm.age}
                onChange={handleIntakeChange}
                placeholder="e.g. 58"
                className="w-full bg-[#07090e] border border-slate-800/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 text-xs rounded-xl px-3 py-2.5 placeholder-slate-500 transition font-mono"
              />
            </div>

            {/* Field 4: Heart Rate */}
            <div>
              <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Heart Rate (BPM) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="heartRate"
                value={intakeForm.heartRate}
                onChange={handleIntakeChange}
                placeholder="e.g. 128"
                className="w-full bg-[#07090e] border border-slate-800/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 text-xs rounded-xl px-3 py-2.5 placeholder-slate-500 transition font-mono"
              />
            </div>

            {/* Field 5: BP */}
            <div>
              <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                BP (mmHg) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="bp"
                value={intakeForm.bp}
                onChange={handleIntakeChange}
                placeholder="e.g. 185/115"
                className="w-full bg-[#07090e] border border-slate-800/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 text-xs rounded-xl px-3 py-2.5 placeholder-slate-500 transition font-mono"
              />
            </div>

            {/* Field 6: SpO2 */}
            <div>
              <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                SpO2 (%) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="spo2"
                value={intakeForm.spo2}
                onChange={handleIntakeChange}
                placeholder="e.g. 88"
                className="w-full bg-[#07090e] border border-slate-800/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 text-xs rounded-xl px-3 py-2.5 placeholder-slate-500 transition font-mono"
              />
            </div>
          </div>

          {/* Field 3: Symptoms */}
          <div>
            <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Symptoms & Chief Complaint <span className="text-red-400">*</span>
            </label>
            <textarea
              name="symptoms"
              rows={2}
              value={intakeForm.symptoms}
              onChange={handleIntakeChange}
              placeholder="e.g. Crushing retrosternal chest pain radiating to left jaw, diaphoresis, acute shortness of breath..."
              className="w-full bg-[#07090e] border border-slate-800/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 text-xs rounded-xl px-3 py-2 placeholder-slate-500 transition"
            />
          </div>

          {/* Bottom Bar: Action & Prominent Cyan "Run AI Triage" Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Multi-agent algorithm computes ESI 1-5, vital anomaly scores & optimal care pathway.</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIntakeForm({ name: '', age: '', symptoms: '', heartRate: '', bp: '', spo2: '' })}
                className="text-xs text-slate-400 hover:text-slate-200 px-3 py-2 rounded-xl transition"
              >
                Clear
              </button>

              {/* Prominent Cyan "Run AI Triage" Button */}
              <button
                type="submit"
                disabled={isIntaking}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-mono font-extrabold text-xs tracking-wider uppercase transition-all duration-200 bg-[#00f2fe] hover:bg-cyan-300 active:scale-95 text-slate-950 border border-cyan-200 shadow-[0_0_25px_rgba(0,242,254,0.65)] hover:shadow-[0_0_35px_rgba(0,242,254,0.9)] flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                {isIntaking ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Neural Inferencing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                    <span>Run AI Triage</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Recently Triaged Output Pill */}
        {lastTriagedResult && (
          <div className="p-3.5 mx-5 mb-5 rounded-xl border border-cyan-500/40 bg-cyan-950/30 flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                lastTriagedResult.triageLevel === 'Critical' 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                  : lastTriagedResult.triageLevel === 'Urgent'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}>
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-100">{lastTriagedResult.name}</span>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                    lastTriagedResult.triageLevel === 'Critical'
                      ? 'bg-red-500 text-slate-950'
                      : lastTriagedResult.triageLevel === 'Urgent'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-emerald-400 text-slate-950'
                  }`}>
                    {lastTriagedResult.triageLevel} ({lastTriagedResult.esiScore})
                  </span>
                  <span className="text-[11px] font-mono text-cyan-300">Added to Live Dispatch Queue (#1)</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  Care Pathway: {lastTriagedResult.recommendedCarePathway}
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelectPatient(lastTriagedResult)}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline shrink-0"
            >
              View AI Dossier →
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* LIVE DISPATCH ACTIVE PATIENT QUEUE TABLE                 */}
      {/* Sorted by color-coded acuity badges:                     */}
      {/* Red for Critical, Yellow for Urgent, Green for Routine   */}
      {/* ======================================================== */}
      <div className="rounded-2xl border border-slate-800/80 bg-[#0d111a]/95 backdrop-blur-md shadow-xl overflow-hidden">
        {/* Table Header & Controls Bar */}
        <div className="p-5 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0c10]/60">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-slate-100 tracking-tight font-sans flex items-center gap-2">
                Live Patient Queue
              </h3>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {filteredPatients.length} Active Patients
              </span>
              <span className="hidden sm:flex text-xs font-medium text-slate-400 items-center gap-1 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Auto-Sorted by Acuity: Critical (Red) → Routine (Green)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Active patient prioritization queue with color-coded acuity badges and real-time vital telemetry.
            </p>
          </div>

          {/* Right Action Tools: Filter Chips, Search */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter Buttons */}
            <div className="flex items-center bg-[#07090e] border border-slate-800/80 p-1 rounded-xl text-xs font-medium">
              <button
                onClick={() => setFilterSeverity('ALL')}
                className={`px-3 py-1.5 rounded-lg transition font-mono text-[11px] ${
                  filterSeverity === 'ALL' 
                    ? 'bg-slate-800 text-white font-bold' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({patientQueue.length})
              </button>
              <button
                onClick={() => setFilterSeverity('CRITICAL')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 font-mono text-[11px] ${
                  filterSeverity === 'CRITICAL' 
                    ? 'bg-red-950 text-red-300 font-bold border border-red-800 shadow-[0_0_8px_rgba(239,68,68,0.4)]' 
                    : 'text-red-400/80 hover:text-red-300'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                Critical ({patientQueue.filter(p => p.triageLevel === 'Critical').length})
              </button>
              <button
                onClick={() => setFilterSeverity('URGENT')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 font-mono text-[11px] ${
                  filterSeverity === 'URGENT' 
                    ? 'bg-amber-950 text-amber-300 font-bold border border-amber-800' 
                    : 'text-amber-400/80 hover:text-amber-300'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Urgent ({patientQueue.filter(p => p.triageLevel === 'Urgent').length})
              </button>
              <button
                onClick={() => setFilterSeverity('ROUTINE')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 font-mono text-[11px] ${
                  filterSeverity === 'ROUTINE' 
                    ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800' 
                    : 'text-emerald-400/80 hover:text-emerald-300'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Routine ({patientQueue.filter(p => p.triageLevel === 'Routine').length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search patient, vitals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#07090e] border border-slate-800/80 text-xs rounded-xl pl-8 pr-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44"
              />
            </div>

            {/* Sort Toggle */}
            <button
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              title="Toggle sort direction"
              className="p-1.5 rounded-xl bg-[#07090e] border border-slate-800/80 text-slate-400 hover:text-white transition"
            >
              <ArrowUpDown className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-[#07090e]/80 text-slate-400 text-[11px] font-bold uppercase tracking-wider font-mono">
                <th className="py-3 px-4">Acuity Badge</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Symptoms</th>
                <th className="py-3 px-4">Vitals (HR / BP / SpO2)</th>
                <th className="py-3 px-4">Wait Time</th>
                <th className="py-3 px-4">Bay</th>
                <th className="py-3 px-4 text-right">Emergency Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">No patients match the active filters.</p>
                    <button 
                      onClick={() => { setFilterSeverity('ALL'); setSearchQuery(''); }}
                      className="text-xs text-cyan-400 underline mt-1"
                    >
                      Clear search and filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient, index) => {
                  const isCritical = patient.triageLevel === 'Critical';
                  const isUrgent = patient.triageLevel === 'Urgent';
                  const isRoutine = patient.triageLevel === 'Routine';

                  return (
                    <tr 
                      key={patient.id}
                      className={`transition-colors duration-150 hover:bg-slate-800/40 ${
                        isCritical 
                          ? 'bg-red-950/20' 
                          : isUrgent 
                          ? 'bg-amber-950/10' 
                          : ''
                      }`}
                    >
                      {/* Priority & Acuity Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-400 w-5">
                            #{index + 1}
                          </span>
                          
                          {/* Color-Coded Acuity Badge */}
                          {isCritical && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-black bg-red-500/20 text-red-300 border border-red-500/60 shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_#ef4444]"></span>
                              CRITICAL
                            </span>
                          )}
                          {isUrgent && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-[0_0_8px_rgba(245,158,11,0.3)]">
                              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                              URGENT
                            </span>
                          )}
                          {isRoutine && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                              ROUTINE
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-1 pl-7">
                          {patient.esiScore || (isCritical ? 'ESI 1' : isUrgent ? 'ESI 3' : 'ESI 5')}
                        </div>
                      </td>

                      {/* Patient Profile */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-100 flex items-center gap-1.5">
                          {patient.name}
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          {patient.id} • {patient.age}y • {patient.gender || 'Adult'}
                        </div>
                      </td>

                      {/* Symptoms & Chief Complaint */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-xs text-slate-300 font-medium line-clamp-2">
                          {patient.symptoms}
                        </p>
                      </td>

                      {/* Clinical Vitals */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                          {/* Heart Rate */}
                          <span className={`px-2 py-0.5 rounded border ${
                            patient.heartRate > 120 || patient.heartRate < 50
                              ? 'bg-red-950/70 text-red-300 border-red-800 font-bold'
                              : patient.heartRate > 100
                              ? 'bg-amber-950/70 text-amber-300 border-amber-800'
                              : 'bg-[#07090e] text-slate-300 border-slate-800'
                          }`}>
                            HR: {patient.heartRate} bpm
                          </span>

                          {/* Blood Pressure */}
                          <span className={`px-2 py-0.5 rounded border ${
                            (patient.systolic && patient.systolic >= 180) || (patient.systolic && patient.systolic <= 85)
                              ? 'bg-red-950/70 text-red-300 border-red-800 font-bold'
                              : 'bg-[#07090e] text-slate-300 border-slate-800'
                          }`}>
                            BP: {patient.bloodPressure}
                          </span>

                          {/* SpO2 */}
                          <span className={`px-2 py-0.5 rounded border ${
                            patient.spo2 < 90
                              ? 'bg-red-950/70 text-red-300 border-red-800 font-bold'
                              : patient.spo2 < 94
                              ? 'bg-amber-950/70 text-amber-300 border-amber-800'
                              : 'bg-[#07090e] text-emerald-400 border-slate-800'
                          }`}>
                            SpO2: {patient.spo2}%
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono">
                          {patient.vitalStatus || 'Telemetry Active'}
                        </div>
                      </td>

                      {/* Wait Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-200">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{patient.waitTimeMinutes} mins</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Arr: {patient.arrivalTime || 'Recently'}
                        </div>
                      </td>

                      {/* Location & Bay */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-xs font-semibold text-slate-200">
                          {patient.assignedBay || 'Pending Bay'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {patient.attendingDoctor || 'Triage Resident'}
                        </div>
                      </td>

                      {/* Emergency Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Full AI Triage Report */}
                          <button
                            onClick={() => onSelectPatient(patient)}
                            title="View AI Clinical Rationale & Triage Report"
                            className="p-1.5 rounded-lg bg-[#07090e] hover:bg-cyan-950/60 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/50 transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Admit to ICU (if Critical) */}
                          {isCritical && (
                            <button
                              onClick={() => handleAdmitToIcu(patient)}
                              title="Admit directly to Intensive Care Unit"
                              className="px-2.5 py-1 text-xs font-bold font-mono bg-red-600 hover:bg-red-500 text-white rounded-lg transition shadow-md shadow-red-950"
                            >
                              Admit ICU
                            </button>
                          )}

                          {/* Discharge / Transfer */}
                          <button
                            onClick={() => handleDischargePatient(patient.id, patient.name)}
                            title="Discharge or Complete Patient Encounter"
                            className="p-1.5 rounded-lg bg-[#07090e] hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition"
                          >
                            <Check className="w-4 h-4 text-emerald-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
