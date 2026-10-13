'use strict';
/* 精卫填海（四上 13）· 本课数据与互动。文言横排 + 译文见 ../shared/poem.js，情节图、选一选、讲故事见 ../shared/narrative.js */

const POEMS = {
  jw: {
    title: '精卫填海', author: '《山海经·北山经》', layout: 'h',
    lines: [
      { t: '炎帝之少女，', r: '炎帝/之少女，', y: '炎帝的小女儿，' },
      { t: '名曰女娃。', r: '名曰/女娃。', y: '名叫女娃。' },
      { t: '女娃游于东海，', r: '女娃/游于东海，', y: '女娃到东海游玩，' },
      { t: '溺而不返，', r: '溺而/不返，', y: '淹死在海里，没有回来，' },
      { t: '故为精卫，', r: '故/为精卫，', y: '因此化作了精卫鸟，' },
      { t: '常衔西山之木石，', r: '常衔/西山之木石，', y: '常常衔着西山上的树枝和石块，' },
      { t: '以堙于东海。', r: '以堙/于东海。', y: '用来填塞东海。' },
    ],
    notes: {
      炎帝: '传说中上古时期的部落首领', 少女: '小女儿', 溺: '溺水，淹没', 故: '因此', 堙: '填塞',
      精卫: '神话中鸟的名字，形状像乌鸦，头上有花纹，白色的嘴，红色的脚，传说是炎帝小女儿溺水身亡后的化身',
    },
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成句子

/* ================= 小小的鸟，茫茫的海：陪精卫飞几趟 ================= */
const HILL = [96, 128];
const SEA = [440, 196];
const FLY_MS = 1300;
const DROP_MS = 700;
const SEA_SAYS = [
  [1, '扑通！石子沉下去了，大海还是那么大。'],
  [3, '又飞了一趟……海浪一点儿也没变。'],
  [6, '翅膀酸了，它还在飞。'],
  [10, '十趟了！精卫一点儿也没想停下。'],
];
const birdShape = '<path d="M-22 4 Q -6 -14 14 -6 Q 26 0 30 6 Q 6 14 -22 4 Z" fill="#2b2a30"/><path d="M-8 -2 Q 2 -26 16 -4 Z" fill="#45434c"/><circle cx="26" cy="0" r="8" fill="#2b2a30"/><path d="M32 0 l12 3 l-12 4 z" fill="#f4f1ea"/><path d="M0 12 v8 M8 12 v8" stroke="#d6402e" stroke-width="2.5"/>';
function buildSea() {
  const waves = Array.from({ length: 6 }, (_, i) => `<path class="sw" d="M${160 + (i % 3) * 140} ${250 + Math.floor(i / 3) * 60} q20 -10 40 0 t40 0 t40 0" style="animation-delay:${i * .3}s"/>`).join('');
  document.getElementById('seaSvg').innerHTML = `<defs><clipPath id="seClip"><rect width="600" height="380" rx="14"/></clipPath></defs>
    <g clip-path="url(#seClip)">
      <rect width="600" height="380" fill="#e7eef0"/>
      <path d="M0 230 L40 110 L90 70 L140 120 L190 90 L230 230 Z" fill="#6f9a6a"/>
      <g fill="#4f7f4a"><circle cx="70" cy="120" r="14"/><circle cx="110" cy="100" r="12"/><circle cx="170" cy="120" r="14"/></g>
      <text class="t-l" x="60" y="60" fill="#3f6a3a">西山</text>
      <path d="M150 220 Q 400 200 600 210 V380 H150 Z" fill="#4f86a6"/>
      <g stroke="#cfe6f2" stroke-width="3" fill="none">${waves}</g>
      <text class="t-l" x="470" y="250" fill="#fff">东海</text>
      <circle id="seaRipple" cx="${SEA[0]}" cy="226" r="4" fill="none" stroke="#fff" stroke-width="3" opacity="0"/>
      <circle id="seaStone" cx="0" cy="0" r="5" fill="#7a6a5a" opacity="0"/>
      <g id="seaBird" style="transform:translate(${HILL[0]}px,${HILL[1]}px)">${birdShape}</g>
      <text class="t-l" x="580" y="40" text-anchor="end" fill="#2b4a5a" id="seaN">第 0 趟</text>
    </g>`;
}
function initSea() {
  const btn = document.getElementById('seaGo');
  const bird = document.getElementById('seaBird');
  const stone = document.getElementById('seaStone');
  const ripple = document.getElementById('seaRipple');
  let trips = 0;
  btn.addEventListener('click', () => {
    if (btn.disabled) return;
    btn.disabled = true;
    bird.style.transform = `translate(${SEA[0]}px,${SEA[1]}px)`;
    setTimeout(() => {
      stone.setAttribute('cx', SEA[0] + 34);
      stone.setAttribute('cy', SEA[1] + 4);
      stone.style.opacity = 1;
      stone.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(30px)', opacity: 0 }], { duration: DROP_MS, fill: 'forwards' });
      ripple.animate([{ opacity: 1, r: 4 }, { opacity: 0, r: 40 }], { duration: DROP_MS * 1.6 });
      trips += 1;
      document.getElementById('seaN').textContent = `第 ${trips} 趟`;
      document.getElementById('seaSay').textContent = SEA_SAYS.filter(([n]) => trips >= n).pop()[1];
      bird.style.transform = `translate(${HILL[0]}px,${HILL[1]}px)`;
      setTimeout(() => { btn.disabled = false; }, FLY_MS);
    }, FLY_MS);
  });
}

/* ================= 精卫的印象 ================= */
const PICKS = {
  jw: [
    { t: '坚持不懈', ok: true, why: '“常”衔木石' },
    { t: '意志坚定', ok: true, why: '大海再大也不怕' },
    { t: '不畏艰难', ok: true, why: '西山到东海，路远' },
    { t: '执着', ok: true, why: '认准了就一直做' },
    { t: '三心二意', ok: false, why: '它从不停下' },
    { t: '知难而退', ok: false, why: '它迎难而上' },
  ],
};

/* ================= 读与写 ================= */
const MOMENTS = [
  {
    name: '讲《精卫填海》', pic: 'tianhai',
    prompt: '结合注释，用自己的话讲讲精卫填海的故事。',
    hint: '按起因（女娃溺海）、经过（化为精卫，衔木石）、结果（一直填海）讲；可以加上合理的想象。',
    example: '很久很久以前，炎帝有个小女儿，名叫女娃。有一天，女娃到东海去玩，忽然狂风大作，巨浪把她卷进了海里，她再也没有回来。女娃化作了一只小鸟，头上有花纹，嘴是白的，脚是红的，人们叫它“精卫”。精卫恨透了无情的大海，它每天从西山衔来小树枝和小石子，一趟又一趟地投进东海，想把大海填平。',
  },
  {
    name: '想象：精卫和大海', pic: 'jingwei',
    prompt: '大海嘲笑精卫：“小鸟儿，你永远也填不平我！”精卫会怎么回答？',
    hint: '用对话写出精卫的决心。',
    example: '大海翻起巨浪，哈哈大笑：“小鸟儿，算了吧！就算你填上一百万年，也填不平我！”精卫在空中高声回答：“一百万年填不平，我就填一千万年！总有一天，我要把你填平，不让你再害人！”说完，它又飞回西山去了。',
  },
  {
    name: '我眼中的精卫', pic: 'xianmu',
    prompt: '精卫给你留下了怎样的印象？写几句话，说出你的理由。',
    hint: '先写印象，再从课文里找依据（“常”“西山”“东海”）。',
    example: '精卫给我留下了坚持不懈的印象。西山离东海那么远，大海那么大，它的嘴那么小，一次只能衔一块小石子，可它“常衔西山之木石”，从来没有停下来。我做事也要像精卫一样，不怕困难，坚持到底。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    Poem.init();
    buildSea();
    initSea();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
