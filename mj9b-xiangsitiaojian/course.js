'use strict';
/* 九下 6.4 探索三角形相似的条件 · 本课互动：平行线分线段成比例、例 1 滑块、三个判定实验台（两角 / 两边夹角 / 三边）、重心、课本插图。
 * 所有点由坐标计算：判定实验台里的 △A′B′C′ 严格按给定条件作出，角度和比值实时度量；静态图按题目数据精确作出。 */
const { slider, fmt, board } = MathKit;
const $ = (id) => document.getElementById(id);
const { add, sub, mul, dist, dir, angle, lerp, meet, foot, rot } = Geo;
const ang = (V, A, B) => angle(V, A, B);
const cross = (u, v) => u[0] * v[1] - u[1] * v[0];

MProof.addBasis({
  'px-fd': { t: '两条直线被一组平行线所截，所得的对应线段成比例', kind: '基本事实', src: '九下 6.4（课本 p53）', body: '两条直线被一组平行线所截，所得的对应线段成比例．' },
  'yu-bei': { t: '平行于三角形一边的直线截得的三角形与原三角形相似', kind: '定理', src: '九下 6.4 例 1（课本 p54）', body: '平行于三角形一边的直线与其他两边相交，所截得的三角形与原三角形相似．' },
  aa: { t: '两角分别相等的两个三角形相似', kind: '判定', src: '九下 6.4（课本 p55）', body: '两角分别相等的两个三角形相似．' },
  'sas-s': { t: '两边成比例且夹角相等的两个三角形相似', kind: '判定', src: '九下 6.4（课本 p58）', body: '两边成比例且夹角相等的两个三角形相似．' },
  'sss-s': { t: '三边成比例的两个三角形相似', kind: '判定', src: '九下 6.4（课本 p60）', body: '三边成比例的两个三角形相似．' },
  'qd-sas': { t: '两边及其夹角分别相等的两个三角形全等（SAS）', kind: '基本事实', src: '八上 1.3 探索三角形全等的条件', body: '两边及其夹角分别相等的两个三角形全等，简写为“边角边”或“SAS”．' },
  'qd-sss': { t: '三边分别相等的两个三角形全等（SSS）', kind: '基本事实', src: '八上 1.3 探索三角形全等的条件', body: '三边分别相等的两个三角形全等，简写为“边边边”或“SSS”．' },
  'dy-xz': { t: '等边对等角', kind: '定理', src: '八上 2.5 等腰三角形的轴对称性', body: '等腰三角形的两个底角相等：$AB=AC$ ⇒ $\\angle B=\\angle C$．' },
  'tong-hu': { t: '同弧所对的圆周角相等', kind: '定理', src: '九上 2.4 圆周角', body: '同弧或等弧所对的圆周角相等．$\\angle BAE$ 与 $\\angle DCE$ 都对着 $\\overset{\\frown}{BE}$．' },
});

