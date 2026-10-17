'use strict';
/* 六上 分数除以整数 · 本课互动：长方形面积模型把 4/5 升平均分成 n 份（横着分 / 竖着切）、练一练涂色 6/7 再三等分。
 * 所有格子的大小、位置都按 1 升 = 整个长方形精确计算。通用部分见 ../shared/math.js、mcheck.js、fracfig.js */
const { tex } = MathKit;
const { el, gcd } = FracFig;
const $ = (id) => document.getElementById(id);
const PEOPLE = ['#f5a623', '#4f9bd0', '#2fa37f', '#e0607e', '#8e6bbf', '#c9a227'];
const JUICE = '#f9c86b';
const LINE = '#7d8e9c';
const ROWS = 5; // 1 升平均分成 5 格
const FULL = 4; // 果汁占 4 格
const BOX = { x: 120, y: 10, w: 290, h: 280 };

const texFrac = (a, b) => {
  const g = gcd(a, b);
  return b / g === 1 ? `${a / g}` : `\\dfrac{${a / g}}{${b / g}}`;
};

/* SVG 里的竖式分数（数字、分数线按位置画出） */
function svgFrac(svg, x, y, n, d, unit) {
  el('text', { x, y: y - 8, class: 'am-t' }, svg).textContent = n;
  el('line', { x1: x - 14, x2: x + 14, y1: y, y2: y, stroke: '#1f2d3a', 'stroke-width': 2 }, svg);
  el('text', { x, y: y + 24, class: 'am-t' }, svg).textContent = d;
  if (unit) el('text', { x: x + 22, y: y + 8, class: 'am-t s start' }, svg).textContent = unit;
}

/* 面积模型：mode = none | rows（分子 ÷ n，横条分组）| cols（竖着切成 n 列） */
function drawArea(svg, n, mode) {
  svg.innerHTML = '';
  const { x, y, w, h } = BOX;
  const rh = h / ROWS;
  const cols = mode === 'cols' ? n : 1;
  const cw = w / cols;
  const per = FULL / n;
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      let fill = '#fff';
      if (r > 0) {
        if (mode === 'cols') fill = PEOPLE[c];
        else if (mode === 'rows') fill = PEOPLE[Math.floor((r - 1) / per)];
        else fill = JUICE;
      }
      el('rect', { x: x + c * cw, y: y + r * rh, width: cw, height: rh, fill }, svg);
    }
  }
  // 格线画在颜色上面：横线 = 5 等分，竖虚线 = 切成 n 列
  for (let r = 1; r < ROWS; r += 1) el('line', { x1: x, x2: x + w, y1: y + r * rh, y2: y + r * rh, stroke: 'rgba(30,45,58,.45)', 'stroke-width': 1.5 }, svg);
  for (let c = 1; c < cols; c += 1) el('line', { x1: x + c * cw, x2: x + c * cw, y1: y, y2: y + h, stroke: '#1f2d3a', 'stroke-width': 2, 'stroke-dasharray': '7 5' }, svg);
  el('rect', { x, y, width: w, height: h, fill: 'none', stroke: '#2a4256', 'stroke-width': 3 }, svg);
  // 左侧大括号：4/5 升
  const by0 = y + rh;
  const by1 = y + h;
  el('path', { d: `M${x - 12} ${by0}q-12 0 -12 12V${(by0 + by1) / 2 - 10}q0 10 -10 10q10 0 10 10V${by1 - 12}q0 12 12 12`, fill: 'none', stroke: '#d9711c', 'stroke-width': 2.5 }, svg);
  svgFrac(svg, x - 70, (by0 + by1) / 2, 4, 5, '升');
  el('text', { x: x + w + 12, y: y + rh / 2 + 7, class: 'am-t s start' }, svg).textContent = mode === 'rows' ? '' : '← 1 升';
  if (mode === 'cols') {
    for (let c = 0; c < n; c += 1) {
      el('text', { x: x + (c + 0.5) * cw, y: y + h + 26, class: 'am-t s', fill: PEOPLE[c] }, svg).textContent = `第${c + 1}人`;
    }
  }
  if (mode === 'rows') {
    for (let g = 0; g < n; g += 1) {
      el('text', { x: x + w + 12, y: y + rh * (1 + g * per + per / 2) + 7, class: 'am-t s start', fill: PEOPLE[g] }, svg).textContent = `第${g + 1}人`;
    }
  }
}

/* 第 3 页：分给 2 人，两种分法 */
function initPage3() {
  const svg = $('am3');
  const msg = $('msg3');
  const MSG = {
    none: '点左边的按钮试一试。',
    rows: '法一：4 格横条平均分成 2 份，每人 <b>2 格</b>，也就是 2 个 $\\dfrac15$ 升 $=\\dfrac25$ 升。',
    cols: '法二：从中间竖着切一刀，每人拿 $\\dfrac45$ 升的 $\\dfrac12$。整个 1 升被切成 <b>10 小格</b>，每人 4 小格，$\\dfrac4{10}=\\dfrac25$ 升。',
  };
  const show = (m) => {
    drawArea(svg, 2, m);
    msg.innerHTML = MSG[m];
    tex(msg);
  };
  document.querySelectorAll('[data-m3]').forEach((b) => b.addEventListener('click', () => show(b.dataset.m3)));
  show('none');
}

