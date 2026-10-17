'use strict';
/* 六上 按比分配 · 本课互动：30 格涂色（实时显示红黄比）、分段线段图（总数按比分段，两种算法同步显示，可改各项或换题）、混凝土份数图。
 * 线段按份数精确等分，数值用分数精确计算。通用部分见 ../shared/math.js、mcheck.js、fracfig.js */
const { tex } = MathKit;
const { el, gcd } = FracFig;
const $ = (id) => document.getElementById(id);
const RED = '#e8574f';
const YELLOW = '#f6c443';
const GREEN = '#4cae6e';
const TERM_COLORS = [RED, YELLOW, GREEN];
const ftex = (n, d) => { const g = gcd(n, d); return d / g === 1 ? `${n / g}` : `\\dfrac{${n / g}}{${d / g}}`; };

/* ---------- 第 3 页：30 个方格涂色 ---------- */
const G3 = { cols: 6, rows: 5, s: 56, x: 42, y: 22, want: [3, 2] };
function initPage3() {
  const svg = $('grid3');
  const cells = Array(G3.cols * G3.rows).fill('w');
  let pen = 'r';
  const FILL = { r: RED, y: YELLOW, w: '#fff' };
  const render = () => {
    svg.innerHTML = '';
    cells.forEach((c, i) => {
      el('rect', { x: G3.x + (i % G3.cols) * G3.s, y: G3.y + Math.floor(i / G3.cols) * G3.s, width: G3.s, height: G3.s, fill: FILL[c], stroke: '#2a9fd6', 'stroke-width': 1.5, class: 'tap', 'data-i': i }, svg);
    });
    const r = cells.filter((c) => c === 'r').length;
    const y = cells.filter((c) => c === 'y').length;
    const w = cells.length - r - y;
    const g = gcd(r, y) || 1;
    $('cnt3').innerHTML = `红 <b>${r}</b> 格，黄 <b>${y}</b> 格${r && y ? `，红 : 黄 $=${r}:${y}${g > 1 ? `=${r / g}:${y / g}` : ''}$` : ''}`;
    const m = $('msg3');
    const ok = !w && r * G3.want[1] === y * G3.want[0];
    m.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
    if (w) m.innerHTML = `还有 ${w} 格没有涂。`;
    else m.innerHTML = ok ? '<b>✓ 涂对了！</b>红 18 格、黄 12 格，比是 $3:2$。' : '30 格都涂了，但红∶黄还不是 $3:2$，再调一调。';
    tex($('cnt3'));
    tex(m);
  };
  svg.addEventListener('click', (e) => {
    const i = e.target.closest('[data-i]')?.dataset.i;
    if (i === undefined) return;
    cells[+i] = pen;
    render();
  });
  document.querySelectorAll('[data-pen]').forEach((b) => b.addEventListener('click', () => {
    pen = b.dataset.pen;
    document.querySelectorAll('[data-pen]').forEach((x) => x.classList.toggle('solid', x === b));
  }));
  $('clear3').addEventListener('click', () => { cells.fill('w'); render(); });
  render();
}

