'use strict';
/* 五下 复式折线统计图 · 本课互动：例 2 接着描点（核心）、移动竖线/横线读图、风信子、模型飞机、上海悉尼逐月画图。
 * 数据全部照课本，点和线由 ../shared/mzhexian.js 按数据精确计算 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const TIMES = [0, 30, 60, 90, 120, 150];
const STEEL = [95, 90, 84, 78, 72, 68]; // 课本 p23
const CERAM = [95, 74, 58, 50, 45, 41];
const CUP = {
  cats: TIMES.map(String), atAxis: true, y: [40, 100], ty: 10, minor: 2, broken: true, yName: '水温/℃', xName: '时间/分',
};
const cupSeries = (s, c) => [
  { name: '不锈钢杯', vals: s, color: MZx.COLORS[0], lbDx: [16] },
  { name: '陶瓷杯', vals: c, color: MZx.COLORS[0], dash: true, lbDy: [-1, 1, 1, 1, 1, 1], skip: [0] },
];

/* 第 3 页：接着画 90、120、150 分钟 */
function initCupDraw() {
  const first = (a) => a.map((v, i) => (i < 3 ? v : null));
  const edit = { s: 0, idx: [3, 4, 5], snap: 1 };
  const msg = $('cupMsg');
  const status = () => {
    const ans = [STEEL, CERAM];
    const hl = [0, 1].map((k) => c.vals(k).map((v, i) => (i < 3 || v === null ? '' : v === ans[k][i] ? 'ok' : 'no')));
    hl.forEach((h, k) => c.set(k, c.vals(k), { hl: h }));
    const all = hl.flat();
    const right = all.filter((x) => x === 'ok').length;
    const wrong = all.filter((x) => x === 'no').length;
    msg.className = `tip feedback ${right === 6 ? 'fb-ok' : wrong ? 'fb-warn' : ''}`;
    msg.innerHTML = right === 6 ? '<b>6 个点全部描对了！</b>两条折线画完整了。' : `已描对 <b>${right}</b> / 6 个点${wrong ? `，红圈的 ${wrong} 个点不对` : ''}。`;
  };
  edit.onChange = () => status();
  const c = MZx.chart($('cupDraw'), { ...CUP, series: cupSeries(first(STEEL), first(CERAM)), edit });
  const pick = (k) => { edit.s = k; $('drawS').classList.toggle('solid', k === 0); $('drawC').classList.toggle('solid', k === 1); };
  $('drawS').addEventListener('click', () => pick(0));
  $('drawC').addEventListener('click', () => pick(1));
  $('cupShow').addEventListener('click', () => { c.set(0, STEEL); c.set(1, CERAM); status(); });
  $('cupReset').addEventListener('click', () => { c.set(0, first(STEEL)); c.set(1, first(CERAM)); status(); });
  status();
}

/* 第 4 页：完整的图 */
function initCupFull() {
  MZx.chart($('cupFull'), { ...CUP, series: cupSeries(STEEL, CERAM) });
}

