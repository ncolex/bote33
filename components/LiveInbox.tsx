
import React, { useState, useEffect } from 'react';
import { Send, User, Bot, Clock, Search, Phone, Video, MoreVertical, Paperclip, Smile, ShieldAlert, Mic, Play, Pause, Languages, Loader2 } from 'lucide-react';
import { transcribeVoiceMessage } from '../services/geminiService';

interface Message {
  id: string;
  sender: 'user' | 'bot' | 'agent';
  text?: string;
  type: 'text' | 'audio';
  time: string;
  audioUrl?: string;
  transcription?: string;
  isTranscribing?: boolean;
}

const initialConversations = [
  { id: '1', name: 'Ana Lopez', lastMsg: 'How much for 100 units?', time: '2m', unread: 2, status: 'bot', platform: 'whatsapp' },
  { id: '2', name: 'Marco Silva', lastMsg: 'Order confirmed, thanks!', time: '15m', unread: 0, status: 'agent', platform: 'telegram' },
  { id: '3', name: 'Bulk Buy Inc.', lastMsg: 'Check inventory for XL shirts', time: '1h', unread: 0, status: 'bot', platform: 'whatsapp' },
  { id: '4', name: 'John Doe', lastMsg: 'Help with technical integration', time: '4h', unread: 5, status: 'handoff', platform: 'whatsapp' },
];

const initialMessages: Message[] = [
  { id: '1', sender: 'user', text: 'Hi, I would like to inquire about bulk pricing for the winter collection.', type: 'text', time: '10:00 AM' },
  { id: '2', sender: 'bot', text: 'Hello! Our winter collection wholesale pricing starts at $15/unit for orders above 50 pieces. Would you like to see the catalog?', type: 'text', time: '10:01 AM' },
  { id: '3', sender: 'user', text: 'Yes, please. Also, do you have 100 units of the blue parka in stock?', type: 'text', time: '10:05 AM' },
  { id: '4', sender: 'bot', text: 'Checking inventory... Yes, we have 142 units of "Blue Parka" available. I can help you place an order now.', type: 'text', time: '10:06 AM' },
  { id: '5', sender: 'user', type: 'audio', time: '10:10 AM', audioUrl: '#' },
];

