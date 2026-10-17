'use strict';
/* 五上 小数点向右移动引起的变化 · 本课互动：小数点滑轨（× 10、100、1000 一格一格向右滑）。通用部分见 ../shared/mdec.js */
const $ = (id) => document.getElementById(id);
const POW = ['', '10', '100', '1000', '10000'];
const NUM_RE = /^\d{1,4}(\.\d{1,4})?$/;

// 读数：5.04 × 100 = 504　小数点向右移动了 2 位
const readout = (el) => ({ k, base, text }) => {
  el.innerHTML = k > 0
    ? `${base} × ${POW[k]} = <b>${text}</b>　<span class="mv">小数点向右移动了 ${k} 位</span>`
    : `原数：<b>${base}</b>`;
};

function initRail1() {
  const rail = MDec.rail($('rail1'), { value: '5.04', onChange: readout($('rRead')) });
  const pick = (box, btn) => box.querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b === btn));
  $('rNum').addEventListener('click', (e) => {
    const b = e.target.closest('[data-v]');
    if (!b) return;
    pick($('rNum'), b);
    $('rOwn').value = '';
    rail.set(b.dataset.v);
  });
  $('rOwn').addEventListener('change', () => {
    const v = $('rOwn').value.trim();
    if (!NUM_RE.test(v)) { $('rRead').textContent = '请写一个整数部分不超过 4 位、小数部分不超过 4 位的数，如 7.25'; return; }
    pick($('rNum'), null);
    rail.set(v);
  });
  $('rOps').addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (b) rail.shift(+b.dataset.k);
  });
}

function initRail2() {
  const rail = MDec.rail($('rail2'), { value: '0.351', onChange: ({ k, base, text }) => {
    $('r2Read').innerHTML = k === 3 ? `${base} 千克 = <b>${text}</b> 克` : k ? '小数点向右移动中……' : `${base} 千克 = ? 克`;
  } });
  const go = (b) => {
    $('r2Btns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    rail.set(b.dataset.v);
    setTimeout(() => rail.shift(3), 500);
  };
  $('r2Btns').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) go(b); });
}

window.LESSON = {
  init() {
    initRail1();
    initRail2();
  },
};
