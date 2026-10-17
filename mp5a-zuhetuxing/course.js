'use strict';
/* 五上 组合图形与不规则图形的面积 · 本课互动：例 10 三种割补（核心 1）、L 形花圃、例 11 三种数方格（核心 2）、
 * 方格越小越准、练习按数据等比例作图。方格纸与图块移动见 ../shared/mgrid.js */
const $ = (id) => document.getElementById(id);
const { mk } = MGrid;
const later = (fn) => requestAnimationFrame(() => requestAnimationFrame(fn));
const fmt = (v) => String(+v.toFixed(2));

/* ---------- 通用：一个图形 + 几种割补方法（按钮切换） ---------- */
// spec.ways[w] = { parts: [{ pts, cls, move }], add: 补上的图块, html: 算式 }
function cutPaste(svgId, btnsId, outId, spec) {
  const g = MGrid.paper($(svgId), { cols: spec.cols, rows: spec.rows, u: spec.u, pad: 62, grid: false });
  const base = g.poly(spec.shape, 'sh-d');
  const layer = g.group();
  const dims = g.group();
  spec.dims.forEach(([p, q, t, off]) => g.dim(p, q, t, off, dims));
  const show = (w) => {
    const way = spec.ways[w];
    layer.innerHTML = '';
    base.classList.toggle('hide', true);
    if (way.add) {
      g.poly(spec.box, 'sh-ghost', layer);
      const add = g.poly(way.add, 'sh-c fade hide', layer);
      later(() => add.classList.remove('hide'));
    }
    way.parts.forEach(({ pts, cls, move }) => {
      const el = g.poly(pts, `${cls || 'sh-d'} mg-move`, layer);
      if (move) later(() => MGrid.pose(el, g, move));
    });
    (way.dims || []).forEach(([p, q, t, off]) => g.dim(p, q, t, off, layer));
    const out = $(outId);
    out.innerHTML = way.html;
    MathKit.tex(out);
  };
  $(btnsId).addEventListener('click', (e) => {
    const btn = e.target.closest('[data-w]');
    if (!btn) return;
    $(btnsId).querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b === btn));
    show(btn.dataset.w);
  });
}

/* 例 10 草坪（单位：米；y 向下）：上 12、右 10、下 15、左上竖边 4 */
const CAO = {
  cols: 15, rows: 10, u: 26,
  shape: [[3, 0], [15, 0], [15, 10], [0, 10], [3, 4]],
  box: [[0, 0], [15, 0], [15, 10], [0, 10]],
  dims: [[[3, 0], [15, 0], '12 m', 0.9], [[15, 0], [15, 10], '10 m', 1.3], [[15, 10], [0, 10], '15 m', 0.9], [[3, 4], [3, 0], '4 m', 0.9]],
  ways: {
    h: {
      parts: [{ pts: [[3, 0], [15, 0], [15, 4], [3, 4]], move: { dy: -0.7 } }, { pts: [[3, 4], [15, 4], [15, 10], [0, 10]], cls: 'sh-a' }],
      dims: [[[15, 4], [15, 10], '6 m', -1]],
      html: '长方形：$12\\times4=48$（平方米）<br>梯形：$(12+15)\\times6\\div2=81$（平方米）<br>$48+81=129$（平方米）',
    },
    v: {
      parts: [{ pts: [[3, 0], [15, 0], [15, 10], [3, 10]] }, { pts: [[0, 10], [3, 10], [3, 4]], cls: 'sh-a', move: { dx: -0.8 } }],
      dims: [[[0, 10], [3, 10], '3 m', 0.5]],
      html: '长方形：$12\\times10=120$（平方米）<br>三角形：$3\\times(10-4)\\div2=9$（平方米）<br>$120+9=129$（平方米）',
    },
    b: {
      parts: [{ pts: [[3, 0], [15, 0], [15, 10], [0, 10], [3, 4]] }],
      add: [[0, 0], [3, 0], [3, 4], [0, 10]],
      html: '大长方形：$15\\times10=150$（平方米）<br>补上的梯形：$(10+4)\\times3\\div2=21$（平方米）<br>$150-21=129$（平方米）',
    },
  },
};

