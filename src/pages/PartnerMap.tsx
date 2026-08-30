import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Mountain,
  Radio,
  AlertTriangle,
  RefreshCw,
  Clock,
  ShieldCheck,
  Filter,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Layers,
  Compass,
  Zap
} from 'lucide-react';
import {
  fetchPartnerMapData,
  PartnerMapData,
  FeedStatus,
  PartnerMountain,
  PartnerDevice,
  DirectionalRiskInfo
} from '../lib/partnerApi';

// Ensure default leaflet icon assets are resolved properly
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const SRI_LANKA_CENTER: [number, number] = [7.8731, 80.7718];
const INITIAL_ZOOM = 7;
const POLL_INTERVAL_MS = 30000; // 30 seconds
const SECTOR_RADIUS_METERS = 1400; // 1.4 km radius for 8-directional radar coverage

interface DirectionDef {
  key: string;
  name: string;
  short: string;
  startDeg: number;
  endDeg: number;
}

const DIRECTIONS: DirectionDef[] = [
  { key: 'north', name: 'North', short: 'N', startDeg: 337.5, endDeg: 22.5 },
  { key: 'northeast', name: 'North-East', short: 'NE', startDeg: 22.5, endDeg: 67.5 },
  { key: 'east', name: 'East', short: 'E', startDeg: 67.5, endDeg: 112.5 },
  { key: 'southeast', name: 'South-East', short: 'SE', startDeg: 112.5, endDeg: 157.5 },
  { key: 'south', name: 'South', short: 'S', startDeg: 157.5, endDeg: 202.5 },
  { key: 'southwest', name: 'South-West', short: 'SW', startDeg: 202.5, endDeg: 247.5 },
  { key: 'west', name: 'West', short: 'W', startDeg: 247.5, endDeg: 292.5 },
  { key: 'northwest', name: 'North-West', short: 'NW', startDeg: 292.5, endDeg: 337.5 },
];

function getSectorPolygon(
  centerLat: number,
  centerLng: number,
  radiusMeters: number,
  startDeg: number,
  endDeg: number
): [number, number][] {
  const points: [number, number][] = [[centerLat, centerLng]];
  const R = 6378137; // Earth radius in meters

  let start = startDeg;
  let end = endDeg;
  if (end < start) end += 360;

  const steps = 8;
  const stepSize = (end - start) / steps;

  for (let i = 0; i <= steps; i++) {
    const angle = (start + i * stepSize) % 360;
    const rad = (angle * Math.PI) / 180;
    const dByR = radiusMeters / R;
    const latRad = (centerLat * Math.PI) / 180;
    const lngRad = (centerLng * Math.PI) / 180;

    const newLatRad = Math.asin(
      Math.sin(latRad) * Math.cos(dByR) +
      Math.cos(latRad) * Math.sin(dByR) * Math.cos(rad)
    );
    const newLngRad = lngRad + Math.atan2(
      Math.sin(rad) * Math.sin(dByR) * Math.cos(latRad),
      Math.cos(dByR) - Math.sin(latRad) * Math.sin(newLatRad)
    );

    points.push([(newLatRad * 180) / Math.PI, (newLngRad * 180) / Math.PI]);
  }

  points.push([centerLat, centerLng]);
  return points;
}

function findDirectionRisk(
  directionalRisks: Record<string, DirectionalRiskInfo> | undefined,
  dirKey: string
): DirectionalRiskInfo | undefined {
  if (!directionalRisks) return undefined;
  const lowerKey = dirKey.toLowerCase();
  for (const [k, v] of Object.entries(directionalRisks)) {
    const lk = k.toLowerCase().replace(/[^a-z]/g, '');
    if (lk === lowerKey) return v;
    if (lowerKey === 'north' && (lk === 'n' || lk === 'north')) return v;
    if (lowerKey === 'northeast' && (lk === 'ne' || lk === 'northeast' || lk === 'north_east')) return v;
    if (lowerKey === 'east' && (lk === 'e' || lk === 'east')) return v;
    if (lowerKey === 'southeast' && (lk === 'se' || lk === 'southeast' || lk === 'south_east')) return v;
    if (lowerKey === 'south' && (lk === 's' || lk === 'south')) return v;
    if (lowerKey === 'southwest' && (lk === 'sw' || lk === 'southwest' || lk === 'south_west')) return v;
    if (lowerKey === 'west' && (lk === 'w' || lk === 'west')) return v;
    if (lowerKey === 'northwest' && (lk === 'nw' || lk === 'northwest' || lk === 'north_west')) return v;
  }
  return undefined;
}

