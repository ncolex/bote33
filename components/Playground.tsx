
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Mic, User, RefreshCcw, Code, Zap, ShieldAlert, Cpu, Layers, Trash2, CheckCircle2 } from 'lucide-react';
import { getAIParsingInsight, transcribeVoiceMessage } from '../services/geminiService';
import { ChatMessage } from '../types';

const Playground: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activePersona, setActivePersona] = useState('Default Wholesale');
  const [lastInsight, setLastInsight] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string, type: 'text' | 'audio' = 'text') => {
    if (!text.trim() && type === 'text') return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date(),
      type: type
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsProcessing(true);

    // Call Gemini for parsing insight
    const insight = await getAIParsingInsight(text);
    try {
      // Try to parse the insight if it's JSON, otherwise keep as text
      const parsedInsight = typeof insight === 'string' ? JSON.parse(insight.replace(/```json|```/g, '')) : insight;
      setLastInsight(parsedInsight);
    } catch (e) {
      setLastInsight({ raw: insight });
    }

    // Simulate Bot Response
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "I've processed your request. According to our wholesale logic, this qualifies for a Tier 2 discount. Would you like to proceed?",
        timestamp: new Date(),
        metadata: {
          intent: 'order_inquiry',
          parsing_status: 'parsed'
        }
      };
      setMessages(prev => [...prev, botMsg]);
      setIsProcessing(false);
    }, 1000);
  };

  const simulateVoiceMessage = async () => {
    setIsProcessing(true);
    const mockAudio = "MOCK_BASE64_DATA";
    const transcription = await transcribeVoiceMessage(mockAudio);
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: transcription || "Voice message received",
      timestamp: new Date(),
      type: 'audio',
      metadata: {
        transcription: transcription
      }
    };

    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(false);
    handleSend(transcription || "", 'text');
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex gap-8 animate-in fade-in duration-500">
      {/* Simulation Area */}
      <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <Zap size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Bot Simulator</h2>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Testing Mode Active</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={activePersona}
              onChange={(e) => setActivePersona(e.target.value)}
              className="bg-slate-800 border-none text-[10px] font-bold uppercase py-1.5 px-3 rounded-lg text-slate-300 outline-none"
            >
              <option>Default Wholesale</option>
              <option>Strict Negotiation</option>
              <option>Support Only</option>
            </select>
            <button 
              onClick={() => {setMessages([]); setLastInsight(null);}}
              className="p-2 text-slate-500 hover:text-red-400 transition-all"
            >
              <RefreshCcw size={18} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <Bot size={48} className="text-slate-700" />
              <div className="max-w-xs">
                <p className="text-sm font-medium text-slate-400">No messages yet. Try typing something like "I want to order 50 blue shirts".</p>
              </div>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] space-y-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-2xl text-sm shadow-lg ${
                  msg.sender === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                }`}>
                  {msg.type === 'audio' && (
                    <div className="flex items-center gap-3 mb-2 pb-2 border-b border-white/10">
                      <Mic size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Voice Message</span>
                    </div>
                  )}
                  {msg.text}
                </div>
                <div className={`flex items-center gap-2 px-1 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[9px] text-slate-600 font-bold uppercase">{msg.sender}</span>
                  <span className="text-[9px] text-slate-600">•</span>
                  <span className="text-[9px] text-slate-600">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-2 flex items-center gap-2">
            <button 
              onClick={simulateVoiceMessage}
              className="p-3 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/5 rounded-xl transition-all"
            >
              <Mic size={20} />
            </button>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
              placeholder="Type a test message..."
              className="flex-1 bg-transparent border-none text-sm outline-none px-2 text-slate-200"
            />
            <button 
              onClick={() => handleSend(inputValue)}
              disabled={isProcessing || !inputValue.trim()}
              className="p-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              {isProcessing ? <RefreshCcw size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Inspector Area */}
      <div className="w-[450px] flex flex-col gap-6">
        {/* AI Analysis */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-xl">
          <div className="p-5 border-b border-slate-800 flex items-center gap-3 bg-slate-900/50">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <Cpu size={20} />
            </div>
            <h3 className="text-sm font-bold text-white">AI Parsing Inspector</h3>
          </div>
          <div className="flex-1 p-6 overflow-y-auto bg-slate-950/50">
            {lastInsight ? (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Extracted Insight (JSON)</h4>
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto whitespace-pre">
                    {JSON.stringify(lastInsight, null, 2)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Intent</p>
                    <p className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      {lastInsight.intent || 'Order Inquiry'}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Confidence</p>
                    <p className="text-sm font-bold text-white flex items-center gap-2 text-emerald-500">
                      98.4%
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                <Code size={32} className="text-slate-700 mb-3" />
                <p className="text-xs font-medium text-slate-500 px-10">Send a message to see the AI's internal parsing logic.</p>
              </div>
            )}
          </div>
        </div>

        {/* Rule Engine */}
        <div className="h-72 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-xl">
          <div className="p-5 border-b border-slate-800 flex items-center gap-3 bg-slate-900/50">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
              <Layers size={20} />
            </div>
            <h3 className="text-sm font-bold text-white">Rule Engine Monitor</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-300">Minimum Order Qty Check</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">Passed</span>
              </div>
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                  <span className="text-xs text-slate-300">Discount Tier Rule</span>
                </div>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-800 px-2 py-0.5 rounded uppercase">Skipped</span>
              </div>
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-xs text-slate-300">Human Handoff Trigger</span>
                </div>
                <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded uppercase">Watching</span>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-start gap-3">
              <ShieldAlert size={16} className="text-amber-500 mt-0.5" />
              <p className="text-[10px] text-amber-500/80 leading-relaxed font-medium">
                Tip: Rules execute <span className="underline">before</span> the AI response to ensure compliance with business policies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
