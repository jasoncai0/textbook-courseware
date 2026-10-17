'use strict';
/* 五下 已知周长求面积与圆环的面积 · 本课互动：拖半径抠掉内圆、圆环剪开交错拼、窗户与涂色部分。通用部分见 ../shared/math.js、mcheck.js */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const txt = (parent, x, y, t, cls = 'lb') => { const e = svgEl('text', { x, y, class: cls }, parent); e.textContent = t; return e; };
const f2 = (v) => v.toFixed(2);
// 3.14 × n，去掉多余的 0（避免浮点尾巴）
const pi314 = (n) => String(+(3.14 * n).toFixed(4));

/* ---------- 第 4 页：大圆减小圆 ---------- */
const RING = { c: [220, 190], px: 15 }; // 1 厘米 = 15 个单位
function initRing() {
  const s = $('ring');
  const [cx, cy] = RING.c;
  const st = { R: 10, r: 6 };
  const outer = svgEl('circle', { cx, cy, class: 'outer' }, s);
  const hole = svgEl('circle', { cx, cy, class: 'hole' }, s);
  const inner = svgEl('circle', { cx, cy, class: 'inner' }, s);
  const lineR = svgEl('line', { x1: cx, y1: cy, class: 'rR' }, s);
  const liner = svgEl('line', { x1: cx, y1: cy, class: 'rr' }, s);
  svgEl('circle', { cx, cy, r: 4, class: 'dot' }, s);
  const tR = txt(s, 0, 0, '', 'lb o-f');
  const tr = txt(s, 0, 0, '', 'lb b-f');
  const draw = () => {
    const R = st.R * RING.px;
    const r = st.r * RING.px;
    outer.setAttribute('r', R); hole.setAttribute('r', r); inner.setAttribute('r', r);
    const a = (-35 * Math.PI) / 180;
    lineR.setAttribute('x2', f2(cx + R * Math.cos(a))); lineR.setAttribute('y2', f2(cy + R * Math.sin(a)));
    liner.setAttribute('x2', f2(cx - r)); liner.setAttribute('y2', cy);
    tR.setAttribute('x', f2(cx + (R / 2) * Math.cos(a) + 6)); tR.setAttribute('y', f2(cy + (R / 2) * Math.sin(a) - 8));
    tR.textContent = `R=${st.R}`;
    tr.setAttribute('x', f2(cx - r / 2 - 26)); tr.setAttribute('y', cy + 26);
    tr.textContent = `r=${st.r}`;
    $('ringRv').textContent = `${st.R} cm`;
    $('ringrv').textContent = `${st.r} cm`;
    $('sOut').textContent = pi314(st.R * st.R);
    $('sIn').textContent = pi314(st.r * st.r);
    $('sRing').textContent = pi314(st.R * st.R - st.r * st.r);
  };
  $('ringR').addEventListener('input', (e) => {
    st.R = +e.target.value;
    if (st.r >= st.R) { st.r = st.R - 1; $('ringr').value = st.r; }
    draw();
  });
  $('ringr').addEventListener('input', (e) => {
    st.r = Math.min(+e.target.value, st.R - 1);
    e.target.value = st.r;
    draw();
  });
  $('ringCut').addEventListener('click', () => inner.classList.add('out'));
  $('ringBack').addEventListener('click', () => inner.classList.remove('out'));
  draw();
}

/* ---------- 第 6 页：圆环剪开，上下交错拼 ---------- */
// 一块圆环扇形：圆心在原点，中线沿 +x，半角 h
function annD(R, r, h) {
  const p = (rad, t) => `${f2(rad * Math.cos(t))} ${f2(rad * Math.sin(t))}`;
  return `M${p(r, -h)}L${p(R, -h)}A${R} ${R} 0 0 1 ${p(R, h)}L${p(r, h)}A${r} ${r} 0 0 0 ${p(r, -h)}Z`;
}
/* 精确拼法：外弦 cR = 2R·sin h，内弦 cr = 2r·sin h；上排尖朝上的梯形（外弦在上），下排倒梯形插空，
   相邻两块共用一条剪开的边（长 R − r），中线间距 (cR + cr)/2 */
