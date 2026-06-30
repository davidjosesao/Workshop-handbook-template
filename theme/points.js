(function () {
  "use strict";

  const STORAGE_TOTAL = 'mdbook-points:total';
  const STORAGE_SEEN  = 'mdbook-points:seen';
  const EVENT_NAME    = 'points:change';

  const state = { total: 0, seen: new Set() };

  // reads saved total and the set of already answered question ids
  const loadState = () => {
    try {
      state.total = parseInt(localStorage.getItem(STORAGE_TOTAL), 10) || 0;
      const raw = localStorage.getItem(STORAGE_SEEN);
      state.seen = new Set(raw ? JSON.parse(raw) : []);
    } catch (e) {
      console.log('PointsSystem: localStorage unavailable.', e);
    }
  };

  // rrites state.total into localStorage as like a string
  const saveTotal = () => {
    localStorage.setItem(STORAGE_TOTAL, String(state.total));
  };

  // writes the seen Set into localStorage by converting to array
  const saveSeen = () => {
    localStorage.setItem(STORAGE_SEEN, JSON.stringify(Array.from(state.seen)));
  };

  // subscriber stuff
  // holds function registers using the PointsSystem.subscribe(fn)
  const subscribers = [];

  // builds objects describing changes like new total n by how much
  const notify = (delta, id) => {
    const detail = { total: state.total, delta, id: id || null };
    subscribers.forEach(fn => {
      try { fn(state.total, detail); } catch (e) { console.error(e); }
    });
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail }));
  };

  // public API stuff like add, get, has, reset, subscribe

  // marks the id as seen + saves ts + adds amount to the total + saves ts total
  const add = (amount, id) => {
    amount = Number(amount) || 0;

    if (id !== undefined && id !== null) {
      id = String(id);
      if (state.seen.has(id)) {
        // if that q already answered
        return { total: state.total, applied: false };
      }
      state.seen.add(id);
      saveSeen();
    }

    state.total += amount;
    saveTotal();
    notify(amount, id);
    updateWidget();

    return { total: state.total, applied: true };
  };

  // just returns the current total
  const get = () => state.total;
  // returns true/false for if a given question id has already been ansowered
  const has = (id) => state.seen.has(String(id));

  // reset everything
  const reset = () => {
    state.total = 0;
    state.seen  = new Set();
    saveTotal();
    saveSeen();
    notify(0, null);
    updateWidget();
  };


  // callback to be notified on every points change
  const subscribe = (fn) => {
    if (typeof fn !== 'function') return () => {};
    subscribers.push(fn);
    return () => {
      const i = subscribers.indexOf(fn);
      if (i > -1) subscribers.splice(i, 1);
    };
  };

  let widgetElement = null;
  let pillElement   = null;

  const PILL_STYLES = [
    'display:inline-flex',
    'align-items:center',
    'gap:5px',
    'height:var(--menu-bar-height,50px)',
    'padding:0 10px',
    'font-size:13px',
    'font-weight:700',
    'color:var(--fg)',
    'white-space:nowrap',
    'cursor:default',
    'user-select:none',
    'pointer-events:none',
    'line-height:var(--menu-bar-height,50px)',
  ].join(';');

  // creates the visual pill (star + number) + put in to the mdBook menu bar
  const buildWidget = () => {
    if (pillElement) return;

    const rightButtons = document.querySelector('#mdbook-menu-bar .right-buttons');
    if (!rightButtons) return;

    pillElement = document.createElement('div');
    pillElement.id = 'mdbook-points-pill';
    pillElement.setAttribute('aria-label', 'Your points total');
    pillElement.setAttribute('role', 'status');
    pillElement.setAttribute('aria-live', 'polite');
    pillElement.style.cssText = PILL_STYLES;

    const star = document.createElement('span');
    star.textContent = '★';
    star.style.fontSize = '15px';

    widgetElement = document.createElement('span');
    widgetElement.id = 'mdbook-points-value';
    widgetElement.textContent = String(state.total);

    pillElement.appendChild(star);
    pillElement.appendChild(widgetElement);

    rightButtons.insertBefore(pillElement, rightButtons.firstChild);
  };

  // updates the number shown on the pill
  const updateWidget = () => {
    if (!widgetElement) return;
    widgetElement.textContent = String(state.total);

    pillElement.style.transition = 'transform 120ms ease';
    pillElement.style.transform  = 'scale(1.18)';
    setTimeout(() => { pillElement.style.transform = 'scale(1)'; }, 140);
  };
 
  // keep tabs in sync
  window.addEventListener('storage', e => {
    if (e.key === STORAGE_TOTAL || e.key === STORAGE_SEEN) {
      loadState();
      if (widgetElement) widgetElement.textContent = String(state.total);
      notify(0, null);
    }
  });

  // initial state
  loadState();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
  } else {
    buildWidget();
  }

  window.PointsSystem = { add, get, has, reset, subscribe };
})();