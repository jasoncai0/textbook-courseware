'use strict';
/* 七上 3.3 代数式的值 · 本课互动：火柴“小鱼”（按坐标排火柴，根数 8+6(n−1)）、x 取值表、数值转换机（分数精确运算）、
 * 储蓄循环程序（图 3-5）、习题第 5 题图。 */
const { board, slider, tex, fmt } = MathKit;
const $ = (id) => document.getElementById(id);

/* ---------- 分数 ---------- */
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const F = (n, d = 1) => { const s = d < 0 ? -1 : 1; const g = gcd(n, d) || 1; return { n: (s * n) / g, d: Math.abs(d) / g }; };
const parseF = (t) => {
  if (t.includes('/')) { const [n, d] = t.split('/').map(Number); return F(n, d); }
  const k = (t.split('.')[1] || '').length;
  return F(Math.round(+t * 10 ** k), 10 ** k);
};
const mulF = (a, b) => F(a.n * b.n, a.d * b.d);
const addF = (a, b) => F(a.n * b.d + b.n * a.d, a.d * b.d);
/** 显示：asDec 时有限小数写成小数，否则写成分数 */
const showF = (v, asDec) => {
  if (v.d === 1) return String(v.n).replace('-', '−');
  let d = v.d;
  while (d % 2 === 0) d /= 2;
  while (d % 5 === 0) d /= 5;
  if (asDec && d === 1) return String(+(v.n / v.d).toFixed(6)).replace('-', '−');
  return `${v.n < 0 ? '−' : ''}${Math.abs(v.n)}/${v.d}`;
};
const texF = (v, asDec) => {
  if (v.d === 1 || asDec) return showF(v, asDec).replace('−', '-');
  return `${v.n < 0 ? '-' : ''}\\dfrac{${Math.abs(v.n)}}{${v.d}}`;
};

/* ---------- 第 3 页：小鱼 ---------- */
const DX = 68; // 火柴水平跨度（约 30° 倾斜）
const DY = 38;
function fishSticks(n) {
  const tail = [[[-DX, DY], [0, 0]], [[-DX, -DY], [0, 0]]].map((s) => ({ s, k: 0 }));
  const body = Array.from({ length: n }, (_, i) => {
    const x = 2 * DX * i;
    return [
      [[x, 0], [x + DX, DY]], [[x, 0], [x + DX, -DY]],
      [[x, 2 * DY], [x + DX, DY]], [[x, -2 * DY], [x + DX, -DY]],
      [[x + DX, DY], [x + 2 * DX, 0]], [[x + DX, -DY], [x + 2 * DX, 0]],
    ].map((s) => ({ s, k: i + 1 }));
  }).flat();
  return [...tail, ...body];
}
function initFish() {
  const draw = (n) => {
    const sticks = fishSticks(n);
    const ox = 95;
    const oy = 100;
    const P = ([x, y]) => [ox + x, oy - y];
    $('fishFig').innerHTML = sticks.map(({ s: [a, b], k }) => {
      const [x1, y1] = P(a);
      const [x2, y2] = P(b);
      // 火柴头画在靠近端点 b 的一侧（略缩进，避免两根火柴头重叠）
      const hx = x2 - (x2 - x1) * 0.1;
      const hy = y2 - (y2 - y1) * 0.1;
      const cls = k === n && n > 1 ? 'new' : k === 0 ? 'tail' : '';
      return `<g class="stick ${cls}"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><circle cx="${hx}" cy="${hy}" r="5"/></g>`;
    }).join('');
    const count = sticks.length;
    $('fishNV').textContent = `${n} 条`;
    const m = $('fishMsg');
    m.innerHTML = n === 1 ? '搭 1 条“小鱼”用 8 根火柴棒（其中 2 根是鱼尾）。' : `搭 ${n} 条：比 ${n - 1} 条多了 6 根（橙色）。共 $8+6\\times${n - 1}=${count}$ 根。`;
    tex(m);
    const cols = [1, 2, 3, 4, 5, 6];
    $('fishTab').innerHTML = `<tr><th>“小鱼”条数</th>${cols.map((k) => `<td class="${k === n ? 'on' : ''}">${k}</td>`).join('')}</tr>`
      + `<tr><th>火柴棒根数</th>${cols.map((k) => `<td class="${k === n ? 'on' : ''}">${k <= n ? 8 + 6 * (k - 1) : ''}</td>`).join('')}</tr>`;
  };
  slider($('fishN'), draw);
}

