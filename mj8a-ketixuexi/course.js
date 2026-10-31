'use strict';
/* 八上 课题学习 关于勾股定理的研究 · 本课互动：历史时间轴、四个三角形平移变换证法（核心）、
 * 证法画廊三幅图（a = 3、b = 4 按坐标绘制）、屏幕尺寸计算器。所有图形由坐标计算。 */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const boards = [];

/* ---------- 第 4 页：时间轴 ---------- */
const TL = [
  { y: '约公元前 1800 年', t: '古巴比伦泥板', d: '古巴比伦的一块泥板（今称“普林顿 322”）上刻有十几组数，许多学者认为它们与勾股数有关．' },
  { y: '约公元前 11 世纪', t: '商高 ·《周髀算经》', d: '《周髀算经》记载了周公与商高的对话，商高说“勾广三，股修四，径隅五”——即“勾三股四弦五”．' },
  { y: '公元前 6 世纪', t: '毕达哥拉斯学派', d: '古希腊毕达哥拉斯学派研究了这一关系，西方称勾股定理为“毕达哥拉斯定理”．相传发现后曾杀百牛庆贺（只是传说）．' },
  { y: '约公元前 300 年', t: '欧几里得 ·《几何原本》', d: '《几何原本》第一卷命题 47 给出了勾股定理的严格证明，用的是全等三角形和面积．' },
  { y: '公元 3 世纪', t: '赵爽 · 弦图', d: '三国时期赵爽为《周髀算经》作注，用“勾股圆方图”（弦图）证明了勾股定理．' },
  { y: '公元 263 年', t: '刘徽 · 出入相补', d: '刘徽注《九章算术》，用“出入相补”（把图形割开、移补）的方法证明勾股定理．' },
  { y: '1876 年', t: '伽菲尔德 · 梯形证法', d: '后来成为美国总统的伽菲尔德发表了用梯形面积证明勾股定理的方法（课本 p81“探索”）．' },
  { y: '2002 年', t: '北京国际数学家大会', d: '在北京召开的国际数学家大会，会标的中心图案就是赵爽弦图．' },
];
function initTimeline() {
  $('tl').innerHTML = TL.map((e, i) => `<button type="button" class="tl-node${i === 1 ? ' on' : ''}" data-i="${i}"><i></i><b>${e.y}</b><span>${e.t}</span></button>`).join('');
  const show = (i) => {
    $('tl').querySelectorAll('.tl-node').forEach((n) => n.classList.toggle('on', +n.dataset.i === i));
    $('tlCard').innerHTML = `<b>${TL[i].y} · ${TL[i].t}</b><p>${TL[i].d}</p>`;
  };
  $('tl').addEventListener('click', (e) => { const n = e.target.closest('.tl-node'); if (n) show(+n.dataset.i); });
  show(1);
}

/* ---------- 第 5 页：平移变换 ---------- */
function initMorph() {
  const s = { a: 1.5, b: 3, t: 0 };
  const S = () => s.a + s.b;
  // 拼法一的四个三角形（直角顶点在大正方形的四个角）；move 是到拼法二的平移量
  const tris = () => {
    const { a, b } = s; const n = S();
    return [
      { p: [[0, 0], [b, 0], [0, a]], move: [a, 0], k: 2 },
      { p: [[b, 0], [n, 0], [n, b]], move: [-b, a], k: 0 },
      { p: [[n, b], [n, n], [a, n]], move: [0, -b], k: 1 },
      { p: [[a, n], [0, n], [0, a]], move: [0, 0], k: -1 },
    ];
  };
  const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - ((-2 * x + 2) ** 2) / 2);
  const frac = (k) => (k < 0 ? 0 : ease(Math.min(1, Math.max(0, s.t - k))));
  const g = board($('morph'), { x: [-0.6, 7.6], y: [-0.6, 7.6], axes: false, grid: false, w: 460 });
  boards.push(g);
  g.poly(() => { const n = S(); return [[0, 0], [n, 0], [n, n], [0, n]]; }, { cls: 'big-sq' });
  const done = () => s.t >= 2.999;
  const start = () => s.t <= 0.001;
  g.poly(() => { const { a, b } = s; const n = S(); return start() ? [[b, 0], [n, b], [a, n], [0, a]] : [[-9, -9], [-9, -9], [-9, -9]]; }, { cls: 'hole-c' });
  g.poly(() => { const { a } = s; return done() ? [[0, 0], [a, 0], [a, a], [0, a]] : [[-9, -9], [-9, -9], [-9, -9]]; }, { cls: 'hole-a' });
  g.poly(() => { const { a } = s; const n = S(); return done() ? [[a, a], [n, a], [n, n], [a, n]] : [[-9, -9], [-9, -9], [-9, -9]]; }, { cls: 'hole-b' });
  [0, 1, 2, 3].forEach((i) => g.poly(() => {
    const T = tris()[i]; const f = frac(T.k);
    return T.p.map(([x, y]) => [x + T.move[0] * f, y + T.move[1] * f]);
  }, { cls: `tri t${i}` }));
  g.text(() => (start() ? [S() / 2, S() / 2] : null), 'c²', { cls: 'lb', dx: -10, dy: 8 });
  g.text(() => (done() ? [s.a / 2, s.a / 2] : null), 'a²', { cls: 'lb', dx: -10, dy: 8 });
  g.text(() => (done() ? [s.a + s.b / 2, s.a + s.b / 2] : null), 'b²', { cls: 'lb', dx: -10, dy: 8 });
  g.text(() => [S(), S()], () => `边长 a + b = ${fmt(S())}`, { cls: 'lb up', dx: -150, dy: -10 });
  const sync = () => { $('mAV').textContent = fmt(s.a); $('mBV').textContent = fmt(s.b); g.update(); };
  slider($('mT'), (v) => { s.t = v; g.update(); });
  slider($('mA'), (v) => { s.a = v; sync(); });
  slider($('mB'), (v) => { s.b = v; sync(); });
  let stop = null;
  $('mPlay').addEventListener('click', () => {
    if (stop) cancelAnimationFrame(stop);
    const from = s.t; const to = s.t > 1.5 ? 0 : 3; const t0 = performance.now(); const ms = 3600;
    const tick = (now) => {
      const x = Math.min(1, (now - t0) / ms);
      s.t = from + (to - from) * x; $('mT').value = s.t; g.update();
      if (x < 1) stop = requestAnimationFrame(tick);
    };
    stop = requestAnimationFrame(tick);
  });
}

