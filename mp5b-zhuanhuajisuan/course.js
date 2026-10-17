'use strict';
/* 五下 用转化的策略解决问题（计算） · 本课互动：正方形逐次涂一半、铅笔架倒放拼成平行四边形、移多补少、奇数和的 L 形。通用部分见 ../shared/math.js、mcheck.js */
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
function animate(ms, fn) {
  const t0 = performance.now();
  let id = 0;
  const step = (t) => { const u = Math.min(1, (t - t0) / ms); fn(u); if (u < 1) id = requestAnimationFrame(step); };
  id = requestAnimationFrame(step);
  return () => cancelAnimationFrame(id);
}

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

/* ---------- 正方形：第 k 个加数 = 剩下部分的一半（奇数次竖切取左半，偶数次横切取上半） ---------- */
const COLORS = ['#8fc3ea', '#a8d99a', '#f6b26b', '#f4a6c4', '#c8b6ec', '#f7e27a', '#9fd8cf'];
function drawHalves(svg, n, x, y, size, withLabels) {
  svg.innerHTML = '';
  let rest = { x, y, w: size, h: size };
  for (let k = 1; k <= n; k += 1) {
    const vertical = k % 2 === 1;
    const piece = vertical ? { ...rest, w: rest.w / 2 } : { ...rest, h: rest.h / 2 };
    rest = vertical ? { ...rest, x: rest.x + rest.w / 2, w: rest.w / 2 } : { ...rest, y: rest.y + rest.h / 2, h: rest.h / 2 };
    svgEl('rect', { x: f2(piece.x), y: f2(piece.y), width: f2(piece.w), height: f2(piece.h), fill: COLORS[(k - 1) % COLORS.length], class: 'cell' }, svg);
    const fs = Math.min(piece.w, piece.h) * 0.32;
    if (withLabels && fs >= 9) txt(svg, f2(piece.x + piece.w / 2), f2(piece.y + piece.h / 2 + fs * 0.35), `1/${2 ** k}`, 'lb mid').setAttribute('font-size', f2(fs));
  }
  svgEl('rect', { x: f2(rest.x), y: f2(rest.y), width: f2(rest.w), height: f2(rest.h), class: 'cell blank-cell' }, svg);
  svgEl('rect', { x, y, width: size, height: size, class: 'outline' }, svg);
}

function initCover() { drawHalves($('coverFig'), 6, 30, 30, 340, false); }

function initHalf() {
  const s = $('half');
  const draw = (n) => {
    drawHalves(s, n, 20, 20, 360, true);
    const terms = Array.from({ length: n }, (_, k) => `\\dfrac1{${2 ** (k + 1)}}`).join('+');
    const last = 2 ** n;
    $('halfEq').innerHTML = `$${terms}=1-\\dfrac1{${last}}=\\dfrac{${last - 1}}{${last}}$`;
    MathKit.tex($('halfEq'));
    $('halfNv').textContent = n;
  };
  $('halfN').addEventListener('input', (e) => draw(+e.target.value));
  draw(4);
}

/* ---------- 铅笔架：最上层 15 支，每层少 1 支，共 10 层；倒放的同样一架补成每层 21 支 ---------- */
const PEN = { x0: 60, y0: 40, D: 24, top: 15, rows: 10 };
function initPencil() {
  const s = $('pencil');
  const { x0, y0, D, top, rows } = PEN;
  const dy = D * 0.866; // 紧密排列：层距 = D·√3/2
  const bottom = top - rows + 1;
  const orig = svgEl('g', {}, s);
  const copy = svgEl('g', { class: 'copy' }, s);
  for (let k = 0; k < rows; k += 1) {
    const y = y0 + k * dy;
    const start = x0 + (k * D) / 2;
    for (let i = 0; i < top - k; i += 1) svgEl('circle', { cx: f2(start + i * D), cy: f2(y), r: D / 2 - 1, class: 'pen' }, orig);
    for (let i = 0; i < bottom + k; i += 1) svgEl('circle', { cx: f2(start + (top - k + i) * D), cy: f2(y), r: D / 2 - 1, class: 'pen b' }, copy);
  }
  const yB = y0 + (rows - 1) * dy;
  txt(s, x0 + ((top - 1) * D) / 2, y0 - 18, `最上层 ${top} 支`, 'lb mid');
  txt(s, x0 + ((rows - 1) * D) / 2 + ((bottom - 1) * D) / 2, yB + 36, `最下层 ${bottom} 支`, 'lb mid');
  txt(s, 18, y0 + ((rows - 1) * dy) / 2, `${rows} 层`, 'lb');
  const res = txt(s, 820, y0 + ((rows - 1) * dy) / 2, '', 'lb red');
  const away = 'translateX(330px) rotate(180deg)';
  copy.style.transform = away;
  copy.style.opacity = '0';
  $('pGo').addEventListener('click', () => {
    copy.style.transition = 'none';
    copy.style.transform = away;
    copy.style.opacity = '1';
    void copy.getBBox();
    copy.style.transition = '';
    copy.style.transform = 'translateX(0) rotate(0deg)';
    setTimeout(() => { res.textContent = `每层 ${top + bottom} 支`; }, 1900);
  });
  $('pBack').addEventListener('click', () => { copy.style.transform = away; copy.style.opacity = '0'; res.textContent = ''; });
}

