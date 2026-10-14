'use strict';
/* 金色的草地 · 本课逻辑。故事页 / 翻卡片 / 小练笔用 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

const NS = 'http://www.w3.org/2000/svg';
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgb = (c) => `rgb(${c.join(',')})`;

/* ================= 时间滑块：一天里草地的颜色 ================= */
const HOUR_START = 6;
const HOUR_END = 19;
const OPEN_FROM = 8; // 8 点开始张开，10 点全开
const CLOSE_FROM = 15; // 15 点开始合拢，17 点合上
const OPEN_SPAN = 2;
const PLAY_MS = 9000;
const FLOWER_COUNT = 46;

const hourOf = (t) => HOUR_START + (HOUR_END - HOUR_START) * t / 100;
const openness = (h) => clamp01((h - OPEN_FROM) / OPEN_SPAN) * clamp01((CLOSE_FROM + OPEN_SPAN - h) / OPEN_SPAN);
function timeName(h) {
  if (h < 8) return '早上';
  if (h < 11) return '上午';
  if (h < 14) return '中午';
  if (h < 17) return '下午';
  return '傍晚';
}
function bandOf(h) {
  if (h < 8) return 'morning';
  if (h >= 11 && h < 14) return 'noon';
  if (h >= 17) return 'evening';
  return '';
}

function buildMeadow(svg) {
  // 用固定的伪随机，保证每次打开花的位置一样
  let seed = 7;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const flowers = Array.from({ length: FLOWER_COUNT }, () => {
    const y = 205 + rnd() * 165;
    return { x: 10 + rnd() * 620, y, s: 1 + (y - 205) / 165 * 1.2 };
  }).sort((a, b) => a.y - b.y);
  const petals = Array.from({ length: 12 }, (_, i) => `<ellipse cx="0" cy="-8" rx="3" ry="8" transform="rotate(${i * 30})"/>`).join('');
  svg.innerHTML = `
    <rect class="sky" width="640" height="210"/>
    <circle class="sun" r="24" fill="#ffd34d"/>
    <path d="M0 170 Q160 120 320 160 T640 150 V215 H0 Z" fill="#8fb58a" opacity=".7"/>
    <rect class="grass" y="200" width="640" height="180"/>
    <rect class="gold-wash" y="200" width="640" height="180" fill="#f0c020"/>
    <g class="flowers">${flowers.map((f) => `<g transform="translate(${f.x.toFixed(0)} ${f.y.toFixed(0)}) scale(${f.s.toFixed(2)})">
      <path d="M0 0 V22" stroke="#4f8f3a" stroke-width="2.5"/>
      <g class="fp" fill="#f2c230">${petals}<circle r="4" fill="#e0a010"/></g>
      <ellipse class="fb" cx="0" cy="-6" rx="4.5" ry="8" fill="#9fd36a" stroke="#3e6e2a" stroke-width="1"/></g>`).join('')}</g>
    <g class="clock"><rect x="14" y="14" width="150" height="46" rx="23" fill="rgba(255,255,255,.85)"/><text class="t-l clock-t" x="89" y="45" text-anchor="middle" fill="#3f6b22"></text></g>`;
  return {
    sky: svg.querySelector('.sky'), sun: svg.querySelector('.sun'), grass: svg.querySelector('.grass'),
    wash: svg.querySelector('.gold-wash'), fp: [...svg.querySelectorAll('.fp')], fb: [...svg.querySelectorAll('.fb')],
    clock: svg.querySelector('.clock-t'),
  };
}

function initDay() {
  const parts = buildMeadow(document.getElementById('meadow'));
  const range = document.getElementById('dayTime');
  const fills = [...document.querySelectorAll('.fill')];
  const set = (t) => {
    range.value = t;
    const h = hourOf(t);
    const o = openness(h);
    const p = (h - HOUR_START) / (HOUR_END - HOUR_START);
    const dusk = clamp01((h - 16) / 3);
    const dawn = clamp01((8 - h) / 3);
    parts.sky.setAttribute('fill', rgb(mix(mix([150, 200, 235], [246, 196, 150], dusk), [222, 214, 238], dawn)));
    parts.sun.setAttribute('cx', (40 + 560 * p).toFixed(0));
    parts.sun.setAttribute('cy', (190 - Math.sin(p * Math.PI) * 160).toFixed(0));
    parts.grass.setAttribute('fill', rgb(mix([88, 150, 70], [70, 120, 60], dusk + dawn * .5)));
    parts.wash.setAttribute('opacity', (o * .55).toFixed(2));
    const s = (.15 + .85 * o).toFixed(2);
    parts.fp.forEach((g) => { g.setAttribute('transform', `scale(${s})`); });
    parts.fb.forEach((b) => { b.setAttribute('opacity', (1 - o).toFixed(2)); });
    parts.clock.textContent = `${timeName(h)} ${Math.floor(h)} 点`;
    const band = bandOf(h);
    fills.forEach((f) => {
      const hit = f.dataset.at === band;
      f.classList.toggle('now', hit);
      if (hit) f.classList.add('shown');
    });
  };
  let raf = 0;
  const btn = document.getElementById('dayPlay');
  const stop = () => { cancelAnimationFrame(raf); raf = 0; btn.textContent = '▶ 过一天'; };
  btn.addEventListener('click', () => {
    if (raf) { stop(); return; }
    const from = +range.value >= 100 ? 0 : +range.value;
    const t0 = performance.now() - from / 100 * PLAY_MS;
    btn.textContent = '❚❚ 暂停';
    const tick = (now) => {
      const t = Math.min(100, (now - t0) / PLAY_MS * 100);
      set(t);
      if (t < 100) raf = requestAnimationFrame(tick); else stop();
    };
    raf = requestAnimationFrame(tick);
  });
  range.addEventListener('input', () => { stop(); set(+range.value); });
  document.querySelectorAll('.day-ctrl [data-t]').forEach((b) => b.addEventListener('click', () => { stop(); set(+b.dataset.t); }));
  set(0);
  return stop;
}

