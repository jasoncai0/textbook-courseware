'use strict';
/* 小书包 · 本课数据。识字模板见 ../shared/hanzi.js（必须在顶层调用，deck.js 加载前渲染完）
 * 识字 8 在学完拼音之后：可以用“看拼音选字”。 */

/* 课后“我会自己整理书包”：点要带的东西放进书包，不用带的摇头。[词, 拼音, 要不要带] */
const PACK = [
  ['课本', 'kè běn', true], ['皮球', 'pí qiú', false], ['作业本', 'zuò yè běn', true], ['铅笔', 'qiān bǐ', true],
  ['小汽车', 'xiǎo qì chē', false], ['橡皮', 'xiàng pí', true], ['尺子', 'chǐ zi', true], ['零食', 'líng shí', false], ['笔袋', 'bǐ dài', true],
];
function initPack(box) {
  const need = PACK.filter((it) => it[2]).length;
  box.innerHTML = `<div class="sb-items">${PACK.map(([w, py, ok], i) => `<button type="button" class="sb-item" data-i="${i}" data-ok="${ok}"><span class="py" data-py="${py}">${w}</span></button>`).join('')}</div>
    <div class="sb-bag"><p>书包里有 <b>0</b> / ${need} 样</p><div class="sb-in"></div><button type="button" class="btn" data-reset>倒出来</button></div>`;
  const count = box.querySelector('.sb-bag b');
  const bagIn = box.querySelector('.sb-in');
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) {
      box.querySelectorAll('.sb-item').forEach((b) => b.classList.remove('in', 'no'));
      bagIn.innerHTML = '';
      count.textContent = '0';
      box.classList.remove('full');
      return;
    }
    const item = e.target.closest('.sb-item:not(.in)');
    if (!item) return;
    if (item.dataset.ok !== 'true') { item.classList.remove('no'); void item.offsetWidth; item.classList.add('no'); return; }
    item.classList.add('in');
    bagIn.insertAdjacentHTML('beforeend', `<span>${item.innerHTML}</span>`);
    count.textContent = bagIn.children.length;
    box.classList.toggle('full', bagIn.children.length === need);
  });
}
initPack(document.getElementById('pack')); // 在 Hanzi.init 之前生成，好让 data-py 一起注音

Hanzi.init({
  /* 本课补的古字形（示意简笔，100 × 100，一笔一条 path） */
  shapes: {
    刀: ['M36 10H62', 'M62 10C68 44 64 70 40 92', 'M36 10C40 40 38 62 28 78'],
    本: ['M50 8V94', 'M50 30L26 12', 'M50 30L74 12', 'M50 64L26 84', 'M50 64L74 84', 'M34 82H66'],
    早: ['M50 6A17 17 0 1 0 50 40A17 17 0 1 0 50 6', 'M41 23H59', 'M20 62H80', 'M50 40V94'],
  },
  evolve: [
    { z: '刀', note: '像一把刀：上面是刀把，弯弯的是刀刃。' },
    { z: '本', note: '“木”的根上加一横，指树的根——“本”。' },
    { z: '早', note: '上面是太阳，太阳刚刚升起来，就是早上。（帮助记字的说法）' },
  ],
  pick: {
    py: [
      { q: 'shū', ans: '书', opts: ['书', '包', '本'] },
      { q: 'bǐ', ans: '笔', opts: ['本', '笔', '包'] },
      { q: 'zǎo', ans: '早', opts: ['作', '校', '早'] },
      { q: 'dāo', ans: '刀', opts: ['刀', '尺', '力'] },
      { q: 'kè', ans: '课', opts: ['校', '课', '业'] },
      { q: 'xiào', ans: '校', opts: ['校', '早', '书'] },
    ],
  },
  cards: [
    { z: '书', py: 'shū', bs: '乙', bh: 4, words: [['书包', 'shū bāo'], ['读书', 'dú shū']] },
    { z: '包', py: 'bāo', bs: '勹', bh: 5, words: [['书包', 'shū bāo'], ['面包', 'miàn bāo']] },
    { z: '尺', py: 'chǐ', bs: '尸', bh: 4, words: [['尺子', 'chǐ zi'], ['直尺', 'zhí chǐ']] },
    { z: '作', py: 'zuò', bs: '亻', bh: 7, words: [['作业', 'zuò yè'], ['工作', 'gōng zuò']] },
    { z: '业', py: 'yè', bs: '业', bh: 5, words: [['作业本', 'zuò yè běn']] },
    { z: '本', py: 'běn', bs: '木', bh: 5, words: [['课本', 'kè běn'], ['本子', 'běn zi']] },
    { z: '笔', py: 'bǐ', bs: '竹', bh: 10, words: [['铅笔', 'qiān bǐ'], ['笔袋', 'bǐ dài']] },
    { z: '刀', py: 'dāo', bs: '刀', bh: 2, words: [['转笔刀', 'zhuàn bǐ dāo'], ['小刀', 'xiǎo dāo']] },
    { z: '课', py: 'kè', bs: '讠', bh: 10, words: [['上课', 'shàng kè'], ['下课', 'xià kè']] },
    { z: '早', py: 'zǎo', bs: '日', bh: 6, words: [['早上', 'zǎo shang'], ['起得早', 'qǐ de zǎo']] },
    { z: '校', py: 'xiào', bs: '木', bh: 10, words: [['学校', 'xué xiào'], ['校园', 'xiào yuán']] },
  ],
  /* 拖字配图：x / y 按 assets/wenju.jpg 的实际构图（已对照生成图） */
  match: {
    wenju: {
      bg: 'assets/wenju.jpg',
      items: [
        { z: '橡皮', x: 22, y: 37, hint: 'xiàng pí' }, { z: '尺子', x: 48, y: 22, hint: 'chǐ zi' }, { z: '作业本', x: 48, y: 45, hint: 'zuò yè běn' },
        { z: '笔袋', x: 25, y: 65, hint: 'bǐ dài' }, { z: '铅笔', x: 46, y: 74, hint: 'qiān bǐ' }, { z: '转笔刀', x: 62, y: 70, hint: 'zhuàn bǐ dāo' },
      ],
    },
  },
  write: [
    { z: '早', py: 'zǎo', bs: '日', bh: 6 },
    { z: '书', py: 'shū', bs: '乙', bh: 4 },
    { z: '刀', py: 'dāo', bs: '刀', bh: 2 },
    { z: '尺', py: 'chǐ', bs: '尸', bh: 4 },
    { z: '本', py: 'běn', bs: '木', bh: 5 },
  ],
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
