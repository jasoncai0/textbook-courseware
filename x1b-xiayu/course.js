'use strict';
/* 要下雨了 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：小白兔回家路线图（沿路遇见燕子、小鱼、蚂蚁，分角色对话）、空气湿度小实验、天气小侦探判断、跳小路读词、帮蚂蚁搬家识字 */

/* 路线图：四站（x / y 是地图上的坐标） */
const STOPS = [
  { name: ['山坡', 'shān pō'], at: [110, 140], sign: ['燕子低飞', 'yàn zi dī fēi'], who: ['燕子', 'yàn zi'],
    q: ['燕子，燕子，你为什么飞得这么低呀？', 'yàn zi yàn zi nǐ wèi shén me fēi de zhè me dī ya'],
    a: ['要下雨了，空气很潮湿，虫子的翅膀沾了小水珠，飞不高。我正忙着捉虫子呢！', 'yào xià yǔ le kōng qì hěn cháo shī chóng zi de chì bǎng zhān le xiǎo shuǐ zhū fēi bù gāo wǒ zhèng máng zhe zhuō chóng zi ne'] },
  { name: ['池子', 'chí zi'], at: [330, 262], sign: ['小鱼游到水面', 'xiǎo yú yóu dào shuǐ miàn'], who: ['小鱼', 'xiǎo yú'],
    q: ['小鱼，小鱼，今天怎么有空出来呀？', 'xiǎo yú xiǎo yú jīn tiān zěn me yǒu kòng chū lái ya'],
    a: ['要下雨了，水里闷得很，我们到水面上来透透气。', 'yào xià yǔ le shuǐ lǐ mēn de hěn wǒ men dào shuǐ miàn shàng lái tòu tou qì'] },
  { name: ['路边', 'lù biān'], at: [600, 214], sign: ['蚂蚁搬家', 'mǎ yǐ bān jiā'], who: ['大蚂蚁', 'dà mǎ yǐ'],
    q: ['他看见路边有一大群蚂蚁，就把要下雨的消息告诉了蚂蚁。', 'tā kàn jiàn lù biān yǒu yí dà qún mǎ yǐ jiù bǎ yào xià yǔ de xiāo xi gào su le mǎ yǐ'], qNarr: true,
    a: ['是要下雨了，我们正忙着搬东西呢！', 'shì yào xià yǔ le wǒ men zhèng máng zhe bān dōng xi ne'] },
  { name: ['家', 'jiā'], at: [700, 150], sign: ['大雨下起来了', 'dà yǔ xià qǐ lái le'], who: ['', ''], aNarr: true,
    q: ['妈妈，妈妈，要下雨了！', 'mā ma mā ma yào xià yǔ le'],
    a: ['轰隆隆，哗，哗，哗，大雨真的下起来了！', 'hōng lōng lōng huā huā huā dà yǔ zhēn de xià qǐ lái le'] },
];

/* 课后第 3 题：小路上的词（按课本顺序） */
const STONES = [['山坡', 'shān pō'], ['阴沉沉', 'yīn chén chén'], ['潮湿', 'cháo shī'], ['有空', 'yǒu kòng'], ['连忙', 'lián máng'], ['消息', 'xiāo xi'], ['搬家', 'bān jiā'], ['雷声', 'léi shēng']];
const STONE_AT = [[8, 60], [18, 32], [29, 53], [41, 75], [52, 51], [62, 28], [73, 50], [85, 71]];
document.getElementById('stones').innerHTML = STONES.map(([w, p], i) => `<button type="button" class="xy-stone" data-i="${i}" style="left:${STONE_AT[i][0]}%;top:${STONE_AT[i][1]}%">${Hanzi.ruby(w, p)}</button>`).join('');

