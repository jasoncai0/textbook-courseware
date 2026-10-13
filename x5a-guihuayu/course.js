'use strict';
/* 桂花雨 · 本课逻辑：换词比较、思乡天平、练笔。页面逻辑见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 课后第 2 题：正面是改过的句子，背面是原文和体会 */
const CLUE_LABELS = ['改过的句子', '原文 · 体会'];
const CLUES = [
  { q: '桂花盛开的时候，十几家邻居都闻到了桂花香。', a: '“不说香飘十里，至少……没有不浸在桂花香里的。”“没有不”比“都”语气更强；“浸”写出香气像水一样把人泡在里面——香得浓、香得广，满是自豪。' },
  { q: '全年，整个村子都有桂花的香气。', a: '“全年，整个村子都浸在桂花的香气里。”又一个“浸”：从开花香到过年，香满了整个村子，也香满了“我”的回忆。' },
  { q: '这下，我帮大人摇桂花树，桂花落下来了。', a: '“我可乐了，帮大人抱着桂花树，使劲地摇。摇哇摇……”“可乐了”“使劲”“摇哇摇”，盼了好久，终于能摇了，开心极了。' },
  { q: '我说：“像下雨。”', a: '“我喊着：‘啊！真像下雨，好香的雨呀！’”“喊”、叹词“啊”、两个感叹号——快乐得忍不住大喊。' },
];

/* 练笔：借物写情 */
const MOMENTS = [
  {
    name: '我的“桂花雨”', pic: 'yaohua',
    prompt: '你的童年里，有没有一样东西，一想起它就想起一段快乐的时光？像“桂花雨”一样写一写。',
    hint: '先写这样东西的样子，再写一件和它有关的事，最后写现在想起它的心情。',
    example: '外婆家门口有一棵枣树。每年秋天，表哥爬上树一摇，红枣噼里啪啦地往下掉，砸得我们又叫又笑。现在超市里的枣又大又甜，可我总觉得，还是外婆家的枣最好吃。',
  },
  {
    name: '母亲的心里话', pic: 'sixiang',
    prompt: '“我”捡回一大袋杭州的桂花，母亲却说“这里的桂花再香，也比不上家乡院子里的桂花”。这时母亲心里在想什么？',
    hint: '联系课文：家乡院子里的桂花树、摇花、送邻居、泡茶做糕饼……',
    example: '这桂花真香啊，可闻着闻着，我就想起了家里那棵老桂花树。这时候，它该开花了吧？谁去摇呢？胡家老爷爷、毛家老婆婆，今年还能做桂花糕饼吗？',
  },
  {
    name: '摇花那一刻', pic: 'yaohua',
    prompt: '桂花纷纷落下，“我们满头满身都是桂花”。展开想象，写写这一刻你看到、闻到、感觉到了什么。',
    hint: '可以写桂花落在脸上、头发里的感觉，写香气，写大家的笑声。',
    example: '桂花像金色的小雨点，扑簌簌地落在我的头发上、脖子里，痒痒的。我张开手，一会儿就接了一小捧。空气里全是甜甜的香味，我忍不住大喊：“好香的雨呀！”',
  },
];

/* 课后第 3 题：天平。论香气，杭州更香（先偏左）；家乡桂花里的东西一样样放上去，天平倒向家乡 */
const BEAM_CX = 400;
const BEAM_CY = 128;
const ARM = 180;
const START_DEG = -6;
const DEG_PER_WEIGHT = 4.5;

function tiltScale(slide) {
  const n = slide.querySelectorAll('#panR .w.on').length;
  const deg = START_DEG + n * DEG_PER_WEIGHT;
  const rad = (deg * Math.PI) / 180;
  const dx = ARM * Math.cos(rad);
  const dy = ARM * Math.sin(rad);
  // 用 CSS transform（单位即 SVG 用户坐标），才能有过渡动画
  slide.querySelector('#beam').style.transform = `rotate(${deg.toFixed(1)}deg)`;
  slide.querySelector('#panL').style.transform = `translate(${(BEAM_CX - dx).toFixed(1)}px, ${(BEAM_CY - dy).toFixed(1)}px)`;
  slide.querySelector('#panR').style.transform = `translate(${(BEAM_CX + dx).toFixed(1)}px, ${(BEAM_CY + dy).toFixed(1)}px)`;
}

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    tiltScale(document.querySelector('.s-scale'));
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-scale')) tiltScale(slide);
  },
};
