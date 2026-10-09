# VOUCH — Engineering Architecture

## 1. Architecture principle

Keep the system simple enough to ship in a 20-hour hackathon.

Use one frontend, one backend, one database, one storage layer, and one AI integration.

Do not introduce microservices unless a concrete blocker appears.

---

## 2. High-level architecture

```text
                         VOUCH
                           |
                  Mobile-first React
                           |
        +------------------+------------------+
        |                  |                  |
      Worker            Verify             Passport
       App               Flow               Public
        |                  |                  |
        +------------------+------------------+
                           |
                        REST API
                           |
                         FastAPI
                           |
        +------------------+------------------+
        |                  |                  |
    PostgreSQL          AI Service         Storage
        |                  |                  |
    Workers             Extraction         Photos
    Skills              Classification      Documents
    Work                Summaries
    Evidence
    Confirmations
        |
        +------------------+
                           |
                    Evidence Engine
                           |
                    Skill Confidence
```

---

## 3. Frontend

Recommended:

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- a small reusable component system

Suggested structure:

```text
src/
  app/
    router.tsx
    providers.tsx

  pages/
    Dashboard.tsx
    AddWork.tsx
    WorkRecord.tsx
    Verification.tsx
    Passport.tsx
    Profile.tsx

  components/
    ui/
    SkillCard.tsx
    WorkCard.tsx
    EvidenceBadge.tsx
    ConfidenceScore.tsx
    BottomNav.tsx
    PassportHeader.tsx

  services/
    api.ts
    work.ts
    evidence.ts
    passport.ts

  hooks/
    useWorker.ts
    useWorkRecords.ts
    useSkills.ts

  types/
    worker.ts
    work.ts
    evidence.ts

  main.tsx
```

Do not create a giant monolithic component.

---

## 4. Responsive strategy

Mobile-first.

Target primary viewport:

- 360–430px wide

Also support:

- tablet
- desktop 1280px+

Use the same application and data layer.

Mobile:

- bottom navigation
- stacked content
- large touch targets
- short forms
- fixed/obvious primary actions

Desktop:

- sidebar or wider navigation
- two-column layouts where useful
- more information visible simultaneously

Do not create separate mobile and desktop codebases.

---

## 5. Backend

Recommended:

- FastAPI
- Python
- Pydantic
- PostgreSQL
- SQLAlchemy or Supabase client

Suggested module structure:

```text
backend/
  app/
    main.py

    api/
      auth.py
      workers.py
      skills.py
      work.py
      evidence.py
      confirmations.py
      passport.py
      ai.py

    models/
      worker.py
      skill.py
      work.py
      evidence.py
      confirmation.py

    services/
      ai_service.py
      evidence_engine.py
      passport_service.py

    schemas/
      worker.py
      work.py
      evidence.py
      confirmation.py

    core/
      config.py
```

---

## 6. API boundary

Frontend must communicate with the backend through a stable API layer.

Do not put database calls throughout React components.

React:

```text
Component
  -> hook/service
  -> API client
  -> FastAPI
```

Backend:

```text
API route
  -> service
  -> database
```

---

## 7. AI boundary

AI must never write directly to the database.

Flow:

```text
User input
  -> React
  -> POST /api/ai/extract-work
  -> AI provider
  -> structured JSON
  -> Pydantic validation
  -> frontend preview
  -> user confirmation
  -> POST /api/work
  -> database
```

This makes AI output editable and prevents hallucinated data from silently becoming a professional record.

---

## 8. Storage

Store binary files in object storage.

Recommended:

- Supabase Storage

Database stores metadata and URLs only.

```text
work/
  {work_id}/
    photo-1.jpg
    photo-2.jpg

documents/
  {work_id}/
    certificate.pdf
```

---

## 9. Public passport

A public passport can use a stable route:

```text
/passport/{public_slug}
```

Example:

```text
/passport/ravi-kumar-82a7
```

QR encodes the public URL.

The public page should not expose private user data.

---

## 10. Authentication

For the hackathon, authentication is not a blocking dependency.

Preferred order:

1. Build product using seeded/demo worker.
2. Complete end-to-end flow.
3. Add Supabase Auth if time permits.
4. Do not allow auth work to block the product demo.

Never commit credentials or API keys.
Use environment variables.
