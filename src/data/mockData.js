// Mock Data and AI Clinical Triage Inference Engine

export const INITIAL_RESOURCES = {
  icu: {
    total: 32,
    available: 4, // 4/32 = 12.5% (triggers < 15% critical alert!)
    occupied: 28,
  },
  ventilators: {
    total: 24,
    active: 19,
    standby: 5,
  },
  generalWard: {
    total: 200,
    occupied: 178,
    available: 22,
  },
  avgAiTriageTime: {
    value: '1.2s',
    unit: 'sec',
    change: '-38% vs Manual',
    throughput: '142 ops/hr',
    confidence: '99.4%',
    subtext: 'Neural ESI Classifier'
  },
  waitTime: {
    average: '18m',
    critical: '0m (Immediate)',
    urgent: '19m',
    routine: '44m',
  }
};

export const INITIAL_PATIENTS = [
  {
    id: 'PT-9042',
    name: 'Marcus Vance',
    age: 58,
    gender: 'Male',
    symptoms: 'Crushing retrosternal chest pain radiating to left jaw, diaphoresis, acute shortness of breath',
    heartRate: 134,
    bloodPressure: '188/112',
    systolic: 188,
    diastolic: 112,
    spo2: 87,
    triageLevel: 'Critical', // Red
    colorCode: 'red',
    esiScore: 'ESI 1',
    vitalStatus: 'Severe Hypoxia & Tachycardia',
    waitTimeMinutes: 2,
    arrivalTime: '10:48 AM',
    assignedBay: 'Trauma Bay 1',
    attendingDoctor: 'Dr. Evelyn Reed (ICU/ER)',
    aiRationale: 'Vital signs indicate acute myocardial infarction with severe oxygen desaturation and hypertensive urgency. Immediate cath lab activation and high-flow oxygen protocol required.',
    recommendedCarePathway: 'Stat 12-Lead ECG • Troponin Panel • Direct Cath Lab Transfer',
    status: 'In Resuscitation',
    priorityRank: 1
  },
  {
    id: 'PT-9038',
    name: 'Sophia Chen',
    age: 26,
    gender: 'Female',
    symptoms: 'Acute anaphylaxis following peanut ingestion, stridor, facial angioedema, respiratory distress',
    heartRate: 142,
    bloodPressure: '82/48',
    systolic: 82,
    diastolic: 48,
    spo2: 89,
    triageLevel: 'Critical', // Red
    colorCode: 'red',
    esiScore: 'ESI 1',
    vitalStatus: 'Severe Hypotension & Airway Compromise',
    waitTimeMinutes: 5,
    arrivalTime: '10:45 AM',
    assignedBay: 'Resus 2',
    attendingDoctor: 'Dr. Michael Hayes',
    aiRationale: 'Anaphylactic shock with severe hypotension and compromised airway. Immediate IM epinephrine 0.5mg and airway preparation needed.',
    recommendedCarePathway: 'IM Epinephrine 0.5mg • IV Fluid Resuscitation • Airway Cart Standby',
    status: 'Triaged - Active Resus',
    priorityRank: 2
  },
  {
    id: 'PT-9031',
    name: 'Arthur Pendelton',
    age: 72,
    gender: 'Male',
    symptoms: 'Sudden onset right-sided hemiparesis, expressive aphasia, facial droop (last seen normal 45 min ago)',
    heartRate: 98,
    bloodPressure: '178/104',
    systolic: 178,
    diastolic: 104,
    spo2: 95,
    triageLevel: 'Critical', // Red
    colorCode: 'red',
    esiScore: 'ESI 2',
    vitalStatus: 'Stroke Code Protocol / Hypertensive',
    waitTimeMinutes: 8,
    arrivalTime: '10:42 AM',
    assignedBay: 'Neuro Bay 3',
    attendingDoctor: 'Dr. Sarah Lin (Neurology)',
    aiRationale: 'Acute ischemic stroke window (<3.5 hrs). Rapid CT Angiography required for emergent thrombolytic (tPA) or endovascular thrombectomy evaluation.',
    recommendedCarePathway: 'Emergent Non-Contrast Head CT • Neuro Stat Consult • tPA Checklist',
    status: 'Under CT Scan',
    priorityRank: 3
  },
  {
    id: 'PT-9025',
    name: 'Elena Rostova',
    age: 44,
    gender: 'Female',
    symptoms: 'Severe sharp right lower quadrant abdominal pain with rebound tenderness, vomiting, fever 102.4°F',
    heartRate: 114,
    bloodPressure: '136/88',
    systolic: 136,
    diastolic: 88,
    spo2: 97,
    triageLevel: 'Urgent', // Yellow
    colorCode: 'yellow',
    esiScore: 'ESI 3',
    vitalStatus: 'Febrile Tachycardia',
    waitTimeMinutes: 18,
    arrivalTime: '10:32 AM',
    assignedBay: 'Acute Bay 5',
    attendingDoctor: 'Dr. Alan Morales',
    aiRationale: 'Signs consistent with acute appendicitis vs ovarian torsion. Stable SpO2 but requires abdominal ultrasound/CT and pain management before surgical consult.',
    recommendedCarePathway: 'IV Access • Abdominal/Pelvic CT with Contrast • NPO & Surgical Consult',
    status: 'Waiting on Lab Results',
    priorityRank: 4
  },
  {
    id: 'PT-9019',
    name: 'David K. Miller',
    age: 33,
    gender: 'Male',
    symptoms: 'Moderate asthma flare unresponsive to home albuterol inhaler, expiratory wheezing, persistent cough',
    heartRate: 108,
    bloodPressure: '132/84',
    systolic: 132,
    diastolic: 84,
    spo2: 92,
    triageLevel: 'Urgent', // Yellow
    colorCode: 'yellow',
    esiScore: 'ESI 3',
    vitalStatus: 'Moderate Hypoxemia',
    waitTimeMinutes: 24,
    arrivalTime: '10:26 AM',
    assignedBay: 'Respiratory Bay 2',
    attendingDoctor: 'Dr. Chloe Brooks',
    aiRationale: 'Asthma exacerbation with mild to moderate desaturation (SpO2 92%). Needs continuous nebulization (duoneb) and systemic corticosteroids.',
    recommendedCarePathway: 'Nebulized Albuterol/Ipratropium • Oral Dexamethasone 10mg • Re-evaluate SpO2 in 20m',
    status: 'Receiving Nebulizer',
    priorityRank: 5
  },
  {
    id: 'PT-9012',
    name: 'Beatrice Gomez',
    age: 61,
    gender: 'Female',
    symptoms: 'Deep laceration to left forearm after domestic kitchen accident, controlled bleeding, mild pain',
    heartRate: 76,
    bloodPressure: '124/78',
    systolic: 124,
    diastolic: 78,
    spo2: 99,
    triageLevel: 'Routine', // Green
    colorCode: 'green',
    esiScore: 'ESI 4',
    vitalStatus: 'Normotensive / Hemodynamically Stable',
    waitTimeMinutes: 38,
    arrivalTime: '10:12 AM',
    assignedBay: 'Fast Track 2',
    attendingDoctor: 'PA Robert Taylor',
    aiRationale: 'Clean margins with controlled hemostasis and intact neurovascular exam in distal extremity. Suitable for primary closure under local anesthesia.',
    recommendedCarePathway: 'Wound Irrigation • Simple Interrupted Sutures • Tetanus Booster',
    status: 'In Minor Procedure Room',
    priorityRank: 6
  },
  {
    id: 'PT-9008',
    name: 'Jordan Lee',
    age: 19,
    gender: 'Other',
    symptoms: 'Mild right ankle inversion sprain during sports, weight-bearing with mild limp, minimal edema',
    heartRate: 72,
    bloodPressure: '118/74',
    systolic: 118,
    diastolic: 74,
    spo2: 99,
    triageLevel: 'Routine', // Green
    colorCode: 'green',
    esiScore: 'ESI 5',
    vitalStatus: 'Normal Range',
    waitTimeMinutes: 52,
    arrivalTime: '09:58 AM',
    assignedBay: 'Waiting Area - Fast Track',
    attendingDoctor: 'Staff Nurse Jessica',
    aiRationale: 'Ottawa Ankle Rules negative for malleolar tenderness. Low likelihood of fracture. Fast track management with compression bandage and cryotherapy.',
    recommendedCarePathway: 'Ankle X-Ray 2 Views • Elastic Compression Wrap • NSAIDs Discharge Rx',
    status: 'Pending Radiology',
    priorityRank: 7
  }
];

