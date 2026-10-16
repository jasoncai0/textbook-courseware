'use strict';
/* 七上 3.5 去括号 · 本课互动：卖报纸三笔钱、填表随机验证、去括号“符号翻转”演示（含错误示范 + 代入检验）。
 * 金额用“分”做整数运算；代入检验按字母的取值精确计算。通用部分见 ../shared/math.js */
const { slider, tex } = MathKit;
const $ = (id) => document.getElementById(id);

/* ---------- 第 3 页：卖报纸 ---------- */
function initPaper() {
  const s = { a: 200, b: 150 };
  const yuan = (fen) => String(+(fen / 100).toFixed(2));
  const draw = () => {
    s.b = Math.min(s.b, s.a);
    $('npB').value = s.b;
    $('npAV').textContent = s.a; $('npBV').textContent = s.b;
    const out = 40 * s.a; const sell = 50 * s.b; const back = 20 * (s.a - s.b);
    const max = 50 * 300;
    const bar = (cls, label, v, sign) => `<div class="mrow"><span>${label}</span><div class="bar"><i class="${cls}" style="width:${(100 * v) / max}%"></i></div><b class="v">${sign}${yuan(v)}</b></div>`;
    $('money').innerHTML = bar('m-out', '购进支出', out, '−') + bar('m-in', '售出收入', sell, '+') + bar('m-back', '退回收入', back, '+');
    const p = sell + back - out;
    const m = $('npMsg');
    m.className = `tip feedback ${p >= 0 ? 'fb-ok' : 'fb-warn'}`;
    m.innerHTML = `赢利 $=-${yuan(out)}+${yuan(sell)}+${yuan(back)}=${yuan(p)}$（元）${p < 0 ? '，卖得太少就亏了' : ''}`;
    tex(m);
  };
  slider($('npA'), (v) => { s.a = v; draw(); });
  slider($('npB'), (v) => { s.b = v; draw(); });
}

/* ---------- 第 4 页：随机换几组数 ---------- */
function initRandom() {
  let rows = [];
  const MAX_ROWS = 3;
  const rnd = () => Math.floor(Math.random() * 19) - 9;
  const show = (v) => String(v).replace('-', '−');
  const draw = () => {
    $('rndRows').innerHTML = rows.map(([a, b, c]) => `<tr class="rnd"><td>${show(a)}</td><td>${show(b)}</td><td>${show(c)}</td><td class="pa">${show(a + (-b + c))}</td><td class="pa">${show(a - b + c)}</td><td class="pb">${show(a - (-b + c))}</td><td class="pb">${show(a + b - c)}</td></tr>`).join('');
  };
  $('rndBtn').addEventListener('click', () => { rows = [...rows, [rnd(), rnd(), rnd()]].slice(-MAX_ROWS); draw(); });
  $('rndClr').addEventListener('click', () => { rows = []; draw(); });
}

/* ---------- 第 6 页：去括号演示 ---------- */
const T = (c, ...v) => ({ c, v });
const tm = (t) => ({ type: 't', t });
const grp = (k, ...terms) => ({ type: 'g', k, terms });
const EXPRS = [
  { name: '(1) 5c² − (a² + b² − ab)', segs: [tm(T(5, ['c', 2])), grp(-1, T(1, ['a', 2]), T(1, ['b', 2]), T(-1, ['a', 1], ['b', 1]))] },
  { name: '(2) −m + (−n + p − q)', segs: [tm(T(-1, ['m', 1])), grp(1, T(-1, ['n', 1]), T(1, ['p', 1]), T(-1, ['q', 1]))] },
  { name: '(3) xy − (−2x² − y² + z²)', segs: [tm(T(1, ['x', 1], ['y', 1])), grp(-1, T(-2, ['x', 2]), T(-1, ['y', 2]), T(1, ['z', 2]))] },
  { name: '(4) −(2x − y) + (z − 1)', segs: [grp(-1, T(2, ['x', 1]), T(-1, ['y', 1])), grp(1, T(1, ['z', 1]), T(-1))] },
  { name: '例 (2) 2x² + 3(2x − x²)', segs: [tm(T(2, ['x', 2])), grp(3, T(2, ['x', 1]), T(-1, ['x', 2]))] },
];
const VALS = { a: 2, b: -1, c: 3, m: 2, n: -1, p: 3, q: 1, x: 2, y: -1, z: 3 };

const lettersTex = (t) => t.v.map(([x, e]) => (e === 1 ? x : `${x}^{${e}}`)).join('');
function termTex(t, first) {
  const sign = t.c < 0 ? '-' : (first ? '' : '+');
  const a = Math.abs(t.c);
  if (!t.v.length) return sign + a;
  return sign + (a === 1 ? '' : a) + lettersTex(t);
}
const kTex = (k, first) => (k === 1 ? (first ? '' : '+') : k === -1 ? '-' : `${k > 0 && !first ? '+' : ''}${k}`);
const evalTerm = (t) => t.v.reduce((acc, [x, e]) => acc * VALS[x] ** e, t.c);
const evalSegs = (segs) => segs.reduce((acc, sg) => acc + (sg.type === 't' ? evalTerm(sg.t) : sg.k * sg.terms.reduce((s, t) => s + evalTerm(t), 0)), 0);
const usedVals = (segs) => {
  const xs = new Set();
  segs.forEach((sg) => (sg.type === 't' ? [sg.t] : sg.terms).forEach((t) => t.v.forEach(([x]) => xs.add(x))));
  return [...xs].sort().map((x) => `${x}=${VALS[x]}`).join('，');
};

