'use strict';
/* 五下 圆的认识 · 本课互动：找圆、圆规画圆、无数条半径直径、d=2r、对折找对称轴、车轮滚动。通用部分见 ../shared/math.js、mcheck.js */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const txt = (parent, x, y, t, cls = 'lb') => { const e = svgEl('text', { x, y, class: cls }, parent); e.textContent = t; return e; };
const f2 = (v) => v.toFixed(2);
// 把 SVG 里的指针位置换成 viewBox 坐标
const svgPt = (svg, e) => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); };

/* ---------- 第 2 页：尺子刻度 ---------- */
function initRecall() {
  const d = Array.from({ length: 21 }, (_, k) => `M${20 + k * 10} 55v${k % 5 ? 7 : 13}`).join('');
  $('rcTicks').setAttribute('d', d);
}

/* ---------- 第 3 页：找圆 ---------- */
function initFind() {
  const s = $('findC');
  const hex = Array.from({ length: 6 }, (_, k) => { const t = (Math.PI / 3) * k; return `${f2(400 + 50 * Math.cos(t))} ${f2(160 + 50 * Math.sin(t))}`; }).join('L');
  const shapes = [
    ['circle', { cx: 70, cy: 65, r: 50 }, true],
    ['ellipse', { cx: 210, cy: 65, rx: 65, ry: 38 }, false],
    ['rect', { x: 310, y: 20, width: 90, height: 90, rx: 28 }, false],
    ['path', { d: `M${hex}Z` }, false],
    ['circle', { cx: 230, cy: 165, r: 38 }, true],
    ['path', { d: 'M40 205A60 60 0 0 1 160 205Z' }, false],
  ];
  let found = 0;
  shapes.forEach(([tag, attrs, isCircle]) => {
    const el = svgEl(tag, { ...attrs, class: 'shp' }, s);
    el.addEventListener('click', () => {
      if (isCircle && !el.classList.contains('yes')) { el.classList.add('yes'); found += 1; }
      if (!isCircle) { el.classList.remove('nope'); void el.getBBox(); el.classList.add('nope'); }
      $('findSay').textContent = isCircle ? `找到 ${found} 个圆${found === 2 ? '，全找到了！' : ''}` : '这个不是圆哦';
    });
  });
}

/* ---------- 第 4 页：圆规画圆 ---------- */
const CP = { ox: 230, oy: 200, leg: 175, px: 40 }; // px：每厘米多少个单位
function initCompass() {
  const s = $('compass');
  const st = { r: 110, th: -Math.PI / 2, sweep: 0, mixed: false, r0: null, pts: [], drag: false, last: null, anim: 0 };
  const trace = svgEl('path', { class: 'trace' }, s);
  const legs = svgEl('path', { class: 'legs' }, s);
  const needle = svgEl('circle', { cx: CP.ox, cy: CP.oy, r: 6, class: 'needle' }, s);
  const pen = svgEl('circle', { r: 13, class: 'pen' }, s);
  const hinge = svgEl('circle', { r: 9, class: 'hinge' }, s);
  const say = (t) => { $('cpSay').innerHTML = t; };
  const draw = () => {
    const { ox, oy, leg } = CP;
    const P = [ox + st.r * Math.cos(st.th), oy + st.r * Math.sin(st.th)];
    // 两脚等长：铰链在 OP 中垂线上，离中点 √(leg² − (r/2)²)，始终在笔尖前进方向的左侧
    const h = Math.sqrt(leg * leg - (st.r / 2) ** 2);
    const mx = (ox + P[0]) / 2;
    const my = (oy + P[1]) / 2;
    const H = [mx + h * Math.sin(st.th), my - h * Math.cos(st.th)];
    legs.setAttribute('d', `M${f2(ox)} ${f2(oy)}L${f2(H[0])} ${f2(H[1])}L${f2(P[0])} ${f2(P[1])}`);
    pen.setAttribute('cx', f2(P[0])); pen.setAttribute('cy', f2(P[1]));
    hinge.setAttribute('cx', f2(H[0])); hinge.setAttribute('cy', f2(H[1]));
    trace.setAttribute('d', st.pts.length ? `M${st.pts.map((p) => p.map(f2).join(' ')).join('L')}` : '');
    $('cpRv').textContent = `${(st.r / CP.px).toFixed(2).replace(/0$/, '')} 厘米`;
  };
  const addPt = () => {
    if (st.r0 === null) st.r0 = st.r;
    if (st.r !== st.r0) st.mixed = true;
    st.pts.push([CP.ox + st.r * Math.cos(st.th), CP.oy + st.r * Math.sin(st.th)]);
    if (Math.abs(st.sweep) >= 2 * Math.PI - 0.02) {
      say(st.mixed ? '转了一圈，可是首尾<b>接不上</b>——两脚距离变了，画出来的<b>不是圆</b>！' : '画好了一个圆！笔尖到针尖的距离始终一样。');
    } else say(`已经转了 ${Math.round((Math.abs(st.sweep) * 180) / Math.PI)}°`);
  };
  const turnTo = (th) => {
    let d = th - st.th;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    if (Math.abs(st.sweep + d) > 2 * Math.PI) d = Math.sign(d) * (2 * Math.PI - Math.abs(st.sweep));
    st.th += d;
    st.sweep += d;
    addPt();
    draw();
  };
  const clear = () => {
    cancelAnimationFrame(st.anim);
    Object.assign(st, { sweep: 0, mixed: false, r0: null, pts: [], th: -Math.PI / 2 });
    say('拖动橙色的笔尖，绕着针尖转一圈。');
    draw();
  };
  pen.addEventListener('pointerdown', (e) => { st.drag = true; pen.setPointerCapture(e.pointerId); if (!st.pts.length) addPt(); });
  pen.addEventListener('pointermove', (e) => {
    if (!st.drag) return;
    const p = svgPt(s, e);
    turnTo(Math.atan2(p.y - CP.oy, p.x - CP.ox));
  });
  pen.addEventListener('pointerup', () => { st.drag = false; });
  $('cpR').addEventListener('input', (e) => { st.r = +e.target.value; draw(); });
  $('cpClear').addEventListener('click', clear);
  $('cpAuto').addEventListener('click', () => {
    clear();
    addPt();
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 2500);
      turnTo(-Math.PI / 2 + k * 2 * Math.PI - 1e-9);
      if (k < 1) st.anim = requestAnimationFrame(step);
    };
    st.anim = requestAnimationFrame(step);
  });
  draw();
}

