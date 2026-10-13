'use strict';
/* 秋天 · 本课数据。记叙文故事页见 ../shared/narrative.js，低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

/* 第 2 自然段：大雁队形。sx/sy 散飞，rx/ry “人”字，yx/yy “一”字（400 × 200 坐标）；跟着字幕 .f-ren / .f-yi 变队形，见 course.css */
const GEESE = [
  [60, 120, 200, 40, 60, 100], [110, 80, 170, 62, 95, 100], [150, 140, 230, 62, 130, 100],
  [190, 60, 140, 84, 165, 100], [230, 110, 260, 84, 200, 100], [270, 70, 110, 106, 235, 100],
  [300, 150, 290, 106, 270, 100], [340, 90, 80, 128, 305, 100], [370, 130, 320, 128, 340, 100],
];
document.getElementById('geese').innerHTML = GEESE.map(([sx, sy, rx, ry, yx, yy], i) =>
  `<g class="goose" style="--sx:${sx}px;--sy:${sy}px;--rx:${rx}px;--ry:${ry}px;--yx:${yx}px;--yy:${yy}px;--fl:${(i % 3) * 0.15}s"><path d="M-14 0Q-7 -10 0 0Q7 -10 14 0"/></g>`).join('');

Hanzi.init({
  pick: {
    yi: [
      { q: '一片片', py: '_ piàn piàn', ans: 'yí', opts: ['yī', 'yí', 'yì'] },
      { q: '一群', py: '_ qún', ans: 'yì', opts: ['yī', 'yí', 'yì'] },
      { q: '一会儿', py: '_ huìr _', ans: 'yí', opts: ['yī', 'yí', 'yì'] },
      { q: '“一”字', py: '_ zì', ans: 'yī', opts: ['yī', 'yí', 'yì'] },
    ],
  },
  cards: [
    { z: '秋', py: 'qiū', bs: '禾', bh: 9, words: [['秋天', 'qiū tiān'], ['秋风', 'qiū fēng']] },
    { z: '气', py: 'qì', bs: '气', bh: 4, words: [['天气', 'tiān qì'], ['空气', 'kōng qì']] },
    { z: '了', py: 'le', bs: '乛', bh: 2, words: [['凉了', 'liáng le'], ['来了', 'lái le']] },
    { z: '树', py: 'shù', bs: '木', bh: 9, words: [['树叶', 'shù yè'], ['大树', 'dà shù']] },
    { z: '叶', py: 'yè', bs: '口', bh: 5, words: [['树叶', 'shù yè'], ['叶子', 'yè zi']] },
    { z: '片', py: 'piàn', bs: '片', bh: 4, words: [['一片片', 'yí piàn piàn'], ['叶片', 'yè piàn']] },
    { z: '大', py: 'dà', bs: '大', bh: 3, words: [['大雁', 'dà yàn'], ['大人', 'dà rén']] },
    { z: '飞', py: 'fēi', bs: '乙', bh: 3, words: [['飞机', 'fēi jī'], ['往南飞', 'wǎng nán fēi']] },
    { z: '会', py: 'huì', bs: '人', bh: 6, words: [['一会儿', 'yí huìr _'], ['学会', 'xué huì']] },
    { z: '个', py: 'gè', bs: '人', bh: 3, words: [['一个', 'yí gè'], ['个子', 'gè zi']] },
  ],
  evolve: [
    { z: '秋', old: ['禾', '火'], note: '“禾”是庄稼，“火”像火一样的颜色——庄稼成熟、一片金黄的季节就是秋天。（帮助记字的说法）' },
    { z: '子', note: '像包在襁褓里的小娃娃：大大的头，张开两只小手。' },
    { z: '大', note: '像一个人张开双手、叉开双脚，变得很“大”。' },
  ],
  apples: [['秋', 'qiū'], ['气', 'qì'], ['了', 'le'], ['树', 'shù'], ['叶', 'yè'], ['片', 'piàn'], ['大', 'dà'], ['飞', 'fēi'], ['会', 'huì'], ['个', 'gè']],
  write: [
    { z: '了', py: 'le', bs: '乛', bh: 2 },
    { z: '子', py: 'zǐ', bs: '子', bh: 3 },
    { z: '人', py: 'rén', bs: '人', bh: 2 },
    { z: '大', py: 'dà', bs: '大', bh: 3 },
  ],
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
