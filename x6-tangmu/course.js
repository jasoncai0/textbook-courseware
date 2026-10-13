'use strict';
/* 汤姆·索亚历险记（节选） · 本课数据与互动。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 情节投票：点一下 +1，再点一下取消 */
function initVotes() {
  const box = document.getElementById('votes');
  if (!box) return;
  box.addEventListener('click', (e) => {
    const card = e.target.closest('.vote');
    if (!card) return;
    const on = card.classList.toggle('picked');
    const n = card.querySelector('i');
    n.textContent = Math.max(0, +n.textContent + (on ? 1 : -1));
  });
}

/* 译本：选一个最喜欢的 */
function initYi() {
  const box = document.getElementById('yiCards');
  if (!box) return;
  box.addEventListener('click', (e) => {
    const card = e.target.closest('.yi');
    if (card) box.querySelectorAll('.yi').forEach((c) => c.classList.toggle('picked', c === card));
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    initVotes();
    initYi();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
