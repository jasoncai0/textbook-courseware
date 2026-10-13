'use strict';
/* 有的人 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js（一节诗一幅画沿用故事页），翻页引擎见 ../shared/deck.js */

/* 第 1 节：两种“活着”、两种“死了” */
const CLUE_LABELS = ['诗句', '指的是……'];
const CLUES = [
  { q: '有的人<b>活着</b>，', a: '身体还活着——骑在人民头上、只顾自己的人。' },
  { q: '他<b>已经死了</b>；', a: '精神上已经死了：人民唾弃他，他活着也没有价值。' },
  { q: '有的人<b>死了</b>，', a: '身体已经死了——像鲁迅这样为人民的人。' },
  { q: '他<b>还活着</b>。', a: '精神永远活着：人民永远记住他，他的书今天还有人读。' },
];

/* 对照表：点格子翻出结局 */
function initDuizhao() {
  const box = document.getElementById('duizhao');
  if (!box) return;
  box.addEventListener('click', (e) => {
    const cell = e.target.closest('.dz-cell');
    if (cell) cell.classList.toggle('open');
  });
}

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS });
    initDuizhao();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
