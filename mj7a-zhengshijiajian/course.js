'use strict';
/* 七上 3.6 整式的加减 · 本课互动：图 3-9 卡片拼四边形（刚体旋转 + 平移动画，a = √2·b 精确）、化简求值核对、
 * 车站线段图、奇数和方格图。通用部分见 ../shared/math.js */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);

/* ---------- 第 3 页：拼卡片 ---------- */
const B = 1;
const A = Math.SQRT2 * B; // 等腰直角三角形：直角边 b，斜边 a = √2·b
const TRI = [[0, 0], [B, 0], [0, B]];
const RECT = [[0, 0], [A, 0], [A, B], [0, B]];
const MARK = 0.13;
const RIGHT = [[0, 0], [MARK, 0], [MARK, MARK], [0, MARK]];
const rad = (d) => (d * Math.PI) / 180;
const place = (pts, { th, x, y }) => pts.map(([px, py]) => [px * Math.cos(rad(th)) - py * Math.sin(rad(th)) + x, px * Math.sin(rad(th)) + py * Math.cos(rad(th)) + y]);
const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];

const SCATTER = [{ th: 0, x: 0.1, y: 0.3 }, { th: 0, x: 1.45, y: 0.3 }, { th: 0, x: 2.72, y: 0.3 }];
const APEX = [B + A / 2, B + A / 2];
/* 每种拼法：三张卡片的位置（三角形 1、三角形 2、长方形），外圈各边（端点 + 字母），拼在里面的边，周长算式 */
const SHAPES = [
  {
    name: '梯形', pose: [{ th: 90, x: B, y: 0 }, { th: 0, x: B + A, y: 0 }, { th: 0, x: B, y: 0 }],
    edges: [[[0, 0], [B, 0], 'b'], [[B, 0], [B + A, 0], 'a'], [[B + A, 0], [2 * B + A, 0], 'b'], [[2 * B + A, 0], [B + A, B], 'a'], [[B + A, B], [B, B], 'a'], [[B, B], [0, 0], 'a']],
    inner: [[[B, 0], [B, B]], [[B + A, 0], [B + A, B]]],
    f: '(b+a+b)+a+a+a', r: '4a+2b',
  },
  {
    name: '课本右图', pose: [{ th: 90, x: B, y: 0 }, { th: -135, x: APEX[0], y: APEX[1] }, { th: 0, x: B, y: 0 }],
    edges: [[[0, 0], [B, 0], 'b'], [[B, 0], [B + A, 0], 'a'], [[B + A, 0], [B + A, B], 'b'], [[B + A, B], APEX, 'b'], [APEX, [B, B], 'b'], [[B, B], [0, 0], 'a']],
    inner: [[[B, 0], [B, B]], [[B, B], [B + A, B]]],
    f: '(b+a)+(b+a)+b+b', r: '2a+4b',
  },
  {
    name: '平行四边形', pose: [{ th: 90, x: B, y: 0 }, { th: -90, x: B + A, y: B }, { th: 0, x: B, y: 0 }],
    edges: [[[0, 0], [B, 0], 'b'], [[B, 0], [B + A, 0], 'a'], [[B + A, 0], [2 * B + A, B], 'a'], [[2 * B + A, B], [B + A, B], 'b'], [[B + A, B], [B, B], 'a'], [[B, B], [0, 0], 'a']],
    inner: [[[B, 0], [B, B]], [[B + A, 0], [B + A, B]]],
    f: '(b+a)+(a+b)+a+a', r: '4a+2b',
  },
  {
    name: '长方形', pose: [{ th: 0, x: 0, y: 0 }, { th: 180, x: B, y: B }, { th: 0, x: B, y: 0 }],
    edges: [[[0, 0], [B, 0], 'b'], [[B, 0], [B + A, 0], 'a'], [[B + A, 0], [B + A, B], 'b'], [[B + A, B], [B, B], 'a'], [[B, B], [0, B], 'b'], [[0, B], [0, 0], 'b']],
    inner: [[[B, 0], [0, B]], [[B, 0], [B, B]]],
    f: '(b+a)+(b+a)+b+b', r: '2a+4b',
  },
];