/* ---------- 第 6 页：议一议表格 ---------- */
const EXPRS = [
  { tx: '2x-1', f: (x) => 2 * x - 1, cls: 'c1' },
  { tx: '-3x', f: (x) => -3 * x, cls: 'c2' },
  { tx: 'x^2', f: (x) => x * x, cls: 'c3' },
];
function initValues() {
  const s = { x: -3 };
  const xs = [-3, -2, -1, 0, 1, 2, 3];
  const b = board($('vBoard'), { x: [-3.6, 3.6], y: [-10, 10], w: 420, h: 170, ticks: [1, 5], grid: false });
  EXPRS.forEach(({ f, cls }) => xs.forEach((x) => b.pt([x, f(x)], { cls: `pt-${cls}`, r: 5, show: () => x <= s.x })));
  b.onUpdate = () => {
    $('tbXV').textContent = String(s.x).replace('-', '−');
    $('vTab').innerHTML = `<tr><th>$x$</th>${xs.map((x) => `<td class="${x === s.x ? 'on' : ''}">${String(x).replace('-', '−')}</td>`).join('')}</tr>`
      + EXPRS.map(({ tx, f, cls }) => `<tr><th class="k-${cls}">$${tx}$</th>${xs.map((x) => `<td class="${x === s.x ? 'on' : ''}">${x <= s.x ? String(f(x)).replace('-', '−') : ''}</td>`).join('')}</tr>`).join('');
    tex($('vTab'));
    const x = s.x;
    const p = x < 0 ? `(${x})` : `${x}`;
    $('vEq').innerHTML = `$x=${x}$ 时：$2\\times${p}-1=${2 * x - 1}$，$-3\\times${p}=${-3 * x}$，$${p}^2=${x * x}$`;
    tex($('vEq'));
  };
  slider($('tbX'), (v) => { s.x = v; b.update(); });
}

