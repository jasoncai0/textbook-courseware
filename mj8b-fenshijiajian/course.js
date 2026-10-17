'use strict';
/* 八下 10.3 分式的加减 · 本课互动：代值诊断（一个解答的每一行代入同一个值，精确计算，值第一次变化的那一行就是错步）。
 * 精确计算用 ../shared/mfrac.js。 */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);

// 每一行：[TeX, 可求值的式子]；bad = 第一处错误所在行（-1 表示全对）
const CASES = [
  {
    tab: '病例 1', v: 'a', bad: 1,
    lines: [
      ['\\dfrac{2a-3}{a+1}-\\dfrac{a-2}{a+1}', '(2a-3)/(a+1)-(a-2)/(a+1)'],
      ['=\\dfrac{2a-3-a-2}{a+1}', '(2a-3-a-2)/(a+1)'],
      ['=\\dfrac{a-5}{a+1}', '(a-5)/(a+1)'],
    ],
    why: '分子相减，减去的是整个分子 $a-2$，要先加括号：$(2a-3)-(a-2)=2a-3-a+2$。正确结果 $\\dfrac{a-1}{a+1}$。',
  },
  {
    tab: '病例 2', v: 'x', bad: 2,
    lines: [
      ['\\dfrac2x-\\dfrac5{x^2}', '2/x-5/x^2'],
      ['=\\dfrac{2x}{x^2}-\\dfrac5{x^2}', '2x/x^2-5/x^2'],
      ['=2x-5', '2x-5'],
    ],
    why: '把“计算”当成了解方程“去分母”，分母丢了。应为 $\\dfrac{2x-5}{x^2}$。',
  },
  {
    tab: '病例 3', v: 'x', bad: 2,
    lines: [
      ['\\dfrac{x}{x^2-4}-\\dfrac{1}{2x-4}', 'x/(x^2-4)-1/(2x-4)'],
      ['=\\dfrac{x}{(x+2)(x-2)}-\\dfrac{1}{2(x-2)}', 'x/((x+2)(x-2))-1/(2(x-2))'],
      ['=\\dfrac{2x}{2(x+2)(x-2)}-\\dfrac{1}{2(x+2)(x-2)}', '2x/(2(x+2)(x-2))-1/(2(x+2)(x-2))'],
      ['=\\dfrac{2x-1}{2(x+2)(x-2)}', '(2x-1)/(2(x+2)(x-2))'],
    ],
    why: '通分时 $\\dfrac{1}{2(x-2)}$ 的分母乘了 $x+2$，分子却没乘——应为 $\\dfrac{x+2}{2(x+2)(x-2)}$。',
  },
  {
    tab: '病例 4', v: 'a', bad: 2,
    lines: [
      ['\\dfrac{a+1}{a-1}-\\dfrac{a-1}{a+1}', '(a+1)/(a-1)-(a-1)/(a+1)'],
      ['=\\dfrac{(a+1)^2-(a-1)^2}{(a+1)(a-1)}', '((a+1)^2-(a-1)^2)/((a+1)(a-1))'],
      ['=\\dfrac{a^2+2a+1-a^2-2a+1}{(a+1)(a-1)}', '(a^2+2a+1-a^2-2a+1)/((a+1)(a-1))'],
      ['=\\dfrac{2}{(a+1)(a-1)}', '2/((a+1)(a-1))'],
    ],
    why: '$(a-1)^2$ 展开成 $a^2-2a+1$ 后整体被减，要加括号：$-(a^2-2a+1)=-a^2+2a-1$。正确结果 $\\dfrac{4a}{(a+1)(a-1)}$。',
  },
  {
    tab: '正确示范（例 3）', v: 'x', bad: -1,
    lines: [
      ['\\dfrac{x}{x^2-4}-\\dfrac{1}{2x-4}', 'x/(x^2-4)-1/(2x-4)'],
      ['=\\dfrac{2x}{2(x+2)(x-2)}-\\dfrac{x+2}{2(x+2)(x-2)}', '2x/(2(x+2)(x-2))-(x+2)/(2(x+2)(x-2))'],
      ['=\\dfrac{x-2}{2(x+2)(x-2)}', '(x-2)/(2(x+2)(x-2))'],
      ['=\\dfrac{1}{2(x+2)}', '1/(2(x+2))'],
    ],
    why: '',
  },
];
// 避开 0、±1、±2（会使上面某些分母为 0）
const VALS = ['3', '5', '1/2', '-3', '7/3'];

function initDiagnose() {
  const st = { c: CASES[0], v: VALS[0] };
  const render = () => {
    const { c, v } = st;
    const x = MFrac.q(v);
    const vals = c.lines.map(([, e]) => MFrac.val(e, { [c.v]: x }));
    const first = vals.findIndex((y) => !MFrac.eq(y, vals[0]));
    $('dxTab').innerHTML = `<table class="mtab dx-tab"><tr><th>解答</th><th>$${c.v}=${MFrac.tex(x)}$ 时的值</th></tr>${c.lines.map(([t], i) => `<tr class="${first >= 0 && i >= first ? 'bad' : ''}"><td class="dx-l">$${t}$</td><td>$${MFrac.tex(vals[i])}$${i === first ? ' ← 值变了' : ''}</td></tr>`).join('')}</table>`;
    const msg = $('dxMsg');
    if (first < 0) {
      msg.className = 'tip feedback fb-ok';
      msg.innerHTML = c.bad < 0 ? '每一行的值都相同——这份解答经得起检验。' : `取 $${c.v}=${MFrac.tex(x)}$ 时碰巧每行相等，换一个值再试！`;
    } else {
      msg.className = 'tip feedback fb-warn';
      msg.innerHTML = `<b>诊断：</b>第 ${first + 1} 行出错。${c.why}`;
    }
    [$('dxTab'), msg].forEach(tex);
  };
  const bar = (host, items, label, onPick) => {
    host.innerHTML = items.map((it, i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-i="${i}">${label(it)}</button>`).join('');
    tex(host);
    host.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-i]');
      if (!btn) return;
      host.querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b === btn));
      onPick(items[+btn.dataset.i]);
      render();
    });
  };
  bar($('dxTabs'), CASES, (c) => c.tab, (c) => { st.c = c; });
  bar($('dxVals'), VALS, (v) => `取值 $${MFrac.tex(MFrac.q(v))}$`, (v) => { st.v = v; });
  render();
}

window.LESSON = {
  init() { initDiagnose(); },
};
