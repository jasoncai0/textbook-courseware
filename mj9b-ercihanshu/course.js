'use strict';
/* 九下 5.1 二次函数 · 本课互动：章首小球滚落（s = 20t²）、16 m 篱笆围长方形（y = x(8 − x)）、练习 3 剪纸片。
 * 通用部分见 ../shared/math.js；所有图形由坐标计算绘制，按比例。 */
const { board, fmt, tex, slider } = MathKit;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const snap = (v, st) => Math.round(v / st) * st;
const boards = [];
const keep = (b) => { boards.push(b); return b; };

/* ---------- 第 3 页：小球滚落（章首，课本插图读数 0.2、0.8、1.8、3.2、5 cm，即 s = 20t²） ---------- */
const S_OF = (t) => 20 * t * t;
const TIMES = [0.1, 0.2, 0.3, 0.4, 0.5];
function initBall() {
  const st = { t: 0, line: false, curve: false };
  const svg = $('rampSvg');
  const ANG = (20 * Math.PI) / 180;
  const CM = 66; // 1 cm 画成 66 px
  const O = [40, 34];
  const at = (s, off = 0) => [O[0] + s * CM * Math.cos(ANG) + off * Math.sin(ANG), O[1] + s * CM * Math.sin(ANG) - off * Math.cos(ANG)];
  svg.setAttribute('viewBox', '0 0 420 190');
  function drawRamp() {
    const [ex, ey] = at(5.3);
    let h = `<line x1="${O[0]}" y1="${O[1]}" x2="${ex}" y2="${ey}" stroke="#4f9bd0" stroke-width="4"/>`;
    for (let i = 0; i <= 53; i++) {
      const s = i / 10;
      const len = i % 10 === 0 ? 12 : i % 5 === 0 ? 8 : 5;
      const [x1, y1] = at(s);
      const [x2, y2] = at(s, -len);
      h += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#4f9bd0" stroke-width="1.3"/>`;
      if (i % 10 === 0 && i <= 50) { const [tx, ty] = at(s, -26); h += `<text x="${tx}" y="${ty}" class="fl s" text-anchor="middle">${i / 10}</text>`; }
    }
    TIMES.filter((t) => t <= st.t + 1e-9).forEach((t) => {
      const [cx, cy] = at(S_OF(t), 10);
      h += `<circle cx="${cx}" cy="${cy}" r="10" fill="none" stroke="#1d6fa5" stroke-dasharray="3 3" stroke-width="1.5"/>`;
    });
    const [bx, by] = at(S_OF(st.t), 10);
    h += `<circle cx="${bx}" cy="${by}" r="10" fill="#2d4ea8"/><text x="40" y="182" class="fl s">单位：cm</text>`;
    svg.innerHTML = h;
  }
  const b = keep(board($('ballBoard'), { x: [-0.06, 0.6], y: [-0.7, 5.9], w: 560, h: 330, ticks: [0.1, 1], labels: ['t/s', 's/cm'] }));
  const lineEl = b.seg([[0.1, 0.2], [0.5, 5]], { cls: 'c2' });
  const curveEl = b.fn(S_OF, { from: 0, to: 0.5, cls: 'c1' });
  TIMES.forEach((t) => b.pt([t, S_OF(t)], { r: 6, show: () => st.t >= t - 1e-9 }));
  function render() {
    drawRamp();
    lineEl.style.display = st.line ? '' : 'none';
    curveEl.style.display = st.curve ? '' : 'none';
    $('ballTV').textContent = fmt(st.t, 2);
    $('ballTab').innerHTML = `<tr><th>时刻 $t$/s</th>${TIMES.map((t) => `<td>${t}</td>`).join('')}</tr>`
      + `<tr><th>距离 $s$/cm</th>${TIMES.map((t) => `<td class="${st.t >= t - 1e-9 ? 'on' : ''}">${st.t >= t - 1e-9 ? fmt(S_OF(t), 2) : ''}</td>`).join('')}</tr>`;
    tex($('ballTab'));
    b.update();
  }
  const input = $('ballT');
  slider(input, (v) => { st.t = v; render(); });
  let anim = 0;
  $('ballPlay').addEventListener('click', () => {
    cancelAnimationFrame(anim);
    const t0 = performance.now();
    const tick = (now) => {
      st.t = Math.min(0.5, (now - t0) / 5000); // 放慢 10 倍
      input.value = snap(st.t, 0.1);
      render();
      if (st.t < 0.5) anim = requestAnimationFrame(tick);
    };
    anim = requestAnimationFrame(tick);
  });
  $('ballLine').addEventListener('click', () => { st.line = !st.line; render(); });
  $('ballCurve').addEventListener('click', () => { st.curve = !st.curve; render(); });
  render();
}

