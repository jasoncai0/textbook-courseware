'use strict';
/* 五上 钉子板上的多边形 · 本课互动：课本四个图形（点击亮出边上的钉子）、可围的钉子板（边上钉子数用最大公因数精确算，
 * 面积用坐标算，内部钉子逐个判断）。所有钉子坐标照课本，数据已用坐标核对。 */
const { tex, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};

/* ---------- 几何（格点坐标，列 c、行 r） ---------- */
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const edges = (P) => P.map((p, i) => [p, P[(i + 1) % P.length]]);
const area = (P) => Math.abs(edges(P).reduce((s, [[x1, y1], [x2, y2]]) => s + x1 * y2 - x2 * y1, 0)) / 2;
const boundaryN = (P) => edges(P).reduce((s, [[x1, y1], [x2, y2]]) => s + gcd(Math.abs(x2 - x1), Math.abs(y2 - y1)), 0);
const cross = ([ax, ay], [bx, by], [cx, cy]) => (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
const onSeg = (p, a, b) => cross(a, b, p) === 0
  && Math.min(a[0], b[0]) <= p[0] && p[0] <= Math.max(a[0], b[0]) && Math.min(a[1], b[1]) <= p[1] && p[1] <= Math.max(a[1], b[1]);
const onBoundary = (p, P) => edges(P).some(([a, b]) => onSeg(p, a, b));
const inside = ([x, y], P) => edges(P).reduce((inn, [[x1, y1], [x2, y2]]) => (
  (y1 > y) !== (y2 > y) && x < x1 + ((y - y1) * (x2 - x1)) / (y2 - y1) ? !inn : inn), false);
const segHit = (a, b, c, d) => {
  const [d1, d2, d3, d4] = [cross(c, d, a), cross(c, d, b), cross(a, b, c), cross(a, b, d)];
  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) return true;
  return onSeg(a, c, d) || onSeg(b, c, d) || onSeg(c, a, b) || onSeg(d, a, b);
};
// 不相邻的两条边相交（含接触）就不是简单多边形
const isSimple = (P) => {
  const E = edges(P);
  return E.every((e, i) => E.every((f, j) => {
    if (j <= i) return true;
    if (j === i + 1 || (i === 0 && j === E.length - 1)) {
      // 相邻边只能共用一个端点，不能折回重叠
      const shared = j === i + 1 ? e[1] : e[0];
      const [p, q] = [e[0] === shared ? e[1] : e[0], f[0] === shared ? f[1] : f[0]];
      return !(cross(shared, p, q) === 0 && (p[0] - shared[0]) * (q[0] - shared[0]) + (p[1] - shared[1]) * (q[1] - shared[1]) > 0);
    }
    return !segHit(e[0], e[1], f[0], f[1]);
  }));
};
const nailsOf = (P, cols, rows) => {
  const on = [];
  const inn = [];
  for (let c = 0; c < cols; c += 1) for (let r = 0; r < rows; r += 1) {
    const p = [c, r];
    if (onBoundary(p, P)) on.push(p); else if (inside(p, P)) inn.push(p);
  }
  return { on, inn };
};

/* ---------- 画钉子板 ---------- */
function drawBoard(svg, { cols, rows, sp, ox, oy }, shapes) {
  svg.innerHTML = '';
  const X = (c) => ox + c * sp;
  const Y = (r) => oy + r * sp;
  shapes.forEach(({ pts, hi, label, open }) => {
    const d = pts.map(([c, r]) => `${X(c)},${Y(r)}`).join(' ');
    svgEl(open ? 'polyline' : 'polygon', { points: d, class: `band${hi ? ' hi' : ''}${open ? ' open' : ''}` }, svg);
    if (label) {
      const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
      svgEl('text', { x: X(cx), y: Y(rows - 1) + sp * 0.62, class: 'nlb' }, svg).textContent = label;
    }
  });
  const lit = new Map();
  shapes.filter((s) => s.hi && !s.open).forEach(({ pts }) => {
    const { on, inn } = nailsOf(pts, cols, rows);
    on.forEach((p) => lit.set(p.join(), 'o'));
    inn.forEach((p) => lit.set(p.join(), 'g'));
  });
  for (let c = 0; c < cols; c += 1) for (let r = 0; r < rows; r += 1) {
    const k = lit.get(`${c},${r}`);
    svgEl('circle', { cx: X(c), cy: Y(r), r: k ? 6.5 : 4, class: `nail-pt${k ? ` ${k}` : ''}` }, svg);
  }
  return { X, Y };
}

/* 第 3 页：课本图形① */
function initDemo() {
  drawBoard($('demo'), { cols: 5, rows: 4, sp: 50, ox: 50, oy: 45 }, [{ pts: [[1, 3], [3, 3], [2, 1]], hi: true }]);
}

/* 第 4 页：课本 p108 四个图形（16 列 × 5 行，照课本位置） */
const FOUR = [
  { pts: [[1, 3], [3, 3], [2, 1]], label: '①' },
  { pts: [[4, 1], [5, 1], [6, 3], [4, 3]], label: '②' },
  { pts: [[7, 1], [8, 1], [9, 2], [9, 3], [7, 3]], label: '③' },
  { pts: [[10, 3], [12, 1], [14, 1], [12, 3]], label: '④' },
];
function initFour() {
  const svg = $('four');
  const G = { cols: 16, rows: 5, sp: 40, ox: 20, oy: 20 };
  let on = -1;
  const draw = () => drawBoard(svg, G, FOUR.map((s, i) => ({ ...s, hi: i === on })));
  svg.addEventListener('click', (e) => {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const { x } = pt.matrixTransform(svg.getScreenCTM().inverse());
    const c = (x - G.ox) / G.sp;
    const idx = FOUR.findIndex(({ pts }) => c >= Math.min(...pts.map((p) => p[0])) - 0.5 && c <= Math.max(...pts.map((p) => p[0])) + 0.5);
    on = idx === on ? -1 : idx;
    draw();
  });
  draw();
}

