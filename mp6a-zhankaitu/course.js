'use strict';
/* 六上 长方体和正方体的展开图 · 本课互动：例 3 正方体纸盒逐步展开 / 折回、11 种正方体展开图逐个折、
 * 长方体展开图找相对的面（同组同色）、练一练 1 标面后折起来验证、练一练 2 四个图形折一折判断、练习一 7 连一连、
 * 动手做（选纸片，程序检查能否围成长方体并画出来）。折叠是精确的刚体旋转（../shared/mcube.js）。 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const VIEWS = [];
const reg = (f) => { VIEWS.push(f.v || f); return f; };
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const btnGroup = (box, onPick) => box.addEventListener('click', (e) => {
  const b = e.target.closest('[data-k]');
  if (!b) return;
  box.querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x === b));
  onPick(b.dataset.k, b);
});
const { gridPolys, cuboidNet, foldView } = MCube;
const BLUE = '#a9d3f0';
const PAIR_COLOR = ['#f7e19a', '#f6c99a', '#b9e2c4'];
const NAME_PAIR = { 上: 0, 下: 0, 前: 1, 后: 1, 左: 2, 右: 2 };

/* 方格展开图的小缩略图（cells = [[行, 列], …]） */
function thumb(svg, cells, u = 20) {
  const rows = Math.max(...cells.map((c) => c[0])) + 1;
  const cols = Math.max(...cells.map((c) => c[1])) + 1;
  svg.setAttribute('viewBox', `-2 -2 ${cols * u + 4} ${rows * u + 4}`);
  cells.forEach(([r, c]) => svgEl('rect', { x: c * u, y: r * u, width: u, height: u, class: 'tcell' }, svg));
}

/* 第 3 页：例 3（1 行 4 个、上下各 1 个；前面不动） */
function initEx3() {
  const net = cuboidNet(1, 1, 1);
  const f = reg(foldView($('ex3v'), {
    t: 1, scale: 115, scaleFolded: 190, yaw: -30, pitch: 20, slider: $('ex3T'),
    net: () => ({ ...net, color: () => '#b9e2c4', label: (i) => `${net.names[i]}面` }),
  }));
  $('ex3Play').addEventListener('click', () => f.play(f.st.t > 0.5 ? 0 : 1));
}

/* 第 4 页：11 种正方体展开图 */
const NETS11 = [
  [[0, 1], [1, 0], [1, 1], [1, 2], [1, 3], [2, 1]], [[0, 0], [1, 0], [1, 1], [1, 2], [1, 3], [2, 0]], [[0, 0], [1, 0], [1, 1], [1, 2], [1, 3], [2, 1]],
  [[0, 0], [1, 0], [1, 1], [1, 2], [1, 3], [2, 2]], [[0, 0], [1, 0], [1, 1], [1, 2], [1, 3], [2, 3]], [[0, 1], [1, 0], [1, 1], [1, 2], [1, 3], [2, 2]],
  [[0, 0], [0, 1], [1, 1], [1, 2], [1, 3], [2, 1]], [[0, 0], [0, 1], [1, 1], [1, 2], [1, 3], [2, 2]], [[0, 0], [0, 1], [1, 1], [1, 2], [1, 3], [2, 3]],
  [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2], [2, 3]], [[0, 0], [0, 1], [0, 2], [1, 2], [1, 3], [1, 4]],
];
function initNets11() {
  const s = { k: 0 };
  const box = $('nets11');
  NETS11.forEach((cells, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `nbtn ${i ? '' : 'solid'}`;
    b.dataset.k = i;
    const svg = svgEl('svg', {}, b);
    thumb(svg, cells);
    const n = document.createElement('span');
    n.textContent = i + 1;
    b.appendChild(n);
    box.appendChild(b);
  });
  const f = reg(foldView($('n11v'), { scale: 62, scaleFolded: 130, slider: $('n11T'), net: () => ({ polys: gridPolys(NETS11[s.k]), color: () => BLUE }) }));
  btnGroup(box, (k) => { s.k = +k; f.set(0); f.play(1); });
  $('n11Play').addEventListener('click', () => f.play());
}

