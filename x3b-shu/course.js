'use strict';
/* 我变成了一棵树 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 品读 · 讲故事：起因 — 经过 — 结果 */
const PLOT = [
  { step: 1, stage: '起因', text: '不想吃饭，希望变成一棵树', pic: 'bianshu', x: 9, y: 96 },
  { step: 2, stage: '经过', text: '树上长满各种形状的鸟窝', pic: 'niaowo', x: 25, y: 84 },
  { step: 2, stage: '经过', text: '小动物和妈妈住进鸟窝', pic: 'mama', x: 42, y: 70 },
  { step: 3, stage: '经过', text: '肚子咕噜噜，想念饭菜', pic: 'mama', pos: '50% 60%', x: 59, y: 54 },
  { step: 3, stage: '经过', text: '口水流下来，大家说“大树在哭”', pic: 'dashuku', x: 76, y: 40 },
  { step: 4, stage: '结果', text: '妈妈：“小馋猫，肚子饿了，对吧？”', pic: 'dashuku', pos: '50% 35%', x: 92, y: 58 },
];

/* 品读 · 课后第 1 题：神奇的想象 / 真实的生活 */
const KINDS = ['神奇的想象', '真实的生活'];
const SORT_ITEMS = [
  { s: '我在树下玩得好好的，一点儿都不想吃饭。', ok: ['真实的生活'], q: '我们也常这样' },
  { s: '低头一看，发现许多小树枝正从我身上冒出来。', ok: ['神奇的想象'], q: '人变成了树' },
  { s: '我变的树上长满了各种形状的鸟窝。', ok: ['神奇的想象'], q: '鸟窝有形状，会跳舞' },
  { s: '我会弯下腰，让鸟窝离你很近很近。', ok: ['神奇的想象'], q: '树会弯腰请客' },
  { s: '我开始想念家里那些香喷喷的饭菜。', ok: ['真实的生活'], q: '饿了就想家' },
  { s: '他们连水珠是从我的嘴巴里流出来的都不知道。', ok: ['神奇的想象'], q: '大树流口水' },
];

/* 读与写 · 想象卡（课后第 2 题） */
const CARDS = [
  { what: '一朵云', steps: ['变成云以后，我会飘到哪里？', '我能做哪些平时做不到的事？', '发生了什么奇妙或麻烦的事？'],
    example: '我变成了一朵白白的云。我飘到沙漠上空，给仙人掌下了一场小雨；又飘到操场上，给跑步的同学遮太阳。可是一阵大风吹来，我被吹得找不到回家的路了……' },
  { what: '一条小鱼', steps: ['变成小鱼以后，我住在哪儿？', '我会和谁做朋友，一起玩什么？', '发生了什么奇妙或麻烦的事？'],
    example: '我变成了一条红色的小鱼，住在小区的池塘里。我和小蝌蚪比赛游泳，和荷叶上的青蛙聊天。傍晚，我看见妈妈在池塘边喊我回家，可我只能吐出一串泡泡……' },
  { what: '一只小鸟', steps: ['变成小鸟以后，我会飞去哪里？', '我在天上看到了什么？', '发生了什么奇妙或麻烦的事？'],
    example: '我变成了一只小麻雀，飞到了学校的屋顶上。我看见同学们在做早操，老师在讲台上找我。我想喊“我在这儿”，一张嘴却只会“叽叽喳喳”……' },
  { what: '一支铅笔', steps: ['变成铅笔以后，我在谁的手里？', '我会写出、画出什么？', '发生了什么奇妙或麻烦的事？'],
    example: '我变成了一支铅笔，躺在同桌的文具盒里。他用我写作业，我偷偷帮他把错字改对了。他高兴极了，可我越写越短，有点儿害怕被削没了……' },
  { what: '一盏路灯', steps: ['变成路灯以后，我站在哪里？', '晚上我会照亮谁？', '发生了什么奇妙或麻烦的事？'],
    example: '我变成了一盏路灯，站在回家的小路边。晚上，我照着放学的小朋友，照着散步的老爷爷。一只飞蛾绕着我转圈，转得我头都晕了……' },
  { what: '我自己想', steps: ['我想变成：________', '变了以后，我会……', '发生了什么奇妙或麻烦的事？最后怎么样了？'],
    example: '学着课文写：先写为什么想变，再写变的过程，接着写变了以后发生的奇妙的事，最后可以回到现实。' },
];

function initCards() {
  const $ = (id) => document.getElementById(id);
  const show = (i) => {
    const c = CARDS[i];
    document.querySelectorAll('.card-pick').forEach((b, k) => b.classList.toggle('on', k === i));
    $('cardWhat').textContent = c.what === '我自己想' ? '……' : c.what;
    $('cardSteps').innerHTML = c.steps.map((s) => `<li>${s}</li>`).join('');
    $('cardExampleText').textContent = `示例：${c.example}`;
    $('cardExampleText').hidden = true;
    $('cardText').value = '';
  };
  $('cardPicks').innerHTML = CARDS.map((c, i) => `<button class="card-pick" type="button" data-i="${i}">${c.what}</button>`).join('');
  $('cardPicks').addEventListener('click', (e) => {
    const b = e.target.closest('.card-pick');
    if (b) show(+b.dataset.i);
  });
  $('cardExample').addEventListener('click', () => { $('cardExampleText').hidden = false; });
  show(0);
}

window.LESSON = {
  init() {
    Narrative.init({ plot: PLOT, kinds: KINDS, sort: SORT_ITEMS });
    initCards();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
