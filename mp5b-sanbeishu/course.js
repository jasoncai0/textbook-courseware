'use strict';
/* 五下 3的倍数的特征 · 本课互动：例 5 百数表、计数器拨珠数珠、练一练点数、□ 里填数字。
 * 通用部分见 ../shared/math.js、mcheck.js、mnum.js */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const digitSum = (n) => [...String(n)].reduce((s, c) => s + +c, 0);
const is3 = (n) => n % 3 === 0;

/* ---------- 计数器（第 2 页小图、第 4 页） ---------- */
const BEAD = { H: 21, W: 64, COLORS: ['#4f9bd0', '#f09aba', '#7cc4a4'] }; // 个、十、百位的珠子颜色
function drawAbacus(svg, digits, g) {
  svg.innerHTML = '';
  svgEl('rect', { x: g.x0 - 40, y: g.base, width: g.gap * (digits.length - 1) + 80, height: 14, rx: 4, class: 'abc-base' }, svg);
  digits.forEach((d, i) => {
    const x = g.x0 + i * g.gap;
    const p = digits.length - 1 - i; // 0 = 个位
    svgEl('line', { x1: x, y1: g.base - g.rod, x2: x, y2: g.base, class: 'abc-rod' }, svg);
    for (let k = 0; k < d; k += 1) {
      svgEl('ellipse', { cx: x, cy: g.base - (k + 0.5) * g.h, rx: g.w / 2, ry: g.h / 2 - 1, fill: BEAD.COLORS[p], class: 'abc-bead' }, svg);
    }
    svgEl('text', { x, y: g.base + 40, class: 'abc-lb' }, svg).textContent = ['个', '十', '百'][p];
    if (g.showDigit) svgEl('text', { x, y: g.base + 72, class: 'abc-d' }, svg).textContent = d;
  });
}

function initMini() {
  drawAbacus(document.querySelector('.abc-mini'), [4, 2], { x0: 80, gap: 70, base: 72, rod: 66, h: 10, w: 34 });
}

function initAbacus() {
  const st = { d: [0, 4, 2] }; // 百、十、个
  const value = () => st.d[0] * 100 + st.d[1] * 10 + st.d[2];
  const render = () => {
    drawAbacus($('abc'), st.d, { x0: 100, gap: 110, base: 225, rod: 205, h: BEAD.H, w: BEAD.W, showDigit: true });
    const n = value();
    const s = st.d[0] + st.d[1] + st.d[2];
    $('abcRead').innerHTML = n
      ? `表示 <b class="n">${n}</b>，用了 ${st.d.filter(Boolean).join(' + ')} = <b class="${is3(s) ? 'ok' : 'no'}">${s}</b> 颗珠`
      : '拨一拨，表示一个数';
  };
  $('abcCtrl').addEventListener('click', (e) => {
    const b = e.target.closest('[data-p]');
    if (!b) return;
    const i = 2 - +b.dataset.p;
    const next = Math.min(9, Math.max(0, st.d[i] + +b.dataset.d));
    st.d = st.d.map((v, k) => (k === i ? next : v));
    render();
  });
  $('abcEg').addEventListener('click', (e) => {
    const b = e.target.closest('[data-v]');
    if (!b) return;
    const v = +b.dataset.v;
    st.d = [Math.floor(v / 100), Math.floor(v / 10) % 10, v % 10];
    render();
  });
  const seen = new Set();
  $('abcRec').addEventListener('click', () => {
    const n = value();
    if (!n || seen.has(n)) return;
    seen.add(n);
    const s = digitSum(n);
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${n}</td><td>${[...String(n)].filter((c) => c !== '0').join(' + ')} = ${s}</td><td class="${is3(n) ? 'ok' : 'no'}">${is3(n) ? `是（${n} ÷ 3 = ${n / 3}）` : `不是（${n} ÷ 3 = ${Math.floor(n / 3)}……${n % 3}）`}</td>`;
    $('abcTab').appendChild(tr);
  });
  render();
}

/* ---------- 第 3 页：百数表 ---------- */
function initHundred() {
  const t = MNum.table($('h3'), { from: 1, to: 100, cols: 10, tools: { o: is3 } });
  $('h3Auto').addEventListener('click', () => { t.clear('o'); t.auto('o', 50); });
  $('h3Col').addEventListener('click', () => t.hl((n) => n % 10 === 3));
  // 同一条斜线：十位数字 + 个位数字相同（12、21、30 和都是 3）
  let k = 0;
  const lines = [3, 6, 9, 12, 15, 18];
  $('h3Dia').addEventListener('click', () => {
    const s = lines[k % lines.length];
    k += 1;
    t.hl((n) => n < 100 && digitSum(n) === s);
    $('h3Dia').textContent = `看斜线（各位和 = ${s}）`;
  });
}

/* ---------- 第 6 页：练一练 1 ---------- */
function initPick1() {
  [29, 45, 51, 67, 86, 96].forEach((n) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = n;
    b.addEventListener('click', () => {
      const s = digitSum(n);
      b.className = is3(n) ? 'ok' : 'no';
      $('c1Msg').textContent = `${n}：${String(n)[0]} + ${String(n)[1]} = ${s}，${is3(s) ? '是' : '不是'} 3 的倍数，所以 ${n} ${is3(n) ? '是' : '不是'} 3 的倍数。`;
    });
    $('c1').appendChild(b);
  });
}

/* ---------- 第 7 页：□ 里填数字 ---------- */
const FILL = [
  { pat: '7□', lead: false },
  { pat: '□12', lead: true },
  { pat: '20□', lead: false },
  { pat: '3□5', lead: false },
];
function initFill() {
  FILL.forEach(({ pat, lead }) => {
    const ok = [];
    for (let d = lead ? 1 : 0; d <= 9; d += 1) if (is3(+pat.replace('□', d))) ok.push(d);
    const box = document.createElement('div');
    box.className = 'fill-box';
    box.innerHTML = `<p class="fill-pat">${pat.replace('□', '<span class="sq">□</span>')}</p><div class="fill-ds"></div><p class="fill-msg">找到 0 / ${ok.length} 种</p>`;
    const found = new Set();
    for (let d = 0; d <= 9; d += 1) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = d;
      b.addEventListener('click', () => {
        const sq = box.querySelector('.sq');
        sq.textContent = d;
        if (lead && d === 0) {
          b.className = 'no';
          box.querySelector('.fill-msg').textContent = '最高位不能是 0。';
          return;
        }
        const n = +pat.replace('□', d);
        const s = digitSum(n);
        b.className = is3(n) ? 'ok' : 'no';
        if (is3(n)) found.add(d);
        const tail = found.size === ok.length ? `　全部找到：${ok.join('、')}` : `　找到 ${found.size} / ${ok.length} 种`;
        box.querySelector('.fill-msg').textContent = `${n}：各位和 ${s}，${is3(n) ? '✓' : '✗'}${tail}`;
      });
      box.querySelector('.fill-ds').appendChild(b);
    }
    $('fill').appendChild(box);
  });
}

window.LESSON = {
  init() {
    initMini();
    initHundred();
    initAbacus();
    initPick1();
    initFill();
  },
};
