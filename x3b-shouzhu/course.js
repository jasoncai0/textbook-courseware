'use strict';
/* 守株待兔 · 本课数据与互动。文言横排 + 译文见 ../shared/poem.js，情节图、选一选、讲故事见 ../shared/narrative.js */

const POEMS = {
  shouzhu: {
    title: '守株待兔', author: '《韩非子·五蠹》', layout: 'h',
    lines: [
      { t: '宋人有耕者。', r: '宋人/有/耕者。', y: '宋国有个种田的人。' },
      { t: '田中有株。', r: '田中/有株。', y: '他的田里有一个树桩。' },
      { t: '兔走触株，折颈而死。', r: '兔走/触株，折颈/而死。', y: '一只兔子飞快地跑过来，撞在树桩上，折断脖子死了。' },
      { t: '因释其耒而守株，', r: '因/释其耒/而守株，', y: '于是他放下手里的耒，守在树桩旁边，' },
      { t: '冀复得兔。', r: '冀/复得兔。', y: '希望再得到撞死的兔子。' },
      { t: '兔不可复得，', r: '兔/不可/复得，', y: '兔子不可能再得到了，' },
      { t: '而身为宋国笑。', r: '而身/为宋国笑。', y: '他自己却被宋国人笑话。' },
    ],
    notes: { 株: '树桩', 走: '跑', 因: '于是', 释: '放下', 耒: '古代用来耕田的一种农具', 冀: '希望', 复: '再', 身: '自己', 为宋国笑: '被宋国人笑话' },
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成句子

/* 讲故事 · 情节图（起因—经过—结果） */
const PLOT = [
  { step: 1, stage: '起因', text: '宋国农夫在田里耕地', pic: 'gengtian', x: 12, y: 92 },
  { step: 1, stage: '起因', text: '兔走触株，折颈而死', pic: 'tuzou', x: 36, y: 62 },
  { step: 2, stage: '经过', text: '释其耒而守株，冀复得兔', pic: 'shouzhu', x: 62, y: 40 },
  { step: 3, stage: '结果', text: '兔不可复得，而身为宋国笑', pic: 'huangwu', x: 88, y: 66 },
];

/* 联系生活：哪些像守株待兔 */
const PICKS = {
  life: [
    { t: '有一次考试蒙对了题，以后就再也不复习了', ok: true, why: '把偶然当必然' },
    { t: '买过一次彩票中了小奖，就天天想着中大奖', ok: true, why: '只想等好运' },
    { t: '每天坚持练字，字越写越漂亮', ok: false, why: '这是努力，不是等' },
    { t: '有一天在路边捡到一元钱，以后天天去那儿等', ok: true, why: '和农夫一模一样' },
    { t: '遇到难题，多想几种办法去解决', ok: false, why: '这是动脑筋' },
  ],
};

/* 读与写 · 讲故事 */
const MOMENTS = [
  {
    name: '讲《守株待兔》', pic: 'shouzhu',
    prompt: '用自己的话讲讲《守株待兔》这个故事。',
    hint: '起因：兔子撞死在树桩上；经过：农夫放下农具守着树桩；结果：再也没得到兔子，被人笑话。',
    example: '从前，宋国有个农夫正在田里干活。忽然，一只兔子飞快地跑过来，“砰”地撞在田里的树桩上，折断脖子死了。农夫白捡了一只兔子，高兴极了。从那以后，他扔下农具，天天坐在树桩旁边等，盼着再有兔子撞上来。可是，兔子再也没有来，他的田却长满了野草。宋国人都笑话他。',
  },
  {
    name: '宋国人怎么笑他', pic: 'huangwu',
    prompt: '路过的宋国人看见农夫守着树桩，会怎么笑他、劝他？',
    hint: '想一想：别人会说什么？农夫听了会怎么回答？',
    example: '一个路人摇摇头说：“老兄，田都荒成这样了，你还在这儿干什么？”农夫说：“等兔子呀！上回就有一只撞死在这儿。”路人哈哈大笑：“兔子又不傻，哪能天天撞树桩？快回去种地吧！”',
  },
  {
    name: '讲《南辕北辙》', pic: 'gengtian',
    prompt: '用自己的话讲讲“阅读链接”里《南辕北辙》的故事。',
    hint: '抓住朋友的三次提醒和他的三个“没关系”。',
    example: '有个人要去南边的楚国，却赶着马车往北走。朋友提醒他，他说：“没关系，我的马跑得快。”朋友又说跑得越快离楚国越远，他说：“没关系，我的车夫本领大，我带的路费多。”可是方向错了，条件越好，离楚国就越远。',
  },
];

/* 课后第 2 题 · 陪农夫等兔子 */
const SAYS = ['农夫：“兔子快来吧！”', '还是没有兔子。', '田里的野草冒出来了……', '庄稼没人管，蔫了……', '野草比庄稼还高了！', '宋国人路过，都在笑他……'];
const MAX_DAYS = 30;
function initWait() {
  const svg = document.getElementById('szField');
  let day = 1;
  const show = () => {
    const g = Math.min(1, (day - 1) / 5);
    svg.style.setProperty('--g', g.toFixed(2));
    svg.querySelector('#szDay').textContent = `第 ${day} 天`;
    document.getElementById('szSay').textContent = SAYS[Math.min(SAYS.length - 1, day - 1)];
  };
  document.getElementById('szWait').addEventListener('click', () => { if (day < MAX_DAYS) { day += 1; show(); } });
  show();
}

/* 阅读链接 · 南辕北辙：条件越好，离楚国越远 */
const ROAD_STEP = 46;
const ROAD_SAYS = ['马跑得快——离楚国更远了！', '车夫本领大——又远了一大截！', '盘缠多——走得越久，离楚国越远！'];
function initRoad() {
  const box = document.querySelector('.sz-reasons');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-r]');
    if (!b || b.classList.contains('solid')) return;
    b.classList.add('solid');
    const n = box.querySelectorAll('.solid').length;
    document.getElementById('szCar').style.transform = `translateY(${-ROAD_STEP * n}px)`;
    document.getElementById('szGap').setAttribute('d', `M210 318 V ${250 - ROAD_STEP * n}`);
    document.getElementById('szRoadSay').textContent = ROAD_SAYS[+b.dataset.r];
  });
}

/* 寓言卡：正面故事，背面道理 */
function initFable() {
  document.querySelectorAll('.fable-card').forEach((c) => c.addEventListener('click', () => c.classList.toggle('flipped')));
}

window.LESSON = {
  init() {
    Narrative.init({ plot: PLOT, picks: PICKS, moments: MOMENTS });
    Poem.init();
    initWait();
    initRoad();
    initFable();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
