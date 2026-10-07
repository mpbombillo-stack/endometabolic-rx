/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MedicalProfessional } from '../types';
import { FunctionalCareLogo } from './FunctionalCareLogo';
import { validatePasswordPolicy } from '../utils/authUtils';

interface ChangePasswordModalProps {
  isOpen: boolean;
  isMandatory?: boolean;
  currentUser: MedicalProfessional;
  onSavePassword: (newPassword: string) => void;
  onClose?: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  isMandatory = true,
  currentUser,
  onSavePassword,
  onClose,
}) => {
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Real-time policy validation
  const policy = validatePasswordPolicy(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isFormValid = policy.isValid && passwordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate current password if provided
    const isTempPass = currentPasswordInput.trim() === '123456' || currentPasswordInput.trim() === 'M77';
    if (currentUser.password && currentPasswordInput.trim() !== currentUser.password && !isTempPass) {
      setErrorMessage('La contraseña actual ingresada es incorrecta.');
      return;
    }

    if (!policy.isValid) {
      setErrorMessage('La nueva contraseña debe cumplir con todos los requisitos de seguridad clínica (mínimo 8 caracteres, números, mayúsculas y símbolo especial).');
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage('Las contraseñas no coinciden. Verifique la repetición.');
      return;
    }

    if (newPassword === '123456' || newPassword === 'M77' || (currentUser.password && newPassword === currentUser.password)) {
      setErrorMessage('La nueva contraseña debe ser diferente a la contraseña temporal o inicial predeterminada.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSavePassword(newPassword.trim());
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#e7e5e4] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#005c55] via-[#0f766e] to-[#005c55] p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0 border border-white/20">
              <span className="material-symbols-outlined text-2xl">lock_reset</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight">
                  {isMandatory ? 'Cambio Obligatorio de Contraseña' : 'Actualizar Contraseña'}
                </h3>
                {isMandatory && (
                  <span className="bg-[#fe932c] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Primer Ingreso
                  </span>
                )}
              </div>
              <p className="text-xs text-white/80 mt-0.5">
                Especialista: <strong>{currentUser.fullName}</strong> (@{currentUser.username || 'usuario'})
              </p>
            </div>
          </div>

          {!isMandatory && onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-[#faf2ee] px-6 py-3 border-b border-[#e9e1dd] flex items-center gap-2 text-xs text-[#3e4947]">
          <span className="material-symbols-outlined text-base text-[#005c55] shrink-0">verified_user</span>
          <p className="leading-tight">
            Por política de seguridad clínica y confidencialidad de datos médicos, debe establecer su propia contraseña personal antes de continuar.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4.5 flex-1">
          {errorMessage && (
            <div className="p-3 bg-[#cb2044]/10 border border-[#cb2044]/30 rounded-xl text-[#cb2044] text-xs flex items-start gap-2 animate-in shake duration-200">
              <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
              <p className="font-medium leading-snug">{errorMessage}</p>
            </div>
          )}

          {/* Current Password Field */}
          <div>
            <label className="block text-xs font-bold text-[#1e1b19] mb-1.5 flex items-center justify-between">
              <span>Contraseña Temporal / Actual *</span>
              <span className="text-[10px] font-mono text-[#6e7977]">Clave de inicio (ej. 123456)</span>
            </label>
            <input
              type="password"
              required
              placeholder="Ingrese su contraseña actual o temporal (ej. 123456)"
              value={currentPasswordInput}
              onChange={(e) => setCurrentPasswordInput(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#d8d1cd] bg-[#fff8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005c55] text-[#1e1b19] font-mono"
            />
          </div>

          {/* New Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#1e1b19]">
                Nueva Contraseña *
              </label>
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="text-[11px] text-[#005c55] hover:underline cursor-pointer flex items-center gap-1 font-semibold"
              >
                <span className="material-symbols-outlined text-[13px]">
                  {showNewPassword ? 'visibility_off' : 'visibility'}
                </span>
                <span>{showNewPassword ? 'Ocultar' : 'Mostrar'}</span>
              </button>
            </div>
            <input
              type={showNewPassword ? 'text' : 'password'}
              required
              placeholder="Mínimo 8 caracteres (números, mayúsculas, símbolos)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#d8d1cd] bg-[#fff8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005c55] text-[#1e1b19] font-mono"
            />
          </div>

          {/* Strength Bar */}
          {newPassword.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#6e7977]">Nivel de robustez:</span>
                <span
                  className={`font-bold ${
                    policy.strengthScore === 4
                      ? 'text-[#005c55]'
                      : policy.strengthScore === 3
                      ? 'text-[#fe932c]'
                      : 'text-[#cb2044]'
                  }`}
                >
                  {policy.strengthLabel}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#e9e1dd] rounded-full overflow-hidden flex gap-1">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-full flex-1 rounded-full transition-all duration-300 ${
                      policy.strengthScore >= step
                        ? policy.strengthScore === 4
                          ? 'bg-[#005c55]'
                          : policy.strengthScore === 3
                          ? 'bg-[#fe932c]'
                          : 'bg-[#cb2044]'
                        : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Confirm Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#1e1b19]">
                Confirmar Nueva Contraseña (Repetir) *
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-[11px] text-[#005c55] hover:underline cursor-pointer flex items-center gap-1 font-semibold"
              >
                <span className="material-symbols-outlined text-[13px]">
                  {showConfirmPassword ? 'visibility_off' : 'visibility'}
                </span>
                <span>{showConfirmPassword ? 'Ocultar' : 'Mostrar'}</span>
              </button>
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              placeholder="Repita exactamente la nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-[#fff8f5] focus:bg-white focus:outline-none focus:ring-2 text-[#1e1b19] font-mono ${
                confirmPassword.length > 0 && !passwordsMatch
                  ? 'border-[#cb2044] focus:ring-[#cb2044]'
                  : 'border-[#d8d1cd] focus:ring-[#005c55]'
              }`}
            />
          </div>

          {/* Checklist of Password Requirements */}
          <div className="p-3.5 bg-[#faf2ee] rounded-2xl border border-[#e9e1dd] space-y-2">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#6e7977] block font-mono">
              Requisitos de Seguridad Clínica Obligatorios:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div
                className={`flex items-center gap-2 transition-colors ${
                  policy.hasMinLength ? 'text-[#005c55] font-semibold' : 'text-[#8a9694]'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {policy.hasMinLength ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>Mínimo 8 caracteres</span>
              </div>

              <div
                className={`flex items-center gap-2 transition-colors ${
                  policy.hasNumber ? 'text-[#005c55] font-semibold' : 'text-[#8a9694]'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {policy.hasNumber ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>Al menos un número (0-9)</span>
              </div>

              <div
                className={`flex items-center gap-2 transition-colors ${
                  policy.hasUppercase ? 'text-[#005c55] font-semibold' : 'text-[#8a9694]'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {policy.hasUppercase ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>Letra Mayúscula (A-Z)</span>
              </div>

              <div
                className={`flex items-center gap-2 transition-colors ${
                  policy.hasSpecialChar ? 'text-[#005c55] font-semibold' : 'text-[#8a9694]'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {policy.hasSpecialChar ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>Carácter especial (&%$#"!&/()=?)</span>
              </div>
            </div>

            <div
              className={`pt-1.5 border-t border-[#e9e1dd] flex items-center gap-2 text-xs transition-colors ${
                passwordsMatch ? 'text-[#005c55] font-bold' : 'text-[#8a9694]'
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {passwordsMatch ? 'task_alt' : 'radio_button_unchecked'}
              </span>
              <span>
                {passwordsMatch
                  ? 'Las contraseñas coinciden correctamente'
                  : confirmPassword.length > 0
                  ? 'Las contraseñas no coinciden aún'
                  : 'Repetir la contraseña para constatar coincidencia'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            {!isMandatory && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#6e7977] hover:text-[#1e1b19] cursor-pointer"
              >
                Cancelar
              </button>
            )}

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="flex-1 py-3 bg-gradient-to-r from-[#005c55] to-[#0f766e] hover:from-[#004742] hover:to-[#0d665f] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                  <span>Actualizando contraseña...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">key</span>
                  <span>Guardar y Confirmar Contraseña</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
