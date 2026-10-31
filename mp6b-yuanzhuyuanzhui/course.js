'use strict';
/* 六下 圆柱和圆锥的认识 · 本课互动：分一分生活中的物体、可旋转圆柱 / 圆锥（点名称高亮底面、侧面、高、顶点）、
 * 横着切一刀比粗细、长方形 / 直角三角形绕一条边旋转一周、从前面 / 上面 / 右面观察。
 * 立体图都按真实尺寸由代码绘制（../shared/solid3d.js 线框，被挡住的线自动画成虚线；poly3d.js 实体）。 */
const $ = (id) => document.getElementById(id);
const DEG = Math.PI / 180;
const VIEWS = [];
const reg = (v) => { VIEWS.push(v); return v; };
const ring = (r, z, n = 96, a0 = 0, a1 = 2 * Math.PI) => Array.from({ length: n + 1 }, (_, i) => {
  const t = a0 + ((a1 - a0) * i) / n;
  return [r * Math.cos(t), r * Math.sin(t), z];
});
const eye = (st) => {
  const y = st.yaw * DEG;
  const p = st.pitch * DEG;
  return [-Math.sin(y) * Math.cos(p), -Math.cos(y) * Math.cos(p), Math.sin(p)];
};
const btnGroup = (box, onPick) => box.addEventListener('click', (e) => {
  const b = e.target.closest('[data-k]');
  if (!b) return;
  box.querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x === b));
  onPick(b.dataset.k);
});

/* 侧面中朝向观察者的那一块（投影后就是看得见的侧面区域）。r2 = 0 为圆锥 */
function visibleSide(v, r1, r2, h) {
  const E = eye(v.state);
  const phi = Math.atan2(E[1], E[0]);
  const A = h * Math.hypot(E[0], E[1]);
  const c = A > 1e-9 ? Math.max(-1, Math.min(1, (-(r1 - r2) * E[2]) / A)) : -1;
  const d = Math.acos(c); // 法向与视线夹角 < 90° 的角度范围 phi ± d
  if (d >= Math.PI - 1e-6) return ring(r1, 0); // 从上往下看圆锥：整个侧面都看得见
  const bot = ring(r1, 0, 48, phi - d, phi + d);
  if (r2 <= 0) return [...bot, [0, 0, h]];
  return [...bot, ...ring(r2, h, 48, phi - d, phi + d).reverse()];
}

/* ---------- 第 3 页：分一分 ---------- */
const OBJS = [
  { n: '花柱', k: 'zhu' }, { n: '没削过的铅笔', k: 'zhu' }, { n: '圆锥形纸筒', k: 'zhui' }, { n: '蚊香盒', k: 'zhu' },
  { n: '沙堆', k: 'zhui' }, { n: '易拉罐', k: 'zhu' }, { n: '铅锤（线坠）', k: 'zhui', note: '下面是圆锥' }, { n: '篮球', k: 'no', why: '球' },
  { n: '生日帽', k: 'zhui' }, { n: '魔方', k: 'no', why: '正方体' }, { n: '薯片筒', k: 'zhu' }, { n: '削好的铅笔', k: 'no', why: '圆柱和圆锥拼成的' },
];
const KN = { zhu: '圆柱', zhui: '圆锥', no: '都不是' };
function initSort() {
  const box = $('objs');
  const st = OBJS.map(() => '');
  const ORDER = ['', 'zhu', 'zhui', 'no'];
  const paint = () => {
    box.innerHTML = OBJS.map((o, i) => `<button type="button" class="obj ${st[i]}" data-i="${i}">${o.n}<small>${st[i] ? KN[st[i]] : '点一点'}</small></button>`).join('');
  };
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (!b) return;
    const i = +b.dataset.i;
    st[i] = ORDER[(ORDER.indexOf(st[i]) + 1) % ORDER.length];
    paint();
  });
  $('objChk').addEventListener('click', () => {
    paint();
    let wrong = 0;
    box.querySelectorAll('.obj').forEach((b) => {
      const o = OBJS[+b.dataset.i];
      const ok = st[+b.dataset.i] === o.k;
      if (!ok) wrong += 1;
      b.classList.add(ok ? 'right' : 'wrong');
    });
    const msg = $('objMsg');
    msg.className = `tip feedback ${wrong ? 'warn' : 'ok'}`;
    msg.innerHTML = wrong ? `还有 ${wrong} 个不对（红框）。提示：篮球是<b>球</b>，魔方是<b>正方体</b>，削好的铅笔是圆柱和圆锥<b>拼起来</b>的。` : '✓ 全对！圆柱上下一样粗；圆锥有一个尖尖的顶点。';
  });
  $('objReset').addEventListener('click', () => { st.fill(''); paint(); $('objMsg').className = 'tip feedback'; $('objMsg').textContent = '每个物体点一下是“圆柱”，点两下是“圆锥”，点三下是“都不是”。'; });
  paint();
}

