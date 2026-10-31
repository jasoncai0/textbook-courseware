'use strict';
/* 七下 课题学习 分类 想象 找规律 · 本课互动：涂色正方体（可切开拉开、按涂色面数筛选，个数由坐标逐块判断）、
 * 位置示意图、n³ 恒等式验证器。小正方体的每个面是否涂色，由它在大正方体中的坐标决定。 */
const { fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const DEG = Math.PI / 180;
const PAINT = '#f08a3c';
const WOOD = '#ead7b5';

/** 第 k 个坐标是否在边界 */
const onEdge = (v, n) => v === 0 || v === n - 1;
/** 涂色面数：每个落在边界上的坐标贡献 1 面（n = 1 时 6 面） */
const paintCount = (p, n) => (n === 1 ? 6 : p.filter((v) => onEdge(v, n)).length);

/** 涂色正方体视图 */
function paintedCube(el, o) {
  const st = { n: o.n, gap: o.gap, cat: 'all' };
  const v = Poly3D.view(el, {
    w: 520, h: 440, yaw: -32, pitch: 24,
    scale: () => 230 / (st.n * (1 + st.gap) + 0.6),
    center: () => { const c = (st.n * (1 + st.gap) - st.gap) / 2; return [c, c, c]; },
  });
  const cells = () => {
    const out = [];
    for (let i = 0; i < st.n; i += 1) for (let j = 0; j < st.n; j += 1) for (let k = 0; k < st.n; k += 1) out.push([i, j, k]);
    return out;
  };
  const visible = (p) => st.cat === 'all' || paintCount(p, st.n) === +st.cat;
  v.add(() => {
    const y = v.state.yaw * DEG;
    const pt = v.state.pitch * DEG;
    const E = [-Math.sin(y) * Math.cos(pt), -Math.cos(y) * Math.cos(pt), Math.sin(pt)];
    const s = 1 + st.gap;
    const faces = [];
    cells().filter(visible).forEach((p) => {
      const [x0, y0, z0] = p.map((c) => c * s);
      // 6 个面：轴 a、方向 d（−1 / +1）
      for (let a = 0; a < 3; a += 1) {
        for (const d of [-1, 1]) {
          const out = [0, 0, 0]; out[a] = d;
          if (out[0] * E[0] + out[1] * E[1] + out[2] * E[2] <= 0) continue; // 背面不画
          const nb = [...p]; nb[a] += d;
          if (st.gap < 0.01 && nb[a] >= 0 && nb[a] < st.n && visible(nb)) continue; // 贴在一起时，内部的面被邻块挡住
          const painted = (d === -1 && p[a] === 0) || (d === 1 && p[a] === st.n - 1);
          const b = (a + 1) % 3; const c = (a + 2) % 3;
          const base = [x0, y0, z0]; if (d === 1) base[a] += 1;
          const q = (u, w) => { const r = [...base]; r[b] += u; r[c] += w; return r; };
          faces.push({ type: 'face', pts: [q(0, 0), q(1, 0), q(1, 1), q(0, 1)], out, color: painted ? PAINT : WOOD });
        }
      }
    });
    return faces;
  });
  const api = {
    v, st, svg: v.svg,
    count: (cat) => cells().filter((p) => paintCount(p, st.n) === +cat).length,
    set(patch) { Object.assign(st, patch); v.update(); },
    update: () => v.update(),
  };
  v.update();
  return api;
}

const CAT_NAME = { 3: '三面涂色', 2: '两面涂色', 1: '一面涂色', 0: '零面涂色' };
function bindCats(box, cube, after) {
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-c]');
    if (!b) return;
    box.querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    const gap = b.dataset.c === 'all' ? cube.st.gap : Math.max(cube.st.gap, 0.35);
    cube.set({ cat: b.dataset.c, gap });
    after(b.dataset.c);
  });
}

const boards = [];
/* 第 3 页：n = 3 */
function initCube3() {
  const c = paintedCube($('cube3'), { n: 3, gap: 0 });
  boards.push(c);
  const msg = (cat) => {
    $('c3Gap').value = c.st.gap;
    $('c3Msg').innerHTML = cat === 'all' ? '点左边的按钮，只显示这一类小正方体（橙色面是涂了颜色的面）．'
      : `${CAT_NAME[cat]}：<b>${c.count(cat)}</b> 个．`;
  };
  bindCats($('c3Btns'), c, msg);
  $('c3Gap').addEventListener('input', (e) => c.set({ gap: +e.target.value }));
}

