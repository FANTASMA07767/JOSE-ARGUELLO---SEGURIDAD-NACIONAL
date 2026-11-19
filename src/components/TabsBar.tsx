import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Map,
  Clock,
  GitCompare,
  FileText,
  ShieldCheck,
  Compass
} from 'lucide-react';

interface TabsBarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenUpload?: () => void;
}

export const TabsBar: React.FC<TabsBarProps> = ({
  activeTab,
  onSelectTab
}) => {
  const tabs = [
    { id: 'resumen', label: 'Resumen Ejecutivo', num: '01', icon: LayoutDashboard },
    { id: 'provincias', label: 'Provincias', num: '02', icon: MapPin },
    { id: 'mapa', label: 'Mapa Ecuador (Google Maps)', num: '03', icon: Map },
    { id: 'horarios', label: 'Horarios', num: '04', icon: Clock },
    { id: 'comparativa', label: 'Comparativa', num: '05', icon: GitCompare },
    { id: 'especiales', label: 'Informes Mensuales', num: '06', icon: FileText },
    { id: 'oeco', label: 'OECO · Crimen Organizado', num: '07', icon: ShieldCheck, isGreen: true },
    { id: 'territorio', label: 'INFO - TERRITORIO', num: '08', icon: Compass, isDarkBlue: true },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="w-[92%] 2xl:w-[94%] max-w-[1650px] mx-auto flex items-center justify-start overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-1.5 py-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-3 sm:py-3.5 font-heading text-xs sm:text-[13px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border-b-[3px] rounded-t-lg cursor-pointer ${
                  isActive
                    ? tab.isGreen
                      ? 'border-emerald-600 text-emerald-800 bg-emerald-50/70 font-black shadow-2xs'
                      : tab.isDarkBlue
                      ? 'border-indigo-700 text-indigo-950 bg-indigo-50/80 font-black shadow-2xs'
                      : 'border-blue-700 text-blue-900 bg-blue-50/70 font-black shadow-2xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <span
                  className={`text-[11px] font-black ${
                    tab.isGreen ? 'text-emerald-700' : tab.isDarkBlue ? 'text-indigo-700' : 'text-blue-700'
                  }`}
                >
                  {tab.num}
                </span>
                <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 opacity-90" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

