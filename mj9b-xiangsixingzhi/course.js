'use strict';
/* 九下 6.5 相似三角形的性质 · 本课互动：中点三角形、相似比 k 与 k²（含 k² 等分）、对应线段实验、课本插图。
 * 所有三角形由坐标计算；相似三角形 = 同一个三角形按 k 缩放的坐标，读数实时度量。 */
const { slider, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const { add, sub, mul, dist, lerp, foot } = Geo;
const cross = (u, v) => u[0] * v[1] - u[1] * v[0];
const area = (T) => Math.abs(cross(sub(T[1], T[0]), sub(T[2], T[0]))) / 2;
const perim = (T) => dist(T[0], T[1]) + dist(T[1], T[2]) + dist(T[2], T[0]);

MProof.addBasis({
  aa: { t: '两角分别相等的两个三角形相似', kind: '判定', src: '九下 6.4（课本 p55）', body: '两角分别相等的两个三角形相似．' },
  'sas-s': { t: '两边成比例且夹角相等的两个三角形相似', kind: '判定', src: '九下 6.4（课本 p58）', body: '两边成比例且夹角相等的两个三角形相似．' },
});

/* 顶点字母放在三角形外侧 */
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
    });
  };
}

/* 第 3 页：中点三角形 */
function initMid() {
  let s = { A: [2.3, 4.4], B: [0, 0], C: [5.6, 0] };
  const b = Geo.board($('midBd'), { x: [-0.6, 6.4], y: [-0.6, 4.9], w: 480 });
  const M = () => ({ D: lerp(s.B, s.C, 0.5), E: lerp(s.C, s.A, 0.5), F: lerp(s.A, s.B, 0.5) });
  b.poly(() => [s.A, s.B, s.C], { cls: 'pa' });
  b.poly(() => { const m = M(); return [m.D, m.E, m.F]; }, { cls: 'pb' });
  const lab = placeOut(b, () => [s.A, s.B, s.C], ['A', 'B', 'C']);
  [['D', -4, 22], ['E', 8, 0], ['F', -20, 0]].forEach(([n, dx, dy]) => b.text(() => M()[n], n, { dx, dy }));
  ['A', 'B', 'C'].forEach((n) => b.drag(() => s[n], (x, y) => {
    const nx = { ...s, [n]: [Math.min(6.2, Math.max(-0.4, x)), Math.min(4.7, Math.max(-0.4, y))] };
    if (Math.abs(cross(sub(nx.C, nx.B), sub(nx.A, nx.B))) > 1.2) s = nx;
  }, { r: 7, hit: 16 }));
  b.onUpdate = () => {
    lab();
    const m = M();
    const T = [s.A, s.B, s.C];
    const U = [m.D, m.E, m.F];
    $('midMsg').className = 'tip feedback small-d fb-ok';
    $('midMsg').textContent = `周长：△DEF ${fmt(perim(U), 2)}，△ABC ${fmt(perim(T), 2)}，比 ${fmt(perim(U) / perim(T), 3)}；面积：${fmt(area(U), 2)}，${fmt(area(T), 2)}，比 ${fmt(area(U) / area(T), 3)}`;
  };
  b.update();
}

