'use strict';
/* 五下 扇形的认识 · 本课互动：拖动 A、B 改变圆心角、半径对比、判断扇形、钟面扇形。通用部分见 ../shared/math.js、mcheck.js */
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
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const svgPt = (svg, e) => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); };

/* 角度按数学习惯：从正东逆时针量（屏幕 y 向下，所以 y 取负） */
const pt = (cx, cy, R, deg) => [cx + R * Math.cos((deg * Math.PI) / 180), cy - R * Math.sin((deg * Math.PI) / 180)];
// 从 a0 逆时针转到 a1 的扇形
function sectorD(cx, cy, R, a0, a1) {
  const span = ((a1 - a0) % 360 + 360) % 360;
  if (span === 0) return '';
  const [x0, y0] = pt(cx, cy, R, a0);
  const [x1, y1] = pt(cx, cy, R, a1);
  return `M${cx} ${cy}L${f2(x0)} ${f2(y0)}A${R} ${R} 0 ${span > 180 ? 1 : 0} 0 ${f2(x1)} ${f2(y1)}Z`;
}
const arcD = (cx, cy, R, a0, a1) => {
  const span = ((a1 - a0) % 360 + 360) % 360;
  const [x0, y0] = pt(cx, cy, R, a0);
  const [x1, y1] = pt(cx, cy, R, a1);
  return `M${f2(x0)} ${f2(y0)}A${R} ${R} 0 ${span > 180 ? 1 : 0} 0 ${f2(x1)} ${f2(y1)}`;
};
const circle = (s, cx, cy, R, cls = 'cir') => svgEl('circle', { cx, cy, r: R, class: cls }, s);
const dot = (s, cx, cy) => svgEl('circle', { cx, cy, r: 4, class: 'dot' }, s);
const fracStr = (deg) => { const g = gcd(deg, 360); return deg % 360 === 0 ? '1（整个圆）' : `${deg / g}/${360 / g}`; };
const angName = (d) => (d < 90 ? '锐角' : d === 90 ? '直角' : d < 180 ? '钝角' : d === 180 ? '平角' : d < 360 ? '大于平角的角' : '周角');

/* 结果要化成最简分数 */
function strictBlanks() {
  document.querySelectorAll('.blank[data-strict]').forEach((el) => {
    const inp = el.querySelector('input');
    const judge = () => {
      const v = inp.value.trim().replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0)).replace(/／/g, '/').replace(/\s+/g, '');
      if (!v || !el.classList.contains('ok') || el.dataset.ans.split('|').includes(v)) { el.title = ''; return; }
      el.classList.replace('ok', 'no');
      el.title = '得数对了，但还要约成最简分数';
    };
    inp.addEventListener('change', judge);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') judge(); });
  });
}

/* ---------- 第 3 页：例 3 三个圆 ---------- */
function initThree() {
  const s = $('three');
  [[150, -25, 25], [450, 0, 90], [750, -30, 90]].forEach(([cx, a0, a1]) => {
    circle(s, cx, 110, 95);
    svgEl('path', { d: sectorD(cx, 110, 95, a0, a1), class: 'sec' }, s);
    dot(s, cx, 110);
    txt(s, cx - 30, 118, 'O', 'lb it');
  });
}

/* ---------- 第 4 页：扇形、弧、圆心角（照课本：A 在右上、B 在右下） ---------- */
function initNamed() {
  const s = $('named');
  const [cx, cy, R] = [160, 165, 135];
  const [a, b] = [-28, 40];
  svgEl('circle', { cx, cy, r: R, class: 'cir dash' }, s);
  svgEl('path', { d: sectorD(cx, cy, R, a, b), class: 'sec' }, s);
  const A = pt(cx, cy, R, b);
  const B = pt(cx, cy, R, a);
  const g2 = svgEl('g', { 'data-step': 2, class: 'hl-g' }, s);
  svgEl('path', { d: arcD(cx, cy, R, a, b), class: 'arc' }, g2);
  txt(g2, ...pt(cx, cy, R + 30, 6), '弧', 'lb red-f');
  const g3 = svgEl('g', { 'data-step': 3, class: 'hl-g' }, s);
  svgEl('path', { d: arcD(cx, cy, 30, a, b), class: 'ang' }, g3);
  txt(g3, ...pt(cx, cy, 44, 6).map((v, i) => v + (i ? 8 : -4)), '1', 'lb small');
  txt(s, ...pt(cx, cy, R * 0.55, b + 9), '半径', 'lb small');
  txt(s, ...pt(cx, cy, R * 0.55, a - 14), '半径', 'lb small');
  dot(s, cx, cy);
  txt(s, cx - 30, cy + 8, 'O', 'lb it');
  txt(s, A[0] + 6, A[1] - 6, 'A', 'lb it');
  txt(s, B[0] + 6, B[1] + 22, 'B', 'lb it');
}

