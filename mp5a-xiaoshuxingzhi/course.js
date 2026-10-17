'use strict';
/* 五上 小数的性质 · 本课互动：0.3 与 0.30 方格图“叠一叠”、1 分米三种分法、添 0 / 去 0 实验台、点 0 化简游戏、0–1 数轴。
 * 方格与刻度按数值精确计算；全部用“千分之一”的整数计算，避免浮点误差。 */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const FILL = '#9fd3f2';
const EDGE = '#1d6fa5';
const decimals = (s) => (s.split('.')[1] || '').length;
const thousandths = (s) => { const [a, b = ''] = s.split('.'); return +a * 1000 + +(b + '000').slice(0, 3); };

/* 正方形方格图：d 位小数就分 10^d 份；v 为千分之几。涂色顺序：整列 → 列内整格 → 格内细条 */
function drawGrid(g, x0, y0, S, d, v, fill = FILL) {
  const c = S / 10;
  const cols = Math.floor(v / 100);
  const rows = Math.floor((v % 100) / 10);
  const sl = v % 10;
  const r = (x, y, w, h) => svgEl('rect', { x: x0 + x, y: y0 + y, width: w, height: h, fill }, g);
  if (cols) r(0, 0, cols * c, S);
  if (rows) r(cols * c, 0, c, rows * c);
  if (sl) r(cols * c, rows * c, (sl * c) / 10, c);
  let d1 = '';
  let d2 = '';
  let d3 = '';
  for (let k = 1; k < 10; k += 1) {
    d1 += `M${x0 + k * c} ${y0}V${y0 + S}`;
    if (d >= 2) d2 += `M${x0} ${y0 + k * c}H${x0 + S}`;
    if (d >= 3) for (let j = 0; j < 10; j += 1) d3 += `M${x0 + j * c + (k * c) / 10} ${y0}V${y0 + S}`;
  }
  if (d3) svgEl('path', { d: d3, stroke: '#9cc9ea', 'stroke-width': 0.7 }, g);
  svgEl('path', { d: d1, stroke: EDGE, 'stroke-width': 1.6 }, g);
  if (d2) svgEl('path', { d: d2, stroke: EDGE, 'stroke-width': 1.2 }, g);
  svgEl('rect', { x: x0, y: y0, width: S, height: S, fill: 'none', stroke: EDGE, 'stroke-width': 2.5 }, g);
}

/* 第 3 页：0.3（10 份涂 3 份）和 0.30（100 格涂 30 格），右边的平移过来叠在左边上 */
function initOverlay() {
  const svg = $('olFig');
  const S = 220;
  drawGrid(svgEl('g', {}, svg), 20, 10, S, 1, 300);
  svgEl('text', { x: 20 + S / 2, y: S + 46, class: 'ol-lb' }, svg).textContent = '0.3：10 份涂 3 份';
  const B = svgEl('g', { class: 'ol-move' }, svg);
  drawGrid(B, 300, 10, S, 2, 300, 'rgba(217,113,28,.45)');
  const lb = svgEl('text', { x: 300 + S / 2, y: S + 46, class: 'ol-lb o' }, svg);
  lb.textContent = '0.30：100 格涂 30 格';
  $('olGo').addEventListener('click', () => { B.classList.add('on'); lb.textContent = '叠在一起：完全重合'; });
  $('olBack').addEventListener('click', () => { B.classList.remove('on'); lb.textContent = '0.30：100 格涂 30 格'; });
}

/* 第 4 页：同一段 1 分米，分别看成 1 个分米、10 个厘米、100 个毫米 */
function initRuler() {
  const svg = $('rlFig');
  const [x0, L] = [190, 600];
  const rows = [
    { y: 18, n: 1, left: '0.1 米', right: '1 个 0.1 米' },
    { y: 88, n: 10, left: '0.10 米', right: '10 个 0.01 米' },
    { y: 158, n: 100, left: '0.100 米', right: '100 个 0.001 米' },
  ];
  rows.forEach(({ y, n, left, right }) => {
    svgEl('rect', { x: x0, y, width: L, height: 44, class: 'rl-bar' }, svg);
    for (let k = 0; k <= n; k += 1) {
      const x = x0 + (k * L) / n;
      const len = k === 0 || k === n ? 44 : n === 100 && k % 10 === 0 ? 30 : n === 100 && k % 5 === 0 ? 20 : n === 100 ? 12 : 28;
      svgEl('line', { x1: x, x2: x, y1: y, y2: y + len, class: 'rl-tk' }, svg);
    }
    svgEl('text', { x: x0 - 16, y: y + 31, class: 'rl-lb', 'text-anchor': 'end' }, svg).textContent = left;
    svgEl('text', { x: x0 + L + 16, y: y + 31, class: 'rl-lb o' }, svg).textContent = right;
  });
}

