/* ============================================
   CHEMVENTUR v108 - PRESSURE GRID
   THREE LAYERS: Pressure / Temperature / Magnetism
   Arrows at CORNERS, not centers!
   Grid pauses when time is paused!
   ============================================ */

(function() {
  const Config = CHEMVENTUR.Config;
  const GridConfig = Config.GRID;
  
  CHEMVENTUR.PressureGrid = {
    cells: [],
    enabled: false,
    
    // THREE LAYER VISIBILITY
    showPressure: true,
    showTemperature: false,
    showMagnetism: false,
    
    init(width, height) {
      this.cells = [];
      const cellW = width / GridConfig.CELLS;
      const cellH = height / GridConfig.CELLS;
      
      for (let y = 0; y < GridConfig.CELLS; y++) {
        this.cells[y] = [];
        for (let x = 0; x < GridConfig.CELLS; x++) {
          this.cells[y][x] = {
            x: x * cellW + cellW / 2,
            y: y * cellH + cellH / 2,
            // THREE LAYERS!
            pressure: GridConfig.PRESSURE_BASE,
            temperature: 0,
            magnetism: 0,
            magnetAngle: Math.random() * Math.PI * 2,
            // Corner compass angles (4 corners per cell)
            cornerAngles: [
              Math.random() * Math.PI * 2,  // top-left
              Math.random() * Math.PI * 2,  // top-right
              Math.random() * Math.PI * 2,  // bottom-left
              Math.random() * Math.PI * 2   // bottom-right
            ],
            gridX: x,
            gridY: y
          };
        }
      }
    },
    
    // UPDATE - NOW RESPECTS PAUSE!
    update(atoms, gravityOrbs, width, height, timeScale) {
      if (!this.enabled) return;
      
      // DON'T UPDATE GRID IF PAUSED!
      if (timeScale === 0) return;
      
      const cellW = width / GridConfig.CELLS;
      const cellH = height / GridConfig.CELLS;
      
      // Decay all values toward baseline
      for (let y = 0; y < GridConfig.CELLS; y++) {
        for (let x = 0; x < GridConfig.CELLS; x++) {
          const cell = this.cells[y][x];
          cell.pressure = cell.pressure * 0.95 + GridConfig.PRESSURE_BASE * 0.05;
          cell.temperature *= 0.96;
          cell.magnetism *= 0.97;
        }
      }
      
      // Add influence from atoms
      atoms.forEach(atom => {
        const gx = Math.floor(atom.x / cellW);
        const gy = Math.floor(atom.y / cellH);
        
        if (gx >= 0 && gx < GridConfig.CELLS && gy >= 0 && gy < GridConfig.CELLS) {
          const cell = this.cells[gy][gx];
          const speed = Math.hypot(atom.vx, atom.vy);
          
          // Pressure from presence and velocity
          cell.pressure += GridConfig.PRESSURE_ATOM_ADD + 
                           speed * GridConfig.PRESSURE_VELOCITY_FACTOR;
          
          // Temperature from velocity (kinetic energy) - MORE VISIBLE!
          cell.temperature += speed * 0.05;
          
          // Also add base temperature from just having atoms
          cell.temperature += 0.02;
          
          // Magnetism from charged particles
          if (atom.special === 'electron' || atom.special === 'positron' || atom.special === 'proton') {
            cell.magnetism += 0.1;
            // Rotate magnetic field based on particle direction
            cell.magnetAngle = Math.atan2(atom.vy, atom.vx);
          }
        }
      });
      
      // Add influence from gravity orbs
      gravityOrbs.forEach(orb => {
        const gx = Math.floor(orb.x / cellW);
        const gy = Math.floor(orb.y / cellH);
        
        if (gx >= 0 && gx < GridConfig.CELLS && gy >= 0 && gy < GridConfig.CELLS) {
          this.cells[gy][gx].pressure += Math.abs(orb.strength) * 0.03;
          this.cells[gy][gx].magnetism += Math.abs(orb.strength) * 0.02;
        }
      });
      
      // Update CORNER compass angles based on pressure gradients
      for (let y = 0; y < GridConfig.CELLS; y++) {
        for (let x = 0; x < GridConfig.CELLS; x++) {
          const cell = this.cells[y][x];
          
          // Calculate gradients for each corner
          this.updateCornerAngles(cell, x, y);
        }
      }
    },
    
    // Update compass angles at corners
    updateCornerAngles(cell, x, y) {
      const cells = GridConfig.CELLS;
      
      // For each corner, look at adjacent cells
      // Corner 0: top-left (looks at cells above and left)
      // Corner 1: top-right (looks at cells above and right)
      // Corner 2: bottom-left (looks at cells below and left)
      // Corner 3: bottom-right (looks at cells below and right)
      
      const corners = [
        { dx: -1, dy: -1 },  // top-left
        { dx: 1, dy: -1 },   // top-right
        { dx: -1, dy: 1 },   // bottom-left
        { dx: 1, dy: 1 }     // bottom-right
      ];
      
      corners.forEach((corner, idx) => {
        let gradX = 0, gradY = 0;
        
        // Look at horizontal neighbor
        const nx = x + corner.dx;
        if (nx >= 0 && nx < cells) {
          gradX = this.cells[y][nx].pressure - cell.pressure;
        }
        
        // Look at vertical neighbor
        const ny = y + corner.dy;
        if (ny >= 0 && ny < cells) {
          gradY = this.cells[ny][x].pressure - cell.pressure;
        }
        
        // Update angle if gradient is significant
        if (Math.abs(gradX) > 0.01 || Math.abs(gradY) > 0.01) {
          const targetAngle = Math.atan2(-gradY, -gradX);
          let diff = targetAngle - cell.cornerAngles[idx];
          
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          
          cell.cornerAngles[idx] += diff * GridConfig.COMPASS_ROTATION_SPEED;
        }
      });
    },
    
    getPressureAt(x, y, width, height) {
      const cell = this.getCellAt(x, y, width, height);
      return cell ? cell.pressure : GridConfig.PRESSURE_BASE;
    },
    
    getTemperatureAt(x, y, width, height) {
      const cell = this.getCellAt(x, y, width, height);
      return cell ? cell.temperature : 0;
    },
    
    getMagnetismAt(x, y, width, height) {
      const cell = this.getCellAt(x, y, width, height);
      return cell ? { value: cell.magnetism, angle: cell.magnetAngle } : { value: 0, angle: 0 };
    },
    
    getCellAt(x, y, width, height) {
      const cellW = width / GridConfig.CELLS;
      const cellH = height / GridConfig.CELLS;
      const gx = Math.floor(x / cellW);
      const gy = Math.floor(y / cellH);
      
      if (gx >= 0 && gx < GridConfig.CELLS && gy >= 0 && gy < GridConfig.CELLS) {
        return this.cells[gy][gx];
      }
      return null;
    },
    
    getNeighborAverage(gx, gy, property = 'pressure') {
      let sum = GridConfig.PRESSURE_BASE;
      let count = 1;
      
      if (gx > 0) { sum += this.cells[gy][gx - 1][property]; count++; }
      if (gx < GridConfig.CELLS - 1) { sum += this.cells[gy][gx + 1][property]; count++; }
      if (gy > 0) { sum += this.cells[gy - 1][gx][property]; count++; }
      if (gy < GridConfig.CELLS - 1) { sum += this.cells[gy + 1][gx][property]; count++; }
      
      return sum / count;
    },
    
    // DRAW - THREE LAYERS!
    draw(ctx, width, height) {
      if (!this.enabled || !this.cells.length) return;
      
      const cellW = width / GridConfig.CELLS;
      const cellH = height / GridConfig.CELLS;
      
      for (let y = 0; y < GridConfig.CELLS; y++) {
        for (let x = 0; x < GridConfig.CELLS; x++) {
          const cell = this.cells[y][x];
          const cx = cell.x;
          const cy = cell.y;
          
          // Calculate pressure difference
          const avgNeighbor = this.getNeighborAverage(x, y, 'pressure');
          const pressureDiff = cell.pressure - avgNeighbor;
          const bend = pressureDiff * GridConfig.BEND_FACTOR;
          
          // PRESSURE LAYER (green)
          if (this.showPressure) {
            const alpha = Math.min(0.4, 0.1 + Math.abs(pressureDiff) * 0.25);
            ctx.strokeStyle = `rgba(0, 255, 65, ${alpha})`;
            ctx.lineWidth = 1;
            
            const left = x * cellW;
            const right = (x + 1) * cellW;
            const top = y * cellH;
            const bottom = (y + 1) * cellH;
            
            ctx.beginPath();
            ctx.moveTo(left, top);
            ctx.quadraticCurveTo(cx, top - bend, right, top);
            ctx.quadraticCurveTo(right + bend, cy, right, bottom);
            ctx.quadraticCurveTo(cx, bottom + bend, left, bottom);
            ctx.quadraticCurveTo(left - bend, cy, left, top);
            ctx.stroke();
          }
          
          // TEMPERATURE LAYER (heatmap: blue -> cyan -> green -> yellow -> orange -> red)
          if (this.showTemperature) {
            const temp = cell.temperature;
            if (temp > 0.02) {
              // Heatmap color based on temperature
              let r, g, b;
              if (temp < 0.2) {
                // Cold: Blue to Cyan
                r = 0;
                g = Math.floor(temp * 5 * 255);
                b = 255;
              } else if (temp < 0.4) {
                // Cool: Cyan to Green
                r = 0;
                g = 255;
                b = Math.floor((0.4 - temp) * 5 * 255);
              } else if (temp < 0.6) {
                // Warm: Green to Yellow
                r = Math.floor((temp - 0.4) * 5 * 255);
                g = 255;
                b = 0;
              } else if (temp < 0.8) {
                // Hot: Yellow to Orange
                r = 255;
                g = Math.floor((0.8 - temp) * 5 * 255 + 128);
                b = 0;
              } else {
                // Very Hot: Orange to Red
                r = 255;
                g = Math.max(0, Math.floor((1 - temp) * 5 * 128));
                b = 0;
              }
              
              const alpha = Math.min(0.6, 0.1 + temp * 0.5);
              ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
              ctx.fillRect(x * cellW, y * cellH, cellW, cellH);
            }
          }
          
          // MAGNETISM LAYER (purple arrows) - ALWAYS draw when enabled
          if (this.showMagnetism) {
            // Background tint based on field strength
            if (cell.magnetism > 0.02) {
              const alpha = Math.min(0.3, cell.magnetism * 0.3);
              ctx.fillStyle = `rgba(136, 0, 255, ${alpha})`;
              ctx.fillRect(x * cellW, y * cellH, cellW, cellH);
            }
            
            // Draw field arrow in center
            const len = 10 + Math.min(cell.magnetism, 1) * 15;
            const angle = cell.magnetAngle || 0;
            
            ctx.strokeStyle = '#ff00ff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cx - Math.cos(angle) * len, cy - Math.sin(angle) * len);
            ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
            ctx.stroke();
            
            // Arrow head
            const headLen = 5;
            const headAngle = 0.5;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
            ctx.lineTo(
              cx + Math.cos(angle) * len - Math.cos(angle - headAngle) * headLen,
              cy + Math.sin(angle) * len - Math.sin(angle - headAngle) * headLen
            );
            ctx.moveTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
            ctx.lineTo(
              cx + Math.cos(angle) * len - Math.cos(angle + headAngle) * headLen,
              cy + Math.sin(angle) * len - Math.sin(angle + headAngle) * headLen
            );
            ctx.stroke();
          }
          
          // COMPASSES AT CORNERS (for pressure OR magnetism)
          if (this.showPressure || this.showMagnetism) {
            this.drawCornerCompasses(ctx, x, y, cellW, cellH, cell);
          }
        }
      }
    },
    
    // Draw compasses at the CORNERS of each cell
    drawCornerCompasses(ctx, gridX, gridY, cellW, cellH, cell) {
      const left = gridX * cellW;
      const right = (gridX + 1) * cellW;
      const top = gridY * cellH;
      const bottom = (gridY + 1) * cellH;
      
      // Corner positions
      const corners = [
        { x: left, y: top },      // top-left
        { x: right, y: top },     // top-right
        { x: left, y: bottom },   // bottom-left
        { x: right, y: bottom }   // bottom-right
      ];
      
      const size = 5;
      
      corners.forEach((corner, idx) => {
        // Only draw if not on edge (to avoid duplicates)
        if (gridX > 0 && idx % 2 === 0) return;  // Skip left corners if not first column
        if (gridY > 0 && idx < 2) return;         // Skip top corners if not first row
        
        ctx.save();
        ctx.translate(corner.x, corner.y);
        ctx.rotate(cell.cornerAngles[idx]);
        
        // Needle
        ctx.strokeStyle = '#ff8800';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-size, 0);
        ctx.lineTo(size, 0);
        ctx.moveTo(size - 2, -2);
        ctx.lineTo(size, 0);
        ctx.lineTo(size - 2, 2);
        ctx.stroke();
        
        // North marker
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(size, 0, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });
    },
    
    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    },
    
    togglePressure() {
      this.showPressure = !this.showPressure;
      return this.showPressure;
    },
    
    toggleTemperature() {
      this.showTemperature = !this.showTemperature;
      return this.showTemperature;
    },
    
    toggleMagnetism() {
      this.showMagnetism = !this.showMagnetism;
      return this.showMagnetism;
    }
  };
  
})();
