'use strict';
/* 景阳冈 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 课后第 2 题：喝酒 →（上冈）→（打虎）→（下冈） */
const PLOT = [
  { step: 1, stage: '喝酒', text: '“三碗不过冈”，武松连喝十八碗', pic: 'jiudian', x: 13, y: 92 },
  { step: 2, stage: '上冈', text: '不听劝，读榜文知有虎，仍上冈', pic: 'bangwen', x: 38, y: 62 },
  { step: 3, stage: '打虎', text: '闪、躲、闪，赤手空拳打死大虫', pic: 'anhu', x: 63, y: 30 },
  { step: 4, stage: '下冈', text: '手脚疏软，一步步挨下冈子', pic: 'xiagang', x: 88, y: 72 },
];

/* 课后第 4 题：对武松的评价 */
const KINDS = ['勇敢豪爽', '要面子 · 鲁莽', '机敏谨慎'];
const SORT_ITEMS = [
  { s: '“要你扶的不算好汉。”', ok: ['勇敢豪爽', '要面子 · 鲁莽'], q: '豪爽自信，也逞强' },
  { s: '“你留我在家里歇，莫不半夜三更要谋我财，害我性命，却把大虫吓我？”', ok: ['要面子 · 鲁莽'], q: '把好心当恶意，不听劝告' },
  { s: '“我回去时，须吃他耻笑，不是好汉，难以转去。”', ok: ['要面子 · 鲁莽'], q: '怕被耻笑，很要面子' },
  { s: '“怕甚么！且只顾上去，看怎地！”', ok: ['勇敢豪爽', '要面子 · 鲁莽'], q: '明知山有虎，偏向虎山行' },
  { s: '武松见大虫扑来，只一闪，闪在大虫背后。', ok: ['机敏谨慎', '勇敢豪爽'], q: '临危不乱，身手敏捷' },
  { s: '武松将半截棒丢在一边，两只手就势把大虫顶花皮揪住，一按按将下来。', ok: ['勇敢豪爽', '机敏谨慎'], q: '赤手空拳，勇猛果断' },
  { s: '“天色看看黑了，倘或又跳出一只大虫来时，我却怎地斗得他过？”', ok: ['机敏谨慎'], q: '打完虎知道见好就收' },
];

/* 课后第 3 题：讲故事 */
const MOMENTS = [
  {
    name: '讲打虎 · 三闪', pic: 'hupu',
    prompt: '讲一讲大虫的“一扑、一掀、一剪”和武松的“三闪”。',
    hint: '用“说时迟，那时快”开头；大虫的动作讲得猛一点，武松的动作讲得快一点。',
    example: '说时迟，那时快！大虫两只爪子在地上一按，猛地扑过来。武松身子一闪，闪到了大虫背后。大虫看不见他，把腰一掀，武松一躲，又躲开了。大虫大吼一声，像打了个霹雳，把铁棒一样的尾巴竖起来一剪——武松又闪开了！三招都没抓着，大虫的劲儿先泄了一半。',
  },
  {
    name: '讲打虎 · 揪踢打', pic: 'anhu',
    prompt: '讲一讲梢棒折断后，武松怎样赤手空拳打死大虫。',
    hint: '抓住“揪、按、踢、打”四个动作；可以一边讲一边比画（只比画，别真动手）。',
    example: '武松抡起梢棒用尽力气劈下去——“咔嚓”，打在枯树上，棒断成两截！大虫又扑来，武松往后一跳，扔了半截棒，两手一把揪住大虫头顶的花皮，死死往下按，又抬脚朝它脸上、眼睛上乱踢。大虫扒出一个土坑，武松把它的嘴按进坑里，腾出右手，抡起铁锤一样的拳头，一下、两下……打了五七十拳，大虫再也不动了。',
  },
  {
    name: '演酒家劝酒', pic: 'jiudian',
    prompt: '和同桌演一演酒家劝武松别过冈的对话。',
    hint: '酒家：着急、好心；武松：不信、不耐烦，最后还冤枉人家。',
    example: '酒家（追出门，连连摆手）：客官，回来！前面冈上有只吊睛白额大虫，已经坏了三二十条人命了！\n武松（哈哈一笑）：我在这冈上走过一二十遭，几时见说有大虫！\n酒家（急得跺脚）：我是好意，你进来看官司榜文！\n武松（脸一沉）：莫不是你想半夜三更谋我财，害我性命？\n酒家（摇着头）：唉，一片好心当成恶意！你请便吧。',
  },
  {
    name: '武松读榜文时', pic: 'bangwen',
    prompt: '武松读了印信榜文，“方知端的有虎”。这时他心里在想什么？写下他的心里话。',
    hint: '想回去，又怕被耻笑；最后决定上冈。心里的话可以有好几次转折。',
    example: '原来真有老虎！要不……回酒店去？不行不行，我刚才还说“便有大虫，我也不怕”，现在灰溜溜回去，那酒家不笑掉大牙？我武松还算什么好汉！怕甚么，且只顾上去，看怎地！',
  },
];

