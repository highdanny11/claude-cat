/* ============================================
   喵喵之家 — 靜態資料
   純資料，不含任何邏輯。掛載於 window.CatData
   ============================================ */
(function () {
  'use strict';

  /* ---------- 待領養貓咪 ---------- */
  const CATS = Object.freeze([
    {
      id: 'mochi',
      name: '麻糬',
      emoji: '😺',
      color: '#FFE3D0',
      age: 2,
      gender: '女生',
      breed: '米克斯 · 三花',
      personality: ['黏人', '愛撒嬌', '怕生一點點'],
      energy: 3,
      story: '麻糬是在麵包店後門被發現的小三花，當時瘦得像一顆沒發好的麵糰。結紮健檢後圓潤了不少，最愛在人腿邊打呼嚕，只是剛到新家會躲沙發底下三天，需要有耐心的家人。',
      needs: ['每天要有人陪玩 30 分鐘', '需要安靜的適應空間'],
      health: '已結紮 · 三劑疫苗完成 · 晶片已植入',
      match: { hoursMin: 2, spaceMin: 2, otherPetsOk: ['none', 'cat'], noviceFriendly: true }
    },
    {
      id: 'ovaltine',
      name: '阿華田',
      emoji: '🐈',
      color: '#E8D6C3',
      age: 5,
      gender: '男生',
      breed: '米克斯 · 虎斑',
      personality: ['穩重', '睡神', '不吵鬧'],
      energy: 2,
      story: '原飼主搬家出國後被送來，阿華田花了半年才重新願意靠近人。牠不需要熱鬧的家，只想要一張有陽光的窗台，和一個每天會固定回家的人。',
      needs: ['作息規律的家庭', '不適合太吵的環境'],
      health: '已結紮 · 疫苗完成 · 需定期口腔保養',
      match: { hoursMin: 1, spaceMin: 1, otherPetsOk: ['none', 'cat'], noviceFriendly: true }
    },
    {
      id: 'bubu',
      name: '布布',
      emoji: '😸',
      color: '#FFD9C0',
      age: 1,
      gender: '男生',
      breed: '米克斯 · 橘白',
      personality: ['超級活潑', '拆家小能手', '好奇寶寶'],
      energy: 5,
      story: '布布從工地鐵皮下被救出來，現在是中途之家最忙的一隻：跳櫃子、追逗貓棒、把衛生紙拆成雪花。牠需要體力好、家裡空間夠、願意陪牠放電的家人。',
      needs: ['每天至少 1 小時互動', '需要較大活動空間與層架'],
      health: '已結紮 · 疫苗完成 · 健康良好',
      match: { hoursMin: 3, spaceMin: 3, otherPetsOk: ['none', 'cat', 'dog'], noviceFriendly: false }
    },
    {
      id: 'sesame',
      name: '芝麻',
      emoji: '🐈‍⬛',
      color: '#DCD3CC',
      age: 3,
      gender: '女生',
      breed: '米克斯 · 黑貓',
      personality: ['冷靜', '觀察家', '慢熱'],
      energy: 2,
      story: '芝麻在動物醫院後巷生下四隻小貓，孩子們陸續送養後只剩牠。牠總是安靜坐在高處看著大家，被信任的人摸到下巴時，才會露出瞇眼的表情。',
      needs: ['給牠慢慢熟悉的時間', '喜歡高處，需要跳台'],
      health: '已結紮 · 疫苗完成 · 晶片已植入',
      match: { hoursMin: 1, spaceMin: 2, otherPetsOk: ['none', 'cat'], noviceFriendly: true }
    },
    {
      id: 'pudding',
      name: '布丁',
      emoji: '😻',
      color: '#FFE9B8',
      age: 4,
      gender: '男生',
      breed: '米克斯 · 大橘',
      personality: ['親人', '貪吃', '不挑人'],
      energy: 3,
      story: '布丁是志工在夜市撿到的，親人到可以給任何人抱。唯一的麻煩是太會吃，需要控制體重的飼主，不然會從布丁變成布丁塔。',
      needs: ['需要控制飲食與體重', '適合第一次養貓的家庭'],
      health: '已結紮 · 疫苗完成 · 體重需控管',
      match: { hoursMin: 2, spaceMin: 2, otherPetsOk: ['none', 'cat', 'dog'], noviceFriendly: true }
    },
    {
      id: 'cloud',
      name: '雲朵',
      emoji: '🐱',
      color: '#E6EEF5',
      age: 7,
      gender: '女生',
      breed: '米克斯 · 白貓',
      personality: ['溫柔', '安靜', '依賴人'],
      energy: 1,
      story: '雲朵是隻高齡的白貓，聽力比較弱，所以特別愛靠著人睡。年紀大的貓總是最後被看見，但牠們最懂得怎麼安靜地陪伴一個人。',
      needs: ['需要接受高齡貓照護與醫療', '聽力較弱，避免從背後嚇到牠'],
      health: '已結紮 · 疫苗完成 · 需每半年健檢',
      match: { hoursMin: 1, spaceMin: 1, otherPetsOk: ['none'], noviceFriendly: false }
    },
    {
      id: 'tiger',
      name: '小虎',
      emoji: '🐯',
      color: '#FFE0AE',
      age: 1,
      gender: '男生',
      breed: '米克斯 · 虎斑',
      personality: ['勇敢', '愛探險', '社交高手'],
      energy: 4,
      story: '小虎和兄弟姊妹一起被救援，是第一個衝出籠門的那隻。牠跟貓跟狗都能打成一片，很適合家裡已經有毛小孩的家庭。',
      needs: ['需要玩伴或另一隻貓', '需要足夠的垂直空間'],
      health: '已結紮 · 疫苗完成 · 健康良好',
      match: { hoursMin: 2, spaceMin: 2, otherPetsOk: ['cat', 'dog', 'none'], noviceFriendly: true }
    },
    {
      id: 'milk',
      name: '牛奶',
      emoji: '🐾',
      color: '#F6F1EA',
      age: 6,
      gender: '女生',
      breed: '米克斯 · 乳牛貓',
      personality: ['獨立', '有主見', '不愛被抱'],
      energy: 3,
      story: '牛奶當了六年的社區貓，習慣自己決定要不要靠近人。牠不會撒嬌，但會在你加班回家時坐在玄關等你。適合尊重貓咪界線的飼主。',
      needs: ['不適合有幼童的家庭', '需要尊重牠的距離'],
      health: '已結紮 · 疫苗完成 · 耳疥蟲已治療',
      match: { hoursMin: 1, spaceMin: 2, otherPetsOk: ['none'], noviceFriendly: false }
    },
    {
      id: 'taro',
      name: '芋圓',
      emoji: '😽',
      color: '#EADCF0',
      age: 2,
      gender: '女生',
      breed: '米克斯 · 賓士貓',
      personality: ['話很多', '會回應人', '愛跟前跟後'],
      energy: 4,
      story: '芋圓是隻很愛聊天的貓，你說一句牠回三句。牠會跟著你進廚房、進浴室、進書房，是隻黏度極高的小跟班，需要在家時間較長的家人。',
      needs: ['不適合長時間無人在家', '需要大量互動'],
      health: '已結紮 · 疫苗完成 · 晶片已植入',
      match: { hoursMin: 3, spaceMin: 2, otherPetsOk: ['none', 'cat'], noviceFriendly: true }
    },
    {
      id: 'coffee',
      name: '咖啡',
      emoji: '🙀',
      color: '#DFCAB5',
      age: 4,
      gender: '男生',
      breed: '米克斯 · 深虎斑',
      personality: ['極度膽小', '需要耐心', '認定就是一輩子'],
      energy: 2,
      story: '咖啡曾被惡意對待，看到掃把會發抖。牠花了兩年才願意在志工面前吃飯。牠需要一個絕對安靜、有經驗、願意用兩三年換牠一次靠近的家。',
      needs: ['需有養貓經驗', '需要極安靜的環境與單獨空間'],
      health: '已結紮 · 疫苗完成 · 需長期行為觀察',
      match: { hoursMin: 2, spaceMin: 2, otherPetsOk: ['none'], noviceFriendly: false }
    }
  ]);

  /* ---------- 關卡一：生活條件問卷 ----------
     每個選項寫入 profile[key]，redline 代表目前條件尚不適合領養  */
  const QUIZ_LIFESTYLE = Object.freeze([
    {
      key: 'petsAllowed',
      question: '你目前的居住狀況，是否能合法養貓？',
      why: '租屋禁養是棄養最常見的原因之一，事先確認才不會讓貓咪二次流浪。',
      options: [
        { label: '自有住宅，可以養', value: 3 },
        { label: '租屋，房東已明確同意養貓', value: 2 },
        { label: '租屋，還沒問過房東', value: 1, redline: '請先取得房東書面同意，這是避免日後被迫棄養的第一道保險。' },
        { label: '租屋，房東不允許養寵物', value: 0, redline: '在找到可養寵的住處前，先別急著領養。你可以先從當中途或志工開始。' }
      ]
    },
    {
      key: 'space',
      question: '家裡可以給貓咪活動的空間大概是？',
      why: '貓需要的是垂直空間與安全感，不是大坪數，但太擁擠會造成長期壓力。',
      options: [
        { label: '整層住家，貓咪可自由活動', value: 3 },
        { label: '一般套房或雅房，有窗台與櫃子可跳', value: 2 },
        { label: '單一房間，空間較小但可加跳台', value: 2 },
        { label: '只有陽台或籠子空間', value: 0, redline: '長期關籠或養在陽台會造成嚴重的行為與健康問題，貓咪需要進到室內生活。' }
      ]
    },
    {
      key: 'hours',
      question: '扣掉上班上課，你每天能陪貓咪的時間有多少？',
      why: '貓不是不需要陪伴，只是牠們的需求比較安靜。長期獨處會引發分離焦慮與亂尿。',
      options: [
        { label: '3 小時以上，多數時間在家', value: 4 },
        { label: '2～3 小時，下班後都在家', value: 3 },
        { label: '1～2 小時，偶爾加班', value: 2 },
        { label: '幾乎不在家，常出差過夜', value: 0, redline: '常態性一天以上無人在家時，需要先安排好固定的餵食與清潔支援。' }
      ]
    },
    {
      key: 'budget',
      question: '你每月能為貓咪準備的預算大約是？',
      why: '飼料、貓砂、預防醫療是固定支出；突發的急診一次就可能上萬元。',
      options: [
        { label: '3000 元以上，另有醫療預備金', value: 4 },
        { label: '1500～3000 元，有一些存款', value: 3 },
        { label: '1000～1500 元，剛好打平', value: 2 },
        { label: '1000 元以下，沒有預備金', value: 0, redline: '基本開銷加上預防醫療，每月至少需 1000～1500 元，並準備 2 萬元以上的急診預備金。' }
      ]
    },
    {
      key: 'familyConsent',
      question: '同住家人對於養貓的態度是？',
      why: '家人反對或有人過敏，是貓咪被送回收容所的主要原因之一。',
      options: [
        { label: '全家都同意，也都沒有過敏', value: 3 },
        { label: '我自己住，可以完全決定', value: 3 },
        { label: '有人還在猶豫，但願意溝通', value: 1 },
        { label: '有人明確反對或會過敏', value: 0, redline: '請先和家人達成共識、確認過敏狀況，這對你和貓咪都比較公平。' }
      ]
    },
    {
      key: 'otherPets',
      question: '家裡目前有其他動物嗎？',
      why: '這會影響我們推薦哪一隻貓給你，也關係到日後漸進式介紹的安排。',
      options: [
        { label: '沒有，貓咪會是唯一的寶貝', value: 'none' },
        { label: '有貓', value: 'cat' },
        { label: '有狗', value: 'dog' },
        { label: '有兔子、鼠類或鳥類等小動物', value: 'small' }
      ]
    },
    {
      key: 'experience',
      question: '你過去有養貓的經驗嗎？',
      why: '沒經驗完全沒問題，我們只是想推薦比較容易上手的孩子給你。',
      options: [
        { label: '養過貓，也處理過生病照護', value: 3 },
        { label: '養過貓，但沒遇過大狀況', value: 2 },
        { label: '養過狗或其他動物', value: 1 },
        { label: '第一次養，完全是新手', value: 1 }
      ]
    },
    {
      key: 'commitment',
      question: '貓咪平均壽命 15～20 年，你的規劃是？',
      why: '領養是一份 15 年以上的承諾，包含搬家、出國、結婚生子都要把貓算進去。',
      options: [
        { label: '會照顧到最後一刻，未來規劃都會把貓算進去', value: 3 },
        { label: '會盡力，遇到變動會先安排好安置', value: 2 },
        { label: '先養養看，不適合再說', value: 0, redline: '貓不是可以「試用」的。請先確認自己能承擔 15 年以上的責任再開始。' }
      ]
    }
  ]);

  /* ---------- 關卡二：養育知識問答 ---------- */
  const QUIZ_KNOWLEDGE = Object.freeze([
    {
      question: '家裡養 2 隻貓，貓砂盆最少要準備幾個？',
      options: ['1 個就夠，牠們會輪流用', '2 個，一貓一個', '3 個，貓咪數量 +1', '不用固定，看牠在哪裡上'],
      answer: 2,
      explain: '標準做法是「貓口數 +1」。貓咪對排泄環境非常挑剔，砂盆不足或不夠乾淨，是亂尿與泌尿道疾病最常見的原因。'
    },
    {
      question: '以下哪一項食物對貓咪有中毒風險？',
      options: ['水煮雞胸肉（無調味）', '洋蔥、蔥、大蒜', '貓用化毛膏', '無調味的白煮蛋黃'],
      answer: 1,
      explain: '蔥屬植物會破壞貓咪的紅血球造成溶血性貧血，而且少量、煮熟也一樣危險。巧克力、葡萄、木糖醇、酒精同樣禁止。'
    },
    {
      question: '關於結紮，下列敘述何者正確？',
      options: [
        '結紮會讓貓咪個性大變、不再親人',
        '母貓一定要生過一胎才能結紮',
        '結紮可降低生殖系統疾病風險，也減少發情壓力與逃家',
        '公貓不需要結紮，反正不會懷孕'
      ],
      answer: 2,
      explain: '結紮能大幅降低子宮蓄膿、乳腺腫瘤與睪丸疾病的風險，也能減少噴尿、嚎叫與衝出門找伴的行為。「生一胎比較好」是沒有科學根據的迷思。'
    },
    {
      question: '新貓剛到家，最恰當的做法是？',
      options: [
        '馬上放出來讓牠熟悉全家、多抱牠培養感情',
        '先安置在獨立房間，放好食物、水、砂盆，讓牠自己慢慢出來',
        '關在外出籠一週，避免牠亂跑',
        '立刻帶去給親友看，讓牠早點習慣人群'
      ],
      answer: 1,
      explain: '這叫「小房間適應法」。突然接觸整個新環境會讓貓極度緊張、絕食或躲藏。先給一個可掌控的小空間，等牠主動出來探索，通常需要 3 天到 2 週。'
    },
    {
      question: '貓咪出現下列哪一種狀況，應該視為急診、立刻就醫？',
      options: [
        '偶爾吐一次毛球，之後照常吃喝',
        '公貓頻繁進出砂盆卻尿不出來',
        '換季時掉毛變多',
        '白天大部分時間在睡覺'
      ],
      answer: 1,
      explain: '這是尿道阻塞的典型徵兆，好發於公貓，24～48 小時內可能因急性腎衰竭致命。此外超過 24 小時完全不吃、張口呼吸、連續嘔吐也都要馬上就醫。'
    },
    {
      question: '貓咪一直抓沙發，最有效的處理方式是？',
      options: [
        '抓到就打牠、噴水，讓牠記住教訓',
        '帶去剪爪手術（去爪）',
        '在牠常抓的位置旁放合適的貓抓板，並保護沙發表面',
        '關進籠子裡不准出來'
      ],
      answer: 2,
      explain: '磨爪是貓的天性，不能禁止，只能「改道」。去爪手術等同切除指骨末端，會造成終身疼痛，台灣獸醫界普遍不建議。處罰則只會讓貓怕你，不會減少抓。'
    },
    {
      question: '關於室內貓的疫苗與驅蟲，正確的是？',
      options: [
        '完全不出門就不用打疫苗也不用驅蟲',
        '幼貓完成基礎疫苗後，仍建議依獸醫評估定期補強，並做預防性驅蟲',
        '打一次疫苗可以終身免疫',
        '人用的驅蟲藥也可以給貓吃'
      ],
      answer: 1,
      explain: '病原可能透過你的鞋子、衣物帶回家。幼貓約 2 個月大起施打核心疫苗，之後依獸醫建議補強；人用藥物（尤其含普拿疼的乙醯胺酚）對貓有致命毒性，絕對不能自行餵食。'
    },
    {
      question: '下列哪種常見居家植物對貓咪具有高度毒性？',
      options: ['貓草（小麥草）', '百合花', '波士頓腎蕨', '木天蓼'],
      answer: 1,
      explain: '百合全株（含花粉與瓶中水）對貓具腎毒性，舔到一點點就可能造成急性腎衰竭。黃金葛、聖誕紅、鬱金香也都有毒，家裡有貓請先查清楚再擺放植物。'
    },
    {
      question: '貓咪每天大多數時間都在睡，還需要陪玩嗎？',
      options: [
        '不用，貓是獨居動物，自己會很開心',
        '需要，每天數次短時間的狩獵式互動，能預防肥胖與行為問題',
        '只要買很多玩具放著，牠自己會玩',
        '只有幼貓需要，成貓不用'
      ],
      answer: 1,
      explain: '室內貓缺乏狩獵機會，容易肥胖、焦慮、半夜跑酷。建議每天 2～3 次、每次 10～15 分鐘的逗貓棒互動，並以「抓到獵物」收尾再給食物，模擬完整狩獵循環。'
    },
    {
      question: '貓咪突然在床上、衣服上尿尿，最該先做的是？',
      options: [
        '牠在報復我，要嚴厲處罰',
        '先帶去醫院排除泌尿道疾病，再檢視砂盆與環境壓力',
        '把牠關起來幾天',
        '換一個牌子的貓砂就好'
      ],
      answer: 1,
      explain: '亂尿在貓行為學上幾乎不是「報復」，而是身體不適或壓力的求救訊號。第一步永遠是就醫排除膀胱炎、結石；醫療問題排除後，再檢查砂盆數量、位置、清潔與環境變動。'
    }
  ]);

  /* ---------- 關卡三：一週照顧模擬 ----------
     effects 影響 hunger（飽足）/ clean（清潔）/ mood（心情）  */
  const CARE_EVENTS = Object.freeze([
    {
      day: 1,
      title: '回家第一天',
      scene: '你把貓咪帶回家了。牠一進門就衝進沙發底下，不吃不喝，只露出兩隻眼睛看你。',
      near: '@sofa',
      say: '（沙發底下傳來細細的聲音）⋯⋯這裡是哪裡？味道都好陌生，我不敢出去。你⋯⋯你打算對我做什麼？',
      react: ['⋯⋯你沒有硬來。也許，這個人可以相信一下下。', '嗚⋯⋯好可怕！我要躲得更裡面！'],
      options: [
        { label: '把牠從沙發下抱出來，讓牠早點習慣', effects: { hunger: -5, clean: 0, mood: -18 }, note: '強行接觸會讓緊張的貓更害怕，信任要慢慢累積。' },
        { label: '在附近放好食物、水和砂盆，安靜離開', effects: { hunger: 8, clean: 5, mood: 12 }, note: '很棒！給牠可控的安全感，是建立信任的第一步。' },
        { label: '叫朋友一起來看新貓，熱鬧一下', effects: { hunger: -8, clean: 0, mood: -22 }, note: '陌生人和噪音會讓剛到家的貓壓力爆表，先讓牠安靜幾天。' }
      ]
    },
    {
      day: 2,
      title: '砂盆的第一次',
      scene: '早上你發現砂盆裡有兩坨排泄物，貓咪正站在旁邊猶豫要不要進去。',
      near: 'litter',
      say: '喵⋯砂盆裡已經有兩坨了，我站在旁邊猶豫很久，實在不太想踩進去。你打算怎麼辦？',
      react: ['乾乾淨淨的，這樣我才願意好好上廁所。', '⋯⋯那我只好另外找地方解決了喔。'],
      options: [
        { label: '立刻鏟乾淨，順手補一點新砂', effects: { hunger: 0, clean: 20, mood: 10 }, note: '正確！貓對砂盆潔癖極高，最好一天鏟 1～2 次。' },
        { label: '晚上再一起清，反正不急', effects: { hunger: 0, clean: -15, mood: -10 }, note: '髒砂盆是亂尿的頭號原因，累積的氨味也會刺激呼吸道。' },
        { label: '把整盆砂全部倒掉換新的', effects: { hunger: 0, clean: 8, mood: -6 }, note: '全換會洗掉牠熟悉的氣味，反而讓牠不安。日常鏟除、定期換即可。' }
      ]
    },
    {
      day: 3,
      title: '罐頭與飲水',
      scene: '貓咪開始願意吃飯了，但你注意到牠幾乎不喝水盆裡的水。',
      near: 'water',
      say: '飯我是願意吃了啦。不過那碗水⋯⋯我其實幾乎沒在喝。你有發現嗎？',
      react: ['多幾個地方有水，罐罐也濕濕的，我喜歡。', '肚子怪怪的⋯⋯而且我還是沒喝到什麼水。'],
      options: [
        { label: '不管牠，貓本來就喝很少', effects: { hunger: -6, clean: 0, mood: -8 }, note: '飲水不足是泌尿道疾病的高風險因子，不能放著不管。' },
        { label: '增加濕食比例，多放幾個水碗並遠離砂盆', effects: { hunger: 16, clean: 5, mood: 12 }, note: '很好！濕食含水量約 70～80%，多點位供水也符合貓的天性。' },
        { label: '在水裡加牛奶增加牠的意願', effects: { hunger: -4, clean: -6, mood: -10 }, note: '多數成貓有乳糖不耐，牛奶會造成腹瀉。要加也該用貓用羊奶粉。' }
      ]
    },
    {
      day: 4,
      title: '半夜三點的跑酷',
      scene: '凌晨三點，貓咪在你頭上狂奔、對著窗外大叫，你完全睡不著。',
      near: 'tree',
      say: '喵嗚——！凌晨三點是我的狩獵時間！跑跑跑！欸，你怎麼一臉想睡的樣子？',
      react: ['玩到抓到獵物、吃飽、舔舔毛⋯⋯呼，好睏，晚安。', '哼，明天我要叫得更早、更大聲。'],
      options: [
        { label: '大聲罵牠、把牠關到浴室', effects: { hunger: 0, clean: -5, mood: -20 }, note: '處罰只會讓牠怕你，半夜活躍是貓的天性，要靠白天安排解決。' },
        { label: '睡前安排 15 分鐘逗貓棒 + 一餐正餐', effects: { hunger: 12, clean: 0, mood: 18 }, note: '完美！「狩獵→進食→理毛→睡覺」是貓的自然循環，能大幅改善夜間活動。' },
        { label: '牠一叫就起來餵食安撫牠', effects: { hunger: 6, clean: 0, mood: -12 }, note: '這會訓練出「叫了就有飯」的習慣，明天會叫得更早更久。' }
      ]
    },
    {
      day: 5,
      title: '沙發保衛戰',
      scene: '你發現新沙發的側邊已經被抓出一片毛邊，貓咪正抓得非常起勁。',
      near: '@sofa',
      say: '唰唰唰——這張新沙發的側邊抓起來手感超棒！⋯⋯咦，你的臉色怎麼怪怪的？',
      react: ['這塊抓板就在旁邊，材質也對味，那我抓這個就好。', '你好兇⋯⋯我等你不在家的時候再抓。'],
      options: [
        { label: '在沙發旁放直立式貓抓板，並貼保護貼片', effects: { hunger: 0, clean: 10, mood: 14 }, note: '正解！磨爪不能禁止，只能改道到牠喜歡的材質與位置。' },
        { label: '噴水處罰，讓牠不敢再抓', effects: { hunger: 0, clean: 0, mood: -16 }, note: '噴水只會讓牠學會「你在的時候不抓」，並破壞你們的信任。' },
        { label: '查詢去爪手術的費用', effects: { hunger: 0, clean: 0, mood: -25 }, note: '去爪等於切除指骨末端，造成終身疼痛與行為問題，絕對不該考慮。' }
      ]
    },
    {
      day: 6,
      title: '吐了一攤',
      scene: '貓咪今天吐了三次，其中一次帶有未消化的飼料，牠看起來比平常安靜，食慾也差。',
      near: 'bed',
      say: '⋯⋯我今天吐了三次，不太想吃東西，只想窩著不動。我平常不會這樣的。',
      react: ['雖然討厭外出籠，但謝謝你馬上帶我去看醫生。', '好不舒服⋯⋯為什麼還不帶我去看醫生⋯⋯'],
      options: [
        { label: '先觀察一週再說，貓吐很正常', effects: { hunger: -18, clean: -10, mood: -20 }, note: '危險！一天連續嘔吐加上食慾下降，可能是異物、胰臟炎或中毒。' },
        { label: '拍下嘔吐物照片，當天帶去醫院檢查', effects: { hunger: 10, clean: 12, mood: 15 }, note: '正確！紀錄次數、內容物與精神食慾，是獸醫判斷的重要依據。' },
        { label: '自己餵人用的止吐藥', effects: { hunger: -12, clean: 0, mood: -28 }, note: '絕對禁止。許多人用藥對貓有致命毒性，用藥一律遵照獸醫指示。' }
      ]
    },
    {
      day: 7,
      title: '一週結束',
      scene: '一週過去了，貓咪終於願意在你腳邊趴下。你準備規劃接下來的長期照顧。',
      near: '@window',
      say: '呼嚕呼嚕⋯⋯這一週下來，我決定趴在你腳邊了。接下來的十幾年，你有什麼打算？',
      react: ['聽起來，我可以安心把一輩子交給你了。', '我很會忍痛的⋯⋯等你發現的時候，可能就太晚了。'],
      options: [
        { label: '排定年度健檢、疫苗補強，並存一筆醫療預備金', effects: { hunger: 10, clean: 10, mood: 18 }, note: '成熟的飼主思維：預防醫療永遠比急診便宜，也比較不心痛。' },
        { label: '等牠生病再處理，現在很健康不用花錢', effects: { hunger: -10, clean: -8, mood: -16 }, note: '貓極會隱藏病痛，等到看得出來通常已經拖很久了。' },
        { label: '先買一堆玩具和漂亮的貓跳台犒賞自己', effects: { hunger: 0, clean: 0, mood: 6 }, note: '玩具很好，但醫療預備金才是真正的安全網，兩者優先順序別顛倒。' }
      ]
    }
  ]);

  /* 每天自然衰減 */
  const DAILY_DECAY = Object.freeze({ hunger: -10, clean: -10, mood: -8 });


  /* ---------- 關卡三：房間佈置 ----------
     座標以左上為 (0,0)。窗與門在牆上，以格子外的虛擬座標表示  */
  const ROOM = Object.freeze({
    cols: 6,
    rows: 5,
    fixed: {
      '@window': { label: '窗戶', emoji: '🪟', points: [{ x: 2, y: -1 }, { x: 3, y: -1 }], catAt: { x: 2, y: 0 } },
      '@door': { label: '房門', emoji: '🚪', points: [{ x: -1, y: 4 }], catAt: { x: 0, y: 4 } },
      '@sofa': { label: '沙發', emoji: '🛋️', points: [{ x: 4, y: 4 }, { x: 5, y: 4 }], catAt: { x: 3, y: 4 }, blocks: true }
    }
  });

  const ROOM_ITEMS = Object.freeze([
    { id: 'litter', name: '貓砂盆', emoji: '🚽', kind: 'required' },
    { id: 'food', name: '食碗', emoji: '🍚', kind: 'required' },
    { id: 'water', name: '水碗', emoji: '💧', kind: 'required' },
    { id: 'bed', name: '貓窩', emoji: '🛏️', kind: 'required' },
    { id: 'scratcher', name: '貓抓板', emoji: '🪵', kind: 'required' },
    { id: 'tree', name: '貓跳台', emoji: '🗼', kind: 'required' },
    { id: 'box', name: '紙箱', emoji: '📦', kind: 'bonus' },
    { id: 'toy', name: '逗貓棒', emoji: '🪶', kind: 'bonus' },
    { id: 'lily', name: '百合盆栽', emoji: '💐', kind: 'trap' },
    { id: 'cord', name: '外露延長線', emoji: '🔌', kind: 'trap' }
  ]);

  /* type: apart（a 與 b 距離 >= min）/ near（a 與 b 距離 <= max）/ placed / absent
     距離為 8 方向格距；a 未放置時該規則略過  */
  const ROOM_RULES = Object.freeze([
    {
      id: 'litter-food', type: 'apart', a: 'litter', b: ['food', 'water'], min: 2, focus: 'litter',
      pass: '廁所和餐桌有分開，很好。誰會想在馬桶旁邊吃飯呀？',
      fail: '欸⋯⋯砂盆就在我的飯碗旁邊？你會想在馬桶旁邊吃飯嗎？',
      tip: '砂盆要遠離食物與飲水，否則貓可能拒吃或拒用砂盆。',
      passEffects: { hunger: 5, clean: 5, mood: 3 },
      failEffects: { hunger: -8, clean: -8, mood: -5 }
    },
    {
      id: 'water-food', type: 'apart', a: 'water', b: ['food'], min: 2, focus: 'water',
      pass: '水放得離飯碗遠遠的，這樣的水我才覺得乾淨，會多喝幾口。',
      fail: '水就放在飯旁邊啊⋯⋯我們貓的本能會覺得這水被獵物弄髒了，不太想喝耶。',
      tip: '水碗與食碗分開、多點位供水，能明顯增加飲水量。',
      passEffects: { hunger: 10, clean: 0, mood: 2 },
      failEffects: { hunger: -8, clean: 0, mood: -2 }
    },
    {
      id: 'tree-window', type: 'near', a: 'tree', b: ['@window'], max: 1, focus: 'tree',
      pass: '跳台在窗邊！我可以整天看鳥看車，這是我的貓咪電視。',
      fail: '跳台離窗戶好遠⋯⋯我想曬太陽、看外面的小鳥嘛。',
      tip: '靠窗的高處是室內貓最重要的娛樂來源（記得紗窗要加固防墜）。',
      passEffects: { hunger: 0, clean: 0, mood: 8 },
      failEffects: { hunger: 0, clean: 0, mood: -4 }
    },
    {
      id: 'scratcher-spot', type: 'near', a: 'scratcher', b: ['@sofa', 'bed'], max: 1, focus: 'scratcher',
      pass: '抓板就在我睡醒伸懶腰、還有沙發旁邊的位置，那我當然抓這個。',
      fail: '抓板放在那麼偏的角落，我才懶得走過去。沙發就在旁邊，抓沙發比較快。',
      tip: '抓板要放在貓睡醒處或牠本來就想抓的家具旁，才會真的被使用。',
      passEffects: { hunger: 0, clean: 3, mood: 6 },
      failEffects: { hunger: 0, clean: -3, mood: -4 }
    },
    {
      id: 'bed-door', type: 'apart', a: 'bed', b: ['@door'], min: 2, focus: 'bed',
      pass: '睡覺的地方離門口遠遠的，不會一直有人走來走去，我可以安心睡。',
      fail: '床就在門口旁邊，有人進出我就會被嚇醒，睡不安穩啦。',
      tip: '休息區要安靜、少人走動，貓才有安全感。',
      passEffects: { hunger: 0, clean: 0, mood: 5 },
      failEffects: { hunger: 0, clean: 0, mood: -5 }
    },
    {
      id: 'litter-door', type: 'apart', a: 'litter', b: ['@door'], min: 2, focus: 'litter',
      pass: '廁所在安靜的位置，上到一半不會被突然開門嚇到。',
      fail: '砂盆就在門邊⋯⋯上廁所上到一半有人開門，我下次就不敢用了。',
      tip: '砂盆要放在安靜、不會被打擾、又容易到達的位置。',
      passEffects: { hunger: 0, clean: 8, mood: 2 },
      failEffects: { hunger: 0, clean: -6, mood: -3 }
    },
    {
      id: 'has-box', type: 'placed', a: 'box', focus: 'box',
      pass: '有紙箱！害怕的時候我有地方可以躲，太懂我了。',
      fail: '這個房間沒有可以躲的地方耶⋯⋯我緊張的時候要去哪？',
      tip: '躲藏處能大幅降低新貓的壓力，一個紙箱就夠了。',
      passEffects: { hunger: 0, clean: 0, mood: 6 },
      failEffects: { hunger: 0, clean: 0, mood: -3 },
      failFocus: '@door'
    },
    {
      id: 'no-lily', type: 'absent', a: 'lily', focus: 'lily',
      pass: '還好你沒把那盆百合搬進來。那東西我舔到一點花粉，腎臟就壞了。',
      fail: '等等，這是百合？！我只要舔到一點花粉、喝到一口瓶裡的水，就可能急性腎衰竭！快拿走！',
      tip: '百合全株對貓具腎毒性，有貓的家裡完全不該出現。',
      passEffects: { hunger: 0, clean: 0, mood: 2 },
      failEffects: { hunger: -5, clean: 0, mood: -15 },
      passFocus: '@window'
    },
    {
      id: 'no-cord', type: 'absent', a: 'cord', focus: 'cord',
      pass: '電線都有收好，沒有晃來晃去的東西引誘我去咬，安全。',
      fail: '這條線晃來晃去的好好咬喔——等一下，咬下去會觸電對吧？！',
      tip: '外露電線要用理線槽或防咬管收好，幼貓尤其愛咬。',
      passEffects: { hunger: 0, clean: 2, mood: 0 },
      failEffects: { hunger: 0, clean: -4, mood: -8 },
      passFocus: '@door'
    }
  ]);

  /* ---------- 養育知識庫（guide.html） ---------- */
  const GUIDE_SECTIONS = Object.freeze([
    {
      icon: '🏠',
      title: '接貓回家前的準備',
      items: [
        '必備清單：外出籠、飼料、水碗、貓砂盆（貓口數 +1）、貓砂、貓抓板、逗貓棒。',
        '居家防護：紗窗加固（防墜樓是第一要務）、收好電線與橡皮筋、移除百合等有毒植物。',
        '準備一間可關門的獨立房間，作為前 1～2 週的適應空間。'
      ]
    },
    {
      icon: '🍚',
      title: '飲食與飲水',
      items: [
        '貓是專性肉食動物，主食應以高蛋白的貓用飼料或主食罐為主。',
        '增加濕食比例、多點位供水，是預防泌尿道疾病最簡單的方法。',
        '禁止食物：蔥蒜洋蔥、巧克力、葡萄與葡萄乾、酒精、木糖醇、生麵糰、人用藥物。',
        '牛奶會造成多數成貓腹瀉，要給請用貓用羊奶粉。'
      ]
    },
    {
      icon: '🚽',
      title: '貓砂盆管理',
      items: [
        '數量：貓口數 +1；位置要安靜、通風、遠離食物與水。',
        '每天鏟 1～2 次，定期整盆更換與清洗，但不要每次全換（會洗掉熟悉氣味）。',
        '貓砂類型與盆型突然更換，可能導致拒用，要漸進混合替換。'
      ]
    },
    {
      icon: '💉',
      title: '醫療與預防',
      items: [
        '幼貓約 2 個月大起施打核心疫苗，之後依獸醫評估定期補強。',
        '結紮可降低生殖系統疾病風險，也減少發情壓力、噴尿與逃家。',
        '成貓建議每年健檢一次，7 歲以上每半年一次並加做血檢。',
        '每月固定支出約 1000～1500 元，另建議準備 2 萬元以上急診預備金。'
      ]
    },
    {
      icon: '🚨',
      title: '這些狀況要立刻就醫',
      items: [
        '公貓頻繁進出砂盆卻尿不出來（尿道阻塞，可能 24～48 小時內致命）。',
        '超過 24 小時完全不進食（可能引發肝脂肪沉積症）。',
        '呼吸急促、張口呼吸、舌頭發紫。',
        '連續嘔吐、嚴重腹瀉、抽搐、明顯外傷或高處墜落後。'
      ]
    },
    {
      icon: '🧶',
      title: '行為與互動',
      items: [
        '每天 2～3 次、每次 10～15 分鐘的逗貓棒互動，以「抓到獵物再進食」收尾。',
        '磨爪、跳高、躲藏都是天性，要提供替代方案而不是禁止。',
        '亂尿幾乎不是報復，第一步永遠是就醫排除疾病，再找環境壓力源。',
        '絕不使用體罰、噴水、大聲斥責，這些只會破壞信任並加重焦慮。'
      ]
    }
  ]);

  window.CatData = Object.freeze({
    CATS,
    QUIZ_LIFESTYLE,
    QUIZ_KNOWLEDGE,
    CARE_EVENTS,
    DAILY_DECAY,
    ROOM,
    ROOM_ITEMS,
    ROOM_RULES,
    GUIDE_SECTIONS
  });
})();
