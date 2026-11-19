import React, { useState, useEffect, useRef } from 'react';
import { YearDatabase } from '../../types/crime';
import { Chart, registerables } from 'chart.js';
import { GitCompare, Calendar, ArrowUpRight, ArrowDownRight, Layers, CheckSquare, Square } from 'lucide-react';
import { MESES_LABEL } from '../../data/initialDb';

Chart.register(...registerables);

interface ComparativaTabProps {
  database: YearDatabase;
}

const ALL_MONTHS = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
];

export const ComparativaTab: React.FC<ComparativaTabProps> = ({ database }) => {
  const [cmpMode, setCmpMode] = useState<'cruzado' | 'anual'>('cruzado');

  // Mode Cruzado states
  const [selectedFieldCrz, setSelectedFieldCrz] = useState<'total' | 'robo' | 'extorsion' | 'asesinato' | 'secuestro'>('total');
  const [chartTypeCrz, setChartTypeCrz] = useState<'bar' | 'line'>('bar');
  const [selectedMonths, setSelectedMonths] = useState<Set<string>>(
    new Set(['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'JUNIO', 'JULIO', 'AGOSTO', 'OCTUBRE'])
  );

  // Mode Anual states
  const [selectedYearAnual, setSelectedYearAnual] = useState<number>(2026);
  const [selectedFieldAnual, setSelectedFieldAnual] = useState<'total' | 'robo' | 'extorsion' | 'asesinato' | 'secuestro'>('total');

  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const fieldLabels: Record<string, string> = {
    total: 'Total General',
    robo: 'Robos',
    extorsion: 'Extorsiones',
    asesinato: 'Asesinatos',
    secuestro: 'Secuestros'
  };

  const toggleMonth = (m: string) => {
    const updated = new Set(selectedMonths);
    if (updated.has(m)) {
      if (updated.size > 1) updated.delete(m);
    } else {
      updated.add(m);
    }
    setSelectedMonths(updated);
  };

  const selectAll = () => {
    setSelectedMonths(new Set(ALL_MONTHS));
  };

  const selectQ1 = () => {
    setSelectedMonths(new Set(['ENERO', 'FEBRERO', 'MARZO']));
  };

  const selectQ2 = () => {
    setSelectedMonths(new Set(['ABRIL', 'MAYO', 'JUNIO']));
  };

  // Render chart
  useEffect(() => {
    if (!chartCanvasRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    if (cmpMode === 'cruzado') {
      const activeMonths = ALL_MONTHS.filter((m) => selectedMonths.has(m));
      const labels = activeMonths.map((m) => MESES_LABEL[m] || m);

      const data2025 = activeMonths.map((m) => {
        const item = database[2025]?.[m];
        if (!item) return null;
        if (selectedFieldCrz === 'secuestro') return item.grand.secuestro + (item.grand.secuestroExt || 0);
        return (item.grand as any)[selectedFieldCrz] || 0;
      });

      const data2026 = activeMonths.map((m) => {
        const item = database[2026]?.[m];
        if (!item) return null;
        if (selectedFieldCrz === 'secuestro') return item.grand.secuestro + (item.grand.secuestroExt || 0);
        return (item.grand as any)[selectedFieldCrz] || 0;
      });

      chartInstance.current = new Chart(chartCanvasRef.current, {
        type: chartTypeCrz,
        data: {
          labels,
          datasets: [
            {
              label: 'Año 2025',
              data: data2025,
              backgroundColor: chartTypeCrz === 'bar' ? '#64748B' : 'rgba(100, 116, 139, 0.1)',
              borderColor: '#64748B',
              borderWidth: 2,
              pointBackgroundColor: '#64748B',
              pointRadius: 4,
              borderRadius: 3
            },
            {
              label: 'Año 2026',
              data: data2026,
              backgroundColor: chartTypeCrz === 'bar' ? '#2563EB' : 'rgba(37, 99, 235, 0.15)',
              borderColor: '#2563EB',
              borderWidth: 2.5,
              pointBackgroundColor: '#2563EB',
              pointRadius: 5,
              borderRadius: 3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#475569',
                font: { family: "'Barlow', sans-serif", size: 11, weight: 'bold' },
                boxWidth: 12
              }
            },
            tooltip: {
              backgroundColor: '#0F172A',
              padding: 10,
              callbacks: {
                label: (ctx) => ` ${ctx.dataset.label}: ${Number(ctx.parsed.y).toLocaleString()}`
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#475569', font: { size: 10 } }
            },
            y: {
              grid: { color: 'rgba(226, 232, 240, 0.8)' },
              ticks: {
                color: '#64748B',
                callback: (v) => Number(v).toLocaleString()
              }
            }
          }
        }
      });
    } else {
      // Mode Anual
      const yearData = database[selectedYearAnual] || {};
      const activeMonths = Object.keys(yearData);
      const labels = activeMonths.map((m) => MESES_LABEL[m] || m);
      const values = activeMonths.map((m) => {
        const item = yearData[m];
        if (selectedFieldAnual === 'secuestro') return item.grand.secuestro + (item.grand.secuestroExt || 0);
        return (item.grand as any)[selectedFieldAnual] || 0;
      });

      chartInstance.current = new Chart(chartCanvasRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: `${fieldLabels[selectedFieldAnual]} ${selectedYearAnual}`,
              data: values,
              borderColor: '#2563EB',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              tension: 0.35,
              fill: true,
              pointBackgroundColor: '#2563EB',
              pointRadius: 4,
              borderWidth: 2.5
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { color: '#475569', font: { size: 11, weight: 'bold' }, boxWidth: 12 }
            },
            tooltip: {
              backgroundColor: '#0F172A',
              padding: 10,
              callbacks: {
                label: (ctx) => ` ${ctx.dataset.label}: ${Number(ctx.parsed.y).toLocaleString()}`
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#475569', font: { size: 10 } }
            },
            y: {
              grid: { color: 'rgba(226, 232, 240, 0.8)' },
              ticks: {
                color: '#64748B',
                callback: (v) => Number(v).toLocaleString()
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [cmpMode, selectedFieldCrz, chartTypeCrz, selectedMonths, selectedYearAnual, selectedFieldAnual, database]);

  // Calculations for Cruzado Table
  const activeMonthsList = ALL_MONTHS.filter((m) => selectedMonths.has(m));
  const getMonthVal = (yr: number, m: string) => {
    const item = database[yr]?.[m];
    if (!item) return null;
    if (selectedFieldCrz === 'secuestro') return item.grand.secuestro + (item.grand.secuestroExt || 0);
    return (item.grand as any)[selectedFieldCrz] || 0;
  };

  const total2025 = activeMonthsList.reduce((acc, m) => acc + (getMonthVal(2025, m) || 0), 0);
  const total2026 = activeMonthsList.reduce((acc, m) => acc + (getMonthVal(2026, m) || 0), 0);
  const totalDelta = total2026 - total2025;
  const totalPct = total2025 > 0 ? ((totalDelta / total2025) * 100).toFixed(1) : '—';

  return (
    <div className="space-y-6">
      {/* Mode Switcher with soft background */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white border border-slate-200/90 p-3 rounded-xl shadow-xs">
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setCmpMode('cruzado')}
            className={`px-3.5 py-1.5 font-heading font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
              cmpMode === 'cruzado' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Comparar 2025 vs 2026
          </button>
          <button
            onClick={() => setCmpMode('anual')}
            className={`px-3.5 py-1.5 font-heading font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
              cmpMode === 'anual' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Evolución Anual Simple
          </button>
        </div>

        {cmpMode === 'cruzado' ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[11px] text-slate-500 font-bold uppercase">Métrica:</span>
              <select
                value={selectedFieldCrz}
                onChange={(e) => setSelectedFieldCrz(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer shadow-2xs"
              >
                <option value="total">Total General</option>
                <option value="robo">Robos</option>
                <option value="extorsion">Extorsiones</option>
                <option value="asesinato">Asesinatos</option>
                <option value="secuestro">Secuestros</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[11px] text-slate-500 font-bold uppercase">Tipo:</span>
              <select
                value={chartTypeCrz}
                onChange={(e) => setChartTypeCrz(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer shadow-2xs"
              >
                <option value="bar">Barras Agrupadas</option>
                <option value="line">Líneas Comparativas</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[11px] text-slate-500 font-bold uppercase">Año:</span>
              <select
                value={selectedYearAnual}
                onChange={(e) => setSelectedYearAnual(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer shadow-2xs"
              >
                {Object.keys(database).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[11px] text-slate-500 font-bold uppercase">Delito:</span>
              <select
                value={selectedFieldAnual}
                onChange={(e) => setSelectedFieldAnual(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer shadow-2xs"
              >
                <option value="total">Total General</option>
                <option value="robo">Robos</option>
                <option value="extorsion">Extorsiones</option>
                <option value="asesinato">Asesinatos</option>
                <option value="secuestro">Secuestros</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Month multi-select for Cruzado mode */}
      {cmpMode === 'cruzado' && (
        <div className="bg-white border-l-4 border-blue-600 border border-slate-200 p-4 rounded-xl text-xs space-y-3 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
              Meses Seleccionados para Comparación Directa:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={selectAll}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-blue-700 text-[11px] font-bold transition-colors cursor-pointer"
              >
                Todos los Meses
              </button>
              <button
                onClick={selectQ1}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Q1 (Ene–Mar)
              </button>
              <button
                onClick={selectQ2}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Q2 (Abr–Jun)
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {ALL_MONTHS.map((m) => {
              const isSelected = selectedMonths.has(m);
              const has2025 = !!database[2025]?.[m];
              const has2026 = !!database[2026]?.[m];
              if (!has2025 && !has2026) return null;

              return (
                <button
                  key={m}
                  onClick={() => toggleMonth(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-700 border-blue-700 text-white shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{MESES_LABEL[m] || m}</span>
                  {!has2025 && <span className="text-[9px] opacity-80">(solo 2026)</span>}
                  {!has2026 && <span className="text-[9px] opacity-80">(solo 2025)</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Chart */}
      <div className="bg-white border-t-4 border-blue-600 border border-slate-200 rounded-xl p-4.5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {cmpMode === 'cruzado' ? 'Análisis Comparativo Interanual' : 'Tendencia Anual'}
            </span>
            <h3 className="font-heading text-base font-bold text-slate-900 uppercase">
              {cmpMode === 'cruzado'
                ? `2025 vs 2026 — ${fieldLabels[selectedFieldCrz]}`
                : `${fieldLabels[selectedFieldAnual]} — Año ${selectedYearAnual}`}
            </h3>
          </div>
          {cmpMode === 'cruzado' && (
            <div className="flex items-center gap-3 text-xs font-mono-numbers">
              <span className="text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded">2025: {total2025.toLocaleString()}</span>
              <span>vs</span>
              <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">2026: {total2026.toLocaleString()}</span>
              <span className={`font-black px-2 py-0.5 rounded ${totalDelta > 0 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                ({totalDelta > 0 ? '+' : ''}{totalPct}%)
              </span>
            </div>
          )}
        </div>

        <div className="relative h-80 sm:h-96">
          <canvas ref={chartCanvasRef} />
        </div>
      </div>

      {/* Detailed Variation Table for Cruzado Mode */}
      {cmpMode === 'cruzado' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="px-4.5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="font-heading text-sm font-bold uppercase tracking-wider text-slate-800">
              Tabla de Variación Interanual (Δ Diferencia y Porcentaje)
            </span>
            <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg font-mono-numbers">
              Métrica: {fieldLabels[selectedFieldCrz]}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-heading uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Mes</th>
                  <th className="py-3 px-4 text-right text-slate-700">Año 2025</th>
                  <th className="py-3 px-4 text-right text-blue-700">Año 2026</th>
                  <th className="py-3 px-4 text-right">Δ Diferencia</th>
                  <th className="py-3 px-4 text-right">Δ %</th>
                  <th className="py-3 px-4 text-center">Tendencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono-numbers">
                {activeMonthsList.map((m) => {
                  const val25 = getMonthVal(2025, m);
                  const val26 = getMonthVal(2026, m);
                  if (val25 === null && val26 === null) return null;

                  const diff = (val26 || 0) - (val25 || 0);
                  const pct = val25 && val25 > 0 ? ((diff / val25) * 100).toFixed(1) : '—';
                  const isUp = diff > 0;
                  const isDown = diff < 0;

                  return (
                    <tr key={m} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3 px-4 font-body font-bold text-slate-900">
                        {MESES_LABEL[m] || m}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600 font-medium">
                        {val25 !== null ? val25.toLocaleString() : '—'}
                      </td>
                      <td className="py-3 px-4 text-right text-blue-800 font-bold">
                        {val26 !== null ? val26.toLocaleString() : '—'}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-bold ${
                          isUp ? 'text-rose-600' : isDown ? 'text-emerald-600' : 'text-slate-500'
                        }`}
                      >
                        {diff > 0 ? `+${diff.toLocaleString()}` : diff.toLocaleString()}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-bold ${
                          isUp ? 'text-rose-600' : isDown ? 'text-emerald-600' : 'text-slate-500'
                        }`}
                      >
                        {pct !== '—' ? `${isUp ? '+' : ''}${pct}%` : '—'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isUp && (
                          <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-bold text-[11px]">
                            <ArrowUpRight className="w-3.5 h-3.5" /> Alza
                          </span>
                        )}
                        {isDown && (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold text-[11px]">
                            <ArrowDownRight className="w-3.5 h-3.5" /> Baja
                          </span>
                        )}
                        {!isUp && !isDown && (
                          <span className="text-slate-400 font-medium">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {/* Total Row */}
                <tr className="bg-slate-50/90 font-bold text-slate-900 text-xs border-t-2 border-slate-300">
                  <td className="py-3.5 px-4 uppercase font-heading text-sm">TOTAL SELECCIONADO</td>
                  <td className="py-3.5 px-4 text-right text-slate-700 font-mono-numbers text-sm">
                    {total2025.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right text-blue-800 font-mono-numbers text-sm">
                    {total2026.toLocaleString()}
                  </td>
                  <td
                    className={`py-3.5 px-4 text-right font-mono-numbers text-sm ${
                      totalDelta > 0 ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {totalDelta > 0 ? `+${totalDelta.toLocaleString()}` : totalDelta.toLocaleString()}
                  </td>
                  <td
                    className={`py-3.5 px-4 text-right font-mono-numbers text-sm ${
                      totalDelta > 0 ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {totalDelta > 0 ? `+${totalPct}%` : `${totalPct}%`}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {totalDelta > 0 ? (
                      <span className="text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full font-bold uppercase text-[11px]">▲ Incremento</span>
                    ) : (
                      <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold uppercase text-[11px]">▼ Reducción</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

