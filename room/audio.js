// Synthesized "meow" — no audio file, just oscillators. Returns a function
// that lazily creates (and reuses) one AudioContext across calls.
export function createMeow() {
  let actx = null;
  return function meow() {
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
}
