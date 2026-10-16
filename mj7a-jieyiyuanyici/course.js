'use strict';
/* 七上 4.2 解一元一次方程 · 本课互动：天平变形器。
 * 方程 ax + b = cx + d（a、b、c、d 为非负整数）画成天平两盘：蓝色方块是 x（质量为方程的解），金色砝码是 1。
 * 两盘质量相等时横梁水平；做“两边同时”的操作仍平衡，只动一边就倾斜（倾角按质量差计算，有上限）。 */
const { board, tex } = MathKit;
const $ = (id) => document.getElementById(id);

const EQS = [
  { name: '2x + 1 = 5', a: 2, b: 1, c: 0, d: 5, sol: 2 },
  { name: '3x = 3 + 2x', a: 3, b: 0, c: 2, d: 3, sol: 3 },
  { name: '4x + 2 = x + 11', a: 4, b: 2, c: 1, d: 11, sol: 3 },
];
const MAX_TILT = 14; // 度
const TILT_PER_UNIT = 3;

const side = (k, n) => {
  const xs = k === 0 ? '' : k === 1 ? 'x' : `${k}x`;
  if (!xs) return String(n);
  return n ? `${xs}+${n}` : xs;
};
const eqTex = (s) => `${side(s.a, s.b)}=${side(s.c, s.d)}`;