/* ================= 手掌和花：张开、合上 ================= */
const HAND_SAY = {
  open: '张开：金色的花瓣露出来，草地是金色的。',
  closed: '合上：金色的花瓣被包住了，草地就变成绿色的了。',
};
function initHand() {
  const svg = document.getElementById('handFlower');
  svg.querySelector('.petals').innerHTML = Array.from({ length: 16 }, (_, i) =>
    `<ellipse cx="0" cy="70" rx="10" ry="40" fill="${i % 2 ? '#f2c230' : '#e8b020'}" transform="rotate(${i * 22.5} 0 110)"/>`).join('') +
    '<circle cx="0" cy="110" r="16" fill="#e0a010"/>';
  const btn = document.getElementById('handToggle');
  btn.addEventListener('click', () => {
    const open = svg.classList.toggle('open');
    btn.textContent = open ? '合上' : '张开';
    document.getElementById('handSay').textContent = open ? HAND_SAY.open : HAND_SAY.closed;
  });
}

/* ================= 课后第 3 题：翻卡片 ================= */
/* 课后第 3 题：观察三步卡（发现变化 → 问为什么 → 仔细观察） */
const OBS = [
  { name: '向日葵', find: '早上，花盘朝着东边；傍晚，花盘朝着西边。', ask: '它怎么会“扭头”呢？', see: '一天里看了好几次，原来花盘跟着太阳慢慢转。（课本）' },
  { name: '含羞草', find: '手指轻轻一碰，叶子就合起来，低下了头。', ask: '它真的会“害羞”吗？', see: '等一会儿再看，合上的叶子又慢慢张开了。（课本）' },
  { name: '牵牛花', find: '清晨开得像一个个小喇叭，中午却卷起来了。', ask: '这是为什么呢？', see: '早上、中午都去看，原来太阳一晒，花就慢慢合上了。' },
  { name: '天上的月亮', find: '有时弯弯的像小船，有时圆圆的像玉盘。', ask: '月亮怎么会变样子？', see: '一连好些天，每晚都看一看，月亮一天比一天变化一点。' },
];
const OBS_STEPS = [['find', '我发现'], ['ask', '我想问'], ['see', '仔细观察']];

function initObs() {
  const tabs = document.getElementById('obsTabs');
  const card = document.getElementById('obsCard');
  if (!tabs || !card) return;
  const show = (i) => {
    const o = OBS[i];
    tabs.querySelectorAll('.btn').forEach((b, k) => b.classList.toggle('solid', k === i));
    card.innerHTML = `<h3>${o.name}</h3>` + OBS_STEPS.map(([k, label], n) =>
      `<div class="obs-row" style="animation-delay:${n * 0.7}s"><b>${n + 1}　${label}</b><p>${o[k]}</p></div>`).join('');
  };
  tabs.innerHTML = OBS.map((o, i) => `<button class="btn" type="button" data-i="${i}">${o.name}</button>`).join('');
  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-i]');
    if (btn) show(+btn.dataset.i);
  });
  show(0);
}

/* ================= 小练笔 ================= */
const MOMENTS = [
  {
    name: '一种植物', pic: 'huaduo',
    prompt: '你留意过哪种植物的变化？写一写它怎样变，为什么会这样。',
    hint: '可以写含羞草、向日葵、豆芽、牵牛花……先写看到的变化，再写仔细观察后的发现。',
    example: '奶奶家的牵牛花，早上开得像一个个紫色的小喇叭。中午我再去看，花却都卷起来了。原来，牵牛花怕晒，太阳一大，它就把花合上了。',
  },
  {
    name: '一天里的变化', pic: 'zaochen',
    prompt: '早上、中午、傍晚各看一次同一样东西，写下你的发现。',
    hint: '学课文的写法：早上……中午……傍晚……，最后写“这是为什么呢？”和你找到的答案。',
    example: '早上，操场上旗杆的影子长长的，伸向西边；中午，影子变得短短的，缩在旗杆脚下；傍晚，影子又变长了，朝着东边。原来，影子会跟着太阳走。',
  },
];

/* ================= 接入通用引擎（../shared/deck.js） ================= */
let stopDay = () => {};
window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initObs();
    stopDay = initDay();
    initHand();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (!slide.classList.contains('s-day')) stopDay();
  },
};
