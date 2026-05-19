import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Stage } from './components/layout/Stage';
import { AnalysisHUD } from './components/layout/AnalysisHUD';
import { Case, Evidence, TimelineEvent } from './types';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from 'sonner';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'motion/react';
import { Shield, ArrowRight } from 'lucide-react';

import { LegalFooter } from './components/layout/LegalFooter';

const MOCK_CASES: Case[] = [
  { id: '1', name: 'State v. Case-0012', client: 'Confidential Client', incidentDate: '2026-03-12', status: 'analyzing' },
  { id: '2', name: 'Petitioner v. Municipal PD', client: 'Confidential Client', incidentDate: '2025-11-20', status: 'completed' },
];

function MainApp() {
  const [activeCase, setActiveCase] = useState<Case | null>(MOCK_CASES[0]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [currentTime, setCurrentTime] = useState('00:06:45');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleTimestampClick = (time: string) => {
    setCurrentTime(time);
  };

  const handleUpload = async (files: FileList) => {
    const newEvidenceList: Evidence[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      caseId: activeCase?.id || '1',
      name: file.name,
      type: file.type.startsWith('video/') ? 'video' : 'pdf' as any,
      status: 'unprocessed',
      createdAt: new Date().toISOString()
    }));
    
    setEvidence(prev => [...prev, ...newEvidenceList]);
    toast.info(`Indexing ${files.length} evidence items...`);

    // Automatic trigger analysis for first item
    if (newEvidenceList[0].type === 'video') {
      triggerAnalysis(newEvidenceList[0]);
    }
  };

  const triggerAnalysis = async (item: Evidence) => {
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/analyze-encounter', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transcript: `00:06:30 - Officer: Step out of the vehicle.
00:06:45 - Officer: Hands where I can see them. I'm searching the trunk.
00:06:50 - Subject: Why? I do not consent to any searches!
00:07:15 - Officer: There's a baggie here. You're under arrest.`,
          officerStatement: "Subject appeared nervous upon contact. Consent was requested and implied by subsequent cooperation. Subject was Mirandized at 00:09:12.",
          caseInfo: activeCase
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Map server response to timeline
      const newEvents: TimelineEvent[] = data.events.map((e: any, i: number) => ({
        id: `e-${i}-${Date.now()}`,
        timestamp: e.time,
        type: e.type,
        description: e.description,
        severity: e.severity,
        constitutionalIssues: data.violations
          ?.filter((v: any) => v.description.includes(e.description))
          ?.map((v: any) => v.statute) || []
      }));

      // Add contradictions if any
      if (data.contradictions) {
        data.contradictions.forEach((c: any, i: number) => {
          newEvents.push({
            id: `c-${i}-${Date.now()}`,
            timestamp: c.timestamp,
            type: 'contradiction',
            description: `CONTRADICTION: Statement says "${c.statement}" but video reveals "${c.reality}". ${c.legal_impact}`,
            severity: 'critical'
          });
        });
      }

      setEvents(newEvents);
      setEvidence(prev => prev.map(e => e.id === item.id ? { ...e, status: 'flagged' } : e));
      toast.success('Forensic analysis complete');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex bg-black text-white h-screen overflow-hidden font-sans">
      <Sidebar 
        activeCase={activeCase} 
        cases={MOCK_CASES} 
        evidence={evidence}
        onCaseSelect={setActiveCase}
        onUpload={handleUpload}
      />
      <Stage 
        events={events} 
        currentTime={currentTime} 
        onTimestampClick={handleTimestampClick} 
      />
      <AnalysisHUD 
        findings={events.filter(e => e.type !== 'encounter').map(e => ({
          timestamp: e.timestamp,
          title: e.type === 'contradiction' ? 'Contradiction Found' : e.description,
          description: e.description,
          issue: (e.constitutionalIssues?.[0] as any) || (e.type === 'contradiction' ? '14th Amendment' : 'Search & Seizure'),
          severity: e.severity
        }))} 
        onTimestampClick={handleTimestampClick}
      />

      <div className="fixed bottom-0 left-80 right-0 z-50">
         <div className="bg-[#FF4F00] text-black py-1 px-4 text-[9px] font-bold uppercase tracking-[0.2em] flex justify-center items-center gap-4">
            <span>Independent Technology Service — No Attorney-Client Relationship</span>
            <span className="w-1 h-1 bg-black rounded-full" />
            <span>Informational Purposes Only — Not Legal Advice</span>
            <span className="w-1 h-1 bg-black rounded-full" />
            <span>Strict UPL Protocol Enforcement Active</span>
         </div>
      </div>
      
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center">
           <div className="text-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-[#FF4F00] border-t-transparent rounded-full mx-auto mb-6"
              />
              <p className="text-xl font-bold font-display tracking-widest uppercase">Forensic State Reasoning...</p>
              <p className="text-[10px] text-[#8E8E8E] font-bold uppercase tracking-[0.2em] mt-2">Grounding Oregon Art I statutes</p>
           </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <TooltipProvider>
      <MainApp />
      <Toaster theme="dark" position="top-right" closeButton richColors />
    </TooltipProvider>
  );
}
