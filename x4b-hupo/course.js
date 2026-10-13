'use strict';
/* 琥珀 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，提问—解决卡见 wenjie.js，翻页引擎见 ../shared/deck.js
 * 本课专属：拖动时间滑块看琥珀形成（几万年前 → 今天）、排一排复述、推测依据翻卡、课文与阅读链接左右对读。
 */

/* 课后第 2 题：时间滑块（每一档一个画面） */
const ERAS = [
  ['几万年前 · 夏日', '一个夏日，太阳火热，老松树渗出厚厚的松脂。小苍蝇停在树干上，蜘蛛慢慢爬过来。'],
  ['那天晌午', '一大滴松脂从树上滴下来，刚好落在树干上，把苍蝇和蜘蛛一齐包在里头。'],
  ['几十年、几百年', '松脂继续滴下来，盖住了原来的，最后积成一个松脂球。'],
  ['后来', '陆地渐渐沉下去，海水漫上来，把森林淹没了。树腐烂了，只剩下松脂球。'],
  ['又是几千年', '松脂球淹没在泥沙下面，又过了几千年，成了化石——琥珀。'],
  ['今天', '波涛把泥沙卷到岸边，渔民的儿子在海滩上把它挖了出来。'],
];
function initTime() {
  const svg = document.getElementById('timeSvg');
  const range = document.getElementById('tmRange');
  const era = document.getElementById('tmEra');
  const cap = document.getElementById('tmCap');
  const show = () => {
    const i = +range.value;
    svg.setAttribute('class', `t${i}`);
    era.textContent = ERAS[i][0];
    cap.innerHTML = `<b>${i + 1}</b>${ERAS[i][1]}`;
  };
  range.addEventListener('input', show);
  show();
}

/* 排一排：按顺序点卡片（items 按正确顺序给出，页面上固定打乱） */
function initOrder(box, items, doneText) {
  const keys = [...items.keys()];
  const shuffled = [...keys.filter((i) => i % 2).reverse(), ...keys.filter((i) => !(i % 2))];
  box.innerHTML = shuffled.map((i) => `<button class="order-card" type="button" data-i="${i}"><em></em>${items[i]}</button>`).join('');
  const msg = document.createElement('p');
  msg.className = 'order-msg';
  msg.textContent = '先点第 1 步。';
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
    card.style.order = next;
    card.querySelector('em').textContent = next;
    const done = next === items.length;
    box.classList.toggle('all-done', done);
    msg.textContent = done ? doneText : `对了！接着点第 ${next + 1} 步。`;
  });
}
const STEPS = ['松脂从树上滴下来', '把苍蝇和蜘蛛一齐包在里头', '松脂继续滴，积成松脂球', '海水淹没森林，松脂球埋在泥沙下', '几千年后，松脂球成了化石', '渔民的儿子在海滩上挖了出来'];

/* 课后第 3 题：推测的依据 */
const CLUES = [
  { q: '晌午的太阳热辣辣地照射着整个树林。许多老松树渗出厚厚的松脂……', a: '琥珀是松脂变成的。天热，松脂才会大量渗出来、往下流——所以推测那是一个火热的夏日晌午。' },
  { q: '一大滴松脂从树上滴下来，刚好落在树干上，把苍蝇和蜘蛛一齐包在里头。', a: '琥珀里同时有一只苍蝇和一个蜘蛛，挨得很近——说明它们是被同一滴松脂一起包住的。' },
  { q: '它们前俯后仰地挣扎了一番，终于不动了。', a: '它们的腿的四周显出好几圈黑色的圆环——这是挣扎时留下的痕迹。' },
  { q: '后来，陆地渐渐沉下去，海水渐渐漫上来……', a: '松树长在陆地上，琥珀却是在海滩的沙里挖到的——说明后来这里被海水淹没了。' },
];

/* 课后第 1 题：提问—解决卡 */
const WENJIE = {
  hupo: {
    items: [
      { q: '课文为什么说“从那块琥珀，我们可以推测发生在几万年前的故事的详细情形”？', k: 'nr', how: ['sx'], a: '联系最后一段：琥珀里有苍蝇和蜘蛛，腿四周有黑色圆环……根据这些，就能推出当时发生了什么。' },
      { q: '“拂拭”是什么意思？', k: 'ci', how: ['sx', 'zl'], a: '查字典：“拂”是轻轻擦过，“拭”是擦。联系上下文，小苍蝇在擦它的圆脑袋。' },
      { q: '松脂球为什么会变成化石？', k: 'nr', how: ['zl', 'qj'], a: '查资料（阅读链接）：树脂被埋在地下，在高温和高压下慢慢变硬，最后石化成了琥珀。' },
      { q: '课文是讲琥珀的，为什么要像讲故事一样写苍蝇和蜘蛛？', k: 'xf', how: ['qj', 'sx'], a: '和同学、老师讨论：用故事来讲科学知识，读起来生动有趣，更容易记住。' },
      { q: '“黏稠的黄色泪珠”指的是什么？', k: 'ci', how: ['sx'], a: '联系上下文：“一大滴松脂从树上滴下来”——黄色泪珠就是松脂，像老松树流的眼泪。' },
    ],
  },
};

/* 课后第 4 题：课文与阅读链接对读 */
const LINKS = [
  ['许多老松树渗出厚厚的松脂，松脂在太阳光里闪闪地发出金黄的光。', '树干上分泌出了黄色透明的树脂，它们便是琥珀的前身。从树干分泌出来的树脂带着浓浓的香味，可以流动。'],
  ['剩下的只有那些松脂球，淹没在泥沙下面。', '树脂被砂泥等沉积物掩埋后，地下深处的高温和高压，导致树脂中的有机物挥发，树脂变成了硬树脂。'],
  ['又是几千年过去了，那些松脂球成了化石。', '在高温和高压的持续作用下，硬树脂中的有机物进一步挥发，硬树脂最终石化形成了琥珀。'],
];
function initLink() {
  const a = document.getElementById('linkA');
  const b = document.getElementById('linkB');
  const show = (i) => {
    document.querySelectorAll('#linkBtns .btn').forEach((x, k) => x.classList.toggle('solid', k === i));
    [a.textContent, b.textContent] = LINKS[i];
  };
  document.getElementById('linkBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-l]');
    if (btn) show(+btn.dataset.l);
  });
  show(0);
}

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: ['推测', '依据'] });
    WenJie.init(WENJIE);
    initTime();
    initOrder(document.getElementById('hpOrder'), STEPS, '排好了！再试着不看卡片讲一遍。');
    initLink();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
