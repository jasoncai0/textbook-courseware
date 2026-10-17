'use strict';
/* 五上 小数的计数单位和数位顺序 · 本课互动：1→0.1→0.01→0.001 面积图、数位顺序表（点数字说意义、自动生成读法）、
 * 小数计数器（满十进一 / 退一当十）、看图写小数、直线上描点。图形、读法、数值都由代码计算。 */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const FILL = '#9fd3f2';
const EDGE = '#1d6fa5';

/* 读数：整数部分照整数读（0–9999），小数部分逐个读数字 */
const CN = '零一二三四五六七八九';
const UNITS = ['', '十', '百', '千'];
function readInt(s) {
  const n = String(parseInt(s, 10));
  if (n === '0') return '零';
  let out = '';
  let zero = false;
  [...n].forEach((ch, i) => {
    const d = +ch;
    const pos = n.length - 1 - i;
    if (!d) { zero = true; return; }
    if (zero && out) out += '零';
    zero = false;
    out += (d === 1 && pos === 1 && i === 0 ? '' : CN[d]) + UNITS[pos];
  });
  return out;
}
const readDec = (s) => {
  const [a, b] = s.split('.');
  return readInt(a) + (b ? `点${[...b].map((c) => CN[+c]).join('')}` : '');
};

/* 第 3 页：四个正方形都表示“1”，涂色依次是 1、0.1、0.01、0.001（按面积精确画） */
function initChain() {
  const svg = $('chainFig');
  const [S, gap, y0] = [180, 70, 20];
  const labels = ['1', '0.1', '0.01', '0.001'];
  labels.forEach((lb, i) => {
    const x0 = 20 + i * (S + gap);
    const c = S / 10;
    const r = (x, y, w, h) => svgEl('rect', { x: x0 + x, y: y0 + y, width: w, height: h, fill: i === 3 ? '#e0569a' : FILL }, svg);
    if (i === 0) r(0, 0, S, S);
    if (i === 1) r(0, 0, c, S);
    if (i === 2) r(0, 0, c, c);
    if (i === 3) r(0, 0, c / 10, c);
    let d = '';
    for (let k = 1; k < 10; k += 1) {
      if (i >= 1) d += `M${x0 + k * c} ${y0}V${y0 + S}`;
      if (i >= 2) d += `M${x0} ${y0 + k * c}H${x0 + S}`;
    }
    if (d) svgEl('path', { d, stroke: EDGE, 'stroke-width': 1 }, svg);
    if (i === 3) {
      let d3 = '';
      for (let k = 1; k < 10; k += 1) d3 += `M${x0 + (k * c) / 10} ${y0}V${y0 + c}`;
      svgEl('path', { d: d3, stroke: EDGE, 'stroke-width': 0.6 }, svg);
      svgEl('circle', { cx: x0 + c / 20, cy: y0 + c / 2, r: 16, fill: 'none', stroke: '#c0392b', 'stroke-width': 2.5 }, svg);
    }
    svgEl('rect', { x: x0, y: y0, width: S, height: S, fill: 'none', stroke: EDGE, 'stroke-width': 2.5 }, svg);
    svgEl('text', { x: x0 + S / 2, y: y0 + S + 34, class: 'ch-lb' }, svg).textContent = lb;
    if (i < 3) {
      const ax = x0 + S + 8;
      svgEl('path', { d: `M${ax} ${y0 + S / 2}h${gap - 18}m-10 -8l10 8l-10 8`, class: 'ch-ar' }, svg);
      svgEl('text', { x: ax + (gap - 16) / 2, y: y0 + S / 2 - 12, class: 'ch-op' }, svg).textContent = '÷10';
    }
  });
}