/* 第 5 页核心：人数滑块 + 两种分法 */
function initPage5() {
  const svg = $('am5');
  const st = { n: 3, mode: 'cols' };
  const render = () => {
    const { n } = st;
    const canRows = FULL % n === 0;
    const mode = st.mode === 'rows' && !canRows ? 'none' : st.mode;
    drawArea(svg, n, mode);
    $('n5v').textContent = n;
    document.querySelectorAll('[data-m5]').forEach((b) => b.classList.toggle('solid', b.dataset.m5 === st.mode));
    const msg = $('msg5');
    msg.className = 'tip feedback';
    if (st.mode === 'rows' && !canRows) {
      msg.classList.add('fb-warn');
      msg.innerHTML = `4 格横条<b>不能</b>平均分成 ${n} 份（$4\\div${n}$ 除不尽）！换“竖着切”试试。`;
      $('eq5').innerHTML = '';
    } else if (mode === 'rows') {
      msg.classList.add('fb-ok');
      msg.innerHTML = `4 格平均分成 ${n} 份，每人 <b>${FULL / n} 格</b>。`;
      $('eq5').innerHTML = `$\\dfrac45\\div${n}=\\dfrac{4\\div${n}}{5}=${texFrac(FULL / n, ROWS)}$（升）`;
    } else {
      msg.classList.add('fb-ok');
      msg.innerHTML = `竖着切成 ${n} 列，1 升被切成 $5\\times${n}=${5 * n}$ 个同样大的小格，每人 <b>4 小格</b>。`;
      $('eq5').innerHTML = `$\\dfrac45\\div${n}=\\dfrac45\\times\\dfrac1{${n}}=\\dfrac{4}{${5 * n}}${gcd(4, 5 * n) > 1 ? `=${texFrac(4, 5 * n)}` : ''}$（升）`;
    }
    tex(msg);
    tex($('eq5'));
  };
  $('n5').addEventListener('input', (e) => { st.n = +e.target.value; render(); });
  document.querySelectorAll('[data-m5]').forEach((b) => b.addEventListener('click', () => { st.mode = b.dataset.m5; render(); }));
  render();
}

/* 第 7 页：涂色表示 6/7，再平均分成 3 份 */
const P7 = { n: 7, want: 6, parts: 3, x: 40, y: 20, w: 440, h: 160 };
function initPage7() {
  const svg = $('paint7');
  const st = { on: new Set(), split: false };
  const render = () => {
    svg.innerHTML = '';
    const cw = P7.w / P7.n;
    const on = [...st.on].sort((a, b) => a - b);
    const per = P7.want / P7.parts;
    for (let i = 0; i < P7.n; i += 1) {
      const k = on.indexOf(i);
      let fill = '#fff';
      if (k >= 0) fill = st.split ? PEOPLE[Math.floor(k / per)] : '#8fd3f4';
      const r = el('rect', { x: P7.x + i * cw, y: P7.y, width: cw, height: P7.h, fill, stroke: LINE, 'stroke-width': 1.5, 'stroke-dasharray': '6 4', class: 'tap', 'data-i': i }, svg);
      r.style.cursor = 'pointer';
      if (st.split && k >= 0) el('text', { x: P7.x + (i + 0.5) * cw, y: P7.y + P7.h + 28, class: 'am-t s', fill }, svg).textContent = `第${Math.floor(k / per) + 1}份`;
    }
    el('rect', { x: P7.x, y: P7.y, width: P7.w, height: P7.h, fill: 'none', stroke: '#2a9fd6', 'stroke-width': 3 }, svg);
    $('c7').textContent = `已涂 ${st.on.size} 份`;
  };
  const say = (html, ok) => {
    const m = $('msg7');
    m.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
    m.innerHTML = html;
    tex(m);
  };
  svg.addEventListener('click', (e) => {
    const i = e.target.closest('[data-i]')?.dataset.i;
    if (i === undefined || st.split) return;
    const k = +i;
    if (st.on.has(k)) st.on.delete(k); else st.on.add(k);
    render();
  });
  $('split7').addEventListener('click', () => {
    if (st.on.size !== P7.want) { say(`$\\dfrac67$ 要涂 6 份，现在涂了 ${st.on.size} 份。`, false); return; }
    st.split = true;
    render();
    say('6 个 $\\dfrac17$ 平均分成 3 份，每份 <b>2 个</b> $\\dfrac17$，就是 $\\dfrac27$。', true);
  });
  $('reset7').addEventListener('click', () => {
    st.on.clear(); st.split = false; render();
    say('点长方形里的格子，涂出 $\\dfrac67$。', true);
  });
  render();
}

window.LESSON = {
  init() {
    initPage3();
    initPage5();
    initPage7();
    FracFig.exact();
  },
};
