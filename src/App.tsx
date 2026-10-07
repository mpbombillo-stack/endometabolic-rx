/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenTab, PatientProfile, MedicalProfessional, MatrixNodeDetail, PatientEvolution, PatientLabs } from './types';
import { getStoredPatients, savePatients, getStoredActivePatientId, saveActivePatientId } from './data/patientsRegistry';
import { INITIAL_PROFESSIONALS } from './data/professionalsData';
import { calculateSurrogates } from './utils/metabolicCalculators';
import { generateClinicalUsername, isMustChangePassword } from './utils/authUtils';
import { fetchProfessionalsFromCloud, fetchPatientsFromCloud, savePatientToCloud, saveProfessionalToCloud } from './services/cloudSyncService';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { FhirModal } from './components/FhirModal';
import { InspectorModal } from './components/InspectorModal';
import { NewPatientModal } from './components/NewPatientModal';
import { NewEvolutionModal } from './components/NewEvolutionModal';
import { Toast } from './components/Toast';

import { PatientsDashboardScreen } from './screens/PatientsDashboardScreen';
import { ProfessionalsConfigScreen } from './screens/ProfessionalsConfigScreen';
import { AtmScreen } from './screens/AtmScreen';
import { SurrogateIndicesScreen } from './screens/SurrogateIndicesScreen';
import { KraftOgttScreen } from './screens/KraftOgttScreen';
import { CdssScreen } from './screens/CdssScreen';
import { TherapeuticsScreen } from './screens/TherapeuticsScreen';
import { MonitoringFhirScreen } from './screens/MonitoringFhirScreen';

import { LoginScreen } from './screens/LoginScreen';
import { ChangePasswordModal } from './components/ChangePasswordModal';

