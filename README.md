# VOUCH — Engineering & Product Source of Truth

VOUCH is a mobile-first responsive web application that gives skilled workers a portable, evidence-backed professional identity.

## Core positioning

> VOUCH is not a job marketplace. It is a professional identity and evidence layer for skilled workers.

The worker owns their professional record. Work records can be supported by photos, documents, certificates, and confirmations from customers, supervisors, or employers.

## Core demo loop

Worker → Describe Work → AI extracts structured record → Add Evidence → Request Confirmation → Evidence Confidence updates → Public Professional Passport → QR share.

## Source-of-truth documents

- `01-product-spec.md` — product vision, users, scope, requirements, UX flows
- `02-engineering-architecture.md` — system architecture and implementation boundaries
- `03-data-model.md` — Firestore collections and relationships
- `04-api-contract.md` — frontend/backend API contracts
- `05-ui-design-system.md` — visual language and component rules
- `06-ai-evidence-engine.md` — AI responsibilities and deterministic evidence scoring
- `07-hackathon-execution.md` — 20-hour build plan, team ownership, integration rules
- `08-demo-script.md` — judging/demo flow and product narrative
- `09-agent-context.md` — compact context intended to be pasted into coding agents

## Non-negotiable product constraints

1. VOUCH must not become a generic job marketplace.
2. Do not build payments, booking, bidding, messaging, or job applications in the MVP.
3. AI is infrastructure, not the product.
4. Evidence confidence must be explainable.
5. Never claim that a numerical confidence score is a measurement of actual skill.
6. The public passport is a first-class experience.
7. Mobile-first responsive web; do not build a native Android app for the hackathon.
8. Prioritize one complete vertical slice over many incomplete features.
9. UI must look like a deliberate professional product, not an AI-generated hackathon dashboard.
10. No blockchain, healthcare, fintech, agriculture, or cybersecurity features.

## Current technical direction

Frontend: React + TypeScript + Tailwind CSS  
Backend: FastAPI + Python + Pydantic  
Database: Firebase Firestore  
File storage: Firebase Storage  
Authentication: Firebase Auth (optional for MVP; seeded/demo worker can be used first)  
AI: Gemini or OpenAI API  
Public sharing: QR code → public passport URL

## Firebase architecture rule

Use the Firebase Admin SDK from FastAPI for database/storage operations. Keep React → FastAPI → Firebase as the main data path so validation and evidence-scoring logic remain centralized in the backend.

Do not introduce PostgreSQL, Supabase, SQLAlchemy, SQL migrations, or relational join tables for the MVP.

The implementation may change libraries if the team has a faster path, but the product contracts and architectural boundaries should remain stable.
