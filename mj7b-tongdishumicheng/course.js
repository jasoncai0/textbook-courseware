'use strict';
/* 七下 8.1 同底数幂的乘法 · 本课互动：因数串拼接器（m 个 a 与 n 个 a 去掉括号连成一串）。通用部分见 ../shared/math.js
 * 因数的个数严格等于 m、n；数值底数（10、2、1/2）同时给出精确数值核对。 */
const { slider, tex } = MathKit;
const $ = (id) => document.getElementById(id);

/* 底数：label 为因数上显示的文字，tex 为公式里的底数，val(k) 给出 base^k 的精确 TeX 值（没有数值的底数返回 null） */
const BASES = {
  10: { label: '10', tex: '10', val: (k) => `1${'0'.repeat(k)}` },
  2: { label: '2', tex: '2', val: (k) => String(2 ** k) },
  half: { label: '½', tex: '\\left(\\dfrac12\\right)', val: (k) => `\\dfrac{1}{${2 ** k}}` },
  a: { label: 'a', tex: 'a', val: () => null },
};

/** 四位以上的数按三位一组用细空格分开，便于读大数 */
const group = (s) => (/^\d{4,}$/.test(s) ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : s);

function initChain() {
  const s = { base: '10', m: 3, n: 2, merged: false };
  const chips = (k, cls) => Array.from({ length: k }, (_, i) => `${i ? '<span class="dot">·</span>' : ''}<span class="chip-a ${cls}">${BASES[s.base].label}</span>`).join('');

  const render = () => {
    const B = BASES[s.base];
    const num = s.base === 'a' ? '' : 'num';
    $('chain').className = `chain ${s.merged ? 'merged' : ''}`;
    $('chain').innerHTML = `<span class="grp g1">${chips(s.m, num)}</span><span class="op">×</span><span class="mid-dot">·</span><span class="grp g2">${chips(s.n, num)}</span>`;
    $('chainBrace').textContent = s.merged ? `连成一串：一共 ${s.m} + ${s.n} = ${s.m + s.n} 个 ${B.label} 相乘` : `左边 ${s.m} 个 ${B.label} 相乘，右边 ${s.n} 个 ${B.label} 相乘`;
    const lhs = `${B.tex}^{${s.m}}\\cdot ${B.tex}^{${s.n}}`;
    const rhs = s.merged ? `=${B.tex}^{${s.m}+${s.n}}=${B.tex}^{${s.m + s.n}}` : '=\\ ?';
    const vals = B.val(1) === null ? '' : `\\quad\\left(${group(B.val(s.m))}\\times${group(B.val(s.n))}=${group(B.val(s.m + s.n))}\\right)`;
    $('chainEq').innerHTML = `$${lhs}${rhs}${s.merged ? vals : ''}$`;
    $('chainM').textContent = s.m; $('chainN').textContent = s.n;
    $('chainGo').textContent = s.merged ? '分回两组' : '去掉括号，连成一串';
    $('chainBox').querySelectorAll('[data-base]').forEach((b) => b.classList.toggle('solid', b.dataset.base === s.base));
    tex($('chainEq'));
  };

  slider($('chainMi'), (v) => { s.m = v; render(); });
  slider($('chainNi'), (v) => { s.n = v; render(); });
  $('chainGo').addEventListener('click', () => { s.merged = !s.merged; render(); });
  $('chainBox').addEventListener('click', (e) => {
    const b = e.target.closest('[data-base]');
    if (!b) return;
    s.base = b.dataset.base;
    render();
  });
  render();
}

window.LESSON = {
  init() {
    initChain();
  },
};
