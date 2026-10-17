'use strict';
/* 五上 用正负数表示相反意义的量 · 本课互动：例 3 盈亏条形图（按比例）、例 4 东西走一走并把路画成直线（核心）、
 * 直线上拖点找发现、练习一第 7 题描点。数轴用 ../shared/numline.js */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const mk = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const sgn = (v) => (v > 0 ? `+${v}` : v < 0 ? `−${-v}` : '0');

/* ---------- 第 3 页：盈亏条形图（1000 元 = 28 像素） ---------- */
const MONEY = [3000, 4200, -1800, 2700, -900, 3700];
function initBars() {
  const svg = $('barFig');
  const zero = 150;
  const k = 0.028;
  mk('line', { x1: 60, x2: 550, y1: zero, y2: zero, class: 'b-zero' }, svg);
  mk('text', { x: 52, y: zero + 6, class: 'b-lb end' }, svg).textContent = '0';
  [-2000, 2000, 4000].forEach((m) => {
    mk('line', { x1: 60, x2: 550, y1: zero - m * k, y2: zero - m * k, class: 'b-grid' }, svg);
    mk('text', { x: 52, y: zero - m * k + 6, class: 'b-lb end' }, svg).textContent = m < 0 ? `−${-m}` : m;
  });
  MONEY.forEach((m, i) => {
    const x = 85 + i * 78;
    const h = Math.abs(m) * k;
    mk('rect', { x, y: m > 0 ? zero - h : zero, width: 46, height: h, class: m > 0 ? 'b-pos' : 'b-neg' }, svg);
    mk('text', { x: x + 23, y: m > 0 ? zero - h - 8 : zero + h + 20, class: `b-lb mid ${m > 0 ? 'pos' : 'neg'}` }, svg).textContent = sgn(m);
    mk('text', { x: x + 23, y: 245, class: 'b-lb mid' }, svg).textContent = `${'一二三四五六'[i]}月`;
  });
}

/* ---------- 第 5 页：东西走一走（1 千米 = 100 像素，学校在 x = 500） ---------- */
function initWalk() {
  const svg = $('walkFig');
  const X = (p) => 500 + p * 100;
  const yR = 140;
  const road = mk('g', { class: 'w-road' }, svg);
  mk('rect', { x: 40, y: yR - 16, width: 920, height: 32, rx: 6, class: 'w-path' }, road);
  const line = mk('g', { class: 'w-line hide' }, svg);
  mk('line', { x1: 40, x2: 950, y1: yR, y2: yR, class: 'w-axis' }, line);
  mk('path', { d: `M965 ${yR}l-18 -8v16z`, class: 'w-arrow' }, line);
  for (let p = -4; p <= 4; p += 1) {
    mk('line', { x1: X(p), x2: X(p), y1: yR - 9, y2: yR + 9, class: 'w-axis' }, line);
    mk('text', { x: X(p), y: yR + 36, class: `w-num ${p > 0 ? 'pos' : p < 0 ? 'neg' : ''}` }, line).textContent = sgn(p).replace('+', '');
  }
  // 地点：公园（−2）、学校（0）、邮局（+2）
  [[-2, '公园', 'w-park'], [0, '学校', 'w-school'], [2, '邮局', 'w-post']].forEach(([p, name, cls]) => {
    mk('circle', { cx: X(p), cy: yR, r: 9, class: `w-dot ${cls}` }, svg);
    mk('text', { x: X(p), y: 52, class: 'w-name' }, svg).textContent = name;
    mk('line', { x1: X(p), x2: X(p), y1: 60, y2: yR - 12, class: 'w-pin' }, svg);
  });
  mk('text', { x: 60, y: 30, class: 'w-dir' }, svg).textContent = '← 西';
  mk('text', { x: 940, y: 30, class: 'w-dir end' }, svg).textContent = '东 →';
  const man = mk('g', { class: 'w-man' }, svg);
  mk('circle', { cx: 0, cy: yR - 62, r: 11, class: 'w-head' }, man);
  mk('path', { d: `M0 ${yR - 50}V${yR - 22}M-14 ${yR - 42}L14 ${yR - 42}M0 ${yR - 22}L-10 ${yR - 4}M0 ${yR - 22}L10 ${yR - 4}`, class: 'w-body' }, man);
  const tag = mk('text', { x: 0, y: yR + 66, class: 'w-tag' }, man);
  let pos = 0;
  const say = $('wSay');
  const draw = () => {
    man.style.transform = `translateX(${X(pos)}px)`;
    tag.textContent = pos === 0 ? '0' : `${sgn(pos)} 千米`;
    say.innerHTML = pos === 0 ? '小华在<b>学校</b>：既不向东也不向西，记作 <b>0</b>。'
      : `小华在学校<b>${pos > 0 ? '东' : '西'}边 ${Math.abs(pos)} 千米</b>，记作 <b class="${pos > 0 ? 'pos' : 'neg'}">${sgn(pos)} 千米</b>。`;
  };
  $('wEast').addEventListener('click', () => { pos = Math.min(4, pos + 1); draw(); });
  $('wWest').addEventListener('click', () => { pos = Math.max(-4, pos - 1); draw(); });
  $('wHome').addEventListener('click', () => { pos = 0; draw(); });
  let asLine = false;
  $('wLine').addEventListener('click', () => {
    asLine = !asLine;
    road.classList.toggle('hide', asLine);
    line.classList.toggle('hide', !asLine);
    $('wLine').textContent = asLine ? '变回小路' : '把路画成直线';
  });
  draw();
}

