'use strict';
/* 高一下 15.3 互斥事件和独立事件 · 本课互动：概率的面积模型（互斥/一般、独立/不独立）、样本点表、血型条、卡片。通用部分见 ../shared/math.js */
const { board, tex, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const rect = (x0, x1, y0, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

/* 单位正方形 Ω：外框 + 10×10 小格（每格面积 0.01） */
function omega(b) {
  for (let i = 1; i < 10; i++) {
    b.seg([[i / 10, 0], [i / 10, 1]], { cls: 'cell' });
    b.seg([[0, i / 10], [1, i / 10]], { cls: 'cell' });
  }
  b.poly(rect(0, 1, 0, 1), { cls: 'omega' });
}

const setTab = (id, rows) => {
  $(id).innerHTML = rows.map(([k, v, c]) => `<tr${c ? ` class="${c}"` : ''}><th>${k}</th><td>${v}</td></tr>`).join('');
  tex($(id));
};
const setMsg = (id, cls, html) => {
  const m = $(id);
  m.className = `tip feedback fb-${cls}`;
  m.innerHTML = html;
  tex(m);
};
const modeBtns = (id, attr, cur) => $(id).querySelectorAll(`[data-${attr}]`).forEach((x) => x.classList.toggle('solid', x.dataset[attr] === cur));

/* ---------- 第 5 页：A、B 为竖条，互斥 / 一般。状态用“百分之几”的整数，读数精确 ---------- */
function initUnion() {
  const s = { a: 40, l: 55, r: 85, mode: 'excl' }; // A = [0, a]，B = [l, r]（单位 0.01）
  const b = board($('uni'), { x: [-0.06, 1.06], y: [-0.16, 1.16], axes: false, grid: false, w: 520 });
  const ov = () => Math.max(0, Math.min(s.a, s.r) - s.l);
  omega(b);
  b.poly(() => rect(0, s.a / 100, 0, 1), { cls: 'fa' });
  b.poly(() => rect(s.l / 100, s.r / 100, 0, 1), { cls: 'fb' });
  b.poly(() => (ov() ? rect(s.l / 100, Math.min(s.a, s.r) / 100, 0, 1) : rect(0, 0, 0, 0)), { cls: 'fab' });
  b.text(() => (s.a >= 8 ? [s.a / 200, 0.62] : null), 'A', { dx: -6 });
  b.text(() => (s.r - s.l >= 8 ? [(s.l + s.r) / 200, 0.32] : null), 'B', { dx: -6 });
  b.text([1, 1], 'Ω', { dx: -26, dy: -8 });
  b.text(() => [s.a / 100, 1], () => fmt(s.a / 100), { cls: 'tk2', dx: -14, dy: -30 });
  b.text(() => [s.l / 100, 0], () => fmt(s.l / 100), { cls: 'tk2', dx: -14, dy: 46 });
  b.text(() => [s.r / 100, 0], () => fmt(s.r / 100), { cls: 'tk2', dx: -14, dy: 46 });
  const q = (x) => Math.round(x * 100);
  b.drag(() => [s.a / 100, 1], (x) => { s.a = clamp(q(x), 0, s.mode === 'excl' ? s.l : 100); });
  b.drag(() => [s.l / 100, 0], (x) => { s.l = clamp(q(x), s.mode === 'excl' ? s.a : 0, s.r); });
  b.drag(() => [s.r / 100, 0], (x) => { s.r = clamp(q(x), s.l, 100); });
  b.onUpdate = () => {
    const pA = s.a; const pB = s.r - s.l; const pAB = ov(); const pU = pA + pB - pAB;
    const f = (v) => fmt(v / 100);
    setTab('uniTab', [
      ['$P(A)$', f(pA)], ['$P(B)$', f(pB)], ['$P(AB)$（紫色）', f(pAB), 'c-ab'],
      ['$P(A+B)$（量出的面积）', f(pU), 'c-u'], ['$P(A)+P(B)$', f(pA + pB)], ['$P(A)+P(B)-P(AB)$', f(pA + pB - pAB)],
    ]);
    if (pAB === 0) {
      const opp = s.l === s.a && s.r === 100;
      setMsg('uniMsg', 'ok', `$AB=\\varnothing$，互斥：$P(A+B)=P(A)+P(B)=${f(pU)}$。`
        + (opp ? `<br><b>$B$ 占满了 $A$ 外的全部：$B=\\overline A$，对立！</b> $P(B)=1-P(A)=${f(100 - pA)}$` : ''));
    } else {
      setMsg('uniMsg', 'warn', `重叠了：$P(A)+P(B)=${f(pA + pB)}$，比 $P(A+B)=${f(pU)}$ 多 <b>${f(pAB)}</b>，恰好是 $P(AB)$。`);
    }
  };
  $('uniBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-m]');
    if (!btn) return;
    s.mode = btn.dataset.m;
    if (s.mode === 'excl' && s.l < s.a) { const w = s.r - s.l; s.l = s.a; s.r = Math.min(100, s.a + w); }
    modeBtns('uniBtns', 'm', s.mode);
    b.update();
  });
  b.update();
}

