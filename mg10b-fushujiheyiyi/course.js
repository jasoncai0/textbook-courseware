'use strict';
/* 高一下 12.3 复数的几何意义 · 本课互动：复平面拖点（含共轭）、例 1 点/向量、例 3 圆与圆环、加减法平行四边形、|z − z₀| 点集。通用部分见 ../shared/math.js */
const { board, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const snap = (v) => Math.round(v * 2) / 2;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const NS = 'http://www.w3.org/2000/svg';

/* a + bi 的 TeX（a、b 为任意实数，按 fmt 显示） */
function cx(a, b) {
  const [A, B] = [+fmt(a), +fmt(b)];
  if (B === 0) return String(A);
  const coef = Math.abs(B) === 1 ? '' : String(Math.abs(B));
  if (A === 0) return `${B < 0 ? '-' : ''}${coef}\\mathrm i`;
  return `${A}${B < 0 ? '-' : '+'}${coef}\\mathrm i`;
}
function where(a, b) {
  if (a === 0 && b === 0) return '原点：表示实数 0';
  if (b === 0) return '在<b>实轴</b>上：表示实数';
  if (a === 0) return '在<b>虚轴</b>上（非原点）：表示纯虚数';
  const q = a > 0 ? (b > 0 ? '一' : '四') : (b > 0 ? '二' : '三');
  return `在第${q}象限：表示虚数`;
}
function addMarker(b, id, color) {
  b.svg.querySelector('defs').insertAdjacentHTML('beforeend',
    `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="16" markerHeight="16" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L10 5L0 10z" fill="${color}"/></marker>`);
}
const arrow = (b, s, id, cls = 'c1') => { const l = b.seg(s, { cls }); l.setAttribute('marker-end', `url(#${id})`); return l; };
/* 复平面：等比例坐标系，标“实轴”“虚轴” */
function plane(el, x, y, w) {
  const b = board(el, { x, y, w, labels: ['x', 'y'] });
  b.text([x[1], 0], '实轴', { cls: 'lb up ax-t', dx: -46, dy: -10 });
  b.text([0, y[1]], '虚轴', { cls: 'lb up ax-t', dx: -50, dy: 22 });
  addMarker(b, `${el.id}A1`, '#1d6fa5');
  addMarker(b, `${el.id}A2`, '#d9711c');
  return b;
}
/* 画在网格之上、曲线之下的填充路径（圆、圆环） */
function backPath(b, cls) {
  const p = document.createElementNS(NS, 'path');
  p.setAttribute('class', cls);
  p.setAttribute('fill-rule', 'evenodd');
  b.svg.insertBefore(p, b.svg.children[2]);
  return p;
}
const circleD = (b, cx0, cy0, r) => `M${b.X(cx0 - r)} ${b.Y(cy0)} A${b.X(r) - b.X(0)} ${b.X(r) - b.X(0)} 0 1 0 ${b.X(cx0 + r)} ${b.Y(cy0)} A${b.X(r) - b.X(0)} ${b.X(r) - b.X(0)} 0 1 0 ${b.X(cx0 - r)} ${b.Y(cy0)}Z`;

/* 第 3 页：拖动 Z，读出复数；可显示共轭与模 */
function initPlane() {
  const s = { z: [1, 2] };
  const conj = $('cpConj');
  const b = plane($('cp'), [-4.4, 4.4], [-3.4, 3.4], 560);
  b.seg(() => [s.z, [s.z[0], 0]], { cls: 'dash' });
  b.seg(() => [s.z, [0, s.z[1]]], { cls: 'dash' });
  arrow(b, () => [[0, 0], s.z], 'cpA1');
  const cj = arrow(b, () => [[0, 0], [s.z[0], -s.z[1]]], 'cpA2', 'c2 dash');
  b.pt(() => [s.z[0], -s.z[1]], { cls: 'c2', show: () => conj.checked });
  b.text(() => [s.z[0], -s.z[1]], 'Z̄', { dx: 10, dy: 22 });
  b.text(() => s.z, () => `Z(${fmt(s.z[0])}, ${fmt(s.z[1])})`, { cls: 'lb up', dx: 12, dy: -12 });
  b.drag(() => s.z, (x, y) => { s.z = [clamp(snap(x), -4, 4), clamp(snap(y), -3, 3)]; });
  b.onUpdate = () => {
    const [a, bb] = s.z;
    cj.style.display = conj.checked ? '' : 'none';
    b.svg.querySelectorAll('text').forEach((t) => { if (t.textContent === 'Z̄') t.style.display = conj.checked ? '' : 'none'; });
    const extra = conj.checked ? `<br>$\\bar z=${cx(a, -bb)}$，与 $Z$ 关于实轴对称；$|z|=|\\bar z|=\\sqrt{${fmt(a * a + bb * bb)}}\\approx${fmt(Math.hypot(a, bb))}$` : '';
    $('cpMsg').innerHTML = `点 $Z(${fmt(a)},${fmt(bb)})$ 表示 $z=${cx(a, bb)}$，${where(a, bb)}。${extra}`;
    tex($('cpMsg'));
  };
  conj.addEventListener('change', () => b.update());
  b.update();
}

/* 第 5 页：例 1，图 12-3-4 */
const EX1 = [['A', 4, 0], ['B', 2, 1], ['C', 0, -1], ['D', -1, 3], ['E', 3, -2]];
function initEx1() {
  const b = plane($('ex1'), [-2.2, 5.2], [-2.8, 3.8], 520);
  const vecs = EX1.map(([, x, y]) => arrow(b, [[0, 0], [x, y]], 'ex1A1'));
  EX1.forEach(([n, x, y]) => { b.pt([x, y], { cls: 'c2', r: 6 }); b.text([x, y], n, { dx: 8, dy: -8 }); });
  const show = (mode) => {
    vecs.forEach((v) => { v.style.display = mode === 'vec' ? '' : 'none'; });
    document.querySelectorAll('[data-ex1]').forEach((btn) => btn.classList.toggle('solid', btn.dataset.ex1 === mode));
  };
  document.querySelectorAll('[data-ex1]').forEach((btn) => btn.addEventListener('click', () => show(btn.dataset.ex1)));
  b.update();
  show('pt');
}

/* 第 6 页：例 3，|z| = 2 与 2 < |z| < 3 */
function initRing3() {
  const s = { z: [1.2, 1.6], mode: 'eq' };
  const b = plane($('ring3'), [-3.8, 3.8], [-3.4, 3.4], 480);
  const band = backPath(b, 'band');
  const c2 = b.curve((t) => [2 * Math.cos(t), 2 * Math.sin(t)], 0, 2 * Math.PI, { cls: 'c1' });
  const c3 = b.curve((t) => [3 * Math.cos(t), 3 * Math.sin(t)], 0, 2 * Math.PI, { cls: 'c1 dash2' });
  const r = () => Math.hypot(...s.z);
  const ok = () => (s.mode === 'eq' ? Math.abs(r() - 2) < 1e-9 : r() > 2 && r() < 3);
  b.seg(() => [[0, 0], s.z], { cls: 'dash' });
  b.pt(() => s.z, { cls: 'good', r: 9, show: ok });
  b.pt(() => s.z, { cls: 'bad', r: 9, show: () => !ok() });
  b.text(() => s.z, 'Z', { dx: 12, dy: -10 });
  b.drag(() => s.z, (x, y) => {
    let p = [clamp(x, -3.6, 3.6), clamp(y, -3.2, 3.2)];
    const d = Math.hypot(...p);
    if (s.mode === 'eq' && Math.abs(d - 2) < 0.12 && d > 0) p = [(p[0] * 2) / d, (p[1] * 2) / d]; // 靠近圆时吸附
    s.z = p;
  }, { r: 0.01, hit: 22 });
  b.onUpdate = () => {
    const eq = s.mode === 'eq';
    band.setAttribute('d', eq ? '' : circleD(b, 0, 0, 3) + circleD(b, 0, 0, 2));
    c2.setAttribute('class', eq ? 'c1' : 'c1 dash2');
    c3.style.display = eq ? 'none' : '';
    const msg = $('ringMsg');
    msg.className = `tip feedback ${ok() ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = `$|z|=|\\overrightarrow{OZ}|\\approx${fmt(r())}$：${ok() ? '<b>满足</b>条件' : '不满足'}${eq ? '（靠近圆时会吸附到圆上）' : ''}`;
    tex(msg);
  };
  document.querySelectorAll('[data-ring]').forEach((btn) => btn.addEventListener('click', () => {
    s.mode = btn.dataset.ring;
    document.querySelectorAll('[data-ring]').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  }));
  b.update();
}

/* 第 7 页：加法平行四边形 / 减法向量 Z₂Z₁ */
function initVec() {
  const s = { z1: [3, 1], z2: [1, 2.5], op: 'add' };
  const b = plane($('vec'), [-3.4, 5.4], [-3.2, 4.4], 560);
  const sum = () => [s.z1[0] + s.z2[0], s.z1[1] + s.z2[1]];
  const dif = () => [s.z1[0] - s.z2[0], s.z1[1] - s.z2[1]];
  const Z = () => (s.op === 'add' ? sum() : dif());
  b.poly(() => (s.op === 'add' ? [[0, 0], s.z1, sum(), s.z2] : [[0, 0], dif(), s.z1, s.z2]), { cls: 'para' });
  arrow(b, () => [[0, 0], s.z1], 'vecA1');
  arrow(b, () => [[0, 0], s.z2], 'vecA1');
  const d21 = arrow(b, () => [s.z2, s.z1], 'vecA2', 'c2');
  arrow(b, () => [[0, 0], Z()], 'vecA2', 'c2');
  b.pt(Z, { cls: 'c2', r: 6 });
  b.text(Z, 'Z', { dx: 10, dy: -8 });
  b.text(() => s.z1, 'Z₁', { dx: 12, dy: 6 });
  b.text(() => s.z2, 'Z₂', { dx: -30, dy: -6 });
  b.drag(() => s.z1, (x, y) => { s.z1 = [clamp(snap(x), -3, 5), clamp(snap(y), -3, 4)]; });
  b.drag(() => s.z2, (x, y) => { s.z2 = [clamp(snap(x), -3, 5), clamp(snap(y), -3, 4)]; });
  b.onUpdate = () => {
    d21.style.display = s.op === 'sub' ? '' : 'none';
    const [a, bb] = s.z1;
    const [c, d] = s.z2;
    const msg = $('vecMsg');
    msg.innerHTML = s.op === 'add'
      ? `$z_1=${cx(a, bb)}$，$z_2=${cx(c, d)}$<br>$z_1+z_2=(${fmt(a)}+${fmt(c)})+(${fmt(bb)}+${fmt(d)})\\mathrm i=${cx(a + c, bb + d)}$：平行四边形的对角线 $\\overrightarrow{OZ}$`
      : `$z_1=${cx(a, bb)}$，$z_2=${cx(c, d)}$<br>$z_1-z_2=${cx(a - c, bb - d)}$，对应 $\\overrightarrow{Z_2Z_1}$（平移到原点为 $\\overrightarrow{OZ}$）<br>$|z_1-z_2|=|Z_1Z_2|\\approx${fmt(Math.hypot(a - c, bb - d))}$`;
    tex(msg);
  };
  document.querySelectorAll('[data-op]').forEach((btn) => btn.addEventListener('click', () => {
    s.op = btn.dataset.op;
    document.querySelectorAll('[data-op]').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  }));
  b.update();
}

/* 第 8 页：|z − z₀| 的点集。c：|z−2|=1；d：|z−(1+2i)|≤2；b：|z+1|=|z−i| */
function initLocus() {
  const s = { z: [2.6, 0.8], mode: 'c' };
  const show = $('locShow');
  const b = plane($('loc'), [-3.4, 4.4], [-2.6, 4.6], 520);
  const disk = backPath(b, 'band');
  const circ = b.curve((t) => [2 + Math.cos(t), Math.sin(t)], 0, 2 * Math.PI, { cls: 'c3' });
  const circ2 = b.curve((t) => [1 + 2 * Math.cos(t), 2 + 2 * Math.sin(t)], 0, 2 * Math.PI, { cls: 'c3' });
  const line = b.seg([[-2.6, 2.6], [3.4, -3.4]], { cls: 'c3' });
  const P = { c: [[2, 0]], d: [[1, 2]], b: [[-1, 0], [0, 1]] };
  const dists = () => P[s.mode].map((p) => Math.hypot(s.z[0] - p[0], s.z[1] - p[1]));
  const ok = () => {
    const ds = dists();
    if (s.mode === 'c') return Math.abs(ds[0] - 1) < 1e-9;
    if (s.mode === 'd') return ds[0] <= 2 + 1e-9;
    return Math.abs(ds[0] - ds[1]) < 1e-9;
  };
  [0, 1].forEach((k) => {
    b.seg(() => { const p = P[s.mode][k]; return p ? [p, s.z] : [s.z, s.z]; }, { cls: 'dash' });
    b.pt(() => P[s.mode][k] || null, { r: 6 });
  });
  b.pt(() => s.z, { cls: 'good', r: 9, show: ok });
  b.pt(() => s.z, { cls: 'bad', r: 9, show: () => !ok() });
  b.text(() => s.z, 'Z', { dx: 12, dy: -10 });
  b.drag(() => s.z, (x, y) => {
    let p = [clamp(x, -3, 4), clamp(y, -2.4, 4.4)];
    if (s.mode === 'c') { const d = Math.hypot(p[0] - 2, p[1]); if (Math.abs(d - 1) < 0.1 && d > 0) p = [2 + (p[0] - 2) / d, p[1] / d]; }
    if (s.mode === 'b') { const t = (p[0] - p[1]) / 2; if (Math.abs(p[0] + p[1]) / Math.SQRT2 < 0.1) p = [t, -t]; } // 靠近直线 y = −x 时吸附
    s.z = p;
  }, { r: 0.01, hit: 22 });
  b.onUpdate = () => {
    const m = s.mode;
    const ans = show.checked;
    circ.style.display = ans && m === 'c' ? '' : 'none';
    circ2.style.display = ans && m === 'd' ? '' : 'none';
    line.style.display = ans && m === 'b' ? '' : 'none';
    disk.setAttribute('d', ans && m === 'd' ? circleD(b, 1, 2, 2) : '');
    const ds = dists().map((v) => fmt(v));
    const txt = m === 'c' ? `$|z-2|$ = $Z$ 到 $(2,0)$ 的距离 $\\approx${ds[0]}$`
      : m === 'd' ? `$|z-(1+2\\mathrm i)|$ = $Z$ 到 $(1,2)$ 的距离 $\\approx${ds[0]}$`
        : `$|z+1|$ = $Z$ 到 $(-1,0)$ 的距离 $\\approx${ds[0]}$；$|z-\\mathrm i|$ = $Z$ 到 $(0,1)$ 的距离 $\\approx${ds[1]}$`;
    const msg = $('locMsg');
    msg.className = `tip feedback ${ok() ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = `${txt}：${ok() ? '<b>满足</b>' : '不满足'}`;
    tex(msg);
  };
  document.querySelectorAll('[data-loc]').forEach((btn) => btn.addEventListener('click', () => {
    s.mode = btn.dataset.loc;
    document.querySelectorAll('[data-loc]').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  }));
  show.addEventListener('change', () => b.update());
  b.update();
}

window.LESSON = {
  init() {
    initPlane();
    initEx1();
    initRing3();
    initVec();
    initLocus();
  },
};
