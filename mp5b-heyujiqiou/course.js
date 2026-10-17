'use strict';
/* 五下 和与积的奇偶性 · 本课互动：两个数求和的实验记录、配对点子（和）、翻书页码、连加卡片、点子阵列（积）。
 * 通用部分见 ../shared/math.js、mcheck.js */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const isOdd = (n) => n % 2 === 1;
const oe = (n) => (isOdd(n) ? '奇数' : '偶数');
const oe1 = (n) => (isOdd(n) ? '奇' : '偶');
const rand = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));

/* 第 2 页小图：7 个点两个一对 */
function initMini() {
  const g = document.querySelector('.mini-dots');
  for (let i = 0; i < 7; i += 1) {
    svgEl('circle', { cx: 50 + Math.floor(i / 2) * 40, cy: 28 + (i % 2) * 34, r: 12, fill: i === 6 ? '#d9711c' : '#4f9bd0' }, g);
  }
}

/* ---------- 第 3 页：实验记录 ---------- */
const EXP = { MAXROWS: 10 };
function initExperiment() {
  const rows = [];
  const render = () => {
    const tab = $('exTab');
    while (tab.rows.length > 1) tab.deleteRow(1);
    rows.forEach(([a, b]) => {
      const tr = tab.insertRow();
      tr.innerHTML = `<td>${a}</td><td>${b}</td><td>${a + b}</td><td class="${isOdd(a + b) ? 'odd' : 'even'}">${oe(a + b)}</td>`;
    });
    const kinds = [['偶 + 偶', (a, b) => !isOdd(a) && !isOdd(b)], ['奇 + 奇', (a, b) => isOdd(a) && isOdd(b)], ['奇 + 偶', (a, b) => isOdd(a) !== isOdd(b)]];
    $('exCnt').innerHTML = kinds.map(([name, f]) => {
      const hit = rows.filter(([a, b]) => f(a, b));
      const sums = [...new Set(hit.map(([a, b]) => oe(a + b)))];
      return `<p><b>${name}</b>：${hit.length} 组${hit.length ? `，和都是 <b class="${sums[0] === '奇数' ? 'odd' : 'even'}">${sums.join('/')}</b>` : ''}</p>`;
    }).join('');
  };
  const add = (a, b) => {
    rows.push([a, b]);
    if (rows.length > EXP.MAXROWS) rows.shift();
    render();
  };
  $('exAdd').addEventListener('click', () => {
    const a = parseInt($('exA').value, 10);
    const b = parseInt($('exB').value, 10);
    if (!(a > 0 && b > 0)) { $('exCnt').innerHTML = '<p class="odd">请输入两个不是 0 的自然数。</p>'; return; }
    add(a, b);
  });
  // 随机抽 5 组，三种情况（偶+偶、奇+奇、奇+偶）都要有
  const PARITY = [[0, 0], [1, 1], [1, 0], [0, 1], [1, 1]];
  const randP = (odd) => 2 * rand(1, 49) - odd; // odd=1 → 1～97 的奇数；odd=0 → 2～98 的偶数
  $('exRand').addEventListener('click', () => PARITY.forEach(([x, y]) => add(randP(x), randP(y))));
  $('exClear').addEventListener('click', () => { rows.length = 0; render(); });
  render();
}

