'use strict';
/* 七上 3.4 合并同类项 · 本课互动：图 3-8 校园规划图、“选一组 · 合并”、整体代换。通用部分见 ../shared/math.js
 * 规划图按比例由坐标绘制；多项式的系数用分数精确运算（不用浮点）。 */
const { board, slider, tex } = MathKit;
const $ = (id) => document.getElementById(id);

/* ---------- 分数 ---------- */
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const frac = (n, d = 1) => { const g = gcd(n, d) || 1; const s = d < 0 ? -1 : 1; return [(s * n) / g, (s * d) / g]; };
const fadd = (p, q) => frac(p[0] * q[1] + q[0] * p[1], p[1] * q[1]);
const ftex = (f) => (f[1] === 1 ? String(f[0]) : `${f[0] < 0 ? '-' : ''}\\frac{${Math.abs(f[0])}}{${f[1]}}`);

/* ---------- 单项式：c 系数（分数），v 字母与指数（按书写顺序） ---------- */
const keyOf = (t) => t.v.map(([x, e]) => `${x}${e}`).sort().join('');
const letters = (t) => t.v.map(([x, e]) => (e === 1 ? x : `${x}^{${e}}`)).join('');
function termTex(t, first) {
  const [n, d] = t.c;
  const sign = n < 0 ? '-' : (first ? '' : '+');
  const abs = [Math.abs(n), d];
  if (!t.v.length) return sign + ftex(abs);
  const coef = abs[0] === 1 && abs[1] === 1 ? '' : ftex(abs);
  return sign + coef + letters(t);
}
const polyTex = (ts) => (ts.length ? ts.map((t, i) => termTex(t, i === 0)).join('') : '0');
const T = (n, d, ...v) => ({ c: frac(n, d), v });

/* 第 3 页：图 3-8 校园规划图（单位 m）。上排：教学区 100 × a、操场 200 × a；下排：活动中心 240 × b、图书馆 60 × b */
function initCampus() {
  const s = { a: 120, b: 60, mode: '' };
  const b = board($('campus'), { x: [-42, 336], y: [-34, 306], axes: false, grid: false, w: 560 });
  const R = (x0, y0, w, h) => [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]];
  const blocks = [
    { f: () => R(0, s.b, 100, s.a), cls: 'z1', name: '教学区', w: 100, h: 'a' },
    { f: () => R(100, s.b, 200, s.a), cls: 'z2', name: '操场', w: 200, h: 'a' },
    { f: () => R(0, 0, 240, s.b), cls: 'z3', name: '活动中心', w: 240, h: 'b' },
    { f: () => R(240, 0, 60, s.b), cls: 'z4', name: '图书馆', w: 60, h: 'b' },
  ];
  blocks.forEach((k) => b.poly(k.f, { cls: `zone ${k.cls}` }));
  // 小丽：上下两条整体高亮
  b.poly(() => (s.mode === 'li' ? R(0, s.b, 300, s.a) : []), { cls: 'strip' });
  b.poly(() => (s.mode === 'li' ? R(0, 0, 300, s.b) : []), { cls: 'strip' });
  const mid = (k) => { const p = k.f(); return [(p[0][0] + p[2][0]) / 2, (p[0][1] + p[2][1]) / 2]; };
  blocks.forEach((k) => b.text(() => mid(k), () => (s.mode === 'ming' ? `${k.w}${k.h}` : k.name), { cls: 'lb up c zt', dy: 6 }));
  // 尺寸线
  b.text(() => [50, s.a + s.b], '100', { cls: 'tk c', dy: -8 });
  b.text(() => [200, s.a + s.b], '200', { cls: 'tk c', dy: -8 });
  b.text([120, 0], '240', { cls: 'tk c', dy: 20 });
  b.text([270, 0], '60', { cls: 'tk c', dy: 20 });
  b.text(() => [300, s.b + s.a / 2], 'a', { dx: 8, dy: 6 });
  b.text(() => [300, s.b / 2], 'b', { dx: 8, dy: 6 });
  b.onUpdate = () => {
    const { a, b: bb } = s;
    $('campAV').textContent = a; $('campBV').textContent = bb;
    const ming = 100 * a + 200 * a + 240 * bb + 60 * bb;
    const li = 300 * a + 300 * bb;
    const msg = $('campMsg');
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = `$a=${a}$，$b=${bb}$ 时：小明 $100\\times${a}+200\\times${a}+240\\times${bb}+60\\times${bb}=${ming}$；小丽 $300\\times${a}+300\\times${bb}=${li}$．`;
    tex(msg);
  };
  $('campBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-mode]');
    if (!btn) return;
    s.mode = s.mode === btn.dataset.mode ? '' : btn.dataset.mode;
    $('campBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x.dataset.mode === s.mode));
    b.update();
  });
  slider($('campA'), (v) => { s.a = v; b.update(); });
  slider($('campB'), (v) => { s.b = v; b.update(); });
}

