import React, { useState, useMemo } from 'react';
import { MedicalProfessional, PatientProfile, PatientEvolution } from '../types';
import { calculateSurrogates } from '../utils/metabolicCalculators';
import { FunctionalCareLogo } from './FunctionalCareLogo';

interface NewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePatient: (newPatient: PatientProfile) => void;
  professionals: MedicalProfessional[];
  activeDoctorId: string;
}

export const NewPatientModal: React.FC<NewPatientModalProps> = ({
  isOpen,
  onClose,
  onSavePatient,
  professionals,
  activeDoctorId,
}) => {
  const [activeStep, setActiveStep] = useState<'demographics' | 'vitals' | 'biochemistry' | 'atm'>('demographics');

  // Form State
  const [fullName, setFullName] = useState('');
  const [mrn, setMrn] = useState(`FM-${Math.floor(10000 + Math.random() * 90000)}`);
  const [birthDate, setBirthDate] = useState('1985-06-15');
  const [sex, setSex] = useState<'female' | 'male'>('female');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [occupation, setOccupation] = useState('');
  const [assignedDoctorId, setAssignedDoctorId] = useState(activeDoctorId || professionals[0]?.id || 'doc-1');

  // Vitals & Anthropometry
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightCm, setHeightCm] = useState<number>(165);
  const [waistCm, setWaistCm] = useState<number>(85);
  const [systolicBP, setSystolicBP] = useState<number>(120);
  const [diastolicBP, setDiastolicBP] = useState<number>(80);
  const [heartRate, setHeartRate] = useState<number>(72);
  const [fastingHours, setFastingHours] = useState<number>(12);

  // Biochemistry
  const [glucoseFasting, setGlucoseFasting] = useState<number>(95);
  const [insulinFasting, setInsulinFasting] = useState<number>(12.5);
  const [triglycerides, setTriglycerides] = useState<number>(150);
  const [hdl, setHdl] = useState<number>(45);
  const [totalCholesterol, setTotalCholesterol] = useState<number>(190);
  const [ldl, setLdl] = useState<number>(115);
  const [ggt, setGgt] = useState<number>(28);
  const [ast, setAst] = useState<number>(22);
  const [alt, setAlt] = useState<number>(26);
  const [hba1c, setHba1c] = useState<number>(5.4);
  const [hsCrp, setHsCrp] = useState<number>(1.8);

  // ATM Matrix & Reason
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState('');
  const [initialReason, setInitialReason] = useState('Consulta Inicial de Medicina Funcional y Evaluación Metabólica');
  const [antecedentsText, setAntecedentsText] = useState('Antecedentes familiares de diabetes o resistencia a la insulina.');
  const [triggersText, setTriggersText] = useState('Estrés crónico, alimentación pro-inflamatoria o alteraciones del descanso.');
  const [mediatorsText, setMediatorsText] = useState('Inflamación tisular de bajo grado, esteatosis subclínica.');
  const [currentProtocol, setCurrentProtocol] = useState('Fase 1: Evaluación integral ATM, 5R digestivo y optimización de sensibilidad a la insulina.');

  // Calculate age from birthDate
  const age = useMemo(() => {
    if (!birthDate) return 35;
    const diff = Date.now() - new Date(birthDate).getTime();
    const ageDt = new Date(diff);
    return Math.abs(ageDt.getUTCFullYear() - 1970) || 35;
  }, [birthDate]);

  // Calculate BMI in real-time
  const bmi = useMemo(() => {
    const heightM = heightCm / 100;
    if (heightM <= 0) return 22;
    return Number((weightKg / (heightM * heightM)).toFixed(1));
  }, [weightKg, heightCm]);

  // Real-time surrogate indices calculation
  const calculatedSurrogates = useMemo(() => {
    return calculateSurrogates({
      glucoseFasting,
      insulinFasting,
      triglycerides,
      hdl,
      bmi,
      waistCm,
      ggt,
      sex,
    });
  }, [glucoseFasting, insulinFasting, triglycerides, hdl, bmi, waistCm, ggt, sex]);

  // Determine Stratum
  const { stratum, stratumStatus, stratumColor } = useMemo(() => {
    const homa = calculatedSurrogates.homaIr;
    const tyg = calculatedSurrogates.tyg;
    const trigHdl = triglycerides / Math.max(1, hdl);

    if (homa >= 4.5 || tyg >= 9.3 || trigHdl >= 5.0) {
      return {
        stratum: 'Estrato 3' as const,
        stratumStatus: 'Fricción Metabólica Severa / Resistencia Descompensada',
        stratumColor: 'text-[#cb2044] bg-[#cb2044]/10 border-[#cb2044]/30',
      };
    }
    if (homa >= 2.5 || tyg >= 8.8 || trigHdl >= 3.0) {
      return {
        stratum: 'Estrato 2' as const,
        stratumStatus: 'Fricción Metabólica Moderada',
        stratumColor: 'text-[#fe932c] bg-[#fe932c]/10 border-[#fe932c]/30',
      };
    }
    if (homa >= 1.4 || tyg >= 8.1 || trigHdl >= 2.0) {
      return {
        stratum: 'Estrato 1' as const,
        stratumStatus: 'Fricción Subclínica Oculta',
        stratumColor: 'text-[#005c55] bg-[#005c55]/10 border-[#005c55]/30',
      };
    }
    return {
      stratum: 'Estrato 0' as const,
      stratumStatus: 'Sensibilidad a la Insulina Óptima',
      stratumColor: 'text-[#0f766e] bg-[#0f766e]/10 border-[#0f766e]/30',
    };
  }, [calculatedSurrogates, triglycerides, hdl]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      alert('Por favor ingrese el nombre completo del paciente.');
      return;
    }

    const doctor = professionals.find((p) => p.id === assignedDoctorId) || professionals[0];

    const initialEvolution: PatientEvolution = {
      id: `evo-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      reason: initialReason,
      fastingHours,
      clinicalNotes: `Ingreso inicial de paciente. Diagnóstico preliminar: ${primaryDiagnosis || stratumStatus}.`,
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
        sex,
        hba1c,
        totalCholesterol,
        ldl,
        ast,
        alt,
        hsCrp,
      },
      surrogates: calculatedSurrogates,
      stratum,
      stratumStatus,
      activeProtocol: currentProtocol,
      professionalId: doctor?.id || 'doc-1',
      professionalName: doctor?.fullName || 'Dr. Mauricio Thorne, IFMCP',
    };

    const newPatientProfile: PatientProfile = {
      id: `pat-${Date.now()}`,
      mrn: mrn.startsWith('#') ? mrn : `#${mrn}`,
      fullName: fullName.trim(),
      age,
      birthDate,
      sex,
      phone,
      email,
      occupation,
      registeredAt: new Date().toISOString().split('T')[0],
      primaryDiagnosis: primaryDiagnosis || `${stratum} • ${stratumStatus}`,
      antecedents: antecedentsText.split('\n').filter((t) => t.trim().length > 0),
      triggers: triggersText.split('\n').filter((t) => t.trim().length > 0),
      mediators: mediatorsText.split('\n').filter((t) => t.trim().length > 0),
      currentProtocol,
      assignedDoctorId: doctor?.id || 'doc-1',
      evolutionHistory: [initialEvolution],
    };

    onSavePatient(newPatientProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#ffffff] rounded-2xl w-full max-w-5xl shadow-2xl border border-[#e7e5e4] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 md:p-5 bg-gradient-to-r from-[#005c55] to-[#0f766e] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <FunctionalCareLogo variant="emblem" height={36} theme="light" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-bold tracking-tight">Ingreso de Nuevo Paciente</h2>
                <span className="bg-white/20 text-white text-[11px] font-mono px-2 py-0.5 rounded font-semibold">
                  Expediente Funcional
                </span>
              </div>
              <p className="text-xs text-white/80">
                Registro de variables fisiológicas, biomarcadores y estratificación etiológica ATM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Cerrar"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Step Wizard Tabs */}
        <div className="flex border-b border-[#e9e1dd] bg-[#faf2ee] px-4 md:px-6 gap-1 overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setActiveStep('demographics')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
              activeStep === 'demographics'
                ? 'border-[#005c55] text-[#005c55] bg-white rounded-t-lg shadow-sm'
                : 'border-transparent text-[#6e7977] hover:text-[#1e1b19]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">badge</span>
            1. Datos & Demografía
          </button>
          <button
            type="button"
            onClick={() => setActiveStep('vitals')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
              activeStep === 'vitals'
                ? 'border-[#005c55] text-[#005c55] bg-white rounded-t-lg shadow-sm'
                : 'border-transparent text-[#6e7977] hover:text-[#1e1b19]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">straighten</span>
            2. Antropometría & Fisiología
          </button>
          <button
            type="button"
            onClick={() => setActiveStep('biochemistry')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
              activeStep === 'biochemistry'
                ? 'border-[#005c55] text-[#005c55] bg-white rounded-t-lg shadow-sm'
                : 'border-transparent text-[#6e7977] hover:text-[#1e1b19]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">biotech</span>
            3. Panel Bioquímico
          </button>
          <button
            type="button"
            onClick={() => setActiveStep('atm')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
              activeStep === 'atm'
                ? 'border-[#005c55] text-[#005c55] bg-white rounded-t-lg shadow-sm'
                : 'border-transparent text-[#6e7977] hover:text-[#1e1b19]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">account_tree</span>
            4. Marco ATM & Diagnóstico
          </button>
        </div>

        {/* Modal Body: Form + Live Diagnostics Sidebar */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Main Form Fields */}
          <div className="flex-1 p-5 overflow-y-auto max-h-[60vh] md:max-h-none space-y-4">
            {/* STEP 1: DEMOGRAPHICS */}
            {activeStep === 'demographics' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1e1b19] mb-1">
                      Nombre Completo del Paciente *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Valentina Ríos Morales"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-[#d8d1cd] focus:outline-none focus:ring-2 focus:ring-[#005c55] focus:border-transparent bg-[#fff8f5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1e1b19] mb-1">
                      Nº Historia Clínica / MRN
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={mrn}
                        onChange={(e) => setMrn(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-[#d8d1cd] focus:outline-none focus:ring-2 focus:ring-[#005c55] font-mono bg-[#fff8f5]"
                      />
                      <button
                        type="button"
                        onClick={() => setMrn(`FM-${Math.floor(10000 + Math.random() * 90000)}`)}
                        className="px-2.5 py-2 bg-[#faf2ee] hover:bg-[#eee7e3] text-xs font-semibold rounded-lg border border-[#d8d1cd] text-[#6e7977] cursor-pointer"
                        title="Generar nuevo MRN"
                      >
                        <span className="material-symbols-outlined text-sm">refresh</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1e1b19] mb-1">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-[#d8d1cd] focus:outline-none focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1e1b19] mb-1">Edad Calculada</label>
                    <div className="px-3 py-2 text-sm rounded-lg border border-[#e9e1dd] bg-[#faf2ee] font-semibold text-[#1e1b19]">
                      {age} años
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1e1b19] mb-1">Sexo Biológico *</label>
                    <select
                      value={sex}
                      onChange={(e) => setSex(e.target.value as 'female' | 'male')}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-[#d8d1cd] focus:outline-none focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5]"
                    >
                      <option value="female">Femenino</option>
                      <option value="male">Masculino</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1e1b19] mb-1">Teléfono / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="+57 (300) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-[#d8d1cd] focus:outline-none focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1e1b19] mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      placeholder="paciente@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-[#d8d1cd] focus:outline-none focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1e1b19] mb-1">Ocupación / Actividad</label>
                    <input
                      type="text"
                      placeholder="Ej. Docente / Ejecutivo"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-[#d8d1cd] focus:outline-none focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1e1b19] mb-1">Especialista / Médico Tratante Asignado</label>
                  <select
                    value={assignedDoctorId}
                    onChange={(e) => setAssignedDoctorId(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#d8d1cd] focus:outline-none focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5] font-semibold text-[#005c55]"
                  >
                    {professionals.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.fullName} — {doc.title} ({doc.licenseNumber})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* STEP 2: VITALS & ANTHROPOMETRY */}
            {activeStep === 'vitals' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1e1b19] mb-1">Peso Corporal (kg) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-[#d8d1cd] focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5] font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1e1b19] mb-1">Altura (cm) *</label>
                    <input
                      type="number"
                      required
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-[#d8d1cd] focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5] font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1e1b19] mb-1">IMC (kg/m²)</label>
                    <div
                      className={`px-3 py-2 text-sm rounded-lg border font-bold flex items-center justify-between ${
                        bmi >= 30
                          ? 'bg-[#cb2044]/10 text-[#cb2044] border-[#cb2044]/30'
                          : bmi >= 25
                          ? 'bg-[#fe932c]/10 text-[#904d00] border-[#fe932c]/30'
                          : 'bg-[#005c55]/10 text-[#005c55] border-[#005c55]/30'
                      }`}
                    >
                      <span>{bmi}</span>
                      <span className="text-[10px] uppercase font-mono">
                        {bmi >= 30 ? 'Obesidad' : bmi >= 25 ? 'Sobrepeso' : 'Normal'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1e1b19] mb-1">Cintura (cm) *</label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={waistCm}
                      onChange={(e) => setWaistCm(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-[#d8d1cd] focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5] font-semibold"
                    />
                    <span className="text-[10px] text-[#6e7977]">Ref: &lt;80 (F) / &lt;90 (M)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1e1b19] mb-1">P.A. Sistólica (mmHg)</label>
                    <input
                      type="number"
                      value={systolicBP}
                      onChange={(e) => setSystolicBP(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-[#d8d1cd] focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1e1b19] mb-1">P.A. Diastólica (mmHg)</label>
                    <input
                      type="number"
                      value={diastolicBP}
                      onChange={(e) => setDiastolicBP(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-[#d8d1cd] focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1e1b19] mb-1">Frec. Cardíaca (lpm)</label>
                    <input
                      type="number"
                      value={heartRate}
                      onChange={(e) => setHeartRate(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-[#d8d1cd] focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1e1b19] mb-1">Horas de Ayuno</label>
                    <input
                      type="number"
                      step="0.5"
                      value={fastingHours}
                      onChange={(e) => setFastingHours(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-[#d8d1cd] focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: BIOCHEMISTRY */}
            {activeStep === 'biochemistry' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-3 bg-[#005c55]/5 rounded-xl border border-[#005c55]/20 text-xs text-[#005c55] flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-[#005c55]">science</span>
                  <span>
                    Ingrese los valores de laboratorio. Los 8 índices subrogados y el estrato metabólico se calculan en tiempo real en el panel lateral.
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-2.5 bg-[#fff8f5] rounded-lg border border-[#e9e1dd]">
                    <label className="block text-[11px] font-bold text-[#1e1b19]">Glucosa Basal *</label>
                    <div className="flex items-center gap-1 mt-1">
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={glucoseFasting}
                        onChange={(e) => setGlucoseFasting(Number(e.target.value))}
                        className="w-full text-sm font-bold bg-white px-2 py-1 rounded border border-[#d8d1cd]"
                      />
                      <span className="text-[10px] text-[#6e7977]">mg/dL</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#fff8f5] rounded-lg border border-[#e9e1dd]">
                    <label className="block text-[11px] font-bold text-[#1e1b19]">Insulina Basal *</label>
                    <div className="flex items-center gap-1 mt-1">
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={insulinFasting}
                        onChange={(e) => setInsulinFasting(Number(e.target.value))}
                        className="w-full text-sm font-bold bg-white px-2 py-1 rounded border border-[#d8d1cd] text-[#904d00]"
                      />
                      <span className="text-[10px] text-[#6e7977]">μIU/mL</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#fff8f5] rounded-lg border border-[#e9e1dd]">
                    <label className="block text-[11px] font-bold text-[#1e1b19]">Triglicéridos *</label>
                    <div className="flex items-center gap-1 mt-1">
                      <input
                        type="number"
                        required
                        value={triglycerides}
                        onChange={(e) => setTriglycerides(Number(e.target.value))}
                        className="w-full text-sm font-bold bg-white px-2 py-1 rounded border border-[#d8d1cd]"
                      />
                      <span className="text-[10px] text-[#6e7977]">mg/dL</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#fff8f5] rounded-lg border border-[#e9e1dd]">
                    <label className="block text-[11px] font-bold text-[#1e1b19]">Colesterol HDL *</label>
                    <div className="flex items-center gap-1 mt-1">
                      <input
                        type="number"
                        required
                        value={hdl}
                        onChange={(e) => setHdl(Number(e.target.value))}
                        className="w-full text-sm font-bold bg-white px-2 py-1 rounded border border-[#d8d1cd]"
                      />
                      <span className="text-[10px] text-[#6e7977]">mg/dL</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#fff8f5] rounded-lg border border-[#e9e1dd]">
                    <label className="block text-[11px] font-bold text-[#1e1b19]">GGT (Gammaglutamil)</label>
                    <div className="flex items-center gap-1 mt-1">
                      <input
                        type="number"
                        value={ggt}
                        onChange={(e) => setGgt(Number(e.target.value))}
                        className="w-full text-sm font-bold bg-white px-2 py-1 rounded border border-[#d8d1cd]"
                      />
                      <span className="text-[10px] text-[#6e7977]">U/L</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#fff8f5] rounded-lg border border-[#e9e1dd]">
                    <label className="block text-[11px] font-bold text-[#1e1b19]">HbA1c (Glicosilada)</label>
                    <div className="flex items-center gap-1 mt-1">
                      <input
                        type="number"
                        step="0.1"
                        value={hba1c}
                        onChange={(e) => setHba1c(Number(e.target.value))}
                        className="w-full text-sm font-bold bg-white px-2 py-1 rounded border border-[#d8d1cd]"
                      />
                      <span className="text-[10px] text-[#6e7977]">%</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#fff8f5] rounded-lg border border-[#e9e1dd]">
                    <label className="block text-[11px] font-bold text-[#1e1b19]">hs-PCR (Proteína C)</label>
                    <div className="flex items-center gap-1 mt-1">
                      <input
                        type="number"
                        step="0.1"
                        value={hsCrp}
                        onChange={(e) => setHsCrp(Number(e.target.value))}
                        className="w-full text-sm font-bold bg-white px-2 py-1 rounded border border-[#d8d1cd]"
                      />
                      <span className="text-[10px] text-[#6e7977]">mg/L</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#fff8f5] rounded-lg border border-[#e9e1dd]">
                    <label className="block text-[11px] font-bold text-[#1e1b19]">Colesterol Total</label>
                    <div className="flex items-center gap-1 mt-1">
                      <input
                        type="number"
                        value={totalCholesterol}
                        onChange={(e) => setTotalCholesterol(Number(e.target.value))}
                        className="w-full text-sm font-bold bg-white px-2 py-1 rounded border border-[#d8d1cd]"
                      />
                      <span className="text-[10px] text-[#6e7977]">mg/dL</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#fff8f5] rounded-lg border border-[#e9e1dd]">
                    <label className="block text-[11px] font-bold text-[#1e1b19]">Colesterol LDL</label>
                    <div className="flex items-center gap-1 mt-1">
                      <input
                        type="number"
                        value={ldl}
                        onChange={(e) => setLdl(Number(e.target.value))}
                        className="w-full text-sm font-bold bg-white px-2 py-1 rounded border border-[#d8d1cd]"
                      />
                      <span className="text-[10px] text-[#6e7977]">mg/dL</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#fff8f5] rounded-lg border border-[#e9e1dd]">
                    <label className="block text-[11px] font-bold text-[#1e1b19]">AST / GOT</label>
                    <div className="flex items-center gap-1 mt-1">
                      <input
                        type="number"
                        value={ast}
                        onChange={(e) => setAst(Number(e.target.value))}
                        className="w-full text-sm font-bold bg-white px-2 py-1 rounded border border-[#d8d1cd]"
                      />
                      <span className="text-[10px] text-[#6e7977]">U/L</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#fff8f5] rounded-lg border border-[#e9e1dd]">
                    <label className="block text-[11px] font-bold text-[#1e1b19]">ALT / GPT</label>
                    <div className="flex items-center gap-1 mt-1">
                      <input
                        type="number"
                        value={alt}
                        onChange={(e) => setAlt(Number(e.target.value))}
                        className="w-full text-sm font-bold bg-white px-2 py-1 rounded border border-[#d8d1cd]"
                      />
                      <span className="text-[10px] text-[#6e7977]">U/L</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: ATM MATRIX & DIAGNOSIS */}
            {activeStep === 'atm' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-bold text-[#1e1b19] mb-1">
                    Diagnóstico Clínico Principal / Síntesis
                  </label>
                  <input
                    type="text"
                    placeholder={`Ej. ${stratum} • ${stratumStatus}`}
                    value={primaryDiagnosis}
                    onChange={(e) => setPrimaryDiagnosis(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#d8d1cd] focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5] font-semibold text-[#005c55]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1e1b19] mb-1">Motivo de Consulta Inicial</label>
                  <input
                    type="text"
                    value={initialReason}
                    onChange={(e) => setInitialReason(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#d8d1cd] focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#005c55] mb-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">history</span>
                      Antecedentes (1 por línea)
                    </label>
                    <textarea
                      rows={4}
                      value={antecedentsText}
                      onChange={(e) => setAntecedentsText(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-lg border border-[#d8d1cd] focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5]"
                      placeholder="Madre diabética&#10;Uso previo de antibióticos..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#904d00] mb-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">bolt</span>
                      Gatillos / Disparadores
                    </label>
                    <textarea
                      rows={4}
                      value={triggersText}
                      onChange={(e) => setTriggersText(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-lg border border-[#d8d1cd] focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5]"
                      placeholder="Estrés laboral sostenido&#10;Infección previa..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#cb2044] mb-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">hub</span>
                      Mediadores Activos
                    </label>
                    <textarea
                      rows={4}
                      value={mediatorsText}
                      onChange={(e) => setMediatorsText(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-lg border border-[#d8d1cd] focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5]"
                      placeholder="Permeabilidad intestinal&#10;Elevación de hs-PCR..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1e1b19] mb-1">
                    Protocolo Terapéutico Inicial Sugerido
                  </label>
                  <input
                    type="text"
                    value={currentProtocol}
                    onChange={(e) => setCurrentProtocol(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#d8d1cd] focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Live Diagnostics Panel */}
          <div className="w-full md:w-80 bg-[#faf2ee] border-t md:border-t-0 md:border-l border-[#e9e1dd] p-4 flex flex-col justify-between shrink-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#e9e1dd]">
                <span className="text-xs font-bold text-[#6e7977] uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#005c55]">analytics</span>
                  Cálculo en Vivo
                </span>
                <span className="text-[10px] font-mono text-[#005c55] font-semibold bg-[#005c55]/10 px-1.5 py-0.5 rounded">
                  CDSS v4.2
                </span>
              </div>

              {/* Stratum Card */}
              <div className={`p-3 rounded-xl border ${stratumColor}`}>
                <span className="text-[10px] uppercase font-mono font-bold block opacity-80">
                  Estrato Sugerido
                </span>
                <span className="text-base font-extrabold block">{stratum}</span>
                <span className="text-[11px] font-medium block leading-tight mt-0.5">{stratumStatus}</span>
              </div>

              {/* Surrogate Indices Matrix */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white rounded-lg border border-[#e9e1dd]">
                  <span className="text-[10px] text-[#6e7977] block font-mono">HOMA-IR</span>
                  <span className="text-sm font-bold text-[#904d00]">{calculatedSurrogates.homaIr}</span>
                  <span className="text-[9px] text-[#6e7977] block">Ref: &lt;1.4</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-[#e9e1dd]">
                  <span className="text-[10px] text-[#6e7977] block font-mono">QUICKI</span>
                  <span className="text-sm font-bold text-[#005c55]">{calculatedSurrogates.quicki}</span>
                  <span className="text-[9px] text-[#6e7977] block">Ref: &gt;0.38</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-[#e9e1dd]">
                  <span className="text-[10px] text-[#6e7977] block font-mono">TyG Index</span>
                  <span className="text-sm font-bold text-[#1e1b19]">{calculatedSurrogates.tyg}</span>
                  <span className="text-[9px] text-[#6e7977] block">Ref: &lt;8.1</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-[#e9e1dd]">
                  <span className="text-[10px] text-[#6e7977] block font-mono">Ratio Trig/HDL</span>
                  <span className="text-sm font-bold text-[#904d00]">
                    {(triglycerides / Math.max(1, hdl)).toFixed(2)}
                  </span>
                  <span className="text-[9px] text-[#6e7977] block">Ref: &lt;2.0</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-[#e9e1dd]">
                  <span className="text-[10px] text-[#6e7977] block font-mono">METS-IR</span>
                  <span className="text-sm font-bold text-[#1e1b19]">{calculatedSurrogates.metsIr}</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-[#e9e1dd]">
                  <span className="text-[10px] text-[#6e7977] block font-mono">FLI (Hígado Graso)</span>
                  <span
                    className={`text-sm font-bold ${
                      calculatedSurrogates.fli >= 60 ? 'text-[#cb2044]' : 'text-[#005c55]'
                    }`}
                  >
                    {calculatedSurrogates.fli}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation / Save Actions */}
            <div className="pt-4 border-t border-[#e9e1dd] flex flex-col gap-2 mt-4">
              <div className="flex gap-2">
                {activeStep !== 'demographics' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeStep === 'atm') setActiveStep('biochemistry');
                      else if (activeStep === 'biochemistry') setActiveStep('vitals');
                      else if (activeStep === 'vitals') setActiveStep('demographics');
                    }}
                    className="flex-1 py-2 bg-white hover:bg-[#faf2ee] border border-[#d8d1cd] text-[#3e4947] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Anterior
                  </button>
                )}
                {activeStep !== 'atm' ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeStep === 'demographics') setActiveStep('vitals');
                      else if (activeStep === 'vitals') setActiveStep('biochemistry');
                      else if (activeStep === 'biochemistry') setActiveStep('atm');
                    }}
                    className="flex-1 py-2 bg-[#005c55] hover:bg-[#0f766e] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>Siguiente</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-[#005c55] to-[#0f766e] hover:from-[#0f766e] hover:to-[#005c55] text-white rounded-lg text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    <span>Registrar Paciente</span>
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-1.5 text-center text-xs text-[#6e7977] hover:text-[#1e1b19] font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
