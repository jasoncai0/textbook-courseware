'use strict';
/* 六上 分数四则混合运算 · 本课互动：例 1 面积图（18 竖条，每条 2/5 + 3/5 = 1 米）看两种算法、
 * “点运算符按顺序算”（把算式解析成运算树，只有两边都是数的那一步才能算；精确分数运算）、梯形按比例作图。
 * 通用部分见 ../shared/math.js、mcheck.js、fracfig.js */
const { tex } = MathKit;
const { el, gcd } = FracFig;
const $ = (id) => document.getElementById(id);

/* 精确分数 */
const Q = (n, d = 1) => { const g = gcd(Math.abs(n), Math.abs(d)) || 1; const s = d < 0 ? -1 : 1; return { n: (s * n) / g, d: (s * d) / g }; };
const OPS = {
  '+': (a, b) => Q(a.n * b.d + b.n * a.d, a.d * b.d),
  '-': (a, b) => Q(a.n * b.d - b.n * a.d, a.d * b.d),
  '×': (a, b) => Q(a.n * b.n, a.d * b.d),
  '÷': (a, b) => Q(a.n * b.d, a.d * b.n),
};
const OP_TEX = { '+': '+', '-': '-', '×': '\\times', '÷': '\\div' };
const numTex = (v) => (v.d === 1 ? `${v.n}` : `\\dfrac{${v.n}}{${v.d}}`);
const numHtml = (v) => (v.d === 1 ? `<span class="nm">${v.n}</span>` : `<span class="fr"><span>${v.n}</span><span>${v.d}</span></span>`);

/* ---------- 解析：expr := term (± term)*；term := factor (×÷ factor)*；factor := 数 | ( expr ) ---------- */
function parse(src) {
  const toks = src.match(/\d+\/\d+|\d+|[-+×÷()]/g);
  let i = 0;
  const factor = () => {
    const t = toks[i++];
    if (t === '(') { const e = expr(); i += 1; return { ...e, paren: true }; }
    const [n, d] = t.split('/').map(Number);
    return { t: 'num', v: Q(n, d || 1) };
  };
  const chain = (sub, ops) => () => {
    let left = sub();
    while (ops.includes(toks[i])) { const op = toks[i++]; left = { t: 'op', op, l: left, r: sub() }; }
    return left;
  };
  const term = chain(factor, '×÷');
  const expr = chain(term, '+-');
  return expr();
}
const ready = (n) => n.t === 'op' && n.l.t === 'num' && n.r.t === 'num';
function toTex(n) {
  if (n.t === 'num') return numTex(n.v);
  const s = `${toTex(n.l)}${OP_TEX[n.op]}${toTex(n.r)}`;
  return n.paren ? `\\left(${s}\\right)` : s;
}
function firstReady(n) {
  if (n.t === 'num') return null;
  if (ready(n)) return n;
  return firstReady(n.l) || firstReady(n.r);
}
/* 返回一个新树：把 target 结点换成它的结果（不改动原树） */
function reduce(n, target) {
  if (n === target) return { t: 'num', v: OPS[n.op](n.l.v, n.r.v), fresh: true };
  if (n.t === 'num') return { ...n, fresh: false };
  return { ...n, l: reduce(n.l, target), r: reduce(n.r, target) };
}

const EXPRS = [
  ['例 1', '2/5×18+3/5×18'],
  ['例 1 另一种', '(2/5+3/5)×18'],
  ['练一练 1①', '13/14÷15/28×5/8+1/4'],
  ['练一练 1②', '2/3+5/9×3/2+3/2'],
  ['练一练 2②', '12/7-(1/3÷7/15+4/5)'],
  ['练习十二 2①', '1/7÷3/14-5/8'],
  ['练习十二 2④', '1-8/9÷5/6×3/16'],
  ['练习十二 2⑥', '(3/4-3/4×5/6)÷3/2'],
];

