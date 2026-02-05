/* ============================================
   CHEMVENTUR v108 - HOLES
   TWO WHITE HOLE MODES!
   Mode 1: Reverse time transforms BH → WH
   Mode 2: WH compress BH from edges
   ============================================ */

(function() {
  const Config = CHEMVENTUR.Config;
  const HoleConfig = Config.HOLES;
  
  // ===== HOLE FACTORY =====
  CHEMVENTUR.Holes = {
    createBlackHole(x, y, vx = 0, vy = 0) {
      return {
        x, y, vx, vy,
        size: Config.SIZES.blackhole,
        strength: 1,
        spiralAngle: Math.random() * Math.PI * 2,
        createTime: Date.now(),
        type: 'blackhole',
        transformProgress: 0  // For WH transformation
      };
    },
    
    createWhiteHole(x, y, vx = 0, vy = 0) {
      return {
        x, y, vx, vy,
        size: Config.SIZES.whitehole,
        strength: 1,
        spiralAngle: Math.random() * Math.PI * 2,
        createTime: Date.now(),
        type: 'whitehole'
      };
    },
    
    createCentralBlackHole(x, y, size, strength) {
      return {
        x, y, size, strength,
        phase: 0,
        type: 'central',
        transformProgress: 0,
        isTransforming: false
      };
    },
    
    createCentralWhiteHole(x, y, size, strength) {
      return {
        x, y, size, strength,
        phase: 0,
        type: 'centralWhite',
        pulsePhase: 0
      };
    },
    
    createEdgeHorizon() {
      return {
        top: 0, bottom: 0, left: 0, right: 0,
        strength: 0
      };
    }
  };
  
  // ===== HOLE PHYSICS ENGINE =====
  CHEMVENTUR.HolePhysics = {
    whiteHoleMode: 1,  // 1 or 2
    
    // Update all black holes
    updateBlackHoles(blackHoles, centralBlackHole, atoms, width, height, timeScale) {
      const centerX = width / 2;
      const centerY = height / 2;
      let newCentral = centralBlackHole;
      const merged = [];
      
      for (let i = blackHoles.length - 1; i >= 0; i--) {
        const bh = blackHoles[i];
        const dx = centerX - bh.x;
        const dy = centerY - bh.y;
        const dist = Math.hypot(dx, dy);
        
        bh.spiralAngle += HoleConfig.SPIRAL_SPEED * timeScale;
        
        if (dist > HoleConfig.MERGE_DISTANCE) {
          const tangent = Math.atan2(dy, dx) + Math.PI / 2;
          
          bh.vx += (dx / dist * HoleConfig.INWARD_FORCE + 
                    Math.cos(tangent) * HoleConfig.TANGENT_FORCE) * timeScale;
          bh.vy += (dy / dist * HoleConfig.INWARD_FORCE + 
                    Math.sin(tangent) * HoleConfig.TANGENT_FORCE) * timeScale;
          
          bh.vx *= 0.98;
          bh.vy *= 0.98;
          bh.x += bh.vx * timeScale;
          bh.y += bh.vy * timeScale;
          
          this.applyPullForce(bh, atoms, timeScale);
        } else {
          if (!newCentral) {
            newCentral = CHEMVENTUR.Holes.createCentralBlackHole(centerX, centerY, bh.size, bh.strength);
          } else {
            newCentral.size += bh.size * 0.5;
            newCentral.strength += bh.strength;
          }
          merged.push(i);
        }
      }
      
      merged.forEach(i => blackHoles.splice(i, 1));
      
      if (newCentral) {
        newCentral.phase += 0.03;
        this.applyCentralPull(newCentral, atoms, width, height, timeScale);
      }
      
      return { centralBlackHole: newCentral, mergedCount: merged.length };
    },
    
    // ===== MODE 1: REVERSE TIME TRANSFORMS BH → WH =====
    updateCentralBlackHoleReverse(centralBlackHole, timeScale, width, height) {
      if (!centralBlackHole || this.whiteHoleMode !== 1) return null;
      
      // Transform during ANY reverse time (timeScale < 0)
      if (timeScale >= 0) return null;
      
      // Slowly transform - faster when more reversed
      const transformSpeed = Math.abs(timeScale) * HoleConfig.REVERSE_TRANSFORM_SPEED * 2;
      centralBlackHole.transformProgress = (centralBlackHole.transformProgress || 0) + transformSpeed;
      centralBlackHole.isTransforming = true;
      
      // Visual feedback - pulse the black hole
      centralBlackHole.phase = (centralBlackHole.phase || 0) + 0.1;
      
      // When transformation complete, become white hole!
      if (centralBlackHole.transformProgress >= 1) {
        const centerX = width / 2;
        const centerY = height / 2;
        return CHEMVENTUR.Holes.createCentralWhiteHole(
          centerX, centerY,
          centralBlackHole.size,
          centralBlackHole.strength
        );
      }
      
      return null;
    },
    
    // ===== MODE 2: WHITE HOLES COMPRESS BLACK HOLE =====
    updateWhiteHoleCompression(centralBlackHole, whiteHoles, width, height) {
      if (!centralBlackHole || this.whiteHoleMode !== 2) return null;
      
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Count white holes near the edge of central black hole
      let compressingCount = 0;
      const compressionRadius = centralBlackHole.size * 4;
      
      whiteHoles.forEach(wh => {
        const dist = Math.hypot(wh.x - centerX, wh.y - centerY);
        if (dist < compressionRadius && dist > centralBlackHole.size) {
          compressingCount++;
          // White holes orbit around black hole
          const angle = Math.atan2(wh.y - centerY, wh.x - centerX);
          wh.x = centerX + Math.cos(angle + 0.02) * dist;
          wh.y = centerY + Math.sin(angle + 0.02) * dist;
        }
      });
      
      // If enough white holes are compressing...
      if (compressingCount >= HoleConfig.COMPRESSION_THRESHOLD) {
        centralBlackHole.transformProgress += 0.01;
        centralBlackHole.isTransforming = true;
        
        // Shrink the black hole
        centralBlackHole.size *= 0.99;
        
        // When compressed enough, transform!
        if (centralBlackHole.transformProgress >= 1 || centralBlackHole.size < 2) {
          // Remove compressing white holes
          for (let i = whiteHoles.length - 1; i >= 0; i--) {
            const dist = Math.hypot(whiteHoles[i].x - centerX, whiteHoles[i].y - centerY);
            if (dist < compressionRadius) {
              whiteHoles.splice(i, 1);
            }
          }
          
          return CHEMVENTUR.Holes.createCentralWhiteHole(
            centerX, centerY,
            centralBlackHole.size * 2,
            centralBlackHole.strength
          );
        }
      }
      
      return null;
    },
    
    // Update white holes
    updateWhiteHoles(whiteHoles, edgeHorizon, atoms, width, height, timeScale) {
      const centerX = width / 2;
      const centerY = height / 2;
      const merged = [];
      
      for (let i = whiteHoles.length - 1; i >= 0; i--) {
        const wh = whiteHoles[i];
        const dx = wh.x - centerX;
        const dy = wh.y - centerY;
        const dist = Math.hypot(dx, dy);
        
        wh.spiralAngle += HoleConfig.SPIRAL_SPEED * timeScale;
        
        const atEdge = wh.x < HoleConfig.EDGE_MARGIN || 
                       wh.x > width - HoleConfig.EDGE_MARGIN ||
                       wh.y < HoleConfig.EDGE_MARGIN || 
                       wh.y > height - HoleConfig.EDGE_MARGIN;
        
        if (!atEdge) {
          const tangent = Math.atan2(dy, dx) + Math.PI / 2;
          
          if (dist > 1) {
            wh.vx += (dx / dist * HoleConfig.OUTWARD_FORCE + 
                      Math.cos(tangent) * 0.3) * timeScale;
            wh.vy += (dy / dist * HoleConfig.OUTWARD_FORCE + 
                      Math.sin(tangent) * 0.3) * timeScale;
          }
          
          wh.vx *= 0.98;
          wh.vy *= 0.98;
          wh.x += wh.vx * timeScale;
          wh.y += wh.vy * timeScale;
          
          this.applyPushForce(wh, atoms, timeScale);
        } else {
          if (wh.x < HoleConfig.EDGE_MARGIN) edgeHorizon.left += wh.strength;
          if (wh.x > width - HoleConfig.EDGE_MARGIN) edgeHorizon.right += wh.strength;
          if (wh.y < HoleConfig.EDGE_MARGIN) edgeHorizon.top += wh.strength;
          if (wh.y > height - HoleConfig.EDGE_MARGIN) edgeHorizon.bottom += wh.strength;
          edgeHorizon.strength += wh.strength;
          merged.push(i);
        }
      }
      
      merged.forEach(i => whiteHoles.splice(i, 1));
      
      if (edgeHorizon.strength > 0) {
        this.applyEdgePush(edgeHorizon, atoms, width, height, timeScale);
      }
      
      return { mergedCount: merged.length };
    },
    
    // Update central white hole (pushes everything out!)
    updateCentralWhiteHole(centralWhiteHole, atoms, width, height, timeScale) {
      if (!centralWhiteHole) return;
      
      const centerX = width / 2;
      const centerY = height / 2;
      
      centralWhiteHole.phase += 0.05;
      centralWhiteHole.pulsePhase += 0.1;
      
      // Push all atoms outward!
      atoms.forEach(atom => {
        if (atom.special?.includes('hole')) return;
        
        const dx = atom.x - centerX;
        const dy = atom.y - centerY;
        const dist = Math.hypot(dx, dy);
        
        if (dist > 5) {
          const force = (centralWhiteHole.strength * 2) / Math.max(dist * 0.3, 10);
          atom.vx += (dx / dist) * force * timeScale;
          atom.vy += (dy / dist) * force * timeScale;
        }
      });
      
      // Slowly shrink
      centralWhiteHole.size *= 0.999;
      centralWhiteHole.strength *= 0.999;
      
      // Disappear when too small
      if (centralWhiteHole.size < 1 || centralWhiteHole.strength < 0.1) {
        return true; // Signal to remove
      }
      
      return false;
    },
    
    applyPullForce(hole, atoms, timeScale) {
      atoms.forEach(atom => {
        if (atom.special?.includes('hole')) return;
        
        const dx = hole.x - atom.x;
        const dy = hole.y - atom.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < HoleConfig.PULL_RANGE && dist > 5) {
          const force = (hole.strength * 2) / (dist * 0.3);
          atom.vx += (dx / dist) * force * timeScale;
          atom.vy += (dy / dist) * force * timeScale;
        }
      });
    },
    
    applyCentralPull(central, atoms, width, height, timeScale) {
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Check gravity settings
      const gravConfig = Config.GRAVITY || {};
      const bhFollowsGravity = gravConfig.BLACK_HOLE_GRAVITY !== false;
      
      for (let i = atoms.length - 1; i >= 0; i--) {
        const atom = atoms[i];
        if (atom.special?.includes('hole')) continue;
        
        const dx = centerX - atom.x;
        const dy = centerY - atom.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist > 15) {
          let force = (central.strength * 3) / (dist * 0.2);
          
          // If BH follows gravity mode, modify pull direction
          if (bhFollowsGravity && gravConfig.MODE === 3) {
            // Outward gravity mode - weaken or reverse BH pull
            force *= 0.3;
          }
          
          atom.vx += (dx / dist) * force * timeScale;
          atom.vy += (dy / dist) * force * timeScale;
        } else {
          // Consumed!
          central.strength += 0.1;
          central.size += 0.5;
          atoms.splice(i, 1);
        }
      }
    },
    
    applyPushForce(hole, atoms, timeScale) {
      atoms.forEach(atom => {
        if (atom.special?.includes('hole')) return;
        
        const dx = atom.x - hole.x;
        const dy = atom.y - hole.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < HoleConfig.PUSH_RANGE && dist > 5) {
          const force = (hole.strength * 2) / (dist * 0.3);
          atom.vx += (dx / dist) * force * timeScale;
          atom.vy += (dy / dist) * force * timeScale;
        }
      });
    },
    
    applyEdgePush(horizon, atoms, width, height, timeScale) {
      const margin = 80;
      
      atoms.forEach(atom => {
        if (atom.special?.includes('hole')) return;
        
        if (atom.x < margin && horizon.left > 0) {
          atom.vx += (horizon.left * 0.3) / Math.max(10, atom.x) * timeScale;
        }
        if (atom.x > width - margin && horizon.right > 0) {
          atom.vx -= (horizon.right * 0.3) / Math.max(10, width - atom.x) * timeScale;
        }
        if (atom.y < margin && horizon.top > 0) {
          atom.vy += (horizon.top * 0.3) / Math.max(10, atom.y) * timeScale;
        }
        if (atom.y > height - margin && horizon.bottom > 0) {
          atom.vy -= (horizon.bottom * 0.3) / Math.max(10, height - atom.y) * timeScale;
        }
      });
    },
    
    checkHoleCollision(blackHoles, whiteHoles) {
      for (let i = blackHoles.length - 1; i >= 0; i--) {
        for (let j = whiteHoles.length - 1; j >= 0; j--) {
          const bh = blackHoles[i];
          const wh = whiteHoles[j];
          const dist = Math.hypot(bh.x - wh.x, bh.y - wh.y);
          
          if (dist < 20) {
            const x = (bh.x + wh.x) / 2;
            const y = (bh.y + wh.y) / 2;
            
            blackHoles.splice(i, 1);
            whiteHoles.splice(j, 1);
            
            if (Math.random() < 0.01) {
              return { type: 'wormhole', x, y };
            }
            return { type: 'annihilation', x, y };
          }
        }
      }
      return null;
    },
    
    setWhiteHoleMode(mode) {
      this.whiteHoleMode = mode;
    }
  };
  
})();
