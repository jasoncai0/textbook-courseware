'use strict';
/* 大小多少 · 本课数据。识字模板见 ../shared/hanzi.js（必须在顶层调用，deck.js 加载前渲染完）
 * 识字 7 在学完拼音之后：可以用“看拼音选字”。 */

Hanzi.init({
  /* 本课补的古字形（示意简笔，100 × 100，一笔一条 path） */
  shapes: {
    小: ['M50 20V66', 'M30 42L20 68', 'M70 42L80 68'],
    牛: ['M18 18C22 40 38 46 50 46C62 46 78 40 82 18', 'M50 26V94', 'M26 66H74'],
    果: ['M50 8A20 20 0 1 0 50 48A20 20 0 1 0 50 8', 'M32 28H68', 'M50 10V94', 'M50 68L26 90', 'M50 68L74 90'],
    鸟: ['M30 20A8 8 0 1 0 30 36A8 8 0 1 0 30 20', 'M22 26L10 30L22 32', 'M37 32C60 30 80 44 88 62C68 64 50 62 38 52C32 46 32 38 37 32', 'M52 62V86', 'M62 62V86'],
  },
  evolve: [
    { z: '小', note: '像三颗小小的沙粒——很小很小。' },
    { z: '牛', note: '像一个牛头，上面是两只弯弯的牛角。' },
    { z: '果', note: '下面是树，上面是树上结的果子。' },
    { z: '鸟', note: '像一只小鸟：有头、有嘴、有身子，还有脚。' },
  ],
  pick: {
    /* 比一比：看整张图，选说对的一句 */
    bi: [
      { pic: 'assets/niumao.jpg', size: 'cover', ans: '黄牛大', opts: ['猫大', '黄牛大'] },
      { pic: 'assets/yazi.jpg', size: 'cover', ans: '鸭子多', opts: ['鸭子多', '鸟多'] },
      { pic: 'assets/guozi.jpg', size: '200%', pos: '0% 60%', ans: '苹果大', opts: ['枣大', '苹果大'] },
      { pic: 'assets/guozi.jpg', size: '200%', pos: '100% 60%', ans: '杏子多', opts: ['杏子多', '桃多'] },
    ],
    /* 课后“读一读，记一记”：选量词（题面拼音只注汉字） */
    liang: [
      { q: '一＿牛', py: 'yì niú', ans: '头', opts: ['只', '头', '群'] },
      { q: '一＿猫', py: 'yì māo', ans: '只', opts: ['只', '堆', '头'] },
      { q: '一＿鸭子', py: 'yì yā zi', ans: '群', opts: ['颗', '个', '群'] },
      { q: '一＿枣', py: 'yì zǎo', ans: '颗', opts: ['颗', '群', '头'] },
      { q: '一＿桃', py: 'yí táo', ans: '个', opts: ['堆', '个', '群'] },
      { q: '一＿杏子', py: 'yì xìng zi', ans: '堆', opts: ['头', '只', '堆'] },
    ],
    py: [
      { q: 'niú', ans: '牛', opts: ['牛', '猫', '鸟'] },
      { q: 'māo', ans: '猫', opts: ['鸭', '猫', '牛'] },
      { q: 'yā', ans: '鸭', opts: ['鸟', '只', '鸭'] },
      { q: 'huáng', ans: '黄', opts: ['黄', '果', '桃'] },
      { q: 'duō', ans: '多', opts: ['少', '多', '边'] },
      { q: 'táo', ans: '桃', opts: ['杏', '苹', '桃'] },
    ],
  },
  cards: [
    { z: '多', py: 'duō', bs: '夕', bh: 6, words: [['多少', 'duō shǎo'], ['很多', 'hěn duō']] },
    { z: '少', py: 'shǎo', bs: '小', bh: 4, words: [['多少', 'duō shǎo'], ['少数', 'shǎo shù']] },
    { z: '黄', py: 'huáng', bs: '黄', bh: 11, words: [['黄牛', 'huáng niú'], ['黄色', 'huáng sè']] },
    { z: '牛', py: 'niú', bs: '牛', bh: 4, words: [['黄牛', 'huáng niú'], ['小牛', 'xiǎo niú']] },
    { z: '只', py: 'zhī', bs: '口', bh: 5, words: [['一只', 'yì zhī'], ['两只', 'liǎng zhī']] },
    { z: '猫', py: 'māo', bs: '犭', bh: 11, words: [['小猫', 'xiǎo māo'], ['花猫', 'huā māo']] },
    { z: '边', py: 'biān', bs: '辶', bh: 5, words: [['一边', 'yì biān'], ['旁边', 'páng biān']] },
    { z: '鸭', py: 'yā', bs: '鸟', bh: 10, words: [['鸭子', 'yā zi'], ['小鸭', 'xiǎo yā']] },
    { z: '苹', py: 'píng', bs: '艹', bh: 8, words: [['苹果', 'píng guǒ']] },
    { z: '果', py: 'guǒ', bs: '木', bh: 8, words: [['苹果', 'píng guǒ'], ['水果', 'shuǐ guǒ']] },
    { z: '杏', py: 'xìng', bs: '木', bh: 7, words: [['杏子', 'xìng zi'], ['杏树', 'xìng shù']] },
    { z: '桃', py: 'táo', bs: '木', bh: 10, words: [['桃子', 'táo zi'], ['桃花', 'táo huā']] },
  ],
  write: [
    { z: '小', py: 'xiǎo', bs: '小', bh: 3 },
    { z: '少', py: 'shǎo', bs: '小', bh: 4 },
    { z: '牛', py: 'niú', bs: '牛', bh: 4 },
    { z: '果', py: 'guǒ', bs: '木', bh: 8 },
    { z: '鸟', py: 'niǎo', bs: '鸟', bh: 5 },
  ],
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
