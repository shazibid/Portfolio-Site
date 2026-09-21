// Plain-JS state machine driving the room UI. Listens to the framework-agnostic
// events room/cd-room-v2.js dispatches (zoneselect, zonehover, catmeow) and calls
// its public methods (selectZone, backOne, deselect, setMode).
import { projects } from './content/projects.js';
import { tracks } from './content/tracks.js';
import { photos } from './content/photos.js';
import { createLofi } from './room/lofi.js';

const room = document.getElementById('room');

const el = {
  modeToggle: document.getElementById('modeToggle'),
  hoverChip: document.getElementById('hoverChip'),
  meowBubble: document.getElementById('meowBubble'),
  rackBar: document.getElementById('rackBar'),
  rackBackBtn: document.getElementById('rackBackBtn'),
  computerBar: document.getElementById('computerBar'),
  computerBackBtn: document.getElementById('computerBackBtn'),
  resumeOverlay: document.getElementById('resumeOverlay'),
  resumeCloseBtn: document.getElementById('resumeCloseBtn'),
  panel: document.getElementById('panel'),
  folderTab: document.getElementById('folderTab'),
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
  workShot: document.getElementById('workShot'),
  workRepo: document.getElementById('workRepo'),
  workPrivate: document.getElementById('workPrivate'),
  workBody: document.getElementById('workBody'),
  workNote1: document.getElementById('workNote1'),
  workNote2: document.getElementById('workNote2'),
  discCount: document.getElementById('discCount'),
  prevDiscBtn: document.getElementById('prevDiscBtn'),
  nextDiscBtn: document.getElementById('nextDiscBtn'),
  playBtn: document.getElementById('playBtn'),
  dockVinyl: document.getElementById('dockVinyl'),
  dockToggle: document.getElementById('dockToggle'),
  dockVol: document.getElementById('dockVol'),
  lofiDock: document.getElementById('lofiDock'),
  previewVolume: document.getElementById('previewVolume'),
  audioBar: document.getElementById('audioBar'),
  volBtn: document.getElementById('volBtn'),
  volSlider: document.getElementById('volSlider'),
  trackName: document.getElementById('trackName'),
  trackLink: document.getElementById('trackLink'),
  trackTime: document.getElementById('trackTime'),
  progressFill: document.getElementById('progressFill')
};

// background lo-fi loop: starts on the first click anywhere (browsers block
// autoplay) unless the visitor turned it off with the dock's toggle
const lofi = createLofi();
let lofiMuted = false;
function syncMusicBtn() {
  el.dockToggle.textContent = lofi.on ? '❚❚' : '▶';
  el.dockVinyl.classList.toggle('spinning', lofi.on);
  if (room.setLofi) room.setLofi(lofi.on);
}
el.dockToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  lofiMuted = lofi.on;
  if (lofi.on) lofi.stop(); else lofi.start();
  syncMusicBtn();
});
el.dockVol.addEventListener('input', () => lofi.setVolume(el.dockVol.value / 100));
lofi.setVolume(el.dockVol.value / 100);
document.addEventListener('pointerdown', (e) => {
  if (e.target === el.dockToggle) return;
  if (!lofiMuted && !lofi.on) lofi.start().then(syncMusicBtn);
}, { once: true });

const audio = new Audio();
audio.preload = 'none';
audio.volume = 0.5; // previews are mastered loud; start at half

function syncVolume() {
  el.volSlider.value = audio.muted ? 0 : Math.round(audio.volume * 100);
  el.volBtn.textContent = audio.muted || audio.volume === 0 ? '🔇' : '🔊';
}
el.volSlider.addEventListener('input', () => {
  audio.volume = el.volSlider.value / 100;
  audio.muted = audio.volume === 0;
  syncVolume();
});
el.volBtn.addEventListener('click', () => {
  if (audio.volume === 0) audio.volume = 0.5;
  audio.muted = !audio.muted && audio.volume > 0;
  syncVolume();
});
syncVolume();
let loadedSrc = '';