const LiveInbox: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState(initialConversations[0]);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [autoTranscribe, setAutoTranscribe] = useState(false);

  const handleTranscribe = async (msgId: string) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isTranscribing: true } : m));
    
    // Simulating audio data for the demo
    const mockAudioBase64 = "UklGRiSBAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQCAAA=="; 
    const text = await transcribeVoiceMessage(mockAudioBase64);
    
    setMessages(prev => prev.map(m => m.id === msgId ? { 
      ...m, 
      transcription: text, 
      isTranscribing: false 
    } : m));
  };

  // Effect to handle auto-transcription for new messages
  useEffect(() => {
    if (autoTranscribe) {
      messages.forEach(msg => {
        if (msg.type === 'audio' && !msg.transcription && !msg.isTranscribing) {
          handleTranscribe(msg.id);
        }
      });
    }
  }, [autoTranscribe, messages]);

  return (
    <div className="h-[calc(100vh-10rem)] flex gap-6 animate-in fade-in duration-500">
      {/* Sidebar List */}
      <div className="w-80 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search chats..."
              className="bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 w-full text-sm focus:ring-emerald-500/50 focus:ring-2"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button className="flex-1 text-[10px] font-bold uppercase tracking-wider py-1.5 rounded-md bg-emerald-500 text-white">Active</button>
            <button className="flex-1 text-[10px] font-bold uppercase tracking-wider py-1.5 rounded-md text-slate-500 hover:bg-slate-800">Assigned</button>
            <button className="flex-1 text-[10px] font-bold uppercase tracking-wider py-1.5 rounded-md text-slate-500 hover:bg-slate-800">Closed</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {initialConversations.map((chat) => (
            <button 
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full p-4 flex gap-4 transition-all border-l-2 ${
                selectedChat.id === chat.id ? 'bg-slate-800 border-emerald-500' : 'hover:bg-slate-800/50 border-transparent'
              }`}
            >
              <div className="relative">
                <img src={`https://picsum.photos/48/48?random=${chat.id}`} alt="" className="w-12 h-12 rounded-full" />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                  chat.status === 'bot' ? 'bg-emerald-500' : chat.status === 'agent' ? 'bg-blue-500' : 'bg-amber-500'
                }`} />
              </div>
              <div className="flex-1 text-left">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-white">{chat.name}</span>
                  <span className="text-[10px] text-slate-500">{chat.time}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">{chat.lastMsg}</p>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">{chat.unread}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <img src={`https://picsum.photos/40/40?random=${selectedChat.id}`} alt="" className="w-10 h-10 rounded-full" />
            <div>
              <h3 className="text-sm font-bold text-white">{selectedChat.name}</h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-emerald-500 font-medium">Online</span>
                <span className="text-slate-600 px-1">•</span>
                <span className="text-xs text-slate-500 uppercase font-bold tracking-tighter">{selectedChat.platform}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1 border border-slate-700">
               <button 
                onClick={() => setAutoTranscribe(!autoTranscribe)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                 autoTranscribe ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
                }`}
               >
                 <Languages size={14} />
                 Auto-Transcribe
               </button>
            </div>
            <div className="h-8 w-[1px] bg-slate-800" />
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold hover:bg-emerald-500/20 transition-all">
                <ShieldAlert size={14} /> Take Over Control
              </button>
              <button className="p-2 text-slate-400 hover:text-white transition-all"><Phone size={20} /></button>
              <button className="p-2 text-slate-400 hover:text-white transition-all"><Video size={20} /></button>
              <button className="p-2 text-slate-400 hover:text-white transition-all"><MoreVertical size={20} /></button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="text-center">
            <span className="px-3 py-1 bg-slate-800 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-widest">Today</span>
          </div>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[70%] group relative ${msg.sender === 'user' ? 'order-1' : 'order-2'}`}>
                <div className={`p-4 rounded-2xl text-sm shadow-sm ${
                  msg.sender === 'user' ? 'bg-slate-800 text-slate-200' : 'bg-emerald-600 text-white rounded-tr-none'
                }`}>
                  {msg.type === 'text' ? (
                    msg.text
                  ) : (
                    <div className="space-y-3 min-w-[240px]">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-full">
                          <Mic size={18} />
                        </div>
                        <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden relative">
                          <div className="absolute inset-0 bg-emerald-500 w-[40%] h-full" />
                        </div>
                        <span className="text-[10px] opacity-70">0:12</span>
                        <button className="p-1.5 hover:bg-white/10 rounded-full transition-all">
                          <Play size={14} fill="currentColor" />
                        </button>
                      </div>
                      
                      {msg.isTranscribing ? (
                        <div className="flex items-center gap-2 py-2 border-t border-slate-700/50 mt-2 italic text-xs text-slate-400">
                          <Loader2 size={14} className="animate-spin text-emerald-500" />
                          Gemini is transcribing...
                        </div>
                      ) : msg.transcription ? (
                        <div className="pt-2 border-t border-slate-700/50 mt-2 text-xs leading-relaxed opacity-90">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                            <Languages size={10} /> AI Transcription
                          </div>
                          {msg.transcription}
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleTranscribe(msg.id)}
                          className="w-full flex items-center justify-center gap-2 py-1.5 mt-2 bg-slate-900/50 hover:bg-slate-900 text-slate-300 rounded-lg text-[10px] font-bold uppercase transition-all border border-slate-700"
                        >
                          <Languages size={14} />
                          Transcribe Message
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className={`flex items-center gap-2 mt-1.5 ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                  {msg.sender === 'bot' && (
                    <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold uppercase">
                      <Bot size={12} /> AI Response
                    </div>
                  )}
                  <span className="text-[10px] text-slate-500 font-medium">{msg.time}</span>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-center py-4">
             <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs px-4 py-2 rounded-lg flex items-center gap-2 italic">
               <ShieldAlert size={14} /> User asked for a "special discount" via voice. Rule: Trigger Handoff Suggestion.
             </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <div className="flex items-center gap-2 mb-3">
             <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"><Smile size={20} /></button>
             <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"><Paperclip size={20} /></button>
             <div className="flex-1" />
             <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold text-slate-500 uppercase">Input Mode:</span>
               <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                 <button className="px-3 py-1 text-[10px] font-bold uppercase rounded-md bg-emerald-500 text-white shadow-sm">Text</button>
                 <button className="px-3 py-1 text-[10px] font-bold uppercase rounded-md text-slate-400 hover:text-slate-200">AI Prompt</button>
               </div>
             </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-slate-800 border border-slate-700 rounded-xl flex items-center px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-500/50 transition-all">
              <input 
                type="text" 
                placeholder="Type your message here..."
                className="flex-1 bg-transparent border-none text-sm outline-none placeholder:text-slate-600"
              />
              <button className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Details Panel */}
      <div className="w-80 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col overflow-hidden">
        <h3 className="text-lg font-bold text-white mb-6">Contact Profile</h3>
        <div className="text-center mb-8">
          <img src={`https://picsum.photos/100/100?random=${selectedChat.id}`} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-slate-800 shadow-xl" alt="" />
          <h4 className="text-xl font-bold text-white">{selectedChat.name}</h4>
          <p className="text-sm text-slate-500">Verified Wholesale Partner</p>
        </div>
        
        <div className="space-y-6 flex-1">
          <div className="space-y-3">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stats</h5>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 font-bold mb-1">Total Spent</p>
                <p className="text-lg font-bold text-white">$4,281</p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 font-bold mb-1">Orders</p>
                <p className="text-lg font-bold text-white">12</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Metadata Tags</h5>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-lg border border-blue-500/20">VIP Lead</span>
              <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-bold rounded-lg border border-purple-500/20">Retailer</span>
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-500/20">Active Order</span>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Action Shortcuts</h5>
            <div className="space-y-2">
               <button className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold transition-all">Send Invoice</button>
               <button className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold transition-all">Block User</button>
               <button className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold transition-all">Mark as Converted</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveInbox;
