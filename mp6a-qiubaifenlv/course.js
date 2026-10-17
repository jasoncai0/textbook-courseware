'use strict';
/* 六上 求百分率 · 本课互动：例 4 条形统计图、任选两人求百分之几、点名册算出勤率（五天）、发芽试验、邮票百分比长条。
 * 百分率一律由整数精确计算：能除尽写“=”，除不尽保留一位小数（课本规则）写“≈”。通用部分见 ../shared/math.js、mcheck.js、fracfig.js */
const { tex } = MathKit;
const { el, gcd } = FracFig;
const $ = (id) => document.getElementById(id);
const BLUE = '#8fd3f4';
const LINE = '#2a9fd6';

/* a ÷ b 写成百分数：{ s, exact } */
function pct(a, b) {
  const g = gcd(a, b) || 1;
  let d = b / g;
  while (d % 2 === 0) d /= 2;
  while (d % 5 === 0) d /= 5;
  const exact = d === 1;
  const k = exact ? 4 : 1;
  const q = Math.floor((a * 100 * 10 ** k * 2 + b) / (2 * b));
  return { s: String(+(q / 10 ** k).toFixed(k)), exact };
}
const pctTex = (a, b) => { const p = pct(a, b); return `${a}\\div${b}${p.exact ? '=' : '\\approx'}${p.s}\\%`; };

/* 第 3 页：例 4 条形统计图（每格 1 km） */
const RUNNERS = [{ name: '王红', km: 5 }, { name: '李芳', km: 4 }, { name: '林小刚', km: 7 }];
function initRun4() {
  const svg = $('run4');
  const [x0, y0, unit] = [50, 260, 28];
  for (let k = 0; k <= 8; k += 1) {
    el('line', { x1: x0, x2: 390, y1: y0 - k * unit, y2: y0 - k * unit, stroke: k ? '#cfe3f2' : '#6f8191', 'stroke-width': k ? 1 : 2 }, svg);
    el('text', { x: x0 - 10, y: y0 - k * unit + 6, class: 'ff-t s', style: 'text-anchor:end' }, svg).textContent = k;
  }
  el('text', { x: x0 - 30, y: 20, class: 'ff-t s', style: 'text-anchor:start' }, svg).textContent = '路程/km';
  RUNNERS.forEach((r, i) => {
    const x = x0 + 30 + i * 110;
    el('rect', { x, y: y0 - r.km * unit, width: 60, height: r.km * unit, fill: BLUE, stroke: LINE, 'stroke-width': 2 }, svg);
    el('text', { x: x + 30, y: y0 - r.km * unit - 8, class: 'ff-t' }, svg).textContent = r.km;
    el('text', { x: x + 30, y: y0 + 26, class: 'ff-t' }, svg).textContent = r.name;
  });
}

