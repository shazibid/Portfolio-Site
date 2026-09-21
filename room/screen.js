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

  // ---- games + hobbies tabs: pixel-art tiles that animate, rank meters, and chips
  const INK = '#2a2740', PINK = '#e9447f', TEAL = '#2ba7b5', GOLD = '#f2c14e';
  function rect(x, y, w, h, c) { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); }
  function star(x, y, r, c) {
    g.fillStyle = c; g.beginPath();
    g.moveTo(x, y - r); g.quadraticCurveTo(x, y, x + r, y); g.quadraticCurveTo(x, y, x, y + r);
    g.quadraticCurveTo(x, y, x - r, y); g.quadraticCurveTo(x, y, x, y - r); g.fill();
  }
  function tile(x, y, s, bg) { rect(x, y, s, s, bg); g.strokeStyle = INK; g.lineWidth = 3; g.strokeRect(x, y, s, s); }
  function chip(text, xr, y, bg, fg) {
    g.font = '14px Silkscreen, monospace';
    const w = g.measureText(text).width + 16;
    rect(xr - w, y, w, 20, bg); g.strokeStyle = INK; g.lineWidth = 2; g.strokeRect(xr - w, y, w, 20);
    g.fillStyle = fg; g.textAlign = 'left'; g.fillText(text, xr - w + 8, y + 11);
  }
  function meter(x, y, w, fill) {
    const n = 10, sw = (w - (n - 1) * 3) / n, lit = fill * n;
    for (let i = 0; i < n; i++) {
      const on = i < Math.floor(lit) || (i === Math.floor(lit) && st % 6 < 3); // the frontier segment blinks
      rect(x + i * (sw + 3), y, sw, 12, i < lit ? (on ? PINK : '#f5c9e4') : '#e4e7ef');
    }
  }

  // game icons, 44px tiles; each has a little idle animation driven by st
  const GAME_ICON = {
    valorant(x, y, s) {
      tile(x, y, s, '#ff4655');
      g.fillStyle = '#fff'; g.beginPath();
      g.moveTo(x + 8, y + 12); g.lineTo(x + 17, y + 12); g.lineTo(x + 25, y + 27); g.lineTo(x + 25, y + 12);
      g.lineTo(x + 36, y + 12); g.lineTo(x + 25, y + 34); g.lineTo(x + 20, y + 34); g.closePath(); g.fill();
    },
    overwatch(x, y, s) {
      tile(x, y, s, '#f99e1a');
      g.strokeStyle = '#fff'; g.lineWidth = 5; g.beginPath(); g.arc(x + 22, y + 22, 12, 0, 6.3); g.stroke();
      rect(x + 18, y + 8, 8, 14, '#fff'); // the little notch
      g.fillStyle = '#f99e1a'; g.fillRect(x + 20, y + 8, 4, 6);
      g.fillStyle = '#fff'; g.beginPath(); g.moveTo(x + 22, y + 34); g.lineTo(x + 14, y + 26); g.lineTo(x + 30, y + 26); g.fill();
    },
    genshin(x, y, s) {
      tile(x, y, s, '#6d5bd0');
      const p = 1 + Math.sin(st * 0.35) * 0.2;
      star(x + 22, y + 22, 15 * p, GOLD); star(x + 22, y + 22, 7 * p, '#fff');
      star(x + 10, y + 11, 4 + Math.sin(st * 0.5) * 2, '#fff'); star(x + 35, y + 33, 4 + Math.cos(st * 0.5) * 2, '#fff');
    },
    minecraft(x, y, s) {
      tile(x, y, s, '#7cc4ea');
      const b = 8, ox = x + 6, oy = y + 6; // 4x4 grass block, deterministic speckle
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
        const top = r === 0, v = (r * 5 + c * 3) % 4;
        rect(ox + c * b, oy + r * b, b, b, top ? (v % 2 ? '#5fae3c' : '#6fbf4a') : (v % 2 ? '#8a5a35' : '#7a4e2c'));
      }
      rect(ox + 8, oy + 8, b, b / 2, '#6fbf4a'); // grass overhang
    },
    tomodachi(x, y, s) {
      tile(x, y, s, '#c9ecf0');
      g.fillStyle = GOLD; g.beginPath(); g.arc(x + 22, y + 22, 15, 0, 6.3); g.fill(); g.strokeStyle = INK; g.lineWidth = 2; g.stroke();
      const blinkNow = st % 22 < 2;
      rect(x + 15, y + 17, 4, blinkNow ? 2 : 7, INK); rect(x + 26, y + 17, 4, blinkNow ? 2 : 7, INK);
      g.strokeStyle = INK; g.beginPath(); g.arc(x + 22, y + 26, 6, 0.2, 2.9); g.stroke();
      rect(x + 12, y + 26, 4, 3, '#f5a3c1'); rect(x + 29, y + 26, 4, 3, '#f5a3c1');
    }
  };
  const GAME_KEYS = ['valorant', 'overwatch', 'genshin', 'minecraft', 'tomodachi'];

  // hobby icons, 60px tiles
  const HOBBY_ICON = {
    art(x, y, s) {
      tile(x, y, s, '#fff7ea');
      const cols = [PINK, GOLD, TEAL, '#8a6fd6'];
      cols.forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(x + 12 + (i % 2) * 14, y + 14 + Math.floor(i / 2) * 13, 5, 0, 6.3); g.fill(); });
      // brush strokes paint themselves across the bottom, then reset
      const t = (st % 40) / 40;
      g.strokeStyle = cols[Math.floor(st / 40) % 4]; g.lineWidth = 5; g.lineCap = 'round';
      g.beginPath(); g.moveTo(x + 8, y + 46);
      for (let u = 0; u <= t; u += 0.05) g.lineTo(x + 8 + u * 44, y + 46 + Math.sin(u * 9) * 4);
      g.stroke(); g.lineCap = 'butt';
    },
    nails(x, y, s) {
      tile(x, y, s, '#ffe3f0');
      const pol = [PINK, TEAL, GOLD, '#8a6fd6', '#f5a3c1'], hs = [12, 8, 5, 8, 14]; // finger tops, pinky..thumb-ish
      for (let i = 0; i < 5; i++) {
        const fx = x + 6 + i * 10, top = y + 12 + (i === 2 ? 0 : i === 1 || i === 3 ? 4 : 10);
        rect(fx, top, 8, y + s - 4 - top, '#f6d5b8');
        rect(fx, top, 8, 9, pol[(i + Math.floor(st / 14)) % 5]); // polish colors rotate along the fingers
        if ((st + i * 5) % 20 < 3) star(fx + 6, top + 2, 4, '#fff');
      }
      rect(x + 4, y + s - 12, s - 8, 8, '#f6d5b8');
    },
    band(x, y, s) {
      tile(x, y, s, '#2a2740');
      const eq = [0, 1, 2, 3, 4, 5]; // little equalizer under the notes
      eq.forEach((i) => { const h = 6 + Math.abs(Math.sin(st * 0.4 + i * 1.3)) * 22; rect(x + 8 + i * 8, y + s - 8 - h, 5, h, i % 2 ? PINK : TEAL); });
      g.fillStyle = '#fff'; g.font = '22px VT323, monospace'; g.textAlign = 'center';
      const bob = Math.sin(st * 0.3) * 3;
      g.fillText('♪', x + 16, y + 14 + bob); g.fillText('♫', x + 40, y + 12 - bob); g.textAlign = 'left';
    },
    piano(x, y, s) {
      tile(x, y, s, '#fff');
      const kw = 8, pressed = Math.floor(st / 6) % 7;
      for (let i = 0; i < 7; i++) rect(x + 2 + i * kw, y + 2, kw - 1, s - 4 - (i === pressed ? 4 : 0), i === pressed ? '#f5c9e4' : '#f4f2fa');
      [0, 1, 3, 4, 5].forEach((i) => rect(x + 2 + i * kw + 5, y + 2, 6, 30, INK));
    },
    skating(x, y, s) {
      tile(x, y, s, '#dff3f7');
      rect(x + 3, y + 40, s - 6, 2, '#a6d6de');
      const u = (st % 60) / 60, px = x + 8 + u * (s - 16), py = y + 30 - Math.abs(Math.sin(u * Math.PI * 2)) * 8;
      g.strokeStyle = 'rgba(42,167,181,.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + 8, y + 42); g.lineTo(px, y + 42); g.stroke();
      rect(px - 3, py - 14, 6, 6, '#f6d5b8'); rect(px - 4, py - 8, 8, 12, PINK); rect(px - 5, py + 4, 4, 6, INK); rect(px + 1, py + 4, 4, 6, INK);
    },
    beach(x, y, s) {
      tile(x, y, s, '#ffd9ec');
      g.fillStyle = GOLD; g.beginPath(); g.arc(x + 40, y + 16 + Math.sin(st * 0.15) * 2, 8, 0, 6.3); g.fill();
      [[6, 20], [16, 30], [26, 24], [38, 34], [48, 26]].forEach(([bx, bh]) => { rect(x + bx, y + 44 - bh, 9, bh, '#5a4f8a'); rect(x + bx + 2, y + 44 - bh + 3, 2, 2, GOLD); });
      rect(x + 2, y + 44, s - 4, 14, '#7fd0d8');
      for (let i = 0; i < 4; i++) rect(x + 5 + ((i * 15 + st) % (s - 14)), y + 48 + (i % 2) * 5, 8, 2, '#fff');
    }
  };
  const HOBBY_KEYS = ['art', 'band', 'piano', 'skating', 'beach', 'nails'];

  function drawList() {
    const t = tabs[active], games = t.name === 'games';
    g.textBaseline = 'middle'; g.textAlign = 'left';
    g.fillStyle = INK; g.font = '22px VT323, monospace';
    g.fillText(games ? '▸ player select' : '▸ off-duty', 30, 118);
    g.fillStyle = '#6d6a85'; g.fillText(games ? '5 saves loaded' : 'what i do when i log off', 190, 118);
    if (st % 12 < 6) { g.fillStyle = PINK; g.fillRect(W - 44, 111, 12, 14); }

    if (games) {
      t.items.forEach((it, i) => {
        const y = 136 + i * 63;
        rect(28, y, W - 56, 57, i % 2 ? '#fff' : '#f7f2fb');
        rect(28, y, 4, 57, [PINK, GOLD, '#6d5bd0', '#6fbf4a', TEAL][i]);
        GAME_ICON[GAME_KEYS[i]](40, y + 6, 44);
        g.textAlign = 'left'; g.fillStyle = INK; g.font = '20px Silkscreen, monospace'; g.fillText(it[0], 98, y + 19);
        g.fillStyle = '#6d6a85'; g.font = '22px VT323, monospace'; g.fillText(it[1], 98, y + 42);
        if (it[3] != null) {
          chip(it[2], W - 44, y + 6, '#fff', INK);
          meter(W - 44 - 150, y + 36, 150, it[3]);
        } else chip(it[2], W - 44, y + 18, '#f5c9e4', INK);
      });
    } else {
      const cw = 352, chh = 104;
      t.items.forEach((it, i) => {
        const x = 28 + (i % 2) * (cw + 8), y = 136 + Math.floor(i / 2) * (chh + 6);
        rect(x, y, cw, chh, i % 3 === 1 ? '#f7f2fb' : '#fff'); g.strokeStyle = INK; g.lineWidth = 2; g.strokeRect(x, y, cw, chh);
        rect(x, y, cw, 4, [PINK, TEAL, GOLD, '#8a6fd6', '#6fbf4a', '#f5a3c1'][i]);
        HOBBY_ICON[HOBBY_KEYS[i]](x + 14, y + 26, 60);
        g.textAlign = 'left'; g.fillStyle = INK; g.font = '20px Silkscreen, monospace'; g.fillText(it[0], x + 88, y + 22);
        g.fillStyle = '#6d6a85'; g.font = '22px VT323, monospace';
        wrapLines(it[1], cw - 100).slice(0, 2).forEach((l, k) => g.fillText(l, x + 88, y + 42 + k * 18));
        chip(it[2], x + cw - 10, y + chh - 27, '#f5c9e4', INK);
      });
    }
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

  // every tab animates (claude working, cursor blink, tile idle loops); the workspace restarts its script when picked
  function tick() {
    if (++st >= LOOP) st = 0;
    if (st % 5 === 0) blink = !blink;
    draw();
  }
  function sync() { if (!timer) timer = setInterval(tick, 90); }

  // uv (0..1, origin bottom-left) -> tab index or -1
  function tabAt(uv) {
    const x = uv.x * W, y = (1 - uv.y) * H;
    if (y < TAB_Y || y > TAB_Y + TAB_H) return -1;
    const i = Math.floor((x - TAB_X0) / (TAB_W + 10));
    const inside = (x - TAB_X0) - i * (TAB_W + 10) <= TAB_W;
    return i >= 0 && i < tabs.length && inside ? i : -1;
  }

  sync();
  draw();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);

  return {
    texture,
    tabAt,
    setHover(i) { if (i !== hover) { hover = i; draw(); } },
    click(uv) { const i = tabAt(uv); if (i >= 0 && i !== active) { active = i; st = 0; draw(); } return i >= 0; }
  };
}
