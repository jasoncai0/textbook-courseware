'use strict';
/* 骑鹅旅行记（节选） · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 阅读提示 · 猜一猜原著里的其他故事（正面题目，背面原著情节简介） */
const CLUE_LABELS = ['原著中的故事', '原著里讲的是……'];
const CLUES = [
  { q: '鹤之舞表演大会', a: '春天，动物们聚到库拉山上举行一年一度的盛会，灰鹤们展开翅膀跳起了美妙的舞蹈。尼尔斯也跟着雁群去观看。' },
  { q: '大海中的白银', a: '尼尔斯来到瑞典西海岸，看到渔民出海捕鲱鱼——一群群鲱鱼闪着银光，人们把它们叫作“大海中的白银”。' },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS });
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
