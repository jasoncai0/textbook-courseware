'use strict';
/* 六下 圆锥的体积 · 本课互动：例 5 倒沙实验（等底等高 / 等底不等高 / 等高不等底，按体积精确计算沙面高度）、
 * 练习四第 2 题倒水、第 6 题找体积相等的圆柱。
 * 圆锥容器尖朝下：剩下的沙占圆锥体积的 f 时，沙面高度 = 圆锥高 × ∛f（相似圆锥的体积比 = 高的比的立方）；
 * 圆柱里沙面每倒一次升高 = 圆锥体积 ÷ 圆柱底面积。 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const el = (svg, tag, a, text) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(a).forEach(([k, v]) => e.setAttribute(k, v));
  if (text !== undefined) e.textContent = text;
  svg.appendChild(e);
  return e;
};
const btnGroup = (box, onPick) => box.addEventListener('click', (e) => {
  const b = e.target.closest('[data-k]');
  if (!b) return;
  box.querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x === b));
  onPick(b.dataset.k);
});
const K = 0.26; // 椭圆的扁度（ry = K × rx）

/* ---------- 第 3 页：等底等高的圆柱和圆锥 ---------- */
function drawPair(svg, R, H, x1, x2, base) {
  el(svg, 'path', { d: `M${x1 - R} ${base - H}V${base}A${R} ${R * K} 0 0 0 ${x1 + R} ${base}V${base - H}`, class: 'vs' });
  el(svg, 'ellipse', { cx: x1, cy: base - H, rx: R, ry: R * K, class: 'vs top' });
  el(svg, 'path', { d: `M${x1 - R} ${base}A${R} ${R * K} 0 0 1 ${x1 + R} ${base}`, class: 'hid' });
  el(svg, 'ellipse', { cx: x1, cy: base, rx: R, ry: R * K, class: 'basef' });
  el(svg, 'path', { d: `M${x2 - R} ${base}L${x2} ${base - H}L${x2 + R} ${base}A${R} ${R * K} 0 0 1 ${x2 - R} ${base}`, class: 'vs' });
  el(svg, 'path', { d: `M${x2 - R} ${base}A${R} ${R * K} 0 0 1 ${x2 + R} ${base}`, class: 'hid' });
  el(svg, 'ellipse', { cx: x2, cy: base, rx: R, ry: R * K, class: 'basef' });
  el(svg, 'line', { x1: 10, x2: x2 + R + 40, y1: base - H, y2: base - H, class: 'guide' });
  el(svg, 'line', { x1: 10, x2: x2 + R + 40, y1: base, y2: base, class: 'guide' });
}

/* ---------- 第 4 页：倒沙实验 ---------- */
const CASES = {
  same: { cr: 1, ch: 1, txt: '等底等高' },
  half: { cr: 1, ch: 0.5, txt: '等底，圆锥的高是圆柱的一半' },
  thin: { cr: 0.5, ch: 1, txt: '等高，圆锥的底面半径是圆柱的一半' },
};
function initPour() {
  const svg = $('pour');
  const R = 80;
  const H = 230;
  const base = 330;
  const cx = 520; // 圆柱中心
  const kx = 190; // 圆锥中心
  const st = { k: 'same', n: 0, level: 0, f: 1, busy: false };
  const C = () => CASES[st.k];
  const draw = () => {
    svg.innerHTML = '';
    const { cr, ch } = C();
    const r = R * cr;
    const h = H * ch;
    const top = 100; // 圆锥容器口所在高度
    // 圆锥容器（尖朝下）和里面的沙：剩 f 时沙面高 h·∛f
    const sh = h * Math.cbrt(st.f);
    const sr = r * Math.cbrt(st.f);
    const apex = top + h;
    el(svg, 'path', { d: `M${kx} ${apex}L${kx - sr} ${apex - sh}A${sr} ${sr * K} 0 0 0 ${kx + sr} ${apex - sh}Z`, class: 'sand' });
    if (st.f > 0.001) el(svg, 'ellipse', { cx: kx, cy: apex - sh, rx: sr, ry: sr * K, class: 'sand-top' });
    el(svg, 'path', { d: `M${kx - r} ${top}L${kx} ${apex}L${kx + r} ${top}`, class: 'vs' });
    el(svg, 'ellipse', { cx: kx, cy: top, rx: r, ry: r * K, class: 'vs rim' });
    el(svg, 'text', { x: kx, y: apex + 34, class: 'pt' }, '圆锥形容器');
    // 圆柱容器和沙
    const lv = Math.min(H, st.level);
    if (lv > 0) {
      el(svg, 'path', { d: `M${cx - R} ${base - lv}V${base}A${R} ${R * K} 0 0 0 ${cx + R} ${base}V${base - lv}Z`, class: 'sand' });
      el(svg, 'ellipse', { cx, cy: base - lv, rx: R, ry: R * K, class: 'sand-top' });
    }
    el(svg, 'path', { d: `M${cx - R} ${base - H}V${base}A${R} ${R * K} 0 0 0 ${cx + R} ${base}V${base - H}`, class: 'vs' });
    el(svg, 'ellipse', { cx, cy: base - H, rx: R, ry: R * K, class: 'vs rim' });
    for (let i = 1; i < 3; i += 1) el(svg, 'line', { x1: cx + R + 4, x2: cx + R + 18, y1: base - (H * i) / 3, y2: base - (H * i) / 3, class: 'tick' });
    el(svg, 'text', { x: cx + R + 22, y: base - H / 3 + 6, class: 'pt s' }, '1/3');
    el(svg, 'text', { x: cx + R + 22, y: base - (2 * H) / 3 + 6, class: 'pt s' }, '2/3');
    el(svg, 'text', { x: cx, y: base + R * K + 34, class: 'pt' }, '圆柱形容器');
    if (st.busy && st.f < 1 && st.f > 0) el(svg, 'path', { d: `M${kx + r * 0.9} ${top - 6}Q${(kx + cx) / 2} ${top - 70} ${cx} ${base - H - 10}`, class: 'stream' });
    const full = st.level >= H - 0.01;
    $('pourN').textContent = st.n;
    const ratio = (cr * cr * ch) / 3; // 一次倒入的沙占圆柱体积的几分之几
    $('pourMsg').className = `tip feedback ${full ? 'ok' : ''}`;
    $('pourMsg').innerHTML = full
      ? `倒了 <b>${st.n}</b> 次正好倒满。${st.k === 'same' ? '圆锥的体积正好是与它<b>等底等高</b>的圆柱体积的 $\\dfrac13$。' : `这个圆锥的体积是圆柱的 $\\dfrac{1}{${Math.round(1 / ratio)}}$，<b>不是</b> $\\dfrac13$——因为它们不是等底等高。`}`
      : `${C().txt}：已经倒了 <b>${st.n}</b> 次，圆柱里的沙有多高？`;
    MathKit.tex($('pourMsg'));
    $('pourOne').disabled = full || st.busy;
    $('pourAll').disabled = full || st.busy;
  };
  const once = (then) => {
    const { cr, ch } = C();
    const dL = H * cr * cr * ch / 3; // 圆锥体积 ÷ 圆柱底面积（按比例）
    const from = st.level;
    st.busy = true;
    const t0 = performance.now();
    const MS = 1000;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / MS);
      st.f = 1 - p;
      st.level = from + dL * p;
      draw();
      if (p < 1) { requestAnimationFrame(tick); return; }
      st.n += 1;
      st.busy = false;
      setTimeout(() => { st.f = 1; draw(); if (then) then(); }, 350);
    };
    requestAnimationFrame(tick);
  };
  const reset = () => { Object.assign(st, { n: 0, level: 0, f: 1, busy: false }); draw(); };
  $('pourOne').addEventListener('click', () => once());
  $('pourAll').addEventListener('click', () => {
    const loop = () => { if (st.level < H - 0.01) once(loop); };
    loop();
  });
  $('pourReset').addEventListener('click', reset);
  btnGroup($('pourK'), (k) => { st.k = k; reset(); });
  reset();
}

