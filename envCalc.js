/* ============================================
   CHEMVENTUR v111 - ENVIRONMENT CALCULATORS
   😈 SUPER ENVIRONMENT SYSTEM! 😈
   16+ Physics Calculators with Circle Charts!
   ============================================ */

(function() {
  
  CHEMVENTUR.EnvCalc = {
    // Current environment values that affect the game
    environment: {
      temperature: 298,      // Kelvin
      pressure: 1,           // atm
      gravity: 9.81,         // m/s²
      radiation: 0.4,        // mSv/yr
      electricField: 0,      // V/m
      magneticField: 50e-6,  // Tesla
      emFrequency: 300e6,    // Hz
      darkMatter: 0.3,       // GeV/cm³
      hubbleConstant: 70,    // km/s/Mpc
      velocity: 0            // fraction of c
    },
    
    init() {
      this.initAllCalculators();
    },
    
    // ===== TEMPERATURE =====
    calcTemp(unit) {
      let c, k, f, r;
      
      if (unit === 'c') {
        c = parseFloat(document.getElementById('temp-c').value) || 0;
        k = c + 273.15;
        f = c * 9/5 + 32;
        r = f + 459.67;
      } else if (unit === 'k') {
        k = parseFloat(document.getElementById('temp-k').value) || 0;
        c = k - 273.15;
        f = c * 9/5 + 32;
        r = f + 459.67;
      } else if (unit === 'f') {
        f = parseFloat(document.getElementById('temp-f').value) || 0;
        c = (f - 32) * 5/9;
        k = c + 273.15;
        r = f + 459.67;
      } else if (unit === 'r') {
        r = parseFloat(document.getElementById('temp-r').value) || 0;
        f = r - 459.67;
        c = (f - 32) * 5/9;
        k = c + 273.15;
      }
      
      document.getElementById('temp-c').value = c.toFixed(2);
      document.getElementById('temp-k').value = k.toFixed(2);
      document.getElementById('temp-f').value = f.toFixed(2);
      document.getElementById('temp-r').value = r.toFixed(2);
      
      this.environment.temperature = k;
      
      let info = '';
      if (k < 3) info = '❄️ Near absolute zero!';
      else if (k < 273) info = '🧊 Below freezing';
      else if (k < 373) info = '💧 Liquid water range';
      else if (k < 1000) info = '🔥 Hot!';
      else if (k < 10000) info = '🌋 Extreme heat!';
      else info = '⚡ PLASMA POSSIBLE!';
      
      document.getElementById('temp-info').textContent = info;
      this.drawTempChart(k);
    },
    
    drawTempChart(k) {
      const canvas = document.getElementById('temp-chart');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width, h = canvas.height;
      const cx = w/2, cy = h/2, r = Math.min(w,h)/2 - 15;
      
      ctx.clearRect(0, 0, w, h);
      
      // Background
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, '#001100');
      grad.addColorStop(1, '#002200');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      
      // Temperature arc (log scale, max ~100000K)
      const logK = Math.log10(Math.max(k, 1));
      const maxLog = 5; // 100000K
      const angle = (logK / maxLog) * Math.PI * 2;
      
      // Color based on temperature
      let color = '#00ffff';
      if (k < 273) color = '#00ccff';
      else if (k < 373) color = '#00ff41';
      else if (k < 1000) color = '#ffff00';
      else if (k < 5000) color = '#ff8800';
      else color = '#ff00ff';
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(cx, cy, r - 15, -Math.PI/2, -Math.PI/2 + angle);
      ctx.stroke();
      
      // Center text
      ctx.fillStyle = color;
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(k.toFixed(0) + ' K', cx, cy + 6);
    },
    
    // ===== PRESSURE =====
    calcPress(unit) {
      let atm;
      
      if (unit === 'atm') {
        atm = parseFloat(document.getElementById('press-atm').value) || 1;
      } else if (unit === 'pa') {
        atm = (parseFloat(document.getElementById('press-pa').value) || 101325) / 101325;
      } else if (unit === 'bar') {
        atm = (parseFloat(document.getElementById('press-bar').value) || 1) / 1.01325;
      } else if (unit === 'psi') {
        atm = (parseFloat(document.getElementById('press-psi').value) || 14.7) / 14.6959;
      } else if (unit === 'torr') {
        atm = (parseFloat(document.getElementById('press-torr').value) || 760) / 760;
      }
      
      document.getElementById('press-atm').value = atm.toFixed(4);
      document.getElementById('press-pa').value = (atm * 101325).toExponential(3);
      document.getElementById('press-bar').value = (atm * 1.01325).toFixed(4);
      document.getElementById('press-psi').value = (atm * 14.6959).toFixed(3);
      document.getElementById('press-torr').value = (atm * 760).toFixed(1);
      
      this.environment.pressure = atm;
      
      let info = '';
      if (atm < 0.001) info = '🚀 Near vacuum!';
      else if (atm < 0.5) info = '🏔️ High altitude';
      else if (atm < 2) info = '🌍 Earth-like';
      else if (atm < 100) info = '🌊 Deep ocean';
      else info = '💎 Diamond formation!';
      
      document.getElementById('press-info').textContent = info;
      this.drawPressChart(atm);
    },
    
    drawPressChart(atm) {
      const canvas = document.getElementById('press-chart');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width, h = canvas.height;
      const cx = w/2, cy = h/2, r = Math.min(w,h)/2 - 15;
      
      ctx.clearRect(0, 0, w, h);
      
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, '#001100');
      grad.addColorStop(1, '#002200');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      
      const logP = Math.log10(Math.max(atm, 0.0001));
      const angle = ((logP + 4) / 8) * Math.PI * 2; // -4 to +4 log scale
      
      let color = atm < 0.01 ? '#00ffff' : atm < 1 ? '#00ff41' : atm < 10 ? '#ffff00' : '#ff00ff';
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(cx, cy, r - 15, -Math.PI/2, -Math.PI/2 + Math.max(0, angle));
      ctx.stroke();
      
      ctx.fillStyle = color;
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(atm.toFixed(2) + ' atm', cx, cy + 6);
    },
    
    // ===== GRAVITY =====
    calcGrav() {
      const m1 = parseFloat(document.getElementById('grav-m1').value) || 5.972e24;
      const m2 = parseFloat(document.getElementById('grav-m2').value) || 1;
      const r = parseFloat(document.getElementById('grav-r').value) || 6.371e6;
      
      const G = 6.67430e-11;
      const force = G * m1 * m2 / (r * r);
      const accel = G * m1 / (r * r);
      
      document.getElementById('grav-force').value = force.toExponential(3) + ' N';
      document.getElementById('grav-accel').value = accel.toFixed(4) + ' m/s²';
      
      this.environment.gravity = accel;
      
      let info = '';
      if (accel < 1) info = '🌙 Moon-like';
      else if (accel < 5) info = '🔴 Mars-like';
      else if (accel < 15) info = '🌍 Earth-like';
      else if (accel < 30) info = '🪐 Giant planet';
      else info = '⭐ Stellar surface!';
      
      document.getElementById('grav-info').textContent = info;
      this.drawGravChart(accel);
    },
    
    drawGravChart(g) {
      const canvas = document.getElementById('grav-chart');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width, h = canvas.height;
      const cx = w/2, cy = h/2, r = Math.min(w,h)/2 - 15;
      
      ctx.clearRect(0, 0, w, h);
      
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, '#001100');
      grad.addColorStop(1, '#002200');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      
      // Arrow pointing down, length = gravity
      const arrowLen = Math.min(g / 30 * (r - 20), r - 20);
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx, cy - arrowLen/2);
      ctx.lineTo(cx, cy + arrowLen/2);
      ctx.stroke();
      
      // Arrow head
      ctx.beginPath();
      ctx.moveTo(cx, cy + arrowLen/2);
      ctx.lineTo(cx - 10, cy + arrowLen/2 - 15);
      ctx.lineTo(cx + 10, cy + arrowLen/2 - 15);
      ctx.closePath();
      ctx.fillStyle = '#ffff00';
      ctx.fill();
      
      ctx.fillStyle = '#ffff00';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(g.toFixed(2) + ' m/s²', cx, cy + r - 5);
    },
    
    // ===== RADIATION =====
    calcRad() {
      const sv = parseFloat(document.getElementById('rad-msv').value) || 0.4;
      
      document.getElementById('rad-usv').value = (sv * 1000).toFixed(1);
      document.getElementById('rad-rem').value = (sv / 10).toFixed(4);
      document.getElementById('rad-gray').value = (sv / 1000).toExponential(3);
      
      this.environment.radiation = sv;
      
      let info = '', color = '#00ff41';
      if (sv < 1) { info = '✅ Background safe'; color = '#00ff41'; }
      else if (sv < 10) { info = '⚠️ Elevated'; color = '#ffff00'; }
      else if (sv < 100) { info = '☢️ High exposure'; color = '#ff8800'; }
      else if (sv < 1000) { info = '💀 Acute danger!'; color = '#ff0000'; }
      else { info = '☠️ LETHAL!'; color = '#ff00ff'; }
      
      document.getElementById('rad-info').textContent = info;
      document.getElementById('rad-info').style.color = color;
      this.drawRadChart(sv, color);
    },
    
    drawRadChart(sv, color) {
      const canvas = document.getElementById('rad-chart');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width, h = canvas.height;
      const cx = w/2, cy = h/2, r = Math.min(w,h)/2 - 15;
      
      ctx.clearRect(0, 0, w, h);
      
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, '#110011');
      grad.addColorStop(1, '#220022');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      
      // Radiation symbol
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        const a = i * Math.PI * 2 / 3 - Math.PI / 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r - 25, a - 0.4, a + 0.4);
        ctx.stroke();
      }
      
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(sv.toFixed(1) + ' mSv', cx, cy + r - 5);
    },
    
    // ===== ELECTRIC FIELD =====
    calcElec() {
      const v = parseFloat(document.getElementById('elec-v').value) || 100;
      const d = parseFloat(document.getElementById('elec-d').value) || 0.1;
      
      document.getElementById('elec-v-num').value = v;
      document.getElementById('elec-d-num').value = d;
      
      const e = d > 0 ? v / d : 0;
      document.getElementById('elec-e').value = e.toExponential(2) + ' V/m';
      
      this.environment.electricField = e;
      
      let risk = '', color = '#00ff41';
      if (e < 100) { risk = 'Safe 👌'; color = '#00ff41'; }
      else if (e < 1000) { risk = 'Caution ⚠️'; color = '#ffff00'; }
      else if (e < 3000000) { risk = 'Danger ☢️'; color = '#ff3333'; }
      else { risk = 'PLASMA ARC! ⚡🔥'; color = '#aa00ff'; }
      
      document.getElementById('elec-risk').textContent = risk;
      document.getElementById('elec-risk').style.color = color;
      this.drawElecChart(e, color);
    },
    
    drawElecChart(field, color) {
      const canvas = document.getElementById('elec-chart');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width, h = canvas.height;
      const cx = w/2, cy = h/2, r = Math.min(w,h)/2 - 15;
      
      ctx.clearRect(0, 0, w, h);
      
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, '#001111');
      grad.addColorStop(1, '#002222');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      
      // Field arc
      const angle = Math.min((field / 10000000) * Math.PI * 2, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(cx, cy, r - 20, -Math.PI/2, -Math.PI/2 + angle);
      ctx.stroke();
      
      // Arrow
      const arrowLen = Math.min(field / 10000 * r, r * 0.7);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + arrowLen, cy);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(cx + arrowLen, cy);
      ctx.lineTo(cx + arrowLen - 10, cy - 7);
      ctx.lineTo(cx + arrowLen - 10, cy + 7);
      ctx.closePath();
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      
      // Pulse for high fields
      if (field > 100000) {
        ctx.globalAlpha = 0.3 + Math.sin(Date.now() * 0.01) * 0.2;
        ctx.strokeStyle = '#ff00ff';
        ctx.lineWidth = 15;
        ctx.beginPath();
        ctx.arc(cx, cy, r - 30, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    },
    
    // ===== MAGNETIC FIELD =====
    calcMag() {
      const t = parseFloat(document.getElementById('mag-t').value) || 50e-6;
      
      document.getElementById('mag-g').value = (t * 10000).toExponential(3);
      document.getElementById('mag-ut').value = (t * 1e6).toFixed(1);
      
      this.environment.magneticField = t;
      
      let info = '', color = '#ff0088';
      if (t < 100e-6) { info = '🌍 Earth-like'; color = '#00ff41'; }
      else if (t < 0.01) { info = '🧲 Strong magnet'; color = '#ffff00'; }
      else if (t < 1) { info = '🏥 MRI level'; color = '#ff8800'; }
      else { info = '⚡ Superconductor!'; color = '#ff00ff'; }
      
      document.getElementById('mag-info').textContent = info;
      this.drawMagChart(t, color);
    },
    
    drawMagChart(t, color) {
      const canvas = document.getElementById('mag-chart');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width, h = canvas.height;
      const cx = w/2, cy = h/2, r = Math.min(w,h)/2 - 15;
      
      ctx.clearRect(0, 0, w, h);
      
      ctx.fillStyle = '#110011';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      
      // Field lines
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      const lines = Math.min(Math.log10(t * 1e6) + 2, 8);
      for (let i = 0; i < lines; i++) {
        const offset = (i - lines/2) * 10;
        ctx.beginPath();
        ctx.moveTo(cx - r + 20, cy + offset);
        ctx.bezierCurveTo(cx - 20, cy + offset - 30, cx + 20, cy + offset + 30, cx + r - 20, cy + offset);
        ctx.stroke();
      }
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText((t * 1e6).toFixed(1) + ' μT', cx, cy + r - 5);
    },
    
    // ===== EM WAVES =====
    calcEM() {
      const f = parseFloat(document.getElementById('em-freq').value) || 300e6;
      const c = 299792458;
      const wavelength = c / f;
      const energy = 6.626e-34 * f;
      
      document.getElementById('em-wave').value = wavelength < 0.001 ? 
        (wavelength * 1e9).toFixed(2) + ' nm' : 
        wavelength < 1 ? (wavelength * 100).toFixed(2) + ' cm' : 
        wavelength.toFixed(2) + ' m';
      document.getElementById('em-energy').value = energy.toExponential(3) + ' J';
      
      this.environment.emFrequency = f;
      
      let info = '';
      if (f < 3e9) info = '📻 Radio waves';
      else if (f < 300e9) info = '📡 Microwaves';
      else if (f < 400e12) info = '🌡️ Infrared';
      else if (f < 800e12) info = '🌈 Visible light';
      else if (f < 30e15) info = '☀️ Ultraviolet';
      else if (f < 30e18) info = '☢️ X-rays';
      else info = '⚛️ Gamma rays!';
      
      document.getElementById('em-info').textContent = info;
    },
    
    // ===== DARK MATTER =====
    calcDM() {
      const density = parseFloat(document.getElementById('dm-density').value) || 0.3;
      
      this.environment.darkMatter = density;
      
      let info = '';
      if (density < 0.1) info = '🌌 Void region';
      else if (density < 0.5) info = '🌍 Local density';
      else if (density < 2) info = '🌀 Galaxy center';
      else info = '🕳️ Extreme density!';
      
      document.getElementById('dm-info').textContent = info;
    },
    
    // ===== COSMOLOGY =====
    calcCosm() {
      const h0 = parseFloat(document.getElementById('cosm-h0').value) || 70;
      const omega = parseFloat(document.getElementById('cosm-omega').value) || 0.3;
      const lambda = parseFloat(document.getElementById('cosm-lambda').value) || 0.7;
      
      this.environment.hubbleConstant = h0;
      
      // Age of universe approximation
      const age = 9.78e9 / h0;
      document.getElementById('cosm-age').value = age.toFixed(2) + ' Gyr';
      
      let info = '';
      if (omega + lambda < 0.9) info = '📉 Open universe';
      else if (omega + lambda > 1.1) info = '📈 Closed universe';
      else info = '⚖️ Flat universe';
      
      document.getElementById('cosm-info').textContent = info;
    },
    
    // ===== QUANTUM =====
    calcQuantum() {
      const n = parseFloat(document.getElementById('quantum-n').value) || 1;
      const l = parseFloat(document.getElementById('quantum-l').value) || 0;
      
      // Energy level (hydrogen-like)
      const E = -13.6 / (n * n);
      document.getElementById('quantum-e').value = E.toFixed(3) + ' eV';
      
      // Orbital name
      const orbitals = ['s', 'p', 'd', 'f', 'g', 'h'];
      const orbitalName = n + (orbitals[l] || '?');
      document.getElementById('quantum-orbital').value = orbitalName;
    },
    
    // ===== RELATIVITY =====
    calcRel() {
      const v = parseFloat(document.getElementById('rel-v').value) || 0;
      const beta = v;
      
      if (beta >= 1) {
        document.getElementById('rel-gamma').value = '∞';
        document.getElementById('rel-time').value = '∞';
        document.getElementById('rel-length').value = '0';
        document.getElementById('rel-info').textContent = '🚫 Cannot reach c!';
        return;
      }
      
      const gamma = 1 / Math.sqrt(1 - beta * beta);
      document.getElementById('rel-gamma').value = gamma.toFixed(4);
      document.getElementById('rel-time').value = gamma.toFixed(4) + 'x slower';
      document.getElementById('rel-length').value = (1/gamma).toFixed(4) + 'x contracted';
      
      this.environment.velocity = v;
      
      let info = '';
      if (beta < 0.1) info = '🚶 Non-relativistic';
      else if (beta < 0.5) info = '🚀 Mildly relativistic';
      else if (beta < 0.9) info = '⚡ Highly relativistic';
      else if (beta < 0.99) info = '🌟 Ultra-relativistic';
      else info = '💫 Near light speed!';
      
      document.getElementById('rel-info').textContent = info;
    },
    
    // ===== PARTICLE PHYSICS =====
    calcParticle() {
      const particle = document.getElementById('particle-type').value;
      
      const masses = {
        electron: 0.511, positron: 0.511, proton: 938.3, neutron: 939.6,
        muon: 105.7, tau: 1777, pion: 139.6, kaon: 493.7,
        wboson: 80400, zboson: 91200, higgs: 125000
      };
      
      const charges = {
        electron: -1, positron: +1, proton: +1, neutron: 0,
        muon: -1, tau: -1, pion: +1, kaon: +1,
        wboson: 1, zboson: 0, higgs: 0
      };
      
      document.getElementById('particle-mass').value = (masses[particle] || 0) + ' MeV/c²';
      document.getElementById('particle-charge').value = charges[particle] || 0;
    },
    
    // ===== ASTRO =====
    calcAstro() {
      const dist = parseFloat(document.getElementById('astro-au').value) || 1;
      
      document.getElementById('astro-km').value = (dist * 1.496e8).toExponential(3) + ' km';
      document.getElementById('astro-ly').value = (dist / 63241).toExponential(4) + ' ly';
      document.getElementById('astro-pc').value = (dist / 206265).toExponential(4) + ' pc';
      
      let info = '';
      if (dist < 0.5) info = '☀️ Inner solar system';
      else if (dist < 5) info = '🪨 Inner planets';
      else if (dist < 40) info = '🪐 Outer planets';
      else if (dist < 100) info = '🧊 Kuiper belt';
      else info = '☄️ Oort cloud region';
      
      document.getElementById('astro-info').textContent = info;
    },
    
    // ===== CHEMISTRY =====
    calcChem() {
      const moles = parseFloat(document.getElementById('chem-mol').value) || 1;
      const Na = 6.02214076e23;
      
      document.getElementById('chem-particles').value = (moles * Na).toExponential(4);
      document.getElementById('chem-mass-h2o').value = (moles * 18.015).toFixed(3) + ' g';
    },
    
    // ===== BIOLOGY =====
    calcBio() {
      const atp = parseFloat(document.getElementById('bio-atp').value) || 1;
      const energy = atp * 30.5; // kJ/mol
      
      document.getElementById('bio-energy').value = energy.toFixed(1) + ' kJ';
      document.getElementById('bio-cal').value = (energy / 4.184).toFixed(1) + ' kcal';
    },
    
    // ===== GEO =====
    calcGeo() {
      const depth = parseFloat(document.getElementById('geo-depth').value) || 0;
      
      // Temperature increases ~25°C per km
      const temp = 15 + depth * 25;
      // Pressure increases ~30 MPa per km
      const press = 0.1 + depth * 30;
      
      document.getElementById('geo-temp').value = temp.toFixed(0) + ' °C';
      document.getElementById('geo-press').value = press.toFixed(1) + ' MPa';
      
      let info = '';
      if (depth < 35) info = '🌍 Crust';
      else if (depth < 2900) info = '🔥 Mantle';
      else if (depth < 5100) info = '🧲 Outer core (liquid)';
      else info = '⚙️ Inner core (solid)';
      
      document.getElementById('geo-info').textContent = info;
    },
    
    // ===== CMB =====
    calcCMB() {
      const temp = parseFloat(document.getElementById('cmb-temp').value) || 2.725;
      const z = parseFloat(document.getElementById('cmb-z').value) || 1100;
      
      // Peak wavelength (Wien's law)
      const peakWave = 2.898e-3 / temp;
      document.getElementById('cmb-peak').value = (peakWave * 1000).toFixed(3) + ' mm';
      
      // Age when CMB formed
      const age = 380000; // years
      document.getElementById('cmb-age').value = age.toLocaleString() + ' years';
    },
    
    init() {
      // Don't initialize calculators on startup - they'll initialize when env window opens
      // Just set up the environment object with defaults
      console.log('EnvCalc initialized with defaults');
    },
    
    // Called when env window opens
    initAllCalculatorsIfReady() {
      // Check if a key element exists before running
      if (!document.getElementById('temp-k')) {
        console.log('Env window not ready yet');
        return;
      }
      this.initAllCalculators();
    },
    
    // ===== INITIALIZE ALL =====
    initAllCalculators() {
      // Set initial values - only if elements exist
      try {
        if (document.getElementById('temp-k')) this.calcTemp('k');
        if (document.getElementById('press-atm')) this.calcPress('atm');
        if (document.getElementById('grav-g')) this.calcGrav();
        if (document.getElementById('rad-msv')) this.calcRad();
        if (document.getElementById('elec-vm')) this.calcElec();
        if (document.getElementById('mag-t')) this.calcMag();
        if (document.getElementById('em-freq')) this.calcEM();
        if (document.getElementById('dm-density')) this.calcDM();
        if (document.getElementById('cosm-h')) this.calcCosm();
        if (document.getElementById('quant-mass')) this.calcQuantum();
        if (document.getElementById('rel-v')) this.calcRel();
        if (document.getElementById('part-z')) this.calcParticle();
        if (document.getElementById('astro-dist')) this.calcAstro();
        if (document.getElementById('chem-mol')) this.calcChem();
        if (document.getElementById('bio-hr')) this.calcBio();
        if (document.getElementById('geo-depth')) this.calcGeo();
        if (document.getElementById('cmb-temp')) this.calcCMB();
      } catch (e) {
        console.log('Some env calculators not ready:', e);
      }
    },
    
    // ===== APPLY TO GAME - Full Environment Effects! =====
    applyToGame() {
      const game = CHEMVENTUR.Game;
      const grid = CHEMVENTUR.PressureGrid;
      const config = CHEMVENTUR.Config;
      if (!game || !config) return;
      
      const env = this.environment;
      
      // === TEMPERATURE ===
      // Affects grid temperature layer, particle speed
      const tempK = env.temperature;
      const tempNormalized = Math.min(1, Math.max(0, (tempK - 3) / 10000)); // 3K-10000K range
      
      // Update all grid cells with base temperature
      if (grid && grid.cells) {
        grid.cells.forEach(row => {
          row.forEach(cell => {
            cell.temperature = Math.max(cell.temperature, tempNormalized * 0.5);
          });
        });
        grid.showTemperature = tempK > 400; // Auto-show temp layer if hot
      }
      
      // Speed multiplier for particles (hotter = faster)
      config.PHYSICS.SPEED_MULTIPLIER = Math.sqrt(tempK / 298);
      
      // === PRESSURE ===
      // Higher pressure = smaller grid squares (visually compressed)
      const pressAtm = env.pressure;
      config.GRID.PRESSURE_BASE = pressAtm;
      config.GRID.CELLS = pressAtm > 10 ? 20 : pressAtm > 5 ? 16 : 12;
      
      if (grid) {
        grid.showPressure = pressAtm > 2;
      }
      
      // === GRAVITY ===
      // Affects fall speed, boundary behavior
      const grav = env.gravity;
      const gravFactor = grav / 9.81;
      config.PHYSICS.GRAVITY_STRENGTH = 0.1 * gravFactor;
      
      // High gravity = atoms crash to pieces at boundaries!
      if (grav > 50) {
        config.PHYSICS.BOUNDARY_CRASH = true;
      } else {
        config.PHYSICS.BOUNDARY_CRASH = false;
      }
      
      // Less bouncy with higher gravity
      config.PHYSICS.BOUNCE_FACTOR = Math.max(0.1, 0.9 - gravFactor * 0.1);
      
      // === MAGNETISM ===
      // Affects grid magnetic field, compass behavior
      const magTesla = env.magneticField;
      const magNormalized = Math.min(1, magTesla / 1); // 0-1T range
      
      if (grid && grid.cells) {
        grid.cells.forEach(row => {
          row.forEach(cell => {
            cell.magnetism = Math.max(cell.magnetism, magNormalized * 0.5);
            // Stronger field = more aligned compasses
            cell.cornerAngles = cell.cornerAngles.map(() => 
              magNormalized > 0.5 ? env.magneticField * 1e6 : Math.random() * Math.PI * 2
            );
          });
        });
        grid.showMagnetism = magTesla > 1e-3;
      }
      
      // === RADIATION ===
      // High radiation spawns energy particles
      const radMsv = env.radiation;
      if (radMsv > 100) {
        // Spawn radiation particles!
        game.radiationMode = true;
        config.PHYSICS.RADIATION_LEVEL = radMsv;
      } else {
        game.radiationMode = false;
      }
      
      // === RELATIVISTIC EFFECTS ===
      const velocity = env.velocity; // fraction of c
      if (velocity > 0.1) {
        // Time dilation!
        const gamma = 1 / Math.sqrt(1 - velocity * velocity);
        game.relativistic = true;
        game.lorentzFactor = gamma;
      } else {
        game.relativistic = false;
        game.lorentzFactor = 1;
      }
      
      // Re-initialize grid with new settings
      if (grid && game.canvas) {
        grid.init(game.width, game.height);
      }
      
      // Show status
      let status = '🌍 Environment applied!';
      if (tempK > 5000) status += ' 🔥PLASMA';
      if (pressAtm > 10) status += ' 💨HIGH-P';
      if (grav > 20) status += ' ⬇️HIGH-G';
      if (radMsv > 50) status += ' ☢️RAD';
      if (velocity > 0.5) status += ' 🚀RELATIVISTIC';
      
      CHEMVENTUR.UI?.showStatus(status);
      console.log('🌍 Environment applied:', env);
    },
    
    // Quick apply individual settings
    applyTemperature() {
      const k = this.environment.temperature;
      const grid = CHEMVENTUR.PressureGrid;
      if (grid && grid.cells) {
        const norm = Math.min(1, (k - 3) / 10000);
        grid.cells.forEach(row => row.forEach(cell => cell.temperature = norm * 0.6));
        grid.showTemperature = true;
      }
      CHEMVENTUR.UI?.showStatus(`🌡️ Temperature: ${k.toFixed(0)}K applied!`);
    },
    
    applyPressure() {
      const p = this.environment.pressure;
      CHEMVENTUR.Config.GRID.PRESSURE_BASE = p;
      const grid = CHEMVENTUR.PressureGrid;
      if (grid) grid.showPressure = true;
      CHEMVENTUR.UI?.showStatus(`💨 Pressure: ${p.toFixed(2)} atm applied!`);
    },
    
    applyGravity() {
      const g = this.environment.gravity;
      CHEMVENTUR.Config.PHYSICS.GRAVITY_STRENGTH = 0.1 * (g / 9.81);
      CHEMVENTUR.UI?.showStatus(`⬇️ Gravity: ${g.toFixed(2)} m/s² applied!`);
    },
    
    applyMagnetism() {
      const m = this.environment.magneticField;
      const grid = CHEMVENTUR.PressureGrid;
      if (grid && grid.cells) {
        const norm = Math.min(1, m / 1);
        grid.cells.forEach(row => row.forEach(cell => cell.magnetism = norm * 0.5));
        grid.showMagnetism = true;
      }
      CHEMVENTUR.UI?.showStatus(`🧲 Magnetism: ${(m * 1e6).toFixed(1)} µT applied!`);
    },
    
    applyRadiation() {
      const r = this.environment.radiation;
      CHEMVENTUR.Config.PHYSICS.RADIATION_LEVEL = r;
      CHEMVENTUR.Game.radiationMode = r > 50;
      CHEMVENTUR.UI?.showStatus(`☢️ Radiation: ${r.toFixed(1)} mSv/yr applied!`);
    }
  };
  
})();
