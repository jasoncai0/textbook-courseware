'use strict';
/* 刘胡兰 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：挽词“生的伟大，死的光荣”八个字逐字出现（页面文字）、“三次回答”台阶、联系上下文猜词义
 * 安全：只用油画风空镜和远景背影；第 2、3 自然段不配画面；不画人物、伤亡、刑具 */

Hanzi.init({
  cards: [
    { z: '刘', py: 'liú', bs: '刂', bh: 6, words: [['刘胡兰', 'liú hú lán']] },
    { z: '兰', py: 'lán', bs: '丷', bh: 5, words: [['刘胡兰', 'liú hú lán'], ['兰花', 'lán huā']] },
    { z: '派', py: 'pài', bs: '氵', bh: 9, words: [['反动派', 'fǎn dòng pài'], ['派出', 'pài chū']] },
    { z: '被', py: 'bèi', bs: '衤', bh: 10, words: [['被捕', 'bèi bǔ'], ['被子', 'bèi zi']] },
    { z: '血', py: 'xuè', bs: '血', bh: 6, words: [['鲜血', 'xiān xuè'], ['血淋淋', 'xiě lín lín']] },
    { z: '拉', py: 'lā', bs: '扌', bh: 8, words: [['拉到', 'lā dào'], ['拉手', 'lā shǒu']] },
    { z: '兵', py: 'bīng', bs: '八', bh: 7, words: [['民兵', 'mín bīng'], ['士兵', 'shì bīng']] },
    { z: '挺', py: 'tǐng', bs: '扌', bh: 9, words: [['挺起胸膛', 'tǐng qǐ xiōng táng'], ['挺立', 'tǐng lì']] },
    { z: '杀', py: 'shā', bs: '木', bh: 6, words: [['要杀要砍', 'yào shā yào kǎn'], ['杀虫', 'shā chóng']] },
    { z: '烈', py: 'liè', bs: '灬', bh: 10, words: [['烈士', 'liè shì'], ['热烈', 'rè liè']] },
  ],
  pick: [
    { q: 'liú', ans: '刘', opts: ['对', '刘', '列'] },
    { q: 'lán', ans: '兰', opts: ['兰', '半', '关'] },
    { q: 'pài', ans: '派', opts: ['泳', '派', '脉'] },
    { q: 'bèi', ans: '被', opts: ['被', '皮', '破'] },
    { q: 'lā', ans: '拉', opts: ['位', '立', '拉'] },
    { q: 'bīng', ans: '兵', opts: ['兵', '丘', '共'] },
    { q: 'tǐng', ans: '挺', opts: ['廷', '挺', '庭'] },
    { q: 'liè', ans: '烈', opts: ['列', '热', '烈'] },
    { q: 'xuè', ans: '血', opts: ['皿', '血', '而'] },
  ],
  write: [
    { z: '刘', py: 'liú', bs: '刂', bh: 6 },
    { z: '民', py: 'mín', bs: '乙', bh: 5 },
    { z: '反', py: 'fǎn', bs: '又', bh: 4 },
    { z: '村', py: 'cūn', bs: '木', bh: 7 },
    { z: '被', py: 'bèi', bs: '衤', bh: 10 },
    { z: '关', py: 'guān', bs: '丷', bh: 6 },
    { z: '道', py: 'dào', bs: '辶', bh: 12 },
    { z: '兵', py: 'bīng', bs: '八', bh: 7 },
  ],
});

const STORY = {
  picks: {
    mai: [
      { t: '用钱引诱她，让她说出谁是共产党员', ok: true, why: '对！后面说“给你一百块钱”' },
      { t: '到商店里买东西', ok: false, why: '这里不是买东西' },
    ],
    xie: [
      { t: '用可怕的话吓唬她，逼她说出来', ok: true, why: '对！“不说就枪毙你”就是威胁' },
      { t: '和她好好商量', ok: false, why: '敌人是在吓唬她' },
    ],
    sheng: [
      { t: '为了正义的事业献出了生命', ok: true, why: '对！所以说她“光荣地牺牲了”' },
      { t: '不小心受了一点伤', ok: false, why: '“牺牲”是献出了生命' },
    ],
  },
};

window.LESSON = {
  init() { Narrative.init(STORY); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
