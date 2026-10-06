# MANUAL DE USUARIO & GLOSARIO CLÍNICO DE ACRÓNIMOS
## Sistema de Soporte a Decisiones Clínicas en Medicina Funcional y Endocrinología Metabólica
**EndoMetabolic Rx • Functional Care (Medicina Funcional & Regenerativa)**  
*Versión de la Plataforma: 4.2.0-Production (2026)*

---

## TABLA DE CONTENIDO
1. [Introducción y Arquitectura Clínica](#1-introducción-y-arquitectura-clínica)
2. [Control de Acceso, Autenticación y Seguridad](#2-control-de-acceso-autenticación-y-seguridad)
3. [Módulo 1: Expediente del Paciente & Dashboard de Cohorte](#3-módulo-1-expediente-del-paciente--dashboard-de-cohorte)
4. [Módulo 2: Marco Fisiopatológico ATM & Matriz de los 7 Nodos](#4-módulo-2-marco-fisiopatológico-atm--matriz-de-los-7-nodos)
5. [Módulo 3: Calculadora de Índices Subrogados de Resistencia a la Insulina](#5-módulo-3-calculadora-de-índices-subrogados-de-resistencia-a-la-insulina)
6. [Módulo 4: Análisis de Curvas de Sobrecarga Oral a la Glucosa (Kraft OGTT)](#6-módulo-4-análisis-de-curvas-de-sobrecarga-oral-a-la-glucosa-kraft-ogtt)
7. [Módulo 5: CDSS, Atribución SHAP & Estratificación de Riesgo](#7-módulo-5-cdss-atribución-shap--estratificación-de-riesgo)
8. [Módulo 6: Matriz Terapéutica & Protocolos Funcionales](#8-módulo-6-matriz-terapéutica--protocolos-funcionales)
9. [Módulo 7: Monitoreo Continuo (CGM) & Ecosistema Interoperable HL7 FHIR R4](#9-módulo-7-monitoreo-continuo-cgm--ecosistema-interoperable-hl7-fhir-r4)
10. [Módulo 8: Configuración del Equipo Médico, Firmas Digitales y Exportación PDF](#10-módulo-8-configuración-del-equipo-médico-firmas-digitales-y-exportación-pdf)
11. [Glosario Oficial de Acrónimos y Abreviaturas](#11-glosario-oficial-de-acrónimos-y-abreviaturas)

---

## 1. INTRODUCCIÓN Y ARQUITECTURA CLÍNICA

**EndoMetabolic Rx** es una plataforma clínica de vanguardia diseñada para especialistas en Medicina Funcional, Endocrinología Metabólica y Medicina Regenerativa. Integra modelos predictivos de Machine Learning (XGBoost SHAP), calculadoras de índices subrogados de sensibilidad a la insulina, análisis dinámico de curvas Kraft OGTT y conectividad con estándares internacionales de salud **HL7 FHIR R4**.

### Objetivos Clínicos del Sistema:
- **Detección Precoz:** Identificar fenotipos hiperinsulinémicos y resistencia a la insulina oculta antes de la elevación de la glucemia basal o la HbA1c.
- **Abordaje de Causa Raíz:** Mapear la interconexión fisiopatológica del paciente mediante la matriz ATM (Antecedentes, Gatilladores, Mediadores) y los 7 sistemas biológicos.
- **Personalización Terapéutica:** Diseñar intervenciones funcionales basadas en crononutrición, restauración de barrera intestinal (5R), ejercicio en Zona 2 mitocondrial y nutracéuticos de precisión.
- **Seguridad e Interoperabilidad:** Garantizar la trazabilidad de datos médicos y firma digitalizada bajo estándares HIPAA y FHIR R4.

---

## 2. CONTROL DE ACCESO, AUTENTICACIÓN Y SEGURIDAD

### 2.1. Regla de Construcción Automática del Usuario Clínico (3 + 2 + 2)
El sistema genera el identificador de acceso (*login*) de manera automática a partir del nombre completo del especialista:

$$\text{Usuario} = \text{3 primeras letras del Nombre} + \text{2 primeras letras del 1er Apellido} + \text{2 primeras letras del 2do Apellido}$$

*Ejemplos:*
- **Dr. Mauricio Suaza Gutiérrez** $\rightarrow$ `mau` + `su` + `gu` = **`mausugu`**
- **Dra. Sofía Elena Restrepo Gómez** $\rightarrow$ `sof` + `re` + `go` = **`sofrego`**

### 2.2. Política de Seguridad y Cambio Obligatorio de Contraseña
Al iniciar sesión por primera vez con la clave temporal institucional (`M77`), el sistema intercepta la sesión exigiendo el cambio inmediato.

**Requisitos Mandatorios:**
1. **Longitud:** Mínimo 8 caracteres.
2. **Números:** Al menos un dígito (`0-9`).
3. **Mayúsculas:** Al menos una letra mayúscula (`A-Z`).
4. **Carácter Especial:** Al menos un símbolo (`&%$#"!&/()=?`, `@`, `*`, `_`, `-`, `.`).
5. **Confirmación:** Repetición exacta de la nueva contraseña.

### 2.3. Controles de Sesión
- **Botón "Cerrar Sesión":** Disponible en la esquina superior derecha de la barra principal y en el panel lateral.
- **Botón "Clave":** Permite al especialista actualizar su contraseña personal en cualquier momento.

---

## 3. MÓDULO 1: EXPEDIENTE DEL PACIENTE & DASHBOARD DE COHORTE

El módulo **Pacientes & Dashboard** permite la gestión integral de la cohorte clínica:

- **Búsqueda y Filtro:** Filtrado instantáneo por Nombre, Número de Historia Clínica (MRN), Estrato Metabólico o Médico Asignado.
- **Registro de Paciente (+ Nuevo Paciente):** Captura de datos demográficos, antecedentes personales/familiares, diagnóstico principal y protocolo en curso.
- **Evoluciones Clínicas Longitudinales (+ Nueva Evolución):** Registro de controles periódicos con signos vitales, horas de ayuno, analítica de laboratorio y recálculo automático de estratos.
- **Exportación de Informe Clínico Certificado (PDF):** Generación de reportes ejecutivos en PDF de alta fidelidad con membrete institucional, gráficos y firma digital del especialista.

---

## 4. MÓDULO 2: MARCO FISIOPATOLÓGICO ATM & MATRIZ DE LOS 7 NODOS

Estructura el caso clínico bajo el estándar del *Institute for Functional Medicine (IFM)*:

### 4.1. Tríada ATM
- **Antecedentes (A):** Factores genéticos, perinatales, familiares y exposoma temprano predisponente.
- **Gatilladores / Triggers (T):** Eventos detonantes que activan la disfunción (infecciones, trauma, duelo agudo, toxinas, fármacos).
- **Mediadores (M):** Factores biológicos y conductuales que perpetúan el estado inflamatorio crónico (citocinas, estrés oxidativo, disbiósis, insomnio).

### 4.2. Los 7 Nodos de la Matriz Funcional
1. **Asimilación:** Digestión, absorción, microbiota gastrointestinal y permeabilidad de la barrera mucosa.
2. **Defensa e Inmunidad:** Inflamación sistémica, reactividad inmunitaria, autoinmunidad e infecciones crónicas latentes.
3. **Energía:** Función mitocondrial, fosforilación oxidativa y producción de ATP.
4. **Biotransformación y Eliminación:** Desintoxicación hepática (Fase I y II), función biliar y excreción renal/colónica.
5. **Comunicación:** Ejes neuroendocrinos (tiroideo, suprarrenal, gonadal, insulínico) y neurotransmisores.
6. **Transporte:** Sistema cardiovascular, microcirculación, flujo linfático y transporte transmembrana.
7. **Integridad Estructural:** Membranas celulares, fascia, citoesqueleto y matriz extracelular.

---

## 5. MÓDULO 3: CALCULADORA DE ÍNDICES SUBROGADOS DE RESISTENCIA A LA INSULINA

Calcula en tiempo real biomarcadores validados internacionalmente a partir de la química sanguínea convencional:

| Índice | Fórmula Clínica | Rango Óptimo Funcional | Umbral de Fricción |
| :--- | :--- | :--- | :--- |
| **HOMA-IR** | $\frac{\text{Glucosa} (\text{mg/dL}) \times \text{Insulina} (\mu\text{IU/mL})}{405}$ | $< 1.5$ | $\ge 2.0$ (Severo $\ge 3.0$) |
| **QUICKI** | $\frac{1}{\log(\text{Glucosa}) + \log(\text{Insulina})}$ | $> 0.38$ | $< 0.33$ |
| **TyG Index** | $\ln\left(\frac{\text{Triglicéridos} \times \text{Glucosa}}{2}\right)$ | $< 8.0$ | $\ge 8.5$ |
| **TyG-BMI** | $\text{TyG} \times \text{IMC} (\text{kg/m}^2)$ | $< 180$ | $\ge 215$ |
| **METS-IR** | $\frac{\ln(2 \times \text{Glucosa} + \text{Triglicéridos}) \times \text{IMC}}{\ln(\text{HDL})}$ | $< 35.0$ | $\ge 45.0$ |
| **Ratio TG/HDL** | $\frac{\text{Triglicéridos}}{\text{HDL}}$ | $< 1.5$ | $\ge 2.5$ |
| **LAP** (Hombres) | $(\text{Cintura} - 65) \times \text{TG} \times 0.011$ | $< 25$ | $\ge 45$ |
| **LAP** (Mujeres) | $(\text{Cintura} - 58) \times \text{TG} \times 0.011$ | $< 20$ | $\ge 38$ |
| **FLI** | Ecuación logística basada en TG, GGT, IMC y Cintura | $< 30$ | $\ge 60$ (Riesgo de Esteatosis) |

---

## 6. MÓDULO 4: ANÁLISIS DE CURVAS DE SOBRECARGA ORAL A LA GLUCOSA (KRAFT OGTT)

El análisis del Dr. Joseph R. Kraft evalúa la curva de respuesta de insulina tras una sobrecarga de 75 g de glucosa a los 0, 30, 60, 120 y 180 minutos:

- **Patrón Kraft I (Curva Euinsulinémica Óptima):** Insulina basal $< 10\,\mu\text{IU/mL}$, pico a los 30-60 min $< 60\,\mu\text{IU/mL}$, retorno veloz a $< 30\,\mu\text{IU/mL}$ a las 2h y nivel basal a las 3h.
- **Patrón Kraft II (Hiperinsulinemia Retardada Tipo A):** Pico máximo desplazado a los 120 min, retraso en el aclaramiento.
- **Patrón Kraft III-A / III-B (Hiperinsulinemia Retardada Severa):** Pico a los 120 o 180 min con niveles sostenidos $> 50\,\mu\text{IU/mL}$.
- **Patrón Kraft IV (Hiperinsulinemia Basal / Resistencia Crónica):** Insulina basal $> 25\,\mu\text{IU/mL}$ con curva marcadamente aplanada o desproporcionada.
- **Patrón Kraft V (Hipoinsulinismo / Agotamiento de Células Beta):** Incapacidad secretora de insulina, indicativo de progresión a falla pancreática endócrina.

---

## 7. MÓDULO 5: CDSS, ATRIBUCIÓN SHAP & ESTRATIFICACIÓN DE RIESGO

El motor CDSS (*Clinical Decision Support System*) utiliza un ensamble **XGBoost** con explicabilidad **SHAP** (*SHapley Additive exPlanations*):

### Estratificación Metabólica Funcional:
- **Estrato 0 (Flexibilidad Metabólica Óptima):** Sin resistencia a la insulina ni inflamación subclínica.
- **Estrato 1 (Fricción Metabólica Temprana):** Hiperinsulinemia compensatoria con glucemias normales.
- **Estrato 2 (Resistencia a la Insulina Establecida & Disfunción Mitocondrial):** Elevación de HOMA-IR, TyG y esteatosis subclínica.
- **Estrato 3 (Disfunción Cardiometabólica Avanzada & Fricción Multiorgánica):** Riesgo vascular alto, esteatohepatitis y agotamiento insulínico.

---

## 8. MÓDULO 6: MATRIZ TERAPÉUTICA & PROTOCOLOS FUNCIONALES

Integra las intervenciones terapéuticas estructuradas:
1. **Protocolo 5R de Restauración Digestiva:**
   - *Remove (Remover):* Patógenos, alérgenos y alimentos proinflamatorios.
   - *Replace (Reemplazar):* Ácido clorhídrico, enzimas digestivas y sales biliares.
   - *Reinoculate (Reopular):* Probióticos y prebióticos específicos.
   - *Repair (Reparar):* L-Glutamina, zinc-carnosina, quercetina y omega-3.
   - *Rebalance (Reequilibrar):* Higiene de vida, modulación vagal y ritmos circadianos.
2. **Entrenamiento en Zona 2 Mitocondrial:** Estímulo de biogénesis mitocondrial y aclaramiento de lactato.
3. **Crononutrición & Ventana de Alimentación Restringida (TRE):** Optimización de la sensibilidad insulínica circadiana.

---

## 9. MÓDULO 7: MONITOREO CONTINUO (CGM) & ECOSISTEMA HL7 FHIR R4

Permite la ingesta y análisis de telemetría de sensores CGM (FreeStyle Libre, Dexcom) con métricas estandarizadas:
- **TIR (Time in Range 70-140 mg/dL):** Meta funcional $\ge 85\%$.
- **TAR (Time Above Range > 140 mg/dL):** Meta funcional $< 10\%$.
- **TBR (Time Below Range < 70 mg/dL):** Meta $< 4\%$.
- **CV (Coeficiente de Variabilidad Glucémica):** Meta funcional $< 20\%$.

### Recursos FHIR R4 Compatibles:
- `DiagnosticReport`: Informes de pruebas de laboratorio y curvas OGTT.
- `Observation`: Biomarcadores individuales (glucosa, insulina, HOMA-IR, triglicéridos).
- `Patient`: Demografía y trazabilidad del expediente.
- `Practitioner`: Identificación y licencia del especialista firmante.

---

## 10. MÓDULO 8: CONFIGURACIÓN DEL EQUIPO MÉDICO & FIRMAS DIGITALES

- **Gestión de Especialistas:** Registro de nombres, especialidades, instituciones y matrículas médicas.
- **Firmas Digitalizadas:** Carga de firma escaneada o dibujo táctil en pantalla de alta resolución.
- **Parametrización de Credenciales:** Asignación de usuario `@login`, contraseña y rol (*Super Administrador*, *Administrador*, *Especialista*).

---

## 11. GLOSARIO OFICIAL DE ACRÓNIMOS Y ABREVIATURAS

### A
- **ADA:** *American Diabetes Association* (Asociación Americana de Diabetes).
- **ALT:** Alanina Aminotransferasa (Enzima hepática, también conocida como GPT).
- **AST:** Aspartato Aminotransferasa (Enzima hepática, también conocida como GOT).
- **ATM:** Antecedentes, Gatilladores (*Triggers*), Mediadores (*Mediators*) en Medicina Funcional.
- **ATP:** Adenosín Trifosfato (Moneda energética celular producida por la mitocondria).
- **AUC:** *Area Under the Curve* (Área Bajo la Curva en cinética farmacológica y curvas OGTT).

### B
- **BMI / IMC:** *Body Mass Index* / Índice de Masa Corporal ($\text{kg/m}^2$).
- **BP / PA:** *Blood Pressure* / Presión Arterial ($\text{mmHg}$).

### C
- **CDSS:** *Clinical Decision Support System* (Sistema de Soporte a Decisiones Clínicas).
- **CGM:** *Continuous Glucose Monitoring* (Monitoreo Continuo de Glucosa intersticial).
- **CV:** Coeficiente de Variabilidad Glucémica ($\text{Desviación Estándar} / \text{Media} \times 100$).

### D
- **DASH:** *Dietary Approaches to Stop Hypertension* (Enfoque dietario antihipertensivo).
- **DHEA-S:** Dehidroepiandrosterona Sulfato (Marcador suprarrenal).

### F
- **FHIR:** *Fast Healthcare Interoperability Resources* (Estándar internacional HL7 de interoperabilidad en salud).
- **FLI:** *Fatty Liver Index* (Índice de Hígado Graso para predicción de esteatosis hepática no alcohólica).

### G
- **GGT:** Gamma-Glutamil Transferasa (Marcador enzimático de colestasis, estrés oxidativo y riesgo metabólico).
- **GIR:** *Glucose-to-Insulin Ratio* (Ratio Glucosa/Insulina).
- **GLP-1:** *Glucagon-Like Peptide-1* (Péptido similar al glucagón tipo 1).

### H
- **HbA1c:** Hemoglobina Glicosilada (Promedio de glucemia de los últimos 90-120 días).
- **HDL:** *High-Density Lipoprotein* (Lipoproteínas de alta densidad).
- **HIPAA:** *Health Insurance Portability and Accountability Act* (Ley de privacidad y seguridad médica).
- **HOMA-IR:** *Homeostatic Model Assessment of Insulin Resistance* (Evaluación del Modelo Homeostático de Resistencia a la Insulina).
- **hs-CRP / PCR-us:** *High-Sensitivity C-Reactive Protein* / Proteína C Reactiva Ultrasensible (Marcador de inflamación endotelial).

### I
- **IFM:** *Institute for Functional Medicine* (Instituto de Medicina Funcional de EE. UU.).
- **IFMCP:** *Institute for Functional Medicine Certified Practitioner* (Especialista Certificado por el IFM).

### K
- **Kraft OGTT:** Prueba de tolerancia a la glucosa oral con medición seriada de insulina descrita por el Dr. Joseph R. Kraft.

### L
- **LAP:** *Lipid Accumulation Product* (Producto de Acumulación Lipídica basado en triglicéridos y perímetro de cintura).
- **LDL:** *Low-Density Lipoprotein* (Lipoproteínas de baja densidad).

### M
- **METS-IR:** *Metabolic Score for Insulin Resistance* (Puntuación Metabólica para Resistencia a la Insulina).
- **MRN:** *Medical Record Number* (Número de Historia Clínica / Expediente del Paciente).
- **MSc:** *Master of Science* (Magíster en Ciencias).

### N
- **NAFLD / MASLD:** *Metabolic dysfunction-Associated Steatotic Liver Disease* (Enfermedad Hepática Esteatósica Metabólica).

### O
- **OGTT / PTOG:** *Oral Glucose Tolerance Test* / Prueba de Tolerancia Oral a la Glucosa (Sobrecarga de 75 g).

### Q
- **QUICKI:** *Quantitative Insulin Sensitivity Check Index* (Índice Cuantitativo de Sensibilidad a la Insulina).

### R
- **RLS:** *Row Level Security* (Seguridad a Nivel de Fila en bases de datos PostgreSQL / Supabase).
- **ROS:** *Reactive Oxygen Species* (Especies Reactivas de Oxígeno / Estrés Oxidativo).

### S
- **SHAP:** *SHapley Additive exPlanations* (Algoritmo de teoría de juegos para explicabilidad e interpretabilidad de Inteligencia Artificial).
- **SPA:** *Single Page Application* (Aplicación Web de Página Única).

### T
- **TAR:** *Time Above Range* (Tiempo sobre el Rango Glucémico $> 140\,\text{mg/dL}$).
- **TBR:** *Time Below Range* (Tiempo bajo el Rango Glucémico $< 70\,\text{mg/dL}$).
- **TG:** Triglicéridos séricos.
- **TIR:** *Time In Range* (Tiempo en Rango Glucémico Óptimo $70-140\,\text{mg/dL}$).
- **TP / RM:** Tarjeta Profesional / Registro Médico del Especialista.
- **TRE:** *Time-Restricted Eating* (Ventana de Alimentación Restringida en el Tiempo).
- **TyG:** *Triglyceride-Glucose Index* (Índice Triglicéridos-Glucosa).
- **TyG-BMI:** Índice Triglicéridos-Glucosa ajustado por Índice de Masa Corporal.

### V
- **VAI:** *Visceral Adiposity Index* (Índice de Adiposidad Visceral).
- **VLDL:** *Very Low-Density Lipoprotein* (Lipoproteínas de muy baja densidad).

### X
- **XGBoost:** *eXtreme Gradient Boosting* (Algoritmo de aprendizaje automático de árboles de decisión potenciados).
