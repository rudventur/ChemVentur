/* ============================================
   CHEMVENTUR v113 - CONFIGURATION
   🎵 AUDIO + ORGANIC BONDS + WHITE HOLE MODES 🎵
   🛠️ SHIP REPAIR + MOLECULAR PHYSICS 🛠️
   ============================================ */

const CHEMVENTUR = window.CHEMVENTUR || {};

CHEMVENTUR.Config = {
  VERSION: '113',
  BUILD_DATE: '2025-01-29',
  BUILD_NAME: 'URANIUM FUSION EDITION 🛠️',
  
  PANEL_WIDTH: 360,
  MIN_WIDTH: 400,
  MIN_HEIGHT: 300,
  
  SIZES: {
    proton: 8, neutron: 8, electron: 5, positron: 5,
    blackhole: 4, whitehole: 4, wormhole: 12,
    gravityOrb: 20, timeZone: 50
  },
  
  PHYSICS: {
    GRAVITY_STRENGTH: 0.1,
    GRAVITY_INWARD_STRENGTH: 0.015,
    GRAVITY_OUTWARD_STRENGTH: 0.012,
    FRICTION: 0.99,
    BOUNCE_DAMPING: 0.8,
    FUSION_DISTANCE: 30,
    COLLISION_DISTANCE: 20,
    PROTON_DECAY_TIME: 5000,
    MAX_VELOCITY: 50
  },
  
  // ===== MOLECULAR PHYSICS (RDKit-inspired) =====
  MOLECULAR: {
    Å_TO_PX: 30,              // 1 Ångström = 30 pixels
    BOND_SPRING_K: 0.05,      // Spring force constant
    ANGLE_SPRING_K: 0.02,     // Angle spring constant
    BOND_BREAK_STRETCH: 2.0,  // Break if stretched >2x ideal length
    
    // RDKit Ideal Bond Lengths (Ångströms) - [single, double, triple]
    BOND_LENGTHS: {
      'C-C': [1.54, 1.34, 1.20],
      'C-O': [1.43, 1.21, 1.13],
      'C-N': [1.47, 1.27, 1.15],
      'C-H': [1.09, null, null],
      'N-H': [1.01, null, null],
      'O-H': [0.96, null, null],
      'N-N': [1.45, 1.25, 1.10],
      'O-O': [1.48, 1.21, null],
      'C-S': [1.82, 1.60, null],
      'C-F': [1.35, null, null],
      'C-Cl': [1.77, null, null],
      'default': [1.50, 1.30, 1.20]
    },
    
    // Hybridization Angles (degrees)
    HYBRID_ANGLES: {
      'SP': 180,      // Linear (CO2, acetylene)
      'SP2': 120,     // Trigonal planar (ethene, benzene)
      'SP3': 109.5,   // Tetrahedral (methane, water)
      'SP3D': 90,     // Trigonal bipyramidal
      'SP3D2': 90     // Octahedral
    },
    
    // Maximum valence electrons per element
    VALENCE_MAX: {
      1: 1,   // H
      6: 4,   // C
      7: 5,   // N (can be 3 normally, 5 in special cases)
      8: 2,   // O
      9: 1,   // F
      15: 5,  // P
      16: 6,  // S
      17: 1,  // Cl
      35: 1,  // Br
      53: 1   // I
    }
  },
  
  // ===== STAGE ZOOM LEVELS =====
  STAGE_ZOOM: {
    0: { // String Universe
      'zoomed.in': 2.0,
      'normal': 1.0,
      'zoomed.out': 0.5
    },
    1: { // Subatomic
      'zoomed.in': 1.5,
      'normal': 1.0,
      'zoomed.out': 0.6
    },
    2: { // Molecular (5 zoom out steps!)
      'close': 4.0,
      'in': 2.0,
      'normal': 1.0,
      'out1': 0.5,
      'out2': 0.25,
      'out3': 0.125,
      'out4': 0.0625
    }
  },
  
  // ===== HOLE DYNAMICS (UPDATED!) =====
  HOLES: {
    SPIRAL_SPEED: 0.05,
    INWARD_FORCE: 0.3,
    OUTWARD_FORCE: 0.4,
    TANGENT_FORCE: 0.4,
    MERGE_DISTANCE: 25,
    EDGE_MARGIN: 35,
    PULL_RANGE: 150,
    PUSH_RANGE: 120,
    // NEW! White hole modes
    WHITE_HOLE_MODE: 1,  // 1 = reverse transforms BH→WH, 2 = WH compress BH
    COMPRESSION_THRESHOLD: 5,  // How many WH needed to compress
    REVERSE_TRANSFORM_SPEED: 0.02  // Super slow reverse
  },
  
  // ===== TIME SCALES (UPDATED with super slow reverse) =====
  TIME_SCALES: [-0.05, -5, 0, 0.05, 0.1, 0.2, 0.5, 1, 2, 4, 6, 8, 10, 15],
  TIME_NAMES: ['Super Slow Rev', 'Reverse', 'Pause', 'Super Slow', 'Very Slow', 'Slow', 
               'Normal', 'Fast', 'Faster', 'Very Fast', 'Ultra', 
               'Extreme', 'Insane', 'Light Speed'],
  
  // ===== GRID (THREE LAYERS!) =====
  GRID: {
    CELLS: 12,
    PRESSURE_BASE: 1.0,
    PRESSURE_ATOM_ADD: 0.1,
    PRESSURE_VELOCITY_FACTOR: 0.02,
    COMPASS_ROTATION_SPEED: 0.1,
    BEND_FACTOR: 8,
    // Grid layers
    SHOW_PRESSURE: true,
    SHOW_TEMPERATURE: false,
    SHOW_MAGNETISM: false,
    // Arrows at CORNERS not centers
    ARROWS_AT_CORNERS: true
  },
  
  // ===== RAIN SYSTEM =====
  RAIN: {
    ENABLED: false,
    INTENSITY: 0.3,        // 0-1, chance per frame
    PARTICLE_TYPES: ['proton', 'neutron', 'electron'],
    INCLUDE_ATOMS: false,
    ATOM_ELEMENTS: [1, 6, 7, 8],  // H, C, N, O
    SPEED_MIN: 3,
    SPEED_MAX: 8,
    SPREAD: 0.5,           // Horizontal randomness
    ANGLE: 0               // 0 = straight down, negative = left, positive = right
  },
  
  // ===== GRAVITY OPTIONS =====
  GRAVITY: {
    MODE: 1,  // 0=none, 1=down, 2=in, 3=out
    BLACK_HOLE_GRAVITY: true,  // Central BH follows gravity mode
    STRENGTH_MULTIPLIER: 1.0
  },
  
  // ===== REVERSE TIME CHAOS =====
  REVERSE_CHAOS: {
    ENABLED: true,
    SPLIT_CHANCE: 0.002,      // Chance per frame to split atom
    LOSE_PARTICLE_CHANCE: 0.005,  // Chance to lose p/n/e
    DESTABILIZE_CHANCE: 0.001,    // Chance for random velocity
    MIN_Z_FOR_SPLIT: 3        // Minimum Z to be able to split
  },
  
  // ===== ORGANIC CHEMISTRY =====
  ORGANIC: {
    // Common organic elements
    ELEMENTS: {
      H: 1, C: 6, N: 7, O: 8, F: 9, P: 15, S: 16, Cl: 17
    },
    // Bond energies (simplified)
    BOND_DISTANCE: 35,
    BOND_STRENGTH: 0.1,
    MAX_BONDS: {
      1: 1,   // H
      6: 4,   // C
      7: 3,   // N
      8: 2,   // O
      9: 1,   // F
      15: 3,  // P
      16: 2,  // S
      17: 1   // Cl
    }
  },
  
  AUDIO: {
    ENABLED: true,
    MASTER_VOLUME: 0.1,
    DEFAULT_DURATION: 0.08,
    FFT_SIZE: 256,
    SMOOTHING: 0.8,
    SOUND_PHYSICS: {
      ENABLED: true,
      WAVE_SPEED: 0.15,
      WAVE_DAMPING: 0.92,
      WAVE_AMPLITUDE: 1.0,
      TEMP_STRENGTH: 1.0,
      PRESSURE_STRENGTH: 1.0,
      MAGNETISM_STRENGTH: 1.0,
      SHOW_WAVES: false
    },
    EQUALIZER: { HIGH: 1.0, MID: 1.0, BASS: 1.0, SUB: 1.0, MASTER: 1.0 },
    SPEAKER_ORB: { EMISSION_RADIUS: 100, DEFAULT_STRENGTH: 0.5 }
  },
  
  KEYS: {
    GUNS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    TIME: 'qwertyuiop[]\\',
    ELEMENTS: {
      'z': 1, 'x': 6, 'c': 8, 'v': 26, 'b': 7, 'n': 92, 'm': 79, 'f': 9
    },
    AUDIO: { 'space': 'toggle' }
  }
};

