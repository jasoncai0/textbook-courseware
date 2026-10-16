'use strict';
/* 七下 11.4 解一元一次不等式 · 本课互动：同解流水线（每一步的解集由式子算出、在数轴上逐行对比）与课本插图。
 * 通用部分见 ../shared/math.js、numline.js、ineq.js */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);
const m = NumLine.minus;

/* 一次不等式 p·x + q  op  r·x + s 的解集（p ≠ r） */
const FLIP = { '>': '<', '<': '>', '>=': '<=', '<=': '>=' };
function solve({ p, q, op, r, s }) {
  const A = p - r;
  const B = s - q;
  return { a: B / A, op: A > 0 ? op : FLIP[op] };
}
const L = (p, q, op, r, s) => ({ p, q, op, r, s });

/* 流水线题目：每一步两个候选，ok 为正确变形；lin 用来算这一步的解集 */
const PROBLEMS = [
  {
    t: '例 1', tex: '14-2x\\gt 6', lin: L(-2, 14, '>', 0, 6),
    steps: [
      { n: '移项', opts: [
        { tex: '-2x\\gt 6-14', lin: L(-2, 0, '>', 0, -8), ok: true, why: '14 移到右边变成 −14．' },
        { tex: '-2x\\gt 6+14', lin: L(-2, 0, '>', 0, 20), why: '移项要变号：14 从左边移到右边应变成 −14．' }] },
      { n: '合并同类项', opts: [
        { tex: '-2x\\gt 8', lin: L(-2, 0, '>', 0, 8), why: '6 − 14 = −8，不是 8．' },
        { tex: '-2x\\gt -8', lin: L(-2, 0, '>', 0, -8), ok: true, why: '6 − 14 = −8．' }] },
      { n: '两边都除以 −2', opts: [
        { tex: 'x\\gt 4', lin: L(1, 0, '>', 0, 4), why: '除以负数 −2，不等号的方向要<b>改变</b>．' },
        { tex: 'x\\lt 4', lin: L(1, 0, '<', 0, 4), ok: true, why: '因为 −2 &lt; 0，所以不等号的方向改变．' }] },
    ],
  },
  {
    t: '练一练 (2)', tex: '5-x\\lt 1', lin: L(-1, 5, '<', 0, 1),
    steps: [
      { n: '移项', opts: [
        { tex: '-x\\lt 1-5', lin: L(-1, 0, '<', 0, -4), ok: true, why: '5 移到右边变成 −5．' },
        { tex: '-x\\lt 1+5', lin: L(-1, 0, '<', 0, 6), why: '移项要变号：5 移到右边应变成 −5．' }] },
      { n: '合并同类项', opts: [
        { tex: '-x\\lt -4', lin: L(-1, 0, '<', 0, -4), ok: true, why: '1 − 5 = −4．' },
        { tex: '-x\\lt 4', lin: L(-1, 0, '<', 0, 4), why: '1 − 5 = −4，不是 4．' }] },
      { n: '两边都除以 −1', opts: [
        { tex: 'x\\lt 4', lin: L(1, 0, '<', 0, 4), why: '除以负数 −1，方向要改变．' },
        { tex: 'x\\gt 4', lin: L(1, 0, '>', 0, 4), ok: true, why: '除以 −1（负数），方向改变．' }] },
    ],
  },
  {
    t: '练一练 (4)', tex: '-\\dfrac12x-1\\gt 2', lin: L(-0.5, -1, '>', 0, 2),
    steps: [
      { n: '移项', opts: [
        { tex: '-\\dfrac12x\\gt 2-1', lin: L(-0.5, 0, '>', 0, 1), why: '−1 移到右边应变成 +1．' },
        { tex: '-\\dfrac12x\\gt 2+1', lin: L(-0.5, 0, '>', 0, 3), ok: true, why: '−1 移到右边变成 +1．' }] },
      { n: '合并同类项', opts: [
        { tex: '-\\dfrac12x\\gt 3', lin: L(-0.5, 0, '>', 0, 3), ok: true, why: '2 + 1 = 3．' },
        { tex: '\\dfrac12x\\gt 3', lin: L(0.5, 0, '>', 0, 3), why: '系数 −½ 的负号不能丢．' }] },
      { n: '两边都乘 −2', opts: [
        { tex: 'x\\lt -6', lin: L(1, 0, '<', 0, -6), ok: true, why: '乘负数 −2，方向改变．' },
        { tex: 'x\\gt -6', lin: L(1, 0, '>', 0, -6), why: '乘负数 −2，不等号的方向要<b>改变</b>．' }] },
    ],
  },
];

