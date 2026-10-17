'use strict';
/* 五上 复式条形统计图 · 本课互动：两张单式条形图合成一张复式条形图（直条平移动画）、例 2 复式条形图（可只看一组）、
 * 练习十六第 1、3 题的图、拖动直条画图并检查（第 4 题）、两种分组方式切换（第 5 题）。
 * 所有直条高度按课本数据由代码精确绘制（../shared/mstat.js + 本页 SVG）。 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent, txt) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (txt !== undefined) e.textContent = txt;
  if (parent) parent.appendChild(e);
  return e;
};
const C1 = '#8ecbee';
const C2 = '#f2a2c6';
const C3 = '#9fd9a8';
const LEVELS = ['优秀', '良好', '及格'];
const BOYS = [2, 10, 11]; // 课本 p89 例 2
const GIRLS = [8, 9, 5];

/* ---------- 第 2 页：小图（男生） ---------- */
function initMini() {
  MStat.bars($('miniBar'), { cats: LEVELS, series: [{ name: '男生', vals: BOYS, color: C1 }], ymax: 12, ty: 2, w: 420, h: 230 });
}

/* ---------- 第 3 页：两张图合成一张 ---------- */
const MG = { y0: 340, h: 280, max: 12, bw: 44 };
function initMerge() {
  const svg = $('mergeFig');
  const Y = (v) => MG.y0 - (v * MG.h) / MG.max;
  const axes = (x0, w, cls, title) => {
    const g = svgEl('g', { class: `mg-ax ${cls}` }, svg);
    for (let v = 0; v <= MG.max; v += 2) {
      svgEl('path', { d: `M${x0} ${Y(v)}H${x0 + w}`, class: v ? 'mg-grid' : 'mg-base' }, g);
      svgEl('text', { x: x0 - 10, y: Y(v) + 7, class: 'mg-tk' }, g, v);
    }
    svgEl('path', { d: `M${x0} ${Y(MG.max) - 14}V${MG.y0}`, class: 'mg-base' }, g);
    svgEl('text', { x: x0 - 8, y: Y(MG.max) - 22, class: 'mg-unit' }, g, '数量/人');
    LEVELS.forEach((c, i) => svgEl('text', { x: x0 + (w / 3) * (i + 0.5), y: MG.y0 + 32, class: 'mg-cat' }, g, c));
    if (title) svgEl('text', { x: x0 + w / 2, y: 30, class: 'mg-title' }, g, title);
    return g;
  };
  const apart = [axes(90, 360, 'ap', '男生'), axes(570, 360, 'ap', '女生')];
  const joint = axes(90, 840, 'jo', '');
  const lg = svgEl('g', { class: 'mg-ax jo' }, svg);
  [[C1, '男生'], [C2, '女生']].forEach(([c, t], k) => {
    svgEl('rect', { x: 760 + k * 100, y: 14, width: 22, height: 22, fill: c, stroke: '#6f8191' }, lg);
    svgEl('text', { x: 790 + k * 100, y: 32, class: 'mg-lg' }, lg, t);
  });
  const bars = [BOYS, GIRLS].map((vals, s) => vals.map((v) => {
    const g = svgEl('g', { class: 'mg-bar' }, svg);
    svgEl('rect', { x: 0, y: Y(v), width: MG.bw, height: MG.y0 - Y(v), fill: s ? C2 : C1, class: 'mg-r' }, g);
    svgEl('text', { x: MG.bw / 2, y: Y(v) - 8, class: 'mg-v' }, g, v);
    return g;
  }));
  const set = (join) => {
    bars.forEach((row, s) => row.forEach((g, i) => {
      const x = join ? 90 + 280 * (i + 0.5) - MG.bw + s * MG.bw : (s ? 570 : 90) + 120 * (i + 0.5) - MG.bw / 2;
      g.style.transform = `translate(${x}px, 0)`;
    }));
    apart.forEach((g) => g.classList.toggle('off', join));
    [joint, lg].forEach((g) => g.classList.toggle('off', !join));
    $('mgJoin').classList.toggle('solid', !join);
    $('mgApart').classList.toggle('solid', join);
  };
  $('mgJoin').addEventListener('click', () => set(true));
  $('mgApart').addEventListener('click', () => set(false));
  set(false);
}

/* ---------- 第 4、5 页：例 2 ---------- */
function initEx2() {
  MStat.bars($('chart2'), { cats: LEVELS, series: [{ name: '男生', vals: BOYS, color: C1 }, { name: '女生', vals: GIRLS, color: C2 }], ymax: 12, ty: 2, labels: ['', '数量/人'] });
  const view = { k: 2 };
  const zero = [0, 0, 0];
  const b = MStat.bars($('chart2b'), {
    cats: LEVELS,
    series: [{ name: '男生', vals: () => (view.k === 1 ? zero : BOYS), color: C1 }, { name: '女生', vals: () => (view.k === 0 ? zero : GIRLS), color: C2 }],
    ymax: 12, ty: 2, labels: ['', '数量/人'],
  });
  $('viewPick').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    $('viewPick').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    view.k = +btn.dataset.k;
    b.update();
  });
}

