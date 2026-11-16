// Web Audio API synthesizer for soft cinematic background music and school-appropriate SFX

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private musicEnabled = true;
  private sfxEnabled = true;
  private muted = false;
  private volume = 0.45; // 0..1

  private musicTimer: number | null = null;
  private stepIndex = 0;
  private userInteracted = false;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();

      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.applyVolumes();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public unlockAudio(): void {
    this.userInteracted = true;
    this.ensureContext();
    if (this.musicEnabled && !this.muted && this.musicTimer === null) {
      this.startBackgroundMusic();
    }
  }

  private applyVolumes(): void {
    if (!this.ctx || !this.masterGain || !this.musicGain || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const effectiveMaster = this.muted ? 0 : this.volume;
    this.masterGain.gain.setTargetAtTime(effectiveMaster, now, 0.05);
    this.musicGain.gain.setTargetAtTime(this.musicEnabled ? 0.24 : 0, now, 0.08);
    this.sfxGain.gain.setTargetAtTime(this.sfxEnabled ? 0.65 : 0, now, 0.04);
  }

  public setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    this.applyVolumes();
    if (enabled && this.userInteracted && !this.muted) {
      this.startBackgroundMusic();
    } else if (!enabled) {
      this.stopBackgroundMusic();
    }
  }

  public setSfxEnabled(enabled: boolean): void {
    this.sfxEnabled = enabled;
    this.applyVolumes();
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    this.applyVolumes();
    if (!muted && this.musicEnabled && this.userInteracted && this.musicTimer === null) {
      this.startBackgroundMusic();
    }
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    this.applyVolumes();
  }

  public getSettings() {
    return {
      musicEnabled: this.musicEnabled,
      sfxEnabled: this.sfxEnabled,
      muted: this.muted,
      volume: this.volume,
    };
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType,
    target: 'music' | 'sfx',
    peakGain = 0.25,
    delay = 0,
    attack = 0.02
  ): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.musicGain || !this.sfxGain) return;
    if (this.muted) return;
    if (target === 'music' && !this.musicEnabled) return;
    if (target === 'sfx' && !this.sfxEnabled) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peakGain, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(target === 'music' ? this.musicGain : this.sfxGain);

    osc.start(now);
    osc.stop(now + duration + 0.04);
  }

  public startBackgroundMusic(): void {
    if (typeof window === 'undefined') return;
    if (this.musicTimer !== null) return;
    if (!this.musicEnabled || this.muted || !this.userInteracted) return;

    // Gentle Indonesian Pelog-inspired warm cinematic progression
    // Notes in Hz: D4(293.66), E4(329.63), F#4(369.99), A4(440), B4(493.88), D5(587.33)
    const chords = [
      [146.83, 220.0, 293.66, 369.99], // Dmaj feel
      [123.47, 185.0, 246.94, 329.63], // Bm9 feel
      [196.0, 246.94, 293.66, 369.99], // Gmaj7 feel
      [164.81, 220.0, 293.66, 329.63], // Asus4/A feel
    ];
    const melody = [587.33, 493.88, 440.0, 369.99, 440.0, 493.88, 587.33, 659.25];

    const tick = () => {
      if (!this.musicEnabled || this.muted || !this.userInteracted) return;
      const chord = chords[this.stepIndex % chords.length];
      chord.forEach((freq, idx) => {
        this.playTone(freq, 3.6, 'sine', 'music', 0.09 - idx * 0.012, idx * 0.08, 0.55);
      });

      const melNote = melody[this.stepIndex % melody.length];
      this.playTone(melNote, 1.8, 'triangle', 'music', 0.045, 0.7, 0.08);
      if (this.stepIndex % 2 === 1) {
        const secondNote = melody[(this.stepIndex + 2) % melody.length];
        this.playTone(secondNote, 1.5, 'sine', 'music', 0.035, 1.9, 0.08);
      }
      this.stepIndex += 1;
    };

    tick();
    this.musicTimer = window.setInterval(tick, 3400);
  }

  public stopBackgroundMusic(): void {
    if (this.musicTimer !== null && typeof window !== 'undefined') {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  // SFX: Subtle click when decision is submitted
  public playDecisionSubmit(): void {
    this.unlockAudio();
    this.playTone(520, 0.09, 'triangle', 'sfx', 0.18, 0, 0.008);
    this.playTone(680, 0.12, 'sine', 'sfx', 0.14, 0.04, 0.01);
  }

  // SFX: Mission Start
  public playMissionStart(): void {
    this.unlockAudio();
    [293.66, 369.99, 440.0, 587.33].forEach((freq, i) => {
      this.playTone(freq, 0.45, 'triangle', 'sfx', 0.16, i * 0.07, 0.02);
    });
  }

  // SFX: Positive challenge outcome / mission complete
  public playChallengeSuccess(): void {
    this.unlockAudio();
    [440.0, 554.37, 659.25].forEach((freq, i) => {
      this.playTone(freq, 0.38, 'sine', 'sfx', 0.18, i * 0.075, 0.015);
    });
  }

  // SFX: Partial / reflective outcome
  public playChallengeReflective(): void {
    this.unlockAudio();
    this.playTone(392.0, 0.25, 'sine', 'sfx', 0.15, 0, 0.02);
    this.playTone(349.23, 0.35, 'triangle', 'sfx', 0.13, 0.12, 0.02);
  }

  // SFX: Crisis / Random Event Alert
  public playCrisisAlert(): void {
    this.unlockAudio();
    this.playTone(587.33, 0.18, 'triangle', 'sfx', 0.2, 0, 0.01);
    this.playTone(440.0, 0.24, 'triangle', 'sfx', 0.18, 0.16, 0.01);
    this.playTone(587.33, 0.28, 'triangle', 'sfx', 0.2, 0.34, 0.01);
  }

  // SFX: Achievement Badge Unlocked
  public playBadgeUnlocked(): void {
    this.unlockAudio();
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      this.playTone(freq, 0.42, 'sine', 'sfx', 0.16, i * 0.065, 0.015);
    });
  }

  // SFX: Final Completion Celebration
  public playFinalVictory(): void {
    this.unlockAudio();
    const notes = [293.66, 369.99, 440.0, 587.33, 739.99, 880.0];
    notes.forEach((freq, i) => {
      this.playTone(freq, 0.65, 'triangle', 'sfx', 0.18, i * 0.09, 0.02);
    });
    setTimeout(() => {
      [587.33, 739.99, 880.0, 1174.66].forEach((freq) => {
        this.playTone(freq, 1.1, 'sine', 'sfx', 0.13, 0, 0.04);
      });
    }, 560);
  }
}

export const soundEngine = new SoundEngine();
