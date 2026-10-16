'use strict';
/* 七下 12.3 互逆命题 · 本课互动：交换机（条件卡 ⇄ 结论卡，判断原命题与逆命题真假）、反例猎手（锐角+钝角、a²=b²）、
 * 到线段两端距离相等的点、费马数（精确整数运算）、图 12-10、例 2 拖动 C、练一练图。通用部分见 ../shared/math.js、mgeo.js、mproof.js。 */
const { tex, fmt } = MathKit;
const { add, sub, mul, dir, ang, angle, line, arc, right, sketch } = Geo;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/* ---------- 第 5 页：交换机 ---------- */
const SW = [
  { no: '例', orig: '同位角相等，两直线平行', c: '同位角相等', r: '两直线平行', conv: '两直线平行，同位角相等',
    t1: true, w1: '基本事实（7.1）．', t2: true, w2: '平行线的性质（7.2）．' },
  { no: '(1)', orig: '如果 $a^2=b^2$，那么 $a=b$', c: '$a^2=b^2$', r: '$a=b$', conv: '如果 $a=b$，那么 $a^2=b^2$',
    t1: false, w1: '反例：$a=2$，$b=-2$．', t2: true, w2: '相等的两个数，平方也相等．' },
  { no: '(2)', orig: '如果两个角是对顶角，那么它们的平分线组成一个平角', c: '两个角是对顶角', r: '它们的平分线组成一个平角', conv: '如果两个角的平分线组成一个平角，那么这两个角是对顶角',
    t1: true, w1: '对顶角的两边互为反向延长线，两个角相等，它们的平分线也互为反向延长线．', t2: false, w2: '反例：$60^\\circ$ 的角与 $80^\\circ$ 的角，平分线方向相反（组成平角），但两个角不相等，不是对顶角．' },
  { no: '(3)', orig: '末位数字是 5 的数，能被 5 整除', c: '一个数的末位数字是 5', r: '这个数能被 5 整除', conv: '如果一个数能被 5 整除，那么它的末位数字是 5',
    t1: true, w1: '末位是 5 的数 = 10 的倍数 + 5，能被 5 整除．', t2: false, w2: '反例：10 能被 5 整除，末位数字是 0．' },
  { no: '(4)', orig: '锐角与钝角互为补角', c: '两个角一个是锐角、一个是钝角', r: '这两个角互为补角', conv: '如果两个角互为补角，那么它们一个是锐角、一个是钝角',
    t1: false, w1: '反例：$30^\\circ$ 与 $120^\\circ$ 的和是 $150^\\circ$．', t2: false, w2: '反例：$90^\\circ$ 与 $90^\\circ$ 互补，但都是直角．' },
];

