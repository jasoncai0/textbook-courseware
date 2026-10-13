'use strict';
/* 古诗三首（绝句 / 惠崇春江晚景 / 三衢道中）· 本课数据。诗文模板见 ../shared/poem.js，选一选、小练笔见 ../shared/narrative.js */

const POEMS = {
  jueju: {
    title: '绝句', author: '［唐］杜甫',
    lines: [
      { t: '迟日江山丽，', r: '迟日/江山丽，', f: '1.12 55% 25%' },
      { t: '春风花草香。', r: '春风/花草香。', f: '1.3 45% 65%' },
      { t: '泥融飞燕子，', r: '泥融/飞燕子，', f: '1.45 25% 55%' },
      { t: '沙暖睡鸳鸯。', r: '沙暖/睡鸳鸯。', f: '1.5 72% 75%' },
    ],
    notes: { 迟日: '春日', 泥融: '这里指泥土变湿软' },
  },
  chunjiang: {
    title: '惠崇春江晚景', author: '［宋］苏轼',
    lines: [
      { t: '竹外桃花三两枝，', r: '竹外/桃花/三两枝，', f: '1.3 28% 25%' },
      { t: '春江水暖鸭先知。', r: '春江/水暖/鸭先知。', f: '1.4 62% 62%' },
      { t: '蒌蒿满地芦芽短，', r: '蒌蒿/满地/芦芽短，', f: '1.3 48% 82%' },
      { t: '正是河豚欲上时。', r: '正是/河豚/欲上时。', f: '1.15 70% 70%' },
    ],
    notes: { 芦芽: '芦苇的嫩芽', 河豚: '一种肉味鲜美的鱼，有毒性', 蒌蒿: '一种草，嫩茎可以吃' },
  },
  sanqu: {
    title: '三衢道中', author: '［宋］曾几',
    lines: [
      { t: '梅子黄时日日晴，', r: '梅子/黄时/日日晴，', f: '1.08 50% 30%' },
      { t: '小溪泛尽却山行。', r: '小溪/泛尽/却山行。', f: '1.3 47% 68%' },
      { t: '绿阴不减来时路，', r: '绿阴/不减/来时路，', f: '1.2 40% 45%' },
      { t: '添得黄鹂四五声。', r: '添得/黄鹂/四五声。', f: '1.5 12% 30%' },
    ],
    notes: { 泛尽: '小溪泛尽，就是乘小船到小溪的尽头', 却: '再，又', 阴: '树荫' },
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成诗句

/* 惠崇春江晚景 · 画上能看到的景物 */
const PICKS = {
  hua: [
    { t: '竹', ok: true, why: '竹外' },
    { t: '桃花', ok: true, why: '三两枝' },
    { t: '鸭子', ok: true, why: '在江里游' },
    { t: '水暖', ok: false, why: '看不出来，是诗人想到的' },
    { t: '蒌蒿', ok: true, why: '满地' },
    { t: '芦芽', ok: true, why: '短短的' },
    { t: '河豚', ok: false, why: '在水下，是诗人想到的' },
  ],
};

/* 读与写 · 说说诗里的画面 */
const HINT = '用上“我好像看到了……听到了……闻到了……”，说三四句话。';
const MOMENTS = [
  {
    name: '绝句', pic: 'jueju', hint: HINT,
    prompt: '读“迟日江山丽，春风花草香。泥融飞燕子，沙暖睡鸳鸯”，你好像看到了什么？',
    example: '春天的太阳暖洋洋的，远处的山青青的，江水绿绿的。春风吹过来，我好像闻到了花和草的香味。几只燕子飞来飞去，叼着湿湿的泥巴去筑窝；江边的沙滩晒得暖暖的，一对鸳鸯靠在一起，睡得正香呢。',
  },
  {
    name: '惠崇春江晚景', pic: 'chunjiang', hint: HINT,
    prompt: '读“竹外桃花三两枝，春江水暖鸭先知”，你好像看到了什么？鸭子在想什么？',
    example: '竹林外面，两三枝桃花开得粉粉的。江面上，几只鸭子游来游去，“嘎嘎”地叫着，好像在说：“水暖和啦，春天来啦！”岸边长满了青青的蒌蒿，芦苇刚冒出短短的嫩芽。',
  },
  {
    name: '三衢道中', pic: 'sanqu', hint: HINT,
    prompt: '读“绿阴不减来时路，添得黄鹂四五声”，诗人一路上看到了什么、听到了什么？',
    example: '梅子黄了，天天都是大晴天。诗人坐着小船到了小溪的尽头，又沿着山路往前走。山路两边的树绿油油的，和来的时候一样浓密。忽然，树上传来几声“啾啾”的黄鹂叫，真好听！',
  },
];

/* 边读边想象：读到哪一句，画面哪里亮起来。
 * 故事页 .spot-layer 跟着镜头焦点（data-focus）走；图片框 .spot-img 跟着 [data-spot="x% y% 半径%"] 走 */
const SPOT_ALL = '50% 50% 100%';
const SPOT_R = '26%';
const SPOT_MIN_ZOOM = 1.1;
function latestStep(slide, step, attr) {
  let hit = null;
  slide.querySelectorAll(`[${attr}]`).forEach((el) => { if ((+el.dataset.step || 0) <= step) hit = el; });
  return hit;
}
function setSpot(el, value) {
  const [x, y, r] = value.split(' ');
  el.style.setProperty('--sx', x);
  el.style.setProperty('--sy', y);
  el.style.setProperty('--sr', r);
}
function updateSpot(slide, step) {
  const layer = slide.querySelector('.spot-layer');
  if (layer) {
    const hit = latestStep(slide, step, 'data-focus][data-step');
    const [s, fx, fy] = hit ? hit.dataset.focus.split(' ') : [];
    setSpot(layer, +s >= SPOT_MIN_ZOOM ? `${fx} ${fy} ${SPOT_R}` : SPOT_ALL); // 拉远的全景镜头不压暗
  }
  const img = slide.querySelector('.spot-img');
  if (img) setSpot(img, (latestStep(slide, step, 'data-spot') || img).dataset.spot);
}

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    Poem.init();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateSpot(slide, step);
  },
};
