// Everything pinned to the corkboard: polaroids, album sleeves, PNG stickers, push pins,
// the 3d hanging vines and potted plant, and the piano trophy. Positions live in
// content/corkboard.js; this module only decides how each kind of thing is built.
import { photos } from '../content/photos.js';
import { photoSpots, albumSpots, stickerSpots, stripSpots, nycCard, vineSpots, pinColors } from '../content/corkboard.js';
import { polaroidTexture, plaqueTexture, nycCardTexture } from './textures.js';

export function buildCorkboard(T, cork, { woodMat }) {
  let layer = 0;
  const nextZ = () => 0.06 + 0.004 * layer++;

  const shadowMat = new T.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2, depthWrite: false });
  const pinMats = pinColors.map((c) => new T.MeshStandardMaterial({ color: c, roughness: 0.35, metalness: 0.1 }));
  const pinNeedleMat = new T.MeshStandardMaterial({ color: 0xcfcfd6, metalness: 0.9, roughness: 0.3 });
  let pinCount = 0;

  // an item is a group so its shadow, pin and picture rotate together
  function place(group, x, y, rot, z) {
    group.position.set(x, y, z);
    group.rotation.z = rot;
    cork.add(group);
  }

  function addShadow(group, w, h) {
    const sh = new T.Mesh(new T.PlaneGeometry(w, h), shadowMat);
    sh.position.set(0.02, -0.025, -0.002);
    group.add(sh);
  }

  function addPin(group, y) {
    const pin = new T.Group();
    const head = new T.Mesh(new T.SphereGeometry(0.038, 14, 10), pinMats[pinCount++ % pinMats.length]);
    head.scale.set(1, 1, 0.6); head.position.z = 0.03; pin.add(head);
    const rim = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 0.012, 14), pinNeedleMat);
    rim.rotation.x = Math.PI / 2; rim.position.z = 0.008; pin.add(rim);
    pin.position.set(0, y, 0.004);
    group.add(pin);
  }

  // polaroids: hidden until their image actually loads, so missing files leave no blank cards
  photoSpots.forEach((spot, i) => {
    const info = photos.find((p) => p.file === spot.file);
    if (!info) return;
    const w = 0.92 * spot.s, h = 1.1 * spot.s;
    const g = new T.Group(); g.name = 'polaroid' + i; g.visible = false;
    addShadow(g, w, h);
    const card = new T.Mesh(
      new T.PlaneGeometry(w, h),
      new T.MeshStandardMaterial({
        map: polaroidTexture(T, '', `./assets/photos/${spot.file}`, () => { g.visible = true; }),
        roughness: 0.8
      })
    );
    g.add(card);
    addPin(g, h / 2 - 0.05);
    place(g, spot.x, spot.y, spot.rot, nextZ());
  });

  // album sleeves: covers dropped into assets/albums/ (separate from the rack's vinyl art)
  albumSpots.forEach((spot, i) => {
    const s = spot.size;
    new T.TextureLoader().load(`./assets/albums/${spot.file}`, (map) => {
      map.encoding = T.sRGBEncoding;
      const g = new T.Group(); g.name = 'album' + i;
      addShadow(g, s + 0.03, s + 0.03);
      g.add(new T.Mesh(new T.PlaneGeometry(s + 0.03, s + 0.03), new T.MeshStandardMaterial({ color: 0xfffdf8, roughness: 0.8 })));
      const cover = new T.Mesh(new T.PlaneGeometry(s, s), new T.MeshStandardMaterial({ map, roughness: 0.6 }));
      cover.position.z = 0.002; g.add(cover);
      addPin(g, s / 2 - 0.02);
      place(g, spot.x, spot.y, spot.rot, nextZ());
    }, undefined, () => {});
  });

  // nyc postcard: a goal
  {
    const w = nycCard.w, h = w * 0.625;
    const g = new T.Group(); g.name = 'nycCard';
    addShadow(g, w, h);
    g.add(new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshStandardMaterial({ map: nycCardTexture(T), roughness: 0.8 })));
    addPin(g, h / 2 - 0.04);
    place(g, nycCard.x, nycCard.y, nycCard.rot, nextZ());
  }

  // stickers: PNGs dropped into assets/stickers/. A missing file just leaves the slot empty.
  stickerSpots.forEach((spot, i) => {
    new T.TextureLoader().load(`./assets/stickers/${spot.file}`, (map) => {
      map.encoding = T.sRGBEncoding;
      const aspect = map.image.height / map.image.width;
      const m = new T.Mesh(
        new T.PlaneGeometry(spot.w, spot.w * aspect),
        new T.MeshStandardMaterial({ map, transparent: true, alphaTest: 0.02, roughness: 0.55 })
      );
      m.name = 'sticker' + i;
      place(m, spot.x, spot.y, spot.rot, nextZ() + 0.03);
    }, undefined, () => {});
  });

  // photobooth strips: a white sleeve around the image, pinned at the top
  stripSpots.forEach((spot, i) => {
    new T.TextureLoader().load(`./assets/photos/${spot.file}`, (map) => {
      map.encoding = T.sRGBEncoding;
      const w = spot.w, h = w * (map.image.height / map.image.width), b = 0.02;
      const g = new T.Group(); g.name = 'strip' + i;
      addShadow(g, w + b * 2, h + b * 2);
      g.add(new T.Mesh(new T.PlaneGeometry(w + b * 2, h + b * 2), new T.MeshStandardMaterial({ color: 0xfffdf8, roughness: 0.8 })));
      const img = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshStandardMaterial({ map, roughness: 0.7 }));
      img.position.z = 0.002; g.add(img);
      addPin(g, h / 2 - 0.03);
      place(g, spot.x, spot.y, spot.rot, nextZ());
    }, undefined, () => {});
  });

  // 3d leaves are flattened spheres (same trick as the room's plant), one shared material per green
  const leafMats = [0x4f8a5b, 0x5f9d67, 0x3f7a4f, 0x72ad72, 0x86bb7a]
    .map((c) => new T.MeshStandardMaterial({ color: c, roughness: 0.72, side: T.DoubleSide }));
  const leafGeo = new T.SphereGeometry(1, 12, 8);
  leafGeo.translate(0, -1, 0); // base at the origin, body hanging down from it
  const stemMat = new T.MeshStandardMaterial({ color: 0x3d6b45, roughness: 0.7 });
  const seeded = (seed) => { let r = seed * 9301 + 49297; return () => { r = (r * 16807) % 2147483647; return r / 2147483647; }; };

  function leaf(rnd, size) {
    const m = new T.Mesh(leafGeo, leafMats[Math.floor(rnd() * leafMats.length)]);
    m.scale.set(0.62 * size, size, 0.1 * size);
    m.castShadow = true;
    return m;
  }

  // hanging vines: a tube stem that sways in x and z, leaves alternating down both sides
  vineSpots.forEach((v, i) => {
    const rnd = seeded(v.seed);
    const vine = new T.Group(); vine.name = 'vine' + i;
    vine.position.set(v.x, 1.4, 0.2 + i * 0.002);
    const pts = [];
    for (let k = 0; k <= 12; k++) {
      const y = -v.len * (k / 12);
      pts.push(new T.Vector3(Math.sin(y * 6 + v.seed) * 0.05, y, Math.cos(y * 5 + v.seed) * 0.035));
    }
    const curve = new T.CatmullRomCurve3(pts);
    const stem = new T.Mesh(new T.TubeGeometry(curve, 28, 0.007, 6, false), stemMat);
    stem.castShadow = true; vine.add(stem);
    let side = rnd() < 0.5 ? 1 : -1;
    for (let t = 0.04; t < 0.97; t += 0.1 + rnd() * 0.05) {
      const p = curve.getPoint(t);
      const l = leaf(rnd, 0.1 * (1 - t * 0.35) * (0.85 + rnd() * 0.3));
      l.position.copy(p);
      l.rotation.set((rnd() - 0.5) * 0.9, side * rnd() * 0.7, side * (0.55 + rnd() * 0.5));
      vine.add(l);
      side = -side;
    }
    const tip = leaf(rnd, 0.08);
    tip.position.copy(curve.getPoint(1)); vine.add(tip);
    cork.add(vine);
  });

  // a potted plant on its own little ledge, top right
  const potLedge = new T.Mesh(new T.BoxGeometry(0.8, 0.05, 0.3), woodMat);
  potLedge.name = 'plantLedge'; potLedge.position.set(1.3, 1.425, 0.2); potLedge.castShadow = true; cork.add(potLedge);
  const potPlant = new T.Group(); potPlant.name = 'ledgePlant'; potPlant.position.set(1.3, 1.45, 0.2); cork.add(potPlant);
  const pot = new T.Mesh(new T.CylinderGeometry(0.11, 0.08, 0.16, 18), new T.MeshStandardMaterial({ color: 0xc98b6b, roughness: 0.8 }));
  pot.position.y = 0.08; pot.castShadow = true; potPlant.add(pot);
  const prnd = seeded(11);
  for (let k = 0; k < 9; k++) {
    const a = (k / 9) * Math.PI * 2;
    const l = leaf(prnd, 0.16 + prnd() * 0.05);
    l.geometry = leafGeo; // hangs down by default: flip it upright, then fan it out around the pot
    l.rotation.set(Math.PI - 0.5 - prnd() * 0.4, a, 0, 'YXZ');
    l.position.set(Math.cos(a) * 0.03, 0.16, Math.sin(a) * 0.03);
    potPlant.add(l);
  }
  [-1, 1].forEach((side) => {
    const l = leaf(prnd, 0.14);
    l.position.set(side * 0.1, 0.15, 0.06);
    l.rotation.set(0.3, side * 0.4, side * 1.0); // droops over the rim
    potPlant.add(l);
  });

  // piano trophy standing on a little ledge across the top of the frame
  const trophy = new T.Group(); trophy.name = 'pianoTrophy'; trophy.position.set(-1.25, 1.4, 0.08);
  const ledge = new T.Mesh(new T.BoxGeometry(1.0, 0.05, 0.3), woodMat);
  ledge.name = 'trophyLedge'; ledge.position.set(0, 0.025, 0.12); trophy.add(ledge);
  const gold = new T.MeshStandardMaterial({ color: 0xe6b84c, metalness: 0.85, roughness: 0.28 });
  const cupProfile = [[0.001, 0], [0.09, 0.02], [0.1, 0.05], [0.03, 0.09], [0.024, 0.17], [0.05, 0.19], [0.13, 0.26], [0.15, 0.36], [0.13, 0.42], [0.11, 0.42], [0.001, 0.32]]
    .map((p) => new T.Vector2(p[0], p[1]));
  const cup = new T.Mesh(new T.LatheGeometry(cupProfile, 24), gold);
  cup.position.set(0, 0.16, 0.12); trophy.add(cup);
  [-1, 1].forEach((side) => {
    const handle = new T.Mesh(new T.TorusGeometry(0.075, 0.014, 8, 18, Math.PI), gold);
    handle.position.set(side * 0.15, 0.44, 0.12);
    handle.rotation.z = side > 0 ? -Math.PI / 2 : Math.PI / 2;
    trophy.add(handle);
  });
  const baseBlock = new T.Mesh(new T.BoxGeometry(0.34, 0.11, 0.2), new T.MeshStandardMaterial({ color: 0x3a2f22, roughness: 0.55 }));
  baseBlock.position.set(0, 0.105, 0.12); trophy.add(baseBlock);
  const plaque = new T.Mesh(new T.PlaneGeometry(0.26, 0.075), new T.MeshStandardMaterial({ map: plaqueTexture(T, 'piano', '8 yrs'), roughness: 0.5 }));
  plaque.position.set(0, 0.105, 0.222); trophy.add(plaque);
  trophy.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  cork.add(trophy);
}
