'use strict';
/* 高一下 14.1 获取数据的基本途径及相关概念 · 本课互动：40 尾鱼数据表与点图、民意调查对比图、
 * 6 只灯抽 3 只的全部样本、坦克序列号估计模拟。判对错见 ../shared/mcheck.js */
const { board, tex, fmt } = MathKit;
const $ = (id) => document.getElementById(id);

/* 课本 p209 案例 2：40 尾鱼的质量（g），按课本顺序 */
const FISH = [353, 432, 445, 422, 386, 405, 421, 398, 377, 389, 408, 389, 431, 394, 408, 366, 378, 399, 411, 387,
  432, 417, 400, 388, 402, 396, 369, 419, 423, 406, 398, 404, 412, 392, 388, 403, 413, 417, 376, 407];
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const sdPop = (a) => { const m = mean(a); return Math.sqrt(mean(a.map((x) => (x - m) ** 2))); };

function initFish() {
  const COLS = 10;
  const rows = [];
  for (let i = 0; i < FISH.length; i += COLS) rows.push(`<tr>${FISH.slice(i, i + COLS).map((x) => `<td>${x}</td>`).join('')}</tr>`);
  $('fishTab').innerHTML = rows.join('');
  const b = board($('fishDot'), { x: [345, 455], y: [-0.9, 5.2], w: 560, h: 220, axes: false, grid: false });
  b.seg([[345, 0], [455, 0]], { cls: 'thin' });
  for (let t = 350; t <= 450; t += 10) { b.seg([[t, 0], [t, -0.15]], { cls: 'thin' }); b.text([t, 0], String(t), { cls: 'tk', dx: -12, dy: 18 }); }
  b.text([455, 0], '质量/g', { cls: 'tk', dx: -40, dy: -8 });
  const seen = {};
  FISH.forEach((x) => {
    seen[x] = (seen[x] || 0) + 1;
    b.pt([x, 0.45 + (seen[x] - 1) * 0.55], { cls: 'c2', r: 5 });
  });
  const m = mean(FISH);
  b.seg([[m, -0.2], [m, 3.6]], { cls: 'c1' });
  b.text([m, 3.6], `x̄≈${fmt(m, 1)}`, { cls: 'lb up', dx: 6, dy: -4 });
  b.update();
}

/* 表 14-1-1：预测与实际（%） */
function initVote() {
  const b = board($('vote'), { x: [-0.2, 4.6], y: [-1, 75], w: 440, h: 300, ticks: [0, 10], labels: ['', '%'], tickLabels: true, grid: false });
  const BAR = 0.8;
  const data = [[0.6, 43, 'c1', '罗斯福'], [1.6, 57, 'c2', '兰登'], [2.9, 62, 'c1', '罗斯福'], [3.9, 38, 'c2', '兰登']];
  data.forEach(([x, v, c, name]) => {
    b.poly([[x - BAR / 2, 0], [x + BAR / 2, 0], [x + BAR / 2, v], [x - BAR / 2, v]], { cls: c === 'c1' ? 'bar1' : 'bar2' });
    b.text([x, v], `${v}%`, { cls: 'lb up', dx: -16, dy: -6 });
    b.text([x, 0], name, { cls: 'lb up', dx: -22, dy: 22 });
  });
  b.text([1.1, 0], '《文学文摘》预测', { cls: 'lb up', dx: -56, dy: 46 });
  b.text([3.4, 0], '实际得票', { cls: 'lb up', dx: -30, dy: 46 });
  b.update();
}

/* 课本 p211 思考：6 只灯抽 3 只（寿命为演示设定的示意数据） */
const LAMPS = [62, 58, 71, 66, 55, 68];
function combos3(n) {
  const out = [];
  for (let a = 0; a < n; a += 1) for (let b = a + 1; b < n; b += 1) for (let c = b + 1; c < n; c += 1) out.push([a, b, c]);
  return out;
}
function initLamps() {
  const all = combos3(LAMPS.length);
  const mu = mean(LAMPS);
  const label = (i) => `${i + 1}号`;
  $('lamps').innerHTML = LAMPS.map((x, i) => `<span class="lamp" data-i="${i}"><b>${label(i)}</b>${x}</span>`).join('');
  const mark = (pick) => document.querySelectorAll('.lamp').forEach((el) => el.classList.toggle('on', pick.includes(+el.dataset.i)));
  const avg = (c) => mean(c.map((i) => LAMPS[i]));
  $('lpDraw').addEventListener('click', () => {
    const c = all[Math.floor(Math.random() * all.length)];
    mark(c);
    $('lpMsg').innerHTML = `抽到 ${c.map(label).join('、')}：样本平均寿命 $${fmt(avg(c), 2)}$，总体平均寿命 $${fmt(mu, 2)}$。`;
    tex($('lpMsg'));
  });
  $('lpAll').addEventListener('click', () => {
    $('combos').innerHTML = `<p class="small"><b>共 ${all.length} 种样本</b>（$\\mathrm C_6^3=20$）及其平均数：</p>`
      + `<div class="cgrid">${all.map((c) => `<span>${c.map((i) => i + 1).join(',')}<i>${fmt(avg(c), 1)}</i></span>`).join('')}</div>`;
    tex($('combos'));
    mark([]);
    $('lpMsg').innerHTML = `20 个样本平均数从 $${fmt(Math.min(...all.map(avg)), 1)}$ 到 $${fmt(Math.max(...all.map(avg)), 1)}$，围绕总体平均数 $${fmt(mu, 2)}$ 波动。`;
    tex($('lpMsg'));
  });
  $('lpMsg').textContent = '点“随机抽 3 只”，看看样本平均寿命。';
}

