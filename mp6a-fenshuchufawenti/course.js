'use strict';
/* 六上 分数除法解决实际问题 · 本课互动：线段图五步倒推“单位 1”（例 5 及试一试、练一练，可切换题目）、例 6 三盒果汁按格倒杯。
 * 线段长度按分率精确画，数值用分数精确计算（不用小数）。通用部分见 ../shared/math.js、mcheck.js、fracfig.js */
const { tex } = MathKit;
const { el, gcd } = FracFig;
const $ = (id) => document.getElementById(id);
const PEOPLE = ['#f5a623', '#4f9bd0', '#2fa37f', '#e0607e', '#8e6bbf', '#c9a227'];

/* 精确分数 [分子, 分母] */
const fr = (n, d = 1) => { const g = gcd(n, d) || 1; return [n / g, d / g]; };
const fmul = (a, b) => fr(a[0] * b[0], a[1] * b[1]);
const fdiv = (a, b) => fr(a[0] * b[1], a[1] * b[0]);
const ftxt = (a) => (a[1] === 1 ? `${a[0]}` : `${a[0]}/${a[1]}`);
const ftex = (a) => (a[1] === 1 ? `${a[0]}` : `\\dfrac{${a[0]}}{${a[1]}}`);

/* ---------- 第 3 页：线段图倒推 ---------- */
const PRESETS = [
  { name: '例 5', whole: '大瓶', part: '小瓶', a: 2, b: 3, val: fr(600), unit: '毫升', q: '小瓶 600 毫升，是大瓶的 $\\dfrac23$。大瓶有多少毫升？' },
  { name: '试一试', whole: '一盒牛奶', part: '喝了', a: 1, b: 2, val: fr(2, 5), unit: '升', q: '喝了一盒牛奶的 $\\dfrac12$，正好是 $\\dfrac25$ 升。这盒牛奶有多少升？' },
  { name: '练一练 1', whole: '上衣', part: '裤子', a: 5, b: 8, val: fr(45), unit: '元', q: '裤子 45 元，是上衣单价的 $\\dfrac58$。上衣多少元？' },
  { name: '练一练 2', whole: '果树', part: '桃树', a: 3, b: 5, val: fr(360), unit: '棵', q: '桃树 360 棵，占果树总棵数的 $\\dfrac35$。果树有多少棵？' },
];
const BAR = { x: 190, w: 760, y1: 80, y2: 180, h: 34 };
const STEPS = 5;

function drawBar(svg, P, step) {
  svg.innerHTML = '';
  const { x, w, y1, y2, h } = BAR;
  const pw = w / P.b;
  const one = fdiv(P.val, fr(P.a));
  const total = fmul(one, fr(P.b));
  el('text', { x: x - 14, y: y1 + h / 2 + 8, class: 'bt end' }, svg).textContent = P.whole;
  el('text', { x: x - 14, y: y2 + h / 2 + 8, class: 'bt end' }, svg).textContent = P.part;
  // 单位 1
  for (let i = 0; i < P.b; i += 1) {
    const hot = step >= 2 && i < P.a;
    el('rect', { x: x + i * pw, y: y1, width: pw, height: h, fill: step >= 2 ? (hot ? '#f9d48a' : '#fff') : '#e6f1fa' }, svg);
    if (step >= 3 && (step >= 4 || i === 0)) el('text', { x: x + (i + 0.5) * pw, y: y1 + h / 2 + 7, class: 'bt s' }, svg).textContent = ftxt(one);
  }
  if (step >= 1) for (let i = 1; i < P.b; i += 1) el('line', { x1: x + i * pw, x2: x + i * pw, y1: y1, y2: y1 + h, stroke: '#2a4256', 'stroke-width': 2, 'stroke-dasharray': '5 4' }, svg);
  el('rect', { x, y: y1, width: w, height: h, fill: 'none', stroke: '#1d6fa5', 'stroke-width': 3 }, svg);
  // 单位 1 上方的大括号
  const brace = (bx0, bx1, by, up, label, cls) => {
    const m = (bx0 + bx1) / 2;
    const s = up ? -1 : 1;
    el('path', { d: `M${bx0} ${by}q0 ${10 * s} 12 ${10 * s}H${m - 12}q12 0 12 ${10 * s}q0 ${-10 * s} 12 ${-10 * s}H${bx1 - 12}q12 0 12 ${-10 * s}`, fill: 'none', stroke: cls === 'hot' ? '#d9711c' : '#1d6fa5', 'stroke-width': 2.5 }, svg);
    el('text', { x: m, y: by + (up ? -28 : 46), class: `bt ${cls}` }, svg).textContent = label;
  };
  brace(x, x + w, y1 - 6, true, step >= 5 ? `${ftxt(one)} × ${P.b} = ${ftxt(total)} ${P.unit}` : `? ${P.unit}`, step >= 5 ? 'hot' : '');
  // 对应量
  const aw = pw * P.a;
  el('rect', { x, y: y2, width: aw, height: h, fill: '#f9d48a', stroke: '#d9711c', 'stroke-width': 3 }, svg);
  if (step >= 2) {
    for (let i = 1; i < P.a; i += 1) el('line', { x1: x + i * pw, x2: x + i * pw, y1: y2, y2: y2 + h, stroke: '#d9711c', 'stroke-width': 2, 'stroke-dasharray': '5 4' }, svg);
    el('line', { x1: x + aw, x2: x + aw, y1: y1 + h, y2: y2, stroke: '#9fb0bf', 'stroke-width': 1.5, 'stroke-dasharray': '3 4' }, svg);
  }
  brace(x, x + aw, y2 + h + 6, false, `${ftxt(P.val)} ${P.unit}`, 'hot');
}

