'use strict';
/* 海底世界 · 本课数据与本课互动。通用逻辑见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 课后第 1 题 · 分一分：写的是哪一方面 */
const KINDS = ['声音', '动物活动', '植物', '矿产'];
const SORT_ITEMS = [
  { s: '有的像蜜蜂一样嗡嗡，有的像小鸟一样啾啾。', ok: ['声音'], q: '动物的声音' },
  { s: '海参靠肌肉伸缩爬行，每小时只能前进四米。', ok: ['动物活动'], q: '海参 · 爬' },
  { s: '最大的海藻长达二三百米。', ok: ['植物'], q: '植物的大小' },
  { s: '乌贼和章鱼能突然向前方喷水，利用水的反推力迅速后退。', ok: ['动物活动'], q: '乌贼和章鱼 · 喷水后退' },
  { s: '还有陆地上储量很少的稀有金属。', ok: ['矿产'], q: '丰富的矿产' },
  { s: '遇到危险还会发出警报。', ok: ['声音'], q: '动物的声音' },
  { s: '它们的色彩多种多样，有褐色的，有紫色的，还有红色的。', ok: ['植物'], q: '植物的色彩' },
];

/* 课后第 3 题：换词开关（pre + 原词/平常说法 + post） */
const SWAPS = [
  { pre: '海底的动物常常在', word: '窃窃私语', plain: '发出声音', post: '。',
    why: '“窃窃私语”像小伙伴在<b>说悄悄话</b>：写出了声音<b>小</b>，又让海底动物像人一样<b>可爱</b>。' },
  { pre: '还有些贝类自己不动，却能巴在轮船底下作', word: '免费的长途旅行', plain: '移动', post: '。',
    why: '“免费的长途旅行”把贝类写成<b>搭便车的旅客</b>：不花钱、不费力，就能去很远的地方，真有趣！' },
];

function initSwap(box) {
  box.innerHTML = SWAPS.map((it, i) => `<div class="sw-row" data-i="${i}">
    <p class="sw-s">${it.pre}<span class="sw-w"><em class="dot">${it.word}</em><i>${it.plain}</i></span>${it.post}</p>
    <button class="sw-tg" type="button" aria-label="换一种说法"><b>原句</b><span></span><b>换说法</b></button>
    <p class="sw-why">${it.why}</p></div>`).join('');
  box.addEventListener('click', (e) => {
    const t = e.target.closest('.sw-tg');
    if (!t) return;
    const row = t.closest('.sw-row');
    row.classList.toggle('plain');
    row.classList.add('tried');
  });
}
/* 词句段运用：用“你可知道……”介绍一种事物 */
const MOMENTS = [
  {
    name: '大熊猫', pic: 'haizao',
    prompt: '你可知道，大熊猫为什么被称为“国宝”？试着用问句开头，介绍大熊猫。',
    hint: '可以从这几个方面说：样子、吃什么、生活在哪里、为什么珍贵。每说一个方面，先用一句话说清楚。',
    example: '你可知道，大熊猫为什么被称为“国宝”？大熊猫是我国特有的动物，主要生活在四川、陕西和甘肃等地的山林里。它最爱吃竹叶和竹笋……',
  },
  {
    name: '那座山', pic: 'shenhai',
    prompt: '你可知道，那座山上的石头有多么奇妙？试着接着说下去。',
    hint: '石头有什么颜色、什么形状？像什么？一样一样地说。',
    example: '你可知道，那座山上的石头有多么奇妙？有的像一只蹲着的猴子，有的像一位弯腰的老爷爷，还有的像一朵盛开的莲花……',
  },
  {
    name: '我想介绍的', pic: 'dongwu',
    prompt: '你是否听说过……？选一种你熟悉的事物（一种动物、一种植物、一样东西），用问句开头介绍它。',
    hint: '先提一个问题，引起别人的兴趣；再从两三个方面介绍，每个方面举一两个例子。',
    example: '你是否听说过会“睡觉”的花？含羞草的叶子一碰就合起来，像害羞的小姑娘低下了头……',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ kinds: KINDS, sort: SORT_ITEMS, moments: MOMENTS });
    initSwap(document.getElementById('swapBox'));
    // 水中听音器：点一下，声音卡片“响”起来
    document.querySelector('.sounds').addEventListener('click', (e) => {
      const card = e.target.closest('.snd');
      if (!card) return;
      card.classList.remove('ring');
      void card.offsetWidth; // 重新播放动画
      card.classList.add('ring');
    });
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
