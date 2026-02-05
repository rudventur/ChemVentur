/* ============================================
   🔬 CHEMVENTUR - REAL 2D MOLECULE STRUCTURES
   ============================================
   
   Real molecular geometry with:
   - Proper bond angles
   - Atom positions (scaled for game)
   - Bond orders (single, double, triple)
   
   Scale: 1 Angstrom ≈ 30 pixels
   
   ============================================ */

(function() {
  
  const SCALE = 30; // pixels per Angstrom
  
  // ===== 2D MOLECULE LIBRARY =====
  // Positions in Angstroms, converted to pixels when spawned
  
  CHEMVENTUR.MoleculeStructures = {
    
    // ===== WATER H₂O =====
    // Bond angle: 104.5°
    'water': {
      cid: 962,
      name: 'Water',
      formula: 'H₂O',
      atoms: [
        { element: 'O', Z: 8, x: 0, y: 0 },
        { element: 'H', Z: 1, x: -0.96, y: 0.28 },  // 104.5° angle
        { element: 'H', Z: 1, x: 0.96, y: 0.28 }
      ],
      bonds: [
        { a1: 0, a2: 1, order: 1 },
        { a1: 0, a2: 2, order: 1 }
      ],
      color: '#00bfff',
      emoji: '💧'
    },
    
    // ===== CARBON DIOXIDE CO₂ =====
    // Linear molecule, 180°
    'carbon dioxide': {
      cid: 280,
      name: 'Carbon Dioxide',
      formula: 'CO₂',
      atoms: [
        { element: 'C', Z: 6, x: 0, y: 0 },
        { element: 'O', Z: 8, x: -1.16, y: 0 },
        { element: 'O', Z: 8, x: 1.16, y: 0 }
      ],
      bonds: [
        { a1: 0, a2: 1, order: 2 },  // Double bond
        { a1: 0, a2: 2, order: 2 }
      ],
      color: '#cccccc',
      emoji: '💨'
    },
    
    // ===== METHANE CH₄ =====
    // Tetrahedral, but 2D projection
    'methane': {
      cid: 297,
      name: 'Methane',
      formula: 'CH₄',
      atoms: [
        { element: 'C', Z: 6, x: 0, y: 0 },
        { element: 'H', Z: 1, x: 0, y: -1.09 },
        { element: 'H', Z: 1, x: 1.03, y: 0.36 },
        { element: 'H', Z: 1, x: -1.03, y: 0.36 },
        { element: 'H', Z: 1, x: 0, y: 0.73 }  // "behind" in 2D
      ],
      bonds: [
        { a1: 0, a2: 1, order: 1 },
        { a1: 0, a2: 2, order: 1 },
        { a1: 0, a2: 3, order: 1 },
        { a1: 0, a2: 4, order: 1 }
      ],
      color: '#ffcccc',
      emoji: '💨'
    },
    
    // ===== AMMONIA NH₃ =====
    // Trigonal pyramidal
    'ammonia': {
      cid: 222,
      name: 'Ammonia',
      formula: 'NH₃',
      atoms: [
        { element: 'N', Z: 7, x: 0, y: 0 },
        { element: 'H', Z: 1, x: 0, y: -1.01 },
        { element: 'H', Z: 1, x: 0.94, y: 0.38 },
        { element: 'H', Z: 1, x: -0.94, y: 0.38 }
      ],
      bonds: [
        { a1: 0, a2: 1, order: 1 },
        { a1: 0, a2: 2, order: 1 },
        { a1: 0, a2: 3, order: 1 }
      ],
      color: '#e6e6fa',
      emoji: '💨'
    },
    
    // ===== HYDROGEN H₂ =====
    'hydrogen': {
      cid: 783,
      name: 'Hydrogen',
      formula: 'H₂',
      atoms: [
        { element: 'H', Z: 1, x: -0.37, y: 0 },
        { element: 'H', Z: 1, x: 0.37, y: 0 }
      ],
      bonds: [
        { a1: 0, a2: 1, order: 1 }
      ],
      color: '#ffffff',
      emoji: '💨'
    },
    
    // ===== OXYGEN O₂ =====
    'oxygen': {
      cid: 977,
      name: 'Oxygen',
      formula: 'O₂',
      atoms: [
        { element: 'O', Z: 8, x: -0.6, y: 0 },
        { element: 'O', Z: 8, x: 0.6, y: 0 }
      ],
      bonds: [
        { a1: 0, a2: 1, order: 2 }
      ],
      color: '#87ceeb',
      emoji: '💨'
    },
    
    // ===== NITROGEN N₂ =====
    'nitrogen': {
      cid: 947,
      name: 'Nitrogen',
      formula: 'N₂',
      atoms: [
        { element: 'N', Z: 7, x: -0.55, y: 0 },
        { element: 'N', Z: 7, x: 0.55, y: 0 }
      ],
      bonds: [
        { a1: 0, a2: 1, order: 3 }  // Triple bond!
      ],
      color: '#add8e6',
      emoji: '💨'
    },
    
    // ===== HYDROGEN PEROXIDE H₂O₂ =====
    'hydrogen peroxide': {
      cid: 784,
      name: 'Hydrogen Peroxide',
      formula: 'H₂O₂',
      atoms: [
        { element: 'O', Z: 8, x: -0.7, y: 0 },
        { element: 'O', Z: 8, x: 0.7, y: 0 },
        { element: 'H', Z: 1, x: -1.1, y: 0.8 },
        { element: 'H', Z: 1, x: 1.1, y: -0.8 }
      ],
      bonds: [
        { a1: 0, a2: 1, order: 1 },
        { a1: 0, a2: 2, order: 1 },
        { a1: 1, a2: 3, order: 1 }
      ],
      color: '#e0ffff',
      emoji: '💧'
    },
    
    // ===== ETHANOL C₂H₅OH =====
    'ethanol': {
      cid: 702,
      name: 'Ethanol',
      formula: 'C₂H₅OH',
      atoms: [
        { element: 'C', Z: 6, x: -0.77, y: 0 },      // CH3
        { element: 'C', Z: 6, x: 0.77, y: 0 },       // CH2
        { element: 'O', Z: 8, x: 1.54, y: 1.0 },     // OH
        { element: 'H', Z: 1, x: -1.2, y: -1.0 },
        { element: 'H', Z: 1, x: -1.5, y: 0.5 },
        { element: 'H', Z: 1, x: -0.77, y: 1.0 },
        { element: 'H', Z: 1, x: 0.77, y: -1.0 },
        { element: 'H', Z: 1, x: 1.2, y: -0.5 },
        { element: 'H', Z: 1, x: 2.3, y: 1.3 }       // OH hydrogen
      ],
      bonds: [
        { a1: 0, a2: 1, order: 1 },
        { a1: 1, a2: 2, order: 1 },
        { a1: 0, a2: 3, order: 1 },
        { a1: 0, a2: 4, order: 1 },
        { a1: 0, a2: 5, order: 1 },
        { a1: 1, a2: 6, order: 1 },
        { a1: 1, a2: 7, order: 1 },
        { a1: 2, a2: 8, order: 1 }
      ],
      color: '#fff8dc',
      emoji: '🍺'
    },
    
    // ===== METHANOL CH₃OH =====
    'methanol': {
      cid: 887,
      name: 'Methanol',
      formula: 'CH₃OH',
      atoms: [
        { element: 'C', Z: 6, x: 0, y: 0 },
        { element: 'O', Z: 8, x: 1.4, y: 0 },
        { element: 'H', Z: 1, x: -0.5, y: -1.0 },
        { element: 'H', Z: 1, x: -0.5, y: 1.0 },
        { element: 'H', Z: 1, x: -1.0, y: 0 },
        { element: 'H', Z: 1, x: 2.1, y: 0.6 }
      ],
      bonds: [
        { a1: 0, a2: 1, order: 1 },
        { a1: 0, a2: 2, order: 1 },
        { a1: 0, a2: 3, order: 1 },
        { a1: 0, a2: 4, order: 1 },
        { a1: 1, a2: 5, order: 1 }
      ],
      color: '#e0ffff',
      emoji: '☠️'
    },
    
    // ===== ACETONE (CH₃)₂CO =====
    'acetone': {
      cid: 180,
      name: 'Acetone',
      formula: 'C₃H₆O',
      atoms: [
        { element: 'C', Z: 6, x: 0, y: 0 },         // Central C
        { element: 'O', Z: 8, x: 0, y: -1.2 },      // =O
        { element: 'C', Z: 6, x: -1.3, y: 0.5 },    // CH3
        { element: 'C', Z: 6, x: 1.3, y: 0.5 },     // CH3
        { element: 'H', Z: 1, x: -1.8, y: -0.3 },
        { element: 'H', Z: 1, x: -0.9, y: 1.4 },
        { element: 'H', Z: 1, x: -2.0, y: 1.0 },
        { element: 'H', Z: 1, x: 1.8, y: -0.3 },
        { element: 'H', Z: 1, x: 0.9, y: 1.4 },
        { element: 'H', Z: 1, x: 2.0, y: 1.0 }
      ],
      bonds: [
        { a1: 0, a2: 1, order: 2 },  // C=O double bond
        { a1: 0, a2: 2, order: 1 },
        { a1: 0, a2: 3, order: 1 },
        { a1: 2, a2: 4, order: 1 },
        { a1: 2, a2: 5, order: 1 },
        { a1: 2, a2: 6, order: 1 },
        { a1: 3, a2: 7, order: 1 },
        { a1: 3, a2: 8, order: 1 },
        { a1: 3, a2: 9, order: 1 }
      ],
      color: '#f5fffa',
      emoji: '💅'
    },
    
    // ===== BENZENE C₆H₆ =====
    // Hexagonal ring with alternating double bonds
    'benzene': {
      cid: 241,
      name: 'Benzene',
      formula: 'C₆H₆',
      atoms: [
        // Carbon ring (hexagon)
        { element: 'C', Z: 6, x: 1.4, y: 0 },
        { element: 'C', Z: 6, x: 0.7, y: 1.21 },
        { element: 'C', Z: 6, x: -0.7, y: 1.21 },
        { element: 'C', Z: 6, x: -1.4, y: 0 },
        { element: 'C', Z: 6, x: -0.7, y: -1.21 },
        { element: 'C', Z: 6, x: 0.7, y: -1.21 },
        // Hydrogens
        { element: 'H', Z: 1, x: 2.5, y: 0 },
        { element: 'H', Z: 1, x: 1.25, y: 2.16 },
        { element: 'H', Z: 1, x: -1.25, y: 2.16 },
        { element: 'H', Z: 1, x: -2.5, y: 0 },
        { element: 'H', Z: 1, x: -1.25, y: -2.16 },
        { element: 'H', Z: 1, x: 1.25, y: -2.16 }
      ],
      bonds: [
        // Ring bonds (aromatic, shown as alternating)
        { a1: 0, a2: 1, order: 2 },
        { a1: 1, a2: 2, order: 1 },
        { a1: 2, a2: 3, order: 2 },
        { a1: 3, a2: 4, order: 1 },
        { a1: 4, a2: 5, order: 2 },
        { a1: 5, a2: 0, order: 1 },
        // C-H bonds
        { a1: 0, a2: 6, order: 1 },
        { a1: 1, a2: 7, order: 1 },
        { a1: 2, a2: 8, order: 1 },
        { a1: 3, a2: 9, order: 1 },
        { a1: 4, a2: 10, order: 1 },
        { a1: 5, a2: 11, order: 1 }
      ],
      color: '#fff0f5',
      emoji: '⬡'
    },
    
    // ===== CAFFEINE C₈H₁₀N₄O₂ =====
    'caffeine': {
      cid: 2519,
      name: 'Caffeine',
      formula: 'C₈H₁₀N₄O₂',
      atoms: [
        // Purine ring system (simplified 2D)
        { element: 'N', Z: 7, x: 0, y: 0 },
        { element: 'C', Z: 6, x: 1.2, y: 0.5 },
        { element: 'N', Z: 7, x: 1.2, y: 1.7 },
        { element: 'C', Z: 6, x: 0, y: 2.2 },
        { element: 'C', Z: 6, x: -1.0, y: 1.2 },
        { element: 'C', Z: 6, x: -1.0, y: 0 },
        { element: 'N', Z: 7, x: -2.2, y: -0.5 },
        { element: 'C', Z: 6, x: -2.2, y: 1.5 },
        { element: 'N', Z: 7, x: -3.2, y: 0.5 },
        { element: 'O', Z: 8, x: 2.3, y: 0 },      // =O
        { element: 'O', Z: 8, x: 0, y: 3.4 },      // =O
        // Methyl groups (simplified as single H for space)
        { element: 'C', Z: 6, x: 0, y: -1.2 },     // N-CH3
        { element: 'C', Z: 6, x: 2.3, y: 2.2 },    // N-CH3
        { element: 'C', Z: 6, x: -3.2, y: -1.0 }   // N-CH3
      ],
      bonds: [
        { a1: 0, a2: 1, order: 1 },
        { a1: 1, a2: 2, order: 1 },
        { a1: 2, a2: 3, order: 1 },
        { a1: 3, a2: 4, order: 1 },
        { a1: 4, a2: 5, order: 2 },
        { a1: 5, a2: 0, order: 1 },
        { a1: 4, a2: 7, order: 1 },
        { a1: 5, a2: 6, order: 1 },
        { a1: 6, a2: 8, order: 1 },
        { a1: 7, a2: 8, order: 2 },
        { a1: 1, a2: 9, order: 2 },
        { a1: 3, a2: 10, order: 2 },
        { a1: 0, a2: 11, order: 1 },
        { a1: 2, a2: 12, order: 1 },
        { a1: 6, a2: 13, order: 1 }
      ],
      color: '#4a2c2a',
      emoji: '☕'
    },
    
    // ===== DOPAMINE C₈H₁₁NO₂ =====
    'dopamine': {
      cid: 681,
      name: 'Dopamine',
      formula: 'C₈H₁₁NO₂',
      atoms: [
        // Catechol ring
        { element: 'C', Z: 6, x: 0, y: 0 },
        { element: 'C', Z: 6, x: 1.2, y: 0.7 },
        { element: 'C', Z: 6, x: 1.2, y: 2.1 },
        { element: 'C', Z: 6, x: 0, y: 2.8 },
        { element: 'C', Z: 6, x: -1.2, y: 2.1 },
        { element: 'C', Z: 6, x: -1.2, y: 0.7 },
        // OH groups
        { element: 'O', Z: 8, x: -2.4, y: 0 },
        { element: 'O', Z: 8, x: -2.4, y: 2.8 },
        // Ethylamine tail
        { element: 'C', Z: 6, x: 0, y: -1.4 },
        { element: 'C', Z: 6, x: 0, y: -2.8 },
        { element: 'N', Z: 7, x: 0, y: -4.2 },
        // Hydrogens on OH
        { element: 'H', Z: 1, x: -3.2, y: 0.5 },
        { element: 'H', Z: 1, x: -3.2, y: 2.3 }
      ],
      bonds: [
        { a1: 0, a2: 1, order: 2 },
        { a1: 1, a2: 2, order: 1 },
        { a1: 2, a2: 3, order: 2 },
        { a1: 3, a2: 4, order: 1 },
        { a1: 4, a2: 5, order: 2 },
        { a1: 5, a2: 0, order: 1 },
        { a1: 5, a2: 6, order: 1 },
        { a1: 4, a2: 7, order: 1 },
        { a1: 0, a2: 8, order: 1 },
        { a1: 8, a2: 9, order: 1 },
        { a1: 9, a2: 10, order: 1 },
        { a1: 6, a2: 11, order: 1 },
        { a1: 7, a2: 12, order: 1 }
      ],
      color: '#ff69b4',
      emoji: '🧠'
    },
    
    // ===== GLUCOSE C₆H₁₂O₆ =====
    // Pyranose ring form (6-membered)
    'glucose': {
      cid: 5793,
      name: 'Glucose',
      formula: 'C₆H₁₂O₆',
      atoms: [
        // Ring (5 C + 1 O)
        { element: 'C', Z: 6, x: 1.2, y: 0 },      // C1
        { element: 'C', Z: 6, x: 0.6, y: 1.2 },    // C2
        { element: 'C', Z: 6, x: -0.8, y: 1.2 },   // C3
        { element: 'C', Z: 6, x: -1.4, y: 0 },     // C4
        { element: 'C', Z: 6, x: -0.6, y: -1.0 },  // C5
        { element: 'O', Z: 8, x: 0.6, y: -1.0 },   // Ring O
        // CH2OH tail
        { element: 'C', Z: 6, x: -1.2, y: -2.2 },  // C6
        // OH groups
        { element: 'O', Z: 8, x: 2.4, y: 0 },      // C1-OH
        { element: 'O', Z: 8, x: 1.2, y: 2.2 },    // C2-OH
        { element: 'O', Z: 8, x: -1.4, y: 2.2 },   // C3-OH
        { element: 'O', Z: 8, x: -2.6, y: 0 },     // C4-OH
        { element: 'O', Z: 8, x: -2.4, y: -2.5 }   // C6-OH
      ],
      bonds: [
        { a1: 0, a2: 1, order: 1 },
        { a1: 1, a2: 2, order: 1 },
        { a1: 2, a2: 3, order: 1 },
        { a1: 3, a2: 4, order: 1 },
        { a1: 4, a2: 5, order: 1 },
        { a1: 5, a2: 0, order: 1 },
        { a1: 4, a2: 6, order: 1 },
        { a1: 0, a2: 7, order: 1 },
        { a1: 1, a2: 8, order: 1 },
        { a1: 2, a2: 9, order: 1 },
        { a1: 3, a2: 10, order: 1 },
        { a1: 6, a2: 11, order: 1 }
      ],
      color: '#ffffff',
      emoji: '🍬'
    },
    
    // ===== ASPIRIN C₉H₈O₄ =====
    'aspirin': {
      cid: 2244,
      name: 'Aspirin',
      formula: 'C₉H₈O₄',
      atoms: [
        // Benzene ring
        { element: 'C', Z: 6, x: 0, y: 0 },
        { element: 'C', Z: 6, x: 1.2, y: 0.7 },
        { element: 'C', Z: 6, x: 1.2, y: 2.1 },
        { element: 'C', Z: 6, x: 0, y: 2.8 },
        { element: 'C', Z: 6, x: -1.2, y: 2.1 },
        { element: 'C', Z: 6, x: -1.2, y: 0.7 },
        // COOH group
        { element: 'C', Z: 6, x: -2.4, y: 0 },
        { element: 'O', Z: 8, x: -2.4, y: -1.2 },
        { element: 'O', Z: 8, x: -3.6, y: 0.7 },
        // Acetyl group
        { element: 'O', Z: 8, x: 2.4, y: 0 },
        { element: 'C', Z: 6, x: 3.6, y: 0.7 },
        { element: 'O', Z: 8, x: 3.6, y: 1.9 },
        { element: 'C', Z: 6, x: 4.8, y: 0 }
      ],
      bonds: [
        { a1: 0, a2: 1, order: 2 },
        { a1: 1, a2: 2, order: 1 },
        { a1: 2, a2: 3, order: 2 },
        { a1: 3, a2: 4, order: 1 },
        { a1: 4, a2: 5, order: 2 },
        { a1: 5, a2: 0, order: 1 },
        { a1: 5, a2: 6, order: 1 },
        { a1: 6, a2: 7, order: 2 },
        { a1: 6, a2: 8, order: 1 },
        { a1: 1, a2: 9, order: 1 },
        { a1: 9, a2: 10, order: 1 },
        { a1: 10, a2: 11, order: 2 },
        { a1: 10, a2: 12, order: 1 }
      ],
      color: '#ffffff',
      emoji: '💊'
    }
  };
  
  // ===== SPAWN REAL MOLECULE =====
  
  CHEMVENTUR.MoleculeStructures.spawn = function(name, centerX, centerY, velocity) {
    const structure = this[name.toLowerCase()];
    if (!structure) {
      console.warn('Unknown molecule structure:', name);
      return null;
    }
    
    const game = CHEMVENTUR.Game;
    const MolSys = CHEMVENTUR.MolecularSystem;
    const Particles = CHEMVENTUR.Particles;
    
    const vx = velocity?.vx || (Math.random() - 0.5) * 2;
    const vy = velocity?.vy || 2;
    
    // Create atoms
    const spawnedAtoms = [];
    
    structure.atoms.forEach((atomData, i) => {
      const x = centerX + atomData.x * SCALE;
      const y = centerY + atomData.y * SCALE;
      
      const atom = Particles.createAtom(x, y, atomData.Z, atomData.Z, atomData.Z, {
        vx: vx,
        vy: vy
      });
      
      atom.moleculeName = structure.name;
      atom.moleculeIndex = i;
      atom.partOfMolecule = true;
      
      spawnedAtoms.push(atom);
      game.atoms.push(atom);
    });
    
    // Create bonds
    structure.bonds.forEach(bondData => {
      const atom1 = spawnedAtoms[bondData.a1];
      const atom2 = spawnedAtoms[bondData.a2];
      
      if (atom1 && atom2) {
        const bondType = bondData.order === 3 ? 'TRIPLE' : 
                        bondData.order === 2 ? 'DOUBLE' : 'SINGLE';
        
        // Force bond creation (bypass distance check)
        atom1.bonds = atom1.bonds || [];
        atom2.bonds = atom2.bonds || [];
        
        const bond = {
          atom1: atom1,
          atom2: atom2,
          type: bondType,
          strength: bondData.order || 1,
          length: Math.hypot(atom2.x - atom1.x, atom2.y - atom1.y),
          color: bondType === 'TRIPLE' ? '#00ffff' : 
                 bondType === 'DOUBLE' ? '#ffff00' : '#00ff41',
          width: bondData.order * 2,
          vibration: 0,
          order: bondData.order || 1,
          id: Math.random().toString(36).substr(2, 9)
        };
        
        atom1.bonds.push(bond);
        atom2.bonds.push(bond);
        MolSys.bonds.push(bond);
      }
    });
    
    console.log(`🔬 Spawned ${structure.name}: ${spawnedAtoms.length} atoms, ${structure.bonds.length} bonds`);
    
    return {
      atoms: spawnedAtoms,
      structure: structure
    };
  };
  
  // ===== GET LIST OF AVAILABLE STRUCTURES =====
  
  CHEMVENTUR.MoleculeStructures.list = function() {
    return Object.keys(this).filter(k => typeof this[k] === 'object' && this[k].atoms);
  };
  
  CHEMVENTUR.MoleculeStructures.getCount = function() {
    return this.list().length;
  };
  
  console.log('🔬 Molecule Structures loaded! ' + CHEMVENTUR.MoleculeStructures.getCount() + ' molecules with real 2D geometry');
  
})();
