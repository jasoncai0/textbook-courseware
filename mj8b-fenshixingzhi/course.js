'use strict';
/* 八下 10.2 分式的基本性质 · 本课互动：同乘 C 实验台、三处符号开关、因式消消乐（约分）。
 * 所有数值用 ../shared/mfrac.js 精确计算（BigInt 有理数）。 */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);
const { val, eq } = MFrac;
const T = MFrac.tex;

/* ---------- 第 4 页：同乘 C ---------- */
const SAMPLES = [{ a: '2', b: '3' }, { a: '-1/2', b: '5' }, { a: '1', b: '4' }, { a: '3', b: '-2' }];
const CS = [
  { c: '2', t: '2' }, { c: 'a', t: 'a' }, { c: 'b+1', t: 'b+1' }, { c: '0', t: '0' }, { c: 'a-1', t: 'a-1' },
];
function initMul() {
  let cur = CS[1];
  const render = () => {
    const wrap = (t) => (/[+-]/.test(t) ? `(${t})` : t);
    $('mulF').innerHTML = `$\\dfrac ba\\ \\longrightarrow\\ \\dfrac{b\\cdot ${wrap(cur.t)}}{a\\cdot ${wrap(cur.t)}}$`;
    let bad = 0;
    const rows = SAMPLES.map((env) => {
      const v0 = val('b/a', env);
      const v1 = val(`(b*(${cur.c}))/(a*(${cur.c}))`, env);
      const ok = eq(v0, v1);
      if (!ok) bad += 1;
      return `<tr class="${ok ? '' : 'bad'}"><td>$a=${T(MFrac.q(env.a))},\\ b=${env.b}$</td><td>$${T(v0)}$</td><td>${v1 ? `$${T(v1)}$` : '无意义'}</td><td>${ok ? '相等' : '✗'}</td></tr>`;
    }).join('');
    $('mulTab').innerHTML = `<table class="mtab"><tr><th>取值</th><th>$\\dfrac ba$</th><th>同乘 $C$ 后</th><th>比较</th></tr>${rows}</table>`;
    const msg = $('mulMsg');
    msg.className = `tip feedback ${bad ? 'fb-warn' : 'fb-ok'}`;
    msg.innerHTML = !bad ? `$C=${cur.t}$：每一组值都相等。`
      : cur.c === '0' ? '$C=0$：分母变成 0，每一组都无意义！'
        : `$C=${cur.t}$：有 ${bad} 组不相等——看看那一组 $C$ 的值是多少？`;
    [$('mulF'), $('mulTab'), msg].forEach(tex);
  };
  $('mulBtns').innerHTML = CS.map((c, i) => `<button type="button" class="btn${c === cur ? ' solid' : ''}" data-i="${i}">$C=${c.t}$</button>`).join('');
  tex($('mulBtns'));
  $('mulBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-i]');
    if (!btn) return;
    cur = CS[+btn.dataset.i];
    $('mulBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    render();
  });
  render();
}

