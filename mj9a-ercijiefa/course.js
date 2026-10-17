'use strict';
/* 九上 1.2 一元二次方程的解法 · 本课互动：(x+h)²=k 数轴、配方拼图（图 1-3）、判别式实验。通用部分见 ../shared/math.js
 * 所有图形由坐标计算：拼图中 x 取 4 个单位，矩形面积 q = x(x + p) 与右边的式子一致；数轴上的根由公式精确计算。 */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);

/* ---------- 式子格式化 ---------- */
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
/** 有理数 n/d 的 TeX（约分，负号提到前面） */
function frac(n, d = 1) {
  const g = gcd(n, d) || 1;
  let [p, q] = [n / g, d / g];
  if (q < 0) [p, q] = [-p, -q];
  if (q === 1) return String(p);
  return `${p < 0 ? '-' : ''}\\frac{${Math.abs(p)}}{${q}}`;
}
/** ax² + bx + c 的 TeX（整数系数） */
function poly(a, b, c) {
  const term = (k, v, first) => {
    if (k === 0) return '';
    const sign = k < 0 ? '-' : (first ? '' : '+');
    const m = Math.abs(k);
    return `${sign}${v && m === 1 ? '' : m}${v}`;
  };
  const s = `${term(a, 'x^2', true)}${term(b, 'x', !a)}${term(c, '', !a && !b)}`;
  return s || '0';
}
/** √n 化简：返回 [外, 内]，√12 → [2, 3] */
function simpSqrt(n) {
  let out = 1;
  let inn = n;
  for (let f = 2; f * f <= inn; f++) while (inn % (f * f) === 0) { out *= f; inn /= f * f; }
  return [out, inn];
}

/* ---------- 数轴：画中心 m 与根 m ± r（r2 = r² < 0 时无根） ---------- */
const NL_X = [-8.6, 8.6];
function numberLine(el, get) {
  const b = board(el, { x: NL_X, y: [-1.3, 1.7], axes: false, grid: false, w: 620 });
  b.seg([[NL_X[0] + 0.2, 0], [NL_X[1] - 0.2, 0]], { cls: 'nl-ax' });
  for (let t = -8; t <= 8; t++) {
    b.seg([[t, -0.12], [t, 0.12]], { cls: 'nl-tk' });
    b.text([t, 0], String(t).replace('-', '−'), { cls: 'tk c', dy: 30 });
  }
  const st = () => get();
  const roots = () => { const { m, r2 } = st(); if (r2 < 0) return []; const r = Math.sqrt(r2); return r < 1e-9 ? [m] : [m - r, m + r]; };
  b.seg(() => { const { m } = st(); return [[m, -0.45], [m, 0.45]]; }, { cls: 'nl-mid' });
  b.text(() => [st().m, 0.45], () => st().midLabel, { cls: 'lb up c sm', dy: -10 });
  b.seg(() => { const R = roots(); return R.length === 2 ? [[R[0], 1.15], [R[1], 1.15]] : [[0, 0], [0, 0]]; }, { cls: 'nl-span' });
  b.text(() => { const R = roots(); return R.length === 2 ? [(R[0] + R[1]) / 2 + (R[1] - R[0]) / 4, 1.15] : null; }, () => st().rLabel, { cls: 'lb up c sm', dy: -8 });
  b.pt(() => { const R = roots(); return R.length ? [R[0], 0] : null; }, { cls: 'c2', r: 8 });
  b.pt(() => { const R = roots(); return R.length === 2 ? [R[1], 0] : null; }, { cls: 'c2', r: 8 });
  b.text(() => { const R = roots(); return R.length ? [R[0], 0] : null; }, () => (roots().length === 1 ? 'x₁ = x₂' : 'x₂'), { cls: 'lb up c rt', dy: -18 });
  b.text(() => { const R = roots(); return R.length === 2 ? [R[1], 0] : null; }, 'x₁', { cls: 'lb up c rt', dy: -18 });
  return b;
}

