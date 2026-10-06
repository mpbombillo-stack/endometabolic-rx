import React, { useState, useRef, useEffect } from 'react';
import { MedicalProfessional } from '../types';
import { FunctionalCareLogo } from '../components/FunctionalCareLogo';

interface ProfessionalsConfigScreenProps {
  professionals: MedicalProfessional[];
  onUpdateProfessionals: (updated: MedicalProfessional[]) => void;
  activeDoctorId: string;
  onSelectActiveDoctor: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export const ProfessionalsConfigScreen: React.FC<ProfessionalsConfigScreenProps> = ({
  professionals,
  onUpdateProfessionals,
  activeDoctorId,
  onSelectActiveDoctor,
  onShowToast,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [institution, setInstitution] = useState('Functional Care Institute');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [signatureUrl, setSignatureUrl] = useState<string | undefined>(undefined);

  // Canvas for Digital Signature
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureMode, setSignatureMode] = useState<'upload' | 'draw'>('upload');

  const startEdit = (prof?: MedicalProfessional) => {
    if (prof) {
      setEditingId(prof.id);
      setFullName(prof.fullName);
      setTitle(prof.title);
      setSpecialty(prof.specialty);
      setLicenseNumber(prof.licenseNumber);
      setInstitution(prof.institution);
      setEmail(prof.email);
      setPhone(prof.phone);
      setSignatureUrl(prof.signatureUrl);
    } else {
      setEditingId(null);
      setFullName('');
      setTitle('Médico Especialista en Medicina Funcional');
      setSpecialty('Medicina Funcional & Metabólica');
      setLicenseNumber(`TP-${Math.floor(10000 + Math.random() * 90000)}-MD`);
      setInstitution('Functional Care Institute');
      setEmail('');
      setPhone('');
      setSignatureUrl(undefined);
    }
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !licenseNumber.trim()) {
      onShowToast('Por favor ingrese el nombre y la tarjeta profesional.');
      return;
    }

    let updatedList: MedicalProfessional[] = [];

    if (editingId) {
      updatedList = professionals.map((p) =>
        p.id === editingId
          ? {
              ...p,
              fullName: fullName.trim(),
              title: title.trim(),
              specialty: specialty.trim(),
              licenseNumber: licenseNumber.trim(),
              institution: institution.trim(),
              email: email.trim(),
              phone: phone.trim(),
              signatureUrl,
            }
          : p
      );
      onShowToast(`Perfil del ${fullName} actualizado con éxito.`);
    } else {
      const newProf: MedicalProfessional = {
        id: `doc-${Date.now()}`,
        fullName: fullName.trim(),
        title: title.trim(),
        specialty: specialty.trim(),
        licenseNumber: licenseNumber.trim(),
        institution: institution.trim(),
        email: email.trim(),
        phone: phone.trim(),
        signatureUrl,
        isPrimary: professionals.length === 0,
        registeredAt: new Date().toISOString().split('T')[0],
      };
      updatedList = [...professionals, newProf];
      onShowToast(`Profesional ${fullName} registrado exitosamente.`);
    }

    onUpdateProfessionals(updatedList);
    setIsEditing(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (professionals.length <= 1) {
      onShowToast('Debe haber al menos un profesional médico registrado en el sistema.');
      return;
    }
    if (confirm(`¿Está seguro de eliminar al profesional ${name}?`)) {
      const filtered = professionals.filter((p) => p.id !== id);
      onUpdateProfessionals(filtered);
      if (activeDoctorId === id) {
        onSelectActiveDoctor(filtered[0].id);
      }
      onShowToast(`Profesional ${name} eliminado.`);
    }
  };

  // Image Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSignatureUrl(event.target.result as string);
          onShowToast('Firma escaneada cargada correctamente.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Canvas Drawing Handlers
  useEffect(() => {
    if (isEditing && signatureMode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#005c55';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [isEditing, signatureMode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureUrl(canvas.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      setSignatureUrl(undefined);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#005c55] via-[#0f766e] to-[#005c55] rounded-2xl p-6 text-white shadow-md border border-[#005c55]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <FunctionalCareLogo variant="emblem" height={48} theme="light" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                Configuración del Equipo Médico & Firmas Digitales
              </h1>
              <span className="bg-white/20 text-white text-[11px] font-mono px-2 py-0.5 rounded font-semibold">
                Módulo Clínico
              </span>
            </div>
            <p className="text-sm text-white/80 mt-1 max-w-2xl">
              Gestione los especialistas tratantes, títulos habilitantes, matrículas y firmas escaneadas para la suscripción de historias clínicas, reportes FHIR y protocolos de reseteo metabólico.
            </p>
          </div>
        </div>

        <button
          onClick={() => startEdit()}
          className="px-4 py-2.5 bg-white text-[#005c55] hover:bg-[#faf2ee] font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-base">person_add</span>
          <span>+ Registrar Nuevo Especialista</span>
        </button>
      </div>

      {/* Grid of Registered Medical Professionals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {professionals.map((prof) => {
          const isActive = prof.id === activeDoctorId;
          return (
            <div
              key={prof.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm transition-all flex flex-col justify-between relative ${
                isActive
                  ? 'border-[#005c55] ring-2 ring-[#005c55]/20 bg-gradient-to-b from-[#005c55]/5 to-white'
                  : 'border-[#e9e1dd] hover:border-[#d8d1cd]'
              }`}
            >
              {isActive && (
                <div className="absolute top-3 right-3 bg-[#005c55] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                  <span>Especialista Activo</span>
                </div>
              )}

              <div>
                {/* Doctor Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#005c55] to-[#0f766e] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                    {prof.fullName.split(' ')[1]?.[0] || 'D'}
                    {prof.fullName.split(' ')[2]?.[0] || 'R'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1e1b19] leading-snug">{prof.fullName}</h3>
                    <p className="text-xs text-[#005c55] font-semibold">{prof.specialty}</p>
                    <p className="text-[11px] text-[#6e7977]">{prof.title}</p>
                  </div>
                </div>

                {/* Professional Details */}
                <div className="space-y-1.5 py-3 border-y border-[#f4ece8] text-xs text-[#3e4947] mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6e7977]">Registro / Matrícula:</span>
                    <span className="font-mono font-bold text-[#1e1b19] bg-[#faf2ee] px-1.5 py-0.5 rounded border border-[#e9e1dd]">
                      {prof.licenseNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6e7977]">Institución:</span>
                    <span className="font-medium text-right text-[#1e1b19] truncate max-w-[180px]">
                      {prof.institution}
                    </span>
                  </div>
                  {prof.email && (
                    <div className="flex items-center justify-between">
                      <span className="text-[#6e7977]">Email:</span>
                      <span className="font-medium text-[#1e1b19]">{prof.email}</span>
                    </div>
                  )}
                  {prof.phone && (
                    <div className="flex items-center justify-between">
                      <span className="text-[#6e7977]">Teléfono:</span>
                      <span className="font-medium text-[#1e1b19]">{prof.phone}</span>
                    </div>
                  )}
                </div>

                {/* Digital Signature Preview Card */}
                <div className="bg-[#fff8f5] rounded-xl p-3 border border-[#e9e1dd] mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-[#6e7977] uppercase tracking-wider flex items-center gap-1 font-bold">
                      <span className="material-symbols-outlined text-[13px] text-[#005c55]">draw</span>
                      Firma Escaneada / Digitalizada
                    </span>
                    {prof.signatureUrl ? (
                      <span className="text-[9px] font-bold text-[#005c55] bg-[#005c55]/10 px-1.5 py-0.2 rounded">
                        Certificada
                      </span>
                    ) : (
                      <span className="text-[9px] text-[#904d00] bg-[#fe932c]/15 px-1.5 py-0.2 rounded">
                        Pendiente
                      </span>
                    )}
                  </div>

                  {prof.signatureUrl ? (
                    <div className="h-16 flex items-center justify-center bg-white rounded-lg border border-[#e9e1dd] overflow-hidden p-1 shadow-inner">
                      <img
                        src={prof.signatureUrl}
                        alt={`Firma de ${prof.fullName}`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-16 flex flex-col items-center justify-center bg-[#faf2ee] rounded-lg border border-dashed border-[#d8d1cd] text-[#6e7977] text-[11px]">
                      <span className="material-symbols-outlined text-base">history_edu</span>
                      <span>Sin firma registrada</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                {!isActive ? (
                  <button
                    onClick={() => {
                      onSelectActiveDoctor(prof.id);
                      onShowToast(`${prof.fullName} establecido como especialista activo.`);
                    }}
                    className="flex-1 py-1.5 bg-[#005c55]/10 hover:bg-[#005c55] text-[#005c55] hover:text-white border border-[#005c55]/30 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">check</span>
                    <span>Seleccionar Activo</span>
                  </button>
                ) : (
                  <div className="flex-1 py-1.5 bg-[#005c55] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                    <span>Firma Activa</span>
                  </div>
                )}

                <button
                  onClick={() => startEdit(prof)}
                  className="p-1.5 text-[#3e4947] hover:text-[#005c55] hover:bg-[#faf2ee] rounded-lg border border-[#e9e1dd] transition-colors cursor-pointer"
                  title="Editar datos del profesional"
                >
                  <span className="material-symbols-outlined text-base">edit</span>
                </button>

                <button
                  onClick={() => handleDelete(prof.id, prof.fullName)}
                  className="p-1.5 text-[#6e7977] hover:text-[#cb2044] hover:bg-[#cb2044]/10 rounded-lg border border-[#e9e1dd] transition-colors cursor-pointer"
                  title="Eliminar profesional"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Specialist Creation / Edition Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-[#e7e5e4] flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-[#005c55] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">medical_services</span>
                <h3 className="text-base font-bold">
                  {editingId ? 'Editar Especialista Médico' : 'Registrar Nuevo Especialista'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="flex-1 p-5 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1e1b19] mb-1">Nombre Completo con Título *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Dr. Mauricio Thorne, MD, IFMCP"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#d8d1cd] focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1e1b19] mb-1">
                    Registro Médico / Tarjeta Profesional *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. TP-84920-MD"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#d8d1cd] focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1e1b19] mb-1">Especialidad Clínica</label>
                  <input
                    type="text"
                    placeholder="Ej. Endocrinología Metabólica & Medicina de Precisión"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#d8d1cd] focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1e1b19] mb-1">Título Profesional Habilitante</label>
                  <input
                    type="text"
                    placeholder="Ej. Especialista en Medicina Funcional e Inmunonutrición"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#d8d1cd] focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1e1b19] mb-1">Institución / Clínica</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#d8d1cd] focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1e1b19] mb-1">Email Profesional</label>
                  <input
                    type="email"
                    placeholder="medico@functionalcare.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#d8d1cd] focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1e1b19] mb-1">Teléfono / Celular</label>
                  <input
                    type="tel"
                    placeholder="+57 (315) 890-4421"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#d8d1cd] focus:ring-2 focus:ring-[#005c55] bg-[#fff8f5]"
                  />
                </div>
              </div>

              {/* Digital Signature Section */}
              <div className="p-4 bg-[#faf2ee] rounded-xl border border-[#e9e1dd] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#005c55] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">ink_pen</span>
                    Firma Escaneada / Digitalizada del Especialista
                  </span>
                  <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-[#e9e1dd]">
                    <button
                      type="button"
                      onClick={() => setSignatureMode('upload')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                        signatureMode === 'upload' ? 'bg-[#005c55] text-white shadow-sm' : 'text-[#6e7977]'
                      }`}
                    >
                      Cargar Archivo
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignatureMode('draw')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                        signatureMode === 'draw' ? 'bg-[#005c55] text-white shadow-sm' : 'text-[#6e7977]'
                      }`}
                    >
                      Dibujar en Pantalla
                    </button>
                  </div>
                </div>

                {signatureMode === 'upload' ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <label className="flex-1 w-full border-2 border-dashed border-[#005c55]/40 hover:border-[#005c55] bg-white rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                      <span className="material-symbols-outlined text-2xl text-[#005c55] group-hover:scale-110 transition-transform">
                        upload_file
                      </span>
                      <span className="text-xs font-bold text-[#1e1b19] mt-1">Cargar Imagen de Firma</span>
                      <span className="text-[10px] text-[#6e7977]">Formatos PNG transparente, JPG o SVG</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>

                    {signatureUrl && (
                      <div className="w-48 h-24 bg-white rounded-xl border border-[#e9e1dd] p-2 flex flex-col items-center justify-between shadow-inner shrink-0">
                        <span className="text-[9px] font-mono text-[#6e7977] uppercase">Vista Previa</span>
                        <img src={signatureUrl} alt="Vista previa" className="max-h-14 max-w-full object-contain" />
                        <button
                          type="button"
                          onClick={() => setSignatureUrl(undefined)}
                          className="text-[10px] text-[#cb2044] hover:underline"
                        >
                          Eliminar firma
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative bg-white rounded-xl border border-[#d8d1cd] overflow-hidden shadow-inner">
                      <canvas
                        ref={canvasRef}
                        width={500}
                        height={120}
                        className="w-full h-28 cursor-crosshair touch-none"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                      />
                      <span className="absolute bottom-1 right-2 text-[9px] text-[#bdc9c6] select-none pointer-events-none font-mono">
                        Firme aquí con el mouse o lápiz táctil
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#6e7977]">
                        El trazo se guardará en alta resolución para informes clínicos.
                      </span>
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="px-2.5 py-1 bg-white hover:bg-[#faf2ee] border border-[#d8d1cd] text-[#6e7977] rounded text-xs font-semibold cursor-pointer"
                      >
                        Limpiar Pizarra
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-[#e9e1dd] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#6e7977] hover:text-[#1e1b19]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#005c55] hover:bg-[#0f766e] text-white text-xs font-bold rounded-lg shadow transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">save</span>
                  <span>{editingId ? 'Actualizar Especialista' : 'Guardar Especialista'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
