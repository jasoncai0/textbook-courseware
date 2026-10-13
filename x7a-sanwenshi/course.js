'use strict';
/* 散文诗二首 · 本课数据与互动。画面、字幕见 ../shared/narrative.js */

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ================= 金色花：太阳沿弧线从早走到晚（与 SVG 里的虚线弧一致） ================= */
const ARC = { x0: 40, x1: 480, y0: 210, cy: -30 };
function sunAt(t) {
  const x = ARC.x0 + (ARC.x1 - ARC.x0) * t;
  const y = (1 - t) ** 2 * ARC.y0 + 2 * (1 - t) * t * ARC.cy + t ** 2 * ARC.y0;
  return [x, y];
}
const SUN_T = [0.04, 0.16, 0.5, 0.84, 0.97, 0.97];
function updateSun(slide, step) {
  const pos = slide.querySelector('#sunPos');
  if (!pos) return;
  const [x, y] = sunAt(SUN_T[Math.min(step, SUN_T.length - 1)]);
  pos.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
}

/* ================= 意象卡：连一连 ================= */
const PAIRS = [
  { thing: '金色花', mean: '变成花的孩子“我”', poem: '金色花' },
  { thing: '花香、影子', mean: '孩子悄悄的陪伴', poem: '金色花' },
  { thing: '红莲', mean: '“我”（三蒂莲应了花瑞）', poem: '荷叶·母亲' },
  { thing: '荷叶', mean: '母亲', poem: '荷叶·母亲' },
  { thing: '雨点', mean: '人生的风雨、挫折和烦恼', poem: '荷叶·母亲' },
];
const MEAN_ORDER = [3, 0, 4, 1, 2]; // 下排打乱顺序
function initYx() {
  const things = document.getElementById('yxThings');
  const means = document.getElementById('yxMeans');
  let picked = null;
  things.innerHTML = PAIRS.map((p, i) => `<button type="button" class="yx-card thing" data-i="${i}"><small>${p.poem}</small>${esc(p.thing)}</button>`).join('');
  means.innerHTML = MEAN_ORDER.map((i) => `<button type="button" class="yx-card mean" data-i="${i}">${esc(PAIRS[i].mean)}</button>`).join('');
  const done = () => {
    const n = things.querySelectorAll('.matched').length;
    document.getElementById('yxDone').textContent = n === PAIRS.length ? '全部连对！物象是“桥”：借物写人，情感就有了看得见的样子。' : `已连对 ${n} / ${PAIRS.length}`;
  };
  things.addEventListener('click', (e) => {
    const b = e.target.closest('.thing');
    if (!b || b.classList.contains('matched')) return;
    picked = b;
    things.querySelectorAll('.thing').forEach((x) => x.classList.toggle('picked', x === b));
  });
  means.addEventListener('click', (e) => {
    const b = e.target.closest('.mean');
    if (!b || b.classList.contains('matched') || !picked) return;
    if (b.dataset.i === picked.dataset.i) {
      const color = `c${b.dataset.i}`;
      [b, picked].forEach((x) => x.classList.add('matched', color));
      picked.classList.remove('picked');
      picked = null;
      done();
    } else {
      b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong');
    }
  });
}

/* ================= 投票（只在本机显示） ================= */
function initVote() {
  const counts = [0, 0];
  const names = ['金色花', '荷叶·母亲'];
  document.querySelector('.vote').addEventListener('click', (e) => {
    const b = e.target.closest('[data-v]');
    if (!b) return;
    counts[+b.dataset.v] += 1;
    document.getElementById('voteOut').textContent = names.map((n, i) => `${n} ${counts[i]} 票`).join('　');
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    initYx();
    initVote();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateSun(slide, step);
  },
};
