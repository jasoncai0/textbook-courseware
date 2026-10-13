'use strict';
/* 小蜗牛 · 本课数据与本课互动。记叙文故事页见 ../shared/narrative.js，低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

/* 小图标（100 × 60） */
const ICON = {
  sprout: '<svg viewBox="0 0 100 60"><path d="M50 58V20M50 36L32 24M50 28L66 16" stroke="#8a6a4a" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="31" cy="21" rx="7" ry="4" fill="#8fd16a"/><ellipse cx="67" cy="13" rx="7" ry="4" fill="#8fd16a"/><ellipse cx="50" cy="16" rx="5" ry="5" fill="#a6e07e"/></svg>',
  tree: '<svg viewBox="0 0 100 60"><path d="M50 58V36" stroke="#8a6a4a" stroke-width="6"/><circle cx="50" cy="22" r="19" fill="#3f9f4b"/><circle cx="35" cy="31" r="12" fill="#4cb85a"/><circle cx="65" cy="31" r="12" fill="#4cb85a"/></svg>',
  berry: '<svg viewBox="0 0 100 60"><path d="M50 56C33 45 31 27 39 20C45 16 55 16 61 20C69 27 67 45 50 56Z" fill="#e2433b"/><path d="M38 20L50 11L62 20L50 17Z" fill="#3f9f4b"/><g fill="#ffd96b"><circle cx="44" cy="28" r="1.6"/><circle cx="55" cy="27" r="1.6"/><circle cx="50" cy="36" r="1.6"/><circle cx="43" cy="40" r="1.6"/><circle cx="57" cy="40" r="1.6"/></g></svg>',
  mush: '<svg viewBox="0 0 100 60"><path d="M74 50C80 40 90 40 94 46C88 48 82 52 74 50Z" fill="#e8b23c"/><path d="M20 34C20 12 76 12 76 34Z" fill="#d9483b"/><rect x="40" y="34" width="16" height="22" rx="5" fill="#f3e6cc"/><circle cx="36" cy="25" r="4" fill="#fff"/><circle cx="56" cy="20" r="4" fill="#fff"/><circle cx="66" cy="29" r="3" fill="#fff"/></svg>',
  snow: '<svg viewBox="0 0 100 60"><g stroke="#6aa7dc" stroke-width="4" stroke-linecap="round"><path d="M50 6V54M29 18L71 42M29 42L71 18"/><path d="M44 10L50 16L56 10M44 50L50 44L56 50"/></g></svg>',
  snail: '<svg viewBox="0 0 100 60"><path d="M14 52H84C84 44 78 42 70 42H24C18 42 14 46 14 52Z" fill="#f2d79a"/><path d="M22 42L16 26M28 42L26 24" stroke="#c9a55a" stroke-width="3" stroke-linecap="round"/><circle cx="56" cy="28" r="19" fill="#e9a7a0"/><path d="M56 28m-3 0a3 3 0 1 1 3 3a7 7 0 1 1 -7 -7a11 11 0 1 1 11 11" fill="none" stroke="#b8665c" stroke-width="3"/></svg>',
};

/* ================= 排一排：小树林一年里的变化（课后第 1 题，对照图画读课文） =================
 * 容器 <div class="order" data-order="key" data-noswipe>；数据 ORDER[key] = [{ t, py, pic | svg }]，按正确顺序写。 */