/* 第 4 页：k 与 k² */
const BASE = [[1.1, 2.1], [0, 0], [2.8, 0]];
function initK() {
  const s = { k: 2, tile: false };
  const O2 = [4.4, 0];
  const T = BASE.map((p) => add(p, [0, 0]));
  const U = () => BASE.map((p) => add(O2, mul(p, s.k)));
  const b = Geo.board($('kBd'), { x: [-0.4, 13.2], y: [-0.6, 6.8], w: 640 });
  b.poly(T, { cls: 'pa' });
  b.poly(U, { cls: 'pb' });
  // k² 等分：平行于三边、在 i/k 处的线段
  const MAXK = 3;
  for (let side = 0; side < 3; side++) {
    for (let i = 1; i < MAXK; i++) {
      b.seg(() => {
        const n = Math.round(s.k);
        const P = U();
        if (!s.tile || Math.abs(s.k - n) > 1e-6 || i >= n) return [[0, 0], [0, 0]];
        const [V, X, Y] = [P[side], P[(side + 1) % 3], P[(side + 2) % 3]];
        return [lerp(V, X, i / n), lerp(V, Y, i / n)];
      }, { cls: 'tile' });
    }
  }
  b.seg([T[0], foot(T[0], T[1], T[2])], { cls: 'hgt' });
  b.seg(() => { const P = U(); return [P[0], foot(P[0], P[1], P[2])]; }, { cls: 'hgt' });
  const l1 = placeOut(b, () => T, ['A', 'B', 'C']);
  const l2 = placeOut(b, U, ['A′', 'B′', 'C′']);
  const bar = (label, v, max, color) => `<span>${label}</span><div class="bar"><i style="width:${Math.min(100, (v / max) * 100)}%;background:${color}"></i></div><b class="v">${fmt(v, 3)}</b>`;
  b.onUpdate = () => {
    l1(); l2();
    const P = U();
    const h1 = dist(T[0], foot(T[0], T[1], T[2]));
    const h2 = dist(P[0], foot(P[0], P[1], P[2]));
    $('kKV').textContent = fmt(s.k, 1);
    $('kRead').innerHTML = bar('相似比 k', s.k, 9, '#1d6fa5')
      + bar('周长比', perim(P) / perim(T), 9, '#d9711c')
      + bar('高的比', h2 / h1, 9, '#6b3f8a')
      + bar('面积比', area(P) / area(T), 9, '#2f7d6b')
      + bar('k²', s.k * s.k, 9, '#9fcdb7');
    $('kTile').disabled = Math.abs(s.k - Math.round(s.k)) > 1e-6 || Math.round(s.k) < 2;
  };
  slider($('kK'), (v) => { s.k = v; b.update(); });
  $('kTile').addEventListener('click', () => { s.tile = !s.tile; $('kTile').classList.toggle('solid', s.tile); b.update(); });
}

/* 第 9 页：对应线段 */
function initLines() {
  const s = { k: 1.5, t: 0.35, kind: 'h' };
  const O2 = [4.9, 0];
  const T = [[1.3, 2.4], [0, 0], [3.4, 0]];
  const U = () => T.map((p) => add(O2, mul(p, s.k)));
  const endOf = (P) => {
    const [A, B, C] = P;
    if (s.kind === 'h') return foot(A, B, C);
    if (s.kind === 'm') return lerp(B, C, 0.5);
    if (s.kind === 'b') return lerp(B, C, dist(A, B) / (dist(A, B) + dist(A, C)));
    return lerp(B, C, s.t);
  };
  const b = Geo.board($('lnBd'), { x: [-0.4, 12.8], y: [-0.7, 5.6], w: 640 });
  b.poly(T, { cls: 'pa' });
  b.poly(U, { cls: 'pb' });
  b.seg(() => [T[0], endOf(T)], { cls: 'hgt' });
  b.seg(() => { const P = U(); return [P[0], endOf(P)]; }, { cls: 'hgt' });
  const NM = { h: 'D', m: 'E', b: 'F', g: 'G' };
  b.text(() => endOf(T), () => NM[s.kind], { dx: -4, dy: 22 });
  b.text(() => endOf(U()), () => `${NM[s.kind]}′`, { dx: -4, dy: 22 });
  const l1 = placeOut(b, () => T, ['A', 'B', 'C']);
  const l2 = placeOut(b, U, ['A′', 'B′', 'C′']);
  const NAME = { h: '对应高', m: '对应中线', b: '对应角平分线', g: '对应线段（BG : B′G′ = AB : A′B′）' };
  b.onUpdate = () => {
    l1(); l2();
    const P = U();
    const x1 = dist(T[0], endOf(T));
    const x2 = dist(P[0], endOf(P));
    const n = NM[s.kind];
    $('lnKV').textContent = fmt(s.k, 1);
    $('lnMsg').className = 'tip feedback small-d fb-ok';
    $('lnMsg').textContent = `${NAME[s.kind]}：A${n} = ${fmt(x1, 3)}，A′${n}′ = ${fmt(x2, 3)}，A${n} : A′${n}′ = ${fmt(x1 / x2, 3)}；相似比 AB : A′B′ = ${fmt(dist(T[0], T[1]) / dist(P[0], P[1]), 3)}`;
  };
  slider($('lnK'), (v) => { s.k = v; b.update(); });
  slider($('lnT'), (v) => { s.t = v; b.update(); });
  document.querySelectorAll('[data-ln]').forEach((btn) => btn.addEventListener('click', () => {
    s.kind = btn.dataset.ln;
    document.querySelectorAll('[data-ln]').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  }));
}

