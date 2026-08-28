export interface DirectionalRiskInfo {
  deviceId?: string;
  riskLevel?: 'Normal' | 'Critical' | string;
  confidence?: number;
  lastUpdate?: string;
}

export interface PartnerMountain {
  id: string | number;
  name: string;
  district?: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  riskLevel: 'Normal' | 'Critical';
  directionalRisks?: Record<string, DirectionalRiskInfo>;
  lastUpdate?: string;
}

export interface PartnerDevice {
  id: string | number;
  latitude?: number;
  longitude?: number;
  status: 'Normal' | 'Critical';
  confidence?: number;
  lastUpdate?: string;
  battery?: number;
  nodeStatus?: string;
  mountainName?: string;
}

export interface PartnerMapData {
  mountains: PartnerMountain[];
  devices: PartnerDevice[];
  source: 'geojson' | 'json';
  fetchedAt: Date;
}

export type FeedStatus = 'live' | 'paused' | 'error';

export interface FetchResult {
  data: PartnerMapData | null;
  status: FeedStatus;
  errorMessage: string | null;
}

// Configuration resolution from .env
const DEFAULT_URL = 'https://srs.naveennuwantha.lk';

export function getPartnerConfig() {
  const env = (import.meta as any).env || {};
  const baseUrl = (
    env.VITE_PARTNER_FEED_URL ||
    env.NEXT_PUBLIC_PARTNER_FEED_URL ||
    DEFAULT_URL
  ).replace(/\/+$/, '');

  const apiKey = (
    env.VITE_PARTNER_API_KEY ||
    env.NEXT_PUBLIC_PARTNER_API_KEY ||
    ''
  ).trim();

  return { baseUrl, apiKey };
}

function isValidCoord(lat: unknown, lng: unknown): boolean {
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (isNaN(lat) || isNaN(lng)) return false;
  if (lat === 0 && lng === 0) return false;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;
  return true;
}

function parseGeoJSON(data: any): PartnerMapData {
  const mountains: PartnerMountain[] = [];
  const devices: PartnerDevice[] = [];
  const seenDeviceIds = new Set<string>();

  const features = Array.isArray(data?.features) ? data.features : [];

  for (const feature of features) {
    const coords = feature?.geometry?.coordinates;
    const hasValidCoords = Array.isArray(coords) && coords.length >= 2;

    const lng = hasValidCoords ? Number(coords[0]) : 0;
    const lat = hasValidCoords ? Number(coords[1]) : 0;
    const coordsValid = isValidCoord(lat, lng);

    const props = feature.properties || {};
    const itemType = (props.type || '').toLowerCase();
    const rawRisk = props.risk_level || props.riskLevel || props.overall_risk || props.status || '';
    const isCritical = String(rawRisk).toLowerCase().includes('crit') || String(rawRisk).toLowerCase() === 'critical';
    const normalizedRisk: 'Normal' | 'Critical' = isCritical ? 'Critical' : 'Normal';

    if (itemType === 'mountain' || props.name || props.elevation !== undefined) {
      if (coordsValid) {
        const directionalRisks: Record<string, DirectionalRiskInfo> = {};
        if (props.directional_risks && typeof props.directional_risks === 'object') {
          for (const [dir, info] of Object.entries<any>(props.directional_risks)) {
            const dirCrit = String(info.risk_level || '').toLowerCase().includes('crit') ? 'Critical' : 'Normal';
            directionalRisks[dir] = {
              deviceId: info.device_id,
              riskLevel: dirCrit,
              confidence: info.confidence !== undefined ? Number(info.confidence) : undefined,
              lastUpdate: info.last_update,
            };

            // If device id is present, record it as a monitored sensor
            if (info.device_id && !seenDeviceIds.has(info.device_id)) {
              seenDeviceIds.add(info.device_id);
              devices.push({
                id: info.device_id,
                latitude: lat,
                longitude: lng,
                status: dirCrit,
                confidence: info.confidence !== undefined ? Number(info.confidence) : undefined,
                lastUpdate: info.last_update,
                mountainName: props.name || 'SRS Sector',
              });
            }
          }
        }

        mountains.push({
          id: props.id ?? props._id ?? props.name ?? `m-${lat}-${lng}`,
          name: props.name || 'Unnamed Mountain',
          district: props.district,
          latitude: lat,
          longitude: lng,
          elevation: props.elevation !== undefined ? Number(props.elevation) : undefined,
          riskLevel: normalizedRisk,
          directionalRisks: Object.keys(directionalRisks).length > 0 ? directionalRisks : undefined,
          lastUpdate: props.last_update || data?.metadata?.generated_at,
        });
      }
    } else {
      const devId = String(props.id ?? props.deviceId ?? props._id ?? `d-${lat}-${lng}`);
      if (!seenDeviceIds.has(devId)) {
        seenDeviceIds.add(devId);
        devices.push({
          id: devId,
          latitude: coordsValid ? lat : undefined,
          longitude: coordsValid ? lng : undefined,
          status: normalizedRisk,
          confidence: props.confidence !== undefined ? Number(props.confidence) : undefined,
          lastUpdate: props.last_update,
          nodeStatus: props.node_status,
        });
      }
    }
  }

  return {
    mountains,
    devices,
    source: 'geojson',
    fetchedAt: new Date(),
  };
}

