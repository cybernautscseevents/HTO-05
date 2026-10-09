# VOUCH — Product Specification

## 1. Product summary

VOUCH is a worker-owned digital professional identity for skilled and experience-based workers.

It allows a worker to:

- document work they have completed
- associate work with demonstrated skills
- attach supporting evidence
- request confirmations from people who can attest that the work happened
- build an explainable evidence profile
- share a public professional passport through a link or QR code

### One-line value proposition

> Your work. Vouched for.

### Core problem

Many skilled workers build substantial expertise through hands-on work, but their professional history is fragmented across memory, WhatsApp messages, paper records, photos, certificates, and personal references.

This creates a professional identity gap: a worker may have years of real experience but lack a portable, evidence-backed representation of what they have actually done.

### Product thesis

A professional reputation should not disappear when a worker changes employer, project, customer base, or location.

VOUCH gives that reputation a portable digital home.

---

## 2. Positioning

### VOUCH is

- a professional identity layer
- a work-history record
- an evidence repository
- a confirmation mechanism
- a public professional passport
- an explainable skill-evidence system

### VOUCH is not

- a job marketplace
- an Urban Company clone
- LinkedIn for blue-collar workers
- a review/rating platform
- a hiring portal
- a bidding platform
- a generic AI profile generator

The worker remains the center of the product.

---

## 3. Primary users

### Primary: Worker

Examples:

- electrician
- plumber
- carpenter
- welder
- mechanic
- technician
- driver
- machine operator
- construction worker
- repair specialist

Primary goals:

- preserve work history
- prove experience
- organize evidence
- build professional credibility
- share professional identity anywhere

### Secondary: Verifier

Examples:

- customer
- site supervisor
- employer
- contractor

Verifier goal:

- quickly confirm whether a recorded work event is accurate

The verifier is intentionally not given a complex dashboard.

### Tertiary: Viewer

A potential employer, contractor, customer, or judge may view a worker's public passport.

Viewer goal:

- understand what the worker has actually done
- inspect evidence and confirmations
- assess relevant experience

---

## 4. MVP user journeys

### Journey A — Create work record

1. Worker opens Add Work.
2. Worker describes work naturally by text or voice.
3. Backend sends description to AI.
4. AI returns structured work data.
5. Worker reviews and edits the extraction.
6. Worker attaches optional evidence.
7. Worker saves the work record.
8. Worker can request confirmation.

### Journey B — Confirm work

1. Worker requests confirmation.
2. System creates a secure confirmation token/link.
3. Verifier opens the link.
4. Verifier sees minimal work details.
5. Verifier chooses Confirm / Reject / Not sure.
6. Confirmation is stored.
7. Relevant skill evidence confidence is recalculated.

### Journey C — Public passport

1. Worker opens Passport.
2. Worker sees professional identity, demonstrated skills, work history, evidence and confirmations.
3. Worker shares passport URL or QR.
4. Viewer opens public URL without installing anything.

---

## 5. MVP screens

### 5.1 Dashboard

Purpose: worker's professional home.

Must contain:

- worker identity
- trade
- experience
- evidence coverage / professional strength
- demonstrated skills
- recent work
- confirmation count
- shortcut to Add Work
- shortcut to Passport

### 5.2 Add Work

Purpose: lowest-friction way to create a work record.

Core interaction:

> "Tell us about the work you completed."

Then show AI-extracted fields for confirmation/editing.

### 5.3 Work Record

Purpose: show the complete story behind one work event.

Must show:

- title
- date
- location
- quantity where relevant
- demonstrated skills
- evidence
- confirmation status
- verifier types/counts

### 5.4 Verification

Purpose: let a verifier confirm a work record in under one minute.

Must be simple and mobile-first.

### 5.5 Public Professional Passport

Purpose: the strongest shareable artifact and hackathon demo surface.

Must show:

- name
- trade
- experience
- evidence confidence / coverage
- skill-specific confidence
- work history
- evidence counts
- confirmation counts
- individual work records
- QR/share action

---

## 6. Skill confidence

VOUCH does not claim to objectively measure skill.

Use the phrase:

> Evidence confidence

Example:

> Panel Installation — 87% evidence confidence

Supporting explanation:

- 6 relevant work records
- 4 independent confirmations
- 8 work photos
- 2 supporting documents

The score represents the strength of available evidence, not an objective measurement of ability.

---

## 7. Product success criteria for the hackathon

The prototype succeeds if a judge can understand the product without explanation after seeing this flow:

1. Worker has experience.
2. Worker records a completed project.
3. VOUCH structures the work.
4. Evidence is attached.
5. Someone confirms the work.
6. The worker's evidence profile becomes stronger.
7. The worker shares a passport.
8. Judge scans QR and sees the professional history.

---

## 8. Post-MVP ideas — do not build unless MVP is complete

- evidence-based requirement matching
- multilingual voice entry
- richer document parsing
- employment history
- credential integrations
- analytics
- offline-first data capture
- native applications

These are future directions, not MVP requirements.
