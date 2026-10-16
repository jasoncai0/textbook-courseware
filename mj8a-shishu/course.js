'use strict';
/* 八上 4.3 实数 · 本课互动：勾股螺旋（图 4-3）、格点画 √n 线段、圆规把 √n 画到数轴上（图 4-4，核心）、放大数轴比较大小。
 * 通用部分见 ../shared/math.js、numline.js、mcheck.js；所有长度、角度、圆弧按坐标精确计算，作图板横纵同比例。 */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const boards = [];
const keep = (b) => { boards.push(b); return b; };

const add = (p, q) => [p[0] + q[0], p[1] + q[1]];
const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
const len = (p) => Math.hypot(p[0], p[1]);
const unit = (p) => { const l = len(p); return [p[0] / l, p[1] / l]; };
const HIDE = [[0, -99], [0, -99]]; // 画到画板外：隐藏线段
const surd = (n) => (Number.isInteger(Math.sqrt(n)) ? String(Math.sqrt(n)) : `√${n}`);

/** 直角记号：直角顶点 R，两条直角边方向指向 P、Q */
function rightMark(R, P, Q, m) {
  const u1 = unit(sub(P, R));
  const u2 = unit(sub(Q, R));
  return [add(R, [u1[0] * m, u1[1] * m]), add(R, [(u1[0] + u2[0]) * m, (u1[1] + u2[1]) * m]), add(R, [u2[0] * m, u2[1] * m])];
}

/* 第 3 页：勾股螺旋。P0 = B(1, 0)，P_k = P_{k−1} + 与 OP_{k−1} 垂直（逆时针）的单位向量，OP_k = a_k = √(k+1) */
const N_MAX = 8; // a_8 = 3；8 个三角形约转过 253°，画板 ±3.3 放得下
const SPIRAL = (() => {
  const pts = [[1, 0]];
  for (let k = 1; k <= N_MAX; k++) {
    const p = pts[k - 1];
    const u = unit(p);
    pts.push(add(p, [-u[1], u[0]]));
  }
  return pts;
})();

function initSpiral() {
  const s = { n: 5 };
  const b = keep(board($('spiral'), { x: [-3.4, 3.4], y: [-2.6, 3.3], axes: false, grid: false, w: 560 }));
  NumLine.axis(b, { from: -3, to: 3, tick: 0.1, tail: 0.25, lead: 0.25 });
  for (let k = N_MAX; k >= 1; k--) {
    const on = () => k <= s.n;
    const tri = [[0, 0], SPIRAL[k - 1], SPIRAL[k]];
    const isQ = Number.isInteger(Math.sqrt(k + 1));
    b.poly(() => (on() ? tri : []), { cls: k % 2 ? 'trA' : 'trB' });
    b.poly(() => (on() ? rightMark(SPIRAL[k - 1], [0, 0], SPIRAL[k], 0.16) : []), { cls: 'rmark' });
    b.seg(() => (on() ? [SPIRAL[k - 1], SPIRAL[k]] : HIDE), { cls: 'unit' });
    b.seg(() => (on() ? [[0, 0], SPIRAL[k]] : HIDE), { cls: isQ ? 'hypQ' : 'hyp' });
    // 斜边标注放在斜边中点稍靠外侧；后面的三角形太窄，只标有理数的那几条
    const mid = [SPIRAL[k][0] * 0.55, SPIRAL[k][1] * 0.55];
    const showLb = on;
    b.text(() => (showLb() ? mid : null), isQ ? `a${k}=${Math.sqrt(k + 1)}` : `a${k}`, { cls: isQ ? 'akQ' : 'ak', dy: 5 });
    b.text(() => (on() ? SPIRAL[k] : null), `A${k}`, { cls: 'vx', dx: SPIRAL[k][0] >= 0 ? 14 : -14, dy: SPIRAL[k][1] >= 0 ? -6 : 18 });
  }
  b.text([0, 0], 'O', { cls: 'vx', dx: -10, dy: -8 });
  b.text([1, 0], 'B', { cls: 'vx', dx: 10, dy: -8 });
  b.onUpdate = () => {
    $('nV').textContent = s.n;
  };
  slider($('nIn'), (v) => { s.n = v; b.update(); });
}