function initSwapper() {
  const host = $('sw');
  host.setAttribute('data-noswipe', '');
  const st = { i: 0, swapped: false, j1: null, j2: null };
  host.innerHTML = `<div class="btns sw-tabs"></div>
    <p class="sw-s"><span class="sw-tag">原命题</span><span class="sw-orig"></span></p>
    <div class="sw-row"><span class="sw-lab">条件</span><span class="sw-lab">结论</span></div>
    <div class="sw-cards"><span class="kw">如果</span><span class="scard sc-c"></span><span class="kw">，那么</span><span class="scard sc-r"></span></div>
    <div class="sw-judge" data-w="1"><span>原命题是</span><button type="button" class="btn" data-v="1">真命题</button><button type="button" class="btn" data-v="0">假命题</button></div>
    <p class="sw-why w1"></p>
    <div class="btns"><button type="button" class="btn solid sw-go">⇄ 交换条件和结论</button></div>
    <p class="sw-s sw-conv-line"><span class="sw-tag o">逆命题</span><span class="sw-conv"></span></p>
    <div class="sw-judge" data-w="2"><span>逆命题是</span><button type="button" class="btn" data-v="1">真命题</button><button type="button" class="btn" data-v="0">假命题</button></div>
    <p class="sw-why w2"></p>`;
  const q = (c) => host.querySelector(c);
  const cards = q('.sw-cards');
  const cardC = q('.sc-c');
  const cardR = q('.sc-r');
  const kw2 = cards.querySelectorAll('.kw')[1];

  function flip(mutate) {
    const els = [cardC, cardR];
    const before = els.map((e) => e.getBoundingClientRect());
    mutate();
    els.forEach((e, k) => {
      const a = e.getBoundingClientRect();
      const dx = before[k].left - a.left;
      const dy = before[k].top - a.top;
      e.style.transition = 'none';
      e.style.transform = `translate(${dx}px, ${dy}px)`;
      void e.offsetWidth;
      e.style.transition = 'transform .6s ease';
      e.style.transform = '';
    });
  }
  const order = () => {
    // 未交换：如果 [条件] ，那么 [结论]；交换后：如果 [结论] ，那么 [条件]
    const [first, second] = st.swapped ? [cardR, cardC] : [cardC, cardR];
    cards.insertBefore(first, kw2);
    cards.appendChild(second);
  };
  const judgeHtml = (ok, truth, why) => (ok ? `<b class="${truth ? 'tv' : 'fv'}">${truth ? '真命题' : '假命题'}</b>：${why}` : '再想想：条件成立时，结论<b>一定</b>成立吗？能不能找到反例？');
  function render() {
    const it = SW[st.i];
    q('.sw-tabs').innerHTML = SW.map((x, i) => `<button type="button" class="btn${i === st.i ? ' solid' : ''}" data-i="${i}">${x.no}</button>`).join('');
    q('.sw-orig').innerHTML = `${it.orig}．`;
    cardC.innerHTML = it.c;
    cardR.innerHTML = it.r;
    q('.sw-conv').innerHTML = st.swapped ? `${it.conv}．` : '（按“交换”生成）';
    q('.sw-conv-line').classList.toggle('on', st.swapped);
    q('.sw-go').textContent = st.swapped ? '⇄ 换回原命题' : '⇄ 交换条件和结论';
    [[1, st.j1, it.t1, it.w1], [2, st.j2, it.t2, it.w2]].forEach(([k, j, t, w]) => {
      const box = q(`.sw-judge[data-w="${k}"]`);
      box.classList.toggle('off', k === 2 && !st.swapped);
      box.querySelectorAll('[data-v]').forEach((b) => {
        const mine = j !== null && (b.dataset.v === '1') === j;
        b.className = `btn${mine ? (j === t ? ' ok' : ' no') : ''}`;
      });
      q(`.w${k}`).innerHTML = j === null ? '' : judgeHtml(j === t, t, w);
    });
    tex(host);
  }
  host.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-i]');
    const go = e.target.closest('.sw-go');
    const jb = e.target.closest('.sw-judge [data-v]');
    if (tab) {
      Object.assign(st, { i: +tab.dataset.i, j1: null, j2: null });
      if (st.swapped) { st.swapped = false; order(); }
      render();
    } else if (go) {
      flip(() => { st.swapped = !st.swapped; order(); });
      render();
    } else if (jb) {
      const k = jb.closest('.sw-judge').dataset.w;
      if (k === '2' && !st.swapped) return;
      st[`j${k}`] = jb.dataset.v === '1';
      render();
    }
  });
  render();
}

/* ---------- 第 6 页：锐角 + 钝角 ---------- */
function initSupplement() {
  const s = { a: 60, o: 120 };
  const O = [0, 0];
  const R = 2;
  const b = Geo.board($('supB'), { x: [-2.5, 2.5], y: [-0.5, 2.4], w: 420 });
  const P = (d) => mul(dir(d), R);
  b.seg([O, P(0)], { cls: 'gl c-a' });
  b.seg(() => [O, P(s.a)], { cls: 'gl thin-l' });
  b.seg(() => [O, P(s.a + s.o)], { cls: 'gl c-b' });
  b.seg([O, P(180)], { cls: 'gdash' });
  arc(b, O, P(0), () => P(s.a), { r: 0.5, cls: 'garc ga', label: () => `${s.a}°`, lr: 1.9 });
  arc(b, O, () => P(s.a), () => P(s.a + s.o), { r: 0.7, cls: 'garc go', label: () => `${s.o}°`, lr: 1.6, show: () => s.o < 180 });
  b.onUpdate = () => {
    $('supAV').textContent = `${s.a}°`; $('supOV').textContent = `${s.o}°`;
    const sum = s.a + s.o;
    const msg = $('supMsg');
    msg.className = `tip feedback ${sum === 180 ? '' : 'fb-warn'}`;
    msg.innerHTML = sum === 180
      ? `$${s.a}^\\circ+${s.o}^\\circ=180^\\circ$，拼成平角——这一组互补，说明不了命题是假的．`
      : `$${s.a}^\\circ+${s.o}^\\circ=${sum}^\\circ\\ne180^\\circ$：是锐角与钝角，却<b>不互补</b>——这就是<b>反例</b>！`;
    tex(msg);
  };
  MathKit.slider($('supA'), (v) => { s.a = v; b.update(); });
  MathKit.slider($('supO'), (v) => { s.o = v; b.update(); });
}

