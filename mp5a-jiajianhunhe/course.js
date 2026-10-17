'use strict';
/* 五上 小数加减混合运算 · 本课互动：课堂计算器、运算顺序（点运算符号逐步计算）、按比例的竹竿图、
 * 边算边画的水位折线图、下落距离图。所有小数运算用 BigInt（放大 10^10 倍）精确计算。 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};

/* 精确小数：字符串 ↔ BigInt（单位 10^-10） */
const SC = 10;
const toBig = (s) => {
  const neg = s.startsWith('-');
  const [a, b = ''] = s.replace('-', '').split('.');
  const v = BigInt(a || '0') * 10n ** BigInt(SC) + BigInt((b + '0'.repeat(SC)).slice(0, SC) || '0');
  return neg ? -v : v;
};
const fromBig = (v) => {
  const neg = v < 0n;
  const s = (neg ? -v : v).toString().padStart(SC + 1, '0');
  const int = s.slice(0, -SC);
  const dec = s.slice(-SC).replace(/0+$/, '');
  return `${neg ? '-' : ''}${int}${dec ? `.${dec}` : ''}`;
};
const apply = (x, op, y) => (op === '+' ? x + y : x - y);
const show = (s) => s.replace('-', '−');

/* 第 3 页：课堂计算器（加减法，按“从左往右”逐步算） */
const KEYS = ['7', '8', '9', 'C', '4', '5', '6', '−', '1', '2', '3', '+', '0', '.', '='];
const TARGET = toBig('90.9');
function initCalc() {
  const st = { disp: '0', acc: null, op: null, fresh: true, expr: [], count: 0 };
  $('cdKeys').innerHTML = KEYS.map((k) => `<button type="button" class="ck ${/[0-9.]/.test(k) ? '' : 'op'} ${k === '=' ? 'eq' : ''}" data-k="${k}">${k === '.' ? '·' : k}</button>`).join('');
  const render = () => {
    $('cdDisp').textContent = show(st.disp);
    $('cdExpr').innerHTML = `<span>${st.expr.length ? st.expr.join(' ') : '&nbsp;'}</span>`;
  };
  const say = (h, ok) => { const m = $('cdMsg'); m.className = `tip feedback ${ok ? 'fb-ok' : ''}`; m.innerHTML = h; };
  const press = (k) => {
    if (k === 'C') { Object.assign(st, { disp: '0', acc: null, op: null, fresh: true, expr: [], count: 0 }); say('已清除。把 5 个全额连加起来，最后按“=”。'); render(); return; }
    if (/[0-9]/.test(k)) {
      if (st.fresh) { st.disp = k; st.fresh = false; if (!st.op) { st.expr = []; st.count = 0; } } else if (st.disp === '0') st.disp = k; else if (st.disp.replace(/\D/g, '').length < 12) st.disp += k;
      render(); return;
    }
    if (k === '.') {
      if (st.fresh) { st.disp = '0.'; st.fresh = false; if (!st.op) { st.expr = []; st.count = 0; } } else if (!st.disp.includes('.')) st.disp += '.';
      render(); return;
    }
    const val = toBig(st.disp);
    if (k === '+' || k === '−') {
      if (st.acc === null) { st.expr = []; st.count = 0; }
      if (!st.fresh || st.acc === null) {
        st.expr.push(show(st.disp));
        st.acc = st.acc === null || !st.op ? val : apply(st.acc, st.op, val);
        st.count += 1;
        st.disp = fromBig(st.acc);
      } else st.expr.pop();
      st.op = k === '+' ? '+' : '-';
      st.expr.push(k);
      st.fresh = true;
      render(); return;
    }
    // '='
    if (st.op === null || st.acc === null) { render(); return; }
    st.expr.push(show(st.disp), '=');
    st.acc = apply(st.acc, st.op, val);
    st.count += 1;
    st.disp = fromBig(st.acc);
    st.expr.push(show(st.disp));
    const right = st.acc === TARGET && st.count === 5;
    say(right ? '<b>✓ 一共用去 90.9 元</b>，写钱数时可以写成 90.90 元。' : `得 ${show(st.disp)}。${st.count === 5 ? '和课本的结果不一样，检查一下有没有按错键？' : '例 3 要把 5 个全额都加起来哦。'}`, right);
    st.acc = null; st.op = null; st.fresh = true;
    render();
  };
  $('cdKeys').addEventListener('click', (e) => {
    const k = e.target.closest('[data-k]')?.dataset.k;
    if (k) press(k);
  });
  render();
}

