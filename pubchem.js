/* ============================================
   🔬 CHEMVENTUR - PUBCHEM INTEGRATION 🔬
   ============================================
   
   Search molecules by name, formula, or CID
   Local database + structure for PubChem API
   
   PubChem API (when network available):
   https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{name}/JSON
   
   ============================================ */

(function() {
  
  // ===== PUBCHEM DATABASE (Offline Cache) =====
  // CID = PubChem Compound ID
  
  const PUBCHEM_DB = {
    // === WATER & SIMPLE ===
    'water': { cid: 962, name: 'Water', formula: 'H2O', mw: 18.015, atoms: {H:2, O:1}, 
      smiles: 'O', color: '#00bfff', emoji: '💧', 
      desc: 'Universal solvent, essential for life' },
    
    'hydrogen peroxide': { cid: 784, name: 'Hydrogen Peroxide', formula: 'H2O2', mw: 34.014, atoms: {H:2, O:2},
      smiles: 'OO', color: '#e0ffff', emoji: '💧',
      desc: 'Oxidizer, antiseptic' },
    
    // === ORGANIC BASICS ===
    'methane': { cid: 297, name: 'Methane', formula: 'CH4', mw: 16.043, atoms: {C:1, H:4},
      smiles: 'C', color: '#ffcccc', emoji: '💨',
      desc: 'Simplest hydrocarbon, natural gas' },
    
    'ethanol': { cid: 702, name: 'Ethanol', formula: 'C2H6O', mw: 46.069, atoms: {C:2, H:6, O:1},
      smiles: 'CCO', color: '#fff8dc', emoji: '🍺',
      desc: 'Drinking alcohol' },
    
    'methanol': { cid: 887, name: 'Methanol', formula: 'CH4O', mw: 32.042, atoms: {C:1, H:4, O:1},
      smiles: 'CO', color: '#e0ffff', emoji: '☠️',
      desc: 'Wood alcohol - TOXIC!' },
    
    'acetone': { cid: 180, name: 'Acetone', formula: 'C3H6O', mw: 58.08, atoms: {C:3, H:6, O:1},
      smiles: 'CC(=O)C', color: '#f5fffa', emoji: '💅',
      desc: 'Nail polish remover, solvent' },
    
    'acetic acid': { cid: 176, name: 'Acetic Acid', formula: 'C2H4O2', mw: 60.052, atoms: {C:2, H:4, O:2},
      smiles: 'CC(=O)O', color: '#fffaf0', emoji: '🍶',
      desc: 'Vinegar' },
    
    'benzene': { cid: 241, name: 'Benzene', formula: 'C6H6', mw: 78.114, atoms: {C:6, H:6},
      smiles: 'c1ccccc1', color: '#fff0f5', emoji: '⬡',
      desc: 'Aromatic ring - carcinogenic!' },
    
    'toluene': { cid: 1140, name: 'Toluene', formula: 'C7H8', mw: 92.141, atoms: {C:7, H:8},
      smiles: 'Cc1ccccc1', color: '#ffe4e1', emoji: '🎨',
      desc: 'Paint thinner solvent' },
    
    // === SUGARS ===
    'glucose': { cid: 5793, name: 'Glucose', formula: 'C6H12O6', mw: 180.156, atoms: {C:6, H:12, O:6},
      smiles: 'OC[C@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O', color: '#ffffff', emoji: '🍬',
      desc: 'Blood sugar, energy source' },
    
    'fructose': { cid: 5984, name: 'Fructose', formula: 'C6H12O6', mw: 180.156, atoms: {C:6, H:12, O:6},
      smiles: 'OC[C@H]1OC(O)(CO)[C@@H](O)[C@@H]1O', color: '#fffaf0', emoji: '🍎',
      desc: 'Fruit sugar' },
    
    'sucrose': { cid: 5988, name: 'Sucrose', formula: 'C12H22O11', mw: 342.297, atoms: {C:12, H:22, O:11},
      color: '#ffffff', emoji: '🍭',
      desc: 'Table sugar' },
    
    // === AMINO ACIDS ===
    'glycine': { cid: 750, name: 'Glycine', formula: 'C2H5NO2', mw: 75.067, atoms: {C:2, H:5, N:1, O:2},
      smiles: 'NCC(=O)O', color: '#f0fff0', emoji: '🧬',
      desc: 'Simplest amino acid' },
    
    'alanine': { cid: 5950, name: 'Alanine', formula: 'C3H7NO2', mw: 89.094, atoms: {C:3, H:7, N:1, O:2},
      smiles: 'CC(N)C(=O)O', color: '#f5f5dc', emoji: '🧬',
      desc: 'Common amino acid' },
    
    // === CAFFEINE & STIMULANTS ===
    'caffeine': { cid: 2519, name: 'Caffeine', formula: 'C8H10N4O2', mw: 194.194, atoms: {C:8, H:10, N:4, O:2},
      smiles: 'Cn1cnc2c1c(=O)n(c(=O)n2C)C', color: '#4a2c2a', emoji: '☕',
      desc: 'Coffee stimulant' },
    
    'nicotine': { cid: 89594, name: 'Nicotine', formula: 'C10H14N2', mw: 162.236, atoms: {C:10, H:14, N:2},
      smiles: 'CN1CCC[C@H]1c2cccnc2', color: '#deb887', emoji: '🚬',
      desc: 'Tobacco alkaloid' },
    
    'theobromine': { cid: 5429, name: 'Theobromine', formula: 'C7H8N4O2', mw: 180.167, atoms: {C:7, H:8, N:4, O:2},
      color: '#8b4513', emoji: '🍫',
      desc: 'Chocolate compound' },
    
    // === MEDICINES ===
    'aspirin': { cid: 2244, name: 'Aspirin', formula: 'C9H8O4', mw: 180.159, atoms: {C:9, H:8, O:4},
      smiles: 'CC(=O)Oc1ccccc1C(=O)O', color: '#ffffff', emoji: '💊',
      desc: 'Pain reliever, anti-inflammatory' },
    
    'ibuprofen': { cid: 3672, name: 'Ibuprofen', formula: 'C13H18O2', mw: 206.285, atoms: {C:13, H:18, O:2},
      color: '#fffaf0', emoji: '💊',
      desc: 'NSAID pain reliever' },
    
    'paracetamol': { cid: 1983, name: 'Paracetamol', formula: 'C8H9NO2', mw: 151.165, atoms: {C:8, H:9, N:1, O:2},
      smiles: 'CC(=O)Nc1ccc(O)cc1', color: '#ffffff', emoji: '💊',
      desc: 'Acetaminophen / Tylenol' },
    
    'acetaminophen': { cid: 1983, name: 'Acetaminophen', formula: 'C8H9NO2', mw: 151.165, atoms: {C:8, H:9, N:1, O:2},
      color: '#ffffff', emoji: '💊',
      desc: 'Tylenol' },
    
    'penicillin': { cid: 5904, name: 'Penicillin G', formula: 'C16H18N2O4S', mw: 334.39, atoms: {C:16, H:18, N:2, O:4, S:1},
      color: '#fffacd', emoji: '💉',
      desc: 'First antibiotic' },
    
    // === NEUROTRANSMITTERS ===
    'dopamine': { cid: 681, name: 'Dopamine', formula: 'C8H11NO2', mw: 153.181, atoms: {C:8, H:11, N:1, O:2},
      smiles: 'NCCc1ccc(O)c(O)c1', color: '#ff69b4', emoji: '🧠',
      desc: 'Pleasure/reward neurotransmitter' },
    
    'serotonin': { cid: 5202, name: 'Serotonin', formula: 'C10H12N2O', mw: 176.215, atoms: {C:10, H:12, N:2, O:1},
      smiles: 'NCCc1c[nH]c2ccc(O)cc12', color: '#9370db', emoji: '😊',
      desc: 'Mood neurotransmitter' },
    
    'adrenaline': { cid: 5816, name: 'Adrenaline', formula: 'C9H13NO3', mw: 183.207, atoms: {C:9, H:13, N:1, O:3},
      color: '#ff4500', emoji: '⚡',
      desc: 'Fight or flight hormone' },
    
    'epinephrine': { cid: 5816, name: 'Epinephrine', formula: 'C9H13NO3', mw: 183.207, atoms: {C:9, H:13, N:1, O:3},
      color: '#ff4500', emoji: '⚡',
      desc: 'Adrenaline' },
    
    'melatonin': { cid: 896, name: 'Melatonin', formula: 'C13H16N2O2', mw: 232.283, atoms: {C:13, H:16, N:2, O:2},
      color: '#191970', emoji: '🌙',
      desc: 'Sleep hormone' },
    
    // === VITAMINS ===
    'vitamin c': { cid: 54670067, name: 'Vitamin C', formula: 'C6H8O6', mw: 176.124, atoms: {C:6, H:8, O:6},
      color: '#ffa500', emoji: '🍊',
      desc: 'Ascorbic acid, antioxidant' },
    
    'ascorbic acid': { cid: 54670067, name: 'Ascorbic Acid', formula: 'C6H8O6', mw: 176.124, atoms: {C:6, H:8, O:6},
      color: '#ffa500', emoji: '🍊',
      desc: 'Vitamin C' },
    
    // === PSYCHEDELICS ===
    'psilocybin': { cid: 10624, name: 'Psilocybin', formula: 'C12H17N2O4P', mw: 284.252, atoms: {C:12, H:17, N:2, O:4, P:1},
      color: '#8b4513', emoji: '🍄',
      desc: 'Magic mushroom compound' },
    
    'dmt': { cid: 6089, name: 'DMT', formula: 'C12H16N2', mw: 188.274, atoms: {C:12, H:16, N:2},
      smiles: 'CN(C)CCc1c[nH]c2ccccc12', color: '#ff6600', emoji: '🍄',
      desc: 'Dimethyltryptamine - Spirit Molecule' },
    
    'lsd': { cid: 5761, name: 'LSD', formula: 'C20H25N3O', mw: 323.439, atoms: {C:20, H:25, N:3, O:1},
      color: '#ff00ff', emoji: '🌈',
      desc: 'Lysergic acid diethylamide' },
    
    'mescaline': { cid: 4076, name: 'Mescaline', formula: 'C11H17NO3', mw: 211.261, atoms: {C:11, H:17, N:1, O:3},
      color: '#00ff00', emoji: '🌵',
      desc: 'Peyote cactus alkaloid' },
    
    'thc': { cid: 16078, name: 'THC', formula: 'C21H30O2', mw: 314.469, atoms: {C:21, H:30, O:2},
      color: '#228b22', emoji: '🌿',
      desc: 'Cannabis psychoactive compound' },
    
    'cbd': { cid: 644019, name: 'CBD', formula: 'C21H30O2', mw: 314.469, atoms: {C:21, H:30, O:2},
      color: '#32cd32', emoji: '🌱',
      desc: 'Cannabidiol - non-psychoactive' },
    
    // === GASES ===
    'carbon dioxide': { cid: 280, name: 'Carbon Dioxide', formula: 'CO2', mw: 44.009, atoms: {C:1, O:2},
      smiles: 'O=C=O', color: '#cccccc', emoji: '💨',
      desc: 'Greenhouse gas, respiration product' },
    
    'oxygen': { cid: 977, name: 'Oxygen', formula: 'O2', mw: 31.998, atoms: {O:2},
      smiles: 'O=O', color: '#87ceeb', emoji: '💨',
      desc: 'Essential for respiration' },
    
    'nitrogen': { cid: 947, name: 'Nitrogen', formula: 'N2', mw: 28.014, atoms: {N:2},
      smiles: 'N#N', color: '#add8e6', emoji: '💨',
      desc: '78% of atmosphere' },
    
    'ammonia': { cid: 222, name: 'Ammonia', formula: 'NH3', mw: 17.031, atoms: {N:1, H:3},
      smiles: 'N', color: '#e6e6fa', emoji: '💨',
      desc: 'Pungent cleaning agent' },
    
    'hydrogen sulfide': { cid: 402, name: 'Hydrogen Sulfide', formula: 'H2S', mw: 34.08, atoms: {H:2, S:1},
      smiles: 'S', color: '#ffff99', emoji: '💨',
      desc: 'Rotten egg smell - toxic!' },
    
    // === CHLOROPHYLL & PIGMENTS ===
    'chlorophyll': { cid: 12085802, name: 'Chlorophyll a', formula: 'C55H72MgN4O5', mw: 893.509, atoms: {C:55, H:72, Mg:1, N:4, O:5},
      color: '#228b22', emoji: '🌿',
      desc: 'Photosynthesis pigment' },
    
    'beta carotene': { cid: 5280489, name: 'Beta-Carotene', formula: 'C40H56', mw: 536.888, atoms: {C:40, H:56},
      color: '#ff8c00', emoji: '🥕',
      desc: 'Orange pigment, Vitamin A precursor' },
    
    // === CHOLESTEROL & LIPIDS ===
    'cholesterol': { cid: 5997, name: 'Cholesterol', formula: 'C27H46O', mw: 386.664, atoms: {C:27, H:46, O:1},
      color: '#fffacd', emoji: '💛',
      desc: 'Cell membrane component' },
    
    // === ATP & NUCLEOTIDES ===
    'atp': { cid: 5957, name: 'ATP', formula: 'C10H16N5O13P3', mw: 507.181, atoms: {C:10, H:16, N:5, O:13, P:3},
      color: '#ff4500', emoji: '⚡',
      desc: 'Energy currency of cells' },
    
    'adenosine': { cid: 60961, name: 'Adenosine', formula: 'C10H13N5O4', mw: 267.245, atoms: {C:10, H:13, N:5, O:4},
      color: '#ff6347', emoji: '🧬',
      desc: 'Nucleoside, sleep regulator' }
  };
  
  // ===== PUBCHEM LOOKUP SYSTEM =====
  
  CHEMVENTUR.PubChem = {
    db: PUBCHEM_DB,
    searchHistory: [],
    
    // Search by name (case insensitive)
    searchByName(query) {
      const q = query.toLowerCase().trim();
      
      // Direct match
      if (PUBCHEM_DB[q]) {
        return { ...PUBCHEM_DB[q], source: 'local' };
      }
      
      // Partial match
      const matches = [];
      for (const [key, compound] of Object.entries(PUBCHEM_DB)) {
        if (key.includes(q) || compound.name.toLowerCase().includes(q)) {
          matches.push({ key, ...compound });
        }
      }
      
      return matches.length > 0 ? matches : null;
    },
    
    // Search by formula
    searchByFormula(formula) {
      const matches = [];
      for (const [key, compound] of Object.entries(PUBCHEM_DB)) {
        if (compound.formula.toLowerCase() === formula.toLowerCase()) {
          matches.push({ key, ...compound });
        }
      }
      return matches.length > 0 ? matches : null;
    },
    
    // Search by CID
    searchByCID(cid) {
      for (const [key, compound] of Object.entries(PUBCHEM_DB)) {
        if (compound.cid === cid) {
          return { key, ...compound, source: 'local' };
        }
      }
      return null;
    },
    
    // Get all compounds in a category
    getCategory(category) {
      const categories = {
        sugars: ['glucose', 'fructose', 'sucrose'],
        medicines: ['aspirin', 'ibuprofen', 'paracetamol', 'penicillin'],
        stimulants: ['caffeine', 'nicotine', 'theobromine'],
        neurotransmitters: ['dopamine', 'serotonin', 'adrenaline', 'melatonin'],
        psychedelics: ['psilocybin', 'dmt', 'lsd', 'mescaline', 'thc', 'cbd'],
        gases: ['oxygen', 'nitrogen', 'carbon dioxide', 'ammonia', 'hydrogen sulfide'],
        alcohols: ['ethanol', 'methanol'],
        amino_acids: ['glycine', 'alanine'],
        vitamins: ['vitamin c']
      };
      
      const names = categories[category];
      if (!names) return null;
      
      return names.map(name => ({ key: name, ...PUBCHEM_DB[name] })).filter(c => c.cid);
    },
    
    // Get random compound
    getRandom() {
      const keys = Object.keys(PUBCHEM_DB);
      const key = keys[Math.floor(Math.random() * keys.length)];
      return { key, ...PUBCHEM_DB[key] };
    },
    
    // Create rain particle from compound
    createParticle(compound, x, y) {
      return {
        x, y,
        vx: (Math.random() - 0.5) * 2,
        vy: 2 + Math.random() * 3,
        name: compound.name,
        formula: compound.formula,
        cid: compound.cid,
        atoms: compound.atoms,
        color: compound.color || '#ffffff',
        emoji: compound.emoji || '🔬',
        desc: compound.desc,
        mw: compound.mw,
        isMolecule: true,
        isPubChem: true,
        size: 12 + Math.log(compound.mw || 100) * 3,
        createTime: Date.now()
      };
    },
    
    // Get compound count
    getCount() {
      return Object.keys(PUBCHEM_DB).length;
    },
    
    // List all compounds
    listAll() {
      return Object.entries(PUBCHEM_DB).map(([key, c]) => ({
        key, name: c.name, formula: c.formula, cid: c.cid, emoji: c.emoji
      }));
    }
  };
  
  // ===== UI INTEGRATION =====
  
  // Add PubChem search to UI
  CHEMVENTUR.UI.openPubChemSearch = function() {
    const panel = document.getElementById('pubchem-panel');
    if (panel) {
      panel.classList.add('visible');
      document.getElementById('pubchem-search').focus();
    }
  };
  
  CHEMVENTUR.UI.closePubChemSearch = function() {
    const panel = document.getElementById('pubchem-panel');
    if (panel) panel.classList.remove('visible');
  };
  
  CHEMVENTUR.UI.searchPubChem = function() {
    const query = document.getElementById('pubchem-search').value;
    const resultsDiv = document.getElementById('pubchem-results');
    
    if (!query || query.length < 2) {
      resultsDiv.innerHTML = '<div style="color:#888">Type at least 2 characters...</div>';
      return;
    }
    
    const results = CHEMVENTUR.PubChem.searchByName(query);
    
    if (!results) {
      resultsDiv.innerHTML = '<div style="color:#ff6666">No compounds found for "' + query + '"</div>';
      return;
    }
    
    // Single result
    if (results.cid) {
      resultsDiv.innerHTML = this.renderPubChemResult(results);
      return;
    }
    
    // Multiple results
    let html = `<div style="color:#00ff41;margin-bottom:8px;">Found ${results.length} compounds:</div>`;
    results.slice(0, 10).forEach(r => {
      html += this.renderPubChemResult(r);
    });
    
    resultsDiv.innerHTML = html;
  };
  
  CHEMVENTUR.UI.renderPubChemResult = function(compound) {
    return `
      <div class="pubchem-result" onclick="CHEMVENTUR.UI.spawnPubChemCompound('${compound.key || compound.name.toLowerCase()}')" 
           style="background:rgba(0,255,65,0.1);border:1px solid #00ff41;border-radius:5px;padding:8px;margin:4px 0;cursor:pointer;">
        <div style="font-size:14px;font-weight:bold;">
          ${compound.emoji || '🔬'} ${compound.name}
          <span style="color:#888;font-size:10px;float:right;">CID: ${compound.cid}</span>
        </div>
        <div style="font-size:11px;color:#00ffff;">${compound.formula} • MW: ${compound.mw?.toFixed(2) || '?'}</div>
        <div style="font-size:9px;color:#888;margin-top:2px;">${compound.desc || ''}</div>
      </div>
    `;
  };
  
  CHEMVENTUR.UI.spawnPubChemCompound = function(key) {
    const compound = CHEMVENTUR.PubChem.db[key];
    if (!compound) return;
    
    const game = CHEMVENTUR.Game;
    const structures = CHEMVENTUR.MoleculeStructures;
    
    // Try to spawn as REAL structure with bonds!
    if (structures && structures[key]) {
      const result = structures.spawn(key, game.ship.x, game.ship.y - 50);
      if (result) {
        this.showStatus(`🔬 Spawned REAL ${compound.name} (${result.atoms.length} atoms bonded!)`);
        this.closePubChemSearch();
        CHEMVENTUR.Audio?.click?.();
        return;
      }
    }
    
    // Fallback: spawn as single particle (old way)
    const particle = CHEMVENTUR.PubChem.createParticle(
      compound,
      game.ship.x,
      game.ship.y - 50
    );
    
    game.atoms.push(particle);
    this.showStatus(`🔬 Spawned ${compound.name} (CID: ${compound.cid}) - no structure data`);
    this.closePubChemSearch();
    CHEMVENTUR.Audio?.click?.();
  };
  
  CHEMVENTUR.UI.showRandomPubChem = function() {
    const compound = CHEMVENTUR.PubChem.getRandom();
    document.getElementById('pubchem-results').innerHTML = this.renderPubChemResult(compound);
  };
  
  // ===== EXTEND RENDERER FOR PUBCHEM MOLECULES =====
  
  const originalDrawAtom = CHEMVENTUR.Renderer.drawAtom;
  const moleculeDrawAtom = CHEMVENTUR.Renderer.drawAtom; // Save the molecule-rain version
  
  CHEMVENTUR.Renderer.drawAtom = function(atom) {
    if (!atom.isPubChem) {
      return moleculeDrawAtom.call(this, atom);
    }
    
    const ctx = this.ctx;
    if (!ctx || !isFinite(atom.x) || !isFinite(atom.y)) return;
    
    ctx.save();
    
    const r = atom.size || 15;
    const color = atom.color || '#00ff41';
    
    // Glow
    const grad = ctx.createRadialGradient(atom.x, atom.y, 0, atom.x, atom.y, r * 1.5);
    grad.addColorStop(0, color);
    grad.addColorStop(0.6, color + '66');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(atom.x, atom.y, r * 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Core
    ctx.fillStyle = color;
    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(atom.x, atom.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Emoji
    if (atom.emoji) {
      ctx.font = `${r * 0.8}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(atom.emoji, atom.x, atom.y + r * 0.3);
    }
    
    // Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(atom.name, atom.x, atom.y - r - 8);
    
    // Formula
    ctx.fillStyle = '#00ffff';
    ctx.font = '8px monospace';
    ctx.fillText(atom.formula, atom.x, atom.y - r - 0);
    
    // CID badge
    ctx.fillStyle = '#333';
    ctx.fillRect(atom.x + r - 5, atom.y - r - 5, 25, 10);
    ctx.fillStyle = '#00ff41';
    ctx.font = '7px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(atom.cid, atom.x + r - 3, atom.y - r + 3);
    
    ctx.restore();
  };
  
  console.log('🔬 PubChem module loaded! ' + CHEMVENTUR.PubChem.getCount() + ' compounds available');
  
})();
