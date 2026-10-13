'use strict';
/* 搭石 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，提速小工具见 speed.js，翻页引擎见 ../shared/deck.js */

/* 课后第 1 题：读得快，还要读得懂（有“陷阱”选项） */
const PICKS = {
  know: [
    { t: '秋凉以后，人们在小溪里摆好搭石', ok: true, why: '第 1、2 段' },
    { t: '上了年岁的人把不平稳的搭石调稳', ok: true, why: '第 2 段' },
    { t: '一行人走搭石，协调有序', ok: true, why: '第 3 段' },
    { t: '两人相遇，招手示意让对方先走', ok: true, why: '第 4 段' },
    { t: '年轻人背老人过搭石', ok: true, why: '第 4 段' },
    { t: '汛期山洪暴发时，人们踩着搭石过河', ok: false, why: '汛期要“脱鞋挽裤”，进入秋天才摆搭石' },
    { t: '搭石是人们专门凿好的石板', ok: false, why: '“搭石，原本就是天然石块”' },
    { t: '后来家乡在小溪上修了一座桥', ok: false, why: '课文没有写' },
  ],
};

/* 课后第 2 题：画面 → 情感 */
const CLUE_LABELS = ['印象深的画面', '体会到的情感'];
const CLUES = [
  { q: '上了点儿年岁的人……一定会放下带的东西，找来合适的石头搭上，再在上边踏上几个来回，直到满意了才肯离去。', a: '<b>一心为别人着想。</b>自己急着赶路，也要先把搭石调稳，方便后来走搭石的人。' },
  { q: '一行人走搭石的时候，动作是那么协调有序！前面的抬起脚来，后面的紧跟上去。', a: '<b>默契、互相照应。</b>不抢路、不止步，每个人都顾着前后的人。' },
  { q: '总会在第一块搭石前止步，招手示意，让对方先走；等对方过了河，两人再说上几句家常话，才相背而行。', a: '<b>谦让、和睦。</b>一个手势就是“您先请”，过了河还要拉拉家常。' },
  { q: '假如遇上老人来走搭石，年轻人总要俯下身子背老人过去，人们把这看成理所当然的事。', a: '<b>尊敬老人。</b>“理所当然”说明这是家乡人人都做的平常事。' },
];

/* 读与写：身边美好的画面 */
const MOMENTS = [
  {
    name: '配合默契的画面', pic: 'yixing',
    prompt: '学习“前面的抬起脚来，后面的紧跟上去”，写一个大家配合默契的画面：排队打饭、接力赛跑、大扫除……',
    hint: '写清楚每个人的动作，再用一个词点出画面的“美”在哪里（如：协调有序、井井有条）。',
    example: '大扫除开始了。高个子的同学踩着凳子擦窗户上沿，矮个子的蹲下来擦窗台；前面的扫过去，后面的拖把紧跟上来。不到二十分钟，教室亮堂堂的——大家配合得那么默契！',
  },
  {
    name: '“理所当然”的小事', pic: 'bei',
    prompt: '生活中有没有像“背老人过搭石”这样，大家都觉得“理所当然”的小事？写一写。',
    hint: '可以写公交车上让座、帮邻居拎东西、下雨天给同学撑伞……写出动作和神情。',
    example: '公交车一个急刹车，一位拄拐杖的奶奶晃了一下。靠窗的大哥哥马上站起来，扶着奶奶坐下，自己拉着扶手站到了门边。车上没有一个人觉得奇怪——这在我们这儿，是理所当然的事。',
  },
  {
    name: '身边的“搭石”', pic: 'xiaoxi',
    prompt: '“一排排搭石，任人走，任人踏”——生活中有哪些人像搭石一样，默默为别人服务？写几句话。',
    hint: '想一想：清洁工、门卫爷爷、过马路时的志愿者……他们每天在做什么？',
    example: '每天清晨，校门口总站着一位门卫爷爷。他把自行车一辆辆扶正，把掉在地上的红领巾捡起来挂在门边。他就像一块搭石，任我们每天从他身边走过，却默默联结着我们和学校。',
  },
];

/* 第 3 段 · 走搭石：七块搭石、四个人，一人一块，跳着前进 */
const STONE_X0 = 80;
const STONE_GAP = 120;
const STONES = 7;
const WALKER_COLORS = ['#3f6f8a', '#8a4f2a', '#5d7a3a', '#7a3f5d'];

function walker(color) {
  return `<g class="fig">
    <path d="M-6 -24 L-11 0 M6 -24 L11 0" stroke="#4a3b2a" stroke-width="5" stroke-linecap="round"/>
    <path d="M-11 -54 h22 l3 32 h-28 z" fill="${color}"/>
    <path d="M9 -50 l13 15" stroke="${color}" stroke-width="5" stroke-linecap="round"/>
    <circle cx="0" cy="-64" r="10" fill="#e6c49c"/>
    <path d="M-10 -67 q10 -12 20 0 z" fill="#fbfaf5"/>
  </g>`;
}

function buildWalk(svg) {
  svg.querySelector('.stones').innerHTML = Array.from({ length: STONES }, (_, k) =>
    `<rect x="${STONE_X0 + k * STONE_GAP - 38}" y="222" width="76" height="20" rx="7" fill="#8f8a80" stroke="#6d675d" stroke-width="2"/>`).join('');
  svg.querySelector('.waves').innerHTML = [258, 285, 312].map((y, i) =>
    `<path class="wave" style="animation-delay:-${i * .7}s" d="M0 ${y} q30 -8 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0"/>`).join('');
  svg.querySelector('.walkers').innerHTML = WALKER_COLORS.map((c, i) =>
    `<g transform="translate(${STONE_X0} 224)"><g class="wk w${i}"><g transform="scale(1.35)">${walker(c)}</g></g></g>`).join('');
  svg.closest('.slide').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-walk]');
    if (!btn) return;
    svg.classList.toggle('halt', btn.dataset.walk === 'halt');
    btn.parentElement.querySelectorAll('[data-walk]').forEach((b) => b.classList.toggle('solid', b === btn));
  });
}

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    Speed.init();
    buildWalk(document.getElementById('walk'));
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    Speed.onRender(slide);
  },
};
