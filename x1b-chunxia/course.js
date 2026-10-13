'use strict';
/* 春夏秋冬 · 本课数据。识字组件见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

/* 四季滑一滑（本课独有）：滑块 0–3 对应 assets/siji.jpg 的四段，配风、雨、霜、雪的动效 */
const SIJI = [
  { k: 'chun', z: '春', w: '春风吹', py: 'chūn fēng chuī', say: '柳枝摆一摆，春风轻轻吹。' },
  { k: 'xia', z: '夏', w: '夏雨落', py: 'xià yǔ luò', say: '雨点哗哗地，落进池塘里。' },
  { k: 'qiu', z: '秋', w: '秋霜降', py: 'qiū shuāng jiàng', say: '早上一层白霜，降在红叶上。' },
  { k: 'dong', z: '冬', w: '冬雪飘', py: 'dōng xuě piāo', say: '雪花一片片，飘呀飘下来。' },
];
const FLAKES = 26;
const STRIP_POS = [1.5, 33.8, 66.2, 98.5]; // 背景放大 440%，每段居中、不露出旁边一段

function initSiji(box) {
  const r = Hanzi.ruby;
  const fx = Array.from({ length: FLAKES }, (_, i) => `<i style="left:${(i * 37) % 100}%;animation-delay:${((i * 0.37) % 3).toFixed(2)}s"></i>`).join('');
  box.innerHTML = `<div class="cx-view" data-bg="assets/siji.jpg"><div class="cx-fx">${fx}</div></div>
    <div class="cx-side">
      <p class="cx-word"></p><p class="cx-say"></p>
      <input type="range" class="cx-range" min="0" max="3" step="1" value="0" aria-label="季节">
      <div class="cx-btns">${SIJI.map((s, i) => `<button type="button" class="btn" data-i="${i}">${r(s.z, s.py.split(' ')[0])}</button>`).join('')}</div>
    </div>`;
  const view = box.querySelector('.cx-view');
  const range = box.querySelector('.cx-range');
  const show = (i) => {
    const s = SIJI[i];
    range.value = i;
    box.dataset.season = s.k;
    view.style.backgroundPosition = `${STRIP_POS[i]}% 50%`;
    box.querySelector('.cx-word').innerHTML = r(s.w, s.py);
    box.querySelector('.cx-say').textContent = s.say;
    box.querySelectorAll('.cx-btns .btn').forEach((b) => b.classList.toggle('solid', +b.dataset.i === i));
  };
  range.addEventListener('input', () => show(+range.value));
  box.addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) show(+b.dataset.i); });
  show(0);
}
document.querySelectorAll('[data-siji]').forEach(initSiji);

Zuzi.init({});

Hanzi.init({
  /* 古字形简笔（示意），100 × 100，一笔一条 */
  shapes: {
    雨: ['M12 14H88', 'M18 30V90', 'M18 30H82V90', 'M50 14V58', 'M32 44L36 54', 'M32 66L36 76', 'M64 44L68 54', 'M64 66L68 76'],
    鱼: ['M50 10C30 26 30 58 50 70C70 58 70 26 50 10', 'M42 30H58', 'M40 44H60', 'M50 70L30 92H70Z', 'M34 40L20 50', 'M66 40L80 50'],
    鸟: ['M34 12A10 10 0 1 0 34 32A10 10 0 1 0 34 12', 'M25 20L10 24L25 27', 'M42 28C68 28 84 48 76 64C66 78 42 74 36 56', 'M50 46L70 52', 'M76 62L92 82', 'M48 72V92', 'M60 72V92'],
  },
  evolve: [
    { z: '雨', note: '上面一横是天，下面是一点一点落下来的雨。' },
    { z: '鱼', note: '像一条鱼：有头、有鱼鳞、有尾巴。' },
    { z: '鸟', note: '像一只鸟：尖尖的嘴、圆圆的身子，下面是爪子。' },
  ],
  /* 拖词配图：x / y 按 assets 里的构图估（图生成后核对） */
  match: {
    siji: { bg: 'assets/siji.jpg', items: [{ z: '春风', x: 14, y: 42, hint: 'chūn fēng' }, { z: '夏雨', x: 37, y: 30, hint: 'xià yǔ' }, { z: '秋霜', x: 62, y: 62, hint: 'qiū shuāng' }, { z: '冬雪', x: 88, y: 30, hint: 'dōng xuě' }] },
    chijing: { bg: 'assets/chijing.jpg', items: [{ z: '青草', x: 22, y: 92, hint: 'qīng cǎo' }, { z: '红花', x: 14, y: 40, hint: 'hóng huā' }, { z: '游鱼', x: 50, y: 64, hint: 'yóu yú' }, { z: '飞鸟', x: 64, y: 20, hint: 'fēi niǎo' }] },
  },
  pick: {
    dong: [
      { q: '春风', py: 'chūn fēng', ans: '吹', opts: ['吹', '落', '降', '飘'] },
      { q: '夏雨', py: 'xià yǔ', ans: '落', opts: ['飘', '落', '吹', '降'] },
      { q: '秋霜', py: 'qiū shuāng', ans: '降', opts: ['落', '吹', '降', '飘'] },
      { q: '冬雪', py: 'dōng xuě', ans: '飘', opts: ['降', '飘', '落', '吹'] },
    ],
  },
  cards: [
    { z: '霜', py: 'shuāng', bs: '雨', bh: 17, words: [['秋霜', 'qiū shuāng'], ['白霜', 'bái shuāng']] },
    { z: '吹', py: 'chuī', bs: '口', bh: 7, words: [['春风吹', 'chūn fēng chuī'], ['吹气', 'chuī qì']] },
    { z: '落', py: 'luò', bs: '艹', bh: 12, words: [['夏雨落', 'xià yǔ luò'], ['落叶', 'luò yè']] },
    { z: '降', py: 'jiàng', bs: '阝', bh: 8, words: [['秋霜降', 'qiū shuāng jiàng'], ['下降', 'xià jiàng']] },
    { z: '飘', py: 'piāo', bs: '风', bh: 15, words: [['冬雪飘', 'dōng xuě piāo'], ['飘落', 'piāo luò']] },
    { z: '游', py: 'yóu', bs: '氵', bh: 12, words: [['游鱼', 'yóu yú'], ['游水', 'yóu shuǐ']] },
    { z: '池', py: 'chí', bs: '氵', bh: 6, words: [['池草', 'chí cǎo'], ['水池', 'shuǐ chí']] },
    { z: '入', py: 'rù', bs: '入', bh: 2, words: [['鸟入林', 'niǎo rù lín'], ['出入', 'chū rù']] },
  ],
  write: {
    a: [
      { z: '春', py: 'chūn', bs: '日', bh: 9 },
      { z: '冬', py: 'dōng', bs: '夂', bh: 5 },
      { z: '风', py: 'fēng', bs: '风', bh: 4 },
      { z: '雪', py: 'xuě', bs: '雨', bh: 11 },
    ],
    b: [
      { z: '花', py: 'huā', bs: '艹', bh: 7 },
      { z: '飞', py: 'fēi', bs: '乙', bh: 3 },
      { z: '入', py: 'rù', bs: '入', bh: 2 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
