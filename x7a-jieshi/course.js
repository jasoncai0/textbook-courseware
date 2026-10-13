'use strict';
/* 天上的街市 · 本课数据：背诵挖空（../shared/poem.js）、三首牛郎织女诗、写小诗 */

const POEMS = {
  jieshi: {
    title: '天上的街市', author: '郭沫若',
    lines: [
      '远远的街灯明了，', '好像闪着无数的明星。', '天上的明星现了，', '好像点着无数的街灯。',
      '我想那缥缈的空中，', '定然有美丽的街市。', '街市上陈列的一些物品，', '定然是世上没有的珍奇。',
      '你看，那浅浅的天河，', '定然是不甚宽广。', '那隔着河的牛郎织女，', '定能够骑着牛儿来往。',
      '我想他们此刻，', '定然在天街闲游。', '不信，请看那朵流星，', '是他们提着灯笼在走。',
    ].map((t) => ({ t })),
  },
};
Poem.render(POEMS);

const CLUE_LABELS = ['诗句', '借牛郎织女表达的情感'];
const CLUES = [
  { q: '<b>秋夕</b>〔唐〕杜牧<br>银烛秋光冷画屏，轻罗小扇扑流萤。<br>天阶夜色凉如水，卧看牵牛织女星。', a: '深宫秋夜，一个人扑萤、看星——借“卧看牵牛织女星”写出宫中女子的<b>孤寂、幽怨</b>，也透出对美好爱情的向往。' },
  { q: '<b>七夕</b>〔唐〕李商隐<br>鸾扇斜分凤幄开，星桥横过鹊飞回。<br>争将世上无期别，换得年年一度来。', a: '牛女还能年年相会，人间的永别却再无见期——借七夕抒发与亲人<b>生死永别的哀痛</b>。' },
  { q: '<b>鹊桥仙</b>〔宋〕秦观<br>纤云弄巧，飞星传恨，银汉迢迢暗度。金风玉露一相逢，便胜却人间无数。<br>柔情似水，佳期如梦，忍顾鹊桥归路。两情若是久长时，又岂在朝朝暮暮？', a: '一年一会，胜过人间无数——歌颂<b>真挚、坚贞的爱情</b>：“两情若是久长时，又岂在朝朝暮暮？”' },
];

const MOMENTS = [
  {
    name: '月亮', pic: 'jiedeng',
    prompt: '仰望月亮：它像什么？那上面会有什么？写一首四到八行的小诗。',
    hint: '联想：月亮像……（盘子、小船、灯笼）；想象：上面住着谁？在做什么？',
    example: '弯弯的月亮升起来，\n好像一只银色的小船。\n我想那小船上，\n定然坐着一位摆渡的老人，\n他把迷路的星星，\n一颗一颗送回家。',
  },
  {
    name: '星星', pic: 'tianjie',
    prompt: '满天星星一眨一眨的。由星星你会联想到什么？再想象一个星星上的故事。',
    hint: '可以从星星的“眨”、星星的“多”、星星的“远”入手。',
    example: '满天的星星眨着眼，\n好像在悄悄说话。\n我想它们一定在商量，\n今夜派谁去人间，\n落进哪个孩子的梦里。',
  },
  {
    name: '银河', pic: 'tianhe',
    prompt: '夏夜的银河像一条发光的河。写一写你想象中的银河。',
    hint: '河里流的是什么？河边有什么？谁会在河上？',
    example: '那一条淡淡的银河，\n好像撒了一路的白糖。\n我想河边的孩子们，\n定然捧着小碗，\n舀起一勺勺星光。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    Poem.init();
    document.querySelectorAll('.stress-btn').forEach((b) => b.addEventListener('click', () => {
      const on = b.closest('.slide').classList.toggle('stress-on');
      b.classList.toggle('on', on);
    }));
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
