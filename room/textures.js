// Canvas-drawn textures for the room's props. Every function takes THREE (as
// `T`) explicitly rather than importing a global, since THREE is loaded from
// a CDN <script> tag and only exists on window at runtime.
export function tex(T, w, h, draw, opts) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new T.CanvasTexture(c);
  t.encoding = T.sRGBEncoding;
  if (opts && opts.repeat) { t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(opts.repeat[0], opts.repeat[1]); }
  return t;
}

export function coverTexture(T, cd, i) {
  return tex(T, 512, 512, (g) => {
    g.fillStyle = cd.bg; g.fillRect(0, 0, 512, 512);
    g.globalAlpha = 0.14; g.fillStyle = cd.ink;
    for (let y = 0; y < 512; y += 26) g.fillRect(0, y, 512, 9);
    g.globalAlpha = 1; g.fillStyle = cd.ink;
    g.fillRect(34, 34, 350, 4); g.fillRect(34, 474, 350, 4);
    g.font = '600 30px Verdana, Geneva, sans-serif';
    g.fillText(String(i + 1).padStart(2, '0'), 36, 82);
    g.font = '700 52px Verdana, Geneva, sans-serif';
    g.fillText(cd.title, 36, 300);
    g.font = '22px Verdana, Geneva, sans-serif';
    g.fillText(cd.sub, 36, 430);
    g.fillText('shazi bidarian', 36, 462);
    // spine: the only strip guaranteed visible when cases overlap in the rack
    g.globalAlpha = 0.18; g.fillStyle = cd.ink;
    g.fillRect(396, 0, 116, 512);
    g.globalAlpha = 1; g.fillStyle = cd.ink;
    g.fillRect(396, 0, 4, 512);
    g.save();
    g.translate(468, 486);
    g.rotate(-Math.PI / 2);
    g.textAlign = 'left';
    g.font = '700 46px Verdana, Geneva, sans-serif';
    g.fillText(cd.title, 0, 0);
    g.font = '600 26px Verdana, Geneva, sans-serif';
    g.fillText(String(i + 1).padStart(2, '0'), 400, 0);
    g.restore();
  });
}

export function discTexture(T) {
  return tex(T, 512, 512, (g) => {
    const grad = g.createConicGradient ? g.createConicGradient(0, 256, 256) : null;
    if (grad) {
      grad.addColorStop(0, '#cfd6e4'); grad.addColorStop(0.16, '#f3d9ea');
      grad.addColorStop(0.34, '#d6e8e4'); grad.addColorStop(0.52, '#e8e0f0');
      grad.addColorStop(0.7, '#cfe0ee'); grad.addColorStop(0.86, '#f0dee2');
      grad.addColorStop(1, '#cfd6e4'); g.fillStyle = grad;
    } else g.fillStyle = '#dde3ee';
    g.fillRect(0, 0, 512, 512);
    g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 1;
    for (let r = 70; r < 250; r += 5) { g.beginPath(); g.arc(256, 256, r, 0, 6.3); g.stroke(); }
  });
}

// The background loop's record: black vinyl, pink label with the track on it.
export function vinylTexture(T) {
  return tex(T, 512, 512, (g) => {
    g.fillStyle = '#17151f'; g.fillRect(0, 0, 512, 512);
    g.strokeStyle = 'rgba(255,255,255,0.07)'; g.lineWidth = 1;
    for (let r = 100; r < 250; r += 4) { g.beginPath(); g.arc(256, 256, r, 0, 6.3); g.stroke(); }
    g.fillStyle = '#e9447f'; g.beginPath(); g.arc(256, 256, 92, 0, 6.3); g.fill();
    g.fillStyle = '#fff'; g.textAlign = 'center';
    g.font = '700 22px Verdana, Geneva, sans-serif'; g.fillText('lofi loop', 256, 236);
    g.font = '15px Verdana, Geneva, sans-serif'; g.fillText("shazi's room", 256, 290);
  });
}

