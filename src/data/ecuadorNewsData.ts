export interface EcuadorNewsItem {
  id: string;
  title: string;
  headline: string;
  summary: string;
  fullText: string;
  source: string;
  sourceUrl: string;
  sourceCategory: string;
  date: string;
  time: string;
  publishedIso?: string;
  category:
    | 'Ministerio del Interior'
    | 'Crimen Organizado'
    | 'Operativos & Capturas'
    | 'Narcotráfico & Puertos'
    | 'Extorsión & Secuestros'
    | 'Frontera & Minería'
    | 'Políticas de Seguridad';
  provinces: string[];
  crimeTypes: string[];
  urgency: 'ALTA' | 'TACTICA' | 'ESTRATEGICA';
  readTime: string;
  verifiedOfficial: boolean;
  isMinistryRelated?: boolean;
  isLiveFetched?: boolean;
  tags: string[];
}

export interface IndexedNewsSource {
  id: string;
  name: string;
  shortName: string;
  url: string;
  isOfficial: boolean;
  isMinistryPrimary?: boolean;
  focusLabel: string;
}

export const INDEXED_NEWS_SOURCES: IndexedNewsSource[] = [
  {
    id: 'ministerio-interior',
    name: 'Ministerio del Interior',
    shortName: 'Min. del Interior',
    url: 'https://www.ministeriodelinterior.gob.ec/noticias/',
    isOfficial: true,
    isMinistryPrimary: true,
    focusLabel: 'Apartado Oficial de Operativos y Delitos',
  },
  {
    id: 'policia-nacional',
    name: 'Policía Nacional del Ecuador',
    shortName: 'Policía Nacional',
    url: 'https://noticias.policia.gob.ec/',
    isOfficial: true,
    focusLabel: 'Aprehensiones, UNASE, DINASED y Antinarcóticos',
  },
  {
    id: 'fiscalia-general',
    name: 'Fiscalía General del Estado',
    shortName: 'Fiscalía (FGE)',
    url: 'https://www.fiscalia.gob.ec/',
    isOfficial: true,
    focusLabel: 'Flagrancia, Procesos Penales y Sentencias',
  },
  {
    id: 'oeco',
    name: 'OECO Investigaciones',
    shortName: 'OECO / PADF',
    url: 'https://oeco.padf.org/datos/',
    isOfficial: true,
    focusLabel: 'Observatorio Ecuatoriano de Crimen Organizado',
  },
  {
    id: 'el-universo',
    name: 'El Universo',
    shortName: 'El Universo',
    url: 'https://www.eluniverso.com/noticias/seguridad/',
    isOfficial: false,
    focusLabel: 'Sección Seguridad y Crónica Judicial',
  },
  {
    id: 'primicias',
    name: 'Primicias',
    shortName: 'Primicias',
    url: 'https://www.primicias.ec/seguridad/',
    isOfficial: false,
    focusLabel: 'Investigación de Seguridad y Ministerio del Interior',
  },
  {
    id: 'expreso',
    name: 'Expreso',
    shortName: 'Expreso',
    url: 'https://www.expreso.ec/actualidad/',
    isOfficial: false,
    focusLabel: 'Delitos, Puertos y Narcotráfico',
  },
  {
    id: 'el-comercio',
    name: 'El Comercio',
    shortName: 'El Comercio',
    url: 'https://www.elcomercio.com/tag/seguridad/',
    isOfficial: false,
    focusLabel: 'Seguridad Ciudadana y Control Territorial',
  },
  {
    id: 'teleamazonas',
    name: 'Teleamazonas',
    shortName: 'Teleamazonas',
    url: 'https://www.teleamazonas.com/',
    isOfficial: false,
    focusLabel: 'Cobertura Policial y Delitos Flagrantes',
  },
  {
    id: 'ecuavisa',
    name: 'Ecuavisa',
    shortName: 'Ecuavisa',
    url: 'https://www.ecuavisa.com/seguridad',
    isOfficial: false,
    focusLabel: 'Unidades Investigativas y Crimen Organizado',
  },
  {
    id: 'metro-ecuador',
    name: 'Metro Ecuador',
    shortName: 'Metro Ecuador',
    url: 'https://www.metroecuador.com.ec/noticias/',
    isOfficial: false,
    focusLabel: 'Sucesos Policiales y Operativos Urbanos',
  },
  {
    id: 'vistazo',
    name: 'Vistazo',
    shortName: 'Vistazo',
    url: 'https://www.vistazo.com/actualidad/',
    isOfficial: false,
    focusLabel: 'Análisis de Seguridad y Justicia Penal',
  },
  {
    id: 'al-dia',
    name: 'Al Día (Los Ríos)',
    shortName: 'Al Día (Los Ríos)',
    url: 'https://www.aldia.com.ec/',
    isOfficial: false,
    focusLabel: 'Crónica Delictiva del Corredor Quevedo - Babahoyo',
  },
];

