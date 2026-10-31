'use strict';
/* 九上 1.3 一元二次方程的根与系数的关系 · 本课互动：根系数观察器——拖动两个根、改二次项系数 a，
 * 抛物线 y = a(x − x1)(x − x2) 与方程系数 b = −a(x1 + x2)、c = a·x1·x2 同步；两种算法对照。 */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const f3 = (v) => fmt(v, 3);
const pr = (v) => (v < 0 ? `(${f3(v)})` : f3(v));

/** ax² + bx + c = 0 的 TeX（系数为 0 的项省略，1 不写） */
function eqTex(a, b, c) {
  const term = (k, x, first) => {
    if (!k) return '';
    const abs = Math.abs(k);
    const co = abs === 1 && x ? '' : f3(abs);
    return `${k < 0 ? '-' : first ? '' : '+'}${co}${x}`;
  };
  return `${term(a, 'x^2', true)}${term(b, 'x', false)}${term(c, '', false)}=0`;
}

let rb = null;
function initRoots() {
  const s = { x1: -1, x2: 3, a: 1 };
  rb = board($('rootBoard'), { x: [-5, 5], y: [-6, 6], w: 520, h: 420, ticks: 1 });
  rb.fn((x) => s.a * (x - s.x1) * (x - s.x2), { cls: 'c1' });
  const snap = (x) => Math.max(-4.5, Math.min(4.5, Math.round(x * 2) / 2));
  rb.drag(() => [s.x1, 0], (x) => { s.x1 = snap(x); });
  rb.drag(() => [s.x2, 0], (x) => { s.x2 = snap(x); });
  rb.text(() => [s.x1, 0], 'x₁', { dx: -10, dy: s.a > 0 ? -16 : 30 });
  rb.text(() => [s.x2, 0], 'x₂', { dx: -10, dy: s.a > 0 ? -16 : 30 });
  rb.onUpdate = () => {
    const { a, x1, x2 } = s;
    const b = -a * (x1 + x2);
    const c = a * x1 * x2;
    $('rEq').innerHTML = `方程：$${eqTex(a, b, c)}$<br><span class="muted">$a=${f3(a)}$，$b=${f3(b)}$，$c=${f3(c)}$</span>`;
    $('rS1').innerHTML = `$${f3(x1)}+${pr(x2)}=${f3(x1 + x2)}$`;
    $('rS2').innerHTML = `$-\\dfrac ba=${f3(-b / a)}$`;
    $('rP1').innerHTML = `$${f3(x1)}\\times${pr(x2)}=${f3(x1 * x2)}$`;
    $('rP2').innerHTML = `$\\dfrac ca=${f3(c / a)}$`;
    $('rMsg').className = 'tip feedback fb-ok';
    $('rMsg').innerHTML = x1 === x2 ? '两根重合（$b^2-4ac=0$），关系依然成立．' : '两种算法的结果完全相同．';
    ['rEq', 'rS1', 'rS2', 'rP1', 'rP2', 'rMsg'].forEach((id) => tex($(id)));
  };
  slider($('rA'), (v) => {
    s.a = v === 0 ? (s.a > 0 ? -0.5 : 0.5) : v; // a ≠ 0
    $('rA').value = s.a;
    $('rAV').textContent = fmt(s.a);
    rb.update();
  });
}

window.LESSON = {
  init() { initRoots(); },
  onRender(slide) { if (rb && slide.contains(rb.svg)) rb.update(); },
};
