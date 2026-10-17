'use strict';
/* 五下 等式的性质（二）与解方程 · 本课互动：例 5 倍数天平（两边同乘、同除，核心）、例 6 拖宽试面积、
 * 练习一的选运算、按比例画的线段图和图形、第 13 题铅笔天平。天平见 ../shared/mbalance.js */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const tex = (el) => MathKit.tex(el);
const W = (v, t) => ({ k: 'w', v, t });
const rep = (it, n) => Array(n).fill(it);

/* 第 3 页：例 5。木块 x = 20 克；L、R 是两边各有几份（左边每份一个木块，右边每份一个 20 g 砝码） */
const X = 20;
const MAX_N = 6;
function initTimes() {
  const bal = MBalance.create($('balM'));
  let st = { L: 1, R: 1, msg: '' };
  const render = () => {
    const state = bal.set(rep({ k: 'box', v: X, t: 'x g', w: 56, h: 52 }, st.L), rep(W(20), st.R));
    const lhs = st.L === 1 ? 'x' : `${st.L}x`;
    const sym = { eq: '=', L: '>', R: '<' }[state];
    $('exprM').innerHTML = `$${lhs}\\ ${sym}\\ ${20 * st.R}$` + (st.R > 1 ? `<br><small>右边：$20\\times${st.R}=${20 * st.R}$</small>` : '');
    const m = $('msgM');
    m.className = `tip feedback ${st.msg ? (state === 'eq' ? 'fb-ok' : 'fb-warn') : ''}`;
    m.innerHTML = st.msg || '木块重 $x$ 克，天平平衡：$x=20$。点上面的按钮试一试。';
    tex($('exprM')); tex(m);
  };
  $('opsM').addEventListener('click', (e) => {
    const op = e.target.closest('[data-op]')?.dataset.op;
    if (!op) return;
    if (op === 'r') st = { L: 1, R: 1, msg: '' };
    else if (op === 'm2' || op === 'm3') {
      const k = +op[1];
      st = st.L * k > MAX_N || st.L !== st.R
        ? { L: k, R: k, msg: `从 $x=20$ 重新开始：两边都乘 ${k}，仍然平衡。` }
        : { L: st.L * k, R: st.R * k, msg: `两边都乘 ${k}，<b>仍然平衡</b>。` };
    } else if (op === 'd') {
      st = st.L === st.R && st.L > 1
        ? { L: 1, R: 1, msg: `两边都平均分成 ${st.L} 份，各留下 1 份（都除以 ${st.L}），<b>仍然平衡</b>：$x=20$。` }
        : { ...st, msg: st.L === 1 ? '现在每边只有 1 份，先乘一乘再来分。' : '先点“还原”，让天平平衡再试。' };
    } else if (op === 'L2') {
      st = { L: Math.min(MAX_N, st.L * 2), R: st.R, msg: '只有左边乘 2，<b>不平衡了</b>，左边重。' };
    }
    render();
  });
  render();
}

/* 第 5 页：例 6，长方形按比例画（1 米 = 9 个单位），拖宽试面积 */
const FIELD = { len: 40, area: 960, s: 9, x0: 60, y0: 30 };
function initField() {
  const svg = $('field');
  const draw = (w) => {
    svg.innerHTML = '';
    const { len, s, x0, y0 } = FIELD;
    const ok = len * w === FIELD.area;
    svgEl('rect', { x: x0, y: y0, width: len * s, height: w * s, class: ok ? 'f-rect ok' : 'f-rect' }, svg);
    svgEl('line', { x1: x0, x2: x0 + len * s, y1: y0 + w * s + 18, y2: y0 + w * s + 18, class: 'f-dim' }, svg);
    svgEl('text', { x: x0 + (len * s) / 2, y: y0 + w * s + 42, class: 'f-t' }, svg).textContent = '40 米';
    svgEl('line', { x1: x0 + len * s + 16, x2: x0 + len * s + 16, y1: y0, y2: y0 + w * s, class: 'f-dim' }, svg);
    svgEl('text', { x: x0 + len * s + 26, y: y0 + (w * s) / 2 + 8, class: 'f-t st' }, svg).textContent = `${w} 米`;
    svgEl('text', { x: x0 + (len * s) / 2, y: y0 + (w * s) / 2 + 9, class: 'f-t big' }, svg).textContent = `40 × ${w} = ${len * w} 平方米${ok ? ' ✓' : ''}`;
  };
  MathKit.slider($('fieldW'), (v) => { $('fieldWv').textContent = v; draw(v); });
}

