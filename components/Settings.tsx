
import React, { useState, useEffect } from 'react';
import { Send, Smartphone, Bot, Cpu, Shield, Globe, Eye, EyeOff, CheckCircle, XCircle, RefreshCw, ExternalLink, Save, AlertCircle, Copy, Info } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'whatsapp' | 'telegram' | 'ai'>('telegram');
  const [showToken, setShowToken] = useState(false);
  const [tgToken, setTgToken] = useState('718294025:AAH-x9jLpM3nQw_v-zK8fR2bE1uY4sX7pLc');
  const [isConnecting, setIsConnecting] = useState(false);
  const [tgStatus, setTgStatus] = useState<'idle' | 'connected' | 'error'>('connected');
  
  // Webhook states
  const [webhookEnabled, setWebhookEnabled] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('https://api.wholesaleflow.io/webhook/telegram');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleTestConnection = () => {
    if (!tgToken) return;
    setIsConnecting(true);
    setTgStatus('idle');
    // Simulate API call to get bot info from Telegram servers
    setTimeout(() => {
      setIsConnecting(false);
      if (tgToken.length > 10) { // Simple mock validation
        setTgStatus('connected');
      } else {
        setTgStatus('error');
      }
    }, 1500);
  };

  const handleSaveConfig = () => {
    if (webhookEnabled && (!webhookUrl.startsWith('https://') || webhookUrl.length < 12)) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'whatsapp', label: 'WhatsApp', icon: Smartphone },
    { id: 'telegram', label: 'Telegram', icon: Send },
    { id: 'ai', label: 'AI Providers', icon: Cpu },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings & Integrations</h1>
          <p className="text-slate-400 mt-1">Configure your bot platforms, API keys, and system rules.</p>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus === 'success' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl animate-in fade-in zoom-in">
              <CheckCircle size={16} />
              <span className="text-sm font-bold">Configuration Sync Successful</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl animate-in shake duration-300">
              <AlertCircle size={16} />
              <span className="text-sm font-bold">Invalid Webhook URL</span>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden min-h-[600px] shadow-2xl flex flex-col">
        {activeTab === 'telegram' && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left Column: Form */}
            <div className="flex-1 p-8 space-y-10 border-r border-slate-800 overflow-y-auto">
              {/* Step 1: Authentication */}
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">1</div>
                  <h3 className="text-lg font-bold text-white">Bot Authentication</h3>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-6 relative group transition-all hover:border-blue-500/30">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex justify-between">
                      Bot API Token
                      <a href="https://t.me/botfather" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-1 normal-case tracking-normal transition-colors">
                        Open @BotFather <ExternalLink size={10} />
                      </a>
                    </label>
                    <div className="relative">
                      <input 
                        type={showToken ? 'text' : 'password'}
                        value={tgToken}
                        onChange={(e) => {
                          setTgToken(e.target.value);
                          if (tgStatus !== 'idle') setTgStatus('idle');
                        }}
                        placeholder="123456789:ABCDefGhIJKlmNoPQRstuVWXyz..."
                        className={`w-full bg-slate-900 border rounded-xl px-4 py-3.5 text-sm outline-none pr-12 font-mono transition-all ${
                          tgStatus === 'connected' ? 'border-emerald-500/50' :
                          tgStatus === 'error' ? 'border-red-500/50' : 'border-slate-800 focus:border-blue-500/50'
                        }`}
                      />
                      <button 
                        onClick={() => setShowToken(!showToken)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showToken ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleTestConnection}
                      disabled={!tgToken || isConnecting}
                      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/10 active:scale-95"
                    >
                      {isConnecting ? <RefreshCw size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                      {tgStatus === 'connected' ? 'Re-test' : 'Connect & Validate'}
                    </button>
                    {tgStatus === 'connected' && (
                      <div className="flex items-center gap-2 text-emerald-400 animate-in fade-in slide-in-from-left-2">
                        <CheckCircle size={18} />
                        <span className="text-xs font-bold uppercase">Token Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Step 2: Webhooks */}
              <section className={`space-y-6 transition-opacity duration-500 ${tgStatus === 'connected' ? 'opacity-100' : 'opacity-40 pointer-events-none grayscale'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold transition-colors ${webhookEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}>2</div>
                  <h3 className="text-lg font-bold text-white">Webhook Configuration</h3>
                </div>

                <div className={`bg-slate-950 border p-6 rounded-2xl space-y-6 transition-all ${webhookEnabled ? 'border-emerald-500/30' : 'border-slate-800'}`}>
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                         <div className="flex items-center gap-2">
                           <Globe size={18} className={webhookEnabled ? 'text-emerald-400' : 'text-slate-500'} />
                           <span className="text-sm font-bold text-white">Enable Real-time Webhooks</span>
                         </div>
                         <p className="text-xs text-slate-500 leading-relaxed max-w-sm">Receive incoming messages instantly. Your server must support HTTPS.</p>
                      </div>
                      <button 
                        onClick={() => setWebhookEnabled(!webhookEnabled)}
                        className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${webhookEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
                      >
                         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 ${webhookEnabled ? 'right-1' : 'left-1'}`} />
                      </button>
                   </div>
                   
                   {webhookEnabled && (
                     <div className="space-y-3 animate-in slide-in-from-top-4 duration-300">
                       <div className="relative group">
                         <input 
                            type="text" 
                            value={webhookUrl}
                            onChange={(e) => setWebhookUrl(e.target.value)}
                            placeholder="https://your-api.com/v1/telegram/webhook"
                            className={`w-full bg-slate-900 border rounded-xl px-4 py-3.5 text-sm text-slate-300 outline-none transition-all font-mono ${
                              webhookUrl.length > 0 && !webhookUrl.startsWith('https://') 
                                ? 'border-red-500/50 focus:border-red-500' 
                                : 'border-slate-800 focus:border-emerald-500/50'
                            }`}
                         />
                         <button 
                          onClick={() => copyToClipboard(webhookUrl)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1"
                          title="Copy URL"
                         >
                           <Copy size={16} />
                         </button>
                       </div>
                       {webhookUrl.length > 0 && !webhookUrl.startsWith('https://') && (
                         <div className="flex items-center gap-2 text-red-400 text-[11px] font-bold">
                           <AlertCircle size={14} /> HTTPS is required for Telegram Webhooks.
                         </div>
                       )}
                       <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 flex items-start gap-3">
                          <Info size={14} className="text-blue-400 mt-0.5" />
                          <p className="text-[10px] text-slate-500 leading-relaxed">
                            Once saved, we will send a <code className="text-blue-400 bg-blue-500/10 px-1 rounded">setWebhook</code> request to Telegram with your token and this URL.
                          </p>
                       </div>
                     </div>
                   )}
                </div>
              </section>

              <div className="pt-4">
                <button 
                  onClick={handleSaveConfig}
                  disabled={isSaving || (webhookEnabled && !webhookUrl.startsWith('https://')) || tgStatus !== 'connected'}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all shadow-xl active:scale-[0.98] ${
                    isSaving ? 'bg-slate-800 text-slate-500' : 
                    tgStatus === 'connected' ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20' : 
                    'bg-slate-800 text-slate-600 cursor-not-allowed shadow-none'
                  }`}
                >
                  {isSaving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
                  {isSaving ? 'Synchronizing with Telegram...' : 'Apply & Save Configuration'}
                </button>
              </div>
            </div>

            {/* Right Column: Information & Preview */}
            <div className="w-full lg:w-96 bg-slate-950 p-8 space-y-8 flex flex-col">
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-4">Live Status</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Telegram Network</span>
                    <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Stable
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">API Latency</span>
                    <span className="text-slate-200 text-xs font-mono">24ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Environment</span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">Production</span>
                  </div>
                </div>

                {tgStatus === 'connected' ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-in zoom-in-95 duration-500 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-2xl shadow-lg border-2 border-slate-900">
                        W
                      </div>
                      <div>
                        <p className="text-base font-bold text-white">WholesaleBot_v2</p>
                        <p className="text-xs text-blue-400/70">@wholesale_agent_bot</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-800">
                      <div className="text-center">
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Users</p>
                        <p className="text-sm font-bold text-white">4.2k</p>
                      </div>
                      <div className="text-center border-l border-slate-800">
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Status</p>
                        <p className="text-sm font-bold text-emerald-500">Active</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-4 grayscale">
                    <Bot size={48} className="text-slate-700" />
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">Validate your Bot Token to see live identity preview and analytics.</p>
                  </div>
                )}
              </div>

              <div className="flex-1" />

              <div className="space-y-4 bg-slate-900/30 p-5 rounded-2xl border border-slate-800/50">
                <h4 className="text-xs font-bold text-slate-400 flex items-center gap-2">
                  <Shield size={14} className="text-blue-400" /> Security Tip
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Never share your <span className="text-slate-300">Bot API Token</span> with anyone. Telegram suggests regenerating the token if it has been exposed in client-side code or shared in public repositories.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="p-10 space-y-8 animate-in fade-in duration-300">
             <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-purple-500/10 text-purple-400 rounded-3xl">
                  <Cpu size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">AI Provider Configuration</h2>
                  <p className="text-sm text-slate-500 leading-relaxed">Orchestrate how your wholesale bot parses natural language and handles fallback reasoning.</p>
                </div>
             </div>
             
             <div className="grid grid-cols-1 gap-6">
                {[
                  { name: 'Google Gemini', model: 'gemini-3-flash-preview', status: 'Connected', desc: 'Primary engine for transcription and order parsing.' },
                  { name: 'OpenAI GPT-4', model: 'gpt-4-turbo', status: 'Inactive', desc: 'Secondary fallback for complex negotiation flows.' },
                  { name: 'Groq Llama 3', model: 'llama3-70b-8192', status: 'Inactive', desc: 'Optimized for high-speed low-latency rule evaluation.' },
                ].map((provider, i) => (
                  <div key={i} className="bg-slate-950 border border-slate-800 p-8 rounded-3xl flex items-center justify-between hover:border-purple-500/30 transition-all group relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                     <div className="flex items-center gap-6 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xl text-slate-400 group-hover:text-purple-400 transition-colors">
                          {provider.name[0]}
                        </div>
                        <div className="space-y-1">
                           <div className="flex items-center gap-3">
                             <h4 className="text-lg font-bold text-white">{provider.name}</h4>
                             <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                provider.status === 'Connected' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                             }`}>
                                {provider.status}
                             </span>
                           </div>
                           <p className="text-sm text-slate-500">{provider.desc}</p>
                           <p className="text-[11px] text-slate-600 font-mono italic">Active Model: {provider.model}</p>
                        </div>
                     </div>
                     <button className="relative z-10 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-sm font-bold text-slate-300 hover:text-white transition-all">
                        Settings
                     </button>
                  </div>
                ))}
             </div>
          </div>
        )}

        {(activeTab === 'general' || activeTab === 'whatsapp') && (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6">
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-full border-dashed">
              {activeTab === 'general' ? <Globe size={64} className="text-slate-800" /> : <Smartphone size={64} className="text-slate-800" />}
            </div>
            <div className="max-w-sm space-y-2">
              <h3 className="text-xl font-bold text-white capitalize">{activeTab} Modules pending</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                We are currently integrating the {activeTab} API hooks. Check back in the next version update for full support.
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('telegram')}
              className="text-emerald-400 text-sm font-bold hover:underline"
            >
              Return to Telegram Setup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
