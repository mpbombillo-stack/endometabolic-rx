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
