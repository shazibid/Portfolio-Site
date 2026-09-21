// Builds the static (non-interactive) room: renderer, lights, materials,
// furniture, the four zone props (rack/corkboard/desk/mail tray), the cat,
// and the butterfly. Returns every reference room/controller.js needs to
// make it interactive and animate it — this module only decides what the
// room is made of and where things sit; controller.js decides how it behaves.
import { projects } from '../content/projects.js';
import {
  coverTexture, discTexture, paperTexture, cardTexture,
  polaroidTexture, posterTexture, windowTexture, wingTexture
} from './textures.js';

export function buildScene(T, host) {
  const W = host.clientWidth || 900, H = host.clientHeight || 620;

  const renderer = new T.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.outputEncoding = T.sRGBEncoding;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  const el = renderer.domElement;
  el.style.cssText = 'display:block;width:100%;height:100%;cursor:default;touch-action:none';

  const scene = new T.Scene();
  scene.background = new T.Color(0xe7ddf2);
  const camera = new T.PerspectiveCamera(37, W / H, 0.1, 120);

  const amb = new T.AmbientLight(0xffffff, 0.46); scene.add(amb);
  const hemi = new T.HemisphereLight(0xe4ddfb, 0xe3c39a, 0.62); scene.add(hemi);
  const sun = new T.DirectionalLight(0xfff6e6, 1.75);
  sun.position.set(-5.5, 7, 3); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -12; sun.shadow.camera.right = 12;
  sun.shadow.camera.top = 12; sun.shadow.camera.bottom = -12;
  scene.add(sun);
  const lampLight = new T.PointLight(0xffd6a0, 1.4, 9, 2);
  lampLight.position.set(4.3, 3.0, -2.3); scene.add(lampLight);

  const mat = (o) => new T.MeshStandardMaterial(o);
  const wallMat = mat({ color: 0xefe6f7, roughness: 0.92 }); wallMat.name = 'wall';
  const floorMat = mat({ color: 0xe9c79a, roughness: 0.8 }); floorMat.name = 'floor';
  const woodMat = mat({ color: 0xdba86a, roughness: 0.6 }); woodMat.name = 'wood';
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
  const lapLid = new T.Mesh(new T.BoxGeometry(1.7, 1.12, 0.06), chromeMat);
  lapLid.name = 'laptopLid'; lapLid.position.set(0, 0.54, -0.56); lapLid.rotation.x = -0.18; lapLid.castShadow = true; lap.add(lapLid);
  const lapScreen = new T.Mesh(new T.PlaneGeometry(1.5, 0.95), new T.MeshBasicMaterial({ color: 0x9fd8de }));
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
  bulb.name = 'lampBulb'; bulb.position.y = 1.37; lamp.add(bulb);
  const pool = new T.SpotLight(0xffd6a0, 0, 8, 0.72, 0.7, 1.6);
  pool.name = 'lampPool';
  pool.position.set(4.3, 3.05, -2.3);
  pool.target.position.set(3.4, 1.7, -2.1);
  scene.add(pool); scene.add(pool.target);

  // cd player
  const player = new T.Group(); player.name = 'cdPlayer'; player.position.set(2.7, 1.68, -2.3); player.rotation.y = -0.12; room.add(player);
  const pBody = new T.Mesh(new T.BoxGeometry(1.7, 0.34, 1.5), plasticMat);
  pBody.name = 'playerBody'; pBody.position.y = 0.17; pBody.castShadow = true; player.add(pBody);
  const pTray = new T.Mesh(new T.CylinderGeometry(0.62, 0.62, 0.03, 40), mat({ color: 0xdedcd6, roughness: 0.6 }));
  pTray.name = 'playerTray'; pTray.position.set(-0.08, 0.345, 0); player.add(pTray);
  const disc = new T.Mesh(new T.CircleGeometry(0.58, 48), new T.MeshStandardMaterial({ map: discTexture(T), metalness: 0.75, roughness: 0.18, side: T.DoubleSide }));
  disc.name = 'disc'; disc.rotation.x = -Math.PI / 2; disc.position.set(-0.08, 0.37, 0); disc.visible = false; player.add(disc);
  const discHole = new T.Mesh(new T.CircleGeometry(0.1, 24), new T.MeshBasicMaterial({ color: 0xdedcd6 }));
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
  [['me @ ucsd', -1.15, 0.5, -0.1], ['san diego', 0.1, 0.62, 0.07], ['the desk', 1.25, 0.42, -0.05], ['hi :)', -0.5, -0.65, 0.12]].forEach((p, i) => {
    const pol = new T.Mesh(new T.PlaneGeometry(0.92, 1.1), new T.MeshStandardMaterial({ map: polaroidTexture(T, p[0]), roughness: 0.8 }));
    pol.name = 'polaroid' + i;
    pol.position.set(p[1], p[2], 0.06);
    pol.rotation.z = p[3];
    cork.add(pol);
  });
  const note = new T.Mesh(new T.PlaneGeometry(1.0, 0.8), new T.MeshStandardMaterial({ map: cardTexture(T, 'about', 'creative × techy', '#ffe9a8', '#5a4406'), roughness: 0.85 }));
  note.name = 'aboutNote'; note.position.set(1.15, -0.72, 0.06); note.rotation.z = -0.08; cork.add(note);

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

  // cat loaf on the windowsill
  const cat = new T.Group(); cat.name = 'cat'; cat.position.set(-2.55, 2.12, -3.78); cat.rotation.y = 2.45; cat.scale.setScalar(0.8); room.add(cat);
  const catMat = mat({ color: 0x4a4550, roughness: 0.9 }); catMat.name = 'catFur';
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
  cases.forEach((c) => pickables.push(c.children[0]));
  const zoneTargets = [
    { mesh: board, zone: 'about', group: cork },
    { mesh: sheet, zone: 'resume', group: papers },
    { mesh: env1, zone: 'contact', group: mail },
    { mesh: plinth, zone: 'rack', group: rack }
  ];
  rackBack.userData = { zone: 'rack', index: -1 };
  pickables.push(rackBack, bfHit, catHit);
  zoneTargets.forEach((z) => { z.mesh.userData = { zone: z.zone, index: -1 }; pickables.push(z.mesh); });
  const zoneLift = { about: 0, resume: 0, contact: 0, rack: 0 };

  // named camera shots the controller lerps toward per zone
  const CAM = {
    wide: { pos: new T.Vector3(0.3, 3.9, 14.2), look: new T.Vector3(0.2, 2.2, -1.8) },
    work: { pos: new T.Vector3(3.6, 3.5, 4.6), look: new T.Vector3(2.7, 1.95, -2.3) },
    rack: { pos: new T.Vector3(-3.8, 2.75, 5.0), look: new T.Vector3(-4.3, 1.75, -1.2) },
    about: { pos: new T.Vector3(3.3, 3.9, 1.6), look: new T.Vector3(3.3, 3.9, -4.1) },
    resume: { pos: new T.Vector3(-0.7, 3.1, 0.5), look: new T.Vector3(-0.9, 1.7, -1.9) },
    contact: { pos: new T.Vector3(4.6, 2.9, 0.9), look: new T.Vector3(4.15, 1.75, -1.6) }
  };

  const ro = new ResizeObserver(() => {
    const cw = host.clientWidth || W, ch = host.clientHeight || H;
    if (!cw || !ch) return;
    renderer.setSize(cw, ch);
    camera.aspect = cw / ch; camera.updateProjectionMatrix();
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
    meshes: { pane, bulb, lapScreen },
    textures: { dayTex, nightTex },
    disc, discHole,
    cat, catHit,
    bf, bfPos, bfTarget, bfLand, wings, bfHit,
    cases, pickables, zoneTargets, zoneLift, rackBack,
    CAM
  };
}
