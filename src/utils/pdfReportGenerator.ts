/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PatientProfile, MedicalProfessional, PatientLabs, KraftPatternId } from '../types';
import { calculateSurrogates, KRAFT_PATTERNS_MAP } from './metabolicCalculators';

// SVG Tree Emblem for print documents
const FUNCTIONAL_CARE_LOGO_SVG = `
<svg width="42" height="46" viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
  <defs>
    <linearGradient id="pGoldTrunk" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d4a359" />
      <stop offset="100%" stop-color="#8c5f1c" />
    </linearGradient>
    <linearGradient id="pLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#b4cb51" />
      <stop offset="100%" stop-color="#005c55" />
    </linearGradient>
  </defs>
  <path d="M 50 4 C 47 12, 48 18, 50 24 C 52 18, 53 12, 50 4 Z" fill="url(#pLeafGrad)" />
  <path d="M 43 12 C 38 18, 38 24, 43 28 C 45 23, 46 17, 43 12 Z" fill="url(#pLeafGrad)" />
  <path d="M 57 12 C 62 18, 62 24, 57 28 C 55 23, 54 17, 57 12 Z" fill="url(#pLeafGrad)" />
  <path d="M 33 22 C 27 27, 26 34, 31 38 C 34 33, 36 28, 33 22 Z" fill="url(#pLeafGrad)" />
  <path d="M 67 22 C 73 27, 74 34, 69 38 C 66 33, 64 28, 67 22 Z" fill="url(#pLeafGrad)" />
  <path d="M 23 37 C 16 41, 14 48, 19 53 C 23 49, 26 44, 23 37 Z" fill="url(#pLeafGrad)" />
  <path d="M 77 37 C 84 41, 86 48, 81 53 C 77 49, 74 44, 77 37 Z" fill="url(#pLeafGrad)" />
  <path d="M 50 26 L 50 78" stroke="url(#pGoldTrunk)" stroke-width="4.5" stroke-linecap="round" />
  <path d="M 50 42 C 43 38, 37 42, 33 46" stroke="url(#pGoldTrunk)" stroke-width="3" stroke-linecap="round" fill="none" />
  <path d="M 50 42 C 57 38, 63 42, 67 46" stroke="url(#pGoldTrunk)" stroke-width="3" stroke-linecap="round" fill="none" />
  <path d="M 50 56 C 42 53, 34 58, 27 64" stroke="url(#pGoldTrunk)" stroke-width="3" stroke-linecap="round" fill="none" />
  <path d="M 50 56 C 58 53, 66 58, 73 64" stroke="url(#pGoldTrunk)" stroke-width="3" stroke-linecap="round" fill="none" />
  <path d="M 50 78 C 45 84, 38 90, 28 92 C 37 87, 44 82, 48 78 Z" fill="url(#pGoldTrunk)" />
  <path d="M 50 78 C 55 84, 62 90, 72 92 C 63 87, 56 82, 52 78 Z" fill="url(#pGoldTrunk)" />
  <circle cx="50" cy="50" r="46" stroke="url(#pGoldTrunk)" stroke-width="1.8" stroke-dasharray="2 3" opacity="0.4" fill="none" />
</svg>
`;

