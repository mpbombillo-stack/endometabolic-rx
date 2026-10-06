import { PatientProfile } from '../types';
import { calculateSurrogates } from '../utils/metabolicCalculators';

export const INITIAL_PATIENTS: PatientProfile[] = [
  {
    id: 'pat-eleanor-vance',
    mrn: '#FM-88219',
    fullName: 'Eleanor Vance',
    age: 44,
    birthDate: '1980-04-12',
    sex: 'female',
    phone: '+57 (310) 456-7890',
    email: 'eleanor.vance@clinic.org',
    occupation: 'Arquitecta / Diseñadora Senior',
    registeredAt: '2026-01-10',
    primaryDiagnosis: 'Resistencia a la Insulina en Fricción Moderada (Estrato 2) • Disbiosis Intestinal',
    antecedents: [
      'Madre con Diabetes Mellitus Tipo 2 y Tiroiditis de Hashimoto a los 52 años',
      'Uso recurrente de antibióticos de amplio espectro (amoxicilina/clavulánico) en 2021-2023',
      'Colecistectomía laparoscópica en 2018',
    ],
    triggers: [
      'Carga sostenida de estrés laboral con alteración circadiana (elevación de cortisol nocturno)',
      'Consumo crónico de edulcorantes artificiales y productos ultraprocesados tipo snack',
      'Infección por SARS-CoV-2 en 2022 con fatiga post-viral prolongada',
    ],
    mediators: [
      'Endotoxemia subclínica por permeabilidad intestinal (LPS sérico elevado)',
      'Infiltración de macrófagos M1 en tejido adiposo visceral con elevación de hs-PCR (2.8 mg/L)',
      'Desacoplamiento mitocondrial con acúmulo de ceramidas y diacilglicerol (DAG)',
    ],
    currentProtocol: 'Protocolo de Reseteo Metabólico Dirigido v3.2 (5R Digestivo + Fitoma de Berberina 500mg BID + Zona 2)',
    assignedDoctorId: 'doc-1',
    evolutionHistory: [
      {
        id: 'evo-1',
        date: '2026-03-10',
        reason: 'Consulta Inicial: Astenia progresiva, dificultad para perder peso y niebla mental postprandial',
        fastingHours: 12.0,
        clinicalNotes:
          'Paciente consulta por fatiga severa a las 15:00h, somnolencia tras carbohidratos simples, circunferencia abdominal en aumento. Se solicitan laboratorios completos y curva Kraft.',
        vitalSigns: {
          systolicBP: 134,
          diastolicBP: 86,
          heartRate: 76,
          weightKg: 78.5,
          heightCm: 165,
          bmi: 28.8,
          waistCm: 92,
        },
        labs: {
          glucoseFasting: 104,
          insulinFasting: 18.2,
          triglycerides: 198,
          hdl: 38,
          bmi: 28.8,
          waistCm: 92,
          ggt: 42,
          sex: 'female',
          hba1c: 5.8,
          totalCholesterol: 215,
          ldl: 137,
          ast: 28,
          alt: 44,
          hsCrp: 3.4,
          ogttGlucose: [104, 162, 148, 118, 98],
          ogttInsulin: [18.2, 86.0, 114.0, 68.0, 32.0],
        },
        surrogates: calculateSurrogates({
          glucoseFasting: 104,
          insulinFasting: 18.2,
          triglycerides: 198,
          hdl: 38,
          bmi: 28.8,
          waistCm: 92,
          ggt: 42,
          sex: 'female',
        }),
        stratum: 'Estrato 3',
        stratumStatus: 'Fricción Severa Activa',
        activeProtocol: 'Fase 1: Remoción de gatillos y 5R inicial',
        professionalId: 'doc-1',
        professionalName: 'Dr. Mauricio Thorne, MD, IFMCP',
      },
      {
        id: 'evo-2',
        date: '2026-06-15',
        reason: 'Control 3 Meses: Evaluación de respuesta a fitoterapia y reestructuración dietaria antiinflamatoria',
        fastingHours: 12.5,
        clinicalNotes:
          'Mejoría sustancial de energía. Reducción de 2.5 kg de masa grasa visceral. Adherencia al 85% al ejercicio en Zona 2.',
        vitalSigns: {
          systolicBP: 126,
          diastolicBP: 80,
          heartRate: 72,
          weightKg: 76.0,
          heightCm: 165,
          bmi: 27.9,
          waistCm: 89,
        },
        labs: {
          glucoseFasting: 98,
          insulinFasting: 14.8,
          triglycerides: 172,
          hdl: 41,
          bmi: 27.9,
          waistCm: 89,
          ggt: 34,
          sex: 'female',
          hba1c: 5.5,
          totalCholesterol: 196,
          ldl: 121,
          ast: 24,
          alt: 32,
          hsCrp: 2.1,
          ogttGlucose: [98, 144, 130, 102, 88],
          ogttInsulin: [14.8, 62.0, 78.0, 42.0, 21.0],
        },
        surrogates: calculateSurrogates({
          glucoseFasting: 98,
          insulinFasting: 14.8,
          triglycerides: 172,
          hdl: 41,
          bmi: 27.9,
          waistCm: 89,
          ggt: 34,
          sex: 'female',
        }),
        stratum: 'Estrato 2',
        stratumStatus: 'Fricción Moderada en Descenso',
        activeProtocol: 'Fase 2: Fitosoma de Berberina 500mg BID + SPMs + Zona 2 45min x 3/sem',
        professionalId: 'doc-1',
        professionalName: 'Dr. Mauricio Thorne, MD, IFMCP',
      },
      {
        id: 'evo-3',
        date: '2026-10-05',
        reason: 'Control 6 Meses: Seguimiento de biomarcadores y telemetría CGM',
        fastingHours: 12.4,
        clinicalNotes:
          'HOMA-IR descendió a 3.59. Se consolida estabilización glucémica con TIR 94% en sensor continuo. Sin niebla mental.',
        vitalSigns: {
          systolicBP: 120,
          diastolicBP: 78,
          heartRate: 68,
          weightKg: 74.2,
          heightCm: 165,
          bmi: 27.2,
          waistCm: 86,
        },
        labs: {
          glucoseFasting: 94,
          insulinFasting: 11.2,
          triglycerides: 148,
          hdl: 45,
          bmi: 27.2,
          waistCm: 86,
          ggt: 26,
          sex: 'female',
          hba1c: 5.3,
          totalCholesterol: 184,
          ldl: 109,
          ast: 21,
          alt: 26,
          hsCrp: 1.4,
          ogttGlucose: [94, 132, 118, 92, 82],
          ogttInsulin: [11.2, 48.0, 52.0, 26.0, 14.0],
        },
        surrogates: calculateSurrogates({
          glucoseFasting: 94,
          insulinFasting: 11.2,
          triglycerides: 148,
          hdl: 45,
          bmi: 27.2,
          waistCm: 86,
          ggt: 26,
          sex: 'female',
        }),
        stratum: 'Estrato 2',
        stratumStatus: 'Fricción Leve / Respuesta Favorable',
        activeProtocol: 'Fase 3: Consolidación Mitocondrial y Reintroducción Guiada',
        professionalId: 'doc-1',
        professionalName: 'Dr. Mauricio Thorne, MD, IFMCP',
      },
    ],
  },
  {
    id: 'pat-carlos-mendoza',
    mrn: '#FM-90412',
    fullName: 'Carlos Alberto Mendoza',
    age: 52,
    birthDate: '1974-09-18',
    sex: 'male',
    phone: '+57 (312) 678-9123',
    email: 'carlos.mendoza@empresa.com',
    occupation: 'Director Financiero',
    registeredAt: '2026-02-14',
    primaryDiagnosis: 'Esteatosis Hepática Metabólica (FLI 82) • Fricción Severa (Estrato 3)',
    antecedents: [
      'Padre fallecido por Infarto Agudo de Miocardio a los 58 años',
      'Hipertensión arterial diagnosticada en 2022 en tratamiento con Enalapril 20mg',
      'Hiperuricemia asintomática con ácido úrico 7.8 mg/dL',
    ],
    triggers: [
      'Sedentarismo severo (<3.000 pasos/día)',
      'Consumo social de alcohol (3-4 copas de vino los fines de semana)',
      'Apnea obstructiva del sueño no tratada (ronquido intenso)',
    ],
    mediators: [
      'Lipogénesis de Novo hepática acelerada (Triglicéridos 245 mg/dL, GGT 58 U/L)',
      'Sobrecarga de ácidos grasos libres con resistencia a la insulina hepática y muscular',
      'Disfunción endotelial con ratio Trig/HDL > 7.0',
    ],
    currentProtocol: 'Protocolo Hepato-Metabólico Intensivo (NAC 600mg BID + Silimarina 300mg + Dieta Cetogénica Mediterránea + CPAP)',
    assignedDoctorId: 'doc-1',
    evolutionHistory: [
      {
        id: 'evo-cm-1',
        date: '2026-02-14',
        reason: 'Ingreso: Chequeo ejecutivo que evidenció transaminasas elevadas y esteatosis grado II en ecografía',
        fastingHours: 13.0,
        clinicalNotes:
          'Paciente asintomático salvo somnolencia diurna y cefalea matutina. Abdomen prominente globoso.',
        vitalSigns: {
          systolicBP: 142,
          diastolicBP: 92,
          heartRate: 82,
          weightKg: 94.0,
          heightCm: 174,
          bmi: 31.0,
          waistCm: 104,
        },
        labs: {
          glucoseFasting: 118,
          insulinFasting: 26.4,
          triglycerides: 245,
          hdl: 34,
          bmi: 31.0,
          waistCm: 104,
          ggt: 58,
          sex: 'male',
          hba1c: 6.2,
          totalCholesterol: 238,
          ldl: 155,
          ast: 42,
          alt: 68,
          hsCrp: 4.8,
        },
        surrogates: calculateSurrogates({
          glucoseFasting: 118,
          insulinFasting: 26.4,
          triglycerides: 245,
          hdl: 34,
          bmi: 31.0,
          waistCm: 104,
          ggt: 58,
          sex: 'male',
        }),
        stratum: 'Estrato 3',
        stratumStatus: 'Fricción Severa Crítica',
        activeProtocol: 'Fase 1: Dieta Baja en Carbohidratos + Cardioprotección',
        professionalId: 'doc-1',
        professionalName: 'Dr. Mauricio Thorne, MD, IFMCP',
      },
    ],
  },
  {
    id: 'pat-valentina-rios',
    mrn: '#FM-77301',
    fullName: 'Valentina Ríos Morales',
    age: 36,
    birthDate: '1990-08-25',
    sex: 'female',
    phone: '+57 (316) 998-1122',
    email: 'valentina.rios@creative.co',
    occupation: 'Diseñadora UX / Docente Universitaria',
    registeredAt: '2026-05-18',
    primaryDiagnosis: 'Síndrome de Ovario Poliquístico (SOP) Fenotipo Metabólico • Fricción Subclínica (Estrato 1)',
    antecedents: [
      'Menarquia a los 11 años, oligomenorrea crónica desde la adolescencia',
      'Resistencia a la insulina diagnosticada por curva de tolerancia a los 28 años',
    ],
    triggers: [
      'Dietas hipocalóricas restrictivas cíclicas (efecto yoyo)',
      'Estrés crónico de alta exigencia académica',
    ],
    mediators: [
      'Hiperinsulinemia reactiva compensatoria que estimula la producción ovárica de andrógenos',
      'Ratio LH/FSH 2.8',
    ],
    currentProtocol: 'Mio-Inositol + D-Quiro-Inositol 40:1 (2g/día) + Berberina 400mg + Entrenamiento de Fuerza',
    assignedDoctorId: 'doc-2',
    evolutionHistory: [
      {
        id: 'evo-vr-1',
        date: '2026-05-18',
        reason: 'Ingreso: Ciclos menstruales irregulares (45-60 días), acné mandibular y caída de cabello',
        fastingHours: 12.0,
        clinicalNotes:
          'Paciente delgada (IMC 23.4) pero con perímetro de cintura en límite superior (80 cm). Curva Kraft tipo II confirmada.',
        vitalSigns: {
          systolicBP: 116,
          diastolicBP: 74,
          heartRate: 66,
          weightKg: 61.0,
          heightCm: 161,
          bmi: 23.5,
          waistCm: 80,
        },
        labs: {
          glucoseFasting: 88,
          insulinFasting: 9.8,
          triglycerides: 112,
          hdl: 56,
          bmi: 23.5,
          waistCm: 80,
          ggt: 18,
          sex: 'female',
          hba1c: 5.1,
          totalCholesterol: 178,
          ldl: 99,
          ast: 18,
          alt: 20,
          hsCrp: 1.2,
        },
        surrogates: calculateSurrogates({
          glucoseFasting: 88,
          insulinFasting: 9.8,
          triglycerides: 112,
          hdl: 56,
          bmi: 23.5,
          waistCm: 80,
          ggt: 18,
          sex: 'female',
        }),
        stratum: 'Estrato 1',
        stratumStatus: 'Fricción Subclínica Oculta',
        activeProtocol: 'Fase 1: Modulación Inositol + Fuerza',
        professionalId: 'doc-2',
        professionalName: 'Dra. Sofía Elena Restrepo, MD, MSc',
      },
    ],
  },
  {
    id: 'pat-roberto-gomez',
    mrn: '#FM-61883',
    fullName: 'Roberto Gómez Silva',
    age: 59,
    birthDate: '1967-11-03',
    sex: 'male',
    phone: '+57 (300) 123-4567',
    email: 'roberto.gomez@consultores.com',
    occupation: 'Ingeniero Civil Consultor',
    registeredAt: '2026-07-22',
    primaryDiagnosis: 'Disfunción Endotelial y Síndrome Metabólico Inicial (Estrato 2)',
    antecedents: [
      'Tabaquismo suspendido hace 5 años (índice 15 paquetes-año)',
      'Triglicéridos históricamente >200 mg/dL',
    ],
    triggers: ['Exposición a metales pesados en obras mineras', 'Mala calidad de descanso (4-5h/noche)'],
    mediators: ['Estrés oxidativo endotelial (8-OHdG elevado)', 'Microalbuminuria intermitente'],
    currentProtocol: 'Omega-3 EPA/DHA 3g/día + CoQ10 200mg + Resveratrol 100mg + Higiene del Sueño',
    assignedDoctorId: 'doc-1',
    evolutionHistory: [
      {
        id: 'evo-rg-1',
        date: '2026-07-22',
        reason: 'Ingreso: Control post-jubilación con incremento progresivo de peso abdominal',
        fastingHours: 12.0,
        clinicalNotes:
          'Evaluación cardiovascular y metabólica integral. Se inicia protocolo de vasodilatación y control de estrés oxidativo.',
        vitalSigns: {
          systolicBP: 136,
          diastolicBP: 88,
          heartRate: 74,
          weightKg: 85.0,
          heightCm: 172,
          bmi: 28.7,
          waistCm: 98,
        },
        labs: {
          glucoseFasting: 106,
          insulinFasting: 16.5,
          triglycerides: 210,
          hdl: 39,
          bmi: 28.7,
          waistCm: 98,
          ggt: 38,
          sex: 'male',
          hba1c: 5.7,
          totalCholesterol: 224,
          ldl: 143,
          ast: 31,
          alt: 39,
          hsCrp: 3.1,
        },
        surrogates: calculateSurrogates({
          glucoseFasting: 106,
          insulinFasting: 16.5,
          triglycerides: 210,
          hdl: 39,
          bmi: 28.7,
          waistCm: 98,
          ggt: 38,
          sex: 'male',
        }),
        stratum: 'Estrato 2',
        stratumStatus: 'Fricción Moderada Activa',
        activeProtocol: 'Fase 1: Optimización Endotelial & Antiinflamatoria',
        professionalId: 'doc-1',
        professionalName: 'Dr. Mauricio Thorne, MD, IFMCP',
      },
    ],
  },
];

// Claves de almacenamiento local
const PATIENTS_STORAGE_KEY = 'endometabolic_rx_patients_v1';
const PROFESSIONALS_STORAGE_KEY = 'endometabolic_rx_professionals_v1';
const ACTIVE_PATIENT_ID_KEY = 'endometabolic_rx_active_patient_id';
const ACTIVE_DOCTOR_ID_KEY = 'endometabolic_rx_active_doctor_id';

export function getStoredPatients(): PatientProfile[] {
  try {
    const data = localStorage.getItem(PATIENTS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Error al leer pacientes de localStorage:', e);
  }
  return INITIAL_PATIENTS;
}

export function savePatients(patients: PatientProfile[]): void {
  try {
    localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(patients));
  } catch (e) {
    console.error('Error al guardar pacientes en localStorage:', e);
  }
}

export function getStoredActivePatientId(): string {
  try {
    const id = localStorage.getItem(ACTIVE_PATIENT_ID_KEY);
    if (id) return id;
  } catch (e) {}
  return INITIAL_PATIENTS[0].id;
}

export function saveActivePatientId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PATIENT_ID_KEY, id);
  } catch (e) {}
}
