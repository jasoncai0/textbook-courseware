'use strict';
/* 七下 11.3 不等式的基本性质 · 本课互动：平移（性质 1）、做一做表格、上下数轴“乘法连线”（性质 2）。通用部分见 ../shared/math.js、numline.js */
const { board, slider, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const m = NumLine.minus;
const tn = (v) => String(+v.toFixed(2)); // TeX 里用普通减号
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const cmpTex = (x, y) => (x > y ? '\\gt ' : x < y ? '\\lt ' : '=');

/* 小箭头：从 p 到 q 的水平线段 + 箭头（箭头按像素定大小） */
function hArrow(b, p, q, cls) {
  b.seg(() => [p(), q()], { cls });
  b.poly(() => {
    const [x0] = p();
    const [x1, y] = q();
    const dir = Math.sign(x1 - x0);
    if (!dir) return [];
    const ax = 12 / (b.X(1) - b.X(0));
    const ay = 6 / (b.Y(0) - b.Y(1));
    return [[x1, y], [x1 - dir * ax, y + ay], [x1 - dir * ax, y - ay]];
  }, { cls: `${cls}-head` });
}

/* 第 3 页：两边都加 c = 两点同向平移 c */
function initShift() {
  let st = { a: 2, b: -1, c: 3 };
  const b = NumLine.board($('shiftB'), { from: -8, to: 8, y: [-1.1, 2.4], h: 190 });
  NumLine.axis(b, { from: -8, to: 8 });
  hArrow(b, () => [st.a, 1.5], () => [st.a + st.c, 1.5], 'ar1');
  hArrow(b, () => [st.b, 0.75], () => [st.b + st.c, 0.75], 'ar2');
  b.pt(() => [st.a + st.c, 0], { r: 6, cls: 'c1' });
  b.pt(() => [st.b + st.c, 0], { r: 6, cls: 'c2' });
  b.text(() => [st.a + st.c, 1.5], 'a+c', { cls: 'nl-val', dy: -10 });
  b.text(() => [st.b + st.c, 0.75], 'b+c', { cls: 'nl-or', dy: -10 });
  b.text(() => [st.a, 0], 'a', { cls: 'nl-lb', dy: -16 });
  b.text(() => [st.b, 0], 'b', { cls: 'nl-lb', dy: -16 });
  b.drag(() => [st.a, 0], (x) => { st = { ...st, a: clamp(Math.round(x), st.b + 1, 4) }; });
  b.drag(() => [st.b, 0], (x) => { st = { ...st, b: clamp(Math.round(x), -4, st.a - 1) }; });
  b.onUpdate = () => {
    $('shCV').textContent = m(st.c);
    const msg = $('shMsg');
    const [A, B] = [st.a + st.c, st.b + st.c];
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = `$a=${tn(st.a)}\\gt b=${tn(st.b)}$；两边都${st.c >= 0 ? `加 ${st.c}` : `减 ${-st.c}`}：$a+c=${tn(A)}\\gt b+c=${tn(B)}$，<b>方向不变</b>．`;
    tex(msg);
  };
  slider($('shC'), (v) => { st = { ...st, c: v }; b.update(); });
}

/* 第 4 页：做一做 5×k ＿ 3×k */
const KS = [1, 2, 3, 4, -1, -2, -3, -4];
function initMulGrid() {
  const row = (k) => {
    const s = k < 0 ? `(${k})` : `${k}`;
    const ans = 5 * k > 3 * k ? 'g' : 'l';
    return `<div class="qrow">$5\\times${s}$ ＿ $3\\times${s}$ <div class="pick" data-ans="${ans}"><button data-k="g">&gt;</button><button data-k="l">&lt;</button><p class="pick-why">$${5 * k}${cmpTex(5 * k, 3 * k)}${3 * k}$</p></div></div>`;
  };
  $('mulGrid').innerHTML = `${KS.slice(0, 4).map(row).join('')}<p class="dots">⋮</p>${KS.slice(4).map(row).join('')}<p class="dots">⋮</p>`;
  tex($('mulGrid'));
  MCheck.init($('mulGrid'));
}

/* 第 5 页：上轴 a、b，下轴 ac、bc，同一刻度，连线 */
const TOP = 2.2;
function axisAt(b, y, from, to) {
  b.seg([[from - 0.4, y], [to + 0.6, y]], { cls: 'nl-ax' });
  const ax = 14 / (b.X(1) - b.X(0));
  const ay = 6 / (b.Y(0) - b.Y(1));
  b.poly([[to + 0.6 + ax * 0.3, y], [to + 0.6 - ax * 0.7, y + ay], [to + 0.6 - ax * 0.7, y - ay]], { cls: 'nl-arrow' });
  for (let v = from; v <= to; v++) {
    b.seg([[v, y - 0.09], [v, y + 0.09]], { cls: v === 0 ? 'nl-zero' : 'nl-minor' });
    if (v % 3 === 0) b.text([v, y], m(v), { cls: 'mu-num', dy: 22 });
  }
}
function initMul() {
  let st = { a: 3, b: 1, c: 2 };
  const b = board($('mulB'), { x: [-10, 10.4], y: [-0.75, 3.1], w: 680, h: 230, axes: false, grid: false });
  axisAt(b, TOP, -9, 9);
  axisAt(b, 0, -9, 9);
  b.seg(() => [[st.a, TOP], [st.a * st.c, 0]], { cls: 'link1' });
  b.seg(() => [[st.b, TOP], [st.b * st.c, 0]], { cls: 'link2' });
  b.pt(() => [st.a * st.c, 0], { r: 6, cls: 'c1' });
  b.pt(() => [st.b * st.c, 0], { r: 6, cls: 'c2' });
  b.text(() => [st.a, TOP], 'a', { cls: 'nl-lb', dy: -14 });
  b.text(() => [st.b, TOP], 'b', { cls: 'nl-lb', dy: -14 });
  b.text(() => [st.a * st.c - (st.c === 0 ? 1 : 0), 0], 'ac', { cls: 'mu-lab ka', dy: 44 });
  b.text(() => [st.b * st.c + (st.c === 0 ? 1 : 0), 0], 'bc', { cls: 'mu-lab kb', dy: 44 }); // c = 0 时两点重合，标签错开
  b.drag(() => [st.a, TOP], (x) => { st = { ...st, a: clamp(Math.round(x * 2) / 2, st.b + 0.5, 3) }; });
  b.drag(() => [st.b, TOP], (x) => { st = { ...st, b: clamp(Math.round(x * 2) / 2, -3, st.a - 0.5) }; });
  b.onUpdate = () => {
    const [ac, bc] = [st.a * st.c, st.b * st.c];
    $('muCV').textContent = m(st.c);
    $('muA').textContent = m(st.a); $('muB').textContent = m(st.b);
    $('muAC').textContent = m(ac); $('muBC').textContent = m(bc);
    const msg = $('muMsg');
    const sign = st.c > 0 ? '正数' : st.c < 0 ? '负数' : '0';
    msg.className = `tip feedback ${st.c > 0 ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = st.c === 0
      ? '$c=0$：$ac=bc=0$，两点重合，不等关系没有了．'
      : `$a\\gt b$，乘${sign} $${tn(st.c)}$：$ac=${tn(ac)}${cmpTex(ac, bc)}bc=${tn(bc)}$，${st.c > 0 ? '<b>方向不变</b>' : '<b>方向改变</b>（连线交叉）'}．`;
    tex(msg);
  };
  slider($('muC'), (v) => { st = { ...st, c: v }; b.update(); });
}

window.LESSON = {
  init() {
    initShift();
    initMulGrid();
    initMul();
  },
};
