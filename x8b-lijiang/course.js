'use strict';
/* 一滴水经过丽江 · 本课数据。本课独有：拖动水滴沿水路走（地图旅程，站点卡标出自然 / 历史 / 人文） */

/* 站点：x, y 为地图坐标；t 为景物类型（nat 自然 / his 历史 / hum 人文）；under 表示从上一站到这里走地下 */
const STOPS = [
  { x: 80, y: 60, name: '玉龙雪山顶', t: ['nat'], me: '雪 → 冰 → 一滴水', q: '我是一片雪，轻盈地落在了玉龙雪山顶上。' },
  { x: 150, y: 130, name: '冰川与瀑布', t: ['nat'], me: '终于可以大声喧哗', q: '是的，我又化成了一滴水，和瀑布里另外的水大声喧哗着扑向山下。' },
  { x: 205, y: 200, name: '山林与驿道', t: ['nat', 'hum'], me: '一路听人们说“丽江坝”', q: '经过马帮来往的驿道，经过纳西族村庄里的人们，他们都在说：丽江坝，丽江坝，那真是一个山间美丽的大盆地。' },
  { x: 235, y: 280, name: '丽江坝 · 草甸', t: ['his'], me: '心愿：“我也要去四方街”', q: '那时是明代，纳西族的首领木氏家族率领百姓筑起了名扬世界的四方街。' },
  { x: 300, y: 300, name: '落水洞', t: ['nat'], me: '眼前一黑，又睡去了', q: '在充满寂静和岩石的味道的地下，我又睡去了。再次醒来，时间又过去了好几百年。' },
  { x: 345, y: 200, name: '黑龙潭', t: ['nat', 'hum'], under: true, me: '被亮光惊醒，目眩神迷', q: '潭水映照雪山，真让人目眩神迷啊。' },
  { x: 400, y: 245, name: '玉河 · 闸口 · 水车', t: ['his', 'hum'], me: '乘水车升高，看见古城', q: '古城的建筑就这样依止于自然，美丽了自然。' },
  { x: 435, y: 300, name: '中河', t: ['hum'], me: '有些犹豫，来不及选择', q: '作为一滴水，不可能同时从三条河中穿越同一座古城。' },
  { x: 470, y: 250, name: '银器店 · 古乐 · 东巴字画店', t: ['hum'], me: '想停下来，却停不下来', q: '我想停下来看看，东巴文的“水”字是怎样的写法。但我停不下来，没有看见。' },
  { x: 500, y: 300, name: '三坊一照壁的院子', t: ['hum'], me: '落在一朵兰花上', q: '客人问主人当地的掌故。主人问客人远方的情形。' },
  { x: 515, y: 360, name: '城外果园田地', t: ['nat'], me: '头顶满天星光', q: '一些薄云掠过月亮时，就像丽江古城中，一个银匠，正在擦拭一只硕大的银盘。' },
  { x: 575, y: 395, name: '金沙江', t: ['nat'], me: '心愿实现，奔向大海', q: '我知道，作为一滴水，我终于以水的方式走过了丽江。' },
];
const TYPE_NAME = { nat: '自然风光', his: '历史沿革', hum: '人文景观' };

function buildMap() {
  const svg = document.getElementById('ljMap');
  const segs = STOPS.slice(1).map((s, i) => {
    const a = STOPS[i];
    return `<line class="lj-seg${s.under ? ' under' : ''}" x1="${a.x}" y1="${a.y}" x2="${s.x}" y2="${s.y}"/>`;
  }).join('');
  const dots = STOPS.map((s, i) => `<g class="lj-stop" data-i="${i}"><circle cx="${s.x}" cy="${s.y}" r="7"/></g>`).join('');
  svg.innerHTML = `
    <rect width="600" height="420" fill="#eef4ee"/>
    <path d="M0 0 H200 L150 90 L110 60 L60 120 L0 90 Z" fill="#dfe8ee"/>
    <path d="M40 90 L80 30 L125 95 Z" fill="#fff" stroke="#a9bccb"/>
    <text class="t-s" x="20" y="22" fill="#4a6272">玉龙雪山</text>
    <ellipse cx="300" cy="270" rx="170" ry="80" fill="#dcebd3"/>
    <text class="t-s" x="200" y="330" fill="#5a7a4c">丽江坝</text>
    <path d="M330 175 h40 v18 h-40 Z" fill="#9fcfd0" opacity=".8"/>
    <text class="t-s" x="320" y="168" fill="#2d6b6c">黑龙潭</text>
    <rect x="385" y="225" width="140" height="100" rx="10" fill="#efe2cf" stroke="#c9ad85" stroke-dasharray="4 4"/>
    <text class="t-s" x="440" y="220" fill="#8a6a3e">古城</text>
    <path d="M560 260 C 570 320, 560 360, 590 420" stroke="#c7b48f" stroke-width="22" fill="none" opacity=".7"/>
    <text class="t-s" x="535" y="250" fill="#7b6440">金沙江</text>
    <circle cx="300" cy="300" r="12" fill="#3a3a3a" opacity=".6"/>
    ${segs}${dots}
    <g id="ljDrop" class="lj-drop"><path d="M0 -20 C 8 -8, 13 0, 13 6 A13 13 0 0 1 -13 6 C -13 0, -8 -8, 0 -20 Z"/><circle cx="-4" cy="4" r="3" fill="#fff" opacity=".8"/></g>`;
}
buildMap();
// 隐形分步：按 → 时水滴一站一站走（deck.js 只统计 data-step）
document.querySelector('.s-drop .stage').insertAdjacentHTML('beforeend', STOPS.slice(1).map((_, i) => `<i class="lj-step" data-step="${i + 1}"></i>`).join(''));

