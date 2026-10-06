import React from 'react';
import { MatrixNodeDetail } from '../types';

interface InspectorModalProps {
  node: MatrixNodeDetail | null;
  onClose: () => void;
  onApplyProtocol: (nodeName: string) => void;
}

export const InspectorModal: React.FC<InspectorModalProps> = ({
  node,
  onClose,
  onApplyProtocol,
}) => {
  if (!node) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#33302d]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#ffffff] rounded-xl max-w-2xl w-full p-5 md:p-6 shadow-2xl relative border border-[#e9e1dd]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6e7977] hover:text-[#1e1b19] p-1 rounded-md hover:bg-[#faf2ee]"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>

        <div className="flex items-center gap-2 text-[#005c55] mb-2">
          <span className="material-symbols-outlined text-[24px]">{node.icon}</span>
          <span className="text-[11px] uppercase tracking-wider font-bold">
            {node.nodeNumber} • Análisis Clínico en Profundidad
          </span>
        </div>

        <h3 className="text-[20px] font-bold text-[#1e1b19]">{node.name}</h3>
        <p className="text-[12px] text-[#6e7977] mb-3">{node.subtitle}</p>

        {/* Biological Mechanism Description */}
        <div className="p-3.5 rounded-lg bg-[#faf2ee] text-[13px] text-[#1e1b19] leading-relaxed border border-[#eee7e3] mb-4">
          <span className="font-semibold block text-[#005c55] text-[11px] uppercase mb-1">
            Fisiopatología Celular y Molecular:
          </span>
          {node.deepDescription}
        </div>

        {/* Node Lab Parameters */}
        <div className="space-y-2 mb-4">
          <span className="text-[11px] font-bold text-[#1e1b19] uppercase tracking-wider block">
            Biomarcadores Específicos Evaluados:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {node.parameters.map((param, i) => (
              <div
                key={i}
                className="p-2.5 rounded-lg bg-[#f4ece8]/60 border border-[#e9e1dd] flex flex-col gap-0.5 text-[12px]"
              >
                <span className="text-[#6e7977]">{param.label}</span>
                <span className={`font-semibold ${param.colorClass || 'text-[#1e1b19]'}`}>
                  {param.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Therapeutic Protocol */}
        <div className="p-3.5 rounded-lg bg-[#005c55]/5 border border-[#005c55]/20 mb-5">
          <div className="flex items-center gap-1.5 text-[#005c55] font-bold text-[12px] mb-1">
            <span className="material-symbols-outlined text-[16px]">prescriptions</span>
            <span>Protocolo de Restauración Funcional Dirigida:</span>
          </div>
          <p className="text-[12.5px] text-[#005c55] font-medium leading-snug">
            {node.protocol}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-[#eee7e3]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#faf2ee] hover:bg-[#f4ece8] text-[#1e1b19] text-[12px] font-semibold transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={() => onApplyProtocol(node.name)}
            className="px-4 py-2 rounded-lg bg-[#005c55] hover:bg-[#0f766e] text-white text-[12px] font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">check</span>
            <span>Añadir Protocolo a Prescripción Activa</span>
          </button>
        </div>
      </div>
    </div>
  );
};
