'use strict';
/* 五上 小数乘整数 · 本课互动：钱币板（买几千克就放几份硬币，满十换一）、乘法竖式逐步演示。通用部分见 ../shared/mdec.js */
const $ = (id) => document.getElementById(id);

/* ---------- 钱币板：1 元 / 1 角 / 1 分，满十换一 ---------- */
const COIN = { y: '1元', j: '1角', f: '1分' };
const NEXT_UP = { f: 'j', j: 'y' };
const NAME = { y: '元', j: '角', f: '分' };

function coinBoard(el) {
  const price = el.dataset.price;
  const max = +el.dataset.max;
  const [yi, dec = ''] = price.split('.');
  const per = { y: +yi, j: +(dec[0] || 0), f: +(dec[1] || 0) };
  const kinds = dec.length > 1 ? ['y', 'j', 'f'] : ['y', 'j'];
  el.setAttribute('data-noswipe', '');
  el.innerHTML = `
    <div class="cb-cols">${kinds.map((k) => `<div class="cb-col" data-k="${k}"><h4>${NAME[k]}</h4><div class="cb-coins"></div><p class="cb-n"></p></div>`).join('')}</div>
    <div class="btns cb-btns">
      <button type="button" class="btn solid" data-act="buy">＋ 买 1 ${el.dataset.unit}（${price} 元）</button>
      ${kinds.includes('f') ? '<button type="button" class="btn" data-act="f">10 分 → 1 角</button>' : ''}
      <button type="button" class="btn" data-act="j">10 角 → 1 元</button>
      <button type="button" class="btn" data-act="reset">↺</button>
    </div>
    <p class="cb-read"></p>`;
  // 每枚硬币记住它是第几次买的（用颜色圈出来），换来的硬币标成 new
  let coins;
  let bought;
  const prev = {};
  const reset = () => { coins = { y: [], j: [], f: [] }; bought = 0; Object.keys(prev).forEach((k) => { prev[k] = 0; }); draw(); };
  const draw = () => {
    kinds.forEach((k) => {
      const col = el.querySelector(`.cb-col[data-k="${k}"]`);
      const seen = prev[k] ?? 0; // 只让新放上去的硬币有入场动画
      col.querySelector('.cb-coins').innerHTML = coins[k].map((g, i) => `<i class="coin ${k} g${g} ${i >= seen ? 'fresh' : ''}">${COIN[k]}</i>`).join('');
      prev[k] = coins[k].length;
      col.querySelector('.cb-n').textContent = `${coins[k].length} 枚`;
    });
    el.querySelector('[data-act="buy"]').disabled = bought >= max;
    el.querySelector('[data-act="j"]').disabled = coins.j.length < 10;
    const bf = el.querySelector('[data-act="f"]');
    if (bf) bf.disabled = coins.f.length < 10;
    const fen = coins.y.length * 100 + coins.j.length * 10 + coins.f.length;
    const parts = kinds.map((k) => `${coins[k].length} ${NAME[k]}`).join(' ');
    const carryDone = coins.j.length < 10 && coins.f.length < 10;
    el.querySelector('.cb-read').innerHTML = bought
      ? `${bought} ${el.dataset.unit}：<b>${parts}</b>${carryDone ? `　= <b>${MDec.move(String(fen), -2)} 元</b>` : '　（还能再换）'}`
      : '点“买 1 千克”，放上硬币。';
  };
  el.addEventListener('click', (e) => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (!act) return;
    if (act === 'reset') { reset(); return; }
    if (act === 'buy' && bought < max) {
      bought += 1;
      kinds.forEach((k) => { coins[k] = coins[k].concat(Array(per[k]).fill(bought)); });
    }
    if ((act === 'j' || act === 'f') && coins[act].length >= 10) {
      const up = NEXT_UP[act];
      coins = { ...coins, [act]: coins[act].slice(0, -10), [up]: coins[up].concat(['new']) };
    }
    draw();
  });
  reset();
}

/* ---------- 练一练：选一道题看竖式 ---------- */
function initPractice() {
  const show = (btn) => {
    $('v3pick').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b === btn));
    MDec.mul($('v3'), btn.dataset.a, btn.dataset.b);
  };
  $('v3pick').addEventListener('click', (e) => { const b = e.target.closest('[data-a]'); if (b) show(b); });
  show($('v3pick').querySelector('[data-a]'));
}

window.LESSON = {
  init() {
    document.querySelectorAll('.coin-board').forEach(coinBoard);
    MDec.mul($('v1'), '0.8', '3', { notes: { A: '8 个十分之一', P: '24 个十分之一' } });
    MDec.mul($('v2'), '2.35', '3', { notes: { A: '235 个百分之一', P: '705 个百分之一' } });
    initPractice();
  },
};
