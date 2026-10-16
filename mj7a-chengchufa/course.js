'use strict';
/* 七上 2.6 有理数的乘法与除法 · 本课互动：水位标尺、负因数符号翻转器、运算律验证、乘法迷宫。通用部分见 ../shared/math.js
 * 标尺刻度、水位高度、乘积全部由代码计算。 */
const { board, slider, tex } = MathKit;
const $ = (id) => document.getElementById(id);

/** KaTeX 里的带号数：+4、−4、0；inParen 时负数（和带“+”的正数）加括号 */
const sg = (v) => (v > 0 ? `+${v}` : `${v}`);
const mn = (v) => String(v).replace('-', '−');
const par = (v) => (v < 0 ? `(${v})` : `${v}`);

/* 第 3 页：水位标尺。今天的水位记为 0，t 天后的水位变化 = 每天变化 × t */
function initGauge() {
  const s = { rate: 4, t: 3 };
  const lvl = () => s.rate * s.t;
  const b = board($('gauge'), { x: [-5.2, 3.2], y: [-15.5, 15.5], w: 300, h: 560, axes: false, grid: false });
  const G0 = 0.3;
  const G1 = 1.3;
  b.poly([[G0, -14.8], [G1, -14.8], [G1, 14.8], [G0, 14.8]], { cls: 'staff' });
  for (let v = -14; v <= 14; v += 2) {
    const major = v % 4 === 0;
    b.seg([[G0, v], [G0 + (major ? 0.55 : 0.3), v]], { cls: major ? 'tick-m' : 'tick' });
    if (major) b.text([G1, v], v === 0 ? '0' : sg(v).replace('-', '−'), { cls: 'tk', dx: 6, dy: 5 });
  }
  b.poly(() => [[-5.2, -15.5], [G1, -15.5], [G1, lvl()], [-5.2, lvl()]], { cls: 'water' });
  b.seg([[-5.2, 0], [G1, 0]], { cls: 'today' });
  b.text([-5.1, 0], '今天的水位', { cls: 'lb up small', dy: -8 });
  b.seg(() => [[-1.4, 0], [-1.4, lvl()]], { cls: 'arrow' });
  b.poly(() => {
    const L = lvl();
    if (!L) return [];
    const d = L > 0 ? -1 : 1; // 箭头尖朝向水位
    return [[-1.4, L], [-1.75, L + d * 1.1], [-1.05, L + d * 1.1]];
  }, { cls: 'arrow-h' });
  b.text(() => (s.t ? [-5.1, lvl()] : null), () => `${Math.abs(s.t)} 天${s.t > 0 ? '后' : '前'}`, { cls: 'lb up small o', dy: -8 });
  b.text(() => (lvl() ? [-1.25, lvl() / 2] : null), () => `${lvl() > 0 ? '高' : '低'} ${Math.abs(lvl())} cm`, { cls: 'lb up small o', dx: 12 });

  b.onUpdate = () => {
    const L = lvl();
    $('gDayV').textContent = s.t === 0 ? '今天' : `${sg(s.t).replace('-', '−')}（${Math.abs(s.t)} 天${s.t > 0 ? '后' : '前'}）`;
    $('gEq').innerHTML = `水位变化：$(${sg(s.rate)})\\times${s.t ? `(${sg(s.t)})` : '0'}=${L ? sg(L) : 0}$`;
    tex($('gEq'));
    const when = s.t === 0 ? '今天' : `${Math.abs(s.t)} 天${s.t > 0 ? '后' : '前'}`;
    $('gMsg').textContent = L === 0
      ? '今天的水位就是今天的水位：变化为 0。'
      : `水位每天${s.rate > 0 ? '上升' : '下降'} 4 cm，${when}的水位比今天${L > 0 ? '高' : '低'} ${Math.abs(L)} cm。`;
  };
  $('rateBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-r]');
    if (!btn) return;
    s.rate = +btn.dataset.r;
    $('rateBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
  slider($('gDay'), (v) => { s.t = v; b.update(); });
}

/* 第 7 页：负因数个数决定积的符号 */
function initFlip() {
  const ABS = [2, 3, 4, 5];
  let neg = [true, false, true, false];
  let zero = false;
  const draw = () => {
    const vals = ABS.map((a, i) => (neg[i] ? -a : a)).concat(zero ? [0] : []);
    $('flip').innerHTML = vals.map((v, i) => `<button type="button" class="fac ${v < 0 ? 'neg' : ''} ${v === 0 ? 'zero' : ''}" data-i="${i}">${String(v).replace('-', '−')}</button>`).join('<span class="times">×</span>');
    const prod = vals.reduce((p, v) => p * v, 1);
    const k = neg.filter(Boolean).length;
    $('flipEq').innerHTML = `$${vals.map(par).join('\\times')}=${prod}$`;
    tex($('flipEq'));
    const msg = $('flipMsg');
    msg.className = `tip feedback ${prod > 0 ? 'fb-ok' : prod < 0 ? 'fb-warn' : ''}`;
    msg.textContent = zero
      ? '有一个因数是 0，积就是 0——不用再看负号了。'
      : `负因数有 ${k} 个（${k % 2 ? '奇' : '偶'}数个），积为${k % 2 ? '负' : '正'}；积的绝对值总是 2 × 3 × 4 × 5 = 120。`;
  };
  $('flip').addEventListener('click', (e) => {
    const btn = e.target.closest('.fac');
    if (!btn) return;
    const i = +btn.dataset.i;
    if (i >= ABS.length) return; // 0 不分正负
    neg = neg.map((v, k) => (k === i ? !v : v));
    draw();
  });
  $('flipZero').addEventListener('click', () => { zero = !zero; draw(); });
  $('flipReset').addEventListener('click', () => { neg = neg.map(() => false); zero = false; draw(); });
  draw();
}

/* 第 8 页：运算律验证。课本 p43 黑板上的数，或随机的 −9～9 非零整数 */
function initLaws() {
  const BOOK = { t1: 6, c1: -7, t2: 3, c2: -5, q2: -2, c3: -3, q3: 5, t3: 4 };
  const rnd = () => { const v = Math.floor(Math.random() * 18) - 9; return v >= 0 ? v + 1 : v; }; // −9…−1, 1…9
  const draw = (v) => {
    const rows = [
      ['交换律', `${par(v.t1)}\\times${par(v.c1)}`, v.t1 * v.c1, `${par(v.c1)}\\times${par(v.t1)}`, v.c1 * v.t1],
      ['结合律', `[${par(v.t2)}\\times${par(v.c2)}]\\times${par(v.q2)}`, v.t2 * v.c2 * v.q2, `${par(v.t2)}\\times[${par(v.c2)}\\times${par(v.q2)}]`, v.t2 * (v.c2 * v.q2)],
      ['分配律', `[${par(v.c3)}+${par(v.q3)}]\\times${par(v.t3)}`, (v.c3 + v.q3) * v.t3, `${par(v.c3)}\\times${par(v.t3)}+${par(v.q3)}\\times${par(v.t3)}`, v.c3 * v.t3 + v.q3 * v.t3],
    ];
    $('laws').innerHTML = rows.map(([name, l, lv, r, rv]) => `<div class="law"><b>${name}</b><span>$${l}=${lv}$</span><span>$${r}=${rv}$</span><i class="${lv === rv ? 'eq' : 'ne'}">${lv === rv ? '相等 ✓' : '不等'}</i></div>`).join('');
    tex($('laws'));
  };
  $('lawNew').addEventListener('click', () => draw({ t1: rnd(), c1: rnd(), t2: rnd(), c2: rnd(), q2: rnd(), c3: rnd(), q3: rnd(), t3: rnd() }));
  $('lawBook').addEventListener('click', () => draw(BOOK));
  draw(BOOK);
}

/* 第 16 页：乘法迷宫（习题 2.6 第 8 题）。入口位置照课本图的大致方位；环与环之间的通道连通 */
const RINGS = [
  { r: 3.1, gates: [[80, -6], [-40, 4], [195, -1]] },
  { r: 2.1, gates: [[125, 2], [35, 3], [-55, 1], [210, -3]] },
  { r: 1.1, gates: [[75, -8], [-15, -2], [205, 6]] },
];
const TARGET = 24;

function initMaze() {
  const s = { pick: [], found: [] };
  const b = board($('maze'), { x: [-3.9, 3.9], y: [-3.9, 3.9], axes: false, grid: false, w: 520 });
  const rad = (d) => (d * Math.PI) / 180;
  const GAP = 0.36; // 入口缺口的弧长（单位长度），三道环一样宽
  RINGS.forEach(({ r, gates }) => {
    const angs = gates.map(([d]) => rad(d)).sort((a, c) => a - c);
    const half = GAP / 2 / r;
    angs.forEach((a, i) => {
      const nextA = i + 1 < angs.length ? angs[i + 1] : angs[0] + 2 * Math.PI;
      b.curve((t) => [r * Math.cos(t), r * Math.sin(t)], a + half, nextA - half, { cls: 'wall' });
    });
  });
  b.text([0, 0], String(TARGET), { cls: 'lb up center-t', dy: 9 });
  const gateEls = [];
  RINGS.forEach(({ r }, ri) => RINGS[ri].gates.forEach(([d, v], gi) => {
    const p = [r * Math.cos(rad(d)), r * Math.sin(rad(d))];
    const lp = [(r + 0.42) * Math.cos(rad(d)), (r + 0.42) * Math.sin(rad(d))];
    const dot = b.pt(p, { cls: 'gate', r: 11 });
    const lab = b.text(lp, String(v).replace('-', '−'), { cls: 'lb up gate-t', dy: 7 });
    [dot, lab].forEach((el) => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => choose(ri, gi));
    });
    gateEls.push({ ri, gi, dot, lab });
  }));

  const prod = () => s.pick.reduce((p, gi, ri) => p * RINGS[ri].gates[gi][1], 1);
  function show(msgText, cls) {
    gateEls.forEach(({ ri, gi, dot, lab }) => {
      const on = s.pick[ri] === gi;
      dot.classList.toggle('on', on);
      lab.classList.toggle('on', on);
    });
    const vals = s.pick.map((gi, ri) => RINGS[ri].gates[gi][1]);
    $('mazeEq').innerHTML = vals.length ? `$1${vals.map((v) => `\\times${par(v)}`).join('')}=${prod()}$` : '进入时的数：$1$';
    tex($('mazeEq'));
    const msg = $('mazeMsg');
    msg.className = `tip feedback ${cls || ''}`;
    msg.textContent = msgText;
    $('mazeFound').innerHTML = s.found.length ? `已找到 ${s.found.length}/4 条路：${s.found.join('；')}` : '';
  }
  function choose(ri, gi) {
    if (s.pick.length === RINGS.length) { s.pick = []; }
    if (ri !== s.pick.length) {
      show(ri < s.pick.length ? '这道环已经走过了，接着往里走。' : `先通过第 ${s.pick.length + 1} 道环（从外往里）。`, 'fb-warn');
      return;
    }
    s.pick = [...s.pick, gi];
    const p = prod();
    if (s.pick.length < RINGS.length) { show(`现在乘积是 ${mn(p)}，继续进入第 ${s.pick.length + 1} 道环。`); return; }
    if (p === TARGET) {
      const route = s.pick.map((g, k) => String(RINGS[k].gates[g][1]).replace('-', '−')).join(' → ');
      if (!s.found.includes(route)) s.found = [...s.found, route];
      show(`乘积是 24，到达中心！路线：${route}`, 'fb-ok');
      return;
    }
    const why = p < 0 ? '负因数是奇数个，积为负。' : `积是 ${mn(p)}，绝对值不是 24。`;
    show(`乘积是 ${mn(p)}，进不去中心：${why}点“重新进入”再试。`, 'fb-warn');
  }
  $('mazeReset').addEventListener('click', () => { s.pick = []; show('从最外面一道环的任意一个入口开始。'); });
  b.update();
  show('从最外面一道环的任意一个入口开始。');
}

window.LESSON = {
  init() {
    initGauge();
    initFlip();
    initLaws();
    initMaze();
  },
};
