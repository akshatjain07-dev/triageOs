import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CommandDashboard from './components/CommandDashboard';
import PatientIntake from './components/PatientIntake';
import PatientDetailModal from './components/PatientDetailModal';
import { INITIAL_RESOURCES, INITIAL_PATIENTS } from './data/mockData';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'intake'
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [patientQueue, setPatientQueue] = useState(INITIAL_PATIENTS);
  const [selectedPatientForDetail, setSelectedPatientForDetail] = useState(null);

  // Check if ICU capacity is below 15% (e.g. 4 / 32 = 12.5%)
  const isIcuAlert = (resources.icu.available / resources.icu.total) < 0.15;

  // Add new triaged patient to queue
  const handleAddPatientToQueue = (newPatient) => {
    setPatientQueue(prev => [newPatient, ...prev]);
  };

  // Reset demo data to initial state
  const handleResetData = () => {
    setResources(INITIAL_RESOURCES);
    setPatientQueue(INITIAL_PATIENTS);
  };

  // Direct admit to ICU from modal
  const handleAdmitToIcu = (patient) => {
    if (resources.icu.available > 0) {
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
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 flex font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        patientQueue={patientQueue}
        resources={resources}
        isIcuAlert={isIcuAlert}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0a0c10] overflow-y-auto">
        {/* Header Bar */}
        <Header
          currentView={currentView}
          resources={resources}
          setResources={setResources}
          isIcuAlert={isIcuAlert}
          onResetData={handleResetData}
        />

        {/* Active View Routing */}
        <main className="flex-1 pb-12">
          {currentView === 'dashboard' ? (
            <CommandDashboard
              resources={resources}
              setResources={setResources}
              patientQueue={patientQueue}
              setPatientQueue={setPatientQueue}
              onSelectPatient={setSelectedPatientForDetail}
              onNavigateToIntake={() => setCurrentView('intake')}
              onAddPatientToQueue={handleAddPatientToQueue}
            />
          ) : (
            <PatientIntake
              onAddPatientToQueue={handleAddPatientToQueue}
              onNavigateToDashboard={() => setCurrentView('dashboard')}
            />
          )}
        </main>
      </div>

      {/* Patient Detail Dossier Modal */}
      {selectedPatientForDetail && (
        <PatientDetailModal
          patient={selectedPatientForDetail}
          onClose={() => setSelectedPatientForDetail(null)}
          onAdmitIcu={handleAdmitToIcu}
        />
      )}
    </div>
  );
}