function stepText(P, step) {
  const one = fdiv(P.val, fr(P.a));
  const total = fmul(one, fr(P.b));
  const f = `\\dfrac{${P.a}}{${P.b}}`;
  return [
    `“${P.part}是${P.whole}的 $${f}$”：<b>${P.whole}</b>是单位 1，现在还不知道。`,
    `把${P.whole}（单位 1）平均分成 <b>${P.b}</b> 份。`,
    `${P.part}占其中 <b>${P.a}</b> 份，是 $${ftex(P.val)}$ ${P.unit}。`,
    `先求 1 份：$${ftex(P.val)}\\div${P.a}=${ftex(one)}$（${P.unit}）`,
    `再求 ${P.b} 份：$${ftex(one)}\\times${P.b}=${ftex(total)}$（${P.unit}）。合起来就是 $${ftex(P.val)}\\div${f}=${ftex(total)}$`,
    `${P.whole}一共 $${ftex(total)}$ ${P.unit}。检验：$${ftex(total)}\\times${f}=${ftex(P.val)}$ ✓`,
  ][step];
}

function initPage3() {
  const svg = $('bar3');
  const st = { p: 0, step: 0 };
  const box = $('presets3');
  PRESETS.forEach((P, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn';
    b.dataset.p = i;
    b.textContent = P.name;
    box.appendChild(b);
  });
  const render = () => {
    const P = PRESETS[st.p];
    drawBar(svg, P, st.step);
    box.querySelectorAll('button').forEach((b) => b.classList.toggle('solid', +b.dataset.p === st.p));
    $('q3').innerHTML = P.q;
    $('msg3').innerHTML = stepText(P, st.step);
    $('stepn3').textContent = `第 ${st.step} / ${STEPS} 步`;
    tex($('q3'));
    tex($('msg3'));
  };
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-p]');
    if (!b) return;
    st.p = +b.dataset.p;
    st.step = 0;
    render();
  });
  $('go3').addEventListener('click', () => { st.step = Math.min(STEPS, st.step + 1); render(); });
  $('back3').addEventListener('click', () => { st.step = Math.max(0, st.step - 1); render(); });
  render();
}

/* ---------- 第 6 页：3 盒 × 8 格（每格 1/10 升），每杯 3 格 ---------- */
const BOX6 = { boxes: 3, cells: 8, cup: 3, x: 30, y: 40, cw: 38, h: 70, gap: 26 };
function initPage6() {
  const svg = $('box6');
  const cellX = (bi, ci) => BOX6.x + bi * (BOX6.cells * BOX6.cw + BOX6.gap) + ci * BOX6.cw;
  const render = (way) => {
    svg.innerHTML = '';
    for (let bi = 0; bi < BOX6.boxes; bi += 1) {
      for (let ci = 0; ci < BOX6.cells; ci += 1) {
        let cup = -1;
        if (way === 'total') cup = Math.floor((bi * BOX6.cells + ci) / BOX6.cup);
        if (way === 'one') cup = Math.floor(ci / BOX6.cup);
        const partial = way === 'one' && cup === Math.floor(BOX6.cells / BOX6.cup);
        const fill = cup < 0 ? '#f9c86b' : PEOPLE[cup % PEOPLE.length];
        el('rect', { x: cellX(bi, ci), y: BOX6.y, width: BOX6.cw, height: BOX6.h, fill, stroke: '#fff', 'stroke-width': 2, opacity: partial ? 0.45 : 1 }, svg);
      }
      el('rect', { x: cellX(bi, 0), y: BOX6.y, width: BOX6.cells * BOX6.cw, height: BOX6.h, fill: 'none', stroke: '#2a4256', 'stroke-width': 3 }, svg);
      el('text', { x: cellX(bi, BOX6.cells / 2), y: BOX6.y - 12, class: 'bt s' }, svg).textContent = `第 ${bi + 1} 盒（4/5 升 = 8 格）`;
      if (way === 'one') {
        for (let c = 0; c * BOX6.cup < BOX6.cells; c += 1) {
          const n = Math.min(BOX6.cup, BOX6.cells - c * BOX6.cup);
          el('text', { x: cellX(bi, c * BOX6.cup + n / 2), y: BOX6.y + BOX6.h + 30, class: 'bt s' }, svg).textContent = n === BOX6.cup ? '1 杯' : `${n}/${BOX6.cup} 杯`;
        }
      }
    }
    if (way === 'total') {
      const total = BOX6.boxes * BOX6.cells;
      for (let c = 0; c < total / BOX6.cup; c += 1) {
        const mid = c * BOX6.cup + 1.5;
        const bi = Math.floor(mid / BOX6.cells);
        el('text', { x: cellX(bi, mid - bi * BOX6.cells), y: BOX6.y + BOX6.h + 30, class: 'bt s' }, svg).textContent = `第${c + 1}杯`;
      }
    }
    el('text', { x: 500, y: 190, class: 'bt s' }, svg).textContent = way === 'total'
      ? '3 盒共 24 格，每 3 格倒满一杯：24 ÷ 3 = 8（杯）'
      : way === 'one' ? '1 盒 8 格：倒满 2 杯，还剩 2 格是 2/3 杯，1 盒 = 8/3 杯；3 盒 = 8 杯' : '每一小格是 1/10 升，一杯装 3 格（3/10 升）';
  };
  document.querySelectorAll('[data-w6]').forEach((b) => b.addEventListener('click', () => render(b.dataset.w6)));
  render('');
}

window.LESSON = {
  init() {
    initPage3();
    initPage6();
    FracFig.exact();
  },
};
