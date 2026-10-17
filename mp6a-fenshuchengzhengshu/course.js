'use strict';
/* 六上 分数与整数相乘 · 本课互动：绸带涂色（1 米 = 10 份）、先约分演示、长方形涂色器（几个几分之几）、
 * 10 朵绸花平均分、练一练的圆/长条/绳子图。所有份数、长度都按算式数据精确计算。通用部分见 ../shared/ */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);
const el = FracFig.el;
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const COLORS = ['#f5a623', '#e8577e', '#4aa3df', '#5bb974', '#9b6fd6', '#f07c3e'];

/* 一条或几条“1 米”绸带：每米 10 份，前 cells 份按每朵 per 份分组涂色 */
function drawStrip(svg, cells, per, rows) {
  svg.innerHTML = '';
  const [x0, w, h] = [60, 880, 56];
  for (let m = 0; m < rows; m += 1) {
    const y = 40 + m * 100;
    for (let i = 0; i < 10; i += 1) {
      const k = m * 10 + i;
      el('rect', { x: x0 + (w * i) / 10, y, width: w / 10, height: h, fill: k < cells ? COLORS[Math.floor(k / per) % COLORS.length] : '#fff', stroke: '#c58b3a', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' }, svg);
    }
    el('rect', { x: x0, y, width: w, height: h, fill: 'none', stroke: '#b5762a', 'stroke-width': 3 }, svg);
    el('text', { x: x0 + w / 2, y: y + h + 30, class: 'lb' }, svg).textContent = rows > 1 ? `第 ${m + 1} 米` : '1 米';
  }
  el('text', { x: x0 + (w * 3) / 20, y: 28, class: 'lb s' }, svg).textContent = '3/10 米 = 3 份';
}

function initStrip1() {
  const st = { n: 0 };
  const render = () => {
    drawStrip($('strip1'), st.n * 3, 3, 1);
    $('s1N').textContent = st.n; $('s1C').textContent = st.n * 3;
  };
  $('s1Add').addEventListener('click', () => { st.n = Math.min(3, st.n + 1); render(); });
  $('s1Reset').addEventListener('click', () => { st.n = 0; render(); });
  render();
  drawStrip($('strip1b'), 9, 3, 1);
  drawStrip($('strip5'), 15, 3, 2);
}

/* 先约分演示：5 与 10 同时除以 5 */
function initYue() {
  $('y5').dataset.to = '1';
  $('y10').dataset.to = '2';
  $('yueGo').addEventListener('click', () => $('yue').classList.toggle('cut'));
}

/* 核心：长方形涂色器。每个长方形表示 1，平均分成 rows×cols 份；每次涂 a 份，涂满一个换下一个 */
const PROBS = [
  { a: 3, b: 16, n: 4, rows: 4, cols: 4, intFirst: true },
  { a: 2, b: 7, n: 3, rows: 1, cols: 7 },
  { a: 5, b: 6, n: 4, rows: 2, cols: 3, intFirst: true },
  { a: 7, b: 10, n: 5, rows: 2, cols: 5 },
];
function boxes(count) {
  if (count === 1) return [{ x: 120, y: 20, w: 400, h: 260 }];
  return Array.from({ length: count }, (_, i) => ({ x: 20 + (i % 2) * 310, y: 10 + Math.floor(i / 2) * 150, w: 290, h: 130 }));
}
const fracTex = (p, q) => {
  const g = gcd(p, q);
  if (q / g === 1) return `${p / g}`;
  return `\\frac{${p / g}}{${q / g}}`;
};
function initPaint() {
  const st = { p: 0, k: 0 };
  const svg = $('paint');
  const render = () => {
    const P = PROBS[st.p];
    svg.innerHTML = '';
    const wholes = Math.ceil((P.a * P.n) / P.b);
    boxes(wholes).forEach((bx, w) => {
      for (let r = 0; r < P.rows; r += 1) {
        for (let c = 0; c < P.cols; c += 1) {
          const idx = w * P.b + r * P.cols + c;
          const filled = idx < st.k * P.a;
          el('rect', { x: bx.x + (bx.w * c) / P.cols, y: bx.y + (bx.h * r) / P.rows, width: bx.w / P.cols, height: bx.h / P.rows, fill: filled ? COLORS[Math.floor(idx / P.a) % COLORS.length] : '#fff', stroke: '#2a9fd6', 'stroke-width': 1.2, 'stroke-dasharray': '5 3' }, svg);
        }
      }
      el('rect', { x: bx.x, y: bx.y, width: bx.w, height: bx.h, fill: 'none', stroke: '#1d6fa5', 'stroke-width': 3 }, svg);
    });
    const f = `\\frac{${P.a}}{${P.b}}`;
    const expr = P.intFirst ? `${P.n}\\times${f}` : `${f}\\times${P.n}`;
    let html;
    if (!st.k) html = `算式 $${expr}$ 表示 <b>${P.n} 个 $${f}$</b> 相加。点“再涂一个”。`;
    else {
      const sum = Array(st.k).fill(f).join('+');
      const top = Array(st.k).fill(P.a).join('+');
      html = `涂了 ${st.k} 个 $${f}$：$${sum}=\\frac{${top}}{${P.b}}=\\frac{${P.a}\\times${st.k}}{${P.b}}=\\frac{${P.a * st.k}}{${P.b}}$`;
      if (st.k === P.n) {
        const v = P.a * P.n;
        const simp = fracTex(v, P.b);
        html += `${simp !== `\\frac{${v}}{${P.b}}` ? `$=${simp}$` : ''}<br><b>✓ 涂完了！</b>$${expr}=${simp}$`;
        if (v > P.b) html += `，比 1 大，所以涂到了第 ${Math.ceil(v / P.b)} 个长方形。`;
      }
    }
    $('pMsg').innerHTML = html;
    $('pMsg').className = `tip feedback${st.k === P.n ? ' fb-ok' : ''}`;
    tex($('pMsg'));
  };
  $('pPick').addEventListener('click', (e) => {
    const b = e.target.closest('[data-p]');
    if (!b) return;
    st.p = +b.dataset.p; st.k = 0;
    $('pPick').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    render();
  });
  $('pAdd').addEventListener('click', () => { st.k = Math.min(PROBS[st.p].n, st.k + 1); render(); });
  $('pReset').addEventListener('click', () => { st.k = 0; render(); });
  render();
}

/* 一朵绸花：五片花瓣 + 花心 */
function flower(svg, cx, cy, color) {
  const g = el('g', {}, svg);
  for (let i = 0; i < 5; i += 1) {
    const t = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    el('circle', { cx: cx + 14 * Math.cos(t), cy: cy + 14 * Math.sin(t), r: 12, fill: color, stroke: '#7d8e9c', 'stroke-width': 1.5 }, g);
  }
  el('circle', { cx, cy, r: 8, fill: '#fff6c8', stroke: '#7d8e9c', 'stroke-width': 1.5 }, g);
}
function initFlowers() {
  const st = { f: '1/2', split: false, take: false };
  const render = () => {
    const [num, den] = st.f.split('/').map(Number);
    const svg = $('flowers');
    svg.innerHTML = '';
    const per = 10 / den;
    const gap = st.split ? 34 : 0;
    const total = 10 * 58 + (den - 1) * gap;
    const x0 = (700 - total) / 2 + 29;
    const color = st.f === '1/2' ? '#e8577e' : '#5bb974';
    for (let i = 0; i < 10; i += 1) {
      const grp = Math.floor(i / per);
      const x = x0 + i * 58 + (st.split ? grp * gap : 0);
      flower(svg, x, 70, st.take && grp < num ? color : '#fff');
    }
    if (st.split) {
      for (let g = 0; g < den; g += 1) {
        const xa = x0 + g * per * 58 + g * gap - 27;
        const xb = xa + per * 58 - 4;
        el('path', { d: `M${xa} 112v10H${xb}v-10`, fill: 'none', stroke: '#1d6fa5', 'stroke-width': 2 }, svg);
        el('text', { x: (xa + xb) / 2, y: 150, class: 'lb s' }, svg).textContent = `第 ${g + 1} 份`;
      }
    }
    const msg = !st.split ? '10 朵绸花。先把它们平均分。'
      : !st.take ? `平均分成 ${den} 份，每份 $10\\div${den}=${per}$ 朵。`
        : `取其中 ${num} 份：$${per}\\times${num}=${per * num}$ 朵，就是 10 朵的 $\\dfrac{${num}}{${den}}$。`;
    $('fMsg').innerHTML = msg;
    tex($('fMsg'));
  };
  $('fPick').addEventListener('click', (e) => {
    const b = e.target.closest('[data-f]');
    if (!b) return;
    Object.assign(st, { f: b.dataset.f, split: false, take: false });
    $('fPick').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    render();
  });
  $('fSplit').addEventListener('click', () => { st.split = true; render(); });
  $('fTake').addEventListener('click', () => { Object.assign(st, { split: true, take: true }); render(); });
  render();
}

/* 练一练：12 个圆（2 行 6 个）、20 的长条（平均分 5 份）、8 米绳子 */
function initEx() {
  const c = $('ex12');
  let n12 = 0;
  for (let i = 0; i < 12; i += 1) {
    const dot = el('circle', { cx: 40 + (i % 6) * 50, cy: 30 + Math.floor(i / 6) * 50, r: 20, fill: '#fff', stroke: '#2a9fd6', 'stroke-width': 2.5, class: 'tap' }, c);
    dot.addEventListener('click', () => {
      const on = dot.getAttribute('fill') === '#fff';
      dot.setAttribute('fill', on ? '#8fd3f4' : '#fff');
      n12 += on ? 1 : -1;
      $('ex12n').textContent = `已涂 ${n12} 个${n12 === 4 ? ' ✓ 12 个平均分成 3 份，1 份是 4 个' : ''}`;
    });
  }
  const b = $('ex20');
  let n20 = 0;
  for (let i = 0; i < 5; i += 1) {
    const r = el('rect', { x: 15 + i * 60, y: 25, width: 60, height: 50, fill: '#fff', stroke: '#2a9fd6', 'stroke-width': 2.5, class: 'tap' }, b);
    el('text', { x: 45 + i * 60, y: 98, class: 'lb s' }, b).textContent = '4';
    r.addEventListener('click', () => {
      const on = r.getAttribute('fill') === '#fff';
      r.setAttribute('fill', on ? '#8fd3f4' : '#fff');
      n20 += on ? 1 : -1;
      $('ex20n').textContent = `已涂 ${n20} 份${n20 === 4 ? ' ✓ 4 份是 4×4=16' : ''}`;
    });
  }
  el('text', { x: 165, y: 16, class: 'lb s' }, b).textContent = '20（平均分成 5 份，每份 4）';
  [['rope1', 1, 2], ['rope2', 3, 4]].forEach(([id, p, q]) => {
    const s = $(id);
    const [x0, w] = [20, 400];
    el('line', { x1: x0, x2: x0 + w, y1: 30, y2: 30, stroke: '#cfe6d6', 'stroke-width': 14, 'stroke-linecap': 'round' }, s);
    for (let i = 1; i < q; i += 1) el('line', { x1: x0 + (w * i) / q, x2: x0 + (w * i) / q, y1: 20, y2: 40, stroke: '#7d8e9c', 'stroke-width': 2 }, s);
    el('line', { x1: x0, x2: x0 + (w * p) / q, y1: 30, y2: 30, stroke: '#3c9a5f', 'stroke-width': 14, 'stroke-linecap': 'round' }, s);
    el('text', { x: x0 + w / 2, y: 14, class: 'lb s' }, s).textContent = '8 米';
    el('text', { x: x0 + (w * p) / q / 2, y: 58, class: 'lb s' }, s).textContent = `${p}/${q} 根长？米`;
  });
}

window.LESSON = {
  init() {
    initStrip1();
    initYue();
    initPaint();
    initFlowers();
    initEx();
    FracFig.exact();
  },
};
