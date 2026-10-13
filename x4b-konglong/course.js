'use strict';
/* 飞向蓝天的恐龙 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，提问—解决卡见 wenjie.js，翻页引擎见 ../shared/deck.js
 * 本课专属：演化变形器（滑块穿越时空隧道，第三档给恐龙加上像鸟的特征，第四档比较两种看法）、讲解员提词卡、“去掉试试”体会表达准确。
 */

/* 演化变形器：每一档的年代标签和课文原句 */
const EVO = [
  ['两亿四千万年前', '地球上的第一种恐龙大约出现在两亿四千万年前。它和狗一般大小，两条后腿粗壮有力，能够支撑起整个身体。'],
  ['数千万年后', '数千万年后，它的后代繁衍成一个形态各异的庞大家族。有些恐龙像它们的祖先一样用两足奔跑，有些恐龙则用四足行走。有些恐龙身长几十米，重达数十吨；有些恐龙则身材小巧，体重只有几千克。有些恐龙凶猛异常，是茹毛饮血的食肉动物；有些恐龙则温顺可爱，以植物为食。'],
  ['越来越像鸟', '其中，一些猎食性恐龙的身体逐渐变小，越来越像鸟类：骨骼中空，身体轻盈；脑颅膨大，行动敏捷；前肢越来越长，能像鸟翼一样拍打；体表长出美丽的羽毛，不再披着鳞片或鳞甲。'],
  ['学会飞翔', ''],
  ['飞向蓝天', '不管怎样，科学家们认为：原本不会飞的恐龙最终变成了天之骄子——鸟类，它们飞向了蓝天，从此开辟了崭新的生活天地。'],
];
const VIEWS = {
  tree: '它们中的一些种类可能为了躲避敌害或寻找食物而转移到树上生存。这些树栖的恐龙在树木之间跳跃，降落，慢慢具备了滑翔能力，并最终能够主动飞行。',
  run: '不过，另一种看法是，飞行并非始于树栖生活。有些科学家推测，一种生活在地面上的带羽毛的恐龙，在奔跑过程中学会了飞翔。',
};
function initEvo() {
  const svg = document.getElementById('evoSvg');
  const range = document.getElementById('evRange');
  const txt = document.getElementById('evTxt');
  const feats = new Set();
  let view = 'tree';
  const paint = () => {
    const i = +range.value;
    svg.setAttribute('class', [`e${i}`, `v-${view}-on`, ...[...feats].map((f) => `f-${f}`)].join(' '));
    document.getElementById('evEra').textContent = EVO[i][0];
    txt.textContent = i === 3 ? VIEWS[view] : EVO[i][1];
    document.getElementById('evFt').classList.toggle('show', i === 2);
    document.getElementById('evView').classList.toggle('show', i === 3);
  };
  range.addEventListener('input', paint);
  document.getElementById('evFt').addEventListener('click', (e) => {
    const b = e.target.closest('[data-ft]');
    if (!b) return;
    const on = !feats.has(b.dataset.ft);
    if (on) feats.add(b.dataset.ft); else feats.delete(b.dataset.ft);
    b.classList.toggle('solid', on);
    paint();
  });
  document.getElementById('evView').addEventListener('click', (e) => {
    const b = e.target.closest('[data-v]');
    if (!b) return;
    view = b.dataset.v;
    document.querySelectorAll('#evView .btn').forEach((x) => x.classList.toggle('solid', x === b));
    paint();
  });
  paint();
}

/* 课后第 2 题：讲解员提词卡 */
const CARDS = [
  ['开场', '大家好！你们知道吗？天上飞的鸟儿，祖先很可能是恐龙。'],
  ['第一种恐龙', '大约两亿四千万年前，出现了第一种恐龙，它和狗一般大小，用两条后腿支撑身体。'],
  ['庞大家族', '后来它的后代越来越多，有的两足奔跑，有的四足行走；有的很大，有的很小。'],
  ['越来越像鸟', '其中一些猎食性恐龙身体变小：骨骼中空、脑颅膨大、前肢变长、长出羽毛。'],
  ['学会飞翔', '它们可能在树上学会了滑翔，也可能在地面奔跑中学会了飞翔。'],
  ['飞向蓝天', '最后，它们变成了鸟类，飞向蓝天。我国辽西发现的带羽毛的恐龙化石，就是证据！'],
];
const TIMER_TICK_MS = 1000;
function initPrompter() {
  const $ = (id) => document.getElementById(id);
  let i = 0;
  let keyOnly = false;
  let timer = 0;
  const show = () => {
    $('prKey').textContent = CARDS[i][0];
    $('prLine').textContent = keyOnly ? '' : CARDS[i][1];
    $('prDots').innerHTML = CARDS.map((_, k) => `<i class="${k === i ? 'cur' : k < i ? 'done' : ''}"></i>`).join('');
  };
  $('prPrev').addEventListener('click', () => { i = Math.max(0, i - 1); show(); });
  $('prNext').addEventListener('click', () => { i = Math.min(CARDS.length - 1, i + 1); show(); });
  $('prMode').addEventListener('click', (e) => {
    keyOnly = !keyOnly;
    e.currentTarget.textContent = keyOnly ? '显示完整提示' : '只看关键词';
    show();
  });
  $('prTimer').addEventListener('click', (e) => {
    if (timer) { clearInterval(timer); timer = 0; e.currentTarget.textContent = '开始计时'; return; }
    const start = Date.now();
    i = 0; show();
    e.currentTarget.textContent = '停止';
    timer = setInterval(() => { $('prTime').textContent = `${Math.round((Date.now() - start) / TIMER_TICK_MS)} 秒`; }, TIMER_TICK_MS);
  });
  show();
}

