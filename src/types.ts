export interface Telemetry {
  battery: number;
  altitude: number;
  speed: number;
  lat: number;
  lng: number;
  signal: number;
  timer: string;
}

export interface Alert {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'SAFE';
  sourceId: string;
  location: string;
  timestamp: string;
  status: string;
  message: string;
}

export interface Victim {
  id: string;
  confidence: number;
  lat: number;
  lng: number;
  status: 'STABLE' | 'CRITICAL' | 'PENDING';
  tags: string[];
  imageUrl: string;
}
