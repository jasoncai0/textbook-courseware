'use strict';
/* 古诗三首（四上 9）· 本课数据与互动。诗文模板见 ../shared/poem.js，画面见 ../shared/narrative.js */

const POEMS = {
  mj: {
    title: '暮江吟', author: '［唐］白居易',
    lines: [
      { t: '一道残阳铺水中，', r: '一道/残阳/铺水中，', f: '1.2 30% 55%' },
      { t: '半江瑟瑟半江红。', r: '半江/瑟瑟/半江红。', f: '1.25 50% 70%' },
      { t: '可怜九月初三夜，', r: '可怜/九月/初三夜，', f: '1.1 50% 40%' },
      { t: '露似真珠月似弓。', r: '露似/真珠/月似弓。', f: '1.3 40% 60%' },
    ],
    notes: { 瑟瑟: '这里形容未受到残阳照射的江水所呈现的青绿色', 可怜: '可爱', 真珠: '这里指珍珠' },
  },
  tx: {
    title: '题西林壁', author: '［宋］苏轼',
    lines: [
      { t: '横看成岭侧成峰，', r: '横看/成岭/侧成峰，', f: '1.15 55% 40%' },
      { t: '远近高低各不同。', r: '远近/高低/各不同。', f: '1.1 60% 45%' },
      { t: '不识庐山真面目，', r: '不识/庐山/真面目，', f: '1.2 60% 35%' },
      { t: '只缘身在此山中。', r: '只缘/身在/此山中。', f: '1.3 55% 65%' },
    ],
    notes: { 缘: '因为' },
  },
  xm: {
    title: '雪梅', author: '［宋］卢钺',
    lines: [
      { t: '梅雪争春未肯降，', r: '梅雪/争春/未肯降，', f: '1.15 45% 45%' },
      { t: '骚人阁笔费评章。', r: '骚人/阁笔/费评章。', f: '1.25 60% 60%' },
      { t: '梅须逊雪三分白，', r: '梅须/逊雪/三分白，', f: '1.3 40% 40%' },
      { t: '雪却输梅一段香。', r: '雪却/输梅/一段香。', f: '1.3 45% 50%' },
    ],
    notes: { 降: '服输', 骚人: '诗人', 阁: '同“搁”，放下。这里读 gē', 评章: '评议。这里指评议梅与雪的高下', 逊: '不及，比不上' },
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成诗句

/* 题西林壁 · 换个角度看庐山 */
function initViews() {
  const svg = document.getElementById('lushanView');
  document.querySelector('.view-btns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-view]');
    if (!b) return;
    svg.setAttribute('class', `v-${b.dataset.view}`);
    document.querySelectorAll('.view-btns .btn').forEach((x) => x.classList.toggle('solid', x === b));
  });
}

/* 雪梅 · 比两场 */
const VS = {
  bai: ['vsBai', '雪赢！梅须逊雪三分白'],
  xiang: ['vsXiang', '梅赢！雪却输梅一段香'],
};
function initVs() {
  document.querySelector('.vs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-vs]');
    if (!b) return;
    const [id, text] = VS[b.dataset.vs];
    const res = document.getElementById(id);
    res.textContent = text;
    res.classList.add('show', b.dataset.vs);
    b.classList.add('solid');
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    Poem.init();
    initViews();
    initVs();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
