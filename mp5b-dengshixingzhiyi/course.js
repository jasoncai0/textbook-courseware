'use strict';
/* 五下 等式的性质（一）与解方程 · 本课互动：例 3 往天平两边加砝码（核心）、两边同时拿走 a 克、例 4 两边都减去 10、
 * 代入检验、练一练 2 的水果天平。天平见 ../shared/mbalance.js（质量相等才平衡） */
const $ = (id) => document.getElementById(id);
const W = (v, t) => ({ k: 'w', v, t });
const A_MASS = 30; // “a g”砝码的质量（两个一样重；学生看不到具体数）
const tex = (el) => MathKit.tex(el);

/* 天平内容 → 式子：每一项的文字 */
const termOf = (it) => it.term;
const exprOf = (L, R, state) => `$${L.map(termOf).join('+')}\\ ${{ eq: '=', L: '>', R: '<' }[state]}\\ ${R.map(termOf).join('+')}$`;

/* 第 3 页：例 3 加砝码 */
function initAdd() {
  const bal = MBalance.create($('balA'));
  const base = () => ({ L: [{ k: 'box', v: 50, t: '50克', term: '50' }], R: [{ ...W(50), term: '50' }], hist: '' });
  let st = base();
  const add = (side, g) => {
    const it = g === 'a' ? { ...W(A_MASS, 'a g'), term: 'a' } : { ...W(g), term: String(g) };
    st = { ...st, [side]: [...st[side], it] };
  };
  const render = () => {
    const state = bal.set(st.L, st.R);
    $('exprA').innerHTML = exprOf(st.L, st.R, state);
    const msg = $('msgA');
    const added = st.L.length + st.R.length > 2;
    msg.className = `tip feedback ${!added ? '' : state === 'eq' ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = !added ? '选一种加法，看看天平怎样变化。'
      : state === 'eq' ? '<b>仍然平衡！</b>左右两边加上了同样重的砝码，式子仍然是<b>等式</b>。'
        : `<b>不平衡了。</b>${state === 'L' ? '左边' : '右边'}重，式子变成用“${state === 'L' ? '＞' : '＜'}”连接，不再是等式。`;
    tex($('exprA')); tex(msg);
  };
  $('opsA').addEventListener('click', (e) => {
    const op = e.target.closest('[data-op]')?.dataset.op;
    if (!op) return;
    if (st.L.length + st.R.length >= 10) st = base();
    const g = op.slice(1) === 'a' ? 'a' : +op.slice(1);
    if (op[0] === 'L' || op[0] === 'B') add('L', g);
    if (op[0] === 'R' || op[0] === 'B') add('R', g);
    render();
  });
  $('resetA').addEventListener('click', () => { st = base(); render(); });
  render();
}

/* 第 4 页：两边同时拿走 a 克 */
function initTake() {
  const bal = MBalance.create($('balB'));
  const X = { k: 'box', v: 50, t: 'x g', term: 'x' };
  const A = { ...W(A_MASS, 'a g'), term: 'a' };
  const full = { L: [X, A], R: [{ ...W(50), term: '50' }, A] };
  let st = full;
  const render = (note) => {
    const state = bal.set(st.L, st.R);
    $('exprB').innerHTML = exprOf(st.L, st.R, state) + (note ? `<br><small>${note}</small>` : '');
    tex($('exprB'));
  };
  $('takeBoth').addEventListener('click', () => { st = { L: [X], R: [full.R[0]] }; render('两边都拿走了 $a$ 克，仍然平衡'); });
  $('takeLeft').addEventListener('click', () => { st = { L: [X], R: full.R }; render('只拿走一边，天平不平衡了'); });
  $('resetB').addEventListener('click', () => { st = full; render(); });
  render();
}

/* 第 6 页：例 4 两边都减去 10 */
function initEx4() {
  const bal = MBalance.create($('balC'));
  const start = () => { bal.set([{ k: 'box', v: 40, t: 'x 克' }, W(10)], [W(50)]); $('exprC').innerHTML = '$x+10=50$'; tex($('exprC')); };
  $('minus10').addEventListener('click', () => {
    bal.set([{ k: 'box', v: 40, t: 'x 克' }], [W(20), W(20)]);
    $('exprC').innerHTML = '$x+10-10=50-10$<br>$x=40$';
    tex($('exprC'));
  });
  $('resetC').addEventListener('click', start);
  start();
}

/* 第 7 页：代入检验 */
function initTry() {
  const inp = $('tryX');
  const show = () => {
    const v = parseFloat(inp.value);
    if (!Number.isFinite(v)) { $('tryOut').textContent = '请输入一个数'; return; }
    const left = +(v + 10).toFixed(6);
    const ok = Math.abs(left - 50) < 1e-9;
    $('tryOut').innerHTML = `左边 $=${v}+10=${left}$，右边 $=50$<br>${ok ? '<b class="ok-t">相等 ✓　$x=' + v + '$ 是方程的解</b>' : '<span class="no-t">不相等 ✗　不是方程的解</span>'}`;
    tex($('tryOut'));
  };
  inp.addEventListener('input', show);
  show();
}

/* 第 9 页：练一练 2 水果天平（同种水果一样重：梨 = 3 个桃，苹果 = 2 个橘子） */
const PEAR = { k: 'ball', v: 30, r: 27, color: '#e3d24a' };
const PEACH = { k: 'ball', v: 10, r: 18, color: '#f4a3a0' };
const APPLE = { k: 'ball', v: 20, r: 25, color: '#e8463c' };
const ORANGE = { k: 'ball', v: 10, r: 18, color: '#f39a1e' };
const rep = (it, n) => Array(n).fill(it);
function initFruit() {
  const bp = MBalance.create($('balP'));
  const bo = MBalance.create($('balO'));
  bp.set(rep(PEAR, 2), [PEAR, ...rep(PEACH, 3)]);
  bo.set([APPLE, ...rep(ORANGE, 3)], rep(ORANGE, 5));
  $('takePear').addEventListener('click', () => bp.set([PEAR], rep(PEACH, 3)));
  $('takeOrange').addEventListener('click', () => bo.set([APPLE], rep(ORANGE, 2)));
}

window.LESSON = {
  init() {
    initAdd();
    initTake();
    initEx4();
    initTry();
    initFruit();
  },
};
