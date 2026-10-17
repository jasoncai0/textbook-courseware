'use strict';
/* 六上 稍复杂的分数实际问题 · 本课互动：例 2 “部分与其余”线段图（两种想法，可换练一练的题）、
 * 例 3 “比……多（少）几分之几”比较线段图（单位 1 与比较量按份数精确画，减少的部分用虚线）。
 * 数值用分数精确计算。通用部分见 ../shared/math.js、mcheck.js、fracfig.js */
const { tex } = MathKit;
const { el, gcd } = FracFig;
const $ = (id) => document.getElementById(id);
const BLUE = '#6fb7e6';
const PINK = '#f3a6c0';
const GREEN = '#4cae6e';

/* 精确分数 */
const Q = (n, d = 1) => { const g = gcd(n, d) || 1; return { n: n / g, d: d / g }; };
const qmul = (a, b) => Q(a.n * b.n, a.d * b.d);
const qadd = (a, b) => Q(a.n * b.d + b.n * a.d, a.d * b.d);
const qsub = (a, b) => Q(a.n * b.d - b.n * a.d, a.d * b.d);
const qt = (a) => (a.d === 1 ? `${a.n}` : `\\dfrac{${a.n}}{${a.d}}`);
const qs = (a) => (a.d === 1 ? `${a.n}` : `${a.n}/${a.d}`);
const say = (id, html, ok = true) => {
  const m = $(id);
  m.className = `tip feedback readout-big ${ok ? 'fb-ok' : ''}`;
  m.innerHTML = html;
  tex(m);
};
function presetButtons(box, list, onPick) {
  list.forEach((P, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'btn'; b.dataset.p = i; b.textContent = P.name;
    box.appendChild(b);
  });
  box.addEventListener('click', (e) => { const b = e.target.closest('[data-p]'); if (b) onPick(+b.dataset.p); });
}
const brace = (svg, x0, x1, y, up, color) => {
  const m = (x0 + x1) / 2;
  const s = up ? -1 : 1;
  el('path', { d: `M${x0} ${y}q0 ${10 * s} 12 ${10 * s}H${m - 12}q12 0 12 ${10 * s}q0 ${-10 * s} 12 ${-10 * s}H${x1 - 12}q12 0 12 ${-10 * s}`, fill: 'none', stroke: color, 'stroke-width': 2.5 }, svg);
};
const text = (svg, x, y, s, cls = '') => { el('text', { x, y, class: `bt ${cls}` }, svg).textContent = s; };