/* 静态插图 */
function initFigs() {
  const sk = (id, spec) => Geo.sketch($(id), spec);
  // 图 6-30：k = 1.4
  const T = [[1.6, 2.4], [0, 0], [2.6, 0]];
  const K = 1 / 1.4;
  const U = T.map((p) => mul(p, K));
  sk('f630a', { P: { A: T[0], B: T[1], C: T[2], D: foot(T[0], T[1], T[2]) }, seg: 'AB BC CA AD', right: [['D', 'C', 'A']], w: 220, pad: 0.5 });
  sk('f630b', { P: { 'A′': U[0], 'B′': U[1], 'C′': U[2], 'D′': foot(U[0], U[1], U[2]) }, seg: 'A′B′ B′C′ C′A′ A′D′', right: [['D′', 'C′', 'A′']], w: 220, pad: 0.5 + (T[2][0] - U[2][0]) / 2 });
  // 练习 3（p71）：AD = 4，DG = 3，AG = 5，∠C = 90°
  const C = [6.4, 4.8];
  const B = [10, 0];
  const t = 3 / 4.8;
  const F = lerp(B, C, t);
  sk('p71c', { P: { A: [0, 0], B, C, D: [4, 0], E: [F[0], 0], F, G: [4, 3] }, seg: 'AB BC CA DG GF FE', right: [['C', 'A', 'B'], ['D', 'B', 'G'], ['E', 'B', 'F']], w: 300, pad: 0.6 });
  // 例 2（图 6-34）：DE = 6，BC = 10，AG = 7.5，GF = 5（缩小 0.3 倍画）
  const z = 0.3;
  const A = [0, 12.5 * z];
  const B2 = [-4.5 * z, 0];
  const C2 = [5.5 * z, 0];
  sk('f634', { P: { A, B: B2, C: C2, D: lerp(A, B2, 0.6), E: lerp(A, C2, 0.6), F: [0, 0], G: [0, 5 * z] }, seg: 'AB BC CA DE AF', right: [['F', 'C', 'A']], w: 220, pad: 0.5, lab: { G: [6, 18], F: [-4, 22] } });
  // 练习 1（p73）：AD = 3/5·AB，AE = 3/5·AC
  const A3 = [2.3, 4.2];
  const B3 = [0, 0];
  const C3 = [5.6, 0];
  const D3 = lerp(A3, C3, (0.6 * dist(A3, B3)) / dist(A3, C3));
  const E3 = lerp(A3, B3, (0.6 * dist(A3, C3)) / dist(A3, B3));
  sk('p73a', { P: { A: A3, B: B3, C: C3, D: D3, E: E3, F: lerp(B3, C3, 0.5), G: lerp(D3, E3, 0.5) }, seg: 'AB BC CA DE AF AG', w: 260, pad: 0.5, lab: { G: [-4, 22], F: [-4, 22] } });
  // 练习 3（p73）：AB = AC = 5，BC = 6，正方形边长 2.4
  sk('p73c', { P: { A: [0, 4], B: [-3, 0], C: [3, 0], D: [-1.2, 2.4], G: [1.2, 2.4], E: [-1.2, 0], F: [1.2, 0] }, seg: 'AB BC CA DG DE GF', w: 260, pad: 0.5 });
}

window.LESSON = {
  init() {
    MProof.init();
    initMid();
    initK();
    initLines();
    initFigs();
    document.addEventListener('toggle', () => requestAnimationFrame(Geo.refresh), true);
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
