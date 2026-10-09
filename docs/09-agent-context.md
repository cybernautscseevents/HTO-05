# VOUCH — Coding Agent Context

You are contributing to VOUCH, a hackathon prototype.

## Product

VOUCH is a mobile-first responsive web app for skilled workers to create a portable, evidence-backed professional identity.

Tagline:

> Your work. Vouched for.

## Core thesis

VOUCH is NOT a job marketplace.

It is a professional identity and evidence layer.

Worker → Work Record → Skills → Evidence → Confirmations → Evidence Confidence → Public Passport.

## Primary flow

1. Worker describes completed work.
2. AI extracts structured fields.
3. Worker reviews/edit.
4. Worker attaches evidence.
5. Worker requests confirmation.
6. Verifier confirms/rejects.
7. Evidence confidence is recalculated.
8. Worker shares public passport.
9. QR opens public passport.

## Tech direction

Frontend:
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

Backend:
- FastAPI
- Python
- Pydantic

Data:
- PostgreSQL / Supabase
- Supabase Storage for files

AI:
- Gemini or OpenAI API
- structured JSON output

## Architecture rules

- Keep architecture simple.
- Do not introduce microservices.
- Do not let AI write directly to the database.
- Validate AI output before persistence.
- Keep API access out of React components; use service/hooks.
- Keep evidence scoring deterministic.
- Use mock data when backend work is not yet available.
- Preserve stable API shapes.
- Do not build native Android.
- Mobile-first responsive web only.

## Product rules

Do not add:

- job marketplace
- payments
- booking
- bidding
- messaging
- job applications
- blockchain
- healthcare
- fintech
- agriculture
- cybersecurity
- generic ratings
- generic AI chatbot

Unless explicitly requested, do not expand scope.

## UI rules

The UI should feel:

- professional
- premium
- industrial/editorial
- calm
- information-dense but not cluttered

Avoid:

- purple AI gradients
- glassmorphism
- excessive cards
- generic SaaS dashboard patterns
- "AI-powered" labels everywhere

Use the shared VOUCH design tokens.

## Evidence terminology

Say:

> Evidence confidence

Do not say:

> Skill score

The number represents strength of available evidence, not objective skill.

## Demo worker

Ravi Kumar  
Electrical Technician  
9 years  
Mangaluru

Core skills:

- Residential Wiring
- Panel Installation
- Motor Repair
- Industrial Maintenance

## Critical screens

- Dashboard
- Add Work
- Work Record
- Verification
- Public Passport

## Priority

When deciding between two implementation options:

1. reliability
2. demo completeness
3. mobile UX
4. visual polish
5. technical sophistication

Do not sacrifice the complete vertical slice for a sophisticated subsystem.
