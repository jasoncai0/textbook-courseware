'use strict';
/* 牛郎织女（一） · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 品读 · 课后第 1 题：牛郎和织女怎么认识的 */
const PLOT = [
  { step: 1, stage: '受虐待', text: '跟着哥嫂过日子，睡在牛棚里', pic: 'fangniu', x: 10, y: 94 },
  { step: 2, stage: '分家离开', text: '只要老牛和破车，安了家', pic: 'likai', x: 29, y: 82 },
  { step: 3, stage: '老牛开口', text: '指点他去湖边捡粉红色的纱衣', pic: 'niuhua', x: 49, y: 64 },
  { step: 4, stage: '湖边相识', text: '还纱衣，互诉身世', pic: 'hubian', x: 69, y: 46 },
  { step: 4, stage: '结为夫妻', text: '回到草房，织女见老牛', pic: 'xiangjian', x: 89, y: 38 },
];

/* 选做 · 不可思议的地方 */
const CLUE_LABELS = ['不可思议的情节', '为什么这样编'];
const CLUES = [
  { q: '老牛突然开口说话了，牛郎“并不觉得奇怪”。', a: '动物通人性：牛郎善待老牛，老牛也帮牛郎——好心有好报。' },
  { q: '老牛知道明天黄昏仙女们会到湖边戏水。', a: '老牛不是一头普通的牛。下一课它还会留下一样神奇的东西。' },
  { q: '王母娘娘拿织女织的彩锦装饰天空，那就是灿烂的云霞。', a: '用美丽的想象解释大自然：天上的云霞是织女一梭一梭织出来的。' },
  { q: '《田螺姑娘》：年轻人捡回的田螺，变成姑娘帮他做饭、收拾屋子。', a: '勤劳善良的穷苦人，会得到帮助，过上好日子。' },
];

/* 品读 · 课后第 2 题：创造性复述 */
const RETELL = [
  {
    mode: '把情节说具体',
    items: [
      { name: '牛郎告诉老牛', prompt: '◇ 牛郎常常把看见的、听见的事告诉老牛。他会说些什么？老牛怎样回应？',
        points: ['选一件具体的事：在集市上、山坡上看见的，听见的', '加上牛郎说的话，和老牛的动作神态（摇耳朵、咧嘴笑、眉开眼笑）', '和同桌演一演：一个演牛郎，一个演老牛'],
        start: '傍晚，牛郎牵着老牛从山坡上回来，一边走一边说：“老牛啊，今天我在集市上看见一个卖糖人的老爷爷，捏的小猴子跟真的一样……”老牛摇摇耳朵，闭闭眼……' },
      { name: '仙女们商量', prompt: '◇ 仙女们商量瞒着王母娘娘去人间看看。她们是怎么商量的？',
        points: ['几位仙女各说了什么？有的想去，有的担心', '她们怎样等到机会——王母娘娘喝了葡萄酒直打瞌睡', '织女说了什么？想想她在机房里的苦'],
        start: '夜深了，机房里只剩下梭子的声音。织女停下手，悄悄对姐妹们说：“人人都说天上好，可我们连人间什么样都没见过……”一个仙女连忙往门口望了望：“小声点儿！让外祖母听见可不得了！”' },
    ],
  },
  {
    mode: '换个角色讲',
    items: [
      { name: '老牛的口吻', prompt: '用老牛“我”的口吻，讲讲“我”和牛郎的故事。',
        points: ['“我”眼里的牛郎：怎样照看“我”', '“我”为什么一直不说话，后来又开口了', '讲到“我”看见织女那一刻'],
        start: '我是一头老黄牛。那孩子从小就跟我睡在牛棚里，他给我挑最嫩的青草，牵我去喝最干净的溪水。他说的话，我全听得懂，可我一直没开口……' },
      { name: '织女的口吻', prompt: '用织女的口吻，讲讲她是怎样来到人间、认识牛郎的。',
        points: ['在天上的日子：成天成夜地织彩锦', '溜到人间、在湖里戏水的痛快', '发现纱衣不见了，一个年轻人走出来……'],
        start: '在天上，我的手老在梭子上，一会儿也不许休息。人人都说天上好，可天上有什么好呢？那天下午，外祖母靠在宝座上打起了瞌睡，姐妹们拉着我就往外跑……' },
    ],
  },
  {
    mode: '演一演 · 变顺序',
    items: [
      { name: '演“分家”', prompt: '三人一组，演一演哥哥嫂子和牛郎分家。',
        points: ['哥哥：“装得很亲热的样子”', '嫂子：“三分像笑七分像发狠”', '牛郎：“想了想”，干脆地说“好，我这就走！”'],
        start: '哥哥（拍拍牛郎的肩膀，笑眯眯地）：“兄弟，你如今长大了，也该成家立业了……”' },
      { name: '先讲最神奇的', prompt: '先讲“老牛开口说话”这个最不可思议的地方，设下悬念，再倒回去讲牛郎的身世。',
        points: ['开头：星光下，老牛忽然叫了一声“牛郎”', '再讲：这头老牛是怎么陪牛郎走到今天的', '最后接上老牛说的话和湖边相遇'],
        start: '一天晚上，山前的草房里，忽然有人叫了一声“牛郎”。可草房里只有牛郎和一头老牛啊！原来，是老牛开口说话了。这头老牛和牛郎，可是相依为命的老伙伴……' },
    ],
  },
];

