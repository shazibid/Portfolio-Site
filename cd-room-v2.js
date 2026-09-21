/* <cd-room-v2> — the room as site map. Zones: work (cd rack), about (corkboard),
   resume (papers on desk), contact (mail tray). Day/night. ASCII butterfly drifts in.
   Events: 'zonehover' {zone,index}, 'zoneselect' {zone,index}
   Methods: selectZone(zone, index), deselect(), setMode('day'|'night')
   Expects window.THREE (three r150 UMD). */
(function () {
  if (customElements.get('cd-room-v2')) return;

  const CDS = [
    { title: 'miniplayer', sub: 'swift · swiftui · 2026', bg: '#e9447f', ink: '#ffffff' },
    { title: 'se-sitrep', sub: 'javascript · supabase · 2026', bg: '#2ba7b5', ink: '#06232a' },
    { title: 'aesthetic', sub: 'aws · gemini vision · 2026', bg: '#2a2740', ink: '#f5c9e4' },
    { title: 'carefi', sub: 'next.js · typescript · 2025', bg: '#f0b942', ink: '#3a2c07' },
    { title: 'arity', sub: 'python · clustering · 2025', bg: '#f0ece3', ink: '#2a2740' }
  ];


  function tex(T, w, h, draw, opts) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new T.CanvasTexture(c);
    t.encoding = T.sRGBEncoding;
    if (opts && opts.repeat) { t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(opts.repeat[0], opts.repeat[1]); }
    return t;
  }

  function coverTexture(T, cd, i) {
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

  function discTexture(T) {
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

  function paperTexture(T) {
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

  function cardTexture(T, label, sub, bg, ink) {
    return tex(T, 384, 256, (g) => {
      g.fillStyle = bg; g.fillRect(0, 0, 384, 256);
      g.strokeStyle = ink; g.lineWidth = 5; g.strokeRect(14, 14, 356, 228);
      g.fillStyle = ink; g.font = '700 38px Verdana, Geneva, sans-serif';
      g.fillText(label, 34, 120);
      g.font = '20px Verdana, Geneva, sans-serif';
      g.fillText(sub, 34, 158);
    });
  }

  function polaroidTexture(T, label) {
    return tex(T, 300, 360, (g) => {
      g.fillStyle = '#fffdf8'; g.fillRect(0, 0, 300, 360);
      g.fillStyle = '#ddd8ea'; g.fillRect(20, 20, 260, 250);
      g.strokeStyle = '#c6c0d8'; g.lineWidth = 8;
      for (let i = -260; i < 300; i += 22) { g.beginPath(); g.moveTo(20 + i, 270); g.lineTo(20 + i + 250, 20); g.stroke(); }
      g.fillStyle = '#5a5578'; g.font = '19px monospace';
      g.fillText(label, 24, 320);
    });
  }

  function posterTexture(T, top, bottom, bg, ink) {
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

  function windowTexture(T, night) {
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

  function wingTexture(T) {
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

  class CdRoomV2 extends HTMLElement {
    connectedCallback() {
      const T = window.THREE;
      if (!T) { this.innerHTML = '<div style="font:11px monospace;color:#666;padding:10px">room: three.js not loaded</div>'; return; }
      this.style.cssText = 'display:block;width:100%;height:100%';
      const W = this.clientWidth || 900, H = this.clientHeight || 620;

      const renderer = new T.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.outputEncoding = T.sRGBEncoding;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.02;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = T.PCFSoftShadowMap;
      this.appendChild(renderer.domElement);
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

      // cd rack (work zone)
      const rack = new T.Group(); rack.name = 'cdRack'; rack.position.set(-4.4, 0, -1.2); rack.rotation.y = 0.24; room.add(rack);
      const plinth = new T.Mesh(new T.BoxGeometry(3.1, 0.9, 1.5), woodMat);
      plinth.name = 'rackPlinth'; plinth.position.y = 0.45; plinth.castShadow = true; plinth.receiveShadow = true; rack.add(plinth);
      const rackBack = new T.Mesh(new T.BoxGeometry(3.1, 1.5, 0.12), woodMat);
      rackBack.name = 'rackBack'; rackBack.position.set(0, 1.55, -0.68); rackBack.castShadow = true; rack.add(rackBack);

      const cases = [];
      CDS.forEach((cd, i) => {
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

      // cat loaf on the rack
      const cat = new T.Group(); cat.name = 'cat'; cat.position.set(-2.55, 2.12, -3.78); cat.rotation.y = 2.45; cat.scale.setScalar(0.8); room.add(cat);
      const catMat = mat({ color: 0x4a4550, roughness: 0.9 }); catMat.name = 'catFur';
      // cat sits on the windowsill
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

      const ray = new T.Raycaster();
      const ndc = new T.Vector2(-2, -2);
      let hoverZone = '', hoverIdx = -1, sel = { zone: '', index: -1 };
      let flyUntil = 0, actx = null;
      const meow = () => {
        try {
          actx = actx || new (window.AudioContext || window.webkitAudioContext)();
          const now = actx.currentTime;
          const osc = actx.createOscillator(), osc2 = actx.createOscillator();
          const g = actx.createGain(), bp = actx.createBiquadFilter();
          bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 1.6;
          osc.type = 'sawtooth'; osc2.type = 'triangle';
          osc.frequency.setValueAtTime(620, now);
          osc.frequency.linearRampToValueAtTime(880, now + 0.1);
          osc.frequency.linearRampToValueAtTime(430, now + 0.42);
          osc2.frequency.setValueAtTime(310, now);
          osc2.frequency.linearRampToValueAtTime(440, now + 0.1);
          osc2.frequency.linearRampToValueAtTime(215, now + 0.42);
          g.gain.setValueAtTime(0.0001, now);
          g.gain.linearRampToValueAtTime(0.11, now + 0.06);
          g.gain.linearRampToValueAtTime(0.08, now + 0.3);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
          osc.connect(bp); osc2.connect(bp); bp.connect(g); g.connect(actx.destination);
          osc.start(now); osc2.start(now);
          osc.stop(now + 0.52); osc2.stop(now + 0.52);
        } catch (err) { /* audio blocked — the bubble still shows */ }
      };
      let mx = 0, my = 0, mode = 'day';

      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        mx = ((e.clientX - r.left) / r.width) * 2 - 1;
        my = ((e.clientY - r.top) / r.height) * 2 - 1;
        ndc.set(mx, -my);
      });
      el.addEventListener('pointerleave', () => { ndc.set(-2, -2); mx = 0; my = 0; });
      el.addEventListener('click', () => {
        if (hoverZone === 'butterfly') { flyUntil = t + 3.4; return; }
        if (hoverZone === 'cat') {
          meow();
          this.dispatchEvent(new CustomEvent('catmeow', { bubbles: true }));
          return;
        }
        if (hoverZone) this.selectZone(hoverZone, hoverIdx);
      });

      const CAM = {
        wide: { pos: new T.Vector3(0.3, 3.9, 14.2), look: new T.Vector3(0.2, 2.2, -1.8) },
        work: { pos: new T.Vector3(3.6, 3.5, 4.6), look: new T.Vector3(2.7, 1.95, -2.3) },
        rack: { pos: new T.Vector3(-3.8, 2.75, 5.0), look: new T.Vector3(-4.3, 1.75, -1.2) },
        about: { pos: new T.Vector3(3.3, 3.9, 1.6), look: new T.Vector3(3.3, 3.9, -4.1) },
        resume: { pos: new T.Vector3(-0.7, 3.1, 0.5), look: new T.Vector3(-0.9, 1.7, -1.9) },
        contact: { pos: new T.Vector3(4.6, 2.9, 0.9), look: new T.Vector3(4.15, 1.75, -1.6) }
      };
      const camPos = new T.Vector3(1.0, 5.6, 26);
      const camLook = CAM.wide.look.clone();
      let intro = 1;

      this.selectZone = (zone, index) => {
        sel = { zone: zone, index: index == null ? -1 : index };
        const isWork = zone === 'work';
        disc.visible = isWork; discHole.visible = isWork;
        this.dispatchEvent(new CustomEvent('zoneselect', { detail: { zone: sel.zone, index: sel.index }, bubbles: true }));
      };
      this.backOne = () => {
        if (sel.zone === 'work') { this.selectZone('rack', -1); return; }
        this.deselect();
      };
      this.deselect = () => {
        sel = { zone: '', index: -1 };
        disc.visible = false; discHole.visible = false;
        this.dispatchEvent(new CustomEvent('zoneselect', { detail: { zone: '', index: -1 }, bubbles: true }));
      };
      this.setMode = (m) => {
        mode = m === 'night' ? 'night' : 'day';
        const night = mode === 'night';
        sun.intensity = night ? 0.06 : 1.75;
        amb.intensity = night ? 0.1 : 0.46;
        hemi.intensity = night ? 0.16 : 0.62;
        lampLight.intensity = night ? 2.4 : 1.4;
        lampLight.distance = night ? 12 : 9;
        pool.intensity = night ? 9 : 0;
        shadeMat.emissiveIntensity = night ? 0.85 : 0;
        bulb.material.color.set(night ? 0xfff2d6 : 0xf3ead8);
        renderer.toneMappingExposure = night ? 1.25 : 1.02;
        scene.background.set(night ? 0x241f33 : 0xe7ddf2);
        wallMat.color.set(night ? 0x453d5c : 0xefe6f7);
        floorMat.color.set(night ? 0x6a5040 : 0xe9c79a);
        woodMat.color.set(night ? 0x8a6543 : 0xdba86a);
        pane.material.map = night ? nightTex : dayTex;
        pane.material.needsUpdate = true;
        lapScreen.material.color.set(night ? 0x5fb3bd : 0x9fd8de);
      };
      this.getMode = () => mode;

      const ro = new ResizeObserver(() => {
        const cw = this.clientWidth || W, ch = this.clientHeight || H;
        if (!cw || !ch) return;
        renderer.setSize(cw, ch);
        camera.aspect = cw / ch; camera.updateProjectionMatrix();
      });
      ro.observe(this);

      let raf, t = 0, bfPhase = 0;
      const tick = () => {
        raf = requestAnimationFrame(tick);
        t += 0.016;
        intro = Math.max(0, intro - 0.0075);

        if (!sel.zone || sel.zone === 'rack') {
          ray.setFromCamera(ndc, camera);
          const hit = ray.intersectObjects(pickables, false)[0];
          const ud = hit ? (hit.object.userData.zone ? hit.object.userData : hit.object.parent.userData) : null;
          const z = ud ? ud.zone : '';
          const ix = ud ? (ud.index == null ? -1 : ud.index) : -1;
          if (z !== hoverZone || ix !== hoverIdx) {
            hoverZone = z; hoverIdx = ix;
            el.style.cursor = z ? 'pointer' : 'default';
            this.dispatchEvent(new CustomEvent('zonehover', { detail: { zone: z, index: ix }, bubbles: true }));
          }
        }

        const rackOpen = sel.zone === 'rack' ? 1 : 0;
        cases.forEach((c, i) => {
          const d = c.userData;
          d.target = (sel.zone === 'work' && sel.index === d.index) ? 1
            : ((!sel.zone || sel.zone === 'rack') && hoverZone === 'work' && hoverIdx === d.index ? 0.6 : 0);
          d.lift += (d.target - d.lift) * 0.14;
          d.open = (d.open || 0) + (rackOpen - (d.open || 0)) * 0.11;
          const baseX = -1.02 + i * 0.5, baseZ = 0.12 - i * 0.03;
          const openX = (i - 2) * 1.02, openZ = 0.34;
          c.position.x = baseX + (openX - baseX) * d.open;
          c.position.z = baseZ + (openZ - baseZ) * d.open;
          c.position.y = d.baseY + d.lift * 0.62 + d.open * 0.1;
          c.rotation.x = d.baseRotX * (1 - d.open * 0.72) + d.lift * 0.14;
          c.rotation.y = d.lift * -0.22;
        });

        zoneTargets.forEach((z) => {
          if (z.zone === 'rack') return;
          const want = (!sel.zone && hoverZone === z.zone) ? 1 : 0;
          zoneLift[z.zone] += (want - zoneLift[z.zone]) * 0.15;
          const s = 1 + zoneLift[z.zone] * 0.045;
          z.group.scale.setScalar(s);
        });

        const goal = CAM[sel.zone || 'wide'] || CAM.wide;
        const driftX = sel.zone ? 0.22 : 1.3;
        const driftY = sel.zone ? 0.1 : 0.55;
        const lerp = intro > 0 ? 0.035 : 0.055;
        camPos.lerp(new T.Vector3(
          goal.pos.x + mx * driftX + Math.sin(t * 0.3) * 0.14,
          goal.pos.y - my * driftY + Math.sin(t * 0.22) * 0.08,
          goal.pos.z
        ), lerp);
        camLook.lerp(goal.look, lerp);
        camera.position.copy(camPos);
        camera.lookAt(camLook);

        if (sel.zone === 'work') disc.rotation.z += 0.09;

        // butterfly: wanders briefly, then lands on top of the lamp and stays
        const landed = t > 11 && t > flyUntil;
        if (landed) {
          bfTarget.copy(bfLand);
        } else {
          bfTarget.set(
            1.0 + Math.sin(t * 0.38) * 3.6 + Math.sin(t * 0.21) * 1.0,
            2.9 + Math.sin(t * 0.54) * 0.7,
            -2.0 + Math.cos(t * 0.31) * 1.8
          );
        }
        const prev = bfPos.clone();
        bfPos.lerp(bfTarget, landed ? 0.028 : 0.035);
        bf.position.copy(bfPos);
        const vel = bfPos.clone().sub(prev);
        if (!landed && vel.length() > 0.0012) {
          bf.lookAt(bfPos.clone().add(vel));
          bf.rotation.z = -vel.x * 1.6;
        } else if (landed && bfPos.distanceTo(bfLand) < 0.06) {
          bf.rotation.set(0, 2.4, 0);
        }
        const flick = landed && (t % 4.2) < 0.26;
        const amp = landed ? (flick ? 0.7 : 0.14) : 0.95;
        const spd = landed ? (flick ? 15 : 1.5) : 15;
        const wa = Math.sin(t * spd) * amp + (landed ? 0.55 : 0.1);
        wings.forEach((w) => { w.pivot.rotation.z = -w.sx * wa; });

        cat.position.y = 2.12 + Math.sin(t * 1.1) * 0.008;
        if (mode === 'night') bulb.material.color.setHSL(0.1, 0.55, 0.9 + Math.sin(t * 2.4) * 0.03);

        renderer.render(scene, camera);
      };
      tick();
      this._stop = () => { cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); };
    }
    disconnectedCallback() { if (this._stop) this._stop(); }
  }
  customElements.define('cd-room-v2', CdRoomV2);
})();
