'use strict';
/* 九上 课题学习 收集数据 分析数据 探索规律 · 本课互动：树叶测量示意（函数曲线绘制）、可编辑记录表、
 * 四种估计方法对照（含极端值实验）、长—宽散点图分类器（核心）。所有统计量由表中数据实时计算。 */
const { board, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);

/* 示例数据（为演示编写，不是实测）：A 细长叶，B 椭圆叶，C 扇形叶；单位 cm */
const SP = [
  { name: 'A', color: '#2f7d6b', L: [9.6, 10.2, 8.8, 11.0, 9.9, 10.5, 9.1, 10.8, 9.4, 10.0], W: [1.4, 1.5, 1.3, 1.6, 1.4, 1.5, 1.4, 1.5, 1.3, 1.4] },
  { name: 'B', color: '#1d6fa5', L: [8.2, 7.6, 9.0, 8.5, 7.9, 8.8, 8.0, 7.4, 8.6, 8.3], W: [3.6, 3.4, 4.0, 3.7, 3.5, 3.9, 3.6, 3.3, 3.8, 3.7] },
  { name: 'C', color: '#d9711c', L: [5.0, 4.6, 5.4, 4.8, 5.2, 4.4, 5.1, 4.9, 5.3, 4.7], W: [6.8, 6.3, 7.2, 6.6, 7.0, 6.0, 6.9, 6.5, 7.3, 6.4] },
];
const OUTLIER = { L: 8.0, W: 1.6 };
const st = { sp: 0, outlier: false };

const sum = (a) => a.reduce((s, v) => s + v, 0);
const mean = (a) => sum(a) / a.length;
const median = (a) => { const b = [...a].sort((x, y) => x - y); const n = b.length; return n % 2 ? b[(n - 1) / 2] : (b[n / 2 - 1] + b[n / 2]) / 2; };
const variance = (a) => { const m = mean(a); return mean(a.map((v) => (v - m) ** 2)); };
function modes(a) {
  const cnt = new Map();
  a.forEach((v) => { const k = v.toFixed(1); cnt.set(k, (cnt.get(k) || 0) + 1); });
  const mx = Math.max(...cnt.values());
  return mx < 2 ? '无' : [...cnt].filter(([, c]) => c === mx).map(([k]) => k).join('、');
}
/** 第 i 种树叶的（有效）长、宽数组；B 可加入极端值 */
function pairs(i) {
  const s = SP[i];
  const out = s.L.map((l, k) => [l, s.W[k]]).filter(([l, w]) => l > 0 && w > 0);
  return i === 1 && st.outlier ? [...out, [OUTLIER.L, OUTLIER.W]] : out;
}
const ratios = (i) => pairs(i).map(([l, w]) => l / w);

/* ---------- 第 3 页：树叶示意 ---------- */
function drawLeaf() {
  // 叶片：沿中脉 t∈[0,1]，半宽 h(t) = H·sin(πt)^0.75·(1 − 0.35t)（基部宽、顶端尖）
  const L = 200; const H = 46; const x0 = 150; const y0 = 255;
  const half = (t) => H * Math.sin(Math.PI * t) ** 0.75 * (1 - 0.35 * t);
  const N = 120;
  let tMax = 0; let hMax = 0;
  for (let i = 0; i <= N; i += 1) { const t = i / N; if (half(t) > hMax) { hMax = half(t); tMax = t; } }
  const P = (t, side) => [x0 + side * half(t), y0 - t * L];
  const right = Array.from({ length: N + 1 }, (_, i) => P(i / N, 1));
  const left = Array.from({ length: N + 1 }, (_, i) => P(1 - i / N, -1));
  const d = [...right, ...left].map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('') + 'Z';
  const yW = y0 - tMax * L;
  $('leafFig').innerHTML = `<defs><marker id="la" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1L9 5L0 9z" fill="#1f2d3a"/></marker></defs>`
    + `<line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 + 30}" stroke="#7a5a2c" stroke-width="4"/>`
    + `<path d="${d}" fill="#9bc46a" stroke="#3b5a2c" stroke-width="2"/>`
    + `<line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 - L}" stroke="#3b5a2c" stroke-width="1.5"/>`
    + `<line x1="${x0 + 80}" y1="${y0}" x2="${x0 + 80}" y2="${y0 - L}" stroke="#1f2d3a" stroke-width="1.5" marker-start="url(#la)" marker-end="url(#la)"/>`
    + `<line x1="${x0}" y1="${y0}" x2="${x0 + 86}" y2="${y0}" stroke="#9fb0bf" stroke-dasharray="4 3"/><line x1="${x0}" y1="${y0 - L}" x2="${x0 + 86}" y2="${y0 - L}" stroke="#9fb0bf" stroke-dasharray="4 3"/>`
    + `<text x="${x0 + 90}" y="${y0 - L / 2}" class="fl s">长</text>`
    + `<line x1="${x0 - hMax}" y1="${yW}" x2="${x0 + hMax}" y2="${yW}" stroke="#c0392b" stroke-width="2" marker-start="url(#la)" marker-end="url(#la)"/>`
    + `<text x="${x0 - hMax - 34}" y="${yW + 6}" class="fl s">宽</text>`
    + `<text x="${x0 + 8}" y="${y0 + 26}" class="fl s" style="font-size:13px">叶柄（不计）</text>`;
}

