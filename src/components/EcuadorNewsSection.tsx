import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  ECUADOR_SECURITY_NEWS,
  INDEXED_NEWS_SOURCES,
  EcuadorNewsItem,
} from '../data/ecuadorNewsData';
import {
  Newspaper,
  Search,
  ExternalLink,
  ShieldAlert,
  Clock,
  MapPin,
  RefreshCw,
  CheckCircle2,
  Filter,
  X,
  Globe,
  Building2,
  ChevronDown,
} from 'lucide-react';

interface EcuadorNewsSectionProps {
  id?: string;
}

interface SyncStats {
  sourcesReached: number;
  sourcesAttempted: number;
  ministryCount: number;
  officialCount: number;
  sourceBreakdown: Record<string, number>;
  lastSyncIso: string;
}

type FocusScope = 'ALL_CRIMES' | 'MINISTERIO_INTERIOR' | 'OFICIALES';

const NEWS_STORAGE_KEY = 'jmac_ecuador_live_news_v2';

function formatSyncTimeLabel(isoStr?: string): string {
  if (!isoStr) return 'Sincronización pendiente';
  const parsed = new Date(isoStr);
  if (Number.isNaN(parsed.getTime())) return 'Sincronizado recientemente';
  const hours = String(parsed.getHours()).padStart(2, '0');
  const mins = String(parsed.getMinutes()).padStart(2, '0');
  return `Sincronizado ${hours}:${mins}`;
}

