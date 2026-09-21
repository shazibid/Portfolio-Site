// The laptop screen: a canvas texture drawn like a tiny desktop window with
// tabs, plus hit-testing so the controller can turn a click on the screen's
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

    // list
    tabs[active].items.forEach((it, i) => {
      const y = 132 + i * 60;
      g.fillStyle = i % 2 ? '#fff' : '#f7f2fb'; g.fillRect(28, y, W - 56, 52);
      g.fillStyle = '#e9447f'; g.font = '30px VT323, monospace'; g.fillText('♥', 42, y + 27);
      g.fillStyle = '#2a2740'; g.font = '20px Silkscreen, monospace'; g.fillText(it[0], 84, y + 17);
      g.fillStyle = '#6d6a85'; g.font = '24px VT323, monospace'; g.fillText(it[1], 84, y + 39);
    });
    texture.needsUpdate = true;
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
    click(uv) { const i = tabAt(uv); if (i >= 0 && i !== active) { active = i; draw(); } return i >= 0; }
  };
}
