'use strict';
/* 六上 综合与实践 互联网的普及 · 本课互动：课本数据折线统计图（三组数据可切换、逐年描点）、班级调查表自动算百分比、上网用途条形图。
 * 坐标、百分比都由代码按数据精确计算。通用部分见 ../shared/math.js、mcheck.js、fracfig.js */
const { el, gcd } = FracFig;
const $ = (id) => document.getElementById(id);
const BLUE = '#2a7fb8';
const ORANGE = '#e8743b';

const YEARS = [2002, 2004, 2006, 2008, 2010, 2012];
const DATA = { // 课本 p110 表格
  rate: { name: '互联网普及率', unit: '%', max: 50, step: 10, v: [4.6, 7.3, 10.5, 22.6, 34.3, 42.1] },
  users: { name: '上网人数', unit: '亿人', max: 6, step: 1, v: [0.59, 0.94, 1.37, 2.98, 4.57, 5.64] },
  bb: { name: '接入宽带用户', unit: '亿户', max: 2, step: 0.5, v: [0.03, 0.25, 0.51, 0.83, 1.26, 1.75] },
};

/* a ÷ b 的百分数，除不尽保留一位小数 */
function pct(a, b) {
  const g = gcd(a, b) || 1;
  let d = b / g;
  while (d % 2 === 0) d /= 2;
  while (d % 5 === 0) d /= 5;
  const exact = d === 1;
  const k = exact ? 4 : 1;
  const q = Math.floor((a * 100 * 10 ** k * 2 + b) / (2 * b));
  return `${exact ? '' : '≈'}${+(q / 10 ** k).toFixed(k)}%`;
}

/* ---------- 折线统计图 ---------- */
function initLine() {
  const svg = $('line');
  const [x0, x1, y0, y1] = [70, 530, 290, 40];
  let key = 'rate';
  let shown = YEARS.length;
  let timer = 0;
  const X = (i) => x0 + 30 + (i * (x1 - x0 - 60)) / (YEARS.length - 1);
  const draw = () => {
    const d = DATA[key];
    const Y = (v) => y0 - ((y0 - y1) * v) / d.max;
    svg.innerHTML = '';
    for (let v = 0; v <= d.max + 1e-9; v += d.step) {
      el('line', { x1: x0, x2: x1, y1: Y(v), y2: Y(v), stroke: v ? '#dfe7ee' : '#6f8191', 'stroke-width': v ? 1 : 2 }, svg);
      el('text', { x: x0 - 8, y: Y(v) + 6, class: 'ff-t s', style: 'text-anchor:end' }, svg).textContent = String(+v.toFixed(1));
    }
    el('line', { x1: x0, x2: x0, y1: y0, y2: y1 - 10, stroke: '#6f8191', 'stroke-width': 2 }, svg);
    el('text', { x: x0 - 40, y: y1 - 18, class: 'ff-t s', style: 'text-anchor:start' }, svg).textContent = `${d.name}/${d.unit}`;
    YEARS.forEach((yr, i) => { el('text', { x: X(i), y: y0 + 26, class: 'ff-t s' }, svg).textContent = yr; });
    const pts = d.v.slice(0, shown).map((v, i) => [X(i), Y(v)]);
    if (pts.length > 1) el('polyline', { points: pts.map((p) => p.join(',')).join(' '), fill: 'none', stroke: key === 'rate' ? ORANGE : BLUE, 'stroke-width': 3 }, svg);
    pts.forEach(([x, y], i) => {
      el('circle', { cx: x, cy: y, r: 7, fill: '#fff', stroke: key === 'rate' ? ORANGE : BLUE, 'stroke-width': 3 }, svg);
      el('text', { x, y: y - 14, class: 'ff-t s' }, svg).textContent = d.v[i];
    });
  };
  $('lineTabs').addEventListener('click', (e) => {
    const k = e.target.closest('[data-k]')?.dataset.k;
    if (!k) return;
    key = k;
    $('lineTabs').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b.dataset.k === k));
    draw();
  });
  $('lineGo').addEventListener('click', () => {
    clearInterval(timer);
    shown = 0;
    draw();
    timer = setInterval(() => {
      shown += 1;
      draw();
      if (shown >= YEARS.length) clearInterval(timer);
    }, 600);
  });
  draw();
}

/* ---------- 调查表 ---------- */
const toInt = (s) => (/^\d{1,5}$/.test(String(s).trim()) ? +s : null);
function initSurvey() {
  const update = () => {
    document.querySelectorAll('.out[data-o]').forEach((o) => {
      const g = o.dataset.o;
      const t = toInt(document.querySelector(`[data-g="${g}"][data-r="t"]`).value);
      const p = toInt(document.querySelector(`[data-g="${g}"][data-r="p"]`).value);
      const ok = t && p !== null && p <= t;
      o.textContent = ok ? pct(p, t) : '请检查：部分不能多于总数';
      o.classList.toggle('bad', !ok);
    });
  };
  document.querySelectorAll('.survey input[data-g]').forEach((i) => i.addEventListener('input', update));
  update();
}

const USES = [['查阅资料', 30], ['学习知识', 26], ['阅读新闻', 12], ['联系同学', 21], ['下载音乐', 15]];
function initUses() {
  const tab = $('useTab');
  USES.forEach(([n, v], i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${n}</td><td><input class="num" data-u="${i}" value="${v}"></td><td class="out" data-uo="${i}"></td>`;
    tab.appendChild(tr);
  });
  const update = () => {
    const t = toInt($('uTotal').value);
    const svg = $('useBar');
    svg.innerHTML = '';
    [0, 50, 100].forEach((p) => {
      const x = 100 + p * 3;
      el('line', { x1: x, x2: x, y1: 10, y2: 215, stroke: p ? '#dfe7ee' : '#6f8191' }, svg);
      el('text', { x, y: 234, class: 'ff-t s' }, svg).textContent = `${p}%`;
    });
    USES.forEach(([n], i) => {
      const v = toInt(document.querySelector(`[data-u="${i}"]`).value);
      const o = document.querySelector(`[data-uo="${i}"]`);
      const ok = t && v !== null && v <= t;
      o.textContent = ok ? pct(v, t) : '请检查';
      o.classList.toggle('bad', !ok);
      const y = 18 + i * 40;
      el('text', { x: 92, y: y + 19, class: 'ff-t s', style: 'text-anchor:end' }, svg).textContent = n;
      if (ok) el('rect', { x: 100, y, width: (300 * v) / t, height: 26, fill: '#8fd3f4', stroke: '#2a9fd6', 'stroke-width': 1.5 }, svg);
    });
  };
  document.querySelectorAll('#useTab input, #uTotal').forEach((i) => i.addEventListener('input', update));
  update();
}

window.LESSON = {
  init() {
    initLine();
    initSurvey();
    initUses();
  },
};
