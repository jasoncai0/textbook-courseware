'use strict';
/* 慢性子裁缝和急性子顾客 · 本课数据与本课互动。通用逻辑见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 复述：按时间排一排 */
const ORDER = {
  days: [
    { pic: 'jindian', t: '顾客要做棉袄，裁缝说明年冬天才能取' },
    { icon: '🧥', t: '顾客要拽掉棉花，改成秋天穿的夹袄' },
    { pic: 'jianxiu', t: '顾客要剪去袖子，改成夏天穿的短袖衬衫' },
    { pic: 'dengyan', t: '顾客要改成春装，裁缝说还没开始裁料呢' },
  ],
};

/* 品读：急还是慢 */
const KINDS = ['急性子顾客', '慢性子裁缝'];
const SORT_ITEMS = [
  { s: '我已经跑了三家裁缝店了……我可等不及，都没让他们做。', ok: ['急性子顾客'], q: '跑了三家都嫌慢' },
  { s: '“不过，我指的是明年冬天。”', ok: ['慢性子裁缝'], q: '做件棉袄要一年' },
  { s: '顾客噌的一下子跳起来：“这么慢啊！”', ok: ['急性子顾客'], q: '动作急：噌的一下子' },
  { s: '“师傅，把我那夹袄的袖子剪去一截儿……我实在等不及了。”', ok: ['急性子顾客'], q: '一天改一次主意' },
  { s: '“因为您的布在我的柜子里搁着，我还没开始裁料呢。”', ok: ['慢性子裁缝'], q: '几天过去，还没动手' },
];

/* 说一说 · 选做 */
const MOMENTS = [
  {
    name: '顾客会说什么', pic: 'dengyan',
    prompt: '顾客惊讶、恼怒地瞪大了眼睛！此时，这位顾客会说些什么呢？',
    hint: '想一想：他跑了好几趟，改了好几次，原来布还在柜子里！他会怎么说？语气怎样？',
    example: '“什么？！我跑了四趟，您连剪刀都没动？哎呀呀，我这急性子，碰上您这慢性子，真是急死我了！”',
  },
  {
    name: '假如性子换一换', pic: 'jindian',
    prompt: '假如裁缝是急性子，顾客是慢性子，他们之间又会发生怎样的故事呢？发挥想象，讲一讲。',
    hint: '可以这样想：慢性子顾客想明年冬天再穿，急性子裁缝却一个晚上就做好了，天天催他来取……',
    example: '慢性子顾客慢吞吞地说：“师傅，我想做件棉袄，明年冬天穿就行。”话还没说完，急性子裁缝已经量好了尺寸，咔嚓咔嚓剪起了布……第二天一早，他就跑到顾客家敲门：“您的棉袄做好啦，快来取吧！”',
  },
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
    Narrative.init({ kinds: KINDS, sort: SORT_ITEMS, moments: MOMENTS });
    document.querySelectorAll('[data-order]').forEach((box) => initOrder(box, ORDER[box.dataset.order]));
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
