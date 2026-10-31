'use strict';
/* 九下 课题学习 制作“动画片” · 本课互动：课本小车三幅 + 翻页机、翻页动画工作台（平移 / 旋转 / 位似，核心）、
 * y = 1/x 点动成线、位似“渐渐远去的小船”。方格纸 20 × 20，坐标单位为格（y 向下），每个顶点按变换公式计算。 */
const { fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const N = 20;
const RAD = Math.PI / 180;

/* ---------- 图形（格坐标） ---------- */
const ring = (cx, cy, rx, ry, n = 36) => Array.from({ length: n }, (_, i) => [cx + rx * Math.cos((2 * Math.PI * i) / n), cy + ry * Math.sin((2 * Math.PI * i) / n)]);
const SHAPES = {
  // 小车：车身 6 × 2.5，两个轮子
  car: (x0) => [
    { pts: [[x0, 8], [x0 + 6, 8], [x0 + 6, 10.5], [x0, 10.5]], cls: 'body' },
    { pts: ring(x0 + 1.5, 11.2, 0.7, 0.7), cls: 'wheel' },
    { pts: ring(x0 + 4.5, 11.2, 0.7, 0.7), cls: 'wheel' },
  ],
  // 气球：椭圆 + 结 + 线，总高 6.5 格（12 ~ 18.5）
  balloon: () => [
    { pts: ring(10, 14, 1.6, 2), cls: 'balloon' },
    { pts: [[9.7, 16.4], [10.3, 16.4], [10, 15.9]], cls: 'balloon' },
    { pts: [[10, 16.4], [10.2, 17.4], [9.8, 18.5]], cls: 'string', open: true },
  ],
  // 风车：中心 (10, 10)，4 片叶
  mill: () => [0, 90, 180, 270].map((a) => {
    const r = (p) => rot(p, [10, 10], a);
    return { pts: [[10, 10], [10, 4], [12.5, 5.5], [10.6, 9]].map(r), cls: 'blade' };
  }).concat([{ pts: ring(10, 10, 0.5, 0.5), cls: 'hub' }]),
  // 小船：船身 + 桅杆 + 帆，以水平线上的 V(10, 7) 为位似中心
  ship: () => [
    { pts: [[5, 15], [15, 15], [13.5, 17], [6.5, 17]], cls: 'hull' },
    { pts: [[10, 15], [10, 10]], cls: 'mast', open: true },
    { pts: [[10.3, 10.5], [10.3, 14.5], [13.8, 14.5]], cls: 'sail' },
  ],
};
const V = [10, 7];
function rot([x, y], [cx, cy], deg) {
  const c = Math.cos(deg * RAD); const s = Math.sin(deg * RAD);
  return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c];
}
const homo = ([x, y], [cx, cy], k) => [cx + (x - cx) * k, cy + (y - cy) * k];

/** 主题：第 n 幅（n 从 0 起）的图形 */
const THEMES = {
  car: { name: '每幅向左平移（格）', min: 0.25, max: 1.5, step: 0.25, def: 0.5, unit: '格', frame: (n, p) => SHAPES.car(13 - n * p) },
  balloon: { name: '每幅向上平移（格）', min: 0.25, max: 2, step: 0.25, def: 0.5, unit: '格', frame: (n, p) => SHAPES.balloon().map((s) => ({ ...s, pts: s.pts.map(([x, y]) => [x, y - n * p]) })) },
  mill: { name: '每幅顺时针旋转（°）', min: 5, max: 45, step: 5, def: 15, unit: '°', frame: (n, p) => SHAPES.mill().map((s) => ({ ...s, pts: s.pts.map((q) => rot(q, [10, 10], n * p)) })) },
  ship: { name: '每幅位似比 k', min: 0.8, max: 0.98, step: 0.01, def: 0.9, unit: '', frame: (n, p) => SHAPES.ship().map((s) => ({ ...s, pts: s.pts.map((q) => homo(q, V, p ** n)) })) },
};

