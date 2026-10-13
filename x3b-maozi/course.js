'use strict';
/* 方帽子店 · 本课数据与本课互动。通用逻辑见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 了解主要内容：排一排 */
const ORDER = {
  story: [
    { pic: 'jieshang', t: '方帽子店只做方帽子，大家都戴，真不舒服' },
    { pic: 'zhimao', t: '孩子们用纸、用布做出了舒服的圆帽子' },
    { icon: '😲', t: '店主人的儿子也戴上圆帽子，一溜烟跑了' },
    { pic: 'liangjia', t: '对面开了新帽子店，顾客都进了新店' },
    { icon: '🏺', t: '世界在改变，方帽子慢慢成为古董' },
  ],
};

/* 阅读提示：最意想不到的部分（背面是复述提示） */
const CLUE_LABELS = ['意想不到的部分', '用自己的话讲一讲'];
const CLUES = [
  { q: '“方帽子才是好帽子，不能改的。”——戴着不舒服，大家却都戴方帽子。', a: '先说方帽子戴着怎么不舒服（紧、宽、冬天不暖、夏天热），再说大人们为什么还要戴。' },
  { q: '方帽子店主人自己的儿子，也戴了一顶圆帽子！', a: '按顺序讲：店主人看见 → 抓起圆帽子丢在地上 → 儿子嚷嚷“我要” → 儿子戴上帽子跑了。加上他们说话的语气。' },
  { q: '顾客们看了好久，最后还是进了新帽子店。', a: '讲清两张广告写了什么，顾客怎样犹豫，最后为什么选了新帽子店。' },
  { q: '那些不舒服的方帽子，慢慢地成为古董。', a: '从满街都是方帽子讲起，讲到行人都换了舒服的帽子，最后方帽子成了没人戴的古董。' },
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
