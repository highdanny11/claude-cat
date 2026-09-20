/* ============================================
   喵喵之家 — 房間佈置
   純函式：佈置評分與畫面字串；另含拖拉控制器
   layout 形如 { litter: { x: 1, y: 2 }, food: { x: 4, y: 0 } }
   ============================================ */
(function () {
  'use strict';

  const { ROOM, ROOM_ITEMS, ROOM_RULES } = window.CatData;

  const START_BASE = 60;
  const START_MIN = 30;
  const START_MAX = 90;
  const DRAG_THRESHOLD = 6;   // 移動超過幾 px 才視為拖拉（否則當作點選）

  /* ---------- 純函式 ---------- */
  function getItem(id) {
    return ROOM_ITEMS.filter((it) => it.id === id)[0] || null;
  }

  /* 目標（物品 id 或 @固定物）所佔的座標；未放置回傳空陣列 */
  function pointsOf(target, layout) {
    if (target.charAt(0) === '@') return ROOM.fixed[target].points;
    return layout[target] ? [layout[target]] : [];
  }

  /* 8 方向格距 */
  function distance(p, q) {
    return Math.max(Math.abs(p.x - q.x), Math.abs(p.y - q.y));
  }

  function minDistance(aPoints, bPoints) {
    let min = Infinity;
    aPoints.forEach((p) => {
      bPoints.forEach((q) => { min = Math.min(min, distance(p, q)); });
    });
    return min;
  }

  function isBlocked(x, y) {
    return Object.keys(ROOM.fixed).some((key) => {
      const f = ROOM.fixed[key];
      return f.blocks && f.points.some((p) => p.x === x && p.y === y);
    });
  }

  function itemAt(layout, x, y) {
    return Object.keys(layout).filter((id) => layout[id].x === x && layout[id].y === y)[0] || null;
  }

  function canPlace(layout, itemId, x, y) {
    if (x < 0 || y < 0 || x >= ROOM.cols || y >= ROOM.rows) return false;
    if (isBlocked(x, y)) return false;
    const occupant = itemAt(layout, x, y);
    return !occupant || occupant === itemId;
  }

  function placeItem(layout, itemId, x, y) {
    const next = Object.assign({}, layout);
    next[itemId] = { x: x, y: y };
    return next;
  }

  function removeItem(layout, itemId) {
    const next = Object.assign({}, layout);
    delete next[itemId];
    return next;
  }

  function missingRequired(layout) {
    return ROOM_ITEMS.filter((it) => it.kind === 'required' && !layout[it.id]);
  }

  function checkRule(rule, layout) {
    const aPoints = pointsOf(rule.a, layout);

    if (rule.type === 'placed') return aPoints.length > 0;
    if (rule.type === 'absent') return aPoints.length === 0;
    if (!aPoints.length) return null;   // 主角沒放，略過這條

    const bPoints = rule.b.reduce((acc, t) => acc.concat(pointsOf(t, layout)), []);
    if (!bPoints.length) return null;

    const d = minDistance(aPoints, bPoints);
    return rule.type === 'apart' ? d >= rule.min : d <= rule.max;
  }

  /* 回傳每條適用規則的結果，供巡房逐條講評 */
  function evaluateLayout(layout) {
    return ROOM_RULES
      .map((rule) => {
        const pass = checkRule(rule, layout);
        if (pass === null) return null;
        return {
          id: rule.id,
          pass: pass,
          line: pass ? rule.pass : rule.fail,
          tip: rule.tip,
          effects: pass ? rule.passEffects : rule.failEffects,
          focus: (pass ? rule.passFocus : rule.failFocus) || rule.focus
        };
      })
      .filter(Boolean);
  }

  function startMeters(results) {
    const sum = results.reduce((acc, r) => ({
      hunger: acc.hunger + r.effects.hunger,
      clean: acc.clean + r.effects.clean,
      mood: acc.mood + r.effects.mood
    }), { hunger: START_BASE, clean: START_BASE, mood: START_BASE });

    const clamp = (n) => Math.max(START_MIN, Math.min(START_MAX, n));
    return { hunger: clamp(sum.hunger), clean: clamp(sum.clean), mood: clamp(sum.mood) };
  }

  /* 貓咪要走到哪一格：物品所在格，或固定物旁邊的格 */
  function catSpot(target, layout) {
    if (target && target.charAt(0) === '@') return ROOM.fixed[target].catAt;
    if (target && layout[target]) return layout[target];
    return { x: 3, y: 2 };
  }

  /* ---------- 畫面字串 ---------- */
  const pct = (n, total) => (n / total * 100) + '%';

  function itemHtml(item, opts) {
    const selected = opts.selected === item.id;
    const tag = opts.interactive ? 'button' : 'span';
    return '<' + tag + ' class="room-item" data-item="' + item.id + '"' +
             (opts.interactive ? ' type="button" aria-pressed="' + selected + '"' : '') +
             ' title="' + item.name + '" aria-label="' + item.name + '">' +
             '<span class="room-item-emoji" aria-hidden="true">' + item.emoji + '</span>' +
             (opts.showName ? '<span class="room-item-name">' + item.name + '</span>' : '') +
           '</' + tag + '>';
  }

  function roomHtml(layout, options) {
    const opts = options || {};
    const cells = [];

    for (let y = 0; y < ROOM.rows; y++) {
      for (let x = 0; x < ROOM.cols; x++) {
        const id = itemAt(layout, x, y);
        const blocked = isBlocked(x, y);
        const tag = opts.interactive && !blocked && !id ? 'button' : 'div';   // 有物品的格子不可再包一層 button
        cells.push(
          '<' + tag + ' class="room-cell' + (blocked ? ' is-fixed' : '') + '"' +
            (tag === 'button' ? ' type="button"' : '') +
            ' data-x="' + x + '" data-y="' + y + '"' +
            ' aria-label="第 ' + (y + 1) + ' 排第 ' + (x + 1) + ' 格' + (id ? '：' + getItem(id).name : '') + '">' +
            (id ? itemHtml(getItem(id), { interactive: opts.interactive, selected: opts.selected }) : '') +
          '</' + tag + '>'
        );
      }
    }

    const sofa = ROOM.fixed['@sofa'];
    const win = ROOM.fixed['@window'];
    const door = ROOM.fixed['@door'];

    const cat = opts.cat
      ? '<div class="cat-token" aria-hidden="true" style="left:' + pct(opts.cat.x, ROOM.cols) +
          ';top:' + pct(opts.cat.y, ROOM.rows) + ';width:' + pct(1, ROOM.cols) +
          ';height:' + pct(1, ROOM.rows) + '"><span>' + (opts.catFace || '🐱') + '</span></div>'
      : '';

    return '<div class="room-wrap' + (opts.mini ? ' is-mini' : '') + '">' +
      '<div class="room-grid"' + (opts.interactive ? ' data-interactive="true"' : '') +
        ' style="grid-template-columns:repeat(' + ROOM.cols + ',1fr)">' +
        cells.join('') +
        '<div class="room-window" style="left:' + pct(win.points[0].x, ROOM.cols) +
          ';width:' + pct(win.points.length, ROOM.cols) + '">' + win.emoji + ' 窗戶</div>' +
        '<div class="room-door" style="top:' + pct(door.points[0].y, ROOM.rows) +
          ';height:' + pct(1, ROOM.rows) + '">' + door.emoji + '</div>' +
        '<div class="room-sofa" aria-label="沙發（固定）" style="left:' + pct(sofa.points[0].x, ROOM.cols) +
          ';top:' + pct(sofa.points[0].y, ROOM.rows) + ';width:' + pct(sofa.points.length, ROOM.cols) +
          ';height:' + pct(1, ROOM.rows) + '">' + sofa.emoji + '</div>' +
        cat +
      '</div>' +
    '</div>';
  }

  function trayHtml(layout, selected) {
    const rest = ROOM_ITEMS.filter((it) => !layout[it.id]);
    return '<div class="item-tray" data-tray="true" aria-label="物品匣">' +
      (rest.length
        ? rest.map((it) => itemHtml(it, { interactive: true, selected: selected, showName: true })).join('')
        : '<p class="muted" style="margin:0">物品都擺進房間了。想拿掉的話，把它拖回這裡。</p>') +
    '</div>';
  }

  /* ---------- 拖拉控制器 ----------
     只在 rootEl 上綁一次（事件委派）。拖拉期間只動 DOM，放開時才呼叫 handlers  */
  function bindDrag(rootEl, handlers) {
    let drag = null;          // { itemId, startX, startY, ghost, active }
    let suppressClick = false;

    const interactive = () => rootEl.querySelector('.room-grid[data-interactive]');

    function clearDropMarks() {
      Array.prototype.forEach.call(rootEl.querySelectorAll('[data-drop]'), (el) => {
        el.removeAttribute('data-drop');
      });
    }

    function targetAt(clientX, clientY) {
      const el = document.elementFromPoint(clientX, clientY);
      if (!el) return {};
      return {
        cell: el.closest('.room-cell'),
        tray: el.closest('[data-tray]')
      };
    }

    function onMove(e) {
      if (!drag) return;

      if (!drag.active) {
        const moved = Math.abs(e.clientX - drag.startX) + Math.abs(e.clientY - drag.startY);
        if (moved < DRAG_THRESHOLD) return;
        drag.active = true;
        drag.ghost = document.createElement('div');
        drag.ghost.className = 'room-ghost';
        drag.ghost.textContent = getItem(drag.itemId).emoji;
        document.body.appendChild(drag.ghost);
        drag.source.classList.add('is-dragging');
      }

      e.preventDefault();
      drag.ghost.style.left = e.clientX + 'px';
      drag.ghost.style.top = e.clientY + 'px';

      clearDropMarks();
      const t = targetAt(e.clientX, e.clientY);
      if (t.cell) {
        const ok = handlers.canPlace(drag.itemId, Number(t.cell.dataset.x), Number(t.cell.dataset.y));
        t.cell.setAttribute('data-drop', ok ? 'ok' : 'no');
      } else if (t.tray) {
        t.tray.setAttribute('data-drop', 'ok');
      }
    }

    function onUp(e) {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', onUp);
      if (!drag) return;

      const current = drag;
      drag = null;
      clearDropMarks();
      if (current.ghost) current.ghost.remove();
      current.source.classList.remove('is-dragging');

      if (!current.active || e.type === 'pointercancel') return;

      /* 真的拖過：吃掉緊接而來的 click，避免又被當成點選 */
      suppressClick = true;
      window.setTimeout(() => { suppressClick = false; }, 0);

      const t = targetAt(e.clientX, e.clientY);
      if (t.cell) handlers.onPlace(current.itemId, Number(t.cell.dataset.x), Number(t.cell.dataset.y));
      else if (t.tray) handlers.onRemove(current.itemId);
    }

    rootEl.addEventListener('pointerdown', (e) => {
      if (!interactive() || e.button > 0) return;
      const source = e.target.closest('.room-item[data-item]');
      if (!source) return;
      drag = { itemId: source.dataset.item, source: source, startX: e.clientX, startY: e.clientY, ghost: null, active: false };
      document.addEventListener('pointermove', onMove, { passive: false });
      document.addEventListener('pointerup', onUp);
      document.addEventListener('pointercancel', onUp);
    });

    /* 點選放置（滑鼠、觸控、鍵盤共用）：先點物品，再點格子或物品匣 */
    rootEl.addEventListener('click', (e) => {
      if (!interactive()) return;
      if (suppressClick) { e.preventDefault(); return; }

      const item = e.target.closest('.room-item[data-item]');
      if (item) { handlers.onSelect(item.dataset.item); return; }

      const cell = e.target.closest('.room-cell');
      if (cell && !cell.classList.contains('is-fixed')) {
        handlers.onCellClick(Number(cell.dataset.x), Number(cell.dataset.y));
        return;
      }

      if (e.target.closest('[data-tray]')) handlers.onTrayClick();
    });
  }

  window.CatRoom = Object.freeze({
    getItem,
    distance,
    canPlace,
    placeItem,
    removeItem,
    missingRequired,
    evaluateLayout,
    startMeters,
    catSpot,
    roomHtml,
    trayHtml,
    bindDrag
  });
})();
