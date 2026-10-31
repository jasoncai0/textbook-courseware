'use strict';
/* 六下 用方向和距离确定位置 · 本课互动：例 1 量角度/量距离、方向盘（拖小船读方向和距离）、射线与圆（为什么要两个条件）、
 * 例 2 及练习的定位置画板、练习九第 1 题雷达屏幕。
 * 方向一律从正北或正南量起；画板的单位是“图上厘米”，所有点按“角度 + 图上距离”精确计算（MathKit.board，横纵同比例）。 */
const { board } = MathKit;
const $ = (id) => document.getElementById(id);
const RAD = Math.PI / 180;
const NS = 'http://www.w3.org/2000/svg';
const boards = [];

/* ---------- 方向计算：θ 为从正北顺时针转过的度数 ---------- */
const norm = (d) => ((d % 360) + 360) % 360;
const at = (o, th, r) => [o[0] + r * Math.sin(th * RAD), o[1] + r * Math.cos(th * RAD)];
const bearingOf = (o, p) => norm(Math.atan2(p[0] - o[0], p[1] - o[1]) / RAD);
const snap = (v, st) => Math.round(v / st) * st;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
/** 课本说法：北偏东 30°；正好在轴上时说“正北”等 */
function dirParts(th) {
  const t = Math.round(norm(th));
  const axis = { 0: '正北', 90: '正东', 180: '正南', 270: '正西' }[t];
  if (axis) return { axis, deg: 0 };
  if (t < 90) return { a: '北', b: '东', deg: t };
  if (t < 180) return { a: '南', b: '东', deg: 180 - t };
  if (t < 270) return { a: '南', b: '西', deg: t - 180 };
  return { a: '北', b: '西', deg: 360 - t };
}
const dirText = (th) => { const d = dirParts(th); return d.axis || `${d.a}偏${d.b} ${d.deg}°`; };
// 量角从哪条轴开始：北偏东/北偏西从正北（0 或 360），南偏东/南偏西从正南（180）
const axisOf = (th) => { const t = norm(th); return t <= 90 ? 0 : t < 270 ? 180 : 360; };
// 用类名隐藏（画板每次重绘会改写内联 display，类名里的 !important 不受影响）
const show = (nodes, on) => nodes.forEach((n) => n.classList.toggle('off', !on));

