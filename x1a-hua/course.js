'use strict';
/* 画 · 本课数据。识字模板见 ../shared/hanzi.js（必须在顶层调用，deck.js 加载前渲染完）
 * 识字 6 在学完拼音之后：可以用“看拼音选字”。 */

Hanzi.init({
  /* 本课补的古字形（示意简笔）：来 像一棵麦子 */
  shapes: {
    来: ['M34 16Q50 2 66 16', 'M50 8V92', 'M50 40L22 54', 'M50 40L78 54', 'M50 78L30 94', 'M50 78L70 94'],
  },
  evolve: [
    { z: '山', note: '像连在一起的三座山峰。' },
    { z: '水', note: '像弯弯曲曲流动的河水。' },
    { z: '来', note: '古字像一棵麦子：上面是麦穗，中间是叶子，下面是根。' },
  ],
  pick: {
    /* 找反义词：q 是诗里的字，拼音学过了，题面带注音 */
    fan: [
      { q: '远', py: 'yuǎn', ans: '近', opts: ['近', '来', '有'] },
      { q: '有', py: 'yǒu', ans: '无', opts: ['还', '无', '色'] },
      { q: '去', py: 'qù', ans: '来', opts: ['在', '听', '来'] },
    ],
    py: [
      { q: 'yuǎn', ans: '远', opts: ['近', '远', '还'] },
      { q: 'tīng', ans: '听', opts: ['听', '声', '色'] },
      { q: 'shēng', ans: '声', opts: ['色', '声', '听'] },
      { q: 'hái', ans: '还', opts: ['还', '来', '去'] },
      { q: 'wú', ans: '无', opts: ['有', '去', '无'] },
      { q: 'sè', ans: '色', opts: ['色', '声', '在'] },
    ],
  },
  cards: [
    { z: '远', py: 'yuǎn', bs: '辶', bh: 7, words: [['远看', 'yuǎn kàn'], ['远近', 'yuǎn jìn']] },
    { z: '有', py: 'yǒu', bs: '月', bh: 6, words: [['有色', 'yǒu sè'], ['没有', 'méi yǒu']] },
    { z: '色', py: 'sè', bs: '色', bh: 6, words: [['红色', 'hóng sè'], ['颜色', 'yán sè']] },
    { z: '近', py: 'jìn', bs: '辶', bh: 7, words: [['近听', 'jìn tīng'], ['远近', 'yuǎn jìn']] },
    { z: '听', py: 'tīng', bs: '口', bh: 7, words: [['听见', 'tīng jiàn'], ['好听', 'hǎo tīng']] },
    { z: '无', py: 'wú', bs: '一', bh: 4, words: [['无声', 'wú shēng'], ['有无', 'yǒu wú']] },
    { z: '声', py: 'shēng', bs: '士', bh: 7, words: [['声音', 'shēng yīn'], ['水声', 'shuǐ shēng']] },
    { z: '去', py: 'qù', bs: '土', bh: 5, words: [['春去', 'chūn qù'], ['出去', 'chū qù']] },
    { z: '还', py: 'hái', bs: '辶', bh: 7, words: [['还在', 'hái zài'], ['还有', 'hái yǒu']] },
    { z: '来', py: 'lái', bs: '一', bh: 7, words: [['人来', 'rén lái'], ['来去', 'lái qù']] },
  ],
  write: [
    { z: '水', py: 'shuǐ', bs: '水', bh: 4 },
    { z: '去', py: 'qù', bs: '土', bh: 5 },
    { z: '来', py: 'lái', bs: '一', bh: 7 },
    { z: '不', py: 'bù', bs: '一', bh: 4 },
  ],
});

/* 钓鱼：鱼在池塘里游，点一条鱼钓进小桶，桶里显示字和拼音 */
const FISH = [['远', 'yuǎn'], ['有', 'yǒu'], ['色', 'sè'], ['近', 'jìn'], ['听', 'tīng'], ['无', 'wú'], ['声', 'shēng'], ['去', 'qù'], ['还', 'hái'], ['来', 'lái']];
function initPond(box, list) {
  box.innerHTML = `<div class="fi-pond">${list.map(([z], i) => `<button type="button" class="fi-fish" data-i="${i}" style="--row:${i % 4};--d:-${(i * 1.7) % 9}s;--t:${9 + (i % 3) * 2}s"><b>${z}</b></button>`).join('')}</div>
    <div class="fi-bucket"><p>小桶里有 <b>0</b> 条</p><div class="fi-in"></div><button type="button" class="btn" data-reset>放回池塘</button></div>`;
  const count = box.querySelector('.fi-bucket b');
  const bucket = box.querySelector('.fi-in');
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) {
      box.querySelectorAll('.fi-fish').forEach((f) => f.classList.remove('caught'));
      bucket.innerHTML = '';
      count.textContent = '0';
      return;
    }
    const fish = e.target.closest('.fi-fish:not(.caught)');
    if (!fish) return;
    const [z, py] = list[+fish.dataset.i];
    fish.classList.add('caught');
    bucket.insertAdjacentHTML('beforeend', `<span>${Hanzi.ruby(z, py)}</span>`);
    count.textContent = bucket.children.length;
  });
}
initPond(document.getElementById('pond'), FISH);

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
