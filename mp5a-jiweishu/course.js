'use strict';
/* 五上 积的位数与积的近似值 · 本课互动：例 8 竖式分步、“小数点跳跳”（从积的右边起数位数、不够补 0）、
 * 例 9 竖式 + 数轴（5.088 更接近 5.09）、四舍五入小工具。竖式见 ../shared/mvert.js，数值全部由代码计算。 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent, txt) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (txt !== undefined) e.textContent = txt;
  if (parent) parent.appendChild(e);
  return e;
};
const decOf = (s) => (s.split('.')[1] || '').length;

/* 近似数末尾的 0 不能省：mcheck 按数值比较（0.7 = 0.70），这里对 data-strict 的空再按字面判一次 */
function strictBlanks() {
  document.querySelectorAll('.blank[data-strict]').forEach((el) => {
    const inp = el.querySelector('input');
    const judge = () => {
      const v = inp.value.trim().replace(/[．。]/g, '.');
      if (!v) return;
      if (el.dataset.ans.split('|').includes(v)) return;
      el.classList.remove('ok');
      el.classList.add('no');
    };
    inp.addEventListener('change', judge);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') judge(); });
  });
}

/* ---------- 第 3 页：例 8 竖式，只演示到整数积 ---------- */
function initV8() {
  const m = MVert.mul('#v8', '0.28', '0.28', { start: 0 });
  const say = ['先写竖式：末位对齐，按整数 28 × 28 来算。', '28 × 8 = 224', '28 × 2 = 56，写的时候末位对齐十位', '加起来：784。小数点该点在哪儿？'];
  MVert.bind(m, $('v8p'), $('v8n'), (n) => { $('v8say').textContent = say[n] || ''; }, m.stage.int);
}

/* ---------- 第 4 页：小数点跳跳 ---------- */
const HOP = [['0.28', '0.28'], ['0.7', '0.9'], ['1.05', '0.06'], ['0.18', '0.3']];
function initHop() {
  const fig = $('hopFig');
  const st = { k: 0, c: 0, trim: false };
  const cur = () => {
    const [a, b] = HOP[st.k];
    const P = String(BigInt(a.replace('.', '')) * BigInt(b.replace('.', '')));
    return { a, b, P, n: decOf(a) + decOf(b) };
  };
  const draw = () => {
    const { a, b, P, n } = cur();
    const done = st.c === n;
    const zeros = Math.max(0, st.c - P.length) + (done && st.c >= P.length ? 1 : 0);
    let cells = '0'.repeat(zeros) + P;
    let trimmed = 0;
    if (st.trim) { const t = cells.replace(/0+$/, ''); trimmed = cells.length - t.length; }
    const W = 92;
    const x0 = 380 - (cells.length * W) / 2;
    fig.innerHTML = '';
    cells.split('').forEach((ch, i) => {
      const add = i < zeros;
      const gone = i >= cells.length - trimmed;
      const g = svgEl('g', { class: `hop-cell${add ? ' add' : ''}${gone ? ' gone' : ''}` }, fig);
      svgEl('rect', { x: x0 + i * W + 6, y: 60, width: W - 12, height: 84, rx: 10 }, g);
      svgEl('text', { x: x0 + i * W + W / 2, y: 122 }, g, ch);
    });
    // 跳过的数字：上方画弧线并编号
    for (let j = 1; j <= st.c; j += 1) {
      const xr = x0 + (cells.length - j + 1) * W;
      const xl = xr - W;
      svgEl('path', { d: `M${xr} 54Q${(xl + xr) / 2} 8 ${xl} 54`, class: 'hop-arc' }, fig);
      svgEl('text', { x: (xl + xr) / 2, y: 30, class: 'hop-no' }, fig, j);
    }
    const px = x0 + (cells.length - st.c) * W;
    svgEl('circle', { cx: px, cy: 136, r: 9, class: `hop-pt${st.c ? '' : ' wait'}` }, fig);
    const intP = P.replace(/^0+(?=\d)/, '');
    $('hopInfo').innerHTML = `$${a}$ 有 <b>${decOf(a)}</b> 位小数，$${b}$ 有 <b>${decOf(b)}</b> 位小数，一共 <b class="o">${n}</b> 位；按整数乘得 <b>${intP}</b>。`;
    MathKit.tex($('hopInfo'));
    const val = n ? `${cells.slice(0, cells.length - n)}.${cells.slice(cells.length - n)}` : cells;
    let say = st.c === 0 ? '按“数一位”，小数点从积的最右边往左跳。' : `数了 ${st.c} 位${st.c > P.length ? `，数字不够了，前面补了 ${st.c - P.length} 个 0` : ''}。`;
    if (done) say = `数够 ${n} 位了！${zeros && st.c >= P.length ? '整数部分写 0，' : ''}积是 ${val}${/0$/.test(val) && !st.trim ? '，末尾的 0 可以去掉' : ''}。`;
    if (st.trim) say = `末尾的 0 去掉：积是 ${val.replace(/0+$/, '')}。`;
    $('hopSay').textContent = say;
    $('hopGo').disabled = done;
    $('hopTrim').hidden = !(done && /0$/.test(P) && !st.trim);
  };
  $('hopGo').addEventListener('click', () => { st.c += 1; draw(); });
  $('hopReset').addEventListener('click', () => { st.c = 0; st.trim = false; draw(); });
  $('hopTrim').addEventListener('click', () => { st.trim = true; draw(); });
  $('hopPick').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    $('hopPick').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    Object.assign(st, { k: +btn.dataset.k, c: 0, trim: false });
    draw();
  });
  draw();
}