Hanzi.init({
  shapes: {
    门: ['M20 12V92', 'M20 12H40', 'M80 12V92', 'M60 12H80'],
    心: ['M24 56Q20 80 42 86Q66 90 78 66', 'M14 40L22 52', 'M50 34L54 48', 'M80 40L88 54'],
    自: ['M50 6L40 18', 'M24 18H76V92H24Z', 'M24 42H76', 'M24 66H76'],
  },
  cards: [
    { z: '腰', py: 'yāo', bs: '月', bh: 13, words: [['弯腰', 'wān yāo'], ['伸腰', 'shēn yāo']] },
    { z: '坡', py: 'pō', bs: '土', bh: 8, words: [['山坡', 'shān pō'], ['上坡', 'shàng pō']] },
    { z: '沉', py: 'chén', bs: '氵', bh: 7, words: [['阴沉沉', 'yīn chén chén'], ['沉下去', 'chén xià qù']] },
    { z: '伸', py: 'shēn', bs: '亻', bh: 7, words: [['伸腰', 'shēn yāo'], ['伸手', 'shēn shǒu']] },
    { z: '潮', py: 'cháo', bs: '氵', bh: 15, words: [['潮湿', 'cháo shī'], ['潮水', 'cháo shuǐ']] },
    { z: '湿', py: 'shī', bs: '氵', bh: 12, words: [['潮湿', 'cháo shī'], ['湿地', 'shī dì']] },
    { z: '呢', py: 'ne', bs: '口', bh: 8, words: [['你呢', 'nǐ ne'], ['虫子呢', 'chóng zi ne']] },
    { z: '空', py: 'kòng', bs: '穴', bh: 8, words: [['有空', 'yǒu kòng'], ['空气', 'kōng qì']] },
    { z: '闷', py: 'mēn', bs: '门', bh: 7, words: [['闷得很', 'mēn de hěn'], ['闷热', 'mēn rè']] },
    { z: '消', py: 'xiāo', bs: '氵', bh: 10, words: [['消息', 'xiāo xi'], ['消失', 'xiāo shī']] },
    { z: '息', py: 'xī', bs: '心', bh: 10, words: [['消息', 'xiāo xi'], ['休息', 'xiū xi']] },
    { z: '搬', py: 'bān', bs: '扌', bh: 13, words: [['搬家', 'bān jiā'], ['搬东西', 'bān dōng xi']] },
    { z: '响', py: 'xiǎng', bs: '口', bh: 9, words: [['响起', 'xiǎng qǐ'], ['响声', 'xiǎng shēng']] },
  ],
  evolve: [
    { z: '闷', old: ['门', '心'], note: '“心”被关在“门”里，透不过气来，心里就“闷”。小鱼在水里闷得很，要到水面上来透透气。（帮助记字的说法）' },
    { z: '息', old: ['自', '心'], note: '上面的“自”像人的鼻子，下面是“心”：用鼻子一呼一吸，就是“气息”。（帮助记字的说法）' },
  ],
  write: [
    { z: '直', py: 'zhí', bs: '十', bh: 8 },
    { z: '呀', py: 'ya', bs: '口', bh: 7 },
    { z: '边', py: 'biān', bs: '辶', bh: 5 },
    { z: '呢', py: 'ne', bs: '口', bh: 8 },
    { z: '吗', py: 'ma', bs: '口', bh: 6 },
    { z: '吧', py: 'ba', bs: '口', bh: 7 },
    { z: '加', py: 'jiā', bs: '力', bh: 5 },
  ],
});

/* ---------- 回家路线图 ---------- */
function initRoute() {
  const route = document.getElementById('route');
  const bunny = document.getElementById('bunny');
  const stops = document.getElementById('stops');
  const talk = document.getElementById('talk');
  stops.innerHTML = STOPS.map((s, i) => `<button type="button" class="xy-stop" data-i="${i}"><b>${i + 1}</b>${Hanzi.ruby(...s.name)}</button>`).join('');
  const go = (i) => {
    const s = STOPS[i];
    bunny.style.transform = `translate(${s.at[0]}px, ${s.at[1] - 40}px)`;
    stops.querySelectorAll('.xy-stop').forEach((b, k) => { b.classList.toggle('cur', k === i); if (k <= i) b.classList.add('seen'); });
    route.classList.toggle('home', i === STOPS.length - 1);
    talk.innerHTML = `<p class="xy-sign">${Hanzi.ruby(...s.sign)}</p>
      <p class="xy-q${s.qNarr ? ' xy-n' : ''}">${s.qNarr ? '' : '<span class="xy-who">小白兔</span>'}${Hanzi.ruby(...s.q)}</p>
      <p class="xy-a${s.aNarr ? ' xy-n' : ''}">${s.aNarr ? '' : `<span class="xy-who">${s.who[0]}</span>`}${Hanzi.ruby(...s.a)}</p>`;
  };
  bunny.style.transform = 'translate(40px, 80px)';
  stops.addEventListener('click', (e) => {
    const b = e.target.closest('.xy-stop');
    if (b) go(+b.dataset.i);
  });
}

/* ---------- 湿度小实验 ---------- */
const LAB_TXT = [
  ['空气干干的，虫子飞得高高的，燕子也飞得高高的。', 'kōng qì gān gān de chóng zi fēi de gāo gāo de yàn zi yě fēi de gāo gāo de'],
  ['空气有点儿湿了，虫子的翅膀沾上了小水珠。', 'kōng qì yǒu diǎnr _ shī le chóng zi de chì bǎng zhān shàng le xiǎo shuǐ zhū'],
  ['空气很潮湿，虫子飞不高，燕子飞得低低的捉虫子。', 'kōng qì hěn cháo shī chóng zi fēi bù gāo yàn zi fēi de dī dī de zhuō chóng zi'],
];
function initLab() {
  const lab = document.getElementById('lab');
  const range = document.getElementById('humid');
  const bug = document.getElementById('bug');
  const sw = document.getElementById('swallow');
  const txt = document.getElementById('labTxt');
  let level = -1;
  const update = () => {
    const h = +range.value / 100;
    const by = 60 + h * 210;
    bug.style.transform = `translate(470px, ${by}px) scale(2.2)`;
    sw.style.transform = `translate(330px, ${by - 30}px) scale(1.8)`;
    lab.style.setProperty('--h', h);
    const lv = h < .35 ? 0 : (h < .7 ? 1 : 2);
    if (lv !== level) { level = lv; txt.innerHTML = Hanzi.ruby(...LAB_TXT[lv]); }
  };
  range.addEventListener('input', update);
  update();
}