export function PartnerMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);
  const layerItemsRef = useRef<Map<string, L.Layer>>(new Map());
  const hasFittedBoundsRef = useRef(false);

  const [data, setData] = useState<PartnerMapData | null>(null);
  const [status, setStatus] = useState<FeedStatus>('live');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Layer filters
  const [showMountains, setShowMountains] = useState(true);
  const [showSectors, setShowSectors] = useState(true);
  const [showDevices, setShowDevices] = useState(true);
  const [criticalOnly, setCriticalOnly] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: SRI_LANKA_CENTER,
      zoom: INITIAL_ZOOM,
      zoomControl: true,
      attributionControl: true,
    });

    // Dark/Standard OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const layersGroup = L.layerGroup().addTo(map);
    layersGroupRef.current = layersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      layersGroupRef.current = null;
      layerItemsRef.current.clear();
      hasFittedBoundsRef.current = false;
    };
  }, []);

  // Format popup content for mountain center
  const createMountainPopup = (m: PartnerMountain, maxScore: number, hasCrit: boolean): string => {
    const isCrit = m.riskLevel === 'Critical' || hasCrit;

    let dirGridHtml = '';
    for (const dir of DIRECTIONS) {
      const risk = findDirectionRisk(m.directionalRisks, dir.key);
      const isDirCrit = risk && String(risk.riskLevel || '').toLowerCase().includes('crit');
      const hasSensor = !!risk?.deviceId;

      dirGridHtml += `
        <div style="background: ${isDirCrit ? '#fef2f2' : '#f0fdf4'}; border: 1px solid ${isDirCrit ? '#fca5a5' : '#bbf7d0'}; border-radius: 4px; padding: 4px 6px; text-align: center;">
          <div style="font-size: 9px; font-weight: 700; color: ${isDirCrit ? '#991b1b' : '#166534'};">${dir.short}</div>
          <div style="font-size: 8px; color: ${isDirCrit ? '#dc2626' : '#15803d'}; font-weight: 600;">
            ${hasSensor ? (risk?.confidence !== undefined ? `${(risk.confidence * 100).toFixed(0)}%` : 'Active') : 'Nominal'}
          </div>
        </div>
      `;
    }

    return `
      <div style="font-family: var(--font-headline, sans-serif); padding: 4px 2px; min-width: 210px; color: #1e293b;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
          <div style="font-weight: 700; font-size: 14px; color: #0f172a;">${m.name}</div>
          <span style="background: ${isCrit ? '#ef4444' : '#10b981'}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase;">
            ${isCrit ? 'Critical' : 'Normal'}
          </span>
        </div>
        <div style="font-size: 11px; line-height: 1.5; color: #475569; margin-bottom: 8px;">
          ${m.district ? `<div><strong>District:</strong> ${m.district}</div>` : ''}
          ${m.elevation !== undefined ? `<div><strong>Elevation:</strong> ${m.elevation} m</div>` : ''}
          <div><strong>Coordinates:</strong> ${m.latitude.toFixed(4)}, ${m.longitude.toFixed(4)}</div>
          <div><strong>Max Threat Index:</strong> <span style="color: ${isCrit ? '#dc2626' : '#16a34a'}; font-weight: 700;">${maxScore > 0 ? `${maxScore}%` : 'Nominal'}</span></div>
        </div>

        <div style="font-size: 10px; font-weight: 700; color: #334155; margin-bottom: 4px; text-transform: uppercase;">
          8-Directional Radar Telemetry
        </div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;">
          ${dirGridHtml}
        </div>
      </div>
    `;
  };

  // Format popup content for directional sector
  const createSectorPopup = (
    m: PartnerMountain,
    dir: DirectionDef,
    risk: DirectionalRiskInfo | undefined
  ): string => {
    const isCrit = risk && String(risk.riskLevel || '').toLowerCase().includes('crit');
    const hasSensor = !!risk?.deviceId;
    const confStr = risk?.confidence !== undefined ? `${(risk.confidence * 100).toFixed(1)}%` : 'Nominal';

    return `
      <div style="font-family: var(--font-headline, sans-serif); padding: 4px 2px; min-width: 190px; color: #1e293b;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
          <div style="font-weight: 700; font-size: 13px; color: #0f172a;">${dir.name} Sector (${dir.short})</div>
          <span style="background: ${isCrit ? '#ef4444' : '#10b981'}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 700; text-transform: uppercase;">
            ${isCrit ? 'Critical' : 'Normal'}
          </span>
        </div>
        <div style="font-size: 11px; line-height: 1.5; color: #475569;">
          <div><strong>Mountain:</strong> ${m.name}</div>
          <div><strong>Sensor Node:</strong> ${hasSensor ? `<code style="background:#e2e8f0; padding:1px 4px; border-radius:3px;">${risk?.deviceId}</code>` : 'Grid Monitored'}</div>
          <div><strong>Threat Confidence:</strong> <span style="color: ${isCrit ? '#dc2626' : '#16a34a'}; font-weight: 700;">${confStr}</span></div>
          ${risk?.lastUpdate ? `<div><strong>Last Telemetry:</strong> ${new Date(risk.lastUpdate).toLocaleTimeString()}</div>` : ''}
        </div>
      </div>
    `;
  };

  // Format popup content for device
  const createDevicePopup = (d: PartnerDevice): string => {
    const isCrit = d.status === 'Critical';
    const confStr = d.confidence !== undefined ? `${(d.confidence * 100).toFixed(1)}%` : 'N/A';
    return `
      <div style="font-family: var(--font-headline, sans-serif); padding: 4px 2px; min-width: 170px; color: #1e293b;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
          <div style="font-weight: 700; font-size: 13px; color: #0f172a;">Sensor: ${d.id}</div>
          <span style="background: ${isCrit ? '#ef4444' : '#10b981'}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase;">
            ${d.status}
          </span>
        </div>
        <div style="font-size: 12px; line-height: 1.5; color: #475569;">
          ${d.mountainName ? `<div><strong>Sector:</strong> ${d.mountainName}</div>` : ''}
          <div><strong>Confidence:</strong> ${confStr}</div>
          ${d.latitude && d.longitude ? `<div><strong>Location:</strong> ${d.latitude.toFixed(4)}, ${d.longitude.toFixed(4)}</div>` : ''}
          ${d.battery !== undefined ? `<div><strong>Battery:</strong> ${d.battery}%</div>` : ''}
        </div>
      </div>
    `;
  };

  // Render & update markers in-place
  const updateMapLayers = useCallback((mapData: PartnerMapData | null) => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;
    const layersGroup = layersGroupRef.current;
    const layerItems = layerItemsRef.current;

    if (!mapData) {
      layersGroup.clearLayers();
      layerItems.clear();
      return;
    }

    const currentKeys = new Set<string>();
    const boundsPoints: [number, number][] = [];

    // Process Mountains and 8-Directional Radar Sectors
    if (showMountains) {
      for (const m of mapData.mountains) {
        let maxConfidenceScore = 0;
        let hasCriticalDirection = m.riskLevel === 'Critical';

        if (m.directionalRisks) {
          for (const info of Object.values(m.directionalRisks)) {
            if (info.confidence !== undefined) {
              const score = Math.round(info.confidence * 100);
              if (score > maxConfidenceScore) maxConfidenceScore = score;
            }
            if (String(info.riskLevel || '').toLowerCase().includes('crit')) {
              hasCriticalDirection = true;
            }
          }
        }

        if (criticalOnly && !hasCriticalDirection) continue;

        boundsPoints.push([m.latitude, m.longitude]);

        // 1. Draw 8 Directional Radar Sectors around the Mountain
        if (showSectors) {
          for (const dir of DIRECTIONS) {
            const sectorKey = `mountain-${m.id}-sector-${dir.key}`;
            currentKeys.add(sectorKey);

            const risk = findDirectionRisk(m.directionalRisks, dir.key);
            const isDirCrit = risk && String(risk.riskLevel || '').toLowerCase().includes('crit');

            // Colors matching the attached image:
            // Critical: semi-transparent red sector (rgba(239, 68, 68, 0.45)), green ray outline (#22c55e)
            // Normal: semi-transparent dark green sector (rgba(16, 185, 129, 0.25)), bright green rays (#22c55e)
            const sectorCoords = getSectorPolygon(
              m.latitude,
              m.longitude,
              SECTOR_RADIUS_METERS,
              dir.startDeg,
              dir.endDeg
            );

            const fillColor = isDirCrit ? '#ef4444' : '#10b981';
            const fillOpacity = isDirCrit ? 0.45 : 0.22;
            const strokeColor = '#22c55e'; // Bright green radial rays matching radar design

            let polygon = layerItems.get(sectorKey) as L.Polygon | undefined;
            if (!polygon) {
              polygon = L.polygon(sectorCoords, {
                fillColor,
                fillOpacity,
                color: strokeColor,
                weight: 2,
                opacity: 0.9,
              });
              polygon.bindPopup(createSectorPopup(m, dir, risk));
              layersGroup.addLayer(polygon);
              layerItems.set(sectorKey, polygon);
            } else {
              polygon.setLatLngs(sectorCoords);
              polygon.setStyle({
                fillColor,
                fillOpacity,
                color: strokeColor,
                weight: 2,
                opacity: 0.9,
              });
              polygon.setPopupContent(createSectorPopup(m, dir, risk));
            }
          }
        }

        // 2. Center Mountain Circular Radar Badge (with score e.g. "82")
        const centerKey = `mountain-${m.id}-center`;
        currentKeys.add(centerKey);

        const isCritCenter = hasCriticalDirection;
        const displayLabel = maxConfidenceScore > 0 ? String(maxConfidenceScore) : (isCritCenter ? '!' : '✓');

        const centerIconHtml = `
          <div style="
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: ${isCritCenter ? 'rgba(239, 68, 68, 0.85)' : 'rgba(16, 185, 129, 0.85)'};
            border: 2px solid ${isCritCenter ? '#fca5a5' : '#86efac'};
            color: #ffffff;
            font-family: var(--font-headline, sans-serif);
            font-size: 12px;
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 12px ${isCritCenter ? 'rgba(239, 68, 68, 0.7)' : 'rgba(16, 185, 129, 0.5)'};
            cursor: pointer;
            transition: transform 0.2s;
          ">
            ${displayLabel}
          </div>
        `;

        const centerDivIcon = L.divIcon({
          className: 'radar-center-badge',
          html: centerIconHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        let centerMarker = layerItems.get(centerKey) as L.Marker | undefined;
        if (!centerMarker) {
          centerMarker = L.marker([m.latitude, m.longitude], { icon: centerDivIcon });
          centerMarker.bindPopup(createMountainPopup(m, maxConfidenceScore, hasCriticalDirection));
          layersGroup.addLayer(centerMarker);
          layerItems.set(centerKey, centerMarker);
        } else {
          centerMarker.setLatLng([m.latitude, m.longitude]);
          centerMarker.setIcon(centerDivIcon);
          centerMarker.setPopupContent(createMountainPopup(m, maxConfidenceScore, hasCriticalDirection));
        }
      }
    }

    // Process Standalone Devices
    if (showDevices) {
      for (const d of mapData.devices) {
        if (!d.latitude || !d.longitude) continue;
        if (criticalOnly && d.status !== 'Critical') continue;

        const key = `device-${d.id}`;
        currentKeys.add(key);
        boundsPoints.push([d.latitude, d.longitude]);

        const isCrit = d.status === 'Critical';
        const color = isCrit ? '#ef4444' : '#10b981';

        let marker = layerItems.get(key) as L.CircleMarker | undefined;
        if (!marker) {
          marker = L.circleMarker([d.latitude, d.longitude], {
            radius: 6,
            fillColor: color,
            fillOpacity: 0.9,
            color: '#ffffff',
            weight: 2,
          });
          marker.bindPopup(createDevicePopup(d));
          layersGroup.addLayer(marker);
          layerItems.set(key, marker);
        } else {
          marker.setLatLng([d.latitude, d.longitude]);
          marker.setStyle({
            radius: 6,
            fillColor: color,
            color: '#ffffff',
            weight: 2,
            fillOpacity: 0.9,
          });
          marker.setPopupContent(createDevicePopup(d));
        }
      }
    }

    // Remove obsolete layers
    for (const [key, layer] of layerItems.entries()) {
      if (!currentKeys.has(key)) {
        layersGroup.removeLayer(layer);
        layerItems.delete(key);
      }
    }

    // Fit bounds on FIRST successful load only
    if (!hasFittedBoundsRef.current && boundsPoints.length > 0) {
      const bounds = L.latLngBounds(boundsPoints);
      mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 13 });
      hasFittedBoundsRef.current = true;
    }
  }, [showMountains, showSectors, showDevices, criticalOnly]);

  // Fetch data function
  const loadFeedData = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);

    const result = await fetchPartnerMapData();

    if (result.data) {
      setData(result.data);
      setStatus(result.status);
      setErrorMessage(null);
      setLastUpdated(result.data.fetchedAt);
    } else {
      setStatus(result.status);
      setErrorMessage(result.errorMessage);
    }

    if (isManual) setIsRefreshing(false);
  }, []);

  // Update map when data or layer filters change
  useEffect(() => {
    updateMapLayers(data);
  }, [data, updateMapLayers]);

  // Polling loop every 30 seconds
  useEffect(() => {
    loadFeedData();

    const intervalId = setInterval(() => {
      loadFeedData();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [loadFeedData]);

  // Statistics calculation
  const mountainCount = data?.mountains.length ?? 0;
  const deviceCount = data?.devices.length ?? 0;
  const criticalMountainCount = data?.mountains.filter(m => m.riskLevel === 'Critical').length ?? 0;
  const criticalDeviceCount = data?.devices.filter(d => d.status === 'Critical').length ?? 0;
  const totalCritical = criticalMountainCount + criticalDeviceCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-wider text-on-surface uppercase font-headline flex items-center gap-2">
              <Compass className="w-7 h-7 text-primary animate-spin-slow" />
              Partner 8-Directional Landslide Map
            </h1>
            {status === 'live' && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                SRS LIVE RADAR
              </span>
            )}
            {status === 'paused' && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                FEED PAUSED
              </span>
            )}
            {status === 'error' && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                FEED ERROR
              </span>
            )}
          </div>
          <p className="text-xs text-on-surface-variant tracking-wide font-headline mt-1">
            Live read-only feed from Sri Lanka Disaster Monitor · Leaflet | © OpenStreetMap
          </p>
        </div>

        {/* Action / Refresh */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadFeedData(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-semibold font-headline transition-all duration-200 border border-outline-variant/20 disabled:opacity-50 shadow-md"
            title="Poll partner feed now"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Live Data'}</span>
          </button>
        </div>
      </div>

      {/* Warning/Error Banners */}
      {status === 'paused' && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400" />
          <div>
            <strong>Feed Sharing Paused:</strong> Partner feed paused (owner turned sharing off).
          </div>
        </div>
      )}

      {status === 'error' && errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <div>
            <strong>Feed Connection Issue:</strong> {errorMessage}
            {lastUpdated && (
              <span className="block text-xs text-rose-300/80 mt-0.5">
                Displaying last valid snapshot from {lastUpdated.toLocaleTimeString()}.
              </span>
            )}
          </div>
        </div>
      )}

      {/* Top Status Bar & Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Status */}
        <div className="glass-panel p-3.5 rounded-xl border border-outline-variant/15 flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant text-xs">
            <span className="font-headline tracking-wide uppercase">Feed State</span>
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${status === 'live' ? 'bg-emerald-500' : status === 'paused' ? 'bg-amber-500' : 'bg-rose-500'}`} />
            <span className="text-sm font-bold font-headline capitalize text-on-surface">
              {status === 'live' ? 'Live Connected' : status === 'paused' ? 'Paused (403)' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Last Updated */}
        <div className="glass-panel p-3.5 rounded-xl border border-outline-variant/15 flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant text-xs">
            <span className="font-headline tracking-wide uppercase">Last Telemetry</span>
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-2 text-sm font-bold font-headline text-on-surface">
            {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
          </div>
        </div>

        {/* Mountain Count */}
        <div className="glass-panel p-3.5 rounded-xl border border-outline-variant/15 flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant text-xs">
            <span className="font-headline tracking-wide uppercase">Monitored Sectors</span>
            <Mountain className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-on-surface flex items-baseline gap-2">
            <span>{mountainCount}</span>
            <span className="text-[11px] font-normal text-on-surface-variant font-headline">mountains</span>
          </div>
        </div>

        {/* Device Count */}
        <div className="glass-panel p-3.5 rounded-xl border border-outline-variant/15 flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant text-xs">
            <span className="font-headline tracking-wide uppercase">Active Sensors</span>
            <Radio className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-on-surface flex items-baseline gap-2">
            <span>{deviceCount}</span>
            <span className="text-[11px] font-normal text-on-surface-variant font-headline">nodes</span>
          </div>
        </div>

        {/* Critical Count */}
        <div className="glass-panel p-3.5 rounded-xl border border-outline-variant/15 flex flex-col justify-between col-span-2 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-on-surface-variant text-xs">
            <span className="font-headline tracking-wide uppercase">Critical Threats</span>
            <AlertTriangle className={`w-4 h-4 ${totalCritical > 0 ? 'text-rose-400 animate-bounce' : 'text-emerald-400'}`} />
          </div>
          <div className="mt-2 text-xl font-bold font-mono flex items-baseline gap-2">
            <span className={totalCritical > 0 ? 'text-rose-400' : 'text-emerald-400'}>{totalCritical}</span>
            <span className="text-[11px] font-normal text-on-surface-variant font-headline">
              {totalCritical > 0 ? 'action required' : 'nominal'}
            </span>
          </div>
        </div>
      </div>

      {/* Map Control Bar & Toggles */}
      <div className="glass-panel p-4 rounded-xl border border-outline-variant/15 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant font-headline uppercase tracking-wider">
          <Layers className="w-4 h-4 text-primary" />
          <span>Radar Layers & Filters</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Toggle 8-Directional Sectors */}
          <button
            onClick={() => setShowSectors(!showSectors)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold font-headline transition-all duration-200 border ${
              showSectors
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 ring-1 ring-emerald-500/30'
                : 'bg-surface-container-low text-on-surface-variant border-outline-variant/20 opacity-60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>8-Directional Radar</span>
          </button>

          {/* Toggle Mountains */}
          <button
            onClick={() => setShowMountains(!showMountains)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold font-headline transition-all duration-200 border ${
              showMountains
                ? 'bg-primary/20 text-primary border-primary/40'
                : 'bg-surface-container-low text-on-surface-variant border-outline-variant/20 opacity-60'
            }`}
          >
            {showMountains ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Mountains ({mountainCount})</span>
          </button>

          {/* Toggle Devices */}
          <button
            onClick={() => setShowDevices(!showDevices)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold font-headline transition-all duration-200 border ${
              showDevices
                ? 'bg-primary/20 text-primary border-primary/40'
                : 'bg-surface-container-low text-on-surface-variant border-outline-variant/20 opacity-60'
            }`}
          >
            {showDevices ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Sensor Nodes ({deviceCount})</span>
          </button>

          {/* Critical Only Filter */}
          <button
            onClick={() => setCriticalOnly(!criticalOnly)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold font-headline transition-all duration-200 border ${
              criticalOnly
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 ring-1 ring-rose-500/30'
                : 'bg-surface-container-low text-on-surface-variant border-outline-variant/20'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Critical Only</span>
            {criticalOnly && <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>}
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-outline-variant/20 glass-panel shadow-2xl">
        {/* Decorative HUD Corners */}
        <div className="absolute top-2 left-2 hud-corner border-t-2 border-l-2 pointer-events-none z-10 opacity-70"></div>
        <div className="absolute top-2 right-2 hud-corner border-t-2 border-r-2 pointer-events-none z-10 opacity-70"></div>
        <div className="absolute bottom-2 left-2 hud-corner border-b-2 border-l-2 pointer-events-none z-10 opacity-70"></div>
        <div className="absolute bottom-2 right-2 hud-corner border-b-2 border-r-2 pointer-events-none z-10 opacity-70"></div>

        {/* Map Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-surface/90 backdrop-blur-md p-3 rounded-xl border border-outline-variant/30 text-xs font-headline shadow-lg text-on-surface max-w-xs pointer-events-auto">
          <div className="font-bold uppercase tracking-wider text-[10px] text-on-surface-variant mb-2 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span>8-Directional Radar Legend</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-sm bg-emerald-500/40 border border-emerald-400 flex-shrink-0 inline-block shadow-sm"></span>
              <span>Nominal Direction Sector</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-sm bg-rose-500/50 border border-rose-400 flex-shrink-0 inline-block shadow-sm"></span>
              <span>Critical Risk Sector (Sensor Alert)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-rose-500 border border-white text-[9px] font-bold text-white flex items-center justify-center flex-shrink-0">82</span>
              <span>Center Badge: Max Threat Index</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white flex-shrink-0 inline-block shadow-sm ml-0.5"></span>
              <span>Sensor Node Location</span>
            </div>
          </div>
        </div>

        {/* Full-height Leaflet Map */}
        <div
          ref={mapContainerRef}
          className="w-full h-[650px] z-0"
          style={{ minHeight: '520px' }}
        />
      </div>
    </div>
  );
}