/* 读与写 · 把初次见面写具体（语文园地） */
const MOMENTS = [
  { name: '湖边初次见面', pic: 'hubian',
    prompt: '仿照语文园地的例子，把牛郎织女初次见面的情节写得更具体。',
    hint: '想一想：织女发现纱衣不见了，是什么神情、怎么找？牛郎怎样走出来、怎样说？织女看见牛郎又是什么反应？',
    example: '织女上了岸，往草地上一看，纱衣不见了。她急得东找西找，脸都红了：“哎呀！我的纱衣哪儿去了？”这时，树林里走出一个年轻人，皮肤黑黑的，样子很憨厚。他双手托着纱衣，轻声说：“姑娘，别着急，你的纱衣在这儿。”织女吃了一惊，往后退了一步，见他不像坏人，才接过纱衣，小声说：“谢谢你。”' },
  { name: '老牛开口那一晚', pic: 'niuhua',
    prompt: '把“老牛开口说话”这一段写得更具体：牛郎听见了什么、看见了什么、心里怎么想？',
    hint: '课文写牛郎“并不觉得奇怪”。可以加上牛郎和老牛的对话。',
    example: '“牛郎。”牛郎正要进草房，听见有人叫他。他回头一看，星光下，老牛正望着他，嘴一张一合的。牛郎笑了：“老伙计，我就知道你听得懂我的话！”他蹲下来，摸着老牛的头，等它往下说。' },
  { name: '织女见老牛', pic: 'xiangjian',
    prompt: '织女第一次见到老牛，会说些什么？（口语交际的提示）',
    hint: '课文写织女“拍拍老牛的脖子，用腮帮挨挨它的耳朵”。加上织女的话和老牛的反应。',
    example: '织女走到老牛跟前，拍拍它的脖子，笑着说：“老牛哥哥，谢谢你这些年陪着他。以后，我也会好好照顾你的。”说着，她用腮帮挨了挨老牛的耳朵。老牛眉开眼笑地朝她看，尾巴甩得欢欢的。' },
];

/* 创造性复述：选讲法 → 选角度 → 看要点、听开头 */
function initRetell(box, modes) {
  const state = { m: 0, i: 0 };
  const draw = () => {
    const mode = modes[state.m];
    const it = mode.items[state.i];
    box.innerHTML = `<div class="rt-side">
        <div class="rt-modes">${modes.map((m, k) => `<button type="button" class="btn${k === state.m ? ' solid' : ''}" data-m="${k}">${m.mode}</button>`).join('')}</div>
        <div class="rt-items">${mode.items.map((x, k) => `<button type="button" class="rt-item${k === state.i ? ' on' : ''}" data-i="${k}">${x.name}</button>`).join('')}</div>
      </div>
      <div class="rt-card">
        <p class="rt-prompt">${it.prompt}</p>
        <ul class="rt-points">${it.points.map((p) => `<li>${p}</li>`).join('')}</ul>
        <button type="button" class="btn" data-start>听听开头</button>
        <p class="rt-start" hidden>${it.start}</p>
      </div>`;
  };
  box.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.m !== undefined) { state.m = +b.dataset.m; state.i = 0; draw(); }
    else if (b.dataset.i !== undefined) { state.i = +b.dataset.i; draw(); }
    else if (b.hasAttribute('data-start')) box.querySelector('.rt-start').hidden = false;
  });
  draw();
}

window.LESSON = {
  init() {
    Narrative.init({ plot: PLOT, clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    initRetell(document.getElementById('retell'), RETELL);
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
