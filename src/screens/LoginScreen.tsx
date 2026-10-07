/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MedicalProfessional } from '../types';
import { FunctionalCareLogo } from '../components/FunctionalCareLogo';
import { generateClinicalUsername } from '../utils/authUtils';

interface LoginScreenProps {
  professionals: MedicalProfessional[];
  onLoginSuccess: (user: MedicalProfessional, remember: boolean) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ professionals, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const cleanUser = username.trim().toLowerCase();
      const cleanPass = password.trim();

      // Find professional by username, generated 3+2+2 username, or email
      const matchedUser = professionals.find((p) => {
        const genUser = generateClinicalUsername(p.fullName);
        const userMatch =
          (p.username && p.username.toLowerCase() === cleanUser) ||
          (genUser && genUser.toLowerCase() === cleanUser) ||
          p.email.toLowerCase() === cleanUser;

        const passMatch = p.password
          ? p.password === cleanPass
          : cleanPass === '123456' || cleanPass === 'M77';

        return userMatch && passMatch;
      });

      // Special fallback check for superuser / administrator
      const isSuperUser = (cleanUser === 'mausugu' || cleanUser === 'admin') && (cleanPass === '123456' || cleanPass === 'M77');

      if (matchedUser) {
        setIsLoading(false);
        const userWithUsername: MedicalProfessional = {
          ...matchedUser,
          username: matchedUser.username || generateClinicalUsername(matchedUser.fullName) || 'usuario',
        };
        onLoginSuccess(userWithUsername, rememberMe);
      } else if (isSuperUser && professionals.length > 0) {
        setIsLoading(false);
        const superProf = professionals.find((p) => p.username === 'mausugu') || professionals[0];
        onLoginSuccess(superProf, rememberMe);
      } else {
        setIsLoading(false);
        setErrorMessage('Credenciales inválidas. Verifique el usuario y la contraseña asignada en la configuración médica.');
      }
    }, 400);
  };


  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#003833] via-[#005c55] to-[#0a2e2b] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Ambient background decoration */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#2dd4bf]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#fe932c]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Top Decorative Bar */}
        <div className="h-2 bg-gradient-to-r from-[#005c55] via-[#2dd4bf] to-[#fe932c]" />

        <div className="p-8">
          {/* Logo & Clinical Branding */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="p-3 bg-[#faf2ee] rounded-2xl border border-[#e9e1dd] mb-3 shadow-inner">
              <FunctionalCareLogo variant="full" height={52} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#005c55]/10 rounded-full border border-[#005c55]/20 mt-1">
              <span className="w-2 h-2 rounded-full bg-[#005c55] animate-pulse" />
              <span className="text-[11px] font-bold text-[#005c55] tracking-tight font-mono">
                EndoMetabolic Rx • CDSS Portal
              </span>
            </div>

            <h2 className="text-xl font-bold text-[#1e1b19] mt-3 tracking-tight">
              Control de Acceso Clínico
            </h2>
            <p className="text-xs text-[#6e7977] mt-1 max-w-xs">
              Autenticación segura para especialistas tratantes y gestión de expedientes funcionales.
            </p>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-[#cb2044]/10 border border-[#cb2044]/30 rounded-xl text-[#cb2044] text-xs flex items-start gap-2.5 animate-in shake duration-200">
              <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
              <p className="leading-snug font-medium">{errorMessage}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1e1b19] mb-1.5 flex items-center justify-between">
                <span>Usuario o Login Clínico</span>
                <span className="text-[10.5px] font-mono text-[#005c55] font-semibold">@usuario</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6e7977]">
                  <span className="material-symbols-outlined text-lg">account_circle</span>
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="ej. mausugu"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs font-medium rounded-xl border border-[#d8d1cd] bg-[#fff8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005c55] text-[#1e1b19] placeholder-[#a8a29e] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1e1b19] mb-1.5 flex items-center justify-between">
                <span>Contraseña de Seguridad</span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10.5px] text-[#005c55] hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                  <span>{showPassword ? 'Ocultar' : 'Mostrar'}</span>
                </button>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6e7977]">
                  <span className="material-symbols-outlined text-lg">lock</span>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-xs font-medium rounded-xl border border-[#d8d1cd] bg-[#fff8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005c55] text-[#1e1b19] placeholder-[#a8a29e] transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-[#3e4947] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#d8d1cd] text-[#005c55] focus:ring-[#005c55]"
                />
                <span className="text-[11.5px] font-medium">Recordar sesión clínica</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-[#005c55] to-[#0f766e] hover:from-[#004742] hover:to-[#0d665f] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                  <span>Verificando credenciales...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">login</span>
                  <span>Iniciar Sesión Clínica</span>
                </>
              )}
            </button>
          </form>


        </div>
      </div>
    </div>
  );
};
