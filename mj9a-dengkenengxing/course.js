'use strict';
/* 九上 4.1 等可能性 · 本课互动：摸球实验（真随机数，频率条形图）、例 2 白红球实验、正十二面体与事件点选、9 张牌。
 * 所有图形由坐标计算绘制；随机数取自 crypto.getRandomValues。 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
/** [0, n) 内的均匀随机整数（拒绝采样，避免取模偏差） */
function randInt(n) {
  const buf = new Uint32Array(1);
  const lim = Math.floor(0x100000000 / n) * n;
  do crypto.getRandomValues(buf); while (buf[0] >= lim);
  return buf[0] % n;
}

/* ---------- 摸球实验 ----------
 * balls: [{ t: 标号, fill, ink }]；bars: [{ name, idx: [球的下标], p: 理论值 }]；ymax：纵轴上限 */
function ballSim(host, cfg) {
  host.innerHTML = `
    <svg class="bag" viewBox="0 0 600 170" aria-label="袋子里的小球"></svg>
    <div class="btns" data-noswipe>
      <button class="btn" data-n="1">摸 1 次</button><button class="btn" data-n="10">摸 10 次</button>
      <button class="btn" data-n="100">摸 100 次</button><button class="btn solid" data-n="1000">摸 1000 次</button>
      <button class="btn" data-n="0">清零</button>
    </div>
    <p class="sim-st"></p>
    <svg class="bars" viewBox="0 0 600 250" aria-label="各结果出现的频率"></svg>`;
  const [bag, bars] = host.querySelectorAll('svg');
  const st = host.querySelector('.sim-st');
  const cnt = cfg.balls.map(() => 0);
  let total = 0;
  let last = -1;

  // 袋子：圆角布袋 + 袋口；球排成 cfg.rows 行
  svgEl('path', { d: 'M150 40 Q130 40 120 70 L105 140 Q102 162 130 162 L470 162 Q498 162 495 140 L480 70 Q470 40 450 40 Z', class: 'sack' }, bag);
  svgEl('path', { d: 'M150 40 Q300 20 450 40', class: 'sack-mouth' }, bag);
  const per = Math.ceil(cfg.balls.length / (cfg.rows || 1));
  const ballG = cfg.balls.map((b, i) => {
    const row = Math.floor(i / per);
    const col = i % per;
    const nRow = Math.min(per, cfg.balls.length - row * per);
    const gap = 62;
    const cx = 300 + (col - (nRow - 1) / 2) * gap;
    const cy = 82 + row * 52 + (cfg.rows === 1 ? 26 : 0);
    const g = svgEl('g', { class: 'ball' }, bag);
    svgEl('circle', { cx, cy, r: 24, fill: b.fill, stroke: '#4a5a6a', 'stroke-width': 1.5 }, g);
    const t = svgEl('text', { x: cx, y: cy + 7, 'text-anchor': 'middle', fill: b.ink || '#fff', class: 'ball-t' }, g);
    t.textContent = b.t;
    return g;
  });

  // 条形图：每根条上方写频率，条内虚线标出理论值
  const n = cfg.bars.length;
  const left = 46;
  const W = 600 - left - 10;
  const H = 190;
  const top = 30;
  const Y = (v) => top + H - (v / cfg.ymax) * H;
  svgEl('line', { x1: left, x2: 600, y1: Y(0), y2: Y(0), class: 'axis' }, bars);
  cfg.yticks.forEach((v) => {
    svgEl('line', { x1: left, x2: 600, y1: Y(v), y2: Y(v), class: 'gridl' }, bars);
    svgEl('text', { x: left - 6, y: Y(v) + 5, 'text-anchor': 'end', class: 'tk' }, bars).textContent = String(v);
  });
  const slot = W / n;
  const items = cfg.bars.map((b, i) => {
    const x = left + i * slot + slot * 0.18;
    const w = slot * 0.64;
    const rect = svgEl('rect', { x, width: w, y: Y(0), height: 0, fill: b.color || '#4f9bd0', rx: 3 }, bars);
    svgEl('line', { x1: x - 4, x2: x + w + 4, y1: Y(b.p), y2: Y(b.p), class: 'pline' }, bars);
    const v = svgEl('text', { x: x + w / 2, y: Y(0) - 6, 'text-anchor': 'middle', class: 'bv' }, bars);
    svgEl('text', { x: x + w / 2, y: Y(0) + 22, 'text-anchor': 'middle', class: 'bn' }, bars).textContent = b.name;
    return { rect, v, b };
  });

  const render = () => {
    ballG.forEach((g, i) => g.classList.toggle('hit', i === last));
    items.forEach(({ rect, v, b }) => {
      const c = b.idx.reduce((s, k) => s + cnt[k], 0);
      const f = total ? c / total : 0;
      const y = Y(Math.min(f, cfg.ymax));
      rect.setAttribute('y', y);
      rect.setAttribute('height', Y(0) - y);
      v.setAttribute('y', y - 6);
      v.textContent = total ? f.toFixed(3) : '';
    });
    st.innerHTML = total
      ? `已摸 <b>${total}</b> 次，最近一次摸到 <b>${cfg.balls[last].name || cfg.balls[last].t}</b>．条形上的数是频率，虚线是 ${cfg.pText}．`
      : `点按钮开始摸球（每次摸后放回、搅匀）．虚线是 ${cfg.pText}．`;
  };
  host.querySelectorAll('button[data-n]').forEach((btn) => btn.addEventListener('click', () => {
    const k = +btn.dataset.n;
    if (!k) { cnt.fill(0); total = 0; last = -1; render(); return; }
    for (let i = 0; i < k; i++) { last = randInt(cfg.balls.length); cnt[last] += 1; }
    total += k;
    render();
  }));
  render();
}