/* ---------- 第 7 页：例 9 竖式 + 数轴 ---------- */
function initV9() {
  const m = MVert.mul('#v9', '3.18', '1.6', { round: 2, start: 0 });
  MVert.bind(m, $('v9p'), $('v9n'));
}
function initNumline() {
  const svg = $('nl9');
  const [lo, x0, x1] = [5080, 40, 600]; // 以 0.001 为单位：5.080 … 5.090
  const X = (t) => x0 + ((t - lo) / 10) * (x1 - x0);
  svgEl('path', { d: `M${x0 - 20} 70H${x1 + 24}`, class: 'nl-ax' }, svg);
  for (let t = lo; t <= lo + 10; t += 1) {
    const big = t === lo || t === lo + 10;
    svgEl('path', { d: `M${X(t)} ${big ? 56 : 63}V${big ? 84 : 77}`, class: 'nl-tk' }, svg);
  }
  svgEl('text', { x: X(lo), y: 112, class: 'nl-lb' }, svg, '5.08');
  svgEl('text', { x: X(lo + 10), y: 112, class: 'nl-lb' }, svg, '5.09');
  svgEl('path', { d: `M${X(lo + 5)} 40V96`, class: 'nl-mid' }, svg);
  svgEl('text', { x: X(lo + 5), y: 118, class: 'nl-sm' }, svg, '5.085（正中间）');
  svgEl('circle', { cx: X(lo + 8), cy: 70, r: 9, class: 'nl-pt' }, svg);
  svgEl('text', { x: X(lo + 8), y: 34, class: 'nl-lb red' }, svg, '5.088');
  svgEl('path', { d: `M${X(lo + 8) + 14} 52Q${(X(lo + 8) + X(lo + 10)) / 2} 30 ${X(lo + 10) - 4} 52`, class: 'nl-arr' }, svg);
}

/* ---------- 第 8 页：四舍五入小工具 ---------- */
function initRound() {
  const st = { v: '0.196', k: 2 };
  const draw = () => {
    const [ip, fp] = st.v.split('.');
    const digits = fp.split('').map((d, i) => `<span class="${i < st.k ? 'keep' : i === st.k ? 'look' : 'rest'}">${d}</span>`).join('');
    const ap = MVert.roundStr(BigInt(ip + fp), fp.length, st.k);
    const look = +fp[st.k];
    $('rndShow').innerHTML = `<p class="rnd-num"><span class="keep">${ip}.</span>${digits}</p><p class="rnd-say">看第 ${st.k + 1} 位小数 <b class="o">${look}</b>：${look >= 5 ? '满 5，进 1' : '不满 5，舍去'}　→　<b>${st.v} ≈ ${ap}</b></p>`;
  };
  const pick = (box, key, conv) => box.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    box.querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    st[key] = conv(btn.dataset[key]);
    draw();
  });
  pick($('rndNum'), 'v', String);
  pick($('rndK'), 'k', Number);
  draw();
}

window.LESSON = {
  init() {
    strictBlanks();
    initV8();
    MVert.mul('#v8b', '0.28', '0.28');
    initHop();
    MVert.mul('#e1', '2.5', '3.5', { dec: 1 });
    MVert.mul('#e2', '16.4', '4.5', { dec: 3 });
    MVert.mul('#e3', '82.3', '0.04', { dec: 2 });
    initV9();
    initNumline();
    initRound();
  },
};
