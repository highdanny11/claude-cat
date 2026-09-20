/* ============================================
   喵喵之家 — 領養闖關狀態機
   單一 state 物件 + 純函式 reducer，每次動作回傳新 state 後重繪
   ============================================ */
(function () {
  'use strict';

  const { CATS, QUIZ_LIFESTYLE, QUIZ_KNOWLEDGE, CARE_EVENTS, DAILY_DECAY } = window.CatData;
  const { escapeHtml, toast } = window.CatUI;
  const Room = window.CatRoom;

  const QUIZ_PASS = 8;               // 知識問答通關門檻（共 10 題）
  const CARE_PASS = 50;              // 照顧模擬各項數值通關門檻
  const CARE_START = { hunger: 70, clean: 70, mood: 70 };

  /* ---------- 初始 state ---------- */
  const initialState = Object.freeze({
    stage: 'intro',        // intro | lifestyle | lifestyleResult | quiz | quizResult | care | careResult | certificate | apply | applied
    step: 0,               // 關卡一題號
    profile: {},           // 關卡一作答結果
    redlines: [],          // 關卡一紅線提醒

    quizOrder: [],         // 打亂後的題目索引
    quizIndex: 0,
    quizPicked: null,      // 已選答案（null = 尚未作答）
    quizCorrect: 0,

    layout: {},            // 關卡三房間佈置 { itemId: { x, y } }
    selectedItem: null,    // 點選放置模式下被選取的物品
    reviewIndex: 0,        // 巡房講評進度

    care: CARE_START,
    day: 0,                // CARE_EVENTS 索引
    carePicked: null,
    careLog: [],

    nickname: ''
  });

  let state = initialState;

  /* ---------- 純工具 ---------- */
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const next = (patch) => Object.assign({}, state, patch);

  function shuffle(length) {
    const arr = Array.from({ length: length }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  /* 依作答結果替每隻貓計算適配度 */
  function matchScore(cat, profile) {
    const hoursValue = profile.hours || 0;
    const hoursLevel = hoursValue >= 4 ? 3 : hoursValue >= 3 ? 2 : hoursValue >= 2 ? 1 : 0;
    const spaceLevel = profile.space || 0;
    const otherPets = profile.otherPets || 'none';
    const experience = profile.experience || 1;

    let score = 100;
    score -= Math.max(0, cat.match.hoursMin - hoursLevel) * 18;
    score -= Math.max(0, cat.match.spaceMin - spaceLevel) * 14;
    if (cat.match.otherPetsOk.indexOf(otherPets) === -1) score -= 22;
    if (!cat.match.noviceFriendly && experience <= 1) score -= 20;

    /* 生活節奏與活動力的加分 */
    if (hoursLevel >= 3 && cat.energy >= 4) score += 5;
    if (hoursLevel <= 1 && cat.energy <= 2) score += 5;

    return clamp(Math.round(score), 35, 100);
  }

  function topMatches(profile, n) {
    return CATS
      .map((cat) => ({ cat: cat, score: matchScore(cat, profile) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, n);
  }

  function moodFace(care) {
    const avg = (care.hunger + care.clean + care.mood) / 3;
    if (care.mood >= 70 && avg >= 65) return '😻';
    if (avg >= 50) return '😺';
    if (avg >= 30) return '🙀';
    return '😿';
  }

  function moodLabel(care) {
    const avg = (care.hunger + care.clean + care.mood) / 3;
    if (avg >= 75) return '很幸福，信任你了';
    if (avg >= 55) return '還算安心';
    if (avg >= 35) return '有點不安';
    return '狀況不太好⋯';
  }

  function level(value) {
    return value >= 60 ? 'good' : value >= 35 ? 'warn' : 'bad';
  }

  /* ---------- 畫面元件 ---------- */
  function stageTrackHtml() {
    const stages = [
      { name: '生活條件', keys: ['lifestyle', 'lifestyleResult'] },
      { name: '養育知識', keys: ['quiz', 'quizResult'] },
      { name: '照顧模擬', keys: ['room', 'roomReview', 'care', 'careResult'] },
      { name: '取得資格', keys: ['certificate', 'apply', 'applied'] }
    ];
    const order = ['intro', 'lifestyle', 'lifestyleResult', 'quiz', 'quizResult', 'room', 'roomReview', 'care', 'careResult', 'certificate', 'apply', 'applied'];
    const nowIndex = order.indexOf(state.stage);

    return stages.map(function (s, i) {
      const startIndex = order.indexOf(s.keys[0]);
      const endIndex = order.indexOf(s.keys[s.keys.length - 1]);
      const st = nowIndex > endIndex ? 'done' : nowIndex >= startIndex ? 'active' : 'todo';
      const mark = st === 'done' ? '✓' : String(i + 1);
      return '<span class="stage-node" data-state="' + st + '">' +
               '<span class="dot">' + mark + '</span>' + s.name +
             '</span>' + (i < stages.length - 1 ? '<span class="stage-link" aria-hidden="true">·</span>' : '');
    }).join('');
  }

  function meterHtml(label, icon, value) {
    return '<div class="meter">' +
             '<div class="meter-head"><span>' + icon + ' ' + label + '</span><span>' + value + '</span></div>' +
             '<div class="meter-bar" role="img" aria-label="' + label + ' ' + value + ' 分（滿分 100）">' +
               '<div class="meter-fill" data-level="' + level(value) + '" style="width:' + value + '%"></div>' +
             '</div>' +
           '</div>';
  }

  function deltaHtml(effects) {
    const names = { hunger: '飽足', clean: '清潔', mood: '心情' };
    return Object.keys(effects)
      .filter((k) => effects[k] !== 0)
      .map(function (k) {
        const v = effects[k];
        return '<span class="delta ' + (v > 0 ? 'up' : 'down') + '">' +
               names[k] + ' ' + (v > 0 ? '+' : '') + v + '</span>';
      }).join('');
  }

  /* ---------- 各關卡畫面 ---------- */
  function viewIntro() {
    const saved = window.CatStore.load().progress;
    const hasProgress = saved.lifestyleDone || saved.quizDone || saved.careDone;

    return '<div class="quiz-card text-center">' +
      '<div style="font-size:4rem">🐾</div>' +
      '<h1>領養闖關</h1>' +
      '<p class="muted">三關、大約 8 分鐘。這不是考試，每一題都會附上解說。<br>' +
        '我們想做的，是讓你和貓咪都準備好。</p>' +
      '<ul style="text-align:left;max-width:26rem;margin:1.2rem auto;padding-left:1.2rem">' +
        '<li><strong>第一關　生活條件</strong>：居住、時間、預算、家人共識</li>' +
        '<li><strong>第二關　養育知識</strong>：10 題單選，需答對 ' + QUIZ_PASS + ' 題</li>' +
        '<li><strong>第三關　照顧模擬</strong>：佈置貓咪的房間，再回答牠的 7 個問題</li>' +
      '</ul>' +
      (hasProgress
        ? '<p class="muted" style="font-size:.9rem">📌 偵測到你先前的紀錄，重新開始會覆蓋它。</p>'
        : '') +
      '<div class="action-row center">' +
        '<button class="btn" type="button" data-action="start">開始第一關</button>' +
        '<a class="btn btn-ghost" href="guide.html">先看養育指南</a>' +
      '</div>' +
    '</div>';
  }

  function viewLifestyle() {
    const q = QUIZ_LIFESTYLE[state.step];
    return '<div class="quiz-card">' +
      '<span class="quiz-counter">第一關 · 生活條件　' + (state.step + 1) + ' / ' + QUIZ_LIFESTYLE.length + '</span>' +
      '<p class="quiz-question">' + escapeHtml(q.question) + '</p>' +
      '<ul class="option-list">' +
        q.options.map(function (opt, i) {
          return '<li><button class="option" type="button" data-action="lifestyle-pick" data-index="' + i + '">' +
                   '<span class="option-key">' + String.fromCharCode(65 + i) + '</span>' +
                   escapeHtml(opt.label) +
                 '</button></li>';
        }).join('') +
      '</ul>' +
      '<div class="feedback"><h4>💡 為什麼問這題</h4><p>' + escapeHtml(q.why) + '</p></div>' +
    '</div>';
  }

  function viewLifestyleResult() {
    const matches = topMatches(state.profile, 3);

    if (state.redlines.length) {
      return '<div class="notice">' +
        '<h3>🤍 先等一下，有幾件事想和你聊聊</h3>' +
        '<p>你的熱情我們都看見了。但根據你的回答，有幾點如果先處理好，對你和貓咪都會好很多：</p>' +
        '<ul>' + state.redlines.map((r) => '<li>' + escapeHtml(r) + '</li>').join('') + '</ul>' +
        '<p class="muted" style="margin-top:1rem">這不是拒絕你，只是提醒。你仍然可以繼續體驗後面兩關，' +
          '把知識準備好，等條件到位的那一天。</p>' +
        '<div class="action-row">' +
          '<button class="btn" type="button" data-action="to-quiz">我了解了，繼續第二關</button>' +
          '<button class="btn btn-ghost" type="button" data-action="redo-lifestyle">重新作答</button>' +
          '<a class="btn btn-ghost" href="guide.html">閱讀養育指南</a>' +
        '</div>' +
      '</div>';
    }

    return '<div class="quiz-card">' +
      '<div class="text-center"><div style="font-size:3.4rem">🎉</div>' +
      '<h2>第一關通過！</h2>' +
      '<p class="muted">你的生活條件已經具備養貓的基礎。先看看初步適合你的孩子：</p></div>' +
      '<div class="match-list" style="margin:1.2rem 0">' +
        matches.map(matchItemHtml).join('') +
      '</div>' +
      '<p class="muted" style="font-size:.9rem">※ 這只是初步媒合，完成三關後會再依最終結果調整。</p>' +
      '<div class="action-row center">' +
        '<button class="btn" type="button" data-action="to-quiz">前往第二關 · 養育知識</button>' +
      '</div>' +
    '</div>';
  }

  function matchItemHtml(m) {
    return '<div class="match-item">' +
      '<span class="match-emoji" style="background:' + m.cat.color + '">' + m.cat.emoji + '</span>' +
      '<div>' +
        '<h3 style="margin:0">' + escapeHtml(m.cat.name) + '</h3>' +
        '<p class="cat-meta" style="margin:0">' + m.cat.age + ' 歲 · ' + escapeHtml(m.cat.gender) + ' · ' +
          escapeHtml(m.cat.personality.join('、')) + '</p>' +
      '</div>' +
      '<div class="match-score"><strong>' + m.score + '%</strong><span>適配度</span></div>' +
    '</div>';
  }

  function viewQuiz() {
    const qIndex = state.quizOrder[state.quizIndex];
    const q = QUIZ_KNOWLEDGE[qIndex];
    const picked = state.quizPicked;
    const answered = picked !== null;
    const isRight = picked === q.answer;

    return '<div class="quiz-card">' +
      '<span class="quiz-counter">第二關 · 養育知識　' + (state.quizIndex + 1) + ' / ' + QUIZ_KNOWLEDGE.length +
        '　｜　目前答對 ' + state.quizCorrect + ' 題</span>' +
      '<p class="quiz-question">' + escapeHtml(q.question) + '</p>' +
      '<ul class="option-list">' +
        q.options.map(function (opt, i) {
          let result = '';
          if (answered && i === q.answer) result = ' data-result="correct"';
          else if (answered && i === picked) result = ' data-result="wrong"';
          return '<li><button class="option" type="button" data-action="quiz-pick" data-index="' + i + '"' +
                   (answered ? ' disabled' : '') + result + '>' +
                   '<span class="option-key">' + String.fromCharCode(65 + i) + '</span>' +
                   escapeHtml(opt) +
                 '</button></li>';
        }).join('') +
      '</ul>' +
      (answered
        ? '<div class="feedback' + (isRight ? '' : ' is-wrong') + '">' +
            '<h4><span class="cheer">' + (isRight ? '🎉' : '📚') + '</span>' +
              (isRight ? '答對了！' : '這題再記一下') + '</h4>' +
            '<p>' + escapeHtml(q.explain) + '</p>' +
          '</div>' +
          '<div class="action-row center">' +
            '<button class="btn" type="button" data-action="quiz-next">' +
              (state.quizIndex + 1 < QUIZ_KNOWLEDGE.length ? '下一題' : '看結果') +
            '</button>' +
          '</div>'
        : '') +
    '</div>';
  }

  function viewQuizResult() {
    const passed = state.quizCorrect >= QUIZ_PASS;

    if (!passed) {
      return '<div class="notice">' +
        '<h3>📚 還差一點點</h3>' +
        '<p>你答對了 <strong>' + state.quizCorrect + ' / ' + QUIZ_KNOWLEDGE.length + '</strong> 題，' +
          '通關需要 ' + QUIZ_PASS + ' 題。</p>' +
        '<p>這些知識在貓咪真的出狀況時，是牠唯一能依靠的東西。' +
          '去養育指南看一輪，再回來挑戰一次吧——題目順序會重新打亂。</p>' +
        '<div class="action-row">' +
          '<a class="btn" href="guide.html">📖 複習養育指南</a>' +
          '<button class="btn btn-secondary" type="button" data-action="retry-quiz">再挑戰一次</button>' +
        '</div>' +
      '</div>';
    }

    return '<div class="quiz-card text-center">' +
      '<div style="font-size:3.4rem">🏆</div>' +
      '<h2>第二關通過！</h2>' +
      '<p class="muted">答對 <strong>' + state.quizCorrect + ' / ' + QUIZ_KNOWLEDGE.length + '</strong> 題。' +
        '你已經具備照顧貓咪的基本知識了。</p>' +
      '<p>接下來是最真實的一關：先替貓咪佈置房間，再和牠相處七天，回答牠開口問你的問題。</p>' +
      '<div class="action-row center">' +
        '<button class="btn" type="button" data-action="to-care">前往第三關 · 照顧模擬</button>' +
      '</div>' +
    '</div>';
  }

  /* 貓咪的對話泡泡；tone: '' | 'good' | 'bad' */
  function bubbleHtml(text, tone) {
    return '<div class="speech-bubble' + (tone ? ' is-' + tone : '') + '">' +
             '<span class="speech-who" aria-hidden="true">🐱</span>' +
             '<p>' + escapeHtml(text) + '</p>' +
           '</div>';
  }

  function viewRoom() {
    const missing = Room.missingRequired(state.layout);
    const selected = state.selectedItem ? Room.getItem(state.selectedItem) : null;

    return '<div class="quiz-card">' +
      '<span class="quiz-counter">第三關 · 佈置貓咪的房間</span>' +
      '<p class="quiz-question">貓咪明天就要來了，先替牠把房間準備好吧。</p>' +
      '<p class="muted">把下方的物品<strong>拖進房間</strong>（或先點物品、再點格子）。' +
        '想想貓咪在意什麼：吃飯、喝水、上廁所、看風景、躲起來——' +
        '還有，不是每樣東西都該出現在貓的房間裡。</p>' +
      Room.roomHtml(state.layout, { interactive: true, selected: state.selectedItem }) +
      '<p class="room-status" aria-live="polite">' +
        (selected
          ? '已選取「' + selected.emoji + ' ' + selected.name + '」，點一個空格放下，或點物品匣收回。'
          : missing.length
            ? '還需要擺放：' + missing.map((it) => it.emoji + ' ' + it.name).join('、')
            : '必要物品都就位了！確認位置後，請貓咪來看看吧。') +
      '</p>' +
      Room.trayHtml(state.layout, state.selectedItem) +
      '<div class="action-row center">' +
        '<button class="btn" type="button" data-action="room-done"' + (missing.length ? ' disabled' : '') + '>' +
          '請貓咪來看看 🐾</button>' +
        '<button class="btn btn-ghost" type="button" data-action="room-clear">全部收回</button>' +
      '</div>' +
    '</div>';
  }

  function viewRoomReview() {
    const results = Room.evaluateLayout(state.layout);
    const done = state.reviewIndex >= results.length;

    if (done) {
      const start = Room.startMeters(results);
      const passed = results.filter((r) => r.pass).length;
      const failed = results.filter((r) => !r.pass);

      return '<div class="quiz-card">' +
        '<span class="quiz-counter">第三關 · 巡房結果</span>' +
        '<p class="quiz-question">貓咪巡完房間了：' + passed + ' / ' + results.length + ' 項讓牠滿意</p>' +
        Room.roomHtml(state.layout, { cat: { x: 3, y: 2 }, catFace: moodFace(start) }) +
        (failed.length
          ? '<div class="notice" style="margin-top:1rem"><h3>🔧 可以再調整的地方</h3><ul>' +
              failed.map((r) => '<li>' + escapeHtml(r.tip) + '</li>').join('') +
            '</ul></div>'
          : bubbleHtml('這個房間我很喜歡。看得出來你有認真想過我需要什麼。', 'good')) +
        '<p class="muted" style="margin:1rem 0 .4rem">房間的佈置，決定了貓咪搬進來第一天的狀態：</p>' +
        meterHtml('飽足', '🍚', start.hunger) +
        meterHtml('清潔', '🚽', start.clean) +
        meterHtml('心情', '💛', start.mood) +
        '<div class="action-row center">' +
          '<button class="btn" type="button" data-action="start-care">開始和貓咪相處七天</button>' +
          '<button class="btn btn-ghost" type="button" data-action="back-room">回去調整佈置</button>' +
        '</div>' +
      '</div>';
    }

    const r = results[state.reviewIndex];
    return '<div class="quiz-card">' +
      '<span class="quiz-counter">第三關 · 貓咪巡房　' + (state.reviewIndex + 1) + ' / ' + results.length + '</span>' +
      Room.roomHtml(state.layout, {
        cat: Room.catSpot(r.focus, state.layout),
        catFace: r.pass ? '😺' : '🙀'
      }) +
      bubbleHtml(r.line, r.pass ? 'good' : 'bad') +
      '<div class="feedback' + (r.pass ? '' : ' is-wrong') + '">' +
        '<h4>' + (r.pass ? '👍 這樣擺很好' : '📚 小知識') + '</h4>' +
        '<p>' + escapeHtml(r.tip) + '</p>' +
        '<div class="delta-row">' + deltaHtml(r.effects) + '</div>' +
      '</div>' +
      '<div class="action-row center">' +
        '<button class="btn" type="button" data-action="review-next">' +
          (state.reviewIndex + 1 < results.length ? '貓咪繼續看' : '看巡房結果') +
        '</button>' +
      '</div>' +
    '</div>';
  }

  function viewCare() {
    const event = CARE_EVENTS[state.day];
    const picked = state.carePicked;
    const answered = picked !== null;
    const care = state.care;

    /* 貓咪走到這一題相關的家具旁邊開口 */
    const panel =
      '<div class="care-pet">' +
        '<span class="care-day">Day ' + event.day + ' / ' + CARE_EVENTS.length + '</span>' +
        Room.roomHtml(state.layout, {
          mini: true,
          cat: Room.catSpot(event.near, state.layout),
          catFace: moodFace(care)
        }) +
        '<p class="care-mood-label">' + moodFace(care) + ' ' + moodLabel(care) + '</p>' +
      '</div>';

    const good = answered && isGoodChoice(event.options[picked]);
    const bubble = bubbleHtml(
      answered ? event.react[good ? 0 : 1] : event.say,
      answered ? (good ? 'good' : 'bad') : ''
    );

    const meters =
      meterHtml('飽足', '🍚', care.hunger) +
      meterHtml('清潔', '🚽', care.clean) +
      meterHtml('心情', '💛', care.mood);

    const body = answered
      ? '<div class="feedback' + (isGoodChoice(event.options[picked]) ? '' : ' is-wrong') + '">' +
          '<h4>' + (isGoodChoice(event.options[picked]) ? '👍 好選擇' : '⚠️ 這樣做的後果') + '</h4>' +
          '<p>' + escapeHtml(event.options[picked].note) + '</p>' +
          '<div class="delta-row">' + deltaHtml(event.options[picked].effects) + '</div>' +
        '</div>' +
        '<div class="action-row center">' +
          '<button class="btn" type="button" data-action="care-next">' +
            (state.day + 1 < CARE_EVENTS.length ? '進入第 ' + (event.day + 1) + ' 天' : '看這週的總結') +
          '</button>' +
        '</div>'
      : '<ul class="option-list">' +
          event.options.map(function (opt, i) {
            return '<li><button class="option" type="button" data-action="care-pick" data-index="' + i + '">' +
                     '<span class="option-key">' + String.fromCharCode(65 + i) + '</span>' +
                     escapeHtml(opt.label) +
                   '</button></li>';
          }).join('') +
        '</ul>';

    return '<div class="quiz-card">' +
      '<span class="quiz-counter">第三關 · 一週照顧模擬</span>' +
      '<div class="care-layout">' +
        panel +
        '<div>' +
          meters +
          '<h3 style="margin:1.2rem 0 .6rem">' + escapeHtml(event.title) + '</h3>' +
          bubble +
          body +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function isGoodChoice(option) {
    const e = option.effects;
    return (e.hunger + e.clean + e.mood) > 0;
  }

  function careLogHtml() {
    return '<ul class="log-list">' +
      state.careLog.map(function (entry) {
        return '<li><strong>Day ' + entry.day + '　' + escapeHtml(entry.title) + '</strong><br>' +
               escapeHtml(entry.choice) + '　' +
               '<span class="muted">' + escapeHtml(entry.note) + '</span></li>';
      }).join('') +
    '</ul>';
  }

  function viewCareResult() {
    const care = state.care;
    const passed = care.hunger >= CARE_PASS && care.clean >= CARE_PASS && care.mood >= CARE_PASS;
    const avg = Math.round((care.hunger + care.clean + care.mood) / 3);

    const meters =
      meterHtml('飽足', '🍚', care.hunger) +
      meterHtml('清潔', '🚽', care.clean) +
      meterHtml('心情', '💛', care.mood);

    if (!passed) {
      return '<div class="notice">' +
        '<h3>😿 這一週，貓咪過得有點辛苦</h3>' +
        '<p>三項數值都要達到 ' + CARE_PASS + ' 分以上才算通關。還好這只是模擬——' +
          '我們一起看看哪幾天可以做得更好：</p>' +
        '<div style="margin:1rem 0">' + meters + '</div>' +
        careLogHtml() +
        '<div class="action-row">' +
          '<button class="btn" type="button" data-action="retry-care">再照顧一次</button>' +
          '<a class="btn btn-ghost" href="guide.html">先看養育指南</a>' +
        '</div>' +
      '</div>';
    }

    return '<div class="quiz-card">' +
      '<div class="text-center">' +
        '<div style="font-size:3.4rem">' + moodFace(care) + '</div>' +
        '<h2>第三關通過！</h2>' +
        '<p class="muted">一週平均 <strong>' + avg + '</strong> 分。貓咪願意在你腳邊趴下了。</p>' +
      '</div>' +
      '<div style="margin:1.2rem 0">' + meters + '</div>' +
      careLogHtml() +
      '<div class="action-row center">' +
        '<button class="btn" type="button" data-action="to-certificate">領取我的資格證書 🏅</button>' +
      '</div>' +
    '</div>';
  }

  function viewCertificate() {
    const care = state.care;
    const avg = Math.round((care.hunger + care.clean + care.mood) / 3);
    const matches = topMatches(state.profile, 3);
    const today = new Date();
    const dateStr = today.getFullYear() + ' 年 ' + (today.getMonth() + 1) + ' 月 ' + today.getDate() + ' 日';
    const name = state.nickname || '';

    return '<div class="certificate">' +
      '<p class="cert-title">領 養 資 格 證 書</p>' +
      '<p class="muted" style="margin:0">Certificate of Readiness</p>' +
      (name
        ? '<div class="cert-name">' + escapeHtml(name) + '</div>'
        : '<div style="max-width:20rem;margin:1rem auto 0">' +
            '<div class="field" style="margin-bottom:.4rem">' +
              '<label for="nickname">在證書上署名</label>' +
              '<input id="nickname" type="text" maxlength="12" placeholder="輸入你的名字或暱稱">' +
            '</div>' +
            '<button class="btn btn-sm" type="button" data-action="set-nickname">蓋上我的名字 🐾</button>' +
          '</div>') +
      '<p style="margin-top:1rem">已完成喵喵之家三階段領養評估，<br>具備照顧貓咪的基本條件與知識。</p>' +
      '<div class="cert-stats">' +
        '<div class="cert-stat"><strong>' + state.quizCorrect + '/' + QUIZ_KNOWLEDGE.length + '</strong><span>知識問答</span></div>' +
        '<div class="cert-stat"><strong>' + avg + '</strong><span>照顧平均分</span></div>' +
        '<div class="cert-stat"><strong>' + CARE_EVENTS.length + '</strong><span>模擬天數</span></div>' +
      '</div>' +
      '<div class="cert-stamp">喵喵之家<br>認證 🐾</div>' +
      '<p class="muted" style="font-size:.85rem;margin-top:1rem">' + dateStr + '</p>' +
    '</div>' +

    '<div class="card" style="margin-top:1.5rem">' +
      '<h2 style="font-size:1.3rem">💛 最適合你的孩子</h2>' +
      '<p class="muted">依你的居住空間、陪伴時間、經驗與家中動物狀況計算：</p>' +
      '<div class="match-list">' + matches.map(matchItemHtml).join('') + '</div>' +
      '<div class="action-row">' +
        '<button class="btn" type="button" data-action="to-apply">填寫領養申請表</button>' +
        '<a class="btn btn-ghost" href="cats.html">再看看其他貓咪</a>' +
      '</div>' +
    '</div>';
  }

  function viewApply() {
    const matches = topMatches(state.profile, 3).map((m) => m.cat.id);
    const sorted = CATS.slice().sort(function (a, b) {
      return matches.indexOf(b.id) - matches.indexOf(a.id);
    });

    return '<div class="quiz-card">' +
      '<h2>領養申請表 📝</h2>' +
      '<p class="muted">恭喜通過三關！填好資料後，我們的志工會與你聯繫安排家訪與見面。</p>' +
      '<form id="apply-form" novalidate>' +
        '<div class="field">' +
          '<label for="applicant">姓名 <span style="color:var(--danger)">*</span></label>' +
          '<input id="applicant" name="applicant" type="text" autocomplete="name" value="' + escapeHtml(state.nickname) + '">' +
          '<p class="field-error" data-error-for="applicant"></p>' +
        '</div>' +
        '<div class="field">' +
          '<label for="email">Email <span style="color:var(--danger)">*</span></label>' +
          '<input id="email" name="email" type="email" autocomplete="email" placeholder="you@example.com">' +
          '<p class="field-error" data-error-for="email"></p>' +
        '</div>' +
        '<div class="field">' +
          '<label for="phone">聯絡電話 <span style="color:var(--danger)">*</span></label>' +
          '<input id="phone" name="phone" type="tel" autocomplete="tel" placeholder="09xxxxxxxx">' +
          '<p class="field-error" data-error-for="phone"></p>' +
        '</div>' +
        '<div class="field">' +
          '<label for="catId">想領養的貓咪 <span style="color:var(--danger)">*</span></label>' +
          '<select id="catId" name="catId">' +
            '<option value="">請選擇⋯</option>' +
            sorted.map(function (cat) {
              const tag = matches.indexOf(cat.id) !== -1 ? '（推薦給你）' : '';
              return '<option value="' + cat.id + '">' + escapeHtml(cat.name) + ' · ' +
                     cat.age + ' 歲 · ' + escapeHtml(cat.gender) + tag + '</option>';
            }).join('') +
          '</select>' +
          '<p class="field-error" data-error-for="catId"></p>' +
        '</div>' +
        '<div class="field">' +
          '<label for="intro">想對牠說的話</label>' +
          '<textarea id="intro" name="intro" rows="4" placeholder="聊聊你的生活、家裡的環境，還有你想給牠什麼樣的日子⋯"></textarea>' +
          '<p class="hint">選填，但志工真的會看。</p>' +
        '</div>' +
        '<div class="field">' +
          '<label style="font-weight:600;display:flex;gap:.5rem;align-items:flex-start">' +
            '<input type="checkbox" id="agree" name="agree" style="width:auto;margin-top:.45rem">' +
            '<span>我承諾一生不離不棄，會讓貓咪完全室內飼養、做好防墜措施，' +
              '並在生病時提供必要的醫療照顧。</span>' +
          '</label>' +
          '<p class="field-error" data-error-for="agree"></p>' +
        '</div>' +
        '<div class="action-row">' +
          '<button class="btn" type="submit">送出申請 💌</button>' +
          '<button class="btn btn-ghost" type="button" data-action="back-certificate">回到證書</button>' +
        '</div>' +
      '</form>' +
    '</div>';
  }

  function viewApplied() {
    return '<div class="quiz-card text-center">' +
      '<div style="font-size:4rem">💌</div>' +
      '<h2>申請已送出！</h2>' +
      '<p class="muted">（這是示範網站，資料不會真的寄出。）</p>' +
      '<p>在真實的領養流程中，接下來會是：志工電話聯繫 → 家訪確認環境 →' +
        '與貓咪見面 → 簽署領養同意書 → 接牠回家。</p>' +
      '<p style="font-weight:700;color:var(--caramel)">謝謝你願意用領養，給一隻貓咪一輩子的家 🐾</p>' +
      '<div class="action-row center">' +
        '<a class="btn" href="cats.html">看看其他等家的孩子</a>' +
        '<a class="btn btn-ghost" href="index.html">回到首頁</a>' +
      '</div>' +
    '</div>';
  }

  /* ---------- 渲染 ---------- */
  const VIEWS = {
    intro: viewIntro,
    lifestyle: viewLifestyle,
    lifestyleResult: viewLifestyleResult,
    quiz: viewQuiz,
    quizResult: viewQuizResult,
    room: viewRoom,
    roomReview: viewRoomReview,
    care: viewCare,
    careResult: viewCareResult,
    certificate: viewCertificate,
    apply: viewApply,
    applied: viewApplied
  };

  function render() {
    document.getElementById('stage-track').innerHTML = stageTrackHtml();
    document.getElementById('game-root').innerHTML = (VIEWS[state.stage] || viewIntro)();
    if (state.stage === 'apply') bindApplyForm();
    walkCat();
  }

  /* 每次重繪貓咪都是新節點：先擺回上一個位置，下一幀再移到新位置，走動動畫才會播 */
  let lastCatSpot = null;

  function walkCat() {
    const token = document.querySelector('#game-root .cat-token');
    if (!token) { lastCatSpot = null; return; }

    const target = { left: token.style.left, top: token.style.top };
    if (lastCatSpot && (lastCatSpot.left !== target.left || lastCatSpot.top !== target.top)) {
      token.style.transition = 'none';
      token.style.left = lastCatSpot.left;
      token.style.top = lastCatSpot.top;
      void token.offsetWidth;   // 強制 reflow，讓起點生效
      token.style.transition = '';
      token.style.left = target.left;
      token.style.top = target.top;
    }
    lastCatSpot = target;
  }

  function setState(patch) {
    state = next(patch);
    render();
  }

  function setLayout(layout) {
    window.CatStore.updateProgress({ layout: layout });
    setState({ layout: layout, selectedItem: null });
  }

  /* 房間拖拉／點選放置的回呼（拖拉與點選走同一條放置路徑） */
  const ROOM_HANDLERS = {
    canPlace: function (itemId, x, y) {
      return Room.canPlace(state.layout, itemId, x, y);
    },

    onPlace: function (itemId, x, y) {
      if (!Room.canPlace(state.layout, itemId, x, y)) {
        toast('這一格已經有東西了 🐾');
        return;
      }
      setLayout(Room.placeItem(state.layout, itemId, x, y));
    },

    onRemove: function (itemId) {
      if (state.layout[itemId]) setLayout(Room.removeItem(state.layout, itemId));
    },

    onSelect: function (itemId) {
      setState({ selectedItem: state.selectedItem === itemId ? null : itemId });
    },

    onCellClick: function (x, y) {
      if (state.selectedItem) ROOM_HANDLERS.onPlace(state.selectedItem, x, y);
    },

    onTrayClick: function () {
      if (state.selectedItem) ROOM_HANDLERS.onRemove(state.selectedItem);
    }
  };

  /* ---------- 動作處理 ---------- */
  const ACTIONS = {
    start: function () {
      setState({ stage: 'lifestyle', step: 0, profile: {}, redlines: [] });
    },

    'lifestyle-pick': function (index) {
      const q = QUIZ_LIFESTYLE[state.step];
      const opt = q.options[index];
      const profile = Object.assign({}, state.profile);
      profile[q.key] = opt.value;
      const redlines = opt.redline ? state.redlines.concat(opt.redline) : state.redlines;
      const isLast = state.step + 1 >= QUIZ_LIFESTYLE.length;

      if (isLast) {
        window.CatStore.updateProgress({ lifestyleDone: true, profile: profile });
        setState({ stage: 'lifestyleResult', profile: profile, redlines: redlines });
      } else {
        setState({ step: state.step + 1, profile: profile, redlines: redlines });
      }
    },

    'redo-lifestyle': function () {
      setState({ stage: 'lifestyle', step: 0, profile: {}, redlines: [] });
    },

    'to-quiz': function () {
      setState({
        stage: 'quiz',
        quizOrder: shuffle(QUIZ_KNOWLEDGE.length),
        quizIndex: 0,
        quizPicked: null,
        quizCorrect: 0
      });
    },

    'quiz-pick': function (index) {
      if (state.quizPicked !== null) return;
      const q = QUIZ_KNOWLEDGE[state.quizOrder[state.quizIndex]];
      const correct = index === q.answer;
      setState({
        quizPicked: index,
        quizCorrect: state.quizCorrect + (correct ? 1 : 0)
      });
    },

    'quiz-next': function () {
      const isLast = state.quizIndex + 1 >= QUIZ_KNOWLEDGE.length;
      if (isLast) {
        window.CatStore.updateProgress({
          quizDone: state.quizCorrect >= QUIZ_PASS,
          quizScore: state.quizCorrect
        });
        setState({ stage: 'quizResult' });
      } else {
        setState({ quizIndex: state.quizIndex + 1, quizPicked: null });
      }
    },

    'retry-quiz': function () {
      ACTIONS['to-quiz']();
      toast('題目已重新打亂，加油！');
    },

    /* 第三關入口：先佈置房間（保留上次的佈置供調整） */
    'to-care': function () {
      setState({ stage: 'room', selectedItem: null, reviewIndex: 0 });
    },

    'room-clear': function () {
      setLayout({});
    },

    'room-done': function () {
      if (Room.missingRequired(state.layout).length) return;
      setState({ stage: 'roomReview', selectedItem: null, reviewIndex: 0 });
    },

    'review-next': function () {
      setState({ reviewIndex: state.reviewIndex + 1 });
    },

    'back-room': function () {
      setState({ stage: 'room', selectedItem: null, reviewIndex: 0 });
    },

    /* 房間佈置的好壞，決定三條數值的起始值 */
    'start-care': function () {
      const start = Room.startMeters(Room.evaluateLayout(state.layout));
      setState({ stage: 'care', day: 0, care: start, carePicked: null, careLog: [] });
    },

    'care-pick': function (index) {
      if (state.carePicked !== null) return;
      const event = CARE_EVENTS[state.day];
      const opt = event.options[index];
      const care = {
        hunger: clamp(state.care.hunger + opt.effects.hunger, 0, 100),
        clean: clamp(state.care.clean + opt.effects.clean, 0, 100),
        mood: clamp(state.care.mood + opt.effects.mood, 0, 100)
      };
      const careLog = state.careLog.concat({
        day: event.day,
        title: event.title,
        choice: opt.label,
        note: opt.note
      });
      setState({ carePicked: index, care: care, careLog: careLog });
    },

    'care-next': function () {
      const isLast = state.day + 1 >= CARE_EVENTS.length;

      if (isLast) {
        const care = state.care;
        const passed = care.hunger >= CARE_PASS && care.clean >= CARE_PASS && care.mood >= CARE_PASS;
        const avg = Math.round((care.hunger + care.clean + care.mood) / 3);
        window.CatStore.updateProgress({ careDone: passed, careScore: avg });
        setState({ stage: 'careResult' });
        return;
      }

      /* 每天自然衰減：貓咪會餓、砂盆會髒、無聊會累積 */
      const care = {
        hunger: clamp(state.care.hunger + DAILY_DECAY.hunger, 0, 100),
        clean: clamp(state.care.clean + DAILY_DECAY.clean, 0, 100),
        mood: clamp(state.care.mood + DAILY_DECAY.mood, 0, 100)
      };

      /* 任一數值歸零即提前結束 */
      if (care.hunger === 0 || care.clean === 0 || care.mood === 0) {
        window.CatStore.updateProgress({ careDone: false, careScore: 0 });
        setState({ stage: 'careResult', care: care });
        return;
      }

      setState({ day: state.day + 1, care: care, carePicked: null });
    },

    'retry-care': function () {
      ACTIONS['to-care']();
      toast('重新來過，這次會更順手的 🐾');
    },

    'to-certificate': function () {
      setState({ stage: 'certificate' });
    },

    'set-nickname': function () {
      const input = document.getElementById('nickname');
      const value = (input.value || '').trim();
      if (!value) {
        toast('先輸入一個名字吧 🐾');
        input.focus();
        return;
      }
      window.CatStore.updateProgress({ nickname: value });
      setState({ nickname: value });
    },

    'to-apply': function () {
      setState({ stage: 'apply' });
    },

    'back-certificate': function () {
      setState({ stage: 'certificate' });
    }
  };

  /* ---------- 申請表驗證 ---------- */
  function bindApplyForm() {
    const form = document.getElementById('apply-form');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const values = {
        applicant: form.applicant.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        catId: form.catId.value,
        agree: form.agree.checked
      };

      const errors = {};
      if (!values.applicant) errors.applicant = '請留下你的稱呼';
      if (!values.email) errors.email = '請填寫 Email';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Email 格式看起來不太對';
      if (!values.phone) errors.phone = '請填寫聯絡電話';
      else if (!/^[0-9+\-() ]{8,}$/.test(values.phone)) errors.phone = '電話格式看起來不太對';
      if (!values.catId) errors.catId = '請選擇一隻想領養的貓咪';
      if (!values.agree) errors.agree = '請閱讀並勾選領養承諾';

      Array.prototype.forEach.call(form.querySelectorAll('[data-error-for]'), function (el) {
        el.textContent = errors[el.getAttribute('data-error-for')] || '';
      });

      const firstError = Object.keys(errors)[0];
      if (firstError) {
        form[firstError].focus();
        toast('還有幾個欄位要補一下喔');
        return;
      }

      const cat = window.CatUI.getCat(values.catId);
      window.CatStore.updateProgress({ nickname: values.applicant });
      setState({ stage: 'applied', nickname: values.applicant });
      toast('申請已送出，' + cat.name + ' 收到囉 💌');
    });
  }

  /* ---------- 事件綁定 ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    const saved = window.CatStore.load().progress;
    state = next({ nickname: saved.nickname || '', layout: saved.layout || {} });

    Room.bindDrag(document.getElementById('game-root'), ROOM_HANDLERS);

    /* 三關都通過過的人，重新進站時直接回到證書畫面 */
    if (saved.lifestyleDone && saved.quizDone && saved.careDone) {
      const score = saved.careScore || CARE_PASS;
      state = next({
        stage: 'certificate',
        profile: saved.profile || {},
        quizCorrect: saved.quizScore || 0,
        care: { hunger: score, clean: score, mood: score }
      });
    }

    document.getElementById('game-root').addEventListener('click', function (e) {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const handler = ACTIONS[btn.getAttribute('data-action')];
      if (handler) handler(Number(btn.getAttribute('data-index')));
    });

    document.getElementById('reset-btn').addEventListener('click', function () {
      window.CatStore.reset();
      state = initialState;
      render();
      toast('進度已清除，重新開始吧 🐾');
    });

    render();
  });
})();
