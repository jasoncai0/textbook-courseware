'use strict';
/* 八下 12.1 二次根式 · 本课互动：有意义探测器（数轴）、“先平方再开方”机器 + y=√(x²) 图像、找错题。 */
const { board, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const neg = (s) => String(s).replace(/-/g, '−');
const num = (v, d = 2) => neg(fmt(v, d));
const redraws = [];

/* 不等式填空：≥/≤ 接受 >=、⩾ 等写法 */
function widenIneq() {
  document.querySelectorAll('.blank.ineq').forEach((el) => {
    const alts = el.dataset.ans.split('|').flatMap((a) => [a, a.replace('≥', '>='), a.replace('≥', '⩾'), a.replace('≤', '<='), a.replace('≤', '⩽')]);
    el.dataset.ans = [...new Set(alts)].join('|');
  });
}

/* ---------- 第 4 页：有意义探测器 ---------- */
const DOM = [
  { t: '\\sqrt{x-5}', f: (x) => x - 5, r: '$x\\ge5$' },
  { t: '\\sqrt{x+5}', f: (x) => x + 5, r: '$x\\ge-5$' },
  { t: '\\sqrt{3x-4}', f: (x) => 3 * x - 4, r: '$x\\ge\\dfrac43$' },
  { t: '\\sqrt{1-10x}', f: (x) => 1 - 10 * x, r: '$x\\le\\dfrac1{10}$' },
  { t: '\\sqrt{x^2+1}', f: (x) => x * x + 1, r: '任意实数' },
  { t: '\\sqrt{-x^2}', f: (x) => -x * x, r: '只有 $x=0$' },
];
function initDomain() {
  const s = { i: 0, x: 2 };
  const L = 30;
  const R = 610;
  const px = (x) => L + ((x + 6) / 14) * (R - L);
  const draw = () => {
    const c = DOM[s.i];
    // 逐像素判断被开方数是否 ≥ 0，画出绿色段（与解不等式的结果一致）
    let segs = '';
    let start = null;
    for (let p = L; p <= R + 1; p++) {
      const x = -6 + ((p - L) / (R - L)) * 14;
      const ok = p <= R && c.f(x) >= -1e-9;
      if (ok && start === null) start = p;
      if (!ok && start !== null) { segs += `<line x1="${start}" y1="50" x2="${p - 1}" y2="50" stroke="#2f7d6b" stroke-width="10" stroke-linecap="round" opacity=".55"/>`; start = null; }
    }
    if (c.f(0) === 0 && c.f(0.01) < 0 && c.f(-0.01) < 0) segs += `<circle cx="${px(0)}" cy="50" r="7" fill="#2f7d6b"/>`;
    let ticks = '';
    for (let x = -6; x <= 8; x++) ticks += `<line x1="${px(x)}" y1="44" x2="${px(x)}" y2="56" stroke="#556575" stroke-width="1.5"/><text x="${px(x)}" y="78" font-size="16" text-anchor="middle" fill="#556575">${neg(x)}</text>`;
    const ok = c.f(s.x) >= -1e-9;
    $('domLine').innerHTML = `<line x1="${L - 10}" y1="50" x2="${R + 18}" y2="50" stroke="#556575" stroke-width="2"/><path d="M${R + 22} 50 l-10 -5 v10z" fill="#556575"/>${segs}${ticks}`
      + `<path d="M${px(s.x)} 38 l-8 -14 h16z" fill="${ok ? '#2f7d6b' : '#c0392b'}"/><text x="${px(s.x)}" y="18" font-size="16" text-anchor="middle" fill="${ok ? '#2f7d6b' : '#c0392b'}">x = ${neg(fmt(s.x))}</text>`
      + `<text x="${R}" y="104" font-size="15" text-anchor="end" fill="#2f7d6b">绿色：使式子有意义的 x</text>`;
    const v = c.f(s.x);
    const m = $('domMsg');
    m.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
    m.innerHTML = `$x=${num(s.x)}$ 时，被开方数 $=${num(v)}$，${ok ? `$${c.t}=${v === 0 ? '0' : `\\sqrt{${num(v)}}`}$ <b>有意义</b>` : '是负数，<b>没有意义</b>'}．范围：${c.r}．`;
    tex(m);
  };
  $('domBtns').innerHTML = DOM.map((c, i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-i="${i}">$${c.t}$</button>`).join('');
  tex($('domBtns'));
  $('domBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-i]');
    if (!btn) return;
    s.i = +btn.dataset.i;
    [...$('domBtns').children].forEach((b) => b.classList.toggle('solid', b === btn));
    draw();
  });
  MathKit.slider($('domX'), (x) => { s.x = x; $('domXV').textContent = neg(fmt(x)); draw(); });
}

/* ---------- 第 8 页：√(a²) 机器 ---------- */
function initMachine() {
  const s = { a: -3 };
  const b = board($('absBoard'), { x: [-5.6, 5.6], y: [-1.2, 5.6], w: 460, ticks: 1 });
  b.fn((x) => x, { from: -1.2, to: 5.6, cls: 'dash' });
  b.fn((x) => -x, { from: -5.6, to: 1.2, cls: 'dash' });
  b.fn((x) => Math.sqrt(x * x), { cls: 'c1' });
  b.text([4.2, 5.1], 'y = x', { cls: 'lb' }); b.text([-5.4, 5.1], 'y = −x', { cls: 'lb' });
  b.seg(() => [[s.a, 0], [s.a, Math.abs(s.a)]], { cls: 'dash' });
  b.pt(() => [s.a, Math.sqrt(s.a * s.a)], { cls: 'c2', r: 7 });
  b.text(() => [s.a, Math.abs(s.a)], () => `(${num(s.a)}, ${num(Math.abs(s.a))})`, { cls: 'lb up', dx: s.a < 0 ? -90 : 10, dy: -10 });
  b.onUpdate = () => {
    const a = s.a;
    const a2 = a * a;
    const r = Math.sqrt(a2);
    const box = (t, v, cls = '') => `<div class="mbox ${cls}"><small>${t}</small><b>${v}</b></div>`;
    $('machine').innerHTML = box('输入 a', num(a), 'in') + '<i>平方 →</i>' + box('a²', num(a2)) + '<i>开方 →</i>' + box('√(a²)', num(r), 'out')
      + `<div class="mcmp">|a| = ${num(Math.abs(a))}　${a < 0 ? '（a 是负数：输出是 a 的相反数）' : '（a ≥ 0：输出就是 a）'}</div>`;
    $('aV').textContent = num(a);
    $('aIn').value = a;
    $('aMsg').innerHTML = `$a=${num(a)}$：$\\sqrt{a^2}=\\sqrt{${a < 0 ? `(${num(a)})` : num(a)}^2}=\\sqrt{${num(a2)}}=${num(r)}=|${num(a)}|$`;
    tex($('aMsg'));
  };
  $('aIn').addEventListener('input', () => { s.a = +$('aIn').value; b.update(); });
  $('aIn').setAttribute('data-noswipe', '');
  b.update();
  redraws.push(() => b.update());
}

/* ---------- 第 11 页：找错 ---------- */
function initBug() {
  const WHY = {
    1: '这一步没有错：$\\left(\\dfrac12\\right)^2$ 与 $\\left(-\\dfrac12\\right)^2$ 都等于 $\\dfrac14$，而 $\\dfrac52-2=\\dfrac12$，$2-\\dfrac52=-\\dfrac12$．',
    2: '这一步也没有错：两边都是 $\\sqrt{\\dfrac14}=\\dfrac12$，相等的非负数的算术平方根相等．',
    3: '<b>错在这里！</b>$\\sqrt{a^2}=|a|$，不一定等于 $a$．$\\sqrt{\\left(2-\\dfrac52\\right)^2}=\\left|2-\\dfrac52\\right|=\\dfrac12$，而不是 $2-\\dfrac52$．',
  };
  $('bugSteps').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    const k = btn.dataset.k;
    btn.classList.add(k === '3' ? 'ok' : 'fine');
    const m = $('bugMsg');
    m.className = `tip feedback ${k === '3' ? 'fb-ok' : 'fb-warn'}`;
    m.innerHTML = WHY[k];
    tex(m);
  });
}

window.LESSON = {
  init() { widenIneq(); initDomain(); initMachine(); initBug(); },
  onRender() { requestAnimationFrame(() => redraws.forEach((f) => f())); },
};
