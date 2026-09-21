// Wires up interaction (pointer hover/click), the animation loop, and the
// public API (selectZone/backOne/deselect/setMode) that room/cd-room-v2.js
// exposes on the <cd-room-v2> element. Everything here is *behavior* over
// the scene room/scene.js already built.
import { createMeow } from './audio.js';

export function attachController(host, T, refs) {
  const {
    renderer, scene, camera, el,
    lights: { amb, hemi, sun, lampLight, pool },
    materials: { wallMat, floorMat, woodMat, shadeMat },
    meshes: { pane, bulb, lapScreen, glow },
    screenUI,
    textures: { dayTex, nightTex },
    disc, discHole, discArt, vinylTex, setPlayerDisplay, setTonearm,
    cat,
    bf, bfPos, bfTarget, bfLand, wings,
    cases, caseHits, pickables, zoneTargets, zoneLift, zoneSubjects,
    CAM
  } = refs;

  // from the room view the rack is one object; individual discs only become pickable once it's open
  const roomPickables = pickables.filter((p) => !caseHits.includes(p));

  const meow = createMeow();
  const ray = new T.Raycaster();
  const ndc = new T.Vector2(-2, -2);
  let hoverZone = '', hoverIdx = -1, sel = { zone: '', index: -1 };
  let flyUntil = 0;
  let mx = 0, my = 0, mode = 'day';
  let lofiOn = false;

  // the player shows the selected album in the work zone, otherwise the lofi vinyl while the loop plays
  function syncDisc() {
    const album = sel.zone === 'work' && discArt[sel.index];
    const show = !!album || lofiOn;
    disc.visible = show; discHole.visible = show;
    setTonearm(show);
    setPlayerDisplay(album ? sel.index : lofiOn ? -2 : -1);
    disc.material.map = album || vinylTex;
    disc.material.needsUpdate = true;
  }
  host.setLofi = (on) => { lofiOn = !!on; syncDisc(); };

  // pixels on the right covered by the side panel: the view is shifted so the zone in focus
  // centers in the space left of it (eased in the tick so it slides over with the camera)
  let panelInset = 0, panelInsetGoal = 0;
  host.setPanelInset = (px) => { panelInsetGoal = Math.max(0, px || 0); };

  const setPointer = (e) => {
    const r = el.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width) * 2 - 1;
    my = ((e.clientY - r.top) / r.height) * 2 - 1;
    ndc.set(mx, -my);
  };
  el.addEventListener('pointermove', setPointer);
  // touch has no hover: a tap only fires pointerdown/up/click, so pick at the
  // touch point before the click handler reads hoverZone
  el.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return;
    setPointer(e);
    updateHover();
  });
  el.addEventListener('pointerleave', (e) => {
    if (e.pointerType !== 'mouse') return; // the tap's click still needs its target
    ndc.set(-2, -2); mx = 0; my = 0;
  });
  el.addEventListener('click', () => {
    // hover picking is off while a page is open, so any click on the room
    // itself (i.e. off the panel) steps back out
    if (sel.zone === 'computer') {
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObject(lapScreen, false)[0];
      if (hit && hit.uv) screenUI.click(hit.uv); else host.backOne();
      return;
    }
    if (sel.zone && sel.zone !== 'rack') { host.backOne(); return; }
    if (sel.zone === 'rack' && !hoverZone) { host.backOne(); return; }
    if (hoverZone === 'butterfly') { flyUntil = t + 3.4; return; }
    if (hoverZone === 'cat') {
      meow();
      host.dispatchEvent(new CustomEvent('catmeow', { bubbles: true }));
      return;
    }
    if (hoverZone) host.selectZone(hoverZone, hoverIdx);
  });

  host.selectZone = (zone, index) => {
    sel = { zone: zone, index: index == null ? -1 : index };
    syncDisc();
    host.dispatchEvent(new CustomEvent('zoneselect', { detail: { zone: sel.zone, index: sel.index }, bubbles: true }));
  };
  host.backOne = () => {
    if (sel.zone === 'work') { host.selectZone('rack', -1); return; }
    host.deselect();
  };
  host.deselect = () => {
    sel = { zone: '', index: -1 };
    syncDisc();
    host.dispatchEvent(new CustomEvent('zoneselect', { detail: { zone: '', index: -1 }, bubbles: true }));
  };
  host.setMode = (m) => {
    mode = m === 'night' ? 'night' : 'day';
    const night = mode === 'night';
    // night: no sun (its shadows pointed away from the lamp), minimal fill, lamp does the work
    sun.intensity = night ? 0 : 1.75;
    sun.castShadow = !night;
    lampLight.castShadow = night;
    scene.traverse((o) => {
      if (!o.material) return;
      (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { m.needsUpdate = true; });
    });
    amb.intensity = night ? 0.05 : 0.3;
    hemi.intensity = night ? 0.09 : 0.4;
    lampLight.intensity = night ? 3.6 : 1.4;
    lampLight.distance = night ? 8 : 9;
    pool.intensity = 0; // the old detached spotlight lit the floor from nowhere; the lamp's point light replaces it
    glow.material.opacity = night ? 0.6 : 0;
    shadeMat.emissiveIntensity = night ? 0.85 : 0;
    bulb.material.color.set(night ? 0xfff2d6 : 0xf3ead8);
    renderer.toneMappingExposure = night ? 1.25 : 0.86;
    scene.background.set(night ? 0x241f33 : 0xd3c7e3);
    wallMat.color.set(night ? 0x453d5c : 0xdccfeb);
    floorMat.color.set(night ? 0x6a5040 : 0xd6b083);
    woodMat.color.set(night ? 0x8a6543 : 0xcf9a5c);
    pane.material.map = night ? nightTex : dayTex;
    pane.material.needsUpdate = true;
    lapScreen.material.color.set(night ? 0xb4bccf : 0xffffff);
  };
  host.getMode = () => mode;

  // hover-pick the room (or the rack's cases) under the pointer
  function updateHover() {
    if (sel.zone && sel.zone !== 'rack') return;
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(sel.zone === 'rack' ? pickables : roomPickables, false)[0];
    const ud = hit ? (hit.object.userData.zone ? hit.object.userData : hit.object.parent.userData) : null;
    const z = ud ? ud.zone : '';
    const ix = ud ? (ud.index == null ? -1 : ud.index) : -1;
    if (z !== hoverZone || ix !== hoverIdx) {
      hoverZone = z; hoverIdx = ix;
      el.style.cursor = z ? 'pointer' : 'default';
      host.dispatchEvent(new CustomEvent('zonehover', { detail: { zone: z, index: ix }, bubbles: true }));
    }
  }

  // fraction of the wide shot's distance kept (smaller = closer)
  const WIDE_ZOOM = 0.84, WIDE_ZOOM_SHORT = 0.68;
  // How much of the frame width a zone's subject fills in its resting close-up, measured by
  // projecting its bounds through a copy of the camera at that shot (cached per aspect ratio).
  const fitCam = new T.PerspectiveCamera();
  const fitBox = new T.Box3(), fitPt = new T.Vector3();
  const spanCache = {};
  function zoneSpan(zone) {
    const key = zone + ':' + camera.aspect.toFixed(3);
    if (key in spanCache) return spanCache[key];
    const subject = zoneSubjects[zone], shot = CAM[zone];
    if (!subject || !shot) return (spanCache[key] = 0);
    fitBox.setFromObject(subject);
    fitCam.fov = camera.fov; fitCam.aspect = camera.aspect; fitCam.near = camera.near; fitCam.far = camera.far;
    fitCam.position.copy(shot.pos); fitCam.lookAt(shot.look);
    fitCam.updateProjectionMatrix(); fitCam.updateMatrixWorld(true);
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i < 8; i++) {
      fitPt.set(i & 1 ? fitBox.max.x : fitBox.min.x, i & 2 ? fitBox.max.y : fitBox.min.y, i & 4 ? fitBox.max.z : fitBox.min.z)
        .project(fitCam);
      lo = Math.min(lo, fitPt.x); hi = Math.max(hi, fitPt.x);
    }
    return (spanCache[key] = (hi - lo) / 2); // NDC spans 2, so this is a fraction of the frame width
  }
  let raf, t = 0, intro = 1;
  const camPos = new T.Vector3(1.0, 5.6, 26);
  const camLook = CAM.wide.look.clone();

  const tick = () => {
    raf = requestAnimationFrame(tick);
    t += 0.016;
    intro = Math.max(0, intro - 0.0075);

    updateHover();

    if (sel.zone === 'computer') {
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObject(lapScreen, false)[0];
      const ti = hit && hit.uv ? screenUI.tabAt(hit.uv) : -1;
      screenUI.setHover(ti);
      el.style.cursor = ti >= 0 ? 'pointer' : 'default';
    }

    const rackOpen = sel.zone === 'rack' ? 1 : 0;
    cases.forEach((c, i) => {
      const d = c.userData;
      d.target = (sel.zone === 'work' && sel.index === d.index) ? 1
        : ((!sel.zone || sel.zone === 'rack') && hoverZone === 'work' && hoverIdx === d.index ? 0.6 : 0);
      d.lift += (d.target - d.lift) * 0.14;
      d.open = (d.open || 0) + (rackOpen - (d.open || 0)) * 0.11;
      const baseX = -1.02 + i * 0.5, baseZ = 0.12 - i * 0.03;
      // cases overlap sideways when fanned out (1.25 wide, 1.02 apart), so each keeps its own
      // depth (left in front, same order as the closed rack) or the covers z-fight
      const openX = (i - 2) * 1.02, openZ = 0.34 - i * 0.03;
      c.position.x = baseX + (openX - baseX) * d.open;
      c.position.z = baseZ + (openZ - baseZ) * d.open;
      c.position.y = d.baseY + d.lift * 0.62 + d.open * 0.1;
      // a lifted case only rises, in the closed stack and fanned out alike: any yaw/tilt
      // pushes an edge through a neighbour's plane, and the covers would intersect
      c.rotation.x = d.baseRotX * (1 - d.open * 0.72);
      c.rotation.y = 0;

      const h = caseHits[i];
      h.position.set(c.position.x, d.baseY + d.open * 0.1, c.position.z);
      h.rotation.set(d.baseRotX * (1 - d.open * 0.72), 0, 0);
    });

    zoneTargets.forEach((z) => {
      const want = (!sel.zone && hoverZone === z.zone) ? 1 : 0;
      zoneLift[z.zone] += (want - zoneLift[z.zone]) * 0.15;
      const s = 1 + zoneLift[z.zone] * 0.045;
      z.group.scale.setScalar(s);
    });

    panelInset += (panelInsetGoal - panelInset) * 0.1;
    if (Math.abs(panelInsetGoal - panelInset) < 0.5) panelInset = panelInsetGoal;
    const vw = host.clientWidth, vh = host.clientHeight;

    let goal = CAM[sel.zone || 'wide'] || CAM.wide;
    if (!sel.zone) {
      // the wide shot leaves a lot of empty wall/floor around the room, most of all on short
      // landscape phones, so pull it in toward what it looks at
      const short = host.clientHeight <= 500;
      const k = short ? WIDE_ZOOM_SHORT : WIDE_ZOOM;
      // aim a touch higher so the room sits lower, clear of the pills across the top
      const rise = new T.Vector3(0, short ? 0.6 : 0.4, 0);
      const look = goal.look.clone().add(rise);
      goal = { pos: look.clone().lerp(goal.pos.clone().add(rise), k), look };
    }
    if (sel.zone && panelInset > 0 && vw) {
      // centered in the space beside the panel isn't enough if the shot fills the whole frame:
      // back off until the subject fits in what's left (with a little margin)
      const f = Math.max(1, zoneSpan(sel.zone) / (0.82 * (1 - panelInset / vw)));
      goal = { pos: goal.look.clone().lerp(goal.pos, f), look: goal.look };
    }
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

    if (panelInset > 0 && vw && vh) camera.setViewOffset(vw, vh, panelInset / 2, 0, vw, vh);
    else if (camera.view && camera.view.enabled) { camera.clearViewOffset(); }

    if (disc.visible) disc.rotation.z += 0.015; // deliberately slower than a real 33rpm so it reads as a gentle spin

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

  return {
    stop() {
      cancelAnimationFrame(raf);
      refs.disposeScene();
    }
  };
}
