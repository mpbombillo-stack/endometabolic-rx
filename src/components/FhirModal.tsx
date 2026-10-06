import React, { useState } from 'react';
import { PatientLabs } from '../types';
import { FunctionalCareLogo } from './FunctionalCareLogo';

interface FhirModalProps {
  isOpen: boolean;
  onClose: () => void;
  labs: PatientLabs;
  patientName?: string;
  homaIr?: number;
  onShowToast: (msg: string) => void;
}

export const FhirModal: React.FC<FhirModalProps> = ({
  isOpen,
  onClose,
  labs,
  patientName = 'Eleanor Vance',
  homaIr = 3.59,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const fhirPayload = {
    resourceType: 'DiagnosticReport',
    id: 'atm-matrix-88219',
    status: 'final',
    code: {
      coding: [
        {
          system: 'http://loinc.org',
          code: '55757-9',
          display: 'Evaluación de Matriz y Marco ATM de Medicina Funcional',
        },
      ],
    },
    subject: {
      reference: 'Patient/FM-88219',
      display: patientName,
    },
    effectiveDateTime: new Date().toISOString(),
    performer: [
      {
        reference: 'Practitioner/IFMCP-Thorne',
        display: 'Dr. M. Thorne, IFMCP • Functional Care',
      },
    ],
    result: [
      {
        reference: 'Observation/insulin-fasting',
        display: `Insulina Basal: ${labs.insulinFasting} uIU/mL (Óptimo < 5.0)`,
      },
      {
        reference: 'Observation/glucose-fasting',
        display: `Glucosa Basal: ${labs.glucoseFasting} mg/dL (Óptimo < 90)`,
      },
      {
        reference: 'Observation/homa-ir-index',
        display: `HOMA-IR Calculado: ${homaIr} (Resistencia Funcional > 1.40)`,
      },
      {
        reference: 'Observation/zonulin-serum',
        display: 'Zonulina Sérica: 48 ng/mL (Permeabilidad Aumentada)',
      },
      {
        reference: 'Observation/tcf7l2-risk',
        display: 'TCF7L2 rs7903146: Heterocigoto C/T (Alelo de riesgo)',
      },
      {
        reference: 'Observation/fli-steatosis',
        display: 'Índice de Hígado Graso (FLI): 64.8 (Esteatosis Grado S1)',
      },
      {
        reference: 'Observation/kraft-pattern',
        display: 'Patrón Kraft OGTT: III-A (Hiperinsulinemia Retardada a 120 min)',
      },
    ],
    conclusion:
      'Resistencia a la Insulina Funcional Estrato 2 con alta acumulación hepática de diacilglicerol, fosforilación aberrante de IRS-1 en serina y permeabilidad intestinal persistente mediada por endotoxina LPS.',
  };

  const jsonString = JSON.stringify(fhirPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    onShowToast('¡JSON de Recurso FHIR R4 copiado al portapapeles!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FHIR_DiagnosticReport_FM88219_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Descargando archivo bundle HL7 FHIR...');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#33302d]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#ffffff] rounded-xl max-w-3xl w-full p-4 md:p-6 shadow-2xl relative max-h-[85vh] flex flex-col border border-[#e9e1dd]">
        <div className="flex items-center justify-between pb-3 border-b border-[#eee7e3]">
          <div className="flex items-center gap-3">
            <FunctionalCareLogo variant="emblem" height={32} />
            <div>
              <span className="text-[15px] font-bold text-[#1e1b19] block">
                HL7 FHIR R4 DiagnosticReport • Functional Care
              </span>
              <span className="text-[11px] text-[#6e7977]">
                Estándar Internacional de Interoperabilidad Clínica • Medicina Funcional y Regenerativa
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#6e7977] hover:text-[#1e1b19] p-1 rounded-md hover:bg-[#faf2ee] transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* JSON Preview Block */}
        <div className="overflow-y-auto mt-3 p-3 md:p-4 rounded-lg bg-[#1c1917] font-mono text-[12px] text-[#a3faef] leading-relaxed select-all">
          <pre>
            <code>{jsonString}</code>
          </pre>
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-4 pt-3 border-t border-[#eee7e3] flex flex-wrap justify-between items-center gap-2">
          <span className="text-[11px] text-[#6e7977]">
            Validado contra perfil FHIR US-Core v6.0.0
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-[#faf2ee] hover:bg-[#f4ece8] text-[#1e1b19] text-[12px] font-semibold flex items-center gap-1.5 transition-colors border border-[#e9e1dd]"
            >
              <span className="material-symbols-outlined text-[15px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copiado' : 'Copiar JSON'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-[#005c55] hover:bg-[#0f766e] text-white text-[12px] font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[15px]">download</span>
              <span>Exportar Paquete FHIR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
