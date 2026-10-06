import React, { useState, useMemo } from 'react';
import { MedicalProfessional, PatientProfile, PatientEvolution } from '../types';
import { calculateSurrogates } from '../utils/metabolicCalculators';

interface NewEvolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  onSaveEvolution: (patientId: string, newEvolution: PatientEvolution) => void;
  professionals: MedicalProfessional[];
  activeDoctorId: string;
}

export const NewEvolutionModal: React.FC<NewEvolutionModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSaveEvolution,
  professionals,
  activeDoctorId,
}) => {
  const lastEvo = patient.evolutionHistory[patient.evolutionHistory.length - 1];

  // Evolution Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('Control de Seguimiento Metabólico y Evaluación de Respuesta Terapéutica');
  const [fastingHours, setFastingHours] = useState(lastEvo?.fastingHours || 12);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [activeProtocol, setActiveProtocol] = useState(patient.currentProtocol || '');
  const [doctorId, setDoctorId] = useState(activeDoctorId || professionals[0]?.id || 'doc-1');

  // Vitals State (default to last visit)
  const [weightKg, setWeightKg] = useState<number>(lastEvo?.vitalSigns.weightKg || 70);
  const [heightCm] = useState<number>(lastEvo?.vitalSigns.heightCm || 165);
  const [waistCm, setWaistCm] = useState<number>(lastEvo?.vitalSigns.waistCm || 85);
  const [systolicBP, setSystolicBP] = useState<number>(lastEvo?.vitalSigns.systolicBP || 120);
  const [diastolicBP, setDiastolicBP] = useState<number>(lastEvo?.vitalSigns.diastolicBP || 80);
  const [heartRate, setHeartRate] = useState<number>(lastEvo?.vitalSigns.heartRate || 72);

  // Labs State (default to last visit)
  const [glucoseFasting, setGlucoseFasting] = useState<number>(lastEvo?.labs.glucoseFasting || 95);
  const [insulinFasting, setInsulinFasting] = useState<number>(lastEvo?.labs.insulinFasting || 12);
  const [triglycerides, setTriglycerides] = useState<number>(lastEvo?.labs.triglycerides || 150);
  const [hdl, setHdl] = useState<number>(lastEvo?.labs.hdl || 45);
  const [ggt, setGgt] = useState<number>(lastEvo?.labs.ggt || 28);
  const [hba1c, setHba1c] = useState<number>(lastEvo?.labs.hba1c || 5.4);
  const [hsCrp, setHsCrp] = useState<number>(lastEvo?.labs.hsCrp || 1.8);
  const [totalCholesterol, setTotalCholesterol] = useState<number>(lastEvo?.labs.totalCholesterol || 190);
  const [ldl, setLdl] = useState<number>(lastEvo?.labs.ldl || 115);
  const [ast, setAst] = useState<number>(lastEvo?.labs.ast || 22);
  const [alt, setAlt] = useState<number>(lastEvo?.labs.alt || 26);

  // Calculate BMI
  const bmi = useMemo(() => {
    const heightM = heightCm / 100;
    if (heightM <= 0) return 22;
    return Number((weightKg / (heightM * heightM)).toFixed(1));
  }, [weightKg, heightCm]);

  // Real-time Surrogates
  const newSurrogates = useMemo(() => {
    return calculateSurrogates({
      glucoseFasting,
      insulinFasting,
      triglycerides,
      hdl,
      bmi,
      waistCm,
      ggt,
      sex: patient.sex,
    });
  }, [glucoseFasting, insulinFasting, triglycerides, hdl, bmi, waistCm, ggt, patient.sex]);

  // Stratum
  const stratum = useMemo<'Estrato 0' | 'Estrato 1' | 'Estrato 2' | 'Estrato 3'>(() => {
    const homa = newSurrogates.homaIr;
    const tyg = newSurrogates.tyg;
    const trigHdl = triglycerides / Math.max(1, hdl);

    if (homa >= 4.5 || tyg >= 9.3 || trigHdl >= 5.0) return 'Estrato 3';
    if (homa >= 2.5 || tyg >= 8.8 || trigHdl >= 3.0) return 'Estrato 2';
    if (homa >= 1.4 || tyg >= 8.1 || trigHdl >= 2.0) return 'Estrato 1';
    return 'Estrato 0';
  }, [newSurrogates, triglycerides, hdl]);

  const stratumStatus = useMemo(() => {
    if (stratum === 'Estrato 3') return 'Fricción Severa Activa';
    if (stratum === 'Estrato 2') return 'Fricción Moderada';
    if (stratum === 'Estrato 1') return 'Fricción Subclínica';
    return 'Sensibilidad Óptima';
  }, [stratum]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = professionals.find((p) => p.id === doctorId) || professionals[0];

    const newEvolution: PatientEvolution = {
      id: `evo-${Date.now()}`,
      date,
      reason,
      fastingHours,
      clinicalNotes,
      vitalSigns: {
        systolicBP,
        diastolicBP,
        heartRate,
        weightKg,
        heightCm,
        bmi,
        waistCm,
      },
      labs: {
        glucoseFasting,
        insulinFasting,
        triglycerides,
        hdl,
        bmi,
        waistCm,
        ggt,
        sex: patient.sex,
        hba1c,
        totalCholesterol,
        ldl,
        ast,
        alt,
        hsCrp,
      },
      surrogates: newSurrogates,
      stratum,
      stratumStatus,
      activeProtocol,
      professionalId: doc?.id || 'doc-1',
      professionalName: doc?.fullName || 'Dr. Mauricio Thorne, IFMCP',
    };

    onSaveEvolution(patient.id, newEvolution);
    onClose();
  };

  // Deltas vs last visit
  const homaDelta = lastEvo ? (newSurrogates.homaIr - lastEvo.surrogates.homaIr).toFixed(2) : null;
  const weightDelta = lastEvo ? (weightKg - lastEvo.vitalSigns.weightKg).toFixed(1) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-[#e7e5e4] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#005c55] text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold">Registrar Nueva Evolución / Consulta de Control</h3>
              <span className="bg-white/20 text-white text-[11px] px-2 py-0.5 rounded font-mono font-semibold">
                {patient.mrn}
              </span>
            </div>
            <p className="text-xs text-white/80">
              Paciente: <strong>{patient.fullName}</strong> ({patient.age}a, {patient.sex === 'female' ? 'Femenino' : 'Masculino'})
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 p-5 overflow-y-auto space-y-4">
          {/* General Visit Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1e1b19] mb-1">Fecha de Consulta *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#d8d1cd] focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1e1b19] mb-1">Horas de Ayuno</label>
              <input
                type="number"
                step="0.5"
                value={fastingHours}
                onChange={(e) => setFastingHours(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#d8d1cd] focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1e1b19] mb-1">Médico que Atiende</label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#d8d1cd] focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5] font-semibold text-[#005c55]"
              >
                {professionals.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.fullName} ({doc.licenseNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1e1b19] mb-1">Motivo de Consulta / Control</label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#d8d1cd] focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5]"
            />
          </div>

          {/* Vitals & Biomarkers Grid */}
          <div className="p-3 bg-[#faf2ee] rounded-xl border border-[#e9e1dd] space-y-3">
            <span className="text-xs font-bold text-[#005c55] uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">monitor_heart</span>
              Signos Vitales y Laboratorios Actualizados
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#1e1b19]">Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full text-xs font-bold bg-white px-2 py-1.5 rounded border border-[#d8d1cd]"
                />
                {weightDelta && (
                  <span
                    className={`text-[10px] font-semibold ${
                      Number(weightDelta) < 0 ? 'text-[#005c55]' : 'text-[#cb2044]'
                    }`}
                  >
                    Delta: {Number(weightDelta) > 0 ? `+${weightDelta}` : weightDelta} kg
                  </span>
                )}
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#1e1b19]">Cintura (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={waistCm}
                  onChange={(e) => setWaistCm(Number(e.target.value))}
                  className="w-full text-xs font-bold bg-white px-2 py-1.5 rounded border border-[#d8d1cd]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#1e1b19]">Glucosa (mg/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  value={glucoseFasting}
                  onChange={(e) => setGlucoseFasting(Number(e.target.value))}
                  className="w-full text-xs font-bold bg-white px-2 py-1.5 rounded border border-[#d8d1cd]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#1e1b19]">Insulina (μIU/mL)</label>
                <input
                  type="number"
                  step="0.1"
                  value={insulinFasting}
                  onChange={(e) => setInsulinFasting(Number(e.target.value))}
                  className="w-full text-xs font-bold bg-white px-2 py-1.5 rounded border border-[#d8d1cd] text-[#904d00]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#1e1b19]">Triglicéridos (mg/dL)</label>
                <input
                  type="number"
                  value={triglycerides}
                  onChange={(e) => setTriglycerides(Number(e.target.value))}
                  className="w-full text-xs font-bold bg-white px-2 py-1.5 rounded border border-[#d8d1cd]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#1e1b19]">Colesterol HDL</label>
                <input
                  type="number"
                  value={hdl}
                  onChange={(e) => setHdl(Number(e.target.value))}
                  className="w-full text-xs font-bold bg-white px-2 py-1.5 rounded border border-[#d8d1cd]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#1e1b19]">GGT (U/L)</label>
                <input
                  type="number"
                  value={ggt}
                  onChange={(e) => setGgt(Number(e.target.value))}
                  className="w-full text-xs font-bold bg-white px-2 py-1.5 rounded border border-[#d8d1cd]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#1e1b19]">hs-PCR (mg/L)</label>
                <input
                  type="number"
                  step="0.1"
                  value={hsCrp}
                  onChange={(e) => setHsCrp(Number(e.target.value))}
                  className="w-full text-xs font-bold bg-white px-2 py-1.5 rounded border border-[#d8d1cd]"
                />
              </div>
            </div>

            {/* Calculated Comparison Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#e9e1dd] text-xs">
              <div className="bg-white p-2 rounded-lg border border-[#e9e1dd]">
                <span className="text-[10px] text-[#6e7977] block font-mono">Nuevo HOMA-IR</span>
                <span className="text-sm font-bold text-[#904d00]">{newSurrogates.homaIr}</span>
                {homaDelta && (
                  <span
                    className={`block text-[10px] font-bold ${
                      Number(homaDelta) < 0 ? 'text-[#005c55]' : 'text-[#cb2044]'
                    }`}
                  >
                    {Number(homaDelta) > 0 ? `+${homaDelta}` : homaDelta} vs previa
                  </span>
                )}
              </div>

              <div className="bg-white p-2 rounded-lg border border-[#e9e1dd]">
                <span className="text-[10px] text-[#6e7977] block font-mono">Nuevo Estrato</span>
                <span className="text-xs font-bold text-[#005c55]">{stratum}</span>
                <span className="text-[10px] text-[#6e7977] block leading-tight">{stratumStatus}</span>
              </div>

              <div className="bg-white p-2 rounded-lg border border-[#e9e1dd]">
                <span className="text-[10px] text-[#6e7977] block font-mono">Ratio Trig/HDL</span>
                <span className="text-sm font-bold text-[#1e1b19]">
                  {(triglycerides / Math.max(1, hdl)).toFixed(2)}
                </span>
              </div>

              <div className="bg-white p-2 rounded-lg border border-[#e9e1dd]">
                <span className="text-[10px] text-[#6e7977] block font-mono">IMC Actual</span>
                <span className="text-sm font-bold text-[#1e1b19]">{bmi} kg/m²</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1e1b19] mb-1">
              Notas Clínicas de la Consulta & Examen Físico
            </label>
            <textarea
              rows={3}
              placeholder="Paciente refiere mejoría en niveles de energía, adherencia al plan nutricional antiinflamatorio..."
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-[#d8d1cd] focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1e1b19] mb-1">
              Ajustes al Plan / Protocolo Terapéutico
            </label>
            <input
              type="text"
              value={activeProtocol}
              onChange={(e) => setActiveProtocol(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#d8d1cd] focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5] font-medium"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#e9e1dd] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#6e7977] hover:text-[#1e1b19]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#005c55] hover:bg-[#0f766e] text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">save</span>
              <span>Guardar Evolución & Actualizar Historia</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
