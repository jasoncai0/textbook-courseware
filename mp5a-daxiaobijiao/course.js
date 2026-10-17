'use strict';
/* 五上 小数的大小比较 · 本课互动：例 7 百格图、数轴放大镜（一层一层放大 = 一位一位比）、数位对齐表逐位比、
 * 比大小点选、身高放大图、□里能填几、排序、0.1~0.2 之间有多少个小数。数值一律换成“千分之几”的整数计算。 */
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
const CA = '#c0392b';
const CB = '#1d6fa5';
const th = (s) => { const [a, b = ''] = s.split('.'); return +a * 1000 + +(b + '000').slice(0, 3); };
const PLACE = ['整数部分', '十分位', '百分位', '千分位'];
const UNIT = [1000, 100, 10, 1];
// 第 k 层上的“数字”：k=0 取整数部分，k≥1 取第 k 位小数
const digitAt = (v, k) => (k === 0 ? Math.floor(v / 1000) : Math.floor(v / UNIT[k]) % 10);
function compare(a, b) {
  const [A, B] = [th(a), th(b)];
  for (let k = 0; k < 4; k += 1) {
    const [x, y] = [digitAt(A, k), digitAt(B, k)];
    if (x !== y) return { sign: x > y ? 'gt' : 'lt', k, x, y };
  }
  return { sign: 'eq', k: 3 };
}
const SYM = { gt: '&gt;', lt: '&lt;', eq: '=' };

/* 第 3 页：0.6 与 0.48 的百格图 */
function hundred(svg, x0, y0, S, n) {
  const c = S / 10;
  const cols = Math.floor(n / 10);
  if (cols) svgEl('rect', { x: x0, y: y0, width: cols * c, height: S, fill: FILL }, svg);
  if (n % 10) svgEl('rect', { x: x0 + cols * c, y: y0, width: c, height: (n % 10) * c, fill: FILL }, svg);
  let d = '';
  for (let k = 1; k < 10; k += 1) d += `M${x0 + k * c} ${y0}V${y0 + S}M${x0} ${y0 + k * c}H${x0 + S}`;
  svgEl('path', { d, stroke: EDGE, 'stroke-width': 1 }, svg);
  svgEl('rect', { x: x0, y: y0, width: S, height: S, fill: 'none', stroke: EDGE, 'stroke-width': 2.5 }, svg);
}
function initE7() {
  const svg = $('e7Fig');
  hundred(svg, 20, 10, 220, 60);
  hundred(svg, 280, 10, 220, 48);
  svgEl('text', { x: 130, y: 270, class: 'fig-lb' }, svg).textContent = '0.6（60 格）';
  svgEl('text', { x: 390, y: 270, class: 'fig-lb' }, svg).textContent = '0.48（48 格）';
}

