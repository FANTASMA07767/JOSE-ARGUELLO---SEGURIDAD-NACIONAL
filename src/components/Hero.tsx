import React from 'react';
import { GrandTotal } from '../types/crime';
import { Shield, ShieldAlert, Target, AlertTriangle, Sparkles, Download, UploadCloud } from 'lucide-react';
import { downloadExcelTemplate } from '../utils/excelParser';
import { HandcuffsIcon } from './HandcuffsIcon';

interface HeroProps {
  currentYear: number;
  currentMonth: string;
  monthLabel: string;
  grandTotal: GrandTotal;
  isAiImported?: boolean;
  onOpenUpload: () => void;
  onOpenAiAdvisor: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  currentYear,
  currentMonth,
  monthLabel,
  grandTotal,
  isAiImported,
  onOpenUpload,
  onOpenAiAdvisor,
}) => {
  const tot = grandTotal.total || 1;
  const secTotal = grandTotal.secuestro + (grandTotal.secuestroExt || 0);

  return (
    <section
      className="relative border-b border-slate-200 overflow-hidden bg-white"
      style={{
        backgroundColor: '#ffffff',
        minHeight: '390px',
      }}
    >
      {/* Clean Tactical Ecuador Map - Single background element without stacked overlays */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-[55%] min-w-[540px] max-w-[920px] pointer-events-none z-0 overflow-hidden flex items-center justify-end"
        style={{
          maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 55%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 55%, transparent 100%)',
        }}
      >
        <img
          src="/mapa_ecuador_seguridad.jpg"
          alt="Mapa de Inteligencia Territorial Ecuador"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain object-right opacity-65 filter contrast-110"
        />
      </div>

      {/* Main Wide Container: 92% - 94%, max-w-[1650px] */}
      <div className="relative z-10 w-[92%] 2xl:w-[94%] max-w-[1650px] mx-auto py-8 lg:py-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 xl:gap-12 min-h-[380px] lg:min-h-[410px]">
        {/* Left Column: 45% Approx - Title, Description, Action Buttons */}
        <div className="w-full lg:w-[45%] flex-shrink-0 z-10">
          <div className="flex items-center gap-2 mb-2.5 text-xs font-bold uppercase tracking-wider text-blue-900">
            <span>Sistema Nacional de Estadísticas Criminales</span>
            <span>·</span>
            <span>Ecuador 2025–2026</span>
            {isAiImported && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] bg-blue-50 border border-blue-200 text-blue-700 font-bold shadow-2xs">
                <Sparkles className="w-3 h-3 text-blue-600" /> Datos Ingeridos con IA
              </span>
            )}
          </div>

          {/* Large Institutional Title: 42px - 52px, font-black, tight line-height */}
          <h1 className="font-heading text-3xl sm:text-4xl md:text-[42px] lg:text-[46px] xl:text-[50px] font-black uppercase text-slate-950 tracking-tight leading-[1.0] mb-3.5">
            ANALÍTICA DE DELITOS & <br className="hidden sm:inline" />
            <span className="text-[#1D4ED8]">SEGURIDAD NACIONAL</span>
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl mb-6">
            Monitoreo táctico criminal por provincia, franjas horarias y tipología penal. Homologación
            continua con reportes de Fiscalía General del Estado (FGE), SIAF y Observatorio OECO, con soporte para ingesta automatizada mensual de archivos en PDF, Imágenes o Excel.
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs hover:shadow-md active:scale-95 cursor-pointer ring-1 ring-blue-600"
            >
              <UploadCloud className="w-4 h-4" />
              Cargar Reporte (PDF, Imagen, Excel)
            </button>
            <button
              onClick={() => downloadExcelTemplate()}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-white/90 hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 backdrop-blur-xs"
              title="Descargar formato Excel para rellenar nuevos meses"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Plantilla Excel
            </button>
            <button
              onClick={onOpenAiAdvisor}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-blue-50/90 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 backdrop-blur-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Briefing IA Táctico
            </button>
          </div>
        </div>

        {/* Right Column: 55% Approx - 5 Key Intelligence Modules (KPIs) */}
        <div className="w-full lg:w-[55%] z-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 w-full">
            {/* 1. TOTAL INCIDENTES (Color: AZUL) */}
            <div
              className="relative min-h-[142px] sm:min-h-[150px] p-3.5 sm:p-4 flex flex-col justify-between group overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'rgba(255, 255, 255, 0.88)',
                border: '1px solid rgba(40, 100, 180, 0.15)',
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(30, 70, 130, 0.08)',
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-[0_0_12px_rgba(29,78,216,0.22)]">
                  <Shield className="w-4.5 h-4.5" />
                </div>
                <span className="text-[10px] font-bold text-blue-800 bg-blue-50/90 border border-blue-200/80 px-2 py-0.5 rounded font-mono-numbers">
                  {monthLabel}
                </span>
              </div>
              <div>
                <div className="font-heading text-2xl sm:text-[28px] lg:text-[30px] font-black text-blue-950 font-mono-numbers leading-tight my-1 tracking-tight">
                  {grandTotal.total.toLocaleString()}
                </div>
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Total Incidentes
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  Período {currentYear}
                </div>
              </div>
              {/* Subtle watermark & 4px bottom accent */}
              <Shield className="w-16 h-16 opacity-[0.04] text-blue-800 absolute -right-3 -bottom-3 pointer-events-none transition-transform group-hover:scale-105" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1D4ED8]" />
            </div>

            {/* 2. ROBOS (Color: AZUL) */}
            <div
              className="relative min-h-[142px] sm:min-h-[150px] p-3.5 sm:p-4 flex flex-col justify-between group overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'rgba(255, 255, 255, 0.88)',
                border: '1px solid rgba(40, 100, 180, 0.15)',
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(30, 70, 130, 0.08)',
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-[0_0_12px_rgba(37,99,235,0.22)]">
                  <ShieldAlert className="w-4.5 h-4.5" />
                </div>
                <span className="text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-mono-numbers">
                  {((grandTotal.robo / tot) * 100).toFixed(0)}%
                </span>
              </div>
              <div>
                <div className="font-heading text-2xl sm:text-[28px] lg:text-[30px] font-black text-blue-900 font-mono-numbers leading-tight my-1 tracking-tight">
                  {grandTotal.robo.toLocaleString()}
                </div>
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Robos
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {monthLabel}
                </div>
              </div>
              <ShieldAlert className="w-16 h-16 opacity-[0.04] text-blue-700 absolute -right-3 -bottom-3 pointer-events-none transition-transform group-hover:scale-105" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2563EB]" />
            </div>

            {/* 3. ASESINATOS (Color: ROJO) */}
            <div
              className="relative min-h-[142px] sm:min-h-[150px] p-3.5 sm:p-4 flex flex-col justify-between group overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'rgba(255, 255, 255, 0.88)',
                border: '1px solid rgba(40, 100, 180, 0.15)',
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(30, 70, 130, 0.08)',
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-[0_0_12px_rgba(220,38,38,0.22)]">
                  <Target className="w-4.5 h-4.5" />
                </div>
                <span className="text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-mono-numbers">
                  {((grandTotal.asesinato / tot) * 100).toFixed(0)}%
                </span>
              </div>
              <div>
                <div className="font-heading text-2xl sm:text-[28px] lg:text-[30px] font-black text-rose-600 font-mono-numbers leading-tight my-1 tracking-tight">
                  {grandTotal.asesinato.toLocaleString()}
                </div>
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Asesinatos
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {monthLabel}
                </div>
              </div>
              <Target className="w-16 h-16 opacity-[0.04] text-rose-600 absolute -right-3 -bottom-3 pointer-events-none transition-transform group-hover:scale-105" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#DC2626]" />
            </div>

            {/* 4. EXTORSIONES (Color: NARANJA) */}
            <div
              className="relative min-h-[142px] sm:min-h-[150px] p-3.5 sm:p-4 flex flex-col justify-between group overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'rgba(255, 255, 255, 0.88)',
                border: '1px solid rgba(40, 100, 180, 0.15)',
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(30, 70, 130, 0.08)',
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shadow-[0_0_12px_rgba(234,88,12,0.22)]">
                  <AlertTriangle className="w-4.5 h-4.5" />
                </div>
                <span className="text-[11px] font-bold text-orange-800 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded font-mono-numbers">
                  {((grandTotal.extorsion / tot) * 100).toFixed(0)}%
                </span>
              </div>
              <div>
                <div className="font-heading text-2xl sm:text-[28px] lg:text-[30px] font-black text-orange-600 font-mono-numbers leading-tight my-1 tracking-tight">
                  {grandTotal.extorsion.toLocaleString()}
                </div>
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Extorsiones
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {monthLabel}
                </div>
              </div>
              <AlertTriangle className="w-16 h-16 opacity-[0.04] text-orange-600 absolute -right-3 -bottom-3 pointer-events-none transition-transform group-hover:scale-105" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#EA580C]" />
            </div>

            {/* 5. SECUESTROS (Color: VERDE) */}
            <div
              className="relative min-h-[142px] sm:min-h-[150px] p-3.5 sm:p-4 flex flex-col justify-between group overflow-hidden transition-all duration-200 hover:-translate-y-0.5 col-span-2 sm:col-span-1"
              style={{
                background: 'rgba(255, 255, 255, 0.88)',
                border: '1px solid rgba(40, 100, 180, 0.15)',
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(30, 70, 130, 0.08)',
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-[0_0_12px_rgba(22,163,74,0.22)]">
                  <HandcuffsIcon className="w-4.5 h-4.5" />
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono-numbers">
                  {((secTotal / tot) * 100).toFixed(0)}%
                </span>
              </div>
              <div>
                <div className="font-heading text-2xl sm:text-[28px] lg:text-[30px] font-black text-emerald-700 font-mono-numbers leading-tight my-1 tracking-tight">
                  {secTotal.toLocaleString()}
                </div>
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Secuestros
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {monthLabel}
                </div>
              </div>
              <HandcuffsIcon className="w-16 h-16 opacity-[0.04] text-emerald-600 absolute -right-3 -bottom-3 pointer-events-none transition-transform group-hover:scale-105" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#16A34A]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
