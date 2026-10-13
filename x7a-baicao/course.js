'use strict';
/* 从百草园到三味书屋 · 本课数据与本课独有互动：默读计时、空间对比地图、“不必说……单是……”分层动画 + 感官按钮 */

/* ---------- 地图热点：玩什么 / 学什么 / 想什么 ---------- */
const MAP_SPOTS = {
  caiqi: ['玩', '菜畦、石井栏', '碧绿的菜畦，光滑的石井栏——夏天的百草园，处处是颜色和光亮。'],
  tree: ['玩', '皂荚树、桑椹', '高大的皂荚树，紫红的桑椹，鸣蝉在树叶里长吟。'],
  grass: ['想', '长草', '长的草里是不去的，因为相传这园里有一条很大的赤练蛇。'],
  wall: ['玩', '泥墙根', '油蛉低唱，蟋蟀弹琴；按斑蝥、拔何首乌、摘覆盆子——“就有无限趣味”。'],
  snow: ['玩', '雪地捕鸟', '扫开一块雪，支起竹筛，撒些秕谷……“你太性急，来不及等它走到中间去。”'],
  story: ['想', '美女蛇的故事', '长妈妈讲的故事，使“我”觉得做人之险，又极想得到一盒飞蜈蚣。'],
  bridge: ['过渡', '第 9 段', '“我将不能常到百草园了。Ade，我的蟋蟀们！Ade，我的覆盆子们和木莲们！……”'],
  room: ['学', '书房', '对着那扁和鹿行礼：第一次算是拜孔子，第二次算是拜先生。'],
  teacher: ['想', '先生', '问“怪哉”这虫，先生说“不知道！”——“我才知道做学生是不应该问这些事的”。'],
  read: ['学', '读书 · 习字 · 对课', '我就只读书，正午习字，晚上对课。对课从三言到五言，终于到七言。'],
  yard: ['玩', '后园', '折蜡梅花，寻蝉蜕，最好的工作是捉了苍蝇喂蚂蚁，静悄悄地没有声音。'],
  draw: ['玩', '画画儿', '用荆川纸蒙在小说的绣像上描下来，《荡寇志》和《西游记》的绣像都有一大本。'],
};

function initMap() {
  const svg = document.getElementById('mapSvg');
  const pop = document.getElementById('mapPop');
  const show = (spot) => {
    const [kind, name, text] = MAP_SPOTS[spot.dataset.k];
    svg.querySelectorAll('.spot').forEach((s) => s.classList.toggle('picked', s === spot));
    pop.innerHTML = `<span class="kind k-${kind}">${kind}</span><b>${name}</b><br>${text}`;
  };
  svg.addEventListener('click', (e) => {
    const spot = e.target.closest('.spot');
    if (spot && spot.closest('[data-step]').classList.contains('on')) show(spot);
  });
  svg.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('spot')) show(e.target);
  });
}

/* ---------- “不必说……单是……”：按步切换三层 + 感官按钮 ---------- */
const LAYER_CAPS = ['', '不必说……（静）', '也不必说……（动）', '单是……（泥墙根放大）', '单是……（泥墙根放大）'];

function updateLayer(slide, step) {
  const svg = slide.querySelector('#layerSvg');
  if (!svg) return;
  svg.setAttribute('class', `lv${Math.min(step, 3)}`);
  svg.querySelector('#lvCap').textContent = LAYER_CAPS[step] || '';
  if (step < 4) {
    svg.classList.remove('sense-on');
    slide.querySelectorAll('[data-sense]').forEach((b) => b.classList.remove('solid'));
  }
}

function initSenses() {
  const svg = document.getElementById('layerSvg');
  document.querySelector('.sense-btns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-sense]');
    if (!btn) return;
    const on = !btn.classList.contains('solid');
    document.querySelectorAll('[data-sense]').forEach((b) => b.classList.toggle('solid', on && b === btn));
    svg.classList.toggle('sense-on', on);
    svg.querySelectorAll('.it').forEach((it) => it.classList.toggle('lit', on && it.classList.contains(btn.dataset.sense)));
  });
}

/* ---------- 默读计时 ---------- */
const TEXT_CHARS = 2600;
function initTimer() {
  const face = document.getElementById('rdTime');
  const rate = document.getElementById('rdRate');
  let start = 0;
  let timer = 0;
  const fmt = (ms) => {
    const s = Math.floor(ms / 1000);
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  };
  document.getElementById('rdStart').addEventListener('click', () => {
    start = Date.now();
    clearInterval(timer);
    timer = setInterval(() => { face.textContent = fmt(Date.now() - start); }, 500);
    rate.textContent = '默读中……不出声，不指读，不回看。';
  });
  document.getElementById('rdStop').addEventListener('click', () => {
    if (!start) return;
    clearInterval(timer);
    const min = (Date.now() - start) / 60000;
    face.textContent = fmt(Date.now() - start);
    rate.textContent = `约 ${Math.round(TEXT_CHARS / Math.max(min, 0.1))} 字 / 分钟。读完说一说：他在园里、在屋里，玩些什么，学些什么，想些什么？`;
    start = 0;
  });
}

