'use strict';
/* 枣儿 · 本课互动。本课独有：老人 / 男孩双声部对话（左右分声部，舞台说明居中）+ “枣儿”象征层层剥开 + 两条情感线 */

/* 双声部：最新出现的一句滚到可见处 */
function scrollDuet(slide) {
  const on = slide.querySelectorAll('.duet > .on');
  if (on.length) on[on.length - 1].scrollIntoView({ block: 'nearest' });
}

/* 读读写写里四字词的卡片加宽（pinyin.js 已先渲染好卡片） */
document.querySelectorAll('.zy-write').forEach((c) => { if (c.querySelector('ruby').firstChild.textContent.length > 3) c.classList.add('zy-long'); });

window.LESSON = {
  init() {
    Narrative.init({});
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    scrollDuet(slide);
  },
};
