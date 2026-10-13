'use strict';
/* 卖火柴的小女孩 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课专属：五次擦火柴（点亮火柴 → 幻象 / 现实 / 愿望）。
 */

/* 品读 · 讲故事：起因 → 经过 → 结果（stage 用中年级的说法） */
const PLOT = [
  { step: 1, stage: '起因', text: '大年夜，赤脚卖火柴，一根也没卖掉', pic: 'jiejiao', pos: '35% 50%', x: 9, y: 96 },
  { step: 2, stage: '经过', text: '第 1 根：大火炉', pic: 'huolu', pos: '75% 50%', x: 25, y: 84 },
  { step: 2, stage: '经过', text: '第 2 根：烤鹅', pic: 'jiejiao', pos: '78% 45%', x: 41, y: 70 },
  { step: 3, stage: '经过', text: '第 3 根：圣诞树', pic: 'shengdanshu', pos: '68% 45%', x: 57, y: 56 },
  { step: 3, stage: '经过', text: '第 4 根：奶奶', pic: 'nainai', pos: '50% 30%', x: 74, y: 40 },
  { step: 4, stage: '结果', text: '擦着一大把，和奶奶飞走了', pic: 'nainai', x: 91, y: 32 },
];

/* 品读 · 五次擦火柴（课后第 2 题） */
const MATCHES = [
  { n: '第 1 次', see: '一个大火炉，烧得旺旺的，暖烘烘的', real: '天冷极了，她的小手几乎冻僵了', wish: '想要温暖', sticks: 1 },
  { n: '第 2 次', see: '喷香的烤鹅从盘子里跳下来，向她走来', real: '又冷又饿，一整天没卖掉一根火柴', wish: '想要食物', sticks: 1 },
  { n: '第 3 次', see: '美丽的圣诞树，点着几千支蜡烛', real: '去年只能透过富商家的玻璃门看', wish: '想要快乐', sticks: 1 },
  { n: '第 4 次', see: '奶奶出现在亮光里，温和、慈爱', real: '唯一疼她的奶奶已经不在了', wish: '想要疼爱', sticks: 1 },
  { n: '第 5 次', see: '奶奶把她搂在怀里，一起飞走了', real: '寒冷、饥饿、痛苦，不敢回家', wish: '永远和奶奶在一起', sticks: 5 },
];

function initMatches(box) {
  box.innerHTML = MATCHES.map((m, i) => `<button class="mcard" type="button" data-i="${i}">
    <h3>${m.n}</h3><span class="mstick">${'<i></i>'.repeat(m.sticks)}</span><span class="mtap">点一点，擦燃火柴</span>
    <p class="mrow see"><small>火光里看到</small>${m.see}</p>
    <p class="mrow real"><small>现实是</small>${m.real}</p>
    <p class="mrow wish">${m.wish}</p></button>`).join('');
  box.addEventListener('click', (e) => {
    const card = e.target.closest('.mcard');
    if (card) card.classList.add('lit');
  });
}

/* 读与写 · 印象最深的地方（课后第 3 题） */
const MOMENTS = [
  {
    name: '赤着脚走在雪地里', pic: 'jiejiao',
    prompt: '“小女孩只好赤着脚走，一双小脚冻得红一块青一块的。……这一整天，谁也没买过她一根火柴，谁也没给过她一个硬币。”',
    hint: '想一想：大年夜，别人家里在做什么？她却在做什么？',
    example: '我印象最深的是小女孩赤着脚在雪地里走。大年夜，别人都在家里吃烤鹅，她却又冷又饿，一根火柴也没卖掉。我觉得她太可怜了，真想把自己的棉鞋送给她。',
  },
  {
    name: '烤鹅向她走来', pic: 'jiejiao',
    prompt: '“更妙的是这只鹅从盘子里跳下来，背上插着刀和叉，摇摇摆摆地在地板上走着，一直向这个穷苦的小女孩走来。”',
    hint: '烤鹅真的会走路吗？为什么小女孩会看到这样的画面？',
    example: '我印象最深的是烤鹅背上插着刀叉向她走来。烤鹅当然不会走路，这是小女孩太饿了想象出来的。读到这里我先觉得好玩，后来又很难过。',
  },
  {
    name: '“请把我带走吧！”', pic: 'nainai',
    prompt: '“奶奶！”小女孩叫起来，“啊！请把我带走吧！我知道，火柴一灭，您就会不见的……”',
    hint: '奶奶是怎样的人？小女孩为什么想让奶奶把她带走？',
    example: '我印象最深的是小女孩喊“请把我带走吧”。奶奶是唯一疼她的人，她太孤单了，只有在奶奶身边才感到温暖。读到这里，我心里酸酸的。',
  },
  {
    name: '“谁也不知道……”', pic: 'nainai',
    prompt: '“谁也不知道她曾经看到过多么美丽的东西，她曾经多么幸福，跟着她奶奶一起向新年的幸福中走去。”',
    hint: '人们以为她只是“想给自己暖和一下”。读过故事的你，知道些什么？',
    example: '我印象最深的是最后一句。人们只看见她手里的火柴梗，可我知道她看见了火炉、烤鹅、圣诞树和奶奶。我希望世界上的每个孩子都不再挨冻挨饿。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ plot: PLOT, moments: MOMENTS });
    const box = document.getElementById('matches');
    if (box) initMatches(box);
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
