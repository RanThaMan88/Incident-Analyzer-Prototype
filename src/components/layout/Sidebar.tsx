import React, { useState, useRef } from 'react';
import { FolderOpen, Plus, FileVideo, ShieldAlert, UploadCloud, AlertTriangle, LogOut } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'motion/react';
import { Case, Evidence } from '@/src/types';

interface SidebarProps {
  cases: Case[];
  activeCase?: Case;
  evidence: Evidence[];
  onUpload?: (files: FileList) => void;
  onCaseSelect?: (c: Case) => void;
}

export function Sidebar({ cases, activeCase, evidence, onUpload, onCaseSelect }: SidebarProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <aside className="w-80 h-screen bg-[#0A0A0A] border-r border-[#1F1F1F] flex flex-col font-sans z-20">
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3 mb-10 group cursor-pointer">
          <div className="p-2.5 bg-[#FF4F00] rounded-xl shadow-[0_0_20px_rgba(255,79,0,0.2)] transition-shadow group-hover:shadow-[0_0_30px_rgba(255,79,0,0.4)]">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tighter uppercase font-display">JurisLens</span>
        </div>

        <div className="space-y-1">
          <h2 className="text-[#444444] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Active Cases</h2>
          {cases.map((c) => (
            <div 
              key={c.id} 
              onClick={() => onCaseSelect?.(c)}
              className={`flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer group ${
                c.id === activeCase?.id 
                ? 'bg-white text-black shadow-apple' 
                : 'text-[#8E8E8E] hover:bg-[#141414] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderOpen className={`w-4 h-4 ${c.id === activeCase?.id ? 'text-[#FF4F00]' : 'text-[#444444]'}`} />
                <span className="text-xs font-semibold">{c.name}</span>
              </div>
              <div className={`w-1.5 h-1.5 rounded-full ${c.status === 'analyzing' ? 'bg-[#FF4F00] animate-pulse' : 'bg-green-500'}`} />
            </div>
          ))}
        </div>

        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#444444] text-[10px] font-bold uppercase tracking-[0.2em]">Evidence Vault</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 bg-[#1F1F1F] rounded-lg text-[#8E8E8E] hover:text-[#FF4F00] hover:bg-[#252525] transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-500px)] -mx-2 px-2">
            <div className="space-y-2">
              {evidence.length === 0 && (
                <p className="text-[10px] text-[#444444] font-bold uppercase tracking-widest text-center py-8">No evidence indexed</p>
              )}
              {evidence.map((e) => (
                <motion.div 
                  layout
                  key={e.id} 
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#0E0E0E] border border-[#1F1F1F] group cursor-pointer hover:border-[#333333] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#161616] rounded-xl flex items-center justify-center border border-[#1F1F1F] group-hover:border-[#FF4F00]/30 transition-colors">
                      <FileVideo className={`w-5 h-5 ${e.status === 'flagged' ? 'text-[#FF4F00]' : 'text-[#444444]'}`} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-white truncate w-32 leading-none mb-1">{e.name}</p>
                      <p className={`text-[9px] uppercase font-bold tracking-tighter ${
                        e.status === 'flagged' ? 'text-[#FF4F00]' : 'text-[#444444]'
                      }`}>{e.status}</p>
                    </div>
                  </div>
                  {e.status === 'flagged' && <AlertTriangle className="w-3 h-3 text-[#FF4F00] animate-pulse" />}
                </motion.div>
              ))}
              
              <div 
                className={`mt-4 border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all ${
                  isDragging ? 'border-[#FF4F00] bg-[#FF4F00]/5' : 'border-[#1F1F1F] hover:border-[#333333]'
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); onUpload?.(e.dataTransfer.files); }}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className={`w-6 h-6 mb-2 ${isDragging ? 'text-[#FF4F00]' : 'text-[#444444]'}`} />
                <p className="text-[10px] font-bold text-[#8E8E8E] uppercase tracking-tighter cursor-pointer">Ingest Evidence</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => e.target.files && onUpload?.(e.target.files)}
                  className="hidden" 
                  multiple 
                />
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="mt-auto p-8 border-t border-[#1F1F1F]">
        <div className="mb-6 p-4 bg-[#FF4F00]/5 border border-[#FF4F00]/20 rounded-2xl">
           <p className="text-[9px] font-bold text-[#FF4F00] uppercase tracking-widest mb-2">Notice</p>
           <p className="text-[10px] text-[#8E8E8E] font-medium leading-relaxed">
             Independent forensic technology service. No attorney-client relationship. Not legal advice.
           </p>
        </div>
      </div>
    </aside>
  );
}