function fmt(sec) {
  const s = Math.floor(sec || 0);
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

const state = { zone: '', index: -1, mode: 'day', playing: false, navOpen: false };

function go(zone, index) {
  return () => {
    if (room.selectZone) room.selectZone(zone, index == null ? -1 : index);
  };
}

function back() {
  if (state.zone === '' && state.navOpen) { state.navOpen = false; render(); return; }
  if (room.backOne) room.backOne();
  else if (room.deselect) room.deselect();
}

function step(delta) {
  return () => {
    const current = state.index < 0 ? 0 : state.index;
    const next = (current + delta + projects.length) % projects.length;
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

audio.addEventListener('timeupdate', () => {
  const dur = audio.duration || 30;
  el.progressFill.style.width = (audio.currentTime / dur * 100) + '%';
  el.trackTime.textContent = fmt(audio.currentTime) + ' / ' + fmt(dur);
});
audio.addEventListener('ended', () => { state.playing = false; render(); });

el.navWork.addEventListener('click', go('rack'));
el.navAbout.addEventListener('click', go('about'));
el.navResume.addEventListener('click', go('resume'));
el.navContact.addEventListener('click', go('contact'));

el.folderTab.addEventListener('click', () => { state.navOpen = true; render(); });
// clicking the room itself (off the panel) closes the site map
room.addEventListener('click', () => {
  if (state.zone === '' && state.navOpen) { state.navOpen = false; render(); }
});

el.panelBackBtn.addEventListener('click', back);
el.computerBackBtn.addEventListener('click', back);
el.rackBackBtn.addEventListener('click', back);
el.resumeCloseBtn.addEventListener('click', back);
el.resumeOverlay.addEventListener('click', (e) => { if (e.target === el.resumeOverlay) back(); });
el.prevDiscBtn.addEventListener('click', step(-1));
el.nextDiscBtn.addEventListener('click', step(1));

room.addEventListener('zoneselect', (e) => {
  state.zone = e.detail.zone;
  state.index = e.detail.index;
  state.navOpen = false;
  if (e.detail.zone === 'work') state.playing = true;
  render();
});

room.addEventListener('zonehover', (e) => {
  const zone = e.detail.zone;
  el.hoverChip.textContent = zone === 'work' ? 'disc 0' + (e.detail.index + 1)
    : zone === 'cat' ? 'pet the cat'
    : zone === 'butterfly' ? 'shoo'
    : zone === 'computer' ? 'log on'
    : zone || 'hover something';
});

let meowTimer;
room.addEventListener('catmeow', () => {
  clearTimeout(meowTimer);
  // hide + reflow so the pop-in animation replays on every meow, even mid-bubble
  el.meowBubble.hidden = true;
  void el.meowBubble.offsetWidth;
  el.meowBubble.hidden = false;
  meowTimer = setTimeout(() => { el.meowBubble.hidden = true; }, 1400);
});

// tell the room how much of its right side the panel covers so it centers the focused
// object in the space that's left
let panelShown = false;
function syncPanelInset(visible = panelShown) {
  panelShown = visible;
  if (!room.setPanelInset) return;
  const gap = parseFloat(getComputedStyle(el.panel).right) || 0;
  room.setPanelInset(visible ? el.panel.offsetWidth + gap : 0);
}
window.addEventListener('resize', () => syncPanelInset());

function render() {
  const { zone, index, mode, playing } = state;
  const project = projects[index >= 0 ? index : 0];

  el.rackBar.hidden = zone !== 'rack';
  el.resumeOverlay.hidden = zone !== 'resume';
  el.computerBar.hidden = zone !== 'computer';

  // the panel only shows for the three content zones; at idle it stays off-screen
  // so the room is unobstructed, and the rack/resume have their own dedicated UI.
  const panelVisible = (zone === '' && state.navOpen) || zone === 'work' || zone === 'about' || zone === 'contact';
  el.folderTab.hidden = !(zone === '' && !state.navOpen);
  el.panel.classList.toggle('panel-hidden', !panelVisible);
  syncPanelInset(panelVisible);

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
    el.workMeta.textContent = project.meta;
    el.workTitle.textContent = project.title;
    el.workStack.textContent = project.stack;
    el.workShot.hidden = !project.shot;
    if (project.shot) {
      el.workShot.src = `./assets/projects/${project.shot}`;
      el.workShot.alt = project.title + ' screenshot';
    }
    el.workRepo.hidden = !project.repo;
    if (project.repo) el.workRepo.href = project.repo;
    el.workPrivate.hidden = !!project.repo;
    el.workBody.textContent = project.body;
    el.workNote1.textContent = project.n1;
    el.workNote2.textContent = project.n2;
    el.discCount.textContent = 'disc ' + ((index < 0 ? 0 : index) + 1) + ' of ' + projects.length;
  }

  const track = zone === 'work' ? tracks[index >= 0 ? index : 0] : null;
  el.audioBar.hidden = !track; // the panel player is only for a disc's song preview; lofi lives in the dock
  el.lofiDock.classList.toggle('panel-open', panelVisible);
  el.trackName.textContent = track ? track.title + ' — ' + track.artist : '';
  el.trackLink.hidden = !track;
  if (track) el.trackLink.href = track.link;

  if (track && track.preview !== loadedSrc) {
    loadedSrc = track.preview;
    audio.src = track.preview;
    el.progressFill.style.width = '0%';
    el.trackTime.textContent = '0:00 / 0:30';
  }
  if (playing && track) {
    audio.play().catch(() => { state.playing = false; render(); }); // autoplay blocked or offline
  } else {
    audio.pause();
  }
  el.previewVolume.hidden = !track; // the volume slider only drives song previews
  lofi.duck(!!(playing && track));
  el.playBtn.textContent = playing ? '❚❚' : '▶';
}

render();

// corkboard photos: polaroid grid in the about panel, click for the popup
const photoModal = document.getElementById('photoModal');
const photoImg = document.getElementById('photoImg');
const photoCaption = document.getElementById('photoCaption');
const photoStory = document.getElementById('photoStory');

function closePhoto() { photoModal.hidden = true; }

function openPhoto(p) {
  photoImg.src = `./assets/photos/${p.file}`;
  photoImg.alt = p.caption;
  photoCaption.textContent = p.caption;
  photoStory.textContent = p.story || '';
  photoStory.hidden = !p.story;
  photoModal.hidden = false;
}

const corkGrid = document.getElementById('corkGrid');
photos.forEach((p) => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'cork-photo' + (p.size === 'big' ? ' cork-photo-big' : '');
  btn.style.setProperty('--tilt', `${p.tilt || 0}deg`);
  const frame = document.createElement('div');
  frame.className = 'cork-photo-frame';
  const img = document.createElement('img');
  img.src = `./assets/photos/${p.file}`;
  img.alt = p.caption;
  img.loading = 'lazy';
  img.addEventListener('error', () => img.remove()); // no file yet: keep the striped placeholder
  frame.appendChild(img);
  const cap = document.createElement('div');
  cap.className = 'cork-photo-caption';
  cap.textContent = p.caption;
  if (p.story) {
    const more = document.createElement('span');
    more.className = 'cork-photo-more';
    more.textContent = ' · read more';
    cap.appendChild(more);
  }
  btn.append(frame, cap);
  btn.addEventListener('click', () => openPhoto(p));
  corkGrid.appendChild(btn);
});

document.getElementById('photoClose').addEventListener('click', closePhoto);
photoModal.addEventListener('click', (e) => { if (e.target === photoModal) closePhoto(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !photoModal.hidden) closePhoto(); });

// welcome popup: shown on every load/refresh
const welcomeModal = document.getElementById('welcomeModal');
const welcomeClose = document.getElementById('welcomeClose');
function closeWelcome() {
  welcomeModal.hidden = true;
}
welcomeModal.hidden = false;
welcomeClose.addEventListener('click', closeWelcome);
welcomeModal.addEventListener('click', (e) => { if (e.target === welcomeModal) closeWelcome(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !welcomeModal.hidden) closeWelcome(); });

// resume size comes from the file itself so the title bar can't go stale
const resumeSize = document.getElementById('resumeSize');
fetch(document.querySelector('.resume-download-btn').href, { method: 'HEAD' })
  .then((r) => {
    const bytes = Number(r.headers.get('content-length'));
    if (bytes) resumeSize.textContent = '1 page · ' + Math.round(bytes / 1024) + ' kb';
  })
  .catch(() => { /* offline: keep the plain "1 page" */ });

// resume from the quick links goes through the room like the papers do
document.getElementById('quickResume').addEventListener('click', () => {
  if (room.selectZone && !room.failed) room.selectZone('resume');
  else window.open(document.querySelector('.resume-download-btn').href, '_blank');
});

// quick view: a plain, no-3D version of the content built from the same data as the panels.
// It's the way in on portrait phones, the fallback when the room can't render, and the
// keyboard/screen-reader path.
const quickView = document.getElementById('quickView');
const quickClose = document.getElementById('quickClose');
let quickReturnFocus = null;

function textEl(tag, className, text) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  n.textContent = text;
  return n;
}