/* ---------- 第 5 页：圆心、半径、直径（字母位置照课本） ---------- */
function initParts() {
  const s = $('parts');
  const [ox, oy, R] = [200, 160, 125];
  const at = (deg, r = R) => [ox + r * Math.cos((deg * Math.PI) / 180), oy + r * Math.sin((deg * Math.PI) / 180)];
  svgEl('circle', { cx: ox, cy: oy, r: R, class: 'cir' }, s);
  const A = at(-8);
  const B = at(-68);
  const C = at(112);
  const g1 = svgEl('g', { 'data-step': 1, class: 'hl-g' }, s);
  svgEl('circle', { cx: ox, cy: oy, r: 7, class: 'dot red' }, g1);
  const g2 = svgEl('g', { 'data-step': 2, class: 'hl-g' }, s);
  svgEl('line', { x1: ox, y1: oy, x2: A[0], y2: A[1], class: 'rad' }, g2);
  txt(g2, (ox + A[0]) / 2, (oy + A[1]) / 2 + 26, 'r', 'lb it o-f');
  const g3 = svgEl('g', { 'data-step': 3, class: 'hl-g' }, s);
  svgEl('line', { x1: B[0], y1: B[1], x2: C[0], y2: C[1], class: 'dia' }, g3);
  txt(g3, ox + 14, oy - 40, 'd', 'lb it b-f');
  svgEl('circle', { cx: ox, cy: oy, r: 5, class: 'dot' }, s);
  txt(s, ox - 32, oy + 8, 'O', 'lb it');
  txt(s, A[0] + 10, A[1] + 6, 'A', 'lb it');
  txt(s, B[0] + 6, B[1] - 8, 'B', 'lb it');
  txt(s, C[0] - 26, C[1] + 22, 'C', 'lb it');
}

