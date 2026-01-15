
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { BrainCircuit, Zap, Target, TrendingUp, Info } from 'lucide-react';

const sentimentData = [
  { name: 'Positive', value: 65 },
  { name: 'Neutral', value: 25 },
  { name: 'Negative', value: 10 },
];

const topicData = [
  { topic: 'Price', fullMark: 100, score: 95 },
  { topic: 'Delivery', fullMark: 100, score: 70 },
  { topic: 'Quality', fullMark: 100, score: 85 },
  { topic: 'Service', fullMark: 100, score: 60 },
  { topic: 'Options', fullMark: 100, score: 40 },
];

const conversionBySource = [
  { source: 'WhatsApp', conversions: 1240 },
  { source: 'Telegram', conversions: 450 },
  { source: 'SMS Relay', conversions: 120 },
  { source: 'Web Widget', conversions: 320 },
];

const COLORS = ['#10b981', '#3b82f6', '#ef4444'];

const Analytics: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Advanced Analytics</h1>
          <p className="text-slate-400 mt-1">Deep insights extracted via natural language processing.</p>
        </div>
        <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button className="px-4 py-2 text-xs font-bold uppercase rounded-lg bg-emerald-500 text-white">Week</button>
          <button className="px-4 py-2 text-xs font-bold uppercase rounded-lg text-slate-500 hover:text-white">Month</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sentiment Analysis */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="text-amber-500" size={20} />
            <h3 className="text-lg font-bold text-white">Customer Sentiment</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
             {sentimentData.map((d, i) => (
               <div key={i} className="text-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{d.name}</p>
                  <p className="text-lg font-bold text-white">{d.value}%</p>
               </div>
             ))}
          </div>
        </div>

        {/* Topic Modeling */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-6">
            <BrainCircuit className="text-purple-500" size={20} />
            <h3 className="text-lg font-bold text-white">Topic Relevance</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={topicData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="topic" stroke="#94a3b8" fontSize={10} />
                <Radar name="Topic Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-[10px] text-slate-500 uppercase font-bold mt-4 tracking-widest">Bot Accuracy by Domain</p>
        </div>

        {/* Platform Conversion */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Target className="text-emerald-500" size={20} />
            <h3 className="text-lg font-bold text-white">Platform Funnel</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionBySource} margin={{ bottom: 20 }}>
                <XAxis dataKey="source" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Bar dataKey="conversions" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-slate-800/50 rounded-xl flex items-center gap-3">
             <TrendingUp className="text-emerald-500" size={20} />
             <p className="text-xs text-slate-400">WhatsApp leads convert <span className="text-emerald-400 font-bold">2.4x better</span> than other platforms.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col h-full">
               <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg"><Info size={20} /></div>
                  <h3 className="text-xl font-bold text-white">Gemini AI Parsing Summary</h3>
               </div>
               <p className="text-slate-400 text-sm leading-relaxed mb-8">
                 The bot successfully parsed <span className="text-white font-bold">94%</span> of wholesale intent queries without human intervention this week. 
                 The primary parsing failures occurred around <span className="text-amber-500 font-bold">"custom packaging"</span> requests, which have been flagged for 
                 a new rule addition in the Flow Builder.
               </p>
               <div className="mt-auto flex gap-4">
                  <div className="flex-1 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                     <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Intent Clarity</p>
                     <p className="text-2xl font-bold text-white">98.2%</p>
                  </div>
                  <div className="flex-1 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                     <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Hallucination Rate</p>
                     <p className="text-2xl font-bold text-white">&lt;0.01%</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-white mb-6">Top AI Recommendations</h3>
            <div className="space-y-4">
               {[
                 { title: 'Update Pricing Schema', desc: 'Users are asking for bulk discounts on Series B items.', impact: 'High' },
                 { title: 'New Node: Logistics FAQ', desc: 'Frequent questions about shipping to South America.', impact: 'Medium' },
                 { title: 'Agent Handoff Optimization', desc: 'Bottleneck detected between 2 PM and 4 PM.', impact: 'High' },
               ].map((rec, i) => (
                 <div key={i} className="p-4 bg-slate-800/50 hover:bg-slate-800 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-slate-700 flex justify-between items-center group">
                    <div className="max-w-[80%]">
                       <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{rec.title}</h4>
                       <p className="text-xs text-slate-500 mt-1">{rec.desc}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                       rec.impact === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                       {rec.impact} Impact
                    </span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Analytics;