/* ---------- 第 4 页：配对的点子 ---------- */
const DT = { MAX: 12, X0: 66, GAP: 44, R: 15, YA: 40, YB: 190, YM: 115 };
function initDots() {
  const svg = $('dtFig');
  const st = { a: 5, b: 7, merged: false };
  const pos = (g, y) => ({ x: DT.X0 + Math.floor(g / 2) * DT.GAP, y: y + (g % 2) * DT.GAP });
  let dots = [];
  let labels = [];
  // 点子只在个数变化时重建；“合在一起 / 分开”只改位置，好让过渡动画看得见
  const build = () => {
    svg.innerHTML = '';
    labels = [0, 1].map(() => svgEl('text', { x: 4, y: 0, class: 'dt-lb' }, svg));
    dots = [
      ...Array.from({ length: st.a }, (_, i) => ({ who: 'a', i })),
      ...Array.from({ length: st.b }, (_, i) => ({ who: 'b', i })),
    ].map((d) => ({ ...d, el: svgEl('circle', { cx: 0, cy: 0, r: DT.R, class: `dt ${d.who}` }, svg) }));
  };
  const layout = () => {
    const total = st.a + st.b;
    dots.forEach(({ who, i, el }) => {
      const g = who === 'a' ? i : st.a + i;
      const own = who === 'a' ? st.a : st.b;
      const lone = st.merged ? isOdd(total) && g === total - 1 : isOdd(own) && i === own - 1;
      const p = st.merged ? pos(g, DT.YM) : pos(i, who === 'a' ? DT.YA : DT.YB);
      el.classList.toggle('lone', lone);
      el.style.transform = `translate(${p.x}px, ${p.y}px)`;
    });
    const lb = st.merged ? [[`${total}`, DT.YM + 20], ['', 0]] : [[`${st.a}`, DT.YA + 20], [`${st.b}`, DT.YB + 20]];
    labels.forEach((t, k) => { t.textContent = lb[k][0]; t.setAttribute('y', lb[k][1]); });
    $('dtA').textContent = st.a;
    $('dtB').textContent = st.b;
    $('dtMsg').textContent = st.merged
      ? `${st.a} + ${st.b} = ${total}：${isOdd(total) ? '还剩 1 个落单，和是奇数。' : '全部两两配对，没有落单的，和是偶数。'}`
      : `${st.a} 是${oe(st.a)}${isOdd(st.a) ? '（多出 1 个）' : '（正好配对）'}，${st.b} 是${oe(st.b)}${isOdd(st.b) ? '（多出 1 个）' : '（正好配对）'}。`;
    $('dtGo').textContent = st.merged ? '↺ 分开' : '合在一起 ▶';
  };
  document.querySelector('#dtA').closest('.dt-ctrl').addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (!b) return;
    const k = b.dataset.k;
    st[k] = Math.min(DT.MAX, Math.max(1, st[k] + +b.dataset.d));
    st.merged = false;
    build();
    layout();
  });
  $('dtGo').addEventListener('click', () => { st.merged = !st.merged; layout(); });
  build();
  layout();
}

/* ---------- 第 6 页：翻书 ---------- */
const BK = { MIN: 2, MAX: 120 };
function initBook() {
  const svg = $('bkFig');
  let left = 50;
  const draw = () => {
    svg.innerHTML = '';
    svgEl('path', { d: 'M260 40 Q160 20 30 40 V270 Q160 250 260 270 Z', class: 'bk-page' }, svg);
    svgEl('path', { d: 'M260 40 Q360 20 490 40 V270 Q360 250 260 270 Z', class: 'bk-page' }, svg);
    svgEl('line', { x1: 260, y1: 40, x2: 260, y2: 270, class: 'bk-spine' }, svg);
    for (let k = 0; k < 6; k += 1) {
      svgEl('line', { x1: 60, y1: 80 + k * 26, x2: 230, y2: 80 + k * 26, class: 'bk-line' }, svg);
      svgEl('line', { x1: 290, y1: 80 + k * 26, x2: 460, y2: 80 + k * 26, class: 'bk-line' }, svg);
    }
    svgEl('text', { x: 60, y: 252, class: 'bk-no even' }, svg).textContent = left;
    svgEl('text', { x: 460, y: 252, class: 'bk-no odd' }, svg).textContent = left + 1;
    $('bkSum').innerHTML = `${left} + ${left + 1} = <b class="odd">${2 * left + 1}</b>　（${oe1(left)} + ${oe1(left + 1)} = ${oe1(2 * left + 1)}）`;
  };
  const go = (n) => { left = Math.min(BK.MAX, Math.max(BK.MIN, n)); draw(); };
  $('bkPrev').addEventListener('click', () => go(left - 2));
  $('bkNext').addEventListener('click', () => go(left + 2));
  $('bkRand').addEventListener('click', () => go(2 * rand(BK.MIN / 2, BK.MAX / 2)));
  draw();
}

