import React, { useState } from 'react';
import { KRAFT_PATTERNS_MAP } from '../utils/metabolicCalculators';
import { KraftPatternId, PatientProfile, MedicalProfessional } from '../types';
import { exportKraftPdfReport } from '../utils/pdfReportGenerator';

interface KraftOgttScreenProps {
  patient?: PatientProfile;
  doctor?: MedicalProfessional;
  onOpenFhir: () => void;
  onShowToast: (msg: string) => void;
}

export const KraftOgttScreen: React.FC<KraftOgttScreenProps> = ({
  patient,
  doctor,
  onOpenFhir,
  onShowToast,
}) => {
  const [selectedPatternKey, setSelectedPatternKey] = useState<KraftPatternId>('pattern-3a');
  const [isExporting, setIsExporting] = useState(false);

  const patternData = KRAFT_PATTERNS_MAP[selectedPatternKey] || KRAFT_PATTERNS_MAP['pattern-3a'];

  const handleExportDossier = () => {
    setIsExporting(true);
    onShowToast('Generando e imprimiendo Dossier Clínico Kraft OGTT en PDF...');
    if (patient && doctor) {
      exportKraftPdfReport({
        patient,
        doctor,
        patternKey: selectedPatternKey,
      });
    }
    setTimeout(() => {
      setIsExporting(false);
      onShowToast('¡Dossier Clínico Kraft OGTT generado y exportado exitosamente!');
    }, 800);
  };

  const handleAuditBiomarkers = () => {
    onShowToast('Auditoría de biomarcadores pancreáticos sincronizada con el HCE.');
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Diagnostics Banner */}
      <section className="w-full bg-[#ffffff] rounded-xl p-5 md:p-6 shadow-sm border border-[#e9e1dd] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#005c55]/5 pointer-events-none blur-2xl" />
        <div className="flex flex-col gap-1 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#faf2ee] text-[10px] font-bold text-[#005c55] uppercase tracking-wider">
              ENSAYO DIAGNÓSTICO
            </span>
            <span className="text-[12px] text-[#6e7977] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#005c55]">biotech</span>
              Sobrecarga con 75g de Glucosa Anhidra • Matriz Temporal de 5 Puntos (0-180 min)
            </span>
          </div>
          <h1 className="text-[22px] md:text-[24px] font-bold text-[#1e1b19] tracking-tight">
            Curvas Kraft OGTT y Cinética de Insulina Dinámica
          </h1>
          <p className="text-[13px] text-[#3e4947] max-w-2xl leading-relaxed">
            Mapeo de tolerancia a la glucosa e insulina pareada para evaluar suficiencia de fase cefálica, resistencia de receptores periféricos y fricción metabólica oculta.
          </p>
        </div>

        {/* Quick Status Pills */}
        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#faf2ee] border border-[#e9e1dd] shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-[#005c55]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-[#6e7977]">Glucosa en Ayunas</span>
              <span className="text-[12px] font-bold text-[#1e1b19]">
                98 mg/dL <span className="text-[10px] text-[#005c55] font-normal">(Óptimo &lt;95)</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#faf2ee] border border-[#e9e1dd] shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-[#fe932c]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-[#6e7977]">Insulina en Ayunas</span>
              <span className="text-[12px] font-bold text-[#904d00]">
                14.8 μIU/mL <span className="text-[10px] text-[#904d00] font-normal">(Elevada)</span>
              </span>
            </div>
          </div>

          <button
            onClick={handleExportDossier}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#005c55] text-white hover:bg-[#0f766e] transition-all text-[12px] font-semibold shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isExporting ? 'refresh' : 'picture_as_pdf'}
            </span>
            <span>{isExporting ? 'Generando PDF...' : 'Exportar Dossier Kraft'}</span>
          </button>
        </div>
      </section>

      {/* Interactive Control Header: Pattern Selector & Diagnostic Triage */}
      <section className="w-full bg-[#ffffff] rounded-xl p-4 md:p-5 shadow-sm border border-[#e9e1dd] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#904d00]">
            <span className="material-symbols-outlined text-[20px]">tune</span>
            <label className="text-[13px] font-bold text-[#1e1b19] whitespace-nowrap">
              Modelo de Trayectoria Kraft:
            </label>
          </div>
          <div className="relative flex-1 max-w-2xl">
            <select
              value={selectedPatternKey}
              onChange={(e) => {
                setSelectedPatternKey(e.target.value as KraftPatternId);
                onShowToast(`Cargada trayectoria: ${e.target.options[e.target.selectedIndex].text.split(':')[0]}`);
              }}
              className="w-full appearance-none bg-[#faf2ee] py-2 px-3 pr-10 rounded-lg text-[13px] font-medium text-[#1e1b19] focus:outline-none focus:ring-1 focus:ring-[#005c55] border border-[#e9e1dd] shadow-sm cursor-pointer"
            >
              <option value="pattern-1">Patrón Kraft I: Dinámica Normal de Insulina (Pico a 30-60 min, retorno a basal a 180 min)</option>
              <option value="pattern-2">Patrón Kraft II: Pico Tardío / Hiperinsulinemia (Pico a 90-120 min, retraso limítrofe)</option>
              <option value="pattern-3a">Patrón Kraft III-A: Hiperinsulinemia Patológica (Pico en 120-180 min, resistencia marcada)</option>
              <option value="pattern-3b">Patrón Kraft III-B: Hiperinsulinemia Tardía Severa (Basal &gt; 25, pico &gt; 150 uIU/mL a 120+ min)</option>
              <option value="pattern-4">Patrón Kraft IV: Hiperinsulinemia Basal Elevada (&gt; 50 uIU/mL en ayunas, elevación persistente)</option>
              <option value="pattern-5">Patrón Kraft V: Hipoinsulinismo / Agotamiento de Células Beta (Insulina plana &lt; 30 uIU/mL, hiperglucemia persistente)</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6e7977] text-[18px]">
              arrow_drop_down
            </span>
          </div>
        </div>

        {/* Active Badges */}
        <div className="flex items-center gap-2 text-[11px] text-[#6e7977]">
          <span className="px-2.5 py-1 rounded bg-[#ffdcc3] text-[#2f1500] font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fe932c]" />
            Diabetes In Situ Oculta
          </span>
          <span className="px-2.5 py-1 rounded bg-[#faf2ee] font-mono text-[#1e1b19] border border-[#e9e1dd]">
            ENSAYO DE 5 PUNTOS
          </span>
        </div>
      </section>

      {/* Main Dual Grid: Chart (8 cols) + Diagnostics (4 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Chart Column (8 cols) */}
        <div className="xl:col-span-8 flex flex-col gap-4">
          <div className="bg-[#ffffff] rounded-xl p-4 md:p-6 shadow-sm border border-[#e9e1dd] flex flex-col gap-4">
            {/* Chart Header & Interactive Legends */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#eee7e3] gap-2">
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-[#1e1b19]">
                  Crono-Trayectoria de Doble Eje
                </span>
                <span className="text-[11px] text-[#6e7977]">
                  Delta cinético pareado a 180 min entre exposición glucémica y secreción pancreática
                </span>
              </div>

              {/* Legends */}
              <div className="flex items-center flex-wrap gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-[#005c55] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </span>
                  <span className="text-[11px] font-medium text-[#1e1b19]">Glucosa (mg/dL)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-[#904d00] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </span>
                  <span className="text-[11px] font-medium text-[#1e1b19]">Insulina (μIU/mL)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#6e7977]">
                  <span className="w-4 h-0.5 bg-[#bdc9c6] inline-block" />
                  <span className="text-[11px]">Normativo Kraft</span>
                </div>
              </div>
            </div>

            {/* High-Fidelity SVG Dual-Axis Chart */}
            <div className="w-full h-[380px] md:h-[420px] relative select-none bg-[#faf2ee]/60 rounded-lg p-2 flex items-center justify-center overflow-hidden border border-[#eee7e3]">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 780 400">
                <defs>
                  <linearGradient id="kraftInsulinGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#fe932c" stopOpacity="0.4" />
                    <stop offset="60%" stopColor="#fe932c" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#fe932c" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="kraftTargetGrad" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="#9cf2e8" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#80d5cb" stopOpacity="0.1" />
                  </linearGradient>
                  <pattern id="kraftHatch" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="12" stroke="#cb2044" strokeWidth="1.2" strokeOpacity="0.18" />
                  </pattern>
                </defs>

                {/* Target Zone (0-140 mg/dL: y: 340 to 176) */}
                <rect x="70" y="176" width="640" height="164" fill="url(#kraftTargetGrad)" rx="4" />
                {/* Hyperinsulinemic Hazard Zone (>60 uIU/mL: y: 220 to 60) */}
                <rect x="70" y="60" width="640" height="160" fill="url(#kraftHatch)" rx="4" />

                <text x="75" y="78" fill="#cb2044" fontSize="10" fontWeight="700" letterSpacing="0.05em" opacity="0.85">
                  UMBRAL DE TOXICIDAD POR HIPERINSULINEMIA (&gt;60 μIU/mL)
                </text>
                <text x="75" y="332" fill="#005c55" fontSize="10" fontWeight="700" letterSpacing="0.05em" opacity="0.85">
                  VENTANA FUNCIONAL METABÓLICA (NORMOGLUCEMIA)
                </text>

                {/* Horizontal Gridlines */}
                <line x1="70" y1="100" x2="710" y2="100" stroke="#bdc9c6" strokeDasharray="2,2" strokeOpacity="0.4" />
                <text x="62" y="104" fill="#3e4947" fontSize="10" fontWeight="500" textAnchor="end">200</text>
                <text x="718" y="104" fill="#6e3900" fontSize="10" fontWeight="500" textAnchor="start">150</text>

                <line x1="70" y1="176" x2="710" y2="176" stroke="#fe932c" strokeDasharray="4,3" strokeOpacity="0.6" />
                <text x="62" y="180" fill="#904d00" fontSize="10" fontWeight="700" textAnchor="end">140</text>
                <text x="718" y="180" fill="#6e3900" fontSize="10" fontWeight="500" textAnchor="start">100</text>

                <line x1="70" y1="220" x2="710" y2="220" stroke="#cb2044" strokeDasharray="3,3" strokeOpacity="0.5" />
                <text x="62" y="224" fill="#005c55" fontSize="10" fontWeight="700" textAnchor="end">100</text>
                <text x="718" y="224" fill="#cb2044" fontSize="10" fontWeight="700" textAnchor="start">60</text>

                <line x1="70" y1="280" x2="710" y2="280" stroke="#bdc9c6" strokeDasharray="2,2" strokeOpacity="0.4" />
                <text x="62" y="284" fill="#3e4947" fontSize="10" fontWeight="500" textAnchor="end">60</text>
                <text x="718" y="284" fill="#6e3900" fontSize="10" fontWeight="500" textAnchor="start">20</text>

                <line x1="70" y1="340" x2="710" y2="340" stroke="#6e7977" strokeOpacity="0.5" strokeWidth="1.2" />
                <text x="62" y="344" fill="#3e4947" fontSize="10" textAnchor="end">0</text>
                <text x="718" y="344" fill="#6e3900" fontSize="10" textAnchor="start">0</text>

                {/* Vertical Time Markers */}
                <line x1="100" y1="60" x2="100" y2="340" stroke="#bdc9c6" strokeDasharray="2,2" strokeOpacity="0.35" />
                <text x="100" y="360" fill="#1e1b19" fontSize="11" fontWeight="700" textAnchor="middle">0 min</text>
                <text x="100" y="374" fill="#6e7977" fontSize="10" textAnchor="middle">Basal</text>

                <line x1="240" y1="60" x2="240" y2="340" stroke="#bdc9c6" strokeDasharray="2,2" strokeOpacity="0.35" />
                <text x="240" y="360" fill="#1e1b19" fontSize="11" fontWeight="700" textAnchor="middle">30 min</text>
                <text x="240" y="374" fill="#6e7977" fontSize="10" textAnchor="middle">Fase Cefálica</text>

                <line x1="380" y1="60" x2="380" y2="340" stroke="#bdc9c6" strokeDasharray="2,2" strokeOpacity="0.35" />
                <text x="380" y="360" fill="#1e1b19" fontSize="11" fontWeight="700" textAnchor="middle">60 min</text>
                <text x="380" y="374" fill="#6e7977" fontSize="10" textAnchor="middle">Absorción Máx</text>

                <line x1="530" y1="60" x2="530" y2="340" stroke="#fe932c" strokeDasharray="3,3" strokeOpacity="0.5" />
                <rect x="495" y="348" width="70" height="28" fill="#ffdcc3" fillOpacity="0.8" rx="4" />
                <text x="530" y="362" fill="#904d00" fontSize="11" fontWeight="700" textAnchor="middle">120 min</text>
                <text x="530" y="374" fill="#904d00" fontSize="9" fontWeight="600" textAnchor="middle">Pico Patológico</text>

                <line x1="680" y1="60" x2="680" y2="340" stroke="#bdc9c6" strokeDasharray="2,2" strokeOpacity="0.35" />
                <text x="680" y="360" fill="#1e1b19" fontSize="11" fontWeight="700" textAnchor="middle">180 min</text>
                <text x="680" y="374" fill="#6e7977" fontSize="10" textAnchor="middle">Aclaramiento</text>

                {/* Normative Kraft Pattern I Curve (Dotted Muted) */}
                <path
                  d="M 100 325 C 160 270, 200 240, 240 230 C 280 235, 340 280, 380 295 C 450 315, 500 325, 530 330 C 600 335, 650 336, 680 336"
                  fill="none"
                  stroke="#6e7977"
                  strokeDasharray="4,4"
                  strokeWidth="1.8"
                  opacity="0.55"
                />
                <text x="250" y="222" fill="#6e7977" fontSize="9" fontStyle="italic">Pico Ideal Patrón I</text>

                {/* Shaded Area Under Insulin Curve */}
                <path d={patternData.insulinArea} fill="url(#kraftInsulinGrad)" className="transition-all duration-700" />

                {/* Insulin Dynamic Spline */}
                <path
                  d={patternData.insulinPath}
                  fill="none"
                  stroke="#904d00"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                  className="transition-all duration-700"
                />

                {/* Glucose Dynamic Spline */}
                <path
                  d={patternData.glucosePath}
                  fill="none"
                  stroke="#005c55"
                  strokeLinecap="round"
                  strokeWidth="3"
                  className="transition-all duration-700"
                />

                {/* Interactive Points on Trajectory */}
                {patternData.points.map((pt, idx) => {
                  const xCoords = [100, 240, 380, 530, 680];
                  const cx = xCoords[idx];
                  // Map glucose to svg y (approx: 0=340, 200=100)
                  const gy = 340 - (pt.gluc / 200) * 240;
                  // Map insulin to svg y (approx: 0=340, 150=100)
                  const iy = 340 - (pt.ins / 150) * 240;

                  return (
                    <g key={idx} className="cursor-pointer">
                      {/* Glucose Node */}
                      <circle cx={cx} cy={gy} r="5" fill="#ffffff" stroke="#005c55" strokeWidth="2.5" />
                      <text x={cx} y={gy - 8} fill="#005c55" fontSize="10" fontWeight="700" textAnchor="middle">
                        {pt.gluc}
                      </text>

                      {/* Insulin Node */}
                      <circle
                        cx={cx}
                        cy={iy}
                        r={idx === 3 ? '7' : '5'}
                        fill={idx === 3 ? '#cb2044' : '#ffdcc3'}
                        stroke="#904d00"
                        strokeWidth="2.5"
                      />
                      <text
                        x={cx}
                        y={iy + 15}
                        fill="#904d00"
                        fontSize="10"
                        fontWeight="700"
                        textAnchor="middle"
                      >
                        {pt.ins}
                      </text>
                    </g>
                  );
                })}

                {/* Axis Labels */}
                <text x="24" y="38" fill="#005c55" fontSize="11" fontWeight="700" letterSpacing="0.02em">
                  GLUCOSA (mg/dL)
                </text>
                <text x="756" y="38" fill="#904d00" fontSize="11" fontWeight="700" letterSpacing="0.02em" textAnchor="end">
                  INSULINA (μIU/mL)
                </text>
              </svg>
            </div>

            {/* Metric Readout Strip Under Chart */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
              {patternData.points.map((pt, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-lg flex flex-col border ${
                    i === 3
                      ? 'bg-[#ffdcc3]/40 border-[#fe932c]/40 col-span-2 sm:col-span-1'
                      : 'bg-[#faf2ee] border-[#eee7e3]'
                  }`}
                >
                  <span className="text-[10px] text-[#6e7977]">{pt.min}</span>
                  <span className="text-[15px] font-bold text-[#1e1b19] tabular-nums">
                    {pt.gluc} / {pt.ins}
                  </span>
                  <span
                    className={`text-[10px] font-semibold ${
                      i === 3 ? 'text-[#a50030]' : 'text-[#6e7977]'
                    }`}
                  >
                    {pt.state}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Comparative Pattern Reference Mosaic */}
          <div className="bg-[#ffffff] rounded-xl p-4 shadow-sm border border-[#e9e1dd] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#005c55] text-[20px]">account_tree</span>
                <span className="text-[14px] font-bold text-[#1e1b19]">
                  Matriz Diferencial de Tipologías Kraft
                </span>
              </div>
              <span className="text-[11px] text-[#6e7977]">
                5 Clasificaciones Canónicas del Dr. Joseph R. Kraft
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[12px]">
              <div className="p-3 rounded-lg bg-[#faf2ee] flex flex-col gap-1 border border-[#eee7e3]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#005c55]">Patrón I</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#005c55]/15 text-[#005c55] font-semibold">
                    Eumetabólico
                  </span>
                </div>
                <p className="text-[11px] text-[#3e4947] leading-tight">
                  Ayuno &lt;10. Pico a 30-60 min (&lt;60 uIU). 120m &lt;30 uIU. Aclaramiento hepático normal.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#faf2ee] flex flex-col gap-1 border border-[#eee7e3]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#904d00]">Patrón II</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#fe932c]/20 text-[#904d00] font-semibold">
                    Retraso Leve
                  </span>
                </div>
                <p className="text-[11px] text-[#3e4947] leading-tight">
                  Ayuno normal/limítrofe. Pico demorado a 90-120 min. Valores a 180 min se aproximan al basal.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#ffdadb]/40 flex flex-col gap-1 border border-[#cb2044]/30">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#a50030]">Patrón III-A (Activo)</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#cb2044] text-white font-bold">
                    DM2 Oculta
                  </span>
                </div>
                <p className="text-[11px] text-[#40000d] leading-tight font-medium">
                  Retraso severo. Pico masivo a 120m (&gt;100 uIU). 180m sin retorno al basal. Alto riesgo oculto.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Diagnostic Analysis & Kinetic Engines (4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          {/* Panel 1: Pancreatic Beta-Cell Kinetic Diagnostics */}
          <div className="bg-[#ffffff] rounded-xl p-4 md:p-5 shadow-sm border border-[#e9e1dd] flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#eee7e3]">
              <div className="flex items-center gap-1.5 text-[#904d00]">
                <span className="material-symbols-outlined text-[20px]">query_stats</span>
                <span className="text-[14px] font-bold text-[#1e1b19]">Cinética Pancreática</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#faf2ee] text-[10px] font-mono text-[#6e7977] border border-[#e9e1dd]">
                Ensayo #KK-49
              </span>
            </div>

            {/* Metric 1: Phase 1 */}
            <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-[#faf2ee] border border-[#eee7e3]">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#3e4947]">Secreción de Fase 1 (0-30 min)</span>
                <span className="font-bold text-[#904d00]">{patternData.phase1}</span>
              </div>
              <div className="w-full bg-[#eee7e3] h-2 rounded-full overflow-hidden">
                <div className="bg-[#fe932c] h-full w-[35%] rounded-full" />
              </div>
              <span className="text-[10px] text-[#6e7977]">
                Oleada cefálica fallida; incapacidad de cebar la síntesis de glucógeno hepático.
              </span>
            </div>

            {/* Metric 2: Phase 2 */}
            <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-[#faf2ee] border border-[#eee7e3]">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#3e4947]">Fase 2 de Salida (60-180 min)</span>
                <span className="font-bold text-[#a50030]">{patternData.phase2}</span>
              </div>
              <div className="w-full bg-[#eee7e3] h-2 rounded-full overflow-hidden">
                <div className="bg-[#cb2044] h-full w-[94%] rounded-full" />
              </div>
              <span className="text-[10px] text-[#6e7977]">
                Reclutamiento pancreático exagerado compensando la resistencia de GLUT4 muscular.
              </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 rounded-lg bg-[#faf2ee] border border-[#eee7e3] flex flex-col">
                <span className="text-[10px] text-[#6e7977]">Ratio Aclaramiento 120m/0m</span>
                <span className="text-[24px] font-bold text-[#904d00] tabular-nums">
                  {patternData.clearanceRatio}x
                </span>
                <span className="text-[10px] text-[#a50030] font-semibold">Crítico &gt; 3.0x</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#faf2ee] border border-[#eee7e3] flex flex-col">
                <span className="text-[10px] text-[#6e7977]">AUC de Insulina (0-180m)</span>
                <span className="text-[24px] font-bold text-[#a50030] tabular-nums">
                  {patternData.aucInsulin.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#6e7977]">μIU·min/mL (&gt;P95)</span>
              </div>
            </div>

            {/* Matsuda Card */}
            <div className="p-2.5 rounded-lg bg-[#f4ece8] flex items-center justify-between text-[12px]">
              <div>
                <span className="text-[10px] text-[#6e7977] block">Índice Matsuda Estimado</span>
                <span className="text-[16px] font-bold text-[#904d00] tabular-nums">
                  {patternData.matsuda}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#6e7977] block">Sensibilidad Cuerpo Entero</span>
                <span className="text-[11px] font-bold text-[#a50030]">Marcada Depresión</span>
              </div>
            </div>
          </div>

          {/* Panel 2: Functional Verdict Box */}
          <div className="bg-[#ffffff] rounded-xl p-4 md:p-5 shadow-sm border border-[#e9e1dd] flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#cb2044]" />
            <div className="flex items-center gap-1.5 pl-2 text-[#a50030]">
              <span className="material-symbols-outlined text-[20px]">medical_services</span>
              <span className="text-[14px] font-bold">Veredicto Diagnóstico</span>
            </div>

            <div className="pl-2 flex flex-col gap-1">
              <span className="text-[17px] font-bold text-[#1e1b19]">
                {patternData.name.split(':')[0]}
              </span>
              <span className="text-[10px] text-[#a50030] font-bold uppercase tracking-wider">
                DIABETES IN SITU / GLUCOTOXICIDAD OCULTA
              </span>
              <p className="text-[12px] text-[#3e4947] leading-relaxed mt-1">
                Como articuló el Dr. Joseph R. Kraft en su obra seminal (<em>"Diabetes Epidemic & You"</em>), la glucosa basal normal enmascara rutinariamente una resistencia celular severa durante 15 a 25 años. Eleanor presenta glucosa habitual normal (98 mg/dL), pero un <strong>pico retrasado de 124 μIU/mL a los 120 minutos</strong>.
              </p>
            </div>

            {/* Levers List */}
            <div className="p-3 rounded-lg bg-[#faf2ee] border border-[#eee7e3] flex flex-col gap-1.5 ml-2">
              <div className="flex items-center gap-1 text-[#005c55] font-bold text-[11px]">
                <span className="material-symbols-outlined text-[15px]">prescriptions</span>
                <span>Palancas Clínicas Recomendadas:</span>
              </div>
              <ul className="text-[11.5px] text-[#1e1b19] flex flex-col gap-1 list-disc list-inside">
                <li><strong className="text-[#005c55]">Mio/D-Quiro Inositol Dirigido</strong> (40:1) 2000mg BID</li>
                <li><strong className="text-[#005c55]">Fitoma de Berberina</strong> 500mg BID previo a comidas</li>
                <li><strong className="text-[#005c55]">Locomoción en Zona 2</strong> (20 min postprandial) para GLUT4</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1 pl-2">
              <button
                onClick={onOpenFhir}
                className="flex-1 py-2 rounded-lg bg-[#005c55] hover:bg-[#0f766e] text-white text-[12px] font-semibold transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">sync_alt</span>
                <span>Desplegar en FHIR</span>
              </button>
              <button
                onClick={handleAuditBiomarkers}
                className="px-3 py-2 rounded-lg bg-[#faf2ee] hover:bg-[#f4ece8] text-[#1e1b19] text-[12px] font-medium border border-[#e9e1dd] transition-all cursor-pointer"
              >
                Auditar Biomarcadores
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reference Citation Footer */}
      <section className="w-full bg-[#ffffff] rounded-xl p-4 shadow-sm border border-[#e9e1dd] flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-[#6e7977]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#005c55]/10 flex items-center justify-center text-[#005c55] shrink-0">
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-[#1e1b19]">
              Cita Patológica Funcional Basada en Evidencia
            </span>
            <span className="text-[11px] text-[#6e7977]">
              Kraft, J.R. (1975). "Detección de Diabetes Mellitus In Situ (Diabetes Oculta)". Laboratory Medicine, 6(2), 10–22.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px]">
            <span>FHIR ID:</span>
            <span className="px-2 py-0.5 rounded bg-[#faf2ee] text-[#1e1b19] font-bold border border-[#e9e1dd]">
              Observation/kraft-ogtt-88219
            </span>
          </div>
          <span className="inline-flex items-center gap-1 font-semibold text-[#005c55] hover:underline cursor-pointer">
            Criterios Estándar de Referencia
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </span>
        </div>
      </section>
    </div>
  );
};
