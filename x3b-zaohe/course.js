'use strict';
/* 枣核 · 本课数据与本课互动。通用逻辑见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 品读：小枣核的本领（背面是本领用在哪儿） */
const CLUE_LABELS = ['枣核的本领', '用在哪儿了'];
const CLUES = [
  { q: '🌾 <b>勤快</b>：能扶犁，能赶驴，柴比别人打得多', a: '天天干活，学了很多本领，邻居们都夸他，爹娘非常高兴。' },
  { q: '🦘 <b>会蹦</b>：一蹦就能蹦到屋脊那么高', a: '一蹦蹦进县衙门的院子；在大堂上打这面蹦到那面，怎么也打不着。' },
  { q: '🤏 <b>人小</b>：只有枣核那么大', a: '藏在驴耳朵里吆喝，衙役们搜不着；从铁链缝里蹦了出来。' },
  { q: '💡 <b>聪明勇敢</b>：“大家都不用愁，我有办法！”', a: '半夜牵回牲口；敢站出来说“牲口是我牵的”；蹦到县官胡子上荡秋千，让县官吃了亏。' },
];

/* 复述：排一排 */
const ORDER = {
  story: [
    { icon: '👶', t: '夫妻俩生了个枣核那么大的孩子，叫“枣核”' },
    { pic: 'benling', t: '枣核很勤快，学了很多本领，一蹦能蹦到屋脊高' },
    { icon: '🐂', t: '大旱年，衙役把庄稼人的牛、驴都牵走了' },
    { pic: 'lvduo', t: '枣核藏在驴耳朵里吆喝，把牲口赶回了村子' },
    { pic: 'huzi', t: '大堂上枣核蹦来蹦去，县官吃了亏，枣核大摇大摆地走了' },
  ],
};

/* 续编故事 */
const MOMENTS = [
  {
    name: '县官又来了', pic: 'huzi',
    prompt: '县官的牙被打掉了，他咽不下这口气，又派衙役到村里来抓枣核……',
    hint: '枣核会怎样对付他们？想想他“小”“会蹦”“聪明”的本领。',
    example: '衙役们挨家挨户地搜，连米缸都翻遍了，也没找到枣核。原来枣核早就蹦到了领头衙役的帽子里，一会儿揪揪他的头发，一会儿在他耳边喊“哦喝”，吓得衙役们扔下刀枪就跑……',
  },
  {
    name: '帮助乡亲', pic: 'benling',
    prompt: '这一年又遇上了大旱，地里没有水，庄稼都快干死了……',
    hint: '枣核会想出什么好办法？他会去哪里、怎么做？',
    example: '枣核一蹦蹦上了山顶，发现山那边有一眼清泉。他一边蹦一边喊，带着大伙儿开出一条小水沟，清凉的泉水哗哗地流进了田里……',
  },
  {
    name: '我来编', pic: 'lvduo',
    prompt: '枣核大摇大摆地走了。后来，他还会遇到什么事？自己编一编。',
    hint: '先想好：遇到了什么难事 → 枣核怎样用本领解决 → 结果怎样。',
    example: '有一天，枣核在路上遇到一个迷路的小孩，他一蹦蹦到大树顶上，看清了回村的路……',
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
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    document.querySelectorAll('[data-order]').forEach((box) => initOrder(box, ORDER[box.dataset.order]));
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