/* ---------- 第 6 页：a² = b² ---------- */
function initSquares() {
  const s = { a: 2, b: 2 };
  const upd = () => {
    $('sqAV').textContent = s.a; $('sqBV').textContent = s.b;
    const msg = $('sqMsg');
    const p = (v) => (v < 0 ? `(${v})` : v);
    const cond = s.a * s.a === s.b * s.b;
    if (!cond) { msg.className = 'tip feedback'; msg.innerHTML = `$${p(s.a)}^2=${s.a * s.a}$，$${p(s.b)}^2=${s.b * s.b}$，条件不成立——这组数不能当反例．`; }
    else if (s.a === s.b) { msg.className = 'tip feedback'; msg.innerHTML = `$a^2=b^2=${s.a * s.a}$，且 $a=b$：条件、结论都成立．再找找．`; }
    else { msg.className = 'tip feedback fb-warn'; msg.innerHTML = `$${p(s.a)}^2=${p(s.b)}^2=${s.a * s.a}$，条件成立；但 $${s.a}\\ne${s.b}$——<b>反例</b>！`; }
    tex(msg);
  };
  MathKit.slider($('sqA'), (v) => { s.a = v; upd(); });
  MathKit.slider($('sqB'), (v) => { s.b = v; upd(); });
}

/* ---------- 第 8 页：到线段两端距离相等的点 ---------- */
function initMid() {
  const A = [-2, 0];
  const B = [2, 0];
  const s = { y: 1.5 };
  const P = () => [0, s.y];
  const b = Geo.board($('mid'), { x: [-3, 3], y: [-2.3, 2.6], w: 400 });
  b.seg([[0, -2.2], [0, 2.5]], { cls: 'gdash' });
  b.seg([A, B], { cls: 'gs' });
  b.seg(() => [P(), A], { cls: 'gl c-a' });
  b.seg(() => [P(), B], { cls: 'gl c-a' });
  b.pt(A); b.pt(B); b.pt([0, 0], { r: 3 });
  b.text(A, 'A', { dx: -20, dy: 6 }); b.text(B, 'B', { dx: 8, dy: 6 }); b.text([0, 0], 'M', { dx: 6, dy: 22 });
  b.text(P, 'P', { dx: 12, dy: -4 });
  b.drag(P, (x, y) => { let v = clamp(Math.round(y * 10) / 10, -2, 2.3); if (Math.abs(v) < 0.15) v = 0; s.y = v; });
  b.onUpdate = () => {
    const pa = Geo.dist(P(), A);
    $('midPA').textContent = fmt(pa, 2); $('midPB').textContent = fmt(Geo.dist(P(), B), 2);
    const msg = $('midMsg');
    const on = s.y === 0;
    msg.className = `tip feedback ${on ? '' : 'fb-warn'}`;
    msg.innerHTML = on ? '$P$ 与中点 $M$ 重合：条件、结论都成立．把 $P$ 拖离 $AB$ 试试．' : '$PA=PB$，条件成立；但 $P$ 不在线段 $AB$ 上，<b>不是中点</b>——反例！';
    tex(msg);
  };
  b.update();
}

/* ---------- 第 9 页：费马数（精确整数） ---------- */
function isPrime(n) {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d += 1) if (n % d === 0) return d;
  return true;
}
function initFermat() {
  const show = (n) => {
    const v = 2 ** (2 ** n) + 1; // n ≤ 5 时 < 2^53，精确
    const pr = isPrime(v);
    const out = $('fmOut');
    const big = BigInt(v).toLocaleString('en-US').replace(/,/g, '\u2009');
    if (pr === true) { out.className = 'tip feedback fm-out fb-ok'; out.innerHTML = `$n=${n}$：$2^{2^{${n}}}+1=2^{${2 ** n}}+1=${big}$，是<b>质数</b>．`; }
    else {
      const q = v / pr;
      console.assert(BigInt(pr) * BigInt(q) === BigInt(v), '因数分解有误');
      out.className = 'tip feedback fm-out fb-warn';
      out.innerHTML = `$n=${n}$：$2^{32}+1=${big}=${pr}\\times${q.toLocaleString('en-US').replace(/,/g, '\\,')}$，是<b>合数</b>！费马的猜想不成立．`;
    }
    tex(out);
    $('fmBtns').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', +b.dataset.n === n));
  };
  $('fmBtns').innerHTML = [0, 1, 2, 3, 4, 5].map((n) => `<button type="button" class="btn" data-n="${n}">$n=${n}$</button>`).join('');
  tex($('fmBtns'));
  $('fmBtns').addEventListener('click', (e) => { const b = e.target.closest('[data-n]'); if (b) show(+b.dataset.n); });
  show(0);
}

