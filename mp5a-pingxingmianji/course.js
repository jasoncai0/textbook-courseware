'use strict';
/* 五上 平行四边形的面积 · 本课互动：例 1 平移比面积、例 2 沿高剪开平移（剪刀线可拖）、例 3 两个平行四边形转化、
 * 拉木框（周长不变面积变）、等底等高。方格纸与“剪—移—拼”见 ../shared/mgrid.js */
const $ = (id) => document.getElementById(id);
const { mk } = MGrid;

/* ---------- 第 3 页：例 1 平移后比较 ---------- */
function initEx1() {
  const ga = MGrid.paper($('ex1a'), { cols: 11, rows: 6, u: 40 });
  // ①：4 列 × 3 行，上面凸出 2 格，下面缺 2 格；凸出的小长方形向下平移 3 格正好补上
  ga.poly([[1, 2], [5, 2], [5, 5], [4, 5], [4, 4], [2, 4], [2, 5], [1, 5]], 'sh-a');
  const bump = ga.poly([[2, 1], [4, 1], [4, 2], [2, 2]], 'sh-a mg-move');
  ga.poly([[6, 2], [10, 2], [10, 5], [6, 5]], 'sh-a');
  ga.text([3, 3], '①', 'mg-t b');
  ga.text([8, 3.5], '②', 'mg-t b');

  const gb = MGrid.paper($('ex1b'), { cols: 12, rows: 6, u: 40 });
  // ③：4 × 4 的正方形，左边多一个三角形、右边缺一个同样的三角形；三角形向右平移 4 格
  gb.poly([[2, 1], [6, 1], [5, 3], [6, 5], [2, 5]], 'sh-b');
  const tri = gb.poly([[1, 3], [2, 1], [2, 5]], 'sh-b mg-move');
  gb.poly([[7, 1], [11, 1], [11, 5], [7, 5]], 'sh-b');
  gb.text([3.6, 3], '③', 'mg-t b');
  gb.text([9, 3], '④', 'mg-t b');

  const toggle = (btn, el, g, to, label) => {
    let moved = false;
    btn.addEventListener('click', () => {
      moved = !moved;
      MGrid.pose(el, g, moved ? to : {});
      btn.textContent = moved ? '↺ 移回去' : label;
    });
  };
  toggle($('ex1aGo'), bump, ga, { dy: 3 }, $('ex1aGo').textContent);
  toggle($('ex1bGo'), tri, gb, { dx: 4 }, $('ex1bGo').textContent);
}

/* ---------- 第 4 页：例 2 沿高剪开、平移（核心） ---------- */
// 课本 p7 方格图：底 7 格、高 4 格，上底比下底向右错开 2 格
const PX = { A: [1, 5], B: [8, 5], C: [10, 1], D: [3, 1], base: 7 };
function initCut() {
  const svg = $('cutFig');
  const g = MGrid.paper(svg, { cols: 16, rows: 6, u: 50 });
  const st = { c: 3, moved: false };
  g.poly([PX.A, PX.B, PX.C, PX.D], 'sh-ghost');
  const right = g.poly([], 'sh-a');
  const left = g.poly([], 'sh-c mg-move');
  const cut = g.seg([0, 0], [0, 0], 'cut');
  const mark = g.poly([], 'sh-out');
  const handle = mk('circle', { r: 16, class: 'cut-h' }, g.root);
  const sizes = g.group('fade hide');
  g.dim([PX.A[0], 5.15], [PX.B[0], 5.15], '底 7', -0.45, g.root);
  const say = $('cutSay');

  const draw = () => {
    const { c } = st;
    left.setAttribute('d', g.d([PX.A, PX.D, [c, 1], [c, 5]]));
    right.setAttribute('d', g.d([[c, 1], PX.C, PX.B, [c, 5]]));
    const [x1, y1] = g.P([c, 0.6]);
    const [, y2] = g.P([5.4, 5.4]);
    Object.entries({ x1, y1, x2: x1, y2 }).forEach(([k, v]) => cut.setAttribute(k, v));
    mark.setAttribute('d', `M${g.P([c, 4.7]).join(' ')}H${g.P([c + 0.3, 0])[0]}V${g.P([0, 5])[1]}`);
    handle.setAttribute('cx', x1);
    handle.setAttribute('cy', y1);
    sizes.innerHTML = '';
    g.dim([c, 1], [c + PX.base, 1], '长 7', 0.45, sizes);
    g.dim([c + PX.base, 1], [c + PX.base, 5], '宽 4', 0.5, sizes);
    say.innerHTML = c === 3 ? '从这里剪，剪下来的是一个<b>三角形</b>。' : '从这里剪，剪下来的是一个<b>梯形</b>。';
  };
  const move = () => {
    st.moved = !st.moved;
    MGrid.pose(left, g, st.moved ? { dx: PX.base } : {});
    sizes.classList.toggle('hide', !st.moved);
    svg.classList.toggle('moved', st.moved);
    $('cutGo').textContent = st.moved ? '↺ 还原' : '✂ 剪开、平移 ▶';
    if (st.moved) say.innerHTML = `拼成了长方形：长 7 格，宽 4 格，面积 <b>${PX.base * 4}</b> 格。`;
    else draw();
  };
  // 剪刀线只能在上下两条底都有的地方（x 从 3 到 8），按半格对齐
  MGrid.drag(svg, handle, ([x]) => {
    if (st.moved) return;
    st.c = Math.min(8, Math.max(3, Math.round((x / g.u) * 2) / 2));
    draw();
  });
  $('cutGo').addEventListener('click', move);
  draw();
}

