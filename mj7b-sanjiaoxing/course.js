'use strict';
/* 七下 7.4 认识三角形 · 本课互动：量角量边分类、搭小木棒、拉橡皮筋找特殊位置、三条中线/角平分线/高。
 * 通用部分见 ../shared/math.js、../shared/mgeo.js；木棒按真实比例（1 格 = 1 cm），角度、长度都由坐标计算。 */
const { tex, fmt } = MathKit;
const { add, sub, mul, dir, dist, lerp, angle, meet, foot, centroid, line, arc, right, sketch } = Geo;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const perp = (v) => [-v[1], v[0]];
/** 角 V 的平分线与对边 PQ 的交点：分对边之比 = 两邻边之比 */
const bisFoot = (V, P, Q) => lerp(P, Q, dist(V, P) / (dist(V, P) + dist(V, Q)));

/* ---------- 第 3 页：图 7-21 与图 7-22 ---------- */
function apex(P, Q, h) { // 以 PQ 为底、高为 h 的等腰三角形顶点（底边左侧上方）
  const m = lerp(P, Q, 0.5);
  const v = sub(Q, P);
  const n = mul(perp(v), 1 / Math.hypot(...v));
  return add(m, mul(n, h));
}
function initF722() {
  const H = [7.4, 1.15]; const I = [8.65, 0.45];
  const K = [10.1, 1.2]; const L = [14.2, 0.35];
  const TRI = [
    { n: '①', P: { A: [0, 3.5], B: [2.1, 0], C: [0, 0] } },
    { n: '②', P: { D: [3.2, 0], E: [6.5, 2.43], F: [4.6, 2.95] } },
    { n: '③', P: { G: apex(H, I, 2.6), H, I } },
    { n: '④', P: { J: apex(K, L, dist(K, L) / 2), K, L } },
  ];
  const s = { m: '' };
  const b = Geo.board($('f722'), { x: [-0.6, 14.8], y: [-0.9, 3.9], w: 620 });
  TRI.forEach((t) => {
    const names = Object.keys(t.P);
    const pts = names.map((k) => t.P[k]);
    const c = centroid(pts);
    b.poly(pts, { cls: 'tri-s' });
    names.forEach((k, i) => {
      const p = t.P[k];
      const u = sub(p, c);
      const d = mul(u, 1 / Math.hypot(...u));
      b.text(p, k, { dx: d[0] * 14 - 6, dy: -d[1] * 14 + 7 });
      const [q, r] = pts.filter((_, j) => j !== i);
      // 角度标在角内，边长标在边外
      b.text(() => (s.m === 'ang' ? add(p, mul(d, -0.55)) : null), `${Math.round(angle(p, q, r))}°`, { cls: 'lb up gdeg', dx: -14, dy: 6 });
      const m = lerp(q, r, 0.5);
      const o = sub(m, c);
      b.text(() => (s.m === 'side' ? add(m, mul(o, 0.35 / Math.hypot(...o))) : null), fmt(dist(q, r), 1), { cls: 'lb up gdeg sd', dx: -12, dy: 6 });
    });
    b.text([c[0], -0.75], t.n, { cls: 'lb up', dx: -8, dy: 0 });
  });
  $('f722Btns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-m]');
    if (!btn) return;
    s.m = btn.dataset.m;
    $('f722Btns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn && !!s.m));
    b.update();
  });
  b.update();
}

