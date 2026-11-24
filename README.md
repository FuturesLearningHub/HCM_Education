# HCM Essentials · Every Entry Is Someone's Paycheck

An interactive, single-page teaching site for Vanderbilt's Business Unit
HCMs: what the Human Capital Management role owns, the core four
responsibilities (timecards, transactions, terminations, leave), the HR
foundations behind every transaction (FLSA, job architecture, multi-state
compliance), Oracle as the single source of truth, and the accountability
and community model from the HCM Operational Excellence initiative. A
**Learning on Demand** program: the facilitator projects it while learners
scan a QR code and work every exercise on their own devices, or share the
link for self-paced review.

Part of the Vanderbilt Learning Series. Catalog:
[Course Library](https://flh-learning-library.vercel.app/)

- **Learner edition:** https://futureslearninghub.github.io/HCM_Education/
- **Self-paced edition:** https://futureslearninghub.github.io/HCM_Education/web/
- **Facilitator edition:** https://futureslearninghub.github.io/HCM_Education/facilitator/

## Running it

Plain HTML/CSS/JS, no build step:

```bash
python3 -m http.server 8000
```

## What it teaches (5 sections)

1. The role and the stakes: what an HCM is, the $84,000 / 24-case
   overpayment story from the initiative charter, and the upstream-quality
   frame (training vs guardrail vs guided workflow vs notification)
2. The core four: timecard approvals, transactions, terminations, and
   leave actions, all won or lost on timing; the same-day habit
3. The foundations: FLSA status, job architecture, and multi-state
   compliance (NY, CA, FL), with recognize-and-route as the standard
4. Oracle first: the HCM Academy's role-based learning paths, job aids and
   guided journeys at the point of work, guardrails and automated alerts
5. Accountability and community: reminders, escalations, dashboards, the
   85 percent completion bar, plus the HCM checklist, community, surveys,
   and champion network

Each section carries an interactive trainer (Guess the Number, Call the
Play, Spot the Concept, Where Do You Go First), inline knowledge checks, a
scored six-question recap, and a capstone commitment card (one task, one
habit, one date). Printables: [the HCM checklist](checklist.html) and
[the commitment card](worksheet.html).

## Editions

- `index.html` is the classroom source of truth; edit only this (plus
  `assets/` and `facilitator/notes.json`).
- `web/index.html` is GENERATED: `python3 tools/build-web.py`
- `facilitator/index.html` + `facilitator/guide.html` are GENERATED:
  `python3 tools/build-facilitator.py`

Regenerate both after any change. The facilitator runbook (ATD Say / Do /
Ask / Debrief / Transition, Full 90 min / Core 60 min) lives in
`facilitator/notes.json`; see `FACILITATION.md`.

## Publishing

GitHub Pages serves the `gh-pages` branch:

```bash
git push -u origin main
git branch -f gh-pages main && git push -f origin gh-pages
```

## Source

Course content is built from the *HCM Operational Excellence Initiative
Integrated Project Charter & Scope* (Project 037, HRIS). Figures cited in
the course (24 overpayment cases, ~$84,000, Jan to May 2026; >85 percent
completion target; NY/CA/FL expansion) come from that charter. FLSA
basics link to the
[U.S. Department of Labor](https://www.dol.gov/agencies/whd/flsa).