/* 第 7 页：选一组 · 合并 */
const POLYS = [
  { name: '例 2', terms: [T(5, 1, ['m', 3]), T(-3, 1, ['m', 2], ['n', 1]), T(-1, 1, ['m', 3]), T(2, 1, ['n', 1], ['m', 2]), T(-7, 1), T(2, 1, ['m', 3])] },
  { name: '练一练 1(4)', terms: [T(1, 1, ['x', 2]), T(-5, 1, ['x', 1], ['y', 1]), T(1, 1, ['y', 1], ['x', 1]), T(2, 1, ['x', 2])] },
  { name: 'p82 练一练 1(2)', terms: [T(5, 1, ['x', 3]), T(-4, 1, ['x', 2], ['y', 1]), T(2, 1, ['x', 1], ['y', 2]), T(-3, 1, ['x', 2], ['y', 1]), T(-7, 1, ['x', 1], ['y', 2]), T(-5, 1, ['x', 3])] },
  { name: '习题 2(5)', terms: [T(1, 1, ['x', 2], ['y', 2]), T(3, 1, ['x', 1], ['y', 1]), T(-7, 1, ['x', 2], ['y', 2]), T(-5, 2, ['x', 1], ['y', 1]), T(-1, 1), T(5, 1, ['x', 2], ['y', 2])] },
];
const HUES = ['h1', 'h2', 'h3', 'h4'];

/** 两项为什么不是同类项：返回一句话 */
function whyNot(p, q) {
  const lp = p.v.map(([x]) => x).sort().join('');
  const lq = q.v.map(([x]) => x).sort().join('');
  if (lp !== lq) {
    if (!lp || !lq) return '一个是常数项，一个含字母——所含字母不同．';
    return `所含字母不同：$${letters(p)}$ 含 ${lp.split('').join('、') || '无'}，$${letters(q)}$ 含 ${lq.split('').join('、')}．`;
  }
  const ep = Object.fromEntries(p.v);
  const eq = Object.fromEntries(q.v);
  const x = Object.keys(ep).find((k) => ep[k] !== eq[k]);
  return `字母相同，但 $${x}$ 的指数不同（$${letters(p)}$ 中是 ${ep[x]}，$${letters(q)}$ 中是 ${eq[x]}）．`;
}