// A vinyl record: black grooved disc with the album art as the center label.
// Returns a texture right away and fills the label in once the image loads;
// CircleGeometry's UVs inscribe the disc in the square.
export function discArtTexture(T, url) {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const t = new T.CanvasTexture(c);
  t.encoding = T.sRGBEncoding;
  const g = c.getContext('2d');
  const drawRecord = () => {
    g.fillStyle = '#141318'; g.fillRect(0, 0, 512, 512);
    for (let r = 178; r < 254; r += 3) {
      g.strokeStyle = r % 9 === 0 ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.04)';
      g.lineWidth = 1; g.beginPath(); g.arc(256, 256, r, 0, 6.3); g.stroke();
    }
    // sheen so the spin reads on a black surface
    const sheen = g.createConicGradient ? g.createConicGradient(0.6, 256, 256) : null;
    if (sheen) {
      [0, 0.5].forEach((o) => {
        sheen.addColorStop(o, 'rgba(255,255,255,0)');
        sheen.addColorStop(o + 0.08, 'rgba(255,255,255,0.16)');
        sheen.addColorStop(o + 0.16, 'rgba(255,255,255,0)');
      });
      sheen.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = sheen; g.beginPath(); g.arc(256, 256, 254, 0, 6.3); g.arc(256, 256, 176, 0, 6.3, true); g.fill();
    }
  };
  drawRecord();
  const img = new Image();
  img.onload = () => {
    g.save();
    g.beginPath(); g.arc(256, 256, 170, 0, 6.3); g.clip();
    g.drawImage(img, 86, 86, 340, 340);
    g.restore();
    t.needsUpdate = true;
  };
  img.src = url;
  return t;
}

export function paperTexture(T) {
  return tex(T, 420, 560, (g) => {
    g.fillStyle = '#fffdf8'; g.fillRect(0, 0, 420, 560);
    g.fillStyle = '#2a2740';
    g.font = '700 82px Verdana, Geneva, sans-serif';
    g.textAlign = 'center';
    g.fillText('RESUME', 210, 92);
    g.textAlign = 'left';
    g.fillStyle = '#b5257c'; g.font = '17px Verdana, Geneva, sans-serif';
    g.fillText('shazi bidarian · 1 page', 34, 124);
    g.fillStyle = '#2a2740'; g.fillRect(34, 140, 352, 3);
    let y = 172;
    [[0.9, 1], [0.6, 0], [0.75, 0], [0.5, 0], [0.85, 1], [0.7, 0], [0.55, 0], [0.8, 0], [0.65, 1], [0.6, 0], [0.7, 0], [0.45, 0]].forEach((r) => {
      g.fillStyle = r[1] ? '#2a2740' : '#9c99ad';
      g.fillRect(34, y, 352 * r[0], r[1] ? 8 : 5);
      y += r[1] ? 30 : 22;
    });
  });
}

export function cardTexture(T, label, sub, bg, ink) {
  return tex(T, 384, 256, (g) => {
    g.fillStyle = bg; g.fillRect(0, 0, 384, 256);
    g.strokeStyle = ink; g.lineWidth = 5; g.strokeRect(14, 14, 356, 228);
    g.fillStyle = ink; g.font = '700 38px Verdana, Geneva, sans-serif';
    g.fillText(label, 34, 120);
    g.font = '20px Verdana, Geneva, sans-serif';
    g.fillText(sub, 34, 158);
  });
}

// Transparent-background lettering, e.g. for text painted onto furniture.
// Redraws once webfonts load so it doesn't stay stuck on the fallback font.
export function labelTexture(T, text, ink) {
  const draw = (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.fillStyle = ink; g.textAlign = 'center'; g.textBaseline = 'middle';
    // shrink the type until the line fits the plank with a little margin
    let size = 84;
    do { g.font = '400 ' + size + 'px Silkscreen, monospace'; size -= 2; }
    while (g.measureText(text).width > w * 0.94 && size > 10);
    g.fillText(text, w / 2, h / 2);
  };
  const t = tex(T, 1536, 256, draw);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { draw(t.image.getContext('2d'), 1536, 256); t.needsUpdate = true; });
  }
  return t;
}