/* 计算点到各段的最近位置：pos = 段号 + t（0~1），站点 i 的位置就是 i */
function nearestPos(px, py) {
  let best = { d: Infinity, pos: 0 };
  for (let i = 0; i < STOPS.length - 1; i += 1) {
    const a = STOPS[i];
    const b = STOPS[i + 1];
    const vx = b.x - a.x;
    const vy = b.y - a.y;
    const t = Math.max(0, Math.min(1, ((px - a.x) * vx + (py - a.y) * vy) / (vx * vx + vy * vy)));
    const d = (a.x + t * vx - px) ** 2 + (a.y + t * vy - py) ** 2;
    if (d < best.d) best = { d, pos: i + t };
  }
  return best.pos;
}

function placeDrop(pos) {
  const i = Math.min(STOPS.length - 2, Math.floor(pos));
  const t = pos - i;
  const a = STOPS[i];
  const b = STOPS[i + 1];
  const x = a.x + (b.x - a.x) * t;
  const y = a.y + (b.y - a.y) * t;
  document.getElementById('ljDrop').setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
  showStop(Math.round(pos));
}

let shown = -1;
function showStop(i) {
  if (i === shown) return;
  shown = i;
  const s = STOPS[i];
  document.querySelectorAll('#ljMap .lj-stop').forEach((g, k) => {
    g.classList.toggle('cur', k === i);
    g.classList.toggle('done', k < i);
  });
  document.getElementById('ljCard').innerHTML = `<h3><i>${i + 1}</i>${s.name}</h3>
    <div class="lj-tags">${s.t.map((t) => `<span class="t-${t}">${TYPE_NAME[t]}</span>`).join('')}</div>
    <p class="lj-me"><b>水滴“我”：</b>${s.me}</p><blockquote>${s.q}</blockquote>`;
}

function initDrag() {
  const svg = document.getElementById('ljMap');
  let dragging = false;
  const toSvg = (e) => {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  };
  const move = (e) => {
    if (!dragging) return;
    const p = toSvg(e);
    placeDrop(nearestPos(p.x, p.y));
  };
  svg.addEventListener('pointerdown', (e) => {
    dragging = true;
    svg.setPointerCapture(e.pointerId);
    move(e);
  });
  svg.addEventListener('pointermove', move);
  svg.addEventListener('pointerup', () => { dragging = false; });
  svg.addEventListener('pointercancel', () => { dragging = false; });
}

/* 选一选：写“我”的心愿或心情的句子 */
const PICKS = {
  wish: [
    { t: '我已经奔流到了丽江坝放牧着牛羊的草甸上，我也要去四方街。', ok: true, why: '心愿出现' },
    { t: '我记起了跌进落水洞前的心愿：也要流过四方街。', ok: true, why: '心愿延续' },
    { t: '在这里，我有些犹豫。', ok: true, why: '面对三条河的犹豫' },
    { t: '我确实想停下来，想被掺入砚池中，被蘸到笔尖，被写成东巴象形文的“水”……', ok: true, why: '渴望被看见' },
    { t: '太阳出来了，我怕被迅速蒸发，借一阵微风跳下花朵，正好跳回浇花壶中。', ok: true, why: '怕与机灵' },
    { t: '后来我知道，视野尽头的那些山叫作象山、狮子山，更远一点，叫作笔架山。', ok: false, why: '介绍地名' },
    { t: '丽江人把高山溪流跌落到地下的地方叫作落水洞。', ok: false, why: '介绍知识' },
  ],
};

const MOMENTS = [
  {
    name: '一片落叶经过校园', pic: 'gucheng',
    prompt: '化身校园里的一片落叶（或一只纸飞机、一阵风），写它“游览”校园的一段经历（300 字左右）。',
    hint: '先定好路线（至少三个地点）；用“我”的口吻写所见；加一两处“我”的心愿或心情，让物有情。',
    example: '我是一片梧桐叶，在三楼窗外挂了整整一个夏天。一阵风把我摘下来，我打着旋儿飘过走廊——教室里有人在背《马说》，声音齐齐的，像一排鼓点。我想停下来听完，可风不肯。我落进了操场边的花坛，几个低年级的孩子蹲下来捡我，说要夹进书里做书签。我心里一阵欢喜：原来我还能被留下来。',
  },
  {
    name: '一滴雨经过家乡', pic: 'xueshan',
    prompt: '学习本课以水为线的写法，写一滴雨从落下到流走，看见的家乡（300 字左右）。',
    hint: '从天上写到地上，从屋檐写到小河；可以写一处自然景物、一处老建筑、一个生活场景。',
    example: '我从云里落下来，先砸在奶奶家青瓦的屋檐上，顺着瓦槽滑到檐口，“嗒”的一声跳进院里的大水缸。缸里映着一角天空，还有那棵老枣树。黄昏时奶奶舀水浇菜，我又被泼进了菜地，钻进土里，一路渗到村口的小河。河上那座石桥，听说比奶奶还老。我从桥洞下穿过去，看见岸边有孩子在打水漂，水花一圈一圈，送我向远方流去。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS, picks: PICKS });
    initDrag();
    placeDrop(0);
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-drop')) placeDrop(Math.min(step, STOPS.length - 1));
  },
};
