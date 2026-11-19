export interface ProvinceData {
  name: string;
  robo: number;
  secuestro: number;
  asesinato: number;
  extorsion: number;
  secuestroExt?: number;
  total: number;
  rural?: number;
  urbano?: number;
}

export interface GrandTotal {
  robo: number;
  secuestro: number;
  asesinato: number;
  extorsion: number;
  secuestroExt?: number;
  extorsionSexual?: number;
  total: number;
}

export interface HourlySlot {
  robo: number;
  secuestro: number;
  asesinato: number;
  extorsion: number;
}

export interface HorariosData {
  madrugada: HourlySlot;
  manana: HourlySlot;
  tarde: HourlySlot;
  noche: HourlySlot;
}

export interface FlagranciaDetail {
  flagrante: number;
  noFlagrante: number;
}

export interface TentativaDetail {
  consumado: number;
  tentativa: number;
}

export interface CantonData {
  prov: string;
  canton: string;
  robo: number;
  extorsion: number;
  asesinato: number;
  secuestro: number;
  secuestroExt?: number;
  total: number;
}

export interface HorariosProvRow {
  prov: string;
  mad: number;
  man: number;
  tar: number;
  noc: number;
  tot: number;
}

export interface MonthData {
  provincias: ProvinceData[];
  grand: GrandTotal;
  horarios: HorariosData;
  flagrancia?: Record<string, FlagranciaDetail>;
  tentativa?: Record<string, TentativaDetail>;
  zonaNacional?: { rural: number; urbano: number };
  cantones?: CantonData[];
  horariosProv?: HorariosProvRow[];
  extorsionSexual?: number;
  notes?: string;
  isAiImported?: boolean;
  importedAt?: string;
}

export type YearDatabase = Record<number, Record<string, MonthData>>;

export interface AiSecurityReport {
  headline: string;
  threatLevel: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRÍTICO';
  summary: string;
  hotspots: Array<{
    location: string;
    risk: string;
    modusOperandi: string;
  }>;
  hourlyVulnerability: {
    peakTime: string;
    vulnerabilityDetails: string;
    safestWindow?: string;
  };
  strategicDirectives: string[];
  comparativeVerdict: string;
}

export interface OecoDecomisosData {
  alcaloidesToneladas: number;
  alcaloidesIncautaciones: number;
  armasIncautadasTotal: number;
  fusilesTrafico: number;
  municionesDecomisadas: number;
  embarcacionesSemiautonomas?: number;
  gruposTerroristasGolpeados?: number;
  periodo: string;
  tendenciaPct?: number;
  detallePuertos?: Array<{ puerto: string; toneladas: number }>;
}

export interface OecoLiveSyncData {
  lastSyncTime: string;
  sourceUrl: string;
  sourceStatus: 'LIVE_OK' | 'CACHED' | 'SYNCING' | 'ERROR';
  detectedYear2026Available: boolean;
  year2026Summary?: string;
  homicidios2025: number;
  tasaNacional2025: number;
  proyeccion2026Homicidios?: number;
  proyeccion2026Tasa?: number;
  decomisos: OecoDecomisosData;
  newBulletinsCount: number;
  lastSyncAlerts: string[];
  syncFrequencyHours: number;
}

export interface PortCorridorInfo {
  id: string;
  name: string;
  corridor: string;
  terminals: string[];
  riskScore: number;
  riskLevel: 'BAJO' | 'MODERADO' | 'ALTO' | 'CRÍTICO';
  incidentsCurrentMonth: number;
  incidentsYearToDate: number;
  monthlyTrend2026: number[];
  cantonesCriticos: string[];
  topModusOperandi: Array<{ name: string; pct: number }>;
  summary: string;
  mitigationMeasures: string[];
}

export interface ModalityCrimeStats {
  id: string;
  name: string;
  count: number;
  pct: number;
  quarterTrend: { q1: number; q2: number; q3: number; oct: number };
  riskVector: string;
  description: string;
}

export interface SupplyChainStage {
  step: number;
  stage: string;
  riskScore: number;
  riskLevel: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRÍTICO';
  vulnerabilities: string;
  securityControl: string;
}

export interface InfoTerritorioReport {
  documentTitle: string;
  documentSubtitle: string;
  organization: string;
  date: string;
  referenceCode: string;
  executiveSummary: string;
  kpis: {
    totalPortIncidentsOct2026: number;
    frustratedContaminationsPct: number;
    inspectedContainersCount: number;
    blindHookAttempts: number;
    convoyAttacks: number;
    countryRiskScore: number;
  };
  corridors: PortCorridorInfo[];
  modalities: ModalityCrimeStats[];
  supplyChain: SupplyChainStage[];
  monthlyOverallTrend2026: Array<{ month: string; incidents: number; prevented: number }>;
  strategicRecommendations: string[];
}