/* ---------- 第 4 页：搭小木棒（图 7-23） ---------- */
const STICKS = [3, 4, 5, 6, 9];
const COMBOS = [];
for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) for (let k = j + 1; k < 5; k++) COMBOS.push([STICKS[i], STICKS[j], STICKS[k]]);
function initSticks() {
  const s = { sel: [3, 4, 5], tried: new Set() };
  const b = Geo.board($('stick'), { x: [-0.7, 9.7], y: [-1.0, 5.6], w: 540 });
  const geo = () => {
    const [a, bb, c] = [...s.sel].sort((x, y) => x - y);
    const ok = a + bb > c;
    // 最长的 c 放底边；a 绕左端、bb 绕右端转动
    const x = (a * a - bb * bb + c * c) / (2 * c);
    const P = ok ? [x, Math.sqrt(Math.max(0, a * a - x * x))] : null;
    return { a, bb, c, ok, P };
  };
  const full = () => s.sel.length === 3;
  b.curve((t) => { if (!full()) return [NaN, NaN]; const g = geo(); return mul(dir(t), g.a); }, 0, 180, { cls: 'reach', n: 90 });
  b.curve((t) => { if (!full()) return [NaN, NaN]; const g = geo(); return add([g.c, 0], mul(dir(t), g.bb)); }, 0, 180, { cls: 'reach', n: 90 });
  b.seg(() => (full() ? [[0, 0], [geo().c, 0]] : [[-9, -9], [-9, -9]]), { cls: 'stick' });
  b.seg(() => { if (!full()) return [[-9, -9], [-9, -9]]; const g = geo(); return [[0, 0], g.ok ? g.P : [g.a, 0.32]]; }, { cls: 'stick s2' });
  b.seg(() => { if (!full()) return [[-9, -9], [-9, -9]]; const g = geo(); return [[g.c, 0], g.ok ? g.P : [g.c - g.bb, 0.62]]; }, { cls: 'stick s3' });
  b.text(() => (full() ? [geo().c / 2, 0] : null), () => `${geo().c} cm`, { cls: 'lb up', dx: -18, dy: 26 });
  b.text(() => { if (!full()) return null; const g = geo(); return g.ok ? lerp([0, 0], g.P, 0.5) : [g.a / 2, 0.32]; }, () => `${geo().a} cm`, { cls: 'lb up', dx: -46, dy: -6 });
  b.text(() => { if (!full()) return null; const g = geo(); return g.ok ? lerp([g.c, 0], g.P, 0.5) : [g.c - g.bb / 2, 0.62]; }, () => `${geo().bb} cm`, { cls: 'lb up', dx: 8, dy: -8 });
  const renderTab = () => {
    const cell = (cb) => {
      const key = cb.join('、');
      const ok = cb[0] + cb[1] > cb[2];
      const res = s.tried.has(key) ? `<b class="${ok ? 'y' : 'n'}">${ok ? '能' : '不能'}</b>` : '<span class="q">？</span>';
      return `<td>${key}<br>${res}</td>`;
    };
    $('stickTab').innerHTML = `<tr>${COMBOS.slice(0, 5).map(cell).join('')}</tr><tr>${COMBOS.slice(5).map(cell).join('')}</tr>`;
  };
  b.onUpdate = () => {
    $('stickBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', s.sel.includes(+x.dataset.l)));
    const msg = $('stickMsg');
    if (!full()) { msg.className = 'tip feedback'; msg.textContent = `再选 ${3 - s.sel.length} 根。`; return; }
    const g = geo();
    s.tried.add([g.a, g.bb, g.c].join('、'));
    renderTab();
    msg.className = `tip feedback ${g.ok ? 'fb-ok' : 'fb-warn'}`;
    msg.textContent = g.ok
      ? `${g.a} + ${g.bb} = ${g.a + g.bb} > ${g.c}：两根木棒能在上方相交，搭成三角形。`
      : (g.a + g.bb === g.c
        ? `${g.a} + ${g.bb} = ${g.c}：两根木棒只能“躺平”在 ${g.c} cm 的木棒上，围不成三角形。`
        : `${g.a} + ${g.bb} = ${g.a + g.bb} < ${g.c}：两根木棒连起来还差 ${g.c - g.a - g.bb} cm，够不着。`);
  };
  $('stickBtns').innerHTML = STICKS.map((l) => `<button class="btn" type="button" data-l="${l}" style="--w:${l}">${l} cm</button>`).join('');
  $('stickBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-l]');
    if (!btn) return;
    const l = +btn.dataset.l;
    s.sel = s.sel.includes(l) ? s.sel.filter((x) => x !== l) : [...s.sel, l].slice(-3);
    b.update();
  });
  renderTab();
  b.update();
}