/* ---------- 第 5 页：例 3 两个平行四边形转化（每格 1 cm） ---------- */
function initEx3() {
  const g = MGrid.paper($('ex3Fig'), { cols: 19, rows: 6, u: 40 });
  // 甲：底 5、高 3，上底错开 2；乙：底 4、高 4，上底错开 3。都沿最左边的高剪下三角形，向右平移一个底的长度
  const shapes = [
    { body: [[2, 2], [7, 2], [5, 5], [2, 5]], piece: [[0, 5], [2, 2], [2, 5]], dx: 5 },
    { body: [[13, 1], [17, 1], [14, 5], [13, 5]], piece: [[10, 5], [13, 1], [13, 5]], dx: 4 },
  ];
  const pieces = shapes.map(({ body, piece }) => {
    g.poly(body, 'sh-d');
    return g.poly(piece, 'sh-c mg-move');
  });
  g.text([4.5, 0.5], '甲', 'mg-t b');
  g.text([14, 0.5], '乙', 'mg-t b');
  let moved = false;
  $('ex3Go').addEventListener('click', () => {
    moved = !moved;
    pieces.forEach((p, i) => MGrid.pose(p, g, moved ? { dx: shapes[i].dx } : {}));
    $('ex3Go').textContent = moved ? '↺ 还原' : '转化成长方形 ▶';
  });
}