function initFlip() {
  const s = { k: 0, timers: [] };
  const STEP_MS = 650;
  const stop = () => { s.timers.forEach(clearTimeout); s.timers = []; };
  const later = (ms, f) => { s.timers = [...s.timers, setTimeout(f, ms)]; };
  // 原式一行 + “=”后面的工作行：工作行里括号内的每一项是一个 span，逐个替换
  function build() {
    const ex = EXPRS[s.k];
    const orig = ex.segs.map((sg, i) => (sg.type === 't' ? termTex(sg.t, i === 0) : `${kTex(sg.k, i === 0)}(${sg.terms.map((t, j) => termTex(t, j === 0)).join('')})`)).join('');
    const work = ex.segs.map((sg, i) => {
      if (sg.type === 't') return `<span class="fl-t">$${termTex(sg.t, i === 0)}$</span>`;
      const inner = sg.terms.map((t, j) => `<span class="fl-t in" data-g="${i}" data-j="${j}">$${termTex(t, j === 0)}$</span>`).join('');
      return `<span class="fl-g" data-g="${i}"><span class="fl-k">$${kTex(sg.k, i === 0) || '+'}$<em class="fl-badge">×(${sg.k > 0 ? '+' : ''}${sg.k})</em></span><span class="fl-par">$($</span>${inner}<span class="fl-par">$)$</span></span>`;
    }).join('');
    $('flStage').innerHTML = `<div class="fl-row">$${orig}$</div><div class="fl-row work"><span class="fl-eq">$=$</span>${work}</div>`;
    $('flTabs').innerHTML = EXPRS.map((e, i) => `<button class="btn ${i === s.k ? 'solid' : ''}" type="button" data-k="${i}">${e.name}</button>`).join('');
    $('flCheck').innerHTML = '';
    const m = $('flMsg');
    m.className = 'tip feedback';
    m.textContent = '先说一说：括号前面是什么号？去掉括号后，括号里各项的符号变不变？再点“去括号”。';
    tex($('flStage'));
  }
  function run(wrong) {
    stop();
    build();
    const ex = EXPRS[s.k];
    const stage = $('flStage');
    const firstInner = ex.segs[0].type === 'g';
    const result = [];
    // 第一步：括号前的符号亮起
    later(100, () => stage.querySelectorAll('.fl-g').forEach((g) => g.classList.add('hot')));
    let t = STEP_MS;
    ex.segs.forEach((sg, i) => {
      if (sg.type === 't') { result.push(sg.t); return; }
      sg.terms.forEach((term, j) => {
        const applied = wrong && j > 0 ? term : { ...term, c: term.c * sg.k };
        result.push(applied);
        const isFirst = firstInner && i === 0 && j === 0;
        const changed = Math.sign(applied.c) !== Math.sign(term.c) || Math.abs(applied.c) !== Math.abs(term.c);
        t += STEP_MS;
        later(t, () => {
          const el = stage.querySelector(`.fl-t.in[data-g="${i}"][data-j="${j}"]`);
          el.innerHTML = `$${termTex(applied, isFirst)}$`;
          el.classList.add(changed ? 'chg' : 'same');
          tex(el);
        });
      });
    });
    t += STEP_MS;
    later(t, () => {
      stage.querySelectorAll('.fl-g').forEach((g) => g.classList.add('done'));
      const m = $('flMsg');
      const lhs = evalSegs(ex.segs);
      const rhs = result.reduce((acc, x) => acc + evalTerm(x), 0);
      const ok = lhs === rhs;
      m.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
      m.innerHTML = wrong
        ? '只改了括号里第一项——后面的项没有乘到，错了！'
        : `去括号结果：$${result.map((x, k) => termTex(x, k === 0)).join('')}$`;
      $('flCheck').innerHTML = `<b>代入检验</b>（取 ${usedVals(ex.segs)}）：原式 $=${lhs}$，去括号后 $=${rhs}$　<span class="${ok ? 'ok' : 'no'}">${ok ? '相等 ✓' : '不相等 ✗'}</span>`;
      tex(m); tex($('flCheck'));
    });
  }
  $('flTabs').addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (!b) return; stop(); s.k = +b.dataset.k; build(); });
  $('flGo').addEventListener('click', () => run(false));
  $('flWrong').addEventListener('click', () => run(true));
  $('flBack').addEventListener('click', () => { stop(); build(); });
  build();
}

window.LESSON = {
  init() {
    initPaper();
    initRandom();
    initFlip();
  },
};
