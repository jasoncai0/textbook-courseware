'use strict';
/* 五下 圆的周长 · 本课互动：三个车轮各滚一周、3d<C<4d 比较条、圆片在直尺上滚动测量、割圆术。通用部分见 ../shared/math.js、mcheck.js */
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

/* 一个会滚的轮子：轮心 (x, cy)，转角 = 走过的距离 ÷ 半径（不打滑），红点从着地处出发 */
function makeWheel(parent, R, cls = 'tire') {
  const g = svgEl('g', {}, parent);
  svgEl('circle', { cx: 0, cy: 0, r: R, class: cls }, g);
  for (let k = 0; k < 6; k += 1) svgEl('line', { x1: 0, y1: 0, x2: f2(R * Math.cos((k * Math.PI) / 3)), y2: f2(R * Math.sin((k * Math.PI) / 3)), class: 'spoke' }, g);
  svgEl('circle', { cx: 0, cy: R, r: Math.max(5, R * 0.09), class: 'mark' }, g);
  return {
    place(x, cy, dist) { g.setAttribute('transform', `translate(${f2(x + dist)} ${cy}) rotate(${f2((dist / R) * (180 / Math.PI))})`); },
  };
}
function animate(ms, fn) {
  const t0 = performance.now();
  let id = 0;
  const step = (t) => { const u = Math.min(1, (t - t0) / ms); fn(u); if (u < 1) id = requestAnimationFrame(step); };
  id = requestAnimationFrame(step);
  return () => cancelAnimationFrame(id);
}

/* ---------- 第 3 页：例 4 三个车轮 ---------- */
const RACE = { x0: 140, s: 1.3, rows: [[26, 66], [24, 61], [22, 56]] }; // s：每厘米多少个单位
function initRace() {
  const svg = $('race');
  let stop = () => {};
  const wheels = RACE.rows.map(([inch, d], i) => {
    const R = (d / 2) * RACE.s;
    const ground = 100 + i * 115;
    svgEl('line', { x1: 20, y1: ground, x2: 990, y2: ground, class: 'ground' }, svg);
    txt(svg, 20, ground - 50, `${inch} 英寸`, 'lb sm');
    txt(svg, 20, ground - 26, `直径约 ${d} cm`, 'lb xs');
    const trail = svgEl('line', { x1: RACE.x0, y1: ground + 8, x2: RACE.x0, y2: ground + 8, class: 'trail' }, svg);
    const lab = txt(svg, 0, ground + 26, '', 'lb xs red');
    const w = makeWheel(svg, R);
    w.place(RACE.x0, ground - R, 0);
    return { w, R, ground, trail, lab, d };
  });
  $('raceGo').addEventListener('click', () => {
    stop();
    stop = animate(3000, (u) => wheels.forEach(({ w, R, ground, trail, lab, d }) => {
      const dist = u * 2 * Math.PI * R; // 恰好一周
      w.place(RACE.x0, ground - R, dist);
      trail.setAttribute('x2', f2(RACE.x0 + dist));
      lab.setAttribute('x', f2(RACE.x0 + dist + 8));
      lab.textContent = u === 1 ? `一周 = π × ${d} ≈ ${(Math.PI * d).toFixed(1)} cm` : '';
    }));
  });
}

/* ---------- 第 4 页：例 5 正方形、圆、正六边形 ---------- */
function initSqHex() {
  const s = $('sqhex');
  const [c, r] = [150, 120];
  svgEl('rect', { x: c - r, y: c - r, width: 2 * r, height: 2 * r, class: 'sqr' }, s);
  svgEl('circle', { cx: c, cy: c, r, class: 'cir' }, s);
  const P = Array.from({ length: 6 }, (_, k) => [c + r * Math.cos((k * Math.PI) / 3), c + r * Math.sin((k * Math.PI) / 3)]);
  svgEl('path', { d: `M${P.map((p) => p.map(f2).join(' ')).join('L')}Z`, class: 'hex' }, s);
  P.forEach((p) => svgEl('line', { x1: c, y1: c, x2: f2(p[0]), y2: f2(p[1]), class: 'hex-r' }, s));
  svgEl('circle', { cx: c, cy: c, r: 4, class: 'dot' }, s);
  // 三种周长：3d、πd、4d，按真实比例画（d = 120 单位）
  const b = $('bars');
  const d = 110;
  [['正六边形', 3, 'hexb'], ['圆', Math.PI, 'cirb'], ['正方形', 4, 'sqb']].forEach(([name, k, cls], i) => {
    const y = 12 + i * 46;
    txt(b, 0, y + 24, name, 'lb xs');
    svgEl('rect', { x: 80, y, width: f2(k * d), height: 30, class: cls }, b);
    for (let j = 1; j < k; j += 1) svgEl('line', { x1: 80 + j * d, y1: y, x2: 80 + j * d, y2: y + 30, class: 'cut' }, b);
    txt(b, 86 + k * d, y + 24, k === Math.PI ? '3 个多' : `${k} 个直径`, 'lb xs');
  });
}