/* ---------- 画板上的公共图元 ---------- */
/** 量角器式方向盘：圆周每 5° 一个刻度，每 30° 标出偏离南北线的度数 */
function dial(b, o, R) {
  const nodes = [b.curve((t) => at(o, 360 * t, R), 0, 1, { cls: 'dial', n: 180 })];
  for (let d = 0; d < 360; d += 5) nodes.push(b.seg([at(o, d, R * (d % 30 ? 0.93 : 0.86)), at(o, d, R)], { cls: d % 30 ? 'dtk' : 'dtk big' }));
  for (let d = 30; d < 360; d += 30) if (d % 90) nodes.push(b.text(at(o, d, R * 0.7), String(dirParts(d).deg), { cls: 'dn', dy: 5 }));
  return nodes;
}
/** 十字方向线 + 北南东西 */
function cross(b, o, L, labels = true) {
  const nodes = [b.seg([at(o, 0, L), at(o, 180, L)], { cls: 'axl' }), b.seg([at(o, 90, L), at(o, 270, L)], { cls: 'axl' })];
  if (labels) [['北', 0], ['东', 90], ['南', 180], ['西', 270]].forEach(([s, d]) => nodes.push(b.text(at(o, d, L + 0.3), s, { cls: 'nsew', dy: 7 })));
  return nodes;
}
/** 从南北线量到方向 θ 的角：加粗起始轴、弧、度数 */
function angleMark(b, o, thGet, r) {
  const s0 = () => axisOf(thGet());
  const t1 = () => (norm(thGet()) === 0 ? s0() : norm(thGet()));
  return [
    b.seg(() => [o, at(o, s0(), r * 1.6)], { cls: 'axhi' }),
    b.curve((t) => at(o, s0() + (t1() - s0()) * t, r), 0, 1, { cls: 'arc', n: 60 }),
    b.text(() => (dirParts(thGet()).deg ? at(o, (s0() + t1()) / 2, r + 0.42) : null), () => `${dirParts(thGet()).deg}°`, { cls: 'ang', dy: 6 }),
  ];
}
/** 沿方向 θ 的直尺：每 1 图上厘米一个刻度，标 label(k) */
function ruler(b, o, thGet, rGet, max, label) {
  const nodes = [];
  for (let k = 1; k <= max; k += 1) {
    const on = () => k <= rGet() + 1e-9;
    nodes.push(b.seg(() => { if (!on()) return [o, o]; const p = at(o, thGet(), k); return [at(p, thGet() + 90, 0.14), at(p, thGet() - 90, 0.14)]; }, { cls: 'rtk' }));
    nodes.push(b.text(() => (on() ? at(at(o, thGet(), k), thGet() - 90, 0.42) : null), label(k), { cls: 'rlab', dy: 5 }));
  }
  return nodes;
}
/** 线段比例尺：左端 p，每格 1 厘米表示 per */
function scaleBar(b, p, n, per, unit) {
  b.seg([p, [p[0] + n, p[1]]], { cls: 'sbar' });
  for (let k = 0; k <= n; k += 1) {
    b.seg([[p[0] + k, p[1]], [p[0] + k, p[1] + 0.14]], { cls: 'sbar' });
    b.text([p[0] + k, p[1] + 0.22], `${k * per}${k === n ? unit : ''}`, { cls: 'sb', dy: -2 });
  }
}
/** 地点：圆点 + 名字；lp 给出名字的位置（中心点在方向盘里时把名字放到盘外） */
function place(b, p, name, cls = '', lp = null) {
  const below = cls === 'ship';
  return [b.pt(p, { cls: `site ${cls}`, r: 7 }), b.text(lp || p, name, { cls: lp ? 'site-lb c' : 'site-lb', dx: lp ? 0 : 12, dy: lp ? 6 : (below ? 24 : -10) })];
}
const mkBoard = (el, o) => { const b = board(el, { axes: false, grid: false, ...o }); boards.push(b); return b; };

/* ---------- 第 2、3、9 页的小图（SVG 直接计算坐标） ---------- */
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const P = (o, th, r) => { const [x, y] = at([o[0], -o[1]], th, r); return [x, -y]; }; // SVG 的 y 轴向下
const txt = (svg, x, y, s, cls) => { svgEl('text', { x, y, class: cls }, svg).textContent = s; };

