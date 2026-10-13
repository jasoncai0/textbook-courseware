'use strict';
/* 董存瑞舍身炸暗堡 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 阅读提示 ① · 怎样的战士 */
const PICKS = {
  zhanshi: [
    { t: '勇敢无畏', ok: true, why: '主动请战：“我去炸掉它！”' },
    { t: '胆小犹豫', ok: false, why: '课文里没有' },
    { t: '机智灵活', ok: true, why: '忽左忽右地匍匐、滚、隐蔽在凹地' },
    { t: '意志顽强', ok: true, why: '左腿中枪，仍然冲到桥下' },
    { t: '只顾自己', ok: false, why: '他想的是战友和新中国' },
    { t: '舍身为国', ok: true, why: '托起炸药包：“为了新中国，冲啊！”' },
    { t: '粗心大意', ok: false, why: '他在桥下仔细找放炸药包的地方' },
  ],
};

/* 阅读提示 ② · 神态、言行描写 */
const KINDS = ['神态', '语言', '动作'];
const SORT_ITEMS = [
  { s: '董存瑞瞪着敌人的暗堡，两眼迸射出仇恨的火花。', ok: ['神态'], q: '对敌人充满仇恨' },
  { s: '“连长，我去炸掉它！”', ok: ['语言'], q: '勇敢，主动请战' },
  { s: '董存瑞夹紧炸药包，一会儿忽左忽右地匍匐前进，一会儿又向前滚上好几米。', ok: ['动作'], q: '机智灵活' },
  { s: '董存瑞昂首挺胸，站在桥底中央，左手托起炸药包，顶住桥底，右手猛地一拉导火索。', ok: ['动作', '神态'], q: '毫不犹豫，舍身为国' },
  { s: '火光照亮了他那钢铸一般的脸。', ok: ['神态'], q: '坚毅无畏' },
  { s: '他像巨人一样挺立着，两眼放射着坚毅的光芒。', ok: ['神态', '动作'], q: '视死如归' },
  { s: '“同志们，为了新中国，冲啊！”', ok: ['语言'], q: '心里装着战友和新中国' },
];

/* 读与写 */
const MOMENTS = [
  {
    name: '请战前 · 瞪着暗堡', pic: 'qingzhan',
    prompt: '“董存瑞瞪着敌人的暗堡，两眼迸射出仇恨的火花。”这时他心里在想什么？',
    hint: '他刚刚看见：冲在最前面的一个战士倒下了，部队被压在土坡下抬不起头。',
    example: '又一个战友倒下了！这个暗堡不拔掉，还会有更多的战友倒下，部队就冲不过去。我去！我一定要把它炸掉！',
  },
  {
    name: '郅顺义 · 望着红旗', pic: 'hongqi',
    prompt: '胜利的红旗在上空飘扬。一直在后面掩护的战友郅顺义，望着红旗，想对董存瑞说什么？',
    hint: '他们一起跃出战壕，互相配合；最后，只有郅顺义看到了胜利。',
    example: '存瑞，你看，红旗插上去了！我们是一起冲出去的，你却没能回来……这条路是你用生命炸开的，我会带着你的那一份，继续往前冲。',
  },
  {
    name: '我想对董存瑞说', pic: 'gongcheng',
    prompt: '读完课文，你想对董存瑞说些什么？',
    hint: '可以写你的敬佩，也可以写他让你明白了什么。想一想：他牺牲时只有 19 岁。',
    example: '董存瑞叔叔，您牺牲时只有 19 岁，只比我们大几岁。您喊出“为了新中国”的时候，一定想到了今天的我们。我会珍惜今天的生活，好好学习。',
  },
];

/* 读懂难处：试三种放炸药包的办法 */
const BAO = {
  edge: { cls: 'warn', text: '河沿是光滑的斜坡——“试了两次，都滑了下来”。放不住。' },
  bed: { cls: 'warn', text: '河床离桥底有一人多高——“又无法炸毁暗堡”。够不着。' },
  hold: { cls: 'ok', text: '只有用手托起炸药包、顶住桥底，才能炸毁暗堡。可是这样，自己也无法离开……' },
};
function initBao() {
  const svg = document.getElementById('bao');
  const fb = document.getElementById('baoFeedback');
  document.querySelector('.bao-btns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-opt]');
    if (!btn) return;
    const { cls, text } = BAO[btn.dataset.opt];
    Object.keys(BAO).forEach((k) => svg.classList.remove(`o-${k}`));
    void svg.getBoundingClientRect(); // 重新触发滑落动画
    svg.classList.add(`o-${btn.dataset.opt}`);
    document.querySelectorAll('.bao-btns .btn').forEach((b) => b.classList.toggle('solid', b === btn));
    fb.className = `tip feedback ${cls}`;
    fb.textContent = text;
  });
}

window.LESSON = {
  init() {
    Narrative.init({ kinds: KINDS, sort: SORT_ITEMS, picks: PICKS, moments: MOMENTS });
    initBao();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
