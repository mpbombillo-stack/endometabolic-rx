# MANUAL DE USUARIO & GUÍA CLÍNICA METODOLÓGICA
## Sistema de Soporte a Decisiones Clínicas en Medicina Funcional y Endocrinología Metabólica
**EndoMetabolic Rx • Functional Care (Medicina Funcional & Regenerativa)**  
*Versión de la Plataforma: 4.2.0-Production (2026)*

---

## TABLA DE CONTENIDO
1. [Introducción y Arquitectura Clínica](#1-introducción-y-arquitectura-clínica)
2. [Control de Acceso, Autenticación y Seguridad](#2-control-de-acceso-autenticación-y-seguridad)
3. [Secuencia Clínica en el Ingreso de Datos (Paso a Paso)](#3-secuencia-clínica-en-el-ingreso-de-datos-paso-a-paso)
4. [Diccionario Clínico de Ítems: ¿Qué hace cada campo y para qué sirve?](#4-diccionario-clínico-de-ítems-qué-hace-cada-campo-y-para-qué-sirve)
5. [Metodología y Protocolo de Seguimiento Longitudinal](#5-metodología-y-protocolo-de-seguimiento-longitudinal)
6. [Módulo 1: Expediente del Paciente & Dashboard de Cohorte](#6-módulo-1-expediente-del-paciente--dashboard-de-cohorte)
7. [Módulo 2: Marco Fisiopatológico ATM & Matriz de los 7 Nodos](#7-módulo-2-marco-fisiopatológico-atm--matriz-de-los-7-nodos)
8. [Módulo 3: Calculadora de Índices Subrogados de Resistencia a la Insulina](#8-módulo-3-calculadora-de-índices-subrogados-de-resistencia-a-la-insulina)
9. [Módulo 4: Análisis de Curvas de Sobrecarga Oral a la Glucosa (Kraft OGTT)](#9-módulo-4-análisis-de-curvas-de-sobrecarga-oral-a-la-glucosa-kraft-ogtt)
10. [Módulo 5: CDSS, Atribución SHAP & Estratificación de Riesgo](#10-módulo-5-cdss-atribución-shap--estratificación-de-riesgo)
11. [Módulo 6: Matriz Terapéutica & Protocolos Funcionales](#11-módulo-6-matriz-terapéutica--protocolos-funcionales)
12. [Módulo 7: Monitoreo Continuo (CGM) & Ecosistema Interoperable HL7 FHIR R4](#12-módulo-7-monitoreo-continuo-cgm--ecosistema-interoperable-hl7-fhir-r4)
13. [Módulo 8: Configuración del Equipo Médico, Firmas Digitales y Exportación PDF](#13-módulo-8-configuración-del-equipo-médico-firmas-digitales-y-exportación-pdf)
14. [Glosario Oficial de Acrónimos y Abreviaturas](#14-glosario-oficial-de-acrónimos-y-abreviaturas)

---

## 1. INTRODUCCIÓN Y ARQUITECTURA CLÍNICA

**EndoMetabolic Rx** es una plataforma clínica de alta precisión desarrollada para especialistas en Medicina Funcional, Endocrinología Metabólica y Medicina Regenerativa. Su propósito principal es identificar de forma temprana los estados de hiperinsulinemia compensatoria, resistencia a la insulina oculta, disfunción mitocondrial e inflamación metabólica antes de que se manifiesten en la glucemia basal o la hemoglobina glicosilada (HbA1c).

---

## 2. CONTROL DE ACCESO, AUTENTICACIÓN Y SEGURIDAD

### 2.1. Regla Institucional de Construcción de Usuario (3 + 2 + 2)
El nombre de usuario (*login*) se genera automáticamente a partir del nombre completo del especialista:

$$\text{Usuario} = \underbrace{\text{3 primeras letras}}_{\text{Nombre de Pila}} + \underbrace{\text{2 primeras letras}}_{\text{1er Apellido}} + \underbrace{\text{2 primeras letras}}_{\text{2do Apellido}}$$

*Ejemplo:* **Dr. Mauricio Suaza Gutiérrez** $\rightarrow$ `mau` + `su` + `gu` = **`mausugu`**.

### 2.2. Política de Seguridad y Cambio Obligatorio de Contraseña
Al autenticarse por primera vez con la clave temporal (`M77`), el sistema exige de forma obligatoria el cambio de contraseña:
- **Longitud mínima:** 8 caracteres.
- **Componentes:** Al menos un número (`0-9`), una letra mayúscula (`A-Z`) y un carácter especial (`&%$#"!&/()=?`, `@`, `*`, `_`, `-`, `.`).
- **Confirmación:** Validación de repetición exacta.

---

## 3. SECUENCIA CLÍNICA EN EL INGRESO DE DATOS (PASO A PASO)

Para garantizar la máxima exactitud en los cálculos subrogados, la estratificación CDSS y la generación de reportes certificados, el especialista debe seguir la siguiente secuencia cronológica de trabajo:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 1: Autenticación del Especialista (Login & Selección de Firma)     │
└────────────────────────────────────┬────────────────────────────────────┘
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 2: Admisión / Intake del Paciente (+ Nuevo Paciente)               │
│ - Datos demográficos, MRN, antecedentes, gatilladores y mediadores ATM  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 3: Registro de Consulta y Analítica (+ Nueva Evolución)            │
│ - Signos vitales, horas de ayuno exactas y analítica de laboratorio     │
│ - Puntos de la curva Kraft OGTT (0', 30', 60', 120', 180' min)          │
└────────────────────────────────────┬────────────────────────────────────┘
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 4: Mapeo en la Matriz Funcional (7 Nodos Biológicos)               │
│ - Inspección de Asimilación, Defensa, Energía, Biotransformación, etc.  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 5: Evaluación CDSS & Estratificación Predictiva (XGBoost SHAP)     │
│ - Asignación de Estrato Metabólico (0 a 3) y visualización de factores │
└────────────────────────────────────┬────────────────────────────────────┘
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 6: Prescripción del Protocolo Terapéutico (5R, Nutracéuticos, Z2)  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PASO 7: Telemetría CGM 24h & Exportación de Informe Certificado (PDF)   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Detalle de cada paso:

1. **Paso 1 - Autenticación y Perfil Activo:** Ingrese con sus credenciales institucionales. El sistema cargará automáticamente su nombre, registro médico y firma digitalizada activa para todos los informes.
2. **Paso 2 - Registro de Nuevo Paciente (+ Nuevo Paciente):**
   - Ingrese nombre completo, documento / MRN (Número de Registro Médico), edad, sexo biológico, ocupación y contacto.
   - Diligencie la anamnesis funcional: **Antecedentes (A)** predisponentes, **Gatilladores (T)** detonantes y **Mediadores (M)** de cronicidad.
3. **Paso 3 - Registro de la Consulta / Evolución (+ Nueva Evolución):**
   - Ingrese los signos vitales actuales (Presión Arterial, Frecuencia Cardíaca, Peso, Talla, Cintura).
   - Ingrese las **Horas de Ayuno Exactas** (fundamental para normalizar la glucosa e insulina basal).
   - Introduzca los valores del laboratorio sanguíneo y, si dispone de la prueba, los 5 puntos de la curva Kraft OGTT.
4. **Paso 4 - Análisis de Índices y Matriz:** Navegue a la pestaña *Calculadora de Índices* y *Curvas Kraft* para visualizar el patrón de secreción insulínica (Patrones I al V) y los índices de fricción metabólica.
5. **Paso 5 - Estratificación CDSS:** Acceda a la pestaña *CDSS & Estratificación* para ver la atribución de riesgo mediante SHAP y el estrato asignado (Estrato 0 a 3).
6. **Paso 6 - Plan Terapéutico:** En *Matriz Terapéutica*, seleccione y aplique los protocolos correspondientes (Protocolo 5R digestivo, ejercicio en Zona 2, nutracéuticos de modulación de AMPK y GLP-1).
7. **Paso 7 - Exportación y Entrega:** Genere el reporte médico en PDF de alta resolución con firma digital o el recurso HL7 FHIR R4 para el expediente electrónico hospitalario.

---

## 4. DICCIONARIO CLÍNICO DE ÍTEMS: ¿QUÉ HACE CADA CAMPO Y PARA QUÉ SIRVE?

A continuación se detalla el significado fisiopatológico, la utilidad diagnóstica y el rango funcional de cada campo que se ingresa en el sistema:

### 4.1. Variables Antropométricas y Signos Vitales

| Campo / Ítem | Unidad | ¿Para qué sirve? (Relevancia Clínica) | Rango Funcional Óptimo |
| :--- | :--- | :--- | :--- |
| **Horas de Ayuno** | Horas ($h$) | Estandariza la fase metabólica postabsortiva. Un ayuno menor a 10h o mayor a 16h invalida la precisión de HOMA-IR y TyG. | $12.0 - 14.0\text{ h}$ |
| **Peso y Talla** | $\text{kg}$, $\text{cm}$ | Permite calcular el Índice de Masa Corporal ($\text{IMC} = \text{kg}/\text{m}^2$) y alimentar las ecuaciones de TyG-BMI, METS-IR y FLI. | $\text{IMC: } 18.5 - 24.9$ |
| **Perímetro de Cintura** | $\text{cm}$ | Estimador indirecto de mayor precisión para grasa visceral y esteatosis hepática. Alimenta las fórmulas de LAP y FLI. | M: $< 80\text{ cm}$ / H: $< 90\text{ cm}$ |
| **Presión Arterial (PA)** | $\text{mmHg}$ | Evalúa disfunción endotelial y tono simpático aumentado por hiperinsulinemia compensatoria renal. | $< 120 / 80\text{ mmHg}$ |
| **Frecuencia Cardíaca** | $\text{lpm}$ | Marcador de tono autonómico y balance simpático-vagal en reposo. | $60 - 75\text{ lpm}$ |

### 4.2. Perfil Bioquímico y Biomarcadores Sanguíneos

| Campo / Ítem | Unidad | ¿Para qué sirve? (Relevancia Clínica) | Rango Funcional Óptimo |
| :--- | :--- | :--- | :--- |
| **Glucosa Basal** | $\text{mg/dL}$ | Evalúa la producción hepática basal de glucosa (gluconeogénesis y glucogenólisis) regulada por la insulina portal. | $70 - 89\text{ mg/dL}$ |
| **Insulina Basal** | $\mu\text{IU/mL}$ | Determina el esfuerzo secretor del páncreas. La elevación $> 6.0\,\mu\text{IU/mL}$ indica hiperinsulinemia compensatoria temprana años antes de que suba la glucosa. | $2.0 - 6.0\,\mu\text{IU/mL}$ |
| **Triglicéridos (TG)** | $\text{mg/dL}$ | Refleja lipogénesis hepática de novo impulsada por hiperinsulinemia y exceso de fructosa/carbohidratos refinados. | $< 100\text{ mg/dL}$ |
| **HDL-Colesterol** | $\text{mg/dL}$ | Mide partículas antiinflamatorias y capacidad de transporte reverso de colesterol. En resistencia a la insulina, el HDL se reduce y se vuelve disfuncional. | M: $> 55\text{ mg/dL}$ / H: $> 50\text{ mg/dL}$ |
| **GGT (Gamma-Glutamil)**| $\text{U/L}$ | Marcador de depleción de glutatión celular, estrés oxidativo intrahepático y riesgo de esteatosis metabólica (MASLD/NAFLD). | $< 20\text{ U/L}$ |
| **hs-CRP (PCR-us)** | $\text{mg/L}$ | Evalúa endotoxemia metabólica (LPS traslocado por permeabilidad intestinal) e inflamación endotelial de bajo grado. | $< 0.8\text{ mg/L}$ |
| **HbA1c** | $\%$ | Mide el promedio de exposición glucémica eritrocitaria en los últimos 90-120 días. | $4.8\% - 5.4\%$ |
| **Transaminasas (AST/ALT)**| $\text{U/L}$ | Evalúa inflamación y daño hepatocelular secundario a lipotoxicidad mitocondrial. | $\text{ALT: } < 20\text{ U/L}$ / $\text{AST: } < 22\text{ U/L}$ |

### 4.3. Curva de Sobrecarga Oral a la Glucosa (Kraft OGTT - 5 Puntos)

| Punto Temporal | Parámetros | ¿Para qué sirve? | Comportamiento Esperado Óptimo |
| :--- | :--- | :--- | :--- |
| **0 min (Basal)** | Glucosa / Insulina | Estado metabólico de reposo | Glucosa $< 90\text{ mg/dL}$, Insulina $< 6\,\mu\text{IU/mL}$ |
| **30 min** | Glucosa / Insulina | Evalúa la **Fase 1 de secreción insulínica** (liberación rápida de gránulos preformados). | Pico precoz de insulina ($< 60\,\mu\text{IU/mL}$) |
| **60 min** | Glucosa / Insulina | Pico fisiológico de absorción intestinal de glucosa. | Glucosa $< 140\text{ mg/dL}$, Insulina en descenso |
| **120 min** | Glucosa / Insulina | Evalúa la **Fase 2 de secreción** y el aclaramiento periférico en músculo y tejido adiposo. | Glucosa $< 100\text{ mg/dL}$, Insulina $< 30\,\mu\text{IU/mL}$ |
| **180 min** | Glucosa / Insulina | Retorno a la homeostasis basal. Detecta hiperinsulinemia retardada severa o hipoglucemia reactiva. | Retorno completo a valores basales ($\text{Insulina } < 10\,\mu\text{IU/mL}$) |

---

## 5. METODOLOGÍA Y PROTOCOLO DE SEGUIMIENTO LONGITUDINAL

El seguimiento en Medicina Funcional no evalúa únicamente cifras estáticas, sino la **trayectoria dinámica de resolución de la fricción metabólica** y la restauración de la flexibilidad celular.

### 5.1. Cronograma Estándar de Controles Clínicos

```
Consulta 0 (Basal)       Consulta 1 (Semana 6 - 8)     Consulta 2 (Mes 3 - 4)        Consulta 3 (Mes 6)
      │                                │                            │                           │
      ▼                                ▼                            ▼                           ▼
- Perfil Completo ATM        - Ajuste Protocolo 5R        - Repetición Lab Subrogados   - Re-evaluación OGTT
- Kraft OGTT + Labs          - Telemetría CGM (TIR)       - Cálculo de Deltas (Δ)       - Consolidación Estilo
- Asignación Estrato         - Re-evaluación Síntomas     - Ajuste Nutracéuticos        - Estrato 0 Alcanzado
```

### 5.2. Métricas de Éxito en el Seguimiento Longitudinal:
1. **Delta HOMA-IR ($\Delta\text{HOMA-IR}$):** Reducción progresiva hacia $< 1.5$.
2. **Delta Ratio TG/HDL ($\Delta\text{TG/HDL}$):** Disminución por debajo de $1.5$ (indicador clave de partículas LDL pequeñas y densas no aterogénicas).
3. **Optimización CGM:**
   - Aumento del **Tiempo en Rango ($70-140\text{ mg/dL}$)** a $> 85\%$.
   - Reducción de la variabilidad glucémica ($\text{CV} < 20\%$).
   - Desaparición de picos postprandiales $> 140\text{ mg/dL}$.
4. **Desescalada de Estrato Metabólico:** Transición documentada de Estrato 2/3 $\rightarrow$ Estrato 1 $\rightarrow$ Estrato 0.

---

## 6. MÓDULO 1: EXPEDIENTE DEL PACIENTE & DASHBOARD DE COHORTE

Permite la administración integral de historias clínicas y cohorte metabólica:
- **Búsqueda Dinámica:** Localización instantánea por nombre, MRN, médico asignado o estrato.
- **Acciones Rápidas:** Botones para añadir nueva evolución, exportar PDF, ver telemetría FHIR o abrir la matriz ATM.

---

## 7. MÓDULO 2: MARCO FISIOPATOLÓGICO ATM & MATRIZ DE LOS 7 NODOS

Mapea la raíz fisiopatológica del paciente según el modelo del *Institute for Functional Medicine (IFM)*:
- **Antecedentes (A):** Factores genéticos, epigenéticos y familiares.
- **Gatilladores (T):** Detonantes biológicos, ambientales o emocionales.
- **Mediadores (M):** Factores que sostienen la inflamación y el daño crónico.
- **Los 7 Nodos Biológicos:** Asimilación, Defensa, Energía, Biotransformación, Comunicación, Transporte e Integridad Estructural.

---

## 8. MÓDULO 3: CALCULADORA DE ÍNDICES SUBROGADOS

Calcula en tiempo real los índices de mayor validación científica internacional:
- **HOMA-IR:** Resistencia a la insulina basal hepática.
- **QUICKI:** Sensibilidad insulínica global (inverso logarítmico).
- **TyG & TyG-BMI:** Resistencia muscular y sobrecarga lipogénica.
- **METS-IR:** Índice cardiometabólico ajustado por HDL y masa corporal.
- **LAP (Lipid Accumulation Product):** Riesgo de adiposidad visceral ectópica.
- **FLI (Fatty Liver Index):** Probabilidad de esteatosis hepática metabólica.

---

## 9. MÓDULO 4: ANÁLISIS DE CURVAS KRAFT OGTT

Clasifica la respuesta de insulina a 3 horas en 5 patrones fisiopatológicos fundamentales:
- **Patrón I:** Curva euinsulinémica normal / óptima.
- **Patrón II:** Hiperinsulinemia retardada moderada.
- **Patrón III-A / III-B:** Hiperinsulinemia retardada severa sostenida.
- **Patrón IV:** Hiperinsulinemia basal con resistencia periférica grave.
- **Patrón V:** Falla o agotamiento secretor de células beta pancreáticas.

---

## 10. MÓDULO 5: CDSS, ATRIBUCIÓN SHAP & ESTRATIFICACIÓN

El motor de soporte diagnóstico utiliza un modelo de árboles potenciados **XGBoost**:
- **Explicabilidad SHAP:** Visualiza exactamente qué variables del paciente (ej. Insulina 14.8, TG/HDL 4.1, GGT 34) están empujando el riesgo metabólico al alza.
- **Estratos 0 a 3:** Semáforo clínico de intervención terapéutica.

---

## 11. MÓDULO 6: MATRIZ TERAPÉUTICA & PROTOCOLOS FUNCIONALES

- **Protocolo 5R:** *Remove, Replace, Reinoculate, Repair, Rebalance* para integridad de mucosa digestiva.
- **Zona 2 Mitocondrial:** Entrenamiento cardiovascular en zona de máxima oxidación lipídica.
- **Crononutrición:** Sincronización de ingesta con el reloj maestro circadiano supraquiasmático.

---

## 12. MÓDULO 7: MONITOREO CONTINUO (CGM) & ECOSISTEMA HL7 FHIR R4

- **Telemetría CGM 24 Horas:** Gráficos continuos de glucosa con cálculo de TIR, TAR, TBR y Coeficiente de Variación.
- **Recursos FHIR R4 Interoperables:** Generación de JSON estándar para `DiagnosticReport`, `Observation`, `Patient`, y `Practitioner`.

---

## 13. MÓDULO 8: CONFIGURACIÓN DEL EQUIPO MÉDICO & FIRMAS DIGITALES

- **Gestión de Profesionales:** Administración de especialistas médicos, matrículas y cargos.
- **Firmas Digitales:** Dibujo táctil en pantalla o carga de firma escaneada con sellos institucionales.
- **Exportación de Reportes en PDF:** Informes médicos de alta fidelidad estética y rigor clínico listos para impresión o entrega al paciente.

---

## 14. GLOSARIO OFICIAL DE ACRÓNIMOS Y ABREVIATURAS

| Acrónimo | Término Completo | Definición Clínica / Metodológica |
| :--- | :--- | :--- |
| **ADA** | *American Diabetes Association* | Asociación Americana de Diabetes. |
| **ALT** | Alanina Aminotransferasa | Enzima citosólica hepática indicadora de lipotoxicidad y daño hepatocelular. |
| **AST** | Aspartato Aminotransferasa | Enzima mitocondrial y citosólica presente en hígado, corazón y músculo. |
| **ATM** | Antecedentes, Gatilladores, Mediadores | Marco de razonamiento fisiopatológico en Medicina Funcional. |
| **ATP** | Adenosín Trifosfato | Molécula energética celular sintetizada en la fosforilación oxidativa mitocondrial. |
| **AUC** | *Area Under the Curve* | Área bajo la curva de glucosa e insulina en pruebas dinámicas OGTT. |
| **CDSS** | *Clinical Decision Support System* | Sistema informatizado de soporte a la toma de decisiones clínicas. |
| **CGM** | *Continuous Glucose Monitoring* | Monitoreo continuo de glucosa intersticial en tiempo real. |
| **CV** | Coeficiente de Variabilidad | Medida porcentual de fluctuaciones glucémicas ($\text{DE}/\text{Media}\times 100$). |
| **FHIR** | *Fast Healthcare Interoperability Resources* | Estándar internacional HL7 para intercambio electrónico de datos en salud. |
| **FLI** | *Fatty Liver Index* | Algoritmo predictivo de esteatosis hepática no alcohólica basado en IMC, cintura, TG y GGT. |
| **GGT** | Gamma-Glutamil Transferasa | Enzima de membrana y marcador de estrés oxidativo y sobrecarga tóxica hepática. |
| **HbA1c** | Hemoglobina Glicosilada A1c | Fracción de hemoglobina unida a glucosa; promedio glucémico de 3 meses. |
| **HDL** | *High-Density Lipoprotein* | Lipoproteínas de alta densidad participantes en el transporte reverso de colesterol. |
| **HIPAA** | *Health Insurance Portability and Accountability Act* | Ley estándar de confidencialidad y seguridad de datos médicos. |
| **HOMA-IR** | *Homeostatic Model Assessment of Insulin Resistance* | Índice de resistencia hepática a la insulina calculado a partir de glucosa e insulina basal. |
| **hs-CRP** | *High-Sensitivity C-Reactive Protein* | Proteína C Reactiva Ultrasensible; biomarcador de inflamación vascular subclínica. |
| **IFMCP** | *Institute for Functional Medicine Certified Practitioner* | Médico especialista certificado por el Instituto de Medicina Funcional. |
| **IMC / BMI** | Índice de Masa Corporal | Relación de peso respecto a la estatura al cuadrado ($\text{kg/m}^2$). |
| **Kraft OGTT** | Prueba Kraft de Tolerancia a la Glucosa | Protocolo de 5 tomas de insulina y glucosa a 3 horas ideado por el Dr. Joseph Kraft. |
| **LAP** | *Lipid Accumulation Product* | Indicador de acumulación lipídica visceral y riesgo aterogénico. |
| **LDL** | *Low-Density Lipoprotein* | Lipoproteínas de baja densidad transportadoras de colesterol a tejidos. |
| **MASLD** | *Metabolic dysfunction-Associated Steatotic Liver Disease* | Nueva nomenclatura médica para la enfermedad hepática esteatósica metabólica. |
| **METS-IR** | *Metabolic Score for Insulin Resistance* | Puntuación de sensibilidad insulínica con alta concordancia con el clamp euglucémico. |
| **MRN** | *Medical Record Number* | Número único de historia clínica y expediente electrónico del paciente. |
| **OGTT / PTOG** | *Oral Glucose Tolerance Test* | Sobrecarga oral con 75 g de glucosa anhidra para evaluación funcional endocrina. |
| **QUICKI** | *Quantitative Insulin Sensitivity Check Index* | Índice cuantitativo de sensibilidad insulínica basado en escala logarítmica. |
| **RLS** | *Row Level Security* | Políticas de seguridad de base de datos a nivel de registro en PostgreSQL/Supabase. |
| **SHAP** | *SHapley Additive exPlanations* | Método de teoría de juegos para interpretar las predicciones de modelos de Machine Learning. |
| **TAR** | *Time Above Range* | Porcentaje de tiempo con glucosa intersticial $> 140\text{ mg/dL}$. |
| **TBR** | *Time Below Range* | Porcentaje de tiempo con glucosa intersticial $< 70\text{ mg/dL}$ (hipoglucemia). |
| **TG** | Triglicéridos | Ésteres de glicerol y ácidos grasos; marcador de sobrecarga lipídica. |
| **TIR** | *Time In Range* | Porcentaje de tiempo en rango normoglucémico óptimo ($70-140\text{ mg/dL}$). |
| **TRE** | *Time-Restricted Eating* | Estrategia de alimentación con ventana horaria restringida (ayuno intermitente). |
| **TyG** | *Triglyceride-Glucose Index* | Índice de triglicéridos y glucosa; marcador sustituto de resistencia periférica. |
| **VAI** | *Visceral Adiposity Index* | Modelo matemático de distribución grasa y disfunción del tejido adiposo. |
| **XGBoost** | *eXtreme Gradient Boosting* | Algoritmo de ensamble de árboles de decisión de alto rendimiento en analítica clínica. |
