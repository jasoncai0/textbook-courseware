'use strict';
/* 五下 单式折线统计图 · 本课互动：同数据的条形图、描点连线（核心）、有/无折断号对比、点线段看增长量、
 * 估计 13 岁身高、输入自己的身高画图。所有点由 ../shared/mzhexian.js 按数据精确计算 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const AGES = ['6岁', '7岁', '8岁', '9岁', '10岁', '11岁', '12岁'];
const H = [116, 118, 121, 126, 132, 141, 144]; // 课本 p21 统计表
const BASE = { cats: AGES, y: [110, 145], ty: 5, minor: 1, broken: true, yName: '身高/cm', xName: '年龄' };

/* 第 3 页：同样数据的条形统计图 */
function initBar() {
  const c = MZx.chart($('barChart'), { ...BASE, series: [], h: 330 });
  H.forEach((v, i) => {
    svgEl('rect', { x: c.X(i) - 14, y: c.Y(v), width: 28, height: c.plot.b - c.Y(v), class: 'bar' }, c.top);
    svgEl('text', { x: c.X(i), y: c.Y(v) - 8, class: 'zx-val mid' }, c.top).textContent = v;
  });
}

/* 第 4 页：描点 */
function initDraw() {
  const msg = $('drawMsg');
  const status = (vals) => {
    const hl = vals.map((v, i) => (v === null ? '' : v === H[i] ? 'ok' : 'no'));
    const right = hl.filter((x) => x === 'ok').length;
    const wrong = hl.filter((x) => x === 'no').length;
    msg.className = `tip feedback ${right === 7 ? 'fb-ok' : wrong ? 'fb-warn' : ''}`;
    msg.innerHTML = right === 7 ? '<b>全部描对了！</b>点连成了一条折线。'
      : `已描对 <b>${right}</b> 个点${wrong ? `，有 <b>${wrong}</b> 个点不对（红圈），再看看表里的数` : ''}。`;
    return hl;
  };
  const empty = H.map(() => null);
  const c = MZx.chart($('drawChart'), {
    ...BASE,
    series: [{ name: '身高', vals: empty, labels: true }],
    edit: { s: 0, idx: H.map((_, i) => i), snap: 1, onChange: (vals) => c.set(0, vals, { hl: status(vals) }) },
  });
  $('drawClear').addEventListener('click', () => { c.set(0, empty, { hl: [] }); status(empty); });
  $('drawShow').addEventListener('click', () => { c.set(0, H, { hl: status(H) }); });
  status(empty);
}

/* 第 5 页：有、没有折断号 */
function initFull() {
  const svg = $('fullChart');
  const on = () => MZx.chart(svg, { ...BASE, series: [{ name: '身高', vals: H }] });
  const off = () => MZx.chart(svg, { ...BASE, y: [0, 150], ty: 10, minor: 0, broken: false, series: [{ name: '身高', vals: H }] });
  const pick = (b) => { $('brkOn').classList.toggle('solid', b); $('brkOff').classList.toggle('solid', !b); (b ? on : off)(); };
  $('brkOn').addEventListener('click', () => pick(true));
  $('brkOff').addEventListener('click', () => pick(false));
  on();
}

/* 第 6 页：点线段显示增长量 */
function initSeg() {
  const c = MZx.chart($('segChart'), { ...BASE, series: [{ name: '身高', vals: H }] });
  const tags = svgEl('g', {}, c.top);
  for (let i = 0; i + 1 < H.length; i += 1) {
    const [x1, y1, x2, y2] = [c.X(i), c.Y(H[i]), c.X(i + 1), c.Y(H[i + 1])];
    const hit = svgEl('line', { x1, y1, x2, y2, class: 'seg-hit' }, c.top);
    hit.addEventListener('click', () => {
      const d = H[i + 1] - H[i];
      const g = svgEl('g', { class: d === 9 ? 'tag max' : 'tag' }, tags);
      const mx = (x1 + x2) / 2 + 18;
      const my = (y1 + y2) / 2 + 22;
      svgEl('rect', { x: mx - 30, y: my - 18, width: 60, height: 26, rx: 6 }, g);
      svgEl('text', { x: mx, y: my, class: 'mid' }, g).textContent = `+${d} cm`;
    });
  }
}

/* 第 7 页：估计 13 岁 */
function initPred() {
  const msg = $('predMsg');
  const cats = [...AGES, '13岁'];
  const c = MZx.chart($('predChart'), {
    ...BASE, cats, y: [110, 155], tail: 0.5,
    series: [{ name: '身高', vals: [...H, null], until: 6 }, { name: '估计', vals: [...H.map(() => null), null], dash: true, legend: false }],
    legend: false,
    edit: {
      s: 1, idx: [7], snap: 1,
      onChange: (vals) => {
        const v = vals[7];
        const est = [...H.map((_, i) => (i === 6 ? 144 : null)), v];
        c.set(1, est, { labels: true, lbDy: [0, 0, 0, 0, 0, 0, 1, -1] });
        const ok = v >= 145 && v <= 150;
        msg.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
        msg.innerHTML = `你估计 13 岁时大约 <b>${v} cm</b>，比 12 岁${v >= 144 ? `长高 ${v - 144}` : `矮了 ${144 - v}`} cm。${ok ? '这个估计比较合理。' : v < 144 ? '身高还会变矮吗？' : '一年长这么多，比前面哪一年都快，合理吗？'}`;
      },
    },
  });
  msg.className = 'tip feedback';
  msg.textContent = '还没有估计。';
}

/* 第 8 页：我的身高（一～五年级，纵轴 100～170） */
function initMine() {
  const ins = [...document.querySelectorAll('.my-in input')];
  const c = MZx.chart($('myChart'), { cats: ['一', '二', '三', '四', '五'], y: [100, 170], ty: 10, minor: 2, broken: true, yName: '身高/cm', xName: '年级', series: [{ name: '我', vals: [null, null, null, null, null] }] });
  const draw = () => {
    const vals = ins.map((e) => { const v = parseFloat(e.value); return Number.isFinite(v) && v >= 100 && v <= 170 ? v : null; });
    c.set(0, vals);
    const ok = vals.every((v) => v !== null);
    const msg = $('myMsg');
    if (!ok) { msg.className = 'tip feedback fb-warn'; msg.textContent = '请填 100～170 之间的数。'; return; }
    const inc = vals.slice(1).map((v, i) => +(v - vals[i]).toFixed(1));
    const k = inc.indexOf(Math.max(...inc));
    msg.className = 'tip feedback';
    msg.innerHTML = `一共长高了 <b>${+(vals[4] - vals[0]).toFixed(1)}</b> cm，${['一', '二', '三', '四'][k]}年级到${['二', '三', '四', '五'][k]}年级长得最快（${inc[k]} cm）。`;
  };
  ins.forEach((e) => e.addEventListener('input', draw));
  draw();
}

window.LESSON = {
  init() {
    initBar();
    initDraw();
    initFull();
    initSeg();
    initPred();
    initMine();
  },
};