/* 练一练 L 形花圃（单位：米）：下 6、左 5、右下角高 2、缺口宽 2 */
const LSH = {
  cols: 6, rows: 5, u: 34,
  shape: [[0, 0], [4, 0], [4, 3], [6, 3], [6, 5], [0, 5]],
  box: [[0, 0], [6, 0], [6, 5], [0, 5]],
  dims: [[[0, 5], [0, 0], '5 m', 0.9], [[6, 5], [0, 5], '6 m', 0.8], [[4, 3], [6, 3], '2 m', 0.6], [[6, 3], [6, 5], '2 m', 0.9]],
  ways: {
    v: { parts: [{ pts: [[0, 0], [4, 0], [4, 5], [0, 5]] }, { pts: [[4, 3], [6, 3], [6, 5], [4, 5]], cls: 'sh-a', move: { dx: 0.5 } }], html: '$4\\times5+2\\times2=24$（平方米）' },
    h: { parts: [{ pts: [[0, 0], [4, 0], [4, 3], [0, 3]], move: { dy: -0.5 } }, { pts: [[0, 3], [6, 3], [6, 5], [0, 5]], cls: 'sh-a' }], html: '$4\\times3+6\\times2=24$（平方米）' },
    b: { parts: [{ pts: [[0, 0], [4, 0], [4, 3], [6, 3], [6, 5], [0, 5]] }], add: [[4, 0], [6, 0], [6, 3], [4, 3]], html: '$6\\times5-2\\times3=24$（平方米）' },
  },
};

/* ---------- 例 11 湖泊：轮廓由极坐标函数给出（对中心是星形的），覆盖情况按真实形状计算 ---------- */
const LAKE = { cx: 8, cy: 5.5, sx: 1.35, sy: 0.92, cols: 16, rows: 11 };
const lakeR = (t) => 4.3 + 0.45 * Math.sin(3 * t) + 0.3 * Math.cos(5 * t + 1) + 0.2 * Math.sin(2 * t + 0.5);
const inLake = (x, y) => {
  const dx = (x - LAKE.cx) / LAKE.sx;
  const dy = (y - LAKE.cy) / LAKE.sy;
  return Math.hypot(dx, dy) <= lakeR(Math.atan2(dy, dx));
};
const lakeArea = (() => { // 真实面积：S = sx·sy·∫ r²/2 dθ
  const N = 7200;
  let s = 0;
  for (let k = 0; k < N; k += 1) s += lakeR(((k + 0.5) * 2 * Math.PI) / N) ** 2 / 2;
  return s * ((2 * Math.PI) / N) * LAKE.sx * LAKE.sy;
})();
// 把每格（边长 1/n）分成 full / part / none：格内取 (S+1)² 个点（含边和角）
function classifyLake(n) {
  const S = n === 1 ? 24 : n === 2 ? 14 : 8;
  const cells = [];
  for (let j = 0; j < LAKE.rows * n; j += 1) {
    for (let i = 0; i < LAKE.cols * n; i += 1) {
      let k = 0;
      for (let a = 0; a <= S; a += 1) for (let b = 0; b <= S; b += 1) if (inLake((i + a / S) / n, (j + b / S) / n)) k += 1;
      if (k) cells.push({ i, j, kind: k === (S + 1) ** 2 ? 'full' : 'part' });
    }
  }
  return cells;
}
const lakePath = (g) => {
  const pts = Array.from({ length: 240 }, (_, k) => {
    const t = (k / 240) * 2 * Math.PI;
    const r = lakeR(t);
    return [LAKE.cx + LAKE.sx * r * Math.cos(t), LAKE.cy + LAKE.sy * r * Math.sin(t)];
  });
  return g.poly(pts, 'lake');
};
function drawLake(svg, n, mode) {
  svg.innerHTML = '';
  const g = MGrid.paper(svg, { cols: LAKE.cols * n, rows: LAKE.rows * n, u: 36 / n, pad: 6 });
  g.root.parentNode.insertBefore(g.root, g.root.parentNode.firstChild); // 湖在方格线下面
  lakePath(g).setAttribute('transform', `scale(${n})`);
  const cells = classifyLake(n);
  cells.forEach(({ i, j, kind }) => {
    if (mode === 'a' && kind !== 'full') return;
    if (!mode) return;
    g.poly([[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]], `cell ${kind}`, g.root);
  });
  return cells;
}