function initMini() {
  const rose = $('rose8');
  const c = [100, 78];
  ['北', '东北', '东', '东南', '南', '西南', '西', '西北'].forEach((s, i) => {
    const th = i * 45;
    const [x, y] = P(c, th, i % 2 ? 50 : 56);
    svgEl('line', { x1: c[0], y1: c[1], x2: x, y2: y, class: i % 2 ? 'm-thin' : 'm-axis' }, rose);
    const [tx, ty] = P(c, th, i % 2 ? 64 : 66);
    txt(rose, tx, ty + 5, s, i % 2 ? 'm-s' : 'm-b');
  });

  const pm = $('protMini');
  const o = [100, 128];
  svgEl('path', { d: `M${o[0] - 80} ${o[1]}A80 80 0 0 1 ${o[0] + 80} ${o[1]}Z`, class: 'm-prot' }, pm);
  for (let d = 0; d <= 180; d += 10) {
    const a = d * RAD;
    const k = d % 30 ? 72 : 66;
    svgEl('line', { x1: o[0] + 80 * Math.cos(a), y1: o[1] - 80 * Math.sin(a), x2: o[0] + k * Math.cos(a), y2: o[1] - k * Math.sin(a), class: 'm-tk' }, pm);
  }
  const A = 50 * RAD;
  svgEl('line', { x1: o[0], y1: o[1], x2: o[0] + 95, y2: o[1], class: 'm-ray' }, pm);
  svgEl('line', { x1: o[0], y1: o[1], x2: o[0] + 95 * Math.cos(A), y2: o[1] - 95 * Math.sin(A), class: 'm-ray' }, pm);
  svgEl('path', { d: `M${o[0] + 28} ${o[1]}A28 28 0 0 0 ${o[0] + 28 * Math.cos(A)} ${o[1] - 28 * Math.sin(A)}`, class: 'm-arc' }, pm);
  txt(pm, o[0] + 40, o[1] - 14, '50°', 'm-b');

  const sm = $('scaleMini');
  const [x0, y0, u] = [25, 80, 45];
  svgEl('line', { x1: x0, y1: y0, x2: x0 + 3 * u, y2: y0, class: 'm-axis' }, sm);
  for (let k = 0; k <= 3; k += 1) {
    svgEl('line', { x1: x0 + k * u, y1: y0, x2: x0 + k * u, y2: y0 - 8, class: 'm-axis' }, sm);
    txt(sm, x0 + k * u, y0 - 14, String(k * 10), 'm-s');
    if (k) txt(sm, x0 + (k - 0.5) * u, y0 + 22, '1 cm', 'm-s');
  }
  txt(sm, x0 + 3 * u + 22, y0 - 14, '千米', 'm-s');

  // 第 9 页：北偏东 30° 与东偏北 30°
  const ne = $('nvE');
  const q = [60, 130];
  svgEl('line', { x1: q[0], y1: q[1], x2: q[0], y2: 10, class: 'm-axis' }, ne);
  svgEl('line', { x1: q[0], y1: q[1], x2: 190, y2: q[1], class: 'm-axis' }, ne);
  txt(ne, q[0], 10, '北', 'm-b'); txt(ne, 190, q[1] - 6, '东', 'm-b');
  [[30, 'm-red'], [60, 'm-blue']].forEach(([th, cl]) => {
    const [x, y] = P(q, th, 115);
    svgEl('line', { x1: q[0], y1: q[1], x2: x, y2: y, class: cl }, ne);
  });
  const [a1x, a1y] = P(q, 30, 40);
  svgEl('path', { d: `M${q[0]} ${q[1] - 40}A40 40 0 0 1 ${a1x} ${a1y}`, class: 'm-arcr' }, ne);
  txt(ne, q[0] + 13, q[1] - 48, '30°', 'm-red-t');
  const [b1x, b1y] = P(q, 60, 58);
  svgEl('path', { d: `M${q[0] + 58} ${q[1]}A58 58 0 0 0 ${b1x} ${b1y}`, class: 'm-arcb' }, ne);
  txt(ne, q[0] + 74, q[1] - 10, '30°', 'm-blue-t');

  // 第 9 页：轮船看灯塔、灯塔看轮船（3 cm → 课本数据）
  const rv = $('revFig');
  const s = [55, 132];
  const l = P(s, 30, 112);
  [[s, '轮船'], [l, '灯塔 1']].forEach(([p, name], i) => {
    svgEl('line', { x1: p[0], y1: p[1] + 15, x2: p[0], y2: p[1] - 48, class: 'm-thin' }, rv);
    txt(rv, p[0], p[1] - 52, '北', 'm-s');
    svgEl('circle', { cx: p[0], cy: p[1], r: 5, class: i ? 'm-dot2' : 'm-dot' }, rv);
    txt(rv, p[0] + (i ? 30 : -24), p[1] + (i ? 4 : 14), name, 'm-s');
  });
  svgEl('line', { x1: s[0], y1: s[1], x2: l[0], y2: l[1], class: 'm-red' }, rv);
}