function buildQuickView() {
  const list = document.getElementById('quickProjects');
  projects.forEach((p) => {
    const card = document.createElement('article');
    card.className = 'quick-project';
    card.append(textEl('h3', '', p.title), textEl('div', 'quick-meta', p.meta + ' · ' + p.stack));
    if (p.shot) {
      const img = document.createElement('img');
      img.className = 'quick-shot';
      img.src = `./assets/projects/${p.shot}`;
      img.alt = p.title + ' screenshot';
      img.loading = 'lazy';
      card.append(img);
    }
    card.append(textEl('p', '', p.body), textEl('p', 'quick-note', p.n1), textEl('p', 'quick-note', p.n2));
    if (p.repo) {
      const a = textEl('a', 'quick-repo', 'code on github ↗');
      a.href = p.repo; a.target = '_blank'; a.rel = 'noopener';
      card.append(a);
    } else {
      card.append(textEl('span', 'quick-private', 'code is private (company work) · happy to walk through it'));
    }
    list.append(card);
  });
  const about = document.getElementById('quickAbout');
  document.querySelectorAll('#panelAbout .about-text').forEach((n) => about.append(textEl('p', '', n.textContent)));
}

function openQuick() {
  if (!document.getElementById('quickProjects').childElementCount) buildQuickView();
  closeWelcome();
  quickReturnFocus = document.activeElement;
  quickView.hidden = false;
  quickView.scrollTop = 0;
  quickClose.hidden = !!room.failed;
  (room.failed ? quickView : quickClose).focus({ preventScroll: true });
}