/* 十二时辰钟：子时在正上方，顺时针；巳午未可过冈，寅卯申酉戌亥不许，子丑辰榜文没提 */
const SHICHEN = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const OK_SC = ['巳', '午', '未'];
const NO_SC = ['寅', '卯', '申', '酉', '戌', '亥'];
const CX = 200;
const CY = 200;
const R_OUT = 168;
const R_IN = 78;

function polar(r, deg) {
  const a = (deg * Math.PI) / 180;
  return [(CX + r * Math.sin(a)).toFixed(1), (CY - r * Math.cos(a)).toFixed(1)];
}

function buildShichen(svg) {
  const segs = SHICHEN.map((name, i) => {
    const a0 = i * 30 - 15;
    const a1 = a0 + 30;
    const [x0, y0] = polar(R_OUT, a0);
    const [x1, y1] = polar(R_OUT, a1);
    const [x2, y2] = polar(R_IN, a1);
    const [x3, y3] = polar(R_IN, a0);
    const kind = OK_SC.includes(name) ? 'ok' : NO_SC.includes(name) ? 'no' : 'na';
    const [tx, ty] = polar(R_OUT - 30, i * 30);
    const [hx, hy] = polar(R_IN + 20, i * 30);
    const h0 = (23 + i * 2) % 24;
    return `<path class="seg ${kind}" d="M${x0} ${y0} A${R_OUT} ${R_OUT} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${R_IN} ${R_IN} 0 0 0 ${x3} ${y3} Z"/>
      <text class="zh" x="${tx}" y="${ty}">${name}</text><text class="hr" x="${hx}" y="${hy}">${h0}–${(h0 + 2) % 24}点</text>`;
  }).join('');
  // 未末申初 ≈ 15 点：未、申交界（7.5 × 30°）。指针只画在中间的空心里，外圈用三角标出
  const [hx, hy] = polar(R_IN - 10, 225);
  const [t0x, t0y] = polar(R_OUT + 2, 225);
  const [t1x, t1y] = polar(R_OUT + 20, 219);
  const [t2x, t2y] = polar(R_OUT + 20, 231);
  svg.innerHTML = `${segs}
    <g data-step="2"><line class="hand" x1="${CX}" y1="${CY}" x2="${hx}" y2="${hy}"/><circle cx="${CX}" cy="${CY}" r="7" fill="#5c2a10"/>
      <polygon class="ptr" points="${t0x},${t0y} ${t1x},${t1y} ${t2x},${t2y}"/><text class="ptr-t" x="${+t1x - 4}" y="${Math.max(+t1y, +t2y) + 18}">未末申初</text></g>
    <text class="center" x="${CX}" y="${CY - 34}">一天</text><text class="center" x="${CX}" y="${CY - 12}">十二时辰</text>`;
}

/* 十八碗：data-bowls="步:碗数,…"，翻到哪一步显示到几碗 */
function updateBowls(slide, step) {
  const n = slide.querySelector('[data-bowls]');
  if (!n) return;
  let shown = 0;
  n.dataset.bowls.split(',').forEach((pair) => {
    const [s, v] = pair.split(':').map(Number);
    if (s <= step) shown = v;
  });
  if (n.textContent !== String(shown)) {
    n.textContent = shown;
    n.classList.remove('bump');
    void n.offsetWidth; // 重新触发动画
    n.classList.add('bump');
  }
}

function initFlips() {
  document.querySelectorAll('.flipbox').forEach((box) => {
    box.addEventListener('click', (e) => {
      const card = e.target.closest('.clue');
      if (card) card.classList.toggle('flipped');
    });
  });
}

buildShichen(document.getElementById('shichen')); // 在 deck.js 统计分步之前生成

window.LESSON = {
  init() {
    Narrative.init({ plot: PLOT, kinds: KINDS, sort: SORT_ITEMS, moments: MOMENTS });
    initFlips();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateBowls(slide, step);
  },
};