/* ---------- 第 7 页：连加卡片 ---------- */
const CJ = { CARDS: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20, 23], MAX: 8 };
function initChain() {
  const st = { list: [] };
  const render = () => {
    const odd = st.list.filter(isOdd).length;
    const sum = st.list.reduce((s, n) => s + n, 0);
    $('cjEq').innerHTML = st.list.length ? `${st.list.map((n) => `<span class="${isOdd(n) ? 'odd' : 'even'}">${n}</span>`).join(' + ')} = <b>${sum}</b>` : '<span class="muted">还没有加数</span>';
    $('cjMsg').textContent = st.list.length < 2 ? '至少选两个加数。' : `加数中有 ${odd} 个奇数（${odd % 2 ? '单数' : '双数'}个），和是${oe(sum)}。`;
  };
  CJ.CARDS.forEach((n) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = n;
    b.className = isOdd(n) ? 'odd' : 'even';
    b.addEventListener('click', () => { if (st.list.length < CJ.MAX) { st.list = [...st.list, n]; render(); } });
    $('cjPool').appendChild(b);
  });
  $('cjClear').addEventListener('click', () => { st.list = []; render(); });
  render();
}

/* ---------- 第 8 页：点子阵列（积） ---------- */
const AR = { MAXC: 9, MAXR: 6, GAP: 44, X0: 40, Y0: 40, R: 12 };
function initArray() {
  const svg = $('arFig');
  const st = { c: 5, r: 3 };
  const draw = () => {
    svg.innerHTML = '';
    const { c, r } = st;
    const P = (i, j) => ({ x: AR.X0 + i * AR.GAP, y: AR.Y0 + j * AR.GAP }); // i 列 j 排
    const pair = (p, q) => {
      const [x1, y1, x2, y2] = [Math.min(p.x, q.x), Math.min(p.y, q.y), Math.max(p.x, q.x), Math.max(p.y, q.y)];
      svgEl('rect', { x: x1 - 17, y: y1 - 17, width: x2 - x1 + 34, height: y2 - y1 + 34, rx: 17, class: 'ar-pair' }, svg);
    };
    let lone = null;
    if (c % 2 === 0) {
      for (let j = 0; j < r; j += 1) for (let i = 0; i < c; i += 2) pair(P(i, j), P(i + 1, j));
    } else if (r % 2 === 0) {
      for (let i = 0; i < c; i += 1) for (let j = 0; j < r; j += 2) pair(P(i, j), P(i, j + 1));
    } else {
      for (let j = 0; j < r; j += 1) for (let i = 0; i < c - 1; i += 2) pair(P(i, j), P(i + 1, j));
      for (let j = 0; j < r - 1; j += 2) pair(P(c - 1, j), P(c - 1, j + 1));
      lone = [c - 1, r - 1];
    }
    for (let j = 0; j < r; j += 1) for (let i = 0; i < c; i += 1) {
      const p = P(i, j);
      const isLone = lone && lone[0] === i && lone[1] === j;
      svgEl('circle', { cx: p.x, cy: p.y, r: AR.R, class: `ar-dot ${isLone ? 'lone' : ''}` }, svg);
    }
    $('arC').textContent = c;
    $('arR').textContent = r;
    $('arMsg').textContent = `${c} × ${r} = ${c * r}：${lone ? '两个乘数都是奇数，右下角剩 1 个，积是奇数。' : `有偶数乘数（${c % 2 === 0 ? c : r}），全部两两配对，积是偶数。`}`;
  };
  document.querySelector('#arC').closest('.dt-ctrl').addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (!b) return;
    const k = b.dataset.k;
    const max = k === 'c' ? AR.MAXC : AR.MAXR;
    st[k] = Math.min(max, Math.max(1, st[k] + +b.dataset.d));
    draw();
  });
  draw();
}

window.LESSON = {
  init() {
    initMini();
    initExperiment();
    initDots();
    initBook();
    initChain();
    initArray();
  },
};
