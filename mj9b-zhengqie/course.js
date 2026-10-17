'use strict';
/* 九下 7.1 正切 · 本课互动：比台阶（图 7-2/7-3）、角定比定（图 7-4）、对边/邻边切换、tanθ 读数板（图 7-8）、正切计算器。
 * 所有图形按坐标精确计算，作图板横纵同比例（直角就是直角）。 */
const { slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const RAD = Math.PI / 180;
const tan = (d) => Math.tan(d * RAD);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];

/* 第 3 页：台阶。阶梯外形：从 (x0,0) 起，每级先升 H/n、再进 L/n */
function stairPts(x0, L, H, n = 6) {
  const pts = [[x0, 0]];
  for (let i = 0; i < n; i++) {
    pts.push([x0 + (i * L) / n, ((i + 1) * H) / n]);
    pts.push([x0 + ((i + 1) * L) / n, ((i + 1) * H) / n]);
  }
  pts.push([x0 + L, 0]);
  return pts;
}
const FIGS = {
  72: [{ x0: 0, L: 8, H: 4, k: '①' }, { x0: 11, L: 8, H: 6, k: '②' }, { x0: 21.5, L: 10, H: 6, k: '③' }],
  73: [{ x0: 0, L: 8, H: 4, k: '①' }, { x0: 12, L: 12, H: 6, k: '④' }],
};
function initStairs() {
  const s = { fig: 72, lap: false };
  const b = Geo.board($('stairs'), { x: [-0.8, 32], y: [-1.9, 7], w: 760 });
  const list = () => FIGS[s.fig].map((t) => (s.lap ? { ...t, x0: 0 } : t));
  [0, 1, 2].forEach((i) => {
    const t = () => list()[i];
    b.poly(() => (t() && !s.lap ? stairPts(t().x0, t().L, t().H) : []), { cls: `st st${i + 1}` });
    b.poly(() => (t() && s.lap ? [[0, 0], [t().L, 0], [t().L, t().H]] : []), { cls: `lap lap${i + 1}` });
    b.seg(() => (t() ? [[t().x0, 0], [t().x0 + t().L, t().H]] : [[0, 0], [0, 0]]), { cls: `hyp hyp${i + 1}` });
    b.text(() => (t() && !s.lap ? [t().x0 + t().L / 2, 0] : null), () => (t() ? t().L : ''), { cls: 'lb up gnum', dx: -6, dy: 24 });
    b.text(() => (t() && !s.lap ? [t().x0 + t().L, t().H / 2] : null), () => (t() ? t().H : ''), { cls: 'lb up gnum', dx: 8, dy: 6 });
    b.text(() => (t() ? (s.lap ? [t().L, t().H] : [t().x0 + 0.6, t().H]) : null), () => (t() ? t().k : ''), { cls: `lb up tag${i + 1}`, dx: 4, dy: -6 });
  });
  b.seg([[-0.6, 0], [31.8, 0]], { cls: 'gs' });
  const msg = $('stMsg');
  b.onUpdate = () => {
    if (s.lap) {
      msg.textContent = s.fig === 72
        ? '左下角重合后：② 的斜边最“立”，③ 次之，① 最平——与比值 0.75 > 0.6 > 0.5 一致。'
        : '① 和 ④ 叠在一起，斜边在同一条直线上：大小不同，倾斜程度相同（4 : 8 = 6 : 12）。';
    } else {
      msg.textContent = s.fig === 72 ? '图 7-2：数据为课本所给（同一比例尺）。哪个最陡？' : '图 7-3：① 高 4、长 8；④ 高 6、长 12。哪个更陡？';
    }
    msg.className = `tip feedback ${s.lap ? 'fb-ok' : ''}`;
  };
  $('stBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-m]');
    if (!btn) return;
    const m = btn.dataset.m;
    if (m === 'lap') s.lap = !s.lap; else { s.fig = +m; s.lap = false; }
    $('stBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x.dataset.m === 'lap' ? s.lap : +x.dataset.m === s.fig));
    b.update();
  });
  b.update();
}

