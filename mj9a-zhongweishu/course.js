'use strict';
/* 九上 3.2 中位数与众数 · 本课互动：拖动极端值（平均数/中位数/众数同步）、排序找中间、衬衫划记、条形/折线图。数值全部由代码计算。 */
const { board, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const boards = [];

const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
function median(xs) {
  const s = [...xs].sort((a, b) => a - b);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
}
function modes(xs) {
  const cnt = new Map();
  xs.forEach((x) => cnt.set(x, (cnt.get(x) || 0) + 1));
  const top = Math.max(...cnt.values());
  return { vals: [...cnt.keys()].filter((k) => cnt.get(k) === top).sort((a, b) => a - b), times: top };
}
const modeText = (xs) => { const m = modes(xs); return m.times === 1 ? '无（都只出现 1 次）' : `${m.vals.join(' 和 ')}（${m.times} 次）`; };

/* ---------- 第 4 页：拖动极端值 ---------- */
const DONATE = [4, 4, 2, 3, 3, 5, 7, 6, 8, 10, 80];
function initExtreme() {
  const s = { xs: [...DONATE] };
  const b = board($('exBoard'), { x: [-3, 103], y: [-2.6, 3.2], w: 1200, h: 260, ticks: [10, 0], grid: false, axes: false });
  const level = (i) => s.xs.slice(0, i).filter((v) => v === s.xs[i]).length;
  b.seg([[0, 0], [100, 0]], { cls: 'c1' });
  for (let x = 0; x <= 100; x += 5) b.seg([[x, 0], [x, x % 10 ? -0.15 : -0.3]], { cls: 'thin' });
  for (let x = 0; x <= 100; x += 10) b.text([x, -0.3], String(x), { cls: 'tk mid', dy: 18 });
  const m = () => mean(s.xs);
  const md = () => median(s.xs);
  b.poly(() => [[m(), -0.75], [m() - 1.2, -1.55], [m() + 1.2, -1.55]], { cls: 'mk-mean' });
  b.text(() => [m(), -1.55], () => `平均数 ${fmt(m(), 2)}`, { cls: 'lb mid mean-t', dy: 20 });
  b.poly(() => [[md(), 1.55], [md() - 1.2, 2.35], [md() + 1.2, 2.35]], { cls: 'mk-med' });
  b.text(() => [md(), 2.35], () => `中位数 ${fmt(md(), 2)}`, { cls: 'lb mid med-t', dy: -4 });
  s.xs.forEach((_, i) => b.drag(() => [s.xs[i], 0.42 + level(i) * 0.62], (x) => { s.xs[i] = Math.round(clamp(x, 0, 100)); }, { r: 6, hit: 10 }));
  b.onUpdate = () => {
    $('exMean').textContent = fmt(m(), 2);
    $('exMed').textContent = fmt(md(), 2);
    $('exMode').textContent = modeText(s.xs);
    const mu = m();
    const above = s.xs.filter((x) => x > mu).length;
    $('exMsg').className = `tip feedback ${above <= 2 ? 'fb-warn' : 'fb-ok'}`;
    $('exMsg').textContent = `高于平均数的有 ${above} 人，低于的有 ${s.xs.filter((x) => x < mu).length} 人。`;
  };
  $('exReset').addEventListener('click', () => { s.xs = [...DONATE]; b.update(); });
  b.update();
  boards.push(b);
}

/* ---------- 第 5 页：排一排，找中间 ---------- */
const SORTS = {
  don: [4, 4, 2, 3, 3, 5, 7, 6, 8, 10, 80],
  yi: [9.4, 10.4, 9.3, 10.4, 9.5, 10.1, 9.9, 9.4, 10.0, 0],
};
function initSort() {
  const st = { key: 'don', sorted: false };
  const row = $('sortRow');
  const render = () => {
    const xs = SORTS[st.key];
    const n = xs.length;
    const order = xs.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map(([, i]) => i);
    const slot = (i) => (st.sorted ? order.indexOf(i) : i);
    const mid = n % 2 ? [(n - 1) / 2] : [n / 2 - 1, n / 2];
    if (row.children.length !== n) row.innerHTML = xs.map(() => '<span class="card"></span>').join('');
    [...row.children].forEach((c, i) => {
      c.textContent = st.key === 'yi' ? xs[i].toFixed(1) : xs[i];
      c.style.left = `${(slot(i) / n) * 100}%`;
      c.style.width = `${100 / n - 0.8}%`;
      c.classList.toggle('mid', st.sorted && mid.includes(slot(i)));
    });
    const msg = $('sortMsg');
    if (!st.sorted) { msg.className = 'tip feedback'; msg.textContent = `共 ${n} 个数，还没排序——现在“正中间”的数没有意义。`; return; }
    msg.className = 'tip feedback fb-ok';
    const sv = [...xs].sort((a, b) => a - b);
    msg.textContent = n % 2
      ? `${n} 个数（奇数个）：正中间是第 ${(n + 1) / 2} 个，中位数 = ${sv[(n - 1) / 2]}。`
      : `${n} 个数（偶数个）：中间是第 ${n / 2}、${n / 2 + 1} 个（${sv[n / 2 - 1]} 和 ${sv[n / 2]}），中位数 = (${sv[n / 2 - 1]} + ${sv[n / 2]}) ÷ 2 = ${fmt(median(xs), 2)}。`;
  };
  $('sortGo').addEventListener('click', () => { st.sorted = !st.sorted; $('sortGo').textContent = st.sorted ? '打乱回原来的顺序' : '从小到大排一排'; render(); });
  $('sortTabs').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    st.key = btn.dataset.k; st.sorted = false;
    row.innerHTML = '';
    $('sortGo').textContent = '从小到大排一排';
    $('sortTabs').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    render();
  });
  render();
}

