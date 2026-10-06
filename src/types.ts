export type ScreenTab =
  | 'patients-dashboard'
  | 'pathophysiology-atm'
  | 'surrogate-indices'
  | 'kraft-ogtt-curves'
  | 'cdss-stratification'
  | 'therapeutics-matrix'
  | 'monitoring-fhir'
  | 'professionals-config';

export type KraftPatternId =
  | 'pattern-1'
  | 'pattern-2'
  | 'pattern-3a'
  | 'pattern-3b'
  | 'pattern-4'
  | 'pattern-5';

export interface PatientLabs {
  glucoseFasting: number; // mg/dL
  insulinFasting: number; // uIU/mL
  triglycerides: number; // mg/dL
  hdl: number; // mg/dL
  bmi: number; // kg/m²
  waistCm: number; // cm
  ggt: number; // U/L
  sex: 'female' | 'male';
  hba1c?: number; // %
  totalCholesterol?: number; // mg/dL
  ldl?: number; // mg/dL
  ast?: number; // U/L
  alt?: number; // U/L
  hsCrp?: number; // mg/L
  ogttGlucose?: number[]; // [0, 30, 60, 120, 180] min
  ogttInsulin?: number[]; // [0, 30, 60, 120, 180] min
}

export interface SurrogateResults {
  homaIr: number;
  quicki: number;
  tyg: number;
  tygBmi: number;
  metsIr: number;
  lap: number;
  vai: number;
  fli: number;
  frictionPercent: number;
}

export interface KraftDataPoint {
  timeMin: number;
  label: string;
  glucose: number;
  insulin: number;
  status: string;
}

export interface KraftPatternInfo {
  id: KraftPatternId;
  name: string;
  badge: string;
  badgeType: 'optimal' | 'warning' | 'critical';
  description: string;
  glucosePoints: number[];
  insulinPoints: number[];
  insulinPath: string;
  insulinArea: string;
  glucosePath: string;
  matsuda: number;
  aucInsulin: number;
  clearanceRatio: number;
  phase1Status: string;
  phase2Status: string;
}

export interface AtmItem {
  id: string;
  title: string;
  badge?: string;
  badgeClass?: string;
  icon?: string;
  description: string;
  extraDetails?: { label: string; value: string; color?: string }[];
}

export interface MatrixNodeDetail {
  id: string;
  nodeNumber: string;
  name: string;
  subtitle: string;
  statusText: string;
  statusType: 'optimal' | 'friction' | 'severe';
  icon: string;
  accentColor: string;
  parameters: {
    label: string;
    value: string;
    note?: string;
    barPercent?: number;
    colorClass?: string;
  }[];
  treatmentTag: string;
  treatmentIcon: string;
  deepDescription: string;
  protocol: string;
}

export interface MedicalProfessional {
  id: string;
  fullName: string;
  title: string; // ej: Médico Especialista en Medicina Funcional y Regenerativa
  specialty: string; // ej: Endocrinología & Nutrición Clínica Funcional
  licenseNumber: string; // Tarjeta Profesional / Matrícula Médica
  institution: string; // ej: Functional Care Institute
  email: string;
  phone: string;
  signatureUrl?: string; // Data URL (Base64) de la firma escaneada o dibujada
  isPrimary?: boolean;
  registeredAt: string;
  username?: string; // Login de acceso (ej: 'mausugu')
  password?: string; // Contraseña de acceso (ej: 'M77')
  role?: 'superadmin' | 'admin' | 'doctor';
  mustChangePassword?: boolean; // Obliga a cambio de contraseña en el primer inicio
}

export interface PatientEvolution {
  id: string;
  date: string; // YYYY-MM-DD
  reason: string; // Motivo de consulta / control
  fastingHours: number;
  clinicalNotes: string;
  vitalSigns: {
    systolicBP: number;
    diastolicBP: number;
    heartRate: number;
    weightKg: number;
    heightCm: number;
    bmi: number;
    waistCm: number;
  };
  labs: PatientLabs;
  surrogates: SurrogateResults;
  stratum: 'Estrato 0' | 'Estrato 1' | 'Estrato 2' | 'Estrato 3';
  stratumStatus: string;
  activeProtocol: string;
  professionalId: string;
  professionalName?: string;
}

export interface PatientProfile {
  id: string;
  mrn: string; // Número de historia clínica (ej. #FM-88219)
  fullName: string;
  age: number;
  birthDate: string;
  sex: 'female' | 'male';
  phone: string;
  email: string;
  occupation: string;
  registeredAt: string;
  primaryDiagnosis: string;
  antecedents: string[];
  triggers: string[];
  mediators: string[];
  currentProtocol: string;
  evolutionHistory: PatientEvolution[];
  assignedDoctorId: string;
}