/* ---------- 第 5 页：拖动 A、B ---------- */
const DR = { cx: 210, cy: 190, R: 150 };
function initDrag() {
  const s = $('drag');
  const { cx, cy, R } = DR;
  const st = { a: 0, b: 60, full: false, which: null };
  circle(s, cx, cy, R);
  const fullC = svgEl('circle', { cx, cy, r: R, class: 'sec', style: 'display:none' }, s);
  const sec = svgEl('path', { class: 'sec' }, s);
  const arc = svgEl('path', { class: 'arc' }, s);
  const ang = svgEl('path', { class: 'ang' }, s);
  const ra = svgEl('line', { x1: cx, y1: cy, class: 'rad' }, s);
  const rb = svgEl('line', { x1: cx, y1: cy, class: 'rad' }, s);
  dot(s, cx, cy);
  txt(s, cx - 28, cy + 26, 'O', 'lb it');
  const degT = txt(s, 0, 0, '', 'lb deg');
  const hA = svgEl('circle', { r: 14, class: 'handle' }, s);
  const hB = svgEl('circle', { r: 14, class: 'handle' }, s);
  const lA = txt(s, 0, 0, 'A', 'lb it o-f');
  const lB = txt(s, 0, 0, 'B', 'lb it o-f');
  const draw = () => {
    const deg = st.full ? 360 : ((st.b - st.a) % 360 + 360) % 360;
    fullC.style.display = st.full ? '' : 'none';
    sec.setAttribute('d', st.full ? '' : sectorD(cx, cy, R, st.a, st.b));
    arc.setAttribute('d', st.full || !deg ? '' : arcD(cx, cy, R, st.a, st.b));
    ang.setAttribute('d', st.full || !deg ? '' : arcD(cx, cy, 34, st.a, st.b));
    [[ra, hA, lA, st.a], [rb, hB, lB, st.b]].forEach(([line, h, l, d]) => {
      const [x, y] = pt(cx, cy, R, d);
      line.setAttribute('x2', f2(x)); line.setAttribute('y2', f2(y));
      h.setAttribute('cx', f2(x)); h.setAttribute('cy', f2(y));
      const [lx, ly] = pt(cx, cy, R + 26, d);
      l.setAttribute('x', f2(lx - 9)); l.setAttribute('y', f2(ly + 9));
    });
    const [tx, ty] = pt(cx, cy, 62, st.a + deg / 2);
    degT.setAttribute('x', f2(tx - 22)); degT.setAttribute('y', f2(ty + 8));
    degT.textContent = deg ? `${deg}°` : '';
    $('vDeg').textContent = `${deg}°`;
    $('vFr').textContent = fracStr(deg);
    $('barDeg').style.width = `${(deg / 360) * 100}%`;
    $('barFr').style.width = `${(deg / 360) * 100}%`;
    $('dragSay').textContent = deg ? `圆心角是${angName(deg)}，${deg}°。扇形占整个圆的 ${fracStr(deg)}${deg === 180 ? '——这是半圆' : ''}。` : 'A、B 重合了，没有扇形。';
  };
  const grab = (which) => (e) => { st.which = which; e.target.setPointerCapture(e.pointerId); };
  const move = (e) => {
    if (!st.which) return;
    const p = svgPt(s, e);
    const d = Math.round((Math.atan2(-(p.y - cy), p.x - cx) * 180) / Math.PI);
    st[st.which] = (d + 360) % 360;
    st.full = false;
    draw();
  };
  [[hA, 'a'], [hB, 'b']].forEach(([h, w]) => {
    h.addEventListener('pointerdown', grab(w));
    h.addEventListener('pointermove', move);
    h.addEventListener('pointerup', () => { st.which = null; });
  });
  document.querySelectorAll('[data-deg]').forEach((b) => b.addEventListener('click', () => {
    const d = +b.dataset.deg;
    Object.assign(st, { a: 0, b: d % 360, full: d === 360 });
    draw();
  }));
  draw();
}