const PROFESSIONALS_STORAGE_KEY = 'endometabolic_rx_professionals_v1';
const ACTIVE_DOCTOR_ID_KEY = 'endometabolic_rx_active_doctor_id';
const AUTH_SESSION_KEY = 'endometabolic_rx_session_v1';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ScreenTab>('patients-dashboard');
  const [clinicalMode, setClinicalMode] = useState<boolean>(true);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<MedicalProfessional | null>(() => {
    try {
      const storedSession = localStorage.getItem(AUTH_SESSION_KEY) || sessionStorage.getItem(AUTH_SESSION_KEY);
      if (storedSession) {
        return JSON.parse(storedSession);
      }
    } catch (e) {}
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const storedSession = localStorage.getItem(AUTH_SESSION_KEY) || sessionStorage.getItem(AUTH_SESSION_KEY);
      return !!storedSession;
    } catch (e) {
      return false;
    }
  });

  // Patients Management State
  const [patients, setPatients] = useState<PatientProfile[]>(() => getStoredPatients());
  const [activePatientId, setActivePatientId] = useState<string>(() => getStoredActivePatientId());

  // Professionals Management State
  const [professionals, setProfessionals] = useState<MedicalProfessional[]>(() => {
    try {
      const stored = localStorage.getItem(PROFESSIONALS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_PROFESSIONALS;
  });

  const [activeDoctorId, setActiveDoctorId] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(ACTIVE_DOCTOR_ID_KEY);
      if (stored) return stored;
    } catch (e) {}
    return INITIAL_PROFESSIONALS[0].id;
  });

  // Modal States
  const [isFhirModalOpen, setIsFhirModalOpen] = useState<boolean>(false);
  const [inspectorNode, setInspectorNode] = useState<MatrixNodeDetail | null>(null);
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState<boolean>(false);
  const [evolutionModalPatient, setEvolutionModalPatient] = useState<PatientProfile | null>(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Get Active Patient & Active Doctor
  const activePatient = patients.find((p) => p.id === activePatientId) || patients[0];
  const activeDoctor = professionals.find((d) => d.id === activeDoctorId) || professionals[0];

  // Latest Evolution / Labs
  const latestEvolution = activePatient.evolutionHistory[activePatient.evolutionHistory.length - 1];
  const patientLabs = latestEvolution?.labs || {
    glucoseFasting: 98,
    insulinFasting: 14.8,
    triglycerides: 172,
    hdl: 41,
    bmi: 28.4,
    waistCm: 89,
    ggt: 34,
    sex: 'female' as const,
  };

  const surrogates = calculateSurrogates(patientLabs);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3400);
  };

  // Cloud Supabase Sync on Mount
  useEffect(() => {
    async function loadCloudData() {
      try {
        const [cloudDocs, cloudPatients] = await Promise.all([
          fetchProfessionalsFromCloud(),
          fetchPatientsFromCloud(),
        ]);

        if (cloudDocs && cloudDocs.length > 0) {
          setProfessionals((currentLocalDocs) => {
            // Combinar registros en la nube con las personalizaciones locales de credenciales
            const merged = cloudDocs.map((cDoc) => {
              const localMatch = currentLocalDocs.find((l) => l.id === cDoc.id);
              return {
                ...cDoc,
                fullName: localMatch?.fullName || cDoc.fullName,
                title: localMatch?.title || cDoc.title,
                specialty: localMatch?.specialty || cDoc.specialty,
                licenseNumber: localMatch?.licenseNumber || cDoc.licenseNumber,
                institution: localMatch?.institution || cDoc.institution,
                signatureUrl: localMatch?.signatureUrl || cDoc.signatureUrl,
                username: localMatch?.username || cDoc.username || generateClinicalUsername(cDoc.fullName),
                password: localMatch?.password || cDoc.password || '123456',
                role: localMatch?.role || cDoc.role || 'doctor',
                mustChangePassword: localMatch?.mustChangePassword ?? cDoc.mustChangePassword,
              };
            });

            // Conservar doctores agregados localmente que no estén aún en la nube
            currentLocalDocs.forEach((localDoc) => {
              if (!merged.some((m) => m.id === localDoc.id)) {
                merged.push(localDoc);
              }
            });

            return merged;
          });
        }

        if (cloudPatients && cloudPatients.length > 0) {
          setPatients((currentLocalPatients) => {
            // Si hay pacientes creados localmente, conservarlos
            const mergedPatients = [...cloudPatients];
            currentLocalPatients.forEach((lp) => {
              if (!mergedPatients.some((cp) => cp.id === lp.id)) {
                mergedPatients.push(lp);
              }
            });
            return mergedPatients;
          });
        }
      } catch (err) {
        console.warn('[Sync] Error sincronizando datos remotos:', err);
      }
    }
    loadCloudData();
  }, []);

  // Sync to storage
  useEffect(() => {
    savePatients(patients);
  }, [patients]);

  useEffect(() => {
    saveActivePatientId(activePatientId);
  }, [activePatientId]);

  useEffect(() => {
    try {
      localStorage.setItem(PROFESSIONALS_STORAGE_KEY, JSON.stringify(professionals));
    } catch (e) {}
  }, [professionals]);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_DOCTOR_ID_KEY, activeDoctorId);
    } catch (e) {}
  }, [activeDoctorId]);

  const handleLoginSuccess = (user: MedicalProfessional, remember: boolean) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setActiveDoctorId(user.id);

    try {
      const userStr = JSON.stringify(user);
      if (remember) {
        localStorage.setItem(AUTH_SESSION_KEY, userStr);
        sessionStorage.removeItem(AUTH_SESSION_KEY);
      } else {
        sessionStorage.setItem(AUTH_SESSION_KEY, userStr);
        localStorage.removeItem(AUTH_SESSION_KEY);
      }
    } catch (e) {}

    showToast(`¡Bienvenido al sistema clínico, ${user.fullName}!`);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(AUTH_SESSION_KEY);
      sessionStorage.removeItem(AUTH_SESSION_KEY);
    } catch (e) {}
    setIsAuthenticated(false);
    setCurrentUser(null);
    showToast('Sesión clínica finalizada de forma segura.');
  };

  const handleSaveNewPassword = (newPassword: string) => {
    if (!currentUser) return;
    const updatedUser: MedicalProfessional = {
      ...currentUser,
      password: newPassword,
      mustChangePassword: false,
    };
    setCurrentUser(updatedUser);

    const updatedList = professionals.map((p) =>
      p.id === updatedUser.id ? updatedUser : p
    );
    setProfessionals(updatedList);

    try {
      if (localStorage.getItem(AUTH_SESSION_KEY)) {
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(updatedUser));
      } else {
        sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(updatedUser));
      }
      localStorage.setItem(PROFESSIONALS_STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {}

    saveProfessionalToCloud(updatedUser);
    setIsChangePasswordOpen(false);
    showToast('¡Contraseña actualizada exitosamente! Máxima seguridad clínica activada.');
  };

  const handleToggleClinicalMode = () => {
    setClinicalMode((prev) => !prev);
    showToast(
      !clinicalMode
        ? 'Modo Clínico: Umbrales Funcionales Óptimos Habilitados'
        : 'Modo Clínico: Valores Convencionales Poblacionales'
    );
  };

  const handleSelectPatient = (patientId: string) => {
    setActivePatientId(patientId);
  };

  const handleSaveNewPatient = (newPatient: PatientProfile) => {
    const updated = [newPatient, ...patients];
    setPatients(updated);
    setActivePatientId(newPatient.id);
    savePatientToCloud(newPatient);
    showToast(`¡Paciente ${newPatient.fullName} (${newPatient.mrn}) registrado con éxito!`);
  };

  const handleSaveEvolution = (patientId: string, newEvolution: PatientEvolution) => {
    const updated = patients.map((p) => {
      if (p.id === patientId) {
        const updatedPatient = {
          ...p,
          evolutionHistory: [...p.evolutionHistory, newEvolution],
          currentProtocol: newEvolution.activeProtocol || p.currentProtocol,
        };
        savePatientToCloud(updatedPatient);
        return updatedPatient;
      }
      return p;
    });
    setPatients(updated);
    showToast(`Evolución registrada correctamente para el paciente.`);
  };

  const handleUpdatePatientLabs = (newLabs: PatientLabs) => {
    const newSurr = calculateSurrogates(newLabs);
    const updated = patients.map((p) => {
      if (p.id === activePatient.id) {
        const lastEvo = p.evolutionHistory[p.evolutionHistory.length - 1];
        const updatedLastEvo: PatientEvolution = {
          ...lastEvo,
          labs: newLabs,
          surrogates: newSurr,
          vitalSigns: {
            ...lastEvo.vitalSigns,
            bmi: newLabs.bmi,
            waistCm: newLabs.waistCm,
          },
        };
        return {
          ...p,
          evolutionHistory: [...p.evolutionHistory.slice(0, -1), updatedLastEvo],
        };
      }
      return p;
    });
    setPatients(updated);
    showToast('Biomarcadores y recálculo de índices actualizados.');
  };

  const handleApplyProtocol = (nodeName: string) => {
    setInspectorNode(null);
    showToast(`¡Protocolo de ${nodeName} añadido al expediente de ${activePatient.fullName}!`);
  };

  // If user is not authenticated, display Login Gate
  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen
          professionals={professionals}
          onLoginSuccess={handleLoginSuccess}
        />
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#1e1b19] font-sans antialiased selection:bg-[#005c55]/20 selection:text-[#005c55]">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        clinicalMode={clinicalMode}
        onToggleClinicalMode={handleToggleClinicalMode}
        currentPatient={activePatient}
        activeDoctor={activeDoctor}
        onOpenNewPatientModal={() => setIsNewPatientModalOpen(true)}
        onLogout={handleLogout}
        onOpenChangePassword={() => setIsChangePasswordOpen(true)}
      />

      {/* Persistent Left Clinical Sidebar (Triaje y Cohorte) */}
      <Sidebar
        currentPatient={activePatient}
        homaIr={surrogates.homaIr}
        stratumName={latestEvolution?.stratum || 'Estrato 2'}
        stratumStatus={latestEvolution?.stratumStatus || 'Fricción Moderada'}
        onOpenFhir={() => setIsFhirModalOpen(true)}
        onOpenNewPatient={() => setIsNewPatientModalOpen(true)}
        onOpenNewEvolution={() => setEvolutionModalPatient(activePatient)}
        onOpenDashboard={() => setCurrentTab('patients-dashboard')}
        activeDoctor={activeDoctor}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="xl:pl-64">
        <main className="w-full pt-[156px] min-h-screen px-4 md:px-6 py-6 pb-16">
          {/* TAB 0: PATIENTS DASHBOARD */}
          {currentTab === 'patients-dashboard' && (
            <PatientsDashboardScreen
              patients={patients}
              activePatientId={activePatientId}
              onSelectPatient={handleSelectPatient}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onOpenNewPatientModal={() => setIsNewPatientModalOpen(true)}
              onOpenNewEvolutionModal={(patient) => setEvolutionModalPatient(patient)}
              professionals={professionals}
              activeDoctor={activeDoctor}
              onShowToast={showToast}
            />
          )}

          {/* TAB 1: PATHOPHYSIOLOGY & ATM */}
          {currentTab === 'pathophysiology-atm' && (
            <AtmScreen
              currentPatient={activePatient}
              onOpenFhir={() => setIsFhirModalOpen(true)}
              onOpenInspector={(node) => setInspectorNode(node)}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onShowToast={showToast}
            />
          )}

          {/* TAB 2: SURROGATE INDICES CALCULATOR */}
          {currentTab === 'surrogate-indices' && (
            <SurrogateIndicesScreen
              labs={patientLabs}
              patient={activePatient}
              doctor={activeDoctor}
              onUpdateLabs={handleUpdatePatientLabs}
              onShowToast={showToast}
              onOpenFhir={() => setIsFhirModalOpen(true)}
            />
          )}

          {/* TAB 3: KRAFT OGTT CURVES */}
          {currentTab === 'kraft-ogtt-curves' && (
            <KraftOgttScreen
              patient={activePatient}
              doctor={activeDoctor}
              onOpenFhir={() => setIsFhirModalOpen(true)}
              onShowToast={showToast}
            />
          )}

          {/* TAB 4: CDSS & STRATIFICATION */}
          {currentTab === 'cdss-stratification' && (
            <CdssScreen
              patient={activePatient}
              doctor={activeDoctor}
              onOpenFhir={() => setIsFhirModalOpen(true)}
              onShowToast={showToast}
            />
          )}

          {/* TAB 5: THERAPEUTICS MATRIX */}
          {currentTab === 'therapeutics-matrix' && (
            <TherapeuticsScreen
              onShowToast={showToast}
              onOpenFhir={() => setIsFhirModalOpen(true)}
            />
          )}

          {/* TAB 6: MONITORING & FHIR */}
          {currentTab === 'monitoring-fhir' && (
            <MonitoringFhirScreen
              onShowToast={showToast}
              onOpenFhir={() => setIsFhirModalOpen(true)}
            />
          )}

          {/* TAB 7: MEDICAL PROFESSIONALS CONFIG & SIGNATURES */}
          {currentTab === 'professionals-config' && (
            <ProfessionalsConfigScreen
              professionals={professionals}
              onUpdateProfessionals={(updated) => {
                setProfessionals(updated);
                if (currentUser) {
                  const updatedCurrent = updated.find((u) => u.id === currentUser.id);
                  if (updatedCurrent) {
                    setCurrentUser(updatedCurrent);
                    try {
                      if (localStorage.getItem(AUTH_SESSION_KEY)) {
                        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(updatedCurrent));
                      } else {
                        sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(updatedCurrent));
                      }
                    } catch (e) {}
                  }
                }
                updated.forEach((doc) => saveProfessionalToCloud(doc));
              }}
              activeDoctorId={activeDoctorId}
              onSelectActiveDoctor={(id) => setActiveDoctorId(id)}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* FHIR R4 Modal */}
      <FhirModal
        isOpen={isFhirModalOpen}
        onClose={() => setIsFhirModalOpen(false)}
        labs={patientLabs}
        patientName={activePatient.fullName}
        homaIr={surrogates.homaIr}
        onShowToast={showToast}
      />

      {/* Matrix Node Clinical Deep Inspector Modal */}
      <InspectorModal
        node={inspectorNode}
        onClose={() => setInspectorNode(null)}
        onApplyProtocol={handleApplyProtocol}
      />

      {/* New Patient Intake Modal */}
      <NewPatientModal
        isOpen={isNewPatientModalOpen}
        onClose={() => setIsNewPatientModalOpen(false)}
        onSavePatient={handleSaveNewPatient}
        professionals={professionals}
        activeDoctorId={activeDoctorId}
      />

      {/* New Follow-up Evolution Modal */}
      {evolutionModalPatient && (
        <NewEvolutionModal
          isOpen={!!evolutionModalPatient}
          onClose={() => setEvolutionModalPatient(null)}
          patient={evolutionModalPatient}
          onSaveEvolution={handleSaveEvolution}
          professionals={professionals}
          activeDoctorId={activeDoctorId}
        />
      )}

      {/* Mandatory / Optional Password Change Modal */}
      {currentUser && (
        <ChangePasswordModal
          isOpen={isMustChangePassword(currentUser) || isChangePasswordOpen}
          isMandatory={isMustChangePassword(currentUser)}
          currentUser={currentUser}
          onSavePassword={handleSaveNewPassword}
          onClose={() => setIsChangePasswordOpen(false)}
        />
      )}

      {/* Floating Feedback Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