/* ---------- 第 11 页：拖动 C ---------- */
function initRight() {
  const A = [0, 0];
  const B = [4, 0];
  const M = [2, 0];
  const s = { C: [1.2, 2.6] };
  const b = Geo.board($('rt'), { x: [-0.6, 4.6], y: [-0.6, 3.2], w: 460 });
  b.curve((t) => add(M, mul(dir(180 * t), 2)), 0, 1, { cls: 'gdash' });
  b.poly(() => [A, B, s.C], { cls: 'trif' });
  arc(b, A, B, () => s.C, { r: 0.45, cls: 'garc ga' });
  arc(b, B, () => s.C, A, { r: 0.45, cls: 'garc ga' });
  arc(b, () => s.C, A, B, { r: 0.4, cls: 'garc go', show: () => Math.abs(angle(s.C, A, B) - 90) > 0.05 });
  right(b, () => s.C, A, B, { s: 0.25 });
  b.text(A, 'A', { dx: -20, dy: 18 }); b.text(B, 'B', { dx: 6, dy: 18 }); b.text(() => s.C, 'C', { dx: -6, dy: -12 });
  b.drag(() => s.C, (x, y) => {
    let p = [clamp(x, 0.2, 3.8), clamp(y, 0.6, 3)];
    if (Math.abs(Geo.dist(p, M) - 2) < 0.12) p = add(M, mul(sub(p, M), 2 / Geo.dist(p, M)));
    s.C = p;
  });
  b.onUpdate = () => {
    const ab = angle(A, B, s.C) + angle(B, s.C, A);
    const c = angle(s.C, A, B);
    $('rtAB').textContent = `${fmt(ab, 1)}°`; $('rtC').textContent = `${fmt(c, 1)}°`;
    const msg = $('rtMsg');
    const rt = Math.abs(c - 90) < 0.05;
    msg.className = `tip feedback ${rt ? 'fb-ok' : ''}`;
    msg.innerHTML = rt ? '$\\angle A+\\angle B=90^\\circ$，此时 $\\angle C=90^\\circ$：直角三角形．' : '$\\angle A+\\angle B$ 与 $\\angle C$ 的和总是 $180^\\circ$．把 $C$ 拖到虚线上试试．';
    tex(msg);
  };
  b.update();
  // 直角符号只在 ∠C = 90° 时显示
  const rightMark = $('rt').querySelectorAll('.gright');
  const prev = b.onUpdate;
  b.onUpdate = () => { prev(); rightMark.forEach((el) => { el.style.display = Math.abs(angle(s.C, A, B) - 90) < 0.05 ? '' : 'none'; }); };
  b.update();
}

/* ---------- 静态图 ---------- */
function initFigures() {
  // 图 12-10：a、b、c 水平，d 斜截；∠1、∠2、∠3 是同位角
  {
    const T = 55;
    const ys = { a: 2, b: 1, c: 0 };
    const X = (y) => 1.4 + (y - 0) / Math.tan((T * Math.PI) / 180);
    const b = Geo.board($('f1210'), { x: [-0.6, 4.6], y: [-0.7, 2.8], w: 400 });
    Object.entries(ys).forEach(([n, y]) => {
      b.seg([[-0.3 + y * 0.6, y], [3.8 + y * 0.3, y]], { cls: 'gl thin-l' });
      b.text([3.8 + y * 0.3, y], n, { dx: 6, dy: 6 });
      const V = [X(y), y];
      arc(b, V, add(V, [1, 0]), add(V, dir(T)), { r: 0.28, label: { a: '1', b: '2', c: '3' }[n], lr: 1.9 });
    });
    b.seg([add([X(0), 0], mul(dir(T), -0.6)), add([X(2), 2], mul(dir(T), 0.7))], { cls: 'gdash' });
    b.text(add([X(2), 2], mul(dir(T), 0.7)), 'd', { dx: 6, dy: 4 });
    b.update();
  }
  // 练一练 1：AB ∥ CD，DE 交 AB 于 G，BF ∥ DE（∠B = ∠D）
  {
    const P = { A: [0, 1.6], B: [3.6, 1.6], C: [0.6, 0], D: [3, 0] };
    const d = dir(125);
    P.G = Geo.meet(P.D, add(P.D, d), P.A, P.B);
    P.E = add(P.G, mul(d, 0.9));
    P.F = add(P.B, mul(d, 1.4));
    sketch($('lx1'), { P, seg: 'AB CD DE BF', w: 380, pad: 0.4, lab: { G: [6, 20], E: [-18, 0], F: [-18, 0] } });
  }
  // 练一练 2：Rt△ABC，∠ACB = 90°，CD ⊥ AB（∠ACD = ∠B）
  {
    const A = [0, 0];
    const B = [4, 0];
    const C = [3, Math.sqrt(3)];
    const D = Geo.foot(C, A, B);
    const bd = sketch($('lx2'), { P: { A, B, C, D }, seg: 'AB BC CA CD', w: 340, pad: 0.4 });
    right(bd, C, A, B, { s: 0.22 });
    bd.update();
  }
}

window.LESSON = {
  init() {
    initSwapper();
    initSupplement();
    initSquares();
    initMid();
    initFermat();
    initRight();
    initFigures();
    MProof.init();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