/* ---------- 第 7 页：橡皮筋（图 7-25） ---------- */
function initBand() {
  const A = [1.6, 3.2]; const B = [0, 0]; const C = [5, 0];
  const SP = { mid: lerp(B, C, 0.5)[0], bis: bisFoot(A, B, C)[0], alt: foot(A, B, C)[0] };
  const s = { x: 0.9, seen: new Set() };
  const P = () => [s.x, 0];
  const b = Geo.board($('band'), { x: [-0.6, 5.6], y: [-0.9, 3.7], w: 520 });
  b.poly([A, B, C], { cls: 'tri-s' });
  Object.entries(SP).forEach(([k, x]) => b.seg(() => (s.seen.has(k) ? [[x, -0.12], [x, 0.12]] : [[-9, -9], [-9, -9]]), { cls: `spt ${k}` }));
  b.seg(() => [A, P()], { cls: 'band' });
  arc(b, A, B, P, { r: 0.55, cls: 'garc' });
  arc(b, A, P, C, { r: 0.7, cls: 'garc g2' });
  right(b, P, A, C, { s: 0.25 });
  b.text(A, 'A', { dx: -5, dy: -10 }); b.text(B, 'B', { dx: -20, dy: 6 }); b.text(C, 'C', { dx: 6, dy: 6 });
  b.text(P, 'P', { dx: -5, dy: 26 });
  b.drag(P, (x) => {
    let v = clamp(x, 0.05, 4.95);
    Object.values(SP).forEach((t) => { if (Math.abs(v - t) < 0.06) v = t; });
    s.x = v;
  });
  const near = (t) => Math.abs(s.x - t) < 1e-6;
  b.onUpdate = () => {
    const bp = s.x;
    const pc = 5 - s.x;
    const a1 = angle(A, B, P());
    const a2 = angle(A, P(), C);
    const ap = angle(P(), A, B);
    $('bandR').textContent = `${fmt(bp, 2)} ∶ ${fmt(pc, 2)}`;
    $('bandA').textContent = `${fmt(a1, 1)}° ∶ ${fmt(a2, 1)}°`;
    $('bandP').textContent = `${fmt(ap, 1)}°`;
    const rightOn = near(SP.alt);
    b.svg.querySelector('.gright').style.display = rightOn ? '' : 'none';
    const msg = $('bandMsg');
    let t = '拖动橙色点，或点下面的按钮。';
    let ok = false;
    if (near(SP.mid)) { t = 'P 是 BC 的中点：BP = PC。'; ok = true; s.seen.add('mid'); }
    if (near(SP.bis)) { t = 'AP 平分 ∠BAC：∠BAP = ∠PAC。'; ok = true; s.seen.add('bis'); }
    if (rightOn) { t = 'AP ⊥ BC：∠APB = 90°。'; ok = true; s.seen.add('alt'); }
    msg.className = `tip feedback ${ok ? 'fb-ok' : ''}`;
    msg.textContent = t;
  };
  $('bandBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    s.x = SP[btn.dataset.k];
    b.update();
  });
  b.update();
}

