'use strict';
/* 七上 4.3 用一元一次方程解决问题 · 本课互动：月历游戏、中国结线形图、环形跑道追及（核心）、工作量扇形图、夹克衫柱状图。
 * 所有图形由数值计算绘制：跑道上 1 圈 = 400 m（按弧长换算角度），扇形圆心角 = 工作量 × 360°，柱高与价格成正比。 */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);

/* ---------- 第 3 页：月历 ---------- */
const DAYS = 31;
const OFFSET = 4; // 1 号是星期四（日 一 二 三 四 五 六）
function initCalendar() {
  const s = { mode: 'row', sel: [] };
  const col = (d) => (OFFSET + d - 1) % 7;
  const pick = (d) => {
    if (s.mode === 'row') return col(d) <= 2 && d + 4 <= DAYS ? [d, d + 1, d + 2, d + 3, d + 4] : null;
    const ok = d - 7 >= 1 && d + 7 <= DAYS && col(d) >= 1 && col(d) <= 5;
    return ok ? [d - 7, d - 1, d, d + 1, d + 7] : null;
  };
  const draw = () => {
    const head = ['日', '一', '二', '三', '四', '五', '六'].map((w) => `<b>${w}</b>`).join('');
    const blanks = Array(OFFSET).fill('<span></span>').join('');
    const cells = Array.from({ length: DAYS }, (_, i) => `<button type="button" class="${s.sel.includes(i + 1) ? 'on' : ''}" data-d="${i + 1}">${i + 1}</button>`).join('');
    $('cal').innerHTML = head + blanks + cells;
    document.querySelectorAll('#calModes .btn').forEach((b) => b.classList.toggle('solid', b.dataset.m === s.mode));
    const m = $('calMsg');
    if (!s.sel.length) { m.className = 'tip feedback'; m.textContent = s.mode === 'row' ? '点同一行的一个数，向右圈出相邻的 5 个数（要放得下）．' : '点一个数，圈出它和上、下、左、右的 4 个数．'; return; }
    const sum = s.sel.reduce((a, b) => a + b, 0);
    m.className = 'tip feedback fb-ok';
    m.innerHTML = s.mode === 'row'
      ? `和是 ${sum}．反过来：设最小的数为 $x$，则 $x+(x+1)+(x+2)+(x+3)+(x+4)=${sum}$，即 $5x+10=${sum}$，$x=${s.sel[0]}$．`
      : `和是 ${sum}．反过来：设中间的数为 $x$，则 $(x-7)+(x-1)+x+(x+1)+(x+7)=${sum}$，即 $5x=${sum}$，$x=${s.sel[2]}$．`;
    tex(m);
  };
  $('cal').addEventListener('click', (e) => {
    const b = e.target.closest('[data-d]');
    if (!b) return;
    const got = pick(+b.dataset.d);
    if (got) { s.sel = got; draw(); return; }
    const m = $('calMsg');
    m.className = 'tip feedback fb-warn';
    m.textContent = s.mode === 'row' ? '这个数右边放不下 5 个数，换一个．' : '这个数上下左右不全，换一个．';
  });
  $('calModes').addEventListener('click', (e) => { const b = e.target.closest('[data-m]'); if (b) { s.mode = b.dataset.m; s.sel = []; draw(); } });
  draw();
}

