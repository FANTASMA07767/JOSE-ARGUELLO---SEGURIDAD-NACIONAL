import React, { useState } from 'react';
import { ProvinceData } from '../types/crime';

interface Props {
  provincias: ProvinceData[];
  selectedField: 'total' | 'robo' | 'extorsion' | 'asesinato' | 'secuestro';
  onSelectProvince?: (provName: string) => void;
  selectedProvince?: string;
}

// Stylized geographical layout polygons for Ecuador continental provinces
// Scaled to a 600x560 canvas with accurate relative positions and coastal contours
interface ProvShape {
  id: string;
  name: string;
  d: string;
  labelPos: [number, number];
}

const ECUADOR_PROVINCES: ProvShape[] = [
  {
    id: 'esmeraldas',
    name: 'Esmeraldas',
    d: 'M130,50 L220,55 L250,90 L210,120 L150,115 L110,85 Z',
    labelPos: [175, 80]
  },
  {
    id: 'carchi',
    name: 'Carchi',
    d: 'M250,55 L310,50 L315,90 L260,95 L250,75 Z',
    labelPos: [280, 72]
  },
  {
    id: 'imbabura',
    name: 'Imbabura',
    d: 'M230,95 L280,95 L295,130 L235,135 L215,115 Z',
    labelPos: [255, 115]
  },
  {
    id: 'sucumbios',
    name: 'Sucumbíos',
    d: 'M295,75 L480,85 L470,140 L350,145 L295,120 Z',
    labelPos: [390, 110]
  },
  {
    id: 'pichincha',
    name: 'Pichincha',
    d: 'M200,125 L255,125 L285,175 L225,185 L180,165 Z',
    labelPos: [235, 155]
  },
  {
    id: 'santo_domingo',
    name: 'Sto. Domingo',
    d: 'M160,140 L200,140 L210,175 L165,185 L145,160 Z',
    labelPos: [175, 165]
  },
  {
    id: 'manabi',
    name: 'Manabí',
    d: 'M70,120 L155,120 L160,195 L145,260 L90,265 L60,190 Z',
    labelPos: [105, 190]
  },
  {
    id: 'napoleon',
    name: 'Napo',
    d: 'M285,155 L380,145 L370,210 L300,215 L280,180 Z',
    labelPos: [330, 180]
  },
  {
    id: 'orellana',
    name: 'Orellana',
    d: 'M375,145 L490,145 L480,215 L365,215 Z',
    labelPos: [430, 180]
  },
  {
    id: 'cotopaxi',
    name: 'Cotopaxi',
    d: 'M185,185 L255,185 L265,225 L190,230 L165,210 Z',
    labelPos: [220, 210]
  },
  {
    id: 'los_rios',
    name: 'Los Ríos',
    d: 'M150,205 L185,205 L190,295 L145,300 L135,245 Z',
    labelPos: [165, 255]
  },
  {
    id: 'tungurahua',
    name: 'Tungurahua',
    d: 'M245,215 L290,215 L295,250 L240,250 Z',
    labelPos: [265, 235]
  },
  {
    id: 'bolivar',
    name: 'Bolívar',
    d: 'M180,235 L225,235 L220,285 L180,285 Z',
    labelPos: [200, 260]
  },
  {
    id: 'pastaza',
    name: 'Pastaza',
    d: 'M300,215 L480,215 L450,305 L300,300 Z',
    labelPos: [380, 260]
  },
  {
    id: 'chimborazo',
    name: 'Chimborazo',
    d: 'M220,255 L280,255 L275,320 L210,315 Z',
    labelPos: [245, 285]
  },
  {
    id: 'santa_elena',
    name: 'Santa Elena',
    d: 'M50,265 L105,265 L105,320 L40,310 Z',
    labelPos: [70, 290]
  },
  {
    id: 'guayas',
    name: 'Guayas',
    d: 'M105,265 L180,265 L180,350 L125,385 L95,355 L105,305 Z',
    labelPos: [140, 320]
  },
  {
    id: 'canar',
    name: 'Cañar',
    d: 'M180,315 L235,315 L230,360 L175,355 Z',
    labelPos: [205, 340]
  },
  {
    id: 'morona_santiago',
    name: 'Morona S.',
    d: 'M275,305 L445,310 L410,410 L270,390 Z',
    labelPos: [340, 360]
  },
  {
    id: 'azuay',
    name: 'Azuay',
    d: 'M160,355 L245,355 L240,430 L165,420 Z',
    labelPos: [205, 395]
  },
  {
    id: 'el_oro',
    name: 'El Oro',
    d: 'M95,385 L160,385 L160,455 L95,445 Z',
    labelPos: [125, 425]
  },
  {
    id: 'loja',
    name: 'Loja',
    d: 'M150,425 L215,425 L210,515 L140,505 Z',
    labelPos: [175, 470]
  },
  {
    id: 'zamora_chinchipe',
    name: 'Zamora C.',
    d: 'M215,420 L285,410 L275,510 L210,510 Z',
    labelPos: [245, 465]
  },
  {
    id: 'galapagos',
    name: 'Galápagos',
    d: 'M30,380 L65,380 L65,425 L30,425 Z',
    labelPos: [47, 405]
  }
];