const FROM = -12;
const TO = 12;
const ROW0 = 0.42;
const ROWH = 0.42;
function initPipeline() {
  let st = { k: 0, picks: [] }; // picks[i] = 第 i 步选中的候选下标
  const P = () => PROBLEMS[st.k];
  const b = NumLine.board($('plBoard'), { from: FROM, to: TO, y: [-1.15, 2.35], h: 230, pad: 2.4 });
  NumLine.axis(b, { from: FROM, to: TO, step: 2, minor: 1 });
  const setOf = (row) => {
    if (row === 0) return solve(P().lin);
    const i = st.picks[row - 1];
    return i === undefined ? null : solve(P().steps[row - 1].opts[i].lin);
  };
  const isBad = (row) => row > 0 && st.picks[row - 1] !== undefined && !P().steps[row - 1].opts[st.picks[row - 1]].ok;
  for (let row = 0; row <= 3; row++) {
    const h = ROW0 + row * ROWH;
    const show = () => row <= P().steps.length && !!setOf(row);
    const good = () => show() && !isBad(row);
    const bad = () => show() && isBad(row);
    Ineq.ray(b, { a: () => (setOf(row) || { a: 0 }).a, op: () => (setOf(row) || { op: '>' }).op, h, from: FROM - 0.4, to: TO + 0.5, show: good, cls: row ? 'iq-ray r1' : 'iq-ray', dot: row ? 'r1' : '' });
    Ineq.ray(b, { a: () => (setOf(row) || { a: 0 }).a, op: () => (setOf(row) || { op: '>' }).op, h, from: FROM - 0.4, to: TO + 0.5, show: bad, cls: 'iq-ray bad', dot: 'bad' });
    b.text([FROM - 0.6, h], row ? `第${row}步` : '原式', { cls: 'pl-row', dy: 5 });
  }
  const msg = $('plMsg');
  const say = (html, cls) => { msg.className = `tip feedback ${cls}`; msg.innerHTML = html; tex(msg); };
  const render = () => {
    const p = P();
    const done = st.picks.filter((i, n) => p.steps[n].opts[i].ok).length;
    const rows = [`<div class="pl-line"><span class="pl-n">原不等式</span>$${p.tex}$</div>`];
    p.steps.forEach((s, n) => {
      if (n > done) return;
      const pick = st.picks[n];
      const chosen = pick !== undefined && s.opts[pick].ok;
      rows.push(`<div class="pl-line"><span class="pl-n">${s.n}</span>${chosen
        ? `$${s.opts[pick].tex}$ <span class="pl-ok">✓</span>`
        : s.opts.map((o, i) => `<button type="button" class="btn pl-opt${pick === i ? ' bad' : ''}" data-n="${n}" data-i="${i}">$${o.tex}$</button>`).join('')}</div>`);
    });
    $('plSteps').innerHTML = rows.join('');
    tex($('plSteps'));
    $('plTabs').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', +x.dataset.k === st.k));
    b.update();
  };
  $('plTabs').innerHTML = PROBLEMS.map((p, k) => `<button class="btn" type="button" data-k="${k}">${p.t}：$${p.tex}$</button>`).join('');
  tex($('plTabs'));
  $('plTabs').addEventListener('click', (e) => {
    const t = e.target.closest('[data-k]');
    if (!t) return;
    st = { k: +t.dataset.k, picks: [] };
    say('先看原不等式的解集（黑色）．每选一步，数轴上就多一行这一步的解集．', '');
    render();
  });
  $('plSteps').addEventListener('click', (e) => {
    const t = e.target.closest('.pl-opt');
    if (!t) return;
    const n = +t.dataset.n;
    const i = +t.dataset.i;
    const o = P().steps[n].opts[i];
    st = { ...st, picks: [...st.picks.slice(0, n), i] };
    const S = solve(o.lin);
    const S0 = solve(P().lin);
    const setTex = Ineq.texOf(Ineq.both([S]));
    if (o.ok) {
      const last = n === P().steps.length - 1;
      say(`✓ ${o.why} 这一步的解集仍是 $${Ineq.texOf(Ineq.both([S0]))}$，与原不等式相同．${last ? '<b>解完了！</b>' : ''}`, 'fb-ok');
    } else {
      say(`✗ ${o.why} 按这一步算，解集变成 $${setTex}$（红色虚线），和原不等式的解集不同——变形出错了．`, 'fb-warn');
    }
    render();
  });
  say('先看原不等式的解集（黑色）．每选一步，数轴上就多一行这一步的解集．', '');
  render();
}

