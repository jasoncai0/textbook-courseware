'use strict';
/* 日月水火 · 本课数据。识字模板见 ../shared/hanzi.js（必须在顶层调用，deck.js 加载前渲染完）
 * 识字 4 在学拼音之前：游戏用看图、古字形，不用“看拼音选字”。古字形是示意简笔。 */

Hanzi.init({
  /* 本课补的古字形（示意简笔，100 × 100，一笔一条 path）；日 月 水 火 山 田 禾 木 用共享的 */
  shapes: {
    石: ['M12 16H86', 'M42 16C36 40 28 58 14 78', 'M44 56H76V86H44Z'],
    兔: ['M38 10C34 22 36 32 42 38', 'M50 8C54 20 52 30 46 38', 'M44 36A9 9 0 1 0 44 54A9 9 0 1 0 44 36', 'M40 54C28 66 30 88 52 88C72 88 74 70 62 56', 'M74 78A4 4 0 1 0 74 86A4 4 0 1 0 74 78'],
    鸟: ['M30 20A8 8 0 1 0 30 36A8 8 0 1 0 30 20', 'M22 26L10 30L22 32', 'M37 32C60 30 80 44 88 62C68 64 50 62 38 52C32 46 32 38 37 32', 'M52 62V86', 'M62 62V86'],
    竹: ['M30 18V92', 'M30 18L14 42', 'M30 18L44 38', 'M70 18V92', 'M70 18L56 42', 'M70 18L86 38'],
    羊: ['M50 42C42 18 22 14 18 30', 'M50 42C58 18 78 14 82 30', 'M50 42V92', 'M32 60H68', 'M36 76H64'],
    网: ['M16 10V90', 'M84 10V90', 'M16 22L84 78', 'M84 22L16 78', 'M16 50H84'],
  },
  evolve: {
    a: [
      { z: '日', note: '像圆圆的太阳，中间一点表示太阳在发光。' },
      { z: '月', note: '像一弯月亮。月亮常常是弯弯的。' },
      { z: '水', note: '像弯弯曲曲流动的河水，两边是水花。' },
      { z: '火', note: '像燃烧的火苗，往上蹿。' },
    ],
    b: [
      { z: '山', note: '像连在一起的三座山峰。' },
      { z: '石', note: '像山崖下面的一块石头。' },
      { z: '田', note: '像一块块方方正正的田地，中间是田埂。' },
      { z: '禾', note: '像一棵禾苗，顶上的穗子弯了下来。' },
    ],
  },
  pick: {
    old: [
      { old: '日', ans: '日', opts: ['月', '日', '田'] },
      { old: '山', ans: '山', opts: ['山', '石', '水'] },
      { old: '月', ans: '月', opts: ['日', '目', '月'] },
      { old: '田', ans: '田', opts: ['田', '日', '口'] },
      { old: '水', ans: '水', opts: ['火', '水', '木'] },
      { old: '禾', ans: '禾', opts: ['木', '禾', '火'] },
      { old: '火', ans: '火', opts: ['水', '山', '火'] },
      { old: '石', ans: '石', opts: ['石', '田', '山'] },
    ],
    lian: [
      { old: '羊', ans: '羊', opts: ['兔', '羊', '鸟'] },
      { old: '鸟', ans: '鸟', opts: ['鸟', '竹', '网'] },
      { old: '兔', ans: '兔', opts: ['羊', '木', '兔'] },
      { old: '木', ans: '木', opts: ['木', '竹', '禾'] },
      { old: '网', ans: '网', opts: ['羊', '网', '鸟'] },
      { old: '竹', ans: '竹', opts: ['兔', '木', '竹'] },
    ],
  },
  cards: [
    { z: '日', py: 'rì', bs: '日', bh: 4, words: [['日出', 'rì chū'], ['红日', 'hóng rì']] },
    { z: '月', py: 'yuè', bs: '月', bh: 4, words: [['月亮', 'yuè liang'], ['日月', 'rì yuè']] },
    { z: '水', py: 'shuǐ', bs: '水', bh: 4, words: [['河水', 'hé shuǐ'], ['山水', 'shān shuǐ']] },
    { z: '火', py: 'huǒ', bs: '火', bh: 4, words: [['火苗', 'huǒ miáo'], ['大火', 'dà huǒ']] },
    { z: '山', py: 'shān', bs: '山', bh: 3, words: [['大山', 'dà shān'], ['山上', 'shān shàng']] },
    { z: '石', py: 'shí', bs: '石', bh: 5, words: [['石头', 'shí tou'], ['山石', 'shān shí']] },
    { z: '田', py: 'tián', bs: '田', bh: 5, words: [['田地', 'tián dì'], ['水田', 'shuǐ tián']] },
    { z: '禾', py: 'hé', bs: '禾', bh: 5, words: [['禾苗', 'hé miáo'], ['田禾', 'tián hé']] },
  ],
  /* 拖字配图：x / y 按 assets/dongwu.jpg 的实际构图（已对照生成图） */
  match: {
    /* dongwu.jpg 是三列两行六格：羊 鸟 兔 / 木 网 竹；圆圈放在每格右下角，不挡住东西 */
    dongwu: {
      bg: 'assets/dongwu.jpg',
      items: [{ z: '羊', x: 27, y: 40 }, { z: '鸟', x: 61, y: 40 }, { z: '兔', x: 94, y: 40 }, { z: '木', x: 27, y: 90 }, { z: '网', x: 61, y: 90 }, { z: '竹', x: 94, y: 90 }],
    },
  },
  write: [
    { z: '日', py: 'rì', bs: '日', bh: 4 },
    { z: '田', py: 'tián', bs: '田', bh: 5 },
    { z: '禾', py: 'hé', bs: '禾', bh: 5 },
    { z: '火', py: 'huǒ', bs: '火', bh: 4 },
  ],
});

/* 找一找：画里藏着的字，点中就变大，数一数找到几个 */
(() => {
  const box = document.getElementById('find');
  const out = box.closest('.slide').querySelector('.fd-n');
  box.addEventListener('click', (e) => {
    const z = e.target.closest('.fd-z:not(.found)');
    if (!z) return;
    z.classList.add('found');
    out.textContent = box.querySelectorAll('.found').length;
  });
})();

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
