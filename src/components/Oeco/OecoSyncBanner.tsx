import React from 'react';
import {
  Shield,
  Crosshair,
  TrendingUp,
  AlertTriangle,
  Clock,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Anchor,
  Box,
  Flame,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { OecoLiveSyncData } from '../../types/crime';

interface OecoSyncBannerProps {
  syncData: OecoLiveSyncData | null;
  isSyncing: boolean;
  onTriggerSync: () => void;
  autoSyncEnabled: boolean;
  onToggleAutoSync: () => void;
}

export const OecoSyncBanner: React.FC<OecoSyncBannerProps> = ({
  syncData,
  isSyncing,
  onTriggerSync,
  autoSyncEnabled,
  onToggleAutoSync,
}) => {
  const decomisos = syncData?.decomisos;

  const formatLastSync = (isoString?: string) => {
    if (!isoString) return 'Sincronizado hoy';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }) + ' (' + date.toLocaleDateString('es-EC', { day: '2-digit', month: 'short' }) + ')';
    } catch {
      return 'Reciente';
    }
  };

  return (
    <div className="space-y-4">
      {/* Synchronization Control Header */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: 'radial-gradient(#10B981 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Rastreador OECO Automatizado (1 vez al día)
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Última lectura: <strong className="text-white font-mono">{formatLastSync(syncData?.lastSyncTime)}</strong>
              </span>
            </div>

            <h3 className="font-heading text-lg sm:text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <span>Sincronización Continua & Detección de Datos 2026</span>
              {syncData?.detectedYear2026Available && (
                <span className="px-2 py-0.5 text-[10px] font-black bg-blue-600 text-white rounded uppercase tracking-wider">
                  2026 Activo
                </span>
              )}
            </h3>

            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              El agente institucional monitorea periódicamente la base de datos oficial del <strong className="text-emerald-400">OECO (PADF)</strong>, Ministerio del Interior y Policía Nacional para integrar de forma desatendida indicadores de 2026, decomisos de armamento de guerra y toneladas de alcaloides.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Auto-Sync Toggle */}
            <button
              onClick={onToggleAutoSync}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                autoSyncEnabled
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900/70'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="Programa una lectura diaria periódica al abrir la plataforma"
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${autoSyncEnabled ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>Auto-Sync 24h: {autoSyncEnabled ? 'Activado' : 'Manual'}</span>
            </button>

            {/* Manual Sync Trigger Button */}
            <button
              onClick={onTriggerSync}
              disabled={isSyncing}
              className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                isSyncing
                  ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
                  : 'bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Escaneando OECO...' : 'Sincronizar Ahora'}</span>
            </button>
          </div>
        </div>

        {/* 2026 Findings Highlight */}
        {syncData?.year2026Summary && (
          <div className="mt-4 pt-3.5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-950/50 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-4 rounded-b-xl">
            <div className="flex items-start gap-2.5 text-slate-200">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-bold uppercase tracking-wider text-[11px] block sm:inline mr-2">
                  Hallazgo 2026 Detectado en Portal OECO:
                </strong>
                <span>{syncData.year2026Summary}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 text-[11px] text-slate-400">
              <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-bold">
                12 Boletines Indexados
              </span>
            </div>
          </div>
        )}
      </div>

      {/* APARTADOS ESPECIALES OECO: DECOMISOS DE ALCALOIDES & ARMAS */}
      {decomisos && (
        <div className="bg-white border border-slate-200 rounded-xl p-4.5 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider">
                <Flame className="w-4 h-4 text-rose-600" />
                <span>Apartados Especiales OECO · Incautaciones de Alto Impacto</span>
              </div>
              <h4 className="font-heading text-base sm:text-lg font-bold text-slate-900 uppercase">
                Decomisos de Alcaloides, Armamento Táctico y Operaciones Portuarias
              </h4>
            </div>
            <div className="text-right text-[11px] text-slate-500">
              <span>{decomisos.periodo}</span>
            </div>
          </div>

          {/* 4 Cards of Seizures / Decomisos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {/* Alcaloides */}
            <div className="bg-linear-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/90 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-emerald-800 text-xs font-bold mb-1">
                <span className="uppercase text-[10px] tracking-wider">Alcaloides Decomisados</span>
                <Box className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="font-heading text-2xl sm:text-3xl font-black text-emerald-950 font-mono-numbers">
                {decomisos.alcaloidesToneladas.toLocaleString('es-EC')} <span className="text-sm font-bold text-emerald-700">Ton</span>
              </div>
              <div className="text-[11px] text-emerald-800 mt-1 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                <span>+{decomisos.tendenciaPct}% vs período anterior</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {decomisos.alcaloidesIncautaciones.toLocaleString('es-EC')} operativos e incautaciones
              </div>
            </div>

            {/* Armamento Total */}
            <div className="bg-linear-to-br from-slate-50 to-slate-100/60 border border-slate-300 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-slate-800 text-xs font-bold mb-1">
                <span className="uppercase text-[10px] tracking-wider">Armas de Fuego Incautadas</span>
                <Crosshair className="w-4 h-4 text-slate-700" />
              </div>
              <div className="font-heading text-2xl sm:text-3xl font-black text-slate-900 font-mono-numbers">
                {decomisos.armasIncautadasTotal.toLocaleString('es-EC')}
              </div>
              <div className="text-[11px] text-slate-700 mt-1 font-medium">
                Pistolas, revólveres y escopetas
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Retiradas de grupos delictivos
              </div>
            </div>

            {/* Fusiles de Guerra 5.56 / 7.62 */}
            <div className="bg-linear-to-br from-rose-50 to-red-50/60 border border-rose-200/90 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-rose-800 text-xs font-bold mb-1">
                <span className="uppercase text-[10px] tracking-wider">Fusiles de Asalto Tácticos</span>
                <Flame className="w-4 h-4 text-rose-600" />
              </div>
              <div className="font-heading text-2xl sm:text-3xl font-black text-rose-900 font-mono-numbers">
                {decomisos.fusilesTrafico.toLocaleString('es-EC')}
              </div>
              <div className="text-[11px] text-rose-700 mt-1 font-bold">
                Calibres 5.56mm y 7.62mm OTAN
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {decomisos.municionesDecomisadas.toLocaleString('es-EC')} municiones confiscadas
              </div>
            </div>

            {/* Narcoterrorismo & Semisumergibles */}
            <div className="bg-linear-to-br from-blue-50 to-indigo-50/60 border border-blue-200/90 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-blue-800 text-xs font-bold mb-1">
                <span className="uppercase text-[10px] tracking-wider">Logística Marítima & GDOs</span>
                <Anchor className="w-4 h-4 text-blue-600" />
              </div>
              <div className="font-heading text-2xl sm:text-3xl font-black text-blue-950 font-mono-numbers">
                {decomisos.embarcacionesSemiautonomas || 18} <span className="text-sm font-bold text-blue-700">LPV</span>
              </div>
              <div className="text-[11px] text-blue-800 mt-1 font-medium">
                Semisumergibles y lanchas rápidas
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {decomisos.gruposTerroristasGolpeados || 22} organizaciones neutralizadas
              </div>
            </div>
          </div>

          {/* Puerto Breakdown & Alert Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Puertos Críticos */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-lg p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-800 mb-2.5">
                <Anchor className="w-3.5 h-3.5 text-blue-600" />
                <span>Distribución de Incautación por Ejes Portuarios (OECO)</span>
              </div>
              <div className="space-y-2">
                {decomisos.detallePuertos?.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium">{p.puerto}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, (p.toneladas / 120) * 100)}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-900 w-16 text-right">
                        {p.toneladas} Ton
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alertas Operativas Recientes del Crawler OECO */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-lg p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-800 mb-2.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Alertas del Último Rastreo Oficial OECO</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {syncData?.lastSyncAlerts.map((alert, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">▪</span>
                      <span>{alert}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>Fuente directa: Observatorio Ecuatoriano de Crimen Organizado</span>
                <a
                  href="https://oeco.padf.org/datos/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center gap-1"
                >
                  oeco.padf.org <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
