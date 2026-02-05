/* ============================================
   CHEMVENTUR v106 - AUDIO
   Sound effects and audio management
   ============================================ */

(function() {
  const Config = CHEMVENTUR.Config.AUDIO;
  
  CHEMVENTUR.Audio = {
    ctx: null,
    enabled: true,
    
    // Initialize audio context
    init() {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = Config.ENABLED;
      } catch (e) {
        console.warn('Audio not available:', e);
        this.enabled = false;
      }
    },
    
    // Resume audio context (needed after user interaction)
    resume() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    },
    
    // Play a simple beep/boop sound
    boop(frequency = 440, duration = 0.08, type = 'square', volume = null) {
      if (!this.enabled || !this.ctx) return;
      
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.value = frequency;
        
        gain.gain.value = volume || Config.MASTER_VOLUME;
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Silently fail
      }
    },
    
    // ===== PREDEFINED SOUNDS =====
    
    // Shoot sound
    shoot() {
      this.boop(600, 0.1);
    },
    
    // Gun select sound
    gunSelect(gunId) {
      this.boop(440 + gunId * 50, 0.08);
    },
    
    // Fusion sound
    fusion(newZ) {
      this.boop(800 + newZ * 5, 0.15, 'sine');
    },
    
    // Nucleus formation
    nucleusFormed() {
      this.boop(700, 0.15);
    },
    
    // Electron captured
    electronCaptured() {
      this.boop(600, 0.1);
    },
    
    // Annihilation (e+ e-)
    annihilation() {
      this.boop(900, 0.3, 'sawtooth');
    },
    
    // Black hole formed
    blackHoleFormed() {
      this.boop(200, 0.3);
    },
    
    // White hole formed
    whiteHoleFormed() {
      this.boop(400, 0.3, 'sine');
    },
    
    // Hole merged
    holeMerged() {
      this.boop(150, 0.4);
    },
    
    // Gravity orb launched
    gravityOrb() {
      this.boop(200, 0.2, 'sine');
    },
    
    // Time zone deployed
    timeZone() {
      this.boop(400, 0.15, 'triangle');
    },
    
    // Target achieved
    targetAchieved() {
      this.boop(1000, 0.3, 'sine');
    },
    
    // UI click
    click() {
      this.boop(500, 0.05);
    },
    
    // Error/warning
    warning() {
      this.boop(200, 0.2, 'sawtooth', 0.08);
    },
    
    // Success
    success() {
      this.boop(800, 0.15, 'sine');
    },
    
    // Toggle audio
    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }
  };
  
  // Initialize on load
  CHEMVENTUR.Audio.init();
  
})();
