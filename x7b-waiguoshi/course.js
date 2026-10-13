'use strict';
/* 外国诗二首 · 本课数据与专属互动：语气/时间高亮、分岔路行走、写法投票、背诵切换 */

const POEMS = {
  pushkin: {
    title: '假如生活欺骗了你', author: '［俄］普希金',
    lines: [
      { t: '假如生活欺骗了你，' }, { t: '不要悲伤，不要心急！' }, { t: '忧郁的日子里须要镇静：' }, { t: '相信吧，快乐的日子将会来临。' },
      { t: '心儿永远向往着未来；' }, { t: '现在却常是忧郁：' }, { t: '一切都是瞬息，一切都将会过去；' }, { t: '而那过去了的，就会成为亲切的怀恋。' },
    ],
  },
  frost: {
    title: '未选择的路', author: '［美］弗罗斯特',
    lines: [
      { t: '黄色的树林里分出两条路，' }, { t: '可惜我不能同时去涉足，' }, { t: '我在那路口久久伫立，' }, { t: '我向着一条路极目望去，' }, { t: '直到它消失在丛林深处。' },
      { t: '但我却选了另外一条路，' }, { t: '它荒草萋萋，十分幽寂，' }, { t: '显得更诱人，更美丽；' }, { t: '虽然在这条小路上，' }, { t: '很少留下旅人的足迹。' },
      { t: '那天清晨落叶满地，' }, { t: '两条路都未经脚印污染。' }, { t: '啊，留下一条路等改日再见！' }, { t: '但我知道路径延绵无尽头，' }, { t: '恐怕我难以再回返。' },
      { t: '也许多少年后在某个地方，' }, { t: '我将轻声叹息将往事回顾：' }, { t: '一片树林里分出两条路——' }, { t: '而我选择了人迹更少的一条，' }, { t: '从此决定了我一生的道路。' },
    ],
  },
};
Poem.render(POEMS); // 背诵挖空要用这份数据

const CLUES = [
  { q: '黄色的树林', a: '深秋的树林，美丽而宁静——可以看作人生旅途中的某一段风景。' },
  { q: '树林里分出两条路', a: '人生道路上的选择：两条路只能走一条，“可惜我不能同时去涉足”。' },
  { q: '久久伫立，极目望去', a: '选择前的犹豫和慎重：想看清一条路通向哪里，却只能望到“丛林深处”。' },
  { q: '荒草萋萋，人迹更少', a: '少有人走的路：更难，也更诱人——诗人选了需要勇气的那一条。' },
  { q: '落叶满地，未经脚印污染', a: '两条路都是新的：选择的时候，谁也不知道哪条路更好。' },
  { q: '轻声叹息将往事回顾', a: '多年后的感慨：对“未选择的路”有遗憾，也明白正是那次选择决定了一生。' },
];

const ROAD_SAY = {
  a: '人多的路更稳妥，很多人都走过，心里有底。诗人望了它很久，却选了另一条——读读第二节，看看他为什么。',
  b: '和诗人一样！荒草萋萋的路“很少留下旅人的足迹”，难走，却“更诱人，更美丽”。选它需要勇气。',
};

const VOTE_SAY = [
  '你喜欢直抒胸臆：话说得明白，读一遍就记住了，难过的时候拿来鼓励自己正合适。试着说说哪一句最打动你。',
  '你喜欢借形象说理：道理藏在树林和小路里，每个人都能读出自己的路。试着说说你从“未选择的路”里读到了什么。',
];

/* ---------- 分岔路：小人沿路走 ---------- */
// 每一步小人走到“荒草路”的几分之几（第 1 步停在两条路的公共起点：路口）
const WALK = [0, 0.14, 0.42, 0.6, 0.88];
let walkPos = { x: 200, y: 410 };
let walkTimer = 0;

function pointOn(at) {
  const path = document.querySelector('#roadSvg .road-b');
  const len = path.getTotalLength();
  const p = path.getPointAtLength(len * at);
  return { x: p.x, y: p.y };
}

