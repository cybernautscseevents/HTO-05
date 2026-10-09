# VOUCH — Data Model

## Entity relationship

```text
User
 |
 +-- WorkerProfile
 |
 +--< WorkRecord
          |
          +--< WorkSkill >-- Skill
          |
          +--< Evidence
          |
          +--< Confirmation
```

## users

| Field | Type | Notes |
|---|---|---|
| id | UUID | primary key |
| name | text | display name |
| email | text | optional for demo |
| phone | text | optional |
| role | enum | WORKER / VERIFIER |
| created_at | timestamp | |

## worker_profiles

| Field | Type | Notes |
|---|---|---|
| id | UUID | primary key |
| user_id | UUID | FK users |
| trade | text | e.g. Electrician |
| experience_years | integer | |
| location | text | broad location |
| bio | text | optional |
| profile_photo_url | text | optional |

## skills

| Field | Type | Notes |
|---|---|---|
| id | UUID | |
| name | text | |
| category | text | optional |

## work_records

| Field | Type | Notes |
|---|---|---|
| id | UUID | |
| worker_id | UUID | FK worker_profiles |
| title | text | |
| description | text | original description |
| date | date | |
| location | text | |
| quantity | numeric | optional |
| quantity_unit | text | optional |
| status | enum | DRAFT / PENDING / CONFIRMED / REJECTED |
| created_at | timestamp | |

## work_skills

| Field | Type |
|---|---|
| work_id | UUID |
| skill_id | UUID |

Composite key: work_id + skill_id.

## evidence

| Field | Type | Notes |
|---|---|---|
| id | UUID | |
| work_record_id | UUID | |
| type | enum | PHOTO / DOCUMENT / CERTIFICATE / WORK_ORDER |
| url | text | object storage URL |
| description | text | |
| created_at | timestamp | |

## confirmations

| Field | Type | Notes |
|---|---|---|
| id | UUID | |
| work_record_id | UUID | |
| verifier_name | text | |
| verifier_type | enum | CUSTOMER / SUPERVISOR / EMPLOYER |
| status | enum | PENDING / CONFIRMED / REJECTED |
| token_hash | text | secure confirmation token |
| created_at | timestamp | |

## Derived values

Do not store skill confidence initially.

Calculate from:

- relevant work records
- evidence types
- confirmations
- confirmation types

This keeps the model simple and makes scoring logic easy to change.

## Demo seed data

Create one polished demo worker:

Ravi Kumar  
Electrical Technician  
9 years experience  
Mangaluru

Suggested work:

1. Commercial Panel Installation — 6 panels — confirmed
2. Residential Wiring — 12 projects — mostly confirmed
3. Industrial Motor Maintenance — 8 projects — partially confirmed

Suggested skills:

- Residential Wiring
- Panel Installation
- Motor Repair
- Industrial Maintenance

The data should be internally consistent across dashboard, work records and passport.