function initBalance() {
  const s = { k: 0, a: 0, b: 0, c: 0, d: 0, sol: 1, log: [], broken: false };
  const bd = board($('balBoard'), { x: [-8.8, 8.8], y: [-1, 8.4], axes: false, grid: false, w: 600 });
  const PIV = [0, 6.4];
  const ARM = 5.6;
  const mass = () => [s.a * s.sol + s.b, s.c * s.sol + s.d];
  const tilt = () => { const [l, r] = mass(); return Math.max(-MAX_TILT, Math.min(MAX_TILT, (l - r) * TILT_PER_UNIT)); };
  // 左端下沉：角度为正时左低右高
  const ends = () => { const t = (tilt() * Math.PI) / 180; return { L: [-ARM * Math.cos(t), PIV[1] - ARM * Math.sin(t)], R: [ARM * Math.cos(t), PIV[1] + ARM * Math.sin(t)] }; };
  const DROP = 3.4;
  const PAN_W = 2.6;
  const pan = (e) => [e[0], e[1] - DROP];
  // 底座与立柱
  bd.poly([[-1.6, -0.6], [1.6, -0.6], [1.6, -0.2], [-1.6, -0.2]], { cls: 'stand' });
  bd.poly([[-0.35, -0.2], [0.35, -0.2], [0.18, PIV[1]], [-0.18, PIV[1]]], { cls: 'stand' });
  bd.seg(() => { const { L, R } = ends(); return [L, R]; }, { cls: 'beam' });
  ['L', 'R'].forEach((k) => {
    bd.seg(() => { const e = ends()[k]; return [e, pan(e)]; }, { cls: 'string' });
    bd.poly(() => { const [x, y] = pan(ends()[k]); return [[x - PAN_W, y], [x + PAN_W, y], [x + PAN_W * 0.75, y - 0.45], [x - PAN_W * 0.75, y - 0.45]]; }, { cls: 'pan' });
  });
  bd.pt(PIV, { r: 7, cls: 'c2' });
  // 盘里的物品：最多 12 个槽位，x 方块在前，砝码在后；每行 4 个
  const SLOTS = 12;
  const PER_ROW = 4;
  const SZ = 0.95;
  const itemsOf = (k) => (k === 'L' ? [...Array(s.a).fill('x'), ...Array(s.b).fill('1')] : [...Array(s.c).fill('x'), ...Array(s.d).fill('1')]);
  const slotPos = (k, i) => {
    const [px, py] = pan(ends()[k]);
    const row = Math.floor(i / PER_ROW);
    const col = i % PER_ROW;
    return [px - ((PER_ROW - 1) / 2) * 1.12 + col * 1.12, py + 0.02 + row * 1.0];
  };
  ['L', 'R'].forEach((k) => {
    for (let i = 0; i < SLOTS; i++) {
      bd.poly(() => {
        const it = itemsOf(k)[i];
        if (!it) return [];
        const [x, y] = slotPos(k, i);
        const w = it === 'x' ? SZ / 2 : SZ * 0.36;
        const h = it === 'x' ? SZ * 0.92 : SZ * 0.62;
        return [[x - w, y], [x + w, y], [x + w, y + h], [x - w, y + h]];
      }, { cls: 'item' }).dataset.k = `${k}${i}`;
      bd.text(() => (itemsOf(k)[i] ? slotPos(k, i) : null), () => itemsOf(k)[i] || '', { cls: 'lb c itl', dy: -5 });
    }
  });
  const colorItems = () => {
    ['L', 'R'].forEach((k) => {
      const its = itemsOf(k);
      bd.svg.querySelectorAll(`[data-k^="${k}"]`).forEach((p) => {
        const i = +p.dataset.k.slice(1);
        p.setAttribute('class', its[i] === 'x' ? 'itx' : 'itw');
      });
    });
  };
  bd.onUpdate = () => {
    colorItems();
    $('balEq').innerHTML = `$${eqTex(s)}$`;
    tex($('balEq'));
    $('balLog').innerHTML = s.log.map((l) => `<p class="${l.bad ? 'bad' : ''}">${l.t}</p>`).join('');
    tex($('balLog'));
    const m = $('balMsg');
    const [l, r] = mass();
    if (s.broken) { m.className = 'tip feedback fb-warn'; m.innerHTML = '天平<b>倾斜</b>了：只在一边操作，两边不再相等．点“重来”．'; }
    else if (s.a === 1 && s.b === 0 && s.c === 0) { m.className = 'tip feedback fb-ok'; m.innerHTML = `得到 $x=${s.d}$：左盘 1 个 $x$ 与右盘 ${s.d} 个 1 g 砝码平衡．代入原方程检验：两边相等 ✓`; }
    else { m.className = 'tip feedback'; m.textContent = l === r ? '天平平衡．想一想：做什么操作，能让左盘只剩一个 x？' : ''; }
    tex(m);
    ops();
  };
  const OPS = [
    { id: 'm1', t: '两边都减去砝码', ok: () => s.b >= 1 && s.d >= s.b, run: () => { s.last = s.b; s.d -= s.b; s.b = 0; }, tex: () => `两边都减去 ${s.last}` },
    { id: 'mx', t: '两边都减去 x', ok: () => s.c >= 1 && s.a >= s.c, run: () => { s.last = s.c; s.a -= s.c; s.c = 0; }, tex: () => `两边都减去 $${s.last === 1 ? '' : s.last}x$` },
    { id: 'div', t: '两边都除以 x 的个数', ok: () => s.a >= 2 && s.b === 0 && s.c === 0 && s.d % s.a === 0, run: () => { s.lastDiv = s.a; s.d /= s.a; s.a = 1; }, tex: '' },
    { id: 'bad', t: '错误示范：只左边减去 1', ok: () => s.b >= 1, run: () => { s.b -= 1; s.broken = true; }, tex: '只左边减去 1', bad: true },
  ];
  function ops() {
    $('balOps').querySelectorAll('[data-op]').forEach((btn) => {
      const op = OPS.find((o) => o.id === btn.dataset.op);
      btn.disabled = s.broken || !op.ok();
      if (op.id === 'div') btn.textContent = s.a >= 2 ? `两边都除以 ${s.a}` : '两边都除以 x 的个数';
      if (op.id === 'm1') btn.textContent = s.b >= 1 ? `两边都减去 ${s.b}` : '两边都减去砝码';
      if (op.id === 'mx') btn.textContent = s.c >= 1 ? `两边都减去 ${s.c === 1 ? '' : s.c}x` : '两边都减去 x';
    });
  }
  const load = (k) => {
    const e = EQS[k];
    Object.assign(s, { k, a: e.a, b: e.b, c: e.c, d: e.d, sol: e.sol, broken: false, log: [{ t: `$${eqTex(e)}$` }] });
    $('balTabs').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', +b.dataset.k === k));
    bd.update();
  };
  $('balTabs').innerHTML = EQS.map((e, i) => `<button class="btn" type="button" data-k="${i}">$${e.name.replace(/ /g, '')}$</button>`).join('');
  tex($('balTabs'));
  $('balTabs').addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (b) load(+b.dataset.k); });
  $('balOps').innerHTML = OPS.map((o) => `<button class="btn ${o.bad ? 'bad' : ''}" type="button" data-op="${o.id}">${o.t}</button>`).join('') + '<button class="btn" type="button" id="balReset">重来</button>';
  $('balOps').addEventListener('click', (e) => {
    const b = e.target.closest('[data-op]');
    if (b) {
      const op = OPS.find((o) => o.id === b.dataset.op);
      if (!op.ok() || s.broken) return;
      op.run();
      const what = op.id === 'div' ? `两边都除以 ${s.lastDiv}` : (typeof op.tex === 'function' ? op.tex() : op.tex);
      s.log = [...s.log, { t: `<span class="op">↓ ${what}</span>　$${eqTex(s)}$${op.bad ? '　✗ 两边不再相等' : ''}`, bad: !!op.bad }];
      bd.update();
      return;
    }
    if (e.target.id === 'balReset') load(s.k);
  });
  load(0);
}

window.LESSON = {
  init() {
    initBalance();
  },
};
