'use strict';
/* 五下 通分与分数大小比较 · 本课互动：分数墙（两条等长纸条切成同样多的小格，核心）、例 15 纸条、练习图。
 * 纸条长度、切线位置按数值精确计算。通用部分见 ../shared/fracfig.js */
const { el, bar, grid, gcd, FILL, LINE } = FracFig;
const $ = (id) => document.getElementById(id);
const text = (svg, x, y, s, cls = 'ff-t') => { const t = el('text', { x, y, class: cls }, svg); t.textContent = s; return t; };
const lcm = (a, b) => (a * b) / gcd(a, b);
const ORANGE = '#f6c27a';

/* ---------- 核心：分数墙 ---------- */
const TW = { p: [[3, 4], [5, 6]], m: 0 };
const TW_MAX = 36;
function initTW() {
  const svg = $('tw');
  const [X0, W, H] = [110, 840, 56];
  const rows = [40, 140];
  const msg = $('twMsg');
  const draw = () => {
    svg.innerHTML = '';
    const { p, m } = TW;
    const bad = [];
    p.forEach(([a, b], r) => {
      const y = rows[r];
      el('rect', { x: X0, y, width: (W * a) / b, height: H, fill: r ? ORANGE : FILL }, svg);
      if (m) for (let i = 1; i < m; i += 1) el('line', { x1: X0 + (W * i) / m, x2: X0 + (W * i) / m, y1: y, y2: y + H, stroke: '#7a8c99', 'stroke-width': 1 }, svg);
      for (let i = 1; i < b; i += 1) {
        const x = X0 + (W * i) / b;
        const ok = !m || (i * m) % b === 0;
        el('line', { x1: x, x2: x, y1: y - 6, y2: y + H + 6, stroke: ok ? '#1f2d3a' : '#e74c3c', 'stroke-width': ok ? 3.5 : 5 }, svg);
        if (!ok) bad.push(r);
      }
      el('rect', { x: X0, y, width: W, height: H, fill: 'none', stroke: '#1f2d3a', 'stroke-width': 3 }, svg);
      text(svg, 50, y + H / 2 + 9, `${a}/${b}`, 'ff-t big');
      if (m && (m % b === 0)) text(svg, X0 + W + 2, y + H + 26, `= ${(a * m) / b}/${m}`, 'ff-t b end');
    });
    const [[a1, b1], [a2, b2]] = p;
    if (!m) {
      msg.className = 'tip feedback center';
      msg.innerHTML = `两条纸条都切成几份，才能让 $\\dfrac{${a1}}{${b1}}$ 和 $\\dfrac{${a2}}{${b2}}$ 的粗线都对齐？选一个份数试试。`;
    } else if (bad.length) {
      const who = [...new Set(bad)].map((r) => p[r][1]).join(' 和 ');
      msg.className = 'tip feedback center fb-warn';
      msg.innerHTML = `切成 ${m} 份，红色粗线落在小格中间：${m} 不是 ${who} 的倍数，这样切不能表示原来的分数。`;
    } else {
      const [n1, n2] = [(a1 * m) / b1, (a2 * m) / b2];
      const cmp = n1 > n2 ? '&gt;' : (n1 < n2 ? '&lt;' : '=');
      const best = m === lcm(b1, b2) ? `　${m} 是 ${b1} 和 ${b2} 的<b>最小公倍数</b>，最简便。` : `　还能切得更少吗？`;
      msg.className = 'tip feedback center fb-ok';
      msg.innerHTML = `✓ 都对齐了：$\\dfrac{${a1}}{${b1}}=\\dfrac{${n1}}{${m}}$，$\\dfrac{${a2}}{${b2}}=\\dfrac{${n2}}{${m}}$，所以 $\\dfrac{${a1}}{${b1}}${cmp}\\dfrac{${a2}}{${b2}}$。${best}`;
    }
    MathKit.tex(msg);
  };
  const buttons = () => {
    const [[, b1], [, b2]] = TW.p;
    const L = lcm(b1, b2);
    // 备选份数：两个分母各自的几个倍数 + 公倍数，去重排序，不超过 TW_MAX
    const set = new Set([b1 * 2, b2 * 2, L, L * 2, b1 + b2, Math.max(b1, b2) + 2].filter((v) => v <= TW_MAX && v > Math.max(b1, b2)));
    const ms = [...set].sort((x, y) => x - y);
    $('twM').innerHTML = ms.map((v) => `<button type="button" class="btn" data-m="${v}">${v}</button>`).join('');
  };
  $('twP').addEventListener('click', (e) => {
    const b = e.target.closest('[data-p]');
    if (!b) return;
    $('twP').querySelectorAll('[data-p]').forEach((x) => x.classList.toggle('solid', x === b));
    TW.p = b.dataset.p.split(',').map((f) => f.split('/').map(Number));
    TW.m = 0;
    buttons(); draw();
  });
  $('twM').addEventListener('click', (e) => {
    const b = e.target.closest('[data-m]');
    if (!b) return;
    $('twM').querySelectorAll('[data-m]').forEach((x) => x.classList.toggle('solid', x === b));
    TW.m = +b.dataset.m;
    draw();
  });
  buttons(); draw();
}

/* ---------- 静态图 ---------- */
function initFigs() {
  bar($('rcCmp'), { x: 20, y: 6, w: 200, h: 28, n: 5, on: (i) => i < 3 });
  bar($('rcCmp'), { x: 20, y: 44, w: 200, h: 28, n: 5, on: (i) => i < 2, fill: ORANGE });
  // 例 15：同一本书看作同样长的纸条
  const s = $('e15');
  text(s, 30, 38, '3/5', 'ff-t');
  bar(s, { x: 70, y: 15, w: 420, h: 34, n: 5, on: (i) => i < 3 });
  text(s, 30, 92, '4/9', 'ff-t');
  bar(s, { x: 70, y: 70, w: 420, h: 34, n: 9, on: (i) => i < 4, fill: ORANGE });
  // 练习十一 1
  const x1 = $('x1');
  grid(x1, { x: 20, y: 10, w: 110, h: 80, rows: 2, cols: 1, on: (i) => i === 0 });
  grid(x1, { x: 170, y: 10, w: 110, h: 80, rows: 1, cols: 3, on: (i) => i < 2 });
}

window.LESSON = {
  init() {
    initTW();
    initFigs();
    FracFig.exact();
  },
};