// ===== ELEMENT DATA =====
CHEMVENTUR.Elements = {
  SYMBOLS: [
    "", "H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne",
    "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca",
    "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn",
    "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr",
    "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn",
    "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd",
    "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb",
    "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg",
    "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac", "Th", "Pa", "U"
  ],
  
  NAMES: [
    "", "Hydrogen", "Helium", "Lithium", "Beryllium", "Boron",
    "Carbon", "Nitrogen", "Oxygen", "Fluorine", "Neon",
    "Sodium", "Magnesium", "Aluminum", "Silicon", "Phosphorus",
    "Sulfur", "Chlorine", "Argon", "Potassium", "Calcium"
  ],
  
  STABLE_ISOTOPES: {
    1: [1, 2], 2: [4], 3: [6, 7], 4: [9], 5: [10, 11],
    6: [12, 13], 7: [14, 15], 8: [16, 17, 18], 9: [19], 10: [20, 22],
    11: [23], 12: [24, 25, 26], 13: [27], 14: [28, 29, 30], 15: [31],
    16: [32, 34, 36], 17: [35, 37], 18: [36, 38, 40], 19: [39, 41],
    20: [40, 42, 43, 44, 46, 48], 26: [54, 56, 57, 58], 79: [197], 92: [238]
  },
  
  SHELL_CAPACITY: [2, 8, 18, 32, 50, 72],
  
  GROUPS: {
    alkali: [3, 11, 19, 37, 55, 87],
    alkaline: [4, 12, 20, 38, 56, 88],
    transition: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    nonmetals: [1, 6, 7, 8, 15, 16, 34],
    halogens: [9, 17, 35, 53, 85],
    noble: [2, 10, 18, 36, 54, 86],
    // NEW! Organic elements
    organic: [1, 6, 7, 8, 9, 15, 16, 17]
  },
  
  getMass(Z) {
    const isotopes = this.STABLE_ISOTOPES[Z];
    return isotopes ? isotopes[0] : Z * 2;
  },
  
  getGroup(Z) {
    for (const [group, elements] of Object.entries(this.GROUPS)) {
      if (elements.includes(Z)) return group;
    }
    return 'other';
  },
  
  getColor(Z) {
    // Special colors for organic elements
    const organicColors = {
      1: '#ffffff',  // H - white
      6: '#333333',  // C - dark gray/black
      7: '#3333ff',  // N - blue
      8: '#ff3333',  // O - red
      9: '#33ff33',  // F - green
      15: '#ff8800', // P - orange
      16: '#ffff00', // S - yellow
      17: '#00ff00'  // Cl - bright green
    };
    return organicColors[Z] || `hsl(${Z * 15}, 70%, 50%)`;
  }
};