function initPage5() {
  const st = { k: 0, tree: null, log: [], ops: [] };
  const pre = $('presets5');
  EXPRS.forEach(([name], k) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'btn'; b.dataset.k = k; b.textContent = name;
    pre.appendChild(b);
  });
  const say = (html, ok) => {
    const m = $('msg5');
    m.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
    m.innerHTML = html;
  };
  const render = (hintNode) => {
    st.ops = [];
    const h = (n) => {
      if (n.t === 'num') return n.fresh ? `<span class="fresh">${numHtml(n.v)}</span>` : numHtml(n.v);
      const id = st.ops.push(n) - 1;
      const s = `${h(n.l)}<button type="button" class="opb${n === hintNode ? ' hint' : ''}" data-op="${id}">${n.op}</button>${h(n.r)}`;
      return n.paren ? `<span class="par">(</span>${s}<span class="par">)</span>` : s;
    };
    $('expr5').innerHTML = h(st.tree);
    $('log5').innerHTML = st.log.map((t, i) => `<p>$${i ? '=' : ''}${t}$</p>`).join('');
    tex($('log5'));
    pre.querySelectorAll('button').forEach((b) => b.classList.toggle('solid', +b.dataset.k === st.k));
  };
  const load = (k) => {
    st.k = k;
    st.tree = parse(EXPRS[k][1]);
    st.log = [toTex(st.tree)];
    say('点你认为<b>应该先算</b>的那个运算符号。', true);
    render();
  };
  $('expr5').addEventListener('click', (e) => {
    const b = e.target.closest('[data-op]');
    if (!b) return;
    const n = st.ops[+b.dataset.op];
    if (!ready(n)) {
      const f = firstReady(n);
      say(`现在还不能算这个“${n.op}”：它旁边还有没算完的部分，要先算<b>标黄</b>的那一步。`, false);
      render(f);
      return;
    }
    const r = OPS[n.op](n.l.v, n.r.v);
    st.tree = reduce(st.tree, n);
    st.log.push(toTex(st.tree));
    if (st.tree.t === 'num') say(`<b>✓ 算完了！</b>结果是 $${numTex(r)}$。看右边的递等式。`, true);
    else say(`算对了：$${numTex(n.l.v)}${OP_TEX[n.op]}${numTex(n.r.v)}=${numTex(r)}$。接着点下一步。`, true);
    tex($('msg5'));
    render();
  });
  pre.addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (b) load(+b.dataset.k); });
  $('reset5').addEventListener('click', () => load(st.k));
  $('hint5').addEventListener('click', () => { if (st.tree.t !== 'num') render(firstReady(st.tree)); });
  load(0);
}

