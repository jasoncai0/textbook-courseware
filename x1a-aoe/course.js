'use strict';
/* a o e · 本课数据。拼音模板见 ../shared/hanyu.js，低年级通用见 ../shared/hanzi.js（都在顶层调用，deck.js 加载前渲染完） */

Hanyu.init({
  /* 情境图热点：x / y 是 assets/qingjing.jpg 上的百分比位置（图生成后核对） */
  scene: [
    { x: 74, y: 34, l: 'a', say: '小姑娘唱歌 a a a' },
    { x: 24, y: 46, l: 'o', say: '大公鸡打鸣 o o o' },
    { x: 50, y: 70, l: 'e', say: '大白鹅照镜子 e e e' },
  ],
  letters: [
    { l: 'a', tip: '张大嘴巴 a a a' },
    { l: 'o', tip: '圆圆嘴巴 o o o' },
    { l: 'e', tip: '扁扁嘴巴 e e e' },
  ],
  tones: ['a', 'o', 'e'],
  tonequiz: ['ǎ', 'ō', 'é', 'à', 'ě', 'ó'],
  write: 'a o e',
});
Hanzi.init({});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