const RED = '#d9534f';
ballSim($('sim10'), {
  balls: Array.from({ length: 10 }, (_, i) => ({ t: String(i), name: `${i} 号`, fill: '#e2674f' })),
  rows: 2,
  bars: Array.from({ length: 10 }, (_, i) => ({ name: String(i), idx: [i], p: 0.1 })),
  ymax: 0.25, yticks: [0.1, 0.2], pText: '理论上的 1/10 = 0.1',
});
ballSim($('sim3'), {
  balls: [{ t: '白', name: '白球', fill: '#fff', ink: '#163a5a' }, { t: '红1', name: '红球 1', fill: RED }, { t: '红2', name: '红球 2', fill: RED }],
  rows: 1,
  bars: [
    { name: '白球', idx: [0], p: 1 / 3, color: '#9fb0bf' }, { name: '红球1', idx: [1], p: 1 / 3, color: RED }, { name: '红球2', idx: [2], p: 1 / 3, color: RED },
    { name: '“白”', idx: [0], p: 1 / 3, color: '#6f8191' }, { name: '“红”', idx: [1, 2], p: 2 / 3, color: '#b03a2e' },
  ],
  ymax: 1, yticks: [0.5, 1], pText: '理论上的 1/3 与 2/3',
});

/* ---------- 正十二面体（面朝向读者的正投影） ----------
 * 前面 A_k（半径 r），第二层 B_k（半径 φr，同角），第三层 C_k（半径 φr，转 36°），背面 D_k（半径 r，转 36°）。 */
