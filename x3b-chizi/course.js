'use strict';
/* 池子与河流 · 本课数据与互动。记叙文模板见 ../shared/narrative.js（诗节字幕：一节一段，只显示当前一节） */

/* 联系生活：哪些像河流 */
const PICKS = {
  life: [
    { t: '每天练一会儿琴，越弹越好', ok: true, why: '才能常用，越来越强' },
    { t: '放暑假两个月一本书也不看，开学字都写生了', ok: false, why: '像池子，才能衰退了' },
    { t: '跑步得了第一，以后就再也不练了', ok: false, why: '让懒惰支配了' },
    { t: '会画画，就常给班级画黑板报', ok: true, why: '用才能给大家带来好处' },
  ],
};

/* 你更赞同谁 */
const WHY = {
  cz: '池子图清闲，可一直不动，水就脏了、干了。休息是为了更好地做事哦。',
  hl: '河流不怕辛苦，不断流动，水才清洁；还给人们带来利益。',
};
function initVote() {
  const box = document.querySelector('.cz-vote');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-v]');
    if (!b) return;
    box.querySelectorAll('[data-v]').forEach((x) => x.classList.toggle('solid', x === b));
    document.getElementById('czWhy').textContent = WHY[b.dataset.v];
  });
}

/* 分屏对话：谁说话谁那一边亮（最新一句的 data-who 写到 .cz-duet 上，CSS 只显示每边最新一节） */
function updateDuet(slide, step) {
  const box = slide.querySelector('.cz-duet');
  if (!box) return;
  let who = '';
  box.querySelectorAll('[data-who][data-step]').forEach((el) => { if (+el.dataset.step <= step) who = el.dataset.who; });
  box.dataset.who = who;
}

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS });
    initVote();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateDuet(slide, step);
  },
};