/* 第 4 页：图 7-4 公共锐角 A 的三个直角三角形 */
function initSim() {
  const s = { th: 35, f: [0.36, 0.66, 1] };
  const A = [0, 0];
  const YMAX = 7.4;
  const XMAX = 11;
  const HR = 5.4; // 改角的拖点到 A 的距离
  const b = Geo.board($('sim'), { x: [-0.8, 12.2], y: [-1.3, 8.3], w: 620 });
  const L = () => Math.min(XMAX, YMAX / tan(s.th));
  const C = (i) => [s.f[i] * L(), 0];
  const B = (i) => [s.f[i] * L(), s.f[i] * L() * tan(s.th)];
  [2, 1, 0].forEach((i) => b.poly(() => [A, C(i), B(i)], { cls: `rt rt${i + 1}` }));
  b.seg([A, [XMAX + 0.8, 0]], { cls: 'gs' });
  b.seg(() => { const r = L() / Math.cos(s.th * RAD) + 0.7; return [A, [r * Math.cos(s.th * RAD), r * Math.sin(s.th * RAD)]]; }, { cls: 'gs' });
  [0, 1, 2].forEach((i) => {
    b.seg(() => [C(i), B(i)], { cls: `opp opp${i + 1}` });
    Geo.right(b, () => C(i), A, () => B(i), { s: 0.32 });
    b.text(() => B(i), `B${'₁₂₃'[i]}`, { dx: -30, dy: -6 });
    b.text(() => C(i), `C${'₁₂₃'[i]}`, { dx: -8, dy: 26 });
  });
  Geo.arc(b, A, [5, 0], () => B(2), { r: 1.1, label: () => `${s.th}°`, lr: 1.9 });
  b.text(A, 'A', { dx: -24, dy: 8 });
  b.drag(() => [HR * Math.cos(s.th * RAD), HR * Math.sin(s.th * RAD)], (x, y) => {
    s.th = Math.round(clamp(Math.atan2(y, x) / RAD, 10, 70));
  });
  [0, 1, 2].forEach((i) => b.drag(() => C(i), (x) => {
    const lo = i === 0 ? 0.15 : s.f[i - 1] + 0.12;
    const hi = i === 2 ? 1 : s.f[i + 1] - 0.12;
    s.f = s.f.map((v, k) => (k === i ? clamp(x / L(), lo, hi) : v));
  }, { r: 8 }));
  const tab = $('simTab');
  b.onUpdate = () => {
    const rows = [0, 1, 2].map((i) => {
      const opp = B(i)[1];
      const adj = C(i)[0];
      return `<tr><td>$\\triangle AB_${i + 1}C_${i + 1}$</td><td>${fmt(opp)}</td><td>${fmt(adj)}</td><td><b>${(opp / adj).toFixed(3)}</b></td></tr>`;
    }).join('');
    tab.innerHTML = `<tr><th>$\\angle A=${s.th}^\\circ$</th><th>对边 $B_iC_i$</th><th>邻边 $AC_i$</th><th>$\\dfrac{B_iC_i}{AC_i}$</th></tr>${rows}`;
    tex(tab);
  };
  b.update();
}