/* ---------- 第 6 页：画无数条半径、直径 ---------- */
const MANY = { ox: 200, oy: 180, R: 150, cm: 50 };
function initMany() {
  const s = $('many');
  const { ox, oy, R, cm } = MANY;
  svgEl('circle', { cx: ox, cy: oy, r: R, class: 'cir' }, s);
  const layer = svgEl('g', {}, s);
  svgEl('circle', { cx: ox, cy: oy, r: 5, class: 'dot' }, s);
  txt(s, ox - 30, oy + 26, 'O', 'lb it');
  const st = { nR: 0, nD: 0 };
  const show = (k, len) => {
    $(`n${k}`).textContent = st[`n${k}`];
    $(`l${k}`).textContent = `${len.toFixed(1)} 厘米`;
  };
  const addR = () => {
    const t = Math.random() * 2 * Math.PI;
    const [x, y] = [ox + R * Math.cos(t), oy + R * Math.sin(t)];
    svgEl('line', { x1: ox, y1: oy, x2: f2(x), y2: f2(y), class: 'rad thin' }, layer);
    st.nR += 1;
    show('R', Math.hypot(x - ox, y - oy) / cm);
  };
  const addD = () => {
    const t = Math.random() * Math.PI;
    const [dx, dy] = [R * Math.cos(t), R * Math.sin(t)];
    svgEl('line', { x1: f2(ox - dx), y1: f2(oy - dy), x2: f2(ox + dx), y2: f2(oy + dy), class: 'dia thin' }, layer);
    st.nD += 1;
    show('D', Math.hypot(2 * dx, 2 * dy) / cm);
  };
  $('addR').addEventListener('click', addR);
  $('addD').addEventListener('click', addD);
  $('add10').addEventListener('click', () => { for (let k = 0; k < 10; k += 1) addR(); });
  $('manyClear').addEventListener('click', () => {
    layer.innerHTML = '';
    Object.assign(st, { nR: 0, nD: 0 });
    ['nR', 'nD'].forEach((id) => { $(id).textContent = '0'; });
    ['lR', 'lD'].forEach((id) => { $(id).textContent = '—'; });
  });
}

/* ---------- 第 7 页：一条直径 = 两条半径 ---------- */
function initDr() {
  const s = $('dr');
  const [ox, oy, R] = [220, 105, 95];
  svgEl('circle', { cx: ox, cy: oy, r: R, class: 'cir' }, s);
  svgEl('line', { x1: ox - R, y1: oy, x2: ox, y2: oy, class: 'rad' }, s);
  svgEl('line', { x1: ox, y1: oy, x2: ox + R, y2: oy, class: 'rad2' }, s);
  svgEl('circle', { cx: ox, cy: oy, r: 5, class: 'dot' }, s);
  txt(s, ox - R / 2, oy - 12, 'r', 'lb it o-f');
  txt(s, ox + R / 2, oy - 12, 'r', 'lb it b-f');
  txt(s, ox - 8, oy + 30, 'O', 'lb it');
  svgEl('path', { d: `M${ox - R} ${oy + R + 20}v14H${ox + R}v-14`, class: 'brace' }, s);
  txt(s, ox, oy + R + 58, 'd', 'lb it red-f');
}

/* ---------- 第 8 页：沿折痕对折 ---------- */
const SYM = { ox: 200, oy: 165, R: 130 };
function initSym() {
  const s = $('sym');
  const { ox, oy, R } = SYM;
  const st = { a: 30, off: 0, k: 1, anim: 0 };
  svgEl('circle', { cx: ox, cy: oy, r: R, class: 'cir base' }, s);
  const defs = svgEl('defs', {}, s);
  const clip = svgEl('clipPath', { id: 'halfClip' }, defs);
  const clipRect = svgEl('rect', { x: -600, y: 0, width: 1200, height: 600 }, clip);
  const flap = svgEl('g', {}, s);
  const inner = svgEl('g', { 'clip-path': 'url(#halfClip)' }, flap);
  svgEl('circle', { cx: ox, cy: oy, r: R, class: 'flap' }, inner);
  const line = svgEl('line', { class: 'fold' }, s);
  svgEl('circle', { cx: ox, cy: oy, r: 5, class: 'dot' }, s);
  const draw = () => {
    const t = (st.a * Math.PI) / 180;
    const [px, py] = [ox - st.off * Math.sin(t), oy + st.off * Math.cos(t)];
    const frame = `translate(${f2(px)} ${f2(py)}) rotate(${st.a})`;
    clipRect.setAttribute('transform', frame);
    // 折过去：在折痕坐标系里把垂直方向压缩 k（1 → −1），k = −1 时正好是关于折痕的轴对称
    flap.setAttribute('transform', `${frame} scale(1 ${st.k.toFixed(3)}) rotate(${-st.a}) translate(${f2(-px)} ${f2(-py)})`);
    line.setAttribute('x1', f2(px - 220 * Math.cos(t))); line.setAttribute('y1', f2(py - 220 * Math.sin(t)));
    line.setAttribute('x2', f2(px + 220 * Math.cos(t))); line.setAttribute('y2', f2(py + 220 * Math.sin(t)));
    $('symAv').textContent = `${st.a}°`;
  };
  const fold = () => {
    cancelAnimationFrame(st.anim);
    const from = st.k;
    const to = from > 0 ? -1 : 1;
    const t0 = performance.now();
    const step = (t) => {
      const u = Math.min(1, (t - t0) / 900);
      st.k = from + (to - from) * u;
      draw();
      if (u < 1) st.anim = requestAnimationFrame(step);
    };
    st.anim = requestAnimationFrame(step);
  };
  $('symA').addEventListener('input', (e) => { st.a = +e.target.value; draw(); });
  $('symFold').addEventListener('click', fold);
  $('symOff').addEventListener('click', (e) => {
    st.off = st.off ? 0 : -45;
    st.k = 1;
    e.target.textContent = st.off ? '折痕过圆心' : '折痕不过圆心';
    draw();
  });
  draw();
}

