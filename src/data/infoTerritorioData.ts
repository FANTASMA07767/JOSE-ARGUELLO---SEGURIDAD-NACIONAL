import { InfoTerritorioReport } from '../types/crime';

export interface EventoDelictivoReporte {
  num?: number;
  fecha: string;
  nodo: string;
  tipo: string;
  lugarDescripcion: string;
  victimas: string;
  puertoMasCercano: string;
  distanciaKm: number;
}

export interface AntecedenteEntorno {
  fecha: string;
  hecho: string;
  distancia: string;
}

export interface SectorCriticoDetalle {
  sector: string;
  nivel: 'CRÍTICO' | 'ALTO' | 'MEDIO';
  indicador?: string;
  gdoPresentes?: string;
  nota?: string;
  km: string;
}

export interface NodoRiesgoDetalle {
  nodo: string;
  nivel: 'CRÍTICO' | 'ALTO' | 'MEDIO';
  fundamento: string;
}

export interface BandaEntorno {
  gdo: string;
  nivel: 'CRÍTICO' | 'ALTO' | 'MEDIO';
  zonaActividad: string;
}

export interface ViaLogisticaDetalle {
  via: string;
  nivel: 'CRÍTICO' | 'ALTO' | 'MEDIO';
  amenaza: string;
}

export interface IncautacionTerminalDetalle {
  fecha: string;
  terminal: string;
  kg: number;
  destino: string;
  modalidad: string;
}

export interface InfoTerritorioPaginas5a14 {
  // PÁGINA 5 A 9: 65 EVENTOS CRÍTICOS DEL 30-SEP AL 16-OCT-2026
  eventosGenerales30Sep16Oct: EventoDelictivoReporte[];
  // PÁGINA 9 (Sección 02): MAPA DE RIESGO NACIONAL Y ZONAS CRÍTICAS
  nivelRiesgoPorNodo: NodoRiesgoDetalle[];
  homicidiosPorDistritoPolicialZona8: Array<{ distrito: string; homicidios2026: number; variacion?: string }>;
  zonasCriticasOtrosNodos: Array<{ nodo: string; sector: string; nivel: 'CRÍTICO' | 'ALTO' | 'MEDIO' }>;
  // PÁGINA 10: MATRIZ DE SECTORES CRÍTICOS GUAYAQUIL Y SU ÁREA DE INFLUENCIA
  matrizSectoresCriticosGuayaquil: SectorCriticoDetalle[];
  // PÁGINA 11 Y 12 (Sección 03): PUERTOS MARÍTIMOS - NODO GUAYAQUIL (RADIO DE 20 KM)
  guayaquilStats: {
    homicidiosZona8: string;
    muertesViolentasEsteros: string;
    decomisos2025Origen: string;
    situacionRadio20km: string;
  };
  bandasOperanEntornoGuayaquil: BandaEntorno[];
  // PÁGINA 12 Y 13: 23 EVENTOS DENTRO DEL RADIO DE 20 KM DE GUAYAQUIL
  eventosRadio20kmGuayaquil: EventoDelictivoReporte[];
  // PÁGINA 14: EVENTOS FUERA DEL RADIO (REFERENCIA)
  eventosFueraDelRadioGuayaquil: Array<{ fecha: string; tipo: string; lugar: string; distancia: string }>;
  antecedentes2026EntornoGuayaquil: AntecedenteEntorno[];
  sectoresCriticosDistanciaGuayaquil: SectorCriticoDetalle[];
  // PÁGINA 15 (PÁGINA 14 DE 40 DEL INFORME): VÍAS, AMENAZAS PORTUARIAS, MEDIDAS E INCAUTACIONES
  viasLogisticaRadio20kmGuayaquil: ViaLogisticaDetalle[];
  amenazasPortuariasGuayaquil: string;
  medidasControlGuayaquil: string;
  incautaciones2026VinculadasTerminal: IncautacionTerminalDetalle[];
}

