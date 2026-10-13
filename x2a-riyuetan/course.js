'use strict';
/* 日月潭 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：日潭 / 月潭示意图（点一点亮起来）、清晨—中午—雨天时间天气滑块、小导游提词卡、“点灯光”识字 */

Hanzi.init({
  cards: [
    { z: '潭', py: 'tán', bs: '氵', bh: 15, words: [['日月潭', 'rì yuè tán'], ['深潭', 'shēn tán']] },
    { z: '湾', py: 'wān', bs: '氵', bh: 12, words: [['台湾', 'tái wān'], ['海湾', 'hǎi wān']] },
    { z: '湖', py: 'hú', bs: '氵', bh: 12, words: [['湖水', 'hú shuǐ'], ['湖面', 'hú miàn']] },
    { z: '绕', py: 'rào', bs: '纟', bh: 9, words: [['环绕', 'huán rào'], ['绕圈', 'rào quān']] },
    { z: '茂', py: 'mào', bs: '艹', bh: 8, words: [['茂盛', 'mào shèng'], ['茂密', 'mào mì']] },
    { z: '盛', py: 'shèng', bs: '皿', bh: 11, words: [['茂盛', 'mào shèng'], ['盛开', 'shèng kāi']] },
    { z: '围', py: 'wéi', bs: '囗', bh: 7, words: [['周围', 'zhōu wéi'], ['围巾', 'wéi jīn']] },
    { z: '胜', py: 'shèng', bs: '月', bh: 9, words: [['名胜', 'míng shèng'], ['胜利', 'shèng lì']] },
    { z: '央', py: 'yāng', bs: '大', bh: 5, words: [['中央', 'zhōng yāng']] },
    { z: '岛', py: 'dǎo', bs: '山', bh: 7, words: [['小岛', 'xiǎo dǎo'], ['海岛', 'hǎi dǎo']] },
    { z: '纱', py: 'shā', bs: '纟', bh: 7, words: [['轻纱', 'qīng shā'], ['窗纱', 'chuāng shā']] },
    { z: '童', py: 'tóng', bs: '立', bh: 12, words: [['童话', 'tóng huà'], ['儿童', 'ér tóng']] },
    { z: '境', py: 'jìng', bs: '土', bh: 14, words: [['仙境', 'xiān jìng'], ['环境', 'huán jìng']] },
    { z: '引', py: 'yǐn', bs: '弓', bh: 4, words: [['吸引', 'xī yǐn'], ['引路', 'yǐn lù']] },
    { z: '客', py: 'kè', bs: '宀', bh: 9, words: [['游客', 'yóu kè'], ['客人', 'kè rén']] },
  ],
  write: [
    { z: '湾', py: 'wān', bs: '氵', bh: 12 },
    { z: '名', py: 'míng', bs: '口', bh: 6 },
    { z: '胜', py: 'shèng', bs: '月', bh: 9 },
    { z: '迹', py: 'jì', bs: '辶', bh: 9 },
    { z: '央', py: 'yāng', bs: '大', bh: 5 },
    { z: '丽', py: 'lì', bs: '一', bh: 7 },
    { z: '展', py: 'zhǎn', bs: '尸', bh: 10 },
    { z: '现', py: 'xiàn', bs: '王', bh: 8 },
  ],
});

const STORY = {
  picks: {
    mei: [
      { t: '湖水碧绿', ok: true, why: '颜色美' },
      { t: '北边像圆圆的太阳，南边像弯弯的月亮', ok: true, why: '样子美' },
      { t: '晨星和灯光隐隐约约地倒映在湖水中', ok: true, why: '清晨美' },
      { t: '美景和建筑都清晰地展现在眼前', ok: true, why: '中午美' },
      { t: '好像披上轻纱，就像童话中的仙境', ok: true, why: '雨天美' },
      { t: '它在台湾省中部的山区', ok: false, why: '这句说的是它在哪儿' },
    ],
  },
};

/* ---------- 日潭 / 月潭 ---------- */
function initLake() {
  const lake = document.getElementById('ryLake');
  lake.addEventListener('click', (e) => {
    const g = e.target.closest('[data-part]');
    if (g) g.classList.toggle('lit');
  });
}

/* ---------- 时间天气滑块 ---------- */
const TIMES = [
  ['清晨，湖面上飘着薄薄的雾。天边的晨星和山上的点点灯光，隐隐约约地倒映在湖水中。', 'qīng chén hú miàn shàng piāo zhe báo báo de wù tiān biān de chén xīng hé shān shàng de diǎn diǎn dēng guāng yǐn yǐn yuē yuē de dào yìng zài hú shuǐ zhōng'],
  ['中午，太阳高照，整个日月潭的美景和周围的建筑，都清晰地展现在眼前。', 'zhōng wǔ tài yáng gāo zhào zhěng gè rì yuè tán de měi jǐng hé zhōu wéi de jiàn zhù dōu qīng xī de zhǎn xiàn zài yǎn qián'],
  ['要是下起蒙蒙细雨，日月潭好像披上轻纱，周围的景物一片朦胧，就像童话中的仙境。', 'yào shi xià qǐ méng méng xì yǔ rì yuè tán hǎo xiàng pī shàng qīng shā zhōu wéi de jǐng wù yí piàn méng lóng jiù xiàng tóng huà zhōng de xiān jìng'],
];
function initTime() {
  const view = document.getElementById('ryView');
  const range = document.getElementById('ryRange');
  const say = document.getElementById('rySay');
  const set = (t) => {
    view.dataset.t = t;
    range.value = t;
    say.innerHTML = `<p>${Hanzi.ruby(...TIMES[t])}</p>`;
    document.querySelectorAll('.ry-ctl [data-t]').forEach((b) => b.classList.toggle('solid', +b.dataset.t === t));
  };
  range.addEventListener('input', () => set(+range.value));
  document.querySelector('.ry-ctl').addEventListener('click', (e) => {
    const b = e.target.closest('[data-t]');
    if (b) set(+b.dataset.t);
  });
  set(0);
}

/* ---------- 点灯光 ---------- */
const LAMPS = [['潭', 'tán'], ['湾', 'wān'], ['湖', 'hú'], ['绕', 'rào'], ['茂', 'mào'], ['盛', 'shèng'], ['围', 'wéi'], ['胜', 'shèng'], ['央', 'yāng'], ['岛', 'dǎo'], ['纱', 'shā'], ['童', 'tóng'], ['境', 'jìng'], ['引', 'yǐn'], ['客', 'kè']];
function initLamps() {
  const box = document.getElementById('ryLamps');
  const n = document.getElementById('ryN');
  const done = document.getElementById('ryDone');
  box.innerHTML = LAMPS.map(([z, p]) => `<button type="button" class="ry-lamp"><span class="py">${Hanzi.ruby(z, p)}</span><i aria-hidden="true">${z}</i></button>`).join('');
  const update = () => {
    const k = box.querySelectorAll('.ry-lamp.lit').length;
    n.textContent = k;
    done.classList.toggle('show', k === LAMPS.length);
  };
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.ry-lamp');
    if (!b) return;
    b.classList.add('lit');
    update();
  });
  document.getElementById('ryReset').addEventListener('click', () => {
    box.querySelectorAll('.ry-lamp').forEach((b) => b.classList.remove('lit'));
    update();
  });
  update();
}

window.LESSON = {
  init() {
    Narrative.init(STORY);
    initLake();
    initTime();
    initLamps();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
