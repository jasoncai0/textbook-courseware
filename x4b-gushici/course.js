'use strict';
/* 古诗词三首（四下 1）· 本课数据与互动。诗文模板见 ../shared/poem.js，画面见 ../shared/narrative.js
 * 本课专属：菜花丛里找黄蝶、清平乐一家五口。
 */

const POEMS = {
  tj: {
    title: '四时田园杂兴（其二十五）', author: '［宋］范成大',
    lines: [
      { t: '梅子金黄杏子肥，', r: '梅子/金黄/杏子肥，', f: '1.2 35% 40%' },
      { t: '麦花雪白菜花稀。', r: '麦花/雪白/菜花稀。', f: '1.2 60% 65%' },
      { t: '日长篱落无人过，', r: '日长/篱落/无人过，', f: '1.15 50% 60%' },
      { t: '惟有蜻蜓蛱蝶飞。', r: '惟有/蜻蜓/蛱蝶飞。', f: '1.3 50% 50%' },
    ],
    notes: { 蛱蝶: '蝴蝶的一种', 篱落: '篱笆' },
  },
  xs: {
    title: '宿新市徐公店', author: '［宋］杨万里',
    lines: [
      { t: '篱落疏疏一径深，', r: '篱落/疏疏/一径深，', f: '1.15 40% 60%' },
      { t: '树头新绿未成阴。', r: '树头/新绿/未成阴。', f: '1.2 50% 35%' },
      { t: '儿童急走追黄蝶，', r: '儿童/急走/追黄蝶，', f: '1.3 45% 60%' },
      { t: '飞入菜花无处寻。', r: '飞入/菜花/无处寻。', f: '1.3 65% 65%' },
    ],
    notes: { 疏疏: '稀疏', 阴: '树荫', 一径: '一条小路' },
  },
  qp: {
    title: '清平乐·村居', author: '［宋］辛弃疾',
    lines: [
      { t: '茅檐低小，', f: '1.2 40% 45%' },
      { t: '溪上青青草。', f: '1.2 50% 70%' },
      { t: '醉里吴音相媚好，', f: '1.3 45% 50%' },
      { t: '白发谁家翁媪？', f: '1.3 45% 50%' },
      { t: '大儿锄豆溪东，', f: '1.3 75% 45%' },
      { t: '中儿正织鸡笼。', f: '1.3 60% 55%' },
      { t: '最喜小儿亡赖，', f: '1.35 30% 70%' },
      { t: '溪头卧剥莲蓬。', f: '1.4 30% 75%' },
    ],
    notes: { 吴音: '这里指当地的方言。辛弃疾闲居的带湖（今属江西）古代属吴地', 翁媪: '老翁和老妇', 亡赖: '同“无赖”，这里指顽皮、淘气。“亡”读 wú' },
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成诗句

/* 四时田园杂兴：翻卡片看颜色和样子 */
const CLUES = [
  { q: '梅子是什么颜色？', a: '金黄——熟透了' },
  { q: '杏子长得怎么样？', a: '肥——又大又圆' },
  { q: '麦花是什么颜色？', a: '雪白——像雪一样白' },
  { q: '菜花开得怎么样？', a: '稀——快开完了，结籽了' },
];

/* 宿新市徐公店：菜花丛里找黄蝶 */
const FLOWER_N = 140;
const FIELD = { x0: 300, x1: 800, y0: 230, y1: 440 };
function drawField() {
  // 固定种子的伪随机，保证每次打开花的位置一样
  let seed = 7;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const flowers = Array.from({ length: FLOWER_N }, () => {
    const x = FIELD.x0 + rnd() * (FIELD.x1 - FIELD.x0);
    const y = FIELD.y0 + rnd() * (FIELD.y1 - FIELD.y0);
    const r = 6 + rnd() * 6;
    return `<g class="fl"><path d="M${x.toFixed(0)} ${(y + r).toFixed(0)} v18" stroke="#6f9b4a" stroke-width="2"/><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="${rnd() > 0.5 ? '#f4d03f' : '#f1c40f'}"/></g>`;
  });
  document.getElementById('xsField').innerHTML = flowers.join('');
}

function initFind() {
  const svg = document.getElementById('xsSvg');
  const msg = document.getElementById('xsMsg');
  svg.addEventListener('click', (e) => {
    if (e.target.closest('#xsFly')) {
      svg.classList.add('found');
      msg.textContent = '找到了！黄蝴蝶藏在黄菜花里，真难找——这就是“无处寻”。';
      return;
    }
    if (e.target.closest('#xsField')) msg.textContent = '这是一朵菜花，再找找……';
  });
  document.getElementById('xsHint').addEventListener('click', () => svg.classList.add('hint'));
}

/* 清平乐：一家五口 */
const FAMILY = [
  { name: '翁媪', pos: '35% 45%', line: '醉里吴音相媚好，白发谁家翁媪？', act: '白发的老两口，喝了点酒，用软软的方言亲亲热热地聊天。' },
  { name: '大儿', pos: '80% 40%', line: '大儿锄豆溪东，', act: '大儿子在小溪东边的豆田里锄草——勤劳。' },
  { name: '中儿', pos: '60% 55%', line: '中儿正织鸡笼。', act: '二儿子坐着编鸡笼，“正”字说明他编得正专心——能干。' },
  { name: '小儿', pos: '25% 75%', line: '最喜小儿亡赖，溪头卧剥莲蓬。', act: '小儿子趴在溪头剥莲蓬，边剥边吃——顽皮、可爱。' },
];
function initFamily() {
  const $ = (id) => document.getElementById(id);
  $('famBtns').innerHTML = FAMILY.map((f, i) => `<button class="btn" type="button" data-i="${i}">${f.name}</button>`).join('');
  const show = (i) => {
    const f = FAMILY[i];
    $('famBtns').querySelectorAll('.btn').forEach((b, k) => b.classList.toggle('solid', k === i));
    $('famPic').style.backgroundPosition = f.pos;
    $('famLine').textContent = f.line;
    $('famDo').textContent = f.act;
  };
  $('famBtns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (b) show(+b.dataset.i);
  });
  show(0);
}

/* 读与写：我眼前浮现的情景 */
const MOMENTS = [
  { name: '日长篱落无人过', pic: 'tianyuan', prompt: '日长篱落无人过，惟有蜻蜓蛱蝶飞。', hint: '想一想：是一天中的什么时候？篱笆边有什么？蜻蜓、蝴蝶在怎么飞？四周的声音呢？',
    example: '初夏的中午，太阳暖洋洋的。篱笆边静悄悄的，一个人影也没有，大人们都下田干活去了。只有几只红蜻蜓在篱笆上停一停，又飞走了；两只花蝴蝶绕着篱笆转圈，好像在捉迷藏。' },
  { name: '儿童急走追黄蝶', pic: 'xinshi', prompt: '儿童急走追黄蝶，飞入菜花无处寻。', hint: '孩子是怎么追的？蝴蝶飞进菜花以后，孩子会有什么动作、什么表情？',
    example: '一只黄蝴蝶从小路上飞过，一个小男孩看见了，张开双手追了过去。他跑得飞快，眼看就要扑到了，蝴蝶却一扭身钻进了金黄的菜花丛。小男孩停下来，东瞧瞧，西望望，满眼都是黄灿灿的菜花，哪里还找得到蝴蝶呀！' },
  { name: '溪头卧剥莲蓬', pic: 'cunju', prompt: '最喜小儿亡赖，溪头卧剥莲蓬。', hint: '“卧”是什么样子？小儿子是怎么剥莲蓬的？剥出莲子以后呢？',
    example: '小儿子趴在溪边的草地上，两只小脚一翘一翘的。他捧着一个大莲蓬，用小手抠出一颗颗嫩绿的莲子，往嘴里一扔，嚼得香甜。吃够了，他还把莲子往小溪里扔，看着水面开出一圈圈小花。' },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: ['点一点', '诗里说'], moments: MOMENTS });
    Poem.init();
    drawField();
    initFind();
    initFamily();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
