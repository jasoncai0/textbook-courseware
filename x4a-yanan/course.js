'use strict';
/* 延安，我把你追寻 · 本课数据与互动。诗节页、分类、仿写见 ../shared/narrative.js */

/* 资料袋 · 地图上找一找：k 对应地图上 .pin 的 data-k */
const PLACES = [
  { q: '延河叮咚的流水', a: '延河从延安城边流过，河边就是宝塔山。' },
  { q: '枣园梨花的清香', a: '枣园在延安城西北，那里有窑洞，春天梨花开得雪白。' },
  { q: '南泥湾开荒的镢头', a: '当年，人们抡起镢头在荒凉的南泥湾开荒种地，自己动手，丰衣足食，把荒地变成了“陕北的好江南”。' },
  { q: '杨家岭讲话的会场', a: '杨家岭在延安城西北，当年在这里召开过重要的会议，会上的讲话影响很深远。' },
  { q: '宝塔山顶天立地的脊梁', a: '宝塔山在延安城东南、延河边，山上的宝塔是延安的标志。诗人用它比喻延安精神，像脊梁一样撑起了我们。' },
];

function initMap(svg, info, count, places) {
  if (!svg) return;
  const seen = new Set();
  const show = (pin) => {
    const k = +pin.dataset.k;
    svg.querySelectorAll('.pin').forEach((p) => p.classList.toggle('cur', p === pin));
    pin.classList.add('seen');
    seen.add(k);
    count.textContent = seen.size;
    info.innerHTML = `<p class="mi-q">${places[k].q}</p><p class="mi-a">${places[k].a}</p>`;
  };
  svg.addEventListener('click', (e) => { const pin = e.target.closest('.pin'); if (pin) show(pin); });
  svg.addEventListener('keydown', (e) => { const pin = e.target.closest('.pin'); if (pin && e.key === 'Enter') show(pin); });
}

/* 品一品：可以告别的，不能丢的 */
const KINDS = ['可以告别', '不能丢掉'];
const SORT = [
  { s: '破旧的茅屋', ok: ['可以告别'], q: '生活好了，住进了高楼大厦' },
  { s: '老牛破车', ok: ['可以告别'], q: '有了宇宙飞船、电子计算机' },
  { s: '延安窑洞温热的土炕', ok: ['不能丢掉'], q: '“却忘不了”——忘不了延安的温暖' },
  { s: '宝塔山顶天立地的脊梁', ok: ['不能丢掉'], q: '“却不能丢”——不能丢延安的精神' },
];

/* 仿写 */
const MOMENTS = [
  {
    name: '追寻延安', pic: 'baota',
    prompt: '学着第 2 节，再给延安写一行诗。',
    hint: '格式：追寻你，（地方）（怎样）的（什么）。想想图上还有什么？',
    example: '追寻你，宝塔山金色的朝阳，\n追寻你，窑洞窗上红红的窗花。',
  },
  {
    name: '写我的家乡', pic: 'yanzi',
    prompt: '你的家乡有什么让你忘不了？也用“追寻你”写一写。',
    hint: '写家乡的一处风景、一样东西、一种声音。',
    example: '追寻你，小河边哗哗的水车，\n追寻你，外婆家门前桂花的清香。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: KINDS, moments: MOMENTS });
    initMap(document.querySelector('.ya-map'), document.getElementById('mapInfo'), document.getElementById('mapCount'), PLACES);
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
