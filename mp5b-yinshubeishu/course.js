'use strict';
/* 五下 因数和倍数 · 本课互动：例 1 用 12 个正方形拼长方形、例 2 一对一对找 36 的因数、例 3 数轴跳出倍数、练习五数表。
 * 通用部分见 ../shared/math.js、mcheck.js、mnum.js */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};

/* ---------- 第 2 页：两张小图（点阵、面积单位） ---------- */
function initRecall() {
  const dots = document.querySelector('.recall .dots');
  for (let r = 0; r < 3; r += 1) for (let c = 0; c < 4; c += 1) svgEl('circle', { cx: 60 + c * 40, cy: 22 + r * 33, r: 11, fill: '#4f9bd0' }, dots);
  const sqs = document.querySelector('.recall .sqs');
  for (let r = 0; r < 2; r += 1) for (let c = 0; c < 5; c += 1) svgEl('rect', { x: 45 + c * 30, y: 25 + r * 30, width: 30, height: 30, fill: '#e3f1fb', stroke: '#1d6fa5', 'stroke-width': 2 }, sqs);
}

/* ---------- 第 3 页：12 个正方形拼长方形 ---------- */
const PIN = { N: 12, W: 640, H: 330, MAXU: 78 };
function initPin() {
  const fig = $('pinFig');
  const st = { k: 4, found: new Set() };
  const draw = () => {
    const { N, W, H } = PIN;
    const full = Math.floor(N / st.k);
    const rest = N % st.k;
    const rows = full + (rest ? 1 : 0);
    const u = Math.min(PIN.MAXU, (W - 40) / st.k, (H - 70) / rows);
    const x0 = (W - st.k * u) / 2;
    const y0 = (H - 40 - rows * u) / 2;
    fig.innerHTML = '';
    for (let i = 0; i < N; i += 1) {
      const r = Math.floor(i / st.k);
      const c = i % st.k;
      svgEl('rect', { x: x0 + c * u, y: y0 + r * u, width: u, height: u, class: `pin-sq ${rest && r === full ? 'odd' : ''}` }, fig);
    }
    // 摆不满的最后一排：缺的格子画成红色虚线
    for (let c = rest; rest && c < st.k; c += 1) svgEl('rect', { x: x0 + c * u, y: y0 + full * u, width: u, height: u, class: 'pin-miss' }, fig);
    const cap = svgEl('text', { x: W / 2, y: H - 10, class: `pin-cap ${rest ? 'no' : 'ok'}` }, fig);
    if (rest) {
      cap.textContent = `12 ÷ ${st.k} = ${full}……${rest}　最后一排摆不满`;
      $('pinMsg').textContent = `每排 ${st.k} 个，摆了 ${full} 排还剩 ${rest} 个，拼不成长方形。`;
      $('pinMsg').className = 'tip feedback fb-warn';
    } else {
      cap.textContent = `每排 ${st.k} 个，摆 ${full} 排：${st.k} × ${full} = 12`;
      $('pinMsg').textContent = `拼成了！每排 ${st.k} 个，摆了 ${full} 排。`;
      $('pinMsg').className = 'tip feedback fb-ok';
      st.found.add(Math.max(st.k, full)); // 转个身是同一个长方形：按“长边每排”记
      const list = [...st.found].sort((a, b) => a - b).map((a) => `${a} × ${12 / a} = 12`);
      $('pinFound').textContent = list.join('　');
      $('pinFound').classList.remove('muted');
    }
    $('pinK').textContent = st.k;
  };
  $('pinMinus').addEventListener('click', () => { st.k = Math.max(1, st.k - 1); draw(); });
  $('pinPlus').addEventListener('click', () => { st.k = Math.min(PIN.N, st.k + 1); draw(); });
  draw();
}

