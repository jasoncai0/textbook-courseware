'use strict';
/* 社戏 · 本课数据与专属互动：情节 + 心情曲线（点圆点看原文）、表达方式分类、童真语句翻卡、读写迁移 */

const svgNS = (tag, attrs, text) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  if (text) el.textContent = text;
  return el;
};

/* ---------- 情节 + 心情曲线：x 横坐标（0–800），m 心情（0 低落—100 快乐） ---------- */
const EVENTS = [
  { t: '平桥乐土', x: 70, m: 66, s: '但在我是乐土：因为我在这里不但得到优待，又可以免念“秩秩斯干幽幽南山”了。', f: '自在、快活' },
  { t: '钓虾放牛', x: 140, m: 58, s: '虾是水世界里的呆子，决不惮用了自己的两个钳捧着钩尖送到嘴里去的，所以不半天便可以钓到一大碗。', f: '有趣，也有被牛欺生、被嘲笑的小尴尬' },
  { t: '无船看戏', x: 215, m: 12, s: '只有我急得要哭，母亲却竭力的嘱咐我，说万不能装模装样，怕又招外祖母生气……', f: '失望、委屈，急得要哭' },
  { t: '借船看戏', x: 290, m: 80, s: '我的很重的心忽而轻松了，身体也似乎舒展到说不出的大。', f: '由失望转为狂喜' },
  { t: '月夜行船', x: 380, m: 92, s: '那声音大概是横笛，宛转，悠扬，使我的心也沉静，然而又自失起来……', f: '急切、陶醉' },
  { t: '船头看戏', x: 475, m: 30, s: '我有些疲倦了，托桂生买豆浆去。', f: '期待落空，疲倦、扫兴' },
  { t: '归航偷豆', x: 570, m: 90, s: '那航船，就像一条大白鱼背着一群孩子在浪花里蹿……', f: '欢快、自由' },
  { t: '六一送豆', x: 665, m: 60, s: '但我吃了豆，却并没有昨夜的豆那么好。', f: '平淡，若有所失' },
  { t: '怀念好戏', x: 745, m: 74, s: '真的，一直到现在，我实在再没有吃到那夜似的好豆，——也不再看到那夜似的好戏了。', f: '深深的怀念' },
];
const BANDS = [['看戏前', 30, 255], ['途中', 255, 425], ['看戏', 425, 520], ['归航', 520, 615], ['回味', 615, 790]];
const Y = (m) => 300 - m * 2.5;

function buildMood() {
  const svg = document.getElementById('moodSvg');
  BANDS.forEach(([t, a, b], i) => {
    svg.appendChild(svgNS('rect', { class: `band b${i % 2}`, x: a, y: 30, width: b - a, height: 290 }));
    svg.appendChild(svgNS('text', { class: 'band-t t-c', x: (a + b) / 2, y: 345 }, t));
  });
  svg.appendChild(svgNS('text', { class: 'axis-t', x: 34, y: 48 }, '快乐'));
  svg.appendChild(svgNS('text', { class: 'axis-t', x: 34, y: 312 }, '低落'));
  const pts = EVENTS.map((e) => [e.x, Y(e.m)]);
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i += 1) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const mx = (x0 + x1) / 2;
    d += ` C${mx} ${y0} ${mx} ${y1} ${x1} ${y1}`;
  }
  svg.appendChild(svgNS('path', { class: 'mood-line', d, 'data-step': 9 }));
  EVENTS.forEach((e, i) => {
    const g = svgNS('g', { class: 'ev', 'data-step': i + 1, 'data-i': i });
    g.appendChild(svgNS('circle', { cx: e.x, cy: Y(e.m), r: 11 }));
    const up = e.m < 50;
    g.appendChild(svgNS('text', { class: 'ev-t t-c', x: e.x, y: Y(e.m) + (up ? -20 : 32) }, e.t));
    svg.appendChild(g);
  });
}
buildMood();

function initMood() {
  const info = document.getElementById('moodInfo');
  document.getElementById('moodSvg').addEventListener('click', (e) => {
    const g = e.target.closest('.ev');
    if (!g) return;
    document.querySelectorAll('#moodSvg .ev').forEach((x) => x.classList.toggle('sel', x === g));
    const ev = EVENTS[+g.dataset.i];
    info.innerHTML = `<b>${ev.t}</b>　“我”的心情：${ev.f}<br><span class="yw">${ev.s}</span>`;
  });
}

