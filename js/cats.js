/* ============================================
   喵喵之家 — 貓咪圖鑑篩選
   ============================================ */
(function () {
  'use strict';

  const { CATS } = window.CatData;
  const { $, $$, renderCatGrid, bindCatGrid } = window.CatUI;

  /* 篩選條件：id -> 判斷函式（純函式，不改動原資料） */
  const FILTERS = {
    all: () => true,
    kitten: (cat) => cat.age <= 2,
    adult: (cat) => cat.age >= 3 && cat.age <= 6,
    senior: (cat) => cat.age >= 7,
    calm: (cat) => cat.energy <= 2,
    active: (cat) => cat.energy >= 4,
    novice: (cat) => cat.match.noviceFriendly,
    favorite: (cat) => window.CatStore.isFavorite(cat.id)
  };

  let current = 'all';

  function render() {
    const predicate = FILTERS[current] || FILTERS.all;
    const list = CATS.filter(predicate);
    const grid = $('#cat-grid');
    renderCatGrid(grid, list);

    const count = $('#result-count');
    if (current === 'favorite' && !list.length) {
      count.textContent = '還沒有收藏任何貓咪，點開卡片按下「加入收藏」吧 🤍';
    } else {
      count.textContent = '共 ' + list.length + ' 隻貓咪';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    const bar = $('#filter-bar');

    bar.addEventListener('click', function (e) {
      const chip = e.target.closest('[data-filter]');
      if (!chip) return;
      current = chip.getAttribute('data-filter');
      $$('[data-filter]', bar).forEach((btn) => {
        btn.setAttribute('aria-pressed', String(btn === chip));
      });
      render();
    });

    bindCatGrid($('#cat-grid'));
    /* 收藏狀態改變時，若正在看收藏清單就重繪 */
    document.addEventListener('cat:favorite-changed', function () {
      if (current === 'favorite') render();
    });

    render();
  });
})();
