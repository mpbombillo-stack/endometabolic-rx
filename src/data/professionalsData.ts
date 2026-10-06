import { MedicalProfessional } from '../types';

// Firma predeterminada en SVG/Base64 para Dr. M. Thorne
const DEFAULT_SIGNATURE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 120" width="320" height="120"><path d="M 30 75 C 60 20, 75 110, 95 40 C 110 90, 130 30, 150 70 Q 180 20, 210 65 T 260 50 C 280 40, 290 80, 300 70 M 60 85 Q 160 95, 270 78" fill="none" stroke="%23005c55" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="180" y="105" font-family="sans-serif" font-size="11" fill="%236e7977">Dr. M. Thorne • Reg. 84920</text></svg>`;

const DEFAULT_SIGNATURE_DRA_RESTREPO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 120" width="320" height="120"><path d="M 40 60 C 50 30, 70 20, 85 50 C 100 80, 120 40, 140 60 Q 170 15, 200 60 T 250 45 C 270 35, 285 75, 295 65 M 50 80 Q 150 88, 260 72" fill="none" stroke="%23904d00" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="160" y="105" font-family="sans-serif" font-size="11" fill="%236e7977">Dra. S. Restrepo • Reg. 91340</text></svg>`;

export const INITIAL_PROFESSIONALS: MedicalProfessional[] = [
  {
    id: 'doc-1',
    fullName: 'Dr. Mauricio Suaza Gutiérrez, MD, IFMCP',
    title: 'Director Médico Especialista en Medicina Funcional y Regenerativa',
    specialty: 'Endocrinología Metabólica & Medicina de Precisión',
    licenseNumber: 'TP-84920-MD',
    institution: 'Functional Care Institute & Metabolic Center',
    email: 'm.suaza@functionalcare.med',
    phone: '+57 (315) 890-4421',
    signatureUrl: DEFAULT_SIGNATURE_SVG,
    isPrimary: true,
    registeredAt: '2024-01-15',
    username: 'mausugu',
    password: 'M77',
    role: 'superadmin',
  },
  {
    id: 'doc-2',
    fullName: 'Dra. Sofía Elena Restrepo Gómez, MD, MSc',
    title: 'Especialista en Nutrición Clínica Funcional e Inmunonutrición',
    specialty: 'Gastroenterología Funcional & Microbiota',
    licenseNumber: 'TP-91340-MD',
    institution: 'Functional Care Institute • Unidad Digestiva',
    email: 'srestrepo@functionalcare.com',
    phone: '+57 (318) 722-9014',
    signatureUrl: DEFAULT_SIGNATURE_DRA_RESTREPO,
    isPrimary: false,
    registeredAt: '2024-06-20',
    username: 'sofrego',
    password: 'M77',
    role: 'doctor',
  },
];
