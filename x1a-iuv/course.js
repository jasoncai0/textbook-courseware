'use strict';
/* i u ü y w · 本课数据。拼音模板见 ../shared/hanyu.js，低年级通用见 ../shared/hanzi.js（都在顶层调用，deck.js 加载前渲染完） */

Hanyu.init({
  /* 情境图热点：x / y 是 assets/qingjing.jpg 上的百分比位置（已按生成的图核对） */
  scene: [
    { x: 41, y: 28, l: 'i', say: '晾衣服 i i i' },
    { x: 79, y: 74, l: 'u', say: '小乌龟 u u u' },
    { x: 22, y: 82, l: 'ü', say: '小鱼吐泡泡 ü ü ü' },
    { x: 13, y: 28, l: 'y', say: '树杈 y y y' },
    { x: 82, y: 26, l: 'w', say: '屋顶尖尖 w w w' },
  ],
  letters: [
    { l: 'i', tip: '晾衣服 i i i' },
    { l: 'u', tip: '小乌龟 u u u' },
    { l: 'ü', tip: '小鱼 ü ü ü' },
    { l: 'y', tip: '树杈 y y y' },
    { l: 'w', tip: '屋顶 w w w' },
  ],
  tones: ['i', 'u', 'ü'],
  tonequiz: ['ǐ', 'ū', 'ǘ', 'yì', 'wǔ', 'yǔ'],
  write: 'i u ü y w',
});
Hanzi.init({});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
