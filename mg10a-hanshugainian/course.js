'use strict';
/* 高一上 5.1 函数的概念和图象 · 本课互动：气温图、箭头图、连线判函数、空心点图象、例 3 值域图、竖直线检验。通用部分见 ../shared/math.js */
const { board, tex } = MathKit;
const $ = (id) => document.getElementById(id);

/* 第 4 页：气温变化示意（依课本图 5-1-1 的走势描点，Catmull-Rom 样条连成光滑曲线） */
const TEMP_PTS = [[0, -1], [2, -1.8], [4, -2], [6, -1.2], [8, 1], [10, 4], [12, 7.3], [14, 9], [15, 7.9], [16, 7.6], [18, 7.4], [20, 4.2], [22, 0], [24, -1.4]];
function tempAt(t) {
  const n = TEMP_PTS.length;
  const after = TEMP_PTS.findIndex(([x]) => x > t);
  const i = Math.max(0, Math.min(n - 2, (after < 0 ? n : after) - 1));
  const y = (k) => TEMP_PTS[Math.max(0, Math.min(n - 1, k))][1];
  const u = (t - TEMP_PTS[i][0]) / (TEMP_PTS[i + 1][0] - TEMP_PTS[i][0]);
  const [p0, p1, p2, p3] = [y(i - 1), y(i), y(i + 1), y(i + 2)];
  return 0.5 * (2 * p1 + (p2 - p0) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (3 * p1 - p0 - 3 * p2 + p3) * u * u * u);
}
function initTemp() {
  const b = board($('temp'), { x: [-1.5, 28], y: [-3.5, 11], w: 560, h: 300, ticks: [4, 2], labels: ['t/h', 'θ/℃'] });
  b.fn(tempAt, { from: 0, to: 24 });
  b.update();
}

/* 第 5 页：箭头图（图 5-1-2） */
const POP = [[1979, 975], [1984, '1 044'], [1989, '1 127'], [1994, '1 199'], [1999, '1 258'], [2004, '1 300'], [2009, '1 335'], [2014, '1 368']];
function initArrows() {
  const ROW_H = 34;
  const TOP = 48;
  document.querySelector('.arrow-fig .rows').innerHTML = POP.map(([y, p], i) => {
    const cy = TOP + i * ROW_H;
    return `<text x="80" y="${cy + 6}" class="fl s c">${y}</text><text x="280" y="${cy + 6}" class="fl s c">${p}</text>`
      + `<g data-step="5"><line class="draw" pathLength="1" x1="112" y1="${cy}" x2="236" y2="${cy}" stroke="#1d6fa5" stroke-width="2.2" style="transition-delay:${i * 0.12}s"/><path d="M236 ${cy - 5} l10 5 l-10 5z" fill="#1d6fa5"/></g>`;
  }).join('');
}

/* 第 7 页：连线判断是不是函数 */
const SCORES = { 1: 80, 2: 75, 3: 79, 4: 80, 5: 98, 6: 80 };
const MAPS = {
  fwd: { A: [1, 2, 3, 4, 5, 6], B: [75, 79, 80, 98], la: '学号', lb: '成绩', fill: () => Object.entries(SCORES).map(([k, v]) => `${k}|${v}`) },
  back: { A: [75, 79, 80, 98], B: [1, 2, 3, 4, 5, 6], la: '成绩', lb: '学号', fill: () => Object.entries(SCORES).map(([k, v]) => `${v}|${k}`) },
};

function judge(map, links) {
  const outs = (a) => [...links].filter((l) => l.split('|')[0] === String(a));
  const miss = map.A.filter((a) => outs(a).length === 0);
  const multi = map.A.filter((a) => outs(a).length > 1);
  if (links.size === 0) return { cls: '', html: `从左边“${map.la}”拖一条线到右边“${map.lb}”。`, miss: [], multi: [] };
  if (multi.length) return { cls: 'warn', html: `<b>不是函数：</b>${multi.join('、')} 对应了不止一个值——违反“<b>唯一</b>”。`, miss, multi };
  if (miss.length) return { cls: 'warn', html: `<b>还不是函数：</b>${miss.join('、')} 没有对应的值——违反“<b>每一个</b>”。`, miss, multi };
  const used = new Set([...links].map((l) => l.split('|')[1]));
  const unused = map.B.filter((v) => !used.has(String(v)));
  const ys = map.B.filter((v) => used.has(String(v)));
  const manyToOne = used.size < links.size;
  return {
    cls: 'ok',
    html: `<b>✓ 是函数。</b>${manyToOne ? '几个输入对应同一个输出，可以。' : ''}`
      + `${unused.length ? `${unused.join('、')} 没被对应也没关系：` : ''}值域 $\\{${ys.join(',')}\\}\\subseteq B$。`,
    miss: [],
    multi: [],
  };
}

