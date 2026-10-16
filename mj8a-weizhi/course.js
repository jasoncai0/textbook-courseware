'use strict';
/* 八上 5.1 位置的确定 · 本课互动：按经纬度描台风路径、垂直平分线上的点（一个数据）、
 * 长方形中 P 动 Q 动（记录 OP、OQ 两个数）、围棋盘“地址”、直线上找使周长最小的点。通用部分见 ../shared/math.js、mgeo.js。
 * 所有点按数据或几何条件由坐标精确算出；作图板横纵同比例。 */
const { fmt, tex } = MathKit;
const { add, sub, mul, dist, lerp, meet, right } = Geo;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const HIDE = [999, 999];

/** 画板上一次点击的世界坐标 */
function worldOf(b, box, e) {
  const p = b.svg.createSVGPoint();
  p.x = e.clientX;
  p.y = e.clientY;
  const q = p.matrixTransform(b.svg.getScreenCTM().inverse());
  return [box.x[0] + (q.x * (box.x[1] - box.x[0])) / b.W, box.y[1] - (q.y * (box.y[1] - box.y[0])) / b.H];
}

/* ---------- 第 3 页：台风路径（数据照课本 p116 尝试、习题 5.1 第 1 题） ---------- */
const TY = {
  try: [
    ['8.22', '02:00', 130.7, 19.6], ['8.22', '14:00', 128.9, 20.9], ['8.23', '02:00', 127.1, 22.2], ['8.23', '14:00', 125.5, 23.5],
    ['8.24', '02:00', 124.5, 24.6], ['8.24', '14:00', 123.5, 25.3], ['8.25', '02:00', 122.1, 25.5], ['8.25', '14:00', 120.4, 25.5],
    ['8.26', '02:00', 117.9, 24.3], ['8.26', '14:00', 116.6, 23.8], ['8.27', '02:00', 114.4, 23.4],
  ],
  ex: [['8月8日', '14:00', 130.5, 17.7], ['8月9日', '14:00', 130.1, 20.0], ['8月10日', '14:00', 128.0, 22.1], ['8月11日', '14:00', 125.5, 23.8]],
};
const TOL = 0.3;
function initTyphoon() {
  const box = { x: [112.4, 132.6], y: [16.4, 27.4] };
  const s = { set: 'try', on: [], pick: 0 };
  const rows = () => TY[s.set];
  const b = Geo.board($('typhoon'), { ...box, w: 640 });
  for (let x = 113; x <= 132; x++) b.seg([[x, box.y[0]], [x, box.y[1]]], { cls: x % 2 ? 'grat' : 'grat b' });
  for (let y = 17; y <= 27; y++) b.seg([[box.x[0], y], [box.x[1], y]], { cls: y % 2 ? 'grat' : 'grat b' });
  for (let x = 114; x <= 130; x += 2) b.text([x, box.y[0]], `${x}°`, { cls: 'tk', dx: -12, dy: -4 });
  for (let y = 18; y <= 26; y += 2) b.text([box.x[0], y], `${y}°`, { cls: 'tk', dx: 2, dy: -3 });
  b.text([box.x[1], box.y[0]], '东经', { cls: 'tk', dx: -34, dy: -18 });
  b.text([box.x[0], box.y[1]], '北纬', { cls: 'tk', dx: 4, dy: 16 });
  // 选中行的经线、纬线
  b.seg(() => { const r = rows()[s.pick]; return r ? [[r[2], box.y[0]], [r[2], box.y[1]]] : [HIDE, HIDE]; }, { cls: 'guide' });
  b.seg(() => { const r = rows()[s.pick]; return r ? [[box.x[0], r[3]], [box.x[1], r[3]]] : [HIDE, HIDE]; }, { cls: 'guide' });
  const MAXP = 11;
  Array.from({ length: MAXP - 1 }, (_, i) => b.seg(() => {
    const r = rows();
    return s.on.includes(i) && s.on.includes(i + 1) && r[i + 1] ? [[r[i][2], r[i][3]], [r[i + 1][2], r[i + 1][3]]] : [HIDE, HIDE];
  }, { cls: 'path' }));
  Array.from({ length: MAXP }, (_, i) => b.pt(() => { const r = rows()[i]; return r && s.on.includes(i) ? [r[2], r[3]] : null; }, { cls: 'eye', r: 6 }));
  const tab = $('tyTab');
  const render = () => {
    tab.innerHTML = `<tr><th>时间</th><th>东经/°</th><th>北纬/°</th></tr>${rows().map((r, i) => `<tr data-i="${i}" class="${i === s.pick ? 'on' : ''} ${s.on.includes(i) ? 'done' : ''}"><td>${r[0]} ${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}`;
    const msg = $('tyMsg');
    const r = rows()[s.pick];
    const all = s.on.length === rows().length;
    msg.className = `tip feedback ${all ? 'fb-ok' : ''}`;
    msg.textContent = all ? '全部描出！看看台风中心是怎样移动的。' : r ? `请在图上点出：东经 ${r[2]}°、北纬 ${r[3]}°（${r[0]} ${r[1]}）。` : '';
    b.update();
  };
  tab.addEventListener('click', (e) => {
    const tr = e.target.closest('tr[data-i]');
    if (!tr) return;
    s.pick = +tr.dataset.i;
    render();
  });
  b.svg.addEventListener('click', (e) => {
    const [x, y] = worldOf(b, box, e);
    const r = rows()[s.pick];
    if (!r) return;
    const msg = $('tyMsg');
    if (Math.abs(x - r[2]) < TOL && Math.abs(y - r[3]) < TOL) {
      s.on = s.on.includes(s.pick) ? s.on : [...s.on, s.pick];
      const next = rows().findIndex((_, i) => !s.on.includes(i));
      s.pick = next < 0 ? s.pick : next;
      render();
      return;
    }
    msg.className = 'tip feedback fb-warn';
    msg.textContent = `你点的是东经约 ${fmt(x, 1)}°、北纬约 ${fmt(y, 1)}°，再找找：东经 ${r[2]}°、北纬 ${r[3]}°。`;
  });
  $('tyAll').addEventListener('click', () => { s.on = rows().map((_, i) => i); render(); });
  $('tyClr').addEventListener('click', () => { s.on = []; s.pick = 0; render(); });
  $('tySet').addEventListener('click', (e) => {
    s.set = s.set === 'try' ? 'ex' : 'try';
    s.on = [];
    s.pick = 0;
    e.target.textContent = s.set === 'try' ? '换成习题 1 的台风' : '换回课本“尝试”的台风';
    render();
  });
  render();
}

/* ---------- 第 5 页：图 5-1，P 在 AB 的垂直平分线上 ---------- */
function initPerp() {
  const AO = 2;
  const A = [-AO, 0];
  const B = [AO, 0];
  const O = [0, 0];
  const s = { p: 4.2 };
  const P = () => [0, s.p];
  const SNAPS = [AO, Math.sqrt(3) * AO];
  const b = Geo.board($('perp'), { x: [-4.6, 4.6], y: [-4.4, 4.6], w: 520 });
  Geo.line(b, [0, 0], [0, 1], { cls: 'gl axis-l' });
  b.poly(() => [P(), A, B], { cls: 'tri-f' });
  right(b, O, B, [0, 1], { s: 0.25 });
  b.text([0, 4.4], 'l', { dx: 8, dy: 8 });
  b.text(A, 'A', { dx: -20, dy: 6 });
  b.text(B, 'B', { dx: 8, dy: 6 });
  b.text(O, 'O', { dx: 6, dy: 22 });
  b.text(P, 'P', { dx: 10, dy: 0 });
  b.drag(P, (x, y) => {
    let p = clamp(y, -4.2, 4.2);
    if (Math.abs(p) < 0.3) p = p < 0 ? -0.3 : 0.3;
    const near = SNAPS.find((v) => Math.abs(Math.abs(p) - v) < 0.15);
    s.p = near ? Math.sign(p) * near : p;
  });
  b.onUpdate = () => {
    const r = Math.abs(s.p) / AO;
    const ang = (2 * Math.atan(AO / Math.abs(s.p)) * 180) / Math.PI;
    $('pRatio').textContent = fmt(r, 3);
    $('pAng').textContent = `${fmt(ang, 1)}°`;
    const msg = $('pMsg');
    const side = s.p > 0 ? '上方' : '下方';
    if (Math.abs(r - 1) < 1e-9) { msg.className = 'tip feedback fb-ok'; msg.textContent = `PO = AO（P 在 O ${side}）：∠APB = 90°，△PAB 是等腰直角三角形。`; return; }
    if (Math.abs(r - Math.sqrt(3)) < 1e-9) { msg.className = 'tip feedback fb-ok'; msg.textContent = `PO = √3·AO（P 在 O ${side}）：∠APB = 60°，△PAB 是等边三角形。`; return; }
    msg.className = 'tip feedback';
    msg.textContent = `P 在 O ${side}，△PAB 是等腰三角形（PA = PB）。`;
  };
  b.update();
}

/* ---------- 第 6 页：图 5-2，长方形 OABC（OA = 6，OC = 4），PQ ⊥ BP ---------- */
function initRect() {
  const W = 6;
  const H = 4;
  const O = [0, 0];
  const A = [W, 0];
  const B = [W, H];
  const C = [0, H];
  const s = { p: 1.2, rec: [] };
  const P = () => [s.p, 0];
  const Q = () => [0, (s.p * (W - s.p)) / H]; // 由 PQ ⊥ BP 得 OQ = OP·PA / AB
  const b = Geo.board($('rect'), { x: [-0.9, 6.9], y: [-0.9, 4.6], w: 520 });
  b.poly([O, A, B, C], { cls: 'rect' });
  b.seg(() => [B, P()], { cls: 'gl c-a' });
  b.seg(() => [P(), Q()], { cls: 'gl c-b' });
  right(b, P, B, Q, { s: 0.25 });
  b.pt(Q, { cls: 'c2' });
  b.text(O, 'O', { dx: -18, dy: 18 });
  b.text(A, 'A', { dx: 6, dy: 18 });
  b.text(B, 'B', { dx: 6, dy: -4 });
  b.text(C, 'C', { dx: -18, dy: 0 });
  b.text(P, 'P', { dx: -4, dy: 22 });
  b.text(Q, 'Q', { dx: -20, dy: 6 });
  const g = Geo.board($('graph'), { x: [-0.6, 6.6], y: [-0.5, 2.8], w: 520, h: 150 });
  g.seg([[0, 0], [6.3, 0]], { cls: 'gax' });
  g.seg([[0, 0], [0, 2.6]], { cls: 'gax' });
  g.text([6.3, 0], 'OP', { cls: 'tk', dx: -16, dy: 16 });
  g.text([0, 2.6], 'OQ', { cls: 'tk', dx: 6, dy: 10 });
  const MAXR = 60;
  Array.from({ length: MAXR }, (_, i) => g.pt(() => s.rec[i] || null, { cls: 'trace', r: 3.5 }));
  g.pt(() => [s.p, Q()[1]], { cls: 'c2', r: 6 });
  b.drag(P, (x) => {
    s.p = clamp(x, 0.05, W - 0.05);
    const pt = [s.p, Q()[1]];
    if (s.rec.every((r) => Math.abs(r[0] - pt[0]) > 0.12)) s.rec = [...s.rec, pt].slice(-MAXR);
    g.update();
  });
  b.onUpdate = () => {
    $('rOP').textContent = fmt(s.p);
    $('rOQ').textContent = fmt(Q()[1]);
    g.update();
  };
  $('rClr').addEventListener('click', () => { s.rec = []; g.update(); });
  b.update();
}

/* ---------- 第 7 页：围棋盘（点位照课本 p118 练习图） ---------- */
const HAN = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九'];
const STONES = { A: [5, 10], B: [10, 11], C: [4, 4], D: [16, 4], E: [16, 16], F: [4, 16] };
const TASK = { M: [7, 6], N: [13, 16] };
function initGo() {
  const N = 19;
  const box = { x: [-0.6, 20], y: [0, 20.6] };
  const s = { mine: [], last: null };
  const at = ([c, r]) => [c, 20 - r]; // 第 c 路纵线、第 r 路横线
  const b = Geo.board($('go'), { ...box, w: 520 });
  for (let i = 1; i <= N; i++) {
    b.seg([at([i, 1]), at([i, N])], { cls: 'goline' });
    b.seg([at([1, i]), at([N, i])], { cls: 'goline' });
    b.text(at([i, 0]), String(i), { cls: 'tk', dx: -5, dy: 4 });
    b.text(at([0, i]), HAN[i - 1], { cls: 'tk han', dx: -6, dy: 5 });
  }
  Object.entries(STONES).forEach(([k, p]) => { b.pt(at(p), { cls: 'stone', r: 6 }); b.text(at(p), k, { cls: 'lb', dx: 6, dy: -6 }); });
  Object.keys(TASK).forEach((k, i) => {
    b.pt(() => (s.mine.includes(k) ? at(TASK[k]) : null), { cls: 'stone w', r: 7 });
    b.text(() => (s.mine.includes(k) ? at(TASK[k]) : null), k, { cls: 'lb', dx: 7, dy: -7 });
    return i;
  });
  b.pt(() => (s.last ? at(s.last) : null), { cls: 'cursor', r: 9 });
  const say = () => {
    const done = Object.keys(TASK).filter((k) => s.mine.includes(k));
    $('goTask').textContent = done.length === 2 ? '✓ M、N 都画对了！' : done.length ? `✓ 已画出 ${done.join('、')}，还差 ${Object.keys(TASK).find((k) => !done.includes(k))}` : '（在左边棋盘上点出来）';
  };
  b.svg.addEventListener('click', (e) => {
    const [x, y] = worldOf(b, box, e);
    const c = Math.round(x);
    const r = Math.round(20 - y);
    if (c < 1 || c > N || r < 1 || r > N) return;
    s.last = [c, r];
    const name = Object.keys(STONES).find((k) => STONES[k][0] === c && STONES[k][1] === r);
    const task = Object.keys(TASK).find((k) => TASK[k][0] === c && TASK[k][1] === r);
    if (task && !s.mine.includes(task)) s.mine = [...s.mine, task];
    $('goMsg').textContent = `这个交叉点是：${c}，${HAN[r - 1]}${name ? `（点 ${name}）` : ''}${task ? `（点 ${task}）` : ''}`;
    say();
    b.update();
  });
  say();
  b.update();
}

/* ---------- 第 8 页：周长最小（P 关于 l 的对称点） ---------- */
function initMirror() {
  const P = [-2, -1.5];
  const Q = [2.6, -3.2];
  const P2 = [P[0], -P[1]];
  const L = [[0, 0], [1, 0]];
  const best = meet(P2, Q, ...L);
  const minPer = dist(P2, Q) + dist(P, Q);
  const s = { t: -3.6, show: false };
  const O = () => [s.t, 0];
  const per = () => dist(O(), P) + dist(O(), Q) + dist(P, Q);
  const b = Geo.board($('mirror'), { x: [-5, 5], y: [-4, 2.4], w: 560 });
  b.seg([[-5, 0], [5, 0]], { cls: 'gs' });
  b.text([4.7, 0], 'l', { dx: 0, dy: -8 });
  b.poly(() => [O(), P, Q], { cls: 'tri-f' });
  b.seg(() => (s.show ? [P, P2] : [HIDE, HIDE]), { cls: 'gdash' });
  b.seg(() => (s.show ? [P2, Q] : [HIDE, HIDE]), { cls: 'gdash' });
  b.seg(() => (s.show ? [O(), P2] : [HIDE, HIDE]), { cls: 'gl ghost-l' });
  b.pt(() => (s.show ? P2 : null), { cls: 'c2' });
  b.text(() => (s.show ? P2 : null), "P'", { dx: 8, dy: -4 });
  b.pt(() => (s.show ? best : null), { cls: 'trace', r: 5 });
  b.text(P, 'P', { dx: -20, dy: 6 });
  b.text(Q, 'Q', { dx: 8, dy: 10 });
  b.text(O, 'O', { dx: -6, dy: -10 });
  b.drag(O, (x) => {
    const t = clamp(x, -4.6, 4.6);
    s.t = Math.abs(t - best[0]) < 0.08 ? best[0] : t;
  });
  b.onUpdate = () => {
    $('mPer').textContent = fmt(per());
    $('mMin').textContent = s.show ? fmt(minPer) : '?';
    const msg = $('mMsg');
    const atBest = s.t === best[0];
    msg.className = `tip feedback ${atBest ? 'fb-ok' : ''}`;
    msg.textContent = atBest ? '点 O 在 P′Q 与 l 的交点：周长最小！' : '拖动 O：周长怎样变化？';
  };
  $('mShow').addEventListener('click', () => { s.show = !s.show; b.update(); });
  b.update();
}

window.LESSON = {
  init() {
    initTyphoon();
    initPerp();
    initRect();
    initGo();
    initMirror();
    tex(document.getElementById('tyTab'));
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