/* 第 5 页：运算顺序。点哪个符号先算哪一步；只有加减时必须从左往右 */
const OD_EXPRS = ['13 - 5.4 + 2.6', '3.2 + 0.48 + 10.3', '50 - 25.50 - 15.45', '3.5 - 0.4 - 0.8'];
function initOrder() {
  const st = { k: 0, toks: [], hist: [] };
  const reset = () => { st.toks = OD_EXPRS[st.k].split(' '); st.hist = []; };
  const fmtToks = (t) => t.map((x) => (x === '-' ? '−' : x)).join(' ');
  const say = (h, kind = '') => { const m = $('odMsg'); m.className = `tip feedback ${kind}`; m.innerHTML = h; };
  const render = () => {
    $('odExpr').innerHTML = st.toks.map((t, i) => (i % 2 ? `<button type="button" class="od-op" data-i="${i}">${t === '-' ? '−' : '+'}</button>` : `<span>${t}</span>`)).join('');
    $('odHist').innerHTML = st.hist.map((h) => `<p>${h}</p>`).join('');
    if (st.toks.length === 1) say(`<b>✓ 算完了：</b>${fmtToks(OD_EXPRS[st.k].split(' '))} = ${st.toks[0]}`, 'fb-ok');
  };
  $('odPick').innerHTML = OD_EXPRS.map((x, i) => `<button type="button" class="btn ${i ? '' : 'solid'}" data-k="${i}">${fmtToks(x.split(' '))}</button>`).join('');
  $('odPick').addEventListener('click', (e) => {
    const k = e.target.closest('[data-k]')?.dataset.k;
    if (k === undefined) return;
    st.k = +k; reset();
    $('odPick').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b.dataset.k === k));
    say('先算哪一步？点那个运算符号。');
    render();
  });
  $('odExpr').addEventListener('click', (e) => {
    const i = +e.target.closest('[data-i]')?.dataset.i;
    if (!i) return;
    const t = st.toks;
    if (i !== 1) {
      // 错误顺序：先算后面的，看看会得多少
      const right = t.slice(i - 1, i + 2);
      const r = fromBig(apply(toBig(right[0]), right[1], toBig(right[2])));
      const wrongToks = [...t.slice(0, i - 1), r, ...t.slice(i + 2)];
      let acc = toBig(wrongToks[0]);
      for (let j = 1; j < wrongToks.length; j += 2) acc = apply(acc, wrongToks[j], toBig(wrongToks[j + 1]));
      let ok = toBig(t[0]);
      for (let j = 1; j < t.length; j += 2) ok = apply(ok, t[j], toBig(t[j + 1]));
      const same = acc === ok;
      say(`只有加、减法，要<b>从左往右</b>算，先算 ${fmtToks(t.slice(0, 3))}。${same ? `（这道题先算后面碰巧结果一样，但顺序不对。）` : `如果先算 ${fmtToks(right)} = ${r}，最后会得 ${fromBig(acc)}，而正确结果是 ${fromBig(ok)}。`}`, 'fb-warn');
      e.target.closest('.od-op').classList.add('no');
      return;
    }
    const r = fromBig(apply(toBig(t[0]), t[1], toBig(t[2])));
    st.hist.push(`${fmtToks(t.slice(0, 3))} = <b>${r}</b>`);
    st.toks = [r, ...t.slice(3)];
    say(st.toks.length > 1 ? `对！再接着从左往右：${fmtToks(st.toks)}` : '', '');
    render();
  });
  reset();
  say('先算哪一步？点那个运算符号。');
  render();
}

/* 第 6 页：竹竿（1 米 = 100 个单位） */
function initPole() {
  const svg = $('poleFig');
  const k = 100;
  const [bot, x] = [400, 180];
  const mud = bot - 0.4 * k;
  const water = mud - 2.3 * k;
  const top = water - 0.8 * k;
  svgEl('rect', { x: 20, y: mud, width: 300, height: 0.4 * k, class: 'pl-mud' }, svg);
  svgEl('rect', { x: 20, y: water, width: 300, height: 2.3 * k, class: 'pl-water' }, svg);
  for (let y = water + 25; y < mud - 10; y += 32) svgEl('path', { d: `M40 ${y}q15 -8 30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0`, class: 'pl-wave' }, svg);
  svgEl('rect', { x: x - 6, y: top, width: 12, height: bot - top - 2, class: 'pl-pole' }, svg);
  for (let y = top + 30; y < bot; y += 40) svgEl('line', { x1: x - 6, x2: x + 6, y1: y, y2: y, class: 'pl-node' }, svg);
  const dim = (y1, y2, xx, txt, cls) => {
    svgEl('path', { d: `M${xx - 6} ${y1}h12M${xx} ${y1}V${y2}M${xx - 6} ${y2}h12`, class: `pl-dim ${cls}` }, svg);
    svgEl('text', { x: xx + 10, y: (y1 + y2) / 2 + 7, class: `pl-t ${cls}` }, svg).textContent = txt;
  };
  dim(top, water, 340, '0.8 m', 'a');
  dim(water, mud, 340, '? m', 'q');
  dim(mud, bot - 2, 340, '0.4 m', 'a');
  dim(top, bot - 2, 410, '3.5 m', 'b');
}

