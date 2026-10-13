'use strict';
/* 灯光 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 阅读提示 · 三声“多好啊” */
const CLUE_LABELS = ['“多好啊！”', '这一次……'];
const CLUES = [
  { q: '清明节前的一个晚上，我又漫步在广场上，忽然背后传来一声赞叹：“多好啊！”', a: '<b>今天的人</b>在璀璨的华灯下赞叹美好的生活。这一声，把“我”带回了很久以前——引出回忆。' },
  { q: '他注视着那幅图，默默地沉思着。“多好啊！”他在自言自语。', a: '<b>郝副营长</b>看着插图里的电灯和读书的孩子，发自内心地向往。' },
  { q: '“赶明儿胜利了，咱们也能用上电灯，让孩子们都在那样亮的灯光底下学习，该多好啊！”', a: '<b>郝副营长</b>的理想：不为自己，为了孩子们。他完全陷入了对未来的憧憬里。' },
  { q: '为什么作者听到一声“多好啊”，心头会“微微一震”？', a: '因为今天人们的赞叹，正是当年郝副营长的心愿——<b>他的理想实现了</b>，他却没能看到。' },
];

/* 读与写 */
const MOMENTS = [
  {
    name: '华灯下 · 我想对他说', pic: 'huadeng',
    prompt: '站在天安门前璀璨的华灯下，你想对郝副营长说些什么？',
    hint: '想一想：他没见过电灯；他希望孩子们在“那样亮的灯光底下学习”。今天的你，就是那个孩子。',
    example: '郝副营长，您没来得及见一见电灯，可今天，我每天晚上都在明亮的台灯下写作业。您盼望的“多好啊”，我们正过着。我会好好学习，不辜负这灯光。',
  },
  {
    name: '划亮火柴的那一刻', pic: 'huoguang',
    prompt: '在千钧一发的时刻，郝副营长划着了火柴，点燃了那本书。那一刻，他会想些什么？',
    hint: '他知道火光会暴露自己吗？他手里烧着的是哪一本书？',
    example: '后面的同志找不到路了！这本书……烧了吧。电灯我见不到了，可只要战友们冲进去，孩子们总有一天能在电灯下读书。',
  },
  {
    name: '我身边的灯光', pic: 'chatu',
    prompt: '写一写你身边的一处灯光：教室的灯、家里的台灯、街上的路灯……读了课文，你对它有什么新的感受？',
    hint: '先写这盏灯的样子，再写你想到了什么。',
    example: '晚上，书桌上的台灯亮着，白白的光照在作业本上。以前我从没想过它有什么特别，现在我知道，这样的灯光，曾经是一位二十二岁的战士最大的心愿。',
  },
];

/* 天安门前的华灯：几根灯柱，每根顶上一簇灯球 */
function drawHuadeng(g) {
  const POSTS = [600, 640, 680, 720];
  g.innerHTML = POSTS.map((x, i) => {
    const h = i % 2 ? 70 : 84;
    const top = 150 - h;
    const balls = [[0, 0], [-9, 6], [9, 6], [-5, -8], [5, -8]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${top + dy}" r="5" fill="#fff3c8"/>`).join('');
    return `<line x1="${x}" y1="150" x2="${x}" y2="${top}" stroke="#c9c2b2" stroke-width="3"/>${balls}`;
  }).join('');
}

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    drawHuadeng(document.querySelector('#lights .huadeng'));
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