function initMapper() {
  const box = $('mapper');
  const svg = $('mpLines');
  const st = { key: 'fwd', links: new Set(), sel: null, drag: null };
  const node = (side, v) => box.querySelector(`.mp-${side}[data-v="${v}"]`);
  const center = (el, side) => {
    const r = el.getBoundingClientRect();
    const o = box.getBoundingClientRect();
    return [side === 'a' ? r.right - o.left : r.left - o.left, r.top + r.height / 2 - o.top];
  };
  const draw = () => {
    const o = box.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${o.width} ${o.height}`);
    const lines = [...st.links].map((l) => {
      const [a, bv] = l.split('|');
      const [x1, y1] = center(node('a', a), 'a');
      const [x2, y2] = center(node('b', bv), 'b');
      return `<g class="mp-link" data-l="${l}"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="hit"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="ln" marker-end="url(#mpArrow)"/></g>`;
    });
    const temp = st.drag ? `<line x1="${st.drag.x1}" y1="${st.drag.y1}" x2="${st.drag.x2}" y2="${st.drag.y2}" class="ln temp"/>` : '';
    svg.innerHTML = '<defs><marker id="mpArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#1d6fa5"/></marker></defs>' + lines.join('') + temp;
  };
  const refresh = () => {
    const map = MAPS[st.key];
    const v = judge(map, st.links);
    box.querySelectorAll('.mp-a').forEach((n) => {
      n.classList.toggle('miss', v.miss.includes(+n.dataset.v) && st.links.size > 0);
      n.classList.toggle('multi', v.multi.includes(+n.dataset.v));
      n.classList.toggle('sel', st.sel === n.dataset.v);
    });
    const msg = $('mpMsg');
    msg.className = `tip feedback ${v.cls ? `fb-${v.cls}` : ''}`;
    msg.innerHTML = v.html;
    tex(msg);
    draw();
  };
  const toggle = (a, bv) => {
    const l = `${a}|${bv}`;
    if (st.links.has(l)) st.links.delete(l); else st.links.add(l);
  };
  const build = (key) => {
    st.key = key; st.links = new Set(); st.sel = null;
    const map = MAPS[key];
    $('mpA').innerHTML = `<h4>${map.la}</h4>` + map.A.map((v) => `<button type="button" class="mp-a" data-v="${v}">${v}</button>`).join('');
    $('mpB').innerHTML = `<h4>${map.lb}</h4>` + map.B.map((v) => `<button type="button" class="mp-b" data-v="${v}">${v}</button>`).join('');
    document.querySelectorAll('[data-map]').forEach((btn) => btn.classList.toggle('solid', btn.dataset.map === key));
    refresh();
  };

  // 拖线：在左边按下 → 拖到右边松开；没拖动则视为“选中”，再点右边连线
  box.addEventListener('pointerdown', (e) => {
    const a = e.target.closest('.mp-a');
    if (!a) return;
    e.preventDefault();
    const [x1, y1] = center(a, 'a');
    st.drag = { a: a.dataset.v, x1, y1, x2: x1, y2: y1, moved: false };
    box.setPointerCapture(e.pointerId);
  });
  box.addEventListener('pointermove', (e) => {
    if (!st.drag) return;
    const o = box.getBoundingClientRect();
    st.drag.x2 = e.clientX - o.left; st.drag.y2 = e.clientY - o.top;
    st.drag.moved = st.drag.moved || Math.hypot(st.drag.x2 - st.drag.x1, st.drag.y2 - st.drag.y1) > 12;
    draw();
  });
  box.addEventListener('pointerup', (e) => {
    const d = st.drag;
    st.drag = null;
    if (d) {
      const b = document.elementFromPoint(e.clientX, e.clientY)?.closest('.mp-b');
      if (b && d.moved) { toggle(d.a, b.dataset.v); st.sel = null; } else if (!d.moved) st.sel = st.sel === d.a ? null : d.a;
      refresh();
      return;
    }
    const b = e.target.closest('.mp-b');
    if (b && st.sel) { toggle(st.sel, b.dataset.v); st.sel = null; refresh(); return; }
    const link = e.target.closest('.mp-link');
    if (link) { st.links.delete(link.dataset.l); refresh(); }
  });
  document.querySelectorAll('[data-map]').forEach((btn) => btn.addEventListener('click', () => build(btn.dataset.map)));
  $('mpFill').addEventListener('click', () => { st.links = new Set(MAPS[st.key].fill()); st.sel = null; refresh(); });
  $('mpClear').addEventListener('click', () => { st.links = new Set(); st.sel = null; refresh(); });
  window.addEventListener('resize', draw);
  build('fwd');
  return draw;
}

/* 第 9 页：y = x²/x 的图象，原点处空心 */
function initHole() {
  const b = board($('hole'), { x: [-3, 3], y: [-3, 3], w: 400 });
  b.fn((x) => (x === 0 ? NaN : (x * x) / x));
  b.pt([0, 0], { hollow: true, r: 7 });
  b.update();
}

/* 第 11 页：例 3 的两个值域 */
function initRange() {
  const f = (x) => (x - 1) ** 2 + 1;
  const b = board($('range'), { x: [-2.5, 4.5], y: [-0.8, 6.5], w: 460 });
  b.fn(f);
  b.seg([[-2.5, 1], [4.5, 1]], { cls: 'dash' });
  [-1, 0, 1, 2, 3].forEach((x) => b.pt([x, f(x)], { cls: 'c2', r: 8 }));
  b.update();
}

/* 第 12 页：竖直线检验 */
const VT_CURVES = [
  { key: 'para', label: '$y=x^2+1$', isFn: true, hits: (a) => [a * a + 1] },
  { key: 'seg', label: '$y=(x-1)^2+1,\\ x\\in[1,3)$', isFn: true, hits: (a) => (a >= 1 && a < 3 ? [(a - 1) ** 2 + 1] : []) },
  { key: 'circ', label: '圆 $x^2+y^2=4$', isFn: false, hits: (a) => (Math.abs(a) < 2 ? [Math.sqrt(4 - a * a), -Math.sqrt(4 - a * a)] : Math.abs(a) === 2 ? [0] : []) },
  { key: 'sq', label: '$y^2=x$', isFn: false, hits: (a) => (a > 0 ? [Math.sqrt(a), -Math.sqrt(a)] : a === 0 ? [0] : []) },
];
function initVertical() {
  const Y0 = -2.6;
  const s = { a: 0.6, cur: VT_CURVES[0] };
  const b = board($('vt'), { x: [-3, 4], y: [Y0, 6], w: 600 });
  const nodes = {
    para: [b.fn((x) => x * x + 1)],
    seg: [b.fn((x) => (x - 1) ** 2 + 1, { from: 1, to: 3 }), b.pt([1, 1], { r: 7 }), b.pt([3, 5], { hollow: true, r: 7 })],
    circ: [b.curve((t) => [2 * Math.cos(t), 2 * Math.sin(t)], 0, 2 * Math.PI)],
    sq: [b.curve((t) => [t * t, t], -2.4, 2.4)],
  };
  b.seg(() => [[s.a, Y0], [s.a, 6]], { cls: 'c2' });
  const hit = (k) => () => { const h = s.cur.hits(s.a); return h[k] === undefined ? null : [s.a, h[k]]; };
  b.pt(hit(0), { cls: 'c2', r: 9 });
  b.pt(hit(1), { cls: 'c2', r: 9 });
  b.drag(() => [s.a, Y0 + 0.4], (x) => { s.a = Math.round(Math.min(3.8, Math.max(-2.8, x)) * 20) / 20; });
  b.onUpdate = () => {
    Object.entries(nodes).forEach(([k, ns]) => ns.forEach((n) => { n.style.display = k === s.cur.key ? '' : 'none'; }));
    const n = s.cur.hits(s.a).length;
    const msg = $('vtMsg');
    msg.className = `tip feedback ${s.cur.isFn ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = `$x=${s.a}$ 时有 <b>${n}</b> 个公共点。` + (s.cur.isFn ? '这是函数的图象：竖线与它至多一个公共点。' : '这<b>不是</b>函数的图象：有竖线与它交于两点，一个 $x$ 对应两个 $y$。');
    tex(msg);
  };
  $('vtBtns').innerHTML = VT_CURVES.map((c, i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-k="${c.key}">${c.label}</button>`).join('');
  tex($('vtBtns'));
  $('vtBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    s.cur = VT_CURVES.find((c) => c.key === btn.dataset.k);
    $('vtBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
  b.update();
}

let redrawMapper = () => {};
window.LESSON = {
  init() {
    initTemp();
    initArrows();
    redrawMapper = initMapper();
    initHole();
    initRange();
    initVertical();
  },
  // 连线按元素实际位置画，翻到这一页时重新量一次
  onRender(slide) {
    if (!slide.contains($('mapper'))) return;
    requestAnimationFrame(redrawMapper);
    setTimeout(redrawMapper, 750); // 等翻页转场（缩放）结束再量一次
  },
};
