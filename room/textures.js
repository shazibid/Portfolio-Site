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

export function polaroidTexture(T, label) {
  return tex(T, 300, 360, (g) => {
    g.fillStyle = '#fffdf8'; g.fillRect(0, 0, 300, 360);
    g.fillStyle = '#ddd8ea'; g.fillRect(20, 20, 260, 250);
    g.strokeStyle = '#c6c0d8'; g.lineWidth = 8;
    for (let i = -260; i < 300; i += 22) { g.beginPath(); g.moveTo(20 + i, 270); g.lineTo(20 + i + 250, 20); g.stroke(); }
    g.fillStyle = '#5a5578'; g.font = '19px monospace';
    g.fillText(label, 24, 320);
  });
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
