'use strict';
/* 五上 改写和求近似数 · 本课互动：小数点搬家（改写成用万 / 亿作单位）、四舍五入数轴、1.5 与 1.50 的范围图。
 * 改写用字符串移位、近似数用“万分之一”为单位的整数计算，结果与课本一致、没有浮点误差。 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const PLACE = ['个位', '十位', '百位', '千位', '万位', '十万位', '百万位', '千万位', '亿位', '十亿位'];

/** 改写：把整数 s 改写成以 10^k 为单位（k=4 万，k=8 亿），返回小数写法（已去掉末尾的 0） */
function rewrite(s, k) {
  const t = s.padStart(k + 1, '0');
  const int = t.slice(0, t.length - k);
  const frac = t.slice(t.length - k).replace(/0+$/, '');
  return frac ? `${int}.${frac}` : int;
}

/* 第 3 页：小数点搬家 */
let mvRender = null;
let mvMeasured = false;
const MV_NUMS = ['384400', '149600000', '57910000', '164500', '4300000', '8970000', '380000'];
function initMove() {
  const stage = $('mvStage');
  const st = { s: MV_NUMS[0], k: 0, timer: 0 };
  const render = () => {
    clearTimeout(st.timer);
    const { s, k } = st;
    const n = Math.max(s.length, k + 1);
    const t = s.padStart(n, '0');
    const lastKeep = k ? t.slice(n - k).replace(/0+$/, '').length : 0; // 小数部分保留几位
    const boxes = [...t].map((ch, i) => {
      const pos = n - 1 - i;
      const added = i < n - s.length;
      const trail = k && pos < k && k - pos > lastKeep; // 小数末尾的 0
      return `<div class="mv-cell" data-pos="${pos}"><span class="mv-d ${added ? 'added' : ''} ${trail ? 'trail' : ''}">${ch}</span><small>${PLACE[pos]}</small></div>`;
    }).join('');
    stage.innerHTML = `<div class="mv-row">${boxes}<div class="mv-unit">${k ? (k === 4 ? '万' : '亿') : ''}</div></div><span class="mv-dot" id="mvDot">.</span>`;
    const dot = $('mvDot');
    const place = (pos) => {
      const cell = stage.querySelector(`.mv-cell[data-pos="${pos}"]`);
      return cell.offsetLeft + cell.offsetWidth;
    };
    dot.style.left = `${place(0)}px`;
    mvMeasured = place(0) > 0;
    dot.classList.toggle('ghost', !k);
    const res = $('mvRes');
    if (!k) { res.innerHTML = `${s}：整数的小数点藏在<b>个位</b>右边（不写出来）。`; return; }
    requestAnimationFrame(() => requestAnimationFrame(() => { dot.style.left = `${place(k)}px`; }));
    const r = rewrite(s, k);
    res.innerHTML = '';
    stage.classList.toggle('nodot', !r.includes('.'));
    st.timer = setTimeout(() => {
      stage.classList.add('done');
      res.innerHTML = `小数点点在<b>${PLACE[k]}</b>右边，${r.includes('.') ? '去掉小数末尾的 0' : '小数部分全是 0，连小数点一起去掉'}：<b class="o">${s} = ${r} ${k === 4 ? '万' : '亿'}</b>`;
    }, 900);
    stage.classList.remove('done');
  };
  $('mvPick').innerHTML = MV_NUMS.map((n, i) => `<button type="button" class="btn ${i ? '' : 'solid'}" data-n="${n}">${n}</button>`).join('');
  $('mvPick').addEventListener('click', (e) => {
    const n = e.target.closest('[data-n]')?.dataset.n;
    if (!n) return;
    st.s = n; st.k = 0;
    $('mvPick').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b.dataset.n === n));
    render();
  });
  document.querySelectorAll('[data-u]').forEach((b) => b.addEventListener('click', () => { st.k = +b.dataset.u; render(); }));
  $('mvReset').addEventListener('click', () => { st.k = 0; render(); });
  window.addEventListener('resize', render);
  mvRender = render;
  render();
}