/* 第 5 页：数位顺序表 */
const PLACES = [
  { name: '千位', unit: '千', p: 3 }, { name: '百位', unit: '百', p: 2 }, { name: '十位', unit: '十', p: 1 }, { name: '个位', unit: '一', p: 0 },
  { name: '十分位', unit: '十分之一（0.1）', p: -1 }, { name: '百分位', unit: '百分之一（0.01）', p: -2 }, { name: '千分位', unit: '千分之一（0.001）', p: -3 },
];
const NUM_RE = /^\d{1,4}(\.\d{1,3})?$/;
function initPv() {
  const st = { s: '344.725', sel: null };
  const tab = $('pvTab');
  const cellsOf = (s) => {
    const [a, b = ''] = s.split('.');
    const n = String(parseInt(a, 10));
    return PLACES.map((pl) => (pl.p >= 0 ? (pl.p < n.length ? n[n.length - 1 - pl.p] : '') : (b[-pl.p - 1] ?? '')));
  };
  const render = () => {
    const cells = cellsOf(st.s);
    const head = PLACES.map((pl, i) => `${i === 4 ? '<th class="dot-col"></th>' : ''}<th class="${i === st.sel ? 'sel' : ''}">${pl.name}</th>`).join('');
    const unit = PLACES.map((pl, i) => `${i === 4 ? '<td class="dot-col"></td>' : ''}<td class="u ${i === st.sel ? 'sel' : ''}">${pl.unit.replace(/（.*）/, '')}</td>`).join('');
    const dig = cells.map((c, i) => `${i === 4 ? `<td class="dot-col"><span class="dot">${st.s.includes('.') ? '·' : ''}</span></td>` : ''}<td>${c === '' ? '' : `<button type="button" class="dg ${i === st.sel ? 'sel' : ''}" data-i="${i}">${c}</button>`}</td>`).join('');
    tab.innerHTML = `<tr><th class="rh">数位</th>${head}</tr><tr><th class="rh">计数单位</th>${unit}</tr><tr><th class="rh">数</th>${dig}</tr>`;
    $('pvRead').innerHTML = `<b>${st.s}</b> 读作：<b class="o">${readDec(st.s)}</b>`;
    const [a, b = ''] = st.s.split('.');
    const parts = cells.map((c, i) => (c && +c ? `${c} 个${PLACES[i].p < 0 ? ` ${(10 ** PLACES[i].p).toFixed(-PLACES[i].p)}` : PLACES[i].unit}` : null)).filter(Boolean);
    $('pvSum').innerHTML = `${st.s} = ${parts.join(' + ') || '0'}<br><span class="muted">整数部分是 ${String(parseInt(a, 10))}，小数部分是 ${b ? `0.${b}` : '0'}</span>`;
    const msg = $('pvMsg');
    if (st.sel === null) { msg.innerHTML = '点表里的一个数字，看看它表示多少。'; return; }
    const pl = PLACES[st.sel];
    const d = +cells[st.sel];
    const val = pl.p < 0 ? (d * 10 ** pl.p).toFixed(-pl.p) : String(d * 10 ** pl.p);
    msg.innerHTML = d
      ? `“${d}”在<b>${pl.name}</b>上，计数单位是${pl.unit}，表示 <b>${d} 个${pl.unit.replace(/（.*）/, '')}</b>，就是 <b class="o">${val}</b>。`
      : `“0”在<b>${pl.name}</b>上，表示这一位一个${pl.unit.replace(/（.*）/, '')}也没有，<b>0 起占位作用</b>。`;
  };
  const setNum = (s) => {
    st.s = s; st.sel = null;
    $('pvPick').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b.dataset.n === s));
    render();
  };
  $('pvPick').addEventListener('click', (e) => {
    const n = e.target.closest('[data-n]')?.dataset.n;
    if (n) { $('pvIn').value = n; setNum(n); }
  });
  $('pvIn').addEventListener('input', () => {
    const v = $('pvIn').value.trim().replace(/[．。]/g, '.');
    $('pvIn').classList.toggle('bad', !NUM_RE.test(v));
    if (NUM_RE.test(v)) setNum(v);
  });
  tab.addEventListener('click', (e) => {
    const i = e.target.closest('.dg')?.dataset.i;
    if (i === undefined) return;
    st.sel = +i;
    render();
  });
  render();
}