/* ---------- 第 3 页：平行线分线段成比例 ---------- */
const PAR_PRESETS = {
  1: { y2: 2.6, y3: 0, a: [[1, 5.4], [0, -1]], b: [[4, 5.4], [5.6, -1]] },
  2: { y2: 2.6, y3: 0, a: [[1.2, 5.4], [7.6, -1]], b: [[7.2, 5.4], [1.4, -1]] },
  3: { y2: 2.6, y3: 0, a: [[4.6, 5.4], [1.6, -0.6]], b: [[3.4, 5.4], [6.4, -0.6]] },
};
const Y1 = 4.2;
function initPar() {
  let s = JSON.parse(JSON.stringify(PAR_PRESETS[1]));
  const b = Geo.board($('parBd'), { x: [-1.2, 10.4], y: [-1.2, 5.6], w: 620 });
  const ys = () => [Y1, s.y2, s.y3];
  const at = (P, Q, y) => [P[0] + ((y - P[1]) * (Q[0] - P[0])) / (Q[1] - P[1]), y];
  const ptsA = () => ys().map((y) => at(s.a[0], s.a[1], y));
  const ptsB = () => ys().map((y) => at(s.b[0], s.b[1], y));
  [0, 1, 2].forEach((i) => {
    b.seg(() => [[-1.2, ys()[i]], [10.4, ys()[i]]], { cls: 'pl' });
    b.text(() => [10.4, ys()[i]], `l${'₁₂₃'[i]}`, { dx: -26, dy: -6 });
  });
  b.seg(() => s.a, { cls: 'tr-a' });
  b.seg(() => s.b, { cls: 'tr-b' });
  b.text(() => s.a[1], 'a', { dx: -14, dy: 4 });
  b.text(() => s.b[1], 'b', { dx: 6, dy: 4 });
  ['A', 'B', 'C'].forEach((n, i) => { b.pt(() => ptsA()[i], { r: 5 }); b.text(() => ptsA()[i], n, { dx: -22, dy: -6 }); });
  ['D', 'E', 'F'].forEach((n, i) => { b.pt(() => ptsB()[i], { r: 5 }); b.text(() => ptsB()[i], n, { dx: 8, dy: -6 }); });
  const clampEnd = (p, other) => {
    const y = Math.min(5.5, Math.max(-1.1, p[1]));
    const yy = Math.abs(y - other[1]) < 1 ? other[1] + (y >= other[1] ? 1 : -1) : y;
    return [Math.min(10.2, Math.max(-1, p[0])), yy];
  };
  ['a', 'b'].forEach((k) => [0, 1].forEach((j) => b.drag(() => s[k][j], (x, y) => {
    const np = clampEnd([x, y], s[k][1 - j]);
    s = { ...s, [k]: s[k].map((p, i) => (i === j ? np : p)) };
  }, { r: 7, hit: 16 })));
  b.drag(() => [-0.8, s.y2], (x, y) => { s = { ...s, y2: Math.min(Y1 - 0.5, Math.max(s.y3 + 0.5, y)) }; }, { r: 7, hit: 16 });
  b.drag(() => [-0.8, s.y3], (x, y) => { s = { ...s, y3: Math.min(s.y2 - 0.5, Math.max(-0.9, y)) }; }, { r: 7, hit: 16 });
  b.onUpdate = () => {
    const [A, B, C] = ptsA();
    const [D, E, F] = ptsB();
    const v = { AB: dist(A, B), BC: dist(B, C), DE: dist(D, E), EF: dist(E, F) };
    const row = (l, x) => `<span>${l}</span><b class="v">${fmt(x, 3)}</b>`;
    $('parRead').innerHTML = row('AB', v.AB) + row('DE', v.DE) + row('BC', v.BC) + row('EF', v.EF)
      + row('AB/BC', v.AB / v.BC) + row('DE/EF', v.DE / v.EF) + row('AB/AC', v.AB / (v.AB + v.BC)) + row('DE/DF', v.DE / dist(D, F));
  };
  document.querySelectorAll('[data-par]').forEach((btn) => btn.addEventListener('click', () => { s = JSON.parse(JSON.stringify(PAR_PRESETS[btn.dataset.par])); b.update(); }));
  b.update();
}

/* ---------- 第 4 页：例 1 ---------- */
function initEx1() {
  const s = { t: 0.35 };
  const A = [2, 4];
  const B = [0, 0];
  const C = [5.2, 0];
  const b = Geo.board($('ex1Bd'), { x: [-0.6, 5.8], y: [-0.7, 4.6], w: 420 });
  const D = () => lerp(A, B, s.t);
  const E = () => lerp(A, C, s.t);
  const F = () => lerp(B, C, 1 - s.t);
  b.poly([A, B, C], { cls: 'pa' });
  b.poly(() => [A, D(), E()], { cls: 'pb' });
  b.seg(() => [D(), F()], { cls: 'gdash' });
  [[() => A, 'A', -6, -12], [() => B, 'B', -18, 18], [() => C, 'C', 6, 18], [D, 'D', -20, 0], [E, 'E', 8, 0], [F, 'F', -4, 22]].forEach(([g, n, dx, dy]) => b.text(g, n, { dx, dy }));
  b.onUpdate = () => {
    $('ex1TV').textContent = fmt(s.t, 2);
    $('ex1Msg').className = 'tip feedback small-d fb-ok';
    $('ex1Msg').textContent = `AD/AB = ${fmt(dist(A, D()) / dist(A, B), 3)}，AE/AC = ${fmt(dist(A, E()) / dist(A, C), 3)}，DE/BC = ${fmt(dist(D(), E()) / dist(B, C), 3)}；DE = ${fmt(dist(D(), E()), 2)}，FC = ${fmt(dist(F(), C), 2)}`;
  };
  slider($('ex1T'), (v) => { s.t = v; b.update(); });
}

