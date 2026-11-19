import React, { useEffect, useRef } from 'react';
import { MonthData } from '../../types/crime';
import { Chart, registerables } from 'chart.js';
import {
  Shield,
  ShieldAlert,
  Target,
  AlertTriangle,
  AlertOctagon,
  FileText,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Newspaper,
  ArrowRight
} from 'lucide-react';
import { MESES_LABEL } from '../../data/initialDb';
import { HandcuffsIcon } from '../HandcuffsIcon';

Chart.register(...registerables);

interface ResumenTabProps {
  monthData: MonthData;
  allMonthsInYear: Record<string, MonthData>;
  currentYear: number;
  currentMonth: string;
  selectedProvince: string;
  previousMonthData?: {
    label: string;
    grand: {
      robo: number;
      secuestro: number;
      asesinato: number;
      extorsion: number;
      secuestroExt?: number;
      extorsionSexual?: number;
      total: number;
    };
  } | null;
  onSelectProvince: (prov: string) => void;
  onOpenAiAdvisor: () => void;
  onNavigateToNews?: () => void;
}

export const ResumenTab: React.FC<ResumenTabProps> = ({
  monthData,
  allMonthsInYear,
  currentYear,
  currentMonth,
  selectedProvince,
  previousMonthData,
  onSelectProvince,
  onOpenAiAdvisor,
  onNavigateToNews
}) => {
  const donutCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const trendCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const donutChartInstance = useRef<Chart | null>(null);
  const trendChartInstance = useRef<Chart | null>(null);

  const grand = monthData.grand;
  const tot = grand.total || 1;

  // Initialize and update charts
  useEffect(() => {
    // 1. Donut Chart
    if (donutCanvasRef.current) {
      if (donutChartInstance.current) donutChartInstance.current.destroy();

      const secTotal = grand.secuestro + (grand.secuestroExt || 0);

      donutChartInstance.current = new Chart(donutCanvasRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Robos', 'Extorsiones', 'Asesinatos', 'Secuestros'],
          datasets: [
            {
              data: [grand.robo, grand.extorsion, grand.asesinato, secTotal],
              backgroundColor: ['#2563EB', '#D97706', '#DC2626', '#0D9488'],
              borderColor: '#FFFFFF',
              borderWidth: 3,
              hoverOffset: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '72%',
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0F172A',
              padding: 10,
              callbacks: {
                label: (ctx) => {
                  const val = Number(ctx.parsed);
                  return ` ${ctx.label}: ${val.toLocaleString()} (${((val / tot) * 100).toFixed(1)}%)`;
                }
              }
            }
          }
        }
      });
    }

    // 2. Trend Line Chart
    if (trendCanvasRef.current) {
      if (trendChartInstance.current) trendChartInstance.current.destroy();

      const monthKeys = Object.keys(allMonthsInYear);
      const labels = monthKeys.map((k) => MESES_LABEL[k] || k);
      const totals = monthKeys.map((k) => allMonthsInYear[k].grand.total);
      const robos = monthKeys.map((k) => allMonthsInYear[k].grand.robo);

      trendChartInstance.current = new Chart(trendCanvasRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Total General',
              data: totals,
              borderColor: '#2563EB',
              backgroundColor: 'rgba(37, 99, 235, 0.08)',
              tension: 0.35,
              fill: true,
              pointBackgroundColor: '#2563EB',
              pointRadius: 4,
              borderWidth: 2.5
            },
            {
              label: 'Robos',
              data: robos,
              borderColor: '#64748B',
              backgroundColor: 'transparent',
              tension: 0.35,
              fill: false,
              pointBackgroundColor: '#64748B',
              pointRadius: 3,
              borderWidth: 1.8,
              borderDash: [4, 4]
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
              ticks: { color: '#64748B', font: { size: 10 } }
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
      if (donutChartInstance.current) donutChartInstance.current.destroy();
      if (trendChartInstance.current) trendChartInstance.current.destroy();
    };
  }, [monthData, allMonthsInYear, currentYear, currentMonth]);

  // Top 5 provinces
  const topProvinces = [...monthData.provincias].sort((a, b) => b.total - a.total).slice(0, 5);

  const prevGrand = previousMonthData?.grand;
  const secTotal = grand.secuestro + (grand.secuestroExt || 0);
  const prevSecTotal = prevGrand ? (prevGrand.secuestro + (prevGrand.secuestroExt || 0)) : undefined;

  // Render statistical trend indicator (green down arrow / red up arrow)
  const renderTrendIndicator = (
    current: number,
    previous: number | undefined,
    prevLabel: string | undefined
  ) => {
    if (previous === undefined || !prevLabel) {
      return (
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-medium">Línea base</span>
          <span className="font-mono-numbers text-[10px]">Sin mes anterior</span>
        </div>
      );
    }

    const diff = current - previous;
    const pct = previous > 0 ? (diff / previous) * 100 : 0;
    const isZero = diff === 0;
    const isCrimeDown = diff < 0; // In crime security, lower crime is favorable / green

    return (
      <div
        className={`mt-2.5 pt-2 border-t ${
          isCrimeDown
            ? 'border-emerald-100'
            : isZero
            ? 'border-slate-100'
            : 'border-rose-100'
        } flex items-center justify-between gap-1.5 text-[11px]`}
      >
        <div
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-black font-mono-numbers ${
            isCrimeDown
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/90'
              : isZero
              ? 'bg-slate-100 text-slate-600 border border-slate-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200/90'
          }`}
          title={`Variación porcentual respecto a ${prevLabel}`}
        >
          {isCrimeDown ? (
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
          ) : isZero ? (
            <Minus className="w-3.5 h-3.5 text-slate-400 shrink-0 stroke-[2.5]" />
          ) : (
            <TrendingUp className="w-3.5 h-3.5 text-rose-600 shrink-0 stroke-[2.5]" />
          )}
          <span>
            {isCrimeDown
              ? `↓ -${Math.abs(pct).toFixed(1)}%`
              : isZero
              ? `0.0%`
              : `↑ +${pct.toFixed(1)}%`}
          </span>
        </div>

        <span
          className={`font-mono-numbers font-bold text-[10.5px] truncate max-w-[130px] ${
            isCrimeDown
              ? 'text-emerald-700'
              : isZero
              ? 'text-slate-400'
              : 'text-rose-700'
          }`}
          title={`${diff > 0 ? `+${diff.toLocaleString()}` : diff.toLocaleString()} casos vs. ${prevLabel}`}
        >
          {isCrimeDown
            ? `${Math.abs(diff).toLocaleString()} menos vs ${prevLabel}`
            : isZero
            ? `Sin cambio vs ${prevLabel}`
            : `+${diff.toLocaleString()} más vs ${prevLabel}`}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Shortcut Banner to Ecuador National Security News Section & OECO Live Sync */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-700/80 rounded-xl p-3.5 sm:p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-blue-300 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Monitoreo OECO & Prensa Criminal en Vivo</span>
              <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                Lectura 1 vez/día activa · 2026 & Decomisos
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium">
              Sincronización automatizada con OECO: análisis de delitos 2026, toneladas de alcaloides incautadas y armamento táctico.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToNews}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shrink-0 shadow-xs cursor-pointer group active:scale-95"
        >
          <Newspaper className="w-4 h-4 text-blue-200 group-hover:scale-110 transition-transform" />
          <span>Acceso Directo: OECO & Noticias</span>
          <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 4 Main KPI Cards with Domain-Native Aesthetics and Trend Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Robos */}
        <div className="relative bg-white/95 backdrop-blur-xs border border-slate-200/90 p-6 rounded-[14px] shadow-[0_8px_25px_rgba(30,70,130,0.06)] hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group hover:border-blue-300">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8.5 h-8.5 rounded-lg bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-700 shadow-2xs">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <span className="font-heading text-sm font-bold uppercase tracking-wider text-slate-800">
                  Delitos de Robo
                </span>
              </div>
              <span className="text-xs text-blue-800 bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full font-mono-numbers font-bold">
                {((grand.robo / tot) * 100).toFixed(1)}% total
              </span>
            </div>

            <div className="font-heading text-4xl sm:text-[44px] lg:text-[48px] font-black text-slate-900 font-mono-numbers tracking-tight my-2.5 leading-none">
              {grand.robo.toLocaleString()}
            </div>

            {/* Indicador de Tendencia (Mes Actual vs Mes Anterior) */}
            {renderTrendIndicator(grand.robo, prevGrand?.robo, previousMonthData?.label)}

            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2.5">
              Personas, vehículos, domicilios y unidades económicas
            </p>
          </div>

          {/* Subtle Watermark & Bottom Accent Border */}
          <ShieldAlert className="w-28 h-28 opacity-[0.05] text-blue-700 absolute -right-3 -bottom-3 pointer-events-none transition-transform group-hover:scale-105" />
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-blue-600 rounded-b-[14px] shadow-[0_-1px_6px_rgba(37,99,235,0.3)]" />
        </div>

        {/* Extorsiones */}
        <div className="relative bg-white/95 backdrop-blur-xs border border-slate-200/90 p-6 rounded-[14px] shadow-[0_8px_25px_rgba(30,70,130,0.06)] hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group hover:border-amber-300">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8.5 h-8.5 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shadow-2xs">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <span className="font-heading text-sm font-bold uppercase tracking-wider text-slate-800">
                  Extorsión
                </span>
              </div>
              <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full font-mono-numbers font-bold">
                {((grand.extorsion / tot) * 100).toFixed(1)}% total
              </span>
            </div>

            <div className="font-heading text-4xl sm:text-[44px] lg:text-[48px] font-black text-amber-700 font-mono-numbers tracking-tight my-2.5 leading-none">
              {grand.extorsion.toLocaleString()}
            </div>

            {/* Indicador de Tendencia (Mes Actual vs Mes Anterior) */}
            {renderTrendIndicator(grand.extorsion, prevGrand?.extorsion, previousMonthData?.label)}

            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2.5">
              Vacunas extorsivas, cobro de piso y extorsión virtual
            </p>
          </div>

          {/* Subtle Watermark & Bottom Accent Border */}
          <AlertTriangle className="w-28 h-28 opacity-[0.05] text-amber-600 absolute -right-3 -bottom-3 pointer-events-none transition-transform group-hover:scale-105" />
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-amber-500 rounded-b-[14px] shadow-[0_-1px_6px_rgba(245,158,11,0.3)]" />
        </div>

        {/* Asesinatos (Target / Crosshair Icon) */}
        <div className="relative bg-white/95 backdrop-blur-xs border border-slate-200/90 p-6 rounded-[14px] shadow-[0_8px_25px_rgba(30,70,130,0.06)] hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group hover:border-rose-300">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8.5 h-8.5 rounded-lg bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shadow-2xs">
                  <Target className="w-5 h-5" />
                </div>
                <span className="font-heading text-sm font-bold uppercase tracking-wider text-slate-800">
                  Homicidios / Asesinatos
                </span>
              </div>
              <span className="text-xs text-rose-800 bg-rose-50 border border-rose-200/80 px-2.5 py-0.5 rounded-full font-mono-numbers font-bold">
                {((grand.asesinato / tot) * 100).toFixed(1)}% total
              </span>
            </div>

            <div className="font-heading text-4xl sm:text-[44px] lg:text-[48px] font-black text-rose-700 font-mono-numbers tracking-tight my-2.5 leading-none">
              {grand.asesinato.toLocaleString()}
            </div>

            {/* Indicador de Tendencia (Mes Actual vs Mes Anterior) */}
            {renderTrendIndicator(grand.asesinato, prevGrand?.asesinato, previousMonthData?.label)}

            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2.5">
              Muertes violentas y sicariato intencional investigado
            </p>
          </div>

          {/* Subtle Watermark & Bottom Accent Border */}
          <Target className="w-28 h-28 opacity-[0.06] text-rose-600 absolute -right-3 -bottom-3 pointer-events-none transition-transform group-hover:scale-105" />
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-rose-600 rounded-b-[14px] shadow-[0_-1px_6px_rgba(225,29,72,0.3)]" />
        </div>

        {/* Secuestros (Verde / Emerald) */}
        <div className="relative bg-white/95 backdrop-blur-xs border border-slate-200/90 p-6 rounded-[14px] shadow-[0_8px_25px_rgba(30,70,130,0.06)] hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group hover:border-emerald-300">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8.5 h-8.5 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-2xs">
                  <HandcuffsIcon className="w-5 h-5" />
                </div>
                <span className="font-heading text-sm font-bold uppercase tracking-wider text-slate-800">
                  Secuestro Total
                </span>
              </div>
              <span className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full font-mono-numbers font-bold">
                {((secTotal / tot) * 100).toFixed(1)}%
              </span>
            </div>

            <div className="font-heading text-4xl sm:text-[44px] lg:text-[48px] font-black text-emerald-700 font-mono-numbers tracking-tight my-2.5 leading-none">
              {secTotal.toLocaleString()}
            </div>

            {/* Indicador de Tendencia (Mes Actual vs Mes Anterior) */}
            {renderTrendIndicator(secTotal, prevSecTotal, previousMonthData?.label)}

            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2.5">
              {grand.secuestroExt
                ? `${grand.secuestro} Simples · ${grand.secuestroExt} Extorsivos`
                : 'Casos investigados a escala nacional'}
            </p>
          </div>

          {/* Subtle Watermark & Bottom Accent Border */}
          <HandcuffsIcon className="w-28 h-28 opacity-[0.06] text-emerald-700 absolute -right-3 -bottom-3 pointer-events-none transition-transform group-hover:scale-105" />
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-emerald-600 rounded-b-[14px] shadow-[0_-1px_6px_rgba(16,185,129,0.3)]" />
        </div>
      </div>

      {/* 2 Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Donut Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Distribución Porcentual
              </span>
              <h3 className="font-heading text-base font-bold text-slate-900 uppercase">
                Tipos de Delito · {MESES_LABEL[currentMonth] || currentMonth} {currentYear}
              </h3>
            </div>
          </div>

          <div className="relative h-60">
            <canvas ref={donutCanvasRef} />
          </div>

          {/* Legend Details */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#2563EB]"></span>
              <span className="text-slate-600 font-medium">Robos:</span>
              <span className="font-mono-numbers font-bold text-slate-900 ml-auto">
                {((grand.robo / tot) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#D97706]"></span>
              <span className="text-slate-600 font-medium">Extorsión:</span>
              <span className="font-mono-numbers font-bold text-slate-900 ml-auto">
                {((grand.extorsion / tot) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#DC2626]"></span>
              <span className="text-slate-600 font-medium">Asesinatos:</span>
              <span className="font-mono-numbers font-bold text-slate-900 ml-auto">
                {((grand.asesinato / tot) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#0D9488]"></span>
              <span className="text-slate-600 font-medium">Secuestros:</span>
              <span className="font-mono-numbers font-bold text-slate-900 ml-auto">
                {(((grand.secuestro + (grand.secuestroExt || 0)) / tot) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Right: Trend Evolution (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Evolución Temporal
              </span>
              <h3 className="font-heading text-base font-bold text-slate-900 uppercase">
                Tendencia Mensual {currentYear}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onNavigateToNews}
                className="text-xs text-slate-700 hover:text-blue-800 bg-slate-50 hover:bg-blue-50/70 border border-slate-200/90 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-bold cursor-pointer transition-colors shadow-2xs"
                title="Ir a la sección de noticias de seguridad nacional en OECO"
              >
                <Newspaper className="w-3.5 h-3.5 text-blue-600" />
                <span>Noticias de Seguridad</span>
              </button>
              <button
                onClick={onOpenAiAdvisor}
                className="text-xs text-blue-700 hover:text-blue-900 flex items-center gap-1 font-bold cursor-pointer"
              >
                <span>Auditar con IA</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="relative h-60">
            <canvas ref={trendCanvasRef} />
          </div>

          {/* Quick takeaway note */}
          <div className="mt-4 p-3 bg-blue-50/70 border-l-4 border-blue-600 rounded-r-xl text-xs text-slate-700 flex items-start gap-2.5">
            <AlertOctagon className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 font-bold">Patrón Operativo:</strong> En {currentYear}, el robo
              continúa como el delito de mayor volumen (~75% del total nacional), mientras que el
              asesinato y la extorsión muestran picos correlacionados en zonas con presencia de
              grupos de delincuencia organizada.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Top 5 Hotspot Provinces & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Concentración Geográfica Crítica
              </span>
              <h3 className="font-heading text-base font-bold text-slate-900 uppercase">
                Top 5 Provincias con Mayor Incidencia · {MESES_LABEL[currentMonth] || currentMonth}
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full font-mono-numbers">
              {topProvinces.reduce((a, b) => a + b.total, 0).toLocaleString()} delitos en Top 5
            </span>
          </div>

          <div className="space-y-2.5">
            {topProvinces.map((prov, idx) => {
              const pct = ((prov.total / tot) * 100).toFixed(1);
              return (
                <div
                  key={prov.name}
                  onClick={() => onSelectProvince(prov.name)}
                  className="p-3 bg-slate-50/70 hover:bg-blue-50/50 border border-slate-200/80 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black font-condensed ${
                        idx === 0 ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <div>
                      <span className="font-heading font-bold text-slate-900 text-base">
                        {prov.name}
                      </span>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 font-medium">
                        <span>Robo: {prov.robo.toLocaleString()}</span>
                        <span>·</span>
                        <span className="text-rose-600 font-bold">Asesinato: {prov.asesinato.toLocaleString()}</span>
                        <span>·</span>
                        <span className="text-amber-700 font-bold">Extorsión: {prov.extorsion.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-heading font-black text-xl text-slate-900 font-mono-numbers">
                      {prov.total.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-blue-700 font-mono-numbers font-bold">
                      {pct}% del país
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Quick Briefing Card */}
        <div className="lg:col-span-4 bg-linear-to-b from-blue-50/60 to-white border border-blue-200 rounded-xl p-4.5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-800 mb-2">
              <Shield className="w-4 h-4 text-blue-700" />
              <span>Centro de Inteligencia Operativa</span>
            </div>
            <h4 className="font-heading text-lg font-bold text-slate-900 uppercase leading-tight mb-2">
              Auditoría Automatizada de Seguridad
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              El motor de IA evalúa correlaciones entre zonas rurales y urbanas, captura flagrante y franjas
              horarias críticas para generar recomendaciones directas para escoltas y coordinadores de
              seguridad privada.
            </p>
            <div className="space-y-2 text-[11px] text-slate-600 border-t border-blue-100 pt-3 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Ingesta Excel con normalización automática</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Mapeo en Google Maps con pines tácticos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Evaluación de amenaza y directivas preventivas</span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenAiAdvisor}
            className="w-full mt-4 py-2.5 px-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <FileText className="w-4 h-4" />
            <span>Abrir Informe Estratégico IA</span>
          </button>
        </div>
      </div>
    </div>
  );
};

