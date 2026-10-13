'use strict';
/* 蟋蟀的住宅（四上 11）· 本课数据与互动。分类、选一选、读写练习见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* ================= 课后第 1 题 · 蟋蟀和别的昆虫 ================= */
const KINDS = ['别的昆虫', '蟋蟀'];
const SORT_ITEMS = [
  { s: '在临时的隐蔽所藏身', ok: ['别的昆虫'], q: '临时：暂时住住' },
  { s: '隐蔽所得来不费功夫，弃去毫不可惜', ok: ['别的昆虫'], q: '随便找，随便扔' },
  { s: '不肯随遇而安', ok: ['蟋蟀'], q: '对住址很挑剔' },
  { s: '慎重地选择住址：排水优良，有温和的阳光', ok: ['蟋蟀'], q: '小心、认真地挑' },
  { s: '不利用现成的洞穴，自己一点儿一点儿挖掘', ok: ['蟋蟀'], q: '全靠自己' },
];

/* ================= 住宅剖面示意 ================= */
const HOUSE = {
  xuanzhi: ['选址', '在朝着阳光的堤岸上，青草丛中隐藏着一条倾斜的隧道，即使有骤雨，这里也立刻就会干的。', '向阳，温暖；倾斜，排水优良。'],
  suidao: ['隧道', '隧道顺着地势弯弯曲曲，最多九寸深，一指宽，这便是蟋蟀的住宅。', '九寸约 30 厘米，一指宽——小小的，弯弯的。'],
  men: ['门', '出口的地方总有一丛草半掩着，就像一座门。蟋蟀出来吃周围的嫩草，绝不去碰这一丛草。', '有草挡着，隐蔽又安全。'],
  pingtai: ['平台', '那微斜的门口，经过仔细耙扫，收拾得很平坦。这就是蟋蟀的平台。当四周很安静的时候，蟋蟀就在这平台上弹琴。', '“弹琴”其实是振翅鸣叫——把蟋蟀写成了小音乐家。'],
  neibu: ['内部', '屋子的内部没什么布置，但是墙壁很光滑。主人有的是时间，把粗糙的地方修理平整。大体上讲，住所是很简朴的，清洁、干燥，很卫生。', '简朴，却舒服、干净。'],
};
function buildHouse() {
  const svg = document.getElementById('houseSvg');
  const tuft = (x, y) => `<path d="M${x} ${y} l-8 -26 l12 18 l2 -30 l6 30 l12 -20 l-8 28 z"/>`;
  const lab = (x, y, w, t) => `<rect x="${x - w / 2}" y="${y - 24}" width="${w}" height="34" rx="17" fill="#fff" stroke="#d9a520" stroke-width="2"/><text class="t-m t-c" x="${x}" y="${y}" fill="#6b3a10">${t}</text>`;
  svg.innerHTML = `<defs><clipPath id="hsClip"><rect width="800" height="440" rx="14"/></clipPath></defs>
  <g clip-path="url(#hsClip)">
    <rect width="800" height="440" fill="#dcecf5"/>
    <circle cx="90" cy="70" r="40" fill="#f6c55a"/>
    <g stroke="#f6c55a" stroke-width="5" stroke-linecap="round"><path d="M150 90 l40 14"/><path d="M140 120 l34 26"/><path d="M110 130 l18 34"/></g>
    <path d="M0 230 L250 170 L330 160 L800 110 V440 H0 Z" fill="#9c7a52"/>
    <path d="M0 230 L250 170 L330 160 L800 110" fill="none" stroke="#6f9a3e" stroke-width="10"/>
    <g fill="#5f8f34">${[40, 120, 200, 420, 500, 600, 700].map((x) => tuft(x, 230 - x * 0.15)).join('')}</g>
    <path class="hs-tunnel" d="M330 160 C 380 190, 360 240, 420 270 S 520 290, 560 340" fill="none" stroke="#3e2c1c" stroke-width="26" stroke-linecap="round"/>
    <ellipse cx="580" cy="352" rx="44" ry="24" fill="#3e2c1c"/>
    <path class="hs-wall" d="M330 160 C 380 190, 360 240, 420 270 S 520 290, 560 340" fill="none" stroke="#c9ab80" stroke-width="3" stroke-dasharray="2 0" opacity="0"/>
    <g fill="#4f8a2c"><path d="M318 160 l-14 -46 l20 34 l4 -52 l10 52 l18 -40 l-10 52 z"/></g>
    <path d="M236 172 L330 160" stroke="#d8c09a" stroke-width="8" stroke-linecap="round"/>
    <g transform="translate(270 158)"><ellipse rx="14" ry="7" fill="#2b2016"/><circle cx="-14" cy="-2" r="5" fill="#2b2016"/><path d="M-18 -4 q-20 -18 -30 -10 M-17 -6 q-14 -24 -24 -22" stroke="#2b2016" stroke-width="1.5" fill="none"/><path d="M4 2 l14 10 M6 0 l18 4" stroke="#2b2016" stroke-width="3"/></g>
    <g class="hs hs-xuanzhi">${lab(150, 210, 150, '朝着阳光')}${lab(560, 70, 210, '骤雨后立刻就干')}<g fill="#6fa8d6">${[480, 520, 560, 600, 640].map((x) => `<path d="M${x} 90 l-6 14 a6 6 0 1 0 12 0 z"/>`).join('')}</g><path d="M420 150 l120 -14" stroke="#6fa8d6" stroke-width="4" stroke-dasharray="8 6" marker-end=""/></g>
    <g class="hs hs-suidao"><path d="M330 160 C 380 190, 360 240, 420 270 S 520 290, 560 340" fill="none" stroke="#f2c14e" stroke-width="34" stroke-linecap="round" opacity=".35"/>${lab(470, 230, 130, '倾斜、弯曲')}<path d="M690 120 V 360" stroke="#fff" stroke-width="3"/><path d="M680 120 h20 M680 360 h20" stroke="#fff" stroke-width="3"/>${lab(700, 250, 160, '最多九寸深')}${lab(420, 330, 110, '一指宽')}</g>
    <g class="hs hs-men"><circle cx="322" cy="140" r="40" fill="none" stroke="#f2c14e" stroke-width="5" stroke-dasharray="8 6"/>${lab(330, 60, 160, '一丛草半掩着')}</g>
    <g class="hs hs-pingtai"><path d="M236 172 L330 160" stroke="#f2c14e" stroke-width="14" stroke-linecap="round" opacity=".7"/>${lab(240, 120, 110, '平台')}<text class="t-l" x="300" y="128" fill="#6b3a10">♪</text></g>
    <g class="hs hs-neibu"><path d="M330 160 C 380 190, 360 240, 420 270 S 520 290, 560 340" fill="none" stroke="#e8d3ad" stroke-width="20" stroke-linecap="round"/><ellipse cx="580" cy="352" rx="38" ry="18" fill="#e8d3ad"/>${lab(560, 410, 210, '墙壁光滑，干燥卫生')}</g>
  </g>`;
}
function initHouseBtns() {
  const svg = document.getElementById('houseSvg');
  const card = document.getElementById('houseCard');
  document.querySelector('.house-btns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-h]');
    if (!b) return;
    const [name, quote, why] = HOUSE[b.dataset.h];
    svg.setAttribute('class', `h-${b.dataset.h}`);
    card.innerHTML = `<b>${name}</b><p>“${quote}”</p><p class="why">${why}</p>`;
    document.querySelectorAll('.house-btns .btn').forEach((x) => x.classList.toggle('solid', x === b));
  });
}

