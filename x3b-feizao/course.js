'use strict';
/* 肥皂泡 · 本课数据与“排一排”。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 品读 · 课后第 1 题：按顺序点卡片（ORDER 是正确顺序，SHUFFLE 是卡片摆放顺序） */
const ORDER = [
  '把用剩的碎肥皂<b>放</b>在小木碗里',
  '<b>加</b>上点儿水，<b>和弄</b>和弄，使它溶化',
  '用竹笔套管<b>蘸</b>上黏稠的肥皂水',
  '慢慢地<b>吹</b>起，吹成网球大小的泡儿',
  '轻轻地一<b>提</b>，球儿落下来，在空中飘游',
  '用扇子在下面轻轻地<b>扇送</b>，飞得很高',
];
const SHUFFLE = [3, 0, 5, 2, 4, 1];

function initOrder() {
  const pool = document.getElementById('orderPool');
  const slots = document.getElementById('orderSlots');
  let next = 0;
  const reset = () => {
    next = 0;
    slots.innerHTML = ORDER.map(() => '<li></li>').join('');
    pool.innerHTML = SHUFFLE.map((i) => `<button class="order-card" type="button" data-i="${i}">${ORDER[i]}</button>`).join('');
  };
  pool.addEventListener('click', (e) => {
    const card = e.target.closest('.order-card');
    if (!card || card.classList.contains('used')) return;
    if (+card.dataset.i !== next) {
      card.classList.remove('no');
      void card.offsetWidth; // 重新触发抖动动画
      card.classList.add('no');
      return;
    }
    const slot = slots.children[next];
    slot.innerHTML = ORDER[next];
    slot.classList.add('filled');
    card.classList.add('used');
    next += 1;
  });
  document.getElementById('orderReset').addEventListener('click', reset);
  reset();
}

/* 品读 · 课后第 2 题：不容易读懂的句子 */
const CLUE_LABELS = ['这句话是什么意思？', '我读懂了'];
const CLUES = [
  { q: '这脆薄的球，会扯成长圆的形式，颤巍巍的，光影零乱。', a: '泡泡吹得太大、扇得太急，被拉成了长圆形，一抖一抖的，上面的彩光乱成一片——快要破了。（想象画面）' },
  { q: '这时大家都悬着心，仰着头，屏住呼吸。', a: '大家都抬头盯着泡泡，紧张得不敢喘气，怕它破了。（做做动作，体会心情）' },
  { q: '那一个个轻清脆丽的小球，像一串美丽的梦。', a: '泡泡又轻又亮、又美又容易破，就像美丽的梦一样。（联系生活：梦也是美丽又短暂的）' },
  { q: '目送着她们，我心里充满了快乐、骄傲与希望。', a: '泡泡是“我”亲手吹起来的，飞得又高又远，“我”很高兴、很自豪，也盼着它们飞到更远的地方。（联系上文）' },
];

/* 品读 · 课后第 3 题：小球还有哪些美丽的去处 */
const MOMENTS = [
  {
    name: '飞进教室', pic: 'feiqi',
    prompt: '借着扇子的轻风，一个小泡泡飘进了教室……它会落到哪里？',
    hint: '学着课文，用上“轻轻地”“轻悠悠地”“低低地”。',
    example: '一个小泡泡轻悠悠地飘进教室，在黑板前转了一个圈，又低低地落下，落到一个正在认真写字的小女孩的铅笔尖上……',
  },
  {
    name: '落在花瓣上', pic: 'langzi',
    prompt: '雨停了，小泡泡飘过院子里的花丛……',
    hint: '想一想花园里有什么：花瓣、露珠、蝴蝶……',
    example: '或者轻轻地飘过花丛，和蝴蝶比一比谁飞得更美，又低低地落下，落到一片沾着雨珠的花瓣上，和露珠做了好朋友……',
  },
  {
    name: '飞向星星', pic: 'mengxiang',
    prompt: '到了夜里，小泡泡越飞越高……',
    hint: '课文写了明月、天河、夕阳，你还能想到什么？',
    example: '到夜空中，轻轻地碰一碰星星，向月亮里的桂花树打个招呼，再乘着流星，飞到宇宙的另一边去……',
  },
  {
    name: '飘到远方', pic: 'mengxiang',
    prompt: '小泡泡飘过大海、山巅，还会飘到谁的身边？',
    hint: '可以是远方的亲人、山里的小朋友……',
    example: '或者飘过一座座大山，落到山里小学的窗台上，让那里的小朋友也看看——这是从很远很远的地方飞来的一个美丽的梦。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    initOrder();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
