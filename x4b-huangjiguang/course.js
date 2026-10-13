'use strict';
/* 黄继光（四下 24 · 略读）· 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课独有：动作慢镜头——夜色山坡上一颗金星向主峰前进，天色时间条从夜晚走到黎明，动作词逐个亮起。
 * 真实英雄人物：不画人物和战斗，只用山坡、夜色、信号弹、黎明表现。 */

/* 每一步：金星位置、是否“站起”、战友状态、天色、时间条位置 */
const SLOPE = [
  { hero: [60, 404], mates: 'with', dawn: 0, sky: 6 },
  { hero: [150, 392], mates: 'with', dawn: 0, sky: 18 },
  { hero: [300, 345], mates: 'stop', dawn: 0, sky: 28, flare: true },
  { hero: [520, 226], mates: 'stop', dawn: .12, sky: 38, flare: true, ruler: true },
  { hero: [545, 194], mates: 'stop', dawn: .2, sky: 46, flare: true, ruler: true, rise: true },
  { hero: [548, 214], mates: 'stop', dawn: .25, sky: 54, ruler: true, faint: true, half: true },
  { hero: [604, 164], mates: 'stop', dawn: .55, sky: 68, rise: true, out: true },
  { hero: [604, 164], mates: 'stop', dawn: 1, sky: 95, out: true, wave: true },
];
const MATE_STOP = [[268, 356], [246, 364]];
const WAVE_N = 14;

function initWave() {
  document.getElementById('wave').innerHTML = Array.from({ length: WAVE_N }, (_, i) => {
    const x = 40 + i * 26;
    return `<circle class="wv" r="4" cx="${x}" cy="${420 - i * 9}" style="--dx:${(600 - x) * .6}px;--dy:${-(250 - i * 9) * .6}px;animation-delay:${(i * .08).toFixed(2)}s"/>`;
  }).join('');
}

function updateSlope(slide, step) {
  const s = SLOPE[Math.min(step, SLOPE.length - 1)];
  const svg = document.getElementById('slopeSvg');
  const hero = document.getElementById('hero');
  hero.style.transform = `translate(${s.hero[0]}px, ${s.hero[1]}px) scale(${s.rise ? 1.35 : 1})`;
  hero.classList.toggle('faint', Boolean(s.faint));
  document.querySelectorAll('#mates .mate').forEach((m, i) => {
    const [x, y] = s.mates === 'with' ? [s.hero[0] - 22 - i * 18, s.hero[1] + 6 + i * 4] : MATE_STOP[i];
    m.style.transform = `translate(${x}px, ${y}px)`;
    m.classList.toggle('stopped', s.mates === 'stop');
  });
  document.getElementById('dawn').style.opacity = s.dawn;
  document.getElementById('skyDot').style.left = `${s.sky}%`;
  svg.classList.toggle('flare-on', Boolean(s.flare));
  svg.classList.toggle('ruler-on', Boolean(s.ruler));
  svg.classList.toggle('half', Boolean(s.half));
  svg.classList.toggle('fire-out', Boolean(s.out));
  svg.classList.toggle('wave-on', Boolean(s.wave));
  // 右侧原文：只留最新一段
  const ps = [...slide.querySelectorAll('#cine p')];
  const shown = ps.filter((p) => +p.dataset.step <= step);
  ps.forEach((p) => p.classList.toggle('now', p === shown[shown.length - 1]));
}

/* 阅读提示：找语言、动作 */
const PICKS = {
  find: [
    { t: '他转过身来坚定地对营参谋长说：“参谋长，请把这个任务交给我吧！”', ok: true, why: '语言 · 主动请战，坚定' },
    { t: '东方升起了启明星，营参谋长看看表，已经四点多了。', ok: false, why: '写时间紧迫，不是黄继光的语言动作' },
    { t: '喊了一声：“让祖国人民听我们胜利的消息吧！”', ok: true, why: '语言 · 必胜的信心' },
    { t: '几发照明弹升上天空，黑夜变成了白天。', ok: false, why: '写环境的危险' },
    { t: '他用尽全身的力气，更加顽强地向前爬。', ok: true, why: '动作 · 负伤也不停下，顽强' },
    { t: '营参谋长紧握着黄继光的手。', ok: false, why: '这是营参谋长的动作' },
    { t: '黄继光突然站起来了！……他举起右臂。', ok: true, why: '动作 · 不顾危险，勇敢' },
    { t: '他张开双臂，向喷射着火舌的火力点猛扑上去。', ok: true, why: '动作 · 舍生忘死' },
  ],
};

/* 读与写 */
const MOMENTS = [
  {
    name: '讲一个英雄故事', pic: 'liming',
    prompt: '再读读其他英雄人物故事（如邱少云、董存瑞、罗盛教、钱学森），选一个讲给同学听。',
    hint: '讲的时候，重点讲他说了什么、做了什么，再说说你感受到他怎样的品质。',
    example: '我讲的是罗盛教的故事。他听到孩子们的哭喊声，知道有孩子落水了，就急忙向河边跑过去。他一边飞奔，一边脱棉衣，猛地跳进冰窟窿……一次又一次钻下去，终于把孩子托出了水面，自己却再也没有上来。我从“急忙”“一边……一边……”“猛地跳”这些动作里，感受到他舍己救人的品质。',
  },
  {
    name: '我想对黄继光说', pic: 'qiming',
    prompt: '读完课文，你最想对黄继光说什么？',
    hint: '可以从他的一句话、一个动作说起。',
    example: '黄继光叔叔，您说“请把这个任务交给我吧”，那么坚定；您负了伤还一次次站起来……今天的和平生活，是您和许许多多英雄用生命换来的。我一定好好学习，不辜负你们。',
  },
  {
    name: '读阅读链接', pic: 'liming',
    prompt: '读阅读链接《祖国，我终于回来了》：钱学森为什么一定要回国？从哪些地方看出来？',
    hint: '找找他“放弃”了什么，“坚持”了什么。',
    example: '钱学森在美国有金钱、地位、名誉，可一听到新中国成立的消息，他就决定放弃美国的一切回国。他被关押、被监视，还是不断提出“我要回到祖国去”，坚持斗争了五年。他心里装着祖国。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    initWave();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-slope')) updateSlope(slide, step);
  },
};