/* 第 5 页：n = 2～6 */
function initCubeN() {
  const c = paintedCube($('cubeN'), { n: 4, gap: 0.35 });
  boards.push(c);
  const show = () => {
    const n = c.st.n;
    $('cnNV').textContent = n;
    const parts = [3, 2, 1, 0].map((k) => `${CAT_NAME[k].slice(0, 2)} <b>${c.count(k)}</b>`).join('，');
    const total = [3, 2, 1, 0].reduce((s, k) => s + c.count(k), 0);
    $('cnMsg').innerHTML = `棱长 ${n}：${parts}；合计 ${total} $=${n}^3$．${c.st.cat === 'all' ? '' : `（现在只显示${CAT_NAME[c.st.cat]}的 ${c.count(c.st.cat)} 块）`}`;
    tex($('cnMsg'));
  };
  bindCats($('cnBtns'), c, () => { $('cnGap').value = c.st.gap; show(); });
  $('cnN').addEventListener('input', (e) => { c.set({ n: +e.target.value }); show(); });
  $('cnGap').addEventListener('input', (e) => c.set({ gap: +e.target.value }));
  show();
}

/* 第 4 页：位置示意图（3×3×3，斜二测：x 向右、y 斜向右上 45° 缩半、z 向上） */
function drawPosFig() {
  const u = 52; const ox = 70; const oy = 250;
  const P = ([x, y, z]) => [ox + x * u + y * u * 0.5 * Math.cos(45 * DEG), oy - z * u - y * u * 0.5 * Math.sin(45 * DEG)];
  const poly = (pts, fill, extra = '') => `<polygon points="${pts.map(P).map((q) => q.map((v) => v.toFixed(1)).join(',')).join(' ')}" fill="${fill}" stroke="#1f2d3a" stroke-width="1.2" ${extra}/>`;
  const COL = { 3: '#d9711c', 2: '#4f9bd0', 1: '#9bc46a', 0: '#ffffff' };
  const cat = (i, j, k) => [i, j, k].filter((v) => v === 0 || v === 2).length;
  let s = '';
  // 前面 y = 0，上面 z = 3，右面 x = 3 的 27 个小正方形
  for (let i = 0; i < 3; i += 1) for (let k = 0; k < 3; k += 1) s += poly([[i, 0, k], [i + 1, 0, k], [i + 1, 0, k + 1], [i, 0, k + 1]], COL[cat(i, 0, k)]);
  for (let i = 0; i < 3; i += 1) for (let j = 0; j < 3; j += 1) s += poly([[i, j, 3], [i + 1, j, 3], [i + 1, j + 1, 3], [i, j + 1, 3]], COL[cat(i, j, 2)], 'fill-opacity=".85"');
  for (let j = 0; j < 3; j += 1) for (let k = 0; k < 3; k += 1) s += poly([[3, j, k], [3, j + 1, k], [3, j + 1, k + 1], [3, j, k + 1]], COL[cat(2, j, k)], 'fill-opacity=".7"');
  // 内部那一块：虚线框（透视看不见，只示意位置）
  const inner = [[1, 1, 1], [2, 1, 1], [2, 1, 2], [1, 1, 2]];
  s += `<polygon points="${inner.map(P).map((q) => q.join(',')).join(' ')}" fill="none" stroke="#c0392b" stroke-width="2" stroke-dasharray="5 4"/>`;
  const lg = [[3, '顶点 · 三面'], [2, '棱 · 两面'], [1, '面中间 · 一面']];
  lg.forEach(([k, t], i) => { s += `<rect x="${200}" y="${18 + i * 26}" width="18" height="18" fill="${COL[k]}" stroke="#1f2d3a"/><text x="224" y="${32 + i * 26}" class="fl s">${t}</text>`; });
  s += `<rect x="200" y="96" width="18" height="18" fill="none" stroke="#c0392b" stroke-dasharray="4 3" stroke-width="2"/><text x="224" y="110" class="fl s">内部 · 零面</text>`;
  $('posFig').innerHTML = s;
}

/* 第 7 页：验证 8 + 12(n−2) + 6(n−2)² + (n−2)³ = n³ */
function initVerify() {
  const el = $('vfN');
  const run = () => {
    const n = +el.value; const m = n - 2;
    $('vfNV').textContent = n;
    const a = 12 * m; const b = 6 * m * m; const c = m ** 3;
    $('vfOut').innerHTML = `$8+12\\times${m}+6\\times${m}^2+${m}^3$<br>$=8+${a}+${b}+${c}=${fmt(8 + a + b + c)}$<br>$${n}^3=${n ** 3}$　${8 + a + b + c === n ** 3 ? '<b class="okc">相等 ✓</b>' : '不相等'}`;
    tex($('vfOut'));
  };
  el.addEventListener('input', run);
  run();
}

window.LESSON = {
  init() { initCube3(); initCubeN(); drawPosFig(); initVerify(); },
  onRender(slide) { boards.forEach((b) => { if (slide.contains(b.svg)) b.update(); }); },
};