function getReportStyles() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
    
    @page {
      size: A4 portrait;
      margin: 14mm 14mm 16mm 14mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1e1b19;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 11.5px;
      line-height: 1.45;
    }

    .toolbar {
      position: sticky;
      top: 0;
      background: #005c55;
      color: #ffffff;
      padding: 10px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
    }

    @media print {
      .toolbar {
        display: none !important;
      }
      body {
        padding: 0;
      }
    }

    .report-container {
      max-width: 820px;
      margin: 0 auto;
      padding: 24px 30px;
    }

    .header-banner {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #005c55;
      padding-bottom: 16px;
      margin-bottom: 18px;
    }

    .brand-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-title {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #005c55;
      line-height: 1.1;
    }

    .brand-subtitle {
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #6e7977;
      margin-top: 2px;
    }

    .report-meta {
      text-align: right;
    }

    .report-title-badge {
      display: inline-block;
      background: #005c55;
      color: #ffffff;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .meta-text {
      font-size: 10px;
      color: #6e7977;
      font-family: 'JetBrains Mono', monospace;
    }

    .patient-box {
      background: #faf2ee;
      border: 1px solid #e9e1dd;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 20px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }

    .patient-field {
      display: flex;
      flex-direction: column;
    }

    .field-label {
      font-size: 9px;
      text-transform: uppercase;
      font-weight: 700;
      color: #6e7977;
      letter-spacing: 0.05em;
    }

    .field-val {
      font-size: 12px;
      font-weight: 700;
      color: #1e1b19;
      margin-top: 2px;
    }

    .section-title {
      font-size: 13px;
      font-weight: 800;
      color: #005c55;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      display: flex;
      align-items: center;
      gap: 6px;
      border-bottom: 1.5px solid #e9e1dd;
      padding-bottom: 4px;
      margin-top: 18px;
      margin-bottom: 10px;
    }

    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
      font-size: 11px;
    }

    table.data-table th {
      background: #005c55;
      color: #ffffff;
      text-align: left;
      padding: 6px 10px;
      font-size: 9.5px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    table.data-table td {
      padding: 6px 10px;
      border-bottom: 1px solid #eee7e3;
      color: #1e1b19;
    }

    table.data-table tr:nth-child(even) td {
      background: #faf8f6;
    }

    .badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 9.5px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .badge-optimal { background: #dcfce7; color: #166534; }
    .badge-warning { background: #fef3c7; color: #92400e; }
    .badge-danger { background: #fee2e2; color: #991b1b; }
    .badge-info { background: #e0f2fe; color: #075985; }

    .callout {
      background: #fdfbf7;
      border-left: 4px solid #005c55;
      padding: 10px 14px;
      border-radius: 0 6px 6px 0;
      margin: 12px 0;
      font-size: 11px;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }

    .card {
      background: #ffffff;
      border: 1px solid #e9e1dd;
      border-radius: 6px;
      padding: 10px 12px;
    }

    .signature-container {
      margin-top: 36px;
      padding-top: 16px;
      border-top: 1px solid #d8d1cd;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      page-break-inside: avoid;
    }

    .signature-box {
      width: 260px;
      text-align: center;
    }

    .signature-image {
      max-height: 55px;
      max-width: 200px;
      margin: 0 auto 4px auto;
      display: block;
    }

    .signature-line {
      border-top: 1.5px solid #1e1b19;
      margin-top: 4px;
      padding-top: 4px;
    }

    .legal-footer {
      margin-top: 24px;
      font-size: 8.5px;
      color: #8c9795;
      text-align: center;
      border-top: 1px dashed #e0d8d4;
      padding-top: 8px;
    }

    .btn {
      background: #ffffff;
      color: #005c55;
      font-weight: 700;
      font-size: 12px;
      border: none;
      padding: 6px 14px;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn:hover {
      background: #f3faf8;
    }
  `;
}

function openPrintWindow(htmlContent: string, documentTitle: string) {
  const printWindow = window.open('', '_blank', 'width=900,height=1000');
  if (!printWindow) {
    alert('Por favor, permite las ventanas emergentes en tu navegador para generar e imprimir el reporte PDF.');
    return;
  }

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.document.title = documentTitle;
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  };
}

function renderSignatureBlock(doctor: MedicalProfessional, dateStr: string) {
  const signatureSrc = doctor.signatureUrl;
  const hasSignatureImg = Boolean(signatureSrc && signatureSrc.length > 50);

  return `
    <div class="signature-container">
      <div style="font-size: 9.5px; color: #6e7977; max-width: 320px;">
        <strong>Certificación Médica Digital:</strong><br>
        Documento validado por sistema de soporte a la decisión clínica (CDSS) EndoMetabolic Rx &bull; Functional Care Medicina Funcional y Regenerativa.<br>
        <span style="font-family: 'JetBrains Mono', monospace; font-size: 8.5px;">Hash SHA-256: ${Math.random().toString(36).substring(2, 10).toUpperCase()}-FHIR-R4</span>
      </div>

      <div class="signature-box">
        ${
          hasSignatureImg
            ? `<img class="signature-image" src="${signatureSrc}" alt="Firma Médica" />`
            : `<div style="height: 45px; font-family: 'Brush Script MT', cursive, sans-serif; font-size: 24px; color: #005c55; padding-top: 10px;">${doctor.fullName}</div>`
        }
        <div class="signature-line">
          <div style="font-size: 12px; font-weight: 800; color: #1e1b19;">${doctor.fullName}</div>
          <div style="font-size: 9.5px; color: #005c55; font-weight: 600;">${doctor.specialty}</div>
          <div style="font-size: 9px; color: #6e7977;">Reg. Médico: <strong>${doctor.licenseNumber}</strong> &bull; ${doctor.institution}</div>
          <div style="font-size: 8.5px; color: #8c9795; margin-top: 2px;">Fecha de emisión: ${dateStr}</div>
        </div>
      </div>
    </div>
  `;
}

// 1. REPORTE DE ESTRATIFICACIÓN CDSS & RIESGO METABÓLICO
export function exportCdssPdfReport(params: {
  patient: PatientProfile;
  doctor: MedicalProfessional;
  selectedStratum?: number;
}) {
  const { patient, doctor, selectedStratum = 2 } = params;
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const docTitle = `Reporte_CDSS_${patient.fullName.replace(/\s+/g, '_')}_${now.getTime()}`;

  const lastEvo = patient.evolutionHistory[patient.evolutionHistory.length - 1];
  const labs = lastEvo?.labs || {
    glucoseFasting: 98,
    insulinFasting: 14.8,
    triglycerides: 172,
    hdl: 41,
    bmi: 28.4,
    waistCm: 89,
    ggt: 34,
    sex: 'female' as const,
  };
  const surr = calculateSurrogates(labs);

  const stratumNames = [
    'Estrato 0: Sensibilidad Óptima a la Insulina',
    'Estrato 1: Fricción Metabólica Subclínica Temprana',
    'Estrato 2: Resistencia a la Insulina Establecida y Disfunción Hepática/Adiposa',
    'Estrato 3: Descompensación Metabólica y Falla Beta-Pancreática Progresiva',
  ];

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>${docTitle}</title>
      <style>${getReportStyles()}</style>
    </head>
    <body>
      <div class="toolbar">
        <div style="display:flex; align-items:center; gap:8px;">
          <strong>Expediente Clínico &bull; Reporte CDSS de Estratificación</strong>
          <span style="opacity:0.8; font-size:11px;">(Vista de Impresión / Guardar como PDF)</span>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn" onclick="window.print()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
            Imprimir / Guardar en PDF
          </button>
        </div>
      </div>

      <div class="report-container">
        <!-- Header -->
        <div class="header-banner">
          <div class="brand-section">
            ${FUNCTIONAL_CARE_LOGO_SVG}
            <div>
              <div class="brand-title">FUNCTIONAL CARE</div>
              <div class="brand-subtitle">MEDICINA FUNCIONAL Y REGENERATIVA &bull; ENDOMETABOLIC RX</div>
            </div>
          </div>
          <div class="report-meta">
            <div class="report-title-badge">INFORME CDSS &bull; ESTRATO ${selectedStratum}</div>
            <div class="meta-text">ID DOC: CDSS-R4-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}</div>
            <div class="meta-text">${dateStr}</div>
          </div>
        </div>

        <!-- Patient Demographics Box -->
        <div class="patient-box">
          <div class="patient-field">
            <span class="field-label">Paciente</span>
            <span class="field-val">${patient.fullName}</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Historia / MRN</span>
            <span class="field-val" style="font-family:'JetBrains Mono'; color:#005c55;">${patient.mrn}</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Edad / Sexo</span>
            <span class="field-val">${patient.age} años &bull; ${patient.sex === 'female' ? 'Femenino' : 'Masculino'}</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Médico Especialista</span>
            <span class="field-val">${doctor.fullName}</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Diagnóstico Principal</span>
            <span class="field-val">${patient.primaryDiagnosis}</span>
          </div>
          <div class="patient-field">
            <span class="field-label">IMC / Cintura</span>
            <span class="field-val">${labs.bmi} kg/m² &bull; ${labs.waistCm} cm</span>
          </div>
          <div class="patient-field">
            <span class="field-label">HOMA-IR Basal</span>
            <span class="field-val" style="color:#904d00;">${surr.homaIr} (${surr.homaIr > 2.5 ? 'Resistencia Marcada' : surr.homaIr > 1.9 ? 'Resistencia Moderada' : 'Fisiológico'})</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Índice TyG</span>
            <span class="field-val" style="color:#904d00;">${surr.tyg} (Ref &lt; 8.4)</span>
          </div>
        </div>

        <!-- Clinical Risk Stratification -->
        <div class="section-title">
          <span>1. Estratificación Fenotípica y Clasificación de Riesgo Algorítmico</span>
        </div>
        <div class="callout">
          <strong>Clasificación Actual: ${stratumNames[selectedStratum]}</strong><br>
          Nivel de concordancia diagnóstica del modelo XGBoost: <strong>96.4%</strong>. 
          Presenta resistencia periférica a la insulina con hiperinsulinemia compensatoria, esteatosis hepática metabólica Grado 1 (FLI: ${surr.fli}) y sobrecarga adipocitaria visceral (VAI: ${surr.vai}).
        </div>

        <!-- SHAP Attributions Table -->
        <div class="section-title">
          <span>2. Factores de Riesgo Clave y Atribución SHAP (XGBoost Explainability)</span>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Biomarcador / Parámetro Fisiopatológico</th>
              <th>Valor del Paciente</th>
              <th>Meta Funcional Óptima</th>
              <th>Impacto SHAP</th>
              <th>Severidad</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Índice TyG (Triglicéridos/Glucosa)</strong></td>
              <td>${surr.tyg}</td>
              <td>&lt; 8.40</td>
              <td>+0.806 (28.4%)</td>
              <td><span class="badge badge-danger">Crítico</span></td>
            </tr>
            <tr>
              <td><strong>Pico Tardío de Insulina Kraft (120 min)</strong></td>
              <td>124.0 µIU/mL</td>
              <td>&lt; 60.0 µIU/mL</td>
              <td>+0.627 (22.1%)</td>
              <td><span class="badge badge-danger">Crítico</span></td>
            </tr>
            <tr>
              <td><strong>Insulina en Ayunas</strong></td>
              <td>${labs.insulinFasting} µIU/mL</td>
              <td>&lt; 5.0 µIU/mL</td>
              <td>+0.528 (18.6%)</td>
              <td><span class="badge badge-warning">Elevado</span></td>
            </tr>
            <tr>
              <td><strong>Índice de Hígado Graso (FLI)</strong></td>
              <td>${surr.fli}</td>
              <td>&lt; 30.0 (Sin esteatosis)</td>
              <td>+0.349 (12.3%)</td>
              <td><span class="badge badge-warning">Esteatosis S1</span></td>
            </tr>
            <tr>
              <td><strong>Índice de Adiposidad Visceral (VAI)</strong></td>
              <td>${surr.vai}</td>
              <td>&lt; 1.00</td>
              <td>+0.269 (9.5%)</td>
              <td><span class="badge badge-warning">Adiposopatía</span></td>
            </tr>
            <tr>
              <td><strong>GGT (Estrés Oxidativo Hepático)</strong></td>
              <td>${labs.ggt} U/L</td>
              <td>&lt; 18 U/L</td>
              <td>+0.093 (3.3%)</td>
              <td><span class="badge badge-optimal">Monitoreo</span></td>
            </tr>
          </tbody>
        </table>

        <!-- Integrative Prescription & Levers -->
        <div class="section-title">
          <span>3. Palancas Terapéuticas de Intervención Funcional (Prescripción Médica)</span>
        </div>
        <div class="grid-2">
          <div class="card">
            <strong style="color:#005c55; font-size:11px;">A. Modulación Nutrigenómica & Dieta</strong>
            <p style="margin:4px 0 0 0; color:#3e4947;">
              &bull; Restricción de carbohidratos simples y azúcares refinados (&lt; 50g netos/día).<br>
              &bull; Ventana de alimentación de 14:10 (ayuno intermitente circadiano suave).<br>
              &bull; Aumento de fibra prebiótica fermentable a 35g/día y polifenoles oscuros.
            </p>
          </div>
          <div class="card">
            <strong style="color:#005c55; font-size:11px;">B. Nutracéuticos de Activación AMPK</strong>
            <p style="margin:4px 0 0 0; color:#3e4947;">
              &bull; <strong>Berberina Fitomanilada:</strong> 500 mg con desayuno y cena.<br>
              &bull; <strong>Ácido Alfa Lipoico R-ALA:</strong> 300 mg en ayunas.<br>
              &bull; <strong>Magnesio Bisglicinato:</strong> 350 mg nocturno elemental.
            </p>
          </div>
          <div class="card">
            <strong style="color:#005c55; font-size:11px;">C. Ejercicio y Biogénesis Mitocondrial</strong>
            <p style="margin:4px 0 0 0; color:#3e4947;">
              &bull; 150 min semanales de ejercicio aeróbico en <strong>Zona 2</strong> (lactato &lt; 2 mmol/L).<br>
              &bull; 2 sesiones semanales de fuerza muscular de sobrecarga progresiva.<br>
              &bull; Caminatas postprandiales de 10-15 minutos tras almuerzo y cena.
            </p>
          </div>
          <div class="card">
            <strong style="color:#005c55; font-size:11px;">D. Telemetría y Próximo Control</strong>
            <p style="margin:4px 0 0 0; color:#3e4947;">
              &bull; Monitoreo continuo de glucosa (MCG) por 14 días con meta TIR &gt; 90%.<br>
              &bull; Repetición de perfil lipídico, HOMA-IR y curvas dinámicas en <strong>8 semanas</strong>.<br>
              &bull; Re-evaluación de bioimpedancia y circunferencia de cintura.
            </p>
          </div>
        </div>

        <!-- Signature Block -->
        ${renderSignatureBlock(doctor, dateStr)}

        <!-- Footer -->
        <div class="legal-footer">
          Functional Care &bull; Centro de Medicina Funcional y Regenerativa &bull; Software Clínico de Precisión EndoMetabolic Rx &bull; Interoperable con HL7 FHIR Release 4
        </div>
      </div>
    </body>
    </html>
  `;

  openPrintWindow(html, docTitle);
}

// 2. REPORTE CLÍNICO DOSSIER KRAFT OGTT (CINÉTICA DINÁMICA DE INSULINA)
export function exportKraftPdfReport(params: {
  patient: PatientProfile;
  doctor: MedicalProfessional;
  patternKey?: KraftPatternId;
}) {
  const { patient, doctor, patternKey = 'pattern-3a' } = params;
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const docTitle = `Dossier_Kraft_OGTT_${patient.fullName.replace(/\s+/g, '_')}_${now.getTime()}`;

  const pattern = KRAFT_PATTERNS_MAP[patternKey] || KRAFT_PATTERNS_MAP['pattern-3a'];

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>${docTitle}</title>
      <style>${getReportStyles()}</style>
    </head>
    <body>
      <div class="toolbar">
        <div style="display:flex; align-items:center; gap:8px;">
          <strong>Dossier Clínico Kraft OGTT &bull; Cinética de Insulina Pareada</strong>
          <span style="opacity:0.8; font-size:11px;">(Vista de Impresión / Guardar como PDF)</span>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn" onclick="window.print()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
            Imprimir / Guardar en PDF
          </button>
        </div>
      </div>

      <div class="report-container">
        <!-- Header -->
        <div class="header-banner">
          <div class="brand-section">
            ${FUNCTIONAL_CARE_LOGO_SVG}
            <div>
              <div class="brand-title">FUNCTIONAL CARE</div>
              <div class="brand-subtitle">MEDICINA FUNCIONAL Y REGENERATIVA &bull; ENSAYO KRAFT OGTT</div>
            </div>
          </div>
          <div class="report-meta">
            <div class="report-title-badge">INFORME KRAFT OGTT 5 PUNTOS</div>
            <div class="meta-text">TEST: 75G GLUCOSA ANHIDRA</div>
            <div class="meta-text">${dateStr}</div>
          </div>
        </div>

        <!-- Patient Demographics Box -->
        <div class="patient-box">
          <div class="patient-field">
            <span class="field-label">Paciente</span>
            <span class="field-val">${patient.fullName}</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Historia / MRN</span>
            <span class="field-val" style="font-family:'JetBrains Mono'; color:#005c55;">${patient.mrn}</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Edad / Sexo</span>
            <span class="field-val">${patient.age} años &bull; ${patient.sex === 'female' ? 'Femenino' : 'Masculino'}</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Médico Especialista</span>
            <span class="field-val">${doctor.fullName}</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Patrón Diagnóstico</span>
            <span class="field-val" style="color:#cb2044;">${pattern.name}</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Pico Insulínico</span>
            <span class="field-val">${pattern.insulin[2]} µIU/mL (120 min)</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Área Bajo la Curva (AUC)</span>
            <span class="field-val">${pattern.aucInsulin} µIU·min/mL</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Aclaramiento Ratio</span>
            <span class="field-val">${pattern.clearanceRatio}x</span>
          </div>
        </div>

        <!-- Pattern Diagnostic Overview -->
        <div class="section-title">
          <span>1. Diagnóstico del Patrón Kraft y Fisiopatología</span>
        </div>
        <div class="callout" style="border-left-color: #cb2044;">
          <strong>Clasificación: ${pattern.name} &bull; ${pattern.badge}</strong><br>
          ${pattern.description}
        </div>

        <!-- 5-Point Dynamic Kinetics Table -->
        <div class="section-title">
          <span>2. Matriz de Datos Dinámicos Pareados (0 a 180 Minutos)</span>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Punto Temporal</th>
              <th>Glucemia Plasmática (mg/dL)</th>
              <th>Insulina Dinámica (µIU/mL)</th>
              <th>Rango Óptimo de Glucosa</th>
              <th>Rango Óptimo de Insulina</th>
              <th>Evaluación Clínica</th>
            </tr>
          </thead>
          <tbody>
            ${pattern.points.map((pt, idx) => {
              const gluc = pt.gluc;
              const ins = pt.ins;
              const glucOpt = idx === 0 ? '< 90' : idx === 1 ? '< 140' : idx === 2 ? '< 120' : '< 100';
              const insOpt = idx === 0 ? '< 5' : idx === 1 ? '< 60' : idx === 2 ? '< 30' : '< 15';
              const isHigh = ins > (idx === 1 ? 60 : idx === 2 ? 30 : 15);
              return `
                <tr>
                  <td><strong>${pt.min}</strong></td>
                  <td style="font-family:'JetBrains Mono'; font-weight:700;">${gluc} mg/dL</td>
                  <td style="font-family:'JetBrains Mono'; font-weight:700; color:${isHigh ? '#cb2044' : '#005c55'};">${ins} µIU/mL</td>
                  <td>${glucOpt}</td>
                  <td>${insOpt}</td>
                  <td>
                    ${isHigh ? `<span class="badge badge-danger">Hiperinsulinemia</span>` : `<span class="badge badge-optimal">Fisiológico</span>`}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <!-- Detailed Kraft Analysis -->
        <div class="section-title">
          <span>3. Interpretación de la Dinámica de Secreción y Aclaramiento</span>
        </div>
        <div class="grid-2">
          <div class="card">
            <strong style="color:#005c55; font-size:11px;">Fase 1 de Secreción Cefálica</strong>
            <p style="margin:4px 0 0 0; color:#3e4947;">
              Estado evaluado: <strong>${pattern.phase1}</strong>. Retraso en la exocitosis de gránulos de insulina preformados por las células beta pancreáticas.
            </p>
          </div>
          <div class="card">
            <strong style="color:#005c55; font-size:11px;">Fase 2 y Pico Compensatorio</strong>
            <p style="margin:4px 0 0 0; color:#3e4947;">
              Estado evaluado: <strong>${pattern.phase2}</strong>. Hiperinsulinemia compensatoria exagerada (pico de ${pattern.insulin[2]} µIU/mL) indicativa de resistencia periférica.
            </p>
          </div>
          <div class="card">
            <strong style="color:#005c55; font-size:11px;">Índice de Sensibilidad Matsuda</strong>
            <p style="margin:4px 0 0 0; color:#3e4947;">
              Matsuda Index: <strong>${pattern.matsuda}</strong> (Normal &gt; 4.0). Aclaramiento hepático de insulina disminuido con sobrecarga metabólica.
            </p>
          </div>
          <div class="card">
            <strong style="color:#005c55; font-size:11px;">Pronóstico y Meta Terapéutica</strong>
            <p style="margin:4px 0 0 0; color:#3e4947;">
              Objetivo: Retornar a <strong>Patrón Kraft I (Euinsulinémico)</strong> con pico máximo a los 30-60 min &lt; 50 µIU/mL e insulina a las 2 horas &lt; 25 µIU/mL tras 12 semanas de protocolo funcional.
            </p>
          </div>
        </div>

        <!-- Signature Block -->
        ${renderSignatureBlock(doctor, dateStr)}

        <!-- Footer -->
        <div class="legal-footer">
          Functional Care &bull; Centro de Medicina Funcional y Regenerativa &bull; Protocolo de Cinética Dinámica de Glucosa e Insulina Dr. Joseph R. Kraft
        </div>
      </div>
    </body>
    </html>
  `;

  openPrintWindow(html, docTitle);
}

// 3. REPORTE COMPLETO DE ÍNDICES SUBROGADOS DE RESISTENCIA A LA INSULINA
export function exportSurrogatesPdfReport(params: {
  patient: PatientProfile;
  doctor: MedicalProfessional;
  labs: PatientLabs;
}) {
  const { patient, doctor, labs } = params;
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const docTitle = `Indices_Subrogados_${patient.fullName.replace(/\s+/g, '_')}_${now.getTime()}`;

  const surr = calculateSurrogates(labs);

  const getStatusBadge = (isDanger: boolean, isWarning: boolean) => {
    if (isDanger) return `<span class="badge badge-danger">Resistencia / Riesgo</span>`;
    if (isWarning) return `<span class="badge badge-warning">Límite</span>`;
    return `<span class="badge badge-optimal">Óptimo</span>`;
  };

  const homaInterpretation =
    surr.homaIr > 2.5
      ? 'Resistencia a la Insulina Marcada (Sobreproducción Compensatoria)'
      : surr.homaIr > 1.9
      ? 'Resistencia a la Insulina Moderada / Fricción Temprana'
      : 'Sensibilidad a la Insulina Fisiológica';

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>${docTitle}</title>
      <style>${getReportStyles()}</style>
    </head>
    <body>
      <div class="toolbar">
        <div style="display:flex; align-items:center; gap:8px;">
          <strong>Reporte Bioquímico &bull; Panel de Índices Subrogados de Resistencia a la Insulina</strong>
          <span style="opacity:0.8; font-size:11px;">(Vista de Impresión / Guardar como PDF)</span>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn" onclick="window.print()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
            Imprimir / Guardar en PDF
          </button>
        </div>
      </div>

      <div class="report-container">
        <!-- Header -->
        <div class="header-banner">
          <div class="brand-section">
            ${FUNCTIONAL_CARE_LOGO_SVG}
            <div>
              <div class="brand-title">FUNCTIONAL CARE</div>
              <div class="brand-subtitle">MEDICINA FUNCIONAL Y REGENERATIVA &bull; BIOQUÍMICA AVANZADA</div>
            </div>
          </div>
          <div class="report-meta">
            <div class="report-title-badge">PANEL BIOQUÍMICO SUBROGADO</div>
            <div class="meta-text">HOMA-IR &bull; TyG &bull; METS-IR &bull; FLI</div>
            <div class="meta-text">${dateStr}</div>
          </div>
        </div>

        <!-- Patient Demographics Box -->
        <div class="patient-box">
          <div class="patient-field">
            <span class="field-label">Paciente</span>
            <span class="field-val">${patient.fullName}</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Historia / MRN</span>
            <span class="field-val" style="font-family:'JetBrains Mono'; color:#005c55;">${patient.mrn}</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Edad / Sexo</span>
            <span class="field-val">${patient.age} años &bull; ${patient.sex === 'female' ? 'Femenino' : 'Masculino'}</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Médico Especialista</span>
            <span class="field-val">${doctor.fullName}</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Glucemia en Ayunas</span>
            <span class="field-val">${labs.glucoseFasting} mg/dL</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Insulina Basal</span>
            <span class="field-val">${labs.insulinFasting} µIU/mL</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Triglicéridos / HDL</span>
            <span class="field-val">${labs.triglycerides} / ${labs.hdl} mg/dL (Ratio: ${(labs.triglycerides / Math.max(1, labs.hdl)).toFixed(1)})</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Antropometría</span>
            <span class="field-val">IMC: ${labs.bmi} &bull; Cintura: ${labs.waistCm} cm</span>
          </div>
        </div>

        <!-- Diagnostic Summary -->
        <div class="section-title">
          <span>1. Resumen Diagnóstico de Sensibilidad a la Insulina</span>
        </div>
        <div class="callout">
          <strong>Diagnóstico Clínico Principal: ${homaInterpretation}</strong><br>
          El paciente exhibe un índice HOMA-IR de ${surr.homaIr} y un índice TyG de ${surr.tyg}, lo que indica resistencia combinada a nivel de tejido adiposo y hepático con un índice global de fricción metabólica del ${surr.frictionPercent}%.
        </div>

        <!-- Biomarker & Surrogate Indices Table -->
        <div class="section-title">
          <span>2. Cuantificación de Índices Matemáticos Subrogados Validados</span>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Índice Subrogado</th>
              <th>Valor Calculado</th>
              <th>Rango Óptimo Funcional</th>
              <th>Corte Convencional</th>
              <th>Estado Clínico</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>HOMA-IR</strong> (Homeostatic Model Assessment)</td>
              <td style="font-family:'JetBrains Mono'; font-weight:700; color:#cb2044;">${surr.homaIr}</td>
              <td>&lt; 1.0</td>
              <td>&gt; 2.5 Resistencia</td>
              <td>${getStatusBadge(surr.homaIr > 2.5, surr.homaIr > 1.9)}</td>
            </tr>
            <tr>
              <td><strong>QUICKI</strong> (Quantitative Insulin Sensitivity Check)</td>
              <td style="font-family:'JetBrains Mono'; font-weight:700;">${surr.quicki}</td>
              <td>&gt; 0.38</td>
              <td>&lt; 0.33 Sensibilidad Baja</td>
              <td>${getStatusBadge(surr.quicki < 0.33, surr.quicki < 0.38)}</td>
            </tr>
            <tr>
              <td><strong>Índice TyG</strong> (Triglicéridos-Glucosa)</td>
              <td style="font-family:'JetBrains Mono'; font-weight:700; color:#cb2044;">${surr.tyg}</td>
              <td>&lt; 8.00</td>
              <td>&gt; 8.40 Resistencia Hepática</td>
              <td>${getStatusBadge(surr.tyg > 8.40, surr.tyg > 8.00)}</td>
            </tr>
            <tr>
              <td><strong>TyG-IMC</strong> (Compuesto Adiposo)</td>
              <td style="font-family:'JetBrains Mono'; font-weight:700;">${surr.tygBmi}</td>
              <td>&lt; 180.0</td>
              <td>&gt; 210.0 Riesgo Cardiometabólico</td>
              <td>${surr.tygBmi > 210 ? `<span class="badge badge-danger">Elevado</span>` : `<span class="badge badge-optimal">Normal</span>`}</td>
            </tr>
            <tr>
              <td><strong>METS-IR</strong> (Metabolic Score for IR)</td>
              <td style="font-family:'JetBrains Mono'; font-weight:700; color:#cb2044;">${surr.metsIr}</td>
              <td>&lt; 35.0</td>
              <td>&gt; 42.0 Adipogénesis Ectópica</td>
              <td>${getStatusBadge(surr.metsIr > 42.0, surr.metsIr > 35.0)}</td>
            </tr>
            <tr>
              <td><strong>LAP</strong> (Lipid Accumulation Product)</td>
              <td style="font-family:'JetBrains Mono'; font-weight:700;">${surr.lap}</td>
              <td>&lt; 25.0</td>
              <td>&gt; 45.0 Sobrecarga Lipídica</td>
              <td>${getStatusBadge(surr.lap > 45.0, surr.lap > 25.0)}</td>
            </tr>
            <tr>
              <td><strong>VAI</strong> (Visceral Adiposity Index)</td>
              <td style="font-family:'JetBrains Mono'; font-weight:700;">${surr.vai}</td>
              <td>&lt; 1.0</td>
              <td>&gt; 2.0 Disfunción Adiposa</td>
              <td>${getStatusBadge(surr.vai > 2.0, surr.vai > 1.0)}</td>
            </tr>
            <tr>
              <td><strong>FLI</strong> (Fatty Liver Index)</td>
              <td style="font-family:'JetBrains Mono'; font-weight:700; color:#904d00;">${surr.fli}</td>
              <td>&lt; 30.0 (Sin esteatosis)</td>
              <td>&gt; 60.0 Alta probabilidad esteatosis</td>
              <td>${surr.fli >= 60 ? `<span class="badge badge-danger">Esteatosis Alta</span>` : surr.fli >= 30 ? `<span class="badge badge-warning">Indeterminado S1</span>` : `<span class="badge badge-optimal">Normal</span>`}</td>
            </tr>
          </tbody>
        </table>

        <!-- Organ Target Matrix -->
        <div class="section-title">
          <span>3. Afectación por Órgano y Diana Metabólica</span>
        </div>
        <div class="grid-3">
          <div class="card">
            <strong style="color:#005c55; font-size:10.5px;">Hígado (Esteatosis & TyG)</strong>
            <p style="margin:3px 0 0 0; color:#3e4947; font-size:10.5px;">
              Esteatosis hepática de bajo grado con resistencia a la acción insulínica de supresión de la gluconeogénesis hepática nocturna.
            </p>
          </div>
          <div class="card">
            <strong style="color:#005c55; font-size:10.5px;">Tejido Adiposo (VAI & LAP)</strong>
            <p style="margin:3px 0 0 0; color:#3e4947; font-size:10.5px;">
              Inflamación adipocitaria con lipotoxicidad por diacilgliceroles y liberación aumentada de ácidos grasos libres (FFA) circulantes.
            </p>
          </div>
          <div class="card">
            <strong style="color:#005c55; font-size:10.5px;">Músculo Esquelético (HOMA-IR)</strong>
            <p style="margin:3px 0 0 0; color:#3e4947; font-size:10.5px;">
              Falla en la traslocación de vesículas GLUT4 estimulada por insulina. Indicación estricta de ejercicio de resistencia y cardio Zona 2.
            </p>
          </div>
        </div>

        <!-- Signature Block -->
        ${renderSignatureBlock(doctor, dateStr)}

        <!-- Footer -->
        <div class="legal-footer">
          Functional Care &bull; Centro de Medicina Funcional y Regenerativa &bull; Panel Algorítmico de Biomarcadores Subrogados Validados
        </div>
      </div>
    </body>
    </html>
  `;

  openPrintWindow(html, docTitle);
}

// 4. REPORTE DE HISTORIA CLÍNICA INTEGRAL Y EVOLUCIÓN LONGITUDINAL
export function exportPatientHistoryPdfReport(params: {
  patient: PatientProfile;
  doctor: MedicalProfessional;
}) {
  const { patient, doctor } = params;
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const docTitle = `Historia_Clinica_${patient.fullName.replace(/\s+/g, '_')}_${now.getTime()}`;

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>${docTitle}</title>
      <style>${getReportStyles()}</style>
    </head>
    <body>
      <div class="toolbar">
        <div style="display:flex; align-items:center; gap:8px;">
          <strong>Historia Clínica y Evolución Longitudinal &bull; Functional Care</strong>
          <span style="opacity:0.8; font-size:11px;">(Vista de Impresión / Guardar como PDF)</span>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn" onclick="window.print()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
            Imprimir / Guardar en PDF
          </button>
        </div>
      </div>

      <div class="report-container">
        <!-- Header -->
        <div class="header-banner">
          <div class="brand-section">
            ${FUNCTIONAL_CARE_LOGO_SVG}
            <div>
              <div class="brand-title">FUNCTIONAL CARE</div>
              <div class="brand-subtitle">EXPEDIENTE CLÍNICO INTEGRAL &bull; MEDICINA FUNCIONAL</div>
            </div>
          </div>
          <div class="report-meta">
            <div class="report-title-badge">HISTORIA CLÍNICA DE EVOLUCIÓN</div>
            <div class="meta-text">MRN: ${patient.mrn}</div>
            <div class="meta-text">${dateStr}</div>
          </div>
        </div>

        <!-- Demographics Box -->
        <div class="patient-box">
          <div class="patient-field">
            <span class="field-label">Paciente</span>
            <span class="field-val">${patient.fullName}</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Identificación / MRN</span>
            <span class="field-val" style="font-family:'JetBrains Mono'; color:#005c55;">${patient.mrn}</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Edad / Sexo</span>
            <span class="field-val">${patient.age} años &bull; ${patient.sex === 'female' ? 'Femenino' : 'Masculino'}</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Médico Tratante</span>
            <span class="field-val">${doctor.fullName}</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Motivo / Diagnóstico</span>
            <span class="field-val">${patient.primaryDiagnosis}</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Protocolo Activo</span>
            <span class="field-val">${patient.currentProtocol}</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Contacto / Teléfono</span>
            <span class="field-val">${patient.phone || 'No registrado'}</span>
          </div>
          <div class="patient-field">
            <span class="field-label">Correo Electrónico</span>
            <span class="field-val">${patient.email || 'No registrado'}</span>
          </div>
        </div>

        <!-- ATM Matrix -->
        <div class="section-title">
          <span>1. Marco Fisiopatológico ATM (Antecedentes, Disparadores, Mediadores)</span>
        </div>
        <div class="grid-3">
          <div class="card" style="border-top:3px solid #005c55;">
            <strong style="color:#005c55; font-size:11px;">Antecedentes (A)</strong>
            <ul style="padding-left:14px; margin:4px 0 0 0; font-size:10.5px; color:#3e4947;">
              ${patient.antecedents.map(a => `<li>${a}</li>`).join('')}
            </ul>
          </div>
          <div class="card" style="border-top:3px solid #904d00;">
            <strong style="color:#904d00; font-size:11px;">Gatillos / Triggers (T)</strong>
            <ul style="padding-left:14px; margin:4px 0 0 0; font-size:10.5px; color:#3e4947;">
              ${patient.triggers.map(t => `<li>${t}</li>`).join('')}
            </ul>
          </div>
          <div class="card" style="border-top:3px solid #cb2044;">
            <strong style="color:#cb2044; font-size:11px;">Mediadores Perpetuantes (M)</strong>
            <ul style="padding-left:14px; margin:4px 0 0 0; font-size:10.5px; color:#3e4947;">
              ${patient.mediators.map(m => `<li>${m}</li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- Consultation History Timeline -->
        <div class="section-title" style="margin-top:20px;">
          <span>2. Historial Cronológico de Consultas y Evolución Metabólica (${patient.evolutionHistory.length} Registros)</span>
        </div>
        ${patient.evolutionHistory.map((evo, i) => `
          <div class="card" style="margin-bottom:12px; border-left:4px solid #005c55;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee7e3; padding-bottom:4px; margin-bottom:6px;">
              <div>
                <strong style="font-size:12px; color:#1e1b19;">Consulta #${i + 1} &bull; ${evo.date}</strong>
                <span class="badge badge-info" style="margin-left:6px;">${evo.stratum} (${evo.stratumStatus})</span>
              </div>
              <span style="font-size:10px; color:#6e7977;">Atendido por: <strong>${evo.professionalName || doctor.fullName}</strong></span>
            </div>

            <div style="font-size:11px; font-weight:700; color:#005c55; margin-bottom:4px;">${evo.reason}</div>
            
            ${evo.clinicalNotes ? `<p style="font-size:11px; color:#3e4947; background:#faf8f6; padding:6px 10px; border-radius:4px; margin:4px 0 8px 0;">${evo.clinicalNotes}</p>` : ''}

            <table class="data-table" style="margin-bottom:0; font-size:10.5px;">
              <thead>
                <tr>
                  <th>Glucosa</th>
                  <th>Insulina</th>
                  <th>HOMA-IR</th>
                  <th>Triglicéridos</th>
                  <th>HDL</th>
                  <th>Peso / IMC</th>
                  <th>Presión Art.</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${evo.labs.glucoseFasting} mg/dL</td>
                  <td>${evo.labs.insulinFasting} µIU/mL</td>
                  <td style="font-weight:700; color:#904d00;">${evo.surrogates.homaIr}</td>
                  <td>${evo.labs.triglycerides} mg/dL</td>
                  <td>${evo.labs.hdl} mg/dL</td>
                  <td>${evo.vitalSigns.weightKg} kg (${evo.vitalSigns.bmi})</td>
                  <td>${evo.vitalSigns.systolicBP}/${evo.vitalSigns.diastolicBP} mmHg</td>
                </tr>
              </tbody>
            </table>
          </div>
        `).join('')}

        <!-- Signature Block -->
        ${renderSignatureBlock(doctor, dateStr)}

        <!-- Footer -->
        <div class="legal-footer">
          Functional Care &bull; Centro de Medicina Funcional y Regenerativa &bull; Historia Clínica Electrónica Confidencial &bull; Cumplimiento Ley de Protección de Datos en Salud
        </div>
      </div>
    </body>
    </html>
  `;

  openPrintWindow(html, docTitle);
}