/* ---------- 第 5 页：16 m 篱笆围长方形，y = x(8 − x) ---------- */
const AREA = (x) => x * (8 - x);
function initPen() {
  const st = { x: 3, all: false };
  const trail = new Map();
  const pen = keep(board($('penBoard'), { x: [-0.8, 9.2], y: [-0.8, 8.8], ticks: [1, 1], labels: ['', ''], tickLabels: false, axes: false }));
  pen.poly(() => [[0, 0], [st.x, 0], [st.x, 8 - st.x], [0, 8 - st.x]], { cls: 'field' });
  pen.text(() => [st.x / 2, 0], () => `长 x = ${fmt(st.x)} m`, { cls: 'lb up mid', dy: 24 });
  pen.text(() => [st.x, (8 - st.x) / 2], () => `宽 ${fmt(8 - st.x)} m`, { cls: 'lb up', dx: 10 });
  pen.drag(() => [st.x, 8 - st.x], (px, py) => { st.x = +clamp(snap((px + 8 - py) / 2, 0.25), 0.25, 7.75).toFixed(2); });

  const g = keep(board($('penGraph'), { x: [-0.7, 9], y: [-2.2, 19], w: 600, h: 380, ticks: [1, 4], labels: ['x', 'y'] }));
  const full = g.fn(AREA, { from: 0, to: 8, cls: 'c1' });
  const dots = [];
  g.seg(() => [[st.x, 0], [st.x, AREA(st.x)]], { cls: 'dash' });
  g.seg(() => [[0, AREA(st.x)], [st.x, AREA(st.x)]], { cls: 'dash' });
  g.drag(() => [st.x, AREA(st.x)], (px) => { st.x = +clamp(snap(px, 0.25), 0.25, 7.75).toFixed(2); });

  function sync() {
    const x = st.x;
    const y = AREA(x);
    const key = x.toFixed(2);
    if (!trail.has(key)) { trail.set(key, 1); dots.push(g.pt([x, y], { r: 4.5, cls: 'trail' })); }
    full.style.display = st.all ? '' : 'none';
    $('penRead').innerHTML = `<span>长 $x$</span><span class="bar"><i style="width:${(x / 8) * 100}%;background:var(--red)"></i></span><b class="v">${fmt(x)} m</b>`
      + `<span>宽 $8-x$</span><span class="bar"><i style="width:${((8 - x) / 8) * 100}%;background:var(--jade)"></i></span><b class="v">${fmt(8 - x)} m</b>`
      + `<span>面积 $y$</span><span class="bar"><i style="width:${(y / 16) * 100}%;background:var(--orange)"></i></span><b class="v">${fmt(y, 4)} m²</b>`;
    const msg = $('penMsg');
    const best = Math.abs(x - 4) < 1e-9;
    msg.className = `tip feedback ${best ? 'fb-ok' : ''}`;
    msg.innerHTML = best
      ? '$x=4$：长、宽都是 4 m，围成<b>正方形</b>，面积 $16$ m²——目前找到的最大值。'
      : `$y=${fmt(x)}\\times${fmt(8 - x)}=${fmt(y, 4)}$（m²）。${x < 4 ? '再拉长一些，面积会怎样？' : '比 $x=4$ 时小了。'}`;
    tex($('penRead')); tex(msg);
  }
  let busy = false;
  const both = () => { if (busy) return; busy = true; pen.update(); g.update(); sync(); busy = false; };
  pen.onUpdate = both;
  g.onUpdate = both;
  $('penAll').addEventListener('click', () => { st.all = !st.all; both(); });
  $('penClear').addEventListener('click', () => {
    trail.clear();
    dots.splice(0).forEach((d) => d.remove());
    both();
  });
  both();
}

/* ---------- 第 8 页：练习 3，30 cm × 20 cm 剪去边长 x 的正方形 ---------- */
function initCut() {
  const st = { x: 5 };
  const b = keep(board($('cutBoard'), { x: [-1.5, 31.5], y: [-1.5, 21.5], axes: false, grid: false }));
  b.poly(() => [[0, 0], [30, 0], [30, 20], [st.x, 20], [st.x, 20 - st.x], [0, 20 - st.x]], { cls: 'fill1' });
  b.poly(() => [[0, 20 - st.x], [st.x, 20 - st.x], [st.x, 20], [0, 20]], { cls: 'cutsq' });
  b.text([15, 0], '30', { cls: 'lb up mid', dy: 22 });
  b.text([30, 10], '20', { cls: 'lb up', dx: 8 });
  slider($('cutX'), (v) => {
    st.x = v;
    $('cutXV').textContent = v;
    $('cutS').innerHTML = `$S=600-${v}^2=${600 - v * v}$`;
    tex($('cutS'));
    b.update();
  });
}

window.LESSON = {
  init() {
    initBall();
    initPen();
    initCut();
  },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
