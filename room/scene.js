// Builds the static (non-interactive) room: renderer, lights, materials,
// furniture, the four zone props (rack/corkboard/desk/mail tray), the cat,
// and the butterfly. Returns every reference room/controller.js needs to
// make it interactive and animate it — this module only decides what the
// room is made of and where things sit; controller.js decides how it behaves.
import { projects } from '../content/projects.js';
import { tracks } from '../content/tracks.js';
import { buildCorkboard } from './corkboard.js';
import { createScreen } from './screen.js';
import {
  coverTexture, discTexture, discArtTexture, vinylTexture, paperTexture, cardTexture,
  keyboardTexture, labelTexture, posterTexture, windowTexture, wingTexture
} from './textures.js';

export function buildScene(T, host) {
  const W = host.clientWidth || 900, H = host.clientHeight || 620;

  // touch devices start at 1.5x (a 3x phone screen would otherwise draw 4x the pixels for little
  // visible gain); the controller lowers it further if frames run slow
  const coarse = matchMedia('(pointer: coarse)').matches;
  const renderer = new T.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, coarse ? 1.5 : 2));
  renderer.setSize(W, H);
  renderer.outputEncoding = T.sRGBEncoding;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.86;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = !coarse; // on touch devices the controller redraws shadows every other frame
  const el = renderer.domElement;
  el.style.cssText = 'display:block;width:100%;height:100%;cursor:default;touch-action:none';

  const scene = new T.Scene();
  scene.background = new T.Color(0xd3c7e3);
  const camera = new T.PerspectiveCamera(37, W / H, 0.1, 120);

  const amb = new T.AmbientLight(0xffffff, 0.3); scene.add(amb);
  const hemi = new T.HemisphereLight(0xe4ddfb, 0xe3c39a, 0.4); scene.add(hemi);
  const sun = new T.DirectionalLight(0xfff6e6, 1.75);
  sun.position.set(-5.5, 7, 3); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -12; sun.shadow.camera.right = 12;
  sun.shadow.camera.top = 12; sun.shadow.camera.bottom = -12;
  scene.add(sun);
  const lampLight = new T.PointLight(0xffc27a, 1.4, 9, 2);
  lampLight.position.set(4.3, 3.3, -2.3); scene.add(lampLight);
  // at night the lamp is the only real light, so it casts the shadows (turned on in setMode)
  lampLight.shadow.mapSize.set(1024, 1024); lampLight.shadow.bias = -0.002; lampLight.shadow.radius = 4;

  const mat = (o) => new T.MeshStandardMaterial(o);
  const wallMat = mat({ color: 0xdccfeb, roughness: 0.92 }); wallMat.name = 'wall';
  const floorMat = mat({ color: 0xd6b083, roughness: 0.8 }); floorMat.name = 'floor';
  const woodMat = mat({ color: 0xcf9a5c, roughness: 0.6 }); woodMat.name = 'wood';
  const darkMat = mat({ color: 0x2f2c3d, roughness: 0.5 }); darkMat.name = 'dark';
  const chromeMat = mat({ color: 0xdcdce1, metalness: 0.9, roughness: 0.22 }); chromeMat.name = 'chrome';
  const plasticMat = mat({ color: 0xf1f0ec, roughness: 0.42 }); plasticMat.name = 'plastic';
  const corkMat = mat({ color: 0xd19a56, roughness: 0.9 }); corkMat.name = 'cork';

  const room = new T.Group(); room.name = 'room'; scene.add(room);

  const floor = new T.Mesh(new T.PlaneGeometry(22, 16), floorMat);
  floor.name = 'floor'; floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; room.add(floor);
  const back = new T.Mesh(new T.PlaneGeometry(22, 10), wallMat);
  back.name = 'backWall'; back.position.set(0, 5, -4.2); back.receiveShadow = true; room.add(back);
  const leftW = new T.Mesh(new T.PlaneGeometry(16, 10), wallMat);
  leftW.name = 'leftWall'; leftW.position.set(-8.5, 5, 3.8); leftW.rotation.y = Math.PI / 2;
  leftW.receiveShadow = true; room.add(leftW);

  // window
  const dayTex = windowTexture(T, false), nightTex = windowTexture(T, true);
  const win = new T.Group(); win.name = 'window'; win.position.set(-3.6, 3.7, -4.15); room.add(win);
  const pane = new T.Mesh(new T.PlaneGeometry(3.6, 2.8), new T.MeshBasicMaterial({ map: dayTex }));
  pane.name = 'windowPane'; win.add(pane);
  const frameMat = mat({ color: 0xffffff, roughness: 0.5 }); frameMat.name = 'windowFrame';
  [[0, 1.52, 4.0, 0.2], [0, -1.52, 4.0, 0.2], [0, 0, 4.0, 0.08]].forEach((b, i) => {
    const m = new T.Mesh(new T.BoxGeometry(b[2], b[3], 0.14), frameMat);
    m.name = 'winBarH' + i; m.position.set(b[0], b[1], 0.05); win.add(m);
  });
  [[-1.9], [1.9], [0]].forEach((b, i) => {
    const m = new T.Mesh(new T.BoxGeometry(0.17, 3.2, 0.14), frameMat);
    m.name = 'winBarV' + i; m.position.set(b[0], 0, 0.05); win.add(m);
  });
  const sill = new T.Mesh(new T.BoxGeometry(4.4, 0.16, 0.66), frameMat);
  sill.name = 'windowSill'; sill.position.set(0, -1.66, 0.3); sill.castShadow = true; win.add(sill);

  // desk
  const top = new T.Mesh(new T.BoxGeometry(6.6, 0.16, 2.5), woodMat);
  top.name = 'deskTop'; top.position.set(1.7, 1.6, -2.4); top.castShadow = true; top.receiveShadow = true; room.add(top);
  [[-1.25, -1.3], [-1.25, -3.5], [4.65, -1.3], [4.65, -3.5]].forEach((p, i) => {
    const l = new T.Mesh(new T.BoxGeometry(0.14, 1.6, 0.14), chromeMat);
    l.name = 'deskLeg' + i; l.position.set(p[0], 0.8, p[1]); l.castShadow = true; room.add(l);
  });

  // laptop
  const lap = new T.Group(); lap.name = 'laptop'; lap.position.set(0.7, 1.68, -2.3); lap.rotation.y = 0.3; room.add(lap);
  const lapBase = new T.Mesh(new T.BoxGeometry(1.7, 0.07, 1.15), chromeMat);
  lapBase.name = 'laptopBase'; lapBase.castShadow = true; lap.add(lapBase);
  const lapKeys = new T.Mesh(new T.PlaneGeometry(1.5, 0.95), new T.MeshStandardMaterial({ map: keyboardTexture(T), transparent: true, roughness: 0.55 }));
  lapKeys.name = 'laptopKeyboard'; lapKeys.rotation.x = -Math.PI / 2; lapKeys.position.set(0, 0.037, 0.02); lapKeys.scale.set(1, 0.9, 1); lap.add(lapKeys);
  const lapLid = new T.Mesh(new T.BoxGeometry(1.7, 1.12, 0.06), chromeMat);
  lapLid.name = 'laptopLid'; lapLid.position.set(0, 0.54, -0.56); lapLid.rotation.x = -0.18; lapLid.castShadow = true; lap.add(lapLid);
  const screenUI = createScreen(T);
  const lapScreen = new T.Mesh(new T.PlaneGeometry(1.5, 0.95), new T.MeshBasicMaterial({ map: screenUI.texture }));
  lapScreen.name = 'laptopScreen'; lapScreen.position.set(0, 0.54, -0.52); lapScreen.rotation.x = -0.18; lap.add(lapScreen);

  // lamp
  const lamp = new T.Group(); lamp.name = 'lamp'; lamp.position.set(4.3, 1.68, -2.3); room.add(lamp);
  const lampBase = new T.Mesh(new T.CylinderGeometry(0.34, 0.4, 0.09, 28), darkMat);
  lampBase.name = 'lampBase'; lampBase.castShadow = true; lamp.add(lampBase);
  const stem = new T.Mesh(new T.CylinderGeometry(0.045, 0.045, 1.5, 16), darkMat);
  stem.name = 'lampStem'; stem.position.y = 0.78; lamp.add(stem);
  const shadeMat = mat({ color: 0xffe9c8, roughness: 0.6, side: T.DoubleSide, emissive: 0xffd9a0, emissiveIntensity: 0 });
  shadeMat.name = 'lampShadeMat';
  const shade = new T.Mesh(new T.ConeGeometry(0.54, 0.52, 28, 1, true), shadeMat);
  shade.name = 'lampShade'; shade.position.y = 1.62; lamp.add(shade);
  const bulb = new T.Mesh(new T.SphereGeometry(0.13, 16, 12), new T.MeshBasicMaterial({ color: 0xfff0d2 }));
  bulb.name = 'lampBulb'; bulb.position.y = 1.62; lamp.add(bulb);
  // soft additive halo around the lit shade (faded in at night) so the lamp itself reads as the source
  const glowCanvas = document.createElement('canvas'); glowCanvas.width = glowCanvas.height = 128;
  const gg = glowCanvas.getContext('2d');
  const gr = gg.createRadialGradient(64, 64, 4, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,214,150,0.9)'); gr.addColorStop(0.35, 'rgba(255,190,110,0.35)'); gr.addColorStop(1, 'rgba(255,170,90,0)');
  gg.fillStyle = gr; gg.fillRect(0, 0, 128, 128);
  const glow = new T.Sprite(new T.SpriteMaterial({ map: new T.CanvasTexture(glowCanvas), blending: T.AdditiveBlending, transparent: true, opacity: 0, depthWrite: false }));
  glow.name = 'lampGlow'; glow.scale.set(2.6, 2.6, 1); glow.position.set(0, 1.55, 0.05); lamp.add(glow);
  const pool = new T.SpotLight(0xffd6a0, 0, 8, 0.72, 0.7, 1.6);
  pool.name = 'lampPool';
  pool.position.set(4.3, 3.3, -2.3);
  pool.target.position.set(3.4, 1.7, -2.1);
  scene.add(pool); scene.add(pool.target);

  // record player
  const player = new T.Group(); player.name = 'cdPlayer'; player.position.set(2.7, 1.68, -2.3); player.rotation.y = -0.12; room.add(player);
  const pBody = new T.Mesh(new T.BoxGeometry(1.7, 0.34, 1.5), mat({ color: 0xd9435f, roughness: 0.38 }));
  pBody.name = 'playerBody'; pBody.position.y = 0.17; pBody.castShadow = true; player.add(pBody);
  const pTray = new T.Mesh(new T.CylinderGeometry(0.62, 0.62, 0.03, 40), mat({ color: 0x3a3648, roughness: 0.5 }));
  pTray.name = 'playerTray'; pTray.position.set(-0.08, 0.345, 0); player.add(pTray);
  // details: feet, knobs, tonearm, status light, and a front display that shows the current disc
  [[-0.72, -0.6], [0.72, -0.6], [-0.72, 0.6], [0.72, 0.6]].forEach((f, i) => {
    const foot = new T.Mesh(new T.CylinderGeometry(0.07, 0.07, 0.05, 14), darkMat);
    foot.name = 'playerFoot' + i; foot.position.set(f[0], -0.02, f[1]); player.add(foot);
  });
  [0.32, 0.02].forEach((z, i) => {
    const knob = new T.Mesh(new T.CylinderGeometry(0.07, 0.075, 0.06, 20), chromeMat);
    knob.name = 'playerKnob' + i; knob.position.set(0.7, 0.37, z); player.add(knob);
    const tick = new T.Mesh(new T.BoxGeometry(0.012, 0.012, 0.06), darkMat);
    tick.name = 'playerKnobTick' + i; tick.position.set(0.7, 0.405, z - 0.02); player.add(tick);
  });
  const led = new T.Mesh(new T.SphereGeometry(0.028, 12, 8), new T.MeshBasicMaterial({ color: 0xf5c9e4 }));
  led.name = 'playerLed'; led.position.set(0.7, 0.345, -0.32); player.add(led);
  const armBase = new T.Mesh(new T.CylinderGeometry(0.075, 0.085, 0.05, 20), darkMat);
  armBase.name = 'tonearmBase'; armBase.position.set(0.68, 0.365, -0.55); player.add(armBase);
  const arm = new T.Mesh(new T.BoxGeometry(0.03, 0.025, 0.84), chromeMat);
  arm.name = 'tonearm'; arm.castShadow = true; player.add(arm);
  const headshell = new T.Mesh(new T.BoxGeometry(0.09, 0.03, 0.12), darkMat);
  headshell.name = 'tonearmHead'; player.add(headshell);
  // swing the arm about its pivot: the stylus lands on the grooves (outside the label) when a record is on, else it rests off the platter
  const setTonearm = (playing) => {
    const a = playing ? -0.4 : -0.1, s = Math.sin(a), c = Math.cos(a);
    arm.position.set(0.68 + s * 0.42, 0.42, -0.55 + c * 0.42);
    headshell.position.set(0.68 + s * 0.84, 0.42, -0.55 + c * 0.84);
    arm.rotation.y = headshell.rotation.y = a;
  };
  setTonearm(false);

  const dispCanvas = document.createElement('canvas'); dispCanvas.width = 320; dispCanvas.height = 96;
  const dispTex = new T.CanvasTexture(dispCanvas); dispTex.encoding = T.sRGBEncoding;
  const setPlayerDisplay = (index) => {
    const g = dispCanvas.getContext('2d');
    g.fillStyle = '#2a2740'; g.fillRect(0, 0, 320, 96);
    g.fillStyle = '#f5c9e4'; g.textBaseline = 'middle';
    const t = tracks[index];
    g.font = '400 24px Silkscreen, monospace';
    g.fillText(t ? 'DISC 0' + (index + 1) + ' / 0' + tracks.length : index === -2 ? 'LOFI LOOP' : 'NO DISC', 16, 28);
    g.fillStyle = '#ffffff';
    g.font = '400 20px VT323, monospace';
    let title = t ? t.title : index === -2 ? "shazi's room" : 'pick a disc';
    while (g.measureText(title).width > 288 && title.length > 3) title = title.slice(0, -2);
    g.fillText(title + (t && title !== t.title ? '…' : ''), 16, 68);
    dispTex.needsUpdate = true;
  };
  setPlayerDisplay(-1);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => setPlayerDisplay(-1));
  const display = new T.Mesh(new T.PlaneGeometry(0.78, 0.235), new T.MeshBasicMaterial({ map: dispTex }));
  display.name = 'playerDisplay'; display.position.set(0.0, 0.17, 0.752); player.add(display);
  [-0.68, -0.56, -0.44].forEach((x, i) => {
    const b = new T.Mesh(new T.BoxGeometry(0.075, 0.075, 0.025), i === 0 ? chromeMat : mat({ color: 0xf5c9e4, roughness: 0.4 }));
    b.name = 'playerButton' + i; b.position.set(x - 0.05, 0.17, 0.758); player.add(b);
  });

  const disc = new T.Mesh(new T.CircleGeometry(0.58, 48), new T.MeshStandardMaterial({ map: discTexture(T), metalness: 0.1, roughness: 0.4, side: T.DoubleSide }));
  const vinylTex = vinylTexture(T);
  const discArt = tracks.map((tr) => discArtTexture(T, tr.art));
  disc.name = 'disc'; disc.rotation.x = -Math.PI / 2; disc.position.set(-0.08, 0.37, 0); disc.visible = false; player.add(disc);
  const discHole = new T.Mesh(new T.CircleGeometry(0.035, 16), new T.MeshBasicMaterial({ color: 0xdedcd6 }));
  discHole.name = 'discHole'; discHole.rotation.x = -Math.PI / 2; discHole.position.set(-0.08, 0.375, 0); discHole.visible = false; player.add(discHole);

  // ZONE: resume papers on desk
  const papers = new T.Group(); papers.name = 'zoneResume'; papers.position.set(-0.9, 1.7, -1.85); papers.rotation.y = 0.22; room.add(papers);
  const sheet = new T.Mesh(new T.BoxGeometry(1.15, 0.012, 1.5), new T.MeshStandardMaterial({ map: paperTexture(T), roughness: 0.85 }));
  sheet.name = 'resumeSheet'; sheet.castShadow = true; papers.add(sheet);
  const sheet2 = new T.Mesh(new T.BoxGeometry(1.15, 0.01, 1.5), mat({ color: 0xfffdf8, roughness: 0.9 }));
  sheet2.name = 'resumeSheetUnder'; sheet2.position.set(0.05, -0.014, 0.04); sheet2.rotation.y = 0.06; papers.add(sheet2);

  // ZONE: mail tray (contact)
  const mail = new T.Group(); mail.name = 'zoneContact'; mail.position.set(4.15, 1.72, -1.55); mail.rotation.y = -0.3; room.add(mail);
  const tray = new T.Mesh(new T.BoxGeometry(1.15, 0.1, 0.85), darkMat);
  tray.name = 'mailTray'; tray.castShadow = true; mail.add(tray);
  const env1 = new T.Mesh(new T.BoxGeometry(1.0, 0.06, 0.7), new T.MeshStandardMaterial({ map: cardTexture(T, 'say hi', 'shazi.bid23@gmail.com', '#ffffff', '#b5257c'), roughness: 0.8 }));
  env1.name = 'envelopeTop'; env1.position.set(0, 0.1, 0); env1.rotation.y = 0.1; mail.add(env1);
  const env2 = new T.Mesh(new T.BoxGeometry(1.0, 0.05, 0.7), mat({ color: 0xf6e7ef, roughness: 0.85 }));
  env2.name = 'envelopeUnder'; env2.position.set(-0.04, 0.05, 0.03); env2.rotation.y = -0.08; mail.add(env2);

  // ZONE: corkboard (about)
  const cork = new T.Group(); cork.name = 'zoneAbout'; cork.position.set(3.3, 4.0, -4.1); room.add(cork);
  const board = new T.Mesh(new T.BoxGeometry(3.8, 2.6, 0.1), corkMat);
  board.name = 'corkBoard'; cork.add(board);
  const boardEdge = new T.Mesh(new T.BoxGeometry(4.0, 2.8, 0.06), darkMat);
  boardEdge.name = 'corkFrame'; boardEdge.position.z = -0.04; cork.add(boardEdge);
  buildCorkboard(T, cork, { woodMat });
  // kept on the left so the lamp and its butterfly (right side) never cover it
  const note = new T.Mesh(new T.PlaneGeometry(0.62, 0.5), new T.MeshStandardMaterial({ map: cardTexture(T, 'about', 'creative × techy', '#ffe9a8', '#5a4406'), roughness: 0.85 }));
  note.name = 'aboutNote'; note.position.set(-1.5, -0.88, 0.2); note.rotation.z = -0.08; cork.add(note);

  // posters
  [['ucsd', 'cs · 2027', '#2a2740', '#f5c9e4', 6.9, 4.2], ['swift', 'enjoyer', '#e9447f', '#ffffff', 8.5, 3.6]].forEach((p, i) => {
    const po = new T.Mesh(new T.PlaneGeometry(1.5, 2.1), new T.MeshStandardMaterial({ map: posterTexture(T, p[0], p[1], p[2], p[3]), roughness: 0.85 }));
    po.name = 'poster' + i;
    po.position.set(p[4], p[5], -4.12);
    room.add(po);
  });

  // plant
  const plant = new T.Group(); plant.name = 'plant'; plant.position.set(6.6, 0, -2.6); room.add(plant);
  const pot = new T.Mesh(new T.CylinderGeometry(0.42, 0.32, 0.6, 24), mat({ color: 0xc98b6b, roughness: 0.8 }));
  pot.name = 'pot'; pot.position.y = 0.3; pot.castShadow = true; plant.add(pot);
  [[0, 1.15, 0.5], [0.22, 0.95, 0.38], [-0.2, 1.0, 0.34]].forEach((b, i) => {
    const leaf = new T.Mesh(new T.SphereGeometry(b[2], 16, 12), mat({ color: 0x5c7f5a, roughness: 0.75 }));
    leaf.name = 'leaf' + i;
    leaf.position.set(b[0], b[1], i === 2 ? 0.16 : -0.1);
    leaf.scale.set(1, 1.35, 0.8);
    leaf.castShadow = true;
    plant.add(leaf);
  });

  // cd rack (work zone) — one case per entry in content/projects.js
  const rack = new T.Group(); rack.name = 'cdRack'; rack.position.set(-4.4, 0, -1.2); rack.rotation.y = 0.24; room.add(rack);
  const plinth = new T.Mesh(new T.BoxGeometry(3.1, 0.9, 1.5), woodMat);
  plinth.name = 'rackPlinth'; plinth.position.y = 0.45; plinth.castShadow = true; plinth.receiveShadow = true; rack.add(plinth);
  const rackLabel = new T.Mesh(new T.PlaneGeometry(2.9, 0.48), new T.MeshStandardMaterial({ map: labelTexture(T, 'experience + current favorite tunes', '#4a3a26'), transparent: true, roughness: 0.6 }));
  // lit and shadowed like the wood it's painted on, so the ink keeps the same contrast in day and night
  rackLabel.name = 'rackLabel'; rackLabel.position.set(0, 0.45, 0.752); rackLabel.receiveShadow = true; rack.add(rackLabel);
  const rackBack = new T.Mesh(new T.BoxGeometry(3.1, 1.5, 0.12), woodMat);
  rackBack.name = 'rackBack'; rackBack.position.set(0, 1.55, -0.68); rackBack.castShadow = true; rack.add(rackBack);

  const cases = [];
  projects.forEach((cd, i) => {
    const g = new T.Group(); g.name = 'case' + i;
    const box = new T.Mesh(new T.BoxGeometry(1.25, 1.25, 0.09), [
      chromeMat, chromeMat, chromeMat, chromeMat,
      new T.MeshStandardMaterial({ map: coverTexture(T, cd, i), roughness: 0.34 }),
      mat({ color: 0xe9e7e2, roughness: 0.5 })
    ]);
    box.name = 'caseBody' + i; box.castShadow = true; g.add(box);
    g.position.set(-1.02 + i * 0.5, 1.52, 0.12 - i * 0.03);
    g.rotation.x = -0.14;
    g.userData = { zone: 'work', index: i, baseY: 1.52, baseRotX: -0.14, lift: 0, target: 0 };
    cases.push(g); rack.add(g);
  });

  // hover picking tests these invisible stand-ins, not the cases: the stand-ins follow each
  // case's resting position but never its hover lift, so lifting a case can't move it out
  // from under the cursor and flip the hover back and forth at its edges
  const caseHits = cases.map((c, i) => {
    const h = new T.Mesh(new T.BoxGeometry(1.25, 1.25, 0.09), new T.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
    h.name = 'caseHit' + i; h.userData = { zone: 'work', index: i };
    rack.add(h);
    return h;
  });

  // cat loaf on the windowsill
  const cat = new T.Group(); cat.name = 'cat'; cat.position.set(-2.55, 2.12, -3.78); cat.rotation.y = 2.45; cat.scale.setScalar(0.8); room.add(cat);
  const catMat = mat({ color: 0xd9722a, roughness: 0.9 }); catMat.name = 'catFur';
  const catBody = new T.Mesh(new T.SphereGeometry(0.34, 20, 16), catMat);
  catBody.name = 'catBody'; catBody.scale.set(1.35, 0.78, 1); catBody.position.y = 0.26; catBody.castShadow = true; cat.add(catBody);
  const catHead = new T.Mesh(new T.SphereGeometry(0.2, 18, 14), catMat);
  catHead.name = 'catHead'; catHead.position.set(0.4, 0.34, 0); catHead.castShadow = true; cat.add(catHead);
  [[-0.08], [0.08]].forEach((e, i) => {
    const ear = new T.Mesh(new T.ConeGeometry(0.08, 0.15, 10), catMat);
    ear.name = 'catEar' + i; ear.position.set(0.38, 0.5, e[0]); cat.add(ear);
  });
  const catHit = new T.Mesh(new T.SphereGeometry(0.52, 10, 8), new T.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
  catHit.name = 'catHit'; catHit.userData = { zone: 'cat', index: -1 }; catHit.position.set(0.1, 0.3, 0); cat.add(catHit);
  const tail = new T.Mesh(new T.TorusGeometry(0.2, 0.045, 8, 20, Math.PI * 1.3), catMat);
  tail.name = 'catTail'; tail.position.set(-0.42, 0.22, 0.1); tail.rotation.set(Math.PI / 2, 0, 0.6); cat.add(tail);

  // 3d butterfly — wanders the room, lands on the lamp
  const bf = new T.Group(); bf.name = 'butterfly';
  const bfBodyMat = mat({ color: 0x2f2c3d, roughness: 0.55 }); bfBodyMat.name = 'butterflyBody';
  const bfBody = new T.Mesh(new T.CapsuleGeometry(0.022, 0.12, 6, 10), bfBodyMat);
  bfBody.name = 'butterflyAbdomen'; bfBody.rotation.x = Math.PI / 2; bf.add(bfBody);
  const bfHead = new T.Mesh(new T.SphereGeometry(0.028, 12, 10), bfBodyMat);
  bfHead.name = 'butterflyHead'; bfHead.position.z = 0.094; bf.add(bfHead);
  [[-0.022], [0.022]].forEach((a, i) => {
    const ant = new T.Mesh(new T.CylinderGeometry(0.0035, 0.0035, 0.09, 6), bfBodyMat);
    ant.name = 'butterflyAntenna' + i;
    ant.position.set(a[0] * 0.7, 0.03, 0.14);
    ant.rotation.set(1.15, 0, a[0] > 0 ? -0.22 : 0.22);
    bf.add(ant);
  });
  const wingMat = new T.MeshStandardMaterial({
    map: wingTexture(T), transparent: true, alphaTest: 0.42,
    side: T.DoubleSide, roughness: 0.46, metalness: 0.05
  });
  wingMat.name = 'butterflyWing';
  const wings = [];
  [1, -1].forEach((sx, i) => {
    const pivot = new T.Group(); pivot.name = 'wingPivot' + i;
    const w = new T.Mesh(new T.PlaneGeometry(0.3, 0.52), wingMat);
    w.name = 'wing' + i;
    w.rotation.x = -Math.PI / 2;
    w.position.set(sx * 0.15, 0, -0.035);
    w.scale.x = sx;
    pivot.add(w);
    wings.push({ pivot: pivot, sx: sx });
    bf.add(pivot);
  });
  const bfHit = new T.Mesh(new T.SphereGeometry(0.3, 10, 8), new T.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
  bfHit.name = 'butterflyHit'; bfHit.userData = { zone: 'butterfly', index: -1 }; bf.add(bfHit);
  bf.position.set(-1.2, 3.0, -1.0);
  room.add(bf);
  const bfPos = bf.position.clone();
  const bfTarget = new T.Vector3();
  const bfLand = new T.Vector3(4.3, 3.62, -2.3);

  const pickables = [];
  caseHits.forEach((h) => pickables.push(h));
  const zoneTargets = [
    { mesh: board, zone: 'about', group: cork },
    { mesh: sheet, zone: 'resume', group: papers },
    { mesh: env1, zone: 'contact', group: mail },
    { mesh: plinth, zone: 'rack', group: rack },
    { mesh: lapScreen, zone: 'computer', group: lap }
  ];
  lapLid.userData = { zone: 'computer', index: -1 };
  lapBase.userData = { zone: 'computer', index: -1 };
  pickables.push(lapLid, lapBase);
  rackBack.userData = { zone: 'rack', index: -1 };
  pickables.push(rackBack, bfHit, catHit);
  zoneTargets.forEach((z) => { z.mesh.userData = { zone: z.zone, index: -1 }; pickables.push(z.mesh); });
  const zoneLift = { about: 0, resume: 0, contact: 0, rack: 0, computer: 0 };

  // named camera shots the controller lerps toward per zone
  const CAM = {
    wide: { pos: new T.Vector3(0.3, 3.9, 14.2), look: new T.Vector3(0.2, 2.2, -1.8) },
    work: { pos: new T.Vector3(3.03, 6.35, 0.22), look: new T.Vector3(2.7, 1.95, -2.3) },
    rack: { pos: new T.Vector3(-3.8, 2.75, 5.0), look: new T.Vector3(-4.3, 1.75, -1.2) },
    // aimed straight at the board (x 3.3); the controller shifts it clear of the side panel
    about: { pos: new T.Vector3(3.3, 3.9, 2.1), look: new T.Vector3(3.3, 3.9, -4.1) },
    resume: { pos: new T.Vector3(-0.7, 3.1, 0.5), look: new T.Vector3(-0.9, 1.7, -1.9) },
    computer: { pos: new T.Vector3(1.17, 2.55, -0.79), look: new T.Vector3(0.55, 2.22, -2.8) },
    contact: { pos: new T.Vector3(4.6, 2.9, 0.9), look: new T.Vector3(4.15, 1.75, -1.6) }
  };

  const ro = new ResizeObserver(() => {
    const cw = host.clientWidth || W, ch = host.clientHeight || H;
    if (!cw || !ch) return;
    // resizing clears the canvas; redraw right away so the browser never paints
    // the blank buffer in the gap before the next animation frame
    renderer.setSize(cw, ch, false); // css size is already 100% via el.style
    camera.aspect = cw / ch; camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  });
  ro.observe(host);

  function disposeScene() {
    ro.disconnect();
    renderer.dispose();
  }

  return {
    renderer, el, scene, camera, disposeScene,
    lights: { amb, hemi, sun, lampLight, pool },
    materials: { wallMat, floorMat, woodMat, shadeMat },
    meshes: { pane, bulb, lapScreen, glow },
    screenUI,
    textures: { dayTex, nightTex },
    disc, discHole, discArt, vinylTex, setPlayerDisplay, setTonearm,
    cat, catHit,
    bf, bfPos, bfTarget, bfLand, wings, bfHit,
    cases, caseHits, pickables, zoneTargets, zoneLift, rackBack,
    // what each side-panel zone's close-up is framed on (the controller fits it beside the panel)
    zoneSubjects: { about: board, work: player, contact: mail },
    CAM
  };
}
