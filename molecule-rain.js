/* ============================================
   🌧️⚗️ CHEMVENTUR - MOLECULE RAIN PATCH ⚗️🌧️
   ============================================
   
   Add this file AFTER main.js:
   <script src="js/molecule-rain.js"></script>
   
   This patch adds EPIC rain categories:
   💊 Medicine & Psychedelics
   🍺 Alcohols & Organic
   🍬 Sugars & Carbohydrates  
   🧴 Solvents by Polarity
   🎨 Molecules by Real Color
   💧 Water States & Chains
   ☢️ Isotopes with Real Half-Lives
   🔩 Metals Rain
   💨 Gases Rain
   🧬 Biomolecules (DNA/Proteins)
   
   ============================================ */

(function() {
  
  // ===== 🌈 MOLECULE DATABASE =====
  
  CHEMVENTUR.Molecules = {
    
    // ===== 💊 MEDICINE & PSYCHEDELICS =====
    medicine: {
      name: '💊 Medicine & Mind',
      color: '#ff00ff',
      compounds: [
        // Pain Relief
        { name: 'Aspirin', formula: 'C9H8O4', atoms: {C:9, H:8, O:4}, color: '#ffffff', emoji: '💊' },
        { name: 'Ibuprofen', formula: 'C13H18O2', atoms: {C:13, H:18, O:2}, color: '#fffaf0', emoji: '💊' },
        { name: 'Paracetamol', formula: 'C8H9NO2', atoms: {C:8, H:9, N:1, O:2}, color: '#ffffff', emoji: '💊' },
        { name: 'Morphine', formula: 'C17H19NO3', atoms: {C:17, H:19, N:1, O:3}, color: '#ffefd5', emoji: '💉' },
        { name: 'Codeine', formula: 'C18H21NO3', atoms: {C:18, H:21, N:1, O:3}, color: '#fff8dc', emoji: '💊' },
        
        // Psychedelics 🍄🌈
        { name: 'DMT', formula: 'C12H16N2', atoms: {C:12, H:16, N:2}, color: '#ff6600', emoji: '🍄', desc: 'Spirit Molecule' },
        { name: 'LSD', formula: 'C20H25N3O', atoms: {C:20, H:25, N:3, O:1}, color: '#ff00ff', emoji: '🌈', desc: 'Lysergic acid' },
        { name: 'Psilocybin', formula: 'C12H17N2O4P', atoms: {C:12, H:17, N:2, O:4, P:1}, color: '#8b4513', emoji: '🍄', desc: 'Magic Mushrooms' },
        { name: 'Mescaline', formula: 'C11H17NO3', atoms: {C:11, H:17, N:1, O:3}, color: '#00ff00', emoji: '🌵', desc: 'Peyote/San Pedro' },
        { name: 'MDMA', formula: 'C11H15NO2', atoms: {C:11, H:15, N:1, O:2}, color: '#ff69b4', emoji: '💜', desc: 'Ecstasy' },
        
        // Dissociatives
        { name: 'Ketamine', formula: 'C13H16ClNO', atoms: {C:13, H:16, Cl:1, N:1, O:1}, color: '#87ceeb', emoji: '🕳️', desc: 'K-hole explorer' },
        { name: 'PCP', formula: 'C17H25N', atoms: {C:17, H:25, N:1}, color: '#dcdcdc', emoji: '👻' },
        
        // Cannabis
        { name: 'THC', formula: 'C21H30O2', atoms: {C:21, H:30, O:2}, color: '#228b22', emoji: '🌿', desc: 'Tetrahydrocannabinol' },
        { name: 'CBD', formula: 'C21H30O2', atoms: {C:21, H:30, O:2}, color: '#32cd32', emoji: '🌱', desc: 'Cannabidiol' },
        
        // Stimulants
        { name: 'Caffeine', formula: 'C8H10N4O2', atoms: {C:8, H:10, N:4, O:2}, color: '#4a2c2a', emoji: '☕' },
        { name: 'Nicotine', formula: 'C10H14N2', atoms: {C:10, H:14, N:2}, color: '#deb887', emoji: '🚬' },
        { name: 'Amphetamine', formula: 'C9H13N', atoms: {C:9, H:13, N:1}, color: '#ffa500', emoji: '⚡' },
        
        // Sedatives
        { name: 'Diazepam', formula: 'C16H13ClN2O', atoms: {C:16, H:13, Cl:1, N:2, O:1}, color: '#add8e6', emoji: '😴', desc: 'Valium' },
        { name: 'Melatonin', formula: 'C13H16N2O2', atoms: {C:13, H:16, N:2, O:2}, color: '#191970', emoji: '🌙' }
      ]
    },
    
    // ===== 🍺 ALCOHOLS =====
    alcohols: {
      name: '🍺 Alcohols',
      color: '#ffa500',
      compounds: [
        { name: 'Methanol', formula: 'CH3OH', atoms: {C:1, H:4, O:1}, color: '#e0ffff', emoji: '☠️', desc: 'TOXIC!' },
        { name: 'Ethanol', formula: 'C2H5OH', atoms: {C:2, H:6, O:1}, color: '#f5f5dc', emoji: '🍺', desc: 'Drinking alcohol' },
        { name: 'Propanol', formula: 'C3H7OH', atoms: {C:3, H:8, O:1}, color: '#fffaf0', emoji: '🧴' },
        { name: 'Isopropanol', formula: 'C3H8O', atoms: {C:3, H:8, O:1}, color: '#f0fff0', emoji: '🧴', desc: 'Rubbing alcohol' },
        { name: 'Butanol', formula: 'C4H9OH', atoms: {C:4, H:10, O:1}, color: '#fffacd', emoji: '🧪' },
        { name: 'Glycerol', formula: 'C3H8O3', atoms: {C:3, H:8, O:3}, color: '#f5f5f5', emoji: '💧', desc: '3 OH groups' },
        { name: 'Ethylene Glycol', formula: 'C2H6O2', atoms: {C:2, H:6, O:2}, color: '#e6ffe6', emoji: '🚗', desc: 'Antifreeze' },
        { name: 'Phenol', formula: 'C6H5OH', atoms: {C:6, H:6, O:1}, color: '#ffcccc', emoji: '⚗️', desc: 'Carbolic acid' }
      ]
    },
    
    // ===== 🍬 SUGARS & CARBS =====
    sugars: {
      name: '🍬 Sugars',
      color: '#ff69b4',
      compounds: [
        { name: 'Glucose', formula: 'C6H12O6', atoms: {C:6, H:12, O:6}, color: '#ffffff', emoji: '🍬', desc: 'Blood sugar' },
        { name: 'Fructose', formula: 'C6H12O6', atoms: {C:6, H:12, O:6}, color: '#fffaf0', emoji: '🍎', desc: 'Fruit sugar' },
        { name: 'Galactose', formula: 'C6H12O6', atoms: {C:6, H:12, O:6}, color: '#fff8dc', emoji: '🥛' },
        { name: 'Sucrose', formula: 'C12H22O11', atoms: {C:12, H:22, O:11}, color: '#ffffff', emoji: '🍭', desc: 'Table sugar' },
        { name: 'Lactose', formula: 'C12H22O11', atoms: {C:12, H:22, O:11}, color: '#fffaf0', emoji: '🥛', desc: 'Milk sugar' },
        { name: 'Maltose', formula: 'C12H22O11', atoms: {C:12, H:22, O:11}, color: '#f5deb3', emoji: '🍺', desc: 'Malt sugar' },
        { name: 'Ribose', formula: 'C5H10O5', atoms: {C:5, H:10, O:5}, color: '#ffe4e1', emoji: '🧬', desc: 'In RNA' },
        { name: 'Deoxyribose', formula: 'C5H10O4', atoms: {C:5, H:10, O:4}, color: '#ffe4b5', emoji: '🧬', desc: 'In DNA' }
      ]
    },
    
    // ===== 🥓 FATS & LIPIDS =====
    fats: {
      name: '🥓 Fats & Lipids',
      color: '#ffd700',
      compounds: [
        { name: 'Palmitic Acid', formula: 'C16H32O2', atoms: {C:16, H:32, O:2}, color: '#fffff0', emoji: '🧈' },
        { name: 'Stearic Acid', formula: 'C18H36O2', atoms: {C:18, H:36, O:2}, color: '#fffaf0', emoji: '🕯️' },
        { name: 'Oleic Acid', formula: 'C18H34O2', atoms: {C:18, H:34, O:2}, color: '#ffd700', emoji: '🫒', desc: 'Olive oil' },
        { name: 'Linoleic Acid', formula: 'C18H32O2', atoms: {C:18, H:32, O:2}, color: '#f0e68c', emoji: '🌻' },
        { name: 'Cholesterol', formula: 'C27H46O', atoms: {C:27, H:46, O:1}, color: '#fffacd', emoji: '💛' },
        { name: 'Lecithin', formula: 'C42H80NO8P', atoms: {C:42, H:80, N:1, O:8, P:1}, color: '#f5deb3', emoji: '🥚' }
      ]
    },
    
    // ===== 🧴 SOLVENTS BY POLARITY =====
    solvents: {
      name: '🧴 Solvents',
      color: '#00ffff',
      compounds: [
        // Very Polar
        { name: 'Water', formula: 'H2O', atoms: {H:2, O:1}, color: '#00bfff', emoji: '💧', polarity: 10.2, desc: 'Most polar' },
        { name: 'DMSO', formula: 'C2H6OS', atoms: {C:2, H:6, O:1, S:1}, color: '#e0ffff', emoji: '🧪', polarity: 7.2 },
        { name: 'Acetonitrile', formula: 'C2H3N', atoms: {C:2, H:3, N:1}, color: '#f0ffff', emoji: '⚗️', polarity: 5.8 },
        
        // Moderately Polar  
        { name: 'Acetone', formula: 'C3H6O', atoms: {C:3, H:6, O:1}, color: '#f5fffa', emoji: '💅', polarity: 5.1 },
        { name: 'Ethyl Acetate', formula: 'C4H8O2', atoms: {C:4, H:8, O:2}, color: '#fffaf0', emoji: '🍬', polarity: 4.4 },
        { name: 'THF', formula: 'C4H8O', atoms: {C:4, H:8, O:1}, color: '#f0fff0', emoji: '⭕', polarity: 4.0, desc: 'Tetrahydrofuran' },
        
        // Low Polarity
        { name: 'Chloroform', formula: 'CHCl3', atoms: {C:1, H:1, Cl:3}, color: '#e6e6fa', emoji: '😴', polarity: 2.7 },
        { name: 'Dichloromethane', formula: 'CH2Cl2', atoms: {C:1, H:2, Cl:2}, color: '#e0e0e0', emoji: '⚗️', polarity: 3.1 },
        { name: 'Diethyl Ether', formula: 'C4H10O', atoms: {C:4, H:10, O:1}, color: '#f5f5f5', emoji: '👻', polarity: 2.8 },
        
        // Non-Polar
        { name: 'Hexane', formula: 'C6H14', atoms: {C:6, H:14}, color: '#fffaf0', emoji: '🛢️', polarity: 0.1 },
        { name: 'Toluene', formula: 'C7H8', atoms: {C:7, H:8}, color: '#ffe4e1', emoji: '🎨', polarity: 0.4 },
        { name: 'Benzene', formula: 'C6H6', atoms: {C:6, H:6}, color: '#fff0f5', emoji: '⬡', polarity: 0.0, desc: 'Carcinogenic!' }
      ]
    },
    
    // ===== 🎨 MOLECULES BY REAL COLOR =====
    colorful: {
      name: '🎨 Colorful Molecules',
      color: '#ff00ff',
      compounds: [
        // Reds & Oranges
        { name: 'β-Carotene', formula: 'C40H56', atoms: {C:40, H:56}, color: '#ff8c00', emoji: '🥕', realColor: 'orange' },
        { name: 'Lycopene', formula: 'C40H56', atoms: {C:40, H:56}, color: '#ff0000', emoji: '🍅', realColor: 'red' },
        { name: 'Hemoglobin', formula: 'C738H1166N812O203S2Fe', atoms: {C:738, H:1166, N:812, O:203, S:2, Fe:1}, color: '#8b0000', emoji: '🩸', realColor: 'red' },
        
        // Yellows
        { name: 'Riboflavin', formula: 'C17H20N4O6', atoms: {C:17, H:20, N:4, O:6}, color: '#ffd700', emoji: '💛', realColor: 'yellow', desc: 'Vitamin B2' },
        { name: 'Curcumin', formula: 'C21H20O6', atoms: {C:21, H:20, O:6}, color: '#ffc000', emoji: '🟡', realColor: 'yellow', desc: 'Turmeric' },
        { name: 'Xanthophyll', formula: 'C40H56O2', atoms: {C:40, H:56, O:2}, color: '#ffff00', emoji: '🌻', realColor: 'yellow' },
        
        // Greens
        { name: 'Chlorophyll a', formula: 'C55H72MgN4O5', atoms: {C:55, H:72, Mg:1, N:4, O:5}, color: '#228b22', emoji: '🌿', realColor: 'green' },
        { name: 'Chlorophyll b', formula: 'C55H70MgN4O6', atoms: {C:55, H:70, Mg:1, N:4, O:6}, color: '#32cd32', emoji: '🍀', realColor: 'green' },
        
        // Blues & Purples
        { name: 'Indigo', formula: 'C16H10N2O2', atoms: {C:16, H:10, N:2, O:2}, color: '#4b0082', emoji: '👖', realColor: 'indigo' },
        { name: 'Anthocyanin', formula: 'C15H11O6', atoms: {C:15, H:11, O:6}, color: '#9400d3', emoji: '🍇', realColor: 'purple' },
        { name: 'Methylene Blue', formula: 'C16H18ClN3S', atoms: {C:16, H:18, Cl:1, N:3, S:1}, color: '#0000ff', emoji: '💙', realColor: 'blue' },
        
        // Blacks
        { name: 'Melanin', formula: 'C18H10N2O4', atoms: {C:18, H:10, N:2, O:4}, color: '#1a1a1a', emoji: '⬛', realColor: 'black' },
        
        // Whites/Clear
        { name: 'Diamond', formula: 'C', atoms: {C:1}, color: '#ffffff', emoji: '💎', realColor: 'clear', desc: 'Pure carbon' }
      ]
    },
    
    // ===== 💧 WATER STATES & CHAINS =====
    water: {
      name: '💧 Water Forms',
      color: '#00bfff',
      compounds: [
        { name: 'Water Monomer', formula: 'H2O', atoms: {H:2, O:1}, color: '#87ceeb', emoji: '💧', state: 'liquid' },
        { name: 'Water Dimer', formula: '(H2O)2', atoms: {H:4, O:2}, color: '#add8e6', emoji: '💧💧', state: 'liquid', desc: 'H-bonded pair' },
        { name: 'Water Trimer', formula: '(H2O)3', atoms: {H:6, O:3}, color: '#b0e0e6', emoji: '💧💧💧', state: 'liquid' },
        { name: 'Ice Ih', formula: '(H2O)n', atoms: {H:2, O:1}, color: '#e0ffff', emoji: '🧊', state: 'solid', desc: 'Hexagonal ice' },
        { name: 'Ice II', formula: '(H2O)n', atoms: {H:2, O:1}, color: '#afeeee', emoji: '❄️', state: 'solid', desc: 'High pressure' },
        { name: 'Ice VII', formula: '(H2O)n', atoms: {H:2, O:1}, color: '#00ced1', emoji: '💠', state: 'solid', desc: 'Diamond cubic' },
        { name: 'Steam', formula: 'H2O(g)', atoms: {H:2, O:1}, color: '#f5f5f5', emoji: '♨️', state: 'gas' },
        { name: 'Supercritical Water', formula: 'H2O(sc)', atoms: {H:2, O:1}, color: '#dcdcdc', emoji: '🌀', state: 'supercritical', desc: '>374°C, >218atm' },
        { name: 'Heavy Water', formula: 'D2O', atoms: {D:2, O:1}, color: '#4682b4', emoji: '⚗️', state: 'liquid', desc: 'Deuterium oxide' },
        { name: 'Tritiated Water', formula: 'T2O', atoms: {T:2, O:1}, color: '#483d8b', emoji: '☢️', state: 'liquid', desc: 'Radioactive!' }
      ]
    },
    
    // ===== ☢️ ISOTOPES WITH HALF-LIVES =====
    isotopes: {
      name: '☢️ Isotopes',
      color: '#ff00ff',
      compounds: [
        // Very short half-lives
        { name: 'Polonium-214', symbol: 'Po', Z: 84, A: 214, halfLife: 0.000164, unit: 's', color: '#ff0000', emoji: '💀', decay: 'α' },
        { name: 'Radon-220', symbol: 'Rn', Z: 86, A: 220, halfLife: 55.6, unit: 's', color: '#ff4500', emoji: '💨', decay: 'α' },
        
        // Minutes to hours
        { name: 'Fluorine-18', symbol: 'F', Z: 9, A: 18, halfLife: 109.77, unit: 'min', color: '#00ff00', emoji: '🏥', decay: 'β+', desc: 'PET scans' },
        { name: 'Technetium-99m', symbol: 'Tc', Z: 43, A: 99, halfLife: 6.01, unit: 'h', color: '#00ffff', emoji: '🏥', decay: 'γ', desc: 'Medical imaging' },
        
        // Days
        { name: 'Iodine-131', symbol: 'I', Z: 53, A: 131, halfLife: 8.02, unit: 'd', color: '#8b008b', emoji: '☢️', decay: 'β-', desc: 'Thyroid treatment' },
        { name: 'Phosphorus-32', symbol: 'P', Z: 15, A: 32, halfLife: 14.3, unit: 'd', color: '#ffa500', emoji: '🧬', decay: 'β-' },
        
        // Years
        { name: 'Tritium', symbol: 'H', Z: 1, A: 3, halfLife: 12.32, unit: 'y', color: '#87ceeb', emoji: '💧', decay: 'β-' },
        { name: 'Cobalt-60', symbol: 'Co', Z: 27, A: 60, halfLife: 5.27, unit: 'y', color: '#4169e1', emoji: '☢️', decay: 'β-γ' },
        { name: 'Strontium-90', symbol: 'Sr', Z: 38, A: 90, halfLife: 28.8, unit: 'y', color: '#ff6347', emoji: '🦴', decay: 'β-', desc: 'Bone seeker' },
        { name: 'Cesium-137', symbol: 'Cs', Z: 55, A: 137, halfLife: 30.17, unit: 'y', color: '#dc143c', emoji: '☢️', decay: 'β-' },
        
        // Long-lived
        { name: 'Carbon-14', symbol: 'C', Z: 6, A: 14, halfLife: 5730, unit: 'y', color: '#2f4f4f', emoji: '🦴', decay: 'β-', desc: 'Dating method' },
        { name: 'Plutonium-239', symbol: 'Pu', Z: 94, A: 239, halfLife: 24110, unit: 'y', color: '#800080', emoji: '💣', decay: 'α', desc: 'Weapons grade' },
        
        // Extremely long-lived
        { name: 'Uranium-235', symbol: 'U', Z: 92, A: 235, halfLife: 704e6, unit: 'y', color: '#006400', emoji: '⚛️', decay: 'α', desc: 'Fissile' },
        { name: 'Uranium-238', symbol: 'U', Z: 92, A: 238, halfLife: 4.468e9, unit: 'y', color: '#228b22', emoji: '⚛️', decay: 'α', desc: 'Most common U' },
        { name: 'Thorium-232', symbol: 'Th', Z: 90, A: 232, halfLife: 14.05e9, unit: 'y', color: '#696969', emoji: '🌍', decay: 'α' }
      ]
    },
    
    // ===== 🔩 METALS =====
    metals: {
      name: '🔩 Metals',
      color: '#c0c0c0',
      compounds: [
        // Alkali
        { name: 'Lithium', symbol: 'Li', Z: 3, color: '#c0c0c0', emoji: '🔋', desc: 'Lightest metal' },
        { name: 'Sodium', symbol: 'Na', Z: 11, color: '#fafad2', emoji: '🧂', desc: 'Explodes in water!' },
        { name: 'Potassium', symbol: 'K', Z: 19, color: '#d3d3d3', emoji: '🍌' },
        
        // Alkaline Earth
        { name: 'Magnesium', symbol: 'Mg', Z: 12, color: '#e8e8e8', emoji: '✨', desc: 'Burns bright!' },
        { name: 'Calcium', symbol: 'Ca', Z: 20, color: '#fffaf0', emoji: '🦴' },
        
        // Transition Metals
        { name: 'Iron', symbol: 'Fe', Z: 26, color: '#708090', emoji: '⚙️' },
        { name: 'Copper', symbol: 'Cu', Z: 29, color: '#b87333', emoji: '🔶', desc: 'Conductive!' },
        { name: 'Zinc', symbol: 'Zn', Z: 30, color: '#d3d3d3', emoji: '🔋' },
        { name: 'Silver', symbol: 'Ag', Z: 47, color: '#c0c0c0', emoji: '🥈' },
        { name: 'Gold', symbol: 'Au', Z: 79, color: '#ffd700', emoji: '🥇' },
        { name: 'Platinum', symbol: 'Pt', Z: 78, color: '#e5e4e2', emoji: '💎' },
        
        // Heavy
        { name: 'Mercury', symbol: 'Hg', Z: 80, color: '#c0c0c0', emoji: '☿️', desc: 'Liquid metal!' },
        { name: 'Lead', symbol: 'Pb', Z: 82, color: '#708090', emoji: '⚫', desc: 'Heavy & toxic' },
        { name: 'Tungsten', symbol: 'W', Z: 74, color: '#a9a9a9', emoji: '💡', desc: 'Highest melting point' },
        
        // Radioactive
        { name: 'Uranium', symbol: 'U', Z: 92, color: '#3cb371', emoji: '☢️' },
        { name: 'Plutonium', symbol: 'Pu', Z: 94, color: '#800080', emoji: '💣' }
      ]
    },
    
    // ===== 💨 GASES =====
    gases: {
      name: '💨 Gases',
      color: '#87ceeb',
      compounds: [
        // Diatomic
        { name: 'Hydrogen', formula: 'H2', atoms: {H:2}, color: '#f0f0f0', emoji: '🎈', desc: 'Lightest!' },
        { name: 'Oxygen', formula: 'O2', atoms: {O:2}, color: '#add8e6', emoji: '💨', desc: 'We breathe this' },
        { name: 'Nitrogen', formula: 'N2', atoms: {N:2}, color: '#e6e6fa', emoji: '🌬️', desc: '78% of air' },
        { name: 'Chlorine', formula: 'Cl2', atoms: {Cl:2}, color: '#98fb98', emoji: '☠️', desc: 'Toxic!' },
        { name: 'Fluorine', formula: 'F2', atoms: {F:2}, color: '#ffffe0', emoji: '⚡', desc: 'Most reactive!' },
        
        // Noble Gases
        { name: 'Helium', formula: 'He', atoms: {He:1}, color: '#fffacd', emoji: '🎈', desc: 'Floats!' },
        { name: 'Neon', formula: 'Ne', atoms: {Ne:1}, color: '#ff6347', emoji: '💡', desc: 'Red signs' },
        { name: 'Argon', formula: 'Ar', atoms: {Ar:1}, color: '#dda0dd', emoji: '💜', desc: '1% of air' },
        { name: 'Krypton', formula: 'Kr', atoms: {Kr:1}, color: '#e0ffff', emoji: '💎' },
        { name: 'Xenon', formula: 'Xe', atoms: {Xe:1}, color: '#b0c4de', emoji: '💙', desc: 'Anesthetic' },
        { name: 'Radon', formula: 'Rn', atoms: {Rn:1}, color: '#ff4500', emoji: '☢️', desc: 'Radioactive!' },
        
        // Common
        { name: 'Carbon Dioxide', formula: 'CO2', atoms: {C:1, O:2}, color: '#d3d3d3', emoji: '🫧' },
        { name: 'Carbon Monoxide', formula: 'CO', atoms: {C:1, O:1}, color: '#a9a9a9', emoji: '☠️', desc: 'Silent killer!' },
        { name: 'Ammonia', formula: 'NH3', atoms: {N:1, H:3}, color: '#e0ffff', emoji: '🧪', desc: 'Pungent!' },
        { name: 'Methane', formula: 'CH4', atoms: {C:1, H:4}, color: '#f5f5dc', emoji: '🔥', desc: 'Natural gas' },
        { name: 'Ozone', formula: 'O3', atoms: {O:3}, color: '#87cefa', emoji: '🛡️', desc: 'UV protection' },
        { name: 'Hydrogen Sulfide', formula: 'H2S', atoms: {H:2, S:1}, color: '#ffff99', emoji: '🥚', desc: 'Rotten eggs!' },
        { name: 'Nitrous Oxide', formula: 'N2O', atoms: {N:2, O:1}, color: '#fffaf0', emoji: '😂', desc: 'Laughing gas!' },
        { name: 'Sulfur Dioxide', formula: 'SO2', atoms: {S:1, O:2}, color: '#ffdab9', emoji: '🌋' }
      ]
    },
    
    // ===== 🧬 BIOMOLECULES =====
    biomolecules: {
      name: '🧬 Life Molecules',
      color: '#00ff00',
      compounds: [
        // DNA/RNA Bases
        { name: 'Adenine', formula: 'C5H5N5', atoms: {C:5, H:5, N:5}, color: '#ff6347', emoji: '🅰️', desc: 'DNA base' },
        { name: 'Thymine', formula: 'C5H6N2O2', atoms: {C:5, H:6, N:2, O:2}, color: '#4169e1', emoji: '🇹', desc: 'DNA only' },
        { name: 'Guanine', formula: 'C5H5N5O', atoms: {C:5, H:5, N:5, O:1}, color: '#32cd32', emoji: '🇬', desc: 'DNA base' },
        { name: 'Cytosine', formula: 'C4H5N3O', atoms: {C:4, H:5, N:3, O:1}, color: '#ffd700', emoji: '🇨', desc: 'DNA base' },
        { name: 'Uracil', formula: 'C4H4N2O2', atoms: {C:4, H:4, N:2, O:2}, color: '#ff69b4', emoji: '🇺', desc: 'RNA only' },
        
        // Amino Acids
        { name: 'Glycine', formula: 'C2H5NO2', atoms: {C:2, H:5, N:1, O:2}, color: '#f5f5f5', emoji: '🔹', desc: 'Simplest AA' },
        { name: 'Alanine', formula: 'C3H7NO2', atoms: {C:3, H:7, N:1, O:2}, color: '#e0e0e0', emoji: '🔸' },
        { name: 'Tryptophan', formula: 'C11H12N2O2', atoms: {C:11, H:12, N:2, O:2}, color: '#dda0dd', emoji: '🦃', desc: 'Sleep inducing' },
        { name: 'Phenylalanine', formula: 'C9H11NO2', atoms: {C:9, H:11, N:1, O:2}, color: '#fafad2', emoji: '🔶' },
        
        // Neurotransmitters
        { name: 'Dopamine', formula: 'C8H11NO2', atoms: {C:8, H:11, N:1, O:2}, color: '#ff69b4', emoji: '😊', desc: 'Pleasure!' },
        { name: 'Serotonin', formula: 'C10H12N2O', atoms: {C:10, H:12, N:2, O:1}, color: '#9370db', emoji: '😌', desc: 'Happiness' },
        { name: 'Adrenaline', formula: 'C9H13NO3', atoms: {C:9, H:13, N:1, O:3}, color: '#ff4500', emoji: '⚡', desc: 'Fight or flight!' },
        { name: 'GABA', formula: 'C4H9NO2', atoms: {C:4, H:9, N:1, O:2}, color: '#87ceeb', emoji: '😴', desc: 'Calming' },
        { name: 'Acetylcholine', formula: 'C7H16NO2', atoms: {C:7, H:16, N:1, O:2}, color: '#98fb98', emoji: '🧠', desc: 'Memory' },
        
        // Vitamins
        { name: 'Vitamin C', formula: 'C6H8O6', atoms: {C:6, H:8, O:6}, color: '#ffa500', emoji: '🍊', desc: 'Ascorbic acid' },
        { name: 'Vitamin B12', formula: 'C63H88CoN14O14P', atoms: {C:63, H:88, Co:1, N:14, O:14, P:1}, color: '#ff1493', emoji: '💊', desc: 'Cobalamin' },
        
        // ATP
        { name: 'ATP', formula: 'C10H16N5O13P3', atoms: {C:10, H:16, N:5, O:13, P:3}, color: '#ffd700', emoji: '⚡', desc: 'Energy currency!' }
      ]
    }
  };
  
  // ===== 🌧️ MOLECULE RAIN SYSTEM =====
  
  CHEMVENTUR.MoleculeRain = {
    activeCategories: new Set(['elements']),
    categoryList: ['elements', 'medicine', 'alcohols', 'sugars', 'fats', 'solvents', 'colorful', 'water', 'isotopes', 'metals', 'gases', 'biomolecules'],
    
    // Spawn a random molecule from active categories
    spawn() {
      const categories = Array.from(this.activeCategories);
      if (categories.length === 0) return;
      
      const catName = categories[Math.floor(Math.random() * categories.length)];
      
      // Handle basic elements differently
      if (catName === 'elements') {
        return this.spawnElement();
      }
      
      const category = CHEMVENTUR.Molecules[catName];
      if (!category || !category.compounds.length) return;
      
      const compound = category.compounds[Math.floor(Math.random() * category.compounds.length)];
      return this.spawnCompound(compound, catName);
    },
    
    // Spawn basic element
    spawnElement() {
      const elements = [1, 6, 7, 8];  // H, C, N, O
      const Z = elements[Math.floor(Math.random() * elements.length)];
      const mass = CHEMVENTUR.Elements.getMass(Z);
      const game = CHEMVENTUR.Game;
      
      game.atoms.push(CHEMVENTUR.Particles.createAtom(
        Math.random() * game.width, -20,
        Z, mass - Z, Z,
        { vx: (Math.random() - 0.5) * 2, vy: 2 + Math.random() * 3 }
      ));
      
      game.addToInventory(Z);
      return { type: 'element', Z };
    },
    
    // Spawn compound (molecule)
    spawnCompound(compound, category) {
      const game = CHEMVENTUR.Game;
      const x = Math.random() * game.width;
      const y = -30;
      const vx = (Math.random() - 0.5) * 2;
      const vy = 1.5 + Math.random() * 2;
      
      // Create molecule entity
      const molecule = {
        x, y, vx, vy,
        name: compound.name,
        formula: compound.formula || compound.symbol,
        atoms: compound.atoms || {},
        color: compound.color || '#ffffff',
        emoji: compound.emoji || '🧪',
        category: category,
        desc: compound.desc || '',
        
        // For isotopes
        halfLife: compound.halfLife,
        halfLifeUnit: compound.unit,
        decay: compound.decay,
        Z: compound.Z,
        A: compound.A,
        
        // For solvents
        polarity: compound.polarity,
        
        // For water
        state: compound.state,
        
        // For colorful
        realColor: compound.realColor,
        
        // Physics
        orbitAngle: 0,
        createTime: Date.now(),
        size: this.calculateSize(compound),
        isMolecule: true
      };
      
      // For isotopes, handle decay
      if (compound.halfLife) {
        molecule.decayTime = this.calculateDecayTime(compound.halfLife, compound.unit);
      }
      
      game.atoms.push(molecule);
      
      return { type: 'molecule', molecule };
    },
    
    // Calculate display size based on complexity
    calculateSize(compound) {
      if (compound.atoms) {
        let totalAtoms = 0;
        Object.values(compound.atoms).forEach(n => totalAtoms += n);
        return 10 + Math.min(totalAtoms * 0.5, 30);
      }
      return 15;
    },
    
    // Calculate decay time in ms
    calculateDecayTime(halfLife, unit) {
      const multipliers = { s: 1000, min: 60000, h: 3600000, d: 86400000, y: 31536000000 };
      const baseTime = halfLife * (multipliers[unit] || 1000);
      // Scale down for gameplay (1 real year = 30 seconds game time)
      return Math.min(baseTime / 1000000, 60000);
    },
    
    // Toggle category
    toggleCategory(catName) {
      if (this.activeCategories.has(catName)) {
        this.activeCategories.delete(catName);
      } else {
        this.activeCategories.add(catName);
      }
      return this.activeCategories.has(catName);
    },
    
    // Get active categories
    getActiveCategories() {
      return Array.from(this.activeCategories);
    }
  };
  
  // ===== 🎨 EXTEND RENDERER FOR MOLECULES =====
  
  const originalDrawAtom = CHEMVENTUR.Renderer.drawAtom;
  CHEMVENTUR.Renderer.drawAtom = function(atom) {
    if (!atom.isMolecule) {
      return originalDrawAtom.call(this, atom);
    }
    
    const ctx = this.ctx;
    const r = atom.size || 15;
    const color = atom.color || '#00ff41'; // Default color if undefined
    
    // Background glow
    const grad = ctx.createRadialGradient(atom.x, atom.y, 0, atom.x, atom.y, r * 1.5);
    grad.addColorStop(0, color);
    grad.addColorStop(0.5, color + '88');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(atom.x, atom.y, r * 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Main body
    ctx.fillStyle = color;
    ctx.strokeStyle = '#ffffff44';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(atom.x, atom.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Emoji
    ctx.font = `${r}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(atom.emoji, atom.x, atom.y + r * 0.35);
    
    // Name label
    ctx.fillStyle = '#ffffff';
    ctx.font = '9px monospace';
    ctx.fillText(atom.name, atom.x, atom.y - r - 5);
    
    // Decay indicator for isotopes
    if (atom.decayTime) {
      const elapsed = Date.now() - atom.createTime;
      const remaining = 1 - (elapsed / atom.decayTime);
      
      ctx.strokeStyle = remaining > 0.5 ? '#00ff00' : remaining > 0.2 ? '#ffff00' : '#ff0000';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(atom.x, atom.y, r + 3, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * remaining);
      ctx.stroke();
    }
  };
  
  // ===== ☢️ ISOTOPE DECAY PHYSICS =====
  
  // Defer this until Game is ready
  function patchGameUpdate() {
    if (!CHEMVENTUR.Game || !CHEMVENTUR.Game.update) {
      setTimeout(patchGameUpdate, 100);
      return;
    }
    
    const originalUpdate = CHEMVENTUR.Game.update;
    CHEMVENTUR.Game.update = function() {
      originalUpdate.call(this);
      
      // Process isotope decay
      const now = Date.now();
      for (let i = this.atoms.length - 1; i >= 0; i--) {
        const atom = this.atoms[i];
        if (atom.isMolecule && atom.decayTime) {
          const elapsed = now - atom.createTime;
          if (elapsed > atom.decayTime) {
            // DECAY!
            this.atoms.splice(i, 1);
            CHEMVENTUR.UI.showStatus(`☢️ ${atom.name} decayed! (${atom.decay})`);
          }
        }
      }
    };
    
    console.log('🌧️ Molecule-rain update patch applied!');
  }
  
  // Start checking when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(patchGameUpdate, 200));
  } else {
    setTimeout(patchGameUpdate, 200);
  }
  
  // ===== 🌧️ OVERRIDE RAIN FUNCTION =====
  
  CHEMVENTUR.Game.spawnRainAtom = function() {
    CHEMVENTUR.MoleculeRain.spawn();
  };
  
  // ===== 🎛️ UI EXTENSION =====
  
  // Add molecule rain controls to UI
  CHEMVENTUR.UI.addMoleculeRainControls = function() {
    const panel = document.getElementById('left-panel');
    
    const container = document.createElement('div');
    container.className = 'info-window mt-sm';
    container.innerHTML = `
      <strong>🌧️ Molecule Rain:</strong>
      <div id="rain-categories" style="display:flex;flex-wrap:wrap;gap:2px;margin-top:4px;font-size:8px">
      </div>
    `;
    panel.appendChild(container);
    
    this.updateRainCategories();
  };
  
  CHEMVENTUR.UI.updateRainCategories = function() {
    const container = document.getElementById('rain-categories');
    if (!container) return;
    
    const categories = {
      elements: '⚛️ Elements',
      medicine: '💊 Medicine',
      alcohols: '🍺 Alcohols',
      sugars: '🍬 Sugars',
      fats: '🥓 Fats',
      solvents: '🧴 Solvents',
      colorful: '🎨 Colors',
      water: '💧 Water',
      isotopes: '☢️ Isotopes',
      metals: '🔩 Metals',
      gases: '💨 Gases',
      biomolecules: '🧬 Bio'
    };
    
    container.innerHTML = '';
    
    Object.entries(categories).forEach(([key, label]) => {
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.style.fontSize = '7px';
      btn.style.padding = '2px 4px';
      btn.textContent = label;
      
      if (CHEMVENTUR.MoleculeRain.activeCategories.has(key)) {
        btn.style.background = 'var(--neon-green)';
        btn.style.color = '#000';
      }
      
      btn.onclick = () => {
        CHEMVENTUR.MoleculeRain.toggleCategory(key);
        this.updateRainCategories();
        CHEMVENTUR.Audio.click();
      };
      
      container.appendChild(btn);
    });
  };
  
  // Add controls when DOM ready
  const originalInit = CHEMVENTUR.UI.init;
  CHEMVENTUR.UI.init = function() {
    originalInit.call(this);
    this.addMoleculeRainControls();
  };
  
  console.log('🌧️⚗️ MOLECULE RAIN PATCH LOADED! ⚗️🌧️');
  console.log('Categories:', Object.keys(CHEMVENTUR.Molecules));
  
})();
