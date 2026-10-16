'use strict';
/* 七上 2.5 有理数的加法与减法 · 本课互动：数轴加法机（核心）、扑克牌求和、运算律黑板、日温差温度计、程序框图、巡道员。
 * 通用部分见 ../shared/math.js、numline.js；数值与图形均由程序计算。 */
const { tex, slider, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const boards = [];
const keep = (b) => { boards.push(b); return b; };
const minus = NumLine.minus;
const paren = (v) => (v < 0 ? `(${minus(v)})` : `(+${fmt(v)})`);
const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2);
function animate(ms, onFrame) {
  const t0 = performance.now();
  const tick = (now) => { const u = Math.min(1, (now - t0) / ms); onFrame(u); if (u < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}
/* 从 x0 走到 x1 的弧（高 h），只画前 s（0～1）这一段 */
const arc = (x0, x1, h, s) => Array.from({ length: 41 }, (_, i) => { const t = (s * i) / 40; return [x0 + (x1 - x0) * t, h * Math.sin(Math.PI * t)]; });
/* 箭头：画在弧的终点，方向沿弧的切线（按 viewBox 像素计算，不随横纵比例变形） */
function arrowHead(b, pts) {
  if (pts.length < 2) return [];
  const [p, q] = [pts[pts.length - 2], pts[pts.length - 1]];
  const [dx, dy] = [b.X(q[0]) - b.X(p[0]), b.Y(q[1]) - b.Y(p[1])];
  const l = Math.hypot(dx, dy) || 1;
  const [ux, uy] = [dx / l, dy / l];
  const W = (px, py) => [(px) / (b.X(1) - b.X(0)) + 0, -(py) / (b.Y(0) - b.Y(1))];
  const back = W(-ux * 14, -uy * 14);
  const side = W(-uy * 7, ux * 7);
  return [q, [q[0] + back[0] + side[0], q[1] + back[1] + side[1]], [q[0] + back[0] - side[0], q[1] + back[1] - side[1]]];
}

/* ---------- 第 4 页：加法机（核心） ---------- */
function ruleText(a, b) {
  const s = a + b;
  if (a === 0 || b === 0) return '一个数与 0 相加，仍得这个数。';
  if (a * b > 0) return `同号相加：取相同的符号“${a > 0 ? '+' : '−'}”，绝对值相加 ${Math.abs(a)} + ${Math.abs(b)} = ${Math.abs(s)}。`;
  if (Math.abs(a) === Math.abs(b)) return '异号、绝对值相等：两步正好抵消，和为 0。';
  const big = Math.abs(a) > Math.abs(b) ? a : b;
  return `异号相加：|${minus(a)}| 与 |${minus(b)}| 中较大的是 ${Math.abs(big)}，取它的符号“${big > 0 ? '+' : '−'}”；绝对值 ${Math.max(Math.abs(a), Math.abs(b))} − ${Math.min(Math.abs(a), Math.abs(b))} = ${Math.abs(s)}。`;
}
function initAdd() {
  const s = { a: -5, b: 3, u: 0 }; // u：0～1 走第一步，1～2 走第二步
  const b = keep(NumLine.board($('add'), { from: -10, to: 10, y: [-1.1, 2.6], h: 190 }));
  NumLine.axis(b, { from: -10, to: 10 });
  const p1 = () => arc(0, s.a, 1.2, Math.min(1, s.u));
  const p2 = () => arc(s.a, s.a + s.b, 1.9, Math.max(0, Math.min(1, s.u - 1)));
  b.curve((i) => p1()[Math.round(i)], 0, 40, { cls: 'arc1', n: 40 });
  b.curve((i) => p2()[Math.round(i)], 0, 40, { cls: 'arc2', n: 40 });
  b.poly(() => (s.u > 0.05 && s.a ? arrowHead(b, p1()) : []), { cls: 'ah1' });
  b.poly(() => (s.u > 1.05 && s.b ? arrowHead(b, p2()) : []), { cls: 'ah2' });
  const pen = () => (s.u <= 1 ? s.a * ease(s.u) : s.a + s.b * ease(s.u - 1));
  b.pt(() => [pen(), 0], { r: 8, cls: 'c2' });
  b.pt(() => [s.a + s.b, 0], { r: 9, cls: 'c1', show: () => s.u >= 2 });
  b.text(() => (s.u >= 2 ? [s.a + s.b, 0] : null), () => minus(s.a + s.b), { cls: 'nl-val', dy: 50 });
  const out = $('addOut');
  b.onUpdate = () => {
    $('addAV').textContent = paren(s.a);
    $('addBV').textContent = paren(s.b);
    if (s.u < 2) { out.className = 'tip feedback add-out'; out.innerHTML = `$${paren(s.a)}+${paren(s.b)}=\\ ?$　先猜一猜，再点“走一走”。`; tex(out); return; }
    out.className = 'tip feedback add-out fb-ok';
    out.innerHTML = `$${paren(s.a)}+${paren(s.b)}=${s.a + s.b > 0 ? '+' : ''}${minus(s.a + s.b)}$　${ruleText(s.a, s.b)}`;
    tex(out);
  };
  let busy = false;
  const go = () => {
    if (busy) return;
    busy = true;
    const ms = 900 + 120 * (Math.abs(s.a) + Math.abs(s.b));
    animate(ms, (u) => { s.u = 2 * u; b.update(); if (u >= 1) busy = false; });
  };
  const ia = $('addA');
  const ib = $('addB');
  slider(ia, (v) => { s.a = v; s.u = 0; b.update(); });
  slider(ib, (v) => { s.b = v; s.u = 0; b.update(); });
  $('addGo').addEventListener('click', go);
  $('addPre').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-a]');
    if (!btn || busy) return;
    s.a = +btn.dataset.a; s.b = +btn.dataset.b; s.u = 0;
    ia.value = s.a; ib.value = s.b;
    go();
  });
}