/* 第 4 页：格点上画长为 √10、√13、√29 的线段 */
function initGrid() {
  const s = { P: [4, 1], n: 10 };
  const b = keep(board($('grid'), { x: [-0.6, 6.6], y: [-0.7, 5.6], axes: false, ticks: 1, w: 560 }));
  const ok = () => s.P[0] ** 2 + s.P[1] ** 2 === s.n;
  b.seg(() => [[0, 0], [s.P[0], 0]], { cls: 'leg' });
  b.seg(() => [[s.P[0], 0], s.P], { cls: 'leg' });
  b.seg(() => [[0, 0], s.P], { cls: 'seg-no' });
  const okSeg = b.seg(() => (ok() ? [[0, 0], s.P] : HIDE), { cls: 'seg-ok' });
  b.poly(() => (s.P[0] > 0 && s.P[1] > 0 ? rightMark([s.P[0], 0], [0, 0], s.P, 0.25) : []), { cls: 'rmark' });
  b.pt([0, 0], { r: 6 });
  b.text([0, 0], 'O', { cls: 'fl', dx: -18, dy: 20 });
  b.text(() => [s.P[0] / 2, 0], () => String(s.P[0]), { cls: 'fl', dx: -4, dy: 22 });
  b.text(() => [s.P[0], s.P[1] / 2], () => String(s.P[1]), { cls: 'fl', dx: 8, dy: 6 });
  b.drag(() => s.P, (x, y) => {
    s.P = [Math.min(6, Math.max(0, Math.round(x))), Math.min(5, Math.max(0, Math.round(y)))];
  });
  b.onUpdate = () => {
    const [m, n] = s.P;
    const q = m * m + n * n;
    const msg = $('gridMsg');
    msg.className = `tip feedback ${ok() ? 'fb-ok' : ''}`;
    msg.innerHTML = q === 0
      ? '拖动橙色点离开原点。'
      : `直角边 ${m} cm、${n} cm：斜边 $=\\sqrt{${m}^2+${n}^2}=${q === s.n || !Number.isInteger(Math.sqrt(q)) ? `\\sqrt{${q}}` : Math.sqrt(q)}$ cm${ok() ? `，正是 $\\sqrt{${s.n}}$！` : `；目标是 $\\sqrt{${s.n}}$。`}`;
    tex(msg);
    $('gridTargets').querySelectorAll('[data-n]').forEach((x) => x.classList.toggle('solid', +x.dataset.n === s.n));
    okSeg.style.display = ok() ? '' : 'none';
  };
  $('gridTargets').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-n]');
    if (!btn) return;
    s.n = +btn.dataset.n;
    b.update();
  });
}