/* 课本插图与答案图 */
function fig(id, o) {
  const from = o.from ?? -4;
  const to = o.to ?? 5;
  const b = NumLine.board($(id), { from, to, y: o.y || [-1.25, 1.05], h: o.h || 120 });
  Ineq.axis(b, { from, to, marks: o.marks || [] });
  (o.fracs || []).forEach(([v, t, d, dy]) => Ineq.frac(b, v, t, d, { dy }));
  (o.sets || []).forEach((s) => Ineq.ray(b, { a: s.a, op: s.op, h: s.h ?? 0.7, from: from - 0.4, to: to + 0.4, cls: `iq-ray ${s.c || ''}`, dot: s.c || '' }));
  (o.pts || []).forEach((v) => b.pt([v, 0], { r: 6, cls: 'pos-dot' }));
  b.update();
}

window.LESSON = {
  init() {
    initPipeline();
    fig('f115', { from: -3, to: 14, marks: [0, 10], sets: [{ a: 10, op: '>' }] });
    fig('f116', { from: -3, to: 7, marks: [0, 4], sets: [{ a: 4, op: '<' }] });
    fig('f117', { from: -3, to: 4, marks: [0, 1], sets: [{ a: 1, op: '>=' }] });
    fig('f118', { from: -5, to: 3, marks: [-2, 0], sets: [{ a: -2, op: '>' }] });
    fig('fPr', {
      from: -8, to: 7, marks: [-6, 0, 2, 4], fracs: [[1.5, '3', '2', 18]], y: [-1.9, 1.75], h: 170,
      sets: [{ a: 2, op: '>', h: 0.45, c: 'r1' }, { a: 4, op: '>', h: 0.8, c: 'r2' }, { a: 1.5, op: '<=', h: 1.15, c: 'r3' }, { a: -6, op: '<', h: 1.5 }],
    });
    fig('fP130', {
      from: -5, to: 10, marks: [-3, 0, 4, 6, 8], y: [-1.25, 1.75], h: 150,
      sets: [{ a: 4, op: '>', h: 0.45, c: 'r1' }, { a: -3, op: '>=', h: 0.8, c: 'r2' }, { a: 8, op: '<=', h: 1.15, c: 'r3' }, { a: 6, op: '>', h: 1.5 }],
    });
    fig('fPos', { from: -2, to: 6, marks: [0, 1, 2, 3, 4], sets: [{ a: 4, op: '<=' }], pts: [1, 2, 3, 4] });
  },
};
