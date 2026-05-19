import React, { useState } from 'react';
import { Gavel, AlertCircle, FileText, ChevronRight, Activity, Search, AlertTriangle, Send, ExternalLink, Scale, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ConstitutionalIssue } from '@/src/types';
import Markdown from 'react-markdown';
import { motion } from 'motion/react';

interface AnalysisHUDProps {
  findings: {
    title: string;
    description: string;
    timestamp: string;
    issue: ConstitutionalIssue;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }[];
  onTimestampClick?: (time: string) => void;
}

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  sources?: { title: string; url: string }[];
}

export function AnalysisHUD({ findings, onTimestampClick }: AnalysisHUDProps) {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  const handleSendChat = async () => {
    if (!chatInput.trim() || isSending) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsSending(true);

    try {
      const response = await fetch('/api/legal-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg,
          history: chatHistory.map(h => ({ role: h.role, parts: [{ text: h.content }] }))
        }),
      });

      if (!response.ok) throw new Error('Failed to reach legal AI');
      const data = await response.json();
      
      setChatHistory(prev => [...prev, { 
        role: 'model', 
        content: data.text,
        sources: data.sources 
      }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'model', content: "Error: Could not retrieve legal analysis. Please check system logs." }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <aside className="w-[420px] h-screen bg-[#0A0A0A] border-l border-[#1F1F1F] flex flex-col font-sans z-20">
      <div className="p-8 pb-4 flex-1 flex flex-col min-h-0">
        <div className="mb-10">
          <h2 className="text-[#444444] text-[10px] uppercase font-bold tracking-[0.3em] mb-6">Forensic Analysis Engine</h2>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 bg-[#141414] rounded-[2rem] border border-[#1F1F1F] shadow-apple flex flex-col justify-between">
                <Activity className="w-5 h-5 text-[#FF4F00] mb-4" />
                <div>
                   <p className="text-2xl font-bold text-white tracking-tighter">88%</p>
                   <p className="text-[9px] text-[#444444] font-bold uppercase tracking-widest mt-1">Reliability Index</p>
                </div>
             </div>
             <div className="p-6 bg-[#141414] rounded-[2rem] border border-[#1F1F1F] shadow-apple flex flex-col justify-between">
                <AlertCircle className="w-5 h-5 text-[#FF4F00] mb-4" />
                <div>
                   <p className="text-2xl font-bold text-white tracking-tighter">{findings.length}</p>
                   <p className="text-[9px] text-[#444444] font-bold uppercase tracking-widest mt-1">Issues Identified</p>
                </div>
             </div>
          </div>
        </div>

        <Tabs defaultValue="findings" className="w-full flex-1 flex flex-col min-h-0">
          <TabsList className="w-full bg-[#141414] border border-[#1F1F1F] p-1 rounded-2xl mb-8">
            <TabsTrigger value="findings" className="flex-1 text-[10px] uppercase font-bold tracking-widest rounded-xl data-[state=active]:bg-[#1F1F1F] data-[state=active]:text-white text-[#444444]">
              Findings
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex-1 text-[10px] uppercase font-bold tracking-widest rounded-xl data-[state=active]:bg-[#1F1F1F] data-[state=active]:text-white text-[#444444]">
              AI Search
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="findings" className="mt-0 flex-1 min-h-0">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-6 pb-12">
                {findings.map((f, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="group"
                  >
                    <div 
                      className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-[#141414] p-2 -ml-2 rounded-xl transition-all w-fit"
                      onClick={() => onTimestampClick?.(f.timestamp)}
                    >
                       <span className="text-xs font-mono font-bold text-[#FF4F00]">{f.timestamp}</span>
                       <Badge variant="outline" className={`text-[9px] px-2 py-0.5 rounded-full border-[#1F1F1F] font-bold uppercase tracking-tighter ${f.severity === 'critical' ? 'bg-red-500/10 text-red-500' : 'text-[#8E8E8E]'}`}>
                        {f.issue}
                      </Badge>
                    </div>
                    <Card className="bg-[#141414]/50 border-[#1F1F1F] p-6 rounded-[2.5rem] group-hover:border-[#333333] group-hover:shadow-2xl transition-all">
                      <h4 className="text-white text-sm font-bold mb-3 flex items-center justify-between group-hover:text-[#FF4F00] transition-colors">
                        {f.title}
                        <ChevronRight className="w-4 h-4 text-[#1F1F1F] group-hover:text-white transition-colors" />
                      </h4>
                      <p className="text-[11px] text-[#8E8E8E] leading-relaxed font-medium">
                        {f.description}
                      </p>
                      
                      <div className="mt-6 pt-6 border-t border-[#1F1F1F] flex items-center justify-between">
                         <div className="flex gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#1F1F1F] border border-[#333333] flex items-center justify-center">
                              <Search className="w-3 h-3 text-[#444444]" />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-[#1F1F1F] border border-[#333333] flex items-center justify-center">
                              <Scale className="w-3 h-3 text-[#444444]" />
                            </div>
                         </div>
                         <div className="text-right">
                           <p className="text-[8px] text-[#444444] uppercase font-bold tracking-widest">Confidience</p>
                           <p className="text-[10px] text-white font-bold font-mono">92.4%</p>
                         </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="chat" className="mt-0 flex-1 flex flex-col min-h-0 bg-[#0E0E0E] rounded-[2.5rem] border border-[#1F1F1F] overflow-hidden shadow-apple">
             <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {chatHistory.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
                       <MessageSquare className="w-12 h-12 mb-4 text-[#8E8E8E]" />
                       <h4 className="text-sm font-bold font-display uppercase tracking-widest">Legal RAG Hub</h4>
                       <p className="text-[10px] mt-2 max-w-[200px]">Query the Oregon Revised Statutes and Constitutional Article I via live search grounding.</p>
                    </div>
                  )}
                  {chatHistory.map((h, i) => (
                    <div key={i} className={`flex flex-col ${h.role === 'user' ? 'items-end' : 'items-start'}`}>
                       <div className={`max-w-[92%] p-5 rounded-[2rem] text-xs leading-relaxed font-medium ${
                         h.role === 'user' 
                          ? 'bg-white text-black rounded-br-none shadow-xl' 
                          : 'bg-[#1F1F1F] text-[#E0E0E0] rounded-bl-none border border-[#333333]'
                       }`}>
                         <div className="markdown-body prose prose-invert prose-xs">
                            <Markdown>{h.content}</Markdown>
                         </div>
                       </div>
                       {h.sources && h.sources.length > 0 && (
                         <div className="mt-3 flex flex-wrap gap-2">
                           {h.sources.map((s, si) => (
                             <a 
                               key={si} 
                               href={s.url} 
                               target="_blank" 
                               rel="noreferrer"
                               className="text-[9px] font-bold text-[#8E8E8E] hover:text-white flex items-center gap-2 bg-[#141414] px-3 py-1.5 rounded-full border border-[#1F1F1F] transition-colors"
                             >
                               <ExternalLink className="w-2.5 h-2.5" />
                               {s.title.slice(0, 24)}...
                             </a>
                           ))}
                         </div>
                       )}
                    </div>
                  ))}
                  {isSending && (
                    <div className="flex items-center gap-3 text-[#FF4F00] text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">
                       <Activity className="w-3.5 h-3.5" /> Searching Statute Grounds...
                    </div>
                  )}
                </div>
             </ScrollArea>
             <div className="p-6 border-t border-[#1F1F1F] bg-[#0A0A0A]">
                <div className="relative group">
                   <input 
                     value={chatInput}
                     onChange={(e) => setChatInput(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                     placeholder="Search Article I Sec 9, ORS 810.410..."
                     className="w-full bg-[#141414] border border-[#1F1F1F] rounded-full py-4 pl-6 pr-14 text-xs text-white focus:outline-none focus:border-[#FF4F00] focus:ring-4 focus:ring-[#FF4F00]/5 transition-all placeholder:text-[#333333] font-medium"
                   />
                   <button 
                     onClick={handleSendChat}
                     disabled={isSending || !chatInput.trim()}
                     className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#FF4F00] hover:bg-[#FF8C00] text-white p-2.5 rounded-full disabled:bg-[#1F1F1F] disabled:text-[#333333] transition-all shadow-xl active:scale-90"
                   >
                     <Send className="w-4 h-4" />
                   </button>
                </div>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  );
}
