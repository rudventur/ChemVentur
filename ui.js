/* ============================================
   CHEMVENTUR v114 - UI
   DEFINITIVE MERGED EDITION
   🎻 STRING UNIVERSE + 🔧 GARAGE + ⚡ ELECTRON MODES!
   ============================================ */

(function() {
  const Config = CHEMVENTUR.Config;
  const Elements = CHEMVENTUR.Elements;
  const Guns = CHEMVENTUR.Guns;
  const Audio = CHEMVENTUR.Audio;
  
  CHEMVENTUR.UI = {
    statusTimeout: null,
    envWindowOpen: false,
    currentCalc: null,
    periodicTableOpen: false,
    elementDetailOpen: false,
    
    init() {
      this.bindButtons();
      this.bindGunSelector();
      this.bindKeyboard();
      this.bindAudioControls();
      this.bindEnvButton();
      this.bindPeriodicTable();
      this.updateAll();
      
      // Initialize EnvCalc
      if (CHEMVENTUR.EnvCalc) {
        CHEMVENTUR.EnvCalc.init();
      }
      
      // Build periodic table
      this.buildPeriodicTableFull();
    },
    
    // ===== PERIODIC TABLE FULL =====
    bindPeriodicTable() {
      document.getElementById('btn-periodic-table').onclick = () => this.openPeriodicTableFull();
    },
    
    openPeriodicTableFull() {
      document.getElementById('periodic-table-full').classList.add('visible');
      this.periodicTableOpen = true;
    },
    
    closePeriodicTableFull() {
      document.getElementById('periodic-table-full').classList.remove('visible');
      this.periodicTableOpen = false;
    },
    
    buildPeriodicTableFull() {
      const PT = CHEMVENTUR.PeriodicTableFull;
      if (!PT) return;
      
      const grid = document.getElementById('pt-grid-full');
      if (!grid) return;
      
      grid.innerHTML = '';
      
      PT.PT_LAYOUT.forEach((row, rowIndex) => {
        row.forEach((Z, colIndex) => {
          const cell = document.createElement('div');
          
          if (Z === 0) {
            // Empty cell
            cell.className = 'pt-el empty';
          } else if (Z === -1) {
            // Lanthanide spacer
            cell.className = 'pt-el spacer';
            cell.title = 'Lanthanides (57-71)';
          } else if (Z === -2) {
            // Actinide spacer
            cell.className = 'pt-el spacer';
            cell.title = 'Actinides (89-103)';
          } else {
            // Real element
            const el = PT.getElement(Z);
            if (el) {
              cell.className = 'pt-el ' + el.category;
              cell.innerHTML = `
                <span class="el-number">${Z}</span>
                <span class="el-symbol">${el.symbol}</span>
                <span class="el-mass">${el.mass.toFixed(el.mass < 10 ? 3 : 2)}</span>
              `;
              cell.title = el.name;
              cell.onclick = () => this.showElementDetail(Z);
            }
          }
          
          grid.appendChild(cell);
        });
      });
    },
    
    showElementDetail(Z) {
      const PT = CHEMVENTUR.PeriodicTableFull;
      const el = PT.getElement(Z);
      if (!el) return;
      
      const cat = PT.CATEGORIES[el.category];
      const content = document.getElementById('element-detail-content');
      
      // Build electron shell diagram
      let shellsHtml = '<div class="electron-shells">';
      el.electrons.forEach((count, i) => {
        shellsHtml += `<div class="shell shell-${i+1}">${count}</div>`;
      });
      shellsHtml += '</div>';
      
      // Format oxidation states
      const oxStates = el.oxidationStates ? el.oxidationStates.map(s => (s > 0 ? '+' : '') + s).join(', ') : 'Unknown';
      
      // State icon
      const stateIcon = {solid: 'ite', liquid: '💧', gas: '💨', unknown: '❓'}[el.state] || '❓';
      
      content.innerHTML = `
        <div class="el-detail-header">
          <div class="el-detail-symbol-box ${el.category}">
            <span class="big-number">${Z}</span>
            <span class="big-symbol">${el.symbol}</span>
            <span class="big-mass">${el.mass}</span>
          </div>
          <div class="el-detail-name">
            <h3>${el.name}</h3>
            <div class="el-category" style="color:${cat.color}">${cat.name}</div>
          </div>
        </div>
        
        ${shellsHtml}
        
        <div class="el-detail-section">
          <h4>⚛️ Atomic Properties</h4>
          <div class="el-detail-row"><span class="label">Atomic Number:</span><span class="value">${Z}</span></div>
          <div class="el-detail-row"><span class="label">Atomic Mass:</span><span class="value">${el.mass} u</span></div>
          <div class="el-detail-row"><span class="label">Electron Config:</span><span class="value">${el.electronConfig}</span></div>
          <div class="el-detail-row"><span class="label">Electronegativity:</span><span class="value">${el.electronegativity || 'N/A'}</span></div>
          <div class="el-detail-row"><span class="label">Oxidation States:</span><span class="value">${oxStates}</span></div>
          <div class="el-detail-row"><span class="label">Ionization Energy:</span><span class="value">${el.ionizationEnergy ? el.ionizationEnergy + ' kJ/mol' : 'Unknown'}</span></div>
          <div class="el-detail-row"><span class="label">Atomic Radius:</span><span class="value">${el.atomicRadius ? el.atomicRadius + ' pm' : 'Unknown'}</span></div>
        </div>
        
        <div class="el-detail-section">
          <h4>🌡️ Physical Properties</h4>
          <div class="el-detail-row"><span class="label">State (25°C):</span><span class="value state-${el.state}">${stateIcon} ${el.state}</span></div>
          <div class="el-detail-row"><span class="label">Melting Point:</span><span class="value">${el.meltingPoint !== null ? el.meltingPoint + ' °C' : 'Unknown'}</span></div>
          <div class="el-detail-row"><span class="label">Boiling Point:</span><span class="value">${el.boilingPoint !== null ? el.boilingPoint + ' °C' : 'Unknown'}</span></div>
          <div class="el-detail-row"><span class="label">Density:</span><span class="value">${el.density ? el.density + ' g/cm³' : 'Unknown'}</span></div>
        </div>
        
        <div class="el-detail-section">
          <h4>📜 Discovery</h4>
          <div class="el-detail-row"><span class="label">Discovered By:</span><span class="value">${el.discoveredBy}</span></div>
          <div class="el-detail-row"><span class="label">Year:</span><span class="value">${el.discoveryYear < 0 ? Math.abs(el.discoveryYear) + ' BC' : el.discoveryYear}</span></div>
        </div>
        
        <div class="el-description">
          ${el.description}
        </div>
        
        <button class="el-select-btn" onclick="CHEMVENTUR.UI.selectElementFromDetail(${Z})">
          🎯 SELECT ${el.symbol} FOR ATOM GUN
        </button>
      `;
      
      document.getElementById('element-detail').classList.add('visible');
      this.elementDetailOpen = true;
    },
    
    closeElementDetail() {
      document.getElementById('element-detail').classList.remove('visible');
      this.elementDetailOpen = false;
    },
    
    selectElementFromDetail(Z) {
      CHEMVENTUR.GunSystem.selectedElement = Z;
      CHEMVENTUR.Game.addToInventory(Z);
      this.updateInventory();
      this.closeElementDetail();
      this.closePeriodicTableFull();
      
      const el = CHEMVENTUR.PeriodicTableFull.getElement(Z);
      this.showStatus(`⚛️ Selected: ${el.symbol} (${el.name})`);
    },
    
    // ===== ENV WINDOW =====
    bindEnvButton() {
      document.getElementById('env-btn').onclick = () => this.toggleEnvWindow();
    },
    
    toggleEnvWindow() {
      const win = document.getElementById('env-window');
      this.envWindowOpen = !this.envWindowOpen;
      win.classList.toggle('visible', this.envWindowOpen);
      
      // Close any open calc
      if (!this.envWindowOpen && this.currentCalc) {
        this.closeCalc(this.currentCalc);
      }
    },
    
    closeEnvWindow() {
      document.getElementById('env-window').classList.remove('visible');
      this.envWindowOpen = false;
    },
    
    // ===== CALCULATOR POPUPS =====
    openCalc(calcId) {
      // Close previous calc
      if (this.currentCalc) {
        this.closeCalc(this.currentCalc);
      }
      
      const popup = document.getElementById('calc-' + calcId);
      if (popup) {
        popup.classList.add('visible');
        this.currentCalc = calcId;
      }
    },
    
    closeCalc(calcId) {
      const popup = document.getElementById('calc-' + calcId);
      if (popup) {
        popup.classList.remove('visible');
      }
      if (this.currentCalc === calcId) {
        this.currentCalc = null;
      }
    },
    
    showStatus(message, duration = 2000) {
      const bar = document.getElementById('status-bar');
      bar.textContent = message;
      bar.classList.add('visible');
      if (this.statusTimeout) clearTimeout(this.statusTimeout);
      this.statusTimeout = setTimeout(() => bar.classList.remove('visible'), duration);
    },
    
    updateAll() {
      this.updateButtons();
      this.updateGunDisplay();
      this.updateStats();
      this.updateInventory();
      this.updateAudioDisplay();
    },
    
    updateButtons() {
      const game = CHEMVENTUR.Game;
      const MolSys = CHEMVENTUR.MolecularSystem;
      
      // Collider mode button
      const colliderBtn = document.getElementById('btn-collider');
      if (colliderBtn && game.COLLIDER_MODES) {
        const mode = game.COLLIDER_MODES[game.colliderMode];
        colliderBtn.textContent = '💥' + (mode?.name || 'None');
        colliderBtn.style.background = mode?.color || '#888';
        colliderBtn.style.color = game.colliderMode === 'NONE' ? '#fff' : '#000';
      }
      
      document.getElementById('btn-gravity').textContent = 'Grav:' + ['None', 'Down', 'In', 'Out'][game.gravityMode];
      document.getElementById('btn-boundary').textContent = 'Bound:' + ['Open', 'Bounce', 'Wrap', 'Kill'][game.boundaryMode];
      document.getElementById('btn-grid').textContent = 'Grid:' + (CHEMVENTUR.PressureGrid.enabled ? 'ON' : 'OFF');
      
      // Electron mode button
      const electronBtn = document.getElementById('btn-electron-mode');
      if (electronBtn && MolSys) {
        const mode = MolSys.getCurrentElectronMode();
        electronBtn.textContent = `${mode.icon} Electron: ${mode.name}`;
      }
      
      // Stage display
      this.updateStageDisplay();
    },
    
    updateStageDisplay() {
      const game = CHEMVENTUR.Game;
      const stageEl = document.getElementById('stage-display');
      if (stageEl && game.STAGES) {
        const stage = game.STAGES[game.stage];
        const zoomText = ['🔬in', '👁️', '🔭out'][game.zoomLevel];
        stageEl.textContent = `${game.stage} - ${stage.emoji} ${stage.name} [${zoomText}]`;
      }
    },
    
    updateGunDisplay() {
      const gunId = CHEMVENTUR.GunSystem.currentGun;
      const gun = Guns[gunId];
      document.getElementById('gun-name').textContent = gun.name;
      document.getElementById('gun-name').style.color = gun.color;
      document.querySelectorAll('.gun-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.gun == gunId);
      });
    },
    
    updateStats() {
      const game = CHEMVENTUR.Game;
      const bhCount = game.blackHoles.length + (game.centralBlackHole ? 1 : 0);
      const whCount = game.whiteHoles.length + (game.centralWhiteHole ? 1 : 0);
      document.getElementById('stats').textContent = 
        `Atoms:${game.atoms.length} ⚫:${bhCount} ⚪:${whCount} Orbs:${game.projectiles.gravityOrbs?.length || 0}`;
      
      // Update Ship HP bar!
      this.updateShipHP();
    },
    
    updateShipHP() {
      const StringSys = CHEMVENTUR.StringSystem;
      const damage = StringSys?.shipDamage || 0;
      const hp = Math.max(0, 100 - damage);
      
      const hpBar = document.getElementById('ship-hp-bar');
      const hpText = document.getElementById('ship-hp-text');
      
      if (hpBar) {
        hpBar.style.width = hp + '%';
        if (hp > 70) {
          hpBar.style.background = 'linear-gradient(90deg,#00ff41,#88ff00)';
        } else if (hp > 40) {
          hpBar.style.background = 'linear-gradient(90deg,#ffff00,#ff8800)';
        } else if (hp > 15) {
          hpBar.style.background = 'linear-gradient(90deg,#ff8800,#ff0000)';
        } else {
          hpBar.style.background = '#ff0000';
        }
      }
      
      if (hpText) {
        hpText.textContent = hp + '%';
        hpText.style.color = hp > 70 ? '#00ff41' : hp > 40 ? '#ffff00' : '#ff0000';
      }
    },
    
    updateInventory() {
      const game = CHEMVENTUR.Game;
      const inv = document.getElementById('inventory');
      inv.innerHTML = '';
      game.inventory.forEach(Z => {
        const btn = document.createElement('button');
        btn.className = 'btn inventory-item';
        btn.textContent = Elements.SYMBOLS[Z];
        if (Z === CHEMVENTUR.GunSystem.selectedElement) {
          btn.style.background = 'var(--neon-green)';
          btn.style.color = '#000';
        }
        btn.onclick = () => {
          CHEMVENTUR.GunSystem.selectedElement = Z;
          this.updateInventory();
          Audio?.click();
        };
        inv.appendChild(btn);
      });
    },
    
    updateTarget() {
      const game = CHEMVENTUR.Game;
      const text = game.targetZ ? `Build ${Elements.SYMBOLS[game.targetZ]} (Z=${game.targetZ})` : 'Free play';
      document.getElementById('target-text').textContent = text;
    },
    
    updateAudioDisplay() {
      const AudioSystem = CHEMVENTUR.AudioSystem;
      const Audio = CHEMVENTUR.Audio;
      
      // Update audio status displays
      const audioStatus = document.getElementById('audio-status');
      if (audioStatus && Audio) {
        audioStatus.textContent = `Sound: ${Audio.enabled ? 'ON' : 'OFF'}`;
      }
      
      const musicStatus = document.getElementById('music-status');
      if (musicStatus && AudioSystem) {
        if (AudioSystem.isPlaying) {
          musicStatus.textContent = `Music: ▶ Playing`;
        } else if (AudioSystem.enabled) {
          musicStatus.textContent = `Music: ⏸ Paused`;
        } else {
          musicStatus.textContent = `Music: None`;
        }
      }
      
      // Update toggle buttons
      const audioToggle = document.getElementById('btn-audio-toggle');
      if (audioToggle && Audio) {
        audioToggle.textContent = Audio.enabled ? '🔊' : '🔇';
      }
      
      const musicToggle = document.getElementById('btn-music-toggle');
      if (musicToggle && AudioSystem) {
        musicToggle.textContent = AudioSystem.isPlaying ? '⏸' : '🎵';
      }
      
      // Old display compatibility
      const playBtn = document.getElementById('audio-play-btn');
      if (playBtn && AudioSystem) playBtn.textContent = AudioSystem.isPlaying ? '⏸' : '▶';
      const timeDisplay = document.getElementById('audio-time');
      if (timeDisplay && AudioSystem?.enabled) {
        const current = Math.floor(AudioSystem.getCurrentTime());
        const duration = Math.floor(AudioSystem.getDuration());
        const formatTime = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;
        timeDisplay.textContent = `${formatTime(current)} / ${formatTime(duration || 0)}`;
      }
    },
    
    bindAudioControls() {
      const AudioSystem = CHEMVENTUR.AudioSystem;
      const SoundPhysics = CHEMVENTUR.SoundPhysics;
      const Audio = CHEMVENTUR.Audio;
      
      // Simple audio toggle (sound effects)
      document.getElementById('btn-audio-toggle')?.addEventListener('click', () => {
        if (Audio) {
          Audio.enabled = !Audio.enabled;
          this.showStatus(Audio.enabled ? '🔊 Sound ON' : '🔇 Sound OFF');
          this.updateAudioDisplay();
        }
      });
      
      // Music toggle (play/pause)
      document.getElementById('btn-music-toggle')?.addEventListener('click', () => {
        if (AudioSystem) {
          if (AudioSystem.enabled) {
            AudioSystem.toggle();
            this.showStatus(AudioSystem.isPlaying ? '🎵 Playing' : '⏸ Paused');
          } else {
            this.showStatus('📁 Load music first!');
          }
          this.updateAudioDisplay();
        }
      });
      
      // Music file upload
      document.getElementById('btn-music-upload')?.addEventListener('click', () => {
        document.getElementById('music-upload')?.click();
      });
      
      document.getElementById('music-upload')?.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file && AudioSystem) {
          const success = await AudioSystem.loadFile(file);
          if (success) {
            this.showStatus('🎵 ' + file.name);
            AudioSystem.play();
            this.updateAudioDisplay();
          }
        }
      });
      
      // Old controls compatibility
      document.getElementById('audio-load-btn')?.addEventListener('click', async () => {
        const url = document.getElementById('audio-url-input')?.value.trim();
        if (url) {
          const success = await AudioSystem.loadURL(url);
          this.showStatus(success ? '🎵 Audio loaded!' : '⚠️ Failed to load');
          if (success) AudioSystem.play();
        }
      });
      
      document.getElementById('audio-file-input')?.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
          const success = await AudioSystem.loadFile(file);
          if (success) { this.showStatus('🎵 ' + file.name); AudioSystem.play(); }
        }
      });
      
      document.getElementById('audio-play-btn')?.addEventListener('click', () => {
        AudioSystem.toggle();
        this.updateAudioDisplay();
      });
      
      document.getElementById('audio-stop-btn')?.addEventListener('click', () => {
        AudioSystem.stop();
        this.updateAudioDisplay();
      });
      
      document.getElementById('audio-volume')?.addEventListener('input', function() {
        AudioSystem.setVolume(this.value / 100);
      });
      
      ['high', 'mid', 'bass', 'sub'].forEach(band => {
        document.getElementById(`eq-${band}`)?.addEventListener('input', function() {
          AudioSystem.setEQGain(band, this.value / 50);
          const display = document.getElementById(`eq-${band}-val`);
          if (display) display.textContent = this.value + '%';
        });
      });
      
      document.getElementById('eq-master')?.addEventListener('input', function() {
        AudioSystem.setMasterGain(this.value / 50);
      });
      
      document.getElementById('btn-sound-physics')?.addEventListener('click', () => {
        if (SoundPhysics) {
          const enabled = SoundPhysics.toggle();
          document.getElementById('btn-sound-physics').textContent = 'Sound Physics:' + (enabled ? 'ON' : 'OFF');
        }
      });
      
      document.getElementById('btn-wave-vis')?.addEventListener('click', () => {
        if (SoundPhysics) {
          const enabled = SoundPhysics.toggleWaveVis();
          document.getElementById('btn-wave-vis').textContent = 'Waves:' + (enabled ? 'ON' : 'OFF');
        }
      });
    },
    
    bindButtons() {
      const game = CHEMVENTUR.Game;
      
      document.getElementById('btn-target').onclick = () => {
        const targets = [3, 4, 5, 6, 7, 8, 9, 10];
        game.targetZ = targets[Math.floor(Math.random() * targets.length)];
        this.updateTarget();
        this.showStatus(`🎯 Target: ${Elements.SYMBOLS[game.targetZ]}`);
      };
      
      // RAIN - Left click toggle, Right click options
      const rainBtn = document.getElementById('btn-rain');
      rainBtn.onclick = () => { game.toggleRain(); this.showStatus(game.rainActive ? '🌧️ Rain!' : '⏹️ Rain stopped'); };
      rainBtn.oncontextmenu = (e) => { e.preventDefault(); this.openRainOptions(); };
      
      // COLLIDER MODE - Left click cycle, Right click options
      const colliderBtn = document.getElementById('btn-collider');
      if (colliderBtn) {
        colliderBtn.onclick = () => {
          game.cycleColliderMode();
          this.updateButtons();
        };
        colliderBtn.oncontextmenu = (e) => { 
          e.preventDefault(); 
          this.openColliderOptions(); 
        };
      }
      
      // ELECTRON MODE
      document.getElementById('btn-electron-mode').onclick = () => {
        const MolSys = CHEMVENTUR.MolecularSystem;
        if (MolSys) {
          const mode = MolSys.cycleElectronMode();
          this.showStatus(`${mode.icon} ${mode.name}: ${mode.description}`);
        }
        this.updateButtons();
      };
      
      // GRAVITY - Left click cycle, Right click options
      const gravBtn = document.getElementById('btn-gravity');
      gravBtn.onclick = () => { game.gravityMode = (game.gravityMode + 1) % 4; this.updateButtons(); };
      gravBtn.oncontextmenu = (e) => { e.preventDefault(); this.openGravityOptions(); };
      
      document.getElementById('btn-boundary').onclick = () => {
        game.boundaryMode = (game.boundaryMode + 1) % 4;
        this.updateButtons();
      };
      
      // GRID - Left click toggle, Right click layer options
      const gridBtn = document.getElementById('btn-grid');
      gridBtn.onclick = () => { CHEMVENTUR.PressureGrid.toggle(); this.updateButtons(); };
      gridBtn.oncontextmenu = (e) => { e.preventDefault(); this.openGridOptions(); };
      
      document.getElementById('btn-clear').onclick = () => { 
        game.clear(); 
        // Also clear molecular bonds
        if (CHEMVENTUR.MolecularSystem) {
          CHEMVENTUR.MolecularSystem.bonds = [];
          CHEMVENTUR.MolecularSystem.molecules = [];
        }
        this.showStatus('🗑️ Cleared!'); 
      };
      document.getElementById('btn-save').onclick = () => { game.save(); this.showStatus('💾 Saved!'); };
      document.getElementById('btn-load').onclick = () => {
        if (game.load()) { this.updateAll(); this.showStatus('📁 Loaded!'); }
        else { this.showStatus('⚠️ No save found'); }
      };
      document.getElementById('btn-screenshot').onclick = () => { game.screenshot(); this.showStatus('📸 Saved!'); };
      
      // 🔧 GARAGE button
      document.getElementById('btn-garage')?.addEventListener('click', () => this.openGarage());
      
      document.getElementById('env-btn').onclick = () => this.toggleEnvPanel();
      
      document.getElementById('time-slider').oninput = function() {
        game.setTimeScale(parseInt(this.value));
        document.getElementById('speed-value').textContent = Config.TIME_NAMES[this.value];
      };
    },
    
    toggleEnvPanel() {
      const panel = document.getElementById('env-panel');
      this.envPanelOpen = !this.envPanelOpen;
      panel?.classList.toggle('visible', this.envPanelOpen);
    },
    
    // ===== GRAVITY OPTIONS PANEL =====
    openGravityOptions() {
      const content = document.getElementById('gravity-options-content');
      const game = CHEMVENTUR.Game;
      const gravConfig = CHEMVENTUR.Config.GRAVITY || {};
      
      content.innerHTML = `
        <div class="gun-option">
          <label>Gravity Mode</label>
          <select id="grav-mode" onchange="CHEMVENTUR.Game.gravityMode = +this.value; CHEMVENTUR.UI.updateButtons()">
            <option value="0" ${game.gravityMode === 0 ? 'selected' : ''}>None (0 G)</option>
            <option value="1" ${game.gravityMode === 1 ? 'selected' : ''}>Down (Earth)</option>
            <option value="2" ${game.gravityMode === 2 ? 'selected' : ''}>Inward (Star)</option>
            <option value="3" ${game.gravityMode === 3 ? 'selected' : ''}>Outward (Explosion)</option>
          </select>
        </div>
        <div class="gun-option">
          <label>Strength</label>
          <input type="range" min="0" max="200" value="${(gravConfig.STRENGTH_MULTIPLIER || 1) * 100}"
                 oninput="CHEMVENTUR.Config.GRAVITY.STRENGTH_MULTIPLIER = this.value / 100; this.nextElementSibling.textContent = this.value + '%'">
          <span>${(gravConfig.STRENGTH_MULTIPLIER || 1) * 100}%</span>
        </div>
        <hr style="border-color: var(--neon-green); margin: 10px 0;">
        <div class="gun-option">
          <label>⚫ BH follows gravity</label>
          <input type="checkbox" ${gravConfig.BLACK_HOLE_GRAVITY !== false ? 'checked' : ''} 
                 onchange="CHEMVENTUR.Config.GRAVITY.BLACK_HOLE_GRAVITY = this.checked">
        </div>
        <div class="gun-option">
          <label>⚪ White Hole Mode</label>
          <select onchange="CHEMVENTUR.HolePhysics.setWhiteHoleMode(+this.value)">
            <option value="1" ${CHEMVENTUR.HolePhysics?.whiteHoleMode === 1 ? 'selected' : ''}>1: Reverse time → BH to WH</option>
            <option value="2" ${CHEMVENTUR.HolePhysics?.whiteHoleMode === 2 ? 'selected' : ''}>2: WH compress BH</option>
          </select>
        </div>
        <p style="font-size: 8px; color: #888; margin-top: 8px;">
          Mode 1: Slow reverse time to transform central BH<br>
          Mode 2: Shoot white holes to compress central BH
        </p>
      `;
      
      document.getElementById('gravity-options-panel').classList.add('visible');
    },
    
    closeGravityOptions() {
      document.getElementById('gravity-options-panel').classList.remove('visible');
    },
    
    // ===== COLLIDER OPTIONS PANEL =====
    openColliderOptions() {
      const game = CHEMVENTUR.Game;
      const content = document.getElementById('collider-options-content');
      if (!content) {
        // Create panel if it doesn't exist
        this.createColliderPanel();
        return;
      }
      
      const modes = game.COLLIDER_MODES;
      let html = '<div style="font-size:11px;">';
      
      for (const [key, mode] of Object.entries(modes)) {
        const isActive = game.colliderMode === key;
        html += `
          <div class="gun-option" style="background:${isActive ? mode.color + '44' : 'transparent'};border-radius:5px;padding:5px;margin:3px 0;cursor:pointer;"
               onclick="CHEMVENTUR.Game.colliderMode='${key}';CHEMVENTUR.UI.updateButtons();CHEMVENTUR.UI.closeColliderOptions();">
            <span style="color:${mode.color};font-weight:bold;">${isActive ? '✓ ' : ''}${mode.name}</span>
            <div style="font-size:9px;color:#888;">${mode.description}</div>
          </div>
        `;
      }
      
      // DRAGON SECTOR special option!
      html += `
        <hr style="border-color:#333;margin:10px 0;">
        <div class="gun-option" style="background:#ff000033;border:1px solid #ff6600;border-radius:5px;padding:8px;">
          <span style="color:#ff6600;font-weight:bold;">🐉 DRAGON SECTOR</span>
          <div style="font-size:9px;color:#ffaa00;">Reverse-time collisions! Particles UN-fuse!</div>
          <label style="margin-top:5px;display:block;">
            <input type="checkbox" ${game.dragonSector ? 'checked' : ''} 
                   onchange="CHEMVENTUR.Game.dragonSector=this.checked;CHEMVENTUR.UI.showStatus(this.checked?'🐉 DRAGON SECTOR ACTIVE!':'🐉 Dragon sector off');">
            Enable Dragon Sector
          </label>
        </div>
      `;
      
      html += '</div>';
      content.innerHTML = html;
      
      document.getElementById('collider-options-panel').classList.add('visible');
    },
    
    createColliderPanel() {
      // Create the panel dynamically if missing
      const panel = document.createElement('div');
      panel.id = 'collider-options-panel';
      panel.className = 'popup-panel';
      panel.style.width = '280px';
      panel.innerHTML = `
        <button class="btn popup-close" onclick="CHEMVENTUR.UI.closeColliderOptions()">✕</button>
        <h3>💥 Collider Options</h3>
        <div id="collider-options-content"></div>
      `;
      document.body.appendChild(panel);
      
      // Now open it
      setTimeout(() => this.openColliderOptions(), 50);
    },
    
    closeColliderOptions() {
      const panel = document.getElementById('collider-options-panel');
      if (panel) panel.classList.remove('visible');
    },
    
    // ===== RAIN OPTIONS PANEL =====
    openRainOptions() {
      const content = document.getElementById('rain-options-content');
      const rainConfig = Config.RAIN;
      
      content.innerHTML = `
        <div class="gun-option">
          <label>Intensity</label>
          <input type="range" min="0" max="100" value="${rainConfig.INTENSITY * 100}"
                 oninput="CHEMVENTUR.Config.RAIN.INTENSITY = this.value / 100; this.nextElementSibling.textContent = this.value + '%'">
          <span>${Math.round(rainConfig.INTENSITY * 100)}%</span>
        </div>
        <div class="gun-option">
          <label>Include Atoms</label>
          <input type="checkbox" ${rainConfig.INCLUDE_ATOMS ? 'checked' : ''} 
                 onchange="CHEMVENTUR.Config.RAIN.INCLUDE_ATOMS = this.checked">
        </div>
        <div class="gun-option">
          <label>Speed Min</label>
          <input type="range" min="1" max="15" value="${rainConfig.SPEED_MIN}"
                 oninput="CHEMVENTUR.Config.RAIN.SPEED_MIN = +this.value">
        </div>
        <div class="gun-option">
          <label>Speed Max</label>
          <input type="range" min="5" max="25" value="${rainConfig.SPEED_MAX}"
                 oninput="CHEMVENTUR.Config.RAIN.SPEED_MAX = +this.value">
        </div>
        <div class="gun-option">
          <label>Spread</label>
          <input type="range" min="0" max="100" value="${rainConfig.SPREAD * 100}"
                 oninput="CHEMVENTUR.Config.RAIN.SPREAD = this.value / 100">
        </div>
        <div class="gun-option">
          <label>Rain Elements</label>
          <div style="font-size: 9px; margin-top: 4px;">
            <label><input type="checkbox" checked disabled> Proton</label>
            <label><input type="checkbox" checked disabled> Neutron</label>
            <label><input type="checkbox" checked disabled> Electron</label>
          </div>
        </div>
      `;
      
      document.getElementById('rain-options-panel').classList.add('visible');
    },
    
    closeRainOptions() {
      document.getElementById('rain-options-panel').classList.remove('visible');
    },
    
    // ===== GRID OPTIONS PANEL =====
    openGridOptions() {
      const content = document.getElementById('grid-options-content');
      const grid = CHEMVENTUR.PressureGrid;
      
      content.innerHTML = `
        <div class="gun-option">
          <label>🟢 Pressure Layer</label>
          <input type="checkbox" ${grid.showPressure ? 'checked' : ''} 
                 onchange="CHEMVENTUR.PressureGrid.showPressure = this.checked">
        </div>
        <div class="gun-option">
          <label>🟠 Temperature Layer</label>
          <input type="checkbox" ${grid.showTemperature ? 'checked' : ''} 
                 onchange="CHEMVENTUR.PressureGrid.showTemperature = this.checked">
        </div>
        <div class="gun-option">
          <label>🟣 Magnetism Layer</label>
          <input type="checkbox" ${grid.showMagnetism ? 'checked' : ''} 
                 onchange="CHEMVENTUR.PressureGrid.showMagnetism = this.checked">
        </div>
        <hr style="border-color: var(--neon-green); margin: 10px 0;">
        <p style="font-size: 9px; color: #888;">
          Pressure = Green bending lines<br>
          Temperature = Orange overlay<br>
          Magnetism = Purple field lines<br>
          Compasses are at CORNERS!
        </p>
      `;
      
      document.getElementById('grid-options-panel').classList.add('visible');
    },
    
    closeGridOptions() {
      document.getElementById('grid-options-panel').classList.remove('visible');
    },
    
    bindGunSelector() {
      document.querySelectorAll('.gun-btn').forEach(btn => {
        btn.onclick = () => {
          const gunId = btn.dataset.gun === '0' ? 0 : parseInt(btn.dataset.gun);
          CHEMVENTUR.GunSystem.currentGun = gunId;
          this.updateGunDisplay();
          this.showStatus(`🔫 ${Guns[gunId].name}`);
        };
        btn.oncontextmenu = (e) => {
          e.preventDefault();
          const gunId = btn.dataset.gun === '0' ? 0 : parseInt(btn.dataset.gun);
          this.openGunOptions(gunId);
        };
      });
    },
    
    bindKeyboard() {
      document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        
        const game = CHEMVENTUR.Game;
        
        // Gun selection: 1-9 and 0
        if (e.key >= '1' && e.key <= '9') {
          CHEMVENTUR.GunSystem.currentGun = parseInt(e.key);
          this.updateGunDisplay();
        }
        if (e.key === '0') {
          CHEMVENTUR.GunSystem.currentGun = 0;
          this.updateGunDisplay();
        }
        
        // ZOOM: - (minus) = zoom out, = (plus) = zoom in
        if (e.key === '-' || e.key === '_') {
          game.changeZoom(1); // zoom out
          this.updateStageDisplay();
        }
        if (e.key === '=' || e.key === '+') {
          game.changeZoom(-1); // zoom in
          this.updateStageDisplay();
        }
        
        // STAGE: [ and ] to change stage
        if (e.key === '[' || e.key === '{') {
          game.changeStage(-1); // previous stage
          this.updateStageDisplay();
        }
        if (e.key === ']' || e.key === '}') {
          game.changeStage(1); // next stage
          this.updateStageDisplay();
        }
        
        // Time control
        const timeIndex = Config.KEYS.TIME.indexOf(e.key.toLowerCase());
        if (timeIndex >= 0 && timeIndex < Config.TIME_SCALES.length) {
          game.setTimeScale(timeIndex);
          document.getElementById('time-slider').value = timeIndex;
          document.getElementById('speed-value').textContent = Config.TIME_NAMES[timeIndex];
        }
        
        // Element quick-select
        const elemZ = Config.KEYS.ELEMENTS[e.key.toLowerCase()];
        if (elemZ) {
          CHEMVENTUR.GunSystem.selectedElement = elemZ;
          game.addToInventory(elemZ);
          this.updateInventory();
        }
        
        // Space = toggle music
        if (e.key === ' ' && CHEMVENTUR.AudioSystem) {
          e.preventDefault();
          CHEMVENTUR.AudioSystem.toggle();
          this.updateAudioDisplay();
        }
        
        // V = cycle electron mode (NOT E - that's for time controls!)
        if (e.key === 'v' || e.key === 'V') {
          const MolSys = CHEMVENTUR.MolecularSystem;
          if (MolSys) {
            const mode = MolSys.cycleElectronMode();
            this.showStatus(`${mode.icon} ${mode.name}`);
            this.updateButtons();
          }
        }
        
        // C = cycle collider mode
        if (e.key === 'c' || e.key === 'C') {
          game.cycleColliderMode();
          this.updateButtons();
        }
      });
    },
    
    openGunOptions(gunId) {
      const gun = Guns[gunId];
      if (!gun) return;
      
      document.getElementById('gun-options-title').textContent = `🔫 ${gun.name}`;
      document.getElementById('gun-options-title').style.color = gun.color;
      
      let html = '';
      
      // Gun 4 (Zen) - Rain options
      if (gunId === 4) {
        html += `<div class="info-text" style="margin-bottom:10px;color:#888;">☯ Zen Mode - Just observe!<br>Use rain button for particle rain.</div>`;
      }
      
      // Gun 5 (Atom Gun) - Opens FULL periodic table!
      if (gunId === 5) {
        html += `<button class="btn full-width mb-md" onclick="CHEMVENTUR.UI.openPeriodicTableFull()" style="background:linear-gradient(90deg,#ff6b6b,#feca57,#00d2d3);color:#000;font-weight:bold;">
          ⚛️ OPEN FULL PERIODIC TABLE (118 Elements!)
        </button>`;
      }
      
      Object.entries(gun.options).forEach(([key, opt]) => {
        if (typeof opt.value === 'boolean') {
          html += `<div class="gun-option">
            <label>${opt.label || key}</label>
            <input type="checkbox" ${opt.value ? 'checked' : ''} 
                   onchange="CHEMVENTUR.GunSystem.setOption(${gunId}, '${key}', this.checked)">
          </div>`;
        } else if (opt.options) {
          const options = opt.options.map(o => `<option ${o === opt.value ? 'selected' : ''}>${o}</option>`).join('');
          html += `<div class="gun-option">
            <label>${opt.label || key}</label>
            <select onchange="CHEMVENTUR.GunSystem.setOption(${gunId}, '${key}', this.value)">${options}</select>
          </div>`;
        } else {
          html += `<div class="gun-option">
            <label>${opt.label || key}</label>
            <input type="range" min="${opt.min}" max="${opt.max}" value="${opt.value}"
                   oninput="CHEMVENTUR.GunSystem.setOption(${gunId}, '${key}', +this.value); this.nextElementSibling.textContent = this.value">
            <span class="value-display">${opt.value}</span>
          </div>`;
        }
      });
      
      document.getElementById('gun-options-content').innerHTML = html;
      document.getElementById('gun-options-panel').classList.add('visible');
    },
    
    closeGunOptions() {
      document.getElementById('gun-options-panel').classList.remove('visible');
    },
    
    openPeriodicTable() {
      this.closeGunOptions();
      const grid = document.getElementById('pt-grid');
      grid.innerHTML = '';
      
      CHEMVENTUR.PeriodicTable.LAYOUT.forEach(row => {
        row.forEach(Z => {
          const el = document.createElement('div');
          el.className = 'pt-element';
          if (Z === 0) {
            el.classList.add('empty');
          } else {
            const group = Elements.getGroup(Z);
            if (group !== 'other') el.classList.add(group);
            el.innerHTML = `<div class="symbol">${Elements.SYMBOLS[Z]}</div><div class="number">${Z}</div>`;
            el.onclick = () => {
              CHEMVENTUR.GunSystem.selectedElement = Z;
              CHEMVENTUR.Game.addToInventory(Z);
              document.getElementById('pt-selected').textContent = `${Elements.SYMBOLS[Z]} (Z=${Z})`;
              this.updateInventory();
              this.showStatus(`⚛️ Selected: ${Elements.SYMBOLS[Z]}`);
            };
          }
          grid.appendChild(el);
        });
      });
      
      const selZ = CHEMVENTUR.GunSystem.selectedElement;
      document.getElementById('pt-selected').textContent = `${Elements.SYMBOLS[selZ]} (Z=${selZ})`;
      document.getElementById('periodic-table-panel').classList.add('visible');
    },
    
    closePeriodicTable() {
      document.getElementById('periodic-table-panel').classList.remove('visible');
    },
    
    // ===== STAGE DISPLAY UPDATE =====
    updateStageDisplay() {
      const Game = CHEMVENTUR.Game;
      if (!Game) return;
      
      const stageInfo = Game.STAGES?.[Game.stage];
      const display = document.getElementById('stage-display');
      if (display && stageInfo) {
        display.textContent = `${Game.stage} - ${stageInfo.emoji} ${stageInfo.name}`;
        display.style.color = Game.stage === 0 ? '#ff8800' : 
                              Game.stage === 1 ? '#00ff41' : '#00ffff';
      }
    },
    
    // ===== UPDATE BUTTONS STATE =====
    updateButtons() {
      const Game = CHEMVENTUR.Game;
      if (!Game) return;
      
      // Update collider button
      const colliderBtn = document.getElementById('btn-collider');
      if (colliderBtn && Game.COLLIDER_MODES) {
        const mode = Game.COLLIDER_MODES[Game.colliderMode];
        colliderBtn.textContent = `💥${mode?.name || 'None'}`;
        colliderBtn.style.borderColor = mode?.color || '#888888';
      }
      
      // Update rain button
      const rainBtn = document.getElementById('btn-rain');
      if (rainBtn) {
        rainBtn.textContent = Game.rainActive ? '🌧️💧ON' : '🌧️💧';
        rainBtn.style.opacity = Game.rainActive ? '1' : '0.7';
      }
    },
    
    // ===== 🛠️ GARAGE SYSTEM =====
    openGarage() {
      // Use the new ShipRepair system if available
      if (CHEMVENTUR.ShipRepair) {
        CHEMVENTUR.ShipRepair.syncWithStringSystem();
        CHEMVENTUR.ShipRepair.openGarage();
        return;
      }
      
      // Fallback to basic garage
      const StringSys = CHEMVENTUR.StringSystem;
      const Game = CHEMVENTUR.Game;
      
      // Update damage display
      const damage = StringSys?.shipDamage || 0;
      const damageFill = document.getElementById('garage-damage-fill');
      const damageText = document.getElementById('garage-damage-text');
      
      if (damageFill) damageFill.style.width = damage + '%';
      if (damageText) {
        damageText.textContent = damage + '%';
        damageText.style.color = damage < 30 ? '#00ff41' : damage < 70 ? '#ffff00' : '#ff0000';
      }
      
      // Update hull
      const hullEl = document.getElementById('garage-hull');
      if (hullEl) hullEl.textContent = (100 - damage) + '%';
      
      // Update ship visual based on damage
      const shipVis = document.getElementById('garage-ship-visual');
      if (shipVis) {
        if (damage >= 100) shipVis.textContent = '💥';
        else if (damage >= 70) shipVis.textContent = '🚀💨';
        else if (damage >= 30) shipVis.textContent = '🚀';
        else shipVis.textContent = '🚀✨';
      }
      
      // Update stage
      const stage = Game?.STAGES?.[Game?.stage];
      const stageEl = document.getElementById('garage-stage');
      if (stageEl) stageEl.textContent = Game?.stage + ' - ' + (stage?.emoji || '') + ' ' + (stage?.name || 'Unknown');
      
      // Update strings count
      const stringsEl = document.getElementById('garage-strings');
      if (stringsEl) stringsEl.textContent = StringSys?.subatomicParticles?.length || 0;
      
      document.getElementById('garage-window')?.classList.add('visible');
    },
    
    closeGarage() {
      if (CHEMVENTUR.ShipRepair) {
        CHEMVENTUR.ShipRepair.closeGarage();
        return;
      }
      document.getElementById('garage-window')?.classList.remove('visible');
    },
    
    repairShip(amount) {
      // Use new ShipRepair if available
      if (CHEMVENTUR.ShipRepair) {
        // Convert old repair amounts to new repair types
        const repairType = amount >= 100 ? 'overhaul' : amount >= 35 ? 'weld' : 'patch';
        CHEMVENTUR.ShipRepair.startRepair(repairType);
        return;
      }
      
      const StringSys = CHEMVENTUR.StringSystem;
      const Game = CHEMVENTUR.Game;
      
      if (!StringSys) {
        this.showStatus('⚠️ StringSystem not available!');
        return;
      }
      
      // Check cost
      if (amount === 25 && Game.atoms.length < 1) {
        this.showStatus('⚠️ Need at least 1 atom!');
        return;
      }
      if (amount === 100 && Game.atoms.length < 5) {
        this.showStatus('⚠️ Need at least 5 atoms!');
        return;
      }
      
      // Pay cost
      if (amount === 25 && Game.atoms.length >= 1) {
        Game.atoms.pop();
      }
      if (amount === 100 && Game.atoms.length >= 5) {
        for (let i = 0; i < 5; i++) Game.atoms.pop();
      }
      
      // Repair!
      StringSys.repairShip(amount);
      
      // Refresh display
      this.openGarage();
      this.showStatus('🛠️ Repaired ' + amount + '%!');
    }
  };
})();
