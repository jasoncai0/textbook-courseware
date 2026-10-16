'use strict';
/* 七下 11.5 用一元一次不等式解决问题 · 本课互动：按课本搭法画火柴“小鱼”/正方形并计数、山坡海拔与气温、线段图、硬币取值。
 * 通用部分见 ../shared/math.js、numline.js、ineq.js */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const mk = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  parent.appendChild(e);
  return e;
};
const LIMIT = 50;

/* ---------- 火柴棒（世界坐标，y 向上；每根有“头”的一端在 q） ---------- */
const DX = Math.cos(Math.PI / 6); // 图 11-9 的火柴与水平方向成 30°
const DY = 0.5;
/** 图 11-9：第 1 条 8 根；第 k 条借用前一条“鱼头”的 2 根作鱼尾，再加 6 根 */
function fishSticks(n) {
  const sticks = [];
  for (let k = 0; k < n; k++) {
    const T = [DX + k * 2 * DX, 0];
    const U = [T[0] + DX, DY];
    const D = [T[0] + DX, -DY];
    const N = [T[0] + 2 * DX, 0];
    if (k === 0) sticks.push([[0, DY], T], [[0, -DY], T]);
    sticks.push([T, U], [T, D], [[T[0], 2 * DY], U], [[T[0], -2 * DY], D], [U, N], [D, N]);
  }
  return sticks;
}
/** 图 11-10：一排 n 个正方形，3n + 1 根 */
function squareSticks(n) {
  const sticks = [];
  for (let k = 0; k < n; k++) sticks.push([[k, 0], [k + 1, 0]], [[k, 1], [k + 1, 1]]);
  for (let x = 0; x <= n; x++) sticks.push([[x, 0], [x, 1]]);
  return sticks;
}

function drawSticks(host, sticks, minW) {
  host.innerHTML = '';
  const xs = sticks.flat().map((p) => p[0]);
  const ys = sticks.flat().map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const pad = 0.25;
  const w = Math.max(x1 - x0, minW) + 2 * pad;
  const h = y1 - y0 + 2 * pad;
  const S = 100; // 1 单位 = 100 viewBox 像素
  const svg = mk('svg', { viewBox: `0 0 ${w * S} ${h * S}`, preserveAspectRatio: 'xMinYMid meet' }, host);
  const P = ([x, y]) => [(x - x0 + pad) * S, (y1 - y + pad) * S];
  sticks.forEach(([p, q]) => {
    const [a, b] = P(p);
    const [c, d] = P(q);
    // 火柴头略缩进，避免盖住相接的另一根
    mk('line', { x1: a, y1: b, x2: c, y2: d, class: 'stick' }, svg);
    mk('circle', { cx: a + (c - a) * 0.9, cy: b + (d - b) * 0.9, r: 7, class: 'head' }, svg);
  });
}

