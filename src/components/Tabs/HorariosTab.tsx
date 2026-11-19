import React, { useState, useEffect, useRef } from 'react';
import { MonthData } from '../../types/crime';
import { Chart, registerables } from 'chart.js';
import { Clock, Moon, Sun, Sunset, AlertCircle } from 'lucide-react';
import { MESES_LABEL } from '../../data/initialDb';

Chart.register(...registerables);

interface HorariosTabProps {
  monthData: MonthData;
  currentYear: number;
  currentMonth: string;
}

export const HorariosTab: React.FC<HorariosTabProps> = ({
  monthData,
  currentYear,
  currentMonth
}) => {
  const [selectedField, setSelectedField] = useState<'all' | 'robo' | 'extorsion' | 'asesinato' | 'secuestro'>('all');
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const hor = monthData.horarios;
  const franjas = [
    { key: 'madrugada', label: 'Madrugada', hours: '00:00–05:00 hrs', icon: Moon, headerBg: 'bg-slate-800 text-white', accent: 'text-blue-200' },
    { key: 'manana', label: 'Mañana', hours: '05:00–12:00 hrs', icon: Sun, headerBg: 'bg-blue-700 text-white', accent: 'text-blue-100' },
    { key: 'tarde', label: 'Tarde', hours: '12:00–18:00 hrs', icon: Sunset, headerBg: 'bg-amber-600 text-white', accent: 'text-amber-100' },
    { key: 'noche', label: 'Noche', hours: '18:00–00:00 hrs', icon: Moon, headerBg: 'bg-slate-900 text-white', accent: 'text-slate-300' }
  ];

  const totalAllSlots = franjas.reduce((acc, f) => {
    const s = (hor as any)[f.key];
    return acc + (s ? s.robo + s.extorsion + s.asesinato + s.secuestro : 0);
  }, 0) || 1;

  // Chart setup
  useEffect(() => {
    if (!chartCanvasRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const labels = ['Madrugada (00-05h)', 'Mañana (05-12h)', 'Tarde (12-18h)', 'Noche (18-24h)'];
    let datasets: any[] = [];

    if (selectedField === 'all') {
      datasets = [
        {
          label: 'Robo',
          data: [hor.madrugada?.robo || 0, hor.manana?.robo || 0, hor.tarde?.robo || 0, hor.noche?.robo || 0],
          backgroundColor: '#2563EB',
          borderRadius: 3
        },
        {
          label: 'Extorsión',
          data: [hor.madrugada?.extorsion || 0, hor.manana?.extorsion || 0, hor.tarde?.extorsion || 0, hor.noche?.extorsion || 0],
          backgroundColor: '#D97706',
          borderRadius: 3
        },
        {
          label: 'Asesinato',
          data: [hor.madrugada?.asesinato || 0, hor.manana?.asesinato || 0, hor.tarde?.asesinato || 0, hor.noche?.asesinato || 0],
          backgroundColor: '#DC2626',
          borderRadius: 3
        },
        {
          label: 'Secuestro',
          data: [hor.madrugada?.secuestro || 0, hor.manana?.secuestro || 0, hor.tarde?.secuestro || 0, hor.noche?.secuestro || 0],
          backgroundColor: '#64748B',
          borderRadius: 3
        }
      ];
    } else {
      const colorMap: Record<string, string> = {
        robo: '#2563EB',
        extorsion: '#D97706',
        asesinato: '#DC2626',
        secuestro: '#64748B'
      };
      const labelMap: Record<string, string> = {
        robo: 'Robos',
        extorsion: 'Extorsiones',
        asesinato: 'Asesinatos',
        secuestro: 'Secuestros'
      };

      datasets = [
        {
          label: labelMap[selectedField],
          data: [
            (hor.madrugada as any)?.[selectedField] || 0,
            (hor.manana as any)?.[selectedField] || 0,
            (hor.tarde as any)?.[selectedField] || 0,
            (hor.noche as any)?.[selectedField] || 0
          ],
          backgroundColor: colorMap[selectedField],
          borderRadius: 4
        }
      ];
    }

    chartInstance.current = new Chart(chartCanvasRef.current, {
      type: 'bar',
      data: { labels, datasets },
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
            ticks: { color: '#475569', font: { size: 11, weight: 'bold' } }
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

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [hor, selectedField]);

  return (
    <div className="space-y-6">
      {/* Control Selector Bar with soft background */}
      <div className="bg-white border border-slate-200/90 p-3.5 rounded-xl flex items-center justify-between flex-wrap gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Cronología Operativa
            </span>
            <span className="text-xs font-bold uppercase tracking-tight text-slate-900">
              Distribución Temporal por Franja Horaria · {MESES_LABEL[currentMonth] || currentMonth} {currentYear}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 font-bold uppercase">Filtrar Delito:</span>
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer shadow-2xs"
          >
            <option value="all">Todos los Delitos</option>
            <option value="robo">Robos</option>
            <option value="extorsion">Extorsiones</option>
            <option value="asesinato">Asesinatos</option>
            <option value="secuestro">Secuestros</option>
          </select>
        </div>
      </div>

      {/* 4 Time Slot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {franjas.map((f) => {
          const slot = (hor as any)[f.key] || { robo: 0, extorsion: 0, asesinato: 0, secuestro: 0 };
          const slotTot = slot.robo + slot.extorsion + slot.asesinato + slot.secuestro;
          const slotPct = ((slotTot / totalAllSlots) * 100).toFixed(1);

          return (
            <div
              key={f.key}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col"
            >
              <div className={`p-3.5 ${f.headerBg} flex items-center justify-between`}>
                <div>
                  <div className="font-heading text-base font-bold uppercase tracking-wider">
                    {f.label}
                  </div>
                  <div className={`text-[10px] ${f.accent} font-mono-numbers font-medium`}>{f.hours}</div>
                </div>
                <div className="text-right">
                  <div className="font-heading text-2xl font-black font-mono-numbers text-white">
                    {slotTot.toLocaleString()}
                  </div>
                  <div className={`text-[10px] ${f.accent} font-mono-numbers font-bold`}>
                    {slotPct}% del total
                  </div>
                </div>
              </div>

              <div className="p-3.5 space-y-2 text-xs font-mono-numbers flex-1 flex flex-col justify-center bg-slate-50/40">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500 font-sans font-medium">Robos:</span>
                  <span className="font-bold text-slate-800">{slot.robo.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500 font-sans font-medium">Extorsiones:</span>
                  <span className="font-bold text-amber-700">{slot.extorsion.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500 font-sans font-medium">Asesinatos:</span>
                  <span className="font-bold text-rose-600">{slot.asesinato.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-slate-500 font-sans font-medium">Secuestros:</span>
                  <span className="font-bold text-slate-700">{slot.secuestro.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Chart */}
      <div className="bg-white border-t-4 border-blue-600 border border-slate-200 rounded-xl p-4.5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Patrón de Actividad Delictiva
            </span>
            <h3 className="font-heading text-base font-bold text-slate-900 uppercase">
              Incidentes por Franja Horaria · Nacional
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full font-mono-numbers">
            {totalAllSlots.toLocaleString()} incidentes clasificados
          </span>
        </div>

        <div className="relative h-72">
          <canvas ref={chartCanvasRef} />
        </div>
      </div>

      {/* Provincial Hourly Breakdown Table (Tabla 6 de la FGE) */}
      {monthData.horariosProv && monthData.horariosProv.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Tabla Oficial SIAF / FGE
              </span>
              <h3 className="font-heading text-base font-bold text-slate-900 uppercase">
                Noticias del Delito por Grupo Horario según Provincia
              </h3>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full font-mono-numbers">
              {monthData.horariosProv.length} Provincias
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs font-mono-numbers">
              <thead className="bg-slate-50 text-slate-700 text-[10px] uppercase font-heading border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Provincia</th>
                  <th className="py-2.5 px-3 text-right">Madrugada (00–05h)</th>
                  <th className="py-2.5 px-3 text-right">Mañana (05–12h)</th>
                  <th className="py-2.5 px-3 text-right">Tarde (12–18h)</th>
                  <th className="py-2.5 px-3 text-right">Noche (18–24h)</th>
                  <th className="py-2.5 px-3 text-right font-bold text-slate-900">Total NDD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {monthData.horariosProv.map((hp) => (
                  <tr key={hp.prov} className="hover:bg-blue-50/30">
                    <td className="py-2 px-3 font-body font-bold text-slate-900">{hp.prov}</td>
                    <td className="py-2 px-3 text-right">{hp.mad.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right">{hp.man.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-amber-700 font-semibold">{hp.tar.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-900">{hp.noc.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-bold text-blue-900 bg-slate-50/50">{hp.tot.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100/80 font-bold border-t border-slate-200 text-slate-900">
                <tr>
                  <td className="py-2.5 px-3 uppercase text-[11px] font-sans">Total Nacional FGE</td>
                  <td className="py-2.5 px-3 text-right">
                    {monthData.horariosProv.reduce((a, b) => a + b.mad, 0).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {monthData.horariosProv.reduce((a, b) => a + b.man, 0).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right text-amber-700">
                    {monthData.horariosProv.reduce((a, b) => a + b.tar, 0).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {monthData.horariosProv.reduce((a, b) => a + b.noc, 0).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right text-blue-900 font-black">
                    {monthData.horariosProv.reduce((a, b) => a + b.tot, 0).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Tactical Operational Advice Card */}
      <div className="bg-blue-50/80 border-l-4 border-blue-600 border border-blue-200 p-4.5 rounded-xl text-xs space-y-2.5 shadow-xs">
        <div className="flex items-center gap-2 font-bold uppercase text-blue-950 tracking-wider">
          <AlertCircle className="w-4 h-4 text-blue-700" />
          <span>Directivas de Protección Física & Despliegue según Franja</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700 leading-relaxed pt-1">
          <div>
            <strong className="text-blue-900 font-bold">Tarde (12:00–18:00) y Noche (18:00–00:00):</strong> Mayor
            concentración acumulada de robos y extorsiones presenciales coincidiendo con horas pico comerciales,
            cierre de negocios bancarios y traslados de personal.
          </div>
          <div>
            <strong className="text-rose-700 font-bold">Madrugada (00:00–05:00):</strong> Aunque el volumen general es menor,
            presenta la mayor letalidad proporcional en casos de sicariato selectivo y secuestros en ejes viales
            interprovinciales.
          </div>
        </div>
      </div>
    </div>
  );
};