function closeQuick() {
  if (room.failed) return; // nothing to go back to
  quickView.hidden = true;
  if (quickReturnFocus && quickReturnFocus.focus) quickReturnFocus.focus();
}

quickView.tabIndex = -1;
document.querySelectorAll('[data-open-quick]').forEach((b) => b.addEventListener('click', openQuick));
quickClose.addEventListener('click', closeQuick);
room.addEventListener('roomfail', openQuick);
if (room.failed) openQuick();

// Escape backs out one level: quick view, then (if no modal is up) the panel/resume/rack
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!quickView.hidden) { closeQuick(); return; }
  if (!photoModal.hidden || !welcomeModal.hidden) return; // those handle their own Escape
  if (state.zone !== '' || state.navOpen) back();
});

// mailto: silently does nothing on phones with no mail app set up (or inside in-app
// browsers), so every email link also copies the address and says so
const toast = document.createElement('div');
toast.className = 'toast';
toast.setAttribute('role', 'status');
toast.hidden = true;
document.body.appendChild(toast);
let toastTimer;

function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
  return new Promise((resolve, reject) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { /* fall through */ }
    ta.remove();
    ok ? resolve() : reject(new Error('copy failed'));
  });
}

function showToast(msg) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.hidden = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 3200);
}

document.addEventListener('click', (e) => {
  const link = e.target.closest && e.target.closest('a[href^="mailto:"]');
  if (!link) return;
  const address = link.getAttribute('href').slice('mailto:'.length);
  copyText(address).then(
    () => showToast('email copied: ' + address),
    () => showToast(address)
  );
}); // no preventDefault: the mail app still opens where there is one