function initLake() {
  const svg = $('lakeFig');
  const cells = drawLake(svg, 1, '');
  const full = cells.filter((c) => c.kind === 'full').length;
  const part = cells.length - full;
  const est = { a: full, b: full + part, c: full + part / 2 };
  const name = { a: '只数整格', b: '不满整格当整格', c: '不满整格按半格' };
  const read = $('lakeRead');
  const render = (w) => {
    read.innerHTML = `<span>整格</span><span class="bar"><i style="width:${(full / est.b) * 100}%;background:#2e9a57"></i></span><span class="v">${full} 个</span>`
      + `<span>不满整格</span><span class="bar"><i style="width:${(part / est.b) * 100}%;background:#d9711c"></i></span><span class="v">${part} 个</span>`
      + (w ? `<span><b>${name[w]}</b></span><span class="bar"><i style="width:${(est[w] / est.b) * 100}%;background:#1d6fa5"></i></span><span class="v">${fmt(est[w])} 公顷</span>` : '')
      + `<span>实际面积</span><span class="bar"><i style="width:${(lakeArea / est.b) * 100}%;background:#6f8191"></i></span><span class="v">≈ ${fmt(lakeArea)} 公顷</span>`;
  };
  render('');
  $('lakeWay').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-w]');
    if (!btn) return;
    $('lakeWay').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b === btn));
    drawLake(svg, 1, btn.dataset.w);
    render(btn.dataset.w);
  });
}

function initFine() {
  const svg = $('fineFig');
  const tab = $('fineTab');
  const label = { 1: '1 公顷', 2: '1/4 公顷', 4: '1/16 公顷' };
  const rows = {};
  [1, 2, 4].forEach((n) => {
    rows[n] = document.createElement('tr');
    rows[n].className = 'hide-row';
    tab.appendChild(rows[n]);
  });
  const last = document.createElement('tr');
  last.innerHTML = `<td colspan="3">实际面积（精确计算）</td><td>≈ ${fmt(lakeArea)} 公顷</td>`;
  tab.appendChild(last);
  const show = (n) => {
    const cells = drawLake(svg, n, 'c');
    const full = cells.filter((c) => c.kind === 'full').length;
    const part = cells.length - full;
    rows[n].innerHTML = `<td>${label[n]}</td><td>${full}</td><td>${part}</td><td><b>${fmt((full + part / 2) / (n * n))}</b> 公顷</td>`;
    rows[n].className = 'cur';
    Object.entries(rows).forEach(([k, r]) => { if (+k !== n && r.className === 'cur') r.className = ''; });
  };
  $('fineN').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-n]');
    if (!btn) return;
    $('fineN').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b === btn));
    show(+btn.dataset.n);
  });
  show(1);
}