/* ---------- 移多补少：75～83 都变成 79（只画超过 70 的部分） ---------- */
function initAvg() {
  const s = $('avg');
  const vals = [75, 76, 77, 78, 79, 80, 81, 82, 83];
  const k = 14;
  const base = 175;
  svgEl('line', { x1: 40, y1: base, x2: 880, y2: base, class: 'axis' }, s);
  svgEl('line', { x1: 40, y1: base - 9 * k, x2: 880, y2: base - 9 * k, class: 'mean' }, s);
  txt(s, 884, base - 9 * k + 6, '79', 'lb sm');
  const bars = vals.map((v, i) => {
    const x = 70 + i * 90;
    const r = svgEl('rect', { x, width: 50, class: 'bar' }, s);
    const t = txt(s, x + 25, 0, '', 'lb sm mid');
    return { r, t, v };
  });
  const set = (u) => bars.forEach(({ r, t, v }) => {
    const cur = v + (79 - v) * u;
    const h = (cur - 70) * k;
    r.setAttribute('y', f2(base - h)); r.setAttribute('height', f2(h));
    t.setAttribute('y', f2(base - h - 8));
    t.textContent = Math.round(cur);
  });
  let stop = () => {};
  $('avgGo').addEventListener('click', () => { stop(); stop = animate(1500, set); });
  $('avgBack').addEventListener('click', () => { stop(); set(0); });
  set(0);
}

/* ---------- 奇数和：n 层 L 形拼成 n × n ---------- */
function initOdd() {
  const s = $('odd');
  const draw = (n) => {
    s.innerHTML = '';
    const D = Math.min(60, 300 / n);
    for (let i = 0; i < n; i += 1) {
      for (let j = 0; j < n; j += 1) svgEl('circle', { cx: f2(15 + (i + 0.5) * D), cy: f2(15 + (j + 0.5) * D), r: f2(D * 0.42), fill: COLORS[Math.max(i, j) % COLORS.length], class: 'dotc' }, s);
    }
    const odds = Array.from({ length: n }, (_, k) => 2 * k + 1);
    $('oddEq').innerHTML = `$${odds.join('+')}=${n}\\times${n}=${n * n}$`;
    MathKit.tex($('oddEq'));
    $('oddNv').textContent = n;
  };
  $('oddN').addEventListener('input', (e) => draw(+e.target.value));
  draw(4);
}

/* ---------- 思考题：设正方形边长 8 cm 时的样子（1 cm = 8 个单位） ---------- */
function initThink() {
  const s = $('think');
  const u = 8;
  const a = 8;
  const [w1, w2] = [27 - a, 19 - a];
  const [x, y] = [40, 40];
  svgEl('rect', { x, y, width: (w1 + a + w2) * u, height: a * u, class: 'outline' }, s);
  svgEl('rect', { x: x + w1 * u, y, width: a * u, height: a * u, class: 'sqfill' }, s);
  const brace = (x1, x2, yy, label, dir) => {
    svgEl('path', { d: `M${x1} ${yy + dir * 8}V${yy}H${x2}V${yy + dir * 8}`, class: 'dim' }, s);
    txt(s, (x1 + x2) / 2, yy - (dir > 0 ? 8 : -22), label, 'lb sm mid');
  };
  brace(x + w1 * u, x + (w1 + a + w2) * u, y - 12, '19 cm', 1);
  brace(x, x + (w1 + a) * u, y + a * u + 12, '27 cm', -1);
}

window.LESSON = {
  init() {
    strictBlanks();
    initCover();
    initHalf();
    initPencil();
    initAvg();
    initOdd();
    initThink();
  },
};
