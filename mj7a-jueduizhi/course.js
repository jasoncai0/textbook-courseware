'use strict';
/* 七上 2.4 绝对值与相反数 · 本课互动：图 2-9 量距离、到原点距离为 k 的点、对折数轴（核心）、两个正数 / 负数比大小。
 * 通用部分见 ../shared/math.js、numline.js；所有位置按数值精确计算。 */
const { fmt, slider } = MathKit;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const boards = [];
const keep = (b) => { boards.push(b); return b; };
const minus = NumLine.minus;
const NO_SEG = [[0, -9], [0, -9]];

/* 测量线：从 a 到 b，画在高度 y 处，两端竖线 + 中间标长度 */
function measure(b, ab, y, label, cls = 'meas') {
  const get = () => { const v = typeof ab === 'function' ? ab() : ab; return v; };
  b.seg(() => { const v = get(); return v ? [[v[0], y], [v[1], y]] : NO_SEG; }, { cls });
  b.seg(() => { const v = get(); return v ? [[v[0], y - 0.15], [v[0], y + 0.15]] : NO_SEG; }, { cls });
  b.seg(() => { const v = get(); return v ? [[v[1], y - 0.15], [v[1], y + 0.15]] : NO_SEG; }, { cls });
  b.text(() => { const v = get(); return v && Math.abs(v[1] - v[0]) > 1e-9 ? [(v[0] + v[1]) / 2, y] : null; }, label, { cls: 'nl-or', dy: -8 });
}

function axisWith(id, { from = -5, to = 5, pts, y, minor }) {
  const b = keep(NumLine.board($(id), { from, to, y }));
  NumLine.axis(b, { from, to, minor });
  pts.forEach(([v, name, cls]) => { b.pt([v, 0], { r: 6, cls: cls || '' }); b.text([v, 0], name, { cls: 'nl-lb', dy: -14 }); });
  return b;
}

