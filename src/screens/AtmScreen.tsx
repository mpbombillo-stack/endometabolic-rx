import React, { useState } from 'react';
import { MATRIX_NODES_DATA } from '../data/patientData';
import { MatrixNodeDetail, PatientProfile } from '../types';

interface AtmScreenProps {
  onOpenFhir: () => void;
  onOpenInspector: (node: MatrixNodeDetail) => void;
  onNavigateTab: (tab: any) => void;
  onShowToast: (msg: string) => void;
  currentPatient?: PatientProfile;
}

export const AtmScreen: React.FC<AtmScreenProps> = ({
  onOpenFhir,
  onOpenInspector,
  onNavigateTab,
  onShowToast,
  currentPatient,
}) => {
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({
    'ant-1': false,
    'ant-2': false,
    'ant-3': false,
    'ant-4': false,
    'trig-1': false,
    'trig-2': false,
    'trig-3': false,
    'trig-4': false,
    'med-1': false,
    'med-2': false,
    'med-3': false,
    'med-4': false,
  });

  const toggleDetail = (id: string) => {
    setExpandedDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRegenerateMap = () => {
    onShowToast('Actualizando árbol etiológico ATM con la última telemetría clínica...');
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Patient Header Card */}
      <div className="relative w-full overflow-hidden rounded-xl bg-[#ffffff] p-5 md:p-6 shadow-sm border border-[#e9e1dd]">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-[#005c55]/5 blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-[#faf2ee] flex items-center justify-center text-[#005c55] shadow-sm overflow-hidden border border-[#e9e1dd]">
                <img
                  className="w-full h-full object-cover"
                  alt="Retrato clínico de Eleanor Vance"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAROs0qsZFU8OsaoajXaFx8iBEVwhJXbavRcG4gngu38b-ZER2FYAboGSRI1aYZWTMqcdYxvhsXw3A65GElsnbGunyxoro7y0NuI_NuxWhThTm5jYiFO2eyqbD2pEDt5Kbdy0VEjbgJYEA3COK-ZwIFDCDP7snaj1g-nLHGGHNECQKG5v-4-3pQJaKZtGPNJlUzf07J6nSX025eoCjgREpE5zP92ysgSdP192nlc-QPXg12im5ZvyVJ"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span
                className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#fe932c] ring-2 ring-white"
                title="Estrato 2 Riesgo Activo"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[22px] md:text-[24px] font-bold text-[#1e1b19] tracking-tight">
                  {currentPatient?.fullName || 'Eleanor Vance'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#faf2ee] text-[#3e4947] text-[11px] font-semibold">
                  {currentPatient ? `${currentPatient.age} años ${currentPatient.sex === 'female' ? 'Femenino' : 'Masculino'}` : '44 años Femenino'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#ffdcc3] text-[#2f1500] text-[11px] font-semibold font-mono">
                  {currentPatient?.mrn || '#FM-88219'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#9cf2e8]/40 text-[#00201d] text-[11px] font-semibold">
                  {currentPatient?.primaryDiagnosis || 'Lipotoxicidad Hiperinsulinémica'}
                </span>
              </div>
              <p className="text-[13px] text-[#3e4947] mt-1.5 leading-relaxed max-w-4xl">
                {currentPatient?.primaryDiagnosis
                  ? `Expediente clínico activo: ${currentPatient.primaryDiagnosis}. Protocolo en curso: ${currentPatient.currentProtocol}`
                  : 'Caso clínico: Adiposidad visceral acelerada y fatiga postprandial tras perturbación inmuno-metabólica postparto (2021).'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 self-end lg:self-center">
            <button
              onClick={onOpenFhir}
              className="px-3.5 py-1.5 rounded-lg bg-[#faf2ee] hover:bg-[#f4ece8] text-[#1e1b19] text-[12px] font-semibold flex items-center gap-1.5 transition-colors shadow-sm border border-[#e9e1dd] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#005c55]">terminal</span>
              <span>Árbol FHIR de ATM</span>
            </button>
            <button
              onClick={handleRegenerateMap}
              className="px-3.5 py-1.5 rounded-lg bg-[#005c55] hover:bg-[#0f766e] text-white text-[12px] font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">biotech</span>
              <span>Regenerar Mapa Etiológico</span>
            </button>
          </div>
        </div>

        {/* Longitudinal Trajectory of Metabolic Progression */}
        <div className="mt-5 pt-4 border-t border-[#eee7e3]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#005c55]">timeline</span>
              <span className="text-[13px] font-bold text-[#1e1b19]">
                Trayectoria Longitudinal de Progresión Metabólica
              </span>
            </div>
            <span className="text-[11px] text-[#6e7977]">
              2002 — Presente (Carga Acumulativa de 22 Años)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative">
            {/* Era 1 */}
            <div className="p-3 rounded-lg bg-[#faf2ee] flex flex-col gap-1 transition-all hover:bg-[#f4ece8] border border-[#e9e1dd]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#005c55]">1980 – 2002</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-[#e9e1dd] text-[#3e4947] rounded font-semibold">
                  Época I
                </span>
              </div>
              <span className="text-[14px] font-bold text-[#1e1b19]">Vulnerabilidad Genética</span>
              <p className="text-[12px] text-[#3e4947] leading-relaxed">
                Restricción de crecimiento fetal; diabetes gestacional materna; expresión variante TCF7L2. Volumen muscular nativo bajo.
              </p>
              <div className="mt-auto pt-2 flex items-center gap-1 text-[11px] text-[#6e7977]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#005c55]" />
                <span>Reserva Subclínica</span>
              </div>
            </div>

            {/* Era 2 */}
            <div className="p-3 rounded-lg bg-[#faf2ee] flex flex-col gap-1 transition-all hover:bg-[#f4ece8] border border-[#e9e1dd]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#904d00]">2014 – 2018</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-[#e9e1dd] text-[#3e4947] rounded font-semibold">
                  Época II
                </span>
              </div>
              <span className="text-[14px] font-bold text-[#1e1b19]">Fricción Alostática</span>
              <p className="text-[12px] text-[#3e4947] leading-relaxed">
                Estrés corporativo sostenido; atenuación de la curva de cortisol; arquitectura del sueño fragmentada. Insulina basal ascendió a 9.2 uIU/mL.
              </p>
              <div className="mt-auto pt-2 flex items-center gap-1 text-[11px] text-[#904d00]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fe932c]" />
                <span>Cambio HPA-Mitocondrial</span>
              </div>
            </div>

            {/* Era 3 */}
            <div className="p-3 rounded-lg bg-[#faf2ee] flex flex-col gap-1 transition-all hover:bg-[#f4ece8] border border-[#e9e1dd]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#a50030]">2021 Postparto</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-[#e9e1dd] text-[#3e4947] rounded font-semibold">
                  Época III
                </span>
              </div>
              <span className="text-[14px] font-bold text-[#1e1b19]">El Detonante en Cascada</span>
              <p className="text-[12px] text-[#3e4947] leading-relaxed">
                Infección viral postparto + 2 esquemas de fluoroquinolonas. Disrupción de la barrera intestinal, pico severo de LPS, colapso de Akkermansia.
              </p>
              <div className="mt-auto pt-2 flex items-center gap-1 text-[11px] text-[#a50030]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#cb2044]" />
                <span>Colapso del Microbioma</span>
              </div>
            </div>

            {/* Current State */}
            <div className="p-3 rounded-lg bg-[#ffffff] flex flex-col gap-1 transition-all hover:bg-[#f4ece8] ring-2 ring-[#fe932c] shadow-sm border border-[#ffdcc3]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#904d00]">Estado Actual (2024)</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-[#ffdcc3] text-[#2f1500] rounded font-bold">
                  CDSS Activo
                </span>
              </div>
              <span className="text-[14px] font-bold text-[#1e1b19]">Lipotoxicidad Ectópica</span>
              <p className="text-[12px] text-[#3e4947] leading-relaxed">
                Patrón Kraft III-A con aclaramiento demorado. Depósito hepático de DAG, desacoplamiento de eNOS, inflamación M1 visceral. HOMA-IR 3.59.
              </p>
              <div className="mt-auto pt-2 flex items-center gap-1 text-[11px] text-[#a50030] font-semibold">
                <span className="material-symbols-outlined text-[14px]">warning</span>
                <span>Alta Urgencia de Intervención</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ATM Framework (Antecedentes, Gatillos, Mediadores) */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#005c55] text-white text-[10px] font-bold uppercase tracking-wider">
                DIAGNÓSTICO CENTRAL IFM
              </span>
              <h2 className="text-[20px] font-bold text-[#1e1b19]">
                Marco de Fisiopatología ATM
              </h2>
            </div>
            <p className="text-[13px] text-[#6e7977]">
              Mapeo de etiología estructural: Arquitectura biológica predisponente (Antecedentes), Eventos precipitantes y disruptivos (Gatillos/Disparadores), y Bucles patológicos autoperpetuantes (Mediadores).
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[#6e7977] text-[11px] font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#005c55]" /> Genético/Base
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fe932c]" /> Ambiental/Evento
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#cb2044]" /> Autoperpetuante
            </span>
          </div>
        </div>

        {/* 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          {/* COLUMN 1: ANTECEDENTS */}
          <div className="flex flex-col gap-3 bg-[#ffffff] p-4 rounded-xl shadow-sm border border-[#e9e1dd]">
            <div className="flex items-center justify-between pb-2 border-b border-[#eee7e3]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#faf2ee] flex items-center justify-center text-[#005c55]">
                  <span className="material-symbols-outlined text-[18px]">strikethrough_s</span>
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-[#1e1b19]">Antecedentes</h3>
                  <span className="text-[10px] text-[#6e7977] block">Predisposiciones y Base Genómica</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#005c55]/10 text-[#005c55] text-[10px] font-bold">
                4 Identificados
              </span>
            </div>

            {/* Card 1 */}
            <div
              className="p-3 rounded-lg bg-[#faf2ee] hover:bg-[#f4ece8] transition-colors cursor-pointer border border-[#eee7e3]"
              onClick={() => toggleDetail('ant-1')}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="text-[13px] font-bold text-[#1e1b19]">
                  Diabetes Mellitus Tipo 2 y DMG Materna
                </span>
                <span className="material-symbols-outlined text-[#005c55] text-[16px]">family_history</span>
              </div>
              <p className="text-[12px] text-[#3e4947] mt-1">
                Madre diagnosticada con Diabetes Gestacional en el embarazo índice; progresión a DMT2 a los 51 años. Abuela con nefropatía diabética.
              </p>
              {expandedDetails['ant-1'] && (
                <div className="mt-2 pt-2 border-t border-[#e9e1dd] text-[11px] text-[#3e4947] space-y-1">
                  <div className="flex justify-between">
                    <span>Impronta Epigenética:</span>
                    <strong className="text-[#1e1b19]">Toxicidad intrauterina por glucosa</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Impacto en Células Beta:</span>
                    <strong className="text-[#904d00]">Masa nativa estimada -25%</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Card 2 */}
            <div
              className="p-3 rounded-lg bg-[#faf2ee] hover:bg-[#f4ece8] transition-colors cursor-pointer border border-[#eee7e3]"
              onClick={() => toggleDetail('ant-2')}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="text-[13px] font-bold text-[#1e1b19]">
                  Polimorfismos Genéticos: TCF7L2 y PPARG
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#005c55]/15 text-[#005c55] text-[10px] font-bold">
                  Alta Penetrancia
                </span>
              </div>
              <p className="text-[12px] text-[#3e4947] mt-1">
                Heterocigoto para <strong className="text-[#1e1b19]">TCF7L2 rs7903146 (alelo C/T)</strong> confiriendo menor secreción de GLP-1. Portadora de PPARG Pro12Ala.
              </p>
              {expandedDetails['ant-2'] && (
                <div className="mt-2 pt-2 border-t border-[#e9e1dd] text-[11px] text-[#3e4947] space-y-1">
                  <div className="flex justify-between">
                    <span>Vulnerabilidad Incretínica:</span>
                    <strong className="text-[#904d00]">Menor respuesta GLP-1 en células L</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Desviación Adiposa:</span>
                    <strong className="text-[#a50030]">Desbordamiento visceral prematuro</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Card 3 */}
            <div
              className="p-3 rounded-lg bg-[#faf2ee] hover:bg-[#f4ece8] transition-colors cursor-pointer border border-[#eee7e3]"
              onClick={() => toggleDetail('ant-3')}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="text-[13px] font-bold text-[#1e1b19]">
                  Bajo Peso al Nacer / Fricción Nutricional
                </span>
                <span className="material-symbols-outlined text-[#6e7977] text-[16px]">child_care</span>
              </div>
              <p className="text-[12px] text-[#3e4947] mt-1">
                Peso al nacer 2.520 g (5.5 lbs). Fenotipo ahorrador de Barker: el ahorro adaptativo priorizó tejido neural a expensas de la nefrogénesis y capilaridad muscular.
              </p>
              {expandedDetails['ant-3'] && (
                <div className="mt-2 pt-2 border-t border-[#e9e1dd] text-[11px] text-[#3e4947]">
                  <span>Microvasculatura Esquelética: </span>
                  <strong className="text-[#904d00]">Ratio capilar/fibra reducido</strong>
                </div>
              )}
            </div>

            {/* Card 4 */}
            <div
              className="p-3 rounded-lg bg-[#faf2ee] hover:bg-[#f4ece8] transition-colors cursor-pointer border border-[#eee7e3]"
              onClick={() => toggleDetail('ant-4')}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="text-[13px] font-bold text-[#1e1b19]">
                  Pérdida de Masa Muscular / Base Sarcopénica
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#fe932c]/20 text-[#904d00] text-[10px] font-bold">
                  Bajo Sumidero GLUT4
                </span>
              </div>
              <p className="text-[12px] text-[#3e4947] mt-1">
                Labor sedentaria 2008–2020. DXA muestra índice de masa muscular (SMMI) en percentil 22, contrayendo el sumidero no dependiente de insulina.
              </p>
              {expandedDetails['ant-4'] && (
                <div className="mt-2 pt-2 border-t border-[#e9e1dd] text-[11px] text-[#3e4947]">
                  <span>Capacidad de Glucógeno Estimada: </span>
                  <strong className="text-[#1e1b19]">-38% vs estándar de edad</strong>
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 2: TRIGGERS */}
          <div className="flex flex-col gap-3 bg-[#ffffff] p-4 rounded-xl shadow-sm border border-[#e9e1dd]">
            <div className="flex items-center justify-between pb-2 border-b border-[#eee7e3]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#faf2ee] flex items-center justify-center text-[#904d00]">
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-[#1e1b19]">Gatillos / Disparadores</h3>
                  <span className="text-[10px] text-[#6e7977] block">Eventos Precipitantes y Disruptivos</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#fe932c]/20 text-[#904d00] text-[10px] font-bold">
                4 Precipitantes
              </span>
            </div>

            {/* Trigger 1 */}
            <div
              className="p-3 rounded-lg bg-[#faf2ee] hover:bg-[#f4ece8] transition-colors cursor-pointer border border-[#eee7e3]"
              onClick={() => toggleDetail('trig-1')}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="text-[13px] font-bold text-[#1e1b19]">
                  Estrés Alostático Crónico y Eje HPA
                </span>
                <span className="material-symbols-outlined text-[#904d00] text-[16px]">psychology_alt</span>
              </div>
              <p className="text-[12px] text-[#3e4947] mt-1">
                Hipercortisolemia sostenida por rol de alta dirección 2017–2020. Impulsó gluconeogénesis continua e indujo resistencia central a la leptina.
              </p>
              {expandedDetails['trig-1'] && (
                <div className="mt-2 pt-2 border-t border-[#e9e1dd] text-[11px] text-[#3e4947] space-y-1">
                  <div className="flex justify-between">
                    <span>Perfil Diurno:</span>
                    <strong className="text-[#904d00]">Cortisol vespertino elevado (12.4 nmol/L)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Impacto Hepático:</span>
                    <strong className="text-[#1e1b19]">Expresión persistente de PEPCK</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Trigger 2 */}
            <div
              className="p-3 rounded-lg bg-[#faf2ee] hover:bg-[#f4ece8] transition-colors cursor-pointer border border-[#eee7e3]"
              onClick={() => toggleDetail('trig-2')}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="text-[13px] font-bold text-[#1e1b19]">
                  Infección Viral Postparto y Sueño Fragmentado
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#cb2044]/15 text-[#cb2044] text-[10px] font-bold">
                  Finales 2021
                </span>
              </div>
              <p className="text-[12px] text-[#3e4947] mt-1">
                Cuadro viral sistémico a los 4 meses postparto con deprivación de sueño (&lt;4.5 h/noche durante 16 semanas). Desbalance simpático-vagal agudo.
              </p>
              {expandedDetails['trig-2'] && (
                <div className="mt-2 pt-2 border-t border-[#e9e1dd] text-[11px] text-[#3e4947]">
                  <span>Caída de Sensibilidad: </span>
                  <strong className="text-[#cb2044]">~30% reducción aguda post-insomnio</strong>
                </div>
              )}
            </div>

            {/* Trigger 3 */}
            <div
              className="p-3 rounded-lg bg-[#faf2ee] hover:bg-[#f4ece8] transition-colors cursor-pointer border border-[#eee7e3]"
              onClick={() => toggleDetail('trig-3')}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="text-[13px] font-bold text-[#1e1b19]">
                  Antibióticos de Amplio Espectro Recurrentes
                </span>
                <span className="material-symbols-outlined text-[#6e7977] text-[16px]">medication</span>
              </div>
              <p className="text-[12px] text-[#3e4947] mt-1">
                2 ciclos de Ciprofloxacino seguidos de Amoxicilina-Clavulanato por mastitis y sinusitis. Agotamiento de clústeres de SCFA y colapso de Akkermansia.
              </p>
              {expandedDetails['trig-3'] && (
                <div className="mt-2 pt-2 border-t border-[#e9e1dd] text-[11px] text-[#3e4947]">
                  <span>Microbioma Post-Tx: </span>
                  <strong className="text-[#904d00]">Akkermansia cayó a niveles indetectables</strong>
                </div>
              )}
            </div>

            {/* Trigger 4 */}
            <div
              className="p-3 rounded-lg bg-[#faf2ee] hover:bg-[#f4ece8] transition-colors cursor-pointer border border-[#eee7e3]"
              onClick={() => toggleDetail('trig-4')}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="text-[13px] font-bold text-[#1e1b19]">
                  Fase Dietética Alta en Carbohidratos Ultraprocesados
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#faf2ee] text-[#904d00] text-[10px] font-bold">
                  Estresor Dietético
                </span>
              </div>
              <p className="text-[12px] text-[#3e4947] mt-1">
                Consumo elevado de jarabe de maíz alto en fructosa ante fatiga de lactancia. La fructosa elude PFK saturando la mitocondria hepática e iniciando DNL.
              </p>
              {expandedDetails['trig-4'] && (
                <div className="mt-2 pt-2 border-t border-[#e9e1dd] text-[11px] text-[#3e4947]">
                  <span>Vía Lipogénica: </span>
                  <strong className="text-[#a50030]">Hiperactivación de ChREBP y SREBP-1c</strong>
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 3: MEDIATORS */}
          <div className="flex flex-col gap-3 bg-[#ffffff] p-4 rounded-xl shadow-sm border border-[#e9e1dd]">
            <div className="flex items-center justify-between pb-2 border-b border-[#eee7e3]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#faf2ee] flex items-center justify-center text-[#cb2044]">
                  <span className="material-symbols-outlined text-[18px]">sync_problem</span>
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-[#1e1b19]">Mediadores</h3>
                  <span className="text-[10px] text-[#6e7977] block">Bucles Patológicos Autoperpetuantes</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#cb2044]/15 text-[#cb2044] text-[10px] font-bold">
                4 Autónomos
              </span>
            </div>

            {/* Mediator 1 */}
            <div
              className="p-3 rounded-lg bg-[#faf2ee] hover:bg-[#f4ece8] transition-colors cursor-pointer border border-[#eee7e3]"
              onClick={() => toggleDetail('med-1')}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="text-[13px] font-bold text-[#1e1b19]">
                  Diacilglicerol Ectópico Hepatocítico (DAG)
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#cb2044]/15 text-[#cb2044] text-[10px] font-bold">
                  Defecto Activo
                </span>
              </div>
              <p className="text-[12px] text-[#3e4947] mt-1">
                Acumulación de sn-1,2-diacilgliceroles citosólicos en hígado. Provoca traslocación de PKCε, bloqueando la actividad tirosina quinasa del receptor insulínico.
              </p>
              {expandedDetails['med-1'] && (
                <div className="mt-2 pt-2 border-t border-[#e9e1dd] text-[11px] text-[#3e4947] space-y-1">
                  <div className="flex justify-between">
                    <span>Indicador Clínico:</span>
                    <strong className="text-[#cb2044]">FLI = 64.8 (Elevado)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Bucle Autónomo:</span>
                    <strong className="text-[#1e1b19]">Fallo en glucogenogénesis perpetúa DNL</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Mediator 2 */}
            <div
              className="p-3 rounded-lg bg-[#faf2ee] hover:bg-[#f4ece8] transition-colors cursor-pointer border border-[#eee7e3]"
              onClick={() => toggleDetail('med-2')}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="text-[13px] font-bold text-[#1e1b19]">
                  Fosforilación en Serina IRS-1 vía PKCθ / IKKβ
                </span>
                <span className="material-symbols-outlined text-[#cb2044] text-[16px]">grain</span>
              </div>
              <p className="text-[12px] text-[#3e4947] mt-1">
                En miocitos esqueléticos, lípidos intramiocelulares fosforilan IRS-1 en Ser307 / Ser1101, bloqueando la cascada insulínica. Activación PI3K/Akt desciende 62%.
              </p>
              {expandedDetails['med-2'] && (
                <div className="mt-2 pt-2 border-t border-[#e9e1dd] text-[11px] text-[#3e4947]">
                  <span>Consecuencia Celular: </span>
                  <strong className="text-[#904d00]">Fallo en traslocación de GLUT4</strong>
                </div>
              )}
            </div>

            {/* Mediator 3 */}
            <div
              className="p-3 rounded-lg bg-[#faf2ee] hover:bg-[#f4ece8] transition-colors cursor-pointer border border-[#eee7e3]"
              onClick={() => toggleDetail('med-3')}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="text-[13px] font-bold text-[#1e1b19]">
                  Polarización Visceral M1 (TNF-α e IL-6)
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#cb2044]/15 text-[#cb2044] text-[10px] font-bold">
                  Inflamasoma
                </span>
              </div>
              <p className="text-[12px] text-[#3e4947] mt-1">
                Hipertrofia de adipocitos omentales con HIF-1α activando coronas macrofágicas. Liberación continua de TNF-α que desata lipólisis periférica descontrolada.
              </p>
              {expandedDetails['med-3'] && (
                <div className="mt-2 pt-2 border-t border-[#e9e1dd] text-[11px] text-[#3e4947]">
                  <span>hs-PCR Circulante: </span>
                  <strong className="text-[#904d00]">2.8 mg/L (Alerta cardiovascular)</strong>
                </div>
              )}
            </div>

            {/* Mediator 4 */}
            <div
              className="p-3 rounded-lg bg-[#faf2ee] hover:bg-[#f4ece8] transition-colors cursor-pointer border border-[#eee7e3]"
              onClick={() => toggleDetail('med-4')}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="text-[13px] font-bold text-[#1e1b19]">
                  Desacoplamiento de eNOS y Rarefacción Capilar
                </span>
                <span className="material-symbols-outlined text-[#6e7977] text-[16px]">blood_pressure</span>
              </div>
              <p className="text-[12px] text-[#3e4947] mt-1">
                Aniones superóxido oxidan BH4 a BH2; eNOS secreta peroxinitrito en vez de óxido nítrico. El reclutamiento capilar postprandial desciende un 45%.
              </p>
              {expandedDetails['med-4'] && (
                <div className="mt-2 pt-2 border-t border-[#e9e1dd] text-[11px] text-[#3e4947]">
                  <span>Déficit de Perfusión: </span>
                  <strong className="text-[#904d00]">Demora en llegada de insulina al lecho muscular</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 7 Functional Medicine Matrix Nodes */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#005c55]" />
              <h2 className="text-[20px] font-bold text-[#1e1b19]">
                Los 7 Nodos de la Matriz de Medicina Funcional
              </h2>
            </div>
            <p className="text-[13px] text-[#6e7977]">
              Evaluación de fisiología clínica intersistémica para Eleanor Vance. Haga clic en cualquier nodo para revisar parámetros y vías de restauración biológica.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded bg-[#ffdcc3] text-[#2f1500] text-[11px] font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fe932c]" /> 6 Fricción Moderada
            </span>
            <span className="px-2.5 py-1 rounded bg-[#ffdadb] text-[#40000d] text-[11px] font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#cb2044]" /> 1 Resistencia Severa
            </span>
          </div>
        </div>

        {/* 7 Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.values(MATRIX_NODES_DATA).map((node) => (
            <div
              key={node.id}
              className={`bg-[#ffffff] p-4 rounded-xl shadow-sm border border-[#e9e1dd] flex flex-col justify-between hover:shadow-md transition-all group ${
                node.id === 'communication' ? 'ring-2 ring-[#cb2044]/30' : ''
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#faf2ee] group-hover:bg-[#005c55] group-hover:text-white flex items-center justify-center text-[#005c55] transition-colors">
                      <span className="material-symbols-outlined text-[18px]">{node.icon}</span>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6e7977]">
                      {node.nodeNumber}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      node.statusType === 'severe'
                        ? 'bg-[#ffdadb] text-[#40000d]'
                        : 'bg-[#ffdcc3] text-[#2f1500]'
                    }`}
                  >
                    {node.statusText}
                  </span>
                </div>

                <h3 className="text-[15px] font-bold text-[#1e1b19] mt-2">{node.name}</h3>
                <p className="text-[11px] text-[#6e7977] leading-tight mb-3">{node.subtitle}</p>

                <div className="space-y-2 pt-1 border-t border-[#f4ece8]">
                  {node.parameters.map((param, pIdx) => (
                    <div key={pIdx} className="space-y-0.5">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-[#6e7977]">{param.label}</span>
                        <span className={`font-semibold ${param.colorClass || 'text-[#1e1b19]'}`}>
                          {param.value}
                        </span>
                      </div>
                      {param.barPercent && (
                        <div className="w-full bg-[#eee7e3] h-1 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${param.colorClass || 'bg-[#005c55]'}`}
                            style={{ width: `${param.barPercent}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-[#eee7e3] flex items-center justify-between">
                <span className="text-[11px] text-[#005c55] font-semibold flex items-center gap-1 truncate max-w-[170px]">
                  <span className="material-symbols-outlined text-[14px]">{node.treatmentIcon}</span>
                  <span className="truncate">{node.treatmentTag}</span>
                </span>
                <button
                  onClick={() => onOpenInspector(node)}
                  className={`w-7 h-7 rounded flex items-center justify-center transition-colors cursor-pointer ${
                    node.id === 'communication'
                      ? 'bg-[#cb2044] text-white hover:bg-[#a50030]'
                      : 'bg-[#faf2ee] hover:bg-[#f4ece8] text-[#1e1b19]'
                  }`}
                  title="Inspeccionar detalles y protocolo"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>
          ))}

          {/* CDSS Synthesis Action Card */}
          <div className="bg-gradient-to-br from-[#faf2ee] to-[#f4ece8] p-4 rounded-xl shadow-sm border border-[#e9e1dd] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[#005c55]">
                <span className="material-symbols-outlined text-[20px]">psychology</span>
                <span className="text-[14px] font-bold">Síntesis CDSS</span>
              </div>
              <p className="text-[12px] text-[#3e4947] mt-2 leading-relaxed">
                Nodo terapéutico primario de apalancamiento: <strong className="text-[#1e1b19]">Nodo 06 (Comunicación)</strong> acoplado con <strong className="text-[#1e1b19]">Nodo 01 (Asimilación)</strong>.
              </p>
              <div className="mt-3 p-2.5 rounded-lg bg-[#ffffff] text-[11px] flex flex-col gap-1 border border-[#e9e1dd]">
                <div className="text-[#1e1b19] font-bold">Secuencia Recomendada Fase 1:</div>
                <div className="text-[#3e4947]">• 1. Sello de barrera intestinal y neutralización LPS</div>
                <div className="text-[#3e4947]">• 2. Fitoma de berberina 500mg BID</div>
                <div className="text-[#3e4947]">• 3. Ejercicio en Zona 2 (150 min/sem)</div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('therapeutics-matrix')}
              className="mt-4 w-full py-2 px-3 rounded-lg bg-[#005c55] hover:bg-[#0f766e] text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <span>Aplicar Matriz Terapéutica</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