/* ---------- 第 11 页：A 竖条（宽 p），B 在 A 内高 q1、A 外高 q2；独立 ⇔ q1 = q2 ---------- */
const PRESETS = {
  dice: { p: 1 / 6, q1: 1 / 6, q2: 1 / 6, mode: 'ind' },
  ex1: { p: 1 / 3, q1: 1 / 2, q2: 1 / 4, mode: 'dep' },
  ex3: { p: 1 / 3, q1: 2 / 3, q2: 2 / 3, mode: 'ind' },
};
const EPS = 1e-9;
const MAX_DEN = 100;
// 有限小数（≤4 位）直接显示；课本预设里的 1/3、1/6、1/36 等显示成精确分数
const num = (v) => {
  if (Math.abs(v * 10000 - Math.round(v * 10000)) < EPS) return fmt(v, 4);
  const d = Array.from({ length: MAX_DEN - 1 }, (_, i) => i + 2).find((k) => Math.abs(v * k - Math.round(v * k)) < EPS);
  return d ? `$\\dfrac{${Math.round(v * d)}}{${d}}$` : `≈${fmt(v, 4)}`;
};

function initIndep() {
  const s = { p: 0.3, q1: 0.4, q2: 0.4, mode: 'ind' };
  const b = board($('ind'), { x: [-0.06, 1.06], y: [-0.16, 1.16], axes: false, grid: false, w: 520 });
  omega(b);
  b.poly(() => rect(0, s.p, 0, 1), { cls: 'fa' });
  b.poly(() => rect(0, s.p, 0, s.q1), { cls: 'fb' });
  b.poly(() => rect(s.p, 1, 0, s.q2), { cls: 'fb' });
  b.poly(() => rect(0, s.p, 0, s.q1), { cls: 'fabr' });
  b.text(() => [s.p / 2, (1 + s.q1) / 2], 'A', { dx: -6, dy: 8 });
  b.text(() => (s.q2 >= 0.08 ? [(1 + s.p) / 2, s.q2 / 2] : null), 'B', { dx: -6, dy: 8 });
  b.text(() => (s.q1 >= 0.1 ? [s.p / 2, s.q1 / 2] : null), 'AB', { dx: -14, dy: 8, cls: 'lb ab' });
  b.text([1, 1], 'Ω', { dx: -26, dy: -8 });
  b.text(() => [s.p / 2, 0], () => `P(A)=${num(s.p).replace(/\$\\dfrac\{(\d+)\}\{(\d+)\}\$/, '$1/$2')}`, { cls: 'tk2', dx: -40, dy: 26 });
  const q = (v) => Math.round(v * 100) / 100;
  const setQ = (k) => (x, y) => {
    const v = clamp(q(y), 0, 1);
    if (s.mode === 'ind') { s.q1 = v; s.q2 = v; } else s[k] = v;
  };
  b.drag(() => [s.p, 1], (x) => { s.p = clamp(q(x), 0.05, 0.95); });
  b.drag(() => [s.p / 2, s.q1], setQ('q1'));
  b.drag(() => [(1 + s.p) / 2, s.q2], setQ('q2'));
  b.onUpdate = () => {
    const pB = s.p * s.q1 + (1 - s.p) * s.q2;
    const pAB = s.p * s.q1;
    const prod = s.p * pB;
    setTab('indTab', [
      ['$P(A)$（蓝色竖条的宽）', num(s.p)],
      ['$A$ 内 $B$ 的高 ｜ $A$ 外 $B$ 的高', `${num(s.q1)} ｜ ${num(s.q2)}`],
      ['$P(B)$（橙色总面积）', num(pB)],
      ['$P(AB)$（红框面积）', num(pAB), 'c-ab'],
      ['$P(A)\\cdot P(B)$', num(prod), 'c-u'],
    ]);
    if (Math.abs(pAB - prod) < EPS) setMsg('indMsg', 'ok', `$P(AB)=P(A)P(B)$：<b>$A$、$B$ 相互独立</b>。$A$ 发生与否，$B$ 所占的比例都是 ${num(s.q1)}。`);
    else setMsg('indMsg', 'warn', `$P(AB)=${num(pAB)}\\ne P(A)P(B)=${num(prod)}$：<b>不独立</b>。$A$ 发生时 $B$ 占 ${num(s.q1)}，不发生时占 ${num(s.q2)}。`);
  };
  const setMode = (m) => { s.mode = m; modeBtns('indBtns', 'm', m); };
  $('indBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-m]');
    if (!btn) return;
    setMode(btn.dataset.m);
    if (s.mode === 'ind') s.q2 = s.q1;
    else if (Math.abs(s.q1 - s.q2) < EPS) s.q2 = q(s.q1 > 0.5 ? s.q1 - 0.3 : s.q1 + 0.3); // 拉开两边高度，让差别看得见
    b.update();
  });
  $('indPre').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-p]');
    if (!btn) return;
    const { mode, ...v } = PRESETS[btn.dataset.p];
    Object.assign(s, v);
    setMode(mode);
    b.update();
  });
  b.update();
}