/* ---------- 判定实验台公用：表格 ---------- */
const NM = ['A', 'B', 'C'];
function labTable(el, T, U) {
  const a = [0, 1, 2].map((i) => ang(T[i], T[(i + 1) % 3], T[(i + 2) % 3]));
  const a2 = [0, 1, 2].map((i) => ang(U[i], U[(i + 1) % 3], U[(i + 2) % 3]));
  const r = [0, 1, 2].map((i) => dist(U[i], U[(i + 1) % 3]) / dist(T[i], T[(i + 1) % 3]));
  el.innerHTML = `<tr>${NM.map((n) => `<th>∠${n} / ∠${n}′</th>`).join('')}</tr>
    <tr>${a.map((x, i) => `<td class="${Math.abs(x - a2[i]) < 0.2 ? 'ok' : ''}">${fmt(x, 1)}° / ${fmt(a2[i], 1)}°</td>`).join('')}</tr>
    <tr><th>A′B′ : AB</th><th>B′C′ : BC</th><th>C′A′ : CA</th></tr>
    <tr>${r.map((x) => `<td class="${Math.abs(x - r[0]) < 0.002 ? 'ok' : ''}">${fmt(x, 3)}</td>`).join('')}</tr>`;
}
/* 把顶点字母放到三角形外侧（按重心方向） */
function placeOut(b, get, names) {
  const nodes = names.map((n) => b.text([0, 0], n));
  return () => {
    const w = b.svg.getBoundingClientRect().width;
    const k = w ? b.W / w : 1;
    const T = get();
    const c = Geo.centroid(T);
    T.forEach((p, i) => {
      const d = sub(p, c);
      const u = mul(d, 1 / (Math.hypot(...d) || 1));
      nodes[i].setAttribute('x', b.X(p[0]) + (u[0] * 18 - 6) * k);
      nodes[i].setAttribute('y', b.Y(p[1]) + (-u[1] * 18 + 8) * k);
      nodes[i].style.display = '';
    });
  };
}

/* ---------- 第 6 页：两角 ---------- */
function initAA() {
  const s = { al: 62, be: 58, L: 3.2, t: 0 };
  const BC = 4;
  const tri = (B, L) => {
    const ga = 180 - s.al - s.be;
    const BA = (L * Math.sin((ga * Math.PI) / 180)) / Math.sin((s.al * Math.PI) / 180);
    return [add(B, mul(dir(s.be), BA)), B, add(B, [L, 0])];
  };
  const T = () => tri([0, 0], BC);
  const U0 = () => tri([6.6, 0], s.L);
  const U = () => { const u = U0(); const d = mul(sub(T()[0], u[0]), s.t); return u.map((p) => add(p, d)); };
  const b = Geo.board($('aaBd'), { x: [-0.6, 11.8], y: [-0.7, 5.4], w: 640 });
  b.poly(T, { cls: 'pa' });
  b.poly(U, { cls: 'pb' });
  [0, 1].forEach((i) => {
    Geo.arc(b, () => T()[i], () => T()[(i + 1) % 3], () => T()[(i + 2) % 3], { r: 0.45, label: () => `${i ? s.be : s.al}°`, lr: 2 });
    Geo.arc(b, () => U()[i], () => U()[(i + 1) % 3], () => U()[(i + 2) % 3], { r: 0.38, label: () => (s.t > 0.98 && i === 0 ? '' : `${i ? s.be : s.al}°`), lr: 2.1, cls: 'garc a2' });
  });
  const lt = placeOut(b, T, ['A', 'B', 'C']);
  const lu = placeOut(b, U, ['A′', 'B′', 'C′']);
  b.onUpdate = () => {
    lt(); lu();
    $('aaAV').textContent = `${s.al}°`; $('aaBV').textContent = `${s.be}°`;
    labTable($('aaTab'), T(), U0());
  };
  const fix = () => { if (s.al + s.be > 165) s.be = 165 - s.al; $('aaB').value = s.be; b.update(); };
  slider($('aaA'), (v) => { s.al = v; fix(); });
  slider($('aaB'), (v) => { s.be = v; fix(); });
  slider($('aaL'), (v) => { s.L = v; b.update(); });
  let raf = 0;
  $('aaMove').addEventListener('click', () => {
    const from = s.t;
    const to = from > 0.5 ? 0 : 1;
    const t0 = performance.now();
    cancelAnimationFrame(raf);
    const step = (now) => {
      const p = Math.min(1, (now - t0) / 900);
      s.t = from + (to - from) * (p < 0.5 ? 2 * p * p : 1 - 2 * (1 - p) * (1 - p));
      b.update();
      if (p < 1) raf = requestAnimationFrame(step);
      else $('aaMove').textContent = to ? '移回原处' : '平移 △A′B′C′，使 A′ 与 A 重合';
    };
    raf = requestAnimationFrame(step);
  });
}

