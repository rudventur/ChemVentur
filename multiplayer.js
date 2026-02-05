/* ============================================
   CHEMVENTUR v116 - MULTIPLAYER MODULE 🎮
   Firebase Realtime Database Integration
   
   Features:
   - Real-time player sync (see other ships!)
   - Room system (create/join)
   - Trading atoms & resources
   - Leaderboards
   - Presence (who's online)
   
   Setup:
   1. Create Firebase project at https://firebase.google.com
   2. Enable Realtime Database (test mode)
   3. Enable Anonymous Auth
   4. Replace firebaseConfig below with yours
   ============================================ */

(function() {
  
  // ========================================
  // 🔥 FIREBASE CONFIG - REPLACE WITH YOURS!
  // ========================================
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com/",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123:web:abc123"
  };
  
  // ========================================
  // 🎮 MULTIPLAYER SYSTEM
  // ========================================
  CHEMVENTUR.Multiplayer = {
    // State
    enabled: false,
    connected: false,
    playerUid: null,
    playerName: 'Anonymous',
    currentRoom: null,
    players: {},
    
    // Firebase refs
    db: null,
    auth: null,
    roomRef: null,
    playerRef: null,
    
    // Sync settings
    UPDATE_INTERVAL: 50, // ms between position updates
    lastUpdate: 0,
    
    // ===== INITIALIZATION =====
    init() {
      // Check if Firebase SDK is loaded
      if (typeof firebase === 'undefined') {
        console.warn('🎮 Firebase SDK not loaded. Add these to your HTML:');
        console.warn('<script src="https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js"></script>');
        console.warn('<script src="https://www.gstatic.com/firebasejs/10.13.1/firebase-database-compat.js"></script>');
        console.warn('<script src="https://www.gstatic.com/firebasejs/10.13.1/firebase-auth-compat.js"></script>');
        this.enabled = false;
        return false;
      }
      
      // Check if config is set
      if (firebaseConfig.apiKey === "YOUR_API_KEY_HERE") {
        console.warn('🎮 Firebase not configured! Edit js/multiplayer.js with your config.');
        this.enabled = false;
        this.showSetupGuide();
        return false;
      }
      
      try {
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        this.db = firebase.database();
        this.auth = firebase.auth();
        
        // Sign in anonymously
        this.auth.signInAnonymously().catch(err => {
          console.error('🎮 Auth error:', err);
          CHEMVENTUR.UI?.showStatus('❌ Multiplayer auth failed');
        });
        
        // Listen for auth state
        this.auth.onAuthStateChanged(user => {
          if (user) {
            this.playerUid = user.uid;
            this.playerName = 'Player' + user.uid.slice(-4);
            this.connected = true;
            this.enabled = true;
            console.log('🎮 Multiplayer ready! UID:', this.playerUid);
            CHEMVENTUR.UI?.showStatus('🎮 Multiplayer connected!');
            this.updateMultiplayerUI();
          } else {
            this.connected = false;
            this.auth.signInAnonymously();
          }
        });
        
        // Connection status
        this.db.ref('.info/connected').on('value', snap => {
          this.connected = snap.val() === true;
          this.updateMultiplayerUI();
        });
        
        this.createMultiplayerUI();
        return true;
        
      } catch (err) {
        console.error('🎮 Firebase init error:', err);
        this.enabled = false;
        return false;
      }
    },
    
    // ===== ROOM MANAGEMENT =====
    createRoom() {
      if (!this.enabled || !this.playerUid) {
        CHEMVENTUR.UI?.showStatus('❌ Not connected to multiplayer');
        return null;
      }
      
      const roomId = this.db.ref('games').push().key;
      this.joinRoom(roomId);
      return roomId;
    },
    
    joinRoom(roomId) {
      if (!this.enabled || !this.playerUid) {
        CHEMVENTUR.UI?.showStatus('❌ Not connected to multiplayer');
        return false;
      }
      
      // Leave current room first
      if (this.currentRoom) {
        this.leaveRoom();
      }
      
      this.currentRoom = roomId;
      this.roomRef = this.db.ref(`games/${roomId}`);
      this.playerRef = this.db.ref(`games/${roomId}/players/${this.playerUid}`);
      
      // Get initial ship data
      const Game = CHEMVENTUR.Game;
      const ShipRepair = CHEMVENTUR.ShipRepair;
      
      // Set player data
      this.playerRef.set({
        name: this.playerName,
        x: Game?.ship?.x || 400,
        y: Game?.ship?.y || 500,
        hp: ShipRepair?.ship?.currentHP || 100,
        maxHP: ShipRepair?.ship?.maxHP || 100,
        score: 0,
        stage: Game?.stage || 1,
        shipColor: ShipRepair?.shipColor || '#00ff41',
        atoms: Game?.atoms?.length || 0,
        online: true,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      }).then(() => {
        console.log('🎮 Joined room:', roomId);
        CHEMVENTUR.UI?.showStatus(`🎮 Joined room: ${roomId.slice(-6)}`);
      }).catch(err => {
        console.error('🎮 Join failed:', err);
        CHEMVENTUR.UI?.showStatus('❌ Failed to join room');
      });
      
      // Auto-remove on disconnect
      this.playerRef.child('online').onDisconnect().set(false);
      this.playerRef.onDisconnect().update({
        online: false,
        lastSeen: firebase.database.ServerValue.TIMESTAMP
      });
      
      // Listen for other players
      this.startListening();
      this.updateMultiplayerUI();
      
      return true;
    },
    
    leaveRoom() {
      if (this.playerRef) {
        this.playerRef.update({ online: false });
      }
      
      // Stop listening
      if (this.roomRef) {
        this.roomRef.child('players').off();
        this.roomRef.child('chat').off();
        this.roomRef.child('trades').off();
      }
      
      this.currentRoom = null;
      this.roomRef = null;
      this.playerRef = null;
      this.players = {};
      
      this.updateMultiplayerUI();
      CHEMVENTUR.UI?.showStatus('🚪 Left room');
    },
    
    // ===== REAL-TIME SYNC =====
    startListening() {
      if (!this.roomRef) return;
      
      // Listen for all players
      this.roomRef.child('players').on('value', snap => {
        this.players = snap.val() || {};
        this.updatePlayerList();
      });
      
      // Listen for chat
      this.roomRef.child('chat').orderByChild('timestamp').limitToLast(50).on('child_added', snap => {
        const msg = snap.val();
        this.addChatMessage(msg);
      });
      
      // Listen for trades
      this.roomRef.child('trades').on('child_added', snap => {
        const trade = snap.val();
        if (trade.to === this.playerUid && trade.status === 'pending') {
          this.handleTradeRequest(snap.key, trade);
        }
      });
    },
    
    // Update own position (call from game loop)
    syncPosition() {
      if (!this.enabled || !this.playerRef || !this.currentRoom) return;
      
      const now = Date.now();
      if (now - this.lastUpdate < this.UPDATE_INTERVAL) return;
      
      const Game = CHEMVENTUR.Game;
      const ShipRepair = CHEMVENTUR.ShipRepair;
      
      if (!Game) return;
      
      this.playerRef.update({
        x: Game.ship.x,
        y: Game.ship.y,
        hp: ShipRepair?.ship?.currentHP || 100,
        score: this.calculateScore(),
        stage: Game.stage,
        shipColor: ShipRepair?.shipColor || '#00ff41',
        atoms: Game.atoms?.length || 0,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      });
      
      this.lastUpdate = now;
    },
    
    calculateScore() {
      const Game = CHEMVENTUR.Game;
      const StringSys = CHEMVENTUR.StringSystem;
      
      let score = 0;
      score += (Game?.atoms?.length || 0) * 10;
      score += (StringSys?.subatomicParticles?.length || 0) * 5;
      if (StringSys?.achievements?.URANIUM) score += 10000;
      
      return score;
    },
    
    // ===== RENDER OTHER PLAYERS =====
    drawOtherPlayers(ctx) {
      if (!this.enabled || !this.currentRoom) return;
      
      Object.entries(this.players).forEach(([uid, player]) => {
        if (uid === this.playerUid) return; // Skip self
        if (!player.online) return; // Skip offline
        
        this.drawRemoteShip(ctx, player);
      });
    },
    
    drawRemoteShip(ctx, player) {
      ctx.save();
      
      const x = player.x || 0;
      const y = player.y || 0;
      const color = player.shipColor || '#888888';
      
      // Ghost effect for remote players
      ctx.globalAlpha = 0.7;
      
      // Glow
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      
      // Ship triangle
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.moveTo(x, y - 15);
      ctx.lineTo(x - 10, y + 10);
      ctx.lineTo(x + 10, y + 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Name tag
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(player.name || 'Player', x, y - 22);
      
      // HP bar
      const hpPercent = (player.hp || 0) / (player.maxHP || 100);
      ctx.fillStyle = '#333';
      ctx.fillRect(x - 15, y + 15, 30, 4);
      ctx.fillStyle = hpPercent > 0.5 ? '#00ff41' : hpPercent > 0.25 ? '#ffff00' : '#ff0000';
      ctx.fillRect(x - 15, y + 15, 30 * hpPercent, 4);
      
      ctx.restore();
    },
    
    // ===== CHAT =====
    sendChat(message) {
      if (!this.roomRef || !message.trim()) return;
      
      this.roomRef.child('chat').push({
        from: this.playerUid,
        name: this.playerName,
        message: message.trim().slice(0, 200),
        timestamp: firebase.database.ServerValue.TIMESTAMP
      });
    },
    
    addChatMessage(msg) {
      const chatBox = document.getElementById('mp-chat-messages');
      if (!chatBox) return;
      
      const div = document.createElement('div');
      div.className = 'chat-msg' + (msg.from === this.playerUid ? ' own' : '');
      div.innerHTML = `<span class="chat-name">${msg.name}:</span> ${this.escapeHtml(msg.message)}`;
      chatBox.appendChild(div);
      chatBox.scrollTop = chatBox.scrollHeight;
    },
    
    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },
    
    // ===== TRADING =====
    requestTrade(toUid, item, amount) {
      if (!this.roomRef) return;
      
      this.roomRef.child('trades').push({
        from: this.playerUid,
        fromName: this.playerName,
        to: toUid,
        item: item,
        amount: amount,
        status: 'pending',
        timestamp: firebase.database.ServerValue.TIMESTAMP
      });
      
      CHEMVENTUR.UI?.showStatus(`📦 Trade request sent!`);
    },
    
    handleTradeRequest(tradeId, trade) {
      const accept = confirm(`${trade.fromName} wants to trade ${trade.amount} ${trade.item}. Accept?`);
      
      if (accept) {
        // Accept trade
        this.roomRef.child(`trades/${tradeId}`).update({ status: 'accepted' });
        
        // Transfer resources
        if (trade.item === 'scrapMetal' && CHEMVENTUR.ShipRepair) {
          CHEMVENTUR.ShipRepair.resources.scrapMetal += trade.amount;
        } else if (trade.item === 'atoms' && CHEMVENTUR.Game) {
          // Add atoms
          for (let i = 0; i < trade.amount; i++) {
            CHEMVENTUR.Game.atoms.push(CHEMVENTUR.Particles.createAtom(
              Math.random() * 500 + 100,
              Math.random() * 300 + 100,
              1, 1, 1, { vx: 0, vy: 0 }
            ));
          }
        }
        
        CHEMVENTUR.UI?.showStatus(`✅ Trade accepted! +${trade.amount} ${trade.item}`);
      } else {
        this.roomRef.child(`trades/${tradeId}`).update({ status: 'rejected' });
      }
    },
    
    // ===== LEADERBOARD =====
    updateLeaderboard() {
      if (!this.db || !this.playerUid) return;
      
      const score = this.calculateScore();
      this.db.ref(`leaderboards/global/${this.playerUid}`).set({
        name: this.playerName,
        score: score,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      });
    },
    
    getLeaderboard(callback) {
      this.db.ref('leaderboards/global')
        .orderByChild('score')
        .limitToLast(10)
        .once('value', snap => {
          const data = snap.val() || {};
          const sorted = Object.entries(data)
            .map(([uid, d]) => ({ uid, ...d }))
            .sort((a, b) => b.score - a.score);
          callback(sorted);
        });
    },
    
    // ===== UI =====
    createMultiplayerUI() {
      if (document.getElementById('mp-panel')) return;
      
      const panel = document.createElement('div');
      panel.id = 'mp-panel';
      panel.innerHTML = `
        <div class="mp-header">
          <span>🎮 MULTIPLAYER</span>
          <span id="mp-status" class="mp-status">Offline</span>
        </div>
        
        <div class="mp-section">
          <div id="mp-room-info" style="display:none;">
            Room: <span id="mp-room-id">---</span>
            <button class="mp-btn small" onclick="CHEMVENTUR.Multiplayer.leaveRoom()">Leave</button>
          </div>
          <div id="mp-no-room">
            <button class="mp-btn" onclick="CHEMVENTUR.Multiplayer.createRoom()">Create Room</button>
            <div style="margin:5px 0;font-size:10px;color:#888;">- or -</div>
            <input type="text" id="mp-join-input" placeholder="Room code..." class="mp-input">
            <button class="mp-btn" onclick="CHEMVENTUR.Multiplayer.joinRoomFromInput()">Join</button>
          </div>
        </div>
        
        <div class="mp-section" id="mp-players-section" style="display:none;">
          <div class="mp-label">Players Online:</div>
          <div id="mp-player-list"></div>
        </div>
        
        <div class="mp-section" id="mp-chat-section" style="display:none;">
          <div class="mp-label">Chat:</div>
          <div id="mp-chat-messages"></div>
          <div class="mp-chat-input-row">
            <input type="text" id="mp-chat-input" placeholder="Message..." class="mp-input"
                   onkeypress="if(event.key==='Enter')CHEMVENTUR.Multiplayer.sendChatFromInput()">
            <button class="mp-btn small" onclick="CHEMVENTUR.Multiplayer.sendChatFromInput()">Send</button>
          </div>
        </div>
        
        <div class="mp-section">
          <button class="mp-btn" onclick="CHEMVENTUR.Multiplayer.showLeaderboard()">🏆 Leaderboard</button>
        </div>
      `;
      
      document.body.appendChild(panel);
      this.addMultiplayerStyles();
    },
    
    updateMultiplayerUI() {
      const statusEl = document.getElementById('mp-status');
      const roomInfo = document.getElementById('mp-room-info');
      const noRoom = document.getElementById('mp-no-room');
      const roomIdEl = document.getElementById('mp-room-id');
      const playersSection = document.getElementById('mp-players-section');
      const chatSection = document.getElementById('mp-chat-section');
      
      if (statusEl) {
        statusEl.textContent = this.connected ? 'Online' : 'Offline';
        statusEl.className = 'mp-status ' + (this.connected ? 'online' : 'offline');
      }
      
      if (this.currentRoom) {
        if (roomInfo) roomInfo.style.display = 'block';
        if (noRoom) noRoom.style.display = 'none';
        if (roomIdEl) roomIdEl.textContent = this.currentRoom.slice(-6);
        if (playersSection) playersSection.style.display = 'block';
        if (chatSection) chatSection.style.display = 'block';
      } else {
        if (roomInfo) roomInfo.style.display = 'none';
        if (noRoom) noRoom.style.display = 'block';
        if (playersSection) playersSection.style.display = 'none';
        if (chatSection) chatSection.style.display = 'none';
      }
    },
    
    updatePlayerList() {
      const list = document.getElementById('mp-player-list');
      if (!list) return;
      
      const onlinePlayers = Object.entries(this.players)
        .filter(([uid, p]) => p.online)
        .map(([uid, p]) => ({
          uid,
          name: p.name || 'Player',
          score: p.score || 0,
          isSelf: uid === this.playerUid
        }));
      
      list.innerHTML = onlinePlayers.map(p => `
        <div class="mp-player ${p.isSelf ? 'self' : ''}">
          <span>${p.name}</span>
          <span class="mp-score">${p.score}</span>
          ${!p.isSelf ? `<button class="mp-btn tiny" onclick="CHEMVENTUR.Multiplayer.openTradeWith('${p.uid}')">Trade</button>` : ''}
        </div>
      `).join('') || '<div style="color:#666">No players</div>';
    },
    
    joinRoomFromInput() {
      const input = document.getElementById('mp-join-input');
      if (input && input.value.trim()) {
        this.joinRoom(input.value.trim());
        input.value = '';
      }
    },
    
    sendChatFromInput() {
      const input = document.getElementById('mp-chat-input');
      if (input && input.value.trim()) {
        this.sendChat(input.value);
        input.value = '';
      }
    },
    
    openTradeWith(uid) {
      const player = this.players[uid];
      if (!player) return;
      
      const amount = prompt(`Trade with ${player.name}. How much scrap metal?`);
      if (amount && parseInt(amount) > 0) {
        this.requestTrade(uid, 'scrapMetal', parseInt(amount));
      }
    },
    
    showLeaderboard() {
      this.getLeaderboard(leaders => {
        let html = '<h3>🏆 Top Players</h3>';
        leaders.forEach((p, i) => {
          html += `<div class="lb-row">${i + 1}. ${p.name} - ${p.score}</div>`;
        });
        
        const popup = document.createElement('div');
        popup.className = 'mp-popup';
        popup.innerHTML = html + '<button class="mp-btn" onclick="this.parentElement.remove()">Close</button>';
        document.body.appendChild(popup);
      });
    },
    
    showSetupGuide() {
      console.log(`
╔════════════════════════════════════════════════════════╗
║  🎮 FIREBASE MULTIPLAYER SETUP GUIDE                   ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  1. Go to https://firebase.google.com                  ║
║  2. Click "Get Started" → Create project               ║
║  3. Project name: "chemventur-multi"                   ║
║  4. Disable Google Analytics (optional)                ║
║  5. Click "Create project"                             ║
║                                                        ║
║  6. Click </> (Web) icon to add web app                ║
║  7. Nickname: "chemventur"                             ║
║  8. Copy the firebaseConfig object!                    ║
║                                                        ║
║  9. Sidebar → Realtime Database → Create Database      ║
║  10. Start in TEST MODE                                ║
║  11. Copy your database URL                            ║
║                                                        ║
║  12. Sidebar → Authentication → Get Started            ║
║  13. Sign-in method → Anonymous → Enable               ║
║                                                        ║
║  14. Edit js/multiplayer.js line ~20                   ║
║  15. Paste your config!                                ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
      `);
    },
    
    addMultiplayerStyles() {
      if (document.getElementById('mp-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'mp-styles';
      style.textContent = `
        #mp-panel {
          position: fixed;
          right: 10px;
          top: 10px;
          width: 220px;
          background: rgba(0, 17, 0, 0.95);
          border: 2px solid #00ff41;
          border-radius: 10px;
          padding: 10px;
          font-family: monospace;
          font-size: 11px;
          color: #00ff41;
          z-index: 9000;
          max-height: 80vh;
          overflow-y: auto;
        }
        
        .mp-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          padding-bottom: 8px;
          border-bottom: 1px solid #00ff41;
          font-weight: bold;
        }
        
        .mp-status {
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 3px;
        }
        
        .mp-status.online {
          background: #003300;
          color: #00ff41;
        }
        
        .mp-status.offline {
          background: #330000;
          color: #ff3333;
        }
        
        .mp-section {
          margin: 10px 0;
          padding: 8px;
          background: rgba(0, 255, 65, 0.05);
          border-radius: 5px;
        }
        
        .mp-label {
          color: #888;
          font-size: 10px;
          margin-bottom: 5px;
        }
        
        .mp-btn {
          background: #003300;
          border: 1px solid #00ff41;
          color: #00ff41;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-family: monospace;
          font-size: 11px;
          transition: all 0.2s;
        }
        
        .mp-btn:hover {
          background: #004400;
          box-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
        }
        
        .mp-btn.small {
          padding: 3px 8px;
          font-size: 10px;
        }
        
        .mp-btn.tiny {
          padding: 2px 5px;
          font-size: 9px;
        }
        
        .mp-input {
          background: #001100;
          border: 1px solid #00ff41;
          color: #00ff41;
          padding: 5px;
          border-radius: 3px;
          width: 100%;
          font-family: monospace;
          font-size: 10px;
          margin: 3px 0;
        }
        
        .mp-player {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px;
          margin: 2px 0;
          background: rgba(0, 255, 65, 0.1);
          border-radius: 3px;
        }
        
        .mp-player.self {
          border-left: 2px solid #00ff41;
        }
        
        .mp-score {
          color: #ffff00;
          font-size: 10px;
        }
        
        #mp-chat-messages {
          height: 80px;
          overflow-y: auto;
          background: #000;
          padding: 5px;
          border-radius: 3px;
          margin-bottom: 5px;
        }
        
        .chat-msg {
          margin: 2px 0;
          font-size: 10px;
        }
        
        .chat-msg.own {
          color: #00ffff;
        }
        
        .chat-name {
          color: #888;
        }
        
        .mp-chat-input-row {
          display: flex;
          gap: 5px;
        }
        
        .mp-chat-input-row .mp-input {
          flex: 1;
        }
        
        .mp-popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 17, 0, 0.98);
          border: 2px solid #ffd700;
          border-radius: 10px;
          padding: 20px;
          z-index: 20000;
          min-width: 250px;
          text-align: center;
        }
        
        .mp-popup h3 {
          color: #ffd700;
          margin: 0 0 15px 0;
        }
        
        .lb-row {
          padding: 5px;
          margin: 3px 0;
          background: rgba(255, 215, 0, 0.1);
          border-radius: 3px;
        }
      `;
      document.head.appendChild(style);
    }
  };
  
  console.log('🎮 Multiplayer module loaded! Call CHEMVENTUR.Multiplayer.init() to connect.');
  
})();
