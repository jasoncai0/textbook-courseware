'use strict';
/* 古诗三首（寒食 / 迢迢牵牛星 / 十五夜望月）· 本课数据。诗文模板见 ../shared/poem.js，画面、分类、选一选见 ../shared/narrative.js */

const POEMS = {
  hanshi: {
    title: '寒食', author: '［唐］韩翃',
    lines: [
      { t: '春城无处不飞花，', r: '春城/无处/不飞花，', f: '1.15 50% 40%' },
      { t: '寒食东风御柳斜。', r: '寒食/东风/御柳斜。', f: '1.3 70% 40%' },
      { t: '日暮汉宫传蜡烛，', r: '日暮/汉宫/传蜡烛，', f: '1.25 85% 50%' },
      { t: '轻烟散入五侯家。', r: '轻烟/散入/五侯家。', f: '1.2 40% 60%' },
    ],
    notes: { 寒食: '寒食节，通常在冬至后的第105天，过去在节日期间不能生火做饭', 春城: '指春天的京城', 御柳: '皇城里的柳树', 汉宫: '这里用汉代皇宫来借指唐代皇宫', 传蜡烛: '指宫中传赐新火', 五侯: '这里泛指权贵豪门' },
  },
  qianniu: {
    title: '迢迢牵牛星', author: '《古诗十九首》',
    lines: [
      { t: '迢迢牵牛星，', r: '迢迢/牵牛星，', f: '1.2 70% 30%' },
      { t: '皎皎河汉女。', r: '皎皎/河汉女。', f: '1.2 45% 35%' },
      { t: '纤纤擢素手，', r: '纤纤/擢素手，', f: '1.35 45% 55%' },
      { t: '札札弄机杼。', r: '札札/弄机杼。', f: '1.3 45% 60%' },
      { t: '终日不成章，', r: '终日/不成章，', f: '1.25 45% 60%' },
      { t: '泣涕零如雨。', r: '泣涕/零如雨。', f: '1.4 45% 40%' },
      { t: '河汉清且浅，', r: '河汉/清且浅，', f: '1.1 60% 40%' },
      { t: '相去复几许。', r: '相去/复几许。', f: '1.1 55% 40%' },
      { t: '盈盈一水间，', r: '盈盈/一水间，', f: '1.05 55% 45%' },
      { t: '脉脉不得语。', r: '脉脉/不得语。', f: '1.3 45% 40%' },
    ],
    notes: { 迢迢: '遥远的样子', 皎皎: '明亮的样子', 河汉女: '指织女星。河汉，银河', 河汉: '银河', 擢: '伸出', 素: '白皙', 札札: '织机发出的响声', 机杼: '织机。杼，梭子', 章: '花纹', 零: '落下', 盈盈: '清澈的样子', 脉脉: '相视无言的样子' },
  },
  wangyue: {
    title: '十五夜望月', author: '［唐］王建',
    lines: [
      { t: '中庭地白树栖鸦，', r: '中庭/地白/树栖鸦，', f: '1.25 25% 50%' },
      { t: '冷露无声湿桂花。', r: '冷露/无声/湿桂花。', f: '1.3 75% 45%' },
      { t: '今夜月明人尽望，', r: '今夜/月明/人尽望，', f: '1.3 30% 25%' },
      { t: '不知秋思落谁家。', r: '不知/秋思/落谁家。', f: '1.2 60% 65%' },
    ],
    notes: { 中庭: '即庭中，庭院中', 地白: '月光照在庭院地上的样子', 秋思: '秋天的情思，这里指思念之情' },
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成诗句

/* 迢迢牵牛星 · 叠词卡 */
const CLUE_LABELS = ['叠词', '写出了……'];
const CLUES = [
  { q: '迢迢', a: '远：牵牛星离得那么遥远。' },
  { q: '皎皎', a: '亮：织女星明亮洁白。' },
  { q: '纤纤', a: '手：织女的手细长柔美。' },
  { q: '札札', a: '声：织机札札作响，一刻不停。' },
  { q: '盈盈', a: '水：银河清澈，只隔一条河。' },
  { q: '脉脉', a: '情：含情相望，却说不出话。' },
];

/* 十五夜望月 · 借月思念的诗句 */
const PICKS = {
  moon: [
    { t: '举头望明月，低头思故乡。', ok: true, why: '李白《静夜思》' },
    { t: '春眠不觉晓，处处闻啼鸟。', ok: false, why: '写春晨，没有月' },
    { t: '海上生明月，天涯共此时。', ok: true, why: '张九龄《望月怀远》' },
    { t: '但愿人长久，千里共婵娟。', ok: true, why: '苏轼《水调歌头》' },
    { t: '两个黄鹂鸣翠柳，一行白鹭上青天。', ok: false, why: '写景，不写思念' },
    { t: '露从今夜白，月是故乡明。', ok: true, why: '杜甫《月夜忆舍弟》' },
    { t: '白日依山尽，黄河入海流。', ok: false, why: '写登高望远' },
  ],
};

/* 选做 · 诗句里的节日 */
const KINDS = ['春节', '寒食节', '七夕节', '中秋节', '重阳节'];
const SORT_ITEMS = [
  { s: '日暮汉宫传蜡烛，轻烟散入五侯家。（韩翃《寒食》）', ok: ['寒食节'], q: '传赐新火' },
  { s: '盈盈一水间，脉脉不得语。（《迢迢牵牛星》）', ok: ['七夕节'], q: '牛郎织女' },
  { s: '今夜月明人尽望，不知秋思落谁家。（王建《十五夜望月》）', ok: ['中秋节'], q: '赏月思亲' },
  { s: '爆竹声中一岁除，春风送暖入屠苏。（王安石《元日》）', ok: ['春节'], q: '放爆竹、饮屠苏' },
  { s: '遥知兄弟登高处，遍插茱萸少一人。（王维《九月九日忆山东兄弟》）', ok: ['重阳节'], q: '登高、插茱萸' },
];

/* 寒食 · 飞花和蜡烛（数量是装饰，不是数据） */
const FLOWER_COUNT = 26;
const CANDLE_COUNT = 5;
function buildHanshi() {
  const svg = document.getElementById('hsSvg');
  svg.querySelector('.hs-flowers').innerHTML = Array.from({ length: FLOWER_COUNT }, (_, i) =>
    `<circle class="hs-petal" cx="${(i * 97) % 600}" cy="${(i * 53) % 220}" r="${2 + (i % 3)}" fill="${i % 2 ? '#f6f1e7' : '#f2c6c0'}" style="animation-delay:${(i * .23 % 3).toFixed(2)}s"/>`).join('');
  const path = svg.querySelector('#hsPath');
  const len = path.getTotalLength();
  svg.querySelector('.hs-candles').innerHTML = Array.from({ length: CANDLE_COUNT }, (_, i) => {
    const p = path.getPointAtLength(len * (i + .5) / CANDLE_COUNT);
    return `<g class="pop" style="animation-delay:${(.2 + i * .3).toFixed(1)}s"><rect x="${(p.x - 3).toFixed(0)}" y="${(p.y - 4).toFixed(0)}" width="6" height="12" fill="#f3ecdc"/><ellipse class="hs-flame" cx="${p.x.toFixed(0)}" cy="${(p.y - 8).toFixed(0)}" rx="4" ry="7" fill="#f2a33a"/></g>`;
  }).join('');
}

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, picks: PICKS, kinds: KINDS, sort: SORT_ITEMS });
    Poem.init();
    buildHanshi();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
