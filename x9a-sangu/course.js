'use strict';
/* 三顾茅庐 · 本课数据与互动：层层铺垫阶梯（等待条）、刘关张对比格、隆中对示意图。通用部分见 ../shared/narrative.js */

/* 刘关张对比：三个场景 × 三人（课本原文；空串表示课文没写） */
const SCENES = ['出发之前', '诸葛均飘然自去', '孔明昼寝未醒'];
const WHO = ['刘备', '关羽', '张飞'];
const CELLS = [
  ['“不然。昔齐桓公欲见东郭野人，五反而方得一面。况吾欲见大贤耶？”', '“兄长两次亲往拜谒，其礼太过矣。想诸葛亮有虚名而无实学，故避而不敢见。”', '“量此村夫，何足为大贤！今番不须哥哥去；他如不来，我只用一条麻绳缚将来！”'],
  ['“彼各有事，岂可相强。”', '', '“此人无礼！便引我等到庄也不妨，何故竟自去了！”'],
  ['玄德拱立阶下。……玄德曰：“且勿惊动。”', '云长再三劝住。', '“这先生如何傲慢！见我哥哥侍立阶下，他竟高卧，推睡不起！等我去屋后放一把火，看他起不起！”'],
];

function initThree() {
  const box = document.getElementById('three');
  box.innerHTML = `<span></span>${WHO.map((w) => `<b class="th">${w}</b>`).join('')}` +
    SCENES.map((s, r) => `<b class="tr">${s}</b>${CELLS[r].map((c) => `<button type="button" class="cell${c ? '' : ' empty'}">${c || '（课文未写）'}</button>`).join('')}`).join('');
  box.addEventListener('click', (e) => {
    const c = e.target.closest('.cell');
    if (c) c.classList.add('open');
  });
}

/* 等待条：每一步累计的“等待” */
const WAIT = [0, 0, 0, 10, 18, 40, 52, 82, 100, 100];

window.LESSON = {
  init() {
    Narrative.init({});
    initThree();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-stair')) document.getElementById('waitBar').style.width = `${WAIT[step] || 0}%`;
  },
};
