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
    meshes: { pane, bulb, lapScreen },
    textures: { dayTex, nightTex },
    disc, discHole,
    cat,
    bf, bfPos, bfTarget, bfLand, wings,
    cases, pickables, zoneTargets, zoneLift,
    CAM
  } = refs;

  const meow = createMeow();
  const ray = new T.Raycaster();
  const ndc = new T.Vector2(-2, -2);
  let hoverZone = '', hoverIdx = -1, sel = { zone: '', index: -1 };
  let flyUntil = 0;
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
      host.dispatchEvent(new CustomEvent('catmeow', { bubbles: true }));
      return;
    }
    if (hoverZone) host.selectZone(hoverZone, hoverIdx);
  });

  host.selectZone = (zone, index) => {
    sel = { zone: zone, index: index == null ? -1 : index };
    const isWork = zone === 'work';
    disc.visible = isWork; discHole.visible = isWork;
    host.dispatchEvent(new CustomEvent('zoneselect', { detail: { zone: sel.zone, index: sel.index }, bubbles: true }));
  };
  host.backOne = () => {
    if (sel.zone === 'work') { host.selectZone('rack', -1); return; }
    host.deselect();
  };
  host.deselect = () => {
    sel = { zone: '', index: -1 };
    disc.visible = false; discHole.visible = false;
    host.dispatchEvent(new CustomEvent('zoneselect', { detail: { zone: '', index: -1 }, bubbles: true }));
  };
  host.setMode = (m) => {
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
  host.getMode = () => mode;

  let raf, t = 0, intro = 1;
  const camPos = new T.Vector3(1.0, 5.6, 26);
  const camLook = CAM.wide.look.clone();

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
        host.dispatchEvent(new CustomEvent('zonehover', { detail: { zone: z, index: ix }, bubbles: true }));
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

  return {
    stop() {
      cancelAnimationFrame(raf);
      refs.disposeScene();
    }
  };
}
