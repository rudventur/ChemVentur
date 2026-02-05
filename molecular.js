/* ============================================
   CHEMVENTUR v111 - MOLECULAR DREAMS
   🔗 Molecular Builder + ⚗️ Reactions + ⚡ Electron Modes!
   THE DREAM SINCE OCTOBER! THE DREAM SINCE BIRTH!
   ============================================ */

(function() {
  const Config = CHEMVENTUR.Config;
  
  // =============================================
  // BOND TYPES & MOLECULAR GEOMETRY
  // =============================================
  const BOND_TYPES = {
    SINGLE: { strength: 1, length: 50, color: '#888888', width: 3 },
    DOUBLE: { strength: 2, length: 45, color: '#aaaaaa', width: 5 },
    TRIPLE: { strength: 3, length: 40, color: '#ffffff', width: 7 },
    IONIC:  { strength: 1.5, length: 55, color: '#ffff00', width: 4 },
    METALLIC: { strength: 0.5, length: 60, color: '#ff9900', width: 2 }
  };
  
  // Valence electrons for bonding
  const VALENCE = {
    1: 1,   // H
    2: 0,   // He (noble)
    3: 1,   // Li
    4: 2,   // Be
    5: 3,   // B
    6: 4,   // C
    7: 3,   // N (can be 5)
    8: 2,   // O
    9: 1,   // F
    10: 0,  // Ne
    11: 1,  // Na
    12: 2,  // Mg
    13: 3,  // Al
    14: 4,  // Si
    15: 3,  // P (can be 5)
    16: 2,  // S (can be 4,6)
    17: 1,  // Cl
    18: 0,  // Ar
    19: 1,  // K
    20: 2,  // Ca
    26: 2,  // Fe (variable)
    29: 1,  // Cu (variable)
    30: 2,  // Zn
    35: 1,  // Br
    53: 1,  // I
  };
  
  // Bond angles for molecular geometry
  const GEOMETRY = {
    linear: 180,
    trigonal: 120,
    tetrahedral: 109.5,
    bent: 104.5,      // H2O
    pyramidal: 107,   // NH3
    octahedral: 90
  };
  
  // Known molecules
  const MOLECULES = {
    'H2': { atoms: [{z:1}, {z:1}], bonds: [[0,1,'SINGLE']], name: 'Hydrogen', formula: 'H₂' },
    'O2': { atoms: [{z:8}, {z:8}], bonds: [[0,1,'DOUBLE']], name: 'Oxygen', formula: 'O₂' },
    'N2': { atoms: [{z:7}, {z:7}], bonds: [[0,1,'TRIPLE']], name: 'Nitrogen', formula: 'N₂' },
    'H2O': { atoms: [{z:1}, {z:8}, {z:1}], bonds: [[0,1,'SINGLE'],[1,2,'SINGLE']], name: 'Water', formula: 'H₂O', angle: 104.5 },
    'CO2': { atoms: [{z:8}, {z:6}, {z:8}], bonds: [[0,1,'DOUBLE'],[1,2,'DOUBLE']], name: 'Carbon Dioxide', formula: 'CO₂', angle: 180 },
    'CH4': { atoms: [{z:6}, {z:1}, {z:1}, {z:1}, {z:1}], bonds: [[0,1,'SINGLE'],[0,2,'SINGLE'],[0,3,'SINGLE'],[0,4,'SINGLE']], name: 'Methane', formula: 'CH₄', geometry: 'tetrahedral' },
    'NH3': { atoms: [{z:7}, {z:1}, {z:1}, {z:1}], bonds: [[0,1,'SINGLE'],[0,2,'SINGLE'],[0,3,'SINGLE']], name: 'Ammonia', formula: 'NH₃', geometry: 'pyramidal' },
    'NaCl': { atoms: [{z:11}, {z:17}], bonds: [[0,1,'IONIC']], name: 'Sodium Chloride', formula: 'NaCl' },
    'HCl': { atoms: [{z:1}, {z:17}], bonds: [[0,1,'SINGLE']], name: 'Hydrochloric Acid', formula: 'HCl' },
    'CO': { atoms: [{z:6}, {z:8}], bonds: [[0,1,'TRIPLE']], name: 'Carbon Monoxide', formula: 'CO' },
    'H2S': { atoms: [{z:1}, {z:16}, {z:1}], bonds: [[0,1,'SINGLE'],[1,2,'SINGLE']], name: 'Hydrogen Sulfide', formula: 'H₂S' },
    'C2H6': { atoms: [{z:6}, {z:6}, {z:1}, {z:1}, {z:1}, {z:1}, {z:1}, {z:1}], bonds: [[0,1,'SINGLE'],[0,2,'SINGLE'],[0,3,'SINGLE'],[0,4,'SINGLE'],[1,5,'SINGLE'],[1,6,'SINGLE'],[1,7,'SINGLE']], name: 'Ethane', formula: 'C₂H₆' },
    'C2H4': { atoms: [{z:6}, {z:6}, {z:1}, {z:1}, {z:1}, {z:1}], bonds: [[0,1,'DOUBLE'],[0,2,'SINGLE'],[0,3,'SINGLE'],[1,4,'SINGLE'],[1,5,'SINGLE']], name: 'Ethene', formula: 'C₂H₄' },
    'C2H2': { atoms: [{z:6}, {z:6}, {z:1}, {z:1}], bonds: [[0,1,'TRIPLE'],[0,2,'SINGLE'],[1,3,'SINGLE']], name: 'Ethyne (Acetylene)', formula: 'C₂H₂' },
    'O3': { atoms: [{z:8}, {z:8}, {z:8}], bonds: [[0,1,'SINGLE'],[1,2,'DOUBLE']], name: 'Ozone', formula: 'O₃' },
  };
  
  // =============================================
  // CHEMICAL REACTIONS
  // =============================================
  const REACTIONS = [
    { 
      reactants: [{z:1, count:2}, {z:8, count:1}], 
      products: ['H2O'],
      name: 'Water Formation',
      energy: 286, // kJ/mol (exothermic)
      type: 'combustion'
    },
    {
      reactants: [{z:6, count:1}, {z:8, count:2}],
      products: ['CO2'],
      name: 'Carbon Combustion',
      energy: 394,
      type: 'combustion'
    },
    {
      reactants: [{z:11, count:1}, {z:17, count:1}],
      products: ['NaCl'],
      name: 'Salt Formation',
      energy: 411,
      type: 'ionic'
    },
    {
      reactants: [{z:1, count:2}, {z:17, count:1}],
      products: ['HCl', 'HCl'],
      name: 'HCl Formation',
      energy: 92,
      type: 'synthesis'
    },
    {
      reactants: [{z:7, count:1}, {z:1, count:3}],
      products: ['NH3'],
      name: 'Ammonia Synthesis',
      energy: 46,
      type: 'synthesis'
    },
    {
      reactants: [{z:6, count:1}, {z:8, count:1}],
      products: ['CO'],
      name: 'Incomplete Combustion',
      energy: 110,
      type: 'combustion'
    },
  ];
  
  // =============================================
  // ELECTRON MODES
  // =============================================
  const ELECTRON_MODES = {
    NORMAL: {
      name: 'Normal',
      icon: '⚡',
      description: 'Standard electron behavior',
      color: '#00ffff',
      effects: {}
    },
    PLASMA: {
      name: 'Plasma',
      icon: '🔥',
      description: 'Ionized gas - free electrons!',
      color: '#ff00ff',
      minTemp: 10000, // Kelvin
      effects: { ionization: true, glow: true, conductivity: 'high' }
    },
    IONIC: {
      name: 'Ionic',
      icon: '⚡',
      description: 'Electron transfer bonding',
      color: '#ffff00',
      effects: { ionicBonds: true, chargeDisplay: true }
    },
    CRYSTAL: {
      name: 'Crystal',
      icon: '💎',
      description: 'Atoms form lattice structures',
      color: '#00ffaa',
      effects: { lattice: true, rigidBonds: true }
    },
    SUPERCONDUCTOR: {
      name: 'Superconductor',
      icon: '❄️',
      description: 'Zero resistance at low temp!',
      color: '#00ccff',
      maxTemp: 100, // Kelvin (high-temp superconductor)
      effects: { zeroResistance: true, magneticLevitation: true }
    },
    WAVE: {
      name: 'Wave Function',
      icon: '🌊',
      description: 'Quantum probability clouds',
      color: '#aa88ff',
      effects: { probabilityClouds: true, uncertainty: true }
    },
    SPECTRAL: {
      name: 'Spectral Glow',
      icon: '🌈',
      description: 'Real emission colors!',
      color: '#ffffff',
      effects: { emissionSpectrum: true, photonEmission: true }
    }
  };
  
  // Spectral emission colors (actual element colors!)
  const EMISSION_COLORS = {
    1:  '#ff6666', // H - red (Balmer series)
    2:  '#ffff99', // He - yellow
    3:  '#ff0000', // Li - crimson red
    6:  '#ff9900', // C - orange
    7:  '#ff6666', // N - red-orange
    8:  '#00ff00', // O - green
    10: '#ff6600', // Ne - orange-red (neon signs!)
    11: '#ffff00', // Na - bright yellow (street lamps!)
    12: '#ffffff', // Mg - brilliant white
    19: '#cc99ff', // K - violet
    20: '#ff6600', // Ca - orange-red
    26: '#ffcc00', // Fe - golden
    29: '#00ff00', // Cu - green (fireworks!)
    38: '#ff0000', // Sr - red (fireworks!)
    56: '#00ff00', // Ba - green (fireworks!)
  };
  
  // =============================================
  // COLLIDER MODES
  // =============================================
  const COLLIDER_MODES = {
    OFF: { name: 'Off', description: 'Normal physics' },
    FUSION: { name: 'Fusion', description: 'Nuclei merge at high speed!', minSpeed: 15 },
    COLLIDER: { name: 'Collider', description: 'Smash atoms apart!', minSpeed: 20 }
  };
  
  // =============================================
  // ISOTOPE DATA
  // =============================================
  const ISOTOPES = {
    1: [ // Hydrogen isotopes
      { neutrons: 0, name: 'Protium', stable: true, abundance: 99.98 },
      { neutrons: 1, name: 'Deuterium', stable: true, abundance: 0.02 },
      { neutrons: 2, name: 'Tritium', stable: false, halfLife: '12.3 years' }
    ],
    6: [ // Carbon isotopes
      { neutrons: 6, name: 'Carbon-12', stable: true, abundance: 98.9 },
      { neutrons: 7, name: 'Carbon-13', stable: true, abundance: 1.1 },
      { neutrons: 8, name: 'Carbon-14', stable: false, halfLife: '5730 years' }
    ],
    92: [ // Uranium isotopes
      { neutrons: 143, name: 'Uranium-235', stable: false, halfLife: '704 million years', fissile: true },
      { neutrons: 146, name: 'Uranium-238', stable: false, halfLife: '4.5 billion years' }
    ]
  };
  
  // =============================================
  // MOLECULAR SYSTEM
  // =============================================
  CHEMVENTUR.MolecularSystem = {
    molecules: [],
    bonds: [],
    electronMode: 'NORMAL',
    colliderMode: 'OFF',
    isotopeMode: false,
    
    // Get valence electrons
    getValence(Z) {
      return VALENCE[Z] !== undefined ? VALENCE[Z] : Math.min(Z % 8, 8 - (Z % 8));
    },
    
    // Check if two atoms can bond
    canBond(atom1, atom2) {
      // Must have protons (be real atoms)
      if (!atom1.p || !atom2.p) return false;
      
      // NO bonding to special particles or holes!
      if (atom1.special || atom2.special) return false;
      if (atom1.isHole || atom2.isHole) return false;
      if (atom1.isMolecule || atom2.isMolecule) return false;
      
      // Check valence limits
      const v1 = this.getValence(atom1.p);
      const v2 = this.getValence(atom2.p);
      if (atom1.bonds && atom1.bonds.length >= v1) return false;
      if (atom2.bonds && atom2.bonds.length >= v2) return false;
      
      const dist = Math.hypot(atom1.x - atom2.x, atom1.y - atom2.y);
      const bondDist = 50; // Max bonding distance
      
      return dist < bondDist;
    },
    
    // Create a bond between two atoms
    createBond(atom1, atom2, type = 'SINGLE') {
      if (!this.canBond(atom1, atom2)) return null;
      
      const bondType = BOND_TYPES[type];
      const bond = {
        atom1: atom1,
        atom2: atom2,
        type: type,
        strength: bondType.strength,
        length: bondType.length,
        color: bondType.color,
        width: bondType.width,
        vibration: 0,
        id: Math.random().toString(36).substr(2, 9)
      };
      
      atom1.bonds = atom1.bonds || [];
      atom2.bonds = atom2.bonds || [];
      atom1.bonds.push(bond);
      atom2.bonds.push(bond);
      
      // IMPORTANT: Push atoms apart to bond length to prevent overlap!
      const dx = atom2.x - atom1.x;
      const dy = atom2.y - atom1.y;
      const dist = Math.hypot(dx, dy);
      if (dist < bond.length && dist > 0) {
        const push = (bond.length - dist) / 2;
        const nx = dx / dist;
        const ny = dy / dist;
        atom1.x -= nx * push;
        atom1.y -= ny * push;
        atom2.x += nx * push;
        atom2.y += ny * push;
      }
      
      this.bonds.push(bond);
      return bond;
    },
    
    // Break a bond
    breakBond(bond) {
      const idx = this.bonds.indexOf(bond);
      if (idx >= 0) this.bonds.splice(idx, 1);
      
      if (bond.atom1 && bond.atom1.bonds) {
        const idx1 = bond.atom1.bonds.indexOf(bond);
        if (idx1 >= 0) bond.atom1.bonds.splice(idx1, 1);
      }
      if (bond.atom2 && bond.atom2.bonds) {
        const idx2 = bond.atom2.bonds.indexOf(bond);
        if (idx2 >= 0) bond.atom2.bonds.splice(idx2, 1);
      }
    },
    
    // Tachyon cuts bonds! ✂️
    processTachyonBondCutting(projectiles) {
      if (!projectiles || !projectiles.antigun) return;
      
      const tachyons = projectiles.antigun.filter(p => p.type === 'tachyon');
      
      for (const tachyon of tachyons) {
        // Check each bond
        for (let i = this.bonds.length - 1; i >= 0; i--) {
          const bond = this.bonds[i];
          if (!bond.atom1 || !bond.atom2) continue;
          
          // Get bond midpoint
          const midX = (bond.atom1.x + bond.atom2.x) / 2;
          const midY = (bond.atom1.y + bond.atom2.y) / 2;
          
          // Distance from tachyon to bond midpoint
          const dist = Math.hypot(tachyon.x - midX, tachyon.y - midY);
          
          if (dist < 40) {
            // CUT THE BOND! ✂️
            this.breakBond(bond);
            CHEMVENTUR.UI?.showStatus('✂️ Tachyon cut bond!');
            
            // Give atoms some kick
            const kickX = (Math.random() - 0.5) * 5;
            const kickY = (Math.random() - 0.5) * 5;
            if (bond.atom1) { bond.atom1.vx += kickX; bond.atom1.vy += kickY; }
            if (bond.atom2) { bond.atom2.vx -= kickX; bond.atom2.vy -= kickY; }
          }
        }
      }
    },
    
    // Update all bonds (spring physics with repulsion)
    updateBonds(timeScale) {
      // First, clean up bonds with missing atoms
      for (let i = this.bonds.length - 1; i >= 0; i--) {
        const bond = this.bonds[i];
        if (!bond.atom1 || !bond.atom2 || 
            bond.atom1.special || bond.atom2.special ||
            !isFinite(bond.atom1.x) || !isFinite(bond.atom2.x)) {
          this.bonds.splice(i, 1);
          continue;
        }
      }
      
      this.bonds.forEach(bond => {
        if (!bond.atom1 || !bond.atom2) return;
        
        const dx = bond.atom2.x - bond.atom1.x;
        const dy = bond.atom2.y - bond.atom1.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist === 0 || !isFinite(dist)) return;
        
        const diff = dist - bond.length;
        const nx = dx / dist;
        const ny = dy / dist;
        
        // Spring force to maintain bond length
        const springForce = diff * 0.2 * bond.strength;
        
        // REPULSION when too close (prevents overlap/merging!)
        let repulsion = 0;
        if (dist < bond.length * 0.5) {
          repulsion = (bond.length * 0.5 - dist) * 0.5;
        }
        
        const totalForce = springForce - repulsion;
        const fx = nx * totalForce;
        const fy = ny * totalForce;
        
        bond.atom1.vx = (bond.atom1.vx || 0) + fx * timeScale;
        bond.atom1.vy = (bond.atom1.vy || 0) + fy * timeScale;
        bond.atom2.vx = (bond.atom2.vx || 0) - fx * timeScale;
        bond.atom2.vy = (bond.atom2.vy || 0) - fy * timeScale;
        
        // Damping to stabilize molecule
        bond.atom1.vx *= 0.98;
        bond.atom1.vy *= 0.98;
        bond.atom2.vx *= 0.98;
        bond.atom2.vy *= 0.98;
        
        // Bond vibration visual
        bond.vibration = Math.sin(Date.now() * 0.01) * Math.abs(diff) * 0.1;
        
        // Break if stretched too far
        if (dist > bond.length * 3) {
          this.breakBond(bond);
        }
      });
    },
    
    // Try to form bonds between nearby atoms
    tryFormBonds(atoms) {
      for (let i = 0; i < atoms.length; i++) {
        for (let j = i + 1; j < atoms.length; j++) {
          const a1 = atoms[i];
          const a2 = atoms[j];
          
          if (!a1.p || !a2.p) continue; // Skip particles
          if (a1.special || a2.special) continue; // Skip holes
          
          // Check if already bonded
          if (a1.bonds && a1.bonds.some(b => b.atom1 === a2 || b.atom2 === a2)) continue;
          
          if (this.canBond(a1, a2)) {
            const dist = Math.hypot(a1.x - a2.x, a1.y - a2.y);
            if (dist < 40) { // Close enough to bond
              // Determine bond type
              let bondType = 'SINGLE';
              
              // Ionic bond for metals + nonmetals
              const isIonic1 = [3,11,19,12,20].includes(a1.p);
              const isIonic2 = [9,17,35,53,8,16].includes(a2.p);
              if ((isIonic1 && isIonic2) || (isIonic2 && [3,11,19,12,20].includes(a2.p))) {
                bondType = 'IONIC';
              }
              
              this.createBond(a1, a2, bondType);
              return { type: 'bond', atom1: a1, atom2: a2, bondType };
            }
          }
        }
      }
      return null;
    },
    
    // Check for chemical reactions
    checkReactions(atoms) {
      // Group nearby atoms
      const groups = [];
      const used = new Set();
      
      atoms.forEach((atom, i) => {
        if (used.has(i) || !atom.p) return;
        
        const group = [atom];
        used.add(i);
        
        atoms.forEach((other, j) => {
          if (used.has(j) || !other.p) return;
          const dist = Math.hypot(atom.x - other.x, atom.y - other.y);
          if (dist < 80) {
            group.push(other);
            used.add(j);
          }
        });
        
        if (group.length > 1) groups.push(group);
      });
      
      // Check each group against reactions
      for (const group of groups) {
        const counts = {};
        group.forEach(a => {
          counts[a.p] = (counts[a.p] || 0) + 1;
        });
        
        for (const reaction of REACTIONS) {
          let matches = true;
          for (const r of reaction.reactants) {
            if (!counts[r.z] || counts[r.z] < r.count) {
              matches = false;
              break;
            }
          }
          
          if (matches) {
            // Check if atoms are moving fast enough (activation energy)
            const avgSpeed = group.reduce((s, a) => s + Math.hypot(a.vx || 0, a.vy || 0), 0) / group.length;
            if (avgSpeed > 3) {
              return { 
                reaction, 
                group, 
                centerX: group.reduce((s, a) => s + a.x, 0) / group.length,
                centerY: group.reduce((s, a) => s + a.y, 0) / group.length
              };
            }
          }
        }
      }
      
      return null;
    },
    
    // Execute a reaction
    executeReaction(reactionData, atoms) {
      const { reaction, group, centerX, centerY } = reactionData;
      
      // Remove reactant atoms
      const toRemove = [];
      const usedCounts = {};
      
      for (const r of reaction.reactants) {
        usedCounts[r.z] = 0;
      }
      
      group.forEach(atom => {
        for (const r of reaction.reactants) {
          if (atom.p === r.z && usedCounts[r.z] < r.count) {
            toRemove.push(atom);
            usedCounts[r.z]++;
            break;
          }
        }
      });
      
      // Remove from atoms array
      toRemove.forEach(atom => {
        const idx = atoms.indexOf(atom);
        if (idx >= 0) atoms.splice(idx, 1);
        
        // Break any bonds
        if (atom.bonds) {
          atom.bonds.slice().forEach(bond => this.breakBond(bond));
        }
      });
      
      // Create products
      const products = [];
      reaction.products.forEach(productName => {
        const moleculeData = MOLECULES[productName];
        if (moleculeData) {
          // Create a simple representation
          const product = {
            x: centerX + (Math.random() - 0.5) * 30,
            y: centerY + (Math.random() - 0.5) * 30,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            p: moleculeData.atoms[0].z, // Main atom
            n: moleculeData.atoms[0].z,
            e: moleculeData.atoms[0].z,
            molecule: productName,
            moleculeData: moleculeData,
            isMolecule: true
          };
          products.push(product);
          atoms.push(product);
        }
      });
      
      return {
        name: reaction.name,
        energy: reaction.energy,
        products,
        centerX,
        centerY
      };
    },
    
    // Collider mode physics
    processCollider(atoms, timeScale) {
      if (this.colliderMode === 'OFF') return null;
      
      for (let i = 0; i < atoms.length; i++) {
        for (let j = i + 1; j < atoms.length; j++) {
          const a1 = atoms[i];
          const a2 = atoms[j];
          
          if (!a1.p || !a2.p) continue;
          
          const dx = a2.x - a1.x;
          const dy = a2.y - a1.y;
          const dist = Math.hypot(dx, dy);
          
          if (dist < 30) {
            const relSpeed = Math.hypot(a1.vx - a2.vx, a1.vy - a2.vy);
            
            if (this.colliderMode === 'FUSION' && relSpeed > COLLIDER_MODES.FUSION.minSpeed) {
              // FUSION! Combine nuclei
              if (a1.p + a2.p <= 118) {
                const newZ = a1.p + a2.p;
                const newN = (a1.n || a1.p) + (a2.n || a2.p);
                
                a1.p = newZ;
                a1.n = newN;
                a1.e = newZ;
                a1.vx = (a1.vx + a2.vx) / 2;
                a1.vy = (a1.vy + a2.vy) / 2;
                
                atoms.splice(j, 1);
                
                return { type: 'fusion', newZ, x: a1.x, y: a1.y };
              }
            } else if (this.colliderMode === 'COLLIDER' && relSpeed > COLLIDER_MODES.COLLIDER.minSpeed) {
              // COLLIDER! Break apart
              if (a1.p > 1) {
                const splitZ = Math.floor(a1.p / 2);
                a1.p = splitZ;
                a1.n = splitZ;
                a1.e = splitZ;
                
                // Create fragment
                const fragment = {
                  x: a1.x + 20,
                  y: a1.y + 20,
                  vx: -a1.vx + (Math.random() - 0.5) * 10,
                  vy: -a1.vy + (Math.random() - 0.5) * 10,
                  p: a1.p,
                  n: a1.p,
                  e: a1.p
                };
                atoms.push(fragment);
                
                return { type: 'collision', z: splitZ, x: a1.x, y: a1.y };
              }
            }
          }
        }
      }
      return null;
    },
    
    // Electron mode effects
    applyElectronMode(atoms, timeScale) {
      const mode = ELECTRON_MODES[this.electronMode];
      
      atoms.forEach(atom => {
        if (!atom.p) return;
        
        // CLEAR all mode effects first!
        atom.plasmaGlow = false;
        atom.spectralGlow = null;
        atom.cloudRadius = 0;
        atom.crystalLock = false;
        atom.superGlow = false;
        atom.glowColor = null;
        atom.wavePhase = atom.wavePhase || 0;
        
        // If NORMAL mode, just return - no special effects
        if (!mode || !mode.effects || this.electronMode === 'NORMAL') return;
        
        // Plasma mode - ionization
        if (mode.effects.ionization) {
          atom.plasmaGlow = true;
          atom.glowColor = mode.color;
          // Random electron loss/gain
          if (Math.random() < 0.01) {
            atom.e = Math.max(0, atom.e + (Math.random() > 0.5 ? 1 : -1));
          }
        }
        
        // Spectral glow
        if (mode.effects.emissionSpectrum) {
          atom.spectralGlow = EMISSION_COLORS[atom.p] || '#ffffff';
        }
        
        // Wave function
        if (mode.effects.probabilityClouds) {
          atom.wavePhase = (atom.wavePhase || 0) + 0.1;
          atom.cloudRadius = 30 + Math.sin(atom.wavePhase) * 10;
        }
        
        // Crystal lattice
        if (mode.effects.lattice && atom.bonds && atom.bonds.length > 0) {
          atom.crystalLock = true;
          atom.vx *= 0.9;
          atom.vy *= 0.9;
        }
        
        // Superconductor
        if (mode.effects.zeroResistance) {
          atom.superGlow = true;
        }
      });
    },
    
    // Cycle electron mode
    cycleElectronMode() {
      const modes = Object.keys(ELECTRON_MODES);
      const currentIdx = modes.indexOf(this.electronMode);
      this.electronMode = modes[(currentIdx + 1) % modes.length];
      return ELECTRON_MODES[this.electronMode];
    },
    
    // Cycle collider mode - uses Game.COLLIDER_MODES
    cycleColliderMode() {
      const game = CHEMVENTUR.Game;
      if (game && game.cycleColliderMode) {
        return game.cycleColliderMode();
      }
      // Fallback
      const modes = ['OFF', 'FUSION', 'COLLIDE', 'SLINGSHOT', 'BOND'];
      const currentIdx = modes.indexOf(this.colliderMode || 'OFF');
      this.colliderMode = modes[(currentIdx + 1) % modes.length];
      return { name: this.colliderMode };
    },
    
    // Get emission color for element
    getEmissionColor(Z) {
      return EMISSION_COLORS[Z] || '#ffffff';
    },
    
    // Get current mode info
    getCurrentElectronMode() {
      return ELECTRON_MODES[this.electronMode];
    },
    
    getCurrentColliderMode() {
      return COLLIDER_MODES[this.colliderMode];
    }
  };
  
  // Export constants
  CHEMVENTUR.MolecularSystem.BOND_TYPES = BOND_TYPES;
  CHEMVENTUR.MolecularSystem.MOLECULES = MOLECULES;
  CHEMVENTUR.MolecularSystem.REACTIONS = REACTIONS;
  CHEMVENTUR.MolecularSystem.ELECTRON_MODES = ELECTRON_MODES;
  CHEMVENTUR.MolecularSystem.COLLIDER_MODES = COLLIDER_MODES;
  CHEMVENTUR.MolecularSystem.EMISSION_COLORS = EMISSION_COLORS;
  CHEMVENTUR.MolecularSystem.ISOTOPES = ISOTOPES;
  
})();
