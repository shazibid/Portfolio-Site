// Plain-JS state machine driving the room UI. Listens to the framework-agnostic
// events room/cd-room-v2.js dispatches (zoneselect, zonehover, catmeow) and calls
// its public methods (selectZone, backOne, deselect, setMode).
import { projects } from './content/projects.js';
import { tracks } from './content/tracks.js';

const room = document.getElementById('room');

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

el.navWork.addEventListener('click', go('work', 0));
el.navAbout.addEventListener('click', go('about'));
el.navResume.addEventListener('click', go('resume'));
el.navContact.addEventListener('click', go('contact'));

el.panelBackBtn.addEventListener('click', back);
el.rackBackBtn.addEventListener('click', back);
el.resumeCloseBtn.addEventListener('click', back);
el.resumeOverlay.addEventListener('click', (e) => { if (e.target === el.resumeOverlay) back(); });
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
  const project = projects[index >= 0 ? index : 0];

  el.tipCard.hidden = zone !== '';
  el.rackBar.hidden = zone !== 'rack';
  el.resumeOverlay.hidden = zone !== 'resume';

  // the panel only shows for the three content zones; at idle it stays off-screen
  // so the room is unobstructed, and the rack/resume have their own dedicated UI.
  const panelVisible = zone === 'work' || zone === 'about' || zone === 'contact';
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
    el.workMeta.textContent = project.meta;
    el.workTitle.textContent = project.title;
    el.workStack.textContent = project.stack;
    el.workBody.textContent = project.body;
    el.workNote1.textContent = project.n1;
    el.workNote2.textContent = project.n2;
    el.discCount.textContent = 'disc ' + ((index < 0 ? 0 : index) + 1) + ' of ' + projects.length;
  }

  el.trackName.textContent = zone === 'work' ? tracks[index >= 0 ? index : 0] : 'nothing playing';
  el.playBtn.textContent = playing ? '❚❚' : '▶';
}

render();