export const PRESET_CASES = [
  {
    name: 'Acute STEMI / Cardiogenic Risk',
    data: {
      patientName: 'Devon Vance',
      age: 62,
      gender: 'Male',
      symptoms: 'Severe substernal squeezing chest pressure, cold clammy skin, radiation to left shoulder and jaw, dizziness',
      heartRate: 128,
      bloodPressure: '185/115',
      spo2: 88,
      temperature: 98.4,
      respiratoryRate: 26,
      painLevel: 9
    }
  },
  {
    name: 'Acute Respiratory Distress / Severe Asthma',
    data: {
      patientName: 'Aaliyah Robinson',
      age: 28,
      gender: 'Female',
      symptoms: 'Severe dyspnea, unable to speak in full sentences, intercostal retractions, cyanotic nail beds',
      heartRate: 122,
      bloodPressure: '142/92',
      spo2: 91,
      temperature: 99.1,
      respiratoryRate: 28,
      painLevel: 6
    }
  },
  {
    name: 'Low-Risk Outpatient / Ankle Sprain',
    data: {
      patientName: 'Lucas Campbell',
      age: 24,
      gender: 'Male',
      symptoms: 'Minor twisted ankle during basketball, minimal swelling, able to walk slowly, no bony deformity',
      heartRate: 68,
      bloodPressure: '120/80',
      spo2: 99,
      temperature: 98.6,
      respiratoryRate: 14,
      painLevel: 3
    }
  }
];

