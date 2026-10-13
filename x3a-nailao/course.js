'use strict';
/* 一块奶酪 · 本课数据。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 阅读提示一：围绕一块奶酪讲了一件什么事 */
const PLOT = [
  { step: 1, stage: '起因', text: '队长宣布：不许偷嘴，偷嘴的是自己也照样受罚', pic: 'jihe', x: 12, y: 90 },
  { step: 2, stage: '经过', text: '搬奶酪时，队长拽掉了一点儿奶酪渣', pic: 'nailao', x: 32, y: 74 },
  { step: 2, stage: '经过', text: '心七上八下，把大家支开', pic: 'nailao', pos: '60% 70%', x: 51, y: 58 },
  { step: 3, stage: '经过', text: '嗅嗅奶酪渣，犹豫，一跺脚', pic: 'duojiao', x: 70, y: 44 },
  { step: 3, stage: '结果', text: '让最小的蚂蚁吃掉，大家劲头更足', pic: 'nailao', pos: '40% 40%', x: 88, y: 36 },
];

/* 阅读提示二：喜不喜欢蚂蚁队长（正面：我的理由；背面：课文依据） */
const CLUE_LABELS = ['我的理由', '课文依据'];
const CLUES = [
  { q: '喜欢：它说到做到，规矩对自己也管用。', a: '“要是偷嘴的是您呢？”“照样要受处罚。”——没有人看见，它也没有偷嘴。' },
  { q: '喜欢：它能管住自己。', a: '“它低下头，嗅嗅那点儿奶酪渣，味道真香！可是，它犹豫了一会儿，终于一跺脚……”' },
  { q: '喜欢：它关心最小的蚂蚁。', a: '“这点儿奶酪渣是刚才弄掉的，丢了可惜，你吃掉它吧！”' },
  { q: '有点不喜欢：它把大家支开，是不是想偷偷吃？', a: '它确实动心了，还“生气了”。可正因为想吃，最后没吃，才更不容易。' },
];

window.LESSON = {
  init() {
    Narrative.init({ plot: PLOT, clues: CLUES, clueLabels: CLUE_LABELS });
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
