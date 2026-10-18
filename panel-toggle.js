// ═══════════════════════════════════════════════════════════════
//  panel-toggle.js — one hide / show pattern for every Snout First panel
//
//  Every panel gets the same three things:
//    1. a header strip (.sf-phead) with its name (.sf-ptitle) and, at the
//       end, the same toggle button (.sf-ptoggle: chevron + "hide"/"show")
//    2. when hidden, a small tab (.sf-ptab) at the panel's edge to bring it
//       back (the side panels' edge tabs, the tab under the top bar), or the
//       panel's own header when the panel collapses to its header
//    3. its open / hidden choice remembered on this device (localStorage,
//       STORE_KEY below), unless the panel opts out (pop-overs do)
//
//  Markup (no inline onclick needed; one delegated listener below):
//    <div class="sf-phead">
//      <span class="sf-ptitle">📊 STATS</span>
//      <button class="sf-ptoggle" type="button" data-panel-toggle="stats">
//        <span class="sf-pt-icon"></span><span class="sf-pt-label"></span>
//      </button>
//    </div>
//    <div class="sf-pbody">…what hides…</div>
//
//  Register once the panel exists:
//    sfPanels.register({ id: 'stats', el: '#sfStats', label: 'the stats', side: 'top' });
//  Options:
//    side      'top' | 'left' | 'right' | 'bottom' picks the chevrons
//              (▲▼ / ◀▶ / ▶◀ / ▼▲); may be a function (a column on wide
//              screens that becomes a bottom sheet on phones)
//    remember  false = never saved (pop-overs such as Trail and Pack)
//    open      starting state when nothing is saved (default true)
//    read()    how to tell whether the panel is open (default: no
//              .sf-panel-collapsed class on el)
//    apply(o)  how to open / hide it (default: toggles .sf-panel-collapsed
//              on el, which hides its .sf-pbody)
//  Every change also sets body.sf-hidden-<id> while the panel is hidden,
//  so page CSS can react (for example the top bar frees its height).
//
//  Colours: --sf-panel-accent, --sf-panel-text, --sf-panel-ink. Type:
//  --sf-panel-font (buttons, tabs), --sf-panel-title-font / -size / -spacing
//  (titles), --sf-panel-font-size, --sf-panel-radius.
//
//  Public: window.sfPanels — register, toggle, set, isOpen, sync, saved,
//  save, STORE_KEY.
// ═══════════════════════════════════════════════════════════════