/* 第 3 页：轮船与两座灯塔（图上 1 cm = 60 px，按课本数据画） */
const PX = 60;
const LIGHTS = [{ name: '灯塔 1', th: 30, cm: 3 }, { name: '灯塔 2', th: 305, cm: 4 }];
function lighthouse(svg, x, y) {
  svgEl('path', { d: `M${x - 7} ${y + 6}L${x - 5} ${y - 22}L${x + 5} ${y - 22}L${x + 7} ${y + 6}Z`, fill: '#fff', stroke: '#c0392b', 'stroke-width': 2 }, svg);
  svgEl('rect', { x: x - 6, y: y - 12, width: 12, height: 5, fill: '#c0392b' }, svg);
  svgEl('path', { d: `M${x - 7} ${y - 22}L${x} ${y - 30}L${x + 7} ${y - 22}Z`, fill: '#c0392b' }, svg);
}
function initRough() {
  const svg = $('roughMap');
  const s = [210, 292];
  svgEl('line', { x1: s[0], y1: s[1], x2: s[0], y2: 22, class: 'm-axis' }, svg);
  txt(svg, s[0], 16, '北', 'm-b');
  [315, 45].forEach((th, i) => {
    const [x, y] = P(s, th, 262);
    svgEl('line', { x1: s[0], y1: s[1], x2: x, y2: y, class: 'm-guide' }, svg);
    txt(svg, x, y - 8, i ? '东北' : '西北', 'm-g');
  });
  LIGHTS.forEach((L) => {
    const [x, y] = P(s, L.th, L.cm * PX);
    svgEl('line', { x1: s[0], y1: s[1], x2: x, y2: y, class: 'm-sight' }, svg);
    lighthouse(svg, x, y);
    txt(svg, x + (L.th < 180 ? 36 : 2), y + 26, L.name, 'm-s');
  });
  svgEl('path', { d: `M${s[0] - 16} ${s[1] - 4}H${s[0] + 16}L${s[0] + 11} ${s[1] + 9}H${s[0] - 11}Z`, fill: '#3b6ea5' }, svg);
  svgEl('rect', { x: s[0] - 6, y: s[1] - 14, width: 12, height: 10, fill: '#f4f4f4', stroke: '#3b6ea5' }, svg);
  txt(svg, s[0] + 44, s[1] + 8, '轮船', 'm-s');
}

/* ---------- 第 4 页：例 1 量角度、量距离 ---------- */
function initMeasure() {
  const b = mkBoard($('measBoard'), { x: [-4.1, 3.7], y: [-1.6, 3.35], w: 620 });
  const O = [0, 0];
  const st = { angle: false, dist: false };
  cross(b, O, 1.45, false);
  b.seg([O, [0, 3.1]], { cls: 'north' });
  b.text([0, 3.1], '北', { cls: 'nsew', dx: 14, dy: 8 });
  scaleBar(b, [1.0, -1.3], 3, 10, ' 千米');
  const dialNodes = dial(b, O, 1.2);
  const marks = [];
  LIGHTS.forEach((L) => {
    const p = at(O, L.th, L.cm);
    b.seg([O, p], { cls: 'sight' });
    place(b, p, L.name, 'light');
    marks.push(...angleMark(b, O, () => L.th, 0.8 + (L.th > 180 ? 0.2 : 0)));
    marks.push(...ruler(b, O, () => L.th, () => (st.dist ? L.cm : 0), L.cm, (k) => `${k}cm`));
  });
  place(b, O, '轮船', 'ship');
  const render = () => {
    show(dialNodes, st.angle);
    show(marks.filter((n) => n.classList.contains('arc') || n.classList.contains('ang') || n.classList.contains('axhi')), st.angle);
    $('mAngle').classList.toggle('solid', st.angle);
    $('mDist').classList.toggle('solid', st.dist);
    b.update();
  };
  $('mAngle').addEventListener('click', () => { st.angle = !st.angle; render(); });
  $('mDist').addEventListener('click', () => { st.dist = !st.dist; render(); });
  render();
}

