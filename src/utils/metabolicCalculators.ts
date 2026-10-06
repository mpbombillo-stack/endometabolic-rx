import { PatientLabs, SurrogateResults } from '../types';

export function calculateSurrogates(labs: PatientLabs): SurrogateResults {
  const { glucoseFasting, insulinFasting, triglycerides, hdl, bmi, waistCm, ggt, sex } = labs;

  // 1. HOMA-IR: (Glucosa mg/dL * Insulina uIU/mL) / 405
  const homaIr = Number(((glucoseFasting * insulinFasting) / 405).toFixed(2));

  // 2. QUICKI: 1 / (log10(Glucosa) + log10(Insulina))
  const logG = Math.log10(Math.max(1, glucoseFasting));
  const logI = Math.log10(Math.max(0.1, insulinFasting));
  const quicki = Number((1 / (logG + logI)).toFixed(3));

  // 3. TyG Index: ln( (Trigliceridos mg/dL * Glucosa mg/dL) / 2 )
  const tyg = Number(Math.log((triglycerides * glucoseFasting) / 2).toFixed(2));

  // 4. TyG-BMI: TyG * BMI
  const tygBmi = Number((tyg * bmi).toFixed(1));

  // 5. METS-IR: (ln(2*Glucosa + Trig) * BMI) / ln(HDL)
  const metsIr = Number(
    ((Math.log(2 * glucoseFasting + triglycerides) * bmi) / Math.log(Math.max(1.1, hdl))).toFixed(1)
  );

  // 6. LAP (Lipid Accumulation Product):
  // Female: (Cintura cm - 58) * (Trig mg/dL * 0.01129 mmol/L)
  // Male: (Cintura cm - 65) * (Trig mg/dL * 0.01129 mmol/L)
  const baseWaist = sex === 'female' ? 58 : 65;
  const trigMmol = triglycerides * 0.01129;
  const lap = Number(Math.max(0, (waistCm - baseWaist) * trigMmol).toFixed(1));

  // 7. VAI (Visceral Adiposity Index):
  let rawVai = 0;
  if (sex === 'female') {
    rawVai = (waistCm / (36.58 + 1.89 * bmi)) * (triglycerides / 0.81) * (1.52 / Math.max(1, hdl));
  } else {
    rawVai = (waistCm / (39.68 + 1.88 * bmi)) * (triglycerides / 1.03) * (1.31 / Math.max(1, hdl));
  }
  const vai = Number(Math.max(0.5, rawVai * 0.28).toFixed(2));

  // 8. FLI (Fatty Liver Index):
  const y =
    0.953 * Math.log(Math.max(1, triglycerides)) +
    0.139 * bmi +
    0.718 * Math.log(Math.max(1, ggt)) +
    0.053 * waistCm -
    15.745;
  const fliCalc = (Math.exp(y) / (1 + Math.exp(y))) * 100;
  const fli = Number(Math.min(100, Math.max(0, fliCalc)).toFixed(1));

  // Calculate cumulative friction percentage
  let flags = 0;
  if (homaIr > 1.4) flags++;
  if (homaIr > 2.5) flags++;
  if (quicki < 0.38) flags++;
  if (tyg >= 8.1) flags++;
  if (tygBmi >= 190) flags++;
  if (metsIr >= 39) flags++;
  if (lap > 28) flags++;
  if (vai > 1.5) flags++;
  if (fli >= 30) flags++;

  const frictionPercent = Math.min(100, Math.round((flags / 9) * 88));

  return {
    homaIr,
    quicki,
    tyg,
    tygBmi,
    metsIr,
    lap,
    vai,
    fli,
    frictionPercent,
  };
}