/* ---------- 第 10 页：三条中线 / 角平分线 / 高 ---------- */
function initTri3() {
  const s = { m: 'med', P: [[1.6, 3.6], [0, 0], [5.4, 0]] };
  const b = Geo.board($('tri3'), { x: [-1.6, 7.6], y: [-2.4, 4.8], w: 520 });
  const V = (i) => () => s.P[i];
  const opp = (i) => [s.P[(i + 1) % 3], s.P[(i + 2) % 3]];
  const endOf = (i) => {
    const [Q, R] = opp(i);
    if (s.m === 'med') return lerp(Q, R, 0.5);
    if (s.m === 'bis') return bisFoot(s.P[i], Q, R);
    return foot(s.P[i], Q, R);
  };
  const center = () => {
    const [A, B, C] = s.P;
    if (s.m === 'med') return centroid(s.P);
    if (s.m === 'bis') return meet(A, bisFoot(A, B, C), B, bisFoot(B, C, A));
    return meet(A, foot(A, B, C), B, foot(B, C, A));
  };
  // 垂足在对边的延长线上时：虚线延长对边；交点在高的外面时：虚线延长高
  const NONE = [[-99, -99], [-99, -99]];
  const outside = (i) => {
    const [Q, R] = opp(i);
    const F = endOf(i);
    const t = Geo.dot(sub(F, Q), sub(R, Q)) / Geo.dot(sub(R, Q), sub(R, Q));
    return t < 0 ? [Q, F] : t > 1 ? [R, F] : null;
  };
  b.poly(() => s.P, { cls: 'tri-s' });
  [0, 1, 2].forEach((i) => {
    b.seg(() => (s.m === 'alt' && outside(i) ? outside(i) : NONE), { cls: 'gdash' });
    b.seg(() => {
      if (s.m !== 'alt') return NONE;
      const H = center();
      const F = endOf(i);
      const Pi = s.P[i];
      const t = Geo.dot(sub(H, Pi), sub(F, Pi)) / Geo.dot(sub(F, Pi), sub(F, Pi));
      return t < 0 ? [Pi, H] : t > 1 ? [F, H] : NONE;
    }, { cls: 'gdash' });
    b.seg(() => [s.P[i], endOf(i)], { cls: 'cev' });
    right(b, () => endOf(i), () => s.P[i], () => opp(i)[0], { s: 0.22 });
  });
  b.pt(center, { r: 6, cls: 'c2' });
  ['A', 'B', 'C'].forEach((n, i) => b.text(V(i), n, { dx: i === 0 ? -5 : i === 1 ? -20 : 8, dy: i === 0 ? -12 : 20 }));
  [0, 1, 2].forEach((i) => b.drag(V(i), (x, y) => { s.P = s.P.map((p, k) => (k === i ? [clamp(x, -1.2, 7.2), clamp(y, -1.6, 4.4)] : p)); }, { r: 7, hit: 16 }));
  b.onUpdate = () => {
    b.svg.querySelectorAll('.gright').forEach((g) => { g.style.display = s.m === 'alt' ? '' : 'none'; });
    const angs = s.P.map((p, i) => angle(p, ...opp(i)));
    const mx = Math.max(...angs);
    const kind = Math.abs(mx - 90) < 0.6 ? '直角' : mx > 90 ? '钝角' : '锐角';
    const where = {
      med: '三条中线交于一点，在三角形内部。',
      bis: '三条角平分线交于一点，在三角形内部。',
      alt: kind === '锐角' ? '三条高交于一点，在三角形内部。' : kind === '直角' ? '三条高交于直角顶点。' : '三条高所在的直线交于一点，在三角形外部（虚线是延长线）。',
    }[s.m];
    $('triMsg').className = 'tip feedback fb-ok';
    $('triMsg').textContent = `${kind}三角形（最大角 ${Math.round(mx)}°）：${where}`;
  };
  $('triBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    s.m = btn.dataset.k;
    $('triBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
  b.update();
}

/* ---------- 静态示意图 ---------- */
function figures() {
  sketch($('f721'), { P: { A: [4.3, 2.2], B: [0, 0], C: [4.6, 0] }, seg: 'AB BC CA', text: [[[2.3, 0], 'a', -4, 22, 'lb'], [[4.45, 1.1], 'b', 8, 6, 'lb'], [[2.15, 1.1], 'c', -16, -4, 'lb']] });
  // 图 7-24
  sketch($('f724'), { P: { A: [3.4, 2.0], B: [0, 0], C: [4.3, 0] }, seg: 'AB BC CA' });
  // 练一练 1（按课本图的比例）
  {
    const C = [0, 0]; const A = [0, 3.2]; const D = [1.8, 0]; const B = [5.625, 0];
    sketch($('lx1'), { P: { A, B, C, D, E: lerp(A, B, 0.596) }, seg: 'AC CB BA AD DE', right: [['C', 'A', 'B']] });
  }
  // 图 7-26：D 中点，E 角平分线与 BC 交点，F 垂足
  {
    const A = [3.7, 2.4]; const B = [0, 0]; const C = [4.8, 0];
    sketch($('f726'), { P: { A, B, C, D: lerp(B, C, 0.5), E: bisFoot(A, B, C), F: foot(A, B, C) }, seg: 'AB BC CA AD AE AF', right: [['F', 'A', 'C']], lab: { D: [-12, 22], E: [-4, 22], F: [2, 22] } });
  }
  // 图 7-27
  {
    const A = [2.15, 2.3]; const B = [0, 0]; const C = [2.7, 0];
    const D = bisFoot(A, B, C); const E = lerp(A, C, 0.5);
    sketch($('f727'), { P: { A, B, C, D, E, F: meet(A, D, B, E) }, seg: 'AB BC CA AD BE DE', lab: { F: [-18, -2], D: [-4, 22], E: [8, 2] } });
  }
  // 图 7-28
  {
    const B = [0, 0]; const C = [3.1, 0]; const A = [3.1, 2.2]; const D = [2.0, 0];
    sketch($('f728'), { P: { A, B, C, D, E: foot(D, A, B) }, seg: 'AB BC CA AD DE', right: [['C', 'A', 'B'], ['E', 'D', 'A']] });
  }
  // 习题 3：4 × 3 方格
  {
    const g = Geo.board($('xt3'), { x: [-0.6, 4.8], y: [-0.7, 3.6], w: 320 });
    for (let x = 0; x <= 4; x++) g.seg([[x, 0], [x, 3]], { cls: 'gridl' });
    for (let y = 0; y <= 3; y++) g.seg([[0, y], [4, y]], { cls: 'gridl' });
    const P = { A: [1, 0], B: [2, 0], C: [3, 0], D: [4, 2], E: [2, 3] };
    Object.entries(P).forEach(([n, p]) => { g.pt(p, { r: 4, cls: 'red' }); g.text(p, n, n === 'D' ? { dx: 8, dy: 6 } : n === 'E' ? { dx: -5, dy: -10 } : { dx: -5, dy: 24 }); });
    g.update();
  }
  // 习题 5：按题意作出的图
  {
    const A = [1.6, 2.6]; const B = [0, 0]; const C = [3.2, 0];
    const E = meet(A, add(A, perp(sub(B, A))), B, C);
    sketch($('xt5'), { P: { A, B, C, D: foot(A, B, C), E }, seg: 'AB BE CA AD AE', right: [['D', 'A', 'C'], ['A', 'B', 'E']], lab: { D: [-4, 22], C: [-2, 22] } });
  }
  sketch($('xt7'), { P: { A: [1.4, 2.4], B: [0, 0], C: [4, 0], D: [2, 0] }, seg: 'AB BC CA AD' });
}

window.LESSON = {
  init() {
    initF722();
    initSticks();
    initBand();
    initTri3();
    figures();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