/* ---------- 第 4 页：圆柱各部分 ---------- */
function initCyl() {
  const [r, h] = [1.3, 2.6];
  const st = { k: 'none' };
  const v = reg(Solid3D.view($('cyl'), { w: 520, h: 420, scale: 100, yaw: -25, pitch: 18, center: [0, 0, h / 2] }));
  v.face(() => ring(r, h), { cls: 'f2', show: () => st.k === 'base' });
  v.face(() => ring(r, 0), { cls: 'f2', show: () => st.k === 'base' });
  v.face(() => visibleSide(v, r, r, h), { cls: 'f1', show: () => st.k === 'side' });
  v.revolve(() => ({ r1: r, r2: r, h }));
  v.dot([0, 0, 0]); v.dot([0, 0, h]);
  v.label([0, 0, h], 'O', { dx: 8, dy: -6 }); v.label([0, 0, 0], 'O', { dx: 8, dy: 22 });
  const H = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => i * 45 * DEG);
  v.seg(() => [[0, 0, 0], [0, 0, h]], { cls: 'c2', show: () => st.k === 'high', hide: false });
  H.forEach((t) => v.seg(() => [[r * Math.cos(t), r * Math.sin(t), 0], [r * Math.cos(t), r * Math.sin(t), h]], { cls: 'c2', show: () => st.k === 'high' }));
  v.seg(() => [[0, 0, 0], [0, 0, h]], { cls: 'ax', show: () => st.k !== 'high', hide: false });
  v.label([0, 0, h + 0.15], '底面', { cls: 'up', dx: -24, dy: -16, show: () => st.k === 'base' });
  v.label([0, 0, 0], '底面', { cls: 'up', dx: -24, dy: 46, show: () => st.k === 'base' });
  v.label([r, 0, h / 2], '侧面', { cls: 'up', dx: 10, show: () => st.k === 'side' });
  v.label([r, 0, h / 2], '高', { cls: 'up hot', dx: 12, show: () => st.k === 'high' });
  v.update();
  const MSG = {
    none: '拖动圆柱转一转，再点上面的名称。',
    base: '上、下两个面叫作<b>底面</b>，它们是<b>完全相同的圆</b>。',
    side: '围成圆柱的<b>曲面</b>叫作<b>侧面</b>。',
    high: '两个底面之间的<b>距离</b>叫作<b>高</b>。圆柱的高有<b>无数条</b>，长度都相等。',
  };
  btnGroup($('cylK'), (k) => { st.k = k; v.update(); $('cylMsg').innerHTML = MSG[k]; });
  $('cylMsg').innerHTML = MSG.none;
}

