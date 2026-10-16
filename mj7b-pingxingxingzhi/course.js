'use strict';
/* 七下 7.2 探索平行线的性质 · 本课互动：剪纸片叠合（平移 / 转半圈 / 拼平角）、八个角只有两种大小、读一读的反证图。
 * 通用部分见 ../shared/math.js、../shared/mgeo.js；所有图形由坐标计算。 */
const { tex } = MathKit;
const { add, sub, mul, dir, ang, rot, lerp, meet, line, arc, sketch } = Geo;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const RAD = Math.PI / 180;

/* ---------- 第 3 页：叠合实验（图 7-10、7-11、7-12） ---------- */
const LAP = {
  tw: { name: '1', reg: ['a', 'c'], tf: 'move' },
  ncu: { name: '7', reg: ['-a', '-c'], tf: 'turn' },
  pang: { name: '5', reg: ['-c', 'a'], tf: 'move' },
};
function initLap() {
  const G = 62;
  const U = [0, 0];
  const T = mul(dir(G), 1.9 / Math.sin(G * RAD));
  const M = lerp(T, U, 0.5);
  const s = { m: 'tw', u: 0, d: 0 };
  const C = dir(G);
  const A = () => dir(s.d);
  const vec = { a: A, '-a': () => mul(A(), -1), c: () => C, '-c': () => mul(C, -1) };
  const tf = (p) => (LAP[s.m].tf === 'move' ? add(p, mul(sub(U, T), s.u)) : rot(p, 180 * s.u, M));
  const b = Geo.board($('lap'), { x: [-4.6, 4.6], y: [-1.5, 3.1], w: 560 });
  for (let y = -1.25; y < 3.1; y += 0.42) b.seg([[-4.6, y], [4.6, y]], { cls: 'paper' });
  line(b, U, [1, 0], { cls: 'gl c-b' });
  line(b, T, () => add(T, A()), { cls: 'gl c-a' });
  line(b, U, C, { cls: 'gl c-c' });
  b.text([-4.2, 0], 'C', { dy: -8 }); b.text([4.2, 0], 'D', { dy: -8 });
  b.text(() => add(T, mul(A(), -4.6)), 'A', { dy: -8 }); b.text(() => add(T, mul(A(), 3.3)), 'B', { dy: -8 });
  b.text(add(U, mul(C, 3.25)), 'E', { dx: 8 }); b.text(add(U, mul(C, -1.5)), 'F', { dx: 8 });
  arc(b, U, [1, 0], C, { r: 0.42, label: '2', cls: 'garc fix' });
  // 纸片：以 T 为中心、两边分别沿 AB、EF 的平行四边形
  const corners = () => [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([i, j]) => add(add(T, mul(A(), 1.45 * i)), mul(C, 0.8 * j)));
  b.poly(() => corners().map(tf), { cls: 'piece' });
  b.seg(() => [tf(add(T, mul(A(), -1.45))), tf(add(T, mul(A(), 1.45)))], { cls: 'gs piece-l' });
  b.seg(() => [tf(add(T, mul(C, -0.8))), tf(add(T, mul(C, 0.8)))], { cls: 'gs piece-l' });
  const r = LAP;
  arc(b, () => tf(T), () => tf(add(T, vec[r[s.m].reg[0]]())), () => tf(add(T, vec[r[s.m].reg[1]]())), { r: 0.55, label: () => r[s.m].name, cls: 'garc on' });
  b.onUpdate = () => {
    const a1 = G - s.d;
    const val = { tw: a1, ncu: a1, pang: 180 - a1 }[s.m];
    const nm = r[s.m].name;
    const msg = $('lapMsg');
    if (s.u < 0.995) {
      msg.className = 'tip feedback';
      msg.textContent = `拖动滑块，把纸片上的 ∠${nm} ${r[s.m].tf === 'move' ? '沿 EF 推' : '绕中点转'}到 ∠2 那里。`;
      return;
    }
    const ok = s.d === 0;
    msg.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
    if (s.m === 'pang') {
      msg.textContent = ok ? `∠5 与 ∠2 拼成一个平角：${val}° + ${G}° = 180°。` : `拼不成平角：∠5 + ∠2 = ${val}° + ${G}° = ${val + G}°。`;
    } else {
      msg.textContent = ok ? `∠${nm} 正好盖住 ∠2：∠${nm} = ∠2 = ${G}°。` : `盖不严：∠${nm} = ${val}°，∠2 = ${G}°，AB 与 CD 不平行。`;
    }
  };
  $('lapTabs').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-m]');
    if (!btn) return;
    s.m = btn.dataset.m;
    s.u = 0;
    $('lapU').value = 0;
    $('lapTabs').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
  MathKit.slider($('lapU'), (v) => { s.u = v; b.update(); });
  $('lapTilt').addEventListener('change', (e) => { s.d = e.target.checked ? 6 : 0; b.update(); });
}

