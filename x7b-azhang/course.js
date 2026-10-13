'use strict';
/* 阿长与《山海经》 · 本课数据与本课独有的“情感曲线”。通用页面逻辑见 ../shared/narrative.js */

/* 情感曲线上每个点的课文依据（顺序与 index.html 里 .pt[data-i] 一致） */
const MOODS = [
  { name: '厌烦', q: '“我实在不大佩服她。最讨厌的是常喜欢切切察察……”“推她呢，不动；叫她呢，也不闻。”', why: '切切察察、管东管西、睡相霸道' },
  { name: '不耐烦', q: '“总之：都是些烦琐之至，至今想起来还觉得非常麻烦的事情。”', why: '元旦的福橘、许多古怪的规矩' },
  { name: '空前的敬意', q: '“却不料她还有这样伟大的神力。从此对于她就有了特别的敬意，似乎实在深不可测。”', why: '听信了她讲的“长毛”的故事' },
  { name: '憎恶', q: '“那时就极严重地诘问，而且当面叫她阿长。……我惧惮她什么呢！”', why: '知道她谋害了隐鼠' },
  { name: '新的敬意', q: '“这又使我发生新的敬意了，别人不肯做，或不能做的事，她却能够做成功。……谋害隐鼠的怨恨，从此完全消灭了。”', why: '她买来了“三哼经”' },
  { name: '怀念（成年的我）', q: '“仁厚黑暗的地母呵，愿在你怀里永安她的魂灵！”', why: '三十年后的追忆与祝愿' },
];

/* 品读 · 详略（思考探究一） */
const KINDS = ['详写', '略写'];
const SORT_ITEMS = [
  { s: '常喜欢切切察察，竖起第二个手指在空中摇动', ok: ['略写'], q: '几句带过：爱唠叨、爱告状' },
  { s: '夏夜睡觉摆成一个“大”字', ok: ['详写'], q: '母亲提醒也没用：粗俗、不拘小节' },
  { s: '元旦清早逼“我”说“恭喜”、吃福橘', ok: ['详写'], q: '规矩里唯一详写：迷信，也真心盼“我”好' },
  { s: '人死了说“老掉了”，竹竿底下不能钻……', ok: ['略写'], q: '一串省略号：烦琐的道理' },
  { s: '讲“长毛”的故事', ok: ['详写'], q: '见识少，却认真：引出“空前的敬意”' },
  { s: '谋害了“我”的隐鼠', ok: ['略写'], q: '一笔带过：引出“憎恶”' },
  { s: '告假回家，买来“三哼经”', ok: ['详写'], q: '全文重点：善良、热心、尊重孩子的心愿' },
];

/* 品读 · 两种视角（思考探究二） */
const PICKS = {
  view: [
    { t: '什么姑娘，我现在已经忘却了，总之不是长姑娘；也终于不知道她姓什么。', ok: true, why: '“现在”“终于”——写作时的回忆' },
    { t: '推她呢，不动；叫她呢，也不闻。', ok: false, why: '童年当时的委屈' },
    { t: '此外，现在大抵忘却了，只有元旦的古怪仪式记得最清楚。', ok: true, why: '“现在”——成年回望' },
    { t: '我想我又不真做小长毛，不去攻城，也不放炮，更不怕炮炸，我惧惮她什么呢！', ok: false, why: '孩子气的赌气' },
    { t: '书的模样，到现在还在眼前。', ok: true, why: '“到现在”——三十年都没忘' },
    { t: '我似乎遇着了一个霹雳，全体都震悚起来。', ok: false, why: '童年当时的惊喜' },
    { t: '仁厚黑暗的地母呵，愿在你怀里永安她的魂灵！', ok: true, why: '成年的我深情的祝愿' },
  ],
};