/* 第 4 页：数轴放大镜 */
const ZL_PAIRS = [['0.6', '0.48'], ['0.13', '0.129'], ['1.54', '1.53'], ['7.96', '8.32'], ['0.76', '0.706'], ['3.040', '3.04']];
const ZL = { x0: 50, x1: 950, y: 120 };
function initZoomLine() {
  const svg = $('zlFig');
  const st = { p: 0, k: 0 };
  const pair = () => ZL_PAIRS[st.p];
  const vals = () => pair().map(th);
  const windowOf = (k) => {
    if (k === 0) return 0;
    const span = UNIT[k] * 10;
    return Math.floor(Math.min(...vals()) / span) * span;
  };
  // 同一大格里分不开要放大；已经分开但两点挨得太近（不到 4 小格）时，也允许再放大一层看清楚
  const canZoom = () => {
    const [A, B] = vals();
    if (st.k >= 3) return false;
    if (Math.floor(A / UNIT[st.k]) === Math.floor(B / UNIT[st.k])) return true;
    const near = Math.abs(A - B) < (UNIT[st.k] * 4) / 10;
    return near && Math.max(A, B) <= windowOf(st.k + 1) + UNIT[st.k];
  };
  const fmt = (v, k) => (v % 1000 === 0 ? String(v / 1000) : (v / 1000).toFixed(k));
  const render = () => {
    svg.innerHTML = '';
    const { k } = st;
    const lo = windowOf(k);
    const span = UNIT[k] * 10;
    const X = (v) => ZL.x0 + ((v - lo) / span) * (ZL.x1 - ZL.x0);
    svgEl('line', { x1: ZL.x0 - 20, x2: ZL.x1 + 30, y1: ZL.y, y2: ZL.y, class: 'zl-ax' }, svg);
    svgEl('path', { d: `M${ZL.x1 + 42} ${ZL.y}l-16 -7v14Z`, fill: '#c0392b' }, svg);
    for (let i = 0; i <= 10; i += 1) {
      const v = lo + i * UNIT[k];
      svgEl('line', { x1: X(v), x2: X(v), y1: ZL.y - 14, y2: ZL.y + 14, class: 'zl-tk' }, svg);
      svgEl('text', { x: X(v), y: ZL.y + 42, class: 'zl-num' }, svg).textContent = fmt(v, k);
      if (i < 10 && k < 3) for (let j = 1; j < 10; j += 1) {
        const x = X(v + (j * UNIT[k]) / 10);
        svgEl('line', { x1: x, x2: x, y1: ZL.y - 7, y2: ZL.y + 7, class: 'zl-mn' }, svg);
      }
    }
    const [A, B] = vals();
    [[A, pair()[0], CA, -1], [B, pair()[1], CB, 1]].forEach(([v, lab, c, side], i) => {
      const x = X(v);
      const close = Math.abs(X(A) - X(B)) < 70;
      const dy = close && i === 1 ? 34 : 0;
      svgEl('circle', { cx: x, cy: ZL.y, r: 10, fill: c, stroke: '#fff', 'stroke-width': 2.5 }, svg);
      svgEl('text', { x, y: ZL.y - 26 - dy, class: 'zl-lb', fill: c }, svg).textContent = lab;
      return side;
    });
    // 读数：两个数，正在比的那一位高亮
    const r0 = compare(...pair());
    const hk = r0.sign !== 'eq' && r0.k < k ? r0.k : k;
    const hl = (s) => {
      const [a, b = ''] = s.split('.');
      const ip = hk === 0 ? `<b class="cur">${a}</b>` : a;
      const dp = [...b].map((ch, j) => (j + 1 === hk ? `<b class="cur">${ch}</b>` : ch)).join('');
      return ip + (b ? `.${dp}` : '');
    };
    $('zlNums').innerHTML = `<span style="color:${CA}">${hl(pair()[0])}</span>　和　<span style="color:${CB}">${hl(pair()[1])}</span>`;
    const r = compare(...pair());
    const [x, y] = [digitAt(A, k), digitAt(B, k)];
    const m = $('zlMsg');
    const head = `这一层每大格是 <b>${fmt(UNIT[k], k)}</b>，比的是<b>${PLACE[k]}</b>：${x} 和 ${y}。`;
    if (r.sign !== 'eq' && r.k < k) {
      m.className = 'tip feedback fb-ok';
      m.innerHTML = `放大看得更清楚了：在<b>${PLACE[r.k]}</b>上（${r.x} 和 ${r.y}）就已经比出来，<b>${pair()[0]} ${SYM[r.sign]} ${pair()[1]}</b>。`;
    } else if (x !== y) {
      m.className = 'tip feedback fb-ok';
      m.innerHTML = `${head}已经分开了：<b>${pair()[0]} ${SYM[r.sign]} ${pair()[1]}</b>（越往右越大）。`;
    } else if (canZoom()) {
      m.className = 'tip feedback';
      m.innerHTML = `${head}一样，两个点在同一大格里，<b>放大一层</b>看下一位。`;
    } else {
      m.className = 'tip feedback fb-ok';
      m.innerHTML = `${head}每一位都相同，两个点重合：<b>${pair()[0]} = ${pair()[1]}</b>。`;
    }
    $('zlIn').disabled = !canZoom();
    $('zlOut').disabled = k === 0;
  };
  $('zlPick').innerHTML = ZL_PAIRS.map((p, i) => `<button type="button" class="btn ${i ? '' : 'solid'}" data-p="${i}">${p[0]} 和 ${p[1]}</button>`).join('');
  $('zlPick').addEventListener('click', (e) => {
    const p = e.target.closest('[data-p]')?.dataset.p;
    if (p === undefined) return;
    st.p = +p; st.k = 0;
    $('zlPick').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b.dataset.p === p));
    render();
  });
  $('zlIn').addEventListener('click', () => { if (canZoom()) { st.k += 1; render(); } });
  $('zlOut').addEventListener('click', () => { if (st.k) { st.k -= 1; render(); } });
  render();
}