/* ---------- 思考探究二：表达方式 ---------- */
const SORT = [
  { s: '大家跳下船，双喜拔前篙，阿发拔后篙，年幼的都陪我坐在舱中，较大的聚在船尾。', ok: ['记叙'], q: '交代出发的经过，动作干脆，写出少年们的能干和兴奋。' },
  { s: '两岸的豆麦和河底的水草所发散出来的清香，夹杂在水气中扑面的吹来；月色便朦胧在这水气里。', ok: ['描写'], q: '从嗅觉、视觉写水乡月夜，营造清新朦胧的意境。' },
  { s: '淡黑的起伏的连山，仿佛是踊跃的铁的兽脊似的，都远远地向船尾跑去了，但我却还以为船慢。', ok: ['描写', '抒情'], q: '前半句写景（以动写静），后半句写心情——景中含情，写出“我”看戏心切。' },
  { s: '我的很重的心忽而轻松了，身体也似乎舒展到说不出的大。', ok: ['抒情', '描写'], q: '心理描写，直接抒发由失望到狂喜的心情。' },
  { s: '在小村里，一家的客，几乎也就是公共的。', ok: ['议论'], q: '一句议论点明平桥村人热情好客、淳朴友善。' },
  { s: '我相信这话对，因为其时台下已经不很有人，乡下人为了明天的工作，熬不得夜，早都睡觉去了……', ok: ['议论', '记叙'], q: '对双喜的话作出判断并说明理由，交代看戏时台下冷清。' },
  { s: '真的，一直到现在，我实在再没有吃到那夜似的好豆，——也不再看到那夜似的好戏了。', ok: ['抒情'], q: '结尾直接抒情，表达对那一夜、对童年的深深怀念。' },
];

/* ---------- 积累拓展四：翻卡 ---------- */
const CLUES = [
  { q: '到下午，我的朋友都去了，戏已经开场了，我似乎听到锣鼓的声音，而且知道他们在戏台下买豆浆喝。', a: '“似乎听到”“知道”都是想象：人没去，心早飞到赵庄，越想越难过——急切又委屈。' },
  { q: '我的很重的心忽而轻松了，身体也似乎舒展到说不出的大。', a: '“很重”与“轻松”、“舒展到说不出的大”对照，夸张地写出一下子转悲为喜。' },
  { q: '淡黑的起伏的连山，仿佛是踊跃的铁的兽脊似的，都远远地向船尾跑去了，但我却还以为船慢。', a: '山“跑”是因为船快；明明很快还嫌慢——孩子看戏心切。' },
  { q: '我不喝水，支撑着仍然看，也说不出见了些什么，只觉得戏子的脸都渐渐的有些稀奇了，那五官渐不明显，似乎融成一片的再没有什么高低。', a: '困得眼花，却硬撑着不肯走——又倔又可爱，也说明戏实在不好看。' },
  { q: '那航船，就像一条大白鱼背着一群孩子在浪花里蹿，……', a: '“大白鱼”“蹿”是孩子眼里的比喻，写出船快、心情欢快、无拘无束。' },
];

const MOMENTS = [
  {
    name: '月夜行船', pic: 'yehang',
    prompt: '仿照课文，写一次夜晚坐船、坐车或走路去看热闹的经历。',
    hint: '先写怎么出发（记叙），再写一路上闻到、看到、听到的（描写），最后写一句当时的心情（抒情）。',
    example: '车子一出村，两旁的稻田便哗哗地往后退，风里有稻花的甜味。远处的戏台亮起一串灯，锣鼓声隐隐约约传过来。我把脸贴在车窗上，心早飞过去了，嘴里还一个劲地催：“快点，再快点！”',
  },
  {
    name: '台下看戏', pic: 'xitai',
    prompt: '写一次在台下看戏、看表演的经历，把你最想看的和真正看到的写出来。',
    hint: '期待什么？真正看到了什么？身边的人在做什么？你的心情怎样变化？',
    example: '我最想看的是舞狮，可台上偏偏是一位老先生拉二胡，拉了一曲又一曲。身边的小伙伴打着呵欠，我也揉着眼睛……直到锣鼓一响，金色的狮子跳上台来，大家才“哗”地一下全醒了。',
  },
  {
    name: '一起分享', pic: 'zhudou',
    prompt: '写一次和伙伴一起动手做吃的、分着吃的经历。',
    hint: '写清楚分工（谁摘、谁烧、谁剥），写一处吃的细节，最后用一句话说说为什么那一次特别好吃。',
    example: '哥哥们捡柴，我和妹妹剥玉米。火一烧旺，玉米粒噼啪作响，焦香扑鼻。我们顾不上烫，捧着一边吹一边啃。后来在城里也吃过烤玉米，却怎么也吃不出那天的味道。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: ['记叙', '描写', '抒情', '议论'], clues: CLUES, clueLabels: ['读这一句', '“我”的心理'], moments: MOMENTS });
    initMood();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
