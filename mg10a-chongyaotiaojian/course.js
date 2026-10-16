'use strict';
/* 高一上 2.2 充分条件、必要条件、充要条件 · 本课互动：开关电路（单个 / 并联 / 串联）、集合视角拖圈（习题 2.2 第 5 题）。通用部分见 ../shared/math.js */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);

/* ---------- 第 4 页：电路 ---------- */
const MODES = [
  { k: 'one', name: '只有开关 A', lit: (s) => s.A },
  { k: 'par', name: 'A、B 并联', lit: (s) => s.A || s.B },
  { k: 'ser', name: 'A、B 串联', lit: (s) => s.A && s.B },
];
const Y_BOT = 200;
// 开关：两个触点 (x, y)、(x+50, y)，闭合时闸刀放平
const sw = (id, x, y, on) => `<g class="sw" data-sw="${id}"><rect x="${x - 8}" y="${y - 40}" width="66" height="56" fill="transparent"/>`
  + `<line x1="${x}" y1="${y}" x2="${on ? x + 50 : x + 42}" y2="${on ? y : y - 28}" class="blade${on ? ' on' : ''}"/>`
  + `<circle cx="${x}" cy="${y}" r="5" class="ct"/><circle cx="${x + 50}" cy="${y}" r="5" class="ct"/><text x="${x + 25}" y="${y + 30}" class="swl">${id}</text></g>`;
function circuitSvg(mode, s) {
  const lit = MODES.find((m) => m.k === mode).lit(s);
  const frame = 'M60 120 V40 H170 M230 40 H380 V200';
  let bottom = '';
  let sws = '';
  if (mode === 'one') { bottom = 'M380 200 H245 M195 200 H60 V150'; sws = sw('A', 195, Y_BOT, s.A); }
  if (mode === 'ser') { bottom = 'M380 200 H300 M250 200 H190 M140 200 H60 V150'; sws = sw('B', 250, Y_BOT, s.B) + sw('A', 140, Y_BOT, s.A); }
  if (mode === 'par') {
    bottom = 'M380 200 H300 V165 H270 M300 200 V235 H270 M220 165 H160 V200 M220 235 H160 V200 M160 200 H60 V150';
    sws = sw('A', 220, 165, s.A) + sw('B', 220, 235, s.B);
  }
  return `<svg viewBox="0 0 440 270" aria-label="开关电路">`
    + `<path d="${frame} ${bottom}" class="wire${lit ? ' live' : ''}"/>`
    + '<line x1="40" y1="120" x2="80" y2="120" class="bat"/><line x1="48" y1="150" x2="72" y2="150" class="bat thick"/><line x1="60" y1="120" x2="60" y2="150" class="gap"/>'
    + `<circle cx="200" cy="40" r="${lit ? 34 : 0}" class="glow"/><circle cx="200" cy="40" r="22" class="lamp${lit ? ' on' : ''}"/>`
    + '<path d="M185 25 L215 55 M215 25 L185 55" class="filament"/>'
    + `<text x="200" y="92" class="swl">${lit ? '灯亮' : '灯不亮'}</text>${sws}</svg>`;
}
function initCircuit() {
  const st = { mode: 'one', A: false, B: false };
  const draw = () => {
    $('cMode').innerHTML = MODES.map((m) => `<button type="button" class="btn${m.k === st.mode ? ' solid' : ''}" data-m="${m.k}">${m.name}</button>`).join('');
    $('circuit').innerHTML = circuitSvg(st.mode, st);
    const lit = MODES.find((m) => m.k === st.mode).lit(st);
    const parts = [`A ${st.A ? '闭合' : '断开'}`];
    if (st.mode !== 'one') parts.push(`B ${st.B ? '闭合' : '断开'}`);
    const m = $('cMsg');
    m.className = `tip feedback ${lit ? 'fb-ok' : ''}`;
    m.textContent = `${parts.join('，')} → ${lit ? '灯亮' : '灯不亮'}。点开关试试。`;
  };
  $('cMode').addEventListener('click', (e) => { const b = e.target.closest('[data-m]'); if (b) { st.mode = b.dataset.m; st.A = false; st.B = false; draw(); } });
  $('circuit').addEventListener('click', (e) => { const g = e.target.closest('[data-sw]'); if (g) { st[g.dataset.sw] = !st[g.dataset.sw]; draw(); } });
  draw();
}