/* ================= 课后第 2 题 · 蟋蟀的工具 ================= */
function buildCricket() {
  const svg = document.getElementById('cricketSvg');
  // 两排锯：沿后腿下半段（520,220）→（470,300）两侧各一排小齿
  const tooth = (t, side) => {
    const x = 520 - 50 * t; const y = 220 + 80 * t;
    const px = 0.85 * side * 9; const py = 0.53 * side * 9;
    return `<path d="M${(x + px * .6).toFixed(1)} ${(y + py * .6).toFixed(1)} l${(px * 1.2).toFixed(1)} ${(py * 1.2).toFixed(1)} l${(-5.3 + px * -.4).toFixed(1)} ${(8.5 + py * -.4).toFixed(1)} z"/>`;
  };
  const teeth = [0.15, 0.27, 0.39, 0.51, 0.63, 0.75, 0.87];
  const saw = teeth.map((t) => tooth(t, 1)).join('');
  const saw2 = teeth.map((t) => tooth(t, -1)).join('');
  const lab = (x, y, w, t) => `<rect x="${x - w / 2}" y="${y - 24}" width="${w}" height="34" rx="17" fill="#fff" stroke="#d9a520" stroke-width="2"/><text class="t-m t-c" x="${x}" y="${y}" fill="#6b3a10">${t}</text>`;
  svg.innerHTML = `<rect width="600" height="360" rx="14" fill="#f3efe2"/>
    <path d="M0 300 H600" stroke="#c9b48a" stroke-width="4"/>
    <g class="cr-body">
      <path d="M130 150 q-80 -90 -120 -110 M136 146 q-60 -110 -90 -140" stroke="#3a2a1a" stroke-width="3" fill="none"/>
      <ellipse cx="300" cy="190" rx="130" ry="46" fill="#4a3826"/>
      <path d="M220 160 q90 -40 190 10 q-90 10 -190 -10z" fill="#6a523a"/>
      <circle cx="160" cy="186" r="38" fill="#3e2e1e"/><circle cx="148" cy="174" r="7" fill="#f3efe2"/>
      <path d="M430 196 l60 20" stroke="#3a2a1a" stroke-width="4"/>
    </g>
    <g class="cr-part cr-dae"><path d="M124 204 q-26 6 -30 22 q14 -6 30 -8 M128 212 q-18 18 -14 32 q10 -12 22 -20" fill="#7a5532" stroke="#2b1d10" stroke-width="2"/></g>
    <g class="cr-part cr-qianzu"><path d="M190 226 l-20 40 l-28 34 M230 230 l-6 40 l-24 30" fill="none" stroke="#5a4430" stroke-width="7" stroke-linecap="round"/></g>
    <g class="cr-part cr-houzu"><path d="M360 200 Q 420 110 520 220 L 470 300" fill="none" stroke="#5a4430" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/></g>
    <g class="cr-part cr-ju" fill="#2b1d10">${saw}${saw2}</g>
    <g class="cr-lab lb-qianzu">${lab(150, 340, 120, '前足：扒土')}</g>
    <g class="cr-lab lb-dae">${lab(110, 290, 190, '大颚：搬土块')}</g>
    <g class="cr-lab lb-houzu">${lab(500, 100, 160, '后足：踏地')}</g>
    <g class="cr-lab lb-ju">${lab(470, 330, 230, '两排锯：把泥土推到后面')}</g>`;
}
function initTools() {
  const svg = document.getElementById('cricketSvg');
  document.querySelector('.tool-list').addEventListener('click', (e) => {
    const b = e.target.closest('[data-t]');
    if (!b) return;
    b.classList.add('seen');
    svg.setAttribute('class', `t-${b.dataset.t}`);
    document.querySelectorAll('.tool').forEach((x) => x.classList.toggle('cur', x === b));
  });
}

