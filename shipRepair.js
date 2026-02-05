/* ============================================
   CHEMVENTUR v114 - SHIP REPAIR SYSTEM 🛠️
   DEFINITIVE MERGED EDITION
   THE GARAGE! Fix your ship from string damage!
   
   🛠️ THE MAGIC HAMMER AND SPANNER! 🛠️
   
   Features:
   - Resource-based repairs (scrap, energy, fusion cores)
   - Multiple repair tiers (patch, weld, overhaul, upgrade)
   - Hull upgrades for increased max HP
   - Shield system support
   - Integration with StringSystem damage
   ============================================ */

(function() {
  
  CHEMVENTUR.ShipRepair = {
    // 🛠️ Repair costs and options
    REPAIR_OPTIONS: {
      patch: {
        name: '🩹 Quick Patch',
        icon: '🩹',
        cost: 10,        // Cost in captured particles
        repairAmount: 15,
        time: 1000,      // ms
        description: 'Slap some duct tape on it!'
      },
      weld: {
        name: '🔧 Weld Repair', 
        icon: '🔧',
        cost: 25,
        repairAmount: 35,
        time: 2500,
        description: 'Proper welding job'
      },
      overhaul: {
        name: '🛠️ Full Overhaul',
        icon: '🛠️',
        cost: 50,
        repairAmount: 100,  // Full repair!
        time: 5000,
        description: 'Good as new! The magic hammer and spanner!'
      },
      upgrade: {
        name: '⚡ Hull Upgrade',
        icon: '⚡',
        cost: 100,
        repairAmount: 100,
        time: 8000,
        bonus: 'maxHP+25',  // Increases max HP!
        description: 'Reinforced hull - more damage resistance!'
      }
    },
    
    // Ship stats
    ship: {
      maxHP: 100,
      currentHP: 100,
      armor: 0,           // Damage reduction %
      shields: 0,         // Regenerating shield
      shieldMax: 0,
      shieldRegenRate: 0,
      upgrades: []
    },
    
    // Repair resources (earned from gameplay)
    resources: {
      scrapMetal: 0,      // From destroyed particles
      energyCells: 0,     // From captured electrons
      fusionCores: 0,     // From successful fusions
      stringEssence: 0    // From Stage 0 string combinations
    },
    
    // Garage state
    garageOpen: false,
    isRepairing: false,
    repairProgress: 0,
    currentRepairType: null,
    
    // 🛠️ Initialize the repair system
    init() {
      this.ship.currentHP = 100 - (CHEMVENTUR.StringSystem?.shipDamage || 0);
      this.createGarageUI();
      console.log('🛠️ Ship Repair System initialized!');
    },
    
    // 🛠️ Open the garage
    openGarage() {
      this.garageOpen = true;
      this.updateGarageUI();
      const garage = document.getElementById('garage-panel');
      if (garage) {
        garage.classList.add('visible');
      }
      CHEMVENTUR.UI?.showStatus('🛠️ Welcome to the Garage!');
    },
    
    // Close the garage
    closeGarage() {
      this.garageOpen = false;
      const garage = document.getElementById('garage-panel');
      if (garage) {
        garage.classList.remove('visible');
      }
    },
    
    // 🛠️ Start a repair
    startRepair(repairType) {
      const option = this.REPAIR_OPTIONS[repairType];
      if (!option) return false;
      
      // Check if we can afford it
      if (this.resources.scrapMetal < option.cost) {
        CHEMVENTUR.UI?.showStatus(`❌ Need ${option.cost} scrap metal! (Have: ${this.resources.scrapMetal})`);
        return false;
      }
      
      // Check if already at full HP (unless it's an upgrade)
      if (this.ship.currentHP >= this.ship.maxHP && !option.bonus) {
        CHEMVENTUR.UI?.showStatus('✅ Ship already at full health!');
        return false;
      }
      
      // Start repair!
      this.isRepairing = true;
      this.currentRepairType = repairType;
      this.repairProgress = 0;
      this.resources.scrapMetal -= option.cost;
      
      CHEMVENTUR.UI?.showStatus(`${option.icon} Starting ${option.name}...`);
      
      // Animate repair progress
      this.animateRepair(option);
      
      return true;
    },
    
    // 🛠️ Animate the repair process
    animateRepair(option) {
      const startTime = Date.now();
      const duration = option.time;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        this.repairProgress = Math.min(100, (elapsed / duration) * 100);
        
        this.updateRepairProgressUI();
        
        if (elapsed < duration) {
          requestAnimationFrame(animate);
        } else {
          this.completeRepair(option);
        }
      };
      
      requestAnimationFrame(animate);
    },
    
    // 🛠️ Complete the repair
    completeRepair(option) {
      this.isRepairing = false;
      this.repairProgress = 0;
      this.currentRepairType = null;
      
      // Apply repair
      this.ship.currentHP = Math.min(this.ship.maxHP, this.ship.currentHP + option.repairAmount);
      
      // Apply bonus if any
      if (option.bonus === 'maxHP+25') {
        this.ship.maxHP += 25;
        this.ship.upgrades.push('reinforced-hull');
        CHEMVENTUR.UI?.showStatus('⚡ Hull upgraded! +25 Max HP!');
      }
      
      // Sync with StringSystem
      if (CHEMVENTUR.StringSystem) {
        CHEMVENTUR.StringSystem.shipDamage = this.ship.maxHP - this.ship.currentHP;
      }
      
      CHEMVENTUR.UI?.showStatus(`${option.icon} Repair complete! HP: ${this.ship.currentHP}/${this.ship.maxHP}`);
      this.updateGarageUI();
      
      // Play repair sound
      CHEMVENTUR.Audio?.repair?.();
    },
    
    // 🛠️ Add resources from gameplay
    addResource(type, amount) {
      if (this.resources.hasOwnProperty(type)) {
        this.resources[type] += amount;
        return true;
      }
      return false;
    },
    
    // 🎨 Ship customization
    shipColor: '#00ff41',  // Default green
    hullMaterial: 'steel', // Default hull
    
    // 🎨 Available ship colors
    SHIP_COLORS: {
      green:   { name: 'Matrix Green', color: '#00ff41', glow: '#00ff41' },
      cyan:    { name: 'Cyber Cyan', color: '#00ffff', glow: '#00ffff' },
      magenta: { name: 'Plasma Pink', color: '#ff00ff', glow: '#ff00ff' },
      gold:    { name: 'Solar Gold', color: '#ffd700', glow: '#ffaa00' },
      red:     { name: 'Mars Red', color: '#ff3333', glow: '#ff0000' },
      blue:    { name: 'Neptune Blue', color: '#4488ff', glow: '#0066ff' },
      orange:  { name: 'Fusion Orange', color: '#ff8800', glow: '#ff6600' },
      white:   { name: 'Starlight', color: '#ffffff', glow: '#aaaaff' },
      purple:  { name: 'Void Purple', color: '#aa44ff', glow: '#8800ff' },
      rainbow: { name: '🌈 Rainbow', color: 'rainbow', glow: '#ffffff' }
    },
    
    // 🛡️ Hull materials
    HULL_MATERIALS: {
      steel:    { name: '🔩 Steel', armor: 0, maxHP: 100, cost: 0, desc: 'Standard hull' },
      titanium: { name: '⚪ Titanium', armor: 10, maxHP: 120, cost: 50, desc: '+10% armor, +20 HP' },
      carbon:   { name: '⬛ Carbon Fiber', armor: 5, maxHP: 150, cost: 75, desc: 'Lightweight, +50 HP' },
      tungsten: { name: '🔘 Tungsten', armor: 25, maxHP: 100, cost: 100, desc: '+25% armor, heavy' },
      uranium:  { name: '☢️ Depleted Uranium', armor: 30, maxHP: 130, cost: 200, desc: '+30% armor, +30 HP, radioactive!' },
      neutronium: { name: '⭐ Neutronium', armor: 50, maxHP: 200, cost: 500, desc: 'Ultimate hull! +50% armor, +100 HP' }
    },
    
    // 🛠️ Create the Garage UI
    createGarageUI() {
      // Check if already exists
      if (document.getElementById('garage-panel')) return;
      
      const panel = document.createElement('div');
      panel.id = 'garage-panel';
      panel.className = 'garage-panel';
      panel.innerHTML = `
        <div class="garage-header">
          <h2>🛠️ THE GARAGE 🛠️</h2>
          <button class="garage-close" onclick="CHEMVENTUR.ShipRepair.closeGarage()">✕</button>
        </div>
        
        <!-- TABS for different garage sections -->
        <div class="garage-tabs">
          <button class="garage-tab active" onclick="CHEMVENTUR.ShipRepair.showTab('status')">🚀 Status</button>
          <button class="garage-tab" onclick="CHEMVENTUR.ShipRepair.showTab('scrap')">🔩 Scrap</button>
          <button class="garage-tab" onclick="CHEMVENTUR.ShipRepair.showTab('hull')">🛡️ Hull</button>
          <button class="garage-tab" onclick="CHEMVENTUR.ShipRepair.showTab('paint')">🎨 Paint</button>
          <button class="garage-tab" onclick="CHEMVENTUR.ShipRepair.showTab('upgrades')">⬆️ Upgrades</button>
        </div>
        
        <!-- ===== STATUS TAB ===== -->
        <div class="garage-tab-content" id="tab-status">
          <div class="garage-ship-status">
            <div class="ship-visual" id="garage-ship-preview">🚀</div>
            <div class="ship-hp-display">
              <div class="hp-label">HULL INTEGRITY</div>
              <div class="hp-bar-container">
                <div class="hp-bar" id="garage-hp-bar"></div>
                <span class="hp-text" id="garage-hp-text">100/100</span>
              </div>
              <div class="hull-material-display">Hull: <span id="current-hull-name">🔩 Steel</span></div>
            </div>
          </div>
          
          <div class="garage-resources">
            <h3>📦 Resources</h3>
            <div class="resource-grid">
              <div class="resource-item">
                <span class="resource-icon">🔩</span>
                <span class="resource-name">Scrap Metal</span>
                <span class="resource-amount" id="res-scrap">0</span>
              </div>
              <div class="resource-item">
                <span class="resource-icon">⚡</span>
                <span class="resource-name">Energy Cells</span>
                <span class="resource-amount" id="res-energy">0</span>
              </div>
              <div class="resource-item">
                <span class="resource-icon">☢️</span>
                <span class="resource-name">Fusion Cores</span>
                <span class="resource-amount" id="res-fusion">0</span>
              </div>
              <div class="resource-item">
                <span class="resource-icon">🎻</span>
                <span class="resource-name">String Essence</span>
                <span class="resource-amount" id="res-string">0</span>
              </div>
            </div>
          </div>
          
          <div class="garage-repair-options">
            <h3>🔧 Repair Options</h3>
            <div class="repair-grid" id="repair-options-grid"></div>
          </div>
          
          <div class="garage-progress" id="repair-progress-container" style="display:none;">
            <div class="progress-label">🛠️ Repairing...</div>
            <div class="progress-bar-container">
              <div class="progress-bar" id="repair-progress-bar"></div>
            </div>
            <div class="progress-text" id="repair-progress-text">0%</div>
          </div>
        </div>
        
        <!-- ===== SCRAP GENERATOR TAB ===== -->
        <div class="garage-tab-content" id="tab-scrap" style="display:none;">
          <h3>🔩 SCRAP METAL GENERATOR</h3>
          <p class="garage-info">Convert your captured particles and atoms into useful scrap metal for repairs!</p>
          
          <div class="scrap-converter">
            <div class="converter-section">
              <h4>⚛️ Convert Atoms to Scrap</h4>
              <p class="converter-info">Each atom in inventory = 5 scrap metal</p>
              <div class="converter-preview">
                Atoms available: <span id="atoms-available">0</span>
                → <span id="atoms-scrap-preview">0</span> 🔩
              </div>
              <button class="btn converter-btn" onclick="CHEMVENTUR.ShipRepair.convertAtomsToScrap()">
                ⚛️ Convert All Atoms → 🔩
              </button>
            </div>
            
            <div class="converter-section">
              <h4>🎻 Convert String Essence</h4>
              <p class="converter-info">10 string essence = 15 scrap metal</p>
              <div class="converter-preview">
                Essence available: <span id="essence-available">0</span>
                → <span id="essence-scrap-preview">0</span> 🔩
              </div>
              <button class="btn converter-btn" onclick="CHEMVENTUR.ShipRepair.convertEssenceToScrap()">
                🎻 Convert Essence → 🔩
              </button>
            </div>
            
            <div class="converter-section">
              <h4>⚡ Convert Energy Cells</h4>
              <p class="converter-info">5 energy cells = 10 scrap metal</p>
              <div class="converter-preview">
                Cells available: <span id="energy-available">0</span>
                → <span id="energy-scrap-preview">0</span> 🔩
              </div>
              <button class="btn converter-btn" onclick="CHEMVENTUR.ShipRepair.convertEnergyToScrap()">
                ⚡ Convert Energy → 🔩
              </button>
            </div>
            
            <div class="converter-section special">
              <h4>🎁 FREE STARTER SCRAP</h4>
              <p class="converter-info">Get 50 free scrap to start! (Once per session)</p>
              <button class="btn converter-btn free-btn" id="free-scrap-btn" onclick="CHEMVENTUR.ShipRepair.claimFreeScrap()">
                🎁 Claim 50 Free Scrap!
              </button>
            </div>
          </div>
          
          <div class="scrap-tips">
            <h4>💡 How to Earn Resources:</h4>
            <ul>
              <li>🔩 <b>Scrap Metal</b> - Destroy particles with Anti-Stringer (Gun 8)</li>
              <li>⚡ <b>Energy Cells</b> - Capture electrons in gluon webs</li>
              <li>☢️ <b>Fusion Cores</b> - Successfully fuse atoms together</li>
              <li>🎻 <b>String Essence</b> - Build particles from strings in Stage 0</li>
            </ul>
          </div>
        </div>
        
        <!-- ===== HULL MATERIALS TAB ===== -->
        <div class="garage-tab-content" id="tab-hull" style="display:none;">
          <h3>🛡️ HULL MATERIALS</h3>
          <p class="garage-info">Upgrade your ship's hull for better protection!</p>
          
          <div class="hull-grid" id="hull-materials-grid"></div>
          
          <div class="hull-comparison">
            <h4>📊 Current Hull Stats</h4>
            <div class="stat-row"><span>Material:</span><span id="stat-material">Steel</span></div>
            <div class="stat-row"><span>Max HP:</span><span id="stat-maxhp">100</span></div>
            <div class="stat-row"><span>Armor:</span><span id="stat-armor">0%</span></div>
          </div>
        </div>
        
        <!-- ===== PAINT SHOP TAB ===== -->
        <div class="garage-tab-content" id="tab-paint" style="display:none;">
          <h3>🎨 PAINT SHOP</h3>
          <p class="garage-info">Customize your ship's appearance!</p>
          
          <div class="paint-preview">
            <div class="preview-ship" id="paint-preview-ship">▲</div>
            <div class="preview-label">Preview</div>
          </div>
          
          <div class="color-grid" id="color-picker-grid"></div>
          
          <div class="current-color-info">
            Current: <span id="current-color-name">Matrix Green</span>
          </div>
        </div>
        
        <!-- ===== UPGRADES TAB ===== -->
        <div class="garage-tab-content" id="tab-upgrades" style="display:none;">
          <h3>⬆️ SHIP UPGRADES (12 Levels Each!)</h3>
          <p class="garage-info">Spend scrap metal to permanently improve your ship!</p>
          
          <div id="upgrade-grid">
            <!-- Populated by UpgradeSystem -->
          </div>
        </div>
        
        <!-- ===== UPGRADES (shown in all tabs) ===== -->
        <div class="garage-upgrades">
          <h3>⬆️ Installed Upgrades</h3>
          <div class="upgrades-list" id="upgrades-list">
            <div class="no-upgrades">No upgrades installed</div>
          </div>
        </div>
      `;
      
      document.body.appendChild(panel);
      this.populateRepairOptions();
      this.populateHullMaterials();
      this.populateColorPicker();
      this.addGarageStyles();
    },
    
    // 🔄 Tab switching
    showTab(tabId) {
      // Hide all tabs
      document.querySelectorAll('.garage-tab-content').forEach(tab => {
        tab.style.display = 'none';
      });
      document.querySelectorAll('.garage-tab').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Show selected tab
      const tab = document.getElementById('tab-' + tabId);
      if (tab) tab.style.display = 'block';
      
      // Highlight button (check if event exists)
      if (event && event.target) {
        event.target.classList.add('active');
      }
      
      // Update upgrade grid if on upgrades tab
      if (tabId === 'upgrades' && CHEMVENTUR.UpgradeSystem) {
        CHEMVENTUR.UpgradeSystem.updateUpgradeUI();
      }
      
      // Update content
      this.updateGarageUI();
    },
    
    // 🔩 SCRAP CONVERSION FUNCTIONS
    convertAtomsToScrap() {
      const Game = CHEMVENTUR.Game;
      if (!Game || !Game.atoms || Game.atoms.length === 0) {
        CHEMVENTUR.UI?.showStatus('❌ No atoms to convert!');
        return;
      }
      
      const atomCount = Game.atoms.length;
      const scrapGained = atomCount * 5;
      
      Game.atoms = []; // Clear atoms
      this.resources.scrapMetal += scrapGained;
      
      CHEMVENTUR.UI?.showStatus(`✅ Converted ${atomCount} atoms → ${scrapGained} 🔩 scrap!`);
      this.updateGarageUI();
    },
    
    convertEssenceToScrap() {
      const essence = this.resources.stringEssence;
      if (essence < 10) {
        CHEMVENTUR.UI?.showStatus('❌ Need at least 10 string essence!');
        return;
      }
      
      const batches = Math.floor(essence / 10);
      const scrapGained = batches * 15;
      
      this.resources.stringEssence -= batches * 10;
      this.resources.scrapMetal += scrapGained;
      
      CHEMVENTUR.UI?.showStatus(`✅ Converted ${batches * 10} essence → ${scrapGained} 🔩 scrap!`);
      this.updateGarageUI();
    },
    
    convertEnergyToScrap() {
      const energy = this.resources.energyCells;
      if (energy < 5) {
        CHEMVENTUR.UI?.showStatus('❌ Need at least 5 energy cells!');
        return;
      }
      
      const batches = Math.floor(energy / 5);
      const scrapGained = batches * 10;
      
      this.resources.energyCells -= batches * 5;
      this.resources.scrapMetal += scrapGained;
      
      CHEMVENTUR.UI?.showStatus(`✅ Converted ${batches * 5} energy → ${scrapGained} 🔩 scrap!`);
      this.updateGarageUI();
    },
    
    freeScrapClaimed: false,
    
    claimFreeScrap() {
      if (this.freeScrapClaimed) {
        CHEMVENTUR.UI?.showStatus('❌ Already claimed free scrap this session!');
        return;
      }
      
      this.resources.scrapMetal += 50;
      this.freeScrapClaimed = true;
      
      const btn = document.getElementById('free-scrap-btn');
      if (btn) {
        btn.disabled = true;
        btn.textContent = '✓ Claimed!';
        btn.style.opacity = '0.5';
      }
      
      CHEMVENTUR.UI?.showStatus('🎁 Claimed 50 free scrap metal!');
      this.updateGarageUI();
    },
    
    // 🛡️ Hull material selection
    populateHullMaterials() {
      const grid = document.getElementById('hull-materials-grid');
      if (!grid) return;
      
      grid.innerHTML = '';
      
      Object.entries(this.HULL_MATERIALS).forEach(([key, mat]) => {
        const isActive = this.hullMaterial === key;
        const canAfford = this.resources.scrapMetal >= mat.cost || mat.cost === 0;
        
        const btn = document.createElement('button');
        btn.className = 'hull-option-btn' + (isActive ? ' active' : '') + (!canAfford ? ' locked' : '');
        btn.innerHTML = `
          <div class="hull-name">${mat.name}</div>
          <div class="hull-stats">
            <span>HP: ${mat.maxHP}</span>
            <span>Armor: ${mat.armor}%</span>
          </div>
          <div class="hull-cost">${mat.cost > 0 ? '🔩 ' + mat.cost : '✓ FREE'}</div>
          <div class="hull-desc">${mat.desc}</div>
        `;
        btn.onclick = () => this.selectHullMaterial(key);
        grid.appendChild(btn);
      });
    },
    
    selectHullMaterial(materialKey) {
      const mat = this.HULL_MATERIALS[materialKey];
      if (!mat) return;
      
      // Check cost
      if (mat.cost > 0 && this.resources.scrapMetal < mat.cost) {
        CHEMVENTUR.UI?.showStatus(`❌ Need ${mat.cost} 🔩 scrap metal!`);
        return;
      }
      
      // Already equipped?
      if (this.hullMaterial === materialKey) {
        CHEMVENTUR.UI?.showStatus('Already using this hull material!');
        return;
      }
      
      // Pay cost
      if (mat.cost > 0) {
        this.resources.scrapMetal -= mat.cost;
      }
      
      // Apply material
      this.hullMaterial = materialKey;
      this.ship.maxHP = mat.maxHP;
      this.ship.armor = mat.armor;
      
      // Heal to new max if current > max
      this.ship.currentHP = Math.min(this.ship.currentHP, this.ship.maxHP);
      
      CHEMVENTUR.UI?.showStatus(`🛡️ Hull upgraded to ${mat.name}!`);
      this.populateHullMaterials();
      this.updateGarageUI();
    },
    
    // 🎨 Color picker
    populateColorPicker() {
      const grid = document.getElementById('color-picker-grid');
      if (!grid) return;
      
      grid.innerHTML = '';
      
      Object.entries(this.SHIP_COLORS).forEach(([key, colorData]) => {
        const isActive = this.shipColor === colorData.color;
        
        const btn = document.createElement('button');
        btn.className = 'color-option-btn' + (isActive ? ' active' : '');
        
        if (colorData.color === 'rainbow') {
          btn.style.background = 'linear-gradient(90deg, #ff0000, #ff8800, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff)';
          btn.style.color = '#000';
        } else {
          btn.style.background = colorData.color;
          btn.style.boxShadow = `0 0 10px ${colorData.glow}`;
          // Set text color based on brightness
          btn.style.color = this.isLightColor(colorData.color) ? '#000' : '#fff';
        }
        
        btn.innerHTML = `<span>${colorData.name}</span>`;
        btn.onclick = () => this.selectShipColor(key);
        grid.appendChild(btn);
      });
    },
    
    isLightColor(color) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 128;
    },
    
    selectShipColor(colorKey) {
      const colorData = this.SHIP_COLORS[colorKey];
      if (!colorData) return;
      
      this.shipColor = colorData.color;
      
      // Update preview
      const preview = document.getElementById('paint-preview-ship');
      if (preview) {
        if (colorData.color === 'rainbow') {
          preview.style.background = 'linear-gradient(180deg, #ff0000, #ff8800, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff)';
          preview.style.webkitBackgroundClip = 'text';
          preview.style.webkitTextFillColor = 'transparent';
          preview.style.textShadow = 'none';
        } else {
          preview.style.color = colorData.color;
          preview.style.textShadow = `0 0 20px ${colorData.glow}`;
          preview.style.background = 'none';
          preview.style.webkitTextFillColor = colorData.color;
        }
      }
      
      // Update current color name
      const nameEl = document.getElementById('current-color-name');
      if (nameEl) nameEl.textContent = colorData.name;
      
      // Highlight selected button
      this.populateColorPicker();
      
      CHEMVENTUR.UI?.showStatus(`🎨 Ship color: ${colorData.name}!`);
    },
    
    // Get current ship color for renderer
    getShipColor() {
      if (this.shipColor === 'rainbow') {
        // Cycle through rainbow colors based on time
        const hue = (Date.now() / 20) % 360;
        return `hsl(${hue}, 100%, 50%)`;
      }
      return this.shipColor;
    },
    
    getShipGlow() {
      const colorKey = Object.keys(this.SHIP_COLORS).find(k => this.SHIP_COLORS[k].color === this.shipColor);
      if (colorKey) {
        return this.SHIP_COLORS[colorKey].glow;
      }
      return this.shipColor;
    },
    
    // Populate repair option buttons
    populateRepairOptions() {
      const grid = document.getElementById('repair-options-grid');
      if (!grid) return;
      
      grid.innerHTML = '';
      
      Object.entries(this.REPAIR_OPTIONS).forEach(([key, option]) => {
        const btn = document.createElement('button');
        btn.className = 'repair-option-btn';
        btn.innerHTML = `
          <div class="repair-icon">${option.icon}</div>
          <div class="repair-name">${option.name}</div>
          <div class="repair-cost">🔩 ${option.cost}</div>
          <div class="repair-amount">+${option.repairAmount} HP</div>
          <div class="repair-desc">${option.description}</div>
        `;
        btn.onclick = () => this.startRepair(key);
        grid.appendChild(btn);
      });
    },
    
    // Update garage UI
    updateGarageUI() {
      // Update HP bar
      const hpBar = document.getElementById('garage-hp-bar');
      const hpText = document.getElementById('garage-hp-text');
      const hpPercent = (this.ship.currentHP / this.ship.maxHP) * 100;
      
      if (hpBar) {
        hpBar.style.width = hpPercent + '%';
        hpBar.style.background = hpPercent > 70 ? 'linear-gradient(90deg, #00ff41, #88ff00)' :
                                  hpPercent > 40 ? 'linear-gradient(90deg, #ffff00, #ff8800)' :
                                  'linear-gradient(90deg, #ff8800, #ff0000)';
      }
      if (hpText) {
        hpText.textContent = `${Math.round(this.ship.currentHP)}/${this.ship.maxHP}`;
      }
      
      // Update resources
      const resScrap = document.getElementById('res-scrap');
      const resEnergy = document.getElementById('res-energy');
      const resFusion = document.getElementById('res-fusion');
      const resString = document.getElementById('res-string');
      
      if (resScrap) resScrap.textContent = this.resources.scrapMetal;
      if (resEnergy) resEnergy.textContent = this.resources.energyCells;
      if (resFusion) resFusion.textContent = this.resources.fusionCores;
      if (resString) resString.textContent = this.resources.stringEssence;
      
      // Update scrap converter previews
      const Game = CHEMVENTUR.Game;
      const atomCount = Game?.atoms?.length || 0;
      
      const atomsAvail = document.getElementById('atoms-available');
      const atomsPreview = document.getElementById('atoms-scrap-preview');
      if (atomsAvail) atomsAvail.textContent = atomCount;
      if (atomsPreview) atomsPreview.textContent = atomCount * 5;
      
      const essenceAvail = document.getElementById('essence-available');
      const essencePreview = document.getElementById('essence-scrap-preview');
      if (essenceAvail) essenceAvail.textContent = this.resources.stringEssence;
      if (essencePreview) essencePreview.textContent = Math.floor(this.resources.stringEssence / 10) * 15;
      
      const energyAvail = document.getElementById('energy-available');
      const energyPreview = document.getElementById('energy-scrap-preview');
      if (energyAvail) energyAvail.textContent = this.resources.energyCells;
      if (energyPreview) energyPreview.textContent = Math.floor(this.resources.energyCells / 5) * 10;
      
      // Update hull stats display
      const mat = this.HULL_MATERIALS[this.hullMaterial];
      const statMaterial = document.getElementById('stat-material');
      const statMaxHP = document.getElementById('stat-maxhp');
      const statArmor = document.getElementById('stat-armor');
      const currentHull = document.getElementById('current-hull-name');
      
      if (mat) {
        if (statMaterial) statMaterial.textContent = mat.name;
        if (statMaxHP) statMaxHP.textContent = mat.maxHP;
        if (statArmor) statArmor.textContent = mat.armor + '%';
        if (currentHull) currentHull.textContent = mat.name;
      }
      
      // Update free scrap button state
      const freeBtn = document.getElementById('free-scrap-btn');
      if (freeBtn && this.freeScrapClaimed) {
        freeBtn.disabled = true;
        freeBtn.textContent = '✓ Claimed!';
        freeBtn.style.opacity = '0.5';
      }
      
      // Update upgrades list
      const upgradesList = document.getElementById('upgrades-list');
      if (upgradesList) {
        const allUpgrades = [...this.ship.upgrades];
        if (this.hullMaterial !== 'steel') {
          allUpgrades.push(`Hull: ${this.HULL_MATERIALS[this.hullMaterial].name}`);
        }
        
        if (allUpgrades.length > 0) {
          upgradesList.innerHTML = allUpgrades.map(u => 
            `<div class="upgrade-item">✅ ${u}</div>`
          ).join('');
        } else {
          upgradesList.innerHTML = '<div class="no-upgrades">No upgrades installed</div>';
        }
      }
    },
    
    // Update repair progress UI
    updateRepairProgressUI() {
      const container = document.getElementById('repair-progress-container');
      const bar = document.getElementById('repair-progress-bar');
      const text = document.getElementById('repair-progress-text');
      
      if (this.isRepairing) {
        container.style.display = 'block';
        bar.style.width = this.repairProgress + '%';
        text.textContent = Math.round(this.repairProgress) + '%';
      } else {
        container.style.display = 'none';
      }
    },
    
    // 🛠️ Add CSS styles for the garage
    addGarageStyles() {
      if (document.getElementById('garage-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'garage-styles';
      style.textContent = `
        .garage-panel {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.9);
          width: 500px;
          max-height: 80vh;
          background: linear-gradient(135deg, #0a1a0a 0%, #001100 50%, #0a0a1a 100%);
          border: 3px solid #00ff41;
          border-radius: 15px;
          padding: 20px;
          z-index: 10000;
          overflow-y: auto;
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s ease;
          box-shadow: 0 0 50px rgba(0, 255, 65, 0.3), inset 0 0 30px rgba(0, 255, 65, 0.1);
        }
        
        .garage-panel.visible {
          opacity: 1;
          pointer-events: auto;
          transform: translate(-50%, -50%) scale(1);
        }
        
        .garage-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #00ff41;
          padding-bottom: 10px;
        }
        
        .garage-header h2 {
          color: #00ff41;
          margin: 0;
          font-family: monospace;
          text-shadow: 0 0 10px #00ff41;
        }
        
        .garage-close {
          background: transparent;
          border: 2px solid #ff3333;
          color: #ff3333;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s;
        }
        
        .garage-close:hover {
          background: #ff3333;
          color: #000;
        }
        
        .garage-ship-status {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
          padding: 15px;
          background: rgba(0, 255, 65, 0.1);
          border-radius: 10px;
        }
        
        .ship-visual {
          font-size: 48px;
          animation: shipFloat 2s ease-in-out infinite;
        }
        
        @keyframes shipFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .ship-hp-display {
          flex: 1;
        }
        
        .hp-label {
          color: #888;
          font-size: 12px;
          margin-bottom: 5px;
          font-family: monospace;
        }
        
        .hp-bar-container {
          background: #333;
          border-radius: 10px;
          height: 25px;
          position: relative;
          overflow: hidden;
        }
        
        .hp-bar {
          height: 100%;
          border-radius: 10px;
          transition: width 0.3s, background 0.3s;
        }
        
        .hp-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #fff;
          font-weight: bold;
          font-family: monospace;
          text-shadow: 0 0 5px #000;
        }
        
        .garage-resources h3,
        .garage-repair-options h3,
        .garage-upgrades h3 {
          color: #00ff41;
          font-family: monospace;
          margin: 15px 0 10px 0;
          font-size: 14px;
        }
        
        .resource-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        
        .resource-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 5px;
        }
        
        .resource-icon {
          font-size: 20px;
        }
        
        .resource-name {
          color: #888;
          font-size: 11px;
          flex: 1;
        }
        
        .resource-amount {
          color: #00ff41;
          font-weight: bold;
          font-family: monospace;
        }
        
        .repair-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        
        .repair-option-btn {
          background: rgba(0, 255, 65, 0.1);
          border: 2px solid #00ff41;
          border-radius: 10px;
          padding: 15px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        
        .repair-option-btn:hover {
          background: rgba(0, 255, 65, 0.2);
          transform: scale(1.02);
          box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
        }
        
        .repair-icon {
          font-size: 32px;
          margin-bottom: 5px;
        }
        
        .repair-name {
          color: #00ff41;
          font-weight: bold;
          font-family: monospace;
          margin-bottom: 5px;
        }
        
        .repair-cost {
          color: #ffff00;
          font-size: 12px;
          margin-bottom: 3px;
        }
        
        .repair-amount {
          color: #00ff41;
          font-size: 14px;
          font-weight: bold;
        }
        
        .repair-desc {
          color: #666;
          font-size: 10px;
          margin-top: 5px;
        }
        
        .garage-progress {
          margin: 20px 0;
          padding: 15px;
          background: rgba(255, 136, 0, 0.1);
          border: 2px solid #ff8800;
          border-radius: 10px;
        }
        
        .progress-label {
          color: #ff8800;
          font-family: monospace;
          margin-bottom: 10px;
          animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .progress-bar-container {
          background: #333;
          border-radius: 5px;
          height: 20px;
          overflow: hidden;
        }
        
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #ff8800, #ffff00);
          border-radius: 5px;
          transition: width 0.1s;
        }
        
        .progress-text {
          text-align: center;
          color: #fff;
          font-family: monospace;
          margin-top: 5px;
        }
        
        .upgrades-list {
          padding: 10px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 5px;
        }
        
        .upgrade-item {
          color: #00ff41;
          padding: 5px;
          font-family: monospace;
        }
        
        .no-upgrades {
          color: #666;
          font-style: italic;
        }
        
        /* ===== TABS ===== */
        .garage-tabs {
          display: flex;
          gap: 5px;
          margin-bottom: 15px;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
        }
        
        .garage-tab {
          flex: 1;
          padding: 10px 5px;
          background: rgba(0, 255, 65, 0.1);
          border: 2px solid #333;
          border-radius: 8px 8px 0 0;
          color: #888;
          cursor: pointer;
          font-family: monospace;
          font-size: 11px;
          transition: all 0.2s;
        }
        
        .garage-tab:hover {
          background: rgba(0, 255, 65, 0.2);
          color: #00ff41;
        }
        
        .garage-tab.active {
          background: rgba(0, 255, 65, 0.3);
          border-color: #00ff41;
          color: #00ff41;
          font-weight: bold;
        }
        
        .garage-tab-content {
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .garage-info {
          color: #888;
          font-size: 12px;
          margin-bottom: 15px;
          font-style: italic;
        }
        
        .hull-material-display {
          margin-top: 8px;
          font-size: 11px;
          color: #00ffff;
        }
        
        /* ===== SCRAP CONVERTER ===== */
        .scrap-converter {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .converter-section {
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid #333;
          border-radius: 8px;
        }
        
        .converter-section.special {
          background: rgba(255, 215, 0, 0.1);
          border-color: #ffd700;
        }
        
        .converter-section h4 {
          color: #00ff41;
          margin: 0 0 5px 0;
          font-size: 13px;
        }
        
        .converter-info {
          color: #666;
          font-size: 10px;
          margin: 5px 0;
        }
        
        .converter-preview {
          color: #00ffff;
          font-family: monospace;
          font-size: 12px;
          margin: 8px 0;
          padding: 5px;
          background: rgba(0, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        .converter-btn {
          width: 100%;
          padding: 8px;
          background: linear-gradient(90deg, #004400, #006600);
          border: 2px solid #00ff41;
          color: #00ff41;
          border-radius: 5px;
          cursor: pointer;
          font-family: monospace;
          font-size: 12px;
          transition: all 0.2s;
        }
        
        .converter-btn:hover {
          background: linear-gradient(90deg, #006600, #008800);
          box-shadow: 0 0 15px rgba(0, 255, 65, 0.5);
        }
        
        .free-btn {
          background: linear-gradient(90deg, #443300, #665500) !important;
          border-color: #ffd700 !important;
          color: #ffd700 !important;
        }
        
        .free-btn:hover {
          background: linear-gradient(90deg, #665500, #887700) !important;
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.5) !important;
        }
        
        .scrap-tips {
          margin-top: 15px;
          padding: 12px;
          background: rgba(0, 100, 255, 0.1);
          border: 1px solid #0066ff;
          border-radius: 8px;
        }
        
        .scrap-tips h4 {
          color: #00aaff;
          margin: 0 0 10px 0;
          font-size: 12px;
        }
        
        .scrap-tips ul {
          margin: 0;
          padding-left: 20px;
          font-size: 10px;
          color: #aaa;
        }
        
        .scrap-tips li {
          margin: 5px 0;
        }
        
        .scrap-tips b {
          color: #00ffff;
        }
        
        /* ===== HULL MATERIALS ===== */
        .hull-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 15px;
        }
        
        .hull-option-btn {
          padding: 12px;
          background: rgba(0, 255, 65, 0.1);
          border: 2px solid #444;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        
        .hull-option-btn:hover {
          background: rgba(0, 255, 65, 0.2);
          border-color: #00ff41;
        }
        
        .hull-option-btn.active {
          background: rgba(0, 255, 65, 0.3);
          border-color: #00ff41;
          box-shadow: 0 0 15px rgba(0, 255, 65, 0.3);
        }
        
        .hull-option-btn.locked {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .hull-name {
          color: #00ff41;
          font-weight: bold;
          font-family: monospace;
          margin-bottom: 5px;
        }
        
        .hull-stats {
          display: flex;
          gap: 10px;
          font-size: 10px;
          color: #00ffff;
          margin-bottom: 5px;
        }
        
        .hull-cost {
          color: #ffff00;
          font-size: 11px;
          margin-bottom: 5px;
        }
        
        .hull-desc {
          color: #666;
          font-size: 9px;
        }
        
        .hull-comparison {
          padding: 12px;
          background: rgba(0, 255, 255, 0.1);
          border: 1px solid #00ffff;
          border-radius: 8px;
        }
        
        .hull-comparison h4 {
          color: #00ffff;
          margin: 0 0 10px 0;
          font-size: 12px;
        }
        
        .stat-row {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #aaa;
          padding: 3px 0;
        }
        
        .stat-row span:last-child {
          color: #00ff41;
          font-weight: bold;
        }
        
        /* ===== PAINT SHOP ===== */
        .paint-preview {
          text-align: center;
          padding: 20px;
          margin-bottom: 15px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 10px;
        }
        
        .preview-ship {
          font-size: 72px;
          color: #00ff41;
          text-shadow: 0 0 30px #00ff41;
          transition: all 0.3s;
        }
        
        .preview-label {
          color: #666;
          font-size: 11px;
          margin-top: 10px;
        }
        
        .color-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          margin-bottom: 15px;
        }
        
        .color-option-btn {
          padding: 10px 5px;
          border: 2px solid #444;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 10px;
          font-weight: bold;
          text-shadow: 0 0 3px #000;
        }
        
        .color-option-btn:hover {
          transform: scale(1.05);
          border-color: #fff;
        }
        
        .color-option-btn.active {
          border-color: #fff;
          box-shadow: 0 0 20px currentColor;
          transform: scale(1.1);
        }
        
        .current-color-info {
          text-align: center;
          color: #888;
          font-size: 12px;
        }
        
        .current-color-info span {
          color: #00ff41;
          font-weight: bold;
        }
      `;
      
      document.head.appendChild(style);
    },
    
    // 🛠️ Sync with StringSystem damage
    syncWithStringSystem() {
      if (CHEMVENTUR.StringSystem) {
        const damage = CHEMVENTUR.StringSystem.shipDamage || 0;
        this.ship.currentHP = Math.max(0, this.ship.maxHP - damage);
      }
    },
    
    // 🛠️ Take damage (called from StringSystem)
    takeDamage(amount, source) {
      // Apply armor reduction
      const actualDamage = amount * (1 - this.ship.armor / 100);
      
      // Shields absorb first
      if (this.ship.shields > 0) {
        const shieldAbsorb = Math.min(this.ship.shields, actualDamage);
        this.ship.shields -= shieldAbsorb;
        const hullDamage = actualDamage - shieldAbsorb;
        this.ship.currentHP = Math.max(0, this.ship.currentHP - hullDamage);
      } else {
        this.ship.currentHP = Math.max(0, this.ship.currentHP - actualDamage);
      }
      
      // Sync back to StringSystem
      if (CHEMVENTUR.StringSystem) {
        CHEMVENTUR.StringSystem.shipDamage = this.ship.maxHP - this.ship.currentHP;
      }
      
      return actualDamage;
    }
  };
  
  console.log('🛠️ Ship Repair System loaded! The magic hammer and spanner awaits!');
})();
