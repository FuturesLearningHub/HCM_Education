# Facilitation Guide · HCM Essentials

Every activity carries a learner-visible **"Why this matters"** line, and
every teaching section has (1) an **interactive trainer or check**,
(2) a **labeled, timed activity** (*As a group* or *On your own*), and
(3) a **validation point**.

The full runbook lives in [`facilitator/notes.json`](facilitator/notes.json)
on the **ATD facilitator-guide framework**: per section a verbatim **Say**
script, **Do** choreography, an **Ask** with anticipated responses, a
**Debrief** line, and a scripted **Transition**, plus front matter
(materials, prep checklists, contingencies, tough questions, and copy-paste
templates: pre-work invite, 7-day pulse, post-cycle re-poll).

**Pre-work:** bring your unit's payroll cutoff calendar and one recurring
HCM task that keeps slipping. **The frame,** stated in minute one: this is
the playbook the role never had, never a lecture about doing better.

The **facilitator edition is live at `/facilitator/`**; regenerate after
any change to `index.html` or `notes.json`:

```bash
python3 tools/build-facilitator.py
```

## Run of show · two paths

| Slide | Full (90 min) | Core (60 min) |
|---|---|---|
| Welcome / QR | 3 | 2 |
| Objectives | 2 | 1 |
| Agenda | 1 | skip |
| 01 · The role and the stakes | 10 | 6 |
| Manifesto | 1 | skip |
| 02 · The core four | 16 | 12 |
| 03 · The foundations | 13 | 9 |
| 04 · Oracle first | 14 | 10 |
| 05 · Accountability and community | 12 | 8 |
| Recap quiz | 6 | 5 |
| Capstone · HCM commitment card | 7 | 5 |
| Glossary | 1 | skip |
| Closing · commitment | 4 | 2 |
| **Total** | **90** | **60** |

Core-path rule: every trainer stays; debriefs shrink to one voice, pair
work becomes 60-second solo drafts, and the calendar check becomes
homework. Never cut Call the Play, Spot the Concept, or the capstone; they
carry objectives 2, 3, and 5.

## Evaluation chain (Kirkpatrick)

- **L1:** fist-to-five at the close (logged), re-polled after one payroll cycle.
- **L2:** the scored six-question recap, mapped one-to-one onto the
  session's big ideas, plus each section's `validate` line.
- **L3:** the commitment card (one task, one habit, one date), the 7-day
  pulse, and the post-cycle re-poll. Headline metric: completed first reps
  plus submitted survey lines.

## Printables

- [`checklist.html`](checklist.html): the HCM checklist (cycle, same-day,
  flag-to-PCB triggers, where-to-go order). Print a few for the room.
- [`worksheet.html`](worksheet.html): the paper commitment card, the
  no-device and projector-failure fallback.
- [`facilitator/guide.html`](facilitator/guide.html): the printable ATD
  packet (generated; slide image beside every section's notes).
