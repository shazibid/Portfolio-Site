// The laptop screen: a canvas texture drawn like a tiny desktop window with
// tabs (lists, plus a fake editor + Claude chat), plus hit-testing so the controller can turn a click on the screen's
// UV coordinates into a tab switch.
import { tabs } from '../content/hobbies.js';

const W = 768, H = 486;
const TAB_Y = 62, TAB_H = 34, TAB_W = 130, TAB_X0 = 28;

export function createScreen(T) {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  const texture = new T.CanvasTexture(cv);
  texture.encoding = T.sRGBEncoding;
  texture.anisotropy = 4;
  let active = 0, hover = -1;
  let st = 0, blink = true, timer = 0; // st: workspace animation frame

  function draw() {
    const bg = g.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#9fd8de'); bg.addColorStop(1, '#f5c9e4');
    g.fillStyle = bg; g.fillRect(0, 0, W, H);

    // window
    g.fillStyle = '#fff'; g.strokeStyle = '#2a2740'; g.lineWidth = 3;
    g.fillRect(14, 14, W - 28, H - 28); g.strokeRect(14, 14, W - 28, H - 28);
    g.fillStyle = '#e4e7ef'; g.fillRect(15, 15, W - 30, 34);
    g.fillStyle = '#2a2740'; g.fillRect(15, 48, W - 30, 3);
    ['#e9447f', '#f2c14e', '#2ba7b5'].forEach((c, i) => {
      g.fillStyle = c; g.beginPath(); g.arc(34 + i * 22, 32, 7, 0, 6.3); g.fill();
    });
    g.fillStyle = '#2a2740'; g.font = '16px Silkscreen, monospace'; g.textBaseline = 'middle';
    g.fillText('shazi-os / favorites', 120, 33);

    // tabs
    tabs.forEach((t, i) => {
      const x = TAB_X0 + i * (TAB_W + 10);
      g.fillStyle = i === active ? '#2a2740' : (i === hover ? '#f5c9e4' : '#eef0f6');
      g.fillRect(x, TAB_Y, TAB_W, TAB_H); g.strokeRect(x, TAB_Y, TAB_W, TAB_H);
      g.fillStyle = i === active ? '#fff' : '#2a2740'; g.font = '16px Silkscreen, monospace';
      g.textAlign = 'center'; g.fillText(t.name, x + TAB_W / 2, TAB_Y + TAB_H / 2 + 1);
    });
    g.textAlign = 'left';

    if (tabs[active].kind === 'workspace') drawWorkspace();
    else drawList();
    texture.needsUpdate = true;
  }

  function drawList() {
    tabs[active].items.forEach((it, i) => {
      const y = 132 + i * 60;
      g.fillStyle = i % 2 ? '#fff' : '#f7f2fb'; g.fillRect(28, y, W - 56, 52);
      g.fillStyle = '#e9447f'; g.font = '30px VT323, monospace'; g.fillText('♥', 42, y + 27);
      g.fillStyle = '#2a2740'; g.font = '20px Silkscreen, monospace'; g.fillText(it[0], 84, y + 17);
      g.fillStyle = '#6d6a85'; g.font = '24px VT323, monospace'; g.fillText(it[1], 84, y + 39);
    });
  }

  // ---- workspace tab: a glimpse of my editor (dark purple theme, pixel file icons) with Claude Code working beside it
  const C = {
    bg: '#1f1b2b', side: '#272236', bar: '#2f2a42', line: '#332e48', sel: '#3d3855', edge: '#4a4463',
    dim: '#78728f', ink: '#e8e4f2', kw: '#f08ab0', fn: '#8fd4a0', str: '#d4dc8f', prop: '#7cc4ea',
    mod: '#e2c08d', coral: '#e8657a', claude: '#d97757', red: '#f07178'
  };
  const PAL = { o: '#e8873a', k: '#2a2033', w: '#f6e7cf', r: '#e5484d', g: '#6fbf4a', l: '#7cc4ea', n: '#3b5b9a' };
  // little pixel icons, one per file type (folders are just chevrons, like the real explorer)
  const SPRITES = {
    js: ['oo....oo', 'oooooooo', 'ookookoo', 'oooooooo', '.owwwwo.', '..wkkw..'],
    css: ['.g.gg.g.', '..gggg..', '.rrrrrr.', 'rrwrrwrr', '.rrrwrr.', '..rrrr..'],
    html: ['...g....', '.rrrgrr.', 'rrrrrrrr', 'rrrrrrrr', '.rrrrrr.', '..rrrr..'],
    md: ['nnnnnnn.', 'nlllllln', 'nlwwwwln', 'nlllllln', 'nlwwwlln', 'nnnnnnnn']
  };
  function sprite(name, x, y) {
    const px = 2;
    SPRITES[name].forEach((row, r) => [...row].forEach((ch, c) => {
      if (ch === '.') return;
      g.fillStyle = PAL[ch]; g.fillRect(x + c * px, y + r * px, px, px);
    }));
  }
  function chevron(x, y, open) {
    g.fillStyle = C.dim; g.beginPath();
    if (open) { g.moveTo(x, y - 2); g.lineTo(x + 8, y - 2); g.lineTo(x + 4, y + 3); } else { g.moveTo(x + 1, y - 4); g.lineTo(x + 6, y); g.lineTo(x + 1, y + 4); }
    g.fill();
  }

  // [indent, name, kind, git status] (kind 'open'/'closed' = folder chevron)
  const TREE = [
    [0, 'Portfolio', 'open', ''], [1, 'assets', 'closed', ''], [1, 'content', 'closed', 'M'],
    [1, 'room', 'open', 'M'], [2, 'controller.js', 'js', 'M'], [2, 'scene.js', 'js', 'M'], [2, 'screen.js', 'js', 'M'],
    [1, 'styles', 'closed', 'M'], [1, 'app.js', 'js', 'M'], [1, 'index.html', 'html', 'M'], [1, 'README.md', 'md', '']
  ];
  const CODE = [
    [['function ', C.kw], ['syncDisc', C.fn], ['() {', C.ink]],
    [['  const ', C.kw], ['show ', C.ink], ['= ', C.kw], ['!!', C.kw], ['album', C.ink]],
    [['    || ', C.kw], ['lofiOn', C.ink], [';', C.ink]],
    [['  setTonearm', C.fn], ['(show);', C.ink]],
    [['  // needle on the grooves', C.dim]],
    [['}', C.ink]]
  ];
  const ASK = "the record player has its arm on the album art, that doesn't make sense";
  const REPLY = "needle's on the grooves now, and it rests off the record when idle";
  const VERBS = ['Mulling', 'Tilling', 'Harvesting', 'Vibing', 'Cooking'];
  const LOOP = 190;

  function wrapLines(text, maxW) {
    const lines = []; let cur = '';
    text.split(' ').forEach((w) => {
      const t = cur ? cur + ' ' + w : w;
      if (g.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t;
    });
    if (cur) lines.push(cur);
    return lines;
  }
  function dot(x, y, color) { g.fillStyle = color; g.beginPath(); g.arc(x, y, 4, 0, 6.3); g.fill(); }
  // the little rotating asterisk Claude Code shows while it works
  function spinner(x, y, r0) {
    g.strokeStyle = C.claude; g.lineWidth = 2.5; g.lineCap = 'round';
    const r = r0 + Math.sin(st * 0.5) * 1.5;
    for (let k = 0; k < 6; k++) {
      const a = st * 0.25 + k * Math.PI / 3;
      g.beginPath(); g.moveTo(x + Math.cos(a) * 2, y + Math.sin(a) * 2); g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); g.stroke();
    }
    g.lineCap = 'butt';
  }

  function drawWorkspace() {
    const top = 104, bot = 452, sx = 15, ex = 176, cx0 = 412, right = W - 15;
    g.textBaseline = 'middle'; g.textAlign = 'left';
    // sidebar: explorer with the pixel icons
    g.fillStyle = C.side; g.fillRect(sx, top, ex - sx, bot - top);
    g.fillStyle = C.dim; g.font = '18px VT323, monospace'; g.fillText('Explorer', sx + 10, top + 14);
    TREE.forEach(([ind, name, kind, git], i) => {
      const y = top + 42 + i * 24, x = sx + 8 + ind * 10, sel = name === 'controller.js';
      if (sel) { g.fillStyle = C.sel; g.fillRect(sx + 3, y - 11, ex - sx - 6, 22); }
      const folder = kind === 'open' || kind === 'closed';
      if (folder) chevron(x, y, kind === 'open'); else sprite(kind, x + 2, y - 6);
      g.fillStyle = C.ink; g.fillText(name, x + 20, y + 1);
      if (git) { g.fillStyle = C.mod; g.fillText(git, ex - 14, y + 1); }
    });
    // editor
    g.fillStyle = C.bg; g.fillRect(ex, top, cx0 - ex, bot - top);
    g.fillStyle = C.side; g.fillRect(ex, top, cx0 - ex, 26);
    g.fillStyle = C.bar; g.fillRect(ex + 6, top + 4, 132, 22);
    g.fillStyle = C.coral; g.fillRect(ex + 6, top + 4, 132, 2);
    sprite('js', ex + 12, top + 10);
    g.fillStyle = C.ink; g.font = '18px VT323, monospace'; g.fillText('controller.js', ex + 32, top + 16);
    g.fillStyle = C.mod; g.fillText('M', ex + 128, top + 16);
    CODE.forEach((segs, i) => {
      const y = top + 46 + i * 24;
      if (i === 3) { g.fillStyle = C.line; g.fillRect(ex, y - 12, cx0 - ex, 24); g.fillStyle = C.fn; g.fillRect(ex + 2, y - 12, 3, 24); }
      g.fillStyle = i === 3 ? C.ink : C.dim; g.fillText(String(i + 1), ex + 14, y);
      let x = ex + 38;
      segs.forEach(([t, c]) => { g.fillStyle = c; g.fillText(t, x, y); x += g.measureText(t).width; });
      if (i === 3 && blink) { g.fillStyle = C.ink; g.fillRect(x + 1, y - 8, 2, 16); }
    });
    // claude code pane
    g.fillStyle = C.side; g.fillRect(cx0, top, right - cx0, bot - top);
    g.fillStyle = C.bar; g.fillRect(cx0, top, right - cx0, 26);
    spinner(cx0 + 16, top + 13, 6);
    g.fillStyle = C.ink; g.font = '18px VT323, monospace'; g.fillText('Record player arm positioning', cx0 + 30, top + 14);
    const tx = cx0 + 14, tw = right - cx0 - 28;
    let y = top + 36;
    const ask = wrapLines(ASK, tw - 16), askH = ask.length * 18 + 12;
    g.fillStyle = C.bar; g.fillRect(tx, y, tw, askH); g.strokeStyle = C.edge; g.lineWidth = 1; g.strokeRect(tx + 0.5, y + 0.5, tw - 1, askH - 1);
    g.fillStyle = C.ink; ask.forEach((l, i) => g.fillText(l, tx + 8, y + 15 + i * 18));
    y += askH + 14;
    if (st >= 4) { dot(tx + 4, y, C.dim); g.fillStyle = C.dim; g.fillText('Thought for 3s', tx + 16, y + 1); y += 24; }
    if (st >= 12) {
      dot(tx + 4, y, C.fn); g.fillStyle = C.ink; g.fillText('Edit', tx + 16, y + 1);
      g.fillStyle = C.prop; g.fillText('scene.js', tx + 52, y + 1); g.fillStyle = C.dim; g.fillText('Modified', tx + 130, y + 1);
      y += 14;
      g.fillStyle = C.bg; g.fillRect(tx + 16, y, tw - 16, 40);
      g.fillStyle = C.red; g.fillText('- arm.rotation.y = -0.85;', tx + 24, y + 11);
      g.fillStyle = C.fn; g.fillText('+ const setTonearm = (on) => {', tx + 24, y + 29);
      y += 52;
    }
    if (st >= 24) {
      dot(tx + 4, y, C.fn); g.fillStyle = C.ink; g.fillText('Edit', tx + 16, y + 1);
      g.fillStyle = C.prop; g.fillText('controller.js', tx + 52, y + 1); g.fillStyle = C.dim; g.fillText('Added 1 line', tx + 158, y + 1);
      y += 26;
    }
    if (st >= 32 && st < 70) {
      spinner(tx + 6, y, 7);
      g.fillStyle = C.claude; g.fillText(VERBS[Math.floor(st / 8) % VERBS.length] + '...', tx + 20, y + 1);
      g.fillStyle = C.dim; g.fillText('(' + Math.floor((st - 32) / 3) + 's)', tx + 130, y + 1);
    } else if (st >= 70) {
      const shown = REPLY.slice(0, st - 70);
      wrapLines(shown, tw - 16).forEach((l, i) => { g.fillStyle = C.ink; g.fillText(l, tx + 16, y + i * 18); });
      dot(tx + 4, y, C.claude);
      if (st >= 70 + REPLY.length) {
        g.fillStyle = C.dim; g.fillText('Harvested in 12s', tx + 16, y + wrapLines(REPLY, tw - 16).length * 18 + 8);
      }
    }
    // input box
    g.strokeStyle = C.edge; g.lineWidth = 2; g.strokeRect(tx, bot - 36, tw, 26);
    g.fillStyle = C.dim; g.font = '18px VT323, monospace'; g.fillText('Queue another message...', tx + 8, bot - 22);
    g.fillStyle = C.bar; g.fillRect(tx + tw - 96, bot - 32, 90, 18);
    g.fillStyle = C.ink; g.font = '14px VT323, monospace'; g.fillText('Sonnet 5 High', tx + tw - 90, bot - 22);
    // status bar (same dark as the rest, like the real one)
    g.fillStyle = '#181422'; g.fillRect(sx, bot, right - sx, H - 14 - bot - 1);
    g.fillStyle = C.ink; g.font = '14px VT323, monospace'; g.fillText('v2*    0 errors    Prettier    Port: 5500', sx + 8, bot + 9);
  }

  // the workspace animates (claude working, cursor blink) only while its tab is showing
  function tick() {
    if (++st >= LOOP) st = 0;
    if (st % 5 === 0) blink = !blink;
    draw();
  }
  function sync() {
    const on = tabs[active].kind === 'workspace';
    if (on && !timer) { st = 0; blink = true; timer = setInterval(tick, 90); }
    else if (!on && timer) { clearInterval(timer); timer = 0; }
  }

  // uv (0..1, origin bottom-left) -> tab index or -1
  function tabAt(uv) {
    const x = uv.x * W, y = (1 - uv.y) * H;
    if (y < TAB_Y || y > TAB_Y + TAB_H) return -1;
    const i = Math.floor((x - TAB_X0) / (TAB_W + 10));
    const inside = (x - TAB_X0) - i * (TAB_W + 10) <= TAB_W;
    return i >= 0 && i < tabs.length && inside ? i : -1;
  }

  draw();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);

  return {
    texture,
    tabAt,
    setHover(i) { if (i !== hover) { hover = i; draw(); } },
    click(uv) { const i = tabAt(uv); if (i >= 0 && i !== active) { active = i; sync(); draw(); } return i >= 0; }
  };
}