/* 第 5 页：长方体展开图，相对的面同色 */
function initCuboid() {
  const net = cuboidNet(4, 2, 3);
  const s = { k: 'all' };
  const f = reg(foldView($('cuv'), {
    scale: 30, scaleFolded: 62, pitch: 20, slider: $('cuT'),
    net: () => ({
      ...net,
      color: (i) => { const p = NAME_PAIR[net.names[i]]; return s.k === 'all' || +s.k === p ? PAIR_COLOR[p] : '#eef2f6'; },
      label: (i) => `${net.names[i]}面`,
    }),
  }));
  btnGroup($('cuK'), (k) => { s.k = k; f.refresh(); });
  $('cuPlay').addEventListener('click', () => f.play());
}

/* 第 6 页：练一练 1（课本展开图：上面在前面上方；一行 A、前、右、B；C 在前面下方） */
function initLabel() {
  // 课本图的比例：长 3、宽 2、高 2（前面 3×2，右面 2×2）
  const [L, W, H] = [3, 2, 2];
  const net = cuboidNet(L, W, H);
  const TXT = { 上: '上面', 前: '前面', 右: '右面', 左: 'A', 后: 'B', 下: 'C' };
  const svg = $('lbNet');
  const u = 40;
  const ox = 20;
  const oy = 10 + W * u;
  net.polys.forEach((P, i) => {
    const pts = P.map(([x, y]) => `${ox + x * u},${oy - y * u}`).join(' ');
    svgEl('polygon', { points: pts, class: `ncell ${['左', '后', '下'].includes(net.names[i]) ? 'ask' : ''}` }, svg);
    const cx = ox + (P.reduce((a, p) => a + p[0], 0) / 4) * u;
    const cy = oy - (P.reduce((a, p) => a + p[1], 0) / 4) * u;
    svgEl('text', { x: cx, y: cy + 8, class: 'ntxt' }, svg).textContent = TXT[net.names[i]];
  });
  svg.setAttribute('viewBox', `0 0 ${ox * 2 + (2 * W + 2 * L) * u} ${20 + (2 * W + H) * u}`);
  const f = reg(foldView($('lbv'), {
    scale: 46, scaleFolded: 80, slider: $('lbT'),
    net: () => ({ ...net, color: (i) => (['左', '后', '下'].includes(net.names[i]) ? '#f6c99a' : '#f3e9d6'), label: (i) => TXT[net.names[i]] }),
  }));
  $('lbPlay').addEventListener('click', () => f.play());
}

