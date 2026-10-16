'use strict';
/* 七下 10.5 用二元一次方程组解决问题 · 本课互动：猜硬币、阶梯水费分段条、纸盒纸片计数、火车过桥模拟器（按比例）、图 10-2 线段图。
 * 通用部分见 ../shared/math.js */
const { board, slider, tex, fmt } = MathKit;
const $ = (id) => document.getElementById(id);

/* 数学实验室：1 角、5 角共 40 枚，总面值 12 元 = 120 角 */
function initCoins() {
  const N = 40;
  const TARGET = 120;
  slider($('coinX'), (x) => {
    const y = N - x;
    const v = x + 5 * y;
    $('coinXV').textContent = x;
    $('coinYV').textContent = y;
    const msg = $('coinMsg');
    msg.className = `tip feedback ${v === TARGET ? 'fb-ok' : 'fb-warn'}`;
    msg.textContent = `总面值：${x} 角 + ${5 * y} 角 = ${v} 角 = ${fmt(v / 10)} 元${v === TARGET ? '，正好 12 元！' : `，${v > TARGET ? '多' : '少'}了 ${fmt(Math.abs(v - TARGET) / 10)} 元`}`;
  });
}

/* 问题 4：基本价 3 元/m³（前 15 m³），超出部分 5 元/m³ */
function initWater() {
  const BASE = 15;
  const P1 = 3;
  const P2 = 5;
  const MAXU = 30;
  const PX = 16; // 1 m³ = 16 px
  const X0 = 20;
  slider($('waterU'), (u) => {
    const u1 = Math.min(u, BASE);
    const u2 = Math.max(u - BASE, 0);
    const fee = P1 * u1 + P2 * u2;
    const ticks = Array.from({ length: MAXU / 5 + 1 }, (_, i) => i * 5)
      .map((v) => `<line x1="${X0 + v * PX}" y1="52" x2="${X0 + v * PX}" y2="58" stroke="#6f8191"/><text x="${X0 + v * PX}" y="72" font-size="12" text-anchor="middle" fill="#556575">${v}</text>`).join('');
    $('waterBar').innerHTML = `<rect x="${X0}" y="16" width="${MAXU * PX}" height="34" fill="#f2f5f8" stroke="#cdd8e2"/>`
      + `<rect x="${X0}" y="16" width="${u1 * PX}" height="34" fill="rgba(29,111,165,.45)"/>`
      + `<rect x="${X0 + BASE * PX}" y="16" width="${u2 * PX}" height="34" fill="rgba(217,113,28,.55)"/>`
      + `<line x1="${X0 + BASE * PX}" y1="8" x2="${X0 + BASE * PX}" y2="56" stroke="#c0392b" stroke-width="2" stroke-dasharray="5 4"/>`
      + `<text x="${X0 + BASE * PX}" y="8" font-size="12" text-anchor="middle" fill="#c0392b">15 m³</text>`
      + `<line x1="${X0}" y1="52" x2="${X0 + MAXU * PX}" y2="52" stroke="#6f8191"/>${ticks}`
      + `<text x="${X0 + MAXU * PX}" y="88" font-size="12" text-anchor="end" fill="#556575">用水量 / m³</text>`;
    $('waterUV').textContent = u;
    $('waterMsg').innerHTML = u2 > 0
      ? `水费 $=15\\times3+${u2}\\times5=${P1 * u1}+${P2 * u2}=${fee}$ 元`
      : `水费 $=${u}\\times3=${fee}$ 元（没有超过 15 m³）`;
    tex($('waterMsg'));
  });
}

