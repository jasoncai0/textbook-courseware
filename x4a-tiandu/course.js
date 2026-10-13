'use strict';
/* 爬天都峰 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 讲故事：起因 → 经过 → 结果 */
const PLOT = [
  { step: 1, stage: '起因', text: '峰顶高，石级陡，“我”不敢爬', pic: 'fengjiao', pos: '50% 70%', x: 12, y: 96 },
  { step: 2, stage: '经过', text: '遇见老爷爷，约好一起爬', pic: 'xiangyu', x: 37, y: 80 },
  { step: 3, stage: '经过', text: '奋力攀铁链，手脚并用向上爬', pic: 'panpa', x: 63, y: 62 },
  { step: 4, stage: '结果', text: '都爬上峰顶，互相感谢', pic: 'fengding', x: 88, y: 46 },
];

/* 课后第 1 题：按什么顺序写 */
const KINDS = ['爬山前', '爬山中', '爬上峰顶后'];
const SORT = [
  { s: '我站在天都峰脚下抬头望：啊，峰顶这么高……', ok: ['爬山前'], q: '站在山脚下' },
  { s: '“小朋友，你也来爬天都峰？”', ok: ['爬山前'], q: '在山脚遇见老爷爷' },
  { s: '一会儿攀着铁链上，一会儿手脚并用向上爬', ok: ['爬山中'], q: '正在往上爬' },
  { s: '在鲫鱼背前，爸爸给我和老爷爷照了一张相', ok: ['爬上峰顶后'], q: '到了峰顶' },
  { s: '“你们这一老一小真有意思……”', ok: ['爬上峰顶后'], q: '峰顶上爸爸说的话' },
];

/* 小练笔 */
const MOMENTS = [
  {
    name: '第一次骑自行车', pic: 'panpa',
    prompt: '第一次骑自行车时，你怕不怕？后来怎么学会的？',
    hint: '按“骑之前—骑的时候—学会以后”写，写清楚你怎么想、怎么做。',
    example: '看着高高的自行车，我心里直打鼓：我骑得上去吗？爸爸扶着后座说：“别怕，我在后面。”我咬咬牙，双手紧紧握住车把，一只脚踩上踏板……',
  },
  {
    name: '第一次上台', pic: 'xiangyu',
    prompt: '第一次站在台上讲话、表演，你是怎么鼓起勇气的？',
    hint: '有没有人鼓励你？写写他说的话。',
    example: '轮到我了，我的腿有点发软。同桌小声说：“加油，你练得最熟！”我深吸一口气，走上了讲台……',
  },
  {
    name: '我自己想', pic: 'fengding',
    prompt: '你还做成过哪件一开始不敢做的事？',
    hint: '先写“不敢”，再写“怎么做”，最后写“做成以后”。',
    example: '我以前不敢一个人去楼下的小超市买东西……',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ plot: PLOT, sort: SORT, kinds: KINDS, moments: MOMENTS });
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
