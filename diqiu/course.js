'use strict';
/* 只有一个地球 · 本课数据。分类、翻卡、写作框用 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 说明方法 */
const KINDS = ['列数字', '打比方', '作比较'];
const SORT_ITEMS = [
  { s: '地球是一个半径约为 6400 千米的星球。', ok: ['列数字'], q: '准确地写出地球的大小' },
  { s: '周围裹着一层薄薄的水蓝色“纱衣”。', ok: ['打比方'], q: '把大气层比作纱衣，生动' },
  { s: '地球，这位人类的母亲，这个生命的摇篮……', ok: ['打比方'], q: '写出地球和人类的亲密关系' },
  { s: '同茫茫宇宙相比，地球是渺小的。', ok: ['作比较'], q: '突出地球的渺小' },
  { s: '经过几百万年，甚至几亿年的地质变化才形成的。', ok: ['列数字'], q: '写出矿产形成之慢' },
  { s: '至少在以地球为中心的 40 万亿千米的范围内，没有适合人类居住的第二个星球。', ok: ['列数字'], q: '有力地说明无处可去' },
];

/* 用词准确：正面删掉一个词，背面是原文 */
const CLUE_LABELS = ['去掉一个词……', '原文这样写，因为……'];
const CLUES = [
  { q: '地球是一个半径为 6400 千米的星球。', a: '原文是“<b>约</b>为 6400 千米”。地球半径并不正好是 6400 千米，“约”说明这是一个近似数，更准确。' },
  { q: '在以地球为中心的 40 万亿千米的范围内，没有适合人类居住的第二个星球。', a: '原文是“<b>至少</b>在……范围内”。科学家只证明了这个范围以内没有，更远的地方还不知道，“至少”说得更严谨。' },
  { q: '人类生活所需要的水资源、土地资源、生物资源等，是可以不断再生的。', a: '原文是“<b>本来</b>是可以不断再生”。“本来”说明原先可以，现在因为人的破坏已经不能再生了。' },
  { q: '如果地球上的各种资源都枯竭了，我们不能从别的地方得到补充。', a: '原文是“<b>很难</b>从别的地方得到补充”。科学还在发展，说“很难”比说“不能”更有分寸。' },
];

/* 宣传标语 */
const MOMENTS = [
  {
    name: '白色污染', pic: 'wuran',
    prompt: '塑料袋、一次性饭盒随手丢，河边堆满塑料垃圾。为它设计一条宣传标语。',
    hint: '标语要短、好记、有号召力。可以试试对仗或押韵。',
    example: '少用一个塑料袋，多留一片绿草地。／ 让地球“减塑”，给未来“加绿”。',
  },
  {
    name: '浪费水', pic: 'wuran',
    prompt: '水龙头一直开着、洗手时哗哗流……为节约用水设计一条宣传标语。',
    hint: '想一想：一滴水和地球有什么关系？',
    example: '别让最后一滴水，成为我们的眼泪。／ 拧紧水龙头，留住生命之源。',
  },
  {
    name: '滥伐滥采', pic: 'kuangshan',
    prompt: '树被乱砍、矿被乱挖，青山变成了秃山。为保护山林资源设计一条宣传标语。',
    hint: '可以用拟人的写法，让山和树“说话”。',
    example: '青山不说话，砍伐它会痛。／ 今天多留一棵树，明天多一片阴凉。',
  },
  {
    name: '乱扔废电池', pic: 'wuran',
    prompt: '废电池随手扔进垃圾桶，会污染土地和水。为它设计一条宣传标语。',
    hint: '可以用数字让人警醒，也可以写出正确的做法。',
    example: '一节废电池，污染一片土。请把它送进回收箱。',
  },
];

/* 星空 */
function fillStars(svg, n, w, h) {
  svg.querySelectorAll('.far-stars').forEach((g) => {
    g.innerHTML = Array.from({ length: n }, (_, i) =>
      `<circle cx="${(i * 97) % w}" cy="${(i * 61) % h}" r="${(.6 + (i % 4) * .4).toFixed(1)}" fill="#fff" opacity="${(.3 + (i % 5) * .14).toFixed(2)}"/>`).join('');
  });
}

window.LESSON = {
  init() {
    Narrative.init({ kinds: KINDS, sort: SORT_ITEMS, clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    fillStars(document.getElementById('small'), 160, 800, 440);
    fillStars(document.getElementById('move'), 120, 600, 420);
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    // 倡议书：讲到哪一部分，就点亮哪一部分
    if (slide.classList.contains('s-letter')) {
      slide.querySelectorAll('[data-part]').forEach((p) => p.classList.toggle('lit', +p.dataset.part === step));
    }
  },
};
