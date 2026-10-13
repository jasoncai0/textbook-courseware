'use strict';
/* 读不完的大书 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 一部大书：每一页是课文里“我”读到的一样东西；最后一页留白，给学生自己写 */
const BOOK_PAGES = [
  { pic: 'tiankong', title: '天空 · 大地', text: '空中的浮云飞鸟，水里的虾蟹游鱼，地上的走兽昆虫、花草树木……' },
  { pic: 'mayi', title: '小麻雀 · 蚂蚁', text: '小麻雀叽叽喳喳、蹦蹦跳跳的；蚂蚁搬家，井然有序。' },
  { pic: 'guoshu', title: '果树', text: '梨树、桃树、橘子树、柚子树，开不同的花，结不同的果。' },
  { pic: 'zonglv', title: '竹子 · 棕榈', text: '沙沙的竹叶声，如同温柔的细语；大蒲扇似的叶子在风中摇摆。' },
  { pic: '', title: '下一页……', text: '由你去读，由你来写。' },
];

/* 课后第 2 题：课文写了哪些好玩的东西 */
const PICKS = {
  things: [
    { t: '浮云飞鸟', ok: true }, { t: '小松鼠', ok: false, why: '课文没写' }, { t: '虾蟹游鱼', ok: true }, { t: '小麻雀', ok: true },
    { t: '老鹰', ok: true }, { t: '荷花', ok: false, why: '课文没写' }, { t: '蚂蚁', ok: true }, { t: '花儿和草', ok: true },
    { t: '萤火虫', ok: false, why: '课文没写' }, { t: '梨树、桃树', ok: true }, { t: '橘子树、柚子树', ok: true }, { t: '竹子', ok: true },
    { t: '蝴蝶', ok: false, why: '课文没写' }, { t: '棕榈', ok: true }, { t: '倒影间的小鱼', ok: true },
  ],
};

/* 课后第 2 题：体会生动的语言 */
const CLUE_LABELS = ['读一读', '我感受到'];
const CLUES = [
  { q: '小麻雀<em>叽叽喳喳</em>、<em>蹦蹦跳跳</em>的，叫人愉悦。', a: '听到它在叫，看到它在跳——两个叠词写出麻雀活泼可爱，难怪“叫人愉悦”。' },
  { q: '老鹰在高空<em>盘旋</em>，<em>展翅滑翔</em>，突然<em>猛扑而下</em>，给人以雄健勇猛的感觉。', a: '一连串动作，由慢到快，最后“突然猛扑”——老鹰又威风又勇猛。' },
  { q: '微风吹来，沙沙的竹叶声，<em>如同温柔的细语</em>。', a: '把竹叶的沙沙声比作温柔的细语，好像竹子在轻轻地说悄悄话。' },
  { q: '在秋高气爽的日子里，它<em>倒映在池塘的水中</em>，小鱼<em>在倒影间游玩</em>，又是另一种境界。', a: '水里有树的影子，小鱼在影子里游来游去——像一幅安静的画，美极了。' },
];

/* 课后第 3 题：仿照课文写一写 */
const MOMENTS = [
  {
    name: '写一种小动物', pic: 'mayi',
    prompt: '你在大自然里见过哪种有趣的小动物？仿照“小麻雀叽叽喳喳、蹦蹦跳跳的，叫人愉悦”写一写。',
    hint: '写它的声音或动作（可以用叠词），再写它给你的感受。',
    example: '小蜗牛背着圆圆的房子，慢慢吞吞地在墙角爬，爬过的地方留下一道亮晶晶的线，真叫人好奇。',
  },
  {
    name: '写一种植物', pic: 'guoshu',
    prompt: '你家附近、学校里有哪种植物？仿照课文写写它的样子、颜色，或者它在四季里的变化。',
    hint: '可以学“花儿有红的、黄的、紫的、蓝的”，写出它的颜色和样子；也可以学“大蒲扇似的叶子”，打个比方。',
    example: '校园里的银杏树，春天长出一把把绿色的小扇子；到了秋天，小扇子变成金黄色，风一吹，就在空中跳起舞来。',
  },
  {
    name: '写我最喜爱的', pic: 'zonglv',
    prompt: '学课文第 5 段，写写大自然中你最喜爱的一样东西，写得细一点。',
    hint: '看到了什么？听到了什么？可以写一写风吹来、下雨时它的样子。',
    example: '我最喜爱的，是楼下的那棵桂花树。秋天一到，满树开着米粒大的小黄花，风一吹，香气飘得老远，好像在邀请大家来闻一闻。',
  },
];

function initBook() {
  const $ = (id) => document.getElementById(id);
  let page = 0;
  const show = () => {
    const p = BOOK_PAGES[page];
    $('book').classList.toggle('blank-page', !p.pic);
    $('bookPic').style.backgroundImage = p.pic ? `url('assets/${p.pic}.jpg')` : 'none';
    $('bookTitle').textContent = p.title;
    $('bookText').textContent = p.text;
    $('bookNo').textContent = `第 ${page + 1} 页`;
    $('bookPrev').hidden = page === 0;
    $('bookNext').textContent = page === BOOK_PAGES.length - 1 ? '从头翻 ›' : '翻一页 ›';
  };
  $('bookNext').addEventListener('click', () => { page = (page + 1) % BOOK_PAGES.length; show(); });
  $('bookPrev').addEventListener('click', () => { page = Math.max(0, page - 1); show(); });
  show();
}

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    initBook();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
