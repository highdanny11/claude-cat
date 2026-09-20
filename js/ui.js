/* ============================================
   喵喵之家 — 共用 UI 工具
   導覽列狀態、貓咪卡片、Modal、Toast
   ============================================ */
(function () {
  'use strict';

  const { CATS } = window.CatData;

  /* ---------- 小工具 ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function energyBar(level) {
    return '🐾'.repeat(level) + '<span class="muted">' + '·'.repeat(5 - level) + '</span>';
  }

  function getCat(id) {
    return CATS.filter((c) => c.id === id)[0] || null;
  }

  /* ---------- 導覽列 active 狀態 ---------- */
  function markActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    $$('.nav-links a').forEach((link) => {
      const href = link.getAttribute('href');
      if (href === path) link.setAttribute('aria-current', 'page');
    });
  }

  /* ---------- 貓咪卡片 ---------- */
  function catCardHtml(cat) {
    return (
      '<button class="cat-card" type="button" data-cat-id="' + cat.id + '" ' +
      'aria-label="查看 ' + escapeHtml(cat.name) + ' 的詳細資料">' +
        '<div class="cat-avatar" style="background:' + cat.color + '">' + cat.emoji + '</div>' +
        '<div class="cat-card-body">' +
          '<h3>' + escapeHtml(cat.name) + '</h3>' +
          '<p class="cat-meta">' + cat.age + ' 歲 · ' + escapeHtml(cat.gender) + ' · ' + escapeHtml(cat.breed) + '</p>' +
          '<div class="tag-row">' +
            cat.personality.map((p) => '<span class="tag">' + escapeHtml(p) + '</span>').join('') +
          '</div>' +
        '</div>' +
      '</button>'
    );
  }

  function renderCatGrid(container, cats) {
    if (!container) return;
    if (!cats.length) {
      container.innerHTML =
        '<p class="text-center muted" style="grid-column:1/-1">' +
        '這個條件下暫時沒有符合的貓咪，換個條件看看吧 🐾</p>';
      return;
    }
    container.innerHTML = cats.map(catCardHtml).join('');
  }

  /* ---------- Modal ---------- */
  let lastFocused = null;

  function ensureModal() {
    let backdrop = $('#cat-modal');
    if (backdrop) return backdrop;

    backdrop = document.createElement('div');
    backdrop.id = 'cat-modal';
    backdrop.className = 'modal-backdrop';
    backdrop.hidden = true;
    backdrop.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="cat-modal-title">' +
        '<button class="modal-close" type="button" aria-label="關閉">✕</button>' +
        '<div class="modal-content"></div>' +
      '</div>';
    document.body.appendChild(backdrop);

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop || e.target.classList.contains('modal-close')) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !backdrop.hidden) closeModal();
    });
    return backdrop;
  }

  function openCatModal(catId) {
    const cat = getCat(catId);
    if (!cat) return;

    const backdrop = ensureModal();
    const faved = window.CatStore.isFavorite(cat.id);

    $('.modal-content', backdrop).innerHTML =
      '<div class="cat-avatar" style="background:' + cat.color + ';border-radius:var(--radius)">' + cat.emoji + '</div>' +
      '<h2 id="cat-modal-title" style="margin-top:1rem">' + escapeHtml(cat.name) + '</h2>' +
      '<p class="cat-meta">' + cat.age + ' 歲 · ' + escapeHtml(cat.gender) + ' · ' + escapeHtml(cat.breed) + '</p>' +
      '<div class="tag-row" style="margin-bottom:1rem">' +
        cat.personality.map((p) => '<span class="tag tag-peach">' + escapeHtml(p) + '</span>').join('') +
      '</div>' +
      '<p>' + escapeHtml(cat.story) + '</p>' +
      '<p><strong>活動力：</strong>' + energyBar(cat.energy) + '</p>' +
      '<p><strong>健康狀況：</strong>' + escapeHtml(cat.health) + '</p>' +
      '<p><strong>領養前請留意：</strong></p>' +
      '<ul>' + cat.needs.map((n) => '<li>' + escapeHtml(n) + '</li>').join('') + '</ul>' +
      '<div class="action-row">' +
        '<button class="btn btn-secondary" type="button" data-fav="' + cat.id + '">' +
          (faved ? '💛 已收藏' : '🤍 加入收藏') +
        '</button>' +
        '<a class="btn" href="adopt.html">開始領養闖關</a>' +
      '</div>';

    const favBtn = $('[data-fav]', backdrop);
    favBtn.addEventListener('click', () => {
      const nowFaved = window.CatStore.toggleFavorite(cat.id);
      favBtn.textContent = nowFaved ? '💛 已收藏' : '🤍 加入收藏';
      toast(nowFaved ? '已把 ' + cat.name + ' 加入收藏' : '已取消收藏 ' + cat.name);
      document.dispatchEvent(new CustomEvent('cat:favorite-changed'));
    });

    lastFocused = document.activeElement;
    backdrop.hidden = false;
    $('.modal-close', backdrop).focus();
  }

  function closeModal() {
    const backdrop = $('#cat-modal');
    if (!backdrop) return;
    backdrop.hidden = true;
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  /* 卡片點擊委派 */
  function bindCatGrid(container) {
    if (!container) return;
    container.addEventListener('click', (e) => {
      const card = e.target.closest('[data-cat-id]');
      if (card) openCatModal(card.getAttribute('data-cat-id'));
    });
  }

  /* ---------- Toast ---------- */
  let toastTimer = null;

  function toast(message) {
    let el = $('#toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.className = 'toast';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => { el.hidden = true; }, 2200);
  }

  document.addEventListener('DOMContentLoaded', markActiveNav);

  window.CatUI = Object.freeze({
    $, $$,
    escapeHtml,
    energyBar,
    getCat,
    catCardHtml,
    renderCatGrid,
    bindCatGrid,
    openCatModal,
    closeModal,
    toast
  });
})();
