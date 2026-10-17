'use strict';
/* 八下 11.3 用反比例函数解决问题 · 本课互动：蓄水池（俯视等面积正方形 + 深度）、门槛读图器（问题 1/3/4）、
 * 练习 1 图像、杠杆（按比例尺）。所有数值由表达式计算。 */
const { board, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const snap = (v, st) => Math.round(v / st) * st;
const big = (v) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
const redraws = [];

/* ---------- 第 4 页：蓄水池 S = 40000 / h ---------- */
function initPool() {
  const svg = $('pool');
  const draw = (h) => {
    const S = 40000 / h;
    const side = Math.sqrt(S); // 与 S 等面积的正方形边长（m）
    const k = 1.25; // 1 m = 1.25 px（俯视与深度同一比例尺）
    const a = side * k;
    const [x0, y0] = [20 + (180 - a) / 2, 30 + (180 - a) / 2];
    const lim = Math.sqrt(6000) * k; // 6000 m² 的参照正方形
    const dh = h * 8; // 深度另用 1 m = 8 px 放大画（侧视）
    svg.innerHTML = `<text x="110" y="20" font-size="20" text-anchor="middle" fill="#1f2d3a">俯视：底面积 S</text>`
      + `<rect x="${20 + (180 - lim) / 2}" y="${30 + (180 - lim) / 2}" width="${lim}" height="${lim}" fill="none" stroke="#2f7d6b" stroke-width="2" stroke-dasharray="6 5"/>`
      + `<rect x="${x0}" y="${y0}" width="${a}" height="${a}" fill="rgba(79,155,208,.35)" stroke="#1d6fa5" stroke-width="2"/>`
      + `<text x="110" y="${y0 + a / 2 + 6}" font-size="16" text-anchor="middle" fill="#163a5a">${Math.round(S).toLocaleString('en').replace(/,/g, ' ')} m²</text>`
      + `<text x="110" y="226" font-size="12" text-anchor="middle" fill="#2f7d6b">虚线：6 000 m²（100 m × 60 m）</text>`
      + `<text x="320" y="20" font-size="20" text-anchor="middle" fill="#1f2d3a">侧视：深度 h</text>`
      + `<line x1="250" y1="40" x2="390" y2="40" stroke="#556575" stroke-width="2"/>`
      + `<rect x="270" y="40" width="100" height="${dh}" fill="rgba(79,155,208,.35)" stroke="#1d6fa5" stroke-width="2"/>`
      + `<text x="378" y="${40 + dh / 2 + 5}" font-size="16" fill="#163a5a">${fmt(h)} m</text>`;
  };
  MathKit.slider($('hIn'), (h) => {
    $('hV').textContent = fmt(h);
    const S = 40000 / h;
    const ok = S <= 6000;
    draw(h);
    const m = $('poolMsg');
    m.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
    m.innerHTML = `$h=${fmt(h)}$ 时，$S=\\dfrac{40\\,000}{${fmt(h)}}${Number.isInteger(S) ? '=' : '\\approx'}${big(Math.round(S))}$ m²；${ok ? '不超过 6 000 m²，放得下 ✓' : '超过 6 000 m²，放不下'}．`;
    tex(m);
  });
}

/* ---------- 第 7 页：门槛读图器 ---------- */
const TH = [
  { tab: '问题 1 录入', k: 24000, x: [-30, 440], y: [-60, 560], ticks: [50, 100], labels: ['v', 't'], c: 180, cStep: 10, cMin: 60, cMax: 500, from: 45,
    q: '$t=\\dfrac{24\\,000}{v}$，要求 $t\\le {C}$（分）．', xu: '字/分', yu: '分', x0: 'v', y0: 't', d: 1 },
  { tab: '问题 3 门板', k: 900, x: [-0.4, 6.6], y: [-120, 1900], ticks: [1, 200], labels: ['S', 'p'], c: 600, cStep: 50, cMin: 150, cMax: 1800, from: 0.48,
    q: '$p=\\dfrac{900}{S}$，要求 $p\\le {C}$（Pa）．', xu: 'm²', yu: 'Pa', x0: 'S', y0: 'p', d: 2 },
  { tab: '问题 4 气球', k: 24000, x: [-0.2, 3.3], y: [-5000, 82000], ticks: [0.5, 10000], labels: ['V', 'p'], c: 40000, cStep: 2000, cMin: 8000, cMax: 80000, from: 0.29,
    q: '$p=\\dfrac{24\\,000}{V}$，要求 $p\\le {C}$（Pa）．', xu: 'm³', yu: 'Pa', x0: 'V', y0: 'p', d: 2 },
];
function initThreshold() {
  const holder = $('thBoard');
  const st = { cur: 0 };
  const boards = TH.map((c, i) => {
    const el = document.createElement('div');
    el.className = 'th-one';
    holder.appendChild(el);
    const b = board(el, { x: c.x, y: c.y, w: 560, h: 380, ticks: c.ticks, labels: c.labels });
    const f = (x) => c.k / x;
    const xb = () => c.k / c.c;
    b.fn(f, { from: c.from, to: c.x[1], cls: 'c1' });
    b.fn(f, { from: xb, to: c.x[1], cls: 'c3' });
    b.poly(() => [[xb(), 0], [c.x[1], 0], [c.x[1], c.c], [xb(), c.c]], { cls: 'band' });
    b.seg(() => [[c.x[0], c.c], [c.x[1], c.c]], { cls: 'c2' });
    b.seg(() => [[xb(), 0], [xb(), c.c]], { cls: 'dash' });
    b.pt(() => [xb(), c.c], { r: 6 });
    b.text(() => [c.x[1], c.c], () => `${c.y0} = ${c.c}`, { cls: 'lb up', dx: -100, dy: -10 });
    b.drag(() => [(c.x[0] + c.x[1]) * 0.78, c.c], (x, y) => { c.c = clamp(snap(y, c.cStep), c.cMin, c.cMax); });
    b.onUpdate = () => { if (st.cur === i) render(); };
    return b;
  });
  const render = () => {
    const c = TH[st.cur];
    const xb = c.k / c.c;
    const exact = Math.abs(+fmt(xb, c.d) - xb) < 1e-9;
    $('thQ').innerHTML = c.q.replace('{C}', big(c.c));
    $('thMsg').innerHTML = `边界：$${c.y0}=${big(c.c)}$ 时 $${c.x0}=\\dfrac{${big(c.k)}}{${big(c.c)}}${exact ? '=' : '\\approx'}${fmt(xb, c.d)}$．<br>`
      + `曲线上 $${c.y0}\\le${big(c.c)}$ 的部分（绿色）对应 $${c.x0}\\ge${fmt(xb, c.d)}$（${c.xu}）．`;
    tex($('thQ')); tex($('thMsg'));
  };
  $('thTabs').innerHTML = TH.map((c, i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-i="${i}">${c.tab}</button>`).join('');
  const pick = (i) => {
    st.cur = i;
    [...holder.children].forEach((el, j) => { el.hidden = j !== i; });
    [...$('thTabs').children].forEach((btn, j) => btn.classList.toggle('solid', j === i));
    boards[i].update();
  };
  $('thTabs').addEventListener('click', (e) => { const btn = e.target.closest('[data-i]'); if (btn) pick(+btn.dataset.i); });
  pick(0);
  redraws.push(() => boards[st.cur].update());
}

/* ---------- 第 9 页：练习 1 p = 100 / S ---------- */
function initP() {
  const b = board($('pBoard'), { x: [-0.04, 0.58], y: [-350, 4600], w: 420, h: 330, ticks: [0.1, 1000], labels: ['S', 'p'] });
  b.fn((S) => 100 / S, { from: 100 / 4300, to: 0.5, cls: 'c1' });
  b.seg([[0.1, 0], [0.1, 1000]], { cls: 'dash' }); b.seg([[0, 1000], [0.1, 1000]], { cls: 'dash' });
  b.pt([0.1, 1000], { r: 6 });
  b.pt([0.4, 250], { cls: 'c2', r: 6 }); b.text([0.4, 250], '(0.4, 250)', { cls: 'lb up', dx: -30, dy: -16 });
  b.update();
  redraws.push(() => b.update());
}

/* ---------- 第 10 页：杠杆 F·l = 800 ---------- */
function initLever() {
  const svg = $('lever');
  const PX = 100; // 1 m = 100 px
  const FN = 0.08; // 1 N = 0.08 px（1 600 N 画成 128 px）
  const draw = (l) => {
    const F = 800 / l;
    const fx = 150; // 支点
    const lx = fx - 0.5 * PX; // 阻力作用点
    const rx = fx + l * PX; // 动力作用点
    const by = 170;
    const fa = F * FN;
    const ok = F <= 500 + 1e-9;
    svg.innerHTML = `<polygon points="${fx},${by} ${fx - 14},${by + 26} ${fx + 14},${by + 26}" fill="#9fb0bf"/>`
      + `<line x1="${lx - 10}" y1="${by}" x2="${rx + 10}" y2="${by}" stroke="#8a6a3b" stroke-width="7" stroke-linecap="round"/>`
      + `<line x1="${lx}" y1="${by - 128}" x2="${lx}" y2="${by - 6}" stroke="#1d6fa5" stroke-width="4" marker-end="url(#ah)"/>`
      + `<text x="${lx}" y="${by - 134}" font-size="20" text-anchor="middle" fill="#1d6fa5">阻力 1 600 N</text>`
      + `<line x1="${rx}" y1="${by - fa - 6}" x2="${rx}" y2="${by - 6}" stroke="${ok ? '#2f7d6b' : '#d9711c'}" stroke-width="4" marker-end="url(#ah2)"/>`
      + `<text x="${rx}" y="${Math.max(16, by - fa - 12)}" font-size="20" text-anchor="middle" fill="${ok ? '#2f7d6b' : '#d9711c'}">F ≈ ${fmt(F, 0)} N</text>`
      + `<line x1="${fx}" y1="${by + 40}" x2="${lx}" y2="${by + 40}" stroke="#556575" stroke-width="1.5"/><text x="${(fx + lx) / 2}" y="${by + 58}" font-size="19" text-anchor="middle" fill="#556575">0.5 m</text>`
      + `<line x1="${fx}" y1="${by + 40}" x2="${rx}" y2="${by + 40}" stroke="#556575" stroke-width="1.5"/><text x="${(fx + rx) / 2}" y="${by + 58}" font-size="19" text-anchor="middle" fill="#556575">l = ${fmt(l, 1)} m</text>`
      + `<line x1="${fx + 1.6 * PX}" y1="${by - 20}" x2="${fx + 1.6 * PX}" y2="${by + 30}" stroke="#2f7d6b" stroke-width="1.5" stroke-dasharray="4 4"/><text x="${fx + 1.6 * PX}" y="${by + 82}" font-size="18" text-anchor="middle" fill="#2f7d6b">1.6 m</text>`
      + `<text x="${fx}" y="${by + 82}" font-size="18" text-anchor="middle" fill="#556575">支点</text>`
      + '<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#1d6fa5"/></marker>'
      + `<marker id="ah2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="${ok ? '#2f7d6b' : '#d9711c'}"/></marker></defs>`;
    const m = $('lMsg');
    m.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
    m.innerHTML = `$l=${fmt(l, 1)}$ m 时，$F=\\dfrac{800}{${fmt(l, 1)}}\\approx${fmt(F, 1)}$ N：${ok ? '不超过 500 N，<b>撬得动</b> ✓' : '超过 500 N，小明撬不动'}．`;
    tex(m);
  };
  MathKit.slider($('lIn'), (l) => { $('lV').textContent = fmt(l, 1); draw(l); });
}

window.LESSON = {
  init() { initPool(); initThreshold(); initP(); initLever(); },
  onRender() { requestAnimationFrame(() => redraws.forEach((f) => f())); },
};
