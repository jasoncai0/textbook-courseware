'use strict';
/* 七上 2.1 正数与负数 · 本课互动：温度计 / 海平面竖直刻度（核心）、例 1 与练一练的分类器。
 * 通用部分见 ../shared/math.js；刻度、液柱、海拔都按数值计算绘制。 */
const { board, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const minus = (v) => String(v).replace('-', '−');
const boards = [];
const NS = 'http://www.w3.org/2000/svg';

/* 竖直刻度：每 minor 一小格，每 major 一大格并标数字；0 刻度加粗 */
function vScale(b, { from, to, minor, major, x0, len, lx }) {
  for (let v = from; v <= to; v += minor) {
    const big = v % major === 0;
    b.seg([[x0, v], [x0 + (big ? len : len / 2), v]], { cls: v === 0 ? 'zero-line' : big ? 'tk-big' : 'tk-small' });
    if (big) b.text([lx, v], minus(v), { cls: 'tk-num', dy: 6 });
  }
}

/* ---------- 第 5 页：温度计（−30 ℃～50 ℃，每小格 1 ℃） ---------- */
function initTemp(s) {
  const b = board($('vTemp'), { x: [-3.2, 3.6], y: [-40, 56], w: 240, h: 470, axes: false, grid: false });
  b.poly([[-0.55, -36], [0.55, -36], [0.55, 53], [-0.55, 53]], { cls: 'tube' });
  b.poly(() => [[-0.28, -37], [0.28, -37], [0.28, s.t], [-0.28, s.t]], { cls: 'liquid' });
  b.pt([0, -37.5], { cls: 'bulb', r: 17 });
  vScale(b, { from: -30, to: 50, minor: 1, major: 10, x0: 0.6, len: 1.1, lx: -0.8 });
  b.text([2.3, 0], '0 ℃', { cls: 'tk-num zero', dy: 6 });
  b.drag(() => [0, s.t], (x, y) => { s.t = Math.round(clamp(y, -30, 50)); });
  return b;
}

/* ---------- 第 5 页：海平面（−120 m～120 m） ---------- */
function initSea(s) {
  const b = board($('vSea'), { x: [-5.2, 5], y: [-135, 135], w: 300, h: 470, axes: false, grid: false });
  b.poly([[-5.2, 0], [5, 0], [5, -135], [-5.2, -135]], { cls: 'water' });
  b.seg([[-5.2, 0], [5, 0]], { cls: 'sea-line' });
  vScale(b, { from: -120, to: 120, minor: 10, major: 40, x0: -3.6, len: 0.9, lx: -3.8 });
  b.text([-2.4, 0], '海平面（0 m）', { cls: 'tk-num zero', dy: -10 });
  b.seg(() => [[1.8, 0], [1.8, s.h]], { cls: 'h-line' });
  // 直升机 / 潜水艇按像素画在一个 <g> 里，随高度平移（不随横纵比例变形）
  const g = document.createElementNS(NS, 'g');
  b.svg.appendChild(g);
  const HELI = '<ellipse cx="0" cy="0" rx="34" ry="14" fill="#5d7b3a"/><rect x="28" y="-5" width="40" height="7" fill="#5d7b3a"/><line x1="-46" y1="-22" x2="46" y2="-22" stroke="#33414d" stroke-width="4"/><line x1="0" y1="-22" x2="0" y2="-12" stroke="#33414d" stroke-width="4"/><line x1="-16" y1="18" x2="22" y2="18" stroke="#33414d" stroke-width="3"/>';
  const SUB = '<rect x="-46" y="-13" width="92" height="26" rx="13" fill="#e2b33c"/><rect x="-10" y="-25" width="22" height="14" rx="4" fill="#e2b33c"/><circle cx="-20" cy="0" r="4" fill="#33414d"/><circle cx="0" cy="0" r="4" fill="#33414d"/><circle cx="20" cy="0" r="4" fill="#33414d"/>';
  b.drag(() => [1.8, s.h], (x, y) => { s.h = Math.round(clamp(y, -120, 120) / 5) * 5; });
  b.place = () => {
    const kind = s.h > 0 ? 'heli' : s.h < 0 ? 'sub' : 'boat';
    if (g.dataset.kind !== kind) {
      g.dataset.kind = kind;
      g.innerHTML = kind === 'heli' ? HELI : kind === 'sub' ? SUB : '<path d="M-40 -6 h80 l-14 16 h-52z" fill="#b5523b"/><line x1="0" y1="-6" x2="0" y2="-34" stroke="#33414d" stroke-width="3"/><path d="M2 -32 l22 12 h-22z" fill="#fff" stroke="#33414d"/>';
    }
    g.setAttribute('transform', `translate(${b.X(3.4)} ${b.Y(s.h)})`);
  };
  return b;
}

function readout(k, s) {
  if (k === 'temp') {
    const t = s.t;
    if (t === 0) return '<b>0 ℃</b>：既不是零上，也不是零下——0 ℃ 是分界。';
    const a = Math.abs(t);
    return t > 0
      ? `0 ℃ 以上 ${a} ℃（零上 ${a} ℃）<br>记作 <b class="pos">+${a} ℃</b>（或 ${a} ℃），读作“正 ${a} 摄氏度”`
      : `0 ℃ 以下 ${a} ℃（零下 ${a} ℃）<br>记作 <b class="neg">−${a} ℃</b>，读作“负 ${a} 摄氏度”`;
  }
  const h = s.h;
  if (h === 0) return '在海平面上：海拔 <b>0 m</b>。';
  const a = Math.abs(h);
  return h > 0
    ? `直升机比海平面<b>高</b> ${a} m<br>海拔记作 <b class="pos">+${a} m</b>`
    : `潜水艇比海平面<b>低</b> ${a} m（在水下 ${a} m）<br>海拔记作 <b class="neg">−${a} m</b>`;
}

function initVertical() {
  const s = { t: 3, h: 80, k: 'temp' };
  const bt = initTemp(s);
  const bs = initSea(s);
  const show = () => {
    $('vRead').innerHTML = readout(s.k, s);
    $('vHint').textContent = s.k === 'temp' ? '拖动液柱顶端的橙色点：每小格 1 ℃' : '拖动橙色点：海面以上是直升机，以下是潜水艇（每次 5 m）';
  };
  bt.onUpdate = show;
  bs.onUpdate = () => { bs.place(); show(); };
  $('vTabs').addEventListener('click', (e) => {
    const k = e.target.closest('[data-k]')?.dataset.k;
    if (!k) return;
    s.k = k;
    $('vTemp').hidden = k !== 'temp';
    $('vSea').hidden = k !== 'sea';
    $('vTabs').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x.dataset.k === k));
    (k === 'temp' ? bt : bs).update();
  });
  boards.push(bt, bs);
}