/* ---------- 第 6 页：八个角只有两种大小 ---------- */
// 图 7-10 编号：上交点 3 1 / 7 5，下交点 4 2 / 8 6；组 A（右上、左下）= γ，组 B = 180° − γ
const EIGHT = [[1, 'T', 'RU'], [3, 'T', 'LU'], [7, 'T', 'LD'], [5, 'T', 'RD'], [2, 'U', 'RU'], [4, 'U', 'LU'], [8, 'U', 'LD'], [6, 'U', 'RD']];
function initEight() {
  const s = { g: 58 };
  const Mid = [0, 0.9];
  const C = () => dir(s.g);
  const at = (y) => () => meet(Mid, add(Mid, C()), [0, y], [1, y]);
  const T = at(1.8);
  const U = at(0);
  const b = Geo.board($('eight'), { x: [-4.4, 4.4], y: [-1.35, 3.15], w: 540 });
  line(b, [0, 1.8], [1, 1.8], { cls: 'gl c-a' });
  line(b, [0, 0], [1, 0], { cls: 'gl c-b' });
  line(b, Mid, () => add(Mid, C()), { cls: 'gl c-c' });
  b.text([-4.1, 1.8], 'A', { dy: -8 }); b.text([4.0, 1.8], 'B', { dy: -8 });
  b.text([-4.1, 0], 'C', { dy: -8 }); b.text([4.0, 0], 'D', { dy: -8 });
  b.text(() => add(Mid, mul(C(), 2.15 / Math.max(0.5, Math.sin(s.g * RAD)))), 'E', { dx: 10 });
  EIGHT.forEach(([n, P, reg]) => {
    const X = P === 'T' ? T : U;
    const ends = {
      RU: [() => [1, 0], C], LU: [C, () => [-1, 0]], LD: [() => [-1, 0], () => mul(C(), -1)], RD: [() => mul(C(), -1), () => [1, 0]],
    }[reg];
    const g2 = reg === 'LU' || reg === 'RD';
    arc(b, X, () => add(X(), ends[0]()), () => add(X(), ends[1]()), { r: 0.42, label: String(n), cls: `garc ${g2 ? 'g2' : 'g1'}`, lcls: `lb up gnum ${g2 ? 'g2' : 'g1'}` });
  });
  b.drag(() => add(Mid, mul(C(), 1.5)), (x, y) => {
    let a = ang(sub([x, y], Mid));
    if (a > 180) a -= 180;
    s.g = Math.round(clamp(a, 25, 155));
    if (Math.abs(s.g - 90) <= 1) s.g = 90;
  });
  b.onUpdate = () => {
    $('eightA').textContent = `${s.g}°`;
    $('eightB').textContent = `${180 - s.g}°`;
    $('eightMsg').textContent = s.g === 90
      ? 'EF ⊥ AB：八个角都是 90°，EF 也垂直于 CD。'
      : `${s.g}° + ${180 - s.g}° = 180°：不同颜色的两个角互补。`;
  };
  b.update();
}