/* 第 4 页：(x + h)² = k */
function initHK() {
  const s = { h: 1, k: 2 };
  const b = numberLine($('hkLine'), () => ({
    m: -s.h, r2: s.k, midLabel: `−h = ${fmt(-s.h)}`.replace('= -', '= −'), rLabel: `√${s.k}`,
  }));
  const eqTex = () => (s.h === 0 ? 'x^2' : `(x${s.h > 0 ? '+' : '-'}${Math.abs(s.h)})^2`) + `=${s.k}`;
  b.onUpdate = () => {
    $('hkHV').textContent = s.h; $('hkKV').textContent = s.k;
    $('hkEq').innerHTML = `$$${eqTex()}$$`;
    const m = $('hkMsg');
    const c = s.h === 0 ? 'x' : `x${s.h > 0 ? '+' : '-'}${Math.abs(s.h)}`;
    if (s.k > 0) {
      const [o, i] = simpSqrt(s.k);
      const rt = i === 1 ? String(o) : `${o === 1 ? '' : o}\\sqrt{${i}}`;
      const exact = i === 1 ? `x_1=${-s.h + o},\\ x_2=${-s.h - o}` : `x=${-s.h || ''}\\pm${rt}`;
      m.className = 'tip feedback fb-ok';
      m.innerHTML = `$k&gt;0$：$${c}=\\pm${rt}$，两个不相等的根 $${exact}$。`;
    } else if (s.k === 0) {
      m.className = 'tip feedback fb-ok';
      m.innerHTML = `$k=0$：$${c}=0$，两个相等的根 $x_1=x_2=${-s.h}$。`;
    } else {
      m.className = 'tip feedback fb-warn';
      m.innerHTML = `$k&lt;0$：任何数的平方都不是负数，方程<b>没有实数根</b>。`;
    }
    tex($('hkEq')); tex(m);
  };
  slider($('hkH'), (v) => { s.h = v; b.update(); });
  slider($('hkK'), (v) => { s.k = v; b.update(); });
}

/* 第 13 页：判别式实验 */
function initDelta() {
  const s = { a: 1, b: 1, c: -1 };
  const D = () => s.b * s.b - 4 * s.a * s.c;
  const bd = numberLine($('dLine'), () => (s.a === 0 ? { m: 99, r2: -1, midLabel: '', rLabel: '' } : {
    m: -s.b / (2 * s.a), r2: D() / (4 * s.a * s.a), midLabel: `−b/2a = ${fmt(-s.b / (2 * s.a))}`.replace('= -', '= −'), rLabel: '√Δ/2|a|',
  }));
  bd.onUpdate = () => {
    $('dAV').textContent = s.a; $('dBV').textContent = s.b; $('dCV').textContent = s.c;
    const d = D();
    const k = s.a === 0 ? null : Math.sign(d);
    $('dCase').querySelectorAll('p').forEach((p) => p.classList.toggle('on', k !== null && +p.dataset.k === k));
    if (s.a === 0) {
      $('dEq').innerHTML = `$$${poly(0, s.b, s.c)}=0$$<span class="warn-t">$a=0$：这不是一元二次方程！</span>`;
    } else {
      const roots = d > 0
        ? `x=\\frac{${-s.b}\\pm\\sqrt{${d}}}{${2 * s.a}}\\approx${fmt((-s.b + Math.sqrt(d)) / (2 * s.a))},\\ ${fmt((-s.b - Math.sqrt(d)) / (2 * s.a))}`
        : (d === 0 ? `x_1=x_2=${frac(-s.b, 2 * s.a)}` : '\\text{无实数根}');
      $('dEq').innerHTML = `$$${poly(s.a, s.b, s.c)}=0$$<span>$\\Delta=b^2-4ac=${s.b < 0 ? `(${s.b})` : s.b}^2-4\\times${s.a < 0 ? `(${s.a})` : s.a}\\times${s.c < 0 ? `(${s.c})` : s.c}=${d}$　$${roots}$</span>`;
    }
    tex($('dEq'));
  };
  slider($('dA'), (v) => { s.a = v; bd.update(); });
  slider($('dB'), (v) => { s.b = v; bd.update(); });
  slider($('dC'), (v) => { s.c = v; bd.update(); });
}