/* 第 7 页：练一练 2 的四个图形 */
const NETS4 = [
  { cells: [[0, 0], [0, 1], [0, 2], [1, 1], [2, 1], [3, 1]] },
  { cells: [[0, 2], [1, 2], [2, 2], [3, 2], [1, 0], [1, 1]] },
  { cells: [[0, 1], [0, 2], [1, 1], [2, 1], [2, 0], [3, 0]] },
  { cells: [[0, 0], [0, 1], [0, 2], [1, 0], [2, 0], [3, 0]] },
];
function initNets4() {
  const s = { k: 0, tried: {}, started: false };
  const box = $('nets4');
  NETS4.forEach((n, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'nbtn';
    b.dataset.k = i;
    const svg = svgEl('svg', {}, b);
    thumb(svg, n.cells, 24);
    const t = document.createElement('span');
    t.textContent = '①②③④'[i];
    b.appendChild(t);
    box.appendChild(b);
  });
  const msg = (st) => {
    if (!s.started) return;
    if (st.t < 0.99 || !st.check) { $('n4Msg').innerHTML = s.tried[s.k] === undefined ? '正在折……' : $('n4Msg').innerHTML; return; }
    s.tried[s.k] = st.check.ok;
    box.querySelectorAll('.nbtn').forEach((b) => { const r = s.tried[+b.dataset.k]; b.classList.toggle('yes', r === true); b.classList.toggle('no', r === false); });
    $('n4Msg').className = `tip feedback ${st.check.ok ? 'fb-ok' : 'fb-warn'}`;
    $('n4Msg').innerHTML = st.check.ok ? `<span class="ok">✓ 图${'①②③④'[s.k]}能围成正方体。</span>` : `<span class="no">✗ 图${'①②③④'[s.k]}不能：</span>折起来有两个面<b>重叠</b>（红色），另有一个面空着。`;
  };
  let f = null;
  f = reg(foldView($('n4v'), {
    scale: 62, scaleFolded: 130,
    net: () => {
      const polys = gridPolys(NETS4[s.k].cells);
      const done = f && f.st.t > 0.99 && f.st.check && !f.st.check.ok;
      const bad = done ? overlapIdx(polys) : new Set();
      return { polys, color: (i) => (bad.has(i) ? '#f19a8f' : BLUE) };
    },
    onChange: msg,
  }));
  btnGroup(box, (k) => { s.k = +k; s.started = true; f.set(0); f.play(1); });
}
// 折好后中心重合的面（重叠）
function overlapIdx(polys) {
  const faces = MCube.fold(polys, 1, MCube.bestRoot(polys));
  const cs = faces.map((fc) => Poly3D.vec.centroid(fc.pts));
  const out = new Set();
  cs.forEach((a, i) => cs.forEach((b, j) => { if (i < j && Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < 1e-3) { out.add(i); out.add(j); } }));
  return out;
}

/* 第 8 页：练习一 7（比例按课本量出：甲 长 3 宽 2 高 1；乙 1×1×2；丙 正方体） */
const MATCH = {
  solids: [{ n: '①', d: [1, 2, 1] }, { n: '②', d: [1.4, 1.4, 1.4] }, { n: '③', d: [3, 2, 1] }],
  nets: [
    { n: '甲', sc: 30, cells: [[0, 0], [1, 0], [1, 1], [1, 2], [1, 3], [2, 2]], col: [3, 1, 3, 1], row: [1, 2, 1] },
    { n: '乙', sc: 44, cells: [[0, 1], [1, 0], [1, 1], [1, 2], [1, 3], [2, 1]], col: [1, 1, 1, 1], row: [1, 2, 1] },
    { n: '丙', sc: 50, cells: [[0, 3], [1, 0], [1, 1], [1, 2], [1, 3], [2, 0]], col: [1, 1, 1, 1], row: [1, 1, 1] },
  ],
};
function initMatch() {
  const sBox = $('mSolids');
  MATCH.solids.forEach((so) => {
    const d = document.createElement('div');
    d.className = 'msolid';
    d.innerHTML = `<div class="mv"></div><b>${so.n}</b>`;
    sBox.appendChild(d);
    const [l, w, h] = so.d;
    const v = reg(Poly3D.view(d.querySelector('.mv'), { w: 260, h: 170, scale: 50, yaw: -30, pitch: 22, center: [l / 2, w / 2, h / 2], rotate: false }));
    v.add(() => MCube.boxFaces(l, w, h).map((fc) => ({ type: 'face', pts: fc.pts, out: fc.out, color: BLUE })));
    v.update();
  });
  const nBox = $('mNets');
  MATCH.nets.forEach((n) => {
    const d = document.createElement('div');
    d.className = 'mnet';
    d.innerHTML = `<div class="mv"></div><p><b>${n.n}</b> <button type="button" class="btn">折</button></p>`;
    nBox.appendChild(d);
    const polys = gridPolys(n.cells, (i) => n.col[i], (i) => n.row[i]);
    const f = reg(foldView(d.querySelector('.mv'), { w: 300, h: 220, scale: n.sc, scaleFolded: n.sc * 1.6, net: () => ({ polys, color: () => '#f3e9d6' }) }));
    d.querySelector('button').addEventListener('click', () => f.play());
  });
}