/* ---------- 第 6 页：证法画廊（a = 3, b = 4, c = 5） ---------- */
const NS = 'http://www.w3.org/2000/svg';
const pts = (P, T) => P.map((p) => T(p).map((v) => v.toFixed(1)).join(',')).join(' ');
const polyS = (P, T, fill, stroke = '#1f2d3a', w = 1.8) => `<polygon points="${pts(P, T)}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"/>`;
const txt = (p, T, t, dx = 0, dy = 0, cls = 'fl s') => { const [x, y] = T(p); return `<text x="${(x + dx).toFixed(1)}" y="${(y + dy).toFixed(1)}" class="${cls}" text-anchor="middle">${t}</text>`; };
const A3 = 3; const B4 = 4; const C5 = 5;

function drawZhao() {
  const u = 34; const T = ([x, y]) => [25 + x * u, 185 - y * u];
  const c = C5; const R0 = [(B4 * B4) / c, (A3 * B4) / c];
  const rot = (p, k) => { let [x, y] = [p[0] - c / 2, p[1] - c / 2]; for (let i = 0; i < k; i += 1) [x, y] = [-y, x]; return [x + c / 2, y + c / 2]; };
  const tris = [0, 1, 2, 3].map((k) => [[0, 0], [c, 0], R0].map((p) => rot(p, k)));
  let s = polyS([[0, 0], [c, 0], [c, c], [0, c]], T, '#fdf1e6', '#d9711c', 2);
  tris.forEach((t) => { s += polyS(t, T, 'rgba(79,155,208,.55)'); });
  s += polyS(tris.map((t) => t[2]), T, 'rgba(217,113,28,.35)', '#d9711c');
  s += txt([c / 2, 0], T, 'c', 0, 16, 'fl');
  $('gZhao').innerHTML = s;
}
function drawGarfield() {
  const u = 24; const T = ([x, y]) => [22 + x * u, 170 - y * u];
  const B = [0, 0]; const A = [0, B4]; const E = [A3, 0]; const C = [A3 + B4, 0]; const D = [A3 + B4, A3];
  let s = polyS([A, B, E], T, 'rgba(79,155,208,.45)') + polyS([E, C, D], T, 'rgba(79,155,208,.45)') + polyS([A, E, D], T, 'rgba(217,113,28,.3)', '#d9711c');
  s += txt([0, B4 / 2], T, 'b', -10, 5) + txt([A3 / 2, 0], T, 'a', 0, 18) + txt([A3 + B4 / 2, 0], T, 'b', 0, 18) + txt([A3 + B4, A3 / 2], T, 'a', 10, 5);
  s += txt([A3 / 2, B4 / 2], T, 'c', 6, -6, 'fl') + txt([A3 + B4 / 2, A3 / 2], T, 'c', -4, -8, 'fl');
  [['A', A, -12, -4], ['B', B, -12, 14], ['E', E, 0, 16], ['C', C, 10, 14], ['D', D, 10, -4]].forEach(([n, p, dx, dy]) => { s += txt(p, T, n, dx, dy, 'fl'); });
  $('gGar').innerHTML = s;
}
function drawEuclid() {
  // C 为直角顶点，CA = b = 4 沿 x 轴，CB = a = 3 沿 y 轴
  const C = [0, 0]; const A = [B4, 0]; const B = [0, A3];
  const u = 17; const T = ([x, y]) => [61 + x * u, 131 - y * u];
  const sub = (p, q) => [p[0] - q[0], p[1] - q[1]]; const add = (p, q) => [p[0] + q[0], p[1] + q[1]];
  const v = sub(B, A); const nrm = [v[1], -v[0]]; // 指向远离 C 的一侧
  const A2 = add(A, nrm); const B2 = add(B, nrm);
  const t = ((C[0] - A[0]) * v[0] + (C[1] - A[1]) * v[1]) / (v[0] * v[0] + v[1] * v[1]);
  const D = add(A, [v[0] * t, v[1] * t]); const D2 = add(D, nrm);
  let s = polyS([C, A, [B4, -B4], [0, -B4]], T, 'rgba(47,125,107,.25)') + polyS([C, B, [-A3, A3], [-A3, 0]], T, 'rgba(79,155,208,.3)');
  s += polyS([A, D, D2, A2], T, 'rgba(47,125,107,.25)') + polyS([D, B, B2, D2], T, 'rgba(79,155,208,.3)');
  s += polyS([C, A, B], T, '#fff');
  s += `<line x1="${T(C)[0]}" y1="${T(C)[1]}" x2="${T(D2)[0]}" y2="${T(D2)[1]}" stroke="#d9711c" stroke-width="1.8" stroke-dasharray="5 4"/>`;
  s += txt([B4 / 2, -B4 / 2], T, 'b²', 0, 5) + txt([-A3 / 2, A3 / 2], T, 'a²', 0, 5);
  s += txt([(A[0] + D2[0]) / 2, (A[1] + D2[1]) / 2], T, 'b²', 0, 5) + txt([(B[0] + D2[0]) / 2, (B[1] + D2[1]) / 2], T, 'a²', 0, 5);
  [['C', C, -8, 14], ['A', A, 10, 14], ['B', B, -8, -6]].forEach(([n, p, dx, dy]) => { s += txt(p, T, n, dx, dy, 'fl'); });
  $('gEuc').innerHTML = s;
}