/* ---------- 第 7 页：扑克牌（黑色为正、红色为负；J=11，Q=12，K=13，A=1） ---------- */
const RANK = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const SUITS = [['♠', 1], ['♣', 1], ['♥', -1], ['♦', -1]];
function initCards() {
  const deal = () => {
    const deck = SUITS.flatMap(([s, sg]) => RANK.map((r, i) => ({ s, sg, r, v: sg * (i + 1) })));
    const i = Math.floor(Math.random() * 52);
    let j = Math.floor(Math.random() * 51);
    if (j >= i) j += 1;
    const two = [deck[i], deck[j]];
    $('cards').innerHTML = two.map((c) => `<div class="card ${c.sg > 0 ? 'blk' : 'red'}"><b>${c.r}</b><span>${c.s}</span><i>${c.v > 0 ? '+' : ''}${minus(c.v)}</i></div>`).join('');
    $('cardQ').innerHTML = `$${paren(two[0].v)}+${paren(two[1].v)}=$`;
    tex($('cardQ'));
    const blank = $('cardBlank');
    const sum = two[0].v + two[1].v;
    blank.dataset.ans = `${sum}|${minus(sum)}${sum > 0 ? `|+${sum}` : ''}`;
    blank.classList.remove('ok', 'no');
    const inp = blank.querySelector('input');
    if (inp) inp.value = '';
    $('cardMsg').textContent = `${two.map((c) => `${c.s}${c.r} 表示 ${c.v > 0 ? '+' : ''}${minus(c.v)}`).join('，')}。输入和，按回车。`;
  };
  $('draw').addEventListener('click', deal);
  deal();
}

