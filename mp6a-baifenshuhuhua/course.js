'use strict';
/* 六上 百分数与分数、小数的互化 · 本课互动：小数点搬家演示、三联转换器（分数/小数/百分数 + 百格图）、练习图、小结图。
 * 转换器全部用“分子/分母”整数精确计算：能除尽写“=”，除不尽按课本保留三位小数（百分号前一位）写“≈”。
 * 通用部分见 ../shared/math.js、mcheck.js、fracfig.js */
const { tex } = MathKit;
const { el, gcd } = FracFig;
const $ = (id) => document.getElementById(id);
const FILL = '#8fd3f4';

/* ---------- 有理数工具（整数运算，避免浮点误差） ---------- */
const MAX_DEN = 1e9;
const rat = (n, d) => { const g = gcd(n, d) || 1; return { n: n / g, d: d / g }; };
// "3/8"、"0.248"、"12"、带 % 的 "12.5" → {n, d}；不合法返回 null
function parseDec(s) {
  const m = s.match(/^(\d{1,7})(?:\.(\d{1,6}))?$/);
  if (!m) return null;
  const f = m[2] || '';
  return rat(+(m[1] + f), 10 ** f.length);
}
function parseFrac(s) {
  const m = s.match(/^(\d{1,6})\/(\d{1,6})$/);
  if (m) return +m[2] ? rat(+m[1], +m[2]) : null;
  return parseDec(s);
}
const parsePct = (s) => { const r = parseDec(s); return r && r.d * 100 <= MAX_DEN ? rat(r.n, r.d * 100) : null; };
// 分母只含因数 2、5 时能化成有限小数，返回需要的小数位数；否则 -1
function places(d) {
  let [a, b, x] = [0, 0, d];
  while (x % 2 === 0) { x /= 2; a += 1; }
  while (x % 5 === 0) { x /= 5; b += 1; }
  return x === 1 ? Math.max(a, b) : -1;
}
// n/d 四舍五入到 k 位小数（整数运算）
function roundStr(n, d, k) {
  const q = Math.floor((n * 10 ** k * 2 + d) / (2 * d));
  if (!k) return String(q);
  const s = String(q).padStart(k + 1, '0');
  return `${s.slice(0, -k)}.${s.slice(-k)}`;
}
/** 小数与百分数写法：{ dec, pct, exact } */
function decPct({ n, d }) {
  const k = places(d);
  if (k >= 0) return { dec: roundStr(n, d, k), pct: roundStr(n * 100, d, Math.max(0, k - 2)), exact: true };
  return { dec: roundStr(n, d, 3), pct: roundStr(n * 100, d, 1), exact: false };
}
const fracStr = ({ n, d }) => (d === 1 ? `${n}` : `${n}/${d}`);
const fracTex = ({ n, d }) => (d === 1 ? `${n}` : `\\dfrac{${n}}{${d}}`);

