'use strict';
/* 五下 综合与实践 球的反弹高度 · 本课互动：模拟落球（墙面刻度按 cm 精确，落下按自由落体时间比例播放）、
 * 实验记录表（输入数据自动算最简分数和小数）、“你知道吗”比例图。通用部分见 ../shared/fracfig.js */
const { el, gcd } = FracFig;
const $ = (id) => document.getElementById(id);
const text = (svg, x, y, s, cls = 'ff-t') => { const t = el('text', { x, y, class: cls }, svg); t.textContent = s; return t; };

/* 假设的反弹比例（仅用于演示，真实结果以实验为准） */
const BALLS = {
  lan: { name: '篮球', k: 0.7, color: '#e67e22', r: 12 },
  zu: { name: '足球', k: 0.6, color: '#ecf0f1', r: 11 },
  pi: { name: '皮球', k: 0.5, color: '#e74c3c', r: 10 },
};
const NOISE_CM = 2;
const fracTex = (u, d) => {
  if (!d) return '';
  const g = gcd(u, d) || 1;
  return `\\dfrac{${u / g}}{${d / g}}`;
};

/* ---------- 模拟实验 ---------- */
const WALL = { x: 120, ground: 370, top: 40, maxCm: 160 };
const cmY = (cm) => WALL.ground - ((WALL.ground - WALL.top) * cm) / WALL.maxCm;
const SIM_SEC_FOR_100CM = 1.2; // 100 cm 落下播放 1.2 秒；其他高度按 √h 比例（自由落体）
function initSim() {
  const svg = $('wall');
  el('rect', { x: 0, y: WALL.ground, width: 360, height: 30, fill: '#c8b79a' }, svg);
  el('rect', { x: 20, y: WALL.top - 20, width: 90, height: WALL.ground - WALL.top + 20, fill: '#f3ead8' }, svg);
  for (let cm = 0; cm <= WALL.maxCm; cm += 5) {
    const big = cm % 10 === 0;
    el('line', { x1: 110 - (big ? 22 : 12), x2: 110, y1: cmY(cm), y2: cmY(cm), stroke: '#5d4a2e', 'stroke-width': big ? 2 : 1 }, svg);
    if (cm % 20 === 0) text(svg, 66, cmY(cm) + 5, String(cm), 'ff-t s cm-t');
  }
  text(svg, 64, WALL.top - 26, 'cm', 'ff-t s cm-t');
  const dropMark = el('line', { x1: 110, x2: 230, y1: 0, y2: 0, stroke: '#1d6fa5', 'stroke-width': 3, 'stroke-dasharray': '8 5' }, svg);
  const dropT = text(svg, 280, 0, '', 'ff-t s');
  const upMark = el('line', { x1: 110, x2: 230, y1: 0, y2: 0, stroke: '#c0392b', 'stroke-width': 3, opacity: 0 }, svg);
  const upT = text(svg, 280, 0, '', 'ff-t b');
  const ball = el('circle', { cx: 180, cy: 0, r: 12, stroke: '#333', 'stroke-width': 1.5 }, svg);
  const st = { b: 'lan', h: 100, raf: 0, rows: [] };
  const place = () => {
    const B = BALLS[st.b];
    ball.setAttribute('r', B.r); ball.setAttribute('fill', B.color);
    const y = cmY(st.h);
    dropMark.setAttribute('y1', y); dropMark.setAttribute('y2', y);
    dropT.setAttribute('y', y + 5); dropT.textContent = `${st.h} cm`;
    ball.setAttribute('cy', y + B.r); // 球的底部对准标记
    upMark.setAttribute('opacity', 0); upT.textContent = '';
  };
  const addRow = (h, u) => {
    st.rows.push([BALLS[st.b].name, h, u]);
    const tab = $('bTab');
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${BALLS[st.b].name}</td><td>${h}</td><td>${u}</td><td>$${u}\\div${h}=${fracTex(u, h)}\\approx${(u / h).toFixed(2)}$</td>`;
    tab.appendChild(tr);
    MathKit.tex(tr);
  };
  const drop = () => {
    cancelAnimationFrame(st.raf);
    place();
    const B = BALLS[st.b];
    const h = st.h;
    const u = Math.max(1, Math.round(h * B.k + (Math.random() * 2 - 1) * NOISE_CM));
    const tDown = SIM_SEC_FOR_100CM * Math.sqrt(h / 100);
    const tUp = SIM_SEC_FOR_100CM * Math.sqrt(u / 100);
    const t0 = performance.now();
    const tick = (now) => {
      const t = (now - t0) / 1000;
      let cm;
      if (t < tDown) cm = h * (1 - (t / tDown) ** 2); // 自由落体：下落距离 ∝ t²
      else if (t < tDown + tUp) { const s = (t - tDown) / tUp; cm = u * (1 - (1 - s) ** 2); } // 上升减速到最高点
      else cm = u;
      ball.setAttribute('cy', cmY(cm) - B.r);
      if (t < tDown + tUp) { st.raf = requestAnimationFrame(tick); return; }
      const y = cmY(u);
      upMark.setAttribute('y1', y); upMark.setAttribute('y2', y); upMark.setAttribute('opacity', 1);
      upT.setAttribute('y', y + 5); upT.textContent = `反弹 ${u} cm`;
      addRow(h, u);
    };
    st.raf = requestAnimationFrame(tick);
  };
  const pick = (box, attr, set) => box.addEventListener('click', (e) => {
    const b = e.target.closest(`[${attr}]`);
    if (!b) return;
    box.querySelectorAll(`[${attr}]`).forEach((x) => x.classList.toggle('solid', x === b));
    set(b.getAttribute(attr));
    place();
  });
  pick($('bBall'), 'data-b', (v) => { st.b = v; });
  pick($('bH'), 'data-h', (v) => { st.h = +v; });
  $('bGo').addEventListener('click', drop);
  $('bClear').addEventListener('click', () => { $('bTab').querySelectorAll('tr:not(:first-child)').forEach((r) => r.remove()); });
  place();
}

/* ---------- 记录表 ---------- */
function initRecord() {
  document.querySelectorAll('.rec').forEach((rec) => {
    const calc = () => {
      for (let i = 0; i < 3; i += 1) {
        const d = Math.round(+rec.querySelector(`.rin[data-r="d"][data-i="${i}"]`).value);
        const u = Math.round(+rec.querySelector(`.rin[data-r="u"][data-i="${i}"]`).value);
        const out = rec.querySelector(`.rout[data-i="${i}"]`);
        if (d > 0 && u >= 0 && rec.querySelector(`.rin[data-r="u"][data-i="${i}"]`).value !== '') {
          out.innerHTML = u > d ? '<span class="warn-t">反弹不会比下落高，检查一下</span>' : `$${fracTex(u, d)}\\approx${(u / d).toFixed(2)}$`;
          MathKit.tex(out);
        } else out.textContent = '';
      }
    };
    rec.addEventListener('input', calc);
  });
}

/* ---------- 你知道吗：1.8 米、1.2 米、1.4 米（按比例） ---------- */
function initRule() {
  const svg = $('rule');
  const [g, top] = [340, 30];
  const Y = (m) => g - ((g - top) * m) / 1.8;
  el('rect', { x: 0, y: g, width: 300, height: 20, fill: '#c8b79a' }, svg);
  el('rect', { x: 150, y: Y(1.4), width: 40, height: Y(1.2) - Y(1.4), fill: 'rgba(46,160,67,.25)' }, svg);
  [[1.8, '#1d6fa5', '1.8 米（下落）'], [1.4, '#2e8b57', '1.4 米'], [1.2, '#2e8b57', '1.2 米']].forEach(([m, c, s]) => {
    el('line', { x1: 40, x2: 200, y1: Y(m), y2: Y(m), stroke: c, 'stroke-width': 3, 'stroke-dasharray': m === 1.8 ? '' : '7 5' }, svg);
    text(svg, 206, Y(m) + 6, s, 'ff-t s st');
  });
  el('circle', { cx: 80, cy: Y(1.8) - 14, r: 14, fill: '#e67e22', stroke: '#333' }, svg);
  el('line', { x1: 80, x2: 80, y1: Y(1.8) + 4, y2: g - 6, stroke: '#9fb0bf', 'stroke-width': 2, 'stroke-dasharray': '4 4' }, svg);
  text(svg, 170, Y(1.3) + 6, '合格', 'ff-t s');
}

window.LESSON = {
  init() {
    initSim();
    initRecord();
    initRule();
    FracFig.exact();
  },
};