export const KRAFT_PATTERNS_MAP: Record<string, {
  name: string;
  badge: string;
  badgeType: 'optimal' | 'warning' | 'critical';
  description: string;
  glucose: [number, number, number, number, number];
  insulin: [number, number, number, number, number];
  insulinPath: string;
  insulinArea: string;
  glucosePath: string;
  matsuda: number;
  aucInsulin: number;
  clearanceRatio: number;
  phase1: string;
  phase2: string;
  points: { min: string; gluc: number; ins: number; state: string }[];
}> = {
  'pattern-1': {
    name: 'Patrón I: Dinámica Normal de Insulina',
    badge: 'Eumetabólico',
    badgeType: 'optimal',
    description: 'Ayuno <10 µIU/mL. Pico a 30-60 min (<60 µIU/mL). A 120 min <30 µIU/mL. Retorno ágil al basal a 180 min con excelente aclaramiento hepático.',
    glucose: [86, 128, 110, 92, 84],
    insulin: [7.2, 42.0, 52.0, 18.5, 8.4],
    insulinPath: 'M 100 326 C 160 270, 200 240, 240 230 C 280 235, 340 280, 380 295 C 450 315, 500 325, 530 330 C 600 335, 650 336, 680 336',
    insulinArea: 'M 100 340 L 100 326 C 160 270, 200 240, 240 230 C 280 235, 340 280, 380 295 C 450 315, 500 325, 530 330 C 600 335, 650 336, 680 336 L 680 340 Z',
    glucosePath: 'M 100 236 C 160 200, 200 180, 240 180 C 290 185, 330 220, 380 230 C 440 240, 480 240, 530 242 C 590 244, 630 242, 680 240',
    matsuda: 7.82,
    aucInsulin: 4920,
    clearanceRatio: 2.56,
    phase1: 'Conservada (+18%)',
    phase2: 'Normofuncional',
    points: [
      { min: '0 min (Basal)', gluc: 86, ins: 7.2, state: 'Homeostático' },
      { min: '30 min (Cefálica)', gluc: 128, ins: 42.0, state: 'Pico Fisiológico' },
      { min: '60 min (Post-carga)', gluc: 110, ins: 52.0, state: 'Aclarando' },
      { min: '120 min (Recuperación)', gluc: 92, ins: 18.5, state: 'Normalizado' },
      { min: '180 min (Basal)', gluc: 84, ins: 8.4, state: 'Retorno Completo' },
    ]
  },
  'pattern-2': {
    name: 'Patrón II: Pico Tardío / Retraso Leve',
    badge: 'Retraso Leve',
    badgeType: 'warning',
    description: 'Ayuno normal o limítrofe. Pico demorado a 90-120 min. Los valores a 180 min se aproximan lentamente al basal. Alerta temprana de fricción periférica.',
    glucose: [92, 138, 148, 116, 95],
    insulin: [9.8, 36.0, 78.0, 68.0, 26.0],
    insulinPath: 'M 100 320 C 160 290, 200 260, 240 245 C 290 230, 330 210, 380 195 C 440 190, 480 210, 530 235 C 590 270, 630 310, 680 320',
    insulinArea: 'M 100 340 L 100 320 C 160 290, 200 260, 240 245 C 290 230, 330 210, 380 195 C 440 190, 480 210, 530 235 C 590 270, 630 310, 680 320 L 680 340 Z',
    glucosePath: 'M 100 226 C 160 190, 200 160, 240 160 C 290 160, 330 180, 380 190 C 440 200, 480 210, 530 225 C 590 235, 630 235, 680 230',
    matsuda: 4.15,
    aucInsulin: 9140,
    clearanceRatio: 6.93,
    phase1: 'Subóptima (-24%)',
    phase2: 'Compensatoria',
    points: [
      { min: '0 min (Basal)', gluc: 92, ins: 9.8, state: 'Normoglucemia' },
      { min: '30 min (Cefálica)', gluc: 138, ins: 36.0, state: 'Fase 1 Lenta' },
      { min: '60 min (Post-carga)', gluc: 148, ins: 78.0, state: 'Demanda Alta' },
      { min: '120 min (Pico Retardado)', gluc: 116, ins: 68.0, state: 'Meseta Prolongada' },
      { min: '180 min (Aclaramiento)', gluc: 95, ins: 26.0, state: 'Retorno Lento' },
    ]
  },
  'pattern-3a': {
    name: 'Patrón Kraft III-A: Hiperinsulinemia Patológica (Eleanor Vance)',
    badge: 'DM2 Oculta / Activo',
    badgeType: 'critical',
    description: 'Retraso severo. Pico masivo a 120 min (>100 µIU/mL). A 180 min persiste elevado sin retorno al basal. Diagnóstico concluyente de resistencia periférica severa.',
    glucose: [98, 145, 168, 138, 104],
    insulin: [14.8, 48.0, 92.0, 124.0, 72.0],
    insulinPath: 'M 100 316 C 170 300, 200 280, 240 260 C 290 235, 330 205, 380 185 C 440 160, 480 134, 530 134 C 590 134, 630 175, 680 222',
    insulinArea: 'M 100 340 L 100 316 C 170 300, 200 280, 240 260 C 290 235, 330 205, 380 185 C 440 160, 480 134, 530 134 C 590 134, 630 175, 680 222 L 680 340 Z',
    glucosePath: 'M 100 222 C 160 195, 200 175, 240 168 C 290 160, 330 140, 380 140 C 440 140, 480 168, 530 176 C 590 185, 630 205, 680 216',
    matsuda: 2.18,
    aucInsulin: 14850,
    clearanceRatio: 8.38,
    phase1: 'Embotada (-58%)',
    phase2: 'Hiperactiva (Masiva)',
    points: [
      { min: '0 min (Basal)', gluc: 98, ins: 14.8, state: 'Fricción Basal' },
      { min: '30 min (Cefálica)', gluc: 145, ins: 48.0, state: 'Fase 1 Embotada' },
      { min: '60 min (Post-carga)', gluc: 168, ins: 92.0, state: 'Demanda Creciente' },
      { min: '120 min (Pico Patológico)', gluc: 138, ins: 124.0, state: '+737% de Basal' },
      { min: '180 min (Aclaramiento)', gluc: 104, ins: 72.0, state: 'Recuperación Tardía' },
    ]
  },
  'pattern-3b': {
    name: 'Patrón Kraft III-B: Hiperinsulinemia Tardía Severa',
    badge: 'Descompensación Marcada',
    badgeType: 'critical',
    description: 'Pico masivo tardío que supera 150 µIU/mL a más de 120 min. Basal elevado (>25 µIU/mL). Marcada hiperglucemia postprandial concurrente.',
    glucose: [112, 175, 198, 165, 128],
    insulin: [28.5, 65.0, 130.0, 168.0, 98.0],
    insulinPath: 'M 100 290 C 160 270, 200 230, 240 210 C 290 180, 330 140, 380 120 C 440 90, 480 75, 530 75 C 590 75, 630 110, 680 150',
    insulinArea: 'M 100 340 L 100 290 C 160 270, 200 230, 240 210 C 290 180, 330 140, 380 120 C 440 90, 480 75, 530 75 C 590 75, 630 110, 680 150 L 680 340 Z',
    glucosePath: 'M 100 210 C 160 170, 200 130, 240 120 C 290 110, 330 100, 380 95 C 440 95, 480 115, 530 130 C 590 150, 630 170, 680 185',
    matsuda: 1.42,
    aucInsulin: 19800,
    clearanceRatio: 5.89,
    phase1: 'Agotamiento Precoz (-72%)',
    phase2: 'Sobreesfuerzo Crítico',
    points: [
      { min: '0 min (Basal)', gluc: 112, ins: 28.5, state: 'Glucotoxicidad' },
      { min: '30 min (Cefálica)', gluc: 175, ins: 65.0, state: 'Respuesta Anárquica' },
      { min: '60 min (Post-carga)', gluc: 198, ins: 130.0, state: 'Hiperglicemia Severa' },
      { min: '120 min (Pico Extremo)', gluc: 165, ins: 168.0, state: 'Inundación Celular' },
      { min: '180 min (Aclaramiento)', gluc: 128, ins: 98.0, state: 'Sin Aclaramiento' },
    ]
  },
  'pattern-4': {
    name: 'Patrón Kraft IV: Hiperinsulinemia Basal Elevada',
    badge: 'Resistencia Extrema',
    badgeType: 'critical',
    description: 'Insulina en ayunas >50 µIU/mL. Secreción persistentemente elevada durante toda la prueba, con respuesta desregulada a la glucosa exógena.',
    glucose: [124, 185, 210, 192, 160],
    insulin: [54.0, 95.0, 142.0, 138.0, 112.0],
    insulinPath: 'M 100 230 C 160 200, 200 180, 240 160 C 290 140, 330 125, 380 115 C 440 110, 480 115, 530 130 C 590 150, 630 180, 680 200',
    insulinArea: 'M 100 340 L 100 230 C 160 200, 200 180, 240 160 C 290 140, 330 125, 380 115 C 440 110, 480 115, 530 130 C 590 150, 630 180, 680 200 L 680 340 Z',
    glucosePath: 'M 100 190 C 160 160, 200 140, 240 130 C 290 125, 330 120, 380 115 C 440 115, 480 125, 530 135 C 590 145, 630 155, 680 165',
    matsuda: 0.98,
    aucInsulin: 21500,
    clearanceRatio: 2.55,
    phase1: 'Inexistente',
    phase2: 'Descarga Continua Desregulada',
    points: [
      { min: '0 min (Basal)', gluc: 124, ins: 54.0, state: 'Hiperinsulinemia Crónica' },
      { min: '30 min (Cefálica)', gluc: 185, ins: 95.0, state: 'Sin Freno Hepático' },
      { min: '60 min (Post-carga)', gluc: 210, ins: 142.0, state: 'Desbordamiento' },
      { min: '120 min (Post-carga)', gluc: 192, ins: 138.0, state: 'Falla Insulínica' },
      { min: '180 min (Aclaramiento)', gluc: 160, ins: 112.0, state: 'Insuficiencia Aclaramiento' },
    ]
  },
  'pattern-5': {
    name: 'Patrón Kraft V: Hipoinsulinismo / Agotamiento Beta',
    badge: 'Agotamiento Beta',
    badgeType: 'critical',
    description: 'Curva insulínica plana (<30 µIU/mL en todos los puntos) acompañada de hiperglucemia franca sostenida (>200 mg/dL). Agotamiento irreversible o diabetes autoinmune.',
    glucose: [142, 218, 260, 245, 210],
    insulin: [4.2, 8.5, 12.0, 9.8, 5.1],
    insulinPath: 'M 100 332 C 160 330, 200 326, 240 324 C 290 324, 330 328, 380 330 C 440 332, 480 334, 530 334 C 590 334, 630 336, 680 336',
    insulinArea: 'M 100 340 L 100 332 C 160 330, 200 326, 240 324 C 290 324, 330 328, 380 330 C 440 332, 480 334, 530 334 C 590 334, 630 336, 680 336 L 680 340 Z',
    glucosePath: 'M 100 210 C 160 160, 200 120, 240 100 C 290 90, 330 85, 380 85 C 440 85, 480 90, 530 95 C 590 100, 630 110, 680 120',
    matsuda: 0.62,
    aucInsulin: 1450,
    clearanceRatio: 2.33,
    phase1: 'Colapsada (-95%)',
    phase2: 'Incompetencia Pancreática',
    points: [
      { min: '0 min (Basal)', gluc: 142, ins: 4.2, state: 'Déficit Absoluto' },
      { min: '30 min (Cefálica)', gluc: 218, ins: 8.5, state: 'Sin Respuesta' },
      { min: '60 min (Post-carga)', gluc: 260, ins: 12.0, state: 'Pico Plano Ineficaz' },
      { min: '120 min (Post-carga)', gluc: 245, ins: 9.8, state: 'Glucotoxicidad Masiva' },
      { min: '180 min (Aclaramiento)', gluc: 210, ins: 5.1, state: 'Agotamiento Extremo' },
    ]
  }
};