/* ---------- 第 6 页：圆心角相同、半径不同 ---------- */
function initTwo() {
  const s = $('two');
  const left = { cx: 120, cy: 140, R: 60 };
  circle(s, left.cx, left.cy, left.R, 'cir dash');
  svgEl('path', { d: sectorD(left.cx, left.cy, left.R, 60, 120), class: 'sec' }, s);
  txt(s, left.cx, 280, '半径 60', 'sm');
  const g = svgEl('g', {}, s);
  const draw = (R) => {
    g.innerHTML = '';
    circle(g, 340, 140, R, 'cir dash');
    svgEl('path', { d: sectorD(340, 140, R, 60, 120), class: 'sec b2' }, g);
    txt(g, 340, 280, `半径 ${R}`, 'sm');
    $('twoRv').textContent = R === 60 ? '60（相等）' : R;
  };
  $('twoR').addEventListener('input', (e) => draw(+e.target.value));
  draw(110);
}

/* ---------- 第 7 页：练一练 1（形状照课本重画） ---------- */
function initIsSec() {
  const box = $('isSec');
  const [cx, cy, R] = [70, 70, 58];
  const L = [cx - R, cy];
  const P = pt(cx, cy, R, 28);
  const apex = [cx, cy - 0.3 * R];
  const Q1 = pt(cx, cy, R, 248);
  const Q2 = pt(cx, cy, R, 292);
  const items = [
    [sectorD(cx, cy, R, 145, 215), 'v', '由两条半径和一条弧围成，顶点在圆心，是扇形。'],
    [`M${L[0]} ${L[1]}L${f2(P[0])} ${f2(P[1])}A${R} ${R} 0 0 1 ${cx + R} ${cy}Z`, 'x', '角的顶点在圆上，不在圆心，一条边是直径不是半径，不是扇形。'],
    [`M${apex[0]} ${f2(apex[1])}L${f2(Q1[0])} ${f2(Q1[1])}A${R} ${R} 0 0 0 ${f2(Q2[0])} ${f2(Q2[1])}Z`, 'x', '角的顶点不在圆心，两条边不是半径，不是扇形。'],
    [sectorD(cx, cy, R, 180, 360), 'v', '半圆由两条半径（合成一条直径）和一条弧围成，圆心角 180°，是扇形。'],
  ];
  items.forEach(([d, ans, why], i) => {
    const card = document.createElement('div');
    card.className = 'jcard center';
    card.innerHTML = `<p>（${i + 1}）</p><svg class="fig is-fig" viewBox="0 0 140 140" aria-label="第 ${i + 1} 个圆"></svg>
      <div class="pick" data-ans="${ans}"><button type="button" data-k="v">是扇形</button><button type="button" data-k="x">不是</button><p class="pick-why">${why}</p></div>`;
    box.appendChild(card);
    const s = card.querySelector('svg');
    circle(s, cx, cy, R);
    svgEl('path', { d, class: 'sec' }, s);
    svgEl('circle', { cx, cy, r: 3.5, class: 'dot red' }, s);
    txt(s, cx + 8, cy + (i === 3 ? -8 : 20), 'O', 'lb it sm-it');
  });
}