export const EcuadorNewsSection: React.FC<EcuadorNewsSectionProps> = ({
  id = 'seccion-noticias-oeco',
}) => {
  const [newsItems, setNewsItems] = useState<EcuadorNewsItem[]>(() => {
    try {
      const cached = localStorage.getItem(NEWS_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed?.items) && parsed.items.length > 0) {
          return parsed.items;
        }
      }
    } catch {
      // Ignore storage parse error
    }
    return ECUADOR_SECURITY_NEWS;
  });

  const [syncStats, setSyncStats] = useState<SyncStats | null>(() => {
    try {
      const cached = localStorage.getItem(NEWS_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.stats) return parsed.stats;
      }
    } catch {
      // Ignore
    }
    return null;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [focusScope, setFocusScope] = useState<FocusScope>('ALL_CRIMES');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [selectedArticle, setSelectedArticle] = useState<EcuadorNewsItem | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // Targeted URL / Portal Scanner state
  const [showUrlScanner, setShowUrlScanner] = useState(false);
  const [targetPortalUrl, setTargetPortalUrl] = useState(
    'https://www.ministeriodelinterior.gob.ec/noticias/'
  );
  const [isScanningUrl, setIsScanningUrl] = useState(false);

  const applyServerCachePayload = useCallback((cacheData: any, feedback?: string) => {
    if (cacheData && Array.isArray(cacheData.items) && cacheData.items.length > 0) {
      const nextStats: SyncStats = {
        sourcesReached: cacheData.sourcesReached || 0,
        sourcesAttempted: cacheData.sourcesAttempted || 12,
        ministryCount: cacheData.ministryCount || 0,
        officialCount: cacheData.officialCount || 0,
        sourceBreakdown: cacheData.sourceBreakdown || {},
        lastSyncIso: cacheData.lastSyncTime || new Date().toISOString(),
      };
      setNewsItems(cacheData.items);
      setSyncStats(nextStats);
      try {
        localStorage.setItem(
          NEWS_STORAGE_KEY,
          JSON.stringify({ items: cacheData.items, stats: nextStats })
        );
      } catch {
        // Ignore storage quota issues
      }
      if (feedback) {
        setSyncMessage(feedback);
      }
    }
  }, []);

  // Initial automatic live fetch on mount
  useEffect(() => {
    let cancelled = false;
    const loadInitialLiveNews = async () => {
      setIsRefreshing(true);
      setSyncError(null);
      try {
        const res = await fetch('/api/news');
        const json = await res.json();
        if (!cancelled && json?.success && json?.data) {
          applyServerCachePayload(json.data);
        }
      } catch {
        if (!cancelled) {
          setSyncError('Modo respaldo activo. Pulse Actualizar para reintentar conexión en vivo.');
        }
      } finally {
        if (!cancelled) {
          setIsRefreshing(false);
        }
      }
    };

    loadInitialLiveNews();
    return () => {
      cancelled = true;
    };
  }, [applyServerCachePayload]);

  // Manual Live Refresh across all 12 official & press feeds
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setSyncError(null);
    setSyncMessage(null);
    try {
      const res = await fetch('/api/news/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const json = await res.json();
      if (json?.success && json?.data) {
        applyServerCachePayload(
          json.data,
          json.message ||
            `Actualización en vivo completada: ${json.data.items?.length || 0} noticias de delitos verificadas.`
        );
      } else {
        setSyncError(json?.error || 'No fue posible completar la actualización en vivo.');
      }
    } catch {
      setSyncError('Error de red al conectar con los portales informativos.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Targeted Portal / URL Reader focused strictly on Ministerio del Interior & Delitos
  const handleScanPortalUrl = async (overrideUrl?: string) => {
    const urlToScan = (overrideUrl ?? targetPortalUrl).trim();
    if (!urlToScan) return;
    if (overrideUrl) setTargetPortalUrl(overrideUrl);

    setIsScanningUrl(true);
    setSyncError(null);
    setSyncMessage(null);
    try {
      const res = await fetch('/api/news/scan-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToScan }),
      });
      const json = await res.json();
      if (json?.success) {
        if (json.cache) {
          applyServerCachePayload(json.cache, json.message);
        } else if (json.message) {
          setSyncMessage(json.message);
        }
        if (urlToScan.includes('ministeriodelinterior.gob.ec')) {
          setFocusScope('MINISTERIO_INTERIOR');
        }
      } else {
        setSyncError(json?.error || 'No se pudo analizar la página solicitada.');
      }
    } catch {
      setSyncError('Error al intentar leer el portal externo.');
    } finally {
      setIsScanningUrl(false);
    }
  };

  const categories = [
    { id: 'ALL', label: 'Todas las Categorías' },
    { id: 'Ministerio del Interior', label: 'Ministerio del Interior' },
    { id: 'Operativos & Capturas', label: 'Operativos & Capturas' },
    { id: 'Extorsión & Secuestros', label: 'Extorsión & Secuestros' },
    { id: 'Narcotráfico & Puertos', label: 'Narcotráfico & Puertos' },
    { id: 'Crimen Organizado', label: 'Crimen Organizado' },
    { id: 'Frontera & Minería', label: 'Frontera & Minería' },
  ];

  // Compute dynamic source list combining indexed sources + any live-discovered outlets
  const availableSources = useMemo(() => {
    const set = new Set<string>(INDEXED_NEWS_SOURCES.map((s) => s.name));
    for (const item of newsItems) {
      if (item.source) set.add(item.source);
    }
    return Array.from(set);
  }, [newsItems]);

  const sourceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of newsItems) {
      counts[item.source] = (counts[item.source] || 0) + 1;
    }
    return counts;
  }, [newsItems]);

  const ministryTotalCount = useMemo(
    () =>
      newsItems.filter(
        (item) =>
          item.source === 'Ministerio del Interior' ||
          item.category === 'Ministerio del Interior' ||
          item.isMinistryRelated
      ).length,
    [newsItems]
  );

  const officialTotalCount = useMemo(
    () => newsItems.filter((item) => item.verifiedOfficial).length,
    [newsItems]
  );

  const filteredNews = useMemo(() => {
    return newsItems.filter((item) => {
      if (focusScope === 'MINISTERIO_INTERIOR') {
        const isMin =
          item.source === 'Ministerio del Interior' ||
          item.category === 'Ministerio del Interior' ||
          Boolean(item.isMinistryRelated);
        if (!isMin) return false;
      } else if (focusScope === 'OFICIALES') {
        if (!item.verifiedOfficial) return false;
      }

      const matchesCategory =
        selectedCategory === 'ALL' ||
        item.category === selectedCategory ||
        (selectedCategory === 'Ministerio del Interior' &&
          (item.source === 'Ministerio del Interior' || item.isMinistryRelated));

      const matchesSource = selectedSource === 'ALL' || item.source === selectedSource;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.headline.toLowerCase().includes(query) ||
        item.source.toLowerCase().includes(query) ||
        item.provinces.some((p) => p.toLowerCase().includes(query)) ||
        item.crimeTypes.some((c) => c.toLowerCase().includes(query)) ||
        item.tags.some((t) => t.toLowerCase().includes(query));

      return matchesCategory && matchesSource && matchesSearch;
    });
  }, [newsItems, focusScope, selectedCategory, selectedSource, searchQuery]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(12);
  }, [focusScope, selectedCategory, selectedSource, searchQuery]);

  const displayedNews = useMemo(
    () => filteredNews.slice(0, visibleCount),
    [filteredNews, visibleCount]
  );

  const getUrgencyLabel = (urgency: EcuadorNewsItem['urgency']) => {
    switch (urgency) {
      case 'ALTA':
        return { text: 'Prioridad Alta', colorClass: 'text-rose-700 font-bold' };
      case 'TACTICA':
        return { text: 'Nivel Táctico', colorClass: 'text-amber-700 font-semibold' };
      case 'ESTRATEGICA':
      default:
        return { text: 'Estratégico', colorClass: 'text-blue-700 font-semibold' };
    }
  };

  const getSourceAccent = (source: string) => {
    if (source === 'Ministerio del Interior') return 'text-blue-800 font-bold';
    if (source === 'Policía Nacional del Ecuador') return 'text-emerald-800 font-bold';
    if (source === 'Fiscalía General del Estado') return 'text-indigo-800 font-bold';
    if (source === 'OECO Investigaciones') return 'text-teal-800 font-bold';
    return 'text-slate-800 font-bold';
  };

  return (
    <div
      id={id}
      className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden scroll-mt-24"
    >
      {/* Section Header */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-blue-300 text-xs font-semibold tracking-wide mb-2">
              <span>Monitoreo Directo</span>
              <span aria-hidden="true">·</span>
              <span>Apartado Ministerio del Interior & Delitos en Ecuador</span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2.5 text-white">
              <Newspaper className="w-6 h-6 text-blue-400 shrink-0" />
              <span>Noticias de Seguridad Nacional & Delitos</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              Extracción automatizada enfocada exclusivamente en el apartado oficial del{' '}
              <strong className="text-white font-semibold">Ministerio del Interior</strong>, Policía
              Nacional, Fiscalía General y crónicas de delitos verificados en prensa nacional y
              regional.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start shrink-0">
            <button
              type="button"
              onClick={() => setShowUrlScanner((prev) => !prev)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                showUrlScanner
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
              title="Leer una página o apartado informativo específico"
            >
              <Globe className="w-3.5 h-3.5 text-blue-300" />
              <span>Leer Portal / URL</span>
            </button>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 border border-blue-500 text-xs font-bold text-white transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap shrink-0"
              title="Consultar y actualizar todas las fuentes en vivo"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Actualizando fuentes...' : 'Actualizar Noticias'}</span>
            </button>

            <div className="text-right text-[11px] text-slate-300 tabular-nums pl-1">
              <div className="font-semibold text-white">
                {formatSyncTimeLabel(syncStats?.lastSyncIso)}
              </div>
              <div className="text-slate-400">
                {syncStats
                  ? `${newsItems.length} delitos · ${syncStats.sourcesReached} fuentes activas`
                  : `${newsItems.length} reportes verificados`}
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Targeted Portal / URL Reader */}
        {showUrlScanner && (
          <div className="mt-4 p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-xs text-slate-200 font-semibold">
                Extractor focalizado: lee cualquier página e importa únicamente noticias del{' '}
                <span className="text-blue-300">Ministerio del Interior</span> y{' '}
                <span className="text-blue-300">delitos</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-slate-400 mr-1">Accesos rápidos:</span>
                {[
                  {
                    label: 'Min. del Interior (/noticias)',
                    url: 'https://www.ministeriodelinterior.gob.ec/noticias/',
                  },
                  {
                    label: 'Policía Nacional',
                    url: 'https://noticias.policia.gob.ec/',
                  },
                  {
                    label: 'Fiscalía (FGE)',
                    url: 'https://www.fiscalia.gob.ec/',
                  },
                  {
                    label: 'El Universo Seguridad',
                    url: 'https://www.eluniverso.com/noticias/seguridad/',
                  },
                ].map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    disabled={isScanningUrl}
                    onClick={() => handleScanPortalUrl(preset.url)}
                    className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleScanPortalUrl();
              }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
            >
              <input
                type="url"
                value={targetPortalUrl}
                onChange={(e) => setTargetPortalUrl(e.target.value)}
                placeholder="https://www.ministeriodelinterior.gob.ec/noticias/"
                className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
              />
              <button
                type="submit"
                disabled={isScanningUrl || !targetPortalUrl.trim()}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanningUrl ? 'animate-spin' : ''}`} />
                <span>
                  {isScanningUrl
                    ? 'Extrayendo delitos...'
                    : 'Leer Página (Solo Min. Interior & Delitos)'}
                </span>
              </button>
            </form>
          </div>
        )}

        {/* Sync Feedback / Status Notice */}
        {(syncMessage || syncError) && (
          <div
            className={`mt-3 px-3.5 py-2 rounded-lg text-xs flex items-center justify-between gap-2 border ${
              syncError
                ? 'bg-amber-950/60 border-amber-700/60 text-amber-200'
                : 'bg-blue-950/70 border-blue-700/60 text-blue-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-blue-400" />
              <span>{syncError || syncMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSyncMessage(null);
                setSyncError(null);
              }}
              className="text-slate-400 hover:text-white cursor-pointer"
              aria-label="Cerrar aviso"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Indexed Sources Interactive Filter Strip */}
        <div className="mt-4 pt-3.5 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar text-[11px]">
          <span className="text-slate-400 font-semibold text-[11px] shrink-0 mr-1">
            Fuentes Indexadas ({INDEXED_NEWS_SOURCES.length}):
          </span>
          {INDEXED_NEWS_SOURCES.map((src) => {
            const count = sourceCounts[src.name] || 0;
            const isSelected = selectedSource === src.name;
            return (
              <div
                key={src.id}
                className={`inline-flex items-center rounded-md border transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : src.isMinistryPrimary
                    ? 'bg-blue-950/80 hover:bg-blue-900/80 border-blue-700/80 text-blue-200'
                    : 'bg-slate-800/90 hover:bg-slate-700 border-slate-700 text-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    setSelectedSource((prev) => (prev === src.name ? 'ALL' : src.name))
                  }
                  className="px-2.5 py-1 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  title={`${src.focusLabel} — Clic para filtrar`}
                >
                  <span className="font-medium">{src.shortName}</span>
                  {count > 0 && (
                    <span className="text-[10px] opacity-80 font-mono tabular-nums">({count})</span>
                  )}
                </button>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pr-2 pl-1 py-1 opacity-70 hover:opacity-100 transition-opacity"
                  title={`Abrir portal externo: ${src.name}`}
                >
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary Focus Mode + Search + Source Dropdown */}
      <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
        {/* Segmented Focus Control: All Delitos vs Apartado Ministerio del Interior vs Oficiales */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setFocusScope('ALL_CRIMES')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 tabular-nums ${
              focusScope === 'ALL_CRIMES'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos los Delitos ({newsItems.length})
          </button>
          <button
            type="button"
            onClick={() => setFocusScope('MINISTERIO_INTERIOR')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 tabular-nums ${
              focusScope === 'MINISTERIO_INTERIOR'
                ? 'bg-blue-700 text-white shadow-2xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Apartado Ministerio del Interior ({ministryTotalCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFocusScope('OFICIALES')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 tabular-nums ${
              focusScope === 'OFICIALES'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Entidades Oficiales ({officialTotalCount})
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 xl:max-w-xl">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar delito, operativo Apolo/Fénix, cantón o provincia..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Source Dropdown Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Fuente:</span>
            </div>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              aria-label="Filtrar por fuente informativa"
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/25 cursor-pointer"
            >
              <option value="ALL">Todas las Fuentes ({newsItems.length})</option>
              {availableSources.map((srcName) => (
                <option key={srcName} value={srcName}>
                  {srcName} ({sourceCounts[srcName] || 0})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="px-4 sm:px-5 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-500 font-medium whitespace-nowrap shrink-0 tabular-nums hidden md:block">
          Mostrando {displayedNews.length} de {filteredNews.length} reportes
        </div>
      </div>

      {/* News Cards Grid */}
      <div className="p-4 sm:p-6 bg-slate-50/60">
        {isRefreshing && newsItems.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 animate-pulse"
              >
                <div className="h-3 bg-slate-200 rounded w-2/3" />
                <div className="h-5 bg-slate-200 rounded w-full" />
                <div className="h-5 bg-slate-200 rounded w-4/5" />
                <div className="h-14 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-xl border border-slate-200 p-6">
            <ShieldAlert className="w-9 h-9 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-800 font-bold text-sm">
              No se encontraron noticias de delitos con los filtros seleccionados
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Restablezca los filtros o pulse Actualizar Noticias para consultar las fuentes en vivo.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setFocusScope('ALL_CRIMES');
                  setSelectedCategory('ALL');
                  setSelectedSource('ALL');
                }}
                className="px-3.5 py-2 rounded-lg bg-slate-900 text-white font-semibold text-xs cursor-pointer"
              >
                Restablecer Filtros
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="px-3.5 py-2 rounded-lg bg-blue-600 text-white font-semibold text-xs cursor-pointer"
              >
                Actualizar Fuentes
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedNews.map((item) => {
                const urgencyInfo = getUrgencyLabel(item.urgency);
                return (
                  <article
                    key={item.id}
                    className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-5 transition-colors duration-150 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Clean Unboxed Metadata Line (Zero-Pill Discipline) */}
                      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-slate-500 mb-2 tabular-nums">
                        <span className={getSourceAccent(item.source)}>{item.source}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.date}</span>
                        <span aria-hidden="true">·</span>
                        <span className={urgencyInfo.colorClass}>{urgencyInfo.text}</span>
                      </div>

                      {/* Title */}
                      <h4 className="font-heading text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug line-clamp-3 mb-2">
                        {item.title}
                      </h4>

                      {/* Summary */}
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3.5">
                        {item.summary}
                      </p>

                      {/* Clean Unboxed Geographic & Crime Classification */}
                      <div className="pt-2.5 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="font-medium text-slate-700 truncate">
                            {item.provinces.join(', ')}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="text-rose-700 font-semibold truncate">
                            {item.crimeTypes.join(' / ')}
                          </span>
                        </div>
                        {item.isMinistryRelated && item.source !== 'Ministerio del Interior' && (
                          <div className="text-[11px] text-blue-700 font-medium">
                            Vinculado a operativos del Ministerio del Interior
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Action Footer */}
                    <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedArticle(item)}
                        className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 group-hover:underline cursor-pointer whitespace-nowrap"
                      >
                        <span>Leer resumen táctico</span>
                        <span aria-hidden="true">&rarr;</span>
                      </button>

                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium transition-colors whitespace-nowrap"
                        title={`Abrir nota original en ${item.source}`}
                      >
                        <span>Nota original</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            {filteredNews.length > visibleCount && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 transition-colors cursor-pointer tabular-nums"
                >
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                  <span>
                    Cargar más noticias ({filteredNews.length - visibleCount} restantes)
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 p-4 sm:p-5 flex items-center justify-between gap-4 z-10">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 tabular-nums">
                <span className={getSourceAccent(selectedArticle.source)}>
                  {selectedArticle.source}
                </span>
                <span aria-hidden="true">·</span>
                <span>{selectedArticle.sourceCategory}</span>
                <span aria-hidden="true">·</span>
                <span className={getUrgencyLabel(selectedArticle.urgency).colorClass}>
                  {getUrgencyLabel(selectedArticle.urgency).text}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
                aria-label="Cerrar detalle de noticia"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium tabular-nums">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {selectedArticle.date} · {selectedArticle.time}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-blue-700 font-semibold">{selectedArticle.category}</span>
                <span aria-hidden="true">·</span>
                <span>Lectura {selectedArticle.readTime}</span>
              </div>

              <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {selectedArticle.title}
              </h2>

              <div className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 p-3.5 rounded-xl leading-relaxed">
                {selectedArticle.headline}
              </div>

              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>{selectedArticle.summary}</p>
                {selectedArticle.fullText && selectedArticle.fullText !== selectedArticle.summary && (
                  <p>{selectedArticle.fullText}</p>
                )}
              </div>

              {/* Geographic and Crime Info Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-blue-700" />
                  <span>Ficha de Clasificación Delictiva y Territorial</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1">
                  <div>
                    <span className="text-slate-500">Jurisdicción detectada:</span>{' '}
                    <span className="font-bold text-slate-900">
                      {selectedArticle.provinces.join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Tipología de delito:</span>{' '}
                    <span className="font-bold text-rose-700">
                      {selectedArticle.crimeTypes.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {selectedArticle.tags.length > 0 && (
                <div className="pt-1 text-xs text-slate-500">
                  <span className="font-semibold text-slate-600">Ejes temáticos: </span>
                  {selectedArticle.tags.join(' · ')}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {selectedArticle.verifiedOfficial
                    ? 'Fuente institucional oficial del Estado ecuatoriano'
                    : 'Filtrado estricto: Ministerio del Interior y Delitos'}
                </span>
              </div>
              <a
                href={selectedArticle.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Abrir publicación en {selectedArticle.source}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