function initMatch(o) {
  const inp = $(o.input);
  const show = () => {
    const n = +inp.value;
    const sticks = o.sticks(n);
    drawSticks($(o.fig), sticks, o.minW);
    const cnt = sticks.length;
    console.assert(cnt === o.formula(n), '根数与公式不符');
    $(o.input + 'V').textContent = n;
    $(o.cnt).textContent = `${cnt} 根`;
    const bar = $(o.bar);
    bar.style.width = `${Math.min(100, (cnt / 60) * 100)}%`;
    bar.style.background = cnt < LIMIT ? 'var(--jade)' : '#c0392b';
    const msg = $(o.msg);
    msg.className = `tip feedback ${cnt < LIMIT ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = `$n=${n}$：$${o.expr(n)}=${cnt}$，${cnt < LIMIT ? `$${cnt}\\lt 50$，少于 50 根 ✓` : `$${cnt}\\ge 50$，不少于 50 根 ✗`}`;
    tex(msg);
  };
  inp.addEventListener('input', show);
  show();
}

/* ---------- 第 5 页：山坡（海拔 0～800 m），气温 = 20 − 0.006x ---------- */
const ALT_MAX = 800;
const Y0 = 232;
const KY = 0.25; // 每米 0.25 px
function initMount() {
  const svg = $('mount');
  const Y = (h) => Y0 - h * KY;
  const slopeX = (h) => 40 + (h / ALT_MAX) * 270;
  mk('polygon', { points: `10,${Y0} 40,${Y0} ${slopeX(ALT_MAX)},${Y(ALT_MAX)} 345,${Y(ALT_MAX - 60)} 345,${Y0}`, fill: '#cfe3cf', stroke: '#7aa37a', 'stroke-width': 2 }, svg);
  mk('polygon', { points: `40,${Y0} ${slopeX(500)},${Y(500)} 345,${Y(500)} 345,${Y0}`, fill: 'rgba(214,92,150,.18)' }, svg);
  mk('line', { x1: 0, x2: 400, y1: Y0, y2: Y0, stroke: '#556575', 'stroke-width': 2 }, svg);
  // 海拔刻度（右侧）
  mk('line', { x1: 360, x2: 360, y1: Y0, y2: Y(ALT_MAX) - 6, stroke: '#556575', 'stroke-width': 1.5 }, svg);
  mk('rect', { x: 356, y: Y(500), width: 8, height: 500 * KY, fill: 'rgba(47,125,107,.55)' }, svg);
  for (let h = 0; h <= ALT_MAX; h += 100) {
    mk('line', { x1: 356, x2: 364, y1: Y(h), y2: Y(h), stroke: '#556575', 'stroke-width': 1.5 }, svg);
    mk('text', { x: 368, y: Y(h) + 4, class: 'mt-n' }, svg).textContent = h;
  }
  mk('text', { x: 352, y: Y(ALT_MAX) - 10, class: 'mt-n' }, svg).textContent = 'x/m';
  mk('line', { x1: 40, x2: 356, y1: Y(500), y2: Y(500), stroke: '#2f7d6b', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' }, svg);
  mk('text', { x: 150, y: Y(500) - 6, class: 'mt-k' }, svg).textContent = '500 m 处 17℃';
  mk('text', { x: 46, y: Y0 - 8, class: 'mt-k' }, svg).textContent = '山脚 20℃';
  const dot = mk('circle', { r: 7 }, svg);
  const lab = mk('text', { class: 'mt-t' }, svg);
  const inp = $('altX');
  const show = () => {
    const x = +inp.value;
    const t = +(20 - (x / 100) * 0.6).toFixed(2);
    const ok = t >= 17;
    dot.setAttribute('cx', slopeX(x)); dot.setAttribute('cy', Y(x));
    dot.setAttribute('fill', ok ? '#2f7d6b' : '#c0392b');
    lab.setAttribute('x', slopeX(x) - 12); lab.setAttribute('y', Y(x) - 12);
    lab.setAttribute('text-anchor', 'end');
    lab.setAttribute('fill', ok ? '#2f7d6b' : '#c0392b');
    lab.textContent = `${t}℃ ${ok ? '适宜' : '太冷'}`;
    $('altV').textContent = x;
  };
  inp.addEventListener('input', show);
  show();
}

/* ---------- 第 7 页：线段图（按比例：600 m ↔ 300 px，10 天 ↔ 300 px） ---------- */
function initDike() {
  const svg = $('dike');
  const X0 = 50;
  const W = 300;
  const seg = (y, parts) => {
    let x = X0;
    parts.forEach(([frac, fill, text]) => {
      const w = frac * W;
      mk('rect', { x, y, width: w, height: 22, fill, stroke: '#1f2d3a', 'stroke-width': 1.5 }, svg);
      mk('text', { x: x + w / 2, y: y + 40, class: 'dk-t' }, svg).textContent = text;
      x += w;
    });
  };
  mk('text', { x: 4, y: 33, class: 'dk-h' }, svg).textContent = '长度';
  seg(18, [[120 / 600, '#9fb0bf', '已修 120 m'], [480 / 600, '#fff', '还剩 480 m']]);
  mk('text', { x: 4, y: 103, class: 'dk-h' }, svg).textContent = '天数';
  seg(88, [[0.2, '#9fb0bf', '已用 2 天'], [0.6, '#e3f1fb', '还剩 6 天'], [0.2, '#fde7cf', '提前 2 天']]);
}

/* ---------- 第 9 页：硬币枚数（在 x < 4 中选出符合题意的数） ---------- */
const CANDS = [-2, -1, 0, 1, 1.5, 2, 3, 3.5, 4, 5, 6];
const RIGHT = [0, 1, 2, 3];
function initCoins() {
  let picked = [];
  const b = NumLine.board($('coinB'), { from: -2, to: 6, y: [-1.1, 1.5], h: 140 });
  NumLine.axis(b, { from: -2, to: 6 });
  Ineq.ray(b, { a: 4, op: '<', h: 1, from: -2.4, to: 6.5 });
  const dots = CANDS.map((v) => {
    const c = b.pt([v, 0], { r: 9, cls: 'cand' });
    c.addEventListener('click', () => {
      picked = picked.includes(v) ? picked.filter((x) => x !== v) : [...picked, v];
      dots.forEach((d, i) => d.classList.toggle('on', picked.includes(CANDS[i])));
    });
    return c;
  });
  const msg = $('coinMsg');
  $('coinChk').addEventListener('click', () => {
    const miss = RIGHT.filter((v) => !picked.includes(v));
    const extra = picked.filter((v) => !RIGHT.includes(v));
    const ok = !miss.length && !extra.length;
    msg.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
    msg.textContent = ok ? '✓ 对！硬币枚数是自然数，x < 4 中的自然数是 0、1、2、3．'
      : `✗ ${extra.length ? `${extra.map(NumLine.minus).join('、')} 不行（${extra.some((v) => v < 0) ? '枚数不能是负数' : ''}${extra.some((v) => !Number.isInteger(v)) ? '枚数要是整数' : ''}${extra.some((v) => v >= 4) ? '要满足 x < 4' : ''}）．` : ''}${miss.length ? `还漏了 ${miss.join('、')}${miss.includes(0) ? '（0 枚也可以！）' : ''}．` : ''}`;
  });
  $('coinClr').addEventListener('click', () => { picked = []; dots.forEach((d) => d.classList.remove('on')); msg.className = 'tip feedback'; msg.textContent = ''; });
  b.update();
}

window.LESSON = {
  init() {
    initMatch({ input: 'fishN', fig: 'fishFig', cnt: 'fishCnt', bar: 'fishBar', msg: 'fishMsg', sticks: fishSticks, formula: (n) => 8 + 6 * (n - 1), expr: (n) => `8+6\\times(${n}-1)`, minW: 6 * DX });
    initMatch({ input: 'sqN', fig: 'sqFig', cnt: 'sqCnt', bar: 'sqBar', msg: 'sqMsg', sticks: squareSticks, formula: (n) => 3 * n + 1, expr: (n) => `3\\times${n}+1`, minW: 5 });
    initMount();
    initDike();
    initCoins();
  },
};
