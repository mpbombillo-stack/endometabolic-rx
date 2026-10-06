import React, { useState } from 'react';
import { PatientLabs, SurrogateResults, PatientProfile, MedicalProfessional } from '../types';
import { calculateSurrogates } from '../utils/metabolicCalculators';
import { exportSurrogatesPdfReport } from '../utils/pdfReportGenerator';

interface SurrogateIndicesScreenProps {
  labs: PatientLabs;
  patient?: PatientProfile;
  doctor?: MedicalProfessional;
  onUpdateLabs: (newLabs: PatientLabs) => void;
  onShowToast: (msg: string) => void;
  onOpenFhir: () => void;
}

export const SurrogateIndicesScreen: React.FC<SurrogateIndicesScreenProps> = ({
  labs,
  patient,
  doctor,
  onUpdateLabs,
  onShowToast,
  onOpenFhir,
}) => {
  const [formState, setFormState] = useState<PatientLabs>({ ...labs });
  const results: SurrogateResults = calculateSurrogates(labs);

  const handleInputChange = (field: keyof PatientLabs, val: string | number) => {
    setFormState((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const handleRecalculate = () => {
    onUpdateLabs({ ...formState });
    onShowToast('¡Biomarcadores subrogados recalculados exitosamente!');
  };

  const handleReset = () => {
    const defaults: PatientLabs = {
      glucoseFasting: 98,
      insulinFasting: 14.8,
      triglycerides: 172,
      hdl: 41,
      bmi: 28.4,
      waistCm: 89,
      ggt: 34,
      sex: 'female',
    };
    setFormState(defaults);
    onUpdateLabs(defaults);
    onShowToast('Valores basales restaurados para el paciente.');
  };

  const handleExportReport = () => {
    if (!patient || !doctor) {
      onShowToast('Generando reporte clínico de Índices Subrogados en PDF...');
      return;
    }
    onShowToast('Generando e imprimiendo reporte de Índices Subrogados en PDF...');
    exportSurrogatesPdfReport({
      patient,
      doctor,
      labs: formState,
    });
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Dynamic Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-y-3">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-3">
            <h1 className="text-[22px] md:text-[24px] font-bold text-[#1e1b19] tracking-tight">
              Calculadora de Índices Subrogados y Fenotipo Metabólico
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#005c55]/10 text-[#005c55] text-[11px] font-bold">
              <span className="material-symbols-outlined text-[14px]">tune</span>
              CDSS Algorítmico v4.1
            </span>
          </div>
          <p className="text-[13px] text-[#6e7977]">
            Modelado subrogado multiorgánico de alta precisión para identificar resistencia a la insulina subclínica funcional previa a la disglicemia convencional.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#faf2ee] border border-[#e9e1dd] shadow-sm text-[12px]">
          <span className="w-2 h-2 rounded-full bg-[#fe932c] animate-pulse" />
          <span className="text-[#1e1b19]">
            Último cálculo: <strong className="font-semibold text-[#005c55]">en tiempo real</strong>
          </span>
          <span className="text-[#bdc9c6]">•</span>
          <span className="text-[#6e7977]">8 Biomarcadores Subrogados Evaluados</span>
        </div>
      </div>

      {/* Main Split: 35% Left Inputs | 65% Right Results */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Diagnostic Input Formulation */}
        <div className="xl:col-span-4 flex flex-col gap-4 bg-[#ffffff] rounded-xl shadow-sm p-5 border border-[#e9e1dd]">
          <div className="flex items-center justify-between pb-3 border-b border-[#eee7e3]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#005c55] text-[20px]">biotech</span>
              <h2 className="text-[15px] font-bold text-[#1e1b19]">
                Entrada de Laboratorio del Paciente
              </h2>
            </div>
            <span className="text-[11px] text-[#6e7977] uppercase tracking-wider font-bold">
              Cohorte en Ayunas
            </span>
          </div>

          {/* Clinical Reference Callout */}
          <div className="p-3 rounded-lg bg-[#faf2ee] flex items-start gap-2 border border-[#eee7e3]">
            <span className="material-symbols-outlined text-[#005c55] text-[18px] shrink-0 mt-0.5">
              info
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-bold text-[#005c55]">
                Mandato de Referencia en Medicina Funcional
              </span>
              <p className="text-[11.5px] text-[#3e4947] leading-tight">
                Los valores de referencia óptimos priorizan la homeostasis sistémica por encima de la normalidad poblacional promediada, identificando la fricción celular entre 5 y 10 años antes de la hiperglucemia en ayunas.
              </p>
            </div>
          </div>

          {/* Input Form Fields */}
          <div className="flex flex-col gap-3">
            {/* Sex */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#1e1b19] flex items-center justify-between">
                <span>Sexo Biológico</span>
                <span className="text-[11px] text-[#6e7977] font-normal">Ajuste fenotípico</span>
              </label>
              <div className="relative">
                <select
                  value={formState.sex}
                  onChange={(e) => handleInputChange('sex', e.target.value as 'female' | 'male')}
                  className="w-full bg-[#ffffff] text-[#1e1b19] text-[13px] rounded-lg py-1.5 px-3 border border-[#bdc9c6] shadow-sm focus:outline-none focus:ring-1 focus:ring-[#005c55]"
                >
                  <option value="female">Femenino (Asignado al nacer)</option>
                  <option value="male">Masculino (Asignado al nacer)</option>
                </select>
              </div>
            </div>

            {/* Fasting Glucose */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[12px]">
                <label className="text-[#1e1b19] font-medium">Glucosa en Ayunas (mg/dL)</label>
                <span className="text-[11px] text-[#005c55]">Ópt: 72–86 mg/dL</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={formState.glucoseFasting}
                  onChange={(e) => handleInputChange('glucoseFasting', parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#ffffff] text-[#1e1b19] text-[13px] rounded-lg py-1.5 px-3 border border-[#bdc9c6] shadow-sm focus:outline-none focus:ring-1 focus:ring-[#005c55]"
                />
                <span className="absolute right-3 top-2 text-[#6e7977] text-[11px]">mg/dL</span>
              </div>
            </div>

            {/* Fasting Insulin */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[12px]">
                <label className="text-[#1e1b19] font-medium">Insulina en Ayunas (μIU/mL)</label>
                <span className="text-[11px] text-[#005c55]">Ópt: &lt; 5.0 μIU/mL</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={formState.insulinFasting}
                  onChange={(e) => handleInputChange('insulinFasting', parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#ffffff] text-[#1e1b19] text-[13px] rounded-lg py-1.5 px-3 border border-[#bdc9c6] shadow-sm focus:outline-none focus:ring-1 focus:ring-[#005c55]"
                />
                <span className="absolute right-3 top-2 text-[#6e7977] text-[11px]">μIU/mL</span>
              </div>
            </div>

            {/* Triglycerides */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[12px]">
                <label className="text-[#1e1b19] font-medium">Triglicéridos Séricos (mg/dL)</label>
                <span className="text-[11px] text-[#005c55]">Ópt: &lt; 90 mg/dL</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  value={formState.triglycerides}
                  onChange={(e) => handleInputChange('triglycerides', parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#ffffff] text-[#1e1b19] text-[13px] rounded-lg py-1.5 px-3 border border-[#bdc9c6] shadow-sm focus:outline-none focus:ring-1 focus:ring-[#005c55]"
                />
                <span className="absolute right-3 top-2 text-[#6e7977] text-[11px]">mg/dL</span>
              </div>
            </div>

            {/* HDL */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[12px]">
                <label className="text-[#1e1b19] font-medium">Colesterol HDL (mg/dL)</label>
                <span className="text-[11px] text-[#005c55]">Ópt: &gt; 55 (F) / &gt; 50 (M)</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  value={formState.hdl}
                  onChange={(e) => handleInputChange('hdl', parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#ffffff] text-[#1e1b19] text-[13px] rounded-lg py-1.5 px-3 border border-[#bdc9c6] shadow-sm focus:outline-none focus:ring-1 focus:ring-[#005c55]"
                />
                <span className="absolute right-3 top-2 text-[#6e7977] text-[11px]">mg/dL</span>
              </div>
            </div>

            {/* BMI */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[12px]">
                <label className="text-[#1e1b19] font-medium">Índice de Masa Corporal (IMC)</label>
                <span className="text-[11px] text-[#005c55]">Ópt: 19.5–23.0</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={formState.bmi}
                  onChange={(e) => handleInputChange('bmi', parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#ffffff] text-[#1e1b19] text-[13px] rounded-lg py-1.5 px-3 border border-[#bdc9c6] shadow-sm focus:outline-none focus:ring-1 focus:ring-[#005c55]"
                />
                <span className="absolute right-3 top-2 text-[#6e7977] text-[11px]">kg/m²</span>
              </div>
            </div>

            {/* Waist Circumference */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[12px]">
                <label className="text-[#1e1b19] font-medium">Circunferencia de Cintura (cm)</label>
                <span className="text-[11px] text-[#005c55]">Ópt: &lt; 80cm (F) / &lt; 90cm (M)</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={formState.waistCm}
                  onChange={(e) => handleInputChange('waistCm', parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#ffffff] text-[#1e1b19] text-[13px] rounded-lg py-1.5 px-3 border border-[#bdc9c6] shadow-sm focus:outline-none focus:ring-1 focus:ring-[#005c55]"
                />
                <span className="absolute right-3 top-2 text-[#6e7977] text-[11px]">cm</span>
              </div>
            </div>

            {/* GGT */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[12px]">
                <label className="text-[#1e1b19] font-medium">GGT (Gamma-Glutamil Transferasa)</label>
                <span className="text-[11px] text-[#005c55]">Ópt: &lt; 18 U/L</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  value={formState.ggt}
                  onChange={(e) => handleInputChange('ggt', parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#ffffff] text-[#1e1b19] text-[13px] rounded-lg py-1.5 px-3 border border-[#bdc9c6] shadow-sm focus:outline-none focus:ring-1 focus:ring-[#005c55]"
                />
                <span className="absolute right-3 top-2 text-[#6e7977] text-[11px]">U/L</span>
              </div>
            </div>

            {/* Form Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleRecalculate}
                className="w-full bg-[#005c55] hover:bg-[#0f766e] text-white text-[13px] font-bold py-2.5 px-4 rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">calculate</span>
                <span>Recalcular Índices</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="w-full bg-[#faf2ee] hover:bg-[#f4ece8] text-[#1e1b19] text-[12px] font-semibold py-2 px-4 rounded-lg border border-[#e9e1dd] shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-[#6e7977]">restart_alt</span>
                <span>Restablecer Valores Basales</span>
              </button>
            </div>
          </div>

          {/* Dynamic Friction Meter */}
          <div className="mt-2 p-3 rounded-lg bg-[#faf2ee] border border-[#e9e1dd] flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[12px]">
              <span className="text-[#3e4947] font-medium">Fricción Metabólica Acumulativa</span>
              <span className="text-[#cb2044] font-bold tabular-nums">
                {results.frictionPercent}% Firmas Positivas
              </span>
            </div>
            <div className="w-full bg-[#eee7e3] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#cb2044] h-full transition-all duration-500 rounded-full"
                style={{ width: `${results.frictionPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#6e7977]">
              <span>Homeostático</span>
              <span>Compensado</span>
              <span className="text-[#cb2044] font-semibold">RI Establecida</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: 8 Metric Result Cards */}
        <div className="xl:col-span-8 flex flex-col gap-4">
          {/* Header Summary */}
          <div className="p-4 rounded-xl bg-[#ffffff] shadow-sm border border-[#e9e1dd] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-[#1e1b19]">
                Evaluación del Perfil Fenotípico
              </span>
              <span className="px-2 py-0.5 rounded bg-[#ffdadb] text-[#a50030] text-[11px] font-bold">
                Estrato 2B: Resistencia Severa del Receptor
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1 text-[#005c55] font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#005c55]" />
                Óptimo (0)
              </span>
              <span className="text-[#bdc9c6]">|</span>
              <span className="inline-flex items-center gap-1 text-[#904d00] font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#fe932c]" />
                Fricción (4)
              </span>
              <span className="text-[#bdc9c6]">|</span>
              <span className="inline-flex items-center gap-1 text-[#a50030] font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#cb2044]" />
                Resistencia (4)
              </span>
            </div>
          </div>

          {/* 8 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CARD 1: HOMA-IR */}
            <div className="bg-[#ffffff] rounded-xl shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden border border-[#e9e1dd]">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#fe932c]" />
              <div className="pl-2">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <span className="text-[16px] font-bold text-[#1e1b19] block">HOMA-IR</span>
                    <span className="text-[11px] text-[#6e7977]">
                      Modelo Homeostático de Resistencia a la Insulina
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#ffdcc3] text-[#2f1500] text-[10px] font-bold whitespace-nowrap">
                    Fricción Metabólica
                  </span>
                </div>

                <div className="flex items-baseline justify-between my-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[28px] text-[#1e1b19] font-bold tracking-tight tabular-nums">
                      {results.homaIr}
                    </span>
                    <span className="text-[11px] text-[#6e7977]">índice</span>
                  </div>
                  <svg className="w-20 h-6 text-[#fe932c]" fill="none" stroke="currentColor" viewBox="0 0 80 24">
                    <path d="M0 20 L25 18 L50 12 L80 4" strokeLinecap="round" strokeWidth="2.2" />
                    <circle cx="80" cy="4" fill="currentColor" r="2.5" />
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-2 py-1.5 px-2.5 my-1 rounded bg-[#faf2ee] text-[11px] border border-[#eee7e3]">
                  <div>
                    <span className="text-[#6e7977] block font-medium">Punto Corte Convencional</span>
                    <span className="font-semibold text-[#1e1b19]">&gt; 2.50</span>
                  </div>
                  <div>
                    <span className="text-[#005c55] block font-medium">Punto Corte Funcional</span>
                    <span className="font-semibold text-[#904d00]">&gt; 1.40 (Ópt &lt; 1.0)</span>
                  </div>
                </div>
              </div>
              <p className="pt-2 pl-2 text-[12px] text-[#3e4947] leading-snug">
                Regulación a la baja periférica y hepática del receptor. La insulina basal indica un estado hipercompensatorio pancreático prolongado.
              </p>
            </div>

            {/* CARD 2: QUICKI */}
            <div className="bg-[#ffffff] rounded-xl shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden border border-[#e9e1dd]">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#fe932c]" />
              <div className="pl-2">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <span className="text-[16px] font-bold text-[#1e1b19] block">QUICKI</span>
                    <span className="text-[11px] text-[#6e7977]">
                      Índice Cuantitativo de Sensibilidad a la Insulina
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#ffdcc3] text-[#2f1500] text-[10px] font-bold whitespace-nowrap">
                    Subóptimo / Fricción
                  </span>
                </div>

                <div className="flex items-baseline justify-between my-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[28px] text-[#1e1b19] font-bold tracking-tight tabular-nums">
                      {results.quicki}
                    </span>
                    <span className="text-[11px] text-[#6e7977]">ratio</span>
                  </div>
                  <svg className="w-20 h-6 text-[#fe932c]" fill="none" stroke="currentColor" viewBox="0 0 80 24">
                    <path d="M0 6 L30 8 L55 16 L80 20" strokeLinecap="round" strokeWidth="2.2" />
                    <circle cx="80" cy="20" fill="currentColor" r="2.5" />
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-2 py-1.5 px-2.5 my-1 rounded bg-[#faf2ee] text-[11px] border border-[#eee7e3]">
                  <div>
                    <span className="text-[#6e7977] block font-medium">Punto Corte Convencional</span>
                    <span className="font-semibold text-[#1e1b19]">&lt; 0.330</span>
                  </div>
                  <div>
                    <span className="text-[#005c55] block font-medium">Punto Corte Funcional</span>
                    <span className="font-semibold text-[#904d00]">&lt; 0.380 (Ópt &gt; 0.382)</span>
                  </div>
                </div>
              </div>
              <p className="pt-2 pl-2 text-[12px] text-[#3e4947] leading-snug">
                Declive temprano en la capacidad de respuesta insulínica de cuerpo entero. El ratio logarítmico evidencia una cinética amortiguada.
              </p>
            </div>

            {/* CARD 3: TyG Index */}
            <div className="bg-[#ffffff] rounded-xl shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden border border-[#e9e1dd]">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#cb2044]" />
              <div className="pl-2">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <span className="text-[16px] font-bold text-[#1e1b19] block">Índice TyG</span>
                    <span className="text-[11px] text-[#6e7977]">
                      Índice Triglicéridos-Glucosa
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#ffdadb] text-[#40000d] text-[10px] font-bold whitespace-nowrap">
                    Resistencia a la Insulina
                  </span>
                </div>

                <div className="flex items-baseline justify-between my-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[28px] text-[#cb2044] font-bold tracking-tight tabular-nums">
                      {results.tyg}
                    </span>
                    <span className="text-[11px] text-[#6e7977]">ln</span>
                  </div>
                  <svg className="w-20 h-6 text-[#cb2044]" fill="none" stroke="currentColor" viewBox="0 0 80 24">
                    <path d="M0 20 L25 17 L55 11 L80 4" strokeLinecap="round" strokeWidth="2.2" />
                    <circle cx="80" cy="4" fill="currentColor" r="2.5" />
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-2 py-1.5 px-2.5 my-1 rounded bg-[#faf2ee] text-[11px] border border-[#eee7e3]">
                  <div>
                    <span className="text-[#6e7977] block font-medium">Punto Corte Convencional</span>
                    <span className="font-semibold text-[#1e1b19]">≥ 8.65</span>
                  </div>
                  <div>
                    <span className="text-[#005c55] block font-medium">Punto Corte Funcional</span>
                    <span className="font-semibold text-[#cb2044]">≥ 8.10 (Ópt &lt; 7.80)</span>
                  </div>
                </div>
              </div>
              <p className="pt-2 pl-2 text-[12px] text-[#3e4947] leading-snug">
                Fuerte subrogado de sensibilidad muscular y visceral. Correlaciona directamente con los umbrales del clamp hiperinsulinémico-euglucémico.
              </p>
            </div>

            {/* CARD 4: TyG-BMI */}
            <div className="bg-[#ffffff] rounded-xl shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden border border-[#e9e1dd]">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#cb2044]" />
              <div className="pl-2">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <span className="text-[16px] font-bold text-[#1e1b19] block">TyG-BMI</span>
                    <span className="text-[11px] text-[#6e7977]">
                      Índice Glucémico Antropométrico Integrado
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#ffdadb] text-[#40000d] text-[10px] font-bold whitespace-nowrap">
                    Resistencia a la Insulina
                  </span>
                </div>

                <div className="flex items-baseline justify-between my-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[28px] text-[#cb2044] font-bold tracking-tight tabular-nums">
                      {results.tygBmi}
                    </span>
                    <span className="text-[11px] text-[#6e7977]">puntuación</span>
                  </div>
                  <svg className="w-20 h-6 text-[#cb2044]" fill="none" stroke="currentColor" viewBox="0 0 80 24">
                    <path d="M0 22 L30 19 L60 9 L80 3" strokeLinecap="round" strokeWidth="2.2" />
                    <circle cx="80" cy="3" fill="currentColor" r="2.5" />
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-2 py-1.5 px-2.5 my-1 rounded bg-[#faf2ee] text-[11px] border border-[#eee7e3]">
                  <div>
                    <span className="text-[#6e7977] block font-medium">Punto Corte Convencional</span>
                    <span className="font-semibold text-[#1e1b19]">≥ 230.0</span>
                  </div>
                  <div>
                    <span className="text-[#005c55] block font-medium">Punto Corte Funcional</span>
                    <span className="font-semibold text-[#cb2044]">≥ 190.0 (Ópt &lt; 165.0)</span>
                  </div>
                </div>
              </div>
              <p className="pt-2 pl-2 text-[12px] text-[#3e4947] leading-snug">
                Sobrecarga sustancial derivada de adiposidad visceral. Efecto potenciador entre la carga antropométrica y la saturación lipídica-glucídica.
              </p>
            </div>

            {/* CARD 5: METS-IR */}
            <div className="bg-[#ffffff] rounded-xl shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden border border-[#e9e1dd]">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#fe932c]" />
              <div className="pl-2">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <span className="text-[16px] font-bold text-[#1e1b19] block">METS-IR</span>
                    <span className="text-[11px] text-[#6e7977]">
                      Puntuación Metabólica para Resistencia a la Insulina
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#ffdcc3] text-[#2f1500] text-[10px] font-bold whitespace-nowrap">
                    Riesgo Elevado
                  </span>
                </div>

                <div className="flex items-baseline justify-between my-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[28px] text-[#1e1b19] font-bold tracking-tight tabular-nums">
                      {results.metsIr}
                    </span>
                    <span className="text-[11px] text-[#6e7977]">puntos</span>
                  </div>
                  <svg className="w-20 h-6 text-[#fe932c]" fill="none" stroke="currentColor" viewBox="0 0 80 24">
                    <path d="M0 18 L25 15 L50 11 L80 6" strokeLinecap="round" strokeWidth="2.2" />
                    <circle cx="80" cy="6" fill="currentColor" r="2.5" />
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-2 py-1.5 px-2.5 my-1 rounded bg-[#faf2ee] text-[11px] border border-[#eee7e3]">
                  <div>
                    <span className="text-[#6e7977] block font-medium">Punto Corte Convencional</span>
                    <span className="font-semibold text-[#1e1b19]">≥ 50.0</span>
                  </div>
                  <div>
                    <span className="text-[#005c55] block font-medium">Punto Corte Funcional</span>
                    <span className="font-semibold text-[#904d00]">≥ 39.0 (Ópt &lt; 35.0)</span>
                  </div>
                </div>
              </div>
              <p className="pt-2 pl-2 text-[12px] text-[#3e4947] leading-snug">
                Detección de alteración cardiometabólica temprana. Cuantifica el bloqueo en la captación periférica de glucosa por exceso de ácidos grasos libres.
              </p>
            </div>

            {/* CARD 6: LAP */}
            <div className="bg-[#ffffff] rounded-xl shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden border border-[#e9e1dd]">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#cb2044]" />
              <div className="pl-2">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <span className="text-[16px] font-bold text-[#1e1b19] block">LAP</span>
                    <span className="text-[11px] text-[#6e7977]">
                      Producto de Acumulación Lipídica
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#ffdadb] text-[#40000d] text-[10px] font-bold whitespace-nowrap">
                    Acumulación Elevada
                  </span>
                </div>

                <div className="flex items-baseline justify-between my-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[28px] text-[#cb2044] font-bold tracking-tight tabular-nums">
                      {results.lap}
                    </span>
                    <span className="text-[11px] text-[#6e7977]">cm·mmol/L</span>
                  </div>
                  <svg className="w-20 h-6 text-[#cb2044]" fill="none" stroke="currentColor" viewBox="0 0 80 24">
                    <path d="M0 22 L20 18 L50 10 L80 2" strokeLinecap="round" strokeWidth="2.2" />
                    <circle cx="80" cy="2" fill="currentColor" r="2.5" />
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-2 py-1.5 px-2.5 my-1 rounded bg-[#faf2ee] text-[11px] border border-[#eee7e3]">
                  <div>
                    <span className="text-[#6e7977] block font-medium">Punto Corte Convencional</span>
                    <span className="font-semibold text-[#1e1b19]">&gt; 42.0 (F)</span>
                  </div>
                  <div>
                    <span className="text-[#005c55] block font-medium">Punto Corte Funcional</span>
                    <span className="font-semibold text-[#cb2044]">&gt; 28.0 (F) (Ópt &lt; 20)</span>
                  </div>
                </div>
              </div>
              <p className="pt-2 pl-2 text-[12px] text-[#3e4947] leading-snug">
                Acreción de lípidos ectópicos y tronculares. Correlaciona con un mayor flujo de ácidos grasos libres hacia la circulación portal y daño endotelial.
              </p>
            </div>

            {/* CARD 7: VAI */}
            <div className="bg-[#ffffff] rounded-xl shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden border border-[#e9e1dd]">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#fe932c]" />
              <div className="pl-2">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <span className="text-[16px] font-bold text-[#1e1b19] block">VAI</span>
                    <span className="text-[11px] text-[#6e7977]">
                      Índice de Adiposidad Visceral
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#ffdcc3] text-[#2f1500] text-[10px] font-bold whitespace-nowrap">
                    Fricción
                  </span>
                </div>

                <div className="flex items-baseline justify-between my-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[28px] text-[#1e1b19] font-bold tracking-tight tabular-nums">
                      {results.vai}
                    </span>
                    <span className="text-[11px] text-[#6e7977]">puntuación</span>
                  </div>
                  <svg className="w-20 h-6 text-[#fe932c]" fill="none" stroke="currentColor" viewBox="0 0 80 24">
                    <path d="M0 16 L28 14 L56 9 L80 5" strokeLinecap="round" strokeWidth="2.2" />
                    <circle cx="80" cy="5" fill="currentColor" r="2.5" />
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-2 py-1.5 px-2.5 my-1 rounded bg-[#faf2ee] text-[11px] border border-[#eee7e3]">
                  <div>
                    <span className="text-[#6e7977] block font-medium">Punto Corte Convencional</span>
                    <span className="font-semibold text-[#1e1b19]">&gt; 2.52</span>
                  </div>
                  <div>
                    <span className="text-[#005c55] block font-medium">Punto Corte Funcional</span>
                    <span className="font-semibold text-[#904d00]">&gt; 1.50 (Ópt &lt; 1.0)</span>
                  </div>
                </div>
              </div>
              <p className="pt-2 pl-2 text-[12px] text-[#3e4947] leading-snug">
                Disfunción del tejido adiposo visceral y secreción de citocinas proinflamatorias. Marcador sensible de alteraciones endocrinas dependientes de grasa visceral.
              </p>
            </div>

            {/* CARD 8: FLI */}
            <div className="bg-[#ffffff] rounded-xl shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden border border-[#e9e1dd]">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#cb2044]" />
              <div className="pl-2">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <span className="text-[16px] font-bold text-[#1e1b19] block">FLI</span>
                    <span className="text-[11px] text-[#6e7977]">
                      Índice de Hígado Graso
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#ffdadb] text-[#40000d] text-[10px] font-bold whitespace-nowrap">
                    Alta Probabilidad MASLD
                  </span>
                </div>

                <div className="flex items-baseline justify-between my-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[28px] text-[#cb2044] font-bold tracking-tight tabular-nums">
                      {results.fli}
                    </span>
                    <span className="text-[11px] text-[#6e7977]">puntuación (0–100)</span>
                  </div>
                  <svg className="w-20 h-6 text-[#cb2044]" fill="none" stroke="currentColor" viewBox="0 0 80 24">
                    <path d="M0 20 L25 15 L50 9 L80 3" strokeLinecap="round" strokeWidth="2.2" />
                    <circle cx="80" cy="3" fill="currentColor" r="2.5" />
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-2 py-1.5 px-2.5 my-1 rounded bg-[#faf2ee] text-[11px] border border-[#eee7e3]">
                  <div>
                    <span className="text-[#6e7977] block font-medium">Punto Corte Convencional</span>
                    <span className="font-semibold text-[#1e1b19]">≥ 60.0</span>
                  </div>
                  <div>
                    <span className="text-[#005c55] block font-medium">Punto Corte Funcional</span>
                    <span className="font-semibold text-[#cb2044]">≥ 30.0 (Ópt &lt; 20.0)</span>
                  </div>
                </div>
              </div>
              <p className="pt-2 pl-2 text-[12px] text-[#3e4947] leading-snug">
                Riesgo de esteatosis hepática que amerita protocolo dirigido de biotransformación. Evidencia alteración en la secreción de VLDL y sobrecarga intrahepática.
              </p>
            </div>
          </div>

          {/* Actionable Clinical Synthesis Drawer */}
          <div className="p-4 rounded-xl bg-[#ffffff] shadow-sm border border-[#e9e1dd] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ffdcc3] flex items-center justify-center shrink-0 text-[#904d00]">
                <span className="material-symbols-outlined text-[22px]">medical_services</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-[#1e1b19]">
                  Vía de Intervención CDSS: Fase 1 - Reseteo Metabólico
                </span>
                <span className="text-[12px] text-[#6e7977]">
                  Enfoque recomendado: protocolo de aclaramiento hepático, activación de AMPK y alimentación restringida en el tiempo.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={handleExportReport}
                className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-[#faf2ee] hover:bg-[#f4ece8] text-[#1e1b19] text-[12px] font-semibold transition-colors flex items-center justify-center gap-1 border border-[#e9e1dd] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>Exportar Informe</span>
              </button>
              <button
                type="button"
                onClick={onOpenFhir}
                className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-[#005c55] hover:bg-[#0f766e] text-white text-[12px] font-semibold transition-colors shadow-sm flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">sync_saved_locally</span>
                <span>Actualizar FHIR</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
