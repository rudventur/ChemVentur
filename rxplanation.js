(function () {
  var EXPLAIN = {
    'btn-target': 'Sets the shot target. Free play aims anywhere; a locked target pulls shots toward that particle.',
    'btn-rain': 'Toggles molecule rain. Drops PubChem molecules into the stage so they can bond and react.',
    'btn-collider': 'Cycles collider mode. None is free play; other modes smash particles on contact.',
    'btn-gravity': 'Opens gravity options and flips the gravity direction shown on the label.',
    'btn-boundary': 'Wall behavior. Open lets particles leave; closed bounces them back into the stage.',
    'btn-grid': 'Shows or hides the placement grid used for strings, atoms, and repair tiles.',
    'btn-clear': 'Clears particles, shots, and temporary effects from the current stage.',
    'btn-garage': 'Opens the ship garage to repair hull, engines, and systems.',
    'btn-electron-mode': 'Cycles electron behavior between normal, musical, and excited modes.',
    'btn-periodic-table': 'Opens the 118-element table. Pick an element to spawn it.',
    'btn-pubchem': 'Opens PubChem search so you can drop a real molecule into the stage.',
    'btn-audio-toggle': 'Mutes or unmutes sound effects.',
    'btn-music-toggle': 'Starts or stops the background music.',
    'btn-music-upload': 'Loads a local audio file to use as the soundtrack.',
    'env-btn': 'Opens the environment panel with 16 calculators for temperature, pressure, and fields.',
    'gun-1': 'Proton gun. Fires positive particles that attract electrons.',
    'gun-2': 'Neutron gun. Fires neutral particles that can stick to nuclei.',
    'gun-3': 'Electron gun with a musical trail. Fires negative particles.',
    'gun-4': 'Rain gun. Seeds molecule rain where you shoot.',
    'gun-5': 'Atom gun. Spawns whole atoms from the selected element.',
    'gun-6': 'Shotgun. Sprays a cluster of particles.',
    'gun-7': 'Beam gun. Holds a continuous musical beam.',
    'gun-8': 'Antimatter gun. Opposite charges annihilate on contact.',
    'gun-9': 'Gravity gun. Pulls or pushes nearby particles.',
    'gun-0': 'Time gun. Slows particles in the blast area.'
  };

  function label(el) {
    return (el.innerText || el.getAttribute('aria-label') || el.id || 'button').replace(/\s+/g, ' ').trim();
  }

  function explain(el) {
    if (el.dataset && el.dataset.rxplanation) return el.dataset.rxplanation;
    if (el.id && EXPLAIN[el.id]) return EXPLAIN[el.id];
    if (el.dataset && el.dataset.gun && EXPLAIN['gun-' + el.dataset.gun]) return EXPLAIN['gun-' + el.dataset.gun];
    var title = el.getAttribute('title');
    if (title && title !== 'Right-click for rxplanation') return title;
    return label(el) + ' — activates this control. Right-click any button to open its rxplanation.';
  }

  function menu() {
    var m = document.getElementById('rxplanation');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'rxplanation';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-label', 'rxplanation');
    m.innerHTML = '<div class="rx-title">rxplanation</div><div class="rx-body"></div><button type="button" class="rx-close" data-rxplanation="Closes this rxplanation panel without changing the game.">close</button>';
    document.body.appendChild(m);
    m.querySelector('.rx-close').addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      m.style.display = 'none';
    });
    return m;
  }

  function show(el, x, y) {
    var m = menu();
    m.querySelector('.rx-body').textContent = explain(el);
    m.style.display = 'block';
    var w = m.offsetWidth || 280;
    var h = m.offsetHeight || 120;
    m.style.left = Math.max(8, Math.min(x, window.innerWidth - w - 8)) + 'px';
    m.style.top = Math.max(8, Math.min(y, window.innerHeight - h - 8)) + 'px';
  }

  document.addEventListener('contextmenu', function (e) {
    var el = e.target.closest('button, a, [role="button"], .btn, .gun-btn, .bb');
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    show(el, e.clientX, e.clientY);
  }, true);

  document.addEventListener('click', function (e) {
    var m = document.getElementById('rxplanation');
    if (!m || m.style.display !== 'block') return;
    if (!m.contains(e.target)) m.style.display = 'none';
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var m = document.getElementById('rxplanation');
      if (m) m.style.display = 'none';
    }
  });

  function stamp() {
    document.querySelectorAll('button, a, [role="button"]').forEach(function (el) {
      el.classList.add('has-rxplanation');
      if (!el.getAttribute('title')) el.setAttribute('title', 'Right-click for rxplanation');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', stamp);
  else stamp();
  new MutationObserver(stamp).observe(document.documentElement, { childList: true, subtree: true });
})();