const ORDER = {
  year: [
    { svg: ICON.sprout, t: '小树发芽了', py: 'xiǎo shù fā yá le' },
    { svg: ICON.tree, t: '小树长满了叶子', py: 'xiǎo shù zhǎng mǎn le yè zi' },
    { svg: ICON.berry, t: '地上长着许多草莓', py: 'dì shàng zhǎng zhe xǔ duō cǎo méi' },
    { svg: ICON.mush, t: '地上长着蘑菇，树叶全变黄了', py: 'dì shàng zhǎng zhe mó gu shù yè quán biàn huáng le' },
    { svg: ICON.snow, t: '地上盖着雪，树叶全掉了', py: 'dì shàng gài zhe xuě shù yè quán diào le' },
  ],
};
function initOrder(box, items) {
  const face = (it) => (it.pic ? `<div class="o-pic" data-bg="assets/${it.pic}.jpg"></div>` : `<div class="o-pic">${it.svg}</div>`);
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
      <div class="order-pool">${shuffled().map((i) => `<button type="button" class="o-card" data-i="${i}">${face(items[i])}<span class="py">${Hanzi.ruby(items[i].t, items[i].py)}</span></button>`).join('')}</div>
      <div class="order-bar"><span class="order-msg">点一点：小蜗牛先看到什么？</span><button type="button" class="btn" data-reset>重新排</button></div>`;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) { build(); return; }
    const card = e.target.closest('.o-card');
    if (!card || card.classList.contains('used')) return;
    card.classList.remove('wrong');
    if (+card.dataset.i !== next) {
      void card.offsetWidth; // 重新触发抖动动画
      card.classList.add('wrong');
      box.querySelector('.order-msg').textContent = '再想想：小蜗牛是先看到这个吗？';
      return;
    }
    const slot = box.querySelectorAll('.o-slot')[next];
    slot.innerHTML = card.innerHTML;
    slot.classList.add('filled');
    card.classList.add('used');
    next += 1;
    const done = next === items.length;
    box.classList.toggle('done', done);
    box.querySelector('.order-msg').textContent = done ? '排好了！春天 → 夏天 → 秋天 → 冬天，一年过去了。' : `对了！接着找第 ${next + 1} 个。`;
  });
  build();
}
document.querySelectorAll('[data-order]').forEach((box) => initOrder(box, ORDER[box.dataset.order]));

/* ================= 课后第 2 题：看图猜加点的字（点一点出拼音） ================= */
const GUESS = [
  { icon: ICON.snail, w: '蜗牛', py: 'wō niú', dot: [0] },
  { icon: ICON.sprout, w: '发芽', py: 'fā yá', dot: [1] },
  { icon: ICON.berry, w: '草莓', py: 'cǎo méi', dot: [1] },
  { icon: ICON.mush, w: '蘑菇', py: 'mó gu', dot: [0, 1] },
];
document.getElementById('guess').innerHTML = GUESS.map((g) => `<button type="button" class="wn-g">
    <span class="wn-ic">${g.icon}</span>
    <span class="wn-w py">${Hanzi.ruby(g.w, g.py)}</span></button>`).join('');
document.querySelectorAll('#guess .wn-g').forEach((btn, i) => {
  btn.querySelectorAll('ruby').forEach((r, k) => r.classList.toggle('dot', GUESS[i].dot.includes(k)));
});
document.getElementById('guess').addEventListener('click', (e) => {
  const btn = e.target.closest('.wn-g');
  if (btn) btn.classList.add('open');
});

Hanzi.init({
  pick: {
    zhang: [
      { q: '长满', py: '_ mǎn', ans: 'zhǎng', opts: ['zhǎng', 'cháng'] },
      { q: '又长又软', py: 'yòu _ yòu ruǎn', ans: 'cháng', opts: ['zhǎng', 'cháng'] },
      { q: '长着', py: '_ zhe', ans: 'zhǎng', opts: ['zhǎng', 'cháng'] },
      { q: '长大', py: '_ dà', ans: 'zhǎng', opts: ['zhǎng', 'cháng'] },
    ],
  },
  cards: [
    { z: '住', py: 'zhù', bs: '亻', bh: 7, words: [['住在', 'zhù zài'], ['记住', 'jì zhù']] },
    { z: '孩', py: 'hái', bs: '子', bh: 9, words: [['孩子', 'hái zi'], ['小孩', 'xiǎo hái']] },
    { z: '玩', py: 'wán', bs: '王', bh: 8, words: [['去玩', 'qù wán'], ['玩具', 'wán jù']] },
    { z: '吧', py: 'ba', bs: '口', bh: 7, words: [['玩吧', 'wán ba'], ['过冬吧', 'guò dōng ba']] },
    { z: '发', py: 'fā', bs: '又', bh: 5, words: [['发芽', 'fā yá'], ['出发', 'chū fā']] },
    { z: '芽', py: 'yá', bs: '艹', bh: 7, words: [['发芽', 'fā yá'], ['豆芽', 'dòu yá']] },
    { z: '爬', py: 'pá', bs: '爪', bh: 8, words: [['爬呀', 'pá ya'], ['爬山', 'pá shān']] },
    { z: '呀', py: 'ya', bs: '口', bh: 7, words: [['爬呀', 'pá ya']] },
    { z: '久', py: 'jiǔ', bs: '丿', bh: 3, words: [['好久', 'hǎo jiǔ'], ['很久', 'hěn jiǔ']] },
    { z: '回', py: 'huí', bs: '囗', bh: 6, words: [['回来', 'huí lái'], ['回家', 'huí jiā']] },
    { z: '全', py: 'quán', bs: '人', bh: 6, words: [['全变黄了', 'quán biàn huáng le'], ['全家', 'quán jiā']] },
    { z: '变', py: 'biàn', bs: '又', bh: 8, words: [['变黄', 'biàn huáng'], ['变化', 'biàn huà']] },
  ],
  shapes: {
    回: ['M50 50C56 44 64 52 58 60C48 70 34 58 40 44C48 28 74 32 74 54C74 80 38 86 26 66C12 42 30 14 58 14'],
    女: ['M60 8C52 30 42 52 28 70', 'M28 70L72 90', 'M22 40C44 42 62 50 78 64', 'M64 38C56 56 46 74 40 94'],
    马: ['M30 10H64L74 22', 'M30 10V66', 'M30 26H52', 'M30 40H52', 'M30 66H72', 'M72 66C82 76 82 86 74 94', 'M30 66L24 92', 'M46 66L46 92'],
  },
  evolve: [
    { z: '回', note: '像水打旋儿，转了一圈又回到原来的地方。' },
    { z: '妈', old: ['女', '马'], note: '左边“女”表示妈妈是女的，右边“马”表示读音（mǎ → mā）。' },
  ],
  apples: [['住', 'zhù'], ['孩', 'hái'], ['玩', 'wán'], ['吧', 'ba'], ['发', 'fā'], ['芽', 'yá'], ['爬', 'pá'], ['呀', 'ya'], ['久', 'jiǔ'], ['回', 'huí'], ['全', 'quán'], ['变', 'biàn']],
  write: [
    { z: '对', py: 'duì', bs: '又', bh: 5 },
    { z: '妈', py: 'mā', bs: '女', bh: 6 },
    { z: '全', py: 'quán', bs: '人', bh: 6 },
    { z: '回', py: 'huí', bs: '囗', bh: 6 },
  ],
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