/* ---------- 第 4 页：小数点搬家 ---------- */
const MOVES = ['0.3', '0.248', '1.15', '0.05', '27%', '150%', '13.5%'];
function moverModel(s) {
  const isPct = s.endsWith('%');
  const [ip, fp = ''] = s.replace('%', '').split('.');
  if (!isPct) {
    const pad = Math.max(0, 2 - fp.length);
    return { digits: [...ip + fp].map((c) => ({ c })).concat(Array.from({ length: pad }, () => ({ c: '0', pad: true }))), from: ip.length, to: ip.length + 2, isPct };
  }
  const lead = Math.max(0, 3 - ip.length);
  return { digits: Array.from({ length: lead }, () => ({ c: '0', pad: true })).concat([...ip + fp].map((c) => ({ c }))), from: lead + ip.length, to: lead + ip.length - 2, isPct };
}
// 去掉无意义的 0 后的读法
function cleanNum(digits, pos) {
  const s = `${digits.slice(0, pos).join('')}.${digits.slice(pos).join('')}`;
  return String(+s);
}
function initMover() {
  let model = null;
  let pos = 0;
  let timer = 0;
  const row = $('mvRow');
  const draw = () => {
    const done = pos === model.to;
    const showPct = model.isPct ? !done : done;
    // 整数部分最前面没有意义的 0 变淡（个位的 0 保留）
    const firstNZ = model.digits.findIndex((d) => d.c !== '0');
    const leadEnd = Math.min(pos - 1, firstNZ < 0 ? pos - 1 : firstNZ);
    row.innerHTML = model.digits.map((d, i) => `${i === pos ? '<b class="mv-pt">.</b>' : ''}<span class="mv-d${d.pad ? ' pad' : ''}${i < leadEnd ? ' lead' : ''}">${d.c}</span>`).join('')
      + (pos === model.digits.length ? '<b class="mv-pt">.</b>' : '') + (showPct ? '<span class="mv-pc">%</span>' : '');
    const val = cleanNum(model.digits.map((d) => d.c), pos);
    $('mvMsg').textContent = done ? `${model.src} = ${val}${model.isPct ? '' : '%'}` : '';
  };
  const pick = (s) => {
    clearInterval(timer);
    model = { ...moverModel(s), src: s };
    pos = model.from;
    draw();
    document.querySelectorAll('#mvPre .btn').forEach((b) => b.classList.toggle('solid', b.textContent === s));
  };
  $('mvPre').innerHTML = MOVES.map((s) => `<button type="button" class="btn">${s}</button>`).join('');
  $('mvPre').addEventListener('click', (e) => { if (e.target.matches('.btn')) pick(e.target.textContent); });
  $('mvGo').addEventListener('click', () => {
    clearInterval(timer);
    pos = model.from;
    draw();
    const dir = Math.sign(model.to - model.from);
    timer = setInterval(() => {
      pos += dir;
      draw();
      if (pos === model.to) clearInterval(timer);
    }, 700);
  });
  pick(MOVES[0]);
}

/* ---------- 第 7 页：三联转换器 ---------- */
const PRESETS = ['1.15', '110%', '3/5', '2/7', '0.248', '12.5%', '1/3', '3/8'];
const GRID_W = 200;
function drawValueGrids(r) {
  const svg = $('tGrid');
  svg.innerHTML = '';
  const cells = (r.n * 100) / r.d; // 准确的格数（可以不是整数）
  [0, 1].forEach((g) => {
    const x0 = 5 + g * (GRID_W + 20);
    const inG = Math.max(0, Math.min(100, cells - g * 100));
    for (let c = 0; c < 10; c += 1) {
      const colCells = Math.max(0, Math.min(10, inG - c * 10));
      const full = Math.floor(colCells);
      if (full) el('rect', { x: x0 + c * 20, y: 5, width: 20, height: full * 20, fill: FILL }, svg);
      if (colCells > full) el('rect', { x: x0 + c * 20, y: 5 + full * 20, width: 20 * (colCells - full), height: 20, fill: FILL }, svg);
    }
    for (let i = 0; i <= 10; i += 1) {
      const w = i % 10 ? 1 : 2.5;
      el('line', { x1: x0 + i * 20, x2: x0 + i * 20, y1: 5, y2: 205, stroke: '#2a9fd6', 'stroke-width': w }, svg);
      el('line', { x1: x0, x2: x0 + GRID_W, y1: 5 + i * 20, y2: 5 + i * 20, stroke: '#2a9fd6', 'stroke-width': w }, svg);
    }
    if (g === 1 && cells <= 100) el('rect', { x: x0, y: 5, width: GRID_W, height: GRID_W, fill: '#fff', opacity: 0.7 }, svg);
  });
  const shown = Math.round(cells * 1000) / 1000;
  $('tCap').textContent = cells > 200 ? '超过 200%，百格图只画到 200%' : `涂了 ${Number.isInteger(cells) ? cells : `约 ${shown}`} 格${cells > 100 ? '（第二个百格图表示又一个“1”）' : ''}`;
}
function initTri() {
  const ins = { frac: $('tFrac'), dec: $('tDec'), pct: $('tPct') };
  const parse = { frac: parseFrac, dec: parseDec, pct: parsePct };
  const update = (from) => {
    const raw = ins[from].value.trim().replace(/[％%]$/, '').replace(/[．。]/g, '.').replace(/／/g, '/');
    const r = raw ? parse[from](raw) : null;
    Object.values(ins).forEach((i) => i.classList.toggle('bad', i === ins[from] && !!raw && !r));
    if (!r) { $('tHow').innerHTML = raw ? '这个写法还不认识：分数写成 3/8，小数写成 0.375。' : ''; return; }
    const { dec, pct, exact } = decPct(r);
    const eq = exact ? '=' : '\\approx';
    if (from !== 'frac') ins.frac.value = fracStr(r);
    if (from !== 'dec') ins.dec.value = (exact ? '' : '≈') + dec;
    if (from !== 'pct') ins.pct.value = (exact ? '' : '≈') + pct;
    const how = from === 'pct'
      ? `$${pct}\\%=\\dfrac{${pct}}{100}=${fracTex(r)}$；去掉 %，小数点向左移两位：$${pct}\\%=${dec}$`
      : `$${fracTex(r)}=${r.n}\\div${r.d}${eq}${dec}${eq}${pct}\\%$${exact ? '' : '（除不尽，保留三位小数）'}`;
    $('tHow').innerHTML = how;
    tex($('tHow'));
    drawValueGrids(r);
  };
  Object.entries(ins).forEach(([k, i]) => i.addEventListener('input', () => update(k)));
  const setPreset = (s) => {
    const k = s.endsWith('%') ? 'pct' : s.includes('/') ? 'frac' : 'dec';
    Object.values(ins).forEach((i) => { i.value = ''; });
    ins[k].value = s.replace('%', '');
    update(k);
  };
  $('tPre').innerHTML = PRESETS.map((s) => `<button type="button" class="btn">${s}</button>`).join('');
  $('tPre').addEventListener('click', (e) => { if (e.target.matches('.btn')) setPreset(e.target.textContent); });
  setPreset('2/7');
}

