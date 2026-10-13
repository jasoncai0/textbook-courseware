'use strict';
/* 手指 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 手的示意图（拇指在左）。data-hl 写要上色的手指：mu shi zhong wu xiao，all 为全部 */
const FINGERS = [
  { id: 'xiao', name: '小指', x: 162, y: 84, h: 84 },
  { id: 'wu', name: '无名指', x: 129, y: 50, h: 118 },
  { id: 'zhong', name: '中指', x: 96, y: 30, h: 138 },
  { id: 'shi', name: '食指', x: 63, y: 52, h: 116 },
];

function handSvg(hl) {
  const on = (id) => (hl === 'all' || hl.split(' ').includes(id) ? ' hl' : '');
  const fingers = FINGERS.map((f) => `<rect class="f${on(f.id)}" x="${f.x}" y="${f.y}" width="26" height="${f.h}" rx="13"/>
    <text class="lab${on(f.id)}" x="${f.x + 13}" y="${f.y - 8}">${f.name}</text>`).join('');
  // 大拇指：矮而胖，斜着长在手掌左边
  return `<g>${fingers}
    <g transform="rotate(-38 46 182)"><rect class="f${on('mu')}" x="30" y="128" width="34" height="74" rx="17"/></g>
    <rect class="palm" x="54" y="146" width="140" height="112" rx="30"/>
    <text class="lab${on('mu')}" x="18" y="122">大拇指</text></g>`;
}

function buildHands() {
  document.querySelectorAll('svg.hand[data-hl]').forEach((svg) => {
    svg.setAttribute('viewBox', '0 0 230 270');
    svg.innerHTML = handSvg(svg.dataset.hl);
  });
}

/* 课后第 2 题：风趣的语言 */
const CLUE_LABELS = ['读一读', '风趣在哪里'];
const CLUES = [
  { q: '“他永远不受外物冲撞，所以曲线优美，处处显示着养尊处优的幸福。”', a: '把中指写成一位享福的“老爷”：“养尊处优”本是说人的，用在手指上，让人忍不住笑。' },
  { q: '“给人搔痒，人舒服后，感谢的是其他四指。”', a: '大拇指出了力，功劳却归别人——作者像在替他抱不平，又好笑又心疼。' },
  { q: '“刀伤、烫伤、轧伤、咬伤，他消受的机会最多。”', a: '“消受”一般说享受好东西，这里却说受伤——正话反说，风趣。' },
  { q: '“好像取得这物是他一人的功劳。”', a: '中指最先碰到东西，就像“抢功”的人。' },
  { q: '“像关公左右的关平、周仓，左膀右臂，片刻不离。”', a: '打比方：中指像大将关公，食指、无名指像他身边的两员随从。' },
  { q: '“小指的用处则更渺小，只是掏掏耳朵、抹抹鼻涕而已。”', a: '“掏掏”“抹抹”轻描淡写，再加一个“而已”，小指的“没用”被写得很好玩。' },
];

/* 小练笔：仿照课文写五官 */
const MOMENTS = [
  {
    name: '眼睛', pic: 'wuzhi',
    prompt: '仿照课文的表达特点，写写眼睛：它长什么样？有什么“性格”？有什么长处和短处？',
    hint: '学课文：先写样子，再写“性格”；用“例如……”举几个事例；把它当成一个人来写，语言风趣些。',
    example: '眼睛在五官中地位最高，住在脸的“二楼”，左右各一，像一对形影不离的双胞胎。他最是好奇，什么都要先看一看：看书要他，看路要他，看电视更少不了他。可他也最娇气，一粒沙子就能让他泪流满面；一到晚上，他就早早拉下“窗帘”，什么活儿也不肯干了。',
  },
  {
    name: '鼻子', pic: 'wuzhi',
    prompt: '仿照课文的表达特点，写写鼻子。',
    hint: '想想鼻子的位置（脸的正中）、样子，它做了哪些事，又有什么“委屈”或“得意”。',
    example: '鼻子居于脸的正中央，像一座小山，眼睛、嘴巴都在他的山脚下。他是一个尽职的“哨兵”：饭菜香了，他第一个报告；东西烧焦了，他第一个报警。可一感冒，他就罢工了，还要人一张张纸巾地伺候他。',
  },
  {
    name: '嘴巴', pic: 'wuzhi',
    prompt: '仿照课文的表达特点，写写嘴巴。',
    hint: '嘴巴的工作可多了：吃饭、说话、唱歌、笑……它有什么长处？有没有让人头疼的时候？',
    example: '嘴巴是五官中最忙的一位。早上要吃早饭，上课要回答问题，下课要和同学聊天，晚上还要唱几句歌。他最会讨人喜欢，一张一合就能说出好听的话；可他也最会闯祸，有时一句话没管住，就惹得朋友不高兴了。',
  },
  {
    name: '耳朵', pic: 'wuzhi',
    prompt: '仿照课文的表达特点，写写耳朵。',
    hint: '耳朵长在脸的两边，总是安安静静的。它像生活中的哪种人？',
    example: '耳朵住在脸的两边，离热闹的“市中心”最远，平时一声不吭。可是谁说话、谁唱歌、谁在背后悄悄议论，全都逃不过他。他是最耐心的听众，从不插嘴；只是戴眼镜、戴口罩的时候，都要挂在他身上，他也只好默默地扛着。',
  },
];

buildHands(); // 在 deck.js 统计分步之前生成

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