/* 四舍五入：s 精确到 d 位小数；以 10^-4 为单位整数计算 */
const SCALE = 4;
const toInt = (s) => { const [a, b = ''] = s.split('.'); return +a * 10 ** SCALE + +(b + '0000').slice(0, SCALE); };
const fmtInt = (N, d) => {
  const v = N / 10 ** SCALE;
  return v.toFixed(d);
};
function roundInfo(s, d) {
  const N = toInt(s);
  const u = 10 ** (SCALE - d);
  const lo = Math.floor(N / u) * u;
  const next = Math.floor((N - lo) / (u / 10));
  const up = next >= 5;
  return { N, u, lo, hi: lo + u, next, up, r: up ? lo + u : lo };
}

/* 第 5 页：四舍五入数轴 */
const RD_NUMS = ['1.496', '38.44', '7.54', '0.365', '2.692', '0.503', '9.9674'];
const RD = { x0: 90, x1: 910, y: 100 };
function initRound() {
  const svg = $('rdFig');
  const st = { s: RD_NUMS[0], d: 1 };
  const render = () => {
    const { s, d } = st;
    const R = roundInfo(s, d);
    const X = (N) => RD.x0 + ((N - R.lo) / R.u) * (RD.x1 - RD.x0);
    svg.innerHTML = '';
    svgEl('line', { x1: RD.x0 - 40, x2: RD.x1 + 40, y1: RD.y, y2: RD.y, class: 'rd-ax' }, svg);
    for (let j = 0; j <= 10; j += 1) {
      const x = X(R.lo + (j * R.u) / 10);
      const big = j === 0 || j === 10;
      svgEl('line', { x1: x, x2: x, y1: RD.y - (big ? 18 : j === 5 ? 0 : 9), y2: RD.y + (big ? 18 : 9), class: big ? 'rd-tk big' : 'rd-tk' }, svg);
    }
    const mid = X(R.lo + R.u / 2);
    svgEl('line', { x1: mid, x2: mid, y1: RD.y - 70, y2: RD.y + 26, class: 'rd-mid' }, svg);
    svgEl('text', { x: mid, y: RD.y + 48, class: 'rd-midt' }, svg).textContent = `正中间 ${fmtInt(R.lo + R.u / 2, d + 1)}`;
    [[R.lo, !R.up], [R.hi, R.up]].forEach(([v, win]) => {
      svgEl('text', { x: X(v), y: RD.y + 52, class: `rd-end ${win ? 'win' : ''}` }, svg).textContent = fmtInt(v, d);
      if (win) svgEl('circle', { cx: X(v), cy: RD.y, r: 16, class: 'rd-ring' }, svg);
    });
    const px = X(R.N);
    if (Math.abs(px - X(R.r)) > 100) svgEl('path', { d: `M${px} ${RD.y - 30}Q${(px + X(R.r)) / 2} ${RD.y - 75} ${X(R.r)} ${RD.y - 22}`, class: 'rd-arrow' }, svg);
    svgEl('circle', { cx: px, cy: RD.y, r: 9, fill: '#c0392b', stroke: '#fff', 'stroke-width': 2.5 }, svg);
    svgEl('text', { x: px, y: RD.y - 38, class: 'rd-pt' }, svg).textContent = s;
    // 数字：保留的部分 + 下一位（框出来）+ 其余
    const [a, b = ''] = s.split('.');
    const digits = a + b;
    const keep = a.length + d;
    const show = [...digits].map((ch, i) => {
      const dot = i === a.length && b ? '.' : '';
      const cls = i < keep ? 'keep' : i === keep ? 'next' : 'rest';
      return `${dot}<span class="${cls}">${ch}</span>`;
    }).join('');
    $('rdNum').innerHTML = show;
    const place = ['个位', '十分位', '百分位'][d];
    const nextPlace = ['十分位', '百分位', '千分位'][d];
    const nd = digits[keep] ?? '0';
    const m = $('rdMsg');
    m.className = 'tip feedback fb-ok';
    m.innerHTML = `精确到<b>${place}</b>：${s} 在 ${fmtInt(R.lo, d)} 和 ${fmtInt(R.hi, d)} 之间，看${nextPlace}上的 <b class="o">${nd}</b>：${R.up ? `${nd} ≥ 5，向${place}进 1` : `${nd} &lt; 5，舍去`}，<b>${s} ≈ ${fmtInt(R.r, d)}</b>。`;
  };
  $('rdPick').innerHTML = RD_NUMS.map((n, i) => `<button type="button" class="btn ${i ? '' : 'solid'}" data-n="${n}">${n}</button>`).join('');
  $('rdPick').addEventListener('click', (e) => {
    const n = e.target.closest('[data-n]')?.dataset.n;
    if (!n) return;
    st.s = n;
    $('rdPick').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b.dataset.n === n));
    render();
  });
  $('rdPrec').addEventListener('click', (e) => {
    const d = e.target.closest('[data-d]')?.dataset.d;
    if (d === undefined) return;
    st.d = +d;
    $('rdPrec').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b.dataset.d === d));
    render();
  });
  render();
}

