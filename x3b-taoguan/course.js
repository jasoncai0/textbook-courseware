'use strict';
/* 陶罐和铁罐 · 本课数据与互动。记叙文模板见 ../shared/narrative.js */

/* 课后第 1 题 · 情节图（起因—经过—结果） */
const PLOT = [
  { step: 1, stage: '起因', text: '骄傲的铁罐看不起陶罐，常常奚落它', pic: 'chugui', x: 10, y: 92 },
  { step: 1, stage: '经过', text: '铁罐越说越凶，陶罐不再理会', pic: 'chugui', pos: '30% 50%', x: 31, y: 66 },
  { step: 2, stage: '经过', text: '王朝覆灭，两个罐子埋在废墟里', pic: 'feixu', x: 52, y: 44 },
  { step: 3, stage: '结果', text: '陶罐被掘出，依然光洁美观', pic: 'juechu', x: 72, y: 62 },
  { step: 3, stage: '结果', text: '铁罐连影子也没见到', pic: 'tiexiu', x: 91, y: 86 },
];

/* 联系生活：哪些做法像陶罐 */
const PICKS = {
  life: [
    { t: '同学跑得没我快，我不笑话他，我们一起练', ok: true, why: '尊重别人' },
    { t: '我数学好，就说语文好的同学“笨”', ok: false, why: '这是铁罐的做法' },
    { t: '我画画不如同桌，就向他请教', ok: true, why: '看到别人的长处' },
    { t: '别人说我不好，我讲道理，不吵架', ok: true, why: '不卑不亢' },
    { t: '觉得自己什么都比别人强，谁也看不起', ok: false, why: '骄傲自大' },
  ],
};

/* 读与写 · 讲故事 */
const MOMENTS = [
  {
    name: '按图讲故事', pic: 'chugui',
    prompt: '用自己的话讲讲《陶罐和铁罐》这个故事。',
    hint: '起因：铁罐奚落陶罐；经过：两个罐子埋进废墟；结果：陶罐被挖出来，铁罐不见了。讲出铁罐傲慢、陶罐谦虚的样子。',
    example: '国王的橱柜里有一个铁罐和一个陶罐。铁罐仗着自己结实，昂着头对陶罐说：“你敢碰我吗？懦弱的东西！”陶罐谦虚地说：“我们是用来盛东西的，不是用来互相碰撞的。”铁罐更生气了。许多年过去了，王宫变成了废墟。人们挖出了陶罐，它还是那么光洁美观；可是铁罐呢，早就锈得连影子都找不到了。',
  },
  {
    name: '陶罐的心里话', pic: 'juechu',
    prompt: '人们翻遍了泥土，也没找到铁罐。这时候，陶罐心里会想些什么？',
    hint: '想一想：陶罐会怪铁罐吗？它会怎样想念这位“兄弟”？',
    example: '铁罐兄弟，你到哪里去了？你说过你永远在这里，什么也不怕，可现在……其实，我从来没有怪过你。要是你当初不那么骄傲，我们该能好好地做朋友啊。',
  },
  {
    name: '讲《北风和太阳》', pic: 'feixu',
    prompt: '用自己的话讲讲“阅读链接”里北风和太阳比赛的故事。',
    hint: '北风怎么做？行人怎样？太阳怎么做？行人又怎样？',
    example: '北风和太阳比赛，看谁能让行人脱下衣服。北风用尽力气吹，行人却把衣服裹得紧紧的。太阳不慌不忙，暖暖地照着，行人越来越热，最后把衣服脱了，跳到水里游泳去了。北风只好悄悄溜走了。',
  },
];

/* 课后第 2 题 · 点“？”看神态词 */
function initFaces() {
  document.querySelector('.tg-table').addEventListener('click', (e) => {
    const b = e.target.closest('.tg-face');
    if (b && !b.classList.contains('shown')) { b.textContent = b.dataset.w; b.classList.add('shown'); }
  });
}

/* 阅读链接 · 北风和太阳 */
const WIND_SAYS = {
  wind: '北风越用力吹，行人越把衣服裹得紧紧的，还把衣领竖起来挡风！',
  sun: '太阳暖暖地照，行人觉得很热，忍不住脱了衣服——太阳赢了！',
};
function initWind() {
  const svg = document.getElementById('tgMan');
  const btns = svg.closest('.stage').querySelector('.btns');
  btns.addEventListener('click', (e) => {
    const b = e.target.closest('[data-w]');
    if (!b) return;
    svg.classList.remove('wind', 'sun');
    svg.classList.add(b.dataset.w);
    btns.querySelectorAll('[data-w]').forEach((x) => x.classList.toggle('solid', x === b));
    document.getElementById('tgWindSay').textContent = WIND_SAYS[b.dataset.w];
  });
}

/* 寓言卡：正面故事，背面道理 */
function initFable() {
  document.querySelectorAll('.fable-card').forEach((c) => c.addEventListener('click', () => c.classList.toggle('flipped')));
}

window.LESSON = {
  init() {
    Narrative.init({ plot: PLOT, picks: PICKS, moments: MOMENTS });
    initFaces();
    initWind();
    initFable();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
