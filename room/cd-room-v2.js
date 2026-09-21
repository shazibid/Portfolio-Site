// <cd-room-v2> — the room as site map. Zones: work (cd rack), about (corkboard),
// resume (papers on desk), contact (mail tray). Day/night. A butterfly drifts in.
// Events: 'zonehover' {zone,index}, 'zoneselect' {zone,index}, 'catmeow'
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
    if (!T) {
      this.innerHTML = '<div style="font:11px monospace;color:#666;padding:10px">room: three.js not loaded</div>';
      return;
    }
    this.style.cssText = 'display:block;width:100%;height:100%';

    const refs = buildScene(T, this);
    this.appendChild(refs.el);

    const controller = attachController(this, T, refs);
    this._stop = controller.stop;
  }

  disconnectedCallback() {
    if (this._stop) this._stop();
  }
}

if (!customElements.get('cd-room-v2')) customElements.define('cd-room-v2', CdRoomV2);