/* ---------- 第 8 页：两块黑板（课本：△ = 3，○ = −5，□ = −7） ---------- */
function initChalk() {
  const rnd = () => (Math.random() < 0.3 ? Math.round((Math.random() * 40 - 20)) / 2 : Math.round(Math.random() * 40 - 20));
  const show = ([a, b, c]) => {
    const T = `<span class="sh tri">${minus(a)}</span>`;
    const C = `<span class="sh cir">${minus(b)}</span>`;
    const Q = `<span class="sh sq">${minus(c)}</span>`;
    const r = (v) => `<b>${minus(+v.toFixed(2))}</b>`;
    $('chalk').innerHTML = `<div class="bb"><p>${T} + ${C} = ${r(a + b)}</p><p>${C} + ${T} = ${r(b + a)}</p></div>`
      + `<div class="bb"><p>( ${T} + ${C} ) + ${Q} = ${r(a + b + c)}</p><p>${T} + ( ${C} + ${Q} ) = ${r(a + (b + c))}</p></div>`;
  };
  $('chalkNew').addEventListener('click', () => show([rnd(), rnd(), rnd()]));
  $('chalkBook').addEventListener('click', () => show([3, -5, -7]));
  show([3, -5, -7]);
}

/* ---------- 第 11 页：两支温度计（5 ℃ 与 −3 ℃） ---------- */
function drawThermo2() {
  const Y = (t) => 200 - t * 5; // 1 ℃ = 5 px，0 ℃ 在 y = 200
  const one = (x, t) => {
    let ticks = '';
    for (let v = -30; v <= 30; v += 2) {
      const big = v % 10 === 0;
      ticks += `<line x1="${x + 14}" y1="${Y(v)}" x2="${x + 14 + (big ? 14 : 7)}" y2="${Y(v)}" stroke="#33414d" stroke-width="${big ? 2 : 1}"/>`;
      if (big) ticks += `<text x="${x - 8}" y="${Y(v) + 5}" text-anchor="end" class="th-t">${minus(v)}</text>`;
    }
    return `<rect x="${x - 10}" y="${Y(33)}" width="20" height="${Y(-33) - Y(33)}" rx="10" fill="#fff" stroke="#9fb0bf" stroke-width="2"/>`
      + `<rect x="${x - 5}" y="${Y(t)}" width="10" height="${Y(-33) - Y(t)}" fill="#d33a2c"/>${ticks}`
      + `<text x="${x}" y="${Y(-33) + 26}" text-anchor="middle" class="th-l">${minus(t)} ℃</text>`;
  };
  const xa = 90;
  const xb = 250;
  $('thermo2').setAttribute('viewBox', '0 0 360 400');
  $('thermo2').innerHTML = one(xa, 5) + one(xb, -3)
    + `<line x1="${xa + 10}" y1="${Y(5)}" x2="${xb + 70}" y2="${Y(5)}" stroke="#d33a2c" stroke-width="1.5" stroke-dasharray="5 4"/>`
    + `<line x1="${xb + 10}" y1="${Y(-3)}" x2="${xb + 70}" y2="${Y(-3)}" stroke="#d33a2c" stroke-width="1.5" stroke-dasharray="5 4"/>`
    + `<line x1="${xb + 60}" y1="${Y(5)}" x2="${xb + 60}" y2="${Y(-3)}" stroke="#d33a2c" stroke-width="3"/>`
    + `<text x="${xb + 66}" y="${(Y(5) + Y(-3)) / 2 + 6}" class="th-d">8</text>`;
}

