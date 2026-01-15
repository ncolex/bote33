
import React, { useState } from 'react';
import { Play, Plus, MessageSquare, ShieldCheck, UserCog, Save, Trash2, ChevronRight, Share2 } from 'lucide-react';

const FlowBuilder: React.FC = () => {
  const [nodes, setNodes] = useState([
    { id: '1', type: 'start', label: 'Welcome Message', pos: { x: 50, y: 100 } },
    { id: '2', type: 'condition', label: 'Verify Customer', pos: { x: 300, y: 100 } },
    { id: '3', type: 'message', label: 'Show Catalog', pos: { x: 550, y: 50 } },
    { id: '4', type: 'handoff', label: 'Handoff to Agent', pos: { x: 550, y: 150 } },
  ]);

  const toolboxItems = [
    { type: 'message', icon: MessageSquare, label: 'Send Message', color: 'bg-blue-500' },
    { type: 'condition', icon: ShieldCheck, label: 'Rule Condition', color: 'bg-emerald-500' },
    { type: 'handoff', icon: UserCog, label: 'Handoff Agent', color: 'bg-purple-500' },
    { type: 'start', icon: Play, label: 'Start Point', color: 'bg-slate-500' },
  ];

  return (
    <div className="h-full flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Visual Flow Builder</h1>
          <p className="text-slate-400 mt-1">Design your automated wholesale conversion logic.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-semibold transition-all">
            <Share2 size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20">
            <Save size={16} /> Save Flow
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Toolbox */}
        <div className="w-64 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-6">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Toolbox</h3>
            <div className="grid grid-cols-1 gap-3">
              {toolboxItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl cursor-grab active:cursor-grabbing border border-slate-700/50 transition-all group">
                  <div className={`p-2 rounded-lg ${item.color} text-white`}>
                    <item.icon size={18} />
                  </div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Saved Flows</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                Default Wholesale Intro
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-slate-800 text-slate-500 text-xs transition-all">
                Weekend Support Bot
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl relative overflow-hidden bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px]">
          {/* Simple Mock Flow */}
          <div className="absolute inset-0 p-12">
            {nodes.map((node) => (
              <div 
                key={node.id} 
                className="absolute p-4 bg-slate-800 border-2 border-slate-700 rounded-xl w-48 shadow-xl cursor-move group hover:border-emerald-500/50 transition-all"
                style={{ left: node.pos.x, top: node.pos.y }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    node.type === 'start' ? 'bg-slate-500/20 text-slate-400' :
                    node.type === 'condition' ? 'bg-emerald-500/20 text-emerald-400' :
                    node.type === 'handoff' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {node.type}
                  </span>
                  <button className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-500 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-sm font-semibold text-white truncate">{node.label}</p>
                <div className="mt-4 flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase">
                  <span>Input</span>
                  <span>Output</span>
                </div>
                {/* Port points */}
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-700 rounded-full border-2 border-slate-900" />
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
            ))}

            {/* Simulated connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <path d="M 242 135 Q 271 135 300 135" stroke="#64748b" strokeWidth="2" fill="none" />
              <path d="M 492 135 Q 521 135 550 85" stroke="#10b981" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
              <path d="M 492 135 Q 521 135 550 185" stroke="#ef4444" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
              <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#10b981" />
                </marker>
              </defs>
            </svg>
          </div>

          {/* Controls */}
          <div className="absolute bottom-6 right-6 flex gap-2">
            <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg border border-slate-700 shadow-lg">
              <Plus size={20} />
            </button>
            <div className="flex bg-slate-800 rounded-lg border border-slate-700 shadow-lg overflow-hidden">
              <button className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:bg-slate-700 border-r border-slate-700">100%</button>
              <button className="px-3 py-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10">FIT</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowBuilder;