/* 第 7 页：圆规把 √n 画到数轴上。每一步：在数轴上 a 处作长 h 的垂线段 → 连斜边 → 以原点为圆心转到数轴 */
// 每一步 [a², h]：在表示 √(a²) 的点处作长 h 的垂线段（a² 用整数存，避免浮点误差）
const RECIPES = {
  2: [[1, 1]],
  3: [[1, 1], [2, 1]],
  5: [[4, 1]],
  6: [[4, 1], [5, 1]],
  10: [[9, 1]],
  13: [[9, 2]],
};
const STEP_MS = 1600;
function initNl() {
  const s = { t: 3, prog: [1, 1], done: new Set([2, 3]) };
  // 横纵同比例：横向 [−0.4, 4.7] 宽 5.1，纵向 [−0.75, 2.3] 高 3.05 → 680 × 407
  const b = keep(NumLine.board($('nl'), { from: 0, to: 4, y: [-0.75, 2.3], w: 680, h: 407, pad: 0.4 }));
  NumLine.axis(b, { from: 0, to: 4, minor: 0.5, lead: 0.3 });
  const steps = () => (RECIPES[s.t] || []).map(([a2, h]) => [Math.sqrt(a2), h]);
  [0, 1].forEach((i) => {
    const st = () => steps()[i];
    const p = () => s.prog[i] || 0;
    const ph = (a, z) => Math.min(1, Math.max(0, (p() - a) / (z - a)));
    b.seg(() => (st() && p() > 0 ? [[st()[0], 0], [st()[0], st()[1] * ph(0, 0.25)]] : HIDE), { cls: 'perp' });
    b.poly(() => (st() && p() >= 0.25 ? rightMark([st()[0], 0], [0, 0], [st()[0], st()[1]], 0.14) : []), { cls: 'rmark' });
    b.seg(() => (st() && p() > 0.25 ? [[0, 0], [st()[0] * ph(0.25, 0.4), st()[1] * ph(0.25, 0.4)]] : HIDE), { cls: 'hyp2' });
    b.curve((th) => {
      const step = st();
      if (!step || p() <= 0.4) return [NaN, NaN];
      const r = Math.hypot(step[0], step[1]);
      return [r * Math.cos(th), r * Math.sin(th)];
    }, 0, () => { const step = st(); return step ? Math.atan2(step[1], step[0]) * ph(0.4, 1) : 0; }, { cls: 'arcA', n: 120 });
  });
  // 已画出的点（按 n 精确定位）
  Object.keys(RECIPES).map(Number).forEach((n) => {
    const x = Math.sqrt(n);
    const shown = () => s.done.has(n);
    b.pt([x, 0], { r: 7, cls: 'mk', show: shown });
    b.text(() => (shown() ? [x, 0] : null), surd(n), { cls: 'nl-val', dy: [3, 6, 13].includes(n) ? -40 : -16 }); // 相邻两点靠得近，标签上下错开
  });
  b.onUpdate = () => {
    const msg = $('nlMsg');
    const all = steps();
    if (!all.length) { msg.className = 'tip feedback'; msg.textContent = '点上面的按钮，看圆规怎样把 √n 转到数轴上。'; return; }
    const fin = s.prog.every((v, i) => i >= all.length || v >= 1);
    msg.className = `tip feedback ${fin ? 'fb-ok' : ''}`;
    const how = RECIPES[s.t].map(([a2, h]) => `在 ${surd(a2)} 处作长 ${h} 的垂线段，斜边 = √(${a2} + ${h * h}) = ${surd(a2 + h * h)}`).join('；再');
    msg.textContent = `${how}。${fin ? `落点 ≈ ${Math.sqrt(s.t).toFixed(3)}，表示 ${surd(s.t)}。` : ''}`;
  };
  let raf = 0;
  const play = (t) => {
    cancelAnimationFrame(raf);
    s.t = t;
    s.prog = [0, 0];
    if (!RECIPES[t]) { s.done = new Set(); b.update(); return; }
    const n = RECIPES[t].length;
    const t0 = performance.now();
    const tick = (now) => {
      const e = (now - t0) / STEP_MS;
      s.prog = [0, 1].map((i) => (i < n ? Math.min(1, Math.max(0, e - i)) : 0));
      // 中间一步完成时把中间点也记为已画出（如画 √3 时先得到 √2）
      RECIPES[t].forEach(([a2, h], i) => { if (s.prog[i] >= 1) s.done = new Set([...s.done, a2 + h * h]); });
      b.update();
      if (e < n) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };
  $('nlTargets').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-t]');
    if (!btn) return;
    play(+btn.dataset.t);
  });
}

/* 第 10 页：放大的数轴，比较 −∛9 与 −√4.3265 */
function initCmp() {
  const A = -Math.cbrt(9);
  const B = -Math.sqrt(4.3265);
  const from = -2.0801;
  const to = -2.08;
  const b = keep(board($('cmpBoard'), { x: [from - 0.000012, to + 0.000016], y: [-1, 1.6], axes: false, grid: false, w: 680, h: 140 }));
  NumLine.axis(b, { from, to, step: 0.00002, tail: 0.00001, lead: 0.000008, label: (v) => v.toFixed(5).replace('-', '−') });
  b.pt([A, 0], { r: 7, cls: 'c1' });
  b.pt([B, 0], { r: 7, cls: 'c3' });
  b.text([A, 0], '−∛9', { cls: 'nl-val', dy: -16 });
  b.text([B, 0], '−√4.3265', { cls: 'nl-val', dy: -16 });
}

window.LESSON = {
  init() {
    initSpiral();
    initGrid();
    initNl();
    initCmp();
    boards.forEach((b) => b.update());
  },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
