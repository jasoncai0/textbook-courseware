'use strict';
/* 小青蛙 · 本课数据。识字组件见 ../shared/hanzi.js；换偏旁、归类见 zuzi.js（都在顶层调用，deck.js 加载前渲染完） */

Zuzi.init({
  swap: {
    qing: {
      base: '青', py: 'qīng', name: '“青”字家族',
      items: [
        { bs: '氵', z: '清', py: 'qīng', w: '河水清清', wpy: 'hé shuǐ qīng qīng', tip: '三点水：和水有关' },
        { bs: '日', z: '晴', py: 'qíng', w: '天气晴', wpy: 'tiān qì qíng', tip: '日字旁：出太阳，天就晴' },
        { bs: '目', z: '睛', py: 'jīng', w: '眼睛', wpy: 'yǎn jing', tip: '目字旁：和眼睛有关' },
        { bs: '讠', z: '请', py: 'qǐng', w: '请你', wpy: 'qǐng nǐ', tip: '言字旁：和说话有关' },
        { bs: '忄', z: '情', py: 'qíng', w: '心情', wpy: 'xīn qíng', tip: '竖心旁：和心里想的有关' },
      ],
    },
  },
  sort: {
    tian: {
      buckets: [
        { t: '眼□', py: 'yǎn', ok: ['睛'] },
        { t: '□问', py: 'wèn', ok: ['请'] },
        { t: '□水', py: 'shuǐ', ok: ['清'] },
        { t: '□天', py: 'tiān', ok: ['晴'] },
        { t: '心□', py: 'xīn', ok: ['情'] },
      ],
      cards: [['睛', 'jing'], ['情', 'qíng'], ['晴', 'qíng'], ['清', 'qīng'], ['请', 'qǐng']],
    },
  },
});

Hanzi.init({
  cards: [
    { z: '清', py: 'qīng', bs: '氵', bh: 11, words: [['清水', 'qīng shuǐ'], ['河水清清', 'hé shuǐ qīng qīng']] },
    { z: '晴', py: 'qíng', bs: '日', bh: 12, words: [['晴天', 'qíng tiān'], ['天气晴', 'tiān qì qíng']] },
    { z: '眼', py: 'yǎn', bs: '目', bh: 11, words: [['眼睛', 'yǎn jing'], ['大眼睛', 'dà yǎn jing']] },
    { z: '睛', py: 'jīng', bs: '目', bh: 13, words: [['眼睛', 'yǎn jing'], ['画龙点睛', 'huà lóng diǎn jīng']] },
    { z: '保', py: 'bǎo', bs: '亻', bh: 9, words: [['保护', 'bǎo hù']] },
    { z: '护', py: 'hù', bs: '扌', bh: 7, words: [['保护', 'bǎo hù'], ['爱护', 'ài hù']] },
    { z: '害', py: 'hài', bs: '宀', bh: 10, words: [['害虫', 'hài chóng'], ['害怕', 'hài pà']] },
    { z: '事', py: 'shì', bs: '一', bh: 8, words: [['好事', 'hǎo shì'], ['事情', 'shì qing']] },
    { z: '情', py: 'qíng', bs: '忄', bh: 11, words: [['心情', 'xīn qíng'], ['事情', 'shì qing']] },
    { z: '请', py: 'qǐng', bs: '讠', bh: 10, words: [['请你', 'qǐng nǐ'], ['请问', 'qǐng wèn']] },
    { z: '让', py: 'ràng', bs: '讠', bh: 5, words: [['让开', 'ràng kāi'], ['好让', 'hǎo ràng']] },
    { z: '病', py: 'bìng', bs: '疒', bh: 10, words: [['生病', 'shēng bìng'], ['病人', 'bìng rén']] },
  ],
  write: {
    a: [
      { z: '青', py: 'qīng', bs: '青', bh: 8 },
      { z: '清', py: 'qīng', bs: '氵', bh: 11 },
      { z: '气', py: 'qì', bs: '气', bh: 4 },
      { z: '晴', py: 'qíng', bs: '日', bh: 12 },
    ],
    b: [
      { z: '情', py: 'qíng', bs: '忄', bh: 11 },
      { z: '请', py: 'qǐng', bs: '讠', bh: 10 },
      { z: '生', py: 'shēng', bs: '丿', bh: 5 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
