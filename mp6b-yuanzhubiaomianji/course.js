'use strict';
/* 六下 圆柱的表面积 · 本课互动：商标纸沿接缝剪开、展开成长方形（3D，长度在展开过程中保持不变）、
 * 例 3 方格纸上的展开图、生活中“需要哪几个面”、截成几段增加几个底面。
 * 展开的算法：侧面上离前面那条高的弧长为 s 的点，弯在半径 R = r ÷ (1 − t) 的圆上；t = 1 时 R 无穷大，就摊平了。
 * 弧长 s 不变，所以展开后长方形的长精确等于底面周长 2πr、宽等于高 h。 */
const $ = (id) => document.getElementById(id);
const VIEWS = [];
const reg = (v) => { VIEWS.push(v); return v; };
const fmt = (v, d = 2) => String(+v.toFixed(d));
const PI = 3.14;
const btnGroup = (box, onPick) => box.addEventListener('click', (e) => {
  const b = e.target.closest('[data-k]');
  if (!b) return;
  box.querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x === b));
  onPick(b.dataset.k);
});
const disk = (r, z, n = 72) => Array.from({ length: n }, (_, i) => [r * Math.cos((2 * Math.PI * i) / n), r * Math.sin((2 * Math.PI * i) / n), z]);

/* 侧面上弧长 s 处（s ∈ [−πr, πr]，0 为正前方那条高）在展开进度 t 时的位置 */
function unrollPt(s, z, r, t) {
  if (t >= 0.999) return [s, -r, z];
  const R = r / (1 - t);
  return [R * Math.sin(s / R), -r + R - R * Math.cos(s / R), z];
}

