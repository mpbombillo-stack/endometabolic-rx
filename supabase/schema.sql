-- ==========================================================
-- ENDOMETABOLIC RX & FUNCTIONAL CARE - SUPABASE DATABASE SCHEMA
-- ==========================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: PROFESIONALES MÉDICOS Y FIRMAS
CREATE TABLE IF NOT EXISTS public.medical_professionals (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    title TEXT NOT NULL,
    specialty TEXT NOT NULL,
    license_number TEXT NOT NULL,
    institution TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    signature_url TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLA: EXPEDIENTE DE PACIENTES
CREATE TABLE IF NOT EXISTS public.patients (
    id TEXT PRIMARY KEY,
    mrn TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    age INTEGER NOT NULL,
    birth_date DATE DEFAULT '1984-05-12' NOT NULL,
    sex TEXT CHECK (sex IN ('female', 'male')) NOT NULL,
    occupation TEXT,
    phone TEXT,
    email TEXT,
    primary_diagnosis TEXT NOT NULL,
    current_protocol TEXT NOT NULL,
    antecedents JSONB DEFAULT '[]'::jsonb NOT NULL,
    triggers JSONB DEFAULT '[]'::jsonb NOT NULL,
    mediators JSONB DEFAULT '[]'::jsonb NOT NULL,
    assigned_doctor_id TEXT REFERENCES public.medical_professionals(id) ON DELETE SET NULL,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLA: EVOLUCIONES CLÍNICAS Y BIOMARCADORES LONGITUDINALES
CREATE TABLE IF NOT EXISTS public.patient_evolutions (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    reason TEXT NOT NULL,
    fasting_hours NUMERIC DEFAULT 12,
    clinical_notes TEXT,
    vital_signs JSONB NOT NULL,
    labs JSONB NOT NULL,
    surrogates JSONB NOT NULL,
    stratum TEXT NOT NULL,
    stratum_status TEXT NOT NULL,
    active_protocol TEXT NOT NULL,
    professional_id TEXT REFERENCES public.medical_professionals(id) ON DELETE SET NULL,
    professional_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.medical_professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_evolutions ENABLE ROW LEVEL SECURITY;

-- 6. POLÍTICAS DE ACCESO PÚBLICO / AUTENTICADO
CREATE POLICY "Permitir lectura completa de profesionales"
ON public.medical_professionals FOR SELECT USING (true);

CREATE POLICY "Permitir insercion/actualizacion de profesionales"
ON public.medical_professionals FOR ALL USING (true);

CREATE POLICY "Permitir lectura completa de pacientes"
ON public.patients FOR SELECT USING (true);

CREATE POLICY "Permitir insercion/actualizacion de pacientes"
ON public.patients FOR ALL USING (true);

CREATE POLICY "Permitir lectura completa de evoluciones"
ON public.patient_evolutions FOR SELECT USING (true);

CREATE POLICY "Permitir insercion/actualizacion de evoluciones"
ON public.patient_evolutions FOR ALL USING (true);

-- 7. ÍNDICES DE RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_patients_mrn ON public.patients(mrn);
CREATE INDEX IF NOT EXISTS idx_evolutions_patient_id ON public.patient_evolutions(patient_id);
CREATE INDEX IF NOT EXISTS idx_evolutions_date ON public.patient_evolutions(date DESC);

-- 8. DATOS SEMILLA INICIALES (PROFESIONALES)
INSERT INTO public.medical_professionals (id, full_name, title, specialty, license_number, institution, email, phone, is_primary)
VALUES 
  ('doc-1', 'Dr. Mauricio Thorne, MD, IFMCP', 'Médico Especialista en Medicina Funcional y Regenerativa', 'Endocrinología Metabólica & Longevidad Saludable', 'RM-84920-COL', 'Functional Care Institute & Metabolic Center', 'm.thorne@functionalcare.med', '+57 (310) 849-2041', true),
  ('doc-2', 'Dra. Sofía Restrepo, MD, MSc', 'Especialista en Nutrición Clínica & Medicina Integrativa', 'Gastroenterología Funcional & Microbiota', 'RM-93114-COL', 'Functional Care Institute', 's.restrepo@functionalcare.med', '+57 (315) 772-9901', false)
ON CONFLICT (id) DO NOTHING;