/* ---------- 第 9 页：集合视角 ---------- */
const W = 480;
const H = 300;
const SNAP = 6; // 圆心、半径相差不到 6 时视为相同
const PRESETS = [
  { name: '$x\\gt 2$ 与 $x\\gt 1$', A: [250, 160, 60], B: [235, 150, 115], cap: '$A=\\{x\\mid x\\gt 2\\}$，$B=\\{x\\mid x\\gt 1\\}$' },
  { name: '$a^2=b^2$ 与 $a=b$', A: [235, 150, 120], B: [205, 150, 62], cap: '$A=\\{(a,b)\\mid a^2=b^2\\}$，$B=\\{(a,b)\\mid a=b\\}$' },
  { name: '三边相等 与 等边三角形', A: [240, 150, 100], B: [240, 150, 100], cap: '$A$、$B$ 是同一个三角形集合' },
  { name: '$x\\gt y$ 与 $x^2\\gt y^2$', A: [180, 150, 90], B: [300, 150, 90], cap: '$A=\\{(x,y)\\mid x\\gt y\\}$，$B=\\{(x,y)\\mid x^2\\gt y^2\\}$' },
];
function relation(a, b) {
  const d = Math.hypot(a.x - b.x, a.y - b.y);
  if (d < SNAP && Math.abs(a.r - b.r) < SNAP) return 'eq';
  if (d + a.r <= b.r + 0.5) return 'AinB';
  if (d + b.r <= a.r + 0.5) return 'BinA';
  return 'none';
}
const REL = {
  eq: ['ok', '$A=B$：$p\\Leftrightarrow q$，$p$ 是 $q$ 的<b>充要条件</b>。'],
  AinB: ['ok', '$A\\subsetneqq B$：$p\\Rightarrow q$，$q\\nRightarrow p$，所以 $p$ 是 $q$ 的<b>充分不必要条件</b>（小范围推大范围）。'],
  BinA: ['ok', '$B\\subsetneqq A$：$q\\Rightarrow p$，$p\\nRightarrow q$，所以 $p$ 是 $q$ 的<b>必要不充分条件</b>。'],
  none: ['warn', '互不包含：$p\\nRightarrow q$，$q\\nRightarrow p$，所以 $p$ 是 $q$ 的<b>既不充分也不必要条件</b>。'],
};
function initSets() {
  const st = { A: { x: 0, y: 0, r: 0 }, B: { x: 0, y: 0, r: 0 }, drag: null };
  const setPre = (i) => {
    const p = PRESETS[i];
    st.A = { x: p.A[0], y: p.A[1], r: p.A[2] };
    st.B = { x: p.B[0], y: p.B[1], r: p.B[2] };
    $('setPre').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', +b.dataset.p === i));
    $('setCap').innerHTML = p.cap;
    tex($('setCap'));
    draw();
  };
  const circ = (k, c, cls) => `<circle cx="${c.x}" cy="${c.y}" r="${c.r}" class="set ${cls}" data-c="${k}"/>`
    + `<circle cx="${c.x + c.r}" cy="${c.y}" r="9" class="rh ${cls}" data-r="${k}"/>`;
  const draw = () => {
    const rel = relation(st.A, st.B);
    if (rel === 'eq') st.B = { ...st.A };
    const lab = (c, t, cls, dy) => `<text x="${c.x}" y="${c.y - c.r + dy}" class="setl ${cls}">${t}</text>`;
    // 小圈画在上面，方便拖动
    const order = st.A.r <= st.B.r ? [['B', st.B, 'b'], ['A', st.A, 'a']] : [['A', st.A, 'a'], ['B', st.B, 'b']];
    $('sets').innerHTML = `<svg viewBox="0 0 ${W} ${H}" aria-label="集合 A 与 B"><rect x="4" y="4" width="${W - 8}" height="${H - 8}" class="uni"/>`
      + order.map(([k, c, cls]) => circ(k, c, cls)).join('')
      + lab(st.A, 'A（p）', 'a', rel === 'eq' ? 26 : 26) + lab(st.B, 'B（q）', 'b', rel === 'eq' ? 52 : 26) + '</svg>';
    const [cls, html] = REL[rel];
    const m = $('setMsg');
    m.className = `tip feedback fb-${cls}`;
    m.innerHTML = html;
    tex(m);
  };
  const toSvg = (e) => {
    const svg = $('sets').querySelector('svg');
    const p = svg.createSVGPoint();
    p.x = e.clientX; p.y = e.clientY;
    const q = p.matrixTransform(svg.getScreenCTM().inverse());
    return [q.x, q.y];
  };
  const box = $('sets');
  box.addEventListener('pointerdown', (e) => {
    const t = e.target.closest('[data-c],[data-r]');
    if (!t) return;
    e.preventDefault();
    const [x, y] = toSvg(e);
    const k = t.dataset.c || t.dataset.r;
    st.drag = { k, resize: !!t.dataset.r, dx: x - st[k].x, dy: y - st[k].y };
    box.setPointerCapture(e.pointerId);
  });
  box.addEventListener('pointermove', (e) => {
    const d = st.drag;
    if (!d) return;
    const [x, y] = toSvg(e);
    const c = st[d.k];
    st[d.k] = d.resize
      ? { ...c, r: Math.max(30, Math.min(140, Math.min(c.x, W - c.x, c.y, H - c.y) - 6, Math.hypot(x - c.x, y - c.y))) }
      : { ...c, x: Math.max(c.r + 6, Math.min(W - c.r - 6, x - d.dx)), y: Math.max(c.r + 6, Math.min(H - c.r - 6, y - d.dy)) };
    draw();
  });
  const end = () => { st.drag = null; };
  box.addEventListener('pointerup', end);
  box.addEventListener('pointercancel', end);
  $('setPre').innerHTML = PRESETS.map((p, i) => `<button type="button" class="btn" data-p="${i}">${p.name}</button>`).join('');
  tex($('setPre'));
  $('setPre').addEventListener('click', (e) => { const b = e.target.closest('[data-p]'); if (b) setPre(+b.dataset.p); });
  setPre(0);
}

window.LESSON = {
  init() {
    initCircuit();
    initSets();
  },
};
