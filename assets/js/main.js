/* =====================================================================
   HCM ESSENTIALS · classroom deck
   interactions (vanilla JS, no dependencies)
   ===================================================================== */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Nav: scroll state, mobile toggle, active link ---------- */
  var nav = $('.nav');
  var toggle = $('.nav__toggle');
  var links = $('.nav__links');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    $$('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); revObs.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revEls.forEach(function (el) { revObs.observe(el); });
    // elements already on screen at load can sit inside the observer's
    // excluded margin ; reveal them directly
    requestAnimationFrame(function () {
      revEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.left < window.innerWidth && r.right > 0) {
          el.classList.add('in'); revObs.unobserve(el);
        }
      });
    });
  } else {
    revEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Manifesto word-by-word reveal ---------- */
  $$('.manifesto p').forEach(function (p) {
    var words = p.textContent.trim().split(/\s+/);
    p.innerHTML = words.map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
  });
  if ('IntersectionObserver' in window && !reduce) {
    var wObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var ws = $$('.w', e.target);
        ws.forEach(function (w, i) { setTimeout(function () { w.classList.add('lit'); }, i * 55); });
        wObs.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    $$('.manifesto').forEach(function (m) { wObs.observe(m); });
  }

  /* ---------- Welcome slide: QR code ---------- */
  var qrBox = $('#qrBox');
  if (qrBox && typeof qrcode === 'function') {
    // Encodes the deployed URL. Override by setting data-url on #qrCard.
    var qrCard = $('#qrCard');
    var qrTarget = (qrCard && qrCard.getAttribute('data-url')) ||
      (location.protocol === 'file:' ? '' : location.origin + location.pathname);
    var qrUrlEl = $('#qrUrl');
    if (qrTarget) {
      try {
        var qr = qrcode(0, 'M');
        qr.addData(qrTarget);
        qr.make();
        qrBox.innerHTML = qr.createSvgTag({ scalable: true, margin: 2 });
        if (qrUrlEl) qrUrlEl.textContent = qrTarget.replace(/^https?:\/\//, '').replace(/\/$/, '');
      } catch (err) {
        qrBox.parentElement.style.display = 'none';
      }
    } else {
      if (qrUrlEl) qrUrlEl.textContent = 'QR appears when the site is hosted';
      qrBox.innerHTML = '<div style="width:100%;aspect-ratio:1;display:grid;place-items:center;border:1px dashed #E4E4E4;color:#777;font-family:Inter,Arial,sans-serif;font-size:.8rem;padding:1rem;text-align:center">Deploy to generate the QR code</div>';
    }
  }

  /* ---------- Hero video: 3-clip montage with graceful fallback ---------- */
  var heroVideo = $('#heroVideo');
  if (heroVideo) {
    var killVideo = function () { if (heroVideo) { heroVideo.remove(); heroVideo = null; } };
    if (reduce) {
      killVideo();
    } else {
      var playlist = [];
      try { playlist = JSON.parse(heroVideo.getAttribute('data-playlist') || '[]'); } catch (e) {}
      if (!playlist.length) {
        killVideo();
      } else {
        var clip = 0, failures = 0;
        var playClip = function (i) {
          if (!heroVideo) return;
          clip = ((i % playlist.length) + playlist.length) % playlist.length;
          heroVideo.src = playlist[clip];
          var p = heroVideo.play && heroVideo.play();
          if (p && p.catch) p.catch(function () { /* autoplay blocked; canvas remains */ });
        };
        heroVideo.addEventListener('ended', function () { failures = 0; playClip(clip + 1); });
        heroVideo.addEventListener('error', function () {
          failures++;
          if (failures >= playlist.length) { killVideo(); }
          else { playClip(clip + 1); }
        });
        playClip(0);
      }
    }
  }

  /* ---------- Hero ambient particles ---------- */
  var canvas = $('.hero__canvas');
  if (canvas && !reduce && !isTouch) {
    var ctx = canvas.getContext('2d');
    var W, H, parts = [];
    var size = function () {
      W = canvas.width = canvas.offsetWidth * (window.devicePixelRatio > 1 ? 2 : 1);
      H = canvas.height = canvas.offsetHeight * (window.devicePixelRatio > 1 ? 2 : 1);
    };
    size(); window.addEventListener('resize', size);
    for (var i = 0; i < 46; i++) {
      parts.push({ x: Math.random() * 1, y: Math.random() * 1, r: Math.random() * 1.6 + 0.4,
        vy: (Math.random() * 0.00018 + 0.00006), vx: (Math.random() - 0.5) * 0.00008,
        a: Math.random() * 0.5 + 0.2 });
    }
    (function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.y -= p.vy; p.x += p.vx;
        if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r * (window.devicePixelRatio > 1 ? 2 : 1), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(207,174,112,' + p.a + ')';
        ctx.fill();
      }
      requestAnimationFrame(draw);
    })();
  } else if (canvas) { canvas.style.display = 'none'; }

  /* ---------- INTERACTIVE: knowledge check quizzes ---------- */
  $$('[data-quiz]').forEach(function (root) {
    $$('.quiz__options', root).forEach(function (group) {
      var answered = false;
      var fb = group.parentElement.querySelector('.quiz__feedback');
      $$('.opt', group).forEach(function (opt) {
        opt.addEventListener('click', function () {
          if (answered) return; answered = true;
          var correct = opt.getAttribute('data-correct') === '1';
          $$('.opt', group).forEach(function (o) {
            o.setAttribute('disabled', 'true');
            if (o.getAttribute('data-correct') === '1') o.classList.add('correct');
          });
          if (!correct) opt.classList.add('wrong');
          if (fb) {
            fb.classList.add('show');
            fb.textContent = (correct ? '✓ Correct. ' : '✗ Not quite. ') + (opt.getAttribute('data-why') || '');
            fb.style.color = correct ? 'var(--vu-oak)' : '#c76b5a';
          }
        });
      });
    });
  });

  /* ---------- Generic scenario trainer (used four times) ---------- */
  function makeTrainer(cfg) {
    var root = $(cfg.root);
    if (!root) return;
    var idx = 0, score = 0, locked = false;
    var qEl = $(cfg.q), optEl = $(cfg.options), fbEl = $(cfg.feedback),
        progEl = $(cfg.progress), nextBtn = $(cfg.next), resEl = $(cfg.result);
    var navEl = $(cfg.root + ' .quiz__nav');
    function render() {
      locked = false;
      var S = cfg.items[idx];
      progEl.textContent = cfg.progressWord + ' ' + (idx + 1) + ' of ' + cfg.items.length;
      qEl.textContent = S.q;
      fbEl.textContent = '';
      nextBtn.style.visibility = 'hidden';
      nextBtn.textContent = idx === cfg.items.length - 1 ? 'See result' : nextBtn.textContent;
      optEl.innerHTML = '';
      var labels = S.opts || cfg.labels;
      labels.forEach(function (label, i) {
        var b = document.createElement('button');
        b.className = 'opt';
        b.innerHTML = '<span class="mark">' + String.fromCharCode(65 + i) + '</span><span>' + label + '</span>';
        b.addEventListener('click', function () {
          if (locked) return; locked = true;
          var right = i === S.answer;
          if (right) score++;
          $$('.opt', optEl).forEach(function (o, oi) {
            o.setAttribute('disabled', 'true');
            if (oi === S.answer) o.classList.add('correct');
          });
          if (!right) b.classList.add('wrong');
          fbEl.textContent = (right ? '✓ ' : '✗ ') + S.why;
          fbEl.style.color = right ? cfg.goodColor : '#c76b5a';
          nextBtn.style.visibility = 'visible';
        });
        optEl.appendChild(b);
      });
    }
    nextBtn.addEventListener('click', function () {
      idx++;
      if (idx >= cfg.items.length) {
        navEl.style.display = 'none';
        qEl.textContent = ''; optEl.innerHTML = ''; progEl.textContent = ''; fbEl.textContent = '';
        resEl.hidden = false;
        resEl.innerHTML = '<div class="quiz__score gold-text">' + score + ' / ' + cfg.items.length + '</div>' +
          '<p style="margin-top:.75rem;color:' + cfg.resultColor + '">' +
          (score >= cfg.passAt ? cfg.passMsg : cfg.failMsg) +
          '</p><button class="btn btn--ghost" data-retry style="margin-top:1rem">Run it again</button>';
        $('[data-retry]', resEl).addEventListener('click', function () {
          idx = 0; score = 0; resEl.hidden = true;
          navEl.style.display = '';
          render();
        });
      } else render();
    });
    render();
  }

  /* Guess the number (Section 01) */
  makeTrainer({
    root: '#numGuess', q: '#ngQ', options: '#ngOptions', feedback: '#ngFeedback',
    progress: '#ngProgress', next: '#ngNext', result: '#ngResult',
    progressWord: 'Fact', goodColor: 'var(--vu-oak)',
    resultColor: 'var(--ink-soft, #555)', passAt: 3,
    passMsg: 'You called the charter. Hold those numbers; they are the reason every habit in this session exists.',
    failMsg: 'Most rooms miss a few, and that is the point: the cost of small delays is bigger than it feels from inside one busy week.',
    labels: [],
    items: [
      { q: 'Between January and May 2026, documented overpayment cases in Engineering and the School of Medicine totaled roughly how much?',
        opts: ['About $8,400', 'About $84,000', 'About $840,000'],
        answer: 1, why: 'About $84,000 in five months, in just two units, and most of it traced to delayed or incorrect HCM and manager actions. Preventable is the key word.' },
      { q: 'How many documented overpayment cases produced that total?',
        opts: ['6 cases', '24 cases', '113 cases'],
        answer: 1, why: '24 cases. Each one became a recovery conversation with a real employee about money they may have already spent, and hours of correction work behind the scenes.' },
      { q: 'Vanderbilt is expanding operations into new states, which raises the compliance stakes. Which states?',
        opts: ['New York, California, and Florida', 'Texas and Georgia', 'Illinois, Ohio, and Colorado'],
        answer: 0, why: 'New York, California, and Florida, each with its own wage, hour, and leave rules. Accurate, on-time HCM actions matter more with every new state.' },
      { q: 'The initiative\'s target for required HCM training completion is…',
        opts: ['More than 85 percent, within required timeframes', 'Half the room, eventually', '100 percent on day one'],
        answer: 0, why: 'More than 85 percent within the required window. Completion is tracked in Oracle, visible to you and your manager, which is why "I\'ll get to it" now has a date attached.' }
    ]
  });

  /* Call the play (Section 02) */
  makeTrainer({
    root: '#playCall', q: '#pcQ', options: '#pcOptions', feedback: '#pcFeedback',
    progress: '#pcProgress', next: '#pcNext', result: '#pcResult',
    progressWord: 'Scenario', goodColor: 'var(--vu-gold-flat)',
    resultColor: 'rgba(255,255,255,.85)', passAt: 4,
    passMsg: 'You can run the core four under game conditions. The pattern in every answer: act the day you know, and let effective dates carry the timing.',
    failMsg: 'Close. The tell in every scenario: the right move happens the day you learn the information, and the true dates go into Oracle even when they feel awkward.',
    labels: [],
    items: [
      { q: 'It\'s approval deadline day and two timecards in your unit are still unapproved. The manager who approves them is traveling.',
        opts: ['Wait for the manager to land and hope', 'Work it now: nudge the manager, and if they cannot act in time, run your unit\'s backup approval process before the deadline', 'Let it slide to next cycle; it will catch up'],
        answer: 1, why: 'Unapproved timecards turn into pay problems for real people. Deadlines do not move because someone is traveling; the backup approval path exists for exactly this day.' },
      { q: 'A manager mentions in passing that an employee resigned, effective this Friday.',
        opts: ['Enter the termination in Oracle today, with Friday as the date', 'Wait for the news to arrive through official channels', 'Hold it until after this payroll run, to be safe'],
        answer: 0, why: 'The late termination is the classic overpayment. The day you learn about a change is the day it goes into Oracle; the effective date carries the timing.' },
      { q: 'A department administrator emails you a pay change that should have started last month.',
        opts: ['Submit it now, flagging the true retroactive effective date', 'Enter it with today\'s date so the record looks clean', 'Sit on it until the next quarterly review'],
        answer: 0, why: 'Submit promptly with the true effective date and let payroll process the retro correctly. Quietly changing dates or waiting both create new errors on top of the old one.' },
      { q: 'An employee tells you they will be out for surgery next month and asks what they should do.',
        opts: ['Point them into the leave process today, so everything is set up before the leave starts', 'Tell them to just keep their manager posted', 'Plan to sort out their timecards after they are back'],
        answer: 0, why: 'Leave handled informally becomes wrong pay and compliance exposure. Routed early, pay, protections, and timecards line up from day one.' },
      { q: 'You\'re about to process a transaction type you have never touched before.',
        opts: ['Follow your best guess; it can be fixed later', 'Open the job aid or Academy course for it first, then process', 'Send it to the help desk to do for you'],
        answer: 1, why: 'A minute in the job aid beats a week of corrections. Oracle first is the habit, and the help desk queue stays clear for genuine problems.' }
    ]
  });

  /* Spot the concept (Section 03) */
  makeTrainer({
    root: '#conceptSpot', q: '#csQ', options: '#csOptions', feedback: '#csFeedback',
    progress: '#csProgress', next: '#csNext', result: '#csResult',
    progressWord: 'Request', goodColor: 'var(--vu-oak)',
    resultColor: 'var(--ink-soft, #555)', passAt: 4,
    passMsg: 'You can hear the foundations underneath ordinary requests. That ear is the skill; the routing to PCB is the move.',
    failMsg: 'Close. The tells: anything about overtime, hours, or hourly-versus-salaried is FLSA. Anything about titles, levels, or pay ranges is job architecture. Anyone working from a new state is multi-state compliance.',
    labels: ['FLSA status', 'Job architecture', 'Multi-state compliance'],
    items: [
      { q: 'An overtime-eligible employee worked 44 hours last week, but the timecard in front of you shows an even 40.',
        answer: 0, why: 'Non-exempt employees must be paid for every hour worked, including overtime. Approving that timecard as-is creates a wage and hour problem under FLSA, so it gets corrected before it gets approved.' },
      { q: 'A manager setting up a new hire wants a custom title and a pay rate that "feels right for what we can afford."',
        answer: 1, why: 'Titles, levels, and pay ranges come from the job architecture so pay stays consistent and defensible across units. A custom title today is a classification and equity problem tomorrow.' },
      { q: 'An employee on your team is moving home to California next month and will work fully remote from there.',
        answer: 2, why: 'California brings its own overtime, break, and final-pay rules. Flag the move early so the assignment, tax, and pay setup follow the right state\'s laws from the first day.' },
      { q: 'A manager asks you to reclassify a role from hourly to salaried "so we can stop dealing with timecards."',
        answer: 0, why: 'Exempt status is a legal test about duties and salary, never a convenience setting. Reclassifying to escape timecards is exactly how FLSA violations happen; route it to PCB before anything changes.' },
      { q: 'Two employees doing nearly identical work in different units turn out to have different titles, grades, and pay ranges.',
        answer: 1, why: 'That drift is what job architecture exists to prevent. Flag it; standardized families and levels are how similar work gets similar pay across the university.' }
    ]
  });

  /* Where do you go first? (Section 04) */
  makeTrainer({
    root: '#goFirst', q: '#gfQ', options: '#gfOptions', feedback: '#gfFeedback',
    progress: '#gfProgress', next: '#gfNext', result: '#gfResult',
    progressWord: 'Moment', goodColor: 'var(--vu-gold-flat)',
    resultColor: 'rgba(255,255,255,.85)', passAt: 4,
    passMsg: 'Routing is calibrated: Oracle for how, the community for judgment, the ticket for broken. That habit alone reclaims hours every month.',
    failMsg: 'Close. The tells: a how-do-I question goes to Oracle\'s job aids and Academy. A how-do-you-handle question goes to the community. A something-is-broken problem goes to the help desk.',
    labels: ['Oracle: job aid, journey, or Academy', 'The HCM community', 'A help desk ticket'],
    items: [
      { q: 'You cannot remember the steps for processing a transfer between business units.',
        answer: 0, why: 'A how-do-I question is exactly what job aids and guided journeys exist for, at the point of work, kept current under governance.' },
      { q: 'Oracle throws an error code you have never seen, and the transaction will not save no matter what you try.',
        answer: 2, why: 'A genuine system problem is real help desk work. Keeping routine questions out of the queue is what makes help fast when you actually need it.' },
      { q: 'You wonder how other HCMs get 40 busy managers to approve timecards without chasing each one by hand.',
        answer: 1, why: 'That is a judgment and practice question, and it belongs with the people who share the role. The community exists because HCMs asked for exactly this.' },
      { q: 'A reminder says a course assigned to you in the Academy is due next week.',
        answer: 0, why: 'Required learning lives in your role-based path in Oracle, tracked to completion. Acting on the first reminder is the whole game; overdue is what escalates.' },
      { q: 'You are not sure whether a student worker\'s assignment gets set up differently from a staff assignment.',
        answer: 0, why: 'Role-type differences (staff, faculty, student) each have their own Academy content and job aids. Check first; if the answer genuinely is not there, that is worth flagging AND asking.' }
    ]
  });

  /* ---------- INTERACTIVE: HCM Commitment Card capstone ---------- */
  var planEl = $('#hcmPlan');
  if (planEl) {
    var pick = { practice: null, not: null, when: null };
    var whoIn = $('#planWho'), buildBtn = $('#planBuild'), statusEl2 = $('#planStatus'), outEl2 = $('#planOut');
    function planReady() {
      var ok = whoIn.value.trim().length >= 8 && pick.practice && pick.not && pick.when;
      buildBtn.disabled = !ok;
      statusEl2.textContent = ok ? 'Ready, build it' : 'Fill in all four parts';
      return ok;
    }
    whoIn.addEventListener('input', planReady);
    [['#planPractice', 'practice', 'data-practice'], ['#planNot', 'not', 'data-not'], ['#planWhen', 'when', 'data-when']].forEach(function (cfg) {
      var group = $(cfg[0]);
      $$('.opt', group).forEach(function (b) {
        b.addEventListener('click', function () {
          pick[cfg[1]] = b.getAttribute(cfg[2]);
          $$('.opt', group).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
          outEl2.hidden = true;
          planReady();
        });
      });
    });
    var PRACTICE = {
      sameday: { name: 'Same day, into Oracle', move: 'The day you learn about a hire, change, termination, or leave is the day it goes into Oracle, carrying its true effective date. No holding pen, no sticky notes, no waiting for it to feel official.' },
      sweep: { name: 'The standing weekly sweep', move: 'Pick a day and time for a recurring sweep: unapproved timecards, pending transactions, anything aging toward a deadline. Put the calendar block in before your first rep; the sweep only works if it is standing.' },
      oraclefirst: { name: 'Oracle first', move: 'For every how-do-I moment this week, open the job aid, journey, or Academy course before you email anyone or open a ticket. When the answer is missing or confusing, feed that back; that is how it gets fixed.' },
      learning: { name: 'Finish my learning path', move: 'Open your role-based path in the Academy, see what is assigned and when it is due, and finish the next course before its date. Completion is tracked; be ahead of the reminder instead of behind it.' }
    };
    var NOT = {
      sit: 'Sitting on changes until payroll week. Counter-move: enter it same day and let the effective date carry the timing.',
      ticket: 'Opening a ticket before checking Oracle. Counter-move: two minutes in the job aid first; the queue stays free for real problems.',
      snooze: 'Snoozing reminders until they escalate. Counter-move: treat the first reminder as the deadline.'
    };
    var WHEN = { tomorrow: 'tomorrow', cutoff: 'before the next payroll cutoff', week: 'within 7 days' };
    buildBtn.addEventListener('click', function () {
      if (!planReady()) return;
      var who = whoIn.value.trim();
      var p = PRACTICE[pick.practice];
      var rows = '' +
        '<div class="row"><b>The task that slips</b><span>' + who.replace(/</g, '&lt;') + '</span></div>' +
        '<div class="row"><b>My habit</b><span>' + p.name + '. ' + p.move + '</span></div>' +
        '<div class="row"><b>What I will NOT do</b><span>' + NOT[pick.not] + '</span></div>' +
        '<div class="row"><b>The first rep</b><span>' + WHEN[pick.when].charAt(0).toUpperCase() + WHEN[pick.when].slice(1) + ', in the real workflow, not a rehearsal.</span></div>' +
        '<div class="row"><b>The evidence</b><span>After one full payroll cycle, write one line: what did not become a fire drill. That line is the measure.</span></div>' +
        '<div class="row"><b>The feedback move</b><span>Submit the survey line you drafted: the most confusing process in your unit, and whether it needs training, a guardrail, a guided workflow, or a notification.</span></div>';
      outEl2.innerHTML = '<span class="tag">My HCM commitment card</span>' +
        '<div class="plan__out-grid">' + rows + '</div>' +
        '<div class="lab__runrow" style="margin-top:1.25rem">' +
        '<button class="btn" id="planCopy">Copy my card</button>' +
        '<span class="quiz__progress" id="planCopied" style="color:rgba(255,255,255,.6)">Put the first rep on your calendar now</span></div>';
      outEl2.hidden = false;
      $('#planCopy').addEventListener('click', function () {
        var text = 'MY HCM COMMITMENT CARD (HCM Essentials, Vanderbilt)\n' +
          'The task that slips: ' + who + '\n' +
          'Habit: ' + p.name + '. ' + p.move + '\n' +
          'I will NOT: ' + NOT[pick.not] + '\n' +
          'First rep: ' + WHEN[pick.when] + '.\n' +
          'Evidence: after one payroll cycle, one line on what did not become a fire drill.\n' +
          'Feedback move: submit my survey line about the most confusing process in my unit.';
        (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(function () {
          $('#planCopied').textContent = 'Copied. Paste it somewhere you\'ll see before the first rep.';
        }, function () {
          $('#planCopied').textContent = 'Select the card text above and copy it manually.';
        });
      });
      outEl2.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
    });
  }

  /* ---------- INTERACTIVE: scored recap quiz ---------- */
  var recap = $('#recap');
  if (recap) {
    var QUESTIONS = [
      { q: 'The HCM role is best described as…',
        opts: ['A backup resource for the help desk', 'The business unit\'s human capital management specialist: the bridge between employees, managers, PCB, and Oracle', 'A payroll auditor who reviews other people\'s entries', 'A purely administrative inbox'],
        correct: 1, why: 'You are the bridge: people actions in your unit reach Oracle through you, which is why your timing and accuracy carry so much weight.' },
      { q: 'The core four responsibility areas are…',
        opts: ['Hiring, budgets, parking, and travel', 'Timecard approvals, transactions, terminations, and leave actions', 'Recruiting, onboarding, benefits, and retirement', 'Surveys, dashboards, tickets, and training'],
        correct: 1, why: 'Timecards, transactions, terminations, and leave: the four areas that produce most preventable errors, and all four are won on timing.' },
      { q: 'The single habit that prevents the most overpayments is…',
        opts: ['Batching all changes at month end', 'Waiting until a change is confirmed twice', 'Same-day entry into Oracle with the true effective date', 'Keeping a personal spreadsheet of pending changes'],
        correct: 2, why: 'The day you learn about it is the day it goes into Oracle. Effective dates carry the timing; holding pens create the $84,000 problem.' },
      { q: 'Under FLSA, a non-exempt employee…',
        opts: ['Can waive overtime if they prefer', 'Must have hours tracked accurately and be paid overtime when they work it', 'Is anyone with a salaried title', 'Only exists in California and New York'],
        correct: 1, why: 'Hours tracked, overtime paid: that is a legal right under federal law. It is also why a rubber-stamped timecard is never harmless.' },
      { q: 'You hit a how-do-I question on a transaction. Your first stop is…',
        opts: ['A help desk ticket', 'An email to PCB', 'The colleague who has done it the longest', 'Oracle: the job aid, guided journey, or Academy course'],
        correct: 3, why: 'Oracle first. Job aids and journeys sit at the point of work, and every correctly routed question keeps the help desk queue clear for real problems.' },
      { q: 'An overdue reminder for a required action gets ignored. What happens in the new model?',
        opts: ['It escalates, and the overdue item is visible on leadership dashboards', 'It expires quietly after two weeks', 'The help desk completes the action instead', 'Nothing until the annual review'],
        correct: 0, why: 'Reminders come first, escalation follows, and dashboards make timeliness visible. Acting on the first reminder keeps all of it boring, which is the goal.' }
    ];
    var idx = 0, score = 0, locked = false;
    var qEl = $('#recapQ'), optEl2 = $('#recapOptions'), fbEl = $('#recapFeedback'),
        progEl = $('#recapProgress'), nextBtn = $('#recapNext'), panelEl = $('#recapPanel'), resultEl = $('#recapResult');
    function render() {
      locked = false;
      var Q = QUESTIONS[idx];
      qEl.textContent = Q.q;
      progEl.textContent = 'Question ' + (idx + 1) + ' of ' + QUESTIONS.length;
      fbEl.textContent = ''; fbEl.classList.remove('show');
      nextBtn.style.visibility = 'hidden';
      nextBtn.textContent = idx === QUESTIONS.length - 1 ? 'See score' : 'Next question';
      optEl2.innerHTML = '';
      Q.opts.forEach(function (text, i) {
        var b = document.createElement('button');
        b.className = 'opt';
        b.innerHTML = '<span class="mark">' + String.fromCharCode(65 + i) + '</span><span>' + text + '</span>';
        b.addEventListener('click', function () {
          if (locked) return; locked = true;
          var right = i === Q.correct;
          if (right) score++;
          $$('.opt', optEl2).forEach(function (o, oi) {
            o.setAttribute('disabled', 'true');
            if (oi === Q.correct) o.classList.add('correct');
          });
          if (!right) b.classList.add('wrong');
          fbEl.classList.add('show');
          fbEl.textContent = (right ? '✓ Correct. ' : '✗ ') + Q.why;
          fbEl.style.color = right ? 'var(--vu-oak)' : '#c76b5a';
          nextBtn.style.visibility = 'visible';
        });
        optEl2.appendChild(b);
      });
    }
    nextBtn.addEventListener('click', function () {
      idx++;
      if (idx >= QUESTIONS.length) { showResult(); }
      else render();
    });
    function showResult() {
      panelEl.hidden = true;
      resultEl.hidden = false;
      var pct = Math.round((score / QUESTIONS.length) * 100);
      var msg = pct >= 80 ? 'The playbook is loaded. The habit you commit to next is where it becomes real.' :
                pct >= 50 ? 'Solid. Revisit the sections you missed before your first rep.' :
                            'Worth another pass through the deck before the capstone.';
      resultEl.innerHTML = '<span class="eyebrow">Your result</span>' +
        '<div class="quiz__score gold-text">' + score + ' / ' + QUESTIONS.length + '</div>' +
        '<p class="lead" style="margin-top:1rem">' + msg + '</p>' +
        '<button class="btn btn--dark" id="recapRetry" style="margin-top:1.5rem">Try again</button>';
      $('#recapRetry').addEventListener('click', function () {
        idx = 0; score = 0; resultEl.hidden = true; panelEl.hidden = false; render();
      });
    }
    render();
  }

  /* ---------- INTERACTIVE: glossary flip ---------- */
  $$('.flip').forEach(function (card) {
    card.addEventListener('click', function () { card.classList.toggle('flipped'); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.classList.toggle('flipped'); }
    });
  });

  /* ---------- Deck navigation: dots, arrows, keyboard, progress ---------- */
  var slides = $$('.slide');
  var dotWrap = $('#dots');
  var bar = $('#progressBar');
  var counter = $('#deckCount');
  var current = 0;

  if (dotWrap) {
    slides.forEach(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button';
      var label = s.getAttribute('data-title') || ('Section ' + (i + 1));
      b.setAttribute('aria-label', 'Go to: ' + label);
      b.addEventListener('click', function () { goTo(i); });
      dotWrap.appendChild(b);
    });
  }
  var dots = dotWrap ? $$('button', dotWrap) : [];

  function goTo(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    slides[i].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', inline: 'start', block: 'nearest' });
  }
  var barTitle = $('#barTitle');
  function setActive(i) {
    current = i;
    dots.forEach(function (d, di) { d.setAttribute('aria-current', String(di === i)); });
    if (counter) counter.textContent = (i + 1) + ' / ' + slides.length;
    if (barTitle) barTitle.textContent = slides[i].getAttribute('data-title') || '';
    if (typeof checkHint === 'function') checkHint();
    $$('.nav__links a').forEach(function (a) {
      var href = a.getAttribute('href');
      a.setAttribute('aria-current', String(href === '#' + slides[i].id));
    });
  }
  if ('IntersectionObserver' in window) {
    var sObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { setActive(slides.indexOf(e.target)); }
      });
    }, { threshold: 0.5 });
    slides.forEach(function (s) { sObs.observe(s); });
  }
  setActive(0);

  // progress bar follows the deck's horizontal position
  var deckEl = $('.deck');
  if (deckEl) {
    deckEl.addEventListener('scroll', function () {
      var w = deckEl.scrollWidth - deckEl.clientWidth;
      if (bar) bar.style.width = (w > 0 ? (deckEl.scrollLeft / w) * 100 : 0) + '%';
      nav.classList.toggle('scrolled', deckEl.scrollLeft > 40);
    }, { passive: true });
  }

  // "scroll for more" indicator
  var hint = $('#scrollHint');
  function checkHint() {
    if (!hint || !slides[current]) return;
    var s = slides[current];
    var need = s.scrollHeight - s.clientHeight > 56;
    var atEnd = s.scrollTop + s.clientHeight >= s.scrollHeight - 24;
    hint.classList.toggle('show', need && !atEnd);
  }
  if (hint) {
    hint.addEventListener('click', function () {
      var s = slides[current];
      s.scrollBy({ top: s.clientHeight * 0.7, behavior: reduce ? 'auto' : 'smooth' });
    });
    slides.forEach(function (s) { s.addEventListener('scroll', checkHint, { passive: true }); });
    window.addEventListener('resize', checkHint);
    setTimeout(checkHint, 400);
  }

  // in-page anchor links jump the horizontal deck
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;
      var slide = target.closest ? (target.closest('.slide') || target) : target;
      if (slides.indexOf(slide) > -1) {
        e.preventDefault();
        goTo(slides.indexOf(slide));
      } else if (id === 'top') {
        e.preventDefault();
        goTo(0);
      }
    });
  });

  // keyboard
  document.addEventListener('keydown', function (e) {
    if (['INPUT', 'TEXTAREA', 'SELECT'].indexOf(document.activeElement.tagName) > -1) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
      e.preventDefault(); goTo(current + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
      e.preventDefault(); goTo(current - 1);
    } else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    else if (e.key === 'End') { e.preventDefault(); goTo(slides.length - 1); }
  });


  // wheel advances the deck when the current screen has nothing left to scroll
  var wheelLock = 0;
  window.addEventListener('wheel', function (e) {
    var s = slides[current];
    if (!s) return;
    var now = Date.now();
    if (now - wheelLock < 900) return;
    var atBottom = s.scrollTop + s.clientHeight >= s.scrollHeight - 4;
    var atTop = s.scrollTop <= 4;
    if (e.deltaY > 24 && atBottom) { wheelLock = now; goTo(current + 1); }
    else if (e.deltaY < -24 && atTop && current > 0) { wheelLock = now; goTo(current - 1); }
  }, { passive: true });


  // every non-anchor link opens in a new tab
  $$('a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href && href.charAt(0) !== '#') {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    }
  });

  // deck bar buttons
  var prevB = $('#deckPrev'), nextB = $('#deckNext');
  if (prevB) prevB.addEventListener('click', function () { goTo(current - 1); });
  if (nextB) nextB.addEventListener('click', function () { goTo(current + 1); });

  // year
  var yEl = $('#year'); if (yEl) yEl.textContent = new Date().getFullYear();
})();
