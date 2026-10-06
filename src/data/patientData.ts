import { MatrixNodeDetail, PatientLabs } from '../types';

export const ELEANOR_VANCE_LABS: PatientLabs = {
  glucoseFasting: 98,
  insulinFasting: 14.8,
  triglycerides: 172,
  hdl: 41,
  bmi: 28.4,
  waistCm: 89,
  ggt: 34,
  sex: 'female',
};

export const MATRIX_NODES_DATA: Record<string, MatrixNodeDetail> = {
  assimilation: {
    id: 'assimilation',
    nodeNumber: 'Nodo 01',
    name: 'Asimilación',
    subtitle: 'Digestión, Absorción e Integridad de Microbiota',
    statusText: 'Disfunción Moderada',
    statusType: 'friction',
    icon: 'restaurant',
    accentColor: '#904d00',
    parameters: [
      { label: 'Zonulina Sérica:', value: '48 ng/mL (Elevada >30)', barPercent: 78, colorClass: 'bg-secondary' },
      { label: 'Akkermansia muciniphila:', value: '0.2% (Bajo <1.0%)', colorClass: 'text-tertiary' },
      { label: 'Endotoxina (LPS):', value: 'Estímulo Elevado TLR-4', colorClass: 'text-secondary' },
    ],
    treatmentTag: 'Restauración Mucosa',
    treatmentIcon: 'shield',
    deepDescription:
      'El LPS filtrado a través de uniones estrechas epiteliales comprometidas activa el receptor tipo Toll 4 (TLR-4) en células de Kupffer y endotelio vascular, estimulando una inflamación subclínica sostenida mediada por NF-kB.',
    protocol:
      'L-Glutamina 5g BID, Zinc Carnosina 75mg BID, Inmunoglobulinas séricas concentradas (SBI) y restauración con probiótico Akkermansia muciniphila.',
  },
  defense: {
    id: 'defense',
    nodeNumber: 'Nodo 02',
    name: 'Defensa y Reparación',
    subtitle: 'Inmunidad, Inflamación y Reparación Tisular',
    statusText: 'Fricción Sistémica Activa',
    statusType: 'severe',
    icon: 'security',
    accentColor: '#cb2044',
    parameters: [
      { label: 'hs-PCR:', value: '2.8 mg/L (Alerta >1.0)', barPercent: 70, colorClass: 'bg-secondary' },
      { label: 'Ferritina Sérica:', value: '185 ng/mL (Inflamatorio)', colorClass: 'text-secondary' },
      { label: 'Índice Neutrófilo/Linfocito (NLR):', value: '2.84 (Ref <2.1)', colorClass: 'text-secondary' },
    ],
    treatmentTag: 'Resolvina y Curcuminoide',
    treatmentIcon: 'medication_liquid',
    deepDescription:
      'La inflamación crónica tisular de bajo grado genera elevación continua de TNF-alfa e IL-6. Esto activa IKK-beta, promoviendo la fosforilación en serina de IRS-1 y desactivando la movilización intracelular de GLUT4.',
    protocol:
      'Mediadores Pro-resolutivos Especializados (SPMs) dirigidos 1000mcg, Complejo Curcumina-galactomanano 500mg BID, Boswellia serrata de alta potencia.',
  },
  energy: {
    id: 'energy',
    nodeNumber: 'Nodo 03',
    name: 'Energía',
    subtitle: 'Capacidad Mitocondrial y Redox Oxidativo',
    statusText: 'Biogénesis Afectada',
    statusType: 'friction',
    icon: 'bolt',
    accentColor: '#005c55',
    parameters: [
      { label: '8-OHdG Urinario:', value: '9.6 ng/mg Cr (>5.5)', barPercent: 65, colorClass: 'bg-secondary' },
      { label: 'CoQ10 Plasmático:', value: '0.62 μg/mL (Bajo <0.8)', colorClass: 'text-secondary' },
      { label: 'Lactato/Piruvato:', value: '19.4 (Subóptimo)', colorClass: 'text-on-surface' },
    ],
    treatmentTag: 'Inducción PGC-1alfa',
    treatmentIcon: 'tune',
    deepDescription:
      'Niveles altos de radicales libres (8-OHdG) y déficit de cofactores de la cadena de transporte de electrones limitan la eficiencia de beta-oxidación, propiciando oxidación lipídica incompleta y acumulación de ceramidas tóxicas.',
    protocol:
      'Ubiquinol 200mg/día, Ácido Alfa Lipoico (forma R) 300mg BID, Acetil-L-Carnitina 1.000mg, acondicionamiento mitocondrial con ejercicio en Zona 2.',
  },
  biotransformation: {
    id: 'biotransformation',
    nodeNumber: 'Nodo 04',
    name: 'Biotransformación',
    subtitle: 'Depuración y Detoxificación Hepática',
    statusText: 'Desacoplamiento Fase I/II',
    statusType: 'friction',
    icon: 'sanitizer',
    accentColor: '#005c55',
    parameters: [
      { label: 'GGT Sérica:', value: '34 U/L (Ópt <18)', barPercent: 72, colorClass: 'bg-secondary' },
      { label: 'Índice de Hígado Graso (FLI):', value: '64.8 (>60 Esteatosis)', colorClass: 'text-tertiary' },
      { label: 'AST / ALT:', value: '26 / 38 U/L (Inversión)', colorClass: 'text-on-surface' },
    ],
    treatmentTag: 'Sulforafano / NAC',
    treatmentIcon: 'water_drop',
    deepDescription:
      'El FLI de 64.8 confirma acumulación lipídica hepática. Al acumular diacilglicerol (DAG), se activa la proteína quinasa C épsilon (PKCε), bloqueando la inhibición mediada por insulina de la gluconeogénesis.',
    protocol:
      'Glucosinolato de sulforafano 60mg/día, N-Acetil Cisteína (NAC) 600mg BID, Cardo Mariano (fitosoma) 200mg, soporte de Colina y Metionina.',
  },
  transport: {
    id: 'transport',
    nodeNumber: 'Nodo 05',
    name: 'Transporte',
    subtitle: 'Dinámica Cardiovascular y Linfática',
    statusText: 'Rigidez Endotelial',
    statusType: 'friction',
    icon: 'sync_alt',
    accentColor: '#005c55',
    parameters: [
      { label: 'Ratio Trig / HDL:', value: '4.19 (Ideal <1.5)', barPercent: 82, colorClass: 'bg-tertiary' },
      { label: 'sdLDL-P Denso:', value: '1.420 nmol/L (Alto)', colorClass: 'text-secondary' },
      { label: 'Dilatación Mediada por Flujo:', value: 'Reducida microvascular', colorClass: 'text-on-surface' },
    ],
    treatmentTag: 'Soporte de NO Endotelial',
    treatmentIcon: 'favorite',
    deepDescription:
      'El ratio Triglicéridos/HDL de 4.19 evidencia partículas aterogénicas pequeñas y densas. El desacoplamiento de la sintasa endotelial de óxido nítrico perjudica la perfusión microvascular postprandial en lechos musculares.',
    protocol:
      'Nitratos inorgánicos (extracto estandarizado de remolacha), Extracto de ajo envejecido 1.200mg, Bergamota cítrica 500mg BID, ejercicio isométrico vasodilatador.',
  },
  communication: {
    id: 'communication',
    nodeNumber: 'Nodo 06',
    name: 'Comunicación',
    subtitle: 'Endocrino, Incretinas y Neurotransmisores',
    statusText: 'Resistencia Severa',
    statusType: 'severe',
    icon: 'sensors',
    accentColor: '#cb2044',
    parameters: [
      { label: 'Insulina Basal:', value: '14.8 μIU/mL (Ópt <5)', barPercent: 90, colorClass: 'bg-tertiary' },
      { label: 'Curva Kraft OGTT:', value: 'Patrón III-A (Retardado)', colorClass: 'text-tertiary' },
      { label: 'Pendiente Diurna de Cortisol:', value: 'Atenuación Matutina', colorClass: 'text-secondary' },
    ],
    treatmentTag: 'Objetivo de Máxima Prioridad',
    treatmentIcon: 'warning',
    deepDescription:
      'Insulina basal elevada (14.8 μIU/mL) con patrón Kraft III-A indica hiperinsulinemia postprandial grave de aclaramiento demorado (>120 min), sumado a cortisol matutino aplanado y tono vespertino HPA elevado.',
    protocol:
      'Fitoma de Berberina 500mg BID, Nicotinato de Cromo 400mcg, Fosfatidilserina 300mg antes de dormir para modular el cortisol vespertino y reactivar receptor insulínico.',
  },
  structural: {
    id: 'structural',
    nodeNumber: 'Nodo 07',
    name: 'Integridad Estructural',
    subtitle: 'Lípidos de Membrana y Dinámica Musculoesquelética',
    statusText: 'Adiposidad Sarcopénica',
    statusType: 'friction',
    icon: 'accessibility_new',
    accentColor: '#005c55',
    parameters: [
      { label: 'Ratio Visceral/Subcutáneo (DXA):', value: '0.42 (Elevado >0.3)', barPercent: 74, colorClass: 'bg-secondary' },
      { label: 'Índice Omega-3 Eritrocitario:', value: '3.8% (Meta >8.0%)', colorClass: 'text-secondary' },
      { label: 'Sumidero Muscular GLUT4:', value: 'Área de Superficie Reducida', colorClass: 'text-secondary' },
    ],
    treatmentTag: 'Resistencia Progresiva',
    treatmentIcon: 'fitness_center',
    deepDescription:
      'Índice de Omega-3 en membrana de 3.8% genera rigidez celular con menor fluidez de receptores insulínicos. DXA confirma distribución sarcopénica con sumidero reducido de reserva GLUT4.',
    protocol:
      'Aceite de Pescado alto en EPA/DHA (ratio 2:1) 3.000mg/día, Entrenamiento de Fuerza Progresivo (3x/semana), Aminoácidos esenciales ricos en Leucina 5g post-entrenamiento.',
  },
};
