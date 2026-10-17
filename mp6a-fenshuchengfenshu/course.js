'use strict';
/* 六上 分数与分数相乘 · 本课互动：长方形面积模型（先横分涂色，再竖分画斜线，数重叠格子）、
 * 例 5 点列画斜线、练一练看图、例 6 连乘线段图。格子数、线段长度全部按分数精确计算。 */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);
const el = FracFig.el;
const gcd = FracFig.gcd;
const GREEN = '#bfe6c4';
const GREEN_D = '#3c9a5f';
const LINE = '#2a9fd6';

/* 斜线图案：每个 svg 自带一份，避免 id 冲突 */
function hatchFill(svg) {
  const id = `hatch-${svg.id}`;
  if (!svg.querySelector(`#${id}`)) {
    const defs = el('defs', {}, svg);
    const p = el('pattern', { id, width: 10, height: 10, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
    el('rect', { width: 10, height: 10, fill: '#8ccf96' }, p);
    el('line', { x1: 0, y1: 0, x2: 0, y2: 10, stroke: '#1f6b3a', 'stroke-width': 3 }, p);
  }
  return `url(#${id})`;
}

/* 面积模型：长方形表示 1。stage 1 横分 b 份涂 a 份；stage 2 竖分 d 份，在涂色部分画 c 列斜线；
 * stage 3 竖线延长到整张纸（看出共 b×d 格）。cols 可传入要画斜线的列号集合（例 5 点选用） */
function drawArea(svg, o) {
  svg.innerHTML = '';
  const { a, b, c, d, stage } = o;
  const [x0, y0, W, H] = o.box;
  const ch = H / b;
  const cw = W / d;
  const fill = hatchFill(svg);
  el('rect', { x: x0, y: y0, width: W, height: H, fill: '#fff' }, svg);
  if (stage >= 1) {
    el('rect', { x: x0, y: y0, width: W, height: a * ch, fill: GREEN }, svg);
  }
  if (stage >= 2) {
    const cols = o.cols || [...Array(c).keys()];
    cols.forEach((k) => el('rect', { x: x0 + k * cw, y: y0, width: cw, height: a * ch, fill }, svg));
  }
  if (stage >= 1) {
    for (let r = 1; r < b; r += 1) el('line', { x1: x0, x2: x0 + W, y1: y0 + r * ch, y2: y0 + r * ch, stroke: LINE, 'stroke-width': 2 }, svg);
  }
  if (stage >= 2) {
    const yEnd = stage >= 3 ? y0 + H : y0 + a * ch;
    for (let k = 1; k < d; k += 1) el('line', { x1: x0 + k * cw, x2: x0 + k * cw, y1: y0, y2: yEnd, stroke: LINE, 'stroke-width': 1.6, 'stroke-dasharray': '6 4' }, svg);
  }
  el('rect', { x: x0, y: y0, width: W, height: H, fill: 'none', stroke: '#1d6fa5', 'stroke-width': 3 }, svg);
  return { x0, y0, cw, ch };
}

/* 例 4：两张纸，按钮分三步 */
function initEx4() {
  const box = [20, 20, 260, 160];
  const show = (stage) => {
    drawArea($('ex4a'), { a: 1, b: 2, c: 1, d: 4, stage, box });
    drawArea($('ex4b'), { a: 1, b: 2, c: 3, d: 4, stage, box });
  };
  document.querySelectorAll('[data-g]').forEach((btn) => btn.addEventListener('click', () => show(+btn.dataset.g)));
  show(0);
}

/* 核心：面积模型实验台 */
const LIM = { min: 2, max: 8 };
const ftex = (p, q) => `\\frac{${p}}{${q}}`;
function initLab() {
  const st = { a: 2, b: 3, c: 3, d: 4, stage: 0 };
  const svg = $('am');
  const render = () => {
    const { a, b, c, d, stage } = st;
    ['a', 'b', 'c', 'd'].forEach((k) => { $(`v${k}`).textContent = st[k]; });
    drawArea(svg, { a, b, c, d, stage, box: [30, 30, 500, 300] });
    let msg;
    if (stage === 0) msg = `这张纸表示 1。算一算 $${ftex(a, b)}\\times${ftex(c, d)}$，就是求 $${ftex(a, b)}$ 的 $${ftex(c, d)}$。点 ①。`;
    if (stage === 1) msg = `① 横着平均分成 <b>${b}</b> 份，涂 <b>${a}</b> 份：绿色是整张纸的 $${ftex(a, b)}$。`;
    if (stage === 2) msg = `② 竖着平均分成 <b>${d}</b> 份，在绿色里画 <b>${c}</b> 列斜线：斜线是绿色部分的 $${ftex(c, d)}$。斜线是整张纸的几分之几？`;
    if (stage === 3) {
      const [p, q] = [a * c, b * d];
      const g = gcd(p, q);
      const simp = g > 1 ? `=${q / g === 1 ? p / g : ftex(p / g, q / g)}` : '';
      msg = `③ 整张纸被分成 $${b}\\times${d}=${q}$ 格，斜线有 $${a}\\times${c}=${p}$ 格。<br>$${ftex(a, b)}\\times${ftex(c, d)}=\\frac{${a}\\times${c}}{${b}\\times${d}}=${ftex(p, q)}${simp}$`;
    }
    $('amMsg').innerHTML = msg;
    tex($('amMsg'));
  };
  document.querySelector('.fpick').addEventListener('click', (e) => {
    const k = e.target.closest('[data-k]')?.dataset.k;
    if (!k) return;
    const key = k[0];
    const step = k[1] === '+' ? 1 : -1;
    if (key === 'b' || key === 'd') st[key] = Math.min(LIM.max, Math.max(LIM.min, st[key] + step));
    else st[key] = Math.max(1, st[key] + step);
    st.a = Math.min(st.a, st.b);
    st.c = Math.min(st.c, st.d);
    render();
  });
  document.querySelectorAll('[data-s]').forEach((btn) => btn.addEventListener('click', () => { st.stage = +btn.dataset.s; render(); }));
  render();
}

/* 例 5：点列画斜线（横分 3 份涂 2 份，竖分 5 份） */
function initEx5() {
  [['ex5a', 1], ['ex5b', 4]].forEach(([id, need]) => {
    const svg = $(id);
    const cols = new Set();
    const box = [20, 15, 360, 200];
    const render = () => {
      const g = drawArea(svg, { a: 2, b: 3, c: 0, d: 5, stage: 3, box, cols: [...cols] });
      for (let k = 0; k < 5; k += 1) {
        const hit = el('rect', { x: g.x0 + k * g.cw, y: g.y0, width: g.cw, height: box[3], fill: 'transparent' }, svg);
        hit.addEventListener('click', () => { if (cols.has(k)) cols.delete(k); else cols.add(k); render(); });
      }
      const n = cols.size;
      const msg = $(`${id}Msg`);
      msg.innerHTML = !n ? '点竖着的一列，画上斜线'
        : n === need ? `✓ 画了 ${need} 列：斜线 $2\\times${need}=${2 * need}$ 格，整张 $3\\times5=15$ 格`
          : `画了 ${n} 列，算式要的是 $\\frac23$ 的 $\\frac{${need}}{5}$，该画几列？`;
      msg.classList.toggle('ok-t', n === need);
      tex(msg);
    };
    render();
  });
}

/* 练一练、练习六 1、第 6 页和小结的静态图 */
function initStatic() {
  drawArea($('lx1'), { a: 1, b: 3, c: 1, d: 4, stage: 3, box: [20, 20, 260, 160] });
  drawArea($('lx2'), { a: 3, b: 4, c: 2, d: 5, stage: 3, box: [20, 20, 260, 160] });
  drawArea($('why'), { a: 2, b: 3, c: 4, d: 5, stage: 3, box: [20, 15, 360, 200] });
  drawArea($('sumFig'), { a: 2, b: 3, c: 4, d: 5, stage: 3, box: [20, 15, 360, 200] });
  const lx3 = $('lx3');
  const draw3 = (t) => {
    drawArea(lx3, { a: 1, b: 2, c: t, d: 3, stage: t ? 2 : 1, box: [20, 20, 190, 160] });
    el('text', { x: 216, y: 64, class: 'lb s', style: 'text-anchor:start' }, lx3).textContent = '1/2 公顷';
    el('text', { x: 115, y: 196, class: 'lb s' }, lx3).textContent = '1 公顷';
  };
  document.querySelectorAll('[data-t]').forEach((btn) => btn.addEventListener('click', () => draw3(+btn.dataset.t)));
  draw3(0);
}

/* 例 6：一班 135 朵（9 份），二班 8 份 = 120 朵，三班是二班的 3/4 = 一班的 6 份 = 90 朵 */
function initEx6() {
  const svg = $('ex6');
  const [x0, unit] = [90, 480 / 135]; // 每朵的像素长度
  const Y = { 1: 60, 2: 140, 3: 215 };
  const lab = (x, y, s, cls = 'lb') => { el('text', { x, y, class: cls }, svg).textContent = s; };
  const seg = (y, n, color) => el('line', { x1: x0, x2: x0 + n * unit, y1: y, y2: y, stroke: color, 'stroke-width': 6 }, svg);
  const ticks = (y, n, parts) => { for (let i = 0; i <= parts; i += 1) el('line', { x1: x0 + (n * unit * i) / parts, x2: x0 + (n * unit * i) / parts, y1: y - 9, y2: y + 9, stroke: '#1f2d3a', 'stroke-width': 1.6 }, svg); };
  const brace = (y, n, s) => {
    el('path', { d: `M${x0} ${y - 16}v-7H${x0 + n * unit}v7`, fill: 'none', stroke: '#d6448f', 'stroke-width': 2 }, svg);
    lab(x0 + (n * unit) / 2, y - 30, s, 'lb s');
  };
  lab(40, Y[1] + 7, '一班'); lab(40, Y[2] + 7, '二班'); lab(40, Y[3] + 7, '三班');
  seg(Y[1], 135, '#2a9fd6'); ticks(Y[1], 135, 9); brace(Y[1], 135, '135 朵');
  const show = (k) => {
    svg.querySelectorAll('.l2, .l3').forEach((e) => e.remove());
    const grp = (cls) => { const g = el('g', { class: cls }, svg); return g; };
    if (k >= 2) {
      const g = grp('l2');
      el('line', { x1: x0, x2: x0 + 120 * unit, y1: Y[2], y2: Y[2], stroke: '#3c9a5f', 'stroke-width': 6 }, g);
      for (let i = 0; i <= 4; i += 1) el('line', { x1: x0 + 30 * i * unit, x2: x0 + 30 * i * unit, y1: Y[2] - 9, y2: Y[2] + 9, stroke: '#1f2d3a', 'stroke-width': 1.6 }, g);
      el('line', { x1: x0 + 120 * unit, x2: x0 + 120 * unit, y1: Y[1], y2: Y[2], stroke: '#9aa7b3', 'stroke-dasharray': '4 4' }, g);
      el('text', { x: x0 + 120 * unit + 50, y: Y[2] + 7, class: 'lb s' }, g).textContent = '一班的 8/9';
    }
    if (k >= 3) {
      const g = grp('l3');
      el('line', { x1: x0, x2: x0 + 90 * unit, y1: Y[3], y2: Y[3], stroke: '#d9711c', 'stroke-width': 6 }, g);
      el('line', { x1: x0 + 90 * unit, x2: x0 + 90 * unit, y1: Y[2], y2: Y[3], stroke: '#9aa7b3', 'stroke-dasharray': '4 4' }, g);
      el('text', { x: x0 + 90 * unit + 50, y: Y[3] + 7, class: 'lb s' }, g).textContent = '二班的 3/4';
      el('text', { x: x0 + 45 * unit, y: Y[3] + 30, class: 'lb s o' }, g).textContent = '? 朵';
    }
  };
  document.querySelectorAll('[data-l]').forEach((btn) => btn.addEventListener('click', () => show(+btn.dataset.l)));
}

window.LESSON = {
  init() {
    initEx4();
    initLab();
    initEx5();
    initStatic();
    initEx6();
    FracFig.exact();
  },
};
