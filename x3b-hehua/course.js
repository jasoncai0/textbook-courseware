'use strict';
/* 荷花 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，背诵挖空见 ../shared/poem.js */

/* 背诵第 2～4 自然段（一句一行） */
Poem.render({
  beisong: {
    title: '荷花（第 2～4 自然段）', author: '叶圣陶',
    lines: [
      { t: '荷花已经开了不少了。荷叶挨挨挤挤的，像一个个碧绿的大圆盘。白荷花在这些大圆盘之间冒出来。' },
      { t: '有的才展开两三片花瓣儿。有的花瓣儿全展开了，露出嫩黄色的小莲蓬。有的还是花骨朵儿，看起来饱胀得马上要破裂似的。' },
      { t: '这么多的白荷花，一朵有一朵的姿势。看看这一朵，很美；看看那一朵，也很美。' },
      { t: '如果把眼前的一池荷花看作一大幅活的画，那画家的本领可真了不起。' },
      { t: '我忽然觉得自己仿佛就是一朵荷花，穿着雪白的衣裳，站在阳光里。' },
      { t: '一阵微风吹过来，我就翩翩起舞，雪白的衣裳随风飘动。不光是我一朵，一池的荷花都在舞蹈。' },
      { t: '风过了，我停止了舞蹈，静静地站在那儿。蜻蜓飞过来，告诉我清早飞行的快乐。小鱼在脚下游过，告诉我昨夜做的好梦……' },
    ],
  },
});

/* 课后第 2 题 · 点句子，让画“活”起来：每个按钮给 #hhLive 加一个动画类，可叠加 */
function initLive() {
  const svg = document.getElementById('hhLive');
  document.querySelector('.hh-acts').addEventListener('click', (e) => {
    const b = e.target.closest('[data-live]');
    if (!b) return;
    const on = b.classList.toggle('on-live');
    svg.classList.toggle(`live-${b.dataset.live}`, on);
  });
}

/* 读与写 · 小练笔 */
const MOMENTS = [
  {
    name: '仿写一种植物', pic: 'santai',
    prompt: '仿照第 2 自然段，写一种你喜欢的植物。用上“有的……有的……有的……”写出它不同的样子。',
    hint: '先观察：它的叶子什么样？花（果实）有几种样子？像什么？',
    example: '公园里的月季花开了。绿油油的叶子一簇一簇的，像一把把小扇子。红红的月季花在叶子之间探出头来。有的才开了几片花瓣儿，像害羞的小姑娘；有的全开了，露出黄黄的花蕊；有的还是花骨朵儿，鼓鼓的，好像一碰就要炸开似的。',
  },
  {
    name: '蜻蜓告诉我', pic: 'wudao',
    prompt: '“蜻蜓飞过来，告诉我清早飞行的快乐。”蜻蜓会怎么说？',
    hint: '想一想：清早，蜻蜓飞过了哪些地方？看到了什么？',
    example: '蜻蜓落在我的花瓣上，说：“荷花姐姐，今天一大早，我飞过了绿绿的草地，飞过了弯弯的小桥，露珠在阳光下一闪一闪的，风凉凉的，飞起来可舒服啦！”',
  },
  {
    name: '小鱼告诉我', pic: 'wudao',
    prompt: '“小鱼在脚下游过，告诉我昨夜做的好梦……”小鱼做了什么好梦？',
    hint: '省略号表示话还没说完，接着往下想象。',
    example: '小鱼吐着泡泡说：“昨天夜里，我梦见自己长出了翅膀，飞到天上，和星星一起捉迷藏。月亮婆婆还给我讲故事呢！”',
  },
];

/* 品 · “长出来 / 露出来 / 冒出来”：同一个画面，换一个字，荷花出来的样子不一样 */
const VERB_STEP = 2;
function initVerbs() {
  const pond = document.getElementById('hhPond');
  const replay = (mode) => {
    pond.classList.remove('up', 'm-zhang', 'm-lu', 'm-mao');
    void pond.getBoundingClientRect();
    pond.classList.add(`m-${mode}`, 'up');
    document.querySelectorAll('.hh-verbs .btn').forEach((b) => b.classList.toggle('solid', b.dataset.mode === mode));
  };
  document.querySelector('.hh-verbs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-mode]');
    if (b) replay(b.dataset.mode);
  });
  return (slide, step) => {
    if (!slide.contains(pond)) return;
    if (step >= VERB_STEP && !pond.classList.contains('up')) replay('mao');
    if (step < VERB_STEP) pond.classList.remove('up');
  };
}

/* 边读边想象：读到哪一句，画面哪里亮起来（.spot-layer 跟着字幕的镜头焦点走） */
const SPOT_ALL = '50% 50% 100%';
const SPOT_R = '24%';
const SPOT_MIN_ZOOM = 1.1;
function updateSpot(slide, step) {
  const layer = slide.querySelector('.spot-layer');
  if (!layer) return;
  let hit = null;
  slide.querySelectorAll('[data-focus][data-step]').forEach((el) => { if (+el.dataset.step <= step) hit = el; });
  const [s, fx, fy] = hit ? hit.dataset.focus.split(' ') : [];
  const [x, y, r] = +s >= SPOT_MIN_ZOOM ? [fx, fy, SPOT_R] : SPOT_ALL.split(' '); // 拉远的全景镜头不压暗
  layer.style.setProperty('--sx', x);
  layer.style.setProperty('--sy', y);
  layer.style.setProperty('--sr', r);
}

let updateVerbs = () => {};
window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initLive();
    Poem.init();
    updateVerbs = initVerbs();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateSpot(slide, step);
    updateVerbs(slide, step);
  },
};
