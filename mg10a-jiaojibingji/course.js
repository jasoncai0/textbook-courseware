'use strict';
/* 高一上 1.3 交集、并集 · 本课互动：Venn 图涂色（交、并、补及其组合）、区间示意（图 1-3-4）、数轴上拖区间求交与并。通用部分见 ../shared/math.js */
const { board, tex, fmt } = MathKit;
const $ = (id) => document.getElementById(id);

/* ---------- 第 6 页：Venn 涂色。区域：a 只属于 A，ab 公共，b 只属于 B，out 两者都不属于 ---------- */
const inA = (r) => r === 'a' || r === 'ab';
const inB = (r) => r === 'b' || r === 'ab';
const OPS = [
  { t: 'A\\cap B', f: (r) => inA(r) && inB(r), d: '既属于 $A$ 又属于 $B$：重叠的一块。' },
  { t: 'A\\cup B', f: (r) => inA(r) || inB(r), d: '至少属于其中一个：两个圈盖住的全部。' },
  { t: '\\complement_UA', f: (r) => !inA(r), d: '$U$ 中不属于 $A$ 的部分。' },
  { t: '\\complement_U(A\\cup B)', f: (r) => !(inA(r) || inB(r)), d: '先并、再补：两个圈外面。' },
  { t: '(\\complement_UA)\\cap(\\complement_UB)', f: (r) => !inA(r) && !inB(r), d: '先补、再交：既不在 $A$ 也不在 $B$——和 $\\complement_U(A\\cup B)$ 一样！' },
  { t: '\\complement_U(A\\cap B)', f: (r) => !(inA(r) && inB(r)), d: '先交、再补：除了重叠那块，都涂上。' },
  { t: '(\\complement_UA)\\cup(\\complement_UB)', f: (r) => !inA(r) || !inB(r), d: '先补、再并：和 $\\complement_U(A\\cap B)$ 一样！' },
];
function initVenn() {
  $('vOps').innerHTML = OPS.map((o, i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-i="${i}">$${o.t}$</button>`).join('');
  tex($('vOps'));
  const show = (i) => {
    const o = OPS[i];
    document.querySelectorAll('#vPaint .rg').forEach((el) => el.classList.toggle('on', o.f(el.dataset.r)));
    $('vOps').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', +b.dataset.i === i));
    const m = $('vMsg');
    m.innerHTML = `$${o.t}$：${o.d}`;
    tex(m);
  };
  $('vOps').addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) show(+b.dataset.i); });
  show(0);
}

/* ---------- 第 9 页：图 1-3-4 的六条数轴 ---------- */
const FIGS = [
  ['[a,b]', true, true], ['(a,b)', false, false], ['[a,b)', true, false],
  ['(a,b]', false, true], ['(a,+\\infty)', false, null], ['(-\\infty,b)', null, false],
];
function initIvlFigs() {
  const W = 300;
  const XA = 70;
  const XB = 220;
  const Y = 30;
  const dot = (x, closed) => `<circle cx="${x}" cy="${Y}" r="6" class="${closed ? 'solid' : 'open'}"/>`;
  $('ivlFigs').innerHTML = FIGS.map(([t, lc, rc]) => {
    const x1 = lc === null ? 10 : XA;
    const x2 = rc === null ? W - 18 : XB;
    const svg = `<svg viewBox="0 0 ${W} 58"><line x1="6" y1="${Y}" x2="${W - 10}" y2="${Y}" class="axl"/><path d="M${W - 4} ${Y} l-10 -5 v10z" class="axa"/>`
      + `<line x1="${x1}" y1="${Y}" x2="${x2}" y2="${Y}" class="seg"/>`
      + `${lc === null ? '' : dot(XA, lc) + `<text x="${XA}" y="54" class="tl">a</text>`}${rc === null ? '' : dot(XB, rc) + `<text x="${XB}" y="54" class="tl">b</text>`}</svg>`;
    return `<div class="ivf"><span>$${t}$</span>${svg}</div>`;
  }).join('');
  tex($('ivlFigs'));
}

/* ---------- 第 10 页：数轴上拖区间 ---------- */
const LO = -3;
const HI = 6;
const SNAP = 0.5;
const INF = Infinity;
const PRESETS = [
  { name: '例 3', A: [0, false, INF, false], B: [-INF, false, 1, true] },
  { name: '习题第 2 题', A: [-1, false, 3, true], B: [2, true, 4, false] },
  { name: '练习 4(3)', A: [0, true, INF, false], B: [2, false, INF, false] },
];
const iv = ([lo, loC, hi, hiC]) => ({ lo, loC, hi, hiC });
const isEmpty = (s) => s.lo > s.hi || (s.lo === s.hi && !(s.loC && s.hiC));
// 交：左端取较大者、右端取较小者；端点相同则两边都含才含
function meet(a, b) {
  const pick = (x, y, take, cx, cy) => (x === y ? [x, cx && cy] : take(x, y) === x ? [x, cx] : [y, cy]);
  const [lo, loC] = pick(a.lo, b.lo, Math.max, a.loC, b.loC);
  const [hi, hiC] = pick(a.hi, b.hi, Math.min, a.hiC, b.hiC);
  return { lo, loC, hi, hiC };
}
// 并：两段相交或首尾相接（接点至少一边含）就连成一段，否则是两段
function join(a, b) {
  const [l, r] = a.lo <= b.lo ? [a, b] : [b, a];
  const touch = r.lo < l.hi || (r.lo === l.hi && (r.loC || l.hiC));
  if (!touch) return [l, r];
  const loC = l.lo === r.lo ? l.loC || r.loC : l.loC;
  const [hi, hiC] = l.hi === r.hi ? [l.hi, l.hiC || r.hiC] : l.hi > r.hi ? [l.hi, l.hiC] : [r.hi, r.hiC];
  return [{ lo: l.lo, loC, hi, hiC }];
}
const num = (v) => (v === INF ? '+\\infty' : v === -INF ? '-\\infty' : fmt(v));
const ivTex = (s) => {
  if (isEmpty(s)) return '\\varnothing';
  if (s.lo === -INF && s.hi === INF) return '\\R';
  if (s.lo === s.hi) return `\\{${num(s.lo)}\\}`;
  return `${s.loC ? '[' : '('}${num(s.lo)},${num(s.hi)}${s.hiC ? ']' : ')'}`;
};

function initIntervals() {
  const st = { A: iv(PRESETS[0].A), B: iv(PRESETS[0].B), show: 'cap' };
  const H = { A: 0.95, B: 0.5 };
  const handles = [];
  const b = board($('iv'), { x: [LO, HI], y: [-0.75, 1.35], w: 640, h: 210, axes: false, grid: false });
  const clip = (v) => Math.min(HI - 0.3, Math.max(LO + 0.3, v));
  // 数轴与刻度
  b.seg([[LO, 0], [HI - 0.1, 0]], { cls: 'ax-l' });
  b.poly([[HI, 0], [HI - 0.22, 0.08], [HI - 0.22, -0.08]], { cls: 'ax-arrow' });
  for (let v = -2; v <= 5; v += 1) { b.seg([[v, -0.05], [v, 0.05]], { cls: 'ax-l' }); b.text([v, 0], String(v), { cls: 'tk', dy: 24, dx: -4 }); }
  // 结果：画在数轴上（绿色）
  const res = () => (st.show === 'cap' ? [meet(st.A, st.B)] : join(st.A, st.B));
  [0, 1].forEach((k) => {
    const piece = () => { const r = res()[k]; return r && !isEmpty(r) ? r : null; };
    b.seg(() => { const r = piece(); return r ? [[clip(r.lo), 0], [clip(r.hi), 0]] : [[0, -9], [0, -9]]; }, { cls: 'res' });
    b.pt(() => { const r = piece(); return r && Number.isFinite(r.lo) ? [r.lo, 0] : null; }, { r: 8, cls: 'rp', hollow: false, show: () => { const r = piece(); return r && r.loC; } });
    b.pt(() => { const r = piece(); return r && Number.isFinite(r.lo) ? [r.lo, 0] : null; }, { r: 8, hollow: true, show: () => { const r = piece(); return r && !r.loC; } });
    b.pt(() => { const r = piece(); return r && Number.isFinite(r.hi) ? [r.hi, 0] : null; }, { r: 8, cls: 'rp', show: () => { const r = piece(); return r && r.hiC; } });
    b.pt(() => { const r = piece(); return r && Number.isFinite(r.hi) ? [r.hi, 0] : null; }, { r: 8, hollow: true, show: () => { const r = piece(); return r && !r.hiC; } });
  });
  // A、B 两层：竖线落到数轴，横线在各自高度
  ['A', 'B'].forEach((k) => {
    const s = () => st[k];
    const h = H[k];
    const cls = k === 'A' ? 'c1' : 'c2';
    b.seg(() => [[clip(s().lo), h], [clip(s().hi), h]], { cls });
    b.seg(() => (Number.isFinite(s().lo) ? [[s().lo, 0], [s().lo, h]] : [[0, -9], [0, -9]]), { cls: `${cls} thinl` });
    b.seg(() => (Number.isFinite(s().hi) ? [[s().hi, 0], [s().hi, h]] : [[0, -9], [0, -9]]), { cls: `${cls} thinl` });
    b.text(() => [(clip(s().lo) + clip(s().hi)) / 2, h], k, { dy: -10, dx: -6 });
    ['lo', 'hi'].forEach((end) => {
      const g = b.drag(() => (Number.isFinite(s()[end]) ? [s()[end], h] : [end === 'lo' ? LO - 5 : HI + 5, h]), (x) => {
        if (!Number.isFinite(s()[end])) return;
        const v = Math.round(clip(x) / SNAP) * SNAP;
        st[k] = end === 'lo' ? { ...s(), lo: Math.min(v, s().hi) } : { ...s(), hi: Math.max(v, s().lo) };
      });
      handles.push({ g, k, end });
    });
  });
  const ctrl = () => {
    $('ivCtrl').innerHTML = ['A', 'B'].map((k) => {
      const s = st[k];
      const btn = (end, c, finite) => (finite ? `<button type="button" class="btn sm" data-k="${k}" data-e="${end}">${end === 'lo' ? '左端' : '右端'} ${c ? '● 实心' : '○ 空心'}</button>` : '');
      return `<span class="iv-name ${k}">$${k}=${ivTex(s)}$</span>${btn('lo', s.loC, Number.isFinite(s.lo))}${btn('hi', s.hiC, Number.isFinite(s.hi))}`;
    }).join('<br>') + `<br><button type="button" class="btn sm${st.show === 'cap' ? ' solid' : ''}" data-show="cap">看 $A\\cap B$</button><button type="button" class="btn sm${st.show === 'cup' ? ' solid' : ''}" data-show="cup">看 $A\\cup B$</button>`;
    tex($('ivCtrl'));
  };
  b.onUpdate = () => {
    handles.forEach(({ g, k, end }) => { g.style.display = Number.isFinite(st[k][end]) ? '' : 'none'; });
    ctrl();
    const cup = join(st.A, st.B);
    const cupTex = cup.length === 1 ? ivTex(cup[0]) : `${ivTex(cup[0])}\\cup${ivTex(cup[1])}`;
    $('ivOut').innerHTML = `<span class="${st.show === 'cap' ? 'cur' : ''}">$A\\cap B=${ivTex(meet(st.A, st.B))}$</span><span class="${st.show === 'cup' ? 'cur' : ''}">$A\\cup B=${cupTex}$</span>`;
    tex($('ivOut'));
  };
  $('ivCtrl').addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.show) st.show = t.dataset.show;
    else { const k = t.dataset.k; const c = t.dataset.e === 'lo' ? 'loC' : 'hiC'; st[k] = { ...st[k], [c]: !st[k][c] }; }
    b.update();
  });
  $('ivPre').innerHTML = PRESETS.map((p, i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-p="${i}">${p.name}</button>`).join('');
  $('ivPre').addEventListener('click', (e) => {
    const t = e.target.closest('[data-p]');
    if (!t) return;
    const p = PRESETS[+t.dataset.p];
    st.A = iv(p.A); st.B = iv(p.B);
    $('ivPre').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === t));
    b.update();
  });
  b.update();
}

window.LESSON = {
  init() {
    initVenn();
    initIvlFigs();
    initIntervals();
  },
};
