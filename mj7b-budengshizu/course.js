'use strict';
/* 七下 11.6 一元一次不等式组 · 本课互动：到校时间轴、公共部分探测器、课本插图（图 11-11～11-14 与练习图）。
 * 通用部分见 ../shared/math.js、numline.js、ineq.js */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const mk = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  parent.appendChild(e);
  return e;
};
const tn = (v) => String(+v.toFixed(2));

/* ---------- 第 3 页：时间轴 7:30～8:05（按比例），到达时刻 = 3400 ÷ 速度 ---------- */
const DIST = 3400;
const T_MAX = 35;
function initTrip() {
  const svg = $('trip');
  const X = (t) => 30 + (t / T_MAX) * 340;
  const AY = 95;
  mk('rect', { x: X(20), y: AY - 30, width: X(25) - X(20), height: 30, fill: 'rgba(47,125,107,.25)' }, svg);
  mk('line', { x1: X(0), x2: X(T_MAX) + 8, y1: AY, y2: AY, stroke: '#1f2d3a', 'stroke-width': 2 }, svg);
  mk('path', { d: `M${X(T_MAX) + 14} ${AY} l-10 -5 v10z`, fill: '#1f2d3a' }, svg);
  for (let t = 0; t <= T_MAX; t += 5) {
    mk('line', { x1: X(t), x2: X(t), y1: AY - 5, y2: AY + 5, stroke: '#1f2d3a', 'stroke-width': 1.5 }, svg);
    const mm = 30 + t;
    mk('text', { x: X(t), y: AY + 22, class: 'tp-n' }, svg).textContent = mm < 60 ? `7:${mm}` : `8:0${mm - 60}`;
  }
  mk('text', { x: (X(20) + X(25)) / 2, y: AY - 36, class: 'tp-k' }, svg).textContent = '应在这段时间到';
  const dot = mk('circle', { r: 7, cy: AY }, svg);
  const lab = mk('text', { y: AY + 46, class: 'tp-t' }, svg);
  const inp = $('spd');
  const show = () => {
    const x = +inp.value;
    const t = DIST / x;
    const ok = t >= 20 && t <= 25;
    const xx = X(Math.min(t, T_MAX));
    dot.setAttribute('cx', xx);
    dot.setAttribute('fill', ok ? '#2f7d6b' : '#c0392b');
    lab.setAttribute('x', xx);
    lab.setAttribute('fill', ok ? '#2f7d6b' : '#c0392b');
    lab.textContent = `用时 ${tn(t)} min`;
    $('spdV').textContent = x;
    const msg = $('spdMsg');
    msg.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
    msg.textContent = t < 20 ? `太快：${tn(t)} min 就到了，早于 7:50．` : t > 25 ? `太慢：要 ${tn(t)} min，晚于 7:55．` : `用 ${tn(t)} min，在 7:50～7:55 之间到达 ✓`;
  };
  inp.addEventListener('input', show);
  show();
}

/* ---------- 课本插图：s 为 [端点, 不等号, 高度]；band 为 true 时画公共部分 ---------- */
function fig(id, o) {
  const { from, to } = o;
  const b = NumLine.board($(id), { from, to, y: o.y || [-1.25, 1.35], h: o.h || 140 });
  Ineq.axis(b, { from, to, marks: o.marks });
  if (o.band) Ineq.band(b, { part: Ineq.both(o.sets.map(([a, op]) => ({ a, op }))), from: from - 0.4, to: to + 0.4 });
  o.sets.forEach(([a, op, h, c]) => Ineq.ray(b, { a, op, h, from: from - 0.4, to: to + 0.4, cls: `iq-ray ${c || ''}`, dot: c || '' }));
  b.update();
}