/* ---------- 第 8 页：中国结线形示意图（图 4-3） ---------- */
function initKnot() {
  const s = { x: 20 };
  const bd = board($('knotBoard'), { x: [-6, 182], y: [-0.6, 5.4], axes: false, grid: false, w: 640, h: 230 });
  const plan5 = () => 5 * s.x - 9;
  const plan4 = () => 4 * s.x + 15;
  bd.seg(() => [[0, 4.2], [5 * s.x, 4.2]], { cls: 'bar5' });
  bd.seg(() => [[0, 3.3], [plan5(), 3.3]], { cls: 'plan' });
  bd.text(() => [5 * s.x / 2, 4.2], () => `5x = ${5 * s.x} 个`, { cls: 'lb up c', dy: -8 });
  bd.text(() => [plan5(), 3.3], () => `计划 ${plan5()}`, { cls: 'lb up', dx: 6, dy: 6 });
  bd.seg(() => [[0, 1.2], [4 * s.x, 1.2]], { cls: 'bar4' });
  bd.seg(() => [[0, 0.3], [plan4(), 0.3]], { cls: 'plan' });
  bd.text(() => [4 * s.x / 2, 1.2], () => `4x = ${4 * s.x} 个`, { cls: 'lb up c', dy: -8 });
  bd.text(() => [plan4(), 0.3], () => `计划 ${plan4()}`, { cls: 'lb up', dx: 6, dy: 6 });
  bd.seg(() => [[0, -1.2], [0, 5]], { cls: 'base' });
  bd.onUpdate = () => {
    $('knotXV').textContent = s.x;
    const m = $('knotMsg');
    const eq = plan5() === plan4();
    m.className = `tip feedback ${eq ? 'fb-ok' : 'fb-warn'}`;
    m.innerHTML = `$x=${s.x}$：按每人 5 个算，计划 $5x-9=${plan5()}$；按每人 4 个算，计划 $4x+15=${plan4()}$．${eq ? '两者相等 ✓' : '不相等——计划数只有一个'}`;
    tex(m);
  };
  slider($('knotX'), (v) => { s.x = v; bd.update(); });
}

