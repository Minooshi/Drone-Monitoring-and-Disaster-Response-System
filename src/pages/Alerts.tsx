import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../components/ui/Card';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Radio,
  Mountain,
  Clock,
  Filter,
  Search,
  RefreshCw,
  MapPin,
  Activity,
  Compass,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { fetchPartnerMapData, PartnerMapData, FeedStatus } from '../lib/partnerApi';

interface UnifiedAlertItem {
  id: string;
  sourceType: 'mountain' | 'device';
  title: string;
  location: string;
  status: 'Critical' | 'Normal';
  message: string;
  confidence?: number;
  elevation?: number;
  directionalInfo?: string;
  timestamp: string;
}

export function Alerts() {
  const [data, setData] = useState<PartnerMapData | null>(null);
  const [feedStatus, setFeedStatus] = useState<FeedStatus>('live');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'critical' | 'normal'>('all');

  const loadAlerts = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const result = await fetchPartnerMapData();
      if (result.data) {
        setData(result.data);
        setFeedStatus(result.status);
        setErrorMessage(null);
        setLastUpdated(result.data.fetchedAt);
      } else {
        setFeedStatus(result.status);
        setErrorMessage(result.errorMessage);
      }
    } catch (err: any) {
      setFeedStatus('error');
      setErrorMessage(err?.message || 'Failed to fetch threat alerts');
    } finally {
      setLoading(false);
      if (isManual) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(() => {
      loadAlerts();
    }, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, [loadAlerts]);

  // Convert raw mountain and device records from Partner API into unified alert items
  const alertItems: UnifiedAlertItem[] = React.useMemo(() => {
    if (!data) return [];
    const items: UnifiedAlertItem[] = [];

    // 1. Mountain Alerts
    for (const m of data.mountains) {
      let directionalText = '';
      if (m.directionalRisks) {
        const parts = Object.entries(m.directionalRisks).map(([dir, info]) => {
          const typedInfo = info as any;
          const conf = typedInfo?.confidence !== undefined ? ` (${(typedInfo.confidence * 100).toFixed(1)}%)` : '';
          return `${dir.toUpperCase()}: ${typedInfo?.riskLevel || 'Normal'}${conf}`;
        });
        directionalText = parts.join(' | ');
      }

      items.push({
        id: `mountain-${m.id}`,
        sourceType: 'mountain',
        title: `Mountain Sector: ${m.name}`,
        location: `${m.district ? m.district + ' · ' : ''}[${m.latitude.toFixed(2)}, ${m.longitude.toFixed(2)}]`,
        status: m.riskLevel,
        message: m.riskLevel === 'Critical'
          ? `High Landslide Vulnerability Alert for ${m.name}. Rapid slope instability detected.`
          : `Nominal conditions observed at ${m.name}. Stable geological parameters.`,
        elevation: m.elevation,
        directionalInfo: directionalText || undefined,
        timestamp: m.lastUpdate || data.fetchedAt.toISOString(),
      });
    }

    // 2. Sensor / Device Alerts
    for (const d of data.devices) {
      const isCrit = d.status === 'Critical';
      const loc = d.latitude && d.longitude
        ? `[${d.latitude.toFixed(2)}, ${d.longitude.toFixed(2)}]`
        : d.mountainName ? `Associated with ${d.mountainName}` : 'Field Sensor Grid';

      items.push({
        id: `device-${d.id}`,
        sourceType: 'device',
        title: `Sensor Node ${d.id}`,
        location: loc,
        status: d.status,
        message: isCrit
          ? `Sensor node ${d.id} reported critical ground displacement or acoustic vibration thresholds exceeded.`
          : `Telemetry nominal for sensor node ${d.id}. Operational telemetry received.`,
        confidence: d.confidence,
        timestamp: d.lastUpdate || data.fetchedAt.toISOString(),
      });
    }

    // Sort: Critical items first, then by timestamp
    return items.sort((a, b) => {
      if (a.status === 'Critical' && b.status !== 'Critical') return -1;
      if (a.status !== 'Critical' && b.status === 'Critical') return 1;
      return 0;
    });
  }, [data]);

  // Filter items based on filter buttons and search query
  const filteredAlerts = alertItems.filter(item => {
    if (selectedFilter === 'critical' && item.status !== 'Critical') return false;
    if (selectedFilter === 'normal' && item.status !== 'Normal') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q) ||
        (item.directionalInfo && item.directionalInfo.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Calculate live statistics
  const criticalCount = alertItems.filter(i => i.status === 'Critical').length;
  const normalCount = alertItems.filter(i => i.status === 'Normal').length;
  const mountainCount = data?.mountains.length ?? 0;
  const deviceCount = data?.devices.length ?? 0;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-headline font-bold text-on-surface uppercase tracking-widest">
              Alert Command Center
            </h2>
            {feedStatus === 'live' && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                SRS LIVE FEED
              </span>
            )}
            {feedStatus === 'paused' && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                FEED PAUSED
              </span>
            )}
            {feedStatus === 'error' && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                FEED OFFLINE
              </span>
            )}
          </div>
          <p className="text-[10px] font-headline font-bold text-primary tracking-[0.3em] uppercase mt-1">
            Real-time Threat Monitoring · SRS Mountain Monitoring System Partner Feed
          </p>
        </div>

        {/* Action / Search & Sync */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search threat alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface-container-low border border-outline-variant/20 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-primary/50 transition-all w-full text-on-surface"
            />
          </div>

          <button
            onClick={() => loadAlerts(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-semibold font-headline transition-all duration-200 border border-outline-variant/20 disabled:opacity-50"
            title="Poll partner feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
            <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Sync'}</span>
          </button>
        </div>
      </div>

      {/* Error & Warning Banners */}
      {feedStatus === 'error' && errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <div>
            <strong>SRS Partner Feed Notice:</strong> {errorMessage}
          </div>
        </div>
      )}

      {feedStatus === 'paused' && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400" />
          <div>
            <strong>Feed Sharing Paused:</strong> Owner turned sharing off on the partner feed.
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Live Statistics Cards & Filter Controls */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          {/* Critical Count Card */}
          <div
            onClick={() => setSelectedFilter(selectedFilter === 'critical' ? 'all' : 'critical')}
            className={`glass-panel p-4 rounded-xl border transition-all cursor-pointer ${
              selectedFilter === 'critical'
                ? 'border-rose-500 bg-rose-500/15 ring-1 ring-rose-500/50'
                : 'border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-headline font-bold text-rose-400 uppercase tracking-widest">
                    Critical Threats
                  </p>
                  <p className="text-2xl font-mono font-bold text-rose-400">{criticalCount}</p>
                </div>
              </div>
              {criticalCount > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              )}
            </div>
          </div>

          {/* Normal / Nominal Card */}
          <div
            onClick={() => setSelectedFilter(selectedFilter === 'normal' ? 'all' : 'normal')}
            className={`glass-panel p-4 rounded-xl border transition-all cursor-pointer ${
              selectedFilter === 'normal'
                ? 'border-emerald-500 bg-emerald-500/15 ring-1 ring-emerald-500/50'
                : 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-headline font-bold text-emerald-400 uppercase tracking-widest">
                  Normal / Nominal
                </p>
                <p className="text-2xl font-mono font-bold text-emerald-400">{normalCount}</p>
              </div>
            </div>
          </div>

          {/* Monitored Mountains */}
          <Card className="glass-panel p-4 rounded-xl border border-outline-variant/15">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Mountain className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-headline font-bold text-primary uppercase tracking-widest">
                  Monitored Mountains
                </p>
                <p className="text-2xl font-mono font-bold text-on-surface">{mountainCount}</p>
              </div>
            </div>
          </Card>

          {/* Active Sensor Nodes */}
          <Card className="glass-panel p-4 rounded-xl border border-outline-variant/15">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-headline font-bold text-primary uppercase tracking-widest">
                  Active Sensors
                </p>
                <p className="text-2xl font-mono font-bold text-on-surface">{deviceCount}</p>
              </div>
            </div>
          </Card>

          {/* Filter Pills */}
          <div className="glass-panel p-3.5 rounded-xl border border-outline-variant/15 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-headline uppercase font-semibold">
              <Filter className="w-3.5 h-3.5 text-primary" />
              <span>Status Filter</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`w-full py-1.5 px-3 rounded-lg text-xs font-headline font-semibold text-left transition-all ${
                  selectedFilter === 'all'
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                All Live Alerts ({alertItems.length})
              </button>
              <button
                onClick={() => setSelectedFilter('critical')}
                className={`w-full py-1.5 px-3 rounded-lg text-xs font-headline font-semibold text-left transition-all flex items-center justify-between ${
                  selectedFilter === 'critical'
                    ? 'bg-rose-500 text-white font-bold'
                    : 'bg-surface-container-low text-rose-400 hover:bg-rose-500/10'
                }`}
              >
                <span>Critical Only</span>
                <span className="font-mono">{criticalCount}</span>
              </button>
              <button
                onClick={() => setSelectedFilter('normal')}
                className={`w-full py-1.5 px-3 rounded-lg text-xs font-headline font-semibold text-left transition-all flex items-center justify-between ${
                  selectedFilter === 'normal'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-surface-container-low text-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                <span>Normal Only</span>
                <span className="font-mono">{normalCount}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Alert Feed List */}
        <div className="col-span-12 lg:col-span-9 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant font-mono uppercase tracking-widest text-xs gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-primary" />
              <span>Syncing live data from SRS Mountain Monitoring System...</span>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="glass-panel p-12 rounded-2xl border border-outline-variant/15 flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
              <h3 className="text-lg font-headline font-bold text-on-surface uppercase tracking-wider">
                No matching threat alerts
              </h3>
              <p className="text-xs text-on-surface-variant mt-1 max-w-sm">
                {searchQuery
                  ? `No alerts matching "${searchQuery}". Try adjusting your search query or filter.`
                  : 'All monitored mountain sectors and IoT telemetry sensors report nominal conditions.'}
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert, idx) => {
              const isCrit = alert.status === 'Critical';

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.3) }}
                  className={`glass-panel p-5 rounded-2xl border-l-4 flex items-start gap-4 transition-all duration-300 hover:bg-surface-container-high/80 ${
                    isCrit
                      ? 'border-l-rose-500 bg-rose-500/5 border-rose-500/20'
                      : 'border-l-emerald-500 bg-emerald-500/5 border-emerald-500/20'
                  }`}
                >
                  {/* Icon Indicator */}
                  <div
                    className={`p-3 rounded-xl flex-shrink-0 ${
                      isCrit
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {alert.sourceType === 'mountain' ? (
                      isCrit ? <ShieldAlert className="w-6 h-6 animate-pulse" /> : <Mountain className="w-6 h-6" />
                    ) : (
                      isCrit ? <AlertTriangle className="w-6 h-6 animate-pulse" /> : <Radio className="w-6 h-6" />
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-headline font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant border border-outline-variant/20">
                          {alert.sourceType.toUpperCase()}
                        </span>
                        <h3 className="text-base font-headline font-bold text-on-surface tracking-wide">
                          {alert.title}
                        </h3>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                          isCrit
                            ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30 animate-pulse'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isCrit ? 'bg-white' : 'bg-emerald-400'}`}></span>
                        {alert.status}
                      </span>
                    </div>

                    {/* Metadata row */}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-headline text-on-surface-variant mb-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span>{alert.location}</span>
                      </span>

                      {alert.elevation !== undefined && (
                        <span className="flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span>Elevation: {alert.elevation} m</span>
                        </span>
                      )}

                      {alert.confidence !== undefined && (
                        <span className="flex items-center gap-1">
                          <Compass className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span>Confidence: {(alert.confidence * 100).toFixed(1)}%</span>
                        </span>
                      )}

                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                      </span>
                    </div>

                    {/* Directional Sensor Telemetry if applicable */}
                    {alert.directionalInfo && (
                      <div className="mb-2 p-2.5 rounded-lg bg-surface-container-low/80 border border-outline-variant/15 text-[11px] font-mono text-primary flex items-center gap-2">
                        <Compass className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Directional Risk Telemetry: {alert.directionalInfo}</span>
                      </div>
                    )}

                    {/* Description Message */}
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {alert.message}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