/* ---------- 第 3 页：剪开商标纸 ---------- */
const CANS = { e2: { d: 11, h: 15, sc: 14.5 }, e3: { d: 2, h: 2, sc: 80 } };
function initUnroll() {
  const st = { k: 'e2', t: 0 };
  const N = 72;
  const v = reg(Poly3D.view($('unroll'), { w: 620, h: 360, scale: () => CANS[st.k].sc, yaw: 0, pitch: 14, rotate: false, center: () => [0, -CANS[st.k].d / 2, CANS[st.k].h / 2 - 0.08 * CANS[st.k].h] }));
  v.add(() => {
    const { d, h } = CANS[st.k];
    const r = d / 2;
    const out = [Poly3D.revolve({ r1: r * 0.95, r2: r * 0.95, h }, { color: '#d5dbe1' })];
    for (let i = 0; i < N; i += 1) {
      const s0 = -Math.PI * r + (2 * Math.PI * r * i) / N;
      const s1 = s0 + (2 * Math.PI * r) / N;
      const P = (s, z) => unrollPt(s, z, r, st.t);
      const lines = (za, zb) => {
        const L = [];
        if (za === 0) L.push([P(s0, 0), P(s1, 0), '']);
        if (zb === h) L.push([P(s0, h), P(s1, h), '']);
        if (i === 0) L.push([P(s0, za), P(s0, zb), 'cut']);
        if (i === N - 1) L.push([P(s1, za), P(s1, zb), 'cut']);
        return L;
      };
      // 每条竖条一整块（高度相同，前后遮挡按深度排序才可靠）；黄绿相间像商标纸的花纹
      out.push({ type: 'face', pts: [P(s0, 0), P(s1, 0), P(s1, h), P(s0, h)], color: i % 12 < 6 ? '#f7d774' : '#a8d58a', lines: lines(0, h) });
    }
    if (st.t >= 0.999) {
      const y = -r - 0.02;
      const L = Math.PI * r;
      const off = 0.09 * h;
      out.push({ type: 'line', a: [-L, y, -off], b: [L, y, -off], cls: 'dim', top: true });
      out.push({ type: 'text', p: [0, y, -off], text: `长 = 底面周长 = π × ${d} ≈ ${fmt(PI * d, 2)} cm`, cls: 'dimt', dy: 26, top: true });
      out.push({ type: 'line', a: [L + off * 0.6, y, 0], b: [L + off * 0.6, y, h], cls: 'dim', top: true });
      out.push({ type: 'text', p: [L + off * 0.6, y, h / 2], text: `宽 = 高 = ${h} cm`, cls: 'dimt s', dx: 12, top: true });
    }
    return out;
  });
  const sync = () => {
    v.state.pitch = 14 * (1 - st.t); // 摊平时转成正对着看，长方形的长、宽按真实比例显示
    v.update();
    $('urT').textContent = `${Math.round(st.t * 100)}%`;
  };
  MathKit.slider($('urS'), (val) => { st.t = val / 100; sync(); });
  btnGroup($('urK'), (k) => { st.k = k; sync(); });
  $('urGo').addEventListener('click', () => {
    const from = st.t > 0.5 ? 1 : 0;
    const t0 = performance.now();
    const MS = 2200;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / MS);
      st.t = from ? 1 - p : p;
      $('urS').value = Math.round(st.t * 100);
      sync();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/* ---------- 第 5 页：例 3 方格纸上的展开图（1 cm = 40 单位） ---------- */
function initNet() {
  const svg = $('netFig');
  const U = 40;
  const [x0, y0] = [40, 20];
  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, a, text) => { const e = document.createElementNS(NS, tag); Object.entries(a).forEach(([k, val]) => e.setAttribute(k, val)); if (text !== undefined) e.textContent = text; svg.appendChild(e); return e; };
  const [cols, rows] = [9, 6];
  for (let i = 0; i <= cols; i += 1) el('line', { x1: x0 + i * U, y1: y0, x2: x0 + i * U, y2: y0 + rows * U, class: 'g' });
  for (let j = 0; j <= rows; j += 1) el('line', { x1: x0, y1: y0 + j * U, x2: x0 + cols * U, y2: y0 + j * U, class: 'g' });
  const L = 2 * Math.PI * 1; // 底面周长（精确）
  const top = y0 + 2 * U;
  el('rect', { x: x0 + U, y: top, width: L * U, height: 2 * U, class: 'net-side', 'data-step': 1 });
  el('circle', { cx: x0 + 2 * U, cy: top - U, r: U, class: 'net-base', 'data-step': 2 });
  el('circle', { cx: x0 + 2 * U, cy: top + 3 * U, r: U, class: 'net-base', 'data-step': 2 });
  el('text', { x: x0 + U + (L * U) / 2, y: top + U + 8, class: 'net-t', 'data-step': 1 }, '长 ≈ 6.28 cm');
  el('text', { x: x0 + U + L * U + 8, y: top + U + 8, class: 'net-t s', 'data-step': 1 }, '宽 2 cm');
  el('path', { d: `M${x0 + 2 * U} ${top - U}h${U}`, class: 'net-r', 'data-step': 2 });
  el('text', { x: x0 + 2.5 * U, y: top - U - 8, class: 'net-t s', 'data-step': 2 }, 'r = 1 cm');
  el('text', { x: x0 + 0.5 * U, y: y0 - 4, class: 'net-t s' }, '1 cm');
}

/* ---------- 第 8 页：需要哪几个面？ ---------- */
const JOBS = [
  { k: 'gu1', t: '少先队队鼓的侧面用铝皮围成（底面直径 6 dm，高 2.6 dm）。至少需要铝皮多少平方分米？', d: 6, h: 2.6, u: 'dm²', need: ['side'], ans: '48.984' },
  { k: 'gu2', t: '队鼓上、下底面蒙的是羊皮。至少需要羊皮多少平方分米？', d: 6, h: 2.6, u: 'dm²', need: ['top', 'bot'], ans: '56.52' },
  { k: 'guan', t: '用白铁皮做一根长 2 米、管口直径 0.15 米的圆柱形通风管。至少需要白铁皮多少平方米？', d: 0.15, h: 2, u: 'm²', need: ['side'], ans: '0.942', lying: true },
  { k: 'deng', t: '底面直径 24 厘米、高 30 厘米的圆柱形灯笼，在下底面和侧面糊上彩纸。至少需要彩纸多少平方厘米？', d: 24, h: 30, u: 'cm²', need: ['side', 'bot'], ans: '2712.96' },
  { k: 'tong', t: '一个圆柱形铁皮水桶，上面没有盖，高 6 分米，底面半径 1.8 分米。大约要用铁皮多少平方分米？', d: 3.6, h: 6, u: 'dm²', need: ['side', 'bot'], ans: '77.9976', round: '约 78.0' },
  { k: 'you', t: '一个圆柱形油桶，底面直径 0.6 米，高 1 米。至少需要铁皮多少平方米？（保留两位小数）', d: 0.6, h: 1, u: 'm²', need: ['side', 'top', 'bot'], ans: '2.4492', round: '约 2.45' },
];
const PART = { side: '侧面', top: '上底面', bot: '下底面' };
function initJobs() {
  const st = { j: 0, on: new Set() };
  const J = () => JOBS[st.j];
  const v = reg(Poly3D.view($('jobFig'), { w: 420, h: 360, scale: 62, yaw: -22, pitch: 22, center: [0, 0, 1.2] }));
  v.add(() => {
    const [r, h] = [1.25, 2.4];
    const c = (k, a, b) => (st.on.has(k) ? a : b);
    const out = [];
    const N = 72;
    for (let i = 0; i < N; i += 1) {
      const a0 = (2 * Math.PI * i) / N;
      const a1 = (2 * Math.PI * (i + 1)) / N;
      const P = (a, z) => [r * Math.cos(a), r * Math.sin(a), z];
      out.push({ type: 'face', pts: [P(a0, 0), P(a1, 0), P(a1, h), P(a0, h)], color: c('side', '#f2b45c', '#eef2f6'), lines: [[P(a0, 0), P(a1, 0), ''], [P(a0, h), P(a1, h), '']] });
    }
    out.push({ type: 'face', pts: disk(r, h), color: c('top', '#6fb3df', '#f7f9fb'), lines: [] });
    out.push({ type: 'face', pts: disk(r, 0), color: c('bot', '#6fb3df', '#f7f9fb'), lines: [] });
    return out;
  });
  v.update();
  const paintBtns = () => $('jobP').querySelectorAll('[data-p]').forEach((b) => b.classList.toggle('solid', st.on.has(b.dataset.p)));
  const showJob = () => {
    st.on.clear();
    paintBtns();
    v.update();
    $('jobT').textContent = J().t;
    $('jobMsg').className = 'tip feedback';
    $('jobMsg').textContent = '需要计算哪几个面？点下面的按钮选出来，再按“检查”。';
  };
  $('jobK').innerHTML = JOBS.map((x, i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-k="${i}">${['队鼓·铝皮', '队鼓·羊皮', '通风管', '灯笼', '水桶', '油桶'][i]}</button>`).join('');
  btnGroup($('jobK'), (k) => { st.j = +k; showJob(); });
  $('jobP').addEventListener('click', (e) => {
    const b = e.target.closest('[data-p]');
    if (!b) return;
    const p = b.dataset.p;
    if (st.on.has(p)) st.on.delete(p); else st.on.add(p);
    paintBtns();
    v.update();
  });
  $('jobChk').addEventListener('click', () => {
    const j = J();
    const right = j.need.length === st.on.size && j.need.every((p) => st.on.has(p));
    const msg = $('jobMsg');
    if (!right) {
      msg.className = 'tip feedback warn';
      msg.innerHTML = `再想一想：${j.k === 'tong' ? '水桶<b>没有盖</b>。' : j.k === 'deng' ? '灯笼只糊<b>下底面</b>和侧面。' : j.k === 'guan' ? '通风管两头是<b>空</b>的。' : j.k === 'gu1' ? '铝皮只围<b>侧面</b>。' : j.k === 'gu2' ? '羊皮蒙在<b>上、下</b>两个底面。' : '油桶是<b>封闭</b>的。'}`;
      return;
    }
    const r = j.d / 2;
    const side = PI * j.d * j.h;
    const base = PI * r * r;
    const terms = [];
    if (j.need.includes('side')) terms.push(`侧面 $3.14\\times${j.d}\\times${j.h}=${fmt(side, 4)}$`);
    const nb = j.need.filter((p) => p !== 'side').length;
    if (nb) terms.push(`${nb === 2 ? '两个底面' : '一个底面'} $3.14\\times${fmt(r, 3)}^2${nb === 2 ? '\\times2' : ''}=${fmt(base * nb, 4)}$`);
    const total = (j.need.includes('side') ? side : 0) + base * nb;
    msg.className = 'tip feedback ok';
    msg.innerHTML = `✓ 需要${j.need.map((p) => PART[p]).join(' + ')}。<br>${terms.join('；<br>')}<br>合计 $${fmt(total, 4)}$ ${j.u}${j.round ? `，${j.round} ${j.u}` : ''}。`;
    MathKit.tex(msg);
  });
  showJob();
}

/* ---------- 第 9 页：截成几段 ---------- */
function initCut() {
  const svg = $('cutFig');
  const NS = 'http://www.w3.org/2000/svg';
  const draw = (n) => {
    svg.innerHTML = '';
    const W = 540;
    const gap = 16;
    const len = (W - 40 - gap * (n - 1)) / n;
    for (let i = 0; i < n; i += 1) {
      const x = 20 + i * (len + gap);
      const g = document.createElementNS(NS, 'g');
      g.innerHTML = `<rect x="${x}" y="40" width="${len}" height="80" class="log"/>`
        + `<ellipse cx="${x}" cy="80" rx="12" ry="40" class="${i ? 'newb' : 'oldb'}"/>`
        + `<ellipse cx="${x + len}" cy="80" rx="12" ry="40" class="${i < n - 1 ? 'newb' : 'oldb'}"/>`;
      svg.appendChild(g);
    }
    const add = 2 * (n - 1);
    $('cutMsg').innerHTML = `截成 ${n} 段要截 ${n - 1} 次，每截一次多出 2 个底面，一共多出 <b>${add}</b> 个底面（橙色）：$3.14\\times10^2\\times${add}=${fmt(314 * add, 2)}$（平方厘米）`;
    MathKit.tex($('cutMsg'));
  };
  btnGroup($('cutK'), (k) => draw(+k));
  draw(3);
}

window.LESSON = {
  init() {
    initUnroll();
    initNet();
    initJobs();
    initCut();
  },
  onRender(slide) { VIEWS.forEach((v) => { if (slide.contains(v.svg)) v.update(); }); },
};