/* ---------- 第 10 页：练习十四第 16 题（5 个同样大的方格：红 3、橙 2） ---------- */
function initEx16() {
  FracFig.bar($('ex16'), { x: 15, y: 10, w: 300, h: 50, n: 5, on: (i) => i < 3, fill: '#f6a6d4', empty: '#f9c48a', line: '#c2447f' });
}

/* ---------- 第 11 页：小结关系图 ---------- */
function initMap() {
  const svg = $('triMap');
  const node = (x, y, t) => {
    el('rect', { x: x - 80, y: y - 30, width: 160, height: 60, rx: 14, fill: '#fff', stroke: '#c03a2b', 'stroke-width': 2.5 }, svg);
    el('text', { x, y: y + 9, class: 'ff-t b', style: 'font-size:26px' }, svg).textContent = t;
  };
  const arrow = (x1, y1, x2, y2, t, lx, ly, anchor = 'middle') => {
    el('line', { x1, y1, x2, y2, stroke: '#e07b2a', 'stroke-width': 2.5, 'marker-end': 'url(#ah)' }, svg);
    el('text', { x: lx, y: ly, class: 'ff-t s', style: `text-anchor:${anchor}` }, svg).textContent = t;
  };
  const defs = el('defs', {}, svg);
  const mk = el('marker', { id: 'ah', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, defs);
  el('path', { d: 'M0 0L10 5L0 10Z', fill: '#e07b2a' }, mk);
  node(120, 60, '小数'); node(640, 60, '百分数'); node(380, 250, '分数');
  arrow(205, 50, 555, 50, '小数点向右移两位，添 %', 380, 40);
  arrow(555, 74, 205, 74, '去掉 %，小数点向左移两位', 380, 96);
  arrow(330, 220, 135, 95, '分子 ÷ 分母', 262, 140, 'start');
  arrow(105, 95, 290, 245, '写成十分之几、百分之几…', 205, 262, 'end');
  arrow(625, 95, 470, 230, '写成分母 100，再约分', 555, 262, 'start');
  arrow(440, 220, 600, 95, '先化成小数', 498, 140, 'end');
}

window.LESSON = {
  init() {
    initMover();
    initTri();
    initEx16();
    initMap();
    FracFig.exact();
  },
};
