import React from 'react';
import { Filter, Calendar, MapPin, RefreshCw } from 'lucide-react';
import { MESES_LABEL, PROV_NAMES } from '../data/initialDb';

interface FilterBarProps {
  years: number[];
  selectedYear: number;
  onSelectYear: (year: number) => void;
  months: string[];
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
  selectedProvince: string;
  onSelectProvince: (prov: string) => void;
  onReset?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  years,
  selectedYear,
  onSelectYear,
  months,
  selectedMonth,
  onSelectMonth,
  selectedProvince,
  onSelectProvince,
  onReset
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-4.5 flex items-center justify-between flex-wrap gap-4 mb-6 shadow-xs">
      <div className="flex items-center gap-3 text-xs sm:text-[13px] font-extrabold uppercase tracking-wider text-slate-800">
        <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-2xs">
          <Filter className="w-4 h-4" />
        </div>
        <span>Filtro de Inteligencia Territorial:</span>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Year Select with institutional styling */}
        <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100/60 border border-slate-200/90 rounded-lg px-3.5 py-2 shadow-2xs transition-colors">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span className="text-xs text-slate-500 font-bold uppercase">Año:</span>
          <select
            value={selectedYear}
            onChange={(e) => onSelectYear(Number(e.target.value))}
            className="bg-transparent text-slate-900 text-xs sm:text-sm font-black outline-none cursor-pointer"
          >
            {years.map((y) => (
              <option key={y} value={y} className="bg-white text-slate-900">
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Month Select with institutional styling */}
        <div className={`flex items-center gap-2 ${selectedMonth === 'ALL' ? 'bg-blue-50/70 border-blue-300/80 shadow-xs' : 'bg-slate-50 hover:bg-slate-100/60 border-slate-200/90 shadow-2xs'} border rounded-lg px-3.5 py-2 transition-all focus-within:ring-2 focus-within:ring-blue-500/25 focus-within:border-blue-500`}>
          <span className={`text-xs ${selectedMonth === 'ALL' ? 'text-blue-800' : 'text-slate-500'} font-bold uppercase`}>Mes:</span>
          <select
            value={selectedMonth}
            onChange={(e) => onSelectMonth(e.target.value)}
            className={`bg-transparent ${selectedMonth === 'ALL' ? 'text-blue-950 font-black' : 'text-slate-900 font-black'} text-xs sm:text-sm outline-none cursor-pointer`}
          >
            <option value="ALL" className="bg-white text-blue-900 font-bold">
              Todos los Meses (Total)
            </option>
            {months.map((m) => (
              <option key={m} value={m} className="bg-white text-slate-900 font-medium">
                {MESES_LABEL[m] || m}
              </option>
            ))}
          </select>
        </div>

        {/* Province Select with institutional styling */}
        <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100/60 border border-slate-200/90 rounded-lg px-3.5 py-2 shadow-2xs transition-colors">
          <MapPin className="w-4 h-4 text-slate-500" />
          <span className="text-xs text-slate-500 font-bold uppercase">Provincia:</span>
          <select
            value={selectedProvince}
            onChange={(e) => onSelectProvince(e.target.value)}
            className="bg-transparent text-slate-900 text-xs sm:text-sm font-black outline-none cursor-pointer max-w-[200px]"
          >
            <option value="all" className="bg-white text-slate-900">Todas las Provincias</option>
            {PROV_NAMES.map((p) => (
              <option key={p} value={p} className="bg-white text-slate-900">
                {p}
              </option>
            ))}
          </select>
        </div>

        {selectedProvince !== 'all' && (
          <button
            onClick={() => onSelectProvince('all')}
            className="text-xs sm:text-sm text-blue-700 hover:text-blue-900 font-bold underline cursor-pointer px-2 py-1.5"
          >
            Restablecer Ecuador
          </button>
        )}
      </div>
    </div>
  );
};