/* 第 5 页：数位对齐，逐位比 */
const AL_PAIRS = [['7.96', '8.32'], ['0.13', '0.129']];
function initAlign() {
  const st = { p: 1, k: -1 };
  const render = () => {
    const [a, b] = AL_PAIRS[st.p];
    const row = (s) => {
      const [ip, dp = ''] = s.split('.');
      const cells = [ip, '.', ...[0, 1, 2].map((j) => dp[j] ?? '')];
      return cells.map((c, j) => {
        const k = j === 0 ? 0 : j - 1;
        const on = j !== 1 && k <= st.k;
        const cur = j !== 1 && k === st.k;
        return `<td class="${on ? 'on' : ''} ${cur ? 'cur' : ''}">${c}</td>`;
      }).join('');
    };
    $('alTab').innerHTML = `<tr><th></th><th>整数部分</th><th></th><th>十分位</th><th>百分位</th><th>千分位</th></tr><tr><th>第一个数</th>${row(a)}</tr><tr><th>第二个数</th>${row(b)}</tr>`;
    const m = $('alMsg');
    if (st.k < 0) { m.className = 'tip feedback'; m.innerHTML = `${a} ○ ${b}：小数点对齐，点“比下一位”。`; return; }
    const [A, B] = [th(a), th(b)];
    const [x, y] = [digitAt(A, st.k), digitAt(B, st.k)];
    if (x === y) { m.className = 'tip feedback'; m.innerHTML = `${PLACE[st.k]}：${x} = ${y}，一样，再比下一位。`; return; }
    m.className = 'tip feedback fb-ok';
    m.innerHTML = `${PLACE[st.k]}：${x} ${x > y ? '&gt;' : '&lt;'} ${y}，所以 <b>${a} ${x > y ? '&gt;' : '&lt;'} ${b}</b>。后面不用再比了。`;
  };
  document.querySelectorAll('[data-al]').forEach((btn) => btn.addEventListener('click', () => { st.p = +btn.dataset.al; st.k = -1; render(); }));
  $('alStep').addEventListener('click', () => {
    const [a, b] = AL_PAIRS[st.p];
    const done = st.k >= 0 && digitAt(th(a), st.k) !== digitAt(th(b), st.k);
    if (!done && st.k < 3) st.k += 1;
    render();
  });
  render();
}