/* ---------- 第 5 页：方向盘 ---------- */
const WHEEL_TASKS = [{ th: 135, cm: 3 }, { th: 250, cm: 2.5 }, { th: 320, cm: 4 }];
const WHEEL_PER = 10;
function initWheel() {
  const R = 5;
  const b = mkBoard($('wheelBoard'), { x: [-R - 0.4, R + 0.4], y: [-R - 0.4, R + 0.4], w: 560 });
  const O = [0, 0];
  const s = { th: 60, r: 2, done: new Set() };
  cross(b, O, R - 0.2);
  dial(b, O, 1.5);
  b.curve((t) => at(O, 360 * t, R - 0.5), 0, 1, { cls: 'ring', n: 180 });
  scaleBar(b, [-R + 0.1, -R + 0.1], 3, WHEEL_PER, ' 千米');
  WHEEL_TASKS.forEach((t, i) => b.text(() => (s.done.has(i) ? at(O, t.th, t.cm) : null), '⚑', { cls: 'flag', dx: -4, dy: 2 }));
  b.seg(() => [O, at(O, s.th, s.r)], { cls: 'c2' });
  angleMark(b, O, () => s.th, 1.0);
  ruler(b, O, () => s.th, () => s.r, 5, (k) => `${k}`);
  place(b, O, '黎明港', 'ship', at(O, 215, 1.95));
  const taskText = (t) => `${dirText(t.th)} 方向 ${t.cm * WHEEL_PER} 千米处`;
  const render = () => {
    $('wheelRead').innerHTML = `小船在黎明港的 <b>${dirText(s.th)}</b> 方向<br>图上 <b>${s.r}</b> 厘米 → 实际 <b>${s.r} × ${WHEEL_PER} = ${s.r * WHEEL_PER}</b> 千米处`;
    const hit = WHEEL_TASKS.findIndex((t) => t.th === norm(s.th) && t.cm === s.r);
    const msg = $('wheelMsg');
    if (hit >= 0) {
      s.done.add(hit);
      msg.className = 'tip feedback fb-ok';
      msg.innerHTML = `<b>✓ 到了！</b>${taskText(WHEEL_TASKS[hit])}。${s.done.size === WHEEL_TASKS.length ? '三个任务全部完成！' : ''}`;
    } else {
      msg.className = 'tip feedback';
      msg.innerHTML = '先转方向，再调距离。南偏东、南偏西要从<b>正南</b>量起。';
    }
    $('wheelTasks').innerHTML = WHEEL_TASKS.map((t, i) => `<p class="${s.done.has(i) ? 'done' : ''}">${i + 1}. ${taskText(t)}</p>`).join('');
  };
  b.drag(() => at(O, s.th, s.r), (x, y) => {
    s.th = norm(snap(bearingOf(O, [x, y]), 5));
    s.r = clamp(snap(Math.hypot(x, y), 0.5), 0.5, R - 0.5);
    render();
  }, { r: 11, hit: 26 });
  b.onUpdate = render;
  render();
}

