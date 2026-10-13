'use strict';
/* 祖国啊，我亲爱的祖国 · 本课数据与互动：重音开关、意象墙（破旧→新生）、情感台阶、“我”的同心圆、品味诗句、意象接句 */

const svgNS = (tag, attrs, text) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  if (text) el.textContent = text;
  return el;
};

/* ---------- 意象墙：从左到右由暗到亮 ---------- */
const LAMP = '<svg viewBox="0 0 60 60"><path d="M18 40 h24 l-4 -16 h-16z"/><circle cx="30" cy="20" r="7"/><path class="ray" d="M30 6 v-4 M42 10 l3 -3 M18 10 l-3 -3"/></svg>';
const RICE = '<svg viewBox="0 0 60 60"><path class="ray" d="M30 56 C30 40 34 26 44 12"/><ellipse cx="44" cy="14" rx="2.6" ry="4" /><ellipse cx="39" cy="20" rx="2.6" ry="4"/><ellipse cx="36" cy="27" rx="2.6" ry="4"/><ellipse cx="47" cy="22" rx="2.6" ry="4"/></svg>';
const WALL = [
  { k: '老水车', pre: '河边上破旧的', pic: 'shuiche', line: '我是你河边上破旧的老水车，数百年来纺着疲惫的歌；', mean: '古老、落后、停滞不前' },
  { k: '矿灯', pre: '额上熏黑的', icon: LAMP, line: '我是你额上熏黑的矿灯，照你在历史的隧洞里蜗行摸索；', mean: '在黑暗里艰难、缓慢地探索' },
  { k: '稻穗', pre: '干瘪的', icon: RICE, line: '我是干瘪的稻穗；是失修的路基；', mean: '贫穷、荒废、民生凋敝' },
  { k: '花朵', pre: '“飞天”袖间', pic: 'feitian', line: '是“飞天”袖间千百年来未落到地面的花朵；', mean: '美好却始终没有实现的希望' },
  { k: '胚芽', pre: '雪被下古莲的', pic: 'peiya', line: '我是你雪被下古莲的胚芽；', mean: '沉睡千年后复苏的生命力' },
  { k: '起跑线', pre: '新刷出的雪白的', pic: 'liming', line: '我是新刷出的雪白的起跑线；', mean: '崭新的起点，蓄势待发' },
];

function buildWall() {
  const box = document.getElementById('wall');
  box.innerHTML = WALL.map((w, i) => `<button type="button" class="wt" data-step="${i + 1}" style="--lv:${i / (WALL.length - 1)}">
    ${w.pic ? `<span class="wt-pic" data-bg="assets/${w.pic}.jpg"></span>` : `<span class="wt-icon">${w.icon}</span>`}
    <span class="wt-front"><em>${w.pre}</em><b>${w.k}</b></span>
    <span class="wt-back"><q>${w.line}</q><i>${w.mean}</i></span></button>`).join('');
}
buildWall();

/* ---------- 情感台阶 ---------- */
const STAIRS = [
  { t: '第一节', feel: '沉痛', h: 26, img: '老水车 · 矿灯 · 稻穗 · 路基 · 驳船', d: '历史上祖国贫困落后、步履艰难，“我”与之同悲。“——祖国啊！”像一声沉重的叹息。' },
  { t: '第二节', feel: '悲怆中有盼望', h: 46, img: '贫困 · 悲哀 · 飞天袖间的花朵', d: '贫困、悲哀之中，祖祖辈辈仍怀着希望，只是这希望千百年来“未落到地面”。' },
  { t: '第三节', feel: '欣喜', h: 72, img: '理想 · 胚芽 · 笑涡 · 起跑线 · 黎明', d: '挣脱束缚，祖国迎来新生：胚芽破土，笑中带泪，站上起跑线，黎明正在喷薄。' },
  { t: '第四节', feel: '激昂 · 献身', h: 96, img: '十亿分之一 · 总和 · 血肉之躯', d: '“我”与祖国血肉相连，愿以自己的血肉之躯换取祖国的富饶、荣光和自由。' },
];

function buildStairs() {
  document.getElementById('stairs').innerHTML = STAIRS.map((s, i) => `<button type="button" class="stair" data-step="${i + 1}" data-i="${i}" style="height:${s.h}%"><b>${s.feel}</b><small>${s.t}</small></button>`).join('');
}
buildStairs();

function initStairs() {
  const info = document.getElementById('stairInfo');
  document.getElementById('stairs').addEventListener('click', (e) => {
    const b = e.target.closest('.stair');
    if (!b) return;
    document.querySelectorAll('.stair').forEach((x) => x.classList.toggle('sel', x === b));
    const s = STAIRS[+b.dataset.i];
    info.innerHTML = `<b>${s.t} · ${s.feel}</b><br><span class="yw">意象：${s.img}</span><br>${s.d}`;
  });
}

