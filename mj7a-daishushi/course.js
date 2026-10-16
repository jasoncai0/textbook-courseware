'use strict';
/* 七上 3.2 代数式 · 本课互动：月历 2×2 方框（a 可放在任意一格，式子与真实日期同步核对）、行李费计算、单项式/多项式分类；
 * 练一练第 2 题与图 3-4 用坐标精确绘制。 */
const { slider, tex, fmt } = MathKit;
const $ = (id) => document.getElementById(id);

/* 第 3 页：月历（31 天，1 日是星期三，与课本章首图一致） */
const FIRST_COL = 3;
const DAYS = 31;
const POS = [['tr', '右上角（课本）'], ['tl', '左上角'], ['bl', '左下角'], ['br', '右下角']];
const OFF = { tl: 0, tr: 1, bl: 7, br: 8 }; // 方框里各格相对左上角的日期差
const dayAt = (r, c) => { const d = r * 7 + c - FIRST_COL + 1; return d >= 1 && d <= DAYS ? d : null; };
const term = (k) => (k === 0 ? 'a' : k > 0 ? `a+${k}` : `a-${-k}`);

function initCalendar() {
  const s = { tl: 13, pos: 'tr' };
  const ok = (d) => d >= 1 && rc(d)[1] <= 5 && d + 8 <= DAYS;
  function rc(d) { const i = d - 1 + FIRST_COL; return [Math.floor(i / 7), i % 7]; }
  $('calPos').innerHTML = POS.map(([k, t]) => `<button class="btn ${k === s.pos ? 'solid' : ''}" type="button" data-p="${k}">$a$ 在${t}</button>`).join('');
  tex($('calPos'));
  const draw = () => {
    const inFrame = (d) => d && [0, 1, 7, 8].includes(d - s.tl);
    const head = ['日', '一', '二', '三', '四', '五', '六'].map((w) => `<b class="wk">${w}</b>`).join('');
    let cells = '';
    for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) {
      const d = dayAt(r, c);
      const isA = d && d - s.tl === OFF[s.pos];
      cells += `<button type="button" class="day ${d ? '' : 'empty'} ${inFrame(d) ? 'in' : ''} ${isA ? 'a' : ''}" ${d ? `data-d="${d}"` : 'disabled'}>${d || ''}</button>`;
    }
    $('cal').innerHTML = head + cells;
    const aDay = s.tl + OFF[s.pos];
    $('calFrame').innerHTML = ['tl', 'tr', 'bl', 'br'].map((k) => {
      const v = s.tl + OFF[k];
      return `<div class="f4 ${k === s.pos ? 'a' : ''}"><span>$${term(v - aDay)}$</span><small>${v} 日</small></div>`;
    }).join('');
    tex($('calFrame'));
    const m = $('calMsg');
    m.className = 'tip feedback fb-ok';
    m.innerHTML = `这里 $a=${aDay}$：${['tl', 'tr', 'bl', 'br'].filter((k) => k !== s.pos).map((k) => { const v = s.tl + OFF[k]; return `$${term(v - aDay).replace('a', `${aDay}`)}=${v}$`; }).join('，')}，都对 ✓`;
    tex(m);
  };
  $('cal').addEventListener('click', (e) => {
    const b = e.target.closest('[data-d]');
    if (!b) return;
    const d = +b.dataset.d;
    // 点到最右列或最后一行时，方框往左 / 往上挪，保证 4 个日期都在月历里
    let tl = rc(d)[1] === 6 ? d - 1 : d;
    while (tl + 8 > DAYS) tl -= 7;
    if (ok(tl)) { s.tl = tl; draw(); }
  });
  $('calPos').addEventListener('click', (e) => {
    const b = e.target.closest('[data-p]');
    if (!b) return;
    s.pos = b.dataset.p;
    $('calPos').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    draw();
  });
  draw();
}

/* 第 4 页：行李费 0.015m(n − 20)，票价来自课本“南京始发航班公布票价表” */
const FARES = [['北京', 1010], ['广州', 1180], ['重庆', 1280], ['长春', 1460], ['天津', 880]];
function initFee() {
  const s = { i: 0, n: 30 };
  const fee = (m, n) => Math.round(0.015 * m * (n - 20) * 100) / 100; // 结果保留到分，避免浮点尾数
  const draw = () => {
    $('fareTab').innerHTML = `<tr><th>到达站</th>${FARES.map(([c], i) => `<td class="city ${i === s.i ? 'on' : ''}" data-i="${i}">${c}</td>`).join('')}</tr>`
      + `<tr><th>票价/元</th>${FARES.map(([, m], i) => `<td class="${i === s.i ? 'on' : ''}">${m}</td>`).join('')}</tr>`
      + `<tr><th>行李费/元</th>${FARES.map(([, m], i) => `<td class="${i === s.i ? 'on' : ''}">${fmt(fee(m, s.n))}</td>`).join('')}</tr>`;
    $('kgV').textContent = `${s.n} kg`;
    const [c, m] = FARES[s.i];
    $('feeEq').innerHTML = `到${c}：$0.015m(n-20)=0.015\\times${m}\\times(${s.n}-20)=${fmt(fee(m, s.n))}$（元）`;
    tex($('feeEq'));
  };
  $('fareTab').addEventListener('click', (e) => { const td = e.target.closest('[data-i]'); if (td) { s.i = +td.dataset.i; draw(); } });
  $('fareTab').setAttribute('data-noswipe', '');
  slider($('kg'), (v) => { s.n = v; draw(); });
}