function initMerge() {
  const s = { k: 0, items: [], sel: [], log: [], hue: 0 };
  const reset = (k) => {
    s.k = k;
    s.items = POLYS[k].terms.map((t, i) => ({ ...t, id: i, hue: '' }));
    s.sel = []; s.log = []; s.hue = 0;
    render(`原式：$${polyTex(POLYS[k].terms)}$．先找出一组同类项．`, '');
  };
  const hasLike = () => { const ks = s.items.map(keyOf); return ks.some((k, i) => ks.indexOf(k) !== i); };
  function render(msg, cls) {
    $('mgTabs').innerHTML = POLYS.map((p, i) => `<button class="btn ${i === s.k ? 'solid' : ''}" type="button" data-k="${i}">${i + 1}. ${p.name}</button>`).join('');
    $('mgPoly').innerHTML = s.items.length
      ? s.items.map((t, i) => `<button type="button" class="term ${s.sel.includes(t.id) ? 'sel' : ''} ${t.hue}" data-id="${t.id}">$${termTex(t, i === 0)}$</button>`).join('')
      : '<span class="term zero">$0$</span>';
    $('mgLog').innerHTML = s.log.map((l) => `<p>${l}</p>`).join('');
    const m = $('mgMsg');
    m.className = `tip feedback ${cls}`;
    m.innerHTML = msg;
    tex($('mgPoly')); tex($('mgLog')); tex(m);
  }
  function merge() {
    const picked = s.items.filter((t) => s.sel.includes(t.id));
    if (picked.length < 2) { render('至少选两项，才谈得上“合并”．', 'fb-warn'); return; }
    const bad = picked.find((t) => keyOf(t) !== keyOf(picked[0]));
    if (bad) { render(`这几项不全是同类项：${whyNot(picked[0], bad)}`, 'fb-warn'); return; }
    const sum = picked.reduce((acc, t) => fadd(acc, t.c), frac(0));
    const base = picked[0];
    const lt = base.v.length ? letters(base) : '';
    const coefs = picked.map((t, i) => (i === 0 ? ftex(t.c) : (t.c[0] < 0 ? ftex(t.c) : `+${ftex(t.c)}`))).join('');
    const lhs = picked.map((t, i) => termTex(t, i === 0)).join('');
    const merged = { c: sum, v: base.v, id: base.id, hue: HUES[s.hue % HUES.length] };
    const rhs = sum[0] === 0 ? '0' : termTex(merged, true);
    s.log = [...s.log, `$${lhs}=${lt ? `(${coefs})${lt}` : `${coefs}`}=${rhs}$${sum[0] === 0 ? '　（系数和为 0，这组项合并后为 0）' : ''}`];
    s.hue += 1;
    const firstIdx = s.items.findIndex((t) => t.id === base.id);
    s.items = s.items
      .map((t, i) => (i === firstIdx ? merged : t))
      .filter((t) => t.id === base.id ? sum[0] !== 0 : !s.sel.includes(t.id));
    s.sel = [];
    if (hasLike()) render('合并好了！还有别的同类项吗？', 'fb-ok');
    else render(`没有同类项了——化简结果：$${polyTex(s.items)}$`, 'fb-ok');
  }
  $('mgTabs').addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (b) reset(+b.dataset.k); });
  $('mgPoly').addEventListener('click', (e) => {
    const b = e.target.closest('[data-id]');
    if (!b) return;
    const id = +b.dataset.id;
    s.sel = s.sel.includes(id) ? s.sel.filter((x) => x !== id) : [...s.sel, id];
    b.classList.toggle('sel', s.sel.includes(id));
  });
  $('mgDo').addEventListener('click', merge);
  $('mgReset').addEventListener('click', () => reset(s.k));
  reset(0);
}

/* 第 11 页：把 (x − 2y) 换成 a */
function initBoxes() {
  const coefs = ['5', '-3', '+8', '-4'];
  let on = false;
  const draw = () => {
    $('boxRow').innerHTML = coefs.map((c) => `<span class="bx-term">$${c}$<span class="bx ${on ? 'on' : ''}">${on ? '$a$' : '$(x-2y)$'}</span></span>`).join('');
    tex($('boxRow'));
    $('boxBtn').textContent = on ? '还原成 (x − 2y)' : '把 (x − 2y) 换成 a';
  };
  $('boxBtn').addEventListener('click', () => { on = !on; draw(); });
  draw();
}

window.LESSON = {
  init() {
    initCampus();
    initMerge();
    initBoxes();
  },
};