/* ---------- 第 7 页：练习二第 2 题（按题目数据等比例画） ---------- */
function initPairs() {
  const svg = $('pairFig');
  svg.setAttribute('viewBox', '0 0 680 205');
  const path = (pts, cls) => mk('path', { d: `M${pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join('L')}Z`, class: cls }, svg);
  const line = (p, q, cls) => mk('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], class: cls }, svg);
  const text = (p, s, cls = 'pf-t') => { mk('text', { x: p[0], y: p[1], class: cls }, svg).textContent = s; };
  // ① 底 12 m、高 8 m（1 m = 10 px）
  path([[30, 175], [150, 175], [178, 95], [58, 95]], 'pf-sh');
  line([58, 95], [58, 175], 'pf-h');
  text([66, 140], '8 m', 'pf-t r start');
  text([90, 196], '12 m');
  // ② 一组对边长 50 dm，这组对边之间的距离（高）26 dm（1 dm = 2.6 px），这组边倾斜 65°
  const k = 2.6;
  const a = (65 * Math.PI) / 180;
  const L = (26 * k) / Math.sin(a); // 水平边长，使两条斜边之间的距离正好是 26 dm
  const B = [345, 178];
  const C = [B[0] + 50 * k * Math.cos(a), B[1] - 50 * k * Math.sin(a)];
  const D = [C[0] - L, C[1]];
  path([[B[0] - L, B[1]], B, C, D], 'pf-sh');
  const u = [Math.cos(a), -Math.sin(a)];
  const t = (D[0] - B[0]) * u[0] + (D[1] - B[1]) * u[1];
  const F = [B[0] + u[0] * t, B[1] + u[1] * t]; // D 到 BC 的垂足
  line(D, F, 'pf-h');
  text([(D[0] + F[0]) / 2 - 4, (D[1] + F[1]) / 2 + 24], '26 dm', 'pf-t r');
  text([(B[0] + C[0]) / 2 + 14, (B[1] + C[1]) / 2 + 8], '50 dm', 'pf-t start');
  // ③ 竖着的一组对边长 24 cm，它们之间的距离 14 cm（1 cm = 4.5 px）
  const x0 = 585;
  path([[x0, 40], [x0 + 63, 80], [x0 + 63, 188], [x0, 148]], 'pf-sh');
  line([x0, 80], [x0 + 63, 80], 'pf-h');
  text([x0 + 32, 104], '14 cm', 'pf-t r');
  text([x0 - 8, 100], '24 cm', 'pf-t end');
  text([95, 30], '①');
  text([300, 30], '②');
  text([617, 30], '③');
}

/* ---------- 第 8 页：拉木框 ---------- */
const FR = { a: 12, b: 7, s: 24, x: 82, y: 215 };
function initFrame() {
  const svg = $('frameFig');
  const ghost = mk('path', { class: 'fr-ghost' }, svg);
  const shape = mk('path', { class: 'fr-shape' }, svg);
  const wood = mk('path', { class: 'fr-wood' }, svg);
  const hl = mk('line', { class: 'fr-h' }, svg);
  const hlab = mk('text', { class: 'fr-t r' }, svg);
  mk('text', { x: FR.x + (FR.a * FR.s) / 2, y: FR.y + 22, class: 'fr-t' }, svg).textContent = '12 cm';
  const sideLab = mk('text', { class: 'fr-t end' }, svg);
  const { a, b, s, x, y } = FR;
  ghost.setAttribute('d', `M${x} ${y}h${a * s}v${-b * s}h${-a * s}Z`);
  const set = (deg) => {
    const r = (deg * Math.PI) / 180;
    const [dx, dy] = [b * s * Math.cos(r), b * s * Math.sin(r)];
    const d = `M${x} ${y}H${x + a * s}L${x + a * s + dx} ${y - dy}H${x + dx}Z`;
    shape.setAttribute('d', d);
    wood.setAttribute('d', d);
    const h = b * Math.sin(r);
    Object.entries({ x1: x + dx, y1: y - dy, x2: x + dx, y2: y }).forEach(([k, v]) => hl.setAttribute(k, v.toFixed(1)));
    hlab.setAttribute('x', (x + dx + 8).toFixed(1));
    hlab.setAttribute('y', (y - dy / 2 + 8).toFixed(1));
    hlab.textContent = deg === 90 ? '' : `高 ≈ ${h.toFixed(1)} cm`;
    sideLab.setAttribute('x', (x + dx / 2 - 14).toFixed(1));
    sideLab.setAttribute('y', (y - dy / 2).toFixed(1));
    sideLab.textContent = '7 cm';
    const area = a * h;
    $('frameDeg').textContent = `${deg}°`;
    $('vC').textContent = '38 cm';
    $('vH').textContent = deg === 90 ? '7 cm' : `≈ ${h.toFixed(1)} cm`;
    $('vS').textContent = deg === 90 ? '84 cm²' : `≈ ${area.toFixed(1)} cm²`;
    $('barC').style.width = '100%';
    $('barH').style.width = `${(h / b) * 100}%`;
    $('barS').style.width = `${(h / b) * 100}%`;
  };
  MathKit.slider($('frameAng'), set);
}

/* ---------- 第 9 页：两条平行线之间（长 15 cm、宽 6 cm；1 cm = 25 px） ---------- */
function initParallel() {
  const svg = $('parFig');
  const k = 25;
  const top = 35;
  const bot = top + 6 * k;
  const W = 15 * k;
  mk('line', { x1: 10, y1: top, x2: 990, y2: top, class: 'par-l' }, svg);
  mk('line', { x1: 10, y1: bot, x2: 990, y2: bot, class: 'par-l' }, svg);
  mk('rect', { x: 40, y: top, width: W, height: bot - top, class: 'par-rect' }, svg);
  mk('text', { x: 40 + W / 2, y: bot + 28, class: 'fr-t' }, svg).textContent = '15 cm';
  mk('text', { x: 40 + W + 8, y: (top + bot) / 2 + 8, class: 'fr-t start' }, svg).textContent = '6 cm';
  const x0 = 520;
  const shape = mk('path', { class: 'par-sh' }, svg);
  const hl = mk('line', { y1: top, y2: bot, class: 'fr-h' }, svg);
  const lab = mk('text', { x: x0 + W / 2 + 60, y: bot + 28, class: 'fr-t' }, svg);
  const handle = mk('circle', { r: 14, cy: top, class: 'cut-h' }, svg);
  const set = (d) => {
    shape.setAttribute('d', `M${x0} ${bot}H${x0 + W}L${x0 + W + d} ${top}H${x0 + d}Z`);
    hl.setAttribute('x1', x0 + d);
    hl.setAttribute('x2', x0 + d);
    handle.setAttribute('cx', x0 + d);
    lab.textContent = '底 15 cm　高 6 cm　面积 15 × 6 = 90 cm²';
  };
  // 上底的左端点只在下底的正上方范围内拖（高始终能画在图形里）
  MGrid.drag(svg, handle, ([px]) => set(Math.min(W * 0.25, Math.max(0, px - x0))));
  set(60);
}

window.LESSON = {
  init() {
    initEx1();
    initCut();
    initEx3();
    initPairs();
    initFrame();
    initParallel();
  },
};