/* ---------- “我”的同心圆：由内到外 ---------- */
const RINGS = [
  { r: 58, t: '诗人自己', d: '舒婷本人：经历过迷惘与思索的一个普通人。' },
  { r: 106, t: '一代青年', d: '“迷惘的我、深思的我、沸腾的我”——经历了苦难、在反思中觉醒、终于沸腾起来的一代青年。' },
  { r: 152, t: '十亿人民', d: '“我是你的十亿分之一”——每个中国人都是这个“我”。' },
  { r: 192, t: '祖国', d: '“是你九百六十万平方的总和”——千千万万个“我”合起来，就是祖国本身。' },
];

function buildRings() {
  const svg = document.getElementById('rings');
  [...RINGS].reverse().forEach((ring, k) => {
    const i = RINGS.length - 1 - k;
    const g = svgNS('g', { class: `ring r${i}`, 'data-step': i + 1, 'data-i': i });
    g.appendChild(svgNS('circle', { cx: 260, cy: 200, r: ring.r }));
    g.appendChild(svgNS('text', { class: 'ring-t t-c', x: 260, y: i === 0 ? 208 : 200 - ring.r + 30 }, ring.t));
    svg.appendChild(g);
  });
}
buildRings();

function initRings() {
  const info = document.getElementById('ringInfo');
  document.getElementById('rings').addEventListener('click', (e) => {
    const g = e.target.closest('.ring');
    if (!g) return;
    document.querySelectorAll('#rings .ring').forEach((x) => x.classList.toggle('sel', x === g));
    const ring = RINGS[+g.dataset.i];
    info.innerHTML = `<b>${ring.t}</b><br>${ring.d}`;
  });
}

/* ---------- 品味诗句（思考探究三） ---------- */
const CLUES = [
  { q: '我是你河边上破旧的老水车 / 数百年来纺着疲惫的歌', a: '老水车转了几百年，仍是老样子：写祖国长期贫困落后、停滞不前；“疲惫的歌”是历代人民沉重的叹息。' },
  { q: '是“飞天”袖间 / 千百年来未落到地面的花朵', a: '飞天手中的花是美好的愿望，千百年“未落到地面”——人民的美好理想一直没能实现。' },
  { q: '我是你簇新的理想 / 刚从神话的蛛网里挣脱', a: '“神话的蛛网”指空想、迷信和种种束缚；“挣脱”写出新的理想冲破束缚、刚刚诞生。' },
  { q: '是绯红的黎明 / 正在喷薄', a: '黎明象征祖国的新生；“正在喷薄”是进行时——新生正在发生，充满蓬勃的力量。' },
];

/* ---------- 意象接句（积累拓展五） ---------- */
const FOLLOW = [
  { a: '我是干瘪的稻穗，', b: '；是失修的路基，', ref: ['在风里低垂着空空的头颅', '在荒草里断成一截一截'] },
  { a: '我是你雪被下古莲的胚芽，', ref: ['在千年的冻土下悄悄苏醒'] },
  { a: '我是你挂着眼泪的笑涡，', ref: ['盛满了重逢的喜悦'] },
  { a: '我是新刷出的雪白的起跑线，', ref: ['等待着第一声发令的枪响'] },
];

function buildFollow() {
  document.getElementById('follow').innerHTML = FOLLOW.map((f, i) => `<div class="fl-row">
    <p>${f.a}<input type="text" aria-label="下句" placeholder="接一句……">${f.b ? `${f.b}<input type="text" aria-label="下句" placeholder="接一句……">` : ''}</p>
    <button type="button" class="btn" data-i="${i}">参考</button>
    <small hidden>参考：${f.ref.join(' / ')}</small></div>`).join('');
}

function initFollow() {
  buildFollow();
  document.getElementById('follow').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-i]');
    if (btn) btn.parentElement.querySelector('small').hidden = false;
  });
}

function initStress() {
  document.querySelectorAll('.st-btn').forEach((btn) => btn.addEventListener('click', () => {
    const on = btn.closest('.slide').classList.toggle('show-st');
    btn.textContent = on ? '隐藏重音' : '标出重音';
  }));
}

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: ['读这一句', '含义'] });
    document.getElementById('wall').addEventListener('click', (e) => {
      const t = e.target.closest('.wt');
      if (t) t.classList.toggle('open');
    });
    initStairs();
    initRings();
    initFollow();
    initStress();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