/* ---------- 第 6 页：拖点找发现 ---------- */
function initFind() {
  const s = { x: 2 };
  const b = NumLine.board($('nlFind'), { from: -5, to: 5, w: 900, h: 170, y: [-1, 1.8] });
  NumLine.axis(b, { from: -5, to: 5 });
  b.seg(() => [[0, 0.55], [s.x, 0.55]], { cls: 'arc1' });
  b.text(() => (s.x ? [s.x / 2, 0.55] : null), () => `${Math.abs(s.x)} 格`, { cls: 'nl-or', dy: -10 });
  b.pt(() => (s.x ? [-s.x, 0] : null), { cls: 'ghost', r: 8 });
  b.text(() => (s.x ? [-s.x, 0] : null), () => sgn(-s.x), { cls: 'nl-val ghost-t', dy: -16 });
  b.text(() => [s.x, 0], () => sgn(s.x), { cls: 'nl-val', dy: -18 });
  b.drag(() => [s.x, 0], (x) => {
    s.x = Math.max(-5, Math.min(5, Math.round(x)));
    say();
  });
  const say = () => {
    const v = s.x;
    $('findSay').innerHTML = v === 0 ? '这是 <b>0</b>：既不是正数，也不是负数。'
      : `<b class="${v > 0 ? 'pos' : 'neg'}">${sgn(v)}</b> 在 0 的<b>${v > 0 ? '右' : '左'}边</b>，是${v > 0 ? '正数，比 0 大' : '负数，比 0 小'}；离 0 有 ${Math.abs(v)} 格。虚线点 ${sgn(-v)} 离 0 也是 ${Math.abs(v)} 格，在另一边。`;
  };
  say();
}

/* ---------- 第 9 页：练习一第 7 题 ---------- */
function initDots() {
  const s = { r: 1, b: 4 };
  const L = { '-4': 'A', '-3': 'B', 3: 'C', 5: 'D' };
  const bd = NumLine.board($('nl7'), { from: -5, to: 5, w: 900, h: 150 });
  NumLine.axis(bd, { from: -5, to: 5, label: (x) => L[x] || NumLine.minus(x) });
  bd.text(() => [s.r, 0], () => (s.r === -2 ? '✓' : ''), { cls: 'nl-val', dy: -22 });
  bd.text(() => [s.b, 0], () => (s.b === -4 ? '✓' : ''), { cls: 'nl-val', dy: -22 });
  const upd = () => {
    const ok = s.r === -2 && s.b === -4;
    $('sayDot').innerHTML = ok ? '✓ 描对了！−2 在 0 左边 2 格，−4 在 0 左边 4 格。'
      : '把<b class="pos">红点</b>拖到 −2，<b class="neg">蓝点</b>拖到 −4。';
  };
  bd.drag(() => [s.r, 0], (x) => { s.r = Math.max(-5, Math.min(5, Math.round(x))); upd(); }).classList.add('red');
  bd.drag(() => [s.b, 0], (x) => { s.b = Math.max(-5, Math.min(5, Math.round(x))); upd(); }).classList.add('blue');
}

window.LESSON = {
  init() {
    initBars();
    initWalk();
    initFind();
    initDots();
  },
};
