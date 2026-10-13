'use strict';
/* 散文二篇 · 本课数据。本课独有：生命意象卡、三种激情结构图；旁批与原文联动 */

const CLUES = [
  { q: '臼齿 · 盲肠 · 头发 · 兴味', a: '一样样丢失——时间一去不返，个人生命有限。' },
  { q: '一件衬衣', a: '衬衣脏了破了能洗能补，生命却不能——个人生命不可重来。' },
  { q: '地面上的小草', a: '卑微、柔弱，却每年冬天过后一根根钻出来——生命顽强不息。' },
  { q: '小牛犊 · 金黄的茸毛', a: '“永远的小牛犊”——一代又一代，生命永远年轻。' },
  { q: '不懂疲倦的旅客', a: '在一个个个体里暂住，又离开前去——个体消逝，生命长存。' },
  { q: '终于要凋谢的花朵', a: '凋谢与不朽混为一体：生命借凋谢的花朵不断给世界色彩和芬芳。' },
];

/* 旁批 ↔ 原文联动 */
function initPangpi() {
  document.querySelectorAll('.s-pp').forEach((slide) => {
    slide.querySelector('.pbs').addEventListener('click', (e) => {
      const b = e.target.closest('.pb');
      if (!b) return;
      const open = !b.classList.contains('open');
      slide.querySelectorAll('.pb').forEach((x) => x.classList.toggle('open', x === b && open));
      slide.querySelectorAll('.ps').forEach((p) => p.classList.toggle('lit', open && p.dataset.k === b.dataset.k));
      const hit = slide.querySelector(`.ps[data-k="${b.dataset.k}"]`);
      if (open && hit) hit.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
}

const MOMENTS = [
  {
    name: '我眼中的“永久”', pic: 'xiaocao',
    prompt: '学《永久的生命》，选一个身边的意象（如一棵老树、一条小河、一盏路灯），写写你对“暂时”与“永久”的感悟。',
    hint: '先写具体的形象，再由形象说出一个道理；道理要从形象里自然“长”出来。',
    example: '学校门口那棵老槐树，每年秋天都落光叶子。地上的叶子被扫走了，一片也留不下。可第二年四月，它又满树新绿——今年的叶子不是去年的，老槐树却还是那棵老槐树。一片叶子是暂时的，一棵树的绿却是长久的。',
  },
  {
    name: '我为什么而学习', pic: 'xingchen',
    prompt: '仿照罗素“总—分—总”的写法，写一段“我为什么而学习”（或“我为什么而坚持……”）。',
    hint: '开头一句概括两三个理由，中间分别说，结尾一句总结。可以用一个比喻。',
    example: '对未知的好奇，对父母的感激，对未来的期待，这三样东西推着我每天坐到书桌前。我学习，首先是因为好奇……其次是因为感激……最后是因为期待……这就是我为什么学习，我觉得这样的每一天都值得。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: ['意象', '它说的道理'], moments: MOMENTS });
    initPangpi();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
