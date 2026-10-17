'use strict';
/* 五下 公倍数和最小公倍数 · 本课互动：例 11 长方形纸片铺正方形、例 12 维恩图、两只青蛙在数轴上跳、练一练数表、公交发车时刻表。
 * 通用部分见 ../shared/math.js、mcheck.js、mnum.js */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const divLine = (a, k) => (a % k ? `${a} ÷ ${k} = ${Math.floor(a / k)}……${a % k}` : `${a} ÷ ${k} = ${a / k}`);

/* ---------- 第 3 页：3×2 的纸片（横放）铺边长 k 的正方形，按真实比例 ---------- */
const RK = { PW: 3, PH: 2, X0: 20, Y0: 20, M: 400 };
function initRect() {
  const svg = $('rkFig');
  const got = new Set();
  const show = (k, record) => {
    const s = RK.M / k;
    svg.innerHTML = '';
    const pat = svgEl('pattern', { id: 'rkH', width: 10, height: 10, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, svgEl('defs', {}, svg));
    svgEl('line', { x1: 0, y1: 0, x2: 0, y2: 10, stroke: '#c0392b', 'stroke-width': 3 }, pat);
    const cols = Math.floor(k / RK.PW);
    const rows = Math.floor(k / RK.PH);
    for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) {
      svgEl('rect', { x: RK.X0 + c * RK.PW * s, y: RK.Y0 + r * RK.PH * s, width: RK.PW * s, height: RK.PH * s, class: `rk-p ${(r + c) % 2 ? 'b' : ''}` }, svg);
    }
    if (k % RK.PW) svgEl('rect', { x: RK.X0 + cols * RK.PW * s, y: RK.Y0, width: (k % RK.PW) * s, height: k * s, fill: 'url(#rkH)', class: 'rk-left' }, svg);
    if (k % RK.PH) svgEl('rect', { x: RK.X0, y: RK.Y0 + rows * RK.PH * s, width: cols * RK.PW * s, height: (k % RK.PH) * s, fill: 'url(#rkH)', class: 'rk-left' }, svg);
    svgEl('rect', { x: RK.X0, y: RK.Y0, width: RK.M, height: RK.M, class: 'rk-out' }, svg);
    svgEl('text', { x: RK.X0 + RK.M / 2, y: RK.Y0 + RK.M + 34, class: 'rk-dim' }, svg).textContent = `边长 ${k} 厘米`;
    const ok = k % RK.PW === 0 && k % RK.PH === 0;
    $('rkCalc').innerHTML = `<p>横着：${divLine(k, RK.PW)}</p><p>竖着：${divLine(k, RK.PH)}</p><p class="${ok ? 'ok' : 'no'}">${ok ? `正好铺满！用了 ${cols * rows} 张` : '有余数，铺不满（红色斜线部分）'}</p>`;
    $('rkK').querySelectorAll('button').forEach((b) => b.classList.toggle('solid', +b.dataset.k === k));
    if (ok && record) {
      got.add(k);
      $('rkFound').textContent = [...got].sort((a, b) => a - b).map((v) => `${v} 厘米`).join('、');
      $('rkFound').classList.remove('muted');
    }
  };
  for (let k = 4; k <= 24; k += 1) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn';
    b.dataset.k = k;
    b.textContent = k;
    b.addEventListener('click', () => show(k, true));
    $('rkK').appendChild(b);
  }
  show(6, false);
}

/* ---------- 第 5 页：维恩图 ---------- */
function initVenn() {
  const MAX = 54;
  const nums = [];
  for (let n = 1; n <= MAX; n += 1) if (n % 6 === 0 || n % 9 === 0) nums.push(n);
  const v = MNum.venn($('vn12'), { la: '6 的倍数', lb: '9 的倍数', mid: '6 和 9 的公倍数', nums, inA: (n) => n % 6 === 0, inB: (n) => n % 9 === 0, more: true });
  $('vn12Fill').addEventListener('click', () => v.fill());
}