/* ---------- 第 8 页：练一练 2、3 ---------- */
function initAngQ() {
  const box = $('angQ');
  const [cx, cy, R] = [70, 70, 58];
  const items = [
    [[0, 90], 180, 270, '直角', 90, 'right'],
    [[0], 0, 180, '平角', 180, 'arc'],
    [[0, 60, 120], 120, 240, '钝角', 120, 'arc'],
  ];
  items.forEach(([lines, a0, a1, name, deg, mark], i) => {
    const card = document.createElement('div');
    card.className = 'jcard center';
    card.innerHTML = `<svg class="fig is-fig" viewBox="0 0 140 140" aria-label="第 ${i + 1} 个扇形"></svg>
      <div class="pick" data-ans="${name}">${['锐角', '直角', '钝角', '平角'].map((n) => `<button type="button" data-k="${n}">${n}</button>`).join('')}<p class="pick-why">是${name}。</p></div>
      <p class="small-q">圆心角 <span class="blank" data-ans="${deg}"></span>°</p>`;
    box.appendChild(card);
    const s = card.querySelector('svg');
    circle(s, cx, cy, R);
    svgEl('path', { d: sectorD(cx, cy, R, a0, a1), class: 'sec' }, s);
    lines.forEach((t) => { const [x0, y0] = pt(cx, cy, R, t); const [x1, y1] = pt(cx, cy, R, t + 180); svgEl('line', { x1: f2(x0), y1: f2(y0), x2: f2(x1), y2: f2(y1), class: 'divl' }, s); });
    if (mark === 'right') svgEl('path', { d: `M${cx - 12} ${cy}v12h12`, class: 'ang' }, s);
    else svgEl('path', { d: arcD(cx, cy, 13, a0, a1), class: 'ang' }, s);
    svgEl('circle', { cx, cy, r: 3.5, class: 'dot red' }, s);
    txt(s, cx + 8, cy + 22, 'O', 'lb it sm-it');
  });
  const p = $('pie3');
  [[60, 90, 'y'], [-30, 60, 'b'], [90, 330, 'g']].forEach(([a0, a1, c]) => svgEl('path', { d: sectorD(80, 80, 72, a0, a1), class: `pie ${c}` }, p));
  svgEl('circle', { cx: 80, cy: 80, r: 3.5, class: 'dot red' }, p);
}

/* ---------- 第 9 页：钟面 ---------- */
function initClock() {
  const s = $('clock');
  const [cx, cy, R] = [160, 160, 135];
  circle(s, cx, cy, R, 'face');
  const sweep = svgEl('path', { class: 'sec' }, s);
  for (let k = 0; k < 60; k += 1) {
    const a = 90 - k * 6;
    const [x0, y0] = pt(cx, cy, R - (k % 5 ? 7 : 14), a);
    const [x1, y1] = pt(cx, cy, R, a);
    svgEl('line', { x1: f2(x0), y1: f2(y0), x2: f2(x1), y2: f2(y1), class: k % 5 ? 'tk' : 'tk big' }, s);
    if (k % 5 === 0) { const [tx, ty] = pt(cx, cy, R - 32, a); txt(s, f2(tx), f2(ty + 8), `${k / 5 || 12}`, 'num'); }
  }
  const hand = svgEl('line', { x1: cx, y1: cy, class: 'hand' }, s);
  dot(s, cx, cy);
  let anim = 0;
  const set = (m) => {
    const a = 90 - 6 * m; // 每分钟 6°，顺时针
    const [x, y] = pt(cx, cy, R - 18, a);
    hand.setAttribute('x2', f2(x)); hand.setAttribute('y2', f2(y));
    sweep.setAttribute('d', m > 0 ? sectorD(cx, cy, R, a, 90) : '');
  };
  document.querySelectorAll('[data-m]').forEach((b) => b.addEventListener('click', () => {
    cancelAnimationFrame(anim);
    const target = +b.dataset.m;
    const t0 = performance.now();
    const step = (t) => {
      const u = Math.min(1, (t - t0) / 1500);
      set(target * u);
      if (u < 1) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  }));
  set(0);
}

window.LESSON = {
  init() {
    initThree();
    initNamed();
    initDrag();
    initTwo();
    initIsSec();
    initAngQ();
    initClock();
    MCheck.init(document);
    strictBlanks();
  },
};
