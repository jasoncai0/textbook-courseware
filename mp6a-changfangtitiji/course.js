'use strict';
/* 六上 长方体和正方体的体积 · 本课互动：例 9 小正方体长方体、摆一摆（滑块定长宽高，一排—一层—一层层摞，实时计数并记表）、
 * 例 10 三个长方体、正方体棱长滑块、练一练图、例 11 底面一层层“长高”（V = Sh）。
 * 小正方体网格由 ../shared/mcube.js 精确生成（只画露在外面的面）。 */
const $ = (id) => document.getElementById(id);
const VIEWS = [];
const reg = (v) => { VIEWS.push(v); return v; };
const fmt = (v) => String(+v.toFixed(2));
const GOLD = '#f7c948';
const GREEN = '#9fd8a8';

function voxView(el, cells, o = {}) {
  const get = typeof cells === 'function' ? cells : () => cells;
  const cen = o.center || (() => {
    const cs = get();
    const mx = (a) => Math.max(1, ...cs.map((c) => c[a] + 1));
    return [mx(0) / 2, mx(1) / 2, mx(2) / 2];
  });
  const v = reg(Poly3D.view(el, { w: o.w || 320, h: o.h || 220, scale: o.scale || 40, yaw: -30, pitch: 26, center: cen }));
  v.add(() => { const cs = get(); return cs.length ? MCube.voxels(cs, { color: o.color || GOLD }) : []; });
  v.update();
  return v;
}

/* 第 4 页：摆一摆 */
function initBuild() {
  const s = { l: 4, w: 3, h: 2, n: 24, rows: [] };
  const total = () => s.l * s.w * s.h;
  const v = voxView($('buildv'), () => MCube.block(s.l, s.w, s.h).slice(0, s.n), { w: 560, h: 420, scale: () => Math.min(80, 330 / Math.max(s.l * 0.87 + s.w * 0.5, s.h * 0.95 + (s.l * 0.5 + s.w * 0.87) * 0.42)), center: () => [s.l / 2, s.w / 2, s.h / 2], color: GREEN });
  const msg = () => {
    const n = s.n;
    const row = s.l;
    const layer = s.l * s.w;
    const done = n === total();
    $('bMsg').className = `tip feedback ${done ? 'fb-ok' : ''}`;
    $('bMsg').innerHTML = done
      ? `一排 <b>${s.l}</b> 个，一层 <b>${s.w}</b> 排：${s.l} × ${s.w} = ${layer}（个）；<b>${s.h}</b> 层：${layer} × ${s.h} = <b>${total()}</b>（个）。`
      : `已经摆了 <b>${n}</b> 个（第 ${Math.floor(n / layer) + 1} 层，这一层第 ${Math.floor((n % layer) / row) + 1} 排）……`;
  };
  let stop = null;
  const render = () => { v.update(); msg(); };
  const set = (k, x) => { if (stop) stop(); s[k] = x; $(`b${k.toUpperCase()}v`).textContent = x; s.n = total(); render(); };
  [['bL', 'l'], ['bW', 'w'], ['bH', 'h']].forEach(([id, k]) => MathKit.slider($(id), (x) => set(k, x)));
  $('bGo').addEventListener('click', () => {
    if (stop) stop();
    const T = total();
    const ms = Math.min(7000, 260 * T); // 个数多时加快
    stop = MCube.tween(0, T, ms, (x) => { s.n = Math.round(x); render(); });
  });
  $('bAdd').addEventListener('click', () => {
    const key = `${s.l}-${s.w}-${s.h}`;
    if (s.rows.includes(key) || s.rows.length >= 4) return;
    s.rows = [...s.rows, key];
    const tr = document.createElement('tr');
    tr.innerHTML = `<th>长方体${'①②③④'[s.rows.length - 1]}</th><td>${s.l}</td><td>${s.w}</td><td>${s.h}</td><td>${total()}</td><td>${total()}</td>`;
    $('bTab').appendChild(tr);
  });
}

/* 第 6 页：正方体棱长滑块 */
function initCube() {
  const s = { a: 3 };
  const v = voxView($('cubev'), () => MCube.block(s.a, s.a, s.a), { w: 420, h: 300, scale: 44, center: () => [s.a / 2, s.a / 2, s.a / 2] });
  MathKit.slider($('cA'), (a) => {
    s.a = a;
    $('cAv').textContent = a;
    $('cMsg').innerHTML = `${a} × ${a} × ${a} = <b>${a ** 3}</b>（cm³）`;
    v.update();
  });
}

/* 第 8 页：底面一层层长高 */
function initSweep() {
  const [L, W] = [5, 3];
  const s = { h: 1 };
  const v = reg(Poly3D.view($('sweepv'), { w: 560, h: 420, scale: 66, yaw: -30, pitch: 24, center: [L / 2, W / 2, 2] }));
  v.add(() => {
    const k = Math.floor(s.h + 1e-9);
    const out = [];
    if (k > 0) out.push(MCube.voxels(MCube.block(L, W, k), { color: GREEN }));
    if (s.h - k > 1e-6) out.push(Poly3D.box([0, 0, k], [L, W, s.h], { color: '#c8ecd0' }));
    out.push({ type: 'face', pts: [[0, 0, 0], [L, 0, 0], [L, W, 0], [0, W, 0]], out: [0, 0, 1], color: '#f6c99a', label: s.h < 0.05 ? '底面积 15 cm²' : undefined });
    out.push({ type: 'text', p: [L / 2, 0, 0], text: '长 5 cm', cls: 'dim', dx: -26, dy: 24, top: true });
    out.push({ type: 'text', p: [L, W / 2, 0], text: '宽 3 cm', cls: 'dim', dx: 10, dy: 20, top: true });
    return out;
  });
  MathKit.slider($('sH'), (h) => {
    s.h = h;
    $('sHv').textContent = fmt(h);
    $('sMsg').innerHTML = `底面积 S = 5 × 3 = 15（cm²），高 h = ${fmt(h)} cm<br>V = S × h = 15 × ${fmt(h)} = <b>${fmt(15 * h)}</b>（cm³）`;
    v.update();
  });
}

window.LESSON = {
  init() {
    voxView($('e9v'), MCube.block(3, 2, 2), { w: 560, h: 420, scale: 80, color: GREEN });
    initBuild();
    voxView($('t1'), MCube.block(4, 1, 1), { color: GREEN });
    voxView($('t2'), MCube.block(4, 3, 1), { color: GREEN });
    voxView($('t3'), MCube.block(4, 3, 2), { color: GREEN });
    initCube();
    voxView($('l1'), MCube.block(6, 3, 2), { w: 260, h: 220, scale: 24 });
    voxView($('l2'), MCube.block(3, 2, 5), { w: 260, h: 220, scale: 24 });
    voxView($('l3'), MCube.block(3, 3, 3), { w: 260, h: 220, scale: 26 });
    initSweep();
  },
  onRender(slide) { VIEWS.forEach((v) => { if (slide.contains(v.svg)) v.update(); }); },
};