/* 第 5 页：站在 ∠A / ∠B 看对边、邻边 */
function initDef() {
  const s = { v: 'A' };
  const P = { A: [0, 0], C: [4.4, 0], B: [4.4, 2.9] };
  const b = Geo.board($('defFig'), { x: [-0.9, 5.7], y: [-1, 3.6], w: 420 });
  const sAC = b.seg([P.A, P.C], { cls: 'gs' });
  const sBC = b.seg([P.B, P.C], { cls: 'gs' });
  b.seg([P.A, P.B], { cls: 'gs' });
  Geo.right(b, P.C, P.A, P.B, { s: 0.28 });
  Geo.arc(b, P.A, P.C, P.B, { r: 0.6, show: () => s.v === 'A', cls: 'garc on' });
  Geo.arc(b, P.B, P.A, P.C, { r: 0.5, show: () => s.v === 'B', cls: 'garc on' });
  b.text(P.A, 'A', { dx: -22, dy: 8 }); b.text(P.B, 'B', { dx: 6, dy: -4 }); b.text(P.C, 'C', { dx: 6, dy: 22 });
  b.text(mid(P.A, P.B), '斜边 c', { cls: 'lb up', dx: -70, dy: -8 });
  b.text(mid(P.B, P.C), () => (s.v === 'A' ? '对边 a' : '邻边 a'), { cls: 'lb up', dx: 8, dy: 6 });
  b.text(mid(P.A, P.C), () => (s.v === 'A' ? '邻边 b' : '对边 b'), { cls: 'lb up', dx: -30, dy: 26 });
  b.onUpdate = () => {
    sBC.setAttribute('class', s.v === 'A' ? 'gl so' : 'gl sa');
    sAC.setAttribute('class', s.v === 'A' ? 'gl sa' : 'gl so');
    $('defMsg').innerHTML = s.v === 'A'
      ? '站在 $\\angle A$：对边 $a$（红），邻边 $b$（绿）。$\\tan A=\\dfrac ab$'
      : '站在 $\\angle B$：对边 $b$（红），邻边 $a$（绿）。$\\tan B=\\dfrac ba$';
    tex($('defMsg'));
  };
  $('defBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-v]');
    if (!btn) return;
    s.v = btn.dataset.v;
    $('defBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
  b.update();
}

/* 例题、练习的静态图（按题中数据精确绘制） */
function initSketches() {
  const r3 = Math.sqrt(3);
  Geo.sketch($('ex1Fig'), { P: { A: [0, 0], C: [4, 0], B: [4, 3] }, seg: 'AB BC CA', right: [['C', 'A', 'B']], text: [[[2, 0], '4', -4, 24], [[2, 1.5], '5', -16, -8]], w: 340, pad: 0.6 });
  Geo.sketch($('ex2Fig'), { P: { A: [0, 0], B: [6, 0], C: [3, 3 * r3], D: [3, 0] }, seg: 'AB BC CA CD', right: [['D', 'B', 'C']], w: 300, pad: 1 });
  Geo.sketch($('pr1a'), { P: { A: [0, 0], C: [6, 0], B: [6, 2.5] }, seg: 'AB BC CA', right: [['C', 'A', 'B']], text: [[[3, 0], '12', -8, 24], [[6, 1.25], '5', 8, 6]], w: 360, pad: 0.7 });
  Geo.sketch($('pr1b'), { P: { 'A₁': [0, 0], 'C₁': [5, 0], 'B₁': [5, Math.sqrt(24)] }, seg: 'A₁B₁ B₁C₁ C₁A₁', right: [['C₁', 'A₁', 'B₁']], text: [[[2.5, 0], '5', -4, 24], [[2.5, Math.sqrt(24) / 2], '7', -18, -6]], w: 300, pad: 0.8 });
  Geo.sketch($('hw1a'), { P: { C: [0, 0], B: [3, 0], A: [0, 3 * r3] }, seg: 'AB BC CA', right: [['C', 'B', 'A']], text: [[[0, 1.5 * r3], '√3', -36, 6], [[1.5, 0], '1', -4, 22]], w: 200, pad: 1.2 });
  Geo.sketch($('hw1b'), { P: { 'A₁': [0, 0], 'B₁': [5, 0], 'C₁': [3.2, 2.4] }, seg: 'A₁B₁ B₁C₁ C₁A₁', right: [['C₁', 'A₁', 'B₁']], text: [[[2.5, 0], '5', -4, 22], [[4.1, 1.2], '3', 8, 0]], w: 260, pad: 0.6 });
  Geo.sketch($('ex4Fig'), { P: { A: [0, 0], C: [5, 0], B: [5, 5 * tan(40)] }, seg: 'AB BC CA', right: [['C', 'A', 'B']], ang: [['A', 'C', 'B', '40°', 0.8]], text: [[[2.5, 0], '10', -8, 24]], w: 420, pad: 0.6 });
}

/* 第 8 页：图 7-8，P 在直线 x = 1 上，纵坐标就是 tanθ */
const MARKS = [10, 20, 30, 45, 55, 65];
function initGrid78() {
  const s = { th: 30, got: { 65: '2.14' } };
  const b = Geo.board($('grid78'), { x: [-0.16, 1.36], y: [-0.14, 2.66], axes: true, grid: false, ticks: [0.5, 0.5], w: 400 });
  for (let v = 0.1; v < 1.31; v += 0.1) b.seg([[v, 0], [v, 2.6]], { cls: 'fgrid' });
  for (let v = 0.1; v < 2.61; v += 0.1) b.seg([[0, v], [1.3, v]], { cls: 'fgrid' });
  b.curve((t) => [Math.cos(t * RAD), Math.sin(t * RAD)], 0, 90, { cls: 'dash' });
  b.seg([[1, 0], [1, 2.6]], { cls: 'xline' });
  [10, 20, 30, 40, 45, 50, 55, 60, 65].forEach((d) => {
    const r = Math.min(1.3 / Math.cos(d * RAD), 2.6 / Math.sin(d * RAD));
    const e = [r * Math.cos(d * RAD), r * Math.sin(d * RAD)];
    b.seg([[0, 0], e], { cls: 'ray' });
    b.text(e, `${d}°`, { cls: 'lb up deg', dx: 2, dy: d > 60 ? -4 : 4 });
  });
  const P = () => [1, tan(s.th)];
  b.seg(() => [[0, 0], P()], { cls: 'gl c-a' });
  b.seg(() => [[0, P()[1]], P()], { cls: 'dash' });
  b.text(P, 'P', { dx: -22, dy: -6 });
  b.drag(P, (x, y) => { s.th = Math.round(clamp(Math.atan(y) / RAD, 1, 68)); }, { r: 8 });
  const tab = $('gTab');
  b.onUpdate = () => {
    const v = tan(s.th);
    $('gTh').textContent = `${s.th}°`;
    $('gTan').textContent = v.toFixed(2);
    if (MARKS.includes(s.th)) s.got = { ...s.got, [s.th]: v.toFixed(2) };
    tab.innerHTML = `<tr><th>$\\theta$</th>${MARKS.map((d) => `<td>${d}°</td>`).join('')}</tr><tr><th>$\\tan\\theta$</th>${MARKS.map((d) => `<td class="${d === s.th ? 'hot' : ''}">${s.got[d] || ''}</td>`).join('')}</tr>`;
    tex(tab);
  };
  b.update();
}

/* 第 9 页：正切计算器（核对用） */
function initCalc() {
  const run = () => {
    const d = clamp(+$('cDeg').value || 0, 0, 89);
    const m = clamp(+$('cMin').value || 0, 0, 59);
    const v = tan(d + m / 60);
    $('cAng').textContent = `${d}°${m ? `${m}′` : ''}`;
    $('cVal').textContent = v.toPrecision(10);
    $('cRound').textContent = `精确到 0.01：≈ ${v.toFixed(2)}${m ? `（${d}°${m}′ = ${fmt(d + m / 60, 4)}°）` : ''}`;
  };
  ['cDeg', 'cMin'].forEach((id) => $(id).addEventListener('input', run));
  run();
}

window.LESSON = {
  init() {
    initStairs();
    initSim();
    initDef();
    initSketches();
    initGrid78();
    initCalc();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