// MacBook-style keyboard: black keys on a transparent background so the laptop's
// own body color shows through as the deck. Drawn top-down; the trackpad is only
// a faint outline. Arrow keys use the inverted-T layout with half-height up/down.
export function keyboardTexture(T) {
  return tex(T, 1200, 684, (g, w) => {
    const rr = (x, y, kw, kh, r, fill) => {
      g.fillStyle = fill; g.beginPath();
      g.moveTo(x + r, y); g.arcTo(x + kw, y, x + kw, y + kh, r); g.arcTo(x + kw, y + kh, x, y + kh, r);
      g.arcTo(x, y + kh, x, y, r); g.arcTo(x, y, x + kw, y, r); g.closePath(); g.fill();
    };
    const KEY = '#17171b';
    const pad = 34, gap = 8, kh = 70, top = 30, fnh = 42;
    // relative key widths; every row sums to 14.6
    const rows = [
      [1.4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.4],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.6],
      [1.6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1.9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.7],
      [2.4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.2],
      [1, 1, 1.2, 1.3, 4.6, 1.3, 1.2, 'arrows']
    ];
    let y = top;
    rows.forEach((row, ri) => {
      const h = ri === 0 ? fnh : kh;
      const widths = row.map((r) => (r === 'arrows' ? 3 : r));
      const total = widths.reduce((a, b) => a + b, 0);
      const unit = (w - pad * 2 - gap * (row.length - 1)) / total;
      let x = pad;
      row.forEach((r, ci) => {
        const kw = widths[ci] * unit + (r === 'arrows' ? gap * 2 : 0);
        if (r === 'arrows') {
          const aw = (kw - gap * 2) / 3, ah = (h - gap) / 2;
          rr(x, y + ah + gap, aw, ah, 7, KEY);                 // left
          rr(x + aw + gap, y, aw, ah, 7, KEY);                 // up
          rr(x + aw + gap, y + ah + gap, aw, ah, 7, KEY);      // down
          rr(x + (aw + gap) * 2, y + ah + gap, aw, ah, 7, KEY); // right
        } else rr(x, y, kw, h, 9, KEY);
        x += kw + gap;
      });
      y += h + gap;
    });
    // trackpad: just an outline + faint lift, like the real glass panel
    const tw = 440, tx = (w - tw) / 2, ty = y + 22, th = 684 - ty - 24;
    rr(tx, ty, tw, th, 16, 'rgba(255,255,255,0.07)');
    g.strokeStyle = 'rgba(0,0,0,0.28)'; g.lineWidth = 3; g.stroke();
  });
}

export function polaroidTexture(T, label, src, onLoad) {
  const t = tex(T, 300, 360, (g) => {
    g.fillStyle = '#fffdf8'; g.fillRect(0, 0, 300, 360);
    g.fillStyle = '#ddd8ea'; g.fillRect(20, 20, 260, 250);
    g.save(); g.beginPath(); g.rect(20, 20, 260, 250); g.clip();
    g.strokeStyle = '#c6c0d8'; g.lineWidth = 8;
    for (let i = -260; i < 300; i += 22) { g.beginPath(); g.moveTo(20 + i, 270); g.lineTo(20 + i + 250, 20); g.stroke(); }
    g.restore();
    g.fillStyle = '#5a5578'; g.font = '19px monospace';
    g.fillText(label, 24, 320);
  });
  if (src) {
    // swap the striped placeholder for the real photo once it loads (cover-crop);
    // if the file is missing the placeholder just stays
    const img = new Image();
    img.onload = () => {
      const g = t.image.getContext('2d');
      const s = Math.max(260 / img.width, 250 / img.height);
      const sw = 260 / s, sh = 250 / s;
      g.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, 20, 20, 260, 250);
      t.needsUpdate = true;
      if (onLoad) onLoad(img);
    };
    img.src = src;
  }
  return t;
}

export function posterTexture(T, top, bottom, bg, ink) {
  return tex(T, 400, 560, (g) => {
    g.fillStyle = bg; g.fillRect(0, 0, 400, 560);
    g.fillStyle = ink;
    g.font = '700 54px Verdana, Geneva, sans-serif';
    g.fillText(top, 32, 100);
    for (let i = 0; i < 9; i++) { g.globalAlpha = 0.5 - i * 0.05; g.fillRect(32, 140 + i * 36, 336 - i * 30, 14); }
    g.globalAlpha = 1;
    g.font = '26px Verdana, Geneva, sans-serif';
    g.fillText(bottom, 32, 520);
  });
}

export function windowTexture(T, night) {
  return tex(T, 512, 400, (g, w, h) => {
    const grad = g.createLinearGradient(0, 0, 0, h);
    if (night) {
      grad.addColorStop(0, '#141a33'); grad.addColorStop(0.55, '#2a2f52'); grad.addColorStop(1, '#4b3f63');
      g.fillStyle = grad; g.fillRect(0, 0, w, h);
      g.fillStyle = '#fdf6e0';
      g.beginPath(); g.arc(370, 90, 30, 0, 6.3); g.fill();
      g.globalAlpha = 0.85;
      for (let i = 0; i < 60; i++) { g.fillRect(Math.random() * w, Math.random() * h * 0.7, 2, 2); }
      g.globalAlpha = 1;
      g.fillStyle = '#1b2036'; g.fillRect(0, h * 0.78, w, h * 0.22);
      g.fillStyle = '#e8c77a';
      for (let i = 0; i < 26; i++) g.fillRect(14 + i * 19, h * 0.8 + (i % 3) * 9, 6, 5);
    } else {
      grad.addColorStop(0, '#8fc9f0'); grad.addColorStop(0.55, '#d8ecfb'); grad.addColorStop(1, '#fbe3c2');
      g.fillStyle = grad; g.fillRect(0, 0, w, h);
      g.fillStyle = 'rgba(255,255,255,0.75)';
      g.beginPath(); g.ellipse(120, 96, 66, 28, 0, 0, 6.3); g.fill();
      g.beginPath(); g.ellipse(190, 112, 50, 22, 0, 0, 6.3); g.fill();
      g.fillStyle = '#b6cf9e'; g.fillRect(0, h * 0.8, w, h * 0.2);
      g.fillStyle = '#93b47c';
      for (let i = 0; i < 14; i++) g.fillRect(10 + i * 37, h * 0.8 - 14 - (i % 4) * 8, 22, 18);
    }
  });
}