/* 第 6 页：近似数 1.5（1.45~1.55）与 1.50（1.495~1.505）的范围，1.40~1.60 每小格 0.01 */
function initRange() {
  const svg = $('rgFig');
  const [x0, x1, lo, hi, y] = [60, 940, 1400, 1600, 120]; // 千分之一
  const X = (v) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
  svgEl('line', { x1: x0 - 20, x2: x1 + 20, y1: y, y2: y, class: 'rd-ax' }, svg);
  for (let v = lo; v <= hi; v += 10) {
    const big = v % 50 === 0;
    svgEl('line', { x1: X(v), x2: X(v), y1: y - (big ? 14 : 7), y2: y + (big ? 14 : 7), class: 'rd-tk' }, svg);
    if (big) svgEl('text', { x: X(v), y: y + 40, class: 'rg-n' }, svg).textContent = (v / 1000).toFixed(2);
  }
  const band = (a, b, yy, h, cls, txt) => {
    svgEl('rect', { x: X(a), y: yy, width: X(b) - X(a), height: h, class: cls }, svg);
    svgEl('text', { x: (X(a) + X(b)) / 2, y: yy - 8, class: `rg-t ${cls}` }, svg).textContent = txt;
  };
  band(1450, 1550, 44, 22, 'rg-a', '≈ 1.5 的数：1.45 ～ 1.55（不含 1.55）');
  band(1495, 1505, 168, 22, 'rg-b', '');
  svgEl('text', { x: X(1500), y: 212, class: 'rg-t rg-b' }, svg).textContent = '≈ 1.50 的数：1.495 ～ 1.505（不含 1.505）';
  svgEl('circle', { cx: X(1500), cy: y, r: 7, fill: '#c0392b' }, svg);
}

/* 指定写法的空（data-exact）：数值对、但写法（位数）不合要求也判错 */
function initExact() {
  const norm = (x) => x.trim().replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0)).replace(/[．。]/g, '.');
  document.querySelectorAll('.blank[data-exact]').forEach((el) => {
    const inp = el.querySelector('input');
    const check = () => {
      if (el.classList.contains('ok') && !el.dataset.ans.split('|').includes(norm(inp.value))) el.classList.replace('ok', 'no');
    };
    inp.addEventListener('change', check);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
  });
}

window.LESSON = {
  init() {
    initMove();
    initRound();
    initRange();
    initExact();
  },
  // 页面隐藏时量不到格子位置；第一次显示这一页时重新排一次
  onRender(slide) {
    if (mvRender && !mvMeasured && slide.contains($('mvStage'))) requestAnimationFrame(mvRender);
  },
};