/* 图 10-1：甲、乙两种无盖纸盒与硬纸片（斜二测示意，正方形边长 a、长方形 a × 2a） */
function drawBoxes() {
  const A = 32;
  const DX = 14;
  const DY = -11;
  const box = (x, y, w, h) => { // 前面左下角 (x, y)，宽 w、高 h
    const f = `M${x} ${y} h${w} v${-h} h${-w}z`;
    const top = `M${x} ${y - h} l${DX} ${DY} h${w} l${-DX} ${-DY}z`;
    const side = `M${x + w} ${y} l${DX} ${DY} v${-h} l${-DX} ${-DY}z`;
    return `<path d="${side}" fill="#f6efe2" stroke="#1f2d3a" stroke-width="1.5"/><path d="${f}" fill="#fbf6ec" stroke="#1f2d3a" stroke-width="1.5"/><path d="${top}" fill="#fff" stroke="#1f2d3a" stroke-width="1.5" stroke-dasharray="4 3"/>`;
  };
  const label = (x, t) => `<text x="${x}" y="160" font-size="14" text-anchor="middle" fill="#1f2d3a">${t}</text>`;
  $('boxFig').innerHTML = box(40, 140, A, 2 * A) + label(63, '甲种纸盒（立着）')
    + box(170, 140, 2 * A, A) + label(210, '乙种纸盒（躺着）')
    + `<rect x="330" y="${140 - A}" width="${A}" height="${A}" fill="#e3f1fb" stroke="#1f2d3a" stroke-width="1.5"/>`
    + `<rect x="385" y="${140 - A}" width="${2 * A}" height="${A}" fill="#fdf1e6" stroke="#1f2d3a" stroke-width="1.5"/>`
    + label(400, '硬纸片：正方形、长方形');
}

/* 问题 5：x 个甲（1 正 + 4 长）、y 个乙（2 正 + 3 长） */
function initBoxCount() {
  const SQ = 150;
  const RC = 300;
  const s = { x: 20, y: 40 };
  const render = () => {
    const sq = s.x + 2 * s.y;
    const rc = 4 * s.x + 3 * s.y;
    const bar = (v, max, color) => `<span class="bar"><i style="width:${Math.min(100, (v / max) * 100)}%;background:${v > max ? '#c0392b' : color}"></i></span>`;
    $('boxXV').textContent = s.x;
    $('boxYV').textContent = s.y;
    $('boxRead').innerHTML = `<span>正方形 $x+2y$</span>${bar(sq, SQ, 'var(--red)')}<b class="v">${sq}/${SQ}</b><span>长方形 $4x+3y$</span>${bar(rc, RC, 'var(--orange)')}<b class="v">${rc}/${RC}</b>`;
    const ok = sq === SQ && rc === RC;
    const msg = $('boxMsg');
    msg.className = `tip feedback ${ok ? 'fb-ok' : ''}`;
    msg.textContent = ok ? `正方形、长方形都恰好用完：甲 ${s.x} 个，乙 ${s.y} 个！`
      : `正方形${sq === SQ ? '恰好用完' : (sq > SQ ? `不够（缺 ${sq - SQ} 张）` : `剩 ${SQ - sq} 张`)}；长方形${rc === RC ? '恰好用完' : (rc > RC ? `不够（缺 ${rc - RC} 张）` : `剩 ${RC - rc} 张`)}。`;
    tex($('boxRead'));
  };
  slider($('boxX'), (v) => { s.x = v; render(); });
  slider($('boxY'), (v) => { s.y = v; render(); });
}