/* 第 6 页：比大小点选（课本 p39 练一练、p41 练习六 8） */
const CMP_A = [['8.02', '8.20'], ['0.76', '0.706'], ['3.45', '2.54']];
const CMP_B = [['0.6', '0.56'], ['4.009', '4.01'], ['1.99', '2'], ['0.32', '0.23'], ['3.040', '3.04'], ['5.28', '5.24']];
function initCmp() {
  const card = ([a, b]) => {
    const r = compare(a, b);
    const why = r.sign === 'eq' ? '每一位都相同（末尾的 0 可以去掉），两个数相等。' : `${PLACE[r.k]}上 ${r.x} ${SYM[r.sign]} ${r.y}，所以 ${a} ${SYM[r.sign]} ${b}。`;
    return `<div class="jcard cmp-card"><p class="cmp-q">${a} ○ ${b}</p><div class="pick" data-ans="${r.sign}"><button type="button" data-k="gt">&gt;</button><button type="button" data-k="lt">&lt;</button><button type="button" data-k="eq">=</button><p class="pick-why">${why}</p></div></div>`;
  };
  $('cmpA').innerHTML = CMP_A.map(card).join('');
  $('cmpB').innerHTML = CMP_B.map(card).join('');
  MCheck.init($('cmpA'));
  MCheck.init($('cmpB'));
}

/* 第 7 页：1.50 米到 1.60 米放大，每格 0.01 米 */
function initHeight() {
  const svg = $('htFig');
  const [x0, x1, lo, hi] = [40, 490, 150, 160]; // 厘米
  const X = (cm) => x0 + ((cm - lo) / (hi - lo)) * (x1 - x0);
  svgEl('line', { x1: x0, x2: x1, y1: 150, y2: 150, class: 'zl-ax' }, svg);
  for (let c = lo; c <= hi; c += 1) {
    svgEl('line', { x1: X(c), x2: X(c), y1: c % 5 ? 143 : 136, y2: 150, class: 'zl-tk' }, svg);
    if (c % 5 === 0) svgEl('text', { x: X(c), y: 178, class: 'ht-num' }, svg).textContent = (c / 100).toFixed(2);
  }
  [['小明', 154, CA, 40], ['小军', 153, CB, 90]].forEach(([nm, cm, c, y]) => {
    svgEl('rect', { x: x0, y, width: X(cm) - x0, height: 30, fill: c, opacity: 0.85, rx: 4 }, svg);
    svgEl('line', { x1: X(cm), x2: X(cm), y1: y, y2: 150, stroke: c, 'stroke-dasharray': '4 4', 'stroke-width': 2 }, svg);
    svgEl('text', { x: x0 + 8, y: y + 22, class: 'ht-name' }, svg).textContent = `${nm} ${(cm / 100).toFixed(2)} 米`;
  });
  svgEl('text', { x: x0, y: 202, class: 'ht-cap' }, svg).textContent = '从 1.50 米开始画，每小格 0.01 米（1 厘米）';
}

/* 第 8 页：□里能填几 */
const BOXES = [
  { left: (d) => '7.31', right: (d) => `${d}.4`, show: ['7.31 &gt; ', '□', '.4'], ok: (d) => th('7.31') > th(`${d}.4`) },
  { left: (d) => '0.542', right: (d) => `0.5${d}3`, show: ['0.542 &lt; 0.5', '□', '3'], ok: (d) => th('0.542') < th(`0.5${d}3`) },
];
function initBoxes() {
  BOXES.forEach((bx, i) => {
    const el = $(`bx${i}`);
    const st = { tried: {}, cur: null };
    const render = () => {
      const [pre, , post] = bx.show;
      el.innerHTML = `<p class="bx-q">${pre}<span class="bx">${st.cur ?? '□'}</span>${post}</p>
        <div class="bx-digits" data-noswipe>${[...Array(10).keys()].map((d) => `<button type="button" class="btn ${st.tried[d] === undefined ? '' : st.tried[d] ? 'ok' : 'no'}" data-d="${d}">${d}</button>`).join('')}</div>
        <p class="bx-res">能填：<b>${Object.keys(st.tried).filter((d) => st.tried[d]).sort().join('、') || '……'}</b></p>`;
    };
    el.addEventListener('click', (e) => {
      const d = e.target.closest('[data-d]')?.dataset.d;
      if (d === undefined) return;
      st.cur = d;
      st.tried[d] = bx.ok(+d);
      render();
    });
    render();
  });
}

