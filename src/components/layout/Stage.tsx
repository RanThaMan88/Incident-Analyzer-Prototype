import React, { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Maximize, Settings, Clock, AlertTriangle, MessageSquare, ChevronRight, Activity, Eye, Zap as ZapIcon, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TimelineEvent } from '@/src/types';

interface StageProps {
  events: TimelineEvent[];
  currentTime: string;
  onTimestampClick?: (time: string) => void;
}

export function Stage({ events, currentTime, onTimestampClick }: StageProps) {
  return (
    <main className="flex-1 h-screen bg-[#050505] overflow-y-auto font-sans p-8 scroll-smooth z-10">
      <div className="max-w-6xl mx-auto space-y-12 pb-24">
        
        {/* Cinematic Player Section */}
        <section className="relative group">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF4F00] shadow-[0_0_10px_#FF4F00]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8E8E8E]">Forensic Stream Analysis</span>
             </div>
             <div className="flex items-center gap-6 text-[10px] font-mono text-[#444444] font-bold">
                <span className="hidden sm:inline">BUFFER: 100%</span>
                <span className="text-white bg-[#141414] px-2 py-0.5 rounded tracking-widest uppercase">STREAM: EST-1129</span>
             </div>
          </div>
          
          <div className="aspect-video bg-black rounded-[3rem] border border-[#1F1F1F] overflow-hidden shadow-2xl relative group-hover:border-[#333333] transition-all">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-24 h-24 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center border border-white/20 cursor-pointer shadow-2xl"
              >
                 <Play className="w-10 h-10 text-white fill-white ml-1" />
              </motion.div>
            </div>
            
            <div className="absolute bottom-12 left-12 right-12">
               <div className="flex items-center gap-6">
                  <span className="text-sm font-mono font-bold tracking-widest text-white">{currentTime}</span>
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: '0%' }}
                        animate={{ width: '45%' }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="h-full bg-white shadow-[0_0_20px_rgba(255,255,255,1)]" 
                     />
                  </div>
                  <span className="text-sm font-mono font-bold tracking-widest text-white/40">24:12</span>
               </div>
            </div>
          </div>
        </section>

        {/* Extraction Timeline Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-4xl font-bold font-display tracking-tight mb-2">Event Extraction</h3>
              <p className="text-[#444444] text-[10px] uppercase font-bold tracking-[0.2em]">Automated finding correlation engine</p>
            </div>
            <Badge variant="outline" className="bg-[#141414] border-[#1F1F1F] tracking-widest uppercase text-[10px] px-6 py-2 rounded-full font-bold text-[#8E8E8E]">
               {events.length} Key Segments
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event, idx) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, border: '1px solid #333' }}
                className="bg-[#0E0E0E] p-8 rounded-[2.5rem] border border-[#1F1F1F] transition-all shadow-apple group cursor-pointer relative overflow-hidden"
                onClick={() => onTimestampClick?.(event.timestamp)}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FF4F00]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${
                      event.severity === 'critical' ? 'bg-red-500/10 text-red-500' :
                      event.severity === 'high' ? 'bg-[#FF4F00]/10 text-[#FF4F00]' :
                      'bg-[#1F1F1F] text-[#8E8E8E]'
                    } transition-colors group-hover:bg-[#FF4F00] group-hover:text-white`}>
                      {event.type === 'incident' ? <ZapIcon className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#444444] group-hover:text-white transition-colors tracking-widest">
                      {event.timestamp}
                    </span>
                  </div>
                  <Badge className={`${
                    event.severity === 'critical' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' :
                    event.severity === 'high' ? 'bg-[#FF4F00] shadow-[0_0_15px_rgba(255,79,0,0.3)]' :
                    'bg-[#1F1F1F]'
                  } text-[8px] uppercase font-bold px-3 py-1 rounded-full`}>
                    {event.severity}
                  </Badge>
                </div>
                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-[#FF4F00] transition-colors leading-tight tracking-tight">{event.description}</h4>
                <p className="text-xs text-[#8E8E8E] leading-relaxed mb-6 font-medium">
                  Found via multimodal AI correlation. System detected high confidence {event.type === 'legal' ? 'statutory violation' : 'procedural error'} under Article I.
                </p>
                
                {event.constitutionalIssues && (
                  <div className="flex flex-wrap gap-3">
                    {event.constitutionalIssues.map((issue) => (
                      <span key={issue} className="text-[10px] font-bold text-[#444444] border-b border-[#1F1F1F] tracking-tight uppercase group-hover:text-white group-hover:border-[#FF4F00] transition-colors">
                        {issue}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Case Context Section */}
        <section className="p-12 bg-gradient-to-br from-[#141414] to-[#0A0A0A] rounded-[3rem] border border-[#1F1F1F] relative overflow-hidden group">
           <div className="absolute inset-0 bg-[#FF4F00]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
           <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-5xl font-extrabold font-display tracking-tighter mb-6 leading-[0.95]">Precision law <br /><span className="text-[#FF4F00]">analysis.</span></h2>
                <p className="text-[#8E8E8E] text-base leading-relaxed mb-10 font-medium">
                   Every frame of BWC and Dashcam footage is cross-referenced against the Oregon Digest and Art I Sec 12. We reveal what is hidden between the lines.
                </p>
                <div className="flex flex-wrap gap-4">
                   <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:brightness-110 shadow-xl transition-all"
                   >
                      Generate Forensic Report
                   </motion.button>
                   <button className="px-10 py-5 bg-transparent border border-[#1F1F1F] text-[#8E8E8E] rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#1F1F1F] hover:text-white transition-all">
                      Case Evidence Hub
                   </button>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center p-8 bg-[#050505] rounded-[2.5rem] border border-[#1F1F1F] shadow-2xl relative">
                  <div className="absolute top-8 right-8">
                     <Activity className="w-8 h-8 text-[#FF4F00]/20 animate-pulse" />
                  </div>
                  <ScaleIcon className="w-20 h-20 text-[#FF4F00] mb-6 opacity-80" />
                  <div className="text-center">
                    <p className="text-4xl font-extrabold font-display tracking-tight text-white mb-1">88%</p>
                    <p className="text-[10px] font-bold text-[#444444] uppercase tracking-widest">Confessional Probability</p>
                  </div>
              </div>
           </div>
        </section>
      </div>
    </main>
  );
}
const ScaleIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
    <path d="M7 21h10" />
    <path d="M12 3v18" />
    <path d="M3 7h18" />
  </svg>
);
