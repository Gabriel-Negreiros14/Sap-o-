let audioCtx = null;

function getContext() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!audioCtx) audioCtx = new AudioCtx();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playTones(tones) {
  try {
    const ctx = getContext();
    if (!ctx) return;
    const start = ctx.currentTime;

    tones.forEach(({ freq, at, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = start + at;

      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + duration + 0.02);
    });
  } catch {
    /* o navegador pode bloquear áudio sem interação prévia; ignorar */
  }
}

/** Alerta de "hora de beber água": dois toques. */
export function playReminder() {
  playTones([
    { freq: 880, at: 0, duration: 0.2 },
    { freq: 1175, at: 0.24, duration: 0.3 },
  ]);
}

/** Fanfarra curta de level up. */
export function playLevelUp() {
  playTones([
    { freq: 523, at: 0, duration: 0.15 },
    { freq: 659, at: 0.15, duration: 0.15 },
    { freq: 784, at: 0.3, duration: 0.15 },
    { freq: 1047, at: 0.45, duration: 0.35 },
  ]);
}
