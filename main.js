/* ============================================
   CHEMVENTUR v116 - CONTROL EXPANSION EDITION
   🎻 STAGE 0: STRING UNIVERSE!
   ⚛️ STAGE 1: SUBATOMIC PARTICLES!
   🧬 STAGE 2: MOLECULAR CHEMISTRY!
   
   NEW IN v116:
   - 🖱️ Right-click context menus on ALL buttons!
   - ⌨️ Ship movement: A=left, D=right, S=toggle gravity
   - ✨ Gun 8 antimatter SCRAPS atoms → resources!
   - ⬆️ 12-level upgrade system for everything!
   - 🛡️ Balanced ship damage (slower!)
   - 🎮 Multiplayer foundation ready!
   
   THE DREAM SINCE OCTOBER! THE DREAM SINCE BIRTH!
   BUILD URANIUM FROM VIBRATING STRINGS!
   ============================================ */

(function() {
  const Config = CHEMVENTUR.Config;
  const Elements = CHEMVENTUR.Elements;
  const Particles = CHEMVENTUR.Particles;
  const ParticlePhysics = CHEMVENTUR.ParticlePhysics;
  const Holes = CHEMVENTUR.Holes;
  const HolePhysics = CHEMVENTUR.HolePhysics;
  const GunSystem = CHEMVENTUR.GunSystem;
  const ProjectilePhysics = CHEMVENTUR.ProjectilePhysics;
  const PressureGrid = CHEMVENTUR.PressureGrid;
  const Renderer = CHEMVENTUR.Renderer;
  const Audio = CHEMVENTUR.Audio;
  const UI = CHEMVENTUR.UI;
  
  let AudioSystem, SoundPhysics, MolecularSystem, StringSystem;
  
  CHEMVENTUR.Game = {
    canvas: null, width: 0, height: 0,
    ship: { x: 0, y: 0, vx: 0, vy: 0, rotation: -Math.PI / 2 },
    atoms: [], blackHoles: [], whiteHoles: [],
    centralBlackHole: null, 
    centralWhiteHole: null,
    
    // ===== STAGE SYSTEM! =====
    // Stage 0 = Strings, Stage 1 = Subatomic (current), Stage 2 = Molecular (3D)
    stage: 1,
    zoomLevel: 1, // 0=zoomed.in, 1=normal, 2=zoomed.out (within each stage)
    
    // Stage descriptions
    STAGES: {
      0: { name: 'String Universe', emoji: '🎻', gridScale: 2, description: 'Build from vibrating strings!' },
      1: { name: 'Subatomic', emoji: '⚛️', gridScale: 1, description: 'Atoms, bonds, reactions' },
      2: { name: 'Molecular', emoji: '🧬', gridScale: 0.5, description: 'RDKit + PubChem 3D' }
    },
    
    // Zoom descriptions within stages
    ZOOMS: {
      0: 'zoomed.in',
      1: 'normal',
      2: 'zoomed.out'
    },
    
    // Collider modes
    colliderMode: 'NONE', // NONE, FUSION, COLLIDE, SLINGSHOT, BOND
    dragonSector: false, // Reverse-time collisions!
    COLLIDER_MODES: {
      NONE: { name: 'None', description: 'Real interactions only', color: '#888888' },
      FUSION: { name: 'Fusion', description: 'Combine nuclei at high speed', color: '#ff6600' },
      COLLIDE: { name: 'Collide', description: 'Break apart with energy release', color: '#ff0000' },
      SLINGSHOT: { name: 'Slingshot', description: 'Near-miss gravitational assist', color: '#00ffff' },
      BOND: { name: 'Bond', description: 'Form bonds aggressively', color: '#00ff41' }
    },
    edgeWhiteHorizon: null,
    projectiles: { gravityOrbs: [], timeZones: [], antigun: [] },
    timeScale: 1, timeIndex: 6,
    fusionEnabled: false, gravityMode: 1, boundaryMode: 0,
    rainActive: false, targetZ: null, inventory: [],
    mouseX: 0, mouseY: 0, dragged: null,
    isAiming: false, mouseHeld: false,
    
    init() {
      console.log('CHEMVENTUR v116 init starting... 🎮 CONTROL EXPANSION EDITION');
      AudioSystem = CHEMVENTUR.AudioSystem;
      SoundPhysics = CHEMVENTUR.SoundPhysics;
      MolecularSystem = CHEMVENTUR.MolecularSystem;
      StringSystem = CHEMVENTUR.StringSystem;
      
      this.canvas = document.getElementById('game-canvas');
      console.log('Canvas element:', this.canvas);
      
      if (!this.canvas) {
        console.error('FATAL: game-canvas not found!');
        return;
      }
      
      this.resize();
      console.log('After resize - width:', this.width, 'height:', this.height);
      
      if (this.width === 0 || this.height === 0) {
        console.error('FATAL: Canvas has zero dimensions!');
        // Force dimensions
        this.width = window.innerWidth - 360;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        console.log('Forced dimensions:', this.width, this.height);
      }
      
      Renderer.init(this.canvas);
      PressureGrid.init(this.width, this.height);
      if (SoundPhysics) SoundPhysics.init(this.width, this.height);
      
      // 🛠️ Initialize Ship Repair System!
      if (CHEMVENTUR.ShipRepair) {
        CHEMVENTUR.ShipRepair.init();
        console.log('🛠️ Ship Repair System ready!');
      }
      
      this.edgeWhiteHorizon = Holes.createEdgeHorizon();
      this.ship.x = this.width / 2;
      this.ship.y = this.height - 120;
      console.log('Ship position:', this.ship.x, this.ship.y);
      
      window.addEventListener('resize', () => this.resize());
      
      // Mouse events for ship following and aiming
      this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
      this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
      this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
      this.canvas.addEventListener('contextmenu', (e) => this.onRightClick(e));
      
      // SHIFT + Mouse Wheel = Stage change! CTRL + Wheel = Zoom!
      this.canvas.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
      
      UI.init();
      this.spawnInitialAtoms();
      console.log('Atoms spawned:', this.atoms.length, this.atoms);
      
      // Initialize enhancements (right-click menus, movement, upgrades)
      if (CHEMVENTUR.Enhancements) {
        CHEMVENTUR.Enhancements.init();
      }
      
      // Initialize multiplayer
      if (CHEMVENTUR.Multiplayer) {
        CHEMVENTUR.Multiplayer.init();
      }
      
      this.loop();
      UI.showStatus('🎮 v116 MULTIPLAYER! Create/Join rooms in top-right panel!', 5000);
      
      // Start at Stage 0 for the string universe experience!
      // this.stage = 0; // Uncomment to start at strings
    },
    
    resize() {
      const container = this.canvas.parentElement;
      console.log('Container:', container, 'clientWidth:', container?.clientWidth, 'clientHeight:', container?.clientHeight);
      this.width = container?.clientWidth || (window.innerWidth - 360);
      this.height = container?.clientHeight || window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      Renderer.resize(this.canvas);
      PressureGrid.init(this.width, this.height);
      if (SoundPhysics) SoundPhysics.initGrids(this.width, this.height);
      this.ship.y = this.height - 120;
    },
    
    spawnInitialAtoms() {
      [1, 6, 8].forEach(Z => {
        this.atoms.push(Particles.createAtom(
          100 + Math.random() * (this.width - 200),
          100 + Math.random() * 150, Z, Z, Z, { vx: 0, vy: 0 }
        ));
        this.addToInventory(Z);
      });
    },
    
    addToInventory(Z) {
      if (!this.inventory.includes(Z)) {
        this.inventory.push(Z);
        this.inventory.sort((a, b) => a - b);
      }
    },
    
    // MOUSE DOWN - Start aiming or dragging
    onMouseDown(e) {
      if (e.button === 2) return; // Right click handled separately
      
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      
      if (Audio) Audio.resume();
      if (AudioSystem?.ctx?.state === 'suspended') AudioSystem.ctx.resume();
      
      // Check if clicking on an atom to drag
      for (const atom of this.atoms) {
        const r = Particles.getRadius(atom);
        if (Math.hypot(atom.x - mx, atom.y - my) < r + 10) {
          this.dragged = atom;
          return;
        }
      }
      
      // Start aiming
      this.isAiming = true;
      this.mouseHeld = true;
      GunSystem.setAimAngle(this.ship.x, this.ship.y, mx, my);
    },
    
    // MOUSE MOVE - Update aim + Ship follows ONLY when mouse held
    onMouseMove(e) {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
      
      // When mouse HELD - ship follows cursor on BOTH axes!
      if (this.mouseHeld && !this.dragged) {
        // Ship smoothly moves toward cursor
        const dx = this.mouseX - this.ship.x;
        const dy = this.mouseY - this.ship.y;
        this.ship.x += dx * 0.12;
        this.ship.y += dy * 0.12;
        
        // Update aim angle to face cursor direction
        GunSystem.setAimAngle(this.ship.x, this.ship.y, this.mouseX, this.mouseY);
        
        // Ship rotation = aim angle
        this.ship.rotation = GunSystem.aimAngle;
      }
      // NOT held = ship stays in place, but aim still updates
      
      // Update aim angle while aiming (for visual feedback)
      if (this.isAiming) {
        GunSystem.setAimAngle(this.ship.x, this.ship.y, this.mouseX, this.mouseY);
        this.ship.rotation = GunSystem.aimAngle;
      }
    },
    
    // MOUSE UP - Fire!
    onMouseUp(e) {
      if (e.button === 2) return;
      
      this.mouseHeld = false;
      
      if (this.dragged) {
        this.dragged = null;
        return;
      }
      
      if (this.isAiming) {
        this.isAiming = false;
        
        // STAGE 0: Fire strings!
        if (this.stage === 0 && StringSystem) {
          const result = StringSystem.fireString(
            this.ship.x, this.ship.y, 
            GunSystem.currentGun, 
            GunSystem.aimAngle
          );
          if (result) {
            Audio?.shoot();
            if (result.type === 'shotgun') UI.showStatus(`🎻 ${result.count} strings!`);
            else if (result.type === 'crossed') UI.showStatus('⏳ Time strings!');
          }
        }
        // STAGE 1 & 2: Normal gun behavior
        else {
          const result = GunSystem.fire(this.ship.x, this.ship.y, this.atoms, this.projectiles);
          if (result) {
            Audio?.shoot();
            if (result.isSpeaker) UI.showStatus('🔊 Speaker Orb!');
            if (result.organic) UI.showStatus('🧬 Organic blast!');
          }
        }
      }
    },
    
    // RIGHT CLICK - Open gun options on canvas
    onRightClick(e) {
      e.preventDefault();
      const gunId = GunSystem.currentGun;
      UI.openGunOptions(gunId);
    },
    
    setTimeScale(index) {
      this.timeIndex = index;
      this.timeScale = Config.TIME_SCALES[index];
    },
    
    // ===== STAGE & ZOOM CONTROLS =====
    // SHIFT + Mouse Wheel = Change stage!
    changeStage(delta) {
      const oldStage = this.stage;
      this.stage = Math.max(0, Math.min(2, this.stage + delta));
      
      if (this.stage !== oldStage) {
        this.onStageChange(oldStage, this.stage);
      }
    },
    
    changeZoom(delta) {
      const oldZoom = this.zoomLevel;
      this.zoomLevel = Math.max(0, Math.min(2, this.zoomLevel + delta));
      
      if (this.zoomLevel !== oldZoom) {
        this.onZoomChange(oldZoom, this.zoomLevel);
      }
    },
    
    onStageChange(from, to) {
      const stageInfo = this.STAGES[to];
      UI?.showStatus(`${stageInfo.emoji} STAGE ${to}: ${stageInfo.name}`);
      
      // TRANSFER particles when leaving Stage 0!
      if (from === 0 && to === 1 && StringSystem) {
        StringSystem.transferToStage1();
        UI?.showStatus('🚀 Strings → Particles transferred!', 3000);
      }
      
      // When going BACK to Stage 0, clear strings
      if (to === 0 && StringSystem) {
        StringSystem.clear();
        UI?.showStatus('🎻 Welcome to the String Universe!', 3000);
      }
      
      // Animate in-betweener
      this.playStageTransition(from, to);
      
      // Update grid scale
      if (CHEMVENTUR.PressureGrid) {
        const scale = stageInfo.gridScale;
        CHEMVENTUR.Config.GRID.CELLS = Math.floor(12 * scale);
        CHEMVENTUR.PressureGrid.init(this.width, this.height);
      }
      
      // Update UI
      UI?.updateStageDisplay?.();
      
      console.log(`Stage changed: ${from} → ${to}`);
    },
    
    onZoomChange(from, to) {
      const zoomNames = ['zoomed.in', 'normal', 'zoomed.out'];
      UI?.showStatus(`🔍 ${zoomNames[to]}`);
      
      // Adjust rendering scale
      if (CHEMVENTUR.Renderer) {
        CHEMVENTUR.Renderer.zoomScale = [1.5, 1, 0.6][to];
      }
      
      console.log(`Zoom changed: ${zoomNames[from]} → ${zoomNames[to]}`);
    },
    
    playStageTransition(from, to) {
      // Visual transition animation
      this.isTransitioning = true;
      this.transitionProgress = 0;
      this.transitionFrom = from;
      this.transitionTo = to;
      
      // Focus on ship area during transition
      this.transitionFocusX = this.ship.x;
      this.transitionFocusY = this.ship.y;
      
      // Auto-complete transition after 1 second
      setTimeout(() => {
        this.isTransitioning = false;
      }, 1000);
    },
    
    // Handle mouse wheel with SHIFT for stage change
    onWheel(e) {
      e.preventDefault();
      
      if (e.shiftKey) {
        // SHIFT + Scroll = Change STAGE!
        const delta = e.deltaY > 0 ? 1 : -1;
        this.changeStage(delta);
      } else if (e.ctrlKey) {
        // CTRL + Scroll = Change zoom within stage
        const delta = e.deltaY > 0 ? 1 : -1;
        this.changeZoom(delta);
      }
      // Normal scroll = nothing (or could be time scale?)
    },
    
    // Collider mode cycling
    cycleColliderMode() {
      const modes = Object.keys(this.COLLIDER_MODES);
      const currentIndex = modes.indexOf(this.colliderMode);
      this.colliderMode = modes[(currentIndex + 1) % modes.length];
      
      const mode = this.COLLIDER_MODES[this.colliderMode];
      UI?.showStatus(`💥 Collider: ${mode.name}`);
      UI?.updateButtons?.();
      
      return this.colliderMode;
    },
    
    toggleRain() {
      this.rainActive = !this.rainActive;
      Config.RAIN.ENABLED = this.rainActive;
      return this.rainActive;
    },
    
    clear() {
      this.atoms = [];
      this.blackHoles = [];
      this.whiteHoles = [];
      this.centralBlackHole = null;
      this.centralWhiteHole = null;
      this.edgeWhiteHorizon = Holes.createEdgeHorizon();
      this.projectiles = { gravityOrbs: [], timeZones: [], antigun: [] };
      if (SoundPhysics) SoundPhysics.speakerOrbs = [];
    },
    
    save() {
      const data = {
        atoms: this.atoms, blackHoles: this.blackHoles, whiteHoles: this.whiteHoles,
        inventory: this.inventory,
        settings: { fusion: this.fusionEnabled, gravity: this.gravityMode, boundary: this.boundaryMode }
      };
      localStorage.setItem('chemventur_save', JSON.stringify(data));
    },
    
    load() {
      const saved = localStorage.getItem('chemventur_save');
      if (!saved) return false;
      try {
        const data = JSON.parse(saved);
        this.atoms = data.atoms || [];
        this.blackHoles = data.blackHoles || [];
        this.whiteHoles = data.whiteHoles || [];
        this.inventory = data.inventory || [];
        if (data.settings) {
          this.fusionEnabled = data.settings.fusion;
          this.gravityMode = data.settings.gravity;
          this.boundaryMode = data.settings.boundary;
        }
        return true;
      } catch (e) { return false; }
    },
    
    screenshot() {
      const link = document.createElement('a');
      link.download = `chemventur_v108_${Date.now()}.png`;
      link.href = this.canvas.toDataURL();
      link.click();
    },
    
    loop() {
      this.update();
      this.render();
      requestAnimationFrame(() => this.loop());
    },
    
    update() {
      const ts = this.timeScale;
      const zones = this.projectiles.timeZones || [];
      
      // Update audio
      if (AudioSystem) AudioSystem.update();
      if (SoundPhysics?.enabled) SoundPhysics.update(this.width, this.height, this.gravityMode, ts);
      
      // ===== STAGE 0: STRING UNIVERSE! =====
      if (this.stage === 0 && StringSystem) {
        StringSystem.update(this.width, this.height, ts);
        
        // Check for uranium achievement!
        StringSystem.checkUraniumAchievement();
        
        // CONTINUOUS FIRING when mouse held! 🔫
        if (this.mouseHeld && this.isAiming && !this.dragged) {
          // Fire continuously (throttled)
          if (!this.lastFireTime || Date.now() - this.lastFireTime > 100) {
            const result = StringSystem.fireString(
              this.ship.x, this.ship.y, 
              GunSystem.currentGun, 
              GunSystem.aimAngle,
              true // isHeld flag for beam-type guns
            );
            this.lastFireTime = Date.now();
          }
        }
        
        // String rain in Stage 0
        if (this.rainActive && ts !== 0 && Math.random() < Config.RAIN.INTENSITY) {
          const randomType = StringSystem.getRandomStringType();
          const s = StringSystem.createString(
            Math.random() * this.width, -20,
            (Math.random() - 0.5) * 3,
            3 + Math.random() * 4,
            randomType
          );
          if (s) StringSystem.strings.push(s);
        }
        
        // Skip regular particle physics in Stage 0
        // But still update ship physics
        this.updateShipPhysics(ts, zones);
        
        // Multiplayer sync
        if (CHEMVENTUR.Multiplayer?.enabled) {
          CHEMVENTUR.Multiplayer.syncPosition();
        }
        
        UI.updateStats();
        UI.updateAudioDisplay();
        return; // Skip the rest of update for Stage 0
      }
      
      // ===== STAGE 1 & 2: PARTICLE PHYSICS =====
      
      // Multiplayer sync (also for Stage 1 & 2)
      if (CHEMVENTUR.Multiplayer?.enabled) {
        CHEMVENTUR.Multiplayer.syncPosition();
      }
      
      // RAIN SYSTEM
      if (this.rainActive && ts !== 0 && Math.random() < Config.RAIN.INTENSITY) {
        const rainConfig = Config.RAIN;
        let p;
        
        if (rainConfig.INCLUDE_ATOMS && Math.random() < 0.3) {
          const Z = rainConfig.ATOM_ELEMENTS[Math.floor(Math.random() * rainConfig.ATOM_ELEMENTS.length)];
          p = Particles.createAtom(
            Math.random() * this.width, -10, Z, Z, Z,
            { vx: (Math.random() - 0.5) * rainConfig.SPREAD * 10, 
              vy: rainConfig.SPEED_MIN + Math.random() * (rainConfig.SPEED_MAX - rainConfig.SPEED_MIN) }
          );
        } else {
          const types = rainConfig.PARTICLE_TYPES;
          const type = types[Math.floor(Math.random() * types.length)];
          const fn = Particles['create' + type.charAt(0).toUpperCase() + type.slice(1)];
          p = fn(
            Math.random() * this.width, -10,
            (Math.random() - 0.5) * rainConfig.SPREAD * 10,
            rainConfig.SPEED_MIN + Math.random() * (rainConfig.SPEED_MAX - rainConfig.SPEED_MIN)
          );
        }
        this.atoms.push(p);
      }
      
      // Physics processing
      const nucleusResult = ParticlePhysics.processNucleusFormation(this.atoms);
      if (nucleusResult) {
        if (nucleusResult.type === 'nucleus') Audio?.nucleusFormed();
        else if (nucleusResult.type === 'capture') Audio?.electronCaptured();
        else if (nucleusResult.type === 'annihilation') Audio?.annihilation();
      }
      
      ParticlePhysics.processDeElectronization(this.atoms);
      
      // 🔗 MOLECULAR SYSTEM!
      if (MolecularSystem && ts !== 0) {
        // Update existing bonds (spring physics)
        MolecularSystem.updateBonds(ts);
        
        // Try to form new bonds
        const bondResult = MolecularSystem.tryFormBonds(this.atoms);
        if (bondResult) {
          UI.showStatus(`🔗 Bond formed!`);
          Audio?.bond?.();
        }
        
        // Check for chemical reactions
        const reactionCheck = MolecularSystem.checkReactions(this.atoms);
        if (reactionCheck) {
          const result = MolecularSystem.executeReaction(reactionCheck, this.atoms);
          if (result) {
            UI.showStatus(`⚗️ ${result.name}! +${result.energy}kJ`);
            Audio?.reaction?.();
          }
        }
        
        // ✂️ Tachyon cuts bonds!
        MolecularSystem.processTachyonBondCutting(this.projectiles);
        
        // Collider mode (Fusion/Collider/Off)
        const colliderResult = MolecularSystem.processCollider(this.atoms, ts);
        if (colliderResult) {
          if (colliderResult.type === 'fusion') {
            const el = CHEMVENTUR.Elements.SYMBOLS[colliderResult.newZ] || '?';
            UI.showStatus(`💥 FUSION! → ${el}!`);
            Audio?.fusion?.(colliderResult.newZ);
            this.addToInventory(colliderResult.newZ);
          } else if (colliderResult.type === 'collision') {
            UI.showStatus(`💥 SMASH!`);
          }
        }
        
        // Apply electron mode effects
        MolecularSystem.applyElectronMode(this.atoms, ts);
      }
      
      // Proton decay
      ParticlePhysics.processProtonDecay(this.atoms, ts, (x, y, vx, vy, isReverse) => {
        if (isReverse) {
          this.whiteHoles.push(Holes.createWhiteHole(x, y, vx, vy));
          Audio?.whiteHoleFormed();
        } else {
          this.blackHoles.push(Holes.createBlackHole(x, y, vx, vy));
          Audio?.blackHoleFormed();
        }
      });
      
      // 🔄 REVERSE TIME CHAOS!
      if (ts < 0) {
        const chaosResults = ParticlePhysics.processReverseChaos(this.atoms, ts);
        if (chaosResults) {
          chaosResults.forEach(r => {
            if (r.type === 'split') UI.showStatus('💥 Atom split!');
          });
        }
        
        // WHITE HOLE MODE 1: Central BH transforms to WH in super slow reverse
        if (this.centralBlackHole && !this.centralWhiteHole) {
          const newWH = HolePhysics.updateCentralBlackHoleReverse(
            this.centralBlackHole, ts, this.width, this.height
          );
          if (newWH) {
            this.centralWhiteHole = newWH;
            this.centralBlackHole = null;
            UI.showStatus('⚪ Black Hole → White Hole!');
            Audio?.whiteHoleFormed();
          }
        }
      }
      
      // Fusion
      const fusionResult = ParticlePhysics.processFusion(this.atoms, this.fusionEnabled);
      if (fusionResult) {
        this.addToInventory(fusionResult.newZ);
        Audio?.fusion(fusionResult.newZ);
        UI.showStatus(`⚛️ ${Elements.SYMBOLS[fusionResult.newZ]}!`);
      }
      
      // Holes
      const bhResult = HolePhysics.updateBlackHoles(
        this.blackHoles, this.centralBlackHole, this.atoms, this.width, this.height, ts
      );
      this.centralBlackHole = bhResult.centralBlackHole;
      if (bhResult.mergedCount > 0) Audio?.holeMerged();
      
      // WHITE HOLE MODE 2: WH compress BH
      if (this.centralBlackHole && HolePhysics.whiteHoleMode === 2) {
        const newWH = HolePhysics.updateWhiteHoleCompression(
          this.centralBlackHole, this.whiteHoles, this.width, this.height
        );
        if (newWH) {
          this.centralWhiteHole = newWH;
          this.centralBlackHole = null;
          UI.showStatus('⚪ Compressed → White Hole!');
        }
      }
      
      const whResult = HolePhysics.updateWhiteHoles(
        this.whiteHoles, this.edgeWhiteHorizon, this.atoms, this.width, this.height, ts
      );
      if (whResult.mergedCount > 0) Audio?.holeMerged();
      
      // Central White Hole
      if (this.centralWhiteHole) {
        const shouldRemove = HolePhysics.updateCentralWhiteHole(
          this.centralWhiteHole, this.atoms, this.width, this.height, ts
        );
        if (shouldRemove) {
          this.centralWhiteHole = null;
          UI.showStatus('✨ White Hole dissipated');
        }
      }
      
      HolePhysics.checkHoleCollision(this.blackHoles, this.whiteHoles);
      
      // ===== UPDATE ALL ATOMS - THE MISSING LOOP! =====
      for (let i = this.atoms.length - 1; i >= 0; i--) {
        const atom = this.atoms[i];
        
        // Skip if being dragged
        if (this.dragged === atom) {
          atom.x = this.mouseX;
          atom.y = this.mouseY;
          atom.vx = 0;
          atom.vy = 0;
          continue;
        }
        
        // Get local time scale (affected by time zones)
        const localTs = ProjectilePhysics.getLocalTimeScale(atom.x, atom.y, zones, ts);
        
        // Skip if paused locally
        if (localTs === 0) continue;
        
        // UPDATE POSITION!
        ParticlePhysics.updatePosition(atom, localTs);
        
        // Apply gravity
        ParticlePhysics.applyGravity(atom, this.gravityMode, this.width / 2, this.height / 2, localTs);
        
        // Sound physics
        if (SoundPhysics?.enabled) {
          SoundPhysics.applyToParticle(atom, this.width, this.height, localTs);
        }
        
        // Boundary check - remove if out of bounds in kill mode
        if (ParticlePhysics.applyBoundary(atom, this.boundaryMode, this.width, this.height)) {
          this.atoms.splice(i, 1);
          continue;
        }
      }
      
      // Target check
      if (this.targetZ) {
        const found = this.atoms.some(a => a.p === this.targetZ && !a.special && !a.isNucleus);
        if (found) {
          UI.showStatus('🎯 TARGET! ' + Elements.SYMBOLS[this.targetZ] + '!');
          Audio?.targetAchieved();
          this.targetZ = null;
          UI.updateTarget();
        }
      }
      
      // Projectiles
      ProjectilePhysics.updateGravityOrbs(this.projectiles.gravityOrbs || [], this.atoms, this.width, this.height, ts);
      ProjectilePhysics.updateTimeZones(this.projectiles.timeZones || [], this.width, this.height);
      ProjectilePhysics.updateAntigun(this.projectiles.antigun || [], this.atoms, this.width, this.height);
      
      // Grid (respects pause!)
      PressureGrid.update(this.atoms, this.projectiles.gravityOrbs || [], this.width, this.height, ts);
      
      // ===== SHIP PHYSICS =====
      // Ship gets pushed by atoms AND takes damage from fast collisions!
      this.atoms.forEach(atom => {
        if (atom.special?.includes('hole')) return;
        const dx = this.ship.x - atom.x;
        const dy = this.ship.y - atom.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < 50 && dist > 5) {
          const push = 0.3 / dist;
          // Ship gets pushed
          this.ship.vx += (dx / dist) * push;
          this.ship.vy += (dy / dist) * push;
          // MUTUAL PUSH - ship also pushes atoms back!
          atom.vx -= (dx / dist) * push * 0.5;
          atom.vy -= (dy / dist) * push * 0.5;
        }
        
        // SHIP DAMAGE from high-speed collisions!
        if (dist < 25) {
          const speed = Math.hypot(atom.vx, atom.vy);
          if (speed > 10 && StringSystem) {
            const damage = Math.ceil(speed / 5);
            StringSystem.damageShip(damage, 'Particle collision!');
          }
        }
      });
      
      // Central black hole pulls ship gently
      if (this.centralBlackHole) {
        const dx = this.width / 2 - this.ship.x;
        const dy = this.height / 2 - this.ship.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 50) {
          this.ship.vx += (dx / dist) * 0.02;
          this.ship.vy += (dy / dist) * 0.02;
        }
      }
      
      // Central white hole pushes ship away
      if (this.centralWhiteHole) {
        const dx = this.ship.x - this.width / 2;
        const dy = this.ship.y - this.height / 2;
        const dist = Math.hypot(dx, dy);
        if (dist > 20) {
          this.ship.vx += (dx / dist) * 0.05;
          this.ship.vy += (dy / dist) * 0.05;
        }
      }
      
      // Apply ship velocity with damping
      if (!this.mouseHeld) {
        this.ship.x += this.ship.vx;
        this.ship.y += this.ship.vy;
        this.ship.vx *= 0.95;
        this.ship.vy *= 0.95;
      }
      
      // Keep ship on screen
      this.ship.x = Math.max(20, Math.min(this.width - 20, this.ship.x));
      this.ship.y = Math.max(20, Math.min(this.height - 20, this.ship.y));
      
      // Update UI!
      UI.updateStats();
      UI.updateAudioDisplay();
    },
    
    // Ship physics extracted for Stage 0 use
    updateShipPhysics(ts, zones) {
      // Ship gets gently pushed by nearby atoms!
      this.atoms.forEach(atom => {
        if (atom.special?.includes('hole')) return;
        const dx = this.ship.x - atom.x;
        const dy = this.ship.y - atom.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 50 && dist > 5) {
          const push = 0.3 / dist;
          this.ship.vx += (dx / dist) * push;
          this.ship.vy += (dy / dist) * push;
        }
      });
      
      // Apply ship velocity with damping
      if (!this.mouseHeld) {
        this.ship.x += this.ship.vx;
        this.ship.y += this.ship.vy;
        this.ship.vx *= 0.95;
        this.ship.vy *= 0.95;
      }
      
      // Keep ship on screen
      this.ship.x = Math.max(20, Math.min(this.width - 20, this.ship.x));
      this.ship.y = Math.max(20, Math.min(this.height - 20, this.ship.y));
    },
    
    // Handle subatomic particle collisions with atoms
    handleParticleCollisions() {
      const subatomic = this.atoms.filter(a => a.special === 'proton' || a.special === 'neutron' || a.special === 'electron' || a.special === 'positron');
      const realAtoms = this.atoms.filter(a => a.p && !a.special);
      
      for (const particle of subatomic) {
        for (const atom of realAtoms) {
          const dist = Math.hypot(particle.x - atom.x, particle.y - atom.y);
          const collisionDist = 25;
          
          if (dist < collisionDist) {
            // PROTON: increases atomic number!
            if (particle.special === 'proton') {
              atom.p = (atom.p || 1) + 1;
              atom.n = atom.n || 0;
              // Keep element stable-ish
              if (atom.p > 118) atom.p = 118;
              UI.showStatus(`⚛️ +p⁺ → ${Elements.SYMBOLS[atom.p] || '?'} (Z=${atom.p})`);
              // Remove the proton
              const idx = this.atoms.indexOf(particle);
              if (idx >= 0) this.atoms.splice(idx, 1);
              break;
            }
            
            // NEUTRON: adds to neutron count (isotope!)
            if (particle.special === 'neutron') {
              atom.n = (atom.n || atom.p) + 1;
              const mass = atom.p + atom.n;
              UI.showStatus(`⚛️ +n → ${Elements.SYMBOLS[atom.p]}-${mass} (isotope)`);
              const idx = this.atoms.indexOf(particle);
              if (idx >= 0) this.atoms.splice(idx, 1);
              break;
            }
            
            // ELECTRON: adds to electron shell
            if (particle.special === 'electron') {
              atom.e = (atom.e || atom.p) + 1;
              const charge = atom.p - atom.e;
              const chargeStr = charge > 0 ? `${charge}+` : charge < 0 ? `${Math.abs(charge)}-` : '';
              UI.showStatus(`⚛️ +e⁻ → ${Elements.SYMBOLS[atom.p]}${chargeStr} (ion)`);
              const idx = this.atoms.indexOf(particle);
              if (idx >= 0) this.atoms.splice(idx, 1);
              break;
            }
            
            // POSITRON: removes electron (annihilation!) or decreases proton
            if (particle.special === 'positron') {
              if (atom.e > 0) {
                atom.e--;
                UI.showStatus(`💥 e⁺+e⁻ → γγ (annihilation!)`);
              } else if (atom.p > 1) {
                atom.p--;
                UI.showStatus(`⚛️ -p⁺ → ${Elements.SYMBOLS[atom.p]}`);
              }
              const idx = this.atoms.indexOf(particle);
              if (idx >= 0) this.atoms.splice(idx, 1);
              break;
            }
          }
        }
      }
    },
    
    render() {
      if (!Renderer.ctx) {
        console.error('Renderer.ctx is null!');
        return;
      }
      
      Renderer.clear();
      
      // ===== STAGE 0: STRING UNIVERSE RENDERING =====
      if (this.stage === 0 && StringSystem) {
        // Draw a special string-universe background
        this.drawStringBackground();
        
        // Draw the string system
        StringSystem.draw(Renderer.ctx);
        
        // Draw OTHER PLAYERS (multiplayer)
        if (CHEMVENTUR.Multiplayer?.enabled) {
          CHEMVENTUR.Multiplayer.drawOtherPlayers(Renderer.ctx);
        }
        
        // Draw ship
        Renderer.drawShip(this.ship.x, this.ship.y, GunSystem.aimAngle, this.isAiming);
        
        // Draw stage 0 HUD
        this.drawStage0HUD();
        
        if (AudioSystem?.isPlaying) this.drawAudioVisualizer();
        return;
      }
      
      // ===== STAGE 1 & 2: REGULAR RENDERING =====
      if (SoundPhysics?.enabled) SoundPhysics.draw(Renderer.ctx, this.width, this.height);
      PressureGrid.draw(Renderer.ctx, this.width, this.height);
      
      this.blackHoles.forEach(bh => Renderer.drawBlackHole(bh));
      if (this.centralBlackHole) Renderer.drawCentralBlackHole(this.centralBlackHole);
      if (this.centralWhiteHole) Renderer.drawCentralWhiteHole(this.centralWhiteHole);
      
      this.whiteHoles.forEach(wh => Renderer.drawWhiteHole(wh));
      Renderer.drawEdgeHorizon(this.edgeWhiteHorizon);
      
      (this.projectiles.timeZones || []).forEach(z => Renderer.drawTimeZone(z));
      (this.projectiles.gravityOrbs || []).forEach(o => Renderer.drawGravityOrb(o));
      (this.projectiles.antigun || []).forEach(p => Renderer.drawAntigunProjectile(p));
      
      // 🔗 DRAW MOLECULAR BONDS!
      if (Renderer.drawBonds) Renderer.drawBonds();
      
      // Draw OTHER PLAYERS (multiplayer)
      if (CHEMVENTUR.Multiplayer?.enabled) {
        CHEMVENTUR.Multiplayer.drawOtherPlayers(Renderer.ctx);
      }
      
      // Draw ship with aim direction
      Renderer.drawShip(this.ship.x, this.ship.y, GunSystem.aimAngle, this.isAiming);
      
      // Draw all atoms
      this.atoms.forEach(atom => {
        if (atom) Renderer.drawAtom(atom);
      });
      
      if (AudioSystem?.isPlaying) this.drawAudioVisualizer();
    },
    
    drawAudioVisualizer() {
      const ctx = Renderer.ctx;
      const bands = AudioSystem.getBands();
      const x = 10, y = this.height - 80, barWidth = 30, maxHeight = 60;
      
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = '#8800ff'; ctx.fillRect(x, y - bands.sub * maxHeight, barWidth, bands.sub * maxHeight);
      ctx.fillStyle = '#ff3333'; ctx.fillRect(x + 35, y - bands.bass * maxHeight, barWidth, bands.bass * maxHeight);
      ctx.fillStyle = '#00ff41'; ctx.fillRect(x + 70, y - bands.mid * maxHeight, barWidth, bands.mid * maxHeight);
      ctx.fillStyle = '#00ffff'; ctx.fillRect(x + 105, y - bands.high * maxHeight, barWidth, bands.high * maxHeight);
      
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff';
      ctx.font = '8px monospace';
      ctx.fillText('SUB', x + 5, y + 12);
      ctx.fillText('BASS', x + 37, y + 12);
      ctx.fillText('MID', x + 77, y + 12);
      ctx.fillText('HIGH', x + 107, y + 12);
    },
    
    // ===== STAGE 0 SPECIAL RENDERING =====
    drawStringBackground() {
      const ctx = Renderer.ctx;
      const time = Date.now() * 0.001;
      
      // Deep space with subtle Planck-scale patterns
      ctx.fillStyle = '#000508';
      ctx.fillRect(0, 0, this.width, this.height);
      
      // Subtle grid showing the "fabric" of spacetime
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.05)';
      ctx.lineWidth = 1;
      
      const gridSize = 80;
      for (let x = 0; x < this.width; x += gridSize) {
        for (let y = 0; y < this.height; y += gridSize) {
          // Warped grid effect
          const warp = Math.sin(time + x * 0.01 + y * 0.01) * 5;
          ctx.strokeRect(x + warp, y + warp, gridSize, gridSize);
        }
      }
      
      // Dim stars in the background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      for (let i = 0; i < 50; i++) {
        const sx = (i * 137.5) % this.width;
        const sy = (i * 89.3) % this.height;
        const size = 0.5 + Math.sin(time + i) * 0.3;
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    
    drawStage0HUD() {
      const ctx = Renderer.ctx;
      const stats = StringSystem?.getStats() || {};
      
      // HUD background - larger for more info
      ctx.fillStyle = 'rgba(0, 20, 0, 0.85)';
      ctx.fillRect(10, 10, 280, 200);
      ctx.strokeStyle = '#00ff41';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, 280, 200);
      
      // Title
      ctx.fillStyle = '#00ff41';
      ctx.font = 'bold 14px monospace';
      ctx.fillText('🎻 STRING UNIVERSE', 20, 30);
      
      // Stats
      ctx.font = '11px monospace';
      ctx.fillStyle = '#ffffff';
      
      let y = 50;
      ctx.fillText(`Strings: ${stats.strings || 0}`, 20, y); y += 15;
      ctx.fillText(`Quarks: ${stats.quarks || 0} (u:${stats.upQuarks || 0} d:${stats.downQuarks || 0})`, 20, y); y += 15;
      
      // Particle counts with color coding
      ctx.fillStyle = '#ff3333';
      ctx.fillText(`Protons:   ${stats.protons || 0}/92`, 20, y); y += 15;
      ctx.fillStyle = '#cccccc';
      ctx.fillText(`Neutrons:  ${stats.neutrons || 0}/146`, 20, y); y += 15;
      ctx.fillStyle = '#00ffff';
      ctx.fillText(`Electrons: ${stats.electrons || 0}/92`, 20, y); y += 15;
      
      // Gluon web info
      ctx.fillStyle = '#ffff00';
      ctx.fillText(`Gluon Webs: ${stats.gluonWebs || 0} (${stats.capturedInWebs || 0} captured)`, 20, y); y += 15;
      
      // Fused atoms
      if (stats.atoms > 0) {
        ctx.fillStyle = '#88ff00';
        ctx.fillText(`Fused Atoms: ${stats.atoms}`, 20, y); y += 15;
      }
      
      y += 5;
      
      // Uranium progress bar!
      const progress = stats.uraniumProgress || 0;
      const barWidth = 240;
      const barHeight = 20;
      
      // Background
      ctx.fillStyle = '#333';
      ctx.fillRect(20, y, barWidth, barHeight);
      
      // Progress fill with gradient
      if (progress > 0) {
        const grad = ctx.createLinearGradient(20, y, 20 + barWidth * (progress / 100), y);
        grad.addColorStop(0, '#004400');
        grad.addColorStop(0.5, progress >= 100 ? '#ffff00' : '#00ff41');
        grad.addColorStop(1, progress >= 100 ? '#ff8800' : '#88ff00');
        ctx.fillStyle = grad;
        ctx.fillRect(20, y, barWidth * (progress / 100), barHeight);
      }
      
      // Border
      ctx.strokeStyle = progress >= 100 ? '#ffff00' : '#00ff41';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, y, barWidth, barHeight);
      
      // Progress text
      ctx.fillStyle = progress >= 100 ? '#000' : '#fff';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`☢️ URANIUM: ${progress}%`, 20 + barWidth/2, y + 14);
      ctx.textAlign = 'left';
      
      y += barHeight + 10;
      
      // Instructions
      ctx.fillStyle = '#888';
      ctx.font = '9px monospace';
      ctx.fillText('Keys 1-3: p/n/e strings | 5: Gluon web', 20, y); y += 12;
      ctx.fillText('Hold mouse to aim, release to fire', 20, y);
      
      // Gun indicator
      const gunNames = {
        1: 'Up Quark', 2: 'Down Quark', 3: 'Electron',
        4: 'Rain', 5: 'Gluon', 6: 'Shotgun',
        7: 'Photon', 8: 'Graviton', 9: 'Knot', 0: 'Time'
      };
      ctx.fillStyle = '#00ffff';
      ctx.font = '10px monospace';
      ctx.fillText(`Gun: ${gunNames[GunSystem.currentGun] || '?'}`, this.width - 120, 25);
      
      // Victory text if uranium achieved!
      if (stats.hasUranium) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(this.width/2 - 150, this.height/2 - 40, 300, 80);
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.width/2 - 150, this.height/2 - 40, 300, 80);
        
        ctx.fillStyle = '#ffff00';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('☢️ URANIUM ACHIEVED! ☢️', this.width/2, this.height/2);
        ctx.font = '12px monospace';
        ctx.fillStyle = '#00ff41';
        ctx.fillText('THE DREAM SINCE BIRTH!', this.width/2, this.height/2 + 25);
        ctx.textAlign = 'left';
      }
    }
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => CHEMVENTUR.Game.init(), 100);
  });
})();
