# VOUCH — API Contract

Base path:

```text
/api
```

## Worker

### GET /workers/me

Returns current worker profile.

Response:

```json
{
  "id": "worker_001",
  "name": "Ravi Kumar",
  "trade": "Electrical Technician",
  "experience_years": 9,
  "location": "Mangaluru",
  "work_count": 24,
  "confirmation_count": 18
}
```

### GET /workers/{worker_id}

Returns public-safe worker information.

---

## Work

### POST /work

Create a work record.

Request:

```json
{
  "title": "Commercial Panel Installation",
  "description": "Installed six electrical panels at a commercial building.",
  "date": "2026-10-07",
  "location": "Mangaluru",
  "quantity": 6,
  "quantity_unit": "panels",
  "skill_ids": ["skill_panel"]
}
```

### GET /work

List current worker's work records.

### GET /work/{work_id}

Return work record with:

- skills
- evidence
- confirmations
- derived confidence

---

## AI

### POST /ai/extract-work

Request:

```json
{
  "text": "I installed six electrical panels at a commercial building last week."
}
```

Response:

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
  "location": null,
  "confidence": 0.91
}
```

The frontend must let the worker edit this result before saving.

---

## Evidence

### POST /evidence

Request:

```json
{
  "work_record_id": "work_001",
  "type": "PHOTO",
  "url": "https://...",
  "description": "Completed panel installation"
}
```

### GET /work/{work_id}/evidence

Returns evidence attached to a work record.

---

## Confirmations

### POST /confirmations/request

Request:

```json
{
  "work_record_id": "work_001",
  "verifier_name": "Anil Sharma",
  "verifier_type": "SUPERVISOR"
}
```

Response includes a confirmation URL/token for demo use.

### GET /confirmations/{token}

Returns minimal work information suitable for a verifier.

### POST /confirmations/{token}/confirm

Request:

```json
{
  "decision": "CONFIRMED"
}
```

Allowed decisions:

- CONFIRMED
- REJECTED
- NOT_SURE

---

## Passport

### GET /passport/{public_slug}

Returns public-safe profile data:

- identity
- trade
- experience
- skills
- evidence confidence
- work history
- confirmation counts

Never expose:

- email
- phone
- private evidence URLs unless intentionally public
- internal tokens
- private notes

---

## Error format

Use a consistent structure:

```json
{
  "error": {
    "code": "WORK_NOT_FOUND",
    "message": "Work record was not found."
  }
}
```

Frontend should display user-friendly messages and never expose stack traces.