/* ---------- 第 9 页：两边及夹角 ---------- */
function initSAS() {
  const s = { al: 62, k: 0.5, cut: false };
  const AB = 4.2;
  const AC = 3.6;
  const tri = (A, k) => {
    const dB = 270 - s.al / 2 - 12;
    return [A, add(A, mul(dir(dB), AB * k)), add(A, mul(dir(dB + s.al), AC * k))];
  };
  const T = () => tri([2.6, 4.9], 1);
  const U = () => tri([9.6, 4.9], s.k);
  const b = Geo.board($('sasBd'), { x: [-1.8, 13], y: [0.3, 5.5], w: 640 });
  b.poly(T, { cls: 'pa' });
  b.poly(U, { cls: 'pb' });
  b.poly(() => (s.cut ? tri(T()[0], s.k) : []), { cls: 'pc' });
  b.text(() => (s.cut ? tri(T()[0], s.k)[1] : null), 'B″', { dx: -26, dy: 4 });
  b.text(() => (s.cut ? tri(T()[0], s.k)[2] : null), 'C″', { dx: 8, dy: 4 });
  Geo.arc(b, () => T()[0], () => T()[1], () => T()[2], { r: 0.5, label: () => `${s.al}°`, lr: 1.9 });
  Geo.arc(b, () => U()[0], () => U()[1], () => U()[2], { r: 0.4, label: () => `${s.al}°`, lr: 2, cls: 'garc a2' });
  const lt = placeOut(b, T, ['A', 'B', 'C']);
  const lu = placeOut(b, U, ['A′', 'B′', 'C′']);
  b.onUpdate = () => {
    lt(); lu();
    $('sasAV').textContent = `${s.al}°`; $('sasKV').textContent = fmt(s.k, 2);
    labTable($('sasTab'), T(), U());
  };
  slider($('sasA'), (v) => { s.al = v; b.update(); });
  slider($('sasK'), (v) => { s.k = v; b.update(); });
  $('sasCut').addEventListener('click', () => { s.cut = !s.cut; $('sasCut').classList.toggle('solid', !s.cut); b.update(); });
}

/* ---------- 第 12 页：三边（圆规作图） ---------- */
function circleMeet(P, r1, Q, r2, up) {
  const d = dist(P, Q);
  if (d > r1 + r2 || d < Math.abs(r1 - r2)) return null;
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
  const u = mul(sub(Q, P), 1 / d);
  const M = add(P, mul(u, a));
  const n = [-u[1], u[0]];
  return add(M, mul(n, up ? h : -h));
}
function initSSS() {
  let s = { A: [1.6, 4.3], B: [0, 0.6], C: [4.6, 0.6], k: 0.5, cut: false };
  const T = () => [s.A, s.B, s.C];
  const Bp = [6.6, 0.6];
  const U = () => {
    const [A, B, C] = T();
    const Cp = add(Bp, [s.k * dist(B, C), 0]);
    const up = cross(sub(C, B), sub(A, B)) > 0;
    const Ap = circleMeet(Bp, s.k * dist(A, B), Cp, s.k * dist(A, C), up) || Bp;
    return [Ap, Bp, Cp];
  };
  const b = Geo.board($('sssBd'), { x: [-0.6, 12.6], y: [-0.2, 5.6], w: 640 });
  b.poly(T, { cls: 'pa' });
  b.poly(U, { cls: 'pb' });
  const cutTri = () => { const [A, B, C] = T(); return [A, lerp(A, B, s.k), lerp(A, C, s.k)]; };
  b.poly(() => (s.cut ? cutTri() : []), { cls: 'pc' });
  b.text(() => (s.cut ? cutTri()[1] : null), 'B″', { dx: -26, dy: 4 });
  b.text(() => (s.cut ? cutTri()[2] : null), 'C″', { dx: 8, dy: 4 });
  // 圆规的两段弧：以 B′、C′ 为圆心，经过 A′
  [[1, 0], [2, 0]].forEach(([c]) => b.curve((t) => {
    const u = U();
    const O = u[c];
    const r = dist(O, u[0]);
    const a0 = Math.atan2(u[0][1] - O[1], u[0][0] - O[0]);
    const a = a0 + (t - 0.5) * 0.5;
    return [O[0] + r * Math.cos(a), O[1] + r * Math.sin(a)];
  }, 0, 1, { cls: 'cons-arc', n: 30 }));
  const lt = placeOut(b, T, ['A', 'B', 'C']);
  const lu = placeOut(b, U, ['A′', 'B′', 'C′']);
  ['A', 'B', 'C'].forEach((n) => b.drag(() => s[n], (x, y) => {
    const p = [Math.min(5.6, Math.max(-0.4, x)), Math.min(5.4, Math.max(0, y))];
    const nx = { ...s, [n]: p };
    if (Math.abs(cross(sub(nx.C, nx.B), sub(nx.A, nx.B))) > 1.2) s = nx;
  }, { r: 7, hit: 16 }));
  b.onUpdate = () => {
    lt(); lu();
    $('sssKV').textContent = fmt(s.k, 2);
    labTable($('sssTab'), T(), U());
  };
  slider($('sssK'), (v) => { s = { ...s, k: v }; b.update(); });
  $('sssCut').addEventListener('click', () => { s = { ...s, cut: !s.cut }; $('sssCut').classList.toggle('solid', !s.cut); b.update(); });
}

