'use strict';
/* 人之初 · 本课数据。识字组件见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

Zuzi.init({});

Hanzi.init({
  shapes: {
    玉: ['M50 8V92', 'M22 24H78', 'M22 50H78', 'M22 76H78'],
  },
  evolve: [
    { z: '人', note: '像一个侧着身子站着的人。' },
    { z: '子', note: '像包在襁褓里的小娃娃：大大的头，张开两只小手。' },
    { z: '玉', note: '像一根绳子串起几块玉片。后来加上一点，和“王”分开。' },
  ],
  cards: [
    { z: '之', py: 'zhī', bs: '丶', bh: 3, words: [['人之初', 'rén zhī chū']] },
    { z: '初', py: 'chū', bs: '衤', bh: 7, words: [['初夏', 'chū xià'], ['初始', 'chū shǐ']] },
    { z: '性', py: 'xìng', bs: '忄', bh: 8, words: [['天性', 'tiān xìng'], ['性格', 'xìng gé']] },
    { z: '善', py: 'shàn', bs: '口', bh: 12, words: [['善良', 'shàn liáng'], ['友善', 'yǒu shàn']] },
    { z: '习', py: 'xí', bs: '乙', bh: 3, words: [['学习', 'xué xí'], ['练习', 'liàn xí']] },
    { z: '教', py: 'jiào', bs: '攵', bh: 11, words: [['教室', 'jiào shì'], ['教育', 'jiào yù']] },
    { z: '迁', py: 'qiān', bs: '辶', bh: 6, words: [['性乃迁', 'xìng nǎi qiān'], ['搬迁', 'bān qiān']] },
    { z: '贵', py: 'guì', bs: '贝', bh: 9, words: [['宝贵', 'bǎo guì'], ['贵以专', 'guì yǐ zhuān']] },
    { z: '专', py: 'zhuān', bs: '一', bh: 4, words: [['专心', 'zhuān xīn'], ['专门', 'zhuān mén']] },
    { z: '幼', py: 'yòu', bs: '幺', bh: 5, words: [['幼小', 'yòu xiǎo'], ['幼儿园', 'yòu ér yuán']] },
    { z: '玉', py: 'yù', bs: '王', bh: 5, words: [['玉石', 'yù shí'], ['玉米', 'yù mǐ']] },
    { z: '器', py: 'qì', bs: '口', bh: 16, words: [['玉器', 'yù qì'], ['乐器', 'yuè qì']] },
    { z: '义', py: 'yì', bs: '丶', bh: 3, words: [['不知义', 'bù zhī yì'], ['正义', 'zhèng yì']] },
  ],
  apples: [['之', 'zhī'], ['初', 'chū'], ['性', 'xìng'], ['善', 'shàn'], ['习', 'xí'], ['教', 'jiào'], ['迁', 'qiān'], ['贵', 'guì'], ['专', 'zhuān'], ['幼', 'yòu'], ['玉', 'yù'], ['器', 'qì']],
  write: {
    a: [
      { z: '之', py: 'zhī', bs: '丶', bh: 3 },
      { z: '相', py: 'xiāng', bs: '木', bh: 9 },
      { z: '近', py: 'jìn', bs: '辶', bh: 7 },
      { z: '习', py: 'xí', bs: '乙', bh: 3 },
    ],
    b: [
      { z: '远', py: 'yuǎn', bs: '辶', bh: 7 },
      { z: '玉', py: 'yù', bs: '王', bh: 5 },
      { z: '义', py: 'yì', bs: '丶', bh: 3 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
