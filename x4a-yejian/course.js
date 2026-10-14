'use strict';
/* 夜间飞行的秘密 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，提问清单见 qlist.js，翻页引擎见 ../shared/deck.js
 * 本课专属：三次实验（蝙蝠沿路线飞，乱撞时铃铛响）、超声波探路图、蝙蝠—雷达对照、探路步骤排一排。
 */

/* ================= 三次实验 ================= */
const ROPES = [
  { x: 200, y1: 20, y2: 250 }, { x: 400, y1: 20, y2: 250 }, { x: 600, y1: 20, y2: 250 },
  { x: 300, y1: 400, y2: 170 }, { x: 500, y1: 400, y2: 170 },
];
const PATHS = {
  smooth: 'M40 330 L170 330 C230 330 250 90 300 90 C350 90 350 330 400 330 C450 330 450 90 500 90 C550 90 550 330 600 330 C650 330 700 200 770 200',
  crash: 'M40 330 L200 180 L150 80 L300 230 L260 380 L400 120 L360 300 L500 260 L470 60 L600 200 L560 360 L700 150 L770 250',
};
const XP = {
  eye: { path: 'smooth', res: '一根也没碰着，铃铛一个也没响', msg: '眼睛蒙上了，照样飞得好好的！' },
  ear: { path: 'crash', res: '到处乱撞，铃铛响个不停', msg: '耳朵塞上了，像没头苍蝇一样乱撞！' },
  mouth: { path: 'crash', res: '到处乱撞，铃铛响个不停', msg: '嘴封住了，也到处乱撞！' },
};
const FLY_MS = 3200;

function drawRopes() {
  document.getElementById('xpRopes').innerHTML = ROPES.map((r, i) => {
    const bells = [r.y2, (r.y1 + r.y2) / 2].map((y, k) => `<g class="bell" style="--d:${(i * 2 + k) * 0.07}s"><path d="M${r.x - 9} ${y + 10} Q${r.x - 9} ${y - 6} ${r.x} ${y - 6} Q${r.x + 9} ${y - 6} ${r.x + 9} ${y + 10} Z"/><circle cx="${r.x}" cy="${y + 12}" r="3"/></g>`).join('');
    return `<line x1="${r.x}" y1="${r.y1}" x2="${r.x}" y2="${r.y2}"/>${bells}`;
  }).join('');
}
drawRopes();

function initExperiment() {
  const svg = document.getElementById('xpSvg');
  const bat = document.getElementById('xpBat');
  const trail = document.getElementById('xpTrail');
  const msg = document.getElementById('xpMsg');
  const probe = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  bat.setAttribute('transform', 'translate(40 330)');
  let timer = 0;
  document.getElementById('xpBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('.xp-btn');
    if (!btn) return;
    const xp = XP[btn.dataset.x];
    cancelAnimationFrame(timer);
    document.querySelectorAll('.xp-btn').forEach((b) => b.classList.toggle('cur', b === btn));
    probe.setAttribute('d', PATHS[xp.path]);
    trail.setAttribute('d', PATHS[xp.path]);
    trail.classList.toggle('crash', xp.path === 'crash');
    const len = probe.getTotalLength();
    svg.classList.remove('ringing');
    msg.textContent = '';
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / FLY_MS);
      const pt = probe.getPointAtLength(len * p);
      bat.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
      trail.style.strokeDashoffset = 1 - p;
      if (xp.path === 'crash' && p > 0.12) svg.classList.add('ringing');
      if (p < 1) { timer = requestAnimationFrame(tick); return; }
      msg.textContent = xp.msg;
      const cell = document.getElementById(`xr-${btn.dataset.x}`);
      cell.textContent = xp.res;
      cell.parentElement.classList.add(xp.path);
    };
    timer = requestAnimationFrame(tick);
  });
}

/* ================= 我是讲解员：蝙蝠 / 雷达 提词卡切换 ================= */
function initTell() {
  const tabs = document.getElementById('tellTabs');
  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('[data-m]');
    if (!b) return;
    tabs.querySelectorAll('button').forEach((x) => x.classList.toggle('cur', x === b));
    document.getElementById('tellCards').classList.toggle('radar-on', b.dataset.m === 'radar');
  });
}

/* ================= 问题清单（k 是参考分类） ================= */
const CATS = [
  { k: 'nr', name: '针对内容', tip: '写了什么？是什么？' },
  { k: 'xf', name: '针对写法', tip: '为什么这样写？' },
  { k: 'qs', name: '得到启示', tip: '联系生活想一想' },
];
const QLISTS = {
  yejian: {
    cats: CATS,
    items: [
      { q: '无线电波跟超声波是一样的吗？', k: 'nr' },
      { q: '为什么课文没有具体写后两次实验？', k: 'xf' },
      { q: '飞蛾、萤火虫、猫头鹰，它们在夜间活动也是靠超声波吗？', k: 'qs' },
      { q: '蝙蝠是怎样用嘴和耳朵配合探路的？', k: 'nr' },
      { q: '课文写的是蝙蝠，为什么开头要先写飞机夜航？', k: 'xf' },
      { q: '超声波在生活中还有什么用途呢？', k: 'qs' },
    ],
  },
  jing: {
    cats: CATS,
    placeholder: '读了片段，写下你的问题，按回车加入',
    items: [
      { q: '为什么说马铃薯和藕不是根，而是茎？', k: 'nr' },
      { q: '作者为什么用“肥肥胖胖”“圆头圆脑”这样的词？', k: 'xf' },
      { q: '我们常吃的菜里，还有哪些是变态茎？', k: 'qs' },
    ],
  },
};

window.LESSON = {
  init() {
    Narrative.init({});
    QList.init(QLISTS);
    initExperiment();
    initTell();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