/* ---------- 第 10 页：环形跑道（问题 4） ---------- */
const LAP = 400;
const MEET_T = 5;
function initTrack() {
  const s = { v: 90, t: 0 };
  const R = 4;
  const bd = board($('trackBoard'), { x: [-5.6, 5.6], y: [-5.6, 5.6], axes: false, grid: false, w: 360 });
  bd.curve((u) => [R * Math.cos(u), R * Math.sin(u)], 0, 2 * Math.PI, { cls: 'lane' });
  const pos = (d) => { const a = -Math.PI / 2 + (2 * Math.PI * (d % LAP)) / LAP; return [R * Math.cos(a), R * Math.sin(a)]; };
  const dG = () => s.v * s.t;
  const dH = () => (5 / 3) * s.v * s.t;
  bd.seg([[0, -R - 0.5], [0, -R + 0.5]], { cls: 'startline' });
  bd.text([0, -R - 0.5], '起点', { cls: 'lb up c', dy: 24 });
  bd.pt(() => pos(dG()), { r: 9, cls: 'gp' });
  bd.pt(() => pos(dH()), { r: 9, cls: 'xh' });
  bd.text(() => pos(dG()), '爷', { cls: 'lb up c tl', dy: 6 });
  bd.text(() => pos(dH()), '红', { cls: 'lb up c tl', dy: 6 });
  // 线形示意图（图 4-4）
  const MAXD = (5 / 3) * 180 * MEET_T;
  const ln = board($('lineBoard'), { x: [-170, MAXD + 40], y: [-1.4, 2.4], axes: false, grid: false, w: 560, h: 120 });
  ln.seg(() => [[0, 1.4], [dH(), 1.4]], { cls: 'xhbar' });
  ln.seg(() => [[0, 0], [dG(), 0]], { cls: 'gpbar' });
  ln.seg(() => [[dG(), 0], [dG() + LAP, 0]], { cls: 'lapbar' });
  ln.text([0, 1.4], '小红', { cls: 'lb up e', dx: -6, dy: 6 });
  ln.text([0, 0], '爷爷', { cls: 'lb up e', dx: -6, dy: 6 });
  ln.text(() => [dG() + LAP / 2, 0], '一圈 400 m', { cls: 'lb up c', dy: 24 });
  const update = () => { bd.update(); ln.update(); };
  bd.onUpdate = () => {
    $('trVV').textContent = s.v; $('trHV').textContent = fmt((5 / 3) * s.v, 1);
    $('trTV').textContent = fmt(s.t, 1);
    $('trT').value = s.t;
    const gap = dH() - dG();
    const m = $('trMsg');
    const done = Math.abs(s.t - MEET_T) < 1e-9;
    const hit = done && Math.abs(gap - LAP) < 1e-6;
    m.className = `tip feedback ${hit ? 'fb-ok' : done ? 'fb-warn' : ''}`;
    m.innerHTML = `$t=${fmt(s.t, 1)}$ min：小红跑了 $${fmt(dH(), 0)}$ m，爷爷跑了 $${fmt(dG(), 0)}$ m，相差 $${fmt(gap, 0)}$ m`
      + (done ? (hit ? '——正好一圈，第一次相遇 ✓' : `——不是 400 m，${gap < LAP ? '还没追上' : '早就追上过了'}`) : '');
    tex(m);
  };
  let raf = 0;
  const play = () => {
    cancelAnimationFrame(raf);
    const t0 = performance.now();
    const DUR = 5000;
    const tick = (now) => {
      s.t = Math.min(MEET_T, (MEET_T * (now - t0)) / DUR);
      update();
      if (s.t < MEET_T) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };
  $('trPlay').addEventListener('click', play);
  slider($('trV'), (v) => { s.v = v; update(); });
  slider($('trT'), (v) => { cancelAnimationFrame(raf); s.t = v; update(); });
}

/* ---------- 第 12 页：工作量扇形图（图 4-5） ---------- */
function initPie() {
  const s = { x: 2 };
  const bd = board($('pieBoard'), { x: [-1.25, 1.25], y: [-1.25, 1.25], axes: false, grid: false, w: 320 });
  const N = 120;
  const sector = (from, to) => {
    if (to <= from) return [];
    const pts = [[0, 0]];
    for (let i = 0; i <= N; i++) { const a = Math.PI / 2 - 2 * Math.PI * (from + ((to - from) * i) / N); pts.push([Math.cos(a), Math.sin(a)]); }
    return pts;
  };
  const parts = () => { const a = 8 / 18; const b = s.x / 18; const c = s.x / 12; return [a, b, c]; };
  const cum = (k) => Math.min(1, parts().slice(0, k).reduce((p, q) => p + q, 0));
  bd.poly(() => sector(0, 1), { cls: 'pie-bg' });
  ['p1', 'p2', 'p3'].forEach((cls, k) => bd.poly(() => sector(cum(k), cum(k + 1)), { cls: `pie ${cls}` }));
  bd.curve((u) => [Math.cos(u), Math.sin(u)], 0, 2 * Math.PI, { cls: 'pie-rim' });
  bd.onUpdate = () => {
    $('pieXV').textContent = fmt(s.x);
    const [a, b, c] = parts();
    const tot = a + b + c;
    const m = $('pieMsg');
    const full = Math.abs(tot - 1) < 1e-9;
    m.className = `tip feedback ${full ? 'fb-ok' : 'fb-warn'}`;
    m.innerHTML = `$\\frac{8}{18}+\\frac{${fmt(s.x)}}{18}+\\frac{${fmt(s.x)}}{12}=${fmt(tot, 3)}$` + (full ? '，正好是全部工作量 1 ✓' : tot < 1 ? '，还没做完（灰色是剩下的）' : '，超过了全部工作量 1');
    tex(m);
  };
  slider($('pieX'), (v) => { s.x = v; bd.update(); });
}

/* ---------- 第 14 页：夹克衫柱状图（图 4-6），按成本 140 元精确绘制 ---------- */
function initBars() {
  const COST = 140;
  const TAG = COST * 1.5;
  const SALE = TAG * 0.8;
  const bd = board($('barBoard'), { x: [-0.6, 7.4], y: [-40, 250], axes: false, grid: false, w: 420, h: 230 });
  const bar = (x0, h, cls) => bd.poly([[x0, 0], [x0 + 1.4, 0], [x0 + 1.4, h], [x0, h]], { cls });
  bar(0.4, COST, 'b-cost'); bar(3, TAG, 'b-tag'); bar(5.6, SALE, 'b-sale');
  bd.seg([[5.6, COST], [7, COST]], { cls: 'b-cut' });
  bd.seg([[-0.6, 0], [7.4, 0]], { cls: 'b-axis' });
  [[1.1, '成本'], [3.7, '标价'], [6.3, '售价']].forEach(([x, t]) => bd.text([x, 0], t, { cls: 'lb up c', dy: 22 }));
  bd.text([1.1, COST], 'x 元', { cls: 'lb up c', dy: -6 });
  bd.text([3.7, TAG], '(1+50%)x 元', { cls: 'lb up c', dy: -6 });
  bd.text([6.3, SALE], '×80%', { cls: 'lb up c', dy: -6 });
  bd.text([6.3, (COST + SALE) / 2], '28 元', { cls: 'lb up c sm', dy: 6 });
  bd.update();
}

window.LESSON = {
  init() {
    initCalendar();
    initKnot();
    initTrack();
    initPie();
    initBars();
  },
};