/* ---------- 第 10 页：读一读（假设 ∠1 ≠ ∠2） ---------- */
function initFan() {
  const G = 66;
  const U = [0.6, 0];
  const O = add(U, mul(dir(G), 1.7 / Math.sin(G * RAD)));
  const s = { d: 12 };
  const b = Geo.board($('fan'), { x: [-3.6, 4.4], y: [-1.1, 3.0], w: 520 });
  line(b, U, [1, 0], { cls: 'gl c-b' });
  line(b, U, add(U, dir(G)), { cls: 'gl c-c' });
  line(b, O, () => add(O, dir(-s.d)), { cls: 'gl c-a' }); // 假设下的 AB：∠1 = ∠2 + d
  line(b, O, add(O, [1, 0]), { cls: 'gdash' }); // GH：∠EOH = ∠2
  b.text(() => add(O, mul(dir(-s.d), -3.3)), 'A', { dy: -8 }); b.text(() => add(O, mul(dir(-s.d), 2.8)), 'B', { dy: 22 });
  b.text(add(O, [-3.4, 0]), 'G', { dy: -8 }); b.text(add(O, [2.8, 0]), 'H', { dy: -8 });
  b.text([-3.3, 0], 'C', { dy: -8 }); b.text([4.1, 0], 'D', { dy: -8 });
  b.text(add(O, mul(dir(G), 1.1)), 'E', { dx: 8 }); b.text(add(U, mul(dir(G), -0.9)), 'F', { dx: 8 });
  b.text(O, 'O', { dx: -22, dy: 18 });
  arc(b, O, () => add(O, dir(-s.d)), add(O, dir(G)), { r: 0.5, label: '1' });
  arc(b, U, add(U, [1, 0]), add(U, dir(G)), { r: 0.5, label: '2' });
  b.onUpdate = () => {
    $('fanDV').textContent = `${s.d}°`;
    const msg = $('fanMsg');
    msg.className = `tip feedback ${s.d ? 'fb-warn' : 'fb-ok'}`;
    msg.textContent = s.d
      ? `∠1 = ${G + s.d}°，∠2 = ${G}°：过点 O 出现了两条“平行于 CD”的直线 AB 和 GH——矛盾！`
      : `∠1 = ∠2 = ${G}°：GH 与 AB 重合，矛盾消失。`;
  };
  MathKit.slider($('fanD'), (v) => { s.d = v; b.update(); });
}

/* ---------- 静态示意图 ---------- */
// 上 a、下 b 两条平行线与截线 c；specs: [交点 'T'|'U', 区域, 标号]
function threeLines(id, specs) {
  const U = [0, 0];
  const T = [0.75, 1.7];
  const c = sub(T, U);
  const b = Geo.board($(id), { x: [-2.2, 3.6], y: [-0.9, 2.65], w: 340 });
  line(b, [-2, 0], [2.4, 0], { cls: 'gl thin-l' });
  line(b, [-1.25, 1.7], [3.15, 1.7], { cls: 'gl thin-l' });
  line(b, U, T, { cls: 'gl thin-l c-c' });
  b.text([3.2, 1.7], 'a', { dy: -8 }); b.text([3.2, 0], 'b', { dy: -8 }); b.text(add(T, mul(c, 0.5)), 'c', { dx: 8 });
  specs.forEach(([at, reg, n]) => {
    const X = at === 'T' ? T : U;
    const [A, B] = { RU: [[1, 0], c], LU: [c, [-1, 0]], LD: [[-1, 0], mul(c, -1)], RD: [mul(c, -1), [1, 0]] }[reg];
    arc(b, X, add(X, A), add(X, B), { r: 0.3, label: n, lr: 1.9 });
  });
  b.update();
}