/* ---------- 第 7 页：三处符号 ---------- */
function initSigns() {
  const s = [false, true, true]; // 分式前、分子、分母是否带“−”；初始为 (−2a)/(−3b)
  const ENV = { a: '2', b: '5' };
  const base = val('(-2a)/(-3b)', ENV);
  const NAMES = ['分式前', '分子', '分母'];
  const render = () => {
    const str = `${s[0] ? '-' : ''}(${s[1] ? '-' : ''}2a)/(${s[2] ? '-' : ''}3b)`;
    const v = val(str, ENV);
    $('sgnF').innerHTML = `$${s[0] ? '-' : ''}\\dfrac{${s[1] ? '-' : ''}2a}{${s[2] ? '-' : ''}3b}$`;
    const same = eq(v, base);
    const msg = $('sgnMsg');
    msg.className = `tip feedback ${same ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = `代入 $a=2,\\ b=5$：值为 $${T(v)}$，原式 $\\dfrac{-2a}{-3b}$ 的值为 $${T(base)}$——${same ? '<b>值不变</b>' : '<b>值变了</b>（变成相反数）'}。${same && !s[1] && !s[2] ? '分子、分母都不含“−”号了！' : ''}`;
    $('sgnBtns').querySelectorAll('.btn').forEach((b, i) => { b.textContent = `${NAMES[i]}：${s[i] ? '−' : '+'}`; b.classList.toggle('solid', s[i]); });
    tex($('sgnF')); tex(msg);
  };
  $('sgnBtns').innerHTML = NAMES.map((n, i) => `<button type="button" class="btn" data-i="${i}">${n}</button>`).join('');
  $('sgnBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-i]');
    if (!btn) return;
    s[+btn.dataset.i] = !s[+btn.dataset.i];
    render();
  });
  render();
}

/* ---------- 第 10 页：因式消消乐 ---------- */
// 每个因式：k 用于配对，t 为 TeX，e 为可求值的式子；fact 为“分解因式”这一步的说明
const F = (k, t = k, e = k) => ({ k, t, e });
const CX = [
  {
    tab: '例4(1)', orig: '36ab^3c/(6abc^2)', otex: '\\dfrac{36ab^3c}{6abc^2}', fact: '$36=6\\times6$，$b^3=b\\cdot b\\cdot b$，$c^2=c\\cdot c$',
    num: [F('6'), F('6'), F('a'), F('b'), F('b'), F('b'), F('c')], den: [F('6'), F('a'), F('b'), F('c'), F('c')],
  },
  {
    tab: '例4(2)', orig: '(a+b)^3/((a+b)(a-b))', otex: '\\dfrac{(a+b)^3}{(a+b)(a-b)}', fact: '$(a+b)^3=(a+b)(a+b)(a+b)$',
    num: [F('(a+b)'), F('(a+b)'), F('(a+b)')], den: [F('(a+b)'), F('(a-b)')],
  },
  {
    tab: '例5(1)', orig: '(ma+mb-mc)/(a+b-c)', otex: '\\dfrac{ma+mb-mc}{a+b-c}', fact: '提公因式：$ma+mb-mc=m(a+b-c)$',
    num: [F('m'), F('(a+b-c)')], den: [F('(a+b-c)')],
  },
  {
    tab: '例5(2)', orig: '(a^2-2a+1)/(1-a^2)', otex: '\\dfrac{a^2-2a+1}{1-a^2}', fact: '$a^2-2a+1=(a-1)^2$，$1-a^2=-(a-1)(a+1)$',
    num: [F('(a-1)'), F('(a-1)')], den: [F('-1', '-1', '(-1)'), F('(a-1)'), F('(a+1)')],
  },
  {
    tab: '练习1(3)', orig: '18(b-a)^2/(24(a-b))', otex: '\\dfrac{18(b-a)^2}{24(a-b)}', fact: '$18=6\\times3$，$24=6\\times4$，$(b-a)^2=(a-b)^2$',
    num: [F('6'), F('3'), F('(a-b)'), F('(a-b)')], den: [F('6'), F('4'), F('(a-b)')],
  },
  {
    tab: '练习2(1)', orig: '(a^2-4ab+4b^2)/(a^2-4b^2)', otex: '\\dfrac{a^2-4ab+4b^2}{a^2-4b^2}', fact: '$a^2-4ab+4b^2=(a-2b)^2$，$a^2-4b^2=(a+2b)(a-2b)$',
    num: [F('(a-2b)'), F('(a-2b)')], den: [F('(a+2b)'), F('(a-2b)')],
  },
];
const VARS = ['a', 'b', 'c', 'm'];

/** 剩下的因式 → TeX 与可求值式子（相同因式合并成乘方，−1 提到分式前面） */
function product(list) {
  const groups = [];
  list.forEach((f) => { const g = groups.find((x) => x.f.k === f.k); if (g) g.n += 1; else groups.push({ f, n: 1 }); });
  const parts = groups.filter((g) => g.f.k !== '-1');
  const neg = groups.filter((g) => g.f.k === '-1').reduce((s, g) => s + g.n, 0) % 2 === 1;
  const nums = parts.filter((g) => /^\d+$/.test(g.f.k));
  const coef = nums.reduce((s, g) => s * (+g.f.k) ** g.n, 1);
  const rest = parts.filter((g) => !/^\d+$/.test(g.f.k));
  const onlyParen = rest.length === 1 && rest[0].n === 1 && coef === 1;
  const t = (coef !== 1 || !rest.length ? String(coef) : '')
    + rest.map((g) => `${onlyParen ? g.f.t.replace(/^\((.*)\)$/, '$1') : g.f.t}${g.n > 1 ? `^${g.n}` : ''}`).join('');
  const e = [String(coef), ...rest.map((g) => `${g.f.e}^${g.n}`)].join('*');
  return { t, e, neg };
}

function initCancel() {
  const st = { cur: CX[0], left: null, picked: null };
  const fresh = (c) => ({ num: c.num.map((f) => ({ ...f, gone: false })), den: c.den.map((f) => ({ ...f, gone: false })) });
  const render = (note) => {
    const c = st.cur;
    const { num, den } = st.left;
    const chip = (f, side, i) => `<button type="button" class="chip-f${f.gone ? ' gone' : ''}${st.picked && st.picked.side === side && st.picked.i === i ? ' on' : ''}" data-side="${side}" data-i="${i}" ${f.gone ? 'disabled' : ''}>$${f.t}$</button>`;
    $('cxOrig').innerHTML = `原式 $${c.otex}$<br><span class="cx-fact">分解：${c.fact}</span>`;
    $('cxBoard').innerHTML = `<div class="cx-row">${num.map((f, i) => chip(f, 'num', i)).join('<i>·</i>')}</div><div class="cx-bar"></div><div class="cx-row">${den.map((f, i) => chip(f, 'den', i)).join('<i>·</i>')}</div>`;
    const ln = num.filter((f) => !f.gone);
    const ld = den.filter((f) => !f.gone);
    const shared = ln.some((f) => f.k !== '-1' && ld.some((g) => g.k === f.k));
    const msg = $('cxMsg');
    if (note) {
      msg.className = 'tip feedback fb-warn';
      msg.innerHTML = note;
    } else if (shared) {
      msg.className = 'tip feedback';
      msg.innerHTML = st.picked ? '再点另一行里<b>相同</b>的因式。' : '分子、分母里还有相同的因式，继续配对划去。';
    } else {
      const pn = product(ln);
      const pd = product(ld);
      const neg = pn.neg !== pd.neg;
      const dOne = pd.t === '1';
      const t = `${neg ? '-' : ''}${dOne ? pn.t : `\\dfrac{${pn.t}}{${pd.t}}`}`;
      const res = `${neg ? '-' : ''}(${pn.e})/(${pd.e})`;
      const ok = MFrac.same(res, c.orig, VARS).ok;
      msg.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
      msg.innerHTML = `约完了：$${c.otex}=${t}$${dOne ? '（结果是整式）' : '，是最简分式'}。<br>代值检验：代入 4 组值，与原式${ok ? '<b>都相等</b> ✓' : '不相等 ✗'}。`;
    }
    [$('cxOrig'), $('cxBoard'), msg].forEach(tex);
  };
  const pick = (c) => { st.cur = c; st.left = fresh(c); st.picked = null; render(); };
  $('cxTabs').innerHTML = CX.map((c, i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-i="${i}">${c.tab}</button>`).join('');
  $('cxTabs').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-i]');
    if (!btn) return;
    $('cxTabs').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    pick(CX[+btn.dataset.i]);
  });
  $('cxBoard').addEventListener('click', (e) => {
    const btn = e.target.closest('.chip-f');
    if (!btn || btn.disabled) return;
    const side = btn.dataset.side;
    const i = +btn.dataset.i;
    const f = st.left[side][i];
    if (f.k === '-1') { render('$-1$ 不用约：它表示分式的符号，最后提到分式前面。'); return; }
    if (!st.picked || st.picked.side === side) { st.picked = { side, i }; render(); return; }
    const g = st.left[st.picked.side][st.picked.i];
    st.picked = null;
    if (g.k !== f.k) { render(`$${g.t}$ 和 $${f.t}$ 不是同一个因式，不能同时划去！`); return; }
    f.gone = true; g.gone = true;
    render();
  });
  $('cxReset').addEventListener('click', () => pick(st.cur));
  pick(CX[0]);
}

window.LESSON = {
  init() { initMul(); initSigns(); initCancel(); },
};
