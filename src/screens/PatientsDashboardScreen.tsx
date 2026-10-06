import React, { useState, useMemo } from 'react';
import { PatientProfile, ScreenTab, MedicalProfessional } from '../types';
import { exportPatientHistoryPdfReport } from '../utils/pdfReportGenerator';

interface PatientsDashboardScreenProps {
  patients: PatientProfile[];
  activePatientId: string;
  onSelectPatient: (patientId: string) => void;
  onNavigateTab: (tab: ScreenTab) => void;
  onOpenNewPatientModal: () => void;
  onOpenNewEvolutionModal: (patient: PatientProfile) => void;
  professionals: MedicalProfessional[];
  activeDoctor?: MedicalProfessional;
  onShowToast: (msg: string) => void;
}

export const PatientsDashboardScreen: React.FC<PatientsDashboardScreenProps> = ({
  patients,
  activePatientId,
  onSelectPatient,
  onNavigateTab,
  onOpenNewPatientModal,
  onOpenNewEvolutionModal,
  professionals,
  activeDoctor,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStratumFilter, setSelectedStratumFilter] = useState<string>('all');
  const [selectedDrawerPatient, setSelectedDrawerPatient] = useState<PatientProfile | null>(null);

  // Active Patient
  const activePatient = patients.find((p) => p.id === activePatientId) || patients[0];

  // Cohort Analytics
  const analytics = useMemo(() => {
    let totalHoma = 0;
    let stratum0Count = 0;
    let stratum1Count = 0;
    let stratum2Count = 0;
    let stratum3Count = 0;

    patients.forEach((p) => {
      const latestEvo = p.evolutionHistory[p.evolutionHistory.length - 1];
      if (latestEvo) {
        totalHoma += latestEvo.surrogates.homaIr;
        if (latestEvo.stratum === 'Estrato 0') stratum0Count++;
        else if (latestEvo.stratum === 'Estrato 1') stratum1Count++;
        else if (latestEvo.stratum === 'Estrato 2') stratum2Count++;
        else if (latestEvo.stratum === 'Estrato 3') stratum3Count++;
      }
    });

    const avgHoma = patients.length > 0 ? (totalHoma / patients.length).toFixed(2) : '0';
    return {
      total: patients.length,
      avgHoma,
      stratum0Count,
      stratum1Count,
      stratum2Count,
      stratum3Count,
    };
  }, [patients]);

  // Filtered Patients List
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const latestEvo = p.evolutionHistory[p.evolutionHistory.length - 1];
      const matchesSearch =
        p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.primaryDiagnosis.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStratum =
        selectedStratumFilter === 'all' || (latestEvo && latestEvo.stratum === selectedStratumFilter);

      return matchesSearch && matchesStratum;
    });
  }, [patients, searchTerm, selectedStratumFilter]);

  const handleCardClick = (patient: PatientProfile) => {
    onSelectPatient(patient.id);
    setSelectedDrawerPatient(patient);
    onShowToast(`Paciente activo seleccionado: ${patient.fullName}`);
  };

  const handleLaunchFullClinical = (patientId: string) => {
    onSelectPatient(patientId);
    setSelectedDrawerPatient(null);
    onNavigateTab('pathophysiology-atm');
    onShowToast('Cargando expediente clínico y matriz ATM...');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Dashboard Top Banner */}
      <div className="bg-gradient-to-r from-[#005c55] via-[#0f766e] to-[#005c55] rounded-2xl p-5 md:p-6 text-white shadow-md border border-[#005c55]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-[#a3faef]">clinical_notes</span>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              Dashboard de Consulta & Gestión de Pacientes
            </h1>
            <span className="bg-white/20 text-white text-[11px] font-mono px-2 py-0.5 rounded font-semibold">
              Functional Care
            </span>
          </div>
          <p className="text-sm text-white/80 mt-1 max-w-2xl">
            Control de evolución longitudinal, estratificación metabólica e historial clínico interactivo de pacientes en tratamiento funcional.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenNewPatientModal}
            className="px-4 py-2.5 bg-white text-[#005c55] hover:bg-[#faf2ee] font-extrabold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>+ Ingresar Nuevo Paciente</span>
          </button>
        </div>
      </div>

      {/* Cohort Clinical KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-white rounded-xl p-4 border border-[#e9e1dd] shadow-sm">
          <span className="text-[11px] font-bold text-[#6e7977] uppercase tracking-wider block">
            Total Pacientes
          </span>
          <span className="text-2xl font-extrabold text-[#1e1b19] mt-0.5 block">{analytics.total}</span>
          <span className="text-[11px] text-[#005c55] font-semibold mt-0.5 block flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[13px]">folder_shared</span>
            En Cohorte Activa
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#e9e1dd] shadow-sm">
          <span className="text-[11px] font-bold text-[#6e7977] uppercase tracking-wider block">
            HOMA-IR Promedio
          </span>
          <span className="text-2xl font-extrabold text-[#904d00] mt-0.5 block">{analytics.avgHoma}</span>
          <span className="text-[11px] text-[#6e7977] font-medium mt-0.5 block">
            Meta óptima: &lt; 1.4
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#e9e1dd] shadow-sm">
          <span className="text-[11px] font-bold text-[#005c55] uppercase tracking-wider block">
            Estrato 0 / 1 (Leve)
          </span>
          <span className="text-2xl font-extrabold text-[#005c55] mt-0.5 block">
            {analytics.stratum0Count + analytics.stratum1Count}
          </span>
          <span className="text-[11px] text-[#005c55] font-semibold mt-0.5 block">
            {analytics.total > 0
              ? Math.round(((analytics.stratum0Count + analytics.stratum1Count) / analytics.total) * 100)
              : 0}
            % de la cohorte
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#e9e1dd] shadow-sm">
          <span className="text-[11px] font-bold text-[#fe932c] uppercase tracking-wider block">
            Estrato 2 (Moderado)
          </span>
          <span className="text-2xl font-extrabold text-[#fe932c] mt-0.5 block">
            {analytics.stratum2Count}
          </span>
          <span className="text-[11px] text-[#6e7977] font-medium mt-0.5 block">Fricción Activa</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#e9e1dd] shadow-sm">
          <span className="text-[11px] font-bold text-[#cb2044] uppercase tracking-wider block">
            Estrato 3 (Severo)
          </span>
          <span className="text-2xl font-extrabold text-[#cb2044] mt-0.5 block">
            {analytics.stratum3Count}
          </span>
          <span className="text-[11px] text-[#cb2044] font-semibold mt-0.5 block">Prioridad Clínica</span>
        </div>
      </div>

      {/* Search & Filtering Strip */}
      <div className="bg-white rounded-2xl p-4 border border-[#e9e1dd] shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7977] text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre, cédula / MRN o diagnóstico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#d8d1cd] focus:outline-none focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5]"
          />
        </div>

        {/* Stratum Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full md:w-auto shrink-0">
          <span className="text-[11px] text-[#6e7977] font-bold mr-1">Filtrar:</span>
          {['all', 'Estrato 0', 'Estrato 1', 'Estrato 2', 'Estrato 3'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStratumFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedStratumFilter === st
                  ? 'bg-[#005c55] text-white shadow-sm'
                  : 'bg-[#faf2ee] text-[#6e7977] hover:bg-[#eee7e3]'
              }`}
            >
              {st === 'all' ? 'Todos los Estratos' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => {
          const latestEvo = patient.evolutionHistory[patient.evolutionHistory.length - 1];
          const isActive = patient.id === activePatientId;
          const assignedDoc = professionals.find((doc) => doc.id === patient.assignedDoctorId);

          const stratumBadgeStyle =
            latestEvo?.stratum === 'Estrato 3'
              ? 'bg-[#cb2044]/10 text-[#cb2044] border-[#cb2044]/30'
              : latestEvo?.stratum === 'Estrato 2'
              ? 'bg-[#fe932c]/10 text-[#904d00] border-[#fe932c]/30'
              : latestEvo?.stratum === 'Estrato 1'
              ? 'bg-[#005c55]/10 text-[#005c55] border-[#005c55]/30'
              : 'bg-[#0f766e]/10 text-[#0f766e] border-[#0f766e]/30';

          return (
            <div
              key={patient.id}
              onClick={() => handleCardClick(patient)}
              className={`bg-white rounded-2xl border p-4.5 shadow-sm transition-all cursor-pointer flex flex-col justify-between hover:shadow-md hover:border-[#005c55] group relative ${
                isActive ? 'border-[#005c55] ring-2 ring-[#005c55]/20 bg-gradient-to-b from-[#005c55]/5 to-white' : 'border-[#e9e1dd]'
              }`}
            >
              {isActive && (
                <div className="absolute top-3 right-3 bg-[#005c55] text-white text-[9.5px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[11px]">check_circle</span>
                  <span>Paciente Activo</span>
                </div>
              )}

              <div>
                {/* Header */}
                <div className="flex items-start gap-3 mb-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#005c55] to-[#0f766e] text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                    {patient.fullName.split(' ')[0]?.[0]}
                    {patient.fullName.split(' ')[1]?.[0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1e1b19] group-hover:text-[#005c55] transition-colors leading-tight">
                      {patient.fullName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#6e7977] mt-0.5">
                      <span>{patient.age} años</span>
                      <span>•</span>
                      <span>{patient.sex === 'female' ? 'Femenino' : 'Masculino'}</span>
                      <span>•</span>
                      <span className="font-mono font-semibold text-[#1e1b19]">{patient.mrn}</span>
                    </div>
                  </div>
                </div>

                {/* Stratum & Diagnosis */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${stratumBadgeStyle}`}>
                      {latestEvo?.stratum || 'Estrato 2'}
                    </span>
                    <span className="text-[10.5px] text-[#6e7977] font-medium truncate">
                      {latestEvo?.stratumStatus || 'Fricción Metabólica'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#3e4947] line-clamp-1 italic">
                    {patient.primaryDiagnosis}
                  </p>
                </div>

                {/* Key Labs Grid */}
                <div className="grid grid-cols-3 gap-2 bg-[#fff8f5] p-2.5 rounded-xl border border-[#e9e1dd] text-center mb-3">
                  <div>
                    <span className="text-[9.5px] font-mono text-[#6e7977] block">HOMA-IR</span>
                    <span className="text-xs font-bold text-[#904d00]">
                      {latestEvo?.surrogates.homaIr || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9.5px] font-mono text-[#6e7977] block">Glucosa / Ins</span>
                    <span className="text-xs font-bold text-[#1e1b19]">
                      {latestEvo?.labs.glucoseFasting} / {latestEvo?.labs.insulinFasting}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9.5px] font-mono text-[#6e7977] block">Trig / HDL</span>
                    <span className="text-xs font-bold text-[#1e1b19]">
                      {latestEvo
                        ? (latestEvo.labs.triglycerides / Math.max(1, latestEvo.labs.hdl)).toFixed(1)
                        : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Information */}
              <div className="pt-2 border-t border-[#f4ece8] flex items-center justify-between text-[11px] text-[#6e7977]">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-[#005c55]">history</span>
                  <span>{patient.evolutionHistory.length} Evoluciones</span>
                </div>
                <div className="flex items-center gap-1 text-[#005c55] font-semibold group-hover:underline">
                  <span>Ver Historial</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Patient History Detail Drawer / Modal */}
      {selectedDrawerPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col border-l border-[#e7e5e4] animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 bg-gradient-to-r from-[#005c55] to-[#0f766e] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold text-lg">
                  {selectedDrawerPatient.fullName.split(' ')[0]?.[0]}
                  {selectedDrawerPatient.fullName.split(' ')[1]?.[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold">{selectedDrawerPatient.fullName}</h2>
                    <span className="bg-white/20 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                      {selectedDrawerPatient.mrn}
                    </span>
                  </div>
                  <p className="text-xs text-white/80">
                    {selectedDrawerPatient.age} años • {selectedDrawerPatient.sex === 'female' ? 'Femenino' : 'Masculino'} • Ocupación: {selectedDrawerPatient.occupation || 'No especificada'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDrawerPatient(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="p-3 bg-[#faf2ee] border-b border-[#e9e1dd] flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenNewEvolutionModal(selectedDrawerPatient)}
                  className="px-3 py-1.5 bg-[#005c55] hover:bg-[#0f766e] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  <span>+ Nueva Evolución</span>
                </button>

                <button
                  onClick={() => {
                    const doc = activeDoctor || professionals[0];
                    onShowToast('Generando e imprimiendo Historia Clínica en PDF...');
                    exportPatientHistoryPdfReport({
                      patient: selectedDrawerPatient,
                      doctor: doc,
                    });
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-[#faf2ee] text-[#1e1b19] border border-[#d8d1cd] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm text-[#cb2044]">picture_as_pdf</span>
                  <span>Exportar Historia PDF</span>
                </button>
              </div>

              <button
                onClick={() => handleLaunchFullClinical(selectedDrawerPatient.id)}
                className="px-3.5 py-1.5 bg-[#904d00] hover:bg-[#a65900] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">open_in_browser</span>
                <span>Abrir en CDSS y Fisiopatología</span>
              </button>
            </div>

            {/* Drawer Body: Longitudinal Timeline & History */}
            <div className="flex-1 p-5 overflow-y-auto space-y-5">
              {/* ATM Framework Summary */}
              <div className="bg-[#fff8f5] rounded-xl p-4 border border-[#e9e1dd] space-y-2">
                <span className="text-xs font-bold text-[#005c55] uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">account_tree</span>
                  Matriz Etiológica ATM
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 bg-white rounded-lg border border-[#e9e1dd]">
                    <span className="text-[10px] font-bold text-[#005c55] uppercase block">Antecedentes</span>
                    <ul className="text-[11px] text-[#3e4947] list-disc list-inside mt-1 space-y-0.5">
                      {selectedDrawerPatient.antecedents.slice(0, 2).map((a, i) => (
                        <li key={i} className="truncate">{a}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-[#e9e1dd]">
                    <span className="text-[10px] font-bold text-[#904d00] uppercase block">Gatillos / Disparadores</span>
                    <ul className="text-[11px] text-[#3e4947] list-disc list-inside mt-1 space-y-0.5">
                      {selectedDrawerPatient.triggers.slice(0, 2).map((t, i) => (
                        <li key={i} className="truncate">{t}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-[#e9e1dd]">
                    <span className="text-[10px] font-bold text-[#cb2044] uppercase block">Mediadores</span>
                    <ul className="text-[11px] text-[#3e4947] list-disc list-inside mt-1 space-y-0.5">
                      {selectedDrawerPatient.mediators.slice(0, 2).map((m, i) => (
                        <li key={i} className="truncate">{m}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Longitudinal History Timeline */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1e1b19] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#005c55]">timeline</span>
                    Historial de Consultas y Evolución Metabólica ({selectedDrawerPatient.evolutionHistory.length})
                  </span>
                </div>

                <div className="space-y-3 relative before:absolute before:top-2 before:bottom-2 before:left-3.5 before:w-0.5 before:bg-[#e9e1dd]">
                  {selectedDrawerPatient.evolutionHistory.map((evo, idx) => {
                    const isLatest = idx === selectedDrawerPatient.evolutionHistory.length - 1;
                    return (
                      <div key={evo.id} className="relative pl-8">
                        {/* Timeline Bullet */}
                        <div
                          className={`absolute left-1.5 top-2.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                            isLatest ? 'bg-[#005c55] ring-2 ring-[#005c55]/30' : 'bg-[#904d00]'
                          }`}
                        />

                        {/* Evolution Card */}
                        <div className="bg-white rounded-xl border border-[#e9e1dd] p-3.5 shadow-sm space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#1e1b19]">{evo.date}</span>
                              <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-[#005c55]/10 text-[#005c55]">
                                {evo.stratum}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#6e7977] font-medium">
                              Dr: {evo.professionalName || 'Dr. M. Thorne'}
                            </span>
                          </div>

                          <p className="text-xs text-[#005c55] font-semibold">{evo.reason}</p>
                          {evo.clinicalNotes && (
                            <p className="text-[11.5px] text-[#3e4947] leading-relaxed bg-[#fff8f5] p-2 rounded-lg border border-[#f4ece8]">
                              {evo.clinicalNotes}
                            </p>
                          )}

                          {/* Vitals & Biomarkers Readout */}
                          <div className="grid grid-cols-4 gap-2 text-xs pt-1 border-t border-[#f4ece8]">
                            <div>
                              <span className="text-[9.5px] text-[#6e7977] block font-mono">HOMA-IR</span>
                              <span className="text-xs font-bold text-[#904d00]">{evo.surrogates.homaIr}</span>
                            </div>
                            <div>
                              <span className="text-[9.5px] text-[#6e7977] block font-mono">Gluc / Ins</span>
                              <span className="text-xs font-bold text-[#1e1b19]">
                                {evo.labs.glucoseFasting} / {evo.labs.insulinFasting}
                              </span>
                            </div>
                            <div>
                              <span className="text-[9.5px] text-[#6e7977] block font-mono">Peso / IMC</span>
                              <span className="text-xs font-bold text-[#1e1b19]">
                                {evo.vitalSigns.weightKg}kg / {evo.vitalSigns.bmi}
                              </span>
                            </div>
                            <div>
                              <span className="text-[9.5px] text-[#6e7977] block font-mono">Trig / HDL</span>
                              <span className="text-xs font-bold text-[#1e1b19]">
                                {(evo.labs.triglycerides / Math.max(1, evo.labs.hdl)).toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-[#e9e1dd] bg-[#faf2ee] flex items-center justify-between shrink-0">
              <span className="text-xs text-[#6e7977]">
                Expediente digital auditado por Functional Care
              </span>
              <button
                onClick={() => setSelectedDrawerPatient(null)}
                className="px-4 py-1.5 bg-white border border-[#d8d1cd] hover:bg-[#faf2ee] text-xs font-semibold rounded-lg cursor-pointer"
              >
                Cerrar Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