// ===== GUN CONFIGURATIONS =====
// Keys 1-9 and 0 = 10 guns total
CHEMVENTUR.Guns = {
  1: {
    id: 1, name: 'p⁺ Proton', description: 'Shoots protons',
    special: 'proton', color: '#ff3333',
    options: {
      speed: { value: 12, min: 5, max: 30, label: 'Speed' },
      burst: { value: 1, min: 1, max: 5, label: 'Burst' },
      glow: { value: true, label: 'Glow Effect' }
    }
  },
  2: {
    id: 2, name: 'n Neutron', description: 'Shoots neutrons',
    special: 'neutron', color: '#cccccc',
    options: {
      speed: { value: 12, min: 5, max: 30, label: 'Speed' },
      burst: { value: 1, min: 1, max: 5, label: 'Burst' }
    }
  },
  3: {
    id: 3, name: 'e⁻ Electron', description: 'Electrons with MUSIC scales!',
    special: 'electron', color: '#3388ff',
    options: {
      speed: { value: 15, min: 5, max: 40, label: 'Speed' },
      burst: { value: 1, min: 1, max: 10, label: 'Burst' },
      spiral: { value: false, label: 'Spiral Path' },
      musicScale: { 
        value: 'chromatic', 
        options: ['chromatic', 'major', 'minor', 'pentatonic', 'blues', 'dorian', 'mixolydian'], 
        label: '🎵 Music Scale' 
      },
      baseNote: { value: 'C4', options: ['C3', 'C4', 'C5', 'A4'], label: '🎹 Base Note' }
    }
  },
  // Gun 4 = ZEN/RAIN with element groups!
  4: {
    id: 4, name: '☯ Zen/Rain', description: 'Watch & Rain with element groups!',
    special: 'zen', color: '#00bfff',
    options: {
      rainEnabled: { value: false, label: '🌧️ Rain ON' },
      rainIntensity: { value: 0.3, min: 0.05, max: 1, label: 'Intensity' },
      rainSpeed: { value: 5, min: 1, max: 15, label: 'Speed' },
      // Element groups from periodic table!
      rainAlkali: { value: false, label: '🔴 Alkali Metals (Li,Na,K...)' },
      rainAlkaline: { value: false, label: '🟠 Alkaline Earth (Mg,Ca...)' },
      rainTransition: { value: false, label: '🟡 Transition Metals (Fe,Cu...)' },
      rainMetalloids: { value: false, label: '🟢 Metalloids (Si,Ge...)' },
      rainNonmetals: { value: false, label: '🔵 Nonmetals (C,N,O...)' },
      rainHalogens: { value: false, label: '🟣 Halogens (F,Cl,Br...)' },
      rainNobleGas: { value: false, label: '⚪ Noble Gases (He,Ne,Ar...)' },
      rainLanthanides: { value: false, label: '🌟 Lanthanides' },
      rainActinides: { value: false, label: '☢️ Actinides' },
      // Special categories
      rainOrganic: { value: true, label: '🧬 Organic (C,H,O,N)' },
      rainIsotopes: { value: false, label: '☢️ Radioactive Isotopes' },
      rainMolecules: { value: false, label: '🔬 PubChem Molecules' }
    }
  },
  // Gun 5 = ATOM GUN + PubChem
  5: {
    id: 5, name: '⚛️ Atom Gun', description: 'Periodic Table + PubChem molecules!',
    special: null, color: '#00ff41',
    options: {
      speed: { value: 10, min: 3, max: 20, label: 'Speed' },
      ionize: { value: 0, min: -3, max: 3, label: 'Ion Charge' },
      showTrail: { value: false, label: 'Show Trail' },
      lastPubChem: { value: '', label: 'Last PubChem' }, // Stores last spawned
      spawnMode: { value: 'element', options: ['element', 'last-pubchem', 'random-molecule'], label: 'Spawn Mode' }
    }
  },
  // Gun 6 = SHOTGUN 🧬
  6: {
    id: 6, name: '🧬 Shotgun', description: 'CHAOS! All particle types!',
    special: 'shotgun', color: '#ff8800',
    options: {
      pellets: { value: 9, min: 3, max: 25, label: 'Pellets' },
      spreadMin: { value: 20, min: 10, max: 60, label: 'Min Spread°' },
      spreadMax: { value: 80, min: 30, max: 120, label: 'Max Spread°' },
      speedMin: { value: 5, min: 3, max: 15, label: 'Min Speed' },
      speedMax: { value: 18, min: 10, max: 30, label: 'Max Speed' },
      particleType: { 
        value: 'mixed', 
        options: ['proton', 'neutron', 'electron', 'positron', 'mixed', 
                  'organic-mix', 'all-chaos', 'quarks', 'leptons'], 
        label: 'Type' 
      },
      organicMode: { value: false, label: '🧬 Organic Only' },
      includeAntimatter: { value: false, label: '⚡ Include Antimatter' }
    }
  },
  // Gun 7 = ELECTROGUN with MUSIC! 🎵
  7: {
    id: 7, name: '🎵 ElectroGun', description: 'Musical electron beam!',
    special: 'electrogun', color: '#00ffff',
    options: {
      width: { value: 5, min: 1, max: 20, label: 'Width' },
      density: { value: 15, min: 5, max: 30, label: 'Density' },
      speed: { value: 20, min: 10, max: 40, label: 'Speed' },
      musicMode: { 
        value: 'chromatic', 
        options: ['chromatic', 'major', 'minor', 'pentatonic', 'blues'], 
        label: '🎵 Scale' 
      },
      // Chromatic = 13 shots (all semitones)
      // Major = 8 shots (T-T-S-T-T-T-S)
      chromaticShots: { value: 13, min: 8, max: 13, label: 'Notes (8=scale, 13=chromatic)' },
      soundEnabled: { value: true, label: '🔊 Sound ON' },
      baseFrequency: { value: 261.63, min: 100, max: 1000, label: 'Base Hz (C4=261.63)' }
    }
  },
  // Gun 8 = ANTI-GUN (Photon/Tachyon/Antimatter)
  8: {
    id: 8, name: '✨ Anti-Gun', description: 'Photon, Tachyon, Antimatter!',
    special: 'antigun', color: '#ff00ff',
    options: {
      mode: { 
        value: 'photon', 
        options: ['photon', 'tachyon', 'antimatter', 'neutrino', 'graviton'], 
        label: 'Particle' 
      },
      speed: { value: 15, min: 5, max: 30, label: 'Speed' },
      // Photon: bounces like pinball, reflects off everything
      photonBounces: { value: 10, min: 1, max: 50, label: '🎱 Photon Bounces' },
      // Tachyon: speeds up with each reflection, leaves fading trail
      tachyonSpeedup: { value: 1.1, min: 1.0, max: 2.0, label: '⚡ Tachyon Speedup' },
      tachyonTrailFade: { value: 1.0, min: 0.5, max: 3.0, label: '✨ Trail Duration (s)' },
      // Antimatter: annihilates on contact!
      antimatterYield: { value: 100, min: 10, max: 1000, label: '💥 Annihilation Energy' }
    }
  },
  // Gun 9 = GRAVITY + SPEAKER
  9: {
    id: 9, name: '🔮 Grav/Sound', description: 'Gravity orbs + Music input!',
    special: 'gravityorb', color: '#8800ff',
    options: {
      orbSize: { value: 20, min: 10, max: 50, label: 'Orb Size' },
      strength: { value: 25, min: 5, max: 100, label: 'Strength' },
      lifetime: { value: 8, min: 2, max: 30, label: 'Lifetime (s)' },
      repelMode: { value: false, label: '↔️ Repel Mode' },
      speakerMode: { value: false, label: '🔊 Speaker Mode' },
      microphoneInput: { value: false, label: '🎤 Microphone Input' },
      frequencyResponse: { value: 'bass', options: ['bass', 'mid', 'treble', 'full'], label: '🎵 Frequency' }
    }
  },
  // Gun 0 = TIME RULER
  0: {
    id: 0, name: '⏰ Time Ruler', description: 'Freeze, slow, reverse time!',
    special: 'timezone', color: '#00ffaa',
    options: {
      zoneSize: { value: 50, min: 20, max: 150, label: 'Zone Size' },
      timeEffect: { value: -5, min: -10, max: 10, label: 'Time Effect' },
      lifetime: { value: 10, min: 3, max: 60, label: 'Duration (s)' },
      visualStyle: { value: 'ripple', options: ['ripple', 'clock', 'vortex', 'matrix'], label: 'Style' },
      freezeZone: { value: false, label: '❄️ Freeze Zone' },
      reverseZone: { value: false, label: '⏪ Reverse Zone' },
      dragonSector: { value: false, label: '🐉 DRAGON SECTOR (reverse collide!)' },
      replayLastMinute: { value: false, label: '📼 Replay Last Minute' }
    }
  }
};

// ===== PERIODIC TABLE LAYOUT =====
CHEMVENTUR.PeriodicTable = {
  LAYOUT: [
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [3,4,0,0,0,0,0,0,0,0,0,0,5,6,7,8,9,10],
    [11,12,0,0,0,0,0,0,0,0,0,0,13,14,15,16,17,18],
    [19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36]
  ]
};

window.CHEMVENTUR = CHEMVENTUR;
