import React, { useState } from 'react';

interface TherapeuticsScreenProps {
  onShowToast: (msg: string) => void;
  onOpenFhir: () => void;
}

export const TherapeuticsScreen: React.FC<TherapeuticsScreenProps> = ({
  onShowToast,
  onOpenFhir,
}) => {
  const [activeTab, setActiveTab] = useState<'nutraceutical' | 'lifestyle' | 'gut5r' | 'escalation'>('nutraceutical');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'supp-1': true,
    'supp-2': true,
    'supp-3': false,
    'supp-4': false,
    'life-1': true,
    'life-2': true,
  });

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
    onShowToast('Estado de intervención clínica actualizado.');
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Header Banner */}
      <section className="w-full bg-[#ffffff] rounded-xl p-5 md:p-6 shadow-sm border border-[#e9e1dd] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#005c55]/10 text-[10px] font-bold text-[#005c55] uppercase tracking-wider">
              PRESCRIPCIÓN INTEGRATIVA DIRIGIDA
            </span>
            <span className="text-[12px] text-[#6e7977]">
              Protocolo: Reseteo Metabólico v3.2 • Fase 1 (Semanas 1-8)
            </span>
          </div>
          <h1 className="text-[22px] md:text-[24px] font-bold text-[#1e1b19] tracking-tight mt-1">
            Matriz Terapéutica Multimodal
          </h1>
          <p className="text-[13px] text-[#6e7977] max-w-2xl">
            Sinergia biológica entre fitoterapia de alta biodisponibilidad, restauración de la mucosa intestinal, crononutrición y locomoción biomecánica.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onShowToast('Exportando plan terapéutico detallado para la paciente...')}
            className="px-4 py-2 rounded-lg bg-[#faf2ee] hover:bg-[#f4ece8] text-[12px] text-[#1e1b19] font-bold border border-[#e9e1dd] transition-colors cursor-pointer"
          >
            Imprimir Guía del Paciente
          </button>
          <button
            onClick={onOpenFhir}
            className="px-4 py-2 rounded-lg bg-[#005c55] hover:bg-[#0f766e] text-white text-[12px] font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">send_time_extension</span>
            <span>Firmar Prescripción Electrónica</span>
          </button>
        </div>
      </section>

      {/* Segmented Filter Bar */}
      <div className="flex items-center gap-2 border-b border-[#eee7e3] pb-2">
        <button
          onClick={() => setActiveTab('nutraceutical')}
          className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer ${
            activeTab === 'nutraceutical'
              ? 'bg-[#005c55] text-white shadow-sm'
              : 'bg-[#faf2ee] text-[#3e4947] hover:bg-[#f4ece8]'
          }`}
        >
          Nutracéuticos y Fitosomas
        </button>
        <button
          onClick={() => setActiveTab('gut5r')}
          className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer ${
            activeTab === 'gut5r'
              ? 'bg-[#005c55] text-white shadow-sm'
              : 'bg-[#faf2ee] text-[#3e4947] hover:bg-[#f4ece8]'
          }`}
        >
          Protocolo 5R de Barrera Intestinal
        </button>
        <button
          onClick={() => setActiveTab('lifestyle')}
          className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer ${
            activeTab === 'lifestyle'
              ? 'bg-[#005c55] text-white shadow-sm'
              : 'bg-[#faf2ee] text-[#3e4947] hover:bg-[#f4ece8]'
          }`}
        >
          Crononutrición y Ejercicio Zona 2
        </button>
        <button
          onClick={() => setActiveTab('escalation')}
          className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer ${
            activeTab === 'escalation'
              ? 'bg-[#005c55] text-white shadow-sm'
              : 'bg-[#faf2ee] text-[#3e4947] hover:bg-[#f4ece8]'
          }`}
        >
          Árbol de Escalamiento Farmacológico
        </button>
      </div>

      {/* Tab 1: Nutraceutical Schedule */}
      {activeTab === 'nutraceutical' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Berberine Phytosome */}
          <div className="bg-[#ffffff] p-5 rounded-xl shadow-sm border border-[#e9e1dd] flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#005c55] uppercase tracking-wider">
                    Eje AMPK / Sensibilizador Insulínico
                  </span>
                  <h3 className="text-[16px] font-bold text-[#1e1b19] mt-0.5">
                    Fitoma de Berberina Dirigido
                  </h3>
                </div>
                <input
                  type="checkbox"
                  checked={checkedItems['supp-1']}
                  onChange={() => toggleCheck('supp-1')}
                  className="w-5 h-5 text-[#005c55] rounded cursor-pointer accent-[#005c55]"
                />
              </div>

              <div className="p-2.5 my-3 rounded-lg bg-[#faf2ee] text-[12px] border border-[#eee7e3] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#6e7977]">Posología:</span>
                  <strong className="text-[#1e1b19]">500 mg BID (con almuerzo y cena)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e7977]">Formulación:</span>
                  <strong className="text-[#005c55]">Fosfolípidos de girasol (10x absorción)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e7977]">Mecanismo:</span>
                  <strong className="text-[#1e1b19]">Inhibe ChREBP y activa AMPK en miocito</strong>
                </div>
              </div>

              <p className="text-[12px] text-[#6e7977] leading-relaxed">
                Reduce la gluconeogénesis hepática de manera análoga a la metformina sin interferir en la cadena mitocondrial compleja I cuando se usa en forma de fitosoma.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-[#eee7e3] text-[11px] text-[#904d00] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">timer</span>
              <span>Duración prescrita: 8 semanas continuas (Revisar en control HOMA)</span>
            </div>
          </div>

          {/* Card 2: Inositol Ratio */}
          <div className="bg-[#ffffff] p-5 rounded-xl shadow-sm border border-[#e9e1dd] flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#005c55] uppercase tracking-wider">
                    Segundo Mensajero Intracelular
                  </span>
                  <h3 className="text-[16px] font-bold text-[#1e1b19] mt-0.5">
                    Mio-Inositol + D-Quiro-Inositol (40:1)
                  </h3>
                </div>
                <input
                  type="checkbox"
                  checked={checkedItems['supp-2']}
                  onChange={() => toggleCheck('supp-2')}
                  className="w-5 h-5 text-[#005c55] rounded cursor-pointer accent-[#005c55]"
                />
              </div>

              <div className="p-2.5 my-3 rounded-lg bg-[#faf2ee] text-[12px] border border-[#eee7e3] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#6e7977]">Posología:</span>
                  <strong className="text-[#1e1b19]">2.000 mg en ayunas diluido en agua</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e7977]">Ratio Canónico:</span>
                  <strong className="text-[#005c55]">40:1 Fisiológico de tejido ovárico y muscular</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e7977]">Mecanismo:</span>
                  <strong className="text-[#1e1b19]">Mediador inositolglicano IPG fosfodiesterasa</strong>
                </div>
              </div>

              <p className="text-[12px] text-[#6e7977] leading-relaxed">
                Restaura el acoplamiento post-receptor de la insulina. Ideal para el fenotipo de Eleanor con antecedentes de diabetes gestacional y adiposidad ovárica/visceral.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-[#eee7e3] text-[11px] text-[#005c55] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              <span>Tolerancia gástrica óptima, sin efectos secundarios descritos</span>
            </div>
          </div>

          {/* Card 3: Trans-Resveratrol Micronizado */}
          <div className="bg-[#ffffff] p-5 rounded-xl shadow-sm border border-[#e9e1dd] flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#904d00] uppercase tracking-wider">
                    Activador de Sirtuinas / Mitocondria
                  </span>
                  <h3 className="text-[16px] font-bold text-[#1e1b19] mt-0.5">
                    Trans-Resveratrol Micronizado + Quercetina
                  </h3>
                </div>
                <input
                  type="checkbox"
                  checked={checkedItems['supp-3']}
                  onChange={() => toggleCheck('supp-3')}
                  className="w-5 h-5 text-[#005c55] rounded cursor-pointer accent-[#005c55]"
                />
              </div>

              <div className="p-2.5 my-3 rounded-lg bg-[#faf2ee] text-[12px] border border-[#eee7e3] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#6e7977]">Posología:</span>
                  <strong className="text-[#1e1b19]">250 mg trans-resveratrol + 150 mg quercetina</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e7977]">Momento:</span>
                  <strong className="text-[#904d00]">Con el desayuno con grasas saludables</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e7977]">Mecanismo:</span>
                  <strong className="text-[#1e1b19]">Activación de SIRT1 y desacetilación de PGC-1α</strong>
                </div>
              </div>

              <p className="text-[12px] text-[#6e7977] leading-relaxed">
                Estimula la biogénesis mitocondrial en músculo esquelético, atenuando la toxicidad de lípidos intramiocelulares que bloquean la vía PI3K/Akt.
              </p>
            </div>
          </div>

          {/* Card 4: Sulforaphane Glucosinolate */}
          <div className="bg-[#ffffff] p-5 rounded-xl shadow-sm border border-[#e9e1dd] flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#005c55] uppercase tracking-wider">
                    Eje Nrf2 / Detox Hepática
                  </span>
                  <h3 className="text-[16px] font-bold text-[#1e1b19] mt-0.5">
                    Sulforafano Estandarizado (BrocColina)
                  </h3>
                </div>
                <input
                  type="checkbox"
                  checked={checkedItems['supp-4']}
                  onChange={() => toggleCheck('supp-4')}
                  className="w-5 h-5 text-[#005c55] rounded cursor-pointer accent-[#005c55]"
                />
              </div>

              <div className="p-2.5 my-3 rounded-lg bg-[#faf2ee] text-[12px] border border-[#eee7e3] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#6e7977]">Posología:</span>
                  <strong className="text-[#1e1b19]">60 mg glucorafanina + mirosinasa activa</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e7977]">Objetivo:</span>
                  <strong className="text-[#005c55]">Reducción de esteatosis hepática (FLI 64.8)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e7977]">Mecanismo:</span>
                  <strong className="text-[#1e1b19]">Inducción de glutatión y fase II hepática</strong>
                </div>
              </div>

              <p className="text-[12px] text-[#6e7977] leading-relaxed">
                Revierte la acumulación de sn-1,2-diacilglicerol en hepatocitos, liberando la inhibición mediada por PKCε sobre el receptor de insulina.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Gut 5R Protocol */}
      {activeTab === 'gut5r' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="bg-[#ffffff] p-4 rounded-xl shadow-sm border border-[#e9e1dd] flex flex-col">
            <span className="text-[11px] font-bold text-[#cb2044] uppercase">1. Remove (Remover)</span>
            <h4 className="text-[14px] font-bold text-[#1e1b19] mt-1">Eliminación de Gatillos</h4>
            <p className="text-[11.5px] text-[#6e7977] mt-2 leading-relaxed">
              Excluir gluten, caseína A1, aceites de semillas industriales y jarabe de maíz alto en fructosa para suprimir estímulo de zonulina.
            </p>
          </div>

          <div className="bg-[#ffffff] p-4 rounded-xl shadow-sm border border-[#e9e1dd] flex flex-col">
            <span className="text-[11px] font-bold text-[#fe932c] uppercase">2. Replace (Reemplazar)</span>
            <h4 className="text-[14px] font-bold text-[#1e1b19] mt-1">Soporte Digestivo</h4>
            <p className="text-[11.5px] text-[#6e7977] mt-2 leading-relaxed">
              Enzimas pancreáticas de espectro completo con lipasa concentrada y sales biliares antes de comidas principales para asegurar degradación lipídica.
            </p>
          </div>

          <div className="bg-[#ffffff] p-4 rounded-xl shadow-sm border border-[#e9e1dd] flex flex-col">
            <span className="text-[11px] font-bold text-[#005c55] uppercase">3. Reinoculate (Reinocular)</span>
            <h4 className="text-[14px] font-bold text-[#1e1b19] mt-1">Akkermansia & SCFA</h4>
            <p className="text-[11.5px] text-[#6e7977] mt-2 leading-relaxed">
              Akkermansia muciniphila pasteurizada + polifenoles de granada y arándano para restaurar la capa mucosa intestinal protectora.
            </p>
          </div>

          <div className="bg-[#ffffff] p-4 rounded-xl shadow-sm border border-[#e9e1dd] flex flex-col">
            <span className="text-[11px] font-bold text-[#005c55] uppercase">4. Repair (Reparar)</span>
            <h4 className="text-[14px] font-bold text-[#1e1b19] mt-1">Sello Epitelial</h4>
            <p className="text-[11.5px] text-[#6e7977] mt-2 leading-relaxed">
              L-Glutamina 5g BID, Zinc Carnosina 75mg BID e Inmunoglobulinas de suero bovino (SBI) para neutralizar endotoxina bacteriana (LPS).
            </p>
          </div>

          <div className="bg-[#ffffff] p-4 rounded-xl shadow-sm border border-[#e9e1dd] flex flex-col">
            <span className="text-[11px] font-bold text-[#904d00] uppercase">5. Rebalance (Rebalancear)</span>
            <h4 className="text-[14px] font-bold text-[#1e1b19] mt-1">Eje Cerebro-Intestino</h4>
            <p className="text-[11.5px] text-[#6e7977] mt-2 leading-relaxed">
              Estimulación del nervio vago: gárgaras matutinas, respiración diafragmática 4-7-8 pre-comida y optimización del ritmo circadiano.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Lifestyle & Zone 2 */}
      {activeTab === 'lifestyle' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#ffffff] p-5 rounded-xl shadow-sm border border-[#e9e1dd]">
            <div className="flex items-center gap-2 text-[#005c55] mb-2">
              <span className="material-symbols-outlined text-[20px]">directions_walk</span>
              <h3 className="text-[15px] font-bold text-[#1e1b19]">
                Locomoción Postprandial Cronometrada
              </h3>
            </div>
            <div className="space-y-2 text-[12.5px] text-[#3e4947] leading-relaxed">
              <p>
                <strong>Prescripción:</strong> Caminata enérgica de 15 a 20 minutos dentro de los 30 minutos posteriores al almuerzo y la cena.
              </p>
              <p>
                <strong>Mecanismo biológico:</strong> La contracción isométrica e isotónica del sóleo y cuádriceps transloca transportadores GLUT4 de manera independiente de la insulina, reduciendo el pico glucémico en hasta un 35% y desahogando al páncreas.
              </p>
            </div>
          </div>

          <div className="bg-[#ffffff] p-5 rounded-xl shadow-sm border border-[#e9e1dd]">
            <div className="flex items-center gap-2 text-[#904d00] mb-2">
              <span className="material-symbols-outlined text-[20px]">fitness_center</span>
              <h3 className="text-[15px] font-bold text-[#1e1b19]">
                Entrenamiento en Zona 2 y Fuerza Progresiva
              </h3>
            </div>
            <div className="space-y-2 text-[12.5px] text-[#3e4947] leading-relaxed">
              <p>
                <strong>Prescripción:</strong> 150 minutos semanales de ejercicio aeróbico estricto en Zona 2 (frecuencia cardíaca ~115–128 lpm para Eleanor) + 2 sesiones de fuerza con sobrecarga progresiva.
              </p>
              <p>
                <strong>Mecanismo biológico:</strong> Maximiza la densidad mitocondrial y la tasa de oxidación de ácidos grasos (FatMax), consumiendo diacilgliceroles intramiocelulares y ampliando el sumidero glucídico.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Escalation Tree */}
      {activeTab === 'escalation' && (
        <div className="bg-[#ffffff] p-5 rounded-xl shadow-sm border border-[#e9e1dd]">
          <h3 className="text-[15px] font-bold text-[#1e1b19] mb-3">
            Algoritmo de Escalamiento Escalonado (CDSS)
          </h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-[#005c55]/10 border border-[#005c55]/20 flex items-start gap-3">
              <span className="px-2 py-0.5 rounded bg-[#005c55] text-white text-[11px] font-bold">
                Nivel 1 (Actual)
              </span>
              <p className="text-[12px] text-[#1e1b19]">
                <strong>Fitoma de Berberina 500mg BID + Inositol + Zona 2:</strong> Monitoreo por 8 semanas con MCG telemétrico continuo. Meta: HOMA-IR &lt; 2.50 y CV de glucosa &lt; 20%.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#fe932c]/10 border border-[#fe932c]/20 flex items-start gap-3">
              <span className="px-2 py-0.5 rounded bg-[#fe932c] text-white text-[11px] font-bold">
                Nivel 2 (Si HOMA &gt; 2.5 a Semana 12)
              </span>
              <p className="text-[12px] text-[#1e1b19]">
                <strong>Metformina de Liberación Prolongada 500-1000mg + Péptidos GLP-1 microdosificados:</strong> Evaluación previa de TFGe y Cistatina C. Monitoreo estricto de vitamina B12.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#cb2044]/10 border border-[#cb2044]/20 flex items-start gap-3">
              <span className="px-2 py-0.5 rounded bg-[#cb2044] text-white text-[11px] font-bold">
                Nivel 3 (Falla a Estrato 3)
              </span>
              <p className="text-[12px] text-[#1e1b19]">
                <strong>Agonistas duales GIP/GLP-1 (Tirzepatida) + Inhibidores de SGLT-2:</strong> Reservado para glucosa sostenida &gt;130 mg/dL o daño orgánico subclínico evidente.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
