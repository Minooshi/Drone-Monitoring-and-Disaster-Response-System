import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  Filter, 
  Activity,
  Users,
  Clock,
  Zap,
  Plus,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area
} from 'recharts';
import { cn } from '../lib/utils';

const MISSION_DATA = [
  { name: 'Mon', missions: 4, victims: 12, success: 85 },
  { name: 'Tue', missions: 6, victims: 18, success: 92 },
  { name: 'Wed', missions: 3, victims: 8, success: 88 },
  { name: 'Thu', missions: 8, victims: 24, success: 95 },
  { name: 'Fri', missions: 5, victims: 15, success: 90 },
  { name: 'Sat', missions: 7, victims: 21, success: 94 },
  { name: 'Sun', missions: 9, victims: 28, success: 96 },
];

const PERFORMANCE_DATA = [
  { time: '00:00', load: 30, temp: 42 },
  { time: '04:00', load: 25, temp: 40 },
  { time: '08:00', load: 65, temp: 48 },
  { time: '12:00', load: 85, temp: 55 },
  { time: '16:00', load: 70, temp: 52 },
  { time: '20:00', load: 45, temp: 45 },
  { time: '23:59', load: 35, temp: 43 },
];

export function Analytics() {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newMission, setNewMission] = useState({
    missionId: '',
    location: '',
    victims: 0,
    status: 'In Progress',
    disasterType: 'Medical'
  });

  const generateMissionId = (existingMissions: any[]) => {
    const year = new Date().getFullYear();
    const count = existingMissions.length + 1;
    const paddedCount = String(count).padStart(3, '0');
    return `MSN-${year}-${paddedCount}`;
  };

  const fetchMissions = () => {
    fetch('/api/missions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMissions(data);
          setNewMission(prev => ({ ...prev, missionId: generateMissionId(data) }));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching missions:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const handleCreateMission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMission)
      });
      if (res.ok) {
        setShowModal(false);
        setNewMission({ missionId: '', location: '', victims: 0, status: 'In Progress', disasterType: 'Medical' });
        fetchMissions();
      }
    } catch (err) {
      console.error('Error creating mission:', err);
    }
  };

  const handleStatusUpdate = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'In Progress' ? 'Completed' : 'In Progress';
    try {
      const res = await fetch(`/api/missions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchMissions();
      }
    } catch (err) {
      console.error('Error updating mission status:', err);
    }
  };

  const totalVictims = missions.reduce((acc, m) => acc + (m.victims || 0), 0);
  const totalMissions = missions.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-headline font-bold text-on-surface uppercase tracking-widest">Mission Analytics</h2>
          <p className="text-[10px] font-headline font-bold text-primary tracking-[0.3em] uppercase mt-1">Strategic Performance Metrics</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-secondary text-on-secondary font-headline text-[10px] font-bold uppercase tracking-widest rounded-xl hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-secondary/20"
          >
            <Plus className="w-3.5 h-3.5" /> Add New Entry
          </button>
          <button className="px-4 py-2 bg-primary text-on-primary font-headline text-[10px] font-bold uppercase tracking-widest rounded-xl hover:brightness-110 transition-all flex items-center gap-2">
            <Download className="w-3.5 h-3.5" /> Export Report
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Missions" icon={Zap}>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-headline font-bold text-on-surface">{totalMissions}</span>
            <span className="text-[10px] font-bold text-secondary flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
        </Card>
        <Card title="Lives Saved" icon={Users}>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-headline font-bold text-on-surface">{totalVictims}</span>
            <span className="text-[10px] font-bold text-secondary flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +8%
            </span>
          </div>
        </Card>
        <Card title="Avg Response" icon={Clock}>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-headline font-bold text-on-surface">4.2m</span>
            <span className="text-[10px] font-bold text-secondary flex items-center gap-0.5">
              <TrendingDown className="w-3 h-3" /> -1.5m
            </span>
          </div>
        </Card>
        <Card title="System Uptime" icon={Activity}>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-headline font-bold text-on-surface">99.9%</span>
            <span className="text-[10px] font-bold text-secondary">STABLE</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Mission Volume Chart */}
        <div className="col-span-12 lg:col-span-8">
          <Card title="Mission Volume & Success Rate" icon={BarChart3} className="h-[450px]">
            <div className="h-full w-full pt-8">
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={MISSION_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#888" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#888" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '10px', textTransform: 'uppercase' }}
                  />
                  <Bar dataKey="missions" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="victims" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* System Performance */}
        <div className="col-span-12 lg:col-span-4">
          <Card title="System Performance" icon={Activity} className="h-[450px]">
            <div className="h-full w-full pt-8">
              <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={PERFORMANCE_DATA}>
                  <defs>
                    <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#888" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#888" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '10px', textTransform: 'uppercase' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="load" 
                    stroke="var(--color-primary)" 
                    fillOpacity={1} 
                    fill="url(#colorLoad)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Detailed Table */}
      <Card title="Recent Mission Details">
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/20">
                <th className="pb-4 text-[10px] font-headline font-bold text-on-surface-variant uppercase tracking-widest">Mission ID</th>
                <th className="pb-4 text-[10px] font-headline font-bold text-on-surface-variant uppercase tracking-widest">Date</th>
                <th className="pb-4 text-[10px] font-headline font-bold text-on-surface-variant uppercase tracking-widest">Location</th>
                <th className="pb-4 text-[10px] font-headline font-bold text-on-surface-variant uppercase tracking-widest">Victims</th>
                <th className="pb-4 text-[10px] font-headline font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
                <th className="pb-4 text-[10px] font-headline font-bold text-on-surface-variant uppercase tracking-widest text-right">Disaster Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs font-mono text-on-surface-variant uppercase animate-pulse">Retrieving Tactical Archives...</td>
                </tr>
              ) : missions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs font-mono text-on-surface-variant uppercase">No mission records found.</td>
                </tr>
              ) : (
                missions.map((mission) => (
                  <tr key={mission._id} className="group hover:bg-surface-container-high/50 transition-all">
                    <td className="py-4 text-xs font-mono text-on-surface uppercase font-bold">{mission.missionId}</td>
                    <td className="py-4 text-xs text-on-surface-variant">{new Date(mission.date).toLocaleDateString()}</td>
                    <td className="py-4 text-xs text-on-surface-variant">{mission.location}</td>
                    <td className="py-4 text-xs text-on-surface font-bold">{mission.victims}</td>
                    <td className="py-4">
                      <button 
                        onClick={() => handleStatusUpdate(mission._id, mission.status)}
                        className={cn(
                          "px-3 py-1 text-[8px] font-bold rounded uppercase transition-all hover:scale-105 active:scale-95",
                          mission.status === 'Completed' ? 'bg-secondary/10 text-secondary border border-secondary/20' :
                          'bg-primary/10 text-primary border border-primary/20 animate-pulse'
                        )}
                        title="Click to toggle status"
                      >
                        {mission.status}
                      </button>
                    </td>
                    <td className="py-4 text-right">
                      <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest px-3 py-1 bg-primary/5 rounded-lg border border-primary/10">
                        {mission.disasterType || 'Search & Rescue'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New Mission Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-outline-variant/20 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-headline font-bold uppercase tracking-widest">New Mission Record</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-surface-container rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMission} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Mission ID (Auto-Generated)</label>
                <div className="w-full bg-surface-container-highest/50 border border-primary/30 rounded-xl p-3 text-sm font-mono text-primary flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  {newMission.missionId || 'MSN-2026-XXX'}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Deployment Location</label>
                <input 
                  type="text" 
                  value={newMission.location}
                  onChange={(e) => setNewMission({...newMission, location: e.target.value})}
                  placeholder="Sector / Zone Name"
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Confirmed Victims</label>
                <input 
                  type="number" 
                  value={newMission.victims}
                  onChange={(e) => setNewMission({...newMission, victims: parseInt(e.target.value)})}
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Disaster Category</label>
                <select 
                  value={newMission.disasterType}
                  onChange={(e) => setNewMission({...newMission, disasterType: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl p-3 text-sm focus:outline-none focus:border-primary appearance-none"
                >
                  <option value="Forest Fire">FOREST FIRE</option>
                  <option value="Flood">FLOOD</option>
                  <option value="Earthquake">EARTHQUAKE</option>
                  <option value="Landslide">LANDSLIDE</option>
                  <option value="Medical">MEDICAL</option>
                  <option value="Search & Rescue">SEARCH & RESCUE</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Mission Status</label>
                <select 
                  value={newMission.status}
                  onChange={(e) => setNewMission({...newMission, status: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl p-3 text-sm focus:outline-none focus:border-primary appearance-none"
                >
                  <option value="In Progress">IN PROGRESS</option>
                  <option value="Completed">COMPLETED</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-secondary text-on-secondary font-headline font-bold text-sm uppercase tracking-widest rounded-xl hover:brightness-110 transition-all mt-4 shadow-lg shadow-secondary/20"
              >
                Log Mission
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