/* 第 6 页：小数计数器。档：十位 个位 · 十分位 百分位 千分位；内部用“千分之一”为单位计数，保证没有小数误差 */
const RODS = ['十位', '个位', '十分位', '百分位', '千分位'];
const ROD_W = [10000, 1000, 100, 10, 1];
const BEAD_C = ['#7d5ba6', '#1d6fa5', '#d9711c', '#2f7d6b', '#c0392b'];
const AB = { x0: 70, dx: 105, base: 272, top: 40, bh: 22 };
function initAbacus() {
  const svg = $('abFig');
  const st = { c: [0, 1, 4, 5, 0], busy: false, task: null };
  const beads = svgEl('g', {}, svg);
  const rx = (i) => AB.x0 + i * AB.dx;
  RODS.forEach((nm, i) => {
    svgEl('line', { x1: rx(i), x2: rx(i), y1: AB.top, y2: AB.base, class: 'ab-rod' }, svg);
    svgEl('text', { x: rx(i), y: AB.base + 32, class: 'ab-lb' }, svg).textContent = nm;
  });
  svgEl('rect', { x: 20, y: AB.base, width: 520, height: 10, rx: 4, class: 'ab-base' }, svg);
  svgEl('circle', { cx: (rx(1) + rx(2)) / 2, cy: AB.base + 26, r: 7, fill: '#c0392b' }, svg);
  $('abBtns').innerHTML = RODS.map((_, i) => `<span><button type="button" class="btn" data-i="${i}" data-d="1">＋</button><button type="button" class="btn" data-i="${i}" data-d="-1">−</button></span>`).join('');
  const value = () => st.c.reduce((s, n, i) => s + n * ROD_W[i], 0);
  const fmt = (v) => (v / 1000).toFixed(3).replace(/\.?0+$/, '');
  const draw = (hot = -1) => {
    beads.innerHTML = '';
    st.c.forEach((n, i) => {
      for (let k = 0; k < n; k += 1) {
        svgEl('ellipse', { cx: rx(i), cy: AB.base - AB.bh / 2 - k * AB.bh, rx: 30, ry: 10, fill: i === hot ? '#f4c430' : BEAD_C[i], stroke: '#fff', 'stroke-width': 1.5 }, beads);
      }
    });
    const v = value();
    $('abNum').innerHTML = `<b>${fmt(v)}</b>`;
    if (st.task !== null && !st.busy) {
      const ok = v === st.task;
      const m = $('abMsg');
      m.className = `tip feedback ${ok ? 'fb-ok' : ''}`;
      m.innerHTML = ok ? `<b>✓ 拨对了！</b>${fmt(v)} = ${describe()}` : `目标：拨出 <b>${fmt(st.task)}</b>。`;
    }
  };
  const describe = () => st.c.map((n, i) => (n ? `${n} 个${['十', '一', ' 0.1', ' 0.01', ' 0.001'][i]}` : null)).filter(Boolean).join(' + ') || '0';
  const say = (h) => { const m = $('abMsg'); m.className = 'tip feedback'; m.innerHTML = h; };
  const add = (i) => {
    if (st.c[i] < 9) { st.c[i] += 1; draw(); return; }
    if (i === 0) { say('十位已经 9 颗了，这个计数器拨不下了。'); return; }
    st.c[i] = 10; st.busy = true; draw(i);
    say(`${RODS[i]}满 10 颗：10 个 ${['', '一', '0.1', '0.01', '0.001'][i]} 是 1 个 ${['', '十', '一', '0.1', '0.01'][i]}，向<b>${RODS[i - 1]}</b>进一！`);
    setTimeout(() => { st.c[i] = 0; st.busy = false; add(i - 1); }, 900);
  };
  const sub = (i) => {
    if (st.c[i] > 0) { st.c[i] -= 1; draw(); return; }
    const j = [...st.c.keys()].slice(0, i).reverse().find((k) => st.c[k] > 0);
    if (j === undefined) { say('前面没有珠子可借，不够减。'); return; }
    st.c[j] -= 1;
    for (let k = j + 1; k < i; k += 1) st.c[k] = 9;
    st.c[i] = 9;
    say(`${RODS[i]}没有珠子，从<b>${RODS[j]}</b>退 1，当 10 个用，减去 1 还剩 9。`);
    draw();
  };
  $('abBtns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (!b || st.busy) return;
    if (+b.dataset.d > 0) add(+b.dataset.i); else sub(+b.dataset.i);
  });
  $('abTasks').addEventListener('click', (e) => {
    const t = e.target.closest('[data-t]')?.dataset.t;
    if (!t || st.busy) return;
    st.task = Math.round(+t * 1000);
    st.c = [0, 0, 0, 0, 0];
    draw();
  });
  $('abClear').addEventListener('click', () => { if (!st.busy) { st.c = [0, 0, 0, 0, 0]; st.task = null; say('点每一档下面的 ＋ − 拨珠子。'); draw(); } });
  draw();
}