/* 第 5 页：竖线读两个水温，横线求下降到某温度的大约时间（在两次测量之间按线段估算） */
function crossTime(vals, h) {
  for (let i = 0; i + 1 < vals.length; i += 1) {
    const [a, b] = [vals[i], vals[i + 1]];
    if (a >= h && b <= h) return a === b ? TIMES[i] : TIMES[i] + ((a - h) / (a - b)) * 30;
  }
  return null;
}
function initRead() {
  const c = MZx.chart($('cupRead'), { ...CUP, series: cupSeries(STEEL, CERAM) });
  const vl = svgEl('line', { y1: c.plot.t, y2: c.plot.b, class: 'cur-v' }, c.top);
  const hl = svgEl('line', { x1: c.plot.l, x2: c.plot.r, class: 'cur-h' }, c.top);
  const st = { t: 60, h: 70 };
  const xOfT = (t) => c.X(t / 30);
  const draw = () => {
    vl.setAttribute('x1', xOfT(st.t)); vl.setAttribute('x2', xOfT(st.t));
    hl.setAttribute('y1', c.Y(st.h)); hl.setAttribute('y2', c.Y(st.h));
    const i = st.t / 30;
    const [s, k] = [STEEL[i], CERAM[i]];
    const ts = crossTime(STEEL, st.h);
    const tc = crossTime(CERAM, st.h);
    const say = (t) => (t === null ? '图中没有降到这个温度' : `大约第 ${Math.round(t)} 分钟`);
    $('readMsg').innerHTML = `第 ${st.t} 分钟：不锈钢杯 ${s} ℃，陶瓷杯 ${k} ℃。<br>降到 ${st.h} ℃：不锈钢杯${say(ts)}，陶瓷杯${say(tc)}。`;
  };
  MathKit.slider($('rt'), (v) => { st.t = v; $('rtv').textContent = v; draw(); });
  MathKit.slider($('rh'), (v) => { st.h = v; $('rhv').textContent = v; draw(); });
}

/* 第 7 页：风信子（课本 p25） */
function initHyac() {
  const days = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
  MZx.chart($('hyac'), {
    cats: days.map(String), y: [0, 120], ty: 20, minor: 0, yName: '长度/mm', xName: '天',
    series: [
      { name: '根', vals: [0, 0, 15, 30, 40, 52, 65, 80, 96, 118], lbDy: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1] },
      { name: '芽', vals: [null, null, 0, 3, 10, 20, 32, 47, 58, 75], dash: true, lbDy: [1, 1, 1, -1, -1, 1, 1, 1, 1, 1], lbDx: [0, 0, 0, 0, -6], skip: [2] },
    ],
  });
}

/* 第 8 页：模型飞机（课本 p26） */
function initPlane() {
  const ts = [0, 5, 10, 15, 20, 25, 30, 35, 40];
  MZx.chart($('plane'), {
    cats: ts.map(String), atAxis: true, y: [0, 30], ty: 5, minor: 1, yName: '飞行高度/m', xName: '秒',
    series: [
      { name: '甲飞机', vals: [0, 12, 20, 24, 24, 20, 8, 0, null], labels: false },
      { name: '乙飞机', vals: [0, 10, 16, 24, 28, 25, 27, 15, 0], dash: true, labels: false, color: MZx.COLORS[0] },
    ],
  });
}

/* 第 9 页：上海、悉尼逐月画（课本 p27） */
const SH = [2, 6, 9, 16, 22, 24, 30, 28, 24, 19, 7, 7];
const SY = [25, 25, 23, 19, 15, 14, 13, 15, 17, 18, 22, 19];
function initCity() {
  const months = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
  const c = MZx.chart($('city'), {
    cats: months, y: [0, 35], ty: 5, minor: 1, yName: '平均气温/℃', xName: '月份',
    series: [
      { name: '上海市', vals: SH.map(() => null) },
      { name: '悉尼市', vals: SY.map(() => null), dash: true, color: MZx.COLORS[0], lbDy: SY.map((v, i) => (v < SH[i] ? 1 : -1)) },
    ],
  });
  let n = 0;
  const show = () => {
    c.set(0, SH.map((v, i) => (i < n ? v : null)), { lbDy: SH.map((v, i) => (v >= SY[i] ? -1 : 1)) });
    c.set(1, SY.map((v, i) => (i < n ? v : null)));
  };
  $('cityNext').addEventListener('click', () => { n = Math.min(12, n + 1); show(); });
  $('cityAll').addEventListener('click', () => { n = 12; show(); });
  $('cityReset').addEventListener('click', () => { n = 0; show(); });
}

window.LESSON = {
  init() {
    initCupDraw();
    initCupFull();
    initRead();
    initHyac();
    initPlane();
    initCity();
  },
};