/* ---------- 第 5 页：横着切一刀，比粗细 ---------- */
function initCut() {
  const [r, h] = [1.1, 2.6];
  const st = { z: 1.3 };
  const mk = (el, cone) => {
    const v = reg(Solid3D.view(el, { w: 300, h: 380, scale: 100, yaw: -20, pitch: 18, center: [0, 0, h / 2], rotate: false }));
    const rr = () => (cone ? r * (1 - st.z / h) : r);
    v.face(() => ring(rr(), st.z), { cls: 'f2' });
    v.revolve(() => ({ r1: r, r2: cone ? 0 : r, h }));
    v.curve(() => ring(rr(), st.z), { cls: 'c2', hide: false });
    v.update();
    return v;
  };
  const a = mk($('cutA'), false);
  const b = mk($('cutB'), true);
  const show = () => {
    a.update(); b.update();
    const rc = r * (1 - st.z / h);
    $('cutMsg').innerHTML = `切口离底面 ${(st.z / h * 100).toFixed(0)}% 高处：圆柱的切口<b>和底面一样大</b>；圆锥的切口半径只有底面的 <b>${(rc / r * 100).toFixed(0)}%</b>。`;
  };
  MathKit.slider($('cutZ'), (val) => { st.z = (val / 100) * h; show(); });
}

/* ---------- 第 6 页：圆锥各部分 ---------- */
function initCone() {
  const [r, h] = [1.4, 2.6];
  const st = { k: 'none' };
  const v = reg(Solid3D.view($('cone'), { w: 520, h: 420, scale: 100, yaw: -25, pitch: 18, center: [0, 0, h / 2] }));
  v.face(() => ring(r, 0), { cls: 'f2', show: () => st.k === 'base' });
  v.face(() => visibleSide(v, r, 0, h), { cls: 'f1', show: () => st.k === 'side' });
  v.revolve(() => ({ r1: r, r2: 0, h }));
  v.dot([0, 0, 0]);
  v.dot([0, 0, h], { cls: 'c2', show: () => st.k === 'top' });
  v.label([0, 0, 0], 'O', { dx: 8, dy: 22 });
  v.seg(() => [[0, 0, 0], [0, 0, h]], { cls: 'c2', show: () => st.k === 'high', hide: false });
  v.seg(() => [[0, 0, 0], [0, 0, h]], { cls: 'ax', show: () => st.k !== 'high', hide: false });
  const G = [r * Math.cos(-55 * DEG), r * Math.sin(-55 * DEG), 0]; // 前面的一条斜线（母线）
  v.seg(() => [G, [0, 0, h]], { cls: 'c1', show: () => st.k === 'high' });
  v.label([0, 0, h], '顶点', { cls: 'up', dx: 10, dy: -4, show: () => st.k === 'top' });
  v.label([0, 0, 0], '底面', { cls: 'up', dx: -24, dy: 46, show: () => st.k === 'base' });
  v.label([r * 0.5, 0, h * 0.4], '侧面', { cls: 'up', dx: 14, show: () => st.k === 'side' });
  v.label([0, 0, h / 2], '高', { cls: 'up hot', dx: -30, show: () => st.k === 'high' });
  v.label(() => [G[0] / 2, G[1] / 2, h / 2], '不是高', { cls: 'up no', dx: 10, dy: 10, show: () => st.k === 'high' });
  v.update();
  const MSG = {
    none: '拖动圆锥转一转，再点上面的名称。',
    top: '圆锥有<b>一个顶点</b>。',
    base: '圆锥的<b>底面是一个圆</b>。',
    side: '圆锥的<b>侧面是一个曲面</b>。',
    high: '从圆锥的<b>顶点到底面圆心</b>的距离是圆锥的高（橙色），圆锥只有<b>一条</b>高。蓝色那条斜斜的线段<b>不是</b>高。',
  };
  btnGroup($('coneK'), (k) => { st.k = k; v.update(); $('coneMsg').innerHTML = MSG[k]; });
  $('coneMsg').innerHTML = MSG.none;
}

