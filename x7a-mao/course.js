'use strict';
/* 猫 · 本课数据与本课互动（证据推敲、填表、情感曲线、语句品味）。翻页引擎见 ../shared/deck.js */

const PICKS = {
  why: [
    { t: '“我”没有判断明白便妄下断语，冤枉了一只不能说话辩诉的动物', ok: true, why: '直接原因：错误无法挽回' },
    { t: '大家嫌它不好看、不活泼，早就冷落它——偏见让“我”轻易定了它的罪', ok: true, why: '更深的原因：“若有若无的动物”' },
    { t: '它“无抵抗的逃避”，让“我”看清自己的暴怒和虐待', ok: true, why: '对弱小生命的伤害' },
    { t: '它死了，“我永无改正我的过失的机会了”', ok: true, why: '自责无从弥补' },
    { t: '因为第三只猫最会捉鼠，对家里最有用', ok: false, why: '课文说它“也不去捉鼠”' },
    { t: '因为“我”本来就最喜欢第三只猫', ok: false, why: '“大家都不喜欢它”' },
  ],
};

const MOMENTS = [
  {
    name: '对第三只猫说', pic: 'maosan',
    prompt: '“我将怎样地对它表白我的误解呢？”假如能对第三只猫说几句话，“我”会说什么？',
    hint: '想一想：“我”错在哪里？它当时怎样“无抵抗的逃避”？“我”现在明白了什么？',
    example: '花白猫，那天是我错了。你只是在露台上晒太阳，我却认定你吃了鸟，拿木棒打你。你叫了一声就逃到屋瓦上，连辩白的力气都没有。我从来没有好好看过你，只因为你不好看、不活泼……对不起。',
  },
  {
    name: '猫的视角', pic: 'heimao',
    prompt: '换成第三只猫的视角：那天早上，它躺在露台上晒太阳，忽然……写写它的感受。',
    hint: '它“不能说话辩诉”，只能“很悲楚地叫了一声‘咪呜’”。用第一人称写出它的委屈。',
    example: '太阳暖暖的，我刚眯上眼睛，就听见主人急促的脚步声。他举着木棒冲过来，我还没弄明白，背上已经一阵剧痛。我叫了一声“咪呜”，逃到屋瓦上。我做错了什么？我只是常常看那两只黄鸟唱歌啊……',
  },
  {
    name: '一句话说中心', pic: 'maoyi',
    prompt: '用一两句话概括《猫》的中心思想（单元写作“如何突出中心”）。',
    hint: '格式：本文通过……（写了什么），表达了……（作者的态度、情感），告诉我们……',
    example: '本文通过“我”家三次养猫的经历，特别是第三只猫被冤枉而死的事，表达了“我”对自己凭偏见妄下判断、虐待弱小生命的深深自责，告诉我们要尊重和善待一切生命。',
  },
];

/* 情感曲线：读出 SVG 里各个点，走到第几步，折线就画到第几个点 */
function updateMood(slide, step) {
  const line = slide.querySelector('#moodLine');
  if (!line) return;
  const all = line.dataset.all || line.getAttribute('points');
  line.dataset.all = all;
  const pts = all.trim().split(/\s+/);
  line.setAttribute('points', pts.slice(0, Math.max(1, Math.min(step, pts.length))).join(' '));
}

function initToggles() {
  // 证据推敲 / 语句品味：点一下展开解析
  document.querySelectorAll('.evi, .taste').forEach((b) => b.addEventListener('click', () => b.classList.toggle('open')));
  // 三只猫表格：点空格显示答案
  const table = document.querySelector('.cat-table');
  table.addEventListener('click', (e) => {
    const cell = e.target.closest('button');
    if (cell) cell.classList.add('shown');
  });
  document.getElementById('tableAll').onclick = () => table.querySelectorAll('button').forEach((b) => b.classList.add('shown'));
  document.getElementById('tableReset').onclick = () => table.querySelectorAll('button').forEach((b) => b.classList.remove('shown'));
}

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    initToggles();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateMood(slide, step);
  },
};