/* ---------- 跳小路 ---------- */
function initHop() {
  const hop = document.getElementById('hop');
  const hopper = document.getElementById('hopper');
  let next = 0;
  const place = (i) => {
    const [x, y] = i < 0 ? [3, 40] : (i >= STONES.length ? [94, 34] : STONE_AT[i]);
    hopper.style.left = `${x}%`;
    hopper.style.top = `${y}%`;
    hopper.classList.remove('jump'); void hopper.offsetWidth; hopper.classList.add('jump');
  };
  const mark = () => hop.querySelectorAll('.xy-stone').forEach((s, k) => { s.classList.toggle('done', k < next); s.classList.toggle('next', k === next); });
  hop.addEventListener('click', (e) => {
    const s = e.target.closest('.xy-stone');
    if (!s) return;
    if (+s.dataset.i !== next) { s.classList.remove('wrong'); void s.offsetWidth; s.classList.add('wrong'); return; }
    place(next);
    next += 1;
    if (next === STONES.length) setTimeout(() => { place(STONES.length); hop.classList.add('home'); }, 700);
    mark();
  });
  document.getElementById('hopReset').addEventListener('click', () => { next = 0; hop.classList.remove('home'); place(-1); mark(); });
  place(-1);
  mark();
}

/* ---------- 帮蚂蚁搬家 ---------- */
const ANTS = [['腰', 'yāo'], ['坡', 'pō'], ['沉', 'chén'], ['伸', 'shēn'], ['潮', 'cháo'], ['湿', 'shī'], ['呢', 'ne'], ['空', 'kòng'], ['闷', 'mēn'], ['消', 'xiāo'], ['息', 'xī'], ['搬', 'bān'], ['响', 'xiǎng']];
function initAnts() {
  const ants = document.getElementById('ants');
  const list = document.getElementById('antList');
  const n = document.getElementById('antN');
  document.getElementById('antAll').textContent = ANTS.length;
  ants.innerHTML = ANTS.map(([z], i) => `<button type="button" class="xy-ant" data-i="${i}" style="--i:${i}"><span class="xy-rice">${z}</span><svg viewBox="0 0 60 30"><g fill="#3b2a20"><circle cx="12" cy="18" r="7"/><circle cx="26" cy="18" r="6"/><circle cx="42" cy="18" r="8"/></g><path d="M46 12L54 2M42 11L46 1" stroke="#3b2a20" stroke-width="2"/><path d="M14 24L8 30M26 24V30M38 24L44 30" stroke="#3b2a20" stroke-width="2"/></svg></button>`).join('');
  ants.addEventListener('click', (e) => {
    const a = e.target.closest('.xy-ant:not(.gone)');
    if (!a) return;
    a.classList.add('gone');
    const [z, p] = ANTS[+a.dataset.i];
    list.insertAdjacentHTML('beforeend', `<span>${Hanzi.ruby(z, p)}</span>`);
    n.textContent = list.children.length;
  });
  document.getElementById('antReset').addEventListener('click', () => {
    ants.querySelectorAll('.xy-ant').forEach((a) => a.classList.remove('gone'));
    list.innerHTML = '';
    n.textContent = '0';
  });
}

window.LESSON = {
  init() {
    Narrative.init({
      picks: {
        signs: [
          { t: '燕子飞得很低', ok: true, why: '虫子飞不高，燕子低飞捉虫' },
          { t: '小鱼游到水面上', ok: true, why: '水里闷，小鱼出来透气' },
          { t: '蚂蚁忙着搬家', ok: true, why: '蚂蚁怕雨水淹了家' },
          { t: '天阴沉沉的', ok: true, why: '乌云多，快下雨了' },
          { t: '太阳火辣辣的', ok: false, why: '这是大晴天' },
          { t: '满天星星眨眼睛', ok: false, why: '晴朗的夜晚才看得见星星' },
          { t: '蜻蜓飞得很低', ok: true, why: '和燕子一样，下雨前飞得低' },
          { t: '天空又蓝又高', ok: false, why: '这是晴天的样子' },
        ],
      },
    });
    initRoute();
    initLab();
    initHop();
    initAnts();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
