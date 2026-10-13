'use strict';
/* 王戎不取道旁李 · 本课数据与互动。文言横排 + 译文见 ../shared/poem.js，情节图、讲故事见 ../shared/narrative.js */

const POEMS = {
  wr: {
    title: '王戎不取道旁李', author: '《世说新语·雅量》', layout: 'h',
    lines: [
      { t: '王戎七岁，尝与诸小儿游。', r: '王戎/七岁，尝与/诸小儿/游。', y: '王戎七岁的时候，曾经和许多小孩一起玩耍。' },
      { t: '看道边李树多子折枝，', r: '看/道边/李树/多子/折枝，', f: '1.2 50% 35%', y: '他们看见路边有棵李树，结了很多李子，把树枝都压弯了，' },
      { t: '诸儿竞走取之，唯戎不动。', r: '诸儿/竞走/取之，唯戎/不动。', y: '孩子们都争着跑过去摘李子，只有王戎站着不动。' },
      { t: '人问之，答曰：', r: '人/问之，答曰：', y: '有人问他为什么不去摘，他回答说：' },
      { t: '“树在道边而多子，此必苦李。”', r: '“树/在道边/而/多子，此/必/苦李。”', y: '“李树长在路边，却结了这么多李子，这一定是苦李子。”' },
      { t: '取之，信然。', r: '取之，信然。', y: '摘来一尝，的确是这样。' },
    ],
    notes: { 王戎: '晋朝人，“竹林七贤”之一，自幼聪慧', 尝: '曾经', 竞走: '争着跑过去', 唯: '只有', 信然: '的确如此' },
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成句子

/* 讲故事 · 情节图（起因—经过—结果） */
const PLOT = [
  { step: 1, stage: '起因', text: '道边李树多子折枝', pic: 'daobian', x: 12, y: 92 },
  { step: 2, stage: '经过', text: '诸儿竞走取之，唯戎不动', pic: 'jingzou', x: 37, y: 60 },
  { step: 3, stage: '经过', text: '“树在道边而多子，此必苦李”', pic: 'sikao', x: 62, y: 36 },
  { step: 4, stage: '结果', text: '取之，信然', pic: 'kuli', x: 88, y: 64 },
];

/* 读与写 · 讲故事 */
const MOMENTS = [
  {
    name: '讲《王戎不取道旁李》', pic: 'jingzou',
    prompt: '用自己的话讲讲这个故事。',
    hint: '起因：路边李树结满了李子；经过：小伙伴争着去摘，只有王戎不动，说出理由；结果：一尝，果然是苦的。',
    example: '晋朝有个叫王戎的孩子，七岁时和小伙伴们出去玩。他们看见路边有棵李树，李子多得把树枝都压弯了。小伙伴们一窝蜂地跑过去摘，只有王戎站着不动。有人问他为什么不去，他说：“这棵树长在大路边，路过的人那么多，李子却还有这么多，一定是苦的。”大家摘下来一尝，果然苦得直吐舌头。',
  },
  {
    name: '王戎会怎么说', pic: 'sikao',
    prompt: '小伙伴尝了苦李子，跑来问王戎：“你怎么知道的？”王戎会怎么回答？',
    hint: '把“树在道边而多子，此必苦李”说得更清楚：先说“道边”，再说“多子”，最后说“必苦”。',
    example: '王戎笑着说：“你们想想，这棵树就长在大路边，每天有那么多人走过，要是李子是甜的，早就被摘光了。可它还结着这么多李子，说明大家都不愿意摘——那肯定是苦的呀！”',
  },
  {
    name: '我也动动脑', pic: 'daobian',
    prompt: '生活中，你有没有像王戎一样，先观察、再动脑筋想明白一件事？',
    hint: '写清楚：你看到了什么，想到了什么，后来怎么样。',
    example: '有一次，我看见蚂蚁排着队往高处搬家，就想：是不是要下雨了？我提醒妈妈收衣服，没过多久，果然下起了大雨。',
  },
];

/* 课后第 3 题 · 假如是甜李子 */
function initLi() {
  const svg = document.getElementById('liSvg');
  document.querySelector('.li-btns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-li]');
    if (!b) return;
    svg.setAttribute('class', `li-${b.dataset.li}`);
    document.querySelectorAll('.li-btns .btn').forEach((x) => x.classList.toggle('solid', x === b));
  });
}

window.LESSON = {
  init() {
    Narrative.init({ plot: PLOT, moments: MOMENTS });
    Poem.init();
    initLi();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