/* 课后第 3 题：去掉试试 */
const EXACT = [
  ['科学家们希望能够', '全面', '揭示这一历史进程。', '“全面”说明要把整个过程都弄清楚，不只是一部分。去掉了，要求就变低了。'],
  ['鸟类不仅和恐龙有亲缘关系，而且', '很可能', '就是一种小型恐龙的后裔。', '这是科学家的假说，还没有百分之百证实，所以说“很可能”。'],
  ['地球上的第一种恐龙', '大约', '出现在两亿四千万年前。', '年代太久远，只能估算，不能说得那么死。'],
  ['二者', '似乎', '毫不相干', '只是看起来没关系，其实有关系。去掉就和后文矛盾了。'],
  ['它们中的一些种类', '可能', '为了躲避敌害或寻找食物而转移到树上生存。', '这是一种推测，还有“另一种看法”，所以只能说“可能”。'],
  ['他们离这一愿望的实现已', '越来越近', '了。', '还没有完全实现，只是在接近。说“实现了”就不准确了。'],
];
function initExact() {
  const box = document.getElementById('exact');
  box.innerHTML = EXACT.map(([a, k, b, why], i) => `<div class="ex-row" data-i="${i}">
      <p class="ex-s">${a}<span class="ex-k">${k}</span>${b}</p>
      <button class="btn" type="button">去掉它</button>
      <p class="ex-why">${why}</p></div>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.btn');
    if (!b) return;
    const row = b.closest('.ex-row');
    const off = row.classList.toggle('off');
    b.textContent = off ? '放回去' : '去掉它';
  });
}

/* 课后第 1 题：提问—解决卡 */
const WENJIE = {
  konglong: {
    items: [
      { q: '“中生代”是什么时候？', k: 'ci', how: ['zl', 'qj'], a: '查资料：中生代是地球历史上的一个时期，大约从两亿五千多万年前到六千多万年前，是恐龙生活的年代。' },
      { q: '“点睛之笔”是什么意思？为什么说辽西的发现是“点睛之笔”？', k: 'ci', how: ['sx', 'zl'], a: '查成语：画龙点睛，比喻关键处一点就活了。联系上文：大家一直找不到恐龙长羽毛的证据，辽西的化石正是最关键的证据。' },
      { q: '恐龙为什么会长出羽毛？', k: 'nr', how: ['zl', 'qj'], a: '查资料：最早的羽毛可能是用来保暖、吸引同伴的，后来才慢慢用来飞翔。' },
      { q: '课文开头为什么要先写霸王龙、鸽子和孔雀？', k: 'xf', how: ['sx', 'qj'], a: '联系上下文：先写恐龙和鸟差别很大，“似乎毫不相干”，再说出它们其实是一家，让人特别想读下去。' },
      { q: '“天之骄子”指的是谁？', k: 'ci', how: ['sx'], a: '联系上下文：“变成了天之骄子——鸟类”，破折号后面就是解释，指鸟类，能在天上飞，是天空的骄傲。' },
    ],
  },
};

/* 小练笔 */
const MOMENTS = [
  { name: '公园里的人', pic: 'zhongsheng', prompt: '公园里的人们在做什么？用“有些……有些……”写一写。', hint: '从不同方面写：年龄、在做的事、动作快慢……',
    example: '傍晚的公园可热闹了。有些老人在打太极拳，动作慢悠悠的；有些阿姨在跳广场舞，跟着音乐扭来扭去。有些小朋友在草地上追着泡泡跑，有些则坐在滑梯上排队，等着一个接一个滑下来。' },
  { name: '课间十分钟', pic: 'shuqi', prompt: '下课了，同学们在做什么？', hint: '至少用三组“有些……有些……”，写出“各不相同”。',
    example: '下课铃一响，同学们像小鸟一样飞出教室。有些同学在跳绳，有些同学在踢毽子；有些同学围在一起看图画书，有些则趴在窗台上看外面的云。教室里、走廊上，到处都是笑声。' },
  { name: '各种各样的鸟', pic: 'yumao', prompt: '鸟类大家族形态各异，你能写一写吗？', hint: '可以从大小、颜色、本领、吃什么等方面写。',
    example: '鸟类是一个形态各异的大家族。有些鸟身材高大，像鸵鸟，跑起来飞快；有些鸟小巧玲珑，像蜂鸟，比大拇指还小。有些鸟羽毛五彩斑斓，像孔雀；有些鸟一身乌黑，像乌鸦。' },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    WenJie.init(WENJIE);
    initEvo();
    initPrompter();
    initExact();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