/* 第 7 页：练习一第 4、6 题 */
const OPS8 = [
  ['76+x=105', 's', '29', '左边加了 76，两边同时减去 76。'],
  ['x-46=90', 'a', '136', '$x$ 减了 46，两边同时加上 46。'],
  ['x+3.5=3.5', 's', '0', '两边同时减去 3.5，$x=0$。'],
  ['x-6.4=0.4', 'a', '6.8', '两边同时加上 6.4。'],
  ['12x=96', 'd', '8', '$x$ 乘了 12，两边同时除以 12。'],
  ['x\\div40=14', 'm', '560', '$x$ 除以了 40，两边同时乘 40。'],
  ['18x=3.6', 'd', '0.2', '两边同时除以 18。'],
  ['x\\div2.5=5', 'm', '12.5', '两边同时乘 2.5。'],
];
function initOps() {
  $('ops8').innerHTML = OPS8.map(([e, a, ans, why]) => `<div class="jcard o8"><p class="o8-e">$${e}$</p>
    <div class="pick" data-ans="${a}"><button type="button" data-k="a">＋</button><button type="button" data-k="s">－</button><button type="button" data-k="m">×</button><button type="button" data-k="d">÷</button><p class="pick-why">${why}</p></div>
    <p class="o8-x">$x=$ <span class="blank" data-ans="${ans}" data-w="4"></span></p></div>`).join('');
  tex($('ops8'));
  MCheck.init($('ops8'));
}

/* 第 8 页：线段图（同一比例：1 个单位 = 3.6 像素） */
function brace(svg, x1, x2, y, up, label) {
  const m = (x1 + x2) / 2;
  const d = up ? -10 : 10;
  svgEl('path', { d: `M${x1} ${y}q0 ${d} 8 ${d}H${m - 6}l6 ${d}l6 ${-d}H${x2 - 8}q8 0 8 ${-d}`, class: 'sg-br' }, svg);
  svgEl('text', { x: m, y: y + (up ? -28 : 38), class: 'sg-t' }, svg).textContent = label;
}
function segBar(svg, parts, total) {
  const k = 3.6;
  let x = 20;
  const y = 42;
  parts.forEach(([v, lb]) => {
    svgEl('rect', { x, y, width: v * k, height: 14, class: 'sg-bar' }, svg);
    brace(svg, x, x + v * k, y - 4, true, lb);
    x += v * k;
  });
  brace(svg, 20, x, y + 18, false, String(total));
}
function initSegs() {
  segBar($('seg1'), [[62, 'x'], [22, '22']], 84);
  segBar($('seg2'), [[32, 'x'], [32, 'x'], [32, 'x']], 96);
}

/* 第 9 页：图形按比例画 */
function initShapes() {
  // 平行四边形：底 18，高 25（x），面积 450。1 米 = 4 单位
  const p = $('shpP');
  const [b, h, sk, k] = [18, 25, 9, 4.4];
  const [ox, oy] = [24, 132];
  svgEl('path', { d: `M${ox} ${oy}L${ox + b * k} ${oy}L${ox + b * k + sk * k} ${oy - h * k}L${ox + sk * k} ${oy - h * k}Z`, class: 'sh-f' }, p);
  svgEl('line', { x1: ox + sk * k, y1: oy - h * k, x2: ox + sk * k, y2: oy, class: 'sh-h' }, p);
  svgEl('text', { x: ox + sk * k + 6, y: oy - (h * k) / 2, class: 'sh-t' }, p).textContent = 'x m';
  svgEl('text', { x: ox + (b * k) / 2, y: oy + 17, class: 'sh-t c' }, p).textContent = '18 m（底）';
  svgEl('text', { x: 205, y: 80, class: 'sh-t c' }, p).textContent = '面积 450 m²';
  // 长方形：长 3.5（x），宽 1.6，面积 5.6。1 米 = 40 单位
  const r = $('shpR');
  svgEl('rect', { x: 40, y: 34, width: 3.5 * 40, height: 1.6 * 40, class: 'sh-f' }, r);
  svgEl('text', { x: 110, y: 120, class: 'sh-t c' }, r).textContent = 'x 米';
  svgEl('text', { x: 186, y: 72, class: 'sh-t' }, r).textContent = '1.6 米';
  svgEl('text', { x: 110, y: 20, class: 'sh-t c' }, r).textContent = '面积 5.6 平方米';
  // 正方形：边长 2.5（x），周长 10。1 米 = 36 单位
  const q = $('shpS');
  svgEl('rect', { x: 85, y: 28, width: 90, height: 90, class: 'sh-f' }, q);
  svgEl('text', { x: 130, y: 138, class: 'sh-t c' }, q).textContent = 'x 米';
  svgEl('text', { x: 130, y: 18, class: 'sh-t c' }, q).textContent = '周长 10 米';
}

/* 第 9 页：第 13 题，练习本 = 5 支铅笔的价钱 */
function initPen() {
  const bal = MBalance.create($('balN'));
  const BOOK = { k: 'box', v: 5, t: '练习本', w: 72, h: 44, fs: 16 };
  const PEN = { k: 'ball', v: 1, r: 11, color: '#4f9bd0' };
  bal.set([BOOK, ...rep(PEN, 3)], rep(PEN, 8));
  $('takePen').addEventListener('click', () => bal.set([BOOK], rep(PEN, 5)));
}

window.LESSON = {
  init() {
    initTimes();
    initField();
    initOps();
    initSegs();
    initShapes();
    initPen();
  },
};