/* ---------- 第 7 页：屏幕尺寸 ---------- */
function initTV() {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 520 330');
  $('tv').appendChild(svg);
  const run = () => {
    const d = +$('tvD').value;
    const [p, q] = $('tvR').value.split(',').map(Number);
    const k = d / Math.hypot(p, q);
    const w = p * k; const h = q * k;
    const sc = 5.2; // 每英寸 5.2 像素：85 英寸 4:3 的高 51 英寸 ≈ 265 像素，放得下
    const W = w * sc; const H = h * sc;
    const x0 = 40; const y0 = 300 - H;
    svg.innerHTML = `<rect x="${x0}" y="${y0}" width="${W}" height="${H}" fill="#1f2d3a" stroke="#556575" stroke-width="6" rx="4"/>`
      + `<line x1="${x0}" y1="${y0 + H}" x2="${x0 + W}" y2="${y0}" stroke="#ffd08a" stroke-width="3"/>`
      + `<path d="M${x0 + W - 14} ${y0 + H}v-14h14" fill="none" stroke="#ffd08a" stroke-width="2"/>`
      + `<text x="${x0 + W / 2}" y="${y0 + H / 2 - 8}" fill="#ffd08a" class="fl s" text-anchor="middle">${d} 英寸</text>`
      + `<text x="${x0 + W / 2}" y="${y0 + H + 22}" class="fl s" text-anchor="middle">宽 ${w.toFixed(1)} 英寸</text>`
      + `<text x="${x0 + W + 8}" y="${y0 + H / 2}" class="fl s">高 ${h.toFixed(1)}</text>`;
    $('tvDV').textContent = d;
    $('tvMsg').innerHTML = `$${p}:${q}$，对角线 ${d} 英寸：宽 $\\approx${w.toFixed(1)}$ 英寸 $\\approx${(w * 2.54).toFixed(1)}$ cm，高 $\\approx${h.toFixed(1)}$ 英寸 $\\approx${(h * 2.54).toFixed(1)}$ cm；面积 $\\approx${Math.round(w * h)}$ 平方英寸．`;
    tex($('tvMsg'));
  };
  $('tvD').addEventListener('input', run);
  $('tvR').addEventListener('change', run);
  run();
}

window.LESSON = {
  init() { initTimeline(); initMorph(); drawZhao(); drawGarfield(); drawEuclid(); initTV(); },
  onRender(slide) { boards.forEach((b) => { if (slide.contains(b.svg)) b.update(); }); },
};
