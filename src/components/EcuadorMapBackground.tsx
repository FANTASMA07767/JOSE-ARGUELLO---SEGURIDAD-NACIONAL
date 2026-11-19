import React from 'react';

interface EcuadorMapBackgroundProps {
  className?: string;
  opacity?: number;
}

export const EcuadorMapBackground: React.FC<EcuadorMapBackgroundProps> = ({
  className = '',
  opacity = 0.28, // elevated transparency as requested for distinctive secondary protagonist
}) => {
  return (
    <div
      className={`pointer-events-none select-none overflow-hidden ${className}`}
      style={{
        opacity,
        // Soft gradient fade towards the center/left so it doesn't collide with the title, but keeps high clarity on the right
        maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 70%, rgba(0,0,0,0.7) 85%, rgba(0,0,0,0) 100%)',
        WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 70%, rgba(0,0,0,0.7) 85%, rgba(0,0,0,0) 100%)',
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 920 660"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-contain"
      >
        <defs>
          {/* Subtle intelligence radar grid */}
          <pattern id="ecuador-tech-grid" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#2563EB" strokeWidth="0.55" strokeOpacity="0.22" />
            <circle cx="18" cy="18" r="0.9" fill="#0284C7" fillOpacity="0.35" />
          </pattern>

          {/* National territory fill gradient */}
          <linearGradient id="ecuador-land-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.32" />
            <stop offset="35%" stopColor="#2563EB" stopOpacity="0.24" />
            <stop offset="70%" stopColor="#0284C7" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0369A1" stopOpacity="0.28" />
          </linearGradient>

          {/* Coast accent gradient */}
          <linearGradient id="coast-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#2563EB" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.7" />
          </linearGradient>

          {/* Regional fills for distinct geography */}
          <linearGradient id="costa-fill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284C7" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.06" />
          </linearGradient>

          <linearGradient id="sierra-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.12" />
          </linearGradient>

          <linearGradient id="amazonia-fill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.14" />
          </linearGradient>

          {/* Radar scan circular gradients */}
          <radialGradient id="radar-center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#2563EB" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="capital-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#EF4444" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="guayaquil-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </radialGradient>

          {/* Luminous filter */}
          <filter id="ecuador-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="ecuador-pulse" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Grid Background */}
        <rect width="920" height="660" fill="url(#ecuador-tech-grid)" opacity="0.75" />

        {/* Tactical Crosshairs & Radar Target Concentric Rings */}
        <g id="radar-system" transform="translate(585, 330)">
          <circle cx="0" cy="0" r="280" stroke="#1E40AF" strokeWidth="0.75" strokeOpacity="0.18" />
          <circle cx="0" cy="0" r="210" stroke="#2563EB" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="5 5" />
          <circle cx="0" cy="0" r="140" stroke="#0284C7" strokeWidth="0.9" strokeOpacity="0.30" strokeDasharray="2 3" />
          <circle cx="0" cy="0" r="70" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.35" />
          <circle cx="0" cy="0" r="70" fill="url(#radar-center-glow)" />

          {/* Crosshair axis lines */}
          <line x1="-310" y1="0" x2="310" y2="0" stroke="#0284C7" strokeWidth="0.65" strokeDasharray="6 6" strokeOpacity="0.25" />
          <line x1="0" y1="-300" x2="0" y2="300" stroke="#0284C7" strokeWidth="0.65" strokeDasharray="6 6" strokeOpacity="0.25" />

          {/* Angle degree indicators */}
          <text x="74" y="-74" fill="#0284C7" fontSize="8" fontFamily="monospace" fontWeight="bold" opacity="0.6">045°</text>
          <text x="145" y="-6" fill="#0284C7" fontSize="8" fontFamily="monospace" fontWeight="bold" opacity="0.6">090°</text>
          <text x="74" y="80" fill="#0284C7" fontSize="8" fontFamily="monospace" fontWeight="bold" opacity="0.6">135°</text>
        </g>

        {/* Faint Equator Line (00° 00' 00") Latitud Cero */}
        <g id="equator-line">
          <line x1="100" y1="210" x2="900" y2="210" stroke="#0284C7" strokeWidth="1.2" strokeDasharray="6 4" strokeOpacity="0.5" />
          <circle cx="560" cy="210" r="3" fill="#38BDF8" opacity="0.8" />
          <text x="110" y="204" fill="#0369A1" fontSize="9.5" fontFamily="monospace" fontWeight="bold" letterSpacing="1.8" opacity="0.85">
            LÍNEA EQUINOCCIAL 00° 00' 00" · PARALELO CERO (ECUADOR)
          </text>
          <text x="810" y="204" fill="#0369A1" fontSize="8" fontFamily="monospace" fontWeight="bold" opacity="0.8">
            HEMISFERIO SUR ▼
          </text>
        </g>

        {/* ============================================================== */}
        {/* ARCHIPIÉLAGO DE GALÁPAGOS (REGIÓN INSULAR)                     */}
        {/* ============================================================== */}
        <g id="galapagos-box" transform="translate(130, 95)">
          <rect
            x="-12"
            y="-14"
            width="145"
            height="125"
            rx="8"
            fill="#FFFFFF"
            fillOpacity="0.5"
            stroke="#2563EB"
            strokeWidth="1"
            strokeDasharray="4 3"
            strokeOpacity="0.45"
          />
          <path d="M -12,-6 L -12,-14 L -4,-14" stroke="#1D4ED8" strokeWidth="2" fill="none" />
          <path d="M 125,-14 L 133,-14 L 133,-6" stroke="#1D4ED8" strokeWidth="2" fill="none" />
          <path d="M -12,103 L -12,111 L -4,111" stroke="#1D4ED8" strokeWidth="2" fill="none" />
          <path d="M 133,103 L 133,111 L 125,111" stroke="#1D4ED8" strokeWidth="2" fill="none" />

          <text x="-4" y="-2" fill="#1E40AF" fontSize="8.5" fontFamily="monospace" fontWeight="900" letterSpacing="1">
            GALÁPAGOS (ZONA INSULAR)
          </text>
          <text x="-4" y="8" fill="#64748B" fontSize="7" fontFamily="monospace">
            PATRIMONIO DE LA HUMANIDAD
          </text>

          {/* Isabela Island (Seahorse shape - distinctive) */}
          <path
            d="
              M 30,22
              C 35,16 43,18 45,26
              C 47,33 42,40 40,46
              C 38,52 46,58 48,68
              C 50,78 44,88 36,86
              C 30,84 32,74 34,66
              C 36,58 28,52 25,44
              C 22,36 24,28 30,22 Z
            "
            fill="url(#ecuador-land-gradient)"
            stroke="#1D4ED8"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <text x="12" y="55" fill="#1E40AF" fontSize="7" fontFamily="monospace" fontWeight="bold">ISABELA</text>

          {/* Fernandina Island */}
          <ellipse cx="14" cy="45" rx="8" ry="11" fill="url(#ecuador-land-gradient)" stroke="#1D4ED8" strokeWidth="1.3" />

          {/* Santiago Island */}
          <ellipse cx="54" cy="30" rx="10" ry="7" transform="rotate(-15 54 30)" fill="url(#ecuador-land-gradient)" stroke="#1D4ED8" strokeWidth="1.3" />

          {/* Santa Cruz Island */}
          <ellipse cx="68" cy="52" rx="11" ry="9" fill="url(#ecuador-land-gradient)" stroke="#1D4ED8" strokeWidth="1.4" />
          <text x="60" y="68" fill="#1E40AF" fontSize="6.5" fontFamily="monospace" fontWeight="bold">STA. CRUZ</text>
          <circle cx="68" cy="52" r="2.5" fill="#EF4444" />

          {/* San Cristóbal Island */}
          <path
            d="M 94,56 C 98,52 106,56 109,62 C 111,68 105,74 99,72 C 93,70 90,62 94,56 Z"
            fill="url(#ecuador-land-gradient)"
            stroke="#1D4ED8"
            strokeWidth="1.3"
          />
          <text x="92" y="82" fill="#1E40AF" fontSize="6.5" fontFamily="monospace" fontWeight="bold">S. CRISTÓBAL</text>

          {/* Floreana Island */}
          <ellipse cx="62" cy="85" rx="7" ry="6" fill="url(#ecuador-land-gradient)" stroke="#1D4ED8" strokeWidth="1.2" />

          {/* Mar de Galápagos coordinates */}
          <text x="-4" y="104" fill="#0284C7" fontSize="7" fontFamily="monospace" fontWeight="bold">
            00°40'S 90°33'W · O. PACÍFICO
          </text>
        </g>

        {/* ============================================================== */}
        {/* CONTINENTAL ECUADOR - HIGH-FIDELITY DISTINCTIVE GEOGRAPHY       */}
        {/* ============================================================== */}
        <g id="continental-ecuador" transform="translate(195, 10)">
          
          {/* Subtle Outer Radar Halo Glow around Mainland */}
          <path
            d="
              M 350,90
              C 385,92 415,115 450,118
              C 490,122 530,140 565,170
              C 600,198 625,235 638,280
              C 650,325 635,370 605,405
              C 575,440 535,472 495,508
              C 460,540 430,578 398,610
              C 368,638 330,648 295,640
              C 260,632 235,605 220,575
              C 205,540 195,510 170,490
              C 145,472 125,455 118,435
              C 108,405 125,385 140,370
              C 155,355 145,335 125,325
              C 98,318 78,300 85,270
              C 92,240 120,225 150,218
              C 172,212 182,192 170,172
              C 158,150 170,130 198,112
              C 225,95 255,85 285,72
              C 315,62 335,88 350,90 Z
            "
            fill="none"
            stroke="#38BDF8"
            strokeWidth="8"
            strokeOpacity="0.12"
            filter="url(#ecuador-pulse)"
          />

          {/* Main Realistic Silhouette Contour of Continental Ecuador */}
          {/* Faithfully models: Esmeraldas bay, Manabí cape (Cabo Pasado, Manta, San Lorenzo), */}
          {/* Santa Elena peninsula (Puntilla), Gulf of Guayaquil, El Oro coast, */}
          {/* and eastern Amazonian borders (Sucumbíos, Orellana, Pastaza, Morona, Zamora). */}
          <path
            id="ecuador-mainland-shape"
            d="
              M 345,95
              C 375,98 405,120 440,122
              C 478,124 515,142 548,172
              C 580,200 605,236 618,278
              C 628,320 614,362 585,395
              C 555,430 518,460 480,495
              C 448,525 418,560 388,595
              C 362,622 328,632 296,624
              C 264,616 242,592 230,564
              C 216,532 208,506 186,488
              C 165,472 146,456 138,438
              C 128,414 140,396 154,382
              C 166,370 158,352 140,344
              C 114,336 94,318 100,290
              C 106,262 132,248 160,242
              C 180,237 188,218 178,200
              C 166,180 176,160 202,144
              C 228,128 258,118 286,104
              C 314,92 332,94 345,95 Z
            "
            fill="url(#ecuador-land-gradient)"
            stroke="url(#coast-gradient)"
            strokeWidth="2.8"
            strokeLinejoin="round"
            filter="url(#ecuador-glow)"
          />

          {/* Regional Underlays (Costa, Sierra, Amazonía) */}
          {/* 1. Región Costa (Litoral) */}
          <path
            d="
              M 286,104
              C 258,118 228,128 202,144
              C 176,160 166,180 178,200
              C 188,218 180,237 160,242
              C 132,248 106,262 100,290
              C 94,318 114,336 140,344
              C 158,352 166,370 154,382
              C 140,396 128,414 138,438
              C 146,456 165,472 186,488
              L 225,480
              L 245,390
              L 255,290
              L 275,190
              Z
            "
            fill="url(#costa-fill)"
            stroke="#0284C7"
            strokeWidth="0.8"
            strokeDasharray="4 4"
            strokeOpacity="0.5"
          />

          {/* 2. Región Sierra (Cordillera de los Andes - Eje Central) */}
          <path
            d="
              M 275,190
              L 255,290
              L 245,390
              L 225,480
              L 296,624
              C 328,632 362,622 388,595
              L 360,490
              L 375,370
              L 385,250
              L 345,95
              L 286,104
              Z
            "
            fill="url(#sierra-fill)"
            stroke="#1D4ED8"
            strokeWidth="1.2"
            strokeDasharray="6 3"
            strokeOpacity="0.6"
          />

          {/* 3. Región Amazónica (Oriente) */}
          <path
            d="
              M 345,95
              L 385,250
              L 375,370
              L 360,490
              L 388,595
              C 418,560 448,525 480,495
              C 518,460 555,430 585,395
              C 614,362 628,320 618,278
              C 605,236 580,200 548,172
              C 515,142 478,124 440,122
              Z
            "
            fill="url(#amazonia-fill)"
            stroke="#0D9488"
            strokeWidth="0.8"
            strokeDasharray="4 4"
            strokeOpacity="0.4"
          />

          {/* Cordillera de los Andes Mountain Ridge Lines (Volcanic Avenue) */}
          <path
            d="M 315,110 L 325,180 L 310,260 L 320,340 L 295,440 L 285,530 L 270,590"
            stroke="#1E40AF"
            strokeWidth="2"
            strokeDasharray="4 2"
            strokeOpacity="0.65"
          />
          <path
            d="M 340,125 L 350,195 L 340,275 L 345,360 L 325,455 L 315,545 L 300,605"
            stroke="#1E40AF"
            strokeWidth="2"
            strokeDasharray="4 2"
            strokeOpacity="0.65"
          />

          {/* Gulf of Guayaquil & Puná Island Realism */}
          {/* Estuario Interior Guayas */}
          <path
            d="M 175,410 C 190,418 200,438 190,455 C 180,468 168,465 160,448 Z"
            fill="#0284C7"
            fillOpacity="0.25"
            stroke="#0284C7"
            strokeWidth="1.2"
          />
          {/* Isla Puná */}
          <ellipse
            cx="178"
            cy="442"
            rx="15"
            ry="10"
            transform="rotate(-25 178 442)"
            fill="url(#ecuador-land-gradient)"
            stroke="#1D4ED8"
            strokeWidth="1.5"
          />
          <text x="160" y="445" fill="#1E40AF" fontSize="6.5" fontFamily="monospace" fontWeight="bold">I. PUNÁ</text>

          {/* Archipiélago de Jambelí */}
          <ellipse cx="152" cy="475" rx="6" ry="3.5" fill="#1D4ED8" opacity="0.7" />

          {/* Regional Labels in Tactical Style */}
          <text x="145" y="270" fill="#0284C7" fontSize="11" fontFamily="monospace" fontWeight="900" letterSpacing="3" opacity="0.65" transform="rotate(-75 145 270)">
            COSTA
          </text>
          <text x="315" y="380" fill="#1E40AF" fontSize="12" fontFamily="monospace" fontWeight="900" letterSpacing="4" opacity="0.75" transform="rotate(-80 315 380)">
            SIERRA
          </text>
          <text x="460" y="330" fill="#0D9488" fontSize="11" fontFamily="monospace" fontWeight="900" letterSpacing="3" opacity="0.65" transform="rotate(-65 460 330)">
            AMAZONÍA
          </text>

          {/* ============================================================== */}
          {/* TACTICAL NODES & PROVINCIAL COMMAND HUBS                       */}
          {/* ============================================================== */}

          {/* QUITO (Distrito Metropolitano - Sede de Mando y Control Nacional) */}
          <g transform="translate(328, 205)">
            {/* Concentric alert rings */}
            <circle cx="0" cy="0" r="22" stroke="#EF4444" strokeWidth="0.8" strokeOpacity="0.35" strokeDasharray="3 3" />
            <circle cx="0" cy="0" r="14" stroke="#EF4444" strokeWidth="1" strokeOpacity="0.6" />
            <circle cx="0" cy="0" r="14" fill="url(#capital-glow)" />
            <circle cx="0" cy="0" r="5" fill="#EF4444" />
            <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
            {/* Callout Tag */}
            <rect x="18" y="-12" width="94" height="22" rx="4" fill="#FFFFFF" fillOpacity="0.95" stroke="#EF4444" strokeWidth="1" />
            <text x="24" y="2" fill="#0F172A" fontSize="9.5" fontWeight="900" fontFamily="monospace" letterSpacing="0.5">
              QUITO [DMQ]
            </text>
            <text x="24" y="8" fill="#EF4444" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
              COMANDO GENERAL
            </text>
          </g>

          {/* GUAYAQUIL (Distrito Metropolitano - Zona 8 / Mayor Concentración) */}
          <g transform="translate(195, 405)">
            <circle cx="0" cy="0" r="24" stroke="#2563EB" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="3 3" />
            <circle cx="0" cy="0" r="16" stroke="#2563EB" strokeWidth="1.2" strokeOpacity="0.7" />
            <circle cx="0" cy="0" r="16" fill="url(#guayaquil-glow)" />
            <circle cx="0" cy="0" r="5.5" fill="#1D4ED8" />
            <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
            {/* Callout Tag */}
            <rect x="20" y="-12" width="108" height="22" rx="4" fill="#FFFFFF" fillOpacity="0.95" stroke="#1D4ED8" strokeWidth="1" />
            <text x="26" y="2" fill="#0F172A" fontSize="9.5" fontWeight="900" fontFamily="monospace" letterSpacing="0.5">
              GUAYAQUIL [DMG]
            </text>
            <text x="26" y="8" fill="#1D4ED8" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
              ZONA 8 OPERACIONAL
            </text>
          </g>

          {/* CUENCA (Azuay - Nodo Sierra Sur) */}
          <g transform="translate(295, 490)">
            <circle cx="0" cy="0" r="10" stroke="#0284C7" strokeWidth="0.8" strokeOpacity="0.6" strokeDasharray="2 2" />
            <circle cx="0" cy="0" r="4" fill="#0284C7" />
            <circle cx="0" cy="0" r="1.5" fill="#FFFFFF" />
            <text x="14" y="3" fill="#0F172A" fontSize="8.5" fontWeight="800" fontFamily="monospace">
              CUENCA
            </text>
          </g>

          {/* MANTA / PORTOVIEJO (Manabí - Zona Costera Central) */}
          <g transform="translate(130, 315)">
            <circle cx="0" cy="0" r="11" stroke="#0284C7" strokeWidth="0.8" strokeOpacity="0.6" strokeDasharray="2 2" />
            <circle cx="0" cy="0" r="4" fill="#0284C7" />
            <circle cx="0" cy="0" r="1.5" fill="#FFFFFF" />
            <rect x="-82" y="-10" width="76" height="18" rx="3" fill="#FFFFFF" fillOpacity="0.9" stroke="#0284C7" strokeWidth="0.8" />
            <text x="-76" y="2" fill="#0F172A" fontSize="8.5" fontWeight="800" fontFamily="monospace">
              MANTA/PORTO.
            </text>
          </g>

          {/* ESMERALDAS (Frontera Norte / Puerto Marítimo) */}
          <g transform="translate(225, 140)">
            <circle cx="0" cy="0" r="10" stroke="#0369A1" strokeWidth="0.8" strokeOpacity="0.6" strokeDasharray="2 2" />
            <circle cx="0" cy="0" r="4" fill="#0369A1" />
            <circle cx="0" cy="0" r="1.5" fill="#FFFFFF" />
            <rect x="-84" y="-10" width="78" height="18" rx="3" fill="#FFFFFF" fillOpacity="0.9" stroke="#0369A1" strokeWidth="0.8" />
            <text x="-78" y="2" fill="#0F172A" fontSize="8.5" fontWeight="800" fontFamily="monospace">
              ESMERALDAS
            </text>
          </g>

          {/* MACHALA (El Oro - Frontera Sur) */}
          <g transform="translate(185, 515)">
            <circle cx="0" cy="0" r="9" stroke="#0284C7" strokeWidth="0.8" strokeOpacity="0.5" />
            <circle cx="0" cy="0" r="3.5" fill="#0284C7" />
            <text x="14" y="3" fill="#1E293B" fontSize="8" fontWeight="800" fontFamily="monospace">
              MACHALA
            </text>
          </g>

          {/* SANTO DOMINGO (Eje Estratégico de Conexión Costa-Sierra) */}
          <g transform="translate(240, 240)">
            <circle cx="0" cy="0" r="8" stroke="#2563EB" strokeWidth="0.8" strokeOpacity="0.5" />
            <circle cx="0" cy="0" r="3" fill="#2563EB" />
            <text x="-75" y="3" fill="#1E293B" fontSize="7.5" fontWeight="700" fontFamily="monospace">
              STO. DOMINGO
            </text>
          </g>

          {/* AMBATO / TUNGURAHUA */}
          <g transform="translate(305, 305)">
            <circle cx="0" cy="0" r="7" stroke="#2563EB" strokeWidth="0.7" strokeOpacity="0.4" />
            <circle cx="0" cy="0" r="2.8" fill="#2563EB" />
            <text x="10" y="3" fill="#334155" fontSize="7.5" fontWeight="700" fontFamily="monospace">
              AMBATO
            </text>
          </g>

          {/* LOJA */}
          <g transform="translate(255, 580)">
            <circle cx="0" cy="0" r="7" stroke="#0284C7" strokeWidth="0.7" strokeOpacity="0.4" />
            <circle cx="0" cy="0" r="2.8" fill="#0284C7" />
            <text x="10" y="3" fill="#334155" fontSize="7.5" fontWeight="700" fontFamily="monospace">
              LOJA
            </text>
          </g>

          {/* NUEVA LOJA / LAGO AGRIO (Sucumbíos - Amazonía Norte) */}
          <g transform="translate(470, 165)">
            <circle cx="0" cy="0" r="8" stroke="#0D9488" strokeWidth="0.7" strokeOpacity="0.5" />
            <circle cx="0" cy="0" r="3" fill="#0D9488" />
            <text x="10" y="3" fill="#1E293B" fontSize="7.5" fontWeight="700" fontFamily="monospace">
              NUEVA LOJA
            </text>
          </g>

          {/* EL COCA / FCO. DE ORELLANA */}
          <g transform="translate(485, 235)">
            <circle cx="0" cy="0" r="7" stroke="#0D9488" strokeWidth="0.7" strokeOpacity="0.5" />
            <circle cx="0" cy="0" r="2.8" fill="#0D9488" />
            <text x="10" y="3" fill="#334155" fontSize="7" fontFamily="monospace">
              ORELLANA
            </text>
          </g>

          {/* PUYO / PASTAZA */}
          <g transform="translate(390, 340)">
            <circle cx="0" cy="0" r="7" stroke="#0D9488" strokeWidth="0.7" strokeOpacity="0.5" />
            <circle cx="0" cy="0" r="2.8" fill="#0D9488" />
            <text x="10" y="3" fill="#334155" fontSize="7" fontFamily="monospace">
              PUYO
            </text>
          </g>

          {/* ============================================================== */}
          {/* TACTICAL CONNECTIVITY NETWORK (LÍNEAS DE ENLACE ESTRATÉGICO)   */}
          {/* ============================================================== */}
          <g id="strategic-network">
            {/* Eje Troncal: Quito - Guayaquil */}
            <line x1="328" y1="205" x2="195" y2="405" stroke="#2563EB" strokeWidth="1.6" strokeDasharray="5 3" strokeOpacity="0.6" />
            {/* Quito - Santo Domingo - Manta */}
            <line x1="328" y1="205" x2="240" y2="240" stroke="#0284C7" strokeWidth="1.2" strokeDasharray="3 3" strokeOpacity="0.5" />
            <line x1="240" y1="240" x2="130" y2="315" stroke="#0284C7" strokeWidth="1.2" strokeDasharray="3 3" strokeOpacity="0.5" />
            {/* Quito - Esmeraldas */}
            <line x1="328" y1="205" x2="225" y2="140" stroke="#0284C7" strokeWidth="1.2" strokeDasharray="4 4" strokeOpacity="0.5" />
            {/* Quito - Nueva Loja */}
            <line x1="328" y1="205" x2="470" y2="165" stroke="#0D9488" strokeWidth="1.1" strokeDasharray="4 4" strokeOpacity="0.45" />
            {/* Guayaquil - Cuenca */}
            <line x1="195" y1="405" x2="295" y2="490" stroke="#2563EB" strokeWidth="1.2" strokeDasharray="4 3" strokeOpacity="0.5" />
            {/* Guayaquil - Machala */}
            <line x1="195" y1="405" x2="185" y2="515" stroke="#0284C7" strokeWidth="1.2" strokeDasharray="4 3" strokeOpacity="0.5" />
            {/* Guayaquil - Manta */}
            <line x1="195" y1="405" x2="130" y2="315" stroke="#0284C7" strokeWidth="1.2" strokeDasharray="4 3" strokeOpacity="0.5" />
            {/* Cuenca - Loja */}
            <line x1="295" y1="490" x2="255" y2="580" stroke="#0284C7" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.45" />
            {/* Quito - Ambato - Puyo */}
            <line x1="328" y1="205" x2="305" y2="305" stroke="#2563EB" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.5" />
            <line x1="305" y1="305" x2="390" y2="340" stroke="#0D9488" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.45" />
          </g>

          {/* Institutional Watermark inside country */}
          <text
            x="420"
            y="390"
            fill="#1E3A8A"
            fontSize="38"
            fontFamily="sans-serif"
            fontWeight="950"
            letterSpacing="9"
            opacity="0.14"
            transform="rotate(-22 420 390)"
          >
            ECUADOR
          </text>
        </g>

        {/* Tactical UI Badges and Telemetry in Corners */}
        <g transform="translate(45, 600)" opacity="0.8">
          <rect x="-8" y="-12" width="220" height="42" rx="6" fill="#FFFFFF" fillOpacity="0.85" stroke="#2563EB" strokeWidth="0.8" />
          <text fill="#1E40AF" fontSize="9" fontFamily="monospace" fontWeight="900">
            INTELIGENCIA TERRITORIAL · ECUADOR
          </text>
          <text y="13" fill="#334155" fontSize="8" fontFamily="monospace" fontWeight="bold">
            24 PROVINCIAS · RÉGIMEN ESPECIAL GALÁPAGOS
          </text>
          <text y="24" fill="#64748B" fontSize="7" fontFamily="monospace">
            RED DE VIGILANCIA INTEGRADA POLCO / SIAF / FGE
          </text>
        </g>

        {/* Compass Rose (Rosa de los vientos institucional) */}
        <g transform="translate(860, 95)" opacity="0.75">
          <circle cx="0" cy="0" r="20" stroke="#1D4ED8" strokeWidth="0.8" fill="#FFFFFF" fillOpacity="0.8" />
          <polygon points="0,-18 4,-4 0,0" fill="#EF4444" />
          <polygon points="0,-18 -4,-4 0,0" fill="#991B1B" />
          <polygon points="0,18 4,4 0,0" fill="#94A3B8" />
          <polygon points="0,18 -4,4 0,0" fill="#64748B" />
          <polygon points="18,0 4,4 0,0" fill="#94A3B8" />
          <polygon points="-18,0 -4,4 0,0" fill="#94A3B8" />
          <text x="-4.5" y="-21" fill="#EF4444" fontSize="9" fontFamily="monospace" fontWeight="bold">N</text>
          <text x="-3" y="30" fill="#64748B" fontSize="8" fontFamily="monospace" fontWeight="bold">S</text>
          <text x="24" y="3" fill="#64748B" fontSize="8" fontFamily="monospace" fontWeight="bold">E</text>
          <text x="-30" y="3" fill="#64748B" fontSize="8" fontFamily="monospace" fontWeight="bold">W</text>
        </g>
      </svg>
    </div>
  );
};
