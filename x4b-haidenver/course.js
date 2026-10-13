'use strict';
/* 海的女儿（四下 28 · 略读）· 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课独有：下潜深度尺（跟着课文一层层潜到海底，收集“奇妙清单”）+ 童话人物形象卡。结局不在课堂上提前讲。 */

const SPIRES = 7;
const DIVE_STEPS = 5;
function drawSpires() {
  // 教堂尖塔从海底一个一个叠到水面
  const h = 74;
  document.getElementById('spires').innerHTML = Array.from({ length: SPIRES }, (_, i) => {
    const y = 560 - (i + 1) * h;
    return `<g class="spire" style="animation-delay:${(i * .25).toFixed(2)}s"><path d="M250 ${y + h} v-${h - 30} l14 -30 14 30 v${h - 30} z" fill="#e9dcc0" stroke="#b9a77f" stroke-width="2"/><rect x="259" y="${y + 40}" width="10" height="14" rx="5" fill="#8a7a5a"/></g>`;
  }).join('') + '<text x="150" y="200" class="dl">尖塔叠起来</text>';
}

function updateDive(slide, step) {
  document.getElementById('gaugeDot').style.top = `${(Math.min(step, DIVE_STEPS) / DIVE_STEPS) * 100}%`;
  const ps = [...slide.querySelectorAll('#diveText p')];
  const shown = ps.filter((p) => +p.dataset.step <= step);
  ps.forEach((p) => p.classList.toggle('now', p === shown[shown.length - 1]));
}

/* 童话人物形象卡（本单元第二次使用翻卡） */
const CLUE_LABELS = ['人物', '课文里这样写'];
const CLUES = [
  { q: '<b>老祖母</b>她是个怎样的人？', a: '聪明，管理家务；看重自己高贵的出身，尾巴上老是戴着一打牡蛎。可她非常爱那些小小的海公主。' },
  { q: '<b>五个姐姐</b>她们的花坛像什么？', a: '有的像一条鲸鱼，有的像一个小人鱼；她们从沉船中弄来新奇的东西装点花园。' },
  { q: '<b>最小的公主 · 样子</b>', a: '六个女孩里最美丽的：皮肤光滑柔嫩，像玫瑰的花瓣；眼睛是蔚蓝色的，像最深的湖水。下身是一条鱼尾。' },
  { q: '<b>最小的公主 · 花坛</b>', a: '布置得圆圆的，像一轮太阳，只种像太阳一样红的花；只想要一个美丽的大理石像。' },
  { q: '<b>最小的公主 · 性格</b>', a: '一个古怪的孩子，不大爱讲话，总是静静地在想着什么；那么地沉默和富于深思。' },
  { q: '<b>最小的公主 · 心愿</b>', a: '最大的乐趣是听人类世界的故事；谁也没有她渴望得厉害，可她恰恰要等最久。' },
];

/* 读与写 */
const MOMENTS = [
  {
    name: '我觉得奇妙的地方', pic: 'gongdian',
    prompt: '阅读提示 ②：说说你觉得奇妙的地方。',
    hint: '选一两处，先说课文怎么写的，再说你为什么觉得奇妙。',
    example: '我觉得海王的宫殿最奇妙：墙是珊瑚砌的，窗子是琥珀做的，屋顶上的蚌壳会跟着水流自动开合，每一个里面都有亮晶晶的珍珠。我们的屋顶只会挡雨，海王的屋顶却会“张嘴”，还藏着宝贝！',
  },
  {
    name: '最小的公主给我的印象', pic: 'huatan',
    prompt: '阅读提示 ③：那位最小的公主给你留下了怎样的印象？',
    hint: '说印象，也要说依据：她长什么样、做了什么、想要什么。',
    example: '最小的公主给我的印象是安静又充满向往。别的姐姐把花坛布置得像鲸鱼、像小人鱼，她却布置得像一轮太阳。她不大爱讲话，却最爱听人类世界的故事，常常站在窗边朝上望，向海面上的船伸出小手。',
  },
  {
    name: '十五岁那一天', pic: 'chuangqian',
    prompt: '想象一下：最小的公主终于满十五岁，第一次浮上海面，她会看到什么、听到什么？',
    hint: '想想她最想看的东西：会散发香气的花、绿色的森林、会唱歌的“鱼儿”（小鸟）、大船和城市……读完整篇童话，再看看安徒生是怎么写的。',
    example: '小公主轻轻地浮出水面，月光洒在她的头发上。她第一次闻到了风里的花香，第一次听见岸边树林里“鱼儿”在唱歌——原来它们长着翅膀，在天上飞！远处一艘大船亮着灯，传来人们的笑声……',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    drawSpires();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-dive')) updateDive(slide, step);
  },
};