/* ---------- 样本点表：横向 = 第一次（第一颗），纵向 = 第二次；kind(i, j) 返回格子类别 ---------- */
function pairGrid(el, { names, kind, w = 64, h = 40, label = ['第一个', '第二个'] }) {
  const n = names.length;
  const L = 46; const T = 34;
  const W = L + n * w + 4; const H = T + n * h + 4;
  const cells = [];
  names.forEach((cn, i) => names.forEach((rn, j) => {
    const k = kind(i, j);
    const x = L + i * w; const y = T + j * h;
    cells.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" class="gc ${k}"/>`);
    if (k !== 'x') cells.push(`<text x="${x + w / 2}" y="${y + h / 2 + 5}" class="gt">(${cn},${rn})</text>`);
  }));
  const heads = names.map((nm, i) => `<text x="${L + i * w + w / 2}" y="${T - 10}" class="gh">${nm}</text>`
    + `<text x="${L - 8}" y="${T + i * h + h / 2 + 5}" class="gh end">${nm}</text>`).join('');
  el.innerHTML = `<svg viewBox="0 0 ${W} ${H + 22}" aria-label="样本点表">${cells.join('')}${heads}`
    + `<text x="${L + (n * w) / 2}" y="${H + 18}" class="gh">横：${label[0]}　纵：${label[1]}</text></svg>`;
}

