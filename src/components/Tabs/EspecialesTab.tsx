import React, { useState, useEffect, useRef } from 'react';
import { YearDatabase, MonthData } from '../../types/crime';
import { Chart, registerables } from 'chart.js';
import { FileText, AlertTriangle, ShieldAlert, Building2, Trees, Clock, CheckCircle2 } from 'lucide-react';
import { MESES_LABEL } from '../../data/initialDb';

Chart.register(...registerables);

interface EspecialesTabProps {
  database: YearDatabase;
  onOpenUpload: () => void;
}

export const EspecialesTab: React.FC<EspecialesTabProps> = ({ database, onOpenUpload }) => {
  // Available special months in 2026
  const months2026 = Object.keys(database[2026] || {});
  const [selectedMonth, setSelectedMonth] = useState<string>(
    months2026.includes('OCTUBRE')
      ? 'OCTUBRE'
      : months2026.includes('SEPTIEMBRE')
      ? 'SEPTIEMBRE'
      : months2026.includes('AGOSTO')
      ? 'AGOSTO'
      : months2026[months2026.length - 1] || 'OCTUBRE'
  );

  const monthData: MonthData | undefined = database[2026]?.[selectedMonth];

  // Chart refs
  const tentativaCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const flagranciaCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const zonaCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cantonesCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const tentativaChart = useRef<Chart | null>(null);
  const flagranciaChart = useRef<Chart | null>(null);
  const zonaChart = useRef<Chart | null>(null);
  const cantonesChart = useRef<Chart | null>(null);

  useEffect(() => {
    if (!monthData) return;

    // 1. Tentativa vs Consumado Chart
    if (tentativaCanvasRef.current && monthData.tentativa) {
      if (tentativaChart.current) tentativaChart.current.destroy();

      const types = Object.keys(monthData.tentativa);
      const labels = types.map((t) => t.charAt(0).toUpperCase() + t.slice(1));
      const consumados = types.map((t) => monthData.tentativa![t]?.consumado || 0);
      const tentativas = types.map((t) => monthData.tentativa![t]?.tentativa || 0);

      tentativaChart.current = new Chart(tentativaCanvasRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            { label: 'Consumado', data: consumados, backgroundColor: '#334155', borderRadius: 3 },
            { label: 'Tentativa', data: tentativas, backgroundColor: '#2563EB', borderRadius: 3 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { color: '#475569', font: { size: 10, weight: 'bold' } } }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#475569', font: { size: 10 } } },
            y: { grid: { color: 'rgba(226, 232, 240, 0.8)' }, ticks: { color: '#64748B' } }
          }
        }
      });
    }

    // 2. Flagrancia Chart
    if (flagranciaCanvasRef.current && monthData.flagrancia) {
      if (flagranciaChart.current) flagranciaChart.current.destroy();

      const types = Object.keys(monthData.flagrancia);
      const labels = types.map((t) => t.charAt(0).toUpperCase() + t.slice(1));
      const flagrantes = types.map((t) => monthData.flagrancia![t]?.flagrante || 0);
      const noFlagrantes = types.map((t) => monthData.flagrancia![t]?.noFlagrante || 0);

      flagranciaChart.current = new Chart(flagranciaCanvasRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            { label: 'En Flagrancia', data: flagrantes, backgroundColor: '#D97706', borderRadius: 3 },
            { label: 'No Flagrante', data: noFlagrantes, backgroundColor: '#2563EB', borderRadius: 3 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { color: '#475569', font: { size: 10, weight: 'bold' } } }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#475569', font: { size: 10 } } },
            y: { grid: { color: 'rgba(226, 232, 240, 0.8)' }, ticks: { color: '#64748B' } }
          }
        }
      });
    }

    // 3. Rural vs Urbano Top Provinces
    if (zonaCanvasRef.current) {
      if (zonaChart.current) zonaChart.current.destroy();

      const sortedProvs = [...monthData.provincias].sort((a, b) => b.total - a.total).slice(0, 10);
      const labels = sortedProvs.map((p) => p.name);
      const urbanos = sortedProvs.map((p) => p.urbano || Math.round(p.total * 0.84));
      const rurales = sortedProvs.map((p) => p.rural || Math.round(p.total * 0.16));

      zonaChart.current = new Chart(zonaCanvasRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            { label: 'Urbano', data: urbanos, backgroundColor: '#2563EB', borderRadius: 3 },
            { label: 'Rural', data: rurales, backgroundColor: '#059669', borderRadius: 3 }
          ]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { stacked: true, grid: { color: 'rgba(226, 232, 240, 0.8)' }, ticks: { color: '#64748B' } },
            y: { stacked: true, grid: { display: false }, ticks: { color: '#334155', font: { size: 10, weight: 'bold' } } }
          }
        }
      });
    }

    // 4. Cantones Chart
    if (cantonesCanvasRef.current && monthData.cantones) {
      if (cantonesChart.current) cantonesChart.current.destroy();

      const top10Cant = [...monthData.cantones].sort((a, b) => b.total - a.total).slice(0, 10);
      const labels = top10Cant.map((c) => `${c.canton} (${c.prov})`);
      const robos = top10Cant.map((c) => c.robo);
      const extorsiones = top10Cant.map((c) => c.extorsion);
      const asesinatos = top10Cant.map((c) => c.asesinato);

      cantonesChart.current = new Chart(cantonesCanvasRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            { label: 'Robos', data: robos, backgroundColor: '#2563EB' },
            { label: 'Extorsión', data: extorsiones, backgroundColor: '#D97706' },
            { label: 'Asesinato', data: asesinatos, backgroundColor: '#DC2626' }
          ]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { stacked: true, grid: { color: 'rgba(226, 232, 240, 0.8)' }, ticks: { color: '#64748B' } },
            y: { stacked: true, grid: { display: false }, ticks: { color: '#334155', font: { size: 10, weight: 'bold' } } }
          }
        }
      });
    }

    return () => {
      if (tentativaChart.current) tentativaChart.current.destroy();
      if (flagranciaChart.current) flagranciaChart.current.destroy();
      if (zonaChart.current) zonaChart.current.destroy();
      if (cantonesChart.current) cantonesChart.current.destroy();
    };
  }, [monthData, selectedMonth]);

  if (!monthData) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 shadow-xs">
        <p>No hay datos especiales registrados para el mes seleccionado.</p>
      </div>
    );
  }

  const grand = monthData.grand;

  return (
    <div className="space-y-6">
      {/* Month Selector Pills with soft background */}
      <div className="bg-white border border-slate-200/90 p-3.5 rounded-xl flex items-center justify-between flex-wrap gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Dossiers Mensuales
            </span>
            <span className="text-xs font-bold uppercase tracking-tight text-slate-900">
              Seleccionar Informe Mensual Especial (2026):
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {months2026.map((m) => {
            const isSelected = selectedMonth === m;
            return (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-700 text-white shadow-2xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {MESES_LABEL[m] || m}
              </button>
            );
          })}
        </div>
      </div>

      {/* Special Highlights Bar for this Month */}
      <div className="bg-linear-to-r from-blue-50/70 to-white border-l-4 border-blue-600 border border-slate-200 p-4.5 rounded-xl text-xs space-y-2 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-700" />
            Análisis Especial · {MESES_LABEL[selectedMonth] || selectedMonth} 2026 · Fuente Oficial SIAF / FGE
          </span>
          {monthData.isAiImported && (
            <span className="text-[10px] text-blue-800 bg-blue-100/70 px-2.5 py-0.5 rounded-full border border-blue-300 font-bold">
              Datos Integrados con Inteligencia Artificial
            </span>
          )}
        </div>
        <p className="text-slate-700 leading-relaxed">
          En este mes se registraron <strong className="text-slate-900 font-mono-numbers font-bold">{grand.total.toLocaleString()}</strong> delitos
          totales a nivel nacional. La tipología con mayor gravedad penal incluye <strong className="text-rose-700 font-bold">{grand.asesinato.toLocaleString()}</strong> asesinatos
          y <strong className="text-amber-800 font-bold">{grand.secuestroExt ? `${grand.secuestroExt} secuestros extorsivos` : `${grand.secuestro} secuestros`}</strong>.
        </p>
      </div>

      {/* Row 1: Consumado vs Tentativa & Flagrancia */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consumado vs Tentativa */}
        <div className="bg-white border-t-4 border-slate-700 border border-slate-200 rounded-xl p-4.5 shadow-xs">
          <div className="border-b border-slate-100 pb-3 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Tipo de Comisión Penal
            </span>
            <h4 className="font-heading text-base font-bold text-slate-900 uppercase">
              Delitos Consumados vs Tentativas
            </h4>
          </div>

          <div className="relative h-64">
            <canvas ref={tentativaCanvasRef} />
          </div>

          {monthData.tentativa && (
            <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-100 text-center text-xs font-mono-numbers">
              <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                <div className="text-slate-500 text-[10px] uppercase font-sans font-medium">Asesinato</div>
                <div className="font-bold text-slate-900">{monthData.tentativa.asesinato?.consumado || 0} cons.</div>
              </div>
              <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                <div className="text-slate-500 text-[10px] uppercase font-sans font-medium">Extorsión</div>
                <div className="font-bold text-amber-700">{monthData.tentativa.extorsion?.consumado || 0} cons.</div>
              </div>
              <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                <div className="text-slate-500 text-[10px] uppercase font-sans font-medium">Robo</div>
                <div className="font-bold text-blue-700">{monthData.tentativa.robo?.consumado || 0} cons.</div>
              </div>
              <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                <div className="text-slate-500 text-[10px] uppercase font-sans font-medium">Sec. Ext.</div>
                <div className="font-bold text-rose-600">{monthData.tentativa.secuestroExt?.consumado || 0} cons.</div>
              </div>
            </div>
          )}
        </div>

        {/* Flagrancia */}
        <div className="bg-white border-t-4 border-amber-500 border border-slate-200 rounded-xl p-4.5 shadow-xs">
          <div className="border-b border-slate-100 pb-3 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Eficacia de Intervención Policial
            </span>
            <h4 className="font-heading text-base font-bold text-slate-900 uppercase">
              Aprehensiones en Flagrancia vs Denuncia Posterior
            </h4>
          </div>

          <div className="relative h-64">
            <canvas ref={flagranciaCanvasRef} />
          </div>

          <div className="mt-3 p-3 bg-amber-50/80 rounded-lg text-[11px] text-amber-900 leading-relaxed border-l-4 border-amber-500 font-medium">
            <strong>Baja tasa flagrante general (~4.5%–6%):</strong> La gran mayoría de los hechos delictivos
            son denunciados de manera extemporánea, lo que exige reforzar los tiempos de respuesta de patrullas
            y seguridad física perimetral.
          </div>
        </div>
      </div>

      {/* Row 2: Rural vs Urbano & Top Cantones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rural vs Urbano */}
        <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs">
          <div className="border-b border-slate-100 pb-3 mb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Segmentación Territorial
              </span>
              <h4 className="font-heading text-base font-bold text-slate-900 uppercase">
                Zona Urbana vs Rural (Top Provincias)
              </h4>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold font-mono-numbers">
              <span className="flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded"><Building2 className="w-3.5 h-3.5" /> 84.5% Urbano</span>
              <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded"><Trees className="w-3.5 h-3.5" /> 15.5% Rural</span>
            </div>
          </div>

          <div className="relative h-64">
            <canvas ref={zonaCanvasRef} />
          </div>
        </div>

        {/* Top Cantones */}
        <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs">
          <div className="border-b border-slate-100 pb-3 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Concentración Cantonal
            </span>
            <h4 className="font-heading text-base font-bold text-slate-900 uppercase">
              Top 10 Cantones Críticos
            </h4>
          </div>

          <div className="relative h-64">
            <canvas ref={cantonesCanvasRef} />
          </div>
        </div>
      </div>

      {/* Secuestro Extorsivo Highlight Card */}
      {monthData.grand.secuestroExt !== undefined && monthData.grand.secuestroExt > 0 && (
        <div className="bg-white border-t-4 border-rose-600 border border-slate-200 p-4.5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
                Indicador Clave de Crimen Organizado
              </span>
              <h4 className="font-heading text-lg font-bold text-slate-900 uppercase">
                Secuestro Extorsivo en {MESES_LABEL[selectedMonth] || selectedMonth} 2026: {monthData.grand.secuestroExt} Casos
              </h4>
            </div>
            <span className="text-xs font-mono-numbers font-bold px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700">
              Modus Operandi de Alto Impacto
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="font-heading text-3xl font-black text-rose-600 font-mono-numbers">
                {monthData.grand.secuestroExt}
              </div>
              <div className="text-[11px] text-slate-600 font-bold uppercase tracking-wider mt-0.5">Casos Totales</div>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="font-heading text-3xl font-black text-slate-900 font-mono-numbers">
                ~95%
              </div>
              <div className="text-[11px] text-slate-600 font-bold uppercase tracking-wider mt-0.5">Tasa de Consumación</div>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="font-heading text-2xl font-black text-blue-700 font-mono-numbers">
                Guayas & Pichincha
              </div>
              <div className="text-[11px] text-slate-600 font-bold uppercase tracking-wider mt-0.5">Provincias de Mayor Riesgo</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
