/* ============================================
   CHEMVENTUR v114 - RENDERER
   DEFINITIVE MERGED EDITION
   🎯 Ship aiming! ⚪ Central white hole! 🔗 Molecular!
   Fixed: ctx.save/restore pairs to prevent state leaks
   Fixed: Zoom transformation in clear()
   ============================================ */

(function() {
  const Config = CHEMVENTUR.Config;
  const Elements = CHEMVENTUR.Elements;
  const Particles = CHEMVENTUR.Particles;
  
  CHEMVENTUR.Renderer = {
    ctx: null,
    width: 0,
    height: 0,
    
    init(canvas) {
      if (!canvas) {
        console.error('Renderer.init: canvas is null!');
        return;
      }
      this.ctx = canvas.getContext('2d');
      if (!this.ctx) {
        console.error('Renderer.init: could not get 2d context!');
        return;
      }
      this.resize(canvas);
      console.log('Renderer initialized:', this.width, 'x', this.height);
    },
    
    resize(canvas) {
      this.width = canvas.width;
      this.height = canvas.height;
    },
    
clear() {
  const ctx = this.ctx;
  if (!ctx) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset any previous transform
  ctx.fillStyle = '#001100';
  ctx.fillRect(0, 0, this.width, this.height);
  
  // Apply zoom if set
  if (this.zoomScale && this.zoomScale !== 1) {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    ctx.translate(centerX, centerY);
    ctx.scale(this.zoomScale, this.zoomScale);
    ctx.translate(-centerX, -centerY);
  }
},
    
    // ===== SHIP WITH AIMING! =====
    drawShip(x, y, aimAngle = -Math.PI/2, isAiming = false) {
      const ctx = this.ctx;
      if (!ctx) return;
      
      ctx.save();
      
      // Get ship color from ShipRepair system
      const ShipRepair = CHEMVENTUR.ShipRepair;
      const shipColor = ShipRepair?.getShipColor?.() || '#00ff41';
      const shipGlow = ShipRepair?.getShipGlow?.() || '#00ff41';
      
      // Draw aim line when aiming
      if (isAiming) {
        ctx.strokeStyle = shipColor.replace(')', ', 0.5)').replace('rgb', 'rgba').replace('hsl', 'hsla');
        if (!ctx.strokeStyle.includes('rgba') && !ctx.strokeStyle.includes('hsla')) {
          ctx.strokeStyle = shipColor + '80'; // Add alpha for hex colors
        }
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(aimAngle) * 100, y + Math.sin(aimAngle) * 100);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      
      // Add glow effect
      ctx.shadowColor = shipGlow;
      ctx.shadowBlur = 15;
      
      ctx.fillStyle = shipColor;
      ctx.strokeStyle = shipColor;
      ctx.lineWidth = 2;
      
      ctx.translate(x, y);
      ctx.rotate(aimAngle + Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, -20);
      ctx.lineTo(-12, 12);
      ctx.lineTo(12, 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Reset shadow
      ctx.shadowBlur = 0;
      ctx.restore();
    },
    
    // ===== ATOMS =====
    drawAtom(atom) {
      const ctx = this.ctx;
      if (!ctx || !atom) return;
      
      // Guard against NaN/undefined coordinates
      if (!isFinite(atom.x) || !isFinite(atom.y)) return;
      
      ctx.save(); // SAVE STATE
      
      const r = Particles.getRadius(atom) || 10;
      const color = Particles.getColor(atom) || '#ffffff';
      const label = Particles.getLabel(atom) || '';
      const MolSys = CHEMVENTUR.MolecularSystem;
      
      // Wave function probability cloud
      if (atom.cloudRadius && MolSys?.electronMode === 'WAVE') {
        ctx.globalAlpha = 0.2;
        const grad = ctx.createRadialGradient(atom.x, atom.y, 0, atom.x, atom.y, atom.cloudRadius);
        grad.addColorStop(0, '#aa88ff');
        grad.addColorStop(0.5, '#6644aa');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(atom.x, atom.y, atom.cloudRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      
      // Spectral glow (emission colors)
      if (atom.spectralGlow) {
        ctx.globalAlpha = 0.6;
        const grad = ctx.createRadialGradient(atom.x, atom.y, 0, atom.x, atom.y, r + 15);
        grad.addColorStop(0, atom.spectralGlow);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(atom.x, atom.y, r + 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      
      // Plasma glow
      if (atom.plasmGlow) {
        ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.01) * 0.3;
        const grad = ctx.createRadialGradient(atom.x, atom.y, 0, atom.x, atom.y, r + 20);
        grad.addColorStop(0, '#ff00ff');
        grad.addColorStop(0.5, '#ff66ff');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(atom.x, atom.y, r + 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      
      // Superconductor glow
      if (atom.superGlow) {
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(atom.x, atom.y, r + 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      
      // Glow effect for special particles
      if (atom.glow && atom.special) {
        const grad = ctx.createRadialGradient(atom.x, atom.y, 0, atom.x, atom.y, r + 6);
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(atom.x, atom.y, r + 6, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Nucleus glow for bare nuclei
      if (atom.isNucleus) {
        const grad = ctx.createRadialGradient(atom.x, atom.y, 0, atom.x, atom.y, r);
        grad.addColorStop(0, '#ffcc00');
        grad.addColorStop(1, '#ff6600');
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = atom.spectralGlow || color;
      }
      
      // Main body
      ctx.beginPath();
      ctx.arc(atom.x, atom.y, r, 0, Math.PI * 2);
      ctx.fill();
      
      // Crystal lattice indicator
      if (atom.crystalLock) {
        ctx.strokeStyle = '#00ffaa';
        ctx.lineWidth = 2;
        ctx.strokeRect(atom.x - r - 3, atom.y - r - 3, (r + 3) * 2, (r + 3) * 2);
      }
      
      // Nucleus dot for regular atoms
      if (!atom.special && atom.p > 0 && !atom.isNucleus) {
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.arc(atom.x, atom.y, r * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw electrons
      if (!atom.special && !atom.isNucleus && atom.e > 0) {
        this.drawElectrons(atom, r);
      }
      
      // Molecule label
      if (atom.isMolecule && atom.moleculeData) {
        ctx.fillStyle = '#00ff00';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(atom.moleculeData.formula, atom.x, atom.y - r - 8);
      }
      
      // Ion charge display
      if (atom.p && atom.e !== atom.p) {
        const charge = atom.p - atom.e;
        const chargeStr = charge > 0 ? '+' + charge : charge.toString();
        ctx.fillStyle = charge > 0 ? '#ff6666' : '#6666ff';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(chargeStr, atom.x + r + 5, atom.y - r);
      }
      
      // Label
      ctx.fillStyle = '#ffffff';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      
      if (atom.special) {
        ctx.fillText(label, atom.x, atom.y + 3);
      } else if (!atom.isMolecule) {
        ctx.fillText(label, atom.x, atom.y - r - 4);
      }
      
      ctx.restore(); // RESTORE STATE
    },
    
    drawElectrons(atom, r) {
      const ctx = this.ctx;
      if (!ctx) return;
      
      ctx.save();
      ctx.fillStyle = '#00ffff';
      
      for (let i = 0; i < atom.e; i++) {
        const angle = (atom.orbitAngle || 0) + i * Math.PI * 2 / atom.e;
        const ex = atom.x + Math.cos(angle) * (r + 10);
        const ey = atom.y + Math.sin(angle) * (r + 10);
        
        ctx.beginPath();
        ctx.arc(ex, ey, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    },
    
    // ===== BLACK HOLES =====
    drawBlackHole(hole) {
      const ctx = this.ctx;
      if (!ctx) return;
      
      ctx.save();
      
      // Core
      ctx.fillStyle = '#000000';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(hole.x, hole.y, hole.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Spiral trail
      ctx.strokeStyle = 'rgba(100, 0, 150, 0.5)';
      ctx.beginPath();
      for (let i = 0; i < 15; i++) {
        const a = hole.spiralAngle - i * 0.3;
        const rad = hole.size + i * 2;
        const x = hole.x + Math.cos(a) * rad;
        const y = hole.y + Math.sin(a) * rad;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    },
    
    drawCentralBlackHole(central) {
      const ctx = this.ctx;
      if (!ctx) return;
      
      ctx.save();
      const cx = this.width / 2;
      const cy = this.height / 2;
      
      // Event horizon glow
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, central.size * 3);
      grad.addColorStop(0, '#000000');
      grad.addColorStop(0.3, 'rgba(50, 0, 100, 0.8)');
      grad.addColorStop(0.7, 'rgba(100, 0, 150, 0.3)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, central.size * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Accretion disk
      ctx.strokeStyle = 'rgba(255, 100, 0, 0.5)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, central.size * 2 + i * 5, central.size * 0.4, 
                    central.phase + i * 0.5, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Core
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(cx, cy, central.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Show transformation progress if transforming - WHITE GLOW FORMING!
      if (central.isTransforming && central.transformProgress > 0) {
        const progress = central.transformProgress || 0;
        
        // Growing white glow around the black hole
        const glowGrad = ctx.createRadialGradient(cx, cy, central.size, cx, cy, central.size * (2 + progress * 2));
        glowGrad.addColorStop(0, `rgba(255, 255, 255, ${progress * 0.8})`);
        glowGrad.addColorStop(0.5, `rgba(255, 255, 200, ${progress * 0.4})`);
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, central.size * (2 + progress * 2), 0, Math.PI * 2);
        ctx.fill();
        
        // Progress ring
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, central.size * 1.5, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
        ctx.stroke();
        
        // Transformation text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.floor(progress * 100)}%`, cx, cy + central.size * 3);
        ctx.font = '9px monospace';
        ctx.fillText('→ WHITE HOLE', cx, cy + central.size * 3 + 14);
      }
      ctx.restore();
    },
    
    // ===== CENTRAL WHITE HOLE (NEW!) =====
    drawCentralWhiteHole(central) {
      const ctx = this.ctx;
      if (!ctx) return;
      
      ctx.save();
      const cx = this.width / 2;
      const cy = this.height / 2;
      
      // Radiant glow
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, central.size * 4);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.2, 'rgba(255, 255, 200, 0.9)');
      grad.addColorStop(0.5, 'rgba(255, 255, 150, 0.5)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, central.size * 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Pulsing rings
      const pulse = Math.sin(central.pulsePhase || 0) * 0.3 + 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        const radius = central.size * (1 + i * 0.5) * pulse;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy, central.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Outward rays
      ctx.strokeStyle = 'rgba(255, 255, 200, 0.4)';
      ctx.lineWidth = 3;
      for (let i = 0; i < 8; i++) {
        const angle = (central.phase || 0) + i * Math.PI / 4;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * central.size, cy + Math.sin(angle) * central.size);
        ctx.lineTo(cx + Math.cos(angle) * central.size * 3, cy + Math.sin(angle) * central.size * 3);
        ctx.stroke();
      }
      ctx.restore();
    },
    
    // ===== WHITE HOLES =====
    drawWhiteHole(hole) {
      const ctx = this.ctx;
      if (!ctx) return;
      
      ctx.save();
      
      // Core
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(hole.x, hole.y, hole.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Outward spiral trail
      ctx.strokeStyle = 'rgba(255, 255, 200, 0.4)';
      ctx.beginPath();
      for (let i = 0; i < 12; i++) {
        const a = hole.spiralAngle + i * 0.3;
        const rad = hole.size + i * 3;
        const x = hole.x + Math.cos(a) * rad;
        const y = hole.y + Math.sin(a) * rad;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    },
    
    drawEdgeHorizon(horizon) {
      if (!horizon || horizon.strength <= 0) return;
      
      const ctx = this.ctx;
      if (!ctx) return;
      
      ctx.save();
      const alpha = Math.min(0.7, horizon.strength * 0.08);
      const lineWidth = Math.min(15, horizon.strength * 1.5);
      
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.lineWidth = lineWidth;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = horizon.strength * 2;
      
      if (horizon.left > 0) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, this.height);
        ctx.stroke();
      }
      if (horizon.right > 0) {
        ctx.beginPath();
        ctx.moveTo(this.width, 0);
        ctx.lineTo(this.width, this.height);
        ctx.stroke();
      }
      if (horizon.top > 0) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.width, 0);
        ctx.stroke();
      }
      if (horizon.bottom > 0) {
        ctx.beginPath();
        ctx.moveTo(0, this.height);
        ctx.lineTo(this.width, this.height);
        ctx.stroke();
      }
      
      ctx.shadowBlur = 0;
      ctx.restore();
    },
    
    // ===== GRAVITY ORBS =====
    drawGravityOrb(orb) {
      const ctx = this.ctx;
      if (!ctx) return;
      
      ctx.save();
      const pulse = Math.sin(orb.phase) * 0.3 + 1;
      const totalSize = orb.orbSize + orb.glowSize;
      
      // Glow
      const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, totalSize * pulse);
      grad.addColorStop(0, '#8800ff');
      grad.addColorStop(0.3, 'rgba(136, 0, 255, 0.6)');
      grad.addColorStop(0.7, 'rgba(136, 0, 255, 0.3)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, totalSize * pulse, 0, Math.PI * 2);
      ctx.fill();
      
      // Core
      ctx.fillStyle = '#8800ff';
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.orbSize * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
    
    // ===== TIME ZONES =====
    drawTimeZone(zone) {
      const ctx = this.ctx;
      if (!ctx) return;
      
      ctx.save();
      const now = Date.now();
      const alpha = Math.min(1, (zone.lifetime - (now - zone.createTime)) / 2000);
      
      if (zone.visualStyle === 'ripple') {
        for (let i = 3; i >= 0; i--) {
          const rp = (zone.phase + i * 0.5) % 3;
          const rs = zone.size * (0.3 + rp * 0.3);
          ctx.strokeStyle = `rgba(0, 255, 170, ${alpha * (1 - rp / 3)})`;
          ctx.lineWidth = 3 - i * 0.5;
          ctx.beginPath();
          ctx.arc(zone.x, zone.y, rs, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (zone.visualStyle === 'clock') {
        ctx.strokeStyle = `rgba(0, 255, 170, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, zone.size, 0, Math.PI * 2);
        ctx.stroke();
        
        // Clock hand
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(zone.x, zone.y);
        ctx.lineTo(zone.x + Math.cos(zone.phase * 2) * zone.size * 0.7,
                   zone.y + Math.sin(zone.phase * 2) * zone.size * 0.7);
        ctx.stroke();
      } else if (zone.visualStyle === 'vortex') {
        ctx.strokeStyle = `rgba(0, 255, 170, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 6; a += 0.1) {
          const r = (a / (Math.PI * 6)) * zone.size;
          const x = zone.x + Math.cos(a + zone.phase * 3) * r;
          const y = zone.y + Math.sin(a + zone.phase * 3) * r;
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      
      // Label
      ctx.fillStyle = '#ffffff';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      const label = zone.localTimeScale === 0 ? '⏸' : 
                    zone.localTimeScale < 0 ? '⏪' : `×${zone.localTimeScale.toFixed(1)}`;
      ctx.fillText(label, zone.x, zone.y + 3);
      ctx.restore();
    },
    
    // ===== ANTI-GUN PROJECTILES =====
    drawAntigunProjectile(proj) {
      const ctx = this.ctx;
      if (!ctx) return;
      
      ctx.save();
      const colors = { photon: '#ffff00', tachyon: '#ff00ff', antimatter: '#ff0000' };
      const color = colors[proj.type] || '#ffff00';
      
      // Trail
      if (proj.trail && proj.trail.length > 1) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        proj.trail.forEach((pt, i) => {
          ctx.globalAlpha = 1 - i / proj.trail.length;
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      
      // Glow
      const grad = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, 18);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, 18, 0, Math.PI * 2);
      ctx.fill();
      
      // Repel indicator for photon
      if (proj.type === 'photon') {
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 55, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    },
    
    // ===== MOLECULAR BONDS =====
    drawBonds() {
      const MolSys = CHEMVENTUR.MolecularSystem;
      if (!MolSys || !MolSys.bonds || MolSys.bonds.length === 0) return;
      
      const ctx = this.ctx;
      if (!ctx) return;
      
      ctx.save();
      
      MolSys.bonds.forEach(bond => {
        if (!bond.atom1 || !bond.atom2) return;
        
        const a1 = bond.atom1;
        const a2 = bond.atom2;
        
        // Calculate midpoint and perpendicular for double/triple bonds
        const dx = a2.x - a1.x;
        const dy = a2.y - a1.y;
        const dist = Math.hypot(dx, dy);
        if (dist === 0) return;
        
        const perpX = -dy / dist;
        const perpY = dx / dist;
        
        ctx.strokeStyle = bond.color;
        ctx.lineWidth = bond.width;
        
        if (bond.type === 'SINGLE' || bond.type === 'IONIC') {
          ctx.beginPath();
          ctx.moveTo(a1.x, a1.y);
          ctx.lineTo(a2.x, a2.y);
          ctx.stroke();
          
          // Ionic bond sparkle
          if (bond.type === 'IONIC') {
            const midX = (a1.x + a2.x) / 2;
            const midY = (a1.y + a2.y) / 2;
            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.arc(midX, midY, 4 + Math.sin(Date.now() * 0.01) * 2, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (bond.type === 'DOUBLE') {
          const offset = 4;
          ctx.beginPath();
          ctx.moveTo(a1.x + perpX * offset, a1.y + perpY * offset);
          ctx.lineTo(a2.x + perpX * offset, a2.y + perpY * offset);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(a1.x - perpX * offset, a1.y - perpY * offset);
          ctx.lineTo(a2.x - perpX * offset, a2.y - perpY * offset);
          ctx.stroke();
        } else if (bond.type === 'TRIPLE') {
          const offset = 5;
          ctx.beginPath();
          ctx.moveTo(a1.x, a1.y);
          ctx.lineTo(a2.x, a2.y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(a1.x + perpX * offset, a1.y + perpY * offset);
          ctx.lineTo(a2.x + perpX * offset, a2.y + perpY * offset);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(a1.x - perpX * offset, a1.y - perpY * offset);
          ctx.lineTo(a2.x - perpX * offset, a2.y - perpY * offset);
          ctx.stroke();
        }
        
        // Bond vibration effect
        if (bond.vibration && Math.abs(bond.vibration) > 1) {
          ctx.globalAlpha = 0.3;
          ctx.strokeStyle = '#ff0000';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc((a1.x + a2.x) / 2, (a1.y + a2.y) / 2, Math.abs(bond.vibration) * 3, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });
      ctx.restore();
    },
    
    // Draw reaction effect
    drawReactionEffect(x, y, energy) {
      const ctx = this.ctx;
      if (!ctx) return;
      
      ctx.save();
      const radius = 30 + energy / 10;
      
      // Explosion effect
      const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, '#ffff00');
      grad.addColorStop(0.6, '#ff6600');
      grad.addColorStop(1, 'transparent');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };
})();
