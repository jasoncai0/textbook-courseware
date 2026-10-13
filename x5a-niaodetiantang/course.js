'use strict';
/* 鸟的天堂（五上 23）· 本课数据与动画。故事页、翻卡、朗读、写话见 ../shared/narrative.js */

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const GREENS = ['#3f7d3a', '#4f8f45', '#5fa452', '#376f33', '#6db35c'];
const BIRD_COLORS = ['#2a2420', '#3b3b3b', '#7a4a2a', '#c0612a', '#2f4f7a', '#f2f2f2'];
const NS = 'http://www.w3.org/2000/svg';

/* 大榕树的树冠：在椭圆里撒一簇簇绿叶 */
function canopyCircles(n, cx, cy, rx, ry, cls = '') {
  return Array.from({ length: n }, (_, i) => {
    const a = rand(0, Math.PI * 2);
    const r = Math.sqrt(Math.random());
    const x = cx + Math.cos(a) * rx * r;
    const y = cy + Math.sin(a) * ry * r;
    return `<circle class="${cls}" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${rand(18, 34).toFixed(0)}" fill="${pick(GREENS)}" style="animation-delay:${(i * 0.04).toFixed(2)}s"/>`;
  }).join('');
}

function birdHtml(color, dx, dy, dur, delay, cls = 'bird') {
  return `<g class="${cls}" style="--dx:${dx.toFixed(0)}px;--dy:${dy.toFixed(0)}px;animation-duration:${dur.toFixed(1)}s;animation-delay:${delay.toFixed(2)}s">
    <path class="wing" d="M-10 0 q5 -8 10 0 q5 -8 10 0" stroke="${color}" stroke-width="3.2" fill="none" stroke-linecap="round" style="animation-delay:${rand(0, .3).toFixed(2)}s"/></g>`;
}

/* 静：枝干、气根、绿叶、颤动的光 */
function buildTreeStill() {
  const svg = document.getElementById('treeStill');
  svg.querySelector('.branches').innerHTML = Array.from({ length: 14 }, (_, i) => {
    const x0 = 290 + (i % 2) * 30;
    const ang = -Math.PI + (i + 0.5) * Math.PI / 14;
    const len = rand(110, 200);
    const x1 = x0 + Math.cos(ang) * len;
    const y1 = 175 + Math.sin(ang) * len * 0.55;
    return `<path class="draw" pathLength="1" d="M${x0} 185 Q${((x0 + x1) / 2).toFixed(0)} ${(y1 - 30).toFixed(0)} ${x1.toFixed(0)} ${y1.toFixed(0)}" stroke="#6b4a32" stroke-width="${rand(3, 7).toFixed(1)}" fill="none" style="transition-delay:${(i * 0.08).toFixed(2)}s"/>`;
  }).join('');
  svg.querySelector('.roots').innerHTML = Array.from({ length: 18 }, (_, i) => {
    const x = 120 + i * 21 + rand(-6, 6);
    const y0 = 150 + Math.abs(x - 305) * 0.28;
    return `<path class="draw" pathLength="1" d="M${x.toFixed(0)} ${y0.toFixed(0)} V300" stroke="#8a6a4a" stroke-width="2" style="transition-delay:${(i * 0.07).toFixed(2)}s"/>`;
  }).join('');
  svg.querySelector('.leaves').innerHTML = canopyCircles(46, 305, 140, 230, 75, 'pop');
  svg.querySelector('.shimmer').innerHTML = Array.from({ length: 24 }, () =>
    `<ellipse cx="${rand(100, 510).toFixed(0)}" cy="${rand(80, 200).toFixed(0)}" rx="5" ry="2.5" fill="#e9ffd0" style="animation-delay:${rand(0, 2).toFixed(2)}s"/>`).join('');
}

/* 动：树冠、一只 → 第二只、第三只 → 到处都是 → 站着叫的、扑翅膀的 */
function buildTreeBirds() {
  const svg = document.getElementById('treeBirds');
  svg.querySelector('.canopy').innerHTML = canopyCircles(44, 305, 145, 230, 75);
  const flyer = (step, x, y, color, dx, dy) => `<g data-step="${step}"><g transform="translate(${x} ${y})">${birdHtml(color, dx, dy, rand(2.5, 4), rand(0, .6))}</g></g>`;
  const first = flyer(2, 300, 110, '#2a2420', -180, -80);
  const next = flyer(3, 240, 130, '#7a4a2a', 160, -70) + flyer(3, 380, 120, '#2f4f7a', 120, -60);
  const many = `<g data-step="4">${Array.from({ length: 22 }, () => {
    const x = rand(100, 500);
    const y = rand(80, 200);
    return `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})">${birdHtml(pick(BIRD_COLORS), rand(-200, 200), rand(-140, -20), rand(2, 4.5), rand(0, 2))}</g>`;
  }).join('')}</g>`;
  svg.querySelector('.flock').innerHTML = first + next + many;
  svg.querySelector('.perched').innerHTML = Array.from({ length: 10 }, (_, i) => {
    const x = rand(110, 500);
    const y = rand(110, 210);
    const c = pick(BIRD_COLORS);
    const big = i % 3 === 0 ? 1.4 : 1;
    return `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${big})"><ellipse rx="9" ry="6" fill="${c}"/><circle cx="8" cy="-5" r="4.5" fill="${c}"/><path d="M12 -5 l5 1 l-5 1 Z" fill="#e0a020"/>${i % 2 ? `<path class="flap" d="M-2 -3 l-12 -10" stroke="${c}" stroke-width="4" stroke-linecap="round"/>` : ''}</g>`;
  }).join('');
}

