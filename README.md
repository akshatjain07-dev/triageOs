# AegisCare AI — Hospital Triage and Resource Management System

A sleek, high-contrast dark-themed React web application built with Tailwind CSS, designed specifically for hospital administrators, emergency department directors, and clinical triage staff.

---

## 🌟 Key Features

### 1. 🛡️ Sleek Dark Mode & High-Contrast Design
- **Tailored for Emergency Centers**: Deep slate/zinc dark surfaces (`#070a13`, `#0b1120`, `#1e293b`) with luminous high-contrast accents (`cyan`, `emerald`, `amber`, `rose`).
- **Telemetry Typography**: Clean clinical layout with `Plus Jakarta Sans` for headers/controls and `JetBrains Mono` for vitals, ESI acuity levels, and timing metrics.
- **Visual Emergency Hierarchy**: Critical alarms, oxygen desaturations, and ICU bed shortages feature pulsing sirens, glowing borders, and immediate call-to-action badges.

---

### 2. 🚨 Command Dashboard View
- **Simulated Predictive Alert Banner**:
  - Automatically triggers when **ICU Bed Capacity drops below 15%** (e.g., 4 / 32 beds = 12.5% free).
  - Neural bed saturation countdown warning staff of projected 100% capacity in ~34 minutes.
  - Interactive controls to trigger EMS trauma diversion, activate Overflow Ward 4B (+4 beds), or simulate capacity levels.
- **Four Critical Metric Cards**:
  1. **ICU Beds Available**: Real-time count, total beds, occupancy bar, and surge threshold status.
  2. **Ventilators Active**: Active ventilator utilization, standby units, and respiratory support ratio.
  3. **General Ward Capacity**: Total inpatient capacity, bed occupancy percentage, and turnover rate.
  4. **Average Wait Time**: Department average wait with breakdown by Acuity (Critical: 0m immediate, Urgent: 19m, Routine: 44m) and AI speedup trend (-35%).
- **Active Patient Queue Data Table**:
  - **Automatic Acuity Sorting**: Patients are automatically ordered by color-coded triage severity:
    - 🔴 **Red: Critical** (ESI 1-2 / Resuscitation Priority)
    - 🟡 **Yellow: Urgent** (ESI 3 / Rapid Evaluation)
    - 🟢 **Green: Routine** (ESI 4-5 / Fast-Track Ambulatory)
  - Secondary sorting by wait duration (longest waiting patients elevated within each tier).
  - Searchable by Patient Name, MRN, symptom keywords, and attending doctor.
  - Quick filters: `All`, `Critical`, `Urgent`, and `Routine`.
  - Actions: One-click "Admit to ICU", "Discharge / Complete", and "View AI Clinical Dossier".

---

### 3. 📋 Patient Intake & Clinical AI Triage View
- **Clinical Data Entry Form**:
  - Inputs for:
    - **Patient Name**
    - **Age** and **Gender**
    - **Symptoms / Chief Complaint** (rich narrative textarea)
    - **Heart Rate (BPM)** with clinical norm indicators (60-100)
    - **Blood Pressure (mmHg)** (e.g. 185/115)
    - **Oxygen Level (SpO2 %)** with hypoxia warning thresholds
    - Body Temperature, Respiratory Rate, and Pain Scale (1-10)
  - **1-Click Clinical Case Presets**:
    - *Case 1: Acute STEMI / Cardiogenic Risk* (Critical Red)
    - *Case 2: Acute Respiratory Distress / Severe Asthma* (Urgent Yellow)
    - *Case 3: Low-Risk Outpatient / Ankle Sprain* (Routine Green)
  - **Prominent "Run AI Triage" Button**: Animated neural inference processing state.
- **Automated Acuity Score Results Card**:
  - **Idle / Placeholder State**: Modern HUD placeholder explaining the automated scoring model and previewing the Red / Yellow / Green triage matrix.
  - **Evaluated State**:
    - Prominent color-coded Acuity Score banner (**Red: Critical**, **Yellow: Urgent**, **Green: Routine**).
    - Emergency Severity Index (**ESI 1 - 5**).
    - Detected vital sign anomaly flags (Severe Hypoxia, Tachycardia, Hypertensive Urgency).
    - AI Clinical Rationale & Differential Diagnoses.
    - Immediate Recommended Care Pathway & Target Unit.
    - **"Assign to Active Patient Queue"**: Adds the newly triaged patient directly into the Command Dashboard queue, where it is automatically sorted into its priority position!

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Quick Launch
1. Open terminal in the project directory:
   ```bash
   cd "C:\Users\Akshat Jain\.gemini\antigravity\scratch\hospital-triage-ai"
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
   Or double-click `Start-HospitalTriage.bat`.
3. Open `http://localhost:5173` in your browser.

---

## 🛠️ Tech Stack
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS (Dark Mode, Custom Medical Theme & Keyframe Glow Animations)
- **Icons**: Lucide React
- **Fonts**: Plus Jakarta Sans, Inter, JetBrains Mono
