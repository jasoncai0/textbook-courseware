'use strict';
/* 猜字谜 · 本课数据。识字组件见 ../shared/hanzi.js；合字见 zuzi.js（都在顶层调用，deck.js 加载前渲染完） */

const GREEN = '#2f8a3a';
const RED = '#d2402e';

Zuzi.init({
  combine: {
    qiu: [{ parts: ['禾', '火'], colors: [GREEN, RED], z: '秋', py: 'qiū', step: 3, row: true }],
    qing: [
      { parts: ['讠', '青'], z: '请', py: 'qǐng', say: '请问', saypy: 'qǐng wèn', step: 2, row: true },
      { parts: ['忄', '青'], z: '情', py: 'qíng', say: '心情', saypy: 'xīn qíng', step: 3, row: true },
      { parts: ['日', '青'], z: '晴', py: 'qíng', say: '晴天', saypy: 'qíng tiān', step: 4, row: true },
      { parts: ['氵', '青'], z: '清', py: 'qīng', say: '清水', saypy: 'qīng shuǐ', step: 5, row: true },
    ],
  },
});

Hanzi.init({
  cards: [
    { z: '相', py: 'xiāng', bs: '木', bh: 9, words: [['相遇', 'xiāng yù'], ['互相', 'hù xiāng']] },
    { z: '遇', py: 'yù', bs: '辶', bh: 12, words: [['相遇', 'xiāng yù'], ['遇到', 'yù dào']] },
    { z: '喜', py: 'xǐ', bs: '口', bh: 12, words: [['喜欢', 'xǐ huan'], ['喜爱', 'xǐ ài']] },
    { z: '欢', py: 'huān', bs: '又', bh: 6, words: [['欢乐', 'huān lè'], ['欢迎', 'huān yíng']] },
    { z: '怕', py: 'pà', bs: '忄', bh: 8, words: [['最怕', 'zuì pà'], ['害怕', 'hài pà']] },
    { z: '言', py: 'yán', bs: '言', bh: 7, words: [['语言', 'yǔ yán'], ['发言', 'fā yán']] },
    { z: '互', py: 'hù', bs: '一', bh: 4, words: [['互相', 'hù xiāng']] },
    { z: '令', py: 'lìng', bs: '人', bh: 5, words: [['令人感动', 'lìng rén gǎn dòng'], ['口令', 'kǒu lìng']] },
    { z: '动', py: 'dòng', bs: '力', bh: 6, words: [['感动', 'gǎn dòng'], ['动物', 'dòng wù']] },
    { z: '万', py: 'wàn', bs: '一', bh: 3, words: [['万里', 'wàn lǐ'], ['一万', 'yí wàn']] },
    { z: '纯', py: 'chún', bs: '纟', bh: 7, words: [['纯净', 'chún jìng']] },
    { z: '净', py: 'jìng', bs: '冫', bh: 8, words: [['纯净', 'chún jìng'], ['干净', 'gān jìng']] },
  ],
  write: {
    a: [
      { z: '字', py: 'zì', bs: '子', bh: 6 },
      { z: '左', py: 'zuǒ', bs: '工', bh: 5 },
      { z: '右', py: 'yòu', bs: '口', bh: 5 },
      { z: '红', py: 'hóng', bs: '纟', bh: 6 },
    ],
    b: [
      { z: '时', py: 'shí', bs: '日', bh: 7 },
      { z: '动', py: 'dòng', bs: '力', bh: 6 },
      { z: '万', py: 'wàn', bs: '一', bh: 3 },
    ],
  },
});

/* 课后“猜一猜”：一加一（课本）+ 三个补充字谜。翻卡见 ../shared/narrative.js（clues） */
const r = Hanzi.ruby;
const w = (html) => `<span>${html}</span>`; // 卡面是竖排 flex，整句包一层
const MI = [
  { q: w(r('“一加一”', 'yī jiā yī')), a: `${w(r('王', 'wáng'))}<small>一 + 十（加号）+ 一</small>` },
  { q: w(r('一口咬掉牛尾巴', 'yì kǒu yǎo diào niú wěi ba')), a: `${w(r('告', 'gào'))}<small>“牛”去掉尾巴 + 口</small>` },
  { q: w(r('大口里面藏小口', 'dà kǒu lǐ miàn cáng xiǎo kǒu')), a: `${w(r('回', 'huí'))}<small>大口 + 小口</small>` },
  { q: w(r('两棵树，手拉手', 'liǎng kē shù　shǒu lā shǒu')), a: `${w(r('林', 'lín'))}<small>木 + 木</small>` },
];

window.LESSON = {
  init() { Narrative.init({ clues: MI, clueLabels: ['谜面', '谜底'] }); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