/* ---------- 第 3 页：18 竖条面积图 ---------- */
const K3 = { n: 18, x: 60, w: 880, top: 40, h: 180, lo: [2, 5], hi: [3, 5] };
function initPage3() {
  const svg = $('knot3');
  const cw = K3.w / K3.n;
  const loH = (K3.h * K3.lo[0]) / K3.lo[1];
  const render = (way) => {
    svg.innerHTML = '';
    for (let i = 0; i < K3.n; i += 1) {
      const x = K3.x + i * cw;
      const dim = way === 'cols' && i > 0 ? 0.45 : 1;
      el('rect', { x, y: K3.top + K3.h - loH, width: cw, height: loH, fill: '#e8574f', opacity: dim, stroke: '#fff', 'stroke-width': 1.5 }, svg);
      el('rect', { x, y: K3.top, width: cw, height: K3.h - loH, fill: '#f6c443', opacity: dim, stroke: '#fff', 'stroke-width': 1.5 }, svg);
    }
    el('rect', { x: K3.x, y: K3.top, width: K3.w, height: K3.h, fill: 'none', stroke: '#2a4256', 'stroke-width': 2.5 }, svg);
    el('text', { x: K3.x - 10, y: K3.top + 8, class: 'bt s end' }, svg).textContent = '1 米';
    el('text', { x: K3.x - 10, y: K3.top + K3.h, class: 'bt s end' }, svg).textContent = '0';
    el('text', { x: K3.x + K3.w / 2, y: K3.top - 12, class: 'bt s' }, svg).textContent = '18 对中国结（每竖条：每种各 1 个）';
    const tag = (x, y, s) => {
      const t = el('text', { x, y, class: 'bt tag' }, svg);
      t.textContent = s;
    };
    if (way === 'rows') {
      el('rect', { x: K3.x, y: K3.top + K3.h - loH, width: K3.w, height: loH, fill: 'none', stroke: '#8f1d17', 'stroke-width': 4 }, svg);
      el('rect', { x: K3.x, y: K3.top, width: K3.w, height: K3.h - loH, fill: 'none', stroke: '#8a6200', 'stroke-width': 4 }, svg);
      tag(K3.x + K3.w / 2, K3.top + K3.h - loH / 2 + 8, '第一种：2/5 × 18 = 36/5 米');
      tag(K3.x + K3.w / 2, K3.top + (K3.h - loH) / 2 + 8, '第二种：3/5 × 18 = 54/5 米');
    }
    if (way === 'cols') {
      el('rect', { x: K3.x, y: K3.top, width: cw, height: K3.h, fill: 'none', stroke: '#1d6fa5', 'stroke-width': 4 }, svg);
      tag(K3.x + K3.w / 2 + cw / 2, K3.top + K3.h / 2 + 8, '一竖条：2/5 + 3/5 = 1 米，18 条就是 1 × 18 = 18 米');
    }
  };
  const MSG = {
    rows: '想法一：$\\dfrac25\\times18+\\dfrac35\\times18=\\dfrac{36}5+\\dfrac{54}5=18$（米）',
    cols: '想法二：$\\left(\\dfrac25+\\dfrac35\\right)\\times18=1\\times18=18$（米）',
  };
  document.querySelectorAll('[data-w3]').forEach((b) => b.addEventListener('click', () => {
    render(b.dataset.w3);
    $('msg3').innerHTML = MSG[b.dataset.w3];
    tex($('msg3'));
  }));
  render('');
}

/* ---------- 第 8 页：梯形（1 m = 400 单位） ---------- */
function initPage8() {
  const svg = $('trap8');
  const M = 400;
  const B = 195;
  const lab = (x, y, s) => { el('text', { x, y, class: 'bt s' }, svg).textContent = s; };
  // 左：上底 3/10，下底 2/5，高 1/4（上下底中点对齐）
  const [lb, lt, lh, lx] = [M * 2 / 5, M * 3 / 10, M / 4, 20];
  el('path', { d: `M${lx} ${B}H${lx + lb}L${lx + (lb + lt) / 2} ${B - lh}H${lx + (lb - lt) / 2}Z`, fill: '#8fd3f4', stroke: '#2a9fd6', 'stroke-width': 2 }, svg);
  lab(lx + lb / 2, B + 22, '2/5 m');
  lab(lx + lb / 2, B - lh - 8, '3/10 m');
  lab(lx + lb / 2, B - lh / 2 + 6, '高 1/4 m');
  // 右：直角梯形，上底 1/2，下底 7/10，高 2/5
  const [rb, rt, rh, rx] = [M * 7 / 10, M / 2, M * 2 / 5, 225];
  el('path', { d: `M${rx} ${B}H${rx + rb}L${rx + rt} ${B - rh}H${rx}Z`, fill: '#8fd3f4', stroke: '#2a9fd6', 'stroke-width': 2 }, svg);
  el('path', { d: `M${rx} ${B - 12}h12v12`, fill: 'none', stroke: '#2a4256', 'stroke-width': 1.5 }, svg);
  lab(rx + rb / 2, B + 22, '7/10 m');
  lab(rx + rt / 2, B - rh - 8, '1/2 m');
  lab(rx + rb / 2 - 20, B - rh / 2 + 6, '高 2/5 m');
}

window.LESSON = {
  init() {
    initPage3();
    initPage5();
    initPage8();
    FracFig.exact();
  },
};
