# CHEMVENTUR v116 - MULTIPLAYER EDITION 🛠️☢️🎻⚛️🎮

## THE DREAM SINCE OCTOBER! THE DREAM SINCE BIRTH!
### Build Uranium-238 from vibrating strings... WITH FRIENDS!

---

## 🎮 MULTIPLAYER IS HERE!

### What you can do:
- 👀 **See other players' ships** in real-time!
- 🏠 **Create/Join rooms** with room codes
- 💬 **Chat** with other players
- 📦 **Trade** atoms and resources
- 🏆 **Leaderboards** - compete for high scores!

---

## 🔥 FIREBASE SETUP (One-Time, ~5 minutes)

### Step 1: Create Firebase Project
1. Go to **https://firebase.google.com**
2. Click **"Get Started"** → **"Create a project"**
3. Name it: `chemventur-multi`
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Add Web App
1. On project dashboard, click the **</>** (Web) icon
2. App nickname: `chemventur`
3. **DON'T** check "Firebase Hosting"
4. Click **"Register app"**
5. **COPY the `firebaseConfig` object!** You'll need this!

### Step 3: Enable Realtime Database
1. Sidebar → **Realtime Database** → **Create Database**
2. Choose location (any is fine)
3. Select **"Start in test mode"** (we'll secure later)
4. Click **"Enable"**
5. Copy your database URL (looks like `https://yourproject-default-rtdb.firebaseio.com/`)

### Step 4: Enable Anonymous Auth
1. Sidebar → **Authentication** → **Get started**
2. **Sign-in method** tab → **Anonymous** → **Enable** → **Save**

### Step 5: Configure CHEMVENTUR
1. Open `js/multiplayer.js`
2. Find `firebaseConfig` (around line 20)
3. Replace with YOUR config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "chemventur-multi.firebaseapp.com",
  databaseURL: "https://chemventur-multi-default-rtdb.firebaseio.com/",
  projectId: "chemventur-multi",
  storageBucket: "chemventur-multi.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc123"
};
```

### Step 6: Upload to GitHub & Play!
1. Upload all files to your repo
2. Enable GitHub Pages
3. Open in 2 browsers → Create room → Share code → PLAY TOGETHER!

---

## 🎮 HOW TO PLAY MULTIPLAYER

1. **Look at top-right panel** - you'll see "🎮 MULTIPLAYER"
2. **Create Room** - click to get a room code
3. **Share the code** with a friend
4. **Friend joins** by entering the code
5. **You'll see each other's ships!** (slightly transparent)
6. **Chat & Trade** using the panel
7. **Compete** for highest score!

---

## 🆕 Also New in v116

- 🖱️ **Right-click context menus** on all buttons
- ⌨️ **Ship controls**: A=left, D=right, S=toggle gravity
- ✨ **Gun 8 scraps atoms** into resources
- ⬆️ **12-level upgrade system**
- 🛡️ **Balanced damage** (70% slower)

---

## 🎮 Stage System

| Stage | Name | Description |
|-------|------|-------------|
| 0 | 🎻 String Universe | Build matter from vibrating strings! |
| 1 | ⚛️ Subatomic | Atoms, bonds, reactions |
| 2 | 🧬 Molecular | RDKit + PubChem 3D |

**Controls:**
- `SHIFT + Scroll` = Change stage
- `CTRL + Scroll` = Zoom in/out

---

## 🔫 Guns (Keys 1-0)

| Key | Gun | Creates |
|-----|-----|---------|
| 1 | Proton Stringer | 6 strings → proton |
| 2 | Neutron Stringer | 6 strings → neutron |
| 3 | Electron Stringer | 3 strings → electron |
| 4 | String Rain | + Zen Mode option |
| 5 | Gluon Stringer | Spider webs for nuclei! |
| 6 | Shotgun | Multiple strings |
| 7 | Random Beam | Constant flow |
| 8 | Anti-Stringer | Dead strings → rubber ball |
| 9 | Knot Stringer | Transforms after 5s |
| 0 | Time Stringer | Ignores time, transforms others |

---

## 🛠️ The Garage

Press the 🔧 button to open the garage!

### Repair Options:
| Option | Cost | Repair | Time |
|--------|------|--------|------|
| 🩹 Quick Patch | 10 scrap | +15 HP | 1s |
| 🔧 Weld Repair | 25 scrap | +35 HP | 2.5s |
| 🛠️ Full Overhaul | 50 scrap | +100 HP | 5s |
| ⚡ Hull Upgrade | 100 scrap | +100 HP + 25 Max | 8s |

### Resources (earned from gameplay):
- 🔩 Scrap Metal - From destroyed particles
- ⚡ Energy Cells - From captured electrons
- ☢️ Fusion Cores - From successful fusions
- 🎻 String Essence - From Stage 0 string combinations

---

## ☢️ Uranium Fusion

The ultimate goal! Build Uranium-238:
- **92 protons** (each from 6 proton strings)
- **146 neutrons** (each from 6 neutron strings)  
- **92 electrons** (each from 3 electron strings)

Use **Gluon Webs** (Gun 5) to capture and fuse particles!

---

## 📁 File Structure

```
chemventur_v114/
├── index.html          # Main HTML with all UI
├── README.md           # This file
├── css/
│   ├── main.css        # Core styles
│   ├── ui.css          # UI components
│   ├── effects.css     # Visual effects
│   ├── env.css         # Environment window
│   └── periodicTable.css
└── js/
    ├── config.js       # Configuration
    ├── main.js         # Game loop
    ├── render.js       # Canvas rendering
    ├── particles.js    # Particle physics
    ├── strings.js      # String Universe (Stage 0)
    ├── shipRepair.js   # 🛠️ Garage system
    ├── ui.js           # User interface
    ├── guns.js         # Gun system
    ├── holes.js        # Black/white holes
    ├── grid.js         # Pressure grid
    ├── molecular.js    # Molecular bonding
    ├── molecule-rain.js
    ├── molecule-structures.js
    ├── periodicTableFull.js
    ├── pubchem.js      # Local molecule database
    ├── pubchem-api.js  # Live PubChem API
    ├── audio.js        # Sound effects
    ├── audioSystem.js  # Audio manager
    ├── soundPhysics.js # Physics-based sound
    └── envCalc.js      # Environment calculators
```

---

## 🚀 How to Run

1. Open `index.html` in a web browser
2. Press guns 1-3 to create strings
3. Watch them combine into subatomic particles!
4. Use gluon webs (Gun 5) to capture and fuse
5. Build your way to Uranium! ☢️

---

## 💖 Made with Love

*The dream since October... the dream since birth!*

Merged with 💚 by Claude
