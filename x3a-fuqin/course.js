'use strict';
/* 父亲、树林和鸟 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 课后第 2 题：你同意这些判断吗？ */
const KINDS = ['同意', '不同意'];
const SORT_ITEMS = [
  { s: '父亲一生最喜欢树林和鸟。', ok: ['同意'], q: '课文第一句就这样写；鸟唱歌时，父亲也最快活。' },
  { s: '父亲对鸟的习性十分了解。', ok: ['同意'], q: '他知道鸟成群过夜、黎明抖羽毛、准备歌唱。' },
  { s: '父亲很善于观察。', ok: ['同意'], q: '望了又望，闻了又闻；没有风，叶子却在动。' },
  { s: '父亲热爱自然。', ok: ['同意'], q: '喜欢树林和鸟，轻声说话，生怕惊动鸟。' },
  { s: '父亲曾经是个猎人。', ok: ['同意', '不同意'], q: '可以讨论：他懂猎人的门道，可他爱鸟、不打鸟。' },
];

/* 林边对话：雾的浓淡跟着读到的句子走（data-fog），对话区自动滚到最新一句 */
function updateTalk(slide, step) {
  const talk = slide.querySelector('.talk');
  if (!talk) return;
  const shown = [...talk.querySelectorAll('.tk')].filter((el) => +el.dataset.step <= step);
  const fogSrc = shown.filter((el) => el.dataset.fog !== undefined).pop();
  slide.querySelector('.fog').style.opacity = fogSrc ? fogSrc.dataset.fog : slide.dataset.fog;
  const last = shown[shown.length - 1];
  if (last && talk.scrollHeight > talk.clientHeight) talk.scrollTo({ top: last.offsetTop + last.offsetHeight - talk.clientHeight + 8, behavior: 'smooth' });
}

window.LESSON = {
  init() {
    Narrative.init({ kinds: KINDS, sort: SORT_ITEMS });
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateTalk(slide, step);
  },
};
