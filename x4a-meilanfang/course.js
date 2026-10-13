'use strict';
/* 梅兰芳蓄须 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 阅读提示 · 连一连：左边办法，右边危险和困难（同一下标为一组；右栏打乱显示） */
const PAIRS = [
  { l: '藏身租界，避居香港，不再登台', r: '不能演出，不能创作，无异于虚度生命' },
  { l: '蓄须明志', r: '难以抵抗侵略者随时随地的骚扰' },
  { l: '卖房度日', r: '没有了经济来源，又要养家' },
  { l: '打伤寒预防针，生一场“大病”', r: '连日发高烧，差点儿丢了性命' },
];
const RIGHT_ORDER = [2, 0, 3, 1];

function initMatch(pairs, order) {
  const left = document.getElementById('matchL');
  const right = document.getElementById('matchR');
  left.innerHTML = pairs.map((p, i) => `<button class="m-item" type="button" data-i="${i}"><b class="m-n"></b>${p.l}</button>`).join('');
  right.innerHTML = order.map((i) => `<button class="m-item" type="button" data-i="${i}"><b class="m-n"></b>${pairs[i].r}</button>`).join('');
  let picked = null;
  let count = 0;
  left.addEventListener('click', (e) => {
    const b = e.target.closest('.m-item');
    if (!b || b.classList.contains('done')) return;
    left.querySelectorAll('.m-item').forEach((x) => x.classList.toggle('picked', x === b));
    picked = b;
  });
  right.addEventListener('click', (e) => {
    const b = e.target.closest('.m-item');
    if (!b || b.classList.contains('done') || !picked) return;
    b.classList.remove('wrong');
    void b.offsetWidth; // 重新触发抖动动画
    if (b.dataset.i !== picked.dataset.i) { b.classList.add('wrong'); return; }
    count += 1;
    [picked, b].forEach((x) => {
      x.classList.remove('picked');
      x.classList.add('done', `c${count}`);
      x.querySelector('.m-n').textContent = count;
    });
    picked = null;
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    initMatch(PAIRS, RIGHT_ORDER);
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
