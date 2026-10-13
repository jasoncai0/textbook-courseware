'use strict';
/* 那一定会很好 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* ================= 排一排：按顺序点卡片（items 按正确顺序给出，页面上打乱显示；onRight(i) 第 i 项点对时回调） ================= */
function initOrder(box, items, doneText, onRight) {
  // 打乱顺序：奇数项倒着排在前，偶数项排在后（固定顺序，每次上课一样）
  const keys = [...items.keys()];
  const shuffled = [...keys.filter((i) => i % 2).reverse(), ...keys.filter((i) => !(i % 2))].map((i) => ({ t: items[i], i }));
  box.innerHTML = shuffled.map(({ t, i }) => `<button class="order-card" type="button" data-i="${i}"><em></em>${t}</button>`).join('');
  const msg = document.createElement('p');
  msg.className = 'order-msg';
  msg.textContent = `按顺序点一点：先点第 1 个。`;
  box.after(msg);
  let next = 0;
  box.addEventListener('click', (e) => {
    const card = e.target.closest('.order-card');
    if (!card || card.classList.contains('right')) return;
    card.classList.remove('wrong');
    void card.offsetWidth; // 重新触发抖动动画
    if (+card.dataset.i !== next) { card.classList.add('wrong'); return; }
    next += 1;
    card.classList.add('right');
    card.querySelector('em').textContent = next;
    if (onRight) onRight(next - 1);
    const done = next === items.length;
    box.classList.toggle('all-done', done);
    msg.textContent = done ? doneText : `对了！接着点第 ${next + 1} 个。`;
  });
}

const JOURNEY = ['种子', '树', '手推车', '椅子', '木地板'];

/* 题目：哪几句里有“那一定会很好” */
const PICKS = {
  hao: [
    { t: '“这真难受。”种子想，“我一定要站起来，大口大口地呼吸空气，那一定会很好。”', ok: true, why: '种子的心愿' },
    { t: '“要是能做一棵会跑的树，那一定会很好。”树这么想着。', ok: true, why: '树的心愿' },
    { t: '跑起来的时候，手推车听到耳边呼呼的风声，真舒服。', ok: false, why: '这是心愿实现了' },
    { t: '“要是我能停下来，坐着休息一会儿，那一定会很好。”', ok: true, why: '手推车的心愿' },
    { t: '“要是我能躺下，那一定会很好。”', ok: true, why: '椅子的心愿' },
    { t: '木地板满意地舒展着身子，躺在阳台上，阳光照在身上，暖洋洋的，舒服极了。', ok: false, why: '它已经很满意了' },
  ],
};

/* 想象：如果你是它，还会有什么心愿 */
const MOMENTS = [
  {
    name: '木地板', pic: 'diban',
    prompt: '木地板躺在阳台上，舒服极了。很多年以后，它也许又会有新的心愿。它会想什么？',
    hint: '想一想：木地板每天看到什么、听到什么？它会羡慕谁？',
    example: '木地板每天看着阳台上的花开了又谢。“要是我也能开出一朵花，那一定会很好。”',
  },
  {
    name: '手推车', pic: 'tuiche',
    prompt: '手推车年轻的时候，在山路上跑来跑去，听到呼呼的风声。那时候，它会不会也有别的心愿？',
    hint: '它每天驮着谷子、土豆和调皮的儿子……',
    example: '手推车看见天上的鸟飞过。“要是我能飞起来，带着小主人去看看山那边，那一定会很好。”',
  },
  {
    name: '我自己', pic: 'shu',
    prompt: '你有没有这样想过：“要是……那一定会很好。”说一说你的心愿，再想想它实现以后会怎样。',
    hint: '可以是一个小小的心愿，也可以是一个童话一样的心愿。',
    example: '要是我能变成一只小鸟，飞到奶奶家去，那一定会很好。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    initOrder(document.getElementById('journeyOrder'), JOURNEY, '排对了！种子 → 树 → 手推车 → 椅子 → 木地板。');
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