function pose(k, n, g, assembled) {
  const a = (2 * Math.PI) / n;
  const top = k < n / 2;
  const mid = Math.PI + (k + 0.5) * a;
  if (!assembled) return { x: g.cx, y: g.cy, deg: ((top ? mid : mid - 2 * Math.PI) * 180) / Math.PI };
  const h = a / 2;
  const cR = 2 * g.R * Math.sin(h);
  const cr = 2 * g.r * Math.sin(h);
  const step = cR + cr;
  const m = top ? k : k - n / 2;
  return top
    ? { x: g.x0 + m * step, y: g.yt + g.R * Math.cos(h), deg: 270 }
    : { x: g.x0 + step / 2 + m * step, y: g.yt - g.r * Math.cos(h), deg: 90 };
}
const poseCss = ({ x, y, deg }) => `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${deg.toFixed(2)}deg)`;
const CUT = { cx: 140, cy: 150, R: 120, r: 72, x0: 345, yt: 110 }; // R : r = 10 : 6
function initCut() {
  const s = $('cutFig');
  const st = { n: 16, on: false, pieces: [] };
  svgEl('circle', { cx: CUT.cx, cy: CUT.cy, r: CUT.R, class: 'ghost' }, s);
  svgEl('circle', { cx: CUT.cx, cy: CUT.cy, r: CUT.r, class: 'ghost' }, s);
  const layer = svgEl('g', {}, s);
  const marks = svgEl('g', { class: 'cut-marks' }, s);
  const build = () => {
    layer.innerHTML = '';
    marks.innerHTML = '';
    const h = Math.PI / st.n;
    st.pieces = Array.from({ length: st.n }, (_, k) => {
      const g = svgEl('g', { class: `pc ${k < st.n / 2 ? 'top' : 'bot'}` }, layer);
      svgEl('path', { d: annD(CUT.R, CUT.r, h) }, g);
      g.style.transform = poseCss(pose(k, st.n, CUT, false));
      return g;
    });
    st.on = false;
    $('cutGo').textContent = '拼一拼 ▶';
  };
  const label = () => {
    marks.innerHTML = '';
    if (!st.on) return;
    const h = Math.PI / st.n;
    const H = (CUT.R - CUT.r) * Math.cos(h);
    const len = (st.n / 2) * (2 * CUT.R * Math.sin(h) + 2 * CUT.r * Math.sin(h)); // 底的长度
    const left = CUT.x0 - CUT.R * Math.sin(h);
    const yb = CUT.yt + H;
    const yd = CUT.yt - 26;
    svgEl('path', { d: `M${f2(left)} ${yd}h${f2(len)}M${f2(left)} ${yd - 8}v16M${f2(left + len)} ${yd - 8}v16`, class: 'dim' }, marks);
    txt(marks, f2(left + len / 2), yd - 14, `底 ≈ π(R + r)：${st.n} 份时约 ${(len / 12).toFixed(2)} 厘米（π × 16 ≈ 50.27）`, 'lb sm mid');
    const xl = left - 10;
    svgEl('path', { d: `M${f2(xl)} ${CUT.yt}V${f2(yb)}`, class: 'dim' }, marks);
    txt(marks, f2(left), f2(yb + 40), '高 = R − r = 4 厘米（左边红线）', 'lb sm');
  };
  $('cutN').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-n]');
    if (!btn) return;
    st.n = +btn.dataset.n;
    $('cutN').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b === btn));
    build();
  });
  $('cutGo').addEventListener('click', () => {
    st.on = !st.on;
    st.pieces.forEach((p, k) => {
      p.style.transitionDelay = st.on && k >= st.n / 2 ? '.8s' : '0s';
      p.style.transform = poseCss(pose(k, st.n, CUT, st.on));
    });
    $('cutGo').textContent = st.on ? '↺ 还原成圆环' : '拼一拼 ▶';
    marks.innerHTML = '';
    if (st.on) setTimeout(label, 1700);
  });
  build();
}

