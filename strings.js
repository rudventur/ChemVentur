/* ============================================
   CHEMVENTUR v114 - STRING UNIVERSE! 🎻
   DEFINITIVE MERGED EDITION
   
   Stage 0: Build matter from vibrating strings!
   
   GUNS:
   1: Proton Stringer (6 strings → proton)
   2: Neutron Stringer (6 strings → neutron)
   3: Electron Stringer (3 strings → electron)
   4: String Rain + Zen Mode
   5: Gluon Stringer (spider web for nuclei!)
   6: String Shotgun (options!)
   7: Random Beam (constant flow while held)
   8: Anti-Stringer (broken/dead strings → rubber ball!)
   9: Knot Stringer (becomes other string after 5s)
   0: Time Stringer (independent of time, transforms others!)
   
   FEATURES:
   - SHIP DAMAGE! 🚀💥
   - STRING RUBBER BALL! (black hole + white hole hybrid!)
   - GLUON WEB CAPTURE & FUSION! 🕸️☢️
   - URANIUM-238 SYNTHESIS! ☢️
   ============================================ */

(function() {
  const Config = CHEMVENTUR.Config;
  
  // String vibration patterns
  const STRING_TYPES = {
    PROTON: { id: 1, name: 'Proton String', color: '#ff3333', frequency: 1.0, amplitude: 8, wavelength: 20, stringsNeeded: 6, creates: 'proton' },
    NEUTRON: { id: 2, name: 'Neutron String', color: '#cccccc', frequency: 0.8, amplitude: 6, wavelength: 25, stringsNeeded: 6, creates: 'neutron' },
    ELECTRON: { id: 3, name: 'Electron String', color: '#00ffff', frequency: 1.5, amplitude: 4, wavelength: 15, stringsNeeded: 3, creates: 'electron' },
    RAIN: { id: 4, name: 'Rain String', color: '#ffffff', frequency: 1.0, amplitude: 5, wavelength: 18, isRain: true },
    GLUON: { id: 5, name: 'Gluon String', color: '#ffff00', frequency: 2.0, amplitude: 10, wavelength: 12, isGluon: true, creates: 'gluon-web', lifespan: 4000 },
    SHOTGUN: { id: 6, name: 'Shotgun String', color: '#ff8800', frequency: 1.2, amplitude: 7, wavelength: 16, isShotgun: true },
    RANDOM: { id: 7, name: 'Random String', color: '#ffff00', frequency: 3.0, amplitude: 3, wavelength: 8, isRandom: true },
    DEAD: { id: 8, name: 'Dead String', color: '#444444', frequency: 0.1, amplitude: 2, wavelength: 40, isDead: true, lifespan: 5000 },
    KNOT: { id: 9, name: 'Knot String', color: '#ff00ff', frequency: 0.7, amplitude: 9, wavelength: 22, isKnot: true, transformTime: 5000 },
    TIME: { id: 0, name: 'Time String', color: '#00ffaa', frequency: 0.3, amplitude: 15, wavelength: 40, isTime: true, ignoresTime: true }
  };
  
  // Gun options for Stage 0
  const STRING_GUN_OPTIONS = {
    1: { // Proton Stringer
      speed: { value: 8, min: 3, max: 15, label: 'Speed' },
      spread: { value: 0.1, min: 0, max: 0.5, label: 'Spread' },
      burstCount: { value: 1, min: 1, max: 6, label: 'Burst' }
    },
    2: { // Neutron Stringer
      speed: { value: 7, min: 3, max: 15, label: 'Speed' },
      spread: { value: 0.1, min: 0, max: 0.5, label: 'Spread' },
      burstCount: { value: 1, min: 1, max: 6, label: 'Burst' }
    },
    3: { // Electron Stringer
      speed: { value: 10, min: 5, max: 20, label: 'Speed' },
      spread: { value: 0.2, min: 0, max: 0.8, label: 'Spread' },
      orbital: { value: false, label: 'Orbital Spin' }
    },
    4: { // Rain + Zen
      intensity: { value: 0.3, min: 0.1, max: 1.0, label: 'Intensity' },
      mixTypes: { value: true, label: 'Mix Types' },
      zenMode: { value: false, label: 'Zen (observe only)' }
    },
    5: { // Gluon Stringer
      webSize: { value: 50, min: 20, max: 100, label: 'Web Size' },
      webStrength: { value: 0.8, min: 0.3, max: 1.0, label: 'Strength' },
      sticky: { value: true, label: 'Sticky Web' }
    },
    6: { // Shotgun
      pellets: { value: 8, min: 3, max: 20, label: 'Pellets' },
      spread: { value: 0.8, min: 0.3, max: 1.5, label: 'Spread' },
      mixTypes: { value: true, label: 'Mix Types' }
    },
    7: { // Random Beam
      flowRate: { value: 5, min: 1, max: 15, label: 'Flow Rate' },
      chaos: { value: 0.5, min: 0, max: 1.0, label: 'Chaos' }
    },
    8: { // Anti-Stringer (dead strings)
      brokenTypes: { value: 3, min: 1, max: 5, label: 'Broken Pieces' },
      dustSpeed: { value: 2, min: 0.5, max: 5, label: 'Dust Speed' }
    },
    9: { // Knot Stringer
      knotComplexity: { value: 3, min: 1, max: 5, label: 'Complexity' },
      transformInto: { value: 'random', options: ['random', 'proton', 'neutron', 'electron'], label: 'Transform To' }
    },
    0: { // Time Stringer
      chaosLevel: { value: 0.5, min: 0.1, max: 1.0, label: 'Chaos' },
      transformChance: { value: 0.3, min: 0.1, max: 0.8, label: 'Transform %' }
    }
  };
  
  CHEMVENTUR.StringSystem = {
    strings: [],
    quarks: [],
    subatomicParticles: [],
    gluonWebs: [],          // Spider webs for holding nuclei!
    stringRubberBall: null, // The singularity attempt!
    
    // 🚀 SHIP DAMAGE!
    shipDamage: 0,          // 0-100, 100 = destroyed
    shipMaxDamage: 100,
    
    STRING_TYPES,
    STRING_GUN_OPTIONS,
    
    achievements: {
      firstQuark: false, firstProton: false, firstNeutron: false,
      firstElectron: false, firstHydrogen: false, URANIUM: false,
      firstRubberBall: false, shipDestroyed: false
    },
    
    // Get gun options
    getGunOptions(gunId) {
      return STRING_GUN_OPTIONS[gunId] || {};
    },
    
    setGunOption(gunId, key, value) {
      if (STRING_GUN_OPTIONS[gunId] && STRING_GUN_OPTIONS[gunId][key]) {
        STRING_GUN_OPTIONS[gunId][key].value = value;
      }
    },
    
    // Create a string particle
    createString(x, y, vx, vy, type, options = {}) {
      const stringType = typeof type === 'string' ? STRING_TYPES[type] : type;
      if (!stringType) return null;
      
      const string = {
        id: Math.random().toString(36).substr(2, 9),
        x, y, vx, vy,
        type: stringType,
        phase: Math.random() * Math.PI * 2,
        age: 0,
        createTime: Date.now(),
        frequency: stringType.frequency + (Math.random() - 0.5) * 0.2,
        amplitude: stringType.amplitude,
        wavelength: stringType.wavelength,
        length: 30 + Math.random() * 20,
        points: [],
        color: stringType.color,
        // Special flags
        isKnot: stringType.isKnot || false,
        isTime: stringType.isTime || false,
        isDead: stringType.isDead || false,
        ignoresTime: stringType.ignoresTime || false,
        lifespan: stringType.lifespan || null,
        transformTime: stringType.transformTime || null,
        // Knot specific
        knotType: options.knotType || (stringType.isKnot ? ['trefoil', 'figure8', 'cinquefoil'][Math.floor(Math.random() * 3)] : null)
      };
      
      this.updateStringPoints(string);
      return string;
    },
    
    updateStringPoints(string) {
      string.points = [];
      const segments = 20;
      const angle = Math.atan2(string.vy || 0.001, string.vx || 0.001);
      
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const baseX = string.x + Math.cos(angle) * string.length * t;
        const baseY = string.y + Math.sin(angle) * string.length * t;
        
        const perpAngle = angle + Math.PI / 2;
        let vibration;
        
        if (string.isKnot) {
          const knotPhase = string.phase + t * Math.PI * 6;
          vibration = Math.sin(knotPhase) * Math.cos(knotPhase * 0.5) * string.amplitude;
        } else if (string.isDead) {
          // Dead strings barely vibrate, they're "broken"
          vibration = Math.sin(string.phase + t * Math.PI) * string.amplitude * 0.3;
        } else {
          vibration = Math.sin(string.phase + t * Math.PI * 2 * string.frequency) 
                     * string.amplitude 
                     * Math.sin(t * Math.PI);
        }
        
        string.points.push({
          x: baseX + Math.cos(perpAngle) * vibration,
          y: baseY + Math.sin(perpAngle) * vibration
        });
      }
    },
    
    // Fire strings based on gun
    fireString(shipX, shipY, gunId, aimAngle, isHeld = false) {
      const opts = STRING_GUN_OPTIONS[gunId] || {};
      
      switch(gunId) {
        case 1: return this.fireProtonString(shipX, shipY, aimAngle, opts);
        case 2: return this.fireNeutronString(shipX, shipY, aimAngle, opts);
        case 3: return this.fireElectronString(shipX, shipY, aimAngle, opts);
        case 4: return this.handleRainGun(opts);
        case 5: return this.fireGluonWeb(shipX, shipY, aimAngle, opts);
        case 6: return this.fireShotgun(shipX, shipY, aimAngle, opts);
        case 7: return this.fireRandomBeam(shipX, shipY, aimAngle, opts, isHeld);
        case 8: return this.fireDeadStrings(shipX, shipY, aimAngle, opts);
        case 9: return this.fireKnotString(shipX, shipY, aimAngle, opts);
        case 0: return this.fireTimeString(shipX, shipY, aimAngle, opts);
        default: return null;
      }
    },
    
    fireProtonString(x, y, angle, opts) {
      const speed = opts.speed?.value || 8;
      const spread = opts.spread?.value || 0.1;
      const burst = opts.burstCount?.value || 1;
      
      for (let i = 0; i < burst; i++) {
        const a = angle + (Math.random() - 0.5) * spread;
        const s = this.createString(x, y, Math.cos(a) * speed, Math.sin(a) * speed, STRING_TYPES.PROTON);
        if (s) this.strings.push(s);
      }
      return { type: 'proton', count: burst };
    },
    
    fireNeutronString(x, y, angle, opts) {
      const speed = opts.speed?.value || 7;
      const spread = opts.spread?.value || 0.1;
      const burst = opts.burstCount?.value || 1;
      
      for (let i = 0; i < burst; i++) {
        const a = angle + (Math.random() - 0.5) * spread;
        const s = this.createString(x, y, Math.cos(a) * speed, Math.sin(a) * speed, STRING_TYPES.NEUTRON);
        if (s) this.strings.push(s);
      }
      return { type: 'neutron', count: burst };
    },
    
    fireElectronString(x, y, angle, opts) {
      const speed = opts.speed?.value || 10;
      const spread = opts.spread?.value || 0.2;
      
      const a = angle + (Math.random() - 0.5) * spread;
      const s = this.createString(x, y, Math.cos(a) * speed, Math.sin(a) * speed, STRING_TYPES.ELECTRON);
      if (s) {
        if (opts.orbital?.value) {
          s.orbitalSpin = true;
        }
        this.strings.push(s);
      }
      return { type: 'electron' };
    },
    
    handleRainGun(opts) {
      if (opts.zenMode?.value) {
        return { type: 'zen', message: '☯ Observing...' };
      }
      // Rain is handled in update()
      return { type: 'rain-toggle' };
    },
    
    fireGluonWeb(x, y, angle, opts) {
      const size = opts.webSize?.value || 50;
      const strength = opts.webStrength?.value || 0.8;
      const sticky = opts.sticky?.value !== false;
      
      const web = {
        id: Math.random().toString(36).substr(2, 9),
        x: x + Math.cos(angle) * 50,
        y: y + Math.sin(angle) * 50,
        size,
        strength,
        sticky,
        strings: [], // Connected strings
        age: 0,
        color: '#ffff00', // Yellow gluon webs!
        capturedParticles: [] // Particles captured for fusion
      };
      
      this.gluonWebs.push(web);
      return { type: 'gluon-web', web };
    },
    
    fireShotgun(x, y, angle, opts) {
      const pellets = opts.pellets?.value || 8;
      const spread = opts.spread?.value || 0.8;
      const mixTypes = opts.mixTypes?.value !== false;
      
      const types = mixTypes 
        ? [STRING_TYPES.PROTON, STRING_TYPES.NEUTRON, STRING_TYPES.ELECTRON, STRING_TYPES.RANDOM]
        : [STRING_TYPES.RANDOM];
      
      for (let i = 0; i < pellets; i++) {
        const a = angle + (Math.random() - 0.5) * spread;
        const speed = 6 + Math.random() * 6;
        const type = types[Math.floor(Math.random() * types.length)];
        const s = this.createString(x, y, Math.cos(a) * speed, Math.sin(a) * speed, type);
        if (s) this.strings.push(s);
      }
      return { type: 'shotgun', count: pellets };
    },
    
    fireRandomBeam(x, y, angle, opts, isHeld) {
      if (!isHeld) return null;
      
      const flowRate = opts.flowRate?.value || 5;
      const chaos = opts.chaos?.value || 0.5;
      
      // Fire multiple per frame when held
      for (let i = 0; i < flowRate; i++) {
        const a = angle + (Math.random() - 0.5) * chaos * 2;
        const speed = 5 + Math.random() * 10;
        const types = [STRING_TYPES.PROTON, STRING_TYPES.NEUTRON, STRING_TYPES.ELECTRON];
        const type = types[Math.floor(Math.random() * types.length)];
        const s = this.createString(
          x + (Math.random() - 0.5) * 20, 
          y + (Math.random() - 0.5) * 20, 
          Math.cos(a) * speed, Math.sin(a) * speed, type
        );
        if (s) this.strings.push(s);
      }
      return { type: 'beam', flowing: true };
    },
    
    fireDeadStrings(x, y, angle, opts) {
      const pieces = opts.brokenTypes?.value || 3;
      const dustSpeed = opts.dustSpeed?.value || 2;
      
      for (let i = 0; i < pieces; i++) {
        const a = angle + (Math.random() - 0.5) * 1.5;
        const speed = dustSpeed * (0.5 + Math.random());
        const s = this.createString(x, y, Math.cos(a) * speed, Math.sin(a) * speed, STRING_TYPES.DEAD);
        if (s) {
          s.deathTime = Date.now() + 5000; // Dies in 5 seconds
          this.strings.push(s);
        }
      }
      return { type: 'dead', count: pieces };
    },
    
    fireKnotString(x, y, angle, opts) {
      const speed = 6;
      const s = this.createString(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, STRING_TYPES.KNOT, {
        knotType: ['trefoil', 'figure8', 'cinquefoil'][Math.floor(Math.random() * 3)]
      });
      if (s) {
        s.transformTime = Date.now() + 5000; // Transforms in 5 seconds
        s.transformInto = opts.transformInto?.value || 'random';
        this.strings.push(s);
      }
      return { type: 'knot' };
    },
    
    fireTimeString(x, y, angle, opts) {
      const chaos = opts.chaosLevel?.value || 0.5;
      
      // Time strings move randomly, ignore game time!
      const s = this.createString(x, y, 
        (Math.random() - 0.5) * 10 * chaos,
        (Math.random() - 0.5) * 10 * chaos,
        STRING_TYPES.TIME
      );
      if (s) {
        s.transformChance = opts.transformChance?.value || 0.3;
        this.strings.push(s);
      }
      return { type: 'time' };
    },
    
    // Main update loop
    update(width, height, timeScale) {
      const now = Date.now();
      
      // Update strings
      for (let i = this.strings.length - 1; i >= 0; i--) {
        const s = this.strings[i];
        
        // Time strings IGNORE time scale!
        const effectiveTs = s.ignoresTime ? 1 : (timeScale || 1);
        if (effectiveTs === 0 && !s.ignoresTime) continue;
        
        // Check lifespan (yellow/gluon strings expire after 4 seconds)
        if (s.type.lifespan && (now - s.createTime) > s.type.lifespan) {
          this.strings.splice(i, 1);
          continue;
        }
        
        // Update position
        s.x += s.vx * effectiveTs;
        s.y += s.vy * effectiveTs;
        
        // Time strings have random velocity changes
        if (s.isTime) {
          s.vx += (Math.random() - 0.5) * 0.5;
          s.vy += (Math.random() - 0.5) * 0.5;
          // Clamp speed
          const speed = Math.hypot(s.vx, s.vy);
          if (speed > 8) {
            s.vx = (s.vx / speed) * 8;
            s.vy = (s.vy / speed) * 8;
          }
        }
        
        // Update vibration phase
        s.phase += s.frequency * 0.15 * effectiveTs;
        s.age += Math.abs(effectiveTs) * 16;
        
        this.updateStringPoints(s);
        
        // Boundary check
        if (s.x < -50 || s.x > width + 50 || s.y < -50 || s.y > height + 50) {
          this.strings.splice(i, 1);
          continue;
        }
        
        // Knot transformation after 5 seconds
        if (s.isKnot && s.transformTime && now > s.transformTime) {
          this.transformKnot(s, i);
          continue;
        }
        
        // Dead strings float to rubber ball then die
        if (s.isDead) {
          this.handleDeadString(s, i, width, height, now);
          continue;
        }
        
        // Time strings transform other strings they touch
        if (s.isTime) {
          this.checkTimeStringTransform(s);
        }
      }
      
      // Update rubber ball
      this.updateRubberBall(width, height, timeScale);
      
      // Update gluon webs
      this.updateGluonWebs(timeScale);
      
      // Check string combinations
      this.checkStringCombinations();
      this.checkQuarkCombinations();
      
      // Ship collision with strings
      this.checkShipCollisions(width, height);
    },
    
    transformKnot(s, index) {
      const transformTo = s.transformInto || 'random';
      let newType;
      
      if (transformTo === 'random') {
        const types = [STRING_TYPES.PROTON, STRING_TYPES.NEUTRON, STRING_TYPES.ELECTRON];
        newType = types[Math.floor(Math.random() * types.length)];
      } else {
        newType = STRING_TYPES[transformTo.toUpperCase()] || STRING_TYPES.PROTON;
      }
      
      // Replace with new string type
      const newS = this.createString(s.x, s.y, s.vx, s.vy, newType);
      if (newS) {
        this.strings[index] = newS;
        CHEMVENTUR.UI?.showStatus(`🔮 Knot → ${newType.name}!`);
      }
    },
    
    handleDeadString(s, index, width, height, now) {
      // Dead strings float toward rubber ball or center
      const targetX = this.stringRubberBall ? this.stringRubberBall.x : width / 2;
      const targetY = this.stringRubberBall ? this.stringRubberBall.y : height / 2;
      
      const dx = targetX - s.x;
      const dy = targetY - s.y;
      const dist = Math.hypot(dx, dy);
      
      if (dist > 5) {
        s.vx += (dx / dist) * 0.1;
        s.vy += (dy / dist) * 0.1;
        // Slow down
        s.vx *= 0.98;
        s.vy *= 0.98;
      }
      
      // After 5 seconds, add to rubber ball
      if (s.deathTime && now > s.deathTime) {
        this.addToRubberBall(s, width, height);
        this.strings.splice(index, 1);
      }
    },
    
    addToRubberBall(s, width, height) {
      if (!this.stringRubberBall) {
        // Create the rubber ball!
        this.stringRubberBall = {
          x: width / 2,
          y: height / 2,
          mass: 1,
          radius: 15,
          absorbedStrings: 0,
          emitTimer: 0,
          color: '#8800ff'
        };
        
        if (!this.achievements.firstRubberBall) {
          this.achievements.firstRubberBall = true;
          this.showAchievement('🟣 STRING RUBBER BALL!', 'Dead strings formed a singularity attempt!');
        }
      }
      
      this.stringRubberBall.mass += 0.5;
      this.stringRubberBall.radius = 15 + Math.sqrt(this.stringRubberBall.mass) * 3;
      this.stringRubberBall.absorbedStrings++;
    },
    
    updateRubberBall(width, height, timeScale) {
      const ball = this.stringRubberBall;
      if (!ball) return;
      
      // Attract nearby strings (like black hole)
      this.strings.forEach(s => {
        if (s.isDead) return; // Dead strings already handled
        
        const dx = ball.x - s.x;
        const dy = ball.y - s.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < ball.radius * 3 && dist > ball.radius) {
          const force = ball.mass * 0.01 / (dist * dist) * 100;
          s.vx += (dx / dist) * force;
          s.vy += (dy / dist) * force;
        }
        
        // Absorb if too close
        if (dist < ball.radius) {
          ball.mass += 0.3;
          ball.radius = 15 + Math.sqrt(ball.mass) * 3;
          ball.absorbedStrings++;
          const idx = this.strings.indexOf(s);
          if (idx >= 0) this.strings.splice(idx, 1);
        }
      });
      
      // Occasionally emit a string (like white hole)
      ball.emitTimer += timeScale;
      if (ball.emitTimer > 60 && ball.mass > 5 && Math.random() < 0.02) {
        ball.emitTimer = 0;
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 5;
        const types = [STRING_TYPES.PROTON, STRING_TYPES.NEUTRON, STRING_TYPES.ELECTRON];
        const type = types[Math.floor(Math.random() * types.length)];
        
        const s = this.createString(
          ball.x + Math.cos(angle) * ball.radius,
          ball.y + Math.sin(angle) * ball.radius,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          type
        );
        if (s) {
          this.strings.push(s);
          ball.mass -= 0.5;
          if (ball.mass < 1) ball.mass = 1;
          ball.radius = 15 + Math.sqrt(ball.mass) * 3;
        }
      }
    },
    
    checkTimeStringTransform(timeString) {
      const transformChance = timeString.transformChance || 0.3;
      
      this.strings.forEach(s => {
        if (s === timeString || s.isTime) return;
        
        const dist = Math.hypot(s.x - timeString.x, s.y - timeString.y);
        if (dist < 30 && Math.random() < transformChance * 0.01) {
          // Transform into random type!
          const types = [STRING_TYPES.PROTON, STRING_TYPES.NEUTRON, STRING_TYPES.ELECTRON];
          const newType = types[Math.floor(Math.random() * types.length)];
          s.type = newType;
          s.color = newType.color;
          s.frequency = newType.frequency;
          s.amplitude = newType.amplitude;
          CHEMVENTUR.UI?.showStatus(`⏰ Time transformed a string!`);
        }
      });
    },
    
    updateGluonWebs(timeScale) {
      for (let i = this.gluonWebs.length - 1; i >= 0; i--) {
        const web = this.gluonWebs[i];
        web.age += timeScale;
        
        // Webs last for 30 seconds
        if (web.age > 1800) {
          this.gluonWebs.splice(i, 1);
          continue;
        }
        
        // Initialize captured particles array if needed
        if (!web.capturedParticles) web.capturedParticles = [];
        
        // Attract strings to web
        if (web.sticky) {
          this.strings.forEach(s => {
            const dx = web.x - s.x;
            const dy = web.y - s.y;
            const dist = Math.hypot(dx, dy);
            
            if (dist < web.size && dist > 5) {
              const force = web.strength * 0.05;
              s.vx += (dx / dist) * force;
              s.vy += (dy / dist) * force;
            }
          });
          
          // Attract and capture subatomic particles!
          this.subatomicParticles.forEach(p => {
            const dx = web.x - p.x;
            const dy = web.y - p.y;
            const dist = Math.hypot(dx, dy);
            
            if (dist < web.size) {
              // Strong attraction toward center
              const force = web.strength * 0.1;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
              p.vx *= 0.95; // Dampen for capture
              p.vy *= 0.95;
              
              // Mark as captured if very close
              if (dist < web.size * 0.3 && !web.capturedParticles.includes(p.id)) {
                web.capturedParticles.push(p.id);
              }
            }
          });
        }
        
        // Check if we can form a nucleus (URANIUM TARGET!)
        this.checkWebFusion(web);
      }
      
      // Connect nearby webs to form larger capture areas
      this.connectNearbyWebs();
    },
    
    // Connect nearby gluon webs
    connectNearbyWebs() {
      for (let i = 0; i < this.gluonWebs.length; i++) {
        for (let j = i + 1; j < this.gluonWebs.length; j++) {
          const w1 = this.gluonWebs[i];
          const w2 = this.gluonWebs[j];
          const dist = Math.hypot(w1.x - w2.x, w1.y - w2.y);
          
          // If webs overlap, share captured particles
          if (dist < w1.size + w2.size) {
            // Merge captured particle lists (but keep tracking separately)
            w1.connected = w1.connected || [];
            w2.connected = w2.connected || [];
            if (!w1.connected.includes(w2.id)) w1.connected.push(w2.id);
            if (!w2.connected.includes(w1.id)) w2.connected.push(w1.id);
          }
        }
      }
    },
    
    // Check if web has captured enough particles to fuse into Uranium
    checkWebFusion(web) {
      // Count captured particles by type
      const captured = {
        proton: this.subatomicParticles.filter(p => 
          p.type === 'proton' && web.capturedParticles.includes(p.id)
        ),
        neutron: this.subatomicParticles.filter(p => 
          p.type === 'neutron' && web.capturedParticles.includes(p.id)
        ),
        electron: this.subatomicParticles.filter(p => 
          p.type === 'electron' && web.capturedParticles.includes(p.id)
        )
      };
      
      // Also count from connected webs
      if (web.connected) {
        web.connected.forEach(connectedId => {
          const connectedWeb = this.gluonWebs.find(w => w.id === connectedId);
          if (connectedWeb && connectedWeb.capturedParticles) {
            this.subatomicParticles.forEach(p => {
              if (connectedWeb.capturedParticles.includes(p.id)) {
                if (p.type === 'proton' && !captured.proton.includes(p)) captured.proton.push(p);
                if (p.type === 'neutron' && !captured.neutron.includes(p)) captured.neutron.push(p);
                if (p.type === 'electron' && !captured.electron.includes(p)) captured.electron.push(p);
              }
            });
          }
        });
      }
      
      const pCount = captured.proton.length;
      const nCount = captured.neutron.length;
      const eCount = captured.electron.length;
      
      // ☢️ URANIUM: p=92, n=146, e=92
      if (pCount >= 92 && nCount >= 146 && eCount >= 92) {
        this.fuseToUranium(web, captured);
        return;
      }
      
      // Show progress message occasionally
      if (pCount >= 10 && web.age % 60 < 2) {
        const progress = Math.min(100, Math.floor((pCount / 92) * 100));
        CHEMVENTUR.UI?.showStatus(`☢️ Fusing... ${pCount}p/${nCount}n/${eCount}e (${progress}% to U)`);
      }
      
      // Auto-fuse smaller atoms as stepping stones
      this.tryAutoFuseAtoms(web, captured);
    },
    
    // Try to auto-fuse captured particles into intermediate atoms
    tryAutoFuseAtoms(web, captured) {
      const pCount = captured.proton.length;
      const nCount = captured.neutron.length;
      const eCount = captured.electron.length;
      
      // Need at least 2 protons to make Helium
      if (pCount >= 2 && nCount >= 2 && eCount >= 2) {
        // Fuse 2p + 2n + 2e into Helium
        const toRemove = {
          proton: captured.proton.slice(0, 2),
          neutron: captured.neutron.slice(0, 2),
          electron: captured.electron.slice(0, 2)
        };
        
        // Only fuse if particles are close together
        const allParticles = [...toRemove.proton, ...toRemove.neutron, ...toRemove.electron];
        const avgX = allParticles.reduce((s, p) => s + p.x, 0) / allParticles.length;
        const avgY = allParticles.reduce((s, p) => s + p.y, 0) / allParticles.length;
        
        const maxDist = Math.max(...allParticles.map(p => Math.hypot(p.x - avgX, p.y - avgY)));
        
        // Only fuse if particles are within 40px of each other
        if (maxDist < 40) {
          // Remove the particles
          allParticles.forEach(p => {
            const idx = this.subatomicParticles.indexOf(p);
            if (idx >= 0) this.subatomicParticles.splice(idx, 1);
            // Remove from web's captured list
            const capIdx = web.capturedParticles.indexOf(p.id);
            if (capIdx >= 0) web.capturedParticles.splice(capIdx, 1);
          });
          
          // Create Helium atom
          const atom = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'atom',
            Z: 2, // Helium
            p: 2, n: 2, e: 2,
            x: avgX, y: avgY,
            vx: 0, vy: 0,
            color: '#ffcc00',
            size: 15,
            fromFusion: true,
            inWeb: web.id
          };
          
          // Add as a special nucleus particle
          this.subatomicParticles.push(atom);
          web.capturedParticles.push(atom.id);
          
          CHEMVENTUR.UI?.showStatus(`⚛️ He formed in gluon web!`);
          
          if (!this.achievements.firstHelium) {
            this.achievements.firstHelium = true;
            this.showAchievement('⚛️ First HELIUM!', 'Fused from strings in a gluon web!');
          }
        }
      }
    },
    
    // FUSE TO URANIUM!
    fuseToUranium(web, captured) {
      // Calculate center position
      const allParticles = [...captured.proton.slice(0, 92), 
                           ...captured.neutron.slice(0, 146), 
                           ...captured.electron.slice(0, 92)];
      
      const avgX = allParticles.reduce((s, p) => s + p.x, 0) / allParticles.length;
      const avgY = allParticles.reduce((s, p) => s + p.y, 0) / allParticles.length;
      
      // Remove the particles used
      allParticles.forEach(p => {
        const idx = this.subatomicParticles.indexOf(p);
        if (idx >= 0) this.subatomicParticles.splice(idx, 1);
      });
      
      // Create the URANIUM atom!
      const uranium = {
        id: 'URANIUM-' + Date.now(),
        type: 'uranium',
        Z: 92,
        p: 92, n: 146, e: 92,
        x: avgX, y: avgY,
        vx: 0, vy: 0,
        color: '#00ff00',
        size: 50,
        glow: true,
        fromStrings: true,
        mass: 238
      };
      
      this.subatomicParticles.push(uranium);
      
      // Achievement!
      if (!this.achievements.URANIUM) {
        this.achievements.URANIUM = true;
        this.showAchievement(
          '☢️ URANIUM ACHIEVED! ☢️',
          `Built URANIUM from vibrating strings!\n92 protons + 146 neutrons + 92 electrons\nTHE DREAM SINCE OCTOBER! THE DREAM SINCE BIRTH!`,
          true
        );
      }
      
      CHEMVENTUR.UI?.showStatus('☢️ URANIUM-238 SYNTHESIZED!', 5000);
      
      // Clear the web that was used
      const webIdx = this.gluonWebs.indexOf(web);
      if (webIdx >= 0) this.gluonWebs.splice(webIdx, 1);
    },
    
    // 🚀 SHIP DAMAGE!
    checkShipCollisions(width, height) {
      const ship = CHEMVENTUR.Game?.ship;
      if (!ship) return;
      
      // Rubber ball damages ship!
      if (this.stringRubberBall) {
        const ball = this.stringRubberBall;
        const dist = Math.hypot(ship.x - ball.x, ship.y - ball.y);
        if (dist < ball.radius + 15) {
          this.damageShip(5, 'Rubber ball collision!');
        }
      }
      
      // High-speed strings damage ship
      this.strings.forEach(s => {
        const dist = Math.hypot(ship.x - s.x, ship.y - s.y);
        const speed = Math.hypot(s.vx, s.vy);
        
        if (dist < 20 && speed > 12) {
          this.damageShip(1, 'High-speed string!');
        }
      });
    },
    
    damageShip(amount, reason) {
      this.shipDamage = Math.min(this.shipMaxDamage, this.shipDamage + amount);
      CHEMVENTUR.UI?.showStatus(`💥 Ship damage: ${this.shipDamage}% (${reason})`);
      
      if (this.shipDamage >= this.shipMaxDamage && !this.achievements.shipDestroyed) {
        this.achievements.shipDestroyed = true;
        this.showAchievement('💥 SHIP DESTROYED!', 'Your ship took too much damage!\nVisit the Garage to repair.', true);
      }
    },
    
    repairShip(amount) {
      this.shipDamage = Math.max(0, this.shipDamage - amount);
      CHEMVENTUR.UI?.showStatus(`🔧 Ship repaired! Damage: ${this.shipDamage}%`);
    },
    
    // Check string combinations for quarks
    checkStringCombinations() {
      const combineDistance = 25;
      
      const protonStrings = this.strings.filter(s => s.type.id === 1);
      const neutronStrings = this.strings.filter(s => s.type.id === 2);
      const electronStrings = this.strings.filter(s => s.type.id === 3);
      
      this.tryFormParticle(protonStrings, 'proton', 6, combineDistance);
      this.tryFormParticle(neutronStrings, 'neutron', 6, combineDistance);
      this.tryFormParticle(electronStrings, 'electron', 3, combineDistance);
    },
    
    tryFormParticle(strings, particleType, needed, distance) {
      if (strings.length < needed) return;
      
      for (let i = 0; i < strings.length; i++) {
        const s = strings[i];
        const nearby = strings.filter(other =>
          other !== s && Math.hypot(other.x - s.x, other.y - s.y) < distance
        );
        
        if (nearby.length >= needed - 1) {
          const cluster = [s, ...nearby.slice(0, needed - 1)];
          const cx = cluster.reduce((sum, c) => sum + c.x, 0) / cluster.length;
          const cy = cluster.reduce((sum, c) => sum + c.y, 0) / cluster.length;
          
          const particle = {
            id: Math.random().toString(36).substr(2, 9),
            type: particleType,
            x: cx, y: cy,
            vx: cluster.reduce((sum, c) => sum + c.vx, 0) / cluster.length * 0.3,
            vy: cluster.reduce((sum, c) => sum + c.vy, 0) / cluster.length * 0.3,
            color: particleType === 'proton' ? '#ff3333' : particleType === 'neutron' ? '#cccccc' : '#00ffff',
            size: particleType === 'electron' ? 5 : 10,
            charge: particleType === 'proton' ? 1 : particleType === 'electron' ? -1 : 0,
            age: 0,
            fromStrings: true
          };
          
          this.subatomicParticles.push(particle);
          
          cluster.forEach(c => {
            const idx = this.strings.indexOf(c);
            if (idx >= 0) this.strings.splice(idx, 1);
          });
          
          const achievementKey = 'first' + particleType.charAt(0).toUpperCase() + particleType.slice(1);
          if (!this.achievements[achievementKey]) {
            this.achievements[achievementKey] = true;
            const emoji = particleType === 'proton' ? '🔴' : particleType === 'neutron' ? '⚪' : '🔵';
            this.showAchievement(`${emoji} First ${particleType.toUpperCase()}!`, `Built from ${needed} strings!`);
          }
          
          CHEMVENTUR.UI?.showStatus(`✨ ${particleType.toUpperCase()} formed from strings!`);
          return;
        }
      }
    },
    
    checkQuarkCombinations() {
      // Simplified: subatomic particles can combine into nuclei near gluon webs
      // (Full implementation would track quarks separately)
    },
    
    // Get a random string type for rain
    getRandomStringType() {
      const types = [STRING_TYPES.PROTON, STRING_TYPES.NEUTRON, STRING_TYPES.ELECTRON];
      return types[Math.floor(Math.random() * types.length)];
    },
    
    // Check for URANIUM achievement
    checkUraniumAchievement() {
      const protons = this.subatomicParticles.filter(p => p.type === 'proton').length;
      const neutrons = this.subatomicParticles.filter(p => p.type === 'neutron').length;
      const electrons = this.subatomicParticles.filter(p => p.type === 'electron').length;
      
      if (protons >= 92 && neutrons >= 146 && electrons >= 92 && !this.achievements.URANIUM) {
        this.achievements.URANIUM = true;
        this.showAchievement(
          '☢️ URANIUM ACHIEVEMENT! ☢️',
          'You built URANIUM from vibrating strings!\nTHE DREAM SINCE OCTOBER! THE DREAM SINCE BIRTH!',
          true
        );
        return true;
      }
      return false;
    },
    
    showAchievement(title, description, isBig = false) {
      let overlay = document.getElementById('achievement-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'achievement-overlay';
        overlay.style.cssText = `position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:9999;`;
        document.body.appendChild(overlay);
      }
      
      overlay.innerHTML = `
        <div style="background:linear-gradient(135deg,#001100,#002200);border:${isBig?'4px':'3px'} solid ${isBig?'#ffff00':'#00ff41'};border-radius:15px;padding:${isBig?'40px':'25px'};text-align:center;max-width:500px;box-shadow:0 0 ${isBig?'60px':'30px'} ${isBig?'#ffff00':'#00ff41'};">
          <h2 style="color:${isBig?'#ffff00':'#00ff41'};font-size:${isBig?'28px':'20px'};margin:0 0 15px 0;text-shadow:0 0 20px currentColor;">${title}</h2>
          <p style="color:#fff;font-size:${isBig?'16px':'14px'};margin:0 0 20px 0;white-space:pre-line;">${description}</p>
          <button onclick="document.getElementById('achievement-overlay').style.display='none'" style="background:${isBig?'#ffff00':'#00ff41'};color:#000;border:none;padding:12px 30px;font-size:16px;font-weight:bold;cursor:pointer;border-radius:8px;font-family:monospace;">CONTINUE ▶</button>
        </div>`;
      overlay.style.display = 'flex';
    },
    
    transferToStage1() {
      const Game = CHEMVENTUR.Game;
      const Particles = CHEMVENTUR.Particles;
      
      this.subatomicParticles.forEach(p => {
        let particle;
        if (p.type === 'proton') particle = Particles.createProton(p.x, p.y, p.vx, p.vy);
        else if (p.type === 'neutron') particle = Particles.createNeutron(p.x, p.y, p.vx, p.vy);
        else if (p.type === 'electron') particle = Particles.createElectron(p.x, p.y, p.vx, p.vy);
        
        if (particle) {
          particle.fromStrings = true;
          Game.atoms.push(particle);
        }
      });
      
      this.subatomicParticles = [];
      this.quarks = [];
      this.strings = [];
      this.gluonWebs = [];
      // Keep rubber ball and ship damage!
      
      CHEMVENTUR.UI?.showStatus('🚀 Particles transferred to Stage 1!');
    },
    
    draw(ctx) {
      // Draw gluon webs first (background)
      this.gluonWebs.forEach(web => this.drawGluonWeb(ctx, web));
      
      // Draw rubber ball
      if (this.stringRubberBall) this.drawRubberBall(ctx);
      
      // Draw strings
      this.strings.forEach(s => this.drawString(ctx, s));
      
      // Draw subatomic particles
      this.subatomicParticles.forEach(p => this.drawSubatomicParticle(ctx, p));
    },
    
    drawString(ctx, s) {
      if (s.points.length < 2) return;
      
      ctx.save();
      ctx.shadowColor = s.color;
      ctx.shadowBlur = s.isDead ? 3 : 10;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.isDead ? 1 : 2;
      
      if (s.isDead) ctx.setLineDash([3, 3]);
      
      ctx.beginPath();
      ctx.moveTo(s.points[0].x, s.points[0].y);
      for (let i = 1; i < s.points.length; i++) {
        ctx.lineTo(s.points[i].x, s.points[i].y);
      }
      ctx.stroke();
      
      // Knot marker
      if (s.isKnot) {
        const mid = s.points[Math.floor(s.points.length / 2)];
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(mid.x, mid.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Time string marker
      if (s.isTime) {
        const mid = s.points[Math.floor(s.points.length / 2)];
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(mid.x, mid.y, 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = '8px monospace';
        ctx.fillText('⏰', mid.x - 5, mid.y + 3);
      }
      
      ctx.restore();
    },
    
    drawGluonWeb(ctx, web) {
      ctx.save();
      ctx.strokeStyle = web.color; // Yellow!
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.6;
      
      // Draw spider web pattern
      const segments = 8;
      const rings = 4;
      
      // Pulsing effect based on captured particles
      const capturedCount = web.capturedParticles?.length || 0;
      const pulse = 1 + Math.sin(Date.now() * 0.003) * 0.1 * Math.min(capturedCount / 10, 1);
      
      for (let r = 1; r <= rings; r++) {
        const radius = (web.size / rings) * r * pulse;
        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const x = web.x + Math.cos(angle) * radius;
          const y = web.y + Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      
      // Radial lines
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(web.x, web.y);
        ctx.lineTo(web.x + Math.cos(angle) * web.size * pulse, web.y + Math.sin(angle) * web.size * pulse);
        ctx.stroke();
      }
      
      // Draw connections to other webs
      if (web.connected && web.connected.length > 0) {
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 10]);
        
        web.connected.forEach(connId => {
          const otherWeb = this.gluonWebs.find(w => w.id === connId);
          if (otherWeb) {
            ctx.beginPath();
            ctx.moveTo(web.x, web.y);
            ctx.lineTo(otherWeb.x, otherWeb.y);
            ctx.stroke();
          }
        });
        ctx.setLineDash([]);
      }
      
      // Center glow based on captured particles
      if (capturedCount > 0) {
        const glowGrad = ctx.createRadialGradient(web.x, web.y, 0, web.x, web.y, 20);
        glowGrad.addColorStop(0, `rgba(255, 255, 0, ${Math.min(0.8, capturedCount * 0.05)})`);
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(web.x, web.y, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Particle count label
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#fff';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(capturedCount.toString(), web.x, web.y + 4);
      }
      
      ctx.restore();
    },
    
    drawRubberBall(ctx) {
      const ball = this.stringRubberBall;
      ctx.save();
      
      // Outer glow (white hole aspect)
      const outerGrad = ctx.createRadialGradient(ball.x, ball.y, ball.radius * 0.5, ball.x, ball.y, ball.radius * 2);
      outerGrad.addColorStop(0, 'transparent');
      outerGrad.addColorStop(0.5, 'rgba(136, 0, 255, 0.3)');
      outerGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = outerGrad;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Inner darkness (black hole aspect)
      const innerGrad = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ball.radius);
      innerGrad.addColorStop(0, '#000');
      innerGrad.addColorStop(0.7, '#220044');
      innerGrad.addColorStop(1, '#8800ff');
      ctx.fillStyle = innerGrad;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Label
      ctx.fillStyle = '#fff';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`🟣${ball.absorbedStrings}`, ball.x, ball.y + ball.radius + 15);
      
      ctx.restore();
    },
    
    drawSubatomicParticle(ctx, p) {
      ctx.save();
      
      // Special rendering for URANIUM!
      if (p.type === 'uranium') {
        // Massive glowing uranium
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 40;
        
        // Outer glow
        const outerGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 1.5);
        outerGrad.addColorStop(0, 'rgba(0, 255, 65, 0.8)');
        outerGrad.addColorStop(0.5, 'rgba(255, 255, 0, 0.4)');
        outerGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = outerGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Core
        const coreGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(0.3, '#00ff41');
        coreGrad.addColorStop(0.6, '#008800');
        coreGrad.addColorStop(1, '#004400');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Label
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('☢️ U', p.x, p.y + 5);
        ctx.font = '10px monospace';
        ctx.fillText('238', p.x, p.y + 18);
        
        ctx.restore();
        return;
      }
      
      // Fused atom rendering
      if (p.type === 'atom' && p.Z) {
        const symbols = { 2: 'He', 3: 'Li', 4: 'Be', 5: 'B', 6: 'C', 7: 'N', 8: 'O' };
        const colors = { 2: '#ffcc00', 3: '#ff6666', 4: '#88ff88', 5: '#ff88ff', 6: '#666666', 7: '#6666ff', 8: '#ff0000' };
        
        ctx.shadowColor = colors[p.Z] || '#fff';
        ctx.shadowBlur = 15;
        ctx.fillStyle = colors[p.Z] || '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(symbols[p.Z] || p.Z, p.x, p.y + 4);
        
        ctx.restore();
        return;
      }
      
      // Standard subatomic particle
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 20;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      const label = p.type === 'proton' ? 'p⁺' : p.type === 'neutron' ? 'n' : 'e⁻';
      ctx.fillText(label, p.x, p.y + 3);
      
      if (p.fromStrings) {
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + 4, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      ctx.restore();
    },
    
    getStats() {
      const protons = this.subatomicParticles.filter(p => p.type === 'proton').length;
      const neutrons = this.subatomicParticles.filter(p => p.type === 'neutron').length;
      const electrons = this.subatomicParticles.filter(p => p.type === 'electron').length;
      const atoms = this.subatomicParticles.filter(p => p.type === 'atom' || p.type === 'uranium').length;
      
      // Count quarks (3 per proton/neutron from strings)
      const upQuarks = this.strings.filter(s => s.type.id === 1).length; // Proton strings = up quarks
      const downQuarks = this.strings.filter(s => s.type.id === 2).length; // Neutron strings = down quarks
      
      // Calculate uranium progress
      const uraniumProgress = Math.min(100, Math.floor(
        ((Math.min(protons, 92) / 92) * 40 + 
         (Math.min(neutrons, 146) / 146) * 40 + 
         (Math.min(electrons, 92) / 92) * 20)
      ));
      
      // Count captured particles in webs
      let capturedTotal = 0;
      this.gluonWebs.forEach(web => {
        capturedTotal += (web.capturedParticles?.length || 0);
      });
      
      return {
        strings: this.strings.length,
        quarks: upQuarks + downQuarks,
        upQuarks,
        downQuarks,
        protons,
        neutrons,
        electrons,
        atoms,
        gluonWebs: this.gluonWebs.length,
        capturedInWebs: capturedTotal,
        rubberBallMass: this.stringRubberBall?.mass || 0,
        shipDamage: this.shipDamage,
        uraniumProgress,
        hasUranium: this.achievements.URANIUM
      };
    },
    
    clear() {
      this.strings = [];
      this.quarks = [];
      this.subatomicParticles = [];
      this.gluonWebs = [];
      this.stringRubberBall = null;
      // Don't reset ship damage on clear
    }
  };
  
  console.log('🎻 String System v112 loaded! Ship damage + Rubber ball + All guns!');
})();
