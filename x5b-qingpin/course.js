'use strict';
/* 清贫 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 阅读提示一 · 品质 */
const PICKS = {
  pinzhi: [
    { t: '清正廉洁', ok: true, why: '数百万元一点一滴用于革命' },
    { t: '舍己为公', ok: true, why: '“矜持不苟，舍己为公”' },
    { t: '艰苦朴素', ok: true, why: '唯一的财产是旧衣、线袜' },
    { t: '坚定从容', ok: true, why: '面对榴弹，微笑着，淡淡地说' },
    { t: '贪图享受', ok: false, why: '“从没有奢侈过”' },
    { t: '胆小怕事', ok: false, why: '他毫不畏惧' },
    { t: '斤斤计较', ok: false, why: '表和笔被抢也不在意' },
  ],
};

/* 阅读提示二 · 清贫 */
const CLUE_LABELS = ['“清贫”', '可以这样理解'];
const CLUES = [
  { q: '贫', a: '物质上贫乏：身上一个铜板也没有，唯一的财产是几套旧汗褂裤、几双线袜。' },
  { q: '清', a: '清白、廉洁：经手数百万元，却一点一滴都用于革命事业。' },
  { q: '洁白朴素的生活', a: '不贪、不奢，干干净净做人。这是共产党员的美德。' },
  { q: '战胜许多困难的地方', a: '不为发财，只为革命——心里有信仰，就不怕苦、不怕死。' },
];

const MOMENTS = [
  {
    name: '我对“清贫”的理解', pic: 'jiuyi',
    prompt: '读了课文，你怎样理解“清贫”？',
    hint: '可以从“清”和“贫”两个字说起，联系课文中的事例。',
    example: '方志敏的“贫”，是身上一个铜板也没有；他的“清”，是经手数百万元却一分不取。清贫不是可怜，而是一种干干净净的骄傲。',
  },
  {
    name: '想对方志敏说', pic: 'qiushi',
    prompt: '方志敏在囚室里写下了这篇文章。你想对他说些什么？',
    hint: '可以写你的敬佩，也可以写你从他身上明白了什么。',
    example: '方志敏叔叔，面对榴弹，您却微笑着，淡淡地说话。您用几件旧衣服告诉我：一个人最宝贵的财产，不是金钱，而是清白的心。',
  },
  {
    name: '今天还需要清贫吗', pic: 'biaobi',
    prompt: '今天我们的生活富足了，方志敏说的“清贫”精神还需要吗？说说你的想法。',
    hint: '想一想：清贫的“清”——清白、廉洁、节俭——今天还重要吗？',
    example: '需要。今天我们不必再穿打补丁的衣服，可是不贪不占、勤俭节约、做事干干净净，在什么时候都不会过时。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
