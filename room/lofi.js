// Generative lo-fi loop — no audio file, just WebAudio: rhodes-ish chords, a
// sine bass, swung dusty drums, sparse pentatonic plinks, and vinyl crackle.
// Browsers block audio until a gesture, so start() is called from a click.
export function createLofi() {
  const BPM = 76, STEP = 60 / BPM / 4; // 16th note
  // ii–V–I–vi in C, one chord per bar
  const CHORDS = [[50, 53, 57, 60, 64], [55, 59, 62, 65, 69], [48, 52, 55, 59, 62], [57, 60, 64, 67, 71]];
  const BASS = [38, 43, 36, 45];
  const SCALE = [72, 74, 76, 79, 81, 84]; // C major pentatonic
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);

  let ctx = null, master = null, duckGain = null, noiseBuf = null;
  let timer = 0, step = 0, nextTime = 0, running = false, ducked = false, adjusting = false;

  function init() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200; lp.Q.value = 0.4;
    duckGain = ctx.createGain(); master = ctx.createGain(); master.gain.value = 0;
    master.connect(duckGain); duckGain.connect(lp); lp.connect(ctx.destination);
    const len = ctx.sampleRate * 2;
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    // vinyl: quiet hiss + random pops, looped for the whole session
    const hiss = ctx.createBufferSource(); hiss.buffer = noiseBuf; hiss.loop = true;
    const hf = ctx.createBiquadFilter(); hf.type = 'highpass'; hf.frequency.value = 5000;
    const hg = ctx.createGain(); hg.gain.value = 0.012;
    hiss.connect(hf); hf.connect(hg); hg.connect(master); hiss.start();
  }

  function noise(t, dur, type, freq, vol) {
    const s = ctx.createBufferSource(); s.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(t, Math.random(), dur + 0.02);
  }

  function tone(t, m, dur, vol, type) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = hz(m);
    o.detune.value = (Math.random() - 0.5) * 14; // tape wobble
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.05);
  }

  function kick(t) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
    g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.3);
  }

  function schedule(s, t) {
    const bar = Math.floor(s / 16) % 4, i = s % 16;
    const swung = t + (i % 2 ? STEP * 0.28 : 0);
    if (i === 0) {
      CHORDS[bar].forEach((m, k) => tone(t + k * 0.012, m, STEP * 15, 0.05, k % 2 ? 'sine' : 'triangle'));
      tone(t, BASS[bar], STEP * 7, 0.2, 'sine');
    }
    if (i === 10) tone(swung, BASS[bar] + 12, STEP * 3, 0.07, 'sine');
    if (i === 0 || i === 7 || (i === 10 && bar % 2)) kick(swung);
    if (i === 4 || i === 12) noise(swung, 0.16, 'bandpass', 1800, 0.13);
    if (i % 2 === 0) noise(swung, 0.04, 'highpass', 7000, i % 4 ? 0.05 : 0.08);
    if (i % 4 === 2 && Math.random() < 0.35) {
      tone(swung, SCALE[Math.floor(Math.random() * SCALE.length)], 0.5, 0.045, 'triangle');
    }
    if (Math.random() < 0.08) noise(t + Math.random() * STEP, 0.008, 'highpass', 2500, 0.16); // crackle pop
  }

  function tick() {
    while (nextTime < ctx.currentTime + 0.2) {
      schedule(step, nextTime);
      nextTime += STEP; step = (step + 1) % 64;
    }
  }

  function applyDuck() {
    if (ctx) duckGain.gain.setTargetAtTime(ducked && !adjusting ? 0.18 : 1, ctx.currentTime, adjusting ? 0.1 : 0.4);
  }

  let vol = 1; // listener's volume (0–1), on top of the mix level below
  function level() { return running ? 0.7 * vol : 0; }

  return {
    async start() {
      if (running) return;
      if (!ctx) init();
      running = true;
      await ctx.resume();
      nextTime = ctx.currentTime + 0.1;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(level(), ctx.currentTime, 0.6);
      timer = setInterval(tick, 40);
    },
    stop() {
      if (!running) return;
      running = false;
      clearInterval(timer);
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
    },
    // drop the loop under a song preview so they don't fight
    duck(on) {
      ducked = on;
      applyDuck();
    },
    // while the listener drags the volume slider, lift the duck so the change is audible
    adjusting(on) {
      adjusting = on;
      applyDuck();
    },
    setVolume(v) {
      vol = v;
      if (ctx && running) master.gain.setTargetAtTime(level(), ctx.currentTime, 0.1);
    },
    get on() { return running; }
  };
}
