/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Regla de construcción automática de identificador de usuario clínico:
 * - 3 primeras letras del Nombre (Nombre de pila)
 * - 2 primeras letras del Primer Apellido
 * - 2 primeras letras del Segundo Apellido
 *
 * Ejemplo: Mauricio Suaza Gutiérrez -> "mau" + "su" + "gu" = "mausugu"
 */
export function generateClinicalUsername(fullName: string): string {
  if (!fullName || !fullName.trim()) return '';

  // 1. Limpiar prefijos médicos, títulos y grados honoríficos
  const clean = fullName
    .replace(/\b(dr|dra|doctor|doctora|md|msc|phd|ifmcp|lic|ing|esp|mg|prof)\b\.?/gi, '')
    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
    .trim();

  // 2. Normalizar tildes y caracteres diacríticos a minúsculas
  const normalized = clean
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  // 3. Separar en palabras
  const parts = normalized.split(/\s+/).filter(Boolean);

  if (parts.length === 0) return '';

  if (parts.length === 1) {
    return parts[0].slice(0, 7);
  }

  if (parts.length === 2) {
    // 3 letras del nombre + 2 letras del apellido + siguientes 2 letras si están disponibles
    const namePart = parts[0].slice(0, 3);
    const sur1 = parts[1].slice(0, 2);
    const sur2 = parts[1].length >= 4 ? parts[1].slice(2, 4) : parts[1].slice(0, 2);
    return `${namePart}${sur1}${sur2}`;
  }

  // 3 o más palabras (ej. [Nombre 1, Nombre 2, Apellido 1, Apellido 2] o [Nombre, Apellido 1, Apellido 2])
  // - 3 letras del primer nombre
  // - 2 letras del primer apellido (penúltima palabra)
  // - 2 letras del segundo apellido (última palabra)
  const firstName = parts[0].slice(0, 3);
  const firstSurname = parts[parts.length - 2].slice(0, 2);
  const secondSurname = parts[parts.length - 1].slice(0, 2);

  return `${firstName}${firstSurname}${secondSurname}`;
}

export interface PasswordPolicyResult {
  isValid: boolean;
  hasMinLength: boolean;
  hasNumber: boolean;
  hasUppercase: boolean;
  hasSpecialChar: boolean;
  strengthScore: number; // 0 to 4
  strengthLabel: 'Muy Débil' | 'Débil' | 'Aceptable' | 'Robusta' | 'Excelente';
}

/**
 * Valida que la contraseña cumpla los requisitos de seguridad clínica:
 * 1. Mínimo 8 caracteres
 * 2. Al menos un número (0-9)
 * 3. Al menos una letra mayúscula (A-Z)
 * 4. Al menos un carácter especial (&%$#"!&/()=?, etc.)
 */
export function validatePasswordPolicy(password: string): PasswordPolicyResult {
  const p = password || '';
  const hasMinLength = p.length >= 8;
  const hasNumber = /[0-9]/.test(p);
  const hasUppercase = /[A-Z]/.test(p);
  // Caracteres especiales requeridos: &%$#"!&/()=? y símbolos auxiliares
  const hasSpecialChar = /[&%$#"!\/()=?@_*\-+\.,:;~^<>{}[\]|\\]/.test(p);

  const checks = [hasMinLength, hasNumber, hasUppercase, hasSpecialChar];
  const passedCount = checks.filter(Boolean).length;

  const isValid = hasMinLength && hasNumber && hasUppercase && hasSpecialChar;

  let strengthLabel: PasswordPolicyResult['strengthLabel'] = 'Muy Débil';
  if (passedCount === 4 && p.length >= 10) {
    strengthLabel = 'Excelente';
  } else if (passedCount === 4) {
    strengthLabel = 'Robusta';
  } else if (passedCount === 3) {
    strengthLabel = 'Aceptable';
  } else if (passedCount >= 1) {
    strengthLabel = 'Débil';
  }

  return {
    isValid,
    hasMinLength,
    hasNumber,
    hasUppercase,
    hasSpecialChar,
    strengthScore: passedCount,
    strengthLabel,
  };
}

/**
 * Determina si el usuario debe cambiar su contraseña obligatoriamente:
 * - Si tiene la bandera mustChangePassword activa
 * - O si tiene la clave temporal predeterminada 'M77'
 * - O si su clave actual no cumple la política de seguridad mínima de 8 caracteres
 */
export function isMustChangePassword(professional?: { password?: string; mustChangePassword?: boolean } | null): boolean {
  if (!professional) return false;
  if (professional.mustChangePassword === true) return true;
  if (!professional.password || professional.password === 'M77') return true;
  const policy = validatePasswordPolicy(professional.password);
  return !policy.isValid;
}