/* 第 7 页：内部有 2 枚钉子的三个示例（16 列 × 4 行） */
const TWO = [
  { pts: [[1, 3], [4, 3], [4, 1], [1, 1]], label: '①' },
  { pts: [[6, 3], [8, 3], [7, 0]], label: '②' },
  { pts: [[10, 3], [13, 3], [13, 2], [11, 1], [10, 1]], label: '③' },
];
function initTwo() {
  drawBoard($('two'), { cols: 16, rows: 4, sp: 36, ox: 50, oy: 18 }, TWO.map((s) => ({ ...s, hi: true })));
}

/* 第 6、8 页：可以围的钉子板 */
const GEO = { cols: 9, rows: 7, sp: 40, ox: 30, oy: 30 };
function makeGeo(svgId, msgId, onRecord) {
  const svg = $(svgId);
  const st = { pts: [], closed: false };
  const msg = (html, cls = '') => { const m = $(msgId); m.className = `tip feedback ${cls}`; m.innerHTML = html; tex(m); };
  const result = () => {
    const P = st.pts;
    if (!isSimple(P)) return { bad: '有边交叉或重叠了，这不是一个多边形。' };
    const S = area(P);
    if (!S) return { bad: '面积是 0，围不成多边形。' };
    const { inn } = nailsOf(P, GEO.cols, GEO.rows);
    return { S, n: boundaryN(P), i: inn.length };
  };
  const draw = () => {
    const shapes = st.pts.length ? [{ pts: st.pts, hi: st.closed && !result().bad, open: !st.closed }] : [];
    const { X, Y } = drawBoard(svg, GEO, shapes);
    st.pts.forEach(([c, r], k) => svgEl('circle', { cx: X(c), cy: Y(r), r: k === 0 ? 9 : 7, class: `vtx${k === 0 ? ' first' : ''}` }, svg));
    for (let c = 0; c < GEO.cols; c += 1) for (let r = 0; r < GEO.rows; r += 1) {
      svgEl('circle', { cx: X(c), cy: Y(r), r: 16, class: 'hit', 'data-c': c, 'data-r': r }, svg);
    }
  };
  const report = () => {
    const R = result();
    if (R.bad) { msg(`<b>✗</b> ${R.bad}点“撤销”改一改。`, 'fb-warn'); return; }
    msg(`围好了！图形内 <b>${R.i}</b> 枚钉子，边上 $n=$ <b>${R.n}</b> 枚，面积 $S=$ <b>${fmt(R.S)}</b> 平方厘米；$n\\div2=${fmt(R.n / 2)}$，面积比它${R.S >= R.n / 2 ? '多' : '少'} <b>${fmt(Math.abs(R.S - R.n / 2))}</b>。`, 'fb-ok');
  };
  svg.addEventListener('click', (e) => {
    const h = e.target.closest('.hit');
    if (!h) return;
    const p = [+h.dataset.c, +h.dataset.r];
    if (st.closed) { msg('已经围好了。点“清空”再围一个。'); return; }
    const k = st.pts.findIndex((q) => q[0] === p[0] && q[1] === p[1]);
    if (k === 0 && st.pts.length >= 3) { st.closed = true; draw(); report(); return; }
    if (k >= 0) { msg('这枚钉子已经是顶点了。要围好，请点回<b>第一个顶点</b>。'); return; }
    st.pts = [...st.pts, p];
    draw();
    msg(`已经点了 ${st.pts.length} 个顶点。${st.pts.length >= 3 ? '点回第一个顶点（大圆点）就围好了。' : ''}`);
  });
  svg.parentElement.querySelector('.btns').addEventListener('click', (e) => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'undo') { if (st.closed) st.closed = false; else st.pts = st.pts.slice(0, -1); draw(); msg(`已经点了 ${st.pts.length} 个顶点。`); }
    if (act === 'clear') { st.pts = []; st.closed = false; draw(); msg('点钉子开始围。'); }
    if (act === 'rec' && onRecord) {
      const R = st.closed ? result() : { bad: '先把图形围好。' };
      if (R.bad) { msg(R.bad, 'fb-warn'); return; }
      onRecord(R);
      msg('已记入表格。点“清空”再围一个。', 'fb-ok');
    }
  });
  draw();
  msg('点钉子开始围。');
}

function initGeo() {
  const tab = $('geo1Tab');
  makeGeo('geo1', 'geo1Msg', ({ i, n, S }) => {
    const tr = document.createElement('tr');
    tr.className = i === 1 ? 'i1' : '';
    tr.innerHTML = `<td>${i}</td><td>${n}</td><td>${fmt(S)}</td><td>${fmt(n / 2)}</td>`;
    tab.appendChild(tr);
  });
  makeGeo('geo2', 'geo2Msg');
}

window.LESSON = {
  init() {
    initDemo();
    initFour();
    initTwo();
    initGeo();
  },
};