/* ---------- 第 14 页：程序框图（+4 → −(−3) → −5 → 是否 > 2，否则回到 +4） ---------- */
function drawFlow() {
  const box = (y, t) => `<rect x="100" y="${y}" width="100" height="36" rx="4" fill="#fff" stroke="#1d6fa5" stroke-width="2"/><text x="150" y="${y + 24}" text-anchor="middle" class="fl-t">${t}</text>`;
  const arr = (y1, y2) => `<line x1="150" y1="${y1}" x2="150" y2="${y2 - 6}" stroke="#d33a2c" stroke-width="2"/><path d="M150 ${y2} l-5 -9 h10z" fill="#d33a2c"/>`;
  $('flow').innerHTML = `<path d="M110 10 h90 l-10 34 h-90z" fill="#fff" stroke="#1d6fa5" stroke-width="2"/><text x="150" y="33" text-anchor="middle" class="fl-t">输入</text>`
    + arr(44, 70) + box(70, '+4') + arr(106, 130) + box(130, '−(−3)') + arr(166, 190) + box(190, '−5') + arr(226, 250)
    + '<path d="M150 250 l55 28 l-55 28 l-55 -28z" fill="#fff" stroke="#1d6fa5" stroke-width="2"/><text x="150" y="284" text-anchor="middle" class="fl-t">&gt; 2</text>'
    + arr(306, 336) + '<path d="M110 336 h90 l-10 34 h-90z" fill="#fff" stroke="#1d6fa5" stroke-width="2"/><text x="150" y="359" text-anchor="middle" class="fl-t">输出</text>'
    + '<text x="160" y="326" class="fl-y">是</text>'
    + '<path d="M205 278 h55 v-220 h-110" fill="none" stroke="#d33a2c" stroke-width="2"/><path d="M152 58 l9 -5 v10z" fill="#d33a2c"/><text x="232" y="270" class="fl-n">否</text>';
}
const MAX_LOOPS = 20;
function runFlow(x0) {
  const lines = [];
  let x = x0;
  for (let k = 1; k <= MAX_LOOPS; k++) {
    const a = x + 4;
    const b = a + 3;
    const c = b - 5;
    lines.push(`第 ${k} 轮：${minus(x)} + 4 = ${minus(a)}，${minus(a)} − (−3) = ${minus(b)}，${minus(b)} − 5 = ${minus(c)}；${minus(c)} &gt; 2？${c > 2 ? '是' : '否'}`);
    x = c;
    if (c > 2) return { lines, out: c };
  }
  return { lines, out: null };
}
function initFlow() {
  drawFlow();
  $('flowRun').addEventListener('click', () => {
    const v = Math.trunc(+$('flowIn').value);
    if (!Number.isFinite(v) || Math.abs(v) > 50) { $('flowTrace').textContent = '请输入 −50～50 之间的整数。'; return; }
    const { lines, out } = runFlow(v);
    $('flowTrace').innerHTML = `${lines.join('<br>')}<br><b>${out === null ? '超过 20 轮仍未输出' : `输出 ${minus(out)}`}</b>`;
  });
}

/* ---------- 第 16 页：巡道员（东 7，东 3，西 11.5） ---------- */
const LEGS = [7, 3, -11.5];
function initWalk() {
  const s = { u: 0 };
  const b = keep(NumLine.board($('walk'), { from: -3, to: 11, y: [-1.1, 3.2], h: 200 }));
  NumLine.axis(b, { from: -3, to: 11, minor: 0.5 });
  const starts = LEGS.reduce((acc, d) => [...acc, acc[acc.length - 1] + d], [0]);
  const H = [1.0, 1.0, 2.4];
  LEGS.forEach((d, i) => {
    const pts = () => arc(starts[i], starts[i + 1], H[i], Math.max(0, Math.min(1, s.u - i)));
    b.curve((k) => pts()[Math.round(k)], 0, 40, { cls: i < 2 ? 'arc1' : 'arc2', n: 40 });
    b.poly(() => (s.u - i > 0.05 ? arrowHead(b, pts()) : []), { cls: i < 2 ? 'ah1' : 'ah2' });
    b.text(() => (s.u - i >= 1 ? [(starts[i] + starts[i + 1]) / 2, H[i]] : null), ['东 7 km', '东 3 km', '西 11.5 km'][i], { cls: i < 2 ? 'nl-val' : 'nl-or', dy: -8 });
  });
  b.pt([0, 0], { r: 7, cls: 'c1' });
  b.text([0, 0], '住地', { cls: 'nl-val', dy: 50 });
  b.pt([-1.5, 0], { r: 8, cls: 'c2', show: () => s.u >= 3 });
  b.text(() => (s.u >= 3 ? [-1.5, 0] : null), '−1.5', { cls: 'nl-or', dy: 50 });
  $('walkGo').addEventListener('click', () => animate(4200, (u) => { s.u = 3 * u; b.update(); }));
}

window.LESSON = {
  init() {
    initAdd();
    initCards();
    initChalk();
    drawThermo2();
    initFlow();
    initWalk();
  },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