/* 第 9 页：从小到大排序 */
const SORT_NUMS = ['0.6', '0.506', '0.056', '0.56', '0.065', '0.605'];
function initSort() {
  const st = { done: [] };
  const order = [...SORT_NUMS].sort((a, b) => th(a) - th(b));
  const render = (msg, kind = '') => {
    $('sortPool').innerHTML = SORT_NUMS.map((n) => `<button type="button" class="btn ${st.done.includes(n) ? 'used' : ''}" data-n="${n}" ${st.done.includes(n) ? 'disabled' : ''}>${n}</button>`).join('');
    $('sortLine').innerHTML = st.done.length ? st.done.join(' &lt; ') : '<span class="muted">（点出来的数排在这里）</span>';
    const m = $('sortMsg');
    m.className = `tip feedback ${kind}`;
    m.innerHTML = msg || '先找最小的：先比十分位。';
  };
  $('sortPool').addEventListener('click', (e) => {
    const n = e.target.closest('[data-n]')?.dataset.n;
    if (!n || st.done.includes(n)) return;
    const want = order[st.done.length];
    if (n === want) {
      st.done.push(n);
      render(st.done.length === order.length ? '<b>✓ 排好了！</b>' : `对，${n} 是剩下的数里最小的。`, st.done.length === order.length ? 'fb-ok' : '');
    } else {
      const r = compare(want, n);
      render(`还有比 ${n} 更小的：${want} 和 ${n} 比，${PLACE[r.k]}上 ${r.x} &lt; ${r.y}。`, 'fb-warn');
    }
  });
  render();
}

/* 第 10 页：0.1~0.2 平均分成 10 份，再把 0.11~0.12 放大分成 10 份 */
function initMany() {
  const svg = $('manyFig');
  const top = { x0: 60, x1: 940, y: 50 };
  const X = (i) => top.x0 + (i / 10) * (top.x1 - top.x0);
  svgEl('line', { x1: top.x0, x2: top.x1, y1: top.y, y2: top.y, class: 'zl-ax' }, svg);
  for (let i = 0; i <= 10; i += 1) {
    svgEl('line', { x1: X(i), x2: X(i), y1: top.y - 10, y2: top.y + 10, class: 'zl-tk' }, svg);
    svgEl('text', { x: X(i), y: top.y + 34, class: i % 10 ? 'many-n' : 'many-n big' }, svg).textContent = (0.1 + i / 100).toFixed(2);
  }
  const bot = { x0: 200, x1: 800, y: 150 };
  const Xb = (j) => bot.x0 + (j / 10) * (bot.x1 - bot.x0);
  svgEl('path', { d: `M${X(1)} ${top.y + 42}L${bot.x0} ${bot.y - 12}M${X(2)} ${top.y + 42}L${bot.x1} ${bot.y - 12}`, class: 'many-link' }, svg);
  svgEl('line', { x1: bot.x0, x2: bot.x1, y1: bot.y, y2: bot.y, class: 'zl-ax' }, svg);
  for (let j = 0; j <= 10; j += 1) {
    svgEl('line', { x1: Xb(j), x2: Xb(j), y1: bot.y - 8, y2: bot.y + 8, class: 'zl-tk' }, svg);
    if (j % 5 === 0) svgEl('text', { x: Xb(j), y: bot.y + 32, class: 'many-n o' }, svg).textContent = (0.11 + j / 1000).toFixed(j % 10 ? 3 : 2);
  }
  svgEl('text', { x: bot.x1 + 20, y: bot.y + 6, class: 'many-cap' }, svg).textContent = '还能再分……';
}

window.LESSON = {
  init() {
    initE7();
    initZoomLine();
    initAlign();
    initCmp();
    initHeight();
    initBoxes();
    initSort();
    initMany();
  },
};