/* 故事页：满屏飞鸟 */
function buildSceneBirds() {
  const svg = document.querySelector('.s-birds .fx-birds');
  svg.innerHTML = Array.from({ length: 34 }, () => {
    const x = rand(150, 1450);
    const y = rand(120, 520);
    return `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${rand(1.4, 2.6).toFixed(1)})">${birdHtml(pick(['#1e1a16', '#2a2a2a', '#4a3020']), rand(-160, 160), rand(-90, 30), rand(2.5, 5), rand(0, 3))}</g>`;
  }).join('');
}

/* 拍拍手：飞出几只鸟，飞走后移除 */
const CLAP_BIRDS = 4;
const CLAP_LIFE_MS = 3200;
function clap() {
  const flock = document.querySelector('#treeBirds .flock');
  const g = document.createElementNS(NS, 'g');
  g.innerHTML = Array.from({ length: CLAP_BIRDS }, () => {
    const x = rand(150, 460);
    const y = rand(100, 200);
    return `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})">${birdHtml(pick(BIRD_COLORS), rand(-260, 260), rand(-220, -140), rand(2, 3), 0, 'bird once')}</g>`;
  }).join('');
  flock.appendChild(g);
  setTimeout(() => g.remove(), CLAP_LIFE_MS);
}

// 在 deck.js 统计分步之前生成（飞鸟带 data-step）
buildTreeStill();
buildTreeBirds();
buildSceneBirds();

/* 课后第 1 题 */
const CLUE_LABELS = ['想一想', '课文里说'];
const CLUES = [
  { q: '第一次傍晚经过，作者看见鸟了吗？', a: '“却不见一只鸟的影子”，他不禁想：“鸟的天堂”里没有一只鸟。' },
  { q: '第二次早晨经过，作者看见了什么？', a: '“到处都是鸟声，到处都是鸟影”，眼睛“应接不暇”。' },
  { q: '鸟儿为什么喜欢这株大榕树？', a: '树大、枝叶茂盛，河边湿润；“农民不许人去捉它们”——这里安全又舒适。' },
  { q: '“昨天是我的眼睛骗了我”是什么意思？', a: '傍晚鸟儿都回巢歇息了，所以看不见；其实树上一直有许许多多的鸟。' },
];

/* 读与写：静态与动态 */
const MOMENTS = [
  {
    name: '一棵树（静态）', pic: 'rongshu',
    prompt: '选一棵你熟悉的树（校园的、小区的），写写它的样子。',
    hint: '学课文第 7—8 段：由远到近，写枝干、叶子、颜色；用一个比喻写出它的特点。',
    example: '校门口有一棵老槐树。远远望去，它像一把撑开的绿色大伞。走近了，才看清它的树干要两个人才抱得过来，树皮裂成一块一块的。枝上的叶子密密层层，阳光只能从缝隙里漏下几个光斑。',
  },
  {
    name: '一群小鸟（动态）', pic: 'qunniao',
    prompt: '写一群活动着的小动物：麻雀、鸽子、小鸡、小鱼都可以。',
    hint: '学课文第 12 段：由少到多，用“有的……有的……有的……”写出它们各自的动作。',
    example: '我把一把米撒在地上。先是一只麻雀试探着落下来，啄了一粒就飞走了。不一会儿，呼啦啦飞来一大群。有的低着头啄米，有的蹦来蹦去抢地盘，有的站在电线上叽叽喳喳地叫，好像在喊同伴快来。',
  },
  {
    name: '一只小鸟（特写）', pic: 'huamei',
    prompt: '盯住一只小鸟或小动物，写写它一连串的动作。',
    hint: '学“画眉”那一句：飞出来 → 被吓 → 飞进叶丛 → 站在小枝上叫。动作一个接一个。',
    example: '一只小松鼠从树洞里探出头，左右看了看，“嗖”地窜上树枝。它抱着一颗松果，用牙飞快地啃着，听见脚步声，尾巴一甩，又躲回了树洞里。',
  },
  {
    name: '日落即景（写变化）', pic: 'bangwan',
    prompt: '单元习作“即景”：写一次日落，写出景物的变化。',
    hint: '写太阳形状、颜色的变化，写晚霞和河面颜色的变化。按时间顺序写。',
    example: '太阳慢慢往山后沉，先是一个红红的圆盘，接着被山尖咬去一角，变成半个，最后只剩一条金边。天边的云从金黄变成橘红，又变成紫红。河面也跟着变了颜色，像铺了一匹彩色的绸子。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    document.getElementById('clapBtn').addEventListener('click', clap);
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
