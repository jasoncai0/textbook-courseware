'use strict';
/* 端午粽 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：剥粽子（按步一层层剥开：箬竹叶 → 糯米 → 红枣 → 清香 → 咬一口）、端午习俗卡、长句子小火车、赛龙舟识字 */

/* 课后第 1 题：长句子按词组分成车厢 */
const TRAINS = [
  [['外婆一掀开锅盖，', 'wài pó yì xiān kāi guō gài'], ['煮熟的粽子', 'zhǔ shú de zòng zi'], ['就飘出', 'jiù piāo chū'], ['一股清香来。', 'yì gǔ qīng xiāng lái']],
  [['我们在外婆家', 'wǒ men zài wài pó jiā'], ['美滋滋地', 'měi zī zī de'], ['吃了之后，', 'chī le zhī hòu'], ['外婆还会装', 'wài pó hái huì zhuāng'], ['一小篮粽子', 'yì xiǎo lán zòng zi'], ['要我们带回去，', 'yào wǒ men dài huí qù'], ['分给邻居吃。', 'fēn gěi lín jū chī']],
];
document.getElementById('trains').innerHTML = TRAINS.map((cars, i) => `<div class="dw-train" data-i="${i}">
  <button type="button" class="btn dw-go">开火车 ▶</button>
  <div class="dw-cars"><span class="dw-head" aria-hidden="true"></span>${cars.map(([t, p], k) => `<button type="button" class="dw-car" style="--k:${k}">${Hanzi.ruby(t, p)}</button>`).join('')}</div>
</div>`).join('');

Hanzi.init({
  shapes: {
    米: ['M14 50H86', 'M50 10V90', 'M28 20L34 32', 'M72 20L66 32', 'M28 80L34 68', 'M72 80L66 68'],
    八: ['M42 18C40 46 30 70 14 86', 'M58 18C62 46 72 70 88 86'],
    刀: ['M28 20H72C72 60 66 80 50 88', 'M44 20C42 52 32 74 16 88'],
  },
  cards: [
    { z: '端', py: 'duān', bs: '立', bh: 14, words: [['端午', 'duān wǔ'], ['端正', 'duān zhèng']] },
    { z: '粽', py: 'zòng', bs: '米', bh: 14, words: [['粽子', 'zòng zi'], ['粽叶', 'zòng yè']] },
    { z: '节', py: 'jié', bs: '艹', bh: 5, words: [['端午节', 'duān wǔ jié'], ['节日', 'jié rì']] },
    { z: '总', py: 'zǒng', bs: '心', bh: 9, words: [['总会', 'zǒng huì'], ['总是', 'zǒng shì']] },
    { z: '米', py: 'mǐ', bs: '米', bh: 6, words: [['糯米', 'nuò mǐ'], ['大米', 'dà mǐ']] },
    { z: '间', py: 'jiān', bs: '门', bh: 7, words: [['中间', 'zhōng jiān'], ['时间', 'shí jiān']] },
    { z: '分', py: 'fēn', bs: '八', bh: 4, words: [['十分', 'shí fēn'], ['分开', 'fēn kāi']] },
    { z: '豆', py: 'dòu', bs: '豆', bh: 7, words: [['红豆', 'hóng dòu'], ['豆子', 'dòu zi']] },
    { z: '肉', py: 'ròu', bs: '肉', bh: 6, words: [['鲜肉', 'xiān ròu'], ['肉粽', 'ròu zòng']] },
    { z: '带', py: 'dài', bs: '巾', bh: 9, words: [['带回去', 'dài huí qù'], ['带着', 'dài zhe']] },
    { z: '知', py: 'zhī', bs: '矢', bh: 8, words: [['知道', 'zhī dào'], ['知识', 'zhī shi']] },
    { z: '据', py: 'jù', bs: '扌', bh: 11, words: [['据说', 'jù shuō'], ['根据', 'gēn jù']] },
    { z: '念', py: 'niàn', bs: '心', bh: 8, words: [['纪念', 'jì niàn'], ['想念', 'xiǎng niàn']] },
  ],
  evolve: [
    { z: '米', note: '中间一横，上下左右是一颗颗散开的米粒。糯米、大米都是“米”。' },
    { z: '分', old: ['八', '刀'], note: '上面“八”是分开的样子，下面是一把“刀”：用刀把东西切开，就是“分”。（帮助记字的说法）' },
  ],
  write: [
    { z: '午', py: 'wǔ', bs: '十', bh: 4 },
    { z: '节', py: 'jié', bs: '艹', bh: 5 },
    { z: '叶', py: 'yè', bs: '口', bh: 5 },
    { z: '米', py: 'mǐ', bs: '米', bh: 6 },
    { z: '真', py: 'zhēn', bs: '十', bh: 10 },
    { z: '分', py: 'fēn', bs: '八', bh: 4 },
    { z: '豆', py: 'dòu', bs: '豆', bh: 7 },
  ],
});

/* ---------- 长句子小火车 ---------- */
function initTrains() {
  const box = document.getElementById('trains');
  box.addEventListener('click', (e) => {
    const car = e.target.closest('.dw-car');
    if (car) { car.classList.remove('go'); void car.offsetWidth; car.classList.add('go'); return; }
    const go = e.target.closest('.dw-go');
    if (!go) return;
    const train = go.closest('.dw-train');
    train.classList.remove('run');
    train.querySelectorAll('.dw-car').forEach((c) => c.classList.remove('go'));
    void train.offsetWidth;
    train.classList.add('run');
  });
}

/* ---------- 赛龙舟 ---------- */
const DRUMS = [['端', 'duān'], ['粽', 'zòng'], ['节', 'jié'], ['总', 'zǒng'], ['米', 'mǐ'], ['间', 'jiān'], ['分', 'fēn'], ['豆', 'dòu'], ['肉', 'ròu'], ['带', 'dài'], ['知', 'zhī'], ['据', 'jù'], ['念', 'niàn']];
function initRace() {
  const drums = document.getElementById('drums');
  const boat = document.getElementById('boat');
  const msg = document.getElementById('raceMsg');
  const tip = msg.textContent;
  drums.innerHTML = DRUMS.map(([z, p]) => `<button type="button" class="dw-drum">${Hanzi.ruby(z, p)}</button>`).join('');
  const update = () => {
    const n = drums.querySelectorAll('.dw-drum.hit').length;
    boat.style.setProperty('--p', n / DRUMS.length);
    msg.textContent = n === DRUMS.length ? '咚咚咚！龙舟划到终点啦！' : (n ? `咚！划了 ${n} 下，加油！` : tip);
    msg.classList.toggle('win', n === DRUMS.length);
  };
  drums.addEventListener('click', (e) => {
    const d = e.target.closest('.dw-drum:not(.hit)');
    if (!d) return;
    d.classList.add('hit');
    update();
  });
  document.getElementById('raceReset').addEventListener('click', () => {
    drums.querySelectorAll('.dw-drum').forEach((d) => d.classList.remove('hit'));
    update();
  });
  update();
}

window.LESSON = {
  init() {
    Narrative.init({});
    document.getElementById('zz').addEventListener('click', () => next()); // 点粽子 = 剥下一层（deck.js 的下一步）
    document.querySelector('.dw-cards').addEventListener('click', (e) => {
      const c = e.target.closest('.dw-card');
      if (c) c.classList.toggle('flip');
    });
    initTrains();
    initRace();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
