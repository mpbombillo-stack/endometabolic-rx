-- ==========================================================
-- ENDOMETABOLIC RX & FUNCTIONAL CARE - SUPABASE DATABASE SCHEMA
-- ==========================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: PROFESIONALES MÉDICOS, CREDENCIALES Y FIRMAS
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
    username TEXT UNIQUE,
    password TEXT DEFAULT '123456',
    role TEXT DEFAULT 'doctor',
    must_change_password BOOLEAN DEFAULT TRUE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Asegurar columnas si la tabla ya existía previamente
ALTER TABLE public.medical_professionals ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.medical_professionals ADD COLUMN IF NOT EXISTS password TEXT DEFAULT '123456';
ALTER TABLE public.medical_professionals ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'doctor';
ALTER TABLE public.medical_professionals ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT TRUE;

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

-- 8. DATOS SEMILLA INICIALES (PROFESIONALES Y SUPER USUARIO CON REGLA 3+2+2)
INSERT INTO public.medical_professionals (id, full_name, title, specialty, license_number, institution, email, phone, is_primary, username, password, role)
VALUES 
  ('doc-1', 'Dr. Mauricio Suaza Gutiérrez, MD, IFMCP', 'Director Médico Especialista en Medicina Funcional y Regenerativa', 'Endocrinología Metabólica & Medicina de Precisión', 'TP-84920-MD', 'Functional Care Institute & Metabolic Center', 'm.suaza@functionalcare.med', '+57 (315) 890-4421', true, 'mausugu', 'M77', 'superadmin'),
  ('doc-2', 'Dra. Sofía Elena Restrepo Gómez, MD, MSc', 'Especialista en Nutrición Clínica Funcional e Inmunonutrición', 'Gastroenterología Funcional & Microbiota', 'TP-91340-MD', 'Functional Care Institute', 'srestrepo@functionalcare.com', '+57 (318) 722-9014', false, 'sofrego', 'M77', 'doctor')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  username = EXCLUDED.username,
  password = EXCLUDED.password,
  role = EXCLUDED.role;