/* ---------- 第 3 页：部分与其余 ---------- */
const PART = [
  { name: '例 2', N: Q(45), unit: '人', known: '男运动员', ask: '女运动员', a: 5, b: 9, q: '45 人中男运动员占 $\\dfrac59$，女运动员有多少人？' },
  { name: '练一练 1', N: Q(150), unit: '页', known: '已看', ask: '没看', a: 2, b: 3, q: '150 页的书，已经看了 $\\dfrac23$，还剩多少页？' },
  { name: '练一练 2', N: Q(28), unit: '只', known: '白兔', ask: '黑兔', a: 3, b: 7, q: '兔子共 28 只，白兔占 $\\dfrac37$，黑兔有多少只？' },
  { name: '练一练 3', N: Q(4, 5), unit: '吨', known: '第一天', ask: '第二天', a: 3, b: 8, q: '两天用纸 $\\dfrac45$ 吨，第一天用了 $\\dfrac38$，第二天用多少吨？' },
];
const B3 = { x: 120, w: 800, y: 55, h: 40 };
function initPage3() {
  const svg = $('bar3');
  const st = { p: 0, r: -1 };
  const render = () => {
    const P = PART[st.p];
    const { x, w, y, h } = B3;
    const pw = w / P.b;
    const kw = pw * P.a;
    svg.innerHTML = '';
    const drawn = st.r >= 0;
    el('rect', { x, y, width: drawn ? kw : w, height: h, fill: drawn ? BLUE : '#e6f1fa' }, svg);
    if (drawn) {
      el('rect', { x: x + kw, y, width: w - kw, height: h, fill: PINK }, svg);
      for (let i = 1; i < P.b; i += 1) el('line', { x1: x + i * pw, x2: x + i * pw, y1: y, y2: y + h, stroke: '#fff', 'stroke-width': 2 }, svg);
    }
    el('rect', { x, y, width: w, height: h, fill: 'none', stroke: '#2a4256', 'stroke-width': 2.5 }, svg);
    brace(svg, x, x + w, y - 6, true, '#1d6fa5');
    text(svg, x + w / 2, y - 30, `${qs(P.N)} ${P.unit}（单位 1）`);
    if (!drawn) return;
    const kv = qmul(P.N, Q(P.a, P.b));
    const rv = qsub(P.N, kv);
    brace(svg, x, x + kw, y + h + 6, false, '#1d6fa5');
    brace(svg, x + kw, x + w, y + h + 6, false, '#c2185b');
    text(svg, x + kw / 2, y + h + 46, `${P.known}占 ${P.a}/${P.b}`, 's');
    text(svg, (x + kw + x + w) / 2, y + h + 46, `${P.ask}：?`, 's');
    if (st.r === 1) text(svg, x + kw / 2, y + h + 72, `${qs(kv)} ${P.unit}`, 'hot');
    if (st.r === 2) text(svg, (x + kw + x + w) / 2, y + h + 72, `占 ${P.b - P.a}/${P.b}`, 'hot');
    if (st.r >= 1) text(svg, (x + kw + x + w) / 2, y + h + 96, `${qs(rv)} ${P.unit}`, 'hot');
  };
  const MSG = (P) => {
    const kv = qmul(P.N, Q(P.a, P.b));
    const rv = qsub(P.N, kv);
    const f = `\\dfrac{${P.a}}{${P.b}}`;
    return [
      `把 $${qt(P.N)}$ ${P.unit}平均分成 ${P.b} 份，${P.known}占 ${P.a} 份，其余是${P.ask}。`,
      `$${qt(P.N)}\\times${f}=${qt(kv)}$，$${qt(P.N)}-${qt(kv)}=${qt(rv)}$（${P.unit}）`,
      `$1-${f}=${qt(Q(P.b - P.a, P.b))}$，$${qt(P.N)}\\times${qt(Q(P.b - P.a, P.b))}=${qt(rv)}$（${P.unit}）`,
    ];
  };
  const show = () => {
    const P = PART[st.p];
    $('q3').innerHTML = P.q;
    tex($('q3'));
    $('presets3').querySelectorAll('button').forEach((b) => b.classList.toggle('solid', +b.dataset.p === st.p));
    render();
    if (st.r < 0) say('msg3', '点“补充线段图”。', false);
    else say('msg3', MSG(P)[st.r]);
  };
  presetButtons($('presets3'), PART, (i) => { st.p = i; st.r = -1; show(); });
  document.querySelectorAll('[data-r3]').forEach((b) => b.addEventListener('click', () => { st.r = +b.dataset.r3; show(); }));
  show();
}

