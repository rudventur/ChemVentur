/* ============================================
   CHEMVENTUR v108 - PARTICLES
   🔄 REVERSE TIME CHAOS!
   Atoms split, lose particles, unpredictable!
   ============================================ */

(function() {
  const Config = CHEMVENTUR.Config;
  const Elements = CHEMVENTUR.Elements;
  
  // ===== PARTICLE FACTORY =====
  CHEMVENTUR.Particles = {
    createAtom(x, y, protons, neutrons = null, electrons = null, options = {}) {
      const Z = protons;
      const N = neutrons !== null ? neutrons : Elements.getMass(Z) - Z;
      const E = electrons !== null ? electrons : Z;
      
      return {
        x, y,
        p: Z, n: N, e: E,
        vx: options.vx || 0,
        vy: options.vy || 0,
        special: options.special || null,
        isNucleus: options.isNucleus || false,
        isBeam: options.isBeam || false,
        deElectronize: options.deElectronize || false,
        glow: options.glow || false,
        spiral: options.spiral || false,
        spiralAngle: 0,
        orbitAngle: Math.random() * Math.PI * 2,
        customColor: options.customColor || null,
        createTime: Date.now(),
        id: Math.random().toString(36).substr(2, 9),
        // For organic bonds
        bonds: [],
        maxBonds: Config.ORGANIC?.MAX_BONDS[Z] || 0
      };
    },
    
    createProton(x, y, vx = 0, vy = 0, options = {}) {
      return CHEMVENTUR.Particles.createAtom(x, y, 1, 0, 0, { ...options, special: 'proton', vx, vy });
    },
    
    createNeutron(x, y, vx = 0, vy = 0, options = {}) {
      return CHEMVENTUR.Particles.createAtom(x, y, 0, 1, 0, { ...options, special: 'neutron', vx, vy });
    },
    
    createElectron(x, y, vx = 0, vy = 0, options = {}) {
      return CHEMVENTUR.Particles.createAtom(x, y, 0, 0, 1, { ...options, special: 'electron', vx, vy });
    },
    
    createPositron(x, y, vx = 0, vy = 0, options = {}) {
      return CHEMVENTUR.Particles.createAtom(x, y, 1, 0, 0, { ...options, special: 'positron', vx, vy });
    },
    
    getRadius(particle) {
      if (particle.special) return Config.SIZES[particle.special] || 8;
      return 12 + Math.sqrt(particle.p || 1) * 3;
    },
    
    getColor(particle) {
      if (particle.customColor) return particle.customColor;
      switch (particle.special) {
        case 'proton': return '#ff3333';
        case 'neutron': return '#cccccc';
        case 'electron': return '#3388ff';
        case 'positron': return '#ff00ff';
        default:
          if (particle.isNucleus) return '#ffaa00';
          return Elements.getColor(particle.p);
      }
    },
    
    getLabel(particle) {
      switch (particle.special) {
        case 'proton': return '+';
        case 'neutron': return 'n';
        case 'electron': return '-';
        case 'positron': return 'e⁺';
        default:
          if (particle.isNucleus) return `${particle.p}p${particle.n}n`;
          return Elements.SYMBOLS[particle.p] || '?';
      }
    },
    
    isSpecial(particle) { return particle.special !== null; },
    
    checkCollision(a, b, extraDistance = 0) {
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const combinedRadius = this.getRadius(a) + this.getRadius(b) + extraDistance;
      return dist < combinedRadius;
    },
    
    getCharge(particle) {
      if (particle.special === 'electron') return -1;
      if (particle.special === 'positron') return +1;
      if (particle.special === 'proton') return +1;
      if (particle.special === 'neutron') return 0;
      return particle.p - particle.e;
    }
  };
  
  // ===== PARTICLE PHYSICS ENGINE =====
  CHEMVENTUR.ParticlePhysics = {
    
    processNucleusFormation(atoms) {
      for (let i = 0; i < atoms.length; i++) {
        for (let j = i + 1; j < atoms.length; j++) {
          const a = atoms[i], b = atoms[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          
          if (dist < Config.PHYSICS.COLLISION_DISTANCE) {
            // Proton + Neutron = Bare Nucleus
            if ((a.special === 'proton' && b.special === 'neutron') ||
                (a.special === 'neutron' && b.special === 'proton')) {
              const newP = (a.special === 'proton' ? 1 : 0) + (b.special === 'proton' ? 1 : 0);
              const newN = (a.special === 'neutron' ? 1 : 0) + (b.special === 'neutron' ? 1 : 0);
              a.p = newP; a.n = newN; a.e = 0;
              a.special = null; a.isNucleus = true;
              atoms.splice(j, 1);
              return { type: 'nucleus', result: a };
            }
            
            // Electron captured by bare nucleus
            if (a.isNucleus && b.special === 'electron') {
              a.e += 1;
              if (a.e >= a.p) a.isNucleus = false;
              atoms.splice(j, 1);
              return { type: 'capture', result: a };
            }
            if (b.isNucleus && a.special === 'electron') {
              b.e += 1;
              if (b.e >= b.p) b.isNucleus = false;
              atoms.splice(i, 1);
              return { type: 'capture', result: b };
            }
            
            // Positron + Electron = ANNIHILATION
            if ((a.special === 'positron' && b.special === 'electron') ||
                (a.special === 'electron' && b.special === 'positron')) {
              atoms.splice(j, 1);
              atoms.splice(i, 1);
              return { type: 'annihilation', x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
            }
          }
        }
      }
      return null;
    },
    
    processDeElectronization(atoms) {
      for (let i = atoms.length - 1; i >= 0; i--) {
        const beam = atoms[i];
        if (!beam.isBeam || !beam.deElectronize) continue;
        
        for (let j = 0; j < atoms.length; j++) {
          if (i === j) continue;
          const target = atoms[j];
          if (target.special || target.e <= 0) continue;
          
          const dist = Math.hypot(beam.x - target.x, beam.y - target.y);
          const targetRadius = CHEMVENTUR.Particles.getRadius(target) + 15;
          
          if (dist < targetRadius) {
            target.e -= 1;
            atoms.splice(i, 1);
            return { type: 'deelectronize', target };
          }
        }
      }
      return null;
    },
    
    processProtonDecay(atoms, timeScale, createHoleFn) {
      const now = Date.now();
      
      for (let i = atoms.length - 1; i >= 0; i--) {
        const a = atoms[i];
        if (a.special === 'proton' && now - a.createTime > Config.PHYSICS.PROTON_DECAY_TIME) {
          const isReverse = timeScale < 0;
          createHoleFn(a.x, a.y, a.vx, a.vy, isReverse);
          atoms.splice(i, 1);
          return { type: isReverse ? 'whitehole' : 'blackhole', x: a.x, y: a.y };
        }
      }
      return null;
    },
    
    processFusion(atoms, fusionEnabled, maxZ = 36) {
      if (!fusionEnabled) return null;
      
      for (let i = 0; i < atoms.length; i++) {
        const a = atoms[i];
        if (a.special || a.isNucleus) continue;
        
        for (let j = i + 1; j < atoms.length; j++) {
          const b = atoms[j];
          if (b.special || b.isNucleus) continue;
          
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < Config.PHYSICS.FUSION_DISTANCE) {
            const newP = a.p + b.p;
            if (newP <= maxZ) {
              a.p = newP; a.n += b.n; a.e = newP;
              atoms.splice(j, 1);
              return { type: 'fusion', result: a, newZ: newP };
            }
          }
        }
      }
      return null;
    },
    
    // ===== 🔄 REVERSE TIME CHAOS! =====
    processReverseChaos(atoms, timeScale) {
      // Only in reverse time
      if (timeScale >= 0) return null;
      
      const chaos = Config.REVERSE_CHAOS;
      if (!chaos || !chaos.ENABLED) return null;
      
      const results = [];
      
      for (let i = atoms.length - 1; i >= 0; i--) {
        const atom = atoms[i];
        
        // Skip special particles
        if (atom.special) continue;
        
        // SPLIT CHANCE - atom splits into two!
        if (atom.p >= chaos.MIN_Z_FOR_SPLIT && Math.random() < chaos.SPLIT_CHANCE * Math.abs(timeScale)) {
          const splitPoint = Math.floor(Math.random() * (atom.p - 1)) + 1;
          const newZ1 = splitPoint;
          const newZ2 = atom.p - splitPoint;
          
          // Create second atom
          const newAtom = CHEMVENTUR.Particles.createAtom(
            atom.x + (Math.random() - 0.5) * 30,
            atom.y + (Math.random() - 0.5) * 30,
            newZ2, newZ2, newZ2,
            { vx: -atom.vx + (Math.random() - 0.5) * 5, vy: -atom.vy + (Math.random() - 0.5) * 5 }
          );
          atoms.push(newAtom);
          
          // Modify original
          atom.p = newZ1;
          atom.n = newZ1;
          atom.e = newZ1;
          atom.vx += (Math.random() - 0.5) * 5;
          atom.vy += (Math.random() - 0.5) * 5;
          
          results.push({ type: 'split', original: atom, newAtom });
        }
        
        // LOSE PARTICLE CHANCE
        else if (Math.random() < chaos.LOSE_PARTICLE_CHANCE * Math.abs(timeScale)) {
          const loseType = Math.floor(Math.random() * 3);
          
          if (loseType === 0 && atom.p > 1) {
            // Lose a proton
            atom.p -= 1;
            atom.e = Math.min(atom.e, atom.p);
            const proton = CHEMVENTUR.Particles.createProton(
              atom.x, atom.y,
              (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10
            );
            atoms.push(proton);
            results.push({ type: 'lose_proton', atom, particle: proton });
          }
          else if (loseType === 1 && atom.n > 0) {
            // Lose a neutron
            atom.n -= 1;
            const neutron = CHEMVENTUR.Particles.createNeutron(
              atom.x, atom.y,
              (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10
            );
            atoms.push(neutron);
            results.push({ type: 'lose_neutron', atom, particle: neutron });
          }
          else if (loseType === 2 && atom.e > 0) {
            // Lose an electron
            atom.e -= 1;
            const electron = CHEMVENTUR.Particles.createElectron(
              atom.x, atom.y,
              (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15
            );
            atoms.push(electron);
            results.push({ type: 'lose_electron', atom, particle: electron });
          }
        }
        
        // DESTABILIZE CHANCE - random velocity kick
        else if (Math.random() < chaos.DESTABILIZE_CHANCE * Math.abs(timeScale)) {
          atom.vx += (Math.random() - 0.5) * 8;
          atom.vy += (Math.random() - 0.5) * 8;
          results.push({ type: 'destabilize', atom });
        }
        
        // Remove atom if it becomes nothing
        if (atom.p <= 0 && atom.n <= 0 && atom.e <= 0) {
          atoms.splice(i, 1);
        }
      }
      
      return results.length > 0 ? results : null;
    },
    
    applyGravity(particle, gravityMode, centerX, centerY, timeScale) {
      const strength = Config.PHYSICS.GRAVITY_STRENGTH;
      
      switch (gravityMode) {
        case 1: // Down
          particle.vy += strength * timeScale;
          break;
        case 2: // Inward
          const dxIn = centerX - particle.x;
          const dyIn = centerY - particle.y;
          const distIn = Math.hypot(dxIn, dyIn);
          if (distIn > 1) {
            particle.vx += (dxIn / distIn) * Config.PHYSICS.GRAVITY_INWARD_STRENGTH * timeScale;
            particle.vy += (dyIn / distIn) * Config.PHYSICS.GRAVITY_INWARD_STRENGTH * timeScale;
          }
          break;
        case 3: // Outward
          const dxOut = particle.x - centerX;
          const dyOut = particle.y - centerY;
          const distOut = Math.hypot(dxOut, dyOut);
          if (distOut > 1) {
            particle.vx += (dxOut / distOut) * Config.PHYSICS.GRAVITY_OUTWARD_STRENGTH * timeScale;
            particle.vy += (dyOut / distOut) * Config.PHYSICS.GRAVITY_OUTWARD_STRENGTH * timeScale;
          }
          break;
      }
    },
    
    applyBoundary(particle, boundaryMode, width, height) {
      switch (boundaryMode) {
        case 1: // Bounce
          if (particle.x < 0 || particle.x > width) particle.vx *= -Config.PHYSICS.BOUNCE_DAMPING;
          if (particle.y < 0 || particle.y > height) particle.vy *= -Config.PHYSICS.BOUNCE_DAMPING;
          particle.x = Math.max(0, Math.min(width, particle.x));
          particle.y = Math.max(0, Math.min(height, particle.y));
          break;
        case 2: // Wrap
          if (particle.x < 0) particle.x = width;
          if (particle.x > width) particle.x = 0;
          if (particle.y < 0) particle.y = height;
          if (particle.y > height) particle.y = 0;
          break;
        case 3: // Destroy
          if (particle.x < 0 || particle.x > width || particle.y < 0 || particle.y > height) {
            return true;
          }
          break;
      }
      return false;
    },
    
    updatePosition(particle, localTimeScale) {
      particle.x += particle.vx * localTimeScale;
      particle.y += particle.vy * localTimeScale;
      
      if (particle.spiral && particle.special === 'electron') {
        particle.spiralAngle = (particle.spiralAngle || 0) + 0.2;
        particle.vx += Math.sin(particle.spiralAngle) * 0.5;
      }
      
      particle.orbitAngle = (particle.orbitAngle || 0) + 0.02 * localTimeScale;
      
      const speed = Math.hypot(particle.vx, particle.vy);
      if (speed > Config.PHYSICS.MAX_VELOCITY) {
        const scale = Config.PHYSICS.MAX_VELOCITY / speed;
        particle.vx *= scale;
        particle.vy *= scale;
      }
    }
  };
  
})();