/* ================= 课后第 2 题 · 排一排修建过程 ================= */
const BUILD = [
  '十月，秋天初寒，开始盖房子',
  '前足扒土，大颚搬土块，后腿把泥土推到后面',
  '累了，在家门口休息一会儿，又进去继续干',
  '洞挖了两寸深，重要部分快完成了',
  '长时间整修：今天做一点儿，明天做一点儿',
  '冬天天气温和时，还在不断地抛出泥土',
];
const BUILD_ORDER = [3, 0, 5, 1, 4, 2];
function initBuild() {
  const box = document.getElementById('build');
  let next = 0;
  box.innerHTML = BUILD_ORDER.map((k) => `<button type="button" class="bcard" data-k="${k}"><i></i><span>${BUILD[k]}</span></button>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.bcard');
    if (!b || b.classList.contains('done')) return;
    if (+b.dataset.k === next) {
      next += 1;
      b.classList.add('done');
      b.querySelector('i').textContent = next;
      b.style.order = next;
      box.classList.toggle('all', next === BUILD.length);
    } else {
      b.classList.remove('nope');
      void b.offsetWidth; // 重新触发抖动
      b.classList.add('nope');
    }
  });
}

/* ================= 课后第 3 题 · 把蟋蟀当人写 ================= */
const PICKS = {
  person: [
    { t: '住宅', ok: true, why: '人住的房子' }, { t: '住址', ok: true }, { t: '大厅', ok: true }, { t: '卧室', ok: true },
    { t: '平台', ok: true }, { t: '弹琴', ok: true, why: '其实是振翅鸣叫' }, { t: '主人', ok: true }, { t: '盖房子', ok: true },
    { t: '伟大的工程', ok: true }, { t: '触须', ok: false, why: '昆虫本来就有' }, { t: '大颚', ok: false, why: '昆虫的身体部位' }, { t: '堤岸', ok: false, why: '地方' },
  ],
};

/* ================= 读与写 ================= */
const MOMENTS = [
  {
    name: '介绍修建过程', pic: 'wadong',
    prompt: '用自己的话，向同学介绍蟋蟀住宅的修建过程。',
    hint: '按顺序说：什么时候开工 → 用什么工具、怎么挖 → 累了怎么办 → 后来怎样整修。',
    example: '蟋蟀大多在十月开始盖房子。它先用前足扒土，用钳子似的大颚把大土块搬走，再用强有力的后足踏地，用后腿上的两排锯把泥土推到后面。累了，它就在门口歇一会儿，接着又钻进去干。洞挖到两寸深，主要部分就完成了，以后它还要今天修一点儿、明天修一点儿，一直修到冬天。',
  },
  {
    name: '写小动物的家', pic: 'didi',
    prompt: '学课文的写法，把一种小动物当成人，写一写它的“家”。',
    hint: '可以写蚂蚁的“地下宫殿”、蜘蛛的“空中大网”、燕子的“泥房子”……用上“主人”“大门”“卧室”这样的词。',
    example: '墙角的那张网，是蜘蛛的“空中大宅”。主人每天清早都要巡视一遍：哪根丝断了，就马上补好。它最喜欢待在网中央的“客厅”里，八条腿搭在丝上，一有动静，立刻就知道是谁来“拜访”了。',
  },
  {
    name: '观察日记', pic: 'tanqin',
    prompt: '选一种小动物，连续观察几天，写一则观察日记。',
    hint: '写清日期；写它在做什么、怎么做；学法布尔，把看到的细节写下来。',
    example: '10 月 12 日　晴。今天我在花坛边看见一队蚂蚁在搬家。它们排成一条细细的线，有的扛着白白的蚁卵，有的两只合抬一粒饭粒。我一连看了半个小时，它们一刻也没有停。',
  },
];

/* ================= 观察记录本：只展开最近两条，早的收成一行摘要 ================= */
const NB_OPEN = 2;
function updateNotebook(slide, step) {
  const on = [...slide.querySelectorAll('.nb-entry')].filter((e) => +e.dataset.step <= step);
  slide.querySelectorAll('.nb-entry').forEach((e) => e.classList.toggle('fold', on.indexOf(e) > -1 && on.indexOf(e) < on.length - NB_OPEN));
  const v = slide.querySelector('.nb-video');
  if (v && v.src) v.play().catch(() => { /* 浏览器拒绝自动播放时停在封面帧 */ });
}

window.LESSON = {
  init() {
    Narrative.init({ kinds: KINDS, sort: SORT_ITEMS, picks: PICKS, moments: MOMENTS });
    buildHouse();
    initHouseBtns();
    buildCricket();
    initTools();
    initBuild();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.querySelector('#notebook')) updateNotebook(slide, step);
  },
};