/* 第 7 页：水位折线图，填对一天画一个点 */
const LEVELS = ['14.55', '14.50', '14.86', '15.73', '17.00', '16.72', '16.10'];
const DAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
function initWater() {
  const svg = $('wlFig');
  const [x0, x1, y0, y1, lo, hi] = [70, 500, 290, 20, 14, 18];
  const X = (i) => x0 + (i * (x1 - x0)) / 6;
  const Y = (m) => y0 - ((m - lo) / (hi - lo)) * (y0 - y1);
  for (let m = lo; m <= hi; m += 0.5) {
    svgEl('line', { x1: x0, x2: x1, y1: Y(m), y2: Y(m), class: m % 1 ? 'wl-grid thin' : 'wl-grid' }, svg);
    if (m % 1 === 0) svgEl('text', { x: x0 - 10, y: Y(m) + 6, class: 'wl-yt' }, svg).textContent = `${m} m`;
  }
  DAYS.forEach((d, i) => svgEl('text', { x: X(i), y: y0 + 28, class: 'wl-xt' }, svg).textContent = d);
  svgEl('line', { x1: x0, x2: x1, y1: Y(16.7), y2: Y(16.7), class: 'wl-warn' }, svg);
  svgEl('text', { x: x0 + 6, y: Y(16.7) - 8, class: 'wl-wt' }, svg).textContent = '警戒水位 16.7 m';
  const line = svgEl('polyline', { class: 'wl-line' }, svg);
  const dots = svgEl('g', {}, svg);
  const shown = new Set([0]);
  const draw = () => {
    dots.innerHTML = '';
    let pts = [];
    for (let i = 0; i < 7; i += 1) {
      if (!shown.has(i)) break; // 连续填对的天才连线
      pts.push(`${X(i)},${Y(+LEVELS[i])}`);
    }
    line.setAttribute('points', pts.join(' '));
    [...shown].forEach((i) => {
      const v = +LEVELS[i];
      svgEl('circle', { cx: X(i), cy: Y(v), r: 7, class: v > 16.7 ? 'wl-pt hi' : 'wl-pt' }, dots);
      svgEl('text', { x: X(i), y: Y(v) - 14, class: 'wl-pv' }, dots).textContent = LEVELS[i];
    });
  };
  document.querySelectorAll('.blank.wl').forEach((el) => {
    const inp = el.querySelector('input');
    const sync = () => setTimeout(() => {
      const d = +el.dataset.day;
      if (el.classList.contains('ok')) shown.add(d); else shown.delete(d);
      draw();
    }, 0);
    inp.addEventListener('change', sync);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') sync(); });
  });
  draw();
}

/* 第 9 页：每秒下落距离（1 米 = 4.5 个单位） */
function initFall() {
  const svg = $('fallFig');
  const k = 4.5;
  const segs = [4.9, 14.7, 24.5, 34.3];
  const colors = ['#9fd3f2', '#7cbf9e', '#f2c48a', '#f4a6c4'];
  let y = 20;
  segs.forEach((m, i) => {
    const h = m * k;
    svgEl('rect', { x: 110, y, width: 40, height: h, fill: colors[i], stroke: '#1f2d3a', 'stroke-width': 1 }, svg);
    svgEl('text', { x: 160, y: y + h / 2 + 7, class: 'fl-t' }, svg).textContent = `第 ${i + 1} 秒 ${m} m`;
    y += h;
  });
  svgEl('line', { x1: 40, x2: 280, y1: y, y2: y, class: 'fl-ground' }, svg);
  svgEl('path', { d: `M80 20V${y}M74 20h12M74 ${y}h12`, class: 'fl-dim' }, svg);
  svgEl('text', { x: 70, y: (20 + y) / 2, class: 'fl-q', transform: `rotate(-90 70 ${(20 + y) / 2})` }, svg).textContent = '一共多少米？';
  svgEl('circle', { cx: 130, cy: 12, r: 8, fill: '#c0392b' }, svg);
}

window.LESSON = {
  init() {
    initCalc();
    initOrder();
    initPole();
    initWater();
    initFall();
  },
};
