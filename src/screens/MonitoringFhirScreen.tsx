import React, { useState } from 'react';

interface MonitoringFhirScreenProps {
  onShowToast: (msg: string) => void;
  onOpenFhir: () => void;
}

export const MonitoringFhirScreen: React.FC<MonitoringFhirScreenProps> = ({
  onShowToast,
  onOpenFhir,
}) => {
  const [streamActive, setStreamActive] = useState(true);
  const [selectedDay, setSelectedDay] = useState<'today' | 'yesterday' | '7days'>('today');

  const handleToggleStream = () => {
    setStreamActive((prev) => !prev);
    onShowToast(streamActive ? 'Telemetría CGM pausada' : 'Telemetría CGM en vivo activada (Bluetooth LE)');
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Header Banner */}
      <section className="w-full bg-[#ffffff] rounded-xl p-5 md:p-6 shadow-sm border border-[#e9e1dd] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#005c55]/10 text-[10px] font-bold text-[#005c55] uppercase tracking-wider">
              TELEMETRÍA CLÍNICA CONTINUA
            </span>
            <span className="text-[12px] text-[#6e7977] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#005c55] animate-ping" />
              Sensor CGM Dexcom G7 • Enlace FHIR Directo
            </span>
          </div>
          <h1 className="text-[22px] md:text-[24px] font-bold text-[#1e1b19] tracking-tight mt-1">
            Monitoreo Continuo de Glucosa y Servidor FHIR R4
          </h1>
          <p className="text-[13px] text-[#6e7977] max-w-2xl">
            Inspección telemétrica de variabilidad glucémica en tiempo real, tiempo en rango (TIR) y sincronización con el servidor hospitalario us-east-clinical.fhir.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleStream}
            className={`px-3.5 py-2 rounded-lg text-[12px] font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              streamActive
                ? 'bg-[#faf2ee] text-[#005c55] border-[#005c55]/30 hover:bg-[#f4ece8]'
                : 'bg-[#faf2ee] text-[#6e7977] border-[#e9e1dd]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {streamActive ? 'sensors' : 'sensors_off'}
            </span>
            <span>{streamActive ? 'Transmitiendo en Vivo' : 'Telemetría Pausada'}</span>
          </button>
          <button
            onClick={onOpenFhir}
            className="px-4 py-2 rounded-lg bg-[#005c55] hover:bg-[#0f766e] text-white text-[12px] font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">terminal</span>
            <span>Explorador FHIR R4</span>
          </button>
        </div>
      </section>

      {/* CGM 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-4 rounded-xl bg-[#ffffff] shadow-sm border border-[#e9e1dd] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#6e7977]">
            <span>Tiempo en Rango (TIR)</span>
            <span className="px-1.5 py-0.2 rounded bg-[#005c55]/15 text-[#005c55] font-bold">
              Meta &gt; 85%
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-1">
            <span className="text-[28px] font-bold text-[#005c55] tabular-nums">88.4%</span>
            <span className="text-[12px] text-[#6e7977]">70–140 mg/dL</span>
          </div>
          <div className="w-full bg-[#eee7e3] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#005c55] h-full w-[88.4%]" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-xl bg-[#ffffff] shadow-sm border border-[#e9e1dd] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#6e7977]">
            <span>Variabilidad Glucémica (CV)</span>
            <span className="px-1.5 py-0.2 rounded bg-[#fe932c]/20 text-[#904d00] font-bold">
              Alerta &gt; 20%
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-1">
            <span className="text-[28px] font-bold text-[#904d00] tabular-nums">24.2%</span>
            <span className="text-[12px] text-[#6e7977]">Coef. Variación</span>
          </div>
          <div className="w-full bg-[#eee7e3] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#fe932c] h-full w-[68%]" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-xl bg-[#ffffff] shadow-sm border border-[#e9e1dd] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#6e7977]">
            <span>Media Glucémica (24h)</span>
            <span className="text-[10px] text-[#005c55] font-semibold">Óptimo &lt; 105</span>
          </div>
          <div className="my-2 flex items-baseline gap-1">
            <span className="text-[28px] font-bold text-[#1e1b19] tabular-nums">104</span>
            <span className="text-[12px] text-[#6e7977]">mg/dL</span>
          </div>
          <span className="text-[11px] text-[#6e7977]">Desviación estándar: ±16 mg/dL</span>
        </div>

        {/* KPI 4 */}
        <div className="p-4 rounded-xl bg-[#ffffff] shadow-sm border border-[#e9e1dd] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#6e7977]">
            <span>Indicador GMI (HbA1c Est.)</span>
            <span className="text-[10px] text-[#005c55] font-semibold">Eumetabólico</span>
          </div>
          <div className="my-2 flex items-baseline gap-1">
            <span className="text-[28px] font-bold text-[#1e1b19] tabular-nums">5.4%</span>
            <span className="text-[12px] text-[#6e7977]">Estimado</span>
          </div>
          <span className="text-[11px] text-[#6e7977]">Riesgo hipoglucémico: 0.2% (&lt;54)</span>
        </div>
      </div>

      {/* 24-Hour Continuous Telemetry Trace Visualizer */}
      <div className="bg-[#ffffff] p-5 rounded-xl shadow-sm border border-[#e9e1dd] flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#eee7e3] gap-2">
          <div>
            <h3 className="text-[15px] font-bold text-[#1e1b19]">
              Perfil Ambulatorio de Glucosa (AGP 24 Horas)
            </h3>
            <span className="text-[11px] text-[#6e7977]">
              Muestra continua cada 5 minutos • Efecto de intervenciones cronometradas en Eleanor Vance
            </span>
          </div>

          <div className="flex items-center gap-1 bg-[#faf2ee] p-1 rounded-lg border border-[#e9e1dd]">
            <button
              onClick={() => setSelectedDay('today')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded ${
                selectedDay === 'today' ? 'bg-[#005c55] text-white' : 'text-[#3e4947]'
              }`}
            >
              Hoy (Día 18)
            </button>
            <button
              onClick={() => setSelectedDay('yesterday')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded ${
                selectedDay === 'yesterday' ? 'bg-[#005c55] text-white' : 'text-[#3e4947]'
              }`}
            >
              Ayer
            </button>
            <button
              onClick={() => setSelectedDay('7days')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded ${
                selectedDay === '7days' ? 'bg-[#005c55] text-white' : 'text-[#3e4947]'
              }`}
            >
              Mediana 7 Días
            </button>
          </div>
        </div>

        {/* SVG Telemetry Curve */}
        <div className="w-full h-64 relative bg-[#faf2ee]/40 rounded-lg p-2 overflow-hidden border border-[#eee7e3]">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 240">
            {/* Target Band (70 to 140 mg/dL: y=160 to y=80) */}
            <rect x="50" y="80" width="700" height="80" fill="#9cf2e8" fillOpacity="0.15" />
            <line x1="50" y1="80" x2="750" y2="80" stroke="#005c55" strokeDasharray="3,3" strokeOpacity="0.3" />
            <line x1="50" y1="160" x2="750" y2="160" stroke="#005c55" strokeDasharray="3,3" strokeOpacity="0.3" />

            <text x="55" y="74" fill="#005c55" fontSize="9" fontWeight="600">140 mg/dL Límite Superior Objetivo</text>
            <text x="55" y="172" fill="#005c55" fontSize="9" fontWeight="600">70 mg/dL Límite Inferior Objetivo</text>

            {/* Time Markers */}
            {['00:00', '04:00', '08:00 (Desayuno)', '12:00', '14:00 (Almuerzo)', '18:00', '20:00 (Cena)', '23:59'].map((t, idx) => {
              const x = 50 + idx * 100;
              return (
                <g key={idx}>
                  <line x1={x} y1="40" x2={x} y2="200" stroke="#bdc9c6" strokeDasharray="2,2" strokeOpacity="0.25" />
                  <text x={x} y="215" fill="#6e7977" fontSize="9" textAnchor="middle">{t}</text>
                </g>
              );
            })}

            {/* CGM Trace Path */}
            <path
              d="M 50 145 C 80 148, 120 152, 160 148 C 200 145, 230 140, 270 115 C 290 100, 310 95, 330 110 C 360 135, 400 140, 440 142 C 480 144, 500 110, 520 98 C 540 88, 560 105, 580 130 C 620 145, 660 115, 690 105 C 720 115, 740 138, 750 142"
              fill="none"
              stroke="#005c55"
              strokeWidth="2.8"
              strokeLinecap="round"
            />

            {/* Event Markers: Walking, Berberine */}
            <circle cx="330" cy="110" r="4" fill="#fe932c" stroke="#ffffff" strokeWidth="1.5" />
            <text x="330" y="125" fill="#904d00" fontSize="8" fontWeight="700" textAnchor="middle">
              🚶 Zona 2 15m
            </text>

            <circle cx="580" cy="130" r="4" fill="#fe932c" stroke="#ffffff" strokeWidth="1.5" />
            <text x="580" y="145" fill="#904d00" fontSize="8" fontWeight="700" textAnchor="middle">
              🚶 Zona 2 15m
            </text>
          </svg>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#6e7977] pt-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#005c55]" /> Curva CGM de Glucosa
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fe932c]" /> Intervención Biomecánica Postprandial
            </span>
          </div>
          <span>Sensor activo con 11 días de vida útil restante</span>
        </div>
      </div>
    </div>
  );
};
