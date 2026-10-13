'use strict';
/* 蜜蜂（三下 14）· 本课数据与互动。翻卡、选一选见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* ================= 数一数：二十只左右放飞，回来几只 =================
 * 第 n 步时，前 BACK[n] 只蜜蜂已经回到蜂窝；第 4 步以后没回来的变淡 */
const BEES = 20;
const BACK = [0, 0, 2, 5, 15, 15];
const FIELD = (i) => [60 + (i % 5) * 52, 90 + Math.floor(i / 5) * 52];
const HIVE = (i) => [640 + (i % 5) * 46, 120 + Math.floor(i / 5) * 40];

const beeShape = '<ellipse rx="14" ry="10" fill="#f2c230"/><path d="M-4 -9 v18 M4 -9 v18" stroke="#2b2420" stroke-width="3.5"/>' +
  '<ellipse cx="-3" cy="-13" rx="7" ry="5" fill="#e8f3fb" opacity=".9"/><ellipse cx="5" cy="-13" rx="7" ry="5" fill="#e8f3fb" opacity=".9"/>' +
  '<circle cx="9" cy="-2" r="3" fill="#fff" stroke="#999"/>';

function buildBees() {
  const svg = document.getElementById('bees');
  svg.innerHTML = `<rect width="900" height="330" rx="14" fill="#eef4e4"/>
    <rect x="20" y="40" width="300" height="250" rx="12" fill="#dcebc4"/>
    <text class="t-m t-c" x="170" y="30" fill="#4a6b2a">四公里外的田野</text>
    <path d="M330 170 C 430 110, 520 230, 600 170" stroke="#8a7a5a" stroke-width="3" stroke-dasharray="10 8" fill="none"/>
    <text class="t-m t-c" x="465" y="130" fill="#6b5a3a">四公里</text>
    <rect x="610" y="70" width="270" height="220" rx="12" fill="#f6e7c4"/>
    <text class="t-m t-c" x="745" y="60" fill="#8a5a1a">家 · 草料棚的蜂窝</text>
    <path d="M700 290 v-30 h90 v30" fill="#b98a4a"/><path d="M690 262 q55 -40 110 0 Z" fill="#9b6a32"/>
    <text class="count t-c" x="745" y="320" fill="#8a5a1a">回家：<tspan id="beeN">0</tspan> 只</text>
    ${Array.from({ length: BEES }, (_, i) => `<g class="bee" data-i="${i}"><g class="bee-in">${beeShape}</g></g>`).join('')}`;
}

function placeBees(step) {
  const n = BACK[Math.min(step, BACK.length - 1)];
  document.querySelectorAll('#bees .bee').forEach((g) => {
    const i = +g.dataset.i;
    const [x, y] = i < n ? HIVE(i) : FIELD(i);
    g.style.transform = `translate(${x}px, ${y}px)`;
    g.classList.toggle('home', i < n);
    g.classList.toggle('lost', step >= 4 && i >= n);
  });
  document.getElementById('beeN').textContent = n;
}

/* 加点词：正面去掉，背面原文 */
const CLUE_LABELS = ['去掉加点的词', '原文 · 体会'];
const CLUES = [
  { q: '二十只被闷了好久的蜜蜂向四面飞散……', a: '原文是“二十只<b>左右</b>”。作者没法一只一只数得那么准，说“左右”才实事求是。' },
  { q: '……蜜蜂向四面飞散，在寻找回家的方向。', a: '原文有“<b>好像</b>”。蜜蜂是不是在找家，作者看不出来，只能猜——说得有分寸。' },
  { q: '蜜蜂飞得很低，几乎要触到地面，这样可以减少阻力。', a: '原文有“<b>大概</b>”。这是作者的推测，没有经过证明，所以不说死。' },
  { q: '它们回到蜂窝里，肚皮下面还沾着花粉呢。', a: '原文写了“<b>两点四十分</b>”回到蜂窝。时间记得准，才能算出“大约三刻钟”飞了四公里——实验记录要准确。' },
];

const PICKS = {
  more: [
    { t: '我推测蜜蜂可能找不到家了。', ok: true, why: '推测、可能：还没有结果，只是猜想' },
    { t: '一天，我在我家草料棚的蜂窝里捉了一些蜜蜂。', ok: false, why: '没有这样的词' },
    { t: '蜜蜂飞得很低，几乎要触到地面。', ok: true, why: '几乎：差一点，并没有真的碰到' },
    { t: '我放蜜蜂的时候是将近两点钟。', ok: true, why: '将近：快到两点，还没到' },
    { t: '在大约三刻钟的时间里，那两只小蜜蜂飞了四公里路。', ok: true, why: '大约：不是正好三刻钟' },
    { t: '小女儿就冲过来，脸红红的，看上去很激动。', ok: false, why: '这是写小女儿的样子' },
    { t: '傍晚时，我亲眼看到另外三只飞了回来。', ok: true, why: '亲眼：自己看到的，真实可信' },
    { t: '至少有十五只没有迷失方向。', ok: true, why: '至少：也许还有没被发现的' },
  ],
};

/* 排一排：按图讲实验 */
const PICS = [
  { pic: 'zhuo', cap: '捉蜜蜂，放进纸袋' },
  { pic: 'fangfei', cap: '四公里外，做记号，放飞' },
  { pic: 'nver', cap: '小女儿：飞回来两只！' },
  { pic: 'fengwo', cap: '第二天，一共十五只' },
];
const SHUFFLED = [2, 0, 3, 1];

function initPics() {
  const box = document.getElementById('pics');
  let next = 0;
  box.innerHTML = SHUFFLED.map((k) => `<button type="button" class="pic-card" data-k="${k}">
    <span class="pic" data-bg="assets/${PICS[k].pic}.jpg"></span><i></i><span class="cap">${PICS[k].cap}</span></button>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.pic-card');
    if (!b || b.classList.contains('done')) return;
    if (+b.dataset.k === next) {
      next += 1;
      b.classList.add('done');
      b.querySelector('i').textContent = next;
      box.classList.toggle('all', next === PICS.length);
    } else {
      b.classList.remove('nope');
      void b.offsetWidth; // 重新触发抖动
      b.classList.add('nope');
    }
  });
}
initPics(); // 顶层生成：图片 data-bg 交给 deck.js 按需加载

function initCells() {
  document.addEventListener('click', (e) => {
    const cell = e.target.closest('.cell');
    if (cell) cell.classList.toggle('open');
  });
}

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, picks: PICKS });
    buildBees();
    placeBees(0);
    initCells();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.querySelector('#bees')) placeBees(step);
  },
};
