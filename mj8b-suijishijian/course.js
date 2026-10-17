'use strict';
/* 八下 8.1 确定事件与随机事件 · 本课互动：4 只袋子真随机摸球（课本 p39 练习 2）、调一调袋子自动判断事件类型、
 * 习题转盘（4 个等面积扇形）。 */
const $ = (id) => document.getElementById(id);
const COL = { r: '#e0533d', w: '#ffffff', k: '#2b2b2b' };
const NAME = { r: '红', w: '白', k: '黑' };
/* 课本 p39 练习 2 的四只袋子 */
const BAGS = [['w', 'w', 'w', 'r'], ['w', 'w', 'k', 'k'], ['w', 'r', 'r', 'k'], ['w', 'r', 'r', 'r']];

function bagSvg(balls, hi = -1, size = 1) {
  const n = balls.length;
  const cols = Math.min(n, 5);
  const rows = Math.ceil(n / cols);
  const r = 13 * size;
  const W = 200; const Hh = 150;
  let s = `<path d="M70 28c-6-14 10-20 16-10 6-8 22-8 28 0 6-10 22-4 16 10-4 10-8 14-6 22 30 14 50 40 46 70-4 26-34 26-78 26s-74 0-78-26c-4-30 16-56 46-70 2-8-2-12-6-22z" fill="#eef0f8" stroke="#8a93b8" stroke-width="2"/>`;
  balls.forEach((c, i) => {
    const row = Math.floor(i / cols);
    const inRow = Math.min(cols, n - row * cols);
    const x = W / 2 + ((i % cols) - (inRow - 1) / 2) * (2 * r + 3);
    const y = 118 - (rows - 1 - row) * (2 * r + 2);
    s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${COL[c]}" stroke="#556575" stroke-width="1.5"/>`;
    if (i === hi) s += `<circle cx="${x}" cy="${y}" r="${r + 4}" fill="none" stroke="#d9711c" stroke-width="2.5" stroke-dasharray="4 3"/><path d="M${x} ${y - r - 8}l-6 -9h12z" fill="#d9711c"/>`;
  });
  return `<svg viewBox="0 0 ${W} ${Hh}">${s}</svg>`;
}

/* ---------- 第 5 页：摸球 ---------- */
function initBags() {
  const rec = BAGS.map(() => ({ r: 0, w: 0, k: 0 }));
  const last = BAGS.map(() => -1);
  let rounds = 0;
  let hit5 = 0;
  const render = () => {
    $('bags').innerHTML = BAGS.map((b, i) => `<div class="bag"><b>${'①②③④'[i]}</b>${bagSvg(b, last[i])}<p>${['r', 'w', 'k'].map((c) => `${NAME[c]} ${rec[i][c]}`).join(' · ')}</p></div>`).join('');
    $('ev5').textContent = rounds ? `（已摸 ${rounds} 轮，发生了 ${hit5} 次）` : '';
  };
  const once = () => {
    const got = BAGS.map((b, i) => { const k = Math.floor(Math.random() * b.length); last[i] = k; rec[i][b[k]] += 1; return b[k]; });
    rounds += 1;
    const c = (x) => got.filter((g) => g === x).length;
    if (c('r') === 2 && c('w') === 1 && c('k') === 1) hit5 += 1;
  };
  $('draw1').addEventListener('click', () => { once(); render(); });
  $('draw20').addEventListener('click', () => { for (let i = 0; i < 20; i++) once(); render(); });
  $('drawClr').addEventListener('click', () => { rec.forEach((x) => { x.r = 0; x.w = 0; x.k = 0; }); last.fill(-1); rounds = 0; hit5 = 0; render(); });
  render();
}

/* ---------- 第 6 页：调一调袋子 ---------- */
function initMixer() {
  const n = { r: 2, w: 1, k: 1 };
  const EVENTS = [
    ['摸到红球', (c) => c === 'r'],
    ['摸到的不是黑球', (c) => c !== 'k'],
    ['摸到红球或白球', (c) => c === 'r' || c === 'w'],
  ];
  const render = () => {
    $('mixer').innerHTML = ['r', 'w', 'k'].map((c) => `<div class="mx"><i style="background:${COL[c]}"></i>${NAME[c]}球 <button type="button" class="btn" data-c="${c}" data-d="-1">−</button><b>${n[c]}</b><button type="button" class="btn" data-c="${c}" data-d="1">＋</button></div>`).join('');
    const balls = [...'r'.repeat(n.r), ...'w'.repeat(n.w), ...'k'.repeat(n.k)];
    $('bigbag').innerHTML = bagSvg(balls, -1, balls.length > 10 ? 0.8 : 1).replace(/^<svg[^>]*>|<\/svg>$/g, '');
    $('bigbag').setAttribute('viewBox', '0 0 200 150');
    const total = balls.length;
    $('evTab').innerHTML = '<tr><th>事件</th><th>类型</th><th>理由</th></tr>' + EVENTS.map(([name, ok]) => {
      if (!total) return `<tr><td>${name}</td><td>—</td><td>袋子空了，至少放 1 个球</td></tr>`;
      const yes = balls.filter(ok).length;
      const [type, cls, why] = yes === total ? ['必然事件', 'c', '每个球都满足'] : yes === 0 ? ['不可能事件', 'i', '没有一个球满足'] : ['随机事件', 'r', `${total} 个球中有 ${yes} 个满足`];
      return `<tr><td>${name}</td><td class="t-${cls}">${type}</td><td>${why}</td></tr>`;
    }).join('');
  };
  $('mixer').addEventListener('click', (e) => {
    const b = e.target.closest('[data-c]');
    if (!b) return;
    n[b.dataset.c] = Math.max(0, Math.min(6, n[b.dataset.c] + +b.dataset.d));
    render();
  });
  render();
}

/* ---------- 第 8 页：习题转盘（4 个等面积扇形：红、白、红、黄，同课本） ---------- */
function drawSpin() {
  const C = 110; const R = 96;
  const cols = ['#ef6f53', '#ffffff', '#ef6f53', '#fbe98a'];
  const off = -58; // 课本图中扇形边界不在正上方
  const pt = (d) => [C + R * Math.sin((d * Math.PI) / 180), C - R * Math.cos((d * Math.PI) / 180)];
  let s = '';
  cols.forEach((c, i) => {
    const [a, b] = [off + i * 90, off + (i + 1) * 90];
    const [x0, y0] = pt(a); const [x1, y1] = pt(b);
    s += `<path d="M${C} ${C}L${x0.toFixed(1)} ${y0.toFixed(1)}A${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}Z" fill="${c}" stroke="#333" stroke-width="1.5"/>`;
  });
  s += `<line x1="${C}" y1="${C}" x2="${C}" y2="${C - 70}" stroke="#1d3a6e" stroke-width="4"/><path d="M${C} ${C - 84}l-7 16h14z" fill="#1d3a6e"/><circle cx="${C}" cy="${C}" r="5" fill="#1d3a6e"/>`;
  $('spin41').innerHTML = s;
}

window.LESSON = {
  init() {
    initBags();
    initMixer();
    drawSpin();
  },
};
