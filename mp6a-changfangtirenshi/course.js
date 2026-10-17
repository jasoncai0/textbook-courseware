'use strict';
/* 六上 长方体和正方体的认识 · 本课互动：找长方体、转纸盒数“看得见的面”、数棱数顶点（分组上色）、
 * 滑块改长宽高看 6 个面的尺寸、宽高拉到和长相等变成正方体、练习一的图。
 * 立体图都由代码按尺寸精确绘制（../shared/solid3d.js 线框、poly3d.js 实体、mcube.js 长方体的面）。 */
const $ = (id) => document.getElementById(id);
const DEG = Math.PI / 180;
const VIEWS = []; // 切到某页时重新排版（隐藏页上 SVG 尺寸为 0）
const reg = (v) => { VIEWS.push(v); return v; };
const fmt = (v) => String(+v.toFixed(1));
const btnGroup = (box, onPick) => box.addEventListener('click', (e) => {
  const b = e.target.closest('[data-k]');
  if (!b) return;
  box.querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x === b));
  onPick(b.dataset.k);
});
// 观察者方向（与 solid3d / poly3d 的投影一致）
const eye = (st) => {
  const y = st.yaw * DEG;
  const p = st.pitch * DEG;
  return [-Math.sin(y) * Math.cos(p), -Math.cos(y) * Math.cos(p), Math.sin(p)];
};
const FACE_COLOR = { 前: '#f6c99a', 后: '#c6e0e6', 左: '#b9e2c4', 右: '#a9d3f0', 上: '#f7e19a', 下: '#e6c3e8' };
const boxV = (l, w, h) => [[0, 0, 0], [l, 0, 0], [l, w, 0], [0, w, 0], [0, 0, h], [l, 0, h], [l, w, h], [0, w, h]];
const BOX_F = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]];