/* ---------- 第 4 页：分段线段图 ---------- */
const PRESETS = [
  { name: '例 11', N: 30, unit: '格', terms: [3, 2, 0], names: ['红', '黄', '绿'] },
  { name: '想一想', N: 30, unit: '格', terms: [1, 2, 3], names: ['红', '黄', '绿'] },
  { name: '试一试', N: 72, unit: '棵', terms: [8, 7, 9], names: ['一组', '二组', '三组'] },
  { name: '练一练 1', N: 48, unit: '人', terms: [1, 3, 0], names: ['男生', '女生', '—'] },
  { name: '练习十 1', N: 32, unit: '块', terms: [3, 5, 0], names: ['黑色', '白色', '—'] },
];
const SEG = { x: 130, w: 800, y: 70, h: 44 };
const MAX_TERM = 9;
function initPage4() {
  const st = { p: 0, terms: [...PRESETS[0].terms] };
  const pre = $('presets4');
  PRESETS.forEach((P, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'btn'; b.dataset.p = i; b.textContent = P.name;
    pre.appendChild(b);
  });
  const stp = $('steppers4');
  [0, 1, 2].forEach((k) => {
    const d = document.createElement('div');
    d.className = 'stepper';
    d.innerHTML = `<span class="sw" style="background:${TERM_COLORS[k]}"></span><span data-nm="${k}"></span><button type="button" class="btn" data-t="${k}-">−</button><b data-v="${k}"></b><button type="button" class="btn" data-t="${k}+">＋</button>`;
    stp.appendChild(d);
  });
  const svg = $('seg4');
  const render = () => {
    const P = PRESETS[st.p];
    const T = st.terms;
    const S = T.reduce((a, b) => a + b, 0);
    const used = T.map((t, k) => ({ t, k })).filter((o) => o.t > 0);
    pre.querySelectorAll('button').forEach((b) => b.classList.toggle('solid', +b.dataset.p === st.p));
    stp.querySelectorAll('[data-nm]').forEach((s) => { s.textContent = P.names[+s.dataset.nm]; });
    stp.querySelectorAll('[data-v]').forEach((s) => { s.textContent = T[+s.dataset.v]; });
    svg.innerHTML = '';
    const pw = SEG.w / S;
    let at = 0;
    const lab = (x, y, text, cls) => { el('text', { x, y, class: `bt ${cls || ''}` }, svg).textContent = text; };
    el('text', { x: SEG.x - 14, y: SEG.y + SEG.h / 2 + 8, class: 'bt end' }, svg).textContent = `${P.N} ${P.unit}`;
    used.forEach(({ t, k }) => {
      el('rect', { x: SEG.x + at * pw, y: SEG.y, width: t * pw, height: SEG.h, fill: TERM_COLORS[k] }, svg);
      const x0 = SEG.x + at * pw;
      const x1 = x0 + t * pw;
      const m = (x0 + x1) / 2;
      el('path', { d: `M${x0 + 2} ${SEG.y + SEG.h + 8}q0 10 10 10H${m - 10}q10 0 10 10q0 -10 10 -10H${x1 - 12}q10 0 10 -10`, fill: 'none', stroke: TERM_COLORS[k], 'stroke-width': 2.5 }, svg);
      lab(m, SEG.y + SEG.h + 52, `${P.names[k]} ${t} 份`, 's');
      lab(m, SEG.y + SEG.h + 78, `${P.N * t % S === 0 ? P.N * t / S : `${P.N * t / gcd(P.N * t, S)}/${S / gcd(P.N * t, S)}`} ${P.unit}`, 'hot');
      at += t;
    });
    for (let i = 1; i < S; i += 1) el('line', { x1: SEG.x + i * pw, x2: SEG.x + i * pw, y1: SEG.y, y2: SEG.y + SEG.h, stroke: '#fff', 'stroke-width': 2 }, svg);
    el('rect', { x: SEG.x, y: SEG.y, width: SEG.w, height: SEG.h, fill: 'none', stroke: '#2a4256', 'stroke-width': 2.5 }, svg);
    el('path', { d: `M${SEG.x} ${SEG.y - 8}q0 -10 12 -10H${SEG.x + SEG.w / 2 - 12}q12 0 12 -10q0 10 12 10H${SEG.x + SEG.w - 12}q12 0 12 10`, fill: 'none', stroke: '#1d6fa5', 'stroke-width': 2.5 }, svg);
    lab(SEG.x + SEG.w / 2, SEG.y - 36, `一共 ${P.N} ${P.unit}，平均分成 ${used.map((o) => o.t).join(' + ')} = ${S} 份`, '');
    const per = ftex(P.N, S);
    $('m1').innerHTML = `<b>先求一份：</b>$${P.N}\\div${S}=${per}$<br>${used.map(({ t, k }) => `${P.names[k]} $${per}\\times${t}=${ftex(P.N * t, S)}$`).join('；')}`;
    $('m2').innerHTML = `<b>求几分之几：</b><br>${used.map(({ t, k }) => `${P.names[k]} $${P.N}\\times\\dfrac{${t}}{${S}}=${ftex(P.N * t, S)}$`).join('；')}`;
    tex($('m1'));
    tex($('m2'));
  };
  pre.addEventListener('click', (e) => {
    const b = e.target.closest('[data-p]');
    if (!b) return;
    st.p = +b.dataset.p;
    st.terms = [...PRESETS[st.p].terms];
    render();
  });
  stp.addEventListener('click', (e) => {
    const t = e.target.closest('[data-t]')?.dataset.t;
    if (!t) return;
    const k = +t[0];
    const min = k < 2 ? 1 : 0;
    st.terms = st.terms.map((v, i) => (i === k ? Math.min(MAX_TERM, Math.max(min, v + (t[2] === '+' ? 1 : -1))) : v));
    render();
  });
  render();
}

/* ---------- 第 10 页：混凝土份数图（每小段一样长） ---------- */
const MIX = [['水泥', 2], ['黄沙', 3], ['石子', 5]];
function initPage10() {
  const svg = $('mix10');
  const u = 76;
  MIX.forEach(([name, n], i) => {
    const y = 15 + i * 52;
    el('text', { x: 70, y: y + 25, class: 'bt s end' }, svg).textContent = name;
    for (let j = 0; j < n; j += 1) el('rect', { x: 85 + j * u, y, width: u, height: 32, fill: '#bde3f6', stroke: '#2a9fd6', 'stroke-width': 2 }, svg);
  });
}

window.LESSON = {
  init() {
    initPage3();
    initPage4();
    initPage10();
    FracFig.exact();
  },
};
