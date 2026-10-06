import React from 'react';
import { PatientProfile, MedicalProfessional } from '../types';
import { FunctionalCareLogo } from './FunctionalCareLogo';

interface SidebarProps {
  currentPatient: PatientProfile;
  homaIr?: number;
  stratumName?: string;
  stratumStatus?: string;
  onOpenFhir?: () => void;
  onOpenNewPatient?: () => void;
  onOpenNewEvolution?: () => void;
  onOpenDashboard?: () => void;
  activeDoctor?: MedicalProfessional;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPatient,
  homaIr = 3.59,
  stratumName = 'Estrato 2',
  stratumStatus = 'Fricción Moderada',
  onOpenFhir,
  onOpenNewPatient,
  onOpenNewEvolution,
  onOpenDashboard,
  activeDoctor,
  onLogout,
}) => {
  const latestEvo = currentPatient.evolutionHistory[currentPatient.evolutionHistory.length - 1];
  const labs = latestEvo?.labs || {
    glucoseFasting: 98,
    insulinFasting: 14.8,
    triglycerides: 172,
    hdl: 41,
    bmi: 28.4,
    waistCm: 89,
    ggt: 34,
    sex: 'female' as const,
  };

  const trigHdlRatio = Number((labs.triglycerides / Math.max(1, labs.hdl)).toFixed(2));

  return (
    <aside className="fixed left-0 top-[152px] bottom-0 w-64 bg-[#faf2ee] shadow-[1px_0_8px_rgba(0,0,0,0.02)] border-r border-[#e9e1dd] z-40 hidden xl:flex flex-col justify-between p-4 overflow-y-auto no-scrollbar">
      <div className="flex flex-col gap-3.5">
        {/* Clinic Endorsement Badge */}
        <div className="rounded-xl overflow-hidden shadow-sm">
          <FunctionalCareLogo variant="horizontal-badge" height={36} className="w-full justify-center" />
        </div>

        {/* Patient Switcher Header */}
        <div className="p-2.5 rounded-xl bg-white border border-[#e9e1dd] shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#005c55] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {currentPatient.fullName.split(' ')[0]?.[0]}
              {currentPatient.fullName.split(' ')[1]?.[0]}
            </div>
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-xs font-bold text-[#1e1b19] truncate max-w-[130px]">
                {currentPatient.fullName}
              </span>
              <span className="text-[10px] text-[#6e7977] font-mono">{currentPatient.mrn}</span>
            </div>
          </div>
          <button
            onClick={onOpenDashboard}
            className="p-1.5 text-[#005c55] hover:bg-[#faf2ee] rounded-lg border border-[#e9e1dd] transition-colors cursor-pointer"
            title="Cambiar paciente en el Dashboard"
          >
            <span className="material-symbols-outlined text-base">switch_account</span>
          </button>
        </div>

        {/* Stratum Card */}
        <div className="p-3 rounded-xl bg-[#ffffff] shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-[#e9e1dd] flex flex-col gap-1">
          <span className="text-[10.5px] text-[#6e7977] font-bold uppercase tracking-wider">
            Estrato de Riesgo Metabólico
          </span>
          <div className="flex items-center justify-between">
            <span className="text-base text-[#904d00] font-extrabold">{stratumName}</span>
            <span className="text-[10.5px] px-1.5 py-0.5 rounded bg-[#f4ece8] text-[#904d00] font-bold">
              {stratumStatus}
            </span>
          </div>
          <div className="w-full bg-[#eee7e3] h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                stratumName === 'Estrato 3'
                  ? 'w-[90%] bg-[#cb2044]'
                  : stratumName === 'Estrato 2'
                  ? 'w-[65%] bg-[#fe932c]'
                  : stratumName === 'Estrato 1'
                  ? 'w-[40%] bg-[#005c55]'
                  : 'w-[15%] bg-[#0f766e]'
              }`}
            />
          </div>
        </div>

        {/* Vital Parameters Card */}
        <div className="p-3 rounded-xl bg-[#ffffff] shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-[#e9e1dd] flex flex-col gap-2">
          <span className="text-[11px] font-bold text-[#6e7977] uppercase tracking-wider">
            Parámetros de Consulta
          </span>

          <div className="flex justify-between text-[12px]">
            <span className="text-[#3e4947]">Insulina Basal:</span>
            <span className="font-semibold text-[#904d00] tabular-nums">
              {labs.insulinFasting} μIU/mL
            </span>
          </div>

          <div className="flex justify-between text-[12px]">
            <span className="text-[#3e4947]">Glucosa Basal:</span>
            <span className="font-semibold text-[#1e1b19] tabular-nums">
              {labs.glucoseFasting} mg/dL
            </span>
          </div>

          <div className="flex justify-between text-[12px]">
            <span className="text-[#3e4947]">HOMA-IR:</span>
            <span className="font-bold text-[#904d00] tabular-nums">
              {homaIr}
            </span>
          </div>

          <div className="flex justify-between text-[12px]">
            <span className="text-[#3e4947]">Ratio Trig/HDL:</span>
            <span className="font-semibold text-[#904d00] tabular-nums">
              {trigHdlRatio}
            </span>
          </div>

          <div className="flex justify-between text-[12px]">
            <span className="text-[#3e4947]">Peso / IMC:</span>
            <span className="font-semibold text-[#1e1b19] tabular-nums">
              {latestEvo?.vitalSigns.weightKg || 70}kg / {labs.bmi}
            </span>
          </div>
        </div>

        {/* Quick Patient Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onOpenNewEvolution}
            className="p-2 rounded-lg bg-[#005c55] hover:bg-[#0f766e] text-white text-xs font-bold transition-all shadow-sm flex flex-col items-center justify-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span className="text-[10px]">Nueva Evolución</span>
          </button>
          <button
            onClick={onOpenNewPatient}
            className="p-2 rounded-lg bg-white hover:bg-[#faf2ee] text-[#005c55] border border-[#005c55]/30 text-xs font-bold transition-all shadow-sm flex flex-col items-center justify-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span className="text-[10px]">Nuevo Paciente</span>
          </button>
        </div>

        {/* Active Doctor Attestation Card */}
        {activeDoctor && (
          <div className="p-2.5 rounded-xl bg-white border border-[#e9e1dd] shadow-sm text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9.5px] font-mono text-[#6e7977] uppercase font-bold">
                Especialista Asignado
              </span>
              <span className="text-[9px] text-[#005c55] font-bold bg-[#005c55]/10 px-1.5 py-0.2 rounded">
                Activo
              </span>
            </div>
            <p className="font-bold text-[#1e1b19] leading-tight truncate">{activeDoctor.fullName}</p>
            <p className="text-[10px] text-[#6e7977] flex items-center justify-between mt-0.5">
              <span>{activeDoctor.licenseNumber}</span>
              <span className="font-mono text-[#005c55] font-semibold">@{activeDoctor.username || 'mausugu'}</span>
            </p>
            {activeDoctor.signatureUrl && (
              <div className="mt-1.5 pt-1.5 border-t border-[#f4ece8] flex items-center justify-between">
                <span className="text-[9px] text-[#005c55] font-semibold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[11px]">verified</span>
                  Firma Certificada
                </span>
                <img src={activeDoctor.signatureUrl} alt="Firma" className="h-5 max-w-[60px] object-contain" />
              </div>
            )}
            {onLogout && (
              <button
                onClick={onLogout}
                className="w-full mt-2 py-1.5 px-2 bg-[#cb2044]/10 hover:bg-[#cb2044] text-[#cb2044] hover:text-white rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">logout</span>
                <span>Cerrar Sesión</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* FHIR Connection Footer */}
      <div className="p-2 text-[11px] text-[#6e7977] flex flex-col gap-1 border-t border-[#e9e1dd] pt-3">
        <button
          onClick={onOpenFhir}
          className="flex items-center gap-1 text-[#005c55] font-semibold hover:underline text-left cursor-pointer"
        >
          <span className="material-symbols-outlined text-[15px] animate-spin">sync</span>
          <span>HL7 FHIR R4 Conectado</span>
        </button>
        <span className="text-[10px] text-[#6e7977]">Servidor: us-east-clinical.fhir</span>
      </div>
    </aside>
  );
};
