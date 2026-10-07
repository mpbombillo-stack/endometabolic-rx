/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';
import { PatientProfile, MedicalProfessional, PatientEvolution } from '../types';
import { generateClinicalUsername, getCredentialFromVault, saveCredentialToVault } from '../utils/authUtils';

export async function fetchProfessionalsFromCloud(): Promise<MedicalProfessional[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('medical_professionals')
      .select('*')
      .order('is_primary', { ascending: false });

    if (error) {
      console.warn('[Supabase] Error fetching professionals:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map((doc: any) => {
        const isPrimaryDoc = doc.is_primary || doc.id === 'doc-1';
        const defaultName = isPrimaryDoc ? 'Dr. Mauricio Suaza Gutiérrez, MD, IFMCP' : doc.full_name;
        const defaultUsername = isPrimaryDoc ? 'mausugu' : (doc.username || generateClinicalUsername(doc.full_name) || 'usuario');
        const defaultPassword = isPrimaryDoc ? 'M77' : '123456';

        // Recuperar credencial asegurada del vault local si existe
        const vaultCred = getCredentialFromVault(doc.id, defaultUsername);

        return {
          id: doc.id,
          fullName: vaultCred?.fullName || defaultName,
          title: doc.title,
          specialty: doc.specialty,
          licenseNumber: doc.license_number,
          institution: doc.institution,
          email: doc.email,
          phone: doc.phone,
          signatureUrl: doc.signature_url,
          isPrimary: isPrimaryDoc,
          registeredAt: doc.registered_at,
          username: vaultCred?.username || defaultUsername,
          password: vaultCred?.password || doc.password || defaultPassword,
          role: (vaultCred?.role || doc.role || (isPrimaryDoc ? 'superadmin' : 'doctor')) as any,
          mustChangePassword: vaultCred?.mustChangePassword !== undefined
            ? vaultCred.mustChangePassword
            : (doc.must_change_password ?? (doc.password === '123456' || doc.password === 'M77' || !isPrimaryDoc)),
        };
      });
    }
  } catch (e) {
    console.warn('[Supabase] Fetch error:', e);
  }
  return null;
}

export async function saveProfessionalToCloud(doc: MedicalProfessional): Promise<boolean> {
  // Asegurar siempre en el vault local inmediatamente
  saveCredentialToVault(doc.id, {
    username: doc.username,
    password: doc.password,
    mustChangePassword: doc.mustChangePassword,
    role: doc.role,
    fullName: doc.fullName,
  });

  if (!isSupabaseConfigured || !supabase) return true;

  try {
    // 1. Intentar upsert completo con campos de credenciales y roles
    const { error } = await supabase.from('medical_professionals').upsert({
      id: doc.id,
      full_name: doc.fullName,
      title: doc.title,
      specialty: doc.specialty,
      license_number: doc.licenseNumber,
      institution: doc.institution,
      email: doc.email,
      phone: doc.phone,
      signature_url: doc.signatureUrl,
      is_primary: doc.isPrimary,
      registered_at: doc.registeredAt,
      username: doc.username,
      password: doc.password,
      role: doc.role,
      must_change_password: doc.mustChangePassword,
    });

    if (!error) return true;

    // 2. Si falló por falta de columnas en Supabase (ej. error de esquema cache), reintentar con columnas base
    console.warn('[Supabase] Guardado con campos avanzados no disponible en el esquema actual, reintentando con columnas base:', error.message);
    const { error: coreError } = await supabase.from('medical_professionals').upsert({
      id: doc.id,
      full_name: doc.fullName,
      title: doc.title,
      specialty: doc.specialty,
      license_number: doc.licenseNumber,
      institution: doc.institution,
      email: doc.email,
      phone: doc.phone,
      signature_url: doc.signatureUrl,
      is_primary: doc.isPrimary,
      registered_at: doc.registeredAt,
    });

    if (coreError) {
      console.warn('[Supabase] Error en guardado base:', coreError.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[Supabase] Excepción en guardado:', e);
    return false;
  }
}

export async function fetchPatientsFromCloud(): Promise<PatientProfile[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data: patientsData, error: pError } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });

    if (pError || !patientsData || patientsData.length === 0) {
      return null;
    }

    const { data: evoData } = await supabase
      .from('patient_evolutions')
      .select('*')
      .order('date', { ascending: true });

    const evolutionsMap: Record<string, PatientEvolution[]> = {};
    if (evoData) {
      evoData.forEach((evo: any) => {
        if (!evolutionsMap[evo.patient_id]) {
          evolutionsMap[evo.patient_id] = [];
        }
        evolutionsMap[evo.patient_id].push({
          id: evo.id,
          date: evo.date,
          reason: evo.reason,
          fastingHours: evo.fasting_hours,
          clinicalNotes: evo.clinical_notes || '',
          vitalSigns: evo.vital_signs,
          labs: evo.labs,
          surrogates: evo.surrogates,
          stratum: evo.stratum,
          stratumStatus: evo.stratum_status,
          activeProtocol: evo.active_protocol,
          professionalId: evo.professional_id,
          professionalName: evo.professional_name,
        });
      });
    }

    return patientsData.map((p: any) => ({
      id: p.id,
      mrn: p.mrn,
      fullName: p.full_name,
      age: p.age,
      birthDate: p.birth_date || '1984-05-12',
      sex: p.sex,
      phone: p.phone || '',
      email: p.email || '',
      occupation: p.occupation || '',
      registeredAt: p.registered_at || p.created_at || new Date().toISOString(),
      primaryDiagnosis: p.primary_diagnosis,
      currentProtocol: p.current_protocol,
      antecedents: p.antecedents || [],
      triggers: p.triggers || [],
      mediators: p.mediators || [],
      evolutionHistory: evolutionsMap[p.id] || [],
      assignedDoctorId: p.assigned_doctor_id || 'doc-1',
    }));
  } catch (e) {
    console.warn('[Supabase] Fetch patients error:', e);
    return null;
  }
}

export async function savePatientToCloud(patient: PatientProfile): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    const { error: pError } = await supabase.from('patients').upsert({
      id: patient.id,
      mrn: patient.mrn,
      full_name: patient.fullName,
      age: patient.age,
      birth_date: patient.birthDate,
      sex: patient.sex,
      occupation: patient.occupation,
      phone: patient.phone,
      email: patient.email,
      primary_diagnosis: patient.primaryDiagnosis,
      current_protocol: patient.currentProtocol,
      antecedents: patient.antecedents,
      triggers: patient.triggers,
      mediators: patient.mediators,
      assigned_doctor_id: patient.assignedDoctorId,
      registered_at: patient.registeredAt,
      updated_at: new Date().toISOString(),
    });

    if (pError) {
      console.warn('[Supabase] Upsert patient error:', pError.message);
      return false;
    }

    // Upsert evolutions
    if (patient.evolutionHistory && patient.evolutionHistory.length > 0) {
      const rows = patient.evolutionHistory.map((evo) => ({
        id: evo.id,
        patient_id: patient.id,
        date: evo.date,
        reason: evo.reason,
        fasting_hours: evo.fastingHours,
        clinical_notes: evo.clinicalNotes,
        vital_signs: evo.vitalSigns,
        labs: evo.labs,
        surrogates: evo.surrogates,
        stratum: evo.stratum,
        stratum_status: evo.stratumStatus,
        active_protocol: evo.activeProtocol,
        professional_id: evo.professionalId,
        professional_name: evo.professionalName,
      }));

      await supabase.from('patient_evolutions').upsert(rows);
    }

    return true;
  } catch (e) {
    console.warn('[Supabase] Save error:', e);
    return false;
  }
}