/* ---------- 第 3 页：图 2-9 ---------- */
function initF29() {
  const s = { t: 0 };
  const b = axisWith('f29', { pts: [[-3, 'A'], [0, 'O'], [2, 'B']], y: [-1.1, 2.1] });
  b.text([-3, 0], '小明家', { cls: 'nl-val', dy: 48 });
  b.text([0, 0], '学校', { cls: 'nl-val', dy: 48 });
  b.text([2, 0], '小丽家', { cls: 'nl-val', dy: 48 });
  measure(b, () => (s.t ? [0, -3 * s.t] : null), 1.05, () => (s.t > 0.99 ? '3' : ''));
  measure(b, () => (s.t ? [0, 2 * s.t] : null), 1.05, () => (s.t > 0.99 ? '2' : ''));
  $('f29Btn').addEventListener('click', () => {
    const t0 = performance.now();
    const tick = (now) => { s.t = Math.min(1, (now - t0) / 1200); b.update(); if (s.t < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
}

/* ---------- 第 6 页：到原点距离为 k 的点 ---------- */
function initK() {
  const s = { k: 2.5 };
  const b = keep(NumLine.board($('kBoard'), { from: -5, to: 5, y: [-1.1, 2.1] }));
  NumLine.axis(b, { from: -5, to: 5, minor: 0.5 });
  measure(b, () => [0, s.k], 1.05, () => fmt(s.k));
  measure(b, () => [0, -s.k], 1.05, () => fmt(s.k));
  b.pt(() => [s.k, 0], { r: 8, cls: 'c2' });
  b.pt(() => [-s.k, 0], { r: 8, cls: 'c1', show: () => s.k > 0 });
  b.text(() => [s.k, 0], () => (s.k ? 'A' : 'O'), { cls: 'nl-lb', dy: -14 });
  b.text(() => (s.k ? [-s.k, 0] : null), 'B', { cls: 'nl-lb', dy: -14 });
  b.onUpdate = () => {
    const k = s.k;
    $('kV').textContent = k === 2.5 ? '2.5（即 5/2）' : fmt(k);
    $('kMsg').className = 'tip feedback fb-ok';
    $('kMsg').innerHTML = k === 0
      ? '到原点的距离是 0 的点只有原点：绝对值是 0 的数只有 0。'
      : `到原点的距离是 ${fmt(k)} 的点有 <b>2</b> 个：表示 ${fmt(k)} 和 ${minus(-k)}。即 |${fmt(k)}| = |${minus(-k)}| = ${fmt(k)}。`;
  };
  slider($('kS'), (v) => { s.k = v; b.update(); });
}

/* ---------- 第 8 页：对折数轴（核心）----------
 * 左半部分绕原点处的竖直折痕翻转：转过角 πt 时，左边的点 x（x < 0）投影到 x·cos(πt)；t = 1 时落到 −x。
 * 翻过来的一层抬高 LIFT·t，只为看清两层，不改变横向位置。 */
const LIFT = 0.55;
function initFold() {
  const s = { t: 0, p: 3, busy: false };
  const b = keep(NumLine.board($('fold'), { from: -5, to: 5, y: [-1.2, 2.2], h: 170 }));
  const L = (x) => x * Math.cos(Math.PI * s.t); // 左半部分的横坐标
  const ly = () => LIFT * Math.sin(Math.PI * s.t / 2) * (s.t > 0 ? 1 : 0);
  // 右半部分（不动）
  b.seg([[0, 0], [5.7, 0]], { cls: 'nl-ax' });
  const ax = 16 / (b.X(1) - b.X(0));
  const ay = 7 / (b.Y(0) - b.Y(1));
  b.poly([[5.7 + ax * 0.3, 0], [5.7 - ax * 0.7, ay], [5.7 - ax * 0.7, -ay]], { cls: 'nl-arrow' });
  for (let v = 0; v <= 5; v++) { b.seg([[v, -0.16], [v, 0.16]], { cls: v ? 'nl-tick' : 'nl-zero' }); b.text([v, 0], minus(v), { cls: 'nl-num', dy: 26 }); }
  // 左半部分（翻折）
  b.seg(() => [[L(-5.4), ly()], [0, ly()]], { cls: 'nl-ax left' });
  for (let v = -5; v < 0; v++) {
    b.seg(() => [[L(v), ly() - 0.16], [L(v), ly() + 0.16]], { cls: 'nl-tick left' });
    b.text(() => [L(v), ly() + (s.t > 0.5 ? 0.3 : -0.52)], minus(v), { cls: 'nl-num left', dy: 6 });
  }
  b.seg([[0, -0.5], [0, 1.6]], { cls: 'crease' });
  // 选中的点与它的相反数
  const P = () => s.p;
  const Q = () => -s.p;
  const at = (x) => (x < 0 ? [L(x), ly()] : [x, 0]);
  b.pt(() => at(Q()), { r: 8, cls: 'c1', show: () => s.p !== 0 });
  b.text(() => (s.p !== 0 ? at(Q()) : null), () => minus(Q()), { cls: 'nl-val', dy: -18 });
  b.drag(() => at(P()), (x) => {
    if (s.t > 0) return; // 折叠时不拖动
    s.p = Math.round(clamp(x, -5, 5) * 2) / 2;
    $('foldP').value = s.p;
  });
  b.text(() => at(P()), () => minus(P()), { cls: 'nl-or', dy: -18 });
  b.onUpdate = () => {
    $('foldPV').textContent = minus(s.p);
    const msg = $('foldMsg');
    const a = Math.abs(s.p);
    if (s.p === 0) {
      msg.className = 'tip feedback fb-ok';
      msg.innerHTML = '0 的相反数是 0：原点在折痕上，对折后还是它自己。';
    } else if (s.t > 0.999) {
      msg.className = 'tip feedback fb-ok';
      msg.innerHTML = `对折后，表示 ${minus(s.p)} 和 ${minus(-s.p)} 的两个点<b>重合</b>：它们到原点的距离都是 ${fmt(a)}，只是在原点的两侧。`;
    } else {
      msg.className = 'tip feedback';
      msg.innerHTML = `${minus(s.p)} 的相反数是 ${minus(-s.p)}：符号不同，绝对值都是 ${fmt(a)}。点“沿原点对折”看看它们会不会重合。`;
    }
    $('foldBtn').textContent = s.t > 0.5 ? '展开' : '沿原点对折';
  };
  slider($('foldP'), (v) => { if (s.t === 0) { s.p = v; b.update(); } });
  $('foldBtn').addEventListener('click', () => {
    if (s.busy) return;
    s.busy = true;
    const [from, to] = s.t > 0.5 ? [1, 0] : [0, 1];
    const t0 = performance.now();
    const tick = (now) => {
      const u = Math.min(1, (now - t0) / 1600);
      const e = u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2;
      s.t = from + (to - from) * e;
      b.update();
      if (u < 1) requestAnimationFrame(tick); else s.busy = false;
    };
    requestAnimationFrame(tick);
  });
}

/* ---------- 第 12 页：两个正数 / 两个负数 ---------- */
function initCmp() {
  const s = { sg: 1 };
  const b = keep(NumLine.board($('cmpBoard'), { from: -6, to: 6, y: [-1.1, 2.4] }));
  NumLine.axis(b, { from: -6, to: 6 });
  measure(b, () => [0, 5 * s.sg], 1.5, '5');
  measure(b, () => [0, 3 * s.sg], 0.85, '3', 'meas2');
  b.pt(() => [5 * s.sg, 0], { r: 7, cls: 'c2' });
  b.pt(() => [3 * s.sg, 0], { r: 7, cls: 'c1' });
  b.onUpdate = () => {
    const msg = $('cmpMsg');
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = s.sg > 0
      ? '|5| = 5 &gt; |3| = 3，表示 5 的点在表示 3 的点的<b>右边</b>：5 &gt; 3。'
      : '|−5| = 5 &gt; |−3| = 3，但表示 −5 的点在表示 −3 的点的<b>左边</b>：−5 &lt; −3。';
    $('cmpBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', +x.dataset.s === s.sg));
  };
  $('cmpBtns').addEventListener('click', (e) => { const v = e.target.closest('[data-s]')?.dataset.s; if (v) { s.sg = +v; b.update(); } });
}

window.LESSON = {
  init() {
    initF29();
    axisWith('f210', { pts: [[-5, 'A'], [-3.5, 'B'], [1, 'C'], [2.5, 'D'], [5, 'E']] });
    const b211 = axisWith('f211', { pts: [[4, 'A'], [-3.5, 'B']], y: [-1.1, 2.1] });
    measure(b211, [0, -3.5], 1.05, '3.5');
    measure(b211, [0, 4], 1.05, '4');
    initK();
    axisWith('f213', { pts: [[-5, 'A'], [5, 'B']] });
    initFold();
    initCmp();
  },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