function initGrids() {
  const sub = (s) => s.replace(/1/g, '₁').replace(/2/g, '₂');
  const balls = ['W1', 'W2', 'B1', 'B2'].map(sub);
  const isW = (i) => i < 2;
  pairGrid($('ex1grid'), {
    names: balls,
    w: 82,
    kind: (i, j) => {
      if (i === j) return 'x';
      if (isW(i) && isW(j)) return 'a';
      if (!isW(i) && !isW(j)) return 'n';
      return 'b';
    },
  });
  const dice = ['1', '2', '3', '4', '5', '6'];
  pairGrid($('diceGrid'), {
    names: dice,
    w: 60,
    h: 34,
    label: ['第一颗', '第二颗'],
    kind: (i, j) => {
      const a = i === 0; const bb = j === 1;
      if (a && bb) return 'ab';
      if (a) return 'a';
      return bb ? 'b' : '';
    },
  });
  const rgb = ['1', '2', '3'];
  const kindAB = (rep) => (i, j) => {
    if (!rep && i === j) return 'x';
    const a = i === 0; const bb = j === 1;
    if (a && bb) return 'ab';
    if (a) return 'a';
    return bb ? 'b' : '';
  };
  pairGrid($('repGrid'), { names: rgb, w: 70, h: 34, label: ['第一次', '第二次'], kind: kindAB(true) });
  pairGrid($('norepGrid'), { names: rgb, w: 70, h: 34, label: ['第一次', '第二次'], kind: kindAB(false) });
}

/* ---------- 第 3 页：骰子 6 个样本点，按步骤标出 A、B、C ---------- */
function initDieRow() {
  const W = 70; const L = 40;
  const sets = [['A', [2, 4, 6], 'a', 1], ['B', [3], 'b', 1], ['C', [1, 3, 5], 'c', 3]];
  const cells = [1, 2, 3, 4, 5, 6].map((k, i) => `<rect x="${L + i * W}" y="4" width="${W}" height="40" class="gc"/><text x="${L + i * W + W / 2}" y="31" class="gt big">ω${'₀₁₂₃₄₅₆'[k]}</text>`).join('');
  const bars = sets.map(([nm, ks, c, st], r) => `<g data-step="${st}"><text x="${L - 10}" y="${66 + r * 22}" class="gh end it">${nm}</text>`
    + ks.map((k) => `<rect x="${L + (k - 1) * W + 4}" y="${54 + r * 22}" width="${W - 8}" height="16" rx="4" class="bar-${c}"/>`).join('') + '</g>').join('');
  $('dieRow').innerHTML = `<svg viewBox="0 0 ${L + 6 * W + 4} 124" aria-label="骰子的样本点">${cells}${bars}</svg>`;
}

/* ---------- 例 3 血型比例条（按百分比精确） ---------- */
function initBlood() {
  const data = [['A 型', 28, 'no'], ['B 型', 29, 'ok'], ['AB 型', 8, 'no'], ['O 型', 35, 'ok']];
  $('blood').innerHTML = `<div class="bbar">${data.map(([n, v, c]) => `<span class="${c}" style="width:${v}%">${n}<br>${v}%</span>`).join('')}</div>`
    + '<p class="muted center small-t"><i class="lg okc"></i>可以输给 B 型：29% + 35% = 64%　<i class="lg noc"></i>不能：28% + 8% = 36%</p>';
}

/* ---------- 例 3 卡片 1～9 ---------- */
function initCards() {
  const A = [1, 4, 7];
  $('cards').innerHTML = Array.from({ length: 9 }, (_, i) => i + 1)
    .map((k) => `<span class="card${A.includes(k) ? ' in-a' : ''}${k < 7 ? ' in-b' : ''}">${k}</span>`).join('')
    + '<p class="legend"><i class="lg a"></i>蓝框：$A$　<i class="lg b"></i>橙底：$B$</p>';
  tex($('cards'));
}

window.LESSON = {
  init() {
    initDieRow();
    initUnion();
    initGrids();
    initBlood();
    initCards();
    initIndep();
  },
};
