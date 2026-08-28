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
  Layers
} from 'lucide-react';
import {
  fetchPartnerMapData,
  PartnerMapData,
  FeedStatus,
  PartnerMountain,
  PartnerDevice
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

export function PartnerMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const markerMapRef = useRef<Map<string, L.CircleMarker>>(new Map());
  const hasFittedBoundsRef = useRef(false);

  const [data, setData] = useState<PartnerMapData | null>(null);
  const [status, setStatus] = useState<FeedStatus>('live');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Layer filters
  const [showMountains, setShowMountains] = useState(true);
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

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
      markerMapRef.current.clear();
      hasFittedBoundsRef.current = false;
    };
  }, []);

  // Format popup content for mountain
  const createMountainPopup = (m: PartnerMountain): string => {
    const isCrit = m.riskLevel === 'Critical';
    return `
      <div style="font-family: var(--font-headline, sans-serif); padding: 4px 2px; min-width: 180px; color: #1e293b;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
          <div style="font-weight: 700; font-size: 14px; color: #0f172a;">${m.name}</div>
          <span style="background: ${isCrit ? '#ef4444' : '#10b981'}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase;">
            ${m.riskLevel}
          </span>
        </div>
        <div style="font-size: 12px; line-height: 1.5; color: #475569;">
          ${m.district ? `<div><strong>District:</strong> ${m.district}</div>` : ''}
          ${m.elevation ? `<div><strong>Elevation:</strong> ${m.elevation.toLocaleString()} m</div>` : ''}
          <div><strong>Location:</strong> ${m.latitude.toFixed(4)}, ${m.longitude.toFixed(4)}</div>
        </div>
      </div>
    `;
  };

  // Format popup content for device
  const createDevicePopup = (d: PartnerDevice): string => {
    const isCrit = d.status === 'Critical';
    const confStr = d.confidence !== undefined ? `${d.confidence.toFixed(1)}%` : 'N/A';
    return `
      <div style="font-family: var(--font-headline, sans-serif); padding: 4px 2px; min-width: 170px; color: #1e293b;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
          <div style="font-weight: 700; font-size: 13px; color: #0f172a;">Sensor: ${d.id}</div>
          <span style="background: ${isCrit ? '#ef4444' : '#10b981'}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase;">
            ${d.status}
          </span>
        </div>
        <div style="font-size: 12px; line-height: 1.5; color: #475569;">
          <div><strong>Confidence:</strong> ${confStr}</div>
          <div><strong>Location:</strong> ${d.latitude.toFixed(4)}, ${d.longitude.toFixed(4)}</div>
        </div>
      </div>
    `;
  };

  // Render & update markers in-place
  const updateMapMarkers = useCallback((mapData: PartnerMapData | null) => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const markersLayer = markersLayerRef.current;
    const markerMap = markerMapRef.current;

    if (!mapData) {
      markersLayer.clearLayers();
      markerMap.clear();
      return;
    }

    const currentKeys = new Set<string>();
    const boundsPoints: [number, number][] = [];

    // Process Mountains
    if (showMountains) {
      for (const m of mapData.mountains) {
        if (criticalOnly && m.riskLevel !== 'Critical') continue;

        const key = `mountain-${m.id}`;
        currentKeys.add(key);
        boundsPoints.push([m.latitude, m.longitude]);

        const isCrit = m.riskLevel === 'Critical';
        const color = isCrit ? '#ef4444' : '#10b981';

        let marker = markerMap.get(key);
        if (!marker) {
          marker = L.circleMarker([m.latitude, m.longitude], {
            radius: 10,
            fillColor: color,
            fillOpacity: 0.9,
            color: '#ffffff',
            weight: 2,
          });
          marker.bindPopup(createMountainPopup(m));
          markersLayer.addLayer(marker);
          markerMap.set(key, marker);
        } else {
          // Update in-place
          marker.setLatLng([m.latitude, m.longitude]);
          marker.setStyle({
            radius: 10,
            fillColor: color,
            color: '#ffffff',
            weight: 2,
            fillOpacity: 0.9,
          });
          marker.setPopupContent(createMountainPopup(m));
        }
      }
    }

    // Process Devices
    if (showDevices) {
      for (const d of mapData.devices) {
        if (criticalOnly && d.status !== 'Critical') continue;

        const key = `device-${d.id}`;
        currentKeys.add(key);
        boundsPoints.push([d.latitude, d.longitude]);

        const isCrit = d.status === 'Critical';
        const color = isCrit ? '#ef4444' : '#10b981';

        let marker = markerMap.get(key);
        if (!marker) {
          marker = L.circleMarker([d.latitude, d.longitude], {
            radius: 6,
            fillColor: color,
            fillOpacity: 0.9,
            color: '#ffffff',
            weight: 2,
          });
          marker.bindPopup(createDevicePopup(d));
          markersLayer.addLayer(marker);
          markerMap.set(key, marker);
        } else {
          // Update in-place
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

    // Remove markers that are no longer present or filtered out
    for (const [key, marker] of markerMap.entries()) {
      if (!currentKeys.has(key)) {
        markersLayer.removeLayer(marker);
        markerMap.delete(key);
      }
    }

    // Fit bounds on FIRST successful load only
    if (!hasFittedBoundsRef.current && boundsPoints.length > 0) {
      const bounds = L.latLngBounds(boundsPoints);
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
      hasFittedBoundsRef.current = true;
    }
  }, [showMountains, showDevices, criticalOnly]);

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
      // Failed or paused
      setStatus(result.status);
      setErrorMessage(result.errorMessage);
      // Retain existing data/markers on network error, but indicate status
    }

    if (isManual) setIsRefreshing(false);
  }, []);

  // Update map when data or layer filters change
  useEffect(() => {
    updateMapMarkers(data);
  }, [data, updateMapMarkers]);

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
            <h1 className="text-2xl font-bold tracking-wider text-on-surface uppercase font-headline">
              Partner Landslide Map
            </h1>
            {status === 'live' && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                LIVE FEED
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
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-semibold font-headline transition-all duration-200 border border-outline-variant/20 disabled:opacity-50"
            title="Poll partner feed now"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>

      {/* Warning/Error Banners */}
      {status === 'paused' && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400" />
          <div>
            <strong>Feed Sharing Paused:</strong> Partner feed paused (owner turned sharing off). Historical markers retained if available.
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
              {status === 'live' ? 'Connected (Live)' : status === 'paused' ? 'Paused (403)' : 'Unreachable'}
            </span>
          </div>
        </div>

        {/* Last Updated */}
        <div className="glass-panel p-3.5 rounded-xl border border-outline-variant/15 flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant text-xs">
            <span className="font-headline tracking-wide uppercase">Last Updated</span>
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-2 text-sm font-bold font-headline text-on-surface">
            {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
          </div>
        </div>

        {/* Mountain Count */}
        <div className="glass-panel p-3.5 rounded-xl border border-outline-variant/15 flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant text-xs">
            <span className="font-headline tracking-wide uppercase">Mountains</span>
            <Mountain className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-on-surface flex items-baseline gap-2">
            <span>{mountainCount}</span>
            <span className="text-[11px] font-normal text-on-surface-variant font-headline">monitored</span>
          </div>
        </div>

        {/* Device Count */}
        <div className="glass-panel p-3.5 rounded-xl border border-outline-variant/15 flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant text-xs">
            <span className="font-headline tracking-wide uppercase">Sensors</span>
            <Radio className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-on-surface flex items-baseline gap-2">
            <span>{deviceCount}</span>
            <span className="text-[11px] font-normal text-on-surface-variant font-headline">active nodes</span>
          </div>
        </div>

        {/* Critical Count */}
        <div className="glass-panel p-3.5 rounded-xl border border-outline-variant/15 flex flex-col justify-between col-span-2 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-on-surface-variant text-xs">
            <span className="font-headline tracking-wide uppercase">Critical Alerts</span>
            <AlertTriangle className={`w-4 h-4 ${totalCritical > 0 ? 'text-rose-400 animate-bounce' : 'text-emerald-400'}`} />
          </div>
          <div className="mt-2 text-xl font-bold font-mono flex items-baseline gap-2">
            <span className={totalCritical > 0 ? 'text-rose-400' : 'text-emerald-400'}>{totalCritical}</span>
            <span className="text-[11px] font-normal text-on-surface-variant font-headline">
              {totalCritical > 0 ? 'requires attention' : 'all clear'}
            </span>
          </div>
        </div>
      </div>

      {/* Map Control Bar & Toggles */}
      <div className="glass-panel p-4 rounded-xl border border-outline-variant/15 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant font-headline uppercase tracking-wider">
          <Layers className="w-4 h-4 text-primary" />
          <span>Layer Controls & Filters</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
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
          <div className="font-bold uppercase tracking-wider text-[10px] text-on-surface-variant mb-2">
            Map Legend
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex-shrink-0 inline-block shadow-sm"></span>
              <span>Mountain (Normal)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-rose-500 border-2 border-white flex-shrink-0 inline-block shadow-sm"></span>
              <span>Mountain (Critical Risk)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white flex-shrink-0 inline-block shadow-sm ml-0.5"></span>
              <span>Device Node (Normal)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white flex-shrink-0 inline-block shadow-sm ml-0.5"></span>
              <span>Device Node (Critical)</span>
            </div>
          </div>
        </div>

        {/* Full-height Leaflet Map */}
        <div
          ref={mapContainerRef}
          className="w-full h-[620px] z-0"
          style={{ minHeight: '520px' }}
        />
      </div>
    </div>
  );
}