/* ---------- 方格纸 ---------- */
function gridSVG() {
  let s = '';
  for (let i = 0; i <= N; i += 1) s += `<line class="gl${i % 5 ? '' : ' g5'}" x1="${i}" y1="0" x2="${i}" y2="${N}"/><line class="gl${i % 5 ? '' : ' g5'}" x1="0" y1="${i}" x2="${N}" y2="${i}"/>`;
  return `${s}<rect class="gb" x="0" y="0" width="${N}" height="${N}"/>`;
}
const GRID = gridSVG();
const path = (s) => `<path class="sh ${s.cls}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(3)} ${y.toFixed(3)}`).join('')}${s.open ? '' : 'Z'}"/>`;
const draw = (svg, shapes, extra = '') => { svg.innerHTML = `<defs><clipPath id="${svg.id}c"><rect x="0" y="0" width="${N}" height="${N}"/></clipPath></defs>${GRID}${extra}<g clip-path="url(#${svg.id}c)">${shapes.map(path).join('')}</g>`; };
const NS = 'http://www.w3.org/2000/svg';
const mkSvg = (cls) => { const e = document.createElementNS(NS, 'svg'); e.setAttribute('viewBox', '-0.5 -0.5 21 21'); e.setAttribute('class', cls); return e; };

/** 播放器：frames 帧，fps；返回 toggle() */
function player(onFrame, getFrames, getFps, input, btn) {
  let timer = null;
  const stop = () => { clearInterval(timer); timer = null; btn.textContent = '▶ 播放'; };
  return () => {
    if (timer) { stop(); return; }
    let i = 0;
    btn.textContent = '■ 停止';
    timer = setInterval(() => {
      const n = getFrames();
      onFrame(i % n); input.value = (i % n) + 1;
      i += 1;
      if (i >= n * 3) stop(); // 播 3 遍自动停
    }, 1000 / getFps());
  };
}

/* ---------- 第 3 页：小车 ---------- */
function initCar() {
  [0, 1, 2].forEach((n) => { const s = mkSvg('paper'); s.id = `car3_${n}`; $('car3').appendChild(s); draw(s, SHAPES.car(9 - n)); });
  const show = (n) => { $('carNV').textContent = n + 1; draw($('carPlay'), SHAPES.car(18 - 6 - n)); };
  $('carN').addEventListener('input', (e) => show(+e.target.value - 1));
  $('carGo').addEventListener('click', player(show, () => 12, () => 8, $('carN'), $('carGo')));
  show(0);
}

/* ---------- 第 4 页：工作台 ---------- */
function initWorkbench() {
  const st = { k: 'car', p: THEMES.car.def, frames: 24, fps: 12, n: 0 };
  const strip = [];
  for (let i = 0; i < 8; i += 1) {
    const cell = document.createElement('div'); cell.className = 'cell';
    const s = mkSvg('paper thumb'); s.id = `wbT${i}`;
    const lb = document.createElement('span');
    cell.append(s, lb); $('wbStrip').appendChild(cell); strip.push([s, lb]);
  }
  const show = (n) => { st.n = n; $('wbNV').textContent = n + 1; draw($('wbPaper'), THEMES[st.k].frame(n, st.p), st.k === 'ship' ? `<line class="hz" x1="0" y1="${V[1]}" x2="${N}" y2="${V[1]}"/>` : ''); };
  const outFrom = () => {
    for (let n = 0; n < st.frames; n += 1) {
      const pts = THEMES[st.k].frame(n, st.p).flatMap((s) => s.pts);
      if (pts.some(([x, y]) => x < -1e-9 || x > N + 1e-9 || y < -1e-9 || y > N + 1e-9)) return n + 1;
    }
    return 0;
  };
  const refresh = () => {
    const T = THEMES[st.k];
    $('wbPName').textContent = T.name;
    $('wbPV').textContent = `${fmt(st.p, 2)}${T.unit}`;
    $('wbFV').textContent = st.frames; $('wbSV').textContent = st.fps;
    $('wbN').max = st.frames;
    if (st.n >= st.frames) st.n = 0;
    $('wbN').value = st.n + 1;
    show(st.n);
    strip.forEach(([s, lb], i) => { const n = Math.round((i * (st.frames - 1)) / 7); draw(s, T.frame(n, st.p)); lb.textContent = `第 ${n + 1} 幅`; });
    const out = outFrom();
    const total = { car: `共向左平移 ${fmt(st.p * (st.frames - 1), 2)} 格`, balloon: `共向上平移 ${fmt(st.p * (st.frames - 1), 2)} 格`, mill: `共旋转 ${fmt(st.p * (st.frames - 1))}°`, ship: `最后一幅是第 1 幅的 $${fmt(st.p, 2)}^{${st.frames - 1}}\\approx${fmt(st.p ** (st.frames - 1), 3)}$ 倍` }[st.k];
    $('wbMsg').className = `tip feedback ${out ? 'fb-warn' : 'fb-ok'}`;
    $('wbMsg').innerHTML = `${st.frames} 幅，${total}，播放约 ${fmt(st.frames / st.fps, 1)} 秒．${out ? `<b>从第 ${out} 幅起图形超出了画纸</b>，减小变化量或幅数．` : '全部在画纸内．'}`;
    tex($('wbMsg'));
  };
  const setTheme = (k) => {
    st.k = k; const T = THEMES[k]; st.p = T.def; st.n = 0;
    Object.assign($('wbP'), { min: T.min, max: T.max, step: T.step, value: T.def });
    refresh();
  };
  $('wbTheme').addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]'); if (!b) return;
    $('wbTheme').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    setTheme(b.dataset.k);
  });
  $('wbP').addEventListener('input', (e) => { st.p = +e.target.value; refresh(); });
  $('wbF').addEventListener('input', (e) => { st.frames = +e.target.value; refresh(); });
  $('wbS').addEventListener('input', (e) => { st.fps = +e.target.value; refresh(); });
  $('wbN').addEventListener('input', (e) => show(+e.target.value - 1));
  $('wbGo').addEventListener('click', player(show, () => st.frames, () => st.fps, $('wbN'), $('wbGo')));
  setTheme('car');
}

