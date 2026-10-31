'use strict';
/* 七下 10.4 三元一次方程组 · 本课互动：消元实验室（选两个方程、配系数、相加减，实时显示“三元 → 二元 → 一元”的进度）、
 * 习题 2 的抛物线验证。方程一律用整数系数精确运算，解用 Cramer 法则求出的分数显示。 */
const { board, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const V = ['x', 'y', 'z'];
const CIRC = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫'];

const SETS = [
  [[1, -1, 1, 7], [1, 1, 0, -1], [2, -1, -1, 0]],
  [[1, 1, 1, 22], [3, 1, 0, 47], [1, 0, -4, 2]],
  [[2, -1, -1, 0], [1, 0, 1, 5], [3, 1, -2, 1]],
  [[3, -1, 1, 10], [1, 2, -1, 6], [1, 1, 1, 12]],
];

const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
/** 分数 p/q 的 TeX */
function frac(p, q) {
  if (q < 0) { p = -p; q = -q; }
  const g = gcd(p, q) || 1;
  const [a, b] = [p / g, q / g];
  if (b === 1) return String(a);
  return `${a < 0 ? '-' : ''}\\frac{${Math.abs(a)}}{${b}}`;
}
/** 方程 [a, b, c, d] → “ax + by + cz = d” 的 TeX */
function eqTex(e) {
  let s = '';
  e.slice(0, 3).forEach((k, i) => {
    if (!k) return;
    const abs = Math.abs(k);
    const coef = abs === 1 ? '' : String(abs);
    if (!s) s = `${k < 0 ? '-' : ''}${coef}${V[i]}`;
    else s += ` ${k < 0 ? '-' : '+'} ${coef}${V[i]}`;
  });
  return `${s || '0'}=${e[3]}`;
}
const vars = (e) => [0, 1, 2].filter((i) => e[i] !== 0);
const det3 = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
/** Cramer 法则：返回 [[p, q], …]（x = p/q），无唯一解返回 null */
function solve(sys) {
  const A = sys.map((e) => e.slice(0, 3));
  const D = det3(A);
  if (!D) return null;
  return [0, 1, 2].map((j) => [det3(A.map((r, i) => r.map((v, k) => (k === j ? sys[i][3] : v)))), D]);
}

function initLab() {
  const s = { set: 0, eqs: [], level: 3 };
  const reset = () => {
    s.eqs = SETS[s.set].map((c, i) => ({ c, name: CIRC[i], how: '' }));
    s.level = 3;
    render('选两个方程，各乘一个数，再相加或相减．先想好要消去哪个未知数．');
  };
  // 两个“缺同一个未知数”、且不成比例的方程 → 组成二元一次方程组
  const pairFor = () => {
    for (let v = 0; v < 3; v += 1) {
      const lack = s.eqs.filter((e) => e.c[v] === 0 && vars(e.c).length === 2);
      for (let i = 0; i < lack.length; i += 1) {
        for (let j = i + 1; j < lack.length; j += 1) {
          const [p, q] = [lack[i].c, lack[j].c];
          const o = [0, 1, 2].filter((k) => k !== v);
          if (p[o[0]] * q[o[1]] - p[o[1]] * q[o[0]] !== 0) return { v, a: lack[i], b: lack[j] };
        }
      }
    }
    return null;
  };
  const render = (msg, cls = '') => {
    $('labEqs').innerHTML = s.eqs.map((e) => {
      const n = vars(e.c).length;
      return `<p class="eq ${e.how ? 'new' : ''}"><b>${e.name}</b><span>$${eqTex(e.c)}$</span><i>${e.how || '原方程'} · 含 ${n} 个未知数</i></p>`;
    }).join('');
    const opts = s.eqs.map((e, i) => `<option value="${i}">${e.name}</option>`).join('');
    const [a, b] = [$('mxA').value, $('mxB').value];
    $('mxA').innerHTML = opts; $('mxB').innerHTML = opts;
    $('mxA').value = a && +a < s.eqs.length ? a : 0;
    $('mxB').value = b && +b < s.eqs.length ? b : 1;
    $('labLadder').querySelectorAll('span').forEach((sp) => sp.classList.toggle('on', +sp.dataset.n >= s.level));
    $('labMsg').className = `tip feedback ${cls}`;
    $('labMsg').innerHTML = msg;
    tex($('labEqs')); tex($('labMsg'));
    preview();
  };
  const combo = () => {
    const [i, j] = [+$('mxA').value, +$('mxB').value];
    const m = Math.round(+$('mxM').value) || 0;
    const n = Math.round(+$('mxN').value) * +$('mxOp').value || 0;
    return { i, j, m, n, c: s.eqs[i].c.map((v, k) => m * v + n * s.eqs[j].c[k]) };
  };
  const preview = () => {
    const { i, j, m, n, c } = combo();
    const sign = n < 0 ? '-' : '+';
    const circ = (e) => `\\textcircled{${CIRC.indexOf(e) + 1}}`;
    const t = (k, e) => (Math.abs(k) === 1 ? circ(e) : `${Math.abs(k)}\\times${circ(e)}`);
    $('mxPrev').innerHTML = i === j || !m || !n ? '<span class="muted">请选两个<b>不同</b>的方程，乘数不能为 0</span>'
      : `预览：$${m < 0 ? '-' : ''}${t(m, s.eqs[i].name)}${sign}${t(n, s.eqs[j].name)}$ 得 $${eqTex(c)}$`;
    tex($('mxPrev'));
  };
  const go = () => {
    const { i, j, m, n, c } = combo();
    if (i === j || !m || !n) return;
    const nv = vars(c);
    if (s.eqs.length >= CIRC.length) { render('方程太多了，点“重来”再试．', 'fb-warn'); return; }
    if (!nv.length) {
      render(c[3] === 0 ? `得到 $0=0$：这两个方程乘过之后完全一样，什么也没消出来．换一种配法．` : '得到 $0=' + c[3] + '$，矛盾——检查一下系数．', 'fb-warn');
      return;
    }
    const how = `${m === 1 ? '' : m === -1 ? '−' : m + '×'}${s.eqs[i].name} ${n > 0 ? '+' : '−'} ${Math.abs(n) === 1 ? '' : Math.abs(n) + '×'}${s.eqs[j].name}`;
    s.eqs = [...s.eqs, { c, name: CIRC[s.eqs.length], how }];
    const sol = solve(SETS[s.set]);
    if (nv.length === 1) {
      s.level = 0;
      const v = nv[0];
      const vals = sol.map(([p, q], k) => `${V[k]}=${frac(p, q)}`).join('$，$');
      render(`只剩 $${V[v]}$ 了！$${V[v]}=${frac(c[3], c[v])}$．逐个回代，得原方程组的解：$${vals}$．`, 'fb-ok');
      return;
    }
    const pr = pairFor();
    if (pr) {
      s.level = Math.min(s.level, 2);
      render(`${pr.a.name} 和 ${pr.b.name} 都不含 $${V[pr.v]}$，组成了关于 $${[0, 1, 2].filter((k) => k !== pr.v).map((k) => V[k]).join('$、$')}$ 的<b>二元</b>一次方程组．再消一次就只剩一个未知数．`, 'fb-ok');
      return;
    }
    if (nv.length === 2) {
      const miss = [0, 1, 2].find((k) => !nv.includes(k));
      const other = s.eqs.slice(0, -1).find((e) => vars(e.c).length === 2 && e.c[miss] !== 0);
      render(`消去了 $${V[miss]}$．${other ? `注意：${other.name} 消去的不是 $${V[miss]}$，两次要消<b>同一个</b>未知数．` : `再找另一对方程，也消去 $${V[miss]}$．`}`, other ? 'fb-warn' : '');
      return;
    }
    render('新方程仍含三个未知数，没有消去任何一个．调整乘数，让某个未知数的系数变成 0．', 'fb-warn');
  };
  ['mxA', 'mxB', 'mxM', 'mxN', 'mxOp'].forEach((id) => $(id).addEventListener('input', preview));
  $('mxGo').addEventListener('click', go);
  $('mxReset').addEventListener('click', reset);
  $('labSets').addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (!b) return;
    s.set = +b.dataset.k;
    $('labSets').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    reset();
  });
  reset();
}

/* 第 11 页：y = x² − 2x + 2 经过三个已知点 */
let parab = null;
function initParab() {
  const det = $('parab').closest('.hint-ladder').querySelector('details:last-of-type');
  parab = board($('parab'), { x: [-2.2, 3.4], y: [-0.8, 6.4], w: 300, h: 300 * (7.2 / 5.6), ticks: 1 });
  const c = parab.fn((x) => x * x - 2 * x + 2, { cls: 'c1' });
  [[-1, 5], [1, 1], [2, 2]].forEach((p) => parab.pt(p, { cls: 'c2', r: 6 }));
  parab.onUpdate = () => { c.style.display = det.open ? '' : 'none'; };
  det.addEventListener('toggle', () => parab.update());
  parab.update();
}

window.LESSON = {
  init() { initLab(); initParab(); },
  onRender(slide) { if (parab && slide.contains(parab.svg)) parab.update(); },
};