/* 第 8 页：看图写小数（课本 p34 练一练 1）。每个大正方形表示 1，百格里按课本位置涂色 */
function hundredGrid(svg, x0, cells) {
  const c = 10;
  cells.forEach(([col, row]) => svgEl('rect', { x: x0 + col * c, y: 5 + row * c, width: c, height: c, fill: FILL }, svg));
  let d = '';
  for (let k = 0; k <= 10; k += 1) d += `M${x0 + k * c} 5V105M${x0} ${5 + k * c}H${x0 + 100}`;
  svgEl('path', { d, stroke: EDGE, 'stroke-width': 0.8, fill: 'none' }, svg);
  svgEl('rect', { x: x0, y: 5, width: 100, height: 100, fill: 'none', stroke: EDGE, 'stroke-width': 1.6 }, svg);
}
function fullSq(svg, x0) { svgEl('rect', { x: x0, y: 5, width: 100, height: 100, fill: FILL, stroke: EDGE, 'stroke-width': 1.6 }, svg); }
function initLk() {
  const a = $('lk1');
  fullSq(a, 5); fullSq(a, 115);
  const ca = [];
  for (let r = 0; r < 10; r += 1) ca.push([0, r]);
  for (let r = 2; r < 10; r += 1) ca.push([1, r]); // 第 2 列下面 8 格
  hundredGrid(a, 225, ca);
  const b = $('lk2');
  fullSq(b, 5);
  hundredGrid(b, 115, [[0, 6], [0, 7], [0, 8], [0, 9]]);
}

/* 第 9 页：直线上描点。先点数字，再点直线；位置吸附到 0.05 */
const NL_VALS = ['0.5', '1.3', '2.6', '3.75', '4.05'];
function initNl() {
  const R = { from: 0, to: 5, pad: 0.4 };
  const b = NumLine.board($('nlBoard'), { ...R, w: 900, h: 170, y: [-0.9, 1.6] });
  NumLine.axis(b, { from: 0, to: 5, step: 1, minor: 0.1, tail: 0.3, lead: 0.2 });
  const x0 = R.from - R.pad;
  const x1 = R.to + R.pad + 0.3;
  const st = { sel: NL_VALS[0], at: {} };
  const nodes = NL_VALS.map((v, i) => {
    const pt = b.pt(() => (st.at[v] !== undefined ? [st.at[v], 0] : null), { r: 8 });
    const tx = b.text(() => (st.at[v] !== undefined ? [st.at[v], 0] : null), v, { cls: 'nl-val', dy: i % 2 ? -44 : -18 });
    return { v, pt, tx };
  });
  const chips = $('nlChips');
  const render = () => {
    chips.innerHTML = NL_VALS.map((v) => {
      const at = st.at[v];
      const ok = at !== undefined && Math.abs(at - +v) < 1e-6;
      return `<button type="button" class="btn ${v === st.sel ? 'solid' : ''} ${at === undefined ? '' : ok ? 'ok' : 'no'}" data-v="${v}">${v}</button>`;
    }).join('');
    nodes.forEach(({ v, pt, tx }) => {
      const ok = Math.abs((st.at[v] ?? -9) - +v) < 1e-6;
      pt.classList.toggle('c3', ok); tx.classList.toggle('ok', ok);
    });
    const done = NL_VALS.filter((v) => Math.abs((st.at[v] ?? -9) - +v) < 1e-6).length;
    const m = $('nlMsg');
    m.className = `tip feedback ${done === NL_VALS.length ? 'fb-ok' : ''}`;
    m.innerHTML = done === NL_VALS.length ? '<b>✓ 全部描对了！</b>越往右，数越大。' : `先点上面的数（现在选的是 <b>${st.sel}</b>），再点直线上的位置。已描对 ${done} 个。`;
    b.update();
  };
  chips.setAttribute('data-noswipe', '');
  chips.addEventListener('click', (e) => {
    const v = e.target.closest('[data-v]')?.dataset.v;
    if (v) { st.sel = v; render(); }
  });
  b.svg.addEventListener('click', (e) => {
    const p = b.svg.createSVGPoint();
    p.x = e.clientX; p.y = e.clientY;
    const q = p.matrixTransform(b.svg.getScreenCTM().inverse());
    const x = x0 + (q.x / b.W) * (x1 - x0);
    if (x < -0.1 || x > 5.1) return;
    st.at[st.sel] = Math.round(x * 20) / 20;
    const next = NL_VALS.find((v) => st.at[v] === undefined);
    if (next) st.sel = next;
    render();
  });
  render();
}

window.LESSON = {
  init() {
    initChain();
    initPv();
    initAbacus();
    initLk();
    initNl();
  },
};