function initCards() {
  const s = { pose: SCATTER.map((p) => ({ ...p })), shape: -1, settled: false, seen: [] };
  const bd = board($('cardBoard'), { x: [-0.35, 4.25], y: [-0.45, 2.05], axes: false, grid: false, w: 640 });
  const SHAPES_OF = [TRI, TRI, RECT];
  SHAPES_OF.forEach((pts, i) => bd.poly(() => place(pts, s.pose[i]), { cls: i < 2 ? 'card tri' : 'card rect' }));
  [0, 1].forEach((i) => bd.poly(() => place(RIGHT, s.pose[i]), { cls: 'rmark' }));
  const cur = () => (s.settled && s.shape >= 0 ? SHAPES[s.shape] : null);
  [0, 1].forEach((k) => bd.seg(() => (cur() ? cur().inner[k] : [[0, 0], [0, 0]]), { cls: 'inner' }));
  // 边上的字母标在外侧：从图形中心指向边中点的方向再推出一点
  const OUT = 0.2;
  const labelAt = (sh, k) => {
    const c = sh.edges.reduce((acc, e) => [acc[0] + e[0][0] / sh.edges.length, acc[1] + e[0][1] / sh.edges.length], [0, 0]);
    const [p, q] = sh.edges[k];
    const m = mid(p, q);
    let n = [q[1] - p[1], p[0] - q[0]];
    const len = Math.hypot(...n);
    n = [n[0] / len, n[1] / len];
    if ((m[0] - c[0]) * n[0] + (m[1] - c[1]) * n[1] < 0) n = [-n[0], -n[1]];
    return [m[0] + n[0] * OUT, m[1] + n[1] * OUT];
  };
  for (let k = 0; k < 6; k++) {
    bd.seg(() => (cur() ? cur().edges[k].slice(0, 2) : [[0, 0], [0, 0]]), { cls: 'outer' });
    bd.text(() => (cur() ? labelAt(cur(), k) : null), () => (cur() ? cur().edges[k][2] : ''), { cls: 'lb edge c', dy: 7 });
  }
  // 散开时标出卡片的边（同图 3-9）
  const loose = () => s.shape < 0;
  const tag = (i, p, q, t, dx, dy) => bd.text(() => (loose() ? mid(...place([p, q], s.pose[i])) : null), t, { cls: 'lb edge c', dx, dy });
  [0, 1].forEach((i) => { tag(i, [0, 0], [B, 0], 'b', 0, 24); tag(i, [0, 0], [0, B], 'b', -14, 6); tag(i, [B, 0], [0, B], 'a', 14, 0); });
  tag(2, [0, 0], [A, 0], 'a', 0, 24); tag(2, [0, 0], [0, B], 'b', -14, 6);

  const DURATION = 900;
  let raf = 0;
  const animate = (to, done) => {
    cancelAnimationFrame(raf);
    const from = s.pose.map((p) => ({ ...p }));
    const t0 = performance.now();
    const ease = (u) => 1 - (1 - u) ** 3;
    const tick = (now) => {
      const u = Math.min(1, (now - t0) / DURATION);
      const e = ease(u);
      s.pose = from.map((p, i) => ({ th: p.th + (to[i].th - p.th) * e, x: p.x + (to[i].x - p.x) * e, y: p.y + (to[i].y - p.y) * e }));
      bd.update();
      if (u < 1) raf = requestAnimationFrame(tick); else done();
    };
    raf = requestAnimationFrame(tick);
  };
  const renderTab = () => {
    const rows = SHAPES.map((sh, i) => `<tr><td>${sh.name}</td><td>${s.seen.includes(i) ? `$${sh.f}$` : '？'}</td><td>${s.seen.includes(i) ? `$${sh.r}$` : '？'}</td></tr>`).join('');
    $('perTab').innerHTML = `<tr><th>拼法</th><th>周长</th><th>化简</th></tr>${rows}`;
    tex($('perTab'));
  };
  const choose = (k) => {
    s.shape = k; s.settled = false;
    const msg = $('perMsg');
    msg.className = 'tip feedback';
    msg.textContent = k < 0 ? '三张卡片已散开，点一种拼法。' : '先猜一猜：哪些边拼到了里面？周长是多少？';
    $('shapeBtns').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', +b.dataset.k === k));
    animate(k < 0 ? SCATTER : SHAPES[k].pose, () => {
      s.settled = true;
      if (k >= 0) {
        s.seen = s.seen.includes(k) ? s.seen : [...s.seen, k];
        msg.className = 'tip feedback fb-ok';
        msg.innerHTML = `${SHAPES[k].name}的周长 $=${SHAPES[k].f}=${SHAPES[k].r}$（虚线是拼在里面的边，不算）`;
        tex(msg);
        renderTab();
      }
      bd.update();
    });
  };
  $('shapeBtns').innerHTML = [...SHAPES.map((sh, i) => `<button class="btn" type="button" data-k="${i}">${i + 1}. ${sh.name}</button>`), '<button class="btn" type="button" data-k="-1">散开</button>'].join('');
  $('shapeBtns').addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (b) choose(+b.dataset.k); });
  renderTab();
  choose(-1);
}