function parseJSON(data: any): PartnerMapData {
  const mountains: PartnerMountain[] = [];
  const devices: PartnerDevice[] = [];
  const seenDeviceIds = new Set<string>();

  const rawMountains = Array.isArray(data?.mountains) ? data.mountains : [];
  for (const m of rawMountains) {
    const lat = Number(m.latitude ?? m.lat);
    const lng = Number(m.longitude ?? m.lng ?? m.lon);
    if (!isValidCoord(lat, lng)) continue;

    const rawRisk = m.overall_risk ?? m.risk_level ?? m.riskLevel ?? m.status ?? 'Normal';
    const isCritical = String(rawRisk).toLowerCase().includes('crit') || String(rawRisk).toLowerCase() === 'critical';

    mountains.push({
      id: m.id ?? m._id ?? m.name ?? `m-${lat}-${lng}`,
      name: m.name || 'Unnamed Mountain',
      district: m.district,
      latitude: lat,
      longitude: lng,
      elevation: m.elevation !== undefined ? Number(m.elevation) : undefined,
      riskLevel: isCritical ? 'Critical' : 'Normal',
      lastUpdate: m.last_update || data?.generated_at,
    });
  }

  const rawDevices = Array.isArray(data?.devices) ? data.devices : [];
  for (const d of rawDevices) {
    const lat = Number(d.latitude ?? d.lat);
    const lng = Number(d.longitude ?? d.lng ?? d.lon);
    const hasValid = isValidCoord(lat, lng);

    const rawStatus = d.status ?? d.risk_level ?? 'Normal';
    const isCritical = String(rawStatus).toLowerCase().includes('crit') || String(rawStatus).toLowerCase() === 'critical';
    const devId = String(d.id ?? d.deviceId ?? d._id ?? `d-${lat}-${lng}`);

    if (!seenDeviceIds.has(devId)) {
      seenDeviceIds.add(devId);
      devices.push({
        id: devId,
        latitude: hasValid ? lat : undefined,
        longitude: hasValid ? lng : undefined,
        status: isCritical ? 'Critical' : 'Normal',
        confidence: d.confidence !== undefined ? Number(d.confidence) : undefined,
        lastUpdate: d.last_update,
        battery: d.battery !== null && d.battery !== undefined ? Number(d.battery) : undefined,
        nodeStatus: d.node_status,
      });
    }
  }

  return {
    mountains,
    devices,
    source: 'json',
    fetchedAt: new Date(),
  };
}