/* ---------- 第 5 页：一对一对找 36 的因数 ---------- */
const PAIR = { N: 36, W: 640, LINE: 170 };
function initPair() {
  const fig = $('pairFig');
  const log = $('pairLog');
  const all = MNum.factors(PAIR.N); // 9 个因数，按从小到大排好位置
  const xOf = (f) => 40 + (all.indexOf(f) * (PAIR.W - 80)) / (all.length - 1);
  const st = { i: 0, done: false };
  const reset = () => {
    Object.assign(st, { i: 0, done: false });
    log.innerHTML = '';
    fig.innerHTML = '';
    svgEl('line', { x1: 20, y1: PAIR.LINE + 22, x2: PAIR.W - 20, y2: PAIR.LINE + 22, class: 'pair-base' }, fig);
    $('pairMsg').textContent = '';
    $('pairNext').disabled = false;
  };
  const put = (f, cls) => {
    svgEl('circle', { cx: xOf(f), cy: PAIR.LINE, r: 21, class: `pair-dot ${cls}` }, fig);
    svgEl('text', { x: xOf(f), y: PAIR.LINE + 8, class: 'pair-num' }, fig).textContent = f;
  };
  const next = () => {
    if (st.done) return;
    st.i += 1;
    const { i } = st;
    const q = Math.floor(PAIR.N / i);
    const r = PAIR.N % i;
    const li = document.createElement('li');
    if (r) {
      li.className = 'no';
      li.textContent = `36 ÷ ${i} = ${q}……${r}　${i} 不是 36 的因数`;
    } else {
      li.textContent = i === q ? `36 ÷ ${i} = ${q}　${i} × ${q} = 36（碰头了）` : `36 ÷ ${i} = ${q}　一对：${i} 和 ${q}`;
      put(i, 'small');
      if (q !== i) {
        put(q, 'big');
        const [a, b] = [xOf(i), xOf(q)];
        const h = ((b - a) / (PAIR.W - 80)) * 175; // 最外层弧顶约在图顶
        svgEl('path', { d: `M${a} ${PAIR.LINE - 24}C${a} ${PAIR.LINE - 24 - h} ${b} ${PAIR.LINE - 24 - h} ${b} ${PAIR.LINE - 24}`, class: 'pair-arc' }, fig);
      }
    }
    log.appendChild(li);
    if (i * i >= PAIR.N) {
      st.done = true;
      $('pairNext').disabled = true;
      $('pairMsg').textContent = '6 × 6 碰头了，再往下试就重复了。找完！';
    }
  };
  $('pairNext').addEventListener('click', next);
  $('pairReset').addEventListener('click', reset);
  reset();
}

/* ---------- 第 7 页：数轴上跳出倍数 ---------- */
const JUMP = { X0: 30, U: 23.5, MAX: 40, Y: 105 };
function initJump() {
  const fig = $('jumpFig');
  const st = { s: 3, at: 0, timer: null };
  const X = (n) => JUMP.X0 + n * JUMP.U;
  const base = () => {
    fig.innerHTML = '';
    svgEl('line', { x1: X(0) - 10, y1: JUMP.Y, x2: X(JUMP.MAX) + 18, y2: JUMP.Y, class: 'nl-axis' }, fig);
    svgEl('path', { d: `M${X(JUMP.MAX) + 18} ${JUMP.Y}l-12 -6v12z`, class: 'nl-head' }, fig);
    for (let n = 0; n <= JUMP.MAX; n += 1) {
      svgEl('line', { x1: X(n), y1: JUMP.Y - 6, x2: X(n), y2: JUMP.Y + 6, class: 'nl-tick' }, fig);
      svgEl('text', { x: X(n), y: JUMP.Y + 30, class: `nl-num n${n}` }, fig).textContent = n;
    }
  };
  const list = () => {
    const xs = [];
    for (let n = st.s; n <= st.at; n += st.s) xs.push(n);
    $('jumpList').textContent = xs.length ? `${xs.join('，')}${st.at + st.s > JUMP.MAX ? '，……' : ''}` : '';
  };
  const hop = () => {
    const to = st.at + st.s;
    if (to > JUMP.MAX) { clearInterval(st.timer); st.timer = null; return false; }
    const [a, b] = [X(st.at), X(to)];
    svgEl('path', { d: `M${a} ${JUMP.Y - 8}Q${(a + b) / 2} ${JUMP.Y - 8 - st.s * 13} ${b} ${JUMP.Y - 8}`, class: 'nl-hop' }, fig);
    svgEl('circle', { cx: b, cy: JUMP.Y, r: 7, class: 'nl-land' }, fig);
    fig.querySelector(`.n${to}`).classList.add('on');
    st.at = to;
    list();
    return true;
  };
  const setStep = (s) => {
    clearInterval(st.timer);
    Object.assign(st, { s, at: 0, timer: null });
    $('jumpS').textContent = s;
    $('jumpName').textContent = s;
    base();
    list();
  };
  $('jumpStep').addEventListener('click', (e) => {
    const b = e.target.closest('[data-s]');
    if (!b) return;
    $('jumpStep').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    setStep(+b.dataset.s);
  });
  $('jumpGo').addEventListener('click', hop);
  $('jumpAll').addEventListener('click', () => {
    if (st.timer) return;
    st.timer = setInterval(hop, 260);
  });
  setStep(3);
}

/* ---------- 第 10 页：练习五第 4 题 1～24 数表 ---------- */
function initT6() {
  const t = MNum.table($('t6'), {
    from: 1, to: 24, cols: 12,
    tools: { t: (n) => 6 % n === 0, o: (n) => n % 6 === 0 },
  });
  MNum.tools($('t6Tools'), t);
  $('t6Auto').addEventListener('click', () => { t.clear('t'); t.clear('o'); t.auto('t', 120); t.auto('o', 120); });
}

window.LESSON = {
  init() {
    initRecall();
    initPin();
    initPair();
    initJump();
    initT6();
  },
};
