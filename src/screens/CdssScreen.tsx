import React, { useState } from 'react';
import { PatientProfile, MedicalProfessional } from '../types';
import { exportCdssPdfReport } from '../utils/pdfReportGenerator';

interface CdssScreenProps {
  patient?: PatientProfile;
  doctor?: MedicalProfessional;
  onOpenFhir: () => void;
  onShowToast: (msg: string) => void;
}

export const CdssScreen: React.FC<CdssScreenProps> = ({
  patient,
  doctor,
  onOpenFhir,
  onShowToast,
}) => {
  const [selectedStratum, setSelectedStratum] = useState<number>(2);

  const handleDownloadShapCsv = () => {
    const patientName = patient?.fullName || 'Eleanor Vance';
    const csvContent =
      'Feature,SHAP_Value,Attribution_Percentage,Baseline_Value,Patient_Value\n' +
      'TyG Index,0.806,28.4%,7.80,8.84\n' +
      'Kraft 120-min Delayed Peak,0.627,22.1%,<60 uIU/mL,124.0 uIU/mL\n' +
      'Fasting Insulin,0.528,18.6%,<5.0 uIU/mL,14.8 uIU/mL\n' +
      'Glycemic Variability (CV),0.349,12.3%,<20%,24.2%\n' +
      'Visceral Adiposity Index (VAI),0.269,9.5%,<1.0,2.45\n' +
      'hs-CRP Vascular Inflammation,0.164,5.8%,<1.0 mg/L,2.1 mg/L\n' +
      'GGT Oxidative / Steatosis,0.093,3.3%,<18 U/L,34 U/L\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SHAP_Attributions_${patientName.replace(/\s+/g, '_')}_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('Descargando Matriz de Atribuciones SHAP en CSV...');
  };

  const handleExportConsultNote = () => {
    if (!patient || !doctor) {
      onShowToast('Generando Nota de Consulta Clínica Integrativa en PDF...');
      return;
    }
    onShowToast('Generando e imprimiendo Nota de Consulta CDSS en PDF...');
    exportCdssPdfReport({
      patient,
      doctor,
      selectedStratum,
    });
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Stratum Clinical Progress Timeline */}
      <div className="w-full bg-[#ffffff] p-4 md:p-5 shadow-sm rounded-xl border border-[#e9e1dd]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#6e7977] font-bold">
              PROGRESIÓN FENOTÍPICA CONTINUA
            </span>
            <h2 className="text-[20px] font-bold text-[#1e1b19]">
              Espectro de Estratos de Riesgo Metabólico
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-[#faf2ee] px-3.5 py-1.5 rounded-lg border border-[#e9e1dd]">
            <span className="material-symbols-outlined text-[#005c55] text-[18px]">verified_user</span>
            <span className="text-[12px] text-[#1e1b19] font-bold">Protocolo Estrato 2 Activo</span>
            <span className="text-[11px] text-[#6e7977]">Confianza: 96.4%</span>
          </div>
        </div>

        {/* 4-Stage Clinical Stratum Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Stratum 0 */}
          <div
            onClick={() => setSelectedStratum(0)}
            className={`p-4 rounded-lg flex flex-col justify-between transition-all cursor-pointer border ${
              selectedStratum === 0
                ? 'bg-[#ffffff] ring-2 ring-[#005c55] shadow-md border-[#005c55]'
                : 'bg-[#faf2ee] opacity-75 hover:opacity-100 border-[#eee7e3]'
            }`}
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-[#6e7977]">Estrato 0</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#e9e1dd] text-[#3e4947]">
                  Objetivo Basal
                </span>
              </div>
              <span className="text-[15px] font-bold text-[#1e1b19]">Sensibilidad Óptima</span>
              <p className="text-[12px] text-[#6e7977] mt-1 leading-snug">
                Insulina Basal &lt; 5 µIU/mL, HOMA-IR &lt; 1.0, Patrón Kraft I (aclaramiento rápido).
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-[#eee7e3] flex items-center justify-between text-[11px] text-[#6e7977]">
              <span>Horizonte Objetivo</span>
              <span className="font-bold text-[#005c55]">Meta: Q3 2025</span>
            </div>
          </div>

          {/* Stratum 1 */}
          <div
            onClick={() => setSelectedStratum(1)}
            className={`p-4 rounded-lg flex flex-col justify-between transition-all cursor-pointer border ${
              selectedStratum === 1
                ? 'bg-[#ffffff] ring-2 ring-[#005c55] shadow-md border-[#005c55]'
                : 'bg-[#faf2ee] border-[#eee7e3]'
            }`}
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-[#6e7977]">Estrato 1</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#005c55]/10 text-[#005c55]">
                  Fase Previa
                </span>
              </div>
              <span className="text-[15px] font-bold text-[#1e1b19]">Fricción Subclínica</span>
              <p className="text-[12px] text-[#6e7977] mt-1 leading-snug">
                Insulina Basal 5–10 µIU/mL, TyG 8.1–8.5, Patrón Kraft II (retraso leve en pico).
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-[#eee7e3] flex items-center justify-between text-[11px] text-[#6e7977]">
              <span>Transición:</span>
              <span className="font-bold text-[#1e1b19]">Hace 6 Meses</span>
            </div>
          </div>

          {/* Stratum 2: ACTIVE */}
          <div
            onClick={() => setSelectedStratum(2)}
            className={`p-4 rounded-lg shadow-md ring-2 ring-[#005c55] relative overflow-hidden flex flex-col justify-between border border-[#005c55] cursor-pointer ${
              selectedStratum === 2 ? 'bg-[#ffffff]' : 'bg-[#ffffff]/90'
            }`}
          >
            <div className="absolute -right-12 -top-12 w-28 h-28 bg-[#ffdcc3]/40 rounded-full blur-xl pointer-events-none" />
            <div className="flex flex-col gap-1 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#fe932c] animate-ping" />
                  <span className="text-[11px] font-bold uppercase text-[#904d00]">Estrato 2</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ffdcc3] text-[#2f1500]">
                  Estado Actual Eleanor Vance
                </span>
              </div>
              <span className="text-[15px] font-bold text-[#1e1b19]">
                Resistencia Establecida del Receptor
              </span>
              <p className="text-[12px] text-[#1e1b19] mt-1 leading-snug">
                Insulina Basal 10–20 µIU/mL (14.8), HOMA-IR &gt; 2.5 (3.59), Patrón Kraft III-A.
              </p>
            </div>
            <div className="mt-4 p-2 bg-[#faf2ee] rounded flex items-center justify-between border border-[#eee7e3] z-10">
              <span className="text-[11px] font-semibold text-[#904d00]">Vector de Riesgo Activo</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#005c55] text-white font-bold">
                Guiado por CDSS
              </span>
            </div>
          </div>

          {/* Stratum 3 */}
          <div
            onClick={() => setSelectedStratum(3)}
            className={`p-4 rounded-lg flex flex-col justify-between transition-all cursor-pointer border ${
              selectedStratum === 3
                ? 'bg-[#ffffff] ring-2 ring-[#cb2044] shadow-md border-[#cb2044]'
                : 'bg-[#faf2ee] opacity-70 hover:opacity-100 border-[#eee7e3]'
            }`}
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-[#6e7977]">Estrato 3</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#ffdadb] text-[#40000d]">
                  Peligro Crítico
                </span>
              </div>
              <span className="text-[15px] font-bold text-[#1e1b19]">Descompensación Severa</span>
              <p className="text-[12px] text-[#6e7977] mt-1 leading-snug">
                Glucosa &gt; 126 mg/dL, HOMA-IR &gt; 4.5, Patrón Kraft IV/V con agotamiento beta.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-[#eee7e3] flex items-center justify-between text-[11px] text-[#6e7977]">
              <span>Brecha de Umbral</span>
              <span className="font-bold text-[#a50030]">HOMA +0.91 seguro</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Diagnostic Split: ML Model Explanability + CDSS Clinical Directive Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: SHAP ML Explanability (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* SHAP Attribution Card */}
          <div className="bg-[#ffffff] p-5 rounded-xl shadow-sm border border-[#e9e1dd] flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-[#005c55]">
                  <span className="material-symbols-outlined text-[22px]">account_tree</span>
                  <h3 className="text-[16px] font-bold text-[#1e1b19]">Predictores de Riesgo SHAP</h3>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1 bg-[#faf2ee] rounded border border-[#e9e1dd] text-[11px] text-[#3e4947]">
                  <span>Modelo: <strong className="text-[#1e1b19] font-bold">XGBoost Fenotipador v2.4</strong></span>
                  <span className="text-[#bdc9c6]">•</span>
                  <span className="text-[#005c55] font-bold">AUC 0.942</span>
                </div>
              </div>

              <p className="text-[12.5px] text-[#6e7977] mb-4 leading-relaxed">
                Atribuciones de características que indican el peso biológico que conduce a la clasificación de Eleanor en Estrato 2 (Resistencia Establecida del Receptor). Calibrado sobre más de 12,000 cohortes de medicina funcional.
              </p>

              {/* Feature Breakdown Bars */}
              <div className="flex flex-col gap-3">
                {/* Feature 1 */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-baseline text-[12px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#6e7977]">1</span>
                      <span className="font-semibold text-[#1e1b19]">Índice TyG (Triglicéridos-Glucosa: 8.84)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-[#a50030]">+28.4%</span>
                      <span className="text-[10px] text-[#6e7977]">Atribución</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#eee7e3] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#a50030] h-full rounded-full transition-all duration-700" style={{ width: '82%' }} />
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-baseline text-[12px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#6e7977]">2</span>
                      <span className="font-semibold text-[#1e1b19]">Pico de Insulina Tardío a 120 min Kraft (88.4 µIU/mL)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-[#cb2044]">+22.1%</span>
                      <span className="text-[10px] text-[#6e7977]">Atribución</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#eee7e3] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#cb2044] h-full rounded-full transition-all duration-700" style={{ width: '71%' }} />
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-baseline text-[12px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#6e7977]">3</span>
                      <span className="font-semibold text-[#1e1b19]">Insulina en Ayunas (14.8 µIU/mL)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-[#904d00]">+18.6%</span>
                      <span className="text-[10px] text-[#6e7977]">Atribución</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#eee7e3] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#fe932c] h-full rounded-full transition-all duration-700" style={{ width: '60%' }} />
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-baseline text-[12px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#6e7977]">4</span>
                      <span className="font-semibold text-[#1e1b19]">Variabilidad Glucémica (CV de MCG &gt; 24.2%)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-[#904d00]">+12.3%</span>
                      <span className="text-[10px] text-[#6e7977]">Atribución</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#eee7e3] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#fe932c]/80 h-full rounded-full transition-all duration-700" style={{ width: '45%' }} />
                  </div>
                </div>

                {/* Feature 5 */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-baseline text-[12px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#6e7977]">5</span>
                      <span className="font-semibold text-[#1e1b19]">Índice de Adiposidad Visceral (VAI 2.45)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-[#005c55]">+9.5%</span>
                      <span className="text-[10px] text-[#6e7977]">Atribución</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#eee7e3] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#005c55] h-full rounded-full transition-all duration-700" style={{ width: '35%' }} />
                  </div>
                </div>

                {/* Feature 6 */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-baseline text-[12px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#6e7977]">6</span>
                      <span className="font-semibold text-[#1e1b19]">hs-PCR Inflamación Vascular Sistémica (2.1 mg/L)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-[#6e7977]">+5.8%</span>
                      <span className="text-[10px] text-[#6e7977]">Atribución</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#eee7e3] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#6e7977] h-full rounded-full transition-all duration-700" style={{ width: '22%' }} />
                  </div>
                </div>

                {/* Feature 7 */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-baseline text-[12px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#6e7977]">7</span>
                      <span className="font-semibold text-[#1e1b19]">GGT Carga Oxidativa y Esteatosis Hepática (34 U/L)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-[#6e7977]">+3.3%</span>
                      <span className="text-[10px] text-[#6e7977]">Atribución</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#eee7e3] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#bdc9c6] h-full rounded-full transition-all duration-700" style={{ width: '15%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 bg-[#faf2ee] p-3 rounded-lg flex items-center justify-between border border-[#eee7e3]">
              <div className="flex items-center gap-2 text-[11px] text-[#3e4947]">
                <span className="material-symbols-outlined text-[18px] text-[#005c55]">model_training</span>
                <span>Valor Base SHAP: E[f(x)] = 1.12 | Salida f(x) = 2.84 Puntuación de Riesgo de Estrato</span>
              </div>
              <button
                onClick={handleDownloadShapCsv}
                className="text-[11px] text-[#005c55] font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Descargar Matriz CSV</span>
                <span className="material-symbols-outlined text-[14px]">download</span>
              </button>
            </div>
          </div>

          {/* Bi-directional SHAP Force Plot Visualization */}
          <div className="bg-[#ffffff] p-4 rounded-xl shadow-sm border border-[#e9e1dd]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] font-bold text-[#1e1b19]">
                Vector Bidireccional de Gráfico de Fuerzas SHAP
              </span>
              <span className="text-[11px] bg-[#faf2ee] px-2 py-0.5 rounded text-[#3e4947] border border-[#e9e1dd]">
                f(x) Empuje Neto: +1.72
              </span>
            </div>

            <div className="w-full py-2">
              <div className="flex justify-between text-[11px] text-[#6e7977] mb-1">
                <span>← Protector (Empujando a Estrato 0/1)</span>
                <span className="font-bold text-[#1e1b19]">Valor Base = 1.12</span>
                <span>Patológico (Empujando a Estrato 2/3) →</span>
              </div>

              {/* Force Plot Bar */}
              <div className="w-full h-8 bg-[#eee7e3] rounded flex overflow-hidden relative">
                {/* Protective Force (Teal) */}
                <div
                  className="h-full bg-[#005c55] flex items-center justify-end pr-2 text-white text-[11px] font-bold"
                  style={{ width: '22%' }}
                >
                  -0.62 Protector
                </div>
                {/* Marker */}
                <div className="w-1 h-full bg-[#1e1b19] z-10" />
                {/* Aggravating Forces */}
                <div
                  className="h-full bg-[#fe932c] flex items-center justify-start pl-2 text-white text-[11px] font-bold"
                  style={{ width: '48%' }}
                >
                  +1.72 TyG, Pico Kraft
                </div>
                <div
                  className="h-full bg-[#a50030] flex items-center justify-start pl-2 text-white text-[11px] font-bold"
                  style={{ width: '30%' }}
                >
                  +0.62 Insulina y CV
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-2">
                <div className="p-2.5 bg-[#faf2ee] rounded flex items-center gap-2 border border-[#eee7e3]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#005c55] shrink-0" />
                  <span className="text-[11.5px] text-[#1e1b19] leading-tight">
                    <strong className="text-[#005c55]">Masa Muscular Magra (28.4 kg/m²)</strong> ofrece freno fisiológico primario contra cambio a Estrato 3.
                  </span>
                </div>
                <div className="p-2.5 bg-[#faf2ee] rounded flex items-center gap-2 border border-[#eee7e3]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#a50030] shrink-0" />
                  <span className="text-[11.5px] text-[#1e1b19] leading-tight">
                    <strong className="text-[#a50030]">TyG (8.84) y Pico Demorado</strong> dominan el 50.5% de la varianza total del modelo.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: CDSS Decision Rules & Clinical Prescriptions (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* CDSS Card 1: Immediate Action Levers */}
          <div className="bg-[#ffffff] p-4 rounded-xl shadow-sm border border-[#e9e1dd]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#005c55]/10 text-[#005c55] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#6e7977] font-bold">
                  DIRECTIVA DE INTERVENCIÓN 01
                </span>
                <h3 className="text-[14px] font-bold text-[#1e1b19]">
                  Palancas de Acción Inmediata (Alta Precisión)
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="bg-[#faf2ee] p-3 rounded-lg flex flex-col gap-1 border border-[#eee7e3]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#005c55] text-white font-bold">
                    Prioridad 1 • Biomecánica
                  </span>
                  <span className="text-[10px] text-[#005c55] font-bold">Efecto Inmediato</span>
                </div>
                <span className="text-[13px] font-bold text-[#1e1b19] mt-1">
                  Restaurar translocación postprandial de GLUT4
                </span>
                <p className="text-[11.5px] text-[#3e4947] leading-relaxed">
                  Prescribir contracciones musculares Zona 2 cronometradas: caminata enérgica de 15 minutos dentro de los 30 minutos posteriores a las comidas. Conduce mecánicamente la captación de glucosa no dependiente de insulina.
                </p>
              </div>

              <div className="bg-[#faf2ee] p-3 rounded-lg flex flex-col gap-1 border border-[#eee7e3]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#ffdcc3] text-[#2f1500] font-bold">
                    Prioridad 2 • Flujo Hepático
                  </span>
                  <span className="text-[10px] text-[#904d00] font-bold">Regulación a la Baja</span>
                </div>
                <span className="text-[13px] font-bold text-[#1e1b19] mt-1">
                  Frenar lipogénesis de novo hepática (DNL)
                </span>
                <p className="text-[11.5px] text-[#3e4947] leading-relaxed">
                  Límite de fructosa dietética &lt; 15g/día. Eliminar aceites de semillas industriales con alto ácido linoleico para preservar la fluidez mitocondrial hepática y revertir inductores de esteatosis.
                </p>
              </div>
            </div>
          </div>

          {/* CDSS Card 2: Biochemical Countermeasures */}
          <div className="bg-[#ffffff] p-4 rounded-xl shadow-sm border border-[#e9e1dd]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#005c55]/10 text-[#005c55] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">science</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#6e7977] font-bold">
                  DIRECTIVA DE INTERVENCIÓN 02
                </span>
                <h3 className="text-[14px] font-bold text-[#1e1b19]">
                  Contramedidas Bioquímicas
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="bg-[#faf2ee] p-3 rounded-lg flex flex-col gap-1 border border-[#eee7e3]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#e9e1dd] text-[#1e1b19] font-bold">
                    Régimen de Señalización
                  </span>
                  <span className="text-[10px] text-[#005c55] font-bold">Cascada AMPK y SIRT1</span>
                </div>
                <span className="text-[13px] font-bold text-[#1e1b19] mt-1">
                  Activación Nutracéutica de AMPK y SIRT1
                </span>
                <p className="text-[11.5px] text-[#3e4947] leading-relaxed">
                  Protocolo de doble acción: Fitoma de Berberina 500mg BID + Trans-Resveratrol Micronizado 250mg. Regula a la baja ChREBP, restaurando la sensibilidad celular.
                </p>
              </div>

              <div className="bg-[#faf2ee] p-3 rounded-lg flex flex-col gap-1 border border-[#eee7e3]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#e9e1dd] text-[#1e1b19] font-bold">
                    Eje del Microbioma
                  </span>
                  <span className="text-[10px] text-[#005c55] font-bold">Estimulación de Incretinas</span>
                </div>
                <span className="text-[13px] font-bold text-[#1e1b19] mt-1">
                  Titular Fibra Soluble Dietética a 45g/día
                </span>
                <p className="text-[11.5px] text-[#3e4947] leading-relaxed">
                  Incrementar producción de Ácidos Grasos de Cadena Corta (propionato y butirato). Estimula la secreción endógena de GLP-1 por las células L intestinales.
                </p>
              </div>
            </div>
          </div>

          {/* CDSS Card 3: Contraindications & Clinical Flags */}
          <div className="bg-[#ffffff] p-4 rounded-xl shadow-sm border border-[#e9e1dd]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#ffdadb] text-[#a50030] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">warning</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#a50030] font-bold">
                  DIRECTIVA DE SEGURIDAD
                </span>
                <h3 className="text-[14px] font-bold text-[#1e1b19]">
                  Contraindicaciones y Alertas Clínicas
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="p-3 rounded-lg bg-[#ffdadb]/40 border border-[#cb2044]/30 flex items-start gap-2">
                <span className="material-symbols-outlined text-[#a50030] text-[18px] shrink-0 mt-0.5">
                  do_not_disturb_on
                </span>
                <div>
                  <span className="text-[11.5px] font-bold text-[#40000d] block">
                    Contraindicación: Ayuno Extendido &gt; 18h
                  </span>
                  <p className="text-[11px] text-[#3e4947] mt-0.5 leading-snug">
                    Prohibir ayunos agresivos. T3 reversa elevada (22 ng/dL) y aplanamiento diurno de cortisol indican riesgo de bloqueo tiroideo y elevación de gluconeogénesis.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#ffdcc3]/40 border border-[#fe932c]/30 flex items-start gap-2">
                <span className="material-symbols-outlined text-[#904d00] text-[18px] shrink-0 mt-0.5">
                  sync_problem
                </span>
                <div>
                  <span className="text-[11.5px] font-bold text-[#2f1500] block">
                    Vigilancia: Requiere Control de Laboratorio de TFGe
                  </span>
                  <p className="text-[11px] text-[#3e4947] mt-0.5 leading-snug">
                    Revalidar cistatina-C sérica y TFGe previo a escalamientos de metformina farmacéutica o berberina de alta potencia por encima de 1,500mg diarios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Research & Contextual Visual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Visual Panel 1: GLUT4 */}
        <div className="bg-[#ffffff] p-4 rounded-xl shadow-sm border border-[#e9e1dd] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase text-[#6e7977]">Patología Fenotípica</span>
              <span className="text-[10px] font-bold text-[#005c55]">Referencia Microscópica</span>
            </div>
            <div className="w-full h-32 rounded-lg overflow-hidden relative mb-2.5 bg-[#faf2ee] border border-[#eee7e3]">
              <img
                className="w-full h-full object-cover"
                alt="Visualización microscópica celular de translocación GLUT4"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqkQD5c8f-evp4OGdFg2sY_JlJqPou4NQSmXcFs0q4iUT7OX7Os0TxzoApsF8JnFs9SbaOp5ylGYT1EZdLArfiRf_37nPl-MFsjRBC-Hyj-Fxu2HlijUO_7Iq3By77YlXtZT7RvxUuM_t99BuM-xNckgNKsSm4iRWCaKsnuttBEyAlS5XGsN64kzul3Oh0z4lUBLdnYOLWVsieauDpSS3N7SpLClzbTYOiPu8d14Eb0H77R-52w4IM"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <h4 className="text-[14px] font-bold text-[#1e1b19] mb-1">Translocación de Membrana GLUT4</h4>
            <p className="text-[11.5px] text-[#6e7977] leading-relaxed">
              La fosforilación alterada de IRS-1 retiene las vesículas internamente. La contracción muscular activa la vía alterna de CaMKII de manera independiente.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#eee7e3] flex items-center justify-between text-[11px] text-[#6e7977]">
            <span>Ref. Ensayo: #BIO-4491</span>
            <span className="font-bold text-[#1e1b19]">Eficiencia Objetivo: 42%</span>
          </div>
        </div>

        {/* Visual Panel 2: Hepatic Steatosis */}
        <div className="bg-[#ffffff] p-4 rounded-xl shadow-sm border border-[#e9e1dd] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase text-[#6e7977]">Biomarcadores Hepáticos</span>
              <span className="text-[10px] font-bold text-[#904d00]">Gradación Esteatosis</span>
            </div>
            <div className="w-full h-32 rounded-lg overflow-hidden relative mb-2.5 bg-[#faf2ee] border border-[#eee7e3]">
              <img
                className="w-full h-full object-cover"
                alt="Ecografía hepática e histología de esteatosis"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuBpWWZvme9y3VsRntxLDDRnwpIxyByZK-tV4sk7RLgSQgA-exIbsPy6aJbdvfgkg675ngiOqA0v7iJq20bK1WhqkR1HPvQ7Ojs-9RLf_1hDaOvT_UP4M-9zA2PHD980qIrfVeWdip5qgfx8ZbrwnR6qYmMGRi1Spzp8Hs1yxP7Zbre7oEGcwPrBxKAOhns27ApjnPZleM1dlS7VpMSzPhfhoRsYV7hNulupPEiZO-80S6Rpx84809"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <h4 className="text-[14px] font-bold text-[#1e1b19] mb-1">Acumulación Lipídica Hepática</h4>
            <p className="text-[11.5px] text-[#6e7977] leading-relaxed">
              El TyG elevado (8.84) correlaciona marcadamente con la acumulación intrahepática de diacilglicerol, promoviendo resistencia insulínica hepática selectiva.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#eee7e3] flex items-center justify-between text-[11px] text-[#6e7977]">
            <span>FibroScan CAP: 268 dB/m</span>
            <span className="font-bold text-[#904d00]">Esteatosis Grado S1</span>
          </div>
        </div>

        {/* Visual Panel 3: AMPK */}
        <div className="bg-[#ffffff] p-4 rounded-xl shadow-sm border border-[#e9e1dd] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase text-[#6e7977]">Diana de Señalización Celular</span>
              <span className="text-[10px] font-bold text-[#005c55]">Vía AMPK</span>
            </div>
            <div className="w-full h-32 rounded-lg overflow-hidden relative mb-2.5 bg-[#faf2ee] border border-[#eee7e3]">
              <img
                className="w-full h-full object-cover"
                alt="Complejo enzimático AMPK cinasa de proteínas"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDujiZsmtEot6GV71PEOYeUHZy5hqn7Hs9s3gJsvf5mI9uBdO5pyswqN5xQeIdCtPXtwJbUR5QMP9lfc8H79__dCUUEsQKyV0Xzc_DV0YHsuIJ6hZv35j3kLndx_P5fHaqFlAE-Fdm501YtNsniBUw7XTNUcWPNo0khIO-pRqXzjd9M7K86ETSA_b3g2SZFBayAn9sA-bXIAJWGlD2IWxG07wkroTvAafaSWXuM0D8aCfLuuYbX3vCL"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <h4 className="text-[14px] font-bold text-[#1e1b19] mb-1">Biogénesis Mitocondrial</h4>
            <p className="text-[11.5px] text-[#6e7977] leading-relaxed">
              La regulación positiva del coactivador PGC-1α restablece el equilibrio de oxidación de sustratos, atenuando la acumulación tóxica de acil-CoA graso.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#eee7e3] flex items-center justify-between text-[11px] text-[#6e7977]">
            <span>Diana de Expresión Génica</span>
            <span className="font-bold text-[#005c55]">SIRT1 +2.4x Objetivo</span>
          </div>
        </div>
      </div>

      {/* FHIR Clinical Protocol Execution Bar */}
      <div className="w-full bg-[#ffffff] p-4 md:p-5 rounded-xl shadow-sm border border-[#e9e1dd] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#005c55] text-white flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[24px]">assignment_turned_in</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-[#1e1b19]">
              Comprometer Plan de Atención Clínica de Estrato 2 a la HCE
            </span>
            <span className="text-[12px] text-[#6e7977]">
              Enviará 3 órdenes de medicación, 2 directrices dietéticas y alertas continuas de MCG a la historia de Eleanor.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportConsultNote}
            className="px-4 py-2 rounded-lg bg-[#faf2ee] hover:bg-[#f4ece8] text-[12px] text-[#1e1b19] font-bold border border-[#e9e1dd] transition-colors cursor-pointer"
          >
            Exportar Nota de Consulta en PDF
          </button>
          <button
            onClick={onOpenFhir}
            className="px-4 py-2 rounded-lg bg-[#005c55] hover:bg-[#0f766e] text-white text-[12px] font-bold shadow transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">sync</span>
            <span>Confirmar Paquete FHIR R4</span>
          </button>
        </div>
      </div>
    </div>
  );
};