/* ---------- 第 6 页：射线与圆 ---------- */
function initWhy() {
  const b = mkBoard($('whyBoard'), { x: [-3.8, 4.2], y: [-1.3, 4.2], w: 600 });
  const O = [0, 0];
  const L = LIGHTS[0];
  cross(b, O, 1.1, false);
  b.seg([O, [0, 4]], { cls: 'north' });
  b.text([0, 4], '北', { cls: 'nsew', dx: 14, dy: 10 });
  const ray = [b.seg([O, at(O, L.th, 8)], { cls: 'c1' }), ...angleMark(b, O, () => L.th, 0.7)];
  [1, 2, 4].forEach((k) => ray.push(b.pt(at(O, L.th, k), { cls: 'ghostpt', r: 6 })));
  const circ = [b.curve((t) => at(O, 360 * t, L.cm), 0, 1, { cls: 'c3', n: 240 })];
  [-60, -25, 70, 300].forEach((d) => circ.push(b.pt(at(O, d, L.cm), { cls: 'ghostpt g', r: 6 })));
  const hit = place(b, at(O, L.th, L.cm), '灯塔 1', 'light');
  place(b, O, '轮船', 'ship');
  const MSG = {
    dir: '北偏东 30° 方向上的点<b>排成一条射线</b>，有无数个，不知道是哪一个。',
    dist: '离轮船 30 千米（图上 3 厘米）的点<b>围成一个圆</b>，也有无数个。',
    both: '射线和圆<b>只交于一点</b>——这就是灯塔 1 的位置！',
  };
  const set = (w) => {
    show(ray, w === 'dir' || w === 'both');
    show(circ, w === 'dist' || w === 'both');
    show(hit, w === 'both');
    document.querySelectorAll('#whyBtns .btn').forEach((x) => x.classList.toggle('solid', x.dataset.w === w));
    if (w) $('whyMsg').innerHTML = MSG[w];
    b.update();
  };
  $('whyBtns').addEventListener('click', (e) => { const w = e.target.closest('[data-w]')?.dataset.w; if (w) set(w); });
  set('');
}

/* ---------- 第 7、8 页：定位置画板 ---------- */
function plotter(el, cfg) {
  const R = cfg.range;
  const b = mkBoard(el, { x: [-R, R], y: [-R, R], w: 560 });
  const O = [0, 0];
  const s = { th: 0, r: 1.5, i: 0 };
  cross(b, O, R - 0.35);
  dial(b, O, 1.25);
  scaleBar(b, [R - 3.6, -R + 0.35], 3, cfg.per, cfg.unit);
  b.seg(() => [O, at(O, s.th, R * 2)], { cls: 'ray' });
  b.seg(() => [O, at(O, s.th, s.r)], { cls: 'c2' });
  angleMark(b, O, () => s.th, 0.8);
  ruler(b, O, () => s.th, () => s.r, Math.floor(R - 0.5), (k) => `${k}cm`);
  cfg.tasks.forEach((t, i) => {
    const p = at(O, t.th, t.d / cfg.per);
    b.pt(p, { cls: 'site light', r: 7, show: () => s.i > i });
    b.text(() => (s.i > i ? p : null), t.name, { cls: 'site-lb', dx: 12, dy: -10 });
  });
  place(b, O, cfg.center, 'ship', at(O, 215, 1.75));
  const render = () => {
    const t = cfg.tasks[s.i];
    const cm = s.r;
    if (cfg.read) cfg.read.innerHTML = `方向：<b>${dirText(s.th)}</b>　图上 <b>${cm}</b> 厘米 → 实际 <b>${cm * cfg.per}</b> ${cfg.unit.trim()}`;
    const msg = cfg.msg;
    if (!t) { msg.className = 'tip feedback fb-ok'; msg.innerHTML = `<b>✓ 画好了！</b>${cfg.tasks.map((x) => x.name).join('、')}${cfg.tasks.length > 1 ? '都' : '已经'}在图上。`; return; }
    msg.className = 'tip feedback';
    msg.innerHTML = `现在画：<b>${t.name}</b>（${dirText(t.th)} 方向 ${t.d} ${cfg.unit.trim()}处）`;
  };
  const check = () => {
    const t = cfg.tasks[s.i];
    if (t && norm(s.th) === t.th && Math.abs(s.r - t.d / cfg.per) < 1e-9) s.i += 1;
  };
  b.drag(() => at(O, s.th, s.r), (x, y) => {
    s.th = norm(snap(bearingOf(O, [x, y]), 5));
    s.r = clamp(snap(Math.hypot(x, y), 0.5), 0.5, R - 0.6);
    check();
    render();
  }, { r: 11, hit: 26 });
  render();
  return b;
}
function initPlots() {
  plotter($('plot2'), { center: '黎明岛', per: 10, unit: ' 千米', range: 3.6, read: $('plot2Read'), msg: $('plot2Msg'), tasks: [{ name: '清凉岛', th: 40, d: 20 }] });
  plotter($('plot3'), { center: '黎明岛', per: 10, unit: ' 千米', range: 4.3, msg: $('plot3Msg'), tasks: [{ name: '清凉岛', th: 40, d: 20 }, { name: '红枫岛', th: 210, d: 30 }] });
  plotter($('plot5'), { center: '猴山', per: 50, unit: ' 米', range: 6.2, msg: $('plot5Msg'), tasks: [{ name: '熊猫馆', th: 80, d: 200 }, { name: '孔雀园', th: 145, d: 150 }, { name: '蛇馆', th: 285, d: 250 }] });
  $('plotTabs').addEventListener('click', (e) => {
    const t = e.target.closest('[data-t]')?.dataset.t;
    if (t === undefined) return;
    document.querySelectorAll('#plotTabs .btn').forEach((x) => x.classList.toggle('solid', x.dataset.t === t));
    ['pane0', 'plot3Msg'].forEach((id) => { $(id).hidden = t !== '0'; });
    ['pane1', 'plot5Msg'].forEach((id) => { $(id).hidden = t !== '1'; });
    boards.forEach((x) => x.update());
  });
}

