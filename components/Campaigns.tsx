
import React from 'react';
import { Calendar, Image as ImageIcon, Plus, FileText, Send, Clock, Filter, List } from 'lucide-react';

const campaigns = [
  { name: 'Summer Stock Promo', date: '2024-05-15', status: 'Scheduled', reach: '5,000 users', type: 'Product Announcement' },
  { name: 'VIP Discount Blast', date: '2024-05-10', status: 'Draft', reach: '1,200 users', type: 'Discount' },
  { name: 'Spring Sale Final', date: '2024-04-30', status: 'Completed', reach: '4,840 users', type: 'Newsletter' },
];

const media = [
  { id: 1, name: 'winter-catalog.pdf', type: 'pdf', size: '2.4MB' },
  { id: 2, name: 'product-shot-01.jpg', type: 'image', size: '1.2MB' },
  { id: 3, name: 'wholesale-promo.mp4', type: 'video', size: '15MB' },
  { id: 4, name: 'logo-vector.svg', type: 'image', size: '45KB' },
  { id: 5, name: 'order-form-template.xlsx', type: 'file', size: '890KB' },
  { id: 6, name: 'banner-mobile.png', type: 'image', size: '2.1MB' },
];

const Campaigns: React.FC = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Campaigns & Media</h1>
          <p className="text-slate-400 mt-1">Schedule bulk messages and manage your brand assets.</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
          <Plus size={20} /> Create New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campaign List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Recent Campaigns</h3>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"><Filter size={18} /></button>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"><List size={18} /></button>
              </div>
            </div>
            <div className="divide-y divide-slate-800">
              {campaigns.map((camp, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-800/30 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      camp.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-500' :
                      camp.status === 'Draft' ? 'bg-slate-700/50 text-slate-400' : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {camp.status === 'Completed' ? <Send size={24} /> : <Clock size={24} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{camp.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">{camp.type} • Target: {camp.reach}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-300">{camp.date}</p>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded mt-1 inline-block ${
                       camp.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-500' :
                       camp.status === 'Draft' ? 'bg-slate-700/50 text-slate-400' : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {camp.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/10 p-8 rounded-3xl flex items-center justify-between gap-8">
            <div className="max-w-md">
              <h3 className="text-2xl font-bold text-white mb-2">Automate Follow-ups</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Let the bot automatically ping inactive leads every 48 hours until they convert or opt-out. AI ensures the message feels personal every time.</p>
              <button className="mt-6 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-all">Configure AI Follow-ups</button>
            </div>
            <div className="hidden md:block w-32 h-32 opacity-20">
               <Calendar size={128} className="text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Media Library Sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-800">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Media Library</h3>
                <button className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                   <Plus size={20} />
                </button>
             </div>
             <div className="grid grid-cols-2 gap-2">
                <button className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase border border-emerald-500/20">All Files</button>
                <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase transition-all">Images</button>
             </div>
          </div>
          <div className="p-4 grid grid-cols-2 gap-4 flex-1 overflow-y-auto max-h-[600px]">
             {media.map((item) => (
                <div key={item.id} className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl hover:border-emerald-500/30 transition-all group cursor-pointer relative">
                   <div className="aspect-square flex items-center justify-center mb-3 bg-slate-900 rounded-lg">
                      {item.type === 'image' ? <ImageIcon className="text-blue-500" /> : 
                       item.type === 'pdf' ? <FileText className="text-red-500" /> : 
                       <FileText className="text-slate-500" />}
                   </div>
                   <p className="text-[10px] font-bold text-white truncate mb-1">{item.name}</p>
                   <p className="text-[9px] text-slate-500 uppercase tracking-tighter">{item.size} • {item.type}</p>
                </div>
             ))}
          </div>
          <div className="p-6 border-t border-slate-800 bg-slate-900/50">
             <div className="flex items-center justify-between text-xs mb-4">
                <span className="text-slate-500 font-medium">Storage Used</span>
                <span className="text-white font-bold">12.4 GB / 50 GB</span>
             </div>
             <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[25%]" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
