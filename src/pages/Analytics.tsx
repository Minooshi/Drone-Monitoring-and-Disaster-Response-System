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
  Zap
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

  useEffect(() => {
    fetch('/api/missions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMissions(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching missions:', err);
        setLoading(false);
      });
  }, []);

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
          <button className="px-4 py-2 bg-surface-container-high border border-outline-variant/20 text-on-surface font-headline text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-surface-container-highest transition-all flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" /> Last 7 Days
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
            <span className="text-3xl font-headline font-bold text-on-surface">{totalMissions || 142}</span>
            <span className="text-[10px] font-bold text-secondary flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
        </Card>
        <Card title="Lives Saved" icon={Users}>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-headline font-bold text-on-surface">{totalVictims || 842}</span>
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
                <th className="pb-4 text-[10px] font-headline font-bold text-on-surface-variant uppercase tracking-widest text-right">Action</th>
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
                    <td className="py-4 text-xs font-mono text-on-surface uppercase">{mission.missionId}</td>
                    <td className="py-4 text-xs text-on-surface-variant">{new Date(mission.date).toLocaleDateString()}</td>
                    <td className="py-4 text-xs text-on-surface-variant">{mission.location}</td>
                    <td className="py-4 text-xs text-on-surface">{mission.victims}</td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 text-[8px] font-bold rounded uppercase ${
                        mission.status === 'Completed' ? 'bg-secondary/10 text-secondary' :
                        mission.status === 'In Progress' ? 'bg-primary/10 text-primary animate-pulse' :
                        'bg-error/10 text-error'
                      }`}>
                        {mission.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-[9px] font-bold text-primary uppercase tracking-widest hover:underline">View Details</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