/* 练一练第 2 题：长方形 a×b（a = 2.2b），左下角、右上角为圆心的四分之一圆，半径 b */
function drawArcs() {
  const B = 115;
  const A = 2.2 * B;
  const x0 = 20;
  const y0 = 12;
  const x1 = x0 + A;
  const y1 = y0 + B;
  const shade = `M${x0} ${y0} L${x1 - B} ${y0} A${B} ${B} 0 0 0 ${x1} ${y1} L${x0 + B} ${y1} A${B} ${B} 0 0 0 ${x0} ${y0} Z`;
  $('arcFig').innerHTML = `<defs><pattern id="h2" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="#1f2d3a" stroke-width="1.2"/></pattern></defs>`
    + `<path d="${shade}" fill="url(#h2)" stroke="#1f2d3a" stroke-width="2"/>`
    + `<rect x="${x0}" y="${y0}" width="${A}" height="${B}" fill="none" stroke="#1f2d3a" stroke-width="2"/>`
    + `<text x="${x0 + A / 2}" y="${y1 + 20}" class="fl" text-anchor="middle">a</text><text x="${x1 + 8}" y="${y0 + B / 2 + 6}" class="fl">b</text>`;
}

/* 图 3-4：环形地块（外圆 R、内圆 r）与长方形地块 a×b */
function drawLawn() {
  $('lawnFig').innerHTML = '<path d="M95 0 V30 A80 80 0 1 0 125 30 V0 M95 300 V250 H25 V160 H95 V150 M125 150 V160 H195 V250 H125 V300" fill="none" stroke="#1f2d3a" stroke-width="2"/>'
    + '<circle cx="110" cy="90" r="58" fill="#a8d5a2" stroke="#1f2d3a" stroke-width="2"/><circle cx="110" cy="90" r="22" fill="#fff" stroke="#1f2d3a" stroke-width="2"/>'
    + '<rect x="50" y="178" width="120" height="54" fill="#a8d5a2" stroke="#1f2d3a" stroke-width="2"/>'
    + '<line x1="110" y1="90" x2="151" y2="49" stroke="#1d6fa5" stroke-width="2"/><text x="136" y="62" class="fl">R</text>'
    + '<line x1="110" y1="90" x2="88" y2="90" stroke="#d9711c" stroke-width="2"/><text x="92" y="84" class="fl s">r</text>'
    + '<text x="104" y="250" class="fl">a</text><text x="176" y="210" class="fl">b</text>';
}

/* 第 11 页：分类卡片 */
const CARDS = [
  ['-5', 'd', '单独一个数也是单项式。'],
  ['a', 'd', '单独一个字母也是单项式。'],
  ['0.55a+0.35b', 'p', '两个单项式的和：二项式。'],
  ['\\dfrac x2-\\dfrac y3', 'p', '$\\dfrac x2=\\dfrac12x$ 是单项式，两项相减：多项式。'],
  ['\\dfrac{s}{50}', 'd', '$=\\dfrac1{50}s$，分母是数，仍是单项式。'],
  ['\\dfrac st', 'n', '分母里有字母，不是数与字母的积：既不是单项式也不是多项式（不是整式）。'],
  ['\\pi r^2', 'd', '$\\pi$ 是数：系数 $\\pi$，次数 2。'],
  ['n-2', 'p', '$n$ 与 $-2$ 两项：二项式。'],
];
function initSort() {
  $('sortGrid').innerHTML = CARDS.map(([e, k, why]) => `<div class="scard"><p class="se">$${e}$</p><div class="pick" data-ans="${k}"><button data-k="d">单项式</button><button data-k="p">多项式</button><button data-k="n">都不是</button><p class="pick-why">${why}</p></div></div>`).join('');
  tex($('sortGrid'));
  window.MCheck.init($('sortGrid'));
}

window.LESSON = {
  init() {
    initCalendar();
    initFee();
    drawArcs();
    drawLawn();
    initSort();
  },
};