// AI Triage Acuity Assessment Engine (Rule-based Clinical Algorithm conforming to ESI guidelines)
export function evaluateClinicalTriage(formData) {
  const {
    patientName,
    age,
    gender = 'Not specified',
    symptoms = '',
    heartRate,
    bloodPressure,
    spo2,
    temperature = 98.6,
    respiratoryRate = 18,
    painLevel = 4
  } = formData;

  const hr = parseFloat(heartRate) || 80;
  const o2 = parseFloat(spo2) || 98;
  const pain = parseInt(painLevel) || 3;
  const resp = parseFloat(respiratoryRate) || 18;

  // Parse blood pressure
  let systolic = 120;
  let diastolic = 80;
  if (typeof bloodPressure === 'string' && bloodPressure.includes('/')) {
    const parts = bloodPressure.split('/');
    systolic = parseFloat(parts[0]) || 120;
    diastolic = parseFloat(parts[1]) || 80;
  } else if (!isNaN(bloodPressure)) {
    systolic = parseFloat(bloodPressure);
  }

  const symLower = symptoms.toLowerCase();

  // Critical symptom keywords
  const criticalKeywords = [
    'chest pain', 'cardiac', 'stemi', 'unresponsive', 'anaphylaxis', 'stridor',
    'stroke', 'hemiparesis', 'cyanosis', 'severe dyspnea', 'unconscious',
    'massive bleeding', 'seizure', 'cardiac arrest', 'crushing', 'coma'
  ];

  // Urgent symptom keywords
  const urgentKeywords = [
    'shortness of breath', 'asthma', 'severe pain', 'appendicitis', 'fracture',
    'high fever', 'vomiting', 'dehydration', 'wheezing', 'abdominal pain',
    'altered mental', 'burn', 'trauma', 'kidney stone', 'laceration bleeding'
  ];

  const hasCriticalKeyword = criticalKeywords.some(kw => symLower.includes(kw));
  const hasUrgentKeyword = urgentKeywords.some(kw => symLower.includes(kw));

  // Determine anomalies
  const anomalies = [];
  if (o2 < 90) anomalies.push({ type: 'danger', text: `Severe Hypoxia (SpO2 ${o2}%)` });
  else if (o2 < 94) anomalies.push({ type: 'warning', text: `Borderline Hypoxemia (SpO2 ${o2}%)` });

  if (hr > 125) anomalies.push({ type: 'danger', text: `Severe Tachycardia (HR ${hr} BPM)` });
  else if (hr > 100) anomalies.push({ type: 'warning', text: `Elevated Heart Rate (HR ${hr} BPM)` });
  else if (hr < 50) anomalies.push({ type: 'danger', text: `Severe Bradycardia (HR ${hr} BPM)` });

  if (systolic >= 180 || diastolic >= 110) {
    anomalies.push({ type: 'danger', text: `Hypertensive Crisis (${systolic}/${diastolic} mmHg)` });
  } else if (systolic <= 85 || diastolic <= 50) {
    anomalies.push({ type: 'danger', text: `Severe Hypotension / Shock (${systolic}/${diastolic} mmHg)` });
  } else if (systolic >= 140 || diastolic >= 90) {
    anomalies.push({ type: 'warning', text: `Stage 2 Hypertension (${systolic}/${diastolic} mmHg)` });
  }

  if (resp > 26) anomalies.push({ type: 'danger', text: `Tachypnea (Resp Rate ${resp}/min)` });
  if (pain >= 8) anomalies.push({ type: 'warning', text: `Severe Acute Pain (Score ${pain}/10)` });

  // Triage scoring logic
  let level = 'Routine';
  let esiScore = 'ESI 4';
  let color = 'green';
  let badgeText = 'Routine / Fast-Track';
  let timeToPhysician = '< 60 mins';
  let targetUnit = 'General Ward / Ambulatory Care';
  let rationale = '';
  let carePathway = '';

  // Critical condition checks
  if (
    o2 < 90 ||
    hr > 130 ||
    hr < 45 ||
    systolic > 185 ||
    systolic < 85 ||
    (hasCriticalKeyword && (o2 <= 93 || hr >= 115 || systolic >= 160)) ||
    (hasCriticalKeyword && pain >= 8)
  ) {
    level = 'Critical';
    esiScore = 'ESI 1';
    color = 'red';
    badgeText = 'CRITICAL — Resuscitation Priority';
    timeToPhysician = 'Immediate (0 mins)';
    targetUnit = 'ICU / Trauma Resuscitation Bay';
    rationale = `Patient presents with severe physiological decompensation. Vital anomalies (${anomalies.map(a => a.text).join(', ')}) combined with presenting symptoms indicate acute life threat requiring immediate physician intervention and hemodynamic stabilization.`;
    carePathway = 'Stat IV Access x2 • Continuous 12-Lead Cardiac Telemetry • Arterial Blood Gas • ICU Bed Reservation';
  } else if (
    o2 <= 94 ||
    hr > 105 ||
    systolic >= 150 ||
    systolic <= 95 ||
    hasUrgentKeyword ||
    pain >= 7 ||
    hasCriticalKeyword
  ) {
    level = 'Urgent';
    esiScore = 'ESI 2-3';
    color = 'yellow';
    badgeText = 'URGENT — Rapid Evaluation';
    timeToPhysician = '< 20 mins';
    targetUnit = 'Stepdown / Acute Care Monitoring';
    rationale = `Patient exhibits abnormal vitals and moderate-to-severe symptoms. Stable airway present but high risk of rapid clinical deterioration without prompt diagnostics and targeted therapy.`;
    carePathway = 'Focused Diagnostic Workup • IV Saline Lock • Targeted Analgesia / Nebulization • Repeat Vitals Q15M';
  } else {
    level = 'Routine';
    esiScore = 'ESI 4-5';
    color = 'green';
    badgeText = 'ROUTINE — Standard Care Pathway';
    timeToPhysician = '< 60 mins';
    targetUnit = 'Fast-Track / Outpatient Ambulatory';
    rationale = `Vital signs are within acceptable baseline parameters. Symptoms are non-life threatening with low risk of acute physiological decompensation. Suitable for standard triage queue.`;
    carePathway = 'Symptom-Directed Evaluation • Basic Point-of-Care Testing • Discharge Education / Prescription';
  }

  return {
    patientName: patientName || 'Anonymous Patient',
    age: age || 35,
    gender,
    symptoms: symptoms || 'No symptoms specified',
    heartRate: hr,
    bloodPressure: `${systolic}/${diastolic}`,
    systolic,
    diastolic,
    spo2: o2,
    triageLevel: level,
    colorCode: color,
    esiScore,
    badgeText,
    timeToPhysician,
    targetUnit,
    anomalies: anomalies.length > 0 ? anomalies : [{ type: 'success', text: 'All recorded vitals within normal parameters' }],
    vitalStatus: anomalies.length > 0 ? anomalies[0].text : 'Stable Vital Signs',
    aiRationale: rationale,
    recommendedCarePathway: carePathway,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    confidenceScore: level === 'Critical' ? '98.4%' : level === 'Urgent' ? '94.8%' : '96.2%'
  };
}