/* ---------- 第 15 页：重心 ---------- */
function initG() {
  let s = { A: [2.2, 4.2], B: [0, 0], C: [5, 0] };
  const b = Geo.board($('gBd'), { x: [-0.6, 5.8], y: [-0.6, 4.8], w: 420 });
  const M = () => ({ D: lerp(s.B, s.C, 0.5), E: lerp(s.C, s.A, 0.5), F: lerp(s.A, s.B, 0.5) });
  b.poly(() => [s.A, s.B, s.C], { cls: 'pa' });
  b.seg(() => [s.B, M().E], { cls: 'gs' });
  b.seg(() => [s.C, M().F], { cls: 'gs' });
  b.seg(() => [s.A, M().D], { cls: 'gs' });
  b.seg(() => [M().F, M().E], { cls: 'gdash' });
  const G = () => meet(s.B, M().E, s.C, M().F);
  const G2 = () => meet(s.A, M().D, s.B, M().E);
  b.pt(G, { r: 6, cls: 'gpt' });
  b.text(G, 'G', { dx: 8, dy: 18 });
  const lab = placeOut(b, () => [s.A, s.B, s.C], ['A', 'B', 'C']);
  [['D', -4, 22], ['E', 8, 0], ['F', -20, 0]].forEach(([n, dx, dy]) => b.text(() => M()[n], n, { dx, dy }));
  ['A', 'B', 'C'].forEach((n) => b.drag(() => s[n], (x, y) => {
    const nx = { ...s, [n]: [Math.min(5.6, Math.max(-0.4, x)), Math.min(4.6, Math.max(-0.4, y))] };
    if (Math.abs(cross(sub(nx.C, nx.B), sub(nx.A, nx.B))) > 1) s = nx;
  }, { r: 7, hit: 16 }));
  b.onUpdate = () => {
    lab();
    const g = G();
    const g2 = G2();
    if (!g || !g2) return;
    $('gMsg').className = 'tip feedback small-d fb-ok';
    $('gMsg').textContent = `G（BE 与 CF 的交点）与 G′（BE 与 AD 的交点）的距离 = ${fmt(dist(g, g2), 4)}；GE : GB = ${fmt(dist(g, M().E) / dist(g, s.B), 3)}`;
  };
  b.update();
}

/* ---------- 静态插图（按题目数据精确作出） ---------- */
/* 旋转相似：S(P) = A + r·R(θ)(P − A)；找 r 使 S(B)（或 S(C)）落在指定直线上 */
function solveR(f, lo, hi) {
  let a = lo;
  let fa = f(a);
  for (let i = 1; i <= 400; i++) {
    const x = lo + ((hi - lo) * i) / 400;
    const fx = f(x);
    if (fa * fx <= 0) {
      let [p, q] = [a, x];
      for (let k = 0; k < 50; k++) { const m = (p + q) / 2; if (f(p) * f(m) <= 0) q = m; else p = m; }
      return (p + q) / 2;
    }
    a = x; fa = fx;
  }
  return null;
}
const spiral = (A, th, r) => (P) => add(A, mul(rot(sub(P, A), th), r));