/* 品读 · 揣摩夸张语句（思考探究四） */
const CLUE_LABELS = ['句子与问题', '参考理解'];
const CLUES = [
  { q: '但到<b>憎恶</b>她的时候，——例如知道了<b>谋死</b>我那隐鼠的却是她的时候，就叫她阿长。<br><small>为什么用“憎恶”“谋死”这样的词语？</small>', a: '大词小用：用形容深仇大恨的词写孩子的小怨气，写出童年时对隐鼠的珍爱和当时的气愤，也透出成年回望时的幽默。' },
  { q: '然而我有一时也对她发生过<b>空前</b>的敬意。<br><small>“空前”给你什么感觉？“敬意”具体指什么？</small>', a: '“空前”——从来没有过，夸张又好笑：敬意是因为相信了她能让大炮“炸了”的“神力”，是孩子天真的敬畏，带着调侃。' },
  { q: '夜间的伸开手脚，占领全床，那当然是<b>情有可原</b>的了，倒应该<b>我退让</b>。<br><small>作者真的认为“情有可原”“应该我退让”吗？</small>', a: '不是真心话，是反语、调侃：孩子因为“敬意”连霸道的睡相都原谅了；成年的作者写来，笑孩子的天真，也含着对阿长的宽容。' },
  { q: '“哥儿，有画儿的<b>‘三哼经’</b>，我给你买来了！”<br><small>为什么不写成“山海经”？</small>', a: '她不识字，连书名都说不准，却为“我”买来了这书：一个“哼”字，写出她的朴实，更显出这份心意的难得。' },
];

/* 读写迁移 */
const MOMENTS = [
  {
    name: '先抑后扬写一个人', pic: 'dazi',
    prompt: '写一个你曾经“不大佩服”，后来却让你改变看法的人（同学、长辈、邻居……）。',
    hint: '“抑”：写一两个具体的、让你不满意的细节；“扬”：写一件改变你看法的事，抓住动作、语言、神态。结尾写出你现在的感受。',
    example: '我的同桌是个“话痨”，上课总爱小声跟我嘀咕，作业本也乱糟糟的，我实在不大佩服他。可那天我发烧请假，第二天一早，他把一叠抄得整整齐齐的笔记塞给我：“喏，昨天的，一个字都没落！”我翻开一看，连老师画的图都描下来了……',
  },
  {
    name: '补写：阿长买书', pic: 'sanheng',
    prompt: '课文没写阿长是怎样买到《山海经》的。展开想象，补写她告假回家买书的经过。',
    hint: '她不识字，只听“我”说过一次；书店远、书名记不准……她会怎样问人、怎样找？注意符合她的身份和说话方式。',
    example: '阿长攥着几百文钱，在大街上一家一家地问：“掌柜的，有没有画儿的‘三哼经’？就是画着九个头的蛇、没有头的人的……”掌柜的笑了半天，才从架子底下翻出四本又黄又旧的小书……',
  },
  {
    name: '给阿长的一句话', pic: 'fuju',
    prompt: '如果童年的“我”在三十年后能对阿长说一句话，会说什么？',
    hint: '想想结尾那句“仁厚黑暗的地母呵……”，想想“我终于不知道她的姓名”。',
    example: '阿妈，那四本“三哼经”我一直记得。对不起，那时我只记得你的“大”字和福橘，却从没问过你叫什么名字。',
  },
];

/* 故事页右上角：“我”的心情（slide 或字幕行上写 data-mood="序号"） */
function buildMoodBadge() {
  const box = document.createElement('div');
  box.className = 'mood-badge';
  box.id = 'moodBadge';
  document.getElementById('frame').appendChild(box);
}
function updateMoodBadge(slide, step) {
  const box = document.getElementById('moodBadge');
  let at = slide.dataset.mood;
  slide.querySelectorAll('[data-mood][data-step]').forEach((el) => { if (+el.dataset.step <= step) at = el.dataset.mood; });
  box.classList.toggle('show', at !== undefined);
  if (at === undefined) return;
  const i = +at;
  box.innerHTML = `<small>“我”的心情</small>${MOODS.map((m, k) => `<i class="${k === i ? 'cur' : ''}${k < i ? ' done' : ''}" title="${m.name}"></i>`).join('')}<b>${MOODS[i].name}</b>`;
}

/* 情感曲线：点圆点看依据 */
function initCurve() {
  const quote = document.getElementById('moodQuote');
  document.querySelector('.mood-svg').addEventListener('click', (e) => {
    const pt = e.target.closest('.pt');
    if (!pt) return;
    const m = MOODS[+pt.dataset.i];
    document.querySelectorAll('.mood-svg .pt').forEach((p) => p.classList.toggle('sel', p === pt));
    quote.innerHTML = `<b>${m.name}</b>（${m.why}）<br>${m.q}`;
  });
}

window.LESSON = {
  init() {
    Narrative.init({ kinds: KINDS, sort: SORT_ITEMS, clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS, picks: PICKS });
    buildMoodBadge();
    initCurve();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateMoodBadge(slide, step);
  },
};
