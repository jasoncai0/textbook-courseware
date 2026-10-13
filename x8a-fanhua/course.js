'use strict';
/* 梦回繁华 · 本课专属互动：滑块“展卷”——城郊、汴河、街市三段长卷 + 乐章节奏条 */

const PARTS = [
  { max: 30, tempo: [0, 1], txt: '<b>城郊（慢板 · 柔板）：</b>疏林薄雾，农舍田畴，春寒料峭，赶集的乡人驱赶着往城内送炭的毛驴驮队……树木新发的枝芽，表现出北国早春的气息。' },
  { max: 72, tempo: [2, 3], txt: '<b>汴河（快板 · 紧板）：</b>巨大的漕船，舳舻相接……一艘准备驶过拱桥的巨大漕船：船正在放倒桅杆准备过桥，船夫们呼唤叫喊，握篙盘索——“这紧张的一幕，成为全画的一个高潮”。' },
  { max: 100, tempo: [4], txt: '<b>街市（渐入尾声）：</b>在高大雄伟的城楼两侧，街道纵横，房屋林立……街上行人摩肩接踵，络绎不绝，士农工商，男女老少，各行各业，无所不备。' },
];

function initScroll() {
  const strip = document.getElementById('strip');
  const range = document.getElementById('unroll');
  const txt = document.getElementById('scrollTxt');
  const tempos = [...document.querySelectorAll('#tempo span')];
  const update = () => {
    const v = +range.value;
    strip.style.transform = `translateX(${(-v / 100) * (200 / 3)}%)`;
    const part = PARTS.find((p) => v <= p.max);
    tempos.forEach((t) => t.classList.toggle('on', part.tempo.includes(+t.dataset.t)));
    txt.innerHTML = part.txt;
  };
  range.addEventListener('input', update);
  update();
}

window.LESSON = {
  init() {
    Narrative.init({});
    initScroll();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