/* 第 5 页：添 0 / 去 0 实验台 */
function initLab() {
  const svg = $('lbFig');
  const st = { s: '0.3', base: '0.3' };
  const render = (msg, kind = '') => {
    svg.innerHTML = '';
    const d = decimals(st.s);
    const v = thousandths(st.s);
    drawGrid(svg, 10, 10, 400, d, v);
    $('lbNum').innerHTML = [...st.s].map((ch, i) => `<span class="${i >= st.base.length && ch === '0' && st.s.startsWith(st.base) ? 'new0' : ''}">${ch}</span>`).join('');
    const unit = 10 ** (3 - d);
    const cnt = v / unit;
    const den = 10 ** d;
    $('lbRead').innerHTML = `$${st.s}=\\dfrac{${cnt}}{${den}}$，也就是 <b>${cnt}</b> 个 <b>${(1 / den).toFixed(d)}</b>`;
    tex($('lbRead'));
    const m = $('lbMsg');
    m.className = `tip feedback ${kind}`;
    m.innerHTML = msg || '点右边的按钮，看看涂色部分会不会变。';
    tex(m);
  };
  const same = () => thousandths(st.s) === thousandths(st.base);
  const after = (verb) => (same()
    ? render(`${verb}：<b>${st.s} = ${st.base}</b>，涂色部分<b>一点没变</b>，只是格子分得更${verb.includes('添') ? '细' : '粗'}了。`, 'fb-ok')
    : render(`${verb}：<b>${st.s}</b> 和原来的 ${st.base} <b>不相等</b>，涂色部分变了！`, 'fb-warn'));
  $('lbPick').addEventListener('click', (e) => {
    const n = e.target.closest('[data-n]')?.dataset.n;
    if (!n) return;
    st.s = n; st.base = n;
    $('lbPick').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b.dataset.n === n));
    render();
  });
  document.querySelector('.lb-ops').addEventListener('click', (e) => {
    const op = e.target.closest('[data-op]')?.dataset.op;
    if (!op) return;
    const d = decimals(st.s);
    if (op === 'add') {
      if (d >= 3) { render('格子最多分到千分之一，这里不再添了（想一想：再添 0 会变吗？）'); return; }
      st.s += '0'; after('末尾添上 0');
    } else if (op === 'del') {
      if (!st.s.endsWith('0')) { render(`${st.s} 的末尾不是 0，没有 0 可以去。`); return; }
      st.s = st.s.slice(0, -1); after('末尾去掉 0');
    } else {
      if (d >= 3) { render('已经是三位小数了，换个数再试。'); return; }
      st.s = st.s.replace('.', '.0'); after('在小数点后面插入 0');
    }
  });
  render();
}

/* 第 7 页：点 0 游戏。只有小数部分末尾的 0 能去掉 */
const ZR_NUMS = ['2.80', '4.00', '1.80', '0.250', '703.050', '17.00', '0.060', '300', '60.0', '3.05'];
function initZero() {
  const st = ZR_NUMS.map((s) => ({ orig: s, s }));
  const list = $('zrList');
  const render = () => {
    list.innerHTML = st.map(({ orig, s }, k) => {
      const chars = [...s].map((ch, i) => (ch === '0' ? `<button type="button" class="z0" data-k="${k}" data-i="${i}">0</button>` : `<span>${ch}</span>`)).join('');
      const done = s !== orig ? ` <i class="eqs">= ${orig}</i>` : '';
      return `<div class="zr-item${s !== orig ? ' done' : ''}">${chars}${done}</div>`;
    }).join('');
  };
  const say = (h, ok) => { const m = $('zrMsg'); m.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`; m.innerHTML = h; };
  list.addEventListener('click', (e) => {
    const b = e.target.closest('.z0');
    if (!b) return;
    const k = +b.dataset.k;
    const i = +b.dataset.i;
    const { s } = st[k];
    const p = s.indexOf('.');
    if (p < 0 || i < p) {
      b.classList.add('shake');
      say(`这个 0 在<b>整数部分</b>，去掉它，${s} 就变成 ${s.slice(0, i) + s.slice(i + 1)} 了——大小变了，不能去。`, false);
      return;
    }
    if (/^0+$/.test(s.slice(i))) {
      let t = s.slice(0, i);
      if (t.endsWith('.')) t = t.slice(0, -1);
      st[k].s = t;
      render();
      say(`去掉小数<b>末尾</b>的 0：${s} = <b>${t}</b>，大小不变。`, true);
      return;
    }
    b.classList.add('shake');
    say(`这个 0 不在末尾，它在${['十分位', '百分位', '千分位'][i - p - 1]}上<b>占位</b>。去掉它，${s} 就变成 ${s.slice(0, i) + s.slice(i + 1)}，大小变了。`, false);
  });
  render();
}

/* 第 9 页：0–1 数轴，100 小格；上面标两位小数、下面标一位小数（课本 p39 练一练 1） */
function initPair() {
  const b = NumLine.board($('pairBoard'), { from: 0, to: 1, pad: 0.06, w: 960, h: 160, y: [-0.8, 1] });
  const lab = (v) => (v === 0 ? '0' : Math.abs(v - 1) < 1e-9 ? '1' : v < 0.25 ? v.toFixed(1) : '?');
  NumLine.axis(b, { from: 0, to: 1, step: 0.1, minor: 0.01, tick: 0.12, tail: 0.04, lead: 0.03, label: lab });
  [0.1, 0.2].forEach((v) => b.text([v, 0], v.toFixed(2), { cls: 'nl-or', dy: -22 }));
  for (let k = 3; k <= 9; k += 1) b.text([k / 10, 0], '?', { cls: 'nl-or', dy: -22 });
  [0.3, 0.6, 0.9].forEach((v) => b.pt([v, 0], { cls: 'c3', r: 6 }));
}

/* 指定写法的空（data-exact）：数值对、但位数不合要求也判错 */
function initExact() {
  const norm = (x) => x.trim().replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0)).replace(/[．。]/g, '.');
  document.querySelectorAll('.blank[data-exact]').forEach((el) => {
    const inp = el.querySelector('input');
    const check = () => {
      if (!el.classList.contains('ok')) return;
      if (!el.dataset.ans.split('|').includes(norm(inp.value))) el.classList.replace('ok', 'no');
    };
    inp.addEventListener('change', check);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
  });
}

window.LESSON = {
  init() {
    initOverlay();
    initRuler();
    initLab();
    initZero();
    initPair();
    initExact();
  },
};
