export class AudioController {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isRunning: boolean = false;
  private noteTime: number = 0;
  private tempo: number = 150; // Faster, more energetic
  private scheduleAheadTime: number = 0.1;
  private lookahead: number = 25;
  private timerID: number | null = null;
  private currentNote: number = 0;

  // Happy Chiptune Arpeggio (C Major -> F Major -> G Major)
  // High pitch, bouncy notes
  private bassLine = [
    72, 76, 79, 84,  // C Maj
    72, 76, 79, 84,
    77, 81, 84, 89,  // F Maj
    79, 83, 86, 91,  // G Maj
  ];

  constructor() {
    try {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      if (this.ctx) {
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        this.masterGain.gain.value = 0.2; // Slightly lower volume for high pitch sounds
      }
    } catch (e) {
      console.error("Web Audio API not supported");
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      // If muted, gain 0. If unmuted, restore volume.
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.2, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  getMuted() { return this.isMuted; }

  async startMusic() {
    if (!this.ctx) return;
    
    // Resume context if it was suspended (Pause mechanic)
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (this.isRunning) return;
    
    this.isRunning = true;
    this.noteTime = this.ctx.currentTime + 0.05;
    this.currentNote = 0;
    this.scheduler();
  }

  async pauseMusic() {
      if (!this.ctx) return;
      if (this.ctx.state === 'running') {
          await this.ctx.suspend();
      }
      // We don't set isRunning to false here because we want to resume exactly where we left off
      // The scheduler continues to try to run, but time doesn't advance in a suspended context
  }

  stopMusic() {
    this.isRunning = false;
    if (this.timerID !== null) {
      window.clearTimeout(this.timerID);
    }
  }

  private scheduler() {
    if (!this.ctx) return;
    // Only schedule if context is running/time is advancing
    while (this.noteTime < this.ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.currentNote, this.noteTime);
      this.advanceNote();
    }
    if (this.isRunning) {
        this.timerID = window.setTimeout(() => this.scheduler(), this.lookahead);
    }
  }

  private scheduleNote(beatNumber: number, time: number) {
    if (!this.ctx || !this.masterGain) return;
    
    // Main Melody / Arpeggio (Square wave for 8-bit feel)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    // Get freq from MIDI note number
    const note = this.bassLine[beatNumber % this.bassLine.length];
    // Add some variation for a "melody" feel on every 4th note
    const finalNote = (beatNumber % 8 === 7) ? note + 2 : note;

    osc.frequency.value = 440 * Math.pow(2, (finalNote - 69) / 12);
    
    // Staccato Envelope (Short and punchy)
    gain.gain.setValueAtTime(0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.1);

    // Bass / Kick (On beat 1 and 3)
    if (beatNumber % 4 === 0) { 
        this.playKick(time);
    }
    
    // Snare / Clap (On beat 2 and 4)
    if (beatNumber % 4 === 2) {
        this.playSnare(time);
    }

    // High Hat (Every off beat)
    if (beatNumber % 2 !== 0) {
        this.playHiHat(time);
    }
  }

  private advanceNote() {
    const secondsPerBeat = 60.0 / this.tempo;
    this.noteTime += 0.25 * secondsPerBeat; // 16th notes
    this.currentNote++;
  }

  // SFX
  playJump() {
     if (!this.ctx || !this.masterGain) return;
     const osc = this.ctx.createOscillator();
     const gain = this.ctx.createGain();
     osc.type = 'square';
     // Slide up quickly (Cute jump sound)
     osc.frequency.setValueAtTime(300, this.ctx.currentTime);
     osc.frequency.linearRampToValueAtTime(600, this.ctx.currentTime + 0.1);
     
     gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
     gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
     
     osc.connect(gain);
     gain.connect(this.masterGain);
     osc.start();
     osc.stop(this.ctx.currentTime + 0.1);
  }

  playCollect() {
     if (!this.ctx || !this.masterGain) return;
     const osc = this.ctx.createOscillator();
     const gain = this.ctx.createGain();
     osc.type = 'sine';
     // "Coin" sound - two tones
     const now = this.ctx.currentTime;
     
     osc.frequency.setValueAtTime(1200, now);
     osc.frequency.setValueAtTime(1600, now + 0.05);
     
     gain.gain.setValueAtTime(0.2, now);
     gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
     
     osc.connect(gain);
     gain.connect(this.masterGain);
     osc.start();
     osc.stop(now + 0.2);
  }

  playHit() {
     if (!this.ctx || !this.masterGain) return;
     const osc = this.ctx.createOscillator();
     const gain = this.ctx.createGain();
     osc.type = 'sawtooth';
     // Low buzz
     osc.frequency.setValueAtTime(100, this.ctx.currentTime);
     osc.frequency.linearRampToValueAtTime(50, this.ctx.currentTime + 0.2);
     
     gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
     gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
     
     osc.connect(gain);
     gain.connect(this.masterGain);
     osc.start();
     osc.stop(this.ctx.currentTime + 0.2);
  }

  playGameOver() {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.linearRampToValueAtTime(200, now + 0.5);
      
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.5);
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now);
      osc.stop(now + 0.5);
  }
  
  private playKick(time: number) {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.frequency.setValueAtTime(200, time);
      osc.frequency.exponentialRampToValueAtTime(50, time + 0.1);
      gain.gain.setValueAtTime(0.5, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(time);
      osc.stop(time + 0.1);
  }

  private playSnare(time: number) {
      // Noise
      const bufferSize = this.ctx!.sampleRate * 0.05; 
      const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx!.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = this.ctx!.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.value = 1500;
      const noiseGain = this.ctx!.createGain();
      noiseGain.gain.setValueAtTime(0.2, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
      
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain!);
      noise.start(time);
  }

  private playHiHat(time: number) {
      // Short high noise
      const bufferSize = this.ctx!.sampleRate * 0.02; 
      const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx!.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = this.ctx!.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.value = 5000;
      const noiseGain = this.ctx!.createGain();
      noiseGain.gain.setValueAtTime(0.1, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.02);
      
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain!);
      noise.start(time);
  }
}

export const gameAudio = new AudioController();