/* ---------- 第 4 页：记录表 ---------- */
let refresh = () => {};
function renderRec() {
  const s = SP[st.sp];
  const n = s.L.length;
  const cells = (arr, key) => arr.map((v, k) => `<td><input type="number" step="0.1" min="0" data-key="${key}" data-k="${k}" value="${v}"></td>`).join('');
  $('recTab').innerHTML = `<tr><th>树种 ${s.name}</th>${Array.from({ length: n }, (_, k) => `<th>${k + 1}</th>`).join('')}</tr>`
    + `<tr><th>树叶的长</th>${cells(s.L, 'L')}</tr><tr><th>树叶的宽</th>${cells(s.W, 'W')}</tr>`
    + `<tr><th>长与宽的比值</th>${s.L.map((l, k) => `<td class="rt">${l > 0 && s.W[k] > 0 ? (l / s.W[k]).toFixed(2) : '—'}</td>`).join('')}</tr>`;
  const r = ratios(st.sp);
  $('recMsg').className = 'tip feedback fb-ok';
  $('recMsg').innerHTML = `树种 ${s.name}：比值从 ${Math.min(...r).toFixed(2)} 到 ${Math.max(...r).toFixed(2)}，都在 ${mean(r) > 1.2 ? '1 以上（细长）' : mean(r) < 0.85 ? '1 以下（宽扁）' : '1 附近'}．`;
}
function initRec() {
  $('spBtns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (!b) return;
    st.sp = +b.dataset.k;
    $('spBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    renderRec();
  });
  $('recTab').addEventListener('change', (e) => {
    const inp = e.target.closest('input');
    if (!inp) return;
    const v = +inp.value;
    const arr = SP[st.sp][inp.dataset.key];
    SP[st.sp][inp.dataset.key] = arr.map((x, k) => (k === +inp.dataset.k ? (Number.isFinite(v) && v > 0 ? v : 0) : x));
    renderRec(); refresh();
  });
  renderRec();
}

/* ---------- 第 5 页：估计方法 ---------- */
function renderEst() {
  $('estTab').innerHTML = '<tr><th>树种</th><th>片数</th><th>比值的平均数</th><th>比值的中位数</th><th>比值的众数（保留一位小数）</th><th>长的和 ÷ 宽的和</th><th>比值的方差</th></tr>'
    + SP.map((s, i) => {
      const r = ratios(i); const p = pairs(i);
      return `<tr class="${i === 1 && st.outlier ? 'on' : ''}"><td>${s.name}</td><td>${r.length}</td><td>${mean(r).toFixed(2)}</td><td>${median(r).toFixed(2)}</td><td>${modes(r)}</td><td>${(sum(p.map((x) => x[0])) / sum(p.map((x) => x[1]))).toFixed(2)}</td><td>${variance(r).toFixed(4)}</td></tr>`;
    }).join('');
}

/* ---------- 第 6 页：散点图分类器 ---------- */
let sc = null;
function initScatter() {
  const s = { L: 7.0, W: 3.0 };
  sc = board($('scatter'), { x: [-0.6, 8.6], y: [-0.9, 12.9], w: 520, h: 440, ticks: 1, labels: ['宽', '长'] });
  const est = () => SP.map((_, i) => median(ratios(i)));
  SP.forEach((sp, i) => {
    sc.seg(() => { const k = est()[i]; const w = Math.min(8.5, 12.8 / k); return [[0, 0], [w, k * w]]; }, { cls: `ray r${i}` });
    for (let k = 0; k < 12; k += 1) {
      sc.pt(() => { const p = pairs(i)[k]; return p ? [p[1], p[0]] : null; }, { r: 4.5, cls: `sp${i}` });
    }
    sc.text(() => { const k = est()[i]; const w = Math.min(8.2, 12.4 / k); return [w, k * w]; }, () => `${sp.name}：${est()[i].toFixed(2)}`, { cls: `lb up rl${i}`, dx: 6, dy: 4 });
  });
  sc.drag(() => [s.W, s.L], (x, y) => { s.W = Math.min(8.4, Math.max(0.5, Math.round(x * 10) / 10)); s.L = Math.min(12.6, Math.max(0.5, Math.round(y * 10) / 10)); });
  sc.onUpdate = () => {
    const r = s.L / s.W;
    $('nlL').textContent = `${fmt(s.L, 1)} cm`; $('nlW').textContent = `${fmt(s.W, 1)} cm`; $('nlR').textContent = r.toFixed(2);
    const e = est();
    const diff = e.map((k) => Math.abs(r - k) / k);
    const best = diff.indexOf(Math.min(...diff));
    const msg = $('nlMsg');
    if (diff[best] > 0.25) {
      msg.className = 'tip feedback fb-warn';
      msg.innerHTML = `比值 ${r.toFixed(2)} 与三种估计都相差较大（最接近 ${SP[best].name} 种，相差 ${Math.round(diff[best] * 100)}%）——<b>可能不是</b> A、B、C 中的一种．`;
    } else {
      msg.className = 'tip feedback fb-ok';
      msg.innerHTML = `比值 ${r.toFixed(2)} 最接近 <b>${SP[best].name} 种</b>（估计 ${e[best].toFixed(2)}，相差 ${Math.round(diff[best] * 100)}%）．`;
    }
  };
  sc.update();
}

window.LESSON = {
  init() {
    drawLeaf();
    initRec();
    renderEst();
    initScatter();
    refresh = () => { renderEst(); sc.update(); };
    $('outlier').addEventListener('click', () => {
      st.outlier = !st.outlier;
      $('outlier').textContent = st.outlier ? '去掉这片破损的叶子' : '在 B 中加入一片破损的叶子（长 8.0，宽 1.6）';
      refresh(); if (st.sp === 1) renderRec();
    });
  },
  onRender(slide) { if (sc && slide.contains(sc.svg)) sc.update(); },
};
