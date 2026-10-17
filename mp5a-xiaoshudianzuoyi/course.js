'use strict';
/* 五上 小数点向左移动引起的变化 · 本课互动：拖小数点（先猜后查）、例 6 千克化吨滑轨。通用部分见 ../shared/mdec.js */
const $ = (id) => document.getElementById(id);
const POW = ['', '10', '100', '1000'];
// 课本练习十一第 4 题 + 例 5
const QUIZ = [['21.5', 1], ['21.5', 3], ['56.3', 1], ['16.5', 2], ['40', 3], ['0.03', 1], ['8.4', 2], ['28.9', 3]];

function initQuiz() {
  let cur = 0;
  const rail = MDec.rail($('rail1'), {
    value: QUIZ[0][0],
    drag: true,
    onChange: ({ k, text }) => {
      $('rRead').innerHTML = k === 0 ? '把红色小数点拖到你认为的位置' : `现在是 <b>${text}</b>（小数点向${k < 0 ? '左' : '右'}移动了 ${Math.abs(k)} 位）`;
    },
  });
  const ask = (i) => {
    cur = i;
    const [v, n] = QUIZ[i];
    $('qText').innerHTML = `${v} ÷ ${POW[n]} = ？`;
    $('qList').querySelectorAll('.btn').forEach((b, j) => b.classList.toggle('solid', j === i));
    rail.set(v);
  };
  $('qList').innerHTML = QUIZ.map(([v, n]) => `<button type="button" class="btn">${v} ÷ ${POW[n]}</button>`).join('');
  $('qList').addEventListener('click', (e) => {
    const b = e.target.closest('.btn');
    if (b) ask([...$('qList').children].indexOf(b));
  });
  const answer = () => MDec.move(QUIZ[cur][0], -QUIZ[cur][1]);
  $('qCheck').addEventListener('click', () => {
    const [v, n] = QUIZ[cur];
    const { k, text } = rail.state();
    $('rRead').innerHTML = k === -n
      ? `<span class="ok">✓ 对了！</span>${v} ÷ ${POW[n]} = <b>${text}</b>，小数点向左移动 ${n} 位。`
      : `<span class="no">✗ 再想想：</span>除以 ${POW[n]}，小数点要向${'左'}移动 ${n} 位，你移动了${k < 0 ? `向左 ${-k}` : k > 0 ? `向右 ${k}` : ' 0'} 位。`;
  });
  $('qShow').addEventListener('click', () => {
    rail.shift(-QUIZ[cur][1]);
    setTimeout(() => { $('rRead').innerHTML = `${QUIZ[cur][0]} ÷ ${POW[QUIZ[cur][1]]} = <b>${answer()}</b>`; }, 1300);
  });
  ask(0);
}

function initRail2() {
  const rail = MDec.rail($('rail2'), { value: '500', onChange: ({ k, base, text }) => {
    $('r2Read').innerHTML = k === -3 ? `${base} 千克 = <b>${text}</b> 吨` : k ? '小数点向左移动中……' : `${base} 千克 = ? 吨`;
  } });
  const go = (b) => {
    $('r2Btns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    rail.set(b.dataset.v);
    setTimeout(() => rail.shift(-3), 500);
  };
  $('r2Btns').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) go(b); });
}

window.LESSON = {
  init() {
    MDec.div($('v215'), '21.5', 10).end();
    initQuiz();
    initRail2();
  },
};