/* ---------- 第 7、8 页：练习十六第 1、3 题 ---------- */
function initEx16() {
  MStat.bars($('chart16a'), {
    cats: ['第一场', '第二场', '第三场', '第四场', '第五场'],
    series: [{ name: '力新小学', vals: [50, 52, 47, 45, 50], color: C1 }, { name: '春风小学', vals: [45, 48, 48, 55, 56], color: C2 }],
    ymax: 60, ty: 10, labels: ['', '成绩/分'], gw: 0.7,
  });
  MStat.bars($('chart16b'), {
    cats: ['北京', '太原', '南京', '南宁'],
    series: [{ name: '2003 年', vals: [224, 181, 297, 348], color: C1 }, { name: '2011 年', vals: [286, 308, 317, 351], color: C2 }],
    ymax: 400, ty: 50, labels: ['', '数量/天'], gw: 0.66,
  });
}

/* ---------- 第 9 页：拖动直条画图 ---------- */
const W_CATS = ['营养不良', '体重较轻', '体重正常', '超重', '肥胖'];
const W_ANS = [[1, 6, 11, 4, 2], [3, 9, 9, 2, 1]]; // 课本 p92 练习十六第 4 题
function initDraw() {
  const st = W_ANS.map((r) => r.map(() => 0));
  let checked = false;
  const gw = 0.62;
  const bw = gw / 2;
  const b = MStat.bars($('chartDraw'), {
    cats: W_CATS,
    series: [0, 1].map((k) => ({ name: k ? '女生' : '男生', vals: () => st[k], color: k ? C2 : C1 })),
    ymax: 12, ty: 2, labels: ['', '数量/人'], gw, below: 0.2,
  });
  const cls = () => {
    $('chartDraw').querySelectorAll('.sbar').forEach((p) => p.classList.remove('good', 'bad'));
    if (!checked) return;
    [0, 1].forEach((k) => W_CATS.forEach((_, i) => {
      const p = $('chartDraw').querySelectorAll(`.sbar.s${k}`)[i];
      if (p) p.classList.add(st[k][i] === W_ANS[k][i] ? 'good' : 'bad');
    }));
  };
  [0, 1].forEach((k) => W_CATS.forEach((_, i) => {
    const cx = i + 0.5 - gw / 2 + k * bw + bw / 2;
    b.drag(() => [cx, st[k][i]], (x, y) => { st[k][i] = Math.max(0, Math.min(12, Math.round(y))); checked = false; $('drawSay').textContent = ''; }, { r: 6, hit: 13 });
  }));
  b.onUpdate = cls;
  $('drawCheck').addEventListener('click', () => {
    checked = true;
    const wrong = [0, 1].reduce((n, k) => n + W_CATS.filter((_, i) => st[k][i] !== W_ANS[k][i]).length, 0);
    $('drawSay').textContent = wrong ? `还有 ${wrong} 个直条不对（红色），再看看表里的数据。` : '全部画对了！一格表示 2 人，单数画在两条格线中间。';
    b.update();
  });
  $('drawReset').addEventListener('click', () => { st.forEach((r) => r.fill(0)); checked = false; $('drawSay').textContent = ''; b.update(); });
  b.update();
}

/* ---------- 第 10 页：两种分组方式 ---------- */
const CLS_DATA = { 一班: [8, 10, 7], 二班: [6, 12, 8] }; // 书法、绘画、剪纸
function initGroup() {
  const host = $('chartGrp');
  const draw = (k) => {
    host.innerHTML = '';
    host.className = 'chart';
    const groups = ['书法', '绘画', '剪纸'];
    const classes = Object.keys(CLS_DATA);
    const o = k === 0
      ? { cats: groups, series: classes.map((c, s) => ({ name: c, vals: CLS_DATA[c], color: [C1, C2][s] })) }
      : { cats: classes, series: groups.map((g, s) => ({ name: g, vals: classes.map((c) => CLS_DATA[c][s]), color: [C1, C2, C3][s] })), gw: 0.7 };
    MStat.bars(host, { ...o, ymax: 14, ty: 2, labels: ['', '数量/人'] });
    $('grpLegend').innerHTML = o.series.map((s) => `<span><i style="background:${s.color}"></i>${s.name}</span>`).join('');
  };
  $('grpPick').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    $('grpPick').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    draw(+btn.dataset.k);
  });
  draw(0);
}

window.LESSON = {
  init() {
    initMini();
    initMerge();
    initEx2();
    initEx16();
    initDraw();
    initGroup();
  },
};
