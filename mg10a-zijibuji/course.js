'use strict';
/* 高一上 1.2 子集、全集、补集 · 本课互动：子集枚举 + “选 / 不选”树（2^n）、例 4 数轴上的补集。通用部分见 ../shared/math.js */
const { board, tex } = MathKit;
const $ = (id) => document.getElementById(id);

/* ---------- 第 6 页：子集枚举 ---------- */
const LETTERS = ['a', 'b', 'c', 'd'];
const N_MAX = 4;
const subsetTex = (mask, n) => {
  const els = LETTERS.slice(0, n).filter((_, i) => mask & (1 << i));
  return els.length ? `\\{${els.join(',')}\\}` : '\\varnothing';
};
const subsetTxt = (mask, n) => {
  const els = LETTERS.slice(0, n).filter((_, i) => mask & (1 << i));
  return els.length ? `{${els.join(', ')}}` : '∅';
};
const popcount = (m) => m.toString(2).split('').filter((c) => c === '1').length;

// 横向“选 / 不选”树：第 k 层回答“选不选第 k 个元素”，2^n 片叶子各是一个子集
function treeSvg(n) {
  const leaves = 2 ** n;
  const ROW = n === 4 ? 22 : 30;
  const COL = 74;
  const W = COL * n + 150;
  const H = leaves * ROW + 10;
  const yOf = (k, i) => ((i + 0.5) * leaves / 2 ** k) * ROW + 5; // 第 k 层第 i 个结点
  let s = '';
  for (let k = 0; k < n; k += 1) {
    for (let i = 0; i < 2 ** k; i += 1) {
      [0, 1].forEach((pick) => {
        const j = i * 2 + pick;
        const x1 = 14 + k * COL;
        const x2 = 14 + (k + 1) * COL;
        s += `<line x1="${x1}" y1="${yOf(k, i)}" x2="${x2}" y2="${yOf(k + 1, j)}" class="${pick ? 'yes' : 'no'}"/>`;
      });
    }
    s += `<text x="${14 + (k + 0.5) * COL}" y="${H - 2}" class="lvl">${LETTERS[k]}?</text>`;
  }
  // 叶子：第 n 层第 j 个，二进制位从高到低依次对应 a, b, c, …
  for (let j = 0; j < leaves; j += 1) {
    let mask = 0;
    for (let k = 0; k < n; k += 1) if (j & (1 << (n - 1 - k))) mask |= 1 << k;
    s += `<circle cx="${14 + n * COL}" cy="${yOf(n, j)}" r="4" class="leaf"/><text x="${24 + n * COL}" y="${yOf(n, j) + 6}" class="lt">${subsetTxt(mask, n)}</text>`;
  }
  s += `<circle cx="14" cy="${yOf(0, 0)}" r="6" class="root"/>`;
  return `<svg viewBox="0 0 ${W} ${H + 16}" aria-label="选或不选的树">${s}</svg>`;
}

function initSubsets() {
  const st = { n: 2, cur: 0, found: new Set(), tree: false };
  const msg = (cls, html) => { const m = $('subMsg'); m.className = `tip feedback ${cls ? `fb-${cls}` : ''}`; m.innerHTML = html; tex(m); };
  const draw = () => {
    $('subN').innerHTML = [1, 2, 3, 4].map((n) => `<button type="button" class="btn${n === st.n ? ' solid' : ''}" data-n="${n}">${n} 个元素</button>`).join('');
    $('subEls').innerHTML = `<span class="set-of">$\\{${LETTERS.slice(0, st.n).join(',')}\\}$：</span>`
      + LETTERS.slice(0, st.n).map((l, i) => `<button type="button" class="el${st.cur & (1 << i) ? ' on' : ''}" data-i="${i}">$${l}$</button>`).join('')
      + `<span class="cur">当前：$${subsetTex(st.cur, st.n)}$</span>`;
    const list = [...st.found].sort((x, y) => popcount(x) - popcount(y) || x - y);
    $('subFound').innerHTML = `<h4>已找到 ${list.length} 个${list.length === 2 ** st.n ? `（全了：$2^${st.n}=${2 ** st.n}$）` : ''}</h4>`
      + list.map((m) => `<span class="chip-s">$${subsetTex(m, st.n)}$</span>`).join('');
    $('subTreeBox').innerHTML = st.tree ? treeSvg(st.n) : '';
    tex($('subEls')); tex($('subFound'));
  };
  const setN = (n) => { st.n = n; st.cur = 0; st.found = new Set(); st.tree = false; draw(); msg('', `$\\{${LETTERS.slice(0, n).join(',')}\\}$ 有几个子集？先猜，再一个一个找。`); };
  $('subN').addEventListener('click', (e) => { const b = e.target.closest('[data-n]'); if (b) setN(+b.dataset.n); });
  $('subEls').addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (!b) return;
    st.cur ^= 1 << +b.dataset.i;
    draw();
  });
  $('subAdd').addEventListener('click', () => {
    const t = subsetTex(st.cur, st.n);
    if (st.found.has(st.cur)) { msg('warn', `$${t}$ 已经记过了——不能重复。`); return; }
    st.found = new Set([...st.found, st.cur]);
    draw();
    const all = 2 ** st.n;
    if (st.found.size === all) msg('ok', `<b>✓ 找全了！</b>共 ${all} 个。最容易漏的是 $\\varnothing$ 和集合本身，你找到了吗？`);
    else msg('ok', `记下 $${t}$。${st.cur === 0 ? '空集也是子集，好！' : ''}${st.cur === all - 1 ? '集合本身也是它的子集。' : ''}`);
  });
  $('subTree').addEventListener('click', () => {
    st.tree = true;
    st.found = new Set(Array.from({ length: 2 ** st.n }, (_, m) => m));
    draw();
    msg('ok', `从左到右，每个元素都回答一次“选（实线）/ 不选（虚线）”：分叉 ${st.n} 次，得到 $2^${st.n}=${2 ** st.n}$ 片叶子，每片叶子是一个子集。`);
  });
  $('subClear').addEventListener('click', () => setN(st.n));
  setN(2);
}

