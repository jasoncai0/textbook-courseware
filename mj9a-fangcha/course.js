'use strict';
/* 九上 3.4 方差 · 本课互动：图 3-3 两厂散点图、差的表格、偏差正方形（拖点看方差）、习题 4 折线图。
 * 直径一律以 0.1 mm 为单位存成整数（40.2 → +2），计算精确，显示时再换回 mm。 */
const { board, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const boards = [];

const RAW = {
  A: [40.0, 39.9, 40.0, 40.1, 40.2, 39.8, 40.0, 39.9, 40.0, 40.1],
  B: [40.0, 40.2, 39.8, 40.1, 39.9, 40.1, 39.9, 40.2, 39.8, 40.0],
};
const tenths = (xs) => xs.map((d) => Math.round((d - 40) * 10));
const mm = (t) => (40 + t / 10).toFixed(1);
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
const variance = (xs) => { const m = mean(xs); return xs.reduce((a, x) => a + (x - m) ** 2, 0) / xs.length; };

/* ---------- 第 4 页：图 3-3 ---------- */
function scatter(el, key) {
  const ts = tenths(RAW[key]);
  const b = board(el, { x: [-0.2, 11.4], y: [-3.6, 3.9], w: 460, h: 300, ticks: [1, 1], labels: ['序号', '直径/mm'], tickLabels: false, axes: false });
  b.seg([[0, -3], [11, -3]], { cls: 'ax2' });
  b.seg([[0, -3], [0, 3.6]], { cls: 'ax2' });
  b.seg([[0, 0], [11, 0]], { cls: 'meanline' });
  for (let k = -3; k <= 3; k++) b.text([0, k], mm(k), { cls: 'tk end', dx: -6, dy: 5 });
  for (let i = 1; i <= 10; i++) b.text([i, -3], String(i), { cls: 'tk mid', dy: 18 });
  ts.forEach((t, i) => b.pt([i + 1, t], { cls: 'c2', r: 6 }));
  b.update();
  boards.push(b);
}

/* ---------- 第 5 页：差的表格 ---------- */
function devTable() {
  const row = (key) => {
    const ts = tenths(RAW[key]);
    const abs = ts.reduce((a, t) => a + Math.abs(t), 0);
    const sq = ts.reduce((a, t) => a + t * t, 0);
    const d = (t) => (t === 0 ? '0' : `${t > 0 ? '' : '−'}0.${Math.abs(t)}`);
    return `<tr><th>${key} 厂：$x_i-40$</th>${ts.map((t) => `<td>${d(t)}</td>`).join('')}<td>$0$</td><td>$${fmt(abs / 10, 2)}$</td><td>$${fmt(sq / 100, 3)}$</td></tr>`;
  };
  $('devTab').innerHTML = `<tr><th>序号</th>${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => `<th>${i}</th>`).join('')}<th>差的和</th><th>绝对值的和</th><th>平方和</th></tr>${row('A')}${row('B')}`;
  tex($('devTab'));
}

/* ---------- 第 6 页：偏差正方形 ---------- */
function initSquares() {
  const st = { key: 'A', ts: { A: tenths(RAW.A), B: tenths(RAW.B) } };
  const ts = () => st.ts[st.key];
  const m = () => mean(ts());
  // 纵轴 1 格 = 0.1 mm，横轴 1 格 = 序号 1；board 默认横纵同比例，正方形就是真正的正方形
  const b = board($('sqBoard'), { x: [-0.6, 11.6], y: [-3.8, 3.8], w: 560, ticks: [1, 1], labels: ['序号', ''], tickLabels: false, axes: false });
  b.seg([[0, -3.6], [0, 3.6]], { cls: 'ax2' });
  for (let k = -3; k <= 3; k++) b.text([0, k], mm(k), { cls: 'tk end', dx: -6, dy: 5 });
  b.seg(() => [[0, m()], [11.2, m()]], { cls: 'meanline' });
  for (let i = 0; i < 10; i++) {
    // 正方形从平均数线到点，向右伸出（边长 = |差|）
    b.poly(() => {
      const t = ts()[i];
      const s = Math.abs(t - m());
      const x = i + 1;
      return [[x, m()], [x + s, m()], [x + s, t], [x, t]];
    }, { cls: 'devsq' });
  }
  for (let i = 0; i < 10; i++) {
    b.drag(() => [i + 1, ts()[i]], (x, y) => { ts()[i] = Math.round(clamp(y, -3, 3)); }, { r: 8, hit: 16 });
  }
  b.onUpdate = () => {
    const xs = ts();
    const v = variance(xs) / 100; // 0.1 mm 的平方 = 0.01 mm²
    $('sqMean').textContent = `${fmt(40 + m() / 10, 3)} mm`;
    $('sqRange').textContent = `${fmt((Math.max(...xs) - Math.min(...xs)) / 10, 2)} mm`;
    $('sqSum').textContent = '0';
    $('sqVar').textContent = `${fmt(v, 4)} mm²`;
    $('sqBar').style.width = `${Math.min(100, (v / 0.09) * 100)}%`;
    const total = xs.reduce((a, x) => a + (x - m()) ** 2, 0);
    $('sqMsg').className = 'tip feedback fb-ok';
    $('sqMsg').textContent = `10 个正方形面积之和 ${fmt(total, 3)} 格 = ${fmt(total / 100, 4)} mm²，平均每个 ${fmt(v, 4)} mm²。`;
  };
  $('sqTabs').addEventListener('click', (e) => {
    if (e.target.id === 'sqReset') { st.ts[st.key] = tenths(RAW[st.key]); b.update(); return; }
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    st.key = btn.dataset.k;
    $('sqTabs').querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
  b.update();
  boards.push(b);
}

/* ---------- 第 11 页：习题 4 折线图 ---------- */
function initFridge() {
  boards.push(MStat.line($('fridgeBoard'), {
    xs: [1, 2, 3, 4, 5, 6], x: [0, 7], y: [5.6, 14], ty: 1, w: 400, h: 260, labels: ['周次', '台'],
    xLabels: [1, 2, 3, 4, 5, 6].map((i) => [i, String(i)]),
    series: [{ vals: [7, 10, 8, 10, 12, 13], color: '#d0342c' }, { vals: [9, 10, 11, 9, 12, 9], color: '#1ea0dc' }],
  }));
}

window.LESSON = {
  init() {
    scatter($('figA'), 'A');
    scatter($('figB'), 'B');
    devTable();
    initSquares();
    initFridge();
  },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