/* ---------- 美女蛇：表态 ---------- */
function initVote() {
  const res = document.getElementById('voteRes');
  document.querySelector('.vote').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-vote]');
    if (!btn) return;
    document.querySelectorAll('[data-vote]').forEach((b) => b.classList.toggle('solid', b === btn));
    res.innerHTML = btn.dataset.vote === 'yes'
      ? '你认为可以删。想一想：删掉以后，百草园还那么神秘吗？“我”的形象会少些什么？按“下一步”看看另一方的理由。'
      : '你认为不能删。用课文里的句子说理由，再按“下一步”对照参考。';
  });
}

const CLUE_LABELS = ['看似矛盾', '其实'];
const CLUES = [
  { q: '“渊博的宿儒”<br>却说“怪哉”这虫“不知道！”', a: '不是不知道，是不愿意说：在先生看来，学生只该读正经书，不该问这些“闲事”。' },
  { q: '“有一条戒尺”“也有罚跪的规则”<br>“但是不常用”', a: '规矩严，心不狠：普通总不过瞪几眼，大声道“读书！”' },
  { q: '“全城中称为最严厉的书塾”<br>先生却“和蔼地在一旁答礼”', a: '严而不厉，待人有礼；“我对他很恭敬”。' },
  { q: '大叫“人都到那里去了？！”“读书！”<br>自己读书时却摇头晃脑、读得入神', a: '他真心爱读书，沉醉其中——学生们趁机做戏、画画儿，也透出几分可爱。' },
];

const PICKS = {
  life: [
    { t: '枯燥', ok: true, why: '只读书，正午习字，晚上对课；书渐渐加多，对课从三言到七言' },
    { t: '严格', ok: true, why: '最严厉的书塾；同窗到园里太多太久，先生便大叫起来' },
    { t: '有乐趣', ok: true, why: '后园折蜡梅、寻蝉蜕、捉苍蝇喂蚂蚁；纸盔甲做戏、描绣像' },
    { t: '自由自在', ok: false, why: '这是百草园的生活；书屋里一个一个陆续走回去，一同回去也不行' },
    { t: '人声鼎沸', ok: true, why: '大家放开喉咙读一阵书——热闹也是一种生活' },
    { t: '无聊透顶', ok: false, why: '太绝对：书屋里也有乐趣' },
  ],
};

const SORT = [
  { s: '我家的后面有一个很大的园……但那时却是我的乐园。', ok: ['大鲁迅'], q: '“现在……那时……”回望之中，满是眷恋' },
  { s: '何首乌根是有像人形的，吃了便可以成仙，我于是常常拔它起来，牵连不断地拔起来……', ok: ['小鲁迅'], q: '信以为真，天真好奇' },
  { s: '而且极想得到一盒老和尚那样的飞蜈蚣。', ok: ['小鲁迅'], q: '孩子的愿望' },
  { s: '叫我名字的陌生声音自然是常有的，然而都不是美女蛇。', ok: ['大鲁迅'], q: '成年人的幽默与感慨' },
  { s: '我疑心这是极好的文章，因为读到这里，他总是微笑起来。', ok: ['小鲁迅'], q: '孩子的推测，读来好笑' },
  { s: '听说现在自己已经做了店主……这东西早已没有了罢。', ok: ['大鲁迅'], q: '时光流逝的怅惘' },
];

const MOMENTS = [
  {
    name: '我们的校园', pic: 'baicao',
    prompt: '用“不必说……也不必说……单是……”写写我们的校园。',
    hint: '两个“不必说”写校园里大家熟悉的景物（一笔带过）；“单是”选一个小角落（如花坛、操场边的大树下）写细，写出看到的、听到的、闻到的。',
    example: '不必说宽阔的操场，高高的旗杆，整齐的教学楼，红色的跑道；也不必说课间追逐的笑声，篮球砸在地上的“咚咚”声，广播里悠扬的音乐。单是教学楼后面那个小小的花坛，就有说不完的乐趣。春天，月季开得正艳，红的像火，粉的像霞，凑近一闻，香气直往鼻子里钻；蜜蜂嗡嗡地在花间忙碌，蚂蚁排着队从砖缝里爬出来……',
  },
  {
    name: '菜市场', pic: 'qiangen',
    prompt: '用“不必说……也不必说……单是……”写写一个菜市场。',
    hint: '注意由面到点；“单是”选一个摊位写细：颜色、形状、声音、气味、味道。',
    example: '不必说红彤彤的西红柿，绿油油的青菜，紫莹莹的茄子；也不必说此起彼伏的吆喝声，秤盘“叮当”的碰撞声。单是门口那个卖水果的小摊，就够我看上半天……',
  },
  {
    name: '雪后的院子', pic: 'buniao',
    prompt: '用“不必说……也不必说……单是……”写写雪后的院子或公园。',
    hint: '“不必说”写远处、大处的景；“单是”写近处、小处：脚印、树枝上的雪、冻得发红的手……',
    example: '不必说白茫茫的屋顶，银装素裹的树木；也不必说孩子们打雪仗的欢笑声。单是院子角落里那棵小松树，就藏着许多秘密……',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, picks: PICKS, sort: SORT, kinds: ['小鲁迅', '大鲁迅'], moments: MOMENTS });
    initMap();
    initSenses();
    initTimer();
    initVote();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateLayer(slide, step);
  },
};