export function wingTexture(T) {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 256;
  const g = c.getContext('2d');
  g.clearRect(0, 0, 128, 256);
  const grad = g.createLinearGradient(0, 0, 128, 256);
  grad.addColorStop(0, '#f7b855');
  grad.addColorStop(0.5, '#e8792a');
  grad.addColorStop(1, '#c4571c');
  g.fillStyle = grad;
  g.beginPath(); g.ellipse(52, 88, 50, 78, -0.16, 0, 6.3); g.fill();
  g.beginPath(); g.ellipse(42, 188, 40, 58, 0.12, 0, 6.3); g.fill();
  g.strokeStyle = '#4a2a10'; g.lineWidth = 5;
  g.beginPath(); g.ellipse(52, 88, 50, 78, -0.16, 0, 6.3); g.stroke();
  g.beginPath(); g.ellipse(42, 188, 40, 58, 0.12, 0, 6.3); g.stroke();
  const t = new T.CanvasTexture(c);
  t.encoding = T.sRGBEncoding;
  return t;
}

// Little engraved plaque for the piano trophy.
export function plaqueTexture(T, top, bottom) {
  return tex(T, 256, 96, (g, w, h) => {
    g.fillStyle = '#3a2f22'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#f2d98a'; g.textAlign = 'center';
    g.font = '700 34px Verdana, Geneva, sans-serif'; g.fillText(top, w / 2, 42);
    g.font = '24px Verdana, Geneva, sans-serif'; g.fillText(bottom, w / 2, 78);
  });
}

// A postcard for the corkboard's goal: nyc.
export function nycCardTexture(T) {
  return tex(T, 512, 320, (g, w, h) => {
    g.fillStyle = '#fff4e0'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#e9447f'; g.lineWidth = 6; g.strokeRect(10, 10, w - 20, h - 20);
    // night-sky skyline along the bottom
    const top = 150;
    g.fillStyle = '#2a2740'; g.fillRect(24, top, w - 48, h - top - 24);
    const bs = [[30, 60], [70, 90], [112, 70], [150, 118], [196, 84], [236, 140], [284, 96], [326, 76], [366, 112], [410, 66], [446, 90]];
    g.fillStyle = '#3d3860';
    bs.forEach((b) => g.fillRect(b[0], h - 24 - b[1], 38, b[1]));
    g.fillStyle = '#4a4470'; // empire-state-ish spire on the tallest one
    g.fillRect(246, h - 24 - 140 - 26, 18, 26); g.fillRect(252, h - 24 - 140 - 44, 6, 18);
    g.fillStyle = '#f5c95a';
    bs.forEach((b, i) => {
      for (let y = h - 24 - b[1] + 8; y < h - 34; y += 14) {
        for (let x = b[0] + 6; x < b[0] + 34; x += 11) if ((x * 7 + y * 3 + i) % 5 < 2) g.fillRect(x, y, 4, 6);
      }
    });
    g.fillStyle = '#5a5578'; g.font = '700 15px Verdana, Geneva, sans-serif'; g.fillText('GREETINGS FROM', 34, 44);
    g.fillStyle = '#e9447f'; g.font = '700 84px Verdana, Geneva, sans-serif'; g.fillText('NYC', 32, 128);
    g.fillStyle = '#5a5578'; g.font = 'italic 17px Verdana, Geneva, sans-serif'; g.fillText('post-grad goal', 262, 118);
    // stamp
    g.fillStyle = '#fff'; g.fillRect(410, 26, 70, 84);
    g.strokeStyle = '#8a6fd6'; g.lineWidth = 3; g.setLineDash([5, 4]); g.strokeRect(410, 26, 70, 84); g.setLineDash([]);
    g.fillStyle = '#f5c9e4'; g.fillRect(418, 34, 54, 56);
    g.fillStyle = '#e9447f'; g.font = '34px Verdana, Geneva, sans-serif'; g.textAlign = 'center'; g.fillText('\u2665', 445, 72);
  });
}