async function attemptFetch(url: string, apiKey: string, useHeaders: boolean, signal: AbortSignal): Promise<Response> {
  const headers: HeadersInit = {
    'Accept': 'application/json, application/geo+json',
  };
  if (useHeaders) {
    headers['X-API-Key'] = apiKey;
  }
  return fetch(url, {
    method: 'GET',
    headers,
    signal,
  });
}

export async function fetchPartnerMapData(): Promise<FetchResult> {
  const { baseUrl, apiKey } = getPartnerConfig();

  if (!apiKey) {
    return {
      data: null,
      status: 'error',
      errorMessage: 'Partner API key is missing. Please set VITE_PARTNER_API_KEY in your .env file.',
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second timeout

  // Build candidate URL paths: direct first, then proxies if on localhost
  const candidateBases: { base: string; isProxy: boolean }[] = [
    { base: baseUrl, isProxy: false }
  ];

  // If in browser environment, include local proxies as fallbacks
  if (typeof window !== 'undefined') {
    candidateBases.push({ base: '/partner-proxy', isProxy: true });
    candidateBases.push({ base: '/api/partner', isProxy: true });
  }

  let lastErrorMsg: string | null = null;

  for (const { base, isProxy } of candidateBases) {
    const isDirectRemote = base.startsWith('http') && !base.includes(window?.location?.host || '');
    // For direct cross-origin browser requests, avoid custom headers to prevent preflight failures
    const useHeaders = !isDirectRemote;

    const geojsonUrl = base === '/api/partner'
      ? `/api/partner/geojson?api_key=${encodeURIComponent(apiKey)}`
      : `${base}/partner/geojson?api_key=${encodeURIComponent(apiKey)}`;

    const jsonUrl = base === '/api/partner'
      ? `/api/partner/map-data?api_key=${encodeURIComponent(apiKey)}`
      : `${base}/partner/map-data?api_key=${encodeURIComponent(apiKey)}`;

    try {
      let response: Response;
      try {
        response = await attemptFetch(geojsonUrl, apiKey, useHeaders, controller.signal);
      } catch (err: any) {
        // Fallback to JSON endpoint or next candidate on CORS/network failure
        if (!isProxy) continue;
        throw err;
      }

      if (response.status === 403) {
        clearTimeout(timeoutId);
        return {
          data: null,
          status: 'paused',
          errorMessage: 'Partner feed paused (owner turned sharing off)',
        };
      }

      const contentType = response.headers.get('content-type') || '';
      if (!response.ok || contentType.includes('text/html')) {
        // Fallback to jsonUrl if GeoJSON is 404 or returning HTML
        try {
          response = await attemptFetch(jsonUrl, apiKey, useHeaders, controller.signal);
        } catch (err: any) {
          if (!isProxy) continue;
          throw err;
        }

        if (response.status === 403) {
          clearTimeout(timeoutId);
          return {
            data: null,
            status: 'paused',
            errorMessage: 'Partner feed paused (owner turned sharing off)',
          };
        }

        const jsonContentType = response.headers.get('content-type') || '';
        if (!response.ok || jsonContentType.includes('text/html')) {
          lastErrorMsg = 'Partner API not reachable on this URL';
          continue;
        }
      }

      const rawData = await response.json();
      clearTimeout(timeoutId);

      if (rawData && rawData.type === 'FeatureCollection') {
        const parsed = parseGeoJSON(rawData);
        return {
          data: parsed,
          status: 'live',
          errorMessage: null,
        };
      } else if (rawData && (rawData.mountains || rawData.devices)) {
        const parsed = parseJSON(rawData);
        return {
          data: parsed,
          status: 'live',
          errorMessage: null,
        };
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        clearTimeout(timeoutId);
        return {
          data: null,
          status: 'error',
          errorMessage: 'Connection to partner API timed out (8s limit reached)',
        };
      }
      lastErrorMsg = err?.message || 'Network error connecting to partner feed';
    }
  }

  clearTimeout(timeoutId);
  return {
    data: null,
    status: 'error',
    errorMessage: lastErrorMsg || 'Partner API not reachable on this URL',
  };
}