/* ---------- 第 7 页：配方拼图 ---------- */
const X0 = 4; // 图中 x 的长度（单位）
const LAST = 5;
const ANIM_MS = 1100;

function pfRows(p) {
  const h = frac(p, 2);
  const h2 = frac(p * p, 4);
  const q = X0 * X0 + p * X0;
  const Q = frac((2 * X0 + p) ** 2, 4);
  const hx = p === 2 ? '1' : h;
  return [
    [`x(x+${p})=${q}`, `长 $x+${p}$、宽 $x$ 的矩形，面积 ${q}`],
    [`x^2+${p}x=${q}`, '割成正方形 $x^2$ 和长条 $' + p + 'x$'],
    [`x^2+2\\cdot ${hx}\\cdot x=${q}`, `长条平分成两条 $${hx}\\cdot x$`],
    ['\\text{缺一个角}', `一条转到上边，右上角缺一个边长 $${hx}$ 的正方形`],
    [`x^2+2\\cdot ${hx}\\cdot x+${p % 2 ? `\\left(${h}\\right)` : hx}^2=${q}+${p % 2 ? `\\left(${h}\\right)` : hx}^2`, `两边都补上 $${h2}$（等式的性质）`],
    [`\\left(x+${h}\\right)^2=${Q}`, '拼成一个正方形'],
  ];
}