/* ---------- 第 7 页：窗户（正方形边长 1.8 米，1 米 = 120 个单位） ---------- */
function initWin() {
  const s = $('win');
  const a = 1.8 * 120;
  const [x, y] = [40, 100];
  svgEl('path', { d: `M${x} ${y}A${a / 2} ${a / 2} 0 0 1 ${x + a} ${y}Z`, class: 'shade b2' }, s);
  svgEl('rect', { x, y, width: a, height: a, class: 'shade' }, s);
  svgEl('path', { d: `M${x + a + 12} ${y}v${a}`, class: 'dim' }, s);
  txt(s, x + a + 18, y + a / 2 + 8, '1.8 米', 'lb sm');
  svgEl('path', { d: `M${x} ${y}h${a}`, class: 'dash-l' }, s);
}

/* ---------- 第 8 页：练一练涂色部分（1 cm = 25 个单位） ---------- */
function initShaded() {
  const u = 25;
  const s1 = $('sh1');
  const [x, y] = [40, 20];
  svgEl('rect', { x, y, width: 8 * u, height: 4 * u, class: 'shade' }, s1);
  svgEl('path', { d: `M${x} ${y + 4 * u}A${4 * u} ${4 * u} 0 0 1 ${x + 8 * u} ${y + 4 * u}Z`, class: 'white' }, s1);
  svgEl('path', { d: `M${x} ${y + 4 * u + 18}h${8 * u}`, class: 'dim' }, s1);
  txt(s1, x + 4 * u - 20, y + 4 * u + 40, 'd = 8', 'lb sm it');
  const s2 = $('sh2');
  const [px, top] = [110, 10];
  const r = 3 * u;
  svgEl('path', { d: `M${px} ${top}A${r} ${r} 0 0 0 ${px} ${top + 6 * u}Z`, class: 'shade' }, s2);
  svgEl('path', { d: `M${px} ${top}V${top + 6 * u}H${px + 6 * u}Z`, class: 'shade' }, s2);
  svgEl('path', { d: `M${px} ${top + 6 * u - 10}h10v10`, class: 'dim' }, s2);
  txt(s2, px + 8, top + 3 * u, 'd = 6', 'lb sm it');
  txt(s2, px + 3 * u - 6, top + 6 * u + 18, '6', 'lb sm');
}

/* ---------- 第 9 页：练习十五第 14 题 ---------- */
function initSq3() {
  const s = $('sq3');
  const a = 90;
  [10, 120, 230].forEach((x, i) => {
    const y = 10;
    svgEl('rect', { x, y, width: a, height: a, class: 'shade' }, s);
    const h = a / 2;
    const d = [
      `M${x + h} ${y}A${h} ${h} 0 1 1 ${x + h} ${y + a}A${h} ${h} 0 1 1 ${x + h} ${y}Z`,
      `M${x} ${y}A${h} ${h} 0 0 0 ${x + a} ${y}ZM${x} ${y + a}A${h} ${h} 0 0 1 ${x + a} ${y + a}Z`,
      `M${x} ${y}h${h}A${h} ${h} 0 0 1 ${x} ${y + h}Z M${x + a} ${y}v${h}A${h} ${h} 0 0 1 ${x + h} ${y}Z M${x} ${y + a}v${-h}A${h} ${h} 0 0 1 ${x + h} ${y + a}Z M${x + a} ${y + a}h${-h}A${h} ${h} 0 0 1 ${x + a} ${y + h}Z`,
    ][i];
    svgEl('path', { d, class: 'white' }, s);
  });
}

window.LESSON = {
  init() {
    initRing();
    initCut();
    initWin();
    initShaded();
    initSq3();
  },
};
