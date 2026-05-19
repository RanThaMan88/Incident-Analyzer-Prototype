# JurisLens: Forensic AI Analysis Platform Architecture

## 1. Full System Architecture
JurisLens is designed as a modular, AI-native forensic workstation. It follows a multi-tier architecture:
- **Frontend**: React-based Forensic Workstation UI.
- **Backend**: Node.js/Express API Gateway & AI Orchestrator.
- **AI Layer**: Multimodal pipeline using Gemini 1.5 Pro for video indexing and constitutional reasoning.
- **Storage**: Local filesystem for evidence caching + Firestore for metadata and case management.
- **Processing**: Asynchronous task queue for video/audio extraction and transcription.

## 2. Recommended Tech Stack
- **UI/UX**: React 18, Tailwind CSS, Motion (animation), Lucide (icons).
- **Backend**: Express.js (Node.js).
- **AI SDK**: `@google/genai` (Gemini API).
- **Video Processing**: `ffmpeg-static` / `fluent-ffmpeg` (local) + Gemini 1.5 (cloud multimodal).
- **Database**: Firestore (relational & document storage).
- **Vector Search**: Pinecone or local `hnswlib-node` for RAG.
- **Desktop Wrapper**: Electron (for future Windows deployment).

## 3. AI Model Allocation Strategy
- **Gemini 1.5 Pro**: Primary multimodal reasoner for deep constitutional analysis of long-form video.
- **Gemini 3 Flash**: Dedicated RAG agent for statutory search and rapid contradiction detection.
- **Google Search Grounding**: Critical tool for ensuring "up-to-the-minute" legal currency for ORS and Case Law.
- **WhisperX (Local/Python)**: For high-accuracy audio transcription if processing locally.

## 4. Cloud vs Local Processing Strategy
- **Local**:
    - Metadata indexing.
    - Video playback/streaming.
    - UI state and case management.
    - PII scrubbing (optional).
- **Cloud**:
    - Multimodal reasoning (Video/Audio/Text).
    - Heavy transcription and diarization.
    - RAG embedding generation.

## 5. Database Architecture
- **Cases Collection**: `caseID`, `clientName`, `incidentDate`, `jurisdiction`.
- **Evidence Collection**: `evidenceID`, `type`, `localPath`, `status` (processed/indexed).
- **Timelines Collection**: `eventID`, `timestamp`, `description`, `modalitySource`.
- **Analysis Collection**: `findingID`, `constitutionalIssue`, `severity`, `legalCitations`.

## 6. Vector/Retrieval (RAG) Architecture
- **Retriever**: Hybrid approach using Gemini Google Search Grounding to bypass legacy database latency.
- **Knowledge Base**: 
    - Real-time indexing of Oregon Revised Statutes (ORS) via Search API.
    - Constitutional Reference Engine (Oregon Art I Sections 9, 12).
    - Case Law Correlation (State v. Arreola, State v. Backstrand).
- **Context Injection**: 
    - Grounding chunks are extracted from Gemini responses and displayed as verified sources in the Analysis HUD.

## 7. Evidence Indexing Architecture
- Unique content hashing for forensic integrity.
- Frame-accurate timestamp mapping.
- Audio fingerprinting for cross-camera synchronization (Dashcam + Bodycam correlation).

## 8. Modular Component Architecture
- `/src/modules/Intake`: Evidence ingestion and validation.
- `/src/modules/Player`: Custom synchronized video/transcript player.
- `/src/modules/Analysis`: Constitutional and contradiction detection engines.
- `/src/modules/Reports`: Report generation (PDF/Markdown).

## 9. API Integration Architecture
- Unified `/api/analyze` endpoint that routes to specific sub-processes.
- WebSocket support for real-time progress updates during heavy video processing.

## 10. UI/UX Architecture
- **Forensic Theme**: Technical, precise, high-density (Dark mode by default to reduce eye strain).
- **Panels**:
    - Project Sidebar (Case management).
    - Multi-Player Stage (Sync'd video views).
    - Analysis HUD (Real-time finding overlay).
    - Legal Research Panel (Statute reference).

## 11. Folder/Storage Architecture
- `/cases/{case_uuid}/raw`: Unprocessed evidence.
- `/cases/{case_uuid}/cache`: Transcripts, extracted frames, metadata.
- `/cases/{case_uuid}/outputs`: Litigation packets and reports.

## 12. Recommended Frameworks
- **Frontend**: Vite + React + Radix UI + Tailwind.
- **Backend**: Express + TSX.
- **Docs**: React-PDF for high-fidelity legal exports.

## 13. Future Scalability Strategy
- Shift from monolithic Express to Microservices for heavy processing tasks.
- Implement specialized "State Engines" for different jurisdictions (e.g., California vs Oregon).

## 14. Security/Privacy Recommendations
- Local-first encryption for sensitive evidence.
- Audit logs for every AI interaction to maintain chain of custody.
- Opt-out of AI training data models (Enterprise API usage).

## 15. MVP Roadmap
- **Phase 1**: UI Shell + Video Upload + Manual Timeline.
- **Phase 2**: Gemini 1.5 Video Integration for Auto-Timeline.
- **Phase 3**: Constitutional Issue Overlay & Citation Engine.
- **Phase 4**: Litigation Packet Export.

## 16. Advanced Feature Roadmap
- Automatic license plate / face blurring for oversight agencies.
- "Contradiction Heatmap": Visualizing officer statements vs video reality.
- Collaborative review for law firms.

## 17. Commercialization Roadmap
- SaaS model for Law Firms.
- Local high-security enterprise version for Public Defenders.
- Tiered pricing based on analysis hours.

## 18. Development Phases
- **Sprint 1-2**: Design System & Core UI.
- **Sprint 3-4**: Backend Ingestion & Gemini Pipeline.
- **Sprint 5-6**: Legal Logic & Exporting.

## 19. Recommended Coding Architecture
- **Clean Architecture**: Domain-driven design.
- Separation of "Logic" (Legal Rules) from "Reasoning" (AI Models).

## 20. Suggested Repository Structure
## 21. Integration Guide: Airtable & Hyperagent
- **Case Synchronization**: 
    - Trigger: When a new case is created in JurisLens, create a corresponding record in the `Cases` Airtable via Hyperagent webhook.
    - Payload: `{ "case_id": "uuid", "client": "string", "jurisdiction": "Oregon" }`.
- **Event Logging**:
    - Every time an AI finding is confirmed in the Analysis HUD, push the event to the `AuditLog` table.
- **Evidence Management**:
    - Use Hyperagent to sync processed transcripts back to Airtable records for collaborative legal review.
