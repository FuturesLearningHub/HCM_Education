# HCM Essentials · Vanderbilt Learning Series

Single-page interactive classroom experience (Learning on Demand). Live at
https://futureslearninghub.github.io/HCM_Education/ (GitHub Pages, `gh-pages`
branch; publish with `git branch -f gh-pages main && git push -f origin gh-pages`).

Sister programs: AI_Classroom (AI Basics), AI-Advanced (AI 201),
Difficult_Conversations, Coaching-for-Performance, Emotional-Intelligence;
catalog at FuturesLearningHub/FLH-Learning-Library-. Same engine, same standing principles.

## Standing design principles (do not regress these)

1. **Simulators, practice, and play throughout.** Every teaching section
   has an interaction: Guess the Number (01), Call the Play (02), Spot the
   Concept (03), Where Do You Go First (04), inline checks (05).
2. **A reason and facilitation behind every activity.** Learner-visible
   "Why this matters" lines; activities labeled As a group / On your own
   with steps, timings, and solo variants.
3. **Every section facilitatable, learning validatable.** ATD runbook in
   `facilitator/notes.json`. Kirkpatrick: L1 fist-to-five, L2 recap mapped
   to objectives, L3 commitment card + 7-day pulse + post-cycle re-poll.
4. **Facilitator edition is generated, never hand-edited.** Run
   `python3 tools/build-facilitator.py` after ANY change to index.html or
   notes.json. Its QR encodes the LEARNER url.
5. **Charter fidelity.** All figures come from the HCM Operational
   Excellence charter (Project 037): 24 overpayment cases / ~$84,000 /
   Jan-May 2026 / Engineering + School of Medicine; >85% training
   completion; NY, CA, FL expansion. Do not invent new metrics. Manager
   training is explicitly OUT of the initiative's scope.
6. **Recognize and route, never legal advice.** The FLSA / job
   architecture / multi-state content teaches learners to FLAG questions
   to PCB, never to answer them. Keep state-law specifics general; the
   only external legal link is the DOL FLSA page.
7. **Brand: Vanderbilt FLH system.** Black #1C1C1C / white / flat gold
   #CFAE70; Libre Caslon Display headlines (one italic word), Inter body,
   Antonio eyebrows; motion under 400ms; real VU lockups (authorized use
   only). Zero em or en dashes anywhere.
8. **No frameworks.** One CSS file, one JS file, vendored QR lib,
   self-hosted fonts; hero uses the particle canvas (no video montage).

## Layout (13 slides)

Welcome/QR (classroom only) -> Hero (5 objectives + skills row) -> Agenda ->
01 The role and the stakes (Guess the Number + $84K story) -> manifesto
("Behind every transaction is a person waiting on a paycheck.") ->
02 The core four (Call the Play + same-day habit card) -> 03 The
foundations (Spot the Concept + flag-it pair drill) -> 04 Oracle first
(Where Do You Go First + guardrail brainstorm) -> 05 Accountability and
community (two inline checks + survey-line draft) -> Recap quiz ->
Capstone HCM Commitment Card -> Glossary (13 flips) -> Closing.

## Editing map

- Copy: `index.html` · Recap: `QUESTIONS` in `assets/js/main.js`
- Trainers: `makeTrainer` configs (numGuess, playCall, conceptSpot, goFirst)
- Capstone maps: `PRACTICE` / `NOT` / `WHEN` in main.js (#hcmPlan)
- Runbook: `facilitator/notes.json` (timing must sum: Full 90 / Core 60)
- Printables: `checklist.html` (the HCM checklist), `worksheet.html`
  (paper commitment card)
- Regenerate after edits: `python3 tools/build-web.py` then
  `python3 tools/build-facilitator.py`; re-shoot `facilitator/img/*.jpg`
  after visual changes.