/* ---------- 第 8 页：数值转换机 ---------- */
const STEP = {
  mul: (k) => ({ t: 'mul', k, lab: k < 0 ? `×(${String(k).replace('-', '−')})` : `×${k}` }),
  add: (k) => ({ t: 'add', k, lab: k < 0 ? `−${-k}` : `+${k}` }),
  sq: () => ({ t: 'sq', lab: '(　)²' }),
};
const MACHINES = [
  { name: '图 3-6', steps: [STEP.mul(3), STEP.add(5)], ins: [['-2.5'], ['-0.49'], ['0'], ['3/1000', '3/1000'], ['7/8', '7/8'], ['1.99']] },
  { name: '图 3-7', steps: [STEP.sq(), STEP.mul(3), STEP.add(-5)], ins: [['-5/4', '−1¼'], ['-1'], ['-3/4', '−3/4'], ['0'], ['3/4', '3/4'], ['1'], ['5/4', '1¼']] },
  { name: '习题 2', steps: [STEP.add(-2), STEP.mul(4), STEP.add(1)], ins: [['-2'], ['-3/2', '−1½'], ['-1'], ['0'], ['0.5'], ['0.75'], ['1.2']] },
  { name: '习题 3', steps: [STEP.mul(2), STEP.add(-3), STEP.mul(5)], ins: [['-1'], ['-1/2', '−1/2'], ['0'], ['1.5'], ['2'], ['5/2', '5/2'], ['5.89']] },
  { name: '自己搭', steps: [], ins: [['-2'], ['-1'], ['0'], ['1'], ['2'], ['3']], free: true },
];
const PALETTE = [STEP.sq(), STEP.mul(3), STEP.mul(2), STEP.mul(-2), STEP.add(5), STEP.add(1), STEP.add(-5), STEP.add(-3)];
const applyStep = (v, st) => (st.t === 'sq' ? mulF(v, v) : st.t === 'mul' ? mulF(v, F(st.k)) : addF(v, F(st.k)));
/** 程序 → 代数式（KaTeX） */
function exprOf(steps) {
  let e = 'x';
  let kind = 'atom'; // atom: 只有 x；prod: 单项（如 3x、x^2）；sum: 含加减
  steps.forEach((st) => {
    if (st.t === 'sq') { e = kind === 'atom' ? 'x^2' : `(${e})^2`; kind = 'prod'; }
    else if (st.t === 'mul') { e = kind === 'sum' || (kind === 'prod' && !/^x\^2$/.test(e)) ? `${st.k}(${e})` : `${st.k}${e}`; kind = 'prod'; }
    else { e = `${e}${st.k < 0 ? '-' : '+'}${Math.abs(st.k)}`; kind = 'sum'; }
  });
  return e;
}
function initMachine() {
  const s = { m: 0, prog: [], rows: [], busy: false };
  const steps = () => (MACHINES[s.m].free ? s.prog : MACHINES[s.m].steps);
  $('mcPick').innerHTML = MACHINES.map((m, i) => `<button class="btn ${i ? '' : 'solid'}" type="button" data-m="${i}">${m.name}</button>`).join('');
  $('mcPal').innerHTML = `${PALETTE.map((st, i) => `<button class="btn" type="button" data-p="${i}">${st.lab}</button>`).join('')}<button class="btn" type="button" data-p="clr">清空</button>`;
  const drawFlow = (vals = []) => {
    const st = steps();
    const box = (cls, lab, v) => `<div class="mbox ${cls}"><span>${lab}</span><b>${v ?? ''}</b></div>`;
    $('mcFlow').innerHTML = box('io in', '输入 x', vals[0])
      + st.map((x, i) => `<i class="arr">↓</i>${box('op', x.lab, vals[i + 1])}`).join('')
      + (MACHINES[s.m].free && st.length < 3 ? `<i class="arr">↓</i>${box('op empty', '（选一步）', '')}` : '')
      + `<i class="arr">↓</i>${box('io out', '输出', vals.length > st.length ? vals[st.length] : '')}`;
  };
  const drawAll = () => {
    const st = steps();
    $('mcExpr').innerHTML = st.length ? `这台转换机相当于代数式 $${exprOf(st)}$` : '从下面选步骤，搭一台转换机（最多 3 步）';
    tex($('mcExpr'));
    $('mcIn').innerHTML = `<span class="muted">输入：</span>${MACHINES[s.m].ins.map(([v, lab], i) => `<button class="btn" type="button" data-i="${i}">${lab || v.replace('-', '−')}</button>`).join('')}`;
    $('mcTab').innerHTML = `<tr><th>输入</th>${s.rows.map((r) => `<td>${r[0]}</td>`).join('')}</tr><tr><th>输出</th>${s.rows.map((r) => `<td>${r[1]}</td>`).join('')}</tr>`;
    $('mcPal').hidden = !MACHINES[s.m].free;
    drawFlow();
  };
  const run = (i) => {
    const st = steps();
    if (s.busy || !st.length) return;
    const [raw, lab] = MACHINES[s.m].ins[i];
    const asDec = !raw.includes('/') || /\/10+$/.test(raw); // 3/1000 这样的十进分数按小数显示
    const vals = st.reduce((acc, x) => [...acc, applyStep(acc[acc.length - 1], x)], [parseF(raw)]).map((v) => showF(v, asDec));
    s.busy = true;
    let k = 0;
    const tick = () => {
      k += 1;
      drawFlow(vals.slice(0, k));
      $('mcFlow').querySelectorAll('.mbox')[k - 1]?.classList.add('lit');
      if (k <= st.length) { setTimeout(tick, 380); return; }
      s.busy = false;
      const label = lab || raw.replace('-', '−');
      s.rows = [...s.rows.filter((r) => r[0] !== label), [label, vals[vals.length - 1]]].slice(-7);
      $('mcTab').innerHTML = `<tr><th>输入</th>${s.rows.map((r) => `<td>${r[0]}</td>`).join('')}</tr><tr><th>输出</th>${s.rows.map((r) => `<td>${r[1]}</td>`).join('')}</tr>`;
      const m = $('mcMsg');
      m.className = 'tip feedback fb-ok';
      m.innerHTML = `$x=${texF(parseF(raw), asDec)}$ 时，$${exprOf(st)}$ 的值是 ${vals[vals.length - 1]}。`;
      tex(m);
    };
    tick();
  };
  $('mcPick').addEventListener('click', (e) => {
    const b = e.target.closest('[data-m]');
    if (!b || s.busy) return;
    s.m = +b.dataset.m; s.rows = [];
    $('mcPick').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    $('mcMsg').textContent = '';
    drawAll();
  });
  $('mcIn').addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) run(+b.dataset.i); });
  $('mcPal').addEventListener('click', (e) => {
    const b = e.target.closest('[data-p]');
    if (!b || s.busy) return;
    s.prog = b.dataset.p === 'clr' ? [] : s.prog.length < 3 ? [...s.prog, PALETTE[+b.dataset.p]] : s.prog;
    s.rows = [];
    drawAll();
  });
  drawAll();
}