/* ---------- 第 6 页：两只青蛙在数轴上跳 ---------- */
const FG = { MAX: 72, X0: 30, Y: 118 };
FG.U = (1000 - 2 * FG.X0) / FG.MAX;
function initFrogs() {
  const svg = $('fgFig');
  const st = { a: 6, b: 9, ia: 0, ib: 0, timer: null, met: [] };
  const X = (n) => FG.X0 + n * FG.U;
  const base = () => {
    svg.innerHTML = '';
    svgEl('line', { x1: X(0) - 8, y1: FG.Y, x2: X(FG.MAX) + 16, y2: FG.Y, class: 'nl-axis' }, svg);
    for (let n = 0; n <= FG.MAX; n += 1) svgEl('line', { x1: X(n), y1: FG.Y - (n % 10 ? 4 : 8), x2: X(n), y2: FG.Y + (n % 10 ? 4 : 8), class: 'nl-tick' }, svg);
    svgEl('text', { x: 6, y: 30, class: 'fg-lb a' }, svg).textContent = `每次跳 ${st.a} 格`;
    svgEl('text', { x: 6, y: 220, class: 'fg-lb b' }, svg).textContent = `每次跳 ${st.b} 格`;
    svgEl('text', { x: X(0), y: FG.Y + 30, class: 'fg-n' }, svg).textContent = '0';
  };
  const hop = (step, i, up) => {
    const [from, to] = [step * i, step * (i + 1)];
    if (to > FG.MAX) return false;
    const h = Math.min(70, 18 + step * 5) * (up ? -1 : 1);
    svgEl('path', { d: `M${X(from)} ${FG.Y}Q${(X(from) + X(to)) / 2} ${FG.Y + 2 * h} ${X(to)} ${FG.Y}`, class: `fg-hop ${up ? 'a' : 'b'}` }, svg);
    svgEl('circle', { cx: X(to), cy: FG.Y, r: 5, class: `fg-dot ${up ? 'a' : 'b'}` }, svg);
    svgEl('text', { x: X(to), y: up ? FG.Y - 12 : FG.Y + 30, class: `fg-n ${up ? 'a' : 'b'}` }, svg).textContent = to;
    return true;
  };
  const check = () => {
    const meet = [];
    for (let n = st.a; n <= Math.min(st.a * st.ia, st.b * st.ib); n += st.a) if (n % st.b === 0) meet.push(n);
    meet.filter((n) => !st.met.includes(n)).forEach((n) => {
      svgEl('circle', { cx: X(n), cy: FG.Y, r: 13, class: 'fg-meet' }, svg);
      st.met.push(n);
    });
    if (st.met.length) {
      $('fgMsg').innerHTML = `一起落到：<b>${st.met.join('，')}</b>，……　第一次一起落到 <b class="lcm">${st.met[0]}</b>，${st.a} 和 ${st.b} 的最小公倍数是 ${st.met[0]}。`;
    }
  };
  const reset = () => {
    clearInterval(st.timer);
    Object.assign(st, { ia: 0, ib: 0, timer: null, met: [] });
    base();
    $('fgMsg').textContent = `${st.a} 和 ${st.b} 的公倍数在哪儿？点“一起跳”。`;
  };
  const tick = () => {
    const ma = hop(st.a, st.ia, true);
    if (ma) st.ia += 1;
    const mb = hop(st.b, st.ib, false);
    if (mb) st.ib += 1;
    check();
    if (!ma && !mb) {
      clearInterval(st.timer);
      st.timer = null;
      if (st.met.length) $('fgMsg').innerHTML += `　（验证：${st.met[0]} = ${st.a} × ${st.met[0] / st.a} = ${st.b} × ${st.met[0] / st.b}）`;
    }
  };
  $('fgGo').addEventListener('click', () => {
    if (st.timer) return;
    reset();
    st.timer = setInterval(tick, 380);
  });
  $('fgPair').addEventListener('click', (e) => {
    const b = e.target.closest('[data-a]');
    if (!b) return;
    $('fgPair').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    st.a = +b.dataset.a;
    st.b = +b.dataset.b;
    reset();
  });
  reset();
}

/* ---------- 第 7 页：练一练 1 ---------- */
function initT25() {
  const t = MNum.table($('t25'), { from: 1, to: 30, cols: 15, tools: { t: (n) => n % 2 === 0, o: (n) => n % 5 === 0 } });
  MNum.tools($('t25Tools'), t);
  $('t25Auto').addEventListener('click', () => { t.clear('t'); t.clear('o'); t.auto('t', 80); t.auto('o', 80); });
}

/* ---------- 第 9 页：公交发车时刻表 ---------- */
const BUS = { A: 6, B: 8, MAXK: 8, LAST: 48 }; // 到第三次同时发车 7:48 为止
function initBus() {
  const rows = $('busTab').rows;
  const st = { k: 0 };
  const fmt = (m) => `7:${String(m).padStart(2, '0')}`;
  const render = () => {
    [...rows].forEach((r) => { while (r.cells.length > 1) r.deleteCell(1); });
    const upTo = (step) => Array.from({ length: st.k + 1 }, (_, i) => i * step).filter((m) => m <= BUS.LAST);
    const ta = upTo(BUS.A);
    const tb = upTo(BUS.B);
    [[rows[0], ta, tb], [rows[1], tb, ta]].forEach(([r, own, other]) => own.forEach((m) => {
      const c = r.insertCell();
      c.textContent = fmt(m);
      if (other.includes(m)) c.className = 'same';
    }));
    $('busNext').disabled = st.k >= BUS.MAXK;
  };
  $('busNext').addEventListener('click', () => { st.k += 1; render(); });
  $('busReset').addEventListener('click', () => { st.k = 0; render(); });
  st.k = 1;
  render();
}

window.LESSON = {
  init() {
    initRect();
    initVenn();
    initFrogs();
    initT25();
    initBus();
  },
};
