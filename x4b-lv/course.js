'use strict';
/* 绿 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课专属：第 2 节色板、“所有的绿集中起来”叶子动画（集中 → 挤 → 重叠 → 交叉 → 随风整齐飘动）。
 */

/* ================= 色板：诗里的八种绿 ================= */
const GREENS = [
  { w: '墨绿', c: '#1f3d2b', like: '像松针、像深山里的老树，绿得像墨。' },
  { w: '浅绿', c: '#a8d5a2', like: '像刚冒出来的小草，浅浅的。' },
  { w: '嫩绿', c: '#b5e061', like: '像柳树的新芽，嫩得能掐出水。' },
  { w: '翠绿', c: '#2e9e4f', like: '像竹叶、像翡翠，绿得发亮。' },
  { w: '淡绿', c: '#cfe8c8', like: '像远处的山，像蒙了一层薄雾。' },
  { w: '粉绿', c: '#a8dcc4', like: '绿里带点白，像荷叶背面、像嫩豌豆。' },
  { w: '绿得发黑', c: '#0f2a1a', like: '树林最深的地方，绿得快成黑色了。' },
  { w: '绿得出奇', c: '#3fd17a', like: '雨后的叶子，绿得亮极了，让人吃惊。' },
];
// 课文第 2 节的分行：墨绿、浅绿、嫩绿、/ 翠绿、淡绿、粉绿……/ 绿得发黑、绿得出奇。
const SB_LINES = [[0, 1, 2], [3, 4, 5], [6, 7]];
const SB_PUNCT = [['、', '、', '、'], ['、', '、', '……'], ['、', '。']];

function initSeban() {
  const btn = (i) => `<button class="sb-w" type="button" data-i="${i}" style="--c:${GREENS[i].c}">${GREENS[i].w}</button>`;
  SB_LINES.forEach((line, k) => {
    document.getElementById(`sbLine${k + 1}`).innerHTML = line.map((i, j) => btn(i) + SB_PUNCT[k][j]).join('');
  });
  const seen = new Set();
  document.querySelector('.s-seban').addEventListener('click', (e) => {
    const b = e.target.closest('.sb-w');
    if (!b) return;
    const g = GREENS[+b.dataset.i];
    seen.add(b.dataset.i);
    document.querySelectorAll('.sb-w').forEach((x) => x.classList.toggle('sel', x === b));
    b.classList.add('seen');
    const big = document.getElementById('sbBig');
    big.style.setProperty('--c', g.c);
    big.classList.toggle('dark', ['#1f3d2b', '#0f2a1a', '#2e9e4f'].includes(g.c));
    document.getElementById('sbName').textContent = g.w;
    document.getElementById('sbLike').textContent = g.like;
    document.getElementById('sbN').textContent = seen.size;
  });
}

/* ================= 叶子动画：每一步一个状态 ================= */
const LEAF_N = 40;
const CX = 400;
const CY = 230;
// 固定种子的伪随机，保证每次打开排布一样
let seed = 7;
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const LEAVES = Array.from({ length: LEAF_N }, (_, i) => ({
  x: 40 + rnd() * 720, y: 60 + rnd() * 360, r: rnd() * 360, a: rnd() * Math.PI * 2, d: Math.sqrt(rnd()),
  c: GREENS[i % 6].c, s: .8 + rnd() * .6,
}));
// 每一步：半径（越来越小 = 越来越挤）、叶子大小、是否交叉、是否跳舞
const STATES = [
  { rad: 0 }, { rad: 170, s: 1 }, { rad: 105, s: 1.15 }, { rad: 70, s: 1.25, over: true }, { rad: 70, s: 1.25, over: true, cross: true }, { s: 1, dance: true },
];

function drawLeaves() {
  document.getElementById('jzLeaves').innerHTML = LEAVES.map((l) =>
    `<g class="lf"><path class="blade" d="M0 0 C 14 -12, 14 -44, 0 -62 C -14 -44, -14 -12, 0 0 Z" fill="${l.c}"/><path class="vein" d="M0 -4 L0 -56"/></g>`).join('');
}

function placeLeaves(step) {
  const st = STATES[Math.min(step, STATES.length - 1)];
  const svg = document.getElementById('jzSvg');
  svg.classList.toggle('over', Boolean(st.over));
  svg.classList.toggle('dance', Boolean(st.dance));
  document.querySelectorAll('#jzLeaves .lf').forEach((g, i) => {
    const l = LEAVES[i];
    let x = l.x;
    let y = l.y;
    let r = l.r;
    if (st.dance) {
      // 跳舞：排成整齐的队伍，一齐摆动（“整齐地按着节拍”）
      x = 130 + (i % 8) * 77;
      y = 120 + Math.floor(i / 8) * 72;
      r = 0;
    } else if (st.rad) {
      x = CX + Math.cos(l.a) * l.d * st.rad * 1.5;
      y = CY + 40 + Math.sin(l.a) * l.d * st.rad;
      r = st.cross ? (i % 2 ? 40 : -40) : l.r;
    }
    g.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${r.toFixed(0)}deg) scale(${st.dance ? 1 : (st.s || 1) * l.s})`;
  });
}
drawLeaves();

const PICKS = {
  feel: [
    { t: '充满活力', ok: true, why: '绿“飘动”起来了' },
    { t: '整齐、有节奏', ok: true, why: '“按着节拍”' },
    { t: '快乐', ok: true, why: '像在跳舞' },
    { t: '美', ok: true, why: '一大片绿一齐摆动' },
    { t: '乱糟糟', ok: false, why: '是“整齐地”飘动' },
    { t: '害怕', ok: false, why: '风很温柔，像舞蹈教练' },
  ],
};

const MOMENTS = [
  { name: '金黄', pic: 'lv1', prompt: '秋天到了，到处是金黄的……学着写一写。', hint: '可以写：到处是____的……　刮的风是____的……',
    example: '好像谁打翻了一罐蜂蜜，\n到处是金黄的……\n稻田是金黄的，\n银杏叶是金黄的，\n连麻雀的叫声也是金黄的。' },
  { name: '雪白', pic: 'lv3', prompt: '下雪了，什么都是白的。', hint: '学“……是白的”的反复，最后一行来点想象。',
    example: '屋顶是白的，\n小路是白的，\n大树戴着白帽子，\n我呼出的气也是白的。' },
  { name: '我自己选', pic: 'lv4', prompt: '你最喜欢什么颜色？在哪里见过“到处都是”这种颜色？', hint: '记得分行，每行不要太长。',
    example: '……' },
];

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    initSeban();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-jizhong')) placeLeaves(step);
  },
};
