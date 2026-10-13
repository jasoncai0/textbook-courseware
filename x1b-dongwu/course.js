'use strict';
/* 动物儿歌 · 本课数据。识字组件见 ../shared/hanzi.js；换偏旁、归类见 zuzi.js（都在顶层调用，deck.js 加载前渲染完） */

/* 动一动（本课独有）：点卡片，动物名字做动作，下面出动作提示 */
const DONG = [
  { a: '蜻蜓', apy: 'qīng tíng', v: '展翅', vpy: 'zhǎn chì', k: 'flap', tip: '张开双臂，像翅膀一样扇一扇。' },
  { a: '蝴蝶', apy: 'hú dié', v: '飞舞', vpy: 'fēi wǔ', k: 'dance', tip: '两手轻轻摆，绕着圈儿飞。' },
  { a: '蚯蚓', apy: 'qiū yǐn', v: '松土', vpy: 'sōng tǔ', k: 'dig', tip: '身子扭一扭，往土里钻。' },
  { a: '蚂蚁', apy: 'mǎ yǐ', v: '搬家', vpy: 'bān jiā', k: 'march', tip: '双手举过头，一步一步搬东西。' },
  { a: '蝌蚪', apy: 'kē dǒu', v: '游水', vpy: 'yóu shuǐ', k: 'swim', tip: '手合在一起，左右摆一摆游过去。' },
  { a: '蜘蛛', apy: 'zhī zhū', v: '结网', vpy: 'jié wǎng', k: 'web', tip: '手指上下左右，织一张大网。' },
];

function initDong(box) {
  const r = Hanzi.ruby;
  box.innerHTML = `<div class="dw-grid">${DONG.map((d, i) => `<button type="button" class="dw-card k-${d.k}" data-i="${i}">
      <span class="dw-a">${r(d.a, d.apy)}</span><span class="dw-v">${r(d.v, d.vpy)}</span></button>`).join('')}</div>
    <p class="dw-tip">点一张卡片，小动物就动起来。</p>`;
  const tip = box.querySelector('.dw-tip');
  box.addEventListener('click', (e) => {
    const c = e.target.closest('.dw-card');
    if (!c) return;
    box.querySelectorAll('.dw-card').forEach((x) => x.classList.toggle('go', x === c));
    const d = DONG[+c.dataset.i];
    tip.textContent = `${d.a}${d.v}：${d.tip}`;
  });
}
document.querySelectorAll('[data-dong]').forEach(initDong);

Zuzi.init({
  swap: {
    ma: {
      base: '马', py: 'mǎ', name: '“马”字家族',
      items: [
        { bs: '女', z: '妈', py: 'mā', w: '妈妈', wpy: 'mā ma', tip: '女字旁：妈妈是女的' },
        { bs: '口', z: '吗', py: 'ma', w: '你好吗', wpy: 'nǐ hǎo ma', tip: '口字旁：问话要张口' },
        { bs: '虫', z: '蚂', py: 'mǎ', w: '蚂蚁', wpy: 'mǎ yǐ', tip: '虫字旁：蚂蚁是小虫子' },
      ],
    },
  },
  sort: {
    bs: {
      buckets: [
        { t: '虫', name: '虫字旁 · 小虫子', ok: ['蜻', '蝴', '蚯', '蚂', '蝌', '蜘'] },
        { t: '氵', name: '三点水 · 和水有关', ok: ['游', '池', '河'] },
        { t: '辶', name: '走之 · 和走路有关', ok: ['迷', '造', '运'] },
      ],
      cards: [['蜻', 'qīng'], ['蝴', 'hú'], ['蚯', 'qiū'], ['蚂', 'mǎ'], ['蝌', 'kē'], ['蜘', 'zhī'], ['游', 'yóu'], ['池', 'chí'], ['河', 'hé'], ['迷', 'mí'], ['造', 'zào'], ['运', 'yùn']],
    },
  },
});

Hanzi.init({
  shapes: {
    虫: ['M50 8C34 8 28 22 34 32C40 42 60 42 66 32C72 22 66 8 50 8', 'M50 42C50 58 38 66 42 80C46 94 64 94 66 82'],
    网: ['M16 12V90', 'M16 12H84V90', 'M28 28L72 72', 'M72 28L28 72', 'M50 14V86', 'M18 50H82'],
  },
  evolve: [
    { z: '虫', note: '像一条小虫子：上面是头，下面是弯弯的身子。' },
    { z: '网', note: '像一张撒开的网，网上有一个个网眼。' },
  ],
  /* 拖词配图：x / y 按 assets/quanjing.jpg 的构图估（图生成后核对） */
  match: {
    dw: {
      bg: 'assets/quanjing.jpg',
      items: [
        { z: '蜘蛛', x: 17, y: 38, hint: 'zhī zhū' },
        { z: '蜻蜓', x: 43, y: 22, hint: 'qīng tíng' },
        { z: '蝴蝶', x: 84, y: 30, hint: 'hú dié' },
        { z: '蚂蚁', x: 27, y: 56, hint: 'mǎ yǐ' },
        { z: '蚯蚓', x: 26, y: 83, hint: 'qiū yǐn' },
        { z: '蝌蚪', x: 82, y: 78, hint: 'kē dǒu' },
      ],
    },
  },
  cards: [
    { z: '蜻', py: 'qīng', bs: '虫', bh: 14, words: [['蜻蜓', 'qīng tíng']] },
    { z: '蜓', py: 'tíng', bs: '虫', bh: 12, words: [['蜻蜓', 'qīng tíng']] },
    { z: '迷', py: 'mí', bs: '辶', bh: 9, words: [['捉迷藏', 'zhuō mí cáng'], ['迷路', 'mí lù']] },
    { z: '藏', py: 'cáng', bs: '艹', bh: 17, words: [['捉迷藏', 'zhuō mí cáng'], ['躲藏', 'duǒ cáng']] },
    { z: '造', py: 'zào', bs: '辶', bh: 10, words: [['造宫殿', 'zào gōng diàn'], ['建造', 'jiàn zào']] },
    { z: '蚂', py: 'mǎ', bs: '虫', bh: 9, words: [['蚂蚁', 'mǎ yǐ']] },
    { z: '蚁', py: 'yǐ', bs: '虫', bh: 9, words: [['蚂蚁', 'mǎ yǐ']] },
    { z: '食', py: 'shí', bs: '食', bh: 9, words: [['食粮', 'shí liáng'], ['食物', 'shí wù']] },
    { z: '粮', py: 'liáng', bs: '米', bh: 13, words: [['食粮', 'shí liáng'], ['粮食', 'liáng shi']] },
    { z: '蜘', py: 'zhī', bs: '虫', bh: 14, words: [['蜘蛛', 'zhī zhū']] },
    { z: '蛛', py: 'zhū', bs: '虫', bh: 12, words: [['蜘蛛', 'zhī zhū'], ['蛛网', 'zhū wǎng']] },
    { z: '网', py: 'wǎng', bs: '冂', bh: 6, words: [['结网', 'jié wǎng'], ['渔网', 'yú wǎng']] },
  ],
  write: {
    a: [
      { z: '间', py: 'jiān', bs: '门', bh: 7 },
      { z: '迷', py: 'mí', bs: '辶', bh: 9 },
      { z: '造', py: 'zào', bs: '辶', bh: 10 },
      { z: '运', py: 'yùn', bs: '辶', bh: 7 },
    ],
    b: [
      { z: '池', py: 'chí', bs: '氵', bh: 6 },
      { z: '欢', py: 'huān', bs: '又', bh: 6 },
      { z: '网', py: 'wǎng', bs: '冂', bh: 6 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