export const DATA_PAGINAS_5_A_14: InfoTerritorioPaginas5a14 = {
  // PÁGINAS 5 A 9: Eventos críticos reportados en la ventana de análisis
  eventosGenerales30Sep16Oct: [
    {
      fecha: '30-sep',
      nodo: 'Guayaquil',
      tipo: 'Sicariato',
      lugarDescripcion: 'Socio Vivienda 1, "Los Tanques" (Nueva Prosperina). Hombre de 27 años, retornado de Chile una semana antes; disparos desde moto.',
      victimas: '1 muerto',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 22.3
    },
    {
      fecha: '30-sep',
      nodo: 'Guayaquil',
      tipo: 'Sicariato',
      lugarDescripcion: 'Vía Perimetral, antes de Trinipuerto. Ataque a taxista en circulación; pasajera con roce de bala.',
      victimas: '1 muerto · 1 herida',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 5.3
    },
    {
      fecha: '30-sep',
      nodo: 'Durán',
      tipo: 'Secuestro',
      lugarDescripcion: 'Cdla. Ferroviaria → El Recreo 2.ª etapa. Funcionaria pública (37) liberada por UNASE (~150 agentes). Hipótesis: Chone Killers, facción "Gato Celi".',
      victimas: '1 liberada',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 13.6
    },
    {
      fecha: '30-sep',
      nodo: 'Guayaquil',
      tipo: 'Secuestro',
      lugarDescripcion: 'Distrito Progreso → San Isidro/Cerecita. Pareja venezolana liberada por Unidae; 3 detenidos ligados a brazo armado de M18.',
      victimas: '2 liberados · 3 detenidos',
      puertoMasCercano: 'Posorja',
      distanciaKm: 39.6
    },
    {
      fecha: '01-oct',
      nodo: 'Guayaquil',
      tipo: 'Sicariato',
      lugarDescripcion: 'Callejón 32 y la O (sur). Hombre de 36 años atacado por motorizados.',
      victimas: '1 muerto',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 7.5
    },
    {
      fecha: '01-oct',
      nodo: 'Guayaquil',
      tipo: 'Sicariato',
      lugarDescripcion: 'Vía a Daule. Comerciante (33) que retornaba a Colimes; disparos desde moto.',
      victimas: '1 muerto',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 20.6
    },
    {
      fecha: '01/03-oct',
      nodo: 'Guayas',
      tipo: 'Extorsión',
      lugarDescripcion: 'Durán (El Recreo), Bastión Popular, Playas. Operativos "Libertad": exigencias de USD 10.000, 4.000, 3.000 y USD 50.000 a camiones de bebidas que operan en Posorja.',
      victimas: '12 detenidos (nacional)',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 13.6
    },
    {
      fecha: '02-oct',
      nodo: 'Guayaquil',
      tipo: 'Explosivos',
      lugarDescripcion: 'Esteros, Portete, Durán, Samborondón. 13 sacos de explosivos artesanales y 14 armas incautadas tras denuncia por código QR. Bandas: Lobos, Águilas, Tiguerones, Mafia 18, Chone Killers, Freddy Krueger.',
      victimas: '14–16 detenidos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 4.7
    },
    {
      fecha: '02-oct',
      nodo: 'Guayaquil',
      tipo: 'Sicariato',
      lugarDescripcion: 'Urb. Colina del Sol, km 12,5 vía a Daule. Pareja baleada al salir en moto; atacantes se habrían ocultado en la urbanización.',
      victimas: '2 muertos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 23.4
    },
    {
      fecha: '03-oct',
      nodo: 'Durán',
      tipo: 'Ataque armado',
      lugarDescripcion: 'Cdla. Maldonado → vía Durán–Yaguachi (Feria Ganadera). Ataque y persecución con intercambio de disparos contra la Policía; 4 pistolas incautadas.',
      victimas: '2 muertos · 5 detenidos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 15.3
    },
    {
      fecha: '03-oct',
      nodo: 'Durán',
      tipo: 'Sicariato',
      lugarDescripcion: 'Km 11 vía Durán–Yaguachi (La Toma de Agua). Conductor de tanquero asesinado mientras esperaba carga.',
      victimas: '1 muerto · 2 detenidos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 23.9
    },
    {
      fecha: '03-oct',
      nodo: 'Guayas',
      tipo: 'Masacre',
      lugarDescripcion: 'Barbería, recinto Tres Postes (Yaguachi). Hombres armados irrumpieron y dispararon; entre las víctimas, un agente de la CTE.',
      victimas: '4 muertos · 2 heridos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 33.0
    },
    {
      fecha: '05-oct',
      nodo: 'Guayaquil',
      tipo: 'Sicariato',
      lugarDescripcion: 'Urb. Villa Geranio 1, Chongón. Hombre (~31) interceptado en la pluma de acceso por dos atacantes en moto.',
      victimas: '1 muerto',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 19.4
    },
    {
      fecha: '06-oct',
      nodo: 'Guayaquil',
      tipo: 'Ataque armado',
      lugarDescripcion: 'Coop. Jacobo Bucaram, Isla Trinitaria. Disparos contra patrullero de Segura EP.',
      victimas: '0 heridos · 2 detenidos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 4.3
    },
    {
      fecha: '06-oct',
      nodo: 'Guayaquil',
      tipo: 'Muerte violenta',
      lugarDescripcion: 'Coop. 7 de Septiembre, Guasmo Central. Restos humanos en tres fundas; víctima sin identificar.',
      victimas: '1 muerto',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 3.4
    },
    {
      fecha: '07-oct',
      nodo: 'Guayaquil',
      tipo: 'Robo / Asalto',
      lugarDescripcion: 'Cdla. La Kennedy → Vía Perimetral (GOE). 6–10 sujetos con prendas tipo policial/militar simularon un operativo y robaron 42 armas a una empresa de seguridad privada; persecución y balacera.',
      victimas: '2 policías heridos · 2 detenidos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 13.0
    },
    {
      fecha: '07-oct',
      nodo: 'Guayaquil',
      tipo: 'Sicariato',
      lugarDescripcion: 'Mapasingue Este (paso a Urdenor/Urdesa). Alias "Fox" atacado en su vehículo por dos sicarios en moto.',
      victimas: '1 muerto',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 14.2
    },
    {
      fecha: '07-oct',
      nodo: 'Guayaquil',
      tipo: 'Extorsión',
      lugarDescripcion: 'Bloque 10, Paraíso de la Flor. FF.AA. capturan a dos presuntos miembros de Los Fatales con 44 recibos de cobro de "vacunas".',
      victimas: '2 detenidos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 22.4
    },
    {
      fecha: '07-oct',
      nodo: 'Guayaquil',
      tipo: 'Masacre',
      lugarDescripcion: 'Centro de rehabilitación, coop. Esmeraldas Libre (Las Malvinas). Hombres armados dispararon contra internos.',
      victimas: '2 muertos (1 menor) · 1 herido',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 5.6
    },
    {
      fecha: '07-oct',
      nodo: 'Guayaquil',
      tipo: 'Sicariato',
      lugarDescripcion: 'Parque coop. Pastor Vera, Juan Montalvo. Vecino baleado al salir de su vivienda.',
      victimas: '1 muerto',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 18.7
    },
    {
      fecha: '08-oct',
      nodo: 'Samborondón',
      tipo: 'Crimen organizado',
      lugarDescripcion: 'Plaza Lagos, La Puntilla. Op. Gran Fénix-Cantabria (Ecuador–España–Europol): capturado presunto financista de alias "Pipo" (Los Lobos); villa con búnker. Red vinculada a 42,5 t; 2 policías activos entre los detenidos.',
      victimas: '21 detenidos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 15.7
    },
    {
      fecha: '08-oct',
      nodo: 'Guayaquil',
      tipo: 'Narcotráfico',
      lugarDescripcion: 'Puerto de Guayaquil (terminal no identificada). 1.675,58 kg de cocaína en maquinaria declarada como "separador de metales", destino México.',
      victimas: '2 detenidos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 0.0
    },
    {
      fecha: '08-oct',
      nodo: 'Guayas',
      tipo: 'Ataque armado',
      lugarDescripcion: 'Recinto Palo Alto, Daule rural. Ataque contra vivienda; atacantes huyeron en carro y motos.',
      victimas: '1 muerto',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 34.1
    },
    {
      fecha: '08-oct',
      nodo: 'Guayaquil',
      tipo: 'Crimen organizado',
      lugarDescripcion: 'Chongón. Capturado alias "Orejas", presunto cabecilla de Los Fatales en Daule (Objetivo Criminal Priorizado).',
      victimas: '1 detenido',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 20.3
    },
    {
      fecha: '09-oct',
      nodo: 'Guayaquil',
      tipo: 'Crimen organizado',
      lugarDescripcion: 'Zona 8 (10 distritos). Operativo Apolo 34: 20 armas y prendas con insignias de la CTE para "falsos operativos"; libretas de extorsión de la M-27 (Tiguerones).',
      victimas: '23 detenidos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 22.8
    },
    {
      fecha: '09-oct',
      nodo: 'Guayas',
      tipo: 'Ataque armado',
      lugarDescripcion: 'Cdla. Tomás Acuña, Milagro. Disparos y atropellamiento a servidor militar en control.',
      victimas: '1–2 heridos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 38.3
    },
    {
      fecha: '09/13-oct',
      nodo: 'Guayas',
      tipo: 'Corrupción',
      lugarDescripcion: 'Guayaquil / vía Las Palmas–Samborondón. 10 policías (Inteligencia y DINASED Zona 5) con prisión preventiva por exigir USD 12.000 a dueños de una piladora.',
      victimas: '10 procesados',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 26.1
    },
    {
      fecha: '10-oct',
      nodo: 'Guayas',
      tipo: 'Sicariato',
      lugarDescripcion: 'Av. Río Amazonas, Nobol. Padre e hijo de 15 años atacados en moto; el Ejército capturó a alias "Gato" (Chone Killers).',
      victimas: '2 muertos · 1 detenido',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 42.0
    },
    {
      fecha: '11-oct',
      nodo: 'Guayaquil',
      tipo: 'Explosivos',
      lugarDescripcion: 'Monte Sinaí. FTC Guayas interviene reunión de Los Fatales: 6 tacos de dinamita y una pistola.',
      victimas: '8 detenidos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 21.4
    },
    {
      fecha: '12-oct',
      nodo: 'Guayaquil',
      tipo: 'Ataque armado',
      lugarDescripcion: 'Emergencias Hospital Teodoro Maldonado (Esteros). Al menos 6 disparos; hipótesis de venganza.',
      victimas: '2 heridos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 5.4
    },
    {
      fecha: '14-oct',
      nodo: 'Guayaquil',
      tipo: 'Crimen organizado',
      lugarDescripcion: 'Nueva Prosperina. FF.AA. hallan "centro de vigilancia" de banda: 4 cámaras, DVR y 300 municiones para monitorear a uniformados.',
      victimas: '—',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 20.6
    },
    {
      fecha: '~14-oct',
      nodo: 'Guayaquil',
      tipo: 'Corrupción',
      lugarDescripcion: '16 allanamientos. 10 policías activos entre 12 detenidos por venta de vehículos de patios de retención.',
      victimas: '12 detenidos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 10.4
    },
    {
      fecha: '01-oct',
      nodo: 'Posorja',
      tipo: 'Narcotráfico',
      lugarDescripcion: 'DP World Posorja. 748 kg de cocaína mezclada con cemento en 2 contenedores a Turquía; 37 paquetes en un tercero a Alemania.',
      victimas: 'Sin detenidos',
      puertoMasCercano: 'Posorja',
      distanciaKm: 0.0
    },
    {
      fecha: '08-oct',
      nodo: 'Puerto Bolívar',
      tipo: 'Piratería',
      lugarDescripcion: 'Altamar frente a Puerto Bolívar (barco zarpado de Posorja). Asaltantes en lanchas atacaron al bolichero VB-III mientras la tripulación descansaba.',
      victimas: '5 muertos · 1 herido',
      puertoMasCercano: 'Puerto Bolívar',
      distanciaKm: 23.9
    },
    {
      fecha: '13-oct',
      nodo: 'Puerto Bolívar',
      tipo: 'Sicariato',
      lugarDescripcion: 'Machala sur, Av. Castro Benítez (IESS). Unos 10 disparos contra conductor que se refugió en el hospital.',
      victimas: '1 herido',
      puertoMasCercano: 'Puerto Bolívar',
      distanciaKm: 4.8
    },
    {
      fecha: '07-oct',
      nodo: 'Manta',
      tipo: 'Judicial',
      lugarDescripcion: 'Manta. Jueza declara inocentes a 32 pescadores de barcos hundidos por EE.UU. (Conquista II, María Candelaria); apelable.',
      victimas: '—',
      puertoMasCercano: 'Manta',
      distanciaKm: 1.5
    },
    {
      fecha: '08-oct',
      nodo: 'Manta',
      tipo: 'Sicariato',
      lugarDescripcion: 'Mercado Central (cachinería), a metros de una UPC. Segundo ataque en el mercado en menos de un mes (15-sep: 2 muertos).',
      victimas: '1 muerto',
      puertoMasCercano: 'Manta',
      distanciaKm: 1.3
    },
    {
      fecha: '12-oct',
      nodo: 'Manta',
      tipo: 'Sicariato',
      lugarDescripcion: 'Centro, Av. 4 entre calles 14 y 15. ~10 ráfagas en zona comercial cercana a una escuela. Distrito Manta suma 401 muertes violentas.',
      victimas: '1 muerto · 1 herido',
      puertoMasCercano: 'Manta',
      distanciaKm: 1.5
    },
    {
      fecha: '~01-oct',
      nodo: 'Esmeraldas',
      tipo: 'Extorsión',
      lugarDescripcion: 'Esmeraldas. Operación "Libertad 1091": exigencias de USD 10.000 a comerciantes.',
      victimas: '5 detenidos',
      puertoMasCercano: 'Esmeraldas',
      distanciaKm: 3.3
    },
    {
      fecha: '04-oct',
      nodo: 'Esmeraldas',
      tipo: 'Sicariato',
      lugarDescripcion: 'Las Malvinas, ciudad de Esmeraldas. Dos sujetos en moto disparan contra varias personas; detenido alias "Mateo" en Isla Piedad.',
      victimas: '1 muerto · 1 herido',
      puertoMasCercano: 'Esmeraldas',
      distanciaKm: 0.8
    },
    {
      fecha: '~05-oct',
      nodo: 'Esmeraldas',
      tipo: 'Crimen organizado',
      lugarDescripcion: 'Borbón (Eloy Alfaro). Captura de alias "Licho", cabecilla de estructura ligada a Los Tiguerones, con orden por asesinato.',
      victimas: '1 detenido',
      puertoMasCercano: 'Esmeraldas',
      distanciaKm: 74.2
    },
    {
      fecha: '08-oct',
      nodo: 'Esmeraldas',
      tipo: 'Sicariato',
      lugarDescripcion: 'Monseñor Leonidas Proaño, valle de San Rafael. Asesinado conductor que realizaba fletes en su vehículo.',
      victimas: '1 muerto',
      puertoMasCercano: 'Esmeraldas',
      distanciaKm: 6.0
    },
    {
      fecha: '11-oct',
      nodo: 'Esmeraldas',
      tipo: 'Robo de combustible',
      lugarDescripcion: 'Cupa, km 70 vía Santo Domingo–Esmeraldas (Quinindé). Perforación clandestina de poliducto; tanquero con 9.000 galones. Ejército lo atribuye a Los Tiguerones.',
      victimas: '1 detenido',
      puertoMasCercano: 'Esmeraldas',
      distanciaKm: 46.8
    },
    {
      fecha: '~12-oct',
      nodo: 'Esmeraldas',
      tipo: 'Narcotráfico',
      lugarDescripcion: 'El Aire Libre Alto. 220 bloques de presunta marihuana en inmueble; vínculo preliminar con Los Tiguerones.',
      victimas: '—',
      puertoMasCercano: 'Esmeraldas',
      distanciaKm: 3.9
    },
    {
      fecha: '12-oct',
      nodo: 'Guayas',
      tipo: 'Sicariato',
      lugarDescripcion: 'Recinto El Cruce, parroquia Juan Bautista Aguirre (Daule). Comerciante arrocero (39) asesinado y su cuñado herido afuera de una vivienda; sin robo, se investiga ataque dirigido.',
      victimas: '1 muerto · 1 herido',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 45.1
    },
    {
      fecha: '12-oct',
      nodo: 'Santa Elena',
      tipo: 'Sicariato',
      lugarDescripcion: 'Barrio Coresa 1, Salinas. Joven de 19 años asesinado al anochecer.',
      victimas: '1 muerto',
      puertoMasCercano: 'Santa Elena',
      distanciaKm: 5.9
    },
    {
      fecha: '12-oct',
      nodo: 'Santa Elena',
      tipo: 'Sicariato',
      lugarDescripcion: 'Barrio Las Terrazas, La Libertad. Hombre de 28 años asesinado; primeros crímenes tras 10 días sin muertes violentas en la península.',
      victimas: '1 muerto',
      puertoMasCercano: 'Santa Elena',
      distanciaKm: 1.6
    },
    {
      fecha: '12/13-oct',
      nodo: 'Manta',
      tipo: 'Sicariato',
      lugarDescripcion: 'Av. 7 entre calles 14 y 15, centro de Manta. Abogado asesinado; grabó a su atacante y el video permitió detener a 3 personas (presunto sicario, dueño de un patio de autos y un hombre que desmontaba cámaras).',
      victimas: '1 muerto · 3 detenidos',
      puertoMasCercano: 'Manta',
      distanciaKm: 1.6
    },
    {
      fecha: '13-oct',
      nodo: 'Guayaquil',
      tipo: 'Robo / Asalto',
      lugarDescripcion: 'Guayacanes → Av. Francisco de Orellana. Persecución tras un robo; uno de los sospechosos habría apuntado con un revólver a los agentes.',
      victimas: '2 detenidos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 17.5
    },
    {
      fecha: '13-oct',
      nodo: 'Manta',
      tipo: 'Muerte violenta',
      lugarDescripcion: 'Vía al sitio Cárcel, Montecristi rural. Restos humanos en sacos de yute; se investiga si pertenecen a un taxista desaparecido desde el 8-oct.',
      victimas: '1 muerto',
      puertoMasCercano: 'Manta',
      distanciaKm: 15.3
    },
    {
      fecha: '14-oct',
      nodo: 'Manta',
      tipo: 'Sicariato',
      lugarDescripcion: 'Barrio Montalbán, Montecristi. Hombre asesinado en la calle principal de acceso al barrio; el distrito Manta–Montecristi–Jaramijó llega a 403 homicidios en 2026.',
      victimas: '1 muerto',
      puertoMasCercano: 'Manta',
      distanciaKm: 14.6
    },
    {
      fecha: '14-oct',
      nodo: 'Manta',
      tipo: 'Crimen organizado',
      lugarDescripcion: 'Sector Nuevo Amanecer, Jaramijó. Allanamiento de la FTC Manabí, Policía e inteligencia de la FAE: escopeta artesanal, 53 municiones 7,62 mm y unas 100 dosis de droga; vínculo con Los Choneros.',
      victimas: '—',
      puertoMasCercano: 'Manta',
      distanciaKm: 9.3
    },
    {
      fecha: '14-oct',
      nodo: 'Puerto Bolívar',
      tipo: 'Sicariato',
      lugarDescripcion: 'Bus urbano línea 10, Machala (Guayas y Onceava Norte). Estudiante de 16 años asesinado con cinco disparos dentro del bus; un pasajero herido por bala perdida. Los atacantes huyeron en moto.',
      victimas: '1 muerto · 1 herido',
      puertoMasCercano: 'Puerto Bolívar',
      distanciaKm: 4.7
    },
    {
      fecha: '14-oct',
      nodo: 'Puerto Bolívar',
      tipo: 'Explosivos',
      lugarDescripcion: 'Antiguo mercado central de Machala. Operativo "Pandora": 20 cargas explosivas EMULNOR 3000, ~300 dosis de droga, 26 equipos robados y 81 bultos de contrabando.',
      victimas: '6 detenidos',
      puertoMasCercano: 'Puerto Bolívar',
      distanciaKm: 5.1
    },
    {
      fecha: '14-oct',
      nodo: 'Guayaquil',
      tipo: 'Extorsión',
      lugarDescripcion: 'Entrada de la 8, Nueva Prosperina. Operativo del distrito para frenar las "vacunas" a comerciantes tras reportes de hombres armados en motos.',
      victimas: '—',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 19.4
    },
    {
      fecha: '14-oct',
      nodo: 'Guayas',
      tipo: 'Operativo',
      lugarDescripcion: 'Base aérea de Taura. Dos helicópteros UH-60M Black Hawk de EE.UU. se suman a las operaciones de seguridad y control marítimo.',
      victimas: '—',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 25.1
    },
    {
      fecha: '15-oct',
      nodo: 'Samborondón',
      tipo: 'Secuestro',
      lugarDescripcion: 'Urbanización en el km 3 de la vía a Samborondón. Grupo armado con prendas tipo militar ingresó en dos vehículos, golpeó a los guardias, les quitó 2 armas, dañó las cámaras y secuestró a un hombre y a su hijo de 14 años.',
      victimas: '2 secuestrados',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 17.4
    },
    {
      fecha: '15-oct',
      nodo: 'Guayaquil',
      tipo: 'Sicariato',
      lugarDescripcion: 'Vía a Daule y Av. Eduardo Solá Franco (entrada a La Florida). Motorizados interceptaron un taxi y dispararon contra un menor que viajaba con su madre.',
      victimas: '1 muerto (menor)',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 16.5
    },
    {
      fecha: '15-oct',
      nodo: 'Guayaquil',
      tipo: 'Crimen organizado',
      lugarDescripcion: 'Guayaquil (Operación Muralla). Capturado alias "Coche", presunto cabecilla logístico de Comandos de la Frontera, en un operativo simultáneo con Orellana y Sucumbíos.',
      victimas: '1 detenido',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 10.4
    },
    {
      fecha: '15-oct',
      nodo: 'Guayas',
      tipo: 'Crimen organizado',
      lugarDescripcion: 'Simón Bolívar y recinto Tres Postes (Yaguachi). Capturados alias "Perra Flaca" y "Bacteria", mandos medios de Los Águilas; subfusil, subametralladora, pistolas y más de 200 cartuchos.',
      victimas: '7 detenidos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 33.0
    },
    {
      fecha: '16-oct',
      nodo: 'Guayaquil',
      tipo: 'Crimen organizado',
      lugarDescripcion: 'Nueva Prosperina, 9 de Octubre, Esteros, Florida, Sur, Portete y Durán. Operativo Apolo 35: 7 armas, 22 motos y 5 vehículos robados; 4 detenidos en flagrancia mientras asaltaban un camión repartidor en Esteros.',
      victimas: '22 detenidos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 5.2
    },
    {
      fecha: '15-oct',
      nodo: 'Puerto Bolívar',
      tipo: 'Muerte violenta',
      lugarDescripcion: 'Barrios Venezuela y Florida 7, sur de Machala. Dos cabezas humanas con panfletos amenazantes, una frente a un supermercado y otra en la vía pública, con una hora de diferencia.',
      victimas: '2 muertos',
      puertoMasCercano: 'Puerto Bolívar',
      distanciaKm: 5.1
    },
    {
      fecha: '15-oct',
      nodo: 'Puerto Bolívar',
      tipo: 'Muerte violenta',
      lugarDescripcion: 'Barrio 19 de Noviembre, oeste de Machala. Cabeza humana con panfleto frente a un taller; los familiares identificaron a la víctima como un estudiante de 17 años.',
      victimas: '1 muerto',
      puertoMasCercano: 'Puerto Bolívar',
      distanciaKm: 3.2
    },
    {
      fecha: '15-oct',
      nodo: 'Puerto Bolívar',
      tipo: 'Sicariato',
      lugarDescripcion: 'Sector La Unión Colombiana, vía Panamericana, Machala. Hombre de 26 años hallado con dos disparos a un costado de la vía.',
      victimas: '1 muerto',
      puertoMasCercano: 'Puerto Bolívar',
      distanciaKm: 7.5
    },
    {
      fecha: '15-oct',
      nodo: 'Manta',
      tipo: 'Crimen organizado',
      lugarDescripcion: 'Santa Ana, Manta. Desarticulado el grupo "G200", escisión de Los Lobos integrada sobre todo por adolescentes; cobraba vacunas de hasta USD 50.000 y grababa videos intimidatorios.',
      victimas: '5 detenidos',
      puertoMasCercano: 'Manta',
      distanciaKm: 4.2
    }
  ],

  // PÁGINA 9 (Sección 02): Nivel de riesgo por nodo portuario
  nivelRiesgoPorNodo: [
    {
      nodo: 'Esmeraldas · Puerto Comercial / Balao',
      nivel: 'ALTO',
      fundamento: 'Tiguerones dominante; 228 homicidios ene–ago (+3,2 %); 2,2 t en altamar (13-jul)'
    },
    {
      nodo: 'Manta · Terminal Portuario (TPM)',
      nivel: 'CRÍTICO',
      fundamento: 'Distrito Manta: 403 muertes violentas al 14-oct; flota pesquera bajo presión de EE.UU.'
    },
    {
      nodo: 'Monteverde · terminal GLP',
      nivel: 'MEDIO',
      fundamento: 'Terminal de GLP; riesgo asociado a la violencia del entorno costero'
    },
    {
      nodo: 'La Libertad · terminal petrolero / pesca',
      nivel: 'ALTO',
      fundamento: '3 masacres en La Libertad en 2026; 141 asesinatos provinciales a julio'
    },
    {
      nodo: 'Guayaquil · Contecon / TPG / Naportec / privados',
      nivel: 'CRÍTICO',
      fundamento: 'Zona 8: 1.759 homicidios ene–ago (−21,1 %); TPG 30,7 t y Naportec 15,8 t decomisadas en 2025'
    },
    {
      nodo: 'Posorja · DP World',
      nivel: 'CRÍTICO',
      fundamento: 'Terminal con más decomisos 2025 (36,1 t); 8 incautaciones 2026; ataque a Capitanía 12-ago'
    },
    {
      nodo: 'Puerto Bolívar · Yilport (Machala)',
      nivel: 'CRÍTICO',
      fundamento: 'El Oro: 788 homicidios ene–ago (+77 %); ≈9,1 t incautadas 2026; VB-III 5 muertos (8-oct)'
    }
  ],

  // PÁGINA 9: Homicidios por distrito policial Zona 8 ene–ago 2026
  homicidiosPorDistritoPolicialZona8: [
    { distrito: 'Pascuales', homicidios2026: 247 },
    { distrito: 'Durán', homicidios2026: 227, variacion: '-41,8 %' },
    { distrito: 'Esteros', homicidios2026: 225, variacion: '+19,0 %' },
    { distrito: 'Nueva Prosperina', homicidios2026: 216, variacion: '-54,4 %' },
    { distrito: 'Portete', homicidios2026: 188 },
    { distrito: 'Sur', homicidios2026: 165, variacion: '-15,8 %' }
  ],

  // PÁGINA 9 Y 10: Zonas críticas en otros nodos
  zonasCriticasOtrosNodos: [
    { nodo: 'Puerto Bolívar', sector: 'Barrios 4 de Abril y 5 de Diciembre, El Pampón y riberas del estero Huaylá (Sao Box y Lobos; 300 familias desplazadas)', nivel: 'CRÍTICO' },
    { nodo: 'Machala', sector: '12 de Mayo, Av. Bolívar Madero Vargas, sur (Manuel Estomba), Puerto Grande', nivel: 'ALTO' },
    { nodo: 'Manta', sector: 'Parroquia Eloy Alfaro (Santa Ana, Horacio Hidrovo, Circunvalación), Centro y Mercado Central, Tarqui (12 de Octubre)', nivel: 'CRÍTICO' },
    { nodo: 'Montecristi', sector: 'Las Jacuatas y 10 de Enero (masacres del 6-sep y 24-sep)', nivel: 'CRÍTICO' },
    { nodo: 'Manta', sector: 'Los Esteros (Lazareto), Jocay, Manta 2000, Santa Martha', nivel: 'ALTO' },
    { nodo: 'Esmeraldas', sector: 'Sur y valle de San Rafael (Proaño, La Cananga, 20 de Junio), Las Malvinas, Isla Piedad, 15 de Marzo, Santa Martha', nivel: 'CRÍTICO' },
    { nodo: 'Esmeraldas', sector: 'Centro y Parada 7, Codesa, San Martín de Porres, Aire Libre, Tachina', nivel: 'ALTO' },
    { nodo: 'Santa Elena', sector: 'La Libertad (Virgen del Carmen, Velasco Ibarra, Abdón Calderón)', nivel: 'CRÍTICO' },
    { nodo: 'Santa Elena', sector: 'Salinas (Santa Rosa, puerto pesquero), cantón Santa Elena', nivel: 'ALTO' }
  ],

  // PÁGINA 10 Y 11: Matriz de sectores críticos Guayaquil y su área de influencia
  matrizSectoresCriticosGuayaquil: [
    {
      sector: 'Pascuales (Pascuales · Bastión Popular · Mucho Lote · Vergeles)',
      nivel: 'CRÍTICO',
      indicador: '247 homicidios ene–ago 2026: distrito más violento de Zona 8 (14 %)',
      gdoPresentes: '≥12 estructuras: Pitufos (Lobos), Águilas, M-27 (Tiguerones), Freddy Krueger, Ánclas, Galitos, Juanitos',
      km: '22,2 km'
    },
    {
      sector: 'Esteros (Isla Trinitaria · Las Malvinas · Huancavilca)',
      nivel: 'CRÍTICO',
      indicador: '225 ene–ago (+19 %, récord); 252 al 13-oct',
      gdoPresentes: 'Lagartos vs Tiguerones (Dignidad Popular)',
      km: '5,0 km'
    },
    {
      sector: 'Durán (Durán · El Recreo · Popular Guayas · La Primavera)',
      nivel: 'CRÍTICO',
      indicador: '227 ene–ago (−41,8 %)',
      gdoPresentes: 'Chone Killers (facciones) vs Latin Kings',
      km: '14,2 km'
    },
    {
      sector: 'Nueva Prosperina (Monte Sinaí · Flor de Bastión · Paraíso de la Flor · Socio Vivienda · Sergio Toral)',
      nivel: 'CRÍTICO',
      indicador: '216 ene–ago (−54,4 % vs 474)',
      gdoPresentes: 'Fatales, Pascualitos, Igualitos, Tiguerones Fénix; vacuna USD 3/vivienda',
      km: '21,6 km'
    },
    {
      sector: 'Portete (Cristo del Consuelo · El Cisne · Batallón del Suburbio)',
      nivel: 'ALTO',
      indicador: '188 ene–ago',
      gdoPresentes: 'Fatales vs Freddy Krueger; Tiguerones vs Carniceros',
      km: '8,8 km'
    },
    {
      sector: 'Sur (Guasmo Sur/Central · La Floresta)',
      nivel: 'ALTO',
      indicador: '165 ene–ago (−15,8 %)',
      gdoPresentes: 'Lagartos, Mafia 18, facción "JJ"',
      km: '2,8 km'
    },
    {
      sector: 'Florida (Florida · Mapasingue · Juan Montalvo)',
      nivel: 'ALTO',
      indicador: '117 ene–jun',
      gdoPresentes: 'Tiguerones (extorsión Juan Montalvo); Fatales',
      km: '15,9 km'
    },
    {
      sector: '9 de Octubre (Centro-sur)',
      nivel: 'ALTO',
      indicador: '95 ene–jun; violencia desplazada al sur',
      gdoPresentes: 'Varias',
      km: '10,2 km'
    },
    {
      sector: 'Progreso (Chongón · Vía a la Costa)',
      nivel: 'MEDIO',
      indicador: '56 ene–jun',
      gdoPresentes: 'Fatales (alias Orejas capturado 8-oct)',
      km: '19,4 km'
    },
    {
      sector: 'Samborondón (La Puntilla · Isla Mocolí)',
      nivel: 'MEDIO',
      indicador: '46 ene–jun',
      gdoPresentes: 'Lobos (financista capturado 8-oct), Lagartos',
      km: '15,1 km'
    },
    {
      sector: 'Daule (Zona 5) (La Aurora · vía a Daule norte · Nobol)',
      nivel: 'ALTO',
      indicador: 'Sin cifra consolidada 2026; 3 ataques letales 2–10 oct',
      gdoPresentes: 'Águilas (Doble A), Fatales, Chone Killers',
      km: '28,2 km'
    },
    {
      sector: 'Modelo / Ceibos (Urdesa · Kennedy · Ceibos)',
      nivel: 'MEDIO',
      indicador: '26 y 18 ene–jun',
      gdoPresentes: 'Robo de 42 armas a empresa de seguridad (7-oct)',
      km: '12,8 km'
    }
  ],

  // PÁGINA 11 Y 12 (Sección 03): Nodo Guayaquil (Radio 20 km)
  guayaquilStats: {
    homicidiosZona8: '1.759 homicidios Zona 8, ene–ago (−21,1 %)',
    muertesViolentasEsteros: '252 muertes violentas en distrito Esteros (junto al puerto) al ~13-oct',
    decomisos2025Origen: '49,2 t decomisadas en 2025 con origen TPG + Naportec + Contecon',
    situacionRadio20km:
      'El puerto principal está rodeado por los distritos Esteros (Isla Trinitaria, Las Malvinas), Sur (Guasmo) y Portete, que hoy concentran la violencia que antes estaba en el noroeste. Dentro del radio de 20 km operan al menos diez estructuras criminales. Lagartos y Mafia 18 se especializan en contaminar contenedores y buques en el canal de acceso. Los accesos portuarios (Perimetral, Av. 25 de Julio y la Trinitaria) concentran robo de contenedores, extorsión a transportistas y sicariatos.'
  },

  bandasOperanEntornoGuayaquil: [
    {
      gdo: 'Los Lagartos / Mafia 18',
      nivel: 'CRÍTICO',
      zonaActividad: 'Guasmo Sur, La Floresta y Distrito Sur. Contaminación de buques en el canal de acceso, extorsión (USD 300–1.000) y secuestro'
    },
    {
      gdo: 'Los Tiguerones (Fénix, Igualitos, Pascualitos, M-27)',
      nivel: 'CRÍTICO',
      zonaActividad: 'Nueva Prosperina, Pascuales y Esteros. Extorsión con libretas de cobro, sicariato'
    },
    {
      gdo: 'Los Choneros: Fatales y Águilas',
      nivel: 'CRÍTICO',
      zonaActividad: 'Fatales en Nueva Prosperina y Portete; Águilas en Pascuales y Daule. Microtráfico y sicariato'
    },
    {
      gdo: 'Chone Killers y Latin Kings',
      nivel: 'CRÍTICO',
      zonaActividad: 'Guerra en Durán (El Recreo, La Primavera). Acopio de droga hacia los puertos'
    },
    {
      gdo: 'Los Lobos (vía aliados)',
      nivel: 'ALTO',
      zonaActividad: 'Sur de Guayaquil y Durán; financista capturado en La Puntilla (8-oct)'
    },
    {
      gdo: 'Freddy Krueger, Carniceros, Pitufos',
      nivel: 'ALTO',
      zonaActividad: 'Portete, Cristo del Consuelo y Pascuales'
    }
  ],

  // PÁGINA 12 Y 13: 23 Eventos del 30-sep al 16-oct dentro del radio de 20 km de Guayaquil
  eventosRadio20kmGuayaquil: [
    {
      num: 1,
      fecha: '30-sep',
      tipo: 'Sicariato',
      nodo: 'Guayaquil',
      lugarDescripcion: 'Vía Perimetral, antes de Trinipuerto. Ataque a taxista en circulación; pasajera con roce de bala.',
      victimas: '1 muerto · 1 herida',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 5.3
    },
    {
      num: 2,
      fecha: '30-sep',
      tipo: 'Secuestro',
      nodo: 'Durán',
      lugarDescripcion: 'Cdla. Ferroviaria → El Recreo 2.ª etapa. Funcionaria pública (37) liberada por UNASE (~150 agentes). Hipótesis: Chone Killers, facción "Gato Celi".',
      victimas: '1 liberada',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 13.6
    },
    {
      num: 3,
      fecha: '01-oct',
      tipo: 'Sicariato',
      nodo: 'Guayaquil',
      lugarDescripcion: 'Callejón 32 y la O (sur). Hombre de 36 años atacado por motorizados.',
      victimas: '1 muerto',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 7.5
    },
    {
      num: 4,
      fecha: '01/03-oct',
      tipo: 'Extorsión',
      nodo: 'Guayas',
      lugarDescripcion: 'Durán (El Recreo), Bastión Popular, Playas. Operativos "Libertad": exigencias de USD 10.000, 4.000, 3.000 y USD 50.000 a camiones de bebidas que operan en Posorja.',
      victimas: '12 detenidos (nacional)',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 13.6
    },
    {
      num: 5,
      fecha: '02-oct',
      tipo: 'Explosivos',
      nodo: 'Guayaquil',
      lugarDescripcion: 'Esteros, Portete, Durán, Samborondón. 13 sacos de explosivos artesanales y 14 armas incautadas tras denuncia por código QR. Bandas: Lobos, Águilas, Tiguerones, Mafia 18, Chone Killers, Freddy Krueger.',
      victimas: '14–16 detenidos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 4.7
    },
    {
      num: 6,
      fecha: '03-oct',
      tipo: 'Ataque armado',
      nodo: 'Durán',
      lugarDescripcion: 'Cdla. Maldonado → vía Durán–Yaguachi (Feria Ganadera). Ataque y persecución con intercambio de disparos contra la Policía; 4 pistolas incautadas.',
      victimas: '2 muertos · 5 detenidos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 15.3
    },
    {
      num: 7,
      fecha: '05-oct',
      tipo: 'Sicariato',
      nodo: 'Guayaquil',
      lugarDescripcion: 'Urb. Villa Geranio 1, Chongón. Hombre (~31) interceptado en la pluma de acceso por dos atacantes en moto.',
      victimas: '1 muerto',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 19.4
    },
    {
      num: 8,
      fecha: '06-oct',
      tipo: 'Ataque armado',
      nodo: 'Guayaquil',
      lugarDescripcion: 'Coop. Jacobo Bucaram, Isla Trinitaria. Disparos contra patrullero de Segura EP.',
      victimas: '0 heridos · 2 detenidos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 4.3
    },
    {
      num: 9,
      fecha: '06-oct',
      tipo: 'Muerte violenta',
      nodo: 'Guayaquil',
      lugarDescripcion: 'Coop. 7 de Septiembre, Guasmo Central. Restos humanos en tres fundas; víctima sin identificar.',
      victimas: '1 muerto',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 3.4
    },
    {
      num: 10,
      fecha: '07-oct',
      tipo: 'Robo / Asalto',
      nodo: 'Guayaquil',
      lugarDescripcion: 'Cdla. La Kennedy → Vía Perimetral (GOE). 6–10 sujetos con prendas tipo policial/militar simularon un operativo y robaron 42 armas a una empresa de seguridad privada; persecución y balacera.',
      victimas: '2 policías heridos · 2 detenidos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 13.0
    },
    {
      num: 11,
      fecha: '07-oct',
      tipo: 'Sicariato',
      nodo: 'Guayaquil',
      lugarDescripcion: 'Mapasingue Este (paso a Urdenor/Urdesa). Alias "Fox" atacado en su vehículo por dos sicarios en moto.',
      victimas: '1 muerto',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 14.2
    },
    {
      num: 12,
      fecha: '07-oct',
      tipo: 'Masacre',
      nodo: 'Guayaquil',
      lugarDescripcion: 'Centro de rehabilitación, coop. Esmeraldas Libre (Las Malvinas). Hombres armados dispararon contra internos.',
      victimas: '2 muertos (1 menor) · 1 herido',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 5.6
    },
    {
      num: 13,
      fecha: '07-oct',
      tipo: 'Sicariato',
      nodo: 'Guayaquil',
      lugarDescripcion: 'Parque coop. Pastor Vera, Juan Montalvo. Vecino baleado al salir de su vivienda.',
      victimas: '1 muerto',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 18.7
    },
    {
      num: 14,
      fecha: '08-oct',
      tipo: 'Crimen organizado',
      nodo: 'Samborondón',
      lugarDescripcion: 'Plaza Lagos, La Puntilla. Op. Gran Fénix-Cantabria (Ecuador–España–Europol): capturado presunto financista de alias "Pipo" (Los Lobos); villa con búnker. Red vinculada a 42,5 t; 2 policías activos entre los detenidos.',
      victimas: '21 detenidos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 15.7
    },
    {
      num: 15,
      fecha: '08-oct',
      tipo: 'Narcotráfico',
      nodo: 'Guayaquil',
      lugarDescripcion: 'Puerto de Guayaquil (terminal no identificada). 1.675,58 kg de cocaína en maquinaria declarada como "separador de metales", destino México.',
      victimas: '2 detenidos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 0.0
    },
    {
      num: 16,
      fecha: '12-oct',
      tipo: 'Ataque armado',
      nodo: 'Guayaquil',
      lugarDescripcion: 'Emergencias Hospital Teodoro Maldonado (Esteros). Al menos 6 disparos; hipótesis de venganza.',
      victimas: '2 heridos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 5.4
    },
    {
      num: 17,
      fecha: '~14-oct',
      tipo: 'Corrupción',
      nodo: 'Guayaquil',
      lugarDescripcion: '16 allanamientos. 10 policías activos entre 12 detenidos por venta de vehículos de patios de retención.',
      victimas: '12 detenidos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 10.4
    },
    {
      num: 18,
      fecha: '13-oct',
      tipo: 'Robo / Asalto',
      nodo: 'Guayaquil',
      lugarDescripcion: 'Guayacanes → Av. Francisco de Orellana. Persecución tras un robo; uno de los sospechosos habría apuntado con un revólver a los agentes.',
      victimas: '2 detenidos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 17.5
    },
    {
      num: 19,
      fecha: '14-oct',
      tipo: 'Extorsión',
      nodo: 'Guayaquil',
      lugarDescripcion: 'Entrada de la 8, Nueva Prosperina. Operativo del distrito para frenar las "vacunas" a comerciantes tras reportes de hombres armados en motos.',
      victimas: '—',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 19.4
    },
    {
      num: 20,
      fecha: '15-oct',
      tipo: 'Secuestro',
      nodo: 'Samborondón',
      lugarDescripcion: 'Urbanización en el km 3 de la vía a Samborondón. Grupo armado con prendas tipo militar ingresó en dos vehículos, golpeó a los guardias, les quitó 2 armas, dañó las cámaras y secuestró a un hombre y a su hijo de 14 años.',
      victimas: '2 secuestrados',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 17.4
    },
    {
      num: 21,
      fecha: '15-oct',
      tipo: 'Sicariato',
      nodo: 'Guayaquil',
      lugarDescripcion: 'Vía a Daule y Av. Eduardo Solá Franco (entrada a La Florida). Motorizados interceptaron un taxi y dispararon contra un menor que viajaba con su madre.',
      victimas: '1 muerto (menor)',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 16.5
    },
    {
      num: 22,
      fecha: '15-oct',
      tipo: 'Crimen organizado',
      nodo: 'Guayaquil',
      lugarDescripcion: 'Guayaquil (Operación Muralla). Capturado alias "Coche", presunto cabecilla logístico de Comandos de la Frontera, en un operativo simultáneo con Orellana y Sucumbíos.',
      victimas: '1 detenido',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 10.4
    },
    {
      num: 23,
      fecha: '16-oct',
      tipo: 'Crimen organizado',
      nodo: 'Guayaquil',
      lugarDescripcion: 'Nueva Prosperina, 9 de Octubre, Esteros, Florida, Sur, Portete y Durán. Operativo Apolo 35: 7 armas, 22 motos y 5 vehículos robados; 4 detenidos en flagrancia mientras asaltaban un camión repartidor en Esteros.',
      victimas: '22 detenidos',
      puertoMasCercano: 'Guayaquil',
      distanciaKm: 5.2
    }
  ],

  // PÁGINA 14 (PÁGINA 13 DE 40): Eventos fuera del radio (referencia)
  eventosFueraDelRadioGuayaquil: [
    { fecha: '30-sep', tipo: 'Sicariato', lugar: 'Socio Vivienda 1, "Los Tanques" (Nueva Prosperina)', distancia: '22,3 km' },
    { fecha: '30-sep', tipo: 'Secuestro', lugar: 'Distrito Progreso → San Isidro/Cerecita', distancia: '41,5 km' },
    { fecha: '01-oct', tipo: 'Sicariato', lugar: 'Vía a Daule', distancia: '20,6 km' },
    { fecha: '02-oct', tipo: 'Sicariato', lugar: 'Urb. Colina del Sol, km 12,5 vía a Daule', distancia: '23,4 km' },
    { fecha: '03-oct', tipo: 'Sicariato', lugar: 'Km 11 vía Durán–Yaguachi (La Toma de Agua)', distancia: '23,9 km' },
    { fecha: '03-oct', tipo: 'Masacre', lugar: 'Barbería, recinto Tres Postes (Yaguachi)', distancia: '33,0 km' },
    { fecha: '07-oct', tipo: 'Extorsión', lugar: 'Bloque 10, Paraíso de la Flor', distancia: '22,4 km' },
    { fecha: '08-oct', tipo: 'Ataque armado', lugar: 'Recinto Palo Alto, Daule rural', distancia: '34,1 km' },
    { fecha: '08-oct', tipo: 'Crimen organizado', lugar: 'Chongón', distancia: '20,3 km' },
    { fecha: '09-oct', tipo: 'Crimen organizado', lugar: 'Zona 8 (10 distritos)', distancia: '22,8 km' },
    { fecha: '09-oct', tipo: 'Ataque armado', lugar: 'Cdla. Tomás Acuña, Milagro', distancia: '38,3 km' },
    { fecha: '09/13-oct', tipo: 'Corrupción', lugar: 'Guayaquil / vía Las Palmas–Samborondón', distancia: '26,1 km' },
    { fecha: '10-oct', tipo: 'Sicariato', lugar: 'Av. Río Amazonas, Nobol', distancia: '42,0 km' },
    { fecha: '11-oct', tipo: 'Explosivos', lugar: 'Monte Sinaí', distancia: '21,4 km' },
    { fecha: '14-oct', tipo: 'Crimen organizado', lugar: 'Nueva Prosperina', distancia: '20,6 km' },
    { fecha: '14-oct', tipo: 'Operativo', lugar: 'Base aérea de Taura', distancia: '25,1 km' },
    { fecha: '15-oct', tipo: 'Crimen organizado', lugar: 'Simón Bolívar y recinto Tres Postes (Yaguachi)', distancia: '33,0 km' }
  ],

  // PÁGINA 14 (PÁGINA 13 DE 40): Antecedentes 2026 en el entorno
  antecedentes2026EntornoGuayaquil: [
    { fecha: '15-ene', hecho: 'Bloque de Seguridad interviene Naportec y TPG por extorsión a choferes y casas usadas para acopio', distancia: '2,4 km' },
    { fecha: '23-mar', hecho: 'Robo de 2 contenedores con 25.000 celulares (USD 3M) en el viaducto de La Prosperina', distancia: '16,7 km' },
    { fecha: '01-abr', hecho: 'Sicariato en la Perimetral junto a la Isla Trinitaria: 3 muertos', distancia: '5,9 km' },
    { fecha: '20-abr', hecho: 'Ataque armado a un trabajador portuario en la Av. 25 de Julio', distancia: '3,7 km' },
    { fecha: '05-ago', hecho: 'Operativo Tracker en Guasmo Sur: 13 detenidos de Lagartos, entre ellos alias "La M"', distancia: '2,4 km' },
    { fecha: '01-sep', hecho: 'Asalto a convoy de cacao en la oreja Perimetral–Vía a la Costa: 3 custodios secuestrados', distancia: '11,9 km' }
  ],

  // PÁGINA 14 Y 15: Sectores críticos (distancia al puerto)
  sectoresCriticosDistanciaGuayaquil: [
    { sector: 'Pascuales (Pascuales · Bastión Popular · Mucho Lote · Vergeles)', nivel: 'CRÍTICO', nota: '247 homicidios ene–ago 2026: distrito más violento de Zona 8 (14 %)', km: '22,2 km' },
    { sector: 'Esteros (Isla Trinitaria · Las Malvinas · Huancavilca)', nivel: 'CRÍTICO', nota: '225 ene–ago (+19 %, récord); 252 al 13-oct', km: '5,0 km' },
    { sector: 'Durán (Durán · El Recreo · Popular Guayas · La Primavera)', nivel: 'CRÍTICO', nota: '227 ene–ago (−41,8 %)', km: '14,2 km' },
    { sector: 'Nueva Prosperina (Monte Sinaí · Flor de Bastión · Paraíso de la Flor · Socio Vivienda · Sergio Toral)', nivel: 'CRÍTICO', nota: '216 ene–ago (−54,4 % vs 474)', km: '21,6 km' },
    { sector: 'Portete (Cristo del Consuelo · El Cisne · Batallón del Suburbio)', nivel: 'ALTO', nota: '188 ene–ago', km: '8,8 km' },
    { sector: 'Sur (Guasmo Sur/Central · La Floresta)', nivel: 'ALTO', nota: '165 ene–ago (−15,8 %)', km: '2,8 km' },
    { sector: 'Florida (Florida · Mapasingue · Juan Montalvo)', nivel: 'ALTO', nota: '117 ene–jun', km: '15,9 km' },
    { sector: '9 de Octubre (Centro-sur)', nivel: 'ALTO', nota: '95 ene–jun; violencia desplazada al sur', km: '10,2 km' },
    { sector: 'Progreso (Chongón · Vía a la Costa)', nivel: 'MEDIO', nota: '56 ene–jun', km: '19,4 km' },
    { sector: 'Samborondón (La Puntilla · Isla Mocolí)', nivel: 'MEDIO', nota: '46 ene–jun', km: '15,1 km' },
    { sector: 'Daule (Zona 5) (La Aurora · vía a Daule norte · Nobol)', nivel: 'ALTO', nota: 'Sin cifra consolidada 2026; 3 ataques letales 2–10 oct', km: '28,2 km' },
    { sector: 'Modelo / Ceibos (Urdesa · Kennedy · Ceibos)', nivel: 'MEDIO', nota: '26 y 18 ene–jun', km: '12,8 km' }
  ],

  // PÁGINA 15 (PÁGINA 14 DE 40): Vías y logística dentro de 20 km
  viasLogisticaRadio20kmGuayaquil: [
    {
      via: 'Vía Perimetral (acceso a Trinipuerto)',
      nivel: 'CRÍTICO',
      amenaza: 'Robo de contenedores con cambio de cabezal y asaltos a choferes detenidos en el tráfico'
    },
    {
      via: 'Av. 25 de Julio / accesos a Contecon y TPG',
      nivel: 'ALTO',
      amenaza: 'Extorsión a transportistas y sicariatos'
    },
    {
      via: 'Durán–Boliche / Durán–Yaguachi',
      nivel: 'CRÍTICO',
      amenaza: 'Secuestro de conductores, robo de camiones, conductor de tanquero asesinado (3-oct)'
    },
    {
      via: 'Vía a la Costa',
      nivel: 'ALTO',
      amenaza: 'Asalto a convoyes custodiados; contenedores robados abandonados en el km 19'
    },
    {
      via: 'Vía a Daule (Pascuales)',
      nivel: 'ALTO',
      amenaza: 'Robo de tráileres y sicariatos (km 12,5, 2-oct)'
    }
  ],

  amenazasPortuariasGuayaquil:
    'Gancho ciego con sellos clonados; droga encapsulada en maquinaria (1,68 t con destino a México, 8-oct); contaminación de buques fondeados desde lanchas; extorsión a estibadores y transportistas; infiltración de personal (inspector de sellos detenido en la Operación Jaguar).',

  medidasControlGuayaquil:
    'TPG: 3 escáneres fijos y 4 a 5 móviles, USD 50M previstos para 2026. Contecon cedió un área al GOMAR. Naportec y TPG tienen un plan con las FF.AA. Se escanea el 100 % de la carga, pero solo se revisa ~5 % de las imágenes.',

  incautaciones2026VinculadasTerminal: [
    { fecha: '04-abr', terminal: 'No identificada', kg: 1500, destino: 's/d', modalidad: '18 bultos; 6 detenidos dentro del contenedor' },
    { fecha: '26-jul', terminal: 'No identificada', kg: 1200, destino: 'Letonia', modalidad: 'Puré de banano' },
    { fecha: '07-ago', terminal: 'TPG', kg: 49, destino: 'Polonia', modalidad: 'Paneles de refrigeración' },
    { fecha: 'ago', terminal: 'No identificada', kg: 1253, destino: 'España', modalidad: 'Cartón impregnado en 1.080 cajas de banano' },
    { fecha: '08-oct', terminal: 'No identificada', kg: 1676, destino: 'México', modalidad: 'Maquinaria "separador de metales"' }
  ]
};

