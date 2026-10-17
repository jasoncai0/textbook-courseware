'use strict';
/* 八下 10.5 分式方程 · 本课互动：增根放大镜（拖动 x，精确计算原方程两边、最简公分母、去分母后整式方程两边；图为“左边 − 右边”）。
 * 精确计算用 ../shared/mfrac.js；图象用同一公式的浮点值描点。 */
const { board, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const T = MFrac.tex;
const STEP = 2; // x 以 1/2 为单位移动

const ZG = [
  {
    tab: '例 1（有解）', eqTex: '\\dfrac3x-\\dfrac2{x-2}=0', L: '3/x-2/(x-2)', R: '0', M: 'x(x-2)', mTex: 'x(x-2)',
    iL: '3(x-2)-2x', iR: '0', iTex: '3(x-2)-2x=0', root: 6, init: 3,
    d: (x) => 3 / x - 2 / (x - 2), box: { x: [-3.5, 9.5], y: [-4, 4], ticks: [1, 1] }, hole: null,
  },
  {
    tab: '探索（增根）', eqTex: '\\dfrac{5x-4}{x-2}=\\dfrac{4x+10}{3x-6}-1', L: '(5x-4)/(x-2)', R: '(4x+10)/(3x-6)-1', M: '3(x-2)', mTex: '3(x-2)',
    iL: '3(5x-4)', iR: '4x+10-3(x-2)', iTex: '3(5x-4)=4x+10-3(x-2)', root: 2, init: 4,
    d: (x) => (5 * x - 4) / (x - 2) - ((4 * x + 10) / (3 * x - 6) - 1), box: { x: [-3.5, 7.5], y: [-2, 7], ticks: [1, 1] }, hole: [2, 14 / 3],
  },
  {
    tab: '例 2(2)（增根）', eqTex: '\\dfrac{x-2}{x+2}-\\dfrac{x+2}{x-2}=\\dfrac{16}{x^2-4}', L: '(x-2)/(x+2)-(x+2)/(x-2)', R: '16/(x^2-4)', M: '(x+2)(x-2)', mTex: '(x+2)(x-2)',
    iL: '(x-2)^2-(x+2)^2', iR: '16', iTex: '(x-2)^2-(x+2)^2=16', root: -2, init: 0,
    d: (x) => (x - 2) / (x + 2) - (x + 2) / (x - 2) - 16 / (x * x - 4), box: { x: [-6.5, 6.5], y: [-8, 8], ticks: [1, 2] }, hole: [-2, 2],
  },
];

function initZengen() {
  const s = { c: ZG[0], k: ZG[0].init * STEP };
  const holder = $('zgBoard');
  const boards = ZG.map((c) => {
    const el = document.createElement('div');
    el.className = 'zg-one';
    holder.appendChild(el);
    const [x0, x1] = c.box.x;
    const b = board(el, { ...c.box, w: 620, h: 320, labels: ['x', 'y'] });
    b.fn((x) => (c.hole && Math.abs(x - c.hole[0]) < 1e-6 ? NaN : c.d(x)), { cls: 'c1', n: 800 });
    if (c.hole) b.pt(c.hole, { hollow: true, r: 7 });
    b.pt([c.root, 0], { cls: 'c3m', r: 6 });
    b.seg(() => [[s.k / STEP, c.box.y[0]], [s.k / STEP, c.box.y[1]]], { cls: 'dash' });
    b.pt(() => { const x = s.k / STEP; const y = c.d(x); return Number.isFinite(y) && (!c.hole || x !== c.hole[0]) ? [x, y] : null; }, { cls: 'c2', r: 6 });
    b.drag(() => [s.k / STEP, 0], (x) => { s.k = Math.round(Math.max(x0 + 0.5, Math.min(x1 - 0.5, x)) * STEP); });
    b.onUpdate = () => { if (s.c === c) render(); };
    return b;
  });

  function render() {
    const c = s.c;
    const x = MFrac.mk(BigInt(s.k), BigInt(STEP));
    const env = { x };
    const [l, r, m, il, ir] = [c.L, c.R, c.M, c.iL, c.iR].map((e) => MFrac.val(e, env));
    const show = (v) => (v ? `$${T(v)}$` : '无意义');
    const td = (v, ok) => `<td class="${v ? (ok ? 'good' : '') : 'bad'}">${show(v)}</td>`;
    const origOk = l && r && MFrac.eq(l, r);
    const intOk = MFrac.eq(il, ir);
    $('zgRead').innerHTML = `<table class="mtab zg-tab"><tr><th>$x=${T(x)}$</th><th>左边</th><th>右边</th></tr>`
      + `<tr><td>原方程</td>${td(l, origOk)}${td(r, origOk)}</tr>`
      + `<tr><td>最简公分母 $${c.mTex}$</td><td colspan="2" class="${m.n === 0n ? 'bad' : ''}">$${T(m)}$${m.n === 0n ? '（为 0！）' : ''}</td></tr>`
      + `<tr><td>整式方程</td>${td(il, intOk)}${td(ir, intOk)}</tr></table>`;
    const msg = $('zgMsg');
    if (intOk && m.n === 0n) {
      msg.className = 'tip feedback fb-warn';
      msg.innerHTML = `$x=${T(x)}$ 满足整式方程 $${c.iTex}$，但最简公分母为 0，原方程两边<b>无意义</b>：$x=${T(x)}$ 是<b>增根</b>，原方程无解。`;
    } else if (intOk) {
      msg.className = 'tip feedback fb-ok';
      msg.innerHTML = `$x=${T(x)}$ 满足整式方程，且最简公分母 $=${T(m)}\\ne0$，原方程左边 = 右边：<b>是原方程的解</b>。`;
    } else {
      msg.className = 'tip feedback';
      msg.innerHTML = `$x=${T(x)}$ 时两边${l && r ? '不相等' : '有一边无意义'}，不是解。点“跳到整式方程的根”看看。`;
    }
    [$('zgRead'), msg].forEach(tex);
  }

  const pick = (i) => {
    s.c = ZG[i];
    s.k = s.c.init * STEP;
    holder.querySelectorAll('.zg-one').forEach((el, j) => { el.hidden = j !== i; });
    $('zgTabs').querySelectorAll('.btn').forEach((b, j) => b.classList.toggle('solid', j === i));
    $('zgEq').innerHTML = `$${s.c.eqTex}$`;
    tex($('zgEq'));
    boards[i].update();
  };
  $('zgTabs').innerHTML = ZG.map((c, i) => `<button type="button" class="btn" data-i="${i}">${c.tab}</button>`).join('');
  $('zgTabs').addEventListener('click', (e) => { const btn = e.target.closest('[data-i]'); if (btn) pick(+btn.dataset.i); });
  const nudge = (dk) => { const [x0, x1] = s.c.box.x; s.k = Math.max(Math.ceil((x0 + 0.5) * STEP), Math.min(Math.floor((x1 - 0.5) * STEP), s.k + dk)); boards[ZG.indexOf(s.c)].update(); };
  $('zgL').addEventListener('click', () => nudge(-1));
  $('zgR').addEventListener('click', () => nudge(1));
  $('zgGo').addEventListener('click', () => { s.k = s.c.root * STEP; boards[ZG.indexOf(s.c)].update(); });
  pick(0);
  return () => boards[ZG.indexOf(s.c)].update();
}

let redraw = () => {};
window.LESSON = {
  init() { redraw = initZengen(); },
  onRender() { requestAnimationFrame(redraw); },
};
