# VOUCH — Hackathon Execution Plan

## Objective

Ship one polished, convincing vertical slice within approximately 20 hours.

The objective is not feature completeness.

The objective is:

> A judge can experience the full VOUCH story without encountering broken flows.

---

## 1. Team ownership

### Person 1 — Frontend / Worker Experience

Own:

- app shell
- dashboard
- navigation
- Add Work UI
- reusable components
- responsive behavior

### Person 2 — Backend / Data

Own:

- database
- models
- CRUD APIs
- seed data
- confirmation endpoints
- passport API

### Person 3 — AI / Evidence Engine

Own:

- AI extraction
- skill normalization
- evidence scoring
- evidence summaries
- scoring tests

### Person 4 — Passport / Verification

Own:

- Work Record
- Verification screen
- Public Passport
- QR generation
- sharing flow

### Product/integration owner

Own:

- product consistency
- integration
- git/release discipline
- demo data
- final polish
- pitch

---

## 2. First 2 hours

### Hour 0–1

- create repository
- establish frontend
- establish backend
- establish database
- establish environment variables
- agree API types
- establish design tokens

### Hour 1–2

Build:

- VOUCH shell
- mobile navigation
- Dashboard
- placeholder Passport
- Add Work entry point

At the end of hour 2, the app should already look like VOUCH.

---

## 3. Hours 2–6

Build core data:

- worker
- skills
- work records
- evidence
- confirmations

Build fake data immediately.

Do not wait for all APIs before building UI.

---

## 4. Hours 4–9

Build Add Work:

```text
Describe work
  ->
AI extraction
  ->
Review
  ->
Attach evidence
  ->
Save
```

This is the primary product interaction.

---

## 5. Hours 7–12

Build:

- Work Record
- evidence display
- confirmation request
- verification page

Test confirmation end-to-end.

---

## 6. Hours 10–15

Build:

- evidence engine
- skill confidence
- public passport
- QR

Now the complete demo loop should work.

---

## 7. Hours 15–17

Integration and polish:

- fix responsive issues
- fix API errors
- improve typography
- improve spacing
- remove placeholder content
- add loading/error states
- verify QR
- test from a clean browser

---

## 8. Hours 17–20

No major new features.

Only:

- bugs
- visual polish
- performance
- demo data
- pitch
- rehearsal

If a feature is not necessary to demonstrate the core thesis, do not add it.

---

## 9. Git discipline

Use:

```text
main
develop
feature/*
```

Every feature branch should be small.

Suggested commits:

```text
feat: add worker dashboard
feat: add work record API
feat: add AI work extraction
feat: add verification flow
feat: add public passport
fix: mobile passport overflow
```

Merge frequently.

Do not allow long-lived branches to diverge for the entire hackathon.

---

## 10. Integration contract

Frontend should be able to develop with mocked responses matching the final API shape.

Backend should not wait for finished UI.

AI should expose deterministic structured output.

---

## 11. Definition of done

A feature is done only when:

- it works on mobile
- it works with seeded demo data
- loading state exists
- failure state exists
- API errors are handled
- there are no console errors
- UI matches the design system
- another team member can run it

---

## 12. Cut list

Immediately cut if time is running out:

- real authentication
- advanced employer dashboard
- job marketplace
- chat
- payments
- booking
- recommendation engine
- complex analytics
- native app
- custom voice infrastructure

Never cut:

- Add Work
- evidence
- confirmation
- evidence confidence
- public passport
- QR
