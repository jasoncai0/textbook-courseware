'use strict';
/* 九下 8.2 货比三家 · 本课互动：
 * 厂家三幅图（全部由互联网统计表 × 12 算出，与课本图吻合）、月平均销售量折线、挑区间实验室（选年份区间与指标，实时算出冠军）、
 * 纵轴起点滑块（练习 1）、电视机折线（练习 3）、两家公司利润“分开画 / 画在同一坐标系”（习题 1）、洗衣机扇形图（习题 3）。 */
const { fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const boards = [];

const YEARS = [2008, 2009, 2010, 2011, 2012, 2013];
const MONTHLY = {
  A: [4.8, 7.7, 11.25, 15.58, 20.75, 24],
  B: [32.42, 29.42, 26.58, 22.17, 18.08, 17.3],
  C: [17.33, 20.33, 22.08, 23.33, 24.08, 24.33],
};
const COLOR = { A: '#d0287a', B: '#2a9fd6', C: '#1f9a4f' };
const yearly = (k, i) => MONTHLY[k][i] * 12; // 年销售量（万台）= 月平均 × 12

/* ---------- 第 3 页：厂家的三幅图 ---------- */
function initAds() {
  boards.push(MStat.line($('adA'), {
    xs: [1, 2, 3, 4, 5], x: [-0.2, 6.2], y: [-45, 330], ty: 50, tx: 0, w: 420, h: 290, labels: ['年份', '销量/万台'],
    xLabels: YEARS.slice(0, 5).map((y, i) => [i + 1, String(y)]),
    series: [{ vals: [0, 1, 2, 3, 4].map((i) => yearly('A', i)), color: '#e0457b' }],
  }));
  boards.push(MStat.bars($('adB'), {
    cats: ['A品牌', 'B品牌', 'C品牌'], ymax: 1800, ty: 200, labels: ['品牌', '销量/万台'], w: 420, h: 290, gw: 0.5,
    series: [{ vals: ['A', 'B', 'C'].map((k) => [0, 1, 2, 3, 4].reduce((s, i) => s + yearly(k, i), 0)), color: '#a8dcf5' }],
    fmt: (v) => String(Math.round(v)),
  }));
  MStat.pie($('adC'), [
    { name: 'B品牌', v: 25, color: '#e8194f' }, { name: 'C品牌', v: 34, color: '#fbdbe6' },
    { name: '其他', v: 12, color: '#3d8fcf' }, { name: 'A品牌', v: 29, color: '#fff8d8' },
  ], { r: 70, pad: 86, padY: 26, fs: 15, label: (it, p) => `${it.name} ${Math.round(p)}%` });
}

/* ---------- 第 4、5 页：月平均销售量折线 ---------- */
function netLine(el, o = {}) {
  const b = MStat.line(el, {
    xs: [1, 2, 3, 4, 5, 6], x: [-0.3, 7.6], y: [-4.5, 38], ty: 5, tx: 0, w: o.w || 600, h: o.h || 330, labels: ['年份', '月平均销量/万台'],
    xLabels: YEARS.map((y, i) => [i + 1, String(y)]),
    series: ['A', 'B', 'C'].map((k) => ({ vals: MONTHLY[k], color: COLOR[k] })),
  });
  ['A', 'B', 'C'].forEach((k) => {
    const t = b.text([6, MONTHLY[k][5]], `${k} 品牌`, { cls: 'scat', dx: 34, dy: k === 'A' ? 16 : k === 'C' ? -8 : 6 });
    t.style.fill = COLOR[k];
  });
  boards.push(b);
  return b;
}

/* ---------- 第 5 页：挑区间实验室 ---------- */
const MEAS = {
  total: { name: '区间总销量', f: (k, a, z) => { let s = 0; for (let i = a; i <= z; i++) s += yearly(k, i); return s; }, desc: (a, z) => `${YEARS[a]}～${YEARS[z]} 年销售总量` },
  growth: { name: '年销量增加了多少', f: (k, a, z) => yearly(k, z) - yearly(k, a), desc: (a, z) => `${YEARS[z]} 年比 ${YEARS[a]} 年的年销量增加量` },
  last: { name: '最后一年的销量', f: (k, a, z) => yearly(k, z), desc: (a, z) => `${YEARS[z]} 年的年销量（占有率之比）` },
};
const PRESETS = [
  { name: 'A 厂的说法', a: 0, z: 4, m: 'growth' },
  { name: 'B 厂的说法', a: 0, z: 4, m: 'total' },
  { name: 'C 厂的说法', a: 4, z: 4, m: 'last' },
  { name: '换成 2011～2013 年', a: 3, z: 5, m: 'total' },
];
function barSvg(el, vals, unit) {
  const W = 560; const H = 300; const L = 60; const top = 30; const bot = 250;
  const max = Math.max(...vals.map(([, v]) => v), 1);
  const min = Math.min(...vals.map(([, v]) => v), 0);
  const Y = (v) => top + ((max - v) / (max - min)) * (bot - top);
  const best = Math.max(...vals.map(([, v]) => v));
  let h = `<line x1="${L}" y1="${Y(0)}" x2="${W - 10}" y2="${Y(0)}" stroke="#6f8191" stroke-width="2"/>`;
  vals.forEach(([k, v], i) => {
    const x = L + 30 + i * 160;
    const y0 = Math.min(Y(0), Y(v));
    const hh = Math.abs(Y(v) - Y(0));
    h += `<rect x="${x}" y="${y0}" width="100" height="${Math.max(hh, 1)}" fill="${COLOR[k]}" opacity="${v === best ? 1 : 0.45}" stroke="#1f2d3a" stroke-width="1"/>`
      + `<text x="${x + 50}" y="${v >= 0 ? Y(v) - 8 : Y(v) + 22}" text-anchor="middle" font-size="20" fill="#1f2d3a">${v.toFixed(1)}</text>`
      + `<text x="${x + 50}" y="${H - 18}" text-anchor="middle" font-size="20" fill="${COLOR[k]}" font-weight="bold">${k} 品牌${v === best ? ' ★' : ''}</text>`;
  });
  h += `<text x="${L - 6}" y="20" font-size="16" fill="#556575">${unit}</text>`;
  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:100%;display:block">${h}</svg>`;
}
function initLab() {
  const st = { a: 0, z: 4, m: 'total' };
  const b = netLine($('labLine'), { h: 300 });
  b.poly(() => [[st.a + 1 - 0.3, 0], [st.z + 1 + 0.3, 0], [st.z + 1 + 0.3, 36], [st.a + 1 - 0.3, 36]], { cls: 'band' });
  const yb = (id, key) => { $(id).innerHTML = YEARS.map((y, i) => `<button class="btn" type="button" data-${key}="${i}">${y}</button>`).join(''); };
  yb('fromBtns', 'a');
  yb('toBtns', 'z');
  $('measBtns').innerHTML = Object.entries(MEAS).map(([k, m]) => `<button class="btn" type="button" data-m="${k}">${m.name}</button>`).join('');
  $('presets').innerHTML = PRESETS.map((p, i) => `<button class="btn solid" type="button" data-p="${i}">${p.name}</button>`).join('');
  const render = () => {
    if (st.a > st.z) [st.a, st.z] = [st.z, st.a];
    document.querySelectorAll('#fromBtns .btn').forEach((e) => e.classList.toggle('on', +e.dataset.a === st.a));
    document.querySelectorAll('#toBtns .btn').forEach((e) => e.classList.toggle('on', +e.dataset.z === st.z));
    document.querySelectorAll('#measBtns .btn').forEach((e) => e.classList.toggle('on', e.dataset.m === st.m));
    const M = MEAS[st.m];
    const vals = ['A', 'B', 'C'].map((k) => [k, M.f(k, st.a, st.z)]);
    barSvg($('labBars'), vals, '万台');
    const win = vals.reduce((p, q) => (q[1] > p[1] ? q : p));
    $('labMsg').className = 'tip feedback verdict-big fb-ok';
    $('labMsg').innerHTML = `比较 ${M.desc(st.a, st.z)}：冠军是 <b>${win[0]} 品牌</b>（${win[1].toFixed(1)} 万台）．`;
    b.update();
  };
  const on = (id, fn) => $(id).addEventListener('click', (e) => { const t = e.target.closest('button'); if (t) { fn(t.dataset); render(); } });
  on('fromBtns', (d) => { st.a = +d.a; });
  on('toBtns', (d) => { st.z = +d.z; });
  on('measBtns', (d) => { st.m = d.m; });
  on('presets', (d) => { const p = PRESETS[+d.p]; Object.assign(st, { a: p.a, z: p.z, m: p.m }); });
  render();
}

/* ---------- 第 7 页：纵轴起点 ---------- */
const HT = [['学生A', 1.6], ['学生B', 1.52], ['学生C', 1.72], ['学生D', 1.54], ['学生E', 1.64]];
function initYAxis() {
  const svg = $('yFig');
  const draw = (s) => {
    const top = 1.8; const L = 70; const T = 34; const B = 290;
    const Y = (v) => B - ((v - s) / (top - s)) * (B - T);
    const step = s >= 1.3 ? 0.05 : s >= 0.8 ? 0.1 : 0.2;
    let h = '';
    for (let v = Math.ceil(s / step - 1e-9) * step; v <= top + 1e-9; v += step) {
      h += `<line x1="${L}" x2="550" y1="${Y(v)}" y2="${Y(v)}" stroke="#e3c4d3" stroke-width="1"/><text x="${L - 8}" y="${Y(v) + 5}" text-anchor="end" font-size="15">${v.toFixed(2)}</text>`;
    }
    HT.forEach(([n, v], i) => {
      const x = L + 25 + i * 95;
      h += `<rect x="${x}" y="${Y(v)}" width="44" height="${B - Y(v)}" fill="#b3e3f7" stroke="#1f2d3a"/><text x="${x + 22}" y="${Y(v) - 6}" text-anchor="middle" font-size="15">${v.toFixed(2)}</text><text x="${x + 22}" y="${B + 22}" text-anchor="middle" font-size="16">${n}</text>`;
    });
    h += `<line x1="${L}" y1="${T - 10}" x2="${L}" y2="${B}" stroke="#556575" stroke-width="2"/><line x1="${L}" y1="${B}" x2="555" y2="${B}" stroke="#556575" stroke-width="2"/><text x="${L + 8}" y="16" font-size="15">身高/m</text>`;
    svg.innerHTML = h;
    $('yVal').textContent = s.toFixed(2);
    const r = (1.72 - s) / (1.52 - s);
    $('yMsg').className = `tip feedback ${s > 1 ? 'fb-warn' : 'fb-ok'}`;
    $('yMsg').innerHTML = `C 比 B 实际只高 0.20 m（约 ${fmt((0.2 / 1.52) * 100, 0)}%），图上 C 的长条却是 B 的 <b>${fmt(r, 2)}</b> 倍．`;
  };
  MathKit.slider($('ySlide'), draw);
}

/* ---------- 第 8 页：电视机 ---------- */
function initTv() {
  const b = MStat.line($('tvLine'), {
    xs: [4, 5, 6, 7, 8, 9, 10], x: [3, 12.2], y: [-1.8, 23.5], tx: 0, ty: 2, xLabels: [4, 5, 6, 7, 8, 9, 10].map((m) => [m, String(m)]), w: 600, h: 300, labels: ['月份', '销量/台'],
    series: [{ vals: [10, 14, 17, 16, 13, 14, 14], color: '#1f2d3a' }, { vals: [6, 10, 14, 15, 16, 17, 20], color: '#d9711c' }],
  });
  b.text([10, 14], 'A 品牌', { cls: 'scat', dx: 40, dy: 6 }).style.fill = '#1f2d3a';
  b.text([10, 20], 'B 品牌', { cls: 'scat', dx: 40, dy: 6 }).style.fill = '#d9711c';
  boards.push(b);
}

/* ---------- 第 9 页：利润 ---------- */
const JIA = [124, 133, 144, 159, 200]; // 读图约值
const YI = [120, 130, 140, 150, 160];
function profitPanel(x0, w, lo, hi, step, series, title) {
  const T = 30; const B = 250;
  const Y = (v) => B - ((v - lo) / (hi - lo)) * (B - T);
  const X = (i) => x0 + 50 + i * ((w - 80) / 4);
  let h = '';
  for (let v = lo; v <= hi + 1e-9; v += step) h += `<line x1="${x0 + 40}" x2="${x0 + w}" y1="${Y(v)}" y2="${Y(v)}" stroke="#d6dde4"/><text x="${x0 + 34}" y="${Y(v) + 5}" text-anchor="end" font-size="14">${v}</text>`;
  h += `<line x1="${x0 + 40}" y1="${T - 12}" x2="${x0 + 40}" y2="${B}" stroke="#556575" stroke-width="2"/><line x1="${x0 + 40}" y1="${B}" x2="${x0 + w}" y2="${B}" stroke="#556575" stroke-width="2"/>`;
  [2008, 2009, 2010, 2011, 2012].forEach((y, i) => { h += `<text x="${X(i)}" y="${B + 20}" text-anchor="middle" font-size="13">${y}</text>`; });
  series.forEach(({ v, c, n }) => {
    h += `<polyline points="${v.map((y, i) => `${X(i)},${Y(y)}`).join(' ')}" fill="none" stroke="${c}" stroke-width="2.5"/>`
      + v.map((y, i) => `<circle cx="${X(i)}" cy="${Y(y)}" r="4" fill="${c}"/>`).join('')
      + `<text x="${X(4) + 8}" y="${Y(v[4]) + 5}" font-size="15" fill="${c}">${n}</text>`;
  });
  h += `<text x="${x0 + 40}" y="14" font-size="14" fill="#556575">利润/万元</text><text x="${x0 + w / 2 + 20}" y="${B + 42}" text-anchor="middle" font-size="15">${title}</text>`;
  return h;
}
function initProfit() {
  const el = $('profitFig');
  const modes = ['课本的两幅图', '画在同一坐标系'];
  $('profitBtns').innerHTML = modes.map((m, i) => `<button class="btn${i ? '' : ' solid'}" type="button" data-k="${i}">${m}</button>`).join('');
  const draw = (k) => {
    const h = k === 0
      ? profitPanel(0, 290, 0, 250, 50, [{ v: JIA, c: '#e0457b', n: '' }], '甲公司') + profitPanel(300, 290, 100, 160, 10, [{ v: YI, c: '#e0457b', n: '' }], '乙公司')
      : profitPanel(60, 460, 0, 250, 50, [{ v: JIA, c: '#e0457b', n: '甲' }, { v: YI, c: '#1d6fa5', n: '乙' }], '甲、乙两公司（同一纵轴）');
    el.innerHTML = `<svg viewBox="0 0 600 300" style="width:100%;height:100%;display:block">${h}</svg>`;
    document.querySelectorAll('#profitBtns .btn').forEach((e) => e.classList.toggle('solid', +e.dataset.k === k));
  };
  $('profitBtns').addEventListener('click', (e) => { const t = e.target.closest('button'); if (t) draw(+t.dataset.k); });
  draw(0);
}

window.LESSON = {
  init() {
    initAds();
    netLine($('netLine'));
    initLab();
    initYAxis();
    initTv();
    initProfit();
    MStat.pie($('washPie'), [
      { name: 'A', v: 42, color: '#bfe6f7' }, { name: 'B', v: 30, color: '#9fd3ee' },
      { name: '其他', v: 7, color: '#2a9fd6' }, { name: 'C', v: 21, color: '#dff2fb' },
    ], { r: 62, pad: 70, padY: 24, fs: 15, label: (it, p) => `${it.name} ${Math.round(p)}%` });
  },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
