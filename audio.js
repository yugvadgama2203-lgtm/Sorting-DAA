/* ==========================================================================
   Web Audio API Synthesizer Module
   ========================================================================== */

class SoundSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.isEnabled = true;
    this.volume = 0.2;
    this.minFreq = 120; // Hz
    this.maxFreq = 1200; // Hz
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playTone(val, minVal = 5, maxVal = 100, duration = 0.06) {
    if (!this.isEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Normalize frequency based on bar value
      const normalized = Math.max(0, Math.min(1, (val - minVal) / (maxVal - minVal || 1)));
      const freq = this.minFreq + normalized * (this.maxFreq - this.minFreq);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      // Envelope
      gain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio context error fallback silent
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, parseFloat(vol)));
  }

  toggleSound() {
    this.isEnabled = !this.isEnabled;
    return this.isEnabled;
  }
}

window.soundSynth = new SoundSynthesizer();