/* ---------- 第 7 页：公共部分探测器 ---------- */
const OPS = ['>', '>=', '<', '<='];
const OPTEX = { '>': '\\gt', '>=': '\\ge', '<': '\\lt', '<=': '\\le' };
const PRESETS = [
  [[-1, '>'], [2, '>=']],
  [[3, '<'], [-1, '<=']],
  [[-2, '>='], [3, '<']],
  [[-2, '<'], [3, '>=']],
];
const H1 = 0.7;
const H2 = 1.25;
function initExplorer() {
  let st = { s: PRESETS[2].map(([a, op]) => ({ a, op })) };
  const b = NumLine.board($('exp'), { from: -6, to: 6, y: [-1.1, 1.95], h: 200 });
  NumLine.axis(b, { from: -6, to: 6 });
  const part = () => Ineq.both(st.s);
  Ineq.band(b, { part, from: -6.4, to: 6.5 });
  [H1, H2].forEach((h, i) => {
    Ineq.ray(b, { a: () => st.s[i].a, op: () => st.s[i].op, h, from: -6.4, to: 6.5, cls: `iq-ray r${i + 1}`, dot: `r${i + 1}` });
    b.drag(() => [st.s[i].a, h], (x) => {
      const a = Math.max(-5, Math.min(5, Math.round(x)));
      st = { s: st.s.map((v, k) => (k === i ? { ...v, a } : v)) };
    }, { r: 7, hit: 18 });
  });
  const kind = () => {
    const [p, q] = st.s.map((v) => Ineq.right(v.op));
    if (p && q) return '都是“大于”：取较大的端点';
    if (!p && !q) return '都是“小于”：取较小的端点';
    return part().empty ? '一个大于、一个小于，两段<b>不重叠</b>' : '一个大于、一个小于，两段<b>重叠</b>：取中间';
  };
  b.onUpdate = () => {
    st.s.forEach((v, i) => { $(`op${i + 1}`).innerHTML = `$x${OPTEX[v.op]} ${tn(v.a)}$`; });
    $('expQ').innerHTML = `$\\begin{cases}x${OPTEX[st.s[0].op]} ${tn(st.s[0].a)},\\\\x${OPTEX[st.s[1].op]} ${tn(st.s[1].a)}\\end{cases}$`;
    const p = part();
    const msg = $('expMsg');
    msg.className = `tip feedback ${p.empty ? 'fb-warn' : 'fb-ok'}`;
    msg.innerHTML = `${kind()}．解集：<b>$${Ineq.texOf(p)}$</b>`;
    tex($('exp').closest('.bd'));
  };
  [1, 2].forEach((n) => $(`op${n}`).addEventListener('click', () => {
    st = { s: st.s.map((v, k) => (k === n - 1 ? { ...v, op: OPS[(OPS.indexOf(v.op) + 1) % OPS.length] } : v)) };
    b.update();
  }));
  $('presets').addEventListener('click', (e) => {
    const t = e.target.closest('[data-p]');
    if (!t) return;
    st = { s: PRESETS[+t.dataset.p].map(([a, op]) => ({ a, op })) };
    b.update();
  });
  b.update();
}

window.LESSON = {
  init() {
    initTrip();
    initExplorer();
    fig('f1111', { from: -10, to: 200, marks: [0, 136, 170], sets: [[136, '>=', 1.0], [170, '<=', 0.6]], band: true, h: 150 });
    fig('f1112', { from: -4, to: 4, marks: [-1, 0, 2], sets: [[2, '<', 1.0], [-1, '<=', 0.6]] });
    fig('f1113', { from: -1, to: 4, marks: [0, 1, 2], sets: [[1, '>=', 1.0], [2, '>', 0.6]] });
    fig('f1114', { from: -4, to: 5, marks: [-2, 0, 3], sets: [[-2, '<', 0.7], [3, '>=', 0.7]] });
    fig('p1a', { from: -4, to: 4, marks: [-2, 0, 2], sets: [[2, '<=', 1.0], [-2, '>', 0.6]], h: 120 });
    fig('p1b', { from: -2, to: 7, marks: [0, 3, 5], sets: [[5, '<', 1.0], [3, '<=', 0.6]], h: 120 });
    fig('h1a', { from: -7, to: 2, marks: [-5, -1, 0], sets: [[-1, '<', 1.0], [-5, '>=', 0.6]], h: 120 });
    fig('h1b', { from: -6, to: 2, marks: [-4, -2, 0], sets: [[-4, '>', 1.0], [-2, '>=', 0.6]], h: 120 });
    fig('f6', { from: 0, to: 60, marks: [0, 25, 43], sets: [[25, '>', 1.0], [43, '<', 0.6]], band: true, h: 120 });
  },
};
