import React, { useState, useMemo } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap
} from '@vis.gl/react-google-maps';
import { ProvinceData } from '../types/crime';
import { MapPin, Navigation, Layers, ShieldAlert, AlertTriangle, Building2, Trees, Check } from 'lucide-react';

interface Props {
  provincias: ProvinceData[];
  selectedField: 'total' | 'robo' | 'extorsion' | 'asesinato' | 'secuestro';
  selectedProvince?: string;
  onSelectProvince?: (provName: string) => void;
  apiKey?: string;
}

// Coordinates for the 24 provinces of Ecuador
const PROVINCE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'guayas': { lat: -2.1894, lng: -79.8891 },
  'pichincha': { lat: -0.1807, lng: -78.4678 },
  'manabí': { lat: -1.0543, lng: -80.4526 },
  'manabi': { lat: -1.0543, lng: -80.4526 },
  'los ríos': { lat: -1.5598, lng: -79.4588 },
  'los rios': { lat: -1.5598, lng: -79.4588 },
  'el oro': { lat: -3.2581, lng: -79.9554 },
  'esmeraldas': { lat: 0.9682, lng: -79.6517 },
  'santa elena': { lat: -2.2262, lng: -80.8587 },
  'sto. domingo': { lat: -0.2530, lng: -79.1754 },
  'santo domingo': { lat: -0.2530, lng: -79.1754 },
  'azuay': { lat: -2.9001, lng: -79.0059 },
  'loja': { lat: -3.9931, lng: -79.2042 },
  'chimborazo': { lat: -1.6636, lng: -78.6546 },
  'tungurahua': { lat: -1.2491, lng: -78.6168 },
  'imbabura': { lat: 0.3517, lng: -78.1223 },
  'cotopaxi': { lat: -0.9316, lng: -78.6155 },
  'cañar': { lat: -2.5597, lng: -78.9386 },
  'canar': { lat: -2.5597, lng: -78.9386 },
  'bolívar': { lat: -1.5916, lng: -79.0041 },
  'bolivar': { lat: -1.5916, lng: -79.0041 },
  'carchi': { lat: 0.8123, lng: -77.7173 },
  'napo': { lat: -0.9938, lng: -77.8129 },
  'pastaza': { lat: -1.4883, lng: -77.9986 },
  'morona s.': { lat: -2.3087, lng: -78.1186 },
  'morona santiago': { lat: -2.3087, lng: -78.1186 },
  'zamora c.': { lat: -4.0692, lng: -78.9566 },
  'zamora chinchipe': { lat: -4.0692, lng: -78.9566 },
  'sucumbíos': { lat: 0.0847, lng: -76.8828 },
  'sucumbios': { lat: 0.0847, lng: -76.8828 },
  'orellana': { lat: -0.4636, lng: -76.9875 },
  'galápagos': { lat: -0.9538, lng: -90.9656 },
  'galapagos': { lat: -0.9538, lng: -90.9656 }
};

// Component to handle map camera center controls
const MapController: React.FC<{ selectedProvince?: string }> = ({ selectedProvince }) => {
  const map = useMap('ecuador-main-map');

  React.useEffect(() => {
    if (!map) return;
    if (selectedProvince && selectedProvince !== 'all') {
      const coords = PROVINCE_COORDINATES[selectedProvince.toLowerCase().trim()];
      if (coords) {
        map.panTo(coords);
        map.setZoom(9);
        return;
      }
    }
  }, [map, selectedProvince]);

  return null;
};

