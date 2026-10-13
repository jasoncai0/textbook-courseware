'use strict';
/* 圆明园的毁灭 · 本课数据与示意图。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* ---------- 布局示意：东、西、南三面的小园（众星拱月） ---------- */
const SMALL_GARDENS = [[30, 140], [30, 200], [30, 260], [95, 335], [150, 340], [210, 335], [265, 340], [540, 150], [540, 210], [520, 300]];
document.getElementById('smallGardens').innerHTML = SMALL_GARDENS.map(([x, y], i) =>
  `<circle class="pop" style="animation-delay:${(i * 0.1).toFixed(1)}s" cx="${x}" cy="${y}" r="11" fill="#f3d77a" stroke="#b8933a" stroke-width="2"/>`).join('');

/* ---------- 课后第 3 题 · 时间轴：按真实年代比例（公元前用负数） ---------- */
const AXIS = { from: -1700, to: 1900, x0: 30, x1: 780 };
const yx = (year) => AXIS.x0 + (year - AXIS.from) / (AXIS.to - AXIS.from) * (AXIS.x1 - AXIS.x0);
const XIANQIN = [-1600, -221];
const DYNASTIES = [['唐', 618, 907], ['宋', 960, 1279], ['元', 1271, 1368], ['明', 1368, 1644], ['清', 1644, 1860]];
const DYN_COLORS = ['#c9683a', '#b85a32', '#a64e2b', '#954325', '#843a20'];
const FIRE_YEAR = 1860;
function buildTimeAxis() {
  const $ = (id) => document.getElementById(id);
  const set = (el, attrs) => Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, typeof v === 'number' ? v.toFixed(1) : v));
  const TICKS = [-1500, -1000, -500, 0, 500, 1000, 1500];
  $('axisTicks').innerHTML = TICKS.map((y) => `<line x1="${yx(y).toFixed(1)}" x2="${yx(y).toFixed(1)}" y1="114" y2="126" stroke="#8a7a62" stroke-width="2"/>`
    + `<text class="t-s t-c" x="${yx(y).toFixed(1)}" y="142" fill="#8a7a62">${y < 0 ? `公元前${-y}年` : y === 0 ? '公元元年' : `${y}年`}</text>`).join('');
  set($('barXianqin'), { x: yx(XIANQIN[0]), width: yx(XIANQIN[1]) - yx(XIANQIN[0]) });
  set($('txXianqin'), { x: (yx(XIANQIN[0]) + yx(XIANQIN[1])) / 2 });
  $('dynBars').innerHTML = DYNASTIES.map(([name, a, b], i) => `<rect x="${yx(a).toFixed(1)}" y="96" width="${(yx(b) - yx(a)).toFixed(1)}" height="24" fill="${DYN_COLORS[i]}"/>`
    + `<text class="t-s t-c" x="${((yx(a) + yx(b)) / 2).toFixed(1)}" y="113" fill="#fff">${name}</text>`).join('');
  set($('txDyn'), { x: (yx(DYNASTIES[0][1]) + yx(FIRE_YEAR)) / 2 });
  const [l, r] = [yx(XIANQIN[0]), yx(FIRE_YEAR)];
  $('brace').setAttribute('d', `M${l} 150 q0 12 12 12 H${(l + r) / 2 - 10} q10 0 10 10 q0 -10 10 -10 H${r - 12} q12 0 12 -12`);
  set($('txSpan'), { x: (l + r) / 2 });
  set($('fireLine'), { x1: r, x2: r });
  set($('txFire'), { x: r + 6 });
}
buildTimeAxis();

/* ---------- 课后第 3 题 · 日历：10 月 6 日—20 日 ---------- */
const CAL = { first: 6, last: 20, robFrom: 7, fireFrom: 18, fireTo: 20 };
const dayStep = (d) => (d === CAL.first ? 1 : d < CAL.fireFrom ? 2 : 3);
const dayKind = (d) => (d === CAL.first ? 'in' : d < CAL.fireFrom ? 'rob' : 'fire');
const DAY_NOTE = { 6: '闯进', 18: '放火', 19: '放火', 20: '大火' };
document.getElementById('cal').innerHTML = Array.from({ length: CAL.last - CAL.first + 1 }, (_, i) => {
  const d = CAL.first + i;
  return `<div class="day"><i class="fill ${dayKind(d)}" data-step="${dayStep(d)}"></i><b>${d}</b><small>${DAY_NOTE[d] || ''}</small></div>`;
}).join('');

/* ---------- 昔日 ⇄ 毁灭之后 滑块 ---------- */
function initCompare() {
  const range = document.getElementById('cmpRange');
  const now = document.querySelector('.cmp-now');
  const update = () => { now.style.clipPath = `inset(0 0 0 ${range.value}%)`; };
  range.addEventListener('input', update);
  update();
}

window.LESSON = {
  init() {
    Narrative.init({});
    initCompare();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