/* ---------- 第 8 页：练习四第 2 题（1 cm = 14 单位） ---------- */
function initWater() {
  const svg = $('water');
  const U = 14;
  const R = 5 * U;
  const H = 12 * U;
  const base = 230;
  const [kx, cx] = [110, 330];
  const top = 40;
  el(svg, 'path', { d: `M${kx} ${top + H}L${kx - R} ${top}A${R} ${R * K} 0 0 0 ${kx + R} ${top}Z`, class: 'water' });
  el(svg, 'path', { d: `M${kx - R} ${top}L${kx} ${top + H}L${kx + R} ${top}`, class: 'vs' });
  el(svg, 'ellipse', { cx: kx, cy: top, rx: R, ry: R * K, class: 'vs rim' });
  const lv = 4 * U;
  el(svg, 'g', { 'data-step': 1 }).innerHTML = `<path d="M${cx - R} ${base - lv}V${base}A${R} ${R * K} 0 0 0 ${cx + R} ${base}V${base - lv}Z" class="water"/><ellipse cx="${cx}" cy="${base - lv}" rx="${R}" ry="${R * K}" class="water-top"/><text x="${cx + R + 8}" y="${base - lv / 2 + 6}" class="pt s hot">4 cm</text>`;
  el(svg, 'path', { d: `M${cx - R} ${base - H}V${base}A${R} ${R * K} 0 0 0 ${cx + R} ${base}V${base - H}`, class: 'vs' });
  el(svg, 'ellipse', { cx, cy: base - H, rx: R, ry: R * K, class: 'vs rim' });
  el(svg, 'text', { x: kx, y: top - 24, class: 'pt s c' }, '直径 10 cm，高 12 cm');
  el(svg, 'text', { x: cx, y: base - H - 24, class: 'pt s c' }, '直径 10 cm，高 12 cm');
}

/* ---------- 第 8 页：练习四第 6 题（1 cm = 11 单位） ---------- */
function initMatch() {
  const svg = $('match');
  const U = 11;
  const base = 175;
  const S = [{ cone: true, d: 9, h: 12 }, { d: 9, h: 12 }, { d: 3, h: 12 }, { d: 9, h: 4 }, { d: 3, h: 4 }];
  let x = 20;
  S.forEach((s, i) => {
    const R = (s.d / 2) * U;
    const H = s.h * U;
    const c = x + R;
    if (s.cone) el(svg, 'path', { d: `M${c - R} ${base}L${c} ${base - H}L${c + R} ${base}A${R} ${R * K} 0 0 1 ${c - R} ${base}`, class: 'wood' });
    else {
      el(svg, 'path', { d: `M${c - R} ${base - H}V${base}A${R} ${R * K} 0 0 0 ${c + R} ${base}V${base - H}`, class: 'wood' });
      el(svg, 'ellipse', { cx: c, cy: base - H, rx: R, ry: R * K, class: 'wood top' });
    }
    el(svg, 'text', { x: c, y: base + R * K + 22, class: 'pt s c' }, `直径 ${s.d}`);
    el(svg, 'text', { x: c, y: base - H - R * K - 8, class: 'pt s c' }, i ? `${'ABCD'[i - 1]}　高 ${s.h}` : `圆锥　高 ${s.h}`);
    x += 2 * R + 34;
  });
}

window.LESSON = {
  init() {
    drawPair($('pair'), 90, 210, 160, 430, 260);
    initPour();
    initWater();
    initMatch();
  },
};
