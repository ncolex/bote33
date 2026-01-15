
import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
  Cell, PieChart, Pie
} from 'recharts';
import { TrendingUp, Users, MessageCircle, DollarSign, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const stats = [
  { label: 'Total Orders', value: '1,284', change: '+12.5%', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { label: 'Active Users', value: '45,202', change: '+5.2%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Messages Sent', value: '382,912', change: '+28.4%', icon: MessageCircle, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { label: 'Avg. Response', value: '1.2s', change: '-18.1%', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
];

const mainChartData = [
  { time: '00:00', sent: 120, delivered: 115 },
  { time: '04:00', sent: 80, delivered: 78 },
  { time: '08:00', sent: 450, delivered: 430 },
  { time: '12:00', sent: 720, delivered: 690 },
  { time: '16:00', sent: 540, delivered: 510 },
  { time: '20:00', sent: 680, delivered: 650 },
  { time: '23:59', sent: 320, delivered: 310 },
];

const funnelData = [
  { name: 'Initial Contact', value: 100 },
  { name: 'Menu Selection', value: 85 },
  { name: 'Product Query', value: 65 },
  { name: 'Cart Added', value: 45 },
  { name: 'Order Placed', value: 32 },
];

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">System Overview</h1>
          <p className="text-slate-400 mt-1">Real-time performance and bot activity monitoring.</p>
        </div>
        <div className="flex gap-3">
          <select className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-emerald-500 focus:ring-2 outline-none">
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all">
            Download Report
          </button>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl group hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.change.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-slate-400 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Message Throughput</h3>
              <p className="text-sm text-slate-500">Sent vs Delivered messages over time</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                <span className="text-xs text-slate-400">Sent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500/30 rounded-full" />
                <span className="text-xs text-slate-400">Delivered</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mainChartData}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="sent" stroke="#10b981" fillOpacity={1} fill="url(#colorSent)" strokeWidth={3} />
                <Area type="monotone" dataKey="delivered" stroke="#10b98144" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement Distribution */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col">
          <h3 className="text-lg font-bold text-white mb-2">Order Conversion Funnel</h3>
          <p className="text-sm text-slate-500 mb-6">User drop-off at each stage</p>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={funnelData} margin={{ left: 40 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={100} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-4">Latest Handoff Requests</h3>
          <div className="space-y-4">
            {[
              { name: 'Ana Lopez', time: '2m ago', topic: 'Price Negotiation', urgency: 'High' },
              { name: 'Marco Silva', time: '15m ago', topic: 'Technical Support', urgency: 'Medium' },
              { name: 'Jessica Chen', time: '45m ago', topic: 'Bulk Order Query', urgency: 'High' },
            ].map((req, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700">
                <div className="flex items-center gap-3">
                  <img src={`https://picsum.photos/40/40?random=${i}`} className="w-10 h-10 rounded-full" alt="" />
                  <div>
                    <p className="text-sm font-semibold text-white">{req.name}</p>
                    <p className="text-xs text-slate-500">{req.topic}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 mb-1">{req.time}</p>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    req.urgency === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {req.urgency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-4">Top AI Intents</h3>
          <div className="space-y-4">
            {[
              { intent: 'Check Inventory', count: 4210, percentage: 42 },
              { intent: 'Price Inquiry', count: 2840, percentage: 28 },
              { intent: 'Order Status', count: 1845, percentage: 18 },
              { intent: 'Refund Policy', count: 620, percentage: 6 },
            ].map((item, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">{item.intent}</span>
                  <span className="text-white">{item.count.toLocaleString()} calls</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