/* ---------- 第 6 页：衬衫尺码 ---------- */
const SHIRT = { cats: [37, 38, 39, 40, 41, 42], n: [3, 6, 14, 5, 1, 1] };
function initShirt() {
  $('shirtTab').innerHTML = `<tr><th>领口/cm</th>${SHIRT.cats.map((c) => `<td>${c}</td>`).join('')}</tr>`
    + `<tr><th>划记</th>${SHIRT.n.map((k) => `<td class="tal">${MStat.tally(k)}</td>`).join('')}</tr>`
    + `<tr><th>人数</th>${SHIRT.n.map((k) => `<td>${k}</td>`).join('')}</tr>`;
  boards.push(MStat.bars($('shirtBoard'), {
    cats: SHIRT.cats.map(String), ymax: 15, ty: 5, labels: ['领口', '人数'], w: 520, h: 260, gw: 0.5,
    series: [{ vals: SHIRT.n, color: '#4f9bd0' }],
  }));
}

/* ---------- 第 8 页：练习 2 条形图 ---------- */
function initP2() {
  boards.push(MStat.bars($('p2Board'), {
    cats: ['5', '6', '7', '8', '9', '10'], ymax: 7, ty: 1, labels: ['环数', '人数'], w: 460, h: 220, gw: 0.5,
    series: [{ vals: [1, 2, 7, 6, 3, 1], color: '#f08a6c' }],
  }));
}

/* ---------- 第 9 页：工资条形图 + 三条竖线 ---------- */
const SAL = { v: [1200, 1500, 1800, 2000, 3000, 6000, 8000, 12000, 20000], n: [4, 10, 28, 23, 17, 10, 5, 2, 1] };
function initSalary() {
  const all = SAL.v.flatMap((v, i) => Array(SAL.n[i]).fill(v));
  const k = SAL.v.length;
  const b = MStat.bars($('salBoard'), {
    cats: SAL.v.map((v) => (v >= 10000 ? `${v / 10000}万` : String(v))), ymax: 30, ty: 5, labels: ['月工资/元', '人数'], w: 600, h: 300, gw: 0.6,
    series: [{ vals: SAL.n, color: '#9fc3e0' }],
  });
  // 类目轴不是等距的数轴：把统计量按所在区间线性插到类目位置上（只用于标示，数值以读数为准）
  const xAt = (v) => {
    const i = SAL.v.findIndex((t, j) => v >= t && v <= SAL.v[j + 1]);
    const j = i < 0 ? k - 1 : i;
    const t = j === k - 1 ? 0 : (v - SAL.v[j]) / (SAL.v[j + 1] - SAL.v[j]);
    return j + 0.5 + t;
  };
  [[mean(all), 'mk-l mean-l'], [median(all), 'mk-l med-l'], [modes(all).vals[0], 'mk-l mode-l']].forEach(([v, cls]) => b.seg([[xAt(v), 0], [xAt(v), 33]], { cls }));
  b.update();
  boards.push(b);
}

/* ---------- 第 11 页：习题 2 折线图 ---------- */
function initTemp() {
  const t = [7, 6, 8, 10, 11, 7, 9, 6, 7, 8];
  boards.push(MStat.line($('tempBoard'), {
    xs: t.map((_, i) => i + 1), x: [0, 12.2], y: [4.6, 12.2], ty: 1, w: 420, h: 260, labels: ['日期', '℃'],
    xLabels: t.map((_, i) => [i + 1, String(i + 5)]),
    series: [{ vals: t, color: '#1f2d3a', values: true }],
  }));
}

window.LESSON = {
  init() {
    initExtreme();
    initSort();
    initShirt();
    initP2();
    initSalary();
    initTemp();
  },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