function figures() {
  threeLines('f713', [['T', 'RU', '1'], ['T', 'LD', '3'], ['U', 'RU', '2']]);
  threeLines('f714', [['T', 'RU', '1'], ['T', 'RD', '3'], ['U', 'RU', '2']]);
  // 图 7-15：AB ∥ CD，∠A = ∠D
  sketch($('ex'), { P: { A: [0, 2], E: [1.2, 2], B: [2.4, 2], C: [-0.6, 0], F: [0.7, 0], D: [1.9, 0] }, seg: 'AB CD AF ED', ang: [['A', 'E', 'F', '', 0.35], ['D', 'C', 'E', '', 0.35], ['E', 'B', 'D', '', 0.3]], lab: { A: [-4, -10], E: [-4, -10], B: [-4, -10], C: [-6, 24], F: [-6, 24], D: [-6, 24] } });
  // 练一练 1
  sketch($('lx1'), { P: { P: [0, 1.4], Q: [0, 0], L: [-1.5, 1.4], M: [1.6, 1.4], N: [-1.5, 0], K: [1.6, 0], S: [0, 2.2], R: [0, -0.7] }, hide: 'PQLMNKSR', seg: 'LM NK SR', right: [['P', 'M', 'S']], text: [[[1.6, 1.4], 'l₁', 8, 6, 'lb'], [[1.6, 0], 'l₂', 8, 6, 'lb'], [[0, 2.2], 'l₃', 8, 4, 'lb']] });
  // 练一练 2：DE ∥ AC，FE ∥ DC
  {
    const B = [0, 0];
    const C = [5, 0];
    const A = [3.3, 2.3];
    const D = lerp(B, A, 0.84);
    const E = meet(D, add(D, sub(C, A)), B, C);
    const F = meet(E, add(E, sub(C, D)), B, A);
    sketch($('lx2'), { P: { A, B, C, D, E, F }, seg: 'AB BC CA DC FE DE', lab: { F: [-18, -4], D: [-16, -10] } });
  }
  // 练一练 3：AB ∥ EC，∠A = 55°，∠B = 60°
  {
    const B = [0, 0];
    const A = mul(dir(60), 3);
    const C = sub(A, mul(dir(115), A[1] / Math.sin(115 * RAD)));
    const E = add(C, mul(dir(60), 2.4));
    sketch($('lx3'), { P: { A, B, C, D: [4.6, 0], E }, seg: 'AB BD AC CE', ang: [['C', 'A', 'E', '1', 0.4], ['C', 'E', 'D', '2', 0.4]] });
  }
  // 习题 3：∠DCE = 30°
  {
    const E = [3.6 - 2 / Math.tan(30 * RAD), 0];
    sketch($('xt3'), { P: { A: [0, 0], B: [3.6, 0], C: [3.6, 2], D: [0, 2], E }, seg: 'AB BC CD DA', dash: 'EC', ang: [['E', 'A', 'C', '150°', 0.3]] });
  }
  // 习题 4：AD ∥ EF，DG ∥ AB（∠1 = ∠BAD 时的状态）
  {
    const B = [0, 0];
    const C = [5, 0];
    const A = [3, 3];
    const D = [2.3, 0];
    const E = lerp(B, A, 0.45);
    const F = meet(E, add(E, sub(D, A)), B, C);
    const G = meet(D, add(D, dir(Geo.angle(A, B, D))), A, C); // ∠GDC = ∠BAD，使 ∠1 + ∠2 = 180° 成立
    sketch($('xt4'), { P: { A, B, C, D, E, F, G }, seg: 'AB BC CA AD EF DG', ang: [['D', 'G', 'C', '1', 0.4], ['E', 'A', 'F', '2', 0.3]] });
  }
  // 习题 5：AD ⊥ BC，EG ⊥ BC
  {
    const B = [0, 0];
    const C = [4.2, 0];
    const A = [2.2, 1.9];
    const D = [2.2, 0];
    const G = [0.8, 0];
    const E = meet(C, A, G, [0.8, 1]);
    const F = meet(B, A, G, E);
    sketch($('xt5'), { P: { A, B, C, D, E, F, G }, seg: 'BC CE AB AD EG', ang: [['E', 'G', 'C', '1', 0.3], ['F', 'E', 'A', '2', 0.3]], right: [['D', 'A', 'C'], ['G', 'E', 'C']] });
  }
}

window.LESSON = {
  init() {
    initLap();
    initEight();
    initFan();
    figures();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