export const INITIAL_INFO_TERRITORIO: InfoTerritorioReport = {
  documentTitle: 'Informe de Seguridad Portuaria y Evaluación Territorial Ecuador',
  documentSubtitle: 'Monitoreo Operativo, Rutas Logísticas, Contaminación de Carga & Gestión de Riesgos Críticos',
  organization: 'Dirección de Inteligencia y Seguridad Territorial · Operaciones Tácticas',
  date: '16 de Octubre de 2026',
  referenceCode: 'SEG-PORT-2026-10-16',
  executiveSummary:
    'Evaluación táctico-estratégica de la seguridad portuaria y corredores logísticos de Ecuador al 16 de Octubre de 2026. Se consolida el análisis de amenazas sobre los principales nodos portuarios marítimos y fluviales del país (Guayaquil, Puerto Bolívar, Manta, Posorja, Esmeraldas y Santa Elena). Aunque la intervención militar del Bloque de Seguridad ("Operación Limpieza Total") y el despliegue de escáneres no intrusivos ASOTEP/SENAE han fortalecido los perímetros interiores de los muelles, los grupos de delincuencia organizada han desplazado su accionar hacia la cadena logística previa (fincas y carreteras de enlace) y hacia el abordaje en movimiento en el canal de navegación (modalidad gancho ciego en fondeo y tránsito lento). Se mantienen protocolos reforzados con escolta satelital armada, inspección BASC de 17 puntos a contenedores refrigerados y vigilancia fluvial coordinada.',
  kpis: {
    totalPortIncidentsOct2026: 148,
    frustratedContaminationsPct: 84.6,
    inspectedContainersCount: 34820,
    blindHookAttempts: 39,
    convoyAttacks: 23,
    countryRiskScore: 7.8
  },
  monthlyOverallTrend2026: [
    { month: 'Ene', incidents: 94, prevented: 76 },
    { month: 'Feb', incidents: 102, prevented: 83 },
    { month: 'Mar', incidents: 118, prevented: 97 },
    { month: 'Abr', incidents: 124, prevented: 104 },
    { month: 'May', incidents: 149, prevented: 124 },
    { month: 'Jun', incidents: 162, prevented: 137 },
    { month: 'Jul', incidents: 150, prevented: 127 },
    { month: 'Ago', incidents: 171, prevented: 146 },
    { month: 'Sep', incidents: 159, prevented: 135 },
    { month: 'Oct*', incidents: 148, prevented: 125 }
  ],
  corridors: [
    {
      id: 'guayaquil',
      name: 'Eje Portuario Metropolitano Guayaquil',
      corridor: 'Canal de Acceso, Estuario del Río Guayas e Isla Puná',
      terminals: ['Contecon Guayaquil (CGSA)', 'TPG (Terminal Portuario Guayaquil)', 'Bananapuerto', 'Fertisa', 'Puerto Hondo'],
      riskScore: 9.1,
      riskLevel: 'CRÍTICO',
      incidentsCurrentMonth: 58,
      incidentsYearToDate: 596,
      monthlyTrend2026: [42, 45, 51, 48, 56, 62, 59, 64, 61, 58],
      cantonesCriticos: ['Guayaquil (Sur, Portete, Los Esteros)', 'Durán (Zona Industrial / Depósitos)', 'Samborondón (Paso de Carga)'],
      topModusOperandi: [
        { name: 'Gancho Ciego en Canal de Navegación', pct: 41 },
        { name: 'Infiltración en Patios y Depósitos Extraportuarios', pct: 26 },
        { name: 'Ataques Armados a Remolcadores y Gabarras', pct: 18 },
        { name: 'Manipulación y Falsificación de Sellos RFID', pct: 15 }
      ],
      summary:
        'Concentra el 68% del flujo de comercio marítimo no petrolero del Ecuador y experimenta la mayor presión de bandas transnacionales. El paso obligado de buques mercantes a baja velocidad frente a Isla Puná y esteros del Guayas facilita abordajes nocturnos mediante lanchas ultrarrápidas ("pirañas"). En tierra firme, los tramos perimetrales de Durán y el ingreso a los puertos del sur sufren asaltos a transportistas para preñado exprés antes del portal de control.',
      mitigationMeasures: [
        'Despliegue de escoltas fluviales armadas en convoyes de barcazas y lanchas de prácticos.',
        'Inspección termográfica y canina anti-narcóticos en patios de pre-embarque 2 horas antes de estiba.',
        'Auditoría continua de doble precinto satelital con alarma de apertura remota.',
        'Enlace en tiempo real con Capitanía de Puerto y Comando de Guardacostas.'
      ]
    },
    {
      id: 'puerto-bolivar',
      name: 'Eje El Oro / Puerto Bolívar & Archipiélago Jambelí',
      corridor: 'Troncal de la Costa, Vía El Guabo - Machala y Canales de Jambelí',
      terminals: ['Yilport Puerto Bolívar', 'Muelle de Cabotaje', 'Patios Bananeros El Guabo'],
      riskScore: 8.7,
      riskLevel: 'CRÍTICO',
      incidentsCurrentMonth: 34,
      incidentsYearToDate: 346,
      monthlyTrend2026: [22, 25, 29, 31, 38, 41, 39, 44, 37, 34],
      cantonesCriticos: ['Machala (Puerto Bolívar)', 'El Guabo (Eje Bananero)', 'Santa Rosa', 'Pasaje'],
      topModusOperandi: [
        { name: 'Preñado en Empacadoras y Fincas Agrícolas', pct: 44 },
        { name: 'Asaltos a Convoyes en Ruta Terrestre Troncal', pct: 32 },
        { name: 'Contaminación Fluvial en Canales de Jambelí', pct: 24 }
      ],
      summary:
        'Segundo polo exportador marítimo nacional especializado en banano y minería. La "Operación Limpieza Total" de FF.AA. saneó los muelles internos de Yilport; sin embargo, los grupos delictivos desplazaron su punto de ataque a la cadena logística terrestre (asaltos a camiones termoaislados en el trayecto El Guabo–Machala) y a pequeños embarcaderos artesanales en el archipiélago de Jambelí.',
      mitigationMeasures: [
        'Custodia carretera con vehículos blindados de reacción rápida en el corredor El Guabo - Machala.',
        'Verificación de identidad biométrica en choferes y sellado con perno inviolable bajo supervisión.',
        'Vigilancia aérea con drones tácticos de largo alcance en patios perimetrales.'
      ]
    },
    {
      id: 'manta',
      name: 'Eje Manabí / Terminal Portuario Manta',
      corridor: 'Corredor Pesquero Manta - Jaramijó - San Mateo y Eje Vía del Pacífico',
      terminals: ['Terminal Portuario Manta (TPM)', 'Muelle Internacional', 'Dársena Pesquera de San Mateo'],
      riskScore: 7.5,
      riskLevel: 'ALTO',
      incidentsCurrentMonth: 24,
      incidentsYearToDate: 247,
      monthlyTrend2026: [16, 18, 20, 22, 27, 29, 26, 30, 28, 24],
      cantonesCriticos: ['Manta (Zona Tarqui / San Mateo)', 'Montecristi (Vía Circunvalación)', 'Jaramijó'],
      topModusOperandi: [
        { name: 'Buques Nodriza Pesqueros y Lanchas Rápidas', pct: 50 },
        { name: 'Intrusión Perimetral en Muelles Secundarios', pct: 28 },
        { name: 'Extorsión Coercitiva a Transporte de Pesca', pct: 22 }
      ],
      summary:
        'Puerto de aguas profundas natural con alta conectividad internacional. Su infraestructura perimetral cerrada en TPM mantiene un alto nivel de protección física; no obstante, el vector crítico radica en la dársena artesanal y caletas de Jaramijó, utilizadas por redes delictivas para abastecer de combustible a lanchas ultrarrápidas y semisumergibles en altamar.',
      mitigationMeasures: [
        'Control estricto de accesos vehiculares a la zona franca y muelle de contenedores.',
        'Inspección con perros detectores en cargamentos consolidados de atún y harina de pescado.',
        'Malla de videovigilancia con analítica de movimiento térmico en el rompeolas norte.'
      ]
    },
    {
      id: 'posorja',
      name: 'Eje Posorja / Aguas Profundas DP World',
      corridor: 'Canal de Navegación de Aguas Profundas y Autovía Playas - Posorja',
      terminals: ['DP World Posorja', 'Parque Logístico ZEDE', 'Terminal Pesquero Posorja'],
      riskScore: 5.4,
      riskLevel: 'MODERADO',
      incidentsCurrentMonth: 12,
      incidentsYearToDate: 119,
      monthlyTrend2026: [8, 9, 11, 10, 13, 14, 12, 15, 13, 12],
      cantonesCriticos: ['Guayaquil (Parroquia Rural Posorja)', 'General Villamil Playas', 'El Morro'],
      topModusOperandi: [
        { name: 'Asaltos en Bypass Terrestre El Morro - Posorja', pct: 58 },
        { name: 'Intentos de Manipulación de Precintos Electrónicos', pct: 25 },
        { name: 'Aproximación Sospechosa en Zona de Fondeo Exterior', pct: 17 }
      ],
      summary:
        'Es el terminal más tecnificado del país, con escaneo no intrusivo al 100% de la carga mediante portal de rayos X de alta energía y certificación BASC/PBIP nivel 1. El riesgo dentro del recinto es bajo; el foco de amenaza está localizado en los 28 km de la carretera Playas–Posorja, donde grupos delincuenciales emboscan cabezales de tráiler durante horarios nocturnos.',
      mitigationMeasures: [
        'Formación de convoyes protegidos con escolta vehicular armada desde el peaje de Chongón.',
        'Canal de comunicación satelital directa con el Centro de Control de Operaciones DP World.',
        'Puntos de control fijos en desvíos hacia El Morro para disuasión armada.'
      ]
    },
    {
      id: 'esmeraldas',
      name: 'Eje Esmeraldas / APE & Balao',
      corridor: 'Frontera Norte Marítima, Ría de Esmeraldas y Terminal Petrolero Sucre',
      terminals: ['Autoridad Portuaria de Esmeraldas (APE)', 'Terminal Petrolero de Balao', 'Puerto Pesquero Artesanal'],
      riskScore: 8.4,
      riskLevel: 'CRÍTICO',
      incidentsCurrentMonth: 20,
      incidentsYearToDate: 231,
      monthlyTrend2026: [18, 19, 21, 23, 25, 26, 24, 28, 22, 20],
      cantonesCriticos: ['Esmeraldas (Riberas del Teaone)', 'San Lorenzo (Corredor Fronterizo)', 'Atacames'],
      topModusOperandi: [
        { name: 'Extorsión Directa a Contratistas y Operadores', pct: 48 },
        { name: 'Coerción a Cuadrillas de Estiba en Patios', pct: 30 },
        { name: 'Contaminación en Boyas de Carga y Fondeo Fluvial', pct: 22 }
      ],
      summary:
        'Ubicación estratégica próxima a la frontera con Colombia con alta influencia de disidencias armadas y bandas narcodelictivas. Los riesgos predominantes son la extorsión coercitiva a proveedores de servicios portuarios y el intento de penetración en buques graneleros y amarraderos marítimos de Balao.',
      mitigationMeasures: [
        'Filtro de seguridad con pruebas de confiabilidad y verificación de antecedentes al personal de campo.',
        'Refuerzo de perímetros físicos con barreras anti-intrusión y sensores microondas.',
        'Coordinación de custodia con el Comando de Operaciones Norte (COOPNO).'
      ]
    }
  ],
  modalities: [
    {
      id: 'gancho-ciego',
      name: 'Gancho Ciego (Rip-On / Rip-Off)',
      count: 39,
      pct: 26.4,
      quarterTrend: { q1: 68, q2: 89, q3: 98, oct: 39 },
      riskVector: 'Canal de acceso marítimo, fondeadero de boya e Isla Puná',
      description:
        'Ruptura clandestina del sello original del contenedor para introducir maletas o tulas con alcaloides durante el trayecto fluvial lento, colocando un sello gemelo clonado antes del arribo al puerto de destino europeo o norteamericano.'
    },
    {
      id: 'prenado-origen',
      name: 'Preñado Estructural en Origen / Fincas',
      count: 33,
      pct: 22.3,
      quarterTrend: { q1: 54, q2: 67, q3: 74, oct: 33 },
      riskVector: 'Centros de acopio agrícola, fincas bananeras y camaroneras de Guayas, El Oro y Los Ríos',
      description:
        'Ocultamiento de sustancias en el piso falso, mamparas de ventilación o entre la pulpa de la fruta antes de que el contenedor sea sellado oficialmente y precintado en la empacadora.'
    },
    {
      id: 'asalto-carretera',
      name: 'Asalto Armado & Secuestro de Convoy en Carretera',
      count: 27,
      pct: 18.2,
      quarterTrend: { q1: 46, q2: 58, q3: 63, oct: 27 },
      riskVector: 'Troncal de la Costa, Vía a la Costa, Corredor Durán-Boliche y El Guabo-Machala',
      description:
        'Interceptación violenta de cabezales mediante vehículos con balizas simuladas o armas largas, obligando al conductor a ingresar a bodegas clandestinas para desviar o preñar la carga.'
    },
    {
      id: 'extorsion-operadores',
      name: 'Extorsión y Vacunas a Operadores Logísticos',
      count: 24,
      pct: 16.2,
      quarterTrend: { q1: 39, q2: 48, q3: 53, oct: 24 },
      riskVector: 'Zonas industriales, depósitos de contenedores vacíos y talleres de mantenimiento',
      description:
        'Amenazas directas y atentados explosivos a empresas de transporte pesado, cuadrillas de estiba y agencias aduaneras exigiendo pagos semanales a cambio de no sabotear las cargas.'
    },
    {
      id: 'pirateria-fluvial',
      name: 'Piratería Fluvial & Abordaje Rápido',
      count: 15,
      pct: 10.1,
      quarterTrend: { q1: 27, q2: 33, q3: 35, oct: 15 },
      riskVector: 'Archipiélago de Jambelí, Golfo de Guayaquil y canales interiores de Santa Ana',
      description:
        'Ataque con armas automáticas a tripulaciones de remolcadores, prácticos y barcazas para sustraer motores fuera de borda, equipos náuticos o forzar el abordaje ilícito.'
    },
    {
      id: 'vulneracion-sellos',
      name: 'Clonación & Falsificación de Precintos de Seguridad',
      count: 10,
      pct: 6.8,
      quarterTrend: { q1: 14, q2: 17, q3: 18, oct: 10 },
      riskVector: 'Patios de transbordo y áreas de estacionamiento no autorizadas',
      description:
        'Fabricación de sellos metálicos y de cable con numeración idéntica a los precintos certificados BASC o ISO 17712 para reemplazar los sellos vulnerados durante paradas clandestinas.'
    }
  ],
  supplyChain: [
    {
      step: 1,
      stage: 'Cosecha, Selección & Empaque en Fincas',
      riskScore: 6.5,
      riskLevel: 'MEDIO',
      vulnerabilities: 'Vulnerabilidad durante faenas nocturnas, acceso no controlado de personal eventual y falta de cámaras de alta resolución en áreas de paletizado.',
      securityControl: 'Custodia presencial de estiba, registro biométrico de empacadores e inspección canina K-9 antes del cerrado de puertas.'
    },
    {
      step: 2,
      stage: 'Transporte Terrestre por Corredor Vial',
      riskScore: 8.9,
      riskLevel: 'CRÍTICO',
      vulnerabilities: 'Emboscadas armadas, inhibidores de señal GPS (jammers), paradas imprevistas en gasolineras y desvío hacia galpones no autorizados.',
      securityControl: 'Escolta armada en patrulla blindada, candado satelital activo con sensor de apertura no autorizada y monitoreo desde central C4.'
    },
    {
      step: 3,
      stage: 'Depósitos de Contenedores Vacíos (Depots)',
      riskScore: 8.1,
      riskLevel: 'ALTO',
      vulnerabilities: 'Modificación de pisos de madera, inserción de paquetes en paneles aislantes de poliuretano e intercambio irregular de contenedores limpios por modificados.',
      securityControl: 'Inspección técnica BASC de 17 puntos a cada unidad vacía con medidores de densidad acústica y boroscopios industriales.'
    },
    {
      step: 4,
      stage: 'Acceso a Terminal Portuario (Gate-In)',
      riskScore: 5.2,
      riskLevel: 'MEDIO',
      vulnerabilities: 'Congestión vehicular en garitas, suplantación de identidad de choferes y presentación de documentos aduaneros alterados.',
      securityControl: 'Validación en portal de rayos X de alta penetración SENAE, reconocimiento facial y verificación cruzada de precintos en balanza.'
    },
    {
      step: 5,
      stage: 'Patios de Almacenamiento & Espera de Buque',
      riskScore: 4.8,
      riskLevel: 'MEDIO',
      vulnerabilities: 'Colusión con operarios de grúas reach stacker para ubicar contenedores marcados en posiciones de fácil acceso nocturno.',
      securityControl: 'Circuito cerrado de televisión con inteligencia artificial perimetral, rondas caninas continuas y segregación física de zonas de alto riesgo.'
    },
    {
      step: 6,
      stage: 'Estiba en Buque & Canal de Salida Marítima',
      riskScore: 7.9,
      riskLevel: 'ALTO',
      vulnerabilities: 'Aproximación de lanchas ultrarrápidas durante la navegación a 8-10 nudos en el canal de salida y lanzamiento de arpeos.',
      securityControl: 'Escolta con lanchas tácticas de reacción rápida, reflectores de alta potencia y comunicación encriptada con guardacostas de la Armada.'
    }
  ],
  strategicRecommendations: [
    'Establecer Corredores Seguros Terrestres obligatorios con escolta vehicular compartida para el sector exportador bananero y camaronero.',
    'Exigir la instalación de precintos satelitales inteligentes con telemetría en tiempo real desde la salida de la planta de producción hasta el gate-in portuario.',
    'Homologar los sistemas de video analítico e identificación biométrica entre los terminales privados agrupados en ASOTEP y las agencias de control del Estado.',
    'Intensificar los sobrevuelos tácticos con drones de visión nocturna en los puntos ciegos del canal de acceso al Golfo de Guayaquil e Isla Puná.',
    'Implementar auditorías aleatorias de contrainteligencia y polígrafo a cuadrillas de maniobra, inspectores de patio y personal de depósitos extraportuarios.',
    'Crear una mesa de comando unificado entre las agencias de seguridad privada integral, las Capitanías de Puerto y la Dirección Nacional Antidrogas (DNIA).'
  ]
};