/* ---------- 第 9 页：储蓄循环（图 3-5）。本息和用分为单位的整数近似，显示保留两位小数 ---------- */
const RATE = 1 + 0.039 * 2; // 1.078
const LIMIT = 10000;
function initLoop() {
  const s = { phase: 'start', v: 8800, n: 0, hist: [] };
  const draw = () => {
    const on = (p) => (s.phase === p ? 'lit' : '');
    $('loopFig').innerHTML = `<div class="lp io ${on('start')}">输入 8 800</div><i class="arr">↓</i>`
      + `<div class="lp op ${on('mul')}">× (1 + 3.9% × 2)</div><i class="arr">↓</i>`
      + `<div class="lp dia ${on('no')} ${on('yes')}">&gt; 10 000 ?<em class="no ${on('no')}">否 ↺</em></div><i class="arr">↓ 是</i>`
      + `<div class="lp io ${on('yes')}">输出</div>`;
    $('loopTab').innerHTML = `<tr><th>到期次数</th>${s.hist.map((_, i) => `<td>${i + 1}</td>`).join('')}</tr><tr><th>本息和/元</th>${s.hist.map((v) => `<td>${fmt(v)}</td>`).join('')}</tr>`;
    const m = $('loopMsg');
    const msgs = {
      start: '点“运行一步”：先输入 8 800。',
      mul: `第 ${s.n} 次到期：本息和 ${fmt(s.v)} 元。下一步：和 10 000 比较。`,
      no: `${fmt(s.v)} 不大于 10 000，回到乘法框，再存 2 年（转存）。`,
      yes: `${fmt(s.v)} > 10 000，输出！共到期 ${s.n} 次，即转存了 ${s.n - 1} 次（共存 ${2 * s.n} 年）。`,
    };
    m.className = `tip feedback ${s.phase === 'yes' ? 'fb-ok' : s.phase === 'no' ? 'fb-warn' : ''}`;
    m.textContent = msgs[s.phase];
  };
  $('loopStep').addEventListener('click', () => {
    if (s.phase === 'yes') return;
    if (s.phase === 'start' || s.phase === 'no') {
      const v = Math.round(s.v * RATE * 100) / 100;
      Object.assign(s, { phase: 'mul', v, n: s.n + 1, hist: [...s.hist, v] });
    } else s.phase = s.v > LIMIT ? 'yes' : 'no';
    draw();
  });
  $('loopReset').addEventListener('click', () => { Object.assign(s, { phase: 'start', v: 8800, n: 0, hist: [] }); draw(); });
  draw();
}

/* ---------- 习题 5 图：边长 a 的正方形中 1、4、9 个相切的圆 ---------- */
function drawCircles() {
  const A = 90;
  const fig = [1, 2, 3].map((k, i) => {
    const x0 = 15 + i * 108;
    const y0 = 8;
    const r = A / (2 * k);
    let circles = '';
    for (let p = 0; p < k; p++) for (let q = 0; q < k; q++) circles += `<circle cx="${x0 + r * (2 * p + 1)}" cy="${y0 + r * (2 * q + 1)}" r="${r}" fill="#fff" stroke="#1f2d3a" stroke-width="1.5"/>`;
    return `<rect x="${x0}" y="${y0}" width="${A}" height="${A}" fill="url(#h3)" stroke="#1f2d3a" stroke-width="2"/>${circles}<text x="${x0 + A / 2}" y="${y0 + A + 15}" class="fl s" text-anchor="middle">${'①②③'[i]}</text>`;
  }).join('');
  $('circFig').innerHTML = `<defs><pattern id="h3" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#1f2d3a" stroke-width="1"/></pattern></defs>${fig}`;
}

window.LESSON = {
  init() {
    initFish();
    initValues();
    initMachine();
    initLoop();
    drawCircles();
  },
};
