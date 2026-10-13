'use strict';
/* 为中华之崛起而读书 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 课后第 1 题 · 排一排：按事情发生的先后点一点（n 为正确顺序） */
const ORDER = [
  { n: 2, pic: 'zujie', t: '租界里目睹中国人受欺负' },
  { n: 3, pic: 'ketang', t: '修身课上立下志向' },
  { n: 1, pic: 'bofu', t: '伯父说“中华不振”' },
];

function initOrder(box, items) {
  let next = 1;
  const render = () => {
    next = 1;
    box.classList.remove('done');
    box.innerHTML = items.map((it, i) => `<button class="ord-card" type="button" data-i="${i}">
      <span class="ord-pic" data-bg="assets/${it.pic}.jpg"></span><b class="ord-n"></b><span class="ord-t">${it.t}</span></button>`).join('');
    // 卡片图片按需加载：本页已在可视范围时直接补上
    box.querySelectorAll('[data-bg]').forEach((el) => { el.style.backgroundImage = `url('${el.dataset.bg}')`; el.removeAttribute('data-bg'); });
  };
  box.addEventListener('click', (e) => {
    const card = e.target.closest('.ord-card');
    if (!card || card.classList.contains('right')) return;
    const it = items[+card.dataset.i];
    card.classList.remove('wrong');
    void card.offsetWidth; // 重新触发抖动动画
    if (it.n === next) {
      card.classList.add('right');
      card.querySelector('.ord-n').textContent = next;
      next += 1;
      box.classList.toggle('done', next > items.length);
    } else {
      card.classList.add('wrong');
    }
  });
  document.getElementById('orderReset').addEventListener('click', render);
  render();
}

/* 小练笔 */
const MOMENTS = [
  {
    name: '为了我的梦想', pic: 'dushu',
    prompt: '你长大想做什么？读书和这个梦想有什么关系？',
    hint: '先写“我为……而读书”，再写理由：是什么让你有了这个想法？',
    example: '我为了当一名医生而读书。去年奶奶生病住院，医生阿姨每天都来看她，耐心地给她治疗，奶奶很快就好了。从那时起，我就想：我也要学好本领，帮助更多生病的人。',
  },
  {
    name: '为了家人和祖国', pic: 'ketang',
    prompt: '读书能让你为家人、为家乡、为祖国做些什么？',
    hint: '可以写一个具体的人或一件具体的事，让理由更清楚。',
    example: '我为让家乡变得更美而读书。我的家乡在山里，路不好走，爸爸妈妈只能去很远的城市打工。我要好好读书，将来学会修路、建桥，让山里的路通到每家门口。',
  },
  {
    name: '我自己想', pic: 'bofu',
    prompt: '如果有人问你为什么而读书，你的回答是什么？',
    hint: '说真心话。理由可以来自一件事、一个人、一本书。',
    example: '我为了知道更多的“为什么”而读书……',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initOrder(document.getElementById('order'), ORDER);
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
