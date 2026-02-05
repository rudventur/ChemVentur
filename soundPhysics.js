/* ============================================
   CHEMVENTUR v107 - SOUND PHYSICS
   Bridges audio analysis to grid physics!
   
   Sound → Physics Mapping:
   - High frequencies → temp.grid (heat/vibration)
   - Mid frequencies → pressure.grid (wave ripples)  
   - Bass/Sub frequencies → magnetism.grid (deep forces)
   
   Features:
   - Grid influence from audio
   - Wave propagation based on gravity mode
   - Gravity Speaker Orbs (orbs that emit sound!)
   - Sound wave visualization
   ============================================ */

(function() {
  const Config = CHEMVENTUR.Config;
  
  CHEMVENTUR.SoundPhysics = {
    // Grid influence layers
    tempGrid: [],      // Temperature/heat grid
    pressureGrid: [],  // Pressure wave grid  
    magnetismGrid: [], // Magnetism/EM field grid
    
    gridCells: 12,     // Match pressure grid
    enabled: false,
    
    // Wave propagation settings
    waveSpeed: 0.15,
    waveDamping: 0.92,
    waveAmplitude: 1.0,
    
    // Gravity speaker orbs
    speakerOrbs: [],
    
    // Visualization
    showWaves: false,
    waveColor: 'rgba(0, 255, 170, 0.3)',
    
    // ===== INITIALIZATION =====
    init(width, height) {
      this.initGrids(width, height);
      this.enabled = true;
    },
    
    initGrids(width, height) {
      const cells = this.gridCells;
      const cellW = width / cells;
      const cellH = height / cells;
      
      this.tempGrid = [];
      this.pressureGrid = [];
      this.magnetismGrid = [];
      
      for (let y = 0; y < cells; y++) {
        this.tempGrid[y] = [];
        this.pressureGrid[y] = [];
        this.magnetismGrid[y] = [];
        
        for (let x = 0; x < cells; x++) {
          const centerX = x * cellW + cellW / 2;
          const centerY = y * cellH + cellH / 2;
          
          this.tempGrid[y][x] = {
            x: centerX, y: centerY,
            value: 0, velocity: 0
          };
          
          this.pressureGrid[y][x] = {
            x: centerX, y: centerY,
            value: 0, velocity: 0,
            wavePhase: 0
          };
          
          this.magnetismGrid[y][x] = {
            x: centerX, y: centerY,
            value: 0, velocity: 0,
            fieldAngle: Math.random() * Math.PI * 2
          };
        }
      }
    },
    
    // ===== MAIN UPDATE =====
    update(width, height, gravityMode, timeScale) {
      if (!this.enabled) return;
      
      const AudioSystem = CHEMVENTUR.AudioSystem;
      if (!AudioSystem || !AudioSystem.enabled) return;
      
      // Get audio influences
      const influence = AudioSystem.getInfluence();
      const bands = AudioSystem.getBands();
      
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Update each grid based on audio and gravity
      this.updateTempGrid(influence.temp, bands, width, height);
      this.updatePressureGrid(influence.pressure, bands, gravityMode, centerX, centerY, width, height, timeScale);
      this.updateMagnetismGrid(influence.magnetism, bands, width, height);
      
      // Update speaker orbs
      this.updateSpeakerOrbs(influence, gravityMode, centerX, centerY, width, height, timeScale);
    },
    
    // ===== TEMPERATURE GRID =====
    // High frequencies create "heat" / molecular excitement
    updateTempGrid(influence, bands, width, height) {
      const cells = this.gridCells;
      const cellW = width / cells;
      const cellH = height / cells;
      
      for (let y = 0; y < cells; y++) {
        for (let x = 0; x < cells; x++) {
          const cell = this.tempGrid[y][x];
          
          // Add heat from high frequencies (centered, fading outward)
          const distFromCenter = Math.hypot(
            cell.x - width / 2,
            cell.y - height / 2
          ) / Math.max(width, height);
          
          const heatAdd = influence * (1 - distFromCenter * 0.5) * 0.5;
          cell.value += heatAdd;
          
          // Heat dissipates over time
          cell.value *= 0.95;
          
          // Clamp
          cell.value = Math.max(0, Math.min(1, cell.value));
        }
      }
    },
    
    // ===== PRESSURE GRID =====
    // Mid frequencies create pressure waves that propagate based on gravity mode
    updatePressureGrid(influence, bands, gravityMode, centerX, centerY, width, height, timeScale) {
      const cells = this.gridCells;
      const cellW = width / cells;
      const cellH = height / cells;
      
      // Create pressure wave from center based on beat
      const beatStrength = bands.mid * 2;
      
      for (let y = 0; y < cells; y++) {
        for (let x = 0; x < cells; x++) {
          const cell = this.pressureGrid[y][x];
          
          // Calculate wave propagation direction based on gravity mode
          let waveDir = { x: 0, y: 0 };
          const dx = cell.x - centerX;
          const dy = cell.y - centerY;
          const dist = Math.hypot(dx, dy);
          
          if (dist > 1) {
            switch (gravityMode) {
              case 0: // None - radial outward
                waveDir.x = dx / dist;
                waveDir.y = dy / dist;
                break;
              case 1: // Down - waves go downward
                waveDir.x = 0;
                waveDir.y = 1;
                break;
              case 2: // Inward - waves collapse toward center
                waveDir.x = -dx / dist;
                waveDir.y = -dy / dist;
                break;
              case 3: // Outward - waves expand from center
                waveDir.x = dx / dist;
                waveDir.y = dy / dist;
                break;
            }
          }
          
          // Add pressure wave
          const waveInfluence = influence * this.waveAmplitude;
          
          // Waves emanate from center
          const normalizedDist = dist / Math.max(width, height);
          const waveFalloff = Math.max(0, 1 - normalizedDist * 2);
          
          cell.velocity += waveInfluence * waveFalloff * 0.3;
          
          // Wave equation
          cell.value += cell.velocity * this.waveSpeed * timeScale;
          cell.velocity *= this.waveDamping;
          cell.value *= 0.96;
          
          // Update wave phase for visualization
          cell.wavePhase += 0.1 * timeScale;
          
          // Clamp
          cell.value = Math.max(-1, Math.min(1, cell.value));
        }
      }
      
      // Propagate waves between cells
      this.propagatePressureWaves(width, height);
    },
    
    // Propagate pressure between neighboring cells
    propagatePressureWaves(width, height) {
      const cells = this.gridCells;
      const tempValues = [];
      
      // Copy current values
      for (let y = 0; y < cells; y++) {
        tempValues[y] = [];
        for (let x = 0; x < cells; x++) {
          tempValues[y][x] = this.pressureGrid[y][x].value;
        }
      }
      
      // Laplacian diffusion
      for (let y = 1; y < cells - 1; y++) {
        for (let x = 1; x < cells - 1; x++) {
          const laplacian = (
            tempValues[y-1][x] + tempValues[y+1][x] +
            tempValues[y][x-1] + tempValues[y][x+1] -
            4 * tempValues[y][x]
          ) * 0.1;
          
          this.pressureGrid[y][x].velocity += laplacian;
        }
      }
    },
    
    // ===== MAGNETISM GRID =====
    // Bass/sub frequencies create magnetic field disturbances
    updateMagnetismGrid(influence, bands, width, height) {
      const cells = this.gridCells;
      
      for (let y = 0; y < cells; y++) {
        for (let x = 0; x < cells; x++) {
          const cell = this.magnetismGrid[y][x];
          
          // Bass creates magnetic field rotation
          const bassInfluence = (bands.bass + bands.sub * 1.5) * influence;
          
          cell.fieldAngle += bassInfluence * 0.1;
          cell.value = bassInfluence;
          
          // Normalize angle
          while (cell.fieldAngle > Math.PI * 2) cell.fieldAngle -= Math.PI * 2;
          while (cell.fieldAngle < 0) cell.fieldAngle += Math.PI * 2;
        }
      }
    },
    
    // ===== SPEAKER ORBS =====
    // Gravity orbs that also emit sound waves!
    
    createSpeakerOrb(x, y, strength, gravityOrb) {
      return {
        x: x,
        y: y,
        strength: strength,
        gravityOrb: gravityOrb, // Reference to the gravity orb
        wavePhase: 0,
        emissionRadius: 100,
        active: true
      };
    },
    
    updateSpeakerOrbs(influence, gravityMode, centerX, centerY, width, height, timeScale) {
      const now = Date.now();
      
      for (let i = this.speakerOrbs.length - 1; i >= 0; i--) {
        const orb = this.speakerOrbs[i];
        
        // Sync position with gravity orb if linked
        if (orb.gravityOrb) {
          orb.x = orb.gravityOrb.x;
          orb.y = orb.gravityOrb.y;
          
          // Remove if gravity orb is gone
          if (!orb.gravityOrb.active) {
            this.speakerOrbs.splice(i, 1);
            continue;
          }
        }
        
        orb.wavePhase += 0.15 * timeScale;
        
        // Emit sound waves to nearby grid cells
        this.emitSoundFromOrb(orb, influence, gravityMode, width, height);
      }
    },
    
    emitSoundFromOrb(orb, influence, gravityMode, width, height) {
      const cells = this.gridCells;
      const cellW = width / cells;
      const cellH = height / cells;
      
      for (let y = 0; y < cells; y++) {
        for (let x = 0; x < cells; x++) {
          const cell = this.pressureGrid[y][x];
          const dist = Math.hypot(cell.x - orb.x, cell.y - orb.y);
          
          if (dist < orb.emissionRadius) {
            const falloff = 1 - dist / orb.emissionRadius;
            const waveContrib = Math.sin(orb.wavePhase - dist * 0.05) * falloff;
            
            // Direction based on gravity mode
            let dirMult = 1;
            if (gravityMode === 2) dirMult = -1; // Inward
            
            cell.velocity += waveContrib * influence.pressure * orb.strength * 0.1 * dirMult;
          }
        }
      }
    },
    
    // Link a gravity orb to become a speaker
    linkGravityOrbToSpeaker(gravityOrb) {
      const speaker = this.createSpeakerOrb(
        gravityOrb.x,
        gravityOrb.y,
        gravityOrb.strength * 0.05,
        gravityOrb
      );
      this.speakerOrbs.push(speaker);
      return speaker;
    },
    
    // ===== GRID QUERIES =====
    
    // Get temperature at position
    getTempAt(x, y, width, height) {
      return this.getGridValueAt(this.tempGrid, x, y, width, height);
    },
    
    // Get pressure at position
    getPressureAt(x, y, width, height) {
      return this.getGridValueAt(this.pressureGrid, x, y, width, height);
    },
    
    // Get magnetism at position
    getMagnetismAt(x, y, width, height) {
      const cell = this.getGridCellAt(this.magnetismGrid, x, y, width, height);
      return cell ? { value: cell.value, angle: cell.fieldAngle } : { value: 0, angle: 0 };
    },
    
    getGridValueAt(grid, x, y, width, height) {
      const cell = this.getGridCellAt(grid, x, y, width, height);
      return cell ? cell.value : 0;
    },
    
    getGridCellAt(grid, x, y, width, height) {
      const cells = this.gridCells;
      const cellW = width / cells;
      const cellH = height / cells;
      
      const gx = Math.floor(x / cellW);
      const gy = Math.floor(y / cellH);
      
      if (gx >= 0 && gx < cells && gy >= 0 && gy < cells) {
        return grid[gy][gx];
      }
      return null;
    },
    
    // ===== APPLY TO PARTICLES =====
    
    // Apply sound physics to a particle
    applyToParticle(particle, width, height, timeScale) {
      if (!this.enabled) return;
      
      // Temperature affects random jitter (molecular excitement)
      const temp = this.getTempAt(particle.x, particle.y, width, height);
      if (temp > 0.1) {
        particle.vx += (Math.random() - 0.5) * temp * 0.5 * timeScale;
        particle.vy += (Math.random() - 0.5) * temp * 0.5 * timeScale;
      }
      
      // Pressure creates directional force
      const pressure = this.getPressureAt(particle.x, particle.y, width, height);
      if (Math.abs(pressure) > 0.1) {
        // Push based on pressure gradient
        const pCell = this.getGridCellAt(this.pressureGrid, particle.x, particle.y, width, height);
        if (pCell) {
          particle.vx += pressure * 0.3 * timeScale;
          particle.vy += pressure * 0.3 * timeScale;
        }
      }
      
      // Magnetism affects charged particles
      const mag = this.getMagnetismAt(particle.x, particle.y, width, height);
      if (mag.value > 0.1 && particle.special !== 'neutron') {
        // Rotate velocity slightly based on field
        const force = mag.value * 0.1 * timeScale;
        particle.vx += Math.cos(mag.angle) * force;
        particle.vy += Math.sin(mag.angle) * force;
      }
    },
    
    // ===== DRAWING =====
    
    draw(ctx, width, height) {
      if (!this.enabled || !this.showWaves) return;
      
      const cells = this.gridCells;
      const cellW = width / cells;
      const cellH = height / cells;
      
      // Draw pressure waves
      for (let y = 0; y < cells; y++) {
        for (let x = 0; x < cells; x++) {
          const cell = this.pressureGrid[y][x];
          const intensity = Math.abs(cell.value);
          
          if (intensity > 0.05) {
            const alpha = Math.min(0.4, intensity * 0.5);
            const color = cell.value > 0 
              ? `rgba(0, 255, 170, ${alpha})` 
              : `rgba(255, 100, 0, ${alpha})`;
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(cell.x, cell.y, 5 + intensity * 15, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      
      // Draw temperature overlay
      for (let y = 0; y < cells; y++) {
        for (let x = 0; x < cells; x++) {
          const cell = this.tempGrid[y][x];
          
          if (cell.value > 0.1) {
            const alpha = cell.value * 0.3;
            ctx.fillStyle = `rgba(255, 100, 0, ${alpha})`;
            ctx.fillRect(x * cellW, y * cellH, cellW, cellH);
          }
        }
      }
      
      // Draw magnetism field lines
      ctx.strokeStyle = 'rgba(136, 0, 255, 0.3)';
      ctx.lineWidth = 1;
      for (let y = 0; y < cells; y++) {
        for (let x = 0; x < cells; x++) {
          const cell = this.magnetismGrid[y][x];
          
          if (cell.value > 0.1) {
            const len = 10 + cell.value * 15;
            ctx.beginPath();
            ctx.moveTo(cell.x, cell.y);
            ctx.lineTo(
              cell.x + Math.cos(cell.fieldAngle) * len,
              cell.y + Math.sin(cell.fieldAngle) * len
            );
            ctx.stroke();
          }
        }
      }
      
      // Draw speaker orbs
      this.speakerOrbs.forEach(orb => {
        ctx.strokeStyle = 'rgba(0, 255, 170, 0.5)';
        ctx.lineWidth = 2;
        
        // Draw expanding rings
        for (let i = 0; i < 3; i++) {
          const radius = ((orb.wavePhase + i * 2) % 6) / 6 * orb.emissionRadius;
          const alpha = 1 - radius / orb.emissionRadius;
          ctx.globalAlpha = alpha * 0.5;
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      });
    },
    
    // ===== TOGGLE =====
    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    },
    
    toggleWaveVis() {
      this.showWaves = !this.showWaves;
      return this.showWaves;
    }
  };
  
})();
