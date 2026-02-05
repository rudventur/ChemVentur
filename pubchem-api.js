/* ============================================
   🌐 CHEMVENTUR - PUBCHEM API FETCHER
   ============================================
   
   Live molecule search from PubChem database
   100+ million compounds available!
   
   Requires network access enabled.
   
   API Endpoints:
   - Search by name: /compound/name/{name}/JSON
   - Get by CID: /compound/cid/{cid}/JSON  
   - Get 2D coords: /compound/cid/{cid}/record/JSON
   
   ============================================ */

(function() {
  
  const API_BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';
  const SCALE = 30; // pixels per Angstrom
  
  CHEMVENTUR.PubChemAPI = {
    cache: {},
    loading: false,
    lastError: null,
    
    // ===== SEARCH BY NAME =====
    async searchByName(name) {
      const url = `${API_BASE}/compound/name/${encodeURIComponent(name)}/JSON`;
      
      try {
        this.loading = true;
        CHEMVENTUR.UI?.showStatus('🔍 Searching PubChem...');
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Not found: ${name}`);
        }
        
        const data = await response.json();
        const compound = this.parseCompoundData(data);
        
        // Cache it
        if (compound) {
          this.cache[name.toLowerCase()] = compound;
          this.cache[compound.cid] = compound;
        }
        
        this.loading = false;
        return compound;
        
      } catch (err) {
        this.loading = false;
        this.lastError = err.message;
        console.warn('PubChem API error:', err);
        return null;
      }
    },
    
    // ===== GET BY CID =====
    async getByCID(cid) {
      // Check cache first
      if (this.cache[cid]) {
        return this.cache[cid];
      }
      
      const url = `${API_BASE}/compound/cid/${cid}/JSON`;
      
      try {
        this.loading = true;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`CID not found: ${cid}`);
        
        const data = await response.json();
        const compound = this.parseCompoundData(data);
        
        if (compound) {
          this.cache[cid] = compound;
        }
        
        this.loading = false;
        return compound;
        
      } catch (err) {
        this.loading = false;
        this.lastError = err.message;
        return null;
      }
    },
    
    // ===== GET 2D STRUCTURE (ATOM POSITIONS) =====
    async get2DStructure(cid) {
      const url = `${API_BASE}/compound/cid/${cid}/record/JSON?record_type=2d`;
      
      try {
        this.loading = true;
        CHEMVENTUR.UI?.showStatus('🔬 Fetching 2D structure...');
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`No 2D structure for CID: ${cid}`);
        
        const data = await response.json();
        const structure = this.parse2DStructure(data);
        
        this.loading = false;
        return structure;
        
      } catch (err) {
        this.loading = false;
        this.lastError = err.message;
        console.warn('2D structure error:', err);
        return null;
      }
    },
    
    // ===== PARSE COMPOUND DATA =====
    parseCompoundData(data) {
      if (!data.PC_Compounds || !data.PC_Compounds[0]) {
        return null;
      }
      
      const pc = data.PC_Compounds[0];
      const props = {};
      
      // Extract properties
      if (pc.props) {
        pc.props.forEach(prop => {
          const label = prop.urn?.label;
          const value = prop.value?.sval || prop.value?.ival || prop.value?.fval;
          if (label && value !== undefined) {
            props[label] = value;
          }
        });
      }
      
      return {
        cid: pc.id?.id?.cid,
        name: props['IUPAC Name'] || props['Preferred'] || 'Unknown',
        formula: props['Molecular Formula'] || '',
        mw: parseFloat(props['Molecular Weight']) || 0,
        smiles: props['SMILES'] || props['Canonical'] || '',
        inchi: props['InChI'] || '',
        source: 'pubchem-api'
      };
    },
    
    // ===== PARSE 2D STRUCTURE =====
    parse2DStructure(data) {
      if (!data.PC_Compounds || !data.PC_Compounds[0]) {
        return null;
      }
      
      const pc = data.PC_Compounds[0];
      const atoms = [];
      const bonds = [];
      
      // Get atom coordinates
      if (pc.coords && pc.coords[0]) {
        const coord = pc.coords[0];
        const conformer = coord.conformers?.[0];
        
        if (conformer && coord.aid) {
          const xs = conformer.x || [];
          const ys = conformer.y || [];
          
          coord.aid.forEach((aid, i) => {
            atoms.push({
              id: aid,
              x: xs[i] || 0,
              y: ys[i] || 0,
              element: this.getElementSymbol(pc.atoms?.element?.[i] || 6),
              Z: pc.atoms?.element?.[i] || 6
            });
          });
        }
      }
      
      // Get bonds
      if (pc.bonds) {
        const aid1 = pc.bonds.aid1 || [];
        const aid2 = pc.bonds.aid2 || [];
        const order = pc.bonds.order || [];
        
        for (let i = 0; i < aid1.length; i++) {
          bonds.push({
            a1: aid1[i] - 1, // Convert to 0-indexed
            a2: aid2[i] - 1,
            order: order[i] || 1
          });
        }
      }
      
      return { atoms, bonds };
    },
    
    // ===== ELEMENT NUMBER TO SYMBOL =====
    getElementSymbol(Z) {
      const symbols = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
                       'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca'];
      return symbols[Z] || 'X';
    },
    
    // ===== SPAWN FROM API =====
    async spawnFromAPI(name) {
      // First get basic info
      const compound = await this.searchByName(name);
      if (!compound) {
        CHEMVENTUR.UI?.showStatus('❌ Molecule not found: ' + name);
        return null;
      }
      
      // Then get 2D structure
      const structure = await this.get2DStructure(compound.cid);
      if (!structure || !structure.atoms.length) {
        CHEMVENTUR.UI?.showStatus('⚠️ No structure data, spawning as blob');
        // Fallback to blob spawn
        return this.spawnAsBlob(compound);
      }
      
      // Spawn as real bonded atoms!
      return this.spawnWithStructure(compound, structure);
    },
    
    // ===== SPAWN WITH REAL STRUCTURE =====
    spawnWithStructure(compound, structure) {
      const game = CHEMVENTUR.Game;
      const MolSys = CHEMVENTUR.MolecularSystem;
      const Particles = CHEMVENTUR.Particles;
      
      const centerX = game.ship.x;
      const centerY = game.ship.y - 50;
      
      // Find bounds to center molecule
      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;
      
      structure.atoms.forEach(a => {
        minX = Math.min(minX, a.x);
        maxX = Math.max(maxX, a.x);
        minY = Math.min(minY, a.y);
        maxY = Math.max(maxY, a.y);
      });
      
      const offsetX = (minX + maxX) / 2;
      const offsetY = (minY + maxY) / 2;
      
      // Create atoms
      const spawnedAtoms = [];
      
      structure.atoms.forEach((atomData, i) => {
        const x = centerX + (atomData.x - offsetX) * SCALE;
        const y = centerY + (atomData.y - offsetY) * SCALE;
        
        const atom = Particles.createAtom(x, y, atomData.Z, atomData.Z, atomData.Z, {
          vx: (Math.random() - 0.5) * 2,
          vy: 2
        });
        
        atom.moleculeName = compound.name;
        atom.moleculeCID = compound.cid;
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
          
          atom1.bonds = atom1.bonds || [];
          atom2.bonds = atom2.bonds || [];
          
          const bond = {
            atom1, atom2,
            type: bondType,
            strength: bondData.order || 1,
            length: Math.hypot(atom2.x - atom1.x, atom2.y - atom1.y),
            color: bondType === 'TRIPLE' ? '#00ffff' : 
                   bondType === 'DOUBLE' ? '#ffff00' : '#00ff41',
            width: (bondData.order || 1) * 2,
            vibration: 0,
            order: bondData.order || 1,
            id: Math.random().toString(36).substr(2, 9)
          };
          
          atom1.bonds.push(bond);
          atom2.bonds.push(bond);
          MolSys.bonds.push(bond);
        }
      });
      
      CHEMVENTUR.UI?.showStatus(`🔬 ${compound.name} (CID:${compound.cid}) - ${spawnedAtoms.length} atoms!`);
      
      return { compound, atoms: spawnedAtoms, bonds: structure.bonds };
    },
    
    // ===== SPAWN AS BLOB (FALLBACK) =====
    spawnAsBlob(compound) {
      const game = CHEMVENTUR.Game;
      
      const particle = {
        x: game.ship.x,
        y: game.ship.y - 50,
        vx: (Math.random() - 0.5) * 2,
        vy: 2,
        name: compound.name,
        formula: compound.formula,
        cid: compound.cid,
        mw: compound.mw,
        isMolecule: true,
        isPubChem: true,
        size: 15,
        color: '#00ff41',
        emoji: '🔬'
      };
      
      game.atoms.push(particle);
      CHEMVENTUR.UI?.showStatus(`🔬 ${compound.name} (no structure)`);
      
      return { compound, particle };
    },
    
    // ===== CHECK IF API IS AVAILABLE =====
    async checkConnection() {
      try {
        const response = await fetch(`${API_BASE}/compound/cid/2244/property/MolecularFormula/JSON`, {
          method: 'HEAD'
        });
        return response.ok;
      } catch {
        return false;
      }
    }
  };
  
  // ===== EXTEND UI FOR LIVE SEARCH =====
  
  CHEMVENTUR.UI.searchPubChemLive = async function() {
    const query = document.getElementById('pubchem-search').value;
    const resultsDiv = document.getElementById('pubchem-results');
    
    if (!query || query.length < 2) {
      resultsDiv.innerHTML = '<div style="color:#888">Type at least 2 characters...</div>';
      return;
    }
    
    // First check local
    const localResults = CHEMVENTUR.PubChem.searchByName(query);
    if (localResults) {
      // Show local results
      this.searchPubChem();
      return;
    }
    
    // Try live API
    resultsDiv.innerHTML = '<div style="color:#00ffff">🔍 Searching PubChem API...</div>';
    
    const compound = await CHEMVENTUR.PubChemAPI.searchByName(query);
    
    if (compound) {
      resultsDiv.innerHTML = `
        <div style="color:#00ff41;margin-bottom:5px;">✅ Found on PubChem!</div>
        ${this.renderPubChemResult({
          ...compound,
          key: query.toLowerCase(),
          emoji: '🔬',
          desc: 'From PubChem API'
        })}
        <button class="btn full-width mt-sm" onclick="CHEMVENTUR.PubChemAPI.spawnFromAPI('${query}')" 
                style="background:#00ff41;color:#000;">
          🚀 Spawn with Real Structure!
        </button>
      `;
    } else {
      resultsDiv.innerHTML = `<div style="color:#ff6666">❌ Not found: "${query}"</div>`;
    }
  };
  
  console.log('🌐 PubChem API module loaded! Ready for live search when network enabled.');
  
})();
