/* ============================================
   CHEMVENTUR v106 - AUDIO
   Sound effects and audio management
   ============================================ */

(function() {
  const Config = CHEMVENTUR.Config.AUDIO;
  
  CHEMVENTUR.Audio = {
    ctx: null,
    enabled: true,
    
    init() {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = Config.ENABLED;
      } catch (e) {
        console.warn('Audio not available:', e);
        this.enabled = false;
      }
    },
    
    resume() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    },
    
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
    
    shoot() { this.boop(600, 0.1); },
    gunSelect(gunId) { this.boop(440 + gunId * 50, 0.08); },
    fusion(newZ) { this.boop(800 + newZ * 5, 0.15, 'sine'); },
    nucleusFormed() { this.boop(700, 0.15); },
    electronCaptured() { this.boop(600, 0.1); },
    annihilation() { this.boop(900, 0.3, 'sawtooth'); },
    blackHoleFormed() { this.boop(200, 0.3); },
    whiteHoleFormed() { this.boop(400, 0.3, 'sine'); },
    holeMerged() { this.boop(150, 0.4); },
    gravityOrb() { this.boop(200, 0.2, 'sine'); },
    timeZone() { this.boop(400, 0.15, 'triangle'); },
    targetAchieved() { this.boop(1000, 0.3, 'sine'); },
    click() { this.boop(500, 0.05); },
    warning() { this.boop(200, 0.2, 'sawtooth', 0.08); },
    success() { this.boop(800, 0.15, 'sine'); },
    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }
  };
  
  CHEMVENTUR.Audio.init();
})();

(function () {
  var icon = document.querySelector('link[rel="apple-touch-icon"]');
  if (icon) icon.href = 'https://rudventur.github.io/RudVentur.com/embed/apple-touch-icon.png';
  if (!document.getElementById('rxplanation-style')) {
    var style = document.createElement('style');
    style.id = 'rxplanation-style';
    style.textContent = '#rxplanation{position:fixed;z-index:500;display:none;width:280px;max-width:calc(100vw - 16px);background:#041208;color:#d8ffe4;border:2px solid #00ff41;border-radius:8px;padding:10px 12px 12px;box-shadow:0 8px 28px rgba(0,0,0,.55)}#rxplanation .rx-title{font-weight:800;color:#00ff41;margin-bottom:6px}button,.btn,.gun-btn{position:relative;z-index:2;visibility:visible;opacity:1;pointer-events:auto;flex:0 0 auto}.flex.flex-wrap,#gun-selector{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.popup-panel{left:calc(var(--panel-width) + 20px);transform:translateY(-50%);max-width:min(520px, calc(100vw - var(--panel-width) - 36px))}@media (max-width:768px){.popup-panel{left:50%;top:auto;bottom:12px;transform:translateX(-50%);width:min(92vw,420px);max-height:55vh}}';
    document.head.appendChild(style);
  }
  if (!document.querySelector('script[src="rxplanation.js"]')) {
    var script = document.createElement('script');
    script.src = 'rxplanation.js';
    document.head.appendChild(script);
  }
})();
