# VOUCH — UI Design System

## Design goal

VOUCH should feel like a serious professional identity product, not a generic hackathon dashboard.

Visual direction:

> Industrial + editorial + modern.

Avoid:

- purple AI gradients
- excessive glassmorphism
- glowing cards
- generic SaaS templates
- giant "AI powered" labels
- unnecessary illustrations
- excessive rounded cards
- dashboard clutter

## Suggested palette

```text
Background        #0B0D0C
Surface           #121615
Elevated          #181D1A

Primary           #C7F36B
Primary Dark      #8FAF42

Text              #F3F5EF
Secondary         #9CA59D
Muted             #68716B

Success           #8FE388
Warning           #F0C674
Danger            #EF7777
```

The accent should be used sparingly.

## Typography

Preferred:

- Headings: Manrope
- Body: Inter

Use strong typography for:

- worker name
- confidence percentages
- section labels
- project titles

## Layout

Mobile width target:

- 360–430px

Recommended mobile navigation:

```text
Home
Work
Passport
Profile
```

Use a prominent Add Work action.

## Dashboard hierarchy

1. Worker identity
2. Professional strength
3. Demonstrated skills
4. Recent work
5. Improvement/evidence suggestions

Do not fill every space with cards.

## Confidence display

Correct:

```text
Panel Installation
87%
Evidence confidence
```

Incorrect:

```text
87% Skill
```

Never imply the number objectively measures ability.

## Skill card

Should include:

- skill name
- confidence
- evidence count
- optional confirmation count

Example:

```text
Panel Installation
87%

6 work records
4 confirmations
```

## Work card

Should include:

- project title
- date
- short descriptor
- status
- evidence/confirmation indicators

Example:

```text
Commercial Panel Installation
07 Oct 2026 · 6 panels

✓ Confirmed
5 evidence items
```

## Verification screen

Minimal.

The verifier should see:

- VOUCH branding
- worker
- work title
- date
- quantity
- location
- Confirm
- Reject
- Not sure

No dashboard.
No account creation.
No unnecessary navigation.

## Public passport

The passport is the most important visual artifact.

Hierarchy:

```text
VOUCH

RAVI KUMAR
Electrical Technician

9 years experience

87%
Evidence confidence

Demonstrated Skills
Work History
Evidence
Confirmations
```

Make the passport feel more like a professional credential/profile than a social media page.

## Interaction rules

- Buttons should be thumb-friendly.
- Loading states must exist.
- Empty states should be intentional.
- Form errors should explain how to fix the issue.
- AI extraction should always show editable results.
- Destructive actions require confirmation.
- Keep primary actions visually obvious.

## Responsive rule

Build mobile first, then expand layouts for desktop.

Do not create separate applications.

## UI polish checklist

Before demo:

- consistent spacing
- no horizontal overflow on mobile
- no placeholder text
- no broken images
- no inconsistent button styles
- no default browser inputs
- no console errors
- loading states
- error states
- realistic demo data
- polished passport URL