/* 习题 14.1 第 8 题拓展：序列号估计 N̂ = m + m/k − 1 */
const N_RANGE = [120, 400];
function initTank() {
  const s = { N: 0, k: 5, ests: [] };
  const newN = () => { s.N = N_RANGE[0] + Math.floor(Math.random() * (N_RANGE[1] - N_RANGE[0] + 1)); s.ests = []; };
  const capture = () => {
    const set = new Set();
    while (set.size < s.k) set.add(1 + Math.floor(Math.random() * s.N));
    const nums = [...set].sort((a, b) => a - b);
    const m = nums[nums.length - 1];
    return { nums, m, est: m + m / s.k - 1 };
  };
  const b = board($('tkPlot'), { x: [0, 600], y: [-1.2, 10], w: 560, h: 170, axes: false, grid: false });
  b.seg([[0, 0], [600, 0]], { cls: 'thin' });
  for (let t = 0; t <= 600; t += 100) { b.seg([[t, 0], [t, -0.3]], { cls: 'thin' }); b.text([t, 0], String(t), { cls: 'tk', dx: -10, dy: 18 }); }
  b.text([600, 0], '估计值', { cls: 'tk', dx: -42, dy: -8 });
  const MAX_DOTS = 200;
  for (let i = 0; i < MAX_DOTS; i += 1) b.pt(() => s.ests[i] && s.ests[i].p, { cls: 'c2', r: 3.5 });
  const OFF = [[-1e4, -1e4], [-1e4, -1e4]]; // MathKit.board 的线段没有 show 选项：未揭晓时画到画板外（被裁掉）
  b.seg(() => (s.ests.length >= 20 ? [[s.N, -0.3], [s.N, 9.5]] : OFF), { cls: 'c1' });
  b.text(() => [s.N, 9.5], () => (s.ests.length >= 20 ? `真实 N=${s.N}` : ''), { cls: 'lb up', dx: 6, dy: 4 });
  const BIN = 10;
  const place = (est) => {
    const bin = Math.round(est / BIN) * BIN;
    const h = s.ests.filter((e) => e.bin === bin).length;
    return { bin, p: [bin, 0.3 + h * 0.45] };
  };
  const add = (r) => { if (s.ests.length < MAX_DOTS) s.ests.push({ ...place(r.est), est: r.est }); };
  const show = (r) => {
    const avg = s.ests.length ? mean(s.ests.map((e) => e.est)) : 0;
    $('tkMsg').innerHTML = (r ? `缴获编号：${r.nums.join('，')}；$m=${r.m}$，估计 $\\hat N=${fmt(r.est, 1)}$。` : '')
      + (s.ests.length ? `已估计 ${s.ests.length} 次，平均 $${fmt(avg, 1)}$${s.ests.length >= 20 ? `；真实 $N=${s.N}$` : '（估计 20 次后揭晓真实 N）'}。` : '点“缴获一批”开始。');
    tex($('tkMsg'));
    b.update();
  };
  $('tkGo').addEventListener('click', () => { const r = capture(); add(r); show(r); });
  $('tk100').addEventListener('click', () => { let r = null; for (let i = 0; i < 100; i += 1) { r = capture(); add(r); } show(r); });
  $('tkNew').addEventListener('click', () => { newN(); show(null); });
  MathKit.slider($('tkK'), (k) => { s.k = k; s.ests = []; $('tkKV').textContent = k; show(null); });
  newN();
  show(null);
}

window.LESSON = {
  init() {
    initFish();
    initVote();
    initLamps();
    initTank();
  },
};
