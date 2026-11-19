import React, { useState, useEffect, useMemo } from 'react';
import { YearDatabase, MonthData, GrandTotal, ProvinceData, CantonData, HorariosProvRow } from './types/crime';
import { INITIAL_DB, MESES_LABEL } from './data/initialDb';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { TabsBar } from './components/TabsBar';
import { ResumenTab } from './components/Tabs/ResumenTab';
import { ProvinciasTab } from './components/Tabs/ProvinciasTab';
import { MapaTab } from './components/Tabs/MapaTab';
import { HorariosTab } from './components/Tabs/HorariosTab';
import { ComparativaTab } from './components/Tabs/ComparativaTab';
import { EspecialesTab } from './components/Tabs/EspecialesTab';
import { OecoTab } from './components/Tabs/OecoTab';
import { InfoTerritorioTab } from './components/Tabs/InfoTerritorioTab';
import { ExcelUploadModal } from './components/ExcelUploadModal';
import { AiAdvisorPanel } from './components/AiAdvisorPanel';
import { CheckCircle2, Shield } from 'lucide-react';

const STORAGE_KEY = 'jmac_crime_db_v3';

export default function App() {
  // Database state with localStorage persistence
  const [database, setDatabase] = useState<YearDatabase>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...INITIAL_DB,
          ...parsed,
          2025: { ...INITIAL_DB[2025], ...(parsed[2025] || {}) },
          2026: { ...(parsed[2026] || {}), ...INITIAL_DB[2026] }
        };
      }
    } catch (e) {
      console.error('Error loading stored database:', e);
    }
    return INITIAL_DB;
  });

  // Current filters - defaults to the latest official month (Octubre 2026)
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<string>('OCTUBRE');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('resumen');

  // Modals & feedback
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Available years & months
  const availableYears = useMemo(() => {
    return Object.keys(database).map(Number).sort((a, b) => b - a);
  }, [database]);

  const availableMonths = useMemo(() => {
    return Object.keys(database[selectedYear] || {});
  }, [database, selectedYear]);

  // Ensure current month is valid
  useEffect(() => {
    if (selectedMonth !== 'ALL' && !availableMonths.includes(selectedMonth)) {
      if (availableMonths.length > 0) {
        setSelectedMonth(availableMonths[availableMonths.length - 1]);
      }
    }
  }, [availableMonths, selectedMonth]);

  // Active month data (filtered by province if chosen, or aggregated if 'ALL')
  const activeMonthData = useMemo(() => {
    let rawData: MonthData | undefined;

    if (selectedMonth === 'ALL') {
      const yearData = database[selectedYear];
      if (yearData) {
        const monthKeys = Object.keys(yearData);
        if (monthKeys.length > 0) {
          const aggregatedGrand: GrandTotal = {
            robo: 0,
            secuestro: 0,
            asesinato: 0,
            extorsion: 0,
            secuestroExt: 0,
            extorsionSexual: 0,
            total: 0
          };

          const provMap = new Map<string, ProvinceData>();
          const cantonMap = new Map<string, CantonData>();
          const horariosAccum = {
            madrugada: { robo: 0, secuestro: 0, asesinato: 0, extorsion: 0 },
            manana: { robo: 0, secuestro: 0, asesinato: 0, extorsion: 0 },
            tarde: { robo: 0, secuestro: 0, asesinato: 0, extorsion: 0 },
            noche: { robo: 0, secuestro: 0, asesinato: 0, extorsion: 0 },
          };
          const flagranciaAccum: Record<string, { flagrante: number; noFlagrante: number }> = {};
          const tentativaAccum: Record<string, { consumado: number; tentativa: number }> = {};
          const horariosProvMap = new Map<string, HorariosProvRow>();
          let totalRural = 0;
          let totalUrbano = 0;

          monthKeys.forEach((mKey) => {
            const mData = yearData[mKey];
            if (!mData) return;

            // Grand totals
            aggregatedGrand.robo += mData.grand.robo || 0;
            aggregatedGrand.secuestro += mData.grand.secuestro || 0;
            aggregatedGrand.asesinato += mData.grand.asesinato || 0;
            aggregatedGrand.extorsion += mData.grand.extorsion || 0;
            aggregatedGrand.secuestroExt = (aggregatedGrand.secuestroExt || 0) + (mData.grand.secuestroExt || 0);
            aggregatedGrand.extorsionSexual = (aggregatedGrand.extorsionSexual || 0) + (mData.grand.extorsionSexual || 0);
            aggregatedGrand.total += mData.grand.total || 0;

            // Provincias
            mData.provincias.forEach((p) => {
              const existing = provMap.get(p.name);
              if (existing) {
                existing.robo += p.robo || 0;
                existing.secuestro += p.secuestro || 0;
                existing.asesinato += p.asesinato || 0;
                existing.extorsion += p.extorsion || 0;
                existing.secuestroExt = (existing.secuestroExt || 0) + (p.secuestroExt || 0);
                existing.total += p.total || 0;
                existing.rural = (existing.rural || 0) + (p.rural || 0);
                existing.urbano = (existing.urbano || 0) + (p.urbano || 0);
              } else {
                provMap.set(p.name, { ...p, secuestroExt: p.secuestroExt || 0, rural: p.rural || 0, urbano: p.urbano || 0 });
              }
            });

            // Cantones
            if (mData.cantones) {
              mData.cantones.forEach((c) => {
                const key = `${c.prov}__${c.canton}`;
                const existing = cantonMap.get(key);
                if (existing) {
                  existing.robo += c.robo || 0;
                  existing.extorsion += c.extorsion || 0;
                  existing.asesinato += c.asesinato || 0;
                  existing.secuestro += c.secuestro || 0;
                  existing.secuestroExt = (existing.secuestroExt || 0) + (c.secuestroExt || 0);
                  existing.total += c.total || 0;
                } else {
                  cantonMap.set(key, { ...c, secuestroExt: c.secuestroExt || 0 });
                }
              });
            }

            // Horarios
            if (mData.horarios) {
              (['madrugada', 'manana', 'tarde', 'noche'] as const).forEach((slot) => {
                if (mData.horarios[slot]) {
                  horariosAccum[slot].robo += mData.horarios[slot].robo || 0;
                  horariosAccum[slot].secuestro += mData.horarios[slot].secuestro || 0;
                  horariosAccum[slot].asesinato += mData.horarios[slot].asesinato || 0;
                  horariosAccum[slot].extorsion += mData.horarios[slot].extorsion || 0;
                }
              });
            }

            // Flagrancia
            if (mData.flagrancia) {
              Object.entries(mData.flagrancia).forEach(([k, v]) => {
                if (!flagranciaAccum[k]) flagranciaAccum[k] = { flagrante: 0, noFlagrante: 0 };
                flagranciaAccum[k].flagrante += v.flagrante || 0;
                flagranciaAccum[k].noFlagrante += v.noFlagrante || 0;
              });
            }

            // Tentativa
            if (mData.tentativa) {
              Object.entries(mData.tentativa).forEach(([k, v]) => {
                if (!tentativaAccum[k]) {
                  tentativaAccum[k] = { consumado: 0, tentativa: 0 };
                }
                tentativaAccum[k].consumado += v.consumado || 0;
                tentativaAccum[k].tentativa += v.tentativa || 0;
              });
            }

            // Zona Nacional
            if (mData.zonaNacional) {
              totalRural += mData.zonaNacional.rural || 0;
              totalUrbano += mData.zonaNacional.urbano || 0;
            }

            // HorariosProv
            if (mData.horariosProv) {
              mData.horariosProv.forEach((hp) => {
                const existing = horariosProvMap.get(hp.prov);
                if (existing) {
                  existing.mad += hp.mad || 0;
                  existing.man += hp.man || 0;
                  existing.tar += hp.tar || 0;
                  existing.noc += hp.noc || 0;
                  existing.tot += hp.tot || 0;
                } else {
                  horariosProvMap.set(hp.prov, { ...hp });
                }
              });
            }
          });

          rawData = {
            provincias: Array.from(provMap.values()),
            grand: aggregatedGrand,
            horarios: horariosAccum,
            flagrancia: flagranciaAccum,
            tentativa: tentativaAccum,
            zonaNacional: { rural: totalRural, urbano: totalUrbano },
            cantones: Array.from(cantonMap.values()),
            horariosProv: Array.from(horariosProvMap.values()),
            notes: `Consolidado acumulado de todos los meses de ${selectedYear}`
          };
        }
      }
    }

    if (!rawData) {
      rawData = database[selectedYear]?.[selectedMonth] || database[2026]?.['OCTUBRE'] || database[2026]?.['SEPTIEMBRE'] || database[2026]?.['AGOSTO'];
    }

    if (!rawData) return null;

    if (selectedProvince === 'all') {
      return rawData;
    }

    const prov = rawData.provincias.find(
      (p) => p.name.toLowerCase() === selectedProvince.toLowerCase()
    );

    if (!prov) return rawData;

    return {
      ...rawData,
      provincias: [prov],
      grand: {
        robo: prov.robo,
        secuestro: prov.secuestro,
        asesinato: prov.asesinato,
        extorsion: prov.extorsion,
        secuestroExt: prov.secuestroExt || 0,
        total: prov.total
      }
    };
  }, [database, selectedYear, selectedMonth, selectedProvince]);

  // Previous month data for statistical trend indicator comparison
  const previousMonthInfo = useMemo(() => {
    const MONTH_ORDER = [
      'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
      'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ];

    if (selectedMonth === 'ALL') {
      const prevYear = selectedYear - 1;
      const prevYearData = database[prevYear];
      if (prevYearData) {
        const monthKeys = Object.keys(prevYearData);
        if (monthKeys.length > 0) {
          const aggregatedGrand: GrandTotal = {
            robo: 0,
            secuestro: 0,
            asesinato: 0,
            extorsion: 0,
            secuestroExt: 0,
            extorsionSexual: 0,
            total: 0
          };
          const provMap = new Map<string, { robo: number; secuestro: number; asesinato: number; extorsion: number; secuestroExt: number; total: number }>();

          monthKeys.forEach((mKey) => {
            const mData = prevYearData[mKey];
            if (!mData) return;
            aggregatedGrand.robo += mData.grand.robo || 0;
            aggregatedGrand.secuestro += mData.grand.secuestro || 0;
            aggregatedGrand.asesinato += mData.grand.asesinato || 0;
            aggregatedGrand.extorsion += mData.grand.extorsion || 0;
            aggregatedGrand.secuestroExt = (aggregatedGrand.secuestroExt || 0) + (mData.grand.secuestroExt || 0);
            aggregatedGrand.total += mData.grand.total || 0;

            mData.provincias.forEach((p) => {
              const ex = provMap.get(p.name.toLowerCase());
              if (ex) {
                ex.robo += p.robo;
                ex.secuestro += p.secuestro;
                ex.asesinato += p.asesinato;
                ex.extorsion += p.extorsion;
                ex.secuestroExt += p.secuestroExt || 0;
                ex.total += p.total;
              } else {
                provMap.set(p.name.toLowerCase(), {
                  robo: p.robo,
                  secuestro: p.secuestro,
                  asesinato: p.asesinato,
                  extorsion: p.extorsion,
                  secuestroExt: p.secuestroExt || 0,
                  total: p.total
                });
              }
            });
          });

          if (selectedProvince !== 'all') {
            const prov = provMap.get(selectedProvince.toLowerCase());
            if (prov) {
              return {
                label: `Año ${prevYear}`,
                grand: {
                  ...prov,
                  extorsionSexual: 0
                }
              };
            }
          }

          return {
            label: `Año ${prevYear}`,
            grand: aggregatedGrand
          };
        }
      }
      return null;
    }

    const currIdx = MONTH_ORDER.indexOf(selectedMonth);
    let targetYear = selectedYear;
    let prevMonthKey: string | null = null;

    if (currIdx > 0) {
      prevMonthKey = MONTH_ORDER[currIdx - 1];
    } else if (currIdx === 0) {
      targetYear = selectedYear - 1;
      prevMonthKey = 'DICIEMBRE';
    }

    if (!prevMonthKey || !database[targetYear]) {
      return null;
    }

    let prevRawData = database[targetYear][prevMonthKey];

    // Fallback: If exact chronological previous month not in DB, pick the previous month available in DB
    if (!prevRawData) {
      const availInYear = availableMonths.filter((m) => m !== 'ALL');
      const idxInAvail = availInYear.indexOf(selectedMonth);
      if (idxInAvail > 0) {
        const fallbackKey = availInYear[idxInAvail - 1];
        prevRawData = database[selectedYear]?.[fallbackKey];
        prevMonthKey = fallbackKey;
      }
    }

    if (!prevRawData) return null;

    const prevLabel = MESES_LABEL[prevMonthKey] || prevMonthKey;

    if (selectedProvince !== 'all') {
      const prov = prevRawData.provincias.find(
        (p) => p.name.toLowerCase() === selectedProvince.toLowerCase()
      );
      if (prov) {
        return {
          label: prevLabel,
          grand: {
            robo: prov.robo,
            secuestro: prov.secuestro,
            asesinato: prov.asesinato,
            extorsion: prov.extorsion,
            secuestroExt: prov.secuestroExt || 0,
            extorsionSexual: 0,
            total: prov.total
          }
        };
      }
    }

    return {
      label: prevLabel,
      grand: prevRawData.grand
    };
  }, [database, selectedYear, selectedMonth, selectedProvince, availableMonths]);

  // Navigate to News section in OECO tab
  const handleNavigateToNews = () => {
    setActiveTab('oeco');
    setTimeout(() => {
      const el = document.getElementById('seccion-noticias-oeco');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  // Handle saving new Excel month data
  const handleSaveMonthData = (year: number, monthKey: string, newMonthData: MonthData) => {
    setDatabase((prev) => {
      const updated = {
        ...prev,
        [year]: {
          ...(prev[year] || {}),
          [monthKey]: newMonthData
        }
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }

      return updated;
    });

    setSelectedYear(year);
    setSelectedMonth(monthKey);
    setSelectedProvince('all');
    setActiveTab('resumen');

    setToastMessage(`¡Mes ${MESES_LABEL[monthKey] || monthKey} ${year} ingresado y ordenado por la IA con éxito!`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  if (!activeMonthData) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-800 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-medium">Cargando base de datos de seguridad nacional...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900 relative">
      {/* Background Subtle Tech Ambient Grid & Micro-Nodes (low opacity, executive feel) */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025] z-0"
        style={{
          backgroundImage:
            'radial-gradient(#1E40AF 1px, transparent 1px), radial-gradient(#0284C7 1px, transparent 1px)',
          backgroundSize: '36px 36px, 18px 18px',
        }}
      />

      {/* Subtle connection lines in viewport background */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.02] z-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="10%" y1="20%" x2="35%" y2="50%" stroke="#2563EB" strokeWidth="1" strokeDasharray="6 6" />
        <line x1="75%" y1="30%" x2="90%" y2="70%" stroke="#0284C7" strokeWidth="1" strokeDasharray="6 6" />
        <circle cx="10%" cy="20%" r="3" fill="#2563EB" />
        <circle cx="35%" cy="50%" r="2.5" fill="#2563EB" />
        <circle cx="75%" cy="30%" r="2.5" fill="#0284C7" />
        <circle cx="90%" cy="70%" r="3" fill="#0284C7" />
      </svg>

      {/* Subtle ambient lighting glows (secondary visual depth) */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1650px] h-[360px] pointer-events-none opacity-50 z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(37, 99, 235, 0.05) 0%, rgba(14, 165, 233, 0.02) 45%, transparent 75%)',
        }}
      />
      <div
        className="fixed bottom-0 right-0 w-[500px] h-[400px] pointer-events-none opacity-35 z-0"
        style={{
          background: 'radial-gradient(circle at 100% 100%, rgba(30, 64, 175, 0.04) 0%, transparent 60%)',
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-emerald-300 border-l-4 border-l-emerald-600 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs text-emerald-900 animate-in fade-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Header - Centered Institutional Identity */}
      <Header />

      {/* Hero Banner */}
      <Hero
        currentYear={selectedYear}
        currentMonth={selectedMonth}
        monthLabel={MESES_LABEL[selectedMonth] || selectedMonth}
        grandTotal={activeMonthData.grand}
        isAiImported={activeMonthData.isAiImported}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
      />

      {/* Tabs Navigation */}
      <TabsBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Viewport Container: 92% - 94% available width, max-w-[1650px] */}
      <main className="flex-1 w-[92%] 2xl:w-[94%] max-w-[1650px] mx-auto py-7">
        {/* Global Filter Bar (Hidden on OECO and INFO - TERRITORIO since they have dedicated operational context) */}
        {activeTab !== 'oeco' && activeTab !== 'territorio' && (
          <FilterBar
            years={availableYears}
            selectedYear={selectedYear}
            onSelectYear={setSelectedYear}
            months={availableMonths}
            selectedMonth={selectedMonth}
            onSelectMonth={setSelectedMonth}
            selectedProvince={selectedProvince}
            onSelectProvince={setSelectedProvince}
          />
        )}

        {/* Tab 1: Resumen Ejecutivo */}
        {activeTab === 'resumen' && (
          <ResumenTab
            monthData={activeMonthData}
            allMonthsInYear={database[selectedYear] || {}}
            currentYear={selectedYear}
            currentMonth={selectedMonth}
            selectedProvince={selectedProvince}
            previousMonthData={previousMonthInfo}
            onSelectProvince={setSelectedProvince}
            onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
            onNavigateToNews={handleNavigateToNews}
          />
        )}

        {/* Tab 2: Incidencia por Provincia */}
        {activeTab === 'provincias' && (
          <ProvinciasTab
            monthData={activeMonthData}
            currentYear={selectedYear}
            currentMonth={selectedMonth}
            onSelectProvince={setSelectedProvince}
          />
        )}

        {/* Tab 3: Mapa de Calor Ecuador con Google Maps */}
        {activeTab === 'mapa' && (
          <MapaTab
            monthData={activeMonthData}
            currentYear={selectedYear}
            currentMonth={selectedMonth}
            selectedProvince={selectedProvince}
            onSelectProvince={setSelectedProvince}
          />
        )}

        {/* Tab 4: Horarios */}
        {activeTab === 'horarios' && (
          <HorariosTab
            monthData={activeMonthData}
            currentYear={selectedYear}
            currentMonth={selectedMonth}
          />
        )}

        {/* Tab 5: Comparativa 2025 vs 2026 */}
        {activeTab === 'comparativa' && (
          <ComparativaTab database={database} />
        )}

        {/* Tab 6: Informes Mensuales Especiales */}
        {activeTab === 'especiales' && (
          <EspecialesTab
            database={database}
            onOpenUpload={() => setIsUploadOpen(true)}
          />
        )}

        {/* Tab 7: OECO Contexto Nacional */}
        {activeTab === 'oeco' && <OecoTab />}

        {/* Tab 8: INFO - TERRITORIO (Seguridad Portuaria & Inteligencia Territorial) */}
        {activeTab === 'territorio' && (
          <InfoTerritorioTab onOpenUpload={() => setIsUploadOpen(true)} />
        )}
      </main>

      {/* Modals */}
      <ExcelUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSaveMonthData={handleSaveMonthData}
      />

      <AiAdvisorPanel
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
        currentYear={selectedYear}
        currentMonth={selectedMonth}
        selectedProvince={selectedProvince}
        monthData={activeMonthData}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-xs">
        <div className="w-[92%] 2xl:w-[94%] max-w-[1650px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-blue-700 flex items-center justify-center text-white shadow-xs">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div className="font-heading font-bold text-xs uppercase text-slate-800 tracking-wider">
              Dirección Nacional <span className="text-blue-700 font-extrabold">de Seguridad Ciudadana</span>
            </div>
          </div>
          <div className="text-slate-500 text-center text-[11px] leading-relaxed">
            Plataforma de Analítica Criminal, Georreferenciación & Monitoreo Operativo · Ecuador 2025–2026
            <br />
            Datos integrados del sistema nacional SIAF, Fiscalía General del Estado y Observatorio OECO
          </div>
          <div className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            Uso Institucional · Confidencial
          </div>
        </div>
      </footer>
    </div>
  );
}
