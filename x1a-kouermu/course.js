'use strict';
/* 口耳目 · 本课数据。识字模板见 ../shared/hanzi.js（必须在顶层调用，deck.js 加载前渲染完）
 * 识字 3 在学拼音之前：游戏用看图、古字形、老师读题孩子点，不用“看拼音选字”。 */

/* 看图选字：把 assets/shenti.jpg 放大 z 倍，镜头对准图上 (cx%, cy%)（已对照生成图） */
const crop = (cx, cy, z = 5) => {
  const p = (c) => `${Math.min(100, Math.max(0, ((c / 100 - 0.5 / z) / (1 - 1 / z)) * 100)).toFixed(1)}%`;
  return { pic: 'assets/shenti.jpg', pos: `${p(cx)} ${p(cy)}`, size: `${z * 100}%` };
};

Hanzi.init({
  /* 本课补的古字形（示意简笔，100 × 100，一笔一条 path） */
  shapes: {
    耳: ['M36 12C72 4 88 40 70 62C62 72 58 84 48 90', 'M36 12V82', 'M48 32C62 30 66 46 54 52'],
    手: ['M50 94C53 70 50 40 52 8', 'M51 28L30 14', 'M51 28L72 14', 'M51 48L24 38', 'M51 48L78 38'],
    足: ['M50 10A15 15 0 1 0 50 40A15 15 0 1 0 50 10', 'M50 40V86', 'M50 64H74', 'M30 58V86', 'M14 86H86'],
    土: ['M12 86H88', 'M50 22C36 34 36 64 50 72C64 64 64 34 50 22'],
  },
  evolve: {
    a: [
      { z: '口', note: '像一张张开的嘴巴。' },
      { z: '耳', note: '像一只耳朵，有耳廓，还有耳朵眼。' },
      { z: '目', note: '像一只眼睛，中间是眼珠。' },
    ],
    b: [
      { z: '手', note: '像一只张开五个手指的手。' },
      { z: '足', note: '上面圆圆的像膝盖，下面像脚。' },
      { z: '坐', old: ['人', '人', '土'], note: '两个人面对面坐在土上，就是“坐”。（帮助记字的说法）' },
    ],
  },
  pick: {
    old: [
      { old: '目', ans: '目', opts: ['口', '目', '耳'] },
      { old: '手', ans: '手', opts: ['手', '足', '木'] },
      { old: '口', ans: '口', opts: ['目', '口', '日'] },
      { old: '耳', ans: '耳', opts: ['耳', '手', '目'] },
      { old: '足', ans: '足', opts: ['手', '口', '足'] },
    ],
    zhi: [
      { ...crop(50, 22), ans: '目', opts: ['目', '口', '耳'] },
      { ...crop(50, 28), ans: '口', opts: ['耳', '口', '目'] },
      { ...crop(57, 24), ans: '耳', opts: ['口', '目', '耳'] },
      { ...crop(60, 31, 4), ans: '手', opts: ['足', '手', '口'] },
      { ...crop(50, 89, 4), ans: '足', opts: ['手', '目', '足'] },
    ],
    shi: [
      { q: '看蝴蝶', py: 'kàn hú dié', ans: '目', opts: ['口', '目', '足'] },
      { q: '听声音', py: 'tīng shēng yīn', ans: '耳', opts: ['耳', '手', '口'] },
      { q: '说说话', py: 'shuō shuo huà', ans: '口', opts: ['目', '足', '口'] },
      { q: '拍皮球', py: 'pāi pí qiú', ans: '手', opts: ['手', '耳', '目'] },
      { q: '走走路', py: 'zǒu zou lù', ans: '足', opts: ['口', '足', '耳'] },
    ],
  },
  cards: [
    { z: '口', py: 'kǒu', bs: '口', bh: 3, words: [['口耳目', 'kǒu ěr mù'], ['人口', 'rén kǒu']] },
    { z: '耳', py: 'ěr', bs: '耳', bh: 6, words: [['耳朵', 'ěr duo'], ['木耳', 'mù ěr']] },
    { z: '目', py: 'mù', bs: '目', bh: 5, words: [['耳目', 'ěr mù'], ['目光', 'mù guāng']] },
    { z: '手', py: 'shǒu', bs: '手', bh: 4, words: [['手足', 'shǒu zú'], ['小手', 'xiǎo shǒu']] },
    { z: '足', py: 'zú', bs: '足', bh: 7, words: [['手足', 'shǒu zú'], ['足球', 'zú qiú']] },
    { z: '站', py: 'zhàn', bs: '立', bh: 10, words: [['站如松', 'zhàn rú sōng'], ['站立', 'zhàn lì']] },
    { z: '坐', py: 'zuò', bs: '土', bh: 7, words: [['坐如钟', 'zuò rú zhōng'], ['坐下', 'zuò xià']] },
  ],
  write: [
    { z: '口', py: 'kǒu', bs: '口', bh: 3 },
    { z: '目', py: 'mù', bs: '目', bh: 5 },
    { z: '耳', py: 'ěr', bs: '耳', bh: 6 },
    { z: '手', py: 'shǒu', bs: '手', bh: 4 },
  ],
});

/* 字卡翻翻乐：正面古字形（示意），点一下翻到今字。放在 Hanzi.init 之后，好用上本课补的古字形 */
function initFlip(box, list) {
  const svg = (z) => `<svg class="hz-old" viewBox="0 0 100 100">${Hanzi.OLD[z].map((d) => `<path d="${d}" pathLength="1"/>`).join('')}</svg>`;
  box.innerHTML = list.map((z) => `<button type="button" class="fl-card" aria-label="翻卡"><span class="fl-face fl-front">${svg(z)}<small>猜一猜</small></span><span class="fl-face fl-back"><span class="hz-tzg">${z}</span></span></button>`).join('');
  box.addEventListener('click', (e) => {
    const card = e.target.closest('.fl-card');
    if (card) card.classList.toggle('on');
  });
}
initFlip(document.getElementById('flip'), ['耳', '足', '口', '手', '目']);

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
