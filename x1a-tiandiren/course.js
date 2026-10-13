'use strict';
/* 天地人 · 本课数据。识字模板见 ../shared/hanzi.js（必须在顶层调用，deck.js 加载前渲染完） */

Hanzi.init({
  /* 字理：古字形是示意简笔（见 Hanzi.OLD） */
  evolve: [
    { z: '人', note: '像一个侧着身子站着的人。' },
    { z: '大', note: '人张开双手、叉开双脚，就是“大”。' },
    { z: '天', note: '“大”的上面加一个大大的头——人的头顶上就是“天”。' },
  ],
  pick: {
    old: [
      { old: '大', ans: '大', opts: ['人', '大', '天'] },
      { old: '人', ans: '人', opts: ['天', '大', '人'] },
      { old: '天', ans: '天', opts: ['天', '人', '大'] },
    ],
  },
  cards: [
    { z: '天', py: 'tiān', bs: '一', bh: 4, words: [['天空', 'tiān kōng'], ['白天', 'bái tiān']] },
    { z: '地', py: 'dì', bs: '土', bh: 6, words: [['大地', 'dà dì'], ['地上', 'dì shang']] },
    { z: '人', py: 'rén', bs: '人', bh: 2, words: [['大人', 'dà rén'], ['人们', 'rén men']] },
    { z: '你', py: 'nǐ', bs: '亻', bh: 7, words: [['你好', 'nǐ hǎo'], ['你们', 'nǐ men']] },
    { z: '我', py: 'wǒ', bs: '戈', bh: 7, words: [['我们', 'wǒ men'], ['你我', 'nǐ wǒ']] },
    { z: '他', py: 'tā', bs: '亻', bh: 5, words: [['他们', 'tā men'], ['其他', 'qí tā']] },
  ],
  /* 拖字配图：x / y 按 assets/tiandi.jpg、niwota.jpg 的构图设（图生成后核对） */
  match: {
    tiandi: { bg: 'assets/tiandi.jpg', items: [{ z: '天', x: 50, y: 16, hint: 'tiān' }, { z: '地', x: 50, y: 86, hint: 'dì' }, { z: '人', x: 66, y: 52, hint: 'rén' }] },
    niwota: { bg: 'assets/niwota.jpg', items: [{ z: '我', x: 20, y: 26, hint: 'wǒ' }, { z: '你', x: 56, y: 26, hint: 'nǐ' }, { z: '他', x: 84, y: 30, hint: 'tā' }] },
  },
  apples: [['天', 'tiān'], ['地', 'dì'], ['人', 'rén'], ['你', 'nǐ'], ['我', 'wǒ'], ['他', 'tā']],
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
