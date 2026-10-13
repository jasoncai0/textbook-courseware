'use strict';
/* 落花生 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 品读 · 借物喻人：正面是花生的特点，背面是像这样的人 */
const CLUE_LABELS = ['花生的特点', '像这样的人'];
const CLUES = [
  { q: '它的果实埋在地里，不像桃子、石榴、苹果那样，把鲜红嫩绿的果实高高地挂在枝上。', a: '默默无闻，不炫耀自己，不追求外表的好看。' },
  { q: '等到成熟了，也不能立刻分辨出来它有没有果实，必须挖起来才知道。', a: '有真本领却不张扬，要和他相处久了、做事时才看得出来。' },
  { q: '它虽然不好看，可是很有用。', a: '不讲体面，实实在在地对别人有好处。' },
  { q: '味道很美，可以榨油，价钱便宜，谁都可以买来吃。', a: '平凡普通，却在为大家服务，人人都离不开。' },
];

/* 小练笔：四样事物在同一张四宫格图里，按位置裁切 */
const MOMENTS = [
  {
    name: '竹子', pic: 'sige', pos: '0% 0%',
    prompt: '竹子挺拔正直，一节一节往上长，中间是空的。看到竹子，你会想到哪些人？',
    hint: '竹子的特点：正直、有节、虚心（中间空）、坚韧，风吹不倒。它像谁？',
    example: '竹子一节一节，笔直地往上长，风再大也只是弯一弯腰。它让我想起我们的班主任王老师：她说话做事总是直来直去，从不偏心；遇到困难，她弯一弯腰，又笑着站直了。',
  },
  {
    name: '梅花', pic: 'sige', pos: '100% 0%',
    prompt: '梅花在寒冬里开放，越冷开得越精神。看到梅花，你会想到哪些人？',
    hint: '梅花的特点：不怕严寒、在别的花凋谢时开放、香气清淡。它像谁？',
    example: '大雪压在枝头，梅花却开得正好。它让我想起凌晨就出门扫雪的环卫工人：天越冷，他们越早，等我们出门时，路已经干干净净了。',
  },
  {
    name: '蜜蜂', pic: 'sige', pos: '0% 100%',
    prompt: '蜜蜂从早到晚飞来飞去采蜜，酿出的蜜却给了别人。看到蜜蜂，你会想到哪些人？',
    hint: '蜜蜂的特点：勤劳、团结、默默付出、自己吃得很少。它像谁？',
    example: '小蜜蜂一天要飞好多趟，酿的蜜自己却舍不得吃。它让我想起奶奶：她每天忙个不停，做好的饭菜总是先端给我们，自己最后才吃。',
  },
  {
    name: '路灯', pic: 'sige', pos: '100% 100%',
    prompt: '路灯站在路边，天一黑就亮起来，照着行人回家。看到路灯，你会想到哪些人？',
    hint: '路灯的特点：默默站着、照亮别人、天亮就熄灭，没人注意它。它像谁？',
    example: '路灯一整夜站在路边，照着每一个晚归的人，天亮了，它就悄悄熄灭。它让我想起小区门口的保安叔叔：他夜里守着大门，我们睡得安稳，却很少有人记得对他说一声谢谢。',
  },
];

// 四宫格裁切：放大一倍，按事物所在的格子定位
function cropMoments() {
  const img = document.getElementById('momentImg');
  const apply = (i) => { img.style.backgroundSize = '200% 200%'; img.style.backgroundPosition = MOMENTS[i].pos; };
  document.getElementById('momentBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-i]');
    if (btn) apply(+btn.dataset.i);
  });
  apply(0);
}

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    cropMoments();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
