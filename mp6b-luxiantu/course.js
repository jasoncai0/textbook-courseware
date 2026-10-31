'use strict';
/* 六下 描述简单的路线图 · 本课互动：例 3 街道图上点地点规划路线（自动按方向写出路线、合并同方向的路段、写出左拐/右拐、倒过来走回家）、
 * 练习九第 9 题公交路线（各段按千米数等比例画，汽车沿路线行驶）、第 2 题量方向和图上距离、第 8 题学校平面图。
 * 地图坐标：SVG 的 y 轴向下，计算方向时把 y 取反（北为正）。 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const RAD = Math.PI / 180;
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const txt = (svg, x, y, s, cls) => { const t = svgEl('text', { x, y, class: cls }, svg); t.textContent = s; return t; };
const norm = (d) => ((d % 360) + 360) % 360;
/** 从 a 到 b 的方向角（从正北顺时针，度） */
const bearing = (a, b) => norm(Math.atan2(b[0] - a[0], a[1] - b[1]) / RAD);
/** 课本说法：东、西、南、北，或北偏东、南偏西……（轴上 ±1° 内算正方向） */
function dirWord(th) {
  const t = norm(th);
  const near = (v) => Math.abs(norm(t - v + 180) - 180) < 1;
  if (near(0)) return '北';
  if (near(90)) return '东';
  if (near(180)) return '南';
  if (near(270)) return '西';
  return `${t < 90 || t > 270 ? '北' : '南'}偏${t < 180 ? '东' : '西'}`;
}
const DIAG = { 北偏东: '东北', 南偏东: '东南', 南偏西: '西南', 北偏西: '西北' };

/* 沿折线移动一个点：pts 为像素坐标，speed 像素/秒，onSeg(i) 在第 i 段开始时调用 */
function animate(dot, pts, speed, onSeg, done) {
  let i = 0;
  let t0 = null;
  const lens = pts.slice(1).map((p, k) => Math.hypot(p[0] - pts[k][0], p[1] - pts[k][1]));
  if (onSeg && lens.length) onSeg(0);
  const tick = (now) => {
    if (t0 === null) t0 = now;
    const d = ((now - t0) / 1000) * speed;
    if (d >= lens[i]) {
      t0 = now; i += 1;
      if (i >= lens.length) { dot.setAttribute('transform', `translate(${pts[i][0]} ${pts[i][1]})`); if (done) done(); return; }
      if (onSeg) onSeg(i);
    }
    const k = Math.min(1, (((now - t0) / 1000) * speed) / lens[i]);
    const [a, b] = [pts[i], pts[i + 1]];
    dot.setAttribute('transform', `translate(${a[0] + (b[0] - a[0]) * k} ${a[1] + (b[1] - a[1]) * k})`);
    dot.__raf = requestAnimationFrame(tick);
  };
  cancelAnimationFrame(dot.__raf);
  dot.__raf = requestAnimationFrame(tick);
}
const walker = (svg, cls = 'walker') => {
  const g = svgEl('g', { class: cls }, svg);
  svgEl('circle', { r: 11 }, g);
  return g;
};

