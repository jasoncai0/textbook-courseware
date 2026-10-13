'use strict';
/* 爬山虎的脚（四上 10）· 本课数据与互动。翻卡、读写练习见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

const NS = 'http://www.w3.org/2000/svg';

/* ================= 课后第 1 题 · 一墙叶子：颜色变化、叶尖朝下、铺得均匀、风吹波纹 ================= */
const LEAF = 'M0 24 C -16 12, -27 -4, -18 -16 C -10 -26, -2 -20, 0 -12 C 2 -20, 10 -26, 18 -16 C 27 -4, 16 12, 0 24 Z';
const LEAF_COLS = 12;
const LEAF_ROWS = 9;
function buildLeafWall() {
  const svg = document.getElementById('leafWall');
  let leaves = '';
  for (let r = 0; r < LEAF_ROWS; r += 1) {
    for (let c = 0; c < LEAF_COLS; c += 1) {
      const x = c * 52 + (r % 2 ? 26 : 0) + 4;
      const y = r * 40 + 20;
      leaves += `<g transform="translate(${x} ${y})"><path class="lf" d="${LEAF}" style="animation-delay:${(c * 0.12 + r * 0.04).toFixed(2)}s"/></g>`;
    }
  }
  svg.innerHTML = `<defs><clipPath id="lwClip"><rect width="600" height="360" rx="14"/></clipPath>
    <pattern id="lwBrick" width="60" height="30" patternUnits="userSpaceOnUse"><rect width="60" height="30" fill="#b9aa98"/><path d="M0 0 H60 M0 15 H60 M30 0 V15 M0 15 V30" stroke="#9c8c78" stroke-width="2"/></pattern></defs>
    <g clip-path="url(#lwClip)"><rect width="600" height="360" fill="url(#lwBrick)"/>${leaves}</g>`;
}
function initLeafBtns() {
  const svg = document.getElementById('leafWall');
  document.querySelector('.leaf-btns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-leaf]');
    if (!b) return;
    svg.setAttribute('class', `lw-${b.dataset.leaf}`);
    document.querySelectorAll('.leaf-btns .btn').forEach((x) => x.classList.toggle('solid', x === b));
  });
}

/* ================= 课后第 2 题 · 触—巴—拉—贴 =================
 * 墙在 x=400；茎原来在 x=330，拉过去到 370，贴紧到 388。c0~c5 是六个状态（c5 = 一脚一脚往上爬） */
const WALL_X = 398;
const FOOT_Y = 228;
const TOE_Y = [192, 206, 220, 236, 250, 264];
const STEM_X = { short: 330, long: 330, bentA: 370, bentB: 388 };

function threads(kind, footY = FOOT_Y) {
  const sx = STEM_X[kind];
  return TOE_Y.map((ty) => {
    const y = footY + (ty - FOOT_Y);
    if (kind === 'short') return `<path d="M${sx} ${footY} L${sx + 30} ${(footY + (y - footY) * .55).toFixed(0)}"/>`;
    if (kind === 'long') return `<path d="M${sx} ${footY} L${WALL_X} ${y}"/>`;
    const mx = (sx + WALL_X) / 2;
    const bulge = (y - footY) * 1.4 + (y < footY ? -10 : 10);
    return `<path d="M${sx} ${footY} Q${mx} ${(footY + bulge).toFixed(0)} ${WALL_X} ${y}"/>`;
  }).join('');
}
const discs = (footY = FOOT_Y) => TOE_Y.map((ty) => `<ellipse cx="${WALL_X + 3}" cy="${footY + ty - FOOT_Y}" rx="4" ry="6.5"/>`).join('');

