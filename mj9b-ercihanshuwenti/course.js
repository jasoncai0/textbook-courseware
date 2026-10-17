'use strict';
/* 九下 5.5 用二次函数解决问题 · 本课互动：问题 1 收益试算、练习售价滑块、问题 3 拱桥“换原点 + 水位”（核心）、
 * 图 5-12、小船能否通过、赵州桥等比例图、护栏立柱示意。所有图形按题给尺寸精确计算。 */
const { board, fmt, tex, slider } = MathKit;
const $ = (id) => document.getElementById(id);
const boards = [];
const keep = (b) => { boards.push(b); return b; };
const tx = (v, d = 2) => fmt(v, d).replace('-', '−');
const money = (v) => Math.round(v).toLocaleString('en-US').replace(/,/g, ' ');

/* ---------- 第 3 页：问题 1 收益试算 ---------- */
function initRice() {
  const st = { x: 50 };
  const Y = (x) => 440 * 360 + (440 - 2 * x) * x;
  const b = keep(board($('riceBoard'), { x: [-14, 236], y: [14.75, 18.75], w: 560, h: 320, ticks: [20, 0.5], labels: ['x/亩', 'y/万元'] }));
  b.fn((x) => Y(x) / 1e4, { from: 0, to: 220, cls: 'c1' });
  b.seg(() => [[st.x, 14.75], [st.x, Y(st.x) / 1e4]], { cls: 'dash' });
  b.pt(() => [st.x, Y(st.x) / 1e4], { r: 7, cls: 'c2' });
  b.onUpdate = () => {
    const x = st.x;
    const per = 440 - 2 * x;
    $('riceXV').textContent = x;
    $('riceRead').innerHTML = `<span>原 360 亩</span><span>$440\\times360$</span><b class="v">${money(158400)} 元</b>`
      + `<span>新稻田每亩</span><span>$440-2\\times${x}$</span><b class="v">${per} 元</b>`
      + `<span>新稻田共</span><span>$${per}\\times${x}$</span><b class="v">${money(per * x)} 元</b>`
      + `<span>总收益 $y$</span><span></span><b class="v tot">${money(Y(x))} 元</b>`;
    tex($('riceRead'));
  };
  slider($('riceX'), (v) => { st.x = v; b.update(); });
}

/* ---------- 第 6 页：练习 售价 ---------- */
function initShop() {
  const st = { x: 50 };
  const Y = (x) => (x - 42) * (204 - 3 * x);
  const b = keep(board($('shopBoard'), { x: [37, 71], y: [-70, 600], w: 520, h: 330, ticks: [5, 100], labels: ['x/元', 'y/元'] }));
  b.fn(Y, { from: 42, to: 68, cls: 'c1' });
  b.seg([[55, 0], [55, 507]], { cls: 'axis-r' });
  b.seg(() => [[st.x, 0], [st.x, Y(st.x)]], { cls: 'dash' });
  b.pt(() => [st.x, Y(st.x)], { r: 7, cls: 'c2' });
  b.onUpdate = () => {
    $('shopXV').textContent = st.x;
    const m = $('shopMsg');
    const best = st.x === 55;
    m.className = `tip feedback ${best ? 'fb-ok' : ''}`;
    m.innerHTML = `售价 ${st.x} 元：每件赚 ${st.x - 42} 元，每天卖 ${204 - 3 * st.x} 件，毛利润 $y=${Y(st.x)}$ 元${best ? '——最大！' : '。'}`;
    tex(m);
  };
  slider($('shopX'), (v) => { st.x = v; b.update(); });
}

