import React, { useState } from 'react';
import { 
  Sparkles, 
  Activity, 
  HeartPulse, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  UserCheck, 
  ArrowRight, 
  FileText, 
  Stethoscope, 
  Zap, 
  RefreshCw, 
  ChevronRight,
  PlusCircle,
  Database
} from 'lucide-react';
import { PRESET_CASES, evaluateClinicalTriage } from '../data/mockData';

export default function PatientIntake({ 
  onAddPatientToQueue, 
  onNavigateToDashboard 
}) {
  // Form input state
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: 'Male',
    symptoms: '',
    heartRate: '',
    bloodPressure: '',
    spo2: '',
    temperature: '98.6',
    respiratoryRate: '18',
    painLevel: '5'
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [triageResult, setTriageResult] = useState(null);
  const [showAddedSuccess, setShowAddedSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Handle generic input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationError) setValidationError('');
  };

  // Quick preset loader
  const handleLoadPreset = (preset) => {
    setFormData({
      patientName: preset.data.patientName,
      age: preset.data.age.toString(),
      gender: preset.data.gender || 'Male',
      symptoms: preset.data.symptoms,
      heartRate: preset.data.heartRate.toString(),
      bloodPressure: preset.data.bloodPressure,
      spo2: preset.data.spo2.toString(),
      temperature: (preset.data.temperature || 98.6).toString(),
      respiratoryRate: (preset.data.respiratoryRate || 18).toString(),
      painLevel: (preset.data.painLevel || 5).toString()
    });
    setTriageResult(null);
    setShowAddedSuccess(false);
    setValidationError('');
  };

  // Reset form
  const handleClearForm = () => {
    setFormData({
      patientName: '',
      age: '',
      gender: 'Male',
      symptoms: '',
      heartRate: '',
      bloodPressure: '',
      spo2: '',
      temperature: '98.6',
      respiratoryRate: '18',
      painLevel: '5'
    });
    setTriageResult(null);
    setShowAddedSuccess(false);
    setValidationError('');
  };

  // Handle "Run AI Triage"
  const handleRunAiTriage = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.patientName.trim()) {
      setValidationError('Please enter patient name.');
      return;
    }
    if (!formData.symptoms.trim()) {
      setValidationError('Please enter presenting symptoms or chief complaint.');
      return;
    }
    if (!formData.heartRate || !formData.bloodPressure || !formData.spo2) {
      setValidationError('Please provide vital signs (Heart Rate, Blood Pressure, and SpO2).');
      return;
    }

    setValidationError('');
    setIsAnalyzing(true);
    setShowAddedSuccess(false);

    // Simulate realistic AI neural inference latency (750ms)
    setTimeout(() => {
      const evaluation = evaluateClinicalTriage(formData);
      setTriageResult(evaluation);
      setIsAnalyzing(false);
    }, 750);
  };

  // Add triaged patient into Command Dashboard's Active Queue
  const handleAddToQueue = () => {
    if (!triageResult) return;

    const newPatient = {
      id: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: triageResult.patientName,
      age: parseInt(triageResult.age, 10) || 35,
      gender: triageResult.gender,
      symptoms: triageResult.symptoms,
      heartRate: parseFloat(triageResult.heartRate) || 80,
      bloodPressure: triageResult.bloodPressure,
      systolic: triageResult.systolic,
      diastolic: triageResult.diastolic,
      spo2: parseFloat(triageResult.spo2) || 98,
      triageLevel: triageResult.triageLevel,
      colorCode: triageResult.colorCode,
      esiScore: triageResult.esiScore,
      vitalStatus: triageResult.vitalStatus,
      waitTimeMinutes: 1,
      arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      assignedBay: triageResult.triageLevel === 'Critical' ? 'Resuscitation Unit' : triageResult.triageLevel === 'Urgent' ? 'Acute Bay' : 'Fast-Track Bay',
      attendingDoctor: triageResult.triageLevel === 'Critical' ? 'Dr. Sterling (ER Trauma)' : 'On-Duty Physician',
      aiRationale: triageResult.aiRationale,
      recommendedCarePathway: triageResult.recommendedCarePathway,
      status: 'Admitted & Queued'
    };

    onAddPatientToQueue(newPatient);
    setShowAddedSuccess(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Top Section: Presets & Guidance Header */}
      <div className="bg-dark-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg shadow-dark-950/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Stethoscope className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-100 tracking-tight">
                Clinical Patient Intake & Triage Assessment
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Record patient vital parameters and symptom narratives. The integrated neural model calculates emergency acuity, flags hemodynamic anomalies, and assigns immediate care pathways.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 font-mono">Sample Cases:</span>
            {PRESET_CASES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadPreset(preset)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 font-medium ${
                  idx === 0 
                    ? 'bg-red-950/50 text-red-300 border-red-800 hover:bg-red-900/60' 
                    : idx === 1 
                    ? 'bg-amber-950/50 text-amber-300 border-amber-800 hover:bg-amber-900/60' 
                    : 'bg-emerald-950/50 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                {preset.name.split('/')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="bg-red-950/70 border border-red-700 text-red-200 px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-2 animate-shake">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Main Clinical Data Entry Form */}
      <form onSubmit={handleRunAiTriage} className="bg-dark-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl shadow-dark-950/60 space-y-6">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            1. Patient Demographics & Presenting Vitals
          </h3>
          <button
            type="button"
            onClick={handleClearForm}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
          >
            <RefreshCw className="w-3 h-3" />
            Reset Fields
          </button>
        </div>

        {/* Row 1: Patient Name, Age, Gender */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Patient Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              placeholder="e.g. Jonathan Mercer"
              className="w-full bg-dark-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Age (Years) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="e.g. 54"
              min="1"
              max="120"
              className="w-full bg-dark-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Gender Identification
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full bg-dark-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none transition font-medium"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other / Non-Binary</option>
            </select>
          </div>
        </div>

        {/* Row 2: Symptoms Textarea */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Chief Complaint & Presenting Symptoms <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">Include onset time & severity</span>
          </div>
          <textarea
            name="symptoms"
            rows="3"
            value={formData.symptoms}
            onChange={handleChange}
            placeholder="Describe clinical observations, patient statements, pain radiation, duration, or onset (e.g. Acute severe substernal chest pressure radiating to left arm, cold diaphoresis, dyspnea for 30 minutes)..."
            className="w-full bg-dark-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition font-medium resize-y leading-relaxed"
            required
          />
        </div>

        {/* Row 3: Critical Vitals: Heart Rate, Blood Pressure, SpO2 (Explicitly Required) */}
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mb-3 flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-rose-500" />
            Physiological Vital Signs Telemetry
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Heart Rate */}
            <div className="bg-dark-950/70 p-4 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  Heart Rate (BPM) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Norm: 60-100</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  name="heartRate"
                  value={formData.heartRate}
                  onChange={handleChange}
                  placeholder="e.g. 128"
                  min="20"
                  max="260"
                  className="w-full bg-dark-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-base font-mono font-bold text-slate-100 placeholder-slate-600 focus:outline-none transition"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                  bpm
                </span>
              </div>
            </div>

            {/* Blood Pressure */}
            <div className="bg-dark-950/70 p-4 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  Blood Pressure (BP) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Systolic / Diastolic</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={handleChange}
                  placeholder="e.g. 185/115"
                  className="w-full bg-dark-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-base font-mono font-bold text-slate-100 placeholder-slate-600 focus:outline-none transition"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                  mmHg
                </span>
              </div>
            </div>

            {/* Oxygen Level (SpO2) */}
            <div className="bg-dark-950/70 p-4 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  Oxygen Level (SpO2) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Norm: ≥ 95%</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  name="spo2"
                  value={formData.spo2}
                  onChange={handleChange}
                  placeholder="e.g. 88"
                  min="40"
                  max="100"
                  className="w-full bg-dark-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-base font-mono font-bold text-slate-100 placeholder-slate-600 focus:outline-none transition"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                  %
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Supplementary Vitals: Temp, Resp Rate, Pain */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Body Temperature (°F)
            </label>
            <input
              type="text"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              placeholder="98.6"
              className="w-full bg-dark-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Respiratory Rate (/min)
            </label>
            <input
              type="number"
              name="respiratoryRate"
              value={formData.respiratoryRate}
              onChange={handleChange}
              placeholder="18"
              className="w-full bg-dark-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Pain Scale (1 - 10)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                name="painLevel"
                min="0"
                max="10"
                value={formData.painLevel}
                onChange={handleChange}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-cyan-400 w-6 text-center">
                {formData.painLevel}
              </span>
            </div>
          </div>
        </div>

        {/* PROMINENT "RUN AI TRIAGE" SUBMIT BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isAnalyzing}
            className={`w-full py-4 rounded-xl text-base font-mono font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl relative overflow-hidden group ${
              isAnalyzing
                ? 'bg-slate-800 text-slate-400 cursor-wait border border-slate-700'
                : 'bg-[#00f2fe] hover:bg-cyan-300 active:scale-[0.99] text-slate-950 shadow-[0_0_30px_rgba(0,242,254,0.7)] hover:shadow-[0_0_45px_rgba(0,242,254,0.95)] border border-cyan-200'
            }`}
          >
            {/* Ambient shine effect */}
            <span className="absolute inset-0 w-1/2 h-full bg-white/25 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000" />
            
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
                <span className="text-slate-200 font-mono">Running Neural Acuity Model & Vital Inference...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 text-slate-950 fill-current animate-pulse" />
                <span className="tracking-wider">Run AI Triage</span>
                <ChevronRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* ======================================================== */}
      {/* AUTOMATED ACUITY SCORE RESULTS CARD (PLACEHOLDER / ACTIVE)*/}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            2. AI Triage Assessment & Automated Acuity Score
          </h3>
          {triageResult && (
            <span className="text-xs font-mono text-slate-400">
              Evaluated at {triageResult.timestamp} • Model Confidence: {triageResult.confidenceScore}
            </span>
          )}
        </div>

        {!triageResult ? (
          /* ======================================================== */
          /* PLACEHOLDER RESULTS CARD (Before AI Triage Run)           */
          /* ======================================================== */
          <div className="rounded-2xl border-2 border-dashed border-slate-800 bg-dark-900/60 p-10 text-center relative overflow-hidden">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center mx-auto text-slate-400 shadow-inner">
                <HeartPulse className="w-8 h-8 text-cyan-500 animate-pulse" />
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-200">
                  Awaiting Clinical Triage Submission
                </h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Complete the patient demographic fields and telemetry vitals above, then click <strong className="text-cyan-400">"Run AI Triage"</strong>. 
                  The neural inference engine will automatically generate a color-coded acuity score according to ESI protocols.
                </p>
              </div>

              {/* Acuity Level Legend Preview */}
              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-3 text-left">
                <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-900/40">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-400">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Red: Critical
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Immediate Resuscitation</div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-900/40">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Yellow: Urgent
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Emergent Evaluation</div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-900/40">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Green: Routine
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Fast-Track Ambulatory</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* ACTIVE EVALUATED RESULTS CARD (Color-Coded Acuity Score)  */
          /* ======================================================== */
          <div className={`rounded-2xl border-2 p-6 shadow-2xl transition-all duration-300 relative overflow-hidden ${
            triageResult.colorCode === 'red'
              ? 'bg-gradient-to-br from-red-950/90 via-dark-900 to-dark-900 border-red-600 shadow-red-950/60 animate-glow-critical'
              : triageResult.colorCode === 'yellow'
              ? 'bg-gradient-to-br from-amber-950/80 via-dark-900 to-dark-900 border-amber-500 shadow-amber-950/50 animate-glow-urgent'
              : 'bg-gradient-to-br from-emerald-950/80 via-dark-900 to-dark-900 border-emerald-500 shadow-emerald-950/40'
          }`}>
            {/* Header: Acuity Score Indicator */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 border-slate-800">
              <div className="flex items-start gap-4">
                <div className={`p-4 rounded-2xl shrink-0 ${
                  triageResult.colorCode === 'red'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900'
                    : triageResult.colorCode === 'yellow'
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-900'
                    : 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-900'
                }`}>
                  {triageResult.colorCode === 'red' ? (
                    <ShieldAlert className="w-8 h-8 animate-pulse" />
                  ) : triageResult.colorCode === 'yellow' ? (
                    <AlertTriangle className="w-8 h-8" />
                  ) : (
                    <CheckCircle2 className="w-8 h-8" />
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded tracking-wider ${
                      triageResult.colorCode === 'red'
                        ? 'bg-red-500 text-slate-950'
                        : triageResult.colorCode === 'yellow'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-emerald-400 text-slate-950'
                    }`}>
                      {triageResult.triageLevel.toUpperCase()} SEVERITY
                    </span>

                    <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
                      {triageResult.esiScore}
                    </span>

                    <span className="text-xs font-mono text-slate-400">
                      Target Phys Time: <strong className="text-slate-200">{triageResult.timeToPhysician}</strong>
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-100 mt-1.5 tracking-tight font-sans">
                    {triageResult.badgeText}
                  </h3>

                  <p className="text-xs text-slate-300 mt-1 font-mono">
                    Routing Recommendation: <span className="font-bold text-cyan-400">{triageResult.targetUnit}</span>
                  </p>
                </div>
              </div>

              {/* Acuity Color Meter Indicator */}
              <div className="flex flex-col items-end gap-1.5 font-mono text-xs">
                <span className="text-slate-400 text-[11px] uppercase tracking-wider">Acuity Calibration</span>
                <div className="flex items-center gap-1.5 p-1.5 bg-dark-950 rounded-xl border border-slate-800">
                  <span className={`px-2 py-0.5 rounded font-bold transition ${
                    triageResult.colorCode === 'red' ? 'bg-red-600 text-white' : 'text-slate-500'
                  }`}>
                    RED
                  </span>
                  <span className={`px-2 py-0.5 rounded font-bold transition ${
                    triageResult.colorCode === 'yellow' ? 'bg-amber-500 text-slate-950' : 'text-slate-500'
                  }`}>
                    YELLOW
                  </span>
                  <span className={`px-2 py-0.5 rounded font-bold transition ${
                    triageResult.colorCode === 'green' ? 'bg-emerald-500 text-slate-950' : 'text-slate-500'
                  }`}>
                    GREEN
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Section: Vital Anomalies & Symptoms Breakdown */}
            <div className="py-5 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-800">
              {/* Left: Vital Sign Readings & Flags */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2.5">
                  Telemetry & Anomaly Flags
                </div>
                <div className="space-y-2">
                  {triageResult.anomalies.map((ano, idx) => (
                    <div 
                      key={idx}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-medium font-mono ${
                        ano.type === 'danger'
                          ? 'bg-red-950/60 border-red-800 text-red-200'
                          : ano.type === 'warning'
                          ? 'bg-amber-950/60 border-amber-800 text-amber-200'
                          : 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
                      }`}
                    >
                      {ano.type === 'danger' ? (
                        <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                      ) : ano.type === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      <span>{ano.text}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs font-mono text-slate-400 bg-dark-950/80 p-2.5 rounded-xl border border-slate-800">
                  <span>HR: <strong className="text-slate-200">{triageResult.heartRate} bpm</strong></span>
                  <span>•</span>
                  <span>BP: <strong className="text-slate-200">{triageResult.bloodPressure}</strong></span>
                  <span>•</span>
                  <span>SpO2: <strong className="text-slate-200">{triageResult.spo2}%</strong></span>
                </div>
              </div>

              {/* Right: AI Clinical Rationale & Pathways */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2.5">
                  AI Clinical Reasoning & Protocol
                </div>
                <div className="bg-dark-950/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <p className="font-normal">{triageResult.aiRationale}</p>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/50 text-xs text-cyan-200">
                  <strong className="font-bold text-cyan-300 block mb-0.5 font-mono">Immediate Pathway:</strong>
                  <span>{triageResult.recommendedCarePathway}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Assign to Active Queue or Jump to Dashboard */}
            <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                Patient: <strong className="text-slate-200">{triageResult.patientName}</strong> ({triageResult.age}y, {triageResult.gender})
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {showAddedSuccess ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-3 py-2 rounded-xl border border-emerald-800">
                      <CheckCircle2 className="w-4 h-4" />
                      Added to Active Queue
                    </span>
                    <button
                      onClick={onNavigateToDashboard}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-slate-950 transition flex items-center gap-1.5 shadow-md shadow-cyan-950"
                    >
                      View on Dashboard
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAddToQueue}
                    className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                      triageResult.colorCode === 'red'
                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-950'
                        : triageResult.colorCode === 'yellow'
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-950'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-950'
                    }`}
                  >
                    <PlusCircle className="w-4 h-4" />
                    Assign to Active Patient Queue
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
