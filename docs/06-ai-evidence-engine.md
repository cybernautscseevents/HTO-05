# VOUCH — AI & Evidence Engine Specification

## 1. AI philosophy

AI is a supporting capability.

It should make VOUCH easier to use, not become the product itself.

AI has three responsibilities:

1. Natural language → structured work record
2. Work description → standardized skills
3. Evidence set → concise human-readable summary

Everything else should be deterministic application logic.

---

## 2. Work extraction

Input example:

> I installed six electrical panels at a commercial building last week.

Expected output:

```json
{
  "title": "Commercial Panel Installation",
  "trade": "Electrical",
  "skills": [
    "Panel Installation",
    "Commercial Electrical"
  ],
  "quantity": 6,
  "quantity_unit": "panels",
  "date": "2026-10-07",
  "location": null
}
```

The model must return JSON matching a schema.

Backend must validate the output.

Never allow arbitrary model output directly into the database.

---

## 3. Skill normalization

Use a controlled skill vocabulary where possible.

Example mappings:

```text
"wired houses"
"house wiring"
"residential electrical wiring"

        -> Residential Wiring
```

The goal is consistency across profiles.

For the hackathon, a small seeded skill taxonomy is sufficient.

---

## 4. Evidence types

Initial types:

- Worker declaration
- Photo
- Document
- Certificate
- Work order
- Customer confirmation
- Supervisor confirmation
- Employer confirmation

The worker declaration is the weakest evidence.

Independent confirmation is stronger.

---

## 5. Illustrative evidence weights

These are product heuristics, not scientific truth.

```text
Worker declaration       10
Photo                    15
Document                 20
Certificate              20
Customer confirmation    25
Supervisor confirmation  30
Employer confirmation    30
```

A scoring implementation may normalize weighted evidence into a 0–100 range.

Avoid making the score grow without bound.

---

## 6. Example scoring

Suppose Panel Installation has:

- 6 relevant work records
- 8 photos
- 2 documents
- 2 supervisor confirmations
- 1 customer confirmation

The engine computes a bounded score such as 87.

The UI explains the score instead of pretending it is objectively true.

---

## 7. Important anti-gaming considerations

For MVP:

- duplicate confirmations should not count repeatedly
- the same verifier should not create unlimited confidence
- rejected confirmations should reduce confidence/support
- evidence should be attached to a specific work record
- confidence should be skill-specific

Future:

- verifier history
- organization trust weighting
- anomaly detection
- evidence duplication detection
- temporal consistency checks

Do not build these future mechanisms unless the MVP is complete.

---

## 8. Evidence graph

Conceptually:

```text
Worker
  |
  +-- Skill
       |
       +-- Work Record
            |
            +-- Photo
            +-- Document
            +-- Customer Confirmation
            +-- Supervisor Confirmation
```

This graph is the technical heart of VOUCH.

The product is not simply storing a resume.

It is connecting professional claims to evidence.

---

## 9. AI prompt requirements

System prompt should enforce:

- return only schema-compliant JSON
- do not invent dates
- do not invent quantities
- do not invent certifications
- use null when information is absent
- distinguish explicit facts from inferred classifications
- normalize skills to supplied vocabulary when possible

If a date is ambiguous, return null rather than fabricate it.

---

## 10. Voice

For the MVP, do not build custom speech recognition unless already available.

Use browser/device speech input if practical.

Voice is an input convenience, not a core architecture dependency.
