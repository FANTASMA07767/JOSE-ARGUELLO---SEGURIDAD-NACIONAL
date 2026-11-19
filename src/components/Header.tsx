import React from 'react';
import { Shield, ShieldAlert, Target, AlertTriangle } from 'lucide-react';
import { HandcuffsIcon } from './HandcuffsIcon';

interface HeaderProps {
  currentYear?: number;
  currentMonth?: string;
  onOpenUpload?: () => void;
  onOpenAiAdvisor?: () => void;
  activeTab?: string;
  onSelectTab?: (tabId: string) => void;
  availableMonths?: string[];
}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header
      className="relative overflow-hidden z-10"
      style={{
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(247, 251, 255, 0.75) 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Large Decorative Diagonal Ecuadorian Flag from Corner (Amarillo, Azul, Rojo) */}
      <div className="absolute -top-16 -left-16 sm:-top-14 sm:-left-14 w-64 sm:w-80 h-32 pointer-events-none rotate-[-35deg] origin-center z-0 opacity-70">
        <div className="w-full h-1/2 bg-[#FFD100] shadow-[0_4px_16px_rgba(255,209,0,0.35)]" />
        <div className="w-full h-1/4 bg-[#005AB5] shadow-[0_3px_12px_rgba(0,90,181,0.3)]" />
        <div className="w-full h-1/4 bg-[#DA121A] shadow-[0_3px_12px_rgba(218,18,26,0.3)]" />
      </div>

      {/* Subtle crime icons watermark in header background with refined transparency */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-10 sm:px-24 opacity-[0.06] overflow-hidden">
        <ShieldAlert className="w-14 h-14 text-blue-900 -rotate-12" />
        <HandcuffsIcon className="w-12 h-12 text-blue-800 rotate-6 hidden sm:block" />
        <Target className="w-14 h-14 text-red-900 -rotate-6 hidden md:block" />
        <AlertTriangle className="w-12 h-12 text-amber-800 rotate-12 hidden lg:block" />
        <Shield className="w-14 h-14 text-blue-900 -rotate-12 hidden sm:block" />
      </div>

      {/* Subtle tech dot matrix */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(#1E40AF 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="w-[92%] 2xl:w-[94%] max-w-[1650px] mx-auto py-3.5 sm:py-4 flex flex-col items-center justify-center text-center relative z-10">
        {/* Centered Title with Institutional Shield and Crime Category Badges */}
        <div className="flex items-center justify-center gap-3 mb-1">
          {/* Subtle crime indicators pill on the left */}
          <div className="hidden lg:flex items-center gap-2 pr-3 py-1 border-r border-slate-200/80">
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-700/80 bg-blue-50/80 px-2 py-0.5 rounded border border-blue-200/60">
              <ShieldAlert className="w-3 h-3 text-blue-600" /> Robos
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-700/80 bg-rose-50/80 px-2 py-0.5 rounded border border-rose-200/60">
              <Target className="w-3 h-3 text-rose-600" /> Asesinatos
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-700 via-blue-800 to-slate-900 flex items-center justify-center text-white shadow-xs ring-1 ring-blue-900/20">
              <Shield className="w-4.5 h-4.5 text-amber-400" />
            </div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight uppercase text-slate-900 leading-none">
              Dirección Nacional <span className="text-blue-700">de Seguridad</span>
            </h1>
          </div>

          {/* Subtle crime indicators pill on the right */}
          <div className="hidden lg:flex items-center gap-2 pl-3 py-1 border-l border-slate-200/80">
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700/80 bg-amber-50/80 px-2 py-0.5 rounded border border-amber-200/60">
              <AlertTriangle className="w-3 h-3 text-amber-600" /> Extorsiones
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700/80 bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-200/60">
              <HandcuffsIcon className="w-3 h-3 text-emerald-600" /> Secuestros
            </span>
          </div>
        </div>

        {/* Requested Administration Subtitle */}
        <p className="text-xs sm:text-sm font-semibold text-slate-600 tracking-wide">
          Administrado por JMAC -Jose Manuel Arguello - Seguridad Física
        </p>
      </div>
    </header>
  );
};


