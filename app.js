// Plain-JS state machine driving the room UI. Listens to the framework-agnostic
// events cd-room-v2.js dispatches (zoneselect, zonehover, catmeow) and calls its
// public methods (selectZone, backOne, deselect, setMode).
(function () {
  const room = document.getElementById('room');

  const work = [
    { meta: 'track 01 · july 2026', title: 'miniplayer', stack: 'swift · swiftui · xcuitest',
      body: 'an always-on-top macos playback widget driving spotify and apple music over an applescript bridge, with automatic source switching and four interchangeable skins.',
      n1: 'hand-wrote the spotify oauth flow: loopback http callback server, persistent token store with refresh, typed web api client for queue data.',
      n2: 'media control behind a protocol with an injectable fake — 58 unit tests, 3 xcuitest smoke tests, gated in ci.' },
    { meta: 'track 02 · june 2026 · class project winner', title: 'se-sitrep', stack: 'javascript · supabase · playwright',
      body: 'led a 10-person team shipping a full-stack agile platform: standup dashboard, blocker tracking, github activity sync, calendar views, ai-agent activity monitoring.',
      n1: 'refactored the frontend skeleton into modules — dashboard layout, shared state and selectors, feature modules, navigation.',
      n2: 'built the postgres foundation: schema and rls, join-code onboarding, auth gating, a shared db.js layer replacing mock state.' },
    { meta: 'track 03 · jan — apr 2026', title: 'aesthetic', stack: 'swe intern · aws · gemini vision',
      body: 'built a serverless gmail ingestion pipeline on lambda — oauth, incremental sync, orchestration, s3 — that pulls structured purchase data out of retailer email and surfaces products in-app.',
      n1: 'product-image extraction: domain filtering, heuristic scoring, dedup, gemini vision validation to find wearable fashion.',
      n2: 'benchmarked 5 image-generation models across 26 product photos and picked the one now used for lay-flat imagery.' },
    { meta: 'track 04 · november 2025 · hackathon winner', title: 'carefi', stack: 'next.js · typescript · tailwind',
      body: 'an ai dermatology web service. i built the three-angle facial photo workflow: guided reference imagery, drag-and-drop uploads, duplicate detection, previews, client-side validation.',
      n1: 'cross-batch duplicate detection and resilient file state — rejected files never generate previews, removed ones can be re-picked.',
      n2: 'checkout and onboarding with payment formatting, four-field validation, bidirectional budget checks, progression gating.' },
    { meta: 'track 05 · aug — dec 2025', title: 'arity', stack: 'ml project fellow · python',
      body: 'classified vehicle turns from telematics data: cleaned and engineered features from 60,000+ ios and android events, turning raw gps and sensor fields into modeling variables.',
      n1: '12+ k-means, dbscan and hdbscan workflows; a 3-cluster k-means separating 90° turns, u-turns and lane changes.',
      n2: 'led 6 people through sprint planning and model review with arity stakeholders, translating clusters into readable labels.' }
  ];

  const tracks = [
    'the less i know the better — tame impala',
    'motion sickness — phoebe bridgers',
    'shine on you crazy diamond — pink floyd',
    'nothing’s gonna hurt you baby — cigarettes after sex',
    'redbone — childish gambino'
  ];

  const el = {
    modeToggle: document.getElementById('modeToggle'),
    tipCard: document.getElementById('tipCard'),
    hoverChip: document.getElementById('hoverChip'),
    meowBubble: document.getElementById('meowBubble'),
    rackBar: document.getElementById('rackBar'),
    rackBackBtn: document.getElementById('rackBackBtn'),
    resumeOverlay: document.getElementById('resumeOverlay'),
    resumeCloseBtn: document.getElementById('resumeCloseBtn'),
    panel: document.getElementById('panel'),
    panelKicker: document.getElementById('panelKicker'),
    panelBackBtn: document.getElementById('panelBackBtn'),
    panelIdle: document.getElementById('panelIdle'),
    panelWork: document.getElementById('panelWork'),
    panelAbout: document.getElementById('panelAbout'),
    panelContact: document.getElementById('panelContact'),
    navWork: document.getElementById('navWork'),
    navAbout: document.getElementById('navAbout'),
    navResume: document.getElementById('navResume'),
    navContact: document.getElementById('navContact'),
    workMeta: document.getElementById('workMeta'),
    workTitle: document.getElementById('workTitle'),
    workStack: document.getElementById('workStack'),
    workBody: document.getElementById('workBody'),
    workNote1: document.getElementById('workNote1'),
    workNote2: document.getElementById('workNote2'),
    discCount: document.getElementById('discCount'),
    prevDiscBtn: document.getElementById('prevDiscBtn'),
    nextDiscBtn: document.getElementById('nextDiscBtn'),
    playBtn: document.getElementById('playBtn'),
    trackName: document.getElementById('trackName')
  };

  const state = { zone: '', index: -1, mode: 'day', playing: false };

  function go(zone, index) {
    return () => {
      if (room.selectZone) room.selectZone(zone, index == null ? -1 : index);
    };
  }

  function back() {
    if (room.backOne) room.backOne();
    else if (room.deselect) room.deselect();
  }

  function step(delta) {
    return () => {
      const current = state.index < 0 ? 0 : state.index;
      const next = (current + delta + work.length) % work.length;
      go('work', next)();
    };
  }

  el.modeToggle.addEventListener('click', () => {
    const next = state.mode === 'night' ? 'day' : 'night';
    if (room.setMode) room.setMode(next);
    state.mode = next;
    render();
  });

  el.playBtn.addEventListener('click', () => {
    state.playing = !state.playing;
    render();
  });

  el.navWork.addEventListener('click', go('work', 0));
  el.navAbout.addEventListener('click', go('about'));
  el.navResume.addEventListener('click', go('resume'));
  el.navContact.addEventListener('click', go('contact'));

  el.panelBackBtn.addEventListener('click', back);
  el.rackBackBtn.addEventListener('click', back);
  el.resumeCloseBtn.addEventListener('click', back);
  el.prevDiscBtn.addEventListener('click', step(-1));
  el.nextDiscBtn.addEventListener('click', step(1));

  room.addEventListener('zoneselect', (e) => {
    state.zone = e.detail.zone;
    state.index = e.detail.index;
    if (e.detail.zone === 'work') state.playing = true;
    render();
  });

  room.addEventListener('zonehover', (e) => {
    const zone = e.detail.zone;
    el.hoverChip.textContent = zone === 'work' ? 'disc 0' + (e.detail.index + 1)
      : zone === 'cat' ? 'pet the cat'
      : zone === 'butterfly' ? 'shoo'
      : zone || 'hover something';
  });

  let meowTimer;
  room.addEventListener('catmeow', () => {
    clearTimeout(meowTimer);
    el.meowBubble.hidden = false;
    meowTimer = setTimeout(() => { el.meowBubble.hidden = true; }, 1400);
  });

  function render() {
    const { zone, index, mode, playing } = state;
    const w = work[index >= 0 ? index : 0];

    el.tipCard.hidden = zone !== '';
    el.rackBar.hidden = zone !== 'rack';
    el.resumeOverlay.hidden = zone !== 'resume';

    // the panel shows for idle (site-map nav) and for the three content zones;
    // it stays off-screen only while browsing the rack or reading the resume,
    // which have their own dedicated UI.
    const panelVisible = zone === '' || zone === 'work' || zone === 'about' || zone === 'contact';
    el.panel.classList.toggle('panel-hidden', !panelVisible);

    el.panelIdle.hidden = zone !== '';
    el.panelWork.hidden = zone !== 'work';
    el.panelAbout.hidden = zone !== 'about';
    el.panelContact.hidden = zone !== 'contact';

    el.panelKicker.textContent = zone === '' ? 'the room'
      : zone === 'work' ? 'now playing'
      : zone === 'rack' ? 'the rack'
      : zone;

    el.modeToggle.textContent = mode === 'night' ? '☀ day' : '☾ night';

    if (zone === 'work') {
      el.workMeta.textContent = w.meta;
      el.workTitle.textContent = w.title;
      el.workStack.textContent = w.stack;
      el.workBody.textContent = w.body;
      el.workNote1.textContent = w.n1;
      el.workNote2.textContent = w.n2;
      el.discCount.textContent = 'disc ' + ((index < 0 ? 0 : index) + 1) + ' of ' + work.length;
    }

    el.trackName.textContent = zone === 'work' ? tracks[index >= 0 ? index : 0] : 'nothing playing';
    el.playBtn.textContent = playing ? '❚❚' : '▶';
  }

  render();
})();