(function () {
// Loaded twice (two pages' scripts, an embed and the page)? Keep the first:
// a second copy would add a second click listener and undo every toggle.
if (window.sfPanels) return;

const STORE_KEY = 'chemventur_panels';     // { panelId: true (open) | false (hidden) }
const ICONS = {
  top:   { open: '▲', closed: '▼' },
  left:  { open: '◀', closed: '▶' },
  right: { open: '▶', closed: '◀' },
  bottom: { open: '▼', closed: '▲' }
};
const panels = {};

// ── Remembered choices (this device only) ──
function loadAll() {
  try { const v = JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); return (v && typeof v === 'object') ? v : {}; }
  catch (e) { return {}; }
}
function saved(id, fallback) {
  const v = loadAll()[id];
  return typeof v === 'boolean' ? v : fallback;
}
function save(id, open) {
  const all = loadAll();
  all[id] = !!open;
  try { localStorage.setItem(STORE_KEY, JSON.stringify(all)); } catch (e) {}
}

// ── State ──
function elOf(p) { return typeof p.el === 'string' ? document.querySelector(p.el) : p.el; }
function isOpen(id) {
  const p = panels[id];
  if (!p) return false;
  if (p.read) return !!p.read();
  const el = elOf(p);
  return !!el && !el.classList.contains('sf-panel-collapsed');
}
function defaultApply(p, open) {
  const el = elOf(p);
  if (el) el.classList.toggle('sf-panel-collapsed', !open);
}
function set(id, open, opts) {
  const p = panels[id];
  if (!p) return;
  open = !!open;
  if (p.apply) p.apply(open); else defaultApply(p, open);
  if (p.remember !== false && !(opts && opts.noSave)) save(id, open);
  sync(id);
}
function toggle(id) { set(id, !isOpen(id)); }

// Bring every toggle for this panel (header button, edge tab) up to date.
function sync(id) {
  const p = panels[id];
  if (!p) return;
  const open = isOpen(id);
  const icons = ICONS[typeof p.side === 'function' ? p.side() : p.side] || ICONS.top;
  const el = elOf(p);
  document.querySelectorAll('[data-panel-toggle="' + id + '"]').forEach(b => {
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (el && el.id) b.setAttribute('aria-controls', el.id);
    b.title = (open ? 'Hide ' : 'Show ') + p.label;
    b.classList.toggle('sf-pt-open', open);
    const icon = b.querySelector('.sf-pt-icon');
    if (icon) icon.textContent = open ? icons.open : icons.closed;
    const label = b.querySelector('.sf-pt-label');
    if (label) label.textContent = open ? (label.dataset.open || 'hide') : (label.dataset.closed || 'show');
  });
  document.body.classList.toggle('sf-hidden-' + id, !open);
}

function register(cfg) {
  if (!cfg || !cfg.id) return;
  const p = Object.assign({ side: 'top', label: 'this panel', remember: true, open: true }, cfg);
  panels[p.id] = p;
  // Panels with their own state (read/apply) restore themselves; the rest
  // start the way they were left on this device.
  if (!p.read) set(p.id, p.remember !== false ? saved(p.id, p.open) : p.open, { noSave: true });
  else sync(p.id);
}

// One listener for every toggle button and tab on the page.
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('[data-panel-toggle]');
  if (!b || !panels[b.dataset.panelToggle]) return;
  e.preventDefault();
  toggle(b.dataset.panelToggle);
});
// Toggles that are not real buttons (role="button") open with Enter or Space too.
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const b = e.target.closest && e.target.closest('[data-panel-toggle]');
  if (!b || b.tagName === 'BUTTON' || !panels[b.dataset.panelToggle]) return;
  e.preventDefault();
  toggle(b.dataset.panelToggle);
});

// ── Shared look (colours come from the page; override with the CSS variables) ──
function injectStyle() {
  if (document.getElementById('sfPanelStyle')) return;
  const css = `
    :where(.sf-phead) { display: flex; align-items: center; gap: 8px; }
    .sf-ptitle {
      font-family: var(--sf-panel-title-font, 'Press Start 2P', monospace); font-size: var(--sf-panel-title-size, .5rem); letter-spacing: var(--sf-panel-title-spacing, 1px);
      color: var(--sf-panel-text, #ffcc66); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .sf-ptitle b { font-family: var(--sf-panel-font, 'VT323', monospace); font-size: .85rem; color: #88cc44; font-weight: normal; margin-left: 4px; letter-spacing: 0; }
    .sf-ptoggle {
      margin-left: auto; flex-shrink: 0; display: inline-flex; align-items: center; gap: 4px;
      background: none; border: 1px solid var(--sf-panel-accent, #cc8833); color: var(--sf-panel-text, #ffcc66);
      border-radius: var(--sf-panel-radius, 6px); cursor: pointer; font-family: var(--sf-panel-font, 'VT323', monospace); font-size: var(--sf-panel-font-size, .9rem);
      line-height: 1.2; padding: 1px 8px; white-space: nowrap;
    }
    .sf-ptoggle:hover, .sf-ptoggle:focus-visible { background: var(--sf-panel-accent, #cc8833); color: var(--sf-panel-ink, #1a120a); outline: none; }
    .sf-pt-icon { font-size: .7rem; }
    .sf-ptab {
      background: var(--sf-panel-accent, #cc8833); color: var(--sf-panel-ink, #1a120a);
      border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px;
      font-family: var(--sf-panel-font, 'VT323', monospace); font-size: var(--sf-panel-font-size, .9rem); user-select: none; padding: 0;
    }
    .sf-ptab:hover, .sf-ptab:focus-visible { filter: brightness(1.15); outline: none; }
    .sf-panel-collapsed > .sf-pbody { display: none; }
  `;
  const style = document.createElement('style');
  style.id = 'sfPanelStyle';
  style.textContent = css;
  document.head.appendChild(style);
}
injectStyle();

window.sfPanels = { register, toggle, set, isOpen, sync, saved, save, STORE_KEY };

})();