/* 问题 6：火车过桥模拟器。桥长 1 000 m；t = 0 时车头刚上桥 */
const BRIDGE = 1000;
function initTrain() {
  const s = { v: 25, L: 150, f: 0 };
  const total = () => (BRIDGE + s.L) / s.v;
  const onBridge = () => (BRIDGE - s.L) / s.v;
  const t = () => s.f * total();
  const front = () => s.v * t();
  const b = board($('train'), { x: [-380, 1380], y: [-150, 120], axes: false, grid: false, w: 1100, h: 170 });
  b.poly([[-380, -14], [0, -14], [0, -150], [-380, -150]], { cls: 'land' });
  b.poly([[BRIDGE, -14], [1380, -14], [1380, -150], [BRIDGE, -150]], { cls: 'land' });
  b.poly([[0, -150], [BRIDGE, -150], [BRIDGE, -90], [0, -90]], { cls: 'water' });
  b.poly([[0, 0], [BRIDGE, 0], [BRIDGE, -14], [0, -14]], { cls: 'deck' });
  [200, 400, 600, 800].forEach((x) => b.poly([[x - 12, -14], [x + 12, -14], [x + 12, -90], [x - 12, -90]], { cls: 'deck' }));
  b.poly(() => { const fr = front(); return [[fr - s.L, 4], [fr, 4], [fr, 50], [fr - s.L, 50]]; }, { cls: 'trainbody' });
  b.seg(() => [[0, 80], [front(), 80]], { cls: 'c2' });
  b.text(() => (front() > 120 ? [front() / 2, 80] : null), () => `车头走了 ${fmt(front(), 0)} m`, { cls: 'lb up c', dy: -8 });
  b.text([BRIDGE / 2, -90], '桥长 1 000 m', { cls: 'lb up c', dy: 26 });
  b.text([0, -14], '桥头', { cls: 'lb up c', dx: -40, dy: 30 });
  b.text([BRIDGE, -14], '桥尾', { cls: 'lb up c', dx: 40, dy: 30 });
  b.onUpdate = () => {
    const fr = front();
    const rear = fr - s.L;
    const phase = fr <= 0 ? '车头刚到桥头' : (rear < 0 ? '正在上桥' : (fr <= BRIDGE ? '整列火车完全在桥上' : (rear < BRIDGE ? '正在下桥' : '完全过桥')));
    $('trVV').textContent = s.v; $('trLV').textContent = s.L; $('trTV').textContent = fmt(t(), 1);
    const T1 = total();
    const T2 = onBridge();
    const ok1 = Math.abs(T1 - 60) < 1e-9;
    const ok2 = Math.abs(T2 - 40) < 1e-9;
    $('trRead').innerHTML = `<span>上桥 → 完全过桥：$\\dfrac{1000+y}{x}$</span><b class="v" style="color:${ok1 ? 'var(--jade)' : ''}">${fmt(T1, 1)} s</b>`
      + `<span>完全在桥上：$\\dfrac{1000-y}{x}$</span><b class="v" style="color:${ok2 ? 'var(--jade)' : ''}">${fmt(T2, 1)} s</b>`;
    tex($('trRead'));
    const msg = $('trMsg');
    msg.className = `tip feedback ${ok1 && ok2 ? 'fb-ok' : ''}`;
    msg.textContent = ok1 && ok2 ? `两个时间都对上了：速度 ${s.v} m/s，车长 ${s.L} m！（此刻：${phase}）`
      : `此刻：${phase}。目标：60 s 和 40 s。${ok1 ? '第一个对了，' : ''}${ok2 ? '第二个对了，' : ''}继续调。`;
  };
  const sync = () => { $('trT').value = s.f; b.update(); };
  slider($('trV'), (v) => { s.v = v; sync(); });
  slider($('trL'), (v) => { s.L = v; sync(); });
  slider($('trT'), (v) => { s.f = v; b.update(); });
  const DURATION = 6000;
  $('trPlay').addEventListener('click', () => {
    const t0 = performance.now();
    const tick = (now) => {
      s.f = Math.min(1, (now - t0) / DURATION);
      sync();
      if (s.f < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/* 图 10-2：按 x = 20 m/s、y = 200 m 的比例画线段图 */
function drawSegments() {
  const K = 0.36; // 1 m = 0.36 px
  const X0 = 95;
  const LEN = 200;
  const X = (m) => X0 + m * K;
  const arrow = (x1, x2, y, txt, color) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${color}" stroke-width="2" marker-start="url(#ah)" marker-end="url(#ah)"/><text x="${(x1 + x2) / 2}" y="${y - 6}" font-size="15" text-anchor="middle" font-style="italic" fill="${color}">${txt}</text>`;
  const train = (fr, y) => `<rect x="${X(fr - LEN)}" y="${y - 14}" width="${LEN * K}" height="12" rx="4" fill="#4f9bd0" stroke="#163a5a"/>`;
  const bridge = (y) => `<line x1="${X(0)}" y1="${y}" x2="${X(BRIDGE)}" y2="${y}" stroke="#c0392b" stroke-width="3"/>`;
  $('segFig').innerHTML = '<defs><marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="#1d6fa5"/></marker></defs>'
    + arrow(X(0), X(BRIDGE), 22, '1 000', '#1d6fa5') + arrow(X(BRIDGE), X(BRIDGE + LEN), 22, 'y', '#1d6fa5')
    + train(0, 62) + train(BRIDGE + LEN, 62) + bridge(62)
    + arrow(X(0), X(BRIDGE + LEN), 88, '60x', '#1d6fa5')
    + arrow(X(0), X(BRIDGE), 128, '1 000', '#1d6fa5')
    + train(LEN, 168) + train(BRIDGE, 168) + bridge(168)
    + arrow(X(0), X(LEN), 194, 'y', '#1d6fa5') + arrow(X(LEN), X(BRIDGE), 194, '40x', '#1d6fa5');
}

window.LESSON = {
  init() {
    initCoins();
    initWater();
    drawBoxes();
    initBoxCount();
    initTrain();
    drawSegments();
  },
};
