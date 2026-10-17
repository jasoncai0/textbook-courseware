'use strict';
/* 五下 等式与方程 · 本课互动：例 1、例 2 的天平（按课本数据画，哪边重哪边沉）、称神秘木块（核心）、练一练 1 分类。
 * 天平见 ../shared/mbalance.js；填空、点选见 ../shared/mcheck.js */
const $ = (id) => document.getElementById(id);
const W = (v, t) => ({ k: 'w', v, t });
const BOX = (v) => ({ k: 'box', v, t: 'x 克' });
const X_TRUE = 100; // 例 2 四架天平中木块的质量（与课本四幅图都相符：x + 50 > 100，x + 50 = 150，x + 50 < 200，2x = 200）

function initStaticBalances() {
  MBalance.create($('recallBal')).set([W(50)], [W(50)]);
  MBalance.create($('bal1')).set([{ k: 'egg', v: 50, t: '50克' }, W(50)], [W(100)]);
  MBalance.create($('bal2a')).set([BOX(X_TRUE), W(50)], [W(100)]);
  MBalance.create($('bal2b')).set([BOX(X_TRUE), W(50)], [W(100), W(50)]);
  MBalance.create($('bal2c')).set([BOX(X_TRUE), W(50)], [W(200)]);
  MBalance.create($('bal2d')).set([BOX(X_TRUE), BOX(X_TRUE)], [W(200)]);
  MBalance.create($('bal9a')).set([BOX(60), BOX(60), BOX(60)], [W(100), W(50), W(20), W(10)]);
  MBalance.create($('bal9b')).set([BOX(80), W(20)], [W(100)]);
}

/* 第 5 页：称神秘木块。木块质量是 10 的倍数，学生往右盘放砝码 */
const X_CHOICES = [70, 80, 90, 110, 120, 130, 140, 160, 170, 180];
function initMystery() {
  const st = { x: 130, right: [], log: [] };
  const bal = MBalance.create($('balX'));
  const render = () => {
    const sum = MBalance.sum(st.right);
    const state = bal.set([BOX(st.x)], st.right);
    const sym = { eq: '=', L: '>', R: '<' }[state];
    const msg = $('xMsg');
    if (!st.right.length) {
      $('xExpr').innerHTML = '$x$ 　?　';
      msg.className = 'tip feedback';
      msg.innerHTML = '往右盘放砝码，看看天平怎样变化。';
    } else {
      $('xExpr').innerHTML = `$x\\ ${sym}\\ ${sum}$`;
      msg.className = `tip feedback ${state === 'eq' ? 'fb-ok' : 'fb-warn'}`;
      msg.innerHTML = state === 'eq'
        ? `<b>平衡了！</b>$x=${sum}$ 是<b>等式</b>，而且含有未知数 $x$。木块重 ${st.x} 克。`
        : `${state === 'L' ? '左边重，木块比' : '右边重，木块比'} ${sum} 克${state === 'L' ? '重' : '轻'}。$x${sym}${sum}$ 用“${sym}”连接，<b>不是等式</b>。`;
      const item = `$x${sym}${sum}$`;
      if (!st.log.includes(item)) st.log.push(item);
    }
    $('xLog').innerHTML = st.log.length ? st.log.map((t) => `<span class="${t.includes('=') ? 'lg-eq' : 'lg-ne'}">${t}</span>`).join(' ') : '还没有，先放砝码试一试！';
    $('xLog').classList.toggle('muted', !st.log.length);
    [$('xExpr'), msg, $('xLog')].forEach(MathKit.tex);
  };
  document.querySelector('.wbtns').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.g) {
      if (st.right.length < 9) st.right = [...st.right, W(+b.dataset.g)].sort((p, q) => q.v - p.v);
    } else if (b.id === 'xUndo') {
      st.right = st.right.slice(0, -1);
    } else if (b.id === 'xNew') {
      const others = X_CHOICES.filter((v) => v !== st.x);
      st.x = others[Math.floor(Math.random() * others.length)];
      st.right = [];
      st.log = [];
    }
    render();
  });
  render();
}

/* 第 7 页：练一练 1（课本顺序） */
const SORT8 = [
  ['6+x=14', 'f', '等式，又含有未知数 $x$。'],
  ['36-7=29', 'e', '是等式，但没有未知数。'],
  ['60+23>70', 'n', '用“$>$”连接，不是等式。'],
  ['8+x', 'n', '没有等号，只是一个式子。'],
  ['50\\div2=25', 'e', '是等式，但没有未知数。'],
  ['x+4<14', 'n', '用“$<$”连接，不是等式。'],
  ['y-28=35', 'f', '等式，含有未知数 $y$。'],
  ['5y=40', 'f', '等式，含有未知数 $y$。'],
];
function initSort() {
  $('sort8').innerHTML = SORT8.map(([t, a, why]) => `<div class="jcard s8"><p class="s8-e">$${t}$</p>
    <div class="pick" data-ans="${a}"><button type="button" data-k="f">方程</button><button type="button" data-k="e">等式，不是方程</button><button type="button" data-k="n">不是等式</button><p class="pick-why">${why}</p></div></div>`).join('');
  MathKit.tex($('sort8'));
  MCheck.init($('sort8'));
}

window.LESSON = {
  init() {
    initStaticBalances();
    initMystery();
    initSort();
  },
};
