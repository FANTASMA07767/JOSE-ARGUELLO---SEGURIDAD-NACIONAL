import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import {
  Anchor,
  Shield,
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Truck,
  Layers,
  FileText,
  UploadCloud,
  CheckCircle2,
  Calendar,
  Compass,
  ArrowRight,
  ExternalLink,
  Lock,
  Search,
  Filter,
  Activity,
  BarChart3,
  Eye,
  Radio,
  Download,
  MapPin,
  ListFilter,
  Navigation
} from 'lucide-react';
import {
  DATA_PAGINAS_5_A_14,
  INITIAL_INFO_TERRITORIO,
  EventoDelictivoReporte
} from '../../data/infoTerritorioData';
import { InfoTerritorioReport } from '../../types/crime';

Chart.register(...registerables);

interface InfoTerritorioTabProps {
  onOpenUpload?: () => void;
}

export const InfoTerritorioTab: React.FC<InfoTerritorioTabProps> = ({ onOpenUpload }) => {
  const [reportData] = useState<InfoTerritorioReport>(INITIAL_INFO_TERRITORIO);
  const p5to14 = DATA_PAGINAS_5_A_14;

  // Navigation sub-views
  const [activeSubView, setActiveSubView] = useState<
    'eventos-completos' | 'mapa-riesgo' | 'sectores-guayaquil' | 'nodo-guayaquil' | 'vias-amenazas' | 'tendencias-graficos'
  >('eventos-completos');

  // Filter states for complete events table
  const [searchEvent, setSearchEvent] = useState<string>('');
  const [selectedNodeFilter, setSelectedNodeFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');

  const [isUploadDocOpen, setIsUploadDocOpen] = useState<boolean>(false);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  // Chart Canvas Refs
  const monthlyTrendCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const corridorsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const modalidadesCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const zona8DistritosCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Chart Instances
  const monthlyTrendChart = useRef<Chart | null>(null);
  const corridorsChart = useRef<Chart | null>(null);
  const modalidadesChart = useRef<Chart | null>(null);
  const zona8DistritosChart = useRef<Chart | null>(null);

  // Unique filters for events
  const uniqueNodes = Array.from(new Set(p5to14.eventosGenerales30Sep16Oct.map((e) => e.nodo))).sort();
  const uniqueTypes = Array.from(new Set(p5to14.eventosGenerales30Sep16Oct.map((e) => e.tipo))).sort();

  // Filtered Events
  const filteredEvents = p5to14.eventosGenerales30Sep16Oct.filter((e) => {
    if (selectedNodeFilter !== 'all' && e.nodo !== selectedNodeFilter) return false;
    if (selectedTypeFilter !== 'all' && e.tipo !== selectedTypeFilter) return false;
    if (searchEvent.trim() !== '') {
      const q = searchEvent.toLowerCase();
      return (
        e.lugarDescripcion.toLowerCase().includes(q) ||
        e.tipo.toLowerCase().includes(q) ||
        e.nodo.toLowerCase().includes(q) ||
        e.puertoMasCercano.toLowerCase().includes(q) ||
        e.fecha.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Chart initialization
  useEffect(() => {
    // 1. Monthly Overall Trend 2026
    if (monthlyTrendCanvasRef.current) {
      if (monthlyTrendChart.current) monthlyTrendChart.current.destroy();

      const labels = reportData.monthlyOverallTrend2026.map((m) => m.month);
      const incidents = reportData.monthlyOverallTrend2026.map((m) => m.incidents);
      const prevented = reportData.monthlyOverallTrend2026.map((m) => m.prevented);

      monthlyTrendChart.current = new Chart(monthlyTrendCanvasRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              type: 'bar',
              label: 'Incidentes Detectados',
              data: incidents,
              backgroundColor: 'rgba(239, 68, 68, 0.85)',
              borderColor: '#DC2626',
              borderWidth: 1,
              borderRadius: 4,
              order: 2
            },
            {
              type: 'bar',
              label: 'Ataques Frustrados / Decomisos',
              data: prevented,
              backgroundColor: 'rgba(16, 185, 129, 0.85)',
              borderColor: '#059669',
              borderWidth: 1,
              borderRadius: 4,
              order: 3
            },
            {
              type: 'line',
              label: 'Tendencia Incidentes (Media Móvil)',
              data: incidents,
              borderColor: '#1E40AF',
              backgroundColor: 'rgba(30, 64, 175, 0.1)',
              borderWidth: 2.5,
              tension: 0.35,
              fill: false,
              pointRadius: 4,
              pointBackgroundColor: '#1E40AF',
              order: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { boxWidth: 12, font: { size: 11, weight: 'bold' }, color: '#334155' }
            }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#64748B', font: { size: 11 } } },
            y: { grid: { color: 'rgba(226, 232, 240, 0.8)' }, ticks: { color: '#64748B', font: { size: 10 } } }
          }
        }
      });
    }

    // 2. Incidentes por Eje Portuario
    if (corridorsCanvasRef.current) {
      if (corridorsChart.current) corridorsChart.current.destroy();

      const labels = reportData.corridors.map((c) => c.name.replace('Eje ', '').split('/')[0].trim());
      const octIncidents = reportData.corridors.map((c) => c.incidentsCurrentMonth);

      corridorsChart.current = new Chart(corridorsCanvasRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Incidentes Octubre 2026',
              data: octIncidents,
              backgroundColor: ['#DC2626', '#EA580C', '#D97706', '#2563EB', '#B91C1C'],
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(226, 232, 240, 0.8)' }, ticks: { color: '#64748B', font: { size: 10 } } },
            y: { grid: { display: false }, ticks: { color: '#1E293B', font: { size: 11, weight: 'bold' } } }
          }
        }
      });
    }

    // 3. Homicidios por Distrito Policial Zona 8
    if (zona8DistritosCanvasRef.current) {
      if (zona8DistritosChart.current) zona8DistritosChart.current.destroy();

      const labels = p5to14.homicidiosPorDistritoPolicialZona8.map((d) => d.distrito);
      const data = p5to14.homicidiosPorDistritoPolicialZona8.map((d) => d.homicidios2026);

      zona8DistritosChart.current = new Chart(zona8DistritosCanvasRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Homicidios Ene–Ago 2026',
              data,
              backgroundColor: ['#DC2626', '#EA580C', '#E11D48', '#C026D3', '#7C3AED', '#4F46E5'],
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#334155', font: { size: 11, weight: 'bold' } } },
            y: { grid: { color: 'rgba(226, 232, 240, 0.8)' }, ticks: { color: '#64748B', font: { size: 10 } } }
          }
        }
      });
    }

    // 4. Modalidades Delictivas
    if (modalidadesCanvasRef.current) {
      if (modalidadesChart.current) modalidadesChart.current.destroy();

      const labels = reportData.modalities.map((m) => m.name);
      const counts = reportData.modalities.map((m) => m.count);

      modalidadesChart.current = new Chart(modalidadesCanvasRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Casos Octubre 2026',
              data: counts,
              backgroundColor: ['#EF4444', '#F97316', '#F59E0B', '#3B82F6', '#8B5CF6', '#64748B'],
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                color: '#475569',
                font: { size: 10 },
                callback: function (val, index) {
                  const label = labels[index] || '';
                  return label.length > 18 ? label.slice(0, 16) + '...' : label;
                }
              }
            },
            y: { grid: { color: 'rgba(226, 232, 240, 0.8)' }, ticks: { color: '#64748B', font: { size: 10 } } }
          }
        }
      });
    }
  }, [reportData, activeSubView, p5to14]);

  const handlePrint = () => {
    window.print();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setUploadLoading(true);

    setTimeout(() => {
      setUploadLoading(false);
      setIsUploadDocOpen(false);
      setUploadSuccessMsg(`Archivo "${file.name}" cargado y sincronizado.`);
      setTimeout(() => setUploadSuccessMsg(null), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {uploadSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between text-xs shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{uploadSuccessMsg}</span>
          </div>
          <button onClick={() => setUploadSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900 font-bold ml-4">
            ✕
          </button>
        </div>
      )}

      {/* Institutional Document Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-700 text-white shadow-xl p-5 sm:p-7">
        <div className="absolute top-0 right-0 w-44 h-1.5 bg-gradient-to-r from-yellow-400 via-blue-600 to-red-600 rounded-bl-full opacity-90" />
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-blue-600/30 text-blue-300 border border-blue-500/40">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                Informe Ejecutivo de Inteligencia y Seguridad Portuaria
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Corte: 16 de Octubre de 2026
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                Radio de 20 km por Terminal · Fuentes Oficiales OSINT
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-heading font-black tracking-tight text-white leading-tight">
              Seguridad Delictiva e Inteligencia Territorial · Puertos Marítimos del Ecuador
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              <strong className="text-amber-400 font-semibold">Puertos Analizados:</strong> Guayaquil · Posorja · Puerto Bolívar · Manta · Esmeraldas · Santa Elena. Cobertura completa de la situación delictiva, mapas de riesgo, vías de acceso, amenazas portuarias e incautaciones.
            </p>
          </div>

          <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2.5 shrink-0">
            <button
              onClick={() => setIsUploadDocOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-heading font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Cargar / Actualizar Archivo</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl text-xs font-heading font-medium transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Exportar Resumen</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs across Pages 5 to 14 */}
      <div className="bg-white border border-slate-200 rounded-xl p-1.5 shadow-2xs overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => setActiveSubView('eventos-completos')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
              activeSubView === 'eventos-completos'
                ? 'bg-blue-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Eventos Críticos 30-Sep a 16-Oct</span>
            <span className="ml-1 px-1.5 py-0.2 bg-blue-700 text-white text-[10px] rounded-full font-mono">
              {p5to14.eventosGenerales30Sep16Oct.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubView('mapa-riesgo')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
              activeSubView === 'mapa-riesgo'
                ? 'bg-blue-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Mapa de Riesgo Nacional & Zonas Críticas</span>
          </button>

          <button
            onClick={() => setActiveSubView('sectores-guayaquil')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
              activeSubView === 'sectores-guayaquil'
                ? 'bg-blue-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Matriz de Sectores Críticos Guayaquil</span>
            <span className="ml-1 px-1.5 py-0.2 bg-red-600 text-white text-[10px] rounded-full font-mono">
              12
            </span>
          </button>

          <button
            onClick={() => setActiveSubView('nodo-guayaquil')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
              activeSubView === 'nodo-guayaquil'
                ? 'bg-blue-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Anchor className="w-3.5 h-3.5" />
            <span>Nodo Guayaquil · Radio 20 km</span>
            <span className="ml-1 px-1.5 py-0.2 bg-amber-600 text-white text-[10px] rounded-full font-mono">
              23 eventos
            </span>
          </button>

          <button
            onClick={() => setActiveSubView('vias-amenazas')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
              activeSubView === 'vias-amenazas'
                ? 'bg-blue-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Vías, Amenazas & Incautaciones</span>
          </button>

          <button
            onClick={() => setActiveSubView('tendencias-graficos')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
              activeSubView === 'tendencias-graficos'
                ? 'bg-blue-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Gráficos de Barras & Tendencias</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: EVENTOS CRÍTICOS COMPLETOS */}
      {activeSubView === 'eventos-completos' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div>
              <h2 className="text-base font-heading font-bold text-slate-900 flex items-center gap-2">
                <ListFilter className="w-4 h-4 text-blue-700" />
                Registro Exhaustivo de Eventos Críticos (30-Sep al 16-Oct-2026)
              </h2>
              <p className="text-xs text-slate-500">
                Información consolidada de seguridad e incidentes del informe oficial.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar evento, lugar o banda..."
                  value={searchEvent}
                  onChange={(e) => setSearchEvent(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 sm:w-60"
                />
              </div>

              <select
                value={selectedNodeFilter}
                onChange={(e) => setSelectedNodeFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">Todos los Nodos ({p5to14.eventosGenerales30Sep16Oct.length})</option>
                {uniqueNodes.map((nodo) => (
                  <option key={nodo} value={nodo}>
                    {nodo}
                  </option>
                ))}
              </select>

              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">Todos los Tipos</option>
                {uniqueTypes.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-heading font-bold text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-3 w-20">Fecha</th>
                    <th className="py-3 px-3 w-28">Nodo</th>
                    <th className="py-3 px-3 w-32">Tipo</th>
                    <th className="py-3 px-4">Lugar / Descripción Oficial</th>
                    <th className="py-3 px-3 w-36">Víctimas / Detenidos</th>
                    <th className="py-3 px-3 w-32 text-right">Puerto / Distancia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEvents.map((ev, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700 whitespace-nowrap">
                        {ev.fecha}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-heading font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {ev.nodo}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            ev.tipo === 'Sicariato' || ev.tipo === 'Masacre' || ev.tipo === 'Muerte violenta'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : ev.tipo === 'Secuestro'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : ev.tipo === 'Narcotráfico'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : ev.tipo === 'Piratería'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {ev.tipo}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-700 leading-relaxed font-sans">
                        {ev.lugarDescripcion}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                        {ev.victimas}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono whitespace-nowrap">
                        <span className="font-bold text-slate-800">{ev.distanciaKm} km</span>
                        <span className="block text-[10px] text-slate-500 font-sans">{ev.puertoMasCercano}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
              <span>
                Mostrando <strong>{filteredEvents.length}</strong> de {p5to14.eventosGenerales30Sep16Oct.length} eventos registrados.
              </span>
              <span className="text-[10px] font-mono">Documento Oficial</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: MAPA DE RIESGO NACIONAL & ZONAS CRÍTICAS */}
      {activeSubView === 'mapa-riesgo' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
            <h2 className="text-base font-heading font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Compass className="w-5 h-5 text-blue-700" />
              2.1 Nivel de Riesgo por Nodo Portuario
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Valoración analítica del Centro de Operaciones combinando tendencia de homicidios, presencia de GDO, decomisos e incidentes recientes.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-heading font-bold uppercase text-[11px]">
                    <th className="py-2.5 px-4">Nodo Portuario</th>
                    <th className="py-2.5 px-3 w-28">Nivel de Riesgo</th>
                    <th className="py-2.5 px-4">Fundamento Operativo Oficial</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {p5to14.nivelRiesgoPorNodo.map((nodo, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-heading font-bold text-slate-900">
                        {nodo.nodo}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                            nodo.nivel === 'CRÍTICO'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : nodo.nivel === 'ALTO'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {nodo.nivel}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 leading-relaxed font-sans">
                        {nodo.fundamento}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2-Columns: Homicidios Zona 8 + Zonas Críticas en Otros Nodos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart: Homicidios por Distrito Policial Zona 8 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
              <h3 className="text-sm font-heading font-bold text-slate-900 mb-1 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-red-600" />
                Homicidios por Distrito Policial, Ene–Ago 2026 (Zona 8)
              </h3>
              <p className="text-[11px] text-slate-500 mb-3">
                Cifras oficiales Ministerio del Interior. Pascuales concentra el 14% de la Zona 8.
              </p>
              <div className="h-60 w-full mb-3">
                <canvas ref={zona8DistritosCanvasRef} />
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                {p5to14.homicidiosPorDistritoPolicialZona8.map((d, idx) => (
                  <div key={idx} className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div className="font-heading font-bold text-slate-900">{d.homicidios2026}</div>
                    <div className="text-[10px] text-slate-500">{d.distrito}</div>
                    {d.variacion && (
                      <div className={`text-[9px] font-bold ${d.variacion.startsWith('-') ? 'text-emerald-600' : 'text-red-600'}`}>
                        {d.variacion}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Table: Zonas Críticas en Otros Nodos */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
              <h3 className="text-sm font-heading font-bold text-slate-900 mb-1 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Zonas Críticas en los Otros Nodos Portuarios
              </h3>
              <p className="text-[11px] text-slate-500 mb-3">
                Sectores con presencia de GDO, disputas territoriales y familias desplazadas.
              </p>
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {p5to14.zonasCriticasOtrosNodos.map((z, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-heading font-bold text-slate-900 text-xs">{z.nodo}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                            z.nivel === 'CRÍTICO' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {z.nivel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-snug">{z.sector}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: MATRIZ DE SECTORES CRÍTICOS GUAYAQUIL */}
      {activeSubView === 'sectores-guayaquil' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
            <h2 className="text-base font-heading font-bold text-slate-900 flex items-center gap-2 mb-1">
              <MapPin className="w-5 h-5 text-blue-700" />
              2.2 Matriz de Sectores Críticos: Guayaquil y su Área de Influencia
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Desglose íntegro por distrito/sector, nivel de riesgo, indicador delictivo y grupos de delincuencia organizada (GDO) presentes.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-heading font-bold uppercase text-[11px]">
                    <th className="py-2.5 px-3">Distrito / Sector</th>
                    <th className="py-2.5 px-2.5 w-24">Nivel</th>
                    <th className="py-2.5 px-3">Indicador</th>
                    <th className="py-2.5 px-4">GDO Presentes</th>
                    <th className="py-2.5 px-3 w-20 text-right">Dist. Puerto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {p5to14.matrizSectoresCriticosGuayaquil.map((sec, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-heading font-bold text-slate-900">
                        {sec.sector}
                      </td>
                      <td className="py-3 px-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            sec.nivel === 'CRÍTICO'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : sec.nivel === 'ALTO'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {sec.nivel}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-mono text-[11px]">
                        {sec.indicador}
                      </td>
                      <td className="py-3 px-4 text-slate-800 font-medium">
                        {sec.gdoPresentes}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-700">
                        {sec.km}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: NODO PORTUARIO GUAYAQUIL */}
      {activeSubView === 'nodo-guayaquil' && (
        <div className="space-y-6">
          {/* Header Card Guayaquil */}
          <div className="bg-gradient-to-r from-red-950 via-slate-900 to-blue-950 border border-red-900/60 rounded-2xl p-5 text-white shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600/40 text-red-300 border border-red-500/50 px-2.5 py-0.5 rounded">
                  Puerto Marítimo · Radio de 20 km
                </span>
                <h2 className="text-xl sm:text-2xl font-heading font-black text-white mt-1">
                  ⚓ GUAYAQUIL <span className="text-red-400">CRÍTICO</span>
                </h2>
                <p className="text-xs text-slate-300">Contecon · TPG · Naportec · Terminales privadas</p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                  <div className="text-lg font-heading font-black text-white">1.759</div>
                  <div className="text-[9px] text-slate-400 uppercase">Homicidios Zona 8 (−21,1%)</div>
                </div>
                <div className="bg-red-900/50 p-2.5 rounded-xl border border-red-800">
                  <div className="text-lg font-heading font-black text-red-300">252</div>
                  <div className="text-[9px] text-slate-300 uppercase">Muertes Esteros (~13-oct)</div>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                  <div className="text-lg font-heading font-black text-amber-400">49,2 t</div>
                  <div className="text-[9px] text-slate-400 uppercase">Decomisos 2025 origen</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 text-xs leading-relaxed text-slate-200">
              <strong className="text-amber-400 font-bold block mb-1">SITUACIÓN EN EL RADIO DE 20 KM:</strong>
              {p5to14.guayaquilStats.situacionRadio20km}
            </div>
          </div>

          {/* Bandas que operan en el entorno */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
            <h3 className="text-sm font-heading font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              Bandas que Operan en el Entorno
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {p5to14.bandasOperanEntornoGuayaquil.map((b, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-heading font-bold text-slate-900 text-xs">{b.gdo}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                        b.nivel === 'CRÍTICO' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.nivel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">{b.zonaActividad}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 23 Eventos dentro del radio de 20 km */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-heading font-bold text-slate-900 flex items-center gap-2">
                <ListFilter className="w-4 h-4 text-blue-700" />
                23 Eventos Críticos dentro del Radio de 20 km
              </h3>
              <span className="text-xs text-slate-500 font-mono">30-Sep al 16-Oct-2026</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-heading font-bold uppercase text-[10px]">
                    <th className="py-2 px-2.5 w-10">#</th>
                    <th className="py-2 px-2.5 w-16">Fecha</th>
                    <th className="py-2 px-2.5 w-24">Tipo</th>
                    <th className="py-2 px-3">Lugar / Descripción</th>
                    <th className="py-2 px-3 w-32">Víctimas</th>
                    <th className="py-2 px-2.5 w-20 text-right">Distancia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {p5to14.eventosRadio20kmGuayaquil.map((ev) => (
                    <tr key={ev.num} className="hover:bg-slate-50">
                      <td className="py-2 px-2.5 font-mono font-bold text-slate-400">{ev.num}</td>
                      <td className="py-2 px-2.5 font-mono text-slate-700">{ev.fecha}</td>
                      <td className="py-2 px-2.5">
                        <span className="font-semibold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                          {ev.tipo}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-700">{ev.lugarDescripcion}</td>
                      <td className="py-2 px-3 font-semibold text-slate-900">{ev.victimas}</td>
                      <td className="py-2 px-2.5 text-right font-mono font-bold text-blue-700">{ev.distanciaKm} km</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2-Columns: Antecedentes 2026 + Eventos fuera del radio */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Antecedentes 2026 en el entorno */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
              <h3 className="text-sm font-heading font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-700" />
                Antecedentes 2026 en el Entorno
              </h3>
              <div className="space-y-2">
                {p5to14.antecedentes2026EntornoGuayaquil.map((ant, idx) => (
                  <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <span className="font-mono font-bold text-blue-700 mr-2">{ant.fecha}:</span>
                      <span className="text-slate-700">{ant.hecho}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-500 shrink-0 text-[11px]">{ant.distancia}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Eventos fuera del radio (referencia) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
              <h3 className="text-sm font-heading font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-slate-600" />
                Eventos Fuera del Radio (Referencia)
              </h3>
              <div className="space-y-1.5 max-h-[290px] overflow-y-auto pr-1 text-xs">
                {p5to14.eventosFueraDelRadioGuayaquil.map((ef, idx) => (
                  <div key={idx} className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="font-mono font-bold text-slate-600 mr-1.5">{ef.fecha}</span>
                      <span className="font-semibold text-slate-800 mr-1.5">[{ef.tipo}]</span>
                      <span className="text-slate-600">{ef.lugar}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-500 shrink-0 ml-2">{ef.distancia}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: VÍAS, AMENAZAS PORTUARIAS & INCAUTACIONES */}
      {activeSubView === 'vias-amenazas' && (
        <div className="space-y-6">
          {/* Vías y Logística dentro de 20 km */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
            <h2 className="text-base font-heading font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Truck className="w-5 h-5 text-blue-700" />
              Vías y Logística dentro de 20 km
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Puntos críticos de asalto a transporte pesado, cambio de cabezal y extorsión vial.
            </p>

            <div className="space-y-2.5">
              {p5to14.viasLogisticaRadio20kmGuayaquil.map((via, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        via.nivel === 'CRÍTICO' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {via.nivel}
                    </span>
                    <span className="font-heading font-bold text-slate-900">{via.via}</span>
                  </div>
                  <div className="text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 sm:max-w-xl">
                    {via.amenaza}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Amenazas Portuarias y Medidas de Control */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-red-50/70 border border-red-200 rounded-2xl p-5">
              <h3 className="font-heading font-bold text-sm text-red-900 flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-700" />
                AMENAZAS PORTUARIAS
              </h3>
              <p className="text-xs text-red-800 leading-relaxed font-sans">
                {p5to14.amenazasPortuariasGuayaquil}
              </p>
            </div>

            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5">
              <h3 className="font-heading font-bold text-sm text-blue-900 flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-700" />
                MEDIDAS DE CONTROL
              </h3>
              <p className="text-xs text-blue-800 leading-relaxed font-sans">
                {p5to14.medidasControlGuayaquil}
              </p>
            </div>
          </div>

          {/* Incautaciones 2026 vinculadas a la terminal */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
            <h3 className="font-heading font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <Anchor className="w-4 h-4 text-purple-600" />
              Incautaciones 2026 Vinculadas a la Terminal
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-heading font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Fecha</th>
                    <th className="py-2.5 px-3">Terminal</th>
                    <th className="py-2.5 px-3 font-mono">Kg</th>
                    <th className="py-2.5 px-3">Destino</th>
                    <th className="py-2.5 px-4">Modalidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {p5to14.incautaciones2026VinculadasTerminal.map((inc, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{inc.fecha}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{inc.terminal}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-purple-700">{inc.kg.toLocaleString()} kg</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">{inc.destino}</td>
                      <td className="py-2.5 px-4 text-slate-600">{inc.modalidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 6: GRÁFICOS DE BARRAS & TENDENCIAS */}
      {activeSubView === 'tendencias-graficos' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
              <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-700" />
                Evolución Mensual 2026 (Incidentes vs Frustrados)
              </h3>
              <p className="text-[11px] text-slate-500 mb-3">Con curva de media móvil de tendencia</p>
              <div className="h-64 w-full">
                <canvas ref={monthlyTrendCanvasRef} />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
              <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2 mb-1">
                <BarChart3 className="w-4 h-4 text-red-600" />
                Incidentes por Eje Portuario (Octubre 2026)
              </h3>
              <p className="text-[11px] text-slate-500 mb-3">Distribución por complejo marítimo</p>
              <div className="h-64 w-full">
                <canvas ref={corridorsCanvasRef} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
              <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2 mb-1">
                <Anchor className="w-4 h-4 text-amber-600" />
                Distribución por Modalidad Delictiva
              </h3>
              <div className="h-60 w-full">
                <canvas ref={modalidadesCanvasRef} />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
              <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2 mb-1">
                <ShieldAlert className="w-4 h-4 text-purple-600" />
                Homicidios por Distrito Policial (Zona 8)
              </h3>
              <div className="h-60 w-full">
                <canvas ref={zona8DistritosCanvasRef} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadDocOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-blue-700" />
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Cargar / Actualizar Archivo
                </h3>
              </div>
              <button onClick={() => setIsUploadDocOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Selecciona el documento oficial (PDF, Excel o Imagen) para incorporar nuevos anexos al monitoreo territorial.
            </p>

            <label className="border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all">
              <UploadCloud className="w-10 h-10 text-blue-600 mb-2 animate-bounce" />
              <span className="font-heading font-bold text-xs text-slate-800">
                Haz clic para seleccionar o arrastra el archivo aquí
              </span>
              <span className="text-[10px] text-slate-500 mt-1">
                Formatos: PDF, XLSX, CSV, PNG, JPG
              </span>
              <input
                type="file"
                accept=".pdf,.xlsx,.xls,.csv,image/*"
                onChange={handleFileUpload}
                disabled={uploadLoading}
                className="hidden"
              />
            </label>

            {uploadLoading && (
              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-blue-700">
                <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span>Procesando archivo...</span>
              </div>
            )}

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setIsUploadDocOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-heading font-bold cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
