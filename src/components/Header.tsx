import React from 'react';
import { ScreenTab, PatientProfile, MedicalProfessional } from '../types';
import { FunctionalCareLogo } from './FunctionalCareLogo';

interface HeaderProps {
  currentTab: ScreenTab;
  onTabChange: (tab: ScreenTab) => void;
  clinicalMode: boolean;
  onToggleClinicalMode: () => void;
  currentPatient?: PatientProfile;
  activeDoctor?: MedicalProfessional;
  onOpenNewPatientModal: () => void;
  onLogout?: () => void;
  onOpenChangePassword?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  clinicalMode,
  onToggleClinicalMode,
  currentPatient,
  activeDoctor,
  onOpenNewPatientModal,
  onLogout,
  onOpenChangePassword,
}) => {
  const latestEvo = currentPatient?.evolutionHistory[currentPatient.evolutionHistory.length - 1];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e7e5e4]">
      {/* Upper Brand & Telemetry Bar */}
      <div className="h-28 w-full px-4 md:px-6 flex flex-col justify-between py-2">
        <div className="flex items-center justify-between">
          {/* Functional Care Logo & Clinical System Title */}
          <div className="flex items-center gap-3 md:gap-4">
            <FunctionalCareLogo variant="full" height={44} />

            <div className="hidden sm:flex items-center pl-3 border-l border-[#e9e1dd]">
              <span className="px-2 py-0.5 rounded bg-[#005c55]/10 text-[#005c55] text-[10.5px] font-bold tracking-tight">
                EndoMetabolic Rx • CDSS v4.2
              </span>
            </div>
          </div>

          {/* Right Header Status Controls */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Quick Button to Open New Patient Modal */}
            <button
              onClick={onOpenNewPatientModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#005c55] hover:bg-[#0f766e] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Registrar nuevo paciente en el sistema"
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>+ Nuevo Paciente</span>
            </button>

            {/* Clinical Mode Functional vs Conventional Toggle */}
            <button
              onClick={onToggleClinicalMode}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-[#faf2ee] hover:bg-[#f4ece8] rounded-xl text-[#005c55] border border-[#e9e1dd] transition-colors cursor-pointer text-left"
              title="Alternar vista de umbrales funcionales óptimos vs criterios poblacionales convencionales"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  clinicalMode ? 'bg-[#005c55] animate-pulse' : 'bg-[#6e7977]'
                }`}
              />
              <span className="text-[11px] font-semibold">
                {clinicalMode
                  ? 'Modo Clínico: Funcional'
                  : 'Modo Clínico: Convencional'}
              </span>
            </button>

            {/* Active Doctor Badge / Profile */}
            <div
              onClick={() => onTabChange('professionals-config')}
              className="flex items-center gap-2 px-2.5 py-1 bg-[#faf2ee] hover:bg-[#f4ece8] rounded-xl border border-[#e9e1dd] cursor-pointer transition-colors"
              title="Configuración de especialistas médicos, credenciales y firmas"
            >
              <div className="w-7 h-7 rounded-full bg-[#005c55] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {activeDoctor?.fullName.split(' ')[1]?.[0] || 'D'}
                {activeDoctor?.fullName.split(' ')[2]?.[0] || 'T'}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-bold text-[#1e1b19] leading-tight truncate max-w-[130px]">
                    {activeDoctor?.fullName || 'Dr. M. Suaza Gutiérrez'}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-[#005c55] bg-[#005c55]/10 px-1 rounded">
                    @{activeDoctor?.username || 'mausugu'}
                  </span>
                </div>
                <span className="text-[9.5px] text-[#005c55] font-semibold">
                  {activeDoctor?.licenseNumber || 'TP-84920-MD'}
                </span>
              </div>
            </div>

            {/* Change Password Button */}
            {onOpenChangePassword && (
              <button
                onClick={onOpenChangePassword}
                className="p-1.5 px-2.5 text-[#005c55] hover:bg-[#005c55]/10 rounded-xl border border-[#005c55]/30 transition-colors cursor-pointer flex items-center gap-1"
                title="Cambiar contraseña de seguridad"
              >
                <span className="material-symbols-outlined text-[16px]">key</span>
                <span className="hidden xl:inline text-[11px] font-bold">Clave</span>
              </button>
            )}

            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-1.5 px-3 bg-[#cb2044]/10 hover:bg-[#cb2044] text-[#cb2044] hover:text-white rounded-xl border border-[#cb2044]/30 transition-all cursor-pointer flex items-center gap-1 shadow-2xs font-semibold"
                title="Cerrar sesión clínica del especialista"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span className="text-[11.5px] font-bold">Cerrar Sesión</span>
              </button>
            )}
          </div>
        </div>

        {/* Patient Sub-Ribbon */}
        <div className="flex items-center justify-between gap-2 px-3 py-1 bg-[#faf2ee] rounded border border-[#f4ece8] text-[12px] text-[#3e4947] overflow-x-auto no-scrollbar">
          <div className="flex items-center flex-wrap gap-x-3 gap-y-0.5 whitespace-nowrap">
            <button
              onClick={() => onTabChange('patients-dashboard')}
              className="flex items-center gap-1 font-bold text-[#005c55] hover:underline cursor-pointer"
              title="Ir al Dashboard de Pacientes"
            >
              <span className="material-symbols-outlined text-sm">person</span>
              <span>Paciente: {currentPatient?.fullName || 'Eleanor Vance, 44a F'}</span>
            </button>
            <span className="text-[#bdc9c6]">|</span>
            <span>
              Nº Historia / MRN: <strong className="text-[#1e1b19] font-medium">{currentPatient?.mrn || '#FM-88219'}</strong>
            </span>
            <span className="text-[#bdc9c6]">|</span>
            <span>
              Ayuno: <strong className="text-[#1e1b19] font-medium">{latestEvo?.fastingHours || 12.4}h</strong>
            </span>
            <span className="text-[#bdc9c6]">|</span>
            <span>
              Estrato Actual:{' '}
              <strong className="text-[#904d00] font-semibold">
                {latestEvo?.stratum || 'Estrato 2'} ({latestEvo?.stratumStatus || 'Fricción Moderada'})
              </strong>
            </span>
            <span className="text-[#bdc9c6]">|</span>
            <span>
              Médico Tratante:{' '}
              <strong className="text-[#1e1b19] font-medium">{activeDoctor?.fullName || 'Dr. M. Thorne, IFMCP'}</strong>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1 text-[11px] text-[#005c55] font-semibold whitespace-nowrap shrink-0">
            <span className="material-symbols-outlined text-[15px]">verified</span>
            <span>Sincronización Telemetría de Estratos</span>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="px-4 md:px-6 bg-[#ffffff] shadow-[0_1px_0_rgba(0,0,0,0.03)] border-t border-[#f4ece8]">
        <nav className="flex items-center gap-3 md:gap-5 overflow-x-auto no-scrollbar h-10">
          <button
            onClick={() => onTabChange('patients-dashboard')}
            className={`inline-flex items-center gap-1.5 h-full text-[13px] font-semibold transition-colors whitespace-nowrap px-1 border-b-2 cursor-pointer ${
              currentTab === 'patients-dashboard'
                ? 'text-[#005c55] border-[#005c55]'
                : 'text-[#3e4947] border-transparent hover:text-[#1e1b19]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">groups</span>
            <span>Pacientes & Dashboard</span>
          </button>

          <button
            onClick={() => onTabChange('pathophysiology-atm')}
            className={`inline-flex items-center h-full text-[13px] font-medium transition-colors whitespace-nowrap px-1 border-b-2 cursor-pointer ${
              currentTab === 'pathophysiology-atm'
                ? 'text-[#005c55] border-[#005c55] font-semibold'
                : 'text-[#3e4947] border-transparent hover:text-[#1e1b19]'
            }`}
          >
            Fisiopatología y ATM
          </button>

          <button
            onClick={() => onTabChange('surrogate-indices')}
            className={`inline-flex items-center h-full text-[13px] font-medium transition-colors whitespace-nowrap px-1 border-b-2 cursor-pointer ${
              currentTab === 'surrogate-indices'
                ? 'text-[#005c55] border-[#005c55] font-semibold'
                : 'text-[#3e4947] border-transparent hover:text-[#1e1b19]'
            }`}
          >
            Calculadora de Índices
          </button>

          <button
            onClick={() => onTabChange('kraft-ogtt-curves')}
            className={`inline-flex items-center h-full text-[13px] font-medium transition-colors whitespace-nowrap px-1 border-b-2 cursor-pointer ${
              currentTab === 'kraft-ogtt-curves'
                ? 'text-[#005c55] border-[#005c55] font-semibold'
                : 'text-[#3e4947] border-transparent hover:text-[#1e1b19]'
            }`}
          >
            Curvas Kraft OGTT
          </button>

          <button
            onClick={() => onTabChange('cdss-stratification')}
            className={`inline-flex items-center h-full text-[13px] font-medium transition-colors whitespace-nowrap px-1 border-b-2 cursor-pointer ${
              currentTab === 'cdss-stratification'
                ? 'text-[#005c55] border-[#005c55] font-semibold'
                : 'text-[#3e4947] border-transparent hover:text-[#1e1b19]'
            }`}
          >
            CDSS y Estratificación
          </button>

          <button
            onClick={() => onTabChange('therapeutics-matrix')}
            className={`inline-flex items-center h-full text-[13px] font-medium transition-colors whitespace-nowrap px-1 border-b-2 cursor-pointer ${
              currentTab === 'therapeutics-matrix'
                ? 'text-[#005c55] border-[#005c55] font-semibold'
                : 'text-[#3e4947] border-transparent hover:text-[#1e1b19]'
            }`}
          >
            Matriz Terapéutica
          </button>

          <button
            onClick={() => onTabChange('monitoring-fhir')}
            className={`inline-flex items-center h-full text-[13px] font-medium transition-colors whitespace-nowrap px-1 border-b-2 cursor-pointer ${
              currentTab === 'monitoring-fhir'
                ? 'text-[#005c55] border-[#005c55] font-semibold'
                : 'text-[#3e4947] border-transparent hover:text-[#1e1b19]'
            }`}
          >
            Monitoreo y FHIR
          </button>

          <button
            onClick={() => onTabChange('professionals-config')}
            className={`inline-flex items-center gap-1.5 h-full text-[13px] font-semibold transition-colors whitespace-nowrap px-1 border-b-2 cursor-pointer ${
              currentTab === 'professionals-config'
                ? 'text-[#005c55] border-[#005c55]'
                : 'text-[#3e4947] border-transparent hover:text-[#1e1b19]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">badge</span>
            <span>Equipo Médico & Firmas</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
