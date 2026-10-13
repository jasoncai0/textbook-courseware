'use strict';
/* 巨人的花园（四下 27）· 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课独有：花园四季开关——按巨人的做法切换：砌墙→冬天，孩子钻进小洞→春天（角落仍是冬天），拆墙→春天永远留下。 */

const TREES = [110, 250, 420, 600];
const CORNER_TREE = 3;
const KID_COLORS = ['#e2725b', '#5b8fd6', '#f2b84b', '#8cc072', '#b07cc6', '#ef8fb0'];
const KIDS_AT = {
  in: [[80, 385], [160, 365], [230, 392], [330, 372], [400, 388], [480, 368]],
  out: [[60, 438], [120, 440], [190, 438], [400, 440], [460, 438], [530, 440]],
  tree: [[95, 212], [125, 200], [238, 196], [266, 206], [408, 208], [436, 198]],
  giant: [[512, 270], [568, 270], [490, 408], [592, 408], [450, 400], [628, 404]],
};
const BOY_AT = { in: [300, 398], out: [590, 436], corner: [596, 388], tree: [600, 218], giant: [540, 236] };
const GIANT_AT = [540, 300];

const STATES = [
  { b: '孩子们来玩', spring: true, kids: 'in', boy: 'in', giant: 'away',
    g: '春天：柔嫩的青草，星星似的花朵，桃树开满鲜花，小鸟唱歌', gi: '离家看朋友去了', q: '“我们在这儿多么快乐！”孩子们欢叫着。' },
  { b: '叱责 · 砌墙', wall: true, weather: true, kids: 'out', boy: 'out', giant: 'window',
    g: '冬天：雪、霜、北风、雹都住了进来，春天、夏天都不来', gi: '凶狠、自私', q: '“除了我自己以外，我不允许任何人在里面玩。”于是他在花园的四周砌了一道高墙。' },
  { b: '孩子钻进小洞', spring: true, wall: true, hole: true, corner: true, kids: 'tree', boy: 'corner', giant: 'window',
    g: '春天来了！只有最远的角落还是冬天', gi: '看见这个情景，心也软了，十分后悔', q: '“我多么自私啊！现在我明白为什么春天不肯到这儿来了。”' },
  { b: '巨人走进花园', wall: true, weather: true, kids: 'out', boy: 'corner', giant: 'garden',
    g: '孩子们吓得逃走了，又出现了冬天的景象', gi: '轻轻地走下楼，静悄悄地打开前门', q: '孩子们看见他，非常害怕，立刻逃走了，花园里又出现了冬天的景象。' },
  { b: '抱起小男孩', spring: true, wall: true, kids: 'in', boy: 'tree', giant: 'garden',
    g: '这棵树马上开花了，春天跟着孩子们一起回来了', gi: '温柔、和善', q: '巨人悄悄地走到他后面，轻轻抱起他，放到树枝上。这棵树马上开花了。' },
  { b: '拆除围墙', spring: true, kids: 'giant', boy: 'giant', giant: 'garden',
    g: '没有围墙了，花园成了孩子们的乐园', gi: '慷慨、友爱，和孩子们一起快乐', q: '“孩子们，花园现在是你们的了。”他拿出一把大斧子，拆除了围墙。' },
];
const SNOW_N = 46;

function kidSvg(color) {
  return `<circle r="7" fill="#f3d2b0"/><rect x="-7" y="7" width="14" height="15" rx="4" fill="${color}"/>`;
}