function initFigs() {
  const sk = (id, spec) => Geo.sketch($(id), spec);
  // 练习 1（p54）：AB : BC = 3 : 5
  const DD = [1.5, 8];
  const FF = [5, 0];
  sk('pr1Fig', {
    P: { A: [0, 8], B: [0, 5], C: [0, 0], D: DD, E: lerp(DD, FF, 3 / 8), F: FF, a: [0, -1.4], b: lerp(DD, FF, 1.18), l1: [-1, 8], m1: [6.5, 8], l2: [-1, 5], m2: [6.5, 5], l3: [-1, 0], m3: [6.5, 0] },
    seg: 'l1m1 l2m2 l3m3 Aa Db', hide: 'l1 m1 l2 m2 l3 m3', w: 300, pad: 0.8,
    lab: { A: [-20, -6], B: [-20, -6], C: [-20, -6], D: [6, -8], E: [8, -8], F: [10, -6], a: [-16, 4], b: [6, 4] },
    text: [[[0, 6.5], '3', -18, 6], [[0, 2.5], '5', -18, 6], [lerp(DD, FF, 3 / 16), '4', 8, 6]],
  });
  // 练习 2（p55）
  const O = [0, 0];
  const Dp = mul(dir(20), 5.2);
  const Dq = mul(dir(20), 3);
  const OA = mul(dir(42), 7.5);
  const OB = [8, 0];
  sk('pr2Fig', {
    P: { O, A: OA, B: OB, C: mul(dir(20), 7.6), D: Dp, 'D′': Dq, E: foot(Dp, O, OA), F: foot(Dp, O, OB), 'E′': foot(Dq, O, OA), 'F′': foot(Dq, O, OB) },
    seg: 'OA OB OC DE DF D′E′ D′F′', right: [['E', 'O', 'D'], ['F', 'O', 'D'], ['E′', 'O', 'D′'], ['F′', 'O', 'D′']], w: 320, pad: 0.6,
    lab: { O: [-18, 6], 'E′': [-22, -4], 'F′': [-8, 22], F: [-4, 22], 'D′': [-4, 22], D: [8, 4] },
  });
  // 例 2（图 6-15）
  const triAng = (B, BC, b, c) => { const a = 180 - b - c; const BA = (BC * Math.sin((c * Math.PI) / 180)) / Math.sin((a * Math.PI) / 180); return [add(B, mul(dir(b), BA)), B, add(B, [BC, 0])]; };
  const [a1, b1, c1] = triAng([0, 0], 2.4, 60, 70);
  sk('f615a', { P: { A: a1, B: b1, C: c1 }, seg: 'AB BC CA', ang: [['A', 'B', 'C', '50°', 0.35], ['B', 'A', 'C', '60°', 0.35]], w: 220, pad: 0.6 });
  const [a2, b2, c2] = triAng([0, 0], 3.6, 60, 70);
  sk('f615b', { P: { 'A′': a2, 'B′': b2, 'C′': c2 }, seg: 'A′B′ B′C′ C′A′', ang: [['B′', 'A′', 'C′', '60°', 0.4], ['C′', 'A′', 'B′', '70°', 0.4]], w: 220, pad: 0.6 });
  // 例 3（图 6-16）：AB = AC，∠BDE = ∠CAD
  const A3 = [0, 3.6];
  const B3 = [-2.2, 0];
  const C3 = [2.2, 0];
  const D3 = [-1.2, 0];
  const th = ang(A3, C3, D3);
  const E3 = meet(D3, add(D3, dir(180 - th)), A3, B3);
  sk('f616', { P: { A: A3, B: B3, C: C3, D: D3, E: E3 }, seg: 'AB BC CA AD DE', ang: [['D', 'B', 'E', '', 0.4], ['A', 'C', 'D', '', 0.7]], w: 280, pad: 0.6, lab: { E: [-22, -2], D: [-4, 22] } });
  // 练习 2（p57）：AE = 8，AD = 10，ED = 12，BC = 18
  const xE = -4.5;
  const h = Math.sqrt(64 - xE * xE);
  const K = 0.3;
  const E7 = [xE * K, h * K];
  const D7 = [(xE + 12) * K, h * K];
  sk('p57b', { P: { A: [0, 0], E: E7, D: D7, C: mul(E7, -1.5), B: mul(D7, -1.5) }, seg: 'ED BC EC DB', w: 240, pad: 0.6,
    text: [[lerp(E7, D7, 0.5), '12', -8, -8], [mul(E7, 0.5), '8', -16, 4], [mul(D7, 0.5), '10', 8, 4], [lerp(mul(E7, -1.5), mul(D7, -1.5), 0.5), '18', -8, 20]], lab: { A: [10, 6] } });
  // 练习 3（p57）：矩形 ABCD，DE ⊥ AC
  const R = { A: [0, 0], B: [5, 0], C: [5, 3], D: [0, 3] };
  sk('p57c', { P: { ...R, E: foot(R.D, R.A, R.C) }, seg: 'AB BC CD DA AC DE', right: [['E', 'D', 'C']], w: 260, pad: 0.6 });
  // 例 4（图 6-20）：E = 把 D 绕 B 旋转 ∠ABC 并放大 BC/BA 倍，于是 △ABD ∽ △CBE
  const A4 = [1.7, 3.6];
  const B4 = [0, 0];
  const C4 = [5, 0];
  const D4 = [2.1, 1.5];
  const rotAng = -ang(B4, A4, C4);
  const E4 = spiral(B4, rotAng, dist(B4, C4) / dist(B4, A4))(D4);
  sk('f620', { P: { A: A4, B: B4, C: C4, D: D4, E: E4 }, seg: 'AB BC CA AD BD DC BE CE DE', ang: [['B', 'A', 'D', '1', 0.6], ['B', 'C', 'E', '2', 0.8], ['A', 'B', 'D', '3', 0.5], ['C', 'B', 'E', '4', 0.45]], w: 300, pad: 0.6, lab: { D: [6, -8], E: [-4, 22] } });
  // 思考与探索（图 6-21）：AB = 4，AC = 2，∠A = 50°；AD = 1，AE = 8
  const A5 = [0, 0];
  sk('f621', { P: { A: A5, B: mul(dir(200), 4), C: mul(dir(250), 2), D: mul(dir(200), 1), E: mul(dir(250), 8) }, seg: 'AB BC AE DC BE', w: 240, pad: 0.6 });
  // 练习 2（p59）：∠1 = ∠DAB = ∠EAC
  const A6 = [0, 0];
  const B6 = [-6.5, -3];
  const C6 = [2.2, -3];
  sk('p59b', { P: { A: A6, B: B6, C: C6, D: mul(rot(B6, -32), 0.78), E: mul(rot(C6, -32), 0.74) }, seg: 'AB BC CA AD DE EA', ang: [['A', 'D', 'B', '1', 0.7], ['A', 'E', 'C', '2', 0.9]], w: 280, pad: 0.6 });
  // 练习 3（p59）：正方形边长 4，E 为 AD 中点，CF = 3FD
  sk('p59c', { P: { A: [0, 4], B: [0, 0], C: [4, 0], D: [4, 4], E: [2, 4], F: [4, 3] }, seg: 'AB BC CD DA BE EF', w: 220, pad: 0.6 });
  // 例 5（图 6-25）：△AED 由 △ABC 绕 A 旋转 30° 并缩放 r 得到，r 使 E 落在 BD 上
  const A7 = [0, 0];
  const B7 = [-0.6, -4.2];
  const C7 = [4.6, -4.3];
  const r7 = solveR((r) => { const S = spiral(A7, 30, r); return cross(sub(S(B7), B7), sub(S(C7), B7)); }, 0.3, 1.6);
  const S7 = spiral(A7, 30, r7);
  const E8 = S7(B7);
  const D8 = S7(C7);
  sk('f625', { P: { A: A7, B: B7, C: C7, D: D8, E: E8, F: meet(A7, C7, B7, D8) }, seg: 'AB BC CD DA AC BD AE', ang: [['A', 'B', 'E', '1', 0.7], ['A', 'C', 'D', '2', 0.9]], w: 280, pad: 0.6 });
  // 练习 3（p61）：△ADE 由 △ABC 绕 A 旋转 35° 缩放得到，D 落在 BE 上
  const A9 = [0, 0];
  const B9 = [-3, -5];
  const C9 = [1.2, -5.4];
  const r9 = solveR((r) => { const S = spiral(A9, 35, r); return cross(sub(S(B9), B9), sub(S(C9), B9)); }, 0.3, 1.6);
  const S9 = spiral(A9, 35, r9);
  sk('p61c', { P: { A: A9, B: B9, C: C9, D: S9(B9), E: S9(C9), F: meet(A9, C9, B9, S9(C9)) }, seg: 'AB BC CA AD AE BE DE', w: 240, pad: 0.6 });
  // 练习 2（p61）：坐标系
  const g = board($('p61b'), { x: [-1, 9], y: [-1, 9], ticks: 2, w: 300 });
  g.poly([[2, 0], [4, 0], [0, 4]], { cls: 'pa' });
  g.poly([[4, 0], [8, 0], [0, 8]], { cls: 'pb' });
  [[[2, 0], 'A', -4, -8], [[4, 0], 'B', -4, -8], [[0, 4], 'C', 8, 4], [[4, 0], 'A′', 0, 24], [[8, 0], 'B′', -6, -8], [[0, 8], 'C′', 8, 4]].forEach(([p, n, dx, dy]) => g.text(p, n, { dx, dy }));
  g.update();
  // 例 6（图 6-26）
  const Rr = 2.5;
  const on = (d) => mul(dir(d), Rr);
  const Ac = on(90);
  const Bc = on(212);
  const Cc = on(328);
  const Dc = lerp(Bc, Cc, 0.68);
  const u = sub(Dc, Ac);
  const tE = -2 * (Ac[0] * u[0] + Ac[1] * u[1]) / (u[0] * u[0] + u[1] * u[1]);
  const Ec = add(Ac, mul(u, tE));
  const cb = sk('f626', { P: { A: Ac, B: Bc, C: Cc, D: Dc, E: Ec, O: [0, 0] }, seg: 'AB BC CA AE BE CE', w: 240, pad: 0.7, lab: { O: [-18, 4], D: [-16, 18] } });
  cb.curve((t) => mul(dir(t * 360), Rr), 0, 1, { cls: 'gs', n: 120 });
  cb.pt([0, 0], { r: 3 });
  cb.update();
  // SSA 反例：AB = 4，AC = 5，∠A = 40°，k = 0.8
  const k = 0.8;
  const Aa = [0, 0];
  const Ba = [4, 0];
  const Ca = mul(dir(40), 5);
  const BCl = dist(Ba, Ca);
  const Ap = [5.6, 0];
  const Bp = add(Ap, [4 * k, 0]);
  const c40 = Math.cos((40 * Math.PI) / 180);
  const disc = Math.sqrt((k * BCl) ** 2 - (4 * k) ** 2 * (1 - c40 * c40));
  const C1 = add(Ap, mul(dir(40), 4 * k * c40 + disc));
  const C2 = add(Ap, mul(dir(40), 4 * k * c40 - disc));
  const ss = sk('ssaFig', { P: { A: Aa, B: Ba, C: Ca, 'A′': Ap, 'B′': Bp, 'C₁′': C1, 'C₂′': C2 }, seg: 'AB BC CA A′B′ B′C₁′ A′C₁′ B′C₂′', ang: [['A', 'B', 'C', '40°', 0.6], ['A′', 'B′', 'C₁′', '40°', 0.5]], w: 360, pad: 0.6, lab: { 'C₂′': [-28, -2], 'C₁′': [6, -8] } });
  ss.curve((t) => add(Bp, mul(dir(100 + t * 80), k * BCl)), 0, 1, { cls: 'cons-arc', n: 60 });
  ss.update();
  // 习题 5、7
  const xd = 3.6;
  sk('h5Fig', { P: { A: [0, 0], B: [5, 0], C: [xd, Math.sqrt(xd * (5 - xd))], D: [xd, 0] }, seg: 'AB BC CA CD', right: [['D', 'B', 'C'], ['C', 'A', 'B']], w: 260, pad: 0.5 });
  const P7 = { A: [1, 2.5], D: [6, 2.5], B: [0, 0], C: [5, 0], E: [2.5, 0] };
  sk('h7Fig', { P: { ...P7, F: meet(P7.A, P7.E, P7.B, P7.D) }, seg: 'AB BC CD DA AE BD', w: 260, pad: 0.5, lab: { F: [-4, 22] } });
}

window.LESSON = {
  init() {
    MProof.init();
    initPar();
    initEx1();
    initAA();
    initSAS();
    initSSS();
    initG();
    initFigs();
    document.addEventListener('toggle', () => requestAnimationFrame(Geo.refresh), true);
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