/* ---------- 第 5 页：圆片在直尺上滚一周 ---------- */
const ROLL = { x0: 70, ruler: 210, px: 20 }; // 1 厘米 = 20 个单位
function initRoll() {
  const s = $('roll');
  const { x0, ruler, px } = ROLL;
  svgEl('rect', { x: x0 - 20, y: ruler, width: 37 * px + 40, height: 54, class: 'rul' }, s);
  for (let mm = 0; mm <= 360; mm += 1) {
    const x = x0 + (mm * px) / 10;
    const len = mm % 10 === 0 ? 18 : mm % 5 === 0 ? 12 : 7;
    svgEl('line', { x1: f2(x), y1: ruler, x2: f2(x), y2: ruler + len, class: mm % 10 ? 'tk' : 'tk big' }, s);
    if (mm % 50 === 0) txt(s, f2(x), ruler + 42, `${mm / 10}`, 'lb xs mid');
  }
  const layer = svgEl('g', {}, s);
  const trail = svgEl('line', { x1: x0, y1: ruler - 3, x2: x0, y2: ruler - 3, class: 'trail' }, s);
  const read = txt(s, 0, ruler + 82, '', 'lb sm red mid');
  const st = { d: 5, stop: () => {} };
  let wheel;
  const build = () => {
    st.stop();
    layer.innerHTML = '';
    const R = (st.d / 2) * px;
    wheel = { R, w: makeWheel(layer, R, 'disc') };
    wheel.w.place(x0, ruler - R, 0);
    trail.setAttribute('x2', x0);
    read.textContent = '';
  };
  $('rollD').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-d]');
    if (!btn) return;
    st.d = +btn.dataset.d;
    $('rollD').querySelectorAll('[data-d]').forEach((b) => b.classList.toggle('solid', b === btn));
    build();
  });
  $('rollGo').addEventListener('click', () => {
    build();
    const { R, w } = wheel;
    st.stop = animate(3200, (u) => {
      const dist = u * 2 * Math.PI * R;
      w.place(x0, ruler - R, dist);
      trail.setAttribute('x2', f2(x0 + dist));
      if (u < 1) return;
      const cm = (Math.PI * st.d).toFixed(1); // 按毫米刻度读数
      read.setAttribute('x', f2(x0 + dist));
      read.textContent = `红点落在 ${cm} cm 处`;
      $(`c${st.d}`).textContent = cm;
    });
  });
  build();
}

/* ---------- 第 7 页：割圆术 ---------- */
function initGey() {
  const s = $('gey');
  const [c, r] = [150, 130];
  svgEl('circle', { cx: c, cy: c, r, class: 'cir' }, s);
  const poly = svgEl('path', { class: 'poly' }, s);
  svgEl('circle', { cx: c, cy: c, r: 4, class: 'dot' }, s);
  const done = new Set();
  const show = (n) => {
    const P = Array.from({ length: n }, (_, k) => { const t = -Math.PI / 2 + (2 * Math.PI * k) / n; return `${f2(c + r * Math.cos(t))} ${f2(c + r * Math.sin(t))}`; });
    poly.setAttribute('d', `M${P.join('L')}Z`);
    if (done.has(n)) return;
    done.add(n);
    // 正 n 边形周长 ÷ 直径 = n·sin(180°/n)
    const v = n * Math.sin(Math.PI / n);
    const rows = [...done].sort((a, b) => a - b).map((k) => `<tr><td>正 ${k} 边形</td><td>${(k * Math.sin(Math.PI / k)).toFixed(4)}</td></tr>`);
    $('geyTab').innerHTML = `${rows.join('')}<tr><td>圆</td><td>3.1416…</td></tr>`;
    return v;
  };
  $('geyN').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-n]');
    if (!btn) return;
    $('geyN').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b === btn));
    show(+btn.dataset.n);
  });
  show(6);
}

window.LESSON = {
  init() {
    initRace();
    initSqHex();
    initRoll();
    initGey();
  },
};