export const ECUADOR_SECURITY_NEWS: EcuadorNewsItem[] = [
  {
    id: 'min-interior-01',
    title: 'Ministerio del Interior ejecuta Operativo Apolo en Guayas: aprehendidos por extorsión, secuestro y tenencia de fusiles',
    headline: 'Intervenciones simultáneas lideradas por la cartera del Interior y la Policía Nacional golpean estructuras delictivas en Nueva Prosperina y Durán.',
    summary: 'El Ministerio del Interior informó la neutralización de células criminales dedicadas al sicariato, secuestro extorsivo y acopio de armamento de guerra durante allanamientos ejecutados de madrugada con el Bloque de Seguridad.',
    fullText: 'Como parte de la estrategia operativa contra los grupos armados organizados, el Ministerio del Interior coordinó incursiones simultáneas en distritos priorizados de la Zona 8. En los inmuebles intervenidos se incautaron armas de fuego de largo alcance, alimentadoras, municiones calibre 5.56 mm, panfletos extorsivos, motocicletas reportadas como robadas y terminales móviles empleados para amenazar a comerciantes y transportistas.',
    source: 'Ministerio del Interior',
    sourceUrl: 'https://www.ministeriodelinterior.gob.ec/noticias/',
    sourceCategory: 'Boletín Oficial · Delitos',
    date: '22 Oct 2026',
    time: '08:30 ECT',
    category: 'Ministerio del Interior',
    provinces: ['Guayas'],
    crimeTypes: ['Extorsión', 'Secuestro', 'Tráfico de Armas'],
    urgency: 'ALTA',
    readTime: '3 min',
    verifiedOfficial: true,
    isMinistryRelated: true,
    tags: ['Ministerio del Interior', 'Operativo Apolo', 'Guayas', 'Extorsión', 'Armas'],
  },
  {
    id: 'min-interior-02',
    title: 'Operación Gran Fénix del Ministerio del Interior desarticula red de narcotráfico y lavado de activos en cuatro provincias',
    headline: 'Allanamientos coordinados con unidades antidrogas y Fiscalía dejan detenidos de alto valor objetivo y decomiso de clorhidrato de cocaína.',
    summary: 'El apartado operativo del Ministerio del Interior reportó la captura de integrantes de una estructura transnacional encargada de contaminar contenedores de exportación en terminales portuarias.',
    fullText: 'Durante varios meses de investigación previa, agentes especializados bajo directriz del Ministerio del Interior rastrearon la ruta logística de acopio de alcaloides desde centros clandestinos hacia puertos del litoral ecuatoriano. El operativo permitió decomisar cargamentos de droga, vehículos blindados sin justificación patrimonial, dinero en efectivo y documentación vinculada al delito de lavado de activos.',
    source: 'Ministerio del Interior',
    sourceUrl: 'https://www.ministeriodelinterior.gob.ec/noticias/',
    sourceCategory: 'Boletín Oficial · Antidrogas',
    date: '21 Oct 2026',
    time: '14:15 ECT',
    category: 'Ministerio del Interior',
    provinces: ['Guayas', 'Manabí', 'El Oro', 'Pichincha'],
    crimeTypes: ['Narcotráfico', 'Lavado de Activos'],
    urgency: 'ALTA',
    readTime: '4 min',
    verifiedOfficial: true,
    isMinistryRelated: true,
    tags: ['Ministerio del Interior', 'Gran Fénix', 'Narcotráfico', 'Puertos', 'Decomiso'],
  },
  {
    id: 'noticia-02',
    title: 'UNASE rescata a víctimas de secuestro extorsivo en Quevedo y captura a 7 presuntos implicados',
    headline: 'Las víctimas permanecían en cautiverio en una zona rural de Los Ríos bajo exigencias económicas de $200.000.',
    summary: 'La Unidad Antisecuestro y Extorsión (UNASE) de la Policía Nacional desplegó incursiones tácticas entre Buena Fe y Quevedo, logrando la liberación ilesa de los ciudadanos y la aprehensión de los custodios armados.',
    fullText: 'Tras labores de inteligencia técnica y geolocalización de comunicaciones extorsivas, agentes especializados de la UNASE cercaron un predio rural en la provincia de Los Ríos. En la intervención en delito flagrante se aprehendió a siete individuos que registraban antecedentes penales por robo agravado, tenencia ilegal de armas y cobro de vacunas extorsivas en el eje vial E25.',
    source: 'Policía Nacional del Ecuador',
    sourceUrl: 'https://noticias.policia.gob.ec/',
    sourceCategory: 'Operativos UNASE',
    date: '20 Oct 2026',
    time: '18:20 ECT',
    category: 'Extorsión & Secuestros',
    provinces: ['Los Ríos'],
    crimeTypes: ['Secuestro', 'Extorsión', 'Robo'],
    urgency: 'ALTA',
    readTime: '3 min',
    verifiedOfficial: true,
    isMinistryRelated: true,
    tags: ['UNASE', 'Quevedo', 'Los Ríos', 'Secuestro Extorsivo', 'Policía Nacional'],
  },
  {
    id: 'noticia-03',
    title: 'Fiscalía obtiene sentencia condenatoria y prisión preventiva contra implicados en asesinato, extorsión y minería ilegal',
    headline: 'Pruebas periciales y balísticas sustentaron la acusación fiscal contra integrantes de grupos de delincuencia organizada.',
    summary: 'La Fiscalía General del Estado procesó penalmente a detenidos en operativos conjuntos por delitos de sicariato, tráfico ilícito de armas de fuego y explotación ilícita de recursos mineros.',
    fullText: 'Con base en informes investigativos de Criminalística y DINASED, los jueces de garantías penales dictaron medidas privativas de libertad y sentencias ejecutoriadas. Los elementos de convicción incluyeron pericias de cotejamiento balístico, extracción de mensajería extorsiva e incautación de maquinaria pesada empleada por redes delictivas para financiar actividades ilícitas.',
    source: 'Fiscalía General del Estado',
    sourceUrl: 'https://www.fiscalia.gob.ec/',
    sourceCategory: 'Procesos Penales · Delitos',
    date: '19 Oct 2026',
    time: '16:05 ECT',
    category: 'Crimen Organizado',
    provinces: ['El Oro', 'Azuay', 'Orellana'],
    crimeTypes: ['Asesinato', 'Extorsión', 'Minería Ilegal'],
    urgency: 'TACTICA',
    readTime: '3 min',
    verifiedOfficial: true,
    isMinistryRelated: false,
    tags: ['Fiscalía', 'Sentencia', 'Asesinato', 'Minería Ilegal', 'Flagrancia'],
  },
  {
    id: 'noticia-04',
    title: 'Alerta del OECO: El 88.4% de los homicidios intencionales en la Costa se perpetran con armas de fuego de tráfico ilícito',
    headline: 'Evaluación técnica advierte alta incidencia de fusiles calibre 5.56 mm y pistolas 9 mm en disputas criminales portuarias.',
    summary: 'El Observatorio Ecuatoriano de Crimen Organizado detalla la correlación entre rutas de microtráfico, contaminación de carga marítima y violencia homicida en Guayas, Los Ríos, Manabí y El Oro.',
    fullText: 'El monitoreo criminalístico del OECO evidencia que la letalidad de los ataques armados responde a la inserción de armamento automático ingresado por pasos fronterizos no habilitados. Los cantones situados sobre corredores logísticos hacia terminales portuarias concentran los mayores indicadores de homicidios intencionales y extorsión comercial.',
    source: 'OECO Investigaciones',
    sourceUrl: 'https://oeco.padf.org/datos/',
    sourceCategory: 'Investigación Estratégica',
    date: '18 Oct 2026',
    time: '11:15 ECT',
    category: 'Crimen Organizado',
    provinces: ['Guayas', 'Manabí', 'Los Ríos', 'El Oro'],
    crimeTypes: ['Asesinato', 'Tráfico de Armas'],
    urgency: 'ESTRATEGICA',
    readTime: '5 min',
    verifiedOfficial: true,
    isMinistryRelated: false,
    tags: ['OECO', 'Armas de Fuego', 'Sicariato', 'Violencia Homicida', 'Costa'],
  },
  {
    id: 'noticia-05',
    title: 'Ministerio del Interior reporta más de mil aprehendidos y centenares de armas decomisadas en operativos semanales contra delitos',
    headline: 'Balance oficial destaca golpes focalizados contra bandas dedicadas al robo en ejes viales, asalto armado y microtráfico.',
    summary: 'Según las cifras consolidadas del Ministerio del Interior, el despliegue policial permitió desarticular células delictivas y recuperar vehículos y mercancías sustraídas en carreteras.',
    fullText: 'En rueda de prensa del Bloque de Seguridad, el Ministerio del Interior presentó los resultados de los operativos ordinarios y extraordinarios ejecutados a escala nacional. Entre los principales resultados figuran aprehensiones en flagrancia y con boleta judicial por asesinato, robo de vehículos, extorsión y tráfico de sustancias sujetas a fiscalización, además de la incautación de toneladas de alcaloides.',
    source: 'El Universo',
    sourceUrl: 'https://www.eluniverso.com/noticias/seguridad/',
    sourceCategory: 'Seguridad · Ministerio del Interior',
    date: '17 Oct 2026',
    time: '12:40 ECT',
    category: 'Operativos & Capturas',
    provinces: ['Pichincha', 'Guayas', 'Sto. Domingo', 'Los Ríos'],
    crimeTypes: ['Robo', 'Asesinato', 'Narcotráfico'],
    urgency: 'TACTICA',
    readTime: '4 min',
    verifiedOfficial: true,
    isMinistryRelated: true,
    tags: ['Ministerio del Interior', 'Balance Operativo', 'Aprehendidos', 'Robo', 'Seguridad'],
  },
];