function buildClimb() {
  const svg = document.getElementById('climbSvg');
  const leaf = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="${LEAF}" fill="#58a14a"/></g>`;
  svg.innerHTML = `<defs><clipPath id="clClip"><rect width="600" height="400" rx="14"/></clipPath>
    <pattern id="clBrick" width="70" height="36" patternUnits="userSpaceOnUse"><rect width="70" height="36" fill="#c4b5a2"/><path d="M0 0 H70 M0 18 H70 M35 0 V18 M0 18 V36" stroke="#a49380" stroke-width="2"/></pattern></defs>
    <g clip-path="url(#clClip)">
      <rect width="600" height="400" fill="#eef3ea"/>
      <rect x="${WALL_X + 2}" width="${600 - WALL_X}" height="400" fill="url(#clBrick)"/>
      <text class="t-l t-c" x="${(600 + WALL_X) / 2}" y="40" fill="#6b5a46">墙</text>
      <g class="cl-stem">
        <path d="M330 400 C 326 340, 334 290, 330 228 S 326 140, 330 70" fill="none" stroke="#9b4a3a" stroke-width="9" stroke-linecap="round"/>
        <path d="M330 228 l-34 -20" stroke="#b8604a" stroke-width="5"/>${leaf(286, 200, 1.4)}
        <path d="M330 130 l-34 -20" stroke="#b8604a" stroke-width="5"/>${leaf(286, 102, 1.2)}
        <path d="M330 320 l-34 -20" stroke="#b8604a" stroke-width="5"/>${leaf(286, 292, 1.4)}
      </g>
      <g class="th th-short">${threads('short')}</g>
      <g class="th th-long">${threads('long')}</g>
      <g class="th th-bentA">${threads('bentA')}</g>
      <g class="th th-bentB">${threads('bentB')}</g>
      <g class="discs">${discs()}</g>
      <g class="up"><g class="th">${threads('bentB', 130)}</g><g class="discs">${discs(130)}</g></g>
      <g class="cl-tag tag1"><rect x="40" y="340" width="180" height="40" rx="20"/><text class="t-l t-c" x="130" y="368">① 触着墙</text></g>
      <g class="cl-tag tag2"><rect x="40" y="340" width="180" height="40" rx="20"/><text class="t-l t-c" x="130" y="368">② 巴住墙</text></g>
      <g class="cl-tag tag3"><rect x="40" y="340" width="180" height="40" rx="20"/><text class="t-l t-c" x="130" y="368">③ 拉一把</text></g>
      <g class="cl-tag tag4"><rect x="40" y="340" width="180" height="40" rx="20"/><text class="t-l t-c" x="130" y="368">④ 紧贴墙</text></g>
      <g class="cl-tag tag5"><rect x="40" y="340" width="180" height="40" rx="20"/><text class="t-l t-c" x="130" y="368">一脚一脚往上爬</text></g>
      <path class="cl-up" d="M470 300 V120" stroke="#d9a520" stroke-width="8" stroke-linecap="round"/><path class="cl-up" d="M450 140 L470 110 L490 140" fill="none" stroke="#d9a520" stroke-width="8" stroke-linecap="round"/>
    </g>`;
}
function setClimb(c) {
  document.getElementById('climbSvg').setAttribute('class', `c${c}`);
  document.querySelectorAll('.verb').forEach((v) => v.classList.toggle('on-verb', +v.dataset.c <= c));
}
function initClimbBtns() {
  document.querySelector('.s-climb').addEventListener('click', (e) => {
    const b = e.target.closest('[data-c]');
    if (b) setClimb(+b.dataset.c);
  });
}

/* ================= 课后第 3 题 · 换个说法 ================= */
const CLUE_LABELS = ['换个说法', '原文 · 好在哪'];
const CLUES = [
  { q: '叶尖都朝下。', a: '原文：叶尖<b>一顺儿</b>朝下。——全都朝着一个方向，整整齐齐，说得更准确。' },
  { q: '一阵风拂过，一墙的叶子就动了起来。', a: '原文：一墙的叶子就<b>漾起波纹</b>。——像水面一样一层层波动，一下子就看见了。' },
  { q: '六七根细丝的头上就变成小圆片，粘住墙。', a: '原文：<b>巴住</b>墙。——像小手紧紧抓住一样，又准确又形象。' },
  { q: '细丝弯曲了，把嫩茎拽过去。', a: '原文：把爬山虎的嫩茎<b>拉一把</b>，使它<b>紧贴</b>在墙上。——拉一把、紧贴，动作清清楚楚。' },
  { q: '那些细小的脚很好看。', a: '原文：你会想起图画上<b>蛟龙的爪子</b>。——一比喻，脚的样子就活了。' },
  { q: '那些脚巴在墙上很牢固。', a: '原文：要是你的手指不费一点儿劲，<b>休想</b>拉下爬山虎的一根茎。——到底有多牢固，一试就知道。' },
];

/* ================= 读与写 · 观察记录 ================= */
const MOMENTS = [
  {
    name: '图文结合', pic: 'jiao',
    prompt: '选一种植物（豆芽、蒜苗、一盆花……），连续观察几天，画一画、写一写它的变化。',
    hint: '每次都写上日期；写颜色、大小、形状的变化；可以配一幅小图。',
    example: '9 月 10 日：蒜瓣顶上冒出了一点嫩黄的芽尖，只有米粒那么大。9 月 13 日：芽长到一指高了，颜色变成了嫩绿色。9 月 17 日：蒜苗已经有筷子那么长，叶子扁扁的，顶上有点儿弯。',
  },
  {
    name: '做表格', pic: 'qiang',
    prompt: '用表格记录：日期、高度（长度）、颜色、其他发现。',
    hint: '表格一目了然：每一行是一次观察，数据要量一量、数一数。',
    example: '观察对象：绿豆芽。9 月 10 日｜约 2 毫米｜白色｜豆子裂开了口。9 月 12 日｜约 2 厘米｜白色｜长出细细的根。9 月 15 日｜约 6 厘米｜顶上发绿｜两片小叶子张开了。',
  },
  {
    name: '学用准确的动词', pic: 'yuanpian',
    prompt: '学课文用“触、巴、拉、贴”，写一写牵牛花（或丝瓜）的藤是怎样往上爬的。',
    hint: '先仔细看，再用几个准确的动词，按顺序写。',
    example: '牵牛花的藤顶端先在空中慢慢转圈，一碰到竹竿，就缠上去，绕了一圈又一圈，越缠越紧，再往上一探，又缠住了。就这样，它一圈一圈地爬到了竹竿顶上。',
  },
];

function initCells() {
  document.addEventListener('click', (e) => {
    const cell = e.target.closest('.cell');
    if (cell) cell.classList.toggle('open');
  });
}

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    buildLeafWall();
    initLeafBtns();
    buildClimb();
    initClimbBtns();
    initCells();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.querySelector('#climbSvg')) setClimb(step);
  },
};
