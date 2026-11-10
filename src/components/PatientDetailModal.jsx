import React from 'react';
import { 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Clock, 
  Bed, 
  User, 
  FileText, 
  HeartPulse, 
  Check
} from 'lucide-react';

export default function PatientDetailModal({ patient, onClose, onAdmitIcu }) {
  if (!patient) return null;

  const isCritical = patient.triageLevel === 'Critical';
  const isUrgent = patient.triageLevel === 'Urgent';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#0d111a] border border-slate-800/90 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative shadow-black/80">
        {/* Modal Header */}
        <div className={`p-5 border-b border-slate-800/80 flex items-center justify-between ${
          isCritical ? 'bg-red-950/40 border-b-red-900/60' : isUrgent ? 'bg-amber-950/30' : 'bg-[#0a0c10]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              isCritical ? 'bg-red-500/20 text-red-400' : isUrgent ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {isCritical ? <ShieldAlert className="w-6 h-6" /> : isUrgent ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-100">{patient.name}</h3>
                <span className={`text-[11px] font-extrabold uppercase px-2 py-0.5 rounded ${
                  isCritical ? 'bg-red-500 text-slate-950' : isUrgent ? 'bg-amber-400 text-slate-950' : 'bg-emerald-400 text-slate-950'
                }`}>
                  {patient.triageLevel} ({patient.esiScore})
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                MRN: {patient.id} • Age: {patient.age}y • Gender: {patient.gender || 'Not specified'} • Arrived: {patient.arrivalTime || 'Today'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Vitals Telemetry Grid */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-cyan-400" />
              Recorded Vital Parameters
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-dark-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Heart Rate</span>
                <span className={`text-lg font-bold font-mono ${
                  patient.heartRate > 120 || patient.heartRate < 50 ? 'text-red-400' : 'text-slate-100'
                }`}>
                  {patient.heartRate} <span className="text-xs text-slate-400 font-normal">BPM</span>
                </span>
              </div>

              <div className="bg-dark-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Blood Pressure</span>
                <span className="text-lg font-bold font-mono text-slate-100">
                  {patient.bloodPressure} <span className="text-xs text-slate-400 font-normal">mmHg</span>
                </span>
              </div>

              <div className="bg-dark-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Oxygen Saturation</span>
                <span className={`text-lg font-bold font-mono ${
                  patient.spo2 < 92 ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {patient.spo2}% <span className="text-xs text-slate-400 font-normal">SpO2</span>
                </span>
              </div>
            </div>
          </div>

          {/* Chief Complaint */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-1.5">
              Symptoms & Chief Complaint
            </div>
            <div className="bg-dark-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed">
              {patient.symptoms}
            </div>
          </div>

          {/* AI Clinical Reasoning */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-1.5 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              AI Clinical Rationale & Triage Differential
            </div>
            <div className="bg-dark-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
              {patient.aiRationale || 'Automated vital and symptomatology cross-check confirmed acuity classification.'}
            </div>
          </div>

          {/* Immediate Care Pathway */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-1.5">
              Target Care Protocol & Location
            </div>
            <div className="bg-cyan-950/30 border border-cyan-800/40 p-3.5 rounded-xl text-xs text-cyan-200">
              <span className="font-bold text-cyan-300 block mb-1">
                Assigned Unit: {patient.assignedBay || 'Pending'} • Attending: {patient.attendingDoctor || 'ER Staff'}
              </span>
              <span>{patient.recommendedCarePathway || 'Immediate physician evaluation and stat orders.'}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-dark-950/60 flex items-center justify-between">
          <div className="text-xs font-mono text-slate-400">
            Wait Duration: <strong className="text-slate-200">{patient.waitTimeMinutes} mins</strong>
          </div>

          <div className="flex items-center gap-2">
            {isCritical && (
              <button
                onClick={() => {
                  onAdmitIcu(patient);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition flex items-center gap-1.5 shadow-md shadow-red-950"
              >
                <Bed className="w-4 h-4" />
                Admit to ICU
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