/* 第 9 页：动手做——选纸片围长方体 */
const SHEETS = [[10, 8], [8, 8], [10, 5], [8, 5], [10, 10]];
const SHEET_COLOR = ['#f6c99a', '#b9e2c4', '#a9d3f0', '#e6c3e8', '#f7e19a'];
const key = (a, b) => (a >= b ? `${a}x${b}` : `${b}x${a}`);
// 找长 ≥ 宽 ≥ 高，使 3 组相对的面恰好是所选纸片
function solveBox(counts) {
  const have = {};
  SHEETS.forEach(([a, b], i) => { if (counts[i]) have[key(a, b)] = counts[i]; });
  const LEN = [10, 8, 5];
  for (const a of LEN) for (const b of LEN) for (const c of LEN) {
    if (a < b || b < c) continue;
    const need = {};
    [key(a, b), key(a, c), key(b, c)].forEach((k) => { need[k] = (need[k] || 0) + 2; });
    const ks = new Set([...Object.keys(need), ...Object.keys(have)]);
    if ([...ks].every((k) => need[k] === have[k])) return [a, b, c];
  }
  return null;
}
function initCards() {
  const counts = [2, 0, 2, 2, 0];
  const box = $('cards');
  const MAXW = 10;
  box.innerHTML = SHEETS.map(([a, b], i) => `<div class="card"><svg viewBox="0 0 ${MAXW * 6 + 4} ${MAXW * 6 + 4}"><rect x="2" y="${2 + (MAXW - b) * 6}" width="${a * 6}" height="${b * 6}" fill="${SHEET_COLOR[i]}" stroke="#8a7a3a"/></svg><p>${a} × ${b}</p><div class="stp"><button type="button" class="btn" data-i="${i}" data-d="-1">−</button><b id="cc${i}">0</b><button type="button" class="btn" data-i="${i}" data-d="1">＋</button></div></div>`).join('');
  const st = { dims: null };
  const v = reg(Poly3D.view($('cardv'), { w: 560, h: 380, scale: 20, yaw: -30, pitch: 22, center: () => (st.dims ? [st.dims[0] / 2, st.dims[1] / 2, st.dims[2] / 2] : [0, 0, 0]) }));
  v.add(() => (st.dims ? MCube.boxFaces(...st.dims).map((fc) => {
    const i = SHEETS.findIndex(([a, b]) => key(a, b) === key(...fc.dims));
    return { type: 'face', pts: fc.pts, out: fc.out, color: SHEET_COLOR[i], label: `${Math.max(...fc.dims)}×${Math.min(...fc.dims)}` };
  }) : []));
  const render = () => {
    counts.forEach((c, i) => { $(`cc${i}`).textContent = c; });
    const total = counts.reduce((a, b) => a + b, 0);
    st.dims = total === 6 ? solveBox(counts) : null;
    const msg = $('cardMsg');
    if (total !== 6) { msg.className = 'tip feedback'; msg.innerHTML = `已选 <b>${total}</b> 张。长方体有 6 个面，要选 6 张。`; } else if (st.dims) {
      const [a, b, c] = st.dims;
      msg.className = 'tip feedback fb-ok';
      msg.innerHTML = a === c ? `<span class="ok">✓ 能围成正方体</span>，棱长 ${a} cm。` : `<span class="ok">✓ 能围成长方体</span>：长 ${a} cm、宽 ${b} cm、高 ${c} cm。`;
    } else { msg.className = 'tip feedback fb-warn'; msg.innerHTML = '<span class="no">✗ 围不成。</span>相对的面要完全相同（每种 2 张），而且相邻的两张纸片，挨着的边要一样长。'; }
    v.update();
  };
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-d]');
    if (!b) return;
    const i = +b.dataset.i;
    counts[i] = Math.max(0, Math.min(6, counts[i] + +b.dataset.d));
    render();
  });
  render();
}

window.LESSON = {
  init() {
    initEx3();
    initNets11();
    initCuboid();
    initLabel();
    initNets4();
    initMatch();
    initCards();
  },
  onRender(slide) { VIEWS.forEach((v) => { if (slide.contains(v.svg)) v.update(); }); },
};
