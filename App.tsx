
import React, { useState } from 'react';
import { LayoutDashboard, GitMerge, MessageSquare, Megaphone, BarChart3, Users, Settings as SettingsIcon, Bell, Search, Menu, FlaskConical } from 'lucide-react';
import { View } from './types';
import Dashboard from './components/Dashboard';
import FlowBuilder from './components/FlowBuilder';
import LiveInbox from './components/LiveInbox';
import Campaigns from './components/Campaigns';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import Playground from './components/Playground';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.SETTINGS);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD: return <Dashboard />;
      case View.FLOW_BUILDER: return <FlowBuilder />;
      case View.LIVE_INBOX: return <LiveInbox />;
      case View.CAMPAIGNS: return <Campaigns />;
      case View.ANALYTICS: return <Analytics />;
      case View.SETTINGS: return <Settings />;
      case View.PLAYGROUND: return <Playground />;
      default: return <Dashboard />;
    }
  };

  const navItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: View.FLOW_BUILDER, label: 'Flow Builder', icon: GitMerge },
    { id: View.LIVE_INBOX, label: 'Live Inbox', icon: MessageSquare },
    { id: View.PLAYGROUND, label: 'Playground', icon: FlaskConical },
    { id: View.CAMPAIGNS, label: 'Campaigns', icon: Megaphone },
    { id: View.ANALYTICS, label: 'Analytics', icon: BarChart3 },
    { id: View.PERSONALITIES, label: 'Personalities', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-slate-900 border-r border-slate-800 flex flex-col`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <MessageSquare className="text-white w-5 h-5" />
          </div>
          {sidebarOpen && <span className="font-bold text-xl tracking-tight text-white">WholesaleFlow</span>}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                currentView === item.id 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setCurrentView(View.SETTINGS)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              currentView === View.SETTINGS 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <SettingsIcon size={20} />
            {sidebarOpen && <span className="font-medium">Settings</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg">
              <Menu size={20} className="text-slate-400" />
            </button>
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search orders, contacts, or logs..."
                className="bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 w-full focus:ring-2 focus:ring-emerald-500/50 text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Bot Active</span>
            </div>
            <button className="relative p-2 text-slate-400 hover:text-white">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900" />
            </button>
            <div className="flex items-center gap-3 border-l border-slate-800 pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">Alex Agent</p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
              <img src="https://picsum.photos/40/40" alt="Avatar" className="w-9 h-9 rounded-full ring-2 ring-slate-800" />
            </div>
          </div>
        </header>

        {/* View Container */}
        <div className="flex-1 overflow-y-auto bg-slate-950 p-8 custom-scrollbar">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