export const EcuadorGoogleMap: React.FC<Props> = ({
  provincias,
  selectedField,
  selectedProvince,
  onSelectProvince,
  apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
}) => {
  const [activeMarkerProv, setActiveMarkerProv] = useState<ProvinceData | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');

  const totalDelitos = useMemo(() => {
    return provincias.reduce((acc, p) => acc + ((p as any)[selectedField] || 0), 0) || 1;
  }, [provincias, selectedField]);

  const maxVal = useMemo(() => {
    return Math.max(...provincias.map((p) => (p as any)[selectedField] || 0), 1);
  }, [provincias, selectedField]);

  // Color & intensity mapping for security level
  const getMarkerRiskStyle = (val: number, isSelected: boolean) => {
    const ratio = val / maxVal;
    if (isSelected) {
      return {
        bg: 'bg-amber-500 text-white border-2 border-white ring-2 ring-amber-500 shadow-xl',
        badge: 'bg-amber-600 text-white',
        level: 'Seleccionado'
      };
    }
    if (ratio > 0.6) {
      return {
        bg: 'bg-red-600 text-white border border-red-700 shadow-lg',
        badge: 'bg-red-700 text-white',
        level: 'Crítico'
      };
    }
    if (ratio > 0.3) {
      return {
        bg: 'bg-orange-500 text-white border border-orange-600 shadow-md',
        badge: 'bg-orange-600 text-white',
        level: 'Alto'
      };
    }
    if (ratio > 0.1) {
      return {
        bg: 'bg-blue-600 text-white border border-blue-700 shadow-sm',
        badge: 'bg-blue-700 text-white',
        level: 'Medio'
      };
    }
    return {
      bg: 'bg-slate-700 text-slate-100 border border-slate-600',
      badge: 'bg-slate-800 text-slate-200',
      level: 'Bajo'
    };
  };

  const resetCenter = () => {
    if (onSelectProvince) onSelectProvince('all');
    setActiveMarkerProv(null);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-sm flex flex-col">
      {/* Map Control Header */}
      <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="font-heading text-sm font-bold uppercase tracking-wider text-slate-900 leading-none">
              Mapa Operacional Google Maps · Ecuador
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Georreferenciación de 24 provincias · Haz clic en un marcador para auditar métricas
            </div>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs font-semibold">
            <button
              onClick={() => setMapType('roadmap')}
              className={`px-2.5 py-1 rounded text-[11px] font-heading uppercase tracking-wider transition-colors ${
                mapType === 'roadmap' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Estándar
            </button>
            <button
              onClick={() => setMapType('terrain')}
              className={`px-2.5 py-1 rounded text-[11px] font-heading uppercase tracking-wider transition-colors ${
                mapType === 'terrain' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Relieve
            </button>
            <button
              onClick={() => setMapType('hybrid')}
              className={`px-2.5 py-1 rounded text-[11px] font-heading uppercase tracking-wider transition-colors ${
                mapType === 'hybrid' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Satélite
            </button>
          </div>

          <button
            onClick={resetCenter}
            className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
            title="Centrar mapa en Ecuador"
          >
            <Navigation className="w-3.5 h-3.5 text-blue-600" />
            <span>Centrar</span>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[520px]">
        <APIProvider apiKey={apiKey}>
          <Map
            id="ecuador-main-map"
            mapId="DEMO_MAP_ID"
            defaultCenter={{ lat: -1.8312, lng: -78.1834 }}
            defaultZoom={7}
            minZoom={5}
            maxZoom={14}
            mapTypeId={mapType}
            gestureHandling="cooperative"
            disableDefaultUI={false}
            internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
            className="w-full h-full"
          >
            <MapController selectedProvince={selectedProvince} />

            {/* Markers for all 24 Provinces */}
            {provincias.map((prov) => {
              const coords = PROVINCE_COORDINATES[prov.name.toLowerCase().trim()];
              if (!coords) return null;

              const val = (prov as any)[selectedField] || 0;
              const isSelected = selectedProvince?.toLowerCase() === prov.name.toLowerCase();
              const style = getMarkerRiskStyle(val, isSelected);

              return (
                <AdvancedMarker
                  key={prov.name}
                  position={coords}
                  title={`${prov.name}: ${val.toLocaleString()}`}
                  onClick={() => {
                    setActiveMarkerProv(prov);
                    if (onSelectProvince) {
                      onSelectProvince(isSelected ? 'all' : prov.name);
                    }
                  }}
                >
                  <div
                    className={`cursor-pointer rounded-full flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold transition-all transform hover:scale-110 active:scale-95 ${style.bg}`}
                  >
                    <span className="font-heading text-xs uppercase tracking-tight">{prov.name}</span>
                    <span className="font-mono-numbers text-[11px] px-1.5 py-0.2 rounded-full bg-black/25">
                      {val.toLocaleString()}
                    </span>
                  </div>
                </AdvancedMarker>
              );
            })}

            {/* InfoWindow for Clicked Province */}
            {activeMarkerProv && PROVINCE_COORDINATES[activeMarkerProv.name.toLowerCase().trim()] && (
              <InfoWindow
                position={PROVINCE_COORDINATES[activeMarkerProv.name.toLowerCase().trim()]}
                onCloseClick={() => setActiveMarkerProv(null)}
                pixelOffset={[0, -32]}
              >
                <div className="p-1 max-w-[260px] text-slate-800 font-body">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2">
                    <div>
                      <h4 className="font-heading text-base font-bold text-slate-900 uppercase leading-none">
                        {activeMarkerProv.name}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono-numbers">
                        {(((activeMarkerProv as any)[selectedField] || 0) / totalDelitos * 100).toFixed(1)}% del total nacional
                      </span>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                      Total: {activeMarkerProv.total.toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono-numbers mb-2.5">
                    <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                      <span className="text-[10px] text-slate-500 uppercase block">Robos</span>
                      <span className="font-bold text-slate-800">{activeMarkerProv.robo.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                      <span className="text-[10px] text-slate-500 uppercase block">Extorsiones</span>
                      <span className="font-bold text-amber-700">{activeMarkerProv.extorsion.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                      <span className="text-[10px] text-slate-500 uppercase block">Asesinatos</span>
                      <span className="font-bold text-red-600">{activeMarkerProv.asesinato.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                      <span className="text-[10px] text-slate-500 uppercase block">Secuestros</span>
                      <span className="font-bold text-slate-800">
                        {(activeMarkerProv.secuestro + (activeMarkerProv.secuestroExt || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {activeMarkerProv.urbano !== undefined && activeMarkerProv.rural !== undefined && (
                    <div className="flex items-center justify-between text-[11px] text-slate-600 border-t border-slate-100 pt-1.5 mb-2">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-blue-600" /> Urbano: {activeMarkerProv.urbano}
                      </span>
                      <span className="flex items-center gap-1">
                        <Trees className="w-3 h-3 text-emerald-600" /> Rural: {activeMarkerProv.rural}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (onSelectProvince) {
                        onSelectProvince(activeMarkerProv.name);
                      }
                      setActiveMarkerProv(null);
                    }}
                    className="w-full py-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-heading text-xs font-bold uppercase tracking-wider transition-colors text-center cursor-pointer"
                  >
                    Filtrar Todo el Tablero
                  </button>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>

        {/* Floating Legend */}
        <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-lg p-2.5 shadow-md text-xs">
          <div className="font-heading text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            Severidad ({selectedField.toUpperCase()})
          </div>
          <div className="flex items-center gap-2 font-mono-numbers text-[10px] text-slate-600">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block"></span> Bajo</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span> Medio</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span> Alto</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span> Crítico</span>
          </div>
        </div>
      </div>
    </div>
  );
};
