// <cd-room-v2> — the room as site map. Zones: work (cd rack), about (corkboard),
// resume (papers on desk), contact (mail tray). Day/night. A butterfly drifts in.
// Events: 'zonehover' {zone,index}, 'zoneselect' {zone,index}, 'catmeow', 'roomfail'
// (three.js missing or WebGL unavailable; `failed` is also set so late listeners can check).
// Methods: selectZone(zone, index), backOne(), deselect(), setMode('day'|'night')
// Expects window.THREE (three r150 UMD) to already be loaded.
//
// The scene graph lives in ./scene.js, interaction + animation in
// ./controller.js — this file just defines the custom element and wires
// the two together.
import { buildScene } from './scene.js';
import { attachController } from './controller.js';

class CdRoomV2 extends HTMLElement {
  connectedCallback() {
    const T = window.THREE;
    this.style.cssText = 'display:block;width:100%;height:100%';
    if (!T) return this._fail('three.js not loaded');

    try {
      const refs = buildScene(T, this);
      this.appendChild(refs.el);

      const controller = attachController(this, T, refs);
      this._stop = controller.stop;
    } catch (err) {
      console.error(err);
      this._fail('3d room unavailable');
    }
  }

  _fail(why) {
    this.failed = true;
    this.innerHTML = '<div style="font:11px monospace;color:#666;padding:10px">room: ' + why + '</div>';
    this.dispatchEvent(new CustomEvent('roomfail', { bubbles: true }));
  }

  disconnectedCallback() {
    if (this._stop) this._stop();
  }
}

if (!customElements.get('cd-room-v2')) customElements.define('cd-room-v2', CdRoomV2);
