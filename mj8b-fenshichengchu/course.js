'use strict';
/* 八下 10.4 分式的乘除 · 本课互动：运算顺序对比表、化简求值“两条路”比较器（直接代入 vs 先化简）。
 * 精确计算用 ../shared/mfrac.js。 */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);
const T = MFrac.tex;

/* ---------- 第 7 页：a ÷ b · 1/b 两种顺序 ---------- */
const ORD = [['12', '2'], ['5', '3'], ['6', '-1'], ['1', '1/2']];
function initOrder() {
  const render = (k) => {
    const [a, b] = ORD[k];
    const env = { a, b };
    const right = MFrac.val('(a/b)*(1/b)', env);
    const wrong = MFrac.val('a/(b*(1/b))', env);
    const same = MFrac.eq(right, wrong);
    $('ordTab').innerHTML = `<table class="mtab"><tr><th>$a=${T(MFrac.q(a))},\\ b=${T(MFrac.q(b))}$</th><th>结果</th></tr>`
      + `<tr><td>从左到右：$(a\\div b)\\cdot\\dfrac1b$</td><td class="good">$${T(right)}$</td></tr>`
      + `<tr><td>先算后面：$a\\div\\left(b\\cdot\\dfrac1b\\right)$</td><td class="${same ? '' : 'bad'}">$${T(wrong)}$</td></tr></table>`
      + `<p class="small-p">${same ? '这一组碰巧相等（$b^2=1$），换一组看看。' : '两种顺序结果不同，运算顺序不能随意改变。'}</p>`;
    tex($('ordTab'));
  };
  $('ordBtns').innerHTML = ORD.map(([a, b], i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-i="${i}">$a=${T(MFrac.q(a))},b=${T(MFrac.q(b))}$</button>`).join('');
  tex($('ordBtns'));
  $('ordBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-i]');
    if (!btn) return;
    $('ordBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    render(+btn.dataset.i);
  });
  render(0);
}

/* ---------- 第 9 页：两条路 ---------- */
const F1 = '(a^2+ab-ac)/(a^2-ab)';
const F2 = '(a-b-c)/(2ab+a^2+b^2)';
const F3 = '(a+b-c)/(a^2-b^2)';
const SIMPLE = '(a-b-c)/(a+b)';
const PRESETS = [
  { tab: '课本 a=10, b=5, c=−4', v: { a: 10, b: 5, c: -4 } },
  { tab: 'a = b', v: { a: 3, b: 3, c: 1 } },
  { tab: 'a + b = c', v: { a: 4, b: 2, c: 6 } },
  { tab: 'a = −b', v: { a: 3, b: -3, c: 2 } },
];
const LIM = [-9, 12];

function initTwoWays() {
  const s = { a: 10, b: 5, c: -4 };
  const render = () => {
    const env = { a: String(s.a), b: String(s.b), c: String(s.c) };
    const [v1, v2, v3] = [F1, F2, F3].map((f) => MFrac.val(f, env));
    const direct = MFrac.div(MFrac.mul(v1, v2), v3);
    const simple = MFrac.val(SIMPLE, env);
    const show = (v) => (v ? `$${T(v)}$` : '无意义');
    const cell = (v) => `<td class="${v ? '' : 'bad'}">${show(v)}</td>`;
    const divZero = v3 && v3.n === 0n;
    $('twTab').innerHTML = `<table class="mtab tw-tab">`
      + `<tr><th colspan="2">路一：直接代入原式</th></tr>`
      + `<tr><td>$\\dfrac{a^2+ab-ac}{a^2-ab}$</td>${cell(v1)}</tr>`
      + `<tr><td>$\\dfrac{a-b-c}{2ab+a^2+b^2}$</td>${cell(v2)}</tr>`
      + `<tr><td>除式 $\\dfrac{a+b-c}{a^2-b^2}$</td><td class="${v3 && !divZero ? '' : 'bad'}">${show(v3)}${divZero ? '（除数为 0）' : ''}</td></tr>`
      + `<tr class="sumrow"><td>原式的值</td>${cell(direct)}</tr>`
      + `<tr><th colspan="2">路二：代入化简结果</th></tr>`
      + `<tr class="sumrow"><td>$\\dfrac{a-b-c}{a+b}$</td>${cell(simple)}</tr></table>`;
    const msg = $('twMsg');
    if (direct && simple && MFrac.eq(direct, simple)) {
      msg.className = 'tip feedback fb-ok';
      msg.innerHTML = `两条路结果相同：$${T(direct)}$。化简这条路只需算一个简单分式。`;
    } else if (!direct && simple) {
      const why = !v1 ? '$a^2-ab=a(a-b)=0$' : !v2 ? '$(a+b)^2=0$' : !v3 ? '$a^2-b^2=0$' : '除式 $\\dfrac{a+b-c}{a^2-b^2}=0$，不能做除数';
      msg.className = 'tip feedback fb-warn';
      msg.innerHTML = `<b>原式无意义</b>（${why}），化简式却得到 $${T(simple)}$——这组值不能用来求值！`;
    } else {
      msg.className = 'tip feedback fb-warn';
      msg.innerHTML = '两条路都无意义：分母为 0。';
    }
    $('twSteps').querySelectorAll('[data-v]').forEach((el) => { el.textContent = s[el.dataset.v]; });
    [$('twTab'), msg].forEach(tex);
  };
  $('twSteps').innerHTML = ['a', 'b', 'c'].map((k) => `<span class="stp"><i>${k}</i><button type="button" class="btn" data-k="${k}" data-d="-1">−</button><b data-v="${k}"></b><button type="button" class="btn" data-k="${k}" data-d="1">+</button></span>`).join('');
  $('twSteps').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    const k = btn.dataset.k;
    s[k] = Math.max(LIM[0], Math.min(LIM[1], s[k] + +btn.dataset.d));
    $('twPre').querySelectorAll('.btn').forEach((x) => x.classList.remove('solid'));
    render();
  });
  $('twPre').innerHTML = PRESETS.map((p, i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-i="${i}">${p.tab}</button>`).join('');
  $('twPre').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-i]');
    if (!btn) return;
    Object.assign(s, PRESETS[+btn.dataset.i].v);
    $('twPre').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    render();
  });
  render();
}

window.LESSON = {
  init() { initOrder(); initTwoWays(); },
};