/* 第 3 页：找长方体 */
const OBJS = [
  { n: '纸巾盒', y: 1 }, { n: '饼干盒', y: 1 }, { n: '冰箱', y: 1 }, { n: '易拉罐', y: 0, why: '圆柱' },
  { n: '砖块', y: 1 }, { n: '篮球', y: 0, why: '球' }, { n: '新华字典', y: 1 }, { n: '魔方', y: 2 },
];
function initObjs() {
  const box = $('objs');
  const on = new Set();
  box.innerHTML = OBJS.map((o, i) => `<button type="button" class="obj" data-i="${i}">${o.n}</button>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (!b) return;
    const i = +b.dataset.i;
    if (on.has(i)) on.delete(i); else on.add(i);
    b.classList.toggle('on', on.has(i));
    box.querySelectorAll('.obj').forEach((x) => x.classList.remove('ok', 'no'));
  });
  $('objChk').addEventListener('click', () => {
    let wrong = 0;
    box.querySelectorAll('.obj').forEach((b) => {
      const o = OBJS[+b.dataset.i];
      if (o.y === 2) return;
      const ok = (o.y === 1) === on.has(+b.dataset.i);
      if (!ok) wrong += 1;
      b.classList.add(ok ? 'ok' : 'no');
    });
    const msg = $('objMsg');
    msg.className = `tip feedback ${wrong ? 'fb-warn' : 'fb-ok'}`;
    msg.innerHTML = wrong ? `有 ${wrong} 个判断不对（红框），再想一想：易拉罐是<b>圆柱</b>，篮球是<b>球</b>。` : '<span class="ok">✓ 全对！</span>纸巾盒、饼干盒、冰箱、砖块、字典都是长方体。魔方先不判断，看下面的问题。';
  });
  $('objReset').addEventListener('click', () => { on.clear(); box.querySelectorAll('.obj').forEach((b) => b.classList.remove('on', 'ok', 'no')); });
}

/* 第 4 页：转纸盒，实时数朝向观察者的面 */
function initSpin() {
  const [l, w, h] = [5, 3, 2.4];
  const seen = new Set();
  const v = reg(Poly3D.view($('spin'), { w: 560, h: 440, scale: 78, yaw: -32, pitch: 24, center: [l / 2, w / 2, h / 2] }));
  v.add(() => MCube.boxFaces(l, w, h).map((f) => ({ type: 'face', pts: f.pts, out: f.out, color: FACE_COLOR[f.key], label: `${f.key}面` })));
  v.onUpdate = () => {
    const E = eye(v.state);
    const vis = MCube.boxFaces(l, w, h).filter((f) => f.out[0] * E[0] + f.out[1] * E[1] + f.out[2] * E[2] > 1e-6).map((f) => f.key);
    vis.forEach((k) => seen.add(k));
    $('spinMsg').innerHTML = `现在能看到 <b>${vis.length}</b> 个面：${vis.join('、')}面。<br>转到现在，一共见过 <b>${seen.size}</b> 个不同的面。`;
  };
  v.update();
  const VIEWS = { front: [0, 0], edge: [-45, 0], corner: [-38, 30] };
  btnGroup($('spinK'), (k) => v.animateTo(...VIEWS[k], 700));
}

/* 第 5 页：数棱、数顶点 */
function initWire() {
  const [l, w, h] = [5, 3, 2.4];
  const st = { k: 'none' };
  const V = boxV(l, w, h);
  const v = reg(Solid3D.view($('wire'), { w: 560, h: 420, scale: 80, yaw: -32, pitch: 22, center: [l / 2, w / 2, h / 2] }));
  v.solid(() => ({ V, F: BOX_F }), { cls: 'none' }); // 只当遮挡体，棱用下面的线段画（才能分组上色）
  // 三组棱：沿 x（长）、y（宽）、z（高）
  const groups = [[[0, 1], [3, 2], [4, 5], [7, 6]], [[0, 3], [1, 2], [4, 7], [5, 6]], [[0, 4], [1, 5], [2, 6], [3, 7]]];
  groups.forEach((g, gi) => g.forEach(([a, b]) => {
    v.seg(() => [V[a], V[b]], { show: () => st.k !== 'edge' });
    v.seg(() => [V[a], V[b]], { cls: `c${gi + 1}`, show: () => st.k === 'edge' });
  }));
  V.forEach((P, i) => { v.dot(P, { cls: 'c2', r: 6, show: () => st.k === 'vert' }); v.label(P, String(i + 1), { cls: 'up', dx: 8, dy: -8, show: () => st.k === 'vert' }); });
  v.update();
  const MSG = {
    none: '看不见的棱画成<b>虚线</b>。拖动图形，虚线会跟着变。',
    edge: '同一方向的棱涂同一种颜色：<b style="color:#1d6fa5">4 条</b> + <b style="color:#d9711c">4 条</b> + <b style="color:#2f7d6b">4 条</b> = 12 条。',
    vert: '上面 4 个顶点（5–8），下面 4 个顶点（1–4），一共 8 个。',
  };
  btnGroup($('wireK'), (k) => { st.k = k; v.update(); $('wireMsg').innerHTML = MSG[k]; });
}

/* 第 6 页：滑块改长宽高，表格列出 6 个面的长和宽 */
function initMeas() {
  const s = { l: 6, w: 3, h: 4 };
  const SC = 40;
  const v = reg(Poly3D.view($('meas'), { w: 560, h: 440, scale: SC, yaw: -30, pitch: 22, center: () => [s.l / 2, s.w / 2, s.h / 2] }));
  v.add(() => [
    ...MCube.boxFaces(s.l, s.w, s.h).map((f) => ({ type: 'face', pts: f.pts, out: f.out, color: FACE_COLOR[f.key] })),
    { type: 'text', p: [s.l / 2, 0, 0], text: `长 ${s.l} cm`, cls: 'dim', dx: -30, dy: 28, top: true },
    { type: 'text', p: [s.l, s.w / 2, 0], text: `宽 ${s.w} cm`, cls: 'dim', dx: 14, dy: 22, top: true },
    { type: 'text', p: [0, 0, s.h / 2], text: `高 ${s.h} cm`, cls: 'dim', dx: -86, top: true },
  ]);
  const PAIRS = [['上', '下'], ['前', '后'], ['左', '右']];
  const render = () => {
    const fs = Object.fromEntries(MCube.boxFaces(s.l, s.w, s.h).map((f) => [f.key, f.dims]));
    const shape = ([a, b]) => (a === b ? '<b>正方形</b>' : '长方形');
    $('faceTab').innerHTML = `<tr><th>面</th><th>形状</th><th>长/cm</th><th>宽/cm</th></tr>${PAIRS.map((p) => p.map((k, i) => {
      const [a, b] = fs[k];
      const [L, W] = a >= b ? [a, b] : [b, a];
      return `<tr><th style="background:${FACE_COLOR[k]}">${k}面</th><td>${shape(fs[k])}</td><td>${L}</td><td>${W}</td></tr>`;
    }).join('')).join('')}`;
    v.update();
  };
  [['mL', 'l'], ['mW', 'w'], ['mH', 'h']].forEach(([id, k]) => MathKit.slider($(id), (x) => { s[k] = x; $(`${id}v`).textContent = x; render(); }));
}

/* 第 7 页：长、宽、高三种颜色 */
function initLwh() {
  const [l, w, h] = [5, 3, 2.4];
  const V = boxV(l, w, h);
  const v = reg(Solid3D.view($('lwh'), { w: 560, h: 330, scale: 70, yaw: -32, pitch: 22, center: [l / 2, w / 2, h / 2] }));
  v.solid(() => ({ V, F: BOX_F }), { cls: 'none' });
  [[[0, 1], [3, 2], [4, 5], [7, 6]], [[0, 3], [1, 2], [4, 7], [5, 6]], [[0, 4], [1, 5], [2, 6], [3, 7]]].forEach((g, gi) => g.forEach(([a, b]) => v.seg(() => [V[a], V[b]], { cls: `c${gi + 1}` })));
  v.dot(V[1], { cls: 'c2', r: 7 });
  v.label([l / 2, 0, 0], '长', { cls: 'up', dx: -8, dy: 28 });
  v.label([l, w / 2, 0], '宽', { cls: 'up', dx: 10, dy: 22 });
  v.label([l, 0, h / 2], '高', { cls: 'up', dx: 10, dy: 6 });
  v.update();
}

/* 第 8 页：宽、高拉到和长一样 → 正方体 */
function initCube() {
  const L = 6;
  const s = { w: 2, h: 3 };
  const v = reg(Poly3D.view($('cube'), { w: 420, h: 300, scale: 34, yaw: -30, pitch: 22, center: [L / 2, 3, 3] }));
  v.add(() => MCube.boxFaces(L, s.w, s.h).map((f) => {
    const sq = Math.abs(f.dims[0] - f.dims[1]) < 1e-9;
    return { type: 'face', pts: f.pts, out: f.out, color: sq ? '#f7e19a' : '#a9d3f0' };
  }));
  const render = () => {
    const sq = MCube.boxFaces(L, s.w, s.h).filter((f) => Math.abs(f.dims[0] - f.dims[1]) < 1e-9).length;
    const cube = sq === 6;
    $('cubeMsg').className = `tip feedback ${cube ? 'fb-ok' : ''}`;
    $('cubeMsg').innerHTML = cube ? '<span class="ok">✓ 长 = 宽 = 高 = 6 cm</span>：12 条棱都相等，6 个面都是相同的正方形——<b>正方体</b>！'
      : `长 6 cm、宽 ${fmt(s.w)} cm、高 ${fmt(s.h)} cm：正方形（黄色）有 <b>${sq}</b> 个面。把宽和高都拉到 6 试试。`;
    v.update();
  };
  [['cW', 'w'], ['cH', 'h']].forEach(([id, k]) => MathKit.slider($(id), (x) => { s[k] = x; $(`${id}v`).textContent = `${fmt(x)} cm`; render(); }));
}

/* 第 10 页：练习一的图（按课本数据，线框，不旋转） */
function exBox(el, [l, w, h], labels, o = {}) {
  const v = reg(Solid3D.view(el, { w: o.w || 300, h: o.h || 170, scale: o.scale || 30, yaw: -28, pitch: 20, center: [l / 2, w / 2, h / 2], rotate: false }));
  const V = boxV(l, w, h);
  v.solid(() => ({ V, F: BOX_F }));
  if (labels[0]) v.label([l / 2, 0, 0], labels[0], { cls: 'up', dx: -16, dy: 24 });
  if (labels[1]) v.label([l, w / 2, 0], labels[1], { cls: 'up', dx: 6, dy: 22 });
  if (labels[2]) v.label([0, 0, h / 2], labels[2], { cls: 'up', dx: -44, dy: 6 });
  v.update();
}
function initEx() {
  exBox($('ex1'), [7, 4, 3], ['7 cm', '4 cm', '3 cm']);
  const two = $('ex2');
  two.innerHTML = '<div></div><div></div>';
  exBox(two.children[0], [5, 4, 5], ['5 cm', '4 cm', '5 cm'], { scale: 24, w: 220, h: 200 });
  exBox(two.children[1], [5, 5, 5], ['5 cm', '5 cm', '5 cm'], { scale: 24, w: 220, h: 200 });
  exBox($('ex3'), [5, 4, 3.5], ['5 cm', '4 cm', '3.5 cm'], { scale: 28 });
}

window.LESSON = {
  init() {
    initObjs();
    initSpin();
    initWire();
    initMeas();
    initLwh();
    initCube();
    initEx();
  },
  onRender(slide) { VIEWS.forEach((v) => { if (slide.contains(v.svg)) v.update(); }); },
};