function buildGarden() {
  document.getElementById('trees').innerHTML = TREES.map((x, i) => `<g class="tree${i === CORNER_TREE ? ' corner' : ''}" data-i="${i}">
      <rect x="${x - 7}" y="215" width="14" height="${i === CORNER_TREE ? 180 : 120}" fill="#7b5a3c"/>
      <circle class="crown" cx="${x}" cy="200" r="52"/>
      <g class="blooms">${[[-24, -14], [10, -30], [26, 4], [-8, 16], [-30, 18], [20, 26]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${200 + dy}" r="6"/>`).join('')}</g>
    </g>`).join('');
  const fl = [];
  for (let k = 0; k < 28; k += 1) fl.push(`<circle cx="${30 + ((k * 97) % 600)}" cy="${300 + ((k * 53) % 100)}" r="4"/>`);
  document.getElementById('flowers').innerHTML = fl.join('');
  document.getElementById('kids').innerHTML = KID_COLORS.map((c, i) => `<g class="kid" data-i="${i}">${kidSvg(c)}</g>`).join('');
  document.getElementById('weather').innerHTML = Array.from({ length: SNOW_N }, (_, k) =>
    `<circle cx="${(k * 37) % 800}" cy="${-10 - ((k * 61) % 120)}" r="${2 + (k % 3)}" style="animation-delay:-${((k * 0.37) % 6).toFixed(2)}s;animation-duration:${(5 + (k % 4)).toFixed(0)}s"/>`).join('');
}

const at = (el, [x, y]) => { el.style.transform = `translate(${x}px, ${y}px)`; };

function showState(i) {
  const s = STATES[i];
  const svg = document.getElementById('garden');
  svg.classList.toggle('spring', Boolean(s.spring));
  svg.classList.toggle('winter', !s.spring);
  ['wall', 'weather', 'hole', 'corner'].forEach((k) => svg.classList.toggle(`${k}-on`, Boolean(s[k])));
  ['away', 'window', 'garden'].forEach((k) => svg.classList.toggle(`giant-${k}`, s.giant === k));
  svg.querySelectorAll('.tree').forEach((t) => {
    const cornerWinter = s.corner && +t.dataset.i === CORNER_TREE;
    t.classList.toggle('bloom', Boolean(s.spring) && !cornerWinter);
  });
  svg.querySelectorAll('.kid').forEach((k, n) => at(k, KIDS_AT[s.kids][n]));
  at(document.getElementById('boy'), BOY_AT[s.boy]);
  at(svg.querySelector('.giant'), GIANT_AT);
  document.querySelectorAll('#seasonBtns .btn').forEach((b, k) => b.classList.toggle('solid', k === i));
  document.getElementById('svGarden').textContent = s.g;
  document.getElementById('svGiant').textContent = s.gi;
  document.getElementById('svQuote').textContent = s.q;
}

function initSeasons() {
  buildGarden();
  const box = document.getElementById('seasonBtns');
  box.innerHTML = STATES.map((s, i) => `<button class="btn" type="button" data-i="${i}"><i>${i + 1}</i>${s.b}</button>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (b) showState(+b.dataset.i);
  });
  showState(0);
}

/* 小练笔 */
const MOMENTS = [
  {
    name: '爬上巨人的肩膀', pic: 'baoqi',
    prompt: '孩子们站在巨人的脚下，爬上巨人的肩膀，尽情地玩耍……',
    hint: '孩子们怎么爬上去的？在巨人肩膀上看到了什么？巨人是什么样子？',
    example: '小男孩踩着巨人的大手，一下子就被举到了肩膀上。“哇，我比桃树还高啦！”他张开双臂大喊。别的孩子也排着队，一个接一个地往上爬，有的揪着巨人的大胡子荡秋千，有的趴在他耳边说悄悄话。巨人笑得胡子一抖一抖的，小心翼翼地站着，生怕摔着谁。',
  },
  {
    name: '坐在桃树上', pic: 'xiaodong',
    prompt: '孩子们坐在开满鲜花的桃树上……',
    hint: '用上童话的写法：桃树会说什么？花朵、小鸟会怎么和孩子们玩？',
    example: '孩子们一爬上桃树，桃树就乐得哗哗地抖动枝条，撒下一阵粉红的花瓣雨。“欢迎回来！”桃树说。一只梅花雀落在小女孩的辫子上，唱起了最好听的歌。孩子们晃着小脚，跟着小鸟一起唱。',
  },
  {
    name: '花园里的游戏', pic: 'kuaile',
    prompt: '在没有围墙的花园里，孩子们玩起了各种游戏……',
    hint: '选一两个游戏写具体：捉迷藏、跳绳、过家家……写出动作、语言和心情。',
    example: '“我们来捉迷藏吧！”孩子们一哄而散。有的钻进花丛，有的躲到桃树后面，还有一个干脆藏进了巨人的大衣口袋里。找的孩子找遍了整个花园，最后巨人忍不住笑出了声，口袋里的小家伙也跟着咯咯笑起来，一下子就被找到了。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initSeasons();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
