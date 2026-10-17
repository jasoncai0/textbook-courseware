'use strict';
/* 九上 3.1 平均数 · 本课互动：平衡点（拖数据点）、问题 1 条形图、问题 2 权的滑块、练习 2 扇形图。所有数值由代码计算。 */
const { board, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const boards = [];

/* ---------- 第 3 页：平衡点 ---------- */
const A_GROUP = [164, 168, 171, 166, 170, 168, 166, 164, 169, 170, 166, 168];
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

function initBalance() {
  const s = { xs: [...A_GROUP] };
  const b = board($('balBoard'), { x: [158.5, 180.5], y: [-2.2, 3.4], w: 560, h: 320, ticks: [1, 0], grid: false, axes: false });
  // 同一数值的点往上叠：第 i 个点的层数 = 它前面相同数值的个数
  const level = (i) => s.xs.slice(0, i).filter((v) => v === s.xs[i]).length;
  const pos = (i) => [s.xs[i], 0.5 + level(i) * 0.75];
  b.seg([[159, 0], [180, 0]], { cls: 'c1' });
  for (let x = 158; x <= 180; x++) b.seg([[x, 0], [x, x % 2 ? -0.18 : -0.32]], { cls: 'thin' });
  for (let x = 160; x <= 180; x += 2) b.text([x, -0.3], String(x), { cls: 'tk mid', dy: 18 });
  const m = () => mean(s.xs);
  b.poly(() => [[m(), 0], [m() - 0.4, -1.05], [m() + 0.4, -1.05]], { cls: 'fulcrum' });
  b.text(() => [m(), -1.05], () => `x̄ = ${fmt(m(), 3)}`, { cls: 'lb mid', dy: 22 });
  s.xs.forEach((_, i) => {
    b.seg(() => [[m(), pos(i)[1]], pos(i)], { cls: s.xs[i] >= m() ? 'dev r' : 'dev l' });
    b.drag(() => pos(i), (x) => { s.xs[i] = Math.round(clamp(x, 159, 180)); }, { r: 8, hit: 16 });
  });
  b.onUpdate = () => {
    const mu = m();
    const right = s.xs.filter((v) => v > mu).reduce((a, v) => a + (v - mu), 0);
    const left = s.xs.filter((v) => v < mu).reduce((a, v) => a + (mu - v), 0);
    const max = Math.max(right, left, 1);
    $('balMean').textContent = fmt(mu, 3);
    $('balSum').textContent = `总和 ${s.xs.reduce((a, v) => a + v, 0)} ÷ 12`;
    $('balRv').textContent = fmt(right, 3);
    $('balLv').textContent = fmt(left, 3);
    $('balR').style.width = `${(right / max) * 100}%`;
    $('balL').style.width = `${(left / max) * 100}%`;
    // 偏差线颜色随点在平均数哪一侧切换
    b.svg.querySelectorAll('line.dev').forEach((l, i) => { l.setAttribute('class', `dev ${s.xs[i] >= mu ? 'r' : 'l'}`); });
  };
  $('balReset').addEventListener('click', () => { s.xs = [...A_GROUP]; b.update(); });
  b.update();
  boards.push(b);
}

/* ---------- 第 7 页：问题 1 条形图（图 3-1） ---------- */
function initQ1() {
  boards.push(MStat.bars($('q1Board'), {
    cats: ['2天', '3天', '4天', '5天', '6天'], ymax: 60, ty: 10, labels: ['天数', '人数'], w: 520, h: 330, gw: 0.5,
    series: [{ vals: [10, 30, 60, 50, 50], color: '#f08a6c' }],
  }));
}

/* ---------- 第 8 页：问题 2 权的滑块 ---------- */
const PEOPLE = [['甲', [70, 60, 86]], ['乙', [90, 75, 51]], ['丙', [60, 84, 78]]];
function initWeights() {
  const w = [5, 2, 3];
  const score = (sc) => { const t = w[0] + w[1] + w[2]; return t ? sc.reduce((a, v, k) => a + v * w[k], 0) / t : 0; };
  const vals = () => PEOPLE.map(([, sc]) => +score(sc).toFixed(1));
  const b = MStat.bars($('wBoard'), {
    cats: PEOPLE.map(([n]) => n), ymax: 100, ty: 20, labels: ['', '平均成绩'], w: 460, h: 280, gw: 0.5,
    series: [{ vals, color: '#4f9bd0' }], fmt: (v) => fmt(v, 1),
  });
  b.onUpdate = () => {
    const t = w[0] + w[1] + w[2];
    const msg = $('wMsg');
    if (!t) { msg.className = 'tip feedback fb-warn'; msg.textContent = '三个比不能都为 0。'; return; }
    const v = vals();
    const best = Math.max(...v);
    const tops = PEOPLE.filter((_, i) => v[i] === best).map(([n]) => n).join('、');
    const [, sc] = PEOPLE[v.indexOf(best)];
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = `按 $${w.join(':')}$：<b>${tops}</b>最高，$\\dfrac{${sc[0]}\\times${w[0]}+${sc[1]}\\times${w[1]}+${sc[2]}\\times${w[2]}}{${w[0]}+${w[1]}+${w[2]}}=${fmt(best, 2)}$`;
    tex(msg);
  };
  [0, 1, 2].forEach((k) => MathKit.slider($(`w${k}`), (v) => { w[k] = v; $(`w${k}v`).textContent = v; b.update(); }));
  $('wPresets').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-w]');
    if (!btn) return;
    btn.dataset.w.split(',').map(Number).forEach((v, k) => { w[k] = v; $(`w${k}`).value = v; $(`w${k}v`).textContent = v; });
    b.update();
  });
  boards.push(b);
}

window.LESSON = {
  init() {
    initBalance();
    initQ1();
    initWeights();
    MStat.pie($('lunchPie'), [{ name: '5元', v: 25 }, { name: '6元', v: 60 }, { name: '8元', v: 15 }], { r: 70, pad: 60, padY: 22, label: (it, p) => `${it.name} ${fmt(p, 1)}%` });
  },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
