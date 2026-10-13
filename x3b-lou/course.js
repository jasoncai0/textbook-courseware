'use strict';
/* 漏 · 本课数据与本课互动。通用逻辑见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 课后第 3 题：按地点变化排一排（文字是课本示意图里的提示） */
const ORDER = {
  places: [
    { icon: '🏠', t: '屋里：老公公老婆婆说“漏”，吓跑了虎和贼。' },
    { icon: '🛤️', t: '山路：虎驮着贼，贼骑着虎。' },
    { icon: '🌳', t: '老树：虎甩掉贼，贼蹿上树。虎和贼树下相遇，滚下山坡。' },
    { icon: '⛰️', t: '山坡：虎和贼以为对方就是“漏”，都吓昏了过去。' },
    { icon: '🏡', t: '屋里：老公公老婆婆再说“漏”。' },
  ],
};

/* 课后第 1 题：最有意思的内容 */
const CLUE_LABELS = ['有意思的地方', '有意思在哪里'];
const CLUES = [
  { q: '老虎驮着贼，贼骑着老虎，跑哇，跑哇……', a: '一个想甩掉“漏”，一个不敢松手——两个“坏蛋”都被吓坏了，还以为是对方在欺负自己。' },
  { q: '老虎一边往前跑一边想：“终于甩掉‘漏’了！”贼一边往上爬一边想：“终于甩掉‘漏’了！”', a: '两个想的一模一样，都松了一口气，其实谁也没被“漏”抓住。' },
  { q: '他俩对看了一眼，同时惊恐地大喊：“‘漏’哇——”', a: '面对面看见了，还是以为对方是“漏”，一起吓昏过去，真好笑！' },
  { q: '唉，说怕漏，偏就又漏雨了！', a: '老虎和贼闹了一夜，小胖驴安安稳稳，老公公老婆婆只是担心屋顶漏雨——结尾一下子揭开了谜底。' },
];

/* ================= 排一排（复述工具，三下第八单元各课相同） =================
 * 容器 <div class="order" data-order="key" data-noswipe>；数据 ORDER[key] = [{ t, pic | icon }]，按正确顺序写。
 * 学生按先后顺序点卡片，点对了卡片落进格子，点错了抖一下；排完后照着格子讲故事。 */
function initOrder(box, items) {
  const face = (it) => (it.pic ? `<div class="o-pic" data-bg="assets/${it.pic}.jpg"></div>` : `<div class="o-pic"><i>${it.icon || ''}</i></div>`);
  const shuffled = () => {
    const idx = items.map((_, i) => i).sort(() => Math.random() - 0.5);
    return idx.every((v, i) => v === i) ? [...idx.slice(1), idx[0]] : idx;
  };
  let next = 0;
  const build = () => {
    next = 0;
    box.classList.remove('done');
    box.style.setProperty('--n', items.length);
    box.innerHTML = `<div class="order-slots">${items.map((_, i) => `<div class="o-slot" data-n="${i + 1}"></div>`).join('')}</div>
      <div class="order-pool">${shuffled().map((i) => `<button type="button" class="o-card" data-i="${i}">${face(items[i])}<span>${items[i].t}</span></button>`).join('')}</div>
      <div class="order-bar"><span class="order-msg">点一点：先发生的先点。</span><button type="button" class="btn" data-reset>重新排</button></div>`;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) { build(); box.querySelectorAll('[data-bg]').forEach(showBg); return; }
    const card = e.target.closest('.o-card');
    if (!card || card.classList.contains('used')) return;
    card.classList.remove('wrong');
    if (+card.dataset.i !== next) {
      void card.offsetWidth; // 重新触发抖动动画
      card.classList.add('wrong');
      box.querySelector('.order-msg').textContent = '再想想：这件事是先发生的吗？';
      return;
    }
    const slot = box.querySelectorAll('.o-slot')[next];
    slot.innerHTML = card.innerHTML;
    slot.classList.add('filled');
    card.classList.add('used');
    next += 1;
    const done = next === items.length;
    box.classList.toggle('done', done);
    box.querySelector('.order-msg').textContent = done ? '排好了！看着格子，按顺序讲一讲。' : `对了！接着找第 ${next + 1} 件事。`;
  });
  build();
}
// 重新排时卡片是新生成的，图片直接显示（这时已经在当前页，不需要再按需加载）
function showBg(el) { el.style.backgroundImage = `url('${el.dataset.bg}')`; el.removeAttribute('data-bg'); }

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS });
    document.querySelectorAll('[data-order]').forEach((box) => initOrder(box, ORDER[box.dataset.order]));
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
