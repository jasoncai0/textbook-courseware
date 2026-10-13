'use strict';
/* 在牛肚子里旅行 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课专属：红头的旅行路线（按顺序点对一站，路线图画出一段）。
 */

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

/* 课后第 3 题：路线，第 k 项对应路线图上的 .r{k} */
const ROUTE = ['和草一起被卷到牛嘴里', '吞进第一个胃', '到了第二个胃', '又回到了牛嘴里', '随着喷嚏喷出来'];

function lightRoute(k) {
  document.querySelectorAll(`#cowMap .r${k}`).forEach((el) => el.classList.add('on'));
}

/* 品读 · 情节（起因 → 经过 → 结果） */
const PLOT = [
  { step: 1, stage: '起因', text: '捉迷藏时，红头被大黄牛卷进嘴里', pic: 'zhuomicang', x: 10, y: 92 },
  { step: 2, stage: '经过', text: '青头蹦到牛身上，被尾巴扫下来', pic: 'zhuomicang', pos: '70% 40%', x: 28, y: 76 },
  { step: 2, stage: '经过', text: '红头进了牛肚子，青头隔着肚皮鼓励它', pic: 'niudu', x: 47, y: 60 },
  { step: 3, stage: '经过', text: '红头从第二个胃回到牛嘴里', pic: 'niudu', pos: '70% 40%', x: 66, y: 44 },
  { step: 3, stage: '结果', text: '青头蹭牛鼻孔，“阿嚏！”红头被喷了出来', pic: 'penti', x: 84, y: 36 },
];

/* 课后第 2 题：好朋友的证据 */
const PICKS = {
  friends: [
    { t: '青头大吃一惊，它一下子蹦到牛身上。', ok: true, why: '马上去救朋友' },
    { t: '红头向周围看了看，悄悄地躲在一个草堆里不作声了。', ok: false, why: '这是在玩捉迷藏' },
    { t: '青头不顾身上的疼痛，一骨碌爬起来，大声喊……', ok: true, why: '顾不上自己疼' },
    { t: '青头又跳到牛身上，隔着肚皮和红头说话。', ok: true, why: '一直陪着、鼓励朋友' },
    { t: '“你是勇敢的蟋蟀，你一定能出来的。”', ok: true, why: '给朋友打气' },
    { t: '正在这时，一头大黄牛从红头后面慢慢走过来。', ok: false, why: '这是写危险来了' },
    { t: '青头爬到牛鼻子上，用它的身体在牛鼻孔里蹭来蹭去。', ok: true, why: '想办法救出朋友' },
    { t: '红头看见自己的朋友，高兴得流下了眼泪：“谢谢你……”', ok: true, why: '红头感激朋友' },
  ],
};

window.LESSON = {
  init() {
    Narrative.init({ plot: PLOT, picks: PICKS });
    initOrder(document.getElementById('routeOrder'), ROUTE, '路线画好了！牛嘴 → 第一个胃 → 第二个胃 → 牛嘴 → 喷出来。', lightRoute);
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