/* 第 4 页：任选两人 */
function initPair() {
  const st = { a: 0, b: 2 };
  const seg = (id, key) => {
    $(id).innerHTML = RUNNERS.map((r, i) => `<button type="button" class="btn" data-i="${i}">${r.name}</button>`).join('');
    $(id).addEventListener('click', (e) => {
      const b = e.target.closest('[data-i]');
      if (!b) return;
      st[key] = +b.dataset.i;
      render();
    });
  };
  const render = () => {
    ['pA', 'pB'].forEach((id, k) => $(id).querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', +b.dataset.i === st[k ? 'b' : 'a'])));
    const [A, B] = [RUNNERS[st.a], RUNNERS[st.b]];
    const svg = $('pBars');
    svg.innerHTML = '';
    const unit = 560 / 7;
    [[B, 20, '#f9c48a'], [A, 70, BLUE]].forEach(([r, y, c]) => {
      el('rect', { x: 110, y, width: r.km * unit, height: 32, fill: c, stroke: '#7d8e9c', 'stroke-width': 1.5 }, svg);
      el('text', { x: 100, y: y + 24, class: 'ff-t', style: 'text-anchor:end' }, svg).textContent = r.name;
      el('text', { x: 118 + r.km * unit, y: y + 24, class: 'ff-t s', style: 'text-anchor:start' }, svg).textContent = `${r.km} km`;
    });
    el('text', { x: 110 + (B.km * unit) / 2, y: 44, class: 'ff-t b' }, svg).textContent = '100%（单位“1”）';
    $('pOut').innerHTML = `${A.name}是${B.name}的：$${pctTex(A.km, B.km)}$`;
    tex($('pOut'));
  };
  seg('pA', 'a');
  seg('pB', 'b');
  render();
}

/* 第 6 页：点名册（田径队 40 人，课本五天的出勤人数） */
const TEAM = 40;
const DAYS = ['一', '二', '三', '四', '五'];
const PRESENT = [39, 38, 40, 40, 38];
function person(svg, x, y, on) {
  const c = on ? '#2a7fb8' : '#c4ccd3';
  const g = el('g', { class: 'tap' }, svg);
  el('circle', { cx: x, cy: y - 12, r: 7, fill: c }, g);
  el('path', { d: `M${x - 11} ${y + 16}Q${x - 11} ${y - 3} ${x} ${y - 3}Q${x + 11} ${y - 3} ${x + 11} ${y + 16}Z`, fill: c }, g);
  return g;
}
function initAttendance() {
  const absent = PRESENT.map((p) => new Set(Array.from({ length: TEAM - p }, (_, i) => TEAM - 1 - i * 7)));
  let day = 0;
  $('days').innerHTML = DAYS.map((d, i) => `<button type="button" class="btn" data-d="${i}">星期${d}</button>`).join('');
  $('days').addEventListener('click', (e) => {
    const b = e.target.closest('[data-d]');
    if (b) { day = +b.dataset.d; render(); }
  });
  const svg = $('roster');
  const render = () => {
    $('days').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', +b.dataset.d === day));
    svg.innerHTML = '';
    for (let i = 0; i < TEAM; i += 1) {
      const g = person(svg, 22 + (i % 10) * 41, 26 + Math.floor(i / 10) * 42, !absent[day].has(i));
      g.addEventListener('click', () => {
        if (absent[day].has(i)) absent[day].delete(i); else absent[day].add(i);
        render();
      });
    }
    const n = TEAM - absent[day].size;
    $('attOut').innerHTML = `星期${DAYS[day]}：出勤 <b>${n}</b> 人<br>$${pctTex(n, TEAM)}$`;
    tex($('attOut'));
    drawChart(day);
  };
  const drawChart = (cur) => {
    const ch = $('attChart');
    ch.innerHTML = '';
    const [x0, y0, h] = [62, 180, 150];
    [0, 50, 100].forEach((p) => {
      el('line', { x1: x0, x2: 410, y1: y0 - (h * p) / 100, y2: y0 - (h * p) / 100, stroke: p ? '#dfe7ee' : '#6f8191', 'stroke-width': p ? 1 : 2 }, ch);
      el('text', { x: x0 - 6, y: y0 - (h * p) / 100 + 6, class: 'ff-t s', style: 'text-anchor:end' }, ch).textContent = `${p}%`;
    });
    DAYS.forEach((d, i) => {
      const n = TEAM - absent[i].size;
      const x = x0 + 16 + i * 69;
      const bh = (h * n) / TEAM;
      el('rect', { x, y: y0 - bh, width: 46, height: bh, fill: i === cur ? '#e8743b' : BLUE, stroke: LINE, 'stroke-width': 1.2 }, ch);
      el('text', { x: x + 23, y: y0 - bh - 6, class: 'ff-t s' }, ch).textContent = `${pct(n, TEAM).s}%`;
      el('text', { x: x + 23, y: y0 + 22, class: 'ff-t s' }, ch).textContent = `星期${d}`;
    });
  };
  render();
}

/* 第 7 页：发芽试验（总数 10～200 粒，每行 20 粒） */
function initSeeds() {
  const st = { t: 50, g: 46 };
  const render = () => {
    const svg = $('seeds');
    svg.innerHTML = '';
    // 粒数少时每行 10 粒、画大一些；每粒一个格子，位置按序号精确排列
    const cols = st.t <= 50 ? 10 : 20;
    const k = 20 / cols; // 放大倍数
    for (let i = 0; i < st.t; i += 1) {
      const g = el('g', { transform: `translate(${(10 + (i % cols) * 20.5 * k).toFixed(1)} ${(16 + Math.floor(i / cols) * 21.5 * k).toFixed(1)}) scale(${k})` }, svg);
      el('ellipse', { cx: 0, cy: 4, rx: 7, ry: 5, fill: '#d9b36a', stroke: '#a7823c', 'stroke-width': 1 }, g);
      if (i < st.g) el('path', { d: 'M0 0q-1 -6 -6 -8M0 0q1 -7 6 -9', stroke: '#3c9a3c', 'stroke-width': 2.4, fill: 'none', 'stroke-linecap': 'round' }, g);
    }
    $('sT').textContent = st.t;
    $('sG').textContent = st.g;
    $('seedOut').innerHTML = `发芽率：$${pctTex(st.g, st.t)}$`;
    tex($('seedOut'));
  };
  document.querySelector('#seeds').closest('.col').addEventListener('click', (e) => {
    const s = e.target.closest('[data-s]')?.dataset.s;
    if (!s) return;
    if (s === 't+') st.t = Math.min(200, st.t + 10);
    if (s === 't-') st.t = Math.max(10, st.t - 10);
    if (s === 'g+') st.g += 1;
    if (s === 'g-') st.g -= 1;
    st.g = Math.max(0, Math.min(st.t, st.g));
    render();
  });
  render();
}

/* 第 10 页：邮票百分比长条 */
const STAMPS = [['人物', 16, '#f6a6d4'], ['风景', 32, BLUE], ['动物', 20, '#f9c48a'], ['植物', 12, '#a9dc8c']];
function initStamps() {
  const svg = $('stamps');
  let x = 10;
  STAMPS.forEach(([n, v, c]) => {
    const w = (780 * v) / 80;
    el('rect', { x, y: 8, width: w, height: 44, fill: c, stroke: '#5b6b78', 'stroke-width': 1.5 }, svg);
    el('text', { x: x + w / 2, y: 37, class: 'ff-t' }, svg).textContent = `${n} ${pct(v, 80).s}%`;
    x += w;
  });
}

window.LESSON = {
  init() {
    initRun4();
    initPair();
    initAttendance();
    initSeeds();
    initStamps();
    FracFig.exact();
  },
};