/* ---------- 第 7 页：转一转 ---------- */
const SPINS = {
  rl: { shape: 'rect', R: 4, H: 5, txt: '长方形（长 5 cm，宽 4 cm）绕长边旋转', res: '圆柱：底面半径 4 cm（宽），高 5 cm（长）' },
  rw: { shape: 'rect', R: 5, H: 4, txt: '长方形（长 5 cm，宽 4 cm）绕宽边旋转', res: '圆柱：底面半径 5 cm（长），高 4 cm（宽）' },
  t4: { shape: 'tri', R: 3, H: 4, txt: '直角三角形（直角边 3 cm、4 cm）绕 4 cm 的边旋转', res: '圆锥：底面半径 3 cm，高 4 cm' },
  t3: { shape: 'tri', R: 4, H: 3, txt: '直角三角形（直角边 3 cm、4 cm）绕 3 cm 的边旋转', res: '圆锥：底面半径 4 cm，高 3 cm' },
};
function initSpin() {
  const st = { k: 'rl', a: 0, anim: null };
  const S = () => SPINS[st.k];
  const v = reg(Solid3D.view($('spin'), { w: 560, h: 420, scale: 44, yaw: -20, pitch: 16, center: [0, 0, 2.5], rotate: false }));
  const pts = () => {
    const { shape, R, H } = S();
    const c = Math.cos(st.a);
    const s = Math.sin(st.a);
    return shape === 'rect' ? [[0, 0, 0], [R * c, R * s, 0], [R * c, R * s, H], [0, 0, H]] : [[0, 0, 0], [R * c, R * s, 0], [0, 0, H]];
  };
  const done = () => st.a >= 2 * Math.PI - 1e-6;
  v.revolve(() => ({ r1: S().R, r2: S().shape === 'rect' ? S().R : 0, h: S().H }), { show: done });
  v.face(pts, { cls: 'f2' });
  v.curve(pts, { closed: true, cls: 'c2', hide: false });
  v.curve(() => (st.a > 0.01 && !done() ? ring(S().R, 0, 64, 0, st.a) : null), { cls: 'c1', hide: false });
  v.curve(() => (st.a > 0.01 && !done() && S().shape === 'rect' ? ring(S().R, S().H, 64, 0, st.a) : null), { cls: 'c1', hide: false });
  v.seg(() => [[0, 0, -0.8], [0, 0, S().H + 0.8]], { cls: 'ax', hide: false });
  v.update();
  const sync = () => {
    v.update();
    $('spinA').value = Math.round((st.a / DEG));
    $('spinAv').textContent = `${Math.round(st.a / DEG)}°`;
    $('spinT').textContent = S().txt;
    $('spinR').innerHTML = done() ? `转出了一个<b>${S().res}</b>` : '转一周后会得到什么立体图形？先猜一猜。';
  };
  MathKit.slider($('spinA'), (val) => { if (st.anim) cancelAnimationFrame(st.anim); st.a = val * DEG; sync(); });
  btnGroup($('spinK'), (k) => { st.k = k; st.a = 0; if (st.anim) cancelAnimationFrame(st.anim); sync(); });
  $('spinGo').addEventListener('click', () => {
    if (st.anim) cancelAnimationFrame(st.anim);
    const t0 = performance.now();
    const MS = 2400;
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / MS);
      st.a = t * 2 * Math.PI;
      sync();
      st.anim = t < 1 ? requestAnimationFrame(tick) : null;
    };
    st.anim = requestAnimationFrame(tick);
  });
  sync();
}

/* ---------- 第 8 页：从前面、上面、右面看 ---------- */
function initViews() {
  const mk = (el, cone) => {
    const v = reg(Poly3D.view(el, { w: 300, h: 300, scale: 70, yaw: -25, pitch: 20, center: [0, 0, 1.2] }));
    v.add(() => [Poly3D.revolve({ r1: 1.1, r2: cone ? 0 : 1.1, h: 2.4 }, { color: '#f6dc6a', apexDot: true })]);
    v.update();
    return v;
  };
  const a = mk($('vZhu'), false);
  const b = mk($('vZhui'), true);
  const VIEW = { free: [-25, 20], front: [0, 0], top: [0, 90], right: [-90, 0] };
  btnGroup($('viewK'), (k) => { a.animateTo(...VIEW[k], 700); b.animateTo(...VIEW[k], 700); });
}

window.LESSON = {
  init() {
    initSort();
    initCyl();
    initCut();
    initCone();
    initSpin();
    initViews();
  },
  onRender(slide) { VIEWS.forEach((v) => { if (slide.contains(v.svg)) v.update(); }); },
};
