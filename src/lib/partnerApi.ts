export interface PartnerMountain {
  id: string | number;
  name: string;
  district?: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  riskLevel: 'Normal' | 'Critical';
}

export interface PartnerDevice {
  id: string | number;
  latitude: number;
  longitude: number;
  status: 'Normal' | 'Critical';
  confidence?: number;
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

// Configuration resolution
const DEFAULT_URL = 'https://srs.naveennuwantha.lk';
const DEFAULT_KEY = 'sldm_live_oKriEyeDjoBVQWOTQyDDWZPFNuwmnaaq';

export function getPartnerConfig() {
  const env = (import.meta as any).env || {};
  const baseUrl = (
    env.VITE_PARTNER_FEED_URL ||
    env.NEXT_PUBLIC_PARTNER_FEED_URL ||
    DEFAULT_URL
  ).replace(/\/+$/, '');

  const apiKey =
    env.VITE_PARTNER_API_KEY ||
    env.NEXT_PUBLIC_PARTNER_API_KEY ||
    DEFAULT_KEY;

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

  const features = Array.isArray(data?.features) ? data.features : [];

  for (const feature of features) {
    const coords = feature?.geometry?.coordinates;
    if (!Array.isArray(coords) || coords.length < 2) continue;

    // GeoJSON standard: [longitude, latitude]
    const lng = Number(coords[0]);
    const lat = Number(coords[1]);

    if (!isValidCoord(lat, lng)) continue;

    const props = feature.properties || {};
    const itemType = (props.type || '').toLowerCase();
    const rawRisk = props.risk_level || props.riskLevel || props.overall_risk || props.status || '';
    const isCritical = String(rawRisk).toLowerCase().includes('crit') || String(rawRisk).toLowerCase() === 'critical';
    const normalizedRisk: 'Normal' | 'Critical' = isCritical ? 'Critical' : 'Normal';

    if (itemType === 'mountain' || props.name || props.elevation) {
      mountains.push({
        id: props.id ?? props._id ?? props.name ?? `m-${lat}-${lng}`,
        name: props.name || 'Unnamed Mountain',
        district: props.district,
        latitude: lat,
        longitude: lng,
        elevation: props.elevation ? Number(props.elevation) : undefined,
        riskLevel: normalizedRisk,
      });
    } else {
      devices.push({
        id: props.id ?? props.deviceId ?? props._id ?? `d-${lat}-${lng}`,
        latitude: lat,
        longitude: lng,
        status: normalizedRisk,
        confidence: props.confidence !== undefined ? Number(props.confidence) : undefined,
      });
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
      elevation: m.elevation ? Number(m.elevation) : undefined,
      riskLevel: isCritical ? 'Critical' : 'Normal',
    });
  }

  const rawDevices = Array.isArray(data?.devices) ? data.devices : [];
  for (const d of rawDevices) {
    const lat = Number(d.latitude ?? d.lat);
    const lng = Number(d.longitude ?? d.lng ?? d.lon);
    if (!isValidCoord(lat, lng)) continue;

    const rawStatus = d.status ?? d.risk_level ?? 'Normal';
    const isCritical = String(rawStatus).toLowerCase().includes('crit') || String(rawStatus).toLowerCase() === 'critical';

    devices.push({
      id: d.id ?? d.deviceId ?? d._id ?? `d-${lat}-${lng}`,
      latitude: lat,
      longitude: lng,
      status: isCritical ? 'Critical' : 'Normal',
      confidence: d.confidence !== undefined ? Number(d.confidence) : undefined,
    });
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