/* ---------- 第 6 页：化简前后的值 ---------- */
function initEval() {
  const s = { a: -2, b: 3 };
  const p = (v) => (v < 0 ? `(${v})` : `${v}`);
  const draw = () => {
    const { a, b } = s;
    $('evAV').textContent = a; $('evBV').textContent = b;
    const x = 3 * a * a * b - a * b * b;
    const y = -a * b * b + 3 * a * a * b;
    const direct = 5 * (3 * a * a * b - a * b * b) - 4 * (-a * b * b + 3 * a * a * b);
    const simple = 3 * a * a * b - a * b * b;
    $('evBox').innerHTML = `<p><b>原式</b>　$5\\times(${3 * a * a * b}${-a * b * b < 0 ? '' : '+'}${-a * b * b})-4\\times(${-a * b * b}${3 * a * a * b < 0 ? '' : '+'}${3 * a * a * b})=${5 * x}-${p(4 * y)}=${direct}$</p>`
      + `<p><b>化简后</b>　$3\\times${p(a)}^2\\times${p(b)}-${p(a)}\\times${p(b)}^2=${simple}$</p>`
      + `<p class="${direct === simple ? 'ok' : 'no'}">${direct === simple ? '两种算法结果相等 ✓' : '不相等'}</p>`;
    tex($('evBox'));
  };
  slider($('evA'), (v) => { s.a = v; draw(); });
  slider($('evB'), (v) => { s.b = v; draw(); });
}

/* ---------- 第 8 页：车站线段图 ---------- */
function initStations() {
  const s = { a: 3, b: 1.5 };
  const bd = board($('stBoard'), { x: [-1.2, 19.5], y: [-3.4, 3.2], axes: false, grid: false, w: 640, h: 200 });
  const P = () => { const Bx = s.a + s.b; return { A: 0, B: Bx, C: Bx + 2 * s.a - s.b, D: Bx + 3 * s.a + 2 * s.b }; };
  bd.seg(() => [[0, 0], [P().D, 0]], { cls: 'track' });
  ['A', 'B', 'C', 'D'].forEach((k) => {
    bd.seg(() => [[P()[k], -0.35], [P()[k], 0.35]], { cls: 'tick' });
    bd.text(() => [P()[k], 0.35], k, { cls: 'lb c', dy: -6 });
  });
  const dim = (p, q, y, cls) => bd.seg(() => [[P()[p], y], [P()[q], y]], { cls });
  dim('A', 'B', 1.6, 'dim d1'); dim('B', 'C', 1.6, 'dim d2'); dim('B', 'D', -1.6, 'dim d3');
  bd.text(() => [(P().A + P().B) / 2, 1.6], 'a+b', { cls: 'lb up c', dy: -8 });
  bd.text(() => [(P().B + P().C) / 2, 1.6], '2a−b', { cls: 'lb up c', dy: -8 });
  bd.text(() => [(P().B + P().D) / 2, -1.6], '3a+2b', { cls: 'lb up c', dy: 22 });
  bd.onUpdate = () => {
    const { a, b } = s;
    $('stAV').textContent = fmt(a); $('stBV').textContent = fmt(b);
    const p = P();
    const m = $('stMsg');
    m.className = 'tip feedback fb-ok';
    m.innerHTML = `$AD=${fmt(p.D - p.A)}$，$4a+3b=${fmt(4 * a + 3 * b)}$；　$CD=${fmt(p.D - p.C)}$，$a+3b=${fmt(a + 3 * b)}$`;
    tex(m);
  };
  const fix = () => { if (s.b >= 2 * s.a) { s.b = 2 * s.a - 0.5; $('stB').value = s.b; } bd.update(); };
  slider($('stA'), (v) => { s.a = v; fix(); });
  slider($('stB'), (v) => { s.b = v; fix(); });
}

/* ---------- 第 9 页：1 + 3 + 5 + … + (2n − 1) ---------- */
function initOdd() {
  const s = { n: 4 };
  const N = 8;
  const bd = board($('oddBoard'), { x: [-0.2, N + 0.2], y: [-0.2, N + 0.2], axes: false, grid: false, w: 360 });
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const layer = Math.max(i, j) + 1;
    bd.poly(() => (layer <= s.n ? [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]] : []), { cls: `cell ${layer === s.n ? 'last' : layer % 2 ? 'ca' : 'cb'}` });
  }
  bd.onUpdate = () => {
    const n = s.n;
    $('oddNV').textContent = n;
    const odds = Array.from({ length: n }, (_, k) => 2 * k + 1);
    const m = $('oddMsg');
    m.className = 'tip feedback fb-ok';
    m.innerHTML = `$${odds.join('+')}=${n * n}=${n}^2$（最外一层有 $2\\times${n}-1=${2 * n - 1}$ 格）`;
    tex(m);
  };
  slider($('oddN'), (v) => { s.n = v; bd.update(); });
}

window.LESSON = {
  init() {
    initCards();
    initEval();
    initStations();
    initOdd();
  },
};
