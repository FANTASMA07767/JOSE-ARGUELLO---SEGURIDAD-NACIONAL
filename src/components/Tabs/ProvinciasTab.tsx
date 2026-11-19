import React, { useState, useEffect, useRef } from 'react';
import { MonthData, ProvinceData } from '../../types/crime';
import { Chart, registerables } from 'chart.js';
import { ArrowDownNarrowWide, ArrowUpNarrowWide, Search, Filter } from 'lucide-react';
import { MESES_LABEL } from '../../data/initialDb';

Chart.register(...registerables);

interface ProvinciasTabProps {
  monthData: MonthData;
  currentYear: number;
  currentMonth: string;
  onSelectProvince?: (prov: string) => void;
}

export const ProvinciasTab: React.FC<ProvinciasTabProps> = ({
  monthData,
  currentYear,
  currentMonth,
  onSelectProvince
}) => {
  const [selectedField, setSelectedField] = useState<'total' | 'robo' | 'extorsion' | 'asesinato' | 'secuestro'>('total');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [searchFilter, setSearchFilter] = useState('');
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const fieldLabels: Record<string, string> = {
    total: 'Total General',
    robo: 'Robos',
    extorsion: 'Extorsiones',
    asesinato: 'Asesinatos',
    secuestro: 'Secuestros (Simple + Ext.)'
  };

  // Filtered & sorted data
  let provList = [...monthData.provincias];
  if (searchFilter.trim()) {
    provList = provList.filter((p) =>
      p.name.toLowerCase().includes(searchFilter.toLowerCase().trim())
    );
  }

  provList.sort((a, b) => {
    const valA = selectedField === 'secuestro' ? a.secuestro + (a.secuestroExt || 0) : (a as any)[selectedField] || 0;
    const valB = selectedField === 'secuestro' ? b.secuestro + (b.secuestroExt || 0) : (b as any)[selectedField] || 0;
    return sortOrder === 'desc' ? valB - valA : valA - valB;
  });

  const grandTotalVal = monthData.grand.total || 1;
  const maxProvTotal = Math.max(...monthData.provincias.map((p) => p.total), 1);

  // Chart setup
  useEffect(() => {
    if (!chartCanvasRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const chartData = [...provList].slice(0, 15);
    const labels = chartData.map((p) => p.name);
    const values = chartData.map((p) =>
      selectedField === 'secuestro' ? p.secuestro + (p.secuestroExt || 0) : (p as any)[selectedField] || 0
    );
    const bgColors = chartData.map((_, idx) => (idx === 0 ? '#2563EB' : '#60A5FA'));

    chartInstance.current = new Chart(chartCanvasRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: fieldLabels[selectedField],
            data: values,
            backgroundColor: bgColors,
            borderRadius: 4
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0F172A',
            padding: 10,
            callbacks: {
              label: (ctx) => ` ${fieldLabels[selectedField]}: ${Number(ctx.parsed.x).toLocaleString()}`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(226, 232, 240, 0.8)' },
            ticks: {
              color: '#64748B',
              callback: (v) => Number(v).toLocaleString()
            }
          },
          y: {
            grid: { display: false },
            ticks: {
              color: '#334155',
              font: { size: 11, family: "'Barlow', sans-serif", weight: 'bold' }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [provList, selectedField, sortOrder, currentYear, currentMonth]);

  return (
    <div className="space-y-6">
      {/* Control Filter Bar with soft background */}
      <div className="bg-white border border-slate-200/90 p-3.5 rounded-xl flex items-center justify-between flex-wrap gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Registro Provincial
            </span>
            <span className="text-xs font-bold uppercase tracking-tight text-slate-900">
              Incidencia por Provincia · {MESES_LABEL[currentMonth] || currentMonth} {currentYear}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search with soft input */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar provincia..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none w-28 sm:w-36 font-medium"
            />
          </div>

          {/* Metric Selector */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-bold uppercase">Métrica:</span>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value as any)}
              className="bg-transparent text-slate-900 text-xs font-bold outline-none cursor-pointer"
            >
              <option value="total" className="bg-white">Total General</option>
              <option value="robo" className="bg-white">Robos</option>
              <option value="extorsion" className="bg-white">Extorsiones</option>
              <option value="asesinato" className="bg-white">Asesinatos</option>
              <option value="secuestro" className="bg-white">Secuestros</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg p-0.5">
            <button
              onClick={() => setSortOrder('desc')}
              className={`p-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                sortOrder === 'desc' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Mayor a menor"
            >
              <ArrowDownNarrowWide className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setSortOrder('asc')}
              className={`p-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                sortOrder === 'asc' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Menor a mayor"
            >
              <ArrowUpNarrowWide className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Bar Chart (Top 15) */}
      <div className="bg-white border-t-4 border-blue-600 border border-slate-200 rounded-xl p-4.5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Ranking Territorial Comparativo
            </span>
            <h3 className="font-heading text-base font-bold text-slate-900 uppercase">
              {fieldLabels[selectedField]} — Provincias con Mayor Densidad
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full font-mono-numbers">
            Orden: {sortOrder === 'desc' ? 'Mayor a menor' : 'Menor a mayor'}
          </span>
        </div>

        <div className="relative h-80 sm:h-96">
          <canvas ref={chartCanvasRef} />
        </div>
      </div>

      {/* Complete Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="px-4.5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="font-heading text-sm font-bold uppercase tracking-wider text-slate-800">
            Tabla Detallada por Provincia ({provList.length} registradas)
          </span>
          <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg font-mono-numbers">
            {monthData.grand.total.toLocaleString()} incidentes totales
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-heading uppercase text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 w-12 text-center">#</th>
                <th className="py-3 px-3">Provincia</th>
                <th className="py-3 px-3 text-right">Robos</th>
                <th className="py-3 px-3 text-right">Extorsiones</th>
                <th className="py-3 px-3 text-right">Asesinatos</th>
                <th className="py-3 px-3 text-right">Secuestros</th>
                <th className="py-3 px-3 text-right font-bold text-slate-900">Total</th>
                <th className="py-3 px-3 w-44">% del Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono-numbers">
              {provList.map((p, idx) => {
                const pct = ((p.total / grandTotalVal) * 100).toFixed(1);
                const barWidth = Math.round((p.total / maxProvTotal) * 100);
                const isTop1 = idx === 0 && sortOrder === 'desc';

                return (
                  <tr
                    key={p.name}
                    className={`hover:bg-blue-50/40 transition-colors ${
                      isTop1 ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block w-5 h-5 rounded text-[10px] font-bold text-center leading-5 ${
                          isTop1
                            ? 'bg-blue-700 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-body font-bold text-slate-900">
                      {p.name}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-700">
                      {p.robo.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-amber-700 font-semibold">
                      {p.extorsion.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-rose-600 font-bold">
                      {p.asesinato.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-700">
                      {(p.secuestro + (p.secuestroExt || 0)).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-heading text-sm font-black text-slate-900">
                      {p.total.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isTop1 ? 'bg-blue-700' : 'bg-blue-500'
                            }`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-600 w-10 text-right font-bold">
                          {pct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

