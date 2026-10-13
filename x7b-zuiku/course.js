'use strict';
/* 最苦与最乐 · 本课数据。通用页面逻辑见 ../shared/narrative.js */

/* 点句子：论点 / 论据 / 论证 */
const KINDS = ['论点', '论据', '论证'];
const SORT_ITEMS = [
  { s: '我说人生最苦的事，莫苦于身上背着一种未来的责任。', ok: ['论点'], q: '中心论点之一：最苦' },
  { s: '答应人办一件事没有办，欠了人的钱没有还，受了人的恩惠没有报答……', ok: ['论据'], q: '生活事例' },
  { s: '为什么呢？因为觉得对不住他呀，因为自己对于他的责任还没有解除呀！', ok: ['论证'], q: '分析原因，连接事例与观点' },
  { s: '自然责任完了，算是人生第一件乐事。', ok: ['论点'], q: '中心论点之二：最乐' },
  { s: '古语说得好，“如释重负”；俗语亦说的是，“心上一块石头落了地”。', ok: ['论据', '论证'], q: '引用名言作论据（引用论证）' },
  { s: '大抵天下事，从苦中得来的乐，才算是真乐。', ok: ['论点', '论证'], q: '分论点 / 道理论证：苦乐相连' },
  { s: '责任是要解除了才没有，并不是卸了就没有。', ok: ['论点', '论证'], q: '驳斥“卸却”，得出分论点' },
];

/* 两条路 */
const ROADS = {
  xie: { t: '卸却：躲开它', pic: 'zhongdan', q: '“你若是要躲，倒是自投苦海，永远不能解除了。”', a: '责任还在，良心的责备也还在——“睡里梦里都像有他的影子来缠着我”。' },
  jie: { t: '解除：尽了它', pic: 'haikuo', q: '“责任越重大，负责的日子越久长，到责任完了时，海阔天空，心安理得，那种快乐还要加几倍哩！”', a: '“人生须知道负责任的苦处，才能知道有尽责任的乐处。”' },
};
function initRoad() {
  const box = document.getElementById('roadScene');
  document.querySelector('.road-btns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-road]');
    if (!b) return;
    const r = ROADS[b.dataset.road];
    document.querySelectorAll('.road-btns .btn').forEach((x) => x.classList.toggle('solid', x === b));
    box.className = `road-scene ${b.dataset.road}`;
    box.innerHTML = `<div class="road-pic" style="background-image:url('assets/${r.pic}.jpg')"></div><h3>${r.t}</h3><p class="rq">${r.q}</p><p class="ra">${r.a}</p>`;
  });
}

/* 读写迁移 */
const MOMENTS = [
  {
    name: '我的责任清单', pic: 'zhongdan',
    prompt: '列出你现在身上的三项责任（对自己、对家庭、对集体），选一项说说你尽到了没有。',
    hint: '像梁启超那样从具体生活情境说起：答应了什么、该做什么、做完是什么感觉。',
    example: '对自己：按时完成作业；对家庭：每天倒垃圾、照看弟弟写作业；对班级：周三值日。上周值日我偷懒没擦窗台，第二天被扣了分，一整天心里都别扭——这就是“良心责备”吧。',
  },
  {
    name: '尽责的快乐', pic: 'shifu',
    prompt: '写一件你尽了责任之后感到“如释重负”的事。',
    hint: '先写“苦”（压力、辛苦），再写“乐”（完成那一刻的轻松），最后用一句话点出道理。',
    example: '运动会前我负责全班的报名表，跑了好几趟，改了三遍。交上去那一刻，心上一块石头落了地。原来，从苦中得来的乐，才是真乐。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ kinds: KINDS, sort: SORT_ITEMS, moments: MOMENTS });
    initRoad();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
