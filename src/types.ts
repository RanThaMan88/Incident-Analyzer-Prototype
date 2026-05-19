export type ConstitutionalIssue = '4th Amendment' | '5th Amendment' | '1st Amendment' | '14th Amendment' | 'Oregon Art I Sec 9' | 'Oregon Art I Sec 12' | 'Search & Seizure';

export interface TimelineEvent {
  id: string;
  timestamp: string; // HH:MM:SS
  type: 'encounter' | 'search' | 'seizure' | 'verbal' | 'use_of_force' | 'miranda' | 'contradiction' | 'incident' | 'legal';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  constitutionalIssues?: ConstitutionalIssue[];
}

export interface Case {
  id: string;
  name: string;
  client: string;
  incidentDate: string;
  status: 'draft' | 'analyzing' | 'completed';
}

export interface Evidence {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'document' | 'photo';
  status: 'unprocessed' | 'indexed' | 'flagged';
  thumbnail?: string;
}