function moveWalker(target) {
  const w = document.querySelector('#roadSvg .walker');
  const from = { ...walkPos };
  const start = performance.now();
  cancelAnimationFrame(walkTimer);
  const tick = (now) => {
    const k = Math.min(1, (now - start) / 1200);
    const e = 1 - (1 - k) ** 3;
    walkPos = { x: from.x + (target.x - from.x) * e, y: from.y + (target.y - from.y) * e };
    w.setAttribute('cx', walkPos.x.toFixed(1));
    w.setAttribute('cy', walkPos.y.toFixed(1));
    if (k < 1) walkTimer = requestAnimationFrame(tick);
  };
  walkTimer = requestAnimationFrame(tick);
}

function renderRoad(step) {
  const svg = document.getElementById('roadSvg');
  const s = Math.min(step, WALK.length - 1);
  for (let k = 0; k < WALK.length; k += 1) svg.classList.toggle(`st${k}`, k === s);
  moveWalker(pointOn(WALK[s]));
  document.querySelectorAll('#stanzas .stz').forEach((z, k) => z.classList.toggle('cur', k === s - 1));
}

function buildWoods() {
  const svg = document.getElementById('roadSvg');
  // 固定伪随机：每次打开树的位置一样
  let seed = 7;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const trees = [];
  for (let i = 0; i < 46; i += 1) {
    const x = rnd() * 400;
    const y = rnd() * 400;
    const nearA = Math.abs(x - (150 - (y - 280) * 0.1)) < 40 && y > 80;
    const nearB = Math.abs(x - (260 + (300 - y) * 0.2)) < 40 && y > 80;
    if (nearA || nearB || (y > 330 && Math.abs(x - 200) < 50)) continue;
    const r = 10 + rnd() * 14;
    const c = ['#d9962e', '#e8b33f', '#c9822a', '#f0c55a'][i % 4];
    trees.push(`<line x1="${x.toFixed(0)}" y1="${(y + r * 0.6).toFixed(0)}" x2="${x.toFixed(0)}" y2="${(y + r * 1.6).toFixed(0)}" stroke="#7a5230" stroke-width="3"/><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(0)}" fill="${c}"/>`);
  }
  svg.querySelector('.trees').innerHTML = trees.join('');
  const leaves = [];
  for (let i = 0; i < 40; i += 1) {
    const x = (120 + rnd() * 200).toFixed(0);
    const y = (120 + rnd() * 290).toFixed(0);
    leaves.push(`<ellipse cx="${x}" cy="${y}" rx="3" ry="1.8" fill="#c0612b" transform="rotate(${(rnd() * 180).toFixed(0)} ${x} ${y})" opacity=".7"/>`);
  }
  svg.querySelector('.leaves').innerHTML = leaves.join('');
}

function initRoad() {
  buildWoods();
  const w = document.querySelector('#roadSvg .walker');
  w.setAttribute('cx', walkPos.x);
  w.setAttribute('cy', walkPos.y);
  document.querySelector('.pick-road').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-road]');
    if (!btn) return;
    document.querySelectorAll('.pick-road .btn').forEach((b) => b.classList.toggle('solid', b === btn));
    const say = document.getElementById('roadSay');
    say.textContent = ROAD_SAY[btn.dataset.road];
    say.hidden = false;
  });
}

/* ---------- 语气 / 时间高亮 ---------- */
function initPoster() {
  document.querySelector('.s-pushkin .btns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-hl]');
    if (!btn) return;
    const on = document.getElementById('poster').classList.toggle(`hl-${btn.dataset.hl}`);
    btn.classList.toggle('solid', on);
  });
}

function initVote() {
  document.querySelector('.ways').addEventListener('click', (e) => {
    const btn = e.target.closest('.vote');
    if (!btn) return;
    document.querySelectorAll('.way').forEach((w) => w.classList.toggle('voted', w.contains(btn)));
    document.getElementById('voteSay').textContent = VOTE_SAY[+btn.dataset.vote];
  });
}

function initReciteTabs() {
  const tabs = document.getElementById('reciteTabs');
  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-tab]');
    if (!btn) return;
    tabs.querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b === btn));
    document.querySelectorAll('.s-recite .recite').forEach((r, i) => { r.hidden = i !== +btn.dataset.tab; });
  });
}

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: ['诗里的形象', '可以这样理解'] });
    Poem.init();
    initPoster();
    initRoad();
    initVote();
    initReciteTabs();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-road')) renderRoad(step);
  },
};
