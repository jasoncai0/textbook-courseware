'use strict';
/* 古诗三首（示儿 / 题临安邸 / 己亥杂诗）· 本课数据。诗文模板见 ../shared/poem.js，翻卡片见 ../shared/narrative.js */

const POEMS = {
  shier: {
    title: '示儿', author: '［宋］陆游',
    lines: [
      { t: '死去元知万事空，', r: '死去/元知/万事空，', f: '1.3 45% 45%' },
      { t: '但悲不见九州同。', r: '但悲/不见/九州同。', f: '1.3 75% 35%' },
      { t: '王师北定中原日，', r: '王师/北定/中原日，', f: '1.2 80% 30%' },
      { t: '家祭无忘告乃翁。', r: '家祭/无忘/告乃翁。', f: '1.25 40% 50%' },
    ],
    notes: { 元: '同“原”，本来', 九州: '古代中国曾分为九个州，这里代指全国', 王师: '指南宋朝廷的军队', 乃翁: '你们的父亲', 家祭: '家中祭祀祖先' },
  },
  linan: {
    title: '题临安邸', author: '［宋］林升',
    lines: [
      { t: '山外青山楼外楼，', r: '山外/青山/楼外楼，', f: '1.2 50% 30%' },
      { t: '西湖歌舞几时休？', r: '西湖/歌舞/几时休？', f: '1.35 55% 60%' },
      { t: '暖风熏得游人醉，', r: '暖风/熏得/游人醉，', f: '1.4 60% 55%' },
      { t: '直把杭州作汴州。', r: '直把/杭州/作汴州。', f: '1.08 50% 50%' },
    ],
    notes: { 汴州: '在今河南开封，曾为北宋都城', 杭州: '即临安，在今浙江杭州，曾为南宋都城', 几时休: '什么时候停止', 熏: '吹，熏染' },
  },
  jihai: {
    title: '己亥杂诗', author: '［清］龚自珍',
    lines: [
      { t: '九州生气恃风雷，', r: '九州/生气/恃风雷，', f: '1.2 50% 25%' },
      { t: '万马齐喑究可哀。', r: '万马/齐喑/究可哀。', f: '1.3 45% 65%' },
      { t: '我劝天公重抖擞，', r: '我劝/天公/重抖擞，', f: '1.2 55% 20%' },
      { t: '不拘一格降人材。', r: '不拘/一格/降人材。', f: '1.06 50% 50%' },
    ],
    notes: {
      生气: '活力，生命力。这里指朝气蓬勃的局面', 恃: '依靠', 齐喑: '万马齐喑：所有的马都沉寂无声。比喻人们沉默不语，不敢发表意见。喑，沉默',
      究: '终究，实在', 抖擞: '振作', 不拘: '不拘一格：不拘泥于一种规格、方式', 降: '降下',
    },
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成诗句

/* 课后第 2 题 · 读题目 */
const CLUE_LABELS = ['这个题目……', '告诉我们……'];
const CLUES = [
  { q: '示儿　<small class="gs-by">［宋］陆游</small>', a: '<b>写给谁</b>：“示”是给……看。这是陆游临终前写给儿子们的诗，是一份遗嘱。' },
  { q: '题临安邸　<small class="gs-by">［宋］林升</small>', a: '<b>写在哪儿</b>：“题”是写上去；“邸”是旅店。诗写在南宋都城临安一家旅店的墙上。' },
  { q: '己亥杂诗　<small class="gs-by">［清］龚自珍</small>', a: '<b>什么时候写</b>：己亥年（1839）写的一组诗，共 315 首，内容各不相同，所以叫“杂诗”。' },
];

/* 己亥杂诗 · 马群：低头沉默 → 抬头奔腾 */
const HERD_COLS = 6;
const HERD_ROWS = 2;
function horse(x, y, awake) {
  const [nx, ny] = awake ? [x + 26, y - 24] : [x + 28, y + 10];
  const color = awake ? '#ffe27a' : '#7d8594';
  return `<g fill="${color}" stroke="${color}" stroke-linecap="round"><ellipse cx="${x}" cy="${y}" rx="22" ry="9"/>`
    + `<path d="M${x + 14} ${y - 3} L${nx} ${ny}" stroke-width="8"/><ellipse cx="${nx + 5}" cy="${ny + (awake ? 0 : 3)}" rx="7" ry="4"/>`
    + `<path d="M${x - 21} ${y - 3} q-10 4 -8 ${awake ? -6 : 16}" fill="none" stroke-width="3"/>`
    + `<path d="M${x - 14} ${y + 6} v16 M${x - 6} ${y + 7} v15 M${x + 8} ${y + 7} v15 M${x + 15} ${y + 6} v16" stroke-width="3"/></g>`;
}
function buildHerd() {
  const spots = [];
  for (let r = 0; r < HERD_ROWS; r += 1) {
    for (let c = 0; c < HERD_COLS; c += 1) spots.push([50 + c * 70 + (r % 2) * 30, 230 + r * 45]);
  }
  document.getElementById('herd').innerHTML = spots.map(([x, y]) => horse(x, y, false)).join('');
  document.getElementById('herdAwake').innerHTML = spots.map(([x, y]) => horse(x, y, true)).join('');
}

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS });
    Poem.init();
    buildHerd();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