/* ---------- 例 3 街道图（按课本 p52 布局） ---------- */
const NODES = {
  J: { name: '李伟家', p: [60, 300] },
  S: { name: '超市', p: [250, 300] },
  M: { name: '街心花园', p: [250, 190] },
  E: { name: '展览馆', p: [250, 152] },
  B: { name: '书店', p: [250, 100] },
  X: { name: '大港小学', p: [450, 100] },
  K: { name: '敬老院', p: [450, 145] },
  Y: { name: '医院', p: [450, 190] },
};
const EDGES = ['JS', 'SM', 'ME', 'EB', 'BX', 'XK', 'KY', 'YM', 'SY'];
const adj = (a, b) => EDGES.includes(a + b) || EDGES.includes(b + a);
// 地点牌：[文字, x, y, 底色]
const SIGNS = [
  ['李伟家', 95, 335, '#d7ecd9'], ['超市', 215, 335, '#bfe3cf'], ['展览馆', 192, 152, '#f6d3e4'], ['书店', 290, 128, '#d7ecd9'],
  ['大港小学', 450, 58, '#d7ecd9'], ['敬老院', 398, 140, '#f6d3e4'], ['医院', 497, 222, '#ddd3f0'],
];
function drawStreet(svg) {
  svgEl('rect', { x: 0, y: 0, width: 640, height: 400, fill: '#fbfaf5' }, svg);
  svgEl('polygon', { points: '250,300 250,190 450,190', fill: '#cfe8c4' }, svg);
  txt(svg, 300, 222, '街心花园', 'park');
  const roads = [[[250, 18], [250, 392]], [[450, 18], [450, 392]], [[250, 100], [625, 100]], [[250, 190], [625, 190]], [[30, 300], [250, 300]], [[250, 300], [450, 190]]];
  roads.forEach(([a, b]) => svgEl('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: 'road' }, svg));
  roads.forEach(([a, b]) => svgEl('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: 'road-c' }, svg));
  SIGNS.forEach(([s, x, y, c]) => {
    const w = s.length * 19 + 14;
    svgEl('rect', { x: x - w / 2, y: y - 15, width: w, height: 28, rx: 4, fill: c, stroke: '#8fa3b3' }, svg);
    txt(svg, x, y + 5, s, 'sign');
  });
  svgEl('path', { d: 'M600 58V20M600 14l-6 12h12z', class: 'narrow' }, svg);
  txt(svg, 600, 74, '北', 'nlab');
}
function nodeDots(svg, onClick) {
  return Object.entries(NODES).map(([k, n]) => {
    const g = svgEl('g', { class: 'node', 'data-k': k, tabindex: 0, role: 'button', 'aria-label': n.name }, svg);
    svgEl('circle', { cx: n.p[0], cy: n.p[1], r: 16, class: 'hit' }, g);
    svgEl('circle', { cx: n.p[0], cy: n.p[1], r: 7, class: 'dot' }, g);
    if (onClick) g.addEventListener('click', () => onClick(k));
    return g;
  });
}

/** 把路径（节点字母串）写成一句句路线：同方向连续路段合并，拐弯写出左拐/右拐 */
function describe(path) {
  const segs = [];
  for (let i = 1; i < path.length; i += 1) {
    const [a, b] = [NODES[path[i - 1]].p, NODES[path[i]].p];
    const w = dirWord(bearing(a, b));
    const last = segs[segs.length - 1];
    if (last && last.w === w) { last.via.push(last.to); last.to = path[i]; } else segs.push({ w, from: path[i - 1], to: path[i], via: [], v: [b[0] - a[0], a[1] - b[1]] });
  }
  return segs.map((s, i) => {
    const dir = DIAG[s.w] ? `${DIAG[s.w]}方向（${s.w}方向）` : s.w;
    const via = s.via.length ? `，经过${s.via.map((k) => NODES[k].name).join('、')}，` : '';
    let turn = '';
    if (i) {
      const [u, v] = [segs[i - 1].v, s.v];
      const cr = u[0] * v[1] - u[1] * v[0];
      turn = Math.abs(cr) < 1e-6 ? '掉头，' : cr > 0 ? '<i>左拐</i>，' : '<i>右拐</i>，';
    }
    return `${i ? '再' : `从${NODES[s.from].name}出发，`}${turn}向<b>${dir}</b>走${via}到<b>${NODES[s.to].name}</b>`;
  });
}
const pathLen = (path) => [...path].slice(1).reduce((t, k, i) => t + Math.hypot(NODES[k].p[0] - NODES[path[i]].p[0], NODES[k].p[1] - NODES[path[i]].p[1]), 0);
const PX_PER_CM = 50;

function initMap3() { drawStreet($('map3')); nodeDots($('map3')); }

function initWalk() {
  const svg = $('walkMap');
  drawStreet(svg);
  const trail = svgEl('polyline', { class: 'trail', points: '' }, svg);
  const st = { path: 'J', back: false, found: [] };
  const dots = nodeDots(svg, (k) => step(k));
  const me = walker(svg);
  me.setAttribute('transform', `translate(${NODES.J.p.join(' ')})`);
  const render = () => {
    trail.setAttribute('points', [...st.path].map((k) => NODES[k].p.join(',')).join(' '));
    trail.classList.toggle('back', st.back);
    const last = st.path[st.path.length - 1];
    dots.forEach((g) => {
      const k = g.dataset.k;
      g.classList.toggle('next', !st.back && adj(last, k));
      g.classList.toggle('on', st.path.includes(k));
    });
    const lines = describe(st.path);
    $('walkRoute').innerHTML = lines.map((s) => `<li>${s}。</li>`).join('') || '<li class="muted">还没有出发。</li>';
    $('walkRoute').classList.toggle('back', st.back);
    $('walkFound').innerHTML = st.found.length
      ? st.found.map((p, i) => `<p>路线 ${i + 1}：${[...p].map((k) => NODES[k].name).join(' → ')}（图上约 ${(pathLen(p) / PX_PER_CM).toFixed(1)} 厘米）</p>`).join('')
      : '还没有走到学校。';
    $('walkFound').classList.toggle('muted', !st.found.length);
  };
  const hint = (h) => { $('walkHint').innerHTML = h; };
  function step(k) {
    if (st.back) return;
    const last = st.path[st.path.length - 1];
    if (last === 'X') { hint('已经到学校了！点“重新出发”试试另一条路，或者点“倒过来走”。'); return; }
    if (!adj(last, k)) { hint(`从<b>${NODES[last].name}</b>不能直接走到<b>${NODES[k].name}</b>，请点一个和它<b>相邻</b>的地方（闪动的点）。`); return; }
    if (st.path.includes(k)) { hint('这个地方已经走过了，不要绕回头路哦。'); return; }
    st.path += k;
    animate(me, [NODES[last].p, NODES[k].p], 260);
    if (k === 'X') {
      if (!st.found.includes(st.path)) st.found.push(st.path);
      hint(`<b>✓ 到学校了！</b>${st.found.length < 3 ? '再找一条不同的路线吧。' : '你已经找到 3 条路线了，比一比哪条近？'}`);
    } else hint('继续点下一个相邻的地方。');
    render();
  }
  $('walkUndo').addEventListener('click', () => {
    if (st.back || st.path.length < 2) return;
    st.path = st.path.slice(0, -1);
    me.setAttribute('transform', `translate(${NODES[st.path[st.path.length - 1]].p.join(' ')})`);
    render();
  });
  $('walkReset').addEventListener('click', () => {
    cancelAnimationFrame(me.__raf);
    Object.assign(st, { path: 'J', back: false });
    me.setAttribute('transform', `translate(${NODES.J.p.join(' ')})`);
    hint('从<b>李伟家</b>出发，依次点相邻的地方。');
    render();
  });
  $('walkBack').addEventListener('click', () => {
    const go = st.path.endsWith('X') ? st.path : st.found[st.found.length - 1];
    if (!go) { hint('先走到学校，才能倒过来走回家。'); return; }
    st.path = [...go].reverse().join('');
    st.back = true;
    hint('<b>放学回家：</b>顺序倒过来，每一段的方向都反过来。点“重新出发”再来一次。');
    render();
    animate(me, [...st.path].map((k) => NODES[k].p), 260);
  });
  render();
}

/* ---------- 练一练：上学、放学演示 ---------- */
const HOME_PATH = 'JSMEBX';
function initHome() {
  const svg = $('homeMap');
  drawStreet(svg);
  const pts = [...HOME_PATH].map((k) => NODES[k].p);
  svgEl('polyline', { class: 'trail', points: pts.map((p) => p.join(',')).join(' ') }, svg);
  nodeDots(svg);
  const me = walker(svg);
  const tag = txt(svg, 0, 0, '', 'walk-tag');
  me.setAttribute('transform', `translate(${pts[0].join(' ')})`);
  const label = (list) => (i) => {
    const [a, b] = [list[i], list[i + 1]];
    const w = dirWord(bearing(a, b));
    tag.textContent = `向${DIAG[w] || w}`;
    tag.setAttribute('x', (a[0] + b[0]) / 2 + 14); tag.setAttribute('y', (a[1] + b[1]) / 2 - 14);
  };
  $('homeGo').addEventListener('click', () => {
    const back = [...pts].reverse();
    animate(me, pts, 300, label(pts), () => setTimeout(() => animate(me, back, 300, label(back), () => { tag.textContent = '到家了'; }), 500));
  });
}

/* ---------- 练习九第 9 题：公交路线（1 千米画 150 个单位） ---------- */
const KM = 150;
const BUS_O = [45, 232];
// 各段：[终点名, 千米, 方向角]；斜段方向从课本图上量得（课本只要求说出方向，不要求度数）
// 第 4 项：路段长度标在线的下方
const BUS_LEGS = [['新华书店', 1, 90], ['公园', 1.5, 49], ['中心广场', 0.8, 90, true], ['医院', 1.2, 125, true], ['体育馆', 1.3, 31]];
function busStops() {
  const stops = [{ name: '火车站', p: BUS_O }];
  BUS_LEGS.forEach(([name, km, th, below]) => {
    const q = stops[stops.length - 1].p;
    stops.push({ name, km, th, below, p: [q[0] + km * KM * Math.sin(th * RAD), q[1] - km * KM * Math.cos(th * RAD)] });
  });
  return stops;
}
const LABEL_OFF = { 火车站: [0, 30], 新华书店: [0, 30], 公园: [0, -16], 中心广场: [10, -16], 医院: [0, 30], 体育馆: [-34, -6] };
function drawBus(svg) {
  const stops = busStops();
  svgEl('polyline', { class: 'busline', points: stops.map((s) => s.p.join(',')).join(' ') }, svg);
  stops.forEach((s, i) => {
    svgEl('circle', { cx: s.p[0], cy: s.p[1], r: 7, class: 'stop' }, svg);
    const [dx, dy] = LABEL_OFF[s.name];
    txt(svg, s.p[0] + dx, s.p[1] + dy, s.name, 'stop-lb bus-lb');
    if (!i) return;
    const a = stops[i - 1].p;
    const ang = Math.atan2(s.p[1] - a[1], s.p[0] - a[0]) / RAD;
    const m = [(a[0] + s.p[0]) / 2, (a[1] + s.p[1]) / 2];
    const t = txt(svg, 0, 0, `${s.km} 千米`, 'km-lb');
    t.setAttribute('transform', `translate(${m[0]} ${m[1]}) rotate(${ang}) translate(0 ${s.below ? 26 : -12})`);
  });
  svgEl('path', { d: 'M790 70V26M790 18l-7 14h14z', class: 'narrow' }, svg);
  txt(svg, 790, 90, '北', 'nlab');
  return stops;
}
function busRun(svgId, btnId, nowId, reverse) {
  const svg = $(svgId);
  const stops = drawBus(svg);
  const seq = reverse ? [...stops].reverse() : stops;
  const bus = walker(svg, 'bus');
  bus.setAttribute('transform', `translate(${seq[0].p.join(' ')})`);
  $(btnId).addEventListener('click', () => {
    animate(bus, seq.map((s) => s.p), 140, (i) => {
      const [a, b] = [seq[i], seq[i + 1]];
      const w = dirWord(bearing(a.p, b.p));
      const km = reverse ? a.km : b.km;
      $(nowId).innerHTML = `${a.name} → ${b.name}：向<b>${w}</b>${w.length > 1 ? '方向' : ''}行 ${km} 千米`;
    }, () => { $(nowId).innerHTML += '　<b>到站！</b>'; });
  });
}

/* 两个空组成“南偏东”这类方向时，两空不能填同一个字（南偏南、东偏东都不对） */
function initPairs() {
  const pas = [...document.querySelectorAll('.blank.pa')];
  const pbs = [...document.querySelectorAll('.blank.pb')];
  pas.forEach((a, i) => {
    const b = pbs[i];
    const val = (el) => el.querySelector('input').value.trim();
    const fix = () => setTimeout(() => {
      if (val(a) && val(a) === val(b)) { b.classList.remove('ok'); b.classList.add('no'); }
    }, 0);
    [a, b].forEach((el) => el.querySelector('input').addEventListener('change', fix));
  });
}

/* ---------- 练习九第 2 题：南山风景区（图上 1 cm 画 50 个单位，课本量得的数据） ---------- */
const NS_O = [250, 170];
const NS_CM = 50;
const SPOTS = [{ name: '荷花池', th: 65, cm: 4 }, { name: '玉龙潭', th: 120, cm: 2 }, { name: '飞霞阁', th: 240, cm: 3 }];
const atPx = (o, th, r) => [o[0] + r * Math.sin(th * RAD), o[1] - r * Math.cos(th * RAD)];
function initNanshan() {
  const svg = $('nanshan');
  const O = NS_O;
  svgEl('line', { x1: O[0], y1: 12, x2: O[0], y2: 360, class: 'axl' }, svg);
  svgEl('line', { x1: 30, y1: O[1], x2: 520, y2: O[1], class: 'axl' }, svg);
  svgEl('path', { d: 'M590 70V30M590 22l-7 14h14z', class: 'narrow' }, svg);
  txt(svg, 590, 90, '北', 'nlab');
  const meas = svgEl('g', {}, svg);
  SPOTS.forEach((s) => {
    const q = atPx(O, s.th, s.cm * NS_CM);
    svgEl('line', { x1: O[0], y1: O[1], x2: q[0], y2: q[1], class: 'spoke' }, svg);
    for (let k = 1; k < s.cm; k += 1) {
      const m = atPx(O, s.th, k * NS_CM);
      const [u, v] = [atPx(m, s.th + 90, 5), atPx(m, s.th - 90, 5)];
      svgEl('line', { x1: u[0], y1: u[1], x2: v[0], y2: v[1], class: 'spoke' }, svg);
    }
    const g = svgEl('g', { class: 'spot', tabindex: 0, role: 'button', 'aria-label': s.name }, svg);
    svgEl('circle', { cx: q[0], cy: q[1], r: 16, class: 'hit' }, g);
    svgEl('circle', { cx: q[0], cy: q[1], r: 7, class: 'site' }, g);
    txt(g, q[0] + (s.th > 180 ? -10 : 10), q[1] + 26, s.name, 'stop-lb');
    g.addEventListener('click', () => measure(s));
  });
  svgEl('circle', { cx: O[0], cy: O[1], r: 7, class: 'site' }, svg);
  txt(svg, O[0] - 40, O[1] - 12, '林峰塔', 'stop-lb');
  // 比例尺 0—600—1200—1800 米，每段 1 cm
  const [sx, sy] = [440, 330];
  svgEl('line', { x1: sx, y1: sy, x2: sx + 3 * NS_CM, y2: sy, class: 'sbar' }, svg);
  for (let k = 0; k <= 3; k += 1) {
    svgEl('line', { x1: sx + k * NS_CM, y1: sy, x2: sx + k * NS_CM, y2: sy - 6, class: 'sbar' }, svg);
    txt(svg, sx + k * NS_CM, sy - 12, String(k * 600), 'sb');
  }
  txt(svg, sx + 3 * NS_CM + 26, sy - 12, '米', 'sb');
  function measure(s) {
    meas.innerHTML = '';
    const s0 = s.th < 90 ? 0 : 180;
    const r = 46;
    const [a, b] = [atPx(O, s0, r), atPx(O, s.th, r)];
    const sweep = s.th - s0 > 0 ? 1 : 0;
    svgEl('line', { x1: O[0], y1: O[1], x2: atPx(O, s0, 80)[0], y2: atPx(O, s0, 80)[1], class: 'axhi' }, meas);
    svgEl('path', { d: `M${a[0]} ${a[1]}A${r} ${r} 0 0 ${sweep} ${b[0]} ${b[1]}`, class: 'arc' }, meas);
    const lab = atPx(O, (s0 + s.th) / 2, r + 20);
    const deg = s.th < 90 ? s.th : s.th < 180 ? 180 - s.th : s.th - 180;
    txt(meas, lab[0], lab[1] + 6, `${deg}°`, 'ang');
    for (let k = 1; k <= s.cm; k += 1) {
      const m = atPx(atPx(O, s.th, k * NS_CM), s.th - 90, 16);
      txt(meas, m[0], m[1] + 5, `${k}cm`, 'rlab');
    }
    const w = dirWord(s.th);
    $('nsMsg').innerHTML = `<b>${s.name}</b>：从正${w[0]}向${w[2]}量角；沿连线数一数有几厘米（每个小刻度 1 厘米）。`;
  }
}

/* ---------- 练习九第 8 题：李家桥小学平面图（按课本 p55 布局等比例重画） ---------- */
const SC = 1.435;
const T = (x, y) => [(x - 117) * SC, (y - 186) * SC];
const BLOCKS = [
  ['图书馆', 117, 186, 258, 219, '#5b9bd5'], ['卫生室', 281, 186, 326, 212, '#d6ecf7'], ['食堂', 333, 186, 427, 220, '#e9a23b'],
  ['操场', 445, 186, 563, 377, '#7fc77a'], ['综合楼', 296, 250, 336, 322, '#9fd67b'], ['体育馆', 380, 248, 428, 340, '#f07fb4'],
  ['传达室', 388, 363, 441, 390, '#f7d55c'], ['卫生间', 472, 365, 563, 390, '#a68ad8'],
];
function initSchool() {
  const svg = $('school');
  svgEl('rect', { x: 0, y: 0, width: 640, height: 300, fill: '#fff', stroke: '#9fb0bf' }, svg);
  const pink = '#f6a6cb';
  [[117, 248, 255, 265], [117, 248, 160, 390], [117, 355, 255, 390]].forEach(([x1, y1, x2, y2]) => {
    const [a, b] = [T(x1, y1), T(x2, y2)];
    svgEl('rect', { x: a[0], y: a[1], width: b[0] - a[0], height: b[1] - a[1], fill: pink }, svg);
  });
  txt(svg, ...T(138, 318), '教学楼', 'blk v');
  const [ex, ey] = T(205, 325);
  svgEl('ellipse', { cx: ex, cy: ey, rx: 32, ry: 14, fill: '#4caf6a' }, svg);
  txt(svg, ex, ey + 6, '花坛', 'blk w');
  BLOCKS.forEach(([s, x1, y1, x2, y2, c]) => {
    const [a, b] = [T(x1, y1), T(x2, y2)];
    svgEl('rect', { x: a[0], y: a[1], width: b[0] - a[0], height: b[1] - a[1], rx: s === '操场' ? 30 : 2, fill: c }, svg);
    const tall = b[1] - a[1] > b[0] - a[0] && s !== '操场';
    txt(svg, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 6, s, tall ? 'blk v' : 'blk');
  });
  txt(svg, ...T(356, 383), '大门', 'blk');
  svgEl('path', { d: 'M662 50V14M662 8l-6 12h12z', class: 'narrow' }, svg);
  txt(svg, 662, 68, '北', 'nlab');
}

function initMini() {
  const svg = $('mapDir');
  svgEl('rect', { x: 40, y: 18, width: 120, height: 94, fill: '#fbfaf5', stroke: '#9fb0bf' }, svg);
  [['北', 100, 14], ['南', 100, 128], ['西', 26, 70], ['东', 174, 70]].forEach(([s, x, y]) => txt(svg, x, y, s, 'nlab'));
  svgEl('line', { x1: 100, y1: 26, x2: 100, y2: 104, class: 'road-mini' }, svg);
  svgEl('line', { x1: 48, y1: 65, x2: 152, y2: 65, class: 'road-mini' }, svg);
}

window.LESSON = {
  init() {
    initMini();
    initMap3();
    initWalk();
    initHome();
    busRun('bus', 'busGo', 'busNow', false);
    busRun('busBack', 'backGo', 'backNow', true);
    initPairs();
    initNanshan();
    initSchool();
  },
};