export const EcuadorVectorMap: React.FC<Props> = ({
  provincias,
  selectedField,
  onSelectProvince,
  selectedProvince
}) => {
  const [hovered, setHovered] = useState<ProvinceData | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Map province values
  const provMap = new Map<string, ProvinceData>();
  provincias.forEach(p => provMap.set(p.name.toLowerCase().trim(), p));

  const values = provincias.map(p => (p as any)[selectedField] || 0);
  const maxVal = Math.max(...values, 1);
  const totalGeneral = provincias.reduce((a, b) => a + ((b as any)[selectedField] || 0), 0) || 1;

  // Color generator
  const getColor = (val: number, isSelected: boolean) => {
    if (isSelected) return '#FF6B00';
    const ratio = Math.min(1, val / maxVal);
    if (ratio > 0.65) return '#C62828'; // Deep Red
    if (ratio > 0.40) return '#FF5722'; // Orange Red
    if (ratio > 0.20) return '#FF8C38'; // Amber Orange
    if (ratio > 0.08) return '#1E88E5'; // Bright Blue
    if (ratio > 0.03) return '#1565C0'; // Deep Blue
    return '#1C2B45'; // Dark Navy base
  };

  return (
    <div className="relative w-full bg-white border border-slate-200 rounded-xl p-3.5 select-none shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
          Mapa Provincial Coroplético (Vectorial)
        </span>
        <span className="text-[10px] text-slate-500">
          Haz clic en una provincia para filtrar el tablero
        </span>
      </div>

      <div
        className="relative w-full aspect-[600/540] overflow-hidden bg-slate-50 rounded-lg border border-slate-100"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
          });
        }}
        onMouseLeave={() => setHovered(null)}
      >
        <svg
          viewBox="0 0 540 530"
          className="w-full h-full filter drop-shadow-xs"
        >
          {/* Subtle ocean grid lines */}
          <defs>
            <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {ECUADOR_PROVINCES.map((shape) => {
            const provData = provMap.get(shape.name.toLowerCase().trim());
            const val = provData ? (provData as any)[selectedField] || 0 : 0;
            const isSelected = selectedProvince?.toLowerCase() === shape.name.toLowerCase();
            const color = getColor(val, isSelected);

            return (
              <g key={shape.id} className="cursor-pointer group">
                <path
                  d={shape.d}
                  fill={color}
                  stroke={isSelected ? '#0F172A' : '#FFFFFF'}
                  strokeWidth={isSelected ? '2.5' : '1'}
                  className="transition-colors duration-150 hover:brightness-110"
                  onMouseEnter={() => {
                    if (provData) setHovered(provData);
                  }}
                  onClick={() => {
                    if (onSelectProvince) {
                      onSelectProvince(isSelected ? 'all' : shape.name);
                    }
                  }}
                />
                {/* Province label */}
                <text
                  x={shape.labelPos[0]}
                  y={shape.labelPos[1]}
                  textAnchor="middle"
                  className="text-[9px] font-bold font-condensed pointer-events-none fill-slate-900 opacity-90 transition-opacity group-hover:opacity-100"
                  style={{ textShadow: '0 1px 2px rgba(255,255,255,0.95)' }}
                >
                  {shape.name.length > 9 ? shape.name.split(' ')[0] : shape.name}
                </text>
                {/* Sub value */}
                <text
                  x={shape.labelPos[0]}
                  y={shape.labelPos[1] + 10}
                  textAnchor="middle"
                  className="text-[8px] font-mono-numbers pointer-events-none fill-slate-800 font-semibold"
                  style={{ textShadow: '0 1px 2px rgba(255,255,255,0.95)' }}
                >
                  {val.toLocaleString()}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hovered && (
          <div
            className="absolute pointer-events-none z-50 bg-white border-l-4 border-amber-500 border border-slate-200 p-2.5 rounded-lg shadow-xl text-xs min-w-[190px]"
            style={{
              left: Math.min(mousePos.x + 14, 340),
              top: Math.max(mousePos.y - 45, 10),
            }}
          >
            <div className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>{hovered.name}</span>
              <span className="text-[10px] text-amber-600 font-mono-numbers font-semibold">
                {((((hovered as any)[selectedField] || 0) / totalGeneral) * 100).toFixed(1)}% del país
              </span>
            </div>
            <div className="space-y-1 font-mono-numbers text-[11px] text-slate-700">
              <div className="flex justify-between border-b border-slate-100 pb-0.5">
                <span className="text-slate-500">Total Delitos:</span>
                <span className="font-bold text-slate-900">{hovered.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Robos:</span>
                <span>{hovered.robo.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600 font-semibold">Asesinatos:</span>
                <span>{hovered.asesinato.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">Extorsiones:</span>
                <span>{hovered.extorsion.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Secuestros:</span>
                <span>{(hovered.secuestro + (hovered.secuestroExt || 0)).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Heatmap Legend */}
      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-[10px] text-slate-500">
        <span className="font-semibold text-slate-700 uppercase tracking-wider">Escala de Incidencia:</span>
        <div className="flex items-center gap-1.5 font-mono-numbers">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#1C2B45] inline-block"></span> Mínima</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#1565C0] inline-block"></span> Baja</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#1E88E5] inline-block"></span> Media</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#FF8C38] inline-block"></span> Alta</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#C62828] inline-block"></span> Crítica</span>
        </div>
      </div>
    </div>

  );
};
