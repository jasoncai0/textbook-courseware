'use strict';
/* 驿路梨花 · 本课数据与本课独有的“主人猜测”“讲述顺序”“梨花花瓣”。通用页面逻辑见 ../shared/narrative.js */

/* 故事页右上角：当前对“主人”的猜测（slide 或字幕行上写 data-guess） */
function buildGuess() {
  const box = document.createElement('div');
  box.className = 'guess';
  box.id = 'guess';
  document.getElementById('frame').appendChild(box);
}
function updateGuess(slide, step) {
  const box = document.getElementById('guess');
  let g = slide.dataset.guess;
  slide.querySelectorAll('[data-guess][data-step]').forEach((el) => { if (+el.dataset.step <= step) g = el.dataset.guess; });
  box.classList.toggle('show', g !== undefined);
  if (g === undefined) return;
  if (box.dataset.g !== g) {
    box.dataset.g = g;
    box.innerHTML = `<small>小茅屋的主人是——</small><b>${g}</b>`;
    box.classList.remove('flip');
    void box.offsetWidth; // 重新触发翻牌动画
    box.classList.add('flip');
  }
}

/* 讲述顺序 vs 发生顺序：tell / time 为两种顺序中的序号 */
const EVENTS = [
  { t: '“我”和老余天黑赶路，在梨树林边借宿小茅屋', tell: 1, time: 5 },
  { t: '瑶族老人送粮来：“我不是主人，也是过路人”', tell: 2, time: 6 },
  { t: '上个月，瑶族老人迷路借宿，在门上插羽毛', tell: 3, time: 4, back: true },
  { t: '第二天，大家修葺小茅屋', tell: 4, time: 7 },
  { t: '哈尼小姑娘们来了：“房子是解放军叔叔盖的”', tell: 5, time: 8 },
  { t: '十多年前，解放军盖起小茅屋', tell: 6, time: 1, back: true },
  { t: '梨花常来照料小茅屋', tell: 7, time: 2, back: true },
  { t: '梨花出嫁，妹妹接过任务', tell: 8, time: 3, back: true },
];
function showOrder(mode) {
  const list = [...EVENTS].sort((a, b) => a[mode] - b[mode]);
  document.getElementById('events').innerHTML = list.map((e) => `<li class="${e.back ? 'back' : ''}">${e.t}${e.back && mode === 'tell' ? '<em>插叙</em>' : ''}</li>`).join('');
  document.querySelectorAll('.s-order [data-mode]').forEach((b) => b.classList.toggle('solid', b.dataset.mode === mode));
}
function initOrder() {
  document.querySelector('.s-order .btns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-mode]');
    if (b) showOrder(b.dataset.mode);
  });
  showOrder('tell');
}

/* 梨花的四重含义 */
const FLOWER = [
  { k: '自然景物：梨花林', t: '“看，梨花！”白色梨花开满枝头——梨花林引出小茅屋，也是美丽的环境。' },
  { k: '人物：梨花姑娘', t: '“对门山头上有个名叫梨花的哈尼小姑娘”——照料小茅屋的人。' },
  { k: '精神：助人为乐', t: '“多好的梨花啊！”——这里的梨花，是梨花姑娘，更是她身上为人民服务、助人为乐的精神。' },
  { k: '诗句：驿路梨花处处开', t: '借陆游的诗句，象征这种精神像梨花一样在驿路上处处开放、代代相传。' },
];
function initFlower() {
  const note = document.getElementById('flowerNote');
  document.querySelector('.lihua-svg').addEventListener('click', (e) => {
    const p = e.target.closest('.petal');
    if (!p) return;
    const f = FLOWER[+p.dataset.i];
    document.querySelectorAll('.lihua-svg .petal').forEach((x) => x.classList.toggle('sel', x === p));
    p.classList.add('seen');
    note.innerHTML = `<b>${f.k}</b><br>${f.t}`;
  });
}

/* 读写迁移 */
const MOMENTS = [
  {
    name: '补写：梨花第一次来', pic: 'guniang',
    prompt: '课文只用一句话写梨花姐姐“很受感动”。补写她第一次来照料小茅屋的情景。',
    hint: '她带来了什么？做了什么？“请进”两个字是不是她写的？抓住动作和心理。',
    example: '雨停了，梨花背着一捆干柴，拎着一小袋米，沿着山路来到小茅屋。她把柴码在屋后，把米挂到梁上的竹筒里，又从溪边担来清水，倒满大竹筒。临走，她捡起一块黑炭，在门板上一笔一画地写下：“请进！”',
  },
  {
    name: '给小茅屋留言', pic: 'wunei',
    prompt: '假如你是一位过路人，在小茅屋住了一夜，临走时给主人留几句话。',
    hint: '想想瑶族老人插的红布和羽毛：用了什么、补了什么、想说什么。',
    example: '不知名的主人：昨夜赶路天黑，在这里吃了热饭、睡了好觉。屋后的柴我又砍了一捆，米也添满了。谢谢你，也谢谢每一位守护这间小屋的人。——一个过路人',
  },
  {
    name: '身边的“梨花”', pic: 'lihua',
    prompt: '联系现实，说说你身边的“公德”故事，或者你看到的不讲公德的现象。',
    hint: '如：图书角的书、共享雨伞、公共场所的饮水机……“用了补上，好让后来人方便。”',
    example: '我们班的图书角没人看管，可书从来不少。有同学借走一本，还回来时总会多放一本自己的书。这和小茅屋“用了补上”的规矩，是一样的道理。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    buildGuess();
    initOrder();
    initFlower();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateGuess(slide, step);
  },
};