/* ---------- 练习四：按题目数据等比例画 ---------- */
function drawer(svg, vb) {
  svg.setAttribute('viewBox', vb);
  const P = (pts, cls = 'pf-sh') => mk('path', { d: `M${pts.map((p) => p.map((v) => +v.toFixed(1)).join(' ')).join('L')}Z`, class: cls }, svg);
  const L = (p, q, cls = 'pf-h') => mk('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], class: cls }, svg);
  const T = (p, s, cls = 'pf-t') => { mk('text', { x: p[0], y: p[1], class: cls }, svg).textContent = s; };
  return { P, L, T };
}
// 把“厘米坐标”换成像素：原点 o、每厘米 k 像素
const at = (o, k) => (pts) => pts.map(([x, y]) => [o[0] + x * k, o[1] + y * k]);

function initCombo() {
  const { P, L, T } = drawer($('comboFig'), '0 0 960 245');
  // ① 梯形（上 40、下 20、高 10）+ 正方形（边长 20）；1 cm = 4 px
  const f1 = at([60, 45], 5);
  P(f1([[0, 0], [40, 0], [30, 10], [10, 10]]));
  P(f1([[10, 10], [30, 10], [30, 30], [10, 30]]));
  L(...f1([[14, 0], [14, 10]]));
  T(f1([[20, -2.5]])[0], '40');
  T(f1([[16.5, 6.5]])[0], '10', 'pf-t r');
  T(f1([[33.5, 21]])[0], '20');
  T(f1([[20, 35]])[0], '20');
  // ② 平行四边形（底 12、高 16、斜边 20）+ 三角形（底 20、高 9）；1 cm = 7 px
  const f2 = at([375, 35], 9.5);
  const TR = [24, 0];
  const BR = [12, 16];
  const d = [(BR[0] - TR[0]) / 20, (BR[1] - TR[1]) / 20];
  const F = [TR[0] + d[0] * 12.4, TR[1] + d[1] * 12.4];
  const V = [F[0] + d[1] * 9, F[1] - d[0] * 9]; // 向平行四边形外侧量 9
  P(f2([[0, 16], BR, TR, [12, 0]]));
  P(f2([BR, V, TR]));
  L(...f2([[12, 0], [12, 16]]));
  L(...f2([F, V]));
  T(f2([[6, 18.6]])[0], '12');
  T(f2([[4.6, 7]])[0], '20', 'pf-t end');
  T(f2([[13.2, 9]])[0], '16', 'pf-t r start');
  T(f2([[(F[0] + V[0]) / 2 + 0.6, (F[1] + V[1]) / 2 + 2]])[0], '9', 'pf-t r');
  // ③ 长方形 10 × 8 去掉上面的梯形（上 10、下 6、高 2）；1 cm = 14 px
  const f3 = at([720, 50], 18);
  P(f3([[0, 0], [2, 2], [8, 2], [10, 0], [10, 8], [0, 8]]));
  L(...f3([[0, 0], [10, 0]]), 'pf-h');
  L(...f3([[1.2, 0], [1.2, 1.2]]));
  T(f3([[5, 3.4]])[0], '6');
  T(f3([[1.9, 1]])[0], '2', 'pf-t r start');
  T(f3([[5, 9.6]])[0], '10');
  T(f3([[10.6, 4.4]])[0], '8', 'pf-t start');
  T([30, 30], '①');
  T([340, 30], '②');
  T([690, 30], '③');
}

function initLawn() {
  const { P, L, T } = drawer($('lawnFig'), '0 0 300 175');
  const f = at([40, 30], 6); // 1 m = 6 px
  P(f([[8, 0], [28, 0], [36, 20], [0, 20]]));
  P(f([[12, 8], [24, 8], [24, 12], [12, 12]]), 'pf-w');
  L(...f([[8, 0], [8, 20]]));
  T(f([[18, -1.5]])[0], '20 m');
  T(f([[18, 23.5]])[0], '36 m');
  T(f([[7.2, 11]])[0], '20 m', 'pf-t r end');
  T(f([[18, 7.2]])[0], '12 m');
  T(f([[24.8, 10.6]])[0], '4 m', 'pf-t start');
}

function initCorner() {
  const { P, T } = drawer($('cornerFig'), '0 0 260 185');
  const f = at([50, 20], 18); // 1 cm = 18 px
  P(f([[4, 0], [8, 0], [8, 4]]), 'pf-cut');
  P(f([[0, 0], [4, 0], [8, 4], [8, 8], [0, 8]]));
  T(f([[4, 9.1]])[0], '8 cm');
  T(f([[-0.4, 4.3]])[0], '8 cm', 'pf-t end');
}

window.LESSON = {
  init() {
    cutPaste('caoFig', 'caoWay', 'caoCalc', CAO);
    cutPaste('lFig', 'lWay', 'lHow', LSH);
    initLake();
    initFine();
    initCombo();
    initLawn();
    initCorner();
  },
};
