'use strict';
/* 七下 10.3 解二元一次方程组 · 本课互动：消元操作台（①×k₁、②×k₂ 后相加或相减，整数精确运算，分数解约分显示）。
 * 通用部分见 ../shared/math.js */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);

/* 方程 a·u + b·v = c，vars = [u, v] */
const SYSTEMS = [
  { name: '例 2', vars: ['x', 'y'], e1: [1, 2, 1], e2: [3, -2, 5] },
  { name: '例 3', vars: ['x', 'y'], e1: [5, -2, 4], e2: [2, -3, -5] },
  { name: '练 (2)', vars: ['x', 'y'], e1: [3, -1, -4], e2: [1, -2, -3] },
  { name: '练 (3)', vars: ['x', 'z'], e1: [6, 5, 25], e2: [3, 4, 20] },
  { name: '练 (4)', vars: ['s', 't'], e1: [3, 4, 7], e2: [-2, 3, 1] },
  { name: '习题 2(2)', vars: ['x', 'y'], e1: [3, 5, 25], e2: [4, 3, 15] },
];
const MAX_K = 6;

const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
function frac(n, d) {
  const sgn = d < 0 ? -1 : 1;
  const g = gcd(n, d) || 1;
  const [p, q] = [(sgn * n) / g, Math.abs(d) / g];
  return q === 1 ? String(p) : `${p < 0 ? '-' : ''}\\dfrac{${Math.abs(p)}}{${q}}`;
}

/** a·u + b·v = c 的 TeX；系数为 0 的项省略 */
function eqTex([a, b, c], [u, v]) {
  const term = (k, x, lead) => {
    if (k === 0) return '';
    const abs = Math.abs(k) === 1 ? '' : Math.abs(k);
    const sign = k < 0 ? '-' : (lead ? '' : '+');
    return `${sign}${abs}${x}`;
  };
  const left = `${term(a, u, true)}${term(b, v, a === 0)}` || '0';
  return `${left}=${c}`;
}

function initDesk() {
  const s = { k: 1, k1: 1, k2: 1, op: '' };
  const sys = () => SYSTEMS[s.k];
  const scaled = (e, m) => e.map((x) => x * m);

  const pick = $('deskPick');
  pick.innerHTML = SYSTEMS.map((p, i) => `<button class="btn" type="button" data-k="${i}">${p.name}</button>`).join('');
  pick.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    Object.assign(s, { k: +btn.dataset.k, k1: 1, k2: 1, op: '' });
    render();
  });

  const stepper = (host, label, key) => {
    host.innerHTML = `<span>${label}</span><button type="button" aria-label="减少">−</button><b></b><button type="button" aria-label="增加">+</button>`;
    const [minus, plus] = host.querySelectorAll('button');
    // 乘数跳过 0
    const bump = (d) => { let v = s[key] + d; if (v === 0) v += d; s[key] = Math.max(-MAX_K, Math.min(MAX_K, v)); s.op = ''; render(); };
    minus.addEventListener('click', () => bump(-1));
    plus.addEventListener('click', () => bump(1));
    return () => { host.querySelector('b').textContent = s[key]; };
  };
  const r1 = stepper($('deskK1'), '①×', 'k1');
  const r2 = stepper($('deskK2'), '②×', 'k2');
  $('deskAdd').addEventListener('click', () => { s.op = '+'; render(); });
  $('deskSub').addEventListener('click', () => { s.op = '-'; render(); });

  function solveText(res, vars, e1) {
    const [a, b, c] = res;
    if (a === 0 && b === 0) return c === 0 ? '两个未知数都被消掉了，得到 0 = 0——换一组乘数试试。' : '出现矛盾。';
    if (a !== 0 && b !== 0) return `两个未知数都还在，没有消元。让 $${vars[0]}$ 或 $${vars[1]}$ 的系数<b>绝对值相等</b>再试。`;
    // 消去一个，解出另一个，再代回①求第一个
    const [gone, keep, coef] = a === 0 ? [vars[0], vars[1], b] : [vars[1], vars[0], a];
    const val = [c, coef]; // keep = c / coef
    const [a1, b1, c1] = e1;
    // 代入①：若 keep 是 v，则 a1·u = c1 − b1·val；若 keep 是 u，则 b1·v = c1 − a1·val
    const [kc, oc] = keep === vars[1] ? [b1, a1] : [a1, b1];
    const otherNum = c1 * val[1] - kc * val[0];
    const otherDen = oc * val[1];
    const other = keep === vars[1] ? vars[0] : vars[1];
    const out = { [keep]: frac(val[0], val[1]), [other]: oc === 0 ? '?' : frac(otherNum, otherDen) };
    return `<span class="gone">消去了 $${gone}$！</span> $${eqTex(res, vars)}$，$${keep}=${out[keep]}$；代入①得 $${other}=${out[other]}$．解：$\\begin{cases}${vars[0]}=${out[vars[0]]}\\\\${vars[1]}=${out[vars[1]]}\\end{cases}$`;
  }

  function render() {
    const { vars, e1, e2 } = sys();
    pick.querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', +b.dataset.k === s.k));
    r1(); r2();
    const e3 = scaled(e1, s.k1);
    const e4 = scaled(e2, s.k2);
    const rows = [['①', e1, ''], ['②', e2, ''], ['③', e3, `①×${s.k1}`], ['④', e4, `②×${s.k2}`]];
    let html = rows.map(([n, e, w]) => `<span class="no">${n}</span><span>$${eqTex(e, vars)}$</span><span class="muted k">${w}</span>`).join('');
    const msg = $('deskMsg');
    if (s.op) {
      const res = e3.map((x, i) => (s.op === '+' ? x + e4[i] : x - e4[i]));
      html += `<span class="no">⑤</span><span>$${eqTex(res, vars)}$</span><span class="muted k">③${s.op === '+' ? '+' : '−'}④</span>`;
      const ok = (res[0] === 0) !== (res[1] === 0);
      msg.className = `tip feedback desk-res ${ok ? 'fb-ok' : 'fb-warn'}`;
      msg.innerHTML = solveText(res, vars, e1);
    } else {
      msg.className = 'tip feedback desk-res';
      msg.innerHTML = '选好乘数，再点“③ + ④”或“③ − ④”。';
    }
    $('deskEq').innerHTML = html;
    [$('deskEq'), msg].forEach(tex);
  }
  render();
}

window.LESSON = {
  init() { initDesk(); },
};