/* ---------- 第 7 页：拱桥 换原点 + 水位（核心） ---------- */
const ORIG = [
  { key: 'top', t: '原点在拱顶', d: [0, 0], f: 'y=-\\dfrac13x^2' },
  { key: 'mid', t: '原点在水面中点', d: [0, 3], f: 'y=-\\dfrac13x^2+3' },
  { key: 'B', t: '原点在水面左端 B', d: [3, 3], f: 'y=-\\dfrac13(x-3)^2+3' },
];
const ARCH = (X) => -(X * X) / 3; // 以拱顶为原点的“物理”坐标
function drawRiver(b, level) {
  b.poly(() => [[-4.8, level()], [4.8, level()], [4.8, -4.6], [-4.8, -4.6]], { cls: 'water' });
  b.poly([[-4.8, -3], [-3.3, -3], [-3.3, -4.6], [-4.8, -4.6]], { cls: 'bank' });
  b.poly([[4.8, -3], [3.3, -3], [3.3, -4.6], [4.8, -4.6]], { cls: 'bank' });
  b.fn(ARCH, { from: -3.3, to: 3.3, cls: 'arch' });
}
function initArch() {
  const st = { o: ORIG[0], h: 1 };
  const level = () => -3 + st.h;
  const half = () => Math.sqrt(3 * (3 - st.h));
  const b = keep(board($('archBoard'), { x: [-4.8, 4.8], y: [-4.6, 1.8], axes: false, ticks: [1, 1], w: 600 }));
  drawRiver(b, level);
  b.seg(() => [[-half(), level()], [half(), level()]], { cls: 'wline' });
  // 可移动的坐标轴
  const O = () => [-st.o.d[0], -st.o.d[1]];
  const ax = b.seg(() => [[-4.7, O()[1]], [4.7, O()[1]]], { cls: 'axl' });
  const ay = b.seg(() => [[O()[0], -4.5], [O()[0], 1.7]], { cls: 'axl' });
  const NS = 'http://www.w3.org/2000/svg';
  const m = document.createElementNS(NS, 'marker');
  [['id', 'archArrow'], ['viewBox', '0 0 10 10'], ['refX', '9'], ['refY', '5'], ['markerWidth', '8'], ['markerHeight', '8'], ['orient', 'auto']].forEach(([k, v]) => m.setAttribute(k, v));
  m.innerHTML = '<path d="M0 0 L10 5 L0 10 z" fill="#1f2d3a"/>';
  b.svg.querySelector('defs').appendChild(m);
  [ax, ay].forEach((l) => l.setAttribute('marker-end', 'url(#archArrow)'));
  b.pt(O, { r: 5 });
  b.text(O, 'O', { cls: 'lb', dx: -18, dy: -6 });
  b.text(() => [4.7, O()[1]], 'x', { cls: 'lb', dx: -14, dy: 22 });
  b.text(() => [O()[0], 1.7], 'y', { cls: 'lb', dx: 8, dy: 18 });
  const loc = (X, Y) => `(${tx(X + st.o.d[0])}, ${tx(Y + st.o.d[1])})`;
  [[3, -3, 'A', 6, 22], [-3, -3, 'B', -70, 22]].forEach(([X, Y, n, dx, dy]) => {
    b.pt([X, Y], { r: 5 });
    b.text([X, Y], () => `${n}${loc(X, Y)}`, { cls: 'lb up', dx, dy });
  });
  b.pt(() => [half(), level()], { r: 6, cls: 'c2' });
  b.pt(() => [-half(), level()], { r: 6, cls: 'c2' });
  b.text(() => [half(), level()], () => `C${loc(half(), level())}`, { cls: 'lb up', dx: 8, dy: -8 });
  b.text(() => [-half(), level()], () => `D${loc(-half(), level())}`, { cls: 'lb up end', dx: -8, dy: -8 });
  b.onUpdate = () => {
    $('archHV').textContent = fmt(st.h, 1);
    $('archF').innerHTML = `桥拱：$${st.o.f}$`;
    const w = 2 * half();
    const msg = $('archMsg');
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = `水位上升 ${fmt(st.h, 1)} m：水面宽 $CD=2\\sqrt{3\\times(3-${fmt(st.h, 1)})}\\approx${fmt(w, 2)}$ m${Math.abs(st.h - 1) < 1e-9 ? '，即 $2\\sqrt6\\approx4.9$ m。' : '。'}（换原点，宽度不变）`;
    tex($('archF')); tex(msg);
  };
  $('archO').innerHTML = ORIG.map((o, i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-k="${o.key}">${o.t}</button>`).join('');
  $('archO').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    st.o = ORIG.find((o) => o.key === btn.dataset.k);
    $('archO').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
  slider($('archH'), (v) => { st.h = v; b.update(); });
}

/* ---------- 第 8 页：图 5-12 ---------- */
function initF512() {
  const b = keep(board($('f512Board'), { x: [-4.6, 4.6], y: [-3.9, 1.3], w: 560, ticks: [1, 1] }));
  b.fn(ARCH, { from: -3.3, to: 3.3, cls: 'c1' });
  b.seg([[-3, -3], [3, -3]], { cls: 'thin' });
  const r6 = Math.sqrt(6);
  b.seg([[-r6, -2], [r6, -2]], { cls: 'c2' });
  [[3, -3, 'A(3, −3)', 8, 22], [-3, -3, 'B', -22, 22], [r6, -2, 'C(√6, −2)', 10, -8], [-r6, -2, 'D', -24, -8]].forEach(([x, y, t, dx, dy]) => {
    b.pt([x, y], { r: 5, cls: t.startsWith('C') || t === 'D' ? 'c2' : '' });
    b.text([x, y], t, { cls: 'lb up', dx, dy });
  });
}

/* ---------- 第 9 页：小船 ---------- */
function initBoat() {
  const st = { h: 1 };
  const level = () => -3 + st.h;
  const ok = () => level() + 0.5 <= ARCH(2) + 1e-9;
  const b = keep(board($('boatBoard'), { x: [-4.8, 4.8], y: [-4.6, 1.8], ticks: [1, 1], w: 600 }));
  drawRiver(b, level);
  const hull = b.poly(() => [[-2.3, level() + 0.5], [2.3, level() + 0.5], [1.8, level() - 0.35], [-1.8, level() - 0.35]], { cls: 'hull' });
  const cargo = b.poly(() => [[-2, level() + 0.5], [2, level() + 0.5], [2, level()], [-2, level()]], { cls: 'cargo' });
  b.seg([[2, ARCH(2)], [2, -4.6]], { cls: 'dash' });
  b.seg([[-2, ARCH(2)], [-2, -4.6]], { cls: 'dash' });
  b.pt([2, ARCH(2)], { r: 5 });
  b.text([2, ARCH(2)], '(2, −4/3)', { cls: 'lb up', dx: 8, dy: -6 });
  b.onUpdate = () => {
    $('boatHV').textContent = fmt(st.h, 1);
    const pass = ok();
    [hull, cargo].forEach((e) => e.classList.toggle('bad', !pass));
    const gap = ARCH(2) - level();
    const m = $('boatMsg');
    m.className = `tip feedback ${pass ? 'fb-ok' : 'fb-warn'}`;
    m.innerHTML = `水位上升 ${fmt(st.h, 1)} m：$x=\\pm2$ 处桥拱离水面 $-\\dfrac43-(${tx(level(), 1)})\\approx${fmt(gap, 2)}$ m，${pass ? `比 0.5 m 高，<b>能通过</b>。` : `不到 0.5 m，<b>不能通过</b>。`}`;
    tex(m);
  };
  slider($('boatH'), (v) => { st.h = v; b.update(); });
}

/* ---------- 第 10 页：赵州桥（等比例） ---------- */
function initZZ() {
  const a = -7.23 / (18.51 * 18.51);
  const b = keep(board($('zzBoard'), { x: [-21, 21], y: [-9.5, 3], w: 620, ticks: [5, 5] }));
  b.fn((x) => a * x * x, { from: -18.51, to: 18.51, cls: 'c1' });
  b.seg([[-18.51, -7.23], [18.51, -7.23]], { cls: 'thin' });
  b.seg([[0, 0], [0, -7.23]], { cls: 'dash' });
  [[-18.51, -7.23, 'A', -18, 20], [18.51, -7.23, 'B(18.51, −7.23)', -120, 20], [0, 0, 'C', 8, -8], [0, -7.23, 'D', 8, 20]].forEach(([x, y, t, dx, dy]) => {
    b.pt([x, y], { r: 5 });
    b.text([x, y], t, { cls: 'lb up', dx, dy });
  });
}

/* ---------- 第 13 页：护栏立柱（y = −½x²，拱高 0.5，跨度 2） ---------- */
function drawRail() {
  const svg = $('railFig');
  const f = (x) => 0.5 - 0.5 * x * x; // 离底边的高度
  const Y = (h) => 0.5 - h;
  const pts = Array.from({ length: 81 }, (_, i) => { const x = -1 + i / 40; return `${x},${Y(f(x))}`; }).join(' ');
  let h = `<line x1="-1" y1="0.5" x2="1" y2="0.5" stroke="#6f8191" stroke-width="0.012"/><polyline points="${pts}" fill="none" stroke="#1d6fa5" stroke-width="0.02"/>`;
  [-0.6, -0.2, 0.2, 0.6].forEach((x) => {
    h += `<line x1="${x}" y1="0.5" x2="${x}" y2="${Y(f(x))}" stroke="#d9711c" stroke-width="0.018"/><text x="${x}" y="0.58" font-size="0.07" text-anchor="middle" fill="#556575">${fmt(f(x), 2)}</text>`;
  });
  svg.innerHTML = h;
}

window.LESSON = {
  init() { initRice(); initShop(); initArch(); initF512(); initBoat(); initZZ(); drawRail(); },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
