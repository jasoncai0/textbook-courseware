'use strict';
/* 父爱之舟 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 课后第 1 题 · 小船驶过的梦中场景：t 为在河道上的位置（0~1），up 为标签在上方 */
const STOPS = [
  { t: 0.05, name: '卖茧子', sub: '父亲给我买枇杷', up: true },
  { t: 0.19, name: '住小客栈', sub: '不肯加钱换房间', up: false },
  { t: 0.33, name: '逛庙会', sub: '凉粽子 · 热豆腐脑 · 万花筒', up: true },
  { t: 0.47, name: '背我上学', sub: '大黄油布雨伞', up: true },
  { t: 0.6, name: '缴学费', sub: '第一次心酸的哭', up: false },
  { t: 0.76, name: '小船送考', sub: '夜里轮换摇橹', up: false },
  { t: 0.93, name: '船舱缝被', sub: '弯腰低头的背影', up: false },
];
const LABEL_GAP = 26;

function initRiver(svg) {
  const path = svg.querySelector('#riverPath');
  const len = path.getTotalLength();
  const pts = STOPS.map((s) => path.getPointAtLength(len * s.t));
  svg.querySelector('#stops').innerHTML = STOPS.map((s, i) => {
    const { x, y } = pts[i];
    const ty = s.up ? y - LABEL_GAP - 18 : y + LABEL_GAP + 6;
    return `<g data-step="${i + 1}"><circle class="stop" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="7"/>
      <text class="t-m t-c stop-name" x="${x.toFixed(0)}" y="${ty.toFixed(0)}">${s.name}</text>
      <text class="t-s t-c stop-sub" x="${x.toFixed(0)}" y="${(ty + 18).toFixed(0)}">${s.sub}</text></g>`;
  }).join('');
  return { path, len, pts };
}

let river = null;
function moveBoat(step) {
  const k = Math.min(step, STOPS.length);
  const p = k ? river.pts[k - 1] : river.path.getPointAtLength(0);
  river.boat.style.transform = `translate(${p.x.toFixed(0)}px, ${(p.y - 8).toFixed(0)}px)`;
}

/* 场景与细节里的父爱 */
const CLUE_LABELS = ['场景 · 细节', '藏着的感情'];
const CLUES = [
  { q: '小客栈：父亲心疼极了，叫来茶房，掀开席子让他看满床乱爬的臭虫和我身上的疙瘩……父亲动心了。', a: '一分冤枉钱也不肯花的父亲，为了儿子<b>愿意加钱</b>；“我”心疼父亲，<b>不肯</b>换房。' },
  { q: '庙会：父子俩坐下吃凉粽子……领我到小摊上吃了碗热豆腐脑，我叫他也吃，他就是不吃。', a: '自己舍不得，<b>怕委屈了“我”</b>——热闹的庙会里，流露着父子之间的温情。' },
  { q: '回家后他用几片玻璃和彩色纸屑等糊了一个万花筒，这便是我童年唯一的也是最珍贵的玩具了。', a: '没钱买玩具，父亲<b>懂“我”的心思</b>，亲手做了一个——“最珍贵”。' },
  { q: '他扎紧裤脚，穿一双深筒钉鞋，将棉袍的下半截撩起扎在腰里……父亲便背着我上学。', a: '风雨无阻，<b>盼“我”念好书</b>。这些细节“我”记了一辈子。' },
];

/* 读与写 */
const MOMENTS = [
  { name: '写一个场景', pic: 'beishang',
    prompt: '选一个你和爸爸或妈妈在一起的场景，把它写下来，让感情藏在场景里。',
    hint: '先写清在哪儿、周围是什么样子，再放大一两个细节（一个动作、一样东西），不直接说“我很感动”。',
    example: '那天放学，雨下得很大。校门口挤满了接孩子的家长，伞挨着伞。我一眼就看见了爸爸——他站在最外面，伞全歪在我这边，他的半边肩膀湿透了，头发上还滴着水。他把伞往我头上一罩：“走，回家。”' },
  { name: '我的“新滋味”', pic: 'xiaochuan',
    prompt: '语文园地：仿照“这是我第一次真正心酸的哭，与……都大不一样”，写一写你成长中的“第一次”。',
    hint: '把这一次和以前的同类经历比一比，写出“不一样”在哪里。',
    example: '这是我第一次真正自己做的早饭，与以前帮妈妈递个碗、剥个蒜都大不一样。看着爸爸妈妈把有点儿煎煳的鸡蛋吃得干干净净，我尝到了一种新滋味。' },
  { name: '我想对您说', pic: 'fengbei',
    prompt: '本单元习作“我想对您说”：给爸爸或妈妈写几句心里话。',
    hint: '回忆一件你们之间难忘的事，说出你的感受和想法。',
    example: '爸爸：您还记得那个下大雨的傍晚吗？您的半边肩膀全湿了，却笑着说“没事”。那天我就想对您说：谢谢您，以后下雨，我们一起打一把伞，伞要放在中间。' },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    const svg = document.getElementById('river');
    river = { ...initRiver(svg), boat: svg.querySelector('#boat') };
    moveBoat(0);
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.querySelector('#river')) moveBoat(step);
  },
};