/* ---------- 第 9 页：练习十三第 13 题（1 厘米 = 10 个单位，按课本数据画） ---------- */
function initEx13() {
  const s = $('ex13');
  svgEl('rect', { x: 15, y: 30, width: 60, height: 60, class: 'sq' }, s);
  svgEl('circle', { cx: 45, cy: 60, r: 30, class: 'cfill' }, s);
  txt(s, 45, 112, '边长 6 cm', 'sm');
  svgEl('rect', { x: 110, y: 50, width: 80, height: 40, class: 'sq' }, s);
  svgEl('path', { d: 'M110 90A40 40 0 0 1 190 90Z', class: 'cfill' }, s);
  txt(s, 150, 112, '高 4 cm', 'sm');
  svgEl('path', { d: 'M230 110V10A100 100 0 0 1 330 110Z', class: 'cfill' }, s);
  svgEl('path', { d: 'M230 100h10v10', class: 'sq' }, s);
  txt(s, 345, 64, '10 cm', 'sm');
}

/* ---------- 第 10 页：车轮滚动，车轴的轨迹 ---------- */
const WH = { x0: 70, ground: 200, R: 55 };
function initWheel() {
  const s = $('wheel');
  const { x0, ground, R } = WH;
  const st = { off: 0, anim: 0 };
  svgEl('line', { x1: 10, y1: ground, x2: 510, y2: ground, class: 'ground' }, s);
  const path = svgEl('path', { class: 'axle-trace' }, s);
  const wheel = svgEl('g', {}, s);
  svgEl('circle', { cx: 0, cy: 0, r: R, class: 'tire' }, wheel);
  for (let k = 0; k < 8; k += 1) svgEl('line', { x1: 0, y1: 0, x2: f2(R * Math.cos((k * Math.PI) / 4)), y2: f2(R * Math.sin((k * Math.PI) / 4)), class: 'spoke' }, wheel);
  const axle = svgEl('circle', { r: 7, class: 'axle' }, s);
  const place = (dist, pts) => {
    const th = dist / R; // 滚过的弧长 = 前进的距离
    const cx = x0 + dist;
    const cy = ground - R;
    wheel.setAttribute('transform', `translate(${f2(cx)} ${cy}) rotate(${f2((th * 180) / Math.PI)})`);
    const ax = cx + st.off * Math.cos(th + Math.PI / 2);
    const ay = cy + st.off * Math.sin(th + Math.PI / 2);
    axle.setAttribute('cx', f2(ax)); axle.setAttribute('cy', f2(ay));
    pts.push(`${f2(ax)} ${f2(ay)}`);
    path.setAttribute('d', `M${pts.join('L')}`);
  };
  const run = () => {
    cancelAnimationFrame(st.anim);
    const total = 2 * Math.PI * R; // 转一周
    const pts = [];
    const t0 = performance.now();
    const step = (t) => {
      const u = Math.min(1, (t - t0) / 3000);
      place(u * total, pts);
      if (u < 1) st.anim = requestAnimationFrame(step);
    };
    st.anim = requestAnimationFrame(step);
  };
  $('wGo').addEventListener('click', run);
  $('wOff').addEventListener('click', (e) => {
    st.off = st.off ? 0 : 30;
    e.target.textContent = st.off ? '车轴装在圆心' : '车轴不装在圆心';
    run();
  });
  place(0, []);
}

window.LESSON = {
  init() {
    initRecall();
    initFind();
    initCompass();
    initParts();
    initMany();
    initDr();
    initSym();
    initEx13();
    initWheel();
  },
};
