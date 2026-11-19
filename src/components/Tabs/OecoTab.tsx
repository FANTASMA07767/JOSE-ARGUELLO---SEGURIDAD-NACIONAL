import React, { useEffect, useRef, useState, useCallback } from 'react';
import { OECO_DATA } from '../../data/initialDb';
import { OecoLiveSyncData } from '../../types/crime';
import { Chart, registerables } from 'chart.js';
import { ShieldCheck, ExternalLink, AlertTriangle, Crosshair, Users, Activity, Newspaper } from 'lucide-react';
import { EcuadorNewsSection } from '../EcuadorNewsSection';
import { OecoSyncBanner } from '../Oeco/OecoSyncBanner';

Chart.register(...registerables);

const OECO_CACHE_KEY = 'jmac_oeco_live_sync_v1';
const AUTO_SYNC_ENABLED_KEY = 'jmac_oeco_auto_sync_enabled';

export const OecoTab: React.FC = () => {
  const [syncData, setSyncData] = useState<OecoLiveSyncData | null>(() => {
    try {
      const stored = localStorage.getItem(OECO_CACHE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading OECO cache:', e);
    }
    return null;
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(AUTO_SYNC_ENABLED_KEY);
      return stored !== 'false'; // default true
    } catch {
      return true;
    }
  });

  const triggerLiveSync = useCallback(async (forced: boolean = false) => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/oeco/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceLive: forced }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setSyncData(json.data);
        localStorage.setItem(OECO_CACHE_KEY, JSON.stringify(json.data));
      }
    } catch (err) {
      console.error('Error syncing with OECO:', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const toggleAutoSync = () => {
    setAutoSyncEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(AUTO_SYNC_ENABLED_KEY, String(next));
      return next;
    });
  };

  // Automated 24h background check: Check if last sync was > 24 hours ago
  useEffect(() => {
    if (!autoSyncEnabled) return;

    let shouldSync = false;
    if (!syncData || !syncData.lastSyncTime) {
      shouldSync = true;
    } else {
      const last = new Date(syncData.lastSyncTime).getTime();
      const now = Date.now();
      const diffHours = (now - last) / (1000 * 60 * 60);
      if (diffHours >= 24) {
        shouldSync = true;
      }
    }

    if (shouldSync) {
      triggerLiveSync(false);
    } else {
      // Still fetch status if cached was empty in memory
      fetch('/api/oeco/sync-status')
        .then((r) => r.json())
        .then((data) => {
          if (data?.data && !syncData) {
            setSyncData(data.data);
            localStorage.setItem(OECO_CACHE_KEY, JSON.stringify(data.data));
          }
        })
        .catch(() => {});
    }
  }, [autoSyncEnabled, triggerLiveSync]);
  const mensualCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const historicoCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cantonesCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const tasasCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const mensualChart = useRef<Chart | null>(null);
  const historicoChart = useRef<Chart | null>(null);
  const cantonesChart = useRef<Chart | null>(null);
  const tasasChart = useRef<Chart | null>(null);

  useEffect(() => {
    // 1. Mensual 2024 vs 2025
    if (mensualCanvasRef.current) {
      if (mensualChart.current) mensualChart.current.destroy();

      mensualChart.current = new Chart(mensualCanvasRef.current, {
        type: 'bar',
        data: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
          datasets: [
            {
              label: 'Año 2024',
              data: OECO_DATA.mensual2024,
              backgroundColor: '#94A3B8',
              borderRadius: 3
            },
            {
              label: 'Año 2025 (Récord)',
              data: OECO_DATA.mensual2025,
              backgroundColor: '#DC2626',
              borderRadius: 3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { color: '#475569', font: { size: 11, weight: 'bold' } } },
            tooltip: {
              backgroundColor: '#0F172A',
              padding: 10,
              callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${Number(ctx.parsed.y).toLocaleString()} homicidios` }
            }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#475569', font: { size: 10 } } },
            y: { grid: { color: 'rgba(226, 232, 240, 0.8)' }, ticks: { color: '#64748B' } }
          }
        }
      });
    }

    // 2. Histórico 2020–2025
    if (historicoCanvasRef.current) {
      if (historicoChart.current) historicoChart.current.destroy();

      historicoChart.current = new Chart(historicoCanvasRef.current, {
        type: 'line',
        data: {
          labels: OECO_DATA.historico.map((h) => String(h.year)),
          datasets: [
            {
              label: 'Homicidios Intencionales Anuales',
              data: OECO_DATA.historico.map((h) => h.total),
              borderColor: '#DC2626',
              backgroundColor: 'rgba(220, 38, 38, 0.08)',
              tension: 0.35,
              fill: true,
              pointBackgroundColor: '#DC2626',
              pointRadius: 5,
              borderWidth: 2.5
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
              callbacks: { label: (ctx) => ` ${Number(ctx.parsed.y).toLocaleString()} homicidios` }
            }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#475569', font: { size: 11, weight: 'bold' } } },
            y: { grid: { color: 'rgba(226, 232, 240, 0.8)' }, ticks: { color: '#64748B' } }
          }
        }
      });
    }

    // 3. Cantones Ranking por Tasa
    if (cantonesCanvasRef.current) {
      if (cantonesChart.current) cantonesChart.current.destroy();

      cantonesChart.current = new Chart(cantonesCanvasRef.current, {
        type: 'bar',
        data: {
          labels: OECO_DATA.topCantones.map((c) => c.canton),
          datasets: [
            {
              label: 'Tasa x 100k hab.',
              data: OECO_DATA.topCantones.map((c) => c.tasa),
              backgroundColor: OECO_DATA.topCantones.map((_, i) =>
                i < 3 ? '#DC2626' : i < 6 ? '#EA580C' : '#2563EB'
              ),
              borderRadius: 3
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
              callbacks: { label: (ctx) => ` Tasa: ${ctx.parsed.y} homicidios por cada 100k hab.` }
            }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#334155', font: { size: 10, weight: 'bold' }, maxRotation: 45 } },
            y: { grid: { color: 'rgba(226, 232, 240, 0.8)' }, ticks: { color: '#64748B' } }
          }
        }
      });
    }

    // 4. Tasas Provinciales
    if (tasasCanvasRef.current) {
      if (tasasChart.current) tasasChart.current.destroy();

      tasasChart.current = new Chart(tasasCanvasRef.current, {
        type: 'bar',
        data: {
          labels: OECO_DATA.tasasProv.map((t) => t.prov),
          datasets: [
            {
              label: 'Tasa Homicidios x 100k',
              data: OECO_DATA.tasasProv.map((t) => t.tasa),
              backgroundColor: OECO_DATA.tasasProv.map((_, i) => (i < 3 ? '#DC2626' : '#2563EB')),
              borderRadius: 3
            }
          ]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(226, 232, 240, 0.8)' }, ticks: { color: '#64748B' } },
            y: { grid: { display: false }, ticks: { color: '#334155', font: { size: 10, weight: 'bold' } } }
          }
        }
      });
    }

    return () => {
      if (mensualChart.current) mensualChart.current.destroy();
      if (historicoChart.current) historicoChart.current.destroy();
      if (cantonesChart.current) cantonesChart.current.destroy();
      if (tasasChart.current) tasasChart.current.destroy();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Official Header Banner */}
      <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 border-l-4 border-emerald-500 p-4.5 rounded-xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Observatorio Ecuatoriano de Crimen Organizado (OECO) — PADF</span>
          </div>
          <h3 className="font-heading text-xl font-bold uppercase tracking-tight">
            Contexto Estratégico Nacional · Crimen Organizado & Homicidios
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Fuentes homologadas: Ministerio del Interior, Policía Nacional, INEC y Global Initiative (GITOC).
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              const el = document.getElementById('seccion-noticias-oeco');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0 whitespace-nowrap shadow-xs cursor-pointer border border-slate-600"
          >
            <Newspaper className="w-3.5 h-3.5 text-blue-400" />
            <span>Noticias & Prensa en Línea ↓</span>
          </button>
          <a
            href="https://oeco.padf.org/datos/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0 whitespace-nowrap shadow-xs cursor-pointer"
          >
            <span>Portal OECO</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* AUTOMATED OECO LIVE SYNC CRAWLER & SPECIAL SECTIONS (2026, DECOMISOS ARMAS & ALCALOIDES) */}
      <OecoSyncBanner
        syncData={syncData}
        isSyncing={isSyncing}
        onTriggerSync={() => triggerLiveSync(true)}
        autoSyncEnabled={autoSyncEnabled}
        onToggleAutoSync={toggleAutoSync}
      />

      {/* 5 Macro Indicator KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white border-t-4 border-emerald-600 border border-slate-200 p-3.5 rounded-xl text-center shadow-xs">
          <div className="font-heading text-2xl sm:text-3xl font-black text-slate-900 font-mono-numbers">
            {OECO_DATA.homicidios2025.toLocaleString()}
          </div>
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-1">
            Homicidios 2025
          </div>
          <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Cifra Anual Consolidada</div>
        </div>

        <div className="bg-white border-t-4 border-rose-600 border border-slate-200 p-3.5 rounded-xl text-center shadow-xs">
          <div className="font-heading text-2xl sm:text-3xl font-black text-rose-600 font-mono-numbers">
            {OECO_DATA.tasaNacional2025}
          </div>
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-1">
            Tasa x 100k Hab.
          </div>
          <div className="text-[10px] text-rose-600 font-bold mt-0.5">Récord Histórico País</div>
        </div>

        <div className="bg-white border-t-4 border-slate-700 border border-slate-200 p-3.5 rounded-xl text-center shadow-xs">
          <div className="font-heading text-2xl sm:text-3xl font-black text-slate-900 font-mono-numbers">
            {OECO_DATA.armaFuegoPct}%
          </div>
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-1">
            Armas de Fuego
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-0.5">8,108 de 9,167 hechos</div>
        </div>

        <div className="bg-white border-t-4 border-blue-600 border border-slate-200 p-3.5 rounded-xl text-center shadow-xs">
          <div className="font-heading text-2xl sm:text-3xl font-black text-blue-700 font-mono-numbers">
            4° Mundial
          </div>
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-1">
            Índice GITOC
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-0.5">7.48 / 10 Severidad</div>
        </div>

        <div className="bg-white border-t-4 border-amber-500 border border-slate-200 p-3.5 rounded-xl text-center col-span-2 sm:col-span-1 shadow-xs">
          <div className="font-heading text-2xl sm:text-3xl font-black text-amber-700 font-mono-numbers">
            {OECO_DATA.nnaVictimasH1}
          </div>
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-1">
            NNA Víctimas H1
          </div>
          <div className="text-[10px] text-rose-600 font-bold mt-0.5">▲ +68% vs año previo</div>
        </div>
      </div>

      {/* Row 1: Mensual 2024 vs 2025 & Histórico 2020-2025 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border-t-4 border-rose-600 border border-slate-200 rounded-xl p-4.5 shadow-xs">
          <div className="border-b border-slate-100 pb-3 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              OECO · Evolución Mensual
            </span>
            <h4 className="font-heading text-base font-bold text-slate-900 uppercase">
              Homicidios Intencionales por Mes (2024 vs 2025)
            </h4>
          </div>
          <div className="relative h-64">
            <canvas ref={mensualCanvasRef} />
          </div>
        </div>

        <div className="bg-white border-t-4 border-blue-600 border border-slate-200 rounded-xl p-4.5 shadow-xs">
          <div className="border-b border-slate-100 pb-3 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              OECO · Tendencia Multianual
            </span>
            <h4 className="font-heading text-base font-bold text-slate-900 uppercase">
              Curva Histórica de Violencia Homicida (2020–2025)
            </h4>
          </div>
          <div className="relative h-64">
            <canvas ref={historicoCanvasRef} />
          </div>
        </div>
      </div>

      {/* Row 2: Top Cantones por Tasa & 7 Mercados Criminales */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cantones Ranking */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs">
          <div className="border-b border-slate-100 pb-3 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Puntos Críticos Cantones
            </span>
            <h4 className="font-heading text-base font-bold text-slate-900 uppercase">
              Top 10 Cantones por Tasa de Homicidios (x 100.000 hab.)
            </h4>
          </div>
          <div className="relative h-64">
            <canvas ref={cantonesCanvasRef} />
          </div>
        </div>

        {/* 7 Mercados Criminales */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4.5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="border-b border-slate-100 pb-3 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Caracterización 2025–2026
              </span>
              <h4 className="font-heading text-base font-bold text-slate-900 uppercase">
                Mercados Ilícitos Predominantes
              </h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 border-l-3 border-blue-600 rounded-r-lg">
                <strong className="text-slate-900 font-bold">1. Narcotráfico:</strong> Ejes portuarios y corredores
                de Guayas, El Oro, Manabí y Esmeraldas.
              </div>
              <div className="p-2.5 bg-slate-50 border-l-3 border-amber-500 rounded-r-lg">
                <strong className="text-slate-900 font-bold">2. Minería Ilegal:</strong> Cuencas de Orellana, Napo,
                Zamora Chinchipe, Azuay y Ponce Enríquez.
              </div>
              <div className="p-2.5 bg-slate-50 border-l-3 border-slate-700 rounded-r-lg">
                <strong className="text-slate-900 font-bold">3. Tráfico de Armas:</strong> Ingreso transfronterizo
                de fusiles 5.56mm y pistolas 9mm.
              </div>
              <div className="p-2.5 bg-slate-50 border-l-3 border-rose-600 rounded-r-lg">
                <strong className="text-slate-900 font-bold">4. Extorsión & Secuestro:</strong> Vacunas masivas a
                pequeños comercios y transportistas.
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
            Informe oficial: Observatorio Ecuatoriano de Crimen Organizado
          </div>
        </div>
      </div>

      {/* Ecuador Security News Live Feed Section */}
      <EcuadorNewsSection id="seccion-noticias-oeco" />
    </div>
  );
};

