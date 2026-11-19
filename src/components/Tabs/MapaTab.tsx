import React, { useState, useEffect, useRef } from 'react';
import { MonthData } from '../../types/crime';
import { EcuadorGoogleMap } from '../EcuadorGoogleMap';
import { EcuadorVectorMap } from '../EcuadorVectorMap';
import { Chart, registerables } from 'chart.js';
import { AlertTriangle, Layers, Map as MapIcon, Globe } from 'lucide-react';
import { MESES_LABEL } from '../../data/initialDb';

Chart.register(...registerables);

interface MapaTabProps {
  monthData: MonthData;
  currentYear: number;
  currentMonth: string;
  selectedProvince: string;
  onSelectProvince: (prov: string) => void;
}

export const MapaTab: React.FC<MapaTabProps> = ({
  monthData,
  currentYear,
  currentMonth,
  selectedProvince,
  onSelectProvince
}) => {
  const [selectedField, setSelectedField] = useState<'total' | 'robo' | 'extorsion' | 'asesinato' | 'secuestro'>('total');
  const [mapEngine, setMapEngine] = useState<'google' | 'vector'>('google');
  const barCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const barChartInstance = useRef<Chart | null>(null);

  const fieldLabels: Record<string, string> = {
    total: 'Total General',
    robo: 'Robos',
    extorsion: 'Extorsiones',
    asesinato: 'Asesinatos',
    secuestro: 'Secuestros'
  };

  const sortedProvs = [...monthData.provincias].sort((a, b) => {
    const valA = selectedField === 'secuestro' ? a.secuestro + (a.secuestroExt || 0) : (a as any)[selectedField] || 0;
    const valB = selectedField === 'secuestro' ? b.secuestro + (b.secuestroExt || 0) : (b as any)[selectedField] || 0;
    return valB - valA;
  });

  const top5 = sortedProvs.slice(0, 5);
  const totalInField = monthData.provincias.reduce((acc, p) => {
    return acc + (selectedField === 'secuestro' ? p.secuestro + (p.secuestroExt || 0) : (p as any)[selectedField] || 0);
  }, 0) || 1;

  // Chart setup
  useEffect(() => {
    if (!barCanvasRef.current) return;
    if (barChartInstance.current) barChartInstance.current.destroy();

    const labels = top5.map((p) => p.name);
    const data = top5.map((p) =>
      selectedField === 'secuestro' ? p.secuestro + (p.secuestroExt || 0) : (p as any)[selectedField] || 0
    );

    barChartInstance.current = new Chart(barCanvasRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: fieldLabels[selectedField],
            data,
            backgroundColor: ['#2563EB', '#0D9488', '#D97706', '#DC2626', '#64748B'],
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0F172A',
            padding: 10,
            callbacks: {
              label: (ctx) => ` ${Number(ctx.parsed.y).toLocaleString()} incidentes`
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
      if (barChartInstance.current) barChartInstance.current.destroy();
    };
  }, [top5, selectedField]);

  const top1 = top5[0];
  const top2 = top5[1];
  const top1Val = top1 ? (selectedField === 'secuestro' ? top1.secuestro + (top1.secuestroExt || 0) : (top1 as any)[selectedField] || 0) : 0;
  const top2Val = top2 ? (selectedField === 'secuestro' ? top2.secuestro + (top2.secuestroExt || 0) : (top2 as any)[selectedField] || 0) : 0;

  return (
    <div className="space-y-6">
      {/* Control selector bar with soft background */}
      <div className="bg-white border border-slate-200/80 p-3.5 rounded-xl shadow-xs flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Cartografía Operativa Nacional
            </span>
            <h3 className="font-heading text-sm font-bold text-slate-800 uppercase tracking-tight">
              Mapa de Calor Territorial · {MESES_LABEL[currentMonth] || currentMonth} {currentYear}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Map Engine Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setMapEngine('google')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                mapEngine === 'google'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Google Maps</span>
            </button>
            <button
              onClick={() => setMapEngine('vector')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                mapEngine === 'vector'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Vector 2D</span>
            </button>
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <span className="text-[11px] text-slate-500 font-semibold uppercase">Variable:</span>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="total">Total General</option>
              <option value="robo">Robos</option>
              <option value="extorsion">Extorsiones</option>
              <option value="asesinato">Asesinatos</option>
              <option value="secuestro">Secuestros</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map + Concentration Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Map Engine (7 cols) */}
        <div className="lg:col-span-7">
          {mapEngine === 'google' ? (
            <EcuadorGoogleMap
              provincias={monthData.provincias}
              selectedField={selectedField}
              onSelectProvince={onSelectProvince}
              selectedProvince={selectedProvince}
            />
          ) : (
            <EcuadorVectorMap
              provincias={monthData.provincias}
              selectedField={selectedField}
              onSelectProvince={onSelectProvince}
              selectedProvince={selectedProvince}
            />
          )}
        </div>

        {/* Right: Concentration & Analytics (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Top 5 Bar Chart */}
          <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs">
            <div className="border-b border-slate-100 pb-3 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Foco Territorial
              </span>
              <h4 className="font-heading text-base font-bold text-slate-900 uppercase">
                Top 5 Provincias · {fieldLabels[selectedField]}
              </h4>
            </div>

            <div className="relative h-60">
              <canvas ref={barCanvasRef} />
            </div>
          </div>

          {/* Concentration Ratio Card */}
          {top1 && top2 && (
            <div className="bg-linear-to-br from-amber-50/60 to-white border-l-4 border-amber-500 border border-amber-200/60 p-4.5 rounded-xl shadow-xs text-xs space-y-2.5">
              <div className="flex items-center gap-2 font-bold uppercase text-amber-900 tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Índice de Focalización Territorial</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                <strong className="text-amber-800 font-bold">{top1.name}</strong> acumula el{' '}
                <strong className="text-slate-900 font-mono-numbers font-bold">
                  {((top1Val / totalInField) * 100).toFixed(1)}%
                </strong>{' '}
                del total nacional de {fieldLabels[selectedField].toLowerCase()} ({top1Val.toLocaleString()} casos).
              </p>
              <p className="text-slate-700 leading-relaxed">
                En conjunto con <strong className="text-blue-700 font-bold">{top2.name}</strong> (
                {((top2Val / totalInField) * 100).toFixed(1)}%), ambas provincias concentran más del{' '}
                <strong className="text-amber-800 font-mono-numbers font-bold">
                  {(((top1Val + top2Val) / totalInField) * 100).toFixed(1)}%
                </strong>{' '}
                de los incidentes registrados en el país.
              </p>
            </div>
          )}

          {/* Selected Province Card if active */}
          {selectedProvince !== 'all' && (
            <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 text-xs shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-heading font-bold text-blue-900 uppercase text-sm">
                  Provincia Seleccionada: {selectedProvince}
                </span>
                <button
                  onClick={() => onSelectProvince('all')}
                  className="text-[11px] font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
                >
                  Restablecer Filtro
                </button>
              </div>
              <p className="text-blue-800/80 text-[11px] leading-relaxed">
                Todos los paneles, listas y métricas del tablero están filtrados mostrando exclusivamente la actividad registrada en la provincia de {selectedProvince}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