/* ---------- 第 10 页：雷达屏幕（课本 p53，每圈 10 千米） ---------- */
const PLANES = [{ n: 'A', th: 30, r: 3 }, { n: 'B', th: 60, r: 5 }, { n: 'C', th: 120, r: 6 }, { n: 'D', th: 210, r: 3 }, { n: 'E', th: 300, r: 4 }];
function initRadar() {
  const b = mkBoard($('radar'), { x: [-7, 7], y: [-7, 7], w: 520 });
  const O = [0, 0];
  const s = { sel: null };
  for (let k = 1; k <= 6; k += 1) b.curve((t) => at(O, 360 * t, k), 0, 1, { cls: 'ring', n: 200 });
  for (let d = 30; d < 360; d += 30) if (d % 90) b.seg([O, at(O, d, 6.9)], { cls: 'rdash' });
  cross(b, O, 6.6);
  b.curve((t) => (s.sel ? at(O, 360 * t, s.sel.r) : [NaN, NaN]), 0, 1, { cls: 'ringhi', n: 200 });
  const mk = angleMark(b, O, () => (s.sel ? s.sel.th : 0), 1.3);
  b.seg(() => (s.sel ? [O, at(O, s.sel.th, s.sel.r)] : [O, O]), { cls: 'c2' });
  PLANES.forEach((p) => {
    const q = at(O, p.th, p.r);
    const dot = b.pt(q, { cls: 'plane', r: 8 });
    b.text(q, p.n, { cls: 'site-lb it', dx: 10, dy: -8 });
    dot.style.cursor = 'pointer';
    dot.addEventListener('click', () => { s.sel = p; render(); });
  });
  place(b, O, '机场', 'ship');
  const render = () => {
    show(mk, !!s.sel);
    const msg = $('radarMsg');
    if (!s.sel) { msg.innerHTML = '点一点雷达上的飞机。'; b.update(); return; }
    const d = dirParts(s.sel.th);
    msg.innerHTML = `飞机 <b>${s.sel.n}</b>：从正${d.a}向${d.b}量角；它在从里往外数第 <b>${s.sel.r}</b> 个圆上。`;
    b.update();
  };
  render();
}

window.LESSON = {
  init() {
    initMini();
    initRough();
    initMeasure();
    initWheel();
    initWhy();
    initPlots();
    initRadar();
  },
  onRender() {
    requestAnimationFrame(() => boards.forEach((b) => b.update()));
  },
};
