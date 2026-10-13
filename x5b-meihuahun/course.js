'use strict';
/* 梅花魂（略读）· 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 阅读提示 · 外祖父的五件事（正面事情，背面感情） */
const CLUE_LABELS = ['外祖父的事', '藏着的感情'];
const CLUES = [
  { q: '① 教“我”读唐诗宋词，读到思乡的诗句就落泪', a: '身在异乡，<b>思念祖国</b>；“我”还小，不懂他的心。' },
  { q: '② 爱惜墨梅图，“我”弄脏了，他训斥母亲', a: '“清白的梅花，是能玷污的吗？”——他敬重梅花，就是<b>敬重祖国</b>。' },
  { q: '③ 听说我们要回国，他像小孩子一样呜呜地哭', a: '<b>想回国却回不去</b>，年纪太大了，说不出的难过。' },
  { q: '④ 离别前，把最宝贵的墨梅图送给“我”', a: '希望“我”做个<b>有梅花秉性</b>的中国人。' },
  { q: '⑤ 码头送别，又递给“我”绣着梅花的手绢', a: '舍不得亲人，更<b>眷恋祖国</b>：一颗赤子心。' },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS });
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
