/* ============================================
   喵喵之家 — localStorage 封裝
   所有存取都包 try-catch，隱私模式或封鎖儲存時自動降級為記憶體狀態
   ============================================ */
(function () {
  'use strict';

  const KEY = 'catAdoption:v1';

  const DEFAULT_STATE = {
    progress: {
      lifestyleDone: false,
      quizDone: false,
      careDone: false,
      quizScore: 0,
      careScore: 0,
      profile: null,
      nickname: '',
      layout: null
    },
    favorites: []
  };

  /* 儲存被封鎖時的記憶體備援 */
  let memoryFallback = null;

  const clone = (obj) => JSON.parse(JSON.stringify(obj));

  function load() {
    if (memoryFallback) return clone(memoryFallback);
    try {
      const raw = window.localStorage.getItem(KEY);
      if (!raw) return clone(DEFAULT_STATE);
      const parsed = JSON.parse(raw);
      return {
        progress: Object.assign({}, DEFAULT_STATE.progress, parsed.progress),
        favorites: Array.isArray(parsed.favorites) ? parsed.favorites : []
      };
    } catch (err) {
      return clone(DEFAULT_STATE);
    }
  }

  function save(state) {
    memoryFallback = clone(state);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
      memoryFallback = null;
    } catch (err) {
      /* 寫入失敗時保留在記憶體，本次瀏覽仍可運作 */
    }
    return state;
  }

  function reset() {
    memoryFallback = null;
    try {
      window.localStorage.removeItem(KEY);
    } catch (err) {
      memoryFallback = clone(DEFAULT_STATE);
    }
    return clone(DEFAULT_STATE);
  }

  /* 以函式更新 progress，回傳新的完整 state */
  function updateProgress(patch) {
    const state = load();
    const next = {
      progress: Object.assign({}, state.progress, patch),
      favorites: state.favorites
    };
    return save(next);
  }

  function toggleFavorite(catId) {
    const state = load();
    const exists = state.favorites.indexOf(catId) !== -1;
    const favorites = exists
      ? state.favorites.filter((id) => id !== catId)
      : state.favorites.concat(catId);
    save({ progress: state.progress, favorites });
    return !exists;
  }

  function isFavorite(catId) {
    return load().favorites.indexOf(catId) !== -1;
  }

  window.CatStore = Object.freeze({
    KEY,
    DEFAULT_STATE,
    load,
    save,
    reset,
    updateProgress,
    toggleFavorite,
    isFavorite
  });
})();