/* ---------- 第 6 页：y = 1/x 点动成线（4 格 = 1，原点在左下角） ---------- */
function initHyp() {
  const P = (x, y) => [x * 4, N - y * 4];
  const pts = Array.from({ length: 24 }, (_, i) => { const x = 0.2 * (i + 1); return [x, 1 / x]; });
  const axes = `<line class="ax" x1="0" y1="${N}" x2="${N}" y2="${N}"/><line class="ax" x1="0" y1="0" x2="0" y2="${N}"/>`
    + [1, 2, 3, 4, 5].map((v) => `<text class="tk" x="${v * 4}" y="${N + 0.9}">${v}</text><text class="tk" x="-0.35" y="${N - v * 4 + 0.3}" text-anchor="end">${v}</text>`).join('');
  const show = (n) => {
    $('hypNV').textContent = n;
    $('hyp').innerHTML = `${GRID}${axes}${pts.slice(0, n).map(([x, y], i) => { const [a, b] = P(x, y); return `<circle class="hp${i === n - 1 ? ' last' : ''}" cx="${a.toFixed(3)}" cy="${b.toFixed(3)}" r="0.32"/>`; }).join('')}`;
  };
  $('hypN').addEventListener('input', (e) => show(+e.target.value));
  $('hypGo').addEventListener('click', player((i) => show(i + 1), () => 24, () => 6, $('hypN'), $('hypGo')));
  show(24);
}

/* ---------- 第 7 页：小船 ---------- */
function initShip() {
  const st = { k: 0.9, n: 0 };
  const show = () => {
    const r = st.k ** st.n;
    const base = SHAPES.ship();
    const lines = [[5, 15], [15, 15]].map((q) => `<line class="ray" x1="${V[0]}" y1="${V[1]}" x2="${q[0]}" y2="${q[1]}"/>`).join('');
    const extra = `<line class="hz" x1="0" y1="${V[1]}" x2="${N}" y2="${V[1]}"/>${lines}<circle class="vp" cx="${V[0]}" cy="${V[1]}" r="0.3"/><text class="tk" x="${V[0] + 0.5}" y="${V[1] - 0.4}">位似中心</text>`;
    draw($('shipP'), base.map((s) => ({ ...s, pts: s.pts.map((q) => homo(q, V, r)) })), extra);
    $('shipKV').textContent = fmt(st.k, 2); $('shipNV').textContent = st.n + 1;
    $('shipMsg').className = 'tip feedback fb-ok';
    $('shipMsg').innerHTML = `第 ${st.n + 1} 幅：船长 $10\\times${fmt(st.k, 2)}^{${st.n}}\\approx${fmt(10 * r, 2)}$ 格（第 1 幅船长 10 格）．`;
    tex($('shipMsg'));
  };
  $('shipK').addEventListener('input', (e) => { st.k = +e.target.value; show(); });
  $('shipN').addEventListener('input', (e) => { st.n = +e.target.value - 1; show(); });
  show();
}

window.LESSON = { init() { initCar(); initWorkbench(); initHyp(); initShip(); } };