const PHI = (1 + Math.sqrt(5)) / 2;
const DODE_LABEL = [6, 5, 4, 3, 2]; // 前面四周 5 个面，从右上起顺时针（课本图 4-2）
function drawDode(svg, sel = new Set()) {
  const r = 62;
  const cx = 160;
  const cy = 150;
  const P = (rad, deg) => [cx + rad * Math.cos(deg * Math.PI / 180), cy + rad * Math.sin(deg * Math.PI / 180)];
  const ang = (k) => -90 + 72 * k;
  const A = (k) => P(r, ang(k % 5));
  const B = (k) => P(r * PHI, ang(k % 5));
  const C = (k) => P(r * PHI, ang(k % 5) + 36);
  const D = (k) => P(r, ang(k % 5) + 36);
  const pts = (arr) => arr.map((p) => p.join(',')).join(' ');
  svg.setAttribute('viewBox', '0 0 320 300');
  let h = '';
  for (let k = 0; k < 5; k++) { // 背面的棱（看不见，虚线）
    h += `<line x1="${C(k)[0]}" y1="${C(k)[1]}" x2="${D(k)[0]}" y2="${D(k)[1]}" class="hid"/>`;
    h += `<line x1="${D(k)[0]}" y1="${D(k)[1]}" x2="${D(k + 1)[0]}" y2="${D(k + 1)[1]}" class="hid"/>`;
  }
  for (let k = 0; k < 5; k++) {
    const face = [A(k), A(k + 1), B(k + 1), C(k), B(k)];
    const lab = DODE_LABEL[k];
    const c = face.reduce((s, p) => [s[0] + p[0] / 5, s[1] + p[1] / 5], [0, 0]);
    h += `<polygon points="${pts(face)}" class="face${sel.has(lab) ? ' on' : ''}"/><text x="${c[0]}" y="${c[1] + 7}" class="fn">${lab}</text>`;
  }
  const front = [0, 1, 2, 3, 4].map(A);
  h += `<polygon points="${pts(front)}" class="face${sel.has(1) ? ' on' : ''}"/><text x="${cx}" y="${cy + 7}" class="fn">1</text>`;
  svg.innerHTML = h;
}

const EVENTS = [
  { name: '奇数', f: (x) => x % 2 === 1 },
  { name: '偶数', f: (x) => x % 2 === 0 },
  { name: '4 的倍数', f: (x) => x % 4 === 0 },
  { name: '6 的倍数', f: (x) => x % 6 === 0 },
];
function initDode() {
  const svg = $('dode');
  const tiles = $('tiles');
  const msg = $('evMsg');
  const nums = Array.from({ length: 12 }, (_, i) => i + 1);
  tiles.innerHTML = nums.map((x) => `<span class="tile" data-x="${x}">${x}</span>`).join('');
  $('evBtns').innerHTML = EVENTS.map((e, i) => `<button class="btn" data-i="${i}">${e.name}</button>`).join('');
  drawDode(svg);
  $('evBtns').addEventListener('click', (ev) => {
    const btn = ev.target.closest('button[data-i]');
    if (!btn) return;
    const e = EVENTS[+btn.dataset.i];
    const hit = nums.filter(e.f);
    const set = new Set(hit);
    $('evBtns').querySelectorAll('button').forEach((b) => b.classList.toggle('solid', b === btn));
    tiles.querySelectorAll('.tile').forEach((t) => t.classList.toggle('on', set.has(+t.dataset.x)));
    drawDode(svg, set);
    msg.innerHTML = `“朝上的数是${e.name.replace(/^(\d)/, " $1")}”：${hit.join('、')}，含 <b>${hit.length}</b> 种结果（共 12 种）．`;
  });
}
initDode();

/* ---------- 习题 3：2～10 九张红桃牌 ---------- */
$('cards9').innerHTML = Array.from({ length: 9 }, (_, i) => `<span class="pc">${i + 2}<i>♥</i></span>`).join('');

/* ---------- 练习 3：7 个红球、3 个白球 ---------- */
$('balls73').setAttribute('viewBox', '0 0 300 40');
$('balls73').innerHTML = Array.from({ length: 10 }, (_, i) => `<circle cx="${21 + i * 29}" cy="20" r="12" fill="${i < 7 ? RED : '#fff'}" stroke="#4a5a6a" stroke-width="1.5"/>`).join('');
