/* ============================================
   CHEMVENTUR v107 - AUDIO SYSTEM
   Sound-reactive physics engine!
   
   Features:
   - URL audio loading
   - File upload support
   - Real-time FFT frequency analysis
   - Equalizer controls
   - Frequency → Grid mapping:
     * High freq → temp.grid (heat/vibration)
     * Mid freq → pressure.grid (wave ripples)
     * Bass/Sub → magnetism.grid (deep forces)
   ============================================ */

(function() {
  
  CHEMVENTUR.AudioSystem = {
    // Audio context and nodes
    ctx: null,
    analyser: null,
    source: null,
    gainNode: null,
    
    // Audio element for URL/file playback
    audioElement: null,
    
    // FFT data
    frequencyData: null,
    timeDomainData: null,
    fftSize: 256,
    
    // Frequency bands (will be calculated)
    bands: {
      sub: { start: 0, end: 0, value: 0, smoothed: 0 },      // 20-60 Hz
      bass: { start: 0, end: 0, value: 0, smoothed: 0 },     // 60-250 Hz
      mid: { start: 0, end: 0, value: 0, smoothed: 0 },      // 250-2000 Hz
      high: { start: 0, end: 0, value: 0, smoothed: 0 },     // 2000-6000 Hz
      treble: { start: 0, end: 0, value: 0, smoothed: 0 }    // 6000-20000 Hz
    },
    
    // Equalizer settings (user adjustable)
    equalizer: {
      high: { gain: 1.0, target: 'temp' },       // High → Temperature grid
      mid: { gain: 1.0, target: 'pressure' },    // Mid → Pressure grid
      bass: { gain: 1.0, target: 'magnetism' },  // Bass → Magnetism grid
      sub: { gain: 1.0, target: 'magnetism' },   // Sub → Magnetism grid (deep)
      master: 1.0
    },
    
    // State
    enabled: false,
    isPlaying: false,
    currentURL: '',
    smoothingFactor: 0.85,  // How smooth the transitions are
    
    // Grid influence strengths
    influence: {
      temp: 0,
      pressure: 0,
      magnetism: 0
    },
    
    // ===== INITIALIZATION =====
    init() {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create analyser
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = this.fftSize;
        this.analyser.smoothingTimeConstant = 0.8;
        
        // Create gain node for volume control
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.value = 0.7;
        
        // Connect: source → analyser → gain → destination
        this.analyser.connect(this.gainNode);
        this.gainNode.connect(this.ctx.destination);
        
        // Initialize data arrays
        const bufferLength = this.analyser.frequencyBinCount;
        this.frequencyData = new Uint8Array(bufferLength);
        this.timeDomainData = new Uint8Array(bufferLength);
        
        // Calculate frequency band indices
        this.calculateBandIndices();
        
        // Create audio element for URL playback
        this.audioElement = new Audio();
        this.audioElement.crossOrigin = 'anonymous';
        this.audioElement.addEventListener('ended', () => this.onAudioEnded());
        this.audioElement.addEventListener('error', (e) => this.onAudioError(e));
        
        this.enabled = true;
        console.log('🎵 AudioSystem initialized!');
        
      } catch (e) {
        console.warn('AudioSystem not available:', e);
        this.enabled = false;
      }
    },
    
    // Calculate which FFT bins correspond to which frequency bands
    calculateBandIndices() {
      if (!this.ctx) return;
      
      const sampleRate = this.ctx.sampleRate;
      const binCount = this.analyser.frequencyBinCount;
      const binHz = sampleRate / this.fftSize;
      
      // Frequency ranges in Hz
      const ranges = {
        sub: [20, 60],
        bass: [60, 250],
        mid: [250, 2000],
        high: [2000, 6000],
        treble: [6000, 20000]
      };
      
      for (const [band, [lowHz, highHz]] of Object.entries(ranges)) {
        this.bands[band].start = Math.floor(lowHz / binHz);
        this.bands[band].end = Math.min(Math.ceil(highHz / binHz), binCount - 1);
      }
    },
    
    // ===== AUDIO LOADING =====
    
    // Load audio from URL
    async loadURL(url) {
      if (!this.enabled) {
        console.warn('AudioSystem not enabled');
        return false;
      }
      
      try {
        // Resume audio context if suspended
        if (this.ctx.state === 'suspended') {
          await this.ctx.resume();
        }
        
        // Stop current playback
        this.stop();
        
        // Set new source
        this.audioElement.src = url;
        this.currentURL = url;
        
        // Create media element source
        if (this.source) {
          this.source.disconnect();
        }
        this.source = this.ctx.createMediaElementSource(this.audioElement);
        this.source.connect(this.analyser);
        
        console.log('🎵 Audio URL loaded:', url);
        return true;
        
      } catch (e) {
        console.error('Failed to load audio URL:', e);
        return false;
      }
    },
    
    // Load audio from file
    async loadFile(file) {
      if (!this.enabled) return false;
      
      try {
        const url = URL.createObjectURL(file);
        return await this.loadURL(url);
      } catch (e) {
        console.error('Failed to load audio file:', e);
        return false;
      }
    },
    
    // ===== PLAYBACK CONTROL =====
    
    play() {
      if (!this.audioElement || !this.audioElement.src) return;
      
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      
      this.audioElement.play();
      this.isPlaying = true;
    },
    
    pause() {
      if (this.audioElement) {
        this.audioElement.pause();
      }
      this.isPlaying = false;
    },
    
    stop() {
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      }
      this.isPlaying = false;
    },
    
    toggle() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
      return this.isPlaying;
    },
    
    setVolume(vol) {
      if (this.gainNode) {
        this.gainNode.gain.value = Math.max(0, Math.min(1, vol));
      }
    },
    
    // ===== ANALYSIS =====
    
    // Update frequency analysis - call this every frame!
    update() {
      if (!this.enabled || !this.analyser || !this.isPlaying) {
        // Decay influences when not playing
        this.influence.temp *= 0.95;
        this.influence.pressure *= 0.95;
        this.influence.magnetism *= 0.95;
        return;
      }
      
      // Get frequency data
      this.analyser.getByteFrequencyData(this.frequencyData);
      this.analyser.getByteTimeDomainData(this.timeDomainData);
      
      // Calculate band values
      for (const [bandName, band] of Object.entries(this.bands)) {
        let sum = 0;
        let count = 0;
        
        for (let i = band.start; i <= band.end; i++) {
          sum += this.frequencyData[i];
          count++;
        }
        
        const rawValue = count > 0 ? sum / count / 255 : 0;
        
        // Smooth the value
        band.value = rawValue;
        band.smoothed = band.smoothed * this.smoothingFactor + 
                        rawValue * (1 - this.smoothingFactor);
      }
      
      // Calculate grid influences based on equalizer settings
      const eq = this.equalizer;
      
      // Temperature influence (high frequencies)
      this.influence.temp = (
        this.bands.high.smoothed * eq.high.gain +
        this.bands.treble.smoothed * eq.high.gain * 0.5
      ) * eq.master;
      
      // Pressure influence (mid frequencies)
      this.influence.pressure = (
        this.bands.mid.smoothed * eq.mid.gain
      ) * eq.master;
      
      // Magnetism influence (bass/sub frequencies)
      this.influence.magnetism = (
        this.bands.bass.smoothed * eq.bass.gain +
        this.bands.sub.smoothed * eq.sub.gain * 1.5
      ) * eq.master;
    },
    
    // Get the current waveform for visualization
    getWaveform() {
      if (!this.timeDomainData) return [];
      return Array.from(this.timeDomainData);
    },
    
    // Get frequency spectrum for visualization
    getSpectrum() {
      if (!this.frequencyData) return [];
      return Array.from(this.frequencyData);
    },
    
    // Get smoothed band values
    getBands() {
      return {
        sub: this.bands.sub.smoothed,
        bass: this.bands.bass.smoothed,
        mid: this.bands.mid.smoothed,
        high: this.bands.high.smoothed,
        treble: this.bands.treble.smoothed
      };
    },
    
    // Get grid influences
    getInfluence() {
      return { ...this.influence };
    },
    
    // ===== EQUALIZER CONTROL =====
    
    setEQGain(band, value) {
      if (this.equalizer[band]) {
        this.equalizer[band].gain = Math.max(0, Math.min(2, value));
      }
    },
    
    setMasterGain(value) {
      this.equalizer.master = Math.max(0, Math.min(2, value));
    },
    
    // ===== EVENT HANDLERS =====
    
    onAudioEnded() {
      this.isPlaying = false;
      if (CHEMVENTUR.UI && CHEMVENTUR.UI.onAudioEnded) {
        CHEMVENTUR.UI.onAudioEnded();
      }
    },
    
    onAudioError(e) {
      console.error('Audio error:', e);
      this.isPlaying = false;
      if (CHEMVENTUR.UI && CHEMVENTUR.UI.showStatus) {
        CHEMVENTUR.UI.showStatus('⚠️ Audio load failed!');
      }
    },
    
    // ===== UTILITY =====
    
    // Get current playback time
    getCurrentTime() {
      return this.audioElement ? this.audioElement.currentTime : 0;
    },
    
    // Get total duration
    getDuration() {
      return this.audioElement ? this.audioElement.duration || 0 : 0;
    },
    
    // Seek to position (0-1)
    seek(position) {
      if (this.audioElement && this.audioElement.duration) {
        this.audioElement.currentTime = position * this.audioElement.duration;
      }
    }
  };
  
  // Initialize on load
  document.addEventListener('DOMContentLoaded', () => {
    // Delay init slightly to ensure AudioContext works
    setTimeout(() => {
      CHEMVENTUR.AudioSystem.init();
    }, 100);
  });
  
})();