/* ---------- 第 10 页：例 4 数轴 ---------- */
function initNumberLine() {
  const LO = -1.2;
  const HI = 3.6;
  const s = { mode: 'A' };
  const b = board($('nl'), { x: [LO, HI], y: [-0.75, 1.15], w: 640, h: 230, axes: false, grid: false });
  const showA = () => s.mode !== 'C';
  const showC = () => s.mode !== 'A';
  // 数轴
  b.seg([[LO, 0], [HI - 0.05, 0]], { cls: 'ax-l' });
  b.poly([[HI, 0], [HI - 0.14, 0.07], [HI - 0.14, -0.07]], { cls: 'ax-arrow' });
  [-1, 0, 1, 2, 3].forEach((v) => { b.seg([[v, -0.05], [v, 0.05]], { cls: 'ax-l' }); b.text([v, 0], String(v), { cls: 'tk', dy: 26, dx: -5 }); });
  b.text([0.5, 0], '1/2', { cls: 'tk', dy: 26, dx: -12 });
  b.text([HI, 0], 'x', { dy: 30, dx: -10 });
  // A = (1/2, 2]：高度 0.45；补集：高度 0.85 两段射线
  const HA = 0.45;
  const HC = 0.85;
  const hide = (on, pts) => () => (on() ? pts : [[0, -9], [0, -9]]);
  b.seg(hide(showA, [[0.5, HA], [2, HA]]), { cls: 'c1' });
  b.seg(hide(showA, [[0.5, 0], [0.5, HA]]), { cls: 'c1 thinl' });
  b.seg(hide(showA, [[2, 0], [2, HA]]), { cls: 'c1 thinl' });
  b.seg(hide(showC, [[LO, HC], [0.5, HC]]), { cls: 'c2' });
  b.seg(hide(showC, [[0.5, 0], [0.5, HC]]), { cls: 'c2 thinl' });
  b.seg(hide(showC, [[2, HC], [HI - 0.1, HC]]), { cls: 'c2' });
  b.seg(hide(showC, [[2, 0], [2, HC]]), { cls: 'c2 thinl' });
  // 端点：A 中 1/2 空心、2 实心；补集中 1/2 实心、2 空心
  b.pt([0.5, 0], { hollow: true, r: 8, show: () => s.mode === 'A' });
  b.pt([2, 0], { r: 8, cls: 'blue', show: () => s.mode === 'A' });
  b.pt([0.5, 0], { r: 8, cls: 'c2', show: () => s.mode === 'C' });
  b.pt([2, 0], { hollow: true, r: 8, show: () => s.mode === 'C' });
  b.pt([0.5, 0], { r: 8, cls: 'c2', show: () => s.mode === 'both' });
  b.pt([2, 0], { r: 8, cls: 'blue', show: () => s.mode === 'both' });
  b.text(() => (showA() ? [1.25, HA] : null), 'A', { dy: -10, dx: -6 });
  b.text(() => (showC() ? [-0.5, HC] : null), '∁A', { cls: 'lb up', dy: -10, dx: -10 });
  b.text(() => (showC() ? [2.8, HC] : null), '∁A', { cls: 'lb up', dy: -10, dx: -10 });
  const MSG = {
    A: '$A=\\left(\\frac12,2\\right]$ 的样子：$\\frac12$ 不含（空心），$2$ 含（实心）。',
    C: '$\\complement_UA$：$x\\le\\frac12$（$\\frac12$ 实心）或 $x\\gt 2$（$2$ 空心），是两段。',
    both: '合起来：不重叠、不遗漏，铺满整条数轴。$\\frac12$ 只属于 $\\complement_UA$（橙），$2$ 只属于 $A$（蓝）。',
  };
  b.onUpdate = () => { const m = $('nlMsg'); m.innerHTML = MSG[s.mode]; tex(m); };
  document.querySelectorAll('[data-nl]').forEach((btn) => btn.addEventListener('click', () => {
    s.mode = btn.dataset.nl;
    document.querySelectorAll('[data-nl]').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  }));
  b.update();
}

window.LESSON = {
  init() {
    initSubsets();
    initNumberLine();
  },
};