/* ---------- 分类器：先点数，再点集合 ---------- */
const BINS = { pos: '正数', neg: '负数', zero: '既不是正数也不是负数' };
const WHY = {
  pos: '它比 0 大（正号可以省略）',
  neg: '前面有负号，表示与正相反',
  zero: '0 既不是正数，也不是负数',
};
function initSorter(id, items, bins) {
  const host = $(id);
  const msg = $(`${id}Msg`);
  let picked = null;
  const placed = new Set();
  host.innerHTML = `<div class="pool">${items.map((it, i) => `<button type="button" class="chip-n" data-i="${i}">$${it.t}$</button>`).join('')}</div>`
    + `<div class="bins">${bins.map((k) => `<div class="bin" data-k="${k}"><b>${BINS[k]}</b><div class="got"></div></div>`).join('')}</div>`;
  tex(host);
  const say = (cls, html) => { msg.className = `tip feedback ${cls}`; msg.innerHTML = html; tex(msg); };
  say('', '先点一个数，再点它该去的集合。');
  host.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip-n');
    if (chip && !placed.has(chip.dataset.i)) {
      picked = chip.dataset.i;
      host.querySelectorAll('.chip-n').forEach((c) => c.classList.toggle('sel', c === chip));
      return;
    }
    const bin = e.target.closest('.bin');
    if (!bin || picked === null) return;
    const it = items[+picked];
    if (bin.dataset.k === it.k) {
      const c = host.querySelector(`.chip-n[data-i="${picked}"]`);
      c.classList.remove('sel');
      c.classList.add('done');
      bin.querySelector('.got').appendChild(c);
      placed.add(picked);
      say('fb-ok', placed.size === items.length ? '全部放对了！' : `对：$${it.t}$ 是${BINS[it.k]}——${WHY[it.k]}。`);
    } else {
      bin.classList.remove('shake'); void bin.offsetWidth; bin.classList.add('shake');
      say('fb-warn', `再想想：$${it.t}$ 不是${BINS[bin.dataset.k]}。`);
    }
    picked = null;
  });
}

window.LESSON = {
  init() {
    initVertical();
    initSorter('sort1', [
      { t: '+7', k: 'pos' }, { t: '-9', k: 'neg' }, { t: '\\dfrac13', k: 'pos' }, { t: '-4.5', k: 'neg' },
      { t: '998', k: 'pos' }, { t: '-\\dfrac{9}{10}', k: 'neg' }, { t: '0', k: 'zero' },
    ], ['pos', 'neg', 'zero']);
    initSorter('sort2', [
      { t: '+5', k: 'pos' }, { t: '-7.25', k: 'neg' }, { t: '-\\dfrac34', k: 'neg' }, { t: '0', k: 'zero' },
      { t: '+\\dfrac{12}{5}', k: 'pos' }, { t: '0.32', k: 'pos' }, { t: '-\\dfrac12', k: 'neg' },
    ], ['pos', 'neg', 'zero']);
  },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
