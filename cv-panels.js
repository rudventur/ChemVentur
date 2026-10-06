// ═══════════════════════════════════════════════════════════════
//  cv-panels.js — ChemVentur left panel on the shared hide / show pattern
//  (needs panel-toggle.js first, and runs after ui.js / main.js).
//
//  • A slim header strip at the top of #left-panel with the same
//    "◀ hide" toggle every Snout First panel has.
//  • Hidden: the panel goes, the playfield takes the whole width (the
//    canvas is resized through the game's own resize handler) and a
//    "▶ PANEL" tab on the left edge brings it back.
//  • The choice is remembered on this device. With nothing saved the panel
//    starts open, except on phone-width screens where it used to cover the
//    whole playfield.
//  • Builds that have the phone slide-in drawer (☰ button) keep it: on
//    phone-width screens the same toggle simply opens / closes the drawer,
//    and the ☰ button and backdrop keep the toggle in step.
// ═══════════════════════════════════════════════════════════════
(function () {
  if (!window.sfPanels) return;
  const panel = document.getElementById('left-panel');
  if (!panel) return;
  const body = document.body;
  const hasDrawer = !!document.getElementById('panel-toggle-btn');
  const phoneMQ = window.matchMedia('(max-width: 480px)');
  const drawerMode = () => hasDrawer && phoneMQ.matches;

  const hideRules = `
    body.sf-hidden-left #left-panel { display: none; }
    body.sf-hidden-left #canvas-container { left: 0; }
    body.sf-hidden-left .cv-left-tab.sf-ptab { display: flex; }`;
  const css = `
    :root { --sf-panel-accent: var(--neon-green, #00ff41); --sf-panel-text: var(--neon-green, #00ff41);
      --sf-panel-ink: var(--bg-primary, #001100); --sf-panel-font: 'Courier New', monospace;
      --sf-panel-font-size: 11px; --sf-panel-radius: 4px; --sf-panel-title-font: 'Courier New', monospace;
      --sf-panel-title-size: 10px; --sf-panel-title-spacing: 2px; }
    #left-panel > .cv-lp-head {
      position: sticky; top: -10px; z-index: 4; margin: -10px -10px 8px; padding: 5px 10px;
      background: var(--bg-secondary, #031107); border-bottom: 1px solid rgba(0, 255, 65, 0.35);
    }
    #left-panel > .cv-lp-head .sf-ptitle { font-weight: bold; }
    .cv-left-tab.sf-ptab {
      display: none; position: fixed; left: 0; top: 64px; z-index: 20; /* clear of the R button at mid-left */
      flex-direction: column; gap: 6px; padding: 10px 4px; border-radius: 0 8px 8px 0;
      box-shadow: 0 0 12px var(--sf-panel-accent);
    }
    .cv-left-tab .cv-tab-txt { writing-mode: vertical-rl; letter-spacing: 2px; font-weight: bold; }
    ${hasDrawer ? '@media (min-width: 481px) {' + hideRules + '}' : hideRules}
  `;
  const st = document.createElement('style');
  st.id = 'cvPanelStyle';
  st.textContent = css;
  document.head.appendChild(st);

  const head = document.createElement('div');
  head.className = 'sf-phead cv-lp-head';
  head.innerHTML = '<span class="sf-ptitle">☰ PANEL</span>' +
    '<button class="sf-ptoggle" type="button" data-panel-toggle="left"><span class="sf-pt-icon"></span><span class="sf-pt-label"></span></button>';
  panel.insertBefore(head, panel.firstChild);

  const tab = document.createElement('button');
  tab.type = 'button';
  tab.className = 'sf-ptab cv-left-tab';
  tab.dataset.panelToggle = 'left';
  tab.innerHTML = '<span class="sf-pt-icon"></span><span class="cv-tab-txt">PANEL</span>';
  body.appendChild(tab);

  const reflow = () => window.dispatchEvent(new Event('resize'));
  sfPanels.register({
    id: 'left', el: panel, label: 'the left panel', side: 'left',
    remember: false, // saved by hand below: the phone drawer is never remembered
    read: () => drawerMode() ? panel.classList.contains('panel-open') : !body.classList.contains('sf-hidden-left'),
    apply: open => {
      if (drawerMode()) {
        if (open !== panel.classList.contains('panel-open')) CHEMVENTUR.UI.togglePanel();
        return;
      }
      body.classList.toggle('sf-hidden-left', !open);
      sfPanels.save('left', open);
      reflow();
    }
  });
  if (!drawerMode()) {
    const want = sfPanels.saved('left', !phoneMQ.matches);
    if (!want) sfPanels.set('left', false);
  }

  // The ☰ button and the backdrop open / close the drawer themselves.
  const UI = window.CHEMVENTUR && CHEMVENTUR.UI;
  if (UI) ['togglePanel', 'closePanel'].forEach(fn => {
    if (typeof UI[fn] !== 'function') return;
    const orig = UI[fn];
    UI[fn] = function () { const r = orig.apply(this, arguments); sfPanels.sync('left'); return r; };
  });
  // Crossing the phone breakpoint switches between drawer and hide / show.
  const onBreak = () => {
    if (!drawerMode()) body.classList.toggle('sf-hidden-left', sfPanels.saved('left', !phoneMQ.matches) === false);
    sfPanels.sync('left');
    reflow();
  };
  if (phoneMQ.addEventListener) phoneMQ.addEventListener('change', onBreak);
})();
