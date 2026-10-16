'use strict';
/* 七下 8.3 同底数幂的除法 · 本课互动：
 * ① 约分器：a^m ÷ a^n 写成分数，分子 m 个 a、分母 n 个 a 成对约去（m > n、m = n、m < n 三种情况都能看）；
 * ② 指数阶梯：2^4 → 2^-3 每下一行除以 2，长条按真实比例（2^4 = 16 为满格）；
 * ③ 刻度尺：10 cm、每 1 mm 一小格，按比例绘制。通用部分见 ../shared/math.js */
const { slider, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';

/* ---------- 第 4 页：约分器 ---------- */
function initCancel() {
  const s = { base: 'a', m: 5, n: 2, done: false };
  const STAGGER = 180; // ms，一对一对约去

  const render = () => {
    const B = s.base;
    const num = B === 'a' ? '' : 'num';
    const chips = (k) => Array.from({ length: k }, () => `<span class="chip-a ${num}">${B}</span>`).join('');
    $('numRow').innerHTML = chips(s.m);
    $('denRow').innerHTML = chips(s.n);
    $('cancelM').textContent = s.m; $('cancelN').textContent = s.n;
    $('cancelGo').textContent = s.done ? '还原' : '一对一对约去';
    $('cancelBox').querySelectorAll('[data-base]').forEach((b) => b.classList.toggle('solid', b.dataset.base === B));
    const k = Math.min(s.m, s.n);
    if (s.done) {
      [$('numRow'), $('denRow')].forEach((row) => [...row.children].slice(0, k).forEach((c, i) => {
        c.style.transitionDelay = `${i * STAGGER}ms`;
        requestAnimationFrame(() => c.classList.add('gone'));
      }));
    }
    const frac = `\\dfrac{${B}^{${s.m}}}{${B}^{${s.n}}}`;
    const chk = (e) => (B === 'a' ? '' : `\\quad\\left(\\dfrac{${2 ** s.m}}{${2 ** s.n}}=${e}\\right)`);
    let res = `$${frac}=\\ ?$`;
    let msg = `分子 ${s.m} 个 ${B}，分母 ${s.n} 个 ${B}（${B === 'a' ? 'a ≠ 0' : '2 ≠ 0'}，才能做除数）`;
    if (s.done && s.m > s.n) {
      res = `$${frac}=${B}^{${s.m - s.n}}${chk(2 ** (s.m - s.n))}$`;
      msg = `约去 ${k} 对，分子剩下 ${s.m} − ${s.n} = ${s.m - s.n} 个 ${B}`;
    } else if (s.done && s.m === s.n) {
      res = `$${frac}=1\\qquad\\text{照“指数相减”：}${B}^{${s.m}-${s.n}}=${B}^{0}\\ ?$`;
      msg = `全部约去，结果是 1。“${B} 的 0 次方”是什么意思？——第 8 页再说`;
    } else if (s.done) {
      res = `$${frac}=\\dfrac{1}{${B}^{${s.n - s.m}}}\\qquad\\text{照“指数相减”：}${B}^{${s.m}-${s.n}}=${B}^{${s.m - s.n}}\\ ?$`;
      msg = `分子全部约去（剩 1），分母还剩 ${s.n - s.m} 个 ${B}。负指数是什么意思？——第 9 页再说`;
    }
    $('cancelRes').innerHTML = res;
    $('cancelMsg').textContent = msg;
    tex($('cancelRes'));
  };

  slider($('cancelMi'), (v) => { s.m = v; s.done = false; render(); });
  slider($('cancelNi'), (v) => { s.n = v; s.done = false; render(); });
  $('cancelGo').addEventListener('click', () => { s.done = !s.done; render(); });
  $('cancelBox').addEventListener('click', (e) => {
    const b = e.target.closest('[data-base]');
    if (!b) return;
    s.base = b.dataset.base;
    s.done = false;
    render();
  });
}

/* ---------- 第 9 页：指数阶梯 ---------- */
const LADDER = [4, 3, 2, 1, 0, -1, -2, -3];
const valTex = (n) => (n >= 0 ? String(2 ** n) : `\\dfrac1{${2 ** -n}}`);

function initLadder() {
  const host = $('ladder');
  host.innerHTML = LADDER.map((n) => {
    const cls = n > 0 ? '' : n === 0 ? 'zero' : 'neg';
    const pct = (2 ** n / 16) * 100; // 2^4 = 16 为满格，比例精确
    return `<span class="ex ${n <= 0 ? 'q' : ''}" data-n="${n}">$2^{${n}}$</span><span class="vl" data-n="${n}">$=${valTex(n)}$</span><span class="track ${cls}" data-n="${n}"><i class="fill" style="width:${pct}%"></i></span>`;
  }).join('');
  tex(host);
  slider($('ladK'), (k) => {
    host.querySelectorAll('[data-n]').forEach((e) => e.classList.toggle('hide', +e.dataset.n < k));
    $('ladKV').innerHTML = `$2^{${k}}=${valTex(k)}$`;
    tex($('ladKV'));
  });
}

/* ---------- 第 14 页：刻度尺（1 mm = 5.6 单位） ---------- */
function initRuler() {
  const svg = $('ruler');
  const MM = 5.6;
  const X0 = 14;
  const mk = (tag, a) => { const e = document.createElementNS(NS, tag); Object.entries(a).forEach(([k, v]) => e.setAttribute(k, v)); svg.appendChild(e); return e; };
  mk('rect', { x: X0 - 8, y: 2, width: 100 * MM + 40, height: 46, fill: '#fbf7ec', stroke: '#9fb0bf', rx: 3 });
  for (let i = 0; i <= 100; i++) {
    const h = i % 10 === 0 ? 18 : i % 5 === 0 ? 13 : 8;
    mk('line', { class: 'tk', x1: X0 + i * MM, x2: X0 + i * MM, y1: 2, y2: 2 + h });
    if (i % 10 === 0) mk('text', { x: X0 + i * MM, y: 36, 'text-anchor': 'middle' }).textContent = i / 10;
  }
  mk('text', { x: X0 + 100 * MM + 18, y: 36, 'text-anchor': 'middle' }).textContent = 'cm';
  // 高亮 1 mm 的一小格
  mk('rect', { x: X0 + 40 * MM, y: 2, width: MM, height: 10, fill: 'rgba(217,113,28,.6)' });
}

window.LESSON = {
  init() {
    initCancel();
    initLadder();
    initRuler();
  },
};