function initPeifang() {
  const s = { p: 2, stage: 0, u: 1 }; // u：当前阶段动画进度
  const x = X0;
  const b = board($('pf'), { x: [-1.6, 11.6], y: [-1.6, 7.9], axes: false, grid: false, w: 640 });
  const h = () => s.p / 2;
  const at = (k) => s.stage > k || (s.stage === k && s.u >= 1);
  const show = (k) => s.stage >= k;
  // 移动的那一条：从右边 [x+h, x+2h]×[0, x] 转 90° 到上边 [0, x]×[x, x+h]
  const movingPiece = () => {
    const H = h();
    const t = s.stage < 3 ? 0 : (s.stage === 3 ? s.u : 1);
    const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
    const c0 = [x + 1.5 * H, x / 2];
    const c1 = [x / 2, x + H / 2];
    const ctl = [c0[0], c1[1] + 1.2];
    const c = [0, 1].map((i) => (1 - e) ** 2 * c0[i] + 2 * (1 - e) * e * ctl[i] + e * e * c1[i]);
    const th = (e * Math.PI) / 2;
    return [[-H / 2, -x / 2], [H / 2, -x / 2], [H / 2, x / 2], [-H / 2, x / 2]].map(([u, v]) => [c[0] + u * Math.cos(th) - v * Math.sin(th), c[1] + u * Math.sin(th) + v * Math.cos(th)]);
  };
  const box = (x1, y1, x2, y2) => [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
  b.poly(() => (s.stage === 0 ? box(0, 0, x + s.p, x) : []), { cls: 'pf-all' });
  b.poly(() => (s.stage >= 1 ? box(0, 0, x, x) : []), { cls: 'pf-sq' });
  b.poly(() => (s.stage === 1 ? box(x, 0, x + s.p, x) : []), { cls: 'pf-strip' });
  b.poly(() => (s.stage >= 2 ? box(x, 0, x + h(), x) : []), { cls: 'pf-strip' });
  b.poly(() => (s.stage >= 2 ? movingPiece() : []), { cls: 'pf-strip mv' });
  b.poly(() => (s.stage === 3 && s.u >= 1 ? box(x, x, x + h(), x + h()) : []), { cls: 'pf-gap' });
  b.poly(() => (s.stage >= 4 ? box(x, x, x + h(), x + h()) : []), { cls: 'pf-corner' });
  b.poly(() => (s.stage >= 5 ? box(0, 0, x + h(), x + h()) : []), { cls: 'pf-big' });
  b.seg(() => (s.stage === 2 ? [[x + h(), 0], [x + h(), x]] : [[0, 0], [0, 0]]), { cls: 'dash' });
  // 面积标签
  const hs = () => fmt(h());
  b.text(() => (s.stage === 0 ? [(x + s.p) / 2, x / 2] : null), () => `面积 ${X0 * X0 + s.p * X0}`, { cls: 'lb up c', dy: 8 });
  b.text(() => (s.stage >= 1 && s.stage < 5 ? [x / 2, x / 2] : null), 'x²', { cls: 'lb c', dy: 8 });
  b.text(() => (s.stage === 1 ? [x + s.p / 2, x / 2] : null), () => `${s.p}·x`, { cls: 'lb up c', dy: 8 });
  b.text(() => (s.stage >= 2 && s.stage < 5 ? [x + h() / 2, x / 2] : null), () => `${hs()}·x`, { cls: 'lb up c sm v', dy: 8 });
  b.text(() => (s.stage === 2 ? [x + 1.5 * h(), x / 2] : null), () => `${hs()}·x`, { cls: 'lb up c sm v', dy: 8 });
  b.text(() => (at(3) && s.stage < 5 ? [x / 2, x + h() / 2] : null), () => `${hs()}·x`, { cls: 'lb up c sm', dy: 7 });
  b.text(() => (at(3) && s.stage < 5 ? [x + h() / 2, x + h() / 2] : null), () => `${hs()}²`, { cls: 'lb up c sm pk', dy: 7 });
  b.text(() => (s.stage >= 5 ? [(x + h()) / 2, (x + h()) / 2] : null), () => `(x+${hs()})² = ${fmt((x + h()) ** 2)}`, { cls: 'lb up c big', dy: 8 });
  // 尺寸标注
  b.text(() => [x / 2, 0], 'x', { cls: 'lb c', dy: 26 });
  b.text(() => [0, x / 2], 'x', { cls: 'lb c', dx: -18, dy: 6 });
  b.text(() => (s.stage === 0 || s.stage === 1 ? [x + s.p / 2, 0] : null), () => String(s.p), { cls: 'lb up c', dy: 26 });
  b.text(() => (s.stage >= 2 ? [x + h() / 2, 0] : null), hs, { cls: 'lb up c', dy: 26 });
  b.text(() => (at(3) ? [0, x + h() / 2] : null), hs, { cls: 'lb up c', dx: -18, dy: 6 });

  let raf = 0;
  const render = () => {
    $('pfPV').textContent = s.p;
    const rows = pfRows(s.p);
    $('pfChain').innerHTML = rows.slice(0, s.stage + 1).map(([f, why], i) => `<div class="dl${i === s.stage ? ' key' : ''}${i > s.stage ? ' later' : ''}"><span>$${f}$</span><i class="why">${why}</i></div>`).join('');
    tex($('pfChain'));
    const m = $('pfMsg');
    if (s.stage === LAST) {
      const r2 = -(X0 + s.p);
      m.className = 'tip feedback fb-ok';
      m.innerHTML = `开平方：$x+${frac(s.p, 2)}=\\pm${frac(2 * X0 + s.p, 2)}$，$x_1=${X0}$，$x_2=${r2}$。图里的正方形对应正根 $x=${X0}$。`;
    } else {
      m.className = 'tip feedback';
      m.textContent = `第 ${s.stage + 1} / ${LAST + 1} 步：点“下一步”继续拼。`;
    }
    tex(m);
    $('pfPrev').disabled = s.stage === 0;
    $('pfNext').disabled = s.stage === LAST;
    b.update();
  };
  const go = (k) => {
    cancelAnimationFrame(raf);
    s.stage = Math.max(0, Math.min(LAST, k));
    s.u = s.stage === 3 && k > 2 ? 0 : 1;
    render();
    if (s.u >= 1) return;
    const t0 = performance.now();
    const tick = (now) => {
      s.u = Math.min(1, (now - t0) / ANIM_MS);
      b.update();
      if (s.u < 1) raf = requestAnimationFrame(tick); else render();
    };
    raf = requestAnimationFrame(tick);
  };
  $('pfNext').addEventListener('click', () => go(s.stage + 1));
  $('pfPrev').addEventListener('click', () => { s.stage = Math.max(0, s.stage - 1); s.u = 1; render(); });
  slider($('pfP'), (v) => { s.p = v; s.u = 1; render(); });
}

window.LESSON = {
  init() {
    initHK();
    initPeifang();
    initDelta();
  },
};