/* ---------- 第 6 页：比……多（少）几分之几 ---------- */
const CMP = [
  { name: '例 3', N: 24, unit: '个', base: '去年', cmp: '今年', sign: 1, a: 1, b: 6, word: '增加', q: '去年 24 个班级，今年比去年增加了 $\\dfrac16$。今年有多少个班级？' },
  { name: '练一练 1', N: 750, unit: '千克', base: '白菜', cmp: '萝卜', sign: -1, a: 3, b: 5, word: '少', q: '白菜 750 千克，萝卜比白菜少 $\\dfrac35$。萝卜有多少千克？' },
  { name: '练一练 2', N: 63, unit: '吨', base: '九月', cmp: '十月', sign: 1, a: 2, b: 7, word: '多', q: '九月捕鱼 63 吨，十月比九月多捕 $\\dfrac27$。十月捕鱼多少吨？' },
  { name: '练习十三 4', N: 64, unit: '台', base: '去年', cmp: '今年', sign: 1, a: 3, b: 8, word: '增加', q: '去年 64 台计算机，今年比去年增加 $\\dfrac38$。今年有多少台？' },
  { name: '练习十三 5', N: 12, unit: '小时', base: '原来', cmp: '高铁', sign: -1, a: 3, b: 5, word: '缩短', q: '原来约 12 小时，时间缩短了 $\\dfrac35$。乘高铁约多少小时？' },
];
const C6 = { x: 130, maxW: 780, y1: 60, y2: 140, h: 36 };
function initPage6() {
  const svg = $('cmp6');
  const st = { p: 0, r: 0 };
  const render = () => {
    const P = CMP[st.p];
    const { x, y1, y2, h } = C6;
    const pw = C6.maxW / (P.b + (P.sign > 0 ? P.a : 0));
    const bw = pw * P.b;
    svg.innerHTML = '';
    text(svg, x - 12, y1 + h / 2 + 8, P.base, 'end');
    el('rect', { x, y: y1, width: bw, height: h, fill: BLUE }, svg);
    for (let i = 1; i < P.b; i += 1) el('line', { x1: x + i * pw, x2: x + i * pw, y1, y2: y1 + h, stroke: '#fff', 'stroke-width': 2 }, svg);
    el('rect', { x, y: y1, width: bw, height: h, fill: 'none', stroke: '#2a4256', 'stroke-width': 2.5 }, svg);
    brace(svg, x, x + bw, y1 - 6, true, '#1d6fa5');
    text(svg, x + bw / 2, y1 - 28, `${P.N} ${P.unit}（单位 1，平均分成 ${P.b} 份）`, 's');
    if (st.r < 1) return;
    text(svg, x - 12, y2 + h / 2 + 8, P.cmp, 'end');
    const keep = P.sign > 0 ? P.b : P.b - P.a;
    const total = P.sign > 0 ? P.b + P.a : P.b - P.a;
    el('rect', { x, y: y2, width: keep * pw, height: h, fill: BLUE }, svg);
    if (P.sign > 0) el('rect', { x: x + bw, y: y2, width: P.a * pw, height: h, fill: GREEN }, svg);
    else el('rect', { x: x + keep * pw, y: y2, width: P.a * pw, height: h, fill: 'none', stroke: '#c0392b', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, svg);
    const tot = P.sign > 0 ? P.b + P.a : P.b;
    for (let i = 1; i < tot; i += 1) el('line', { x1: x + i * pw, x2: x + i * pw, y1: y2, y2: y2 + h, stroke: i < keep || P.sign > 0 ? '#fff' : '#e7b7b0', 'stroke-width': 2 }, svg);
    el('rect', { x, y: y2, width: total * pw, height: h, fill: 'none', stroke: '#2a4256', 'stroke-width': 2.5 }, svg);
    el('line', { x1: x + bw, x2: x + bw, y1: y1 + h, y2: y2, stroke: '#9fb0bf', 'stroke-dasharray': '3 4', 'stroke-width': 1.5 }, svg);
    const ex0 = x + keep * pw;
    const ex1 = ex0 + P.a * pw;
    brace(svg, ex0, ex1, y2 + h + 6, false, P.sign > 0 ? GREEN : '#c0392b');
    const diff = qmul(Q(P.N), Q(P.a, P.b));
    text(svg, (ex0 + ex1) / 2, y2 + h + 44, `${P.word} ${P.a}/${P.b}${st.r === 2 ? ` = ${qs(diff)} ${P.unit}` : ''}`, 's');
    brace(svg, x, x + total * pw, y2 + h + 58, false, '#1d6fa5');
    text(svg, x + (total * pw) / 2, y2 + h + 96, `${P.cmp}：${total} 份${st.r >= 2 ? ` = ${qs(qmul(Q(P.N), Q(total, P.b)))} ${P.unit}` : ''}`, 'hot');
  };
  const show = () => {
    const P = CMP[st.p];
    $('q6').innerHTML = P.q;
    tex($('q6'));
    $('presets6').querySelectorAll('button').forEach((b) => b.classList.toggle('solid', +b.dataset.p === st.p));
    render();
    const f = `\\dfrac{${P.a}}{${P.b}}`;
    const op = P.sign > 0 ? '+' : '-';
    const diff = qmul(Q(P.N), Q(P.a, P.b));
    const ans = P.sign > 0 ? qadd(Q(P.N), diff) : qsub(Q(P.N), diff);
    const MSG = [
      `“${P.cmp}比${P.base}${P.word} $${f}$”：<b>${P.base}</b>是单位 1。先说含义，再点“画出比较量的线段”。`,
      `${P.base}平均分成 ${P.b} 份，${P.cmp}${P.sign > 0 ? '多' : '少'} ${P.a} 份，是 ${P.sign > 0 ? P.b + P.a : P.b - P.a} 份。`,
      `${P.word}的：$${P.N}\\times${f}=${qt(diff)}$；${P.cmp}：$${P.N}${op}${qt(diff)}=${qt(ans)}$（${P.unit}）`,
      `${P.cmp}是${P.base}的 $1${op}${f}$：$${P.N}\\times\\left(1${op}${f}\\right)=${P.N}\\times${qt(Q(P.b + P.sign * P.a, P.b))}=${qt(ans)}$（${P.unit}）`,
    ];
    say('msg6', MSG[st.r], st.r > 0);
  };
  presetButtons($('presets6'), CMP, (i) => { st.p = i; st.r = 0; show(); });
  document.querySelectorAll('[data-r6]').forEach((b) => b.addEventListener('click', () => { st.r = +b.dataset.r6; show(); }));
  show();
}

window.LESSON = {
  init() {
    initPage3();
    initPage6();
    FracFig.exact();
  },
};
